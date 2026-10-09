// Issue #1026 P05. Prior physical 36-key scout is necessary, never sufficient,
// for any FULL_11843 Census authorization. Source-only manifests are rejected.
// Trusted main evidence and independently inspected Action artifacts are external
// prerequisites; shape-valid fixture examples cannot certify real execution.
import assert from "node:assert/strict";

const dates=new Set(["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"]);
const sha=/^[0-9a-f]{64}$/;
const gitUrl=/^https:\/\/github\.com\/imihan0630-sys\/v7-fugle-worker\/(pull|actions\/runs)\/[1-9][0-9]*$/;

export function verifyIssue1026P05PriorPhysicalScoutV0_1({
 scoutAcceptance,now,
}={}){
 assert.equal(scoutAcceptance?.schemaVersion,
  "S2_OCT08_36_KEY_HOT_D1_PHYSICAL_SCOUT_INDEPENDENT_ACCEPTANCE_V0_1",
  "FULL_CENSUS_PRIOR_SCOUT_INDEPENDENT_EVIDENCE_REQUIRED");
 assert.equal(scoutAcceptance?.issueNumber,1026);
 assert.equal(scoutAcceptance?.directiveId,"S2-CORR-20261007-003");
 assert.equal(scoutAcceptance?.physicalScope,"OCT08_HOT_D1_36_SOURCE_MATCHED_SAMPLES");
 assert.equal(scoutAcceptance?.sourceOnly,false,
  "P05_SOURCE_MANIFEST_IS_NOT_PHYSICAL_D1_SCOUT");
 assert.equal(scoutAcceptance?.approval?.lane,"AUDIT_LANE");
 assert.equal(scoutAcceptance?.approval?.independentArtifactReviewed,true,
  "FULL_CENSUS_SCOUT_AUDIT_ARTIFACT_REVIEW_MISSING");
 assert.equal(scoutAcceptance?.approval?.decision,"ACCEPTED_36_OF_36_PHYSICAL_SOURCE_MATCHED_ONLY");
 assert.match(scoutAcceptance?.approval?.reviewEvidenceUrl||"",gitUrl);
 const run=scoutAcceptance?.physicalRun;
 assert.ok(Number.isSafeInteger(run?.id)&&run.id>0);
 assert.ok(Number.isSafeInteger(run?.jobId)&&run.jobId>0);
 assert.equal(run?.event,"workflow_dispatch",
  "P05_SCOUT_MUST_BE_EXPLICIT_MANUAL_AND_BUDGETED");
 assert.equal(run?.workflow,".github/workflows/system2-oct08-hot-d1-source-matched-manual-readonly.yml");
 assert.equal(run?.conclusion,"success");
 assert.match(run?.headSha||"",/^[0-9a-f]{40}$/);
 assert.equal(run?.runUrl,
  "https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/"+run.id);
 assert.ok(Number.isSafeInteger(run?.artifactId)&&run.artifactId>0);
 assert.match(run?.artifactSha256||"",sha,
  "FULL_CENSUS_SCOUT_IMMUTABLE_ARTIFACT_DIGEST_REQUIRED");
 const when=new Date(run?.completedAt),nowDate=new Date(now);
 assert.ok(Number.isFinite(when.getTime())&&
  when.getTime()>=Date.parse("2026-10-09T00:00:00Z")&&
  Number.isFinite(nowDate.getTime())&&when.getTime()<=nowDate.getTime(),
  "FULL_CENSUS_SCOUT_PHYSICAL_COMPLETION_TIMESTAMP_NOT_PROVEN");
 const scout=scoutAcceptance?.scoutResult;
 assert.equal(scout?.schemaVersion,"S2_OCT08_HOT_D1_SOURCE_MATCHED_SAMPLE_READONLY_V0_1");
 assert.equal(scout?.result,"PASS_36_OF_36_SAMPLED_HOT_D1_BARS_SOURCE_MATCHED_ONLY");
 assert.equal(scout?.latestMarketDate,"2026-10-08");
 assert.equal(scout?.sourceReceiptCount,12);
 assert.equal(scout?.sampleCount,36);
 assert.equal(scout?.matchedSamples,36);
 assert.ok(Array.isArray(scout?.samples)&&scout.samples.length===36);
 assert.equal(scout?.observedD1Metrics?.rowsWritten,0);
 assert.ok(Number.isSafeInteger(scout?.observedD1Metrics?.rowsRead)
  &&scout.observedD1Metrics.rowsRead>0
  &&scout.observedD1Metrics.rowsRead<=35000,
  "FULL_CENSUS_PRIOR_SCOUT_ROWS_READ_PHYSICAL_COST_UNKNOWN");
 assert.ok(Number.isSafeInteger(scout?.observedD1Metrics?.requestCount)
  &&scout.observedD1Metrics.requestCount>=36,
  "FULL_CENSUS_PRIOR_SCOUT_QUERIES_UNPROVEN");
 assert.equal(scout?.d1RowsWritten,0);
 assert.equal(scout?.r2ObjectsWritten,0);
 assert.equal(scout?.system1RuntimeUsed,false);
 assert.equal(scout?.fullMarketD1CoverageCertified,false);
 assert.equal(scout?.historicalPITFirstKnownAtCertified,false);
 const counts=new Map(),uniq=new Set();
 for(const x of scout.samples){
  assert.ok(["TWSE","TPEX"].includes(x?.market)&&dates.has(x?.marketDate));
  assert.match(x?.symbol||"",/^[1-9][0-9]{3}$/);
  assert.equal(x?.state,"HOT_D1_RAW_BAR_MATCHED_AT_CURRENT_OBSERVATION",
   "FULL_CENSUS_PRIOR_SCOUT_HAS_PHYSICAL_GAPS");
  assert.equal(x?.matchingRawCount,1);
  assert.equal(x?.historicalFirstKnownAtCertified,false);
  const key=[x.market,x.marketDate,x.symbol].join("|");
  assert.ok(!uniq.has(key),"FULL_CENSUS_PRIOR_SCOUT_DUPLICATE_KEY");
  uniq.add(key);
  const dateKey=x.market+"|"+x.marketDate;
  counts.set(dateKey,(counts.get(dateKey)||0)+1);
 }
 assert.equal(counts.size,12);
 for(const count of counts.values())
  assert.equal(count,3,"FULL_CENSUS_PRIOR_SCOUT_NOT_THREE_PER_MARKET_DATE");
 assert.equal(uniq.size,36);
 // A successful source-only job, a synthetic fixture or a manual checkbox can
 // never by itself stand in for the independent, main-tracked acceptance.
 return Object.freeze({
  state:"PRIOR_36_KEY_SCOUT_EVIDENCE_SHAPE_VALIDATED_NOT_NEW_D1_AUTHORITY",
  sourceRunId:run.id,sourceJobId:run.jobId,sourceArtifactId:run.artifactId,
  rowsReadObserved:scout.observedD1Metrics.rowsRead,
  sampleKeys:36,
  physicalD1SqlQueriesPerformedByValidator:0,
  physicalD1MutationAuthorized:false,
  censusD1ReadAuthorized:false,
 });
}
