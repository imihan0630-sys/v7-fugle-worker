import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const ARCHIVE_COHORTS = Object.freeze([
  "SELECTED",
  "NEAR_MISS",
  "IMPORTANT_REJECTED",
  "REJECTED",
  "DIAGNOSTIC_OTHER",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function optionalTimestamp(value, field) {
  if (value === null || value === undefined || value === "") return null;
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function assertSameClock(value, expected, field) {
  if (requiredText(value, field) !== expected) {
    throw new Error(`${field} does not match Prediction Snapshot clock`);
  }
}

function archiveCohort(state, decisionId, importantRejectedDecisionIds) {
  if (state === "SELECTED") return "SELECTED";
  if (state === "QUALIFIED_NOT_SELECTED") return "NEAR_MISS";
  if (state === "REJECTED") {
    return importantRejectedDecisionIds.has(decisionId) ? "IMPORTANT_REJECTED" : "REJECTED";
  }
  return "DIAGNOSTIC_OTHER";
}

function explicitFactorScores(evaluation) {
  const raw = evaluation?.factorScores;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      state: "NOT_DEFINED",
      values: Object.freeze({}),
      note: "Normalized factor observations are preserved separately and are not relabeled as strategy scores.",
    };
  }

  const values = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value !== null && !Number.isFinite(value)) {
      throw new Error(`evaluation.factorScores.${key} must be finite or null`);
    }
    values[String(key)] = value;
  }

  return {
    state: "EXPLICIT_SCORES_PRESENT",
    values: Object.freeze(values),
    note: null,
  };
}

function validateDecisionSnapshot(snapshot, {
  marketDate,
  decisionTimestamp,
  seenDecisionIds,
  seenDecisionHashes,
}) {
  if (!snapshot || typeof snapshot !== "object") throw new Error("decision snapshot is required");
  const e = snapshot.evaluation || {};
  const decisionId = requiredText(e.decisionId, "evaluation.decisionId");
  const decisionHash = requiredText(e.decisionHash, "evaluation.decisionHash");
  const symbol = requiredText(e.symbol, "evaluation.symbol");
  const state = requiredText(e.state, "evaluation.state");

  assertSameClock(e.marketDate, marketDate, "evaluation.marketDate");
  assertSameClock(e.decisionTimestamp, decisionTimestamp, "evaluation.decisionTimestamp");

  if (seenDecisionIds.has(decisionId)) throw new Error(`duplicate decisionId: ${decisionId}`);
  if (seenDecisionHashes.has(decisionHash)) throw new Error(`duplicate decisionHash: ${decisionHash}`);
  seenDecisionIds.add(decisionId);
  seenDecisionHashes.add(decisionHash);

  const regime = snapshot.regime || {};
  const regimeSnapshotId = requiredText(
    e.regimeSnapshotId,
    "evaluation.regimeSnapshotId",
  );
  if (requiredText(regime.regimeSnapshotId, "regime.regimeSnapshotId") !== regimeSnapshotId) {
    throw new Error(`regimeSnapshotId mismatch for ${decisionId}`);
  }
  assertSameClock(regime.marketDate, marketDate, "regime.marketDate");
  assertSameClock(regime.decisionTimestamp, decisionTimestamp, "regime.decisionTimestamp");

  const factorObservations = [...(snapshot.factorObservations || [])];
  for (let i = 0; i < factorObservations.length; i += 1) {
    const factor = factorObservations[i];
    assertSameClock(factor.marketDate, marketDate, `factorObservations[${i}].marketDate`);
    assertSameClock(
      factor.decisionTimestamp,
      decisionTimestamp,
      `factorObservations[${i}].decisionTimestamp`,
    );
    if (factor.scope === "SYMBOL" && factor.scopeKey !== symbol) {
      throw new Error(`symbol factor does not match decision symbol for ${decisionId}`);
    }
  }

  return { e, decisionId, decisionHash, symbol, state, factorObservations, regime };
}

function normalizeSupportingReceipt(receipt, marketDate, decisionTimestamp, field) {
  if (!receipt || typeof receipt !== "object") throw new Error(`${field} is required`);
  assertSameClock(receipt.marketDate, marketDate, `${field}.marketDate`);
  assertSameClock(receipt.decisionTimestamp, decisionTimestamp, `${field}.decisionTimestamp`);
  return receipt;
}

