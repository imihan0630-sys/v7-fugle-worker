import { deepFreeze } from "./factor_snapshot.mjs";

const REQUIRED_FIELDS = Object.freeze({
  SHORT_MOMENTUM: [
    "taiwanIndexState",
    "breadthState",
    "sectorRotationState",
    "volatilityState",
  ],
  SWING_GROWTH: [
    "taiwanIndexState",
    "sectorRotationState",
    "volatilityState",
  ],
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

export function buildRank04RegimeReadinessReceipt({
  receiptId,
  strategyId,
  strategyVersion,
  marketDate,
  decisionTimestamp,
  regimeSnapshot,
  marketSegment = "UNKNOWN",
  tpexState = "UNKNOWN",
  assessedAt,
} = {}) {
  const id = requiredText(strategyId, "strategyId");
  const requiredFields = REQUIRED_FIELDS[id];
  if (!requiredFields) throw new Error(`unsupported RANK-04 strategy: ${id}`);
  if (!regimeSnapshot || typeof regimeSnapshot !== "object") {
    throw new Error("regimeSnapshot is required");
  }

  const missingFields = [];
  for (const field of requiredFields) {
    if (regimeSnapshot[field] !== "KNOWN") {
      missingFields.push(field);
    }
  }

  const segment = requiredText(marketSegment, "marketSegment");
  if (segment === "TPEX" && tpexState !== "KNOWN") {
    missingFields.push("tpexState");
  }

  const state = missingFields.length ? "REGIME_INCOMPLETE" : "REGIME_READY";

  return deepFreeze({
    receiptId: requiredText(receiptId, "receiptId"),
    strategyId: id,
    strategyVersion: requiredText(strategyVersion, "strategyVersion"),
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    regimeSnapshotId: requiredText(
      regimeSnapshot.regimeSnapshotId,
      "regimeSnapshot.regimeSnapshotId",
    ),
    marketSegment: segment,
    tpexState,
    requiredFields: Object.freeze([...requiredFields]),
    missingFields: Object.freeze(missingFields),
    state,
    rankingChallengerEligible: state === "REGIME_READY",
    reasons: Object.freeze(
      missingFields.map((field) => `REGIME_REQUIRED_FIELD_NOT_KNOWN:${field}`),
    ),
    assessedAt: requiredText(assessedAt, "assessedAt"),
    schemaVersion: "S2_RANK04_REGIME_READINESS_V0_1",
  });
}

export { REQUIRED_FIELDS };
