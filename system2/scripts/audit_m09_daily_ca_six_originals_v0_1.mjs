// Separate-process, exact-original readback of SIX current official CA ranges.
// An observed range is NOT historical firstKnownAt, full correction/retraction,
// a certified NO_EVENT, Stage1 PIT, formal picks, or a Frozen decision.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {
 buildOfficialContinuitySourceUrlsV0_1,
 summarizeOfficialContinuityNativeOriginalV0_1
} from '../runtime/official_continuity_source_capability_v0_1.mjs';

const PREFIX='M09_DAILY_CA_INDEPENDENT_',MAX=8_000_000;
const IDS=Object.freeze([
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL','TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE','TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE','TPEX_PAR_VALUE_CHANGE_REFERENCE'
]);
const SHA=/^[a-f0-9]{64}$/i, UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const hash=b=>createHash('sha256').update(b).digest('hex');
const strip=(x,key)=>Object.fromEntries(Object.entries(x||{}).filter(([k])=>k!==key));
const isUtc=s=>typeof s==='string'&&UTC.test(s)&&Number.isFinite(Date.parse(s))&&
 new Date(s).toISOString()===new Date(Date.parse(s)).toISOString();
const isDay=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d$/.test(s)&&
 Number.isFinite(Date.parse(s+'T00:00:00Z'))&&
 new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const deny=s=>{throw Error(PREFIX+s)};
async function signed(obj,field){
 return obj&&typeof obj==='object'&&!Array.isArray(obj)&&
   SHA.test(obj[field]||'')&&
   await sha256Hex(strip(obj,field))===obj[field];
}
const mustNoAuthority=o=>o?.selectedCount===null&&
 o?.zeroPickDay===null&&o?.frozenD1Written===false&&
 o?.cloudflareD1Writes===0&&o?.cloudflareR2Writes===0&&
 o?.system1FormalCoreTouched===false;

// This is a second native-event parser, separate from the producer's
// replay_m09_ca_observed_negative_overlap_v0_1.mjs. It can validate each
// POSITIVE flagged event from the original body, NEVER absence of events.
const SYMBOL=/^[1-9]\d{3}$/;
const CODE_FIELDS=new Set(['股票代號','證券代號','代號']);
const DATE_FIELDS=new Set(['資料日期','恢復買賣日期','除權息日期']);
function dateFromNative(input){
 const raw=String(input??'').trim();
 const parts=raw.replace(/[年月日]/g,'/').replace(/[.\-]/g,'/').split('/').filter(Boolean);
 if(parts.length===3){
  const year=Number(parts[0]);
  if(!parts.every(x=>/^\d+$/.test(x)))return null;
  const y=year<1912?year+1911:year;
  const d=String(y).padStart(4,'0')+'-'+String(+parts[1]).padStart(2,'0')+
   '-'+String(+parts[2]).padStart(2,'0');
  return isDay(d)?d:null;
 }
 const digits=raw.replace(/\D/g,'');
 if(digits.length!==7&&digits.length!==8)return null;
 const offset=digits.length===7?3:4;
 const y=digits.length===7?Number(digits.slice(0,3))+1911:
  Number(digits.slice(0,4));
 const d=String(y).padStart(4,'0')+'-'+digits.slice(offset,offset+2)+
  '-'+digits.slice(offset+2,offset+4);
 return isDay(d)?d:null;
}
function nativePositiveKeys(bytes){
 let payload;
 try{payload=JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''))}
 catch{deny('POSITIVE_EVENT_ORIGINAL_NOT_NATIVE_JSON')}
 const tables=Array.isArray(payload?.tables)?payload.tables:
  Array.isArray(payload?.fields)&&Array.isArray(payload?.data)?[payload]:[];
 const table=tables.find(t=>Array.isArray(t?.fields)&&Array.isArray(t?.data)&&
  t.fields.some(x=>CODE_FIELDS.has(String(x??'').trim()))&&
  t.fields.some(x=>DATE_FIELDS.has(String(x??'').trim())));
 if(!table)deny('POSITIVE_EVENT_NATIVE_SYMBOL_DATE_TABLE_UNVERIFIED');
 const fields=table.fields.map(x=>String(x??'').trim());
 const symbolIdx=fields.findIndex(x=>CODE_FIELDS.has(x));
 const dateIdx=fields.findIndex(x=>DATE_FIELDS.has(x));
 const keys=new Set();
 for(const row of table.data){
  if(!Array.isArray(row))continue;
  const symbol=String(row[symbolIdx]??'').trim();
  if(!SYMBOL.test(symbol))continue;
  const date=dateFromNative(row[dateIdx]);
  if(date)keys.add(symbol+'|'+date);
 }
 return keys;
}


