import assert from "node:assert/strict";
import {
  buildDailyShadowCapacityOrchestrationV0_1,
  SYSTEM2_GLOBAL_CANDIDATE_MAX_V0_1,
  SYSTEM2_PER_STRATEGY_ACTIVE_MAX_V0_1,
} from "../runtime/daily_shadow_capacity_orchestrator_v0_1.mjs";

const marketDate = "2026-10-02";
const decisionTimestamp = "2026-10-02T10:10:00.000Z";
const capturedAt = "2026-10-02T10:11:00.000Z";

const known = (thesisState = "SUPPORTIVE") => ({
  observationState: "KNOWN",
  thesisState,
  reasons: ["fixture"],
  warnings: [],
});

function smInput(symbol, entryReadiness, {
  validity = "VALID",
  technical = "SUPPORTIVE",
  pv = "SUPPORTIVE",
  risk = "NEUTRAL",
} = {}) {
  return {
    symbol,
    companyName: "SM-" + symbol,
    decisionId: `SM-DEC-${symbol}`,
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: validity,
    entryReadiness,
    familyAssessments: {
      TECHNICAL_STRUCTURE: known(technical),
      PRICE_VOLUME: known(pv),
      RISK_FRICTION: known(risk),
    },
    warnings: [],
  };
}

function sgInput(symbol, entryReadiness, {
  validity = "VALID",
  fundamental = "SUPPORTIVE",
  industry = "SUPPORTIVE",
} = {}) {
  return {
    symbol,
    companyName: "SG-" + symbol,
    decisionId: `SG-DEC-${symbol}`,
    strategyId: "SWING_GROWTH",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: validity,
    entryReadiness,
    familyAssessments: {
      FUNDAMENTAL_QUALITY: known(fundamental),
      INDUSTRY_THESIS: known(industry),
    },
    warnings: [],
  };
}

function strategyRun(strategyId, rankingInputs, exclusions = {}) {
  return {
    marketDate,
    decisionTimestamp,
    finalSelectionEnabled: false,
    scheduledCaptureActivated: false,
    exclusions,
    rankingInputs,
    bundle: {
      strategyId,
      strategyVersion: "V0.1-CONTRACT",
      runReceipt: { runState: "COMPLETE" },
    },
  };
}

const first = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-2026-10-02-A",
  persistenceBatchId: "PB-CAP-2026-10-02-A",
  marketDate,
  decisionTimestamp,
  capturedAt,
  strategyRuns: [
    strategyRun("SHORT_MOMENTUM", [
      smInput("2330", "BUY_ELIGIBLE"),
      smInput("3008", "WATCH"),
    ]),
    strategyRun("SWING_GROWTH", [
      sgInput("2330", "BUY_ELIGIBLE"),
      sgInput("2308", "BUY_ELIGIBLE"),
    ]),
  ],
});

assert.equal(first.state, "CAPACITY_READY");
assert.equal(first.capacityReceipt.globalMax, SYSTEM2_GLOBAL_CANDIDATE_MAX_V0_1);
assert.equal(first.capacityReceipt.perStrategyMax, SYSTEM2_PER_STRATEGY_ACTIVE_MAX_V0_1);
assert.equal(first.capacityReceipt.globalCount, 2, "overlap must consume one global slot");
assert.deepEqual(
  first.capacityReceipt.globalPool.map((x) => x.symbol).sort(),
  ["2308", "2330"],
);
assert.equal(
  first.capacityReceipt.globalPool.find((x) => x.symbol === "2330").memberships.length,
  2,
);
assert.deepEqual(
  first.capacityReceipt.activeAssignments.SHORT_MOMENTUM.map((x) => x.symbol),
  ["2330"],
);
const sgActiveRank01 = first.orderingReceipts.find(
  (x) => x.strategyId === "SWING_GROWTH" && x.purpose === "ACTIVE_INTRADAY_MONITOR",
);
assert.deepEqual(
  first.capacityReceipt.activeAssignments.SWING_GROWTH.map((x) => x.symbol),
  sgActiveRank01.orderedCandidates.map((x) => x.symbol),
  "active-monitor order must follow the frozen strategy-local RANK-01 receipt, not fixture input order",
);
assert.equal(first.orderingReceipts.length, 4);
assert.equal(first.persistenceBatch.operationCount, 5);
assert.equal(first.persistenceBatch.operations.at(-1).table, "s2_capacity_runs");
assert.equal(first.finalSelectionEnabled, false);
assert.equal(first.crossStrategyGlobalPriorityAuthorized, false);
assert.equal(first.livePushEnabled, false);
assert.equal(first.orderImpact, false);

const zero = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-2026-10-02-ZERO",
  persistenceBatchId: "PB-CAP-2026-10-02-ZERO",
  marketDate,
  decisionTimestamp,
  capturedAt,
  strategyRuns: [
    strategyRun("SHORT_MOMENTUM", [smInput("2330", "WATCH")]),
    strategyRun("SWING_GROWTH", [sgInput("2308", "WAIT")]),
  ],
});
assert.equal(zero.state, "CAPACITY_ZERO_PICK_READY");
assert.equal(zero.capacityReceipt.globalCount, 0);
assert.deepEqual(zero.capacityReceipt.activeAssignments.SHORT_MOMENTUM, []);
assert.deepEqual(zero.capacityReceipt.activeAssignments.SWING_GROWTH, []);

