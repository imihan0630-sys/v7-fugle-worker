import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

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

  const sourceSessionHash = requiredText(
    sourceSessionReceipt.sourceSessionHash,
    "sourceSessionReceipt.sourceSessionHash",
  );

  const shadowAccountingHash = await sha256Hex(shadowRunReceipt);
  const normalizedDecisionHashes = uniqueSorted(decisionHashes, "decisionHashes");
  const normalizedOrderingHashes = uniqueSorted(orderingHashes, "orderingHashes");
  const normalizedRankingExperimentHashes = uniqueSorted(
    rankingExperimentHashes,
    "rankingExperimentHashes",
  );
  const normalizedLifecycleHashes = uniqueSorted(lifecycleHashes, "lifecycleHashes");

  const sourceReady =
    sourceSessionReceipt.sourceSessionState === "SOURCE_SESSION_READY";
  const accountingComplete = shadowRunReceipt.runState === "COMPLETE";
  const runFingerprintState =
    sourceReady && accountingComplete ? "RUN_FINGERPRINT_COMPLETE" : "RUN_FINGERPRINT_INCOMPLETE";

  const blockers = [];
  if (!sourceReady) blockers.push("SOURCE_SESSION_INCOMPLETE");
  if (!accountingComplete) blockers.push("SHADOW_RUN_ACCOUNTING_INCOMPLETE");

  const base = {
    fingerprintId: requiredText(fingerprintId, "fingerprintId"),
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    strategyId: requiredText(strategyId, "strategyId"),
    strategyVersion: requiredText(strategyVersion, "strategyVersion"),
    shadowSpecId: requiredText(shadowSpecId, "shadowSpecId"),
    universeVersion: requiredText(universeVersion, "universeVersion"),
    sourceSessionHash,
    shadowAccountingHash,
    decisionHashes: Object.freeze(normalizedDecisionHashes),
    orderingHashes: Object.freeze(normalizedOrderingHashes),
    rankingExperimentHashes: Object.freeze(normalizedRankingExperimentHashes),
    capacityHash: capacityHash ? requiredText(capacityHash, "capacityHash") : null,
    lifecycleHashes: Object.freeze(normalizedLifecycleHashes),
    runFingerprintState,
    blockers: Object.freeze(blockers),
    outcomeJoinEligible: runFingerprintState === "RUN_FINGERPRINT_COMPLETE",
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_SHADOW_RUN_FINGERPRINT_V0_1",
  };

  const runFingerprintHash = await sha256Hex(base);
  return deepFreeze({ ...base, runFingerprintHash });
}
