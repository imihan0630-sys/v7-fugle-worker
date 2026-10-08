import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import {
  OUTCOME_VERSION_SCHEMA_V0_2,
  validateMonotonicOutcomeVersionUpdateV0_2,
  verifyOutcomeVersionRowV0_2,
} from "./outcome_lineage_v0_2.mjs";

export const OUTCOME_PERSISTENCE_VERSION_V0_2 = "S2_OUTCOME_PERSISTENCE_V0_2";

const TABLES = Object.freeze({
  s2_sim_orders: Object.freeze({
    kind: "IMMUTABLE",
    identity: "sim_order_id",
    columns: Object.freeze([
      "sim_order_id","decision_id","side","order_type","trigger_rule_version",
      "order_json","created_at","status",
    ]),
  }),
  s2_sim_fills: Object.freeze({
    kind: "IMMUTABLE",
    identity: "sim_fill_id",
    columns: Object.freeze([
      "sim_fill_id","sim_order_id","fill_timestamp","raw_fill_price","slippage",
      "commission","transaction_tax","all_in_price","shares","fill_quality",
      "ambiguity_reason","feasibility_flags_json","fill_json",
    ]),
  }),
  s2_outcome_versions: Object.freeze({
    kind: "MONOTONIC_OUTCOME_VERSION",
    identity: "outcome_version_id",
    columns: Object.freeze([
      "outcome_version_id","decision_id","decision_hash","strategy_id","strategy_version",
      "symbol","market_date","decision_timestamp","regime_snapshot_id","regime_hash",
      "price_space","corporate_action_state","corporate_action_hash","execution_hash",
      "execution_version","cost_model_hash","cost_model_version","tax_rule_id","lineage_hash",
      "d1_return","d3_return","d5_return","d10_return","d20_return","mfe","mae",
      "target_hit_session","stop_hit_session","ambiguous_same_bar","signal_returns_json",
      "signal_cost_scenarios_json","simulated_execution_state",
      "simulated_net_return_after_cost","simulated_holding_sessions",
      "simulated_fill_quality","outcome_payload_json","outcome_hash","updated_at",
      "schema_version",
    ]),
  }),
});

const MUTABLE_OUTCOME_COLUMNS = Object.freeze([
  "d1_return","d3_return","d5_return","d10_return","d20_return","mfe","mae",
  "target_hit_session","stop_hit_session","ambiguous_same_bar","signal_returns_json",
  "signal_cost_scenarios_json","simulated_execution_state",
  "simulated_net_return_after_cost","simulated_holding_sessions",
  "simulated_fill_quality","outcome_payload_json","outcome_hash","updated_at",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertIdentifier(value, field) {
  const text = requiredText(value, field);
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) throw new Error(`${field} is invalid`);
  return text;
}

function normalizeRow(row, table, spec) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error(`${table} row must be an object`);
  }
  const allowed = new Set(spec.columns);
  const entries = Object.entries(row).sort(([a],[b]) => a.localeCompare(b));
  for (const [column] of entries) {
    assertIdentifier(column, `${table} column`);
    if (!allowed.has(column)) throw new Error(`${table} column is not whitelisted: ${column}`);
  }
  for (const column of spec.columns) {
    if (!(column in row)) throw new Error(`${table} required column missing: ${column}`);
  }
  return Object.fromEntries(entries);
}

function selectSql(table, identityColumn, identityValue) {
  return {
    text: `SELECT * FROM ${table} WHERE ${identityColumn} = ? LIMIT 1`,
    params: [identityValue],
  };
}

