// DATA_LANE #1068: actual source-observation-by-asof PIT bridge for the 2026-10-15
// TWSE/TPEx 61-session original A1 capture. Class A read-only only.
// This never certifies March-Oct retrospective availability, Stage1, Frozen or live trades.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
const SHA=/^[a-f0-9]{64}$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const digest=b=>createHash("sha256").update(b).digest("hex");
const validUtc=v=>typeof v==="string"&&UTC.test(v)&&Number.isFinite(Date.parse(v))&&
 new Date(v).toISOString()===new Date(Date.parse(v)).toISOString();
const fail=v=>{throw Error("S2_A1_122_ORIGINAL_ASOF_"+v)};
export const ORIGINALS=Object.freeze({
  marketDate:"2026-10-15",auditRunId:38797548446,archiveRunId:38797548542,
  auditArtifactId:12002641996,archiveArtifactId:12002547345,
  blockerIndependentRunId:38797655628,blockerArtifactId:12002104499,
  auditJsonBytes:1042,auditJsonSha256:"59e89ff70c41c8d500b7ee78fd4500f3411d6ad543b552b82c54b21f872ae11d",
  archiveJsonBytes:35180,archiveJsonSha256:"cf45f264d38649ca89e745c1ec7f90b1931dd2eef9d8c93a3a94d25d8e5c7b35",
  blockerJsonBytes:1183,blockerJsonSha256:"3c8063f5fae45a27b74625562d28d7dd48a54181e3b37af8234339c444fdf9d7",
  originalSourceReceiptHash:"ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9",
  independentSourceAuditHash:"cebec987e32f863e42f9d95ffb881979164ed63be6716dc1e40bf2f8cf3f5808",
  archiveReceiptHash:"6f3df8ed0a3cefab43cabd6409c32c90b4502004d1c7eb86ea760706da459cdf",
  sourceManifestSha256:"1774c38819285efc79dabbed482a143915de37378eddaf1173a47032a83b0e29",
  blockerIndependentAuditHash:"349e0768bb2c82a16d200d5373cb55128bdf388a4283d2a4893fd53caf7d9364"
});
function native(buf,size,sha,name){
 if(!Buffer.isBuffer(buf)||buf.length!==size||digest(buf)!==sha)
  fail(name+"_ORIGINAL_NATIVE_BYTES_SHA_INVALID");
 try{return JSON.parse(buf.toString("utf8"))}catch{fail(name+"_ORIGINAL_JSON_INVALID")}
}
function exactSourceFiles(archive){
 if(!Array.isArray(archive?.archivedPaths)||archive.archivedPaths.length!==122||
    !Array.isArray(archive?.fileStates))fail("ARCHIVED_PATHS_MISSING");
 const known=new Set();
 for(const f of archive.archivedPaths){
  if(typeof f!=="string"||!/^raw\/(TWSE|TPEX)\/2026\/2026-\d\d-\d\d--[a-f0-9]{64}\.json\.gz$/.test(f)||known.has(f))
   fail("DUPLICATE_OR_BAD_RAW_PATH");
  known.add(f);
 }
 const states=archive.fileStates.filter(s=>s?.path?.startsWith("raw/"));
 if(states.length!==122||states.some(s=>!known.has(s.path)||
    !["CREATED","VERIFIED_EXISTING"].includes(s.state)))fail("RAW_ARCHIVE_NOT_SAME_122");
 const dayMarket=new Set([...known].map(s=>{
   const m=s.match(/^raw\/(TWSE|TPEX)\/2026\/(2026-\d\d-\d\d)--/);
   return m?.[1]+"|"+m?.[2];
 }));
 if(dayMarket.size!==122||
    [...dayMarket].filter(s=>s.endsWith("|2026-10-15")).length!==2)
   fail("ORIGINAL_EXCHANGE_DATE_DENOMINATOR_INVALID");
 return dayMarket.size;
}
export function evaluateA1OriginalSourceObservationAsOfV0_1({
 auditBytes,archiveBytes,blockerBytes,decisionCutAtUtc,actualEvaluationAtUtc
}={}){
 const a=native(auditBytes,ORIGINALS.auditJsonBytes,ORIGINALS.auditJsonSha256,"AUDIT");
 const b=native(archiveBytes,ORIGINALS.archiveJsonBytes,ORIGINALS.archiveJsonSha256,"ARCHIVE");
 const c=native(blockerBytes,ORIGINALS.blockerJsonBytes,ORIGINALS.blockerJsonSha256,"BLOCKER");
 if(!validUtc(decisionCutAtUtc)||!validUtc(actualEvaluationAtUtc)||
    Date.parse(decisionCutAtUtc)>Date.parse(actualEvaluationAtUtc))
   fail("FUTURE_OR_INVALID_RESEARCH_CUTOFF");
 if(a.schemaVersion!=="SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1"||
    a.verdict!=="ACCEPTED_SOURCE_INTEGRITY_ONLY"||
    a.marketDate!==ORIGINALS.marketDate||
    a.sourceReceiptHash!==ORIGINALS.originalSourceReceiptHash||
    a.manifestSha256!==ORIGINALS.sourceManifestSha256||
    a.auditHash!==ORIGINALS.independentSourceAuditHash||
    a.sourceMarketDatePairsVerified!==122||
    a.originalFilesRehashedAfterDownload!==122||
    a.originalFilesDecompressedAndParsed!==122||
    a.officialCalendarTradingDatesVerified!==61||
    a.independentOfficialCalendarReadbackVerified!==true||
    a.sourceUrlAndProviderDateVerified!==true||
    a.auditorSeparation!=="INDEPENDENT_READBACK_PROCESS"||
    a.missingMarketDatePairs?.length!==0||
    !validUtc(a.auditedAtUtc)||
    a.strategyPitCertified!==false||a.selectionAuthorized!==false||
    a.selectedCount!==null||a.zeroPickDay!==null||
    a.frozenWritten!==false||a.cloudflareD1Writes!==0||
    a.cloudflareR2Writes!==0||a.system1FormalRuntimeTouched!==false)
   fail("SOURCE_INTEGRITY_OR_STRATEGY_AUTHORITY_INVALID");
 if(b.schemaVersion!=="SHARED_OFFICIAL_A1_PRIVATE_ARCHIVE_RECEIPT_V0_1"||
    b.targetVisibility!=="PRIVATE"||
    b.targetRepository!=="imihan0630-sys/v7-system2-official-a1-archive"||
    b.storageMode!=="PRIVATE_GIT_CONTENT_ADDRESSED_APPEND_ONLY"||
    b.sourceCoverage!=="COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED"||
    b.sourceReceiptHash!==a.sourceReceiptHash||
    b.sourceManifestSha256!==a.manifestSha256||
    b.archiveReceiptHash!==ORIGINALS.archiveReceiptHash||
    b.marketDate!==a.marketDate||b.sourceMarketDatePairs!==122||
    b.contentAddressed!==true||b.workflowAppendOnly!==true||
    b.publicRawPublication!==false||b.paidPlanUsed!==false||
    b.providerLevelImmutability!==false||
    b.selectionPerformed!==false||b.frozenWritten!==false||
    b.cloudflareD1Writes!==0||b.system1FormalCoreTouched!==false||
    !validUtc(b.operationObservedAtUtc)||!validUtc(b.sourceIssuedAtUtc))
   fail("PRIVATE_ARCHIVE_PROVENANCE_OR_PIT_INVALID");
 exactSourceFiles(b);
 if(c.schemaVersion!=="S2_M09_DAILY_BLOCKER_INDEPENDENT_READBACK_V0_1"||
    c.upstreamAuditRunId!==String(ORIGINALS.auditRunId)||
    c.originalMarketDate!==a.marketDate||
    c.originalProviderSourceReceiptHash!==a.sourceReceiptHash||
    c.originalIndependentA1AuditHash!==a.auditHash||
    c.auditHash!==ORIGINALS.blockerIndependentAuditHash||
    c.auditorSeparation!=="INDEPENDENT_GITHUB_ACTIONS_UPSTREAM_SIGNED_RECEIPT_RECOMPUTATION"||
    c.rehashedUpstreamReceiptCount!==3||c.fullJournalReproduced!==true||
    c.classifiedAsFormalZeroPick!==false||c.classifiedAsFrozen!==false||
    c.PITAssessorQualified!==false||c.selectedCount!==null||c.zeroPickDay!==null||
    c.cloudflareD1Writes!==0||c.cloudflareR2Writes!==0||
    c.system1FormalCoreTouched!==false||!validUtc(c.auditedAtUtc))
   fail("INDEPENDENT_NON_SELECTION_BARRIER_INVALID");
 const timestamps=[a.auditedAtUtc,b.operationObservedAtUtc,c.auditedAtUtc];
 const verifiedAt=timestamps.reduce((x,y)=>Date.parse(x)>Date.parse(y)?x:y);
 const passed=timestamps.every(x=>Date.parse(x)<=Date.parse(decisionCutAtUtc));
 const parts=Object.fromEntries(new Intl.DateTimeFormat("en-US",{
   timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",
   hour:"2-digit",hourCycle:"h23"
 }).formatToParts(new Date(decisionCutAtUtc)).filter(x=>x.type!=="literal")
 .map(x=>[x.type,x.value]));
 const localDate=parts.year+"-"+parts.month+"-"+parts.day;
 const preOpen=localDate==="2026-10-16"&&Number(parts.hour)<9;
 const sourceOnlyResearchEligible=passed&&preOpen;
 const payload={
  schemaVersion:"S2_ISSUE1068_A1_122_SOURCE_OBSERVATION_ASOF_V0_1",
  status:sourceOnlyResearchEligible?
   "REAL_122_SOURCE_PAIRS_INDEPENDENTLY_OBSERVED_BY_PREOPEN_ASOF__STRATEGY_PIT_BLOCKED":
   "SOURCE_ASOF_PREOPEN_NOT_QUALIFIED__NO_STRATEGY_PIT",
  marketDate:ORIGINALS.marketDate,decisionCutAtUtc,actualEvaluationAtUtc,
  sourcePairs:122,sourceTradingSessions:61,
  sourceHash:ORIGINALS.originalSourceReceiptHash,
  independentOriginalAuditHash:ORIGINALS.independentSourceAuditHash,
  archiveReceiptHash:ORIGINALS.archiveReceiptHash,
  nonSelectionIndependentAuditHash:ORIGINALS.blockerIndependentAuditHash,
  actualIndependentSourceRehashCount:122,
  exactOriginalArchivedContentAddressedPairs:122,
  earliestFullyWitnessedAtUtc:verifiedAt,
  allRequiredSourceAndRiskReceiptsObservedBeforeDecision:passed,
  nextDayResearchOnlyPreOpenWindow:preOpen,
  sourceObservationPitForThisResearchCut:sourceOnlyResearchEligible,
  marketDayOriginalCloseFinalityPitAt2345:false,
  strategyPitCertified:false,
  canReconstructHistoricalFirstKnownAt:false,
  historicRawOHLCVAtOriginalTradingDateCertified:false,
  nativeSecurityClassFullHistoricalPitCertified:false,
  sixCaCompleteHistoricalRevisionsAndNoEventCertified:false,
  frozenDecisionCaptured:false,selectionAuthorized:false,
  finalRankingAuthorized:false,zeroPickDay:null,selectedCount:null,
  historicalPerformanceBacktestAuthorized:false,shadowAdmitted:false,
  independentAuditLaneFormalPITSignoff:false,
  sourceOfTruth:"ORIGINAL_GITHUB_ACTIONS_NATIVE_IMMUTABLE_WITHIN_RETENTION_RECEIPTS",
  providerLevelPermanentImmutabilityCertified:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false
 };
 return Object.freeze({...payload,receiptSha256:digest(Buffer.from(JSON.stringify(payload),"utf8"))});
}
async function main(){
 if(process.argv.length!==5)fail("THREE_ORIGINAL_JSON_FILES_REQUIRED");
 const files=await Promise.all(process.argv.slice(2).map(p=>readFile(p)));
 const now=new Date().toISOString();
 const result=evaluateA1OriginalSourceObservationAsOfV0_1({
  auditBytes:files[0],archiveBytes:files[1],blockerBytes:files[2],
  decisionCutAtUtc:now,actualEvaluationAtUtc:now});
 if(!result.sourceObservationPitForThisResearchCut)fail("SOURCE_NOT_PREOPEN_ASOF_QUALIFIED");
 await mkdir("/tmp/s2-a1-122-preopen-pit",{recursive:true,mode:0o700});
 await writeFile("/tmp/s2-a1-122-preopen-pit/sanitized-source-asof-only.json",
  JSON.stringify(result,null,2)+"\n",{mode:0o600});
 console.log(JSON.stringify({status:result.status,pairs:result.sourcePairs,
  sourcePitAtActualResearchCut:result.sourceObservationPitForThisResearchCut,
  strategyPitCertified:false,frozen:false,historicalPit:false,cloudflareWrites:0}));
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{await main()}catch(e){console.error(String(e.message).startsWith("S2_A1_122_ORIGINAL_ASOF_")?
  e.message:"S2_A1_122_ORIGINAL_ASOF_FAIL_CLOSED");process.exitCode=2}
}
