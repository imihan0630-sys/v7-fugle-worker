// M09 source-only original-byte witness for six official CA historical families.
// NEVER treats a 200, an empty table, or a completed date range as proof of
// NO_EVENT, six-family archive/vintage completeness, or Stage1 PIT continuity.
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {
 buildOfficialContinuitySourceUrlsV0_1,
 summarizeOfficialContinuityNativeOriginalV0_1
} from '../runtime/official_continuity_source_capability_v0_1.mjs';
const OUT='/tmp/s2-m09-ca-originals';
const SHA=x=>createHash('sha256').update(x).digest('hex');
const DATE=/^\d{4}-\d\d-\d\d$/,MAX=8_000_000;
const SOURCE_KEYS=Object.freeze([
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
 'TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE',
 'TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE',
 'TPEX_PAR_VALUE_CHANGE_REFERENCE'
]);
function isoDate(date){
 return typeof date==='string'&&DATE.test(date)&&
  Number.isFinite(Date.parse(date+'T00:00:00Z'))&&
  new Date(date+'T00:00:00Z').toISOString().slice(0,10)===date;
}
function taipeiDate(now){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'
 }).formatToParts(now).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return p.year+'-'+p.month+'-'+p.day;
}
const plusDays=(day,n)=>{
 const d=new Date(day+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);
 return d.toISOString().slice(0,10);
};
function errCode(error){
 const s=String(error?.message||'');
 if(s==='HTTP_NOT_200')return 'HTTP_UNAVAILABLE';
 if(s==='SOURCE_TOO_LARGE')return 'BODY_SIZE_BLOCKED';
 if(s==='NATIVE_BYTES_READBACK_FAILED')return 'ORIGINAL_READBACK_FAILED';
 return 'FETCH_PARSE_OR_TRANSPORT_UNVERIFIED';
}
export async function probeM09SixCaOriginalsV0_1({
 marketDate,startDate,now=()=>new Date(),fetchImpl=globalThis.fetch,
 persistRaw,
}={}){
 if(!isoDate(marketDate)||!isoDate(startDate)||startDate>marketDate||
   typeof fetchImpl!=='function'||typeof persistRaw!=='function')
  throw Error('M09_CA_DATE_OR_IO_INVALID');
 // For a past market T, an actual original captured NOW is a late source
 // observation. It MUST NOT be labeled historically PIT-known at T.
 const observationAtUtc=now().toISOString();
 const sources=buildOfficialContinuitySourceUrlsV0_1({
  startDate,endDate:marketDate
 });
 const receipts=[];
 for(const sourceId of SOURCE_KEYS){
  const src=sources[sourceId];
  if(!src||src.sourceClass!=='HISTORICAL_ACTUAL_RESULT_RANGE')
   throw Error('M09_CA_SIX_SOURCE_CONTRACT_BROKEN');
  let capturedAtUtc=null,originalSha256=null,originalBytes=null;
  try{
   const response=await fetchImpl(src.url,{
    method:'GET',redirect:'follow',
    headers:{accept:'application/json,text/csv,text/plain,*/*',
      'user-agent':'System2-M09-Six-CA-Raw-PIT-Capability/0.1'},
    signal:AbortSignal.timeout(15000)
   });
   if(!response?.ok||response.status!==200)throw Error('HTTP_NOT_200');
   if(Number(response.headers?.get?.('content-length')||0)>MAX)
    throw Error('SOURCE_TOO_LARGE');
   const original=Buffer.from(await response.arrayBuffer());
   capturedAtUtc=now().toISOString();
   if(original.length<30||original.length>MAX)
    throw Error('SOURCE_TOO_LARGE');
   originalSha256=SHA(original);originalBytes=original.length;
   const saved=await persistRaw({sourceId,marketDate,original,sha256:originalSha256});
   if(saved?.sha256!==originalSha256||saved?.byteLength!==originalBytes||
      saved?.verified!==true)throw Error('NATIVE_BYTES_READBACK_FAILED');
   const schema=summarizeOfficialContinuityNativeOriginalV0_1({
    originalText:original.toString('utf8'),startDate,endDate:marketDate
   });
   const candidate=schema.state==='STRUCTURE_READY'&&
       schema.responseRangeVerified&&schema.recognizedStructure;
   receipts.push({
    sourceId,exchange:src.exchange,actionFamilies:src.actionFamilies,
    sourceClass:src.sourceClass,sourceUrl:src.url,
    state:candidate?'RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED':
       'RAW_OBSERVED_SCHEMA_OR_RANGE_UNVERIFIED',
    capturedAtUtc,originalSha256,originalBytes,
    nativeSchema:schema,originalBytesReadBackLocally:true,
    firstKnownAtEvidenceClass:'FIRST_PHYSICAL_OBSERVATION_NOW_NOT_HISTORICAL_PUBLICATION',
    effectiveVintageRevisionRetractionCoverageVerified:false
   });
  }catch(e){
   receipts.push({sourceId,exchange:src.exchange,
    actionFamilies:src.actionFamilies,sourceClass:src.sourceClass,
    sourceUrl:src.url,state:'SOURCE_UNAVAILABLE_FAIL_CLOSED',
    capturedAtUtc,originalSha256,originalBytes,
    blocker:errCode(e),nativeSchema:null,
    originalBytesReadBackLocally:false,
    firstKnownAtEvidenceClass:'NOT_VERIFIED',
    effectiveVintageRevisionRetractionCoverageVerified:false});
  }
 }
 const sourceCount=receipts.filter(x=>x.originalBytesReadBackLocally).length;
 const candidates=receipts.filter(x=>x.state==='RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED').length;
 const base={
  schemaVersion:'S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1',
  requestedStartDate:startDate,requestedEndDate:marketDate,
  firstPhysicalObservedAtUtc:observationAtUtc,
  completedAtUtc:now().toISOString(),
  sourceFamilyDenominator:6,sourcesRetainedOriginalBytes:sourceCount,
  nativeRangeSchemaCandidates:candidates,
  state:sourceCount===6?'SIX_RAW_SOURCES_CAPTURED_AUTHORITY_UNVERIFIED':
   'SIX_RAW_SOURCES_PARTIAL_OR_UNAVAILABLE',
  sourceReceipts:receipts,
  sourceContractCoverageComplete:false,
  historicalFirstKnownAtCertified:false,
  entireRangeCorrectionAndCancellationCoverageCertified:false,
  instrumentClassPITCertified:false,
  noEventMayBeClaimed:false,
  continuityCertified:false,selectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/probe_m09_six_ca_native_originals_readonly_v0_1.mjs')){
 await mkdir(OUT,{recursive:true,mode:0o700});
 const today=taipeiDate(new Date()),marketDate=plusDays(today,-1),
  startDate=plusDays(marketDate,-120);
 const receipt=await probeM09SixCaOriginalsV0_1({
  marketDate,startDate,
  persistRaw:async({sourceId,marketDate,original,sha256})=>{
   const p=resolve(OUT,sourceId+'-'+marketDate+'.json.gz');
   await writeFile(p,gzipSync(original,{level:6}),{flag:'wx',mode:0o600});
   const read=gunzipSync(await readFile(p));
   return {verified:SHA(read)===sha256,sha256:SHA(read),byteLength:read.length};
  }
 });
 await writeFile(resolve(OUT,'receipt.json'),
  JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  state:receipt.state,requestedStartDate:receipt.requestedStartDate,
  requestedEndDate:receipt.requestedEndDate,
  firstPhysicalObservedAtUtc:receipt.firstPhysicalObservedAtUtc,
  sourcesRetainedOriginalBytes:receipt.sourcesRetainedOriginalBytes,
  nativeRangeSchemaCandidates:receipt.nativeRangeSchemaCandidates,
  families:receipt.sourceReceipts.map(x=>({
    sourceId:x.sourceId,state:x.state,blocker:x.blocker??null,
    responseRangeVerified:x.nativeSchema?.responseRangeVerified??false,
    httpStatus:x.state==='SOURCE_UNAVAILABLE_FAIL_CLOSED'?'UNVERIFIED':'200',
    rowCount:x.nativeSchema?.rowCount??null,
    originalBytes:x.originalBytes,originalSha256:x.originalSha256
  })),
  receiptHash:receipt.receiptHash,
  caPITCertified:false,selectedCount:null,noEventMayBeClaimed:false
 }));
}
