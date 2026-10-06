import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  buildOfficialContinuitySourceUrlsV0_1,
} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {
  parseOfficialHistoricalContinuityPayloadV0_1,
} from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {
  parseMopsHistoricalMaterialInformationHtmlV0_1,
} from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {
  evaluateReferenceEventHistoricalAvailabilityV1_2,
} from "../runtime/s2_07_reference_event_availability_v1_2.mjs";

const START = "2026-09-22";
const END = "2026-10-02";
const SYMBOL = "4806";
const MOPS_URL = "https://mopsov.twse.com.tw/mops/web/ajax_t05st01";

async function fetchTextWithRetry(url, {attempts = 4, timeoutMs = 30000} = {}) {
  let last = null;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json,text/plain,*/*",
          "user-agent": "System2-S2-07-Reference-Event-Availability/1.2",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const raw = await response.text();
      if (response.ok) return {response, raw};
      last = new Error("HTTP " + response.status);
    } catch (error) {
      last = error;
    }
    if (i < attempts) await new Promise((resolve) => setTimeout(resolve, 500 * i));
  }
  throw last || new Error("official-source fetch failed");
}

function curlHistory(rocYear) {
  const args = [
    "--fail", "--silent", "--show-error", "--location", "--max-time", "30",
    "--retry", "3", "--retry-delay", "1",
    "--request", "POST",
    "--header", "Content-Type: application/x-www-form-urlencoded",
    "--header", "Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header", "User-Agent: System2-S2-07-Reference-Event-Availability/1.2",
    "--data-urlencode", "firstin=1",
    "--data-urlencode", "step=1",
    "--data-urlencode", "TYPEK=all",
    "--data-urlencode", "co_id=" + SYMBOL,
    "--data-urlencode", "year=" + rocYear,
    "--data-urlencode", "month=all",
    "--data-urlencode", "b_date=",
    "--data-urlencode", "e_date=",
    MOPS_URL,
  ];
  const process = spawnSync("curl", args, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  assert.equal(process.status, 0, String(process.stderr || process.error || "MOPS curl failed"));
  const parsed = parseMopsHistoricalMaterialInformationHtmlV0_1({
    html: process.stdout,
    stockCode: SYMBOL,
    expectedDate: null,
    baseSubject: null,
  });
  return [...(parsed.rows || [])].filter((row) => row.date && row.time && row.seqNo);
}

const sources = buildOfficialContinuitySourceUrlsV0_1({
  startDate: START,
  endDate: END,
});
const source = sources.TPEX_CAPITAL_REDUCTION_REFERENCE;
assert.ok(source, "TPEX capital reduction reference source missing");

const fetched = await fetchTextWithRetry(source.url);
const parsed = await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  sourceUrl: source.url,
  rawText: fetched.raw,
  fetchedAt: new Date().toISOString(),
  requestedStartDate: START,
  requestedEndDate: END,
});
assert.equal(parsed.responseRangeVerified, true);
assert.equal(parsed.parserComplete, true);

const officialMatches = parsed.events.filter((event) =>
  event.symbol === SYMBOL
  && event.actionFamilyId === "CAPITAL_REDUCTION"
  && event.effectiveDate === END
);
assert.equal(officialMatches.length, 1, "expected exactly one 4806 / 2026-10-02 reference event");
const officialEvent = officialMatches[0];
assert.equal(officialEvent.knowledgeTimeMode, "HISTORICAL_UNKNOWN");
assert.equal(officialEvent.firstKnownAt, null);
assert.equal(officialEvent.availableAt, null);
assert.equal(officialEvent.pitEventReplayEligible, false);

const mopsRows = [
  ...curlHistory(114),
  ...curlHistory(115),
];

const result = evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent,
  mopsRows,
  replayCutoffAt: "2026-10-02T15:30:00+08:00",
  independentAvailabilityEvidence: [],
});

assert.equal(result.state, "REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN");
assert.ok(result.mopsRelevantRowCount > 0, "expected historical 4806 capital-reduction MOPS rows");
assert.equal(
  result.mopsSourceReportedClockEligibleCount,
  result.mopsRelevantRowCount,
  "all bounded MOPS rows must retain valid source-reported clocks",
);
assert.equal(result.mopsRetrospectiveOnlyCount, result.mopsRelevantRowCount);
assert.equal(result.independentEvidenceCount, 0);
assert.equal(result.independentlyReadyEvidenceCount, 0);
assert.equal(result.sourceReportedClockPromotedToAvailableAt, false);
assert.equal(result.retrospectiveReadbackPromotedToFirstObservedAt, false);
assert.equal(result.firstKnownAt, null);
assert.equal(result.availableAt, null);
assert.equal(result.pitEventReplayEligible, false);
assert.equal(
  result.pitReplayBlocker,
  "OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN",
);
assert.equal(result.knownAtVersionClockCertified, false);
assert.equal(result.technicalContinuityCertified, false);
assert.equal(result.historyMutationPerformed, false);
assert.equal(result.selectionAuthority, false);
assert.equal(result.finalSelectionEnabled, false);
assert.equal(result.livePushEnabled, false);
assert.equal(result.capitalImpact, false);
assert.equal(result.orderImpact, false);
assert.equal(result.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: "S2_07_REFERENCE_EVENT_AVAILABILITY_V1_2_COMPLETE",
  officialSource: {
    sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
    eventVersionId: officialEvent.eventVersionId,
    sourceRowHash: officialEvent.sourceRowHash,
    knowledgeTimeMode: officialEvent.knowledgeTimeMode,
  },
  availabilityGate: result,
  mutationPerformed: false,
}, null, 2));
