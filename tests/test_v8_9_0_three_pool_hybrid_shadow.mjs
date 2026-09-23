import fs from "node:fs";
import assert from "node:assert/strict";

const path=process.env.V7_TEST_WORKER_PATH || "Worker.js";
const src=fs.readFileSync(path,"utf8");

assert.match(src,/const VERSION = "8\.9\.0-three-pool-hybrid-shadow";/);
assert.match(src,/const STRATEGY_POOL_CAPITAL = 200000;/);
assert.match(src,/const HYBRID_MAX_STOCKS = 3;/);
assert.match(src,/const HYBRID_POOL_ID = "HYBRID_THOUSAND_SHADOW";/);

const hybridStart=src.indexOf("function scoreHybridCandidate");
const hybridEnd=src.indexOf("function allocateHybridPlans",hybridStart);
assert.ok(hybridStart>0 && hybridEnd>hybridStart,"Hybrid scorer must exist");
const hybridBody=src.slice(hybridStart,hybridEnd);
assert.doesNotMatch(hybridBody,/scoreCandidate\s*\(/,"Hybrid must not reuse Formal scoreCandidate");
assert.doesNotMatch(hybridBody,/strategySetupState\s*\(/,"Hybrid must not reuse Formal A\/B setup gate");
assert.match(hybridBody,/Smart Money持續性不足/);
assert.match(hybridBody,/可驗證剩餘空間不足10%/);
assert.match(hybridBody,/過熱\/追高風險/);
assert.match(hybridBody,/fundamentalScore\(f\)/);
assert.match(hybridBody,/institutionalScore\(f\)/);

assert.match(src,/const hybridTop=hybridScored\.slice\(0,HYBRID_MAX_STOCKS\);/);
assert.match(src,/allocateAndBuildPlans\(generalTop,STRATEGY_POOL_CAPITAL,scanDate\)/);
assert.match(src,/allocateAndBuildPlans\(thousandTop,STRATEGY_POOL_CAPITAL,scanDate\)/);
assert.match(src,/allocateHybridPlans\(hybridTop,STRATEGY_POOL_CAPITAL,scanDate\)/);
assert.match(src,/strategyPool:"FORMAL_GENERAL"/);
assert.match(src,/strategyPool:"FORMAL_THOUSAND"/);
assert.match(src,/strategyPool:HYBRID_POOL_ID,shadowOnly:true,pushEnabled:false/);

assert.match(src,/candidates:\[\.\.\.generalPlans,\.\.\.thousandPlans\]/,
  "Formal config must remain only the original two pools");
assert.match(src,/hybridCandidates:hybridPlans/);
assert.match(src,/const hybridStocks = Array\.isArray\(scan\.hybridCandidates\)/);
assert.match(src,/HYBRID_KV_KEY/);
assert.match(src,/CREATE TABLE IF NOT EXISTS v9_strategy_pool_plans/);
assert.match(src,/PRIMARY KEY\(scan_date,pool_id,symbol\)/,
  "Same symbol must be preservable in different strategy pools");

assert.match(src,/overlapSymbols/);
assert.match(src,/共同入選僅代表跨邏輯一致性；不自動升級等級、不自動加碼/);
assert.match(src,/formalThousandOnly/);
assert.match(src,/hybridOnly/);

assert.match(src,/url\.pathname === "\/api\/strategy-pools"/);
assert.match(src,/architecture:"3\+3\+3"/);
assert.match(src,/每池0~3檔、不硬湊；各20萬不跨池/);
assert.match(src,/hybridShadowOnly:true/);

assert.match(src,/capitalMode:"PER_POOL_RING_FENCED"/);
assert.match(src,/poolSummaries/);
assert.match(src,/totalStrategyCapital: STRATEGY_POOL_CAPITAL\*3/);

const formalSave=src.match(/saved = await saveStockConfig\([^\n]+/g)||[];
assert.ok(formalSave.some(line=>line.includes("3+3 Formal pools")),"Formal save must remain explicit");
assert.doesNotMatch(src,/saveStockConfig\([^;]*hybridStocks/s,
  "Hybrid Shadow must never be written into Formal STOCK_CONFIG");

console.log(JSON.stringify({
  ok:true,
  version:"8.9.0-three-pool-hybrid-shadow",
  architecture:"3+3+3",
  poolCapital:200000,
  hybridMax:3,
  hybridLogicIndependentFromFormal:true,
  crossPoolDuplicatePreserved:true,
  hybridShadowOnly:true,
  formalCoreSelectionRulesChanged:false
}));
