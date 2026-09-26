import { deepFreeze } from "./factor_snapshot.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function canonicalStringify(value) {
  return JSON.stringify(canonicalize(value));
}

export async function sha256Hex(value) {
  const text = typeof value === "string" ? value : canonicalStringify(value);
  const bytes = new TextEncoder().encode(text);

  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(bytes).digest("hex");
}

export async function buildFrozenDecisionSnapshot(input) {
  if (!input || typeof input !== "object") throw new Error("decision snapshot input is required");

  const evaluation = input.evaluation || {};
  const marketDate = requiredText(evaluation.marketDate, "evaluation.marketDate");
  const symbol = requiredText(evaluation.symbol, "evaluation.symbol");
  const strategyId = requiredText(evaluation.strategyId, "evaluation.strategyId");
  const strategyVersion = requiredText(evaluation.strategyVersion, "evaluation.strategyVersion");
  const state = requiredText(evaluation.state, "evaluation.state");

  const allowedStates = new Set([
    "SELECTED",
    "QUALIFIED_NOT_SELECTED",
    "REJECTED",
    "INCOMPLETE",
    "WATCH",
  ]);
  if (!allowedStates.has(state)) throw new Error(`unsupported decision state: ${state}`);

  const missingRequiredFactors = [...(evaluation.missingRequiredFactors || [])].map(String);
  if (state === "SELECTED" && missingRequiredFactors.length) {
    throw new Error("SELECTED decision cannot have missing required factors");
  }

  const factorObservations = [...(input.factorObservations || [])];
  for (const factor of factorObservations) {
    if (factor.scope === "SYMBOL" && factor.scopeKey !== symbol) {
      throw new Error("symbol factor does not match decision symbol");
    }
    if (factor.marketDate !== marketDate) {
      throw new Error("factor marketDate does not match decision marketDate");
    }
  }

  const regime = input.regime || {};
  if (regime.marketDate !== marketDate) {
    throw new Error("regime marketDate does not match decision marketDate");
  }

  const frozenAt = requiredText(input.frozenAt, "frozenAt");
  if (!Number.isFinite(Date.parse(frozenAt))) throw new Error("frozenAt must be a timestamp");

  const evaluationWithoutHash = {
    ...evaluation,
    decisionId: requiredText(evaluation.decisionId, "evaluation.decisionId"),
    decisionTimestamp: requiredText(evaluation.decisionTimestamp, "evaluation.decisionTimestamp"),
    strategyId,
    strategyVersion,
    symbol,
    marketDate,
    state,
    rank: Number.isFinite(evaluation.rank) ? evaluation.rank : null,
    totalScore: Number.isFinite(evaluation.totalScore) ? evaluation.totalScore : null,
    factorRefs: [...(evaluation.factorRefs || [])].map(String),
    interactionRefs: [...(evaluation.interactionRefs || [])].map(String),
    regimeSnapshotId: requiredText(evaluation.regimeSnapshotId, "evaluation.regimeSnapshotId"),
    reasons: [...(evaluation.reasons || [])].map(String),
    warnings: [...(evaluation.warnings || [])].map(String),
    missingRequiredFactors,
    invalidationConditions: [...(evaluation.invalidationConditions || [])].map(String),
  };
  delete evaluationWithoutHash.decisionHash;

  const baseRecord = {
    evaluation: evaluationWithoutHash,
    entryPlan: input.entryPlan || {},
    factorObservations,
    interactionObservations: [...(input.interactionObservations || [])],
    regime,
    frozenAt,
    schemaVersion: "S2_DECISION_V0_1",
  };

  const decisionHash = await sha256Hex(baseRecord);

  return deepFreeze({
    ...baseRecord,
    evaluation: {
      ...evaluationWithoutHash,
      decisionHash,
    },
  });
}
