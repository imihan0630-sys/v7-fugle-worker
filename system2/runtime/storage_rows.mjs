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


export function toCapacityRunRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    capacity_run_id: requiredText(receipt.capacityRunId, "capacityRunId"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    global_max: Number(receipt.globalMax),
    per_strategy_max: Number(receipt.perStrategyMax),
    ordering_policy_id: requiredText(receipt.orderingPolicyId, "orderingPolicyId"),
    ordering_policy_version: requiredText(receipt.orderingPolicyVersion, "orderingPolicyVersion"),
    retained_json: json(receipt.retained || []),
    removed_json: json(receipt.removed || []),
    admitted_new_json: json(receipt.admittedNew || []),
    capacity_overflow_json: json(receipt.capacityOverflow || []),
    global_pool_json: json(receipt.globalPool || []),
    active_assignments_json: json(receipt.activeAssignments || {}),
    active_non_assignments_json: json(receipt.activeNonAssignments || {}),
    counts_json: json({
      globalCount: receipt.globalCount,
      vacancyCount: receipt.vacancyCount,
      activeCountByStrategy: receipt.activeCountByStrategy || {},
      symbolStrategyCounts: receipt.symbolStrategyCounts || {},
    }),
    capacity_hash: requiredText(receipt.capacityHash, "capacityHash"),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
    schema_version: requiredText(receipt.schemaVersion, "schemaVersion"),
  });
}


export function toStrategyOrderingRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    ordering_receipt_id: requiredText(receipt.orderingReceiptId, "orderingReceiptId"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    purpose: requiredText(receipt.purpose, "purpose"),
    strategy_id: requiredText(receipt.strategyId, "strategyId"),
    strategy_version: requiredText(receipt.strategyVersion, "strategyVersion"),
    ordering_policy_id: requiredText(receipt.orderingPolicyId, "orderingPolicyId"),
    ordering_policy_version: requiredText(receipt.orderingPolicyVersion, "orderingPolicyVersion"),
    candidate_count: Number(receipt.candidateCount),
    ordered_candidates_json: json(receipt.orderedCandidates || []),
    ordering_hash: requiredText(receipt.orderingHash, "orderingHash"),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
    schema_version: requiredText(receipt.schemaVersion, "schemaVersion"),
  });
}


export function toRankingExperimentRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    experiment_receipt_id: requiredText(receipt.experimentReceiptId, "experimentReceiptId"),
    experiment_id: requiredText(receipt.experimentId, "experimentId"),
    experiment_version: requiredText(receipt.experimentVersion, "experimentVersion"),
    hypothesis_id: requiredText(receipt.hypothesisId, "hypothesisId"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    purpose: requiredText(receipt.purpose, "purpose"),
    strategy_id: requiredText(receipt.strategyId, "strategyId"),
    strategy_version: requiredText(receipt.strategyVersion, "strategyVersion"),
    baseline_policy_id: requiredText(receipt.baselinePolicyId, "baselinePolicyId"),
    baseline_policy_version: requiredText(receipt.baselinePolicyVersion, "baselinePolicyVersion"),
    baseline_ordering_hash: requiredText(receipt.baselineOrderingHash, "baselineOrderingHash"),
    challenger_policy_id: requiredText(receipt.challengerPolicyId, "challengerPolicyId"),
    challenger_policy_version: requiredText(receipt.challengerPolicyVersion, "challengerPolicyVersion"),
    challenger_ordering_hash: requiredText(receipt.challengerOrderingHash, "challengerOrderingHash"),
    same_candidate_set: receipt.sameCandidateSet ? 1 : 0,
    common_support_symbols_json: json(receipt.commonSupportSymbols || []),
    baseline_only_symbols_json: json(receipt.baselineOnlySymbols || []),
    challenger_only_symbols_json: json(receipt.challengerOnlySymbols || []),
    rank_deltas_json: json(receipt.rankDeltas || []),
    outcome_attached: receipt.outcomeAttached ? 1 : 0,
    experiment_hash: requiredText(receipt.experimentHash, "experimentHash"),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
    schema_version: requiredText(receipt.schemaVersion, "schemaVersion"),
  });
}


