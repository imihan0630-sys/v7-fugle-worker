// D01 DL-050 transition-mechanics firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function atOrBefore(a,b){return !!a&&!!b&&a<=b;}

function receiptAvailable(receipt, transitionAt, predictorFreezeAt){
  if(receipt?.verified!==true) return false;
  const asOf=str(receipt.asOf);
  const at=str(transitionAt);
  const freeze=str(predictorFreezeAt);
  if(!asOf||!at||!freeze) return false;
  if(asOf>freeze||at>freeze) return false;
  if(receipt.effectiveFrom&&at<receipt.effectiveFrom) return false;
  if(receipt.effectiveTo&&at>receipt.effectiveTo) return false;
  return true;
}

export function classifyMatchingMechanism({receipt,transitionAt,predictorFreezeAt}={}){
  if(!receiptAvailable(receipt,transitionAt,predictorFreezeAt))
    return {status:"DATA_BLOCKED",matchingMechanism:"UNKNOWN"};

  const kind=str(receipt.kind);
  const allowed=[
    "CONTINUOUS",
    "OPEN_CALL_AUCTION",
    "CLOSE_CALL_AUCTION",
    "VI_REOPEN_CALL_AUCTION",
    "OTHER_CALL_AUCTION"
  ];
  if(!allowed.includes(kind))
    return {status:"UNKNOWN",matchingMechanism:"UNKNOWN"};

  return {
    status:"VALID",
    matchingMechanism:kind,
    discreteRepricing:kind!=="CONTINUOUS"
  };
}

export function classifyPriceConstraint({receipt,transitionAt,predictorFreezeAt}={}){
  if(!receiptAvailable(receipt,transitionAt,predictorFreezeAt))
    return {status:"DATA_BLOCKED",priceConstraintState:"UNKNOWN"};

  const state=str(receipt.state);
  const allowed=[
    "UNCONSTRAINED",
    "DAILY_LIMIT_UP_CONSTRAINED",
    "DAILY_LIMIT_DOWN_CONSTRAINED",
    "SPECIAL_NO_LIMIT_REGIME"
  ];
  if(!allowed.includes(state))
    return {status:"UNKNOWN",priceConstraintState:"UNKNOWN"};

  return {status:"VALID",priceConstraintState:state};
}

export function classifyBounceState({
  bounceReceipt,
  transitionAt,
  predictorFreezeAt,
  ohlcOnly=false
}={}){
  if(ohlcOnly===true){
    return {
      status:"VALID",
      microstructureBounceState:"NOT_EVALUABLE",
      reason:"OHLC_CANNOT_CONFIRM_BID_ASK_BOUNCE"
    };
  }

  if(!bounceReceipt)
    return {status:"VALID",microstructureBounceState:"NOT_EVALUABLE"};

  if(!receiptAvailable(bounceReceipt,transitionAt,predictorFreezeAt))
    return {status:"DATA_BLOCKED",microstructureBounceState:"NOT_EVALUABLE"};

  if(bounceReceipt.exactOrderedTradeQuoteSequence!==true)
    return {status:"VALID",microstructureBounceState:"CANDIDATE_UNVERIFIED"};

  if(bounceReceipt.quoteConfirmedBounce===true)
    return {status:"VALID",microstructureBounceState:"QUOTE_CONFIRMED_BID_ASK_BOUNCE"};

  return {status:"VALID",microstructureBounceState:"EXACT_EVENT_NOT_BOUNCE"};
}

export function classifyEventContext({
  eventReceipt,
  transitionAt,
  predictorFreezeAt
}={}){
  if(!eventReceipt)
    return {status:"VALID",eventContextState:"EVENT_CONTEXT_UNKNOWN"};

  if(!receiptAvailable(eventReceipt,transitionAt,predictorFreezeAt))
    return {status:"DATA_BLOCKED",eventContextState:"EVENT_CONTEXT_UNKNOWN"};

  if(eventReceipt.eventPresent===true)
    return {status:"VALID",eventContextState:"VERIFIED_EVENT_CONTEXT",causationProven:false};

  if(eventReceipt.eventPresent===false)
    return {status:"VALID",eventContextState:"VERIFIED_NO_EVENT_CONTEXT",causationProven:false};

  return {status:"UNKNOWN",eventContextState:"EVENT_CONTEXT_UNKNOWN",causationProven:false};
}

export function discreteCrossingSemantics({
  startState,
  endState,
  matchingMechanism
}={}){
  const states=new Set(["BELOW","INSIDE","ABOVE"]);
  if(!states.has(startState)||!states.has(endState))
    return {status:"UNKNOWN",reason:"ZONE_STATE_INVALID"};

  const crossedZone=
    (startState==="BELOW"&&endState==="ABOVE")||
    (startState==="ABOVE"&&endState==="BELOW");

  const discrete=[
    "OPEN_CALL_AUCTION",
    "CLOSE_CALL_AUCTION",
    "VI_REOPEN_CALL_AUCTION",
    "OTHER_CALL_AUCTION"
  ].includes(matchingMechanism);

  return {
    status:"VALID",
    crossedZone,
    intermediatePathObserved:!discrete,
    continuousTraversalProven:discrete?false:null,
    exactCrossingCount:discrete?null:null
  };
}

