// D01 DL-077 multi-timeframe alias firewall v0.1
export function classifyTimeframeAliasing({sameEpisode,overlappingSourceTrades,independentNonPriceRoot}={}){
  if(sameEpisode===true&&overlappingSourceTrades===true&&independentNonPriceRoot!==true)
    return {status:"NESTED_TIMEFRAME_ALIAS",effectiveIndependentEvidenceCount:1,informationRoot:"PRICE_OHLC"};
  return {status:"DISTINCTNESS_REQUIRES_VALIDATION"};
}
export function validateAggregationClock({barCloseAt,predictorFreezeAt,usesCompletedBar}={}){
  if(!barCloseAt||!predictorFreezeAt)return {status:"UNKNOWN"};
  if(usesCompletedBar===true&&barCloseAt>predictorFreezeAt)return {status:"INCOMPLETE_PARENT_LOOKAHEAD"};
  return {status:"AGGREGATION_CLOCK_VALID"};
}
export function classifyTimeframeSelection({preregistered,selectedAfterOutcome}={}){
  if(selectedAfterOutcome===true)return {status:"TIMEFRAME_SELECTION_BIAS"};
  return {status:preregistered===true?"TIMEFRAME_SET_PREREGISTERED":"TIMEFRAME_SET_NOT_PREREGISTERED"};
}
export function classifyConflict({sameEpisode,distinctRoots,parentComplete}={}){
  if(parentComplete!==true)return {status:"PARENT_INCOMPLETE"};
  if(distinctRoots===true)return {status:"DISTINCT_STRUCTURAL_ROOTS"};
  if(sameEpisode===true)return {status:"SAME_EPISODE_PHASE_CONFLICT"};
  return {status:"CONFLICT_UNRESOLVED"};
}
export function buildMultiscaleLineage({representations=[]}={}){
  const valid=representations.filter(Boolean);
  return {status:"MULTISCALE_LINEAGE",rawRepresentationCount:valid.length,informationRoot:"PRICE_OHLC",effectiveIndependentEvidenceCount:valid.length?1:0};
}
