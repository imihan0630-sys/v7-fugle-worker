import { deepFreeze } from "./factor_snapshot.mjs";

export const SOURCE_ARRIVAL_CONTRACT_VERSION = "0.1";

export const SOURCE_PROBE_STATE = deepFreeze({
  READY: "READY",
  NOT_READY: "NOT_READY",
  SOURCE_ERROR: "SOURCE_ERROR",
  INVALID_PAYLOAD: "INVALID_PAYLOAD",
  NOT_APPLICABLE: "NOT_APPLICABLE",
});

export const SOURCE_ARRIVAL_REGISTRY_V0_1 = deepFreeze({
  A1_TWSE_DAILY_CLOSE: {
    contractFamilyId: "A1_TW_DAILY_OHLCV_DERIVED",
    cadence: "SAME_SESSION",
    clockRole: "REQUIRED_DAILY_GATE",
    minimumRecordCount: 600,
  },
  A1_TPEX_DAILY_CLOSE: {
    contractFamilyId: "A1_TW_DAILY_OHLCV_DERIVED",
    cadence: "SAME_SESSION",
    clockRole: "REQUIRED_DAILY_GATE",
    minimumRecordCount: 450,
  },
  A2_TAIEX_CLOSE: {
    contractFamilyId: "A2_TAIEX",
    cadence: "SAME_SESSION",
    clockRole: "CONTEXT_OBSERVATION",
    minimumRecordCount: 1,
  },
  A3_TWSE_INSTITUTION_FLOW: {
    contractFamilyId: "A3_THREE_INSTITUTION_FLOW",
    cadence: "SAME_SESSION",
    clockRole: "OPTIONAL_OBSERVATION",
    minimumRecordCount: 600,
  },
  A3_TPEX_INSTITUTION_FLOW: {
    contractFamilyId: "A3_THREE_INSTITUTION_FLOW",
    cadence: "SAME_SESSION",
    clockRole: "OPTIONAL_OBSERVATION",
    minimumRecordCount: 450,
  },
  A6_TWSE_VALUATION: {
    contractFamilyId: "A6_PE_PB_VALUATION",
    cadence: "SAME_SESSION",
    clockRole: "OPTIONAL_OBSERVATION",
    minimumRecordCount: 600,
  },
  A6_TPEX_VALUATION: {
    contractFamilyId: "A6_PE_PB_VALUATION",
    cadence: "SAME_SESSION",
    clockRole: "OPTIONAL_OBSERVATION",
    minimumRecordCount: 450,
  },
});

export const REQUIRED_DAILY_CLOCK_SOURCES_V0_1 = deepFreeze(
  Object.entries(SOURCE_ARRIVAL_REGISTRY_V0_1)
    .filter(([, value]) => value.clockRole === "REQUIRED_DAILY_GATE")
    .map(([sourceId]) => sourceId),
);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return new Date(text).toISOString();
}

