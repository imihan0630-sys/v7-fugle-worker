// D01 DL-135~137 PIT security-class / eligibility-boundary oracle v0.1

const ELIGIBLE_CLASS="ORDINARY_COMMON_EQUITY";
const CLASS_STATES=new Set([
  "ORDINARY_COMMON_EQUITY",
  "PREFERRED_EQUITY",
  "FUND_OR_ETF",
  "ETN_OR_NOTE",
  "WARRANT_OR_RIGHT",
  "DEPOSITARY_OR_LINKED_INSTRUMENT",
  "OTHER_EQUITY_CLASS",
  "SECURITY_CLASS_UNKNOWN"
]);

export function classifySecurityClassEligibility(r={}){
  if(!r.normalizedSecurityClass||!CLASS_STATES.has(r.normalizedSecurityClass))
    return {status:"SECURITY_CLASS_UNKNOWN"};
  if(r.coverageCompleteForDate!==true)return {status:"SECURITY_CLASS_UNKNOWN"};
  if(!r.firstObservableAt||!r.predictorFreezeAt)return {status:"SECURITY_CLASS_CLOCK_UNKNOWN"};
  if(r.firstObservableAt>r.predictorFreezeAt)return {status:"SECURITY_CLASS_LOOKAHEAD"};
  return {
    status:r.normalizedSecurityClass===ELIGIBLE_CLASS
      ?"CLASS_ELIGIBLE_ORDINARY_COMMON"
      :"CLASS_INELIGIBLE_BY_DESIGN"
  };
}

export function validateNoCurrentClassBackfill({historicalClassKnown,currentClass,historicalClass,inferredFromCurrent}={}){
  if(historicalClassKnown!==true && inferredFromCurrent===true)
    return {status:"CURRENT_CLASS_BACKFILL_PROHIBITED"};
  if(historicalClassKnown===true && historicalClass)
    return {status:"HISTORICAL_CLASS_EXPLICIT"};
  return {status:"HISTORICAL_CLASS_UNKNOWN"};
}

export function classifyClassTransition({securityIdentityBefore,securityIdentityAfter,classBefore,classAfter,boundaryKnown}={}){
  if(!securityIdentityBefore||!securityIdentityAfter)return {status:"IDENTITY_BLOCKED"};
  if(securityIdentityBefore!==securityIdentityAfter)return {status:"SECURITY_IDENTITY_TRANSITION"};
  if(boundaryKnown!==true && classBefore!==classAfter)return {status:"CLASS_BOUNDARY_AMBIGUOUS_BLOCKED"};
  if(classBefore===classAfter)return {status:"NO_CLASS_ELIGIBILITY_CHANGE"};
  const wasEligible=classBefore===ELIGIBLE_CLASS;
  const nowEligible=classAfter===ELIGIBLE_CLASS;
  if(wasEligible&&!nowEligible)return {status:"EXIT_FROM_ORDINARY_COMMON"};
  if(!wasEligible&&nowEligible)return {status:"ENTRY_INTO_ORDINARY_COMMON"};
  return {status:"INELIGIBLE_CLASS_TO_INELIGIBLE_CLASS"};
}

export function validateEligibleHistoryWindow({securityIdentityStable,classStates=[],moduleId}={}){
  if(securityIdentityStable!==true)return {status:"IDENTITY_BLOCKED"};
  if(!Array.isArray(classStates)||!classStates.length)return {status:"CLASS_HISTORY_MISSING"};
  if(classStates.some(x=>x==="SECURITY_CLASS_UNKNOWN"))return {status:"CLASS_UNKNOWN_BLOCKED"};
  if(classStates.some(x=>x!==ELIGIBLE_CLASS))return {status:"ELIGIBILITY_INTERVAL_CROSSED"};
  return {status:"ELIGIBLE_HISTORY_WINDOW_VALID",moduleId};
}

export function classifyReentry({sameSecurity,priorEligibleIntervalEnded,currentClass,currentEligibleHistoryCount,moduleMinimumHistory}={}){
  if(sameSecurity!==true)return {status:"NEW_SECURITY_IDENTITY_RULES_APPLY"};
  if(priorEligibleIntervalEnded!==true)return {status:"NO_REENTRY_BOUNDARY"};
  if(currentClass!==ELIGIBLE_CLASS)return {status:"CURRENTLY_INELIGIBLE"};
  if(!Number.isInteger(currentEligibleHistoryCount)||!Number.isInteger(moduleMinimumHistory))
    return {status:"REENTRY_HISTORY_UNKNOWN"};
  return {
    status:currentEligibleHistoryCount>=moduleMinimumHistory
      ?"REENTRY_MODULE_HISTORY_READY"
      :"REENTRY_HISTORY_TOO_SHORT_BY_DESIGN"
  };
}

