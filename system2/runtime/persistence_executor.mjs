import { deepFreeze } from "./factor_snapshot.mjs";
import { compareExistingRow } from "./persistence_batch.mjs";

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

async function readExisting(db, operation) {
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

  const inserts = [];
  const outcomes = [];

  for (const operation of batch.operations) {
    const existing = await readExisting(db, operation);
    const comparison = compareExistingRow(operation, existing);

    if (comparison.state === "IMMUTABLE_CONFLICT") {
      throw new Error(`IMMUTABLE_CONFLICT existing row: ${operation.identityKey}`);
    }

    if (comparison.state === "IDENTICAL") {
      outcomes.push({
        table: operation.table,
        identityKey: operation.identityKey,
        state: "SKIPPED_IDENTICAL",
        rowDigest: operation.rowDigest,
      });
      continue;
    }

    const statement = db
      .prepare(operation.sql.insertSql)
      .bind(...operation.sql.insertParams);
    inserts.push({ operation, statement });
  }

  if (inserts.length) {
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
      outcomes.push({
        table: inserts[i].operation.table,
        identityKey: inserts[i].operation.identityKey,
        state: "INSERTED",
        rowDigest: inserts[i].operation.rowDigest,
      });
    }
  }

  const insertedCount = outcomes.filter((x) => x.state === "INSERTED").length;
  const skippedIdenticalCount = outcomes.filter(
    (x) => x.state === "SKIPPED_IDENTICAL",
  ).length;

  return deepFreeze({
    batchId: batch.batchId,
    batchHash: batch.batchHash,
    bindingName,
    operationCount: batch.operations.length,
    insertedCount,
    skippedIdenticalCount,
    outcomes: Object.freeze(outcomes),
    state: "PERSISTENCE_BATCH_APPLIED",
    schemaVersion: "S2_PERSISTENCE_EXECUTION_V0_1",
  });
}
