import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  verifyS2FrozenOutcomeRevisionV0_1,
  toS2FrozenOutcomeRevisionRowV0_1,
} from "./outcome_revision_archive_v0_1.mjs";
import { toS2OutcomeRowV0_1, validateMonotonicOutcomeUpdateV0_1 }
  from "./outcome_tracker_v0_1.mjs";

// CORR-012 / F08 OFFLINE SQL CONTRACT. This function does not prepare/run
// SQL or grant account-wide D1 quota reservations. A future physical writer
// MUST be single-writer/quota-authorized and inspect RETURNING/readback.
export const S2_OUTCOME_CAS_APPEND_PLAN_VERSION_V0_1 =
  "S2_OUTCOME_ATOMIC_CAS_APPEND_SQL_PLAN_V0_1";
const TBL = "s2_outcome_revision_archive";
const EXPECTED_COLUMNS = Object.freeze([
  "revision_id","revision_hash","decision_id","decision_hash","strategy_id",
  "strategy_version","regime_snapshot_id","regime_hash","lineage_hash",
  "revision_number","previous_revision_hash","execution_hash","cost_model_hash",
  "cost_scenario_hash","outcome_hash","observed_at","outcome_json","receipt_json",
  "certified_performance","physical_pit_verified","final_selection_authorized",
  "schema_version",
]);
const literalEq=(a,b,code)=>{if(a!==b) throw new Error("F08_ATOMIC_APPEND_LINEAGE_MISMATCH:"+code);};

