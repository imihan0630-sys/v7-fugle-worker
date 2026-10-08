import assert from "node:assert/strict";
import { buildFactorObservation, buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { buildStrategyStateAssessment } from "../runtime/strategy_evaluator.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import {
  SHORT_MOMENTUM_CONTRACT_V0_1,
} from "../runtime/strategy_contracts_v0_1.mjs";
import {
  findLimitedShadowSpec,
} from "../runtime/limited_shadow_v0_1.mjs";
import {
  buildLimitedShadowRunBundleV0_1,
} from "../runtime/limited_shadow_run_assembler_v0_1.mjs";

const marketDate = "2026-09-29";
const decisionTimestamp = "2026-09-29T07:30:00Z";
const factorCapturedAt = "2026-09-29T07:25:00Z";
const runCapturedAt = "2026-09-29T07:31:00Z";
const contract = SHORT_MOMENTUM_CONTRACT_V0_1;
const shadowSpec = findLimitedShadowSpec("SHORT_MOMENTUM");

const sourceSessionReceipt = await buildShadowSourceSessionReceipt({
  receiptId: "SRC-RUN-001",
  marketDate,
  decisionTimestamp,
  expectedSources: [
    { sourceId: "A1_TW_DAILY_OHLCV_DERIVED", role: "REQUIRED" },
  ],
  observedSources: [
    {
      sourceId: "A1_TW_DAILY_OHLCV_DERIVED",
      state: "KNOWN",
      sourceDate: marketDate,
      availableAt: "2026-09-29T07:20:00Z",
      capturedAt: factorCapturedAt,
      pointInTimeEligible: true,
      payloadHash: "a1-hash",
      semanticVersion: "fixture-v1",
    },
  ],
  capturedAt: factorCapturedAt,
});

const regime = buildMarketRegimeSnapshot({
  regimeSnapshotId: "REG-20260929-001",
  marketDate,
  decisionTimestamp,
  labels: ["UNKNOWN"],
  taiwanIndexState: "KNOWN",
  breadthState: "UNKNOWN",
  liquidityState: "KNOWN",
  volatilityState: "KNOWN",
  leadershipState: "UNKNOWN",
  sectorRotationState: "UNKNOWN",
  globalMacroState: "UNKNOWN",
  factorRefs: [],
  warnings: ["fixture"],
});

function factor(symbol, factorId, state = "KNOWN") {
  return buildFactorObservation({
    factorId,
    factorVersion: "0.1-RESEARCH",
    scope: "SYMBOL",
    scopeKey: symbol,
    marketDate,
    decisionTimestamp,
    state,
    rawValue: state === "KNOWN" ? { fixture: 1 } : null,
    normalizedValue: null,
    confidence: state === "KNOWN" ? 1 : null,
    provenance: {
      sourceId: "A1_TW_DAILY_OHLCV_DERIVED",
      sourceName: "fixture",
      sourceDate: marketDate,
      availableAt: "2026-09-29T07:20:00Z",
      capturedAt: factorCapturedAt,
      pointInTimeEligible: true,
      payloadHash: "a1-hash",
    },
    normalization: {
      method: "NONE",
      normalizationVersion: "0.1-RESEARCH",
      referenceWindow: "fixture",
    },
    unknownReason: state === "UNKNOWN" ? "FIXTURE_MISSING" : undefined,
    qualityFlags: [],
  });
}

const requiredLaunchFamilies = new Set([
  "TECHNICAL_STRUCTURE",
  "PRICE_VOLUME",
  "RISK_FRICTION",
]);
const allKnownFamilies = Object.fromEntries(
  contract.evidenceFamilies.map((x) => [
    x.family,
    requiredLaunchFamilies.has(x.family)
      ? {
          observationState: "KNOWN",
          thesisState: x.family === "RISK_FRICTION" ? "NEUTRAL" : "SUPPORTIVE",
          reasons: ["fixture known"],
          warnings: [],
        }
      : {
          observationState: "UNKNOWN",
          thesisState: "INDETERMINATE",
          reasons: ["fixture not required"],
          warnings: [],
        },
  ]),
);

const qualifiedAssessment = buildStrategyStateAssessment(contract, {
  familyAssessments: allKnownFamilies,
  entryReadiness: "BUY_ELIGIBLE",
});

const incompleteFamilies = {
  ...allKnownFamilies,
  PRICE_VOLUME: {
    observationState: "UNKNOWN",
    thesisState: "INDETERMINATE",
    reasons: ["fixture missing"],
    warnings: [],
  },
};
const incompleteAssessment = buildStrategyStateAssessment(contract, {
  familyAssessments: incompleteFamilies,
  entryReadiness: "BUY_ELIGIBLE",
});

