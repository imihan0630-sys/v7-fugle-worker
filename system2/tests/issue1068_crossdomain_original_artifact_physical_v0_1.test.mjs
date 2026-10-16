import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const file="system2/migration/evidence/S2_DATA_ISSUE1068_CROSSDOMAIN_PIT_REAL_ORIGINAL_ARTIFACT_20261016_V0_1.json";
const e=JSON.parse(readFileSync(file,"utf8"));
function check(x){
 assert.equal(x.schemaVersion,"S2_DATA_ISSUE1068_CROSSDOMAIN_PIT_REAL_ORIGINAL_ARTIFACT_20261016_V0_1");
 assert.equal(x.mergedImplementation.mergedPR,1376);
 assert.equal(x.mergedImplementation.mergedMain,"db6dec218db126fd3eae22853b19c92db91d8f59");
 assert.equal(x.mergedImplementation.finalHeadAllFourSuccess,true);
 assert.equal(x.mergedImplementation.testsPassed,20);
 assert.equal(x.mergedImplementation.testsFailed,0);
 assert.equal(x.mergedImplementation.scheduleAutomationAdded,false);
 assert.equal(x.originalMergedMainPhysicalRun.runId,38834381884);
 assert.equal(x.originalMergedMainPhysicalRun.jobId,116760088422);
 assert.equal(x.originalMergedMainPhysicalRun.conclusion,"success");
 assert.equal(x.originalMergedMainPhysicalRun.originalRealA1Bars,118035);
 assert.equal(x.originalMergedMainPhysicalRun.originallyReadbackProviderPairs,122);
 assert.equal(x.originalMergedMainPhysicalRun.originalPriorPreviewNativeCFI,30);
 assert.equal(x.originalMergedMainPhysicalRun.originalKnownCAEventRows,641);
 assert.equal(x.originalMergedMainPhysicalRun.formalPITCertified,false);
 assert.equal(x.originalGitHubArtifact.id,12017773951);
 assert.equal(x.originalGitHubArtifact.originalNativeZipBytes,1376);
 assert.equal(x.originalGitHubArtifact.originalProviderZipSha256,"9011ca1e847d8e640b0c13aa9304875023986310dc1500e25ddc2c48ff446024");
 assert.equal(x.originalGitHubArtifact.independentlyDownloadedOriginalZipSha256,x.originalGitHubArtifact.originalProviderZipSha256);
 assert.equal(x.originalGitHubArtifact.originalContainedBytes,4083);
 assert.equal(x.originalGitHubArtifact.independentlyRecomputedOriginalJsonSha256,"4b2aaf2ce9cbda8ffac1ca1acd6a88e6c2e0e905d77c273bb53af3af13f9214d");
 assert.equal(x.originalGitHubArtifact.originalZipBytesIndependentlyReadAndInnerJsonParsed,true);
 assert.equal(x.sourceCrossClockScope.currentA1MarketDate,"2026-10-15");
 assert.equal(x.sourceCrossClockScope.priorPreviewCFIAndCAMarketDate,"2026-10-14");
 assert.equal(x.sourceCrossClockScope.priorPreviewKnownActionCount,11);
 assert.equal(x.sourceCrossClockScope.priorPreviewNotProvenNoActionCount,19);
 assert.equal(x.sourceCrossClockScope.independentCFIOriginalHistoricalEffectiveDatesFor61Dates,false);
 assert.equal(x.sourceCrossClockScope.independentHistoricalCARevisionRetractSuspensionAndNegativeWitness,false);
 assert.equal(x.sourceCrossClockScope.strictHistoryMOPS9OriginalPublicAvailabilityFirstKnownCertified,0);
 assert.equal(x.sourceCrossClockScope.selectedCount,null);
 assert.equal(x.sourceCrossClockScope.zeroPickDay,null);
 assert.equal(x.sourceCrossClockScope.frozenD1Written,false);
 assert.equal(x.sourceCrossClockScope.independentAuditLaneFormalPITSignoff,false);
 assert.equal(x.oldAccountMigrationUnchangedLastAuthenticated.remainingLegacyA1Bars,37268);
 assert.equal(x.safety.system1V8FormalCoreModified,false);
 assert.equal(x.safety.cloudflareD1R2Writes,0);
 assert.equal(x.safety.tradingSignalsEnabled,false);
 return true;
}
test("physical main provider artifact digest, cross-domain scope and failclosed no PIT admission",()=>assert.equal(check(e),true));
const bad=[
 ["false PIT",x=>x.originalMergedMainPhysicalRun.formalPITCertified=true],
 ["wrong original provider artifact digest",x=>x.originalGitHubArtifact.originalProviderZipSha256="f".repeat(64)],
 ["fake SHA rehash",x=>x.originalGitHubArtifact.independentlyDownloadedOriginalZipSha256="f".repeat(64)],
 ["fake inner source JSON",x=>x.originalGitHubArtifact.independentlyRecomputedOriginalJsonSha256="f".repeat(64)],
 ["fabricated CI pass",x=>x.mergedImplementation.testsPassed=21],
 ["fake 118036 original bars",x=>x.originalMergedMainPhysicalRun.originalRealA1Bars=118036],
 ["fake same-market-date CFI",x=>x.sourceCrossClockScope.priorPreviewCFIAndCAMarketDate="2026-10-15"],
 ["fake 19 NO_EVENT",x=>x.sourceCrossClockScope.priorPreviewNotProvenNoActionCount=0],
 ["historical effective period false-PASS",x=>x.sourceCrossClockScope.independentCFIOriginalHistoricalEffectiveDatesFor61Dates=true],
 ["CA revision no-event false-PASS",x=>x.sourceCrossClockScope.independentHistoricalCARevisionRetractSuspensionAndNegativeWitness=true],
 ["faked selectedCount",x=>x.sourceCrossClockScope.selectedCount=5],
 ["faked 0 picks",x=>x.sourceCrossClockScope.zeroPickDay=true],
 ["faked Frozen",x=>x.sourceCrossClockScope.frozenD1Written=true],
 ["faked audit acceptance",x=>x.sourceCrossClockScope.independentAuditLaneFormalPITSignoff=true],
 ["unauthorized D1 write",x=>x.safety.cloudflareD1R2Writes=1],
 ["fake historical MOPS firstKnown",x=>x.sourceCrossClockScope.strictHistoryMOPS9OriginalPublicAvailabilityFirstKnownCertified=9],
 ["fabricated schedule",x=>x.mergedImplementation.scheduleAutomationAdded=true]
];
for(const [name,mut] of bad)test("physical PIT evidence must failclosed: "+name,()=>{
 const p=structuredClone(e);mut(p);assert.throws(()=>check(p));
});
