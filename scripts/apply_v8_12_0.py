from pathlib import Path

# V8.12.0 Class-B HISTORY_SOURCE_REVALIDATION_V2.3
# Owner-approved 2026-09-26.
# Changes history data admission only. Formal strategy logic is untouched.

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")

def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text = text.replace(old, new, 1)

def insert_before_once(marker, addition, label):
    global text
    count = text.count(marker)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text = text.replace(marker, addition + marker, 1)

replace_once(
    'const VERSION = "8.11.0-pv-shadow-v0.1-log-only";',
    'const VERSION = "8.12.0-history-source-revalidation-v2-3";',
    "runtime version",
)

replace_once(
    'const HISTORY_SEED_SCHEMA = "full-market-v2";',
    'const HISTORY_SEED_SCHEMA = "full-market-v4-history-source-revalidation";\n'
    'const HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS = 60;\n'
    'const HISTORY_PRESENCE_RECEIPT_TTL_SECONDS = 180 * 24 * 60 * 60;\n'
    'const HISTORY_GAP_RECEIPT_FETCH_LIMIT_PER_SEED = 8;',
    "history seed schema",
)

helpers = r'''
function historyPresenceKey(market,date) {
  return "V7_HISTORY_PRESENCE:"+market+":"+date;
}

async function loadHistoryRevalidationCalendars(env,marketDate) {
  const start=shiftDateString(marketDate,-HISTORY_LOOKBACK_CALENDAR_DAYS-40);
  const firstYear=Number(start.slice(0,4)),lastYear=Number(marketDate.slice(0,4));
  for(let year=firstYear;year<=lastYear;year+=1) await loadTradingCalendar(env,year);
}

function historyRawSourceRows(payload) {
  const table=payload?.tables?.find(item=>Array.isArray(item.fields)&&Array.isArray(item.data)&&(item.fields.includes("代號")||item.fields.includes("證券代號")));
  if(Array.isArray(payload)) return {rows:payload,payloadDate:null};
  if(table) return {
    rows:table.data.map(values=>Object.fromEntries(table.fields.map((field,index)=>[field,values[index]]))),
    payloadDate:normalizeMarketDate(payload?.date||table?.date)
  };
  return {rows:Array.isArray(payload?.data)?payload.data:[],payloadDate:normalizeMarketDate(payload?.date)};
}

function historyRawSymbol(row) {
  return String(pick(row,["Code","SecuritiesCompanyCode","SecuritiesCompanyCode ","股票代號","證券代號","代號"])||"").trim();
}

function buildHistoryPresenceReceipt(payload,market,expectedDate,sourceUrl) {
  const extracted=historyRawSourceRows(payload);
  if(!Array.isArray(extracted.rows)) throw new Error(market+" raw presence source不是陣列");
  const symbols=[],tradedSymbols=[];
  for(const row of extracted.rows) {
    const symbol=historyRawSymbol(row);
    if(!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    symbols.push(symbol);
    const rowDate=normalizeMarketDate(row.Date||row.date)||extracted.payloadDate;
    if(expectedDate && rowDate && rowDate!==expectedDate) throw new Error(market+" raw presence日期"+rowDate+"，預期"+expectedDate);
    const close=marketNumber(pick(row,["ClosingPrice","Close","收盤價","收盤"]));
    const volume=marketNumber(pick(row,["TradeVolume","TradingShares","成交股數","成交量"]))||0;
    const value=marketNumber(pick(row,["TradeValue","TransactionAmount","成交金額","成交金額(元)"]))||0;
    const transactions=marketNumber(pick(row,["Transaction","Transactions","成交筆數","成交筆數(筆)"]))||0;
    if(close!==null && (volume>0 || value>0 || transactions>0)) tradedSymbols.push(symbol);
  }
  const unique=new Set(symbols);
  const minimum=market==="TWSE"?600:450;
  if(unique.size<minimum) throw new Error(market+" raw presence資料不足："+unique.size+"/"+minimum);
  if(unique.size!==symbols.length) throw new Error(market+" raw presence代號重複");
  return {
    schemaVersion:"HISTORY_PRESENCE_V1",
    market,marketDate:expectedDate,sourceUrl,
    collectedAt:new Date().toISOString(),
    symbolCount:unique.size,
    tradedSymbols:[...new Set(tradedSymbols)].sort(),
    complete:true,
    semantics:"RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS"
  };
}

async function writeHistoryPresenceReceipt(env,receipt) {
  if(!env?.STOCKS_KV || receipt?.complete!==true) return false;
  await env.STOCKS_KV.put(historyPresenceKey(receipt.market,receipt.marketDate),JSON.stringify(receipt),{expirationTtl:HISTORY_PRESENCE_RECEIPT_TTL_SECONDS});
  return true;
}

async function readHistoryPresenceReceipt(env,market,date) {
  if(!env?.STOCKS_KV) return null;
  const receipt=await env.STOCKS_KV.get(historyPresenceKey(market,date),"json");
  const minimum=market==="TWSE"?600:450;
  if(receipt?.complete!==true || receipt?.market!==market || receipt?.marketDate!==date ||
    receipt?.sourceUrl!==officialClosingUrl(market,date) || !Array.isArray(receipt?.tradedSymbols) ||
    Number(receipt?.symbolCount||0)<minimum) return null;
  return receipt;
}

async function ensureHistoryPresenceReceipt(env,market,date,budget=null) {
  const cached=await readHistoryPresenceReceipt(env,market,date);
  if(cached) return {receipt:cached,network:false};
  if(budget && Number(budget.remaining||0)<=0) return {receipt:null,network:false,budgetExhausted:true};
  if(budget) budget.remaining-=1;
  try {
    const sourceUrl=officialClosingUrl(market,date);
    const payload=await fetchJsonWithRetry(
      sourceUrl,
      {redirect:"manual",headers:{accept:"application/json","user-agent":"Mozilla/5.0 V7-History-Revalidation"}},
      market+"歷史bar presence "+date,
      3
    );
    const receipt=buildHistoryPresenceReceipt(payload,market,date,sourceUrl);
    await writeHistoryPresenceReceipt(env,receipt);
    return {receipt,network:true};
  } catch(error) {
    return {receipt:null,network:true,error:String(error).slice(0,300)};
  }
}

function historyStructuralShape(history,marketDate,requiredBars=HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS) {
  const required=Math.max(1,Math.floor(Number(requiredBars)||HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS));
  const fail=(status,reason,extra={})=>({usable:false,status,reason,marketDate,requiredBars,...extra});
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate||""))) return fail("UNKNOWN","INVALID_MARKET_DATE");
  if(!Array.isArray(history)) return fail("DATA_INCOMPLETE","HISTORY_NOT_ARRAY");
  const dates=[];
  for(const item of history) {
    const date=String(item?.date||"").slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail("DATA_INCOMPLETE","INVALID_BAR_DATE",{barDate:date||null});
    dates.push(date);
  }
  for(let i=1;i<dates.length;i+=1) {
    if(dates[i]===dates[i-1]) return fail("DATA_INCOMPLETE","DUPLICATE_BAR_DATE",{barDate:dates[i]});
    if(dates[i]<dates[i-1]) return fail("DATA_INCOMPLETE","OUT_OF_ORDER_BAR_DATE",{previousDate:dates[i-1],barDate:dates[i]});
  }
  const future=dates.find(date=>date>marketDate);
  if(future) return fail("DATA_INCOMPLETE","FUTURE_BAR_DATE",{barDate:future});
  const prior=dates.filter(date=>date<marketDate);
  if(prior.length<required) return fail("DATA_INCOMPLETE","INSUFFICIENT_PRIOR_BARS",{observedPriorBars:prior.length});
  const recent=prior.slice(-required);
  const earliest=recent[0];
  const providerSet=new Set(recent);
  const sessions=[];
  let cursor=earliest,guard=0;
  while(cursor<marketDate && guard<HISTORY_LOOKBACK_CALENDAR_DAYS+80) {
    const year=Number(cursor.slice(0,4));
    if(!MARKET_CALENDARS.has(year)) return fail("UNKNOWN","CALENDAR_UNAVAILABLE",{missingCalendarYear:year});
    if(isTradingDate(cursor)) sessions.push(cursor);
    cursor=shiftDateString(cursor,1);
    guard+=1;
  }
  if(cursor<marketDate) return fail("UNKNOWN","CALENDAR_RANGE_INSUFFICIENT");
  const sessionSet=new Set(sessions);
  const invalidBar=recent.find(date=>!sessionSet.has(date));
  if(invalidBar) return fail("UNKNOWN","PROVIDER_BAR_OUTSIDE_MARKET_SESSION_PROOF",{barDate:invalidBar});
  const gapDates=sessions.filter(date=>!providerSet.has(date));
  return {
    usable:true,status:"STRUCTURE_READY",reason:null,marketDate,requiredBars:required,
    observedPriorBars:prior.length,recentPriorDates:recent,earliestPriorDate:earliest,
    latestPriorDate:recent.at(-1)||null,gapDates
  };
}

async function validateHistorySourceRevalidation({history,symbol,market,marketDate,env,allowNetwork=false,budget=null,receiptMemo=null}) {
  const shape=historyStructuralShape(history,marketDate);
  if(!shape.usable) return {...shape,verifiedNoTradeDates:[]};
  if(!["TWSE","TPEx"].includes(String(market||""))) {
    return {usable:false,status:"UNKNOWN",reason:"MARKET_IDENTITY_UNAVAILABLE",symbol,market,marketDate,shape,verifiedNoTradeDates:[]};
  }
  const memo=receiptMemo||new Map();
  const verifiedNoTradeDates=[];
  for(const gapDate of shape.gapDates) {
    const key=market+":"+gapDate;
    let receipt=memo.get(key);
    if(receipt===undefined) {
      const result=allowNetwork
        ? await ensureHistoryPresenceReceipt(env,market,gapDate,budget)
        : {receipt:await readHistoryPresenceReceipt(env,market,gapDate)};
      receipt=result.receipt||null;
      memo.set(key,receipt);
    }
    if(!receipt) return {
      usable:false,status:"UNKNOWN",reason:"OFFICIAL_GAP_PROOF_UNAVAILABLE",
      marketDate,symbol,market,gapDate,verifiedNoTradeDates,shape
    };
    const traded=new Set(receipt.tradedSymbols||[]);
    if(traded.has(symbol)) return {
      usable:false,status:"DATA_INCOMPLETE",reason:"MISSING_OFFICIAL_TRADED_BAR",
      marketDate,symbol,market,gapDate,verifiedNoTradeDates,shape
    };
    verifiedNoTradeDates.push(gapDate);
  }
  return {
    usable:true,status:shape.gapDates.length?"VALID_WITH_VERIFIED_NO_TRADE_GAPS":"VALID_EXACT_SESSIONS",
    reason:null,marketDate,symbol,market,latestPriorDate:shape.latestPriorDate,
    gapDates:shape.gapDates,verifiedNoTradeDates,requiredBars:shape.requiredBars
  };
}

async function buildHistoryAdmissionMap(rows,historyMap,marketDate,env) {
  const memo=new Map(),bySymbol={},summary={
    marketDate,requiredPriorBars:HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS,
    usableSymbols:0,unusableSymbols:0,reasons:{},verifiedNoTradeGapSymbols:0,samples:[]
  };
  for(const row of rows||[]) {
    const symbol=String(row?.symbol||"");
    const history=Array.isArray(historyMap?.[symbol])?historyMap[symbol]:[];
    const result=await validateHistorySourceRevalidation({
      history,symbol,market:row.market,marketDate,env,allowNetwork:false,receiptMemo:memo
    });
    bySymbol[symbol]=result;
    if(result.usable) {
      summary.usableSymbols+=1;
      if((result.verifiedNoTradeDates||[]).length) summary.verifiedNoTradeGapSymbols+=1;
    } else {
      summary.unusableSymbols+=1;
      summary.reasons[result.reason]=(summary.reasons[result.reason]||0)+1;
      if(summary.samples.length<50) summary.samples.push({
        symbol,name:row.name||symbol,market:row.market,status:result.status,reason:result.reason,
        gapDate:result.gapDate||null,latestPriorDate:result.latestPriorDate||result.shape?.latestPriorDate||null
      });
    }
  }
  return {bySymbol,summary};
}

function buildEligibleMarketFeature(stock) {
  if(stock?.historyFreshness?.usable!==true) return null;
  return buildMarketFeatures(stock);
}

'''
insert_before_once("function updateMarketState(previous, rows, enrichment, scanDate) {", helpers, "history revalidation helpers")

