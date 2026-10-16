// DATA_LANE #1068 / PIT-A: independently rehash 60 cached original TWSE
// daily bodies + ONE genuine prospective 2026-10-16 native response for 2330.
// Historic day publication clocks, CFI effective dates, CA negatives remain
// UNKNOWN. A1 source-only as-observed != PIT_SCOPE_INDEPENDENTLY_ACCEPTED.
// No provider GET, no Cloudflare, no strategy, no Frozen or System1.
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {parseOfficialHistoricalA1PayloadV0_1,
 buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';

export const FIXED=Object.freeze({
 oldMarketDate:'2026-10-15',nextMarketDate:'2026-10-16',
 symbol:'2330',market:'TWSE',
 cutUtc:'2026-10-16T15:45:00.000Z',
 oldRunId:38797319008,oldArtifactId:12002806667,
 oldZipDigest:'d4d4d4bf0e67e488bb474d08c5da53b777e65bca1edd9d361e59214e402e80bc',
 oldSourceReceiptHash:'ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9',
 oldAuditRunId:38797548446,oldAuditArtifactId:12002641996,
 oldIndependentAuditHash:'cebec987e32f863e42f9d95ffb881979164ed63be6716dc1e40bf2f8cf3f5808',
 newRunId:38908458028,newArtifactId:12049690326,
 newZipDigest:'2d40ddf4379318900f1776eaf93b23c5db4e942eebad62a76e7c7023ba2d5e17',
 newOriginalNativeSha:'c00391008b8a292dcec991afe102a07ea3e3a49ec42950a90491f3f13fe1a6cf',
 newSourceReceiptHash:'074c5e83afde3e4dd7dfb7295eb7483215848a84edb5b78493fd673592d9f18a'
});
const sha=b=>createHash('sha256').update(b).digest('hex');
const denied=msg=>{throw Error('S2_PITA_2330_61_ORIGINAL_'+msg)};
const isUtc=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString()===x;
const H=/^[a-f0-9]{64}$/;
const fields=['open','high','low','close','volumeShares','tradeValue',
  'transactions','companyName'];
const equal=(a,b)=>a===b||(a==null&&b==null);
export function validatePita2330ClockAndSessionChainV0_1({
 originalDates,originalBarDates,originalCaptureClocks,
 newCaptureUtc,auditAtUtc,cutUtc=FIXED.cutUtc
}={}){
 if(!Array.isArray(originalDates)||originalDates.length!==61||
    !Array.isArray(originalBarDates)||originalBarDates.length!==60||
    !Array.isArray(originalCaptureClocks)||originalCaptureClocks.length!==60||
    !isUtc(newCaptureUtc)||!isUtc(auditAtUtc)||cutUtc!==FIXED.cutUtc||
    !isUtc(cutUtc)||Date.parse(newCaptureUtc)>=Date.parse(cutUtc)||
    Date.parse(auditAtUtc)>=Date.parse(cutUtc)||
    originalDates.at(-1)!==FIXED.nextMarketDate||
    originalDates.at(-2)!==FIXED.oldMarketDate||
    originalDates.some((x,i)=>!/^2026-\d\d-\d\d$/.test(x)||
      (i>0&&x<=originalDates[i-1]))||
    originalBarDates.some((x,i)=>x!==originalDates[i])||
    originalCaptureClocks.some(x=>!isUtc(x)||Date.parse(x)>=Date.parse(cutUtc)))
  denied('DATES_AND_AVAILABLE_CLOCK_NOT_CONSISTENT_BY_CUT');
 return true;
}
export async function verifyPita2330Native61V0_1({
 oldRoot,newRoot,oldAuditRoot,
 readRaw=async file=>readFile(file),verifyAtUtc=new Date().toISOString()
}={}){
 if(typeof oldRoot!=='string'||!oldRoot||
    typeof newRoot!=='string'||!newRoot||
    typeof oldAuditRoot!=='string'||!oldAuditRoot||
    typeof readRaw!=='function'||!isUtc(verifyAtUtc))
  denied('ORIGINAL_PATH_OR_CLOCK_REQUIRED');
 if(Date.parse(verifyAtUtc)>=Date.parse(FIXED.cutUtc))
  denied('INDEPENDENT_SOURCE_READBACK_AFTER_TARGET_CUT');
 const [old,oldAudit,current]=await Promise.all([
  readRaw(resolve(oldRoot,'official-61-2026-10-15.json')),
  readRaw(resolve(oldAuditRoot,'s2-shared-a1-independent-audit/audit-receipt.json')),
  readRaw(resolve(newRoot,'pita-2330-a1-source-receipt.json')),
 ]).then(x=>x.map(b=>JSON.parse(b.toString('utf8'))));
 if(old.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    old.marketDate!==FIXED.oldMarketDate||old.state!=='SOURCE_OBSERVED_UNAUDITED'||
    old.receivedMarketDateCount!==122||old.receiptHash!==FIXED.oldSourceReceiptHash||
    await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(old))!==old.receiptHash)
  denied('OLD_SIGNED_122_SOURCE_INVALID');
 const {auditHash,...withoutAudit}=oldAudit;
 if(oldAudit.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
    oldAudit.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    oldAudit.sourceReceiptHash!==old.receiptHash||
    oldAudit.sourceMarketDatePairsVerified!==122||
    oldAudit.originalFilesRehashedAfterDownload!==122||
    oldAudit.originalFilesDecompressedAndParsed!==122||
    auditHash!==FIXED.oldIndependentAuditHash||
    await sha256Hex(withoutAudit)!==auditHash||
    oldAudit.selectionAuthorized!==false||
    !isUtc(oldAudit.auditedAtUtc))
  denied('OLD_INDEPENDENT_A1_SOURCE_AUDIT_NOT_VERIFIED');
 const {receiptHash,...withoutCurrent}=current;
 if(current.schemaVersion!=='S2_DATA_PITA_2330_PROSPECTIVE_A1_ORIGINAL_V0_1'||
    current.marketDate!==FIXED.nextMarketDate||current.market!=='TWSE'||
    current.symbol!=='2330'||current.sourceNativeBodySha256!==FIXED.newOriginalNativeSha||
    current.receiptHash!==FIXED.newSourceReceiptHash||
    await sha256Hex(withoutCurrent)!==receiptHash||
    current.originalBodySavedAndByteRehashed!==true||
    current.historicalCfiEffectivePeriodsCertified!==false||
    current.caRevisionsAndNoEventCertified!==false||
    current.pitEligible!==false||current.frozenD1Written!==false||
    current.selectedCount!==null||current.zeroPickDay!==null||
    current.targetResearchCutUtc!==FIXED.cutUtc)
  denied('CURRENT_SOURCE_SIGNED_OR_NOAUTH_INVALID');
 const oldDates=old.calendar?.tradingDates;
 const series=old.bySymbol?.['TWSE|2330'];
 if(!Array.isArray(oldDates)||oldDates.length!==61||
    oldDates.at(-1)!==FIXED.oldMarketDate||
    !Array.isArray(series?.bars)||series.bars.length!==61||
    series.marketDate!==FIXED.oldMarketDate||
    series.originalProviderResponseVerified!==true)
  denied('OLD_61_SYMBOL_CALENDAR_OR_UNIVERSE_INVALID');
 const newDates=[...oldDates.slice(1),FIXED.nextMarketDate];
 const previous=series.bars.slice(1);
 validatePita2330ClockAndSessionChainV0_1({
  originalDates:newDates,originalBarDates:previous.map(x=>x.date),
  originalCaptureClocks:previous.map(x=>x.firstKnownAt),
  newCaptureUtc:current.actualFirstPhysicalObservedAtUtc,
  auditAtUtc:oldAudit.auditedAtUtc
 });
 const sourceIndex=new Map(old.receipts.map(x=>[x.market+'|'+x.marketDate,x]));
 const pairIndex=new Map(old.originals.map(x=>[x.market+'|'+x.date,x]));
 const history=[];
 for(const [i,bar] of previous.entries()){
   const date=newDates[i],key='TWSE|'+date;
   const receipt=sourceIndex.get(key),file=pairIndex.get(key);
   if(!receipt||!file||
      bar.symbol!=='2330'||bar.market!=='TWSE'||
      bar.date!==date||bar.priceSpace!=='RAW'||
      !H.test(bar.sourceRowHash||'')||
      bar.firstKnownAt!==receipt.capturedAt||
      bar.availableAt!==receipt.capturedAt||
      bar.sourceOriginalResponseSha256!==receipt.originalRawResponseSha256||
      file.sourceSha256!==receipt.originalRawResponseSha256||
      receipt.providerReportedDate!==date||
      receipt.sourceUrl!==buildOfficialHistoricalA1UrlV0_1('TWSE',date)||
      !receipt.rawProviderBytesPreserved)
    denied('OLD_NATIVE_SYMBOL_DATE_RECEIPT_NOT_BOUND');
   let raw;
   try{raw=gunzipSync(await readRaw(resolve(oldRoot,'original-json/TWSE-'+date+'.json.gz')),
      {maxOutputLength:25_000_000});}
   catch{denied('OLD_DAY_NATIVE_ORIGINAL_MISSING')}
   if(raw.length!==receipt.originalRawResponseBytes||
      sha(raw)!==receipt.originalRawResponseSha256)
    denied('OLD_DAY_NATIVE_BYTES_HASH_MISMATCH');
   let parsed;
   try{
     parsed=parseOfficialHistoricalA1PayloadV0_1({
       market:'TWSE',marketDate:date,payload:JSON.parse(raw.toString('utf8')),
       observedAt:receipt.capturedAt,sourceUrl:receipt.sourceUrl
     });
   }catch{denied('OLD_ORIGINAL_PARSER_OR_DATE_INVALID')}
   const row=parsed.rows.find(x=>x.symbol==='2330');
   if(!row||parsed.state!=='READY'||
      parsed.rows.length!==receipt.rowCount||
      fields.some(k=>!equal(row[k],bar[k]))||
      await sha256Hex(row.sourceFields)!==bar.sourceRowHash)
    denied('OLD_ORIGINAL_2330_NATIVE_BAR_NOT_VERIFIED');
   history.push({
     marketDate:date,originalNativeBodySha256:sha(raw),
     nativeRowSourceFieldsSha256:bar.sourceRowHash,
     actualFirstPhysicalObservedAtUtc:receipt.capturedAt,
     originalHistoricalPublicationTimestampCertified:false
   });
 }
 let rawNew;
 try{rawNew=gunzipSync(await readRaw(resolve(newRoot,'TWSE-2026-10-16-original.json.gz')),
  {maxOutputLength:25_000_000});}
 catch{denied('NEW_DAY_NATIVE_ORIGINAL_MISSING')}
 if(sha(rawNew)!==current.sourceNativeBodySha256||
    rawNew.length!==current.sourceNativeBodyBytes)
  denied('NEW_DAY_NATIVE_BYTES_SHA_INVALID');
 let parsedNew;
 try{
   parsedNew=parseOfficialHistoricalA1PayloadV0_1({
    market:'TWSE',marketDate:FIXED.nextMarketDate,
    payload:JSON.parse(rawNew.toString('utf8')),
    observedAt:current.actualFirstPhysicalObservedAtUtc,
    sourceUrl:current.sourceUrl
   });
 }catch{denied('NEW_DAY_NATIVE_DATE_OR_SCHEMA_INVALID')}
 const newRows=parsedNew.rows.filter(x=>x.symbol==='2330'),row=newRows[0];
 if(newRows.length!==1||parsedNew.rows.length!==current.nativeMarketSourceRowCount||
    parsedNew.sourceDateEvidence!==FIXED.nextMarketDate||
    current.sourceUrl!==buildOfficialHistoricalA1UrlV0_1('TWSE',FIXED.nextMarketDate)||
    fields.some(k=>!equal(row[k],current.currentTradingDaySourceBar[k]))||
    await sha256Hex(row.sourceFields)!==
      current.currentTradingDaySourceBar.nativeSourceFieldsSha256)
  denied('NEW_DAY_NATIVE_2330_BAR_NOT_VERIFIED');
 history.push({
   marketDate:FIXED.nextMarketDate,
   originalNativeBodySha256:sha(rawNew),
   nativeRowSourceFieldsSha256:current.currentTradingDaySourceBar.nativeSourceFieldsSha256,
   actualFirstPhysicalObservedAtUtc:current.actualFirstPhysicalObservedAtUtc,
   originalHistoricalPublicationTimestampCertified:false,
 });
 if(history.length!==61||history.some((x,i)=>x.marketDate!==newDates[i]||
    !H.test(x.originalNativeBodySha256)||
    !H.test(x.nativeRowSourceFieldsSha256)))
  denied('SIXTY_ONE_ORIGINAL_NATIVE_DAYS_NOT_VERIFIED');
 const base={
   schemaVersion:'S2_DATA_PITA_2330_61_NATIVE_SOURCE_READBACK_V0_1',
   status:'61_OF_61_2330_NATIVE_A1_BAR_SOURCES_REHASHED__CFI_CA_PIT_UNKNOWN',
   stock:'2330',market:'TWSE',marketDate:FIXED.nextMarketDate,
   windowStartDate:newDates[0],windowLastDate:newDates.at(-1),
   targetResearchCutUtc:FIXED.cutUtc,
   actualVerificationAtUtc:verifyAtUtc,
   originalSourceOldRunId:FIXED.oldRunId,
   originalSourceOldArtifactId:FIXED.oldArtifactId,
   oldOriginalArtifactZipSha256:FIXED.oldZipDigest,
   originalSigned122ReceiptSha256:FIXED.oldSourceReceiptHash,
   oldIndependentSourceAuditRunId:FIXED.oldAuditRunId,
   oldIndependentSourceAuditArtifactId:FIXED.oldAuditArtifactId,
   oldIndependentSourceAuditSha256:FIXED.oldIndependentAuditHash,
   newCurrentSourceRunId:FIXED.newRunId,
   newCurrentSourceArtifactId:FIXED.newArtifactId,
   newOriginalArtifactZipSha256:FIXED.newZipDigest,
   newCurrentSourceReceiptHash:FIXED.newSourceReceiptHash,
   actualNewSourceCapturedAtUtc:current.actualFirstPhysicalObservedAtUtc,
   originalNativeDaysRehashed:61,
   previousNativeDaysRehashed:60,newCurrentNativeDaysRehashed:1,
   nativeDailyBarHashesMatched:61,
   originalResponseVersionLineage:history,
   onlyA1SourceEvidenceVerified:true,
   originalHistoricalIssuerPublicationAtCertified:false,
   independentFullPitAuditLaneAccepted:false,
   historicalCfiEffectivePeriodPITCertified:false,
   completeCARevisionsAndAuthoritativeNoEventCertified:false,
   sourceSecurityUniverseFullDayCertified:false,
   pitSymbolEligibleCount:0,selectedCount:null,zeroPickDay:null,
   frozenD1Written:false,shadowAuthorized:false,
   cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalCoreChanged:false,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/issue1068_pita_2330_61_native_source_readback_v0_1.mjs')){
 const r=await verifyPita2330Native61V0_1({
   oldRoot:process.env.S2_PITA_OLD_SOURCE_DIR||'/tmp/s2-pita-old-source',
   oldAuditRoot:process.env.S2_PITA_OLD_AUDIT_DIR||'/tmp/s2-pita-old-audit',
   newRoot:process.env.S2_PITA_CURRENT_ORIGINAL_DIR||'/tmp/s2-pita-current-source',
 });
 const dir='/tmp/s2-pita-2330-61-readback';await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(resolve(dir,'sourceonly-2330-61-native-verdict.json'),
   JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
   status:r.status,marketDate:r.marketDate,
   2330_originalSourceDays:r.originalNativeDaysRehashed,
   originalCurrentAsOfUtc:r.actualNewSourceCapturedAtUtc,
   originalReceiptHash:r.receiptHash,
   historicalCfiPIT:false,completeCA:false,fullPIT:false,
   selectedCount:null,frozen:false,cloudflareD1Writes:0
 }));
}
