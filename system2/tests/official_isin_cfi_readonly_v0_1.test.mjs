import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCurrentIsinCfiV0_1 as parse} from '../scripts/probe_current_isin_cfi_readonly_v0_1.mjs';
test('official ISIN CFI observes 4 digit equity and DR, excludes warrant, certifies neither',()=>{
 const tr=(id,name,isin,cfi)=>'<tr><td>'+id+'　'+name+'</td><td>'+isin+'</td><td>2026/10/13</td><td>TWSE</td><td>產業</td><td>'+cfi+'</td></tr>';
 const html='<html>ISIN Code <table>'+tr('2330','台積電','TW0002330008','ESVUFR')+
  tr('9103','美德醫療-DR','TW0009103000','EDXXXX')+
  tr('700020','認購權證','TW25Z7000206','RWSCCA')+'</table></html>';
 const r=parse({html,market:'TWSE'});
 assert.equal(r.rows.size,2);
 assert.equal(r.rows.get('2330').cfi,'ESVUFR');
 assert.equal(r.rows.get('9103').cfi,'EDXXXX');
 assert.equal(r.rows.has('700020'),false);
});
test('missing official registry marker fails closed',()=>{
 assert.throws(()=>parse({market:'TPEX',html:'<html><table></table></html>'}),/UNVERIFIED/);
});
test('duplicate ISIN securities cannot be counted as independent issuer',()=>{
 const tr='<tr><td>2330 台積電</td><td>TW0002330008</td><td>x</td><td>TWSE</td><td>x</td><td>ESVUFR</td></tr>';
 assert.throws(()=>parse({market:'TWSE',html:'ISIN Code'+tr+tr}),/DUPLICATE_SECURITY_CODE/);
});
test('no regulated order, D1 write or automatic PIT certification',async()=>{
 const {readFile}=await import('node:fs/promises');
 const s=await readFile('system2/scripts/probe_current_isin_cfi_readonly_v0_1.mjs','utf8');
 assert.doesNotMatch(s,/api\.cloudflare\.com|git push|INSERT INTO/);
 assert.match(s,/historicalSecurityClassPITCertified:false/);
});
