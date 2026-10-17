import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {independentlyReadSingleNativeClassV0_1 as parse}
 from '../migration/issue1068_pita_2330_precut_cfi_four_original_source_readback_v0_1.mjs';
const html=(code='2330',type='Stocks',cfi='ESVUFR')=>
 '<table><tr>'+[
  '1','TW0002330008',code,'TSMC','TWSE LISTED',
  type,'Semiconductor','1994/09/05',cfi,''
 ].map(x=>'<td>'+x+'</td>').join('')+'</tr></table>';
test('native 2330 current-source ordinary equity is reproduced separately from issuer historical PIT',()=>{
 const row=parse({html:html(),code:'2330'});
 assert.deepEqual({symbol:row.code,type:row.type,cfi:row.cfi,market:row.market},{
  symbol:'2330',type:'Stocks',cfi:'ESVUFR',market:'TWSE LISTED'});
});
test('native TDR and ETF cannot be laundered into 2330 stock through CFI or arbitrary first column',()=>{
 for(const v of [
  html('2330','TDR','EDSDDR'),
  html('2330','ETF','CEOGEU')
 ]){const row=parse({html:v,code:'2330'});assert.notEqual(row.cfi,'ESVUFR');}
 assert.throws(()=>parse({html:html('9103'),code:'2330'}),/NATIVE_SYMBOL_NOT_EXACTLY_ONCE/);
});
test('tampered duplicate and malformed native security structure fail before class assumption',()=>{
 assert.throws(()=>parse({html:html()+html(),code:'2330'}),/NATIVE_SYMBOL_NOT_EXACTLY_ONCE/);
 assert.throws(()=>parse({html:html('2330','Stocks','INVALID'),code:'2330'}),/NATIVE_FIELDS_OR_CFI_INVALID/);
 assert.throws(()=>parse({html:html(),code:'XXX'}),/NATIVE_HTML_INPUT_INVALID/);
});
test('origin 4-body verification is no new GET and cannot certify historical class, rank, Frozen or no-pick',async()=>{
 const [script,workflow]=await Promise.all([
 readFile('system2/migration/issue1068_pita_2330_precut_cfi_four_original_source_readback_v0_1.mjs','utf8'),
 readFile('.github/workflows/system2-data-2330-precut-cfi-four-original-audit.yml','utf8')
 ]);
 assert.match(script,/realNativeOriginalBodiesIndependentlyRehashed:4/);
 assert.match(script,/historical61IssuerEffectiveVersionCFICertified:false/);
 assert.match(script,/currentNativeStockClassValidAtFinalCutIndependentlyCertified:false/);
 assert.match(script,/independentAuditLaneFullPitAccepted:false/);
 assert.match(script,/pitEligible:false/);
 assert.match(script,/selectedCount:null,zeroPickDay:null,frozenD1Written:false/);
 assert.doesNotMatch(script,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|UPDATE s2_|orderSubmit/);
 assert.match(workflow,/38877910182/);
 assert.match(workflow,/contents: read/);
 assert.match(workflow,/actions: read/);
 assert.match(workflow,/retention-days: 90/);
 assert.doesNotMatch(workflow,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
});
