import assert from "node:assert/strict";
import { toShadowDecisionRow, toShadowRunRow, toCapacityRunRow } from "../runtime/storage_rows.mjs";

const decisionRow = toShadowDecisionRow(
  {
    evaluation: {
      decisionId: "D1",
      marketDate: "2026-09-27",
      decisionTimestamp: "2026-09-27T07:30:00Z",
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      symbol: "2330",
      companyName: "fixture",
      state: "QUALIFIED_NOT_SELECTED",
      strategyValidity: "VALID",
      entryReadiness: "BUY_ELIGIBLE",
      sourceReadiness: "SOURCE_LIMITED",
      shadowSpecId: "S2-SM-LS-001",
      evaluationMode: "LIMITED_PROSPECTIVE_SHADOW",
      rank: null,
      totalScore: null,
      reasons: ["fixture"],
      warnings: ["source gap"],
      missingRequiredFactors: [],
      thesis: "fixture thesis",
      invalidationConditions: ["fixture invalidation"],
      regimeSnapshotId: "R1",
      decisionHash: "hash1",
    },
    entryPlan: {
      entryZoneLow: null,
      entryZoneHigh: null,
      triggerPrice: null,
      stopPrice: null,
      targets: [],
      maxHoldingSessions: 10,
    },
    frozenAt: "2026-09-27T07:31:00Z",
    schemaVersion: "S2_DECISION_V0_1",
  },
  { factorSnapshotId: "F1" },
);

assert.equal(decisionRow.candidate_state, "QUALIFIED_NOT_SELECTED");
assert.equal(decisionRow.strategy_validity, "VALID");
assert.equal(decisionRow.entry_readiness, "BUY_ELIGIBLE");
assert.equal(decisionRow.rank_value, null);
assert.equal(decisionRow.total_score, null);
assert.deepEqual(JSON.parse(decisionRow.reasons_json), ["fixture"]);

const runRow = toShadowRunRow({
  runId: "RUN1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  shadowSpecId: "S2-SM-LS-001",
  universeVersion: "TW-EQUITY-V0",
  runState: "COMPLETE",
  baseUniverseCount: 1900,
  excludedCount: 100,
  eligibleCount: 1800,
  accountedCount: 1800,
  completionRate: 1,
  stateCounts: { WATCH: 1700, QUALIFIED_NOT_SELECTED: 10, INCOMPLETE: 90 },
  unaccountedSymbols: [],
  symbolAccounts: [],
  warnings: [],
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(runRow.run_state, "COMPLETE");
assert.equal(runRow.completion_rate, 1);
assert.deepEqual(JSON.parse(runRow.unaccounted_symbols_json), []);

const capacityRow = toCapacityRunRow({
  capacityRunId: "CAP1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalMax: 12,
  perStrategyMax: 3,
  orderingPolicyId: "FIXTURE_PREORDERED",
  orderingPolicyVersion: "0.1",
  retained: [],
  removed: [],
  admittedNew: [{ symbol: "2330" }],
  capacityOverflow: [],
  globalPool: [{ symbol: "2330" }],
  globalCount: 1,
  vacancyCount: 11,
  activeAssignments: { SHORT_MOMENTUM: [{ symbol: "2330" }] },
  activeNonAssignments: {},
  activeCountByStrategy: { SHORT_MOMENTUM: 1 },
  symbolStrategyCounts: { "2330": 1 },
  capacityHash: "cap-hash",
  schemaVersion: "S2_CAPACITY_V0_1",
});

assert.equal(capacityRow.global_max, 12);
assert.equal(capacityRow.per_strategy_max, 3);
assert.equal(capacityRow.capacity_hash, "cap-hash");
assert.equal(JSON.parse(capacityRow.counts_json).globalCount, 1);

console.log("System2 storage row serializer tests passed");
