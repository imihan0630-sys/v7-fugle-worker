// D01 DL-138~140 trading-channel / session-mechanism oracle v0.1

const CHANNELS=new Set([
  "REGULAR_LOT","INTRADAY_ODD_LOT","AFTER_HOURS_ODD_LOT",
  "AFTER_HOURS_FIXED_PRICE","BLOCK_TRADE","OTHER_OFFICIAL_CHANNEL","CHANNEL_UNKNOWN"
]);

export function validateCanonicalBarChannelBinding(r={}){
  if(!r.canonicalBarSourceId||!r.channelCompositionVersion||!Array.isArray(r.includedTradingChannels)||!Array.isArray(r.excludedTradingChannels))
    return {status:"CHANNEL_BINDING_INCOMPLETE"};
  if(r.silentCustomFusion===true)return {status:"SILENT_CHANNEL_FUSION_PROHIBITED"};
  if(!r.includedTradingChannels.every(x=>CHANNELS.has(x)))return {status:"UNKNOWN_INCLUDED_CHANNEL"};
  return {status:"CANONICAL_BAR_CHANNEL_BINDING_VALID"};
}

export function classifyChannelAvailability(r={}){
  if(r.channelClass==="INTRADAY_ODD_LOT" && r.marketSessionDate<"2020-10-26")
    return {status:"CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN"};
  if(r.ruleEffective===false)return {status:"CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN"};
  if(r.sourceExpected===true&&r.sourceObserved===false)return {status:"CHANNEL_SOURCE_MISSING"};
  if(r.channelCompositionKnown!==true)return {status:"CHANNEL_COMPOSITION_UNKNOWN_BLOCKED"};
  return {status:"CHANNEL_OBSERVED"};
}

export function classifyChannelDependency(a={},b={}){
  if(!a.securityIdentity||!b.securityIdentity||!a.marketSessionDate||!b.marketSessionDate)
    return {status:"CHANNEL_DEPENDENCY_UNKNOWN"};
  if(a.securityIdentity===b.securityIdentity&&a.marketSessionDate===b.marketSessionDate){
    if(a.channelClass!==b.channelClass)
      return {status:"SAME_SECURITY_DATE_CROSS_CHANNEL_DEPENDENCY"};
    return {status:"SAME_CHANNEL_SAME_SECURITY_DATE"};
  }
  return {status:"DISTINCT_SECURITY_OR_DATE"};
}

export function validateChannelVote(r={}){
  if(r.sameSecurityDate===true&&r.observedChannelCount>1&&r.independentVoteCount===r.observedChannelCount)
    return {status:"CHANNEL_VOTE_MULTIPLICATION_PROHIBITED"};
  if(r.sameSecurityDate===true&&r.independentVoteCount===null)
    return {status:"CHANNEL_DEPENDENCE_PRESERVED"};
  return {status:"CHANNEL_VOTE_POLICY_VALID"};
}

export function classifySessionMechanism(r={}){
  const allowed=new Set([
    "OPENING_CALL_AUCTION","REGULAR_CONTINUOUS","CLOSING_CALL_AUCTION",
    "INTRADAY_ODD_LOT_CALL_AUCTION","AFTER_HOURS_ODD_LOT_CALL_AUCTION",
    "AFTER_HOURS_FIXED_PRICE","BLOCK_TRADE","VOLATILITY_INTERRUPTION_CALL_AUCTION",
    "UNKNOWN_MECHANISM"
  ]);
  return {status:allowed.has(r.mechanism)?"MECHANISM_CLASS_VALID":"MECHANISM_CLASS_INVALID"};
}

export function validateMechanismConfirmation(r={}){
  if(r.mechanism==="AFTER_HOURS_FIXED_PRICE"&&r.tradePriceEqualsRegularClose===true){
    if(r.countedAsIndependentConfirmation===true)return {status:"AFTER_HOURS_FIXED_PRICE_FALSE_CONFIRMATION"};
    return {status:"FIXED_PRICE_EXECUTION_CONTEXT_ONLY"};
  }
  if(["INTRADAY_ODD_LOT_CALL_AUCTION","AFTER_HOURS_ODD_LOT_CALL_AUCTION"].includes(r.mechanism)&&r.replacedRegularGeometry===true)
    return {status:"ODD_LOT_REPLACES_REGULAR_GEOMETRY_PROHIBITED"};
  if(r.mechanism==="BLOCK_TRADE"&&r.usedAsFirstWaveCanonicalPatternBar===true)
    return {status:"BLOCK_TRADE_FIRST_WAVE_BAR_PROHIBITED"};
  return {status:"MECHANISM_CONFIRMATION_POLICY_VALID"};
}

export function validateCrossVintageChannelSupport(oldR={},newR={}){
  const fields=["securityIdentity","channelClass","channelCompositionVersion","blockedRowPolicyId"];
  const drift=fields.filter(k=>(oldR[k]??null)!==(newR[k]??null));
  if(drift.length)return {status:"CHANNEL_COMMON_SUPPORT_MISMATCH",drift};
  if(oldR.channelAvailableOnDate!==true||newR.channelAvailableOnDate!==true)
    return {status:"CHANNEL_AVAILABILITY_MISMATCH",drift:[]};
  return {status:"CHANNEL_COMMON_SUPPORT_VALID",drift:[]};
}

export function validateChannelRegimeReceipt(r={}){
  const required=["market","securityIdentity","marketSessionDate","channelClass","channelRuleVersion","channelEffectiveFrom","sourceChannelCompositionVersion","sourceHash","firstObservableAt"];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"CHANNEL_REGIME_RECEIPT_INCOMPLETE",missing};
  if(!CHANNELS.has(r.channelClass))return {status:"CHANNEL_REGIME_CLASS_INVALID",missing:[]};
  return {status:"CHANNEL_REGIME_RECEIPT_VALID",missing:[]};
}

export function aggregateChannelDenominator(rows=[]){
  const counts={
    CHANNEL_OBSERVED:0,
    CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN:0,
    CHANNEL_SOURCE_MISSING:0,
    CHANNEL_COMPOSITION_UNKNOWN_BLOCKED:0,
    MECHANISM_RULE_UNKNOWN_BLOCKED:0
  };
  for(const r of rows){
    if(r.state in counts)counts[r.state]++;
  }
  return {status:"CHANNEL_DENOMINATOR_ACCOUNTED",total:rows.length,counts};
}
