import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import {
  compareExistingRow,
  rebuildAndVerifySystem2PersistenceBatch,
} from "./persistence_batch.mjs";

function assertDb(db) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("isolated System2 database adapter with prepare() and batch() is required");
  }
}

function assertBatch(batch) {
  if (!batch || typeof batch !== "object") throw new Error("persistence batch is required");
  if (batch.schemaVersion !== "S2_PERSISTENCE_BATCH_V0_2") {
    throw new Error("unsupported persistence batch schemaVersion");
  }
  if (batch.bindingName !== "SYSTEM2_DB") {
    throw new Error("System2 persistence executor requires SYSTEM2_DB binding contract");
  }
  if (batch.namespace !== "s2_") {
    throw new Error("System2 persistence executor requires s2_ namespace");
  }
  if (!Array.isArray(batch.operations)) throw new Error("batch.operations must be an array");
}

async function readExisting(db, operation, ledger, phase) {
  ledger.selectStatementCount += 1;
  ledger.selectSql.push(operation.sql.selectSql);
  if (phase === "POST_WRITE") ledger.postWriteReadbackCount += 1;
  const statement = db.prepare(operation.sql.selectSql).bind(...operation.sql.selectParams);
  if (typeof statement.first === "function") {
    return await statement.first();
  }
  if (typeof statement.all === "function") {
    const result = await statement.all();
    return result?.results?.[0] ?? null;
  }
  throw new Error("database prepared statement must support first() or all()");
}

function localBatchRowByColumn(batch, table, column, value) {
  const operation = batch.operations.find(
    (op) => op.table === table && op.row?.[column] === value,
  );
  return operation?.row || null;
}

async function readLineageParent(db, {
  table,
  identityColumn,
  identityValue,
  columns,
}, ledger) {
  const sql =
    `SELECT ${columns.join(", ")} FROM ${table} WHERE ${identityColumn} = ? LIMIT 1`;
  ledger.lineageReadStatementCount += 1;
  ledger.lineageSql.push(sql);
  const statement = db.prepare(sql).bind(identityValue);
  if (typeof statement.first === "function") return await statement.first();
  if (typeof statement.all === "function") {
    const result = await statement.all();
    return result?.results?.[0] ?? null;
  }
  throw new Error("database prepared statement must support first() or all()");
}

function requireEqual(actual, expected, code) {
  if (actual !== expected) {
    throw new Error(`LINEAGE_MISMATCH:${code}`);
  }
}

function requireDateInside(date, firstDate, lastDate, code) {
  if (
    typeof date !== "string"
    || typeof firstDate !== "string"
    || typeof lastDate !== "string"
    || date < firstDate
    || date > lastDate
  ) {
    throw new Error(`LINEAGE_MISMATCH:${code}`);
  }
}

function parseJsonStringArray(value, code) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`LINEAGE_MISMATCH:${code}:INVALID_JSON`);
  }
  if (!Array.isArray(parsed) || parsed.some((x) => typeof x !== "string" || !x)) {
    throw new Error(`LINEAGE_MISMATCH:${code}:NOT_STRING_ARRAY`);
  }
  if (new Set(parsed).size !== parsed.length) {
    throw new Error(`LINEAGE_MISMATCH:${code}:DUPLICATE`);
  }
  return parsed;
}

async function resolveLineageParent(db, batch, spec, ledger) {
  const {
    table,
    column,
    value,
    columns,
  } = spec;
  if (value === null || value === undefined || value === "") return null;
  return (
    localBatchRowByColumn(batch, table, column, value)
    || await readLineageParent(db, {
      table,
      identityColumn: column,
      identityValue: value,
      columns,
    }, ledger)
  );
}

