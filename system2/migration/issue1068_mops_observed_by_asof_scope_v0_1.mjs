// #1068 DATA_LANE: strict prospective "observed by decision cut" admission.
// The original MOPS source-reported clock is NEVER treated as first public availability.
// This gate answers one limited question: was this EXACT source version actually
// observed by this system before the claimed later research decision time?
// Not historical March-July PIT, not event content/causality, not strategy admission.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
const digest=b=>createHash("sha256").update(b).digest("hex");
const SHA=/^[0-9a-f]{64}$/;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const utc=s=>typeof s==="string"&&ISO.test(s)&&Number.isFinite(Date.parse(s))&&
  new Date(s).toISOString()===new Date(Date.parse(s)).toISOString();
const deny=s=>{throw Error("S2_ISSUE1068_MOPS_ASOF_"+s)};
export const ORIGINAL=Object.freeze({
  provider:"TWSE_OFFICIAL_MOPSOV",
  sourceUrl:"https://mopsov.twse.com.tw/mops/web/ajax_t05st01",
  runId:38735146839,jobId:116422438931,artifactId:11972825813,
  originalZipSha256:"42550f6b423d19bf09bddbbff7abe587544d762c1ed7276953b04eb6f494a716",
  originalInnerJsonSha256:"9f766158637a3e61e5a8a9399546fe533f24b033079561bf495a03daebea57a9",
  originalLedgerSha256:"776baeb5f5b151baeb08503db3caeac3151bd6e1ba9b2ce5485b0540ba998064",
  originalHistoricalPITAcceptedCount:0,
  originalControls:5,originalVersions:9
});
export const EXISTING_OBSERVATION_ASOF="2026-10-15T15:00:00.000Z";
// This is 23:00 Asia/Taipei on Oct 15, AFTER the actual archived 20:30 observations.
// Do not use a hypothetical future decision cutoff or any May/July decision timestamp.
export function admitOriginalMopsSourceObservationByCutV0_1({
  innerBytes,decisionCutAtUtc=EXISTING_OBSERVATION_ASOF,actualEvaluationAtUtc,
}={}){
  if(!Buffer.isBuffer(innerBytes)||innerBytes.length!==13576||
     digest(innerBytes)!==ORIGINAL.originalInnerJsonSha256)deny("NATIVE_ORIGINAL_INNER_SHA");
  if(!utc(decisionCutAtUtc)||!utc(actualEvaluationAtUtc)||
     Date.parse(decisionCutAtUtc)>Date.parse(actualEvaluationAtUtc))deny("FUTURE_OR_INVALID_DECISION_CUT");
  let ledger;try{ledger=JSON.parse(innerBytes.toString("utf8"))}catch{deny("NATIVE_JSON_INVALID")}
  if(ledger?.schemaVersion!=="S2_DATA_HISTORICAL_MOPS_SOURCE_CLOCK_LEDGER_V0_1"||
     ledger.provider!==ORIGINAL.provider||ledger.originalSourceUrl!==ORIGINAL.sourceUrl||
     ledger.coveredHistoricalSourceClockControls!==ORIGINAL.originalControls||
     ledger.coveredHistoricalSourceClockVersions!==ORIGINAL.originalVersions||
     ledger.historicalPITCertifiedCount!==0||
     ledger.historicalExactFirstKnownAtProvenCount!==0||
     ledger.sourceReportedClockMeansPubliclyAvailableAt!==false||
     ledger.retrospectiveCaptureCannotBackdateHistoricalKnowledge!==true||
     ledger.useSourceClockAsHistoricalAvailableAtAuthorized!==false||
     ledger.decisionAtBeforeRetrospectiveCapturePermitted!==false||
     !Array.isArray(ledger.versions)||ledger.versions.length!==9||
     !Array.isArray(ledger.controls)||ledger.controls.length!==5||
     ledger.ledgerSha256!==ORIGINAL.originalLedgerSha256)
    deny("LEDGER_SCOPE_OR_PIT_PROMOTION");
  const {ledgerSha256,...unsigned}=ledger;
  if(digest(Buffer.from(JSON.stringify(unsigned),"utf8"))!==ORIGINAL.originalLedgerSha256)
    deny("LEDGER_CANONICAL_SHA_MISMATCH");
  let observed=0,cutoffBlocked=0;
  const attestations=[],seen=new Set();
  for(const row of ledger.versions){
    if(!/^[1-9]\d{3}$/.test(row?.stockCode||"")||
       typeof row?.versionKey!=="string"||!row.versionKey||
       !SHA.test(row?.sourceRowEvidenceSha256||"")||
       !SHA.test(row?.originalResponseSha256||"")||
       row.sourceUrl!==ORIGINAL.sourceUrl||
       row.sourceReportedClockQuality!=="MOPS_VISIBLE_HIDDEN_CLOCK_MATCH"||
       row.firstKnownAt!==null||row.availableAt!==null||
       row.historicalDecisionPITAdmissible!==false||
       row.asOfBeforeCaptureEligible!==false||
       row.originalPublicationLatencyCertified!==false||
       !utc(row.retrospectiveCapturedAtUtc)||
       row.firstObservedAtConservativeUpperBoundUtc!==row.retrospectiveCapturedAtUtc||
       !Number.isFinite(Date.parse(row.sourceReportedAt))||
       Date.parse(row.sourceReportedAt)>Date.parse(row.retrospectiveCapturedAtUtc))
      deny("VERSION_CLOCK_OR_SOURCE_PROVENANCE_INVALID");
    const identity=row.controlId+"|"+row.stockCode+"|"+row.versionKey;
    if(seen.has(identity))deny("DUPLICATE_SOURCE_VERSION");
    seen.add(identity);
    const eligible=Date.parse(row.retrospectiveCapturedAtUtc)<=Date.parse(decisionCutAtUtc);
    if(eligible)observed++;else cutoffBlocked++;
    attestations.push({
      controlId:row.controlId,stockCode:row.stockCode,versionKey:row.versionKey,
      sourceRowEvidenceSha256:row.sourceRowEvidenceSha256,
      actualFirstObservedAtUtc:row.retrospectiveCapturedAtUtc,
      observedByDecisionCut:eligible,
      basis:"ORIGINAL_PROTECTED_GITHUB_ACTIONS_RETROSPECTIVE_MOPS_SOURCE_CAPTURE",
      originalHistoricalFirstKnownAt:null,originalHistoricalAvailableAt:null,
      historicPITCertified:false,
      strategyOrTradingEligible:false
    });
  }
  return Object.freeze({
    schemaVersion:"S2_ISSUE1068_MOPS_OBSERVED_BY_ASOF_SCOPE_V0_1",
    status:observed===9?
      "SOURCE_OBSERVATION_BY_REAL_PAST_CUTOFF_9_OF_9_PASS__HISTORICAL_PIT_ZERO":
      "SOURCE_OBSERVATION_PARTIAL_OR_BLOCKED__HISTORICAL_PIT_ZERO",
    decisionCutAtUtc,actualEvaluationAtUtc,
    sourceRunId:ORIGINAL.runId,sourceJobId:ORIGINAL.jobId,
    sourceArtifactId:ORIGINAL.artifactId,
    originalNativeInnerSha256:ORIGINAL.originalInnerJsonSha256,
    originalSourceLedgerSha256:ORIGINAL.originalLedgerSha256,
    sourceVersionsValidated:9,sourceVersionObservedByDecisionCut:observed,
    sourceVersionNotYetObservedAtCut:cutoffBlocked,
    historicalFirstKnownAtOrAvailableAtCertifiedCount:0,
    historicalMayJuly2026DecisionPITAccepted:false,
    firstKnownAtForHistoricalDates:null,availableAtForHistoricalDates:null,
    observationAsOfLaterResearchEvidenceOnly:true,
    rawFullArticlePayloadIndependentlyAvailable:false,
    officialFirstPublicationSecondIndependentlyVerified:false,
    sourceWholeMarketAndRevisionExhaustivenessVerified:false,
    auditedStrategyPIT:false,finalSelectionAuthorized:false,
    historicalBacktestAuthorized:false,durableFrozenAllowed:false,
    independentAuditLaneSignoff:false,
    cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
    system1FormalCoreTouched:false,versionAttestations:attestations
  });
}
async function cli(){
  const file=process.argv[2];if(!file)deny("INPUT_REQUIRED");
  const bytes=await readFile(file);
  const result=admitOriginalMopsSourceObservationByCutV0_1({
    innerBytes:bytes,actualEvaluationAtUtc:new Date().toISOString()
  });
  if(result.sourceVersionObservedByDecisionCut!==9)deny("ORIGINAL_ASOF_SCOPE_INCOMPLETE");
  await mkdir("/tmp/s2-issue1068-mops-observation-asof",{recursive:true,mode:0o700});
  await writeFile("/tmp/s2-issue1068-mops-observation-asof/sanitized-asof-receipt.json",
    JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,originalSourceVersions:9,
    observedByRealPastCut:result.sourceVersionObservedByDecisionCut,
    historicMayJulyPIT:0,finalSelectionAuthorized:false,d1Writes:0}));
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
  try{await cli()}catch(e){
    console.error(/^S2_ISSUE1068_MOPS_ASOF_[A-Z_]+$/.test(String(e.message))?
      e.message:"S2_ISSUE1068_MOPS_ASOF_FAIL_CLOSED");
    process.exitCode=2;
  }
}
