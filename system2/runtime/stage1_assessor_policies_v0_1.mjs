import { deepFreeze } from "./factor_snapshot.mjs";

export const SYSTEM2_STAGE1_ASSESSOR_POLICY_VERSION = "0.1-LAUNCH";

export const STAGE1_ASSESSOR_POLICIES_V0_1 = deepFreeze({
  SHORT_MOMENTUM: {
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    assessorPolicyId: "S2-ASSESSOR-SM-LAUNCH-001",
    assessorPolicyVersion: SYSTEM2_STAGE1_ASSESSOR_POLICY_VERSION,
    state: "READY",
    sourceClass: "A1_PIT_HISTORY_RELATIONAL_RULES",
    requiredFamilies: ["TECHNICAL_STRUCTURE", "PRICE_VOLUME", "RISK_FRICTION"],
    rules: [
      "NO_WEIGHTED_TOTAL_SCORE",
      "NO_OUTCOME_TUNED_NUMERIC_THRESHOLD",
      "RELATIONAL_MA_ORDER_ONLY",
      "NATURAL_ZERO_RETURN_AND_SLOPE_REFERENCE",
      "NATURAL_RELATIVE_VOLUME_ONE_REFERENCE",
      "BREAKOUT_RELATIVE_TO_PRIOR_HIGH20",
      "UNKNOWN_BLOCKS_REQUIRED_FAMILY",
    ],
  },
  SWING_GROWTH: {
    strategyId: "SWING_GROWTH",
    strategyVersion: "V0.1-CONTRACT",
    assessorPolicyId: "S2-ASSESSOR-SG-LAUNCH-001",
    assessorPolicyVersion: SYSTEM2_STAGE1_ASSESSOR_POLICY_VERSION,
    state: "READY",
    sourceClass: "PIT_FAMILY_STATE_PASSTHROUGH_PLUS_A1_TIMING",
    requiredFamilies: ["INDUSTRY_THESIS", "FUNDAMENTAL_QUALITY"],
    requiredUpstreamFamilyAdapters: ["INDUSTRY_THESIS", "FUNDAMENTAL_QUALITY"],
    rules: [
      "NO_WEIGHTED_TOTAL_SCORE",
      "NO_RAW_FUNDAMENTAL_PROXY_IMPUTATION",
      "NO_RAW_INDUSTRY_PROXY_IMPUTATION",
      "UNKNOWN_REQUIRED_FAMILY_BLOCKS",
      "A1_TIMING_CANNOT_CREATE_GROWTH_THESIS",
    ],
  },
});

function factorMap(factorBundle) {
  const rows = Array.isArray(factorBundle?.factorObservations)
    ? factorBundle.factorObservations
    : [];
  return new Map(rows.map((row) => [row.factorId, row]));
}

function unknownFamily(family, reasons) {
  return {
    family,
    observationState: "UNKNOWN",
    thesisState: "INDETERMINATE",
    reasons: Object.freeze([...(reasons || ["REQUIRED_FACTOR_UNKNOWN"])]),
    warnings: Object.freeze([]),
  };
}

function knownFamily(family, thesisState, reasons, warnings = []) {
  return {
    family,
    observationState: "KNOWN",
    thesisState,
    reasons: Object.freeze([...(reasons || [])]),
    warnings: Object.freeze([...(warnings || [])]),
  };
}

function observationKnown(map, factorId) {
  return map.get(factorId)?.state === "KNOWN";
}

function raw(map, factorId) {
  return map.get(factorId)?.rawValue || null;
}

function familyFromExternal(input, family) {
  const row = input?.[family];
  if (!row) return unknownFamily(family, ["PIT_UPSTREAM_FAMILY_ASSESSMENT_MISSING"]);
  const observationState = String(row.observationState || "UNKNOWN");
  const thesisState = String(row.thesisState || "INDETERMINATE");
  if (!["KNOWN", "UNKNOWN", "STALE", "INVALID", "NOT_APPLICABLE"].includes(observationState)) {
    return unknownFamily(family, ["UPSTREAM_FAMILY_OBSERVATION_STATE_INVALID"]);
  }
  if (!["SUPPORTIVE", "NEUTRAL", "ADVERSE", "INDETERMINATE"].includes(thesisState)) {
    return unknownFamily(family, ["UPSTREAM_FAMILY_THESIS_STATE_INVALID"]);
  }
  if (observationState !== "KNOWN") {
    return {
      family,
      observationState,
      thesisState: "INDETERMINATE",
      reasons: Object.freeze([...(row.reasons || ["UPSTREAM_FAMILY_NOT_KNOWN"])]),
      warnings: Object.freeze([...(row.warnings || [])]),
    };
  }
  return {
    family,
    observationState: "KNOWN",
    thesisState,
    reasons: Object.freeze([...(row.reasons || ["PIT_UPSTREAM_FAMILY_ASSESSMENT"])]),
    warnings: Object.freeze([...(row.warnings || [])]),
  };
}

