import assert from "node:assert/strict";
import { buildFactorObservation } from "../runtime/factor_snapshot.mjs";
import { buildInteractionObservationReceipt } from "../runtime/interaction_observation.mjs";

function factor(id, { state = "KNOWN", pit = true } = {}) {
  return buildFactorObservation({
    factorId: id,
    factorVersion: "0.1",
    scope: "SYMBOL",
    scopeKey: "2330",
    marketDate: "2026-09-27",
    decisionTimestamp: "2026-09-27T07:30:00Z",
    state,
    rawValue: state === "KNOWN" ? 1 : null,
    normalizedValue: state === "KNOWN" ? 0.5 : null,
    confidence: state === "KNOWN" ? 0.8 : null,
    provenance: {
      sourceId: "fixture",
      sourceName: "fixture",
      availableAt: "2026-09-27T07:00:00Z",
      capturedAt: "2026-09-27T07:10:00Z",
      pointInTimeEligible: pit,
    },
    normalization: {
      method: "BOOLEAN_STATE",
      normalizationVersion: "0.1",
    },
    unknownReason: state === "UNKNOWN" ? "missing" : undefined,
    qualityFlags: [],
  });
}

const tech = factor("TECH.BREAKOUT");
const pv = factor("PV.ACCEPTANCE");

const controlled = buildInteractionObservationReceipt({
  interactionReceiptId: "I1",
  interactionId: "BREAKOUT_ACCEPTANCE_CONFLUENCE",
  interactionVersion: "0.1",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  symbol: "2330",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  componentFactorRefs: ["TECH.BREAKOUT@0.1", "PV.ACCEPTANCE@0.1"],
  componentFamilyAssessmentIds: ["FA-TECH", "FA-PV"],
  factorObservations: [tech, pv],
  confluenceState: "SUPPORTIVE",
  redundancyState: "CONTROLLED_FOR_RESEARCH",
  falsificationTag: "RANK03",
  reasons: [],
  warnings: [],
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(controlled.state, "KNOWN");
assert.equal(controlled.rankingEligible, true);

const notTested = buildInteractionObservationReceipt({
  ...controlled,
  interactionReceiptId: "I2",
  factorObservations: [tech, pv],
  redundancyState: "NOT_TESTED",
});
assert.equal(notTested.state, "KNOWN");
assert.equal(notTested.rankingEligible, false);

const pitBad = factor("PV.PIT_BAD", { pit: false });
const blocked = buildInteractionObservationReceipt({
  ...controlled,
  interactionReceiptId: "I3",
  componentFactorRefs: ["TECH.BREAKOUT@0.1", "PV.PIT_BAD@0.1"],
  factorObservations: [tech, pitBad],
  confluenceState: "SUPPORTIVE",
  redundancyState: "CONTROLLED_FOR_RESEARCH",
});
assert.equal(blocked.state, "UNKNOWN");
assert.equal(blocked.confluenceState, "INDETERMINATE");
assert.equal(blocked.rankingEligible, false);

console.log("System2 interaction observation tests passed");