export async function buildPredictionSnapshotBundleV0_1({
  predictionSnapshotId,
  marketDate,
  decisionTimestamp,
  decisionSnapshots = [],
  importantRejectedDecisionIds = [],
  sourceSessionReceipt = null,
  shadowRunReceipts = [],
  runFingerprints = [],
  capturedAt,
} = {}) {
  const snapshotId = requiredText(predictionSnapshotId, "predictionSnapshotId");
  const date = requiredText(marketDate, "marketDate");
  const clock = requiredText(decisionTimestamp, "decisionTimestamp");
  const captureTime = optionalTimestamp(capturedAt, "capturedAt");
  if (!captureTime) throw new Error("capturedAt is required");
  if (!Array.isArray(decisionSnapshots)) throw new Error("decisionSnapshots must be an array");
  if (!Array.isArray(importantRejectedDecisionIds)) {
    throw new Error("importantRejectedDecisionIds must be an array");
  }
  if (!Array.isArray(shadowRunReceipts)) throw new Error("shadowRunReceipts must be an array");
  if (!Array.isArray(runFingerprints)) throw new Error("runFingerprints must be an array");

  const importantRejectedSet = new Set(
    importantRejectedDecisionIds.map((x, i) =>
      requiredText(String(x), `importantRejectedDecisionIds[${i}]`),
    ),
  );
  if (importantRejectedSet.size !== importantRejectedDecisionIds.length) {
    throw new Error("importantRejectedDecisionIds contains duplicates");
  }

  const seenDecisionIds = new Set();
  const seenDecisionHashes = new Set();
  const decisions = [];

  for (const snapshot of decisionSnapshots) {
    const {
      e,
      decisionId,
      decisionHash,
      symbol,
      state,
      factorObservations,
      regime,
    } = validateDecisionSnapshot(snapshot, {
      marketDate: date,
      decisionTimestamp: clock,
      seenDecisionIds,
      seenDecisionHashes,
    });

    const cohort = archiveCohort(state, decisionId, importantRejectedSet);
    const scorePayload = explicitFactorScores(e);

    decisions.push({
      decisionId,
      decisionHash,
      symbol,
      companyName: e.companyName || null,
      marketDate: date,
      decisionTimestamp: clock,
      frozenAt: requiredText(snapshot.frozenAt, "snapshot.frozenAt"),
      strategyId: requiredText(e.strategyId, "evaluation.strategyId"),
      strategyVersion: requiredText(e.strategyVersion, "evaluation.strategyVersion"),
      candidateState: state,
      archiveCohort: cohort,
      rank: Number.isFinite(e.rank) ? e.rank : null,
      totalScore: Number.isFinite(e.totalScore) ? e.totalScore : null,
      factorScoreState: scorePayload.state,
      factorScores: scorePayload.values,
      factorScoreNote: scorePayload.note,
      factorObservations: Object.freeze(factorObservations),
      interactionObservations: Object.freeze([...(snapshot.interactionObservations || [])]),
      regimeSnapshotId: requiredText(e.regimeSnapshotId, "evaluation.regimeSnapshotId"),
      marketRegime: regime,
      entryPlan: snapshot.entryPlan || {},
      thesis: e.thesis ?? null,
      invalidationConditions: Object.freeze([...(e.invalidationConditions || [])].map(String)),
      reasons: Object.freeze([...(e.reasons || [])].map(String)),
      warnings: Object.freeze([...(e.warnings || [])].map(String)),
      missingRequiredFactors: Object.freeze(
        [...(e.missingRequiredFactors || [])].map(String),
      ),
      strategyValidity: e.strategyValidity || null,
      entryReadiness: e.entryReadiness || null,
      sourceReadiness: e.sourceReadiness || null,
      shadowSpecId: e.shadowSpecId || null,
      evaluationMode: e.evaluationMode || null,
      decisionSchemaVersion: requiredText(snapshot.schemaVersion, "snapshot.schemaVersion"),
    });
  }

  const sourceReceipt = sourceSessionReceipt
    ? normalizeSupportingReceipt(sourceSessionReceipt, date, clock, "sourceSessionReceipt")
    : null;
  const normalizedRunReceipts = shadowRunReceipts.map((receipt, i) =>
    normalizeSupportingReceipt(receipt, date, clock, `shadowRunReceipts[${i}]`),
  );
  const normalizedFingerprints = runFingerprints.map((receipt, i) =>
    normalizeSupportingReceipt(receipt, date, clock, `runFingerprints[${i}]`),
  );

  const cohortCounts = Object.fromEntries(ARCHIVE_COHORTS.map((cohort) => [cohort, 0]));
  const candidateStateCounts = {};
  for (const row of decisions) {
    cohortCounts[row.archiveCohort] += 1;
    candidateStateCounts[row.candidateState] =
      (candidateStateCounts[row.candidateState] || 0) + 1;
  }

  const outcomeJoinBlockers = [];
  if (!normalizedFingerprints.length) {
    outcomeJoinBlockers.push("RUN_FINGERPRINT_NOT_PROVIDED");
  }
  for (const fp of normalizedFingerprints) {
    if (fp.outcomeJoinEligible !== true) {
      outcomeJoinBlockers.push(
        `RUN_FINGERPRINT_NOT_ELIGIBLE:${fp.fingerprintId || fp.runFingerprintHash || "UNKNOWN"}`,
      );
    }
  }
  if (sourceReceipt && sourceReceipt.outcomeJoinSourceEligible !== true) {
    outcomeJoinBlockers.push("SOURCE_SESSION_NOT_OUTCOME_JOIN_ELIGIBLE");
  }

  const base = {
    predictionSnapshotId: snapshotId,
    marketDate: date,
    decisionTimestamp: clock,
    capturedAt: captureTime,
    archiveVersion: "S2_PREDICTION_SNAPSHOT_V0_1",
    decisionCount: decisions.length,
    cohortCounts,
    candidateStateCounts,
    decisions: Object.freeze(decisions),
    sourceSessionReceipt: sourceReceipt,
    shadowRunReceipts: Object.freeze(normalizedRunReceipts),
    runFingerprints: Object.freeze(normalizedFingerprints),
    outcomeJoinEligible: outcomeJoinBlockers.length === 0,
    outcomeJoinBlockers: Object.freeze([...new Set(outcomeJoinBlockers)]),
    zeroPickDay: cohortCounts.SELECTED === 0,
    invariants: Object.freeze({
      decisionRecordsImmutable: true,
      normalizedFactorsRelabeledAsScores: false,
      outcomeDataAttachedAtDecisionTime: false,
      historicalBackfillAllowed: false,
    }),
  };

  const predictionSnapshotHash = await sha256Hex(base);
  return deepFreeze({ ...base, predictionSnapshotHash });
}

export { ARCHIVE_COHORTS };
