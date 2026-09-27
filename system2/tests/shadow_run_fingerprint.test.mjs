import assert from "node:assert/strict";
import { buildShadowRunFingerprint } from "../runtime/shadow_run_fingerprint.mjs";

const sourceReady = {
  sourceSessionHash: "source-hash",
  sourceSessionState: "SOURCE_SESSION_READY",
};

const runComplete = {
  runId: "RUN1",
  runState: "COMPLETE",
  symbolAccounts: [{ symbol: "2330", state: "WATCH" }],
};

const first = await buildShadowRunFingerprint({
  fingerprintId: "FP1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  shadowSpecId: "S2-SM-LS-001",
  universeVersion: "TW-EQUITY-V0",
  sourceSessionReceipt: sourceReady,
  shadowRunReceipt: runComplete,
  decisionHashes: ["d2", "d1"],
  orderingHashes: ["o1"],
  rankingExperimentHashes: [],
  capacityHash: "cap1",
  lifecycleHashes: ["l2", "l1"],
  capturedAt: "2026-09-27T07:31:00Z",
});

const second = await buildShadowRunFingerprint({
  fingerprintId: "FP1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  shadowSpecId: "S2-SM-LS-001",
  universeVersion: "TW-EQUITY-V0",
  sourceSessionReceipt: sourceReady,
  shadowRunReceipt: runComplete,
  decisionHashes: ["d1", "d2"],
  orderingHashes: ["o1"],
  rankingExperimentHashes: [],
  capacityHash: "cap1",
  lifecycleHashes: ["l1", "l2"],
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(first.runFingerprintHash, second.runFingerprintHash);
assert.equal(first.runFingerprintState, "RUN_FINGERPRINT_COMPLETE");
assert.equal(first.outcomeJoinEligible, true);
assert.deepEqual(first.decisionHashes, ["d1", "d2"]);

const blocked = await buildShadowRunFingerprint({
  fingerprintId: "FP2",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  shadowSpecId: "S2-SM-LS-001",
  universeVersion: "TW-EQUITY-V0",
  sourceSessionReceipt: {
    sourceSessionHash: "source-bad",
    sourceSessionState: "SOURCE_SESSION_INCOMPLETE",
  },
  shadowRunReceipt: {
    runId: "RUN2",
    runState: "INCOMPLETE",
  },
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(blocked.runFingerprintState, "RUN_FINGERPRINT_INCOMPLETE");
assert.equal(blocked.outcomeJoinEligible, false);
assert.ok(blocked.blockers.includes("SOURCE_SESSION_INCOMPLETE"));
assert.ok(blocked.blockers.includes("SHADOW_RUN_ACCOUNTING_INCOMPLETE"));

console.log("System2 Shadow run fingerprint tests passed");
