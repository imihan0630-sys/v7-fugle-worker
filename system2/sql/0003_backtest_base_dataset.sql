-- System 2 bulk backtest / historical Base Dataset migration V0.7.
-- RESEARCH-ONLY. Applies only to isolated SYSTEM2_DB / system2-research.
-- Never apply to V8 production storage.

CREATE TABLE IF NOT EXISTS s2_backtest_runs (
  run_id TEXT PRIMARY KEY,
  plan_hash TEXT NOT NULL,
  dataset_version TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  policy_id TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  first_market_date TEXT NOT NULL,
  last_market_date TEXT NOT NULL,
  requested_date_count INTEGER NOT NULL,
  completed_date_count INTEGER NOT NULL,
  processed_sample_count INTEGER NOT NULL,
  state_counts_json TEXT NOT NULL,
  date_summaries_json TEXT NOT NULL,
  all_requested_dates_complete INTEGER NOT NULL,
  hard_symbol_limit INTEGER,
  partition_size INTEGER NOT NULL,
  selection_policy_authorized INTEGER NOT NULL,
  rolling_digest TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  run_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_backtest_runs_strategy_range
  ON s2_backtest_runs (strategy_id, strategy_version, first_market_date, last_market_date);

CREATE TABLE IF NOT EXISTS s2_backtest_checkpoints (
  checkpoint_hash TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  plan_hash TEXT NOT NULL,
  completed_through_date TEXT,
  completed_dates_json TEXT NOT NULL,
  processed_sample_count INTEGER NOT NULL,
  state_counts_json TEXT NOT NULL,
  date_summaries_json TEXT NOT NULL,
  rolling_digest TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_backtest_checkpoint_run
  ON s2_backtest_checkpoints (run_id, completed_through_date);

CREATE TABLE IF NOT EXISTS s2_historical_base_samples (
  sample_id TEXT PRIMARY KEY,
  base_dataset_id TEXT NOT NULL,
  backtest_run_id TEXT NOT NULL,
  market_date TEXT NOT NULL,
  decision_timestamp TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  market TEXT,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  policy_id TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  candidate_state TEXT NOT NULL,
  archive_cohort TEXT NOT NULL,
  rank_value INTEGER,
  total_score REAL,
  strategy_validity TEXT,
  entry_readiness TEXT,
  factor_bundle_hash TEXT,
  factor_bundle_version TEXT,
  pit_replay_hash TEXT,
  source_available_at TEXT,
  core_metrics_json TEXT,
  factor_observations_json TEXT NOT NULL,
  regime_json TEXT,
  entry_plan_json TEXT,
  thesis_json TEXT,
  invalidation_json TEXT,
  reasons_json TEXT NOT NULL,
  warnings_json TEXT NOT NULL,
  outcome_attached INTEGER NOT NULL DEFAULT 0,
  outcome_ref TEXT,
  archive_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_historical_base_strategy_date
  ON s2_historical_base_samples (strategy_id, strategy_version, market_date, archive_cohort);

CREATE INDEX IF NOT EXISTS idx_s2_historical_base_symbol_date
  ON s2_historical_base_samples (symbol, market_date);

CREATE INDEX IF NOT EXISTS idx_s2_historical_base_dataset
  ON s2_historical_base_samples (base_dataset_id, market_date);

INSERT INTO s2_schema_meta (schema_key, schema_value, updated_at)
VALUES ('schema_version', '0.7', '2026-09-28T09:55:00Z')
ON CONFLICT(schema_key) DO UPDATE SET
  schema_value = excluded.schema_value,
  updated_at = excluded.updated_at;
