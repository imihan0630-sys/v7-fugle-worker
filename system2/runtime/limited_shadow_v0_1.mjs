import { deepFreeze } from "./factor_snapshot.mjs";
import { buildFrozenDecisionSnapshot } from "./decision_archive.mjs";
import {
  SHORT_MOMENTUM_CONTRACT_V0_1,
  SWING_GROWTH_CONTRACT_V0_1,
} from "./strategy_contracts_v0_1.mjs";
import {
  buildStrategySourceReadinessReceipt,
} from "./strategy_source_readiness.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

const SHORT_MOMENTUM_SOURCE =
  buildStrategySourceReadinessReceipt(SHORT_MOMENTUM_CONTRACT_V0_1);
const SWING_GROWTH_SOURCE =
  buildStrategySourceReadinessReceipt(SWING_GROWTH_CONTRACT_V0_1);

export const LIMITED_SHADOW_SPECS_V0_1 = deepFreeze([
  {
    shadowSpecId: "S2-SM-LS-001",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: SHORT_MOMENTUM_CONTRACT_V0_1.strategyVersion,
    mode: "LIMITED_PROSPECTIVE_SHADOW",
    sourceReadiness: SHORT_MOMENTUM_SOURCE.sourceReadiness,
    allowSelectionWhenAssessmentValid: true,
    rankEnabled: false,
    totalScoreEnabled: false,
    notes: [
      "Daily technical/price-volume/risk families can be evaluated from current-safe fields.",
      "TPEx/breadth/richer intraday volume remain explicit gaps and may not be imputed.",
      "No numeric weights or thresholds are frozen by this shadow spec.",
    ],
  },
  {
    shadowSpecId: "S2-SG-LS-001",
    strategyId: "SWING_GROWTH",
    strategyVersion: SWING_GROWTH_CONTRACT_V0_1.strategyVersion,
    mode: "LIMITED_PROSPECTIVE_SHADOW",
    sourceReadiness: SWING_GROWTH_SOURCE.sourceReadiness,
    allowSelectionWhenAssessmentValid: true,
    rankEnabled: false,
    totalScoreEnabled: false,
    notes: [
      "Only PIT-valid, prospectively frozen fundamental/industry evidence may make required families KNOWN.",
      "Unavailable expectations/forward valuation/catalyst semantics remain UNKNOWN rather than proxied.",
      "No retrospective performance claim is allowed from current snapshots backfilled into earlier dates.",
    ],
  },
]);

export function findLimitedShadowSpec(strategyId) {
  const id = requiredText(strategyId, "strategyId");
  return LIMITED_SHADOW_SPECS_V0_1.find((x) => x.strategyId === id) || null;
}

export function mapAssessmentToDecisionState(assessment) {
  if (!assessment || typeof assessment !== "object") throw new Error("assessment is required");

  if (assessment.strategyValidity === "INVALIDATED") return "REJECTED";
  if (assessment.strategyValidity === "INCOMPLETE") return "INCOMPLETE";

  if (
    assessment.strategyValidity === "VALID" &&
    assessment.entryReadiness === "BUY_ELIGIBLE"
  ) {
    return "SELECTED";
  }

  return "WATCH";
}

export async function buildLimitedShadowDecisionSnapshot({
  contract,
  sourceReadinessReceipt,
  assessment,
  shadowSpec,
  decision,
  entryPlan,
  factorObservations,
  interactionObservations,
  regime,
  frozenAt,
}) {
  if (!contract || typeof contract !== "object") throw new Error("contract is required");
  if (!sourceReadinessReceipt || typeof sourceReadinessReceipt !== "object") {
    throw new Error("sourceReadinessReceipt is required");
  }
  if (!assessment || typeof assessment !== "object") throw new Error("assessment is required");
  if (!shadowSpec || typeof shadowSpec !== "object") throw new Error("shadowSpec is required");

  if (contract.strategyId !== shadowSpec.strategyId) {
    throw new Error("shadowSpec strategyId does not match contract");
  }
  if (contract.strategyVersion !== shadowSpec.strategyVersion) {
    throw new Error("shadowSpec strategyVersion does not match contract");
  }
  if (assessment.strategyId !== contract.strategyId) {
    throw new Error("assessment strategyId does not match contract");
  }
  if (assessment.strategyVersion !== contract.strategyVersion) {
    throw new Error("assessment strategyVersion does not match contract");
  }
  if (sourceReadinessReceipt.strategyId !== contract.strategyId) {
    throw new Error("source readiness strategyId does not match contract");
  }
  if (sourceReadinessReceipt.sourceReadiness === "SOURCE_BLOCKED") {
    throw new Error("SOURCE_BLOCKED strategy cannot create a limited Shadow decision");
  }

  const state = mapAssessmentToDecisionState(assessment);
  if (state === "SELECTED" && shadowSpec.allowSelectionWhenAssessmentValid !== true) {
    throw new Error("shadow spec does not allow selection");
  }

  const missingRequiredFactors = (assessment.missingRequiredEvidence || []).map(
    (x) => `${x.family}:${x.observationState}`,
  );

  const sourceWarnings = [
    ...(sourceReadinessReceipt.blockingFamilies || []).map(
      (x) => `SOURCE_BLOCKER:${x.family}:${x.dataReadiness}`,
    ),
    ...(sourceReadinessReceipt.limitedFamilies || []).map(
      (x) => `SOURCE_LIMITED:${x.family}:${x.dataReadiness}`,
    ),
    ...(sourceReadinessReceipt.nonBlockingGaps || []).map(
      (x) => `SOURCE_GAP:${x.family}:${x.dataReadiness}`,
    ),
  ];

  const evaluation = {
    ...decision,
    decisionId: requiredText(decision?.decisionId, "decision.decisionId"),
    marketDate: requiredText(decision?.marketDate, "decision.marketDate"),
    decisionTimestamp: requiredText(
      decision?.decisionTimestamp,
      "decision.decisionTimestamp",
    ),
    strategyId: contract.strategyId,
    strategyVersion: contract.strategyVersion,
    symbol: requiredText(decision?.symbol, "decision.symbol"),
    state,
    rank: null,
    totalScore: null,
    factorRefs: [...(decision?.factorRefs || [])],
    interactionRefs: [...(decision?.interactionRefs || [])],
    regimeSnapshotId: requiredText(
      decision?.regimeSnapshotId,
      "decision.regimeSnapshotId",
    ),
    reasons: [
      ...(decision?.reasons || []),
      ...(assessment.reasons || []),
      `STRATEGY_VALIDITY:${assessment.strategyValidity}`,
      `ENTRY_READINESS:${assessment.entryReadiness}`,
    ],
    warnings: [
      ...(decision?.warnings || []),
      ...(assessment.warnings || []),
      ...sourceWarnings,
    ],
    missingRequiredFactors,
    thesis: contract.thesis,
    invalidationConditions: [...(contract.hardInvalidationIds || [])],
    strategyValidity: assessment.strategyValidity,
    entryReadiness: assessment.entryReadiness,
    sourceReadiness: sourceReadinessReceipt.sourceReadiness,
    shadowSpecId: shadowSpec.shadowSpecId,
    evaluationMode: shadowSpec.mode,
  };

  return buildFrozenDecisionSnapshot({
    evaluation,
    entryPlan: entryPlan || {
      entryZoneLow: null,
      entryZoneHigh: null,
      triggerPrice: null,
      stopPrice: null,
      targets: [],
      maxHoldingSessions: null,
    },
    factorObservations: factorObservations || [],
    interactionObservations: interactionObservations || [],
    regime,
    frozenAt,
  });
}
