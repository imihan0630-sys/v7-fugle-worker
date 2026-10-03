import assert from "node:assert/strict";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";

const startDate = process.env.SYSTEM2_CA_START_DATE || "2026-04-05";
const endDate = process.env.SYSTEM2_CA_END_DATE || "2026-10-02";
const fetchedAt = new Date().toISOString();

const sources = buildOfficialContinuitySourceUrlsV0_1({ startDate, endDate });
const historical = Object.entries(sources).filter(([, source]) =>
  source.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE"
);
assert.equal(historical.length, 6, "expected six official historical continuity sources");

const results = [];

for (const [sourceId, source] of historical) {
  const response = await fetch(source.url, {
    method: "GET",
    redirect: "follow",
    headers: {
      accept: "application/json,text/plain,*/*",
      "user-agent": "System2-Official-Continuity-Event-Parser/0.1",
    },
    signal: AbortSignal.timeout(30_000),
  });
  const rawText = await response.text();
  assert.equal(response.ok, true, sourceId + " HTTP " + response.status);

  const parsed = await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,
    sourceUrl: source.url,
    rawText,
    fetchedAt,
    requestedStartDate: startDate,
    requestedEndDate: endDate,
  });

  assert.equal(parsed.responseRangeVerified, true, sourceId + " range identity");
  assert.equal(parsed.parserComplete, true, sourceId + " parser completeness");
  assert.equal(parsed.state, "PARSED", sourceId + " expected non-empty ordinary-share result");
  assert.ok(parsed.eventCount > 0, sourceId + " expected at least one ordinary-share event in frozen range");
  assert.equal(
    parsed.historicalFirstKnownUnknownCount,
    parsed.eventCount,
    sourceId + " must preserve historical firstKnownAt UNKNOWN",
  );
  assert.equal(parsed.noEventMayBeClaimed, false, sourceId + " must not certify NO_EVENT");
  assert.equal(parsed.technicalContinuityCertified, false, sourceId + " must not certify continuity");

  results.push({
    sourceId,
    exchange: parsed.exchange,
    actionFamilyId: parsed.actionFamilyId,
    state: parsed.state,
    payloadHash: parsed.payloadHash,
    responseRangeStart: parsed.responseRangeStart,
    responseRangeEnd: parsed.responseRangeEnd,
    responseRangeVerified: parsed.responseRangeVerified,
    rawRowCount: parsed.rawRowCount,
    ordinaryRowCount: parsed.ordinaryRowCount,
    eventCount: parsed.eventCount,
    parseFailureCount: parsed.parseFailureCount,
    technicalContinuityEligibleEventCount: parsed.technicalContinuityEligibleEventCount,
    historicalFirstKnownUnknownCount: parsed.historicalFirstKnownUnknownCount,
    revisionCoverageComplete: parsed.revisionCoverageComplete,
    emptyRangeSemanticsCertified: parsed.emptyRangeSemanticsCertified,
    noEventMayBeClaimed: parsed.noEventMayBeClaimed,
    sampleEvents: parsed.events.slice(0, 2).map((event) => ({
      symbol: event.symbol,
      eventKey: event.eventKey,
      effectiveDate: event.effectiveDate,
      continuityEffectState: event.continuityEffectState,
      technicalContinuityEvidenceEligible: event.technicalContinuityEvidenceEligible,
      firstKnownAt: event.firstKnownAt,
      knowledgeTimeClass: event.knowledgeTimeClass,
    })),
  });
}

console.log(JSON.stringify({
  result: "PASS",
  schemaVersion: "S2_OFFICIAL_CA_PARSER_PHYSICAL_PROBE_V0_1",
  startDate,
  endDate,
  fetchedAt,
  sourceCount: results.length,
  parserReadyCount: results.filter((x) => x.state === "PARSED").length,
  totalEventCount: results.reduce((n, x) => n + x.eventCount, 0),
  totalTechnicalContinuityEligibleEventCount:
    results.reduce((n, x) => n + x.technicalContinuityEligibleEventCount, 0),
  revisionCoverageComplete: false,
  emptyRangeSemanticsCertified: false,
  noEventMayBeClaimed: false,
  symbolSessionCompletenessCertified: false,
  technicalContinuityCertified: false,
  historyMutationPerformed: false,
  strategyEvaluationPerformed: false,
  capacityRunProduced: false,
  selectionAuthority: false,
  finalSelectionEnabled: false,
  livePushEnabled: false,
  capitalImpact: false,
  orderImpact: false,
  system1RuntimeUsed: false,
  sources: results,
}, null, 2));
