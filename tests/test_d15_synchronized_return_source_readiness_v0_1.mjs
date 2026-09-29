import assert from "node:assert/strict";
import fs from "node:fs";

const observer=JSON.parse(fs.readFileSync("research/technical_indicator_fixed_cadence_observations_20260930.json","utf8"));
const continuity=JSON.parse(fs.readFileSync("research/technical_indicator_continuity_handoff_v0_1.json","utf8"));
const worker=fs.readFileSync("Worker.js","utf8");
const v812=fs.readFileSync("scripts/apply_v8_12_0.py","utf8");
const regression=fs.readFileSync(".github/workflows/v7-regression.yml","utf8");
const deploy=fs.readFileSync(".github/workflows/v7-cloudflare.yml","utf8");

assert.equal(observer.policy.rawPayloadPersistence,"TRANSIENT_ONLY_COMPACT_HASH_RECEIPT");
assert.notEqual(observer.summary.corporateActionAncestry,"READY");
assert.notEqual(observer.summary.certifiedSymbolSessionReceipt,"READY");
assert.equal(continuity.rawAdmissionIsContinuity,false);
assert.equal(continuity.readiness.continuityRuntime,"BLOCKED");
assert.equal(continuity.readiness.symbolSessionRuntimeCompleteness,"PARTIAL");

// Worker.js in the source tree is an intermediate artifact. Production CI/deploy rebuild it through
// the guarded patch chain. Source-readiness assertions must follow the build lineage, not assume the
// committed intermediate Worker equals the deployed Worker.
for(const marker of [
  "adjusted=false&fields=open,high,low,close,volume,turnover,change&sort=asc",
  "HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS",
  "RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS",
  "MISSING_OFFICIAL_TRADED_BAR",
  "VALID_WITH_VERIFIED_NO_TRADE_GAPS"
]) assert.ok(v812.includes(marker),"V8.12 raw-history patch contract changed: "+marker);

const regOrder=[
  "python3 scripts/rebase_v8_12_anchor.py",
  "python3 scripts/apply_v8_12_0.py",
  "python3 scripts/apply_v8_13_0.py",
  "python3 scripts/apply_v8_14_0.py",
  "python3 scripts/apply_v8_14_1.py",
  "node tests/test_v8_12_0_history_source_revalidation_contract.mjs"
].map(x=>regression.indexOf(x));
assert.ok(regOrder.every(i=>i>=0),"Regression build/test lineage missing V8.12+ contract");
assert.ok(regOrder.slice(0,5).every((v,i,a)=>i===0||v>a[i-1]),"Regression patch order changed; re-audit generated runtime lineage");

for(const marker of [
  "scripts/apply_v8_12_0.py",
  "scripts/apply_v8_13_0.py",
  "scripts/apply_v8_14_0.py",
  "scripts/apply_v8_14_1.py"
]) assert.ok(deploy.includes(marker),"Production deploy lineage changed: "+marker);

// A committed intermediate Worker still is not evidence of a canonical D15 comparable-return panel.
assert.equal(
  worker.includes('continuitySpace = "PRICE_INDEX_COMPARABLE"'),
  false,
  "Source-tree Worker now appears to expose comparable-return continuity; re-audit D15 blocker"
);

console.log(JSON.stringify({
  ok:true,
  classification:"PUBLIC_OHLC_SOURCE_FEASIBLE / PIT_SYNCHRONIZED_COMPARABLE_RETURN_PANEL_NOT_READY",
  monitoredBlockers:[
    "D03 raw rows transient/not retained as D15 panel",
    "shared continuity runtime blocked",
    "symbol-session completeness partial",
    "generated System1 production history remains adjusted=false/raw via V8.12 patch contract"
  ],
  rule:"Distinguish source-tree Worker from generated deployment artifact. If build lineage, continuity readiness, or observer persistence changes, trigger re-audit rather than silently perpetuating DATA_BLOCKED."
},null,2));
