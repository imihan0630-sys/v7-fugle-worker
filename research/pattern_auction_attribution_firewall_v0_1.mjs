// D01 DL-062 auction attribution firewall v0.1
// Research-only / outcome-blind. D05-06 remains canonical auction owner.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

const PHASES=new Set([
  "PRE_OPEN","OPEN_TRIAL","OPEN_CALL","CONTINUOUS_SESSION",
  "CLOSE_CALL_ACCUMULATION","CLOSE_TRIAL","CLOSE_DELAYED","CLOSE_FINAL",
  "POST_CLOSE","PHASE_UNKNOWN"
]);

export function zoneSide({price,lower,upper}={}){
  if(!finite(price)||!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",side:null};
  if(price>upper) return {status:"VALID",side:"ABOVE"};
  if(price<lower) return {status:"VALID",side:"BELOW"};
  return {status:"VALID",side:"INSIDE"};
}

export function classifyAuctionReceipt({
  receipt,
  predictorFreezeAt,
  historical=false
}={}){
  const freeze=str(predictorFreezeAt);

  if(!receipt){
    return historical
      ?{state:"HISTORICAL_AUCTION_STATE_UNKNOWN",baselineEligible:false}
      :{state:"AUCTION_STATE_UNKNOWN",baselineEligible:false};
  }

  if(receipt.replaySafe!==true)
    return {state:"AUCTION_DATA_BLOCKED",baselineEligible:false,reason:"REPLAY_UNSAFE"};

  const phase=str(receipt.phase)||"PHASE_UNKNOWN";
  if(!PHASES.has(phase))
    return {state:"AUCTION_DATA_BLOCKED",baselineEligible:false,reason:"PHASE_INVALID"};

  const knownAt=str(receipt.knownAt||receipt.firstObservedAt);
  if(!knownAt||!freeze)
    return {state:"AUCTION_DATA_BLOCKED",baselineEligible:false,reason:"CLOCK_INCOMPLETE"};

  if(knownAt>freeze)
    return {state:"POST_OPPORTUNITY_AUCTION_CONTEXT",baselineEligible:false,phase};

  return {
    state:"AUCTION_CONTEXT_AVAILABLE",
    baselineEligible:true,
    phase,
    hasNativeImbalance:receipt.nativeImbalanceObserved===true,
    hasTrialPrice:finite(receipt.trialPrice),
    delayedClose:receipt.delayedClose===true
  };
}

export function validateHistoricalAuctionInference({
  historical,
  nativeTrialReceipt,
  inferTrialFromFinalClose,
  inferImbalanceFromFinalVolume,
  inferImbalanceFromEodVolume
}={}){
  if(inferTrialFromFinalClose===true)
    return {status:"PROHIBITED",reason:"FINAL_CLOSE_CANNOT_BACKFILL_TRIAL"};
  if(inferImbalanceFromFinalVolume===true)
    return {status:"PROHIBITED",reason:"FINAL_AUCTION_VOLUME_IS_NOT_IMBALANCE"};
  if(inferImbalanceFromEodVolume===true)
    return {status:"PROHIBITED",reason:"EOD_VOLUME_IS_NOT_AUCTION_IMBALANCE"};
  if(historical===true&&nativeTrialReceipt!==true)
    return {status:"HISTORICAL_PRE_CLOSE_IMBALANCE_UNKNOWN"};
  return {status:"VALID"};
}

export function classifyCloseStructuralTransition({
  boundary,
  lastContinuousPrice,
  finalAuctionPrice,
  intendedSide,
  structureConfirmedAt,
  predictorFreezeAt,
  finalMatchAt,
  confirmationSource,
  continuousContextKnown=true
}={}){
  if(!finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {state:"CLOSE_STATE_UNKNOWN",reason:"BOUNDARY_INVALID"};

  const freeze=str(predictorFreezeAt);
  const confirmAt=str(structureConfirmedAt);
  const finalAt=str(finalMatchAt);

  if(!freeze||!confirmAt||!finalAt)
    return {state:"CLOSE_STATE_UNKNOWN",reason:"CLOCK_INCOMPLETE"};

  if(confirmAt>freeze || confirmAt>=finalAt || confirmationSource==="CLOSE_FINAL"){
    return {
      state:"AUCTION_CREATED_OR_CONFIRMED_STRUCTURE",
      preAuctionPredictorEligible:false,
      samePrintLoopProhibited:true
    };
  }

  if(continuousContextKnown!==true || !finite(lastContinuousPrice) || !finite(finalAuctionPrice))
    return {state:"CLOSE_STATE_UNKNOWN",reason:"CONTINUOUS_OR_FINAL_PRICE_MISSING"};

  const pre=zoneSide({price:lastContinuousPrice,...boundary});
  const fin=zoneSide({price:finalAuctionPrice,...boundary});
  if(pre.status!=="VALID"||fin.status!=="VALID")
    return {state:"CLOSE_STATE_UNKNOWN",reason:"ZONE_SIDE_UNKNOWN"};

  if(!["ABOVE","BELOW"].includes(intendedSide))
    return {state:"CLOSE_STATE_UNKNOWN",reason:"INTENDED_SIDE_INVALID"};

  if(pre.side===intendedSide&&fin.side===intendedSide)
    return {
      state:"CONTINUOUS_HOLD_BEFORE_AUCTION",
      preSide:pre.side,finalSide:fin.side,preAuctionPredictorEligible:true
    };

  if(pre.side!==intendedSide&&fin.side===intendedSide)
    return {
      state:"AUCTION_MOVED_INTO_HOLD",
      preSide:pre.side,finalSide:fin.side,preAuctionPredictorEligible:true
    };

  if(pre.side===intendedSide&&fin.side!==intendedSide)
    return {
      state:"AUCTION_MOVED_OUT_OF_HOLD",
      preSide:pre.side,finalSide:fin.side,preAuctionPredictorEligible:true
    };

  return {
    state:"CONTINUOUS_AND_AUCTION_NOT_ON_INTENDED_SIDE",
    preSide:pre.side,finalSide:fin.side,preAuctionPredictorEligible:true
  };
}

export function classifyOpeningContext({
  priorZone,
  openingPrice,
  priorClose,
  trialObserved,
  delayedOrConstrained,
  contextKnown
}={}){
  if(contextKnown!==true)
    return {state:"OPEN_CONTEXT_UNKNOWN"};

  if(delayedOrConstrained===true)
    return {state:"OPEN_DELAYED_OR_CONSTRAINED"};

  if(!finite(priorZone?.lower)||!finite(priorZone?.upper)||!finite(openingPrice))
    return {state:"OPEN_CONTEXT_UNKNOWN"};

  if(trialObserved===true)
    return {state:"OPEN_TRIAL_APPROACH"};

  const open=zoneSide({price:openingPrice,...priorZone});
  const prev=finite(priorClose)?zoneSide({price:priorClose,...priorZone}):{status:"UNKNOWN",side:null};

  if(open.side==="INSIDE")
    return {state:"OPEN_CALL_GAP_INTO_ZONE"};

  if(prev.status==="VALID"&&prev.side!==open.side&&open.side!=="INSIDE")
    return {state:"OPEN_CALL_GAP_THROUGH_ZONE"};

  return {state:"OPEN_AUCTION_HOLD_OR_REJECTION"};
}

export function buildAuctionAttributionFrame({
  parentDecisionId,
  auctionReceiptState,
  closeStructuralState,
  passiveReplicationContext,
  rawRepresentationCount=1
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_DECISION_ID_MISSING"};

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    auctionState:auctionReceiptState?.state??"UNKNOWN",
    closeStructuralState:closeStructuralState?.state??"UNKNOWN",
    passiveReplicationContext:passiveReplicationContext??"UNKNOWN",
    informationRoot:"PRICE_ORDERFLOW_SESSION",
    redundancyGroup:"D01_D05_CLOSE_SESSION_SHARED_PARENT",
    rawRepresentationCount,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    outcomeJoinAllowed:false
  };
}
