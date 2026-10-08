import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(p)=>JSON.parse(readFileSync(new URL(p,import.meta.url),"utf8"));
const original=read("../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json");
const source=read("../evidence/S2_RECENT60_JULY_2026_ALL96_OFFICIAL_SOURCE_POSTFACTO_20261009_V0_1.json");
const quota=read("../evidence/S2_RECENT60_JULY_20261009_D1_ROW_READ_QUOTA_BLOCKED_V0_1.json");

const dates=original.sample.dateSample;
const symbols={TWSE:original.sample.twseSymbols,TPEX:original.sample.tpexSymbols};
const expected=[...Object.entries(symbols).flatMap(([market,ss])=>dates.map(date=>({
  market,date,symbolCount:ss.length
})))];
const key=(x)=>x.market+"|"+(x.date??x.marketDate);
const actual=new Map();
assert.equal(source.originalGap.marketDate,original.time.marketDate);
assert.equal(source.originalGap.workflowRunId,original.source.workflowRunId);
assert.equal(source.originalGap.artifactId,original.source.artifactId);
assert.equal(source.originalGap.frozenSampleGitBlobSha,
  "5346c9cf908b5ed66266460dc342fce803c2369c");
assert.equal(source.originalGap.physicalHotD1RowsAbsent,original.sample.requestedDateIdentities);
for(const row of source.observations){
  assert.ok(!actual.has(key(row)),"Duplicate official market/date observation: "+key(row));
  assert.equal(row.sourceDateIdentityVerified,true);
  assert.equal(row.sourceDateMismatches,0);
  assert.equal(row.sourcePublicationClockAtHistoricalDecision,"UNKNOWN");
  actual.set(key(row),row);
}
assert.equal(actual.size,expected.length);
for(const row of expected){
  const observed=actual.get(key(row));
  assert.ok(observed,"Original missing date not covered: "+key(row));
  assert.equal(observed.originalFrozenSampleSymbolsFound,row.symbolCount);
  assert.equal(observed.originalFrozenSampleSymbolsTotal,row.symbolCount);
}
const officialCount=[...actual.values()].reduce((sum,row)=>sum+row.originalFrozenSampleSymbolsFound,0);
assert.equal(officialCount,original.sample.requestedDateIdentities);
assert.equal(source.aggregate.originalSampledIdentitiesNowVisibleInCanonicalOfficialSource,officialCount);
assert.equal(source.aggregate.originalSampledSymbolDateIdentities,officialCount);
assert.equal(source.aggregate.originalSampledIdentitiesMissingDespiteReadyOfficialDate,0);
assert.equal(source.aggregate.marketDateChecks,expected.length);
assert.equal(source.aggregate.marketDateReady,expected.length);
assert.equal(source.aggregate.sourceDateMismatchCount,0);

assert.equal(original.sample.allDateObservations,"HOT_D1_ROW_ABSENT");
assert.equal(original.metering.d1RowsWritten,0);
assert.equal(source.execution.d1RowsWritten,0);
assert.equal(source.execution.d1RowsRead,0);
assert.equal(source.execution.r2ObjectReads,0);
assert.equal(source.execution.r2ObjectWrites,0);
assert.equal(source.officialProofRun.artifact.id,11585263592);
assert.equal(source.officialProofRun.artifact.digest,
  "sha256:6e18d1cd6209ccdea06721ba81d1c27fe3830e37ff375aaa0713b625bb66f030");
assert.equal(source.officialProofRun.id,37859630615);
assert.equal(source.officialProofRun.conclusion,"success");

// A post-facto official-source proof is not a backdated July PIT proof,
// nor hot D1/cold R2 storage coverage. The blocked physical R2 query is not a negative readback.
assert.ok(source.confidenceBoundaries.notConfirmed.some(x=>x.includes("Cold R2")));
assert.ok(source.confidenceBoundaries.notConfirmed.some(x=>x.includes("Hot D1")));
assert.ok(source.confidenceBoundaries.notConfirmed.some(x=>x.includes("firstKnownAt")));
assert.equal(source.confidenceBoundaries.sampleBias.includes("NOT_RANDOM"),true);
assert.equal(quota.run.id,source.confidenceBoundaries.d1ReadQuotaBlockedRun);
assert.equal(quota.observed.sampledIdentitiesProcessed,0);
assert.equal(quota.observed.dbResult,"UNVERIFIED_QUOTA_STOP");
assert.equal(quota.observed.officialSourceProbesExecuted,false);
assert.equal(quota.observed.coldR2PackVerificationsExecuted,false);
assert.equal(quota.observed.d1RowsWritten,0);
assert.equal(quota.run.conclusion,"failure");
assert.equal(source.execution.system1FormalCoreChanges,0);
assert.equal(source.execution.system1RuntimeChanges,0);

console.log("AUDIT JULY96 official-source vs missing-hot and blocked-cold scope PASS");
console.log(JSON.stringify({
 officialPostFactoIdentities:officialCount,
 observedMarketDates:actual.size,
 originalHotD1MissingIdentities:original.sample.requestedDateIdentities,
 d1StorageStillUnverified:true,
 coldR2StorageStillUnverified:true,
 originalPublicationFirstKnownAt:"UNKNOWN",
 noBackdateOfPIT:true,
 cloudflareReadQuotaStoppedPhysicalSample:true,
 selectionPromotion:false
}));
