import { deepFreeze } from "./factor_snapshot.mjs";

export const OFFICIAL_CONTINUITY_REVISION_COVERAGE_VERSION = "0.1-RESEARCH";

const REQUIRED_LANES = deepFreeze({
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: {
    exchange: "TWSE",
    actionFamilyId: "EX_RIGHT_DIVIDEND",
  },
  TWSE_CAPITAL_REDUCTION_REFERENCE: {
    exchange: "TWSE",
    actionFamilyId: "CAPITAL_REDUCTION",
  },
  TWSE_PAR_VALUE_CHANGE_REFERENCE: {
    exchange: "TWSE",
    actionFamilyId: "PAR_VALUE_CHANGE",
  },
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: {
    exchange: "TPEX",
    actionFamilyId: "EX_RIGHT_DIVIDEND",
  },
  TPEX_CAPITAL_REDUCTION_REFERENCE: {
    exchange: "TPEX",
    actionFamilyId: "CAPITAL_REDUCTION",
  },
  TPEX_PAR_VALUE_CHANGE_REFERENCE: {
    exchange: "TPEX",
    actionFamilyId: "PAR_VALUE_CHANGE",
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  const parsed = new Date(text + "T00:00:00.000Z");
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
    throw new Error(field + " must be a valid YYYY-MM-DD");
  }
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return new Date(text).toISOString();
}

function sortedUnique(values = []) {
  return Object.freeze([...new Set((values || []).map((x) => String(x).trim()).filter(Boolean))].sort());
}

function revisionHintFieldNames(fieldNames = []) {
  const pattern = /(更正|修正|取消|撤銷|版本|公告日期|公告時間|發布日期|發佈日期|異動日期|revision|version|cancel|correct|amend|update)/i;
  return sortedUnique((fieldNames || []).filter((x) => pattern.test(String(x))));
}

export function assessOfficialContinuityRevisionSourceV0_1({
  sourceId,
  sourceClass = "HISTORICAL_ACTUAL_RESULT_RANGE",
  parserComplete,
  responseRangeVerified,
  fieldNames = [],
  eventCount = 0,
  historicalFirstKnownUnknownCount = 0,
} = {}) {
  const id = requiredText(sourceId, "sourceId");
  const contract = REQUIRED_LANES[id];
  if (!contract) throw new Error("unsupported historical sourceId: " + id);
  const cls = requiredText(sourceClass, "sourceClass");
  const finalResultRangeReady =
    cls === "HISTORICAL_ACTUAL_RESULT_RANGE" &&
    parserComplete === true &&
    responseRangeVerified === true;
  const hintFields = revisionHintFieldNames(fieldNames);
  const count = Number(eventCount);
  const unknownFirstKnown = Number(historicalFirstKnownUnknownCount);

  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_CA_REVISION_SOURCE_ASSESSMENT_V0_1",
    version: OFFICIAL_CONTINUITY_REVISION_COVERAGE_VERSION,
    sourceId: id,
    exchange: contract.exchange,
    actionFamilyId: contract.actionFamilyId,
    sourceClass: cls,
    finalResultRangeReady,
    fieldNames: Object.freeze((fieldNames || []).map(String)),
    revisionHintFields: hintFields,
    revisionHintFieldObserved: hintFields.length > 0,
    eventCount: Number.isFinite(count) && count >= 0 ? count : 0,
    historicalFirstKnownUnknownCount:
      Number.isFinite(unknownFirstKnown) && unknownFirstKnown >= 0 ? unknownFirstKnown : 0,

    // A current/final actual-result range can show the final event state, but it
    // does not expose an immutable historical version chain by itself.
    sourceEvidenceClass: "FINAL_RESULT_RANGE_ONLY",
    historicalVersionArchiveComplete: false,
    correctionHistoryComplete: false,
    cancellationHistoryComplete: false,
    knownAtVersionClockCovered: false,
    revisionCoverageComplete: false,
    state: finalResultRangeReady
      ? "FINAL_RESULT_ONLY_REVISION_HISTORY_UNVERIFIED"
      : "FINAL_RESULT_SOURCE_NOT_READY",
  });
}

