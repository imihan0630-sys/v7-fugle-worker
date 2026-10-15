import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildOfficialContinuitySourceUrlsV0_1,
 summarizeOfficialContinuityNativeOriginalV0_1 as summarize}
 from '../runtime/official_continuity_source_capability_v0_1.mjs';
import {auditM09DailyCaSixOriginalsV0_1 as audit}
 from '../scripts/audit_m09_daily_ca_six_originals_v0_1.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const DATE='2026-10-15',START='2026-07-01',RUN=38740410797;
const A='a'.repeat(64),B='b'.repeat(64),C='c'.repeat(64);
const ids=['TWSE_EX_RIGHT_DIVIDEND_ACTUAL','TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE','TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE','TPEX_PAR_VALUE_CHANGE_REFERENCE'];
async function signed(base,key='receiptHash'){
 return {...base,[key]:await sha256Hex(base)};
}
async function fixture(){
 const links=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:DATE});
 const bytes=new Map(),receipts=[];
 for(let i=0;i<ids.length;i++){
  const id=ids[i],meta=links[id];
  const range=meta.exchange==='TWSE'?'20260701~20261015':'2026/07/01~2026/10/15';
  const raw=Buffer.from(JSON.stringify({stat:'OK',date:range,tables:[{
   title:'公司行動實際公告',fields:['證券代號','資料日期','除權息'],
   data:[['2330','2026-09-15','資料樣本']]}]}));
  bytes.set(id,gzipSync(raw));
  const parsed=summarize({originalText:raw.toString('utf8'),
   startDate:START,endDate:DATE});
  assert.equal(parsed.state,'STRUCTURE_READY');
  const stamp='2026-10-15T13:10:'+String(31+i).padStart(2,'0')+'.000Z';
  receipts.push({sourceId:id,exchange:meta.exchange,
   actionFamilies:meta.actionFamilies,sourceClass:meta.sourceClass,
   sourceUrl:meta.url,state:'RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED',
   capturedAtUtc:stamp,originalSha256:sha(raw),originalBytes:raw.length,
   nativeSchema:parsed,originalBytesReadBackLocally:true,
   firstKnownAtEvidenceClass:'FIRST_PHYSICAL_OBSERVATION_NOW_NOT_HISTORICAL_PUBLICATION',
   effectiveVintageRevisionRetractionCoverageVerified:false});
 }
 const caReceipt=await signed({
  schemaVersion:'S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1',
  requestedStartDate:START,requestedEndDate:DATE,
  firstPhysicalObservedAtUtc:'2026-10-15T13:10:30.000Z',
  completedAtUtc:'2026-10-15T13:10:39.000Z',
  sourceFamilyDenominator:6,sourcesRetainedOriginalBytes:6,
  nativeRangeSchemaCandidates:6,
  state:'SIX_RAW_SOURCES_CAPTURED_AUTHORITY_UNVERIFIED',
  sourceReceipts:receipts,sourceContractCoverageComplete:false,
  historicalFirstKnownAtCertified:false,
  entireRangeCorrectionAndCancellationCoverageCertified:false,
  instrumentClassPITCertified:false,noEventMayBeClaimed:false,
  continuityCertified:false,selectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreTouched:false
 });
 const eventRisk=await signed({
  schemaVersion:'S2_M09_CA_NEGATIVE_REPLAY_61_SESSION_V0_1',
  marketDate:DATE,firstTradingDate:START,lastTradingDate:DATE,
  caRawSixSourceReceiptHash:caReceipt.receiptHash,
  initialA1ReceiptHash:A,independentA1AuditHash:B,previewReceiptHash:C,
  caRawFirstObservedAtUtc:caReceipt.firstPhysicalObservedAtUtc,
  caRawCompletedAtUtc:caReceipt.completedAtUtc,
  originalCaSourceCount:6,originalCaShaRehashed:6,
  preliminaryPreviewCount:30,previewWithProvenPresentCaIn61Sessions:1,
  previewWithoutObservedCaNotClearedCount:29,
  perSource:receipts.map(r=>({sourceId:r.sourceId,
   originalRawSha256:r.originalSha256,originalBytes:r.originalBytes,
   capturedAtUtc:r.capturedAtUtc,rangeReverifiedFromActualBytes:true})),
  flaggedPreview:[{market:'TWSE',symbol:'2330',sourceEventCount:3,
   events:ids.filter(id=>id.startsWith('TWSE_')).map(sourceId=>({
    sourceId,eventDate:'2026-09-15',
    knowledgeTimeClass:'ONLY_PROVEN_PRESENT_AS_OF_CA_SOURCE_CAPTURE_NOT_HISTORICAL_PIT'
   }))}],
  retroactivePitAdmission:false,asKnownAtPreviousDecisionClock:false,
  completeHistoricalRevisionAndCancellationEvidence:false,
  noEventOrNoActionMayBeCertified:false,
  formalStrategySelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false
 });
 const advisory=await signed({
  schemaVersion:'S2_M09_DAILY_CA_NEGATIVE_ADVISORY_V0_1',
  state:'OBSERVED_EVENT_RISK_OVERLAY_ONLY_NOT_PIT_SELECTION',
  marketDate:DATE,originalSourceReceiptHash:A,
  independentA1AuditHash:B,preliminaryWatchHash:C,
  preliminaryCount:30,caSourceReceiptHash:caReceipt.receiptHash,
  caNativeRangeCount:6,caKnownEventPreviewCount:1,
  caEventRiskReceiptHash:eventRisk.receiptHash,
  sourceFirstObservedAtUtc:caReceipt.firstPhysicalObservedAtUtc,
  historicalEventFirstKnownAtCertified:false,noEventMayBeClaimed:false,
  ordinaryEquityPITCertified:false,formalSelectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreTouched:false
 });
 return {advisory,caReceipt,eventRisk,readOriginal:async id=>bytes.get(id),
  sourceRunId:RUN,auditedAtUtc:'2026-10-15T13:11:30.000Z',bytes};
}
test('actual six raw bodies independently rehash and reparse, preserving NO-PIT and no Frozen',async()=>{
 const f=await fixture(),receipt=await audit(f);
 assert.equal(receipt.originalCaFamiliesIndependentlyRehashed,6);
 assert.equal(receipt.independentNativeRangeSchemaReparsed,6);
 assert.equal(receipt.sourceReportedKnownEventPreviewCount,1);
 assert.equal(receipt.positiveFlaggedPreviewIndependentlyVerified,1);
 assert.equal(receipt.positiveEventRowsIndependentlyMatched,3);
 assert.equal(receipt.unflaggedPreviewNoEventCertified,false);
 assert.equal(receipt.historicalFirstKnownAtPITCertified,false);
 assert.equal(receipt.historicalNoEventCoverageCertified,false);
 assert.equal(receipt.completeCorrectionsAndRetractionsCertified,false);
 assert.equal(receipt.selectedCount,null);assert.equal(receipt.frozenD1Written,false);
 const {auditHash,...base}=receipt;
 assert.equal(auditHash,await sha256Hex(base));
});
test('tampered gzip underlying official body cannot pass raw SHA',async()=>{
 const f=await fixture();
 f.bytes.set(ids[2],gzipSync(Buffer.from('NOT_THE_SOURCE')));
 await assert.rejects(()=>audit(f),/ORIGINAL_BODY_SHA_OR_LENGTH_MISMATCH/);
});
test('forged CA summary signed hash rejected before any original byte reads',async()=>{
 const f=await fixture();let reads=0;
 f.advisory.caKnownEventPreviewCount=20;
 f.readOriginal=async()=>{reads++;throw Error('FORBIDDEN_READ')};
 await assert.rejects(()=>audit(f),/SIGNED_ADVISORY_OR_NO_AUTHORITY_INVALID/);
 assert.equal(reads,0);
});
test('valid re-signature cannot upgrade absent-events or historical PIT',async()=>{
 for(const flag of ['historicalEventFirstKnownAtCertified','noEventMayBeClaimed',
   'formalSelectionAuthorized']){
  const f=await fixture();f.advisory[flag]=true;
  f.advisory=await signed(Object.fromEntries(
   Object.entries(f.advisory).filter(([k])=>k!=='receiptHash')));
  await assert.rejects(()=>audit(f),/SIGNED_ADVISORY_OR_NO_AUTHORITY_INVALID/);
 }
});
test('signed but substituted or duplicate official family URL is rejected',async()=>{
 const f=await fixture();
 f.caReceipt.sourceReceipts[0].sourceUrl='https://untrusted.invalid/CA';
 f.caReceipt=await signed(Object.fromEntries(
  Object.entries(f.caReceipt).filter(([k])=>k!=='receiptHash')));
 f.advisory.caSourceReceiptHash=f.caReceipt.receiptHash;
 f.advisory=await signed(Object.fromEntries(
  Object.entries(f.advisory).filter(([k])=>k!=='receiptHash')));
 f.eventRisk.caRawSixSourceReceiptHash=f.caReceipt.receiptHash;
 f.eventRisk=await signed(Object.fromEntries(
  Object.entries(f.eventRisk).filter(([k])=>k!=='receiptHash')));
 f.advisory.caEventRiskReceiptHash=f.eventRisk.receiptHash;
 f.advisory=await signed(Object.fromEntries(
  Object.entries(f.advisory).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>audit(f),/OFFICIAL_FAMILY_URL_OR_OBSERVATION_PROVENANCE_INVALID/);
});
test('audit clock before actually observed source fails even when all hashes match',async()=>{
 const f=await fixture();
 f.auditedAtUtc='2026-10-15T13:10:10.000Z';
 await assert.rejects(()=>audit(f),/HISTORICAL_CLOCK_BACKDATING_OR_SOURCE_WINDOW_INVALID/);
});
test('original body native response range is rejected when producer cached metadata is falsely retained',async()=>{
 const f=await fixture();
 const raw=Buffer.from(JSON.stringify({stat:'OK',date:'20260701~20261014',
  tables:[{fields:['證券代號'],data:[['2330']]}]}));
 // New raw and newly signed CA source must still fail native range independently.
 f.bytes.set(ids[0],gzipSync(raw));
 f.caReceipt.sourceReceipts[0].originalSha256=sha(raw);
 f.caReceipt.sourceReceipts[0].originalBytes=raw.length;
 f.caReceipt=await signed(Object.fromEntries(
  Object.entries(f.caReceipt).filter(([k])=>k!=='receiptHash')));
 f.eventRisk.caRawSixSourceReceiptHash=f.caReceipt.receiptHash;
 f.eventRisk.perSource[0].originalRawSha256=sha(raw);
 f.eventRisk.perSource[0].originalBytes=raw.length;
 f.eventRisk=await signed(Object.fromEntries(
  Object.entries(f.eventRisk).filter(([k])=>k!=='receiptHash')));
 f.advisory.caSourceReceiptHash=f.caReceipt.receiptHash;
 f.advisory.caEventRiskReceiptHash=f.eventRisk.receiptHash;
 f.advisory=await signed(Object.fromEntries(
  Object.entries(f.advisory).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>audit(f),/INDEPENDENT_NATIVE_RANGE_OR_SCHEMA_MISMATCH/);
});
async function resignEventRisk(f){
 const {receiptHash,...base}=f.eventRisk;
 f.eventRisk=await signed(base);
 f.advisory.caEventRiskReceiptHash=f.eventRisk.receiptHash;
 const {receiptHash:_,...advisoryBase}=f.advisory;
 f.advisory=await signed(advisoryBase);
}
test('even re-signed forged positive event date MUST appear in actual original',async()=>{
 const f=await fixture();
 f.eventRisk.flaggedPreview[0].events[0].eventDate='2026-09-16';
 await resignEventRisk(f);
 await assert.rejects(()=>audit(f),
  /SIGNED_FLAGGED_EVENT_NOT_FOUND_IN_ORIGINAL_NATIVE_BODY/);
});
test('even re-signed forged positive event source family MUST match actual native market',async()=>{
 const f=await fixture();
 f.eventRisk.flaggedPreview[0].events[0].sourceId='TPEX_EX_RIGHT_DIVIDEND_ACTUAL';
 await resignEventRisk(f);
 await assert.rejects(()=>audit(f),
  /SIGNED_FLAGGED_EVENT_NOT_FOUND_IN_ORIGINAL_NATIVE_BODY/);
});
test('duplicate positive event record cannot inflate source-reported event hit count',async()=>{
 const f=await fixture();
 f.eventRisk.flaggedPreview[0].events.push({...f.eventRisk.flaggedPreview[0].events[0]});
 f.eventRisk.flaggedPreview[0].sourceEventCount=4;
 await resignEventRisk(f);
 await assert.rejects(()=>audit(f),
  /SIGNED_FLAGGED_EVENT_NOT_FOUND_IN_ORIGINAL_NATIVE_BODY/);
});
test('false positive known event for another symbol cannot survive original-byte proof',async()=>{
 const f=await fixture();
 f.eventRisk.flaggedPreview[0].symbol='1234';
 await resignEventRisk(f);
 await assert.rejects(()=>audit(f),
  /SIGNED_FLAGGED_EVENT_NOT_FOUND_IN_ORIGINAL_NATIVE_BODY/);
});

test('CI daily independent job only follows same-repository valid source and cannot write cloud',async()=>{
 const y=await readFile('.github/workflows/system2-m09-daily-six-ca-independent-audit.yml','utf8');
 assert.match(y,/workflow_run:/);
 assert.match(y,/github.event.workflow_run.conclusion == 'success'/);
 assert.match(y,/head_repository.full_name == github.repository/);
 assert.match(y,/github.event.workflow_run.event == 'workflow_run'/);
 assert.match(y,/38740410797/); // Explicit fixed original Oct 15 PR-only physical replay
 assert.match(y,/contents: read/);
 assert.match(y,/actions: read/);
 assert.doesNotMatch(y,/schedule:|contents: write|secrets\.|wrangler (?:deploy|d1|r2)/);
});
