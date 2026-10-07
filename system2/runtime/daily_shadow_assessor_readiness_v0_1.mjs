import { deepFreeze } from "./factor_snapshot.mjs";
import { STAGE1_ASSESSOR_POLICIES_V0_1 } from "./stage1_assessor_policies_v0_1.mjs";

export const DAILY_SHADOW_ASSESSOR_READINESS_VERSION = "0.2-LAUNCH";

const POLICIES = deepFreeze(Object.fromEntries(
  Object.entries(STAGE1_ASSESSOR_POLICIES_V0_1).map(([strategyId, policy]) => [
    strategyId,
    {
      strategyId: policy.strategyId,
      strategyVersion: policy.strategyVersion,
      assessorPolicyId: policy.assessorPolicyId,
      assessorPolicyVersion: policy.assessorPolicyVersion,
      state: "READY",
      requiredFamilies: policy.requiredFamilies,
      requiredUpstreamFamilyAdapters: policy.requiredUpstreamFamilyAdapters || [],
      reasonCodes: [
        "OWNER_DIRECTIVE_SYSTEM2_GO_LIVE_PROJECT_P0",
        "SMALLEST_FALSIFIABLE_LAUNCH_POLICY_FROZEN",
        ...(strategyId === "SWING_GROWTH"
          ? ["PIT_FUNDAMENTAL_INDUSTRY_INPUTS_STILL_REQUIRED_AT_EVALUATION_TIME"]
          : []),
      ],
      permittedAction: "AUTHORIZED_SHADOW_EVALUATION_ONLY",
      finalSelectionEnabled: false,
      livePushEnabled: false,
      capitalImpact: false,
      orderImpact: false,
      system1RuntimeRequired: false,
      system1Top6Required: false,
      system1RankRequired: false,
    },
  ]),
));

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
      assessorPolicyId: null,
      assessorPolicyVersion: null,
      state: "ASSESSOR_NOT_REGISTERED",
      requiredFamilies: Object.freeze([]),
      requiredUpstreamFamilyAdapters: Object.freeze([]),
      reasonCodes: Object.freeze(["NO_DAILY_SHADOW_ASSESSOR_REGISTRY_ENTRY"]),
      permittedAction: "BLOCK_STRATEGY_EVALUATION",
      finalSelectionEnabled: false,
      livePushEnabled: false,
      capitalImpact: false,
      orderImpact: false,
      system1RuntimeRequired: false,
      system1Top6Required: false,
      system1RankRequired: false,
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
