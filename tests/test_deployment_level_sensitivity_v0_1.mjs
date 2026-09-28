import assert from "node:assert/strict";
import {deploymentLevelSensitivity} from "../research/deployment_level_sensitivity_v0_1.mjs";
const plans=[
 {symbol:"A",priorityScore:70,buyHigh:100,stop:95},
 {symbol:"B",priorityScore:90,buyHigh:200,stop:180},
 {symbol:"C",priorityScore:75,buyHigh:300,stop:270}
];
const x=deploymentLevelSensitivity(plans,200000,{deployRatios:[0.6,0.85,0.95]});
assert.equal(x.status,"READY");
assert.equal(x.summary.testedLevels,3);
for(const d of ["0.6","0.85","0.95"]){
 assert.equal(x.levels[d].status,"READY");
 assert.ok(x.levels[d].currentActualPlannedDeploymentNTD>0);
 assert.ok(x.levels[d].globalMinHHI<=x.levels[d].currentProjectedRiskHHI+1e-12);
}
assert.equal(deploymentLevelSensitivity([plans[0]],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,purpose:"test whether structural concentration is peculiar to the observed 85% nominal deployment level"},null,2));
