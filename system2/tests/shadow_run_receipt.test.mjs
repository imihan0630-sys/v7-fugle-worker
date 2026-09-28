import assert from "node:assert/strict";
import { buildShadowRunReceipt } from "../runtime/shadow_run_receipt.mjs";

const complete = buildShadowRunReceipt({
  runId: "RUN-1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  shadowSpecId: "S2-SM-LS-001",
  universeVersion: "TW-EQUITY-V0",
  baseUniverseSymbols: ["1101", "2330", "3008", "2454", "0050"],
  excludedSymbols: ["0050"],
  eligibleUniverseSymbols: ["1101", "2330", "3008", "2454"],
  symbolAccounts: [
    { symbol: "1101", state: "WATCH", decisionId: "D1", reasons: ["fixture"] },
    { symbol: "2330", state: "QUALIFIED_NOT_SELECTED", decisionId: "D2", reasons: ["fixture"] },
    { symbol: "3008", state: "INCOMPLETE", decisionId: "D3", reasons: ["fixture"] },
    { symbol: "2454", state: "SELECTED", decisionId: "D4", reasons: ["fixture"] },
  ],
  warnings: [],
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(complete.runState, "COMPLETE");
assert.equal(complete.completionRate, 1);
assert.equal(complete.baseUniverseCount, 5);
assert.equal(complete.excludedCount, 1);
assert.equal(complete.eligibleCount, 4);
assert.equal(complete.stateCounts.INCOMPLETE, 1);
assert.equal(complete.stateCounts.QUALIFIED_NOT_SELECTED, 1);
assert.equal(complete.stateCounts.SELECTED, 1);

const incomplete = buildShadowRunReceipt({
  runId: "RUN-2",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  shadowSpecId: "S2-SM-LS-001",
  universeVersion: "TW-EQUITY-V0",
  baseUniverseSymbols: ["1101", "2330"],
  excludedSymbols: [],
  eligibleUniverseSymbols: ["1101", "2330"],
  symbolAccounts: [
    { symbol: "1101", state: "WATCH", reasons: ["fixture"] },
  ],
  warnings: [],
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(incomplete.runState, "INCOMPLETE");
assert.equal(incomplete.completionRate, 0.5);
assert.deepEqual(incomplete.unaccountedSymbols, ["2330"]);

assert.throws(
  () =>
    buildShadowRunReceipt({
      ...complete,
      runId: "RUN-BAD",
      baseUniverseSymbols: ["1101", "2330"],
      excludedSymbols: ["1101"],
      eligibleUniverseSymbols: ["1101"],
      symbolAccounts: [],
    }),
  /both excluded and eligible/,
);

console.log("System2 Shadow run receipt tests passed");
