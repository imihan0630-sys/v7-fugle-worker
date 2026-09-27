import assert from "node:assert/strict";
import { buildFactorObservation } from "../runtime/factor_snapshot.mjs";
import { buildFamilyAssessmentReceipt } from "../runtime/family_assessment_receipt.mjs";

function factor({
  id,
  version = "0.1",
  state = "KNOWN",
  pit = true,
  normalizedValue = 0.5,
  unknownReason,
}) {
  return buildFactorObservation({
    factorId: id,
    factorVersion: version,
    scope: "SYMBOL",
    scopeKey: "2330",
    marketDate: "2026-09-27",
    decisionTimestamp: "2026-09-27T07:30:00Z",
    state,
    rawValue: state === "KNOWN" ? 1 : null,
    normalizedValue: state === "KNOWN" ? normalizedValue : null,
    confidence: state === "KNOWN" ? 0.9 : null,
    provenance: {
      sourceId: "fixture",
      sourceName: "fixture",
      availableAt: "2026-09-27T07:00:00Z",
      capturedAt: "2026-09-27T07:10:00Z",
      pointInTimeEligible: pit,
    },
    normalization: {
      method: "BOUNDED_RATIO",
      normalizationVersion: "0.1",
    },
    unknownReason,
    qualityFlags: [],
  });
}

const trend = factor({ id: "TECH.TREND" });
const structure = factor({ id: "TECH.STRUCTURE" });
const optionalUnknown = factor({
  id: "TECH.AUX",
  state: "UNKNOWN",
  pit: false,
  unknownReason: "source pending",
});

const known = buildFamilyAssessmentReceipt({
  assessmentId: "A1",
  assessmentVersion: "0.1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  family: "TECHNICAL_STRUCTURE",
  requiredFactorRefs: ["TECH.TREND@0.1", "TECH.STRUCTURE@0.1"],
  optionalFactorRefs: ["TECH.AUX@0.1"],
  factorObservations: [trend, structure, optionalUnknown],
  thesisState: "SUPPORTIVE",
  reasons: ["fixture"],
  warnings: [],
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(known.observationState, "KNOWN");
assert.equal(known.thesisState, "SUPPORTIVE");

const missing = buildFamilyAssessmentReceipt({
  assessmentId: "A2",
  assessmentVersion: "0.1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  family: "TECHNICAL_STRUCTURE",
  requiredFactorRefs: ["TECH.TREND@0.1", "TECH.MISSING@0.1"],
  optionalFactorRefs: [],
  factorObservations: [trend],
  thesisState: "SUPPORTIVE",
  reasons: [],
  warnings: [],
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(missing.observationState, "UNKNOWN");
assert.equal(missing.thesisState, "INDETERMINATE");

const pitIneligible = factor({ id: "TECH.PIT_BAD", pit: false });
const pitBlocked = buildFamilyAssessmentReceipt({
  assessmentId: "A3",
  assessmentVersion: "0.1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  family: "TECHNICAL_STRUCTURE",
  requiredFactorRefs: ["TECH.PIT_BAD@0.1"],
  optionalFactorRefs: [],
  factorObservations: [pitIneligible],
  thesisState: "SUPPORTIVE",
  reasons: [],
  warnings: [],
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(pitBlocked.observationState, "UNKNOWN");
assert.equal(pitBlocked.thesisState, "INDETERMINATE");

console.log("System2 family assessment receipt tests passed");
