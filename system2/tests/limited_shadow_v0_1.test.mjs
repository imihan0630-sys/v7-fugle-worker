import assert from "node:assert/strict";
import { buildFactorObservation, buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { buildStrategyStateAssessment } from "../runtime/strategy_evaluator.mjs";
import {
  SHORT_MOMENTUM_CONTRACT_V0_1,
  INDUSTRY_TREND_CONTRACT_V0_1,
} from "../runtime/strategy_contracts_v0_1.mjs";
import {
  buildStrategySourceReadinessReceipt,
} from "../runtime/strategy_source_readiness.mjs";
import {
  LIMITED_SHADOW_SPECS_V0_1,
  buildLimitedShadowDecisionSnapshot,
  mapAssessmentToDecisionState,
} from "../runtime/limited_shadow_v0_1.mjs";

const regime = buildMarketRegimeSnapshot({
  regimeSnapshotId: "REGIME-20260927",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  labels: ["UNKNOWN"],
  taiwanIndexState: "KNOWN",
  breadthState: "UNKNOWN",
  liquidityState: "KNOWN",
  volatilityState: "KNOWN",
  leadershipState: "UNKNOWN",
  sectorRotationState: "UNKNOWN",
  globalMacroState: "UNKNOWN",
  factorRefs: [],
  warnings: [],
});

const familyAssessments = Object.fromEntries(
  SHORT_MOMENTUM_CONTRACT_V0_1.evidenceFamilies.map((x) => {
    const required = ["TECHNICAL_STRUCTURE", "PRICE_VOLUME", "RISK_FRICTION"].includes(x.family);
    return [
      x.family,
      required
        ? {
            observationState: "KNOWN",
            thesisState: x.family === "RISK_FRICTION" ? "NEUTRAL" : "SUPPORTIVE",
            reasons: ["fixture-known-with-factor-lineage"],
            warnings: [],
          }
        : {
            observationState: "UNKNOWN",
            thesisState: "INDETERMINATE",
            reasons: ["fixture-nonblocking-family-not-wired"],
            warnings: [],
          },
    ];
  }),
);

function factor(factorId) {
  return buildFactorObservation({
    factorId,
    factorVersion: "0.1",
    scope: "SYMBOL",
    scopeKey: "2330",
    marketDate: "2026-09-27",
    decisionTimestamp: "2026-09-27T07:30:00Z",
    state: "KNOWN",
    rawValue: 1,
    normalizedValue: 0.5,
    confidence: 1,
    provenance: {
      sourceId: "LIMITED_SHADOW_FIXTURE",
      sourceName: "fixture",
      availableAt: "2026-09-27T07:20:00Z",
      capturedAt: "2026-09-27T07:21:00Z",
      pointInTimeEligible: true,
      payloadHash: factorId.replaceAll(".", "-") + "-payload",
    },
    normalization: {
      method: "NONE",
      normalizationVersion: "0.1",
    },
    qualityFlags: [],
  });
}

const factorObservations = [
  factor("TECH.TREND"),
  factor("PV.RELATIVE_VOLUME"),
  factor("RISK.LIQUIDITY"),
];

const validAssessment = buildStrategyStateAssessment(
  SHORT_MOMENTUM_CONTRACT_V0_1,
  {
    familyAssessments,
    entryReadiness: "BUY_ELIGIBLE",
  },
);
assert.equal(mapAssessmentToDecisionState(validAssessment), "QUALIFIED_NOT_SELECTED");

const smSpec = LIMITED_SHADOW_SPECS_V0_1.find(
  (x) => x.strategyId === "SHORT_MOMENTUM",
);
const smSource = buildStrategySourceReadinessReceipt(
  SHORT_MOMENTUM_CONTRACT_V0_1,
);

const base = {
  contract: SHORT_MOMENTUM_CONTRACT_V0_1,
  sourceReadinessReceipt: smSource,
  assessment: validAssessment,
  shadowSpec: smSpec,
  decision: {
    decisionId: "S2-SM-LS-001-2330-20260927",
    marketDate: "2026-09-27",
    decisionTimestamp: "2026-09-27T07:30:00Z",
    symbol: "2330",
    companyName: "fixture",
    regimeSnapshotId: "REGIME-20260927",
    factorRefs: factorObservations.map((x) => x.factorId + "@" + x.factorVersion),
    interactionRefs: [],
    reasons: [],
    warnings: [],
  },
  entryPlan: {
    entryZoneLow: null,
    entryZoneHigh: null,
    triggerPrice: null,
    stopPrice: null,
    targets: [],
    maxHoldingSessions: 10,
  },
  factorObservations,
  interactionObservations: [],
  regime,
  frozenAt: "2026-09-27T07:31:00Z",
};

const selected = await buildLimitedShadowDecisionSnapshot(base);
assert.equal(selected.evaluation.state, "QUALIFIED_NOT_SELECTED");
assert.equal(selected.evaluation.strategyValidity, "VALID");
assert.equal(selected.evaluation.entryReadiness, "BUY_ELIGIBLE");
assert.equal(selected.evaluation.totalScore, null);
assert.equal(selected.evaluation.rank, null);
assert.equal(selected.evaluation.shadowSpecId, "S2-SM-LS-001");

const incompleteAssessment = buildStrategyStateAssessment(
  SHORT_MOMENTUM_CONTRACT_V0_1,
  {
    familyAssessments: {
      ...familyAssessments,
      PRICE_VOLUME: {
        observationState: "UNKNOWN",
        thesisState: "INDETERMINATE",
        reasons: ["missing price-volume"],
        warnings: [],
      },
    },
    entryReadiness: "BUY_ELIGIBLE",
  },
);

const incomplete = await buildLimitedShadowDecisionSnapshot({
  ...base,
  assessment: incompleteAssessment,
  decision: {
    ...base.decision,
    decisionId: "S2-SM-LS-001-2330-20260927-INCOMPLETE",
  },
});
assert.equal(incomplete.evaluation.state, "INCOMPLETE");
assert.equal(incomplete.evaluation.strategyValidity, "INCOMPLETE");
assert.equal(incomplete.evaluation.entryReadiness, "BLOCKED");
assert.ok(
  incomplete.evaluation.missingRequiredFactors.some((x) =>
    x.startsWith("PRICE_VOLUME:"),
  ),
);

const tooExtendedAssessment = buildStrategyStateAssessment(
  SHORT_MOMENTUM_CONTRACT_V0_1,
  {
    familyAssessments,
    entryReadiness: "TOO_EXTENDED",
  },
);
const tooExtended = await buildLimitedShadowDecisionSnapshot({
  ...base,
  assessment: tooExtendedAssessment,
  decision: {
    ...base.decision,
    decisionId: "S2-SM-LS-001-2330-20260927-EXTENDED",
  },
});
assert.equal(tooExtended.evaluation.state, "WATCH");
assert.equal(tooExtended.evaluation.strategyValidity, "VALID");
assert.equal(tooExtended.evaluation.entryReadiness, "TOO_EXTENDED");

const industrySource = buildStrategySourceReadinessReceipt(
  INDUSTRY_TREND_CONTRACT_V0_1,
);
await assert.rejects(
  () =>
    buildLimitedShadowDecisionSnapshot({
      ...base,
      contract: INDUSTRY_TREND_CONTRACT_V0_1,
      sourceReadinessReceipt: industrySource,
      assessment: {
        ...validAssessment,
        strategyId: "INDUSTRY_TREND",
        strategyVersion: INDUSTRY_TREND_CONTRACT_V0_1.strategyVersion,
      },
      shadowSpec: {
        ...smSpec,
        strategyId: "INDUSTRY_TREND",
        strategyVersion: INDUSTRY_TREND_CONTRACT_V0_1.strategyVersion,
      },
    }),
  /SOURCE_BLOCKED/,
);

console.log("System2 limited Shadow V0.1 tests passed");
