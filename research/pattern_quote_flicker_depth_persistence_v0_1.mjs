// D01 DL-054 quote-flicker / depth-persistence firewall v0.1
// Research-only / outcome-blind / D05-owner semantics.

function str(x){return String(x??"");}

export function classifyDepthPersistence({
  eventClockValid,
  orderIdentityAvailable,
  snapshotOnly,
  survivalReceipt,
  replacementReceipt,
  flickerReceipt
}={}){
  if(eventClockValid!==true)
    return {state:"DEPTH_PERSISTENCE_UNKNOWN",reason:"EVENT_CLOCK_INCOMPLETE"};

  if(snapshotOnly===true)
    return {state:"DEPTH_PERSISTENCE_UNKNOWN",reason:"SPARSE_SNAPSHOT_ONLY"};

  if(orderIdentityAvailable!==true)
    return {state:"DEPTH_PERSISTENCE_UNKNOWN",reason:"ORDER_IDENTITY_UNAVAILABLE"};

  if(flickerReceipt?.verified===true)
    return {state:"FLICKERING_DISPLAYED_DEPTH",reason:null};

  if(replacementReceipt?.verified===true)
    return {state:"DEPTH_REPLACED_SAME_PRICE",reason:null};

  if(survivalReceipt?.verified===true)
    return {state:"DEPTH_SURVIVAL_CERTIFIED",reason:null};

  return {state:"DEPTH_PERSISTENCE_UNKNOWN",reason:"NO_CERTIFIED_PERSISTENCE_STATE"};
}

export function classifyPersistenceTiming({
  predictorFreezeAt,
  firstObservableAt,
  persistenceKnownAt,
  replaySafe,
  eventClockComplete
}={}){
  const freeze=str(predictorFreezeAt);
  const first=str(firstObservableAt);
  const known=str(persistenceKnownAt);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(eventClockComplete!==true)
    return {status:"DATA_BLOCKED",reason:"EVENT_CLOCK_INCOMPLETE"};

  if(!freeze||!first||!known)
    return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};

  if(first>freeze)
    return {status:"POST_TREATMENT",reason:"FIRST_OBSERVED_AFTER_FREEZE"};

  if(known>freeze)
    return {status:"POST_TREATMENT_PERSISTENCE",reason:"PERSISTENCE_KNOWN_AFTER_FREEZE"};

  return {status:"BASELINE_AVAILABLE",reason:null};
}

export function buildFlickerComparator({
  nearFrozenZone,
  contextMatched,
  d05ReceiptVerified
}={}){
  if(d05ReceiptVerified!==true)
    return {status:"UNKNOWN",reason:"D05_RECEIPT_UNVERIFIED"};

  if(contextMatched!==true)
    return {status:"UNKNOWN",reason:"COMPARATOR_CONTEXT_UNMATCHED"};

  return nearFrozenZone===true
    ?{status:"G1_ZONE_ASSOCIATED_FLICKER_OR_REPLACEMENT",independentVote:false}
    :{status:"G0_GENERIC_FLICKER_OR_REPLACEMENT",independentVote:false};
}

export function informationLineage({
  parentDecisionId,
  receipts=[]
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    rawReceiptCount:Array.isArray(receipts)?receipts.length:0,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    informationRoot:"PRICE_OHLC_PLUS_MICROSTRUCTURE_CONTEXT",
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function manipulationInferenceGuard({
  flickerDetected,
  regulatoryOrOwnerEvidence
}={}){
  if(flickerDetected!==true)
    return {status:"NO_FLICKER_EVIDENCE"};

  if(regulatoryOrOwnerEvidence===true)
    return {status:"EXTERNAL_MANIPULATION_EVIDENCE_PRESENT"};

  return {
    status:"FLICKER_WITHOUT_MANIPULATION_INFERENCE",
    manipulationClaimAllowed:false
  };
}
