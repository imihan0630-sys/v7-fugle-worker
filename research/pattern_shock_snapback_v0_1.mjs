// D01 DL-052 shock snapback / price-discovery firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function classifyShockContext({
  predictorFreezeAt,
  structuralOpportunityAt,
  volatilityShock,
  liquidityShock
}={}){
  const freeze=str(predictorFreezeAt);
  const opp=str(structuralOpportunityAt);
  if(!freeze||!opp||freeze>opp)
    return {status:"UNKNOWN",reason:"OPPORTUNITY_CLOCK_INVALID"};

  const knownBefore=(r)=>{
    if(!r||r.present!==true) return false;
    const start=str(r.startedAt), known=str(r.knownAt);
    return !!start&&!!known&&start<=freeze&&known<=freeze;
  };
  const future=(r)=>{
    if(!r||r.present!==true) return false;
    const start=str(r.startedAt), known=str(r.knownAt);
    return (!!start&&start>freeze)||(!!known&&known>freeze);
  };

  const v=knownBefore(volatilityShock);
  const l=knownBefore(liquidityShock);

  if(future(volatilityShock)||future(liquidityShock))
    return {status:"SHOCK_BEGINS_AFTER_OPPORTUNITY",baselineEligible:false};

  if(v&&l) return {status:"PREEXISTING_MIXED_SHOCK",baselineEligible:true};
  if(v) return {status:"PREEXISTING_VOLATILITY_SHOCK",baselineEligible:true};
  if(l) return {status:"PREEXISTING_LIQUIDITY_SHOCK",baselineEligible:true};

  const vKnown=volatilityShock?.complete===true;
  const lKnown=liquidityShock?.complete===true;
  if(vKnown&&lKnown) return {status:"NO_PREEXISTING_SHOCK_CONTEXT",baselineEligible:true};

  return {status:"SHOCK_CONTEXT_UNKNOWN",baselineEligible:false};
}

export function buildPreShockReference({
  referenceType,
  price,
  knownAt,
  predictorFreezeAt,
  structuralBoundary
}={}){
  const type=str(referenceType);
  const freeze=str(predictorFreezeAt);
  if(!["MIDQUOTE","TRANSACTION_PROXY"].includes(type))
    return {status:"UNKNOWN",reason:"REFERENCE_TYPE_INVALID"};
  if(!finite(price)||!str(knownAt)||!freeze||str(knownAt)>freeze)
    return {status:"UNKNOWN",reason:"REFERENCE_NOT_AVAILABLE_AT_FREEZE"};
  const lower=structuralBoundary?.lower, upper=structuralBoundary?.upper;
  if(!finite(lower)||!finite(upper)||upper<lower)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  const distance=price>upper?price-upper:price<lower?price-lower:0;
  return {
    status:"VALID",
    referenceType:type,
    price,
    distanceToStructure:distance,
    insideStructure:distance===0,
    noiseSeparationState:type==="MIDQUOTE"?"MIDQUOTE_REFERENCE":"REFERENCE_NOISE_SEPARATION_INCOMPLETE"
  };
}

export function classifyReceiptTiming({
  receiptAt,
  predictorFreezeAt,
  structuralOpportunityAt
}={}){
  const t=str(receiptAt), freeze=str(predictorFreezeAt), opp=str(structuralOpportunityAt);
  if(!t||!freeze||!opp) return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE"};
  if(t<=freeze) return {status:"PRE_OPPORTUNITY_CONTEXT",baselineEligible:true};
  if(t>freeze&&t<=opp) return {status:"PRE_TOUCH_POST_FREEZE_CONTEXT",baselineEligible:false};
  return {status:"POST_OPPORTUNITY_MECHANISM_OR_OUTCOME",baselineEligible:false};
}

export function buildRecoveryClockSeparation({
  liquidityRecoveryAt,
  priceRecoveryAt,
  priceDiscoveryCompletionAt,
  predictorFreezeAt
}={}){
  const freeze=str(predictorFreezeAt);
  const clocks={
    liquidityRecoveryAt:str(liquidityRecoveryAt)||null,
    priceRecoveryAt:str(priceRecoveryAt)||null,
    priceDiscoveryCompletionAt:str(priceDiscoveryCompletionAt)||null
  };
  const anyPre=Object.values(clocks).filter(Boolean).some(x=>freeze&&x<=freeze);
  return {
    status:anyPre?"TIMING_CONFLICT":"VALID",
    ...clocks,
    liquidityRecoveryEqualsPriceRecovery:
      !!clocks.liquidityRecoveryAt&&clocks.liquidityRecoveryAt===clocks.priceRecoveryAt,
    clocksKeptSeparate:true,
    baselineEligible:false
  };
}

export function buildShockSnapbackDiagnostics({
  shockContext,
  referenceReceipt,
  midquoteAvailable,
  recoveryClocks
}={}){
  return {
    status:"VALID_DIAGNOSTIC",
    shockContextState:shockContext?.status||"SHOCK_CONTEXT_UNKNOWN",
    preShockReferenceState:referenceReceipt?.status||"UNKNOWN",
    noiseSeparationState:
      midquoteAvailable===true
        ?"MIDQUOTE_AVAILABLE"
        :"SNAPBACK_NOISE_SEPARATION_INCOMPLETE",
    recoveryClocksSeparate:recoveryClocks?.clocksKeptSeparate===true,
    immediateSnapbackEqualsStructuralRejection:false,
    effectiveIndependentEvidenceCount:1,
    residualIncrementalityStatus:"NOT_VALIDATED",
    outcomeJoinAllowed:false
  };
}
