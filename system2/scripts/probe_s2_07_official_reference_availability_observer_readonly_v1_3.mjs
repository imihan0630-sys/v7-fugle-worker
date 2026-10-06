import assert from "node:assert/strict";
import {
  buildOfficialContinuitySourceUrlsV0_1,
} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {
  parseOfficialHistoricalContinuityPayloadV0_1,
} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {
  buildOfficialReferenceAvailabilityObservationV1_3,
  evaluateOfficialReferenceAvailabilityByCutoffV1_3,
} from "../runtime/s2_07_official_reference_availability_observer_v1_3.mjs";

const START = "2026-09-22";
const END = "2026-10-02";
const SYMBOL = "4806";

async function fetchTextWithRetry(url, {attempts = 4, timeoutMs = 30000} = {}) {
  let last = null;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json,text/plain,*/*",
          "user-agent": "System2-S2-07-Official-Reference-Observer/1.3",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const raw = await response.text();
      if (response.ok) return {response, raw};
      last = new Error("HTTP " + response.status);
    } catch (error) {
      last = error;
    }
    if (i < attempts) {
      await new Promise((resolve) => setTimeout(resolve, 500 * i));
    }
  }
  throw last || new Error("official-source fetch failed");
}

const sources = buildOfficialContinuitySourceUrlsV0_1({
  startDate: START,
  endDate: END,
});
const source = sources.TPEX_CAPITAL_REDUCTION_REFERENCE;
assert.ok(source, "TPEX capital reduction reference source missing");

const observedAt = new Date().toISOString();
const fetched = await fetchTextWithRetry(source.url);
const parsed = await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  sourceUrl: source.url,
  rawText: fetched.raw,
  fetchedAt: observedAt,
  requestedStartDate: START,
  requestedEndDate: END,
});
assert.equal(parsed.responseRangeVerified, true);
assert.equal(parsed.parserComplete, true);

const matches = parsed.events.filter((event) =>
  event.symbol === SYMBOL
  && event.actionFamilyId === "CAPITAL_REDUCTION"
  && event.effectiveDate === END
);
assert.equal(matches.length, 1, "expected exactly one 4806 / 2026-10-02 reference event");
const event = matches[0];

const observation = await buildOfficialReferenceAvailabilityObservationV1_3({
  event,
  observedAt,
  observationMode: "PROSPECTIVE_POLL",
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  sourceUrl: source.url,
  payloadHash: parsed.payloadHash,
  sourceFetchId: "S2-07-V1.3-PHYSICAL",
});

assert.equal(observation.evidenceClass, "PROSPECTIVE_EXACT_VERSION_OBSERVER");
assert.equal(observation.publicAvailabilityObserved, true);
assert.equal(observation.firstObservedAt, observedAt);
assert.equal(observation.availableAt, observedAt);
assert.equal(observation.referenceSemanticHash, event.semanticHash);
assert.equal(observation.referenceSourceRowHash, event.sourceRowHash);
assert.equal(observation.observationVersionIdUsedAsStableIdentity, false);
assert.equal(observation.knownAtVersionClockCertified, false);
assert.equal(observation.technicalContinuityCertified, false);
assert.equal(observation.selectionAuthority, false);
assert.equal(observation.system1RuntimeUsed, false);

const historicalCutoff = evaluateOfficialReferenceAvailabilityByCutoffV1_3({
  observation,
  cutoffAt: "2026-10-02T15:30:00+08:00",
});
assert.equal(historicalCutoff.availabilityByCutoffProven, false);
assert.equal(
  historicalCutoff.blocker,
  "EXACT_REFERENCE_FIRST_OBSERVED_AFTER_OR_UNKNOWN_AT_CUTOFF",
);

const currentCutoff = evaluateOfficialReferenceAvailabilityByCutoffV1_3({
  observation,
  cutoffAt: observedAt,
});
assert.equal(currentCutoff.availabilityByCutoffProven, true);
assert.equal(currentCutoff.precisionRequiredForEligibility, false);

console.log(JSON.stringify({
  result: "S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_V1_3_COMPLETE",
  officialSource: {
    sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
    sourceUrl: source.url,
    payloadHash: parsed.payloadHash,
  },
  exactReference: {
    exchange: event.exchange,
    symbol: event.symbol,
    actionFamilyId: event.actionFamilyId,
    effectiveDate: event.effectiveDate,
    observationEventVersionId: event.eventVersionId,
    stableSemanticHash: event.semanticHash,
    stableSourceRowHash: event.sourceRowHash,
  },
  prospectiveObservation: observation,
  historical4806Cutoff: historicalCutoff,
  currentObservationCutoff: currentCutoff,
  scheduleAdded: false,
  historyMutationPerformed: false,
  system1RuntimeUsed: false,
}, null, 2));
