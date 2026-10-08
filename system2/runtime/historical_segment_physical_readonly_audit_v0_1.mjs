import assert from "node:assert/strict";
import { verifyHistoricalSegmentReceiptV0_1 } from "./historical_segmented_cold_store_v0_1.mjs";

export async function auditSegmentMonthsReadonlyV0_1({
  db,objectStore,months=[1,2,3,4,5,6],onMonth=()=>{},verifyReceipt=verifyHistoricalSegmentReceiptV0_1,
}={}){
  assert.equal(db?.database?.name,"system2-research","isolated D1 required");
  assert.equal(db?.metrics?.rowsWritten,0,"pre-existing D1 writes prohibited");
  assert.equal(objectStore?.backend,"CLOUDFLARE_R2_S3","physical R2 remote adapter required");
  assert.ok(Array.isArray(months)&&months.length>=1&&months.length<=6);
  assert.ok(months.every(m=>Number.isInteger(m)&&m>=1&&m<=6));
  assert.equal(new Set(months).size,months.length,"duplicate months forbidden");
  const readonlyDb={
    metrics:db.metrics,
    prepare(sql){
      assert.match(String(sql),/^\s*SELECT\b/i,"D1 mutation forbidden");
      return db.prepare(sql);
    },
    batch(){throw new Error("D1 mutation forbidden");},
  };
  const readonlyStore={
    backend:objectStore.backend,bucketName:objectStore.bucketName,
    head:key=>objectStore.head(key),get:key=>objectStore.get(key),
    putIfAbsent(){throw new Error("R2 write forbidden");},
  };
  const verified=[];
  for(const month of months){
    const batchId="S2-HIST-SEGMENT-MONTH|TWSE|2026|"+String(month).padStart(2,"0");
    const receipt=await readonlyDb.prepare(
      "SELECT * FROM s2_historical_segment_ingest_receipts WHERE batch_id=? LIMIT 1"
    ).bind(batchId).first();
    assert.ok(receipt && receipt.state==="COMPLETE","missing immutable COMPLETE receipt: "+batchId);
    assert.equal(receipt.batch_id,batchId);
    const checkpoint=await readonlyDb.prepare(
      "SELECT * FROM s2_historical_segment_backfill_checkpoints WHERE batch_id=? LIMIT 1"
    ).bind(batchId).first();
    assert.equal(checkpoint?.state,"COMPLETE","checkpoint incomplete: "+batchId);
    assert.equal(checkpoint.rolling_hash,receipt.manifest_rolling_hash);
    for(const key of ["expected_pack_count","object_ready_count","manifest_committed_count","next_pack_index"])
      assert.equal(Number(checkpoint[key]),Number(receipt.pack_count));
    assert.equal(Number(checkpoint.expected_bar_count),Number(receipt.bar_count));
    const proof=await verifyReceipt({db:readonlyDb,objectStore:readonlyStore,receipt});
    assert.equal(proof.state,"VERIFIED");
    assert.equal(proof.receiptId,receipt.receipt_id);
    assert.equal(proof.manifestRollingHash,receipt.manifest_rolling_hash);
    assert.equal(proof.headObjectCountVerified,Number(receipt.pack_count));
    assert.equal(proof.byteGetObjectCountVerified,Number(receipt.pack_count));
    assert.equal(proof.barCount,Number(receipt.bar_count));
    assert.equal(db.metrics.rowsWritten,0,"D1 write boundary broken");
    const item=Object.freeze({
      market:"TWSE",year:2026,month,batchId,receiptId:receipt.receipt_id,
      packCount:Number(receipt.pack_count),barCount:Number(receipt.bar_count),
      headObjectCountVerified:proof.headObjectCountVerified,
      byteGetObjectCountVerified:proof.byteGetObjectCountVerified,
      rollingHash:proof.manifestRollingHash,
      physicalState:"PASS_R2_HEAD_SHA256_AND_D1_MANIFEST",
      historicalPITObservationClockProven:false,
      originalReceiptCompletedAt:receipt.completed_at,
    });
    verified.push(item);
    await onMonth(item);
  }
  return Object.freeze({
    result:"PASS_2026_TWSE_SEGMENT_PHYSICAL_READONLY",
    verifiedMonths:Object.freeze([...months]),months:Object.freeze(verified),
    verifiedMonthCount:verified.length,
    r2ObjectCount:verified.reduce((sum,v)=>sum+v.packCount,0),
    barCount:verified.reduce((sum,v)=>sum+v.barCount,0),
    d1RowsWritten:0,r2ObjectsWritten:0,mutationPerformed:false,
    system1RuntimeUsed:false,sourceReconciliationPerformed:false,
    replayReadinessPromoted:false,pitObservationClockCertified:false,
    schemaVersion:"S2_2026_TWSE_SEGMENT_PHYSICAL_READONLY_V0_1",
  });
}
