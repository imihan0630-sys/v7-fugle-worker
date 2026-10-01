import { deepFreeze } from "./factor_snapshot.mjs";

export const DAILY_SHADOW_ASSESSOR_READINESS_VERSION = "0.1-RESEARCH";

const POLICIES = deepFreeze({
  SHORT_MOMENTUM: {
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    state: "ASSESSOR_POLICY_NOT_FROZEN",
    requiredFamilies: ["TECHNICAL_STRUCTURE", "PRICE_VOLUME", "RISK_FRICTION"],
    reasonCodes: [
      "NO_PREREGISTERED_SETUP_LEVEL_THRESHOLDS",
      "NO_OWNER_APPROVED_ENTRY_READINESS_MAPPING",
    ],
    permittedAction: "OBSERVE_INPUT_READINESS_ONLY",
  },
  SWING_GROWTH: {
    strategyId: "SWING_GROWTH",
    strategyVersion: "V0.1-CONTRACT",
    state: "ASSESSOR_POLICY_NOT_FROZEN",
    requiredFamilies: ["INDUSTRY_THESIS", "FUNDAMENTAL_QUALITY"],
    reasonCodes: [
      "NO_PREREGISTERED_SETUP_LEVEL_THRESHOLDS",
      "NO_OWNER_APPROVED_ENTRY_READINESS_MAPPING",
      "REQUIRED_FUNDAMENTAL_INDUSTRY_ASSESSOR_NOT_WIRED",
    ],
    permittedAction: "OBSERVE_INPUT_READINESS_ONLY",
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

export function resolveDailyShadowAssessorReadinessV0_1(strategyId) {
  const id = requiredText(strategyId, "strategyId");
  const policy = POLICIES[id];
  if (!policy) {
    return deepFreeze({
      strategyId: id,
      strategyVersion: null,
      state: "ASSESSOR_NOT_REGISTERED",
      requiredFamilies: Object.freeze([]),
      reasonCodes: Object.freeze(["NO_DAILY_SHADOW_ASSESSOR_REGISTRY_ENTRY"]),
      permittedAction: "BLOCK_STRATEGY_EVALUATION",
    });
  }
  return policy;
}

export function assertDailyShadowAssessorAuthorizedV0_1(strategyId) {
  const policy = resolveDailyShadowAssessorReadinessV0_1(strategyId);
  if (policy.state !== "READY") {
    throw new Error(
      `DAILY_SHADOW_ASSESSOR_NOT_AUTHORIZED:${policy.strategyId}:${policy.state}`,
    );
  }
  return policy;
}

export function dailyShadowAssessorRegistryV0_1() {
  return POLICIES;
}
