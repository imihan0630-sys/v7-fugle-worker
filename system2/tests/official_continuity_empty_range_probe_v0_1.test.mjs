import assert from "node:assert/strict";
import {
  analyzeOfficialContinuityEmptyRangePayloadV0_1,
  probeOfficialContinuityEmptyRangeV0_1,
  officialContinuityEmptyRangeSourceIdsV0_1,
} from "../runtime/official_continuity_empty_range_probe_v0_1.mjs";

const date = "2026-10-03";

const twseEmpty = JSON.stringify({
  stat: "OK",
  strDate: "20261003",
  endDate: "20261003",
  fields: ["資料日期", "股票代號"],
  data: [],
});
const twse = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  rawText: twseEmpty,
  requestedDate: date,
  httpStatus: 200,
  contentType: "application/json",
});
assert.equal(twse.state, "EXACT_RANGE_ZERO_OBSERVED_UNCERTIFIED");
assert.equal(twse.responseRangeVerified, true);
assert.equal(twse.rowCount, 0);
assert.equal(twse.exactRangeZeroObserved, true);
assert.equal(twse.emptyRangeSemanticsCertified, false);
assert.equal(twse.noEventMayBeClaimed, false);

const tpexEmpty = JSON.stringify({
  stat: "ok",
  date: "2026/10/03~2026/10/03",
  tables: [{ fields: ["日期", "股票代號"], data: [], totalCount: 0 }],
});
const tpex = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  rawText: tpexEmpty,
  requestedDate: date,
});
assert.equal(tpex.state, "EXACT_RANGE_ZERO_OBSERVED_UNCERTIFIED");
assert.equal(tpex.tableCount, 1);
assert.equal(tpex.statusFields.stat, "ok");

const mismatch = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  rawText: JSON.stringify({
    stat: "OK",
    strDate: "20261002",
    endDate: "20261003",
    fields: [],
    data: [],
  }),
  requestedDate: date,
});
assert.equal(mismatch.state, "RANGE_UNVERIFIED");
assert.equal(mismatch.exactRangeZeroObserved, false);
assert.equal(mismatch.noEventMayBeClaimed, false);

const nonzero = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  rawText: JSON.stringify({
    stat: "ok",
    date: "2026/10/03~2026/10/03",
    tables: [{ fields: ["除權息日期", "代號"], data: [["115/10/03", "2330"]] }],
  }),
  requestedDate: date,
});
assert.equal(nonzero.state, "RANGE_VERIFIED_NONZERO_OR_UNUSABLE");
assert.equal(nonzero.rowCount, 1);
assert.equal(nonzero.exactRangeZeroObserved, false);

const ids = officialContinuityEmptyRangeSourceIdsV0_1();
assert.equal(ids.length, 6);

const urls = new Map();
const probe = await probeOfficialContinuityEmptyRangeV0_1({
  requestedDate: date,
  observedAt: "2026-10-03T14:55:00.000Z",
  fetchImpl: async (url) => {
    urls.set(String(url), true);
    const u = String(url);
    const body = u.includes("tpex.org.tw")
      ? JSON.stringify({ stat: "ok", date: "2026/10/03~2026/10/03", tables: [{ fields: [], data: [] }] })
      : JSON.stringify({ stat: "OK", strDate: "20261003", endDate: "20261003", fields: [], data: [] });
    return {
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => body,
    };
  },
});
assert.equal(urls.size, 6);
assert.equal(probe.sourceCount, 6);
assert.equal(probe.exactRangeZeroObservedCount, 6);
assert.equal(probe.allSourcesExactRangeZeroObserved, true);
assert.equal(probe.characterizationOnly, true);
assert.equal(probe.emptyRangeSemanticsCertified, false);
assert.equal(probe.noEventMayBeClaimed, false);
assert.equal(probe.technicalContinuityCertified, false);
assert.equal(probe.selectionAuthority, false);
assert.equal(probe.system1RuntimeUsed, false);

console.log("System2 official continuity empty-range characterization tests passed");
