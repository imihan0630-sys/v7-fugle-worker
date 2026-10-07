// D01 DL-091 source/context receipt bundle oracle v0.1
const PREDICTOR_FAMILIES=["R1","R2","R3","R4","R5","R6","R7"];
export function validateTemporalReceipt({firstObservableAt,predictorFreezeAt,replaySafe}={}){
  if(replaySafe!==true||!firstObservableAt||!predictorFreezeAt)return {status:"RECEIPT_CLOCK_UNKNOWN"};
  return {status:firstObservableAt<=predictorFreezeAt?"RECEIPT_PIT_VALID":"RECEIPT_LOOKAHEAD"};
}
export function validateMembership(r={}){
  if(r.replayEligible!==true||r.futureDelistingHidden!==true)return {status:"MEMBERSHIP_BLOCKED"};
  if(!["MEMBER_ON_DATE","NOT_MEMBER_ON_DATE","HISTORY_TOO_SHORT_BY_DESIGN"].includes(r.membershipStateAtDate))
    return {status:"MEMBERSHIP_UNKNOWN"};
  return {status:"MEMBERSHIP_VALID"};
}
export function validateRawA1(r={}){
  if(r.observationState!=="VALID_OHLC")return {status:"RAW_A1_DATA_BLOCKED"};
  if(["open","high","low","close"].some(k=>!Number.isFinite(r[k])))return {status:"RAW_A1_DATA_BLOCKED"};
  if(r.high<Math.max(r.open,r.close)||r.low>Math.min(r.open,r.close))return {status:"RAW_A1_INVALID_OHLC"};
  return {status:"RAW_A1_VALID"};
}
export function validateLifecycle(r={}){
  if(r.coverageCompleteForSymbolDate!==true)return {status:"LIFECYCLE_COVERAGE_UNKNOWN"};
  if(r.lifecycleState==="UNKNOWN_SYMBOL_SESSION_GAP")return {status:"LIFECYCLE_UNKNOWN"};
  return {status:"LIFECYCLE_VALID"};
}
export function validateContinuity(r={}){
  if(r.eventCoverageState!=="COMPLETE")return {status:"EVENT_COVERAGE_UNKNOWN"};
  if(r.technicalContinuityState==="CLEAR_NO_ACTION")return {status:"CONTINUITY_VALID"};
  if(r.technicalContinuityState==="VERIFIED_TRANSFORM"&&r.continuityTransformHash)return {status:"CONTINUITY_VALID"};
  return {status:"CONTINUITY_BLOCKED"};
}
export function validatePriceLimit(r={}){
  if(!["ORDINARY_LIMIT_REGIME","SPECIAL_REFERENCE_LIMIT_REGIME","NO_LIMIT_SPECIAL_REGIME"].includes(r.specialReferenceState))
    return {status:"PRICE_LIMIT_STATE_UNKNOWN"};
  return {status:"PRICE_LIMIT_STATE_VALID"};
}
export function validateDisposition(r={}){
  if(r.coverageCompleteForSymbolDate!==true)return {status:"DISPOSITION_COVERAGE_UNKNOWN"};
  if(!["CERTIFIED_NORMAL_MATCHING","VERIFIED_DISPOSITION_MATCHING"].includes(r.state))
    return {status:"DISPOSITION_MATCHING_REGIME_UNKNOWN"};
  return {status:"DISPOSITION_STATE_VALID"};
}
export function validatePolicy(r={}){
  if(r.finalHoldoutYear!==2024||r.finalHoldoutLocked!==true||r.noPostHoldoutTuning!==true)return {status:"VALIDATION_POLICY_DRIFT"};
  const needed=["foldPlanHash","horizonSetHash","commonParentComparatorHash","multiplicityPolicyHash","searchRegistryHash"];
  return {status:needed.every(k=>typeof r[k]==="string"&&r[k].length>0)?"VALIDATION_POLICY_VALID":"VALIDATION_POLICY_INCOMPLETE"};
}
export function validateBundle({states={}}={}){
  const missing=PREDICTOR_FAMILIES.filter(k=>states[k]!=="PASS");
  return {status:missing.length?"CAUSAL_OOS_BLOCKED":"PREDICTOR_CONTEXT_READY",missing};
}
