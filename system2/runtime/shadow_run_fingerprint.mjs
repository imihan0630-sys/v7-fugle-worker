import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const SHADOW_RUN_FINGERPRINT_RECONCILIATION_VERSION_V0_1 =
  "S2_SHADOW_RUN_FINGERPRINT_RECONCILIATION_V0_1";

const SHA256_RE = /^[a-f0-9]{64}$/;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function uniqueSorted(values, field) {
  if (!Array.isArray(values)) throw new Error(`${field} must be an array`);
  const out = values.map((x, i) => requiredText(String(x), `${field}[${i}]`));
  const set = new Set(out);
  if (set.size !== out.length) throw new Error(`${field} contains duplicates`);
  return [...set].sort();
}

function sameValue(value, expected, field, blockers) {
  if (typeof value !== "string" || !value.trim() || value.trim() !== expected) {
    blockers.push(field + "_MISMATCH");
    return false;
  }
  return true;
}

function exactSet(left, right) {
  if (left.length !== right.length) return false;
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((value, index) => value === b[index]);
}

function zeroDecisionHashProof(runReceipt) {
  const accounts = Array.isArray(runReceipt?.symbolAccounts) ? runReceipt.symbolAccounts : [];
  return runReceipt?.runState === "COMPLETE"
    && Number(runReceipt?.eligibleCount) === 0
    && Number(runReceipt?.accountedCount) === 0
    && accounts.length === 0;
}

async function verifySourceSessionHash(sourceSessionReceipt) {
  if (!sourceSessionReceipt || typeof sourceSessionReceipt !== "object") {
    return { valid: false, recomputedHash: null };
  }
  const claimed = typeof sourceSessionReceipt.sourceSessionHash === "string"
    ? sourceSessionReceipt.sourceSessionHash.trim()
    : "";
  if (!SHA256_RE.test(claimed)) return { valid: false, recomputedHash: null };
  const { sourceSessionHash: _ignored, ...base } = sourceSessionReceipt;
  const recomputedHash = await sha256Hex(base);
  return { valid: recomputedHash === claimed, recomputedHash };
}

function decisionIdentity(snapshot) {
  const e = snapshot?.evaluation || {};
  return {
    decisionId: requiredText(e.decisionId, "evaluation.decisionId"),
    decisionHash: requiredText(e.decisionHash, "evaluation.decisionHash"),
    strategyId: requiredText(e.strategyId, "evaluation.strategyId"),
    strategyVersion: requiredText(e.strategyVersion, "evaluation.strategyVersion"),
    shadowSpecId: requiredText(e.shadowSpecId, "evaluation.shadowSpecId"),
    marketDate: requiredText(e.marketDate, "evaluation.marketDate"),
    decisionTimestamp: requiredText(e.decisionTimestamp, "evaluation.decisionTimestamp"),
  };
}

