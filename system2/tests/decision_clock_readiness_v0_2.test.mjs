import assert from "node:assert/strict";
import { assessDecisionClockReadinessV02 } from "../runtime/decision_clock_readiness_v0_2.mjs";

function row(index, { ready = true, precise = true, upper = 15 } = {}) {
  return {
    evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
    marketDate: `2026-10-${String(index + 1).padStart(2, "0")}`,
    requiredReady: ready,
    precisionEligible: precise,
    worstObservedRequiredUpperBoundMinutes: ready ? upper : null,
  };
}

const provisional = assessDecisionClockReadinessV02({
  dailyEvidence: Array.from({ length: 10 }, (_, i) => row(i)),
});
assert.equal(provisional.status, "PROVISIONAL_ELIGIBLE");
assert.equal(provisional.candidateTaipeiTime, "14:00");
assert.equal(provisional.candidateIsAuthorizedDecisionClock, false);

const freeze = assessDecisionClockReadinessV02({
  dailyEvidence: Array.from({ length: 20 }, (_, i) => row(i, { upper: i === 19 ? 20 : 15 })),
});
assert.equal(freeze.status, "FREEZE_ELIGIBLE");
assert.equal(freeze.independentTradingDates, 20);
assert.equal(freeze.candidateTaipeiTime, "14:05");
assert.equal(freeze.cronAuthorized, false);

const imprecise = assessDecisionClockReadinessV02({
  dailyEvidence: Array.from({ length: 20 }, (_, i) =>
    row(i, { precise: i !== 5 })),
});
assert.equal(imprecise.status, "PROVISIONAL_ELIGIBLE");
assert.equal(imprecise.allPrecise, false);

const incomplete = assessDecisionClockReadinessV02({
  dailyEvidence: Array.from({ length: 10 }, (_, i) =>
    row(i, { ready: i !== 2 })),
});
assert.equal(incomplete.status, "INCOMPLETE_REQUIRED_EVIDENCE");

console.log("System2 decision-clock readiness V0.2 tests passed");
