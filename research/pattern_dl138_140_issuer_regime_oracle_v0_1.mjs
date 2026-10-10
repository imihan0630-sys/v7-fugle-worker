// D01 DL-138~140 issuer-regime boundary / reconfirmation / common-support oracle v0.1

const MEMORY_DISPOSITIONS=new Set([
  "PRESERVE_STRUCTURAL_MEMORY",
  "STALE_RECONFIRM_REQUIRED",
  "BREAK_STRUCTURAL_MEMORY",
  "REGIME_MEMORY_UNKNOWN_BLOCKED"
]);

const DENOMINATOR_STATES=new Set([
  "REGIME_CONTEXT_CLEAR",
  "REGIME_BOUNDARY_PRESERVED",
  "REGIME_BOUNDARY_STALE_PENDING_RECONFIRMATION",
  "REGIME_BOUNDARY_RECONFIRMED",
  "REGIME_BOUNDARY_BROKEN",
  "REGIME_BOUNDARY_UNKNOWN_BLOCKED",
  "REGIME_RECONFIRMATION_FAILED",
  "REGIME_RECONFIRMATION_EXPIRED"
]);

export function validateRegimeBoundaryReceipt(r={}){
  const required=[
    "regimeBoundaryReceiptId","regimeBoundaryVersion","securityIdentity",
    "boundaryId","normalizedBoundaryClass","structuralMemoryDisposition",
    "eventEffectiveAt","firstObservableAt","ownerDomain","sourceHash"
  ];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"REGIME_RECEIPT_INCOMPLETE",missing};
  if(!MEMORY_DISPOSITIONS.has(r.structuralMemoryDisposition))
    return {status:"REGIME_MEMORY_DISPOSITION_INVALID",missing:[]};
  if(r.replaySafe!==true)return {status:"REGIME_RECEIPT_NOT_REPLAY_SAFE",missing:[]};
  return {status:"REGIME_RECEIPT_VALID",missing:[]};
}

export function classifyBoundaryPIT({firstObservableAt,predictorFreezeAt,currentTruthClass,historicalPITClass}={}){
  if(!firstObservableAt||!predictorFreezeAt)return {status:"REGIME_CLOCK_UNKNOWN"};
  if(firstObservableAt>predictorFreezeAt){
    return {status:"REGIME_CLASS_NOT_PIT_AVAILABLE",historicalClass:historicalPITClass??"UNKNOWN_AT_CUTOFF",currentClass:currentTruthClass??null};
  }
  return {status:"REGIME_CLASS_PIT_AVAILABLE",historicalClass:historicalPITClass??currentTruthClass??null,currentClass:currentTruthClass??null};
}

export function applyStructuralMemoryDisposition({moduleId,disposition,priorEpisodeId}={}){
  if(!MEMORY_DISPOSITIONS.has(disposition))return {status:"REGIME_MEMORY_DISPOSITION_INVALID"};
  if(disposition==="PRESERVE_STRUCTURAL_MEMORY")
    return {status:"EPISODE_CONTINUITY_PRESERVED",priorEpisodeId};
  if(disposition==="STALE_RECONFIRM_REQUIRED")
    return {status:"EPISODE_CONTEXT_STALE",priorEpisodeId};
  if(disposition==="BREAK_STRUCTURAL_MEMORY")
    return {status:"EPISODE_TERMINATED_REGIME_BREAK",priorEpisodeId};
  return {status:"REGIME_MEMORY_UNKNOWN_BLOCKED",priorEpisodeId};
}

export function classifyD0109BoundaryGap({sameSecurity,regimeBoundaryKnown,rawGapFinite,ordinaryGapOverride}={}){
  if(sameSecurity!==true)return {status:"IDENTITY_TRANSITION_NOT_ORDINARY_GAP"};
  if(rawGapFinite!==true)return {status:"GAP_INPUT_BLOCKED"};
  if(regimeBoundaryKnown===true && ordinaryGapOverride!==true)
    return {status:"ISSUER_REGIME_EVENT_GAP"};
  return {status:"ORDINARY_GAP_CLASSIFICATION_ELIGIBLE"};
}

