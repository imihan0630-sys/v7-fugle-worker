import assert from "node:assert/strict";
import { verifyHistoricalSegmentReceiptV0_1 } from "./historical_segmented_cold_store_v0_1.mjs";

const MONTHS=Object.freeze([7,8,9]);
const MONTH_PREFIX="S2-HIST-SEGMENT-MONTH|TWSE|2026|";
const HASH=/^[a-f0-9]{64}$/;

export async function auditTwse2026JulSepPhysicalReadonlyV0_1({
  db,objectStore,onMonth=()=>{},verifyReceipt=verifyHistoricalSegmentReceiptV0_1,
}={}){
  assert.equal(db?.database?.name,"system2-research","isolated System2 D1 required");
  assert.equal(db?.metrics?.rowsWritten,0,"D1 writes must be zero before physical read");
  assert.equal(objectStore?.backend,"CLOUDFLARE_R2_S3","isolated R2 adapter required");
  const readonlyDb={
    metrics:db.metrics,
    prepare(sql){
      assert.match(String(sql),/^\s*SELECT\b/i,"D1 mutation forbidden");
      return db.prepare(sql);
    },
    rawQuery(){throw Error("D1 unknown query forbidden");},
    batch(){throw Error("D1 mutation forbidden");},
  };
  const readonlyStore={
    backend:objectStore.backend,bucketName:objectStore.bucketName,
    head:key=>objectStore.head(key),
    get:key=>objectStore.get(key),
    putIfAbsent(){throw Error("R2 write forbidden");},
  };
  const months=[];
  for(const month of MONTHS){
    const batchId=MONTH_PREFIX+String(month).padStart(2,"0");
    const receipt=await readonlyDb.prepare(
      "SELECT * FROM s2_historical_segment_ingest_receipts WHERE batch_id=? LIMIT 1"
    ).bind(batchId).first();
    assert.ok(receipt&&receipt.state==="COMPLETE","missing COMPLETE monthly receipt: "+batchId);
    assert.equal(receipt.batch_id,batchId);
    assert.equal(receipt.market,"TWSE");
    assert.equal(Number(receipt.year),2026);
    assert.equal(Number(receipt.month),month);
    assert.ok(HASH.test(receipt.manifest_rolling_hash),"invalid rolling hash");
    assert.equal(receipt.receipt_id,"S2HSR-"+receipt.manifest_rolling_hash,"receipt/hash mismatch");
    const checkpoint=await readonlyDb.prepare(
      "SELECT * FROM s2_historical_segment_backfill_checkpoints WHERE batch_id=? LIMIT 1"
    ).bind(batchId).first();
    assert.equal(checkpoint?.state,"COMPLETE","incomplete checkpoint: "+batchId);
    assert.equal(checkpoint.rolling_hash,receipt.manifest_rolling_hash);
    for(const key of ["expected_pack_count","object_ready_count","manifest_committed_count","next_pack_index"])
      assert.equal(Number(checkpoint[key]),Number(receipt.pack_count),"checkpoint pack mismatch: "+key);
    assert.equal(Number(checkpoint.expected_bar_count),Number(receipt.bar_count));
    assert.ok(Number(receipt.pack_count)>300&&Number(receipt.bar_count)>1000,"month unexpectedly small");
    const proof=await verifyReceipt({db:readonlyDb,objectStore:readonlyStore,receipt});
    assert.equal(proof.state,"VERIFIED");
    assert.equal(proof.receiptId,receipt.receipt_id);
    assert.equal(proof.manifestRollingHash,receipt.manifest_rolling_hash);
    assert.equal(proof.headObjectCountVerified,Number(receipt.pack_count));
    assert.equal(proof.byteGetObjectCountVerified,Number(receipt.pack_count));
    assert.equal(proof.barCount,Number(receipt.bar_count));
    assert.equal(db.metrics.rowsWritten,0,"D1 mutation discovered during verification");
    const item=Object.freeze({
      market:"TWSE",year:2026,month,batchId,
      receiptId:receipt.receipt_id,manifestRollingHash:receipt.manifest_rolling_hash,
      packCount:Number(receipt.pack_count),barCount:Number(receipt.bar_count),
      r2HeadVerified:proof.headObjectCountVerified,
      r2FullByteSha256Verified:proof.byteGetObjectCountVerified,
      state:"PASS_INDEPENDENT_R2_HEAD_BYTES_AND_D1_MANIFEST",
      historicalFirstKnownAtProven:false,
    });
    months.push(item);
    await onMonth(item);
  }
  return Object.freeze({
    schemaVersion:"S2_TWSE2026_JUL_SEP_INDEPENDENT_PHYSICAL_READONLY_V0_1",
    result:"PASS_INDEPENDENT_JUL_SEP_R2_D1_READBACK",
    market:"TWSE",year:2026,verifiedMonths:Object.freeze([...MONTHS]),
    months:Object.freeze(months),
    r2FullByteVerifiedObjects:months.reduce((sum,m)=>sum+m.r2FullByteSha256Verified,0),
    d1RowsWritten:0,r2ObjectsWritten:0,
    historicSourceFirstKnownAtCertified:false,sourceReconciliationPerformed:false,
    corporateActionNoEventCertified:false,technicalContinuityCertified:false,
    marketYearReplayPromoted:false,ncT01PromotionAuthorized:false,
    system1RuntimeUsed:false,
  });
}
