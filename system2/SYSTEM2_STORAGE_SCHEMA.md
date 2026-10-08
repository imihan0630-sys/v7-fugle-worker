# System 2 Storage Schema

V0.5 adds the ranking-research, candidate-lifecycle, source-session, run-fingerprint, isolated-persistence provenance, schema metadata and infrastructure verification structures created during P1. The schema remains research-only and has never been applied to the System 1 production database.

Updated: 2026-09-26
Status: DESIGN V0.5 / RESEARCH-ONLY / NOT DEPLOYED

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
  - globalCount / vacancyCount / activeCountByStrategy / symbolStrategyCounts
  - selectionDenominator provenance for V0.2 receipts:
    - version = `S2_SELECTION_DENOMINATOR_PROVENANCE_V0_1`
    - denominatorState = `COMPLETE / PARTIAL / UNKNOWN`
    - unresolvedCount
    - unresolvedByState
    - blockerCodes
    - contributingShadowRuns[] with strategyId/version + runId + shadowAccountingHash (+ runFingerprintHash when available)
    - provenanceHash
- capacity_hash
- captured_at
- schema_version

Capacity receipt V0.2 rule:
- `capacity_hash` commits to the selection-denominator provenance as part of the immutable receipt identity.
- New daily Shadow capacity rows persist the provenance inside the existing `counts_json`; isolated D1 physical schema remains V1.1 and no table migration is required.
- A legacy V0.1 row whose `counts_json` lacks `selectionDenominator` must be read as `UNKNOWN / LEGACY_PROVENANCE_INCOMPLETE`, never COMPLETE.
- Denominator provenance is linked to contributing Shadow accounting by immutable `runId + shadowAccountingHash`; market date / decision timestamp alone is not an acceptable join.

Purpose:
audit the max-12 global pool, max-3 per-strategy active-monitor rules, multi-strategy overlap handling, valid-but-overflow state, and the denominator provenance behind the allocation without introducing a universal cross-strategy score.

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
System 2 virtual/simulated positions only; never owner actual holdings and never V8 live holdings.

Capability state: `VIRTUAL_POSITION_READY`.

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

Semantic guard:
- `quantity` / `cost_basis` in this table are virtual-position accounting fields derived from the System 2 simulation lane; they are not broker/account ownership evidence.
- A `POSITION_MONITOR` state backed by `s2_positions` means simulated/virtual position monitoring.
- Do not overload this table with actual holdings.
- Actual holdings use a separate screenshot-import store; `s2_positions` remains virtual-only.
- Authorized source: `USER_UPLOADED_BROKER_SCREENSHOT` with chat/vision-assisted structured extraction, deterministic validation, explicit confirmation and immutable readback.
- `ACTUAL_POSITION_MONITOR_VERIFIED=false` until a real Owner screenshot completes that chain.
- Broker API holdings and System 1 holdings import remain unauthorized.
- Signal, trigger, suggested/requested-share and plan records cannot be converted into actual holdings.

### s2_outcomes — LEGACY V0.1 / retained history

Existing rows are preserved for historical compatibility. New CORR-012 writes must not use this decision_id-only table because it cannot bind execution/cost/Regime lineage strongly enough for versioned performance research.

Legacy fields:
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

### s2_outcome_versions — V0.2 closed-lineage outcome maturation

Primary identity:
- outcome_version_id = deterministic hash of frozen decision / strategy / Regime / price-space / corporate-action / cost-scenario / execution lineage
- decision_id remains a parent reference, not the sole mutable identity

Frozen lineage:
- decision_hash
- strategy_id / strategy_version
- symbol / decision_timestamp
- regime_snapshot_id / regime_hash
- price_space
- corporate_action_state / corporate_action_lineage_hash
- cost_scenario_set_hash
- execution_hash / execution_version
- cost_model_hash
- tax_rule_id / tax_rule_hash

Maturable evidence under one unchanged outcome_version_id:
- d1/d3/d5/d10/d20 returns
- mfe / mae
- target_hit_session / stop_hit_session / ambiguous_same_bar
- realized_return_after_cost / holding_sessions
- updated_at

Separation contract:
- signal_return_json stores signal-price horizon returns and scenario estimates only
- simulated_execution_json stores simulated execution evidence only
- realized_return_after_cost is never relabeled from signal-price return
- outcome_json stores the full canonical V0.2 snapshot
- outcome_hash must recompute from the full canonical snapshot on candidate write, existing-row update and post-write readback

Maturation rules:
- null may become known when later evidence matures
- known horizon/barrier/realized values cannot be revised
- known MFE cannot decrease or become null
- known MAE cannot increase or become null
- once simulated execution is closed / realized, holding_sessions cannot change
- changed strategy, Regime, price space, corporate-action lineage, cost scenario, execution or tax assumptions require a distinct outcome_version_id rather than in-place replacement

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

### s2_actual_holdings_imports
Immutable structured extraction / validation receipt for one Owner-uploaded broker screenshot.

Key fields:
- import_id
- source_type = USER_UPLOADED_BROKER_SCREENSHOT
- source_image_sha256 / source_image_ref / source_image_name
- broker_name / account_alias
- screenshot_captured_at / received_at
- extraction_version / extraction_confidence
- validation_version / validation_state / review_state
- raw_extraction_json / normalized_extraction_json / validation_json
- idempotency_key / import_hash / schema_version

### s2_actual_holdings_snapshots
Immutable confirmed Actual Holdings snapshot. Never overwrites a previous snapshot.

Key fields:
- snapshot_id / import_id / previous_snapshot_id
- source_type / source_image_sha256
- broker_name / account_alias
- received_at / effective_as_of
- extraction_version / validation_version / review_state
- snapshot_state = CONFIRMED_ACTUAL_HOLDINGS
- row_count / rows_hash
- source_provenance_json
- raw_extraction_json / confirmed_holdings_json
- reconciliation_json
- idempotency_key / snapshot_hash
- immutable / schema_version

### s2_actual_holdings_rows
Confirmed rows belonging to one immutable snapshot.

- snapshot_id + symbol primary key
- company_name
- quantity
- average_cost
- market_price / market_value
- unrealized_pnl / unrealized_pnl_percent
- currency
- row_confidence
- validation_state
- row_json / row_hash / schema_version

### s2_actual_holdings_reconciliation_events
Append-only previous-vs-current exposure reconciliation.

- event_id
- snapshot_id / previous_snapshot_id
- symbol
- event_types_json
- prior_row_json / current_row_json
- explanation_json
- trade_inference = NOT_INFERRED
- review_required
- event_hash / schema_version

Allowed reconciliation labels include NEW_POSITION, INCREASED, REDUCED, CLOSED, UNCHANGED, AVG_COST_CHANGED, QUANTITY_CHANGED, POSSIBLE_CORPORATE_ACTION and REVIEW_REQUIRED.

Two holdings snapshots never prove exact intermediate trade price/time/order identity.
