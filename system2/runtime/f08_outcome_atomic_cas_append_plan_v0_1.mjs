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
