// D01 DL-108~110 source-vintage / corporate-action revision oracle v0.1

const HASH64=/^[a-f0-9]{64}$/i;
const MIGRATION_CLASSES=new Set([
  "EXACT_EQUIVALENT_REOBSERVATION",
  "SEMANTICALLY_EQUIVALENT_SOURCE_REFRESH",
  "PIPELINE_ERROR_CORRECTED_REPLAY",
  "LATE_CORRECTION_CURRENT_TRUTH_ONLY",
  "LATE_CANCELLATION_CURRENT_TRUTH_ONLY",
  "PROVENANCE_ONLY_CONFIDENCE_UPGRADE",
  "UNKNOWN_BLOCKED"
]);

export function classifySourceVintageEquivalence(oldS={},newS={}){
  const exactFields=[
    "requestedQueryId","normalizedSemanticSetHash","knowledgeClockHash",
    "exactSessionHash","sourceHistoryHash","denominatorHash","canonicalR7PayloadHash"
  ];
  const exactDrift=exactFields.filter(k=>(oldS[k]??null)!==(newS[k]??null));
  if(exactDrift.length===0)return {status:"EXACT_CAPTURE_REPLAY_EQUIVALENT",drift:[]};

  const semanticFields=["requestedQueryId","normalizedSemanticSetHash","knowledgeClockHash","exactSessionHash","denominatorHash","canonicalR7PayloadHash"];
  const semanticDrift=semanticFields.filter(k=>(oldS[k]??null)!==(newS[k]??null));
  if(semanticDrift.length===0 && oldS.sourceHistoryHash!==newS.sourceHistoryHash){
    return {status:"SEMANTICALLY_EQUIVALENT_NEW_CAPTURE",drift:["sourceHistoryHash"]};
  }

  if(oldS.normalizedSemanticSetHash!==newS.normalizedSemanticSetHash)
    return {status:"SEMANTIC_REVISION_REQUIRES_NEW_REPLAY",drift:["normalizedSemanticSetHash"]};
  if(oldS.knowledgeClockHash!==newS.knowledgeClockHash)
    return {status:"KNOWLEDGE_CLOCK_REVISION_REQUIRES_NEW_REPLAY",drift:["knowledgeClockHash"]};
  if(oldS.exactSessionHash!==newS.exactSessionHash || oldS.sourceHistoryHash!==newS.sourceHistoryHash)
    return {status:"PROVENANCE_DRIFT",drift:["source/history"]};
  return {status:"UNKNOWN_BLOCKED",drift:exactDrift};
}

