import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const HISTORICAL_BASE_DATASET_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function cohortOf(sample) {
  if (sample.candidateState === "SELECTED") return "SELECTED";
  if (sample.candidateState === "QUALIFIED_NOT_SELECTED") return "NEAR_MISS";
  if (sample.candidateState === "REJECTED" && sample.importantRejected === true) {
    return "IMPORTANT_REJECTED";
  }
  return null;
}

function compactSample(sample, cohort, datasetId) {
  return {
    sampleId: requiredText(sample.sampleId, "sample.sampleId"),
    baseDatasetId: datasetId,
    backtestRunId: requiredText(sample.runId, "sample.runId"),
    marketDate: requiredText(sample.marketDate, "sample.marketDate"),
    decisionTimestamp: requiredText(sample.decisionTimestamp, "sample.decisionTimestamp"),
    symbol: requiredText(sample.symbol, "sample.symbol"),
    companyName: sample.companyName || null,
    market: sample.market || null,
    strategyId: requiredText(sample.strategyId, "sample.strategyId"),
    strategyVersion: requiredText(sample.strategyVersion, "sample.strategyVersion"),
    policyId: requiredText(sample.policyId, "sample.policyId"),
    policyVersion: requiredText(sample.policyVersion, "sample.policyVersion"),
    candidateState: requiredText(sample.candidateState, "sample.candidateState"),
    archiveCohort: cohort,
    rank: Number.isFinite(sample.rank) ? sample.rank : null,
    totalScore: Number.isFinite(sample.totalScore) ? sample.totalScore : null,
    strategyValidity: sample.strategyValidity || null,
    entryReadiness: sample.entryReadiness || null,
    factorBundleHash: sample.factorBundleHash || null,
    factorBundleVersion: sample.factorBundleVersion || null,
    pitReplayHash: sample.pitReplayHash || null,
    sourceAvailableAt: sample.sourceAvailableAt || null,
    coreMetrics: sample.coreMetrics || null,
    factorObservations: sample.factorObservations || [],
    regime: sample.regime || null,
    entryPlan: sample.entryPlan || null,
    thesis: sample.thesis || null,
    invalidation: sample.invalidation || null,
    reasons: Object.freeze([...(sample.reasons || [])].map(String)),
    warnings: Object.freeze([...(sample.warnings || [])].map(String)),
    outcomeAttached: false,
    outcomeRef: null,
  };
}

export async function buildHistoricalBaseDatasetV0_1({
  baseDatasetId,
  backtestRun,
  samples,
  capturedAt,
} = {}) {
  const datasetId = requiredText(baseDatasetId, "baseDatasetId");
  if (!backtestRun || backtestRun.schemaVersion !== "S2_BULK_BACKTEST_RUN_V0_1") {
    throw new Error("valid backtestRun is required");
  }
  if (backtestRun.allRequestedDatesComplete !== true) {
    throw new Error("historical base dataset requires a complete backtest run");
  }
  if (!Array.isArray(samples)) throw new Error("samples must be an array");
  const captureTime = assertTimestamp(capturedAt, "capturedAt");

  const archived = [];
  const seenSampleIds = new Set();
  const cohortCounts = {
    SELECTED: 0,
    NEAR_MISS: 0,
    IMPORTANT_REJECTED: 0,
  };

  for (const sample of samples) {
    if (!sample || typeof sample !== "object") throw new Error("sample must be an object");
    if (sample.runId !== backtestRun.runId) throw new Error("sample runId mismatch");
    const sampleId = requiredText(sample.sampleId, "sample.sampleId");
    if (seenSampleIds.has(sampleId)) throw new Error("duplicate sampleId: " + sampleId);
    seenSampleIds.add(sampleId);

    const cohort = cohortOf(sample);
    if (!cohort) continue;
    const compact = compactSample(sample, cohort, datasetId);
    const archiveHash = await sha256Hex(compact);
    archived.push(deepFreeze({ ...compact, archiveHash }));
    cohortCounts[cohort] += 1;
  }

  archived.sort((a, b) =>
    a.marketDate.localeCompare(b.marketDate)
      || a.strategyId.localeCompare(b.strategyId)
      || a.symbol.localeCompare(b.symbol),
  );

  const dateAccounting = backtestRun.dateSummaries.map((row) => ({
    marketDate: row.marketDate,
    baseUniverseCount: row.baseUniverseCount,
    excludedCount: row.excludedCount,
    eligibleCount: row.eligibleCount,
    accountedCount: row.accountedCount,
    stateCounts: row.stateCounts,
    selectedCount: row.selectedCount,
    zeroPickDay: row.zeroPickDay,
    allEligibleSymbolsAccounted: row.allEligibleSymbolsAccounted,
  }));
  if (dateAccounting.some((x) => x.allEligibleSymbolsAccounted !== true)) {
    throw new Error("historical base dataset refuses incomplete full-universe accounting");
  }

  const base = {
    baseDatasetId: datasetId,
    backtestRunId: backtestRun.runId,
    backtestRunHash: requiredText(backtestRun.runHash, "backtestRun.runHash"),
    datasetVersion: requiredText(backtestRun.datasetVersion, "backtestRun.datasetVersion"),
    strategyId: requiredText(backtestRun.strategyId, "backtestRun.strategyId"),
    strategyVersion: requiredText(backtestRun.strategyVersion, "backtestRun.strategyVersion"),
    policyId: requiredText(backtestRun.policyId, "backtestRun.policyId"),
    policyVersion: requiredText(backtestRun.policyVersion, "backtestRun.policyVersion"),
    firstMarketDate: requiredText(backtestRun.firstMarketDate, "backtestRun.firstMarketDate"),
    lastMarketDate: requiredText(backtestRun.lastMarketDate, "backtestRun.lastMarketDate"),
    fullUniverseProcessedSampleCount: Number(backtestRun.processedSampleCount),
    archivedSampleCount: archived.length,
    cohortCounts: deepFreeze(cohortCounts),
    zeroPickDates: Object.freeze(
      dateAccounting.filter((x) => x.zeroPickDay).map((x) => x.marketDate),
    ),
    dateAccounting: Object.freeze(dateAccounting),
    samples: Object.freeze(archived),
    historicalReplayOnly: true,
    prospectiveShadowEvidence: false,
    outcomeAttached: false,
    capturedAt: captureTime,
    schemaVersion: "S2_HISTORICAL_BASE_DATASET_V0_1",
  };
  const datasetHash = await sha256Hex(base);
  return deepFreeze({ ...base, datasetHash });
}

