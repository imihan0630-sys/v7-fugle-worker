import assert from "node:assert/strict";
import { runRequiredDependencyReadOnlySeries } from "../scripts/measure_required_dependency_series_readonly.mjs";
import { DEPENDENCY_OBSERVATION_STATE } from "../runtime/required_dependency_probes.mjs";

let call = 0;
let waits = 0;
const probe = async ({ marketDate, expectedTradingDay }) => {
  call += 1;
  const ready = call >= 3;
  return {
    marketDate,
    expectedTradingDay,
    observedAt: new Date(Date.parse("2026-09-29T05:35:00Z") + (call - 1) * 300000).toISOString(),
    dependencyStates: {
      A5_QUARTERLY_FINANCIALS:
        call >= 2 ? DEPENDENCY_OBSERVATION_STATE.READY : DEPENDENCY_OBSERVATION_STATE.NOT_READY,
      B2_INDUSTRY_THESIS_PROSPECTIVE:
        ready ? DEPENDENCY_OBSERVATION_STATE.READY : DEPENDENCY_OBSERVATION_STATE.NOT_READY,
    },
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


let errorThenReadyCall = 0;
const errorThenReady = await runRequiredDependencyReadOnlySeries({
  marketDate: "2026-09-29",
  expectedTradingDay: true,
  attempts: 2,
  intervalSeconds: 300,
  wait: async () => {},
  probe: async ({ marketDate, expectedTradingDay }) => {
    errorThenReadyCall += 1;
    const ready = errorThenReadyCall === 2;
    return {
      marketDate,
      expectedTradingDay,
      observedAt: new Date(
        Date.parse("2026-09-29T05:40:00Z") + (errorThenReadyCall - 1) * 300000,
      ).toISOString(),
      dependencyStates: {
        A5_QUARTERLY_FINANCIALS: DEPENDENCY_OBSERVATION_STATE.READY,
        B2_INDUSTRY_THESIS_PROSPECTIVE: ready
          ? DEPENDENCY_OBSERVATION_STATE.READY
          : DEPENDENCY_OBSERVATION_STATE.SOURCE_ERROR,
      },
      dependencyCoverage: {
        A5_QUARTERLY_FINANCIALS: true,
        B2_INDUSTRY_THESIS_PROSPECTIVE: ready,
      },
      prospectiveEvidenceEligible: ready,
    };
  },
});
const b2AfterError = errorThenReady.dependencySummaries.find(
  (x) => x.dependency === "B2_INDUSTRY_THESIS_PROSPECTIVE",
);
assert.deepEqual(
  b2AfterError.statesObserved,
  [DEPENDENCY_OBSERVATION_STATE.SOURCE_ERROR, DEPENDENCY_OBSERVATION_STATE.READY],
);
assert.equal(b2AfterError.sourceErrorObserved, true);
assert.equal(b2AfterError.lastObservedNotReadyAt, null);
assert.equal(b2AfterError.observationIntervalMinutes, null);
assert.equal(b2AfterError.validNotReadyToReadyBracketObserved, false);

console.log("System2 required dependency series tests passed");
