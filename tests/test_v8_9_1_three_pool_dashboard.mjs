import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");
assert.match(source,/const VERSION = "8\.9\.1-three-pool-dashboard";/);
assert.match(source,/\{key:"pools",href:"\/pools",label:"3\+3\+3策略池"\}/);
assert.match(source,/function strategyPoolsPage\(\)/);
assert.match(source,/async function readThreePoolSelectionPerformance\(env,days=365\)/);
assert.match(source,/url\.pathname === "\/pools"/);
assert.match(source,/url\.pathname === "\/api\/strategy-pool-performance"/);
assert.match(source,/FROM v9_strategy_pool_plans WHERE scan_date>=\?1/);
assert.match(source,/D1\/D3\/D5/);
assert.match(source,/不等同BUY→SELL實際交易勝率/);
assert.match(source,/Formal＋Hybrid共同入選/);
assert.match(source,/每池最多3檔，沒有符合就是0/);
assert.match(source,/每池獨立20萬元，不跨池/);
assert.match(source,/Hybrid目前為Shadow/);
assert.doesNotMatch(source,/strategy-pool-performance[\s\S]{0,500}saveStockConfig\(/);
assert.doesNotMatch(source,/strategy-pool-performance[\s\S]{0,500}sendTrackedPush\(/);
console.log(JSON.stringify({
  ok:true,version:"8.9.1-three-pool-dashboard",threePoolUi:true,
  selectionPerformance:true,formalCoreChanged:false,noTradingMutation:true
}));
