-- System 2 bounded daily-resonance integration migration V1.1.
-- Applies only to isolated SYSTEM2_DB / system2-research.
-- Additive research/shadow storage; no System 1 tables, orders or push outbox.

CREATE TABLE IF NOT EXISTS s2_resonance_watch_pools (
  pool_id TEXT PRIMARY KEY,
  source_capacity_run_id TEXT NOT NULL UNIQUE,
  source_capacity_hash TEXT NOT NULL,
  source_market_date TEXT NOT NULL,
  source_decision_timestamp TEXT NOT NULL,
  activated_at TEXT NOT NULL,
  state TEXT NOT NULL,
  symbol_count INTEGER NOT NULL,
  symbols_json TEXT NOT NULL,
  memberships_json TEXT NOT NULL,
  pool_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_pool_active
  ON s2_resonance_watch_pools (state, source_market_date DESC, activated_at DESC);

CREATE TABLE IF NOT EXISTS s2_resonance_session_cache (
  cache_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  symbol TEXT NOT NULL,
  source_id TEXT NOT NULL,
  ticker_json TEXT NOT NULL,
  history_json TEXT NOT NULL,
  history_hash TEXT NOT NULL,
  history_first_date TEXT,
  history_last_date TEXT,
  history_bar_count INTEGER NOT NULL,
  adjusted INTEGER NOT NULL,
  continuity_state TEXT NOT NULL,
  continuity_receipt_json TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (market_date, symbol)
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_cache_date
  ON s2_resonance_session_cache (market_date, symbol);

CREATE TABLE IF NOT EXISTS s2_resonance_runs (
  run_id TEXT PRIMARY KEY,
  market_date TEXT NOT NULL,
  as_of TEXT NOT NULL,
  pool_id TEXT,
  run_state TEXT NOT NULL,
  symbol_count INTEGER NOT NULL,
  succeeded_count INTEGER NOT NULL,
  blocked_count INTEGER NOT NULL,
  failure_count INTEGER NOT NULL,
  diagnostics_json TEXT NOT NULL,
  run_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_runs_date
  ON s2_resonance_runs (market_date, as_of DESC);

CREATE TABLE IF NOT EXISTS s2_resonance_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  pool_id TEXT NOT NULL,
  market_date TEXT NOT NULL,
  symbol TEXT NOT NULL,
  as_of TEXT NOT NULL,
  quote_observed_at TEXT,
  provider_timestamp TEXT,
  finality TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL,
  display_signal TEXT,
  confirmation_state TEXT NOT NULL,
  entry_count INTEGER NOT NULL,
  exit_count INTEGER NOT NULL,
  monitor_eligible INTEGER NOT NULL,
  source_receipt_json TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  read_model_json TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_snapshots_symbol_date
  ON s2_resonance_snapshots (symbol, market_date, as_of DESC);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_snapshots_signal
  ON s2_resonance_snapshots (market_date, display_signal, confirmation_state, as_of DESC);

CREATE TABLE IF NOT EXISTS s2_resonance_latest (
  symbol TEXT NOT NULL,
  market_date TEXT NOT NULL,
  snapshot_id TEXT NOT NULL,
  pool_id TEXT NOT NULL,
  as_of TEXT NOT NULL,
  finality TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL,
  display_signal TEXT,
  confirmation_state TEXT NOT NULL,
  entry_count INTEGER NOT NULL,
  exit_count INTEGER NOT NULL,
  episode_id TEXT,
  episode_state TEXT,
  read_model_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (symbol, market_date)
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_latest_date
  ON s2_resonance_latest (market_date, updated_at DESC);

CREATE TABLE IF NOT EXISTS s2_resonance_episodes (
  episode_id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  market_date TEXT NOT NULL,
  side TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  state TEXT NOT NULL,
  first_observed_at TEXT NOT NULL,
  confirmed_at TEXT,
  released_at TEXT,
  release_reason TEXT,
  updated_at TEXT NOT NULL,
  episode_json TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (symbol, market_date, sequence)
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_episode_active
  ON s2_resonance_episodes (symbol, market_date, state, sequence DESC);

CREATE TABLE IF NOT EXISTS s2_resonance_episode_events (
  event_id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  market_date TEXT NOT NULL,
  event_type TEXT NOT NULL,
  side TEXT NOT NULL,
  event_at TEXT NOT NULL,
  reason TEXT,
  event_json TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (episode_id, event_type, event_at)
);

CREATE INDEX IF NOT EXISTS idx_s2_resonance_episode_events_date
  ON s2_resonance_episode_events (market_date, symbol, event_at DESC);

INSERT INTO s2_schema_meta (schema_key, schema_value, updated_at)
VALUES ('schema_version', '1.1', '2026-09-29T16:00:00Z')
ON CONFLICT(schema_key) DO UPDATE SET
  schema_value = excluded.schema_value,
  updated_at = excluded.updated_at;
