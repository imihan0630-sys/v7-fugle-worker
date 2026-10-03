// D01 DL-020 Pattern path dependency audit helper v0.1
// Outcome-blind / research-only.

export function auditPatternFieldSet(fields={}){
  const findings=[];

  if(Number.isFinite(fields.eligibleBarsSinceBreak)&&
     Number.isFinite(fields.observableBarsSinceBreak)&&
     Number.isFinite(fields.constrainedBarsSinceBreak)){
    const exact=fields.eligibleBarsSinceBreak===
      fields.observableBarsSinceBreak+fields.constrainedBarsSinceBreak;
    findings.push({
      rule:"D1",
      status:exact?"DETERMINISTIC_ALIAS":"SEMANTIC_CONTRADICTION",
      child:"eligibleBarsSinceBreak",
      parents:["observableBarsSinceBreak","constrainedBarsSinceBreak"]
    });
  }

  if(Number.isFinite(fields.parentLower)&&Number.isFinite(fields.parentUpper)&&Number.isFinite(fields.parentCenter)){
    const midpoint=(fields.parentLower+fields.parentUpper)/2;
    findings.push({
      rule:"D2",
      status:Math.abs(fields.parentCenter-midpoint)<1e-12?"DETERMINISTIC_ALIAS":"SEMANTIC_CONTRADICTION",
      child:"parentCenter",
      parents:["parentLower","parentUpper"]
    });
  }

  if(Number.isFinite(fields.parentLower)&&Number.isFinite(fields.localUpper)&&fields.localUpper!==0&&
     Number.isFinite(fields.availableAirToParentLowerPct)){
    const expect=(fields.parentLower-fields.localUpper)/fields.localUpper;
    findings.push({
      rule:"D3",
      status:Math.abs(fields.availableAirToParentLowerPct-expect)<1e-12?"DETERMINISTIC_ALIAS":"SEMANTIC_CONTRADICTION",
      child:"availableAirToParentLowerPct",
      parents:["parentLower","localUpper"]
    });
  }

  if(Number.isFinite(fields.parentLower)&&Number.isFinite(fields.localUpper)&&
     Number.isFinite(fields.atr)&&fields.atr>0&&Number.isFinite(fields.availableAirToParentLowerATR)){
    const expect=(fields.parentLower-fields.localUpper)/fields.atr;
    findings.push({
      rule:"D5",
      status:Math.abs(fields.availableAirToParentLowerATR-expect)<1e-12?"SCALE_ALTERNATIVE":"SEMANTIC_CONTRADICTION",
      child:"availableAirToParentLowerATR",
      parents:["parentLower","localUpper","atr"]
    });
  }

  if(fields.parentFirstFailureAt&& !fields.parentFirstReentryAt){
    findings.push({
      rule:"D9",
      status:"SEMANTIC_CONTRADICTION",
      child:"parentFirstFailureAt",
      parents:["parentFirstReentryAt"],
      reason:"FAILURE_MUST_NEST_WITHIN_REENTRY_SEMANTICS"
    });
  }

  if(fields.compoundLifecycleState&&fields.completeClockBasis===true){
    findings.push({
      rule:"D8",
      status:"DERIVED_REPRESENTATION",
      child:"compoundLifecycleState",
      parents:["completeClockBasis","currentLocation"]
    });
  }

  return {
    status:findings.some(x=>x.status==="SEMANTIC_CONTRADICTION")?"QA_FAIL":"VALID",
    findings,
    independentVoteEligibleFields:[],
    formalCoreImpact:"NONE"
  };
}

export function minimalBasisAdmission(fieldName){
  const derived=new Set([
    "parentCenter","availableAirToParentLowerPct","distanceLocalToParentCenterPct",
    "availableAirToParentLowerATR","geometryRelationState","eligibleBarsSinceBreak",
    "barsToReentry","barsToFailure","barsToReclaim","compoundLifecycleState","falseBreakoutState"
  ]);
  if(derived.has(fieldName))
    return {fieldName,role:"DERIVED_VIEW",independentVoteEligible:false};
  return {fieldName,role:"CANDIDATE_PRIMITIVE_OR_CONTEXT",independentVoteEligible:false};
}
