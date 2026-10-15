// System2 M09 daily Class A: supplemental known-PRESENT CA risk overlay.
// Runs only AFTER the independently audited 61-session original A1 watch.
// Does NOT re-rank, reject official stocks, certify missing events, or write D1.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {probeM09SixCaOriginalsV0_1}
 from './probe_m09_six_ca_native_originals_readonly_v0_1.mjs';
import {replayM09CaObservedNegativeOverlapV0_1}
 from './replay_m09_ca_observed_negative_overlap_v0_1.mjs';
const OUT='/tmp/s2-m09-daily-ca-negative-readonly';
const H=/^[a-f0-9]{64}$/i;
const sha=b=>createHash('sha256').update(b).digest('hex');
// Never request six real provider endpoints using merely plausible 64-hex labels.
// Reject mutated source/audit/watch receipts BEFORE any network or raw persistence.
const unsigned=(o,key)=>Object.fromEntries(Object.entries(o||{}).filter(([k])=>k!==key));
async function validSignedReceipt(o,key,hashBase=unsigned){
 try{
  return o&&typeof o==='object'&&!Array.isArray(o)&&
   H.test(o[key]||'')&&await sha256Hex(hashBase(o,key))===o[key];
 }catch{return false;}
}
const calendarValid=dates=>Array.isArray(dates)&&dates.length===61&&
 dates.every((d,i)=>/^\d{4}-\d\d-\d\d$/.test(d)&&
  Number.isFinite(Date.parse(d+'T00:00:00Z'))&&
  new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d&&
  (i===0||d>dates[i-1]));
const allowed=s=>s?.schemaVersion==='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'&&
 s.state==='SOURCE_OBSERVED_UNAUDITED'&&
 s.receivedMarketDateCount===122&&
 calendarValid(s.calendar?.tradingDates)&&
 s.calendar.tradingDates.at(-1)===s.marketDate&&H.test(s.receiptHash||'');
const watchValid=(w,s,a)=>w?.schemaVersion==='S2_PRELIMINARY_PV_WATCH_V0_2'&&
 w.marketDate===s.marketDate&&
 w.originalSourceReceiptHash===s.receiptHash&&
 w.independentSourceAuditHash===a.auditHash&&
 w.selectedCount===null&&w.finalSelectionAuthorized===false&&
 w.state==='PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION'&&
 Array.isArray(w.watchlist)&&w.watchlist.length===w.displayedCount&&
 H.test(w.receiptHash||'');
const originalSourceSignature=source=>validSignedReceipt(source,'receiptHash',
 s=>official61SessionSourceReceiptHashBaseV0_1(s));
