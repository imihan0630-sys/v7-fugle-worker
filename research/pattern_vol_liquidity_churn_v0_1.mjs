// D01 DL-051 volatility/liquidity vs structural churn v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function positive(x){return finite(x)&&x>0;}

function receiptOk(receipt, freezeAt, allowedOwners=[]){
  if(receipt?.verified!==true) return false;
  if(!str(receipt.asOf)||!str(freezeAt)||receipt.asOf>freezeAt) return false;
  if(allowedOwners.length && !allowedOwners.includes(str(receipt.owner))) return false;
  if(!str(receipt.sourceVersion)) return false;
  return true;
}

export function classifyVolLiquidityContext({
  zone,
  churnSummary,
  preEpisode,
  withinEpisode,
  sessionReceipt,
  predictorFreezeAt
}={}){
  const width=finite(zone?.upper)&&finite(zone?.lower)?zone.upper-zone.lower:NaN;
  if(!positive(width))
    return {status:"DATA_BLOCKED",reason:"ZONE_WIDTH_INVALID"};

  if(!receiptOk(preEpisode,predictorFreezeAt,["D04","D05","D04_D05"]))
    return {status:"DATA_BLOCKED",reason:"PRE_EPISODE_RECEIPT_INVALID"};

  if(withinEpisode && !receiptOk(withinEpisode,predictorFreezeAt,["D04","D05","D04_D05"]))
    return {status:"DATA_BLOCKED",reason:"WITHIN_EPISODE_RECEIPT_INVALID"};

  if(!receiptOk(sessionReceipt,predictorFreezeAt,["D04","D05","D04_D05"]))
    return {status:"DATA_BLOCKED",reason:"SESSION_RECEIPT_INVALID"};

  const quoteFresh=preEpisode.quoteFresh!==false && (!withinEpisode || withinEpisode.quoteFresh!==false);

  const vol=withinEpisode?.volatilityBurstState??preEpisode.volatilityBurstState??"UNKNOWN";
  const spread=withinEpisode?.spreadStressState??preEpisode.spreadStressState??"UNKNOWN";
  const depth=withinEpisode?.depthStressState??preEpisode.depthStressState??"UNKNOWN";
  const sessionEdge=sessionReceipt.sessionEdge===true;

  const volActive=vol==="ACTIVE";
  const spreadActive=spread==="ACTIVE";
  const depthActive=depth==="ACTIVE";
  const activeStress=[volActive,spreadActive,depthActive].filter(Boolean).length;

  let researchContextClass="L7_NOT_EVALUABLE";
  if(!quoteFresh){
    researchContextClass="L6_QUOTE_STALE_OR_INCOMPLETE";
  }else if(activeStress>=2){
    researchContextClass="L4_VOL_LIQ_MIXED_STRESS_CONTEXT";
  }else if(volActive){
    researchContextClass="L1_VOLATILITY_BURST_CONTEXT";
  }else if(spreadActive){
    researchContextClass="L2_SPREAD_STRESS_CONTEXT";
  }else if(depthActive){
    researchContextClass="L3_DEPTH_STRESS_CONTEXT";
  }else if(sessionEdge){
    researchContextClass="L5_SESSION_EDGE_CONTEXT";
  }else if([vol,spread,depth].every(x=>x==="INACTIVE")){
    researchContextClass="L0_BASELINE_MICROSTRUCTURE_CONTEXT";
  }

  const eligible=Number(churnSummary?.eligibleStateCount);
  const transitions=Number(churnSummary?.stateTransitionCount);
  const quotedSpread=withinEpisode?.quotedSpread??preEpisode.quotedSpread;
  const volScale=withinEpisode?.volatilityPriceScale??preEpisode.volatilityPriceScale;

  return {
    status:"VALID",
    researchContextClass,
    zoneWidth:width,
    stateTransitionCount:finite(transitions)?transitions:null,
    eligibleStateCount:finite(eligible)?eligible:null,
    transitionCountPerEligibleState:finite(transitions)&&positive(eligible)?transitions/eligible:null,
    quotedSpread:finite(quotedSpread)?quotedSpread:null,
    spreadToZoneWidth:finite(quotedSpread)?quotedSpread/width:null,
    volatilityPriceScale:finite(volScale)?volScale:null,
    volatilityToZoneWidth:finite(volScale)?volScale/width:null,
    volatilityBurstState:vol,
    spreadStressState:spread,
    depthStressState:depth,
    quoteStalenessState:quoteFresh?"FRESH":"STALE",
    sessionPosition:str(sessionReceipt.sessionPosition)||null,
    preEpisodeContextRole:"BASELINE_CONTEXT",
    withinEpisodeContextRole:withinEpisode?"MEDIATOR_OR_CONTEMPORANEOUS_MECHANISM":"NOT_PRESENT",
    microstructureStressScoreDefined:false,
    effectiveIndependentEvidenceCount:1,
    independentVoteAllowed:false,
    residualIncrementalityStatus:"NOT_VALIDATED",
    outcomeJoinAllowed:false
  };
}

export function classifyMicrostructureEstimand({adjustWithinEpisodeMicrostructure=false}={}){
  return adjustWithinEpisodeMicrostructure
    ?{
      estimand:"E1_WITHIN_EPISODE_MICROSTRUCTURE_CONDITIONAL",
      interpretation:"CONTEXT_CONDITIONAL_OR_MECHANISM_DECOMPOSITION",
      totalEffectClaimAllowed:false
    }
    :{
      estimand:"E0_PRE_EPISODE_ADJUSTED_CHURN_INCREMENT",
      interpretation:"PRE_EPISODE_CONTEXT_ADJUSTED",
      totalEffectClaimAllowed:true
    };
}

export function classifyCommonSupport({
  churnOverlap,
  volatilityOverlap,
  spreadOverlap,
  depthOverlap,
  sessionOverlap,
  mechanismOverlap,
  geometryOverlap
}={}){
  const checks={
    churnOverlap,
    volatilityOverlap,
    spreadOverlap,
    depthOverlap,
    sessionOverlap,
    mechanismOverlap,
    geometryOverlap
  };

  if(Object.values(checks).some(v=>v===false))
    return {status:"EXTRAPOLATION_PROHIBITED",checks};

  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};

  return {status:"COMMON_SUPPORT_VALID",checks};
}

export function quoteTradeComparison({
  tradePriceChurnAvailable,
  quoteMidChurnAvailable,
  quoteFresh
}={}){
  if(quoteFresh!==true)
    return {status:"NOT_EVALUABLE",reason:"QUOTE_STALE"};

  if(tradePriceChurnAvailable!==true||quoteMidChurnAvailable!==true)
    return {status:"NOT_EVALUABLE",reason:"TRADE_OR_MIDPOINT_PATH_MISSING"};

  return {
    status:"VALID",
    compareTradeVsMidpoint:true,
    bidAskBounceControlPossible:true,
    independentVoteAllowed:false
  };
}
