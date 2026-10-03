import assert from "node:assert/strict";
import {
  summarizeTwseSuspensionOpenApiV0_1,
  extractScriptUrlsV0_1,
  discoverSuspensionMachineHintsV0_1,
} from "../runtime/official_suspension_source_discovery_v0_1.mjs";

const twse = await summarizeTwseSuspensionOpenApiV0_1(JSON.stringify([
  {
    "證券代號": "2330",
    "證券名稱": "台積電",
    "暫停交易日期": "2026/10/01",
    "恢復交易日期": "2026/10/02"
  }
]));
assert.equal(twse.state, "JSON_OBJECT_ARRAY_OBSERVED");
assert.equal(twse.rowCount, 1);
assert.equal(twse.codeKey, "證券代號");
assert.equal(twse.machineFieldContractReady, true);
assert.equal(twse.noSuspensionMayBeClaimed, false);

const scripts = extractScriptUrlsV0_1(
  '<script src="/js/app.js"></script><script src="https://cdn.example.com/x.js"></script>',
  "https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html",
);
assert.deepEqual(scripts, [
  "https://www.tpex.org.tw/js/app.js",
  "https://cdn.example.com/x.js",
]);

const hints = discoverSuspensionMachineHintsV0_1({
  pageUrl: "https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html",
  pageHtml: '<div data-api="/www/zh-tw/announce/market/halt/history?response=json"></div>',
  scriptBodies: [{
    url: "https://www.tpex.org.tw/js/app.js",
    body: 'const u="/www/zh-tw/announce/market/halt/list?response=json";',
  }],
});
assert.ok(hints.hintCount >= 2);
assert.equal(hints.exactMachineEndpointFrozen, false);
assert.equal(hints.sourceCoverageComplete, false);
assert.equal(hints.symbolSessionCompletenessCertified, false);
assert.equal(hints.system1RuntimeUsed, false);

const bad = await summarizeTwseSuspensionOpenApiV0_1("<html>not json</html>");
assert.equal(bad.state, "PAYLOAD_PARSE_ERROR");
assert.equal(bad.machineFieldContractReady, false);

console.log("System2 official suspension source discovery tests passed");