replace_once(
r'''function updateMarketState(previous, rows, enrichment, scanDate) {
  const state = { version: 2, updatedAt: new Date().toISOString(), lastDate: scanDate, stocks: { ...(previous.stocks || {}) } };
  for (const row of rows) {
    const old = state.stocks[row.symbol] || {};
    const seeded = Array.isArray(enrichment.history?.[row.symbol]) ? enrichment.history[row.symbol] : [];
    const oldHistory = Array.isArray(old.history) ? old.history : [];
    let history = seeded.length > oldHistory.length ? seeded : oldHistory;
    history = history.filter(item => String(item.date || "") < scanDate).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    history.push({
      date: scanDate, open: row.open, close: row.close, high: row.high, low: row.low,
      volumeShares: row.volumeShares, tradeValue: row.tradeValue,
      foreignNet: toNumber(row.foreignNet), trustNet: toNumber(row.trustNet), dealerNet: toNumber(row.dealerNet),
      institutionTotalNet: toNumber(row.institutionTotalNet), revenueYoY: toNumber(row.revenueYoY),
      revenueMoM: toNumber(row.revenueMoM), grossMargin: toNumber(row.grossMargin),
      operatingMargin: toNumber(row.operatingMargin), eps: toNumber(row.eps)
    });
    history = history.sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-MARKET_STATE_DAYS);
    state.stocks[row.symbol] = { ...old, ...row, history };
  }
  return state;
}''',
r'''function updateMarketState(previous, rows, enrichment, scanDate, historyAdmission={bySymbol:{},summary:null}) {
  const state = {version:2,updatedAt:new Date().toISOString(),lastDate:scanDate,stocks:{...(previous.stocks||{})},
    historySourceRevalidation:historyAdmission?.summary||null};
  for (const row of rows) {
    const old = state.stocks[row.symbol] || {};
    const seeded = Array.isArray(enrichment.history?.[row.symbol]) ? enrichment.history[row.symbol] : [];
    const admission=historyAdmission?.bySymbol?.[row.symbol]||{usable:false,status:"UNKNOWN",reason:"HISTORY_ADMISSION_MISSING"};
    let history=admission.usable
      ? seeded.filter(item=>String(item?.date||"")<scanDate).sort((a,b)=>String(a.date).localeCompare(String(b.date)))
      : [];
    history.push({
      date: scanDate, open: row.open, close: row.close, high: row.high, low: row.low,
      volumeShares: row.volumeShares, tradeValue: row.tradeValue,
      foreignNet: toNumber(row.foreignNet), trustNet: toNumber(row.trustNet), dealerNet: toNumber(row.dealerNet),
      institutionTotalNet: toNumber(row.institutionTotalNet), revenueYoY: toNumber(row.revenueYoY),
      revenueMoM: toNumber(row.revenueMoM), grossMargin: toNumber(row.grossMargin),
      operatingMargin: toNumber(row.operatingMargin), eps: toNumber(row.eps)
    });
    history=history.slice(-MARKET_STATE_DAYS);
    state.stocks[row.symbol]={...old,...row,history,historyFreshness:admission};
  }
  return state;
}''',
    "fail closed market state",
)

