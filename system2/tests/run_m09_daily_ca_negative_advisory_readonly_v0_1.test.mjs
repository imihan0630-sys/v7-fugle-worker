import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {runM09DailyCaNegativeAdvisoryV0_1 as run}
 from '../scripts/run_m09_daily_ca_negative_advisory_readonly_v0_1.mjs';
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-07-17T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
});
function fixture(){
 const s={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  state:'SOURCE_OBSERVED_UNAUDITED',receiptHash:'a'.repeat(64),
  marketDate:dates.at(-1),receivedMarketDateCount:122,
  calendar:{tradingDates:dates}};
 const a={verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  sourceReceiptHash:s.receiptHash,sourceMarketDatePairsVerified:122,
  selectionAuthorized:false,auditHash:'b'.repeat(64)};
 const w={schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  marketDate:s.marketDate,
  originalSourceReceiptHash:s.receiptHash,
  independentSourceAuditHash:a.auditHash,
  state:'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  selectedCount:null,finalSelectionAuthorized:false,
  displayedCount:2,watchlist:[{market:'TWSE',symbol:'2330'},{market:'TPEX',symbol:'4444'}],
  receiptHash:'c'.repeat(64)};
 return {sourceReceipt:s,independentSourceAudit:a,preliminaryWatch:w};
}
const ca={sourceFamilyDenominator:6,sourcesRetainedOriginalBytes:6,
 nativeRangeSchemaCandidates:6,receiptHash:'d'.repeat(64),
 firstPhysicalObservedAtUtc:'2026-10-15T00:30:00Z'};
test('fully observed six native CA families produce advisory count but never formal selection',async()=>{
 const f=fixture();let times=0;
 const r=await run({...f,capture:async args=>{
  times++;assert.equal(args.startDate,dates[0]);
  assert.equal(args.marketDate,dates.at(-1));
  return ca;
 },replay:async()=>({previewWithProvenPresentCaIn61Sessions:1,receiptHash:'e'.repeat(64)})});
 assert.equal(times,1);
 assert.equal(r.state,'OBSERVED_EVENT_RISK_OVERLAY_ONLY_NOT_PIT_SELECTION');
 assert.equal(r.caNativeRangeCount,6);
 assert.equal(r.caKnownEventPreviewCount,1);
 assert.equal(r.noEventMayBeClaimed,false);
 assert.equal(r.ordinaryEquityPITCertified,false);
 assert.equal(r.formalSelectionAuthorized,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.frozenD1Written,false);
 const {receiptHash,capturedCaSourceReceipt,caNegativeRiskReceipt,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
});
test('one missing CA source remains incomplete and cannot invoke positive overlap',async()=>{
 const f=fixture();const r=await run({...f,
  capture:async()=>({...ca,sourcesRetainedOriginalBytes:5,nativeRangeSchemaCandidates:5}),
  replay:async()=>{throw Error('MUST_NOT_REPLAY_INCOMPLETE_CA');}});
 assert.equal(r.state,'SUPPLEMENTAL_CA_SOURCE_NOT_READY');
 assert.equal(r.caKnownEventPreviewCount,null);
 assert.equal(r.noEventMayBeClaimed,false);
 assert.equal(r.caNegativeRiskReceipt,null);
});
test('not independently audited A1 must not call any of six CA endpoints',async()=>{
 const f=fixture();f.independentSourceAudit.sourceMarketDatePairsVerified=121;
 const r=await run({...f,
  capture:async()=>{throw Error('MUST_NOT_FETCH_WHEN_A1_UNVERIFIED')}});
 assert.equal(r.reason,'INDEPENDENT_122_PAIR_SOURCE_AUDIT_NOT_ACCEPTED');
 assert.equal(r.caSourceReceiptHash,null);
 assert.equal(r.selectedCount,null);
});
test('no actually displayed preview never manufactures positive CA clearance',async()=>{
 const f=fixture();f.preliminaryWatch.state='BLOCKED_SOURCE_INCOMPLETE';
 const r=await run({...f,capture:async()=>{throw Error('MUST_NOT_FETCH_UNMATCHED_PREVIEW')}});
 assert.equal(r.reason,'ACTUAL_PRELIMINARY_WATCH_NOT_AVAILABLE_OR_NOT_MATCHED');
 assert.equal(r.caKnownEventPreviewCount,null);
 assert.equal(r.noEventMayBeClaimed,false);
});
test('workflow post-audit CA read uses same exact source clock, no D1 writes or new schedule',async()=>{
 const [w,src]=await Promise.all([
  readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8'),
  readFile('system2/scripts/run_m09_daily_ca_negative_advisory_readonly_v0_1.mjs','utf8')
 ]);
 assert.match(w,/name: Observe six native CA sources and report present-action risks only/);
 assert.match(w,/github.event_name != 'push'/);
 assert.match(w,/continue-on-error: true/);
 assert.match(w,/contents: read/);
 assert.match(w,/actions: read/);
 assert.match(src,/noEventMayBeClaimed:false/);
 assert.match(src,/cloudflareD1Writes:0/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|git push/);
});
