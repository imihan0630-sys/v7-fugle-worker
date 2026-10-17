import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {assessSchemeCDailyDeliveryV0_1 as assess} from '../runtime/scheme_c_daily_delivery_acceptance_v0_1.mjs';

const sign=async(x,k)=>({...x,[k]:await sha256Hex(x)});
async function fixture({trigger='workflow_run',ready=true,late=true}={}){
 const m='## 2026-10-16 source-only preliminary, no PIT, no trade\n';
 const handoff=await sign({
  schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
  marketDate:'2026-10-16',auditRunId:38934321405,
  state:ready?'NON_PIT_SOURCE_OBSERVATION_READY':'INDEPENDENT_SOURCE_INCOMPLETE',
  descriptiveSourceMatches:ready?519:null,
  observedPreviewCount:ready?30:null,
  pitACertificationGranted:false,pitBCertificationGranted:false,
  fullMarketOrdinaryShareCount:null,selectedCount:null,zeroPickDay:null,
  shadowAuthorized:false,realStrategyRankAuthorized:false,
  frozenD1Written:false,pushAuthorized:false,ordersAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreChanged:false
 },'receiptHash');
 const statuses={workflow_run:'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED',
  workflow_dispatch:'OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC',
  pull_request:'PR_HISTORICAL_PROOF_ONLY'};
 const origin=await sign({
  schemaVersion:'S2_SCHEME_C_DELIVERY_ORIGIN_V0_1',
  status:statuses[trigger],marketDate:handoff.marketDate,
  auditRunId:handoff.auditRunId,consumerRunId:400,
  handoffReceiptHash:handoff.receiptHash,consumerTrigger:trigger,
  naturalAuditChildEventObserved:trigger==='workflow_run',
  sourceCollectorScheduledOriginIndependentlyVerified:null,
  completedDailyAutomaticSourceChainCertified:false,
  system2PITA:false,system2PITB:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,ordersAuthorized:false,pushAuthorized:false,
  cloudflareD1Writes:0
 },'deliveryOriginHash');
 const reportMeta={
  schemaVersion:'S2_SCHEME_C_DAILY_VISIBLE_REPORT_V0_1',
  marketDate:handoff.marketDate,handoffReceiptHash:handoff.receiptHash,
  sourceAuditRunId:handoff.auditRunId,
  sourceReady:ready,
  preferredCutAtUtc:'2026-10-16T15:45:00Z',
  independentAuditOffsetMinutes:late?120:-30,
  previewObservationOffsetMinutes:ready?(late?130:-20):null,
  researchReceiptCutStatus:!ready?'SOURCE_NOT_READY':
   late?'SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY':
   'RESEARCH_RECEIPTS_AT_OR_BEFORE_T2345_NOT_PIT_CERTIFIED',
  schedulerDispatchDelayMinutes:null,
  officialProviderPublicationAtUtc:null,lateSource:ready?late:null,
  displayedCount:ready?30:null,
  strategySelectedCount:null,zeroPickDay:null,
  pitACertified:false,pitBCertified:false,frozenWritten:false,
  ordersAuthorized:false,pushAuthorized:false,reportHash:await sha256Hex(m)
 };
 return {handoff,origin,reportMeta,reportMarkdown:m};
}
test('real 10/16-shape late audit child is useful preview but never scheduled-chain certified',async()=>{
 const x=await assess(await fixture());
 assert.equal(x.status,'NATURAL_AUDIT_CHILD_LATE_SOURCE_PREVIEW');
 assert.equal(x.naturalAuditChildDelivered,true);
 assert.equal(x.descriptiveSourceMatches,519);
 assert.equal(x.displayedPreviewCount,30);
 assert.equal(x.originalSourceCronProven,false);
 assert.equal(x.fullDailyScheduledChainAccepted,false);
 assert.equal(x.selectedCount,null);
 assert.equal(x.zeroPickDay,null);
 assert.equal(x.frozenD1Written,false);
 assert.equal(x.acceptanceHash,await sha256Hex(Object.fromEntries(Object.entries(x).filter(([k])=>k!=='acceptanceHash'))));
});
test('an on-time signed audit-child remains SOURCE CRON UNKNOWN, never PIT',async()=>{
 const x=await assess(await fixture({late:false}));
 assert.equal(x.status,'NATURAL_AUDIT_CHILD_ON_TIME_PREVIEW__SOURCE_CRON_UNVERIFIED');
 assert.equal(x.observedByCut,true);
 assert.equal(x.originalSourceCronProven,false);
 assert.equal(x.pitA,false);
});
test('operator and PR replays are excluded from natural automated daily delivery',async()=>{
 for(const [trigger,status] of [
  ['workflow_dispatch','OPERATOR_MANUAL_RECOVERY_ONLY'],
  ['pull_request','PR_HISTORICAL_REPLAY_ONLY']
 ]){
  const x=await assess(await fixture({trigger}));
  assert.equal(x.status,status);
  assert.equal(x.naturalAuditChildDelivered,false);
  assert.equal(x.fullDailyScheduledChainAccepted,false);
 }
});
test('source-incomplete cannot create zero-pick or daily accepted research preview',async()=>{
 const x=await assess(await fixture({ready:false}));
 assert.equal(x.status,'SOURCE_NOT_READY');
 assert.equal(x.descriptiveSourceMatches,null);
 assert.equal(x.displayedPreviewCount,null);
 assert.equal(x.selectedCount,null);
});
test('rejects forged handoff, origin and visible markdown fingerprints',async()=>{
 const variants=[
  async f=>{f.handoff.descriptiveSourceMatches=999},
  async f=>{f.origin.naturalAuditChildEventObserved=false},
  async f=>{f.reportMarkdown+='attack'},
  async f=>{f.reportMeta.reportHash='z'.repeat(64)},
 ];
 for(const variant of variants){
  const f=await fixture();await variant(f);
  await assert.rejects(assess(f),/SCHEME_C_DELIVERY_ACCEPTANCE_/);
 }
});
test('rejects audit run/date swaps, false cron/selection/Frozen authority',async()=>{
 const variants=[
  async f=>{f.reportMeta.sourceAuditRunId++},
  async f=>{f.reportMeta.marketDate='2026-10-17'},
  async f=>{f.reportMeta.preferredCutAtUtc='2026-10-17T15:45:00Z'},
  async f=>{f.origin.completedDailyAutomaticSourceChainCertified=true;f.origin=await sign(Object.fromEntries(Object.entries(f.origin).filter(([k])=>k!=='deliveryOriginHash')),'deliveryOriginHash')},
  async f=>{f.handoff.selectedCount=0;f.handoff=await sign(Object.fromEntries(Object.entries(f.handoff).filter(([k])=>k!=='receiptHash')),'receiptHash')},
  async f=>{f.reportMeta.frozenWritten=true},
  async f=>{f.reportMeta.schedulerDispatchDelayMinutes=12},
 ];
 for(const variant of variants){
  const f=await fixture();await variant(f);
  await assert.rejects(assess(f),/SCHEME_C_DELIVERY_ACCEPTANCE_/);
 }
});
test('rejects fabricated early-cut metadata and mismatch between report and source counts',async()=>{
 for(const patch of [
  {researchReceiptCutStatus:'RESEARCH_RECEIPTS_AT_OR_BEFORE_T2345_NOT_PIT_CERTIFIED'},
  {lateSource:false},
  {displayedCount:29},
  {independentAuditOffsetMinutes:0,previewObservationOffsetMinutes:0}
 ]){
  const f=await fixture();Object.assign(f.reportMeta,patch);
  await assert.rejects(assess(f),/SCHEME_C_DELIVERY_ACCEPTANCE_/);
 }
});