export function buildTransitionContextVector({
  parentDecisionId,
  transitionAt,
  predictorFreezeAt,
  startState,
  endState,
  matchingReceipt,
  constraintReceipt,
  bounceReceipt,
  eventReceipt,
  ohlcOnly=false
}={}){
  const parent=str(parentDecisionId);
  if(!parent||!transitionAt||!predictorFreezeAt||transitionAt>predictorFreezeAt)
    return {status:"UNKNOWN",reason:"TRANSITION_CLOCK_INVALID"};

  const matching=classifyMatchingMechanism({receipt:matchingReceipt,transitionAt,predictorFreezeAt});
  const constraint=classifyPriceConstraint({receipt:constraintReceipt,transitionAt,predictorFreezeAt});
  const bounce=classifyBounceState({bounceReceipt,transitionAt,predictorFreezeAt,ohlcOnly});
  const event=classifyEventContext({eventReceipt,transitionAt,predictorFreezeAt});

  if([matching,constraint,bounce,event].some(x=>x.status==="DATA_BLOCKED")){
    return {
      status:"DATA_BLOCKED",
      reason:"MECHANISM_RECEIPT_BLOCKED",
      matchingMechanism:matching.matchingMechanism,
      priceConstraintState:constraint.priceConstraintState,
      microstructureBounceState:bounce.microstructureBounceState,
      eventContextState:event.eventContextState
    };
  }

  const crossing=discreteCrossingSemantics({
    startState,endState,matchingMechanism:matching.matchingMechanism
  });

  const axes={
    matchingMechanism:matching.matchingMechanism,
    priceConstraintState:constraint.priceConstraintState,
    microstructureBounceState:bounce.microstructureBounceState,
    eventContextState:event.eventContextState
  };

  const active=[];
  if(axes.matchingMechanism==="CONTINUOUS"&&axes.priceConstraintState==="UNCONSTRAINED")
    active.push("ORDINARY_CONTINUOUS");
  if(["OPEN_CALL_AUCTION","CLOSE_CALL_AUCTION","OTHER_CALL_AUCTION"].includes(axes.matchingMechanism))
    active.push("AUCTION_REPRICING");
  if(axes.matchingMechanism==="VI_REOPEN_CALL_AUCTION")
    active.push("VI_REOPEN_REPRICING");
  if(["DAILY_LIMIT_UP_CONSTRAINED","DAILY_LIMIT_DOWN_CONSTRAINED"].includes(axes.priceConstraintState))
    active.push("PRICE_LIMIT_CONSTRAINED");
  if(axes.microstructureBounceState==="QUOTE_CONFIRMED_BID_ASK_BOUNCE")
    active.push("QUOTE_CONFIRMED_BOUNCE");
  if(axes.eventContextState==="VERIFIED_EVENT_CONTEXT")
    active.push("VERIFIED_EVENT_CONTEXT");

  let researchClass="K7_NOT_EVALUABLE";
  if(active.length===1){
    researchClass={
      ORDINARY_CONTINUOUS:"K0_ORDINARY_CONTINUOUS_UNCONSTRAINED",
      AUCTION_REPRICING:"K1_OPEN_OR_CLOSE_AUCTION_REPRICING",
      VI_REOPEN_REPRICING:"K2_VI_REOPEN_REPRICING",
      PRICE_LIMIT_CONSTRAINED:"K3_PRICE_LIMIT_CONSTRAINED",
      QUOTE_CONFIRMED_BOUNCE:"K4_QUOTE_CONFIRMED_BID_ASK_BOUNCE",
      VERIFIED_EVENT_CONTEXT:"K5_VERIFIED_EVENT_CONTEXT"
    }[active[0]]||"K7_NOT_EVALUABLE";
  }else if(active.length>1){
    researchClass="K6_MIXED_MECHANISM";
  }

  return {
    status:"VALID",
    parentDecisionId:parent,
    transitionAt,
    predictorFreezeAt,
    startState,
    endState,
    ...axes,
    researchClass,
    activeMechanisms:active,
    crossedZone:crossing.crossedZone,
    intermediatePathObserved:crossing.intermediatePathObserved,
    eventCausationProven:false,
    informationRoots:[
      "PRICE_OHLC",
      ...(bounceReceipt?.exactOrderedTradeQuoteSequence===true?["TRADE_TIME","QUOTE_TIME"]:[]),
      ...(matchingReceipt?.verified===true?["VENUE_RULE"]:[])
    ],
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
