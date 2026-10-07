// D01 DL-080 structural-break/regime-reset firewall v0.1
export function validateRegimeReceipt({firstObservableAt,predictorFreezeAt,replaySafe,retrospectiveOnly}={}){
  if(retrospectiveOnly===true)return {status:"RETROSPECTIVE_BREAK_LOOKAHEAD"};
  if(replaySafe!==true)return {status:"REGIME_RECEIPT_UNKNOWN"};
  if(!firstObservableAt||!predictorFreezeAt)return {status:"REGIME_RECEIPT_UNKNOWN"};
  if(firstObservableAt>predictorFreezeAt)return {status:"REGIME_NOT_KNOWN_AT_FREEZE"};
  return {status:"REGIME_RECEIPT_VALID"};
}
export function classifyChangeType({volatility,trend,liquidity}={}){
  const n=[volatility,trend,liquidity].filter(Boolean).length;
  if(n===0)return {status:"CHANGE_TYPE_UNKNOWN"};
  if(n>1)return {status:"MULTI_DIMENSIONAL_CHANGE"};
  if(volatility)return {status:"VOLATILITY_ONLY_CHANGE"};
  if(trend)return {status:"TREND_ONLY_CHANGE"};
  return {status:"LIQUIDITY_ONLY_CHANGE"};
}
export function classifyRootTreatment({regimeReceiptValid,newPriceDiscovery,mechanicalEvent,rootStillObservable}={}){
  if(regimeReceiptValid!==true)return {status:"ROOT_STATE_UNKNOWN"};
  if(mechanicalEvent===true)return {status:"ROOT_INVALIDATED_BY_MECHANICAL_EVENT"};
  if(newPriceDiscovery===true)return {status:"ROOT_FRESHNESS_REEVALUATION_REQUIRED"};
  if(rootStillObservable===true)return {status:"ROOT_ACTIVE_WITH_REGIME_CONTEXT"};
  return {status:"ROOT_TEMPORARILY_BLOCKED"};
}
export function classifyRegimeEvidence({priceRootPresent,regimeContextPresent}={}){
  return {status:"REGIME_CONTEXT_CLASSIFIED",priceRootPresent:!!priceRootPresent,regimeContextPresent:!!regimeContextPresent,regimeContextCreatesExtraVote:false};
}
