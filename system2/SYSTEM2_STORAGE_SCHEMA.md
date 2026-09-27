# System 2 Storage Schema

Updated: 2026-09-26
Status: DESIGN V0.3 / RESEARCH-ONLY / NOT DEPLOYED

## Goals

- immutable daily decision records;
- reproducible PIT factor snapshots;
- separate signal vs fill;
- strategy-version comparison;
- portfolio/performance accounting;
- no coupling to V8 live signal tables;
- scale to full-market daily capture without exploding row count.

## Capacity finding

Taiwan ordinary-share universe is roughly 1,900 symbols. At about 250 sessions/year:

- one symbol-level snapshot per stock/day: about 475,000 rows/year;
- 20 factor rows per stock/day: about 9.5 million rows/year;
- 30 factor rows per stock/day: about 14.25 million rows/year;
- 60 factor rows per stock/day: about 28.5 million rows/year.

Because System 2 needs many factors and interactions, V0.1's one-row-per-factor physical layout is not the preferred full-market storage design.

V0.2 stores one immutable factor bundle per symbol/day/version, while keeping the logical FactorObservation objects inside JSON and materializing only fields that need indexing.

## Proposed logical tables

### s2_strategy_versions
Immutable strategy version definitions.

- strategy_id
- version
- status: DRAFT / SHADOW / VALIDATED / RETIRED
- created_at
- config_json
- factor_definition_hash
- execution_assumption_hash
- parent_version
- change_reason
- notes

Primary key: (strategy_id, version)

### s2_market_regime_snapshots
One frozen market-context record per decision clock/version.

- regime_snapshot_id
- market_date
- decision_timestamp
- regime_version
- labels_json
- states_json
- factor_observations_json
- source_receipts_json
- unknowns_json
- snapshot_hash

### s2_industry_snapshots
One frozen industry/sector bundle per industry/day/version.

- industry_snapshot_id
- market_date
- decision_timestamp
- industry_key
- classification_version
- factor_bundle_version
- factors_json
- source_manifest_json
- completeness_state
- snapshot_hash

Historical use requires PIT-safe classification membership.

### s2_symbol_factor_snapshots
Preferred full-market factor persistence: one row per symbol/day/factor-bundle version.

- snapshot_id
- market_date
- decision_timestamp
- symbol
- company_name
- factor_bundle_version
- regime_snapshot_id
- industry_snapshot_id
- core_metrics_json
- factor_observations_json
- interaction_observations_json
- source_manifest_json
- completeness_state
- unknowns_json
- captured_at
- snapshot_hash

The JSON bundle preserves each factor's:
- factorId/version
- rawValue
- normalizedValue
- state
- confidence
- observedAt/availableAt/source
- normalization metadata
- UNKNOWN reason / quality flags

This keeps logical factor auditability without tens of millions of physical rows per year.

### s2_shadow_runs
One immutable run-level completeness receipt per strategy / decision clock.

- run_id
- market_date
- decision_timestamp
- strategy_id
- strategy_version
- shadow_spec_id
- universe_version
- run_state: COMPLETE / INCOMPLETE
- base_universe_count
- excluded_count
- eligible_count
- accounted_count
- completion_rate
- state_counts_json
- unaccounted_symbols_json
- symbol_accounts_json
- warnings_json
- captured_at

Purpose:
prove that a Shadow run did not silently preserve only selected/winning symbols. Every base-universe symbol must be frozen as excluded or every eligible symbol must have an evaluation/accounting state.

### s2_source_session_receipts
Immutable source-availability receipt for one decision clock.

- receipt_id
- market_date
- decision_timestamp
- source_session_state
- required_blockers_json
- optional_gaps_json
- source_rows_json
- extra_observed_sources_json
- expected_source_count
- observed_source_count
- outcome_join_source_eligible
- source_session_hash
- captured_at
- schema_version

### s2_shadow_run_fingerprints
Immutable join key linking source/session/accounting/decision/ranking/capacity/lifecycle provenance.

