// D01 DL-053 book-refill / queue-replenishment firewall v0.1
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function classifyBookRefillTiming({
  predictorFreezeAt,
  structuralOpportunityAt,
  preShockBookAt,
  depletedBookAt,
  refillMeasuredAt
}={}){
  const freeze=str(predictorFreezeAt), opp=str(structuralOpportunityAt);
  if(!freeze||!opp||freeze>opp) return {status:"UNKNOWN",reason:"CLOCK_INVALID"};
  const pre=str(preShockBookAt), dep=str(depletedBookAt), refill=str(refillMeasuredAt);
  if(pre&&pre>freeze) return {status:"UNKNOWN",reason:"PRE_SHOCK_BOOK_NOT_KNOWN_AT_FREEZE"};
  if(dep&&dep>freeze) return {status:"DEPLETION_POST_FREEZE",baselineEligible:false};
  if(refill&&refill>freeze) return {status:"REFILL_POST_FREEZE",baselineEligible:false};
  return {status:"PRE_FREEZE_CONTEXT_ONLY",baselineEligible:true};
}

export function buildRefillDescriptor({
  preShockDepth,
  depletedDepth,
  refillDepth,
  refillPrice,
  zone,
  quoteFresh,
  cancellationState,
  executionState
}={}){
  if(!finite(preShockDepth)||preShockDepth<0||
     !finite(depletedDepth)||depletedDepth<0||
     !finite(refillDepth)||refillDepth<0)
    return {status:"UNKNOWN",reason:"DEPTH_INVALID"};

  if(quoteFresh!==true)
    return {status:"DATA_BLOCKED",reason:"QUOTE_NOT_FRESH"};

  if(!finite(refillPrice)||!finite(zone?.lower)||!finite(zone?.upper)||zone.upper<zone.lower)
    return {status:"UNKNOWN",reason:"PRICE_OR_ZONE_INVALID"};

  return {
    status:"VALID",
    refillFractionOfPreShockDepth:preShockDepth>0?refillDepth/preShockDepth:null,
    recoveredFromDepletedBy:refillDepth-depletedDepth,
    refillInsideStructuralZone:refillPrice>=zone.lower&&refillPrice<=zone.upper,
    cancellationState:str(cancellationState)||"UNKNOWN",
    executionAtRefillPriceState:str(executionState)||"UNKNOWN",
    displayedDepthIsLatentLiquidity:false,
    refillEqualsStructuralDefense:false,
    independentVoteAllowed:false
  };
}

export function classifyRefillMechanism({
  descriptor,
  stableDisplayed,
  executionObserved,
  matchedGenericRefillAvailable
}={}){
  if(descriptor?.status!=="VALID") return {status:"NOT_EVALUABLE"};
  if(matchedGenericRefillAvailable!==true) return {status:"GENERIC_CONTROL_MISSING"};
  if(stableDisplayed===false)
    return {status:"REFILL_VISIBLE_FLEETING_CONTEXT",structuralClaimAllowed:false};
  if(executionObserved===true)
    return {status:"REFILL_EXECUTION_INTERACTION_OBSERVED",structuralClaimAllowed:false};
  return {status:"REFILL_VISIBLE_STABLE_CONTEXT",structuralClaimAllowed:false};
}

export function buildBookInformationLineage(){
  return {
    informationRoots:["PRICE_OHLC","LIVE_ORDER_BOOK"],
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED",
    outcomeJoinAllowed:false
  };
}
