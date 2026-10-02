import fs from "node:fs";
import assert from "node:assert/strict";

const patch=fs.readFileSync("scripts/apply_v8_9_8.py","utf8");
const routeStart=patch.indexOf('if (url.pathname === "/api/scan/stage-selection")');
assert.ok(routeStart>=0,"staged recovery route missing");
const routeEnd=patch.indexOf("insert_before_once(route_marker,route",routeStart);
const route=patch.slice(routeStart,routeEnd>routeStart?routeEnd:patch.length);

assert.ok(route.includes('saveStockConfig(env,formal,"Staged historical recovery from verified dry-run",STRATEGY_POOL_CAPITAL)'));
assert.ok(route.includes('await env.STOCKS_KV.put(LAST_SCAN_KEY'));
assert.ok(route.includes('archiveStrategyPools(env,date'));
assert.equal(route.includes("recordTradeJournalDay("),false,"staged recovery unexpectedly gained D1 trade-journal persistence; re-audit required");

const poolPatch=fs.readFileSync("scripts/apply_v8_9_0.py","utf8");
assert.ok(poolPatch.includes("const STRATEGY_POOL_CAPITAL = 200000;"));

console.log(JSON.stringify({
  ok:true,
  contract:"STAGED_RECOVERY_JOURNAL_COVERAGE_GAP_V0_1",
  finding:"stage-selection persists config/LAST_SCAN/archives with NT$200k strategy-pool capital but bypasses recordTradeJournalDay"
},null,2));