- fingerprint_id
- market_date
- decision_timestamp
- strategy_id
- strategy_version
- shadow_spec_id
- universe_version
- source_session_hash
- shadow_accounting_hash
- decision_hashes_json
- ordering_hashes_json
- ranking_experiment_hashes_json
- capacity_hash
- lifecycle_hashes_json
- run_fingerprint_state
- blockers_json
- outcome_join_eligible
- run_fingerprint_hash
- captured_at
- schema_version

### s2_strategy_overlap_receipts
Immutable descriptive redundancy receipt for a pair of strategy contracts.

- receipt_id
- experiment_id
- experiment_version
- market_date
- decision_timestamp
- strategy_a_json
- strategy_b_json
- shared_core_families_json
- distinct_core_a_json
- distinct_core_b_json
- shared_all_families_json
- diagnostics_json
- independent_same_clock_validity
- naive_strategy_count_bonus_allowed
- overlap_priority_effect_authorized
- research_state
- overlap_hash
- captured_at
- schema_version

### s2_candidate_concentration_receipts
Immutable concentration measurement for one global candidate-pool snapshot.

- receipt_id
- experiment_id
- experiment_version
- market_date
- decision_timestamp
- classification_version
- global_count
- known_industry_count
- unknown_industry_count
- known_industry_coverage
- unknown_industry_symbols_json
- industry_rows_json
- largest_industry_json
- industry_hhi_known_only
- strategy_membership_counts_json
- multi_strategy_symbol_count
- effect_authorization_json
- warnings_json
- concentration_hash
- captured_at
- schema_version

### s2_rank05_displacement_receipts
Immutable incumbent-vs-challenger Shadow comparison receipt.

- receipt_id
- experiment_id
- experiment_version
- market_date
- decision_timestamp
- incumbent_symbol
- incumbent_episode_id
- incumbent_pool_sessions
- incumbent_json
- challenger_symbol
- challenger_json
- classification
- shadow_displacement_eligible
- action
- outcome_attached
- receipt_hash
- captured_at
- schema_version

Purpose:
measure stale-pool opportunity cost without actually evicting valid incumbents before evidence supports a displacement policy.

### s2_ranking_experiment_receipts
Immutable baseline-vs-challenger ordering comparison before outcomes are attached.

- experiment_receipt_id
- experiment_id
- experiment_version
- hypothesis_id
- market_date
- decision_timestamp
- purpose
- strategy_id
- strategy_version
- baseline_policy_id
- baseline_policy_version
- baseline_ordering_hash
- challenger_policy_id
- challenger_policy_version
- challenger_ordering_hash
- same_candidate_set
- common_support_symbols_json
- baseline_only_symbols_json
- challenger_only_symbols_json
- rank_deltas_json
- outcome_attached
- experiment_hash
- captured_at
- schema_version

Purpose:
preserve prospective common-support ranking comparisons without letting later outcomes redefine the candidate set.

### s2_candidate_lifecycle_receipts
Immutable state-transition receipts for persistent candidate episodes.

- lifecycle_receipt_id
- candidate_episode_id
- symbol
- market_date
- transition_timestamp
- from_state
- to_state
- memberships_json
- reason_codes_json
- evidence_refs_json
- capacity_eligible
- position_monitor
- lifecycle_hash
- schema_version

### s2_candidate_reentry_receipts
Links a terminal prior candidate episode to a newly qualified episode without rewriting history.

- reentry_receipt_id
- symbol
- previous_episode_id
- new_episode_id
- requalified_decision_id
- reentry_timestamp
- reason_codes_json
- reentry_hash
- schema_version

### s2_strategy_ordering_receipts
Immutable receipt of strategy-local ordering supplied to the capacity layer.

- ordering_receipt_id
- market_date
- decision_timestamp
- purpose: GLOBAL_ADMISSION / ACTIVE_INTRADAY_MONITOR
- strategy_id
- strategy_version
- ordering_policy_id
- ordering_policy_version
- candidate_count
- ordered_candidates_json
- ordering_hash
- captured_at
- schema_version

Purpose:
preserve exactly which strategy-local order was supplied without pretending that different strategy ranks are numerically comparable.

### s2_capacity_runs
One immutable capacity-allocation receipt per candidate-pool decision clock.

