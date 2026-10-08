import assert from "node:assert/strict";
import {
  normalizeOfficialDate,
  officialSourceUrl,
  parseOfficialSourcePayload,
  probeOfficialSource,
} from "../runtime/official_source_probes.mjs";

const marketDate = "2026-09-28";
assert.equal(normalizeOfficialDate("1150928"), marketDate);
assert.equal(normalizeOfficialDate("2026/09/28"), marketDate);
assert.match(officialSourceUrl("A3_TPEX_INSTITUTION_FLOW", marketDate), /115%2F09%2F28/);

const twseRows = Array.from({ length: 600 }, (_, index) => ({
  Date: "1150928",
  Code: String(1000 + index),
  ClosingPrice: String(100 + index / 10),
}));
const parsedTwse = parseOfficialSourcePayload("A1_TWSE_DAILY_CLOSE", twseRows, marketDate);
assert.equal(parsedTwse.schemaValid, true);
assert.equal(parsedTwse.payloadDate, marketDate);
assert.equal(parsedTwse.recordCount, 600);
assert.equal(parsedTwse.validationVersion, "S2_A1_DAILY_CLOSE_VALIDATION_V0_2");
assert.deepEqual(parsedTwse.coverageDiagnostics, {
  targetDateOrdinaryRowCount: 600,
  targetDateUniqueOrdinarySymbolCount: 600,
  usableCloseUniqueSymbolCount: 600,
  duplicateTargetSymbolRowCount: 0,
  undatedOrdinaryRowCount: 0,
});

const tpexRows = Array.from({ length: 450 }, (_, index) => ({
  Date: "1150928",
  SecuritiesCompanyCode: String(2000 + index),
  Close: String(50 + index / 10),
}));
const parsedTpex = parseOfficialSourcePayload("A1_TPEX_DAILY_CLOSE", tpexRows, marketDate);
assert.equal(parsedTpex.schemaValid, true);
assert.equal(parsedTpex.payloadDate, marketDate);
assert.equal(parsedTpex.recordCount, 450);
assert.equal(parsedTpex.validationVersion, "S2_A1_DAILY_CLOSE_VALIDATION_V0_2");
assert.equal(parsedTpex.coverageDiagnostics.usableCloseUniqueSymbolCount, 450);


const duplicateTwse = parseOfficialSourcePayload(
  "A1_TWSE_DAILY_CLOSE",
  [...twseRows, { ...twseRows[0] }],
  marketDate,
);
assert.equal(duplicateTwse.schemaValid, false);
assert.equal(duplicateTwse.coverageDiagnostics.duplicateTargetSymbolRowCount, 1);
assert.equal(duplicateTwse.recordCount, 600);

const undatedTwse = parseOfficialSourcePayload(
  "A1_TWSE_DAILY_CLOSE",
  twseRows.map(({ Date, ...row }) => row),
  marketDate,
);
assert.equal(undatedTwse.schemaValid, false);
assert.equal(undatedTwse.payloadDate, null);
assert.equal(undatedTwse.recordCount, 0);
assert.equal(undatedTwse.coverageDiagnostics.undatedOrdinaryRowCount, 600);

const missingCloseTwse = parseOfficialSourcePayload(
  "A1_TWSE_DAILY_CLOSE",
  twseRows.map(({ ClosingPrice, ...row }) => row),
  marketDate,
);
assert.equal(missingCloseTwse.schemaValid, true);
assert.equal(missingCloseTwse.payloadDate, marketDate);
assert.equal(missingCloseTwse.recordCount, 0);
assert.equal(missingCloseTwse.coverageDiagnostics.usableCloseUniqueSymbolCount, 0);

const taiex = parseOfficialSourcePayload("A2_TAIEX_CLOSE", {
  stat: "OK",
  fields: ["日期", "發行量加權股價指數"],
  data: [["115/09/28", "25,000"]],
}, marketDate);
assert.deepEqual(taiex, { schemaValid: true, payloadDate: marketDate, recordCount: 1 });

const institution = parseOfficialSourcePayload("A3_TWSE_INSTITUTION_FLOW", {
  stat: "OK",
  date: "20260928",
  fields: ["證券代號"],
  data: Array.from({ length: 600 }, (_, index) => [String(1000 + index)]),
}, marketDate);
assert.equal(institution.recordCount, 600);
assert.equal(institution.payloadDate, marketDate);

const tpexInstitution = parseOfficialSourcePayload("A3_TPEX_INSTITUTION_FLOW", {
  stat: "OK",
  date: "115/09/28",
  tables: [{
    fields: ["代號"],
    data: Array.from({ length: 450 }, (_, index) => [`="${String(2000 + index)}"`]),
  }],
}, marketDate);
assert.equal(tpexInstitution.recordCount, 450);

