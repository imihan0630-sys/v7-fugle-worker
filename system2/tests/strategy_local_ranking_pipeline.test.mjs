import assert from "node:assert/strict";
import { buildRank01OrderingReceipt, buildRank02OrderingReceipt } from "../runtime/strategy_local_ranking_pipeline.mjs";

const fam = (thesisState) => ({ observationState: "KNOWN", thesisState });

const result = await buildRank01OrderingReceipt({
  orderingReceiptId: "ORD-RANK01-1",
  purpose: "GLOBAL_ADMISSION",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  candidates: [
    {
      symbol: "2330",
      decisionId: "D1",
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      strategyValidity: "VALID",
      entryReadiness: "WATCH",
      familyAssessments: {
        TECHNICAL_STRUCTURE: fam("SUPPORTIVE"),
        PRICE_VOLUME: fam("SUPPORTIVE"),
        RISK_FRICTION: fam("NEUTRAL"),
      },
    },
    {
      symbol: "3008",
      decisionId: "D2",
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      strategyValidity: "VALID",
      entryReadiness: "NEAR_ENTRY",
      familyAssessments: {
        TECHNICAL_STRUCTURE: fam("SUPPORTIVE"),
        PRICE_VOLUME: fam("NEUTRAL"),
        RISK_FRICTION: fam("NEUTRAL"),
      },
    },
  ],
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(result.orderingReceipt.orderingPolicyId, "SM-PARETO-BASELINE");
assert.equal(result.orderingReceipt.candidateCount, 2);
assert.equal(result.orderingReceipt.orderedCandidates[0].strategyLocalRank, 1);
assert.equal(result.ranking.noNumericScore, true);

const rank02 = await buildRank02OrderingReceipt({
  orderingReceiptId: "ORD-RANK02-1",
  purpose: "GLOBAL_ADMISSION",
  baselineRanking: result.ranking,
  capturedAt: "2026-09-27T07:32:00Z",
});

assert.equal(rank02.orderingReceipt.orderingPolicyId, "SHORT_MOMENTUM-RANK02-ENTRY-PROXIMITY");
assert.equal(rank02.orderingReceipt.candidateCount, 2);

console.log("System2 RANK-01/RANK-02 ordering pipeline tests passed");
