import assert from "node:assert/strict";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";

const expected = [
  { sourceId: "OHLCV", sourceVersion: "0.1", role: "REQUIRED" },
  { sourceId: "TAIEX", sourceVersion: "0.1", role: "OPTIONAL" },
];

const ready = await buildShadowSourceSessionReceipt({
  receiptId: "S1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  expectedSources: expected,
  observedSources: [
    {
      sourceId: "OHLCV",
      sourceVersion: "0.1",
      state: "KNOWN",
      availableAt: "2026-09-27T07:00:00Z",
      capturedAt: "2026-09-27T07:10:00Z",
      pointInTimeEligible: true,
      payloadHash: "h1",
    },
  ],
  capturedAt: "2026-09-27T07:31:00Z",
});
assert.equal(ready.sourceSessionState, "SOURCE_SESSION_READY");
assert.equal(ready.requiredBlockers.length, 0);
assert.equal(ready.optionalGaps.length, 1);
assert.equal(ready.outcomeJoinSourceEligible, true);

const missingRequired = await buildShadowSourceSessionReceipt({
  receiptId: "S2",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  expectedSources: expected,
  observedSources: [],
  capturedAt: "2026-09-27T07:31:00Z",
});
assert.equal(missingRequired.sourceSessionState, "SOURCE_SESSION_INCOMPLETE");
assert.equal(missingRequired.outcomeJoinSourceEligible, false);
assert.equal(missingRequired.requiredBlockers[0].sourceId, "OHLCV");

const futureLeak = await buildShadowSourceSessionReceipt({
  receiptId: "S3",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  expectedSources: expected,
  observedSources: [
    {
      sourceId: "OHLCV",
      sourceVersion: "0.1",
      state: "KNOWN",
      availableAt: "2026-09-27T08:00:00Z",
      capturedAt: "2026-09-27T08:01:00Z",
      pointInTimeEligible: true,
    },
  ],
  capturedAt: "2026-09-27T08:02:00Z",
});
assert.equal(futureLeak.sourceSessionState, "SOURCE_SESSION_INCOMPLETE");
assert.equal(futureLeak.requiredBlockers[0].readiness, "PIT_FUTURE_VIOLATION");

console.log("System2 Shadow source-session receipt tests passed");
