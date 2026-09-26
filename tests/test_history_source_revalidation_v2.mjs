import assert from "node:assert/strict";
import {
  assessCachedHistoryForRevalidation,
  validateFreshProviderHistory,
  decideHistoryAdmission,
  buildFugleRawDailyUrl,
  extractRawTradedSymbolPresence,
  buildOfficialSymbolGapReceipt,
  reconcileFreshProviderWithOfficialGaps,
  decideHistoryAdmissionV21,
  estimateHistoryRevalidationCost,
  assessCachedHistoryWithOfficialGapLedger
} from "../research/history_source_revalidation_v2.mjs";

function weekdayDates(endExclusive,count,exclude=new Set()){
  const out=[];
  const d=new Date(endExclusive+"T12:00:00Z");
  d.setUTCDate(d.getUTCDate()-1);
  while(out.length<count){
    const day=d.getUTCDay();
    const s=d.toISOString().slice(0,10);
    if(day!==0&&day!==6&&!exclude.has(s)) out.push(s);
    d.setUTCDate(d.getUTCDate()-1);
  }
  return out.reverse();
}
function bars(dates,start=50){
  return dates.map((date,i)=>({date,open:start+i,high:start+i+1,low:start+i-1,close:start+i+0.5,volume:100000+i}));
}

// Contract 1: raw Fugle semantics must be explicit, never provider-default inferred.
{
  const u=buildFugleRawDailyUrl({symbol:"2006",from:"2026-05-01",to:"2026-09-24"});
  assert.match(u,/adjusted=false/);
  assert.match(u,/timeframe=D/);
  assert.match(u,/sort=asc/);
}

// Contract 2: a truly contiguous healthy cache keeps zero-call fast path.
{
  const market=weekdayDates("2026-09-24",60);
  const out=assessCachedHistoryForRevalidation({
    history:bars(market),marketDate:"2026-09-24",marketSessions:market,requiredPriorBars:60
  });
  assert.equal(out.status,"CACHE_FAST_PATH_VALID");
  assert.equal(out.needsRefetch,false);
}

// B-130: cache through 9/11 is only a suspicion trigger; fresh provider repair is admitted.
{
  const market=["2026-09-11","2026-09-14","2026-09-15","2026-09-16","2026-09-17","2026-09-18","2026-09-21","2026-09-22","2026-09-23"];
  const old=bars(weekdayDates("2026-09-14",60));
  assert.equal(old.at(-1).date,"2026-09-11");
  const suspicious=assessCachedHistoryForRevalidation({
    history:old,marketDate:"2026-09-24",marketSessions:market,requiredPriorBars:1
  });
  assert.equal(suspicious.needsRefetch,true);
  assert.equal(suspicious.reason,"LATEST_BAR_NOT_PREVIOUS_MARKET_SESSION");
  const freshDates=weekdayDates("2026-09-24",60);
  const repaired=decideHistoryAdmission({
    cachedHistory:old,freshHistory:bars(freshDates),marketDate:"2026-09-24",
    marketSessions:market,requiredPriorBars:60,todayOfficialTraded:true,
    freshFetchStatus:"SUCCESS",adjustedRequested:false
  });
  assert.equal(repaired.usable,true);
  assert.equal(repaired.status,"USE_FRESH_PROVIDER_REPAIR");
  assert.equal(repaired.fresh.latestPriorDate,"2026-09-23");
}

