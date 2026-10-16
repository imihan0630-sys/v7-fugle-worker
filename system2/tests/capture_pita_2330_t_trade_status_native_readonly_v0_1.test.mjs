import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {capturePita2330TradeStatusOriginalV0_1 as capture}
 from '../scripts/capture_pita_2330_t_trade_status_native_readonly_v0_1.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const columns=['證券代號','證券名稱','成交股數','成交筆數',
 '成交金額','開盤價','最高價','最低價','收盤價'];
function fakeA1({volume='1000000',trades='1020',badDate=false}={}){
 const data=Array.from({length:630},(_,i)=>{
  const s=String(i+2000);
  return [s,s==='2330'?'台積電':'控制',
    volume,trades,'150000000','150','155','148','151'];
 });
 return Buffer.from(JSON.stringify({
  date:badDate?'20261015':'20261016',
  tables:[{title:'115年10月16日 收盤行情',fields:columns,data}]
 }));
}
const fields=['證券代號','證券名稱','暫停交易日期','恢復交易日期'];
const goodControl={stat:'OK',fields,data:[['1218','泰山','115/08/13','115/08/14']]};
const noTarget={stat:'很抱歉，沒有符合條件的資料！'};
function harness({start='2026-10-16T14:41:05.000Z',stop=null,
  control=goodControl,target=noTarget,failStorage=false,badA1=null,
  http=200}={}){
 const raw=badA1||fakeA1();
 const original=Buffer.from(raw);
 const seen=[];
 const today=()=>new Date(stop||start);
 return {
  now:today,
  expectedA1NativeIdentity:{sha256:hash(original),bytes:original.length,rows:630},
  readA1NativeOriginal:async()=>original,
  fetchImpl:async(url,options)=>{
    seen.push(url);
    assert.equal(options.method,'GET');
    assert.equal(new URL(url).host,'www.twse.com.tw');
    assert.equal(new URL(url).searchParams.get('response'),'json');
    return new Response(JSON.stringify(seen.length===1?control:target),
      {status:http,headers:{'content-type':'application/json;charset=UTF-8'}});
  },
  persistNative:async({raw,originalSha256})=>({
    verified:!failStorage,sha256:hash(raw),byteLength:raw.length
  }),
  getCalls:()=>seen,
 };
}
test('T-session native source positive trades + known 1218 status control, no automatic NO_SUSPENSION',async()=>{
 const x=harness();const r=await capture(x);
 assert.equal(x.getCalls().length,2);
 assert.equal(r.currentSessionStockActuallyTraded,true);
 assert.equal(r.currentSessionStockVolumeShares,1000000);
 assert.equal(r.currentSessionStockTradeCount,1020);
 assert.equal(r.controlKnown1218SuspensionConfirmed,true);
 assert.equal(r.currentDateTwTaWuNative2330Rows,0);
 assert.equal(r.observed20261016SourceTradeableState,
   'T_SESSION_A1_TRADED_TWTAWU_ABSENCE_NOT_AUTHORITATIVE');
 assert.equal(r.authoritativeNegativeNoSuspensionCertified,false);
 assert.equal(r.tradeableAtDecisionCutIndependentlyCertified,false);
 assert.equal(r.pitEligible,false);assert.equal(r.selectionAuthorized,false);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);assert.equal(r.cloudflareD1Writes,0);
 for(const f of r.tradingStatusSources){
  assert.equal(f.rawBytesGzipRehashed,true);
  assert.equal(f.absenceCertifiesNoSuspension,false);
  assert.equal(f.authoritativeCompletenessCertified,false);
  assert.equal(f.originalNativeBodySha256.length,64);
 }
 const {receiptHash,...unsigned}=r;
 assert.equal(receiptHash,await sha256Hex(unsigned));
});
test('one 2330 suspension positive MUST be escalated, never converted to tradeable',async()=>{
 const x=harness({target:{stat:'OK',fields,data:[['2330','台積電','115/10/16','--']]}});
 const r=await capture(x);
 assert.equal(r.currentDateTwTaWuNative2330Rows,1);
 assert.equal(r.observed20261016SourceTradeableState,
  'POSSIBLE_SUSPENSION_EVENT_FOUND_REVIEW_REQUIRED');
 assert.equal(r.tradeableAtDecisionCutIndependentlyCertified,false);
 assert.equal(r.pitEligible,false);
});
test('known suspension positive control missing rejects whole source query before negative conclusion',async()=>{
 const x=harness({control:{stat:'OK',fields,data:[]}});
 await assert.rejects(()=>capture(x),/KNOWN_POSITIVE_1218_ORIGINAL_NOT_PRESENT/);
 assert.equal(x.getCalls().length,1);
});
test('source unavailable, forged raw body identity or post-cut capture fail closed',async()=>{
 for(const x of [
  harness({http:403}),harness({failStorage:true}),
  harness({start:'2026-10-16T15:45:00.000Z'}),
  harness({start:'2026-10-17T00:10:00.000Z'}),
  harness({start:'2026-10-16T05:00:00.000Z'}),
  harness({badA1:fakeA1({badDate:true})}),
  harness({badA1:fakeA1({volume:'0',trades:'0'})}),
 ]){
  await assert.rejects(()=>capture(x),/S2_PITA_2330_STATUS_/);
 }
});
test('bounded official status GET requires exact original scope, no Cloudflare or order authority',async()=>{
 const [src,yml]=await Promise.all([
  readFile('system2/scripts/capture_pita_2330_t_trade_status_native_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-pita-2330-t-trade-status-native-20261016.yml','utf8'),
 ]);
 assert.match(src,/TWTAWU_KNOWN_POSITIVE_1218/);
 assert.match(src,/TWTAWU_T_SESSION/);
 assert.match(src,/flag:'wx'/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|UPDATE s2_|orders/);
 assert.match(yml,/contents: read/);
 assert.match(yml,/actions: read/);
 assert.match(yml,/38908458028/);
 assert.match(yml,/retention-days: 90/);
 assert.doesNotMatch(yml,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
});
