// M09 source-only alternative to rate-limited one-code ISIN/CFI queries.
// Probe two CURRENT official TWSE ISIN classified native pages, not a
// historical PIT class universe. No admission, selectedCount or Frozen.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const SHA=b=>createHash('sha256').update(b).digest('hex');
const ROOT='/tmp/s2-m09-native-cpublic-two-markets';
const HOST='https://isin.twse.com.tw/isin/C_public.jsp';
const TARGETS=Object.freeze([
 {market:'TWSE',strMode:'2',minimum:650},
 {market:'TPEX',strMode:'4',minimum:400}
]);
const MAX=20_000_000;
const CODE=/^[1-9]\d{3}$/;
const ISIN=/^[A-Z]{2}[A-Z0-9]{10}$/;
const CFI=/^[A-Z]{6}$/;
const clean=v=>String(v??'').replace(/<[^>]*>/g,' ')
 .replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&')
 .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n))
 .replace(/[\s\u3000\u00a0]+/g,' ').trim();
function sourceText(bytes){
 let big5='';
 try{big5=new TextDecoder('big5',{fatal:false}).decode(bytes);}catch{}
 const utf8=new TextDecoder('utf-8',{fatal:false}).decode(bytes);
 const meaningful=s=>/CFICode|ISIN Code|國際證券|證券代號/i.test(s);
 if(meaningful(big5)&&!/\uFFFD\uFFFD\uFFFD/.test(big5.slice(0,800)))return big5;
 return meaningful(utf8)?utf8:big5||utf8;
}
export function parseM09NativeCpublicFourDigitCfiV0_1({
 original,market
}={}){
 if(!['TWSE','TPEX'].includes(market)||!Buffer.isBuffer(original)||
  original.length<200)throw Error('M09_CPUBLIC_NATIVE_INPUT_INVALID');
 const html=sourceText(original);
 if(/FOR SECURITY REASONS|THIS PAGE CAN NOT BE ACCESSED|Access Denied/i.test(html))
  return {state:'NATIVE_SECURITY_BLOCK_FAIL_CLOSED',rows:[],counts:[]};
 if(!/CFICode|ISIN Code|國際證券辨識號碼/i.test(html))
  return {state:'NO_NATIVE_ISIN_CFI_TABLE',rows:[],counts:[]};
 const map=new Map(),counts=new Map();let nativeFourDigitRows=0,invalidNative=0,duplicates=0;
 for(const tr of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)||[]){
  const td=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>clean(x[1]));
  if(td.length<5)continue;
  const match=td[0].match(/^([1-9]\d{3})(?=\s|[\u4e00-\u9fff\-]|$)/);
  if(!match)continue;
  nativeFourDigitRows++;
  const symbol=match[1],isin=td.find(v=>ISIN.test(v)),cfi=td.find(v=>CFI.test(v));
  if(!isin||!cfi||!td[0].slice(symbol.length).trim()){invalidNative++;continue;}
  if(map.has(symbol)){duplicates++;continue;}
  map.set(symbol,{symbol,isin,cfi});
  counts.set(cfi,(counts.get(cfi)||0)+1);
 }
 return {state:duplicates>0||invalidNative>0?'NATIVE_SYMBOL_DUPLICATE_OR_INVALID':
   'NATIVE_CURRENT_TABLE_PARSED',
  nativeFourDigitRows,duplicateNativeSymbols:duplicates,invalidNativeRows:invalidNative,
  rows:[...map.values()].sort((a,b)=>a.symbol.localeCompare(b.symbol)),
  counts:[...counts].map(([cfi,count])=>({cfi,count})).sort((a,b)=>b.count-a.count||a.cfi.localeCompare(b.cfi))};
}
export async function probeM09NativeCpublicOriginalsV0_1({
 now=()=>new Date(),fetchImpl=globalThis.fetch,persistRaw,
}={}){
 if(typeof fetchImpl!=='function'||typeof persistRaw!=='function')
  throw Error('M09_CPUBLIC_FETCH_AND_RAW_REQUIRED');
 const observedStartUtc=now().toISOString(),receipts=[];
 for(const src of TARGETS){
  const url=HOST+'?strMode='+src.strMode;
  let observedAtUtc=null,originalRawSha256=null,originalProviderBytes=null;
  try{
   const response=await fetchImpl(url,{method:'GET',redirect:'follow',
    headers:{accept:'text/html','user-agent':'Mozilla/5.0 (System2-M09-Cpublic-Native-Only/0.1)'},
    signal:AbortSignal.timeout(18000)});
   if(response?.status!==200||!response?.ok)throw Error('HTTP_NOT_200');
   if(Number(response.headers?.get?.('content-length')||0)>MAX)
    throw Error('SOURCE_SIZE_DENIED');
   const raw=Buffer.from(await response.arrayBuffer());
   observedAtUtc=now().toISOString();originalRawSha256=SHA(raw);
   originalProviderBytes=raw.length;
   if(raw.length<1000||raw.length>MAX)throw Error('SOURCE_SIZE_DENIED');
   const p=await persistRaw({market:src.market,original:raw,sha:originalRawSha256});
   if(p?.sha!==originalRawSha256||p?.bytes!==raw.length||p?.verified!==true)
    throw Error('RAW_READBACK_HASH_DIFFERENCE');
   const parsed=parseM09NativeCpublicFourDigitCfiV0_1({original:raw,market:src.market});
   const verified=parsed.state==='NATIVE_CURRENT_TABLE_PARSED'&&
    parsed.rows.length>=src.minimum;
   receipts.push({market:src.market,url,observedAtUtc,originalRawSha256,
    originalProviderBytes,rawReadbackShaMatched:true,
    state:verified?'NATIVE_CURRENT_LARGE_CLASS_TABLE_OBSERVED':
      'RAW_OBSERVED_NATIVE_DENOMINATOR_UNVERIFIED',
    nativeFourDigitRows:parsed.nativeFourDigitRows??0,
    duplicateNativeSymbols:parsed.duplicateNativeSymbols??null,
    invalidNativeRows:parsed.invalidNativeRows??null,
    nativeFourDigitRowsWithCFI:parsed.rows.length,
    nativeEquityESVUFRCount:parsed.rows.filter(r=>r.cfi==='ESVUFR').length,
    nativeTypeDistribution:parsed.counts.slice(0,12),
    // Raw originals are in private ephemeral artifact. No raw symbol names
    // or undocumented normalizations in public GitHub receipts.
    originalIndependentByteAudit:false,
    historicalSecurityClassPITCertified:false});
  }catch(error){
   const e=String(error?.message||'');
   receipts.push({market:src.market,url,observedAtUtc,originalRawSha256,
    originalProviderBytes,rawReadbackShaMatched:false,
    state:'NATIVE_SOURCE_UNAVAILABLE_FAIL_CLOSED',
    blocker:e==='HTTP_NOT_200'?'HTTP_NOT_200':
      e==='SOURCE_SIZE_DENIED'?'SOURCE_SIZE_DENIED':
      e==='RAW_READBACK_HASH_DIFFERENCE'?'RAW_BYTES_MISMATCH':
      'TRANSPORT_OR_NATIVE_UNVERIFIED',
    nativeFourDigitRowsWithCFI:null,nativeEquityESVUFRCount:null,
    originalIndependentByteAudit:false,
    historicalSecurityClassPITCertified:false});
  }
 }
 const both=receipts.every(x=>x.state==='NATIVE_CURRENT_LARGE_CLASS_TABLE_OBSERVED');
 const base={schemaVersion:'S2_M09_NATIVE_CPUBLIC_CURRENT_TWO_MARKET_V0_1',
  evidenceClass:'CURRENT_NATIVE_ISIN_CFI_REGISTRY_NOT_HISTORY_PIT',
  firstPhysicalObservedAtUtc:observedStartUtc,
  completedAtUtc:now().toISOString(),nativeSourcesRequired:2,
  nativeSourcesObserved:receipts.filter(x=>x.rawReadbackShaMatched).length,
  nativeLargeTablesVerified:receipts.filter(x=>x.state==='NATIVE_CURRENT_LARGE_CLASS_TABLE_OBSERVED').length,
  nativeFullCurrentRegistryCandidate:both,
  nativeTotalFourDigitCFIRows:both?receipts.reduce((n,x)=>n+x.nativeFourDigitRowsWithCFI,0):null,
  nativeTotalCurrentESVUFR:both?receipts.reduce((n,x)=>n+x.nativeEquityESVUFRCount,0):null,
  sourceReceipts:receipts,
  separateIndependentAuditSatisfied:false,
  A1FullSecurityUniverseMembershipCrossCheck:false,
  nativeSecurityTypeAsOfHistoricalMarketDateCertified:false,
  oldRegistrySnapshotFirstKnownAtCertified:false,
  officialOrdinaryShareEntireMarketPITCertified:false,
  marketRegimePITCertified:false,corporateActionVintagePITCertified:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false};
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/probe_m09_native_cpublic_full_two_market_cfi_readonly_v0_1.mjs')){
 await mkdir(ROOT,{recursive:true,mode:0o700});
 const receipt=await probeM09NativeCpublicOriginalsV0_1({
  persistRaw:async({market,original,sha})=>{
   const path=resolve(ROOT,'native-cpublic-'+market+'.html.gz');
   await writeFile(path,gzipSync(original,{level:6}),{flag:'wx',mode:0o600});
   const restore=gunzipSync(await readFile(path));
   return {verified:SHA(restore)===sha,sha:SHA(restore),bytes:restore.length};
  }
 });
 await writeFile(resolve(ROOT,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',
  {flag:'wx',mode:0o600});
 console.log(JSON.stringify({state:receipt.evidenceClass,
  nativeSourcesObserved:receipt.nativeSourcesObserved,
  nativeLargeTablesVerified:receipt.nativeLargeTablesVerified,
  nativeFullCurrentRegistryCandidate:receipt.nativeFullCurrentRegistryCandidate,
  nativeTotalFourDigitCFIRows:receipt.nativeTotalFourDigitCFIRows,
  nativeTotalCurrentESVUFR:receipt.nativeTotalCurrentESVUFR,
  markets:receipt.sourceReceipts.map(r=>({
   market:r.market,state:r.state,fourDigit:r.nativeFourDigitRowsWithCFI,
   ESVUFR:r.nativeEquityESVUFRCount,
   blocker:r.blocker??null,originalRawSha256:r.originalRawSha256
  })),receiptHash:receipt.receiptHash,historicalPitCertified:false,
  selectedCount:null,frozenD1Written:false
 }));
}
