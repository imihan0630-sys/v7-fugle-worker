import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {reconcileRealPhysicalPITCrossDomainV0_1}
 from "../migration/issue1068_real_a1_cfi_ca_pit_crossdomain_gate_v0_1.mjs";
const dir="system2/";
const real=Object.freeze({
 a1:JSON.parse(readFileSync(dir+"migration/evidence/S2_DATA_ISSUE1068_NATIVE_122_A1_PERBAR_PIT_PHYSICAL_20261016_V0_1.json","utf8")),
 cfi:JSON.parse(readFileSync(dir+"evidence/S2_M09_REAL_30_NATIVE_CFI_INDEPENDENT_AUDIT_20261015_V0_1.json","utf8")),
 ca:JSON.parse(readFileSync(dir+"evidence/S2_M09_20261014_REAL_SIX_CA_NEGATIVE_EXPOSURE_20261015_V0_1.json","utf8"))
});
test("REAL committed three independent physical evidence lanes join ONLY original source timing, never strategy PIT",()=>{
 const r=reconcileRealPhysicalPITCrossDomainV0_1(real);
 assert.equal(r.state,"SOURCE_ONLY_A1_PIT_PASS__CFI_CA_HISTORICAL_VINTAGE_STRICTLY_BLOCKED");
 assert.equal(r.evaluatedA1MarketDate,"2026-10-15");
 assert.equal(r.priorPreviewMarketDate,"2026-10-14");
 assert.equal(r.independentlyRehashedProviderSourcePairs,122);
 assert.equal(r.independentlyReconciledOHLCVRows,118035);
 assert.equal(r.priorPreviewNativeCFIOriginalsRehashed,30);
 assert.equal(r.priorPreviewSameSourceAndIndependentAudit,true);
 assert.equal(r.priorPreviewNativeCFIIncludesInnovationBoard,1);
 assert.equal(r.caSixOriginalSourceLanesRehashed,6);
 assert.equal(r.caOriginalObservedEventRowsIn61Window,641);
 assert.equal(r.caKnownEventMarketSymbolCount,630);
 assert.equal(r.priorPreviewCAExposedKnownEventCount,11);
 assert.equal(r.priorPreviewCANoKnownEventButUnprovenNoEventCount,19);
 assert.equal(r.priorPreviewKnownEvents.length,11);
 assert.equal(r.sourceOnlyResearchPITVerified,true);
 assert.equal(r.originalMarketDay2345PITAuthorized,false);
 assert.equal(r.nativeCFIValidOnNewA1MarketDateCertified,false);
 assert.equal(r.historical61SessionCFINativeEffectivePeriodsCertified,false);
 assert.equal(r.historical61SessionCARevisionsAndNoEventCertified,false);
 assert.equal(r.fullStrategyPITQualified,false);
 assert.equal(r.formalSelectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenWritten,false);
 assert.equal(r.independentFrozenReadbackVerified,false);
 assert.equal(r.independentAuditLaneFullPITSignedOff,false);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.system1FormalRuntimeTouched,false);
 assert.equal(r.blockers.length,5);
 for(const f of r.priorPreviewKnownEvents)assert.equal(f.evidenceOnly,
  "KNOWN_PREVIOUS_PREVIEW_EVENT__NOT_20261015_STRATEGY_DECISION_PIT");
});
const tamper=[
 ["fictitious full A1 bars",v=>v.a1.actualPhysicalSource.allIndividualOriginalBarOpenHighLowCloseVolumeValueTransactionAndRowFieldSHAReconciled=118036],
 ["fake provider artifact id",v=>v.a1.originalActualMainProvider.originalGitHubArtifactId=123],
 ["fake A1 source native hash",v=>v.a1.originalActualMainProvider.independentlyRecomputedInnerJsonSha256="f".repeat(64)],
 ["promote 23:45 historical market decision",v=>v.a1.twoClockCutVerdicts[0].formalStage1StrategyPit=true],
 ["fake CFI native run",v=>v.cfi.thirtyPreview.sourceReadRunId=123],
 ["fake full current 1935 CFI",v=>v.cfi.thirtyPreview.nativeTypeStocksCFI_ESVUFR=1935],
 ["promote historical common-share CFI",v=>v.cfi.nonPromotion.ordinaryCommonShareAsOf20261014PITCertified=true],
 ["mix different preview source vintage",v=>v.cfi.thirtyPreview.originalA1SourceReceiptHash="f".repeat(64)],
 ["mix different independent CFI preview audit",v=>v.cfi.thirtyPreview.originalA1IndependentAuditHash="f".repeat(64)],
 ["mix different independent CA preview audit",v=>v.ca.originalA1Window.independentAuditSha256="f".repeat(64)],
 ["fictional six CA native responses",v=>v.ca.sixCaNativeOriginals.rawResponseSha256ReadbackMatchedCount=5],
 ["fake six CA actual original SHA",v=>v.ca.sixCaNativeOriginals.lanes[0].originalSha256="f".repeat(64)],
 ["turn 11 known CA into none",v=>v.ca.independentNegativeReplay.preliminaryWithKnownEvent=0],
 ["pretend 19 unproven are event free",v=>v.ca.independentNegativeReplay.otherPreliminaryNotProvenEventFree=0],
 ["duplicate negative preview symbol",v=>v.ca.independentNegativeReplay.flaggedPreview[1].symbol=v.ca.independentNegativeReplay.flaggedPreview[0].symbol],
 ["fake real revision completeness",v=>v.ca.nonPromotion.historicalCaRevisionCancellationAndNoEventCompletenessCertified=true],
 ["fake historical CFI period completeness",v=>v.a1.unresolvedFormal.historicalOrdinaryShareCFIEffectiveDatesVerifiedFor61Sessions=true],
 ["fake real frozen",v=>v.a1.unresolvedFormal.physicalFrozenDecisionWrittenAndReadBack=true],
 ["change actual native source market date to preview",v=>v.a1.sourceScope.originalMarketDate="2026-10-14"]
];
for(const [name,fn] of tamper){
 test("fail-closed historical/cross-day PIT: "+name,()=>{
  const copied=structuredClone(real);fn(copied);
  assert.throws(()=>reconcileRealPhysicalPITCrossDomainV0_1(copied),
   /S2_DATA_CROSS_DOMAIN_PIT_/);
 });
}

