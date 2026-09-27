import { deepFreeze } from "./factor_snapshot.mjs";

const REQUIRED_DEPENDENCIES = Object.freeze([
  "A5_QUARTERLY_FINANCIALS",
  "B2_INDUSTRY_THESIS_PROSPECTIVE",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

export function buildDecisionClockDependencyLedger({
  sourceArrivalMeasurements = [],
  dependencyObserverReports = [],
} = {}) {
  if (!Array.isArray(sourceArrivalMeasurements)) {
    throw new Error("sourceArrivalMeasurements must be an array");
  }
  if (!Array.isArray(dependencyObserverReports)) {
    throw new Error("dependencyObserverReports must be an array");
  }

  const tradingDates = [...new Set(
    sourceArrivalMeasurements
      .filter((x) => x?.expectedTradingDay === true)
      .map((x) => requiredText(x.marketDate, "measurement.marketDate")),
  )].sort();

  const reportsByDate = new Map();
  for (const report of dependencyObserverReports) {
    if (!report || typeof report !== "object") continue;
    if (report.expectedTradingDay !== true) continue;
    if (report.sameTaipeiDate !== true) continue;
    const date = requiredText(report.marketDate, "dependencyObserverReport.marketDate");
    if (!reportsByDate.has(date)) reportsByDate.set(date, []);
    reportsByDate.get(date).push(report);
  }

  const dateRows = tradingDates.map((marketDate) => {
    const reports = reportsByDate.get(marketDate) || [];
    const latest = [...reports].sort((a, b) =>
      String(a.observedAt || "").localeCompare(String(b.observedAt || "")),
    ).at(-1) || null;

    const a5Ready = latest?.dependencyCoverage?.A5_QUARTERLY_FINANCIALS === true;
    const b2Ready = latest?.dependencyCoverage?.B2_INDUSTRY_THESIS_PROSPECTIVE === true;

    return {
      marketDate,
      reportObservedAt: latest?.observedAt || null,
      A5_QUARTERLY_FINANCIALS: a5Ready,
      B2_INDUSTRY_THESIS_PROSPECTIVE: b2Ready,
      complete: a5Ready && b2Ready,
    };
  });

  const missingDatesByDependency = Object.fromEntries(
    REQUIRED_DEPENDENCIES.map((dependency) => [
      dependency,
      dateRows.filter((row) => row[dependency] !== true).map((row) => row.marketDate),
    ]),
  );

  const dependencyCoverage = Object.fromEntries(
    REQUIRED_DEPENDENCIES.map((dependency) => [
      dependency,
      tradingDates.length > 0 && missingDatesByDependency[dependency].length === 0,
    ]),
  );

  return deepFreeze({
    ledgerVersion: "S2_DECISION_CLOCK_DEPENDENCY_LEDGER_V0_1",
    tradingDates,
    independentTradingDates: tradingDates.length,
    dateRows,
    missingDatesByDependency,
    dependencyCoverage,
    completeDateCount: dateRows.filter((x) => x.complete).length,
    allDatesComplete:
      tradingDates.length > 0 && dateRows.every((row) => row.complete),
    noHistoricalBackfillAssumed: true,
    exactClockAuthorized: false,
    cronAuthorized: false,
  });
}

export { REQUIRED_DEPENDENCIES };
