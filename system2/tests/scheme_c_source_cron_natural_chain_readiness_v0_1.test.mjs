import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {reconcileSchemeCSourceCronReadinessV0_1 as join}
 from '../runtime/scheme_c_source_cron_natural_chain_readiness_v0_1.mjs';
const REPO='imihan0630-sys/v7-fugle-worker';
const auditPath='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const sourcePath='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const childPath='.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml';
const deployedAt='2026-10-17T02:25:23Z',sha='a'.repeat(40);
const sign=async(obj,k)=>({...obj,[k]:await sha256Hex(obj)});
async function fixture({future=false,consumer=false,receipts=false}={}){
 const marketDate=future?'2026-10-19':'2026-10-16';
 const sourceCreated=future?'2026-10-19T12:17:00Z':'2026-10-16T16:42:40Z';
 const auditCreated=future?'2026-10-19T12:19:00Z':'2026-10-16T16:44:34Z';
 const audited=future?'2026-10-19T12:19:35Z':'2026-10-16T16:44:57Z';
 const auditUpdated=future?'2026-10-19T12:20:00Z':'2026-10-16T16:45:39Z';
 const sourceRun={id:38934081985,repository:{full_name:REPO},
  head_repository:{full_name:REPO},event:'schedule',head_branch:'main',
  head_sha:sha,path:sourcePath,status:'completed',conclusion:'success',
  created_at:sourceCreated};
 const auditRun={id:38934321405,repository:{full_name:REPO},
  head_repository:{full_name:REPO},event:'workflow_run',head_branch:'main',
  head_sha:sha,path:auditPath,status:'completed',conclusion:'success',
  created_at:auditCreated,updated_at:auditUpdated};
 const firstSchemeCCommit={sha:'f18c761ee4bc82eb32b27f0ac5a7523cfaaf9ed0',
  commit:{committer:{date:deployedAt}},
  files:[{filename:childPath,status:'added'}]};
 const sourceChain=await sign({
  schemaVersion:'S2_DATA_A1_NATIVE_CRON_SOURCE_AUDIT_CHAIN_V0_1',
  sourceRunId:sourceRun.id,independentAuditRunId:auditRun.id,
  marketDate,sourceRunEvent:'schedule',
  sourceRunHeadSha:sha,actualRunCreatedAtUtc:sourceCreated,
  originalAuditObservedAtUtc:audited,
  sourceScheduleEventIndependentlyVerified:true,
  originalSourceMarketPairsIndependentlyAudited:122,
  sameSourceReceiptHash:'b'.repeat(64),
  independentSourceAuditHash:'c'.repeat(64),
  sourceOriginalGithubEventHash:'d'.repeat(64),
  originalAuditChildRunVerified:true,
  originalTargetDecisionCutSourceReady:future,
  decisionCutUtc:marketDate+'T15:45:00.000Z',
  scheduleEnqueueDelayMinutes:future?2:267.667,
  completedDailySchemeCAutomaticConsumerCertified:false,
  sameDayStrategyPITCertified:false,selectedCount:null,
  zeroPickDay:null,frozenD1Written:false
 },'receiptHash');
 const f={sourceChain,sourceRun,auditRun,firstSchemeCCommit};
 if(consumer){
  f.consumerRun={id:40000000,repository:{full_name:REPO},
   head_repository:{full_name:REPO},
   path:childPath,name:'System2 Scheme C Daily Independent-Audit Preview Consumer (NO NEW CRON)',
   event:'workflow_run',head_branch:'main',status:'completed',
   conclusion:'success',created_at:future?'2026-10-19T12:21:00Z':'2026-10-16T16:47:00Z'};
  if(receipts){
   f.deliveryOrigin=await sign({
    schemaVersion:'S2_SCHEME_C_DELIVERY_ORIGIN_V0_1',
    status:'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED',
    marketDate,auditRunId:auditRun.id,
    consumerRunId:f.consumerRun.id,handoffReceiptHash:'e'.repeat(64),
    consumerTrigger:'workflow_run',naturalAuditChildEventObserved:true,
    sourceCollectorScheduledOriginIndependentlyVerified:null,
    completedDailyAutomaticSourceChainCertified:false
   },'deliveryOriginHash');
   f.deliveryAcceptance=await sign({
    schemaVersion:'S2_SCHEME_C_DAILY_DELIVERY_ACCEPTANCE_V0_1',
    status:'NATURAL_AUDIT_CHILD_ON_TIME_PREVIEW__SOURCE_CRON_UNVERIFIED',
    marketDate,auditRunId:auditRun.id,
    consumerRunId:f.consumerRun.id,
    handoffReceiptHash:f.deliveryOrigin.handoffReceiptHash,
    deliveryOriginHash:f.deliveryOrigin.deliveryOriginHash,
    originalSourceCronProven:false,
    fullDailyScheduledChainAccepted:false,pitA:false,pitB:false,
    observedByCut:true,cutAtUtc:sourceChain.decisionCutUtc,
    selectedCount:null,zeroPickDay:null,frozenD1Written:false
   },'acceptanceHash');
  }
 }
 return f;
}
test('historical actual 10/16 schedule and audit predate first main Scheme C workflow',async()=>{
 const r=await join(await fixture());
 assert.equal(r.mode,'PARENT_AUDIT_FINISHED_BEFORE_SCHEME_C_WORKFLOW_DEPLOYMENT');
 assert.equal(r.firstWorkflowDeployedAtUtc,deployedAt);
 assert.equal(r.upstreamAuditFinishedBeforeWorkflowDeployed,true);
 assert.equal(r.independentlyDataReconciledSourceCron,true);
 assert.equal(r.originalScheduleDelayMinutes,267.667);
 assert.equal(r.sourceOriginalCutReady,false);
 assert.equal(r.naturalConsumerReceiptReconciled,false);
 assert.equal(r.missingNaturalChildProven,false);
 const {readinessHash,...unsigned}=r;
 assert.equal(await sha256Hex(unsigned),readinessHash);
});
test('postdeployment genuine source/audit alone is NOT invented as a consumer',async()=>{
 const r=await join(await fixture({future:true}));
 assert.equal(r.mode,'PARENT_AFTER_DEPLOYMENT__NO_CHILD_EVIDENCE_SUPPLIED');
 assert.equal(r.naturalConsumerReceiptReconciled,false);
 assert.equal(r.newTradingDayFullP0Acceptance,false);
});
test('future GitHub workflow child metadata is distinct from verified delivery receipt',async()=>{
 const r=await join(await fixture({future:true,consumer:true}));
 assert.equal(r.mode,'NATURAL_CHILD_GITHUB_RUN_ONLY__ARTIFACT_CHAIN_PENDING');
 assert.equal(r.consumerRunId,40000000);
 assert.equal(r.naturalConsumerReceiptReconciled,false);
});
test('positive simulated on-time normal chain is still non-PIT, non-Frozen and not physical acceptance',async()=>{
 const r=await join(await fixture({future:true,consumer:true,receipts:true}));
 assert.equal(r.mode,'CRON_SOURCE_TO_NATURAL_NONPIT_DELIVERY_RECONCILED');
 assert.equal(r.naturalConsumerReceiptReconciled,true);
 assert.equal(r.sourceOriginalCutReady,true);
 assert.equal(r.newTradingDayFullP0Acceptance,false);
 assert.equal(r.pitA,false);
 assert.equal(r.pitB,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.providerGets,0);
 assert.equal(r.newCronCount,0);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.ordersAuthorized,false);
 assert.equal(r.pushAuthorized,false);
 assert.equal(r.system1FormalCoreChanged,false);
});
test('negative forged source GH event, audit id, run sha and source receipt hash',async()=>{
 const changes=[
  f=>{f.sourceRun.event='workflow_dispatch'},
  f=>{f.auditRun.id++},
  f=>{f.sourceRun.head_sha='0'.repeat(40)},
  f=>{f.sourceChain.sourceScheduleEventIndependentlyVerified=false},
  f=>{f.sourceChain.originalSourceMarketPairsIndependentlyAudited=121},
  f=>{f.sourceChain.originalTargetDecisionCutSourceReady=true},
  f=>{f.sourceChain.receiptHash='0'.repeat(64)}
 ];
 for(const change of changes){
  const f=await fixture();change(f);
  await assert.rejects(join(f),/S2_BUILD_SCHEME_C_CRON_READINESS_/);
 }
});
test('negative cannot invent deployment by edited date or non-added workflow',async()=>{
 for(const change of [
  f=>{f.firstSchemeCCommit.commit.committer.date='2026-10-16T12:00:00Z'},
  f=>{f.firstSchemeCCommit.sha='a'.repeat(40)},
  f=>{f.firstSchemeCCommit.files[0].status='modified'},
  f=>{f.firstSchemeCCommit.files[0].filename='another.yml'},
 ]){
  const f=await fixture();change(f);
  await assert.rejects(join(f),/S2_BUILD_SCHEME_C_CRON_READINESS_/);
 }
});
test('negative predeployment upstream cannot be paired with fabricated natural downstream',async()=>{
 const f=await fixture({consumer:true,receipts:true});
 await assert.rejects(join(f),/PREDEPLOYMENT_PARENT_CANNOT_BECOME_NATURAL_CHILD/);
});
test('negative future manual/PR consumers, different audit delivery, bad hash rejected',async()=>{
 const variants=[
  f=>{f.consumerRun.event='workflow_dispatch'},
  f=>{f.consumerRun.path='.github/workflows/wrong.yml'},
  f=>{f.deliveryOrigin.auditRunId++},
  f=>{f.deliveryAcceptance.observedByCut=false},
  f=>{f.deliveryAcceptance.acceptanceHash='1'.repeat(64)},
  f=>{f.deliveryOrigin.status='OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC'},
 ];
 for(const change of variants){
  const f=await fixture({future:true,consumer:true,receipts:true});change(f);
  await assert.rejects(join(f),/S2_BUILD_SCHEME_C_CRON_READINESS_/);
 }
});
