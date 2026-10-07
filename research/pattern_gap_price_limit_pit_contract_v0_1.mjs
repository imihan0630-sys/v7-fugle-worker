// D01 DL-085 gap/price-limit PIT contract v0.1
export function classifyGap({corporateAction,suspension,priceLimitDelayed,liquidityGap,marketWide,symbolEvent,dataVendor}={}){
  const hits=[
    ["CORPORATE_ACTION_MECHANICAL_GAP",corporateAction],
    ["SUSPENSION_RESUMPTION_GAP",suspension],
    ["PRICE_LIMIT_DELAYED_DISCOVERY_GAP",priceLimitDelayed],
    ["LIQUIDITY_GAP",liquidityGap],
    ["MARKET_WIDE_GAP",marketWide],
    ["SYMBOL_EVENT_GAP",symbolEvent],
    ["DATA_OR_VENDOR_GAP",dataVendor]
  ].filter(([,v])=>v===true);
  return {status:hits.length===1?hits[0][0]:hits.length>1?"MULTI_CAUSE_GAP":"ORDINARY_OPENING_GAP"};
}
export function validateGapReceipt({priorEligibleClose,currentOpen,firstObservableAt,predictorFreezeAt,replaySafe}={}){
  if(!Number.isFinite(priorEligibleClose)||!Number.isFinite(currentOpen)||replaySafe!==true||!firstObservableAt||!predictorFreezeAt)return {status:"DATA_BLOCKED"};
  if(firstObservableAt>predictorFreezeAt)return {status:"GAP_NOT_KNOWN_AT_FREEZE"};
  return {status:"GAP_RECEIPT_VALID",rawGap:currentOpen-priorEligibleClose};
}
export function preserveGapDenominator(x={}){
  const keys=["eligibleGaps","filledSameSession","filledLater","neverFilled","censored","mechanicallyRebased","priceLimitConstrained","dataBlocked"];
  if(keys.some(k=>!Number.isInteger(x[k])||x[k]<0))return {status:"UNKNOWN"};
  return {status:"FULL_GAP_DENOMINATOR",eligibleGaps:x.eligibleGaps,neverFilledRetained:true};
}
export function validateFillDefinition({thresholdFrozen,toleranceFrozen,horizonFrozen,usesFutureFillAsPredictor}={}){
  if(usesFutureFillAsPredictor===true)return {status:"GAP_FILL_LOOKAHEAD"};
  return {status:(thresholdFrozen&&toleranceFrozen&&horizonFrozen)?"FILL_RULE_PREREGISTERED":"FILL_RULE_NOT_PREREGISTERED"};
}
export function classifyLimitDiscovery({priorLimitHit,freePriceDiscoveryAvailable}={}){
  if(priorLimitHit===true&&freePriceDiscoveryAvailable!==true)return {status:"PRICE_LIMIT_DELAYED_DISCOVERY"};
  return {status:"LIMIT_CONTEXT_CLEAR"};
}
