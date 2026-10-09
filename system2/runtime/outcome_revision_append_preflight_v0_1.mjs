import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import {
  verifyS2FrozenOutcomeRevisionV0_1,
  toS2FrozenOutcomeRevisionRowV0_1,
} from "./outcome_revision_archive_v0_1.mjs";

// F08 / CORR-012 — READ-ONLY preparation, NOT a Cloudflare D1 writer.
// A status of READY_FOR_ATOMIC_WRITER_REVALIDATION does not grant write
// authorization or account-wide quota reservation. A future writer MUST
// revalidate parents and chain in the same atomic/single-writer boundary.
export const S2_OUTCOME_APPEND_PREFLIGHT_VERSION_V0_1 =
  "S2_OUTCOME_APPEND_PARENT_READBACK_PREFLIGHT_V0_1";

const SELECT_DECISION =
  "SELECT decision_id, decision_hash, strategy_id, strategy_version, symbol, market_date, decision_timestamp, regime_snapshot_id FROM s2_decisions WHERE decision_id = ? LIMIT 1";
const SELECT_REGIME =
  "SELECT regime_snapshot_id, snapshot_hash, market_date, decision_timestamp FROM s2_market_regime_snapshots WHERE regime_snapshot_id = ? LIMIT 1";
const SELECT_REVISION_BY_ID =
  "SELECT * FROM s2_outcome_revision_archive WHERE revision_id = ? LIMIT 1";
const SELECT_REVISION_BY_ORDINAL =
  "SELECT * FROM s2_outcome_revision_archive WHERE decision_id = ? AND lineage_hash = ? AND revision_number = ? LIMIT 1";
const SELECT_PREVIOUS_BY_HASH =
  "SELECT * FROM s2_outcome_revision_archive WHERE revision_hash = ? LIMIT 1";

