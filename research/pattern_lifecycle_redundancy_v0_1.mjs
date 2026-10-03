// D01 DL-019 lifecycle redundancy / reconstructability helper v0.1
// Research-only, outcome-blind, no runtime dependency.

function text(x){return typeof x==="string"?x.trim():"";}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function nilOrText(x){return x===null||x===undefined||text(x)!=="";}

export function classifyCurrentLocation({signedCloseDistanceFromBoundary,insideZone=false,failedBeyondFarSide=false}={}){
  if(!finite(signedCloseDistanceFromBoundary)) return "UNKNOWN";
  if(failedBeyondFarSide) return "FAILED_SIDE";
  if(insideZone) return "INSIDE_ZONE";
  if(signedCloseDistanceFromBoundary>0) return "OUTSIDE_FAVORABLE";
  if(signedCloseDistanceFromBoundary===0) return "ON_BOUNDARY";
  return "NONFAVORABLE_SIDE";
}

export function reconstructLifecycleFromCompleteBasis(input={}){
  const {
    firstConfirmedBreakAt=null,
    firstReentryAt=null,
    firstFailureAt=null,
    firstReclaimAt=null,
    constrainedPending=false,
    currentLocationClass="UNKNOWN"
  }=input;

  if(!nilOrText(firstConfirmedBreakAt)||!nilOrText(firstReentryAt)||!nilOrText(firstFailureAt)||!nilOrText(firstReclaimAt))
    return {status:"UNKNOWN",reason:"CLOCK_TYPE_INVALID"};

  if(!firstConfirmedBreakAt) return {status:"VALID",state:"NO_BREAK_EVENT"};

  if(constrainedPending===true)
    return {status:"VALID",state:"BREAK_OBSERVED_CONSTRAINED"};

  if(firstFailureAt && !firstReclaimAt)
    return {status:"VALID",state:"FAILED"};

  if(firstReentryAt && !firstReclaimAt)
    return {status:"VALID",state:"REENTERED_ZONE"};

  if(firstReclaimAt){
    if(currentLocationClass==="OUTSIDE_FAVORABLE")
      return {status:"VALID",state:"RECLAIMED"};
    if(currentLocationClass==="INSIDE_ZONE")
      return {status:"VALID",state:"REENTERED_ZONE"};
    if(currentLocationClass==="FAILED_SIDE")
      return {status:"VALID",state:"FAILED"};
    return {status:"UNKNOWN",reason:"RECLAIM_CLOCK_WITH_AMBIGUOUS_CURRENT_LOCATION"};
  }

  if(currentLocationClass==="OUTSIDE_FAVORABLE")
    return {status:"VALID",state:"HOLDING_OUTSIDE"};
  if(currentLocationClass==="INSIDE_ZONE")
    return {status:"VALID",state:"REENTERED_ZONE"};
  if(currentLocationClass==="FAILED_SIDE")
    return {status:"VALID",state:"FAILED"};

  return {status:"UNKNOWN",reason:"CURRENT_LOCATION_INCOMPLETE"};
}

function geometrySignature(x={}){
  return JSON.stringify({
    availableAirToParentLowerPct:x.availableAirToParentLowerPct??null,
    distanceLocalToParentCenterPct:x.distanceLocalToParentCenterPct??null,
    currentSignedCloseDistance:x.currentSignedCloseDistance??null,
    parentZoneAgeEligibleSessions:x.parentZoneAgeEligibleSessions??null,
    geometryRelationState:x.geometryRelationState??null
  });
}

function completePathSignature(x={}){
  return JSON.stringify({
    geometry:JSON.parse(geometrySignature(x)),
    eligibleBarsSinceBreak:x.eligibleBarsSinceBreak??null,
    observableBarsSinceBreak:x.observableBarsSinceBreak??null,
    constrainedBarsSinceBreak:x.constrainedBarsSinceBreak??null,
    maxFavorableExtension:x.maxFavorableExtension??null,
    maxAdverseExcursion:x.maxAdverseExcursion??null,
    cumulativeSignedDistance:x.cumulativeSignedDistance??null,
    localFirstBreakAt:x.localFirstBreakAt??null,
    firstParentZoneEntryAt:x.firstParentZoneEntryAt??null,
    parentFirstBreakAt:x.parentFirstBreakAt??null,
    parentFirstOrdinaryObservableAt:x.parentFirstOrdinaryObservableAt??null,
    parentFirstPostBreakOutsideCloseAt:x.parentFirstPostBreakOutsideCloseAt??null,
    parentFirstReentryAt:x.parentFirstReentryAt??null,
    parentFirstFailureAt:x.parentFirstFailureAt??null,
    parentFirstReclaimAt:x.parentFirstReclaimAt??null
  });
}

export function compareLifecycleRepresentations(a={},b={}){
  const sameGeometry=geometrySignature(a)===geometrySignature(b);
  const sameCompletePath=completePathSignature(a)===completePathSignature(b);
  const sameLifecycle=(a.compoundLifecycleState??null)===(b.compoundLifecycleState??null);

  let interpretation;
  if(sameCompletePath && !sameLifecycle)
    interpretation="SEMANTIC_CONTRADICTION_SAME_COMPLETE_PATH_DIFFERENT_CATEGORY";
  else if(sameGeometry && !sameLifecycle)
    interpretation="PATH_MEMORY_NOT_CAPTURED_BY_GEOMETRY_ONLY";
  else if(sameCompletePath && sameLifecycle)
    interpretation="CATEGORY_DETERMINISTIC_OR_REDUNDANT_GIVEN_COMPLETE_PATH";
  else
    interpretation="DISTINCT_PATH_REPRESENTATIONS";

  return {
    sameGeometry,
    sameCompletePath,
    sameLifecycle,
    interpretation,
    sourceNovelty:"NONE_SAME_PRICE_PATH_ROOT",
    predictiveIncrementality:"UNKNOWN"
  };
}

export function lifecycleRedundancyAssessment({
  hasGeometryBasis=false,
  hasContinuousPathBasis=false,
  hasCompleteClockBasis=false,
  categoricalLifecycleAvailable=false
}={}){
  if(!categoricalLifecycleAvailable)
    return {status:"NO_CATEGORY",highestBasis:"NONE",claim:"NOT_EVALUABLE"};
  if(hasCompleteClockBasis)
    return {
      status:"C2_COMPLETE",
      highestBasis:"C2_CLOCK_COMPLETE_PATH",
      claim:"CATEGORY_IS_COMPRESSED_REPRESENTATION_TEST_INCREMENTALITY_ONLY_VS_FLEXIBLE_C2"
    };
  if(hasContinuousPathBasis)
    return {
      status:"C1_ONLY",
      highestBasis:"C1_CONTINUOUS_PATH",
      claim:"CATEGORY_MAY_ENCODE_MISSING_FIRST_EVENT_CLOCK_MEMORY"
    };
  if(hasGeometryBasis)
    return {
      status:"C0_ONLY",
      highestBasis:"C0_GEOMETRY_ONLY",
      claim:"CATEGORY_CAN_CONTAIN_PATH_MEMORY_RELATIVE_TO_GEOMETRY_ONLY"
    };
  return {status:"NO_BASIS",highestBasis:"NONE",claim:"UNKNOWN"};
}
