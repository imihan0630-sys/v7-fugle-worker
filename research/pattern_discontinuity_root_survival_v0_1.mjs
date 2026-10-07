// D01 DL-081 discontinuity root survival v0.1
export function classifyDiscontinuity({eventGap,priceLimitCatchup,suspensionResumption,corporateAction,liquidityGap,marketWide,symbolInfo}={}){
  const hits=[
    ["CORPORATE_ACTION_MECHANICAL_RESET",corporateAction],
    ["SUSPENSION_RESUMPTION_REPRICING",suspensionResumption],
    ["PRICE_LIMIT_CATCHUP",priceLimitCatchup],
    ["LIQUIDITY_GAP_CROSS",liquidityGap],
    ["MARKET_WIDE_GAP",marketWide],
    ["SYMBOL_SPECIFIC_INFORMATION_REPRICING",symbolInfo],
    ["EVENT_GAP",eventGap]
  ].filter(([,v])=>v===true);
  return {status:hits.length===1?hits[0][0]:hits.length>1?"MULTI_CAUSE_DISCONTINUITY":"UNKNOWN_DISCONTINUITY"};
}
export function preserveRootSurvivalDenominator(x={}){
  const keys=["eligibleRoots","survivedReacted","survivedNoRevisit","crossedNoReaction","mechanicallyRebased","temporarilyBlocked","invalidatedNewPriceDiscovery","dataBlocked"];
  if(keys.some(k=>!Number.isInteger(x[k])||x[k]<0))return {status:"UNKNOWN"};
  return {status:"FULL_PREEXISTING_ROOT_DENOMINATOR",eligibleRoots:x.eligibleRoots,breakResetsDenominator:false};
}
export function validateDiscontinuityClock({eventFirstObservableAt,predictorFreezeAt,replaySafe}={}){
  if(replaySafe!==true||!eventFirstObservableAt||!predictorFreezeAt)return {status:"UNKNOWN"};
  return {status:eventFirstObservableAt<=predictorFreezeAt?"EVENT_KNOWN_AT_FREEZE":"EVENT_NOT_KNOWN_AT_FREEZE"};
}
export function classifySurvivalMechanism({mechanicalReset,priceLimitDelayedDiscovery,liquidityArtifact,interveningPriceDiscoveryLarge}={}){
  if(mechanicalReset)return {status:"MECHANICAL_RESET_ONLY"};
  if(priceLimitDelayedDiscovery)return {status:"PRICE_LIMIT_DELAYED_DISCOVERY"};
  if(liquidityArtifact)return {status:"LIQUIDITY_GAP_ARTIFACT"};
  if(interveningPriceDiscoveryLarge)return {status:"INFORMATION_REPRICING_DOMINATES"};
  return {status:"ROOT_SURVIVAL_REQUIRES_VALIDATION"};
}
