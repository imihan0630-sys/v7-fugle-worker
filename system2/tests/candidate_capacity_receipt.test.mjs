import assert from "node:assert/strict";
import {
  allocateGlobalCandidatePool,
  allocateActiveIntradayMonitors,
} from "../runtime/candidate_capacity.mjs";
import { buildCandidateCapacityReceipt } from "../runtime/candidate_capacity_receipt.mjs";

const membership = (strategyId) => ({
  strategyId,
  strategyVersion: "V0.1",
  strategyValidity: "VALID",
  entryReadiness: "NEAR_ENTRY",
  globalPoolEligible: true,
  activeMonitorEligible: true,
  reasons: [],
  warnings: [],
});

const candidate = (symbol, memberships) => ({
  symbol,
  memberships,
  reasons: [],
  warnings: [],
});

const globalAllocation = allocateGlobalCandidatePool({
  priorPool: [],
  newCandidates: [
    candidate("2330", [membership("SHORT_MOMENTUM"), membership("SWING_GROWTH")]),
    candidate("3008", [membership("SHORT_MOMENTUM")]),
  ],
  globalMax: 12,
  orderingPolicyId: "FIXTURE_PREORDERED",
  orderingPolicyVersion: "0.1",
});

const activeAllocation = allocateActiveIntradayMonitors({
  globalPool: globalAllocation.globalPool,
  strategyOrders: {
    SHORT_MOMENTUM: ["2330", "3008"],
    SWING_GROWTH: ["2330"],
  },
  perStrategyMax: 3,
});

const first = await buildCandidateCapacityReceipt({
  capacityRunId: "CAP-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalAllocation,
  activeAllocation,
});

const second = await buildCandidateCapacityReceipt({
  capacityRunId: "CAP-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalAllocation,
  activeAllocation,
});

assert.equal(first.capacityHash, second.capacityHash);
assert.equal(first.globalCount, 2);
assert.equal(first.symbolStrategyCounts["2330"], 2);
assert.equal(first.schemaVersion, "S2_CAPACITY_V0_1");
assert.equal(Object.isFrozen(first), true);

console.log("System2 candidate capacity receipt tests passed");
