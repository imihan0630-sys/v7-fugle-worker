import fs from "node:fs";
import assert from "node:assert/strict";

const s=fs.readFileSync("Worker.js","utf8");
function fnBody(name){
 const start=s.indexOf("function "+name);
 assert.ok(start>=0,"missing "+name);
 const next=s.indexOf("\nfunction ",start+10);
 return s.slice(start,next>start?next:s.length);
}
const upstream=["evaluateStop","evaluateProfit","buildFinalDecision","applyPlanValidity"];
const sizing=["priorityScore","allocationRatio","totalAllocation","firstAmount","firstShares","secondAmount","secondShares","actualShares"];
for(const name of upstream){
 const body=fnBody(name);
 for(const token of sizing) assert.equal(body.includes(token),false,name+" must not use "+token);
}
const ops=fnBody("evaluateOperationSignals");
for(const token of ['"STOP_LOSS"','"SELL"','"REDUCE"','"PROFIT_CHECK"']) assert.ok(ops.includes(token),token+" branch missing");
assert.ok(ops.includes('const hasPosition = p.positionStage !== "NONE"'),"open-position gate changed");

const stopStart=ops.indexOf('if (result.stop?.level === "risk")');
const stopPush=ops.indexOf('signals.push(operationSignal(',ops.indexOf('if (!hasPosition)',stopStart)+1);
const stopEligible=ops.slice(stopStart,stopPush);
assert.equal(stopEligible.includes("actualShares"),false,"STOP trigger must not depend on quantity");

const sellStart=ops.indexOf('if (\n    hasPosition &&\n    p.sellBelow');
const sellPush=ops.indexOf('signals.push(operationSignal(',sellStart);
const sellEligible=ops.slice(sellStart,sellPush);
assert.equal(sellEligible.includes("actualShares"),false,"SELL trigger must not depend on quantity");

const reduceStart=ops.indexOf("const reduceConfirmed");
const reducePush=ops.indexOf('signals.push(operationSignal(',ops.indexOf("if (reduceConfirmed)",reduceStart));
const reduceEligible=ops.slice(reduceStart,reducePush);
assert.equal(reduceEligible.includes("heldShares"),false,"REDUCE trigger must not depend on quantity");
assert.equal(reduceEligible.includes("heldAmount"),false,"REDUCE trigger must not depend on amount");

console.log(JSON.stringify({ok:true,contract:"exit trigger clocks are sizing-independent only conditional on independently valid open-position state; quantities remain path-specific"},null,2));
