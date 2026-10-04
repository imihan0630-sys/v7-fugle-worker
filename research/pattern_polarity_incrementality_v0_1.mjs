// D01 DL-035 polarity incrementality / retest selection firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}

export function buildRetestArrivalCohortEntry({
  parentId,
  breakout,
  priorOppositeRoleCertified,
  originalRole,
  candidateRole,
  salienceReceipt,
  preBreakContext,
  postBreakPath
}={}){
  const p=str(parentId);
  const eventId=str(breakout?.eventId);
  const confirmedAt=str(breakout?.confirmedAt);

  if(!p||!eventId||!confirmedAt||breakout?.confirmed!==true)
    return {status:"UNKNOWN",reason:"BREAKOUT_COHORT_IDENTITY_INCOMPLETE"};

  if(postBreakPath!==undefined&&postBreakPath!==null)
    return {status:"PROHIBITED",reason:"POST_BREAK_PATH_IN_BASELINE_PROHIBITED"};

  if(salienceReceipt?.verified!==true)
    return {status:"UNKNOWN",reason:"SALIENCE_RECEIPT_UNVERIFIED"};

  if(!preBreakContext||preBreakContext.asOf!==confirmedAt)
    return {status:"UNKNOWN",reason:"PRE_BREAK_CONTEXT_ASOF_MISMATCH"};

  const isFormer=priorOppositeRoleCertified===true;
  if(isFormer&&(!str(originalRole)||!str(candidateRole)))
    return {status:"UNKNOWN",reason:"FORMER_ROLE_IDENTITY_INCOMPLETE"};

  return {
    status:"VALID",
    parentId:p,
    breakoutEventId:eventId,
    breakoutConfirmedAt:confirmedAt,
    comparatorClass:isFormer
      ?"S1_CERTIFIED_FORMER_ROLE_BREAKOUT"
      :"S0_SALIENT_NON_ROLE_BREAKOUT",
    priorOppositeRoleCertified:isFormer,
    originalRole:isFormer?str(originalRole):null,
    candidateRole:str(candidateRole)||null,
    preBreakContext,
    salienceReceipt,
    firstRetestKnownAtEntry:false,
    selectionReportRequired:true,
    independentSample:true,
    outcomeJoinAllowed:false
  };
}

export function classifyRetestArrival({
  cohortEntry,
  asOf,
  firstRetestOpportunityAt,
  cancelledBeforeRetest,
  cancelReason,
  studyEnded,
  dataBlocked
}={}){
  if(cohortEntry?.status!=="VALID")
    return {status:"UNKNOWN",reason:"COHORT_ENTRY_INVALID"};

  const t=str(asOf);
  if(!t||t<cohortEntry.breakoutConfirmedAt)
    return {status:"UNKNOWN",reason:"ARRIVAL_CLOCK_INVALID"};

  if(dataBlocked===true)
    return {status:"DATA_BLOCKED",reason:str(cancelReason)||"ARRIVAL_PROVENANCE_BLOCKED"};

  if(cancelledBeforeRetest===true)
    return {
      status:"CANCELLED_BEFORE_RETEST",
      reason:str(cancelReason)||"COMPETING_EVENT",
      failedRetest:false
    };

  const retestAt=str(firstRetestOpportunityAt);
  if(retestAt){
    if(retestAt<=cohortEntry.breakoutConfirmedAt||retestAt>t)
      return {status:"UNKNOWN",reason:"FIRST_RETEST_CLOCK_INVALID"};
    return {
      status:"FIRST_RETEST_ARRIVED",
      firstRetestOpportunityAt:retestAt,
      rightCensored:false
    };
  }

  if(studyEnded===true)
    return {
      status:"RIGHT_CENSORED_NO_RETEST",
      rightCensored:true,
      failedRetest:false
    };

  return {status:"RETEST_NOT_YET_OBSERVED",rightCensored:false,failedRetest:false};
}

export function buildFirstRetestResponseSnapshot({
  cohortEntry,
  arrivalState,
  opportunity,
  postBreakPath,
  responseOutcome
}={}){
  if(cohortEntry?.status!=="VALID")
    return {status:"UNKNOWN",reason:"COHORT_ENTRY_INVALID"};
  if(arrivalState?.status!=="FIRST_RETEST_ARRIVED")
    return {status:"NOT_E2_ELIGIBLE",reason:"FIRST_RETEST_NOT_ARRIVED"};

  const at=str(opportunity?.at);
  if(opportunity?.valid!==true||
     !at||
     at!==arrivalState.firstRetestOpportunityAt)
    return {status:"UNKNOWN",reason:"OPPORTUNITY_IDENTITY_MISMATCH"};

  if(postBreakPath?.complete!==true)
    return {status:"DATA_BLOCKED",reason:"POST_BREAK_PATH_INCOMPLETE"};

  return {
    status:"VALID_E2_SNAPSHOT",
    parentId:cohortEntry.parentId,
    comparatorClass:cohortEntry.comparatorClass,
    breakoutConfirmedAt:cohortEntry.breakoutConfirmedAt,
    firstRetestOpportunityAt:at,
    preBreakContext:cohortEntry.preBreakContext,
    postBreakPath:{
      maxDirectionalDisplacementAtr:postBreakPath.maxDirectionalDisplacementAtr??null,
      cumulativePathAtr:postBreakPath.cumulativePathAtr??null,
      eligibleSessionsToRetest:postBreakPath.eligibleSessionsToRetest??null,
      retracementDescriptor:postBreakPath.retracementDescriptor??null
    },
    postBreakPathRole:"MEDIATOR_OR_SELECTION_VARIABLE",
    responseOutcomeUsed:false,
    suppliedResponseOutcomeIgnored:responseOutcome!==undefined,
    selectionReportRequired:true,
    independentSample:false,
    outcomeJoinAllowed:false
  };
}

export function classifyCommonSupport({
  preBreakOverlap,
  salienceOverlap,
  volatilityLiquidityOverlap,
  regimeOverlap,
  constraintOverlap,
  postBreakPathOverlap,
  estimand="TOTAL_POLARITY_INCREMENT"
}={}){
  const base=[
    preBreakOverlap,
    salienceOverlap,
    volatilityLiquidityOverlap,
    regimeOverlap,
    constraintOverlap
  ];

  if(base.some(v=>v===false))
    return {status:"EXTRAPOLATION_PROHIBITED",reason:"PRE_BREAK_COMMON_SUPPORT_FAILED"};
  if(base.some(v=>v!==true))
    return {status:"UNKNOWN",reason:"PRE_BREAK_COMMON_SUPPORT_INCOMPLETE"};

  if(estimand==="PATH_CONDITIONAL_POLARITY_INCREMENT"){
    if(postBreakPathOverlap===false)
      return {status:"EXTRAPOLATION_PROHIBITED",reason:"POST_BREAK_PATH_SUPPORT_FAILED"};
    if(postBreakPathOverlap!==true)
      return {status:"UNKNOWN",reason:"POST_BREAK_PATH_SUPPORT_INCOMPLETE"};
  }

  return {status:"COMMON_SUPPORT_VALID",estimand};
}

export function classifyEstimand({adjustPostBreakPath}={}){
  return adjustPostBreakPath===true
    ?{
      status:"PATH_CONDITIONAL_POLARITY_INCREMENT",
      interpretation:"DIRECT_OR_CONTEXT_CONDITIONAL",
      totalEffectClaimAllowed:false
    }
    :{
      status:"TOTAL_POLARITY_INCREMENT",
      interpretation:"PRE_BREAK_ADJUSTED_TOTAL",
      totalEffectClaimAllowed:true
    };
}