replace_once(
r'''  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildMarketFeatures)
    .filter(Boolean);''',
r'''  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildEligibleMarketFeature)
    .filter(Boolean);''',
    "formal feature admission",
)

replace_once(
    '  const marketDate = requestedMarketDate;\n  const cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);',
    '  const marketDate = requestedMarketDate;\n  await loadHistoryRevalidationCalendars(env,marketDate);\n'
    '  const cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);',
    "after market calendar coverage",
)

replace_once(
    '  enrichment.history = { ...cachedHistory, ...(enrichment.history || {}) };\n'
    '  // Free Workers 每次只有很小的 CPU 預算；18:10 不再臨時額外暖機。',
    '  enrichment.history = { ...cachedHistory, ...(enrichment.history || {}) };\n'
    '  const historyAdmission=await buildHistoryAdmissionMap(rows,enrichment.history,marketDate,env);\n'
    '  // Free Workers 每次只有很小的 CPU 預算；18:10 不再臨時額外暖機。',
    "after market history admission",
)

replace_once(
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate);',
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate,historyAdmission);',
    "market state admission input",
)

replace_once(
    '  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);',
    '  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);\n'
    '  scan.diagnostics.historySourceRevalidation=historyAdmission.summary;',
    "history diagnostics",
)

