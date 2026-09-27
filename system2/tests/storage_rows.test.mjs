import assert from "node:assert/strict";
import { toShadowDecisionRow, toShadowRunRow, toCapacityRunRow, toStrategyOrderingRow, toRankingExperimentRow, toRank05DisplacementRow, toStrategyOverlapRow, toCandidateConcentrationRow } from "../runtime/storage_rows.mjs";

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

const orderingRow = toStrategyOrderingRow({
  orderingReceiptId: "ORD1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  purpose: "GLOBAL_ADMISSION",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  orderingPolicyId: "SM-ORDER-RESEARCH-BASELINE",
  orderingPolicyVersion: "0.1",
  candidateCount: 2,
  orderedCandidates: [
    { ordinal: 1, symbol: "2330" },
    { ordinal: 2, symbol: "3008" },
  ],
  orderingHash: "ord-hash",
  capturedAt: "2026-09-27T07:31:00Z",
  schemaVersion: "S2_STRATEGY_ORDERING_V0_1",
});

assert.equal(orderingRow.candidate_count, 2);
assert.equal(orderingRow.ordering_hash, "ord-hash");
assert.equal(JSON.parse(orderingRow.ordered_candidates_json)[1].symbol, "3008");

const rankingExperimentRow = toRankingExperimentRow({
  experimentReceiptId: "RX1",
  experimentId: "RANK-02",
  experimentVersion: "0.1",
  hypothesisId: "ENTRY_READINESS_INCREMENT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  purpose: "GLOBAL_ADMISSION",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  baselinePolicyId: "SM-PARETO-BASELINE",
  baselinePolicyVersion: "0.1",
  baselineOrderingHash: "base-hash",
  challengerPolicyId: "SHORT_MOMENTUM-RANK02-ENTRY-PROXIMITY",
  challengerPolicyVersion: "0.1",
  challengerOrderingHash: "challenger-hash",
  sameCandidateSet: true,
  commonSupportSymbols: ["2330", "3008"],
  baselineOnlySymbols: [],
  challengerOnlySymbols: [],
  rankDeltas: [{ symbol: "2330", baselineRank: 1, challengerRank: 2, delta: -1 }],
  outcomeAttached: false,
  experimentHash: "experiment-hash",
  capturedAt: "2026-09-27T07:32:00Z",
  schemaVersion: "S2_RANKING_EXPERIMENT_V0_1",
});

assert.equal(rankingExperimentRow.same_candidate_set, 1);
assert.equal(rankingExperimentRow.outcome_attached, 0);
assert.equal(JSON.parse(rankingExperimentRow.common_support_symbols_json).length, 2);

const rank05Row = toRank05DisplacementRow({
  receiptId: "R05-1",
  experimentId: "RANK-05",
  experimentVersion: "0.1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  incumbent: {
    symbol: "2330",
    candidateEpisodeId: "E1",
    candidatePoolSessions: 4,
    memberships: [],
  },
  challenger: {
    symbol: "3008",
    memberships: [],
  },
  classification: "CHALLENGER_STRICTLY_BETTER_TIER",
  shadowDisplacementEligible: true,
  action: "SHADOW_COMPARE_ONLY",
  outcomeAttached: false,
  receiptHash: "rank05-hash",
  capturedAt: "2026-09-27T07:31:00Z",
  schemaVersion: "S2_RANK05_DISPLACEMENT_V0_1",
});

assert.equal(rank05Row.incumbent_pool_sessions, 4);
assert.equal(rank05Row.shadow_displacement_eligible, 1);
assert.equal(rank05Row.outcome_attached, 0);

const overlapRow = toStrategyOverlapRow({
  receiptId: "O1",
  experimentId: "RANK-06",
  experimentVersion: "0.1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyA: { strategyId: "SHORT_MOMENTUM" },
  strategyB: { strategyId: "SWING_GROWTH" },
  sharedCoreFamilies: [],
  distinctCoreFamiliesA: ["TECHNICAL_STRUCTURE"],
  distinctCoreFamiliesB: ["INDUSTRY_THESIS"],
  sharedAllFamilies: ["FUNDAMENTAL_QUALITY"],
  diagnostics: { coreJaccard: 0 },
  independentSameClockValidity: true,
  naiveStrategyCountBonusAllowed: false,
  overlapPriorityEffectAuthorized: false,
  researchState: "OVERLAP_MEASURED_NOT_VALIDATED",
  overlapHash: "overlap-hash",
  capturedAt: "2026-09-27T07:31:00Z",
  schemaVersion: "S2_STRATEGY_OVERLAP_V0_1",
});

assert.equal(overlapRow.independent_same_clock_validity, 1);
assert.equal(overlapRow.naive_strategy_count_bonus_allowed, 0);

const concentrationRow = toCandidateConcentrationRow({
  receiptId: "C1",
  experimentId: "RANK-07",
  experimentVersion: "0.1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  classificationVersion: "IND-V0",
  globalCount: 4,
  knownIndustryCount: 3,
  unknownIndustryCount: 1,
  knownIndustryCoverage: 0.75,
  unknownIndustrySymbols: ["D"],
  industryRows: [{ industryKey: "SEMICONDUCTOR", count: 2 }],
  largestIndustry: { industryKey: "SEMICONDUCTOR", count: 2 },
  industryHhiKnownOnly: 5/9,
  strategyMembershipCounts: { SHORT_MOMENTUM: 2, SWING_GROWTH: 3 },
  multiStrategySymbolCount: 1,
  concentrationAdmissionEffectAuthorized: false,
  concentrationEvictionEffectAuthorized: false,
  concentrationSizingEffectAuthorized: false,
  warnings: ["INDUSTRY_CLASSIFICATION_INCOMPLETE"],
  concentrationHash: "concentration-hash",
  capturedAt: "2026-09-27T07:31:00Z",
  schemaVersion: "S2_CANDIDATE_CONCENTRATION_V0_1",
});

assert.equal(concentrationRow.known_industry_coverage, 0.75);
assert.equal(JSON.parse(concentrationRow.effect_authorization_json).admission, false);

console.log("System2 storage row serializer tests passed");
