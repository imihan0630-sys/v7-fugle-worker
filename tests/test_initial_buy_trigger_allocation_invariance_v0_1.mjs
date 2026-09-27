import fs from "node:fs";
import assert from "node:assert/strict";

const s=fs.readFileSync("Worker.js","utf8");
const forbidden=["allocationRatio","totalAllocation","firstAmount","firstShares","secondAmount","secondShares","priorityScore"];

function fnBody(name){
  const start=s.indexOf("function "+name);
  assert.ok(start>=0,"missing "+name);
  const next=s.indexOf("\nfunction ",start+10);
  return s.slice(start,next>start?next:s.length);
}

for(const name of ["evaluatePullback","evaluateMomentum","evaluateStop","evaluateProfit","buildFinalDecision","applyPlanValidity","analyzeStockSmart"]){
  const body=fnBody(name);
  for(const token of forbidden) assert.equal(body.includes(token),false,name+" must not depend on "+token);
}

const ops=fnBody("evaluateOperationSignals");
const buyIf=ops.indexOf('if (result.finalDecision?.level === "buy"');
assert.ok(buyIf>=0,"BUY eligibility predicate missing");
const buyPush=ops.indexOf('signals.push(operationSignal(',buyIf);
assert.ok(buyPush>buyIf,"BUY push missing");
const eligibility=ops.slice(buyIf,buyPush);
for(const token of forbidden) assert.equal(eligibility.includes(token),false,"initial BUY eligibility must not depend on "+token);

const buyPayload=ops.slice(buyPush,ops.indexOf('));',buyPush)+3);
assert.ok(buyPayload.includes('"BUY"'),"BUY payload missing");
assert.ok(buyPayload.includes("p.firstAmount"),"BUY amount should be applied after eligibility");
assert.ok(buyPayload.includes("p.firstShares"),"BUY shares should be applied after eligibility");

console.log(JSON.stringify({
 ok:true,
 contract:"INITIAL_BUY_TRIGGER_ALLOCATION_INVARIANCE_V0_1",
 certified:"eligibility/timing only while positionStage NONE",
 notCertified:["fill price","fill probability","slippage","counterfactual shares","ADD lifecycle"]
},null,2));