export function classifyCorporateActionRevision({
  predictorCutoff,
  oldSemanticHash,
  newSemanticHash,
  oldOutcomeState="ACTIVE",
  newOutcomeState="ACTIVE",
  oldEffectiveDate=null,
  newEffectiveDate=null,
  oldContinuityEffectHash=null,
  newContinuityEffectHash=null,
  firstKnownAt=null,
  eventWasMissingInOldArchive=false,
  newCoverageOnly=false,
  oldArchiveHadCompleteCoverageAtFreeze=false
}={}){
  if(newCoverageOnly===true && oldSemanticHash===newSemanticHash){
    return {
      revisionClass:"R7_COVERAGE_OR_AUTHORITY_UPGRADE_ONLY",
      replayDisposition:oldArchiveHadCompleteCoverageAtFreeze?"NO_REPLAY_NEEDED":"CURRENT_TRUTH_ONLY_UPDATE"
    };
  }
  if(oldSemanticHash===newSemanticHash && oldOutcomeState===newOutcomeState &&
     oldEffectiveDate===newEffectiveDate && oldContinuityEffectHash===newContinuityEffectHash){
    return {revisionClass:"R0_DUPLICATE_SEMANTIC_OBSERVATION",replayDisposition:"NO_REPLAY_NEEDED"};
  }
  if(!firstKnownAt||!predictorCutoff)
    return {revisionClass:"UNKNOWN",replayDisposition:"BLOCKED_UNKNOWN_KNOWLEDGE_TIME"};

  const preexisting=firstKnownAt<=predictorCutoff;

  if(eventWasMissingInOldArchive===true){
    return preexisting
      ? {revisionClass:"R1_PREEXISTING_PUBLIC_INFORMATION_BACKFILL",replayDisposition:"CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR"}
      : {revisionClass:"R2_LATE_PUBLIC_CORRECTION",replayDisposition:"PIT_VIEW_UNCHANGED_LATE_CORRECTION"};
  }

  if(oldOutcomeState!==newOutcomeState && newOutcomeState==="CANCELLED"){
    return preexisting
      ? {revisionClass:"R1_PREEXISTING_PUBLIC_INFORMATION_BACKFILL",replayDisposition:"CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR"}
      : {revisionClass:"R3_LATE_CANCELLATION_OR_SUPERSESSION",replayDisposition:"PIT_VIEW_UNCHANGED_LATE_CANCELLATION"};
  }

  if(oldEffectiveDate!==newEffectiveDate){
    return preexisting
      ? {revisionClass:"R4_EFFECTIVE_DATE_CORRECTION_WITH_PREEXISTING_KNOWLEDGE",replayDisposition:"CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR"}
      : {revisionClass:"R5_EFFECTIVE_DATE_CORRECTION_DISCLOSED_LATE",replayDisposition:"PIT_VIEW_UNCHANGED_LATE_CORRECTION"};
  }

  if(oldContinuityEffectHash!==newContinuityEffectHash){
    return preexisting
      ? {revisionClass:"R6_CONTINUITY_EFFECT_REVISION_PREEXISTING",replayDisposition:"CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR"}
      : {revisionClass:"R6_CONTINUITY_EFFECT_REVISION_LATE",replayDisposition:"PIT_VIEW_UNCHANGED_LATE_CORRECTION"};
  }

  return preexisting
    ? {revisionClass:"SEMANTIC_REVISION_PREEXISTING",replayDisposition:"CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR"}
    : {revisionClass:"SEMANTIC_REVISION_LATE",replayDisposition:"PIT_VIEW_UNCHANGED_LATE_CORRECTION"};
}

export function validateSourceVintageLedger(row={}){
  if(!MIGRATION_CLASSES.has(row.migrationClass))return {status:"MIGRATION_CLASS_INVALID"};
  const required=[
    "witnessRequestId","experimentFamilyId","moduleId","market","symbol",
    "oldSourceVintageId","newSourceVintageId","oldSourceHistoryHash","newSourceHistoryHash",
    "originalPredictorCutoff","newEvidenceObservedAt","outcomeAccessStateAtDiscovery",
    "finalHoldoutStateAtDiscovery","searchRegistryEntryId"
  ];
  const missing=required.filter(k=>!row[k]);
  if(missing.length)return {status:"SOURCE_VINTAGE_LEDGER_INCOMPLETE",missing};
  if(!HASH64.test(row.oldSourceHistoryHash)||!HASH64.test(row.newSourceHistoryHash))
    return {status:"SOURCE_HISTORY_HASH_INVALID"};
  if(!["CLOSED","DEVELOPMENT_OUTCOMES_OPEN","FINAL_HOLDOUT_OPEN","PROSPECTIVE_OUTCOMES_OPEN"].includes(row.outcomeAccessStateAtDiscovery))
    return {status:"OUTCOME_ACCESS_STATE_INVALID"};
  if(!["UNTOUCHED","CONSUMED","NOT_APPLICABLE"].includes(row.finalHoldoutStateAtDiscovery))
    return {status:"FINAL_HOLDOUT_STATE_INVALID"};
  return {status:"SOURCE_VINTAGE_LEDGER_VALID"};
}

