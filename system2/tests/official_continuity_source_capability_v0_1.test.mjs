import assert from "node:assert/strict";
import {
  buildOfficialContinuitySourceUrlsV0_1,
  probeOfficialContinuitySourceCapabilityV0_1,
} from "../runtime/official_continuity_source_capability_v0_1.mjs";

const urls = buildOfficialContinuitySourceUrlsV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
});

assert.match(urls.TWSE_EX_RIGHT_DIVIDEND_FORECAST.url, /openapi\.twse\.com\.tw\/v1\/exchangeReport\/TWT48U_ALL/);
assert.match(urls.TWSE_EX_RIGHT_DIVIDEND_ACTUAL.url, /\/rwd\/zh\/exRight\/TWT49U/);
assert.match(urls.TWSE_EX_RIGHT_DIVIDEND_ACTUAL.url, /startDate=20260405/);
assert.match(urls.TWSE_EX_RIGHT_DIVIDEND_ACTUAL.url, /endDate=20261002/);
assert.match(urls.TWSE_CAPITAL_REDUCTION_REFERENCE.url, /TWTAUU/);
assert.match(urls.TWSE_PAR_VALUE_CHANGE_REFERENCE.url, /TWTB8U/);
assert.match(urls.TPEX_EX_RIGHT_DIVIDEND_FORECAST.url, /prepost_result\.php/);
assert.match(urls.TPEX_EX_RIGHT_DIVIDEND_ACTUAL.url, /\/www\/zh-tw\/bulletin\/exDailyQ/);
assert.match(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /\/www\/zh-tw\/bulletin\/revivt/);
assert.match(urls.TPEX_PAR_VALUE_CHANGE_REFERENCE.url, /\/www\/zh-tw\/bulletin\/pvChgRslt/);
assert.match(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /startDate=2026%2F04%2F05/);
assert.match(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /endDate=2026%2F10%2F02/);
assert.doesNotMatch(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /revivt_result\.php/);

function response(body, status = 200, contentType = "application/json") {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => String(name).toLowerCase() === "content-type" ? contentType : null },
    text: async () => body,
  };
}

function twseRange(fields, data, extra = {}) {
  return JSON.stringify({
    stat: "OK",
    strDate: "20260405",
    endDate: "20261002",
    fields,
    data,
    ...extra,
  });
}

function tpexRange(fields, data) {
  return JSON.stringify({
    stat: "ok",
    date: "2026/04/05~2026/10/02",
    tables: [{
      fields,
      data,
      totalCount: data.length,
    }],
  });
}

const ready = await probeOfficialContinuitySourceCapabilityV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  observedAt: "2026-10-03T11:40:00.000Z",
  fetchImpl: async (url) => {
    const u = String(url);
    if (u.includes("TWT48U_ALL")) {
      return response(JSON.stringify([
        { Date: "1151005", Code: "2330", Name: "fixture", CashDividend: "5" },
        { Date: "1151006", Code: "2317", Name: "fixture", CashDividend: "0" },
      ]));
    }
    if (u.includes("/exRight/TWT49U")) {
      return response(twseRange(
        ["資料日期", "股票代號", "股票名稱", "除權息前收盤價", "除權息參考價", "權/息"],
        [["115/09/21", "2330", "fixture", "100", "95", "息"]],
      ));
    }
    if (u.includes("TWTAUU")) {
      return response(twseRange(
        ["恢復買賣日期", "股票代號", "名稱", "停止買賣前收盤價格", "恢復買賣參考價", "減資原因"],
        [["115/09/21", "3356", "fixture", "50", "55", "退還股款"]],
      ));
    }
    if (u.includes("TWTB8U")) {
      return response(JSON.stringify({
        stat: "OK",
        params: { startDate: "20260405", endDate: "20261002" },
        fields: ["恢復買賣日期", "股票代號", "名稱", "最後交易日之收盤價格", "恢復買賣開始參考價"],
        data: [["115/09/21", "6548", "fixture", "20", "40"]],
      }));
    }
    if (u.includes("prepost_result.php")) {
      return response(
        "除權息日期,股票代號,名稱,現金股利\n115/10/05,6488,fixture,2.5\n",
        200,
        "text/csv",
      );
    }
    if (u.includes("/bulletin/exDailyQ")) {
      return response(tpexRange(
        ["除權息日期", "代號", "名稱", "除權息前收盤價", "除權息參考價", "權/息"],
        [["115/09/21", "6488", "fixture", "500", "490", "息"]],
      ));
    }
    if (u.includes("/bulletin/revivt")) {
      return response(tpexRange(
        ["恢復買賣日期", "股票代號", "名稱", "停止買賣前收盤價格", "恢復買賣參考價", "減資原因"],
        [["115/09/21", "4530", "fixture", "20", "25", "彌補虧損"]],
      ));
    }
    if (u.includes("/bulletin/pvChgRslt")) {
      return response(tpexRange(
        ["恢復買賣日期", "股票代號", "名稱", "最後交易日之收盤價格", "恢復買賣開始參考價"],
        [["115/09/21", "5314", "fixture", "30", "60"]],
      ));
    }
    throw new Error("unexpected fixture URL " + u);
  },
});

