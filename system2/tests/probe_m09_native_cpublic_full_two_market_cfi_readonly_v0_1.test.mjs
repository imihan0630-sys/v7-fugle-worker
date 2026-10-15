import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {
 parseM09NativeCpublicFourDigitCfiV0_1 as parse,
 probeM09NativeCpublicOriginalsV0_1 as probe
} from '../scripts/probe_m09_native_cpublic_full_two_market_cfi_readonly_v0_1.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const head='<!DOCTYPE html><html><meta charset="big5"><body><h1>證券編碼國際證券辨識號碼 ISIN Code CFICode</h1><table>';
const foot='</table></body></html>';
const item=(code,cfi='ESVUFR')=>'<tr><td>'+code+' 公司股票</td><td>TW000'+code+'008</td><td>2025/01/01</td><td>上市</td><td>電子</td><td>'+cfi+'</td></tr>';
const mockNative=(n,base)=>head+Array.from({length:n},(_,i)=>item(String(base+i))).join('')+foot;
function make({badTpex=false,security=false,stale=false,tamper=false}={}){
 let gets=0,stores=0;
 return {fetchImpl:async(url,opts)=>{
  gets++;
  assert.equal(opts.method,'GET');
  assert(url.startsWith('https://isin.twse.com.tw/isin/C_public.jsp?strMode='));
  const tpex=url.includes('strMode=4');
  if(badTpex&&tpex)return new Response('blocked',{status:403});
  return new Response(security?'FOR SECURITY REASONS, THIS PAGE CAN NOT BE ACCESSED':
    mockNative(stale?10:tpex?420:690,tpex?4000:1000),{status:200});
 },persistRaw:async({original,sha:expected})=>{
  stores++;
  return {verified:!tamper,sha:sha(original)===expected?expected:'BAD',bytes:original.length};
 },gets:()=>gets,stores:()=>stores};
}
test('parse native listed stock and four-digit native TDR CFI distinctly',()=>{
 const raw=Buffer.from(head+item('2330')+item('9103','EDSDDR')+foot);
 const r=parse({original:raw,market:'TWSE'});
 assert.equal(r.state,'NATIVE_CURRENT_TABLE_PARSED');
 assert.equal(r.rows.length,2);
 assert.equal(r.rows.find(x=>x.symbol==='2330').cfi,'ESVUFR');
 assert.equal(r.rows.find(x=>x.symbol==='9103').cfi,'EDSDDR');
});
test('non-fourdigit and ETF zero prefix do not become ordinary share denominator',()=>{
 const raw=Buffer.from(head+item('2330')+item('0050','CEOGEU')+
  '<tr><td>A123 轉債</td><td>TW000A123008</td><td>2025</td><td>債</td><td>X</td><td>DBVUFR</td></tr>'+foot);
 const r=parse({original:raw,market:'TWSE'});
 assert.equal(r.rows.length,1);assert.equal(r.rows[0].symbol,'2330');
});
test('duplicate symbol and missing CFI are not silently counted as verified native source',()=>{
 const raw=Buffer.from(head+item('2330')+item('2330')+foot);
 const r=parse({original:raw,market:'TWSE'});
 assert.equal(r.state,'NATIVE_SYMBOL_DUPLICATE_OR_INVALID');
 assert.equal(r.duplicateNativeSymbols,1);
 const bad=parse({original:Buffer.from(head+item('2330','BAD')+foot),market:'TWSE'});
 assert.equal(bad.invalidNativeRows,1);
});
test('HTTP200 anti-automation challenge is parsed as explicit SOURCE_BLOCKED',()=>{
 const r=parse({market:'TWSE',original:Buffer.from('<html>FOR SECURITY REASONS, THIS PAGE CAN NOT BE ACCESSED</html>'.padEnd(250))});
 assert.equal(r.state,'NATIVE_SECURITY_BLOCK_FAIL_CLOSED');
});
test('two bounded native official source GETs can prove CURRENT class coverage only',async()=>{
 const f=make();const r=await probe({...f,now:()=>new Date('2026-10-15T05:40:00Z')});
 assert.equal(f.gets(),2);assert.equal(f.stores(),2);
 assert.equal(r.nativeLargeTablesVerified,2);
 assert.equal(r.nativeTotalFourDigitCFIRows,1110);
 assert.equal(r.nativeTotalCurrentESVUFR,1110);
 assert.equal(r.nativeFullCurrentRegistryCandidate,true);
 assert.equal(r.separateIndependentAuditSatisfied,false);
 assert.equal(r.nativeSecurityTypeAsOfHistoricalMarketDateCertified,false);
 assert.equal(r.officialOrdinaryShareEntireMarketPITCertified,false);
 assert.equal(r.selectedCount,null);assert.equal(r.frozenD1Written,false);
 const {receiptHash,...base}=r;assert.equal(receiptHash,await sha256Hex(base));
});
test('real HTTP403 in one market leaves FULL registry unknown without any count promotion',async()=>{
 const f=make({badTpex:true}),r=await probe(f);
 assert.equal(f.gets(),2);
 assert.equal(r.nativeLargeTablesVerified,1);
 assert.equal(r.nativeFullCurrentRegistryCandidate,false);
 assert.equal(r.nativeTotalFourDigitCFIRows,null);
 assert.equal(r.sourceReceipts[1].blocker,'HTTP_NOT_200');
});
test('200 with only ten rows does not pass market native coverage',async()=>{
 const f=make({stale:true}),r=await probe(f);
 assert.equal(r.nativeLargeTablesVerified,0);
 assert.equal(r.nativeFullCurrentRegistryCandidate,false);
});
test('raw body writeback SHA mismatch denies both native markets',async()=>{
 const f=make({tamper:true}),r=await probe(f);
 assert.equal(r.nativeSourcesObserved,0);
 assert(r.sourceReceipts.every(x=>x.blocker==='RAW_BYTES_MISMATCH'));
});
test('workflow is read-only, push-only real original probe, never Cron or cloud writer',async()=>{
 const [s,w]=await Promise.all([
  readFile('system2/scripts/probe_m09_native_cpublic_full_two_market_cfi_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-native-cpublic-two-markets-readonly.yml','utf8')
 ]);
 assert.match(w,/contents: read/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.match(w,/github.event_name == 'push'/);
 assert.doesNotMatch(s,/api\.cloudflare\.com|wrangler deploy|INSERT INTO|git push/);
 assert.match(s,/officialOrdinaryShareEntireMarketPITCertified:false/);
});