export async function verifyShadowRunFingerprintV0_1({
  fingerprint,
  sourceSessionReceipt,
  shadowRunReceipt,
  decisionSnapshots = [],
} = {}) {
  const blockers = [];
  if (!fingerprint || typeof fingerprint !== "object") {
    return deepFreeze({
      version: SHADOW_RUN_FINGERPRINT_RECONCILIATION_VERSION_V0_1,
      state: "INCOMPLETE",
      blockers: Object.freeze(["RUN_FINGERPRINT_MISSING"]),
      outcomeJoinEligible: false,
      reconciliationHash: await sha256Hex({ blockers: ["RUN_FINGERPRINT_MISSING"] }),
    });
  }
  if (!sourceSessionReceipt || typeof sourceSessionReceipt !== "object") {
    blockers.push("SOURCE_SESSION_RECEIPT_MISSING");
  }
  if (!shadowRunReceipt || typeof shadowRunReceipt !== "object") {
    blockers.push("SHADOW_RUN_RECEIPT_MISSING");
  }
  if (!Array.isArray(decisionSnapshots)) {
    throw new Error("decisionSnapshots must be an array");
  }

  const fpHash = typeof fingerprint.runFingerprintHash === "string"
    ? fingerprint.runFingerprintHash.trim()
    : "";
  let recomputedFingerprintHash = null;
  if (!SHA256_RE.test(fpHash)) {
    blockers.push("RUN_FINGERPRINT_HASH_MISSING_OR_INVALID");
  } else {
    const { runFingerprintHash: _ignored, ...fpBase } = fingerprint;
    recomputedFingerprintHash = await sha256Hex(fpBase);
    if (recomputedFingerprintHash !== fpHash) {
      blockers.push("RUN_FINGERPRINT_HASH_MISMATCH");
    }
  }

  const date = typeof fingerprint.marketDate === "string" ? fingerprint.marketDate.trim() : "";
  const clock = typeof fingerprint.decisionTimestamp === "string"
    ? fingerprint.decisionTimestamp.trim()
    : "";
  const strategyId = typeof fingerprint.strategyId === "string" ? fingerprint.strategyId.trim() : "";
  const strategyVersion = typeof fingerprint.strategyVersion === "string"
    ? fingerprint.strategyVersion.trim()
    : "";
  const shadowSpecId = typeof fingerprint.shadowSpecId === "string"
    ? fingerprint.shadowSpecId.trim()
    : "";
  const universeVersion = typeof fingerprint.universeVersion === "string"
    ? fingerprint.universeVersion.trim()
    : "";

  if (sourceSessionReceipt) {
    sameValue(sourceSessionReceipt.marketDate, date, "SOURCE_SESSION_MARKET_DATE", blockers);
    sameValue(
      sourceSessionReceipt.decisionTimestamp,
      clock,
      "SOURCE_SESSION_DECISION_TIMESTAMP",
      blockers,
    );
    const sourceHash = await verifySourceSessionHash(sourceSessionReceipt);
    if (!sourceHash.valid) blockers.push("SOURCE_SESSION_HASH_INVALID");
    if (sourceSessionReceipt.sourceSessionHash !== fingerprint.sourceSessionHash) {
      blockers.push("SOURCE_SESSION_HASH_MISMATCH");
    }
    if (sourceSessionReceipt.sourceSessionState !== "SOURCE_SESSION_READY"
      || sourceSessionReceipt.outcomeJoinSourceEligible !== true) {
      blockers.push("SOURCE_SESSION_NOT_OUTCOME_JOIN_ELIGIBLE");
    }
  }

  let recomputedAccountingHash = null;
  if (shadowRunReceipt) {
    sameValue(shadowRunReceipt.marketDate, date, "SHADOW_RUN_MARKET_DATE", blockers);
    sameValue(
      shadowRunReceipt.decisionTimestamp,
      clock,
      "SHADOW_RUN_DECISION_TIMESTAMP",
      blockers,
    );
    sameValue(shadowRunReceipt.strategyId, strategyId, "SHADOW_RUN_STRATEGY_ID", blockers);
    sameValue(
      shadowRunReceipt.strategyVersion,
      strategyVersion,
      "SHADOW_RUN_STRATEGY_VERSION",
      blockers,
    );
    sameValue(shadowRunReceipt.shadowSpecId, shadowSpecId, "SHADOW_RUN_SPEC_ID", blockers);
    sameValue(
      shadowRunReceipt.universeVersion,
      universeVersion,
      "SHADOW_RUN_UNIVERSE_VERSION",
      blockers,
    );
    recomputedAccountingHash = await sha256Hex(shadowRunReceipt);
    if (recomputedAccountingHash !== fingerprint.shadowAccountingHash) {
      blockers.push("SHADOW_ACCOUNTING_HASH_MISMATCH");
    }
    if (shadowRunReceipt.runState !== "COMPLETE") {
      blockers.push("SHADOW_RUN_ACCOUNTING_INCOMPLETE");
    }
  }

  const declaredDecisionHashes = Array.isArray(fingerprint.decisionHashes)
    ? fingerprint.decisionHashes.map(String)
    : [];
  if (!Array.isArray(fingerprint.decisionHashes)) {
    blockers.push("DECISION_HASH_COVERAGE_MISSING");
  }
  const declaredSet = new Set(declaredDecisionHashes);
  if (declaredSet.size !== declaredDecisionHashes.length) {
    blockers.push("DECISION_HASH_COVERAGE_DUPLICATE");
  }
  for (const hash of declaredDecisionHashes) {
    if (!SHA256_RE.test(hash)) blockers.push("DECISION_HASH_INVALID:" + hash);
  }

  const partition = [];
  for (const snapshot of decisionSnapshots) {
    const row = decisionIdentity(snapshot);
    if (
      row.strategyId === strategyId
      && row.strategyVersion === strategyVersion
      && row.shadowSpecId === shadowSpecId
    ) {
      if (row.marketDate !== date) blockers.push("DECISION_MARKET_DATE_MISMATCH:" + row.decisionId);
      if (row.decisionTimestamp !== clock) {
        blockers.push("DECISION_TIMESTAMP_MISMATCH:" + row.decisionId);
      }
      partition.push(row);
    }
  }

  const expectedDecisionHashes = partition.map((x) => x.decisionHash).sort();
  if (!exactSet(declaredDecisionHashes, expectedDecisionHashes)) {
    blockers.push("DECISION_HASH_CLOSED_SET_MISMATCH");
  }

  if (shadowRunReceipt) {
    const runDecisionIds = (shadowRunReceipt.symbolAccounts || [])
      .map((row) => row?.decisionId)
      .filter((value) => typeof value === "string" && value.trim())
      .map((value) => value.trim())
      .sort();
    const expectedDecisionIds = partition.map((x) => x.decisionId).sort();
    if (!exactSet(runDecisionIds, expectedDecisionIds)) {
      blockers.push("DECISION_ID_ACCOUNTING_CLOSED_SET_MISMATCH");
    }

    const missingDecisionIdCount = (shadowRunReceipt.symbolAccounts || [])
      .filter((row) => !row?.decisionId).length;
    if (Number(shadowRunReceipt.eligibleCount || 0) > 0 && missingDecisionIdCount > 0) {
      blockers.push("ACCOUNTED_SYMBOL_DECISION_ID_MISSING");
    }
  }

  const zeroProof = declaredDecisionHashes.length === 0
    ? zeroDecisionHashProof(shadowRunReceipt)
    : false;
  if (declaredDecisionHashes.length === 0 && !zeroProof) {
    blockers.push("EMPTY_DECISION_HASHES_WITHOUT_PROVED_EMPTY_UNIVERSE");
  }

  if (fingerprint.runFingerprintState !== "RUN_FINGERPRINT_COMPLETE") {
    blockers.push("RUN_FINGERPRINT_NOT_COMPLETE");
  }
  if (fingerprint.outcomeJoinEligible !== true) {
    blockers.push("RUN_FINGERPRINT_NOT_OUTCOME_JOIN_ELIGIBLE");
  }

  const uniqueBlockers = [...new Set(blockers)].sort();
  const base = {
    version: SHADOW_RUN_FINGERPRINT_RECONCILIATION_VERSION_V0_1,
    fingerprintId: fingerprint.fingerprintId || null,
    runFingerprintHash: fpHash || null,
    recomputedFingerprintHash,
    sourceSessionHash: fingerprint.sourceSessionHash || null,
    shadowAccountingHash: fingerprint.shadowAccountingHash || null,
    recomputedAccountingHash,
    strategyId: strategyId || null,
    strategyVersion: strategyVersion || null,
    shadowSpecId: shadowSpecId || null,
    universeVersion: universeVersion || null,
    declaredDecisionHashes: Object.freeze([...declaredDecisionHashes].sort()),
    expectedDecisionHashes: Object.freeze(expectedDecisionHashes),
    zeroDecisionHashProof: zeroProof,
    blockers: Object.freeze(uniqueBlockers),
    state: uniqueBlockers.length ? "INCOMPLETE" : "READY",
    outcomeJoinEligible: uniqueBlockers.length === 0,
  };
  const reconciliationHash = await sha256Hex(base);
  return deepFreeze({ ...base, reconciliationHash });
}

