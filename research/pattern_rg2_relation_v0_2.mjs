// PATTERN-RG2 nested-resistance relation calculator v0.2
// Class A research-only / outcome-blind / canonical shared-child field names.

function finite(x){ return typeof x==="number" && Number.isFinite(x); }
function leq(a,b){ return typeof a==="string" && typeof b==="string" && a<=b; }

function blocked(reason,extra={}){
  return {
    status:"DATA_BLOCKED",
    reason,
    geometryRelationState:"UNKNOWN",
    compoundLifecycleState:"UNKNOWN",
    availableAirToParentLowerPct:null,
    distanceLocalToParentCenterPct:null,
    availableAirToParentLowerATR:null,
    predictiveIncrementality:"UNKNOWN",
    formalCoreImpact:"NONE",
    ...extra
  };
}

export function classifyRg2RelationV2({
  asOf,
  relationDefinitionVersion="RG2_V0_2",
  local,
  parent,
  currentClose=null,
  atr=null,
  previousParent=null
}={}) {
  const missing=[];
  for(const [side,obj,keys] of [
    ["local",local,["boundaryId","boundaryVersion","lower","upper","confirmedAt","semanticSpaceId","family"]],
    ["parent",parent,[
      "zoneId","zoneVersion","lower","upper","confirmedAt","semanticSpaceId","lifecycleState",
      "sourceWindowStart","sourceWindowEnd","zoneAgeEligibleSessions"
    ]]
  ]){
    if(!obj){ missing.push(side); continue; }
    for(const k of keys) if(obj[k]===undefined||obj[k]===null||obj[k]==="") missing.push(`${side}.${k}`);
  }
  if(!asOf) missing.push("asOf");
  if(missing.length) return blocked("PROVENANCE_INCOMPLETE",{missing});

  if(!finite(local.lower)||!finite(local.upper)||!finite(parent.lower)||!finite(parent.upper)||
     !(local.lower<=local.upper)||!(parent.lower<=parent.upper)) return blocked("INVALID_BOUNDARY_GEOMETRY");

  if(!Number.isInteger(parent.zoneAgeEligibleSessions)||parent.zoneAgeEligibleSessions<0)
    return blocked("INVALID_PARENT_ZONE_AGE");

  if(!leq(local.confirmedAt,asOf)||!leq(parent.confirmedAt,asOf)) return blocked("FUTURE_CONFIRMATION");
  if(local.firstBreakAt && !leq(local.firstBreakAt,asOf)) return blocked("FUTURE_LOCAL_BREAK");
  if(local.semanticSpaceId!==parent.semanticSpaceId) return blocked("SEMANTIC_SPACE_CONFLICT");

  if(previousParent &&
     previousParent.zoneId===parent.zoneId &&
     previousParent.zoneVersion===parent.zoneVersion &&
     (previousParent.lower!==parent.lower || previousParent.upper!==parent.upper)) {
    return blocked("PROVENANCE_CONFLICT_SAME_VERSION_MUTATED");
  }

  let geometryRelationState="UNKNOWN";
  if(local.upper<parent.lower) geometryRelationState="LOCAL_BELOW_PARENT_POSITIVE_AIR";
  else if(local.lower<=parent.upper && local.upper>=parent.lower) geometryRelationState="LOCAL_BOUNDARY_OVERLAPS_PARENT_ZONE";
  else if(local.lower>parent.upper) geometryRelationState="LOCAL_BOUNDARY_ABOVE_PARENT_ZONE";

  const parentCenter=finite(parent.center)?parent.center:(parent.lower+parent.upper)/2;
  const denom=local.upper;
  const availableAirToParentLowerPct=denom!==0?(parent.lower-local.upper)/denom:null;
  const distanceLocalToParentCenterPct=denom!==0?(parentCenter-local.upper)/denom:null;
  const availableAirToParentLowerATR=finite(atr)&&atr>0?(parent.lower-local.upper)/atr:null;

  let compoundLifecycleState="UNKNOWN";
  if(!local.firstBreakAt) compoundLifecycleState="LOCAL_NOT_BROKEN";
  else {
    switch(parent.lifecycleState){
      case "FIRST_BREAK_ABOVE_MAJOR_ZONE":
        compoundLifecycleState="LOCAL_BREAK_AND_PARENT_FIRST_BREAK"; break;
      case "HOLDING_ABOVE_MAJOR_ZONE":
        compoundLifecycleState="LOCAL_BREAK_PARENT_HOLDING_ABOVE"; break;
      case "REENTERED_MAJOR_ZONE":
        compoundLifecycleState="LOCAL_BREAK_PARENT_REENTERED"; break;
      case "FAILED_MAJOR_ZONE_BREAK":
        compoundLifecycleState="LOCAL_BREAK_PARENT_FAILED"; break;
      default:
        if(finite(currentClose)){
          if(currentClose<parent.lower) compoundLifecycleState="LOCAL_BREAK_STILL_BELOW_PARENT";
          else if(currentClose<=parent.upper) compoundLifecycleState="LOCAL_BREAK_ENTERED_PARENT_ZONE";
          else compoundLifecycleState="PARENT_ABOVE_GEOMETRY_LIFECYCLE_UNRESOLVED";
        }
    }
  }

  return {
    status:"VALID",
    relationDefinitionVersion,
    localBoundaryId:local.boundaryId,
    localBoundaryVersion:local.boundaryVersion,
    localLower:local.lower,
    localUpper:local.upper,
    localConfirmedAt:local.confirmedAt,
    localFamily:local.family,
    localFirstBreakAt:local.firstBreakAt??null,
    parentZoneId:parent.zoneId,
    parentZoneVersion:parent.zoneVersion,
    parentLower:parent.lower,
    parentUpper:parent.upper,
    parentCenter,
    parentConfirmedAt:parent.confirmedAt,
    parentScale:parent.scale??"MAJOR",
    parentSourceWindowStart:parent.sourceWindowStart,
    parentSourceWindowEnd:parent.sourceWindowEnd,
    parentZoneAgeEligibleSessions:parent.zoneAgeEligibleSessions,
    geometryRelationState,
    compoundLifecycleState,
    availableAirToParentLowerPct,
    distanceLocalToParentCenterPct,
    availableAirToParentLowerATR,
    hardResistanceVeto:false,
    directionalSign:"UNSIGNED",
    predictiveIncrementality:"UNKNOWN_REQUIRES_PROSPECTIVE_OUTCOME_TEST",
    hypothesisFamily:"PATTERN_RG2_NESTED_RESISTANCE",
    formalCoreImpact:"NONE"
  };
}
