import { deepFreeze } from "./factor_snapshot.mjs";
import { assessDecisionClockReadinessV02 } from "./decision_clock_readiness_v0_2.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function normalizeCandidate(raw, index) {
  if (!raw || typeof raw !== "object") throw new Error(`candidates[${index}] is required`);
  const bundle = raw.bundle;
  if (!bundle || bundle.bundleVersion !== "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_2") {
    throw new Error(`candidates[${index}].bundle must be V0.2 daily bundle`);
  }
  if (!bundle.evidence || bundle.evidence.evidenceVersion !== "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2") {
    throw new Error(`candidates[${index}].bundle.evidence must be V0.2 daily evidence`);
  }
  if (bundle.marketDate !== bundle.evidence.marketDate) {
    throw new Error(`candidates[${index}] marketDate mismatch`);
  }

  const runId = requiredText(String(raw.runId), `candidates[${index}].runId`);
  const eventName = requiredText(raw.eventName, `candidates[${index}].eventName`);
  const runCreatedAt = new Date(requiredText(raw.runCreatedAt, `candidates[${index}].runCreatedAt`));
  if (!Number.isFinite(runCreatedAt.getTime())) {
    throw new Error(`candidates[${index}].runCreatedAt must be timestamp`);
  }

  return {
    runId,
    runAttempt: Number.isInteger(raw.runAttempt) && raw.runAttempt > 0 ? raw.runAttempt : 1,
    eventName,
    runCreatedAt: runCreatedAt.toISOString(),
    artifactId: raw.artifactId ? String(raw.artifactId) : null,
    artifactName: raw.artifactName ? String(raw.artifactName) : null,
    marketDate: bundle.marketDate,
    bundle,
  };
}

function compareProvenance(a, b) {
  const byTime = a.runCreatedAt.localeCompare(b.runCreatedAt);
  if (byTime !== 0) return byTime;
  return a.runId.localeCompare(b.runId, "en", { numeric: true });
}

export function aggregateDecisionClockEvidence({
  candidates = [],
  scheduledRunCoverage = [],
  workflowFile = "system2-prospective-clock-evidence-readonly.yml",
} = {}) {
  if (!Array.isArray(candidates)) throw new Error("candidates must be an array");
  if (!Array.isArray(scheduledRunCoverage)) {
    throw new Error("scheduledRunCoverage must be an array");
  }

  const rows = candidates.map(normalizeCandidate);
  const manualDiagnostics = rows
    .filter((x) => x.eventName !== "schedule")
    .sort((a, b) => a.marketDate.localeCompare(b.marketDate) || compareProvenance(a, b));

  const scheduled = rows
    .filter((x) => x.eventName === "schedule")
    .sort((a, b) => a.marketDate.localeCompare(b.marketDate) || compareProvenance(a, b));

  const byDate = new Map();
  for (const row of scheduled) {
    if (!byDate.has(row.marketDate)) byDate.set(row.marketDate, []);
    byDate.get(row.marketDate).push(row);
  }

  const selected = [];
  const duplicateScheduled = [];
  for (const [marketDate, dateRows] of [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const ordered = [...dateRows].sort(compareProvenance);
    const first = ordered[0];
    selected.push(first);
    for (const duplicate of ordered.slice(1)) {
      duplicateScheduled.push({
        marketDate,
        selectedRunId: first.runId,
        excludedRunId: duplicate.runId,
        excludedRunCreatedAt: duplicate.runCreatedAt,
        reason: "LATER_SCHEDULED_DUPLICATE_NOT_PROMOTION_GRADE",
      });
    }
  }

  const readiness = assessDecisionClockReadinessV02({
    dailyEvidence: selected.map((x) => x.bundle.evidence),
  });

  const coverageRows = scheduledRunCoverage.map((row, index) => {
    if (!row || typeof row !== "object") {
      throw new Error(`scheduledRunCoverage[${index}] is required`);
    }
    const marketDate = requiredText(row.marketDate, `scheduledRunCoverage[${index}].marketDate`);
    if (typeof row.expectedTradingDay !== "boolean") {
      throw new Error(`scheduledRunCoverage[${index}].expectedTradingDay must be boolean`);
    }
    return {
      marketDate,
      runId: requiredText(String(row.runId), `scheduledRunCoverage[${index}].runId`),
      expectedTradingDay: row.expectedTradingDay,
      artifactPresent: row.artifactPresent === true,
      runConclusion: row.runConclusion ? String(row.runConclusion) : null,
    };
  });

  const tradingDayArtifactGaps = coverageRows.filter(
    (x) => x.expectedTradingDay === true && x.artifactPresent !== true,
  );
  const nonTradingScheduledRuns = coverageRows.filter(
    (x) => x.expectedTradingDay === false,
  );
  const artifactCoverageAudited = coverageRows.length > 0;
  const promotionCoverageComplete =
    artifactCoverageAudited && tradingDayArtifactGaps.length === 0;

  let promotionReadinessStatus = readiness.status;
  if (!artifactCoverageAudited) promotionReadinessStatus = "COVERAGE_UNAUDITED";
  else if (!promotionCoverageComplete) promotionReadinessStatus = "SCHEDULED_TRADING_DAY_ARTIFACT_GAPS";

  return deepFreeze({
    aggregationVersion: "S2_DECISION_CLOCK_EVIDENCE_AGGREGATION_V0_1",
    workflowFile: requiredText(workflowFile, "workflowFile"),
    promotionPolicy: "EARLIEST_SCHEDULED_ARTIFACT_PER_MARKET_DATE",
    candidateArtifactCount: rows.length,
    scheduledArtifactCount: scheduled.length,
    manualDiagnosticArtifactCount: manualDiagnostics.length,
    promotionGradeDateCount: selected.length,
    promotionGradeMarketDates: selected.map((x) => x.marketDate),
    selectedArtifacts: selected.map((x) => ({
      marketDate: x.marketDate,
      runId: x.runId,
      runAttempt: x.runAttempt,
      runCreatedAt: x.runCreatedAt,
      artifactId: x.artifactId,
      artifactName: x.artifactName,
      requiredReady: x.bundle.evidence.requiredReady,
      precisionEligible: x.bundle.evidence.precisionEligible,
      candidateTaipeiTime: x.bundle.evidence.candidateTaipeiTime,
    })),
    duplicateScheduledArtifacts: duplicateScheduled,
    manualDiagnosticArtifacts: manualDiagnostics.map((x) => ({
      marketDate: x.marketDate,
      runId: x.runId,
      eventName: x.eventName,
      runCreatedAt: x.runCreatedAt,
      artifactId: x.artifactId,
      artifactName: x.artifactName,
    })),
    readiness,
    scheduledRunCoverage: coverageRows,
    tradingDayArtifactGaps,
    nonTradingScheduledRuns,
    artifactCoverageAudited,
    promotionCoverageComplete,
    promotionReadinessStatus,
    exactDecisionClockAuthorized: false,
    cronAuthorized: false,
    captureEnabled: false,
  });
}
