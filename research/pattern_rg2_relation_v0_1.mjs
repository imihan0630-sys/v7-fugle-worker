// PATTERN-RG2 nested-resistance relation calculator v0.1
// Class A research-only / outcome-blind / no Formal dependency.

function finite(x){ return typeof x === "number" && Number.isFinite(x); }
function leq(a,b){ return typeof a === "string" && typeof b === "string" && a <= b; }

function coordsEqual(a,b){
  return a.lower === b.lower && a.upper === b.upper;
}

export function classifyRg2Relation({
  asOf,
  local,
  parent,
  currentClose = null,
  atr = null,
  previousParent = null
} = {}) {
  const missing=[];
  for(const [side,obj,keys] of [
    ["local",local,["boundaryId","boundaryVersion","lower","upper","confirmedAt","semanticSpaceId"]],
    ["parent",parent,["zoneId","zoneVersion","lower","upper","confirmedAt","semanticSpaceId","lifecycleState"]]
  ]){
    if(!obj){ missing.push(side); continue; }
    for(const k of keys) if(obj[k]===undefined || obj[k]===null || obj[k]==="") missing.push(`${side}.${k}`);
  }
  if(!asOf) missing.push("asOf");
  if(missing.length) return blocked("PROVENANCE_INCOMPLETE",{missing});

  if(!finite(local.lower)||!finite(local.upper)||!finite(parent.lower)||!finite(parent.upper)||
     !(local.lower<=local.upper)||!(parent.lower<=parent.upper)){
    return blocked("INVALID_BOUNDARY_GEOMETRY");
  }

  if(!leq(local.confirmedAt,asOf) || !leq(parent.confirmedAt,asOf)){
    return blocked("FUTURE_CONFIRMATION");
  }
  if(local.firstBreakAt && !leq(local.firstBreakAt,asOf)){
    return blocked("FUTURE_LOCAL_BREAK");
  }
  if(local.semanticSpaceId !== parent.semanticSpaceId){
    return blocked("SEMANTIC_SPACE_CONFLICT");
  }

  if(previousParent &&
     previousParent.zoneId===parent.zoneId &&
     previousParent.zoneVersion===parent.zoneVersion &&
     !coordsEqual(previousParent,parent)){
    return blocked("PROVENANCE_CONFLICT_SAME_VERSION_MUTATED");
  }

  let geometryState="UNKNOWN";
  if(local.upper < parent.lower) geometryState="LOCAL_BELOW_PARENT_POSITIVE_AIR";
  else if(local.lower <= parent.upper && local.upper >= parent.lower) geometryState="LOCAL_BOUNDARY_OVERLAPS_PARENT_ZONE";
  else if(local.lower > parent.upper) geometryState="LOCAL_BOUNDARY_ABOVE_PARENT_ZONE";

  const parentCenter = finite(parent.center) ? parent.center : (parent.lower+parent.upper)/2;
  const denom = local.upper;
  const availableAirToParentLowerPct = denom!==0 ? (parent.lower-local.upper)/denom : null;
  const distanceLocalToParentCenterPct = denom!==0 ? (parentCenter-local.upper)/denom : null;
  const availableAirToParentLowerATR = finite(atr) && atr>0 ? (parent.lower-local.upper)/atr : null;

  let compoundState="UNKNOWN";
  if(!local.firstBreakAt){
    compoundState="LOCAL_NOT_BROKEN";
  } else {
    switch(parent.lifecycleState){
      case "FIRST_BREAK_ABOVE_MAJOR_ZONE":
        compoundState="LOCAL_BREAK_AND_PARENT_FIRST_BREAK"; break;
      case "HOLDING_ABOVE_MAJOR_ZONE":
        compoundState="LOCAL_BREAK_PARENT_HOLDING_ABOVE"; break;
      case "REENTERED_MAJOR_ZONE":
        compoundState="LOCAL_BREAK_PARENT_REENTERED"; break;
      case "FAILED_MAJOR_ZONE_BREAK":
        compoundState="LOCAL_BREAK_PARENT_FAILED"; break;
      default:
        if(finite(currentClose)){
          if(currentClose < parent.lower) compoundState="LOCAL_BREAK_STILL_BELOW_PARENT";
          else if(currentClose <= parent.upper) compoundState="LOCAL_BREAK_ENTERED_PARENT_ZONE";
          else compoundState="PARENT_ABOVE_GEOMETRY_LIFECYCLE_UNRESOLVED";
        }
    }
  }

  return {
    status:"VALID",
    geometryState,
    compoundState,
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

function blocked(reason,extra={}){
  return {
    status:"DATA_BLOCKED",
    reason,
    geometryState:"UNKNOWN",
    compoundState:"UNKNOWN",
    availableAirToParentLowerPct:null,
    distanceLocalToParentCenterPct:null,
    availableAirToParentLowerATR:null,
    hardResistanceVeto:false,
    directionalSign:"UNSIGNED",
    predictiveIncrementality:"UNKNOWN",
    formalCoreImpact:"NONE",
    ...extra
  };
}
