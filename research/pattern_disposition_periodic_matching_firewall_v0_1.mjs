// D01 DL-068 disposition periodic-matching firewall v0.1
export function classifyCadence({receiptVerified,matchingCadenceSeconds}={}){
  if(receiptVerified!==true)return {status:"DISPOSITION_MATCHING_REGIME_UNKNOWN"};
  if(!Number.isFinite(matchingCadenceSeconds)||matchingCadenceSeconds<=0)return {status:"DATA_BLOCKED"};
  return {status:"CADENCE_VALID",matchingCadenceSeconds};
}
export function normalizeTouchEvidence({wallClockMinutes,matchingOpportunityCount,touchCount}={}){
  if(!Number.isFinite(wallClockMinutes)||!Number.isInteger(matchingOpportunityCount)||matchingOpportunityCount<1||!Number.isInteger(touchCount)||touchCount<0)
    return {status:"UNKNOWN"};
  return {status:"VALID",touchesPerOpportunity:touchCount/matchingOpportunityCount,wallClockMinutes,matchingOpportunityCount,
    wallClockPersistenceEqualsIndependentTouchCount:false};
}
export function classifyBarContamination({expectedMatchCount,observedMatchCount,syntheticBarsInserted}={}){
  if(syntheticBarsInserted===true)return {status:"SYNTHETIC_CONTINUITY_CONTAMINATION"};
  if(!Number.isInteger(expectedMatchCount)||!Number.isInteger(observedMatchCount))return {status:"UNKNOWN"};
  return {status:"MATCHING_OPPORTUNITY_ACCOUNTED",missingMatchCount:Math.max(0,expectedMatchCount-observedMatchCount)};
}
export function classifyParticipantSelection({prepaymentRule,marginRestriction,brokerOrderCapState}={}){
  const active=[prepaymentRule,marginRestriction,brokerOrderCapState].some(x=>x&&x!=="NONE");
  return {status:active?"PARTICIPANT_SELECTION_CONTEXT_ACTIVE":"NO_RECORDED_PARTICIPANT_SELECTION_CONTEXT",directionalSignal:false};
}
export function buildDispositionLineage({pattern=true,breakout=true,persistence=true,momentum=true}={}){
  const n=[pattern,breakout,persistence,momentum].filter(Boolean).length;
  return {informationRoot:"PRICE_OHLC",rawRepresentationCount:n,effectiveIndependentEvidenceCount:n?1:0};
}
export function classifyComparator({treated,triggerPathMatched}={}){
  if(triggerPathMatched!==true)return {status:"NOT_COMPARABLE_TRIGGER_SELECTION"};
  return {status:treated===true?"G1_DISPOSITION_PERIODIC_MATCHING":"G0_ABNORMAL_CONTINUOUS_MATCHING"};
}