// Counterexample to PR #100 strict market-session continuity:
// 8422 can have a legitimate multi-session gap and still have 60 actual prior bars.
// The V2 fresh-provider validator accepts the actual-bar sequence without inventing bars.
{
  const suspended=new Set(["2025-11-06","2025-11-07","2025-11-10","2025-11-11","2025-11-12","2025-11-13","2025-11-14"]);
  const freshDates=weekdayDates("2025-11-17",67,suspended).slice(-60);
  assert.equal(freshDates.at(-1),"2025-11-05");
  const market=weekdayDates("2025-11-17",60);
  const strict=assessCachedHistoryForRevalidation({
    history:bars(freshDates),marketDate:"2025-11-17",marketSessions:market,requiredPriorBars:60
  });
  assert.equal(strict.needsRefetch,true);
  const fresh=validateFreshProviderHistory({
    history:bars(freshDates),marketDate:"2025-11-17",requiredPriorBars:60,adjustedRequested:false
  });
  assert.equal(fresh.usable,true);
  assert.equal(fresh.latestPriorDate,"2025-11-05");
  const admitted=decideHistoryAdmission({
    cachedHistory:bars(freshDates),freshHistory:bars(freshDates),marketDate:"2025-11-17",
    marketSessions:market,requiredPriorBars:60,todayOfficialTraded:true,
    freshFetchStatus:"SUCCESS",adjustedRequested:false
  });
  assert.equal(admitted.usable,true);
  assert.equal(admitted.status,"USE_FRESH_PROVIDER_REPAIR");
}

// TPEx 5314 verified 2025-03-20..03-28 suspension: same falsification on another exchange.
{
  const suspended=new Set(["2025-03-20","2025-03-21","2025-03-24","2025-03-25","2025-03-26","2025-03-27","2025-03-28"]);
  const freshDates=weekdayDates("2025-03-31",67,suspended).slice(-60);
  assert.equal(freshDates.at(-1),"2025-03-19");
  const market=weekdayDates("2025-03-31",60);
  assert.equal(assessCachedHistoryForRevalidation({
    history:bars(freshDates),marketDate:"2025-03-31",marketSessions:market,requiredPriorBars:60
  }).needsRefetch,true);
  assert.equal(validateFreshProviderHistory({
    history:bars(freshDates),marketDate:"2025-03-31",requiredPriorBars:60,adjustedRequested:false
  }).usable,true);
}

// Internal calendar gap is not automatically BAD. It triggers refetch; the fresh provider
// decides the actual-bar sequence. This avoids confusing legitimate no-trade with stale cache.
{
  const market=weekdayDates("2026-09-24",61);
  const gapped=market.filter((_,i)=>i!==30).slice(-60);
  const suspicion=assessCachedHistoryForRevalidation({
    history:bars(gapped),marketDate:"2026-09-24",marketSessions:market,requiredPriorBars:60
  });
  assert.equal(suspicion.needsRefetch,true);
  assert.equal(validateFreshProviderHistory({
    history:bars(gapped),marketDate:"2026-09-24",requiredPriorBars:60,adjustedRequested:false
  }).usable,true);
}

// Provider failure must never silently fall back to suspicious stale history.
{
  const market=weekdayDates("2026-09-24",60);
  const old=bars(weekdayDates("2026-09-14",60));
  const out=decideHistoryAdmission({
    cachedHistory:old,freshHistory:null,marketDate:"2026-09-24",marketSessions:market,
    requiredPriorBars:60,todayOfficialTraded:true,freshFetchStatus:"HTTP_503",adjustedRequested:false
  });
  assert.equal(out.usable,false);
  assert.equal(out.status,"UNKNOWN");
  assert.equal(out.reason,"FRESH_PROVIDER_REVALIDATION_FAILED");
}

// Raw-price semantics not pinned => UNKNOWN, never assumed compatible.
{
  const fresh=bars(weekdayDates("2026-09-24",60));
  assert.equal(validateFreshProviderHistory({
    history:fresh,marketDate:"2026-09-24",requiredPriorBars:60,adjustedRequested:undefined
  }).reason,"RAW_PRICE_SEMANTICS_NOT_PINNED");
}

// Malformed fresh data fails closed.
{
  const d=weekdayDates("2026-09-24",60);
  const dup=[...d.slice(0,20),d[19],...d.slice(20)];
  assert.equal(validateFreshProviderHistory({history:bars(dup),marketDate:"2026-09-24",requiredPriorBars:60,adjustedRequested:false}).usable,false);
  const future=[...bars(d),{...bars([d.at(-1)])[0],date:"2026-09-30"}];
  assert.equal(validateFreshProviderHistory({history:future,marketDate:"2026-09-24",requiredPriorBars:60,adjustedRequested:false}).reason,"FUTURE_BAR_DATE");
}

