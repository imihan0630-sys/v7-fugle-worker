import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import { validateMonotonicOutcomeUpdateV0_1 } from "./outcome_tracker_v0_1.mjs";

const IMMUTABLE_TABLES = Object.freeze({
  s2_sim_orders: "sim_order_id",
  s2_sim_fills: "sim_fill_id",
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertIdentifier(value, field) {
  const text = requiredText(value, field);
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) throw new Error(`${field} is unsafe`);
  return text;
}

function normalizeRow(row, field) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(`${field} must be an object`);
  }
  const entries = Object.entries(row).sort(([a], [b]) => a.localeCompare(b));
  if (!entries.length) throw new Error(`${field} cannot be empty`);
  for (const [key] of entries) assertIdentifier(key, `${field}.${key}`);
  return Object.fromEntries(entries);
}

function insertSql(table, row) {
  const columns = Object.keys(row);
  return {
    text: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    params: columns.map((column) => row[column]),
  };
}

function selectSql(table, row, identityColumn) {
  const columns = Object.keys(row);
  return {
    text: `SELECT ${columns.join(", ")} FROM ${table} WHERE ${identityColumn} = ? LIMIT 1`,
    params: [row[identityColumn]],
  };
}

function outcomeUpdateSql(row) {
  const columns = Object.keys(row).filter((column) => column !== "decision_id");
  return {
    text: `UPDATE s2_outcomes SET ${columns.map((column) => `${column} = ?`).join(", ")} WHERE decision_id = ? AND updated_at = ?`,
    params: [...columns.map((column) => row[column]), row.decision_id],
  };
}

export async function buildOutcomePersistenceBatchV0_1({
  batchId,
  marketDate,
  decisionTimestamp,
  simulationOrderRows = [],
  simulationFillRows = [],
  outcomeRow = null,
  outcomeRows = null,
  createdAt,
} = {}) {
  if (!Array.isArray(simulationOrderRows)) throw new Error("simulationOrderRows must be an array");
  if (!Array.isArray(simulationFillRows)) throw new Error("simulationFillRows must be an array");
  const date = requiredText(marketDate, "marketDate");
  const clock = requiredText(decisionTimestamp, "decisionTimestamp");
  const created = requiredText(createdAt, "createdAt");
  const records = [];
  const seen = new Set();

  for (const [table, rows] of [
    ["s2_sim_orders", simulationOrderRows],
    ["s2_sim_fills", simulationFillRows],
  ]) {
    const identityColumn = IMMUTABLE_TABLES[table];
    for (let i = 0; i < rows.length; i += 1) {
      const row = normalizeRow(rows[i], `${table}[${i}]`);
      const identity = requiredText(row[identityColumn], `${table}[${i}].${identityColumn}`);
      const key = `${table}|${identity}`;
      if (seen.has(key)) throw new Error(`duplicate persistence identity: ${key}`);
      seen.add(key);
      records.push({
        kind: "IMMUTABLE",
        table,
        identityColumn,
        identity,
        row,
        select: selectSql(table, row, identityColumn),
        insert: insertSql(table, row),
        rowDigest: await sha256Hex(row),
      });
    }
  }

  if (outcomeRows !== null && !Array.isArray(outcomeRows)) {
    throw new Error("outcomeRows must be an array or null");
  }
  if (outcomeRow !== null && outcomeRows !== null) {
    throw new Error("provide outcomeRow or outcomeRows, not both");
  }
  const rawOutcomes = outcomeRows ?? (outcomeRow === null ? [] : [outcomeRow]);
  if (!rawOutcomes.length) throw new Error("at least one outcome row is required");

  for (let i = 0; i < rawOutcomes.length; i += 1) {
    const normalizedOutcome = normalizeRow(rawOutcomes[i], `outcomeRows[${i}]`);
    const decisionId = requiredText(
      normalizedOutcome.decision_id,
      `outcomeRows[${i}].decision_id`,
    );
    requiredText(normalizedOutcome.updated_at, `outcomeRows[${i}].updated_at`);
    const key = `s2_outcomes|${decisionId}`;
    if (seen.has(key)) throw new Error(`duplicate persistence identity: ${key}`);
    seen.add(key);
    records.push({
      kind: "MONOTONIC_OUTCOME",
      table: "s2_outcomes",
      identityColumn: "decision_id",
      identity: decisionId,
      row: normalizedOutcome,
      select: selectSql("s2_outcomes", normalizedOutcome, "decision_id"),
      insert: insertSql("s2_outcomes", normalizedOutcome),
      update: outcomeUpdateSql(normalizedOutcome),
      rowDigest: await sha256Hex(normalizedOutcome),
    });
  }

  const base = {
    batchId: requiredText(batchId, "batchId"),
    marketDate: date,
    decisionTimestamp: clock,
    bindingName: "SYSTEM2_DB",
    namespace: "s2_",
    records,
    operationCount: records.length,
    immutableTables: Object.keys(IMMUTABLE_TABLES),
    mutableTable: "s2_outcomes",
    outcomeUpdatePolicy: "MONOTONIC_ONLY_WITH_OPTIMISTIC_UPDATED_AT_GUARD",
    createdAt: created,
    schemaVersion: "S2_OUTCOME_PERSISTENCE_BATCH_V0_1",
  };
  return deepFreeze({ ...base, batchHash: await sha256Hex(base) });
}

