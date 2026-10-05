// D01 DL-042 event-day / scheduled-information clustering firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}

export function classifyDecisionRelativeEventState({
  predictorFreezeAt,
  eventReceipt
}={}){
  const freeze=str(predictorFreezeAt);
  if(!freeze) return {status:"E5_EVENT_CONTEXT_UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  if(!eventReceipt){
    return {status:"E5_EVENT_CONTEXT_UNKNOWN",reason:"EVENT_RECEIPT_MISSING"};
  }

  if(eventReceipt.coverageComplete!==true){
    return {status:"E5_EVENT_CONTEXT_UNKNOWN",reason:"EVENT_COVERAGE_INCOMPLETE"};
  }

  const scheduledAt=str(eventReceipt.scheduledAt);
  const firstKnownScheduledAt=str(eventReceipt.firstKnownScheduledAt);
  const releasedAt=str(eventReceipt.releasedAt);
  const firstObservedAt=str(eventReceipt.firstObservedAt);
  const unscheduled=eventReceipt.unscheduled===true;

  if(unscheduled){
    if(firstObservedAt&&firstObservedAt<=freeze){
      return {
        status:"E3_UNSCHEDULED_DISCLOSED_PRE_FREEZE",
        eventFamilyId:str(eventReceipt.eventFamilyId)||null,
        eventInstanceId:str(eventReceipt.eventInstanceId)||null,
        commonEventClusterId:str(eventReceipt.commonEventClusterId)||null
      };
    }
    if(firstObservedAt&&firstObservedAt>freeze){
      return {status:"E4_EVENT_AFTER_FREEZE_FUTURE",reason:"UNSCHEDULED_NOT_KNOWN_AT_FREEZE"};
    }
    return {status:"E5_EVENT_CONTEXT_UNKNOWN",reason:"UNSCHEDULED_CLOCK_INCOMPLETE"};
  }

  if(releasedAt&&firstObservedAt&&releasedAt<=freeze&&firstObservedAt<=freeze){
    return {
      status:"E2_REALIZED_PRE_FREEZE",
      eventFamilyId:str(eventReceipt.eventFamilyId)||null,
      eventInstanceId:str(eventReceipt.eventInstanceId)||null,
      commonEventClusterId:str(eventReceipt.commonEventClusterId)||null
    };
  }

  if(firstKnownScheduledAt&&firstKnownScheduledAt<=freeze&&scheduledAt){
    if(scheduledAt>freeze){
      return {
        status:"E1_SCHEDULED_PENDING",
        eventFamilyId:str(eventReceipt.eventFamilyId)||null,
        eventInstanceId:str(eventReceipt.eventInstanceId)||null,
        commonEventClusterId:str(eventReceipt.commonEventClusterId)||null
      };
    }
    if(releasedAt&&releasedAt>freeze){
      return {
        status:"E1_SCHEDULED_PENDING",
        reason:"RELEASE_AFTER_FREEZE",
        eventFamilyId:str(eventReceipt.eventFamilyId)||null,
        eventInstanceId:str(eventReceipt.eventInstanceId)||null
      };
    }
  }

  if(eventReceipt.noKnownEvent===true){
    return {status:"E0_NO_KNOWN_EVENT",noEventClaimIsAbsolute:false};
  }

  if((releasedAt&&releasedAt>freeze)||(firstObservedAt&&firstObservedAt>freeze)){
    return {status:"E4_EVENT_AFTER_FREEZE_FUTURE",reason:"EVENT_NOT_AVAILABLE_AT_FREEZE"};
  }

  return {status:"E5_EVENT_CONTEXT_UNKNOWN",reason:"CLOCKS_DO_NOT_ESTABLISH_STATE"};
}

export function validateSurpriseEligibility({
  predictorFreezeAt,
  releaseFirstObservedAt,
  consensusKnownAt,
  initialReleaseKnownAt,
  revisionUsed
}={}){
  const freeze=str(predictorFreezeAt);
  const release=str(releaseFirstObservedAt);
  const consensus=str(consensusKnownAt);
  const initial=str(initialReleaseKnownAt);

  if(revisionUsed===true)
    return {status:"PROHIBITED",reason:"REVISED_VALUE_NOT_INITIAL_VINTAGE"};

  if(!freeze||!release||!consensus||!initial)
    return {status:"UNKNOWN",reason:"SURPRISE_CLOCK_INCOMPLETE"};

  if(consensus>=release)
    return {status:"PROHIBITED",reason:"CONSENSUS_NOT_PRE_RELEASE"};

  if(release>freeze||initial>freeze)
    return {status:"FUTURE_NOT_ELIGIBLE",reason:"RELEASE_OR_INITIAL_VALUE_AFTER_FREEZE"};

  return {status:"SURPRISE_PIT_ELIGIBLE"};
}