replace_once(
    '      seedSchema: Array.isArray(parsed) ? null : String(parsed?.seedSchema || ""),\n'
    '      updatedAt: row.updated_at || null',
    '      seedSchema: Array.isArray(parsed) ? null : String(parsed?.seedSchema || ""),\n'
    '      marketBySymbol: Array.isArray(parsed) ? {} : (parsed?.marketBySymbol && typeof parsed.marketBySymbol==="object" ? parsed.marketBySymbol : {}),\n'
    '      updatedAt: row.updated_at || null',
    "read seed market map",
)

replace_once(
    '      seedSchema: String(state.seedSchema || HISTORY_SEED_SCHEMA)\n'
    '    }),',
    '      seedSchema: String(state.seedSchema || HISTORY_SEED_SCHEMA),\n'
    '      marketBySymbol: state.marketBySymbol || {}\n'
    '    }),',
    "write seed market map",
)

replace_once(
    '  const marketDate = mostRecentWeekday(requestedDate);\n  const batchLimit = Math.max(1, Math.min(Number(limit) || HISTORY_WARMUP_LIMIT, HISTORY_WARMUP_LIMIT));',
    '  const marketDate = mostRecentWeekday(requestedDate);\n  await loadHistoryRevalidationCalendars(env,marketDate);\n'
    '  const batchLimit = Math.max(1, Math.min(Number(limit) || HISTORY_WARMUP_LIMIT, HISTORY_WARMUP_LIMIT));',
    "seed calendar coverage",
)

