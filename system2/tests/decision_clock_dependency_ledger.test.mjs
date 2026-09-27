import assert from "node:assert/strict";
import { buildDecisionClockDependencyLedger } from "../runtime/decision_clock_dependency_ledger.mjs";

const measurements = [
  { marketDate: "2026-09-28", expectedTradingDay: true },
  { marketDate: "2026-09-29", expectedTradingDay: true },
  { marketDate: "2026-09-27", expectedTradingDay: false },
];

const report = (marketDate, a5, b2, observedAt) => ({
  marketDate,
  expectedTradingDay: true,
  sameTaipeiDate: true,
  observedAt,
  dependencyCoverage: {
    A5_QUARTERLY_FINANCIALS: a5,
    B2_INDUSTRY_THESIS_PROSPECTIVE: b2,
  },
});

const incomplete = buildDecisionClockDependencyLedger({
  sourceArrivalMeasurements: measurements,
  dependencyObserverReports: [
    report("2026-09-28", true, true, "2026-09-28T06:10:00Z"),
    report("2026-09-29", true, false, "2026-09-29T06:10:00Z"),
  ],
});
assert.equal(incomplete.independentTradingDates, 2);
assert.equal(incomplete.completeDateCount, 1);
assert.equal(incomplete.dependencyCoverage.A5_QUARTERLY_FINANCIALS, true);
assert.equal(incomplete.dependencyCoverage.B2_INDUSTRY_THESIS_PROSPECTIVE, false);
assert.deepEqual(
  incomplete.missingDatesByDependency.B2_INDUSTRY_THESIS_PROSPECTIVE,
  ["2026-09-29"],
);

const complete = buildDecisionClockDependencyLedger({
  sourceArrivalMeasurements: measurements,
  dependencyObserverReports: [
    report("2026-09-28", true, true, "2026-09-28T06:10:00Z"),
    report("2026-09-29", true, false, "2026-09-29T06:05:00Z"),
    report("2026-09-29", true, true, "2026-09-29T06:15:00Z"),
  ],
});
assert.equal(complete.allDatesComplete, true);
assert.equal(complete.dependencyCoverage.A5_QUARTERLY_FINANCIALS, true);
assert.equal(complete.dependencyCoverage.B2_INDUSTRY_THESIS_PROSPECTIVE, true);
assert.equal(complete.exactClockAuthorized, false);
assert.equal(complete.cronAuthorized, false);

const noTrading = buildDecisionClockDependencyLedger({
  sourceArrivalMeasurements: [{ marketDate: "2026-09-27", expectedTradingDay: false }],
  dependencyObserverReports: [],
});
assert.equal(noTrading.allDatesComplete, false);
assert.equal(noTrading.dependencyCoverage.A5_QUARTERLY_FINANCIALS, false);

console.log("System2 decision-clock dependency ledger tests passed");
