-- System 2 versioned outcome lineage V0.2.
-- RESEARCH-ONLY. Additive table; does not rewrite legacy s2_outcomes.
-- Never apply to System1/V8 production storage.

CREATE TABLE IF NOT EXISTS s2_outcome_versions (
  outcome_version_id TEXT PRIMARY KEY,
  decision_id TEXT NOT NULL,
  decision_hash TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  symbol TEXT NOT NULL,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  regime_snapshot_id TEXT NOT NULL,
  regime_hash TEXT NOT NULL,
  price_space TEXT NOT NULL,
  corporate_action_state TEXT NOT NULL,
  corporate_action_hash TEXT NOT NULL,
  execution_hash TEXT NOT NULL,
  execution_version TEXT NOT NULL,
  cost_model_hash TEXT NOT NULL,
  cost_model_version TEXT NOT NULL,
  tax_rule_id TEXT NOT NULL,
  lineage_hash TEXT NOT NULL,
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
  signal_returns_json TEXT NOT NULL,
  signal_cost_scenarios_json TEXT NOT NULL,
  simulated_execution_state TEXT NOT NULL,
  simulated_net_return_after_cost REAL,
  simulated_holding_sessions INTEGER,
  simulated_fill_quality TEXT,
  outcome_payload_json TEXT NOT NULL,
  outcome_hash TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (decision_id, lineage_hash)
);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_decision
  ON s2_outcome_versions (decision_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_strategy_date
  ON s2_outcome_versions (strategy_id, strategy_version, market_date);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_regime
  ON s2_outcome_versions (regime_snapshot_id, regime_hash, market_date);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_lineage
  ON s2_outcome_versions (lineage_hash, updated_at);