const input = {
  runId: "RUN-SM-20260929",
  fingerprintId: "FP-SM-20260929",
  predictionSnapshotId: "PS-SM-20260929",
  persistenceBatchId: "PB-SM-20260929",
  marketDate,
  decisionTimestamp,
  capturedAt: runCapturedAt,
  universeVersion: "TW-EQUITY-FIXTURE-V1",
  baseUniverseSymbols: ["0050", "2330", "2454"],
  excludedSymbols: ["0050"],
  contract,
  shadowSpec,
  sourceSessionReceipt,
  regime,
  factorBundleVersion: "S2-A1-HIST-0.1-RESEARCH",
  candidates: [
    {
      symbol: "2330",
      companyName: "台積電",
      decisionId: "D-SM-2330-20260929",
      factorSnapshotId: "FS-2330-20260929",
      coreMetrics: { close: 1500, ma20: 1450 },
      factorObservations: [
        factor("2330", "TECH.TREND"),
        factor("2330", "PV.RELATIVE_VOLUME"),
        factor("2330", "RISK.LIQUIDITY"),
      ],
      interactionObservations: [],
      sourceManifest: [{ sourceId: "A1_TW_DAILY_OHLCV_DERIVED", payloadHash: "a1-hash" }],
      assessment: qualifiedAssessment,
      entryPlan: {
        entryZoneLow: 1490,
        entryZoneHigh: 1510,
        triggerPrice: 1510,
        stopPrice: 1430,
        targets: [1600, 1680],
        resistanceLevels: [1600, 1680],
        maxHoldingSessions: 10,
      },
      reasons: ["fixture qualified"],
      warnings: [],
    },
    {
      symbol: "2454",
      companyName: "聯發科",
      decisionId: "D-SM-2454-20260929",
      factorSnapshotId: "FS-2454-20260929",
      coreMetrics: { close: 1200, ma20: 1180 },
      factorObservations: [
        factor("2454", "TECH.TREND"),
        factor("2454", "PV.RELATIVE_VOLUME", "UNKNOWN"),
        factor("2454", "RISK.LIQUIDITY"),
      ],
      interactionObservations: [],
      sourceManifest: [{ sourceId: "A1_TW_DAILY_OHLCV_DERIVED", payloadHash: "a1-hash" }],
      assessment: incompleteAssessment,
      entryPlan: null,
      reasons: ["fixture incomplete"],
      warnings: [],
    },
  ],
  importantRejectedDecisionIds: [],
  runWarnings: [],
};

const bundle = await buildLimitedShadowRunBundleV0_1(input);
const replay = await buildLimitedShadowRunBundleV0_1(input);

assert.equal(bundle.schemaVersion, "S2_LIMITED_SHADOW_RUN_BUNDLE_V0_1");
assert.equal(bundle.finalSelectionEnabled, false);
assert.equal(bundle.selectedGenerationAuthorized, false);
assert.equal(bundle.runReceipt.runState, "COMPLETE");
assert.equal(bundle.runReceipt.baseUniverseCount, 3);
assert.equal(bundle.runReceipt.excludedCount, 1);
assert.equal(bundle.runReceipt.eligibleCount, 2);
assert.equal(bundle.runReceipt.accountedCount, 2);
assert.equal(bundle.runReceipt.completionRate, 1);
assert.equal(bundle.runReceipt.stateCounts.QUALIFIED_NOT_SELECTED, 1);
assert.equal(bundle.runReceipt.stateCounts.INCOMPLETE, 1);
assert.equal(bundle.runReceipt.stateCounts.SELECTED, 0);
assert.equal(bundle.decisionSnapshots.length, 2);
assert.equal(bundle.factorRows.length, 2);

const bySymbol = Object.fromEntries(
  bundle.decisionSnapshots.map((x) => [x.evaluation.symbol, x]),
);
assert.equal(bySymbol["2330"].evaluation.state, "QUALIFIED_NOT_SELECTED");
assert.equal(bySymbol["2330"].decisionEvidence.state, "READY");
assert.equal(bySymbol["2330"].decisionEvidence.outcomeJoinEligible, true);
assert.equal(bySymbol["2330"].evaluation.rank, null);
assert.equal(bySymbol["2330"].evaluation.totalScore, null);
assert.equal(bySymbol["2454"].evaluation.state, "INCOMPLETE");
assert.ok(
  bySymbol["2454"].evaluation.missingRequiredFactors.some((x) =>
    x.startsWith("PRICE_VOLUME:"),
  ),
);

