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

console.log("System2 official read-only source probe tests passed");
