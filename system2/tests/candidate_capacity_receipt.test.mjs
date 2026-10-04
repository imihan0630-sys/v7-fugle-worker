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

const completeDenominator = {
  state: "COMPLETE",
  unresolvedCount: 0,
  unresolvedByState: { INCOMPLETE: 0, SOURCE_BLOCKED: 0, SESSION_INVALID: 0, ERROR: 0 },
  blockerCodes: [],
  contributingShadowRuns: [{
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    runId: "RUN-SM-COMPLETE",
    shadowAccountingHash: "a".repeat(64),
    runFingerprintHash: "b".repeat(64),
  }],
};

const partialDenominator = {
  state: "PARTIAL",
  unresolvedCount: 1,
  unresolvedByState: { INCOMPLETE: 1, SOURCE_BLOCKED: 0, SESSION_INVALID: 0, ERROR: 0 },
  blockerCodes: [],
  contributingShadowRuns: [{
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    runId: "RUN-SM-PARTIAL",
    shadowAccountingHash: "c".repeat(64),
    runFingerprintHash: "d".repeat(64),
  }],
};

const first = await buildCandidateCapacityReceipt({
  capacityRunId: "CAP-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalAllocation,
  activeAllocation,
  selectionDenominator: completeDenominator,
});

const second = await buildCandidateCapacityReceipt({
  capacityRunId: "CAP-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalAllocation,
  activeAllocation,
  selectionDenominator: completeDenominator,
});

assert.equal(first.capacityHash, second.capacityHash);
assert.equal(first.globalCount, 2);
assert.equal(first.symbolStrategyCounts["2330"], 2);
assert.equal(first.schemaVersion, "S2_CAPACITY_V0_2");
assert.equal(first.selectionDenominator.denominatorState, "COMPLETE");
assert.equal(first.selectionDenominator.contributingShadowRuns[0].runId, "RUN-SM-COMPLETE");
assert.match(first.selectionDenominator.provenanceHash, /^[a-f0-9]{64}$/);
assert.equal(Object.isFrozen(first), true);

const partial = await buildCandidateCapacityReceipt({
  capacityRunId: "CAP-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalAllocation,
  activeAllocation,
  selectionDenominator: partialDenominator,
});
assert.equal(partial.globalCount, first.globalCount, "same admissions fixture");
assert.equal(partial.selectionDenominator.denominatorState, "PARTIAL");
assert.notEqual(partial.selectionDenominator.provenanceHash, first.selectionDenominator.provenanceHash);
assert.notEqual(partial.capacityHash, first.capacityHash, "capacity identity must commit to denominator provenance");

const legacyUnknown = await buildCandidateCapacityReceipt({
  capacityRunId: "CAP-LEGACY-COMPAT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  capturedAt: "2026-09-27T07:31:00Z",
  globalAllocation,
  activeAllocation,
});
assert.equal(legacyUnknown.selectionDenominator.denominatorState, "UNKNOWN");
assert.ok(legacyUnknown.selectionDenominator.blockerCodes.includes("DENOMINATOR_PROVENANCE_NOT_PROVIDED"));

console.log("System2 candidate capacity receipt tests passed");
