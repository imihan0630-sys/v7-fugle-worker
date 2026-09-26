# System 2 Storage Schema

Updated: 2026-09-26
Status: DESIGN V0.1 / RESEARCH-ONLY

## Goals

- immutable daily decision records;
- reproducible factor snapshots;
- separate signal vs fill;
- strategy-version comparison;
- portfolio/performance accounting;
- PIT provenance;
- no coupling to V8 live signal tables.

## Proposed logical tables

### s2_strategy_versions
- strategy_id
- version
- status: DRAFT / SHADOW / VALIDATED / RETIRED
- created_at
- config_json
- factor_definition_hash
- execution_assumption_hash
- notes

Primary key: (strategy_id, version)

### s2_market_regime_snapshots
- market_date
- decision_timestamp
- regime_version
- regime_json
- source_receipts_json
- unknowns_json

Immutable by decision_timestamp/version.

### s2_factor_snapshots
- decision_id
- symbol
- factor_version
- factor_group
- factor_key
- raw_value
- normalized_value
- score_contribution
- confidence
- source
- observed_at
- available_at
- unknown_reason

### s2_decisions
- decision_id
- market_date
- decision_timestamp
- strategy_id
- strategy_version
- symbol
- company_name
- rank
- total_score
- selected
- candidate_state
- entry_zone_low
- entry_zone_high
- trigger_price
- stop_price
- targets_json
- max_holding_sessions
- thesis_json
- invalidation_json
- warnings_json
- snapshot_hash
- created_at

Decisions are immutable. Corrections create a linked correction record.

### s2_decision_corrections
- correction_id
- original_decision_id
- correction_timestamp
- reason
- corrected_fields_json
- evidence_json

Never overwrite original historical intent.

### s2_sim_orders
- order_id
- decision_id
- side
- order_type
- trigger_rule_version
- intended_price
- active_from
- expires_at
- size_rule
- planned_notional
- state

### s2_sim_fills
- fill_id
- order_id
- fill_timestamp
- fill_price
- quantity
- slippage
- fee
- tax
- feasibility_flags_json
- bar_source
- ambiguity_state

Signal price != fill price.

### s2_positions
- portfolio_id
- strategy_id
- symbol
- opened_at
- quantity
- cost_basis
- realized_pnl
- unrealized_pnl
- state

This is System 2 simulation/research state, not V8 live holdings.

### s2_outcomes
- decision_id
- d1_return
- d3_return
- d5_return
- d10_return
- d20_return
- mfe
- mae
- first_target_session
- stop_session
- ambiguous_same_bar
- final_return
- holding_sessions
- cost_adjusted_return

### s2_strategy_daily_performance
- portfolio_id
- strategy_id
- strategy_version
- market_date
- equity
- cash
- exposure
- daily_return
- turnover
- cost
- drawdown
- selected_count
- triggered_count
- open_positions

### s2_experiment_ledger
- experiment_id
- preregistration_timestamp
- hypothesis
- strategy_id/version
- factor_set
- test_window
- holdout_rule
- primary_metric
- falsification_conditions
- multiple_test_family
- status
- result_reference

## Data retention rule

Raw receipts and frozen snapshots must be retained long enough to reconstruct why a decision existed on that date.

## Isolation

System 2 table prefix is `s2_`. No System 2 migration may alter V8 production tables during P0-P4 bootstrap.

A future shared D1/database implementation is Class B because shared runtime/storage can indirectly affect production; owner review is required before integration.
