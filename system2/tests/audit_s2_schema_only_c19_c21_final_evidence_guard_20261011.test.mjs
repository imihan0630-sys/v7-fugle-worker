// AUDIT_LANE CI guard of immutable, independently inspected physical GitHub
// metadata evidence. This test does NOT call Cloudflare, execute APPLY_ONCE,
// or replace independent ZIP-byte inspection already done by AUDIT_LANE.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const ev=JSON.parse(readFileSync(
 new URL("../migration/evidence/S2_C19_C21_SCHEMA_ONLY_INDEPENDENT_FINAL_ACCEPTANCE_20261011_V0_1.json",import.meta.url),"utf8"));
assert.equal(ev.finalDisposition,"PASS_CLOUDFLARE_DESTINATION_SCHEMA_ONLY_PHYSICAL_STAGE");
assert.equal(ev.c19.status,"PASS_RETAINED_GITHUB_FULL_PERIOD");
const h=ev.c19.githubRunCensus;
assert.deepEqual(h.pages,[1,2,3,4]);
assert.deepEqual(h.perPageResultLengths,[100,100,51,0]);
assert.equal(h.reportedCount,251);
assert.equal(h.allRunIds.length,h.reportedCount);
assert.equal(new Set(h.allRunIds).size,h.allRunIds.length);
assert.equal(h.originalWorkflowRuns.length,2);
const v=h.originalWorkflowRuns.find(x=>x.id===38068559602),a=h.originalWorkflowRuns.find(x=>x.id===38069750915);
assert(v&&a);
assert.equal(v.attempt,1);
assert.equal(a.attempt,1);
assert.equal(a.event,"workflow_dispatch");
assert.equal(a.conclusion,"success");
assert.equal(ev.c19.otherRunsOfOriginalWorkflow,0);
assert.equal(ev.c19.deletedOrInaccessibleHistoricRunsExcludedFromClaim,true);
assert.equal(ev.c21.status,"PASS_PRE_POST_ACCOUNT_RESOURCE_METADATA");
assert.equal(ev.c21.realOwnerRun.id,38105177481);
assert.equal(ev.c21.realOwnerRun.jobId,114369058630);
assert.equal(ev.c21.realArtifacts.length,3);
assert.deepEqual(ev.c21.realArtifacts.map(x=>x.id).sort(),[11689306381,11689356218,11689525935].sort());
for(const x of [...ev.c21.realArtifacts,ev.c21.preApply]){
 assert.match(x.zipSha256,/^[a-f0-9]{64}$/);
}
assert.equal(ev.c21.source.sourcePreAndPostExactSansVerifiedAt,true);
assert.equal(ev.c21.source.stableNormalizedSourceSnapshotSha256,"28e2a7eef8f3e57381c8022e5fcac44f94722ff9308c79e00b24540269c0fa46");
assert.equal(ev.c21.source.workers.length,2);
assert.equal(ev.c21.source.kv.length,1);
assert.equal(ev.c21.source.r2Buckets.length,1);
assert.equal(ev.c21.source.cron.length,1);
assert.equal(ev.c21.source.d1.length,2);
assert(ev.c21.source.d1.every(d=>d.observedSizeBytesBefore===d.observedSizeBytesAfter));
const dst=ev.c21.destination;
assert.equal(dst.d1.length,1);
assert.equal(dst.d1[0].sizeBytesBefore,12288);
assert.equal(dst.d1[0].sizeBytesAfter,987136);
assert.equal(dst.workersBeforeAfter,0);
assert.equal(dst.cronBeforeAfter,0);
assert.equal(dst.kvBeforeAfter,0);
assert.equal(dst.r2.before,"NOT_ENTITLED");
assert.equal(dst.r2.after,"NOT_ENTITLED");
assert.equal(dst.r2.http,403);
assert.equal(dst.r2.cloudflareErrorCode,10042);
assert.equal(dst.r2.diagnosticStatus,"BLOCKED_SERVICE_READS");
assert.equal(ev.c21.bothAccountAuthPreflight,"D1_READ_PREFLIGHT_PASS");
assert.equal(ev.c21.sourceRowContentOrProductionRuntimeCertified,false);
const m=ev.strict25;
assert.equal(m.total,25);
assert.equal(m.pass,25);
assert.equal(m.fail,0);
assert.equal(m.blocked,0);
assert.equal(m.checks.length,25);
assert.equal(new Set(m.checks.map(x=>x.id)).size,25);
assert(m.checks.every(x=>x.status.startsWith("PASS_")));
assert.equal(ev.allSystem2MigrationComplete,false);
assert.equal(ev.limitations.sourceD1BackupProven,false);
assert.equal(ev.limitations.pitAvailableAtAndFrozenSnapshotsProven,false);
assert.equal(ev.limitations.historyTransferred,false);
assert.equal(ev.limitations.workerCronDeployedToNewAccount,false);
const negative=[
 ["invented_apply_run",f=>f.c19.githubRunCensus.originalWorkflowRuns.push({...a,id:123456789})],
 ["duplicate_history_id",f=>f.c19.githubRunCensus.allRunIds[0]=f.c19.githubRunCensus.allRunIds[1]],
 ["relabel_r2_entitled",f=>f.c21.destination.r2.after="READ_GRANTED"],
 ["invent_destination_worker",f=>f.c21.destination.workersBeforeAfter=1],
 ["claim_full_migration",f=>f.allSystem2MigrationComplete=true],
 ["premature_row_immutability",f=>f.c21.sourceRowContentOrProductionRuntimeCertified=true],
 ["drop_original_check",f=>f.strict25.checks.pop()],
];
function allow(e){
 return e.c19.githubRunCensus.originalWorkflowRuns.length===2
 &&new Set(e.c19.githubRunCensus.allRunIds).size===e.c19.githubRunCensus.reportedCount
 &&e.c21.destination.r2.after==="NOT_ENTITLED"
 &&e.c21.destination.workersBeforeAfter===0
 &&e.allSystem2MigrationComplete===false
 &&e.c21.sourceRowContentOrProductionRuntimeCertified===false
 &&e.strict25.checks.length===25;
}
assert.equal(allow(ev),true);
for(const [name,mutate] of negative){const f=structuredClone(ev);mutate(f);assert.equal(allow(f),false,name);}
console.log("S2_C19_C21_SCHEMA_ONLY_AUDIT_EVIDENCE_GUARD "+JSON.stringify({
 status:"PASS_GUARD_ONLY_NOT_NEW_PHYSICAL_EXECUTION",originalRuns:h.reportedCount,
 originalApplyOnceCount:1,originalAttempt:1,physicalSourceResourceSnapshotEqual:true,
 destinationR2ExcludedWithoutEntitlement:true,schemaOnlyGates:"25/25",
 adversarialNegativeRejections:negative.length,cloudflareCalls:0,
 fullMigrationCertified:false,sourcePitAndBackupStillPending:true
}));