export async function buildS2F08ConditionalAppendPlanV0_1({
  receipt, previousReceipt = null, bindingName="SYSTEM2_DB",
} = {}) {
  if(bindingName!=="SYSTEM2_DB") throw new Error("F08_FORBIDDEN_D1_BINDING");
  await verifyS2FrozenOutcomeRevisionV0_1(receipt);
  const row=await toS2FrozenOutcomeRevisionRowV0_1(receipt);
  if(JSON.stringify(Object.keys(row))!==JSON.stringify(EXPECTED_COLUMNS)) {
    throw new Error("F08_ARCHIVE_COLUMN_CONTRACT_CHANGED");
  }
  // This enforces the immutable, non-authoritative research-only flags.
  for(const c of ["certified_performance","physical_pit_verified","final_selection_authorized"]) {
    if(row[c]!==0) throw new Error("F08_UNAUTHORIZED_CERTIFICATION:"+c);
  }
  if(receipt.revisionNumber===1 && previousReceipt!==null)
    throw new Error("F08_GENESIS_PREDECESSOR_FORBIDDEN");
  if(receipt.revisionNumber>1) {
    if(!previousReceipt) throw new Error("F08_PREVIOUS_RECEIPT_REQUIRED");
    await verifyS2FrozenOutcomeRevisionV0_1(previousReceipt);
    literalEq(receipt.previousRevisionHash,previousReceipt.revisionHash,"previousHash");
    literalEq(receipt.lineageHash,previousReceipt.lineageHash,"lineageHash");
    literalEq(receipt.parentLineage.decisionId,
      previousReceipt.parentLineage.decisionId,"decisionId");
    literalEq(receipt.revisionNumber,previousReceipt.revisionNumber+1,"revisionNumber");
    const maturity=validateMonotonicOutcomeUpdateV0_1(
      toS2OutcomeRowV0_1(previousReceipt.outcome),
      toS2OutcomeRowV0_1(receipt.outcome),
    );
    if(!maturity.updateAllowed)
      throw new Error("F08_NON_MONOTONIC_OUTCOME:"+maturity.blockers.join("|"));
    if(!(Date.parse(receipt.outcome.updatedAt)>Date.parse(previousReceipt.outcome.updatedAt)))
      throw new Error("F08_OUTCOME_CLOCK_NOT_ADVANCED");
  }
  const parent=receipt.parentLineage;
  const columns=EXPECTED_COLUMNS.join(", ");
  const values=EXPECTED_COLUMNS.map(()=>"?").join(", ");
  const parentSql=`EXISTS (
    SELECT 1 FROM s2_decisions d
    JOIN s2_market_regime_snapshots r
      ON r.regime_snapshot_id = d.regime_snapshot_id
    WHERE d.decision_id = ? AND d.decision_hash = ?
      AND d.strategy_id = ? AND d.strategy_version = ? AND d.symbol = ?
      AND d.market_date = ? AND d.decision_timestamp = ?
      AND d.regime_snapshot_id = ? AND r.snapshot_hash = ?
      AND r.market_date = ? AND r.decision_timestamp = ?
  )`;
  const parentParams=[
    parent.decisionId,parent.decisionHash,
    parent.strategyId,parent.strategyVersion,parent.symbol,
    parent.marketDate,parent.decisionTimestamp,
    parent.regimeSnapshotId,parent.regimeHash,
    parent.marketDate,parent.decisionTimestamp,
  ];
  let predecessorSql, predecessorParams;
  if(receipt.revisionNumber===1) {
    predecessorSql=`NOT EXISTS (
      SELECT 1 FROM ${TBL}
      WHERE decision_id = ? AND lineage_hash = ?
    )`;
    predecessorParams=[row.decision_id,row.lineage_hash];
  } else {
    const prev=await toS2FrozenOutcomeRevisionRowV0_1(previousReceipt);
    predecessorSql=`EXISTS (
      SELECT 1 FROM ${TBL} p
      WHERE p.revision_id = ? AND p.revision_hash = ?
        AND p.decision_id = ? AND p.lineage_hash = ?
        AND p.revision_number = ? AND p.receipt_json = ?
        AND p.outcome_json = ?
    ) AND NOT EXISTS (
      SELECT 1 FROM ${TBL}
      WHERE decision_id = ? AND lineage_hash = ? AND revision_number >= ?
    )`;
    predecessorParams=[
      prev.revision_id,prev.revision_hash,prev.decision_id,prev.lineage_hash,
      prev.revision_number,prev.receipt_json,prev.outcome_json,
      row.decision_id,row.lineage_hash,row.revision_number,
    ];
  }
  // One SQLite statement, so parent and predecessor existence checks and
  // insertion share the same statement snapshot. Explicitly no OR IGNORE/
  // ON CONFLICT DO UPDATE/REPLACE; row-count 0 is NOT a successful commit.
  const sql=`INSERT INTO ${TBL} (${columns})
  SELECT ${values}
  WHERE ${parentSql} AND ${predecessorSql}
  RETURNING revision_id, revision_hash, decision_id, lineage_hash, revision_number`;
  const params=[
    ...EXPECTED_COLUMNS.map(c=>row[c]),...parentParams,...predecessorParams,
  ];
  const proof={
    schemaVersion:S2_OUTCOME_CAS_APPEND_PLAN_VERSION_V0_1,
    revisionId:row.revision_id,revisionHash:row.revision_hash,
    decisionId:row.decision_id,lineageHash:row.lineage_hash,
    revisionNumber:row.revision_number,
    targetBinding:bindingName,
    statementType:"INSERT_SELECT_COMPARE_AND_SWAP_RETURNING",
    parentIdentityCheckedInStatement:true,
    predecessorCheckedInStatement:true,
    noInPlaceMutation:true,
    sql,params,
    paramCount:params.length,
    physicalExecution:false,physicalReadbackVerified:false,
    accountQuotaGranted:false,quotaEvidenceAttached:false,
    liveSelectionEnabled:false,capitalImpact:false,realOrders:false,
    system1FormalCoreImpact:false,
    zeroAffectedRowsMeaning:"REJECT_OR_RECHECK_NOT_CERTIFIED_IDEMPOTENCE",
  };
  return deepFreeze({...proof,planHash:await sha256Hex(proof)});
}
// CORR-012 / F08 isolated payload-integrity stage. This inspector cannot
// attest that the supplied rows came from physical D1; the future quota-gated
// writer must separately attest the actual SQL execution and physical readback.
// A zero-row CAS response is NEVER successful or silently idempotent.
export async function verifyS2F08ConditionalAppendReadbackPayloadV0_1({
  plan, receipt, previousReceipt = null, returnedRows, readbackRows,
} = {}) {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    throw new Error("F08_READBACK_PLAN_REQUIRED");
  }
  // Reconstruct from the immutable outcome inputs; a caller-created planHash
  // does not authorize arbitrary SQL or accidentally changed parameters.
  const canonical = await buildS2F08ConditionalAppendPlanV0_1({
    receipt, previousReceipt, bindingName:"SYSTEM2_DB",
  });
  if (plan.planHash !== canonical.planHash ||
      plan.sql !== canonical.sql ||
      JSON.stringify(plan.params) !== JSON.stringify(canonical.params) ||
      plan.targetBinding !== "SYSTEM2_DB") {
    throw new Error("F08_READBACK_PLAN_NOT_CANONICAL");
  }
  if (!Array.isArray(returnedRows) || returnedRows.length !== 1) {
    throw new Error("F08_READBACK_CAS_RETURNING_NOT_EXACTLY_ONE");
  }
  const expectedRow = await toS2FrozenOutcomeRevisionRowV0_1(receipt);
  const returned = returnedRows[0];
  const returningKeys = ["revision_id","revision_hash","decision_id","lineage_hash","revision_number"];
  if (!returned || typeof returned !== "object" || Array.isArray(returned) ||
      JSON.stringify(Object.keys(returned).sort()) !==
        JSON.stringify([...returningKeys].sort())) {
    throw new Error("F08_READBACK_RETURNING_SHAPE_MISMATCH");
  }
  for (const key of returningKeys) {
    if (returned[key] !== expectedRow[key]) {
      throw new Error("F08_READBACK_RETURNING_IDENTITY_MISMATCH:"+key);
    }
  }
  if (!Array.isArray(readbackRows) || readbackRows.length !== 1) {
    throw new Error("F08_READBACK_PERSISTED_NOT_EXACTLY_ONE");
  }
  const observed = readbackRows[0];
  if (!observed || typeof observed !== "object" || Array.isArray(observed) ||
      JSON.stringify(Object.keys(observed).sort()) !==
        JSON.stringify([...EXPECTED_COLUMNS].sort())) {
    throw new Error("F08_READBACK_PERSISTED_SHAPE_MISMATCH");
  }
  for (const key of EXPECTED_COLUMNS) {
    if (observed[key] !== expectedRow[key]) {
      throw new Error("F08_READBACK_PERSISTED_VALUE_MISMATCH:"+key);
    }
  }
  const query = {
    sql:"SELECT "+EXPECTED_COLUMNS.join(", ")+" FROM "+TBL+
      " WHERE revision_id = ? AND revision_hash = ? AND decision_id = ?"+
      " AND lineage_hash = ? AND revision_number = ?",
    params:returningKeys.map(key=>expectedRow[key]),
  };
  // All booleans remain false even when synthetic/stubbed readback is equal.
  // Independent cloud transport, quota receipt and PIT/source attestation
  // cannot be produced from this pure function or its hash.
  const result = {
    schemaVersion:"S2_F08_CAS_READBACK_PAYLOAD_INSPECTION_V0_1",
    status:"PAYLOAD_MATCH_UNCERTIFIED_PHYSICAL",
    planHash:canonical.planHash,
    revisionHash:expectedRow.revision_hash,
    checkedColumns:EXPECTED_COLUMNS.length,
    returnCount:1,readbackCount:1,
    exactReadbackQuery:query,
    physicalExecutionVerified:false,
    physicalReadbackVerified:false,
    accountQuotaGranted:false,
    pitSourceIndependentlyAuthenticated:false,
    f08C3Accepted:false,
    system1FormalCoreImpact:false,
    finalSelectionEnabled:false,
  };
  return deepFreeze({...result,inspectionHash:await sha256Hex(result)});
}
// F08 / CORR-012: inspect a WHOLE caller-supplied revision-chain readback,
// not just the latest row. The bounded query is a future reader contract only;
// this function performs ZERO D1/Cloudflare operations or physical attestation.
// No snapshot may be declared complete because a synthetic chain was matched.
export async function auditS2F08RevisionChainReadbackV0_1({
  receiptChain, readbackRows, bindingName = "SYSTEM2_DB", maxRevisions = 100,
} = {}) {
  if (bindingName !== "SYSTEM2_DB") throw new Error("F08_CHAIN_FORBIDDEN_BINDING");
  if (!Number.isSafeInteger(maxRevisions) || maxRevisions < 1 || maxRevisions > 1000)
    throw new Error("F08_CHAIN_UNSAFE_BOUNDED_LIMIT");
  if (!Array.isArray(receiptChain) || receiptChain.length === 0 ||
      receiptChain.length > maxRevisions)
    throw new Error("F08_CHAIN_EXPECTED_RECEIPTS_INVALID_OR_OVERSIZE");
  if (!Array.isArray(readbackRows) || readbackRows.length === 0 ||
      readbackRows.length > maxRevisions)
    throw new Error("F08_CHAIN_READBACK_INCOMPLETE_OR_LIMIT_OVERFLOW");
  // Missing, duplicate, unrecognized and extra rows never get dropped to
  // manufacture a fully observed time series or a clean zero outcome.
  if (receiptChain.length !== readbackRows.length)
    throw new Error("F08_CHAIN_READBACK_COUNT_MISMATCH");
  const first = receiptChain[0];
  if (first?.revisionNumber !== 1 || first.previousRevisionHash !== null)
    throw new Error("F08_CHAIN_GENESIS_REQUIRED");
  const seen = new Set();
  let prev = null;
  let previousUpdatedAt = -Infinity;
  for (let i = 0; i < receiptChain.length; i++) {
    const receipt = receiptChain[i];
    if (!receipt || receipt.revisionNumber !== i + 1)
      throw new Error("F08_CHAIN_GAP_OR_REORDERED_RECEIPT");
    if (receipt.lineageHash !== first.lineageHash ||
        receipt.parentLineage?.decisionId !== first.parentLineage?.decisionId)
      throw new Error("F08_CHAIN_PARENT_OR_LINEAGE_SWITCH");
    if (seen.has(receipt.revisionHash))
      throw new Error("F08_CHAIN_DUPLICATE_REVISION");
    seen.add(receipt.revisionHash);
    // Recalculate immutable hashes and reapply the exact atomic CAS
    // predecessor/maturity policy; do NOT trust caller-provided version flags.
    await buildS2F08ConditionalAppendPlanV0_1({
      receipt, previousReceipt:prev, bindingName,
    });
    const row = await toS2FrozenOutcomeRevisionRowV0_1(receipt);
    const observed = readbackRows[i];
    if (!observed || typeof observed !== "object" || Array.isArray(observed) ||
        JSON.stringify(Object.keys(observed).sort()) !==
          JSON.stringify([...EXPECTED_COLUMNS].sort()))
      throw new Error("F08_CHAIN_READBACK_COLUMN_SHAPE_INVALID");
    for (const col of EXPECTED_COLUMNS) {
      if (observed[col] !== row[col])
        throw new Error("F08_CHAIN_STORED_REVISION_MISMATCH:"+col);
    }
    // The exact database query must be ordered. Out-of-order readback is
    // not re-sorted because sorting could hide a broken source contract.
    if (observed.revision_number !== i + 1)
      throw new Error("F08_CHAIN_UNORDERED_DB_RESULT");
    const currentClock = Date.parse(receipt.outcome.updatedAt);
    if (!Number.isFinite(currentClock) || currentClock <= previousUpdatedAt)
      throw new Error("F08_CHAIN_NON_MONOTONIC_CLOCK");
    previousUpdatedAt = currentClock;
    prev = receipt;
  }
  const sql = "SELECT "+EXPECTED_COLUMNS.join(", ")+
    " FROM "+TBL+" WHERE decision_id = ? AND lineage_hash = ?"+
    " ORDER BY revision_number ASC LIMIT ?";
  const readbackPlan = {
    sql,
    params:[first.parentLineage.decisionId,first.lineageHash,maxRevisions + 1],
    overflowRule:"FAIL_IF_RETURNED_MORE_THAN_MAX_OR_COUNT_DIFFERS",
  };
  const base = {
    schemaVersion:"S2_F08_REVISION_CHAIN_READBACK_INSPECTION_V0_1",
    status:"OFFLINE_CHAIN_MATCH_NOT_PHYSICAL_CERTIFICATION",
    decisionId:first.parentLineage.decisionId,
    lineageHash:first.lineageHash,
    revisionCount:receiptChain.length,
    genesisHash:first.revisionHash,
    observedTipHash:prev.revisionHash,
    exactBoundedReadbackPlan:readbackPlan,
    structuralChainChecked:true,
    physicalD1ReadbackVerified:false,
    physicalD1WriteAuthorized:false,
    accountWideQuotaGranted:false,
    sourcePITIndependentlyVerified:false,
    chainCompleteInPhysicalD1:false,
    simulatedPerformanceCertified:false,
    selectionAuthorized:false,
    system1FormalCoreImpact:false,
  };
  return deepFreeze({...base,auditHash:await sha256Hex(base)});
}