assert.equal(bundle.fingerprint.runFingerprintState, "RUN_FINGERPRINT_COMPLETE");
assert.equal(bundle.fingerprint.outcomeJoinEligible, true);
assert.equal(bundle.predictionSnapshot.zeroPickDay, null);
assert.equal(bundle.predictionSnapshot.zeroPickState, "PARTIAL_COVERAGE_NO_SELECTION");
assert.equal(bundle.predictionSnapshot.selectionDenominator.complete, false);
assert.equal(bundle.predictionSnapshot.selectionDenominator.unresolvedByState.INCOMPLETE, 1);
assert.equal(bundle.predictionSnapshot.cohortCounts.NEAR_MISS, 1);
assert.equal(bundle.predictionSnapshot.cohortCounts.SELECTED, 0);
assert.equal(bundle.predictionSnapshot.outcomeJoinEligible, false);
assert.ok(
  bundle.predictionSnapshot.outcomeJoinBlockers.includes(
    "DECISION_EVIDENCE_NOT_READY:D-SM-2454-20260929",
  ),
);
assert.equal(
  bundle.predictionSnapshot.predictionSnapshotHash,
  replay.predictionSnapshot.predictionSnapshotHash,
);
assert.equal(bundle.fingerprint.runFingerprintHash, replay.fingerprint.runFingerprintHash);
assert.equal(bundle.persistenceBatch.batchHash, replay.persistenceBatch.batchHash);

assert.equal(bundle.persistenceBatch.operationCount, 8);
assert.equal(bundle.persistenceBatch.operations.at(-1).table, "s2_shadow_run_fingerprints");
assert.deepEqual(
  bundle.persistenceBatch.operations.map((x) => x.table),
  [
    "s2_source_session_receipts",
    "s2_market_regime_snapshots",
    "s2_symbol_factor_snapshots",
    "s2_symbol_factor_snapshots",
    "s2_decisions",
    "s2_decisions",
    "s2_shadow_runs",
    "s2_shadow_run_fingerprints",
  ],
);
assert.equal(bundle.persistenceBatch.outcomeRowsAllowed, false);

const factorRow2330 = bundle.factorRows.find((x) => x.symbol === "2330");
assert.equal(factorRow2330.company_name, "台積電");
assert.equal(factorRow2330.completeness_state, "COMPLETE");
assert.match(factorRow2330.snapshot_hash, /^[0-9a-f]{64}$/);

const factorRow2454 = bundle.factorRows.find((x) => x.symbol === "2454");
assert.equal(factorRow2454.completeness_state, "INCOMPLETE");
assert.match(factorRow2454.unknowns_json, /PV.RELATIVE_VOLUME/);

const incompleteAccounting = await buildLimitedShadowRunBundleV0_1({
  ...input,
  runId: "RUN-SM-INCOMPLETE",
  fingerprintId: "FP-SM-INCOMPLETE",
  predictionSnapshotId: "PS-SM-INCOMPLETE",
  persistenceBatchId: "PB-SM-INCOMPLETE",
  candidates: input.candidates.slice(0, 1),
});
assert.equal(incompleteAccounting.runReceipt.runState, "INCOMPLETE");
assert.deepEqual(incompleteAccounting.runReceipt.unaccountedSymbols, ["2454"]);
assert.equal(
  incompleteAccounting.fingerprint.runFingerprintState,
  "RUN_FINGERPRINT_INCOMPLETE",
);
assert.equal(incompleteAccounting.fingerprint.outcomeJoinEligible, false);
assert.equal(incompleteAccounting.predictionSnapshot.outcomeJoinEligible, false);

await assert.rejects(
  () => buildLimitedShadowRunBundleV0_1({
    ...input,
    runId: "RUN-BAD-EXCLUDED",
    fingerprintId: "FP-BAD-EXCLUDED",
    predictionSnapshotId: "PS-BAD-EXCLUDED",
    persistenceBatchId: "PB-BAD-EXCLUDED",
    excludedSymbols: ["0050", "9999"],
  }),
  /excluded symbol not in base universe/,
);

await assert.rejects(
  () => buildLimitedShadowRunBundleV0_1({
    ...input,
    runId: "RUN-DUP",
    fingerprintId: "FP-DUP",
    predictionSnapshotId: "PS-DUP",
    persistenceBatchId: "PB-DUP",
    candidates: [input.candidates[0], input.candidates[0]],
  }),
  /duplicate candidate symbol/,
);

await assert.rejects(
  () => buildLimitedShadowRunBundleV0_1({
    ...input,
    runId: "RUN-SELECTION-LAYER",
    fingerprintId: "FP-SELECTION-LAYER",
    predictionSnapshotId: "PS-SELECTION-LAYER",
    persistenceBatchId: "PB-SELECTION-LAYER",
    shadowSpec: { ...shadowSpec, selectionLayerEnabled: true },
  }),
  /cannot enable final selection/,
);

console.log("System2 limited Shadow run assembler V0.1 tests passed");
