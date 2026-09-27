import assert from "node:assert/strict";
import {decomposeRiskConcentration} from "../research/risk_concentration_bridge_v0_1.mjs";

const x=decomposeRiskConcentration({
 selectedCount:3,currentHHI:0.3772380854,equalCapitalHHI:0.3558588621,globalMinHHI:0.3343850287
});
assert.equal(x.status,"READY");
assert.ok(Math.abs(x.theoreticalBridge.identityResidual)<1e-10);
assert.ok(Math.abs(x.feasibleBridge.identityResidual)<1e-10);
assert.ok(x.theoreticalBridge.geometryShareOfObservedExcessPct>50);
assert.ok(x.theoreticalBridge.sizingShareOfObservedExcessPct>45);
assert.ok(x.feasibleBridge.sizingShareOfGapPct>45&&x.feasibleBridge.sizingShareOfGapPct<55);

assert.equal(decomposeRiskConcentration({selectedCount:1,currentHHI:1,equalCapitalHHI:1,globalMinHHI:1}).status,"UNKNOWN");

console.log(JSON.stringify({ok:true,rule:"equal-capital is a descriptive bridge, not a causal attribution; stop-geometry imbalance and PriorityScore sizing increment must be reported separately"},null,2));