// Strategy eligibility must never define bar-presence truth.
// A real traded stock below NT$10 remains present at the raw-source layer.
{
  const raw=[
    {"證券代號":"2007","收盤價":"8.80","成交股數":"1,234,000","成交金額":"10,859,200","成交筆數":"777"},
    {"證券代號":"2330","收盤價":"900","成交股數":"0","成交金額":"0","成交筆數":"0"}
  ];
  const present=extractRawTradedSymbolPresence(raw);
  assert.equal(present.has("2007"),true);
  assert.equal(present.has("2330"),false);
}

// A stock not in today's actually-traded universe is not a Formal candidate and does not
// need emergency revalidation merely because it is suspended/no-transaction today.
{
  const out=decideHistoryAdmission({
    cachedHistory:[],freshHistory:null,marketDate:"2025-11-14",marketSessions:weekdayDates("2025-11-14",60),
    todayOfficialTraded:false,freshFetchStatus:"NOT_ATTEMPTED",adjustedRequested:false
  });
  assert.equal(out.status,"NOT_IN_TODAY_TRADED_UNIVERSE");
  assert.equal(out.needsRefetch,false);
}

console.log(JSON.stringify({
  ok:true,
  prototype:"HISTORY_SOURCE_REVALIDATION_V2",
  class:"A_RESEARCH_ONLY",
  formalCoreChanged:false,
  b130RepairPath:true,
  twseSuspensionFalseRejectAvoided:true,
  tpexSuspensionFalseRejectAvoided:true,
  providerFailureFailsClosed:true,
  rawAdjustedExplicit:false,
  lowPricePresenceFilterLeakGuarded:true
}));


// V2.1 counterexample: a fresh provider response can still be incomplete.
// If the official raw daily source proves a trade on the missing session, reject the provider series.
{
  const market=weekdayDates("2026-09-24",61);
  const missingDate=market[30];
  const providerDates=market.filter(d=>d!==missingDate); // still 60 bars -> naive fresh validator would pass
  assert.equal(providerDates.length,60);
  assert.equal(validateFreshProviderHistory({
    history:bars(providerDates),marketDate:"2026-09-24",requiredPriorBars:60,adjustedRequested:false
  }).usable,true);
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TWSE",date:missingDate,symbol:"2006",minimumRows:1,
    rawRows:[{"證券代號":"2006","收盤價":"84","成交股數":"1000","成交金額":"84000","成交筆數":"1"}]
  });
  assert.equal(receipt.status,"COMPLETE");
  assert.equal(receipt.traded,true);
  const reconciled=reconcileFreshProviderWithOfficialGaps({
    history:bars(providerDates),marketDate:"2026-09-24",marketSessions:market,
    requiredPriorBars:60,adjustedRequested:false,officialGapReceipts:[receipt]
  });
  assert.equal(reconciled.usable,false);
  assert.equal(reconciled.status,"DATA_INCOMPLETE");
  assert.equal(reconciled.reason,"FRESH_PROVIDER_MISSING_OFFICIAL_BAR");
  assert.equal(reconciled.gapDate,missingDate);
}

// Same calendar gap, opposite official evidence: complete official daily source shows no actual trade.
// This is a legitimate symbol-session gap and must not be false-rejected.
{
  const market=weekdayDates("2025-11-17",61);
  const missingDate=market.at(-1); // previous market session, intentionally absent for the symbol
  const providerDates=market.filter(d=>d!==missingDate);
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TWSE",date:missingDate,symbol:"8422",minimumRows:1,
    rawRows:[{"證券代號":"2330","收盤價":"1000","成交股數":"1000","成交金額":"1000000","成交筆數":"1"}]
  });
  assert.equal(receipt.status,"COMPLETE");
  assert.equal(receipt.traded,false);
  const reconciled=reconcileFreshProviderWithOfficialGaps({
    history:bars(providerDates),marketDate:"2025-11-17",marketSessions:market,
    requiredPriorBars:60,adjustedRequested:false,officialGapReceipts:[receipt]
  });
  assert.equal(reconciled.usable,true);
  assert.equal(reconciled.status,"VALID_FRESH_PROVIDER_SERIES_RECONCILED");
  assert.equal(reconciled.verifiedNoTradeGaps,1);
}

