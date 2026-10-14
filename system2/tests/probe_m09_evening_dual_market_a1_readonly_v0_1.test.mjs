import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {probeM09EveningDualMarketA1V0_1 as probe}
 from '../scripts/probe_m09_evening_dual_market_a1_readonly_v0_1.mjs';
const AT='2026-10-14T12:04:00Z',T='2026-10-14';
const twseFields=['證券代號','證券名稱','成交股數','成交筆數','成交金額',
 '開盤價','最高價','最低價','收盤價'];
const tpexFields=['代號','名稱','成交股數','成交筆數','成交金額(元)',
 '開盤','最高','最低','收盤'];
const hash=x=>createHash('sha256').update(x).digest('hex');
function raw(market,date=T,limit=null){
 const isTwse=market==='TWSE';
 const count=limit??(isTwse?600:450);
 const fields=isTwse?twseFields:tpexFields;
 const data=Array.from({length:count},(_,i)=>[
  String((isTwse?2000:3000)+i),'合成試驗'+i,'1,000','10','100,000',
  '10','11','9','10.5'
 ]);
 return Buffer.from(JSON.stringify({date:date.replaceAll('-',''),stat:'OK',
  tables:[{title:'每日行情',fields,data}]}));
}
function make({wrongTpex=false,tpexHttp=200,clock=AT,store=true}={}){
 let count=0;
 const transport=async url=>{
  count++;
  const m=url.includes('twse.com.tw')?'TWSE':'TPEX';
  const body=raw(m,m==='TPEX'&&wrongTpex?'2026-10-13':T);
  return new Response(body,{status:m==='TPEX'?tpexHttp:200});
 };
 const now=()=>new Date(clock);
 const persistRaw=async({raw,originalSha256})=>({
  verified:store,sha256:hash(raw)===originalSha256?originalSha256:'x',
  byteLength:raw.length
 });
 return {transport,now,persistRaw,getCount:()=>count};
}
test('18:59 remains skipped without a single provider GET or frozen decision',async()=>{
 const f=make({clock:'2026-10-14T10:59:00Z'});
 const r=await probe({fetchImpl:f.transport,now:f.now,persistRaw:f.persistRaw});
 assert.equal(r.state,'SKIPPED_OUTSIDE_19_TO_24_TAIPEI_PRELIMINARY_WINDOW');
 assert.equal(f.getCount(),0);assert.equal(r.selectedCount,null);
 assert.equal(r.finalSelectionAuthorized,false);
});
test('two native T exact-date original-byte readbacks are preliminary only',async()=>{
 const f=make();
 const r=await probe({fetchImpl:f.transport,now:f.now,persistRaw:f.persistRaw});
 assert.equal(f.getCount(),2);
 assert.equal(r.state,'DUAL_MARKET_T_SOURCE_PRELIMINARY_READY');
 assert.equal(r.sourceDate,T);assert.equal(r.sourceLanesVerified,2);
 assert.deepEqual(r.marketLaneReceipts.map(x=>x.fourDigitQuoteRows),[600,450]);
 assert(r.marketLaneReceipts.every(x=>x.originalSha256?.length===64));
 assert(r.marketLaneReceipts.every(x=>x.originalBytesReadBackLocally===true));
 assert.equal(r.originalProviderBytesIndependentlyAudited,false);
 assert.equal(r.ordinaryEquityClassCertified,false);
 assert.equal(r.corporateActionPitCertified,false);
 assert.equal(r.finalSelectionAuthorized,false);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.cloudflareD1Writes,0);
 const {receiptHash,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
 // Only aggregate; never expose issuer names or raw provider rows in JSON.
 assert.equal(JSON.stringify(r).includes('合成試驗'),false);
});
test('stale HTTP 200 TPEx date blocks dual-market acceptance',async()=>{
 const f=make({wrongTpex:true});
 const r=await probe({fetchImpl:f.transport,now:f.now,persistRaw:f.persistRaw});
 assert.equal(r.sourceLanesVerified,1);
 assert.equal(r.state,'DUAL_MARKET_T_SOURCE_INCOMPLETE_FAIL_CLOSED');
 assert.equal(r.marketLaneReceipts[1].blocker,'PROVIDER_DATE_MISMATCH');
 assert.equal(r.selectedCount,null);
});
test('missing second native market cannot fake a full denominator',async()=>{
 const f=make({tpexHttp:503});
 const r=await probe({fetchImpl:f.transport,now:f.now,persistRaw:f.persistRaw});
 assert.equal(r.sourceLanesVerified,1);assert.equal(r.marketLaneReceipts[1].blocker,'HTTP_NOT_200');
 assert.equal(r.finalSelectionAuthorized,false);
});
test('provider row-count truncation is not accepted even with exact date and 200',async()=>{
 const f=make();const original=f.transport;
 f.transport=async url=>{
  if(url.includes('tpex.org.tw'))return new Response(raw('TPEX',T,150),{status:200});
  return original(url);
 };
 const r=await probe({fetchImpl:f.transport,now:f.now,persistRaw:f.persistRaw});
 assert.equal(r.state,'DUAL_MARKET_T_SOURCE_INCOMPLETE_FAIL_CLOSED');
 assert.equal(r.marketLaneReceipts[1].blocker,'DATE_OR_DENOMINATOR_INCOMPLETE');
});
test('unverified original byte write/readback does not certify a source',async()=>{
 const f=make({store:false});
 const r=await probe({fetchImpl:f.transport,now:f.now,persistRaw:f.persistRaw});
 assert.equal(r.sourceLanesVerified,0);
 assert(r.marketLaneReceipts.every(x=>x.blocker==='BYTE_PRESERVATION_UNVERIFIED'));
});
test('response-complete time crossing Taipei midnight is NOT backdated as T',async()=>{
 let k=0;
 const f=make({clock:'2026-10-14T15:59:59Z'});
 const r=await probe({fetchImpl:f.transport,persistRaw:f.persistRaw,
  now:()=>new Date(k++===0?'2026-10-14T15:59:59Z':'2026-10-14T16:00:01Z')});
 assert.equal(r.sourceLanesVerified,0);
 assert.equal(r.marketLaneReceipts[0].blocker,'OBSERVATION_CROSSED_MIDNIGHT');
 assert.equal(r.selectedCount,null);
});
test('scope must remain native HTTPS GET only, no secrets/worker/recurring cron',async()=>{
 const [src,yml]=await Promise.all([
  readFile('system2/scripts/probe_m09_evening_dual_market_a1_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-evening-dual-a1-readonly.yml','utf8')
 ]);
 assert.match(yml,/contents: read/);
 assert.doesNotMatch(yml,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|git push|CREATE TABLE/);
 assert.match(src,/originalProviderBytesIndependentlyAudited:false/);
});
