import assert from "node:assert/strict";
import {perNameCapSensitivity} from "../research/per_name_cap_sensitivity_v0_1.mjs";
const plans=[
 {symbol:"A",totalAllocation:50000,buyHigh:100,stop:95},
 {symbol:"B",totalAllocation:64000,buyHigh:200,stop:180},
 {symbol:"C",totalAllocation:54000,buyHigh:300,stop:270}
];
const x=perNameCapSensitivity(plans,200000,{capsPct:[30,32,35,40,50]});
assert.equal(x.status,"READY");
assert.equal(x.caps["30"].currentFeasible,false);
assert.equal(x.caps["32"].currentFeasible,true);
for(const cap of ["32","35","40","50"]){
 assert.equal(x.caps[cap].status,"READY");
 assert.ok(x.caps[cap].globalMinHHI<=x.currentProjectedRiskHHI+1e-12);
}
assert.equal(x.summary.comparableCaps,4);
assert.equal(perNameCapSensitivity([plans[0]],200000).status,"INSUFFICIENT_CROSS_NAME_SAMPLE");
console.log(JSON.stringify({ok:true,purpose:"falsify whether lower-concentration comparators are a special artifact of the Formal 35% per-name cap"},null,2));
