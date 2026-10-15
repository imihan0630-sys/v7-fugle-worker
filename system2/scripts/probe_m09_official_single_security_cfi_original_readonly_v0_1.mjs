// M09 Class A: bounded native TWSE individual ISIN/CFI source transport probe.
// The previous official e_C_public whole-registry pages could not be reached
// from GitHub Actions. This source-only probe tests single-security e_single_main
// with controls. Do not promote a present-day CFICode into historical PIT,
// common-equity qualified universe, rankings, Frozen, or a zero-pick day.
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const OUT='/tmp/s2-m09-single-cfi-original';
const HOST='https://isin.twse.com.tw/isin/e_single_main.jsp';
const MAX=1_500_000;
const CODE=/^(?:[0-9]{4})$/;
const ISIN=/^[A-Z]{2}[A-Z0-9]{10}$/;
const CFI=/^[A-Z]{6}$/;
const SHA=x=>createHash('sha256').update(x).digest('hex');
const CONTROL=Object.freeze([
  {code:'2330',hint:'TWSE_KNOWN_EQUITY_POSITIVE_CONTROL'},
  {code:'3287',hint:'TPEX_KNOWN_FOUR_DIGIT_SECURITY_CONTROL'},
  {code:'9103',hint:'KNOWN_TDR_NON_ORDINARY_NEGATIVE_CONTROL'},
  {code:'0050',hint:'KNOWN_ETF_FUND_NEGATIVE_CONTROL'},
]);
function clean(v){
 return String(v||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/ig,' ')
 .replace(/&amp;/ig,'&').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>')
 .replace(/&#(\d+);/g,(_,i)=>String.fromCodePoint(+i))
 .replace(/[\u00a0\u3000\s]+/g,' ').trim();
}
export function parseNativeSingleIsinCfiOriginalV0_1({html,requestedCode}={}){
 if(typeof html!=='string'||!CODE.test(requestedCode||''))throw Error('M09_SINGLE_CFI_INPUT_INVALID');
 if(/FOR SECURITY REASONS|THIS PAGE CAN NOT BE ACCESSED|錯誤代碼|查詢過於頻繁|access denied/i.test(html))
  return {state:'NATIVE_ACCESS_CHALLENGE_FAIL_CLOSED',row:null};
 const rows=[];
 for(const tr of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)||[]){
  const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>clean(x[1]));
  if(cells.length<9)continue;
  // Official native single-result row columns:
  // # | ISIN | security code | name | market | instrument class |
  // industry | listing date | native CFICode | remarks
  const cand={isin:cells[1],symbol:cells[2],securityName:cells[3],
   nativeMarketLabel:cells[4],nativeTypeLabel:cells[5],
   nativeIndustryLabel:cells[6],nativeListedAt:cells[7],cfi:cells[8]};
  if(cand.symbol!==requestedCode)continue;
  if(!ISIN.test(cand.isin)||!CFI.test(cand.cfi)||
     !cand.nativeMarketLabel||!cand.nativeTypeLabel)
   return {state:'NATIVE_ROW_FIELDS_NOT_VERIFIED',row:null};
  rows.push(cand);
 }
 if(rows.length===0)return {state:'NATIVE_SINGLE_ROW_MISSING',row:null};
 if(rows.length!==1)return {state:'NATIVE_DUPLICATE_SYMBOL',row:null};
 const row=rows[0];
 return {state:'NATIVE_SINGLE_CFI_ROW_OBSERVED',row:{
  ...row,cfiEquitySharePrefix:row.cfi.startsWith('ES'),
  // No inference from ES prefix or any prior cached registry. A positive
  // security class needs original-byte independent audit + PIT as-of T.
  positiveHistoricalOrdinaryShareAttested:false
 }};
}
export async function probeM09OfficialSingleSecurityOriginalV0_1({
 controls=CONTROL,now=()=>new Date(),fetchImpl=globalThis.fetch,persistRaw
}={}){
 if(!Array.isArray(controls)||controls.length===0||controls.length>4||
   !controls.every(c=>CODE.test(c?.code||'')&&typeof c.hint==='string')||
   new Set(controls.map(c=>c.code)).size!==controls.length||
   typeof fetchImpl!=='function'||typeof persistRaw!=='function')
  throw Error('M09_SINGLE_CFI_SCOPE_OR_IO_INVALID');
 const baseStart=now().toISOString(),results=[];
 for(const ctrl of controls){
  const url=HOST+'?owncode='+encodeURIComponent(ctrl.code)+'&stockname=';
  let observedAtUtc=null,originalSha256=null,originalBytes=null;
  try{
   const res=await fetchImpl(url,{method:'GET',redirect:'follow',
    headers:{accept:'text/html','user-agent':'Mozilla/5.0 (compatible; System2-M09-ISIN-ReadOnly/0.1)'},
    signal:AbortSignal.timeout(19000)});
   if(res?.status!==200||!res?.ok)throw Error('HTTP_NOT_200');
   if(Number(res.headers?.get?.('content-length')||0)>MAX)throw Error('OVERSIZED_NATIVE_BODY');
   const bytes=Buffer.from(await res.arrayBuffer());
   observedAtUtc=now().toISOString();
   originalSha256=SHA(bytes);originalBytes=bytes.length;
   if(bytes.length<150||bytes.length>MAX)throw Error('BODY_SIZE_INVALID');
   const stored=await persistRaw({code:ctrl.code,raw:bytes,originalSha256});
   if(stored?.verified!==true||stored.sha256!==originalSha256||
      stored.byteLength!==bytes.length)throw Error('RAW_BYTE_READBACK_FAILED');
   const parsed=parseNativeSingleIsinCfiOriginalV0_1({
    html:bytes.toString('utf8'),requestedCode:ctrl.code});
   const row=parsed.row;
   results.push({code:ctrl.code,controlIntent:ctrl.hint,state:parsed.state,
    officialUrl:url,observedAtUtc,originalSha256,originalBytes,
    rawByteReadback:true,cfi:row?.cfi??null,isin:row?.isin??null,
    nativeMarketLabel:row?.nativeMarketLabel??null,
    nativeTypeLabel:row?.nativeTypeLabel??null,
    nativeListedAt:row?.nativeListedAt??null,
    sourceSecurityName:row?.securityName??null,
    nativeEquityPrefixObserved:row?.cfiEquitySharePrefix??false,
    nativeTypeHistoricallyPITCertified:false});
  }catch(e){
   const msg=String(e?.message||'');
   results.push({code:ctrl.code,controlIntent:ctrl.hint,
    officialUrl:url,observedAtUtc,originalSha256,originalBytes,
    state:'SOURCE_UNAVAILABLE_FAIL_CLOSED',
    blocker:msg==='HTTP_NOT_200'?'HTTP_NOT_200':
      /SIZE|OVERSIZED/.test(msg)?'SOURCE_BODY_SIZE':
      msg==='RAW_BYTE_READBACK_FAILED'?'RAW_BYTE_PRESERVATION':
      'NATIVE_TRANSPORT_OR_PARSE_UNVERIFIED',
    rawByteReadback:false,cfi:null,isin:null,nativeMarketLabel:null,
    nativeTypeLabel:null,nativeListedAt:null,sourceSecurityName:null,
    nativeEquityPrefixObserved:false,nativeTypeHistoricallyPITCertified:false});
  }
 }
 const positive=results.filter(r=>r.state==='NATIVE_SINGLE_CFI_ROW_OBSERVED').length;
 const base={schemaVersion:'S2_M09_NATIVE_SINGLE_ISIN_CFI_TRANSPORT_V0_1',
  actualObservationStartUtc:baseStart,finishedAtUtc:now().toISOString(),
  source:'OFFICIAL_TWSE_NATIVE_INDIVIDUAL_ISIN_CFI',
  controlsChecked:controls.length,nativeCfiRowsObserved:positive,
  state:positive===controls.length?'NATIVE_SINGLE_CFI_SOURCE_OBSERVED':
   'NATIVE_SINGLE_CFI_SOURCE_INCOMPLETE',
  sourceReceipts:results,
  independentOriginalBytesRehashedBySeparateRun:false,
  historicalSecurityClassPitCertified:false,
  securityClassUniverseDenominatorCertified:false,
  ordinaryCommonSharePITCertified:false,
  formalStage1SelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalRuntimeTouched:false};
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/probe_m09_official_single_security_cfi_original_readonly_v0_1.mjs')){
 await mkdir(OUT,{recursive:true,mode:0o700});
 const r=await probeM09OfficialSingleSecurityOriginalV0_1({
  persistRaw:async({code,raw,originalSha256})=>{
   const p=resolve(OUT,'native-'+code+'.html.gz');
   await writeFile(p,gzipSync(raw,{level:6}),{flag:'wx',mode:0o600});
   const restored=gunzipSync(await readFile(p));
   return {verified:SHA(restored)===originalSha256,
    sha256:SHA(restored),byteLength:restored.length};
  }
 });
 await writeFile(resolve(OUT,'receipt.json'),JSON.stringify(r,null,2)+'\n',
  {flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  source:r.source,state:r.state,
  controlsChecked:r.controlsChecked,nativeCfiRowsObserved:r.nativeCfiRowsObserved,
  rows:r.sourceReceipts.map(x=>({code:x.code,state:x.state,
   cfi:x.cfi,isin:x.isin,officialType:x.nativeTypeLabel,
   observedAtUtc:x.observedAtUtc,originalSha256:x.originalSha256,
   originalBytes:x.originalBytes,blocker:x.blocker??null})),
  receiptHash:r.receiptHash,ordinaryCommonSharePITCertified:false,
  selectedCount:null,cloudflareD1Writes:0
 }));
}
