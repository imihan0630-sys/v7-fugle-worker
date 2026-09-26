// Research-only Class-A prototype.
// HISTORY_SOURCE_REVALIDATION_V2
// No Worker.js dependency. No Formal decision impact.
//
// Design:
// 1) Market-session continuity is only a cheap SUSPICION trigger.
// 2) A suspicious cache is re-fetched from Fugle with adjusted=false.
// 3) A freshly fetched provider series is validated as an ACTUAL-BAR sequence:
//    unique, ordered, no future bars, at least N prior bars. It is NOT required to
//    contain every market session, because suspensions / no-transaction sessions
//    can legitimately create calendar gaps.
// 4) Provider failure/ambiguous data fails closed. No stale fallback into Formal.

function validDate(value){
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value||""));
}

function n(value){
  if(value===null||value===undefined) return null;
  const v=Number(String(value).replaceAll(",","").trim());
  return Number.isFinite(v)?v:null;
}

function getSymbol(row){
  return String(row?.Code ?? row?.SecuritiesCompanyCode ?? row?.["證券代號"] ?? row?.["代號"] ?? "").trim();
}

function getClose(row){
  return n(row?.ClosingPrice ?? row?.Close ?? row?.["收盤價"] ?? row?.["收盤"]);
}

function getVolume(row){
  return n(row?.TradeVolume ?? row?.TradingShares ?? row?.["成交股數"] ?? row?.["成交量"]);
}

function getValue(row){
  return n(row?.TradeValue ?? row?.TransactionAmount ?? row?.["成交金額"] ?? row?.["成交金額(元)"]);
}

function getTransactions(row){
  return n(row?.Transaction ?? row?.Transactions ?? row?.["成交筆數"] ?? row?.["成交筆數(筆)"]);
}

