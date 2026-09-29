-- System 2 packed historical A1 storage migration V0.9.
-- RESEARCH-ONLY. Applies only to isolated SYSTEM2_DB / system2-research.
-- Stores one compressed pack per market+symbol+year+price-space instead of one D1 row per bar.
-- Never apply to V8 production storage.

CREATE TABLE IF NOT EXISTS s2_historical_a1_packs (
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
  payload_json_bytes INTEGER NOT NULL,
  gzip_bytes INTEGER NOT NULL,
  base64_bytes INTEGER NOT NULL,
  gzip_base64 TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (market, symbol, year, price_space)
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_pack_symbol_year
  ON s2_historical_a1_packs (market, symbol, year, price_space);

CREATE INDEX IF NOT EXISTS idx_s2_hist_pack_date_range
  ON s2_historical_a1_packs (first_market_date, last_market_date, market);

CREATE TABLE IF NOT EXISTS s2_historical_pack_ingest_receipts (
  receipt_id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  pack_count INTEGER NOT NULL,
  bar_count INTEGER NOT NULL,
  inserted_pack_count INTEGER NOT NULL,
  identical_pack_count INTEGER NOT NULL,
  payload_json_bytes INTEGER NOT NULL,
  gzip_bytes INTEGER NOT NULL,
  base64_bytes INTEGER NOT NULL,
  first_market_date TEXT,
  last_market_date TEXT,
  rolling_hash TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_pack_receipt_batch
  ON s2_historical_pack_ingest_receipts (batch_id, captured_at);

INSERT INTO s2_schema_meta (schema_key, schema_value, updated_at)
VALUES ('schema_version', '0.9', '2026-09-28T13:15:00Z')
ON CONFLICT(schema_key) DO UPDATE SET
  schema_value = excluded.schema_value,
  updated_at = excluded.updated_at;
