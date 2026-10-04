import assert from "node:assert/strict";
import { buildD18WalkForwardPlanV0_1 } from "../runtime/d18_walk_forward_plan_v0_1.mjs";

const sessions=[
 "2026-09-01","2026-09-02","2026-09-03","2026-09-04","2026-09-07",
 "2026-09-08","2026-09-09","2026-09-10","2026-09-11","2026-09-14",
 "2026-09-15","2026-09-16","2026-09-17","2026-09-18"
];

function r(id,date,state="MATURED",updatedAt=null){
 return {
   attributionVersion:"D18_REGIME_ATTRIBUTION_V0_1_RESEARCH",
   receiptHash:"hash-"+id,
   decisionId:"decision-"+id,
   strategyId:"SHORT_MOMENTUM",
   strategyVersion:"V0.1-CONTRACT",
   regimeVectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
   requestedHorizon:3,
   requestedCostScenarioId:"BASE_COST",
   marketDate:date,
   decisionTimestamp:date+"T06:30:00.000Z",
   outcomeUpdatedAt:updatedAt || "2026-09-18T08:30:00.000Z",
   state,
 };
}

const receipts=[
 r("a","2026-09-01","MATURED","2026-09-04T08:30:00.000Z"),
 r("b","2026-09-02","MATURED","2026-09-07T08:30:00.000Z"),
 r("c","2026-09-03","MATURED","2026-09-08T08:30:00.000Z"),
 r("d","2026-09-04","MATURED","2026-09-09T08:30:00.000Z"),
 r("e","2026-09-07","MATURED","2026-09-10T08:30:00.000Z"),
 r("f","2026-09-08","MATURED","2026-09-11T08:30:00.000Z"),
 r("g","2026-09-09","IMMATURE","2026-09-09T08:30:00.000Z"),
 r("h","2026-09-10","UNKNOWN","2026-09-10T08:30:00.000Z"),
];

const base={
 planId:"D18-WF-1",
 strategyId:"SHORT_MOMENTUM",
 strategyVersion:"V0.1-CONTRACT",
 regimeVectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
 requestedHorizon:3,
 costScenarioId:"BASE_COST",
 officialSessionDates:sessions,
 attributionReceipts:receipts,
 folds:[{
   foldId:"F1",
   trainStartDate:"2026-09-01",
   trainEndDate:"2026-09-07",
   testStartDate:"2026-09-08",
   testEndDate:"2026-09-10",
   trainingKnowledgeCutoff:"2026-09-08T06:00:00.000Z",
   evaluationAsOf:"2026-09-18T09:00:00.000Z",
 }],
 createdAt:"2026-09-18T09:01:00.000Z",
};

const out=await buildD18WalkForwardPlanV0_1(base);
assert.equal(out.folds.length,1);
const f=out.folds[0];

// D+3 for 9/03 reaches 9/08 test start, so 9/03 onward train rows purge.
assert.deepEqual(f.purgedReceiptHashes,["hash-c","hash-d","hash-e"]);
assert.deepEqual(f.trainReceiptHashes,["hash-a","hash-b"]);
assert.equal(f.counts.independentTrainDateN,2);
assert.equal(f.counts.testRows,3);
assert.equal(f.counts.testMaturedRows,1);
assert.equal(f.counts.testUnresolvedRows,2);
assert.deepEqual(f.testMaturedReceiptHashes,["hash-f"]);
assert.deepEqual(f.testUnresolvedReceiptHashes,["hash-g","hash-h"]);
assert.equal(out.rowPoolingAsIndependentEvidence,false);
assert.equal(out.foldBoundaryChosenFromOutcome,false);
assert.equal(out.thresholdTuningPerformed,false);
assert.equal(out.policyOptimizationPerformed,false);

const replay=await buildD18WalkForwardPlanV0_1(base);
assert.equal(replay.planHash,out.planHash);

const lateTrain=[
 ...receipts.filter(x=>x.decisionId!=="decision-b"),
 r("b","2026-09-02","MATURED","2026-09-08T07:00:00.000Z"),
];
const late=await buildD18WalkForwardPlanV0_1({...base,planId:"D18-WF-LATE",attributionReceipts:lateTrain});
assert(late.folds[0].trainUnresolvedReceiptHashes.includes("hash-b"));
assert(!late.folds[0].trainReceiptHashes.includes("hash-b"));

await assert.rejects(
 ()=>buildD18WalkForwardPlanV0_1({
   ...base,planId:"D18-WF-BAD",
   attributionReceipts:[...receipts,{...r("x","2026-09-11"),strategyVersion:"OTHER"}],
 }),
 /mixed strategyVersion/,
);

await assert.rejects(
 ()=>buildD18WalkForwardPlanV0_1({
   ...base,planId:"D18-WF-OVERLAP",
   folds:[{
     foldId:"BAD",
     trainStartDate:"2026-09-01",
     trainEndDate:"2026-09-08",
     testStartDate:"2026-09-08",
     testEndDate:"2026-09-10",
     trainingKnowledgeCutoff:"2026-09-08T06:00:00.000Z",
     evaluationAsOf:"2026-09-18T09:00:00.000Z",
   }],
 }),
 /train must end before test starts/,
);

console.log("D18 walk-forward plan tests: PASS");
