import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const p="system2/migration/evidence/S2_DATA_ISSUE1068_NATIVE_122_A1_PERBAR_PIT_PHYSICAL_20261016_V0_1.json";
const native=JSON.parse(readFileSync(p,"utf8"));
function verify(d){
 assert.equal(d.schemaVersion,"S2_DATA_ISSUE1068_REAL_NATIVE_A1_122_PERBAR_PIT_PHYSICAL_20261016_V0_1");
 assert.equal(d.implementation.mergedPr,1374);
 assert.equal(d.implementation.mergedMain,"40c20f19d57f0d3b8af907ecb1a3fd7f0e25eecc");
 assert.equal(d.implementation.preMergeFourOfFourGreen,true);
 assert.equal(d.originalActualMainProvider.physicalRunId,38826851466);
 assert.equal(d.originalActualMainProvider.jobId,116736199554);
 assert.equal(d.originalActualMainProvider.jobConclusion,"success");
 assert.equal(d.originalActualMainProvider.originalGitHubArtifactId,12015950224);
 assert.equal(d.originalActualMainProvider.originalNativeZipBytes,8154);
 assert.equal(d.originalActualMainProvider.githubNativeZipDigestSha256,"3f50f2e2c6bbf9ebb6287e8f41e9f085cb905379a7848cd1a2cd2b808882bb68");
 assert.equal(d.originalActualMainProvider.independentlyDownloadedNativeZipDigestSha256,d.originalActualMainProvider.githubNativeZipDigestSha256);
 assert.equal(d.originalActualMainProvider.originalInnerJsonBytes,75139);
 assert.equal(d.originalActualMainProvider.independentlyRecomputedInnerJsonSha256,"b53b2c756791ab8bb5a0f6eddb2d84241b9fb56ca80697b57c37be532ace708f");
 assert.equal(d.originalActualMainProvider.originalInnerJsonIndependentlyParsed,true);
 assert.equal(d.actualPhysicalSource.allOriginalSourceMarketDatePairsIndependentlyByteRehashed,122);
 assert.equal(d.actualPhysicalSource.allOriginalNativeProviderFilesDecompressedAndReparsed,122);
 assert.equal(d.actualPhysicalSource.originalSixtyOneSessions,61);
 assert.equal(d.actualPhysicalSource.allCompleteSymbolWindowsReconciled,1935);
 assert.equal(d.actualPhysicalSource.allIndividualOriginalBarOpenHighLowCloseVolumeValueTransactionAndRowFieldSHAReconciled,118035);
 assert.equal(1935*61,118035);
 assert.equal(d.actualPhysicalSource.all122PairOriginalBodySHA256Verified,true);
 assert.equal(d.actualPhysicalSource.allBarOriginalSourceRowHashVerified,true);
 assert.equal(d.twoClockCutVerdicts.length,2);
 const [oldCut,newCut]=d.twoClockCutVerdicts;
 assert.equal(oldCut.cutUtc,"2026-10-15T15:45:00.000Z");
 assert.equal(oldCut.signedProducerClaimedPairCapturedByCut,122);
 assert.equal(oldCut.originalNativeIndependentArchiveWitnessBeforeCutVerified,false);
 assert.equal(oldCut.independentSourceAuditDoneByCut,false);
 assert.equal(oldCut.fullIndependentSourcePITAtThisCut,false);
 assert.equal(oldCut.formalStage1StrategyPit,false);
 assert.equal(newCut.cutUtc,"2026-10-15T21:45:43.188Z");
 assert.equal(newCut.signedProducerClaimedPairCapturedByCut,122);
 assert.equal(newCut.originalNativeIndependentAuditDoneByCut,true);
 assert.equal(newCut.fullIndependentSourceOnlyResearchPITAtThisCut,true);
 assert.equal(newCut.formalStage1StrategyPit,false);
 for(const k of ["originalHistoricalMarketDateFirstKnownAtAndAvailableAtVerified",
   "historicalProviderRevisionsAndDeletionsComplete",
   "historicalOrdinaryShareCFIEffectiveDatesVerifiedFor61Sessions",
   "allSixCorporateActionFamilyRevisionsRetractionsSuspensionsAndNoEventComplete",
   "postSourceFormalStrategyAssessorIndependentAudited",
   "physicalFrozenDecisionWrittenAndReadBack",
   "originalMarketDay2345FormalDecisionMayBeRebuiltFromLaterEvidence",
   "fullBacktestOrProspectiveShadowAuthorized",
   "fullG3G4MigrationAndOwnerReserveCertified"])
   assert.equal(d.unresolvedFormal[k],false,k);
 assert.equal(d.unresolvedFormal.strictHistoricalMopsNineVersionsFirstKnownAtCertified,0);
 assert.equal(d.oldAccountHistoryLastConfirmed.unmigratedA1Bars,37268);
 assert.equal(d.oldAccountHistoryLastConfirmed.sourceOldA1PerMarketDatePITCertified,false);
 for(const k of ["newProviderHttpGet","newCloudflareD1Read","newCloudflareD1Writes","newCloudflareR2Calls"])
   assert.equal(d.safety[k],0);
 assert.equal(d.safety.system1V8FormalCoreModified,false);
 assert.equal(d.safety.system1RuntimeOrCronModified,false);
 assert.equal(d.safety.tradeSignalsActivated,false);
 return true;
}
assert.equal(verify(native),true);
for(const [name,change] of [
 ["fabricated original ZIP",d=>{d.originalActualMainProvider.independentlyDownloadedNativeZipDigestSha256="f".repeat(64)}],
 ["forged original JSON",d=>{d.originalActualMainProvider.independentlyRecomputedInnerJsonSha256="f".repeat(64)}],
 ["missing original provider file",d=>{d.actualPhysicalSource.allOriginalSourceMarketDatePairsIndependentlyByteRehashed=121}],
 ["one OHLCV price row tampered",d=>{d.actualPhysicalSource.allIndividualOriginalBarOpenHighLowCloseVolumeValueTransactionAndRowFieldSHAReconciled=118034}],
 ["unqualified original market-day cutoff",d=>{d.twoClockCutVerdicts[0].fullIndependentSourcePITAtThisCut=true}],
 ["fabricated early independent audit",d=>{d.twoClockCutVerdicts[0].independentSourceAuditDoneByCut=true}],
 ["misused source self-clock as archive proof",d=>{d.twoClockCutVerdicts[0].originalNativeIndependentArchiveWitnessBeforeCutVerified=true}],
 ["fabricated formal strategy",d=>{d.twoClockCutVerdicts[1].formalStage1StrategyPit=true}],
 ["fabricated CA coverage",d=>{d.unresolvedFormal.allSixCorporateActionFamilyRevisionsRetractionsSuspensionsAndNoEventComplete=true}],
 ["fabricated 61-day CFI type",d=>{d.unresolvedFormal.historicalOrdinaryShareCFIEffectiveDatesVerifiedFor61Sessions=true}],
 ["fabricated Frozen",d=>{d.unresolvedFormal.physicalFrozenDecisionWrittenAndReadBack=true}],
 ["retroactively forged decision",d=>{d.unresolvedFormal.originalMarketDay2345FormalDecisionMayBeRebuiltFromLaterEvidence=true}],
 ["false live permission",d=>{d.safety.tradeSignalsActivated=true}],
 ["fake extra Cloudflare write",d=>{d.safety.newCloudflareD1Writes=1}]
]){
 const data=structuredClone(native);change(data);assert.throws(()=>verify(data),name);
}
console.log("A1 true original physical PIT SHA ledger: 1 positive + 14 fake-PIT/fake-contents adversarial cases PASS");