let requestOptions;
const nowValues = [
  new Date("2026-09-28T06:00:00Z"),
  new Date("2026-09-28T06:00:01Z"),
];
const ready = await probeOfficialSource({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  marketDate,
  fetchImpl: async (_url, options) => {
    requestOptions = options;
    return {
      ok: true,
      status: 200,
      async json() { return twseRows; },
    };
  },
  now: () => nowValues.shift(),
});
assert.equal(requestOptions.method, "GET");
assert.equal(ready.state, "READY");
assert.equal(ready.validationVersion, "S2_A1_DAILY_CLOSE_VALIDATION_V0_2");
assert.equal(ready.coverageDiagnostics.targetDateUniqueOrdinarySymbolCount, 600);
assert.equal(ready.coverageDiagnostics.usableCloseUniqueSymbolCount, 600);
assert.equal(ready.externalMutationPerformed, false);

const duplicateNow = [
  new Date("2026-09-28T06:02:00Z"),
  new Date("2026-09-28T06:02:01Z"),
];
const duplicateProbe = await probeOfficialSource({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  marketDate,
  fetchImpl: async () => ({
    ok: true,
    status: 200,
    async json() { return [...twseRows, { ...twseRows[0] }]; },
  }),
  now: () => duplicateNow.shift(),
});
assert.equal(duplicateProbe.state, "INVALID_PAYLOAD");
assert.equal(duplicateProbe.coverageDiagnostics.duplicateTargetSymbolRowCount, 1);

const missingCloseNow = [
  new Date("2026-09-28T06:03:00Z"),
  new Date("2026-09-28T06:03:01Z"),
];
const missingCloseProbe = await probeOfficialSource({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  marketDate,
  fetchImpl: async () => ({
    ok: true,
    status: 200,
    async json() { return twseRows.map(({ ClosingPrice, ...row }) => row); },
  }),
  now: () => missingCloseNow.shift(),
});
assert.equal(missingCloseProbe.state, "INVALID_PAYLOAD");
assert.equal(missingCloseProbe.reason, "COVERAGE_BELOW_CONTRACT_MINIMUM");

const errorNow = [
  new Date("2026-09-28T06:10:00Z"),
  new Date("2026-09-28T06:10:01Z"),
];
const failed = await probeOfficialSource({
  sourceId: "A1_TWSE_DAILY_CLOSE",
  marketDate,
  fetchImpl: async () => { throw new Error("network unavailable"); },
  now: () => errorNow.shift(),
});
assert.equal(failed.state, "SOURCE_ERROR");
assert.equal(failed.reason, "NETWORK_ERROR");
assert.notEqual(failed.state, "NOT_READY");


// CORR-20261007-001: Stage1's real source selector must also govern the
// prospective Decision Clock without fabricating an earlier availability time.
const clockDate="2026-09-28";
const exactTwseRows=Array.from({length:600},(_,i)=>({
  market:"TWSE",marketDate:clockDate,symbol:String(1000+i),
  companyName:"Test "+i,open:101,high:104,low:99,close:102,
  volumeShares:150000,tradeValue:15300000,transactions:200,
}));
const exactTpexRows=Array.from({length:450},(_,i)=>({
  market:"TPEX",marketDate:clockDate,symbol:String(2000+i),
  companyName:"Test "+i,open:61,high:64,low:59,close:62,
  volumeShares:60000,tradeValue:3720000,transactions:150,
}));
function exactResult(market,rows,reportedDate=clockDate){
  return {
    state:"READY",market,marketDate:clockDate,rows,
    sourceUrl:market==="TWSE"
      ?"https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20260928&type=ALLBUT0999"
      :"https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?response=json&date=2026%2F09%2F28",
    sourceDateEvidence:reportedDate,sourceDateEvidenceBasis:"PAYLOAD_DATE",
  };
}
const staleTwseRows=twseRows.map(row=>({...row,Date:"1150925"}));
let exactCalls=[];
let clockTicks=0;
const clock=()=>new Date(new Date("2026-09-28T07:25:00Z").getTime()+1000*clockTicks++);
const clockRecovered=await probeOfficialSource({
  sourceId:"A1_TWSE_DAILY_CLOSE",marketDate:clockDate,now:clock,
  fetchImpl:async url=>{
    assert.match(url,/STOCK_DAY_ALL/);
    return {ok:true,status:200,json:async()=>staleTwseRows};
  },
  exactDateFetch:async({market,marketDate})=>{
    exactCalls.push({market,marketDate});
    return exactResult("TWSE",exactTwseRows);
  },
});
assert.equal(clockRecovered.state,"READY");
assert.deepEqual(exactCalls,[{market:"TWSE",marketDate:clockDate}]);
assert.equal(clockRecovered.recordCount,600);
assert.equal(clockRecovered.sourceSelection.selection,"EXACT_DATE_FALLBACK");
assert.equal(clockRecovered.sourceSelection.selectedSourceId,"A1_TWSE_MI_INDEX_EXACT_DATE_PROSPECTIVE");
assert.match(clockRecovered.sourceSelection.selectedSourceUrl,/MI_INDEX/);
assert.equal(clockRecovered.sourceSelection.primary.reportedDates[0],"1150925");
assert.equal(clockRecovered.sourceSelection.fallback.sourceDateEvidence,clockDate);
assert.equal(clockRecovered.sourceSelection.historySessionCloseFinalityUsed,false);
assert.equal(clockRecovered.availableAtSemantics,"FIRST_OBSERVED_READY_UPPER_BOUND_NOT_PUBLISH_TIME");
assert.equal(clockRecovered.validationVersion,"S2_A1_EXACT_DATE_CLOCK_VALIDATION_V0_1");
assert.ok(clockRecovered.observedAt>clockRecovered.probeStartedAt);
assert.equal(clockRecovered.externalMutationPerformed,false);

