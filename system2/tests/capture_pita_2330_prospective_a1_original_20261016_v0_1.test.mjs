import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {capturePita2330OriginalV0_1 as capture,
 DAY,CUT} from '../scripts/capture_pita_2330_prospective_a1_original_20261016_v0_1.mjs';
const digest=b=>createHash('sha256').update(b).digest('hex');
const started='2026-10-16T13:15:20.000Z',readAt='2026-10-16T13:15:21.000Z';
function native({date='20261016',omit=false,duplicate=false}={}){
 const fields=['證券代號','證券名稱','成交股數','成交筆數','成交金額',
  '開盤價','最高價','最低價','收盤價'];
 const data=Array.from({length:630},(_,i)=>{
   const s=String(i+2000);
   return [s,s==='2330'?'台積電':'測試名', '1000000','1000','150000000','150','155','148','151'];
 });
 if(omit)data.splice(330,1);
 if(duplicate)data.push([...data[330]]);
 return JSON.stringify({date,tables:[{title:'115年10月16日 收盤行情',fields,data}]});
}
function mock({
 date='20261016',start=started,read=readAt,
 corrupt=false,http=200,omit=false,duplicate=false
}={}){
 let get=0,persist=0;
 const now=()=>new Date(get?read:start);
 const fetchImpl=async(url,options)=>{
  get++;
  assert.equal(options.method,'GET');
  assert.equal(url,'https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20261016&type=ALLBUT0999');
  return new Response(native({date,omit,duplicate}),{status:http});
 };
 const persistOriginal=async({raw,originalSha256})=>{
  persist++;
  return {verified:!corrupt,sha256:digest(raw),byteLength:raw.length};
 };
 return {now,fetchImpl,persistOriginal,
  gets:()=>get,stored:()=>persist};
}
test('real-shape 630-row native TWSE T response archived and source-only classified, not PIT',async()=>{
 const f=mock(),r=await capture(f);
 assert.equal(f.gets(),1);assert.equal(f.stored(),1);
 assert.equal(r.schemaVersion,'S2_DATA_PITA_2330_PROSPECTIVE_A1_ORIGINAL_V0_1');
 assert.equal(r.marketDate,DAY);assert.equal(r.symbol,'2330');
 assert.equal(r.actualFirstPhysicalObservedAtUtc,readAt);
 assert.equal(r.nativeMarketSourceRowCount,630);
 assert.equal(r.sourceNativeBodySha256.length,64);
 assert.equal(r.currentTradingDaySourceBar.open,150);
 assert.equal(r.currentTradingDaySourceBar.close,151);
 assert.equal(r.currentTradingDaySourceBar.volumeShares,1_000_000);
 assert.equal(r.currentTradingDaySourceBar.nativeSourceFieldsSha256.length,64);
 assert.equal(r.originalBodySavedAndByteRehashed,true);
 assert.equal(r.targetResearchCutUtc,CUT);
 assert.equal(r.historical61WindowJoinedAndIndependentlyAudited,false);
 assert.equal(r.historicalCfiEffectivePeriodsCertified,false);
 assert.equal(r.caRevisionsAndNoEventCertified,false);
 assert.equal(r.sameDayIndependentAuditAccepted,false);
 assert.equal(r.researchCutOfficiallyAuthorized,false);
 assert.equal(r.pitEligible,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.system1FormalCoreChanged,false);
 const {receiptHash,...unsigned}=r;
 assert.equal(await sha256Hex(unsigned),receiptHash);
});
test('before close / after hard cut / wrong Taipei date refuse zero-GET',async()=>{
 for(const time of [
   '2026-10-16T05:29:59.000Z',
   '2026-10-16T15:45:00.000Z',
   '2026-10-16T15:46:00.000Z',
   '2026-10-15T13:15:00.000Z',
   '2026-10-17T01:15:00.000Z',
 ]){
  const f=mock({start:time,read:time});
  await assert.rejects(()=>capture(f),/NOT_TODAY_BEFORE_REAL_RESEARCH_CUT/);
  assert.equal(f.gets(),0);
 }
});
test('source body read that completes after cut fails without accepting old clock',async()=>{
 const f=mock({start:'2026-10-16T15:44:50.000Z',read:'2026-10-16T15:45:01.000Z'});
 await assert.rejects(()=>capture(f),/ORIGINAL_AVAILABLE_TOO_LATE_FOR_CUT/);
 assert.equal(f.gets(),1);
 assert.equal(f.stored(),0);
});
test('stale target date, missing 2330, duplicate and 403 are not stock-original proof',async()=>{
 const samples=[
  [mock({date:'20261015'}),/PROVIDER_DATE_OR_TABLE_UNVERIFIED/],
  [mock({omit:true}),/ONE_NATIVE_2330_BAR_MISSING_OR_DUPLICATE/],
  [mock({duplicate:true}),/PROVIDER_DATE_OR_TABLE_UNVERIFIED/],
  [mock({http:403}),/OFFICIAL_HTTP_NOT_200/],
  [mock({corrupt:true}),/RAW_READBACK_OR_HASH_INVALID/],
 ];
 for(const [f,err] of samples){
  await assert.rejects(()=>capture(f),err);
  assert.equal(f.gets(),1);
 }
});
test('one scoped public HTTPS GET, create-only bytes and no Cloudflare/strategy authority',async()=>{
 const [script,workflow]=await Promise.all([
  readFile('system2/scripts/capture_pita_2330_prospective_a1_original_20261016_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-pita-first-symbol-a1-original-20261016.yml','utf8')
 ]);
 assert.match(script,/flag:'wx'/);
 assert.doesNotMatch(script,/wrangler|api\.cloudflare\.com|INSERT INTO|orders|trade execution/i);
 assert.match(workflow,/contents: read/);
 assert.doesNotMatch(workflow,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.match(workflow,/github\.event_name == 'push'/);
 assert.match(workflow,/retention-days: 90/);
 assert.match(workflow,/2026-10-16/);
});
