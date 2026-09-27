import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const CLASSIFICATIONS = new Set([
  "CHALLENGER_STRICTLY_BETTER_TIER",
  "SAME_TIER_NO_ECONOMIC_ORDER",
  "CHALLENGER_WORSE_TIER",
  "INPUT_INCOMPLETE",
  "INCUMBENT_MULTI_STRATEGY",
  "CHALLENGER_MULTI_STRATEGY",
  "STRATEGY_MISMATCH",
  "VERSION_MISMATCH",
  "STRATEGY_NOT_VALID",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function nonNegativeInteger(value, field) {
  if (!Number.isInteger(value) || value < 0) throw new Error(`${field} must be a non-negative integer`);
  return value;
}

function normalizeSide(raw, field, { incumbent = false } = {}) {
  if (!raw || typeof raw !== "object") throw new Error(`${field} is required`);
  const memberships = Array.isArray(raw.memberships) ? raw.memberships : [];
  const normalizedMemberships = memberships.map((m, i) => ({
    strategyId: requiredText(m.strategyId, `${field}.memberships[${i}].strategyId`),
    strategyVersion: requiredText(m.strategyVersion, `${field}.memberships[${i}].strategyVersion`),
    strategyValidity: requiredText(m.strategyValidity, `${field}.memberships[${i}].strategyValidity`),
    entryReadiness: requiredText(m.entryReadiness, `${field}.memberships[${i}].entryReadiness`),
    decisionId: m.decisionId ? requiredText(m.decisionId, `${field}.memberships[${i}].decisionId`) : undefined,
    paretoTier: Number.isInteger(m.paretoTier) && m.paretoTier > 0 ? m.paretoTier : null,
    rankingPolicyId: m.rankingPolicyId
      ? requiredText(m.rankingPolicyId, `${field}.memberships[${i}].rankingPolicyId`)
      : undefined,
    rankingPolicyVersion: m.rankingPolicyVersion
      ? requiredText(m.rankingPolicyVersion, `${field}.memberships[${i}].rankingPolicyVersion`)
      : undefined,
  }));

  return {
    symbol: requiredText(raw.symbol, `${field}.symbol`),
    candidateEpisodeId: incumbent
      ? requiredText(raw.candidateEpisodeId, `${field}.candidateEpisodeId`)
      : raw.candidateEpisodeId
        ? requiredText(raw.candidateEpisodeId, `${field}.candidateEpisodeId`)
        : undefined,
    candidatePoolSessions: incumbent
      ? nonNegativeInteger(raw.candidatePoolSessions, `${field}.candidatePoolSessions`)
      : Number.isInteger(raw.candidatePoolSessions) && raw.candidatePoolSessions >= 0
        ? raw.candidatePoolSessions
        : 0,
    memberships: normalizedMemberships,
  };
}

function classifyPair(incumbent, challenger) {
  if (incumbent.memberships.length !== 1) return "INCUMBENT_MULTI_STRATEGY";
  if (challenger.memberships.length !== 1) return "CHALLENGER_MULTI_STRATEGY";

  const a = incumbent.memberships[0];
  const b = challenger.memberships[0];

  if (a.strategyId !== b.strategyId) return "STRATEGY_MISMATCH";
  if (a.strategyVersion !== b.strategyVersion) return "VERSION_MISMATCH";
  if (a.strategyValidity !== "VALID" || b.strategyValidity !== "VALID") {
    return "STRATEGY_NOT_VALID";
  }
  if (!a.paretoTier || !b.paretoTier || !a.rankingPolicyId || !b.rankingPolicyId) {
    return "INPUT_INCOMPLETE";
  }
  if (
    a.rankingPolicyId !== b.rankingPolicyId ||
    a.rankingPolicyVersion !== b.rankingPolicyVersion
  ) {
    return "INPUT_INCOMPLETE";
  }

  if (b.paretoTier < a.paretoTier) return "CHALLENGER_STRICTLY_BETTER_TIER";
  if (b.paretoTier === a.paretoTier) return "SAME_TIER_NO_ECONOMIC_ORDER";
  return "CHALLENGER_WORSE_TIER";
}

export async function buildRank05DisplacementShadowReceipt({
  receiptId,
  marketDate,
  decisionTimestamp,
  incumbent,
  challenger,
  capturedAt,
} = {}) {
  const a = normalizeSide(incumbent, "incumbent", { incumbent: true });
  const b = normalizeSide(challenger, "challenger");

  if (a.symbol === b.symbol) {
    throw new Error("incumbent and challenger must be different symbols");
  }

  const classification = classifyPair(a, b);
  if (!CLASSIFICATIONS.has(classification)) throw new Error("unsupported pair classification");

  const shadowDisplacementEligible =
    classification === "CHALLENGER_STRICTLY_BETTER_TIER";

  const base = {
    receiptId: requiredText(receiptId, "receiptId"),
    experimentId: "RANK-05",
    experimentVersion: "0.1",
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    incumbent: a,
    challenger: b,
    classification,
    shadowDisplacementEligible,
    action: "SHADOW_COMPARE_ONLY",
    outcomeAttached: false,
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_RANK05_DISPLACEMENT_V0_1",
  };

  const receiptHash = await sha256Hex(base);
  return deepFreeze({ ...base, receiptHash });
}

export { CLASSIFICATIONS };
