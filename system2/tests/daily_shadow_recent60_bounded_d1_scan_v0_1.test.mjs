import assert from "node:assert/strict";
import { probePitHistoryCoverageV0_1 } from "../runtime/daily_shadow_history_reader_v0_1.mjs";

const marketDate="2026-10-08";
const clock="2026-10-08T08:00:00Z";
const dates=Array.from({length:61},(_,i)=>{
  const day=new Date(Date.UTC(2026,6,1+i));
  return day.toISOString().slice(0,10);
});
const symbol="2330";
const snapshotBatch={
  marketDate,ordinarySymbolCount:1,symbols:[symbol],
  bySymbol:{[symbol]:{market:"TWSE"}},
};
const listing={state:"READY",byMarketSymbol:{"TWSE|2330":{listingDate:"1962-02-09"}}};

function fakeDb(rows=[]){
  const traces=[];
  return {
    traces,
    prepare(sql){
      return {bind(...params){
        traces.push({sql,params});
        return {async all(){return {results:rows};}};
      }};
    },
  };
}
const empty=fakeDb();
const bounded=await probePitHistoryCoverageV0_1({
  db:empty,snapshotBatch,decisionTimestamp:clock,
  priorTradingDates:dates,listingMetadata:listing,requiredPriorSessions:60,
});
assert.equal(empty.traces.length,1);
assert.match(empty.traces[0].sql,/AND market_date >= \?/);
assert.deepEqual(empty.traces[0].params,[symbol,marketDate,"RAW",clock,dates[0],60]);
assert.equal(bounded.coverageReadScanScope,"EXACT_SESSION_CALENDAR_BOUNDED");
assert.equal(bounded.coverageReadLowerBound,dates[0]);
assert.equal(bounded.coverageReadPlan,"SYMBOL_INDEX_SCOPED_BOUNDED_50");
assert.equal(bounded.coverageSelectCount,1);
assert.equal(bounded.coverageSymbolCount,1);
assert.equal(bounded.historyReadyCount,0,"query bounding cannot manufacture missing PIT history");
assert.equal(bounded.continuityReadyCount,0);
assert.equal(bounded.diagnostics[0].missingExpectedSessionCount,60);

const fullRows=[{
  symbol,market:"TWSE",selected_date_count:60,ambiguous_date_count:0,
  continuity_eligible_count:0,first_selected_date:dates[1],
  last_selected_date:dates[60],selected_dates_csv:dates.slice(1).join(","),
}];
const full=fakeDb(fullRows);
const ready=await probePitHistoryCoverageV0_1({
  db:full,snapshotBatch,decisionTimestamp:clock,
  priorTradingDates:dates,listingMetadata:listing,requiredPriorSessions:60,
});
assert.equal(ready.historyReadyCount,1,"valid 60-date PIT set remains history-ready");
assert.equal(ready.continuityReadyCount,0,"no certified continuity remains blocked");
assert.equal(ready.selectionDenominatorComplete,false);

const noCalendar=fakeDb();
const legacy=await probePitHistoryCoverageV0_1({
  db:noCalendar,snapshotBatch,decisionTimestamp:clock,
  priorTradingDates:null,listingMetadata:listing,requiredPriorSessions:60,
});
assert.doesNotMatch(noCalendar.traces[0].sql,/AND market_date >= \?/);
assert.deepEqual(noCalendar.traces[0].params,[symbol,marketDate,"RAW",clock,60]);
assert.equal(legacy.coverageReadLowerBound,null);
assert.equal(legacy.coverageReadScanScope,"UNBOUNDED_LEGACY_FAIL_CLOSED");
assert.equal(legacy.historyReadyCount,0);

const short=fakeDb();
const insufficient=await probePitHistoryCoverageV0_1({
  db:short,snapshotBatch,decisionTimestamp:clock,
  priorTradingDates:dates.slice(0,59),listingMetadata:listing,requiredPriorSessions:60,
});
assert.doesNotMatch(short.traces[0].sql,/AND market_date >= \?/);
assert.deepEqual(short.traces[0].params,[symbol,marketDate,"RAW",clock,60]);
assert.equal(insufficient.coverageReadScanScope,"UNBOUNDED_LEGACY_FAIL_CLOSED");
assert.equal(insufficient.historyReadyCount,0);
assert.equal(insufficient.diagnostics[0].sessionReconciliationState,"EXPECTED_SESSION_CALENDAR_WINDOW_INSUFFICIENT");

const noListing=fakeDb();
const blocked=await probePitHistoryCoverageV0_1({
  db:noListing,snapshotBatch,decisionTimestamp:clock,
  priorTradingDates:dates,listingMetadata:null,requiredPriorSessions:60,
});
assert.doesNotMatch(noListing.traces[0].sql,/AND market_date >= \?/);
assert.equal(blocked.coverageReadLowerBound,null);
assert.equal(blocked.historyReadyCount,0);

console.log("Recent60 exact-session bounded D1 PIT coverage scan tests passed");
