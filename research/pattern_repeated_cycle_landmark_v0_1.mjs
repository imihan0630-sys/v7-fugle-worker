// D01 DL-025 repeated-cycle landmark eligibility v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}

export function buildRepeatRiskLandmark({
  parentDecisionReceiptId,
  asOf,
  decisionCutoffAt,
  firstReclaimAt=null,
  firstReclaimAvailableAt=null,
  firstReclaimObservedAt=null,
  relationLineageValid=true,
  pathCompletenessState="COMPLETE_THROUGH_ASOF",
  repeatedCycleSummary=null
}={}){
  const parent=txt(parentDecisionReceiptId);
  const cutoff=txt(decisionCutoffAt||asOf);
  const date=txt(asOf);
  if(!parent||!date||!cutoff)
    return {status:"UNKNOWN",reason:"PARENT_OR_CUTOFF_MISSING",repeatRiskState:"UNKNOWN"};

  if(relationLineageValid!==true)
    return {status:"DATA_BLOCKED",reason:"RELATION_LINEAGE_INVALID",repeatRiskState:"UNKNOWN"};
  if(pathCompletenessState!=="COMPLETE_THROUGH_ASOF")
    return {status:"UNKNOWN",reason:"PATH_INCOMPLETE",repeatRiskState:"UNKNOWN"};

  const reclaim=txt(firstReclaimAt);
  const available=txt(firstReclaimAvailableAt);
  const observed=txt(firstReclaimObservedAt);

  if(!reclaim){
    if(available||observed)
      return {status:"QA_FAIL",reason:"RECLAIM_OBSERVATION_WITHOUT_EVENT_CLOCK",repeatRiskState:"UNKNOWN"};
    return {
      status:"VALID",
      repeatRiskState:"NOT_YET_AT_REPEAT_RISK",
      repeatedCycleCount:null,
      predictorCutoffAt:cutoff
    };
  }

  if(reclaim>cutoff)
    return {status:"DATA_BLOCKED",reason:"FUTURE_RECLAIM_USED_FOR_LANDMARK",repeatRiskState:"UNKNOWN"};
  if(!available||available>cutoff)
    return {status:"DATA_BLOCKED",reason:"RECLAIM_NOT_AVAILABLE_BY_CUTOFF",repeatRiskState:"UNKNOWN"};
  if(!observed||observed>cutoff)
    return {status:"DATA_BLOCKED",reason:"RECLAIM_NOT_OBSERVED_BY_CUTOFF",repeatRiskState:"UNKNOWN"};

  if(!repeatedCycleSummary||repeatedCycleSummary.status!=="VALID")
    return {status:"UNKNOWN",reason:"REPEATED_SUMMARY_NOT_VALID",repeatRiskState:"UNKNOWN"};

  const n=repeatedCycleSummary.completedRepeatedCycleCount;
  if(!Number.isInteger(n)||n<0)
    return {status:"QA_FAIL",reason:"INVALID_REPEATED_CYCLE_COUNT",repeatRiskState:"UNKNOWN"};

  return {
    status:"VALID",
    repeatRiskState:n===0?"AT_RISK_ZERO_EVENTS":"AT_RISK_WITH_EVENTS",
    repeatedCycleCount:n,
    openRepeatedCycle:repeatedCycleSummary.openRepeatedCycle??null,
    predictorCutoffAt:cutoff,
    forwardOutcomeMustStartAfter:cutoff,
    baselineBackfillAllowed:false,
    conditionalPopulation:"FIRST_RECLAIM_COMPLETED_AND_OBSERVED_BY_PARENT"
  };
}
