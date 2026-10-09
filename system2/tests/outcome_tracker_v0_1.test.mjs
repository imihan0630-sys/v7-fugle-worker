import assert from "node:assert/strict";
import {
  buildDecisionOutcomeSnapshotV0_1,
  toS2OutcomeRowV0_1,
  validateMonotonicOutcomeUpdateV0_1,
} from "../runtime/outcome_tracker_v0_1.mjs";

const base = {
  decisionId: "D-2330-20260929",
  symbol: "2330",
  decisionMarketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T07:30:00Z",
  referencePrice: 100,
  referencePriceType: "DECISION_CLOSE",
  entryPlan: {
    stopPrice: 95,
    targets: [108, 115],
  },
  benchmarkReferenceClose: 1000,
  industryReferenceClose: 200,
  costScenarios: [
    { scenarioId: "BASE_COST", roundTripCostRate: 0.004, note: "fixture" },
  ],
  priceSpace: "ADJUSTED",
  corporateActionState: "ADJUSTED",
};

const sessions = [
  {
    sessionNumber: 1,
    marketDate: "2026-09-30",
    availableAt: "2026-09-30T08:30:00Z",
    priceSpace: "ADJUSTED",
    open: 100,
    high: 103,
    low: 98,
    close: 102,
    benchmarkClose: 1010,
    industryClose: 202,
    sourceId: "fixture",
  },
  {
    sessionNumber: 2,
    marketDate: "2026-10-01",
    availableAt: "2026-10-01T08:30:00Z",
    priceSpace: "ADJUSTED",
    open: 102,
    high: 107,
    low: 101,
    close: 106,
    benchmarkClose: 1020,
    industryClose: 205,
    sourceId: "fixture",
  },
  {
    sessionNumber: 3,
    marketDate: "2026-10-02",
    availableAt: "2026-10-02T08:30:00Z",
    priceSpace: "ADJUSTED",
    open: 106,
    high: 110,
    low: 104,
    close: 105,
    benchmarkClose: 1015,
    industryClose: 204,
    sourceId: "fixture",
  },
  {
    sessionNumber: 4,
    marketDate: "2026-10-05",
    availableAt: "2026-10-05T08:30:00Z",
    priceSpace: "ADJUSTED",
    open: 103,
    high: 106,
    low: 94,
    close: 96,
    benchmarkClose: 1005,
    industryClose: 198,
    sourceId: "fixture",
  },
  {
    sessionNumber: 5,
    marketDate: "2026-10-06",
    availableAt: "2026-10-06T08:30:00Z",
    priceSpace: "ADJUSTED",
    open: 97,
    high: 112,
    low: 96,
    close: 108,
    benchmarkClose: 1030,
    industryClose: 206,
    sourceId: "fixture",
  },
];

const outcome = await buildDecisionOutcomeSnapshotV0_1({
  ...base,
  sessions,
  updatedAt: "2026-10-06T09:00:00Z",
});

assert.deepEqual(outcome.maturedHorizons, [1, 3, 5]);
assert.ok(Math.abs(outcome.horizonReturns.D1 - 0.02) < 1e-12);
assert.ok(Math.abs(outcome.horizonReturns.D3 - 0.05) < 1e-12);
assert.ok(Math.abs(outcome.horizonReturns.D5 - 0.08) < 1e-12);
assert.equal(outcome.horizonReturns.D10, null);
assert.equal(outcome.horizonReturns.D20, null);
assert.ok(Math.abs(outcome.benchmarkReturns.D1 - 0.01) < 1e-12);
assert.ok(Math.abs(outcome.relativeBenchmarkReturns.D1 - 0.01) < 1e-12);
assert.ok(Math.abs(outcome.industryReturns.D1 - 0.01) < 1e-12);
assert.ok(Math.abs(outcome.relativeIndustryReturns.D1 - 0.01) < 1e-12);
assert.ok(Math.abs(outcome.mfe - 0.12) < 1e-12);
assert.ok(Math.abs(outcome.mae - (-0.06)) < 1e-12);
assert.equal(outcome.barrierObservation.targetHitSession, 3);
assert.equal(outcome.barrierObservation.stopHitSession, 4);
assert.equal(outcome.barrierObservation.firstBarrier, "TARGET_FIRST");
assert.equal(outcome.barrierObservation.ambiguousSameBar, false);
assert.equal(
  outcome.barrierObservation.semantics,
  "DAILY_OHLC_BARRIER_OBSERVATION_NOT_SIMULATED_FILL",
);
assert.ok(Math.abs(outcome.costScenarios.BASE_COST.horizonReturns.D1 - 0.016) < 1e-12);
assert.equal(
  outcome.costScenarios.BASE_COST.semantics,
  "SIGNAL_RETURN_MINUS_COST_SCENARIO_NOT_REALIZED_FILL_RETURN",
);
assert.equal(outcome.performanceEligible, true);
assert.deepEqual(outcome.warnings, []);
assert.match(outcome.outcomeHash, /^[0-9a-f]{64}$/);