function insertSql(table, row) {
  const columns = Object.keys(row);
  return {
    text: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(()=>"?").join(", ")})`,
    params: columns.map((column) => row[column]),
  };
}

function updateSql(row) {
  const columns = MUTABLE_OUTCOME_COLUMNS;
  return {
    text:
      `UPDATE s2_outcome_versions SET ${columns.map((column)=>`${column} = ?`).join(", ")} `
      + "WHERE outcome_version_id = ? AND updated_at = ?",
    params: columns.map((column)=>row[column]),
  };
}

async function canonicalRecord(table, row) {
  const spec = TABLES[table];
  if (!spec) throw new Error(`unsupported outcome persistence table: ${table}`);
  const normalized = normalizeRow(row, table, spec);
  if (table === "s2_outcome_versions") await verifyOutcomeVersionRowV0_2(normalized);
  const identity = requiredText(normalized[spec.identity], `${table}.${spec.identity}`);
  const base = {
    table,
    kind: spec.kind,
    identityColumn: spec.identity,
    identity,
    identityDigest: await sha256Hex({ table, identityColumn: spec.identity, identity }),
    row: normalized,
    rowDigest: await sha256Hex(normalized),
    select: selectSql(table, spec.identity, identity),
    insert: insertSql(table, normalized),
  };
  if (table === "s2_outcome_versions") {
    base.update = {
      ...updateSql(normalized),
      params: [...updateSql(normalized).params, identity],
    };
  }
  return deepFreeze(base);
}

export async function buildOutcomePersistenceBatchV0_2({
  batchId,
  marketDate,
  decisionTimestamp,
  simulationOrderRows = [],
  simulationFillRows = [],
  outcomeVersionRows = [],
  outcomeVersionRow = null,
  createdAt,
} = {}) {
  const id = requiredText(batchId, "batchId");
  const date = requiredText(marketDate, "marketDate");
  const clock = requiredText(decisionTimestamp, "decisionTimestamp");
  const captured = requiredText(createdAt, "createdAt");
  if (!Number.isFinite(Date.parse(clock)) || !Number.isFinite(Date.parse(captured))) {
    throw new Error("decisionTimestamp/createdAt must be ISO timestamps");
  }

  const rows = [
    ...simulationOrderRows.map((row)=>({table:"s2_sim_orders",row})),
    ...simulationFillRows.map((row)=>({table:"s2_sim_fills",row})),
    ...outcomeVersionRows.map((row)=>({table:"s2_outcome_versions",row})),
    ...(outcomeVersionRow ? [{table:"s2_outcome_versions",row:outcomeVersionRow}] : []),
  ];
  const records = [];
  const seen = new Set();
  for (const record of rows) {
    const canonical = await canonicalRecord(record.table, record.row);
    const key = `${canonical.table}|${canonical.identity}`;
    if (seen.has(key)) throw new Error(`duplicate persistence identity: ${key}`);
    seen.add(key);
    records.push(canonical);
  }

  const order = { s2_sim_orders: 10, s2_sim_fills: 20, s2_outcome_versions: 30 };
  records.sort((a,b)=>order[a.table]-order[b.table] || a.identity.localeCompare(b.identity));

  const base = {
    batchId:id,
    marketDate:date,
    decisionTimestamp:clock,
    bindingName:"SYSTEM2_DB",
    namespace:"system2-research",
    persistenceVersion:OUTCOME_PERSISTENCE_VERSION_V0_2,
    operationCount:records.length,
    records:Object.freeze(records),
    createdAt:captured,
    schemaVersion:"S2_OUTCOME_PERSISTENCE_BATCH_V0_2",
  };
  return deepFreeze({ ...base, batchHash: await sha256Hex(base) });
}

export async function rebuildAndVerifyOutcomePersistenceBatchV0_2(batch) {
  if (!batch || typeof batch !== "object" || Array.isArray(batch)) {
    throw new Error("outcome persistence batch is required");
  }
  if (!Array.isArray(batch.records)) throw new Error("batch.records must be an array");

  const simulationOrderRows = [];
  const simulationFillRows = [];
  const outcomeVersionRows = [];
  for (const record of batch.records) {
    if (record?.table === "s2_sim_orders") simulationOrderRows.push(record.row);
    else if (record?.table === "s2_sim_fills") simulationFillRows.push(record.row);
    else if (record?.table === "s2_outcome_versions") outcomeVersionRows.push(record.row);
    else throw new Error("OUTCOME_V2_RECORD_CONTRACT_MISMATCH");
  }

  const canonical = await buildOutcomePersistenceBatchV0_2({
    batchId:batch.batchId,
    marketDate:batch.marketDate,
    decisionTimestamp:batch.decisionTimestamp,
    simulationOrderRows,
    simulationFillRows,
    outcomeVersionRows,
    createdAt:batch.createdAt,
  });
  if (batch.batchHash !== canonical.batchHash) throw new Error("OUTCOME_V2_BATCH_HASH_MISMATCH");
  if (canonicalStringify(batch) !== canonicalStringify(canonical)) {
    throw new Error("OUTCOME_V2_BATCH_CANONICAL_MISMATCH");
  }
  return canonical;
}

function assertDb(db) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("isolated database binding with prepare()/batch() is required");
  }
}

async function readOne(db, sql, params, ledger, phase) {
  ledger.readCount += 1;
  if (phase === "POST_WRITE") ledger.postWriteReadbackCount += 1;
  ledger.readSql.push(sql);
  const statement = db.prepare(sql).bind(...params);
  if (typeof statement.first === "function") return await statement.first();
  if (typeof statement.all === "function") {
    const result = await statement.all();
    return result?.results?.[0] ?? null;
  }
  throw new Error("database prepared statement must support first() or all()");
}

function exactRowMatches(row, existing) {
  if (!existing || typeof existing !== "object") return false;
  const normalized = Object.fromEntries(
    Object.keys(row).sort().map((key)=>[key, existing[key] ?? null]),
  );
  return canonicalStringify(normalized) === canonicalStringify(row);
}

function parseJsonObject(value, field) {
  try {
    const parsed = JSON.parse(requiredText(value, field));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch {
    throw new Error(`${field} must encode an object`);
  }
}

function equal(actual, expected, code) {
  if (actual !== expected) throw new Error(`OUTCOME_V2_LINEAGE_MISMATCH:${code}`);
}

async function parentRow(db, table, identityColumn, identityValue, columns, ledger) {
  const sql = `SELECT ${columns.join(", ")} FROM ${table} WHERE ${identityColumn} = ? LIMIT 1`;
  return readOne(db, sql, [identityValue], ledger, "LINEAGE");
}

async function validateLineage(db, batch, ledger) {
  const localOrders = new Map(
    batch.records.filter((x)=>x.table==="s2_sim_orders").map((x)=>[x.identity,x.row]),
  );

  for (const record of batch.records) {
    if (record.table === "s2_sim_orders") {
      const order = parseJsonObject(record.row.order_json, "order_json");
      equal(order.decisionId, record.row.decision_id, "order.decisionId");
      const decision = await parentRow(
        db,"s2_decisions","decision_id",record.row.decision_id,
        ["decision_id","decision_hash","strategy_id","strategy_version","symbol","market_date","decision_timestamp","regime_snapshot_id"],
        ledger,
      );
      if (!decision) throw new Error(`OUTCOME_V2_PARENT_MISSING:decision:${record.row.decision_id}`);
      equal(order.strategyId, decision.strategy_id, "order.strategyId");
      equal(order.strategyVersion, decision.strategy_version, "order.strategyVersion");
      equal(order.symbol, decision.symbol, "order.symbol");
      equal(order.decisionTimestamp, decision.decision_timestamp, "order.decisionTimestamp");
    }

    if (record.table === "s2_sim_fills") {
      const fill = parseJsonObject(record.row.fill_json, "fill_json");
      equal(fill.simOrderId, record.row.sim_order_id, "fill.simOrderId");
      const parent = localOrders.get(record.row.sim_order_id)
        || await parentRow(
          db,"s2_sim_orders","sim_order_id",record.row.sim_order_id,
          ["sim_order_id","decision_id","order_json"],ledger,
        );
      if (!parent) throw new Error(`OUTCOME_V2_PARENT_MISSING:order:${record.row.sim_order_id}`);
    }

    if (record.table === "s2_outcome_versions") {
      const row = record.row;
      const decision = await parentRow(
        db,"s2_decisions","decision_id",row.decision_id,
        ["decision_id","decision_hash","strategy_id","strategy_version","symbol","market_date","decision_timestamp","regime_snapshot_id"],
        ledger,
      );
      if (!decision) throw new Error(`OUTCOME_V2_PARENT_MISSING:decision:${row.decision_id}`);
      equal(row.decision_hash, decision.decision_hash, "outcome.decisionHash");
      equal(row.strategy_id, decision.strategy_id, "outcome.strategyId");
      equal(row.strategy_version, decision.strategy_version, "outcome.strategyVersion");
      equal(row.symbol, decision.symbol, "outcome.symbol");
      equal(row.market_date, decision.market_date, "outcome.marketDate");
      equal(row.decision_timestamp, decision.decision_timestamp, "outcome.decisionTimestamp");
      equal(row.regime_snapshot_id, decision.regime_snapshot_id, "outcome.regimeSnapshotId");

      const regime = await parentRow(
        db,"s2_market_regime_snapshots","regime_snapshot_id",row.regime_snapshot_id,
        ["regime_snapshot_id","market_date","decision_timestamp","snapshot_hash"],ledger,
      );
      if (!regime) throw new Error(`OUTCOME_V2_PARENT_MISSING:regime:${row.regime_snapshot_id}`);
      equal(row.regime_hash, regime.snapshot_hash, "outcome.regimeHash");
      equal(row.market_date, regime.market_date, "outcome.regimeMarketDate");
      equal(row.decision_timestamp, regime.decision_timestamp, "outcome.regimeDecisionTimestamp");
    }
  }
}

export async function executeOutcomePersistenceBatchV0_2({
  db,
  batch,
  bindingName="SYSTEM2_DB",
} = {}) {
  assertDb(db);
  if (bindingName !== "SYSTEM2_DB" || batch?.bindingName !== "SYSTEM2_DB") {
    throw new Error("refusing non-isolated binding name");
  }
  const canonical = await rebuildAndVerifyOutcomePersistenceBatchV0_2(batch);
  const ledger = {
    readCount:0,insertCount:0,updateCount:0,batchTransportCount:0,
    postWriteReadbackCount:0,readSql:[],writeSql:[],
  };
  await validateLineage(db, canonical, ledger);

  const writes=[];
  const outcomes=[];
  for (const record of canonical.records) {
    const existing = await readOne(
      db,record.select.text,record.select.params,ledger,"PRE_WRITE",
    );
    if (!existing) {
      ledger.insertCount += 1;
      ledger.writeSql.push(record.insert.text);
      writes.push({record,mode:"INSERT",statement:db.prepare(record.insert.text).bind(...record.insert.params)});
      continue;
    }
    if (exactRowMatches(record.row, existing)) {
      outcomes.push({
        table:record.table,identity:record.identity,state:"SKIPPED_IDENTICAL",
        rowDigest:record.rowDigest,
      });
      continue;
    }
    if (record.kind === "IMMUTABLE") {
      throw new Error(`OUTCOME_V2_IMMUTABLE_CONFLICT:${record.table}|${record.identity}`);
    }

    const validation = await validateMonotonicOutcomeVersionUpdateV0_2(existing, record.row);
    if (!validation.updateAllowed) {
      throw new Error(`OUTCOME_V2_REVISION_CONFLICT:${validation.blockers.join("|")}`);
    }
    ledger.updateCount += 1;
    ledger.writeSql.push(record.update.text);
    const params=[...record.update.params, existing.updated_at];
    writes.push({
      record,mode:"UPDATE",
      statement:db.prepare(record.update.text).bind(...params),
    });
  }

  if (writes.length) {
    ledger.batchTransportCount += 1;
    const results=await db.batch(writes.map((x)=>x.statement));
    if (!Array.isArray(results) || results.length !== writes.length) {
      throw new Error("OUTCOME_V2_BATCH_RESULT_COUNT_MISMATCH");
    }
    for(let i=0;i<writes.length;i+=1){
      const write=writes[i], result=results[i];
      if(result?.success===false) throw new Error(`OUTCOME_V2_WRITE_FAILED:${write.record.identity}`);
      if(write.mode==="UPDATE" && Number(result?.meta?.changes)!==1){
        throw new Error(`OUTCOME_V2_OPTIMISTIC_WRITE_CONFLICT:${write.record.identity}`);
      }
      const persisted=await readOne(
        db,write.record.select.text,write.record.select.params,ledger,"POST_WRITE",
      );
      if(!exactRowMatches(write.record.row,persisted)){
        throw new Error(`OUTCOME_V2_POST_WRITE_MISMATCH:${write.record.identity}`);
      }
      outcomes.push({
        table:write.record.table,
        identity:write.record.identity,
        state:write.mode==="INSERT"?"INSERTED":"UPDATED",
        rowDigest:write.record.rowDigest,
      });
    }
  }

  const insertedCount=outcomes.filter((x)=>x.state==="INSERTED").length;
  const updatedCount=outcomes.filter((x)=>x.state==="UPDATED").length;
  const skippedIdenticalCount=outcomes.filter((x)=>x.state==="SKIPPED_IDENTICAL").length;
  const statementLedger=deepFreeze({
    readCount:ledger.readCount,
    insertCount:ledger.insertCount,
    updateCount:ledger.updateCount,
    batchTransportCount:ledger.batchTransportCount,
    postWriteReadbackCount:ledger.postWriteReadbackCount,
    executedMutationKinds:Object.freeze([
      ...(ledger.insertCount?["INSERT"]:[]),
      ...(ledger.updateCount?["UPDATE_MONOTONIC_OUTCOME_VERSION"]:[]),
    ]),
    readStatementHashes:Object.freeze(await Promise.all(ledger.readSql.map((sql)=>sha256Hex(sql)))),
    writeStatementHashes:Object.freeze(await Promise.all(ledger.writeSql.map((sql)=>sha256Hex(sql)))),
  });

  return deepFreeze({
    batchId:canonical.batchId,
    batchHash:canonical.batchHash,
    bindingName,
    operationCount:canonical.operationCount,
    insertedCount,
    updatedCount,
    skippedIdenticalCount,
    outcomes:Object.freeze(outcomes),
    statementLedger,
    state:"OUTCOME_PERSISTENCE_V0_2_APPLIED",
    schemaVersion:OUTCOME_PERSISTENCE_VERSION_V0_2,
  });
}

export { OUTCOME_VERSION_SCHEMA_V0_2 };
