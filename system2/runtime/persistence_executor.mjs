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
  if (batch.schemaVersion !== "S2_PERSISTENCE_BATCH_V0_1") {
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
    verifiedInsertedRowCount: 0,
    transportReportedChanges: 0,
    transportReportedChangesComplete: true,
    selectSql: [],
    insertSql: [],
  };
  const inserts = [];
  const outcomes = [];

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
    verifiedInsertedRowCount: ledger.verifiedInsertedRowCount,
    transportReportedChanges: ledger.transportReportedChangesComplete
      ? ledger.transportReportedChanges
      : null,
    transportReportedChangesComplete: ledger.transportReportedChangesComplete,
    executedMutationKinds: Object.freeze(ledger.insertStatementCount ? ["INSERT"] : []),
    selectStatementHashes: Object.freeze(
      await Promise.all(ledger.selectSql.map((sql) => sha256Hex(sql))),
    ),
    insertStatementHashes: Object.freeze(
      await Promise.all(ledger.insertSql.map((sql) => sha256Hex(sql))),
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
    schemaVersion: "S2_PERSISTENCE_EXECUTION_V0_1",
  });
}
