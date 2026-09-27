import assert from "node:assert/strict";
import { buildRank05DisplacementShadowReceipt } from "../runtime/rank05_displacement_shadow.mjs";

const membership = (strategyId, paretoTier, extra = {}) => ({
  strategyId,
  strategyVersion: "V0.1-CONTRACT",
  strategyValidity: "VALID",
  entryReadiness: "WATCH",
  decisionId: extra.decisionId || `D-${strategyId}-${paretoTier}`,
  paretoTier,
  rankingPolicyId: "SM-PARETO-BASELINE",
  rankingPolicyVersion: "0.1",
  ...extra,
});

const incumbent = {
  symbol: "A",
  candidateEpisodeId: "E-A",
  candidatePoolSessions: 5,
  memberships: [membership("SHORT_MOMENTUM", 2)],
};

const challenger = {
  symbol: "B",
  memberships: [membership("SHORT_MOMENTUM", 1)],
};

const eligible = await buildRank05DisplacementShadowReceipt({
  receiptId: "R1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  incumbent,
  challenger,
  capturedAt: "2026-09-27T07:31:00Z",
});
assert.equal(eligible.classification, "CHALLENGER_STRICTLY_BETTER_TIER");
assert.equal(eligible.shadowDisplacementEligible, true);
assert.equal(eligible.action, "SHADOW_COMPARE_ONLY");
assert.equal(eligible.outcomeAttached, false);

const sameTier = await buildRank05DisplacementShadowReceipt({
  receiptId: "R2",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  incumbent,
  challenger: {
    symbol: "C",
    memberships: [membership("SHORT_MOMENTUM", 2)],
  },
  capturedAt: "2026-09-27T07:31:00Z",
});
assert.equal(sameTier.classification, "SAME_TIER_NO_ECONOMIC_ORDER");
assert.equal(sameTier.shadowDisplacementEligible, false);

const multiIncumbent = await buildRank05DisplacementShadowReceipt({
  receiptId: "R3",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  incumbent: {
    ...incumbent,
    memberships: [
      membership("SHORT_MOMENTUM", 2),
      {
        ...membership("SWING_GROWTH", 1),
        rankingPolicyId: "SG-PARETO-BASELINE",
      },
    ],
  },
  challenger,
  capturedAt: "2026-09-27T07:31:00Z",
});
assert.equal(multiIncumbent.classification, "INCUMBENT_MULTI_STRATEGY");
assert.equal(multiIncumbent.shadowDisplacementEligible, false);

const strategyMismatch = await buildRank05DisplacementShadowReceipt({
  receiptId: "R4",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  incumbent,
  challenger: {
    symbol: "D",
    memberships: [{
      ...membership("SWING_GROWTH", 1),
      rankingPolicyId: "SG-PARETO-BASELINE",
    }],
  },
  capturedAt: "2026-09-27T07:31:00Z",
});
assert.equal(strategyMismatch.classification, "STRATEGY_MISMATCH");
assert.equal(strategyMismatch.shadowDisplacementEligible, false);

console.log("System2 RANK-05 displacement shadow tests passed");
