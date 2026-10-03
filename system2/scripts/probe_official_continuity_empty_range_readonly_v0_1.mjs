import assert from "node:assert/strict";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {
  characterizeOfficialContinuityEmptyRangeV0_1,
  certifyOfficialContinuityEmptyRangeV0_1,
  officialContinuityEmptyRangeCertificationRulesV0_1,
} from "../runtime/official_continuity_empty_range_semantics_v0_1.mjs";

const startDate = process.env.SYSTEM2_CA_EMPTY_START_DATE || "2026-10-03";
const endDate = process.env.SYSTEM2_CA_EMPTY_END_DATE || "2026-10-03";
assert.equal(startDate, endDate, "physical certification currently expects a one-day empty target");

const rules = officialContinuityEmptyRangeCertificationRulesV0_1();
const targetSources = buildOfficialContinuitySourceUrlsV0_1({ startDate, endDate });
const historical = Object.entries(targetSources).filter(([, source]) =>
  source.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE"
);

async function fetchObservation(sourceId, source, requestedStartDate, requestedEndDate) {
  let response = null;
  let rawText = "";
  let transportError = null;
  try {
    response = await fetch(source.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "System2-Official-Continuity-Empty-Range/0.2",
      },
      signal: AbortSignal.timeout(30_000),
    });
    rawText = await response.text();
  } catch (error) {
    transportError = String(error?.message || error);
  }

  if (!response) {
    return {
      sourceId,
      requestedStartDate,
      requestedEndDate,
      state: "TRANSPORT_ERROR",
      transportError,
      httpOk: false,
      emptyRangeSemanticsCertified: false,
    };
  }

  return characterizeOfficialContinuityEmptyRangeV0_1({
    sourceId,
    requestedStartDate,
    requestedEndDate,
    rawText,
    httpStatus: response.status,
    contentType: response.headers.get("content-type"),
  });
}

const rows = [];

for (const [sourceId, source] of historical) {
  const observation = await fetchObservation(sourceId, source, startDate, endDate);
  const rule = rules[sourceId];
  let positiveControl = null;

  if (rule.mode === "CONTROLLED_NO_DATA_STATUS") {
    const controlSources = buildOfficialContinuitySourceUrlsV0_1({
      startDate: rule.positiveControlDate,
      endDate: rule.positiveControlDate,
    });
    positiveControl = await fetchObservation(
      sourceId,
      controlSources[sourceId],
      rule.positiveControlDate,
      rule.positiveControlDate,
    );
  }

  const certification = observation.state === "TRANSPORT_ERROR"
    ? {
        sourceId,
        emptyRangeSemanticsCertified: false,
        certificationBlockers: ["TRANSPORT_ERROR"],
        positiveControlMatched: false,
      }
    : certifyOfficialContinuityEmptyRangeV0_1({ observation, positiveControl });

  rows.push({
    sourceId,
    exchange: source.exchange,
    targetUrl: source.url,
    targetState: observation.state,
    targetHttpStatus: observation.httpStatus ?? null,
    targetPayloadHash: observation.payloadHash ?? null,
    targetUpstreamStatus: observation.upstreamStatus ?? null,
    targetResponseRangeRaw: observation.responseRangeRaw ?? null,
    targetResponseRangeVerified: observation.responseRangeVerified === true,
    targetParserShape: observation.parserShape ?? null,
    targetRowCount: observation.rowCount ?? null,
    positiveControlDate: certification.positiveControlDate ?? null,
    positiveControlState: positiveControl?.state ?? null,
    positiveControlResponseRangeVerified: positiveControl?.responseRangeVerified ?? null,
    positiveControlRowCount: positiveControl?.rowCount ?? null,
    positiveControlMatched: certification.positiveControlMatched ?? null,
    certificationBlockers: certification.certificationBlockers,
    emptyRangeSemanticsCertified: certification.emptyRangeSemanticsCertified,
  });
}

const certifiedCount = rows.filter((x) => x.emptyRangeSemanticsCertified).length;
assert.equal(rows.length, 6, "expected six official historical source lanes");
assert.equal(certifiedCount, 6, "all six official empty-range signatures must certify");

console.log(JSON.stringify({
  result: "PASS",
  schemaVersion: "S2_OFFICIAL_CA_EMPTY_RANGE_PHYSICAL_CERTIFICATION_V0_2",
  requestedStartDate: startDate,
  requestedEndDate: endDate,
  rationale: "ENDPOINT_SPECIFIC_EMPTY_SIGNATURE_WITH_TWSE_POSITIVE_CONTROLS",
  sourceCount: rows.length,
  certifiedEmptySourceCount: certifiedCount,
  emptyRangeSemanticsCertified: certifiedCount === rows.length,

  // Independent gates remain closed.
  sourceCoverageComplete: false,
  revisionCoverageComplete: false,
  noEventMayBeClaimed: false,
  suspensionCoverageComplete: false,
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
  sources: rows,
}, null, 2));
