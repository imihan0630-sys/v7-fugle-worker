import assert from "node:assert/strict";
import { allocateGlobalCandidatePoolWithPriorityGate } from "../runtime/candidate_capacity_priority_gate.mjs";

const membership = (strategyId) => ({
  strategyId,
  strategyVersion: "V0.1",
  strategyValidity: "VALID",
  entryReadiness: "WATCH",
  globalPoolEligible: true,
  activeMonitorEligible: false,
  reasons: [],
  warnings: [],
});
const candidate = (symbol, strategyId) => ({
  symbol,
  memberships: [membership(strategyId)],
  reasons: [],
  warnings: [],
});

const noScarcity = allocateGlobalCandidatePoolWithPriorityGate({
  priorPool: [candidate("A", "SHORT_MOMENTUM")],
  newCandidates: [candidate("B", "SHORT_MOMENTUM")],
  globalMax: 3,
});
assert.equal(noScarcity.allocationState, "ALLOCATED_NO_SCARCITY");
assert.equal(noScarcity.allocation.globalCount, 2);

const unresolved = allocateGlobalCandidatePoolWithPriorityGate({
  priorPool: [candidate("A", "SHORT_MOMENTUM")],
  newCandidates: [
    candidate("B", "SHORT_MOMENTUM"),
    candidate("C", "SWING_GROWTH"),
    candidate("D", "SWING_GROWTH"),
  ],
  globalMax: 2,
});
assert.equal(unresolved.allocationState, "GLOBAL_PRIORITY_UNRESOLVED");
assert.equal(unresolved.allocation, null);
assert.deepEqual(unresolved.deferredSymbols, ["B", "C", "D"]);
assert.equal(unresolved.retentionOnly.globalCount, 1);

const resolved = allocateGlobalCandidatePoolWithPriorityGate({
  priorPool: [candidate("A", "SHORT_MOMENTUM")],
  newCandidates: [
    candidate("B", "SHORT_MOMENTUM"),
    candidate("C", "SWING_GROWTH"),
    candidate("D", "SWING_GROWTH"),
  ],
  globalMax: 2,
  globalPriorityPolicy: {
    id: "FIXTURE_GLOBAL_PRIORITY",
    version: "0.1",
    orderedSymbols: ["C", "B", "D"],
  },
});
assert.equal(resolved.allocationState, "ALLOCATED_WITH_GLOBAL_PRIORITY");
assert.equal(resolved.allocation.admittedNew[0].symbol, "C");
assert.equal(resolved.allocation.capacityOverflow.length, 2);

console.log("System2 candidate capacity priority gate tests passed");
