import { deepFreeze } from "./factor_snapshot.mjs";
import { rankStrategyLocalBaseline } from "./strategy_local_ranking_baseline.mjs";
import { buildStrategyOrderingReceipt } from "./strategy_ordering_receipt.mjs";
import {
  rankGlobalAdmissionWithEntryProximity,
  rankActiveMonitorWithEntryReadiness,
} from "./strategy_local_ranking_entry_readiness.mjs";

export async function buildRank01OrderingReceipt({
  orderingReceiptId,
  purpose,
  strategyId,
  strategyVersion,
  marketDate,
  decisionTimestamp,
  candidates,
  capturedAt,
} = {}) {
  const ranking = await rankStrategyLocalBaseline({
    strategyId,
    strategyVersion,
    marketDate,
    decisionTimestamp,
    candidates,
  });

  const receipt = await buildStrategyOrderingReceipt({
    orderingReceiptId,
    marketDate,
    decisionTimestamp,
    purpose,
    strategyId,
    strategyVersion,
    orderingPolicyId: ranking.orderingPolicyId,
    orderingPolicyVersion: ranking.orderingPolicyVersion,
    orderedCandidates: ranking.ranked.map((row) => ({
      symbol: row.symbol,
      decisionId: row.decisionId,
      strategyId: row.strategyId,
      strategyVersion: row.strategyVersion,
      strategyValidity: row.strategyValidity,
      entryReadiness: row.entryReadiness,
      strategyLocalRank: row.strategyLocalRank,
      strategyLocalRankVersion: row.strategyLocalRankVersion,
      reasonCodes: [
        ...row.reasonCodes,
        `BASELINE_FAMILIES:${ranking.baselineFamilies.join("+")}`,
      ],
      warnings: [
        ...row.warnings,
        ...(row.tiedWithinTier
          ? ["WITHIN_TIER_ORDER_IS_NEUTRAL_TIEBREAK_NOT_ECONOMIC_SUPERIORITY"]
          : []),
      ],
    })),
    capturedAt,
  });

  return deepFreeze({
    ranking,
    orderingReceipt: receipt,
    unranked: ranking.unranked,
  });
}


export async function buildRank02OrderingReceipt({
  orderingReceiptId,
  purpose,
  baselineRanking,
  capturedAt,
} = {}) {
  if (!baselineRanking || typeof baselineRanking !== "object") {
    throw new Error("baselineRanking is required");
  }

  let challenger;
  if (purpose === "GLOBAL_ADMISSION") {
    challenger = rankGlobalAdmissionWithEntryProximity(baselineRanking);
  } else if (purpose === "ACTIVE_INTRADAY_MONITOR") {
    challenger = rankActiveMonitorWithEntryReadiness(baselineRanking);
  } else {
    throw new Error(`unsupported RANK-02 purpose: ${purpose}`);
  }

  const receipt = await buildStrategyOrderingReceipt({
    orderingReceiptId,
    marketDate: challenger.marketDate,
    decisionTimestamp: challenger.decisionTimestamp,
    purpose,
    strategyId: challenger.strategyId,
    strategyVersion: challenger.strategyVersion,
    orderingPolicyId: challenger.orderingPolicyId,
    orderingPolicyVersion: challenger.orderingPolicyVersion,
    orderedCandidates: challenger.ranked.map((row) => ({
      symbol: row.symbol,
      decisionId: row.decisionId,
      strategyId: row.strategyId || challenger.strategyId,
      strategyVersion: row.strategyVersion || challenger.strategyVersion,
      strategyValidity: row.strategyValidity || "VALID",
      entryReadiness: row.entryReadiness,
      strategyLocalRank: row.strategyLocalRank,
      strategyLocalRankVersion: row.strategyLocalRankVersion,
      reasonCodes: row.reasonCodes || [],
      warnings: row.warnings || [],
    })),
    capturedAt,
  });

  return deepFreeze({
    challenger,
    orderingReceipt: receipt,
  });
}
