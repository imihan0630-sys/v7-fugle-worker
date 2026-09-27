import { deepFreeze } from "./factor_snapshot.mjs";

export const DECISION_CLOCK_COVERAGE_FAILURE_CLASSES_V0_2 = Object.freeze([
  "NO_COMPLETED_SCHEDULED_RUN",
  "SCHEDULED_RUN_NOT_SUCCESS",
  "DAILY_ARTIFACT_MISSING",
  "DAILY_ARTIFACT_COUNT_INVALID",
]);

function requiredDate(value, field) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must be YYYY-MM-DD`);
  }
  return value;
}

function optionalText(value) {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

export function classifyDecisionClockCoverageRowV02(raw, index = 0) {
  if (!raw || typeof raw !== "object") {
    throw new Error(`scheduledRunCoverage[${index}] is required`);
  }
  const marketDate = requiredDate(raw.marketDate, `scheduledRunCoverage[${index}].marketDate`);
  if (typeof raw.expectedTradingDay !== "boolean") {
    throw new Error(`scheduledRunCoverage[${index}].expectedTradingDay must be boolean`);
  }

  const runId = optionalText(raw.runId);
  const runCreatedAt = optionalText(raw.runCreatedAt);
  const runConclusion = optionalText(raw.runConclusion);
  const dailyArtifactCount = Number.isInteger(raw.dailyArtifactCount) && raw.dailyArtifactCount >= 0
    ? raw.dailyArtifactCount
    : (raw.artifactPresent === true ? 1 : 0);

  if (!runId && dailyArtifactCount > 0) {
    throw new Error(`scheduledRunCoverage[${index}] cannot have artifacts without a runId`);
  }

  let coverageClass = "OFFICIAL_NON_TRADING_DAY";
  let failureClass = null;
  let promotionCoverageEligible = true;

  if (raw.expectedTradingDay === true) {
    if (!runId) {
      coverageClass = "TRADING_DAY_GAP";
      failureClass = "NO_COMPLETED_SCHEDULED_RUN";
      promotionCoverageEligible = false;
    } else if (runConclusion !== "success") {
      coverageClass = "TRADING_DAY_GAP";
      failureClass = "SCHEDULED_RUN_NOT_SUCCESS";
      promotionCoverageEligible = false;
    } else if (dailyArtifactCount === 0) {
      coverageClass = "TRADING_DAY_GAP";
      failureClass = "DAILY_ARTIFACT_MISSING";
      promotionCoverageEligible = false;
    } else if (dailyArtifactCount !== 1) {
      coverageClass = "TRADING_DAY_GAP";
      failureClass = "DAILY_ARTIFACT_COUNT_INVALID";
      promotionCoverageEligible = false;
    } else {
      coverageClass = "TRADING_DAY_COMPLETE";
      promotionCoverageEligible = true;
    }
  }

  return deepFreeze({
    marketDate,
    expectedTradingDay: raw.expectedTradingDay,
    runId,
    runAttempt: Number.isInteger(raw.runAttempt) && raw.runAttempt > 0 ? raw.runAttempt : null,
    runCreatedAt,
    runConclusion,
    dailyArtifactCount,
    artifactPresent: dailyArtifactCount > 0,
    coverageClass,
    failureClass,
    promotionCoverageEligible,
  });
}

export function summarizeDecisionClockCoverageFailuresV02(rows = []) {
  if (!Array.isArray(rows)) throw new Error("rows must be an array");
  const counts = Object.fromEntries(
    DECISION_CLOCK_COVERAGE_FAILURE_CLASSES_V0_2.map((key) => [key, 0]),
  );
  for (const row of rows) {
    if (row?.failureClass && Object.hasOwn(counts, row.failureClass)) {
      counts[row.failureClass] += 1;
    }
  }
  return deepFreeze(counts);
}
