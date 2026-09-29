import assert from "node:assert/strict";
import fs from "node:fs";

const observer=JSON.parse(fs.readFileSync("research/technical_indicator_fixed_cadence_observations_20260930.json","utf8"));
const continuity=JSON.parse(fs.readFileSync("research/technical_indicator_continuity_handoff_v0_1.json","utf8"));
const worker=fs.readFileSync("Worker.js","utf8");

assert.equal(observer.policy.rawPayloadPersistence,"TRANSIENT_ONLY_COMPACT_HASH_RECEIPT");
assert.notEqual(observer.summary.corporateActionAncestry,"READY");
assert.notEqual(observer.summary.certifiedSymbolSessionReceipt,"READY");
assert.equal(continuity.rawAdmissionIsContinuity,false);
assert.equal(continuity.readiness.continuityRuntime,"BLOCKED");
assert.equal(continuity.readiness.symbolSessionRuntimeCompleteness,"PARTIAL");

assert.ok(
  worker.includes("adjusted=false&fields=open,high,low,close,volume,turnover,change&sort=asc"),
  "System1 raw history contract changed; re-audit D15 synchronized-return readiness"
);
assert.equal(
  worker.includes('continuitySpace = "PRICE_INDEX_COMPARABLE"'),
  false,
  "Worker now appears to expose a comparable-return continuity space; re-audit blocker instead of preserving old conclusion"
);

console.log(JSON.stringify({
  ok:true,
  classification:"PUBLIC_OHLC_SOURCE_FEASIBLE / PIT_SYNCHRONIZED_COMPARABLE_RETURN_PANEL_NOT_READY",
  monitoredBlockers:[
    "D03 raw rows transient/not retained as D15 panel",
    "shared continuity runtime blocked",
    "symbol-session completeness partial",
    "System1 history adjusted=false/raw"
  ],
  rule:"If any blocker contract changes, this regression should trigger re-audit rather than silently perpetuating DATA_BLOCKED."
},null,2));