const priorCapacityRow = {
  market_date: "2026-10-01",
  global_pool_json: JSON.stringify([
    {
      symbol: "3008",
      companyName: "Prior-3008",
      memberships: [{
        strategyId: "SHORT_MOMENTUM",
        strategyVersion: "V0.1-CONTRACT",
        strategyValidity: "VALID",
        entryReadiness: "WATCH",
        decisionId: "OLD-3008",
        globalPoolEligible: true,
        activeMonitorEligible: false,
        reasons: [],
        warnings: [],
      }],
      reasons: [],
      warnings: [],
    },
    {
      symbol: "2317",
      companyName: "Prior-2317",
      memberships: [{
        strategyId: "SHORT_MOMENTUM",
        strategyVersion: "V0.1-CONTRACT",
        strategyValidity: "VALID",
        entryReadiness: "WATCH",
        decisionId: "OLD-2317",
        globalPoolEligible: true,
        activeMonitorEligible: false,
        reasons: [],
        warnings: [],
      }],
      reasons: [],
      warnings: [],
    },
  ]),
};

const retainedUnknown = smInput("3008", "BLOCKED", { validity: "INCOMPLETE" });
const invalidated = smInput("2317", "BLOCKED", { validity: "INVALIDATED" });
const revalidated = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-2026-10-02-REVALIDATE",
  persistenceBatchId: "PB-CAP-2026-10-02-REVALIDATE",
  marketDate,
  decisionTimestamp,
  capturedAt,
  priorCapacityRow,
  strategyRuns: [
    strategyRun("SHORT_MOMENTUM", [
      retainedUnknown,
      invalidated,
      smInput("2330", "BUY_ELIGIBLE"),
    ]),
  ],
});

assert.equal(revalidated.state, "CAPACITY_READY");
assert.deepEqual(
  revalidated.capacityReceipt.globalPool.map((x) => x.symbol).sort(),
  ["2330", "3008"],
);
assert.equal(
  revalidated.capacityReceipt.globalPool
    .find((x) => x.symbol === "3008")
    .memberships[0].globalPoolEligible,
  true,
  "INCOMPLETE prior thesis must not be inferred bearish",
);
assert.equal(
  revalidated.capacityReceipt.globalPool
    .find((x) => x.symbol === "3008")
    .memberships[0].activeMonitorEligible,
  false,
);
assert.equal(revalidated.capacityReceipt.removed.some((x) => x.symbol === "2317"), true);
assert.deepEqual(
  revalidated.capacityReceipt.activeAssignments.SHORT_MOMENTUM.map((x) => x.symbol),
  ["2330"],
);

const scarceInputs = Array.from({ length: 13 }, (_, i) =>
  smInput(String(1000 + i), "BUY_ELIGIBLE"),
);
const scarce = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-2026-10-02-SCARCE",
  persistenceBatchId: "PB-CAP-2026-10-02-SCARCE",
  marketDate,
  decisionTimestamp,
  capturedAt,
  strategyRuns: [strategyRun("SHORT_MOMENTUM", scarceInputs)],
});
assert.equal(scarce.state, "CAPACITY_BLOCKED_GLOBAL_PRIORITY_UNRESOLVED");
assert.equal(scarce.capacityReceipt, null);
assert.equal(scarce.blockers[0].eligibleNewUniqueCount, 13);
assert.equal(scarce.blockers[0].competingVacancyCount, 12);
assert.equal(scarce.persistenceBatch.operationCount, 2);
assert.equal(
  scarce.persistenceBatch.operations.some((x) => x.table === "s2_capacity_runs"),
  false,
);

const missingRevalidation = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-2026-10-02-MISSING-REVALIDATION",
  persistenceBatchId: "PB-CAP-2026-10-02-MISSING-REVALIDATION",
  marketDate,
  decisionTimestamp,
  capturedAt,
  priorCapacityRow: {
    market_date: "2026-10-01",
    global_pool_json: JSON.stringify([{
      symbol: "2308",
      memberships: [{
        strategyId: "SWING_GROWTH",
        strategyVersion: "V0.1-CONTRACT",
        strategyValidity: "VALID",
        entryReadiness: "WATCH",
        decisionId: "OLD-SG-2308",
        globalPoolEligible: true,
        activeMonitorEligible: false,
        reasons: [],
        warnings: [],
      }],
      reasons: [],
      warnings: [],
    }]),
  },
  strategyRuns: [strategyRun("SHORT_MOMENTUM", [smInput("2330", "BUY_ELIGIBLE")])],
});
assert.equal(missingRevalidation.state, "CAPACITY_BLOCKED_PRIOR_REVALIDATION_GAP");
assert.equal(missingRevalidation.capacityReceipt, null);
assert.equal(missingRevalidation.blockers[0].code, "PRIOR_STRATEGY_NOT_REVALIDATED");

await assert.rejects(
  () => buildDailyShadowCapacityOrchestrationV0_1({
    capacityRunId: "CAP-BAD-PRIOR-DATE",
    persistenceBatchId: "PB-BAD-PRIOR-DATE",
    marketDate,
    decisionTimestamp,
    capturedAt,
    priorCapacityRow: { market_date: marketDate, global_pool_json: "[]" },
    strategyRuns: [strategyRun("SHORT_MOMENTUM", [smInput("2330", "BUY_ELIGIBLE")])],
  }),
  /priorCapacityRow must be from an earlier market date/,
);

await assert.rejects(
  () => buildDailyShadowCapacityOrchestrationV0_1({
    capacityRunId: "CAP-BAD-AUTHORITY",
    persistenceBatchId: "PB-BAD-AUTHORITY",
    marketDate,
    decisionTimestamp,
    capturedAt,
    strategyRuns: [{
      ...strategyRun("SHORT_MOMENTUM", [smInput("2330", "BUY_ELIGIBLE")]),
      finalSelectionEnabled: true,
    }],
  }),
  /cannot carry final selection/,
);

console.log("System2 daily Shadow capacity orchestrator v0.1 tests passed");
