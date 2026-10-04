import assert from "node:assert/strict";
import { canonicalizeD08ValuationDayV0_1,buildD08ValuationYearPackV0_1,validateD08ValuationYearPackV0_1 } from "../runtime/d08_twse_daily_valuation_year_pack_v0_1.mjs";

function src(observedAt){
  return {
    marketDate:"2005-09-01",state:"READY",sourceDateEvidence:"2005-09-01",
    sourceId:"A6_TWSE_BWIBBU_D_HISTORICAL",sourcePayloadHash:"abc",sourcePayloadBytes:123,
    fieldFingerprint:"證券代號|本益比|股價淨值比",
    observedAt,
    rows:[
      {symbol:"1102",close:20,pe:10,pb:1,peState:"KNOWN",pbState:"KNOWN",fiscalReportPeriod:"94/2",observedAt},
      {symbol:"1101",close:18,pe:null,pb:0.9,peState:"SOURCE_NA_OR_UNKNOWN",pbState:"KNOWN",fiscalReportPeriod:"94/2",observedAt},
    ],
    schemaVersion:"S2_OFFICIAL_HISTORICAL_A6_VALUATION_DATE_V0_1",
  };
}
const a=canonicalizeD08ValuationDayV0_1(src("2026-10-04T01:00:00Z"));
const b=canonicalizeD08ValuationDayV0_1(src("2026-10-04T02:00:00Z"));
assert.equal(a.dayPayloadHash,b.dayPayloadHash,"observer time must not alter canonical day identity");
assert.equal(a.peKnownCount,1);
assert.equal(a.pbKnownCount,2);

const p1=buildD08ValuationYearPackV0_1({
  year:2005,fromDate:"2005-09-01",toDate:"2005-12-31",calendarSource:"TEST",
  dayReceipts:[src("2026-10-04T01:00:00Z")],
});
const p2=buildD08ValuationYearPackV0_1({
  year:2005,fromDate:"2005-09-01",toDate:"2005-12-31",calendarSource:"TEST",
  dayReceipts:[src("2026-10-04T09:00:00Z")],
});
assert.equal(p1.packPayloadHash,p2.packPayloadHash);
assert.equal(validateD08ValuationYearPackV0_1(p1),true);
console.log(JSON.stringify({ok:true,guard:"D08_DAILY_VALUATION_YEAR_PACK",semanticIdempotency:true}));
