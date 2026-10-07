-- System 2 historical source-revision lineage additive migration V0.1.
-- RESEARCH-ONLY. Applies only to isolated SYSTEM2_DB / system2-research.
-- The baseline cold store remains immutable. Revised official rows are stored as
-- separate historical A1 bar versions and linked here through explicit supersession.
-- This additive migration intentionally keeps the global System2 schema version at 1.1.
-- Never apply to V8 production storage.

CREATE TABLE IF NOT EXISTS s2_historical_a1_revision_links (
  revision_id TEXT PRIMARY KEY,
  revision_event_id TEXT NOT NULL,
  canonical_key TEXT NOT NULL,
  market TEXT NOT NULL,
  year INTEGER NOT NULL,
  market_date TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price_space TEXT NOT NULL,
  prior_bar_id TEXT NOT NULL,
  revised_bar_id TEXT NOT NULL,
  prior_bar_hash TEXT NOT NULL,
  revised_bar_hash TEXT NOT NULL,
  prior_source_row_hash TEXT NOT NULL,
  revised_source_row_hash TEXT NOT NULL,
  canonical_a1_changed INTEGER NOT NULL,
  differing_fields_json TEXT NOT NULL,
  detected_no_later_than TEXT,
  revision_available_at TEXT NOT NULL,
  authority_source_id TEXT NOT NULL,
  authority_source_name TEXT NOT NULL,
  authority_source_url TEXT,
  evidence_ref TEXT NOT NULL,
  created_at TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  UNIQUE (canonical_key, prior_bar_hash, revised_bar_hash)
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_revision_key_available
  ON s2_historical_a1_revision_links (canonical_key, revision_available_at);

CREATE INDEX IF NOT EXISTS idx_s2_hist_revision_market_year
  ON s2_historical_a1_revision_links (market, year, market_date, symbol);

CREATE TABLE IF NOT EXISTS s2_historical_revision_receipts (
  receipt_id TEXT PRIMARY KEY,
  revision_event_id TEXT NOT NULL UNIQUE,
  market TEXT NOT NULL,
  year INTEGER NOT NULL,
  revision_available_at TEXT NOT NULL,
  detected_no_later_than TEXT,
  link_count INTEGER NOT NULL,
  canonical_change_count INTEGER NOT NULL,
  source_revision_only_count INTEGER NOT NULL,
  baseline_batch_id TEXT NOT NULL,
  revised_batch_id TEXT NOT NULL,
  lineage_hash TEXT NOT NULL UNIQUE,
  evidence_ref TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_hist_revision_receipt_market_year
  ON s2_historical_revision_receipts (market, year, state, revision_available_at);
