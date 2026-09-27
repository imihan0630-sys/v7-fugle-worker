import fs from "node:fs";
import assert from "node:assert/strict";

const s=fs.readFileSync("Worker.js","utf8");
function fnBody(name){
 const start=s.indexOf("function "+name);
 assert.ok(start>=0,"missing "+name);
 const next=s.indexOf("\nfunction ",start+10);
 return s.slice(start,next>start?next:s.length);
}
const forbidden=["priorityScore","allocationRatio","totalAllocation","secondAmount","secondShares"];
for(const name of ["evaluatePullback","evaluateMomentum","evaluateStop","evaluateProfit","buildFinalDecision","applyPlanValidity"]){
 const body=fnBody(name);
 for(const token of forbidden) assert.equal(body.includes(token),false,name+" must not use "+token);
}
const ops=fnBody("evaluateOperationSignals");
const gate=ops.indexOf('if (result.finalDecision?.level === "buy"');
const add=ops.indexOf('} else if (p.positionStage === "FIRST")',gate);
const push=ops.indexOf('signals.push(operationSignal(',add);
assert.ok(gate>=0&&add>gate&&push>add,"ADD branch missing");
const eligibility=ops.slice(gate,push);
for(const token of forbidden) assert.equal(eligibility.includes(token),false,"ADD eligibility must not use "+token);
const payload=ops.slice(push,ops.indexOf('));',push)+3);
assert.ok(payload.includes('"ADD"'));
assert.ok(payload.includes("p.secondAmount"));
assert.ok(payload.includes("p.secondShares"));
assert.ok(eligibility.includes('p.positionStage === "FIRST"'),"conditional FIRST-state gate required");

console.log(JSON.stringify({ok:true,contract:"ADD trigger allocation-invariant only conditional on independently proven FIRST state in both execution paths; second sizing fields enter after trigger"},null,2));