export function validateCalendarVintage({
  predictorFreezeAt,
  capturedAt,
  firstObservedAt,
  usedCurrentCalendarToBackfill,
  revisionLineageKnown
}={}){
  const freeze=str(predictorFreezeAt);
  const captured=str(capturedAt);
  const observed=str(firstObservedAt);

  if(usedCurrentCalendarToBackfill===true)
    return {status:"PROHIBITED",reason:"CURRENT_CALENDAR_HISTORICAL_BACKFILL"};

  if(!freeze||!captured||!observed)
    return {status:"UNKNOWN",reason:"CALENDAR_VINTAGE_CLOCK_INCOMPLETE"};

  if(captured>freeze||observed>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"CALENDAR_NOT_OBSERVED_AT_FREEZE"};

  return {
    status:"VALID",
    revisionLineageState:revisionLineageKnown===true?"KNOWN":"UNKNOWN"
  };
}

export function buildEventReplicationDiagnostics(rows=[]){
  const valid=(rows||[]).filter(Boolean);
  const pair=(a,b)=>`${str(a)}::${str(b)}`;
  const marketDates=uniq(valid.map(x=>x.marketDate));
  const instances=uniq(valid.map(x=>x.eventInstanceId));
  const families=uniq(valid.map(x=>x.eventFamilyId));
  const commonClusters=uniq(valid.map(x=>x.commonEventClusterId));
  const nonEventDates=uniq(valid.filter(x=>x.eventState==="E0_NO_KNOWN_EVENT").map(x=>x.marketDate));
  const unknownN=valid.filter(x=>x.eventState==="E5_EVENT_CONTEXT_UNKNOWN").length;

  return {
    status:valid.length?"VALID":"UNKNOWN",
    stockObservationN:valid.length,
    uniqueSymbolN:uniq(valid.map(x=>x.symbol)).length,
    structuralRootN:uniq(valid.map(x=>x.structuralRootId)).length,
    marketDateClusterN:marketDates.length,
    eventInstanceClusterN:instances.length||null,
    eventFamilyN:families.length||null,
    commonEventClusterN:commonClusters.length||null,
    eventFamilyDateClusterN:uniq(valid.filter(x=>x.eventFamilyId).map(x=>pair(x.eventFamilyId,x.marketDate))).length||null,
    nonEventMarketDateN:nonEventDates.length,
    unknownEventContextN:unknownN,
    manyStocksOneEventManyReplications:false,
    manyMarketDatesOneEventManyReplications:false
  };
}

export function validateEventExclusionPolicy({
  policyFrozenBeforeOutcome,
  selectedFamiliesAfterOutcome,
  selectedDatesAfterOutcome,
  shockThresholdOutcomeSelected
}={}){
  if(selectedFamiliesAfterOutcome===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_EVENT_FAMILY"};
  if(selectedDatesAfterOutcome===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_EVENT_DATES"};
  if(shockThresholdOutcomeSelected===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_EVENT_THRESHOLD"};
  if(policyFrozenBeforeOutcome!==true)
    return {status:"UNKNOWN",reason:"EVENT_EXCLUSION_POLICY_UNFROZEN"};
  return {status:"VALID"};
}

export function classifyEventCommonSupport({
  sizeLiquidityOverlap,
  sectorOverlap,
  betaMarketRegimeOverlap,
  opportunityGeometryOverlap,
  preEventVolatilityOverlap,
  tradabilityOverlap
}={}){
  const checks={
    sizeLiquidityOverlap,
    sectorOverlap,
    betaMarketRegimeOverlap,
    opportunityGeometryOverlap,
    preEventVolatilityOverlap,
    tradabilityOverlap
  };
  if(Object.values(checks).some(v=>v===false))
    return {status:"EVENT_CONTEXT_EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}
