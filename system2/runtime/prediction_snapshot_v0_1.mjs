import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { verifyShadowRunFingerprintV0_1 } from "./shadow_run_fingerprint.mjs";

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

async function recomputeDecisionHashV0_1(snapshot) {
  const evaluation = snapshot?.evaluation || {};
  const claimed = typeof evaluation.decisionHash === "string" ? evaluation.decisionHash.trim() : "";
  const { decisionHash: _ignored, ...evaluationWithoutHash } = evaluation;
  const { evaluation: _oldEvaluation, ...rest } = snapshot || {};
  const recomputed = await sha256Hex({
    ...rest,
    evaluation: evaluationWithoutHash,
  });
  return {
    claimed,
    recomputed,
    valid: /^[a-f0-9]{64}$/.test(claimed) && claimed === recomputed,
  };
}

async function recomputeDecisionEvidenceHashV0_1(decisionEvidence) {
  if (!decisionEvidence || typeof decisionEvidence !== "object") {
    return { claimed: null, recomputed: null, valid: false };
  }
  const claimed = typeof decisionEvidence.evidenceHash === "string"
    ? decisionEvidence.evidenceHash.trim()
    : "";
  const { evidenceHash: _ignored, ...base } = decisionEvidence;
  const recomputed = await sha256Hex(base);
  return {
    claimed,
    recomputed,
    valid: /^[a-f0-9]{64}$/.test(claimed) && claimed === recomputed,
  };
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

  const decisionEvidence = snapshot.decisionEvidence && typeof snapshot.decisionEvidence === "object"
    ? snapshot.decisionEvidence
    : null;
  if (decisionEvidence) {
    assertSameClock(decisionEvidence.marketDate, marketDate, "decisionEvidence.marketDate");
    assertSameClock(
      decisionEvidence.decisionTimestamp,
      decisionTimestamp,
      "decisionEvidence.decisionTimestamp",
    );
    if (requiredText(decisionEvidence.symbol, "decisionEvidence.symbol") !== symbol) {
      throw new Error(`decisionEvidence symbol mismatch for ${decisionId}`);
    }
  }

  return {
    e,
    decisionId,
    decisionHash,
    symbol,
    state,
    factorObservations,
    regime,
    decisionEvidence,
  };
}

function normalizeSupportingReceipt(receipt, marketDate, decisionTimestamp, field) {
  if (!receipt || typeof receipt !== "object") throw new Error(`${field} is required`);
  assertSameClock(receipt.marketDate, marketDate, `${field}.marketDate`);
  assertSameClock(receipt.decisionTimestamp, decisionTimestamp, `${field}.decisionTimestamp`);
  return receipt;
}

