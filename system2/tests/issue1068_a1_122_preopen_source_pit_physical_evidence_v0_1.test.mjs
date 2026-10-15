import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const p="system2/migration/evidence/S2_DATA_ISSUE1068_ORIGINAL_A1_122_PREOPEN_SOURCE_PIT_PHYSICAL_20261016_V0_1.json";
const original=JSON.parse(readFileSync(p,"utf8"));
function verify(o){
 assert.equal(o.schemaVersion,"S2_DATA_ISSUE1068_20261016_122_A1_SOURCE_OBSERVATION_PIT_PHYSICAL_V0_1");
 assert.equal(o.marketDate,"2026-10-15");
 assert.equal(o.verifiedAsOfUtc,"2026-10-15T21:45:43.188Z");
 assert.equal(o.earliestRequiredReceiptFullyObservedUtc,"2026-10-15T19:54:35.094Z");
 assert.ok(Date.parse(o.verifiedAsOfUtc)>Date.parse(o.earliestRequiredReceiptFullyObservedUtc));
 assert.equal(o.originalSourceOnlyEvidence.sourceCollectorRunId,38797319008);
 assert.equal(o.originalSourceOnlyEvidence.sourceMarketDatePairs,122);
 assert.equal(o.originalSourceOnlyEvidence.originalTradingSessions,61);
 assert.equal(o.originalSourceOnlyEvidence.independentSourcePairsVerified,122);
 assert.equal(o.originalSourceOnlyEvidence.independentOriginalPayloadByteRehashAndParsing,122);
 assert.equal(o.originalSourceOnlyEvidence.independentSourceReadbackRunId,38797548446);
 assert.equal(o.originalSourceOnlyEvidence.independentAuditHash,"cebec987e32f863e42f9d95ffb881979164ed63be6716dc1e40bf2f8cf3f5808");
 assert.equal(o.originalSourceOnlyEvidence.sourceReceiptSha256,"ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9");
 assert.equal(o.originalPrivateArchive.contentAddressedRawMarketDayGzipFileCount,122);
 assert.equal(o.originalPrivateArchive.totalArchivedManifestAndAttributionPaths,125);
 assert.equal(o.originalPrivateArchive.providerLevelPermanentImmutability,false);
 assert.equal(o.originalIndependentPITBlocker.PITAssessorQualified,false);
 assert.equal(o.originalIndependentPITBlocker.frozen,false);
 assert.equal(o.originalIndependentPITBlocker.selectedCount,null);
 assert.equal(o.originalIndependentPITBlocker.auditHash,undefined);
 assert.equal(o.actualNewPhysicalRun.mergedImplementationPr,1371);
 assert.equal(o.actualNewPhysicalRun.realGithubRunId,38812282676);
 assert.equal(o.actualNewPhysicalRun.conclusion,"success");
 assert.equal(o.actualNewPhysicalRun.artifactId,12008787731);
 assert.equal(o.actualNewPhysicalRun.originalProviderZipBytes,1220);
 assert.equal(o.actualNewPhysicalRun.githubOriginalProviderZipSha256,"e80d6c64943588ac7719bfcd97d02bffbaf525eb7e488502b80728b5dce9b562");
 assert.equal(o.actualNewPhysicalRun.independentlyDownloadedZipSha256,o.actualNewPhysicalRun.githubOriginalProviderZipSha256);
 assert.equal(o.actualNewPhysicalRun.originalInnerBytes,2005);
 assert.equal(o.actualNewPhysicalRun.independentlyRecomputedInnerSha256,"98a3bb665217b578cba012a813e316c42560897c3358a38ccdcdf646c961431b");
 assert.equal(o.actualNewPhysicalRun.originalProducerReceiptSha256,"11e78444554a72523a4a0f9d832ccc0bf9d09cf9525b14b25749784e762b0a20");
 assert.equal(o.actualNewPhysicalRun.sourceObservationPitForThisResearchCut,true);
 assert.equal(o.actualNewPhysicalRun.originalMarketDay2345DecisionCutPassed,false);
 assert.equal(o.actualNewPhysicalRun.formalStrategyPitCertified,false);
 assert.equal(o.actualNewPhysicalRun.frozenDecisionCaptured,false);
 assert.equal(o.actualNewPhysicalRun.selectedCount,null);
 assert.equal(o.actualNewPhysicalRun.cloudflareD1Queries,0);
 assert.equal(o.actualNewPhysicalRun.cloudflareD1Writes,0);
 assert.equal(o.currentIndependentM09Counterevidence.historicalNoEventCertified,false);
 assert.equal(o.currentIndependentM09Counterevidence.historicalCommonStockCFIPitCertified,false);
 assert.equal(o.currentIndependentM09Counterevidence.originalSourceObservationWasTooLateFor20261015T2345FormalFreeze,true);
 for(const k of [
  "pastMarketDateOriginalFirstKnownAtAndAvailableAtVerified",
  "historicalOHLCVRevisionsAndCorporateActionsVersionExhaustive",
  "historicalOrdinaryStockSecurityClassPositiveEvidenceFullWindow",
  "allSixCorporateActionFamiliesAndRetractionsPlusNoEventExhaustive",
  "frozenDecisionsPhysicallyWrittenAndReadBack",
  "officialStrategyStage1SelectionAuthorized",
  "historicalShadowPerformanceAndLiveTradingAuthorized",
  "fullCrossAccountG3G4Accepted"
 ]) assert.equal(o.nonPromotableGates[k],false,k);
 assert.equal(o.safety.cloudflareSourceD1Reads,0);
 assert.equal(o.safety.cloudflareDestD1Reads,0);
 assert.equal(o.safety.cloudflareD1Writes,0);
 assert.equal(o.safety.system1V8FormalOrCronModified,false);
 return true;
}
test("real 2026-10-16 actual physical 122 A1 source-only preopen observation PIT is intact, no trading authority",()=>assert.ok(verify(original)));
for(const [n,change] of [
 ["fabricated historical cutoff",v=>{v.verifiedAsOfUtc="2026-10-15T15:45:00.000Z"}],
 ["fake source 122",v=>{v.originalSourceOnlyEvidence.independentSourcePairsVerified=121}],
 ["fake native provider SHA",v=>{v.actualNewPhysicalRun.independentlyDownloadedZipSha256="f".repeat(64)}],
 ["fake independent source root",v=>{v.originalSourceOnlyEvidence.independentAuditHash="f".repeat(64)}],
 ["fake 3rd party class vintage",v=>{v.currentIndependentM09Counterevidence.historicalCommonStockCFIPitCertified=true}],
 ["fake CA no event",v=>{v.currentIndependentM09Counterevidence.historicalNoEventCertified=true}],
 ["fake strategy PIT",v=>{v.actualNewPhysicalRun.formalStrategyPitCertified=true}],
 ["fake Frozen",v=>{v.nonPromotableGates.frozenDecisionsPhysicallyWrittenAndReadBack=true}],
 ["fake old market 23:45",v=>{v.actualNewPhysicalRun.originalMarketDay2345DecisionCutPassed=true}],
 ["fake Shadow trading",v=>{v.nonPromotableGates.historicalShadowPerformanceAndLiveTradingAuthorized=true}],
 ["fake G3/G4 closure",v=>{v.nonPromotableGates.fullCrossAccountG3G4Accepted=true}],
 ["fake D1 write",v=>{v.safety.cloudflareD1Writes=1}]
]){
 test("failclosed PIT physical source evidence: "+n,()=>{
  const v=structuredClone(original);change(v);assert.throws(()=>verify(v));
 });
}
