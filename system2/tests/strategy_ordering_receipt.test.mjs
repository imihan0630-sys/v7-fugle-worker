import assert from "node:assert/strict";
import { buildStrategyOrderingReceipt } from "../runtime/strategy_ordering_receipt.mjs";

const input = {
  orderingReceiptId: "ORD-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  purpose: "GLOBAL_ADMISSION",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  orderingPolicyId: "SM-ORDER-RESEARCH-BASELINE",
  orderingPolicyVersion: "0.1",
  orderedCandidates: [
    {
      symbol: "2330",
      decisionId: "D1",
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      strategyValidity: "VALID",
      entryReadiness: "NEAR_ENTRY",
      strategyLocalRank: null,
      reasonCodes: ["fixture"],
      warnings: [],
    },
    {
      symbol: "3008",
      decisionId: "D2",
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      strategyValidity: "VALID",
      entryReadiness: "WATCH",
      strategyLocalRank: null,
      reasonCodes: ["fixture"],
      warnings: [],
    },
  ],
  capturedAt: "2026-09-27T07:31:00Z",
};

const first = await buildStrategyOrderingReceipt(input);
const second = await buildStrategyOrderingReceipt(input);

assert.equal(first.orderingHash, second.orderingHash);
assert.deepEqual(first.orderedCandidates.map((x) => x.ordinal), [1, 2]);
assert.equal(first.candidateCount, 2);
assert.equal(Object.isFrozen(first), true);

await assert.rejects(
  () =>
    buildStrategyOrderingReceipt({
      ...input,
      orderingReceiptId: "ORD-BAD",
      orderedCandidates: [input.orderedCandidates[0], input.orderedCandidates[0]],
    }),
  /duplicate ordered symbol/,
);

console.log("System2 strategy ordering receipt tests passed");
