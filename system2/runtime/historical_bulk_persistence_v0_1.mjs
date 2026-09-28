import { deepFreeze } from "./factor_snapshot.mjs";
import {
  buildSystem2PersistenceBatch,
  compareExistingRow,
} from "./persistence_batch.mjs";
import {
  toHistoricalA1BarRows,
  toHistoricalIngestBatchRow,
} from "./historical_store_v0_1.mjs";
import { executeSystem2PersistenceBatch } from "./persistence_executor.mjs";

export const HISTORICAL_BULK_PERSISTENCE_VERSION = "0.1-RESEARCH";

function positiveInteger(value, field, fallback) {
  const n = value === undefined || value === null ? fallback : Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    throw new Error(field + " must be an integer from 1 to 500");
  }
  return n;
}

function chunks(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

async function buildBarOperations(batch) {
  const records = toHistoricalA1BarRows(batch).map((row) => ({
    table: "s2_historical_a1_bars",
    row,
  }));
  return buildSystem2PersistenceBatch({
    batchId: batch.batchId + "|BAR-OPS",
    marketDate: batch.lastMarketDate,
    decisionTimestamp: batch.capturedAt,
    records,
    createdAt: batch.capturedAt,
  });
}

async function existingByBarId(db, operations, lookupChunkSize) {
  const map = new Map();
  for (const group of chunks(operations, lookupChunkSize)) {
    const ids = group.map((op) => op.identity.bar_id);
    const placeholders = ids.map(() => "?").join(",");
    const statement = db
      .prepare(`SELECT * FROM s2_historical_a1_bars WHERE bar_id IN (${placeholders})`)
      .bind(...ids);
    const result = await statement.all();
    for (const row of result?.results || []) {
      map.set(String(row.bar_id), row);
    }
  }
  return map;
}

export async function executeHistoricalIngestBatchBulkV0_1({
  db,
  ingestBatch,
  lookupChunkSize = 80,
  insertChunkSize = 80,
} = {}) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("isolated System2 database adapter is required");
  }
  if (!ingestBatch || ingestBatch.schemaVersion !== "S2_HISTORICAL_INGEST_BATCH_V0_1") {
    throw new Error("valid historical ingest batch is required");
  }
  const lookupSize = positiveInteger(lookupChunkSize, "lookupChunkSize", 80);
  const insertSize = positiveInteger(insertChunkSize, "insertChunkSize", 80);

  const operationBatch = await buildBarOperations(ingestBatch);
  const operations = operationBatch.operations;
  const existing = await existingByBarId(db, operations, lookupSize);
  const absent = [];
  let identicalCount = 0;

  for (const operation of operations) {
    const prior = existing.get(String(operation.identity.bar_id)) || null;
    const comparison = compareExistingRow(operation, prior);
    if (comparison.state === "IMMUTABLE_CONFLICT") {
      throw new Error("IMMUTABLE_CONFLICT historical bar: " + operation.identityKey);
    }
    if (comparison.state === "IDENTICAL") {
      identicalCount += 1;
      continue;
    }
    absent.push(operation);
  }

  let insertedCount = 0;
  for (const group of chunks(absent, insertSize)) {
    const statements = group.map((operation) =>
      db.prepare(operation.sql.insertSql).bind(...operation.sql.insertParams));
    const results = await db.batch(statements);
    if (!Array.isArray(results) || results.length !== statements.length) {
      throw new Error("historical D1 insert batch returned unexpected result count");
    }
    for (let i = 0; i < results.length; i += 1) {
      if (results[i]?.success === false) {
        throw new Error("historical D1 insert failed: " + group[i].identityKey);
      }
      insertedCount += 1;
    }
  }

  if (insertedCount + identicalCount !== operations.length) {
    throw new Error("historical bar persistence accounting mismatch");
  }

  // Completion receipt is deliberately written only after every bar is either
  // inserted or proven identical.  A partial failure therefore cannot advance
  // durable backfill completion.
  const receiptRecord = {
    table: "s2_historical_ingest_batches",
    row: toHistoricalIngestBatchRow(ingestBatch),
  };
  const receiptBatch = await buildSystem2PersistenceBatch({
    batchId: ingestBatch.batchId + "|COMPLETION-RECEIPT",
    marketDate: ingestBatch.lastMarketDate,
    decisionTimestamp: ingestBatch.capturedAt,
    records: [receiptRecord],
    createdAt: ingestBatch.capturedAt,
  });
  const receiptResult = await executeSystem2PersistenceBatch({
    db,
    batch: receiptBatch,
    bindingName: "SYSTEM2_DB",
  });

  return deepFreeze({
    batchId: ingestBatch.batchId,
    batchHash: ingestBatch.batchHash,
    expectedBarCount: operations.length,
    insertedBarCount: insertedCount,
    identicalBarCount: identicalCount,
    allBarsAccounted: insertedCount + identicalCount === operations.length,
    completionReceiptState: receiptResult.state,
    completionReceiptInsertedCount: receiptResult.insertedCount,
    completionReceiptSkippedIdenticalCount: receiptResult.skippedIdenticalCount,
    lookupChunkSize: lookupSize,
    insertChunkSize: insertSize,
    completionReceiptWrittenLast: true,
    state: "HISTORICAL_INGEST_BATCH_PERSISTED",
    schemaVersion: "S2_HISTORICAL_BULK_PERSISTENCE_V0_1",
  });
}
