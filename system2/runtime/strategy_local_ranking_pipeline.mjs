import { deepFreeze } from "./factor_snapshot.mjs";
import { rankStrategyLocalBaseline } from "./strategy_local_ranking_baseline.mjs";
import { buildStrategyOrderingReceipt } from "./strategy_ordering_receipt.mjs";

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