replace_once(
r'''    const completeCached = new Set(Object.entries(cached)
      .filter(([symbol, history]) => targetSet.has(symbol) && Array.isArray(history) && history.length >= 60)
      .map(([symbol]) => symbol));

    const queue = ordered.filter(symbol => !completeCached.has(symbol));
    state = {
      marketDate,
      queue,
      cursor: 0,
      total: queue.length,
      coverageTarget: ordered.length,
      coverageBase: completeCached.size,
      resolvedCount: completeCached.size,
      insufficientSymbols: [],
      seedSchema: HISTORY_SEED_SCHEMA,
      updatedAt: null
    };''',
r'''    const marketBySymbol=Object.fromEntries(marketRows.map(row=>[row.symbol,row.market]));
    const receiptMemo=new Map();
    const completeCached=new Set();
    for(const [symbol,history] of Object.entries(cached)) {
      if(!targetSet.has(symbol) || !Array.isArray(history) || history.length<HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS) continue;
      const result=await validateHistorySourceRevalidation({
        history,symbol,market:marketBySymbol[symbol],marketDate,env,allowNetwork:false,receiptMemo
      });
      if(result.usable) completeCached.add(symbol);
    }

    const queue = ordered.filter(symbol => !completeCached.has(symbol));
    state = {
      marketDate,
      queue,
      cursor: 0,
      total: queue.length,
      coverageTarget: ordered.length,
      coverageBase: completeCached.size,
      resolvedCount: completeCached.size,
      insufficientSymbols: [],
      marketBySymbol,
      seedSchema: HISTORY_SEED_SCHEMA,
      updatedAt: null
    };''',
    "seed cache source revalidation",
)

