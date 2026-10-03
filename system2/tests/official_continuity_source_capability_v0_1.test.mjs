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
assert.match(urls.TWSE_CAPITAL_REDUCTION_REFERENCE.url, /TWTAUU/);
assert.match(urls.TWSE_CAPITAL_REDUCTION_REFERENCE.url, /startDate=20260405/);
assert.match(urls.TWSE_CAPITAL_REDUCTION_REFERENCE.url, /endDate=20261002/);
assert.match(urls.TPEX_EX_RIGHT_DIVIDEND_FORECAST.url, /tpex\.org\.tw/);
assert.match(urls.TPEX_EX_RIGHT_DIVIDEND_FORECAST.url, /prepost_result\.php/);
assert.match(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /revivt_result\.php/);
assert.match(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /d=115%2F04%2F05/);
assert.match(urls.TPEX_CAPITAL_REDUCTION_REFERENCE.url, /ed=115%2F10%2F02/);

function response(body, status = 200, contentType = "application/json") {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => String(name).toLowerCase() === "content-type" ? contentType : null },
    text: async () => body,
  };
}

const ready = await probeOfficialContinuitySourceCapabilityV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  observedAt: "2026-10-03T11:20:00.000Z",
  fetchImpl: async (url) => {
    const u = String(url);
    if (u.includes("TWT48U_ALL")) {
      return response(JSON.stringify([
        { Date: "1151005", Code: "2330", Name: "fixture", CashDividend: "5" },
        { Date: "1151006", Code: "2317", Name: "fixture", CashDividend: "0" },
      ]));
    }
    if (u.includes("TWTAUU")) {
      return response(JSON.stringify({
        stat: "OK",
        fields: ["恢復買賣日期", "股票代號", "名稱", "停止買賣前收盤價", "恢復買賣參考價", "減資原因"],
        data: [["115/09/21", "3356", "fixture", "50", "55", "退還股款"]],
      }));
    }
    if (u.includes("prepost_result.php")) {
      return response(
        "除權息日期,股票代號,名稱,現金股利\n115/10/05,6488,fixture,2.5\n",
        200,
        "text/csv",
      );
    }
    if (u.includes("revivt_result.php")) {
      return response(
        "<!doctype html>\n<meta charset=\"utf-8\">\n"
          + "恢復買賣日期,股票代號,名稱,停止買賣前收盤價,恢復買賣參考價\n"
          + "115/09/21,4530,fixture,20,25\n"
          + "<footer>legacy envelope</footer>\n",
        200,
        "text/html",
      );
    }
    throw new Error("unexpected fixture URL " + u);
  },
});

assert.equal(ready.state, "OFFICIAL_SOURCE_CANDIDATES_OBSERVED");
assert.equal(ready.sourceCount, 4);
assert.equal(ready.structureReadyCount, 4);
assert.equal(ready.readyByExchange.TWSE, 2);
assert.equal(ready.readyByExchange.TPEX, 2);
assert.equal(ready.sources.TWSE_EX_RIGHT_DIVIDEND_FORECAST.ordinarySymbolCount, 2);
assert.equal(ready.sources.TWSE_CAPITAL_REDUCTION_REFERENCE.ordinarySymbolCount, 1);
assert.equal(ready.sources.TPEX_EX_RIGHT_DIVIDEND_FORECAST.ordinarySymbolCount, 1);
assert.equal(ready.sources.TPEX_CAPITAL_REDUCTION_REFERENCE.ordinarySymbolCount, 1);\nassert.equal(ready.sources.TPEX_CAPITAL_REDUCTION_REFERENCE.parser, "CSV_EMBEDDED_HTML");
assert.equal(ready.prospectiveDiscoveryCandidateObserved, true);
assert.equal(ready.historicalReferenceCandidateObserved, true);
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
  observedAt: "2026-10-03T11:20:00.000Z",
  fetchImpl: async (url) => {
    const u = String(url);
    if (u.includes("openapi.twse.com.tw")) {
      return response(JSON.stringify([{ Date: "1151005", Code: "2330" }]));
    }
    if (u.includes("TWTAUU")) {
      return response("<!doctype html><html><body>edge page</body></html>", 200, "text/html");
    }
    return response("forbidden", 403, "text/plain");
  },
});

assert.equal(partial.state, "OFFICIAL_SOURCE_CANDIDATES_PARTIAL");
assert.equal(partial.structureReadyCount, 1);
assert.equal(partial.sources.TWSE_CAPITAL_REDUCTION_REFERENCE.state, "UNEXPECTED_HTML");
assert.equal(partial.sources.TPEX_EX_RIGHT_DIVIDEND_FORECAST.state, "HTTP_BLOCKED_OR_ERROR");
assert.equal(partial.sources.TPEX_EX_RIGHT_DIVIDEND_FORECAST.errorCode, "AUTH_OR_EDGE_BLOCKED");
assert.equal(partial.technicalContinuityCertified, false);
assert.equal(partial.noEventMayBeClaimed, false);

await assert.rejects(
  probeOfficialContinuitySourceCapabilityV0_1({
    startDate: "2026-10-03",
    endDate: "2026-10-02",
    observedAt: "2026-10-03T11:20:00.000Z",
    fetchImpl: async () => response("[]"),
  }),
  /endDate cannot be earlier/,
);

console.log("System2 official continuity source capability probe tests passed");