function summarizeSelectionDenominator(runReceipts) {
  if (!runReceipts.length) {
    return Object.freeze({
      state: "UNKNOWN",
      complete: false,
      unresolvedCount: null,
      unresolvedByState: Object.freeze({}),
      blockerCodes: Object.freeze(["SHADOW_RUN_RECEIPT_NOT_PROVIDED"]),
    });
  }

  const unresolvedStates = ["INCOMPLETE", "SOURCE_BLOCKED", "SESSION_INVALID", "ERROR"];
  const unresolvedByState = Object.fromEntries(unresolvedStates.map((state) => [state, 0]));
  const blockerCodes = [];
  let stateCountsComplete = true;

  for (const receipt of runReceipts) {
    if (receipt.runState !== "COMPLETE") {
      blockerCodes.push(`SHADOW_RUN_ACCOUNTING_${receipt.runState || "UNKNOWN"}`);
    }
    if (!receipt.stateCounts || typeof receipt.stateCounts !== "object") {
      stateCountsComplete = false;
      blockerCodes.push("SHADOW_RUN_STATE_COUNTS_MISSING");
      continue;
    }
    for (const state of unresolvedStates) {
      unresolvedByState[state] += Number(receipt.stateCounts[state] || 0);
    }
  }

  const unresolvedCount = Object.values(unresolvedByState)
    .reduce((sum, value) => sum + value, 0);
  const complete =
    blockerCodes.length === 0
    && stateCountsComplete
    && unresolvedCount === 0;

  return Object.freeze({
    state: complete
      ? "COMPLETE"
      : stateCountsComplete
        ? "PARTIAL"
        : "UNKNOWN",
    complete,
    unresolvedCount,
    unresolvedByState: Object.freeze(unresolvedByState),
    blockerCodes: Object.freeze([...new Set(blockerCodes)]),
  });
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
      decisionEvidence,
    } = validateDecisionSnapshot(snapshot, {
      marketDate: date,
      decisionTimestamp: clock,
      seenDecisionIds,
      seenDecisionHashes,
    });

    const cohort = archiveCohort(state, decisionId, importantRejectedSet);
    const scorePayload = explicitFactorScores(e);
    const decisionHashIntegrity = await recomputeDecisionHashV0_1(snapshot);
    const decisionEvidenceIntegrity = await recomputeDecisionEvidenceHashV0_1(decisionEvidence);

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
      decisionEvidenceState: decisionEvidence?.state || "MISSING",
      decisionEvidenceHash: decisionEvidence?.evidenceHash || null,
      decisionEvidenceOutcomeJoinEligible: decisionEvidence?.outcomeJoinEligible === true,
      decisionEvidenceBlockers: Object.freeze([...(decisionEvidence?.blockerCodes || [])].map(String)),
      decisionHashIntegrityValid: decisionHashIntegrity.valid,
      recomputedDecisionHash: decisionHashIntegrity.recomputed,
      decisionEvidenceHashIntegrityValid: decisionEvidenceIntegrity.valid,
      recomputedDecisionEvidenceHash: decisionEvidenceIntegrity.recomputed,
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

  const selectionDenominator = summarizeSelectionDenominator(normalizedRunReceipts);
  const zeroPickState = cohortCounts.SELECTED > 0
    ? "SELECTION_PRESENT"
    : selectionDenominator.complete
      ? "CLEAN_ZERO_PICK"
      : selectionDenominator.state === "PARTIAL"
        ? "PARTIAL_COVERAGE_NO_SELECTION"
        : "DENOMINATOR_UNKNOWN_NO_SELECTION";
  const zeroPickDay = cohortCounts.SELECTED > 0
    ? false
    : selectionDenominator.complete
      ? true
      : null;

  const outcomeJoinBlockers = [];
  for (const row of decisions) {
    if (row.decisionHashIntegrityValid !== true) {
      outcomeJoinBlockers.push("DECISION_HASH_INTEGRITY_INVALID:" + row.decisionId);
    }
    if (row.decisionEvidenceHashIntegrityValid !== true) {
      outcomeJoinBlockers.push("DECISION_EVIDENCE_HASH_INTEGRITY_INVALID:" + row.decisionId);
    }
    if (
      row.decisionEvidenceState !== "READY"
      || row.decisionEvidenceOutcomeJoinEligible !== true
      || !/^[a-f0-9]{64}$/.test(String(row.decisionEvidenceHash || ""))
    ) {
      outcomeJoinBlockers.push("DECISION_EVIDENCE_NOT_READY:" + row.decisionId);
    }
  }
  if (!sourceReceipt) {
    outcomeJoinBlockers.push("SOURCE_SESSION_RECEIPT_NOT_PROVIDED");
  } else if (sourceReceipt.outcomeJoinSourceEligible !== true) {
    outcomeJoinBlockers.push("SOURCE_SESSION_NOT_OUTCOME_JOIN_ELIGIBLE");
  }
  if (!normalizedRunReceipts.length) {
    outcomeJoinBlockers.push("SHADOW_RUN_RECEIPT_NOT_PROVIDED");
  }
  if (!normalizedFingerprints.length) {
    outcomeJoinBlockers.push("RUN_FINGERPRINT_NOT_PROVIDED");
  }

  const runReceiptEntries = [];
  const runReceiptHashCounts = new Map();
  for (const receipt of normalizedRunReceipts) {
    const accountingHash = await sha256Hex(receipt);
    runReceiptEntries.push({ receipt, accountingHash });
    runReceiptHashCounts.set(
      accountingHash,
      (runReceiptHashCounts.get(accountingHash) || 0) + 1,
    );
  }
  for (const [hash, count] of runReceiptHashCounts) {
    if (count > 1) outcomeJoinBlockers.push("DUPLICATE_SHADOW_RUN_RECEIPT_HASH:" + hash);
  }

  const fingerprintReconciliations = [];
  const matchedRunHashes = new Set();
  const fingerprintDecisionHashCounts = new Map();
  for (const fp of normalizedFingerprints) {
    const matchingRuns = runReceiptEntries.filter(
      (entry) => entry.accountingHash === fp.shadowAccountingHash,
    );
    if (matchingRuns.length !== 1) {
      outcomeJoinBlockers.push(
        "RUN_FINGERPRINT_ACCOUNTING_RECEIPT_MATCH_COUNT:"
        + (fp.fingerprintId || fp.runFingerprintHash || "UNKNOWN")
        + ":"
        + matchingRuns.length,
      );
    }
    const matchingRun = matchingRuns.length === 1 ? matchingRuns[0] : null;
    if (matchingRun) matchedRunHashes.add(matchingRun.accountingHash);

    const reconciliation = await verifyShadowRunFingerprintV0_1({
      fingerprint: fp,
      sourceSessionReceipt: sourceReceipt,
      shadowRunReceipt: matchingRun?.receipt || null,
      decisionSnapshots,
    });
    fingerprintReconciliations.push(reconciliation);
    if (reconciliation.outcomeJoinEligible !== true) {
      outcomeJoinBlockers.push(
        "RUN_FINGERPRINT_RECONCILIATION_INCOMPLETE:"
        + (fp.fingerprintId || fp.runFingerprintHash || "UNKNOWN"),
      );
    }
    for (const blocker of reconciliation.blockers) {
      outcomeJoinBlockers.push(
        "RUN_FINGERPRINT:"
        + (fp.fingerprintId || fp.runFingerprintHash || "UNKNOWN")
        + ":"
        + blocker,
      );
    }
    for (const hash of fp.decisionHashes || []) {
      const value = String(hash);
      fingerprintDecisionHashCounts.set(
        value,
        (fingerprintDecisionHashCounts.get(value) || 0) + 1,
      );
    }
  }

  for (const entry of runReceiptEntries) {
    if (!matchedRunHashes.has(entry.accountingHash)) {
      outcomeJoinBlockers.push("SHADOW_RUN_RECEIPT_UNCOVERED:" + entry.accountingHash);
    }
  }

  for (const [hash, count] of fingerprintDecisionHashCounts) {
    if (count > 1) outcomeJoinBlockers.push("DECISION_HASH_COVERED_MULTIPLE_TIMES:" + hash);
  }
  const expectedDecisionHashes = decisions.map((row) => row.decisionHash).sort();
  const coveredDecisionHashes = [...fingerprintDecisionHashCounts.keys()].sort();
  if (
    expectedDecisionHashes.length !== coveredDecisionHashes.length
    || expectedDecisionHashes.some((hash, index) => hash !== coveredDecisionHashes[index])
  ) {
    outcomeJoinBlockers.push("PREDICTION_DECISION_HASH_CLOSED_SET_MISMATCH");
  }

  if (expectedDecisionHashes.length === 0 && normalizedFingerprints.length > 0) {
    const zeroProofReady = fingerprintReconciliations.length === normalizedFingerprints.length
      && fingerprintReconciliations.every(
        (row) => row.zeroDecisionHashProof === true && row.outcomeJoinEligible === true,
      );
    if (!zeroProofReady) {
      outcomeJoinBlockers.push("ZERO_DECISION_HASH_COVERAGE_NOT_PROVEN");
    }
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
    fingerprintReconciliations: Object.freeze(fingerprintReconciliations),
    outcomeJoinEligible: outcomeJoinBlockers.length === 0,
    outcomeJoinBlockers: Object.freeze([...new Set(outcomeJoinBlockers)]),
    selectionDenominator,
    zeroPickState,
    zeroPickDay,
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
