-- System 2 research-only storage schema V0.2.
-- DESIGN/TEST ONLY. DO NOT apply to the V8 production D1 database without Class-B review.
-- V0.1 was never deployed; V0.2 replaces physical per-factor rows with daily symbol bundles.

CREATE TABLE IF NOT EXISTS s2_strategy_versions (
  strategy_id TEXT NOT NULL,
  version TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  definition_json TEXT NOT NULL,
  definition_hash TEXT NOT NULL,
  execution_assumption_hash TEXT,
  parent_version TEXT,
  change_reason TEXT NOT NULL,
  notes TEXT,
  PRIMARY KEY (strategy_id, version)
);

CREATE TABLE IF NOT EXISTS s2_market_regime_snapshots (
  regime_snapshot_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  regime_version TEXT NOT NULL,
  labels_json TEXT NOT NULL,
  states_json TEXT NOT NULL,
  factor_observations_json TEXT NOT NULL,
  source_receipts_json TEXT NOT NULL,
  unknowns_json TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_regime_market_date
  ON s2_market_regime_snapshots (market_date, regime_version);

CREATE TABLE IF NOT EXISTS s2_industry_snapshots (
  industry_snapshot_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  industry_key TEXT NOT NULL,
  classification_version TEXT NOT NULL,
  factor_bundle_version TEXT NOT NULL,
  factors_json TEXT NOT NULL,
  source_manifest_json TEXT NOT NULL,
  completeness_state TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_industry_date
  ON s2_industry_snapshots (market_date, industry_key, factor_bundle_version);

CREATE TABLE IF NOT EXISTS s2_symbol_factor_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  factor_bundle_version TEXT NOT NULL,
  regime_snapshot_id TEXT,
  industry_snapshot_id TEXT,
  core_metrics_json TEXT NOT NULL,
  factor_observations_json TEXT NOT NULL,
  interaction_observations_json TEXT NOT NULL,
  source_manifest_json TEXT NOT NULL,
  completeness_state TEXT NOT NULL,
  unknowns_json TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_s2_symbol_bundle_unique
  ON s2_symbol_factor_snapshots
  (market_date, decision_timestamp, symbol, factor_bundle_version);

CREATE INDEX IF NOT EXISTS idx_s2_symbol_date
  ON s2_symbol_factor_snapshots (symbol, market_date);

CREATE TABLE IF NOT EXISTS s2_decisions (
  decision_id TEXT PRIMARY KEY,
  factor_snapshot_id TEXT NOT NULL,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  candidate_state TEXT NOT NULL,
  rank_value INTEGER,
  total_score REAL,
  reasons_json TEXT NOT NULL,
  warnings_json TEXT NOT NULL,
  missing_required_factors_json TEXT NOT NULL,
  entry_plan_json TEXT NOT NULL,
  thesis_json TEXT,
  invalidation_json TEXT NOT NULL,
  regime_snapshot_id TEXT NOT NULL,
  frozen_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  decision_hash TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_s2_decision_strategy_date
  ON s2_decisions (strategy_id, strategy_version, market_date);

CREATE INDEX IF NOT EXISTS idx_s2_decision_symbol_date
  ON s2_decisions (symbol, market_date);

CREATE INDEX IF NOT EXISTS idx_s2_decision_state_date
  ON s2_decisions (candidate_state, market_date);

CREATE TABLE IF NOT EXISTS s2_decision_corrections (
  correction_id TEXT PRIMARY KEY,
  original_decision_id TEXT NOT NULL,
  correction_timestamp TEXT NOT NULL,
  reason TEXT NOT NULL,
  corrected_fields_json TEXT NOT NULL,
  evidence_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS s2_sim_orders (
  sim_order_id TEXT PRIMARY KEY,
  decision_id TEXT NOT NULL,
  side TEXT NOT NULL,
  order_type TEXT NOT NULL,
  trigger_rule_version TEXT NOT NULL,
  order_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_order_decision
  ON s2_sim_orders (decision_id, created_at);

CREATE TABLE IF NOT EXISTS s2_sim_fills (
  sim_fill_id TEXT PRIMARY KEY,
  sim_order_id TEXT NOT NULL,
  fill_timestamp TEXT,
  raw_fill_price REAL,
  slippage REAL,
  commission REAL,
  transaction_tax REAL,
  all_in_price REAL,
  shares INTEGER,
  fill_quality TEXT NOT NULL,
  ambiguity_reason TEXT,
  feasibility_flags_json TEXT NOT NULL,
  fill_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_fill_order
  ON s2_sim_fills (sim_order_id, fill_timestamp);

CREATE TABLE IF NOT EXISTS s2_positions (
  position_id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  symbol TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  cost_basis REAL NOT NULL,
  capital_committed REAL NOT NULL,
  state TEXT NOT NULL,
  closed_at TEXT,
  exit_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_s2_position_strategy
  ON s2_positions (strategy_id, strategy_version, state);

CREATE TABLE IF NOT EXISTS s2_outcomes (
  decision_id TEXT PRIMARY KEY,
  d1_return REAL,
  d3_return REAL,
  d5_return REAL,
  d10_return REAL,
  d20_return REAL,
  mfe REAL,
  mae REAL,
  target_hit_session INTEGER,
  stop_hit_session INTEGER,
  ambiguous_same_bar INTEGER NOT NULL DEFAULT 0,
  realized_return_after_cost REAL,
  holding_sessions INTEGER,
  outcome_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS s2_strategy_daily_performance (
  market_date TEXT NOT NULL,
  portfolio_id TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  starting_equity REAL NOT NULL,
  ending_equity REAL NOT NULL,
  cash REAL NOT NULL,
  exposure REAL NOT NULL,
  realized_pnl REAL NOT NULL,
  unrealized_pnl REAL NOT NULL,
  capital_utilization REAL NOT NULL,
  positions_count INTEGER NOT NULL,
  selected_count INTEGER NOT NULL,
  triggered_count INTEGER NOT NULL,
  turnover REAL NOT NULL,
  costs REAL NOT NULL,
  drawdown REAL,
  metrics_json TEXT NOT NULL,
  PRIMARY KEY (market_date, portfolio_id, strategy_id, strategy_version)
);

CREATE TABLE IF NOT EXISTS s2_event_theses (
  thesis_id TEXT PRIMARY KEY,
  scope_type TEXT NOT NULL,
  scope_key TEXT NOT NULL,
  event_type TEXT NOT NULL,
  first_known_at TEXT NOT NULL,
  horizon_class TEXT NOT NULL,
  half_life_json TEXT,
  mechanism TEXT NOT NULL,
  beneficiaries_json TEXT NOT NULL,
  victims_json TEXT NOT NULL,
  confidence REAL,
  thesis_state TEXT NOT NULL,
  invalidation_conditions_json TEXT NOT NULL,
  evidence_json TEXT NOT NULL,
  last_reviewed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS s2_experiment_ledger (
  experiment_id TEXT PRIMARY KEY,
  preregistration_timestamp TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  strategy_id TEXT,
  strategy_version TEXT,
  factor_set_json TEXT NOT NULL,
  test_window_json TEXT NOT NULL,
  holdout_rule_json TEXT NOT NULL,
  primary_metric TEXT NOT NULL,
  falsification_conditions_json TEXT NOT NULL,
  multiple_test_family TEXT,
  status TEXT NOT NULL,
  result_reference TEXT
);
