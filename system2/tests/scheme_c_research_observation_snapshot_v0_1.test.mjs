import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {assessSchemeCDailyDeliveryV0_1 as assess}
 from '../runtime/scheme_c_daily_delivery_acceptance_v0_1.mjs';
import {buildSchemeCResearchObservationSnapshotV0_1 as build}
 from '../runtime/scheme_c_research_observation_snapshot_v0_1.mjs';
const SHA='a'.repeat(64);
const rehash=async(obj,key)=>({...obj,[key]:await sha256Hex(obj)});
const unsigned=(obj,key)=>Object.fromEntries(
 Object.entries(obj).filter(([name])=>name!==key));
const row=()=>({
 previewDisplayOrder:1,symbol:'2330',companyName:'台積電',market:'TWSE',
 marketDate:'2026-10-16',descriptiveRawFiveSessionReturnPct:2.37,
 priceAboveRawSma20:true,
 status:'CA_OR_CLOCK_REVIEW_HOLD',
 warnings:['KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED',
  'ORDINARY_SHARE_CLASS_NOT_INDEPENDENTLY_CERTIFIED'],
 sourceRowHash:SHA,
 previewIsTradeRecommendation:false,
 formalStrategyRank:null,formalStrategyScore:null,
 entryPrice:null,stop:null,targets:null
});
async function fixture({sourceReady=true,trigger='pull_request',late=true}={}){
 const md='## System 2 2026-10-16 非 PIT 研究預覽'; 
 const handoff=await rehash({
  schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
  marketDate:'2026-10-16',auditRunId:38934321405,
  auditedAtUtc:'2026-10-16T16:50:00Z',
  originalSourceReceiptHash:SHA,
  independentSourceAuditHash:'b'.repeat(64),
  state:sourceReady?'NON_PIT_SOURCE_OBSERVATION_READY':
    'INDEPENDENT_SOURCE_INCOMPLETE',
  descriptiveSourceMatches:sourceReady?519:null,
  observedPreviewCount:sourceReady?1:null,
  previewReport:sourceReady?{
   marketDate:'2026-10-16',
   originalObservedAtUtc:'2026-10-16T16:55:00Z',
   sourceUniverseKind:'FOUR_DIGIT_INSTRUMENT_NOT_CERTIFIED_ORDINARY_EQUITY',
   sourceUniverseCount:1760,
   preliminarySourceMatchedCount:519,
   previewRows:[row()]
  }:null,
  pitACertificationGranted:false,pitBCertificationGranted:false,
  fullMarketOrdinaryShareCount:null,selectedCount:null,
  zeroPickDay:null,shadowAuthorized:false,realStrategyRankAuthorized:false,
  frozenD1Written:false,pushAuthorized:false,ordersAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 },'receiptHash');
 const types={
  pull_request:'PR_HISTORICAL_PROOF_ONLY',
  workflow_dispatch:'OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC',
  workflow_run:'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED'
 };
 const deliveryOrigin=await rehash({
  schemaVersion:'S2_SCHEME_C_DELIVERY_ORIGIN_V0_1',
  status:types[trigger],marketDate:'2026-10-16',
  auditRunId:38934321405,consumerRunId:39015394167,
  handoffReceiptHash:handoff.receiptHash,
  consumerTrigger:trigger,naturalAuditChildEventObserved:trigger==='workflow_run',
  sourceCollectorScheduledOriginIndependentlyVerified:null,
  completedDailyAutomaticSourceChainCertified:false,
  system2PITA:false,system2PITB:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,ordersAuthorized:false,pushAuthorized:false,
  cloudflareD1Writes:0
 },'deliveryOriginHash');
 const reportMeta={
  schemaVersion:'S2_SCHEME_C_DAILY_VISIBLE_REPORT_V0_1',
  marketDate:'2026-10-16',sourceAuditRunId:38934321405,
  handoffReceiptHash:handoff.receiptHash,
  sourceReady,preferredCutAtUtc:'2026-10-16T15:45:00Z',
  independentAuditOffsetMinutes:65,
  previewObservationOffsetMinutes:sourceReady?70:null,
  researchReceiptCutStatus:!sourceReady?'SOURCE_NOT_READY':
   late?'SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY':
    'RESEARCH_RECEIPTS_AT_OR_BEFORE_T2345_NOT_PIT_CERTIFIED',
  lateSource:sourceReady?late:null,
  displayedCount:sourceReady?1:null,
  schedulerDispatchDelayMinutes:null,
  officialProviderPublicationAtUtc:null,
  strategySelectedCount:null,zeroPickDay:null,pitACertified:false,
  pitBCertified:false,frozenWritten:false,ordersAuthorized:false,
  pushAuthorized:false,reportHash:await sha256Hex(md)
 };
 const deliveryAcceptance=await assess({
  handoff,origin:deliveryOrigin,reportMeta,
  reportMarkdown:md
 });
 return {
  handoff,deliveryOrigin,reportMeta,reportMarkdown:md,
  deliveryAcceptance,generatedAtUtc:'2026-10-17T05:00:00.000Z'
 };
}
test('source-only signed actual historical report records dated 1 candidate with 30-day evidence expiry',async()=>{
 const f=await fixture(),r=await build(f);
 assert.equal(r.marketDate,'2026-10-16');
 assert.equal(r.actualReportGeneratedAtUtc,'2026-10-17T05:00:00.000Z');
 assert.equal(r.modelVersion,'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2');
 assert.equal(r.modelCriteria.length,4);
 assert.equal(r.originalIndependentAuditRunId,undefined);
 assert.equal(r.originalAuditRunId,38934321405);
 assert.equal(r.sourceFourDigitSecuritiesScanned,1760);
 assert.equal(r.descriptiveMatched,519);
 assert.equal(r.displayedResearchRows,1);
 assert.equal(r.researchRows[0].symbol,'2330');
 assert.equal(r.researchRows[0].descriptiveState,'CA_OR_CLOCK_REVIEW_HOLD');
 assert.equal(r.recordRetentionDays,30);
 assert.equal(r.durablePreOutcomeObservationIndependentlyCertified,false);
 assert.equal(r.prospectiveForwardPerformanceCertified,false);
 assert.equal(r.snapshotHash,await sha256Hex(unsigned(r,'snapshotHash')));
});
test('source not ready preserves unknown counts instead of fabricated zero picks',async()=>{
 const r=await build(await fixture({sourceReady:false}));
 assert.equal(r.sourceReady,false);
 assert.equal(r.sourceFourDigitSecuritiesScanned,null);
 assert.equal(r.descriptiveMatched,null);
 assert.equal(r.displayedResearchRows,null);
 assert.deepEqual(r.researchRows,[]);
 assert.equal(r.zeroDescriptiveMatchesWhenVerified,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
});
test('manual and natural consumer have distinct historical provenance and no automatic P0 promotion',async()=>{
 for(const type of ['workflow_dispatch','workflow_run']){
  const r=await build(await fixture({trigger:type}));
  assert.equal(r.fullMarketOrdinaryShareDenominator,null);
  assert.equal(r.naturalDailyFullChainAccepted,false);
  assert.equal(r.originalSourceCronProvenByThisReceipt,false);
  assert.equal(r.snapshotIsOfficialFrozen,false);
  assert.equal(r.recordRetentionDays,30);
 }
});
test('reject corrupt or re-signed mismatching report, count and origin before recording',async()=>{
 const variants=[
  async f=>{f.reportMarkdown+=' forged';},
  async f=>{f.deliveryAcceptance={...f.deliveryAcceptance,status:'NOT_REAL'};},
  async f=>{f.handoff.previewReport.previewRows[0].symbol='9999';},
  async f=>{f.deliveryOrigin.consumerRunId=99;
   f.deliveryOrigin=await rehash(unsigned(f.deliveryOrigin,'deliveryOriginHash'),'deliveryOriginHash');},
 ];
 for(const variant of variants){
  const f=await fixture();await variant(f);
  await assert.rejects(build(f),/SCHEME_C_DELIVERY_ACCEPTANCE_|SCHEME_C_RESEARCH_OBSERVATION_/);
 }
});
test('reject invented report generation before original audit or source observation',async()=>{
 const f=await fixture();
 f.generatedAtUtc='2026-10-16T16:00:00Z';
 await assert.rejects(build(f),/REPORT_CANNOT_PRECEDE_AUDIT_OR_INVENT_NATURAL_EVENT/);
 const g=await fixture();
 g.generatedAtUtc='2026-10-16T16:52:00Z';
 await assert.rejects(build(g),/REAL_SOURCED_PREVIEW_MODEL_OR_ROWS_INCOMPLETE/);
});
test('no retrospective performance, official strategy, virtual execution, Frozen or production authority',async()=>{
 const r=await build(await fixture());
 assert.equal(r.noShortMomentumSevenFactorClaim,true);
 assert.equal(r.observationLane,'NON_PIT_PREVIEW');
 assert.equal(r.historicPRReplayCannotStartProspectivePerformance,true);
 assert.equal(r.snapshotIsOfficialFrozen,false);
 assert.equal(r.pitACertified,false);
 assert.equal(r.pitBCertified,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.ordersAuthorized,false);
 assert.equal(r.pushAuthorized,false);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.cloudflareR2Writes,0);
 assert.equal(r.providerMarketGetsAdded,0);
 assert.equal(r.newCronCount,0);
 assert.equal(r.system1FormalCoreChanged,false);
});