assert.equal(ready.version, "0.2-RESEARCH");
assert.equal(ready.state, "OFFICIAL_SOURCE_CANDIDATES_OBSERVED");
assert.equal(ready.sourceCount, 8);
assert.equal(ready.structureReadyCount, 8);
assert.equal(ready.historicalRangeSourceCount, 6);
assert.equal(ready.historicalRangeReadyCount, 6);
assert.equal(ready.readyByExchange.TWSE, 4);
assert.equal(ready.readyByExchange.TPEX, 4);
assert.equal(ready.historicalRangeReadyByExchange.TWSE, 3);
assert.equal(ready.historicalRangeReadyByExchange.TPEX, 3);
assert.equal(ready.sources.TWSE_EX_RIGHT_DIVIDEND_FORECAST.ordinarySymbolCount, 2);
assert.equal(ready.sources.TWSE_EX_RIGHT_DIVIDEND_ACTUAL.responseRangeVerified, true);
assert.equal(ready.sources.TWSE_CAPITAL_REDUCTION_REFERENCE.responseRangeVerified, true);
assert.equal(ready.sources.TWSE_PAR_VALUE_CHANGE_REFERENCE.responseRangeVerified, true);
assert.equal(ready.sources.TPEX_EX_RIGHT_DIVIDEND_FORECAST.ordinarySymbolCount, 1);
assert.equal(ready.sources.TPEX_EX_RIGHT_DIVIDEND_ACTUAL.parser, "JSON_TABLES");
assert.equal(ready.sources.TPEX_EX_RIGHT_DIVIDEND_ACTUAL.responseRangeVerified, true);
assert.equal(ready.sources.TPEX_CAPITAL_REDUCTION_REFERENCE.parser, "JSON_TABLES");
assert.equal(ready.sources.TPEX_CAPITAL_REDUCTION_REFERENCE.responseRangeVerified, true);
assert.equal(ready.sources.TPEX_PAR_VALUE_CHANGE_REFERENCE.parser, "JSON_TABLES");
assert.equal(ready.sources.TPEX_PAR_VALUE_CHANGE_REFERENCE.responseRangeVerified, true);
assert.equal(ready.historicalActualRangeCandidateObserved, true);
assert.equal(ready.legacyTpexCapitalReductionTransportRetired, true);
assert.equal(ready.sourceCoverageComplete, false);
assert.equal(ready.noEventMayBeClaimed, false);
assert.equal(ready.symbolSessionCompletenessCertified, false);
assert.equal(ready.technicalContinuityCertified, false);
assert.equal(ready.continuityTransformPerformed, false);
assert.equal(ready.historyMutationPerformed, false);
assert.equal(ready.strategyEvaluationPerformed, false);
assert.equal(ready.capacityRunProduced, false);
assert.equal(ready.zeroPickClaimed, false);
assert.equal(ready.selectionAuthority, false);
assert.equal(ready.finalSelectionEnabled, false);
assert.equal(ready.livePushEnabled, false);
assert.equal(ready.capitalImpact, false);
assert.equal(ready.orderImpact, false);
assert.equal(ready.system1RuntimeUsed, false);

const partial = await probeOfficialContinuitySourceCapabilityV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  observedAt: "2026-10-03T11:40:00.000Z",
  fetchImpl: async (url) => {
    const u = String(url);
    if (u.includes("TWT48U_ALL")) {
      return response(JSON.stringify([{ Date: "1151005", Code: "2330" }]));
    }
    if (u.includes("/exRight/TWT49U")) {
      return response(twseRange(["資料日期", "股票代號"], [["115/09/21", "2330"]]));
    }
    if (u.includes("TWTAUU")) {
      return response(twseRange(["恢復買賣日期", "股票代號"], [["115/09/21", "3356"]]));
    }
    if (u.includes("TWTB8U")) {
      return response(JSON.stringify({
        stat: "OK",
        params: { startDate: "20260406", endDate: "20261002" },
        fields: ["恢復買賣日期", "股票代號"],
        data: [["115/09/21", "6548"]],
      }));
    }
    return response("forbidden", 403, "text/plain");
  },
});

assert.equal(partial.state, "OFFICIAL_SOURCE_CANDIDATES_PARTIAL");
assert.equal(partial.sources.TWSE_PAR_VALUE_CHANGE_REFERENCE.state, "STRUCTURE_RANGE_UNVERIFIED");
assert.equal(partial.sources.TWSE_PAR_VALUE_CHANGE_REFERENCE.errorCode, "RESPONSE_RANGE_NOT_VERIFIED");
assert.equal(partial.sources.TPEX_EX_RIGHT_DIVIDEND_FORECAST.state, "HTTP_BLOCKED_OR_ERROR");
assert.equal(partial.sources.TPEX_EX_RIGHT_DIVIDEND_FORECAST.errorCode, "AUTH_OR_EDGE_BLOCKED");
assert.equal(partial.technicalContinuityCertified, false);
assert.equal(partial.noEventMayBeClaimed, false);

await assert.rejects(
  probeOfficialContinuitySourceCapabilityV0_1({
    startDate: "2026-10-03",
    endDate: "2026-10-02",
    observedAt: "2026-10-03T11:40:00.000Z",
    fetchImpl: async () => response("[]"),
  }),
  /endDate cannot be earlier/,
);

console.log("System2 official continuity source capability probe tests passed");
