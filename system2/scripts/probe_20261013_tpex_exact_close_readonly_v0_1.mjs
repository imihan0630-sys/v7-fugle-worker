// Strict single-date canonical official TPEx source observation, System2 research only.
// The exact same native parser is used as the Shared A1 61-session collector.
// Does NOT imply PIT, source window completeness, selection, Frozen or authorized redistribution.
import {createHash} from 'node:crypto';
import {writeFile,mkdir} from 'node:fs/promises';
import {buildOfficialHistoricalA1UrlV0_1,parseOfficialHistoricalA1PayloadV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
const DATE='2026-10-13',MAX_RAW=6*1024*1024;
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const nowTaipei=()=>{
 const local=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',
  year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 return local;
};
export async function probeOfficialTpexOct13CloseV0_1({
 fetchImpl=globalThis.fetch,clock=()=>new Date(),attempts=2,
 pause=ms=>new Promise(r=>setTimeout(r,ms)),
}={}){
 if(!Number.isInteger(attempts)||attempts<1||attempts>2||
    typeof fetchImpl!=='function'||typeof clock!=='function')
  throw Error('TPEX_PROBE_BOUND_INVALID');
 const requestedUrl=buildOfficialHistoricalA1UrlV0_1('TPEX',DATE);
 const failures=[];
 for(let n=1;n<=attempts;n++){
  try{
   const res=await fetchImpl(requestedUrl,{
    method:'GET',headers:{Accept:'application/json,text/plain,*/*',
     'User-Agent':'Mozilla/5.0 System2-Official-TPEX-Readonly/0.1',
     Referer:'https://www.tpex.org.tw/zh-tw/mainboard/trading/info/pricing.html',
     'Cache-Control':'no-cache'},
    signal:AbortSignal.timeout(35000)
   });
   if(res?.status!==200||res?.ok!==true)throw Error('TPEX_NATIVE_HTTP_NOT_200');
   const bytes=Buffer.from(await res.arrayBuffer());
   if(bytes.length===0||bytes.length>MAX_RAW)throw Error('TPEX_NATIVE_BODY_BOUND');
   const observedAt=clock().toISOString();
   const parsed=parseOfficialHistoricalA1PayloadV0_1({
    market:'TPEX',marketDate:DATE,
    payload:JSON.parse(bytes.toString('utf8')),
    observedAt,sourceUrl:requestedUrl
   });
   if(parsed.state!=='READY'||parsed.sourceDateEvidence!==DATE||
      parsed.rows.length<450||
      new Set(parsed.rows.map(x=>x.symbol)).size!==parsed.rows.length)
    throw Error('TPEX_NATIVE_DATE_OR_ORDINARY_UNIVERSE_INCOMPLETE');
   return Object.freeze({
    schemaVersion:'S2_P0_TPEX_20261013_EXACT_DATE_READONLY_SOURCE_PROBE_V0_1',
    state:'REAL_OFFICIAL_TPEX_CLOSE_SOURCE_OBSERVED_PIT_UNAUDITED',
    marketDate:DATE,market:'TPEX',observedAtUtc:observedAt,
    canonicalSourceUrl:requestedUrl,
    sourceReportedDate:parsed.sourceDateEvidence,
    dateEvidenceBasis:parsed.sourceDateEvidenceBasis,
    ordinaryStockCount:parsed.rows.length,originalRawBytes:bytes.length,
    originalRawSha256:digest(bytes),
    attempt:n,originalJsonRetainedInPublicRepository:false,
    noSourceCalendarCompletenessClaim:true,selectionAuthorized:false,
    selectedCount:null,frozenDecisionWritten:false,
    cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalRuntimeTouched:false,
   });
  }catch(e){
   const message=String(e?.message||'UNKNOWN');
   // Avoid leaking error messages with URLs or raw source provider content.
   const reason=/SOURCE_DATE_MISMATCH/.test(message)?'SOURCE_DATE_MISMATCH':
    /daily table not found|source date evidence is missing/.test(message)?
      'CANONICAL_PROVIDER_TABLE_OR_DATE_NOT_READY':
    /HTTP_NOT_200/.test(message)?'NATIVE_HTTP_NOT_200':
    /BODY_BOUND/.test(message)?'RESPONSE_SIZE_INVALID':
    /ORDINARY_UNIVERSE_INCOMPLETE/.test(message)?'ORDINARY_UNIVERSE_NOT_READY':
    'BOUNDED_SOURCE_TRANSPORT_OR_PARSE_FAILURE';
   failures.push({attempt:n,reason});
   if(n<attempts)await pause(2500);
  }
 }
 return Object.freeze({
  schemaVersion:'S2_P0_TPEX_20261013_EXACT_DATE_READONLY_SOURCE_PROBE_V0_1',
  state:'OFFICIAL_TPEX_SOURCE_NOT_ACCEPTED',marketDate:DATE,market:'TPEX',
  checkedAtUtc:clock().toISOString(),attemptedRequests:attempts,failures,
  sourceReportedDate:null,ordinaryStockCount:null,originalRawSha256:null,
  noSourceCalendarCompletenessClaim:true,selectionAuthorized:false,
  selectedCount:null,frozenDecisionWritten:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalRuntimeTouched:false,
 });
}
if(process.argv[1]&&process.argv[1].endsWith('probe_20261013_tpex_exact_close_readonly_v0_1.mjs')){
 const result=await probeOfficialTpexOct13CloseV0_1({});
 await mkdir('/tmp/s2-p0-tpex-oct13-source',{recursive:true});
 await writeFile('/tmp/s2-p0-tpex-oct13-source/probe.json',
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify(result));
 if(!result.state.startsWith('REAL_OFFICIAL_TPEX_CLOSE'))process.exitCode=2;
}
