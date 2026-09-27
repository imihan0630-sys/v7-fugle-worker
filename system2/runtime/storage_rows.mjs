function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function json(value) {
  return JSON.stringify(value ?? null);
}

export function toShadowDecisionRow(snapshot, { factorSnapshotId } = {}) {
  if (!snapshot || typeof snapshot !== "object") throw new Error("snapshot is required");
  const e = snapshot.evaluation || {};

  return Object.freeze({
    decision_id: requiredText(e.decisionId, "evaluation.decisionId"),
    factor_snapshot_id: requiredText(factorSnapshotId, "factorSnapshotId"),
    market_date: requiredText(e.marketDate, "evaluation.marketDate"),
    decision_timestamp: requiredText(e.decisionTimestamp, "evaluation.decisionTimestamp"),
    strategy_id: requiredText(e.strategyId, "evaluation.strategyId"),
    strategy_version: requiredText(e.strategyVersion, "evaluation.strategyVersion"),
    symbol: requiredText(e.symbol, "evaluation.symbol"),
    company_name: e.companyName || null,
    candidate_state: requiredText(e.state, "evaluation.state"),
    strategy_validity: e.strategyValidity || null,
    entry_readiness: e.entryReadiness || null,
    source_readiness: e.sourceReadiness || null,
    shadow_spec_id: e.shadowSpecId || null,
    evaluation_mode: e.evaluationMode || null,
    rank_value: Number.isFinite(e.rank) ? e.rank : null,
    total_score: Number.isFinite(e.totalScore) ? e.totalScore : null,
    reasons_json: json(e.reasons || []),
    warnings_json: json(e.warnings || []),
    missing_required_factors_json: json(e.missingRequiredFactors || []),
    entry_plan_json: json(snapshot.entryPlan || {}),
    thesis_json: json(e.thesis ?? null),
    invalidation_json: json(e.invalidationConditions || []),
    regime_snapshot_id: requiredText(e.regimeSnapshotId, "evaluation.regimeSnapshotId"),
    frozen_at: requiredText(snapshot.frozenAt, "snapshot.frozenAt"),
    schema_version: requiredText(snapshot.schemaVersion, "snapshot.schemaVersion"),
    decision_hash: requiredText(e.decisionHash, "evaluation.decisionHash"),
  });
}

export function toShadowRunRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    run_id: requiredText(receipt.runId, "runId"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    strategy_id: requiredText(receipt.strategyId, "strategyId"),
    strategy_version: requiredText(receipt.strategyVersion, "strategyVersion"),
    shadow_spec_id: requiredText(receipt.shadowSpecId, "shadowSpecId"),
    universe_version: requiredText(receipt.universeVersion, "universeVersion"),
    run_state: requiredText(receipt.runState, "runState"),
    base_universe_count: Number(receipt.baseUniverseCount),
    excluded_count: Number(receipt.excludedCount),
    eligible_count: Number(receipt.eligibleCount),
    accounted_count: Number(receipt.accountedCount),
    completion_rate: Number(receipt.completionRate),
    state_counts_json: json(receipt.stateCounts || {}),
    unaccounted_symbols_json: json(receipt.unaccountedSymbols || []),
    symbol_accounts_json: json(receipt.symbolAccounts || []),
    warnings_json: json(receipt.warnings || []),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
  });
}
