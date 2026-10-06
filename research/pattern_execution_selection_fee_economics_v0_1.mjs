// D01 DL-056 execution-selection / fee-economics firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}

export function classifyFeeRegime({
  venueReceiptVerified,
  makerTakerProgramVerified,
  nonMakerTakerVerified,
  brokerCommissionKnown
}={}){
  if(venueReceiptVerified===true&&makerTakerProgramVerified===true)
    return {state:"VENUE_MAKER_TAKER_REGIME_VERIFIED",foreignTransferUsed:false};

  if(venueReceiptVerified===true&&nonMakerTakerVerified===true)
    return {state:"VENUE_FEE_REGIME_VERIFIED_NON_MAKER_TAKER",foreignTransferUsed:false};

  if(brokerCommissionKnown===true)
    return {state:"BROKER_COMMISSION_ONLY_KNOWN",foreignTransferUsed:false};

  return {state:"FEE_REGIME_UNKNOWN",foreignTransferUsed:false};
}

export function classifyExecutionStyle({
  realOrderSubmitted,
  passiveVerified,
  aggressiveVerified,
  partialOrMixed,
  proxyOnly
}={}){
  if(realOrderSubmitted!==true){
    if(proxyOnly===true) return {state:"EXECUTION_STYLE_PROXY_ONLY",realExecution:false};
    return {state:"EXECUTION_STYLE_UNKNOWN",realExecution:false};
  }

  if(partialOrMixed===true)
    return {state:"MIXED_OR_PARTIAL_EXECUTION",realExecution:true};

  if(passiveVerified===true&&aggressiveVerified!==true)
    return {state:"PASSIVE_EXECUTION_VERIFIED",realExecution:true};

  if(aggressiveVerified===true&&passiveVerified!==true)
    return {state:"AGGRESSIVE_EXECUTION_VERIFIED",realExecution:true};

  return {state:"EXECUTION_STYLE_UNKNOWN",realExecution:true};
}

export function classifyOrderLifecycle({
  realOrderSubmitted,
  filledQty,
  submittedQty,
  cancelled,
  studyEnded,
  rejected
}={}){
  if(realOrderSubmitted!==true)
    return {state:"NO_ORDER_SUBMITTED",denominatorEligible:true};

  if(rejected===true)
    return {state:"ORDER_REJECTED",denominatorEligible:true};

  const fq=Number.isFinite(filledQty)?filledQty:0;
  const sq=Number.isFinite(submittedQty)?submittedQty:null;

  if(sq!==null&&sq>0&&fq>=sq)
    return {state:"FILLED",denominatorEligible:true};

  if(fq>0&&(sq===null||fq<sq))
    return {state:"PARTIAL",denominatorEligible:true};

  if(cancelled===true)
    return {state:"CANCELLED",denominatorEligible:true};

  if(studyEnded===true)
    return {state:"UNFILLED_STUDY_END",denominatorEligible:true};

  return {state:"SUBMITTED_PENDING",denominatorEligible:true};
}

export function feeTimingGuard({
  predictorFreezeAt,
  feeKnownAt,
  scheduleEffectiveAt,
  replaySafe
}={}){
  const freeze=str(predictorFreezeAt);
  const known=str(feeKnownAt);
  const effective=str(scheduleEffectiveAt);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(!freeze||!known||!effective)
    return {status:"UNKNOWN",reason:"FEE_CLOCK_INCOMPLETE"};

  if(effective>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"SCHEDULE_NOT_EFFECTIVE_AT_FREEZE"};

  if(known>freeze)
    return {status:"POST_TREATMENT",reason:"FEE_NOT_KNOWN_AT_FREEZE"};

  return {status:"BASELINE_FEE_SCHEDULE_AVAILABLE"};
}

export function realizedExecutionCostGuard({
  predictorFreezeAt,
  realizedCostKnownAt
}={}){
  const freeze=str(predictorFreezeAt);
  const known=str(realizedCostKnownAt);

  if(!freeze||!known)
    return {status:"UNKNOWN",reason:"COST_CLOCK_INCOMPLETE"};

  return known>freeze
    ?{status:"POST_TREATMENT_REALIZED_COST",baselineEligible:false}
    :{status:"BASELINE_AVAILABLE",baselineEligible:true};
}

export function foreignMakerTakerTransferGuard({
  localVenueProgramVerified,
  foreignEvidenceOnly
}={}){
  if(localVenueProgramVerified===true)
    return {status:"LOCAL_REGIME_VERIFIED"};

  if(foreignEvidenceOnly===true)
    return {status:"PROHIBITED",reason:"FOREIGN_MAKER_TAKER_TRANSFER_WITHOUT_LOCAL_PROOF"};

  return {status:"UNKNOWN_LOCAL_FEE_REGIME"};
}

export function buildExecutionSelectionComparator({
  nearFrozenZone,
  executionContextMatched,
  feeContextMatched
}={}){
  if(executionContextMatched!==true||feeContextMatched!==true)
    return {status:"UNKNOWN",reason:"COMPARATOR_CONTEXT_UNMATCHED"};

  return nearFrozenZone===true
    ?{status:"G1_ZONE_ASSOCIATED_EXECUTION_SELECTION",independentVote:false}
    :{status:"G0_GENERIC_EXECUTION_SELECTION",independentVote:false};
}

export function denominatorAudit(entries=[]){
  const states={};
  for(const e of entries||[]){
    const s=str(e?.state)||"UNKNOWN";
    states[s]=(states[s]||0)+1;
  }
  return {
    totalOpportunities:(entries||[]).length,
    states,
    completedFillOnlyDenominatorAllowed:false,
    unfilledMayBeDropped:false
  };
}

export function informationLineage({parentDecisionId,receipts=[]}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};
  return {
    status:"VALID",
    rawReceiptCount:Array.isArray(receipts)?receipts.length:0,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