export function validateReconfirmation(r={}){
  if(r.structuralMemoryDisposition!=="STALE_RECONFIRM_REQUIRED")
    return {status:"RECONFIRMATION_NOT_REQUIRED"};
  const allowedModes=new Set([
    "POST_BOUNDARY_RETEST_OF_SURVIVING_ZONE",
    "POST_BOUNDARY_NEW_BASE_CONFIRMATION",
    "POST_BOUNDARY_BREAK_RECLAIM_SEQUENCE",
    "POST_BOUNDARY_MULTI_SESSION_ACCEPTANCE"
  ]);
  if(!allowedModes.has(r.reconfirmationMode))
    return {status:"RECONFIRMATION_MODE_INVALID"};
  if(r.modePreregistered!==true)return {status:"RECONFIRMATION_MODE_NOT_PREREGISTERED"};
  if(!Array.isArray(r.requiredPostBoundarySourceBarIds)||!r.requiredPostBoundarySourceBarIds.length)
    return {status:"RECONFIRMATION_SOURCE_BARS_MISSING"};
  if(!r.reconfirmedAt||!r.predictorFreezeAt)return {status:"RECONFIRMATION_CLOCK_UNKNOWN"};
  if(r.reconfirmedAt>r.predictorFreezeAt)return {status:"RECONFIRMATION_LOOKAHEAD"};
  if(r.usedPreBoundaryEvidenceAlone===true)return {status:"RECONFIRMATION_PREBOUNDARY_ONLY_PROHIBITED"};
  return {status:"RECONFIRMATION_VALID"};
}

export function classifyReconfirmationLifecycle({attempted,passed,expired,dataBlocked}={}){
  if(dataBlocked===true)return {status:"DATA_BLOCKED"};
  if(expired===true)return {status:"RECONFIRMATION_EXPIRED"};
  if(attempted!==true)return {status:"RECONFIRMATION_PENDING"};
  return {status:passed===true?"RECONFIRMATION_PASSED":"RECONFIRMATION_FAILED"};
}

export function validateEpisodeContinuationId({priorEpisodeId,continuationEpisodeId,disposition,reconfirmed}={}){
  if(disposition==="BREAK_STRUCTURAL_MEMORY"){
    if(!continuationEpisodeId||continuationEpisodeId===priorEpisodeId)
      return {status:"NEW_EPISODE_ID_REQUIRED_AFTER_BREAK"};
    return {status:"NEW_EPISODE_AFTER_BREAK_VALID"};
  }
  if(disposition==="STALE_RECONFIRM_REQUIRED"){
    if(reconfirmed!==true)return {status:"CONTINUATION_BLOCKED_PENDING_RECONFIRMATION"};
    if(!continuationEpisodeId||continuationEpisodeId===priorEpisodeId)
      return {status:"DERIVED_CONTINUATION_EPISODE_ID_REQUIRED"};
    return {status:"RECONFIRMED_CONTINUATION_VALID"};
  }
  return {status:"EPISODE_ID_POLICY_NOT_APPLICABLE"};
}

export function validateRegimeDenominatorRow(r={}){
  if(!r.securityIdentity||!r.denominatorState)return {status:"REGIME_DENOMINATOR_IDENTITY_INCOMPLETE"};
  if(!DENOMINATOR_STATES.has(r.denominatorState))return {status:"REGIME_DENOMINATOR_STATE_INVALID"};
  return {status:"REGIME_DENOMINATOR_ROW_VALID"};
}

export function validateRegimeParentChildSupport(parent={},child={}){
  const fields=[
    "securityIdentity","regimeBoundaryReceiptId","normalizedBoundaryClass",
    "structuralMemoryDisposition","boundaryKnowledgeState","exactSessionHash",
    "sourceHistoryHash","predictorFreezeAt","blockedRowPolicyId",
    "censoringPolicyId","horizon","costTreatmentId"
  ];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  return {status:drift.length?"PARENT_CHILD_REGIME_SUPPORT_MISMATCH":"PARENT_CHILD_REGIME_SUPPORT_VALID",drift};
}

export function validateRegimePlacebo(p={}){
  const allowed=new Set([
    "NO_REGIME_BOUNDARY_SAME_GEOMETRY",
    "REGIME_BOUNDARY_WITHOUT_D01_STRUCTURE",
    "SAME_SECURITY_ADMINISTRATIVE_RENAME",
    "MARKET_MIGRATION_BOUNDARY",
    "CORPORATE_ACTION_MECHANICAL_RESET"
  ]);
  if(!allowed.has(p.placeboFamily))return {status:"REGIME_PLACEBO_FAMILY_INVALID"};
  if(p.selectedAfterOutcome===true)return {status:"OUTCOME_SELECTED_PLACEBO_PROHIBITED"};
  return {status:"REGIME_PLACEBO_VALID"};
}

export function validateNoExtraVote({boundaryContextPresent,patternRepresentationPresent,effectiveIndependentEvidenceCount}={}){
  if(boundaryContextPresent===true&&patternRepresentationPresent===true&&effectiveIndependentEvidenceCount>1)
    return {status:"REGIME_CONTEXT_DOUBLE_VOTE_PROHIBITED"};
  return {status:"REGIME_CONTEXT_NO_EXTRA_VOTE"};
}