async function validateImmutableLineage(db, batch, ledger) {
  for (const operation of batch.operations) {
    const row = operation.row;

    if (operation.table === "s2_historical_a1_bars") {
      const parent = await resolveLineageParent(db, batch, {
        table: "s2_historical_ingest_batches",
        column: "batch_id",
        value: row.batch_id,
        columns: ["batch_id","first_market_date","last_market_date"],
      }, ledger);
      if (!parent) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_historical_a1_bars.batch_id:${row.batch_id}`);
      }
      requireDateInside(
        row.market_date,
        parent.first_market_date,
        parent.last_market_date,
        "historical-bar.market_date",
      );
    }

    if (operation.table === "s2_backtest_checkpoints") {
      const parent = await resolveLineageParent(db, batch, {
        table: "s2_backtest_runs",
        column: "run_id",
        value: row.run_id,
        columns: ["run_id","plan_hash"],
      }, ledger);
      if (!parent) {
        throw new Error(`LINEAGE_PARENT_MISSING:s2_backtest_checkpoints.run_id:${row.run_id}`);
      }
      requireEqual(parent.plan_hash, row.plan_hash, "checkpoint-run.plan_hash");
    }

    if (operation.table === "s2_historical_base_samples") {
      const parent = await resolveLineageParent(db, batch, {
        table: "s2_backtest_runs",
        column: "run_id",
        value: row.backtest_run_id,
        columns: [
          "run_id","strategy_id","strategy_version","first_market_date","last_market_date",
        ],
      }, ledger);
      if (!parent) {
        throw new Error(
          `LINEAGE_PARENT_MISSING:s2_historical_base_samples.backtest_run_id:${row.backtest_run_id}`,
        );
      }
      requireEqual(parent.strategy_id, row.strategy_id, "sample-run.strategy_id");
      requireEqual(parent.strategy_version, row.strategy_version, "sample-run.strategy_version");
      requireDateInside(
        row.market_date,
        parent.first_market_date,
        parent.last_market_date,
        "sample-run.market_date",
      );
    }

    if (operation.table === "s2_symbol_factor_snapshots") {
      if (row.regime_snapshot_id) {
        const regime = await resolveLineageParent(db, batch, {
          table: "s2_market_regime_snapshots",
          column: "regime_snapshot_id",
          value: row.regime_snapshot_id,
          columns: ["regime_snapshot_id","market_date","decision_timestamp"],
        }, ledger);
        if (!regime) {
          throw new Error(
            `LINEAGE_PARENT_MISSING:s2_symbol_factor_snapshots.regime_snapshot_id:${row.regime_snapshot_id}`,
          );
        }
        requireEqual(regime.market_date, row.market_date, "factor-regime.market_date");
        requireEqual(
          regime.decision_timestamp,
          row.decision_timestamp,
          "factor-regime.decision_timestamp",
        );
      }

      if (row.industry_snapshot_id) {
        const industry = await resolveLineageParent(db, batch, {
          table: "s2_industry_snapshots",
          column: "industry_snapshot_id",
          value: row.industry_snapshot_id,
          columns: ["industry_snapshot_id","market_date","decision_timestamp"],
        }, ledger);
        if (!industry) {
          throw new Error(
            `LINEAGE_PARENT_MISSING:s2_symbol_factor_snapshots.industry_snapshot_id:${row.industry_snapshot_id}`,
          );
        }
        requireEqual(industry.market_date, row.market_date, "factor-industry.market_date");
        requireEqual(
          industry.decision_timestamp,
          row.decision_timestamp,
          "factor-industry.decision_timestamp",
        );
      }
    }

    if (operation.table === "s2_decisions") {
      const factor = await resolveLineageParent(db, batch, {
        table: "s2_symbol_factor_snapshots",
        column: "snapshot_id",
        value: row.factor_snapshot_id,
        columns: [
          "snapshot_id","market_date","decision_timestamp","symbol","regime_snapshot_id",
        ],
      }, ledger);
      if (!factor) {
        throw new Error(
          `LINEAGE_PARENT_MISSING:s2_decisions.factor_snapshot_id:${row.factor_snapshot_id}`,
        );
      }
      requireEqual(factor.market_date, row.market_date, "decision-factor.market_date");
      requireEqual(
        factor.decision_timestamp,
        row.decision_timestamp,
        "decision-factor.decision_timestamp",
      );
      requireEqual(factor.symbol, row.symbol, "decision-factor.symbol");
      if (
        factor.regime_snapshot_id !== null
        && factor.regime_snapshot_id !== undefined
        && factor.regime_snapshot_id !== row.regime_snapshot_id
      ) {
        throw new Error("LINEAGE_MISMATCH:decision-factor.regime_snapshot_id");
      }

      const regime = await resolveLineageParent(db, batch, {
        table: "s2_market_regime_snapshots",
        column: "regime_snapshot_id",
        value: row.regime_snapshot_id,
        columns: ["regime_snapshot_id","market_date","decision_timestamp"],
      }, ledger);
      if (!regime) {
        throw new Error(
          `LINEAGE_PARENT_MISSING:s2_decisions.regime_snapshot_id:${row.regime_snapshot_id}`,
        );
      }
      requireEqual(regime.market_date, row.market_date, "decision-regime.market_date");
      requireEqual(
        regime.decision_timestamp,
        row.decision_timestamp,
        "decision-regime.decision_timestamp",
      );
    }

    if (operation.table === "s2_decision_corrections") {
      const decision = await resolveLineageParent(db, batch, {
        table: "s2_decisions",
        column: "decision_id",
        value: row.original_decision_id,
        columns: ["decision_id"],
      }, ledger);
      if (!decision) {
        throw new Error(
          `LINEAGE_PARENT_MISSING:s2_decision_corrections.original_decision_id:${row.original_decision_id}`,
        );
      }
    }

    if (operation.table === "s2_candidate_reentry_receipts") {
      const decision = await resolveLineageParent(db, batch, {
        table: "s2_decisions",
        column: "decision_id",
        value: row.requalified_decision_id,
        columns: ["decision_id","symbol"],
      }, ledger);
      if (!decision) {
        throw new Error(
          `LINEAGE_PARENT_MISSING:s2_candidate_reentry_receipts.requalified_decision_id:${row.requalified_decision_id}`,
        );
      }
      requireEqual(decision.symbol, row.symbol, "reentry-decision.symbol");
    }

    if (operation.table === "s2_shadow_run_fingerprints") {
      const source = await resolveLineageParent(db, batch, {
        table: "s2_source_session_receipts",
        column: "source_session_hash",
        value: row.source_session_hash,
        columns: [
          "source_session_hash","market_date","decision_timestamp",
        ],
      }, ledger);
      if (!source) {
        throw new Error(
          `LINEAGE_PARENT_MISSING:s2_shadow_run_fingerprints.source_session_hash:${row.source_session_hash}`,
        );
      }
      requireEqual(source.market_date, row.market_date, "fingerprint-source.market_date");
      requireEqual(
        source.decision_timestamp,
        row.decision_timestamp,
        "fingerprint-source.decision_timestamp",
      );

      if (row.capacity_hash) {
        const capacity = await resolveLineageParent(db, batch, {
          table: "s2_capacity_runs",
          column: "capacity_hash",
          value: row.capacity_hash,
          columns: ["capacity_hash","market_date","decision_timestamp"],
        }, ledger);
        if (!capacity) {
          throw new Error(
            `LINEAGE_PARENT_MISSING:s2_shadow_run_fingerprints.capacity_hash:${row.capacity_hash}`,
          );
        }
        requireEqual(capacity.market_date, row.market_date, "fingerprint-capacity.market_date");
        requireEqual(
          capacity.decision_timestamp,
          row.decision_timestamp,
          "fingerprint-capacity.decision_timestamp",
        );
      }

      const decisionHashes = parseJsonStringArray(
        row.decision_hashes_json,
        "fingerprint.decision_hashes_json",
      );
      for (const decisionHash of decisionHashes) {
        const decision = await resolveLineageParent(db, batch, {
          table: "s2_decisions",
          column: "decision_hash",
          value: decisionHash,
          columns: [
            "decision_hash","market_date","decision_timestamp","strategy_id","strategy_version",
          ],
        }, ledger);
        if (!decision) {
          throw new Error(
            `LINEAGE_PARENT_MISSING:s2_shadow_run_fingerprints.decision_hash:${decisionHash}`,
          );
        }
        requireEqual(decision.market_date, row.market_date, "fingerprint-decision.market_date");
        requireEqual(
          decision.decision_timestamp,
          row.decision_timestamp,
          "fingerprint-decision.decision_timestamp",
        );
        requireEqual(decision.strategy_id, row.strategy_id, "fingerprint-decision.strategy_id");
        requireEqual(
          decision.strategy_version,
          row.strategy_version,
          "fingerprint-decision.strategy_version",
        );
      }
    }
  }
}

function exactRowMatches(operation, existingRow) {
  if (!existingRow || typeof existingRow !== "object" || Array.isArray(existingRow)) return false;
  const normalized = Object.fromEntries(
    Object.keys(operation.row)
      .sort()
      .map((key) => [key, existingRow[key] ?? null]),
  );
  return canonicalStringify(normalized) === canonicalStringify(operation.row);
}

export async function executeSystem2PersistenceBatch({
  db,
  batch,
  bindingName = "SYSTEM2_DB",
} = {}) {
  assertDb(db);
  assertBatch(batch);
  if (bindingName !== "SYSTEM2_DB") {
    throw new Error("refusing non-isolated binding name");
  }

  // Treat the supplied batch as opaque/untrusted. Rebuild table/column contract,
  // identities, digests and SQL before the first database prepare/transport.
  const canonicalBatch = await rebuildAndVerifySystem2PersistenceBatch(batch);
  const ledger = {
    selectStatementCount: 0,
    insertStatementCount: 0,
    batchTransportCount: 0,
    postWriteReadbackCount: 0,
    lineageReadStatementCount: 0,
    verifiedInsertedRowCount: 0,
    transportReportedChanges: 0,
    transportReportedChangesComplete: true,
    transportReportedRowsWritten: 0,
    transportReportedRowsWrittenComplete: true,
    selectSql: [],
    insertSql: [],
    lineageSql: [],
  };
  const inserts = [];
  const outcomes = [];

  await validateImmutableLineage(db, canonicalBatch, ledger);

  for (const operation of canonicalBatch.operations) {
    const existing = await readExisting(db, operation, ledger, "PRE_WRITE");
    const comparison = compareExistingRow(operation, existing);

    if (comparison.state === "IMMUTABLE_CONFLICT") {
      throw new Error(`IMMUTABLE_CONFLICT existing row: ${operation.identityKey}`);
    }

    if (comparison.state === "IDENTICAL") {
      outcomes.push({
        table: operation.table,
        identityKey: operation.identityKey,
        state: "SKIPPED_IDENTICAL",
        identityDigest: operation.identityDigest,
        rowDigest: operation.rowDigest,
      });
      continue;
    }

    ledger.insertStatementCount += 1;
    ledger.insertSql.push(operation.sql.insertSql);
    const statement = db
      .prepare(operation.sql.insertSql)
      .bind(...operation.sql.insertParams);
    inserts.push({ operation, statement });
  }

  if (inserts.length) {
    ledger.batchTransportCount += 1;
    const results = await db.batch(inserts.map((x) => x.statement));
    if (!Array.isArray(results) || results.length !== inserts.length) {
      throw new Error("isolated database batch returned unexpected result count");
    }

    for (let i = 0; i < inserts.length; i += 1) {
      const result = results[i];
      if (result?.success === false) {
        throw new Error(
          `isolated database insert failed for ${inserts[i].operation.identityKey}`,
        );
      }
      const changes = Number(result?.meta?.changes);
      if (Number.isFinite(changes)) ledger.transportReportedChanges += changes;
      else ledger.transportReportedChangesComplete = false;

      const rowsWritten = Number(result?.meta?.rows_written);
      if (Number.isFinite(rowsWritten)) {
        ledger.transportReportedRowsWritten += rowsWritten;
      } else if (Number.isFinite(changes)) {
        ledger.transportReportedRowsWritten += changes;
      } else {
        ledger.transportReportedRowsWrittenComplete = false;
      }

      const persisted = await readExisting(
        db,
        inserts[i].operation,
        ledger,
        "POST_WRITE",
      );
      if (!exactRowMatches(inserts[i].operation, persisted)) {
        throw new Error(
          `POST_WRITE_VERIFICATION_FAILED:${inserts[i].operation.identityKey}`,
        );
      }
      ledger.verifiedInsertedRowCount += 1;
      outcomes.push({
        table: inserts[i].operation.table,
        identityKey: inserts[i].operation.identityKey,
        identityDigest: inserts[i].operation.identityDigest,
        state: "INSERTED",
        rowDigest: inserts[i].operation.rowDigest,
      });
    }
  }

  const insertedCount = outcomes.filter((x) => x.state === "INSERTED").length;
  const skippedIdenticalCount = outcomes.filter(
    (x) => x.state === "SKIPPED_IDENTICAL",
  ).length;

  const statementLedger = deepFreeze({
    selectStatementCount: ledger.selectStatementCount,
    insertStatementCount: ledger.insertStatementCount,
    batchTransportCount: ledger.batchTransportCount,
    postWriteReadbackCount: ledger.postWriteReadbackCount,
    lineageReadStatementCount: ledger.lineageReadStatementCount,
    verifiedInsertedRowCount: ledger.verifiedInsertedRowCount,
    transportReportedChanges: ledger.transportReportedChangesComplete
      ? ledger.transportReportedChanges
      : null,
    transportReportedChangesComplete: ledger.transportReportedChangesComplete,
    transportReportedRowsWritten: ledger.transportReportedRowsWrittenComplete
      ? ledger.transportReportedRowsWritten
      : null,
    transportReportedRowsWrittenComplete: ledger.transportReportedRowsWrittenComplete,
    executedMutationKinds: Object.freeze(ledger.insertStatementCount ? ["INSERT"] : []),
    selectStatementHashes: Object.freeze(
      await Promise.all(ledger.selectSql.map((sql) => sha256Hex(sql))),
    ),
    insertStatementHashes: Object.freeze(
      await Promise.all(ledger.insertSql.map((sql) => sha256Hex(sql))),
    ),
    lineageStatementHashes: Object.freeze(
      await Promise.all(ledger.lineageSql.map((sql) => sha256Hex(sql))),
    ),
  });

  return deepFreeze({
    batchId: canonicalBatch.batchId,
    batchHash: canonicalBatch.batchHash,
    bindingName,
    operationCount: canonicalBatch.operations.length,
    insertedCount,
    skippedIdenticalCount,
    outcomes: Object.freeze(outcomes),
    statementLedger,
    state: "PERSISTENCE_BATCH_APPLIED",
    schemaVersion: "S2_PERSISTENCE_EXECUTION_V0_2",
  });
}
