import assert from "node:assert/strict";
import {
  assessCachedHistoryForRevalidation,
  validateFreshProviderHistory,
  decideHistoryAdmission,
  buildFugleRawDailyUrl,
  extractRawTradedSymbolPresence
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
