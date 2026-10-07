// D01 DL-082 single candle morphology v0.1
export function normalizeCandle({open,high,low,close,tradeCount,completedBar}={}){
  if([open,high,low,close].some(x=>!Number.isFinite(x)))return {status:"DATA_BLOCKED"};
  if(completedBar!==true)return {status:"INCOMPLETE_BAR"};
  if(!Number.isInteger(tradeCount)||tradeCount<=0)return {status:"ZERO_TRADE_BAR"};
  const range=high-low;
  if(range<0||high<Math.max(open,close)||low>Math.min(open,close))return {status:"INVALID_OHLC"};
  if(range===0)return {status:"ZERO_RANGE_BAR",bodyToRange:null};
  const body=Math.abs(close-open);
  return {status:"MORPHOLOGY_VALID",bodyToRange:body/range,upperWickToRange:(high-Math.max(open,close))/range,lowerWickToRange:(Math.min(open,close)-low)/range,closeLocationInRange:(close-low)/range};
}
export function classifyCandleAlias({aliases=[]}={}){
  const a=[...new Set(aliases.filter(Boolean))];
  return {status:"ALIAS_FAMILY",rawAliasCount:a.length,informationRoot:"PRICE_OHLC",effectiveIndependentEvidenceCount:a.length?1:0};
}
export function validateCandleClock({barCloseAt,predictorFreezeAt}={}){
  if(!barCloseAt||!predictorFreezeAt)return {status:"UNKNOWN"};
  return {status:barCloseAt<=predictorFreezeAt?"BAR_AVAILABLE":"INCOMPLETE_BAR_LOOKAHEAD"};
}
export function classifyCandleContamination({synthetic,priceLimitCensored,corporateAction,suspension,illiquidFewTicks}={}){
  const flags={synthetic,priceLimitCensored,corporateAction,suspension,illiquidFewTicks};
  const active=Object.entries(flags).filter(([,v])=>v===true).map(([k])=>k);
  return {status:active.length?"CANDLE_CONTEXT_CONTAMINATED":"CANDLE_CONTEXT_CLEAN",active};
}
