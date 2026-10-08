import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";

const TABLE_SPECS = deepFreeze({
  s2_infrastructure_checks: {
    order: 1100,
    identity: ["check_id"],
    columns: [
      "check_id","check_type","check_timestamp","environment","binding_name",
      "schema_version","expected_payload_json","observed_payload_json","status",
      "check_hash","notes",
    ],
  },
  s2_historical_ingest_batches: {
    order: 1,
    identity: ["batch_id"],
    columns: [
      "batch_id","dataset_lane","dataset_start_boundary","source_id","source_name",
      "source_url","first_market_date","last_market_date","row_count",
      "pit_eligible_count","unknown_availability_count","captured_at","batch_hash",
      "schema_version",
    ],
  },
  s2_historical_a1_bars: {
    order: 2,
    identity: ["bar_id"],
    columns: [
      "bar_id","batch_id","canonical_key","market_date","market","symbol","company_name",
      "price_space","open_price","high_price","low_price","close_price","volume_shares",
      "trade_value","transactions","change_value","continuity_state","source_id",
      "source_name","source_url","source_row_hash","observed_at","available_at",
      "availability_basis","pit_availability_class","pit_replay_eligible","captured_at",
      "bar_hash","schema_version",
    ],
    // bar_id is content-addressed. Re-observation metadata may differ when an
    // identical official row is fetched again after an interrupted backfill.
    equivalenceIgnore: ["batch_id", "observed_at", "captured_at"],
  },
  s2_backtest_runs: {
    order: 3,
    identity: ["run_id"],
    columns: [
      "run_id","plan_hash","dataset_version","strategy_id","strategy_version","policy_id",
      "policy_version","first_market_date","last_market_date","requested_date_count",
      "completed_date_count","processed_sample_count","state_counts_json",
      "date_summaries_json","all_requested_dates_complete","hard_symbol_limit",
      "partition_size","selection_policy_authorized","rolling_digest","captured_at",
      "run_hash","schema_version",
    ],
  },
  s2_backtest_checkpoints: {
    order: 4,
    identity: ["checkpoint_hash"],
    columns: [
      "checkpoint_hash","run_id","plan_hash","completed_through_date",
      "completed_dates_json","processed_sample_count","state_counts_json",
      "date_summaries_json","rolling_digest","captured_at","schema_version",
    ],
  },
  s2_historical_base_samples: {
    order: 5,
    identity: ["sample_id"],
    columns: [
      "sample_id","base_dataset_id","backtest_run_id","market_date","decision_timestamp",
      "symbol","company_name","market","strategy_id","strategy_version","policy_id",
      "policy_version","candidate_state","archive_cohort","rank_value","total_score",
      "strategy_validity","entry_readiness","factor_bundle_hash","factor_bundle_version",
      "pit_replay_hash","source_available_at","core_metrics_json","factor_observations_json",
      "regime_json","entry_plan_json","thesis_json","invalidation_json","reasons_json",
      "warnings_json","outcome_attached","outcome_ref","archive_hash","schema_version",
    ],
  },
  s2_source_session_receipts: {
    order: 10,
    identity: ["receipt_id"],
    columns: [
      "receipt_id","market_date","decision_timestamp","source_session_state",
      "required_blockers_json","optional_gaps_json","source_rows_json",
      "extra_observed_sources_json","expected_source_count","observed_source_count",
      "outcome_join_source_eligible","source_session_hash","captured_at","schema_version",
    ],
  },
  s2_market_regime_snapshots: {
    order: 20,
    identity: ["regime_snapshot_id"],
    columns: [
      "regime_snapshot_id","market_date","decision_timestamp","regime_version",
      "labels_json","states_json","factor_observations_json","source_receipts_json",
      "unknowns_json","snapshot_hash",
    ],
  },
  s2_industry_snapshots: {
    order: 30,
    identity: ["industry_snapshot_id"],
    columns: [
      "industry_snapshot_id","market_date","decision_timestamp","industry_key",
      "classification_version","factor_bundle_version","factors_json",
      "source_manifest_json","completeness_state","snapshot_hash",
    ],
  },
  s2_symbol_factor_snapshots: {
    order: 40,
    identity: ["snapshot_id"],
    columns: [
      "snapshot_id","market_date","decision_timestamp","symbol","company_name",
      "factor_bundle_version","regime_snapshot_id","industry_snapshot_id",
      "core_metrics_json","factor_observations_json","interaction_observations_json",
      "source_manifest_json","completeness_state","unknowns_json","captured_at",
      "snapshot_hash",
    ],
  },
  s2_decisions: {
    order: 50,
    identity: ["decision_id"],
    columns: [
      "decision_id","factor_snapshot_id","market_date","decision_timestamp","strategy_id",
      "strategy_version","symbol","company_name","candidate_state","strategy_validity",
      "entry_readiness","source_readiness","shadow_spec_id","evaluation_mode","rank_value",
      "total_score","reasons_json","warnings_json","missing_required_factors_json",
      "entry_plan_json","thesis_json","invalidation_json","regime_snapshot_id","frozen_at",
      "schema_version","decision_hash",
    ],
  },
  s2_decision_corrections: {
    order: 55,
    identity: ["correction_id"],
    columns: [
      "correction_id","original_decision_id","correction_timestamp","reason",
      "corrected_fields_json","evidence_json",
    ],
  },
  s2_shadow_runs: {
    order: 60,
    identity: ["run_id"],
    columns: [
      "run_id","market_date","decision_timestamp","strategy_id","strategy_version",
      "shadow_spec_id","universe_version","run_state","base_universe_count",
      "excluded_count","eligible_count","accounted_count","completion_rate",
      "state_counts_json","unaccounted_symbols_json","symbol_accounts_json",
      "warnings_json","captured_at",
    ],
  },
  s2_strategy_ordering_receipts: {
    order: 70,
    identity: ["ordering_receipt_id"],
    columns: [
      "ordering_receipt_id","market_date","decision_timestamp","purpose","strategy_id",
      "strategy_version","ordering_policy_id","ordering_policy_version","candidate_count",
      "ordered_candidates_json","ordering_hash","captured_at","schema_version",
    ],
  },
  s2_ranking_experiment_receipts: {
    order: 80,
    identity: ["experiment_receipt_id"],
    columns: [
      "experiment_receipt_id","experiment_id","experiment_version","hypothesis_id",
      "market_date","decision_timestamp","purpose","strategy_id","strategy_version",
      "baseline_policy_id","baseline_policy_version","baseline_ordering_hash",
      "challenger_policy_id","challenger_policy_version","challenger_ordering_hash",
      "same_candidate_set","common_support_symbols_json","baseline_only_symbols_json",
      "challenger_only_symbols_json","rank_deltas_json","outcome_attached",
      "experiment_hash","captured_at","schema_version",
    ],
  },
  s2_rank05_displacement_receipts: {
    order: 90,
    identity: ["receipt_id"],
    columns: [
      "receipt_id","experiment_id","experiment_version","market_date","decision_timestamp",
      "incumbent_symbol","incumbent_episode_id","incumbent_pool_sessions","incumbent_json",
      "challenger_symbol","challenger_json","classification","shadow_displacement_eligible",
      "action","outcome_attached","receipt_hash","captured_at","schema_version",
    ],
  },
  s2_capacity_runs: {
    order: 100,
    identity: ["capacity_run_id"],
    columns: [
      "capacity_run_id","market_date","decision_timestamp","global_max","per_strategy_max",
      "ordering_policy_id","ordering_policy_version","retained_json","removed_json",
      "admitted_new_json","capacity_overflow_json","global_pool_json",
      "active_assignments_json","active_non_assignments_json","counts_json",
      "capacity_hash","captured_at","schema_version",
    ],
  },
  s2_candidate_lifecycle_receipts: {
    order: 110,
    identity: ["lifecycle_receipt_id"],
    columns: [
      "lifecycle_receipt_id","candidate_episode_id","symbol","market_date",
      "transition_timestamp","from_state","to_state","memberships_json","reason_codes_json",
      "evidence_refs_json","capacity_eligible","position_monitor","lifecycle_hash",
      "schema_version",
    ],
  },
  s2_candidate_reentry_receipts: {
    order: 120,
    identity: ["reentry_receipt_id"],
    columns: [
      "reentry_receipt_id","symbol","previous_episode_id","new_episode_id",
      "requalified_decision_id","reentry_timestamp","reason_codes_json","reentry_hash",
      "schema_version",
    ],
  },
  s2_strategy_overlap_receipts: {
    order: 130,
    identity: ["receipt_id"],
    columns: [
      "receipt_id","experiment_id","experiment_version","market_date","decision_timestamp",
      "strategy_a_json","strategy_b_json","shared_core_families_json","distinct_core_a_json",
      "distinct_core_b_json","shared_all_families_json","diagnostics_json",
      "independent_same_clock_validity","naive_strategy_count_bonus_allowed",
      "overlap_priority_effect_authorized","research_state","overlap_hash","captured_at",
      "schema_version",
    ],
  },
  s2_candidate_concentration_receipts: {
    order: 140,
    identity: ["receipt_id"],
    columns: [
      "receipt_id","experiment_id","experiment_version","market_date","decision_timestamp",
      "classification_version","global_count","known_industry_count","unknown_industry_count",
      "known_industry_coverage","unknown_industry_symbols_json","industry_rows_json",
      "largest_industry_json","industry_hhi_known_only","strategy_membership_counts_json",
      "multi_strategy_symbol_count","effect_authorization_json","warnings_json",
      "concentration_hash","captured_at","schema_version",
    ],
  },
  s2_shadow_run_fingerprints: {
    order: 1000,
    identity: ["fingerprint_id"],
    columns: [
      "fingerprint_id","market_date","decision_timestamp","strategy_id","strategy_version",
      "shadow_spec_id","universe_version","source_session_hash","shadow_accounting_hash",
      "decision_hashes_json","ordering_hashes_json","ranking_experiment_hashes_json",
      "capacity_hash","lifecycle_hashes_json","run_fingerprint_state","blockers_json",
      "outcome_join_eligible","run_fingerprint_hash","captured_at","schema_version",
    ],
    mustBeLast: true,
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertIdentifier(value, field) {
  const text = requiredText(value, field);
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) {
    throw new Error(`${field} is not a safe SQL identifier`);
  }
  return text;
}

function tableSpec(table) {
  const name = assertIdentifier(table, "table");
  if (!name.startsWith("s2_")) throw new Error("System2 persistence table must use s2_ namespace");
  const spec = TABLE_SPECS[name];
  if (!spec) throw new Error(`System2 persistence table is not whitelisted: ${name}`);
  return [name, spec];
}

function normalizeRow(row, table, spec) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(`${table} row must be an object`);
  }
  const entries = Object.entries(row);
  if (!entries.length) throw new Error(`${table} row cannot be empty`);
  const allowed = new Set(spec?.columns || []);
  for (const [key] of entries) {
    assertIdentifier(key, `${table} column`);
    if (!allowed.has(key)) {
      throw new Error(`${table} column is not whitelisted: ${key}`);
    }
  }
  return Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
}

