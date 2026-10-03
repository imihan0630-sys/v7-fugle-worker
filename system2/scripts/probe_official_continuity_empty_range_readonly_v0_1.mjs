import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { characterizeOfficialContinuityEmptyRangeV0_1 } from "../runtime/official_continuity_empty_range_semantics_v0_1.mjs";

const startDate = process.env.SYSTEM2_CA_EMPTY_START_DATE || "2026-10-03";
const endDate = process.env.SYSTEM2_CA_EMPTY_END_DATE || "2026-10-03";

const sources = buildOfficialContinuitySourceUrlsV0_1({ startDate, endDate });
const historical = Object.entries(sources).filter(([, source]) =>
  source.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE"
);

const rows = [];

for (const [sourceId, source] of historical) {
  let response = null;
  let rawText = "";
  let transportError = null;
  try {
    response = await fetch(source.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "System2-Official-Continuity-Empty-Range/0.1",
      },
      signal: AbortSignal.timeout(30_000),
    });
    rawText = await response.text();
  } catch (error) {
    transportError = String(error?.message || error);
  }

  if (!response) {
    rows.push({
      sourceId,
      exchange: source.exchange,
      state: "TRANSPORT_ERROR",
      transportError,
      url: source.url,
      emptyRangeSemanticsCertified: false,
      noEventMayBeClaimed: false,
    });
    continue;
  }

  const characterized = await characterizeOfficialContinuityEmptyRangeV0_1({
    sourceId,
    requestedStartDate: startDate,
    requestedEndDate: endDate,
    rawText,
    httpStatus: response.status,
    contentType: response.headers.get("content-type"),
  });

  rows.push({
    sourceId,
    exchange: source.exchange,
    url: source.url,
    state: characterized.state,
    httpStatus: characterized.httpStatus,
    contentType: characterized.contentType,
    payloadHash: characterized.payloadHash,
    upstreamStatus: characterized.upstreamStatus,
    responseRangeRaw: characterized.responseRangeRaw,
    responseRangeStart: characterized.responseRangeStart,
    responseRangeEnd: characterized.responseRangeEnd,
    responseRangeVerified: characterized.responseRangeVerified,
    parserShape: characterized.parserShape,
    recognizedRowContainer: characterized.recognizedRowContainer,
    fieldCount: characterized.fieldCount,
    rowCount: characterized.rowCount,
    zeroRows: characterized.zeroRows,
    emptyRangeResponseCandidate: characterized.emptyRangeResponseCandidate,
    emptyRangeSemanticsCertified: characterized.emptyRangeSemanticsCertified,
    noEventMayBeClaimed: characterized.noEventMayBeClaimed,
  });
}

console.log(JSON.stringify({
  result: "OBSERVED",
  schemaVersion: "S2_OFFICIAL_CA_EMPTY_RANGE_PHYSICAL_PROBE_V0_1",
  requestedStartDate: startDate,
  requestedEndDate: endDate,
  rationale: "KNOWN_NON_TRADING_SATURDAY_RESPONSE_SHAPE_CHARACTERIZATION",
  sourceCount: rows.length,
  exactRangeZeroRowsObservedCount: rows.filter((x) => x.state === "EXACT_RANGE_ZERO_ROWS_OBSERVED").length,
  zeroRowsRangeIdentityMissingCount: rows.filter((x) => x.state === "ZERO_ROWS_RANGE_IDENTITY_MISSING").length,
  exactRangeWithoutRowContainerCount: rows.filter((x) => x.state === "EXACT_RANGE_WITHOUT_ROW_CONTAINER").length,
  nonEmptyCount: rows.filter((x) => x.state === "NON_EMPTY_RANGE").length,
  transportOrHttpErrorCount: rows.filter((x) => ["TRANSPORT_ERROR","HTTP_ERROR"].includes(x.state)).length,

  // This run characterizes transport/response semantics only.
  emptyRangeSemanticsCertified: false,
  sourceCoverageComplete: false,
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
  sources: rows,
}, null, 2));
