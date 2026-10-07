-- System 2 Actual Holdings screenshot-import additive migration V0.1.
-- Applies only to isolated SYSTEM2_DB / system2-research.
-- Source authority: USER_UPLOADED_BROKER_SCREENSHOT -> chat-assisted structured extraction.
-- NO broker API, NO order routing, NO real-capital authority.
-- s2_positions remains virtual/simulated only.
-- This additive migration intentionally keeps global System2 schema version at 1.1.

CREATE TABLE IF NOT EXISTS s2_actual_holdings_imports (
  import_id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_image_sha256 TEXT NOT NULL,
  source_image_ref TEXT,
  source_image_name TEXT,
  broker_name TEXT,
  account_alias TEXT,
  screenshot_captured_at TEXT,
  received_at TEXT NOT NULL,
  extraction_version TEXT NOT NULL,
  extraction_confidence REAL,
  validation_version TEXT NOT NULL,
  validation_state TEXT NOT NULL,
  review_state TEXT NOT NULL,
  raw_extraction_json TEXT NOT NULL,
  normalized_extraction_json TEXT NOT NULL,
  validation_json TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  import_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_import_received
  ON s2_actual_holdings_imports (received_at DESC, account_alias, broker_name);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_import_image
  ON s2_actual_holdings_imports (source_image_sha256, received_at DESC);

CREATE TABLE IF NOT EXISTS s2_actual_holdings_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  import_id TEXT NOT NULL UNIQUE,
  previous_snapshot_id TEXT,
  source_type TEXT NOT NULL,
  source_image_sha256 TEXT NOT NULL,
  broker_name TEXT,
  account_alias TEXT,
  received_at TEXT NOT NULL,
  effective_as_of TEXT NOT NULL,
  extraction_version TEXT NOT NULL,
  validation_version TEXT NOT NULL,
  review_state TEXT NOT NULL,
  snapshot_state TEXT NOT NULL,
  row_count INTEGER NOT NULL,
  rows_hash TEXT NOT NULL,
  source_provenance_json TEXT NOT NULL,
  raw_extraction_json TEXT NOT NULL,
  confirmed_holdings_json TEXT NOT NULL,
  reconciliation_json TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  snapshot_hash TEXT NOT NULL UNIQUE,
  immutable INTEGER NOT NULL DEFAULT 1,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_snapshot_account_time
  ON s2_actual_holdings_snapshots (account_alias, effective_as_of DESC, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_snapshot_image
  ON s2_actual_holdings_snapshots (source_image_sha256, received_at DESC);

CREATE TABLE IF NOT EXISTS s2_actual_holdings_rows (
  snapshot_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  quantity INTEGER NOT NULL,
  average_cost REAL NOT NULL,
  market_price REAL,
  market_value REAL,
  unrealized_pnl REAL,
  unrealized_pnl_percent REAL,
  currency TEXT NOT NULL,
  row_confidence REAL,
  validation_state TEXT NOT NULL,
  row_json TEXT NOT NULL,
  row_hash TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  PRIMARY KEY (snapshot_id, symbol)
);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_rows_symbol
  ON s2_actual_holdings_rows (symbol, snapshot_id);

CREATE TABLE IF NOT EXISTS s2_actual_holdings_reconciliation_events (
  event_id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL,
  previous_snapshot_id TEXT,
  symbol TEXT NOT NULL,
  event_types_json TEXT NOT NULL,
  prior_row_json TEXT,
  current_row_json TEXT,
  explanation_json TEXT NOT NULL,
  trade_inference TEXT NOT NULL,
  review_required INTEGER NOT NULL,
  event_hash TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_recon_snapshot
  ON s2_actual_holdings_reconciliation_events (snapshot_id, symbol);

CREATE INDEX IF NOT EXISTS idx_s2_actual_holdings_recon_symbol
  ON s2_actual_holdings_reconciliation_events (symbol, snapshot_id);
