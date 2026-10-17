// DATA_LANE / Issue #1068 — immutable observed-three-run diagnostic only.
// These tests NEVER claim a source was first officially published late:
// they prove that THESE THREE captured workflow runs began after a frozen
// research cut, even when each original source audit eventually passed 122/122.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const filepath='system2/migration/evidence/S2_DATA_ISSUE1068_A1_REAL_THREE_CRON_TEMPORAL_FENCE_20261017_V0_1.json';
const original=JSON.parse(readFileSync(filepath,'utf8'));
const HEX=/^[a-f0-9]{64}$/;
const ISO=/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$/;
const expectedIds=[38934081985,38951859359,38955629508];
const expectedAuditHashes=[
 'e5c4a283ad25a9a5eea30ebcb0a8ffb0f9c94151c0f94602fe16447db117e84b',
 'ba6e38a45fcb40a6c1b8737b89508e9ae177f6503f58e8bc37fd05d4d2eee906',
 '867ad35497ecc0034622bef2c38e77a8ab2a0342b401761bb6fafc7b7829d735'
];
function assessThreeObservedSourceRuns(x){
 assert.equal(x.schemaVersion,'S2_DATA_ISSUE1068_A1_REAL_THREE_CRON_TEMPORAL_FENCE_V0_1');
 assert.equal(x.scope,'ONLY_THE_THREE_IDENTIFIED_SCHEDULED_SOURCE_RUNS_FOR_T_2026_10_16');
 assert.equal(x.marketDate,'2026-10-16');
 assert.equal(x.decisionCutUtc,'2026-10-16T15:45:00.000Z');
 assert.equal(x.sourceWorkflowPath,'.github/workflows/system2-shared-official-a1-incremental-readonly.yml');
 assert.equal(x.readbackClass,'ACTUAL_GITHUB_RUN_JOB_ARTIFACT_AND_AUDIT_LOG_METADATA_NOT_RAW_PROVIDER_REHASH_IN_THIS_RECEIPT');
 assert.equal(x.sourceRuns.length,3);
 const cut=Date.parse(x.decisionCutUtc), ids=new Set(),arts=new Set(),audits=new Set();
 let full=0,before=0,previousNominal=0,previousActual=0;
 for(const [i,s] of x.sourceRuns.entries()){
  assert.equal(s.runId,expectedIds[i],'exact original GitHub run provenance must stay pinned');
  assert.equal(s.independentSourceAuditHash,expectedAuditHashes[i]);
  for(const key of ['nominalUtc','actualRunCreatedAtUtc']) {
   assert.match(s[key],ISO);
   assert.ok(Number.isFinite(Date.parse(s[key])));
  }
  const nominal=Date.parse(s.nominalUtc),actual=Date.parse(s.actualRunCreatedAtUtc);
  assert.ok(nominal>previousNominal && actual>previousActual);
  assert.ok(actual>=nominal,'actual source run cannot precede its inferred schedule');
  assert.ok(Math.abs((actual-nominal)/60000-s.inferredEnqueueDelayMinutes)<.001);
  assert.ok(Number.isSafeInteger(s.runId)&&s.runId>0);
  assert.ok(Number.isSafeInteger(s.jobId)&&s.jobId>0);
  assert.ok(Number.isSafeInteger(s.sourceArtifactId)&&s.sourceArtifactId>0);
  assert.ok(Number.isSafeInteger(s.independentSourceAuditRunId)&&s.independentSourceAuditRunId>0);
  assert.ok(Number.isSafeInteger(s.independentSourceAuditJobId)&&s.independentSourceAuditJobId>0);
  assert.ok(Number.isSafeInteger(s.independentSourceAuditArtifactId)&&s.independentSourceAuditArtifactId>0);
  assert.match(s.independentSourceAuditHash,HEX);
  assert.match(s.dualSourceScheduleReceiptHash,HEX);
  assert.equal(s.sourcePairsAudited,122);
  assert.ok(!ids.has(s.runId) && !arts.has(s.sourceArtifactId) && !audits.has(s.independentSourceAuditRunId));
  ids.add(s.runId); arts.add(s.sourceArtifactId);audits.add(s.independentSourceAuditRunId);
  full+=Number(s.sourcePairsAudited===122);
  before+=Number(actual<=cut);
  previousNominal=nominal;previousActual=actual;
 }
 assert.equal(x.observationSummary.totalObservedScheduledRuns,3);
 assert.equal(x.observationSummary.auditedSourceRuns,3);
 assert.equal(x.observationSummary.observedCompleteSourceRuns,full);
 assert.equal(x.observationSummary.completeSourceRunsCreatedByDecisionCut,before);
 assert.equal(before,0,'not one of the archived three runs began by T 23:45');
 assert.equal(x.observationSummary.sourceStatusForTheseRuns,'LATE_SOURCE');
 assert.equal(x.observationSummary.latestDecisionClockStatus,'NO_PRE_CUT_FULL_122_SOURCE_CAPTURE_IN_THIS_THREE_RUN_COHORT');
 assert.equal(x.observationSummary.claimNoOtherPrecutSourcesExist,false);
 assert.equal(x.observationSummary.historicalOriginalPublisherFirstKnownAtCertified,false);
 assert.equal(x.observationSummary.fullMarketOrdinaryShareCount,null);
 for(const key of ['strategyFactorPITCertified','frozenD1Written','shadowAuthorized','noEventAuthoritativeScopeCertified'])
  assert.equal(x.observationSummary[key],false);
 assert.equal(x.observationSummary.selectedCount,null);
 assert.equal(x.observationSummary.zeroPickDay,null);
 assert.equal(x.observationSummary.sourceDataCannotBeRetroactivelyBackdated,true);
 assert.equal(x.cloudflareD1Reads,0);assert.equal(x.cloudflareD1Writes,0);
 assert.equal(x.cloudflareR2Operations,0);assert.equal(x.newOfficialProviderGets,0);
 assert.equal(x.system1FormalChanged,false);
 return {sourceIntegrityAcceptedInTheseRuns:full,runCreatedByDecisionCut:before};
}
test('real 2026-10-16 three-run A1 GitHub/AUDIT physical metadata is complete but AFTER T23:45',()=>{
 assert.deepEqual(assessThreeObservedSourceRuns(original),
  {sourceIntegrityAcceptedInTheseRuns:3,runCreatedByDecisionCut:0});
});
test('cutoff backdating, fake audit, missing 122 and inflated full-market status all fail closed',()=>{
 const modifications=[
  x=>{x.sourceRuns[0].actualRunCreatedAtUtc='2026-10-16T12:15:00.000Z';},
  x=>{x.sourceRuns[1].independentSourceAuditHash='0'.repeat(64);},
  x=>{x.sourceRuns[2].sourcePairsAudited=121;},
  x=>{x.sourceRuns[0].runId=123;},
  x=>{x.sourceRuns[1].sourceArtifactId=x.sourceRuns[0].sourceArtifactId;},
  x=>{x.observationSummary.completeSourceRunsCreatedByDecisionCut=1;},
  x=>{x.observationSummary.claimNoOtherPrecutSourcesExist=true;},
  x=>{x.observationSummary.selectedCount=0;},
  x=>{x.observationSummary.noEventAuthoritativeScopeCertified=true;},
  x=>{x.observationSummary.fullMarketOrdinaryShareCount=1972;},
  x=>{x.observationSummary.frozenD1Written=true;},
  x=>{x.decisionCutUtc='2026-10-17T04:45:00.000Z';},
 ];
 for(const alter of modifications){
  const x=structuredClone(original); alter(x);
  assert.throws(()=>assessThreeObservedSourceRuns(x));
 }
});