replace_once(
r'''      insufficientSymbols: state.insufficientSymbols || [],
      seedSchema: HISTORY_SEED_SCHEMA,
      updatedAt: null''',
r'''      insufficientSymbols: state.insufficientSymbols || [],
      marketBySymbol: state.marketBySymbol || {},
      seedSchema: HISTORY_SEED_SCHEMA,
      updatedAt: null''',
    "seed reset market map",
)

replace_once(
    '  const targets = symbols.map(symbol => ({ symbol }));\n  const warmup = await fetchHistoryWarmup(targets, marketDate, env);',
    '  const targets = symbols.map(symbol => ({symbol,market:state.marketBySymbol?.[symbol]||null}));\n'
    '  const warmup = await fetchHistoryWarmup(targets, marketDate, env);',
    "seed target market",
)

replace_once(
    '    insufficientSymbols: state.insufficientSymbols.slice(0, 50),\n'
    '    queueRebuilt,',
    '    insufficientSymbols: state.insufficientSymbols.slice(0, 50),\n'
    '    historySourceRevalidation:warmup.historySourceRevalidation||null,\n'
    '    queueRebuilt,',
    "seed response diagnostics",
)

replace_once(
r'''async function fetchHistoryWarmup(targetRows, marketDate, env) {
  const history = {};
  let fetched = 0;
  let complete = 0;
  let insufficient = 0;
  let failed = 0;
  const failedSymbols = [];
  const insufficientSymbols = [];
  const from = shiftDateString(marketDate, -HISTORY_LOOKBACK_CALENDAR_DAYS);

  for (let i = 0; i < targetRows.length; i += 6) {
    const batch = targetRows.slice(i, i + 6);
    const results = await Promise.all(batch.map(async row => {
      try {
        const bars = await fetchHistoricalDaily(row.symbol, from, marketDate, env);
        return { symbol: row.symbol, bars };
      } catch (err) {
        return { symbol: row.symbol, error: String(err), bars: [] };
      }
    }));

    for (const item of results) {
      if (item.error || !Array.isArray(item.bars) || item.bars.length === 0) {
        failed += 1;
        failedSymbols.push(item.symbol);
        continue;
      }

      fetched += 1;
      // >=60 日才算真正完成 60 日技術底庫。
      if (item.bars.length >= 60) {
        history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
        complete += 1;
        continue;
      }

      // 新上市/歷史天然不足者標記為「已處理但不足60日」，不讓暖機永遠卡在最後幾檔。
      // 有20日以上仍保留到D1，未來交易日重建佇列時會再次檢查，滿60日後自然升級。
      if (item.bars.length >= 20) history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
      insufficient += 1;
      insufficientSymbols.push(item.symbol);
    }
  }
  return { history, fetched, complete, insufficient, failed, failedSymbols, insufficientSymbols };
}''',
r'''async function fetchHistoryWarmup(targetRows, marketDate, env) {
  const history = {};
  let fetched=0,complete=0,insufficient=0,failed=0;
  const failedSymbols=[],insufficientSymbols=[];
  const reasons={},samples=[];
  const from=shiftDateString(marketDate,-HISTORY_LOOKBACK_CALENDAR_DAYS);
  const budget={remaining:HISTORY_GAP_RECEIPT_FETCH_LIMIT_PER_SEED};
  const receiptMemo=new Map();

  for(let i=0;i<targetRows.length;i+=6) {
    const batch=targetRows.slice(i,i+6);
    const results=await Promise.all(batch.map(async row=>{
      try {
        const bars=await fetchHistoricalDaily(row.symbol,from,marketDate,env);
        return {symbol:row.symbol,market:row.market,bars};
      } catch(err) {
        return {symbol:row.symbol,market:row.market,error:String(err),bars:[]};
      }
    }));

    for(const item of results) {
      if(item.error || !Array.isArray(item.bars) || item.bars.length===0) {
        failed+=1;failedSymbols.push(item.symbol);
        reasons.PROVIDER_FETCH_FAILED=(reasons.PROVIDER_FETCH_FAILED||0)+1;
        continue;
      }
      fetched+=1;
      const validation=await validateHistorySourceRevalidation({
        history:item.bars,symbol:item.symbol,market:item.market,marketDate,env,
        allowNetwork:true,budget,receiptMemo
      });
      if(validation.usable) {
        history[item.symbol]=item.bars.slice(-MARKET_STATE_DAYS);
        complete+=1;
        continue;
      }
      if(item.bars.length>=20) history[item.symbol]=item.bars.slice(-MARKET_STATE_DAYS);
      insufficient+=1;insufficientSymbols.push(item.symbol);
      reasons[validation.reason]=(reasons[validation.reason]||0)+1;
      if(samples.length<30) samples.push({
        symbol:item.symbol,market:item.market,status:validation.status,reason:validation.reason,
        gapDate:validation.gapDate||null,latestPriorDate:validation.latestPriorDate||validation.shape?.latestPriorDate||null
      });
    }
  }
  return {
    history,fetched,complete,insufficient,failed,failedSymbols,insufficientSymbols,
    historySourceRevalidation:{
      requiredPriorBars:HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS,
      gapNetworkBudget:HISTORY_GAP_RECEIPT_FETCH_LIMIT_PER_SEED,
      gapNetworkBudgetRemaining:budget.remaining,
      reasons,samples
    }
  };
}''',
    "warmup source revalidation",
)

