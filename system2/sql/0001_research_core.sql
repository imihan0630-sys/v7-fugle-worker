-- System 2 research-only storage schema.
-- DO NOT apply to the V8 production D1 database without a separate Class-B review.

CREATE TABLE IF NOT EXISTS s2_strategy_versions (
  strategy_id TEXT NOT NULL,
  version TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  definition_json TEXT NOT NULL,
  definition_hash TEXT NOT NULL,
  parent_version TEXT,
  change_reason TEXT NOT NULL,
  PRIMARY KEY (strategy_id, version)
);

CREATE TABLE IF NOT EXISTS s2_factor_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  scope TEXT NOT NULL,
  scope_key TEXT NOT NULL,
  factor_id TEXT NOT NULL,
  factor_version TEXT NOT NULL,
  state TEXT NOT NULL,
  raw_value_json TEXT,
  normalized_value REAL,
  confidence REAL,
  source_id TEXT NOT NULL,
  observed_at TEXT,
  available_at TEXT,
  captured_at TEXT NOT NULL,
  point_in_time_eligible INTEGER,
  unknown_reason TEXT,
  quality_flags_json TEXT NOT NULL,
  payload_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_s2_factor_market_symbol
  ON s2_factor_snapshots (market_date, scope_key, factor_id);

CREATE INDEX IF NOT EXISTS idx_s2_factor_available
  ON s2_factor_snapshots (available_at, factor_id);

CREATE TABLE IF NOT EXISTS s2_market_regime_snapshots (
  regime_snapshot_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  labels_json TEXT NOT NULL,
  states_json TEXT NOT NULL,
  factor_refs_json TEXT NOT NULL,
  warnings_json TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_regime_market_date
  ON s2_market_regime_snapshots (market_date);

CREATE TABLE IF NOT EXISTS s2_decisions (
  decision_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  decision_state TEXT NOT NULL,
  rank_value INTEGER,
  total_score REAL,
  factor_refs_json TEXT NOT NULL,
  interaction_refs_json TEXT NOT NULL,
  regime_snapshot_id TEXT NOT NULL,
  reasons_json TEXT NOT NULL,
  warnings_json TEXT NOT NULL,
  missing_required_factors_json TEXT NOT NULL,
  thesis TEXT,
  invalidation_json TEXT NOT NULL,
  entry_plan_json TEXT NOT NULL,
  frozen_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  decision_hash TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_s2_decision_strategy_date
  ON s2_decisions (strategy_id, strategy_version, market_date);

CREATE INDEX IF NOT EXISTS idx_s2_decision_symbol_date
  ON s2_decisions (symbol, market_date);

CREATE TABLE IF NOT EXISTS s2_sim_orders (
  sim_order_id TEXT PRIMARY KEY,
  decision_id TEXT NOT NULL,
  side TEXT NOT NULL,
  order_type TEXT NOT NULL,
  order_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL
);

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
  fill_json TEXT NOT NULL
);

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
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  starting_equity REAL NOT NULL,
  ending_equity REAL NOT NULL,
  realized_pnl REAL NOT NULL,
  unrealized_pnl REAL NOT NULL,
  capital_utilization REAL NOT NULL,
  positions_count INTEGER NOT NULL,
  selected_count INTEGER NOT NULL,
  triggered_count INTEGER NOT NULL,
  turnover REAL NOT NULL,
  costs REAL NOT NULL,
  metrics_json TEXT NOT NULL,
  PRIMARY KEY (market_date, strategy_id, strategy_version)
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
