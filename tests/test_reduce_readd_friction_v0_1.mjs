import assert from "node:assert/strict";
import fs from "node:fs";
import {classifyReduceReaddEvidence,modeledReduceReaddCycle} from "../research/reduce_readd_friction_v0_1.mjs";

const src=fs.readFileSync("Worker.js","utf8");
assert.ok(src.includes('"REDUCE"'),"Formal REDUCE signal missing");
assert.equal(src.includes('"RE-ADD"'),false,"RE-ADD unexpectedly exists; source audit must be redone");
assert.equal(src.includes('"RE_ADD"'),false,"RE_ADD unexpectedly exists; source audit must be redone");

const ns=src.slice(src.indexOf("function normalizePositionStage"),src.indexOf("// ======================================================\n// ADMIN TOKEN",src.indexOf("function normalizePositionStage")));
assert.ok(ns.includes('"FIRST"'));
assert.ok(ns.includes('"FULL"'));
assert.equal(/REDUCED|RE-ADD|RE_ADD/.test(ns),false,"position stage lifecycle expanded; re-audit required");

let x=classifyReduceReaddEvidence({
 reduceSignalId:"r-sig",readdSignalId:"a-sig",
 reduceFillId:"r-fill",readdFillId:"a-fill",
 reduceFillLinkedToSignal:true,readdFillLinkedToSignal:true,
 reduceSymbol:"3105",readdSymbol:"3105",
 reduceShares:100,readdShares:100,
 reduceFillPrice:500,readdFillPrice:480,
 reduceCommission:30,reduceTax:150,readdCommission:30
});
assert.equal(x.status,"ACTUAL_SAME_QUANTITY_CYCLE_READY");
assert.equal(x.grossTimingCaptureNTD,2000);
assert.equal(x.explicitCostsNTD,210);
assert.equal(x.netTimingCaptureNTD,1790);

x=classifyReduceReaddEvidence({
 reduceSignalId:"r",reduceFillId:"rf",reduceFillLinkedToSignal:true,
 readdSignalId:"a",readdFillId:"af",readdFillLinkedToSignal:true,
 reduceSymbol:"A",readdSymbol:"A",reduceShares:100,readdShares:80,
 reduceFillPrice:100,readdFillPrice:90,reduceCommission:1,reduceTax:1,readdCommission:1
});
assert.equal(x.status,"INVENTORY_ACCOUNTING_REQUIRED");

x=classifyReduceReaddEvidence({reduceSignalId:"r",reduceFillId:"rf",reduceFillLinkedToSignal:true});
assert.equal(x.status,"NOT_ATTRIBUTION_ELIGIBLE");

const m=modeledReduceReaddCycle({
 shares:100,reduceReferencePrice:500,readdReferencePrice:480,
 reduceCommission:30,readdCommission:30,reduceTax:150,
 reduceSlippageNTD:40,readdSlippageNTD:40
});
assert.equal(m.status,"MODELED_CYCLE_READY");
assert.equal(m.modeledNetTimingCaptureNTD,1710);
assert.equal(m.semantics,"MODEL_ONLY_NOT_REALIZED_PNL");

console.log(JSON.stringify({
 ok:true,
 runtimeFinding:"Formal has REDUCE but no RE-ADD signal/state. REDUCE->RE-ADD realized economics are not currently observable as a native Formal lifecycle.",
 accountingRule:"Actual fill-price cycle must not double-count slippage; modeled signal/reference-price cycle must state slippage explicitly."
},null,2));
