// D01 DL-126~128 listing warmup / relisting / listing-age oracle v0.1

const WARMUP_STATES=new Set([
  "FIRST_ELIGIBLE_SESSION",
  "WARMUP_IN_PROGRESS",
  "HISTORY_TOO_SHORT_BY_DESIGN",
  "MODULE_MINIMUM_HISTORY_READY",
  "FULL_PREREGISTERED_WINDOW_READY",
  "DATA_MISSING_BLOCKED",
  "IDENTITY_BLOCKED"
]);

export function classifyListingWarmup(r={}){
  if(r.identityBlocked===true)return {status:"IDENTITY_BLOCKED"};
  if(r.dataMissing===true)return {status:"DATA_MISSING_BLOCKED"};
  if(!Number.isInteger(r.listingAgeEligibleSessions)||r.listingAgeEligibleSessions<0)
    return {status:"WARMUP_STATE_UNKNOWN"};
  if(r.listingAgeEligibleSessions===1)return {status:"FIRST_ELIGIBLE_SESSION"};
  if(!Number.isInteger(r.moduleMinimumHistoryRequired)||r.moduleMinimumHistoryRequired<=0)
    return {status:"WARMUP_STATE_UNKNOWN"};
  if(r.listingAgeEligibleSessions<r.moduleMinimumHistoryRequired)
    return {status:"HISTORY_TOO_SHORT_BY_DESIGN"};
  if(r.fullPreregisteredWindowReady===true)
    return {status:"FULL_PREREGISTERED_WINDOW_READY"};
  return {status:"MODULE_MINIMUM_HISTORY_READY"};
}

export function validateListingDayModule(moduleId,r={}){
  if(r.securityTransitionClass==="SUCCESSOR_SECURITY_INITIAL_LISTING"||r.securityTransitionClass==="NEW_SECURITY_INITIAL_LISTING"){
    if(moduleId==="D01-02")
      return {status:r.completedFirstBar===true?"FIRST_BAR_MORPHOLOGY_ELIGIBLE":"FIRST_BAR_NOT_YET_OBSERVABLE"};
    if(moduleId==="D01-03")
      return {status:r.borrowedPredecessorBars===true?"PREDECESSOR_BAR_BORROW_PROHIBITED":"SEQUENCE_WAIT_FOR_SAME_SECURITY_HISTORY"};
    if(moduleId==="D01-07")
      return {status:r.borrowedPredecessorAnchors===true?"PREDECESSOR_ANCHOR_BORROW_PROHIBITED":"BASE_WAIT_FOR_SAME_SECURITY_HISTORY"};
    if(moduleId==="D01-09")
      return {status:r.usedListingReferenceAsPriorClose===true?"LISTING_REFERENCE_NOT_PRIOR_CLOSE":"ORDINARY_GAP_NOT_EVALUABLE_LISTING_DAY"};
  }
  if(r.securityTransitionClass==="SAME_SECURITY_TRANSFER_LISTING"){
    return {status:r.dl123Pass===true?"SAME_SECURITY_TRANSFER_HISTORY_ELIGIBLE":"TRANSFER_HISTORY_BLOCKED"};
  }
  return {status:"LISTING_TRANSITION_UNKNOWN"};
}

export function classifyRelistingReentry(r={}){
  if(r.identityRelation==="SUCCESSOR_SECURITY")return {status:"SUCCESSOR_SECURITY_NEW_IDENTITY"};
  if(r.identityProvenSame!==true)return {status:"IDENTITY_UNKNOWN_BLOCKED"};
  if(r.dataReady!==true)return {status:"DATA_BLOCKED"};
  if(r.longAbsence===true){
    if(r.reconfirmed===true)return {status:"SAME_SECURITY_REENTRY_RECONFIRMED"};
    if(r.breached===true)return {status:"SAME_SECURITY_REENTRY_BREACHED"};
    return {status:"SAME_SECURITY_LONG_ABSENCE_STALE_ANCHOR"};
  }
  return {status:"SAME_SECURITY_SHORT_INTERRUPTION"};
}

export function validateReentryClock(r={}){
  if(r.firstReentryPrintBackdatedConfirmation===true)
    return {status:"FIRST_REENTRY_PRINT_BACKDATE_PROHIBITED"};
  if(r.reconfirmed===true){
    if(!r.reconfirmationObservableAt)return {status:"RECONFIRMATION_CLOCK_MISSING"};
    if(r.oldReceiptMutated===true)return {status:"OLD_RECEIPT_MUTATION_PROHIBITED"};
    return {status:"RECONFIRMATION_CLOCK_VALID"};
  }
  return {status:"NO_RECONFIRMATION_YET"};
}

export function validateListingAgeSupport(parent={},child={}){
  const fields=["securityIdentity","warmupState","moduleHistoryReady","blockedRowPolicyId","identityTransitionClass"];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  if(drift.length)return {status:"LISTING_AGE_SUPPORT_MISMATCH",drift};
  if(parent.listingAgeEligibleSessions!==child.listingAgeEligibleSessions)
    return {status:"LISTING_AGE_SUPPORT_MISMATCH",drift:["listingAgeEligibleSessions"]};
  return {status:"LISTING_AGE_SUPPORT_VALID",drift:[]};
}

export function validateHistoryDenominator(r={}){
  const allowed=new Set([
    "HISTORY_TOO_SHORT_BY_DESIGN",
    "MODULE_HISTORY_READY_NO_STRUCTURE",
    "MODULE_HISTORY_READY_STRUCTURE_EMITTED",
    "DATA_MISSING_BLOCKED",
    "IDENTITY_BLOCKED"
  ]);
  if(!allowed.has(r.state))return {status:"HISTORY_DENOMINATOR_STATE_INVALID"};
  if(!r.securityIdentity||!Number.isInteger(r.listingAgeEligibleSessions)||r.listingAgeEligibleSessions<0)
    return {status:"HISTORY_DENOMINATOR_IDENTITY_INCOMPLETE"};
  return {status:"HISTORY_DENOMINATOR_ROW_VALID"};
}

export function aggregateHistoryDenominator(rows=[]){
  const counts={
    HISTORY_TOO_SHORT_BY_DESIGN:0,
    MODULE_HISTORY_READY_NO_STRUCTURE:0,
    MODULE_HISTORY_READY_STRUCTURE_EMITTED:0,
    DATA_MISSING_BLOCKED:0,
    IDENTITY_BLOCKED:0
  };
  for(const r of rows){
    if(r.state in counts)counts[r.state]++;
  }
  return {status:"HISTORY_DENOMINATOR_ACCOUNTED",total:rows.length,counts};
}
