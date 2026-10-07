import assert from "node:assert/strict";
import { probePitHistoryCoverageV0_1 } from "../runtime/daily_shadow_history_reader_v0_1.mjs";

function isoDays(start,count){
  const out=[];
  const d=new Date(start+"T00:00:00Z");
  for(let i=0;i<count;i+=1){
    out.push(d.toISOString().slice(0,10));
    d.setUTCDate(d.getUTCDate()+1);
  }
  return out;
}
function fakeDb(rows){
  return {
    prepare(){
      return {
        bind(){
          return { async all(){ return {results:rows}; } };
        },
      };
    },
  };
}
function snapshot(symbol="1101",market="TWSE"){
  return {
    marketDate:"2026-10-07",
    ordinarySymbolCount:1,
    symbols:[symbol],
    bySymbol:{[symbol]:{market}},
  };
}
function listing(symbol="1101",market="TWSE",listingDate="1962-02-09"){
  return {
    state:"READY",
    byMarketSymbol:{[`${market}|${symbol}`]:{market,symbol,listingDate}},
  };
}
function row(symbol,market,dates,{continuityEligibleCount=dates.length}={}){
  return {
    symbol,market,
    selected_date_count:dates.length,
    ambiguous_date_count:0,
    continuity_eligible_count:continuityEligibleCount,
    first_selected_date:dates[0]||null,
    last_selected_date:dates.at(-1)||null,
    selected_dates_csv:dates.join(","),
  };
}

const calendar61=isoDays("2026-08-07",61);
const expected60=calendar61.slice(-60);

const clean=await probePitHistoryCoverageV0_1({
  db:fakeDb([row("1101","TWSE",expected60)]),
  snapshotBatch:snapshot(),
  decisionTimestamp:"2026-10-07T07:30:00.000Z",
  requiredPriorSessions:60,
  listingMetadata:listing(),
  priorTradingDates:calendar61,
});
assert.equal(clean.historyReadyCount,1);
assert.equal(clean.continuityReadyCount,1);
assert.equal(clean.diagnostics[0].sessionReconciliationState,"EXACT_EXPECTED_SESSION_SET_AVAILABLE");
assert.equal(clean.diagnostics[0].missingExpectedSessionCount,0);
assert.equal(clean.diagnostics[0].unexpectedSessionCount,0);
assert.equal(clean.diagnostics[0].expectedSessionCount,60);
assert.equal(clean.diagnostics[0].observedExpectedSessionCount,60);
assert.match(clean.diagnostics[0].expectedSessionHash,/^[a-f0-9]{64}$/);
assert.match(clean.diagnostics[0].observedSessionHash,/^[a-f0-9]{64}$/);
assert.equal(clean.diagnostics[0].expectedSessionHash,clean.diagnostics[0].observedSessionHash);

const missingDate=expected60[54];
const olderReplacement=calendar61[0];
const substituted=[olderReplacement,...expected60.filter((x)=>x!==missingDate)].sort();
assert.equal(substituted.length,60);

const substitution=await probePitHistoryCoverageV0_1({
  db:fakeDb([row("1101","TWSE",substituted)]),
  snapshotBatch:snapshot(),
  decisionTimestamp:"2026-10-07T07:30:00.000Z",
  requiredPriorSessions:60,
  listingMetadata:listing(),
  priorTradingDates:calendar61,
});
assert.equal(substitution.historyReadyCount,0);
assert.equal(substitution.diagnostics[0].selectedDateCount,60);
assert.equal(substitution.diagnostics[0].missingExpectedSessionCount,1);
assert.equal(substitution.diagnostics[0].unexpectedSessionCount,1);
assert.deepEqual(substitution.diagnostics[0].missingExpectedSessionSample,[missingDate]);
assert.deepEqual(substitution.diagnostics[0].unexpectedSessionSample,[olderReplacement]);
assert.ok(substitution.diagnostics[0].blockerCodes.includes("SYMBOL_LOCAL_EXPECTED_SESSION_MISSING"));
assert.ok(substitution.diagnostics[0].blockerCodes.includes("SYMBOL_LOCAL_UNEXPECTED_SESSION_PRESENT"));
assert.equal(substitution.diagnostics[0].exactSessionReconciliationReady,false);

const resumeDate=expected60[55];
const lifecycleResolved=await probePitHistoryCoverageV0_1({
  db:fakeDb([row("1101","TWSE",substituted)]),
  snapshotBatch:snapshot(),
  decisionTimestamp:"2026-10-07T07:30:00.000Z",
  requiredPriorSessions:60,
  listingMetadata:listing(),
  priorTradingDates:calendar61,
  certifiedNoTradingIntervals:[{
    market:"TWSE",symbol:"1101",
    suspendedFrom:missingDate,resumedOn:resumeDate,
    coverageTo:"2026-10-06",
    sourceRowHash:"OFFICIAL-LIFECYCLE-HASH",
    lifecycleSource:"TWSE_OFFICIAL_ANNOUNCEMENT_UNION",
  }],
});
assert.equal(lifecycleResolved.historyReadyCount,1);
assert.equal(lifecycleResolved.diagnostics[0].missingExpectedSessionCount,0);
assert.equal(lifecycleResolved.diagnostics[0].unexpectedSessionCount,0);
assert.equal(lifecycleResolved.diagnostics[0].lifecycleExcludedSessionCount,1);
assert.equal(lifecycleResolved.diagnostics[0].certifiedLifecycleIntervalCount,1);
assert.equal(lifecycleResolved.diagnostics[0].expectedSessionHash,lifecycleResolved.diagnostics[0].observedSessionHash);

const newListingDates=isoDays("2026-10-01",6); // 10/01..10/06
const newListing=await probePitHistoryCoverageV0_1({
  db:fakeDb([row("7777","TWSE",newListingDates.slice(-3))]),
  snapshotBatch:snapshot("7777","TWSE"),
  decisionTimestamp:"2026-10-07T07:30:00.000Z",
  requiredPriorSessions:60,
  listingMetadata:listing("7777","TWSE","2026-10-04"),
  priorTradingDates:newListingDates,
});
assert.equal(newListing.historyReadyCount,1);
assert.equal(newListing.diagnostics[0].listingAgeLimited,true);
assert.equal(newListing.diagnostics[0].requiredPriorSessionsForSymbol,3);
assert.equal(newListing.diagnostics[0].expectedSessionCount,3);
assert.equal(newListing.diagnostics[0].missingExpectedSessionCount,0);

const noContract=await probePitHistoryCoverageV0_1({
  db:fakeDb([row("1101","TWSE",expected60)]),
  snapshotBatch:snapshot(),
  decisionTimestamp:"2026-10-07T07:30:00.000Z",
  requiredPriorSessions:60,
});
assert.equal(noContract.historyReadyCount,0);
assert.ok(noContract.diagnostics[0].blockerCodes.includes("SYMBOL_LOCAL_EXPECTED_SESSION_CONTRACT_UNAVAILABLE"));

console.log("System2 CORR-004 exact expected-session reconciliation tests passed");
