import assert from "node:assert/strict";
import {
  buildBulkBacktestPlanV0_1,
  buildBulkBacktestPitUniverseReceiptV0_1,
  verifyBulkBacktestPitUniverseReceiptV0_1,
  runBulkBacktestV0_1,
} from "../runtime/bulk_backtest_runner_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

const h=(ch)=>String(ch).repeat(64).slice(0,64);
const marketDate="2026-09-29";
const decisionTimestamp="2026-09-29T10:10:00Z";
const capturedAt="2026-10-01T09:45:00Z";
const fullIdentity={
  datasetManifestHash:h("a"),
  policyRegistrationHash:h("b"),
  evaluatorCodeHash:h("c"),
  factorBundleHash:h("d"),
  regimeVersionHash:h("e"),
  executionAssumptionHash:h("f"),
  costModelHash:h("1"),
};

async function plan(overrides={}){
  return buildBulkBacktestPlanV0_1({
    runId:"BT-CORR014",
    datasetVersion:"DATASET-CORR014-V1",
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    policyId:"POLICY-CORR014",
    policyVersion:"0.1",
    factorBundleVersion:"A1_HISTORY_PRIMITIVE_0.1",
    marketDates:[marketDate],
    decisionClockByDate:{[marketDate]:decisionTimestamp},
    lookbackSessions:3,
    symbolPartitionSize:20,
    selectionPolicyAuthorized:false,
    planIdentity:fullIdentity,
    createdAt:"2026-09-29T09:40:00Z",
    ...overrides,
  });
}

function member(symbol="2330"){
  return {
    market:"TWSE",
    symbol,
    companyName:symbol==="2330"?"台積電":"測試",
    industry:"半導體",
    membershipId:"MEM-"+symbol,
    membershipHash:"MH-"+symbol,
    registryId:"REG-CORR014",
    registryHash:h("2"),
    replayEligible:true,
    membershipStateAtReplay:"ACTIVE",
    unknownReason:null,
    excluded:false,
    exclusionReasons:[],
  };
}

const validPlan=await plan();
assert.equal(validPlan.planIdentity.state,"READY");
assert.deepEqual(validPlan.planIdentity.blockerCodes,[]);

const incompletePlan=await plan({
  runId:"BT-CORR014-INCOMPLETE-IDENTITY",
  planIdentity:{...fullIdentity,costModelHash:null},
});
assert.equal(incompletePlan.planIdentity.state,"INCOMPLETE");
assert.ok(incompletePlan.planIdentity.blockerCodes.includes("PLAN_IDENTITY_MISSING_COSTMODELHASH"));

let identityLoaderCalls=0;
await assert.rejects(
  ()=>runBulkBacktestV0_1({
    plan:incompletePlan,
    loadUniverse:async()=>{identityLoaderCalls+=1;return [];},
    loadUniverseReceipt:async()=>{throw new Error("MUST_NOT_RUN");},
    loadHistoricalBars:async()=>[],
    evaluateSymbol:async()=>({candidateState:"WATCH"}),
    capturedAt,
  }),
  /backtest plan identity is not READY/,
);
assert.equal(identityLoaderCalls,0);

const selectionPlan=await plan({
  runId:"BT-CORR014-SELECTION",
  selectionPolicyAuthorized:true,
});
assert.equal(selectionPlan.planIdentity.state,"INCOMPLETE");
assert.ok(selectionPlan.planIdentity.blockerCodes.includes("SELECTION_AUTHORIZATION_RECEIPT_MISSING"));

const missingRegistryHash=await buildBulkBacktestPitUniverseReceiptV0_1({
  plan:validPlan,
  marketDate,
  decisionTimestamp,
  registryId:"REG-CORR014",
  registryHash:null,
  members:[member()],
  capturedAt,
});
assert.equal(missingRegistryHash.state,"INCOMPLETE");
assert.ok(missingRegistryHash.blockerCodes.includes("UNIVERSE_REGISTRY_HASH_MISSING"));
await assert.rejects(
  ()=>verifyBulkBacktestPitUniverseReceiptV0_1(
    missingRegistryHash,
    {plan:validPlan,marketDate,decisionTimestamp},
  ),
  /PIT universe receipt is not READY/,
);

const unprovedEmpty=await buildBulkBacktestPitUniverseReceiptV0_1({
  plan:validPlan,
  marketDate,
  decisionTimestamp,
  registryId:"REG-CORR014",
  registryHash:h("2"),
  members:[],
  emptyUniverseProven:false,
  capturedAt,
});
assert.equal(unprovedEmpty.state,"INCOMPLETE");
assert.ok(unprovedEmpty.blockerCodes.includes("EMPTY_UNIVERSE_NOT_PROVEN"));