function identityObject(row, identityColumns, table) {
  const out = {};
  for (const col of identityColumns) {
    if (!(col in row) || row[col] === null || row[col] === undefined || row[col] === "") {
      throw new Error(`${table} row missing identity column: ${col}`);
    }
    out[col] = row[col];
  }
  return out;
}

function identityKey(table, identity) {
  return `${table}|${canonicalStringify(identity)}`;
}

function sqlPlan(table, row, identity) {
  const columns = Object.keys(row);
  const identityColumns = Object.keys(identity);
  const selectSql =
    `SELECT ${columns.join(", ")} FROM ${table} WHERE ` +
    identityColumns.map((col) => `${col} = ?`).join(" AND ") +
    " LIMIT 1";
  const insertSql =
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (` +
    columns.map(() => "?").join(", ") +
    ")";

  return {
    selectSql,
    selectParams: identityColumns.map((col) => identity[col]),
    insertSql,
    insertParams: columns.map((col) => row[col]),
    columns,
  };
}

export async function buildSystem2PersistenceBatch({
  batchId,
  marketDate,
  decisionTimestamp,
  records = [],
  createdAt,
} = {}) {
  if (!Array.isArray(records)) throw new Error("records must be an array");

  const seen = new Map();
  const operations = [];

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (!record || typeof record !== "object") throw new Error(`records[${i}] is required`);
    const [table, spec] = tableSpec(record.table);
    const row = normalizeRow(record.row, table, spec);
    const identity = identityObject(row, spec.identity, table);
    const key = identityKey(table, identity);
    const identityDigest = await sha256Hex({ table, identity });
    const rowDigest = await sha256Hex(row);

    if (seen.has(key)) {
      const prior = seen.get(key);
      if (prior.rowDigest !== rowDigest) {
        throw new Error(`IMMUTABLE_CONFLICT within batch: ${key}`);
      }
      continue;
    }

    const operation = {
      table,
      tableOrder: spec.order,
      identity,
      identityKey: key,
      identityDigest,
      row,
      rowDigest,
      verifyMode: "ABSENT_OR_IDENTICAL",
      insertMode: "INSERT_ONLY_AFTER_VERIFY",
      equivalenceIgnore: Object.freeze([...(spec.equivalenceIgnore || [])]),
      sql: sqlPlan(table, row, identity),
    };

    seen.set(key, operation);
    operations.push(operation);
  }

  operations.sort((a, b) => {
    if (a.tableOrder !== b.tableOrder) return a.tableOrder - b.tableOrder;
    return a.identityKey.localeCompare(b.identityKey);
  });

  const fingerprintIndexes = operations
    .map((op, index) => [op, index])
    .filter(([op]) => TABLE_SPECS[op.table]?.mustBeLast)
    .map(([, index]) => index);

  if (
    fingerprintIndexes.length &&
    fingerprintIndexes.some((index) => index < operations.length - fingerprintIndexes.length)
  ) {
    throw new Error("run fingerprint persistence operations must be last");
  }

  const base = {
    batchId: requiredText(batchId, "batchId"),
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    bindingName: "SYSTEM2_DB",
    namespace: "s2_",
    operationCount: operations.length,
    operations,
    immutableConflictPolicy: "FAIL_CLOSED",
    duplicateIdenticalPolicy: "SKIP_IDENTICAL",
    outcomeRowsAllowed: false,
    createdAt: requiredText(createdAt, "createdAt"),
    schemaVersion: "S2_PERSISTENCE_BATCH_V0_2",
  };

  const batchHash = await sha256Hex(base);
  return deepFreeze({ ...base, batchHash });
}

export async function rebuildAndVerifySystem2PersistenceBatch(batch) {
  if (!batch || typeof batch !== "object" || Array.isArray(batch)) {
    throw new Error("persistence batch is required");
  }
  if (!Array.isArray(batch.operations)) {
    throw new Error("batch.operations must be an array");
  }

  const records = batch.operations.map((operation, index) => {
    if (!operation || typeof operation !== "object" || Array.isArray(operation)) {
      throw new Error(`batch.operations[${index}] must be an object`);
    }
    return {
      table: operation.table,
      row: operation.row,
    };
  });

  const canonical = await buildSystem2PersistenceBatch({
    batchId: batch.batchId,
    marketDate: batch.marketDate,
    decisionTimestamp: batch.decisionTimestamp,
    records,
    createdAt: batch.createdAt,
  });

  if (batch.batchHash !== canonical.batchHash) {
    throw new Error("PERSISTENCE_BATCH_HASH_MISMATCH");
  }
  if (batch.operationCount !== canonical.operationCount) {
    throw new Error("PERSISTENCE_BATCH_OPERATION_COUNT_MISMATCH");
  }

  for (let index = 0; index < canonical.operations.length; index += 1) {
    const supplied = batch.operations[index];
    const expected = canonical.operations[index];
    if (supplied?.rowDigest !== expected.rowDigest) {
      throw new Error(`PERSISTENCE_ROW_DIGEST_MISMATCH:${index}`);
    }
    if (supplied?.identityDigest !== expected.identityDigest) {
      throw new Error(`PERSISTENCE_IDENTITY_DIGEST_MISMATCH:${index}`);
    }
    if (supplied?.identityKey !== expected.identityKey) {
      throw new Error(`PERSISTENCE_IDENTITY_MISMATCH:${index}`);
    }
    if (canonicalStringify(supplied?.identity) !== canonicalStringify(expected.identity)) {
      throw new Error(`PERSISTENCE_IDENTITY_OBJECT_MISMATCH:${index}`);
    }
    if (canonicalStringify(supplied?.sql) !== canonicalStringify(expected.sql)) {
      throw new Error(`PERSISTENCE_SQL_PLAN_MISMATCH:${index}`);
    }
  }

  if (canonicalStringify(batch) !== canonicalStringify(canonical)) {
    throw new Error("PERSISTENCE_BATCH_CANONICAL_MISMATCH");
  }
  return canonical;
}

export function compareExistingRow(operation, existingRow) {
  if (!operation || typeof operation !== "object") throw new Error("operation is required");
  if (existingRow === null || existingRow === undefined) {
    return deepFreeze({ state: "ABSENT", insertAllowed: true });
  }
  if (!existingRow || typeof existingRow !== "object" || Array.isArray(existingRow)) {
    throw new Error("existingRow must be an object, null or undefined");
  }

  const ignored = new Set(operation.equivalenceIgnore || []);
  const comparisonKeys = Object.keys(operation.row)
    .filter((key) => !ignored.has(key))
    .sort();
  const expectedComparable = Object.fromEntries(
    comparisonKeys.map((key) => [key, operation.row[key] ?? null]),
  );
  const normalizedExisting = Object.fromEntries(
    comparisonKeys.map((key) => [key, existingRow[key] ?? null]),
  );
  const expectedCanonical = canonicalStringify(expectedComparable);
  const actualCanonical = canonicalStringify(normalizedExisting);

  if (expectedCanonical === actualCanonical) {
    return deepFreeze({ state: "IDENTICAL", insertAllowed: false });
  }

  return deepFreeze({
    state: "IMMUTABLE_CONFLICT",
    insertAllowed: false,
    expectedCanonical,
    actualCanonical,
  });
}

export { TABLE_SPECS };
