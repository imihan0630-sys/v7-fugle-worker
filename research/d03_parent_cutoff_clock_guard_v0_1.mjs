export const D03_PARENT_CUTOFF_CLOCK_GUARD_VERSION = "0.1-RESEARCH";

function iso(value, field) {
  const t=Date.parse(String(value||""));
  if(!Number.isFinite(t)) throw new Error("INVALID_"+field);
  return new Date(t).toISOString();
}
function arr(v){ return Array.isArray(v)?v:[]; }
function key(row){ return String(row?.versionKey||"").trim(); }

export function assessRuntimeParentCutoffV0_1(parent={}) {
  const decisionAt=iso(parent.decisionAt,"decisionAt");
  if(!parent.decisionCutoffAt) {
    return Object.freeze({
      state:"BLOCKED",
      reason:"PARENT_DECISION_CUTOFF_NOT_PERSISTED",
      decisionAt,
      decisionCutoffAt:null,
      decisionAtMaySubstituteForCutoff:false,
    });
  }
  const cutoff=iso(parent.decisionCutoffAt,"decisionCutoffAt");
  if(Date.parse(cutoff)>Date.parse(decisionAt)) {
    return Object.freeze({
      state:"QA_FAIL",
      reason:"DECISION_CUTOFF_AFTER_RECEIPT_STAMP",
      decisionAt,
      decisionCutoffAt:cutoff,
      decisionAtMaySubstituteForCutoff:false,
    });
  }
  return Object.freeze({
    state:"READY",
    reason:"EXPLICIT_DECISION_CUTOFF_PERSISTED",
    decisionAt,
    decisionCutoffAt:cutoff,
    decisionAtMaySubstituteForCutoff:false,
  });
}

export function assessTwoPointContinuityReconciliationV0_1({
  parent,
  preSnapshot,
  postSnapshot,
}={}) {
  const parentGate=assessRuntimeParentCutoffV0_1(parent);
  if(parentGate.state!=="READY") return Object.freeze({...parentGate,eligibility:"NO_GO"});

  const cutoff=parentGate.decisionCutoffAt;
  const decisionAt=parentGate.decisionAt;
  const preCapturedAt=iso(preSnapshot?.capturedAt,"preSnapshot.capturedAt");
  const postCapturedAt=iso(postSnapshot?.capturedAt,"postSnapshot.capturedAt");

  if(Date.parse(preCapturedAt)>Date.parse(cutoff)) {
    return Object.freeze({
      state:"BLOCKED",
      reason:"PRE_SNAPSHOT_AFTER_DECISION_CUTOFF",
      eligibility:"NO_GO",
      decisionCutoffAt:cutoff,
      preCapturedAt,
    });
  }
  if(Date.parse(postCapturedAt)<=Date.parse(decisionAt)) {
    return Object.freeze({
      state:"BLOCKED",
      reason:"POST_RECONCILIATION_NOT_POST_DECISION",
      eligibility:"NO_GO",
      decisionAt,
      postCapturedAt,
    });
  }
  if(preSnapshot?.queryIdentityHash!==postSnapshot?.queryIdentityHash) {
    return Object.freeze({
      state:"BLOCKED",
      reason:"QUERY_IDENTITY_MISMATCH",
      eligibility:"NO_GO",
    });
  }
  if(postSnapshot?.boundedRevisionHistoryComplete!==true) {
    return Object.freeze({
      state:"UNKNOWN",
      reason:"BOUNDED_REVISION_HISTORY_INCOMPLETE",
      eligibility:"NO_GO",
    });
  }
  if(postSnapshot?.sourceReportedClockSemanticsCertified!==true) {
    return Object.freeze({
      state:"UNKNOWN",
      reason:"SOURCE_REPORTED_CLOCK_SEMANTICS_NOT_CERTIFIED",
      eligibility:"NO_GO",
    });
  }

  const preRows=arr(preSnapshot?.versions);
  const postRows=arr(postSnapshot?.versions);
  const preKeys=new Set(preRows.map(key).filter(Boolean));
  const postKeys=new Set(postRows.map(key).filter(Boolean));
  if(preKeys.size!==preRows.length || postKeys.size!==postRows.length) {
    return Object.freeze({state:"QA_FAIL",reason:"DUPLICATE_OR_MISSING_VERSION_KEY",eligibility:"NO_GO"});
  }

  for(const row of preRows) {
    const reported=iso(row.sourceReportedAt,"pre.sourceReportedAt");
    if(Date.parse(reported)>Date.parse(preCapturedAt)) {
      return Object.freeze({
        state:"QA_FAIL",
        reason:"PRE_SNAPSHOT_CONTAINS_FUTURE_REPORTED_VERSION",
        versionKey:key(row),
        eligibility:"NO_GO",
      });
    }
    if(!postKeys.has(key(row))) {
      return Object.freeze({
        state:"BLOCKED",
        reason:"IMMUTABLE_VERSION_DISAPPEARED_POST_RECONCILIATION",
        versionKey:key(row),
        eligibility:"NO_GO",
      });
    }
  }

  const gaps=[];
  for(const row of postRows) {
    const reported=iso(row.sourceReportedAt,"post.sourceReportedAt");
    if(Date.parse(reported)<=Date.parse(cutoff) && !preKeys.has(key(row))) {
      gaps.push({versionKey:key(row),sourceReportedAt:reported});
    }
  }
  if(gaps.length) {
    return Object.freeze({
      state:"BLOCKED",
      reason:"REVISION_GAP_THROUGH_DECISION_CUTOFF",
      eligibility:"NO_GO",
      gapCount:gaps.length,
      gaps:Object.freeze(gaps),
    });
  }

  return Object.freeze({
    state:"ELIGIBLE",
    reason:"PROSPECTIVE_PRE_SNAPSHOT_PLUS_POST_DECISION_NO_GAP",
    eligibility:"PARENT_SPECIFIC_PIT_ELIGIBLE",
    decisionCutoffAt:cutoff,
    decisionAt,
    preCapturedAt,
    postCapturedAt,
    exactPublicLatencyCertificationRequired:false,
    globalKnownAtVersionClockCertificationClaimed:false,
  });
}
