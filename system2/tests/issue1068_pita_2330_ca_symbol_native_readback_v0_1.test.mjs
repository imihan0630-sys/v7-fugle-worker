import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sourceNativeRowsForSymbolV0_1 as extract}
 from '../migration/issue1068_pita_2330_ca_symbol_native_readback_v0_1.mjs';
const TWSE='TWSE_EX_RIGHT_DIVIDEND_ACTUAL';
const TPEX='TPEX_EX_RIGHT_DIVIDEND_ACTUAL';
const fields=['資料日期','股票代號','股票名稱','除權息參考價'];
const data=[['115年09月16日','2330','台積電','2,377.99'],
 ['115年09月16日','2317','鴻海','190']];
test('TWSE native root fields+data extracts exactly the 2330 known dividend event, without NO_EVENT',()=>{
 const got=extract({sourceId:TWSE,payload:{fields,data}});
 assert.equal(got.totalNativeRows,2);
 assert.equal(got.matchingRows.length,1);
 assert.deepEqual(got.matchingRows[0],data[0]);
});
test('TWSE other symbol only means absent in current observed version',()=>{
 const got=extract({sourceId:TWSE,payload:{fields,data:[data[1]]}});
 assert.equal(got.matchingRows.length,0);
});
test('TPEx native tables schema differs from TWSE; never match numeric dates or prices as symbol',()=>{
 const got=extract({sourceId:TPEX,payload:{tables:[{fields:['代號','名稱','除權息日期','參考價'],
 data:[['2345','AA','115/09/16','2330'],['2330','C','115/09/15','110']]}]}});
 assert.equal(got.matchingRows.length,1);
 assert.equal(got.matchingRows[0][0],'2330');
});
test('reject forged source identity or source with missing/ambiguous columns and schema',()=>{
 for(const x of [
  {sourceId:'TWSE_UNKNOWN',payload:{fields,data}},
  {sourceId:TWSE,payload:{fields:['數值','名稱','價格','其他'],data:[[2330,1,2,3]]}},
  {sourceId:TWSE,payload:{fields,data:[['2330']]}},
  {sourceId:TPEX,payload:{tables:[{fields,data},{fields,data}]}},
 ]){
  assert.throws(()=>extract(x),/S2_PITA_2330_CA_NATIVE_/);
 }
});
test('real download flow is Github original-only; hash identity and no historical PIT promotion',async()=>{
 const [src,flow]=await Promise.all([
  readFile('system2/migration/issue1068_pita_2330_ca_symbol_native_readback_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-pita-2330-six-ca-original-readback.yml','utf8')
 ]);
 assert.match(src,/allNativeOriginalFamilyBodyHashesVerified:true/);
 assert.match(src,/authoritativeNoEventNegativeScopeCertified:false/);
 assert.match(src,/historicalRevisionCancellationAndSuspensionCoverageCertified:false/);
 assert.match(src,/pitEligible:false,selectedCount:null,zeroPickDay:null/);
 assert.doesNotMatch(src,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|git push/);
 assert.match(flow,/actions: read/);
 assert.match(flow,/contents: read/);
 assert.match(flow,/38910741802/);
 assert.match(flow,/retention-days: 90/);
 assert.doesNotMatch(flow,/schedule:|workflow_dispatch:|contents: write|secrets\./);
});