function buildShortMomentumA1Families(factorBundle) {
  const map = factorMap(factorBundle);
  const core = factorBundle?.coreMetrics || {};

  const techRequired = ["TECH.TREND", "TECH.STRUCTURE"];
  const pvRequired = ["PV.RELATIVE_VOLUME", "PV.ACCEPTANCE", "PV.RESPONSE"];
  const riskRequired = ["RISK.LIQUIDITY", "RISK.EXTENSION"];

  let technical;
  if (!techRequired.every((id) => observationKnown(map, id))) {
    technical = unknownFamily("TECHNICAL_STRUCTURE", ["A1_TECHNICAL_REQUIRED_FACTOR_UNKNOWN"]);
  } else {
    const trend = raw(map, "TECH.TREND") || {};
    const structure = raw(map, "TECH.STRUCTURE") || {};
    const supportive =
      trend.maOrder5gt10gt20 === true &&
      Number(trend.ma20Slope1Pct) > 0 &&
      Number(trend.ret20) > 0 &&
      Number(structure.distanceToMa20) >= 0;
    const adverse =
      Number(trend.ma20Slope1Pct) < 0 &&
      Number(trend.ret20) < 0 &&
      Number(structure.distanceToMa20) < 0;
    technical = knownFamily(
      "TECHNICAL_STRUCTURE",
      supportive ? "SUPPORTIVE" : adverse ? "ADVERSE" : "NEUTRAL",
      supportive
        ? ["MA_ORDER_UP_AND_MA20_SLOPE_POSITIVE_AND_RET20_POSITIVE"]
        : adverse
          ? ["MA20_SLOPE_NEGATIVE_AND_RET20_NEGATIVE_AND_BELOW_MA20"]
          : ["TECHNICAL_RELATIONAL_RULES_MIXED_OR_NEUTRAL"],
    );
  }

  let priceVolume;
  if (!pvRequired.every((id) => observationKnown(map, id))) {
    priceVolume = unknownFamily("PRICE_VOLUME", ["A1_PRICE_VOLUME_REQUIRED_FACTOR_UNKNOWN"]);
  } else {
    const volume = raw(map, "PV.RELATIVE_VOLUME") || {};
    const acceptance = raw(map, "PV.ACCEPTANCE") || {};
    const response = raw(map, "PV.RESPONSE") || {};
    const breakoutAcceptance =
      Number(acceptance.distanceToPriorHigh20) >= 0 &&
      Number(volume.relativeVolume20Prior) >= 1 &&
      Number(response.ret20) > 0;
    priceVolume = knownFamily(
      "PRICE_VOLUME",
      breakoutAcceptance ? "SUPPORTIVE" : "NEUTRAL",
      breakoutAcceptance
        ? ["PRIOR_HIGH20_ACCEPTED_WITH_AT_OR_ABOVE_20D_AVG_VOLUME"]
        : ["NO_SOURCE_HONEST_BREAKOUT_ACCEPTANCE"],
    );
  }

  let risk;
  if (!riskRequired.every((id) => observationKnown(map, id))) {
    risk = unknownFamily("RISK_FRICTION", ["A1_RISK_REQUIRED_FACTOR_UNKNOWN"]);
  } else {
    const liquidity = raw(map, "RISK.LIQUIDITY") || {};
    const severeIlliquidity =
      !(Number(liquidity.avgVolume20PriorLots) > 0) ||
      !(Number(liquidity.avgAmount20Prior) > 0);
    risk = knownFamily(
      "RISK_FRICTION",
      severeIlliquidity ? "ADVERSE" : "NEUTRAL",
      severeIlliquidity ? ["ZERO_OR_INVALID_20D_LIQUIDITY_BASE"] : ["LIQUIDITY_BASE_POSITIVE_EXTENSION_THRESHOLD_NOT_INVENTED"],
    );
  }

  const activeHardInvalidationIds = [];
  if (
    Number.isFinite(Number(core.close)) &&
    Number.isFinite(Number(core.priorLow20)) &&
    Number(core.close) < Number(core.priorLow20)
  ) {
    activeHardInvalidationIds.push("BROKEN_ACTIVE_STRUCTURE");
  }
  if (
    Number.isFinite(Number(core.high)) &&
    Number.isFinite(Number(core.close)) &&
    Number.isFinite(Number(core.priorHigh20)) &&
    Number(core.high) > Number(core.priorHigh20) &&
    Number(core.close) < Number(core.priorHigh20)
  ) {
    activeHardInvalidationIds.push("FAILED_BREAKOUT");
  }
  if (risk.observationState === "KNOWN" && risk.thesisState === "ADVERSE") {
    activeHardInvalidationIds.push("SEVERE_ILLIQUIDITY");
  }

  const buyEligible =
    technical.observationState === "KNOWN" &&
    technical.thesisState === "SUPPORTIVE" &&
    priceVolume.observationState === "KNOWN" &&
    priceVolume.thesisState === "SUPPORTIVE" &&
    risk.observationState === "KNOWN" &&
    risk.thesisState !== "ADVERSE" &&
    activeHardInvalidationIds.length === 0;

  const activeMonitor =
    !buyEligible &&
    technical.observationState === "KNOWN" &&
    technical.thesisState === "SUPPORTIVE" &&
    risk.observationState === "KNOWN" &&
    risk.thesisState !== "ADVERSE" &&
    activeHardInvalidationIds.length === 0;

  return {
    familyAssessments: {
      TECHNICAL_STRUCTURE: technical,
      PRICE_VOLUME: priceVolume,
      RISK_FRICTION: risk,
      MARKET_REGIME: unknownFamily("MARKET_REGIME", ["VALIDATED_REGIME_SOURCES_NOT_WIRED"]),
      CAPITAL_FLOW: unknownFamily("CAPITAL_FLOW", ["SUPPORTIVE_CONTEXT_NOT_REQUIRED_FOR_LAUNCH_POLICY"]),
      FUNDAMENTAL_QUALITY: unknownFamily("FUNDAMENTAL_QUALITY", ["CONTEXT_ONLY_NOT_REQUIRED_FOR_LAUNCH_POLICY"]),
    },
    entryReadiness: buyEligible ? "BUY_ELIGIBLE" : activeMonitor ? "ACTIVE_ENTRY_MONITOR" : "WATCH",
    activeHardInvalidationIds,
    reasons: Object.freeze([
      "SHORT_MOMENTUM_LAUNCH_ASSESSOR_0_1",
      buyEligible ? "BREAKOUT_CONTINUATION_BUY_ELIGIBLE" : activeMonitor ? "TECHNICAL_SUPPORT_ACTIVE_MONITOR" : "WATCH_NO_BREAKOUT_ACCEPTANCE",
    ]),
    warnings: Object.freeze([
      "NO_EXTENSION_NUMERIC_THRESHOLD_FROZEN",
      "NO_SYSTEM1_AB_OR_TOP6_DEPENDENCY",
    ]),
  };
}

