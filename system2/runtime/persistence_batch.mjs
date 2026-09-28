import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";

const TABLE_SPECS = deepFreeze({
  s2_historical_ingest_batches: {
    order: 1,
    identity: ["batch_id"],
  },
  s2_historical_a1_bars: {
    order: 2,
    identity: ["bar_id"],
  },
  s2_source_session_receipts: {
    order: 10,
    identity: ["receipt_id"],
  },
  s2_market_regime_snapshots: {
    order: 20,
    identity: ["regime_snapshot_id"],
  },
  s2_industry_snapshots: {
    order: 30,
    identity: ["industry_snapshot_id"],
  },
  s2_symbol_factor_snapshots: {
    order: 40,
    identity: ["snapshot_id"],
  },
  s2_decisions: {
    order: 50,
    identity: ["decision_id"],
  },
  s2_shadow_runs: {
    order: 60,
    identity: ["run_id"],
  },
  s2_strategy_ordering_receipts: {
    order: 70,
    identity: ["ordering_receipt_id"],
  },
  s2_ranking_experiment_receipts: {
    order: 80,
    identity: ["experiment_receipt_id"],
  },
  s2_rank05_displacement_receipts: {
    order: 90,
    identity: ["receipt_id"],
  },
  s2_capacity_runs: {
    order: 100,
    identity: ["capacity_run_id"],
  },
  s2_candidate_lifecycle_receipts: {
    order: 110,
    identity: ["lifecycle_receipt_id"],
  },
  s2_candidate_reentry_receipts: {
    order: 120,
    identity: ["reentry_receipt_id"],
  },
  s2_strategy_overlap_receipts: {
    order: 130,
    identity: ["receipt_id"],
  },
  s2_candidate_concentration_receipts: {
    order: 140,
    identity: ["receipt_id"],
  },
  s2_shadow_run_fingerprints: {
    order: 1000,
    identity: ["fingerprint_id"],
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

function normalizeRow(row, table) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(`${table} row must be an object`);
  }
  const entries = Object.entries(row);
  if (!entries.length) throw new Error(`${table} row cannot be empty`);
  for (const [key] of entries) assertIdentifier(key, `${table} column`);
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
    const row = normalizeRow(record.row, table);
    const identity = identityObject(row, spec.identity, table);
    const key = identityKey(table, identity);
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
      row,
      rowDigest,
      verifyMode: "ABSENT_OR_IDENTICAL",
      insertMode: "INSERT_ONLY_AFTER_VERIFY",
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
    schemaVersion: "S2_PERSISTENCE_BATCH_V0_1",
  };

  const batchHash = await sha256Hex(base);
  return deepFreeze({ ...base, batchHash });
}

export function compareExistingRow(operation, existingRow) {
  if (!operation || typeof operation !== "object") throw new Error("operation is required");
  if (existingRow === null || existingRow === undefined) {
    return deepFreeze({ state: "ABSENT", insertAllowed: true });
  }
  if (!existingRow || typeof existingRow !== "object" || Array.isArray(existingRow)) {
    throw new Error("existingRow must be an object, null or undefined");
  }

  const normalizedExisting = Object.fromEntries(
    Object.keys(operation.row)
      .sort()
      .map((key) => [key, existingRow[key] ?? null]),
  );
  const expectedCanonical = canonicalStringify(operation.row);
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
