// D01 DL-053 queue refill vs structural rejection v0.1
function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function validateRefillReceipt({d05EventClockValidity,sourceMode,replaySafe}={}){
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(d05EventClockValidity!=="VALID_FOR_REFILL_ESTIMAND")
    return {status:"REFILL_IDENTIFIABILITY_BLOCKED",reason:"D05_EVENT_CLOCK_INVALID"};
  if(sourceMode==="SPARSE_SNAPSHOT")
    return {status:"REFILL_IDENTIFIABILITY_BLOCKED",reason:"SPARSE_SNAPSHOT_NOT_TRUE_REFILL"};
  return {status:"VALID"};
}

export function classifyDepthPath({preexistingDepthKnown,preexistingDepthPresent,depletionObserved,refillObserved,refillReceiptValid}={}){
  if(preexistingDepthKnown!==true) return {state:"DEPTH_STATE_UNKNOWN"};
  if(refillObserved===true&&refillReceiptValid!==true) return {state:"REFILL_IDENTIFIABILITY_BLOCKED"};
  if(preexistingDepthPresent===true&&depletionObserved!==true) return {state:"PREEXISTING_DEPTH_SURVIVED"};
  if(depletionObserved===true&&refillObserved===true&&refillReceiptValid===true) return {state:"DEPTH_DEPLETED_THEN_REFILLED"};
  if(depletionObserved===true&&refillObserved!==true) return {state:"DEPTH_DEPLETED_NO_REFILL"};
  return {state:"DEPTH_STATE_UNKNOWN"};
}

export function validateTiming({predictorFreezeAt,depthObservedPreFreezeAt,refillFirstObservedAt,refillConfirmedAt,depthRecoveryAt,priceRecoveryAt}={}){
  const freeze=str(predictorFreezeAt);
  if(!freeze) return {status:"UNKNOWN",reason:"PREDICTOR_FREEZE_MISSING"};
  if(depthObservedPreFreezeAt&&str(depthObservedPreFreezeAt)>freeze)
    return {status:"PROHIBITED",reason:"PREEXISTING_DEPTH_OBSERVED_AFTER_FREEZE"};
  const postFields={refillFirstObservedAt,refillConfirmedAt,depthRecoveryAt,priceRecoveryAt};
  for(const [k,v] of Object.entries(postFields)){
    if(v&&str(v)<=freeze) return {status:"UNKNOWN",reason:k.toUpperCase()+"_CLOCK_NOT_POST_FREEZE"};
  }
  return {status:"VALID",postTreatmentFields:Object.entries(postFields).filter(([,v])=>!!v).map(([k])=>k)};
}

export function localizeRefill({refillPrice,lower,upper,atr}={}){
  if(!finite(refillPrice)||!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"PRICE_OR_BOUNDARY_INVALID"};
  const inside=refillPrice>=lower&&refillPrice<=upper;
  const distance=inside?0:(refillPrice<lower?lower-refillPrice:refillPrice-upper);
  return {
    status:"VALID",
    refillInsideZone:inside,
    refillDistanceToZone:distance,
    refillDistanceAtr:finite(atr)&&atr>0?distance/atr:null,
    structuralIdentityDecisionAllowed:false,
    mechanismDecisionAllowed:false
  };
}

export function classifyRefillMechanism({genericComparatorVerified,zoneAssociated,structuralResidualValidated,ownerReceiptValid}={}){
  if(ownerReceiptValid!==true) return {state:"MICROSTRUCTURE_NOT_IDENTIFIABLE"};
  if(genericComparatorVerified!==true) return {state:"NOT_EVALUABLE",reason:"GENERIC_REFILL_COMPARATOR_MISSING"};
  if(structuralResidualValidated===true) return {state:"STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE"};
  if(zoneAssociated===true) return {state:"ZONE_LOCALIZED_REFILL_ASSOCIATION"};
  return {state:"GENERIC_LIQUIDITY_REPLENISHMENT"};
}

export function buildEvidenceIdentity({parentDecisionId,hasGenuineMicrostructureReceipt}={}){
  if(!str(parentDecisionId)) return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};
  return {
    status:"VALID",
    parentDecisionId:str(parentDecisionId),
    informationRoot:hasGenuineMicrostructureReceipt===true?"PRICE_OHLC_PLUS_MICROSTRUCTURE_CONTEXT":"PRICE_OHLC",
    rawReceiptCount:hasGenuineMicrostructureReceipt===true?2:1,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false
  };
}