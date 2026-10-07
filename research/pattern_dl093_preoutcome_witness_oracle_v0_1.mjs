// D01 DL-093 pre-outcome witness request oracle v0.1
export function validateWitnessFreeze(w={}){
  if(w.market!=="TWSE"||w.symbol!=="1101"||w.targetDate!=="2021-06-15") return {status:"WITNESS_IDENTITY_DRIFT"};
  if(w.requiredPriorEligibleSessions!==60||w.expectedWindowSize!==61) return {status:"WINDOW_POLICY_DRIFT"};
  if(w.outcomeJoin!=="CLOSED") return {status:"OUTCOME_FIREWALL_BREACH"};
  return {status:"WITNESS_FROZEN_VALID"};
}
export function validateNoSwitch({originalSymbol,originalDate,candidateSymbol,candidateDate,contextInspected}={}){
  if(contextInspected===true&&(candidateSymbol!==originalSymbol||candidateDate!==originalDate))
    return {status:"POST_CONTEXT_WITNESS_SWITCH_PROHIBITED"};
  return {status:"WITNESS_IDENTITY_PRESERVED"};
}
export function validateWindowIdentity({expectedDates=[],observedDates=[],expectedSessionHash,observedSessionHash}={}){
  if(expectedDates.length!==61||observedDates.length!==61)return {status:"WINDOW_SIZE_BLOCKED"};
  if(new Set(expectedDates).size!==61||new Set(observedDates).size!==61)return {status:"DUPLICATE_SESSION_BLOCKED"};
  if(expectedDates.join("|")!==observedDates.join("|"))return {status:"EXPECTED_OBSERVED_DATESET_MISMATCH"};
  if(!expectedSessionHash||expectedSessionHash!==observedSessionHash)return {status:"SESSION_HASH_MISMATCH"};
  return {status:"EXACT_WINDOW_READY"};
}
export function validateR5(r={}){
  const nums=["upperLimitPrice","openingAuctionReferencePrice","lowerLimitPrice"];
  if(!nums.every(k=>Number.isFinite(r[k])&&r[k]>0))return {status:"R5_FIELDS_BLOCKED"};
  if(!r.ruleVersion||!r.firstObservableAt||!r.sourceHash||r.replaySafe!==true)return {status:"R5_PROVENANCE_PENDING"};
  return {status:"R5_READY"};
}
export function validateR6(r={}){
  if(r.coverageCompleteForWindow!==true)return {status:"R6_COVERAGE_UNKNOWN"};
  if(r.state==="VERIFIED_DISPOSITION_MATCHING"&&Number.isFinite(r.matchingCadenceSeconds)&&r.matchingCadenceSeconds>0)
    return {status:"R6_READY_DISPOSITION"};
  if(r.state==="CERTIFIED_NORMAL_MATCHING"&&r.changedTradingMethodResolved===true)
    return {status:"R6_READY_NORMAL"};
  return {status:"R6_MATCHING_REGIME_UNKNOWN"};
}
export function validateUpstreamBundle(states={}){
  const keys=["R1","R2","R3","R4","R5","R6"];
  const missing=keys.filter(k=>states[k]!=="PASS");
  return {status:missing.length?"R1_R6_BUNDLE_BLOCKED":"R1_R6_BUNDLE_READY",missing};
}
export function canGenerateR7({upstreamState,outcomesOpened}={}){
  if(outcomesOpened===true)return {status:"R7_OUTCOME_FIREWALL_BREACH"};
  return {status:upstreamState==="R1_R6_BUNDLE_READY"?"R7_GENERATION_ALLOWED":"R7_GENERATION_BLOCKED"};
}
