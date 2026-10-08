import assert from "node:assert/strict";

export const SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1=Object.freeze([
  "s2_historical_a1_segment_manifests",
  "s2_historical_segment_backfill_checkpoints",
  "s2_historical_segment_ingest_receipts",
]);

export const SYSTEM2_SEGMENT_REQUIRED_COLUMNS_V0_1=Object.freeze({
  s2_historical_a1_segment_manifests:Object.freeze([
    "market","symbol","year","month","price_space","object_key","object_sha256",
    "payload_hash","bar_count","segment_from_date","segment_to_date",
  ]),
  s2_historical_segment_backfill_checkpoints:Object.freeze([
    "batch_id","market","year","month","state","expected_pack_count",
    "object_ready_count","manifest_committed_count","rolling_hash",
  ]),
  s2_historical_segment_ingest_receipts:Object.freeze([
    "receipt_id","batch_id","market","year","month","pack_count","bar_count",
    "manifest_rolling_hash","completed_at","state",
  ]),
});

export async function verifySystem2SegmentSchemaReadonlyV0_1({db}={}){
  assert.ok(db && typeof db.rawQuery==="function","isolated System2 readonly D1 adapter required");
  assert.equal(db.database?.name,"system2-research","production and other D1 databases are prohibited");
  assert.equal(Number(db.metrics?.rowsWritten||0),0,"D1 must start with zero row writes");

  const meta=await db.rawQuery("SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1");
  assert.equal(meta[0]?.schema_value,"1.1","isolated System2 schema version must be 1.1");

  const placeholders=SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1.map(()=>"?").join(",");
  const found=await db.rawQuery(
    "SELECT name FROM sqlite_schema WHERE type='table' AND name IN ("+placeholders+") ORDER BY name",
    [...SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1],
  );
  const foundNames=new Set(found.map(row=>String(row.name)));
  const missingTables=SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1.filter(name=>!foundNames.has(name));
  assert.deepEqual(missingTables,[],"isolated D1 segmented schema not provisioned; use separate authorized migration workflow");

  const columnCounts={};
  for(const table of SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1){
    // table is from a constant allowlist; PRAGMA only reads schema metadata.
    const columns=await db.rawQuery("PRAGMA table_info("+table+")");
    const actual=new Set(columns.map(row=>String(row.name)));
    const missing=SYSTEM2_SEGMENT_REQUIRED_COLUMNS_V0_1[table].filter(name=>!actual.has(name));
    assert.deepEqual(missing,[],"required existing schema columns missing in "+table);
    columnCounts[table]=columns.length;
  }

  assert.equal(Number(db.metrics?.rowsWritten||0),0,"readonly segmented schema preflight must never write D1");
  return Object.freeze({
    result:"PASS_EXISTING_SEGMENT_SCHEMA_READONLY",
    databaseName:"system2-research",
    schemaVersion:"1.1",
    verifiedTables:[...SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1],
    columnCounts,
    readOnly:true,
    mutationPerformed:false,
    d1RowsWritten:0,
    system1RuntimeUsed:false,
    readyToResumeReceiptedMonths:true,
    schemaVersionTag:"S2_HISTORICAL_SEGMENT_EXISTING_SCHEMA_PREFLIGHT_V0_1",
  });
}