const replay = await buildDecisionOutcomeSnapshotV0_1({
  ...base,
  sessions,
  updatedAt: "2026-10-06T09:00:00Z",
});
assert.equal(outcome.outcomeHash, replay.outcomeHash);

const row = toS2OutcomeRowV0_1(outcome);
assert.equal(row.decision_id, "D-2330-20260929");
assert.ok(Math.abs(row.d5_return - 0.08) < 1e-12);
assert.equal(row.d10_return, null);
assert.equal(row.target_hit_session, 3);
assert.equal(row.stop_hit_session, 4);
assert.equal(row.ambiguous_same_bar, 0);
assert.equal(row.realized_return_after_cost, null);
assert.equal(row.holding_sessions, null);
assert.equal(JSON.parse(row.outcome_json).relativeBenchmarkReturns.D5 !== undefined, true);

const day1Outcome = await buildDecisionOutcomeSnapshotV0_1({
  ...base,
  sessions: sessions.slice(0, 1),
  updatedAt: "2026-09-30T09:00:00Z",
});
const day1Row = toS2OutcomeRowV0_1(day1Outcome);
const monotonic = validateMonotonicOutcomeUpdateV0_1(day1Row, row);
assert.equal(monotonic.state, "UPDATE_ALLOWED");
assert.equal(monotonic.updateAllowed, true);

const changedD1 = {
  ...row,
  d1_return: 0.03,
};
const revision = validateMonotonicOutcomeUpdateV0_1(day1Row, changedD1);
assert.equal(revision.state, "OUTCOME_REVISION_CONFLICT");
assert.ok(revision.blockers.includes("IMMUTABLE_HORIZON_REVISION:d1_return"));

const lowerMfe = {
  ...row,
  d1_return: day1Row.d1_return,
  mfe: day1Row.mfe - 0.01,
};
const badMfe = validateMonotonicOutcomeUpdateV0_1(day1Row, lowerMfe);
assert.ok(badMfe.blockers.includes("MFE_NON_MONOTONIC"));

const ambiguous = await buildDecisionOutcomeSnapshotV0_1({
  ...base,
  decisionId: "D-AMBIG",
  entryPlan: { stopPrice: 95, targets: [108] },
  sessions: [{
    sessionNumber: 1,
    marketDate: "2026-09-30",
    availableAt: "2026-09-30T08:30:00Z",
    priceSpace: "ADJUSTED",
    open: 100,
    high: 110,
    low: 94,
    close: 101,
    benchmarkClose: 1005,
    industryClose: 201,
  }],
  updatedAt: "2026-09-30T09:00:00Z",
});
assert.equal(ambiguous.barrierObservation.firstBarrier, "AMBIGUOUS_SAME_BAR");
assert.equal(ambiguous.barrierObservation.ambiguousSameBar, true);
assert.equal(toS2OutcomeRowV0_1(ambiguous).ambiguous_same_bar, 1);

const unknownCorporateAction = await buildDecisionOutcomeSnapshotV0_1({
  ...base,
  decisionId: "D-UNKNOWN-CA",
  corporateActionState: "UNKNOWN",
  benchmarkReferenceClose: null,
  industryReferenceClose: null,
  sessions: [],
  updatedAt: "2026-09-29T08:00:00Z",
});
assert.equal(unknownCorporateAction.performanceEligible, false);
assert.equal(unknownCorporateAction.observedSessionCount, 0);
assert.deepEqual(unknownCorporateAction.maturedHorizons, []);
assert.ok(unknownCorporateAction.warnings.includes("CORPORATE_ACTION_STATE_UNKNOWN"));
assert.ok(unknownCorporateAction.warnings.includes("BENCHMARK_REFERENCE_MISSING"));
assert.ok(unknownCorporateAction.warnings.includes("INDUSTRY_REFERENCE_MISSING"));

