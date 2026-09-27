import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function symbolOrder(receipt) {
  return (receipt?.orderedCandidates || []).map((x) => String(x.symbol));
}

function assertComparable(base, challenger) {
  for (const field of ["marketDate", "decisionTimestamp", "strategyId", "strategyVersion", "purpose"]) {
    if (base?.[field] !== challenger?.[field]) {
      throw new Error(`ranking receipts mismatch on ${field}`);
    }
  }
}

export async function buildRankingExperimentReceipt({
  experimentReceiptId,
  experimentId,
  experimentVersion,
  hypothesisId,
  baselineOrderingReceipt,
  challengerOrderingReceipt,
  capturedAt,
} = {}) {
  if (!baselineOrderingReceipt || !challengerOrderingReceipt) {
    throw new Error("both baseline and challenger ordering receipts are required");
  }

  assertComparable(baselineOrderingReceipt, challengerOrderingReceipt);

  const baselineSymbols = symbolOrder(baselineOrderingReceipt);
  const challengerSymbols = symbolOrder(challengerOrderingReceipt);
  const baselineSet = new Set(baselineSymbols);
  const challengerSet = new Set(challengerSymbols);

  const commonSupportSymbols = baselineSymbols.filter((x) => challengerSet.has(x));
  const baselineOnlySymbols = baselineSymbols.filter((x) => !challengerSet.has(x));
  const challengerOnlySymbols = challengerSymbols.filter((x) => !baselineSet.has(x));

  const baselineRank = new Map(baselineSymbols.map((x, i) => [x, i + 1]));
  const challengerRank = new Map(challengerSymbols.map((x, i) => [x, i + 1]));

  const rankDeltas = commonSupportSymbols.map((symbol) => ({
    symbol,
    baselineRank: baselineRank.get(symbol),
    challengerRank: challengerRank.get(symbol),
    delta: baselineRank.get(symbol) - challengerRank.get(symbol),
  }));

  const sameCandidateSet =
    baselineOnlySymbols.length === 0 && challengerOnlySymbols.length === 0;

  const base = {
    experimentReceiptId: requiredText(experimentReceiptId, "experimentReceiptId"),
    experimentId: requiredText(experimentId, "experimentId"),
    experimentVersion: requiredText(experimentVersion, "experimentVersion"),
    hypothesisId: requiredText(hypothesisId, "hypothesisId"),
    marketDate: requiredText(baselineOrderingReceipt.marketDate, "marketDate"),
    decisionTimestamp: requiredText(
      baselineOrderingReceipt.decisionTimestamp,
      "decisionTimestamp",
    ),
    purpose: requiredText(baselineOrderingReceipt.purpose, "purpose"),
    strategyId: requiredText(baselineOrderingReceipt.strategyId, "strategyId"),
    strategyVersion: requiredText(
      baselineOrderingReceipt.strategyVersion,
      "strategyVersion",
    ),
    baselinePolicyId: requiredText(
      baselineOrderingReceipt.orderingPolicyId,
      "baselinePolicyId",
    ),
    baselinePolicyVersion: requiredText(
      baselineOrderingReceipt.orderingPolicyVersion,
      "baselinePolicyVersion",
    ),
    baselineOrderingHash: requiredText(
      baselineOrderingReceipt.orderingHash,
      "baselineOrderingHash",
    ),
    challengerPolicyId: requiredText(
      challengerOrderingReceipt.orderingPolicyId,
      "challengerPolicyId",
    ),
    challengerPolicyVersion: requiredText(
      challengerOrderingReceipt.orderingPolicyVersion,
      "challengerPolicyVersion",
    ),
    challengerOrderingHash: requiredText(
      challengerOrderingReceipt.orderingHash,
      "challengerOrderingHash",
    ),
    sameCandidateSet,
    commonSupportSymbols: Object.freeze(commonSupportSymbols),
    baselineOnlySymbols: Object.freeze(baselineOnlySymbols),
    challengerOnlySymbols: Object.freeze(challengerOnlySymbols),
    rankDeltas: Object.freeze(rankDeltas),
    outcomeAttached: false,
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_RANKING_EXPERIMENT_V0_1",
  };

  const experimentHash = await sha256Hex(base);
  return deepFreeze({ ...base, experimentHash });
}
