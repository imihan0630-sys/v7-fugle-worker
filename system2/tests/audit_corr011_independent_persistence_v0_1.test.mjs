import assert from "node:assert/strict";
import { buildSystem2PersistenceBatch } from "../runtime/persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "../runtime/persistence_executor.mjs";

// AUDIT_LANE independently-authored dry-run DB. No Cloudflare/D1 network calls.
// This fixture intentionally doesn't import BUILD's persistence test mock.
class AuditDatabase {
  constructor({ mutateInsertedRow=null }={}){
    this.rows=new Map();this.prepareCount=0;this.batchCalls=0;this.executedSql=[];
    this.mutateInsertedRow=mutateInsertedRow;
  }
  prepare(sql){
    this.prepareCount++;
    const db=this;
    return {
      sql,params:[],
      bind(...params){this.params=params;return this;},
      async first(){
        const table=sql.match(/FROM\s+(s2_[A-Za-z0-9_]+)/i)?.[1];
        return table ? (db.rows.get(table+"|"+String(this.params[0]))??null) : null;
      },
    };
  }
  async batch(statements){
    this.batchCalls++;
    const results=[];
    for(const st of statements){
      this.executedSql.push(st.sql);
      const match=st.sql.match(/^INSERT INTO\s+(s2_[A-Za-z0-9_]+)\s*\(([^)]+)\)/i);
      if(!match)throw new Error("AUDIT: NON-INSERT EXECUTED");
      const table=match[1],cols=match[2].split(",").map(x=>x.trim());
      const row=Object.fromEntries(cols.map((x,i)=>[x,st.params[i]]));
      const id=table==="s2_source_session_receipts"?"receipt_id":
        table==="s2_decisions"?"decision_id":
        table==="s2_decision_corrections"?"correction_id":"receipt_id";
      const stored=this.mutateInsertedRow?this.mutateInsertedRow({...row}):row;
      this.rows.set(table+"|"+String(stored[id]),stored);
      results.push({success:true,meta:{changes:1,rows_written:1}});
    }
    return results;
  }
}
const row={
  receipt_id:"AUDIT-SS-01", market_date:"2026-10-09",
  decision_timestamp:"2026-10-09T07:30:00Z",
  source_session_state:"SOURCE_SESSION_READY",
};
const makeBatch=(records,id="AUDIT-B-011")=>buildSystem2PersistenceBatch({
  batchId:id,marketDate:"2026-10-09",
  decisionTimestamp:"2026-10-09T07:30:00Z",
  createdAt:"2026-10-09T07:31:00Z",records,
});
const batch=await makeBatch([{table:"s2_source_session_receipts",row}]);

async function pretransportBlocked(label,edit,error){
  const forged=structuredClone(batch);edit(forged);
  const db=new AuditDatabase();
  await assert.rejects(()=>executeSystem2PersistenceBatch({db,batch:forged}),error,label);
  assert.equal(db.prepareCount,0,label+" unexpectedly prepared SQL");
  assert.equal(db.batchCalls,0,label+" unexpectedly called db.batch");
}
await pretransportBlocked("AP-08 forged UPDATE",b=>{b.operations[0].sql.insertSql="UPDATE s2_decisions SET rank_value=999";},/PERSISTENCE_SQL_PLAN_MISMATCH|PERSISTENCE_BATCH/);
await pretransportBlocked("forged batch hash",b=>{b.batchHash="0".repeat(64);},/PERSISTENCE_BATCH_HASH_MISMATCH/);
await pretransportBlocked("forged row digest",b=>{b.operations[0].rowDigest="a".repeat(64);},/PERSISTENCE_ROW_DIGEST_MISMATCH/);
await pretransportBlocked("forged identity digest",b=>{b.operations[0].identityDigest="b".repeat(64);},/PERSISTENCE_IDENTITY_DIGEST_MISMATCH/);
await pretransportBlocked("forged table",b=>{b.operations[0].table="s2_decisions";},/PERSISTENCE_|missing identity column/);
await pretransportBlocked("forged column",b=>{b.operations[0].row.invalid_extra_column=1;},/not whitelisted/);

const clean=new AuditDatabase();
const inserted=await executeSystem2PersistenceBatch({db:clean,batch});
assert.equal(inserted.insertedCount,1);
assert.equal(inserted.statementLedger.postWriteReadbackCount,1);
assert.deepEqual(inserted.statementLedger.executedMutationKinds,["INSERT"]);
assert.ok(clean.executedSql.every(sql=>/^INSERT INTO s2_/.test(sql)));
const identical=await executeSystem2PersistenceBatch({db:clean,batch});
assert.equal(identical.skippedIdenticalCount,1);
assert.equal(clean.batchCalls,1);

const mutatedAfterWrite=new AuditDatabase({mutateInsertedRow:row=>({...row,source_session_state:"SOURCE_SESSION_INCOMPLETE"})});
await assert.rejects(()=>executeSystem2PersistenceBatch({db:mutatedAfterWrite,batch}),/POST_WRITE_VERIFICATION_FAILED/);
assert.equal(mutatedAfterWrite.batchCalls,1);

const decisionRow={
  decision_id:"AUDIT-D-01",factor_snapshot_id:"FS-DOES-NOT-EXIST",
  regime_snapshot_id:"R-DOES-NOT-EXIST",market_date:"2026-10-09",
  decision_timestamp:"2026-10-09T07:30:00Z",symbol:"2330",
  strategy_id:"SHORT_MOMENTUM",strategy_version:"AUDIT",
};
const childBatch=await makeBatch([{table:"s2_decisions",row:decisionRow}],"AUDIT-B-CHILD");
const missingParent=new AuditDatabase();
await assert.rejects(()=>executeSystem2PersistenceBatch({db:missingParent,batch:childBatch}),/LINEAGE_PARENT_MISSING/);
assert.equal(missingParent.batchCalls,0);

// A present-but-foreign factor parent must also fail before any insert.
const mismatch=new AuditDatabase();
mismatch.rows.set("s2_symbol_factor_snapshots|FS-DOES-NOT-EXIST",{
  snapshot_id:"FS-DOES-NOT-EXIST",symbol:"2317",market_date:"2026-10-09",
  decision_timestamp:"2026-10-09T07:30:00Z",regime_snapshot_id:"R-DOES-NOT-EXIST",
});
mismatch.rows.set("s2_market_regime_snapshots|R-DOES-NOT-EXIST",{
  regime_snapshot_id:"R-DOES-NOT-EXIST",market_date:"2026-10-09",
  decision_timestamp:"2026-10-09T07:30:00Z",
});
await assert.rejects(()=>executeSystem2PersistenceBatch({db:mismatch,batch:childBatch}),/LINEAGE_MISMATCH:decision-factor.symbol/);
assert.equal(mismatch.batchCalls,0);

console.log("AUDIT CORR-011 adversarial immutable persistence PASS");
console.log(JSON.stringify({pretransportNegativeCases:6,verifiedInsert:inserted.insertedCount,postWriteMismatchBlocked:true,missingParentBlocked:true,foreignParentBlocked:true,system1Changes:0}));
