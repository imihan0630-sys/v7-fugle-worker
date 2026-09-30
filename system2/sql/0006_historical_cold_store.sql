-- System 2 external cold-object manifest migration V1.0.
-- RESEARCH-ONLY. Applies only to isolated SYSTEM2_DB / system2-research.
-- Compressed payload bytes live in isolated object storage (R2); D1 keeps only
-- immutable manifests, resumable checkpoints, completion receipts and hot/replay results.
-- The V0.9 inline-pack tables remain read-compatible for already verified smoke data.
-- Never apply to V8 production storage.

CREATE TABLE IF NOT EXISTS s2_historical_a1_pack_manifests (
  pack_id TEXT PRIMARY KEY,
  market TEXT NOT NULL,
  symbol TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_space TEXT NOT NULL,
  first_market_date TEXT NOT NULL,
  last_market_date TEXT NOT NULL,
  bar_count INTEGER NOT NULL,
  source_id TEXT,
  source_name TEXT,
  availability_policy TEXT NOT NULL,
  payload_hash TEXT NOT NULL UNIQUE,
  object_sha256 TEXT NOT NULL,
  payload_json_bytes INTEGER NOT NULL,
  gzip_bytes INTEGER NOT NULL,
  object_backend TEXT NOT NULL,
  object_bucket TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  object_etag TEXT,
  object_version TEXT,
  storage_class TEXT,
  object_uploaded_at TEXT,
  captured_at TEXT NOT NULL,
  pack_schema_version TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (market, symbol, year, price_space)
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_cold_manifest_symbol_year
  ON s2_historical_a1_pack_manifests (market, symbol, year, price_space);

CREATE INDEX IF NOT EXISTS idx_s2_hist_cold_manifest_date_range
  ON s2_historical_a1_pack_manifests (first_market_date, last_market_date, market);

CREATE TABLE IF NOT EXISTS s2_historical_cold_backfill_checkpoints (
  checkpoint_id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL UNIQUE,
  market TEXT NOT NULL,
  year INTEGER NOT NULL,
  expected_pack_count INTEGER NOT NULL,
  expected_bar_count INTEGER NOT NULL,
  object_ready_count INTEGER NOT NULL,
  manifest_committed_count INTEGER NOT NULL,
  next_pack_index INTEGER NOT NULL,
  rolling_hash TEXT NOT NULL,
  state TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_cold_checkpoint_year
  ON s2_historical_cold_backfill_checkpoints (year, market, state);

CREATE TABLE IF NOT EXISTS s2_historical_cold_ingest_receipts (
  receipt_id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL UNIQUE,
  market TEXT NOT NULL,
  year INTEGER NOT NULL,
  pack_count INTEGER NOT NULL,
  bar_count INTEGER NOT NULL,
  payload_json_bytes INTEGER NOT NULL,
  gzip_bytes INTEGER NOT NULL,
  first_market_date TEXT,
  last_market_date TEXT,
  manifest_rolling_hash TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  state TEXT NOT NULL,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_cold_receipt_year
  ON s2_historical_cold_ingest_receipts (year, market, state);

CREATE TABLE IF NOT EXISTS s2_historical_universe_registry_receipts (
  registry_id TEXT PRIMARY KEY,
  registry_hash TEXT NOT NULL UNIQUE,
  dataset_start_date TEXT NOT NULL,
  membership_count INTEGER NOT NULL,
  symbol_market_count INTEGER NOT NULL,
  replay_eligible_count INTEGER NOT NULL,
  unknown_start_count INTEGER NOT NULL,
  current_count INTEGER NOT NULL,
  delisted_count INTEGER NOT NULL,
  observed_at TEXT NOT NULL,
  persisted_at TEXT NOT NULL,
  schema_version TEXT NOT NULL
);

INSERT INTO s2_schema_meta (schema_key, schema_value, updated_at)
VALUES ('schema_version', '1.0', '2026-09-28T14:30:00Z')
ON CONFLICT(schema_key) DO UPDATE SET
  schema_value = excluded.schema_value,
  updated_at = excluded.updated_at;
