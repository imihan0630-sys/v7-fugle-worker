import test from 'node:test';
import assert from 'node:assert/strict';
import {probeOfficialTpexOct13CloseV0_1 as probe}
 from '../scripts/probe_20261013_tpex_exact_close_readonly_v0_1.mjs';
const DATE='2026-10-13T11:35:00Z';
function body(date='20261013',n=500){
 return Buffer.from(JSON.stringify({date,stat:'OK',tables:[{
  fields:['代號','名稱','成交股數','開盤','最高','最低','收盤','成交金額(元)','成交筆數'],
  data:Array.from({length:n},(_,i)=>{
   const id=String(5000+i);return [id,'TEST '+id,'100,000','100','101','99','100',
    '10,000,000','50'];
  })
 }]}));
}
function fake(data,status=200){
 return async()=>({ok:status===200,status,arrayBuffer:async()=>data});
}
test('actual provider-formatted 10/13 TPEX row source yields raw hash, never selected',async()=>{
 const result=await probe({fetchImpl:fake(body()),clock:()=>new Date(DATE),attempts:1});
 assert.equal(result.state,'REAL_OFFICIAL_TPEX_CLOSE_SOURCE_OBSERVED_PIT_UNAUDITED');
 assert.equal(result.ordinaryStockCount,500);
 assert.equal(result.originalRawBytes,body().length);
 assert.match(result.originalRawSha256,/^[0-9a-f]{64}$/);
 assert.equal(result.selectionAuthorized,false);
 assert.equal(result.selectedCount,null);
});
test('stale 10/12 response is NOT latest official 10/13',async()=>{
 const result=await probe({fetchImpl:fake(body('20261012')),clock:()=>new Date(DATE),
  attempts:1});
 assert.equal(result.state,'OFFICIAL_TPEX_SOURCE_NOT_ACCEPTED');
 assert.equal(result.failures[0].reason,'SOURCE_DATE_MISMATCH');
});
test('200 JSON without canonical table is NOT 10/13 official stock data',async()=>{
 const result=await probe({fetchImpl:fake(Buffer.from('{"date":"20261013","tables":[]}')),
  clock:()=>new Date(DATE),attempts:1});
 assert.equal(result.state,'OFFICIAL_TPEX_SOURCE_NOT_ACCEPTED');
 assert.equal(result.ordinaryStockCount,null);
});
test('too few ordinary rows fail closed',async()=>{
 const result=await probe({fetchImpl:fake(body('20261013',5)),
  clock:()=>new Date(DATE),attempts:1});
 assert.equal(result.state,'OFFICIAL_TPEX_SOURCE_NOT_ACCEPTED');
});
test('HTTP error cannot be called source READY',async()=>{
 const result=await probe({fetchImpl:fake(Buffer.from('x'),503),
  clock:()=>new Date(DATE),attempts:1});
 assert.equal(result.state,'OFFICIAL_TPEX_SOURCE_NOT_ACCEPTED');
 assert.equal(result.failures[0].reason,'NATIVE_HTTP_NOT_200');
});
