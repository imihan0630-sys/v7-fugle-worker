import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { deriveAfterMarketScheduleEvidenceV0_1 as derive }
  from "../../research/d02_pve269_schedule_evidence_fusion_v0_1.mjs";

const ev=JSON.parse(readFileSync(new URL(
  "../../research/SYSTEM1_ISSUE1024_CRON_SINK_FAILURE_TRIANGULATION_20261009_V0_1.json",
  import.meta.url,
),"utf8"));
assert.equal(ev.schemaVersion,"SYSTEM1_ISSUE1024_CRON_SINK_FAILURE_TRIANGULATION_V0_1");
assert.deepEqual(ev.runs.map(x=>x.key),["PVE251","PVE262","PVE266"]);
assert.equal(new Set(ev.runs.map(x=>x.runId)).size,3);
for(const s of ev.runs){
  assert.equal(s.jobConclusion,"success");
  assert.match(s.headSha,/^[a-f0-9]{40}$/);
  assert.match(s.artifactZipSha256,/^[a-f0-9]{64}$/);
  assert.ok(s.artifactId>0 && s.jobId>0 && s.runId>0);
  assert.equal(s.originalResult.readOnly,true);
  assert.equal(s.originalResult.mutationCount,0);
}
const [p251,p262,p266]=ev.runs.map(x=>x.originalResult);
assert.equal(p251.afterMarketRows,0);
assert.ok(p251.reasonCodes.includes("PRIMARY_23_35_READBACK_MISSING"));
assert.ok(p251.reasonCodes.includes("RECOVERY_23_55_READBACK_MISSING"));
assert.equal(p262.rawD1CronWindowRowCount,0);
assert.equal(p262.queryUtcWindowStart,"2026-10-07T15:20:00.000Z");
assert.equal(p262.queryUtcWindowEnd,"2026-10-07T16:10:00.000Z");
assert.equal(p262.latestPersistedCronRowId,4745);
assert.equal(p266.system2LogicalA1Bars,18460);
assert.equal(p266.system2LogicalManifests,1538);
assert.equal(p266.physicalRowsWrittenAttributedToSpecificWriter,null);
const e=ev.independentBusinessSideEffects;
const observed=derive({
  familyConfigured:true,
  cronRows:[],
  lastScanAttempt:e.attempt,
  leaseReceipts:e.recoveryLease,
});
assert.equal(observed.state,"INVOKED_EXECUTION_FAILED_D1_QUOTA");
assert.equal(observed.invocationProven,true);
assert.equal(observed.primaryAttemptSeen,true);
assert.equal(observed.recoveryLeaseSeen,true);
assert.equal(observed.successfulBusinessExecutionCount,0);
assert.equal(observed.scheduleFamilyPass,false);
assert.equal(observed.formalCoreChangeAuthorized,false);
assert.equal(ev.negativeEvidenceLogic.canConcludeCronNotInvoked,false);
assert.equal(ev.negativeEvidenceLogic.canConcludeBusinessPersistenceVerified,false);

// The missing-audit-only condition cannot be silently reclassified as no
// invocation when the independent attempt+lease shows physical invocation.
const leaseOnly=derive({
  familyConfigured:true,cronRows:[],leaseReceipts:e.recoveryLease,
});
assert.equal(leaseOnly.state,"INVOKED_AUDIT_ROW_UNAVAILABLE");
assert.equal(leaseOnly.invocationProven,true);
assert.equal(leaseOnly.successfulBusinessExecutionCount,0);
const absent=derive({familyConfigured:true,cronRows:[]});
assert.equal(absent.state,"UNOBSERVED");
assert.equal(absent.invocationProven,false);
const forgedRun=derive({
  familyConfigured:true,cronRows:[
    {taipeiClock:"23:35",status:"SUCCESS",skipped:0},
    {taipeiClock:"23:55",status:"SUCCESS",skipped:0},
  ],
});
assert.equal(forgedRun.state,"DUPLICATE_BUSINESS_EXECUTION");
assert.equal(forgedRun.scheduleFamilyPass,false);
// A single success cron row is schedule-only; it cannot backfill the
// independent D1 plan/report persisted readback or quota authorization.
const syntheticSingle=derive({
  familyConfigured:true,
  cronRows:[{taipeiClock:"23:35",status:"SUCCESS",skipped:0}],
});
assert.equal(syntheticSingle.state,"BUSINESS_EXECUTION_SUCCESS");
assert.equal(ev.negativeEvidenceLogic.canConcludeBusinessPersistenceVerified,false);
assert.equal(ev.remainingAcceptance.p04,
  "UNQUALIFIED_LATER_ORDINARY_SESSION_NORMAL_PERSISTENCE_ABSENT");
assert.equal(ev.remainingAcceptance.accountReadReserveRowsAuthorized,null);
assert.equal(ev.remainingAcceptance.accountWriteReserveRowsAuthorized,null);
assert.equal(ev.remainingAcceptance.independentlyAcceptedCorr003PhysicalGates,0);
assert.equal(ev.quotaAttribution.system2DbPhysicalRowsWrittenFromPVE264 +
  ev.quotaAttribution.system1V7DbPhysicalRowsWrittenFromPVE264,
  ev.quotaAttribution.accountPhysicalRowsWrittenFromPVE264);
assert.equal(ev.quotaAttribution.physicalRowsWrittenPer2355Or2335,null);
for(const [key,value] of Object.entries(ev.safety)){
  if(typeof value==="number")assert.equal(value,0,key);
  if(typeof value==="boolean")assert.equal(value,false,key);
}
console.log("S1_ISSUE1024_CRON_SINK_26_SOURCE_AND_FUSION_CHECKS_PASS_NO_QUOTA_OR_P04_AUTHORITY");