function equal(a,b,code) {
  if (a !== b) throw new Error("OUTCOME_APPEND_PARENT_MISMATCH:" + code);
}
function requiredDb(db) {
  if (!db || typeof db.prepare !== "function") {
    throw new Error("OUTCOME_APPEND_ISOLATED_READONLY_DB_REQUIRED");
  }
}
async function selectOne(db, sql, params, ledger) {
  ledger.push({ sql, parametersCount: params.length });
  const st = db.prepare(sql).bind(...params);
  if (typeof st.first !== "function") {
    throw new Error("OUTCOME_APPEND_READONLY_FIRST_REQUIRED");
  }
  return (await st.first()) ?? null;
}
function projectRow(row, model) {
  return Object.fromEntries(Object.keys(model).map(key => [key, row?.[key] ?? null]));
}
async function verifyStoredRevision(row, code) {
  if (!row) return null;
  let receipt;
  try { receipt = JSON.parse(row.receipt_json); }
  catch { throw new Error("OUTCOME_APPEND_STORED_RECEIPT_INVALID:" + code); }
  await verifyS2FrozenOutcomeRevisionV0_1(receipt);
  const expected = await toS2FrozenOutcomeRevisionRowV0_1(receipt);
  if (canonicalStringify(projectRow(row, expected)) !== canonicalStringify(expected)) {
    throw new Error("OUTCOME_APPEND_STORED_SCALAR_CONFLICT:" + code);
  }
  return receipt;
}
function fixedFlags() {
  return {
    physicalWriteExecuted: false,
    writeAuthorization: false,
    costReservationVerified: false,
    finalFrozen: false,
    certifiedPerformance: false,
    authorizesFinalSelection: false,
    system1FormalCoreImpact: false,
    realOrders: false,
    livePush: false,
    capitalImpact: false,
  };
}
export async function inspectS2OutcomeRevisionAppendV0_1({
  db, receipt, bindingName = "SYSTEM2_DB",
} = {}) {
  requiredDb(db);
  if (bindingName !== "SYSTEM2_DB") {
    throw new Error("OUTCOME_APPEND_FORBIDDEN_BINDING");
  }
  await verifyS2FrozenOutcomeRevisionV0_1(receipt);
  const row = await toS2FrozenOutcomeRevisionRowV0_1(receipt);
  const l = receipt.parentLineage;
  const queries = [];

  const decision = await selectOne(db,SELECT_DECISION,[l.decisionId],queries);
  if (!decision) throw new Error("OUTCOME_APPEND_DECISION_PARENT_MISSING");
  for (const [key, dbName, expected] of [
    ["decisionId", "decision_id", l.decisionId],
    ["decisionHash", "decision_hash", l.decisionHash],
    ["strategyId", "strategy_id", l.strategyId],
    ["strategyVersion", "strategy_version", l.strategyVersion],
    ["symbol", "symbol", l.symbol],
    ["marketDate", "market_date", l.marketDate],
    ["decisionTimestamp", "decision_timestamp", l.decisionTimestamp],
    ["regimeSnapshotId", "regime_snapshot_id", l.regimeSnapshotId],
  ]) equal(decision[dbName],expected,"decision." + key);

  const regime = await selectOne(db,SELECT_REGIME,[l.regimeSnapshotId],queries);
  if (!regime) throw new Error("OUTCOME_APPEND_REGIME_PARENT_MISSING");
  for (const [key, dbName, expected] of [
    ["regimeSnapshotId","regime_snapshot_id",l.regimeSnapshotId],
    ["regimeHash","snapshot_hash",l.regimeHash],
    ["marketDate","market_date",l.marketDate],
    ["decisionTimestamp","decision_timestamp",l.decisionTimestamp],
  ]) equal(regime[dbName],expected,"regime." + key);

  // Check exact identity as well as composite lineage ordinal; the latter
  // refuses a different payload inserted at the same deterministic position.
  const existingById = await selectOne(db,SELECT_REVISION_BY_ID,[row.revision_id],queries);
  const ordinal = await selectOne(db,SELECT_REVISION_BY_ORDINAL,[
    row.decision_id,row.lineage_hash,row.revision_number,
  ],queries);
  if (existingById && !ordinal) throw new Error("OUTCOME_APPEND_ORDINAL_INDEX_INCONSISTENT");
  if (ordinal && !existingById) throw new Error("OUTCOME_APPEND_REVISION_ID_CONFLICT");
  if (existingById && ordinal && existingById.revision_id !== ordinal.revision_id) {
    throw new Error("OUTCOME_APPEND_IDENTITY_ORDINAL_CONFLICT");
  }

  let expectedPrior = null;
  if (receipt.revisionNumber > 1) {
    const prevRow = await selectOne(db,SELECT_PREVIOUS_BY_HASH,
      [receipt.previousRevisionHash],queries);
    if (!prevRow) throw new Error("OUTCOME_APPEND_PREVIOUS_REVISION_MISSING");
    expectedPrior = await verifyStoredRevision(prevRow,"PREVIOUS");
    equal(expectedPrior.revisionHash,receipt.previousRevisionHash,"previous.revisionHash");
    equal(expectedPrior.lineageHash,receipt.lineageHash,"previous.lineageHash");
    equal(expectedPrior.revisionNumber + 1,receipt.revisionNumber,"previous.revisionNumber");
    equal(expectedPrior.parentLineage.decisionId,l.decisionId,"previous.decisionId");
  }

  if (existingById) {
    const old = await verifyStoredRevision(existingById,"EXISTING");
    equal(old.revisionHash,receipt.revisionHash,"existing.revisionHash");
    if (canonicalStringify(projectRow(existingById,row)) !== canonicalStringify(row)) {
      throw new Error("OUTCOME_APPEND_EXISTING_CONFLICT");
    }
  }

  const state = existingById ? "ALREADY_PRESENT_IDENTICAL"
    : "READY_FOR_ATOMIC_WRITER_REVALIDATION";
  const base = {
    schemaVersion:S2_OUTCOME_APPEND_PREFLIGHT_VERSION_V0_1,
    revisionId:receipt.revisionId,
    revisionHash:receipt.revisionHash,
    lineageHash:receipt.lineageHash,
    revisionNumber:receipt.revisionNumber,
    targetBindingName:bindingName,
    preflightState:state,
    readStatementCount:queries.length,
    readonlyQueries:Object.freeze(queries),
    sourceIntegrity:"PARENT_D1_HASH_READBACK_ONLY_NOT_EXTERNAL_PIT_AUTHENTICATION",
    concurrencyBoundary:"RECHECK_INSIDE_FUTURE_ATOMIC_APPEND_TRANSACTION_REQUIRED",
    ...fixedFlags(),
  };
  return deepFreeze({...base,preflightHash:await sha256Hex(base)});
}