export async function auditM09DailyCaSixOriginalsV0_1({
 advisory,caReceipt,eventRisk,readOriginal,auditedAtUtc=new Date().toISOString(),
 sourceRunId,parseNative=summarizeOfficialContinuityNativeOriginalV0_1,
}={}){
 if(!Number.isSafeInteger(sourceRunId)||sourceRunId<1||!isUtc(auditedAtUtc)||
    typeof readOriginal!=='function'||typeof parseNative!=='function')
  deny('AUDITOR_ID_CLOCK_OR_IO_INVALID');
 if(!await signed(advisory,'receiptHash')||
    advisory.schemaVersion!=='S2_M09_DAILY_CA_NEGATIVE_ADVISORY_V0_1'||
    advisory.state!=='OBSERVED_EVENT_RISK_OVERLAY_ONLY_NOT_PIT_SELECTION'||
    !isDay(advisory.marketDate)||advisory.caNativeRangeCount!==6||
    !Number.isSafeInteger(advisory.preliminaryCount)||
    advisory.preliminaryCount<1||advisory.preliminaryCount>30||
    !Number.isSafeInteger(advisory.caKnownEventPreviewCount)||
    advisory.caKnownEventPreviewCount<0||
    advisory.caKnownEventPreviewCount>advisory.preliminaryCount||
    advisory.historicalEventFirstKnownAtCertified!==false||
    advisory.noEventMayBeClaimed!==false||
    advisory.ordinaryEquityPITCertified!==false||
    advisory.formalSelectionAuthorized!==false||
    !mustNoAuthority(advisory))
  deny('SIGNED_ADVISORY_OR_NO_AUTHORITY_INVALID');
 if(!await signed(caReceipt,'receiptHash')||
    caReceipt.schemaVersion!=='S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1'||
    caReceipt.state!=='SIX_RAW_SOURCES_CAPTURED_AUTHORITY_UNVERIFIED'||
    !isDay(caReceipt.requestedStartDate)||
    caReceipt.requestedStartDate>advisory.marketDate||
    caReceipt.requestedEndDate!==advisory.marketDate||
    caReceipt.sourceFamilyDenominator!==6||
    caReceipt.sourcesRetainedOriginalBytes!==6||
    caReceipt.nativeRangeSchemaCandidates!==6||
    !Array.isArray(caReceipt.sourceReceipts)||
    caReceipt.sourceReceipts.length!==6||
    caReceipt.historicalFirstKnownAtCertified!==false||
    caReceipt.entireRangeCorrectionAndCancellationCoverageCertified!==false||
    caReceipt.instrumentClassPITCertified!==false||
    caReceipt.sourceContractCoverageComplete!==false||
    caReceipt.noEventMayBeClaimed!==false||
    caReceipt.continuityCertified!==false||
    caReceipt.selectionAuthorized!==false||
    !mustNoAuthority(caReceipt)||
    advisory.caSourceReceiptHash!==caReceipt.receiptHash||
    advisory.sourceFirstObservedAtUtc!==caReceipt.firstPhysicalObservedAtUtc)
  deny('SIGNED_SIX_SOURCE_RECEIPT_OR_SCOPE_INVALID');
 if(!await signed(eventRisk,'receiptHash')||
    eventRisk.schemaVersion!=='S2_M09_CA_NEGATIVE_REPLAY_61_SESSION_V0_1'||
    eventRisk.marketDate!==advisory.marketDate||
    eventRisk.caRawSixSourceReceiptHash!==caReceipt.receiptHash||
    eventRisk.initialA1ReceiptHash!==advisory.originalSourceReceiptHash||
    eventRisk.independentA1AuditHash!==advisory.independentA1AuditHash||
    eventRisk.previewReceiptHash!==advisory.preliminaryWatchHash||
    eventRisk.originalCaSourceCount!==6||
    eventRisk.originalCaShaRehashed!==6||
    eventRisk.previewWithProvenPresentCaIn61Sessions!==advisory.caKnownEventPreviewCount||
    eventRisk.preliminaryPreviewCount!==advisory.preliminaryCount||
    eventRisk.previewWithoutObservedCaNotClearedCount+
      eventRisk.previewWithProvenPresentCaIn61Sessions!==advisory.preliminaryCount||
    eventRisk.retroactivePitAdmission!==false||
    eventRisk.asKnownAtPreviousDecisionClock!==false||
    eventRisk.completeHistoricalRevisionAndCancellationEvidence!==false||
    eventRisk.noEventOrNoActionMayBeCertified!==false||
    eventRisk.formalStrategySelectionAuthorized!==false||
    !mustNoAuthority(eventRisk)||
    advisory.caEventRiskReceiptHash!==eventRisk.receiptHash)
  deny('SIGNED_EVENT_RISK_LINK_OR_NO_EVENT_SEMANTICS_INVALID');
 const startMs=Date.parse(caReceipt.firstPhysicalObservedAtUtc);
 const endMs=Date.parse(caReceipt.completedAtUtc);
 const auditMs=Date.parse(auditedAtUtc);
 if(!isUtc(caReceipt.firstPhysicalObservedAtUtc)||
    !isUtc(caReceipt.completedAtUtc)||startMs>endMs||endMs>auditMs||
    !isUtc(eventRisk.caRawFirstObservedAtUtc)||
    eventRisk.caRawFirstObservedAtUtc!==caReceipt.firstPhysicalObservedAtUtc||
    eventRisk.caRawCompletedAtUtc!==caReceipt.completedAtUtc)
  deny('HISTORICAL_CLOCK_BACKDATING_OR_SOURCE_WINDOW_INVALID');
 const expected=buildOfficialContinuitySourceUrlsV0_1({
  startDate:caReceipt.requestedStartDate,endDate:caReceipt.requestedEndDate
 });
 const seen=new Set(),physical=[],positiveEventLookup=new Map();
 for(const id of IDS){
  const r=caReceipt.sourceReceipts.find(x=>x.sourceId===id);
  const originalContract=expected[id];
  if(!r||seen.has(id)||r.sourceId!==id||
     r.exchange!==originalContract.exchange||
     JSON.stringify(r.actionFamilies)!==JSON.stringify(originalContract.actionFamilies)||
     r.sourceClass!==originalContract.sourceClass||
     r.sourceUrl!==originalContract.url||
     r.state!=='RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED'||
     r.originalBytesReadBackLocally!==true||
     r.firstKnownAtEvidenceClass!=='FIRST_PHYSICAL_OBSERVATION_NOW_NOT_HISTORICAL_PUBLICATION'||
     r.effectiveVintageRevisionRetractionCoverageVerified!==false||
     !SHA.test(r.originalSha256||'')||
     !Number.isSafeInteger(r.originalBytes)||r.originalBytes<30||r.originalBytes>MAX||
     !isUtc(r.capturedAtUtc)||Date.parse(r.capturedAtUtc)<startMs||
     Date.parse(r.capturedAtUtc)>endMs)
    deny('OFFICIAL_FAMILY_URL_OR_OBSERVATION_PROVENANCE_INVALID');
  seen.add(id);
  const gz=await readOriginal(id,caReceipt.requestedEndDate);
  if(!Buffer.isBuffer(gz))deny('GZIP_NOT_ORIGINAL_BYTES');
  let bytes;
  try{bytes=gunzipSync(gz,{maxOutputLength:MAX});}
  catch{deny('ORIGINAL_GZIP_OR_SIZE_INVALID')}
  if(bytes.length!==r.originalBytes||hash(bytes)!==r.originalSha256)
   deny('ORIGINAL_BODY_SHA_OR_LENGTH_MISMATCH');
  const native=parseNative({
   originalText:bytes.toString('utf8'),
   startDate:caReceipt.requestedStartDate,endDate:caReceipt.requestedEndDate
  });
  if(native?.state!=='STRUCTURE_READY'||
     native.responseRangeVerified!==true||
     native.recognizedStructure!==true||
     await sha256Hex(native)!==await sha256Hex(r.nativeSchema))
   deny('INDEPENDENT_NATIVE_RANGE_OR_SCHEMA_MISMATCH');
  const sourceEvent=eventRisk.perSource?.find(x=>x.sourceId===id);
  if(sourceEvent?.originalRawSha256!==r.originalSha256||
     sourceEvent?.originalBytes!==r.originalBytes||
     sourceEvent?.capturedAtUtc!==r.capturedAtUtc||
     sourceEvent?.rangeReverifiedFromActualBytes!==true)
   deny('EVENT_RISK_PER_SOURCE_ORIGINAL_MISMATCH');
  positiveEventLookup.set(id,nativePositiveKeys(bytes));
  physical.push({sourceId:id,originalSha256:r.originalSha256,
   originalBytes:r.originalBytes,rangeIndependentlyReparsed:true});
 }
 if(new Set(caReceipt.sourceReceipts.map(x=>x.sourceId)).size!==6||
    seen.size!==6||eventRisk.perSource?.length!==6||
    !Array.isArray(eventRisk.flaggedPreview)||
    eventRisk.flaggedPreview.length!==advisory.caKnownEventPreviewCount)
  deny('SIX_FAMILY_OR_FLAGGED_PREVIEW_DENOMINATOR_INVALID');
 // Producer's signed count is not proof an event was actually in the
 // provider's original body. Reconstruct every POSITIVE event association.
 // A missing association is an error; an unflagged symbol stays UNKNOWN.
 const seenFlagged=new Set();
 let verifiedPositiveEvents=0;
 for(const flagged of eventRisk.flaggedPreview){
  if(!['TWSE','TPEX'].includes(flagged?.market)||
     !SYMBOL.test(flagged?.symbol)||!Array.isArray(flagged?.events)||
     flagged.events.length===0||
     flagged.sourceEventCount!==flagged.events.length||
     seenFlagged.has(flagged.market+'|'+flagged.symbol))
   deny('FLAGGED_POSITIVE_SYMBOL_OR_COUNT_INVALID');
  seenFlagged.add(flagged.market+'|'+flagged.symbol);
  const seenEvents=new Set();
  for(const event of flagged.events){
   const id=event?.sourceId,day=event?.eventDate;
   const key=id+'|'+day;
   if(!IDS.includes(id)||!id.startsWith(flagged.market+'_')||
      !isDay(day)||day<eventRisk.firstTradingDate||
      day>eventRisk.lastTradingDate||
      event.knowledgeTimeClass!==
       'ONLY_PROVEN_PRESENT_AS_OF_CA_SOURCE_CAPTURE_NOT_HISTORICAL_PIT'||
      seenEvents.has(key)||
      !positiveEventLookup.get(id)?.has(flagged.symbol+'|'+day))
    deny('SIGNED_FLAGGED_EVENT_NOT_FOUND_IN_ORIGINAL_NATIVE_BODY');
   seenEvents.add(key);
   verifiedPositiveEvents++;
  }
 }
 if(verifiedPositiveEvents<eventRisk.flaggedPreview.length)
  deny('POSITIVE_EVENT_COUNT_UNDERRUN');

 const base={schemaVersion:'S2_M09_DAILY_SIX_CA_INDEPENDENT_ORIGINAL_AUDIT_V0_1',
  verdict:'ACCEPTED_CURRENT_SIX_CA_RAW_RANGE_ONLY_NOT_HISTORICAL_PIT',
  sourceRunId,auditedAtUtc,marketDate:advisory.marketDate,
  requestedStartDate:caReceipt.requestedStartDate,
  originalA1SourceReceiptHash:advisory.originalSourceReceiptHash,
  independentA1AuditHash:advisory.independentA1AuditHash,
  preliminaryWatchHash:advisory.preliminaryWatchHash,
  caSourceReceiptHash:caReceipt.receiptHash,
  caEventRiskReceiptHash:eventRisk.receiptHash,
  sourceReportedKnownEventPreviewCount:advisory.caKnownEventPreviewCount,
  positiveFlaggedPreviewIndependentlyVerified:seenFlagged.size,
  positiveEventRowsIndependentlyMatched:verifiedPositiveEvents,
  unflaggedPreviewNoEventCertified:false,
  originalCaFamiliesIndependentlyRehashed:physical.length,
  independentNativeRangeSchemaReparsed:physical.length,
  originalSourceFamilyHashes:physical,
  historicalFirstKnownAtPITCertified:false,
  completeCorrectionsAndRetractionsCertified:false,
  historicalNoEventCoverageCertified:false,
  ordinaryEquityClassPITCertified:false,
  stage1SelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false};
 return Object.freeze({...base,auditHash:await sha256Hex(base)});
}

