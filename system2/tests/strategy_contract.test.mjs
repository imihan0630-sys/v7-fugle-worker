import assert from "node:assert/strict";
import { buildStrategyContract } from "../runtime/strategy_contract.mjs";
import { APPROVED_STRATEGY_CONTRACTS_V0_1 } from "../runtime/strategy_contracts_v0_1.mjs";

assert.equal(APPROVED_STRATEGY_CONTRACTS_V0_1.length, 5);

const ids = APPROVED_STRATEGY_CONTRACTS_V0_1.map((x) => x.strategyId);
assert.deepEqual(ids, [
  "SHORT_MOMENTUM",
  "SWING_GROWTH",
  "INDUSTRY_TREND",
  "EVENT_DRIVEN",
  "VALUE_REVERSION",
]);

for (const contract of APPROVED_STRATEGY_CONTRACTS_V0_1) {
  assert.equal(Object.isFrozen(contract), true);
  assert.ok(contract.evidenceFamilies.some((x) => x.role === "PRIMARY"));
  assert.ok(contract.setups.length > 0);
  assert.ok(contract.versionChangeTriggers.length > 0);
  assert.equal("weight" in contract, false);
  for (const family of contract.evidenceFamilies) {
    assert.equal("weight" in family, false);
    assert.equal("threshold" in family, false);
    assert.equal("minimumNormalizedValue" in family, false);
  }
}

assert.equal(
  APPROVED_STRATEGY_CONTRACTS_V0_1.find((x) => x.strategyId === "VALUE_REVERSION").ownerApprovalState,
  "RESEARCH_ONLY_APPROVED",
);

assert.throws(
  () =>
    buildStrategyContract({
      strategyId: "BAD_NO_PRIMARY",
      strategyVersion: "V0",
      ownerApprovalState: "OWNER_REVIEW_PENDING",
      thesis: "fixture",
      primaryHorizonSessions: [1],
      evidenceFamilies: [
        {
          family: "PRICE_VOLUME",
          role: "SUPPORTIVE",
          factorIds: [],
          dataReadiness: "READY_CURRENT",
          unknownBlocksEligibility: false,
        },
      ],
      setups: [],
      allowedRegimes: [],
      blockedRegimes: [],
      hardInvalidationIds: [],
      interactionIds: [],
      versionChangeTriggers: ["ANY_CHANGE"],
      notes: [],
    }),
  /PRIMARY/,
);

assert.throws(
  () =>
    buildStrategyContract({
      strategyId: "BAD_NUMERIC_WEIGHT",
      strategyVersion: "V0",
      ownerApprovalState: "OWNER_REVIEW_PENDING",
      thesis: "fixture",
      primaryHorizonSessions: [1],
      weight: 0.5,
      evidenceFamilies: [
        {
          family: "PRICE_VOLUME",
          role: "PRIMARY",
          factorIds: [],
          dataReadiness: "READY_CURRENT",
          unknownBlocksEligibility: false,
        },
      ],
      setups: [],
      allowedRegimes: [],
      blockedRegimes: [],
      hardInvalidationIds: [],
      interactionIds: [],
      versionChangeTriggers: ["ANY_CHANGE"],
      notes: [],
    }),
  /must not freeze numeric scoring field/,
);

console.log("System2 strategy contract tests passed");
