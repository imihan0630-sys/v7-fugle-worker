import assert from "node:assert/strict";
import {stageFeasibleGridSensitivity} from "../research/stage_feasible_grid_sensitivity_v0_1.mjs";
const plans=[
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:500,stop:450},
 {symbol:"C",totalAllocation:54000,buyHigh:25,stop:22}
];
const x=stageFeasibleGridSensitivity(plans,200000,{ratios:[0.05,0.5,0.95]});
assert.equal(x.status,"READY");
assert.equal(x.summary.testedRatios,3);
for(const r of ["0.05","0.5","0.95"]){
 assert.equal(x.ratios[r].status,"READY");
 assert.ok(x.ratios[r].twoStageFeasibleStates<=x.ratios[r].legalStates);
 assert.ok(x.ratios[r].stageFeasibleMinHHI>=x.ratios[r].unconstrainedMinHHI-1e-12);
}
assert.equal(stageFeasibleGridSensitivity([plans[0]],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,purpose:"verify whether low-concentration grid optima survive the requirement that both FIRST and ADD are individually orderable"},null,2));
