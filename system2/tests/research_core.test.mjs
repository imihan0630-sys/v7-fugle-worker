import assert from "node:assert/strict";
import { buildFactorObservation, buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { buildFrozenDecisionSnapshot } from "../runtime/decision_archive.mjs";

const known = buildFactorObservation({
  factorId: "PV.RVOL20",
  factorVersion: "0.1",
  scope: "SYMBOL",
  scopeKey: "2330",
  marketDate: "2026-09-26",
  decisionTimestamp: "2026-09-26T08:00:00Z",
  state: "KNOWN",
  rawValue: 1.5,
  normalizedValue: 0.8,
  confidence: 0.9,
  provenance: {
    sourceId: "fixture",
    sourceName: "fixture",
    availableAt: "2026-09-26T07:00:00Z",
    capturedAt: "2026-09-26T07:30:00Z",
    pointInTimeEligible: true,
  },
  normalization: {
    method: "BOUNDED_RATIO",
    normalizationVersion: "0.1",
  },
  qualityFlags: [],
});

assert.equal(known.state, "KNOWN");
assert.equal(known.normalizedValue, 0.8);
assert.equal(Object.isFrozen(known), true);

assert.throws(
  () =>
    buildFactorObservation({
      ...known,
      factorId: "TEST.UNKNOWN",
      state: "UNKNOWN",
      rawValue: null,
      normalizedValue: 0,
      unknownReason: "missing source",
    }),
  /only KNOWN/,
);

assert.throws(
  () =>
    buildFactorObservation({
      ...known,
      factorId: "TEST.FUTURE",
      provenance: {
        ...known.provenance,
        availableAt: "2026-09-26T09:00:00Z",
        pointInTimeEligible: true,
      },
    }),
  /availableAt cannot be later/,
);

const regime = buildMarketRegimeSnapshot({
  regimeSnapshotId: "REGIME-20260926",
  marketDate: "2026-09-26",
  decisionTimestamp: "2026-09-26T08:00:00Z",
  labels: ["UNKNOWN"],
  taiwanIndexState: "KNOWN",
  breadthState: "KNOWN",
  liquidityState: "KNOWN",
  volatilityState: "KNOWN",
  leadershipState: "UNKNOWN",
  sectorRotationState: "UNKNOWN",
  globalMacroState: "UNKNOWN",
  factorRefs: [],
  warnings: ["global macro source contract pending"],
});

const baseInput = {
  evaluation: {
    decisionId: "D-1",
    marketDate: "2026-09-26",
    decisionTimestamp: "2026-09-26T08:00:00Z",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0",
    symbol: "2330",
    companyName: "fixture",
    state: "SELECTED",
    rank: 1,
    totalScore: 80,
    factorRefs: ["PV.RVOL20@0.1"],
    interactionRefs: [],
    regimeSnapshotId: "REGIME-20260926",
    reasons: ["fixture"],
    warnings: [],
    missingRequiredFactors: [],
    invalidationConditions: ["fixture"],
  },
  entryPlan: {
    entryZoneLow: 100,
    entryZoneHigh: 101,
    triggerPrice: 101,
    stopPrice: 95,
    targets: [110],
    maxHoldingSessions: 10,
  },
  factorObservations: [known],
  interactionObservations: [],
  regime,
  frozenAt: "2026-09-26T08:01:00Z",
};

const first = await buildFrozenDecisionSnapshot(baseInput);
const second = await buildFrozenDecisionSnapshot(baseInput);

assert.equal(first.evaluation.decisionHash, second.evaluation.decisionHash);
assert.equal(first.schemaVersion, "S2_DECISION_V0_1");
assert.equal(Object.isFrozen(first), true);
assert.equal(Object.isFrozen(first.evaluation), true);

assert.throws(
  () =>
    buildFrozenDecisionSnapshot({
      ...baseInput,
      evaluation: {
        ...baseInput.evaluation,
        missingRequiredFactors: ["FUND.EPS"],
      },
    }),
  /missing required factors/,
);

console.log("System2 research core tests passed");