export function extractRawTradedSymbolPresence(rawRows=[]){
  const traded=new Set();
  for(const row of Array.isArray(rawRows)?rawRows:[]){
    const symbol=getSymbol(row);
    if(!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const close=getClose(row);
    const volume=getVolume(row);
    const value=getValue(row);
    const tx=getTransactions(row);
    // Presence truth is deliberately BEFORE Formal price/security eligibility filters.
    // A valid price plus any positive transaction evidence is treated as an actual bar.
    const actualTrade = close!==null && ((volume??0)>0 || (value??0)>0 || (tx??0)>0);
    if(actualTrade) traded.add(symbol);
  }
  return traded;
}

export function buildFugleRawDailyUrl({symbol,from,to}){
  if(!/^[1-9][0-9]{3}$/.test(String(symbol||""))) throw new Error("INVALID_SYMBOL");
  if(!validDate(from)||!validDate(to)||from>to) throw new Error("INVALID_DATE_RANGE");
  return "https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/"+encodeURIComponent(symbol)+
    "?from="+encodeURIComponent(from)+"&to="+encodeURIComponent(to)+
    "&timeframe=D&adjusted=false&fields=open,high,low,close,volume,turnover,change&sort=asc";
}

function normalizedDates(history,marketDate,{allowTargetDate=true}={}){
  if(!Array.isArray(history)) return {ok:false,reason:"HISTORY_NOT_ARRAY",dates:[]};
  const dates=[];
  for(const item of history){
    const date=String(item?.date||"").slice(0,10);
    if(!validDate(date)) return {ok:false,reason:"INVALID_BAR_DATE",dates,barDate:date||null};
    dates.push(date);
  }
  for(let i=1;i<dates.length;i+=1){
    if(dates[i]===dates[i-1]) return {ok:false,reason:"DUPLICATE_BAR_DATE",dates,barDate:dates[i]};
    if(dates[i]<dates[i-1]) return {ok:false,reason:"OUT_OF_ORDER_BAR_DATE",dates,previousDate:dates[i-1],barDate:dates[i]};
  }
  const future=dates.find(d=>d>marketDate);
  if(future) return {ok:false,reason:"FUTURE_BAR_DATE",dates,barDate:future};
  if(!allowTargetDate && dates.includes(marketDate)) return {ok:false,reason:"TARGET_DATE_BAR_NOT_ALLOWED",dates};
  return {ok:true,reason:null,dates};
}

export function assessCachedHistoryForRevalidation({
  history,marketDate,marketSessions,requiredPriorBars=60
}){
  const required=Math.max(1,Math.floor(Number(requiredPriorBars)||60));
  if(!validDate(marketDate)) return {status:"UNKNOWN",usable:false,needsRefetch:true,reason:"INVALID_MARKET_DATE"};
  const normalized=normalizedDates(history,marketDate,{allowTargetDate:true});
  if(!normalized.ok) return {status:"REVALIDATE",usable:false,needsRefetch:true,reason:normalized.reason};
  const prior=normalized.dates.filter(d=>d<marketDate);
  if(prior.length<required) return {
    status:"REVALIDATE",usable:false,needsRefetch:true,reason:"INSUFFICIENT_PRIOR_BARS",
    observedPriorBars:prior.length,requiredPriorBars:required
  };
  const sessions=[...new Set((Array.isArray(marketSessions)?marketSessions:[])
    .map(String).filter(validDate).filter(d=>d<marketDate))].sort();
  if(!sessions.length) return {status:"UNKNOWN",usable:false,needsRefetch:true,reason:"MARKET_SESSION_PROOF_UNAVAILABLE"};
  const expectedLatest=sessions.at(-1);
  const recentPrior=prior.slice(-required);
  const recentMarket=sessions.slice(-required);
  const latestPrior=recentPrior.at(-1);
  const exactMarketSessionShape = recentMarket.length===required &&
    recentPrior.length===required &&
    recentPrior.every((d,i)=>d===recentMarket[i]);
  if(latestPrior===expectedLatest && exactMarketSessionShape){
    return {
      status:"CACHE_FAST_PATH_VALID",usable:true,needsRefetch:false,reason:null,
      latestPriorDate:latestPrior,expectedLatestMarketSession:expectedLatest,requiredPriorBars:required
    };
  }
  return {
    status:"REVALIDATE",usable:false,needsRefetch:true,
    reason:latestPrior!==expectedLatest?"LATEST_BAR_NOT_PREVIOUS_MARKET_SESSION":"MARKET_SESSION_SHAPE_DIFFERS",
    latestPriorDate:latestPrior||null,expectedLatestMarketSession:expectedLatest,
    // Important: this is only suspicion. It is NOT proof of stale data.
    // Natural no-trade / suspension gaps can produce the same shape.
    strictCalendarMismatchIsOnlySuspicion:true
  };
}

export function validateFreshProviderHistory({
  history,marketDate,requiredPriorBars=60,adjustedRequested
}){
  const required=Math.max(1,Math.floor(Number(requiredPriorBars)||60));
  if(adjustedRequested!==false) return {
    status:"UNKNOWN",usable:false,reason:"RAW_PRICE_SEMANTICS_NOT_PINNED"
  };
  const normalized=normalizedDates(history,marketDate,{allowTargetDate:true});
  if(!normalized.ok) return {status:"DATA_INCOMPLETE",usable:false,reason:normalized.reason};
  const prior=normalized.dates.filter(d=>d<marketDate);
  if(prior.length<required) return {
    status:"DATA_INCOMPLETE",usable:false,reason:"INSUFFICIENT_FRESH_PROVIDER_PRIOR_BARS",
    observedPriorBars:prior.length,requiredPriorBars:required
  };
  // No market-session-continuity requirement here by design.
  // Fresh provider gaps may be legitimate suspension/no-transaction sessions.
  return {
    status:"VALID_FRESH_PROVIDER_SERIES",usable:true,reason:null,
    priorBars:prior.length,latestPriorDate:prior.at(-1),requiredPriorBars:required,
    actualBarSequence:true,calendarGapDoesNotImplyStale:true
  };
}

export function decideHistoryAdmission({
  cachedHistory,freshHistory,marketDate,marketSessions,requiredPriorBars=60,
  todayOfficialTraded=true,freshFetchStatus="NOT_ATTEMPTED",adjustedRequested
}){
  if(todayOfficialTraded!==true){
    return {
      status:"NOT_IN_TODAY_TRADED_UNIVERSE",usable:false,needsRefetch:false,
      reason:"NO_CURRENT_OFFICIAL_TRADED_BAR"
    };
  }
  const cached=assessCachedHistoryForRevalidation({
    history:cachedHistory,marketDate,marketSessions,requiredPriorBars
  });
  if(cached.usable){
    return {status:"USE_CACHE_FAST_PATH",usable:true,source:"CACHE",cached};
  }
  if(freshFetchStatus!=="SUCCESS"){
    return {
      status:"UNKNOWN",usable:false,source:null,reason:"FRESH_PROVIDER_REVALIDATION_FAILED",
      cached,freshFetchStatus
    };
  }
  const fresh=validateFreshProviderHistory({
    history:freshHistory,marketDate,requiredPriorBars,adjustedRequested
  });
  if(!fresh.usable){
    return {status:fresh.status,usable:false,source:null,reason:fresh.reason,cached,fresh};
  }
  return {
    status:"USE_FRESH_PROVIDER_REPAIR",usable:true,source:"FRESH_PROVIDER_RAW",
    repaired:true,cached,fresh
  };
}


// V2.1: fresh-provider bars are not trusted blindly.
// Reconcile only the market-session dates that are absent from the fresh provider's
// required rolling window against complete official raw daily rows, BEFORE Formal filters.

export function buildOfficialSymbolGapReceipt({
  market,date,symbol,rawRows,sourceStatus="COMPLETE",minimumRows
}){
  if(!["TWSE","TPEx"].includes(String(market||""))) return {status:"UNKNOWN",reason:"INVALID_MARKET"};
  if(!validDate(date)||!/^[1-9][0-9]{3}$/.test(String(symbol||""))) return {status:"UNKNOWN",reason:"INVALID_RECEIPT_KEY"};
  if(sourceStatus!=="COMPLETE") return {status:"UNKNOWN",reason:"OFFICIAL_SOURCE_INCOMPLETE",market,date,symbol};
  if(!Array.isArray(rawRows)) return {status:"UNKNOWN",reason:"OFFICIAL_ROWS_NOT_ARRAY",market,date,symbol};
  const symbols=rawRows.map(getSymbol).filter(s=>/^[1-9][0-9]{3}$/.test(s));
  const unique=new Set(symbols);
  if(unique.size!==symbols.length) return {status:"UNKNOWN",reason:"OFFICIAL_DUPLICATE_SYMBOL",market,date,symbol};
  const floor=Number.isFinite(Number(minimumRows)) ? Math.max(1,Number(minimumRows)) : (market==="TWSE"?600:450);
  if(unique.size<floor) return {
    status:"UNKNOWN",reason:"OFFICIAL_MARKET_ROWCOUNT_INCOMPLETE",market,date,symbol,
    observedRows:unique.size,minimumRows:floor
  };
  const traded=extractRawTradedSymbolPresence(rawRows).has(String(symbol));
  return {
    status:"COMPLETE",reason:null,market,date,symbol,traded,
    observedRows:unique.size,minimumRows:floor,
    semantics:"RAW_OFFICIAL_PRESENCE_BEFORE_FORMAL_FILTERS"
  };
}

export function reconcileFreshProviderWithOfficialGaps({
  history,marketDate,marketSessions,requiredPriorBars=60,adjustedRequested,
  officialGapReceipts=[]
}){
  const fresh=validateFreshProviderHistory({history,marketDate,requiredPriorBars,adjustedRequested});
  if(!fresh.usable) return {...fresh,reconciled:false};

  const required=Math.max(1,Math.floor(Number(requiredPriorBars)||60));
  const normalized=normalizedDates(history,marketDate,{allowTargetDate:true});
  const prior=normalized.dates.filter(d=>d<marketDate);
  const recentPrior=prior.slice(-required);
  const earliest=recentPrior[0];
  const providerSet=new Set(recentPrior);
  const sessions=[...new Set((Array.isArray(marketSessions)?marketSessions:[])
    .map(String).filter(validDate).filter(d=>d<marketDate && (!earliest || d>=earliest)))].sort();
  if(!sessions.length) return {status:"UNKNOWN",usable:false,reconciled:false,reason:"MARKET_SESSION_PROOF_UNAVAILABLE"};

  const gaps=sessions.filter(d=>!providerSet.has(d));
  if(!gaps.length){
    return {
      ...fresh,status:"VALID_FRESH_PROVIDER_SERIES_RECONCILED",reconciled:true,
      officialGapCount:0,verifiedNoTradeGaps:0
    };
  }

  const byDate=new Map((Array.isArray(officialGapReceipts)?officialGapReceipts:[])
    .filter(x=>x&&validDate(x.date)).map(x=>[String(x.date),x]));
  let verifiedNoTradeGaps=0;
  for(const gapDate of gaps){
    const receipt=byDate.get(gapDate);
    if(!receipt || receipt.status!=="COMPLETE"){
      return {
        status:"UNKNOWN",usable:false,reconciled:false,
        reason:"OFFICIAL_GAP_PROOF_UNAVAILABLE",gapDate,
        officialGapCount:gaps.length,verifiedNoTradeGaps
      };
    }
    if(receipt.traded===true){
      return {
        status:"DATA_INCOMPLETE",usable:false,reconciled:false,
        reason:"FRESH_PROVIDER_MISSING_OFFICIAL_BAR",gapDate,
        officialGapCount:gaps.length,verifiedNoTradeGaps
      };
    }
    if(receipt.traded!==false){
      return {
        status:"UNKNOWN",usable:false,reconciled:false,
        reason:"OFFICIAL_GAP_PRESENCE_AMBIGUOUS",gapDate,
        officialGapCount:gaps.length,verifiedNoTradeGaps
      };
    }
    verifiedNoTradeGaps+=1;
  }
  return {
    ...fresh,status:"VALID_FRESH_PROVIDER_SERIES_RECONCILED",reconciled:true,
    officialGapCount:gaps.length,verifiedNoTradeGaps,
    gapSemantics:"COMPLETE_OFFICIAL_SOURCE_CONFIRMED_NO_ACTUAL_TRADE"
  };
}

export function decideHistoryAdmissionV21({
  cachedHistory,freshHistory,marketDate,marketSessions,requiredPriorBars=60,
  todayOfficialTraded=true,freshFetchStatus="NOT_ATTEMPTED",adjustedRequested,
  officialGapReceipts=[]
}){
  if(todayOfficialTraded!==true){
    return {status:"NOT_IN_TODAY_TRADED_UNIVERSE",usable:false,needsRefetch:false,reason:"NO_CURRENT_OFFICIAL_TRADED_BAR"};
  }
  const cached=assessCachedHistoryForRevalidation({history:cachedHistory,marketDate,marketSessions,requiredPriorBars});
  if(cached.usable) return {status:"USE_CACHE_FAST_PATH",usable:true,source:"CACHE",cached};
  if(freshFetchStatus!=="SUCCESS"){
    return {status:"UNKNOWN",usable:false,source:null,reason:"FRESH_PROVIDER_REVALIDATION_FAILED",cached,freshFetchStatus};
  }
  const reconciled=reconcileFreshProviderWithOfficialGaps({
    history:freshHistory,marketDate,marketSessions,requiredPriorBars,adjustedRequested,officialGapReceipts
  });
  if(!reconciled.usable){
    return {status:reconciled.status,usable:false,source:null,reason:reconciled.reason,cached,fresh:reconciled};
  }
  return {
    status:"USE_FRESH_PROVIDER_REPAIR_RECONCILED",usable:true,source:"FRESH_PROVIDER_RAW",
    repaired:true,cached,fresh:reconciled
  };
}


// V2.2 operational-cost model. Research-only; no scheduler/runtime mutation.
export function estimateHistoryRevalidationCost({
  suspiciousSymbols=0,baselineProviderCalls=0,seedMinutes=60,batchPerMinute=6,
  gapRequests=[],presenceLedgerKeys=[]
}={}){
  const suspicious=Math.max(0,Math.floor(Number(suspiciousSymbols)||0));
  const baseline=Math.max(0,Math.floor(Number(baselineProviderCalls)||0));
  const minutes=Math.max(1,Math.floor(Number(seedMinutes)||60));
  const batch=Math.max(1,Math.floor(Number(batchPerMinute)||6));
  const providerCapacity=minutes*batch;
  const providerCallsRequired=baseline+suspicious;
  const gapKeys=[...new Set((Array.isArray(gapRequests)?gapRequests:[])
    .map(x=>String(x?.market||"")+":"+String(x?.date||""))
    .filter(x=>/^(TWSE|TPEx):\d{4}-\d{2}-\d{2}$/.test(x)))];
  const ledger=new Set(Array.isArray(presenceLedgerKeys)?presenceLedgerKeys.map(String):[]);
  const officialGapNetworkCalls=gapKeys.filter(k=>!ledger.has(k)).length;
  return {
    providerCapacity,
    baselineProviderCalls:baseline,
    suspiciousSymbols:suspicious,
    providerCallsRequired,
    providerCallsWithinSeedWindow:providerCallsRequired<=providerCapacity,
    providerOverflowCalls:Math.max(0,providerCallsRequired-providerCapacity),
    uniqueGapDateMarketKeys:gapKeys.length,
    officialGapNetworkCalls,
    officialGapLedgerHits:gapKeys.length-officialGapNetworkCalls,
    rule:"Never exceed bounded seed capacity by silently admitting stale history; overflow remains pending/UNKNOWN."
  };
}
