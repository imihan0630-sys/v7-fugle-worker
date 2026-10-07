// D01 DL-071 structural freshness tournament v0.1
const CLOCKS=new Set(["ELIGIBLE_SESSION_COUNT","INDEPENDENT_EXECUTION_COUNT","INFORMATION_EVENT_COUNT","VOLATILITY_DISTANCE_TRAVELED","LIQUIDITY_OPPORTUNITY_COUNT"]);
export function validateClockReceipt({clockType,value,knownAt,predictorFreezeAt,replaySafe,coverageKnown=true}={}){
  if(!CLOCKS.has(clockType))return {status:"CLOCK_UNSUPPORTED"};
  if(replaySafe!==true)return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!knownAt||!predictorFreezeAt)return {status:"UNKNOWN",reason:"CLOCK_MISSING"};
  if(knownAt>predictorFreezeAt)return {status:"CLOCK_NOT_AVAILABLE_AT_FREEZE"};
  if(clockType==="INFORMATION_EVENT_COUNT"&&coverageKnown!==true)return {status:"UNKNOWN",reason:"EVENT_COVERAGE_UNKNOWN"};
  if(!Number.isFinite(value)||value<0)return {status:"UNKNOWN",reason:"CLOCK_VALUE_INVALID"};
  return {status:"VALID",clockType,value};
}
export function preserveRootDenominator({eligibleRoots,revisited,crossed,expired,dataBlocked,neverRevisited}={}){
  const a=[eligibleRoots,revisited,crossed,expired,dataBlocked,neverRevisited];
  if(a.some(x=>!Number.isInteger(x)||x<0))return {status:"UNKNOWN"};
  return {status:"ROOT_DENOMINATOR_PRESERVED",eligibleRoots,survivorOnlyDataset:false};
}
export function validateTouchIndependence({executionIds=[]}={}){
  const ids=executionIds.filter(Boolean); const u=new Set(ids);
  return {status:"VALID",rawCount:ids.length,independentCount:u.size,duplicateCount:ids.length-u.size};
}
export function classifyClockFamily({clockTypes=[]}={}){
  const valid=clockTypes.filter(x=>CLOCKS.has(x));
  return {status:"FRESHNESS_CLOCK_FAMILY",representationCount:valid.length,informationRoot:"STRUCTURAL_FRESHNESS_LATENT",effectiveIndependentEvidenceCount:valid.length?1:0};
}
export function validateTournamentPlan({preregistered,multipleTestingPlanFrozen,tieRuleFrozen,allowNoWinner}={}){
  if(preregistered!==true||multipleTestingPlanFrozen!==true||tieRuleFrozen!==true)return {status:"TOURNAMENT_NOT_PREREGISTERED"};
  if(allowNoWinner!==true)return {status:"INVALID_PLAN",reason:"NO_WINNER_MUST_BE_ALLOWED"};
  return {status:"TOURNAMENT_PREREGISTERED"};
}
export function classifyOutcomeLeakage({usesFutureBounce,usesFutureCross,usesPostFreezeRevision}={}){
  return {status:(usesFutureBounce||usesFutureCross||usesPostFreezeRevision)?"INVALID_FRESHNESS_CLOCK_LOOKAHEAD":"OUTCOME_BLIND"};
}