export function toHistoricalBaseSampleRows(dataset) {
  if (!dataset || dataset.schemaVersion !== "S2_HISTORICAL_BASE_DATASET_V0_1") {
    throw new Error("valid historical base dataset is required");
  }
  return Object.freeze(dataset.samples.map((sample) => Object.freeze({
    sample_id: sample.sampleId,
    base_dataset_id: dataset.baseDatasetId,
    backtest_run_id: sample.backtestRunId,
    market_date: sample.marketDate,
    decision_timestamp: sample.decisionTimestamp,
    symbol: sample.symbol,
    company_name: sample.companyName,
    market: sample.market,
    strategy_id: sample.strategyId,
    strategy_version: sample.strategyVersion,
    policy_id: sample.policyId,
    policy_version: sample.policyVersion,
    candidate_state: sample.candidateState,
    archive_cohort: sample.archiveCohort,
    rank_value: sample.rank,
    total_score: sample.totalScore,
    strategy_validity: sample.strategyValidity,
    entry_readiness: sample.entryReadiness,
    factor_bundle_hash: sample.factorBundleHash,
    factor_bundle_version: sample.factorBundleVersion,
    pit_replay_hash: sample.pitReplayHash,
    source_available_at: sample.sourceAvailableAt,
    core_metrics_json: JSON.stringify(sample.coreMetrics ?? null),
    factor_observations_json: JSON.stringify(sample.factorObservations || []),
    regime_json: JSON.stringify(sample.regime ?? null),
    entry_plan_json: JSON.stringify(sample.entryPlan ?? null),
    thesis_json: JSON.stringify(sample.thesis ?? null),
    invalidation_json: JSON.stringify(sample.invalidation ?? null),
    reasons_json: JSON.stringify(sample.reasons || []),
    warnings_json: JSON.stringify(sample.warnings || []),
    outcome_attached: 0,
    outcome_ref: null,
    archive_hash: sample.archiveHash,
    schema_version: dataset.schemaVersion,
  })));
}

export function toBacktestRunRow(run) {
  if (!run || run.schemaVersion !== "S2_BULK_BACKTEST_RUN_V0_1") {
    throw new Error("valid backtest run is required");
  }
  return Object.freeze({
    run_id: run.runId,
    plan_hash: run.planHash,
    dataset_version: run.datasetVersion,
    strategy_id: run.strategyId,
    strategy_version: run.strategyVersion,
    policy_id: run.policyId,
    policy_version: run.policyVersion,
    first_market_date: run.firstMarketDate,
    last_market_date: run.lastMarketDate,
    requested_date_count: run.requestedDateCount,
    completed_date_count: run.completedDateCount,
    processed_sample_count: run.processedSampleCount,
    state_counts_json: JSON.stringify(run.stateCounts || {}),
    date_summaries_json: JSON.stringify(run.dateSummaries || []),
    all_requested_dates_complete: run.allRequestedDatesComplete ? 1 : 0,
    hard_symbol_limit: run.hardSymbolLimit,
    partition_size: run.partitionSize,
    selection_policy_authorized: run.selectionPolicyAuthorized ? 1 : 0,
    rolling_digest: run.rollingDigest,
    captured_at: run.capturedAt,
    run_hash: run.runHash,
    schema_version: run.schemaVersion,
  });
}

export function toBacktestCheckpointRow(checkpoint) {
  if (!checkpoint || checkpoint.schemaVersion !== "S2_BULK_BACKTEST_CHECKPOINT_V0_1") {
    throw new Error("valid checkpoint is required");
  }
  return Object.freeze({
    checkpoint_hash: checkpoint.checkpointHash,
    run_id: checkpoint.runId,
    plan_hash: checkpoint.planHash,
    completed_through_date: checkpoint.completedThroughDate,
    completed_dates_json: JSON.stringify(checkpoint.completedDates || []),
    processed_sample_count: checkpoint.processedSampleCount,
    state_counts_json: JSON.stringify(checkpoint.stateCounts || {}),
    date_summaries_json: JSON.stringify(checkpoint.dateSummaries || []),
    rolling_digest: checkpoint.rollingDigest,
    captured_at: checkpoint.capturedAt,
    schema_version: checkpoint.schemaVersion,
  });
}

export function toHistoricalBasePersistenceRecords({ dataset, backtestRun } = {}) {
  if (!dataset || !backtestRun) throw new Error("dataset and backtestRun are required");
  const records = [
    { table: "s2_backtest_runs", row: toBacktestRunRow(backtestRun) },
  ];
  if (backtestRun.latestCheckpoint) {
    records.push({
      table: "s2_backtest_checkpoints",
      row: toBacktestCheckpointRow(backtestRun.latestCheckpoint),
    });
  }
  for (const row of toHistoricalBaseSampleRows(dataset)) {
    records.push({ table: "s2_historical_base_samples", row });
  }
  return Object.freeze(records);
}
