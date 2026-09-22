import assert from "node:assert/strict";
import { buildShadowProvenanceDiagnostic } from "./shadow_provenance_v8_8_2.js";

// Research-only invariant fixture.
// This freezes representative legacy outcome/coverage values before provenance
// diagnostics are inspected. The helper must be observational: it may explain
// missingness but must not mutate or redefine legacy outcome/coverage semantics.
const legacyOutcome = {
  horizons: {
    d1: { returnPct: 1.25, mfePct: 2.1, maePct: -0.4 },
    d3: null,
    d5: null,
    d10: null,
    d20: null
  }
};
const legacyCoverage = { d1: 1, d3: 0, d5: 0, d10: 0, d20: 0 };
const expectedOutcome = structuredClone(legacyOutcome);
const expectedCoverage = structuredClone(legacyCoverage);

const row = {
  scan_date: "2026-09-21",
  symbol: "FIXTURE",
  snapshot_json: JSON.stringify({ price: { close: 100 } })
};
const historyRow = {
  history_json: JSON.stringify([
    { date: "2026-09-22", open: 100, high: 102, low: 99, close: 101.25 }
  ])
};

const diagnostic = buildShadowProvenanceDiagnostic({ row, historyRow, outcome: legacyOutcome });

// Frozen legacy outputs remain byte-for-byte equivalent after diagnostics.
assert.deepEqual(legacyOutcome, expectedOutcome);
assert.deepEqual(legacyCoverage, expectedCoverage);

// Provenance is additive and conservative: an existing finite D1 outcome wins;
// later horizons with insufficient observed bars are not coerced to BAD/0.
assert.equal(diagnostic.horizons.d1, "OUTCOME_AVAILABLE");
assert.equal(diagnostic.horizons.d3, "OBSERVED_HISTORY_INSUFFICIENT");
assert.equal(diagnostic.calendarMaturity, "UNKNOWN");
assert.equal(diagnostic.postScanValidBars, 1);

// Malformed evidence is diagnosed without rewriting the frozen legacy outputs.
const malformed = buildShadowProvenanceDiagnostic({
  row: { ...row, snapshot_json: "{" },
  historyRow,
  outcome: legacyOutcome
});
assert.equal(malformed.snapshotStatus, "SNAPSHOT_PARSE_ERROR");
assert.equal(malformed.horizons.d1, "OUTCOME_AVAILABLE");
assert.deepEqual(legacyOutcome, expectedOutcome);
assert.deepEqual(legacyCoverage, expectedCoverage);

console.log("shadow provenance observational regression fixture: PASS");
