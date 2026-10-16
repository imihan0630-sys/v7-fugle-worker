// DATA_LANE / #1068: one physical TWSE 2330 native original for 2026-10-16.
// One official GET at actual T, timestamped before the existing 23:45
// research cut. Does NOT certify historical CFI, CA/NO_EVENT or strategy PIT.
// No scheduler, Cloudflare, paid source, System1, ranking or Frozen.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {parseOfficialHistoricalA1PayloadV0_1,
 buildOfficialHistoricalA1UrlV0_1} from '../runtime/official_historical_a1_source_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';

export const DAY='2026-10-16';
export const CUT='2026-10-16T15:45:00.000Z'; // candidate research cut only
const MAX_BYTES=25_000_000;
const sha=b=>createHash('sha256').update(b).digest('hex');
const deny=reason=>{throw Error('S2_PITA_2330_NATIVE_'+reason)};
const utc=x=>typeof x==='string' && Number.isFinite(Date.parse(x)) &&
  new Date(Date.parse(x)).toISOString()===x;
const tpDate=d=>new Intl.DateTimeFormat('en-CA',{
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'
}).format(d);

export async function capturePita2330OriginalV0_1({
 now=()=>new Date(),fetchImpl=globalThis.fetch,persistOriginal
}={}){
 if(typeof now!=='function'||typeof fetchImpl!=='function'||
    typeof persistOriginal!=='function')deny('IO_REQUIRED');
 const begun=now();
 if(!(begun instanceof Date)||!Number.isFinite(+begun)||
    tpDate(begun)!==DAY||
    begun.toISOString()<'2026-10-16T05:30:00.000Z'||
    begun.toISOString()>=CUT)
  deny('NOT_TODAY_BEFORE_REAL_RESEARCH_CUT');
 const sourceUrl=buildOfficialHistoricalA1UrlV0_1('TWSE',DAY);
 let response;
 try{
   response=await fetchImpl(sourceUrl,{
     method:'GET',redirect:'follow',
     headers:{Accept:'application/json,text/plain,*/*',
      'User-Agent':'System2-PITA-OneSymbol-Original/0.1'},
     signal:AbortSignal.timeout(20000),
   });
 }catch{deny('OFFICIAL_TRANSPORT_UNAVAILABLE')}
 if(response?.status!==200||response.ok!==true)
  deny('OFFICIAL_HTTP_NOT_200');
 if(Number(response.headers?.get?.('content-length')||0)>MAX_BYTES)
  deny('ORIGINAL_OVERSIZE');
 let raw;
 try{raw=Buffer.from(await response.arrayBuffer())}
 catch{deny('ORIGINAL_UNREADABLE')}
 const observed=now().toISOString();
 if(!utc(observed)||Date.parse(observed)<+begun||
    Date.parse(observed)>=Date.parse(CUT)||
    tpDate(new Date(observed))!==DAY)
  deny('ORIGINAL_AVAILABLE_TOO_LATE_FOR_CUT');
 if(raw.length<200||raw.length>MAX_BYTES)deny('ORIGINAL_BODY_LENGTH_INVALID');
 const originalSha256=sha(raw);
 // Preserve exact provider bytes BEFORE granting even SOURCE-ONLY status.
 const stored=await persistOriginal({market:'TWSE',marketDate:DAY,
  symbol:'2330',raw,originalSha256,observedAtUtc:observed});
 if(stored?.verified!==true||stored.sha256!==originalSha256||
    stored.byteLength!==raw.length)deny('RAW_READBACK_OR_HASH_INVALID');
 let parsed;
 try{
  parsed=parseOfficialHistoricalA1PayloadV0_1({
    market:'TWSE',marketDate:DAY,observedAt:observed,sourceUrl,
    payload:JSON.parse(raw.toString('utf8'))
  });
 }catch{deny('PROVIDER_DATE_OR_TABLE_UNVERIFIED')}
 if(parsed.state!=='READY'||parsed.sourceDateEvidence!==DAY||
    parsed.sourceUrl!==sourceUrl||parsed.rows.length<600)
  deny('SOURCE_DATE_OR_MARKET_COVERAGE_MISMATCH');
 const matches=parsed.rows.filter(x=>x.symbol==='2330');
 if(matches.length!==1)deny('ONE_NATIVE_2330_BAR_MISSING_OR_DUPLICATE');
 const row=matches[0];
 if(row.priceSpace!=='RAW'||
    ![row.open,row.high,row.low,row.close].every(Number.isFinite)||
    row.low<=0||row.high<Math.max(row.open,row.close)||
    row.low>Math.min(row.open,row.close)||
    !Number.isFinite(row.volumeShares)||row.volumeShares<0||
    !Number.isFinite(row.tradeValue)||row.tradeValue<0)
  deny('NATIVE_2330_OHLCV_INVALID');
 const base={
   schemaVersion:'S2_DATA_PITA_2330_PROSPECTIVE_A1_ORIGINAL_V0_1',
   marketDate:DAY,market:'TWSE',symbol:'2330',sourceId:parsed.sourceId,
   sourceUrl,originalProviderDateEvidence:parsed.sourceDateEvidence,
   originalProviderDateEvidenceBasis:parsed.sourceDateEvidenceBasis,
   sourceNativeBodySha256:originalSha256,sourceNativeBodyBytes:raw.length,
   originalBodySavedAndByteRehashed:true,
   actualFirstPhysicalObservedAtUtc:observed,
   observedAtAvailableUpperBoundUtc:observed,
   currentTradingDaySourceBar: {
     symbol:'2330',marketDate:DAY,priceSpace:'RAW',
     open:row.open,high:row.high,low:row.low,close:row.close,
     volumeShares:row.volumeShares,tradeValue:row.tradeValue,
     transactions:row.transactions,companyName:row.companyName,
     nativeSourceFieldsSha256:await sha256Hex(row.sourceFields),
   },
   nativeMarketSourceRowCount:parsed.rows.length,
   targetResearchCutUtc:CUT,
   observedBeforeTargetResearchCut:true,
   researchCutOfficiallyAuthorized:false,
   decisionCutArchiveIndependentWitness:false,
   sameDayIndependentAuditAccepted:false,
   historical61WindowJoinedAndIndependentlyAudited:false,
   historicalCfiEffectivePeriodsCertified:false,
   caRevisionsAndNoEventCertified:false,
   pitEligible:false,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,shadowAuthorized:false,
   cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalCoreChanged:false,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/capture_pita_2330_prospective_a1_original_20261016_v0_1.mjs')){
 const out='/tmp/s2-pita-2330-prospective-a1-20261016';
 await mkdir(out,{recursive:true,mode:0o700});
 const result=await capturePita2330OriginalV0_1({
  persistOriginal:async({raw,originalSha256})=>{
    const file=resolve(out,'TWSE-2026-10-16-original.json.gz');
    await writeFile(file,gzipSync(raw),{flag:'wx',mode:0o600});
    const reread=gunzipSync(await readFile(file));
    return {verified:sha(reread)===originalSha256,
      sha256:sha(reread),byteLength:reread.length};
  }
 });
 await writeFile(resolve(out,'pita-2330-a1-source-receipt.json'),
   JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
   sourceOriginalDay:result.marketDate,stock:result.symbol,
   sourceRows:result.nativeMarketSourceRowCount,
   originalBodySha256:result.sourceNativeBodySha256,
   actualObservedAtUtc:result.actualFirstPhysicalObservedAtUtc,
   sourceReceiptHash:result.receiptHash,
   originalSourceOnly:true,formalPIT:false,
   selectedCount:null,zeroPickDay:null,frozen:false,
   D1Writes:0,system1FormalChanged:false
 }));
}
