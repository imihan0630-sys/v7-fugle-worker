// D01 DL-055 queue / latency / hidden-liquidity firewall v0.1
// Research-only / outcome-blind / D05-owner semantics.

function str(x){return String(x??"");}

export function classifyQueueEvidence({
  exactOrderSequence,
  ownOrderLifecycle,
  queueAheadProxyVerified,
  publicTop5Only
}={}){
  if(exactOrderSequence===true&&ownOrderLifecycle===true){
    return {
      state:"EXACT_QUEUE_POSITION_KNOWN",
      exactQueuePositionKnown:true,
      directionalAlphaAllowed:false
    };
  }
  if(queueAheadProxyVerified===true){
    return {
      state:"QUEUE_AHEAD_PROXY_ONLY",
      exactQueuePositionKnown:false,
      directionalAlphaAllowed:false
    };
  }
  if(publicTop5Only===true){
    return {
      state:"QUEUE_POSITION_UNKNOWN",
      exactQueuePositionKnown:false,
      reason:"PUBLIC_TOP5_NO_ORDER_IDENTITY",
      directionalAlphaAllowed:false
    };
  }
  return {
    state:"QUEUE_POSITION_UNKNOWN",
    exactQueuePositionKnown:false,
    reason:"QUEUE_EVIDENCE_INSUFFICIENT",
    directionalAlphaAllowed:false
  };
}

export function classifyLatencyState({
  realOrderSubmitted,
  decisionTimestamp,
  orderSubmitTimestamp,
  exchangeAckTimestamp
}={}){
  if(realOrderSubmitted!==true){
    return {state:"NO_OWN_ORDER_LIFECYCLE",exactLatencyKnown:false};
  }
  if(!str(decisionTimestamp)||!str(orderSubmitTimestamp)){
    return {state:"SUBMIT_LATENCY_PARTIAL",exactLatencyKnown:false};
  }
  if(!str(exchangeAckTimestamp)){
    return {state:"ACK_LATENCY_UNKNOWN",exactLatencyKnown:false};
  }
  if(str(orderSubmitTimestamp)<str(decisionTimestamp)||
     str(exchangeAckTimestamp)<str(orderSubmitTimestamp)){
    return {state:"UNKNOWN",reason:"LATENCY_CLOCK_INVALID",exactLatencyKnown:false};
  }
  return {
    state:"LATENCY_KNOWN",
    exactLatencyKnown:true,
    decisionTimestamp:str(decisionTimestamp),
    orderSubmitTimestamp:str(orderSubmitTimestamp),
    exchangeAckTimestamp:str(exchangeAckTimestamp)
  };
}

export function classifyHiddenLiquidity({
  ownerConfirmed,
  ownerReceiptVerified,
  candidateEvidence,
  displayedOnlyObserved,
  eventClockValid
}={}){
  if(ownerConfirmed===true){
    if(ownerReceiptVerified!==true||eventClockValid!==true){
      return {
        state:"HIDDEN_LIQUIDITY_UNKNOWN",
        reason:"OWNER_CONFIRMATION_RECEIPT_INVALID"
      };
    }
    return {state:"OWNER_CONFIRMED_HIDDEN_LIQUIDITY"};
  }

  if(candidateEvidence===true){
    if(eventClockValid!==true){
      return {
        state:"HIDDEN_LIQUIDITY_UNKNOWN",
        reason:"EVENT_CLOCK_INADEQUATE_FOR_CANDIDATE"
      };
    }
    return {state:"HIDDEN_LIQUIDITY_CANDIDATE"};
  }

  if(displayedOnlyObserved===true){
    return {state:"DISPLAYED_ONLY_OBSERVED"};
  }

  return {state:"HIDDEN_LIQUIDITY_UNKNOWN",reason:"NO_IDENTIFYING_EVIDENCE"};
}

export function classifyExecutionTiming({
  predictorFreezeAt,
  knownAt,
  replaySafe
}={}){
  const freeze=str(predictorFreezeAt);
  const known=str(knownAt);

  if(replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};

  if(!freeze||!known)
    return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};

  if(known>freeze)
    return {status:"POST_TREATMENT",baselineEligible:false};

  return {status:"BASELINE_AVAILABLE",baselineEligible:true};
}

export function hypotheticalFillGuard({
  realOrderSubmitted,
  touchedLimit,
  fillReceiptVerified
}={}){
  if(fillReceiptVerified===true&&realOrderSubmitted===true){
    return {status:"REAL_FILL_VERIFIED",fillClaimAllowed:true};
  }

  if(touchedLimit===true&&realOrderSubmitted!==true){
    return {
      status:"HYPOTHETICAL_TOUCH_NOT_FILL",
      fillClaimAllowed:false
    };
  }

  if(realOrderSubmitted===true&&fillReceiptVerified!==true){
    return {
      status:"OWN_ORDER_FILL_UNKNOWN",
      fillClaimAllowed:false
    };
  }

  return {status:"NO_FILL_EVIDENCE",fillClaimAllowed:false};
}

export function buildExecutionComparator({
  nearFrozenZone,
  contextMatched,
  d05ReceiptVerified
}={}){
  if(d05ReceiptVerified!==true)
    return {status:"UNKNOWN",reason:"D05_RECEIPT_UNVERIFIED"};

  if(contextMatched!==true)
    return {status:"UNKNOWN",reason:"COMPARATOR_CONTEXT_UNMATCHED"};

  return nearFrozenZone===true
    ?{status:"G1_ZONE_ASSOCIATED_EXECUTION_ADVANTAGE",independentVote:false}
    :{status:"G0_GENERIC_EXECUTION_ADVANTAGE",independentVote:false};
}

export function informationLineage({
  parentDecisionId,
  receipts=[]
}={}){
  if(!str(parentDecisionId))
    return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    rawReceiptCount:Array.isArray(receipts)?receipts.length:0,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
