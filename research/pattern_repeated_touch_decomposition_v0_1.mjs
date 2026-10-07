// D01 DL-072 repeated-touch decomposition v0.1
export function dedupeTouches({touches=[]}={}){
  const seen=new Set(); let duplicates=0;
  for(const t of touches){
    const id=String(t?.executionOrMatchId??"");
    if(!id) continue;
    if(seen.has(id)) duplicates++; else seen.add(id);
  }
  return {status:"VALID",rawCount:touches.length,independentTouchCount:seen.size,duplicateCount:duplicates};
}
export function classifyLiquidityMechanism({depthBefore,depthAfter,replenishmentObserved,adverseSelectionContext}={}){
  if(!Number.isFinite(depthBefore)||!Number.isFinite(depthAfter)) return {status:"LIQUIDITY_RECEIPT_UNKNOWN"};
  if(depthAfter<depthBefore && replenishmentObserved!==true) return {status:"RESTING_LIQUIDITY_DEPLETION"};
  if(depthAfter>=depthBefore && replenishmentObserved===true) return {status:"STIMULATED_REPLENISHMENT"};
  if(adverseSelectionContext===true && depthAfter<depthBefore) return {status:"ADVERSE_SELECTION_WITHDRAWAL"};
  return {status:"MIXED_OR_UNIDENTIFIED"};
}
export function classifyTouchShape({shape}={}){
  const allowed=new Set(["REINFORCING","DEPLETING","U_SHAPED","INVERTED_U","THRESHOLD","NO_RELATION","STATE_DEPENDENT","NOT_IDENTIFIED"]);
  return {status:allowed.has(shape)?shape:"NOT_IDENTIFIED",monotoneAssumed:false};
}
export function validateTouchClock({firstObservableAt,predictorFreezeAt,outcomeAvailableAt}={}){
  if(!firstObservableAt||!predictorFreezeAt) return {status:"UNKNOWN"};
  if(firstObservableAt>predictorFreezeAt) return {status:"TOUCH_NOT_KNOWN_AT_FREEZE"};
  if(outcomeAvailableAt && outcomeAvailableAt<=predictorFreezeAt) return {status:"VALID_WITH_PRIOR_OUTCOME"};
  return {status:"VALID_OUTCOME_BLIND"};
}
export function buildTouchLineage({priceDerivedCount=0,liquidityContextPresent=false}={}){
  return {informationRoot:"PRICE_OHLC",rawPriceRepresentationCount:priceDerivedCount,
    liquidityContextPresent:liquidityContextPresent===true,effectiveIndependentEvidenceCount:priceDerivedCount>0?1:0};
}
