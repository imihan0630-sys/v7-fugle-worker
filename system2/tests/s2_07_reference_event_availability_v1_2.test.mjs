import assert from "node:assert/strict";
import {
  evaluateReferenceEventHistoricalAvailabilityV1_2,
} from "../runtime/s2_07_reference_event_availability_v1_2.mjs";

const officialEvent = {
  exchange: "TPEX",
  symbol: "4806",
  actionFamilyId: "CAPITAL_REDUCTION",
  effectiveDate: "2026-10-02",
  eventVersionId: "S2-CA-EVENT:test",
  sourceRowHash: "reference-row-hash-test",
  continuityEffect: {subtype: "彌補虧損"},
  knowledgeTimeMode: "HISTORICAL_UNKNOWN",
  firstKnownAt: null,
  availableAt: null,
  pitEventReplayEligible: false,
  actualResultVerified: true,
  technicalContinuityEvidenceEligible: true,
  continuityEffectState: "VERIFIED",
};

const rows = [
  {
    date: "2026-02-24",
    time: "10:00:00",
    seqNo: "1",
    spokeDateRaw: "20260224",
    spokeTimeRaw: "100000",
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

const blocked = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent,
  mopsRows: rows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
});
assert.equal(blocked.state, "REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN");
assert.equal(blocked.mopsRelevantRowCount, 2);
assert.equal(blocked.mopsSourceReportedClockEligibleCount, 2);
assert.equal(blocked.mopsRetrospectiveOnlyCount, 2);
assert.equal(blocked.sourceReportedClockPromotedToAvailableAt, false);
assert.equal(blocked.retrospectiveReadbackPromotedToFirstObservedAt, false);
assert.equal(blocked.firstKnownAt, null);
assert.equal(blocked.availableAt, null);
assert.equal(blocked.pitEventReplayEligible, false);
assert.equal(
  blocked.pitReplayBlocker,
  "OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN",
);
assert.ok(blocked.blockers.includes("INDEPENDENT_HISTORICAL_PUBLIC_AVAILABILITY_NOT_PROVEN"));
assert.equal(blocked.technicalContinuityCertified, false);
assert.equal(blocked.selectionAuthority, false);
assert.equal(blocked.system1RuntimeUsed, false);

const lateObserver = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent,
  mopsRows: rows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
  independentAvailabilityEvidence: [{
    evidenceClass: "PROSPECTIVE_EXACT_VERSION_OBSERVER",
    exactVersionIdentity: true,
    publicAvailabilityObserved: true,
    availableAt: "2026-10-07T00:00:00+08:00",
  }],
});
assert.equal(lateObserver.historicalAvailabilityProven, false);
assert.equal(lateObserver.independentlyReadyEvidenceCount, 0);

const hypotheticalAuthoritative = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent,
  mopsRows: rows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
  independentAvailabilityEvidence: [{
    evidenceClass: "AUTHORITATIVE_PUBLICATION_TIME_CONTRACT",
    exactVersionIdentity: true,
    publicationSemanticsCertified: true,
    availableAt: "2026-09-30T09:00:00+08:00",
    sourceId: "HYPOTHETICAL_OFFICIAL_CONTRACT",
    evidenceId: "fixture-only",
    referenceEventVersionId: "S2-CA-EVENT:test",
    referenceSourceRowHash: "reference-row-hash-test",
  }],
});
assert.equal(
  hypotheticalAuthoritative.state,
  "REFERENCE_EVENT_HISTORICAL_AVAILABILITY_PROVEN",
);
assert.equal(hypotheticalAuthoritative.pitEventReplayEligible, true);
assert.equal(
  hypotheticalAuthoritative.availableAt,
  "2026-09-30T01:00:00.000Z",
);
assert.equal(hypotheticalAuthoritative.knownAtVersionClockCertified, false);
assert.equal(hypotheticalAuthoritative.technicalContinuityCertified, false);

const wrongEvent = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent: {...officialEvent, symbol: "9999"},
  mopsRows: rows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
});
assert.equal(wrongEvent.historicalAvailabilityProven, false);
assert.ok(wrongEvent.blockers.includes("REFERENCE_EVENT_IDENTITY_OUT_OF_SCOPE"));

console.log("S2-07 reference-event historical availability V1.2 tests PASS");
