// DATA_LANE #1068: record only true six official TWSE/TPEX CA original
// response bodies as observed NOW, for one future PIT-A candidate cut.
// No event-absence certification, no historical correction completeness,
// no strategy admission, no Cloudflare/paid service/System1 or new cron.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {probeM09SixCaOriginalsV0_1}
 from './probe_m09_six_ca_native_originals_readonly_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const keys=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
 'TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE',
 'TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE',
 'TPEX_PAR_VALUE_CHANGE_REFERENCE'
];
const CUT='2026-10-16T15:45:00.000Z';
const denied=x=>{throw Error('S2_PITA_2330_CA_'+x)};
const taipei=x=>new Intl.DateTimeFormat('en-CA',{
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'
}).format(x);
export async function capturePita2330SixCAOriginalV0_1({
 now=()=>new Date(),fetchImpl=globalThis.fetch,persistRaw,
 collect=probeM09SixCaOriginalsV0_1
}={}){
 if(typeof now!=='function'||typeof fetchImpl!=='function'||
    typeof persistRaw!=='function'||typeof collect!=='function')
   denied('SOURCE_IO_REQUIRED');
 const begin=now();
 if(!(begin instanceof Date)||!Number.isFinite(+begin)||
    taipei(begin)!=='2026-10-16'||
    +begin<Date.parse('2026-10-16T05:30:00.000Z')||
    +begin>=Date.parse(CUT))
   denied('OBSERVATION_DAY_OR_CUT_EXPIRED');
 const c=await collect({
   marketDate:'2026-10-16',startDate:'2026-07-21',
   now,fetchImpl,persistRaw
 });
 const finish=now().toISOString();
 const h=/^[a-f0-9]{64}$/;
 if(!Array.isArray(c?.sourceReceipts)||c.sourceReceipts.length!==6||
   new Set(c.sourceReceipts.map(x=>x.sourceId)).size!==6||
   !keys.every(k=>c.sourceReceipts.some(x=>x.sourceId===k))||
   c.schemaVersion!=='S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1'||
   c.requestedStartDate!=='2026-07-21'||
   c.requestedEndDate!=='2026-10-16'||
   c.sourceFamilyDenominator!==6||
   !Number.isInteger(c.sourcesRetainedOriginalBytes)||
   c.sourcesRetainedOriginalBytes<0||c.sourcesRetainedOriginalBytes>6||
   !Number.isInteger(c.nativeRangeSchemaCandidates)||
   c.nativeRangeSchemaCandidates<0||
   c.nativeRangeSchemaCandidates>c.sourcesRetainedOriginalBytes||
   c.sourceContractCoverageComplete!==false||
   c.historicalFirstKnownAtCertified!==false||
   c.entireRangeCorrectionAndCancellationCoverageCertified!==false||
   c.instrumentClassPITCertified!==false||
   c.noEventMayBeClaimed!==false||
   c.continuityCertified!==false||
   c.selectionAuthorized!==false||
   c.selectedCount!==null||c.zeroPickDay!==null||
   c.frozenD1Written!==false||c.cloudflareD1Writes!==0||
   c.cloudflareR2Writes!==0||c.system1FormalCoreTouched!==false||
   !h.test(c.receiptHash||'')||
   await sha256Hex(Object.fromEntries(Object.entries(c).filter(([k])=>k!=='receiptHash')))!==c.receiptHash||
   !Number.isFinite(Date.parse(finish))||
   !Number.isFinite(Date.parse(c.firstPhysicalObservedAtUtc))||
   !Number.isFinite(Date.parse(c.completedAtUtc))||
   Date.parse(finish)>Date.parse(CUT)||
   Date.parse(c.firstPhysicalObservedAtUtc)<+begin||
   Date.parse(c.completedAtUtc)>Date.parse(finish)||
   Date.parse(c.completedAtUtc)<Date.parse(c.firstPhysicalObservedAtUtc))
  denied('SIX_SOURCE_RECEIPT_OR_REAL_CLOCK_INVALID');
 let physical=0,range=0;
 for(const f of c.sourceReceipts){
   if(f.exchange!==(f.sourceId.startsWith('TWSE_')?'TWSE':'TPEX')||
      f.sourceClass!=='HISTORICAL_ACTUAL_RESULT_RANGE'||
      typeof f.sourceUrl!=='string'||!f.sourceUrl.startsWith('https://')||
      f.effectiveVintageRevisionRetractionCoverageVerified!==false)
      denied('CA_FAMILY_PROVENANCE_MISMATCH');
   if(f.originalBytesReadBackLocally===true){
      physical++;
      if(!h.test(f.originalSha256||'')||
         !Number.isSafeInteger(f.originalBytes)||f.originalBytes<30||
         !Number.isFinite(Date.parse(f.capturedAtUtc))||
         Date.parse(f.capturedAtUtc)<+begin||
         Date.parse(f.capturedAtUtc)>Date.parse(finish)||
         f.firstKnownAtEvidenceClass!==
           'FIRST_PHYSICAL_OBSERVATION_NOW_NOT_HISTORICAL_PUBLICATION')
        denied('CA_ORIGINAL_SHA_OR_CAPTURE_TIME_INVALID');
      if(f.state==='RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED')range++;
      else if(f.state!=='RAW_OBSERVED_SCHEMA_OR_RANGE_UNVERIFIED')
        denied('CA_ORIGINAL_REPORTED_STATE_INVALID');
   }else if(f.originalBytesReadBackLocally!==false||
      f.state!=='SOURCE_UNAVAILABLE_FAIL_CLOSED')
     denied('UNVERIFIED_CA_SOURCE_NOT_UNKNOWN');
 }
 if(physical!==c.sourcesRetainedOriginalBytes||
    range!==c.nativeRangeSchemaCandidates)
   denied('CA_ORIGINAL_SOURCE_COUNTER_MISMATCH');
 const base={
   schemaVersion:'S2_DATA_PITA_2330_CURRENT_CA_ORIGINAL_RANGE_V0_1',
   status:physical===6?'SIX_OFFICIAL_CA_ORIGINALS_CAPTURED_AS_OBSERVED_NOW_ONLY':
    'PARTIAL_CA_ORIGINALS_UNKNOWN_NO_EVENT_NOT_PROVEN',
   symbolScope:'TWSE:2330_RESEARCH_TARGET_ONLY_NOT_NATIVE_FILTERED',
   marketDate:'2026-10-16',windowStartDate:'2026-07-21',
   targetResearchCutUtc:CUT,firstObservedAtUtc:c.firstPhysicalObservedAtUtc,
   completedAtUtc:finish,actualSourceFamilyDenominator:6,
   observedSourceFamilies:physical,sourceSchemaRangeCandidates:range,
   exactSignedSixCAReceiptHash:c.receiptHash,
   rawOfficialSourceReceipts:c.sourceReceipts.map(x=>({
     sourceId:x.sourceId,exchange:x.exchange,sourceUrl:x.sourceUrl,
     originalSha256:x.originalSha256??null,
     originalBytes:x.originalBytes??null,
     capturedAtUtc:x.capturedAtUtc??null,
     nativeState:x.state
   })),
   directIssuerVersionAndAmendmentCompletenessCertified:false,
   authoritativeNegativeNoEventScopeCertified:false,
   originalHistoricalPublicationAtCertified:false,
   historicalCfiEffectivePITCertified:false,
   independentAuditLaneCompletePitCertified:false,
   pitEligible:false,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,shadowAuthorized:false,
   cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalCoreChanged:false
 };
 return {receipt:{...base,receiptHash:await sha256Hex(base)},source:c};
}
if(process.argv[1]?.endsWith('/capture_pita_2330_six_ca_originals_20261016_v0_1.mjs')){
 const output='/tmp/s2-pita-2330-ca-six-20261016';
 await mkdir(output,{recursive:true,mode:0o700});
 const save=async({sourceId,marketDate,original,sha256})=>{
   if(!keys.includes(sourceId)||marketDate!=='2026-10-16')
     denied('UNEXPECTED_NATIVE_SOURCE_ID');
   const file=resolve(output,sourceId+'-'+marketDate+'.json.gz');
   await writeFile(file,gzipSync(original),{flag:'wx',mode:0o600});
   const raw=gunzipSync(await readFile(file));
   return {verified:sha(raw)===sha256,
     sha256:sha(raw),byteLength:raw.length};
 };
 const r=await capturePita2330SixCAOriginalV0_1({persistRaw:save});
 await writeFile(resolve(output,'source-original-six-ca.json'),
   JSON.stringify(r.source,null,2)+'\n',{flag:'wx',mode:0o600});
 await writeFile(resolve(output,'pita-ca-sourceonly-receipt.json'),
   JSON.stringify(r.receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
   sourceOnlyStatus:r.receipt.status,
   marketDate:r.receipt.marketDate,
   physicalCAOriginals:r.receipt.observedSourceFamilies,
   sourcesExpected:6,asOfUtc:r.receipt.completedAtUtc,
   receiptHash:r.receipt.receiptHash,
   historicRevisionsAndNoEvent:false,fullPIT:false,
   selectedCount:null,frozen:false,cloudflareD1Writes:0
 }));
}
