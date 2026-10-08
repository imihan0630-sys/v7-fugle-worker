-- System2 CORR-012: versioned outcome lineage V0.2.
-- Research-only additive migration. Existing s2_outcomes history is preserved.

CREATE TABLE IF NOT EXISTS s2_outcome_versions (
  outcome_version_id TEXT PRIMARY KEY,
  decision_id TEXT NOT NULL,
  decision_hash TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  symbol TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  regime_snapshot_id TEXT NOT NULL,
  regime_hash TEXT NOT NULL,
  price_space TEXT NOT NULL,
  corporate_action_state TEXT NOT NULL,
  corporate_action_lineage_hash TEXT NOT NULL,
  cost_scenario_set_hash TEXT NOT NULL,
  execution_hash TEXT,
  execution_version TEXT,
  cost_model_hash TEXT,
  tax_rule_id TEXT,
  tax_rule_hash TEXT,
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
  signal_return_json TEXT NOT NULL,
  realized_return_after_cost REAL,
  holding_sessions INTEGER,
  simulated_execution_json TEXT,
  outcome_hash TEXT NOT NULL,
  outcome_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (decision_id, outcome_version_id)
);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_decision
  ON s2_outcome_versions (decision_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_strategy
  ON s2_outcome_versions (strategy_id, strategy_version, decision_timestamp);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_regime
  ON s2_outcome_versions (regime_snapshot_id, regime_hash);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_versions_execution
  ON s2_outcome_versions (execution_hash, cost_model_hash, tax_rule_hash);
