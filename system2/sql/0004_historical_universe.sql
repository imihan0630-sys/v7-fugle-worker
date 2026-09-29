-- System 2 historical universe registry migration V0.8.
-- RESEARCH-ONLY. Applies only to isolated SYSTEM2_DB / system2-research.
-- Never apply to V8 production storage.

CREATE TABLE IF NOT EXISTS s2_historical_universe_memberships (
  membership_id TEXT PRIMARY KEY,
  registry_id TEXT NOT NULL,
  market TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  member_state TEXT NOT NULL,
  dataset_start_date TEXT NOT NULL,
  listing_date TEXT,
  delisting_date TEXT,
  first_trading_date TEXT,
  effective_from TEXT,
  effective_to TEXT,
  start_basis TEXT NOT NULL,
  end_basis TEXT NOT NULL,
  replay_eligible INTEGER NOT NULL,
  source_id TEXT,
  source_name TEXT,
  source_url TEXT,
  source_row_hash TEXT,
  quality_flags_json TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  membership_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_universe_symbol_interval
  ON s2_historical_universe_memberships (market, symbol, effective_from, effective_to);

CREATE INDEX IF NOT EXISTS idx_s2_hist_universe_replay_interval
  ON s2_historical_universe_memberships (replay_eligible, effective_from, effective_to, market);

CREATE TABLE IF NOT EXISTS s2_historical_universe_snapshots (
  snapshot_id TEXT NOT NULL,
  snapshot_hash TEXT NOT NULL,
  registry_id TEXT NOT NULL,
  registry_hash TEXT NOT NULL,
  market_date TEXT NOT NULL,
  market TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  membership_id TEXT NOT NULL,
  membership_hash TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  PRIMARY KEY (snapshot_id, market, symbol)
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_universe_snapshot_date
  ON s2_historical_universe_snapshots (market_date, market, symbol);

INSERT INTO s2_schema_meta (schema_key, schema_value, updated_at)
VALUES ('schema_version', '0.8', '2026-09-28T12:50:00Z')
ON CONFLICT(schema_key) DO UPDATE SET
  schema_value = excluded.schema_value,
  updated_at = excluded.updated_at;
