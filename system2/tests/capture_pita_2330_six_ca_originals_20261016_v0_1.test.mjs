import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {capturePita2330SixCAOriginalV0_1 as capture}
 from '../scripts/capture_pita_2330_six_ca_originals_20261016_v0_1.mjs';
const fam=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
 'TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE',
 'TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE',
 'TPEX_PAR_VALUE_CHANGE_REFERENCE'
];
const nowDate=new Date('2026-10-16T13:50:00.000Z');
const now=()=>new Date(nowDate);
async function fixture({retained=6}={}){
 const receipts=fam.map((sourceId,i)=>{
  const ok=i<retained;
  return {
   sourceId,exchange:sourceId.startsWith('TWSE_')?'TWSE':'TPEX',
   sourceClass:'HISTORICAL_ACTUAL_RESULT_RANGE',
   sourceUrl:'https://www.twse.com.tw/official/test/'+sourceId,
   effectiveVintageRevisionRetractionCoverageVerified:false,
   originalBytesReadBackLocally:ok,
   originalSha256:ok?'a'.repeat(64):null,
   originalBytes:ok?180:null,
   capturedAtUtc:ok?'2026-10-16T13:50:00.000Z':null,
   state:ok?'RAW_OBSERVED_SCHEMA_OR_RANGE_UNVERIFIED':'SOURCE_UNAVAILABLE_FAIL_CLOSED',
   firstKnownAtEvidenceClass:ok?
    'FIRST_PHYSICAL_OBSERVATION_NOW_NOT_HISTORICAL_PUBLICATION':'NOT_VERIFIED'
  };
 });
 const base={
  schemaVersion:'S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1',
  requestedStartDate:'2026-07-21',requestedEndDate:'2026-10-16',
  firstPhysicalObservedAtUtc:'2026-10-16T13:50:00.000Z',
  completedAtUtc:'2026-10-16T13:50:00.000Z',
  sourceFamilyDenominator:6,
  sourcesRetainedOriginalBytes:retained,
  nativeRangeSchemaCandidates:0,
  state:retained===6?'SIX_RAW_SOURCES_CAPTURED_AUTHORITY_UNVERIFIED':
   'SIX_RAW_SOURCES_PARTIAL_OR_UNAVAILABLE',
  sourceReceipts:receipts,
  sourceContractCoverageComplete:false,
  historicalFirstKnownAtCertified:false,
  entireRangeCorrectionAndCancellationCoverageCertified:false,
  instrumentClassPITCertified:false,
  noEventMayBeClaimed:false,continuityCertified:false,
  selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false
 };
 return {...base,receiptHash:await sha256Hex(base)};
}
const deps={now,fetchImpl:async()=>{throw Error('not called')},
 persistRaw:async()=>{throw Error('not called')}};
test('six native official body receipts are source-only, not 2330 corporate-action PIT',async()=>{
 const c=await fixture();const x=await capture({...deps,collect:async()=>c});
 assert.equal(x.receipt.status,'SIX_OFFICIAL_CA_ORIGINALS_CAPTURED_AS_OBSERVED_NOW_ONLY');
 assert.equal(x.receipt.observedSourceFamilies,6);
 assert.equal(x.receipt.actualSourceFamilyDenominator,6);
 assert.equal(x.receipt.marketDate,'2026-10-16');
 assert.equal(x.receipt.windowStartDate,'2026-07-21');
 assert.equal(x.receipt.directIssuerVersionAndAmendmentCompletenessCertified,false);
 assert.equal(x.receipt.authoritativeNegativeNoEventScopeCertified,false);
 assert.equal(x.receipt.historicalCfiEffectivePITCertified,false);
 assert.equal(x.receipt.independentAuditLaneCompletePitCertified,false);
 assert.equal(x.receipt.pitEligible,false);
 assert.equal(x.receipt.selectedCount,null);
 assert.equal(x.receipt.zeroPickDay,null);
 assert.equal(x.receipt.frozenD1Written,false);
 assert.equal(x.receipt.cloudflareD1Writes,0);
 const {receiptHash,...unsigned}=x.receipt;
 assert.equal(receiptHash,await sha256Hex(unsigned));
});
test('five of six original families remain UNKNOWN and never NO_EVENT',async()=>{
 const c=await fixture({retained:5}),x=await capture({...deps,collect:async()=>c});
 assert.equal(x.receipt.observedSourceFamilies,5);
 assert.equal(x.receipt.status,'PARTIAL_CA_ORIGINALS_UNKNOWN_NO_EVENT_NOT_PROVEN');
 assert.equal(x.receipt.authoritativeNegativeNoEventScopeCertified,false);
 assert.equal(x.receipt.pitEligible,false);
});
test('wrong day, before market close, after research cut fail before any official GET',async()=>{
 for(const date of [
  '2026-10-15T14:00:00.000Z',
  '2026-10-16T05:29:59.000Z',
  '2026-10-16T15:45:00.000Z',
  '2026-10-17T04:00:00.000Z',
 ]){
  let called=0;
  await assert.rejects(()=>capture({...deps,
    now:()=>new Date(date),
    collect:async()=>{called++;return await fixture();}
  }),/S2_PITA_2330_CA_OBSERVATION_DAY_OR_CUT_EXPIRED/);
  assert.equal(called,0);
 }
});
test('reject signed but duplicate, fake CA historical completeness, wrong clocks and invented NO_EVENT',async()=>{
 const cases=[
  c=>c.sourceReceipts[5].sourceId=c.sourceReceipts[0].sourceId,
  c=>c.sourceReceipts[4].exchange='TWSE',
  c=>c.sourceReceipts[3].originalSha256='bogus',
  c=>c.sourceReceipts[4].capturedAtUtc='2026-10-16T15:50:00.000Z',
  c=>c.sourceReceipts[4].originalBytesReadBackLocally=false,
  c=>c.sourceContractCoverageComplete=true,
  c=>c.historicalFirstKnownAtCertified=true,
  c=>c.entireRangeCorrectionAndCancellationCoverageCertified=true,
  c=>c.noEventMayBeClaimed=true,
  c=>c.selectionAuthorized=true,
  c=>c.frozenD1Written=true,
  c=>c.completedAtUtc=null,
 ];
 for(const mutate of cases){
  const c=await fixture();mutate(c);
  c.receiptHash=await sha256Hex(Object.fromEntries(
    Object.entries(c).filter(([k])=>k!=='receiptHash')
  ));
  await assert.rejects(()=>capture({...deps,collect:async()=>c}),/S2_PITA_2330_CA_/);
 }
});
test('source-only execution is bounded six original GET and no Cloudflare / secret / cron',async()=>{
 const [s,w]=await Promise.all([
  readFile('system2/scripts/capture_pita_2330_six_ca_originals_20261016_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-pita-2330-six-ca-native-originals-20261016.yml','utf8')
 ]);
 assert.match(s,/flag:'wx'/);
 assert.match(s,/probeM09SixCaOriginalsV0_1/);
 assert.match(s,/noEventMayBeClaimed/);
 assert.doesNotMatch(s,/wrangler|INSERT INTO|api\.cloudflare\.com|git push|orderSubmit/);
 assert.match(w,/contents: read/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.match(w,/retention-days: 90/);
 assert.match(w,/github\.event_name == 'push'/);
});
