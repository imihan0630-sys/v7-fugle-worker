import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSchemeCDailyAuditHandoffV0_1 as run}
 from '../runtime/scheme_c_daily_audit_handoff_v0_1.mjs';

const HASH='a'.repeat(64),T='2026-10-13';
async function signed(p,key){return {...p,[key]:await sha256Hex(p)};}
async function sample({blocked=false,late=false}={}){
 const audit=await signed({
  schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:blocked?'BLOCKED_SOURCE_INCOMPLETE':'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  marketDate:T,manifestSha256:HASH,sourceReceiptHash:HASH,
  auditedAtUtc:'2026-10-13T21:50:00Z',
  sourceMarketDatePairsVerified:blocked?121:122,
  originalFilesRehashedAfterDownload:blocked?121:122,
  originalFilesDecompressedAndParsed:blocked?121:122,
  officialCalendarTradingDatesVerified:61,
  sourceUrlAndProviderDateVerified:true,
  independentOfficialCalendarReadbackVerified:true,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  missingMarketDatePairs:blocked?1:0,
  strategyPitCertified:false,selectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenWritten:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalRuntimeTouched:false,
 },'auditHash');
 const r={
  schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  watchVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2',
  state:blocked?'BLOCKED_SOURCE_INCOMPLETE':
   'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  marketDate:T,observedAtUtc:late?'2026-10-14T01:00:00Z':'2026-10-13T22:21:06Z',
  originalSourceReceiptHash:HASH,
  independentSourceAuditHash:audit.auditHash,
  selectedCount:null,zeroPickDay:null,
  finalSelectionAuthorized:false,finalStrategyRankApproved:false,
  frozenWritten:false,orderAuthorized:false,pushAuthorized:false,
  historicalBacktestCertified:false,
  ordinaryEquityOnlyUniverseCertified:false,
  originalFourDigitSecurityUniverse:true,
  officialUniverseCount:1974,preliminaryMatchedCount:580,displayedCount:1,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  watchlist:[{symbol:'2454',companyName:'聯發科',market:'TWSE',
   marketDate:T,fiveSessionReturnPct:3.33,aboveSma20:true,
   positiveFiveSessionReturn:true,sourceRowHash:HASH,
   instrumentClassPITStatus:'ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED',
   companyActionPitStatus:'UNKNOWN_NOT_CLEARED',
   riskLevel:'PRELIMINARY_OBSERVATION_ONLY',formalStrategyValidity:null,
   strategyRank:null,triggerPrice:null,stop:null,targets:null}]
 };
 return {auditReceipt:audit,preliminaryReceipt:await signed(r,'receiptHash'),
  auditRunId:38469057567,sourceKind:'PINNED_HISTORIC_V02_REPLAY',
  auditLinkedExternally:true};
}
test('realistic physical audit/preview shapes are independent and preview-only',async()=>{
 const input=await sample(),r=await run(input);
 const {receiptHash,...base}=r;
 assert.equal(receiptHash,await sha256Hex(base));
 assert.equal(r.state,'NON_PIT_SOURCE_OBSERVATION_READY');
 assert.equal(r.descriptiveSourceMatches,580);
 assert.equal(r.observedPreviewCount,1);
 assert.equal(r.previewReport.marketDate,T);
 assert.equal(r.previewReport.state,'LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY');
 assert.equal(r.previewReport.futureProspectiveForwardReturnsUsableForThisDecision,false);
 assert.equal(r.previewReport.sourceUniverseKind,'FOUR_DIGIT_INSTRUMENT_NOT_CERTIFIED_ORDINARY_EQUITY');
 assert.equal(r.pitACertificationGranted,false);
 assert.equal(r.pitBCertificationGranted,false);
 assert.equal(r.fullMarketOrdinaryShareCount,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);
});
test('121/122 source stops at source boundary even if preview has positive rows',async()=>{
 const input=await sample({blocked:true});
 const r=await run(input);
 assert.equal(r.state,'INDEPENDENT_SOURCE_INCOMPLETE');
 assert.equal(r.observedPreviewCount,null);
 assert.equal(r.previewReport,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
});
test('missing non-PIT V02 watch is blocked not zero-pick',async()=>{
 const input=await sample();
 input.preliminaryReceipt=null;
 const r=await run(input);
 assert.equal(r.state,'PRELIMINARY_SOURCE_NOT_READY');
 assert.equal(r.observedPreviewCount,null);
 assert.equal(r.selectedCount,null);
});
test('mutated independently audited SHA / producer wrong date / wrong lineage all rejected',async()=>{
 const input=await sample();
 const forged=structuredClone(input);
 forged.auditReceipt.sourceReceiptHash='b'.repeat(64);
 await assert.rejects(run(forged),/SOURCE_INDEPENDENT_AUDIT_RECEIPT_INVALID/);
 const forgedWatch=structuredClone(input);
 forgedWatch.preliminaryReceipt.watchlist[0].companyName='偽造公司';
 await assert.rejects(run(forgedWatch),/PRELIMINARY_RECEIPT_HASH_CORRUPT/);
 const wrongDate=structuredClone(input);
 wrongDate.preliminaryReceipt.marketDate='2026-10-14';
 const {receiptHash,...b}=wrongDate.preliminaryReceipt;
 wrongDate.preliminaryReceipt.receiptHash=await sha256Hex(b);
 await assert.rejects(run(wrongDate),/AUDIT_PREVIEW_SOURCE_DATE_HASH_OR_CLOCK_MISMATCH/);
 const wrongAudit=structuredClone(input);
 wrongAudit.preliminaryReceipt.independentSourceAuditHash='b'.repeat(64);
 const {receiptHash:old,...c}=wrongAudit.preliminaryReceipt;
 wrongAudit.preliminaryReceipt.receiptHash=await sha256Hex(c);
 await assert.rejects(run(wrongAudit),/AUDIT_PREVIEW_SOURCE_DATE_HASH_OR_CLOCK_MISMATCH/);
});
test('late derived report must remain historical observation, NEVER early PIT',async()=>{
 const input=await sample({late:true}),r=await run(input);
 assert.equal(r.previewReport.observedAfterTradingDatePreferredCut,true);
 assert.equal(r.previewReport.futureProspectiveForwardReturnsUsableForThisDecision,false);
 assert.equal(r.previewReport.previewRows[0].previewIsTradeRecommendation,false);
});
test('pinned old two-run source may never impersonate one new audit run',async()=>{
 const input=await sample();
 await assert.rejects(run({...input,auditRunId:7}),
   /HISTORIC_SOURCE_AUDIT_PAIR_NOT_PINNED/);
 await assert.rejects(run({...input,auditLinkedExternally:false}),
   /HISTORIC_SOURCE_AUDIT_PAIR_NOT_PINNED/);
 const current=await run({...input,sourceKind:'SAME_RUN_SOURCE_ONLY_AUDIT_ARTIFACT',
  auditLinkedExternally:false});
 assert.equal(current.state,'NON_PIT_SOURCE_OBSERVATION_READY');
});
test('no source evidence, synthetics and declared no-PIT cannot grant Frozen or orders',async()=>{
 const input=await sample();
 await assert.rejects(run({...input,auditRunId:null}),/REAL_AUDIT_RUN_ID_REQUIRED/);
 input.auditReceipt.strategyPitCertified=true;
 await assert.rejects(run(input),/SOURCE_INDEPENDENT_AUDIT_RECEIPT_INVALID|SOURCE_AUDIT_UNAUTHORIZED_PROMOTION/);
});
