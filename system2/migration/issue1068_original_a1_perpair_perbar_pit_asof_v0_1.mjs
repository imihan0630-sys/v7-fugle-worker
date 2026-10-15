// DATA_LANE #1068 original signed 61-session A1 file/body/bar/cut reconciliation.
// Read-only: no Cloudflare, no workflow schedule, no strategies, no System1 changes.
// This independently re-parses every original provider response and checks every
// persisted complete-window OHLCV row against the original source receipt.
// "Observed" is NOT original publication PIT on historical trading dates.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {gunzipSync} from "node:zlib";
import {pathToFileURL} from "node:url";
import {official61SessionSourceReceiptHashBaseV0_1} from "../runtime/source_first_official_61_session_collector_v0_1.mjs";
import {parseOfficialHistoricalA1PayloadV0_1,buildOfficialHistoricalA1UrlV0_1} from "../runtime/official_historical_a1_source_v0_1.mjs";
import {sha256Hex} from "../runtime/decision_archive.mjs";

const DAY=/^2026-\d\d-\d\d$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const SHA=/^[a-f0-9]{64}$/;
const has=(a,v)=>Object.prototype.hasOwnProperty.call(a,v);
const sha=buffer=>createHash("sha256").update(buffer).digest("hex");
const at=x=>typeof x==="string"&&UTC.test(x)&&Number.isFinite(Date.parse(x))&&
  new Date(x).toISOString()===new Date(Date.parse(x)).toISOString();
