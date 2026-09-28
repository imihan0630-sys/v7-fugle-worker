-- System 2 historical store migration V0.6.
-- RESEARCH-ONLY. Applies only to isolated SYSTEM2_DB / system2-research.
-- Never apply to V8 production storage.

CREATE TABLE IF NOT EXISTS s2_historical_ingest_batches (
  batch_id TEXT PRIMARY KEY,
  dataset_lane TEXT NOT NULL,
  dataset_start_boundary TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  first_market_date TEXT NOT NULL,
  last_market_date TEXT NOT NULL,
  row_count INTEGER NOT NULL,
  pit_eligible_count INTEGER NOT NULL,
  unknown_availability_count INTEGER NOT NULL,
  captured_at TEXT NOT NULL,
  batch_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_historical_ingest_range
  ON s2_historical_ingest_batches (first_market_date, last_market_date, dataset_lane);

CREATE TABLE IF NOT EXISTS s2_historical_a1_bars (
  bar_id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  canonical_key TEXT NOT NULL,
  market_date TEXT NOT NULL,
  market TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  price_space TEXT NOT NULL,
  open_price REAL,
  high_price REAL,
  low_price REAL,
  close_price REAL,
  volume_shares REAL,
  trade_value REAL,
  transactions REAL,
  change_value REAL,
  continuity_state TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  source_row_hash TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  available_at TEXT,
  availability_basis TEXT NOT NULL,
  pit_availability_class TEXT NOT NULL,
  pit_replay_eligible INTEGER NOT NULL,
  captured_at TEXT NOT NULL,
  bar_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_historical_a1_symbol_date
  ON s2_historical_a1_bars (symbol, market_date, price_space);

CREATE INDEX IF NOT EXISTS idx_s2_historical_a1_pit_window
  ON s2_historical_a1_bars (symbol, price_space, market_date, available_at, pit_replay_eligible);

CREATE INDEX IF NOT EXISTS idx_s2_historical_a1_batch
  ON s2_historical_a1_bars (batch_id, market_date);

INSERT INTO s2_schema_meta (schema_key, schema_value, updated_at)
VALUES ('schema_version', '0.6', '2026-09-28T09:30:00Z')
ON CONFLICT(schema_key) DO UPDATE SET
  schema_value = excluded.schema_value,
  updated_at = excluded.updated_at;
