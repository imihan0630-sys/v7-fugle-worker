import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import {
  readHistoricalColdReceiptV0_1,
  verifyHistoricalColdReceiptV0_1,
} from "../runtime/historical_cold_pack_store_v0_1.mjs";
import { materializeHistoricalA1PackRowsV0_1 } from "../runtime/historical_pack_store_v0_1.mjs";
import {
  fetchOfficialHistoricalA1DateV0_1,
  officialHistoricalA1SourceContractV0_1,
} from "../runtime/official_historical_a1_source_v0_1.mjs";
import { reconcileHistoricalSourceRowsV0_1 } from "../runtime/historical_source_reconciliation_v0_1.mjs";
import { buildHistoricalStoreIngestBatch } from "../runtime/historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "../runtime/historical_bulk_persistence_v0_1.mjs";
import { evaluateHistoricalRevisionLineageV0_1 } from "../runtime/historical_revision_lineage_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const r2AccessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const r2SecretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const r2Bucket=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const outputPath=String(process.env.SYSTEM2_HISTORY_REVISION_OUTPUT||"").trim();
const requestedYear=Number(process.env.SYSTEM2_HISTORY_YEAR||2021);
const requestedMarket=String(process.env.SYSTEM2_HISTORY_YEAR_MARKET||"TPEX").trim();
const targetDate="2021-01-14";
const market="TPEX";
const year=2021;
const annualBatchId="S2-HIST-PACK-YEAR|TPEX|2021";
const baselineBatchId="S2-HIST-REV-LINEAGE|TPEX|2021-01-14|BASELINE";
const revisionBatchId="S2-HIST-REV-LINEAGE|TPEX|2021-01-14|REVISION-1";
const observedAt=new Date().toISOString();

assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.ok(r2AccessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(r2SecretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.equal(requestedYear,2021,"revision overlay is bounded to year=2021");
assert.equal(requestedMarket,"TPEX","revision overlay is bounded to market=TPEX");

function sha256Bytes(bytes){
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}
function key(row){
  return String(row?.marketDate||"")+"|"+String(row?.symbol||"");
}
function chunks(values,size){
  const out=[];
  for(let i=0;i<values.length;i+=size)out.push(values.slice(i,i+size));
  return out;
}
function maxTimestamp(values,fallback){
  const valid=values.filter((x)=>x&&Number.isFinite(Date.parse(x)));
  if(!valid.length)return fallback;
  return valid.sort((a,b)=>Date.parse(a)-Date.parse(b)).at(-1);
}
function minTimestamp(values,fallback){
  const valid=values.filter((x)=>x&&Number.isFinite(Date.parse(x)));
  if(!valid.length)return fallback;
  return valid.sort((a,b)=>Date.parse(a)-Date.parse(b))[0];
}

const db=await createRemoteD1RestAdapter({
  accountId,apiToken,databaseName:"system2-research",
});
const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId:r2AccessKeyId,secretAccessKey:r2SecretAccessKey,bucketName:r2Bucket,
});
const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1"
);
assert.equal(schema[0]?.schema_value,"1.1","isolated D1 must be schema 1.1");

const receipt=await readHistoricalColdReceiptV0_1({db,batchId:annualBatchId});
assert.ok(receipt,"2021 TPEx annual cold receipt is required");
assert.equal(receipt.state,"COMPLETE","2021 TPEx annual cold receipt must be COMPLETE");
const headVerification=await verifyHistoricalColdReceiptV0_1({db,objectStore,receipt});
assert.equal(headVerification.state,"VERIFIED","2021 TPEx annual cold receipt HEAD verification failed");

const manifests=await db.rawQuery(
  "SELECT * FROM s2_historical_a1_pack_manifests WHERE market='TPEX' AND year=2021 AND price_space='RAW' ORDER BY symbol"
);
assert.equal(manifests.length,Number(receipt.pack_count),"2021 TPEx manifest count mismatch");

const baselineRows=[];
let objectByteHashVerified=0;
for(const part of chunks(manifests,25)){
  const loaded=await Promise.all(part.map(async(manifest)=>{
    const object=await objectStore.get(manifest.object_key);
    assert.ok(object,"R2 object missing: "+manifest.object_key);
    assert.equal(sha256Bytes(object.bytes),manifest.object_sha256,"R2 object byte hash mismatch: "+manifest.object_key);
    const pack={
      packId:manifest.pack_id,market:manifest.market,symbol:manifest.symbol,year:manifest.year,
      priceSpace:manifest.price_space,firstMarketDate:manifest.first_market_date,lastMarketDate:manifest.last_market_date,
      barCount:manifest.bar_count,payloadHash:manifest.payload_hash,
      gzipBase64:Buffer.from(object.bytes).toString("base64"),
      capturedAt:manifest.captured_at,schemaVersion:manifest.pack_schema_version,
    };
    const materialized=await materializeHistoricalA1PackRowsV0_1({pack});
    objectByteHashVerified+=1;
    return materialized.rows.filter((row)=>row.marketDate===targetDate);
  }));
  for(const rows of loaded)baselineRows.push(...rows);
}
assert.equal(objectByteHashVerified,manifests.length,"not all R2 object bytes were verified");
assert.ok(baselineRows.length>700,"2021-01-14 TPEx cold baseline unexpectedly sparse");