- capacity_run_id
- market_date
- decision_timestamp
- global_max
- per_strategy_max
- ordering_policy_id
- ordering_policy_version
- retained_json
- removed_json
- admitted_new_json
- capacity_overflow_json
- global_pool_json
- active_assignments_json
- active_non_assignments_json
- counts_json
- capacity_hash
- captured_at
- schema_version

Purpose:
audit the max-12 global pool, max-3 per-strategy active-monitor rules, multi-strategy overlap handling, and valid-but-overflow state without introducing a universal cross-strategy score.

### s2_decisions
- decision_id
- factor_snapshot_id
- market_date
- decision_timestamp
- strategy_id
- strategy_version
- symbol
- company_name
- rank
- total_score
- candidate_state
- strategy_validity
- entry_readiness
- source_readiness
- shadow_spec_id
- evaluation_mode
- reasons_json
- warnings_json
- missing_required_factors_json
- entry_plan_json
- thesis_json
- invalidation_json
- regime_snapshot_id
- snapshot_hash
- frozen_at
- schema_version

Decisions are immutable. Corrections create a linked correction record.

V0.3 adds explicit strategy-validity / entry-readiness / source-readiness / Shadow-spec metadata so `VALID + TOO_EXTENDED`, `INCOMPLETE + BLOCKED`, and other non-selected states remain queryable rather than being collapsed into one candidate-state label.

### s2_decision_corrections
- correction_id
- original_decision_id
- correction_timestamp
- reason
- corrected_fields_json
- evidence_json

Never overwrite original historical intent.

### s2_sim_orders
- sim_order_id
- decision_id
- side
- order_type
- trigger_rule_version
- order_json
- created_at
- state

### s2_sim_fills
- sim_fill_id
- sim_order_id
- fill_timestamp
- raw_fill_price
- quantity
- slippage
- commission
- transaction_tax
- all_in_price
- feasibility_flags_json
- ambiguity_state
- fill_json

Signal price != fill price.

### s2_positions
System 2 virtual positions only; never V8 live holdings.

- position_id
- portfolio_id
- strategy_id/version
- symbol
- opened_at
- quantity
- cost_basis
- capital_committed
- state
- closed_at
- exit_reason

### s2_outcomes
- decision_id
- d1/d3/d5/d10/d20 returns
- mfe / mae
- first_target_session
- stop_session
- ambiguous_same_bar
- final_return
- holding_sessions
- cost_adjusted_return
- outcome_json

### s2_strategy_daily_performance
- portfolio_id
- strategy_id/version
- market_date
- starting/ending equity
- cash / exposure
- realized/unrealized P&L
- turnover / cost
- drawdown
- capital utilization
- selected / triggered / position counts
- metrics_json

### s2_event_theses
Structured event/industry thesis lifecycle:
- firstKnownAt
- horizon/half-life
- mechanism
- beneficiaries/victims
- confidence
- thesis state
- invalidation
- evidence

### s2_experiment_ledger
Preregistration and falsification ledger:
- experiment_id
- preregistration_timestamp
- hypothesis
- strategy/version
- factor set
- test window / holdout rule
- primary metric
- falsification conditions
- multiple-test family
- status / result reference

## Query strategy

Common research queries should use:
- market_date + symbol;
- strategy_id/version + market_date;
- candidate_state + market_date;
- industry_key + market_date;
- regime_snapshot_id.

If a factor later needs frequent SQL-level filtering across the full universe, materialize that factor as a versioned indexed column/table deliberately. Do not pre-normalize every possible future factor into a physical row.

## Data retention

Raw receipts and frozen snapshots must be retained long enough to reconstruct why a decision existed on that date.

Decision snapshots and strategy versions are append-only.

## Isolation

System 2 table prefix is `s2_`.

The SQL file under `system2/sql/` is design/test material only and is not applied to the V8 production D1 database.

A future shared D1/database integration is Class B because shared runtime/storage could indirectly affect production. Owner review is required before applying any System 2 migration to a production-shared database.

Preferred deployment architecture is a separate System 2 database/binding if practical, even if the website/frontend remains shared.