replace_once(
    '&timeframe=D&fields=open,high,low,close,volume,turnover,change&sort=asc',
    '&timeframe=D&adjusted=false&fields=open,high,low,close,volume,turnover,change&sort=asc',
    "explicit raw Fugle daily semantics",
)

replace_once(
    '        const rows = normalizeClosingPayload(body.payload,market,date);\n'
    '        const entry = {market,marketDate:date,sourceUrl:body.sourceUrl,collectedAt:new Date().toISOString(),rows};',
    '        const rows = normalizeClosingPayload(body.payload,market,date);\n'
    '        let historyPresenceStored=false;\n'
    '        try {\n'
    '          const presence=buildHistoryPresenceReceipt(body.payload,market,date,body.sourceUrl);\n'
    '          historyPresenceStored=await writeHistoryPresenceReceipt(env,presence);\n'
    '        } catch(_) { historyPresenceStored=false; }\n'
    '        const entry = {market,marketDate:date,sourceUrl:body.sourceUrl,collectedAt:new Date().toISOString(),rows};',
    "current official raw presence capture",
)

replace_once(
    '        return json({ok:true,verified:true,market,marketDate:date,count:rows.length,monitorUrl:url.origin},200,true);',
    '        return json({ok:true,verified:true,market,marketDate:date,count:rows.length,historyPresenceStored,monitorUrl:url.origin},200,true);',
    "market data presence receipt",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.12.0 HISTORY_SOURCE_REVALIDATION_V2.3")
