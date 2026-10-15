// DATA_LANE #1068: official MOPS historical SOURCE-REPORTED clock ledger.
// This is a retrospective availability firewall, NOT a historical first-known time oracle.
// No network, D1, R2, outcomes, trading or production side effects in this module.
import {createHash} from "node:crypto";
import {MOPS_REVISION_CONTROLS_V0_2} from "../runtime/mops_revision_control_matrix_v0_2.mjs";
import {certifyMopsovSourceReportedControlV0_1,mopsovSourceReportedAtV0_1}
  from "../runtime/mopsov_source_reported_clock_v0_1.mjs";

const hex=/^[a-f0-9]{64}$/;
const fail=code=>{throw Error("S2_HISTORICAL_MOPS_PIT_"+code)};
const sha=s=>createHash("sha256").update(String(s),"utf8").digest("hex");
const timestamp=x=>typeof x==="string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(x) &&
  Number.isFinite(Date.parse(x));
const sourcedAt=x=>typeof x==="string"&&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/.test(x)&&
  Number.isFinite(Date.parse(x));
const officialUrl="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
export const REQUIRED_CONTROL_IDS=Object.freeze(MOPS_REVISION_CONTROLS_V0_2.map(x=>x.id));
export function buildHistoricalMopsSourceClockLedgerV0_1({captures=[]}={}){
 if(!Array.isArray(captures)||captures.length!==REQUIRED_CONTROL_IDS.length)
   fail("FIVE_FROZEN_CONTROLS_REQUIRED");
 const configs=new Map(MOPS_REVISION_CONTROLS_V0_2.map(x=>[x.id,x]));
 const seen=new Set(),versions=[],summary=[];
 for(const capture of captures){
   const id=capture?.controlId;
   const expected=configs.get(id);
   if(!expected||seen.has(id))fail("UNEXPECTED_OR_DUPLICATE_CONTROL");
   seen.add(id);
   if(!timestamp(capture?.capturedAtUtc)||!hex.test(capture?.originalResponseSha256||"")||
     capture?.sourceUrl!==officialUrl||!Array.isArray(capture?.rows)||
     capture.rows.length<1||capture.rows.length>100)fail("ORIGINAL_CAPTURE_RECEIPT_INVALID");
   const accepted=certifyMopsovSourceReportedControlV0_1({control:expected,rows:capture.rows});
   if(!accepted.pass)fail("SOURCE_REPORTED_CLOCK_OR_REVISION_INVALID");
   const each=new Set();let earliest=null,latest=null;
   for(const row of capture.rows){
     const clock=mopsovSourceReportedAtV0_1(row);
     if(!clock.eligible||!sourcedAt(clock.sourceReportedAt))fail("BAD_SOURCE_REPORTED_CLOCK");
     if(Date.parse(clock.sourceReportedAt)>Date.parse(capture.capturedAtUtc))
       fail("SOURCE_CLOCK_AFTER_CAPTURE");
     const key=expected.stockCode+"|"+clock.versionKey;
     if(each.has(key))fail("DUPLICATED_VERSION_WITHIN_CONTROL");
     each.add(key);
     const sourceEvidenceString=JSON.stringify([
       expected.stockCode,clock.versionKey,
       String(row.rowText||"").replace(/\s+/g," ").trim(),
       row.correctionOrCancellationHint===true
     ]);
     const rowSha=sha(sourceEvidenceString);
     versions.push(Object.freeze({
       controlId:id,actionFamily:expected.actionFamily,stockCode:expected.stockCode,
       versionKey:clock.versionKey,sourceReportedAt:clock.sourceReportedAt,
       sourceReportedClockQuality:"MOPS_VISIBLE_HIDDEN_CLOCK_MATCH",
       correctionOrCancellationHint:row.correctionOrCancellationHint===true,
       sourceRowEvidenceSha256:rowSha,
       originalResponseSha256:capture.originalResponseSha256,
       sourceUrl:officialUrl,
       retrospectiveCapturedAtUtc:capture.capturedAtUtc,
       firstObservedAtConservativeUpperBoundUtc:capture.capturedAtUtc,
       firstKnownAt:null,availableAt:null,
       historicalDecisionPITAdmissible:false,
       asOfBeforeCaptureEligible:false,
       originalPublicationLatencyCertified:false
     }));
     earliest=earliest===null||clock.sourceReportedAt<earliest?clock.sourceReportedAt:earliest;
     latest=latest===null||clock.sourceReportedAt>latest?clock.sourceReportedAt:latest;
   }
   summary.push(Object.freeze({
     controlId:id,actionFamily:expected.actionFamily,
     sourceReportedVersionCount:capture.rows.length,
     retrospectiveCapturedAtUtc:capture.capturedAtUtc,
     originalResponseSha256:capture.originalResponseSha256,
     earliestSourceReportedAt:earliest,latestSourceReportedAt:latest,
     sourceReportedClockSemanticsPass:true,
     originalPlusCorrectionOrCancellationObserved:true,
     publiclyAvailableOnOriginalDateProven:false,
     historicRevisionFamilyExhaustivenessProven:false
   }));
 }
 if(seen.size!==configs.size)fail("FROZEN_CONTROL_SET_INCOMPLETE");
 versions.sort((a,b)=>a.controlId.localeCompare(b.controlId)||
   a.sourceReportedAt.localeCompare(b.sourceReportedAt)||
   a.versionKey.localeCompare(b.versionKey));
 summary.sort((a,b)=>a.controlId.localeCompare(b.controlId));
 const uniqueGlobal=new Set(versions.map(x=>x.controlId+"|"+x.versionKey));
 if(uniqueGlobal.size!==versions.length)fail("DUPLICATE_VERSION_KEYS");
 const body={
   schemaVersion:"S2_DATA_HISTORICAL_MOPS_SOURCE_CLOCK_LEDGER_V0_1",
   status:"RETROSPECTIVE_OFFICIAL_SOURCE_REPORTED_VERSION_CLOCKS_CAPTURED__HISTORICAL_PIT_UNKNOWN",
   provider:"TWSE_OFFICIAL_MOPSOV",
   originalSourceUrl:officialUrl,
   coveredHistoricalSourceClockControls:configs.size,
   coveredHistoricalSourceClockVersions:versions.length,
   sourceReportedClockValidatedCount:versions.length,
   historicallyFirstObservedBeforeDisclosureCount:0,
   historicalExactFirstKnownAtProvenCount:0,
   historicalPITCertifiedCount:0,
   correctionExhaustivenessCertifiedCount:0,
   originalPublicationLatencyCertified:false,
   sourceReportedClockMeansPubliclyAvailableAt:false,
   retrospectiveCaptureCannotBackdateHistoricalKnowledge:true,
   useSourceClockAsHistoricalAvailableAtAuthorized:false,
   decisionAtBeforeRetrospectiveCapturePermitted:false,
   snapshotsOverwritePriorVersions:false,
   queryWholeMarketCoverageCertified:false,
   noEventInUnobservedWindowProven:false,
   sourceReadOnlyRequests:captureCount(captures),
   cloudflareD1Queries:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
   system1FormalTouched:false,system2ShadowAuthorized:false,productionActivated:false,
   controls:summary,versions
 };
 return Object.freeze({...body,ledgerSha256:sha(JSON.stringify(body))});
}
function captureCount(captures){return captures.length}
