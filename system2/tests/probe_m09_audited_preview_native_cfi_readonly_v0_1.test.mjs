import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {probeM09AuditedPreviewNativeCfiV0_1 as run}
 from '../scripts/probe_m09_audited_preview_native_cfi_readonly_v0_1.mjs';
const h='a'.repeat(64);
async function fixture(codes=['2330','9103','3287','9105','1301']){
 const s={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  state:'SOURCE_OBSERVED_UNAUDITED',marketDate:'2026-10-14',
  receivedMarketDateCount:122,receiptHash:h,
  calendar:{tradingDates:Array.from({length:61},(_,i)=>String(i+1))}};
 s.calendar.tradingDates[60]='2026-10-14';
 const a={schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  sourceReceiptHash:s.receiptHash,marketDate:s.marketDate,
  sourceMarketDatePairsVerified:122,originalFilesRehashedAfterDownload:122,
  originalFilesDecompressedAndParsed:122,auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  selectionAuthorized:false};
 a.auditHash=await sha256Hex(a);
 const w={schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  watchVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2',
  state:'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  marketDate:s.marketDate,originalSourceReceiptHash:s.receiptHash,
  independentSourceAuditHash:a.auditHash,
  ordinaryEquityOnlyUniverseCertified:false,finalSelectionAuthorized:false,
  selectedCount:null,frozenWritten:false,displayedCount:codes.length,
  watchlist:codes.map((symbol,i)=>({symbol,market:i%2?'TPEX':'TWSE',strategyRank:null}))};
 w.receiptHash=await sha256Hex(w);
 return {sourceReceipt:s,independentA1Audit:a,preliminaryWatch:w};
}
function stubProbe({requests,unknownCode=null,mismatchCode=null,tibCode=null}={}){
 return async({controls})=>{
  requests?.push(controls.map(x=>x.code));
  return {controlsChecked:controls.length,ordinaryCommonSharePITCertified:false,
   selectedCount:null,sourceReceipts:controls.map(x=>({
    code:x.code,controlIntent:x.hint,
    state:x.code===unknownCode?'NATIVE_ACCESS_CHALLENGE_FAIL_CLOSED':'NATIVE_SINGLE_CFI_ROW_OBSERVED',
    nativeMarketLabel:x.code===tibCode?'TAIWAN INNOVATION BOARD':
      x.code===mismatchCode?'OTHER MARKET':
      x.hint.endsWith('TPEX')?'TPEx LISTED':'TWSE LISTED',
    nativeTypeLabel:(x.code==='9103'||x.code==='9105')?'TDR':'Stocks',
    cfi:(x.code==='9103'||x.code==='9105')?'EDSDDR':'ESVUFR',
    isin:'TW0002330008',observedAtUtc:'2026-10-15T02:21:00Z',
    originalSha256:h,originalBytes:1000,rawByteReadback:true
   }))};
 };
}
test('five real-watch identities scanned in strictly bounded batches 4+1',async()=>{
 const f=await fixture(),requests=[];
 const r=await run({...f,probeOne:stubProbe({requests}),
  now:()=>new Date('2026-10-15T02:21:00Z'),
  fetchImpl:async()=>{throw Error('fake fetch unused')},persistRaw:async()=>null});
 assert.deepEqual(requests.map(g=>g.length),[4,1]);
 assert.equal(r.preliminaryDenominator,5);
 assert.equal(r.currentNativeStockCfiObserved,3);
 assert.equal(r.currentNativeNonShareExplicit,2);
 assert.equal(r.currentNativeUnverified,0);
 assert.equal(r.historicalOrdinarySharePitCertified,0);
 assert.equal(r.selectionRank,null);assert.equal(r.selectedCount,null);
 assert.equal(r.frozenD1Written,false);assert.equal(r.cloudflareD1Writes,0);
 const {receiptHash,...base}=r;assert.equal(receiptHash,await sha256Hex(base));
});
test('unreachable native source remains UNKNOWN, never stock class',async()=>{
 const f=await fixture(),r=await run({...f,
  probeOne:stubProbe({unknownCode:'2330'}),
  fetchImpl:async()=>null,persistRaw:async()=>null});
 assert.equal(r.currentNativeStockCfiObserved,2);
 assert.equal(r.currentNativeUnverified,1);
 assert.equal(r.currentNativeRowsAllObserved,false);
 assert.equal(r.historicalOrdinarySharePitDenominatorCertified,false);
});
test('official TWSE Taiwan Innovation Board is explicitly mapped but never auto-admitted',async()=>{
 const f=await fixture(['6645','2330']);
 const r=await run({...f,probeOne:stubProbe({tibCode:'6645'}),
  fetchImpl:async()=>null,persistRaw:async()=>null});
 assert.equal(r.currentNativeStockCfiObserved,2);
 assert.equal(r.currentNativeInnovationBoardStocks,1);
 assert.equal(r.innovationBoardSpecialStrategyEligibilityCertified,false);
 assert.equal(r.observations[0].nativeExchangeBoard,'TWSE_INNOVATION_BOARD_TIB');
 assert.equal(r.observations[0].nativeMarketMatchesPreliminaryMarket,true);
 assert.equal(r.observations[0].innovationBoardSpecialEligibilityStillUnverified,true);
 assert.equal(r.historicalOrdinarySharePitCertified,0);
 assert.equal(r.selectedCount,null);
});
test('native exchange mismatch cannot be used to qualify even current security type',async()=>{
 const f=await fixture(),r=await run({...f,
  probeOne:stubProbe({mismatchCode:'2330'}),
  fetchImpl:async()=>null,persistRaw:async()=>null});
 assert.equal(r.currentNativeStockCfiObserved,2);
 assert.equal(r.currentNativeUnverified,1);
 assert.equal(r.observations[0].nativeMarketMatchesPreliminaryMarket,false);
 assert.equal(r.historicalOrdinarySharePitCertified,0);
});
test('forged/tampered preview signed SHA cannot trigger a single native GET',async()=>{
 const f=await fixture();f.preliminaryWatch.watchlist[0].symbol='2317';
 let n=0;
 await assert.rejects(()=>run({...f,probeOne:async()=>{n++;},fetchImpl:async()=>null,
  persistRaw:async()=>null}),/M09_PREVIEW_NATIVE_CFI_PRELIMINARY_WATCH_HASH_MISMATCH/);
 assert.equal(n,0);
});
test('fake A1 audit SHA/121 pairs blocks physical native calls',async()=>{
 const f=await fixture();f.independentA1Audit.sourceMarketDatePairsVerified=121;
 await assert.rejects(()=>run({...f,probeOne:async()=>{throw Error('NO_GET_ALLOWED');}}),
  /M09_PREVIEW_NATIVE_CFI_INDEPENDENT_A1_AUDIT_NOT_BOUND/);
});
test('31 symbol requests, duplicate code identity and missing preliminary are denied',async()=>{
 const a=await fixture(Array.from({length:31},(_,i)=>String(1000+i)));
 await assert.rejects(()=>run(a),/M09_PREVIEW_NATIVE_CFI_ORIGINAL_PRELIMINARY_WATCH_INVALID/);
 const b=await fixture(['2330','2330']);b.preliminaryWatch.watchlist[1].market='TWSE';
 b.preliminaryWatch.receiptHash=await sha256Hex(
  Object.fromEntries(Object.entries(b.preliminaryWatch).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>run(b),/M09_PREVIEW_NATIVE_CFI_PREVIEW_SYMBOL_OR_AUTHORITY_INVALID/);
});
test('workflow must retrieve exact authentic Oct14 A1/audit and leave Formal boundary intact',async()=>{
 const [src,w]=await Promise.all([
  readFile('system2/scripts/probe_m09_audited_preview_native_cfi_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-preview-native-cfi-real-once-readonly.yml','utf8')
 ]);
 assert.match(w,/38629859058/);assert.match(w,/38630106632/);
 assert.match(w,/contents: read/);assert.match(w,/actions: read/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.match(src,/historicalOrdinarySharePitCertified:0/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|git push/);
});
