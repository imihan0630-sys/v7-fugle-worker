// D01 DL-035 PIT touch-risk-set helper v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}

export function buildAsOfTouchState({
  asOf,
  touchEvents=[],
  bounceEvents=[],
  breakEvents=[],
  lifecycleTerminalAt=null,
  eventualTotalTouches=undefined,
  pathComplete=true
}={}){
  const cutoff=txt(asOf);
  if(!cutoff) return {status:"UNKNOWN",reason:"ASOF_MISSING"};
  if(pathComplete!==true)
    return {status:"UNKNOWN",reason:"PATH_INCOMPLETE"};

  if(eventualTotalTouches!==undefined)
    return {status:"DATA_BLOCKED",reason:"EVENTUAL_TOTAL_TOUCHES_PROHIBITED"};

  const legal=(xs)=>[...(xs||[])].map(txt).filter(x=>x&&x<=cutoff).sort();
  const touches=legal(touchEvents);
  const bounces=legal(bounceEvents);
  const breaks=legal(breakEvents);

  const futureInput=[...(touchEvents||[]),...(bounceEvents||[]),...(breakEvents||[])]
    .map(txt).filter(x=>x&&x>cutoff);
  if(futureInput.length)
    return {status:"DATA_BLOCKED",reason:"FUTURE_EVENT_IN_DECISION_INPUT"};

  const terminal=txt(lifecycleTerminalAt);
  const alive=!(terminal&&terminal<=cutoff);

  return {
    status:"VALID",
    priorTouchCountThroughAsOf:touches.length,
    priorBounceCountThroughAsOf:bounces.length,
    priorBreakCountThroughAsOf:breaks.length,
    lastTouchAtThroughAsOf:touches.length?touches.at(-1):null,
    aliveInRiskSet:alive,
    independentVoteEligible:false
  };
}

export function riskSetEligibility({
  asOf,
  requiredPriorTouches,
  touchState
}={}){
  if(!touchState||touchState.status!=="VALID")
    return {status:"UNKNOWN",reason:"TOUCH_STATE_NOT_VALID"};
  if(touchState.aliveInRiskSet!==true)
    return {status:"NOT_ELIGIBLE",reason:"ZONE_TERMINAL"};
  if(touchState.priorTouchCountThroughAsOf!==requiredPriorTouches)
    return {status:"NOT_ELIGIBLE",reason:"PRIOR_TOUCH_HISTORY_MISMATCH"};
  return {
    status:"ELIGIBLE",
    asOf,
    requiredPriorTouches,
    futureResponseNotUsed:true
  };
}
