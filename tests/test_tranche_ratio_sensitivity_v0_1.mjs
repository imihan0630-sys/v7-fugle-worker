import assert from "node:assert/strict";
import {trancheRatioSensitivity} from "../research/tranche_ratio_sensitivity_v0_1.mjs";
const plans=[
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
];
const x=trancheRatioSensitivity(plans,200000,{ratios:[0.4,0.6,0.8]});
assert.equal(x.status,"READY");
assert.equal(x.directionalAgreement.testedRatios,3);
for(const r of ["0.4","0.6","0.8"]){
 assert.equal(x.ratios[r].status,"READY");
 assert.equal(x.ratios[r].feasibleStates,946);
 assert.ok(x.ratios[r].current.projectedRiskHHI>=x.ratios[r].globalMin.minHHI-1e-12);
}
assert.equal(trancheRatioSensitivity(plans,200000,{ratios:[1]}).status,"UNKNOWN");
assert.equal(trancheRatioSensitivity([plans[0]],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,purpose:"test whether current concentration is a special artifact of the 60/40 tranche split"},null,2));
