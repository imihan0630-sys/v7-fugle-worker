import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");

function sliceFunction(name,nextName){
  const start=source.indexOf("function "+name);
  assert.ok(start>=0,"missing function "+name);
  const end=nextName?source.indexOf("function "+nextName,start+1):-1;
  return source.slice(start,end>start?end:start+20000);
}

const compare=sliceFunction("compareResults","evaluateOperationSignals");
assert.match(compare,/levelWeight\s*=\s*\{\s*A:\s*3,\s*B:\s*2,\s*C:\s*1\s*\}/);
const sigIndex=compare.indexOf("bPlan.signalLevel");
const priorityIndex=compare.indexOf("bPlan.priorityScore");
const rrIndex=compare.indexOf("bPlan.rewardRisk");
assert.ok(sigIndex>=0&&priorityIndex>sigIndex&&rrIndex>priorityIndex,
  "monitor comparator should use plan signalLevel after live action weight and before priority/RR");

const operations=sliceFunction("evaluateOperationSignals","operationSignal");
assert.equal(operations.includes("signalLevel"),false,
  "Formal BUY/ADD/REDUCE/SELL/STOP signal existence must not directly depend on plan.signalLevel");

const allocation=sliceFunction("allocateAndBuildPlans","consecutivePositiveDays");
assert.match(allocation,/scoreTotal\s*=\s*selected\.reduce\([\s\S]*priorityScore/);
assert.match(allocation,/rawRatio\s*=\s*deployRatio\s*\*[\s\S]*priorityScore/);
const rawRatioLine=allocation.split("\n").find(x=>x.includes("const rawRatio"))||"";
assert.equal(rawRatioLine.includes("signalLevel"),false,
  "allocation ratio must not directly use signalLevel label");

const pushEligibility=sliceFunction("shouldPhonePushSignal","sendPushDirect");
assert.equal(pushEligibility.includes("signalLevel"),false,
  "phone push eligibility list is signal-type based, not Formal signalLevel based");

const analyze=sliceFunction("analyzeStockSmart","runBackgroundMonitor");
assert.equal(analyze.includes("signalLevel"),false,
  "intraday A/B confirmation should use mode/channel/price/K state, not signalLevel label");

console.log(JSON.stringify({
  ok:true,
  directEligibilityUse:true,
  monitorOrderUse:true,
  directBuyAddGate:false,
  directAllocationLabelWeight:false,
  directPushEligibilityGate:false,
  formalCoreImpact:false
},null,2));
