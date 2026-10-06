// D01 DL-050 ordinary oscillation vs discrete repricing v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function bool(x){return x===true;}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyEventClock({eventReceipt,transitionAt}={}){
  if(!eventReceipt) return {status:"NO_EVENT_RECEIPT",eligible:false};
  if(eventReceipt.replaySafe!==true) return {status:"EVENT_CLOCK_UNKNOWN",eligible:false};
  const knownAt=str(eventReceipt.knownAt||eventReceipt.releaseAt);
  const t=str(transitionAt);
  if(!knownAt||!t) return {status:"EVENT_CLOCK_UNKNOWN",eligible:false};
  if(knownAt>t) return {status:"EVENT_POST_HOC_NOT_ELIGIBLE",eligible:false};
  return {
    status:"EVENT_CLOCK_ELIGIBLE",
    eligible:true,
    causalClaimAllowed:false
  };
}

export function continuousCrossEligibility({
  priorPrice,
  laterPrice,
  boundary,
  matchingMechanism,
  exactTradeSequenceReceipt,
  continuityReceipt
}={}){
  if(!finite(priorPrice)||!finite(laterPrice)||!finite(boundary?.lower)||!finite(boundary?.upper))
    return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};

  const geometricSideChange =
    (priorPrice<boundary.lower&&laterPrice>boundary.upper)||
    (priorPrice>boundary.upper&&laterPrice<boundary.lower);

  if(!geometricSideChange)
    return {status:"NO_FULL_SIDE_CHANGE",geometricSideChange:false,continuousExecutedCross:false};

  if(continuityReceipt?.verified!==true)
    return {status:"DATA_BLOCKED",reason:"CONTINUITY_UNVERIFIED",geometricSideChange:true,continuousExecutedCross:false};

  if(str(matchingMechanism)!=="CONTINUOUS")
    return {status:"DISCRETE_OR_NONCONTINUOUS_CROSS",geometricSideChange:true,continuousExecutedCross:false};

  if(exactTradeSequenceReceipt?.replaySafe!==true||
     exactTradeSequenceReceipt?.orderedCrossVerified!==true)
    return {status:"CONTINUOUS_CROSS_UNVERIFIED",geometricSideChange:true,continuousExecutedCross:false};

  return {status:"CONTINUOUS_TRADE_THROUGH",geometricSideChange:true,continuousExecutedCross:true};
}

export function classifyDiscreteRepricingMechanism({
  sessionReceipt,
  priceLimitReceipt,
  volatilityInterruptionReceipt,
  haltReceipt,
  eventReceipt,
  microstructureReceipt,
  continuityReceipt,
  transitionAt
}={}){
  if(continuityReceipt?.verified!==true)
    return {
      status:"MECHANISM_NOT_EVALUABLE",
      reason:"TECHNICAL_CONTINUITY_UNVERIFIED",
      mechanismFlags:[],
      effectiveIndependentEvidenceCount:1
    };

  if(sessionReceipt?.verified!==true)
    return {
      status:"MECHANISM_NOT_EVALUABLE",
      reason:"SESSION_MECHANISM_UNKNOWN",
      mechanismFlags:[],
      effectiveIndependentEvidenceCount:1
    };

  const flags=[];
  const matching=str(sessionReceipt.matchingMechanism);

  if(matching==="CALL_AUCTION") flags.push("AUCTION_CLEARING_REPRICE");
  if(bool(priceLimitReceipt?.constrained)) flags.push("PRICE_LIMIT_CONSTRAINED_PATH");
  if(bool(volatilityInterruptionReceipt?.active)||bool(volatilityInterruptionReceipt?.restartAuction))
    flags.push("VOLATILITY_INTERRUPTION_REPRICE");

  const eventClock=classifyEventClock({eventReceipt,transitionAt});
  if(eventClock.status==="EVENT_CLOCK_ELIGIBLE")
    flags.push("EVENT_COINCIDENT_DISCRETE_REPRICE");

  let microState="MICROSTRUCTURE_RECEIPT_UNAVAILABLE";
  if(microstructureReceipt?.blocked===true){
    microState="MICROSTRUCTURE_RECEIPT_BLOCKED";
  }else if(microstructureReceipt?.replaySafe===true){
    microState="MICROSTRUCTURE_RECEIPT_AVAILABLE";
    if(microstructureReceipt?.ownerBounceCandidate===true)
      flags.push("MICROSTRUCTURE_BOUNCE_CANDIDATE");
  }

  if(bool(haltReceipt?.ambiguous)||bool(haltReceipt?.resumptionUnknown))
    return {
      status:"MECHANISM_NOT_EVALUABLE",
      reason:"HALT_RESUMPTION_AMBIGUOUS",
      mechanismFlags:[...new Set(flags)],
      eventClockState:eventClock.status,
      microstructureReceiptState:microState,
      effectiveIndependentEvidenceCount:1
    };

  const unique=[...new Set(flags)];
  if(unique.length>1){
    return {
      status:"MIXED_MECHANISM",
      mechanismFlags:unique,
      eventClockState:eventClock.status,
      eventCausalClaimAllowed:false,
      microstructureReceiptState:microState,
      effectiveIndependentEvidenceCount:1,
      independentVoteAllowed:false
    };
  }

  if(unique.length===1){
    return {
      status:unique[0],
      mechanismFlags:unique,
      eventClockState:eventClock.status,
      eventCausalClaimAllowed:false,
      microstructureReceiptState:microState,
      effectiveIndependentEvidenceCount:1,
      independentVoteAllowed:false
    };
  }

  if(matching==="CONTINUOUS" &&
     priceLimitReceipt?.constrained!==true &&
     volatilityInterruptionReceipt?.active!==true &&
     volatilityInterruptionReceipt?.restartAuction!==true){
    return {
      status:"UNCONSTRAINED_CONTINUOUS_OSCILLATION_CANDIDATE",
      mechanismFlags:[],
      eventClockState:eventClock.status,
      eventCausalClaimAllowed:false,
      microstructureReceiptState:microState,
      effectiveIndependentEvidenceCount:1,
      independentVoteAllowed:false
    };
  }

  return {
    status:"MECHANISM_NOT_EVALUABLE",
    reason:"MECHANISM_STATE_UNRESOLVED",
    mechanismFlags:[],
    eventClockState:eventClock.status,
    microstructureReceiptState:microState,
    effectiveIndependentEvidenceCount:1
  };
}

export function buildMechanismLineageDiagnostics({
  priceDerivedRepresentations=[],
  quoteTradePrimitivePresent
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    rawPriceRepresentationCount:(priceDerivedRepresentations||[]).length,
    quoteTradePrimitivePresent:quoteTradePrimitivePresent===true,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
