import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import {
  validateMonotonicOutcomeUpdateV0_1,
  verifyDecisionOutcomeSnapshotV0_2,
} from "./outcome_tracker_v0_1.mjs";

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
  table: "s2_outcome_versions",
  identityColumn: "outcome_version_id",
  columns: Object.freeze([
    "outcome_version_id","decision_id","decision_hash","strategy_id","strategy_version",
    "symbol","decision_timestamp","regime_snapshot_id","regime_hash","price_space",
    "corporate_action_state","corporate_action_lineage_hash","cost_scenario_set_hash",
    "execution_hash","execution_version","cost_model_hash","tax_rule_id","tax_rule_hash",
    "d1_return","d3_return","d5_return","d10_return","d20_return","mfe","mae",
    "target_hit_session","stop_hit_session","ambiguous_same_bar","signal_return_json",
    "realized_return_after_cost","holding_sessions","simulated_execution_json",
    "outcome_hash","outcome_json","updated_at",
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
  const columns = Object.keys(row).filter((column) => column !== "outcome_version_id");
  return {
    text: `UPDATE s2_outcome_versions SET ${columns.map((column) => `${column} = ?`).join(", ")} WHERE outcome_version_id = ? AND updated_at = ?`,
    params: [...columns.map((column) => row[column]), row.outcome_version_id],
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
    const outcomeVersionId = requiredText(
      normalizedOutcome.outcome_version_id,
      `outcomeRows[${i}].outcome_version_id`,
    );
    requiredText(normalizedOutcome.updated_at, `outcomeRows[${i}].updated_at`);
    const key = `s2_outcome_versions|${outcomeVersionId}`;
    if (seen.has(key)) throw new Error(`duplicate persistence identity: ${key}`);
    seen.add(key);
    records.push({
      kind: "MONOTONIC_OUTCOME",
      table: "s2_outcome_versions",
      identityColumn: "outcome_version_id",
      identity: outcomeVersionId,
      row: normalizedOutcome,
      select: selectSql("s2_outcome_versions", normalizedOutcome, "outcome_version_id"),
      insert: insertSql("s2_outcome_versions", normalizedOutcome),
      update: outcomeUpdateSql(normalizedOutcome),
      identityDigest: await sha256Hex({
        table: "s2_outcome_versions",
        identityColumn: "outcome_version_id",
        identity: outcomeVersionId,
        decisionId,
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
    mutableTable: "s2_outcome_versions",
    legacyOutcomeTable: "s2_outcomes",
    outcomeUpdatePolicy: "VERSIONED_IDENTITY_PLUS_MONOTONIC_MATURATION_WITH_OPTIMISTIC_UPDATED_AT_GUARD",
    createdAt: created,
    schemaVersion: "S2_OUTCOME_PERSISTENCE_BATCH_V0_2",
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
    } else if (record.table === "s2_outcome_versions" && record.kind === "MONOTONIC_OUTCOME") {
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

async function verifyOutcomeVersionRowV0_2(row, field = "s2_outcome_versions") {
  const outcome = parseJsonObject(row.outcome_json, `${field}.outcome_json`);
  const verification = await verifyDecisionOutcomeSnapshotV0_2(outcome);
  if (!verification.valid) {
    throw new Error(`OUTCOME_SNAPSHOT_INTEGRITY:${verification.blockers.join("|")}`);
  }
  requireLineageEqual(outcome.outcomeVersionId, row.outcome_version_id, "outcome.row.outcome_version_id");
  requireLineageEqual(outcome.outcomeHash, row.outcome_hash, "outcome.row.outcome_hash");
  requireLineageEqual(outcome.decisionId, row.decision_id, "outcome.row.decision_id");
  requireLineageEqual(outcome.decisionHash, row.decision_hash, "outcome.row.decision_hash");
  requireLineageEqual(outcome.strategyId, row.strategy_id, "outcome.row.strategy_id");
  requireLineageEqual(outcome.strategyVersion, row.strategy_version, "outcome.row.strategy_version");
  requireLineageEqual(outcome.symbol, row.symbol, "outcome.row.symbol");
  requireLineageEqual(outcome.decisionTimestamp, row.decision_timestamp, "outcome.row.decision_timestamp");
  requireLineageEqual(outcome.regimeSnapshotId, row.regime_snapshot_id, "outcome.row.regime_snapshot_id");
  requireLineageEqual(outcome.regimeHash, row.regime_hash, "outcome.row.regime_hash");
  requireLineageEqual(outcome.priceSpace, row.price_space, "outcome.row.price_space");
  requireLineageEqual(
    outcome.corporateActionLineageHash,
    row.corporate_action_lineage_hash,
    "outcome.row.corporate_action_lineage_hash",
  );
  requireLineageEqual(outcome.costScenarioSetHash, row.cost_scenario_set_hash, "outcome.row.cost_scenario_set_hash");
  requireLineageEqual(outcome.executionLineage?.executionHash ?? null, row.execution_hash ?? null, "outcome.row.execution_hash");
  requireLineageEqual(outcome.executionLineage?.costModelHash ?? null, row.cost_model_hash ?? null, "outcome.row.cost_model_hash");
  requireLineageEqual(outcome.executionLineage?.taxRuleHash ?? null, row.tax_rule_hash ?? null, "outcome.row.tax_rule_hash");
  requireLineageEqual(outcome.executionLineage?.executionVersion ?? null, row.execution_version ?? null, "outcome.row.execution_version");
  requireLineageEqual(outcome.executionLineage?.taxRuleId ?? null, row.tax_rule_id ?? null, "outcome.row.tax_rule_id");
  requireLineageEqual(outcome.corporateActionState, row.corporate_action_state, "outcome.row.corporate_action_state");

  const horizon = outcome.horizonReturns || {};
  for (const [column, key] of [
    ["d1_return","D1"],
    ["d3_return","D3"],
    ["d5_return","D5"],
    ["d10_return","D10"],
    ["d20_return","D20"],
  ]) {
    requireLineageEqual(horizon[key] ?? null, row[column] ?? null, `outcome.row.${column}`);
  }
  requireLineageEqual(outcome.mfe ?? null, row.mfe ?? null, "outcome.row.mfe");
  requireLineageEqual(outcome.mae ?? null, row.mae ?? null, "outcome.row.mae");
  requireLineageEqual(
    outcome.barrierObservation?.targetHitSession ?? null,
    row.target_hit_session ?? null,
    "outcome.row.target_hit_session",
  );
  requireLineageEqual(
    outcome.barrierObservation?.stopHitSession ?? null,
    row.stop_hit_session ?? null,
    "outcome.row.stop_hit_session",
  );
  requireLineageEqual(
    outcome.barrierObservation?.ambiguousSameBar ? 1 : 0,
    Number(row.ambiguous_same_bar ?? 0),
    "outcome.row.ambiguous_same_bar",
  );
  requireLineageEqual(
    outcome.simulatedExecution?.realizedReturnAfterCost ?? null,
    row.realized_return_after_cost ?? null,
    "outcome.row.realized_return_after_cost",
  );
  requireLineageEqual(
    outcome.simulatedExecution?.holdingSessions ?? null,
    row.holding_sessions ?? null,
    "outcome.row.holding_sessions",
  );

  const expectedSignal = JSON.stringify({
    horizonReturns: outcome.horizonReturns,
    benchmarkReturns: outcome.benchmarkReturns,
    industryReturns: outcome.industryReturns,
    relativeBenchmarkReturns: outcome.relativeBenchmarkReturns,
    relativeIndustryReturns: outcome.relativeIndustryReturns,
    costScenarios: outcome.costScenarios,
    semantics: "SIGNAL_PRICE_RETURNS_AND_SCENARIO_ESTIMATES_NOT_SIMULATED_REALIZED_RETURN",
  });
  requireLineageEqual(expectedSignal, row.signal_return_json, "outcome.row.signal_return_json");
  requireLineageEqual(
    outcome.simulatedExecution ? JSON.stringify(outcome.simulatedExecution) : null,
    row.simulated_execution_json ?? null,
    "outcome.row.simulated_execution_json",
  );
  return outcome;
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

    if (record.table === "s2_outcome_versions") {
      const outcome = await verifyOutcomeVersionRowV0_2(record.row);
      const decision = await readCanonicalParent(db, {
        table: "s2_decisions",
        identityColumn: "decision_id",
        identityValue: record.row.decision_id,
        columns: [
          "decision_id","decision_hash","strategy_id","strategy_version","symbol",
          "market_date","decision_timestamp","regime_snapshot_id",
        ],
      });
      if (!decision) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_outcome_versions.decision_id:${record.row.decision_id}`);
      }
      requireLineageEqual(record.row.decision_hash, decision.decision_hash, "outcome-decision.decision_hash");
      requireLineageEqual(record.row.strategy_id, decision.strategy_id, "outcome-decision.strategy_id");
      requireLineageEqual(record.row.strategy_version, decision.strategy_version, "outcome-decision.strategy_version");
      requireLineageEqual(record.row.symbol, decision.symbol, "outcome-decision.symbol");
      requireLineageEqual(outcome.decisionMarketDate, decision.market_date, "outcome-decision.market_date");
      requireLineageEqual(record.row.decision_timestamp, decision.decision_timestamp, "outcome-decision.decision_timestamp");
      requireLineageEqual(record.row.regime_snapshot_id, decision.regime_snapshot_id, "outcome-decision.regime_snapshot_id");

      const regime = await readCanonicalParent(db, {
        table: "s2_market_regime_snapshots",
        identityColumn: "regime_snapshot_id",
        identityValue: record.row.regime_snapshot_id,
        columns: ["regime_snapshot_id","market_date","decision_timestamp","snapshot_hash"],
      });
      if (!regime) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_outcome_versions.regime_snapshot_id:${record.row.regime_snapshot_id}`);
      }
      requireLineageEqual(record.row.regime_hash, regime.snapshot_hash, "outcome-regime.snapshot_hash");
      requireLineageEqual(outcome.decisionMarketDate, regime.market_date, "outcome-regime.market_date");
      requireLineageEqual(record.row.decision_timestamp, regime.decision_timestamp, "outcome-regime.decision_timestamp");
    }
  }
}

export async function executeOutcomePersistenceBatchV0_1({
  db,
  batch,
  bindingName = "SYSTEM2_DB",
} = {}) {
  assertDb(db);
  if (!batch || batch.schemaVersion !== "S2_OUTCOME_PERSISTENCE_BATCH_V0_2") {
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
    if (existing && record.table === "s2_outcome_versions") {
      await verifyOutcomeVersionRowV0_2(existing, "persisted.s2_outcome_versions");
    }
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
    if (write.record.table === "s2_outcome_versions") {
      await verifyOutcomeVersionRowV0_2(persisted, "readback.s2_outcome_versions");
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
    schemaVersion: "S2_OUTCOME_PERSISTENCE_EXECUTION_V0_2",
  });
}

export { IMMUTABLE_TABLES };
