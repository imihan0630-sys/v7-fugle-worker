import assert from "node:assert/strict";
import { buildD08HistoricalValuationYearPackV0_1,flattenD08HistoricalValuationYearPackV0_1 } from "../runtime/d08_historical_valuation_year_pack_v0_1.mjs";

const mk=(date,hash,rows)=>({
  state:"READY",marketDate:date,sourceDateEvidence:date,
  sourcePayloadHash:hash.repeat(64).slice(0,64),sourcePayloadBytes:100,
  fieldFingerprint:"證券代號|本益比|股價淨值比",rows,
});
const sources=[
  mk("2023-01-03","a",[
    {symbol:"1101",close:30,pe:null,pb:1.1,peState:"SOURCE_NA_OR_UNKNOWN",pbState:"KNOWN",fiscalReportPeriod:"111/3"},
    {symbol:"1102",close:40,pe:10,pb:1.0,peState:"KNOWN",pbState:"KNOWN",fiscalReportPeriod:"111/3"},
  ]),
  mk("2023-01-04","b",[
    {symbol:"1101",close:31,pe:null,pb:1.2,peState:"SOURCE_NA_OR_UNKNOWN",pbState:"KNOWN",fiscalReportPeriod:"111/3"},
    {symbol:"1102",close:41,pe:11,pb:1.1,peState:"KNOWN",pbState:"KNOWN",fiscalReportPeriod:"111/3"},
  ]),
];
const a=buildD08HistoricalValuationYearPackV0_1({year:2023,fromDate:"2023-01-01",toDate:"2023-12-31",dateSources:sources});
const b=buildD08HistoricalValuationYearPackV0_1({year:2023,fromDate:"2023-01-01",toDate:"2023-12-31",dateSources:[...sources].reverse()});
assert.equal(a.payloadHash,b.payloadHash,"date order must not affect canonical year pack");
assert.equal(a.canonical.rowCount,4);
assert.equal(a.canonical.peKnownCount,2);
assert.equal(a.canonical.pbKnownCount,4);
assert.equal(flattenD08HistoricalValuationYearPackV0_1(a.canonical).length,4);
assert.throws(()=>buildD08HistoricalValuationYearPackV0_1({
  year:2023,fromDate:"2023-01-01",toDate:"2023-12-31",dateSources:[sources[0],sources[0]]
}),/duplicate valuation source date/);
console.log(JSON.stringify({ok:true,pack:"D08_TWSE_HISTORICAL_VALUATION_YEAR_PACK_V0_1",canonicalOrder:true,outcomeAccess:false}));
