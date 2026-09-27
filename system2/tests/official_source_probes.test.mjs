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
}));
const parsedTwse = parseOfficialSourcePayload("A1_TWSE_DAILY_CLOSE", twseRows, marketDate);
assert.deepEqual(parsedTwse, { schemaValid: true, payloadDate: marketDate, recordCount: 600 });

const tpexRows = Array.from({ length: 450 }, (_, index) => ({
  Date: "1150928",
  SecuritiesCompanyCode: String(2000 + index),
}));
const parsedTpex = parseOfficialSourcePayload("A1_TPEX_DAILY_CLOSE", tpexRows, marketDate);
assert.deepEqual(parsedTpex, { schemaValid: true, payloadDate: marketDate, recordCount: 450 });

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
assert.equal(ready.externalMutationPerformed, false);

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
