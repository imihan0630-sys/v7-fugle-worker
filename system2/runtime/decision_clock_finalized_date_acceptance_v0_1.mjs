import { deepFreeze } from "./factor_snapshot.mjs";

export const DECISION_CLOCK_FINALIZED_DATE_ACCEPTANCE_VERSION =
  "S2_DECISION_CLOCK_FINALIZED_DATE_ACCEPTANCE_V0_1";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(field + " is required");
  }
  return value.trim();
}

function dateOnly(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error(field + " must be YYYY-MM-DD");
  }
  return text;
}

export function auditFinalizedDecisionClockDateV01({
  report,
  marketDate,
} = {}) {
  if (!report || report.reportVersion !== "S2_DECISION_CLOCK_ARTIFACT_REPORT_V0_1") {
    throw new Error("S2 Decision Clock artifact report V0.1 is required");
  }
  const targetDate = dateOnly(
    marketDate || report.coverageFinalization?.coverageThroughDate,
    "marketDate",
  );
  const coverageStartDate = report.coverageFinalization?.coverageStartDate || null;
  const coverageThroughDate = report.coverageFinalization?.coverageThroughDate || null;
  const coverageRows = Array.isArray(report.coverageIntegrity?.rows)
    ? report.coverageIntegrity.rows
    : [];
  const selectedArtifacts = Array.isArray(report.aggregation?.selectedArtifacts)
    ? report.aggregation.selectedArtifacts
    : [];

  const coverageRow = coverageRows.find((row) => row?.marketDate === targetDate) || null;
  const selected = selectedArtifacts.find((row) => row?.marketDate === targetDate) || null;

  const finalizedWindowIncluded =
    Boolean(coverageStartDate && coverageThroughDate)
    && targetDate >= coverageStartDate
    && targetDate <= coverageThroughDate;

  let status = "NOT_IN_FINALIZED_WINDOW";
  let countsTowardIndependentDate = false;
  let countsTowardCompleteTradingDate = false;
  let countsTowardPrecisionEligibleDate = false;

  if (finalizedWindowIncluded && coverageRow?.expectedTradingDay === false) {
    status = "NON_TRADING_DAY_SKIP";
  } else if (finalizedWindowIncluded && coverageRow?.expectedTradingDay === true) {
    if (coverageRow.promotionCoverageEligible !== true) {
      status = "COVERAGE_REJECTED";
    } else if (!selected) {
      status = "PROMOTION_ARTIFACT_MISSING";
    } else if (selected.runAttempt !== 1) {
      status = "NON_ATTEMPT_ONE_SELECTED";
    } else if (selected.runId !== coverageRow.runId) {
      status = "COVERAGE_ANCHOR_RUN_MISMATCH";
    } else {
      countsTowardIndependentDate = true;

      if (
        selected.sameSessionClockReady === true
        && selected.a5AvailableByCandidate !== true
      ) {
        status = "A5_NOT_AVAILABLE_BY_CANDIDATE";
      } else if (selected.requiredReady !== true) {
        status = "INCOMPLETE_REQUIRED_EVIDENCE";
      } else {
        countsTowardCompleteTradingDate = true;
        if (selected.precisionEligible === true) {
          status = "COMPLETE_PRECISE";
          countsTowardPrecisionEligibleDate = true;
        } else {
          status = "COMPLETE_IMPRECISE";
        }
      }
    }
  }

  const promotionQualificationVersion =
    report.aggregation?.promotionQualificationVersion || null;
  const selectedCountedByAggregation =
    Array.isArray(report.aggregation?.promotionGradeMarketDates)
    && report.aggregation.promotionGradeMarketDates.includes(targetDate);

  if (countsTowardIndependentDate !== selectedCountedByAggregation) {
    throw new Error(
      "finalized-date acceptance disagrees with aggregation promotion-grade membership for "
      + targetDate,
    );
  }

  return deepFreeze({
    auditVersion: DECISION_CLOCK_FINALIZED_DATE_ACCEPTANCE_VERSION,
    marketDate: targetDate,
    finalizedWindow: {
      coverageStartDate,
      coverageThroughDate,
      included: finalizedWindowIncluded,
    },
    status,
    expectedTradingDay: coverageRow?.expectedTradingDay ?? null,
    coverageClass: coverageRow?.coverageClass || null,
    coverageFailureClass: coverageRow?.failureClass || null,
    coveragePromotionEligible: coverageRow?.promotionCoverageEligible === true,
    coverageRunId: coverageRow?.runId || null,
    coverageRunAttempt: coverageRow?.runAttempt || null,
    coverageRunConclusion: coverageRow?.runConclusion || null,
    dailyArtifactCount: coverageRow?.dailyArtifactCount ?? null,
    promotionQualificationVersion,
    selectedArtifactPresent: Boolean(selected),
    selectedRunId: selected?.runId || null,
    selectedRunAttempt: selected?.runAttempt || null,
    evidenceSemanticsVersion: selected?.evidenceSemanticsVersion || null,
    requiredReady: selected?.requiredReady === true,
    precisionEligible: selected?.precisionEligible === true,
    sameSessionClockReady: selected?.sameSessionClockReady === true,
    a5AvailableByCandidate: selected?.a5AvailableByCandidate === true,
    a5ObservedAtDecisionBoundary: selected?.a5ObservedAtDecisionBoundary || null,
    candidateTimestamp: selected?.candidateTimestamp || null,
    candidateTaipeiTime: selected?.candidateTaipeiTime || null,
    collectorContractFingerprint: selected?.collectorContractFingerprint || null,
    workflowSha: selected?.workflowSha || null,
    collectorContractConsistent:
      report.aggregation?.collectorContractConsistent === true,
    countsTowardIndependentDate,
    countsTowardCompleteTradingDate,
    countsTowardPrecisionEligibleDate,
    selectedCountedByAggregation,
    pitSemantics: {
      publicationTimestampProven: false,
      firstReadyAtSemantics:
        "FIRST_OBSERVED_READY_UPPER_BOUND_NOT_SOURCE_PUBLICATION_TIME",
      capturedAtIsNotAvailableAt: true,
      historicalSubstitutionAllowed: false,
      sameDayDateOnlyAvailabilityCanProvePit: false,
    },
    safety: {
      exactDecisionClockAuthorized: false,
      workerCronAuthorized: false,
      captureEnabled: false,
      system1RuntimeUsed: false,
      externalMutationPerformed: false,
    },
  });
}
