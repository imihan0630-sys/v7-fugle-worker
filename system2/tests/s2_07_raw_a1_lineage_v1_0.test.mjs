import assert from "node:assert/strict";
import {
  evaluateRawA1LineageV1_0,
  summarizeRawA1LineageV1_0,
} from "../runtime/s2_07_raw_a1_lineage_v1_0.mjs";

const marketSessions = [
  "2026-03-31",
  "2026-04-01",
  "2026-04-02",
  "2026-04-07",
  "2026-04-08",
  "2026-04-09",
  "2026-04-10",
  "2026-04-13",
];

const nativeSessionEvidence = {
  state: "BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY",
  market: "TPEX",
  symbol: "5381",
  family: "CAPITAL_REDUCTION",
  stopTradingStart: "2026-04-01",
  resumeTradingDate: "2026-04-13",
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  sourceRowHash: "a".repeat(64),
};

function rawRow(date, suffix, overrides = {}) {
  return {
    barId: "S2H-A1-" + suffix,
    canonicalKey: ["TPEX", "5381", date, "RAW"].join("|"),
    marketDate: date,
    market: "TPEX",
    symbol: "5381",
    priceSpace: "RAW",
    continuityState: "UNVERIFIED",
    sourceId: "A1_TPEX_OFFICIAL_HISTORY",
    sourceName: "TPEx",
    sourceUrl: "https://example.invalid/tpex",
    sourceRowHash: ("b" + suffix).padEnd(64, "b").slice(0, 64),
    observedAt: date + "T12:00:00Z",
    availableAt: date + "T06:00:00Z",
    pitAvailabilityClass: "CONSERVATIVE_SESSION_FINALITY",
    pitReplayEligible: true,
    capturedAt: "2026-10-07T00:00:00Z",
    barHash: ("c" + suffix).padEnd(64, "c").slice(0, 64),
    schemaVersion: "S2_HISTORICAL_A1_BAR_V0_2",
    ...overrides,
  };
}

const valid = evaluateRawA1LineageV1_0({
  nativeSessionEvidence,
  marketSessions,
  rawA1Rows: [
    rawRow("2026-03-31", "prior"),
    rawRow("2026-04-13", "resume"),
  ],
});
assert.equal(valid.state, "BOUNDED_RAW_A1_LINEAGE_READY");
assert.equal(valid.rawA1LineageBound, true);
assert.equal(valid.previousOfficialSession, "2026-03-31");
assert.deepEqual(valid.suspendedOfficialSessions, [
  "2026-04-01",
  "2026-04-02",
  "2026-04-07",
  "2026-04-08",
  "2026-04-09",
  "2026-04-10",
]);
assert.equal(valid.suspendedRawA1RowCount, 0);
assert.equal(valid.preSuspensionBar.marketDate, "2026-03-31");
assert.equal(valid.resumeBar.marketDate, "2026-04-13");
assert.equal(valid.preSuspensionBar.continuityState, "UNVERIFIED");
assert.equal(valid.resumeBar.continuityState, "UNVERIFIED");
assert.equal(valid.rawBarsMutated, false);
assert.equal(valid.adjustedPriceGenerated, false);
assert.equal(valid.continuityTransformPerformed, false);
assert.equal(valid.technicalContinuityCertified, false);
assert.equal(valid.selectionAuthority, false);
assert.equal(valid.orderImpact, false);

const leakedSuspensionBar = evaluateRawA1LineageV1_0({
  nativeSessionEvidence,
  marketSessions,
  rawA1Rows: [
    rawRow("2026-03-31", "prior"),
    rawRow("2026-04-08", "leak"),
    rawRow("2026-04-13", "resume"),
  ],
});
assert.equal(leakedSuspensionBar.rawA1LineageBound, false);
assert.ok(leakedSuspensionBar.blockers.includes("SUSPENDED_SESSION_RAW_A1_BAR_PRESENT"));

const missingResume = evaluateRawA1LineageV1_0({
  nativeSessionEvidence,
  marketSessions,
  rawA1Rows: [rawRow("2026-03-31", "prior")],
});
assert.equal(missingResume.rawA1LineageBound, false);
assert.ok(missingResume.blockers.includes("RESUME_RAW_A1_BAR_MISSING"));

const ambiguousResume = evaluateRawA1LineageV1_0({
  nativeSessionEvidence,
  marketSessions,
  rawA1Rows: [
    rawRow("2026-03-31", "prior"),
    rawRow("2026-04-13", "resume-a"),
    rawRow("2026-04-13", "resume-b", { barHash: "d".repeat(64) }),
  ],
});
assert.equal(ambiguousResume.rawA1LineageBound, false);
assert.ok(ambiguousResume.blockers.includes("RAW_A1_REVISION_AMBIGUITY"));
assert.ok(ambiguousResume.blockers.includes("RESUME_RAW_A1_BAR_NOT_UNIQUE"));

const badNative = evaluateRawA1LineageV1_0({
  nativeSessionEvidence: {
    ...nativeSessionEvidence,
    state: "NATIVE_SYMBOL_SESSION_EVIDENCE_BLOCKED",
  },
  marketSessions,
  rawA1Rows: [
    rawRow("2026-03-31", "prior"),
    rawRow("2026-04-13", "resume"),
  ],
});
assert.equal(badNative.rawA1LineageBound, false);
assert.ok(badNative.blockers.includes("NATIVE_SYMBOL_SESSION_EVIDENCE_NOT_READY"));

const badProvenance = evaluateRawA1LineageV1_0({
  nativeSessionEvidence,
  marketSessions,
  rawA1Rows: [
    rawRow("2026-03-31", "prior"),
    rawRow("2026-04-13", "resume", {
      availableAt: null,
      pitReplayEligible: false,
      canonicalKey: "WRONG",
    }),
  ],
});
assert.equal(badProvenance.rawA1LineageBound, false);
assert.ok(badProvenance.blockers.includes("RAW_A1_CANONICAL_KEY_MISMATCH"));
assert.ok(badProvenance.blockers.includes("RAW_A1_PIT_PROVENANCE_NOT_READY"));

const summary = summarizeRawA1LineageV1_0([
  valid,
  leakedSuspensionBar,
  missingResume,
  ambiguousResume,
]);
assert.equal(summary.caseCount, 4);
assert.equal(summary.rawA1LineageReadyCount, 1);
assert.equal(summary.blockedCount, 3);
assert.deepEqual(summary.readySymbols, ["5381"]);
assert.equal(summary.rawA1LineageBoundForAllCases, false);
assert.equal(summary.technicalContinuityCertified, false);
assert.equal(summary.rawBarsMutated, false);
assert.equal(summary.system1RuntimeUsed, false);

console.log("S2-07 RAW A1 lineage V1.0 tests PASS");
