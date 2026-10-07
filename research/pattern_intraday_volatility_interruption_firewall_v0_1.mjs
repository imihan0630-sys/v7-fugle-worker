// D01 DL-067 intraday volatility interruption firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function classifyReferenceRegime({
  phase,
  openingPriceAvailable,
  recentContinuousTradesAvailable,
  postInterruptionCallPriceAvailable
}={}){
  if(phase==="OPENING_0900_0905"){
    return {
      state:"OPENING_REFERENCE_PHASE",
      source:openingPriceAvailable===true?"OPENING_CALL_PRICE":"OPENING_AUCTION_REFERENCE"
    };
  }
  if(phase==="POST_INTERRUPTION_FIRST_5M"){
    return {
      state:"POST_INTERRUPTION_RESET_REFERENCE",
      source:postInterruptionCallPriceAvailable===true?"INTERRUPTION_CALL_PRICE":"MOST_RECENT_TRADE"
    };
  }
  if(phase==="AFTER_0905"){
    return {
      state:"ROLLING_FIVE_MINUTE_REFERENCE",
      source:recentContinuousTradesAvailable===true?"FIVE_MINUTE_WEIGHTED_AVERAGE":"MOST_RECENT_OR_OPENING_REFERENCE"
    };
  }
  return {state:"REFERENCE_REGIME_UNKNOWN",source:null};
}

export function classifyInterruptionTrigger({
  potentialExecutionPrice,
  referencePrice,
  triggerBandPct=3.5
}={}){
  if(!finite(potentialExecutionPrice)||!finite(referencePrice)||referencePrice<=0||
     !finite(triggerBandPct)||triggerBandPct<=0)
    return {status:"UNKNOWN",reason:"TRIGGER_INPUT_INVALID"};

  const deviationPct=((potentialExecutionPrice-referencePrice)/referencePrice)*100;
  const triggered=Math.abs(deviationPct)>triggerBandPct;

  return {
    status:triggered?"INTERRUPTION_TRIGGER_CANDIDATE":"NO_INTERRUPTION_TRIGGER",
    deviationPct,
    triggerBandPct,
    potentialExecutionPrice,
    executedPrice:false
  };
}

export function classifyInterruptionPhase({
  triggered,
  delayActive,
  callAuctionActive,
  callPrintObserved,
  postResetWindow,
  continuousTradingResumed
}={}){
  if(triggered!==true)
    return {state:"NORMAL_CONTINUOUS_TRADING"};
  if(delayActive===true)
    return {state:"MATCHING_POSTPONED",priceAcceptance:false};
  if(callAuctionActive===true&&callPrintObserved!==true)
    return {state:"RESTART_CALL_AUCTION",executedPrice:false};
  if(callPrintObserved===true)
    return {state:"RESTART_CALL_PRINT",confirmedBreakout:false};
  if(postResetWindow===true)
    return {state:"POST_INTERRUPTION_REFERENCE_RESET_WINDOW"};
  if(continuousTradingResumed===true)
    return {state:"RETURN_TO_ROLLING_CONTINUOUS_REFERENCE"};
  return {state:"INTERRUPTION_TRIGGER_CANDIDATE"};
}

export function classifyInterruptionOrderSet({
  marketOrder,
  ioc,
  fok,
  limitRod,
  preExistingMarketOrder
}={}){
  return {
    newMarketOrderAccepted:marketOrder===true?false:null,
    newIocAccepted:ioc===true?false:null,
    newFokAccepted:fok===true?false:null,
    newLimitRodAccepted:limitRod===true?true:null,
    preExistingMarketOrderDeleted:preExistingMarketOrder===true?true:null,
    preTriggerQueuePersistsUnchanged:false
  };
}

export function classifyZoneRelation({price,boundary}={}){
  if(!finite(price)||!finite(boundary?.lower)||!finite(boundary?.upper)||boundary.upper<boundary.lower)
    return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};
  if(price<boundary.lower) return {status:"VALID",side:"BELOW"};
  if(price>boundary.upper) return {status:"VALID",side:"ABOVE"};
  return {status:"VALID",side:"INSIDE"};
}

export function classifyInterruptionCross({
  triggerPotentialExecutionPrice,
  restartCallPrice,
  firstContinuousPrice,
  boundary
}={}){
  const trigger=classifyZoneRelation({price:triggerPotentialExecutionPrice,boundary});
  const restart=classifyZoneRelation({price:restartCallPrice,boundary});
  const cont=classifyZoneRelation({price:firstContinuousPrice,boundary});

  return {
    triggerPotentialZoneRelation:trigger.status==="VALID"?trigger.side:null,
    restartCallZoneRelation:restart.status==="VALID"?restart.side:null,
    postContinuousZoneRelation:cont.status==="VALID"?cont.side:null,
    triggerPotentialIsExecutedBreakout:false,
    restartCallIsConfirmedBreakout:false,
    continuousPathInvented:false
  };
}

export function validateInterruptionReceipt({
  firstObservableAt,
  knownAt,
  triggerAt,
  restartAuctionAt,
  firstCallPrintAt,
  predictorFreezeAt,
  referenceRegimeKnownAt,
  replaySafe
}={}){
  const first=str(firstObservableAt),known=str(knownAt),trigger=str(triggerAt),
    restart=str(restartAuctionAt),print=str(firstCallPrintAt),freeze=str(predictorFreezeAt),
    refKnown=str(referenceRegimeKnownAt);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!first||!known||!trigger||!freeze||!refKnown)
    return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(first>freeze||known>freeze||refKnown>freeze)
    return {status:"POST_FREEZE_RECEIPT_NOT_ELIGIBLE"};
  if(restart&&restart<trigger)
    return {status:"UNKNOWN",reason:"RESTART_CLOCK_INVALID"};
  if(print&&restart&&print<restart)
    return {status:"UNKNOWN",reason:"CALL_PRINT_CLOCK_INVALID"};
  return {status:"VALID"};
}

export function classifyInterruptionComparator({
  interruptionTriggered,
  atStructuralZone,
  highVolatilityContextVerified
}={}){
  if(highVolatilityContextVerified!==true)
    return {status:"UNKNOWN",reason:"HIGH_VOLATILITY_CONTEXT_UNVERIFIED"};
  if(interruptionTriggered===true){
    return {
      status:atStructuralZone===true
        ?"H1_VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE"
        :"H0_VOLATILITY_INTERRUPTION_AWAY_FROM_STRUCTURAL_ZONE"
    };
  }
  return {
    status:atStructuralZone===true
      ?"G0_HIGH_VOLATILITY_MOVE_WITHOUT_INTERRUPTION_AT_STRUCTURAL_ZONE"
      :"G0_HIGH_VOLATILITY_MOVE_WITHOUT_INTERRUPTION_AWAY_FROM_ZONE"
  };
}

export function buildInterruptionLineage({
  priceRepresentations=0,
  orderBookReceiptPresent=false,
  auctionReceiptPresent=false
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    priceRepresentations,
    orderBookReceiptPresent:orderBookReceiptPresent===true,
    auctionReceiptPresent:auctionReceiptPresent===true,
    externalMicrostructureCreatesAutomaticVote:false,
    effectiveIndependentEvidenceCount:1
  };
}