await assert.rejects(
  () => buildDecisionOutcomeSnapshotV0_1({
    ...base,
    decisionId: "D-FUTURE-DATA",
    sessions: [{
      ...sessions[0],
      availableAt: "2026-10-01T09:00:00Z",
    }],
    updatedAt: "2026-09-30T09:00:00Z",
  }),
  /not available by updatedAt/,
);

await assert.rejects(
  () => buildDecisionOutcomeSnapshotV0_1({
    ...base,
    decisionId: "D-GAP",
    sessions: [
      sessions[0],
      { ...sessions[2], sessionNumber: 3 },
    ],
    updatedAt: "2026-10-02T09:00:00Z",
  }),
  /contiguous/,
);

await assert.rejects(
  () => buildDecisionOutcomeSnapshotV0_1({
    ...base,
    decisionId: "D-MIXED-SPACE",
    sessions: [{ ...sessions[0], priceSpace: "RAW" }],
    updatedAt: "2026-09-30T09:00:00Z",
  }),
  /mixed price spaces/,
);


const erasedMfe = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row, mfe: null,
});
assert.ok(erasedMfe.blockers.includes("EXCURSION_ERASURE:mfe"));

const erasedMae = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row, mae: null,
});
assert.ok(erasedMae.blockers.includes("EXCURSION_ERASURE:mae"));

const modifiedCost = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row,
  outcome_json: JSON.stringify({
    ...JSON.parse(row.outcome_json),
    costScenarios: { BASE_COST: { revised: true } },
  }),
});
assert.ok(modifiedCost.blockers.includes("IMMUTABLE_OUTCOME_PROVENANCE_REVISION:costScenarios"));

const closedRow = {
  ...row, holding_sessions: 5, realized_return_after_cost: 0.05,
};
const alteredHolding = validateMonotonicOutcomeUpdateV0_1(closedRow, {
  ...closedRow, holding_sessions: 6,
});
assert.ok(alteredHolding.blockers.includes("CLOSED_HOLDING_SESSIONS_REVISION"));

const switchedPriceSpace = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row,
  outcome_json: JSON.stringify({
    ...JSON.parse(row.outcome_json),
    priceSpace: "RAW",
  }),
});
assert.ok(switchedPriceSpace.blockers.includes("IMMUTABLE_OUTCOME_PROVENANCE_REVISION:priceSpace"));


const costModelReplacement = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row,
  outcome_json: JSON.stringify({...JSON.parse(row.outcome_json),costModel:"REPLACED"}),
});
assert.ok(costModelReplacement.blockers.includes("IMMUTABLE_OUTCOME_PROVENANCE_REVISION:costModel"));

const revisionOfOriginalSession = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row,
  outcome_json: JSON.stringify({...JSON.parse(row.outcome_json),
    sessions:[{...JSON.parse(row.outcome_json).sessions[0],sourceHash:"f".repeat(64)},
      ...JSON.parse(row.outcome_json).sessions.slice(1)]}),
});
assert.ok(revisionOfOriginalSession.blockers.includes("IMMUTABLE_OUTCOME_SESSION_REVISION:1"));

const forgedCostReturn = validateMonotonicOutcomeUpdateV0_1(day1Row, {
  ...row,
  outcome_json: JSON.stringify({...JSON.parse(row.outcome_json),
    costScenarios:{...JSON.parse(row.outcome_json).costScenarios,
      BASE_COST:{...JSON.parse(row.outcome_json).costScenarios.BASE_COST,
        horizonReturns:{...JSON.parse(row.outcome_json).costScenarios.BASE_COST.horizonReturns,D1:0.99}}}}),
});
assert.ok(forgedCostReturn.blockers.includes("COST_SCENARIO_RETURN_MISMATCH:BASE_COST:D1"));

const inconsistentScalar = validateMonotonicOutcomeUpdateV0_1(day1Row,{
  ...row,mae:row.mae-0.01,
});
assert.ok(inconsistentScalar.blockers.includes("OUTCOME_JSON_SCALAR_MISMATCH:mae"));

const erasedSessionHistory = validateMonotonicOutcomeUpdateV0_1(day1Row,{
  ...row,outcome_json: JSON.stringify({...JSON.parse(row.outcome_json),sessions:[]}),
});
assert.ok(erasedSessionHistory.blockers.includes("OUTCOME_SESSION_HISTORY_ERASURE"));

console.log("System2 decision outcome tracker V0.1 tests passed");