function comparableExisting(row, expected) {
  return Object.fromEntries(Object.keys(expected).sort().map((key) => [key, row?.[key] ?? null]));
}

function rowsEqual(existing, expected) {
  return canonicalStringify(comparableExisting(existing, expected)) === canonicalStringify(expected);
}

function assertDb(db) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("isolated System2 database adapter with prepare() and batch() is required");
  }
}

async function readExisting(db, record) {
  const statement = db.prepare(record.select.text).bind(...record.select.params);
  if (typeof statement.first === "function") return await statement.first();
  if (typeof statement.all === "function") {
    const result = await statement.all();
    return result?.results?.[0] ?? null;
  }
  throw new Error("database prepared statement must support first() or all()");
}

export async function executeOutcomePersistenceBatchV0_1({
  db,
  batch,
  bindingName = "SYSTEM2_DB",
} = {}) {
  assertDb(db);
  if (!batch || batch.schemaVersion !== "S2_OUTCOME_PERSISTENCE_BATCH_V0_1") {
    throw new Error("unsupported outcome persistence batch");
  }
  if (bindingName !== "SYSTEM2_DB" || batch.bindingName !== "SYSTEM2_DB") {
    throw new Error("refusing non-isolated binding name");
  }

  const writes = [];
  const decisions = [];
  for (const record of batch.records) {
    const existing = await readExisting(db, record);
    if (record.kind === "IMMUTABLE") {
      if (existing && !rowsEqual(existing, record.row)) {
        throw new Error(`IMMUTABLE_CONFLICT existing row: ${record.table}|${record.identity}`);
      }
      if (existing) {
        decisions.push({ record, state: "SKIPPED_IDENTICAL", existing });
      } else {
        writes.push({ record, state: "INSERT", statement: record.insert });
      }
      continue;
    }

    if (!existing) {
      writes.push({ record, state: "INSERT", statement: record.insert });
      continue;
    }
    if (rowsEqual(existing, record.row)) {
      decisions.push({ record, state: "SKIPPED_IDENTICAL", existing });
      continue;
    }
    const validation = validateMonotonicOutcomeUpdateV0_1(existing, record.row);
    if (!validation.updateAllowed) {
      throw new Error(`OUTCOME_REVISION_CONFLICT:${validation.blockers.join("|")}`);
    }
    writes.push({
      record,
      state: "UPDATE",
      statement: {
        text: record.update.text,
        params: [...record.update.params, existing.updated_at],
      },
    });
  }

  if (writes.length) {
    const statements = writes.map((write) =>
      db.prepare(write.statement.text).bind(...write.statement.params)
    );
    const results = await db.batch(statements);
    if (!Array.isArray(results) || results.length !== writes.length) {
      throw new Error("isolated database batch returned unexpected result count");
    }
    for (let i = 0; i < writes.length; i += 1) {
      if (results[i]?.success === false) {
        throw new Error(`outcome persistence write failed: ${writes[i].record.table}`);
      }
    }
  }

  for (const write of writes) {
    const persisted = await readExisting(db, write.record);
    if (!persisted || !rowsEqual(persisted, write.record.row)) {
      throw new Error(`POST_WRITE_VERIFICATION_FAILED:${write.record.table}|${write.record.identity}`);
    }
    decisions.push({
      record: write.record,
      state: write.state === "INSERT" ? "INSERTED" : "UPDATED_MONOTONIC",
      existing: persisted,
    });
  }

  const outcomes = decisions.map(({ record, state }) => ({
    table: record.table,
    identity: record.identity,
    state,
    rowDigest: record.rowDigest,
  }));
  return deepFreeze({
    batchId: batch.batchId,
    batchHash: batch.batchHash,
    bindingName,
    insertedCount: outcomes.filter((x) => x.state === "INSERTED").length,
    updatedCount: outcomes.filter((x) => x.state === "UPDATED_MONOTONIC").length,
    skippedIdenticalCount: outcomes.filter((x) => x.state === "SKIPPED_IDENTICAL").length,
    outcomes: Object.freeze(outcomes),
    state: "OUTCOME_PERSISTENCE_APPLIED",
    schemaVersion: "S2_OUTCOME_PERSISTENCE_EXECUTION_V0_1",
  });
}

export { IMMUTABLE_TABLES };
