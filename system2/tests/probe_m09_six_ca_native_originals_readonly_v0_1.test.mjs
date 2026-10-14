import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {probeM09SixCaOriginalsV0_1 as probe}
 from '../scripts/probe_m09_six_ca_native_originals_readonly_v0_1.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const startDate='2026-07-01',marketDate='2026-10-14';
const clock=()=>new Date('2026-10-15T00:25:00Z');
function responseBody(sourceUrl,{stale=false,html=false}={}){
 if(html)return Buffer.from('<!doctype html><html><body>error container source not available</body></html>');
 const date=stale?'2026-07-01~2026-10-13':
  sourceUrl.includes('tpex.org.tw')?'2026/07/01~2026/10/14':'20260701~20261014';
 return Buffer.from(JSON.stringify({
  stat:'OK',date,tables:[{title:'公司行動實際公告',
   fields:['證券代號','現行交易日','除權息'],
   data:[['2330','2026-08-06','樣本']] }]
 }));
}
function fake({badId=null,staleId=null,htmlId=null,storeOk=true}={}){
 let reads=0,writes=0;
 const fetchImpl=async url=>{
  reads++;
  const id=url.includes('/exRight/TWT49U')?'TWSE_EX_RIGHT_DIVIDEND_ACTUAL':
   url.includes('/reducation/TWTAUU')?'TWSE_CAPITAL_REDUCTION_REFERENCE':
   url.includes('/change/TWTB8U')?'TWSE_PAR_VALUE_CHANGE_REFERENCE':
   url.includes('/bulletin/exDailyQ')?'TPEX_EX_RIGHT_DIVIDEND_ACTUAL':
   url.includes('/bulletin/revivt')?'TPEX_CAPITAL_REDUCTION_REFERENCE':
   url.includes('/bulletin/pvChgRslt')?'TPEX_PAR_VALUE_CHANGE_REFERENCE':'UNKNOWN';
  return new Response(responseBody(url,{stale:staleId===id,html:htmlId===id}),
   {status:id===badId?503:200});
 };
 const persistRaw=async({original,sha256})=>{
  writes++;
  return {verified:storeOk,sha256:sha(original)===sha256?sha256:'BAD',
   byteLength:original.length};
 };
 return {fetchImpl,persistRaw,reads:()=>reads,writes:()=>writes};
}
const input=f=>({startDate,marketDate,now:clock,...f});
test('six native original-byte SHA receipts do NOT certify any CA or no-event PIT',async()=>{
 const f=fake();const r=await probe(input(f));
 assert.equal(f.reads(),6);assert.equal(f.writes(),6);
 assert.equal(r.sourcesRetainedOriginalBytes,6);
 assert.equal(r.nativeRangeSchemaCandidates,6);
 assert.equal(r.state,'SIX_RAW_SOURCES_CAPTURED_AUTHORITY_UNVERIFIED');
 assert(r.sourceReceipts.every(x=>x.originalBytesReadBackLocally));
 assert(r.sourceReceipts.every(x=>x.nativeSchema?.responseRangeVerified));
 assert(r.sourceReceipts.every(x=>x.firstKnownAtEvidenceClass==='FIRST_PHYSICAL_OBSERVATION_NOW_NOT_HISTORICAL_PUBLICATION'));
 assert.equal(r.historicalFirstKnownAtCertified,false);
 assert.equal(r.entireRangeCorrectionAndCancellationCoverageCertified,false);
 assert.equal(r.noEventMayBeClaimed,false);
 assert.equal(r.continuityCertified,false);
 assert.equal(r.selectionAuthorized,false);assert.equal(r.selectedCount,null);
 assert.equal(r.frozenD1Written,false);assert.equal(r.cloudflareD1Writes,0);
 const {receiptHash,...base}=r;assert.equal(await sha256Hex(base),receiptHash);
 assert(!JSON.stringify(r).includes('樣本'));
});
test('an official HTTP 503 is 5/6 with precise negative receipt and never an empty-no-action claim',async()=>{
 const f=fake({badId:'TPEX_CAPITAL_REDUCTION_REFERENCE'});
 const r=await probe(input(f));
 assert.equal(r.sourcesRetainedOriginalBytes,5);
 assert.equal(r.state,'SIX_RAW_SOURCES_PARTIAL_OR_UNAVAILABLE');
 assert.equal(r.sourceReceipts.find(x=>x.sourceId==='TPEX_CAPITAL_REDUCTION_REFERENCE').blocker,'HTTP_UNAVAILABLE');
 assert.equal(r.noEventMayBeClaimed,false);
});
test('HTTP 200 stale date range is not counted as a valid native range candidate',async()=>{
 const f=fake({staleId:'TWSE_EX_RIGHT_DIVIDEND_ACTUAL'});
 const r=await probe(input(f));
 assert.equal(r.sourcesRetainedOriginalBytes,6);
 assert.equal(r.nativeRangeSchemaCandidates,5);
 assert.equal(r.sourceReceipts[0].nativeSchema.responseRangeVerified,false);
 assert.equal(r.sourceReceipts[0].state,'RAW_OBSERVED_SCHEMA_OR_RANGE_UNVERIFIED');
});
test('HTTP 200 HTML cannot become CA native-schema historical range evidence',async()=>{
 const f=fake({htmlId:'TWSE_CAPITAL_REDUCTION_REFERENCE'});
 const r=await probe(input(f));
 assert.equal(r.sourcesRetainedOriginalBytes,6);
 assert.equal(r.nativeRangeSchemaCandidates,5);
 assert.equal(r.sourceReceipts[1].nativeSchema.recognizedStructure,false);
});
test('tampered local original byte readback is forbidden even for 200',async()=>{
 const f=fake({storeOk:false});
 const r=await probe(input(f));
 assert.equal(r.sourcesRetainedOriginalBytes,0);
 assert(r.sourceReceipts.every(x=>x.blocker==='ORIGINAL_READBACK_FAILED'));
 assert.equal(r.noEventMayBeClaimed,false);
});
test('reversed date, impossible date and absent storage are denied before any GET',async()=>{
 const f=fake();
 for(const dates of [
  {startDate:'2026-10-15',marketDate:'2026-10-14'},
  {startDate:'2026-02-30',marketDate:'2026-10-14'},
  {startDate:'2026-07-01',marketDate:'2026-10-99'}
 ])await assert.rejects(()=>probe({...input(f),...dates}),/M09_CA_DATE_OR_IO_INVALID/);
 await assert.rejects(()=>probe({...input(f),persistRaw:null}),/M09_CA_DATE_OR_IO_INVALID/);
 assert.equal(f.reads(),0);
});
test('GitHub workflow is credential-free and does not write cloud or authorize Stage1',async()=>{
 const [src,workflow]=await Promise.all([
  readFile('system2/scripts/probe_m09_six_ca_native_originals_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-six-ca-native-originals-readonly.yml','utf8')
 ]);
 assert.match(workflow,/contents: read/);
 assert.doesNotMatch(workflow,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|git push|CREATE TABLE/);
 assert.match(src,/historicalFirstKnownAtCertified:false/);
});
