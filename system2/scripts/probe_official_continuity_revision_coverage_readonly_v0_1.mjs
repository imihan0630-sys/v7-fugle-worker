import assert from "node:assert/strict";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {
  assessOfficialContinuityRevisionSourceV0_1,
  buildOfficialContinuityRevisionCoverageReceiptV0_1,
} from "../runtime/official_continuity_revision_coverage_v0_1.mjs";

const startDate = process.env.SYSTEM2_CA_START_DATE || "2026-04-05";
const endDate = process.env.SYSTEM2_CA_END_DATE || "2026-10-02";
const fetchedAt = new Date().toISOString();
const sources = buildOfficialContinuitySourceUrlsV0_1({ startDate, endDate });
const historical = Object.entries(sources).filter(([, source]) =>
  source.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE"
);
assert.equal(historical.length, 6);

const assessments = [];

for (const [sourceId, source] of historical) {
  const response = await fetch(source.url, {
    method: "GET",
    redirect: "follow",
    headers: {
      accept: "application/json,text/plain,*/*",
      "user-agent": "System2-Official-Continuity-Revision-Coverage/0.1",
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

  assessments.push(assessOfficialContinuityRevisionSourceV0_1({
    sourceId,
    sourceClass: source.sourceClass,
    parserComplete: parsed.parserComplete,
    responseRangeVerified: parsed.responseRangeVerified,
    fieldNames: parsed.fieldNames,
    eventCount: parsed.eventCount,
    historicalFirstKnownUnknownCount: parsed.historicalFirstKnownUnknownCount,
  }));
}

const receipt = buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,
  endDate,
  sourceAssessments: assessments,
  supplementalChannels: [],
  generatedAt: new Date().toISOString(),
});

assert.equal(receipt.requiredLaneCount, 6);
assert.equal(receipt.finalResultReadyCount, 6);
assert.equal(receipt.supplementalRevisionReadyCount, 0);
assert.equal(receipt.revisionCoverageComplete, false);
assert.equal(receipt.noEventMayBeClaimed, false);
assert.equal(receipt.technicalContinuityCertified, false);
assert.equal(receipt.selectionAuthority, false);
assert.equal(receipt.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: "PASS_NEGATIVE_GATE",
  ...receipt,
  sourceAssessments: assessments,
}, null, 2));
