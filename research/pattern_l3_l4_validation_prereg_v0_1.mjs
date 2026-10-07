// D01 DL-087 L3-to-L4 validation preregistration v0.1
const CONCLUSIONS=new Set(["SUPPORTED","REFUTED","INCONCLUSIVE","NOT_EVALUABLE"]);
export function validateProtocol({pitReplay,deterministicTests,commonParent,multiplicityPlan,fullDenominator,finalHoldoutLocked,noWinnerAllowed}={}){
  const ok=[pitReplay,deterministicTests,commonParent,multiplicityPlan,fullDenominator,finalHoldoutLocked,noWinnerAllowed].every(x=>x===true);
  return {status:ok?"PROTOCOL_PREREGISTERED":"PROTOCOL_INCOMPLETE"};
}
export function validateFold({trainYears,testYears,purgeSessions,finalHoldoutUsedForTuning}={}){
  if(finalHoldoutUsedForTuning===true)return {status:"FINAL_HOLDOUT_CONTAMINATED"};
  if(!Number.isFinite(trainYears)||trainYears<3)return {status:"TRAIN_SPAN_INSUFFICIENT"};
  if(testYears!==1)return {status:"TEST_SPAN_NOT_FROZEN"};
  if(!Number.isInteger(purgeSessions)||purgeSessions<20)return {status:"PURGE_INSUFFICIENT"};
  return {status:"FOLD_VALID"};
}
export function validateOutcomeHorizons({horizons=[]}={}){
  const key=[...horizons].sort((a,b)=>a-b).join(",");
  return {status:key==="1,5,20"?"HORIZONS_FROZEN":"HORIZON_SEARCH_RISK"};
}
export function validatePromotionGate(x={}){
  const keys=["pitReplay","deterministicTests","oosOrShadowComplete","commonParentIncremental","multiplicityHandled","fullDenominator","noPostHoldoutTuning"];
  const pass=keys.every(k=>x[k]===true);
  return {status:pass?"L4_CANDIDATE":"L4_NOT_ELIGIBLE",missing:keys.filter(k=>x[k]!==true)};
}
export function classifyConclusion({value}={}){
  return {status:CONCLUSIONS.has(value)?value:"INVALID_CONCLUSION"};
}
export function classifyPatternEvidence({namedPatternIncrementalOverRawParent}={}){
  return {status:namedPatternIncrementalOverRawParent===true?"INCREMENTAL_CANDIDATE":"PRESENTATION_OR_REDUNDANT_CANDIDATE"};
}
