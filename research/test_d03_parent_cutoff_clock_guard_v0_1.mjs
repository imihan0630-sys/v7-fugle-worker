import assert from "node:assert/strict";
import {
  assessRuntimeParentCutoffV0_1,
  assessTwoPointContinuityReconciliationV0_1,
} from "./d03_parent_cutoff_clock_guard_v0_1.mjs";

const missing=assessRuntimeParentCutoffV0_1({
  decisionAt:"2026-10-05T18:10:05+08:00",
});
assert.equal(missing.state,"BLOCKED");
assert.equal(missing.reason,"PARENT_DECISION_CUTOFF_NOT_PERSISTED");
assert.equal(missing.decisionAtMaySubstituteForCutoff,false);

const parent={
  decisionCutoffAt:"2026-10-05T18:10:00+08:00",
  decisionAt:"2026-10-05T18:10:05+08:00",
};
const basePre={
  capturedAt:"2026-10-05T18:05:00+08:00",
  queryIdentityHash:"Q1",
  versions:[
    {versionKey:"V1",sourceReportedAt:"2026-10-05T17:10:00+08:00"},
  ],
};
const basePost={
  capturedAt:"2026-10-05T18:20:00+08:00",
  queryIdentityHash:"Q1",
  boundedRevisionHistoryComplete:true,
  sourceReportedClockSemanticsCertified:true,
  versions:[
    {versionKey:"V1",sourceReportedAt:"2026-10-05T17:10:00+08:00"},
  ],
};

const ok=assessTwoPointContinuityReconciliationV0_1({parent,preSnapshot:basePre,postSnapshot:basePost});
assert.equal(ok.state,"ELIGIBLE");
assert.equal(ok.exactPublicLatencyCertificationRequired,false);
assert.equal(ok.globalKnownAtVersionClockCertificationClaimed,false);

const gap=assessTwoPointContinuityReconciliationV0_1({
  parent,
  preSnapshot:basePre,
  postSnapshot:{...basePost,versions:[
    ...basePost.versions,
    {versionKey:"V2",sourceReportedAt:"2026-10-05T18:07:00+08:00"},
  ]},
});
assert.equal(gap.state,"BLOCKED");
assert.equal(gap.reason,"REVISION_GAP_THROUGH_DECISION_CUTOFF");

const after=assessTwoPointContinuityReconciliationV0_1({
  parent,
  preSnapshot:basePre,
  postSnapshot:{...basePost,versions:[
    ...basePost.versions,
    {versionKey:"V3",sourceReportedAt:"2026-10-05T18:12:00+08:00"},
  ]},
});
assert.equal(after.state,"ELIGIBLE");

const incomplete=assessTwoPointContinuityReconciliationV0_1({
  parent,
  preSnapshot:basePre,
  postSnapshot:{...basePost,boundedRevisionHistoryComplete:false},
});
assert.equal(incomplete.state,"UNKNOWN");
assert.equal(incomplete.reason,"BOUNDED_REVISION_HISTORY_INCOMPLETE");

const latePre=assessTwoPointContinuityReconciliationV0_1({
  parent,
  preSnapshot:{...basePre,capturedAt:"2026-10-05T18:10:01+08:00"},
  postSnapshot:basePost,
});
assert.equal(latePre.state,"BLOCKED");
assert.equal(latePre.reason,"PRE_SNAPSHOT_AFTER_DECISION_CUTOFF");

const badFuture=assessTwoPointContinuityReconciliationV0_1({
  parent,
  preSnapshot:{...basePre,versions:[
    {versionKey:"V1",sourceReportedAt:"2026-10-05T18:06:00+08:00"},
  ]},
  postSnapshot:{...basePost,versions:[
    {versionKey:"V1",sourceReportedAt:"2026-10-05T18:06:00+08:00"},
  ]},
});
assert.equal(badFuture.state,"QA_FAIL");
assert.equal(badFuture.reason,"PRE_SNAPSHOT_CONTAINS_FUTURE_REPORTED_VERSION");

const counterexample={
  actualFormalDecisionCompletedAt:"2026-10-05T18:09:50+08:00",
  laterSourceCapture:"2026-10-05T18:10:00+08:00",
  c1DecisionAtStamp:"2026-10-05T18:10:05+08:00",
};
assert.ok(Date.parse(counterexample.laterSourceCapture)<=Date.parse(counterexample.c1DecisionAtStamp));
assert.ok(Date.parse(counterexample.laterSourceCapture)>Date.parse(counterexample.actualFormalDecisionCompletedAt));

console.log(JSON.stringify({
  status:"PASS",
  missingCutoff:missing,
  eligible:ok,
  gapBlocked:gap,
  postCutoffRevisionAllowed:after,
  incompleteCoverage:incomplete,
  latePreSnapshot:latePre,
  receiptStampCounterexample:counterexample,
},null,2));
