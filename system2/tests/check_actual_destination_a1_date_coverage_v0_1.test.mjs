import test from "node:test";
import assert from "node:assert/strict";
import {createActualA1CoverageReceiptV0_1 as make}
 from "../scripts/check_actual_destination_a1_date_coverage_v0_1.mjs";
const group=(market,date,n,flag=0)=>({
 market_date:date,market,physical_rows:n,distinct_symbols:n,flags_pit_eligible:flag
});
const date="2026-10-12",utc="2026-10-12T13:10:00.000Z";
function fixture(){
 return {
  marketDate:date,observedAtUtc:utc,
  total:{physical_rows:11785,distinct_market_dates:8,
   first_market_date:"2024-02-02",last_market_date:"2024-02-15"},
  groups:[group("TWSE","2024-02-15",30),group("TPEX","2024-02-15",20)],
  frozen:{physical_decisions:0},
  accountFingerprint:"a".repeat(64),dbFingerprint:"b".repeat(64),
  providerReadCount:25679
 };
}
test("real destination A1 imported historical rows do not certify 2026 picks",()=>{
 const r=make(fixture());
 assert.equal(r.d1TotalPhysicalBars,11785);
 assert.equal(r.tradingDayA1Rows.twse,0);
 assert.equal(r.tradingDayA1Rows.tpex,0);
 assert.equal(r.realFrozenDecisionCount,0);
 assert.equal(r.sourceCoverage,"ONE_OR_BOTH_MARKETS_CURRENT_DAY_D1_DATA_MISSING");
 assert.equal(r.strategyActuallyExecuted,false);
 assert.equal(r.actualSelectedCount,null);
 assert.equal(r.evidenceBasedZeroPickDay,null);
 assert.equal(r.newFrozenDecisionWritten,false);
 assert.equal(r.realProviderD1BilledRowsWritten,0);
});
test("two markets physical rows are still NOT certified PIT or selection",()=>{
 const p=fixture();
 p.total={physical_rows:1900,distinct_market_dates:1,
 first_market_date:date,last_market_date:date};
 p.groups=[group("TWSE",date,1050,0),group("TPEX",date,850,0)];
 const r=make(p);
 assert.equal(r.sourceCoverage,"BOTH_MARKETS_PHYSICAL_ROWS_PRESENT_PIT_STILL_UNVERIFIED");
 assert.equal(r.actual61SessionPITWindowIndependentlyVerified,false);
 assert.equal(r.actualSelectedCount,null);
});
test("PIT flags are merely stored metadata and cannot auto-certify publication",()=>{
 const p=fixture();
 p.groups=[group("TWSE",date,1050,1050),group("TPEX",date,850,850)];
 const r=make(p);
 assert.equal(r.tradingDayPITFlaggedRows.twse,1050);
 assert.equal(r.actual61SessionPITWindowIndependentlyVerified,false);
});
test("unknown symbol denominator never qualifies zero-pick",()=>{
 const p=fixture();p.groups=[];
 const r=make(p);
 assert.equal(r.evidenceBasedZeroPickDay,null);
 assert.equal(r.actualSelectedCount,null);
});
test("duplicate market date group must fail",()=>{
 const p=fixture();p.groups=[group("TWSE","2024-02-15",10),group("TWSE","2024-02-15",12)];
 assert.throws(()=>make(p),/DUPLICATED_OR_UNSORTED/);
});
test("fake greater PIT qualifying flag than physical rows must fail",()=>{
 const p=fixture();p.groups=[group("TWSE","2024-02-15",8,9)];
 assert.throws(()=>make(p),/ROW_SHAPE_INVALID/);
});
test("reverse/unsorted market-day groups are rejected",()=>{
 const p=fixture();p.groups=[group("TWSE","2024-02-14",10),group("TWSE","2024-02-15",8)];
 assert.throws(()=>make(p),/DUPLICATED_OR_UNSORTED/);
});
test("non-stock market tag is rejected",()=>{
 const p=fixture();p.groups=[group("NYSE","2024-02-15",8)];
 assert.throws(()=>make(p),/ROW_SHAPE_INVALID/);
});
test("negative count and unsafe UTC clock fail",()=>{
 const p=fixture();p.frozen.physical_decisions=-1;
 assert.throws(()=>make(p),/COUNTS_UNVERIFIED/);
 const q=fixture();q.observedAtUtc="garbage";
 assert.throws(()=>make(q),/DATE_OR_TIMESTAMP_INVALID/);
});
test("every source row shall be accounted only as bar count; no made up 61 sessions",()=>{
 const p=fixture();p.total.distinct_market_dates=1;
 const r=make(p);
 assert.equal(r.d1DistinctMarketDates,1);
 assert.equal(r.actual61SessionPITWindowIndependentlyVerified,false);
});
