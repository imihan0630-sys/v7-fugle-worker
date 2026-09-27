import assert from "node:assert/strict";
import {entryReferenceRiskSensitivity} from "../research/entry_reference_risk_sensitivity_v0_1.mjs";

const plans=[
 {symbol:"A",totalAllocation:50000,buyLow:90,buyHigh:100,stop:80},
 {symbol:"B",totalAllocation:64000,buyLow:180,buyHigh:200,stop:150},
 {symbol:"C",totalAllocation:54000,buyLow:270,buyHigh:300,stop:240}
];
const x=entryReferenceRiskSensitivity(plans,200000);
assert.equal(x.status,"READY");
for(const m of ["BUY_LOW","MIDPOINT","BUY_HIGH"]){
  assert.equal(x.modes[m].status,"READY");
  assert.equal(x.modes[m].exhaustiveGrid.feasibleStates,946);
  assert.ok(x.modes[m].current.projectedStopRiskHHI>=x.modes[m].exhaustiveGrid.minHHI-1e-12);
}
assert.ok(x.modes.BUY_LOW.referencePrices.A < x.modes.MIDPOINT.referencePrices.A);
assert.ok(x.modes.MIDPOINT.referencePrices.A < x.modes.BUY_HIGH.referencePrices.A);
assert.equal(entryReferenceRiskSensitivity([plans[0]],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
assert.equal(entryReferenceRiskSensitivity([{...plans[0],stop:95},plans[1]],200000).modes.BUY_LOW.status,"UNKNOWN");

console.log(JSON.stringify({ok:true,modes:["BUY_LOW","MIDPOINT","BUY_HIGH"],purpose:"falsify whether risk concentration is an artifact of conservative buyHigh entry reference"},null,2));
