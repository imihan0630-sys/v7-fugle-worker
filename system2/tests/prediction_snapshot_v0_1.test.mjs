import assert from "node:assert/strict";
import { buildFactorObservation, buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { buildFrozenDecisionSnapshot } from "../runtime/decision_archive.mjs";
import { buildPredictionSnapshotBundleV0_1 } from "../runtime/prediction_snapshot_v0_1.mjs";

const marketDate = "2026-09-29";
const decisionTimestamp = "2026-09-29T07:30:00Z";
const capturedAt = "2026-09-29T07:31:00Z";

const regime = buildMarketRegimeSnapshot({
  regimeSnapshotId: "REG-20260929",
  marketDate,
  decisionTimestamp,
  labels: ["UNKNOWN"],
  taiwanIndexState: "KNOWN",
  breadthState: "KNOWN",
  liquidityState: "KNOWN",
  volatilityState: "KNOWN",
  leadershipState: "UNKNOWN",
  sectorRotationState: "KNOWN",
  globalMacroState: "UNKNOWN",
  factorRefs: [],
  warnings: [],
});

function factor(symbol, id, rawValue, normalizedValue) {
  return buildFactorObservation({
    factorId: id,
    factorVersion: "0.1",
    scope: "SYMBOL",
    scopeKey: symbol,
    marketDate,
    decisionTimestamp,
    state: "KNOWN",
    rawValue,
    normalizedValue,
    confidence: 0.9,
    provenance: {
      sourceId: "fixture",
      sourceName: "fixture",
      availableAt: "2026-09-29T07:20:00Z",
      capturedAt: "2026-09-29T07:25:00Z",
      pointInTimeEligible: true,
    },
    normalization: {
      method: "BOUNDED_RATIO",
      normalizationVersion: "0.1",
    },
    qualityFlags: [],
  });
}

async function decision({
  decisionId,
  symbol,
  companyName,
  state,
  rank = null,
  totalScore = null,
  factorScores,
  reason,
}) {
  const obs = factor(symbol, "PV.TEST", 1.25, 0.75);
  return buildFrozenDecisionSnapshot({
    evaluation: {
      decisionId,
      marketDate,
      decisionTimestamp,
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      symbol,
      companyName,
      state,
      rank,
      totalScore,
      factorScores,
      factorRefs: ["PV.TEST@0.1"],
      interactionRefs: [],
      regimeSnapshotId: regime.regimeSnapshotId,
      reasons: [reason],
      warnings: [],
      missingRequiredFactors: [],
      thesis: "fixture thesis",
      invalidationConditions: ["fixture invalidation"],
      strategyValidity: state === "REJECTED" ? "INVALIDATED" : "VALID",
      entryReadiness: state === "SELECTED" ? "BUY_ELIGIBLE" : "NEAR_ENTRY",
      sourceReadiness: "SOURCE_READY",
      shadowSpecId: "S2-SM-LS-001",
      evaluationMode: "LIMITED_PROSPECTIVE_SHADOW",
    },
    entryPlan: {
      entryZoneLow: 100,
      entryZoneHigh: 102,
      triggerPrice: 102,
      stopPrice: 95,
      targets: [110, 118],
      resistanceLevels: [110, 118],
      maxHoldingSessions: 10,
    },
    factorObservations: [obs],
    interactionObservations: [],
    regime,
    frozenAt: capturedAt,
  });
}

const selected = await decision({
  decisionId: "D-SEL",
  symbol: "2454",
  companyName: "聯發科",
  state: "SELECTED",
  rank: 1,
  totalScore: 88,
  factorScores: { PRICE_VOLUME: 22.5, TECHNICAL_STRUCTURE: 24 },
  reason: "selected fixture",
});

const nearMiss = await decision({
  decisionId: "D-NEAR",
  symbol: "2330",
  companyName: "台積電",
  state: "QUALIFIED_NOT_SELECTED",
  reason: "qualified but not selected fixture",
});

const rejected = await decision({
  decisionId: "D-REJ",
  symbol: "1101",
  companyName: "台泥",
  state: "REJECTED",
  reason: "important reject fixture",
});

const sourceSessionReceipt = {
  receiptId: "SRC-1",
  marketDate,
  decisionTimestamp,
  sourceSessionState: "SOURCE_SESSION_READY",
  outcomeJoinSourceEligible: true,
};

const shadowRunReceipt = {
  runId: "RUN-1",
  marketDate,
  decisionTimestamp,
  runState: "COMPLETE",
};

const runFingerprint = {
  fingerprintId: "FP-1",
  marketDate,
  decisionTimestamp,
  outcomeJoinEligible: true,
  runFingerprintHash: "fp-hash",
};

const input = {
  predictionSnapshotId: "PS-20260929-001",
  marketDate,
  decisionTimestamp,
  decisionSnapshots: [selected, nearMiss, rejected],
  importantRejectedDecisionIds: ["D-REJ"],
  sourceSessionReceipt,
  shadowRunReceipts: [shadowRunReceipt],
  runFingerprints: [runFingerprint],
  capturedAt,
};

const bundle = await buildPredictionSnapshotBundleV0_1(input);
const replay = await buildPredictionSnapshotBundleV0_1(input);

assert.equal(bundle.predictionSnapshotHash, replay.predictionSnapshotHash);
assert.equal(bundle.decisionCount, 3);
assert.equal(bundle.cohortCounts.SELECTED, 1);
assert.equal(bundle.cohortCounts.NEAR_MISS, 1);
assert.equal(bundle.cohortCounts.IMPORTANT_REJECTED, 1);
assert.equal(bundle.zeroPickDay, false);
assert.equal(bundle.outcomeJoinEligible, true);
assert.deepEqual(bundle.outcomeJoinBlockers, []);

const selectedRow = bundle.decisions.find((x) => x.decisionId === "D-SEL");
assert.equal(selectedRow.companyName, "聯發科");
assert.equal(selectedRow.rank, 1);
assert.equal(selectedRow.totalScore, 88);
assert.equal(selectedRow.factorScoreState, "EXPLICIT_SCORES_PRESENT");
assert.equal(selectedRow.factorScores.PRICE_VOLUME, 22.5);
assert.equal(selectedRow.entryPlan.stopPrice, 95);
assert.deepEqual(selectedRow.entryPlan.resistanceLevels, [110, 118]);
assert.equal(selectedRow.marketRegime.regimeSnapshotId, "REG-20260929");
assert.equal(selectedRow.factorObservations[0].rawValue, 1.25);
assert.equal(selectedRow.factorObservations[0].normalizedValue, 0.75);

const nearRow = bundle.decisions.find((x) => x.decisionId === "D-NEAR");
assert.equal(nearRow.archiveCohort, "NEAR_MISS");
assert.equal(nearRow.totalScore, null);
assert.equal(nearRow.factorScoreState, "NOT_DEFINED");
assert.deepEqual(nearRow.factorScores, {});
assert.match(nearRow.factorScoreNote, /not relabeled/);

const rejectedRow = bundle.decisions.find((x) => x.decisionId === "D-REJ");
assert.equal(rejectedRow.archiveCohort, "IMPORTANT_REJECTED");
assert.deepEqual(rejectedRow.reasons, ["important reject fixture"]);

const noFingerprint = await buildPredictionSnapshotBundleV0_1({
  ...input,
  predictionSnapshotId: "PS-20260929-002",
  runFingerprints: [],
});
assert.equal(noFingerprint.outcomeJoinEligible, false);
assert.deepEqual(noFingerprint.outcomeJoinBlockers, ["RUN_FINGERPRINT_NOT_PROVIDED"]);

const zeroPick = await buildPredictionSnapshotBundleV0_1({
  predictionSnapshotId: "PS-20260929-ZERO",
  marketDate,
  decisionTimestamp,
  decisionSnapshots: [],
  importantRejectedDecisionIds: [],
  sourceSessionReceipt,
  shadowRunReceipts: [shadowRunReceipt],
  runFingerprints: [runFingerprint],
  capturedAt,
});
assert.equal(zeroPick.decisionCount, 0);
assert.equal(zeroPick.zeroPickDay, true);

await assert.rejects(
  () => buildPredictionSnapshotBundleV0_1({
    ...input,
    predictionSnapshotId: "PS-BAD-DATE",
    marketDate: "2026-09-30",
  }),
  /does not match Prediction Snapshot clock/,
);

await assert.rejects(
  () => buildPredictionSnapshotBundleV0_1({
    ...input,
    predictionSnapshotId: "PS-DUP",
    decisionSnapshots: [selected, selected],
  }),
  /duplicate decisionId/,
);

console.log("System2 Prediction Snapshot V0.1 tests passed");
