// M09 Class A: evening T native TWSE/TPEx A1 original bytes PRELIMINARY ONLY.
// This bounded two-GET witness cannot attest CFI, corporate-action PIT,
// historical first publication, selectedCount, zero-pick or Frozen D1.
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildOfficialHistoricalA1UrlV0_1,parseOfficialHistoricalA1PayloadV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
const OUT='/tmp/s2-m09-evening-a1-sourceonly';
const SHA=x=>createHash('sha256').update(x).digest('hex');
const MAX_BYTES=20_000_000,UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
function taipeiParts(when){
 const date=new Date(when);
 if(!Number.isFinite(+date))throw Error('M09_EVENING_INVALID_CLOCK');
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',
  hour:'2-digit',hourCycle:'h23',
 }).formatToParts(date).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return {day:parts.year+'-'+parts.month+'-'+parts.day,hour:+parts.hour};
}
export async function probeM09EveningDualMarketA1V0_1({
 now=()=>new Date(),fetchImpl=globalThis.fetch,persistRaw,
}={}){
 if(typeof fetchImpl!=='function'||typeof persistRaw!=='function')
  throw Error('M09_EVENING_READONLY_IO_REQUIRED');
 const start=now(),p=taipeiParts(start),startAtUtc=start.toISOString();
 if(p.hour<19){
  const base={schemaVersion:'S2_M09_EVENING_DUAL_A1_SOURCE_V0_1',
   state:'SKIPPED_OUTSIDE_19_TO_24_TAIPEI_PRELIMINARY_WINDOW',
   sourceDate:p.day,observedAtUtc:startAtUtc,marketLaneReceipts:[],
   sourceLanesVerified:0,sourceLanesRequired:2,
   tradingCalendarIndependentlyCertified:false,
   originalProviderBytesIndependentlyAudited:false,
   strategyPitCertified:false,ordinaryEquityClassCertified:false,
   corporateActionPitCertified:false,
   finalSelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalRuntimeTouched:false};
  return Object.freeze({...base,receiptHash:await sha256Hex(base)});
 }
 const marketDate=p.day,lanes=[];
 for(const market of ['TWSE','TPEX']){
  const sourceUrl=buildOfficialHistoricalA1UrlV0_1(market,marketDate);
  let capturedAtUtc=null,originalSha256=null,originalBytes=null;
  try{
   const res=await fetchImpl(sourceUrl,{method:'GET',
    headers:{Accept:'application/json','User-Agent':'System2-M09-Evening-A1-SourceOnly/0.1'},
    redirect:'follow',signal:AbortSignal.timeout(27000)});
   if(res?.status!==200||!res?.ok)throw Error('HTTP_NOT_200');
   if(Number(res.headers?.get?.('content-length')||0)>MAX_BYTES)
    throw Error('OVERSIZE');
   const raw=Buffer.from(await res.arrayBuffer());
   capturedAtUtc=now().toISOString();
   originalSha256=SHA(raw);originalBytes=raw.length;
   if(raw.length<120||raw.length>MAX_BYTES)throw Error('INVALID_BODY_SIZE');
   if(taipeiParts(capturedAtUtc).day!==marketDate)
    throw Error('CROSS_MIDNIGHT_OBSERVATION');
   const payload=JSON.parse(raw.toString('utf8').replace(/^\uFEFF/,''));
   const parsed=parseOfficialHistoricalA1PayloadV0_1({
    market,marketDate,payload,observedAt:capturedAtUtc,
    sourceUrl,transportMode:'PRIMARY'
   });
   if(parsed.state!=='READY'||parsed.sourceDateEvidence!==marketDate||
      parsed.rows.length<(market==='TWSE'?600:450))
    throw Error('DATE_OR_UNIVERSE_INCOMPLETE');
   // Source is temporarily archived as an exact byte-for-byte GZIP and
   // independently read back before the receipt may report storage success.
   const persisted=await persistRaw({market,marketDate,raw,originalSha256});
   if(persisted?.verified!==true||persisted.sha256!==originalSha256||
      persisted.byteLength!==originalBytes)
    throw Error('ORIGINAL_BYTE_READBACK_UNVERIFIED');
   lanes.push({market,state:'EXACT_T_NATIVE_A1_PRELIMINARY_OBSERVED',
    sourceUrl,providerReportedDate:parsed.sourceDateEvidence,
    sourceDateEvidenceBasis:parsed.sourceDateEvidenceBasis,
    capturedAtUtc,originalSha256,originalBytes,
    fourDigitQuoteRows:parsed.rows.length,
    sourceClass:'DAILY_NATIVE_QUOTE_NOT_ORDINARY_EQUITY_CLASS',
    originalBytesReadBackLocally:true,
    historicalPublishedAtNotProven:true});
  }catch(e){
   const m=String(e?.message||'UNKNOWN');
   const reason=m.includes('SOURCE_DATE_MISMATCH')?'PROVIDER_DATE_MISMATCH':
    m==='DATE_OR_UNIVERSE_INCOMPLETE'?'DATE_OR_DENOMINATOR_INCOMPLETE':
    m==='HTTP_NOT_200'?'HTTP_NOT_200':
    m==='CROSS_MIDNIGHT_OBSERVATION'?'OBSERVATION_CROSSED_MIDNIGHT':
    m==='ORIGINAL_BYTE_READBACK_UNVERIFIED'?'BYTE_PRESERVATION_UNVERIFIED':
    m==='OVERSIZE'||m==='INVALID_BODY_SIZE'?'RESPONSE_SIZE_INVALID':
    'SOURCE_READ_PARSE_OR_TRANSPORT_UNVERIFIED';
   lanes.push({market,state:'SOURCE_INCOMPLETE_FAIL_CLOSED',
    sourceUrl,providerReportedDate:null,
    capturedAtUtc,originalSha256,originalBytes,blocker:reason,
    fourDigitQuoteRows:null,originalBytesReadBackLocally:false,
    historicalPublishedAtNotProven:true});
  }
 }
 const passed=lanes.filter(x=>x.state==='EXACT_T_NATIVE_A1_PRELIMINARY_OBSERVED').length;
 const base={schemaVersion:'S2_M09_EVENING_DUAL_A1_SOURCE_V0_1',
  state:passed===2?'DUAL_MARKET_T_SOURCE_PRELIMINARY_READY':
   'DUAL_MARKET_T_SOURCE_INCOMPLETE_FAIL_CLOSED',
  sourceDate:marketDate,observedAtUtc:now().toISOString(),
  requestedStartUtc:startAtUtc,marketLaneReceipts:lanes,
  sourceLanesVerified:passed,sourceLanesRequired:2,
  tradingCalendarIndependentlyCertified:false,
  originalProviderBytesIndependentlyAudited:false,
  strategyPitCertified:false,ordinaryEquityClassCertified:false,
  corporateActionPitCertified:false,
  finalSelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalRuntimeTouched:false};
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/probe_m09_evening_dual_market_a1_readonly_v0_1.mjs')){
 await mkdir(OUT,{recursive:true,mode:0o700});
 const receipt=await probeM09EveningDualMarketA1V0_1({
  persistRaw:async({market,marketDate,raw,originalSha256})=>{
   const filename=resolve(OUT,market+'-'+marketDate+'-original.json.gz');
   await writeFile(filename,gzipSync(raw,{level:6}),{flag:'wx',mode:0o600});
   const restored=gunzipSync(await readFile(filename));
   return {verified:SHA(restored)===originalSha256,
    sha256:SHA(restored),byteLength:restored.length};
  }
 });
 await writeFile(resolve(OUT,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',
  {flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  state:receipt.state,sourceDate:receipt.sourceDate,
  sourceLanesVerified:receipt.sourceLanesVerified,
  marketLaneReceipts:receipt.marketLaneReceipts.map(x=>({
   market:x.market,state:x.state,providerReportedDate:x.providerReportedDate,
   capturedAtUtc:x.capturedAtUtc,originalSha256:x.originalSha256,
   originalBytes:x.originalBytes,fourDigitQuoteRows:x.fourDigitQuoteRows,
   blocker:x.blocker??null})),
  receiptHash:receipt.receiptHash,
  formalSelectionAuthorized:false,cloudflareD1Writes:0
 }));
 // An incomplete source is a meaningful physical negative receipt, not an
 // exception or an invented legitimate zero-pick selection day.
}
