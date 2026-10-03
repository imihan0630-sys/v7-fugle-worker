// D01 DL-023 repeated-cycle path-memory summarizer v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}

function ordinalGap(a,b,sessions){
  const ai=sessions.indexOf(a), bi=sessions.indexOf(b);
  if(ai<0||bi<0||bi<ai) return null;
  return bi-ai;
}

export function summarizeRepeatedCycles({
  asOf,
  firstReclaimAt=null,
  eventGroups=[],
  eligibleSessionDates=[],
  constrainedDates=[]
}={}){
  const cutoff=txt(asOf);
  if(!cutoff) return {status:"UNKNOWN",reason:"ASOF_MISSING"};

  const sessions=[...eligibleSessionDates].filter(Boolean).sort();
  if(new Set(sessions).size!==sessions.length)
    return {status:"QA_FAIL",reason:"DUPLICATE_ELIGIBLE_SESSION_DATE"};
  if(!sessions.includes(cutoff))
    return {status:"DATA_BLOCKED",reason:"ASOF_NOT_IN_CERTIFIED_ELIGIBLE_SET"};

  const start=txt(firstReclaimAt);
  if(!start)
    return {
      status:"VALID",
      repeatRiskState:"REPEATED_CYCLE_NOT_YET_AT_RISK",
      recurrentReturnGroupCount:null,
      recurrentFailureGroupCount:null,
      recurrentReclaimGroupCount:null,
      completedRepeatedCycleCount:null,
      openRepeatedCycle:null,
      observableEligibleSessionsAtRisk:null,
      constrainedEligibleSessionsAtRisk:null,
      repeatGapEligibleSessions:[],
      lastRepeatTransitionAgeEligibleSessions:null
    };

  if(start>cutoff)
    return {status:"DATA_BLOCKED",reason:"FUTURE_FIRST_RECLAIM"};
  if(!sessions.includes(start))
    return {status:"DATA_BLOCKED",reason:"REPEAT_RISK_START_NOT_IN_CERTIFIED_SET"};

  const constrained=new Set(constrainedDates||[]);
  const atRiskDates=sessions.filter(d=>d>=start&&d<=cutoff);
  const constrainedCount=atRiskDates.filter(d=>constrained.has(d)).length;
  const observableCount=atRiskDates.length-constrainedCount;

  const groups=(eventGroups||[])
    .filter(g=>txt(g.eventOccurredAt)>start&&txt(g.eventOccurredAt)<=cutoff)
    .map(g=>({
      key:txt(g.sourceEventGroupKey),
      t:txt(g.eventOccurredAt),
      labels:[...(g.eventTypes||[])].sort()
    }))
    .sort((a,b)=>a.t.localeCompare(b.t)||a.key.localeCompare(b.key));

  if(groups.some(g=>!g.key||!g.t))
    return {status:"UNKNOWN",reason:"RECURRENT_EVENT_PROVENANCE_INCOMPLETE"};
  if(groups.some(g=>!sessions.includes(g.t)))
    return {status:"DATA_BLOCKED",reason:"RECURRENT_EVENT_OUTSIDE_CERTIFIED_SET"};

  let returns=0, failures=0, reclaims=0, completed=0;
  let state="READY_FOR_RETURN";
  let openReturnKey=null;
  const recurrentTimes=[];

  for(const g of groups){
    const isReturn=g.labels.includes("PARENT_REENTRY")||g.labels.includes("PARENT_FAILURE");
    const isFailure=g.labels.includes("PARENT_FAILURE");
    const isReclaim=g.labels.includes("PARENT_RECLAIM");

    if(isReturn){
      if(state==="READY_FOR_RETURN"){
        returns++;
        if(isFailure) failures++;
        state="OPEN_RETURN";
        openReturnKey=g.key;
        recurrentTimes.push(g.t);
      }else if(isFailure){
        failures++;
      }
    }

    if(isReclaim){
      if(state==="OPEN_RETURN"){
        reclaims++;
        completed++;
        state="READY_FOR_RETURN";
        openReturnKey=null;
        recurrentTimes.push(g.t);
      }
    }
  }

  const gaps=[];
  for(let i=1;i<recurrentTimes.length;i++){
    const g=ordinalGap(recurrentTimes[i-1],recurrentTimes[i],sessions);
    if(g===null) return {status:"DATA_BLOCKED",reason:"GAP_ORDINAL_UNCERTIFIED"};
    gaps.push(g);
  }

  const last=recurrentTimes.length?recurrentTimes.at(-1):null;
  const lastAge=last?ordinalGap(last,cutoff,sessions):null;

  return {
    status:"VALID",
    repeatRiskState:state,
    recurrentReturnGroupCount:returns,
    recurrentFailureGroupCount:failures,
    recurrentReclaimGroupCount:reclaims,
    completedRepeatedCycleCount:completed,
    openRepeatedCycle:state==="OPEN_RETURN"?1:0,
    openReturnSourceEventGroupKey:openReturnKey,
    observableEligibleSessionsAtRisk:observableCount,
    constrainedEligibleSessionsAtRisk:constrainedCount,
    repeatGapEligibleSessions:gaps,
    lastRepeatTransitionAgeEligibleSessions:lastAge,
    cycleRatePerObservableSession:observableCount>0?completed/observableCount:null,
    independentSampleIncrement:0,
    predictiveIncrementality:"UNKNOWN"
  };
}