const fresh=await fetchOfficialHistoricalA1DateV0_1({
  market,marketDate:targetDate,observedAt,
});
assert.equal(fresh.state,"READY","fresh 2021-01-14 TPEx source must be READY");

const reconciliation=reconcileHistoricalSourceRowsV0_1({
  coldRows:baselineRows,
  freshOfficialRows:fresh.rows,
  sampleLimit:1000,
});
assert.equal(reconciliation.missingFromColdCount,0,"revision overlay refuses missing cold rows");
assert.equal(reconciliation.absentFromFreshOfficialCount,0,"revision overlay refuses rows absent from fresh official source");
assert.equal(reconciliation.sourceRowHashMismatchCount,780,
  "2021 TPEx revision signature changed: expected 780 source-row revisions");
assert.equal(reconciliation.canonicalA1ValueMismatchCount,698,
  "2021 TPEx revision signature changed: expected 698 canonical A1 revisions");
assert.equal(reconciliation.sourceRevisionOnlyCount,82,
  "2021 TPEx revision signature changed: expected 82 source-only revisions");
assert.equal(reconciliation.sourceRevisionDateCount,1,
  "2021 TPEx revision overlay expects exactly one revised market date");
assert.equal(reconciliation.sourceRevisionByDate?.[0]?.marketDate,targetDate,
  "2021 TPEx revision date changed from the frozen blocker date");
assert.equal(reconciliation.sourceRevisionByDate?.[0]?.count,780,
  "2021 TPEx revision-date count changed from the frozen blocker signature");

const changedKeys=new Set([
  ...reconciliation.sourceRowHashMismatchSample,
  ...reconciliation.canonicalA1ValueMismatchSample.map((x)=>x.key),
]);
assert.equal(changedKeys.size,reconciliation.sourceRowHashMismatchCount,
  "revision overlay requires every canonical change to be represented by source-row revision identity");

const persistedBefore=await db.rawQuery(
  "SELECT * FROM s2_historical_a1_bars WHERE market='TPEX' AND market_date=? AND price_space='RAW' ORDER BY canonical_key, available_at, observed_at, bar_hash",
  [targetDate],
);
const preLineage=evaluateHistoricalRevisionLineageV0_1({
  coldRows:baselineRows,
  freshOfficialRows:fresh.rows,
  persistedRows:persistedBefore,
  sampleLimit:1000,
});

const existingRevisionReceipt=await db.rawQuery(
  "SELECT batch_id, captured_at, batch_hash, row_count FROM s2_historical_ingest_batches WHERE batch_id=? LIMIT 1",
  [revisionBatchId],
);
if(existingRevisionReceipt.length&&preLineage.state!=="PIT_REVISION_LINEAGE_READY"){
  throw new Error("EXISTING_REVISION_RECEIPT_DOES_NOT_COVER_CURRENT_OFFICIAL_REVISION");
}

let baselinePersistence=null;
let revisionPersistence=null;
const freshByKey=new Map(fresh.rows.map((row)=>[key(row),row]));
const partialRevisionTimes=[...new Set(
  persistedBefore
    .filter((row)=>{
      const freshRow=freshByKey.get(String(row.market_date||"")+"|"+String(row.symbol||""));
      return freshRow
        && changedKeys.has(String(row.market_date||"")+"|"+String(row.symbol||""))
        && String(row.availability_basis||"")==="PROSPECTIVE_OBSERVATION"
        && String(row.source_row_hash||"")===String(freshRow.sourceRowHash||"")
        && row.available_at
        && Number.isFinite(Date.parse(row.available_at));
    })
    .map((row)=>String(row.available_at))
)];
assert.ok(partialRevisionTimes.length<=1,
  "multiple partial revision availability timestamps found; refusing to create another revision version");
let revisionFirstKnownAt=existingRevisionReceipt[0]?.captured_at
  || minTimestamp(partialRevisionTimes,observedAt);

