// Class A PIT engineering: capture 6 real official CA originals at actual NOW
// even if the earlier session's preliminary 30-symbol research watch is expired.
// Signed original A1 122/122 + independent source integrity MUST already exist.
// No retrospective same-day selection, no proof of historic corrections/NO_EVENT,
// no frozen decisions, no Cloudflare, no paid source, no System1 changes.
import {createHash} from "node:crypto";
import {readFile,readdir,mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {gzipSync,gunzipSync} from "node:zlib";
import {sha256Hex} from "../runtime/decision_archive.mjs";
import {official61SessionSourceReceiptHashBaseV0_1}
 from "../runtime/source_first_official_61_session_collector_v0_1.mjs";
import {probeM09SixCaOriginalsV0_1}
 from "./probe_m09_six_ca_native_originals_readonly_v0_1.mjs";

const H=/^[a-f0-9]{64}$/i;
const sha=b=>createHash("sha256").update(b).digest("hex");
const clean=x=>Object.fromEntries(Object.entries(x||{}).filter(([k])=>k!=="auditHash"));
const fail=x=>{throw Error("S2_M09_PROSPECTIVE_CA_"+x)};
const isUtc=x=>typeof x==="string"&&Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString()===x;
function validCalendar(dates,day){
 return Array.isArray(dates)&&dates.length===61&&dates.at(-1)===day&&
 dates.every((x,i)=>/^\d{4}-\d\d-\d\d$/.test(x)&&
 Number.isFinite(Date.parse(x+"T00:00:00Z"))&&
 new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x&&
 (i===0||x>dates[i-1]));
}
export async function validateProspectiveCaSourceV0_1(source,audit){
 const check=source?.schemaVersion==="S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1"&&
  source?.state==="SOURCE_OBSERVED_UNAUDITED"&&
  source?.receivedMarketDateCount===122&&
  validCalendar(source?.calendar?.tradingDates,source?.marketDate)&&
  H.test(source?.receiptHash||"")&&
  audit?.schemaVersion==="SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1"&&
  audit?.verdict==="ACCEPTED_SOURCE_INTEGRITY_ONLY"&&
  audit?.marketDate===source.marketDate&&
  audit?.sourceReceiptHash===source.receiptHash&&
  audit?.sourceMarketDatePairsVerified===122&&
  audit?.originalFilesRehashedAfterDownload===122&&
  audit?.originalFilesDecompressedAndParsed===122&&
  audit?.auditorSeparation==="INDEPENDENT_READBACK_PROCESS"&&
  audit?.selectionAuthorized===false&&
  H.test(audit?.auditHash||"");
 if(!check)fail("ORIGINAL_SOURCE_AUDIT_NOT_122_OR_PIT_UNKNOWN");
 if(await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(source))!==source.receiptHash||
    await sha256Hex(clean(audit))!==audit.auditHash)
  fail("SIGNED_ORIGINAL_SOURCE_OR_INDEPENDENT_AUDIT_HASH_MISMATCH");
 return true;
}
export async function captureM09ProspectiveSixCaNoWatchV0_1({
 sourceReceipt,independentAudit,now=()=>new Date(),
 fetchImpl=globalThis.fetch,persistRaw,
 capture=probeM09SixCaOriginalsV0_1
}={}){
 await validateProspectiveCaSourceV0_1(sourceReceipt,independentAudit);
 if(typeof persistRaw!=="function"||typeof fetchImpl!=="function"||typeof capture!=="function")
  fail("ORIGINAL_CREATE_ONLY_SOURCE_IO_REQUIRED");
 const captureStartedUtc=now().toISOString();
 if(!isUtc(captureStartedUtc))fail("CLOCK_INVALID");
 const ca=await capture({
  marketDate:sourceReceipt.marketDate,
  startDate:sourceReceipt.calendar.tradingDates[0],
  now,fetchImpl,persistRaw
 });
 const captureCompletedUtc=now().toISOString();
 if(!isUtc(captureCompletedUtc)||Date.parse(captureCompletedUtc)<Date.parse(captureStartedUtc)||
    ca?.schemaVersion!=="S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1"||
    ca?.requestedStartDate!==sourceReceipt.calendar.tradingDates[0]||
    ca?.requestedEndDate!==sourceReceipt.marketDate||
    ca?.sourceFamilyDenominator!==6||
    !Number.isSafeInteger(ca?.sourcesRetainedOriginalBytes)||
    ca.sourcesRetainedOriginalBytes<0||ca.sourcesRetainedOriginalBytes>6||
    !Number.isSafeInteger(ca.nativeRangeSchemaCandidates)||
    ca.nativeRangeSchemaCandidates<0||ca.nativeRangeSchemaCandidates>ca.sourcesRetainedOriginalBytes||
    !Array.isArray(ca.sourceReceipts)||ca.sourceReceipts.length!==6||
    !isUtc(ca.firstPhysicalObservedAtUtc)||!isUtc(ca.completedAtUtc)||
    Date.parse(ca.firstPhysicalObservedAtUtc)<Date.parse(captureStartedUtc)||
    Date.parse(ca.completedAtUtc)>Date.parse(captureCompletedUtc)||
    Date.parse(ca.completedAtUtc)<Date.parse(ca.firstPhysicalObservedAtUtc)||
    !H.test(ca.receiptHash||"")||
    await sha256Hex(Object.fromEntries(Object.entries(ca).filter(([k])=>k!=="receiptHash")))!==ca.receiptHash||
    ca.sourceContractCoverageComplete!==false||
    ca.historicalFirstKnownAtCertified!==false||
    ca.entireRangeCorrectionAndCancellationCoverageCertified!==false||
    ca.instrumentClassPITCertified!==false||
    ca.noEventMayBeClaimed!==false||
    ca.continuityCertified!==false||
    ca.selectionAuthorized!==false||ca.selectedCount!==null||
    ca.zeroPickDay!==null||ca.frozenD1Written!==false||
    ca.cloudflareD1Writes!==0||ca.cloudflareR2Writes!==0||
    ca.system1FormalCoreTouched!==false)
   fail("OFFICIAL_SIX_CA_RECEIPT_OR_CLOCK_OR_NO_AUTHORITY_INVALID");
 const status=ca.sourcesRetainedOriginalBytes===6&&ca.nativeRangeSchemaCandidates===6?
  "PROSPECTIVE_SIX_CA_ORIGINALS_CAPTURED_NOW__HISTORIC_PIT_UNKNOWN":
  "PROSPECTIVE_CA_PARTIAL_OR_SOURCE_UNAVAILABLE__HISTORIC_PIT_UNKNOWN";
 const base={
  schemaVersion:"S2_M09_PROSPECTIVE_SIX_CA_CAPTURE_WITHOUT_WATCH_V0_1",
  status,marketDate:sourceReceipt.marketDate,
  sourceReceiptHash:sourceReceipt.receiptHash,
  independentSourceAuditHash:independentAudit.auditHash,
  actualObservationStartedUtc:captureStartedUtc,
  actualObservationCompletedUtc:captureCompletedUtc,
  caSourceReceiptHash:ca.receiptHash,
  sourceFamilyCount:6,
  originalBodyBytesRetained:ca.sourcesRetainedOriginalBytes,
  nativeRangeCandidates:ca.nativeRangeSchemaCandidates,
  basedOnExpiredOrMissingWatch:false,
  requiresNoPreliminaryWatch:true,
  originalMarketDayCutQualified:false,
  observationOnlyAvailableAtUtc:ca.firstPhysicalObservedAtUtc,
  historicalCFIEffectivePITCertified:false,
  completeCARevisionsAndNoEventCertified:false,
  firstKnownAtOriginalMarketDateCertified:false,
  qualifiedSelection:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,shadowAdmitted:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return Object.freeze({receipt:{...base,receiptHash:await sha256Hex(base)},ca});
}
if(process.argv[1]?.endsWith("/capture_m09_prospective_six_ca_no_watch_v0_1.mjs")){
 const root=process.env.S2_A1_AUDIT_SOURCE_DIR||"/tmp/s2-source-for-independent-readback";
 const sourceFilename=(await readdir(root)).find(x=>/^official-61-\d{4}-\d\d-\d\d\.json$/.test(x));
 if(!sourceFilename)fail("UPSTREAM_SIGNED_122_SOURCE_MISSING");
 const [source,independentAudit]=await Promise.all([
  readFile(resolve(root,sourceFilename),"utf8"),
  readFile("/tmp/s2-shared-a1-independent-audit/audit-receipt.json","utf8")
 ]).then(v=>v.map(JSON.parse));
 const output="/tmp/s2-m09-prospective-six-ca-no-watch";
 await mkdir(output,{recursive:true,mode:0o700});
 const saved=new Set();
 const persistRaw=async({sourceId,marketDate,original,sha256})=>{
  if(saved.has(sourceId)||!/^T(WSE|PEX)_[A-Z_]+$/.test(sourceId))fail("DUPLICATE_OR_UNLISTED_ORIGINAL");
  const filename=resolve(output,sourceId+"-"+marketDate+".json.gz");
  await writeFile(filename,gzipSync(original,{level:6}),{flag:"wx",mode:0o600});
  const replay=gunzipSync(await readFile(filename));
  if(sha(replay)!==sha256)fail("ORIGINAL_READBACK_SHA_MISMATCH");
  saved.add(sourceId);
  return {verified:true,sha256:sha(replay),byteLength:replay.length};
 };
 const result=await captureM09ProspectiveSixCaNoWatchV0_1({
  sourceReceipt:source,independentAudit,persistRaw
 });
 await writeFile(resolve(output,"prospective-only-receipt.json"),
  JSON.stringify(result.receipt,null,2)+"\n",{flag:"wx",mode:0o600});
 await writeFile(resolve(output,"six-ca-source-receipt.json"),
  JSON.stringify(result.ca,null,2)+"\n",{flag:"wx",mode:0o600});
 console.log(JSON.stringify({
  status:result.receipt.status,marketDate:result.receipt.marketDate,
  sourceFamilyCount:6,originalBodyBytesRetained:result.receipt.originalBodyBytesRetained,
  observedAtUtc:result.receipt.observationOnlyAvailableAtUtc,
  historicalPIT:false,selectedCount:null,frozen:false,d1Writes:0
 }));
}