const provedEmpty=await buildBulkBacktestPitUniverseReceiptV0_1({
  plan:validPlan,
  marketDate,
  decisionTimestamp,
  registryId:"REG-CORR014",
  registryHash:h("2"),
  members:[],
  emptyUniverseProven:true,
  capturedAt,
});
assert.equal(provedEmpty.state,"READY");
assert.equal(provedEmpty.emptyUniverseProven,true);
assert.match(provedEmpty.receiptHash,/^[a-f0-9]{64}$/);

let emptyHistoryCalls=0;
let emptyEvaluatorCalls=0;
const emptyRun=await runBulkBacktestV0_1({
  plan:validPlan,
  loadUniverse:async()=>[],
  loadUniverseReceipt:async()=>provedEmpty,
  loadHistoricalBars:async()=>{emptyHistoryCalls+=1;return [];},
  evaluateSymbol:async()=>{emptyEvaluatorCalls+=1;return {candidateState:"WATCH"};},
  capturedAt,
});
assert.equal(emptyRun.allRequestedDatesComplete,true);
assert.equal(emptyRun.processedSampleCount,0);
assert.equal(emptyRun.dateSummaries[0].eligibleCount,0);
assert.equal(emptyRun.dateSummaries[0].emptyUniverseProven,true);
assert.equal(emptyHistoryCalls,0);
assert.equal(emptyEvaluatorCalls,0);

const forgedCheckpoint={
  ...emptyRun.latestCheckpoint,
  checkpointHash:h("0"),
};
let forgedLoaderCalls=0;
await assert.rejects(
  ()=>runBulkBacktestV0_1({
    plan:validPlan,
    loadUniverse:async()=>{forgedLoaderCalls+=1;return [];},
    loadUniverseReceipt:async()=>provedEmpty,
    loadHistoricalBars:async()=>[],
    evaluateSymbol:async()=>({candidateState:"WATCH"}),
    resumeCheckpoint:forgedCheckpoint,
    capturedAt,
  }),
  /resume checkpoint hash mismatch/,
);
assert.equal(forgedLoaderCalls,0,"AP-04 must fail before any loader");

const tamperedBase={
  ...emptyRun.latestCheckpoint,
  processedSampleCount:1,
};
delete tamperedBase.checkpointHash;
const tamperedCheckpoint={
  ...tamperedBase,
  checkpointHash:await sha256Hex(tamperedBase),
};
let tamperedLoaderCalls=0;
await assert.rejects(
  ()=>runBulkBacktestV0_1({
    plan:validPlan,
    loadUniverse:async()=>{tamperedLoaderCalls+=1;return [];},
    loadUniverseReceipt:async()=>provedEmpty,
    loadHistoricalBars:async()=>[],
    evaluateSymbol:async()=>({candidateState:"WATCH"}),
    resumeCheckpoint:tamperedCheckpoint,
    capturedAt,
  }),
  /processed sample count mismatch/,
);
assert.equal(tamperedLoaderCalls,0);

const wrongMemberReceipt=await buildBulkBacktestPitUniverseReceiptV0_1({
  plan:validPlan,
  marketDate,
  decisionTimestamp,
  registryId:"REG-CORR014",
  registryHash:h("2"),
  members:[member("2317")],
  capturedAt,
});
assert.equal(wrongMemberReceipt.state,"READY");
let mismatchHistoryCalls=0;
let mismatchEvaluatorCalls=0;
await assert.rejects(
  ()=>runBulkBacktestV0_1({
    plan:validPlan,
    loadUniverse:async()=>[member("2330")],
    loadUniverseReceipt:async()=>wrongMemberReceipt,
    loadHistoricalBars:async()=>{mismatchHistoryCalls+=1;return [];},
    evaluateSymbol:async()=>{mismatchEvaluatorCalls+=1;return {candidateState:"WATCH"};},
    capturedAt,
  }),
  /PIT universe receipt member set mismatch/,
);
assert.equal(mismatchHistoryCalls,0);
assert.equal(mismatchEvaluatorCalls,0);

const futureEndMember={...member(),delistingDate:"2030-01-01"};
await assert.rejects(
  ()=>buildBulkBacktestPitUniverseReceiptV0_1({
    plan:validPlan,
    marketDate,
    decisionTimestamp,
    registryId:"REG-CORR014",
    registryHash:h("2"),
    members:[futureEndMember],
    capturedAt,
  }),
  /cannot expose future membership-end fields/,
);

console.log("CORR-014 bulk backtest PIT/checkpoint firewall tests PASS");