function noAuthority({marketDate,sourceReceiptHash,auditHash,reason,watch=null}){
 return {schemaVersion:'S2_M09_DAILY_CA_NEGATIVE_ADVISORY_V0_1',
  state:'SUPPLEMENTAL_CA_SOURCE_NOT_READY',reason,
  marketDate,originalSourceReceiptHash:sourceReceiptHash,
  independentA1AuditHash:auditHash,preliminaryWatchHash:watch?.receiptHash||null,
  preliminaryCount:watch?.watchlist?.length??null,
  caSourceReceiptHash:null,caNativeRangeCount:0,
  caKnownEventPreviewCount:null,caEventRiskReceiptHash:null,
  sourceFirstObservedAtUtc:null,asOfObservationOnly:true,
  historicalEventFirstKnownAtCertified:false,noEventMayBeClaimed:false,
  ordinaryEquityPITCertified:false,formalSelectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreTouched:false};
}
export async function runM09DailyCaNegativeAdvisoryV0_1({
 sourceReceipt,independentSourceAudit,preliminaryWatch,
 fetchImpl=globalThis.fetch,now=()=>new Date(),persistRaw,
 originalBySourceId={},
 capture=probeM09SixCaOriginalsV0_1,
 replay=replayM09CaObservedNegativeOverlapV0_1,
}={}){
 if(!allowed(sourceReceipt)||
    !(await originalSourceSignature(sourceReceipt))||
    independentSourceAudit?.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    independentSourceAudit?.sourceReceiptHash!==sourceReceipt.receiptHash||
    independentSourceAudit?.sourceMarketDatePairsVerified!==122||
    independentSourceAudit.selectionAuthorized!==false||
    independentSourceAudit.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
    !(await validSignedReceipt(independentSourceAudit,'auditHash')))
  return Object.freeze(await (async()=>{const b=noAuthority({
   marketDate:sourceReceipt?.marketDate??null,
   sourceReceiptHash:sourceReceipt?.receiptHash??null,
   auditHash:independentSourceAudit?.auditHash??null,
   reason:'INDEPENDENT_122_PAIR_SOURCE_AUDIT_NOT_ACCEPTED'});
   return {...b,receiptHash:await sha256Hex(b)};})());
 if(!watchValid(preliminaryWatch,sourceReceipt,independentSourceAudit)||
    !(await validSignedReceipt(preliminaryWatch,'receiptHash'))){
  const b=noAuthority({marketDate:sourceReceipt.marketDate,
   sourceReceiptHash:sourceReceipt.receiptHash,
   auditHash:independentSourceAudit.auditHash,
   reason:'ACTUAL_PRELIMINARY_WATCH_NOT_AVAILABLE_OR_NOT_MATCHED',
   watch:preliminaryWatch});
  return Object.freeze({...b,receiptHash:await sha256Hex(b)});
 }
 const ca=await capture({
  marketDate:sourceReceipt.marketDate,startDate:sourceReceipt.calendar.tradingDates[0],
  fetchImpl,now,persistRaw,
 });
 let overlap=null;
 if(ca.sourceFamilyDenominator===6&&ca.sourcesRetainedOriginalBytes===6&&
    ca.nativeRangeSchemaCandidates===6){
  overlap=await replay({sourceReceipt,independentSourceAudit,preliminaryWatch,
   caReceipt:ca,originalBySourceId});
 }
 const base={
  schemaVersion:'S2_M09_DAILY_CA_NEGATIVE_ADVISORY_V0_1',
  state:overlap?'OBSERVED_EVENT_RISK_OVERLAY_ONLY_NOT_PIT_SELECTION':
    'SUPPLEMENTAL_CA_SOURCE_NOT_READY',
  reason:overlap?null:'SIX_NATIVE_CA_FAMILY_RANGE_OR_BYTE_EVIDENCE_INCOMPLETE',
  marketDate:sourceReceipt.marketDate,
  originalSourceReceiptHash:sourceReceipt.receiptHash,
  independentA1AuditHash:independentSourceAudit.auditHash,
  preliminaryWatchHash:preliminaryWatch.receiptHash,
  preliminaryCount:preliminaryWatch.watchlist.length,
  caSourceReceiptHash:ca.receiptHash,
  caNativeRangeCount:ca.nativeRangeSchemaCandidates,
  caKnownEventPreviewCount:overlap?.previewWithProvenPresentCaIn61Sessions??null,
  caEventRiskReceiptHash:overlap?.receiptHash??null,
  sourceFirstObservedAtUtc:ca.firstPhysicalObservedAtUtc,
  asOfObservationOnly:true,
  historicalEventFirstKnownAtCertified:false,noEventMayBeClaimed:false,
  ordinaryEquityPITCertified:false,formalSelectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreTouched:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base),
  capturedCaSourceReceipt:ca,caNegativeRiskReceipt:overlap});
}
if(process.argv[1]?.endsWith('/run_m09_daily_ca_negative_advisory_readonly_v0_1.mjs')){
 const sourceDir=process.env.S2_A1_AUDIT_SOURCE_DIR||
   '/tmp/s2-source-for-independent-readback';
 const src=(await readdir(sourceDir)).find(x=>/^official-61-\d{4}-\d\d-\d\d\.json$/.test(x));
 if(!src)throw Error('M09_DAILY_CA_ORIGINAL_61_SESSION_SOURCE_MISSING');
 const [sourceReceipt,independentSourceAudit,preliminaryWatch]=await Promise.all([
  readFile(resolve(sourceDir,src),'utf8'),
  readFile('/tmp/s2-shared-a1-independent-audit/audit-receipt.json','utf8'),
  readFile('/tmp/s2-a1-stage1-readonly/preliminary-pv-watch.json','utf8')
 ]).then(arr=>arr.map(JSON.parse));
 await mkdir(OUT,{recursive:true,mode:0o700});
 const byId={};
 const r=await runM09DailyCaNegativeAdvisoryV0_1({
  sourceReceipt,independentSourceAudit,preliminaryWatch,
  persistRaw:async({sourceId,marketDate,original,sha256})=>{
   const p=resolve(OUT,sourceId+'-'+marketDate+'.json.gz');
   await writeFile(p,gzipSync(original,{level:6}),{flag:'wx',mode:0o600});
   const read=gunzipSync(await readFile(p));
   byId[sourceId]=read;
   return {verified:sha(read)===sha256,sha256:sha(read),byteLength:read.length};
  },
  originalBySourceId:byId
 });
 const {capturedCaSourceReceipt,caNegativeRiskReceipt,...summary}=r;
 await writeFile(resolve(OUT,'daily-ca-advisory.json'),
  JSON.stringify(summary,null,2)+'\n',{flag:'wx',mode:0o600});
 if(capturedCaSourceReceipt)await writeFile(resolve(OUT,'ca-source-receipt.json'),
  JSON.stringify(capturedCaSourceReceipt,null,2)+'\n',{flag:'wx',mode:0o600});
 if(caNegativeRiskReceipt)await writeFile(resolve(OUT,'ca-negative-risk.json'),
  JSON.stringify(caNegativeRiskReceipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({state:r.state,marketDate:r.marketDate,
  caNativeRangeCount:r.caNativeRangeCount,
  preliminaryCount:r.preliminaryCount,
  caKnownEventPreviewCount:r.caKnownEventPreviewCount,
  caRiskReceiptHash:r.caEventRiskReceiptHash,
  noEventMayBeClaimed:false,selectedCount:null,
  cloudflareD1Writes:0}));
}
