import assert from "node:assert/strict";
import {scoreStopInteractionAudit} from "../research/score_stop_interaction_audit_v0_1.mjs";

const x=scoreStopInteractionAudit([
 {symbol:"A",priorityScore:70,totalAllocation:50000,buyLow:90,buyHigh:100,stop:85},
 {symbol:"B",priorityScore:90,totalAllocation:64000,buyLow:190,buyHigh:200,stop:160},
 {symbol:"C",priorityScore:80,totalAllocation:54000,buyLow:280,buyHigh:300,stop:250}
]);
assert.equal(x.status,"READY");
for(const m of ["BUY_LOW","MIDPOINT","BUY_HIGH"]){
 assert.equal(x.modes[m].status,"READY");
 assert.ok(x.modes[m].spearmanRho<=1&&x.modes[m].spearmanRho>=-1);
 assert.equal(x.modes[m].permutationCount,6);
}
assert.equal(scoreStopInteractionAudit(x.rows.slice(0,2)).status,"UNKNOWN");
console.log(JSON.stringify({ok:true,purpose:"quantify pre-registered PriorityScore×stop-distance alignment; tiny-n exact permutation remains descriptive only"},null,2));
