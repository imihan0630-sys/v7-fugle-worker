import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");

assert.match(source,/const VERSION = "8\.10\.1-history-freshness-guard";/);
assert.match(source,/const AIDEEN_POOL_ID = "AIDEEN_APP";/);
assert.match(source,/const AIDEEN_MAX_STOCKS = 5;/);
assert.match(source,/const AIDEEN_KV_KEY = "V10_AIDEEN_APP_POOL";/);

assert.match(source,/url\.pathname === "\/aideen"/);
assert.match(source,/url\.pathname === "\/api\/aideen-pool"/);
assert.match(source,/url\.pathname === "\/api\/aideen-performance"/);
assert.match(source,/label:"愛德恩App池"/);

const normalizeStart=source.indexOf("function normalizeAideenSelected");
const normalizeEnd=source.indexOf("function allocateAideenPlans",normalizeStart);
assert.ok(normalizeStart>0 && normalizeEnd>normalizeStart);
const normalizeBody=source.slice(normalizeStart,normalizeEnd);
assert.match(normalizeBody,/appLogicPassed!==true/);
assert.match(normalizeBody,/secondaryReviewPassed!==true/);
assert.match(normalizeBody,/selectionLogic:"AIDEEN_NATIVE_FIRST_THEN_SECONDARY_REVIEW"/);
assert.doesNotMatch(normalizeBody,/scoreCandidate\s*\(/);
assert.doesNotMatch(normalizeBody,/strategySetupState\s*\(/);
assert.doesNotMatch(normalizeBody,/scoreHybridCandidate\s*\(/);

assert.match(source,/最多\$\{AIDEEN_MAX_STOCKS\}檔，不硬湊/);
assert.match(source,/AIDEEN_NATIVE_FIRST；不套Formal A\/B資格門檻/);
assert.match(source,/currentBaseCapital\(env\)/);
assert.match(source,/recalculateAideenCapital\(env, capital\)/);
assert.match(source,/monitoringStocks=\[\.\.\.\(loaded\.stocks\|\|\[\]\),\.\.\.\(aideen\.stocks\|\|\[\]\)\]/);
assert.match(source,/aideenSignalStateKey\(result\)/);
assert.match(source,/\$\{AIDEEN_POOL_ID\}:\$\{symbol\}/);
assert.match(source,/formalMonitoredCount/);
assert.match(source,/aideenMonitoredCount/);

assert.match(source,/CREATE TABLE IF NOT EXISTS v10_aideen_candidates/);
assert.match(source,/archiveStrategyPools\(env,marketDate,\{\[AIDEEN_POOL_ID\]:stocks\}\)/);
assert.match(source,/pool_id IN \('FORMAL_GENERAL','FORMAL_THOUSAND','HYBRID_THOUSAND_SHADOW'\)/);
assert.match(source,/pool_id=\?2/);

assert.doesNotMatch(source,/saveStockConfig\([^;]*AIDEEN_APP/s);
assert.match(source,/與3\+3\+3完全隔離/);

console.log(JSON.stringify({
  ok:true,
  version:"8.10.1-history-freshness-guard",
  pool:"AIDEEN_APP",
  maxStocks:5,
  followsBaseCapital:true,
  nativeAppLogicFirst:true,
  formalCoreChanged:false,
  threePoolPerformanceIsolated:true,
  signalStateIsolated:true
}));