// Missing/incomplete official proof must remain UNKNOWN rather than silently trusting provider gaps.
{
  const market=weekdayDates("2026-09-24",61);
  const missingDate=market[25];
  const providerDates=market.filter(d=>d!==missingDate);
  const out=reconcileFreshProviderWithOfficialGaps({
    history:bars(providerDates),marketDate:"2026-09-24",marketSessions:market,
    requiredPriorBars:60,adjustedRequested:false,officialGapReceipts:[]
  });
  assert.equal(out.usable,false);
  assert.equal(out.status,"UNKNOWN");
  assert.equal(out.reason,"OFFICIAL_GAP_PROOF_UNAVAILABLE");
}

// Presence receipt completeness is independent of Formal price eligibility.
// A sub-NT$10 traded ordinary stock is still an official bar.
{
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TWSE",date:"2021-02-22",symbol:"2007",minimumRows:1,
    rawRows:[{"證券代號":"2007","收盤價":"8.80","成交股數":"1234000","成交金額":"10859200","成交筆數":"777"}]
  });
  assert.equal(receipt.status,"COMPLETE");
  assert.equal(receipt.traded,true);
}

// Incomplete official market payload cannot prove absence.
{
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TPEx",date:"2025-03-20",symbol:"5314",minimumRows:2,
    rawRows:[{"證券代號":"8299","收盤價":"100","成交股數":"1000","成交金額":"100000","成交筆數":"1"}]
  });
  assert.equal(receipt.status,"UNKNOWN");
  assert.equal(receipt.reason,"OFFICIAL_MARKET_ROWCOUNT_INCOMPLETE");
}

// V2.1 admission requires official reconciliation when a fresh series still has market-session gaps.
{
  const market=weekdayDates("2026-09-24",61);
  const missingDate=market[10];
  const providerDates=market.filter(d=>d!==missingDate);
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TWSE",date:missingDate,symbol:"2006",minimumRows:1,
    rawRows:[{"證券代號":"2006","收盤價":"80","成交股數":"100","成交金額":"8000","成交筆數":"1"}]
  });
  const out=decideHistoryAdmissionV21({
    cachedHistory:bars(weekdayDates("2026-09-14",60)),
    freshHistory:bars(providerDates),marketDate:"2026-09-24",marketSessions:market,
    requiredPriorBars:60,todayOfficialTraded:true,freshFetchStatus:"SUCCESS",
    adjustedRequested:false,officialGapReceipts:[receipt]
  });
  assert.equal(out.usable,false);
  assert.equal(out.reason,"FRESH_PROVIDER_MISSING_OFFICIAL_BAR");
}


// V2.2: existing architecture gives a bounded provider-call envelope:
// 60 seed minutes x 6 symbols/minute = 360 provider calls/day.
{
  const cost=estimateHistoryRevalidationCost({
    suspiciousSymbols:120,baselineProviderCalls:30,seedMinutes:60,batchPerMinute:6,
    gapRequests:[
      {market:"TWSE",date:"2026-09-23"},
      {market:"TWSE",date:"2026-09-23"},
      {market:"TPEx",date:"2026-09-22"}
    ]
  });
  assert.equal(cost.providerCapacity,360);
  assert.equal(cost.providerCallsRequired,150);
  assert.equal(cost.providerCallsWithinSeedWindow,true);
  assert.equal(cost.uniqueGapDateMarketKeys,2);
  assert.equal(cost.officialGapNetworkCalls,2);
}

// Duplicate symbol-gap checks must collapse to one full-market official call per exchange/date.
{
  const requests=Array.from({length:100},()=>({market:"TWSE",date:"2026-09-23"}));
  const cost=estimateHistoryRevalidationCost({suspiciousSymbols:100,gapRequests:requests});
  assert.equal(cost.uniqueGapDateMarketKeys,1);
  assert.equal(cost.officialGapNetworkCalls,1);
}

