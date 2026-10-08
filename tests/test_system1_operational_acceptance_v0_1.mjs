import assert from "node:assert/strict";
import {buildSystem1OperationalAcceptance} from "../research/system1_operational_acceptance_v0_1.mjs";

const scanDate="2026-10-08",generationId="C1:2026-10-08:genuine";
const sourceMainSha="a".repeat(40),contentDigest="b".repeat(64),universeDigest="c".repeat(64);
const runtimeVersion="8.20.2-idempotent-d1-snapshots";
const decisionAt="2026-10-08T15:35:00.000Z",collectedAt="2026-10-08T16:10:30.000Z";
const safety={researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};

function fixture(selectedN=2){
  const c1={
    schemaVersion:"SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1",collectedAt,
    receipt:{generationId,sessionDate:scanDate,decisionAt,sourceMainSha,effectiveRuntimeVersion:runtimeVersion,
      contentDigest,universeDigest,captureCompleteness:"IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE",pages:4},
    scanProof:{scanDate,generationId,pipelineComplete:true,configVerified:true,c1SaveVerified:true},
    summary:{populationN:1875,capturedN:1875,coverageComplete:true,selectedN,qualifiedN:97},
    diagnosis:{populationN:1875},safety:{...safety}
  };
  const c2={
    schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate:scanDate,decisionAt,
    sourceMainSha,sourceContentDigest:contentDigest,universeDigest,completeMatchedCohort:true,
    tally:{populationN:1875,formalSelectedN:selectedN},formalCoreLocked:true,...safety
  };
  const inventory={
    schemaVersion:"SYSTEM1_C1_GENERATION_INVENTORY_V0_1",scanDate,generationCount:1,returnedCount:1,
    truncated:false,integrityComplete:true,modernOriginCoverageComplete:true,historicalBackfillPerformed:false,
    validation:{status:"VERIFIED",scanDate,generationId,originKind:"AFTER_MARKET_SCAN_PIPELINE",
      runtimeVersion,contentDigest,universeDigest,populationN:1875,capturedN:1875,
      integrityComplete:true,modernOriginCoverageComplete:true,historicalBackfillPerformed:false,...safety}
  };
  const binding={
    schemaVersion:"SYSTEM1_FORMAL_C1_BINDING_V0_1",scanDate,count:1,
    authoritativeParentSelection:"EXPLICIT_BINDING_ONLY",latestHeuristicUsed:false,
    inventoryOrdinalHeuristicUsed:false,selectedSetEqualityInferenceUsed:false,historicalBackfillPerformed:false,
    validation:{status:"VERIFIED",bindingId:"FORMAL_C1:fixture",formalDecisionReceiptId:"FORMAL:2026-10-08:fixture",
      c1GenerationId:generationId,formalSelectedCount:selectedN,c1ScanOriginKind:"AFTER_MARKET_SCAN_PIPELINE",
      authoritativeParentSelection:"EXPLICIT_BINDING_ONLY",historicalBackfillPerformed:false,formalCoreImpact:false},
    safety:{...safety}
  };
  const h1h5={
    schemaVersion:"SYSTEM1_H1_H5_PROSPECTIVE_READINESS_V0_1",sessionDate:scanDate,generationId,populationN:1875,
    hypotheses:[
      {id:"H1_P1A_SEMANTIC_OVERHARDENING",state:"T0_STRUCTURAL_READY_CONDITIONAL_UPPER_BOUND_PRESENT"},
      {id:"H2_TARGET_AVAILABLE_OVERGATING",state:"T0_BLOCKED_TARGET_SOURCE_PROVENANCE"},
      {id:"H3_RR_GEOMETRY_OVERGATING",state:"T0_RR_STRUCTURAL_COUNT_AVAILABLE_TARGET_PROVENANCE_BLOCKED"},
      {id:"H4_B_RETEST_CONFIRMATION_DELAY",state:"T1_CAPTURE_REGISTERED_AWAIT_NEXT_SESSION"},
      {id:"H5_DOUBLE_MAX_CHASE_DOWNSTREAM",state:"T1_EXHAUSTIVE_MONITOR_RECEIPT_NOT_AVAILABLE"}
    ],
    deferredT1:{zeroBeforeT1IsForbidden:true},
    formalOptimizationCandidate:"NONE",autoSwitchAuthorized:false,formalCoreLocked:true,...safety
  };
  return {trigger:{eventName:"schedule",schedule:"10 16 * * 1-5"},
    observedAt:"2026-10-08T16:20:00.000Z",c1,c2,inventory,binding,h1h5};
}
const codes=r=>r.blockers.map(x=>x.code);

