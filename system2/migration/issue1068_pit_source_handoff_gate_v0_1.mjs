// DATA_LANE #1068: machine-verifiable DATA -> BUILD PIT source handoff.
// This validates already committed original-source evidence and emits no
// strategy, rank, Frozen, Shadow, Cloudflare or System1 authority.
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { reconcileRealPhysicalPITCrossDomainV0_1 } from "./issue1068_real_a1_cfi_ca_pit_crossdomain_gate_v0_1.mjs";

const SHA = /^[0-9a-f]{64}$/;
const fail = (code) => { throw new Error("S2_PIT_SOURCE_HANDOFF_" + code); };
const truth = (value, code) => { if (!value) fail(code); };

const EXPECTED_TRADING_DATES = Object.freeze([
  "2026-07-20", "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24",
  "2026-07-27", "2026-07-28", "2026-07-29", "2026-07-30", "2026-07-31",
  "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07",
  "2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14",
  "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21",
  "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28",
  "2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04",
  "2026-09-07", "2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11",
  "2026-09-14", "2026-09-15", "2026-09-16", "2026-09-17", "2026-09-18",
  "2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-29",
  "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-05", "2026-10-06",
  "2026-10-07", "2026-10-08", "2026-10-12", "2026-10-13", "2026-10-14",
  "2026-10-15",
]);

