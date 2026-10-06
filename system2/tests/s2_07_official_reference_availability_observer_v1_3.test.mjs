import assert from "node:assert/strict";
import {
  buildOfficialReferenceAvailabilityObservationV1_3,
  evaluateOfficialReferenceAvailabilityByCutoffV1_3,
  summarizeOfficialReferenceAvailabilityObservationsV1_3,
} from "../runtime/s2_07_official_reference_availability_observer_v1_3.mjs";
import {
  evaluateReferenceEventHistoricalAvailabilityV1_2,
} from "../runtime/s2_07_reference_event_availability_v1_2.mjs";

const event = {
  exchange: "TPEX",
  symbol: "4806",
  actionFamilyId: "CAPITAL_REDUCTION",
  effectiveDate: "2026-10-02",
  eventVersionId: "S2-CA-EVENT:observation-a",
  semanticHash: "semantic-hash-stable",
  sourceRowHash: "source-row-hash-stable",
  continuityEffect: {subtype: "彌補虧損"},
  actualResultVerified: true,
  technicalContinuityEvidenceEligible: true,
  continuityEffectState: "VERIFIED",
  knowledgeTimeMode: "HISTORICAL_UNKNOWN",
  firstKnownAt: null,
  availableAt: null,
};

const retrospective = await buildOfficialReferenceAvailabilityObservationV1_3({
  event,
  observedAt: "2026-10-07T00:00:00+08:00",
  observationMode: "RETROSPECTIVE_READBACK",
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
});
assert.equal(retrospective.state, "RETROSPECTIVE_REFERENCE_ROW_ONLY");
assert.equal(retrospective.publicAvailabilityObserved, false);
assert.equal(retrospective.availableAt, null);
assert.equal(retrospective.observationVersionIdUsedAsStableIdentity, false);

const upper = await buildOfficialReferenceAvailabilityObservationV1_3({
  event,
  observedAt: "2026-10-07T06:00:00+08:00",
  observationMode: "PROSPECTIVE_POLL",
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
});
assert.equal(upper.evidenceClass, "PROSPECTIVE_EXACT_VERSION_OBSERVER");
assert.equal(upper.firstObservedAt, "2026-10-06T22:00:00.000Z");
assert.equal(upper.availableAt, upper.firstObservedAt);
assert.equal(upper.precisionEligible, false);
assert.equal(upper.knownAtVersionClockCertified, false);

const precise = await buildOfficialReferenceAvailabilityObservationV1_3({
  event,
  observedAt: "2026-10-07T06:04:00+08:00",
  observationMode: "PROSPECTIVE_POLL",
  priorObservation: {
    state: "NOT_OBSERVED",
    observedAt: "2026-10-07T06:00:00+08:00",
  },
});
assert.equal(precise.precisionEligible, true);
assert.equal(precise.observationIntervalSeconds, 240);

const eventObservationB = {...event, eventVersionId: "S2-CA-EVENT:observation-b"};
const repeated = await buildOfficialReferenceAvailabilityObservationV1_3({
  event: eventObservationB,
  observedAt: "2026-10-07T07:00:00+08:00",
  observationMode: "PROSPECTIVE_POLL",
  priorObservation: {
    ...upper,
    state: "OBSERVED",
    observedAt: upper.observedAt,
  },
});
assert.equal(repeated.firstObservedAt, upper.firstObservedAt);
assert.equal(repeated.referenceObservationVersionId, "S2-CA-EVENT:observation-b");
assert.equal(repeated.stableReferenceKey, upper.stableReferenceKey);

await assert.rejects(
  buildOfficialReferenceAvailabilityObservationV1_3({
    event: {...event, sourceRowHash: "different-row"},
    observedAt: "2026-10-07T07:00:00+08:00",
    observationMode: "PROSPECTIVE_POLL",
    priorObservation: {
      ...upper,
      state: "OBSERVED",
      observedAt: upper.observedAt,
    },
  }),
  /stable reference identity mismatch/,
);

const beforeHistoricalCutoff = evaluateOfficialReferenceAvailabilityByCutoffV1_3({
  observation: upper,
  cutoffAt: "2026-10-02T15:30:00+08:00",
});
assert.equal(beforeHistoricalCutoff.availabilityByCutoffProven, false);

const byLaterCutoff = evaluateOfficialReferenceAvailabilityByCutoffV1_3({
  observation: upper,
  cutoffAt: "2026-10-07T06:00:00+08:00",
});
assert.equal(byLaterCutoff.availabilityByCutoffProven, true);
assert.equal(byLaterCutoff.precisionRequiredForEligibility, false);

const mopsRows = [
  {
    date: "2026-02-24",
    time: "16:28:25",
    seqNo: "3",
    spokeDateRaw: "20260224",
    spokeTimeRaw: "162825",
    rowText: "公告本公司董事會決議辦理減資股本彌補虧損案",
  },
  {
    date: "2026-05-29",
    time: "10:00:00",
    seqNo: "1",
    spokeDateRaw: "20260529",
    spokeTimeRaw: "100000",
    rowText: "本公司辦理減資彌補虧損致債權人公告",
  },
];

const historicalStillBlocked = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent: event,
  mopsRows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
  independentAvailabilityEvidence: [upper],
});
assert.equal(historicalStillBlocked.pitEventReplayEligible, false);
assert.equal(
  historicalStillBlocked.pitReplayBlocker,
  "OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN",
);

const genuinelyPreCutObservation = await buildOfficialReferenceAvailabilityObservationV1_3({
  event,
  observedAt: "2026-09-30T09:00:00+08:00",
  observationMode: "PROSPECTIVE_POLL",
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
});
const hypotheticalFutureArchitectureProof = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent: event,
  mopsRows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
  independentAvailabilityEvidence: [genuinelyPreCutObservation],
});
assert.equal(hypotheticalFutureArchitectureProof.pitEventReplayEligible, true);
assert.equal(
  hypotheticalFutureArchitectureProof.availableAt,
  "2026-09-30T01:00:00.000Z",
);
assert.equal(hypotheticalFutureArchitectureProof.knownAtVersionClockCertified, false);
assert.equal(hypotheticalFutureArchitectureProof.technicalContinuityCertified, false);

const summary = summarizeOfficialReferenceAvailabilityObservationsV1_3([
  retrospective,
  upper,
  precise,
  repeated,
]);
assert.equal(summary.prospectiveObservationCount, 3);
assert.equal(summary.retrospectiveObservationCount, 1);
assert.equal(summary.usableProspectiveObservationCount, 3);
assert.equal(summary.highFrequencyPollingIntrinsicallyRequired, false);
assert.equal(summary.selectedOnlyCaptureAuthorized, false);
assert.equal(summary.scheduleAdded, false);
assert.equal(summary.selectionAuthority, false);
assert.equal(summary.system1RuntimeUsed, false);

console.log("S2-07 official reference availability observer V1.3 tests PASS");
