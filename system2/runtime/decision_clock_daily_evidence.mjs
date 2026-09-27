import { deepFreeze } from "./factor_snapshot.mjs";
import { REQUIRED_DAILY_CLOCK_SOURCES_V0_1 } from "./source_arrival_latency.mjs";

const B2_DEPENDENCY = "B2_INDUSTRY_THESIS_PROSPECTIVE";
const A5_DEPENDENCY = "A5_QUARTERLY_FINANCIALS";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function minutesAfterClose(marketDate, timestamp) {
  if (!timestamp) return null;
  const close = Date.parse(`${marketDate}T13:30:00+08:00`);
  const seen = Date.parse(timestamp);
  if (!Number.isFinite(close) || !Number.isFinite(seen)) return null;
  return Math.round(((seen - close) / 60000) * 1000) / 1000;
}

function roundUpFive(minutes) {
  return Number.isFinite(minutes) ? Math.ceil(minutes / 5) * 5 : null;
}

function timeFromMinutesAfterClose(minutes) {
  if (!Number.isFinite(minutes)) return null;
  const total = 13 * 60 + 30 + minutes;
  const hour = Math.floor(total / 60) % 24;
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function timestampFromMinutesAfterClose(marketDate, minutes) {
  if (!Number.isFinite(minutes)) return null;
  const close = Date.parse(`${marketDate}T13:30:00+08:00`);
  if (!Number.isFinite(close)) return null;
  return new Date(close + minutes * 60_000).toISOString();
}

export function buildDecisionClockDailyEvidence({
  evidenceId,
  sourceArrivalReport,
  dependencySeriesReport,
  safetyBufferMinutes = 15,
  maximumObservationIntervalMinutes = 5,
  createdAt,
} = {}) {
  if (!sourceArrivalReport?.measurement) {
    throw new Error("sourceArrivalReport.measurement is required");
  }
  if (!dependencySeriesReport || typeof dependencySeriesReport !== "object") {
    throw new Error("dependencySeriesReport is required");
  }

  const measurement = sourceArrivalReport.measurement;
  const marketDate = requiredText(measurement.marketDate, "marketDate");
  if (dependencySeriesReport.marketDate !== marketDate) {
    throw new Error("source/dependency marketDate mismatch");
  }
  if (measurement.expectedTradingDay !== true
    || dependencySeriesReport.expectedTradingDay !== true) {
    throw new Error("daily decision-clock evidence requires an expected trading day");
  }

  const a1Rows = measurement.sourceSummaries
    .filter((row) => REQUIRED_DAILY_CLOCK_SOURCES_V0_1.includes(row.sourceId))
    .map((row) => ({
      sourceId: row.sourceId,
      readyObserved: row.readyObserved === true,
      firstReadyAt: row.firstReadyAt || null,
      lastObservedNotReadyAt: row.lastObservedNotReadyAt || null,
      latencyUpperBoundMinutes: row.latencyUpperBoundMinutes,
      latencyLowerBoundMinutes: row.latencyLowerBoundMinutes,
      observationIntervalMinutes: row.observationIntervalMinutes,
    }));

  const dependencyById = new Map(
    (dependencySeriesReport.dependencySummaries || [])
      .map((row) => [row.dependency, row]),
  );
  const a5 = dependencyById.get(A5_DEPENDENCY) || null;
  const b2 = dependencyById.get(B2_DEPENDENCY) || null;

  const b2Upper = minutesAfterClose(marketDate, b2?.firstReadyAt || null);
  const b2Lower = minutesAfterClose(marketDate, b2?.lastObservedNotReadyAt || null);
  const b2Interval = b2?.observationIntervalMinutes ?? null;

  const clockRows = [
    ...a1Rows,
    {
      sourceId: B2_DEPENDENCY,
      readyObserved: b2?.readyObserved === true,
      firstReadyAt: b2?.firstReadyAt || null,
      lastObservedNotReadyAt: b2?.lastObservedNotReadyAt || null,
      latencyUpperBoundMinutes: b2Upper,
      latencyLowerBoundMinutes: b2Lower,
      observationIntervalMinutes: b2Interval,
    },
  ];

  const sameSessionClockReady =
    measurement.dailyGateComplete === true
    && dependencySeriesReport.dependencyCoverage?.[B2_DEPENDENCY] === true;

  const upperBounds = clockRows
    .map((row) => row.latencyUpperBoundMinutes)
    .filter(Number.isFinite);
  const worstUpperBound =
    sameSessionClockReady && upperBounds.length === clockRows.length
      ? Math.max(...upperBounds)
      : null;
  const candidateMinutesAfterClose = Number.isFinite(worstUpperBound)
    ? roundUpFive(worstUpperBound + safetyBufferMinutes)
    : null;
  const candidateTimestamp = timestampFromMinutesAfterClose(
    marketDate,
    candidateMinutesAfterClose,
  );

  const a5ObservedAt = a5?.firstReadyAt || null;
  const a5CoverageObserved =
    dependencySeriesReport.dependencyCoverage?.[A5_DEPENDENCY] === true
    && a5?.readyObserved === true
    && Boolean(a5ObservedAt);
  const a5AvailableByCandidate =
    a5CoverageObserved
    && candidateTimestamp
    && Date.parse(a5ObservedAt) <= Date.parse(candidateTimestamp);

  const requiredReady =
    sameSessionClockReady
    && a5AvailableByCandidate === true;

  const precisionEligible = requiredReady && clockRows.every((row) =>
    row.readyObserved === true
    && row.lastObservedNotReadyAt
    && Number.isFinite(row.observationIntervalMinutes)
    && row.observationIntervalMinutes <= maximumObservationIntervalMinutes
  );

  return deepFreeze({
    evidenceId: requiredText(evidenceId, "evidenceId"),
    evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
    marketDate,
    sourceArrivalRunId: measurement.measurementRunId,
    dailyGateComplete: measurement.dailyGateComplete === true,
    dependencyCoverage: {
      [A5_DEPENDENCY]:
        dependencySeriesReport.dependencyCoverage?.[A5_DEPENDENCY] === true,
      [B2_DEPENDENCY]:
        dependencySeriesReport.dependencyCoverage?.[B2_DEPENDENCY] === true,
    },
    evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
    sameSessionClockReady,
    a5ObservedAtDecisionBoundary: a5ObservedAt,
    a5AvailableByCandidate,
    candidateTimestamp,
    clockConstraintRows: clockRows,
    requiredReady,
    precisionEligible,
    maximumObservationIntervalMinutes,
    safetyBufferMinutes,
    worstObservedRequiredUpperBoundMinutes: worstUpperBound,
    candidateMinutesAfterClose,
    candidateTaipeiTime: timeFromMinutesAfterClose(candidateMinutesAfterClose),
    publicationTimestampProven: false,
    exactDecisionClockAuthorized: false,
    cronAuthorized: false,
    captureEnabled: false,
    createdAt: new Date(requiredText(createdAt, "createdAt")).toISOString(),
  });
}
