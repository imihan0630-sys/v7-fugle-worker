import assert from "node:assert/strict";
import {
  classifyDecisionClockCoverageRowV02,
  summarizeDecisionClockCoverageFailuresV02,
} from "../runtime/decision_clock_coverage_integrity_v0_2.mjs";

const noRun = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-09-29",
  expectedTradingDay: true,
  runId: null,
  dailyArtifactCount: 0,
});
assert.equal(noRun.failureClass, "NO_COMPLETED_SCHEDULED_RUN");
assert.equal(noRun.promotionCoverageEligible, false);

const failed = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-09-30",
  expectedTradingDay: true,
  runId: "200",
  runConclusion: "failure",
  dailyArtifactCount: 0,
});
assert.equal(failed.failureClass, "SCHEDULED_RUN_NOT_SUCCESS");

const rerun = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-10-07",
  expectedTradingDay: true,
  runId: "250",
  runAttempt: 2,
  runConclusion: "success",
  dailyArtifactCount: 1,
});
assert.equal(rerun.failureClass, "SCHEDULED_RUN_RERUN_ATTEMPT");
assert.equal(rerun.promotionCoverageEligible, false);

const missingArtifact = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-10-01",
  expectedTradingDay: true,
  runId: "300",
  runAttempt: 1,
  runConclusion: "success",
  dailyArtifactCount: 0,
});
assert.equal(missingArtifact.failureClass, "DAILY_ARTIFACT_MISSING");

const duplicateArtifact = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-10-02",
  expectedTradingDay: true,
  runId: "400",
  runAttempt: 1,
  runConclusion: "success",
  dailyArtifactCount: 2,
});
assert.equal(duplicateArtifact.failureClass, "DAILY_ARTIFACT_COUNT_INVALID");

const complete = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-10-05",
  expectedTradingDay: true,
  runId: "500",
  runAttempt: 1,
  runConclusion: "success",
  dailyArtifactCount: 1,
});
assert.equal(complete.coverageClass, "TRADING_DAY_COMPLETE");
assert.equal(complete.promotionCoverageEligible, true);

const holiday = classifyDecisionClockCoverageRowV02({
  marketDate: "2026-10-06",
  expectedTradingDay: false,
  runId: null,
  dailyArtifactCount: 0,
});
assert.equal(holiday.coverageClass, "OFFICIAL_NON_TRADING_DAY");
assert.equal(holiday.failureClass, null);

const counts = summarizeDecisionClockCoverageFailuresV02([
  noRun, failed, rerun, missingArtifact, duplicateArtifact, complete, holiday,
]);
assert.deepEqual(counts, {
  NO_COMPLETED_SCHEDULED_RUN: 1,
  SCHEDULED_RUN_NOT_SUCCESS: 1,
  SCHEDULED_RUN_RERUN_ATTEMPT: 1,
  DAILY_ARTIFACT_MISSING: 1,
  DAILY_ARTIFACT_COUNT_INVALID: 1,
});

console.log("System2 Decision Clock coverage integrity V0.2 tests passed");
