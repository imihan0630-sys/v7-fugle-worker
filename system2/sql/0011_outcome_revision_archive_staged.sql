-- System 2 research-only appendix, NOT applied by production provisioner.
-- CORR-012: every outcome maturity receipt is a new immutable row, including
-- same-lineage revisions. Never replace historical s2_outcomes / s2_* rows.
CREATE TABLE IF NOT EXISTS s2_outcome_revision_archive (
  revision_id TEXT PRIMARY KEY,
  revision_hash TEXT NOT NULL UNIQUE,
  decision_id TEXT NOT NULL,
  decision_hash TEXT NOT NULL,
  strategy_id TEXT NOT NULL,
  strategy_version TEXT NOT NULL,
  regime_snapshot_id TEXT NOT NULL,
  regime_hash TEXT NOT NULL,
  lineage_hash TEXT NOT NULL,
  revision_number INTEGER NOT NULL CHECK (revision_number >= 1),
  previous_revision_hash TEXT,
  execution_hash TEXT NOT NULL,
  cost_model_hash TEXT NOT NULL,
  cost_scenario_hash TEXT NOT NULL,
  outcome_hash TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  outcome_json TEXT NOT NULL,
  receipt_json TEXT NOT NULL,
  certified_performance INTEGER NOT NULL DEFAULT 0 CHECK (certified_performance = 0),
  physical_pit_verified INTEGER NOT NULL DEFAULT 0 CHECK (physical_pit_verified = 0),
  final_selection_authorized INTEGER NOT NULL DEFAULT 0 CHECK (final_selection_authorized = 0),
  schema_version TEXT NOT NULL,
  UNIQUE (decision_id, lineage_hash, revision_number),
  CHECK ((revision_number = 1 AND previous_revision_hash IS NULL)
      OR (revision_number > 1 AND previous_revision_hash IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_s2_outcome_revision_lineage
  ON s2_outcome_revision_archive (decision_id, lineage_hash, revision_number);
CREATE INDEX IF NOT EXISTS idx_s2_outcome_revision_strategy
  ON s2_outcome_revision_archive (strategy_id, strategy_version, observed_at);
CREATE INDEX IF NOT EXISTS idx_s2_outcome_revision_regime
  ON s2_outcome_revision_archive (regime_snapshot_id, regime_hash, observed_at);

-- Historical evidence is append-only, even for an administrator using SQL.
-- Future correction must write a new correction/receipt, never mutate a row.
CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_update
  BEFORE UPDATE ON s2_outcome_revision_archive
  BEGIN SELECT RAISE(ABORT, 'S2_OUTCOME_REVISION_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_delete
  BEFORE DELETE ON s2_outcome_revision_archive
  BEGIN SELECT RAISE(ABORT, 'S2_OUTCOME_REVISION_IMMUTABLE'); END;
