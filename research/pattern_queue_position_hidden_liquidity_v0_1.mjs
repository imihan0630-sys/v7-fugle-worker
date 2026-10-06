// D01 DL-055 queue-position / latency / hidden-liquidity firewall v0.1
function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyConservativeFill({
  lowTouchedLimit,
  tradesAtLimit,
  tradedVolumeAtLimit,
  queueAheadProxy,
  priceMovedThroughLimit,
  ownOrderFillVerified
}={}){
  if(ownOrderFillVerified===true)
    return {state:"OWN_ORDER_FILL_VERIFIED",verifiedFill:true};

  if(lowTouchedLimit!==true)
    return {state:"NOT_REACHED",verifiedFill:false};

  if(priceMovedThroughLimit===true&&
     finite(tradedVolumeAtLimit)&&tradedVolumeAtLimit>0){
    return {
      state:"TRADED_THROUGH_CONSERVATIVE_FILL_CANDIDATE",
      verifiedFill:false,
      conservativeOnly:true
    };
  }

  if(tradesAtLimit===true){
    return {
      state:"TRADED_AT_PRICE_QUEUE_UNRESOLVED",
      verifiedFill:false,
      queueAheadProxy:finite(queueAheadProxy)?queueAheadProxy:null
    };
  }

  return {state:"TOUCHED_NOT_ENOUGH_EVIDENCE",verifiedFill:false};
}

export function validateQueueProxy({
  sourceCoverageValid,
  capturedAt,
  predictorFreezeAt,
  exactOrderIdsAvailable,
  completePerOrderSequence
}={}){
  if(sourceCoverageValid!==true)
    return {status:"DATA_BLOCKED",reason:"QUEUE_SOURCE_COVERAGE_INVALID"};

  if(!capturedAt||!predictorFreezeAt||str(capturedAt)>str(predictorFreezeAt))
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"QUEUE_PROXY_NOT_KNOWN_AT_FREEZE"};

  const exact=exactOrderIdsAvailable===true&&completePerOrderSequence===true;
  return {
    status:"VALID",
    label:exact?"EXACT_QUEUE_STATE_POTENTIALLY_IDENTIFIABLE":"QUEUE_AHEAD_PROXY",
    exactQueueRankAllowed:exact
  };
}

export function validateLatencyContext({
  quoteCapturedAt,
  decisionAt,
  orderAt,
  quoteAgeKnown,
  latencyKnown
}={}){
  if(!quoteCapturedAt||!decisionAt)
    return {status:"UNKNOWN",reason:"LATENCY_CLOCK_INCOMPLETE"};

  if(str(quoteCapturedAt)>str(decisionAt))
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"QUOTE_AFTER_DECISION"};

  if(latencyKnown!==true||quoteAgeKnown!==true)
    return {status:"LATENCY_CONTEXT_UNKNOWN"};

  return {
    status:"VALID",
    observationToDecisionClockKnown:true,
    decisionToOrderClockKnown:!!orderAt
  };
}

export function classifyHiddenLiquidity({
  eventSequenceValid,
  publicDepthSufficient,
  executedVolumeExceedsDisplayed,
  repeatedReplenishmentAfterExecution,
  weakPriceProgressUnderAggressiveFlow,
  authoritativeHiddenOrderEvidence
}={}){
  if(authoritativeHiddenOrderEvidence===true)
    return {state:"OWNER_VERIFIED_HIDDEN_LIQUIDITY"};

  if(eventSequenceValid!==true)
    return {state:"NOT_IDENTIFIABLE"};

  if(publicDepthSufficient===true)
    return {state:"PUBLIC_DEPTH_SUFFICIENT"};

  const compatible=
    executedVolumeExceedsDisplayed===true&&
    repeatedReplenishmentAfterExecution===true&&
    weakPriceProgressUnderAggressiveFlow===true;

  return compatible
    ?{state:"HIDDEN_LIQUIDITY_COMPATIBLE",confirmedIceberg:false}
    :{state:"NOT_IDENTIFIABLE"};
}

export function validateTiming({
  predictorFreezeAt,
  firstExecutableAt,
  firstTradeAtLimitAt,
  conservativeFillKnownAt,
  hiddenLiquidityPatternKnownAt
}={}){
  if(!predictorFreezeAt)
    return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};

  const freeze=str(predictorFreezeAt);
  const fields={firstExecutableAt,firstTradeAtLimitAt,conservativeFillKnownAt,hiddenLiquidityPatternKnownAt};
  const roles={};
  for(const [k,v] of Object.entries(fields)){
    if(!v){roles[k]="UNKNOWN";continue;}
    roles[k]=str(v)>freeze?"POST_TREATMENT_EXECUTION":"KNOWN_BY_FREEZE";
  }
  return {status:"VALID",roles};
}

export function classifyExecutionMechanism({
  genericComparatorVerified,
  queueLatencyControlled,
  hiddenLiquidityControlled,
  structuralResidualValidated
}={}){
  if(genericComparatorVerified!==true)
    return {state:"NOT_EVALUABLE",reason:"GENERIC_EXECUTION_COMPARATOR_MISSING"};
  if(structuralResidualValidated===true)
    return {state:"STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE"};
  if(hiddenLiquidityControlled!==true)
    return {state:"HIDDEN_LIQUIDITY_NOT_SEPARATED"};
  if(queueLatencyControlled!==true)
    return {state:"QUEUE_OR_LATENCY_EXPLANATION"};
  return {state:"GENERIC_EXECUTION_MECHANICS_SUFFICIENT"};
}

export function evidenceIdentity({parentDecisionId,receiptCount}={}){
  if(!str(parentDecisionId)) return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};
  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    rawReceiptCount:finite(receiptCount)?receiptCount:0,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false
  };
}