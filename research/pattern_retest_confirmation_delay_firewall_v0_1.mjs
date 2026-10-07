// D01 DL-076 retest confirmation-delay firewall v0.1
export function preserveRetestDenominator({totalBreakouts,noRetest,retestContinue,retestFail,immediateFail,immediateContinue,dataBlocked}={}){
  const a=[totalBreakouts,noRetest,retestContinue,retestFail,immediateFail,immediateContinue,dataBlocked];
  if(a.some(x=>!Number.isInteger(x)||x<0))return {status:"UNKNOWN"};
  return {status:"FULL_BREAKOUT_DENOMINATOR_PRESERVED",totalBreakouts,noRetestIncluded:true};
}
export function classifyRetestSelection({analysisRequiresObservedRetest,noRetestIncluded}={}){
  if(analysisRequiresObservedRetest===true&&noRetestIncluded!==true)return {status:"SURVIVORSHIP_BY_RETEST_SELECTION"};
  return {status:"RETEST_SELECTION_GUARDED"};
}
export function measureConfirmationDelay({breakoutPrice,entryPrice,breakoutAt,entryAt,remainingRewardDistance,stopDistanceAtEntry}={}){
  if(!Number.isFinite(breakoutPrice)||!Number.isFinite(entryPrice)||!breakoutAt||!entryAt)return {status:"UNKNOWN"};
  return {status:"DELAY_MEASURED",confirmationPriceDistance:entryPrice-breakoutPrice,
    confirmationLatencyMs:new Date(entryAt)-new Date(breakoutAt),remainingRewardDistance,stopDistanceAtEntry};
}
export function classifyRetestValue({sameEpisode,structuralReconfirmationEvidence,bettterRiskGeometry,executionDifference}={}){
  return {status:"RETEST_VALUE_DECOMPOSED",newStructuralInformation:sameEpisode===true?!!structuralReconfirmationEvidence:true,
    betterRiskGeometry:!!bettterRiskGeometry,executionDifference:!!executionDifference};
}
export function validateRetestClock({retestObservedAt,predictorFreezeAt}={}){
  if(!retestObservedAt||!predictorFreezeAt)return {status:"UNKNOWN"};
  return {status:retestObservedAt<=predictorFreezeAt?"RETEST_KNOWN_AT_FREEZE":"RETEST_NOT_KNOWN_AT_FREEZE"};
}