function buildSwingGrowthFamilies(factorBundle, externalFamilyAssessments) {
  const a1 = buildShortMomentumA1Families(factorBundle);
  const industry = familyFromExternal(externalFamilyAssessments, "INDUSTRY_THESIS");
  const fundamental = familyFromExternal(externalFamilyAssessments, "FUNDAMENTAL_QUALITY");

  const requiredKnown =
    industry.observationState === "KNOWN" &&
    fundamental.observationState === "KNOWN";
  const requiredSupportive =
    requiredKnown &&
    industry.thesisState === "SUPPORTIVE" &&
    fundamental.thesisState === "SUPPORTIVE";
  const timingSupportive =
    a1.familyAssessments.TECHNICAL_STRUCTURE.observationState === "KNOWN" &&
    a1.familyAssessments.TECHNICAL_STRUCTURE.thesisState === "SUPPORTIVE" &&
    a1.familyAssessments.PRICE_VOLUME.observationState === "KNOWN" &&
    a1.familyAssessments.PRICE_VOLUME.thesisState === "SUPPORTIVE";

  return {
    familyAssessments: {
      INDUSTRY_THESIS: industry,
      FUNDAMENTAL_QUALITY: fundamental,
      EVENT_CATALYST: familyFromExternal(externalFamilyAssessments, "EVENT_CATALYST"),
      VALUATION: familyFromExternal(externalFamilyAssessments, "VALUATION"),
      TECHNICAL_STRUCTURE: a1.familyAssessments.TECHNICAL_STRUCTURE,
      PRICE_VOLUME: a1.familyAssessments.PRICE_VOLUME,
      CHIP_OWNERSHIP: familyFromExternal(externalFamilyAssessments, "CHIP_OWNERSHIP"),
    },
    entryReadiness: requiredSupportive && timingSupportive ? "BUY_ELIGIBLE" : "WATCH",
    activeHardInvalidationIds: Object.freeze([]),
    reasons: Object.freeze([
      "SWING_GROWTH_LAUNCH_ASSESSOR_0_1",
      requiredSupportive && timingSupportive
        ? "PIT_GROWTH_THESIS_PLUS_A1_TIMING_BUY_ELIGIBLE"
        : requiredKnown
          ? "GROWTH_THESIS_KNOWN_TIMING_NOT_BUY_ELIGIBLE"
          : "REQUIRED_PIT_GROWTH_FAMILY_MISSING",
    ]),
    warnings: Object.freeze([
      "A1_TIMING_CANNOT_CREATE_INDUSTRY_OR_FUNDAMENTAL_THESIS",
      "NO_SYSTEM1_AB_OR_TOP6_DEPENDENCY",
    ]),
  };
}

export function assessStage1StrategyV0_1({
  strategyId,
  factorBundle,
  externalFamilyAssessments = {},
} = {}) {
  const id = String(strategyId || "").trim();
  if (id === "SHORT_MOMENTUM") return deepFreeze(buildShortMomentumA1Families(factorBundle));
  if (id === "SWING_GROWTH") return deepFreeze(buildSwingGrowthFamilies(factorBundle, externalFamilyAssessments));
  throw new Error("unsupported Stage-1 strategy assessor: " + id);
}

export function stage1AssessorPolicyRegistryV0_1() {
  return STAGE1_ASSESSOR_POLICIES_V0_1;
}
