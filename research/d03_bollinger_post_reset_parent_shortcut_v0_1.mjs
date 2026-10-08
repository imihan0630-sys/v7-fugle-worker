export const D03_BOLLINGER_POST_RESET_PARENT_SHORTCUT_VERSION_V0_1="D03_BOLLINGER_POST_RESET_PARENT_SHORTCUT_V0_1";
const day=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x);
const time=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const uniq=xs=>[...new Set(xs)];

export function evaluateBollingerPostResetParentShortcutV0_1({
  parent,
  boundContinuity,
  resetReceipt,
  formulaVersion="BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1",
}={}){
  const reasons=[];
  if(!parent||typeof parent!=="object") reasons.push("PARENT_MISSING");
  if(!boundContinuity||typeof boundContinuity!=="object"||boundContinuity.bindingEligible!==true) reasons.push("PARENT_CONTINUITY_BINDING_NOT_VALID");
  if(!resetReceipt||typeof resetReceipt!=="object") reasons.push("RESET_RECEIPT_MISSING");
  if(formulaVersion!=="BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1") reasons.push("FORMULA_VERSION_MISMATCH");

  const sessions=Array.isArray(boundContinuity?.exactEligibleSessions)?boundContinuity.exactEligibleSessions:[];
  if(sessions.length!==20) reasons.push("EXACT_SESSION_COUNT_NOT_20");
  if(sessions.some(x=>!day(x))||uniq(sessions).length!==sessions.length) reasons.push("SESSION_SET_INVALID");

  const resetDate=resetReceipt?.lastCertifiedPriceResetDate;
  if(!day(resetDate)) reasons.push("RESET_DATE_INVALID");
  if(resetReceipt?.sameSecurityIdentityContinuing!==true) reasons.push("SECURITY_IDENTITY_NOT_CONTINUING");
  if(resetReceipt?.identityTransitionDisposition!=="SAME_SECURITY_CONTINUING") reasons.push("IDENTITY_TRANSITION_NOT_ACCEPTED");
  if(resetReceipt?.priceResetFamilySetVersion!=="D03_PRICE_RESET_FAMILY_SET_V0_1") reasons.push("PRICE_RESET_FAMILY_SET_VERSION_MISMATCH");
  if(resetReceipt?.unresolvedResetEventCount!==0) reasons.push("UNRESOLVED_RESET_EVENT");
  if(resetReceipt?.pseudoBarCount!==0) reasons.push("PSEUDO_BAR_PRESENT");

  if(!time(parent?.decisionCutoffAt)) reasons.push("PARENT_DECISION_CUTOFF_INVALID");
  if(!time(resetReceipt?.resetKnownAt)) reasons.push("RESET_KNOWN_AT_INVALID");
  if(time(parent?.decisionCutoffAt)&&time(resetReceipt?.resetKnownAt)&&Date.parse(resetReceipt.resetKnownAt)>Date.parse(parent.decisionCutoffAt)){
    reasons.push("RESET_KNOWN_AFTER_PARENT_CUTOFF");
  }

  if(day(resetDate)&&sessions.length===20&&sessions.some(x=>x<=resetDate)) reasons.push("MIXED_PRE_POST_RESET_WINDOW");

  const eligible=reasons.length===0;
  return {
    schemaVersion:D03_BOLLINGER_POST_RESET_PARENT_SHORTCUT_VERSION_V0_1,
    shortcutEligible:eligible,
    interpretation:eligible?"PRE_RESET_HISTORY_ZERO_DIRECT_FORMULA_INFLUENCE":"NO_SHORTCUT",
    exactSessionCount:sessions.length,
    lastCertifiedPriceResetDate:day(resetDate)?resetDate:null,
    reasons:[...new Set(reasons)],
    maturityPromotionAuthorized:false,
  };
}