const fault=reason=>{throw Error("S2_A1_ORIGINAL_PERBAR_PIT_"+reason)};
const safeEq=(a,b)=>a===b||(a==null&&b==null);
export const REAL=Object.freeze({
  marketDate:"2026-10-15",
  sourceRunId:38797319008,sourceArtifactId:12002806667,
  independentAuditRunId:38797548446,independentAuditArtifactId:12002641996,
  expectedReceiptHash:"ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9",
  expectedAuditHash:"cebec987e32f863e42f9d95ffb881979164ed63be6716dc1e40bf2f8cf3f5808",
  expectedSessions:61,expectedPairs:122,expectedCompleteSymbolWindows:1935,
  originalMarketDayDecisionCutUtc:"2026-10-15T15:45:00.000Z",
  alreadyExecutedPreopenResearchCutUtc:"2026-10-15T21:45:43.188Z"
});
function checkHeader(original,audit,evaluationAtUtc){
 if(!at(evaluationAtUtc))fault("EVALUATION_CLOCK_INVALID");
 if(original?.schemaVersion!=="S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1"||
  original.marketDate!==REAL.marketDate||original.state!=="SOURCE_OBSERVED_UNAUDITED"||
  original.receiptHash!==REAL.expectedReceiptHash||
  original.requestCount!==122||original.receivedMarketDateCount!==122||
  original.plannedMarketDateRequests!==122||
  original.assessorExecuted!==false||original.selectedCount!==null||
  original.frozenDecisionsDurablyReadBack!==false||
  !Array.isArray(original.errors)||original.errors.length!==0||
  !Array.isArray(original.receipts)||original.receipts.length!==122||
  !Array.isArray(original.originals)||original.originals.length!==122||
  original.originalCount!==122||!original.bySymbol||
  original.sourceRowSymbolWindowsCompleteCount!==REAL.expectedCompleteSymbolWindows||
  Object.keys(original.bySymbol).length!==REAL.expectedCompleteSymbolWindows)
  fault("ORIGINAL_SOURCE_SCOPE_INVALID");
 if(!Array.isArray(original.calendar?.tradingDates)||
   original.calendar.tradingDates.length!==61||
   original.calendar.tradingDates.at(-1)!==REAL.marketDate||
   original.calendar.tradingDates.some((x,i,a)=>!DAY.test(x)||(i>0&&x<=a[i-1])))
  fault("ORIGINAL_CALENDAR_INVALID");
 if(audit?.schemaVersion!=="SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1"||
    audit.verdict!=="ACCEPTED_SOURCE_INTEGRITY_ONLY"||
    audit.sourceReceiptHash!==REAL.expectedReceiptHash||
    audit.auditHash!==REAL.expectedAuditHash||
    audit.marketDate!==REAL.marketDate||
    audit.sourceMarketDatePairsVerified!==122||
    audit.originalFilesRehashedAfterDownload!==122||
    audit.originalFilesDecompressedAndParsed!==122||
    audit.officialCalendarTradingDatesVerified!==61||
    audit.auditorSeparation!=="INDEPENDENT_READBACK_PROCESS"||
    audit.selectionAuthorized!==false||audit.strategyPitCertified!==false||
    audit.frozenWritten!==false||audit.selectedCount!==null||
    !at(audit.auditedAtUtc)||Date.parse(audit.auditedAtUtc)>Date.parse(evaluationAtUtc))
   fault("INDEPENDENT_ORIGINAL_AUDIT_INVALID");
}
function pairClockValid(r,evaluationAtUtc){
 return ["TWSE","TPEX"].includes(r?.market)&&DAY.test(r.marketDate||"")&&
  at(r.capturedAt)&&Date.parse(r.capturedAt)<=Date.parse(evaluationAtUtc)&&
  r.providerReportedDate===r.marketDate&&
  r.sourceUrl===buildOfficialHistoricalA1UrlV0_1(r.market,r.marketDate)&&
  r.rawProviderBytesPreserved===true&&SHA.test(r.originalRawResponseSha256||"")&&
  Number.isInteger(r.rowCount)&&r.rowCount>(r.market==="TWSE"?600:450)&&
  Number.isInteger(r.originalRawResponseBytes)&&r.originalRawResponseBytes>0;
}
export async function auditOriginalA1DailyBarPitCutV0_1({
 original,independentAudit,originalDirectory,
 evaluationAtUtc,readRaw=async path=>readFile(path),
 cutoffs=[
  REAL.originalMarketDayDecisionCutUtc,
  REAL.alreadyExecutedPreopenResearchCutUtc
 ]
}={}){
 checkHeader(original,independentAudit,evaluationAtUtc);
 if(typeof originalDirectory!=="string"||!originalDirectory||
    typeof readRaw!=="function"||
    !Array.isArray(cutoffs)||cutoffs.length!==2||
    cutoffs.some(x=>!at(x)||Date.parse(x)>Date.parse(evaluationAtUtc))||
    cutoffs[0]!==REAL.originalMarketDayDecisionCutUtc||
    cutoffs[1]!==REAL.alreadyExecutedPreopenResearchCutUtc)
  fault("PHYSICAL_SOURCE_PATH_OR_REAL_CUTS_INVALID");
 if(await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(original))!==
    REAL.expectedReceiptHash)fault("ORIGINAL_RECEIPT_SIGNED_HASH_MISMATCH");
 const {auditHash,...unsignedAudit}=independentAudit;
 if(await sha256Hex(unsignedAudit)!==REAL.expectedAuditHash)
  fault("INDEPENDENT_AUDIT_SIGNED_HASH_MISMATCH");
 const pairs=new Map();
 const originalIndex=new Map();
 for(const r of original.receipts){
   const k=r.market+"|"+r.marketDate;
   if(pairs.has(k)||!pairClockValid(r,evaluationAtUtc)||
      !original.calendar.tradingDates.includes(r.marketDate))
     fault("SOURCE_RECEIPT_PAIR_OR_CLOCK_INVALID");
   pairs.set(k,r);
 }
 for(const r of original.originals){
   const k=r.market+"|"+r.date;
   const sr=pairs.get(k);
   if(originalIndex.has(k)||!sr||r.sourceSha256!==sr.originalRawResponseSha256||
      r.originalBytes!==sr.originalRawResponseBytes||
      r.observedAt!==sr.capturedAt||!Number.isInteger(r.gzipBytes)||
      r.gzipBytes<=0)
     fault("ORIGINAL_FILE_VS_SOURCE_RECEIPT_INVALID");
   originalIndex.set(k,r);
 }
 if(pairs.size!==122||originalIndex.size!==122||
    original.calendar.tradingDates.some(d=>["TWSE","TPEX"].some(m=>!pairs.has(m+"|"+d))))
   fault("122_SOURCE_PAIRS_NOT_EXHAUSTIVE");
 const byPair=new Map();
 let completeWindowBars=0;
 for(const [key,series] of Object.entries(original.bySymbol)){
   if(!series||!["TWSE","TPEX"].includes(series.market)||
      series.market+"|"+series.symbol!==key||
      !Array.isArray(series.bars)||series.bars.length!==61||
      series.marketDate!==REAL.marketDate||
      series.originalProviderResponseVerified!==true)
    fault("FULL_SYMBOL_WINDOW_INVALID");
   for(let i=0;i<61;i++){
     const bar=series.bars[i],expectedDay=original.calendar.tradingDates[i];
     const pair=bar.market+"|"+bar.date,source=pairs.get(pair);
     if(!source||bar.symbol!==series.symbol||bar.market!==series.market||
       bar.date!==expectedDay||bar.marketDate!==expectedDay||
       bar.firstKnownAt!==source.capturedAt||bar.availableAt!==source.capturedAt||
       bar.sourceOriginalResponseSha256!==source.originalRawResponseSha256||
       !SHA.test(bar.sourceRowHash||"")||bar.priceSpace!=="RAW")
        fault("ORIGINAL_BAR_CLOCK_OR_SOURCE_LINKAGE_INVALID");
     if(!byPair.has(pair))byPair.set(pair,new Map());
     const map=byPair.get(pair);
     if(map.has(bar.symbol))fault("DUPLICATE_SYMBOL_PER_PAIR");
     map.set(bar.symbol,bar);
     completeWindowBars++;
   }
 }
 if(completeWindowBars!==REAL.expectedCompleteSymbolWindows*61)
   fault("61_SESSION_FULL_BAR_DENOMINATOR_MISMATCH");
 const sanitized=[];
 let physicallyRead=0,reconciled=0;
 for(const date of original.calendar.tradingDates){
  for(const market of ["TWSE","TPEX"]){
   const pair=market+"|"+date,s=pairs.get(pair);
   const file=resolve(originalDirectory,market+"-"+date+".json.gz");
   let raw;
   try{raw=gunzipSync(await readRaw(file),{maxOutputLength:32*1024*1024})}
   catch{fault("ORIGINAL_GZIP_MISSING_OR_UNREADABLE")}
   if(raw.length!==s.originalRawResponseBytes||
      sha(raw)!==s.originalRawResponseSha256)fault("ORIGINAL_PROVIDER_RAW_BODY_SHA_MISMATCH");
   let native;
   try{native=JSON.parse(raw.toString("utf8"))}catch{fault("PROVIDER_NATIVE_JSON_INVALID")}
   const parsed=parseOfficialHistoricalA1PayloadV0_1({
    market,marketDate:date,observedAt:s.capturedAt,
    sourceUrl:s.sourceUrl,payload:native
   });
   if(parsed.state!=="READY"||parsed.sourceDateEvidence!==date||
     parsed.rows.length!==s.rowCount)fault("OFFICIAL_PROVIDER_ORIGINAL_DATE_OR_ROWS_CHANGED");
   const wanted=byPair.get(pair)||new Map(),seen=new Set();
   for(const row of parsed.rows){
    if(seen.has(row.symbol))fault("ORIGINAL_PROVIDER_DUPLICATE_CODE");
    seen.add(row.symbol);
    const bar=wanted.get(row.symbol);
    if(!bar)continue;
    for(const k of ["open","high","low","close","volumeShares","tradeValue","transactions","companyName"]){
     if(!safeEq(row[k],bar[k]))fault("OHLCV_OR_COMPANY_NAME_SOURCE_RECONCILIATION_FAILED");
    }
    if(await sha256Hex(row.sourceFields)!==bar.sourceRowHash)
      fault("BAR_NATIVE_ROW_FIELDS_SHA_MISMATCH");
    reconciled++;
   }
   if([...wanted.keys()].some(k=>!seen.has(k)))fault("COMPLETE_SYMBOL_ROW_NOT_PRESENT_IN_NATIVE");
   physicallyRead++;
   sanitized.push({
    market,marketDate:date,sourceCapturedAtUtc:s.capturedAt,
    nativeOriginalBodySha256:s.originalRawResponseSha256,
    nativeRowCount:s.rowCount,
    completeWindowBarsMatched:wanted.size,
    originalHistoricalPublicationTimeProven:false,
    sourceReceiptClaimedCaptureByOriginal2345Cut:Date.parse(s.capturedAt)<=Date.parse(cutoffs[0]),
    sourceReceiptClaimedCaptureByPreopenCut:Date.parse(s.capturedAt)<=Date.parse(cutoffs[1]),
    captureTimeBasis:"SOURCE_SIGNED_RECEIPT; ORIGINAL_PRIOR_WITNESS_NOT_INDEPENDENTLY_REPLAYED_FOR_THAT_HISTORICAL_CUT"
   });
  }
 }
 if(physicallyRead!==122||reconciled!==completeWindowBars||
    sanitized.some(x=>x.completeWindowBarsMatched===0))
  fault("NATIVE_122_OR_ALL_WINDOW_BARS_NOT_RECONCILED");
 const observedOriginal=sanitized.filter(s=>s.sourceReceiptClaimedCaptureByOriginal2345Cut).length;
 const observedPreopen=sanitized.filter(s=>s.sourceReceiptClaimedCaptureByPreopenCut).length;
 const independentAuditAtOriginalCut=Date.parse(independentAudit.auditedAtUtc)<=Date.parse(cutoffs[0]);
 const independentAuditAtPreopenCut=Date.parse(independentAudit.auditedAtUtc)<=Date.parse(cutoffs[1]);
 return Object.freeze({
  schemaVersion:"S2_ISSUE1068_A1_ORIGINAL_PERPAIR_PERBAR_SOURCE_ASOF_V0_1",
  status:"ORIGINAL_122_NATIVE_PROVIDER_BODIES_AND_ALL_COMPLETE_WINDOW_BARS_RECONCILED__HISTORIC_PIT_UNPROVEN",
  originalSourceRunId:REAL.sourceRunId,originalSourceArtifactId:REAL.sourceArtifactId,
  independentOriginalAuditRunId:REAL.independentAuditRunId,
  independentAuditArtifactId:REAL.independentAuditArtifactId,
  originalReceiptSha256:REAL.expectedReceiptHash,
  independentAuditSha256:REAL.expectedAuditHash,
  originalMarketDate:REAL.marketDate,
  trueEvaluationAtUtc:evaluationAtUtc,
  sourcePairsIndependentlyByteRehashed:physicallyRead,
  earlierOriginalArtifactArchiveWitnessBefore2345Verified:false,
  originalMarketCutMustNotTreatSourceReceiptClockAsIndependentWitness:true,
  originalNativePayloadsDecompressedAndReparsed:physicallyRead,
  completeSymbolWindowsReconciled:REAL.expectedCompleteSymbolWindows,
  individualOriginalOHLCVBarsIndependentlyReconciled:reconciled,
  providerDatesWithExplicitOriginalSourceClock:61,
  checks:[
   {name:"2026-10-15_original_market_2345",cutUtc:cutoffs[0],
    pairsSignedSourceReceiptClaimsCapturedByCut:observedOriginal,
    originalNativeIndependentArchiveBeforeCutVerified:false,
    all122SourcePairsObserved:observedOriginal===122,
    independentAuditCompletedByCut:independentAuditAtOriginalCut,
    qualifiedComplete122ForDecision:false, // no original independent archive witness before 23:45 in this lane
    strategyPitQualified:false},
   {name:"2026-10-16_0545_preopen_research",cutUtc:cutoffs[1],
    pairsSignedSourceReceiptClaimsCapturedByCut:observedPreopen,
    originalNativeIndependentAuditBeforeCutVerified:independentAuditAtPreopenCut,
    all122SourcePairsObserved:observedPreopen===122,
    independentAuditCompletedByCut:independentAuditAtPreopenCut,
    qualifiedComplete122ForDecision:observedPreopen===122&&independentAuditAtPreopenCut,
    strategyPitQualified:false}
  ],
  originalPublicMarketDayAvailableAtIndependentlyVerified:false,
  historicalCARevisionsAndNoEventComplete:false,
  full61HistoricalCommonShareCFIOriginalEffectivePeriodsVerified:false,
  historicalFirstKnownAtAndAvailableAtCertified:0,
  independentFormalPITAuditSignoff:false,
  finalStrategySelectedCount:null,
  frozenDecisionsPersisted:false,historicalBacktestAuthorized:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1FormalCoreModified:false,
  perPair:sanitized
 });
}
async function cli(){
 const [sourceFile,auditFile,rawDir]=process.argv.slice(2);
 if(!sourceFile||!auditFile||!rawDir)fault("THREE_INPUT_PATHS_REQUIRED");
 const [source,audit]=await Promise.all([sourceFile,auditFile].map(p=>readFile(p,"utf8").then(JSON.parse)));
 const out=await auditOriginalA1DailyBarPitCutV0_1({
  original:source,independentAudit:audit,originalDirectory:rawDir,
  evaluationAtUtc:new Date().toISOString()
 });
 await mkdir("/tmp/s2-a1-original-perpair-pit",{recursive:true,mode:0o700});
 await writeFile("/tmp/s2-a1-original-perpair-pit/sanitized-original-perpair-pit.json",
  JSON.stringify(out,null,2)+"\n",{flag:"wx",mode:0o600});
 console.log(JSON.stringify({
  status:out.status,originalPairs:out.sourcePairsIndependentlyByteRehashed,
  rawOHLCVBars:out.individualOriginalOHLCVBarsIndependentlyReconciled,
  decisionCut:out.checks[0],preopenResearch:out.checks[1],
  historicPIT:0,frozen:false,d1Writes:0
 }));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{await cli()}catch(error){
  console.error(String(error.message).startsWith("S2_A1_ORIGINAL_PERBAR_PIT_")?
    error.message:"S2_A1_ORIGINAL_PERBAR_PIT_FAIL_CLOSED");
  process.exitCode=2;
 }
}
