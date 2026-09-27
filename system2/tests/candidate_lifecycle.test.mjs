import assert from "node:assert/strict";
import {
  buildCandidateLifecycleTransitionReceipt,
  buildReentryCandidateEpisodeReceipt,
} from "../runtime/candidate_lifecycle.mjs";

const survivingMembership = {
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  strategyValidity: "VALID",
  observationValue: true,
  entryReadiness: "WATCH",
  decisionId: "D1",
  reasonCodes: ["THESIS_VALID"],
  evidenceRefs: [],
};

const failedMembership = {
  strategyId: "EVENT_DRIVEN",
  strategyVersion: "V0.1-CONTRACT",
  strategyValidity: "INVALIDATED",
  observationValue: false,
  entryReadiness: "BLOCKED",
  decisionId: "D2",
  reasonCodes: ["EVENT_EXPIRED"],
  evidenceRefs: [],
};

const retained = await buildCandidateLifecycleTransitionReceipt({
  lifecycleReceiptId: "L1",
  candidateEpisodeId: "E1",
  symbol: "2330",
  marketDate: "2026-09-27",
  transitionTimestamp: "2026-09-27T08:00:00Z",
  fromState: "CANDIDATE",
  toState: "WATCH",
  memberships: [survivingMembership, failedMembership],
  reasonCodes: ["ONE_MEMBERSHIP_SURVIVES"],
  evidenceRefs: [],
});
assert.equal(retained.capacityEligible, true);
assert.equal(retained.memberships.length, 2);

await assert.rejects(
  () =>
    buildCandidateLifecycleTransitionReceipt({
      lifecycleReceiptId: "L2",
      candidateEpisodeId: "E2",
      symbol: "3008",
      marketDate: "2026-09-27",
      transitionTimestamp: "2026-09-27T08:00:00Z",
      fromState: "CANDIDATE",
      toState: "WATCH",
      memberships: [failedMembership],
      reasonCodes: [],
      evidenceRefs: [],
    }),
  /requires at least one membership/,
);

const filled = await buildCandidateLifecycleTransitionReceipt({
  lifecycleReceiptId: "L3",
  candidateEpisodeId: "E3",
  symbol: "2454",
  marketDate: "2026-09-27",
  transitionTimestamp: "2026-09-27T08:00:00Z",
  fromState: "SIM_FILLED",
  toState: "POSITION_MONITOR",
  memberships: [survivingMembership],
  reasonCodes: ["SIM_FILL_CONFIRMED"],
  evidenceRefs: [],
});
assert.equal(filled.positionMonitor, true);
assert.equal(filled.capacityEligible, false);

await assert.rejects(
  () =>
    buildCandidateLifecycleTransitionReceipt({
      lifecycleReceiptId: "L4",
      candidateEpisodeId: "E4",
      symbol: "2454",
      marketDate: "2026-09-27",
      transitionTimestamp: "2026-09-27T08:00:00Z",
      fromState: "SIM_FILLED",
      toState: "WATCH",
      memberships: [survivingMembership],
      reasonCodes: [],
      evidenceRefs: [],
    }),
  /must transition to POSITION_MONITOR/,
);

await assert.rejects(
  () =>
    buildCandidateLifecycleTransitionReceipt({
      lifecycleReceiptId: "L5",
      candidateEpisodeId: "E5",
      symbol: "1101",
      marketDate: "2026-09-27",
      transitionTimestamp: "2026-09-27T08:00:00Z",
      fromState: "REMOVED",
      toState: "WATCH",
      memberships: [survivingMembership],
      reasonCodes: [],
      evidenceRefs: [],
    }),
  /create a new episode/,
);

const reentry = await buildReentryCandidateEpisodeReceipt({
  reentryReceiptId: "R1",
  symbol: "1101",
  previousEpisodeId: "E5",
  newEpisodeId: "E6",
  requalifiedDecisionId: "D6",
  reentryTimestamp: "2026-09-28T08:00:00Z",
  reasonCodes: ["REQUALIFIED"],
});
assert.notEqual(reentry.previousEpisodeId, reentry.newEpisodeId);

await assert.rejects(
  () =>
    buildReentryCandidateEpisodeReceipt({
      reentryReceiptId: "R2",
      symbol: "1101",
      previousEpisodeId: "E5",
      newEpisodeId: "E5",
      requalifiedDecisionId: "D6",
      reentryTimestamp: "2026-09-28T08:00:00Z",
      reasonCodes: [],
    }),
  /requires a new candidateEpisodeId/,
);

console.log("System2 candidate lifecycle tests passed");
