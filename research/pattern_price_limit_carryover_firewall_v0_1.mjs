// D01 DL-064 price-limit carryover / queue firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function validateLimitReference({
  openingAuctionReferencePrice,
  upperLimitPrice,
  lowerLimitPrice,
  ruleReceiptVerified,
  tickReceiptVerified,
  exemptionState
}={}){
  if(exemptionState==="PRICE_LIMIT_EXEMPT_OR_NOT_APPLICABLE")
    return {status:"EXEMPT",limitApplicable:false};

  if(ruleReceiptVerified!==true||tickReceiptVerified!==true)
    return {status:"DATA_BLOCKED",reason:"LIMIT_RULE_OR_TICK_RECEIPT_MISSING"};

  if(!finite(openingAuctionReferencePrice)||!finite(upperLimitPrice)||!finite(lowerLimitPrice)||
     upperLimitPrice<openingAuctionReferencePrice||lowerLimitPrice>openingAuctionReferencePrice)
    return {status:"UNKNOWN",reason:"LIMIT_REFERENCE_INVALID"};

  return {
    status:"VALID",
    limitApplicable:true,
    openingAuctionReferencePrice,
    upperLimitPrice,
    lowerLimitPrice
  };
}

export function classifyLimitState({
  exempt,
  dataBlocked,
  proximityOnly,
  hit,
  closeAtLimit,
  queueKnown,
  queueVolume,
  unlockRelock
}={}){
  if(exempt===true) return {state:"PRICE_LIMIT_EXEMPT_OR_NOT_APPLICABLE"};
  if(dataBlocked===true) return {state:"LIMIT_STATE_DATA_BLOCKED"};

  if(unlockRelock===true)
    return {state:"UNLOCK_RELOCK",lockedQueueProven:false};

  if(closeAtLimit===true&&hit===true){
    if(queueKnown===true)
      return {
        state:"CLOSE_AT_LIMIT_WITH_VERIFIED_QUEUE",
        visibleLimitQueueVolume:finite(queueVolume)?queueVolume:null,
        lockedQueueProven:false
      };
    return {state:"CLOSE_AT_LIMIT_QUEUE_UNKNOWN",lockedQueueProven:false};
  }

  if(hit===true){
    if(queueKnown===true)
      return {
        state:"LIMIT_HIT_WITH_VERIFIED_QUEUE",
        visibleLimitQueueVolume:finite(queueVolume)?queueVolume:null,
        lockedQueueProven:false
      };
    return {state:"LIMIT_HIT_QUEUE_UNKNOWN",lockedQueueProven:false};
  }

  if(proximityOnly===true) return {state:"LIMIT_PROXIMITY_ONLY"};
  return {state:"NO_LIMIT_PROXIMITY_RECEIPT"};
}

export function classifyQueueCarryover({
  dayTQueueKnown,
  dayTQueueVolume,
  dayTOrderValidityEnd,
  dayT1QueueKnown,
  dayT1QueueVolume,
  latentPressureHypothesis
}={}){
  return {
    dayTPhysicalQueue:{
      known:dayTQueueKnown===true,
      volume:dayTQueueKnown===true&&finite(dayTQueueVolume)?dayTQueueVolume:null,
      expiresAt:str(dayTOrderValidityEnd)||null
    },
    latentCarryover:{
      status:latentPressureHypothesis===true
        ?"LATENT_UNMET_DEMAND_OR_SUPPLY_CARRYOVER_CANDIDATE"
        :"NOT_ASSERTED"
    },
    dayT1ResubmittedOrders:{
      known:dayT1QueueKnown===true,
      volume:dayT1QueueKnown===true&&finite(dayT1QueueVolume)?dayT1QueueVolume:null,
      identity:"NEXT_SESSION_RESUBMITTED_ORDERS"
    },
    samePhysicalQueuePersistsOvernight:false,
    copiedQueueVolumeAcrossSessions:false
  };
}

export function classifyStructureLimitColocation({
  zoneLower,zoneUpper,limitPrice
}={}){
  if(!finite(zoneLower)||!finite(zoneUpper)||!finite(limitPrice)||zoneUpper<zoneLower)
    return {status:"UNKNOWN"};
  const overlap=limitPrice>=zoneLower&&limitPrice<=zoneUpper;
  return {
    status:overlap?"STRUCTURE_PRICE_LIMIT_COLOCATION":"NO_STRUCTURE_LIMIT_COLOCATION",
    independentConfluenceVote:false,
    effectiveIndependentEvidenceCount:1
  };
}

export function validateLimitQueueReceipt({
  firstObservableAt,
  knownAt,
  predictorFreezeAt,
  replaySafe,
  queueVolume
}={}){
  const first=str(firstObservableAt),known=str(knownAt),freeze=str(predictorFreezeAt);
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!first||!known||!freeze) return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(first>freeze||known>freeze) return {status:"POST_FREEZE_NOT_ELIGIBLE"};
  if(!finite(queueVolume)||queueVolume<0) return {status:"UNKNOWN",reason:"QUEUE_VOLUME_INVALID"};
  return {status:"VALID",queueVolume};
}

export function classifyLimitComparator({atStructuralZone,limitContextVerified,nextDay}={}){
  if(limitContextVerified!==true)
    return {status:"UNKNOWN",reason:"LIMIT_CONTEXT_UNVERIFIED"};
  if(nextDay===true)
    return {
      status:atStructuralZone===true
        ?"N1_PRIOR_DAY_LIMIT_EVENT_AT_ZONE"
        :"N0_PRIOR_DAY_LIMIT_EVENT_AWAY_FROM_ZONE"
    };
  return {
    status:atStructuralZone===true
      ?"G1_LIMIT_EVENT_AT_STRUCTURAL_ZONE"
      :"G0_LIMIT_EVENT_AWAY_FROM_STRUCTURAL_ZONE"
  };
}

export function buildPriceLineage({
  priceRepresentations=0,
  queueReceiptPresent=false
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    priceRepresentations,
    queueMicrostructureContext:queueReceiptPresent===true,
    queueContextIsAutomaticIndependentVote:false,
    effectiveIndependentEvidenceCount:1
  };
}
