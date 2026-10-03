import assert from "node:assert/strict";
import {
  analyzeOfficialContinuityEmptyRangePayloadV0_1,
  probeOfficialContinuityEmptyRangeV0_1,
  officialContinuityEmptyRangeSourceIdsV0_1,
  officialContinuityEmptyRangeRulesV0_1,
} from "../runtime/official_continuity_empty_range_probe_v0_1.mjs";

const date = "2026-10-03";

const directTwse = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  rawText: JSON.stringify({
    stat: "OK",
    params: { startDate: "20261003", endDate: "20261003" },
    fields: ["恢復買賣日期", "股票代號"],
    data: [],
  }),
  requestedDate: date,
  requestUrl: "https://example.invalid/a",
  finalUrl: "https://example.invalid/a",
});
assert.equal(directTwse.state, "CERTIFIABLE_EXACT_RANGE_ZERO_SIGNATURE");
assert.equal(directTwse.responseRangeVerified, true);
assert.equal(directTwse.emptySignatureMatched, true);
assert.equal(directTwse.emptyRangeSemanticsCertified, true);
assert.equal(directTwse.noEventMayBeClaimed, false);

const directTpex = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  rawText: JSON.stringify({
    stat: "ok",
    date: "2026/10/03~2026/10/03",
    tables: [{ fields: ["恢復買賣日期", "股票代號"], data: [], totalCount: 0 }],
  }),
  requestedDate: date,
});
assert.equal(directTpex.state, "CERTIFIABLE_EXACT_RANGE_ZERO_SIGNATURE");
assert.equal(directTpex.tableCount, 1);
assert.equal(directTpex.statusFields.stat, "ok");

const mismatch = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  rawText: JSON.stringify({
    stat: "OK",
    params: { startDate: "20261002", endDate: "20261003" },
    fields: [],
    data: [],
  }),
  requestedDate: date,
});
assert.equal(mismatch.state, "RANGE_UNVERIFIED");
assert.equal(mismatch.emptyRangeSemanticsCertified, false);

const redirected = await analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId: "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  rawText: JSON.stringify({
    stat: "ok",
    date: "2026/10/03~2026/10/03",
    tables: [{ fields: [], data: [] }],
  }),
  requestedDate: date,
  requestUrl: "https://example.invalid/requested",
  finalUrl: "https://example.invalid/redirected",
});
assert.equal(redirected.requestIdentityPreserved, false);
assert.equal(redirected.emptyRangeSemanticsCertified, false);

const ids = officialContinuityEmptyRangeSourceIdsV0_1();
assert.equal(ids.length, 6);
const rules = officialContinuityEmptyRangeRulesV0_1();
assert.equal(rules.TWSE_EX_RIGHT_DIVIDEND_ACTUAL.positiveControlDate, "2026-04-08");
assert.equal(rules.TWSE_CAPITAL_REDUCTION_REFERENCE.positiveControlDate, "2026-06-29");

function twsePositive(dateToken) {
  return JSON.stringify({
    stat: "OK",
    strDate: dateToken,
    endDate: dateToken,
    fields: ["資料日期", "股票代號"],
    data: [["fixture", "2330"]],
  });
}

function tpexEmpty() {
  return JSON.stringify({
    stat: "ok",
    date: "2026/10/03~2026/10/03",
    tables: [{ fields: ["日期", "股票代號"], data: [], totalCount: 0 }],
  });
}

const requestedUrls = [];
const probe = await probeOfficialContinuityEmptyRangeV0_1({
  requestedDate: date,
  observedAt: "2026-10-03T15:40:00.000Z",
  fetchImpl: async (url) => {
    const u = String(url);
    requestedUrls.push(u);

    if (u.includes("/exRight/TWT49U")) {
      if (u.includes("startDate=20260408")) {
        return {
          ok: true,
          status: 200,
          url: u,
          headers: { get: () => "application/json" },
          text: async () => twsePositive("20260408"),
        };
      }
      return {
        ok: true,
        status: 200,
        url: u,
        headers: { get: () => "application/json" },
        text: async () => JSON.stringify({ stat: "很抱歉，沒有符合條件的資料!" }),
      };
    }

    if (u.includes("TWTAUU")) {
      if (u.includes("startDate=20260629")) {
        return {
          ok: true,
          status: 200,
          url: u,
          headers: { get: () => "application/json" },
          text: async () => twsePositive("20260629"),
        };
      }
      return {
        ok: true,
        status: 200,
        url: u,
        headers: { get: () => "application/json" },
        text: async () => JSON.stringify({ stat: "很抱歉，沒有符合條件的資料!" }),
      };
    }

    if (u.includes("TWTB8U")) {
      return {
        ok: true,
        status: 200,
        url: u,
        headers: { get: () => "application/json" },
        text: async () => JSON.stringify({
          stat: "OK",
          params: { startDate: "20261003", endDate: "20261003" },
          fields: ["恢復買賣日期", "股票代號"],
          data: [],
        }),
      };
    }

    return {
      ok: true,
      status: 200,
      url: u,
      headers: { get: () => "application/json" },
      text: async () => tpexEmpty(),
    };
  },
});

assert.equal(requestedUrls.length, 8);
assert.equal(probe.sourceCount, 6);
assert.equal(probe.exactRangeZeroObservedCount, 4);
assert.equal(probe.certifiedEmptySourceCount, 6);
assert.equal(probe.emptyRangeSemanticsCertified, true);
assert.equal(probe.sources.find((x) => x.sourceId === "TWSE_EX_RIGHT_DIVIDEND_ACTUAL").certification.positiveControlMatched, true);
assert.equal(probe.sources.find((x) => x.sourceId === "TWSE_CAPITAL_REDUCTION_REFERENCE").certification.positiveControlMatched, true);
assert.equal(probe.noEventMayBeClaimed, false);
assert.equal(probe.revisionCoverageComplete, false);
assert.equal(probe.suspensionCoverageComplete, false);
assert.equal(probe.technicalContinuityCertified, false);
assert.equal(probe.selectionAuthority, false);
assert.equal(probe.system1RuntimeUsed, false);

const badControl = await probeOfficialContinuityEmptyRangeV0_1({
  requestedDate: date,
  observedAt: "2026-10-03T15:41:00.000Z",
  fetchImpl: async (url) => {
    const u = String(url);
    if (u.includes("/exRight/TWT49U") || u.includes("TWTAUU")) {
      return {
        ok: true,
        status: 200,
        url: u,
        headers: { get: () => "application/json" },
        text: async () => JSON.stringify({ stat: "很抱歉，沒有符合條件的資料!" }),
      };
    }
    if (u.includes("TWTB8U")) {
      return {
        ok: true,
        status: 200,
        url: u,
        headers: { get: () => "application/json" },
        text: async () => JSON.stringify({
          stat: "OK",
          params: { startDate: "20261003", endDate: "20261003" },
          fields: [],
          data: [],
        }),
      };
    }
    return {
      ok: true,
      status: 200,
      url: u,
      headers: { get: () => "application/json" },
      text: async () => tpexEmpty(),
    };
  },
});
assert.equal(badControl.emptyRangeSemanticsCertified, false);
assert.equal(badControl.certifiedEmptySourceCount, 4);

console.log("System2 official continuity empty-range certification tests passed");
