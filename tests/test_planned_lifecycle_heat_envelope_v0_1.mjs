import assert from "node:assert/strict";
import {plannedLifecycleHeatEnvelope} from "../research/planned_lifecycle_heat_envelope_v0_1.mjs";

const x=plannedLifecycleHeatEnvelope([
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
],200000);
assert.equal(x.status,"READY");
assert.ok(x.FIRST.totalCapitalHeatPct>0);
assert.ok(x.ADD_INCREMENT.totalCapitalHeatPct>0);
assert.ok(x.FULL.totalCapitalHeatPct>x.FIRST.totalCapitalHeatPct);
assert.equal(x.conservation.exactWithinTolerance,true);
assert.equal(x.actualLifecycleStatus,"UNKNOWN_WITHOUT_FILL_HOLDINGS_PROVENANCE");

const z=plannedLifecycleHeatEnvelope([],200000);
assert.equal(z.status,"READY");
assert.equal(z.FULL.totalCapitalHeatPct,0);
assert.equal(z.actualLifecycleStatus,"UNKNOWN_WITHOUT_FILL_HOLDINGS_PROVENANCE");

console.log(JSON.stringify({ok:true,contract:"plan lifecycle envelope only; actual FIRST/FULL transitions require fill/holdings provenance"},null,2));
