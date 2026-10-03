import assert from "node:assert/strict";
import {
  ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1,
  evaluateSystem1ZeroPickClassBCandidate
} from "../research/system1_zero_pick_class_b_acceptance_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const base={
  changedFunctions:[
    "buildC1PopulationReceipt","persistC1PopulationReceipt","selectTomorrowCandidates",
    "c1ZeroPickRankSource","buildC1ZeroPickObservation"
  ],
  changedFiles:[
    "scripts/apply_v8_15_5.py",
    "tests/test_v8_15_5_zero_pick_rank_capture.mjs",
    ".github/workflows/v7-regression.yml",
    ".github/workflows/v7-repair-ci.yml"
  ],
  scoreCandidateChanged:false,
  applyMarketConsensusChanged:false,
  formalRankFnChanged:false,
  selectorCaptureOnlyParity:true,
  selectedSymbolsParity:true,
  plansCapitalParity:true,
  signalStateParity:true,
  fifteenMinuteParity:true,
  pushParity:true,
  orderParity:true,
  providerCallDelta:0,
  system2Touched:false,
  researchFailureFailOpen:true,
  sameScanOnly:true,
  pitKnownAtGuard:true,
  exactDateConsensusGuard:true,
  noLaterRepair:true,
  noHistoricalBackfill:true,
  actualFormalRankFalse:true,
  incompleteTupleFailClosed:true,
  preSortOrdinalStable:true,
  immutableGenerationConflictGuard:true,
  readbackVerified:true,
  maxObservedChunkBytes:89999,
  scale2000Bytes:7000000,
  regressionPass:true,
  repairCiPass:true,
  isolatedReviewPass:true,
};

const pending=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:false});
eq(pending.status,"TECHNICALLY_READY_OWNER_APPROVAL_REQUIRED");
eq(pending.technicalPass,true);
eq(pending.classBReviewEligible,false);
eq(pending.mergeAuthorizedByGate,false);
eq(pending.deploymentAuthorized,false);
eq(pending.formalChangeAuthorized,false);
eq(pending.formalOptimizationCandidate,"NONE");

const approved=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true});
eq(approved.status,"CLASS_B_CANDIDATE_ELIGIBLE_FOR_OWNER_MERGE_REVIEW");
eq(approved.classBReviewEligible,true);
eq(approved.blockers,[]);

const formalChanged=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,scoreCandidateChanged:true});
eq(formalChanged.status,"TECHNICAL_BLOCKED");
ok(formalChanged.blockers.includes("SCORE_CANDIDATE_CHANGED"));
eq(formalChanged.classBReviewEligible,false);

const calls=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,providerCallDelta:1});
ok(calls.blockers.includes("NEW_PROVIDER_CALLS_DETECTED"));

const direct=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,changedFiles:[...base.changedFiles,"Worker.js"]});
ok(direct.blockers.includes("DIRECT_WORKER_EDIT_FORBIDDEN"));

const fn=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,changedFunctions:[...base.changedFunctions,"scoreCandidate"]});
ok(fn.blockers.includes("UNEXPECTED_CHANGED_FUNCTION"));

const pit=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,pitKnownAtGuard:false});
ok(pit.blockers.includes("PIT_KNOWN_AT_GUARD_MISSING"));

const chunk=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,maxObservedChunkBytes:90001});
ok(chunk.blockers.includes("D1_CHUNK_BYTE_BOUND_EXCEEDED"));

const scale=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,scale2000Bytes:10000000});
ok(scale.blockers.includes("C1_SCALE_2000_BYTE_BUDGET_EXCEEDED"));

const ci=evaluateSystem1ZeroPickClassBCandidate({...base,ownerApproval:true,isolatedReviewPass:false});
ok(ci.blockers.includes("SYSTEM1_ISOLATED_REVIEW_NOT_PASS"));

eq(ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.maxChunkBytes,90000);
eq(ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.maxScale2000Bytes,10000000);

console.log(JSON.stringify({
  ok:true,assertions:n,
  ownerApprovalCannotBeInferred:true,
  technicalGateCannotAuthorizeMerge:true,
  formalCoreLocked:true,
  zeroProviderCallsRequired:true,
  system2UntouchedRequired:true
}));