export async function buildShadowRunFingerprint({
  fingerprintId,
  marketDate,
  decisionTimestamp,
  strategyId,
  strategyVersion,
  shadowSpecId,
  universeVersion,
  sourceSessionReceipt,
  shadowRunReceipt,
  decisionHashes = [],
  orderingHashes = [],
  rankingExperimentHashes = [],
  capacityHash = null,
  lifecycleHashes = [],
  capturedAt,
} = {}) {
  if (!sourceSessionReceipt || typeof sourceSessionReceipt !== "object") {
    throw new Error("sourceSessionReceipt is required");
  }
  if (!shadowRunReceipt || typeof shadowRunReceipt !== "object") {
    throw new Error("shadowRunReceipt is required");
  }

  const date = requiredText(marketDate, "marketDate");
  const clock = requiredText(decisionTimestamp, "decisionTimestamp");
  const sid = requiredText(strategyId, "strategyId");
  const version = requiredText(strategyVersion, "strategyVersion");
  const specId = requiredText(shadowSpecId, "shadowSpecId");
  const universe = requiredText(universeVersion, "universeVersion");

  const blockers = [];
  sameValue(sourceSessionReceipt.marketDate, date, "SOURCE_SESSION_MARKET_DATE", blockers);
  sameValue(sourceSessionReceipt.decisionTimestamp, clock, "SOURCE_SESSION_DECISION_TIMESTAMP", blockers);
  sameValue(shadowRunReceipt.marketDate, date, "SHADOW_RUN_MARKET_DATE", blockers);
  sameValue(shadowRunReceipt.decisionTimestamp, clock, "SHADOW_RUN_DECISION_TIMESTAMP", blockers);
  sameValue(shadowRunReceipt.strategyId, sid, "SHADOW_RUN_STRATEGY_ID", blockers);
  sameValue(shadowRunReceipt.strategyVersion, version, "SHADOW_RUN_STRATEGY_VERSION", blockers);
  sameValue(shadowRunReceipt.shadowSpecId, specId, "SHADOW_RUN_SPEC_ID", blockers);
  sameValue(shadowRunReceipt.universeVersion, universe, "SHADOW_RUN_UNIVERSE_VERSION", blockers);

  const sourceSessionHash = requiredText(
    sourceSessionReceipt.sourceSessionHash,
    "sourceSessionReceipt.sourceSessionHash",
  );
  const sourceHashCheck = await verifySourceSessionHash(sourceSessionReceipt);
  if (!sourceHashCheck.valid) blockers.push("SOURCE_SESSION_HASH_INVALID");

  const shadowAccountingHash = await sha256Hex(shadowRunReceipt);
  const normalizedDecisionHashes = uniqueSorted(decisionHashes, "decisionHashes");
  for (const hash of normalizedDecisionHashes) {
    if (!SHA256_RE.test(hash)) blockers.push("DECISION_HASH_INVALID:" + hash);
  }
  const normalizedOrderingHashes = uniqueSorted(orderingHashes, "orderingHashes");
  const normalizedRankingExperimentHashes = uniqueSorted(
    rankingExperimentHashes,
    "rankingExperimentHashes",
  );
  const normalizedLifecycleHashes = uniqueSorted(lifecycleHashes, "lifecycleHashes");

  const sourceReady =
    sourceSessionReceipt.sourceSessionState === "SOURCE_SESSION_READY"
    && sourceSessionReceipt.outcomeJoinSourceEligible === true;
  const accountingComplete = shadowRunReceipt.runState === "COMPLETE";
  if (!sourceReady) blockers.push("SOURCE_SESSION_INCOMPLETE");
  if (!accountingComplete) blockers.push("SHADOW_RUN_ACCOUNTING_INCOMPLETE");

  const accountDecisionIds = (shadowRunReceipt.symbolAccounts || [])
    .map((row) => row?.decisionId)
    .filter((value) => typeof value === "string" && value.trim());
  if (
    normalizedDecisionHashes.length === 0
    && !zeroDecisionHashProof(shadowRunReceipt)
  ) {
    blockers.push("EMPTY_DECISION_HASHES_WITHOUT_PROVED_EMPTY_UNIVERSE");
  }
  if (normalizedDecisionHashes.length > 0
    && accountDecisionIds.length !== normalizedDecisionHashes.length) {
    blockers.push("DECISION_HASH_ACCOUNTING_COUNT_MISMATCH");
  }

  const uniqueBlockers = [...new Set(blockers)].sort();
  const runFingerprintState =
    uniqueBlockers.length === 0 ? "RUN_FINGERPRINT_COMPLETE" : "RUN_FINGERPRINT_INCOMPLETE";

  const base = {
    fingerprintId: requiredText(fingerprintId, "fingerprintId"),
    marketDate: date,
    decisionTimestamp: clock,
    strategyId: sid,
    strategyVersion: version,
    shadowSpecId: specId,
    universeVersion: universe,
    sourceSessionHash,
    shadowAccountingHash,
    decisionHashes: Object.freeze(normalizedDecisionHashes),
    orderingHashes: Object.freeze(normalizedOrderingHashes),
    rankingExperimentHashes: Object.freeze(normalizedRankingExperimentHashes),
    capacityHash: capacityHash ? requiredText(capacityHash, "capacityHash") : null,
    lifecycleHashes: Object.freeze(normalizedLifecycleHashes),
    reconciliationVersion: SHADOW_RUN_FINGERPRINT_RECONCILIATION_VERSION_V0_1,
    runFingerprintState,
    blockers: Object.freeze(uniqueBlockers),
    outcomeJoinEligible: runFingerprintState === "RUN_FINGERPRINT_COMPLETE",
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_SHADOW_RUN_FINGERPRINT_V0_1",
  };

  const runFingerprintHash = await sha256Hex(base);
  return deepFreeze({ ...base, runFingerprintHash });
}
