// D01 DL-024 repeated-cycle sequence decomposition v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}

export function decomposeRepeatedSequence({eventGroups=[],eligibleSessionDates=[]}={}){
  const sessions=[...eligibleSessionDates].filter(Boolean).sort();
  if(new Set(sessions).size!==sessions.length)
    return {status:"QA_FAIL",reason:"DUPLICATE_ELIGIBLE_SESSION_DATE"};

  const groups=(eventGroups||[]).map(g=>({
    key:txt(g.sourceEventGroupKey),
    t:txt(g.eventOccurredAt),
    labels:[...(g.eventTypes||[])].sort()
  })).sort((a,b)=>a.t.localeCompare(b.t)||a.key.localeCompare(b.key));

  if(groups.some(g=>!g.key||!g.t))
    return {status:"UNKNOWN",reason:"EVENT_PROVENANCE_INCOMPLETE"};
  if(groups.some(g=>!sessions.includes(g.t)))
    return {status:"DATA_BLOCKED",reason:"EVENT_OUTSIDE_CERTIFIED_SESSION_SET"};

  const cycles=[];
  let current=null;
  let ordinal=0;

  for(const g of groups){
    const isReturn=g.labels.includes("PARENT_REENTRY")||g.labels.includes("PARENT_FAILURE");
    const isFailure=g.labels.includes("PARENT_FAILURE");
    const isReclaim=g.labels.includes("PARENT_RECLAIM");

    if(isReturn&&current===null){
      ordinal++;
      current={
        cycleOrdinal:ordinal,
        returnStartedAt:g.t,
        returnSourceGroupKey:g.key,
        failureFirstObservedAt:isFailure?g.t:null,
        failureSourceGroupKey:isFailure?g.key:null,
        reclaimAt:null,
        reclaimSourceGroupKey:null,
        open:true
      };
      cycles.push(current);
      continue;
    }

    if(isReturn&&current!==null){
      if(isFailure&&!current.failureFirstObservedAt){
        current.failureFirstObservedAt=g.t;
        current.failureSourceGroupKey=g.key;
      }
      continue;
    }

    if(isReclaim){
      if(current===null)
        return {status:"QA_FAIL",reason:"ORPHAN_RECLAIM_WITHOUT_OPEN_RETURN"};
      current.reclaimAt=g.t;
      current.reclaimSourceGroupKey=g.key;
      current.open=false;
      current=null;
    }
  }

  for(const c of cycles){
    if(c.failureFirstObservedAt){
      const ri=sessions.indexOf(c.returnStartedAt);
      const fi=sessions.indexOf(c.failureFirstObservedAt);
      if(ri<0||fi<0||fi<ri)
        return {status:"DATA_BLOCKED",reason:"FAILURE_ESCALATION_ORDINAL_UNCERTIFIED"};
      c.failureEscalationLagEligibleSessions=fi-ri;
      c.failurePlacementClass=fi===ri?"FAILURE_ON_RETURN_GROUP":"FAILURE_AFTER_REENTRY";
    }else if(c.open){
      c.failureEscalationLagEligibleSessions=null;
      c.failurePlacementClass="OPEN_RETURN_NO_FAILURE_YET";
    }else{
      c.failureEscalationLagEligibleSessions=null;
      c.failurePlacementClass="NO_FAILURE";
    }
  }

  return {
    status:"VALID",
    cycles,
    completedCycleCount:cycles.filter(c=>!c.open).length,
    openCycleCount:cycles.filter(c=>c.open).length,
    coarseAlternationNovelty:"NONE_DETERMINISTIC_STATE_MACHINE",
    residualSequenceCandidate:"FAILURE_PLACEMENT_AND_ESCALATION_TIMING",
    independentVoteEligible:false,
    predictiveIncrementality:"UNKNOWN"
  };
}

export function compareSequenceSummaries(a={},b={}){
  const countsA=[a.completedCycleCount,a.openCycleCount,(a.cycles||[]).filter(x=>x.failureFirstObservedAt).length];
  const countsB=[b.completedCycleCount,b.openCycleCount,(b.cycles||[]).filter(x=>x.failureFirstObservedAt).length];
  const sameCounts=JSON.stringify(countsA)===JSON.stringify(countsB);
  const severityA=(a.cycles||[]).map(x=>[x.cycleOrdinal,x.failurePlacementClass,x.failureEscalationLagEligibleSessions]);
  const severityB=(b.cycles||[]).map(x=>[x.cycleOrdinal,x.failurePlacementClass,x.failureEscalationLagEligibleSessions]);
  return {
    sameCoarseCounts:sameCounts,
    sameSeverityPlacement:JSON.stringify(severityA)===JSON.stringify(severityB),
    interpretation:sameCounts&&JSON.stringify(severityA)!==JSON.stringify(severityB)
      ?"SEVERITY_PLACEMENT_PATH_MEMORY_BEYOND_COARSE_COUNTS"
      :"NO_NEW_SEQUENCE_DIFFERENCE_AT_THIS_LEVEL"
  };
}
