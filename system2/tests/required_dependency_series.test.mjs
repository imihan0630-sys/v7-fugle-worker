import assert from "node:assert/strict";
import { runRequiredDependencyReadOnlySeries } from "../scripts/measure_required_dependency_series_readonly.mjs";

let call = 0;
let waits = 0;
const probe = async ({ marketDate, expectedTradingDay }) => {
  call += 1;
  const ready = call >= 3;
  return {
    marketDate,
    expectedTradingDay,
    observedAt: new Date(Date.parse("2026-09-29T05:35:00Z") + (call - 1) * 300000).toISOString(),
    dependencyCoverage: {
      A5_QUARTERLY_FINANCIALS: call >= 2,
      B2_INDUSTRY_THESIS_PROSPECTIVE: ready,
    },
    prospectiveEvidenceEligible: ready,
  };
};

const result = await runRequiredDependencyReadOnlySeries({
  marketDate: "2026-09-29",
  expectedTradingDay: true,
  attempts: 10,
  intervalSeconds: 300,
  probe,
  wait: async () => { waits += 1; },
});

assert.equal(call, 3);
assert.equal(waits, 2);
assert.equal(result.prospectiveEvidenceEligible, true);
assert.equal(result.firstAllEligibleAt, "2026-09-29T05:45:00.000Z");
assert.equal(result.dependencyCoverage.A5_QUARTERLY_FINANCIALS, true);
assert.equal(result.dependencyCoverage.B2_INDUSTRY_THESIS_PROSPECTIVE, true);
assert.equal(
  result.dependencySummaries.find((x) => x.dependency === "B2_INDUSTRY_THESIS_PROSPECTIVE")
    .observationIntervalMinutes,
  5,
);

console.log("System2 required dependency series tests passed");
