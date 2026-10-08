// D01 DL-135~137 security-class / issuer-event oracle v0.1

const ORDINARY_COMMON="ORDINARY_COMMON_EQUITY";

export function classifySecurityClassRelation(a={},b={}){
  if(!a.securityIdentity||!b.securityIdentity||!a.securityClass||!b.securityClass)
    return {status:"SECURITY_CLASS_IDENTITY_UNKNOWN"};
  if(a.securityIdentity===b.securityIdentity&&a.securityClass===b.securityClass)
    return {status:"SAME_SECURITY_SAME_CLASS"};
  if(a.issuerIdentity&&b.issuerIdentity&&a.issuerIdentity===b.issuerIdentity&&a.securityClass!==b.securityClass)
    return {status:"SAME_ISSUER_DIFFERENT_SECURITY_CLASS"};
  if(a.securityIdentity!==b.securityIdentity)
    return {status:"DIFFERENT_SECURITY"};
  return {status:"SECURITY_CLASS_IDENTITY_UNKNOWN"};
}

export function validateD01FirstWaveAdmission(r={}){
  if(r.securityClass===ORDINARY_COMMON&&r.domesticEquity===true)
    return {status:"D01_FIRST_WAVE_SECURITY_CLASS_ELIGIBLE"};
  if(r.explicitLaterModulePreregistered===true)
    return {status:"OUTSIDE_FIRST_WAVE_SEPARATE_MODULE_REQUIRED"};
  return {status:"NON_ORDINARY_SECURITY_CLASS_BLOCKED"};
}

export function classifyClassTransition(r={}){
  if(r.transitionClass==="SAME_SECURITY_CLASS_ADMINISTRATIVE_CHANGE"){
    if(r.identityProvenSame!==true)return {status:"CLASS_TRANSITION_IDENTITY_UNKNOWN"};
    if(r.priceSpaceComparable!==true&&r.priceTransformCertified!==true)
      return {status:"CLASS_TRANSITION_PRICE_SPACE_BLOCKED"};
    return {status:"CLASS_TRANSITION_CONTINUITY_ELIGIBLE"};
  }
  if(["DIFFERENT_CLASS_SUCCESSOR_SECURITY","CONVERSION_INTO_EXISTING_COMMON_SHARE","CONVERSION_INTO_NEW_COMMON_SHARE","MULTI_CONSIDERATION_TRANSITION"].includes(r.transitionClass))
    return {status:"CLASS_TRANSITION_BREAK"};
  return {status:"CLASS_TRANSITION_IDENTITY_UNKNOWN"};
}

export function validateCrossClassHistoryStitch(r={}){
  if(r.sourceSecurityClass!==r.targetSecurityClass && r.historyStitched===true)
    return {status:"CROSS_CLASS_HISTORY_STITCH_PROHIBITED"};
  if(r.sourceSecurityIdentity!==r.targetSecurityIdentity && r.historyStitched===true)
    return {status:"CROSS_SECURITY_HISTORY_STITCH_PROHIBITED"};
  return {status:"HISTORY_STITCH_POLICY_VALID"};
}

export function classifyIssuerEventDependency(a={},b={}){
  if(!a.issuerEventContextId||!b.issuerEventContextId)
    return {status:"ISSUER_EVENT_DEPENDENCY_UNKNOWN"};
  if(a.issuerEventContextId===b.issuerEventContextId){
    if(a.securityIdentity===b.securityIdentity)
      return {status:"SAME_EVENT_SAME_SECURITY_DEPENDENCY"};
    return {status:"SAME_ISSUER_EVENT_CROSS_SECURITY_DEPENDENCY"};
  }
  return {status:"DISTINCT_ISSUER_EVENT_CONTEXT"};
}

export function validateIssuerEventVote(r={}){
  if(r.securityObservationCount>1&&r.independentVoteCount===r.securityObservationCount&&r.sharedIssuerEvent===true)
    return {status:"ISSUER_EVENT_VOTE_MULTIPLICATION_PROHIBITED"};
  if(r.sharedIssuerEvent===true&&r.independentVoteCount===null)
    return {status:"DEPENDENCY_PRESERVED_NO_INDEPENDENCE_ASSUMPTION"};
  return {status:"ISSUER_EVENT_VOTE_POLICY_VALID"};
}

export function validateCrossSecurityParent(r={}){
  if(r.childSecurityIdentity!==r.parentSecurityIdentity)
    return {status:"CROSS_SECURITY_COMMON_PARENT_PROHIBITED"};
  if(r.childSecurityClass!==r.parentSecurityClass)
    return {status:"CROSS_CLASS_COMMON_PARENT_PROHIBITED"};
  return {status:"SECURITY_LOCAL_COMMON_PARENT_VALID"};
}

export function validateExistingTargetConversion(r={}){
  if(r.transitionClass!=="CONVERSION_INTO_EXISTING_COMMON_SHARE")
    return {status:"NOT_EXISTING_TARGET_CONVERSION"};
  if(r.sourceBarsInsertedIntoTargetHistory===true)
    return {status:"SOURCE_INSTRUMENT_BARS_IN_TARGET_HISTORY_PROHIBITED"};
  if(r.targetExistingHistoryPreserved!==true)
    return {status:"TARGET_EXISTING_HISTORY_NOT_PRESERVED"};
  return {status:"EXISTING_TARGET_CONVERSION_VALID"};
}

export function validateNewTargetConversion(r={}){
  if(r.transitionClass!=="CONVERSION_INTO_NEW_COMMON_SHARE")
    return {status:"NOT_NEW_TARGET_CONVERSION"};
  if(r.predecessorBarsBorrowed===true)
    return {status:"PREDECESSOR_NON_EQUITY_BARS_BORROW_PROHIBITED"};
  if(r.listingWarmupApplied!==true)
    return {status:"NEW_TARGET_LISTING_WARMUP_REQUIRED"};
  return {status:"NEW_TARGET_CONVERSION_VALID"};
}

export function validateMixedConsideration(r={}){
  if(r.transitionClass!=="MULTI_CONSIDERATION_TRANSITION")
    return {status:"NOT_MIXED_CONSIDERATION"};
  if(r.d01EconomicPayoffTransformBuilt===true)
    return {status:"D01_PAYOFF_TRANSFORM_OVERREACH"};
  return {status:"MIXED_CONSIDERATION_OUTSIDE_D01_PAYOFF_SCOPE"};
}
