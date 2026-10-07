// D01 DL-070 sparse-liquidity / stale-print firewall v0.1
export function classifyBarTouch({tradeCount,carriedPriceFlag,independentExecutionIds=[]}={}){
  if(!Number.isInteger(tradeCount)||tradeCount<0)return {status:"UNKNOWN"};
  if(tradeCount===0||carriedPriceFlag===true)return {status:"NOT_A_STRUCTURAL_TOUCH",reason:tradeCount===0?"ZERO_TRADE_BAR":"STALE_PRINT_CONTAMINATION"};
  const unique=new Set(independentExecutionIds.filter(Boolean));
  return {status:"EXECUTION_TOUCH_EVALUABLE",independentTouchCount:unique.size};
}
export function classifyTickCluster({legalTickSize,zoneWidth,price,roundIncrement}={}){
  if(!Number.isFinite(legalTickSize)||legalTickSize<=0||!Number.isFinite(zoneWidth)||!Number.isFinite(price))
    return {status:"UNKNOWN"};
  const zoneWidthTicks=zoneWidth/legalTickSize;
  const roundCluster=Number.isFinite(roundIncrement)&&roundIncrement>0?Math.abs(price/roundIncrement-Math.round(price/roundIncrement))<1e-9:false;
  return {status:"TICK_CONTEXT_VALID",zoneWidthTicks,roundCluster,structuralAlphaProven:false};
}
export function classifyGapCross({zoneCrossed,ownerCertifiedLiquidityGap}={}){
  if(zoneCrossed!==true)return {status:"NO_ZONE_CROSS"};
  if(ownerCertifiedLiquidityGap===true)return {status:"LIQUIDITY_GAP_CROSSING",breakoutStrengthProven:false};
  return {status:"ZONE_CROSS_ATTRIBUTION_UNRESOLVED"};
}
export function buildRevisitDenominator({eligibleRoots,revisited,bounced,crossed,expired,dataBlocked}={}){
  const vals=[eligibleRoots,revisited,bounced,crossed,expired,dataBlocked];
  if(vals.some(x=>!Number.isInteger(x)||x<0))return {status:"UNKNOWN"};
  return {status:"DENOMINATOR_PRESERVED",eligibleRoots,revisited,bounced,crossed,expired,dataBlocked,
    survivorOnlyRateProhibited:true};
}
export function classifyFreshnessClock({clockType,preregistered}={}){
  const allowed=new Set(["ELIGIBLE_SESSION_COUNT","INDEPENDENT_EXECUTION_COUNT","INFORMATION_EVENT_COUNT","VOLATILITY_DISTANCE_TRAVELED","LIQUIDITY_OPPORTUNITY_COUNT"]);
  if(!allowed.has(clockType))return {status:"CLOCK_UNSUPPORTED"};
  return {status:preregistered===true?"FRESHNESS_CLOCK_PREREGISTERED":"FRESHNESS_CLOCK_NOT_PREREGISTERED",calendarHalfLifeAssumed:false};
}
export function buildStructureLineage({support=true,breakout=true,momentum=true,priceCluster=true}={}){
  const n=[support,breakout,momentum,priceCluster].filter(Boolean).length;
  return {informationRoot:"PRICE_OHLC",rawRepresentationCount:n,effectiveIndependentEvidenceCount:n?1:0};
}
