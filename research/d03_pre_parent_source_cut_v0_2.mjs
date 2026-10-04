import { evaluateD03PreParentSourceCutV0_1 } from "./d03_pre_parent_source_cut_v0_1.mjs";

export const D03_PRE_PARENT_SOURCE_CUT_VERSION_V0_2="D03_PRE_PARENT_SOURCE_CUT_V0_2";

const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));

export function evaluateD03PreParentSourceCutV0_2({cut,parent}={}){
  if(!parent||typeof parent!=="object"){
    return {schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION_V0_2,status:"UNKNOWN",eligible:false,reasons:["PARENT_MISSING"]};
  }
  const reasons=[];
  if(!isoTime(parent.decisionCutoffAt)) reasons.push("PARENT_DECISION_CUTOFF_NOT_PERSISTED");
  if(!isoTime(parent.decisionAt)) reasons.push("PARENT_DECISION_AT_INVALID");
  if(
    isoTime(parent.decisionCutoffAt)&&isoTime(parent.decisionAt)&&
    Date.parse(parent.decisionCutoffAt)>Date.parse(parent.decisionAt)
  ) reasons.push("DECISION_CUTOFF_AFTER_DECISION_AT");
  if(reasons.length){
    return {
      schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION_V0_2,
      status:"DATA_BLOCKED",eligible:false,reasons,
      decisionAtMaySubstituteForCutoff:false,
    };
  }

  const strictParent={
    ...parent,
    knownAt:parent.decisionCutoffAt,
  };
  const inner=evaluateD03PreParentSourceCutV0_1({cut,parent:strictParent});
  return {
    ...inner,
    schemaVersion:D03_PRE_PARENT_SOURCE_CUT_VERSION_V0_2,
    decisionCutoffAt:parent.decisionCutoffAt,
    decisionAt:parent.decisionAt,
    decisionAtMaySubstituteForCutoff:false,
    originalParentKnownAt:parent.knownAt||null,
    strictEligibilityClock:"DECISION_CUTOFF_AT",
  };
}
