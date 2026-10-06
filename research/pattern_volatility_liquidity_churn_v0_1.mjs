// D01 DL-051 volatility/liquidity confound firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function ts(x){
  const v=Date.parse(String(x??""));
  return Number.isFinite(v)?v:null;
}
function str(x){return String(x??"");}

export function classifyContextTiming({
  churnWindowStartAt,
  churnWindowEndAt,
  predictorFreezeAt,
  preWindowReceipts=[],
  withinWindowReceipts=[]
}={}){
  const start=ts(churnWindowStartAt);
  const end=ts(churnWindowEndAt);
  const freeze=ts(predictorFreezeAt);

  if(start===null||end===null||freeze===null||end<start)
    return {status:"UNKNOWN",reason:"WINDOW_CLOCK_INVALID"};

  for(const r of preWindowReceipts||[]){
    const a=ts(r?.asOf);
    if(a===null||a>start||a>freeze)
      return {status:"DATA_BLOCKED",reason:"PRE_WINDOW_RECEIPT_NOT_CAUSAL"};
  }

  for(const r of withinWindowReceipts||[]){
    const a=ts(r?.asOf);
    if(a===null||a<start||a>end)
      return {status:"DATA_BLOCKED",reason:"WITHIN_WINDOW_RECEIPT_OUTSIDE_WINDOW"};
  }

  return {
    status:"VALID",
    preWindowRole:"BASELINE_CONTEXT",
    withinWindowRole:freeze<end
      ?"MECHANISM_OR_MEDIATOR_NOT_BASELINE"
      :"COMPLETED_HISTORICAL_STATE_FOR_LATER_DECISION",
    withinWindowMayBackfillEarlierPredictor:false
  };
}

export function normalizeChurnByOpportunity({
  transitionCount,
  sideFlipCount,
  crossingOpportunityReceipt
}={}){
  if(!finite(transitionCount)||transitionCount<0||
     !finite(sideFlipCount)||sideFlipCount<0)
    return {status:"UNKNOWN",reason:"CHURN_COUNT_INVALID"};

  if(crossingOpportunityReceipt?.valid!==true)
    return {status:"UNKNOWN",reason:"OPPORTUNITY_DENOMINATOR_UNVERIFIED"};

  const n=crossingOpportunityReceipt.count;
  if(!finite(n)||n<=0)
    return {status:"UNKNOWN",reason:"OPPORTUNITY_DENOMINATOR_NONPOSITIVE"};

  return {
    status:"VALID",
    opportunityCount:n,
    transitionCount,
    sideFlipCount,
    transitionsPerOpportunity:transitionCount/n,
    sideFlipsPerOpportunity:sideFlipCount/n,
    alphaScoreDefined:false
  };
}

export function classifyRvNoiseSeparation({
  midquoteRvReceipt,
  transactionRvReceipt
}={}){
  const midValid=midquoteRvReceipt?.valid===true&&midquoteRvReceipt?.replaySafe===true;
  const txValid=transactionRvReceipt?.valid===true&&transactionRvReceipt?.replaySafe===true;

  if(midValid&&txValid){
    return {
      status:"MIDQUOTE_PRIMARY_TRANSACTION_DIAGNOSTIC",
      primaryVolatilityPrimitive:"MIDQUOTE_RV",
      transactionRvRole:"MICROSTRUCTURE_NOISE_DIAGNOSTIC"
    };
  }

  if(midValid){
    return {
      status:"MIDQUOTE_PRIMARY",
      primaryVolatilityPrimitive:"MIDQUOTE_RV",
      transactionRvRole:"UNAVAILABLE"
    };
  }

  if(txValid){
    return {
      status:"VOLATILITY_NOISE_SEPARATION_INCOMPLETE",
      primaryVolatilityPrimitive:null,
      transactionRvRole:"NOISE_SENSITIVE_ONLY"
    };
  }

  return {status:"VOLATILITY_NOT_EVALUABLE",primaryVolatilityPrimitive:null};
}

export function classifyVolLiquidityChurnContext({
  preWindowVolatilityReceipt,
  preWindowClusterReceipt,
  realizedBurstReceipt,
  spreadReceipt,
  depthReceipt,
  freshnessReceipt,
  requiredReceiptsComplete
}={}){
  if(requiredReceiptsComplete!==true)
    return {status:"NOT_EVALUABLE",reason:"OWNER_RECEIPTS_INCOMPLETE",flags:[]};

  const freshState=str(freshnessReceipt?.state);
  if(["STALE","RECONNECT_CROSSED","MISSING","UNKNOWN"].includes(freshState)){
    return {
      status:"NOT_EVALUABLE",
      reason:"QUOTE_BOOK_FRESHNESS_INVALID",
      flags:["MICROSTRUCTURE_MISSINGNESS_SENSITIVE"]
    };
  }

  const flags=[];
  if(preWindowVolatilityReceipt?.ownerHighVolatility===true)
    flags.push("HIGH_VOLATILITY_CONTEXT");
  if(preWindowClusterReceipt?.ownerClusteredHigh===true)
    flags.push("VOLATILITY_CLUSTER_CONTEXT");
  if(realizedBurstReceipt?.ownerBurst===true)
    flags.push("REALIZED_VOLATILITY_BURST_CONTEXT");
  if(["SPREAD_WIDENING","SPREAD_STRESSED"].includes(str(spreadReceipt?.ownerState)))
    flags.push("SPREAD_DETERIORATION_CONTEXT");
  if(["DEPTH_THINNING","DEPTH_STRESSED"].includes(str(depthReceipt?.ownerState)))
    flags.push("DEPTH_DETERIORATION_CONTEXT");

  const volFlags=flags.filter(x=>x.includes("VOLATILITY"));
  const liqFlags=flags.filter(x=>x.includes("SPREAD")||x.includes("DEPTH"));

  let status="STRUCTURAL_CHURN_RESIDUAL_CANDIDATE";
  if(volFlags.length&&liqFlags.length) status="VOLATILITY_LIQUIDITY_STRESS_MIXED";
  else if(flags.includes("REALIZED_VOLATILITY_BURST_CONTEXT")) status="REALIZED_VOLATILITY_BURST_CONTEXT";
  else if(flags.includes("HIGH_VOLATILITY_CONTEXT")||flags.includes("VOLATILITY_CLUSTER_CONTEXT")) status="HIGH_VOLATILITY_CONTEXT";
  else if(flags.includes("SPREAD_DETERIORATION_CONTEXT")) status="SPREAD_DETERIORATION_CONTEXT";
  else if(flags.includes("DEPTH_DETERIORATION_CONTEXT")) status="DEPTH_DETERIORATION_CONTEXT";

  return {
    status,
    flags:[...new Set(flags)],
    causalDirectionIdentified:false,
    directionalVoteAllowed:false,
    residualStructuralClaimAllowed:false
  };
}

export function buildInformationLineage({
  pricePathRepresentations=[],
  spreadDepthOwnerPrimitivePresent
}={}){
  return {
    informationRoot:"PRICE_OHLC",
    rawPriceRepresentationCount:(pricePathRepresentations||[]).length,
    spreadDepthOwnerPrimitivePresent:spreadDepthOwnerPrimitivePresent===true,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}
