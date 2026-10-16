import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {parseNativeSingleIsinCfiOriginalV0_1 as parse,
 probeM09OfficialSingleSecurityOriginalV0_1 as probe}
 from '../scripts/probe_m09_official_single_security_cfi_original_readonly_v0_1.mjs';
const H=b=>createHash('sha256').update(b).digest('hex');
const html=(code,cfi,type='Stock')=>[
 '<!doctype html><html><body><table>',
 '<tr><th>Page No.</th><th>ISIN Code</th><th>Security Code</th><th>CFICode</th></tr>',
 '<tr><td>1</td><td>TW0002330008</td><td>',code,'</td><td>TEST CO</td>',
 '<td>TWSE LISTED</td><td>',type,'</td><td>Semiconductors</td>',
 '<td>1994/09/05</td><td>',cfi,'</td><td></td></tr></table></body></html>'
].join('');
const controls=[{code:'2330',hint:'TWSE_EQUITY'},{code:'9103',hint:'TDR_NON_EQUITY'}];
function setup({stale=false,security=false,not200=false,corrupt=false,nativeType='Stock'}={}){
 let calls=0,writeCalls=0;
 const fetchImpl=async(url,options)=>{
  calls++;
  assert.equal(options.method,'GET');
  assert(url.startsWith('https://isin.twse.com.tw/isin/e_single_main.jsp?'));
  const code=new URL(url).searchParams.get('owncode');
  if(not200&&code==='9103')return new Response('Unavailable',{status:403});
  const body=security?'FOR SECURITY REASONS, THIS PAGE CAN NOT BE ACCESSED':
    html(stale?'9999':code,code==='2330'?'ESVUFR':'EDXXXX',nativeType);
  return new Response(body,{status:200});
 };
 const persistRaw=async({raw,originalSha256})=>{
  writeCalls++;
  return {verified:!corrupt,sha256:H(raw)===originalSha256?originalSha256:'BAD',
   byteLength:raw.length};
 };
 return {fetchImpl,persistRaw,getCalls:()=>calls,getWrites:()=>writeCalls};
}
test('official native row has independent symbol/ISIN/CFI with no PIT promotion',()=>{
 const r=parse({html:html('2330','ESVUFR'),requestedCode:'2330'});
 assert.equal(r.state,'NATIVE_SINGLE_CFI_ROW_OBSERVED');
 assert.equal(r.row.cfi,'ESVUFR');
 assert.equal(r.row.cfiEquitySharePrefix,true);
 assert.equal(r.row.positiveHistoricalOrdinaryShareAttested,false);
});
test('stale symbol, malformed ISIN, and duplicate native responses fail closed',()=>{
 assert.equal(parse({html:html('2330','ESVUFR'),requestedCode:'3287'}).state,
  'NATIVE_SINGLE_ROW_MISSING');
 assert.equal(parse({html:html('2330','ESVUFR').replace('TW0002330008','BAD'),requestedCode:'2330'}).state,
  'NATIVE_ROW_FIELDS_NOT_VERIFIED');
 const dup=html('2330','ESVUFR').replace('</table>',
  '<tr><td>2</td><td>TW0002330008</td><td>2330</td><td>OTHER</td><td>TWSE</td><td>Share</td><td>X</td><td>1994/09/05</td><td>ESVUFR</td><td></td></tr></table>');
 assert.equal(parse({html:dup,requestedCode:'2330'}).state,'NATIVE_DUPLICATE_SYMBOL');
});
test('HTTP 200 official security warning cannot be considered source availability',()=>{
 const r=parse({html:'<html>FOR SECURITY REASONS, THIS PAGE CAN NOT BE ACCESSED</html>',requestedCode:'2330'});
 assert.equal(r.state,'NATIVE_ACCESS_CHALLENGE_FAIL_CLOSED');
 assert.equal(r.row,null);
});
test('one known share and one negative control are observations, never qualified PIT',async()=>{
 const f=setup(),r=await probe({...f,controls,
  now:()=>new Date('2026-10-15T02:10:00Z')});
 assert.equal(f.getCalls(),2);assert.equal(f.getWrites(),2);
 assert.equal(r.nativeCfiRowsObserved,2);assert.equal(r.controlsChecked,2);
 assert.equal(r.state,'NATIVE_SINGLE_CFI_SOURCE_OBSERVED');
 assert.equal(r.ordinaryCommonSharePITCertified,false);
 assert.equal(r.historicalSecurityClassPitCertified,false);
 assert.equal(r.independentOriginalBytesRehashedBySeparateRun,false);
 assert.equal(r.selectedCount,null);assert.equal(r.frozenD1Written,false);
 const {receiptHash,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
});
test('stale HTTP200 single-symbol body does not pass per-symbol denominator',async()=>{
 const f=setup({stale:true}),r=await probe({...f,controls});
 assert.equal(r.nativeCfiRowsObserved,0);
 assert.equal(r.sourceReceipts[0].state,'NATIVE_SINGLE_ROW_MISSING');
});
test('403/transport and invalid original-byte readback never admit source',async()=>{
 const f=setup({not200:true}),r=await probe({...f,controls});
 assert.equal(r.nativeCfiRowsObserved,1);
 assert.equal(r.sourceReceipts[1].blocker,'HTTP_NOT_200');
 const q=setup({corrupt:true}),t=await probe({...q,controls});
 assert.equal(t.nativeCfiRowsObserved,0);
 assert(t.sourceReceipts.every(x=>x.blocker==='RAW_BYTE_PRESERVATION'));
});
test('strictly bounded 4 targeted native GET and permission separation',async()=>{
 const f=setup();
 await assert.rejects(()=>probe({...f,controls:[...controls,...controls]}),
  /M09_SINGLE_CFI_SCOPE_OR_IO_INVALID/);
 assert.equal(f.getCalls(),0);
 const [s,w]=await Promise.all([
  readFile('system2/scripts/probe_m09_official_single_security_cfi_original_readonly_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-native-single-security-cfi-readonly.yml','utf8')
 ]);
 assert.match(w,/contents: read/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.doesNotMatch(s,/wrangler|api\.cloudflare\.com|INSERT INTO|git push|CREATE TABLE/);
 assert.match(s,/historicalSecurityClassPitCertified:false/);
});

test('current real-row CFI observation can exceed zero without falsely certifying historic class PIT',async()=>{
 const f=setup({nativeType:'Stocks'});
 const r=await probe({...f,controls,now:()=>new Date('2026-10-16T09:00:00Z')});
 assert.equal(r.currentNativeStockCfiObserved,1);
 assert.equal(r.sourceReceipts[0].currentObservedStockCfi,true);
 assert.equal(r.sourceReceipts[1].currentObservedStockCfi,false);
 assert.equal(r.currentNativeEvidenceScope,'AS_OBSERVED_NOW_NOT_HISTORICAL_EFFECTIVE_VINTAGE');
 assert.equal(r.sourceReceipts[0].historicalEffectiveFromDate,null);
 assert.equal(r.sourceReceipts[0].originalPublicationAtUtc,null);
 assert.equal(r.historicalSecurityClassPitCertified,false);
 assert.equal(r.ordinaryCommonSharePITCertified,false);
 assert.equal(r.formalStage1SelectionAuthorized,false);
 assert.equal(r.selectedCount,null);
 const {receiptHash,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
});
test('native single source fallback only runs without real preliminary CFI and never accepts historic PIT',async()=>{
 const sourceWorkflow=await readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8');
 assert.match(sourceWorkflow,/Prospective current native CFI only if preliminary source unavailable/);
 assert.match(sourceWorkflow,/if \[ -s \/tmp\/s2-m09-preview-native-cfi\/preview-native-cfi\.json \]/);
 assert.match(sourceWorkflow,/node system2\/scripts\/probe_m09_official_single_security_cfi_original_readonly_v0_1\.mjs/);
 assert.match(sourceWorkflow,/s2-m09-prospective-native-cfi-sourceonly-/);
 assert.match(sourceWorkflow,/test "\$\(jq -r \.historicalSecurityClassPitCertified "\$R"\)" = 'false'/);
});
