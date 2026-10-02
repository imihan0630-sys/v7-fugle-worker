import fs from "node:fs";
import assert from "node:assert/strict";

const base=fs.readFileSync("Worker.js","utf8");
const patch=fs.readFileSync("scripts/apply_v8_5_0.py","utf8");

const savePos=base.indexOf('saved = await saveStockConfig(env, stocks, "Phase 4.3 A/B Strategy Rebase After-market Scan", totalCapital)');
const historyPos=base.indexOf('const historySeedState = await readHistorySeedState(env);');
assert.ok(savePos>=0&&historyPos>savePos,"base after-market order changed; re-audit required");

assert.ok(patch.includes('const journal = !dryRun ? await recordTradeJournalDay('),"V8.5 journal insertion missing");
assert.ok(patch.includes('const historySeedState = await readHistorySeedState(env);'),"V8.5 journal anchor changed");
assert.ok(patch.includes('catch(error) {\n    console.warn("TRADE_JOURNAL_PLAN_WRITE_FAILED",String(error));\n    return {stored:false,verified:false,scanDate,error:String(error)};'),"journal plan failure semantics changed");
assert.ok(patch.includes('planScanDate:p?.closeDate||null'),"signal planScanDate lineage changed");

console.log(JSON.stringify({
  ok:true,
  contract:"CROSS_STORE_WRITE_ASYMMETRY_SOURCE_V0_1",
  finding:"monitor config is saved before the V8.5 journal-day insertion point; journal-day write failure returns stored:false rather than aborting the full scan; signal planScanDate is copied from plan.closeDate",
  implication:"config/scan success with a later BUY signal can coexist with missing D1 journal day/plan evidence"
},null,2));