function assertMarketDate(value) {
  const text = requiredText(value, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("marketDate must be YYYY-MM-DD");
  return text;
}

function round(value, places = 3) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function taipeiDateFromTimestamp(value) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function taipeiMarketCloseTimestamp(marketDate) {
  const date = assertMarketDate(marketDate);
  return new Date(`${date}T13:30:00+08:00`).toISOString();
}

export function buildSourceProbeReceipt({
  sourceId,
  marketDate,
  marketCloseTimestamp = taipeiMarketCloseTimestamp(marketDate),
  probeStartedAt,
  observedAt,
  transportOk,
  httpStatus = null,
  schemaValid,
  payloadDate = null,
  recordCount = null,
  validationVersion = null,
  coverageDiagnostics = null,
  errorCode = null,
  endpointClass = "OFFICIAL_PUBLIC_GET",
} = {}) {
  const source = SOURCE_ARRIVAL_REGISTRY_V0_1[sourceId];
  if (!source) throw new Error(`unknown sourceId: ${sourceId}`);
  const date = assertMarketDate(marketDate);
  const closeAt = isoTimestamp(marketCloseTimestamp, "marketCloseTimestamp");
  const startedAt = isoTimestamp(probeStartedAt, "probeStartedAt");
  const seenAt = isoTimestamp(observedAt, "observedAt");
  if (Date.parse(seenAt) < Date.parse(startedAt)) {
    throw new Error("observedAt cannot be earlier than probeStartedAt");
  }

  const count = recordCount === null ? null : Number(recordCount);
  if (count !== null && (!Number.isInteger(count) || count < 0)) {
    throw new Error("recordCount must be a non-negative integer or null");
  }

  let state;
  let reason;
  if (transportOk !== true) {
    state = SOURCE_PROBE_STATE.SOURCE_ERROR;
    reason = errorCode || "TRANSPORT_OR_HTTP_ERROR";
  } else if (schemaValid !== true) {
    state = SOURCE_PROBE_STATE.INVALID_PAYLOAD;
    reason = errorCode || "SCHEMA_INVALID";
  } else if (payloadDate !== date) {
    state = SOURCE_PROBE_STATE.NOT_READY;
    reason = payloadDate ? "TARGET_DATE_NOT_PRESENT" : "PAYLOAD_DATE_MISSING";
  } else if (count === null || count < source.minimumRecordCount) {
    state = SOURCE_PROBE_STATE.INVALID_PAYLOAD;
    reason = "COVERAGE_BELOW_CONTRACT_MINIMUM";
  } else if (Date.parse(seenAt) < Date.parse(closeAt)) {
    state = SOURCE_PROBE_STATE.NOT_READY;
    reason = "BEFORE_MARKET_CLOSE_FINALITY_NOT_ASSUMED";
  } else {
    state = SOURCE_PROBE_STATE.READY;
    reason = "TARGET_DATE_SCHEMA_AND_COVERAGE_VERIFIED";
  }

  return deepFreeze({
    contractVersion: SOURCE_ARRIVAL_CONTRACT_VERSION,
    sourceId,
    contractFamilyId: source.contractFamilyId,
    cadence: source.cadence,
    clockRole: source.clockRole,
    marketDate: date,
    marketCloseTimestamp: closeAt,
    probeStartedAt: startedAt,
    observedAt: seenAt,
    state,
    reason,
    endpointClass: requiredText(endpointClass, "endpointClass"),
    httpStatus: httpStatus === null ? null : Number(httpStatus),
    payloadDate,
    recordCount: count,
    minimumRecordCount: source.minimumRecordCount,
    validationVersion: validationVersion || null,
    coverageDiagnostics: coverageDiagnostics && typeof coverageDiagnostics === "object"
      ? { ...coverageDiagnostics }
      : null,
    errorCode: errorCode || null,
    availableAtSemantics: "FIRST_OBSERVED_READY_UPPER_BOUND_NOT_PUBLISH_TIME",
    prospectiveSameDateEligible: taipeiDateFromTimestamp(seenAt) === date,
    externalMutationPerformed: false,
  });
}

function summarizeSourceAttempts(sourceId, attempts, marketCloseTimestamp) {
  const sorted = [...attempts].sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  const readyIndex = sorted.findIndex((item) => item.state === SOURCE_PROBE_STATE.READY);
  const firstReady = readyIndex >= 0 ? sorted[readyIndex] : null;
  const priorNotReady = readyIndex > 0
    ? [...sorted.slice(0, readyIndex)]
      .reverse()
      .find((item) => item.state === SOURCE_PROBE_STATE.NOT_READY) || null
    : null;
  const firstAttemptAt = sorted[0]?.probeStartedAt || null;
  const closeMs = Date.parse(marketCloseTimestamp);
  const firstReadyMs = firstReady ? Date.parse(firstReady.observedAt) : null;
  const lowerMs = priorNotReady ? Date.parse(priorNotReady.observedAt) : null;

  return deepFreeze({
    sourceId,
    contractFamilyId: SOURCE_ARRIVAL_REGISTRY_V0_1[sourceId].contractFamilyId,
    clockRole: SOURCE_ARRIVAL_REGISTRY_V0_1[sourceId].clockRole,
    attemptCount: sorted.length,
    statesObserved: [...new Set(sorted.map((item) => item.state))],
    firstAttemptAt,
    firstReadyAt: firstReady?.observedAt || null,
    lastObservedNotReadyAt: priorNotReady?.observedAt || null,
    latencyUpperBoundMinutes: firstReadyMs === null
      ? null
      : round((firstReadyMs - closeMs) / 60000),
    latencyLowerBoundMinutes: lowerMs === null
      ? null
      : round((lowerMs - closeMs) / 60000),
    observationIntervalMinutes: firstReadyMs === null || lowerMs === null
      ? null
      : round((firstReadyMs - lowerMs) / 60000),
    readyObserved: Boolean(firstReady),
    publicationTimestampProven: false,
  });
}

export function buildSourceArrivalMeasurement({
  measurementRunId,
  marketDate,
  expectedTradingDay,
  attempts,
  sessionTags = [],
  createdAt,
} = {}) {
  const date = assertMarketDate(marketDate);
  const closeAt = taipeiMarketCloseTimestamp(date);
  if (typeof expectedTradingDay !== "boolean") {
    throw new Error("expectedTradingDay must be boolean");
  }
  if (!Array.isArray(attempts) || attempts.length === 0) {
    throw new Error("attempts must contain at least one probe receipt");
  }
  const normalizedAttempts = attempts.map((attempt, index) => {
    if (!attempt || attempt.contractVersion !== SOURCE_ARRIVAL_CONTRACT_VERSION) {
      throw new Error(`attempts[${index}] is not a V0.1 probe receipt`);
    }
    if (attempt.marketDate !== date || attempt.marketCloseTimestamp !== closeAt) {
      throw new Error(`attempts[${index}] market-date/close mismatch`);
    }
    if (expectedTradingDay && attempt.prospectiveSameDateEligible !== true) {
      throw new Error(`attempts[${index}] is not a prospective same-Taipei-date observation`);
    }
    return attempt;
  });

  const sourceSummaries = Object.keys(SOURCE_ARRIVAL_REGISTRY_V0_1).map((sourceId) => {
    const sourceAttempts = normalizedAttempts.filter((attempt) => attempt.sourceId === sourceId);
    if (sourceAttempts.length === 0) {
      return deepFreeze({
        sourceId,
        contractFamilyId: SOURCE_ARRIVAL_REGISTRY_V0_1[sourceId].contractFamilyId,
        clockRole: SOURCE_ARRIVAL_REGISTRY_V0_1[sourceId].clockRole,
        attemptCount: 0,
        statesObserved: [],
        firstAttemptAt: null,
        firstReadyAt: null,
        lastObservedNotReadyAt: null,
        latencyUpperBoundMinutes: null,
        latencyLowerBoundMinutes: null,
        observationIntervalMinutes: null,
        readyObserved: false,
        publicationTimestampProven: false,
      });
    }
    return summarizeSourceAttempts(sourceId, sourceAttempts, closeAt);
  });

  const requiredDaily = sourceSummaries.filter((item) =>
    REQUIRED_DAILY_CLOCK_SOURCES_V0_1.includes(item.sourceId));
  const dailyGateComplete = expectedTradingDay
    ? requiredDaily.every((item) => item.readyObserved)
    : false;

  return deepFreeze({
    measurementRunId: requiredText(measurementRunId, "measurementRunId"),
    contractVersion: SOURCE_ARRIVAL_CONTRACT_VERSION,
    marketDate: date,
    timezone: "Asia/Taipei",
    marketCloseTimestamp: closeAt,
    expectedTradingDay,
    sessionTags: [...new Set(sessionTags.map((tag) => requiredText(String(tag), "sessionTag")))].sort(),
    probeReceipts: normalizedAttempts,
    sourceSummaries,
    dailyGateComplete,
    dailyGateSourceIds: REQUIRED_DAILY_CLOCK_SOURCES_V0_1,
    periodicDependencyCoverage: {
      A5_QUARTERLY_FINANCIALS: "NOT_MEASURED_BY_DAILY_V0_1",
      B2_INDUSTRY_THESIS_PROSPECTIVE: "DERIVED_OBSERVER_NOT_IMPLEMENTED",
    },
    decisionClockFrozen: false,
    cronAuthorized: false,
    captureEnabled: false,
    externalMutationPerformed: false,
    createdAt: isoTimestamp(createdAt, "createdAt"),
    schemaVersion: "S2_SOURCE_ARRIVAL_MEASUREMENT_V0_1",
  });
}

function timeFromMinutesAfterClose(minutes) {
  const total = 13 * 60 + 30 + minutes;
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function assessDecisionClockReadiness({
  measurements,
  dependencyCoverage = {},
  provisionalIndependentDates = 10,
  freezeIndependentDates = 20,
  safetyBufferMinutes = 15,
  maximumObservationIntervalMinutes = 5,
} = {}) {
  if (!Array.isArray(measurements)) throw new Error("measurements must be an array");
  const byDate = new Map();
  for (const measurement of measurements) {
    if (measurement?.contractVersion !== SOURCE_ARRIVAL_CONTRACT_VERSION) {
      throw new Error("all measurements must use source-arrival contract V0.1");
    }
    if (measurement.expectedTradingDay) byDate.set(measurement.marketDate, measurement);
  }
  const sessions = [...byDate.values()].sort((a, b) => a.marketDate.localeCompare(b.marketDate));
  const dependencyGaps = [
    "A5_QUARTERLY_FINANCIALS",
    "B2_INDUSTRY_THESIS_PROSPECTIVE",
  ].filter((dependency) => dependencyCoverage[dependency] !== true);

  const completeSessions = sessions.filter((measurement) => measurement.dailyGateComplete);
  const latencyBounds = completeSessions.flatMap((measurement) =>
    measurement.sourceSummaries
      .filter((summary) => REQUIRED_DAILY_CLOCK_SOURCES_V0_1.includes(summary.sourceId))
      .map((summary) => summary.latencyUpperBoundMinutes)
      .filter(Number.isFinite));
  const intervalWidths = completeSessions.flatMap((measurement) =>
    measurement.sourceSummaries
      .filter((summary) => REQUIRED_DAILY_CLOCK_SOURCES_V0_1.includes(summary.sourceId))
      .map((summary) => summary.observationIntervalMinutes)
      .filter(Number.isFinite));
  const allDatesComplete = sessions.length > 0 && completeSessions.length === sessions.length;
  const intervalsPrecise = intervalWidths.length > 0
    && intervalWidths.every((value) => value <= maximumObservationIntervalMinutes);

  let status = "INSUFFICIENT_DATES";
  if (dependencyGaps.length > 0) status = "BLOCKED_DEPENDENCIES";
  else if (!allDatesComplete) status = "INCOMPLETE_REQUIRED_DAILY_SOURCES";
  else if (sessions.length >= freezeIndependentDates && intervalsPrecise) status = "FREEZE_ELIGIBLE";
  else if (sessions.length >= provisionalIndependentDates) status = "PROVISIONAL_ELIGIBLE";

  const worstLatency = latencyBounds.length > 0 ? Math.max(...latencyBounds) : null;
  const buffered = worstLatency === null
    ? null
    : Math.ceil((worstLatency + safetyBufferMinutes) / 5) * 5;

  return deepFreeze({
    contractVersion: SOURCE_ARRIVAL_CONTRACT_VERSION,
    status,
    independentTradingDates: sessions.length,
    completeTradingDates: completeSessions.length,
    dependencyGaps,
    requiredDailySourceIds: REQUIRED_DAILY_CLOCK_SOURCES_V0_1,
    provisionalIndependentDates,
    freezeIndependentDates,
    safetyBufferMinutes,
    maximumObservationIntervalMinutes,
    worstObservedLatencyUpperBoundMinutes: worstLatency,
    candidateMinutesAfterClose: buffered,
    candidateTaipeiTime: buffered === null ? null : timeFromMinutesAfterClose(buffered),
    candidateIsAuthorizedDecisionClock: false,
    exactCronFrozen: false,
    cronAuthorized: false,
  });
}
