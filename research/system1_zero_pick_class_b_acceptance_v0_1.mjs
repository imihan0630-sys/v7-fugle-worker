export const ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1",
  implementationClass:"CLASS_B",
  ownerApprovalRequired:true,
  formalCore:"LOCKED",
  maxChunkBytes:90000,
  maxScale2000Bytes:10000000,
  allowedChangedFunctions:Object.freeze([
    "buildC1PopulationReceipt",
    "persistC1PopulationReceipt",
    "readC1PopulationReceipt",
    "c1ChunkRows",
    "runAfterMarketScanCore",
    "selectTomorrowCandidates",
    "ensureD1Schema",
  ]),
  allowedNewFunctionPrefixes:Object.freeze([
    "c1ZeroPick",
    "buildC1ZeroPick",
    "finalizeC1ZeroPick",
    "verifyC1ZeroPick",
  ]),
});

const bool=(v)=>v===true;
const finite=(v)=>typeof v==="number"&&Number.isFinite(v);

function allowedFunction(name){
  if(ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.allowedChangedFunctions.includes(name)) return true;
  return ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.allowedNewFunctionPrefixes.some(prefix=>String(name).startsWith(prefix));
}

export function evaluateSystem1ZeroPickClassBCandidate(input={}){
  const blockers=[];
  const check=(ok,code)=>{if(!ok) blockers.push(code);};

  const changedFunctions=Array.isArray(input.changedFunctions)?input.changedFunctions.map(String):[];
  const changedFiles=Array.isArray(input.changedFiles)?input.changedFiles.map(String):[];

  check(changedFunctions.every(allowedFunction),"UNEXPECTED_CHANGED_FUNCTION");
  check(!changedFiles.includes("Worker.js"),"DIRECT_WORKER_EDIT_FORBIDDEN");
  check(changedFiles.some(x=>/^scripts\/apply_v8_\d+_\d+\.py$/.test(x)),"GUARDED_RUNTIME_PATCH_REQUIRED");

  check(input.scoreCandidateChanged===false,"SCORE_CANDIDATE_CHANGED");
  check(input.applyMarketConsensusChanged===false,"APPLY_MARKET_CONSENSUS_CHANGED");
  check(input.formalRankFnChanged===false,"FORMAL_RANK_FN_CHANGED");
  check(bool(input.selectorCaptureOnlyParity),"SELECTOR_NOT_CAPTURE_ONLY");
  check(bool(input.selectedSymbolsParity),"SELECTED_SYMBOLS_PARITY_FAILED");
  check(bool(input.plansCapitalParity),"PLANS_CAPITAL_PARITY_FAILED");
  check(bool(input.signalStateParity),"SIGNAL_STATE_PARITY_FAILED");
  check(bool(input.fifteenMinuteParity),"FIFTEEN_MINUTE_PARITY_FAILED");
  check(bool(input.pushParity),"PUSH_PARITY_FAILED");
  check(bool(input.orderParity),"ORDER_PARITY_FAILED");

  check(finite(input.providerCallDelta)&&input.providerCallDelta===0,"NEW_PROVIDER_CALLS_DETECTED");
  check(input.system2Touched===false,"SYSTEM2_TOUCHED");
  check(bool(input.researchFailureFailOpen),"RESEARCH_FAILURE_NOT_FAIL_OPEN");

  check(bool(input.sameScanOnly),"SAME_SCAN_ONLY_GUARD_MISSING");
  check(bool(input.pitKnownAtGuard),"PIT_KNOWN_AT_GUARD_MISSING");
  check(bool(input.exactDateConsensusGuard),"EXACT_DATE_CONSENSUS_GUARD_MISSING");
  check(bool(input.noLaterRepair),"LATER_DATA_REPAIR_NOT_BLOCKED");
  check(bool(input.noHistoricalBackfill),"HISTORICAL_BACKFILL_NOT_BLOCKED");
  check(bool(input.actualFormalRankFalse),"ACTUAL_FORMAL_RANK_SEMANTIC_BROKEN");
  check(bool(input.incompleteTupleFailClosed),"INCOMPLETE_TUPLE_NOT_FAIL_CLOSED");
  check(bool(input.preSortOrdinalStable),"PRESORT_ORDINAL_NOT_STABLE");

  check(bool(input.immutableGenerationConflictGuard),"IMMUTABLE_GENERATION_CONFLICT_GUARD_MISSING");
  check(bool(input.readbackVerified),"D1_READBACK_NOT_VERIFIED");

  check(finite(input.maxObservedChunkBytes)&&input.maxObservedChunkBytes<=ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.maxChunkBytes,
    "D1_CHUNK_BYTE_BOUND_EXCEEDED");
  check(finite(input.scale2000Bytes)&&input.scale2000Bytes<ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.maxScale2000Bytes,
    "C1_SCALE_2000_BYTE_BUDGET_EXCEEDED");

  check(bool(input.regressionPass),"REGRESSION_NOT_PASS");
  check(bool(input.repairCiPass),"REPAIR_CI_NOT_PASS");
  check(bool(input.isolatedReviewPass),"SYSTEM1_ISOLATED_REVIEW_NOT_PASS");

  const technicalPass=blockers.length===0;
  const ownerApproval=input.ownerApproval===true;

  let status;
  if(!technicalPass) status="TECHNICAL_BLOCKED";
  else if(!ownerApproval) status="TECHNICALLY_READY_OWNER_APPROVAL_REQUIRED";
  else status="CLASS_B_CANDIDATE_ELIGIBLE_FOR_OWNER_MERGE_REVIEW";

  return Object.freeze({
    schemaVersion:ZERO_PICK_CLASS_B_ACCEPTANCE_V0_1.schemaVersion,
    status,
    technicalPass,
    ownerApproval,
    ownerApprovalRequired:true,
    blockers:Object.freeze([...blockers]),
    classBReviewEligible:technicalPass&&ownerApproval,
    mergeAuthorizedByGate:false,
    deploymentAuthorized:false,
    formalChangeAuthorized:false,
    formalCoreLocked:true,
    economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE",
    researchOnly:true,
    decisionImpact:false,
  });
}
