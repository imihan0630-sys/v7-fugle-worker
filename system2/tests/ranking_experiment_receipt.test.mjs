import assert from "node:assert/strict";
import { buildRankingExperimentReceipt } from "../runtime/ranking_experiment_receipt.mjs";

const base = {
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  purpose: "GLOBAL_ADMISSION",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  orderingPolicyId: "SM-PARETO-BASELINE",
  orderingPolicyVersion: "0.1",
  orderingHash: "base-hash",
  orderedCandidates: [
    { symbol: "A" },
    { symbol: "B" },
    { symbol: "C" },
  ],
};

const challenger = {
  ...base,
  orderingPolicyId: "SHORT_MOMENTUM-RANK02-ENTRY-PROXIMITY",
  orderingHash: "challenger-hash",
  orderedCandidates: [
    { symbol: "B" },
    { symbol: "A" },
    { symbol: "C" },
  ],
};

const receipt = await buildRankingExperimentReceipt({
  experimentReceiptId: "RX1",
  experimentId: "RANK-02",
  experimentVersion: "0.1",
  hypothesisId: "ENTRY_READINESS_INCREMENT",
  baselineOrderingReceipt: base,
  challengerOrderingReceipt: challenger,
  capturedAt: "2026-09-27T07:32:00Z",
});

assert.equal(receipt.sameCandidateSet, true);
assert.deepEqual(receipt.commonSupportSymbols, ["A", "B", "C"]);
assert.equal(receipt.rankDeltas.find((x) => x.symbol === "A").delta, -1);
assert.equal(receipt.rankDeltas.find((x) => x.symbol === "B").delta, 1);
assert.equal(receipt.outcomeAttached, false);
assert.equal(Object.isFrozen(receipt), true);

console.log("System2 ranking experiment receipt tests passed");
