import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {runM09DailyCaNegativeAdvisoryV0_1 as run}
 from '../scripts/run_m09_daily_ca_negative_advisory_readonly_v0_1.mjs';
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-07-17T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
});
async function fixture(){
 const s={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  state:'SOURCE_OBSERVED_UNAUDITED',marketDate:dates.at(-1),
  calendar:{state:'SOURCE_OBSERVED_UNAUDITED',marketDate:dates.at(-1),
   tradingDates:[...dates],observedAt:'2026-09-15T11:00:00Z',
   originalCalendarHash:'a'.repeat(64),providerSource:'TWSE_OFFICIAL',
   verifiedOfficialReadback:false},
  requestCount:122,plannedMarketDateRequests:122,receivedMarketDateCount:122,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:dates.at(-1),
  sourceRowSymbolWindowsCompleteCount:0,markets:['TWSE','TPEX'],
  receipts:[],errors:[],bySymbol:{},sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true};
 s.receiptHash=await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(s));
 const a={verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  sourceReceiptHash:s.receiptHash,sourceMarketDatePairsVerified:122,
  selectionAuthorized:false,auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  auditedAtUtc:'2026-09-15T11:15:00Z'};
 a.auditHash=await sha256Hex(a);
 const w={schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  marketDate:s.marketDate,
  originalSourceReceiptHash:s.receiptHash,
  independentSourceAuditHash:a.auditHash,
  state:'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  selectedCount:null,finalSelectionAuthorized:false,
  displayedCount:2,watchlist:[{market:'TWSE',symbol:'2330'},{market:'TPEX',symbol:'4444'}]};
 w.receiptHash=await sha256Hex(w);
 return {sourceReceipt:s,independentSourceAudit:a,preliminaryWatch:w};
}
const ca={sourceFamilyDenominator:6,sourcesRetainedOriginalBytes:6,
 nativeRangeSchemaCandidates:6,receiptHash:'d'.repeat(64),
 firstPhysicalObservedAtUtc:'2026-10-15T00:30:00Z'};
test('fully observed six native CA families produce advisory count but never formal selection',async()=>{
 const f=await fixture();let times=0;
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
 const f=await fixture();const r=await run({...f,
  capture:async()=>({...ca,sourcesRetainedOriginalBytes:5,nativeRangeSchemaCandidates:5}),
  replay:async()=>{throw Error('MUST_NOT_REPLAY_INCOMPLETE_CA');}});
 assert.equal(r.state,'SUPPLEMENTAL_CA_SOURCE_NOT_READY');
 assert.equal(r.caKnownEventPreviewCount,null);
 assert.equal(r.noEventMayBeClaimed,false);
 assert.equal(r.caNegativeRiskReceipt,null);
});
test('not independently audited A1 must not call any of six CA endpoints',async()=>{
 const f=await fixture();f.independentSourceAudit.sourceMarketDatePairsVerified=121;
 const r=await run({...f,
  capture:async()=>{throw Error('MUST_NOT_FETCH_WHEN_A1_UNVERIFIED')}});
 assert.equal(r.reason,'INDEPENDENT_122_PAIR_SOURCE_AUDIT_NOT_ACCEPTED');
 assert.equal(r.caSourceReceiptHash,null);
 assert.equal(r.selectedCount,null);
});
test('no actually displayed preview never manufactures positive CA clearance',async()=>{
 const f=await fixture();f.preliminaryWatch.state='BLOCKED_SOURCE_INCOMPLETE';
 const r=await run({...f,capture:async()=>{throw Error('MUST_NOT_FETCH_UNMATCHED_PREVIEW')}});
 assert.equal(r.reason,'ACTUAL_PRELIMINARY_WATCH_NOT_AVAILABLE_OR_NOT_MATCHED');
 assert.equal(r.caKnownEventPreviewCount,null);
 assert.equal(r.noEventMayBeClaimed,false);
});
test('tampered source calendar provenance blocks six provider requests before capture',async()=>{
 const f=await fixture();
 f.sourceReceipt.calendar.observedAt='2026-09-15T12:00:00Z';
 const r=await run({...f,capture:async()=>{throw Error('PROVIDER_MUST_NOT_BE_CALLED');}});
 assert.equal(r.reason,'INDEPENDENT_122_PAIR_SOURCE_AUDIT_NOT_ACCEPTED');
 assert.equal(r.caNativeRangeCount,0);
 assert.equal(r.frozenD1Written,false);
});
test('re-signed malformed source trading calendar still fails preflight',async()=>{
 const f=await fixture();
 f.sourceReceipt.calendar.tradingDates[9]=f.sourceReceipt.calendar.tradingDates[8];
 f.sourceReceipt.receiptHash=await sha256Hex(
  official61SessionSourceReceiptHashBaseV0_1(f.sourceReceipt));
 const r=await run({...f,capture:async()=>{throw Error('PROVIDER_MUST_NOT_BE_CALLED');}});
 assert.equal(r.reason,'INDEPENDENT_122_PAIR_SOURCE_AUDIT_NOT_ACCEPTED');
});
test('tampered independent audit timestamp blocks six provider requests',async()=>{
 const f=await fixture();
 f.independentSourceAudit.auditedAtUtc='2026-09-15T12:30:00Z';
 const r=await run({...f,capture:async()=>{throw Error('PROVIDER_MUST_NOT_BE_CALLED');}});
 assert.equal(r.reason,'INDEPENDENT_122_PAIR_SOURCE_AUDIT_NOT_ACCEPTED');
});
test('tampered or independently re-signed preview still requires bounded hash and source lineage',async()=>{
 const f=await fixture();
 f.preliminaryWatch.watchlist[0].symbol='9999';
 const r=await run({...f,capture:async()=>{throw Error('PROVIDER_MUST_NOT_BE_CALLED');}});
 assert.equal(r.reason,'ACTUAL_PRELIMINARY_WATCH_NOT_AVAILABLE_OR_NOT_MATCHED');
 assert.equal(r.selectedCount,null);
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