export async function validatePitSourceHandoffV0_1({ handoff, a1, cfi, ca } = {}) {
  const physical = reconcileRealPhysicalPITCrossDomainV0_1({ a1, cfi, ca });
  truth(handoff?.schemaVersion === "S2_PIT_SOURCE_HANDOFF_V0_1"
    && handoff.status === "SOURCE_INDEPENDENTLY_REHASHED__PIT_SCOPE_NOT_INDEPENDENTLY_ACCEPTED"
    && handoff.repository === "imihan0630-sys/v7-fugle-worker"
    && handoff.basedOnMainCommit === "595fce5992b252871eea903a5aff46f902728379"
    && handoff.dataOwner === "SYSTEM2_DATA_LANE"
    && handoff.buildConsumerOwner === "SYSTEM2_BUILD_LANE",
  "IDENTITY_OR_OWNER_INVALID");

  truth(handoff.marketDate === "2026-10-15"
    && handoff.originalDecisionCutAtUtc === "2026-10-15T15:45:00.000Z"
    && handoff.actualSourceOnlyEvaluationAtUtc === physical.independentSourceOnlyResearchCutUtc
    && handoff.windowStartDate === EXPECTED_TRADING_DATES[0]
    && handoff.windowEndDate === EXPECTED_TRADING_DATES.at(-1)
    && Array.isArray(handoff.officialTradingDates)
    && JSON.stringify(handoff.officialTradingDates) === JSON.stringify(EXPECTED_TRADING_DATES),
  "CLOCK_OR_OFFICIAL_CALENDAR_INVALID");

  const a1h = handoff.a1OriginalEvidence;
  truth(a1h?.sourceRunId === 38797319008
    && a1h.sourceArtifactId === 12002806667
    && a1h.sourceReceiptSha256 === "ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9"
    && a1h.independentReadbackRunId === 38797548446
    && a1h.independentAuditSha256 === "cebec987e32f863e42f9d95ffb881979164ed63be6716dc1e40bf2f8cf3f5808"
    && a1h.perPairReconciliationRunId === 38826851466
    && a1h.perPairReconciliationArtifactId === 12015950224
    && a1h.artifactZipSha256 === "3f50f2e2c6bb9ebb6287e8f41e9f085cb905379a7848cd1a2cd2b808882bb68"
    && a1h.innerJsonSha256 === "b53b2c756791ab8bb5a0f6eddb2d84241b9fb56ca80697b57c37be532ace708f"
    && a1h.originalProviderPairs === physical.independentlyRehashedProviderSourcePairs
    && a1h.independentlyRehashedProviderPairs === 122
    && a1h.sourceSecurityWindows === 1935
    && a1h.reconciledOhlcvRows === physical.independentlyReconciledOHLCVRows
    && a1h.historicalMarketDateFirstKnownAtCertified === 0
    && a1h.historicalMarketDateAvailableAtCertified === 0
    && a1h.originalDecisionCutIndependentArchiveWitness === false
    && a1h.originalDecisionCutIndependentAuditComplete === false
    && a1h.actualSourceOnlyCutAccepted === true
    && Array.isArray(a1h.sourceFamilies) && a1h.sourceFamilies.length === 2
    && a1h.sourceFamilies.every((row) => ["TWSE", "TPEX"].includes(row.market)
      && typeof row.sourceId === "string"
      && typeof row.providerUrlTemplate === "string"
      && row.providerUrlTemplate.startsWith("https://")),
  "A1_ORIGINAL_EVIDENCE_INVALID");

  const cfih = handoff.cfiOriginalEvidence;
  truth(cfih?.sourceMarketDate === "2026-10-14"
    && cfih.sourceRunId === 38671504419
    && cfih.sourceArtifactId === 11944012358
    && cfih.independentAuditRunId === 38671545058
    && cfih.currentNativeRowsRehashed === physical.priorPreviewNativeCFIOriginalsRehashed
    && cfih.historicalEffectivePeriodRowsAcceptedForCurrentA1MarketDate === 0
    && cfih.historicalSixtyOneSessionOrdinaryShareCertified === false
    && cfih.providerUrlTemplates.length === 2
    && cfih.providerUrlTemplates.every((url) => url.startsWith("https://isin.twse.com.tw/")),
  "CFI_ORIGINAL_SCOPE_INVALID");

  const cah = handoff.corporateActionOriginalEvidence;
  truth(cah?.sourceMarketDate === "2026-10-14"
    && cah.sourceFamilyIds.length === 6
    && new Set(cah.sourceFamilyIds).size === 6
    && cah.physicalRunId === 38654564377
    && cah.independentReplayRunId === 38655538159
    && cah.nativeFamilyBodiesRehashed === physical.caSixOriginalSourceLanesRehashed
    && cah.knownEventMarketSymbols === 630
    && cah.priorPreviewKnownEventSymbols === 11
    && cah.priorPreviewUnknownNotNoEventSymbols === 19
    && cah.historicalCorrectionCancellationSuspensionAndNoEventComplete === false,
  "CA_ORIGINAL_SCOPE_INVALID");

  truth(handoff.otherHistoricalClockState?.mopsTrackedHistoricalVersions === 9
    && handoff.otherHistoricalClockState.mopsExactHistoricalFirstKnownAtAvailableAtAccepted === 0
    && handoff.otherHistoricalClockState.retrospectiveCurrentGetMayBackdateHistoricalAvailability === false,
  "HISTORICAL_CLOCK_FALSE_PROMOTION");

  const scope = handoff.handoffScope;
  truth(scope?.sourceObservationState === "SOURCE_OBSERVED_AND_INDEPENDENTLY_REHASHED_AT_ACTUAL_PREOPEN_RESEARCH_CUT_ONLY"
    && scope.originalMarketDecisionPitState === "BLOCKED"
    && scope.strategyPitState === "BLOCKED"
    && scope.candidateUniverseOrdinaryShareComplete === false
    && scope.sourceSecurityWindowCount === 1935
    && scope.pitEligibleSymbolCount === 0
    && scope.unresolvedSymbolCount === 1935
    && scope.formalSelectedCount === null
    && scope.zeroPickDay === null
    && scope.selectionAuthorized === false
    && scope.frozenD1Written === false
    && scope.shadowAuthorized === false
    && scope.historicalBacktestAuthorized === false
    && scope.independentAuditLaneFullPitAccepted === false
    && Array.isArray(scope.blockers) && scope.blockers.length === 6,
  "FALSE_SELECTION_AUTHORITY");

  const migration = handoff.migrationAndAccountState;
  truth(migration?.sourceRestoredLogicalRows === 113222
    && migration.sourceA1Rows === 84688
    && migration.destinationA1Rows === 59311
    && migration.destinationA1RowsIdentityMatched === 59311
    && migration.destinationA1RowsRemaining === 25377
    && migration.destinationFrozenRows === 0
    && migration.lastWriterBilledRowsWritten === 71346
    && migration.ownerDailyRowsWrittenCeiling === 80000
    && migration.sameUtcDaySecondWriterAuthorized === false
    && migration.targetR2Entitlement === "NOT_ENTITLED_403_10042"
    && migration.g3FullyAccepted === false
    && migration.g4FullyAccepted === false
    && migration.atomicCrossWorkflowLedgerPhysicallyVerified === false,
  "MIGRATION_OR_ACCOUNT_STATE_PROMOTED");

  truth(handoff.safety?.cloudflareD1ReadsForThisHandoff === 0
    && handoff.safety.cloudflareD1WritesForThisHandoff === 0
    && handoff.safety.cloudflareR2CallsForThisHandoff === 0
    && handoff.safety.newOfficialProviderGetsForThisHandoff === 0
    && handoff.safety.system1FormalCoreChanged === false
    && handoff.safety.productionWorkerCronOrTradingChanged === false,
  "SAFETY_BOUNDARY_INVALID");

  truth(handoff.buildConsumerRisk?.observedOnMainCommit === handoff.basedOnMainCommit
    && Array.isArray(handoff.buildConsumerRisk.affectedConsumerPaths)
    && handoff.buildConsumerRisk.affectedConsumerPaths.length === 3
    && handoff.buildConsumerRisk.affectedConsumerPaths.every((path) => path.startsWith("system2/runtime/"))
    && /SESSION_CLOSE_FINALITY/.test(handoff.buildConsumerRisk.risk)
    && /INCOMPLETE/.test(handoff.buildConsumerRisk.requiredBuildDisposition)
    && /zeroPickDay null/.test(handoff.buildConsumerRisk.requiredBuildDisposition)
    && handoff.buildConsumerRisk.dataLaneModifiedBuildConsumer === false
    && handoff.buildConsumerRisk.ownershipTransferGranted === false,
  "BUILD_HANDOFF_OR_OWNERSHIP_BOUNDARY_INVALID");

  const { receiptHash, ...unsigned } = handoff;
  truth(SHA.test(receiptHash || "") && await sha256Hex(unsigned) === receiptHash,
    "RECEIPT_HASH_INVALID");
  return Object.freeze({
    schemaVersion: "S2_PIT_SOURCE_HANDOFF_VALIDATION_V0_1",
    state: "DATA_HANDOFF_VALID__ALL_1935_REMAIN_PIT_UNKNOWN_FOR_ORIGINAL_DECISION",
    receiptHash,
    marketDate: handoff.marketDate,
    sourceSecurityWindowCount: 1935,
    pitEligibleSymbolCount: 0,
    unresolvedSymbolCount: 1935,
    formalSelectedCount: null,
    zeroPickDay: null,
    selectionAuthorized: false,
    frozenD1Written: false,
    cloudflareD1Writes: 0,
    system1FormalCoreChanged: false,
  });
}
