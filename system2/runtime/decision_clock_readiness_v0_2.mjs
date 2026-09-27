import { deepFreeze } from "./factor_snapshot.mjs";

function timeFromMinutesAfterClose(minutes) {
  if (!Number.isFinite(minutes)) return null;
  const total = 13 * 60 + 30 + minutes;
  const hour = Math.floor(total / 60) % 24;
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function assessDecisionClockReadinessV02({
  dailyEvidence,
  provisionalIndependentDates = 10,
  freezeIndependentDates = 20,
  safetyBufferMinutes = 15,
} = {}) {
  if (!Array.isArray(dailyEvidence)) throw new Error("dailyEvidence must be an array");

  const byDate = new Map();
  for (const row of dailyEvidence) {
    if (!row || row.evidenceVersion !== "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2") {
      throw new Error("all rows must be V0.2 daily decision-clock evidence");
    }
    byDate.set(row.marketDate, row);
  }
  const rows = [...byDate.values()].sort((a, b) =>
    a.marketDate.localeCompare(b.marketDate));

  const completeRows = rows.filter((x) => x.requiredReady === true);
  const precisionRows = completeRows.filter((x) => x.precisionEligible === true);
  const allComplete = rows.length > 0 && completeRows.length === rows.length;
  const allPrecise = rows.length > 0 && precisionRows.length === rows.length;

  const upperBounds = completeRows
    .map((x) => x.worstObservedRequiredUpperBoundMinutes)
    .filter(Number.isFinite);
  const worstUpper = upperBounds.length === completeRows.length && upperBounds.length > 0
    ? Math.max(...upperBounds)
    : null;
  const candidateMinutesAfterClose = Number.isFinite(worstUpper)
    ? Math.ceil((worstUpper + safetyBufferMinutes) / 5) * 5
    : null;

  let status = "INSUFFICIENT_DATES";
  if (!allComplete) status = "INCOMPLETE_REQUIRED_EVIDENCE";
  else if (rows.length >= freezeIndependentDates && allPrecise) status = "FREEZE_ELIGIBLE";
  else if (rows.length >= provisionalIndependentDates) status = "PROVISIONAL_ELIGIBLE";

  return deepFreeze({
    assessmentVersion: "S2_DECISION_CLOCK_READINESS_V0_2",
    status,
    independentTradingDates: rows.length,
    completeTradingDates: completeRows.length,
    precisionEligibleDates: precisionRows.length,
    provisionalIndependentDates,
    freezeIndependentDates,
    safetyBufferMinutes,
    allComplete,
    allPrecise,
    worstObservedRequiredUpperBoundMinutes: worstUpper,
    candidateMinutesAfterClose,
    candidateTaipeiTime: timeFromMinutesAfterClose(candidateMinutesAfterClose),
    includedMarketDates: rows.map((x) => x.marketDate),
    candidateIsAuthorizedDecisionClock: false,
    exactCronFrozen: false,
    cronAuthorized: false,
    captureEnabled: false,
  });
}
