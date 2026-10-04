// D01 DL-033 displacement / excursion path firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}

export function signedDistanceToZone({close,lower,upper}={}){
  if(!finite(close)||!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_OR_CLOSE_INVALID"};
  if(close>upper) return {status:"VALID",location:"ABOVE_ZONE",signedDistancePrice:close-upper};
  if(close<lower) return {status:"VALID",location:"BELOW_ZONE",signedDistancePrice:close-lower};
  return {status:"VALID",location:"INSIDE_ZONE",signedDistancePrice:0};
}

export function buildPathSummary({
  boundary,
  bars=[],
  currentAtr,
  currentReferencePrice,
  semanticSpaceVerified,
  pathComplete
}={}){
  if(semanticSpaceVerified!==true)
    return {status:"DATA_BLOCKED",reason:"SEMANTIC_SPACE_INVALID"};
  if(pathComplete!==true)
    return {status:"DATA_BLOCKED",reason:"PATH_SUMMARY_DATA_BLOCKED"};
  if(!finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};
  if(!bars.length)
    return {status:"UNKNOWN",reason:"PATH_EMPTY"};

  let maxAbs=0,maxAbove=0,maxBelow=0,cumulative=0;
  let prev=null;
  for(const b of bars){
    if(!finite(b?.close)) return {status:"DATA_BLOCKED",reason:"PATH_CLOSE_MISSING"};
    const d=signedDistanceToZone({close:b.close,lower:boundary.lower,upper:boundary.upper});
    const sd=d.signedDistancePrice;
    maxAbs=Math.max(maxAbs,Math.abs(sd));
    maxAbove=Math.max(maxAbove,sd>0?sd:0);
    maxBelow=Math.max(maxBelow,sd<0?Math.abs(sd):0);
    if(prev!==null) cumulative+=Math.abs(b.close-prev);
    prev=b.close;
  }

  const last=bars[bars.length-1].close;
  const current=signedDistanceToZone({close:last,lower:boundary.lower,upper:boundary.upper});
  const excursionSide=maxAbove>maxBelow?"ABOVE":maxBelow>maxAbove?"BELOW":"BALANCED_OR_NONE";

  return {
    status:"VALID",
    currentLocation:current.location,
    signedDistancePrice:current.signedDistancePrice,
    absoluteDistancePrice:Math.abs(current.signedDistancePrice),
    currentDistanceAtr:positive(currentAtr)?Math.abs(current.signedDistancePrice)/currentAtr:null,
    currentDistancePct:positive(currentReferencePrice)?Math.abs(current.signedDistancePrice)/currentReferencePrice:null,
    maxAbsExcursionPrice:maxAbs,
    maxAbsExcursionAtr:positive(currentAtr)?maxAbs/currentAtr:null,
    maxAboveExcursionPrice:maxAbove,
    maxBelowExcursionPrice:maxBelow,
    cumulativeAbsPathPrice:cumulative,
    cumulativeAbsPathAtr:positive(currentAtr)?cumulative/currentAtr:null,
    excursionSide,
    thresholdedFarStateDefined:false,
    outcomeJoinAllowed:false
  };
}

export function classifyPathComparability({
  ageOverlap,
  currentDistanceOverlap,
  excursionOverlap,
  interactionRecencyOverlap,
  interactionHistoryOverlap,
  scaleRegimeOverlap
}={}){
  const checks={
    ageOverlap,
    currentDistanceOverlap,
    excursionOverlap,
    interactionRecencyOverlap,
    interactionHistoryOverlap,
    scaleRegimeOverlap
  };
  if(Object.values(checks).some(v=>v===false))
    return {status:"EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}