// A prospective presence ledger can eliminate repeated official network calls for already-captured dates.
{
  const cost=estimateHistoryRevalidationCost({
    suspiciousSymbols:10,
    gapRequests:[
      {market:"TWSE",date:"2026-09-23"},
      {market:"TPEx",date:"2026-09-23"}
    ],
    presenceLedgerKeys:["TWSE:2026-09-23","TPEx:2026-09-23"]
  });
  assert.equal(cost.officialGapNetworkCalls,0);
  assert.equal(cost.officialGapLedgerHits,2);
}

// Worst-case stale blast radius is explicitly not hidden.
// 2,000 suspicious symbols cannot fit a one-hour 6/min seed window and must remain pending/UNKNOWN.
{
  const cost=estimateHistoryRevalidationCost({suspiciousSymbols:2000});
  assert.equal(cost.providerCapacity,360);
  assert.equal(cost.providerCallsWithinSeedWindow,false);
  assert.equal(cost.providerOverflowCalls,1640);
}


// V2.3: a previously verified no-trade gap must become a reusable fast-path fact,
// otherwise the same suspended symbol would be refetched every day for weeks.
{
  const market=weekdayDates("2025-11-17",61);
  const gapDate=market.at(-1);
  const cachedDates=market.filter(d=>d!==gapDate);
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TWSE",date:gapDate,symbol:"8422",minimumRows:1,
    rawRows:[{"證券代號":"2330","收盤價":"1000","成交股數":"1000","成交金額":"1000000","成交筆數":"1"}]
  });
  const out=assessCachedHistoryWithOfficialGapLedger({
    history:bars(cachedDates),marketDate:"2025-11-17",marketSessions:market,
    requiredPriorBars:60,officialGapReceipts:[receipt]
  });
  assert.equal(out.usable,true);
  assert.equal(out.needsRefetch,false);
  assert.equal(out.status,"CACHE_FAST_PATH_VALID_WITH_GAP_LEDGER");
  assert.equal(out.explainedNoTradeGaps,1);
}

// Same shape without a complete receipt stays revalidation-needed, not silently valid.
{
  const market=weekdayDates("2025-11-17",61);
  const gapDate=market.at(-1);
  const cachedDates=market.filter(d=>d!==gapDate);
  const out=assessCachedHistoryWithOfficialGapLedger({
    history:bars(cachedDates),marketDate:"2025-11-17",marketSessions:market,
    requiredPriorBars:60,officialGapReceipts:[]
  });
  assert.equal(out.usable,false);
  assert.equal(out.needsRefetch,true);
  assert.equal(out.reason,"UNPROVEN_MARKET_SESSION_GAP");
}

// A cached gap previously proven to contain an official traded bar can never be excused by the ledger.
{
  const market=weekdayDates("2026-09-24",61);
  const gapDate=market[20];
  const cachedDates=market.filter(d=>d!==gapDate);
  const receipt=buildOfficialSymbolGapReceipt({
    market:"TWSE",date:gapDate,symbol:"2006",minimumRows:1,
    rawRows:[{"證券代號":"2006","收盤價":"82","成交股數":"2000","成交金額":"164000","成交筆數":"2"}]
  });
  const out=assessCachedHistoryWithOfficialGapLedger({
    history:bars(cachedDates),marketDate:"2026-09-24",marketSessions:market,
    requiredPriorBars:60,officialGapReceipts:[receipt]
  });
  assert.equal(out.usable,false);
  assert.equal(out.reason,"CACHE_MISSING_OFFICIAL_BAR");
}

// Provider bar outside the supplied official market-session proof is a source/calendar conflict, not a valid fast path.
{
  const market=weekdayDates("2026-09-24",60);
  const badDates=[...market.slice(1), "2026-09-20"]; // Sunday
  badDates.sort();
  const out=assessCachedHistoryWithOfficialGapLedger({
    history:bars(badDates),marketDate:"2026-09-24",marketSessions:market,
    requiredPriorBars:60,officialGapReceipts:[]
  });
  assert.equal(out.usable,false);
  assert.equal(out.status,"UNKNOWN");
  assert.equal(out.reason,"PROVIDER_BAR_OUTSIDE_MARKET_SESSION_PROOF");
}
