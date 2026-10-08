import assert from "node:assert/strict";
import { buildSystem2PersistenceBatch } from "../runtime/persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "../runtime/persistence_executor.mjs";

// Standalone AUDIT_LANE AP-08 acceptance test. No Cloudflare credentials or live database.
class MockDatabase {
  constructor({corruptPostWrite=false}={}){
    this.rows=new Map();
    this.prepareCount=0;
    this.batchCalls=0;
    this.executedSql=[];
    this.corruptPostWrite=corruptPostWrite;
  }
  prepare(sql){
    this.prepareCount++;
    const db=this;
    const stmt={
      sql,params:[],
      bind(...xs){this.params=xs;return this;},
      async first(){
        const table=sql.match(/FROM\s+(s2_[a-z0-9_]+)/i)?.[1];
        if(!table)return null;
        return db.rows.get(table+"|"+this.params[0])??null;
      },
      async all(){const row=await this.first();return {results:row?[row]:[]};},
    };
    return stmt;
  }
  async batch(stmts){
    this.batchCalls++;
    const results=[];
    for(const stmt of stmts){
      this.executedSql.push(stmt.sql);
      const match=stmt.sql.match(/^INSERT INTO\s+(s2_[a-z0-9_]+)\s*\(([^)]+)\)/i);
      assert.ok(match,"Only generated INSERT SQL may execute");
      const table=match[1];
      const columns=match[2].split(",").map(x=>x.trim());
      const row=Object.fromEntries(columns.map((name,i)=>[name,stmt.params[i]]));
      const key=table==="s2_source_session_receipts"?"receipt_id":null;
      assert.ok(key,"Independent fixture only writes source-session receipts");
      if(this.corruptPostWrite)row.source_session_state="SOURCE_SESSION_INCOMPLETE";
      this.rows.set(table+"|"+row[key],row);
      results.push({success:true,meta:{changes:1,rows_written:1}});
    }
    return results;
  }
}
const row={
  receipt_id:"AUDIT-CORR011-R1",
  market_date:"2026-10-08",
  decision_timestamp:"2026-10-08T07:30:00Z",
  source_session_state:"SOURCE_SESSION_READY",
};
const batch=await buildSystem2PersistenceBatch({
  batchId:"AUDIT-CORR011-BATCH",
  marketDate:"2026-10-08",
  decisionTimestamp:"2026-10-08T07:30:00Z",
  createdAt:"2026-10-08T07:31:00Z",
  records:[{table:"s2_source_session_receipts",row}],
});
const copy=()=>JSON.parse(JSON.stringify(batch));

async function assertRefusedBeforeTransport(fixture,needle){
  const db=new MockDatabase();
  await assert.rejects(
    ()=>executeSystem2PersistenceBatch({db,batch:fixture}),
    needle,
  );
  assert.equal(db.prepareCount,0,"Never prepare before validating caller-provided batch");
  assert.equal(db.batchCalls,0,"Never execute batch before canonical verification");
}
const updateSql=copy();
updateSql.operations[0].sql.insertSql="UPDATE s2_decisions SET symbol='9999' WHERE decision_id='FOREIGN'";
updateSql.operations[0].sql.insertParams=[];
await assertRefusedBeforeTransport(updateSql,/PERSISTENCE_SQL_PLAN_MISMATCH|PERSISTENCE_BATCH_CANONICAL_MISMATCH/);

const deleteSql=copy();
deleteSql.operations[0].sql.insertSql="DELETE FROM s2_decisions";
await assertRefusedBeforeTransport(deleteSql,/PERSISTENCE_/);

const tamperBatch=copy();
tamperBatch.batchHash="a".repeat(64);
await assertRefusedBeforeTransport(tamperBatch,/PERSISTENCE_BATCH_HASH_MISMATCH/);

const tamperRow=copy();
tamperRow.operations[0].rowDigest="b".repeat(64);
await assertRefusedBeforeTransport(tamperRow,/PERSISTENCE_ROW_DIGEST_MISMATCH|PERSISTENCE_BATCH_CANONICAL_MISMATCH/);

const extraField=copy();
extraField.operations[0].row.unauthorized_column="unsafe";
await assertRefusedBeforeTransport(extraField,/column is not whitelisted|PERSISTENCE_/);

// Positive path must use generated INSERT, then verify via exact post-write readback.
const clean=new MockDatabase();
const applied=await executeSystem2PersistenceBatch({db:clean,batch});
assert.equal(applied.insertedCount,1);
assert.equal(applied.statementLedger.verifiedInsertedRowCount,1);
assert.equal(clean.batchCalls,1);
assert.ok(clean.executedSql.every(x=>/^INSERT INTO\s+s2_source_session_receipts\b/i.test(x)));
assert.deepEqual(applied.statementLedger.executedMutationKinds,["INSERT"]);
assert.equal(clean.rows.get("s2_source_session_receipts|AUDIT-CORR011-R1").source_session_state,"SOURCE_SESSION_READY");

// Fake success from a database that stored different bytes must never count as immutable success.
const corrupt=new MockDatabase({corruptPostWrite:true});
await assert.rejects(
  ()=>executeSystem2PersistenceBatch({db:corrupt,batch}),
  /POST_WRITE_VERIFICATION_FAILED/,
);
assert.equal(corrupt.batchCalls,1);
console.log("AUDIT CORR-011 independent AP-08 and post-write counterexamples PASS");
console.log(JSON.stringify({negativePreTransportCases:5,positiveImmutableInsertVerified:true,postWriteTamperRejected:true}));
