import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {assessSchemeCDailyDeliveryV0_1} from '../runtime/scheme_c_daily_delivery_acceptance_v0_1.mjs';
import {joinSchemeCNativeSourceAndDeliveryV0_1 as join}
 from '../runtime/scheme_c_native_source_delivery_join_v0_1.mjs';
const sign=async(base,key)=>({...base,[key]:await sha256Hex(base)});
const without=(o,k)=>Object.fromEntries(Object.entries(o).filter(([n])=>n!==k));
async function fixture({trigger='pull_request',sourceLate=true,previewLate=true}={}){
 const cut='2026-10-16T15:45:00.000Z';
 const auditAt=sourceLate?'2026-10-16T16:44:57.000Z':'2026-10-16T15:00:00.000Z';
 const created=sourceLate?'2026-10-16T16:42:40Z':'2026-10-16T14:45:00Z';
 const completed=sourceLate?'2026-10-16T16:44:32Z':'2026-10-16T14:50:00Z';
 const capture=sourceLate?'2026-10-16T16:44:22.393Z':'2026-10-16T14:49:59.000Z';
 const dataNativeCronAuditReceipt=await sign({
  schemaVersion:'S2_DATA_A1_NATIVE_CRON_SOURCE_AUDIT_CHAIN_V0_1',
  marketDate:'2026-10-16',decisionCutUtc:cut,
  sourceRunId:38934081985,sourceJobId:117085046435,
  independentAuditRunId:38934321405,
  sourceRunEvent:'schedule',sourceScheduleEventIndependentlyVerified:true,
  exactEventCron:'15 12 * * 1-5',
  actualRunCreatedAtUtc:created,actualSourceJobCompletedAtUtc:completed,
  scheduleEnqueueDelayMinutes:sourceLate?267.667:270,
  sourceOriginalGithubEventHash:'a'.repeat(64),
  sameSourceManifestSha256:'b'.repeat(64),
  sameSourceReceiptHash:'c'.repeat(64),
  originalSourceMarketPairsIndependentlyAudited:122,
  independentSourceAuditHash:'d'.repeat(64),
  originalAuditObservedAtUtc:auditAt,
  signedSeparateSourceScheduleReceiptHash:'e'.repeat(64),
  targetDayNativePairFirstObservedLatestUtc:capture,
  targetDayNativeSourceCapturedBeforeCut:!sourceLate,
  originalSourceJobFinishedBeforeCut:!sourceLate,
  originalIndependentSourceAuditFinishedBeforeCut:!sourceLate,
  originalTargetDecisionCutSourceReady:!sourceLate,
  originalAuditChildRunVerified:true,
  completedDailySchemeCAutomaticConsumerCertified:false,
  sameDayStrategyPITCertified:false,fullOrdinaryMarketDenominator:null,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  ordersAuthorized:false,pushAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreChanged:false
 },'receiptHash');
 const schemeCReportMarkdown='# Research-only report, not a strategy selection';
 const schemeCHandoff=await sign({
  schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
  marketDate:'2026-10-16',auditRunId:38934321405,
  state:'NON_PIT_SOURCE_OBSERVATION_READY',
  descriptiveSourceMatches:519,observedPreviewCount:30,
  pitACertificationGranted:false,pitBCertificationGranted:false,
  selectedCount:null,zeroPickDay:null,
  shadowAuthorized:false,realStrategyRankAuthorized:false,
  frozenD1Written:false,pushAuthorized:false,ordersAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreChanged:false
 },'receiptHash');
 const statuses={workflow_run:'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED',
  workflow_dispatch:'OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC',
  pull_request:'PR_HISTORICAL_PROOF_ONLY'};
 const schemeCOrigin=await sign({
  schemaVersion:'S2_SCHEME_C_DELIVERY_ORIGIN_V0_1',
  marketDate:schemeCHandoff.marketDate,
  status:statuses[trigger],auditRunId:schemeCHandoff.auditRunId,
  consumerRunId:39015394167,consumerTrigger:trigger,
  handoffReceiptHash:schemeCHandoff.receiptHash,
  naturalAuditChildEventObserved:trigger==='workflow_run',
  sourceCollectorScheduledOriginIndependentlyVerified:null,
  completedDailyAutomaticSourceChainCertified:false,
  system2PITA:false,system2PITB:false,selectedCount:null,
  zeroPickDay:null,frozenD1Written:false,ordersAuthorized:false,
  pushAuthorized:false,cloudflareD1Writes:0
 },'deliveryOriginHash');
 const offset=sourceLate?60:-45;
 const schemeCReportMeta={
  schemaVersion:'S2_SCHEME_C_DAILY_VISIBLE_REPORT_V0_1',
  marketDate:'2026-10-16',
  handoffReceiptHash:schemeCHandoff.receiptHash,
  sourceAuditRunId:38934321405,
  sourceReady:true,preferredCutAtUtc:'2026-10-16T15:45:00Z',
  independentAuditOffsetMinutes:offset,
  previewObservationOffsetMinutes:previewLate?90:-20,
  researchReceiptCutStatus:previewLate
   ?'SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY'
   :'RESEARCH_RECEIPTS_AT_OR_BEFORE_T2345_NOT_PIT_CERTIFIED',
  schedulerDispatchDelayMinutes:null,officialProviderPublicationAtUtc:null,
  lateSource:previewLate,displayedCount:30,strategySelectedCount:null,
  zeroPickDay:null,pitACertified:false,pitBCertified:false,
  frozenWritten:false,ordersAuthorized:false,pushAuthorized:false,
  reportHash:await sha256Hex(schemeCReportMarkdown)
 };
 const schemeCAcceptance=await assessSchemeCDailyDeliveryV0_1({
  handoff:schemeCHandoff,origin:schemeCOrigin,
  reportMeta:schemeCReportMeta,reportMarkdown:schemeCReportMarkdown
 });
 return {dataNativeCronAuditReceipt,schemeCHandoff,schemeCOrigin,
  schemeCReportMeta,schemeCReportMarkdown,schemeCAcceptance};
}
const resign=async(o,k)=>sign(without(o,k),k);
test('true-source-cron but late and PR Scheme C output cannot be promoted into natural delivery',async()=>{
 const f=await fixture();
 const x=await join(f);
 assert.equal(x.marketDate,'2026-10-16');
 assert.equal(x.sourceScheduledEventVerified,true);
 assert.equal(x.dataOriginalSourceRunId,38934081985);
 assert.equal(x.dataIndependentAuditRunId,38934321405);
 assert.equal(x.sourceEnqueueDelayMinutes,267.667);
 assert.equal(x.sameNativeSourceAuditAndSchemeCReceiptLinked,true);
 assert.equal(x.nativeSourceAuditedPairs,122);
 assert.equal(x.originalSourceAndAuditReadyAtT2345,false);
 assert.equal(x.status,'SCHEDULED_SOURCE_AUDIT_VALID__PR_REPLAY_NOT_AUTOMATIC');
 assert.equal(x.naturalAuditChildObserved,false);
 assert.equal(x.fullDailyScheduledChainAccepted,false);
 assert.equal(x.schemeCConsumerCompletedGitHubRestIndependentlyVerified,false);
 assert.equal(x.schemeCVisiblePreviewCount,30);
 assert.equal(x.joinHash,await sha256Hex(without(x,'joinHash')));
});
test('manual recovery cannot satisfy natural automation even with exact native scheduled source',async()=>{
 const x=await join(await fixture({trigger:'workflow_dispatch'}));
 assert.equal(x.status,'SCHEDULED_SOURCE_AUDIT_VALID__MANUAL_REPLAY_NOT_AUTOMATIC');
 assert.equal(x.fullDailyScheduledChainAccepted,false);
});
test('genuine automatic child after source cut remains LATE_SOURCE even when original Cron known',async()=>{
 const x=await join(await fixture({trigger:'workflow_run'}));
 assert.equal(x.status,'SCHEDULED_SOURCE_AUDIT_VALID__NATURAL_CHILD_LATE_NONPIT');
 assert.equal(x.naturalAuditChildObserved,true);
 assert.equal(x.originalSourceAndAuditReadyAtT2345,false);
 assert.equal(x.fullDailyScheduledChainAccepted,false);
});
test('all before-cut source+child still requires completed independent child REST, never strategy PIT',async()=>{
 const x=await join(await fixture({trigger:'workflow_run',sourceLate:false,previewLate:false}));
 assert.equal(x.status,'SCHEDULED_SOURCE_AUDIT_VALID__NATURAL_CHILD_ON_TIME_NONPIT__CONSUMER_GH_REST_PENDING');
 assert.equal(x.originalSourceAndAuditReadyAtT2345,true);
 assert.equal(x.schemeCReportProducedAtCut,true);
 assert.equal(x.schemeCConsumerCompletedGitHubRestIndependentlyVerified,false);
 assert.equal(x.fullDailyScheduledChainAccepted,false);
 assert.equal(x.formalStrategyPITACertified,false);
 assert.equal(x.frozenD1Written,false);
});
test('reject crossing different original Audit runs, dates and swapped handoff despite valid re-signed leaf',async()=>{
 const samples=[
  async f=>{f.dataNativeCronAuditReceipt.independentAuditRunId=38934321406;
   f.dataNativeCronAuditReceipt=await resign(f.dataNativeCronAuditReceipt,'receiptHash')},
  async f=>{f.dataNativeCronAuditReceipt.marketDate='2026-10-15';
   f.dataNativeCronAuditReceipt=await resign(f.dataNativeCronAuditReceipt,'receiptHash')},
  async f=>{f.schemeCReportMeta.independentAuditOffsetMinutes=45;},
  async f=>{f.schemeCOrigin.consumerRunId=38934081985;
   f.schemeCOrigin=await resign(f.schemeCOrigin,'deliveryOriginHash');
   f.schemeCAcceptance=await assessSchemeCDailyDeliveryV0_1({
    handoff:f.schemeCHandoff,origin:f.schemeCOrigin,reportMeta:f.schemeCReportMeta,
    reportMarkdown:f.schemeCReportMarkdown})},
 ];
 for(const variant of samples){
  const f=await fixture();await variant(f);
  await assert.rejects(join(f),/SCHEME_C_NATIVE_SOURCE_DELIVERY_JOIN_/);
 }
});
test('reject fabricated scheduled origin or corrupted signed DATA/SCHEME C receipt',async()=>{
 const cases=[
  async f=>{f.dataNativeCronAuditReceipt.sourceRunEvent='workflow_dispatch'},
  async f=>{f.dataNativeCronAuditReceipt.sourceRunEvent='workflow_dispatch';
   f.dataNativeCronAuditReceipt=await resign(f.dataNativeCronAuditReceipt,'receiptHash')},
  async f=>{f.dataNativeCronAuditReceipt.sourceScheduleEventIndependentlyVerified=false;
   f.dataNativeCronAuditReceipt=await resign(f.dataNativeCronAuditReceipt,'receiptHash')},
  async f=>{f.dataNativeCronAuditReceipt.originalSourceMarketPairsIndependentlyAudited=121;
   f.dataNativeCronAuditReceipt=await resign(f.dataNativeCronAuditReceipt,'receiptHash')},
  async f=>{f.schemeCAcceptance.status='NATURAL_AUDIT_CHILD_ON_TIME_PREVIEW__SOURCE_CRON_UNVERIFIED'},
  async f=>{f.schemeCReportMarkdown+=' unauthorized'},
 ];
 for(const mutation of cases){
  const f=await fixture();await mutation(f);
  await assert.rejects(join(f),/SCHEME_C_NATIVE_SOURCE_DELIVERY_JOIN_|SCHEME_C_DELIVERY_ACCEPTANCE_/);
 }
});
test('reject retroactively relabelled post-cut source as before-cut even after valid DATA resign',async()=>{
 for(const change of [
  ['originalTargetDecisionCutSourceReady',true],
  ['originalIndependentSourceAuditFinishedBeforeCut',true],
  ['targetDayNativeSourceCapturedBeforeCut',true],
  ['originalSourceJobFinishedBeforeCut',true],
 ]){
  const f=await fixture();
  f.dataNativeCronAuditReceipt[change[0]]=change[1];
  f.dataNativeCronAuditReceipt=await resign(f.dataNativeCronAuditReceipt,'receiptHash');
  await assert.rejects(join(f),/ORIGINAL_NATIVE_CLOCK_INCOHERENT_OR_BACKDATED/);
 }
 // The pre-existing Scheme C signed handoff verifier also refuses a
 // contradictory before-cut report before this cross-domain join can run.
 await assert.rejects(async()=>fixture({trigger:'workflow_run',previewLate:false}),
  /SCHEME_C_DELIVERY_ACCEPTANCE_/);
});
test('joint Class A receipt never grants formal ranks, zero-pick, Shadow, Frozen, Cloudflare or trade',async()=>{
 const x=await join(await fixture());
 assert.equal(x.formalStrategyPITACertified,false);
 assert.equal(x.formalStrategyPITBCertified,false);
 assert.equal(x.strategySelectionAuthorized,false);
 assert.equal(x.selectedCount,null);
 assert.equal(x.zeroPickDay,null);
 assert.equal(x.fullMarketOrdinaryShareDenominator,null);
 assert.equal(x.shadowAuthorized,false);
 assert.equal(x.frozenD1Written,false);
 assert.equal(x.ordersAuthorized,false);
 assert.equal(x.pushAuthorized,false);
 assert.equal(x.cloudflareD1Reads,0);
 assert.equal(x.cloudflareD1Writes,0);
 assert.equal(x.cloudflareR2Writes,0);
 assert.equal(x.newProviderMarketGets,0);
 assert.equal(x.newCronCount,0);
 assert.equal(x.system1FormalCoreChanged,false);
});