export function toRank05DisplacementRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    receipt_id: requiredText(receipt.receiptId, "receiptId"),
    experiment_id: requiredText(receipt.experimentId, "experimentId"),
    experiment_version: requiredText(receipt.experimentVersion, "experimentVersion"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    incumbent_symbol: requiredText(receipt.incumbent?.symbol, "incumbent.symbol"),
    incumbent_episode_id: requiredText(
      receipt.incumbent?.candidateEpisodeId,
      "incumbent.candidateEpisodeId",
    ),
    incumbent_pool_sessions: Number(receipt.incumbent?.candidatePoolSessions),
    incumbent_json: json(receipt.incumbent),
    challenger_symbol: requiredText(receipt.challenger?.symbol, "challenger.symbol"),
    challenger_json: json(receipt.challenger),
    classification: requiredText(receipt.classification, "classification"),
    shadow_displacement_eligible: receipt.shadowDisplacementEligible ? 1 : 0,
    action: requiredText(receipt.action, "action"),
    outcome_attached: receipt.outcomeAttached ? 1 : 0,
    receipt_hash: requiredText(receipt.receiptHash, "receiptHash"),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
    schema_version: requiredText(receipt.schemaVersion, "schemaVersion"),
  });
}


export function toStrategyOverlapRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    receipt_id: requiredText(receipt.receiptId, "receiptId"),
    experiment_id: requiredText(receipt.experimentId, "experimentId"),
    experiment_version: requiredText(receipt.experimentVersion, "experimentVersion"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    strategy_a_json: json(receipt.strategyA),
    strategy_b_json: json(receipt.strategyB),
    shared_core_families_json: json(receipt.sharedCoreFamilies || []),
    distinct_core_a_json: json(receipt.distinctCoreFamiliesA || []),
    distinct_core_b_json: json(receipt.distinctCoreFamiliesB || []),
    shared_all_families_json: json(receipt.sharedAllFamilies || []),
    diagnostics_json: json(receipt.diagnostics || {}),
    independent_same_clock_validity: receipt.independentSameClockValidity ? 1 : 0,
    naive_strategy_count_bonus_allowed: receipt.naiveStrategyCountBonusAllowed ? 1 : 0,
    overlap_priority_effect_authorized: receipt.overlapPriorityEffectAuthorized ? 1 : 0,
    research_state: requiredText(receipt.researchState, "researchState"),
    overlap_hash: requiredText(receipt.overlapHash, "overlapHash"),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
    schema_version: requiredText(receipt.schemaVersion, "schemaVersion"),
  });
}

export function toCandidateConcentrationRow(receipt) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");

  return Object.freeze({
    receipt_id: requiredText(receipt.receiptId, "receiptId"),
    experiment_id: requiredText(receipt.experimentId, "experimentId"),
    experiment_version: requiredText(receipt.experimentVersion, "experimentVersion"),
    market_date: requiredText(receipt.marketDate, "marketDate"),
    decision_timestamp: requiredText(receipt.decisionTimestamp, "decisionTimestamp"),
    classification_version: requiredText(receipt.classificationVersion, "classificationVersion"),
    global_count: Number(receipt.globalCount),
    known_industry_count: Number(receipt.knownIndustryCount),
    unknown_industry_count: Number(receipt.unknownIndustryCount),
    known_industry_coverage: Number(receipt.knownIndustryCoverage),
    unknown_industry_symbols_json: json(receipt.unknownIndustrySymbols || []),
    industry_rows_json: json(receipt.industryRows || []),
    largest_industry_json: json(receipt.largestIndustry ?? null),
    industry_hhi_known_only:
      Number.isFinite(receipt.industryHhiKnownOnly) ? receipt.industryHhiKnownOnly : null,
    strategy_membership_counts_json: json(receipt.strategyMembershipCounts || {}),
    multi_strategy_symbol_count: Number(receipt.multiStrategySymbolCount),
    effect_authorization_json: json({
      admission: receipt.concentrationAdmissionEffectAuthorized === true,
      eviction: receipt.concentrationEvictionEffectAuthorized === true,
      sizing: receipt.concentrationSizingEffectAuthorized === true,
    }),
    warnings_json: json(receipt.warnings || []),
    concentration_hash: requiredText(receipt.concentrationHash, "concentrationHash"),
    captured_at: requiredText(receipt.capturedAt, "capturedAt"),
    schema_version: requiredText(receipt.schemaVersion, "schemaVersion"),
  });
}