export function validateD0109GapAcrossClassBoundary({sameSecurity,sameEligibilityInterval,priorEligibleClose,currentOpen}={}){
  if(sameSecurity!==true)return {status:"IDENTITY_TRANSITION_NOT_ORDINARY_GAP"};
  if(sameEligibilityInterval!==true)return {status:"CLASS_TRANSITION_REFERENCE_DISTANCE"};
  if(!Number.isFinite(priorEligibleClose)||!Number.isFinite(currentOpen))
    return {status:"GAP_INPUT_BLOCKED"};
  return {status:"ORDINARY_GAP_GEOMETRY_ELIGIBLE"};
}

export function validateEligibilityMask({rawDates=[],eligibleDates=[],eligibilityMaskHash}={}){
  if(!Array.isArray(rawDates)||!Array.isArray(eligibleDates)||!eligibilityMaskHash)
    return {status:"ELIGIBILITY_MASK_INCOMPLETE"};
  const rawSet=new Set(rawDates);
  if(eligibleDates.some(d=>!rawSet.has(d)))return {status:"ELIGIBILITY_MASK_REFERENCES_NONRAW_DATE"};
  if(new Set(eligibleDates).size!==eligibleDates.length)return {status:"ELIGIBILITY_MASK_DUPLICATE_DATE"};
  return {status:"ELIGIBILITY_MASK_VALID",rawCount:rawDates.length,eligibleCount:eligibleDates.length};
}

export function validateClassDenominatorRow(r={}){
  const allowed=new Set([
    "CLASS_ELIGIBLE_HISTORY_READY",
    "CLASS_ELIGIBLE_HISTORY_TOO_SHORT",
    "CLASS_INELIGIBLE_BY_DESIGN",
    "CLASS_UNKNOWN_BLOCKED",
    "CLASS_TRANSITION_BOUNDARY_BLOCKED",
    "IDENTITY_BLOCKED",
    "DATA_MISSING_BLOCKED",
    "MODULE_HISTORY_READY_NO_STRUCTURE",
    "MODULE_HISTORY_READY_STRUCTURE_EMITTED",
    "R7_DATA_BLOCKED"
  ]);
  if(!r.securityIdentity||!r.denominatorState)return {status:"CLASS_DENOMINATOR_IDENTITY_INCOMPLETE"};
  if(!allowed.has(r.denominatorState))return {status:"CLASS_DENOMINATOR_STATE_INVALID"};
  return {status:"CLASS_DENOMINATOR_ROW_VALID"};
}

export function validateClassParentChildSupport(parent={},child={}){
  const fields=[
    "securityIdentity","membershipIntervalId","classReceiptId","classReceiptVersion",
    "classEligibilityIntervalId","eligibilityMaskHash","listingAgeEligibleSessions",
    "warmupState","exactSessionHash","sourceHistoryHash","predictorFreezeAt",
    "blockedRowPolicyId"
  ];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  return {status:drift.length?"PARENT_CHILD_CLASS_SUPPORT_MISMATCH":"PARENT_CHILD_CLASS_SUPPORT_VALID",drift};
}

export function validateClassRevisionReplay({oldEligibilityMaskHash,newEligibilityMaskHash,parentReplayed,childReplayed,finalHoldoutBefore,finalHoldoutAfter}={}){
  const changed=oldEligibilityMaskHash!==newEligibilityMaskHash;
  if(changed&&(parentReplayed!==true||childReplayed!==true))
    return {status:"CLASS_REVISION_REPLAY_INCOMPLETE"};
  if(finalHoldoutBefore==="CONSUMED"&&finalHoldoutAfter==="UNTOUCHED")
    return {status:"FINAL_HOLDOUT_RESET_PROHIBITED"};
  return {status:changed?"CLASS_REVISION_REPLAY_VALID":"NO_CLASS_MASK_CHANGE"};
}
