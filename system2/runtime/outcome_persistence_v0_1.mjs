import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import { validateMonotonicOutcomeUpdateV0_1 } from "./outcome_tracker_v0_1.mjs";

const IMMUTABLE_TABLES = Object.freeze({
  s2_sim_orders: Object.freeze({
    identityColumn: "sim_order_id",
    columns: Object.freeze([
      "sim_order_id","decision_id","side","order_type","trigger_rule_version",
      "order_json","created_at","status",
    ]),
  }),
  s2_sim_fills: Object.freeze({
    identityColumn: "sim_fill_id",
    columns: Object.freeze([
      "sim_fill_id","sim_order_id","fill_timestamp","raw_fill_price","slippage",
      "commission","transaction_tax","all_in_price","shares","fill_quality",
      "ambiguity_reason","feasibility_flags_json","fill_json",
    ]),
  }),
});
const OUTCOME_TABLE_SPEC = Object.freeze({
  table: "s2_outcomes",
  identityColumn: "decision_id",
  columns: Object.freeze([
    "decision_id","d1_return","d3_return","d5_return","d10_return","d20_return",
    "mfe","mae","target_hit_session","stop_hit_session","ambiguous_same_bar",
    "realized_return_after_cost","holding_sessions","outcome_json","updated_at",
  ]),
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

function normalizeRow(row, field, allowedColumns) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(`${field} must be an object`);
  }
  const entries = Object.entries(row).sort(([a], [b]) => a.localeCompare(b));
  if (!entries.length) throw new Error(`${field} cannot be empty`);
  const allowed = new Set(allowedColumns || []);
  for (const [key] of entries) {
    assertIdentifier(key, `${field}.${key}`);
    if (!allowed.has(key)) throw new Error(`${field} column is not whitelisted: ${key}`);
  }
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
    const spec = IMMUTABLE_TABLES[table];
    const identityColumn = spec.identityColumn;
    for (let i = 0; i < rows.length; i += 1) {
      const row = normalizeRow(rows[i], `${table}[${i}]`, spec.columns);
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
        identityDigest: await sha256Hex({ table, identityColumn, identity }),
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
    const normalizedOutcome = normalizeRow(
      rawOutcomes[i],
      `outcomeRows[${i}]`,
      OUTCOME_TABLE_SPEC.columns,
    );
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
      identityDigest: await sha256Hex({
        table: "s2_outcomes",
        identityColumn: "decision_id",
        identity: decisionId,
      }),
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

function parseJsonObject(value, field) {
  let parsed;
  try {
    parsed = JSON.parse(requiredText(value, field));
  } catch {
    throw new Error(`${field} must be valid JSON`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${field} must encode an object`);
  }
  return parsed;
}

export async function rebuildAndVerifyOutcomePersistenceBatchV0_1(batch) {
  if (!batch || typeof batch !== "object" || Array.isArray(batch)) {
    throw new Error("outcome persistence batch is required");
  }
  if (!Array.isArray(batch.records)) throw new Error("batch.records must be an array");

  const simulationOrderRows = [];
  const simulationFillRows = [];
  const outcomeRows = [];
  for (let index = 0; index < batch.records.length; index += 1) {
    const record = batch.records[index];
    if (!record || typeof record !== "object") {
      throw new Error(`batch.records[${index}] must be an object`);
    }
    if (record.table === "s2_sim_orders" && record.kind === "IMMUTABLE") {
      simulationOrderRows.push(record.row);
    } else if (record.table === "s2_sim_fills" && record.kind === "IMMUTABLE") {
      simulationFillRows.push(record.row);
    } else if (record.table === "s2_outcomes" && record.kind === "MONOTONIC_OUTCOME") {
      outcomeRows.push(record.row);
    } else {
      throw new Error(`OUTCOME_PERSISTENCE_RECORD_CONTRACT_MISMATCH:${index}`);
    }
  }

  const canonical = await buildOutcomePersistenceBatchV0_1({
    batchId: batch.batchId,
    marketDate: batch.marketDate,
    decisionTimestamp: batch.decisionTimestamp,
    simulationOrderRows,
    simulationFillRows,
    outcomeRows,
    createdAt: batch.createdAt,
  });

  if (batch.batchHash !== canonical.batchHash) throw new Error("OUTCOME_BATCH_HASH_MISMATCH");
  if (batch.operationCount !== canonical.operationCount) {
    throw new Error("OUTCOME_BATCH_OPERATION_COUNT_MISMATCH");
  }

  for (let index = 0; index < canonical.records.length; index += 1) {
    const supplied = batch.records[index];
    const expected = canonical.records[index];
    if (supplied?.rowDigest !== expected.rowDigest) {
      throw new Error(`OUTCOME_ROW_DIGEST_MISMATCH:${index}`);
    }
    if (supplied?.identityDigest !== expected.identityDigest) {
      throw new Error(`OUTCOME_IDENTITY_DIGEST_MISMATCH:${index}`);
    }
    if (
      supplied?.table !== expected.table
      || supplied?.kind !== expected.kind
      || supplied?.identity !== expected.identity
      || supplied?.identityColumn !== expected.identityColumn
    ) {
      throw new Error(`OUTCOME_IDENTITY_CONTRACT_MISMATCH:${index}`);
    }
    for (const field of ["select","insert","update"]) {
      if (canonicalStringify(supplied?.[field] ?? null) !== canonicalStringify(expected?.[field] ?? null)) {
        throw new Error(`OUTCOME_SQL_PLAN_MISMATCH:${index}:${field}`);
      }
    }
  }

  if (canonicalStringify(batch) !== canonicalStringify(canonical)) {
    throw new Error("OUTCOME_BATCH_CANONICAL_MISMATCH");
  }
  return canonical;
}

async function readCanonicalParent(db, {
  table,
  identityColumn,
  identityValue,
  columns,
}) {
  const sql = `SELECT ${columns.join(", ")} FROM ${table} WHERE ${identityColumn} = ? LIMIT 1`;
  const statement = db.prepare(sql).bind(identityValue);
  if (typeof statement.first === "function") return await statement.first();
  if (typeof statement.all === "function") {
    const result = await statement.all();
    return result?.results?.[0] ?? null;
  }
  throw new Error("database prepared statement must support first() or all()");
}

function requireLineageEqual(actual, expected, code) {
  if (actual !== expected) throw new Error(`LINEAGE_MISMATCH:${code}`);
}

async function validateOutcomeLineageV0_1(db, batch) {
  const localOrders = new Map(
    batch.records
      .filter((record) => record.table === "s2_sim_orders")
      .map((record) => [record.identity, record.row]),
  );

  for (const record of batch.records) {
    if (record.table === "s2_sim_orders") {
      const order = parseJsonObject(record.row.order_json, "s2_sim_orders.order_json");
      requireLineageEqual(order.decisionId, record.row.decision_id, "order_json.decisionId");
      requireLineageEqual(order.decisionTimestamp, record.row.created_at, "order_json.decisionTimestamp");
      const decision = await readCanonicalParent(db, {
        table: "s2_decisions",
        identityColumn: "decision_id",
        identityValue: record.row.decision_id,
        columns: ["decision_id","strategy_id","strategy_version","symbol","decision_timestamp"],
      });
      if (!decision) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_sim_orders.decision_id:${record.row.decision_id}`);
      }
      requireLineageEqual(decision.decision_timestamp, record.row.created_at, "order-decision.decision_timestamp");
      requireLineageEqual(order.strategyId, decision.strategy_id, "order-decision.strategy_id");
      requireLineageEqual(order.strategyVersion, decision.strategy_version, "order-decision.strategy_version");
      requireLineageEqual(order.symbol, decision.symbol, "order-decision.symbol");
    }

    if (record.table === "s2_sim_fills") {
      const fill = parseJsonObject(record.row.fill_json, "s2_sim_fills.fill_json");
      requireLineageEqual(fill.simOrderId, record.row.sim_order_id, "fill_json.simOrderId");
      const parent = localOrders.get(record.row.sim_order_id)
        || await readCanonicalParent(db, {
          table: "s2_sim_orders",
          identityColumn: "sim_order_id",
          identityValue: record.row.sim_order_id,
          columns: ["sim_order_id","decision_id","order_json"],
        });
      if (!parent) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_sim_fills.sim_order_id:${record.row.sim_order_id}`);
      }
    }

    if (record.table === "s2_outcomes") {
      const outcome = parseJsonObject(record.row.outcome_json, "s2_outcomes.outcome_json");
      requireLineageEqual(outcome.decisionId, record.row.decision_id, "outcome_json.decisionId");

      // Recalculate the snapshot digest rather than accepting a caller-signed
      // JSON or a fresh batchHash as proof of underlying source provenance.
      const { outcomeHash, ...signedOutcomeFields } = outcome;
      const recalculatedHash = await sha256Hex(signedOutcomeFields);
      if (!/^[0-9a-f]{64}$/.test(String(outcomeHash || ""))
          || recalculatedHash !== outcomeHash) {
        throw new Error("OUTCOME_SNAPSHOT_HASH_MISMATCH");
      }
      const numericProjection = [
        ["d1_return", outcome.horizonReturns?.D1],
        ["d3_return", outcome.horizonReturns?.D3],
        ["d5_return", outcome.horizonReturns?.D5],
        ["d10_return", outcome.horizonReturns?.D10],
        ["d20_return", outcome.horizonReturns?.D20],
        ["mfe", outcome.mfe], ["mae", outcome.mae],
        ["realized_return_after_cost", outcome.simulatedExecution?.realizedReturnAfterCost ?? null],
        ["holding_sessions", outcome.simulatedExecution?.holdingSessions ?? null],
      ];
      for (const [column, payloadValue] of numericProjection) {
        const stored = record.row[column];
        if (!(stored === null || stored === undefined
          ? payloadValue === null || payloadValue === undefined
          : Number.isFinite(payloadValue) && Number(stored) === Number(payloadValue))) {
          throw new Error("OUTCOME_ROW_PROJECTION_MISMATCH:" + column);
        }
      }
      requireLineageEqual(outcome.updatedAt, record.row.updated_at,
        "outcome_json.updatedAt");

      const decision = await readCanonicalParent(db, {
        table: "s2_decisions",
        identityColumn: "decision_id",
        identityValue: record.row.decision_id,
        columns: ["decision_id","symbol","market_date","decision_timestamp"],
      });
      if (!decision) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_outcomes.decision_id:${record.row.decision_id}`);
      }
      if (outcome.symbol !== undefined) {
        requireLineageEqual(outcome.symbol, decision.symbol, "outcome-decision.symbol");
      }
      if (outcome.decisionMarketDate !== undefined) {
        requireLineageEqual(
          outcome.decisionMarketDate,
          decision.market_date,
          "outcome-decision.market_date",
        );
      }
      if (outcome.decisionTimestamp !== undefined) {
        requireLineageEqual(
          outcome.decisionTimestamp,
          decision.decision_timestamp,
          "outcome-decision.decision_timestamp",
        );
      }
    }
  }
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

  const canonicalBatch = await rebuildAndVerifyOutcomePersistenceBatchV0_1(batch);
  await validateOutcomeLineageV0_1(db, canonicalBatch);

  const writes = [];
  const decisions = [];
  for (const record of canonicalBatch.records) {
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
    identityDigest: record.identityDigest,
    rowDigest: record.rowDigest,
  }));
  return deepFreeze({
    batchId: canonicalBatch.batchId,
    batchHash: canonicalBatch.batchHash,
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
