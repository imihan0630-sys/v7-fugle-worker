import assert from "node:assert/strict";
import {
  buildMopsovAvailabilityObservationV0_1,
  summarizeMopsovAvailabilityObservationsV0_1,
} from "../runtime/mopsov_prospective_availability_observer_v0_1.mjs";

function row({
  date="2026-05-22",
  time="16:34:06",
  seqNo="2",
}={}) {
  return {
    date,
    time,
    seqNo,
    spokeDateRaw:date.replaceAll("-",""),
    spokeTimeRaw:time.replaceAll(":",""),
  };
}

const retrospective=buildMopsovAvailabilityObservationV0_1({
  controlId:"C1",
  row:row(),
  observedAt:"2026-10-04T03:00:00Z",
  observationMode:"RETROSPECTIVE_READBACK",
  payloadHash:"hash",
});
assert.equal(retrospective.state,"RETROSPECTIVE_SOURCE_CLOCK_ONLY");
assert.equal(retrospective.firstObservedAvailableAt,null);
assert.equal(retrospective.latencyUpperBoundFromSourceReportedSeconds,null);
assert.equal(retrospective.knownAtVersionClockCertified,false);

const prospectiveUpper=buildMopsovAvailabilityObservationV0_1({
  controlId:"C1",
  row:row({date:"2026-10-05",time:"10:00:00",seqNo:"1"}),
  observedAt:"2026-10-05T02:04:00Z",
  observationMode:"PROSPECTIVE_POLL",
});
assert.equal(prospectiveUpper.state,"PROSPECTIVE_FIRST_OBSERVED_UPPER_BOUND");
assert.equal(prospectiveUpper.latencyUpperBoundFromSourceReportedSeconds,240);
assert.equal(prospectiveUpper.precisionEligible,false);
assert.equal(prospectiveUpper.firstObservedAvailableAt,"2026-10-05T02:04:00.000Z");

const precise=buildMopsovAvailabilityObservationV0_1({
  controlId:"C2",
  row:row({date:"2026-10-05",time:"10:00:00",seqNo:"2"}),
  observedAt:"2026-10-05T02:04:00Z",
  observationMode:"PROSPECTIVE_POLL",
  priorObservation:{state:"NOT_OBSERVED",observedAt:"2026-10-05T02:00:00Z"},
});
assert.equal(precise.state,"PROSPECTIVE_FIRST_OBSERVED_WITH_BOUNDED_WINDOW");
assert.equal(precise.observationIntervalSeconds,240);
assert.equal(precise.precisionEligible,true);

const coarse=buildMopsovAvailabilityObservationV0_1({
  controlId:"C3",
  row:row({date:"2026-10-05",time:"10:00:00",seqNo:"3"}),
  observedAt:"2026-10-05T02:07:00Z",
  observationMode:"PROSPECTIVE_POLL",
  priorObservation:{state:"NOT_OBSERVED",observedAt:"2026-10-05T02:00:00Z"},
});
assert.equal(coarse.precisionEligible,false);

const beforeSource=buildMopsovAvailabilityObservationV0_1({
  controlId:"C4",
  row:row({date:"2026-10-05",time:"10:00:00",seqNo:"4"}),
  observedAt:"2026-10-05T01:59:59Z",
  observationMode:"PROSPECTIVE_POLL",
});
assert.equal(beforeSource.state,"OBSERVATION_PRECEDES_SOURCE_REPORTED_CLOCK");
assert.equal(beforeSource.firstObservedAvailableAt,null);

const invalidClock=buildMopsovAvailabilityObservationV0_1({
  controlId:"C5",
  row:{...row(),spokeTimeRaw:"999999"},
  observedAt:"2026-10-05T03:00:00Z",
  observationMode:"PROSPECTIVE_POLL",
});
assert.equal(invalidClock.state,"SOURCE_REPORTED_CLOCK_INVALID");

assert.throws(()=>buildMopsovAvailabilityObservationV0_1({
  controlId:"C6",
  row:row({date:"2026-10-05",time:"10:00:00",seqNo:"6"}),
  observedAt:"2026-10-05T02:04:00Z",
  observationMode:"PROSPECTIVE_POLL",
  priorObservation:{state:"NOT_OBSERVED",observedAt:"2026-10-05T02:05:00Z"},
}),/priorObservation cannot be later/);

const summary=summarizeMopsovAvailabilityObservationsV0_1([
  retrospective,prospectiveUpper,precise,coarse,beforeSource,invalidClock
]);
assert.equal(summary.measurementContractImplemented,true);
assert.equal(summary.prospectiveObservationCount,5);
assert.equal(summary.retrospectiveObservationCount,1);
assert.equal(summary.usableProspectiveObservationCount,3);
assert.equal(summary.precisionEligibleCount,1);
assert.equal(summary.publicAvailabilityLatencyCertified,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.pitReplayUseAsAvailableAtAuthorized,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log("mopsov prospective availability observer v0.1 tests PASS");
