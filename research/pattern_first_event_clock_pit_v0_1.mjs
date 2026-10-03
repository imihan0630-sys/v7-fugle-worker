// D01 DL-021 decision-time first-event clock constructor v0.1
// Research-only / PIT-safe / no outcome access.

function txt(x){return typeof x==="string"?x.trim():"";}
function uniqSorted(xs){
  const out=[...xs].sort();
  if(new Set(out).size!==out.length) return null;
  return out;
}

export function buildAsOfEventClockFeature({
  asOf,
  eventOccurredAt=null,
  eventAvailableAt=null,
  firstObservedAt=null,
  eligibleSessionDates=[],
  provenanceComplete=true
}={}){
  const cutoff=txt(asOf);
  if(!cutoff) return {status:"UNKNOWN",reason:"ASOF_MISSING"};
  if(provenanceComplete!==true)
    return {status:"UNKNOWN",reason:"PROVENANCE_INCOMPLETE",occurred:null,ageEligibleSessions:null};

  const sessions=uniqSorted((eligibleSessionDates||[]).filter(Boolean));
  if(!sessions) return {status:"QA_FAIL",reason:"DUPLICATE_ELIGIBLE_SESSION_DATE"};
  if(!sessions.includes(cutoff))
    return {status:"DATA_BLOCKED",reason:"ASOF_NOT_IN_CERTIFIED_ELIGIBLE_SET"};

  const occurred=txt(eventOccurredAt);
  const available=txt(eventAvailableAt);
  const observed=txt(firstObservedAt);

  if(!occurred){
    if(available||observed)
      return {status:"QA_FAIL",reason:"OBSERVATION_CLOCK_WITHOUT_EVENT_CLOCK"};
    return {
      status:"VALID",
      occurred:0,
      firstOccurredAt:null,
      ageEligibleSessions:null,
      censoringState:"NOT_YET_OCCURRED_THROUGH_ASOF"
    };
  }

  if(occurred>cutoff)
    return {status:"DATA_BLOCKED",reason:"FUTURE_EVENT_CLOCK_IN_PREDICTOR"};
  if(available && available>cutoff)
    return {status:"DATA_BLOCKED",reason:"EVENT_NOT_AVAILABLE_BY_ASOF"};
  if(observed && observed>cutoff)
    return {status:"DATA_BLOCKED",reason:"EVENT_NOT_OBSERVED_BY_ASOF"};

  const oi=sessions.indexOf(occurred), ai=sessions.indexOf(cutoff);
  if(oi<0)
    return {status:"DATA_BLOCKED",reason:"EVENT_NOT_IN_CERTIFIED_ELIGIBLE_SET"};
  if(oi>ai)
    return {status:"DATA_BLOCKED",reason:"EVENT_AFTER_ASOF_ORDINAL"};

  return {
    status:"VALID",
    occurred:1,
    firstOccurredAt:occurred,
    ageEligibleSessions:ai-oi,
    censoringState:"EVENT_OBSERVED_BY_ASOF"
  };
}

export function validateNestedFailureReentry({firstReentryAt=null,firstFailureAt=null,sourceEventGroupKeyReentry=null,sourceEventGroupKeyFailure=null}={}){
  if(firstFailureAt&&!firstReentryAt)
    return {status:"QA_FAIL",reason:"FAILURE_WITHOUT_REENTRY"};
  if(firstFailureAt&&firstReentryAt&&firstFailureAt<firstReentryAt)
    return {status:"QA_FAIL",reason:"FAILURE_PRECEDES_REENTRY"};
  if(firstFailureAt&&firstReentryAt&&firstFailureAt===firstReentryAt){
    if(!sourceEventGroupKeyReentry||sourceEventGroupKeyReentry!==sourceEventGroupKeyFailure)
      return {status:"QA_FAIL",reason:"SAME_BAR_NESTED_EVENTS_REQUIRE_SHARED_SOURCE_GROUP"};
    return {status:"VALID",independentConfirmationCount:1};
  }
  return {status:"VALID",independentConfirmationCount:firstFailureAt?2:(firstReentryAt?1:0)};
}