function channelKey(channel) {
  return [
    requiredText(channel.exchange, "supplementalChannels[].exchange").toUpperCase(),
    requiredText(channel.actionFamilyId, "supplementalChannels[].actionFamilyId"),
  ].join("|");
}

function channelComplete(channel, startDate, endDate) {
  if (!channel || typeof channel !== "object" || Array.isArray(channel)) return false;
  return (
    channel.channelType === "REVISION_CORRECTION_CANCELLATION_HISTORY" &&
    channel.coverageState === "COMPLETE" &&
    channel.requestedStartDate === startDate &&
    channel.requestedEndDate === endDate &&
    channel.responseRangeVerified === true &&
    channel.parserComplete === true &&
    channel.immutableVersionsPreserved === true &&
    channel.knownAtVersionClockCovered === true &&
    channel.correctionHistoryComplete === true &&
    channel.cancellationHistoryComplete === true &&
    sortedUnique(channel.missingSourceDates).length === 0
  );
}

export function buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,
  endDate,
  sourceAssessments = [],
  supplementalChannels = [],
  generatedAt,
} = {}) {
  const start = isoDate(startDate, "startDate");
  const end = isoDate(endDate, "endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  const at = isoTimestamp(generatedAt, "generatedAt");
  if (!Array.isArray(sourceAssessments)) throw new Error("sourceAssessments must be an array");
  if (!Array.isArray(supplementalChannels)) throw new Error("supplementalChannels must be an array");

  const bySource = new Map(sourceAssessments.map((x) => [x?.sourceId, x]));
  const channelsByKey = new Map();
  for (const channel of supplementalChannels) {
    const key = channelKey(channel);
    if (!channelsByKey.has(key)) channelsByKey.set(key, []);
    channelsByKey.get(key).push(channel);
  }

  const laneResults = Object.entries(REQUIRED_LANES).map(([sourceId, contract]) => {
    const assessment = bySource.get(sourceId) || null;
    const key = contract.exchange + "|" + contract.actionFamilyId;
    const candidates = channelsByKey.get(key) || [];
    const completeChannels = candidates.filter((x) => channelComplete(x, start, end));
    const finalResultRangeReady = assessment?.finalResultRangeReady === true;
    const supplementalRevisionChannelComplete = completeChannels.length > 0;
    const blockers = [];
    if (!finalResultRangeReady) blockers.push("FINAL_RESULT_RANGE_NOT_READY");
    if (!supplementalRevisionChannelComplete) blockers.push("SUPPLEMENTAL_REVISION_HISTORY_CHANNEL_INCOMPLETE");

    return deepFreeze({
      sourceId,
      exchange: contract.exchange,
      actionFamilyId: contract.actionFamilyId,
      finalResultRangeReady,
      finalResultEvidenceClass: assessment?.sourceEvidenceClass || null,
      revisionHintFields: Object.freeze([...(assessment?.revisionHintFields || [])]),
      supplementalChannelCount: candidates.length,
      completeSupplementalChannelCount: completeChannels.length,
      completeSupplementalChannelIds: sortedUnique(completeChannels.map((x) => x.channelId)),
      blockers: Object.freeze(blockers),
      revisionCoverageComplete: blockers.length === 0,
    });
  });

  const finalResultReadyCount = laneResults.filter((x) => x.finalResultRangeReady).length;
  const supplementalReadyCount = laneResults.filter((x) => x.completeSupplementalChannelCount > 0).length;
  const revisionCoverageComplete = laneResults.every((x) => x.revisionCoverageComplete);

  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_CA_REVISION_COVERAGE_RECEIPT_V0_1",
    version: OFFICIAL_CONTINUITY_REVISION_COVERAGE_VERSION,
    interval: deepFreeze({ startDate: start, endDate: end }),
    requiredLaneCount: laneResults.length,
    finalResultReadyCount,
    supplementalRevisionReadyCount: supplementalReadyCount,
    laneResults: Object.freeze(laneResults),
    revisionCoverageComplete,
    generatedAt: at,

    // Revision readiness is only one corporate-action completeness dimension.
    noEventMayBeClaimed: false,
    suspensionCoverageComplete: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    zeroPickClaimed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export function officialContinuityRevisionRequiredLanesV0_1() {
  return REQUIRED_LANES;
}
