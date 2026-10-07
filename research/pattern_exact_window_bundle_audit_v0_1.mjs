// D01 DL-092 exact-window bundle audit v0.1
export function classifyReceiptState({exists,complete,boundToExactWindow}={}){
  if(exists!==true)return {status:"RECEIPT_NOT_FOUND"};
  if(complete!==true)return {status:"RECEIPT_COMPLETENESS_BLOCKED"};
  if(boundToExactWindow!==true)return {status:"RECEIPT_NOT_EXACT_WINDOW_BOUND"};
  return {status:"RECEIPT_READY"};
}
export function classifyMechanicsWitness({pointInTimeReady,technicalPriceReady,eventCoverageComplete,inferenceReady}={}){
  if(pointInTimeReady!==true||technicalPriceReady!==true)return {status:"MECHANICS_NOT_READY"};
  if(eventCoverageComplete!==true||inferenceReady!==true)return {status:"MECHANICS_READY_INFERENCE_BLOCKED"};
  return {status:"INFERENCE_CONTEXT_READY"};
}
export function validatePositiveControl({r1,r2,r3,r4,r5,r6,r7}={}){
  const states={r1,r2,r3,r4,r5,r6,r7};
  const missing=Object.entries(states).filter(([,v])=>v!=="PASS").map(([k])=>k.toUpperCase());
  return {status:missing.length?"R1_R7_POSITIVE_CONTROL_NOT_FOUND":"R1_R7_POSITIVE_CONTROL_FOUND",missing};
}
export function classifyAbsence({sourceCoverageComplete,matchingRowFound}={}){
  if(matchingRowFound===true)return {status:"POSITIVE_ROW_OBSERVED"};
  return {status:sourceCoverageComplete===true?"CERTIFIED_ABSENCE":"ABSENCE_CANNOT_CERTIFY_NORMAL"};
}
export function canGenerateR7({upstreamR1R6Ready}={}){
  return {status:upstreamR1R6Ready===true?"R7_GENERATION_ELIGIBLE":"R7_UPSTREAM_BLOCKED"};
}
