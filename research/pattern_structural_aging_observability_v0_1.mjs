// D01 DL-031 structural aging vs observability censoring v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function buildAgingState({
  root,
  currentVersion,
  asOf,
  sessionReceipt,
  observability,
  interactionHistory={}
}={}){
  const firstConfirmedAt=str(root?.firstConfirmedAt);
  const versionEffectiveAt=str(currentVersion?.effectiveAt);
  const asOfDate=str(asOf);

  if(!firstConfirmedAt||!versionEffectiveAt||!asOfDate){
    return {status:"UNKNOWN",reason:"AGE_CLOCK_IDENTITY_INCOMPLETE"};
  }
  if(firstConfirmedAt>asOfDate||versionEffectiveAt>asOfDate){
    return {status:"UNKNOWN",reason:"FUTURE_IDENTITY_CLOCK"};
  }

  if(sessionReceipt?.complete!==true||
     !finite(sessionReceipt?.firstConfirmedOrdinal)||
     !finite(sessionReceipt?.versionEffectiveOrdinal)||
     !finite(sessionReceipt?.asOfOrdinal)){
    return {status:"DATA_BLOCKED",reason:"SESSION_ORDINAL_RECEIPT_INCOMPLETE"};
  }

  const rootAge=sessionReceipt.asOfOrdinal-sessionReceipt.firstConfirmedOrdinal;
  const versionAge=sessionReceipt.asOfOrdinal-sessionReceipt.versionEffectiveOrdinal;
  if(rootAge<0||versionAge<0){
    return {status:"UNKNOWN",reason:"NEGATIVE_AGE"};
  }

  const observableSessions=finite(observability?.observableSessionsSinceConfirmation)
    ?observability.observableSessionsSinceConfirmation:null;

  const state=classifyObservability(observability);

  const hist={
    priorInteractionCount:finite(interactionHistory.priorInteractionCount)?interactionHistory.priorInteractionCount:0,
    priorBounceCount:finite(interactionHistory.priorBounceCount)?interactionHistory.priorBounceCount:0,
    priorBreakCount:finite(interactionHistory.priorBreakCount)?interactionHistory.priorBreakCount:0,
    priorReclaimCount:finite(interactionHistory.priorReclaimCount)?interactionHistory.priorReclaimCount:0,
    timeSinceLastInteractionEligibleSessions:finite(interactionHistory.timeSinceLastInteractionEligibleSessions)
      ?interactionHistory.timeSinceLastInteractionEligibleSessions:null,
    timeSinceLastBounceEligibleSessions:finite(interactionHistory.timeSinceLastBounceEligibleSessions)
      ?interactionHistory.timeSinceLastBounceEligibleSessions:null
  };

  return {
    status:"VALID",
    rootAgeEligibleSessions:rootAge,
    versionAgeEligibleSessions:versionAge,
    observableSessionAge:observableSessions,
    observabilityState:state.state,
    detectorReconstructible:state.detectorReconstructible,
    rootFollowupAvailable:state.rootFollowupAvailable,
    interactionHistory:hist,
    scalarDecayScoreDefined:false,
    fixedHalfLifeDefined:false,
    outcomeJoinAllowed:false
  };
}

export function classifyObservability(o={}){
  if(o.marketInvalidated===true){
    return {
      state:"MARKET_INVALIDATED",
      detectorReconstructible:false,
      rootFollowupAvailable:false,
      eventType:"MARKET_EVENT"
    };
  }

  if(o.studyEnded===true){
    return {
      state:"STUDY_END_RIGHT_CENSORED",
      detectorReconstructible:o.detectorReconstructible===true,
      rootFollowupAvailable:o.rootFollowupAvailable===true,
      eventType:"CENSORING"
    };
  }

  if(o.coverageComplete!==true){
    return {
      state:"UNKNOWN_COVERAGE_GAP",
      detectorReconstructible:false,
      rootFollowupAvailable:o.rootFollowupAvailable===true,
      eventType:"UNKNOWN"
    };
  }

  if(o.rootLookbackObservable===false){
    return {
      state:"WINDOW_CENSORED_ROOT_PERSISTED",
      detectorReconstructible:false,
      rootFollowupAvailable:o.rootFollowupAvailable===true,
      eventType:"DETECTOR_CENSORING"
    };
  }

  if(o.detectorExecuted===true&&o.objectEmitted!==true){
    return {
      state:"DETECTOR_ABSENT_COMPLETE_SCAN",
      detectorReconstructible:true,
      rootFollowupAvailable:o.rootFollowupAvailable===true,
      eventType:"DETECTOR_STATE"
    };
  }

  return {
    state:"OBSERVABLE_ACTIVE",
    detectorReconstructible:true,
    rootFollowupAvailable:o.rootFollowupAvailable!==false,
    eventType:"ACTIVE"
  };
}

export function classifyDecayCohortEntry({
  firstConfirmationCertified,
  firstConfirmedAt,
  observationStartAt,
  replayHistoryComplete
}={}){
  if(firstConfirmationCertified===true&&firstConfirmedAt){
    if(!observationStartAt||firstConfirmedAt>=observationStartAt){
      return {status:"PROSPECTIVE_OR_AT_ENTRY_CONFIRMED",promotionGrade:true};
    }
    if(replayHistoryComplete===true){
      return {status:"HISTORICAL_REPLAY_FIRST_CONFIRMATION_CERTIFIED",promotionGrade:true};
    }
  }
  return {status:"LEFT_TRUNCATED_FIRST_CONFIRMATION_UNKNOWN",promotionGrade:false};
}

export function buildInteractionOpportunitySnapshot({
  agingState,
  opportunityReceipt,
  asOf
}={}){
  if(agingState?.status!=="VALID"){
    return {status:"UNKNOWN",reason:"AGING_STATE_INVALID"};
  }
  if(opportunityReceipt?.valid!==true){
    return {status:"NO_INTERACTION_OPPORTUNITY",pseudoFailureAllowed:false};
  }
  if(!asOf||opportunityReceipt.asOf!==asOf){
    return {status:"UNKNOWN",reason:"OPPORTUNITY_ASOF_MISMATCH"};
  }

  return {
    status:"VALID_OPPORTUNITY",
    asOf,
    rootAgeEligibleSessions:agingState.rootAgeEligibleSessions,
    versionAgeEligibleSessions:agingState.versionAgeEligibleSessions,
    observableSessionAge:agingState.observableSessionAge,
    priorInteractionCount:agingState.interactionHistory.priorInteractionCount,
    priorBounceCount:agingState.interactionHistory.priorBounceCount,
    priorBreakCount:agingState.interactionHistory.priorBreakCount,
    priorReclaimCount:agingState.interactionHistory.priorReclaimCount,
    outcomeFieldPresent:false,
    pseudoFailureAllowed:false
  };
}
