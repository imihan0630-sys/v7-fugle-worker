// D01 DL-084 cup/base/handle PIT contract v0.1
const STATES=new Set(["BASE_CANDIDATE","LEFT_SIDE_FORMED","TROUGH_CANDIDATE","RIGHT_SIDE_DEVELOPING","RIM_RETEST","HANDLE_CANDIDATE","BREAKOUT_CANDIDATE","CONFIRMED","FAILED","EXPIRED","DATA_BLOCKED"]);
export function validateBaseLifecycle({status,firstObservableAt,predictorFreezeAt,confirmedAt}={}){
  if(!STATES.has(status))return {status:"STATE_UNKNOWN"};
  if(!firstObservableAt||!predictorFreezeAt)return {status:"CLOCK_UNKNOWN"};
  if(firstObservableAt>predictorFreezeAt)return {status:"BASE_LOOKAHEAD"};
  if(confirmedAt&&confirmedAt>predictorFreezeAt&&status==="CONFIRMED")return {status:"CONFIRMATION_LOOKAHEAD"};
  return {status:"BASE_STATE_VALID"};
}
export function validateTemplateSelection({parameterFamilyPreregistered,usesOutcomeForResize}={}){
  if(usesOutcomeForResize===true)return {status:"TEMPLATE_HINDSIGHT"};
  return {status:parameterFamilyPreregistered===true?"TEMPLATE_PREREGISTERED":"TEMPLATE_NOT_PREREGISTERED"};
}
export function classifyBaseComparator({priorTrendControlled,rangeCompressionControlled,genericBreakoutControlled}={}){
  return {status:(priorTrendControlled&&rangeCompressionControlled&&genericBreakoutControlled)?"BASE_INCREMENTALITY_EVALUABLE":"BASELINE_CONTROLS_INCOMPLETE"};
}
export function preserveBaseDenominator({candidates,confirmed,failed,expired,dataBlocked}={}){
  const a=[candidates,confirmed,failed,expired,dataBlocked];
  if(a.some(x=>!Number.isInteger(x)||x<0))return {status:"UNKNOWN"};
  return {status:"FULL_BASE_DENOMINATOR",failedRetained:true,expiredRetained:true,candidates};
}
export function classifyHandleLineage({sameBaseEpisode,independentRoot}={}){
  if(sameBaseEpisode===true&&independentRoot!==true)return {status:"SAME_BASE_REPRESENTATION",effectiveIndependentEvidenceCount:1};
  return {status:"DISTINCTNESS_REQUIRES_VALIDATION"};
}