if(preLineage.state!=="PIT_REVISION_LINEAGE_READY"){
  const existingBaselineReceipt=await db.rawQuery(
    "SELECT batch_id, captured_at FROM s2_historical_ingest_batches WHERE batch_id=? LIMIT 1",
    [baselineBatchId],
  );
  const baselineCapturedAt=existingBaselineReceipt[0]?.captured_at
    || maxTimestamp(baselineRows.map((x)=>x.capturedAt),observedAt);

  const sourceContract=officialHistoricalA1SourceContractV0_1("TPEX");
  const baselineBatch=await buildHistoricalStoreIngestBatch({
    batchId:baselineBatchId,
    datasetLane:"CORE_2017_PLUS",
    sourceId:sourceContract.sourceId,
    sourceName:sourceContract.sourceName,
    sourceUrl:sourceContract.sourceUrl,
    capturedAt:baselineCapturedAt,
    rows:baselineRows,
  });
  baselinePersistence=await executeHistoricalIngestBatchBulkV0_1({
    db,ingestBatch:baselineBatch,lookupChunkSize:80,insertChunkSize:80,
  });

  const freshChanged=fresh.rows
    .filter((row)=>changedKeys.has(key(row)))
    .map((row)=>({
      ...row,
      observedAt:revisionFirstKnownAt,
      availableAt:revisionFirstKnownAt,
      availabilityBasis:"PROSPECTIVE_OBSERVATION",
    }));
  assert.equal(freshChanged.length,changedKeys.size,"fresh revision row coverage mismatch");

  const revisionBatch=await buildHistoricalStoreIngestBatch({
    batchId:revisionBatchId,
    datasetLane:"CORE_2017_PLUS",
    sourceId:sourceContract.sourceId,
    sourceName:sourceContract.sourceName,
    sourceUrl:sourceContract.sourceUrl,
    capturedAt:revisionFirstKnownAt,
    rows:freshChanged,
  });
  revisionPersistence=await executeHistoricalIngestBatchBulkV0_1({
    db,ingestBatch:revisionBatch,lookupChunkSize:80,insertChunkSize:80,
  });
}

const persistedAfter=await db.rawQuery(
  "SELECT * FROM s2_historical_a1_bars WHERE market='TPEX' AND market_date=? AND price_space='RAW' ORDER BY canonical_key, available_at, observed_at, bar_hash",
  [targetDate],
);
const lineage=evaluateHistoricalRevisionLineageV0_1({
  coldRows:baselineRows,
  freshOfficialRows:fresh.rows,
  persistedRows:persistedAfter,
  sampleLimit:1000,
});
assert.equal(lineage.state,"PIT_REVISION_LINEAGE_READY","2021 TPEx revision lineage remains blocked");
assert.equal(lineage.changedKeyCount,changedKeys.size,"revision lineage changed-key coverage mismatch");
assert.equal(lineage.readyKeyCount,changedKeys.size,"not every changed key is PIT lineage ready");

const output={
  result:"PASS_TPEX_2021_REVISION_LINEAGE",
  market,year,targetDate,
  annualColdReceipt:{
    receiptId:receipt.receipt_id,
    packCount:Number(receipt.pack_count),
    barCount:Number(receipt.bar_count),
    headObjectCountVerified:headVerification.objectCountVerified,
    byteGetObjectCountVerified:objectByteHashVerified,
  },
  sourceReconciliation:{
    coldRowCount:baselineRows.length,
    freshOfficialRowCount:fresh.rows.length,
    missingFromColdCount:reconciliation.missingFromColdCount,
    absentFromFreshOfficialCount:reconciliation.absentFromFreshOfficialCount,
    sourceRowHashMismatchCount:reconciliation.sourceRowHashMismatchCount,
    canonicalA1ValueMismatchCount:reconciliation.canonicalA1ValueMismatchCount,
    sourceRevisionOnlyCount:reconciliation.sourceRevisionOnlyCount,
    sourceVersionState:reconciliation.sourceVersionState,
  },
  overlay:{
    baselineBatchId,
    revisionBatchId,
    revisionFirstKnownAt,
    partialRevisionResumeTimestamp:partialRevisionTimes[0]||null,
    preExistingLineageState:preLineage.state,
    baselinePersistence,
    revisionPersistence,
    persistedRowCountAfter:persistedAfter.length,
  },
  lineage,
  d1UsageObservedThisRun:{
    requestCount:db.metrics.requestCount,
    rowsRead:db.metrics.rowsRead,
    rowsWritten:db.metrics.rowsWritten,
    latestSizeAfterBytes:db.metrics.latestSizeAfter,
  },
  coldHistoryMutated:false,
  system1RuntimeChanged:false,
  schemaVersion:"S2_HISTORICAL_TPEX_2021_REVISION_OVERLAY_V0_1",
};
const json=JSON.stringify(output,null,2);
if(outputPath)await writeFile(outputPath,json+"\n","utf8");
console.log(json);
