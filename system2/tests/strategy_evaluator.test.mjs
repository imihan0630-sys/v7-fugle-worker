import assert from "node:assert/strict";
import { buildStrategyStateAssessment } from "../runtime/strategy_evaluator.mjs";
import { SHORT_MOMENTUM_CONTRACT_V0_1 } from "../runtime/strategy_contracts_v0_1.mjs";

const allKnown = Object.fromEntries(
  SHORT_MOMENTUM_CONTRACT_V0_1.evidenceFamilies.map((x) => [
    x.family,
    {
      observationState: "KNOWN",
      thesisState: x.role === "PRIMARY" ? "SUPPORTIVE" : "NEUTRAL",
      reasons: ["fixture"],
      warnings: [],
    },
  ]),
);

const valid = buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1, {
  familyAssessments: allKnown,
  entryReadiness: "BUY_ELIGIBLE",
});
assert.equal(valid.strategyValidity, "VALID");
assert.equal(valid.entryReadiness, "BUY_ELIGIBLE");
assert.equal(Object.isFrozen(valid), true);

const incomplete = buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1, {
  familyAssessments: {
    ...allKnown,
    PRICE_VOLUME: {
      observationState: "UNKNOWN",
      thesisState: "INDETERMINATE",
      reasons: ["missing source"],
      warnings: [],
    },
  },
  entryReadiness: "BUY_ELIGIBLE",
});
assert.equal(incomplete.strategyValidity, "INCOMPLETE");
assert.equal(incomplete.entryReadiness, "BLOCKED");
assert.ok(incomplete.missingRequiredEvidence.some((x) => x.family === "PRICE_VOLUME"));

const invalidated = buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1, {
  familyAssessments: allKnown,
  activeHardInvalidationIds: ["FAILED_BREAKOUT"],
  entryReadiness: "NEAR_ENTRY",
});
assert.equal(invalidated.strategyValidity, "INVALIDATED");
assert.equal(invalidated.entryReadiness, "BLOCKED");

const weakening = buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1, {
  familyAssessments: {
    ...allKnown,
    TECHNICAL_STRUCTURE: {
      observationState: "KNOWN",
      thesisState: "ADVERSE",
      reasons: ["structure weakening"],
      warnings: [],
    },
  },
  entryReadiness: "BUY_ELIGIBLE",
});
assert.equal(weakening.strategyValidity, "WEAKENING");
assert.equal(weakening.entryReadiness, "WAIT");

const conflict = buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1, {
  familyAssessments: allKnown,
  entryReadiness: "BUY_ELIGIBLE",
  conflicts: ["TECHNICAL_VS_PRICE_VOLUME"],
});
assert.equal(conflict.strategyValidity, "VALID");
assert.equal(conflict.entryReadiness, "CONFLICT");

console.log("System2 strategy evaluator tests passed");