if(process.argv[1]?.endsWith('/audit_m09_daily_ca_six_originals_v0_1.mjs')){
 const root=process.env.S2_M09_DAILY_CA_SOURCE_DIR||
  '/tmp/s2-m09-daily-ca-independent-readback';
 const sourceRunId=Number(process.env.S2_M09_CA_SOURCE_RUN_ID);
 const [advisory,caReceipt,eventRisk]=await Promise.all([
  'daily-ca-advisory.json','ca-source-receipt.json','ca-negative-risk.json'
 ].map(x=>readFile(resolve(root,x),'utf8').then(JSON.parse)));
 const receipt=await auditM09DailyCaSixOriginalsV0_1({
  advisory,caReceipt,eventRisk,sourceRunId,
  readOriginal:async(id,day)=>readFile(resolve(root,id+'-'+day+'.json.gz'))
 });
 const out='/tmp/s2-m09-six-ca-independent-audit';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'audit-receipt.json'),
  JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({verdict:receipt.verdict,
  sourceRunId:receipt.sourceRunId,marketDate:receipt.marketDate,
  sixRawOriginalShaRehashed:receipt.originalCaFamiliesIndependentlyRehashed,
  sourceReportedKnownEventPreviewCount:receipt.sourceReportedKnownEventPreviewCount,
  positiveFlaggedPreviewIndependentlyVerified:receipt.positiveFlaggedPreviewIndependentlyVerified,
  positiveEventRowsIndependentlyMatched:receipt.positiveEventRowsIndependentlyMatched,
  historicalPIT:false,noEventCertified:false,
  selectedCount:null,frozenD1Written:false,auditHash:receipt.auditHash}));
}
