import assert from "node:assert/strict";
import {trancheStageOrderability} from "../research/tranche_stage_orderability_v0_1.mjs";
const plans=[
 {symbol:"A",totalAllocation:50000,buyHigh:100},
 {symbol:"B",totalAllocation:64000,buyHigh:500},
 {symbol:"C",totalAllocation:54000,buyHigh:25}
];
const x=trancheStageOrderability(plans,{ratios:[0.01,0.02,0.5,0.98,0.99]});
assert.equal(x.status,"READY");
assert.equal(x.testedRatios,5);
assert.ok(x.results.find(r=>r.firstRatio===0.5).allNamesBothStagesOrderable);
assert.ok(x.results.some(r=>!r.allNamesBothStagesOrderable));
assert.equal(trancheStageOrderability([]).status,"UNKNOWN");
console.log(JSON.stringify({ok:true,purpose:"separate ratio concentration robustness from two-stage integer-share orderability"},null,2));
