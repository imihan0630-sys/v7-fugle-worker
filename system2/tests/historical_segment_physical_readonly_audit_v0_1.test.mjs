import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { auditSegmentMonthsReadonlyV0_1 } from "../runtime/historical_segment_physical_readonly_audit_v0_1.mjs";

const batchId="S2-HIST-SEGMENT-MONTH|TWSE|2026|01";
function mockDb({status="COMPLETE",hash="h",writeCount=0}={}){
  const queries=[];
  const receipt={
    batch_id:batchId,receipt_id:"S2HSR-test",state:status,
    market:"TWSE",year:2026,month:1,pack_count:2,bar_count:9,
    manifest_rolling_hash:"h",completed_at:"2026-10-08T06:59:08Z",
  };
  const checkpoint={
    batch_id:batchId,state:"COMPLETE",rolling_hash:hash,
    expected_pack_count:2,expected_bar_count:9,object_ready_count:2,
    manifest_committed_count:2,next_pack_index:2,
  };
  return {
    database:{name:"system2-research"},metrics:{rowsWritten:writeCount},queries,
    prepare(sql){
      queries.push(sql);
      return {bind(id){
        assert.equal(id,batchId);
        return {async first(){
          return sql.includes("s2_historical_segment_ingest_receipts")?receipt:checkpoint;
        }};
      }};
    },
  };
}
const store={
  backend:"CLOUDFLARE_R2_S3",bucketName:"system2-historical-research",
  async head(){return null;},async get(){return null;},
};
const verifier=async ({db,objectStore,receipt})=>{
  assert.throws(()=>db.prepare("INSERT INTO s2_historical_a1_segment_manifests VALUES(1)"),/mutation forbidden/);
  assert.throws(()=>db.batch([]),/mutation forbidden/);
  assert.throws(()=>objectStore.putIfAbsent("x",new Uint8Array()),/R2 write forbidden/);
  assert.equal(receipt.batch_id,batchId);
  return {
    state:"VERIFIED",receiptId:receipt.receipt_id,packCount:2,barCount:9,
    headObjectCountVerified:2,byteGetObjectCountVerified:2,manifestRollingHash:"h",
  };
};
const db=mockDb();
const success=await auditSegmentMonthsReadonlyV0_1({
  db,objectStore:store,months:[1],verifyReceipt:verifier,
});
assert.equal(success.result,"PASS_2026_TWSE_SEGMENT_PHYSICAL_READONLY");
assert.equal(success.verifiedMonthCount,1);
assert.equal(success.r2ObjectCount,2);
assert.equal(success.barCount,9);
assert.equal(success.d1RowsWritten,0);
assert.equal(success.sourceReconciliationPerformed,false);
assert.equal(success.pitObservationClockCertified,false);
assert.equal(db.queries.length,2);
assert.equal(db.queries.every(x=>/^\s*SELECT\b/i.test(x)),true);

await assert.rejects(()=>auditSegmentMonthsReadonlyV0_1({
  db:mockDb({status:"IN_PROGRESS"}),objectStore:store,months:[1],verifyReceipt:verifier,
}),/missing immutable/);
await assert.rejects(()=>auditSegmentMonthsReadonlyV0_1({
  db:mockDb({hash:"tampered"}),objectStore:store,months:[1],verifyReceipt:verifier,
}));
await assert.rejects(()=>auditSegmentMonthsReadonlyV0_1({
  db:mockDb({writeCount:1}),objectStore:store,months:[1],verifyReceipt:verifier,
}));
await assert.rejects(()=>auditSegmentMonthsReadonlyV0_1({
  db:mockDb(),objectStore:store,months:[1,1],verifyReceipt:verifier,
}),/duplicate/);
await assert.rejects(()=>auditSegmentMonthsReadonlyV0_1({
  db:mockDb(),objectStore:store,months:[7],verifyReceipt:verifier,
}));
await assert.rejects(()=>auditSegmentMonthsReadonlyV0_1({
  db:mockDb(),objectStore:store,months:[1],
  verifyReceipt:async()=>({...await verifier({
    db:{prepare:()=>{throw new Error("unused")},batch:()=>{throw new Error("unused")}},
    objectStore:{putIfAbsent:()=>{throw new Error("unused")}},
    receipt:{batch_id:batchId,receipt_id:"S2HSR-test"},
  }),byteGetObjectCountVerified:1}),
}));

const workflow=await readFile(
  new URL("../../.github/workflows/system2-2026-twse-segment-physical-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(
  new URL("../scripts/audit_2026_twse_segments_physical_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(workflow,/group: system2-2026-twse-segment-physical-readonly/);
assert.match(workflow,/audit_2026_twse_segments_physical_readonly_v0_1\.mjs/);
assert.match(workflow,/permissions:\s*\n\s+contents: read/);
assert.doesNotMatch(workflow,/provision_system2_d1\.mjs|wrangler.*deploy|CREATE_SYSTEM2_ISOLATED_D1/);
assert.match(runner,/auditSegmentMonthsReadonlyV0_1/);
assert.doesNotMatch(runner,/\.batch\s*\(|\.run\s*\(/);
console.log("System2 2026 TWSE read-only physical audit tests passed");
