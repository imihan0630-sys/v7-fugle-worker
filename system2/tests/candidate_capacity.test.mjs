import assert from "node:assert/strict";
import {
  allocateGlobalCandidatePool,
  allocateActiveIntradayMonitors,
} from "../runtime/candidate_capacity.mjs";

function membership(strategyId, {
  validity = "VALID",
  readiness = "NEAR_ENTRY",
  pool = true,
  active = true,
  rank = null,
} = {}) {
  return {
    strategyId,
    strategyVersion: "V0.1",
    strategyValidity: validity,
    entryReadiness: readiness,
    globalPoolEligible: pool,
    activeMonitorEligible: active,
    strategyLocalRank: rank,
    strategyLocalRankVersion: rank ? "R0.1" : undefined,
    reasons: [],
    warnings: [],
  };
}

function candidate(symbol, memberships) {
  return { symbol, companyName: symbol, memberships, reasons: [], warnings: [] };
}

const retained = [
  candidate("1101", [membership("SHORT_MOMENTUM")]),
  candidate("2330", [membership("SWING_GROWTH")]),
];

const newCandidates = [
  candidate("3008", [membership("SHORT_MOMENTUM", { rank: 1 })]),
  candidate("2454", [membership("SHORT_MOMENTUM", { rank: 2 })]),
  candidate("3008", [membership("SWING_GROWTH", { rank: 1 })]),
  candidate("2308", [membership("SWING_GROWTH", { rank: 2 })]),
];

const global = allocateGlobalCandidatePool({
  priorPool: retained,
  newCandidates,
  globalMax: 4,
  orderingPolicyId: "FIXTURE_PREORDERED",
  orderingPolicyVersion: "0.1",
});

assert.equal(global.globalCount, 4);
assert.equal(global.retainedCount, 2);
assert.equal(global.admittedNewCount, 2);
assert.equal(global.capacityOverflow.length, 1);
assert.equal(global.capacityOverflow[0].symbol, "2308");

const multi = global.globalPool.find((x) => x.symbol === "3008");
assert.ok(multi);
assert.equal(multi.memberships.length, 2);

const active = allocateActiveIntradayMonitors({
  globalPool: global.globalPool,
  strategyOrders: {
    SHORT_MOMENTUM: ["3008", "1101", "2454"],
    SWING_GROWTH: ["3008", "2330", "2454"],
  },
  perStrategyMax: 2,
});

assert.deepEqual(
  active.assignments.SHORT_MOMENTUM.map((x) => x.symbol),
  ["3008", "1101"],
);
assert.deepEqual(
  active.assignments.SWING_GROWTH.map((x) => x.symbol),
  ["3008", "2330"],
);
assert.equal(active.symbolStrategyCounts["3008"], 2);
assert.equal(active.activeCountByStrategy.SHORT_MOMENTUM, 2);
assert.equal(active.activeCountByStrategy.SWING_GROWTH, 2);

const noForcedFill = allocateActiveIntradayMonitors({
  globalPool: [
    candidate("1111", [
      membership("SHORT_MOMENTUM", {
        readiness: "TOO_EXTENDED",
        active: false,
      }),
    ]),
  ],
  strategyOrders: { SHORT_MOMENTUM: ["1111"] },
  perStrategyMax: 3,
});
assert.equal(noForcedFill.assignments.SHORT_MOMENTUM.length, 0);
assert.equal(
  noForcedFill.nonAssignments.SHORT_MOMENTUM[0].reason,
  "ACTIVE_MONITOR_NOT_ELIGIBLE",
);

assert.throws(
  () =>
    allocateGlobalCandidatePool({
      priorPool: [
        candidate("1", [membership("S1")]),
        candidate("2", [membership("S1")]),
        candidate("3", [membership("S1")]),
      ],
      newCandidates: [],
      globalMax: 2,
      orderingPolicyId: "FIXTURE",
      orderingPolicyVersion: "0.1",
    }),
  /invariant violation/,
);

console.log("System2 candidate capacity tests passed");