/* These are original-byte/clock anti-promotion cases, not synthetic PIT passes.
 * Each starts from the already merged ORIGINAL provider/auditor receipts.
 * A mutated copy must never inherit its predecessor's verified cutoff. */
const physicalWitnessTamper=[
 ["original market cutoff moved earlier",v=>v.a1.twoClockCutVerdicts[0].cutUtc="2026-10-15T10:45:00.000Z"],
 ["research cutoff backdated",v=>v.a1.twoClockCutVerdicts[1].cutUtc="2026-10-15T15:00:00.000Z"],
 ["research cutoff moved forward",v=>v.a1.twoClockCutVerdicts[1].cutUtc="2026-10-16T15:45:43.188Z"],
 ["cutoff labels swapped",v=>v.a1.twoClockCutVerdicts[0].clockName=v.a1.twoClockCutVerdicts[1].clockName],
 ["producer claimed 123 original pairs",v=>v.a1.twoClockCutVerdicts[0].signedProducerClaimedPairCapturedByCut=123],
 ["original pre-cut archive falsely witnessed",v=>v.a1.twoClockCutVerdicts[0].originalNativeIndependentArchiveWitnessBeforeCutVerified=true],
 ["original pre-cut audit falsely completed",v=>v.a1.twoClockCutVerdicts[0].independentSourceAuditDoneByCut=true],
 ["research audit no longer done by cutoff",v=>v.a1.twoClockCutVerdicts[1].originalNativeIndependentAuditDoneByCut=false],
 ["original provider job replaced",v=>v.a1.originalActualMainProvider.jobId=1],
 ["original provider zip size modified",v=>v.a1.originalActualMainProvider.originalNativeZipBytes=8155],
 ["original zip native digest substituted",v=>v.a1.originalActualMainProvider.githubNativeZipDigestSha256="f".repeat(64)],
 ["original independent zip digest substituted",v=>v.a1.originalActualMainProvider.independentlyDownloadedNativeZipDigestSha256="f".repeat(64)],
 ["independent parsed inner body removed",v=>v.a1.originalActualMainProvider.originalInnerJsonIndependentlyParsed=false],
 ["historical original known-at backfilled",v=>v.a1.unresolvedFormal.originalHistoricalMarketDateFirstKnownAtAndAvailableAtVerified=true],
 ["historic revision completeness fabricated",v=>v.a1.unresolvedFormal.historicalProviderRevisionsAndDeletionsComplete=true],
 ["formal assessor falsely accepted",v=>v.a1.unresolvedFormal.postSourceFormalStrategyAssessorIndependentAudited=true],
 ["prior frozen reconstruction allowed",v=>v.a1.unresolvedFormal.originalMarketDay2345FormalDecisionMayBeRebuiltFromLaterEvidence=true],
 ["backtest shadow without PIT",v=>v.a1.unresolvedFormal.fullBacktestOrProspectiveShadowAuthorized=true],
 ["nine MOPS clocks falsely accepted",v=>v.a1.unresolvedFormal.strictHistoricalMopsNineVersionsFirstKnownAtCertified=9]
];
for(const [name,fn] of physicalWitnessTamper){
 test("physical source-clock witness cannot be forged: "+name,()=>{
  const copied=structuredClone(real);fn(copied);
  assert.throws(()=>reconcileRealPhysicalPITCrossDomainV0_1(copied),
   /S2_DATA_CROSS_DOMAIN_PIT_/);
 });
}