export function classifyCorrectedReplayAuthority({
  migrationClass,
  outcomeAccessStateAtDiscovery,
  finalHoldoutStateAtDiscovery,
  preregisteredErrorCorrectionPolicy=false
}={}){
  if(migrationClass!=="PIPELINE_ERROR_CORRECTED_REPLAY")
    return {status:"NOT_PIPELINE_ERROR_REPLAY"};

  if(outcomeAccessStateAtDiscovery==="CLOSED")
    return {status:"CORRECTED_REPLAY_PREOUTCOME_ELIGIBLE",finalHoldoutState:finalHoldoutStateAtDiscovery};

  if(outcomeAccessStateAtDiscovery==="DEVELOPMENT_OUTCOMES_OPEN")
    return {status:"CORRECTED_REPLAY_NEW_ANALYSIS_VERSION",finalHoldoutState:finalHoldoutStateAtDiscovery};

  if(["FINAL_HOLDOUT_OPEN","PROSPECTIVE_OUTCOMES_OPEN"].includes(outcomeAccessStateAtDiscovery)){
    return {
      status:preregisteredErrorCorrectionPolicy
        ?"CORRECTED_REPLAY_POLICY_GOVERNED_BUT_HOLDOUT_CONSUMED"
        :"CORRECTED_REPLAY_DIAGNOSTIC_FRESH_CONFIRMATION_REQUIRED",
      finalHoldoutState:"CONSUMED"
    };
  }
  return {status:"CORRECTED_REPLAY_BLOCKED"};
}

export function validateHoldoutNonReset({before,after}={}){
  if(before==="CONSUMED" && after==="UNTOUCHED")return {status:"HOLDOUT_RESET_PROHIBITED"};
  if(before==="UNTOUCHED" && after==="UNTOUCHED")return {status:"HOLDOUT_STATE_VALID"};
  if(before==="CONSUMED" && after==="CONSUMED")return {status:"HOLDOUT_STATE_VALID"};
  return {status:"HOLDOUT_STATE_REVIEW_REQUIRED"};
}

export function validateRevisionDenominator(before={},after={}){
  const required=["opportunityCount","noStructureCount","dataBlockedCount","structureEmittedCount"];
  if(required.some(k=>!Number.isInteger(before[k])||!Number.isInteger(after[k])||before[k]<0||after[k]<0))
    return {status:"DENOMINATOR_COUNTS_INVALID"};
  if(before.opportunityCount!==before.noStructureCount+before.dataBlockedCount+before.structureEmittedCount)
    return {status:"OLD_DENOMINATOR_NOT_ACCOUNTED"};
  if(after.opportunityCount!==after.noStructureCount+after.dataBlockedCount+after.structureEmittedCount)
    return {status:"NEW_DENOMINATOR_NOT_ACCOUNTED"};
  return {status:"REVISION_DENOMINATORS_ACCOUNTED",changed:JSON.stringify(before)!==JSON.stringify(after)};
}

export function validateRevisedParentChildSupport(parent={},child={}){
  const fields=[
    "sourceVintageId","sourceHistoryHash","exactSessionHash","universeVersion",
    "foldId","blockedRowPolicyId","censoringPolicyId","horizon","costTreatmentId"
  ];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  return {status:drift.length?"REVISED_PARENT_CHILD_SUPPORT_MISMATCH":"REVISED_PARENT_CHILD_SUPPORT_VALID",drift};
}

export function validateOldR7Immutability({oldReceiptHashBefore,oldReceiptHashAfter,newReceiptId=null}={}){
  if(!oldReceiptHashBefore||!oldReceiptHashAfter)return {status:"OLD_R7_HASH_UNKNOWN"};
  if(oldReceiptHashBefore!==oldReceiptHashAfter)return {status:"OLD_R7_MUTATED"};
  return {status:newReceiptId?"OLD_R7_IMMUTABLE_NEW_REPLAY_APPENDED":"OLD_R7_IMMUTABLE_NO_NEW_REPLAY"};
}