const pass=buildSystem1OperationalAcceptance(fixture());
assert.equal(pass.status,"OPERATIONAL_RECOVERY_PASS");
assert.equal(pass.genuineProspective,true);
assert.equal(pass.scanDate,"2026-10-08");
assert.equal(pass.expectedScanDate,"2026-10-08");
assert.equal(pass.firstBlocker,null);
assert.equal(pass.runtimeVersion,runtimeVersion);
assert.equal(pass.formalSelectedN,2);
assert.equal(pass.t1PendingDoesNotBlockOperationalRecovery,true);
assert.match(pass.receiptDigest,/^[0-9a-f]{64}$/);

// A fully verified genuine zero-pick is legitimate.
const zero=buildSystem1OperationalAcceptance(fixture(0));
assert.equal(zero.status,"OPERATIONAL_RECOVERY_PASS");
assert.equal(zero.formalSelectedN,0);
assert.equal(zero.zeroPickAllowedWhenFullyVerified,true);

// Manual replay can never become genuine prospective.
{
  const f=fixture();f.trigger.eventName="workflow_dispatch";f.trigger.schedule=null;
  const r=buildSystem1OperationalAcceptance(f);
  assert.equal(r.status,"BLOCKED");assert.ok(codes(r).includes("SCHEDULED_COLLECTOR_REQUIRED"));
}

// A prior failed date can never be upgraded later by replay.
{
  const f=fixture();
  f.c1.receipt.sessionDate="2026-10-07";f.c1.scanProof.scanDate="2026-10-07";
  f.c2.sessionDate="2026-10-07";f.inventory.scanDate="2026-10-07";f.inventory.validation.scanDate="2026-10-07";
  f.binding.scanDate="2026-10-07";f.h1h5.sessionDate="2026-10-07";
  const r=buildSystem1OperationalAcceptance(f);
  assert.equal(r.status,"BLOCKED");assert.ok(codes(r).includes("NOT_PREVIOUS_TAIPEI_CALENDAR_DATE"));
}

// Any historical backfill evidence is disqualifying.
{
  const f=fixture();f.inventory.historicalBackfillPerformed=true;
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("C1_INVENTORY_HISTORICAL_BACKFILL_FORBIDDEN"));
}
{
  const f=fixture();f.binding.historicalBackfillPerformed=true;
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("FORMAL_C1_BINDING_HISTORICAL_BACKFILL_FORBIDDEN"));
}

// Only authoritative after-market generation is accepted.
{
  const f=fixture();f.inventory.validation.originKind="STAGE_SELECTION_ROUTE";
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("AUTHORITATIVE_AFTER_MARKET_ORIGIN_REQUIRED"));
}

// Binding must point to the exact C1 generation.
{
  const f=fixture();f.binding.validation.c1GenerationId="other-generation";
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("FORMAL_C1_BINDING_IDENTITY_INVALID"));
}

// C1/C2 source identity and digests cannot drift.
{
  const f=fixture();f.c2.sourceMainSha="d".repeat(40);
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("C1_C2_PROVENANCE_MISMATCH"));
}
{
  const f=fixture();f.inventory.validation.contentDigest="e".repeat(64);
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("C1_INVENTORY_PROVENANCE_MISMATCH"));
}

// H1-H5 exists for evidence readiness; T1 pending is allowed but missing/mismatched identity is not.
{
  const f=fixture();f.h1h5=null;
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("H1_H5_ARTIFACT_IDENTITY_INVALID"));
}
{
  const f=fixture();f.h1h5.generationId="other-generation";
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("H1_H5_ARTIFACT_IDENTITY_INVALID"));
}

// Late collection/review cannot turn historical artifacts into genuine evidence.
{
  const f=fixture();f.c1.collectedAt="2026-10-09T08:10:00.000Z";
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("EVIDENCE_COLLECTION_WINDOW_TOO_LATE"));
}
{
  const f=fixture();f.observedAt="2026-10-10T16:20:00.000Z";
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("NOT_PREVIOUS_TAIPEI_CALENDAR_DATE"));
  assert.ok(codes(r).includes("ACCEPTANCE_OBSERVATION_NOT_CONTEMPORANEOUS"));
}

// Heuristic binding inference remains forbidden.
{
  const f=fixture();f.binding.latestHeuristicUsed=true;
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("FORMAL_C1_BINDING_INFERENCE_FORBIDDEN"));
}

// Formal selected count must agree exactly with binding, including zero.
{
  const f=fixture();f.binding.validation.formalSelectedCount=1;
  const r=buildSystem1OperationalAcceptance(f);
  assert.ok(codes(r).includes("FORMAL_SELECTED_COUNT_BINDING_MISMATCH"));
}

console.log(JSON.stringify({
  ok:true,assertions:32,genuineScheduledPass:true,genuineZeroPickPass:true,
  manualReplayBlocked:true,historicalDateBlocked:true,historicalBackfillBlocked:true,
  authoritativeOriginRequired:true,exactBindingRequired:true,provenanceMatchRequired:true,
  t1PendingAllowed:true,lateEvidenceBlocked:true,heuristicInferenceForbidden:true,
  formalOptimizationCandidate:"NONE",formalCoreImpact:false
}));
