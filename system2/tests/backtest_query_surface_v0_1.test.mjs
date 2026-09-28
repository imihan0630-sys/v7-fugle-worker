import assert from "node:assert/strict";
import {
  buildBacktestConditionQueryV0_1,
  BACKTEST_CONDITION_FIELDS,
} from "../runtime/backtest_query_contract_v0_1.mjs";
import {
  runBacktestConditionQueryV0_1,
  runBacktestThresholdSweepV0_1,
} from "../runtime/backtest_condition_engine_v0_1.mjs";

function sample({
  id,
  date,
  symbol,
  state,
  cohort = null,
  market = "TWSE",
  rvol,
  ma20Distance,
  closePosition,
  regimeLabels = ["TREND"],
  industryId = "SEMICONDUCTOR",
  strategyId = "SHORT_MOMENTUM",
  strategyVersion = "V0.1-CONTRACT",
  policyId = "RESEARCH-POLICY-A",
  policyVersion = "0.1",
}) {
  return {
    sampleId: id,
    marketDate: date,
    symbol,
    companyName: "C" + symbol,
    market,
    strategyId,
    strategyVersion,
    policyId,
    policyVersion,
    candidateState: state,
    archiveCohort: cohort,
    strategyValidity: state === "INCOMPLETE" ? "INCOMPLETE" : "VALID",
    entryReadiness: state === "QUALIFIED_NOT_SELECTED" ? "BUY_ELIGIBLE" : "WATCH",
    coreMetrics: {
      close: 100,
      ma20: 95,
      relativeVolume20Prior: rvol,
      distanceToMa20: ma20Distance,
      closePosition,
      ret20: 0.12,
      atr14Pct: 0.03,
    },
    regime: { labels: regimeLabels },
    industryId,
    outcome: { D5: 0.99 },
  };
}

const samples = [
  sample({
    id: "S1",
    date: "2026-01-05",
    symbol: "2330",
    state: "QUALIFIED_NOT_SELECTED",
    cohort: "NEAR_MISS",
    rvol: 2.1,
    ma20Distance: 0.04,
    closePosition: 0.85,
  }),
  sample({
    id: "S2",
    date: "2026-01-06",
    symbol: "2317",
    state: "WATCH",
    rvol: 1.2,
    ma20Distance: 0.02,
    closePosition: 0.60,
    regimeLabels: ["RANGE"],
    industryId: "ELECTRONICS",
  }),
  sample({
    id: "S3",
    date: "2026-02-02",
    symbol: "2454",
    state: "REJECTED",
    cohort: "IMPORTANT_REJECTED",
    rvol: 2.4,
    ma20Distance: 0.14,
    closePosition: 0.90,
  }),
  sample({
    id: "S4",
    date: "2025-12-31",
    symbol: "6488",
    state: "QUALIFIED_NOT_SELECTED",
    cohort: "NEAR_MISS",
    rvol: 2.8,
    ma20Distance: 0.03,
    closePosition: 0.80,
  }),
  sample({
    id: "S5",
    date: "2026-01-07",
    symbol: "9999",
    state: "QUALIFIED_NOT_SELECTED",
    cohort: "NEAR_MISS",
    rvol: 3.0,
    ma20Distance: 0.02,
    closePosition: 0.95,
    strategyVersion: "OTHER",
  }),
];

const query = await buildBacktestConditionQueryV0_1({
  queryId: "Q-SM-2026-RVOL",
  dateFrom: "2026-01-01",
  dateTo: "2026-12-31",
  datasetVersion: "HIST-CORE-2017-PLUS-V0.1",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  policyId: "RESEARCH-POLICY-A",
  policyVersion: "0.1",
  populationMode: "FULL_REPLAY",
  conditionMode: "ALL",
  conditions: [
    {
      conditionId: "RVOL",
      field: "coreMetrics.relativeVolume20Prior",
      operator: "GTE",
      value: 1.8,
    },
    {
      conditionId: "EXTENSION",
      field: "coreMetrics.distanceToMa20",
      operator: "LTE",
      value: 0.10,
    },
    {
      conditionId: "CLOSE_POS",
      field: "coreMetrics.closePosition",
      operator: "GTE",
      value: 0.70,
    },
  ],
  stratifyBy: ["YEAR", "CANDIDATE_STATE", "REGIME_LABEL", "INDUSTRY"],
  retainMatchedRows: true,
  createdAt: "2026-09-28T10:00:00Z",
});

assert.equal(query.decisionTimeFieldsOnly, true);
assert.equal(query.outcomeFieldsAllowedInConditions, false);
assert.equal(query.populationWarning, null);
assert.ok(BACKTEST_CONDITION_FIELDS.includes("coreMetrics.relativeVolume20Prior"));

const result = await runBacktestConditionQueryV0_1({ query, samples });
assert.equal(result.inputSampleCount, 5);
assert.equal(result.pinnedPopulationCount, 3);
assert.equal(result.matchedCount, 1);
assert.equal(result.matchedRows[0].sampleId, "S1");
assert.equal(result.futureOutcomeFieldsUsed, false);
assert.equal(result.outcomePerformanceComputed, false);
assert.equal(result.conditionPassCounts.RVOL, 2);
assert.equal(result.conditionPassCounts.EXTENSION, 2);
assert.equal(result.stratifications.find((x) => x.type === "YEAR").counts["2026"], 1);
assert.equal(
  result.stratifications.find((x) => x.type === "REGIME_LABEL").counts.TREND,
  1,
);

const sweep = await runBacktestThresholdSweepV0_1({
  query,
  samples,
  conditionId: "RVOL",
  values: [1.0, 1.8, 2.3, 3.0],
});
assert.deepEqual(
  sweep.rows.map((x) => x.matchedCount),
  [2, 1, 0, 0],
);
assert.equal(sweep.outcomePerformanceComputed, false);

const archiveQuery = await buildBacktestConditionQueryV0_1({
  queryId: "Q-ARCHIVE-WARN",
  dateFrom: "2026-01-01",
  dateTo: "2026-12-31",
  datasetVersion: "BASE-V0.1",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  populationMode: "BASE_COHORT_ARCHIVE",
  conditions: [],
  createdAt: "2026-09-28T10:00:00Z",
});
assert.match(archiveQuery.populationWarning, /not a complete market population/);

await assert.rejects(
  () => buildBacktestConditionQueryV0_1({
    queryId: "Q-LOOKAHEAD",
    dateFrom: "2026-01-01",
    dateTo: "2026-12-31",
    datasetVersion: "HIST",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    conditions: [{
      conditionId: "CHEAT",
      field: "outcome.D5",
      operator: "GT",
      value: 0,
    }],
    createdAt: "2026-09-28T10:00:00Z",
  }),
  /future\/outcome fields are forbidden/,
);

await assert.rejects(
  () => buildBacktestConditionQueryV0_1({
    queryId: "Q-BAD-FIELD",
    dateFrom: "2026-01-01",
    dateTo: "2026-12-31",
    datasetVersion: "HIST",
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    conditions: [{
      conditionId: "BAD",
      field: "coreMetrics.magicFutureAlpha",
      operator: "GT",
      value: 0,
    }],
    createdAt: "2026-09-28T10:00:00Z",
  }),
  /unsupported condition field/,
);

console.log("System2 XQ-style backtest query surface v0.1 tests passed");