// Broken latest OpenAPI body must NOT mean the market failed to publish.
const clockTpex=await probeOfficialSource({
  sourceId:"A1_TPEX_DAILY_CLOSE",marketDate:clockDate,
  now:()=>new Date("2026-09-28T07:35:00Z"),
  fetchImpl:async url=>{
    assert.match(url,/tpex_mainboard_daily_close_quotes/);
    return {ok:true,status:200,json:async()=>{throw new Error("truncated OpenAPI JSON")}};
  },
  exactDateFetch:async()=>exactResult("TPEX",exactTpexRows),
});
assert.equal(clockTpex.state,"READY");
assert.equal(clockTpex.recordCount,450);
assert.equal(clockTpex.sourceSelection.selection,"EXACT_DATE_FALLBACK");
assert.equal(clockTpex.sourceSelection.primary.errorCode,"NON_JSON_RESPONSE");
assert.equal(clockTpex.sourceSelection.selectedSourceId,"A1_TPEX_DAILY_QUOTES_EXACT_DATE_PROSPECTIVE");
assert.equal(clockTpex.sourceSelection.sourceDateVerified,true);

// A primary already current must not call the fallback, even when the caller
// provides a throwing exact-date handler.
const noFallback=await probeOfficialSource({
  sourceId:"A1_TWSE_DAILY_CLOSE",marketDate:clockDate,
  now:()=>new Date("2026-09-28T07:37:00Z"),
  fetchImpl:async()=>({ok:true,status:200,json:async()=>twseRows}),
  exactDateFetch:async()=>{throw new Error("correct current primary must never request exact-date fallback")},
});
assert.equal(noFallback.state,"READY");
assert.equal(noFallback.sourceSelection.selection,"PRIMARY_LATEST_OPENAPI_TARGET_DATE");
assert.equal(noFallback.sourceSelection.fallback.attempted,false);

// A stale primary and unverified/missing exact-date evidence stay fail-closed.
const mismatchedExact=await probeOfficialSource({
  sourceId:"A1_TWSE_DAILY_CLOSE",marketDate:clockDate,
  now:()=>new Date("2026-09-28T07:39:00Z"),
  fetchImpl:async()=>({ok:true,status:200,json:async()=>staleTwseRows}),
  exactDateFetch:async()=>exactResult("TWSE",exactTwseRows,"2026-09-25"),
});
assert.notEqual(mismatchedExact.state,"READY");
assert.equal(mismatchedExact.sourceSelection.sourceDateVerified,false);

const failedExact=await probeOfficialSource({
  sourceId:"A1_TWSE_DAILY_CLOSE",marketDate:clockDate,
  now:()=>new Date("2026-09-28T07:41:00Z"),
  fetchImpl:async()=>({ok:true,status:200,json:async()=>staleTwseRows}),
  exactDateFetch:async()=>{throw new Error("SOURCE_DATE_MISMATCH")},
});
assert.equal(failedExact.state,"NOT_READY");
assert.equal(failedExact.sourceSelection.selection,"PRIMARY_NON_TARGET_DATE_FALLBACK_FAILED");
assert.equal(failedExact.sourceSelection.fallback.ok,false);
assert.match(failedExact.sourceSelection.fallback.errorCode,/SOURCE_DATE_MISMATCH/);

// An exact-date payload with unusable close prices does not satisfy the A1 gate.
const missingPrices=await probeOfficialSource({
  sourceId:"A1_TWSE_DAILY_CLOSE",marketDate:clockDate,
  now:()=>new Date("2026-09-28T07:43:00Z"),
  fetchImpl:async()=>({ok:true,status:200,json:async()=>staleTwseRows}),
  exactDateFetch:async()=>exactResult("TWSE",exactTwseRows.map(row=>({...row,close:null}))),
});
assert.equal(missingPrices.state,"INVALID_PAYLOAD");
assert.equal(missingPrices.reason,"COVERAGE_BELOW_CONTRACT_MINIMUM");
assert.equal(missingPrices.recordCount,0);

console.log("System2 official read-only source probe tests passed");
