import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { materializeHistoricalA1PackRowsV0_1 } from "./historical_pack_store_v0_1.mjs";
import {
  assertHistoricalColdObjectStoreV0_1,
  historicalPackObjectKeyV0_1,
} from "./historical_cold_object_store_v0_1.mjs";

export const HISTORICAL_SEGMENTED_COLD_STORE_VERSION = "0.1-RESEARCH";

function requiredText(value,field){
  if(typeof value!=="string"||!value.trim()) throw new Error(field+" is required");
  return value.trim();
}
function integer(value,field,{min=0,max=999999}={}){
  const n=Number(value);
  if(!Number.isInteger(n)||n<min||n>max) throw new Error(field+" must be integer "+min+".."+max);
  return n;
}
function split(values,size){
  const out=[];
  for(let i=0;i<values.length;i+=size) out.push(values.slice(i,i+size));
  return out;
}
function bytesSha256(bytes){return createHash("sha256").update(Buffer.from(bytes)).digest("hex");}
function monthKey(year,month){return String(year)+"-"+String(month).padStart(2,"0");}
function logicalKey(row){return [row.market,row.symbol,Number(row.year),Number(row.month),row.price_space].join("|");}

function packBytes(pack){
  const bytes=Buffer.from(requiredText(pack.gzipBase64,"pack.gzipBase64"),"base64");
  if(bytes.byteLength!==Number(pack.gzipBytes)) throw new Error("historical segment gzip size mismatch");
  const objectSha256=pack.objectSha256||bytesSha256(bytes);
  if(bytesSha256(bytes)!==objectSha256) throw new Error("historical segment object hash mismatch");
  return {bytes,objectSha256};
}
function validateSegmentPack(pack,{market,year,month,segmentFromDate,segmentToDate}){
  if(pack.market!==market||Number(pack.year)!==year) throw new Error("segment pack market/year mismatch");
  const ym=monthKey(year,month);
  if(!String(pack.firstMarketDate||"").startsWith(ym+"-")||!String(pack.lastMarketDate||"").startsWith(ym+"-")){
    throw new Error("segment pack escaped calendar month");
  }
  if(pack.firstMarketDate<segmentFromDate||pack.lastMarketDate>segmentToDate){
    throw new Error("segment pack escaped segment boundaries");
  }
}
async function manifestCore(pack,objectStore,objectKey,objectSha256,segment){
  validateSegmentPack(pack,segment);
  const segmentManifestId="S2HSM-"+await sha256Hex({
    market:segment.market,symbol:pack.symbol,year:segment.year,month:segment.month,
    priceSpace:pack.priceSpace,payloadHash:pack.payloadHash,
  });
  return {
    segment_manifest_id:segmentManifestId,
    pack_id:requiredText(pack.packId,"pack.packId"),
    market:requiredText(pack.market,"pack.market"),
    symbol:requiredText(pack.symbol,"pack.symbol"),
    year:Number(pack.year),
    month:segment.month,
    price_space:requiredText(pack.priceSpace,"pack.priceSpace"),
    segment_from_date:segment.segmentFromDate,
    segment_to_date:segment.segmentToDate,
    first_market_date:requiredText(pack.firstMarketDate,"pack.firstMarketDate"),
    last_market_date:requiredText(pack.lastMarketDate,"pack.lastMarketDate"),
    bar_count:integer(pack.barCount,"pack.barCount"),
    source_id:pack.sourceId||null,
    source_name:pack.sourceName||null,
    availability_policy:"SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    payload_hash:requiredText(pack.payloadHash,"pack.payloadHash"),
    object_sha256:requiredText(objectSha256,"objectSha256"),
    payload_json_bytes:integer(pack.payloadJsonBytes,"pack.payloadJsonBytes"),
    gzip_bytes:integer(pack.gzipBytes,"pack.gzipBytes"),
    object_backend:requiredText(objectStore.backend,"objectStore.backend"),
    object_bucket:requiredText(objectStore.bucketName,"objectStore.bucketName"),
    object_key:requiredText(objectKey,"objectKey"),
    captured_at:requiredText(pack.capturedAt,"pack.capturedAt"),
    pack_schema_version:requiredText(pack.schemaVersion,"pack.schemaVersion"),
    schema_version:"S2_HISTORICAL_A1_SEGMENT_MANIFEST_V0_1",
  };
}
const IMMUTABLE_FIELDS=[
  "segment_manifest_id","pack_id","market","symbol","year","month","price_space",
  "segment_from_date","segment_to_date","first_market_date","last_market_date","bar_count",
  "source_id","source_name","availability_policy","payload_hash","object_sha256",
  "payload_json_bytes","gzip_bytes","object_backend","object_bucket","object_key",
  "pack_schema_version","schema_version",
];
function equalManifest(a,b){
  return IMMUTABLE_FIELDS.every((field)=>String(a?.[field]??"")===String(b?.[field]??""));
}
function assertObjectHead(object,core){
  if(!object) throw new Error("COLD_OBJECT_MISSING: "+core.object_key);
  if(Number(object.size)!==Number(core.gzip_bytes)) throw new Error("IMMUTABLE_CONFLICT segment object size: "+core.object_key);
  const meta=object.customMetadata||{};
  if(meta["payload-hash"]&&meta["payload-hash"]!==core.payload_hash) throw new Error("IMMUTABLE_CONFLICT segment payload hash: "+core.object_key);
  if(meta["object-sha256"]&&meta["object-sha256"]!==core.object_sha256) throw new Error("IMMUTABLE_CONFLICT segment object sha256 metadata: "+core.object_key);
}
async function ensureObject(objectStore,core,bytes){
  let object=await objectStore.head(core.object_key);
  if(object){assertObjectHead(object,core);return {object,state:"IDENTICAL_OBJECT"};}
  object=await objectStore.putIfAbsent(core.object_key,bytes,{
    contentType:"application/gzip",
    sha256:core.object_sha256,
    storageClass:"Standard",
    customMetadata:{
      "payload-hash":core.payload_hash,
      "object-sha256":core.object_sha256,
      "pack-schema":core.pack_schema_version,
      "segment-month":String(core.year)+"-"+String(core.month).padStart(2,"0"),
    },
  });
  if(!object) object=await objectStore.head(core.object_key);
  assertObjectHead(object,core);
  return {object,state:"INSERTED_OBJECT"};
}
function manifestRow(core,object){
  return {...core,
    object_etag:object.etag||null,object_version:object.version||null,
    storage_class:object.storageClass||null,object_uploaded_at:object.uploadedAt||null,
  };
}
function insertManifest(db,row){
  return db.prepare(`INSERT INTO s2_historical_a1_segment_manifests (
    segment_manifest_id,pack_id,market,symbol,year,month,price_space,segment_from_date,segment_to_date,
    first_market_date,last_market_date,bar_count,source_id,source_name,availability_policy,payload_hash,
    object_sha256,payload_json_bytes,gzip_bytes,object_backend,object_bucket,object_key,object_etag,
    object_version,storage_class,object_uploaded_at,captured_at,pack_schema_version,schema_version
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    row.segment_manifest_id,row.pack_id,row.market,row.symbol,row.year,row.month,row.price_space,
    row.segment_from_date,row.segment_to_date,row.first_market_date,row.last_market_date,row.bar_count,
    row.source_id,row.source_name,row.availability_policy,row.payload_hash,row.object_sha256,
    row.payload_json_bytes,row.gzip_bytes,row.object_backend,row.object_bucket,row.object_key,
    row.object_etag,row.object_version,row.storage_class,row.object_uploaded_at,row.captured_at,
    row.pack_schema_version,row.schema_version,
  );
}
async function loadManifestMap(db,cores){
  const out=new Map();
  const groups=new Map();
  for(const row of cores){
    const key=[row.market,row.year,row.month,row.price_space].join("|");
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(row);
  }
  for(const [key,members] of groups){
    const [market,year,month,priceSpace]=key.split("|");
    for(const part of split(members,80)){
      const symbols=part.map((x)=>x.symbol);
      const result=await db.prepare(
        "SELECT * FROM s2_historical_a1_segment_manifests WHERE market=? AND year=? AND month=? AND price_space=? AND symbol IN ("+
        symbols.map(()=>"?").join(",")+")"
      ).bind(market,Number(year),Number(month),priceSpace,...symbols).all();
      for(const row of result?.results||[]) out.set(logicalKey(row),row);
    }
  }
  return out;
}
async function writeCheckpoint(db,row){
  await db.prepare(`INSERT INTO s2_historical_segment_backfill_checkpoints (
    checkpoint_id,batch_id,market,year,month,expected_pack_count,expected_bar_count,object_ready_count,
    manifest_committed_count,next_pack_index,rolling_hash,state,updated_at,schema_version
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(batch_id) DO UPDATE SET
    object_ready_count=excluded.object_ready_count,
    manifest_committed_count=excluded.manifest_committed_count,
    next_pack_index=excluded.next_pack_index,
    rolling_hash=excluded.rolling_hash,
    state=excluded.state,
    updated_at=excluded.updated_at,
    schema_version=excluded.schema_version`).bind(
    row.checkpoint_id,row.batch_id,row.market,row.year,row.month,row.expected_pack_count,row.expected_bar_count,
    row.object_ready_count,row.manifest_committed_count,row.next_pack_index,row.rolling_hash,row.state,
    row.updated_at,row.schema_version,
  ).run();
}
function receiptMatches(receipt,expected){
  const fields=["batch_id","market","year","month","pack_count","bar_count","payload_json_bytes","gzip_bytes",
    "first_market_date","last_market_date","manifest_rolling_hash","state","schema_version"];
  return fields.every((field)=>String(receipt?.[field]??"")===String(expected?.[field]??""));
}

export async function readHistoricalSegmentReceiptV0_1({db,batchId}={}){
  if(!db||typeof db.prepare!=="function") throw new Error("isolated System2 database adapter is required");
  return await db.prepare("SELECT * FROM s2_historical_segment_ingest_receipts WHERE batch_id=? LIMIT 1")
    .bind(requiredText(batchId,"batchId")).first();
}

export async function verifyHistoricalSegmentReceiptV0_1({db,objectStore,receipt}={}){
  if(!db||typeof db.prepare!=="function") throw new Error("isolated System2 database adapter is required");
  const store=assertHistoricalColdObjectStoreV0_1(objectStore);
  if(!receipt||receipt.state!=="COMPLETE") throw new Error("complete historical segment receipt is required");
  const result=await db.prepare(`SELECT * FROM s2_historical_a1_segment_manifests
    WHERE market=? AND year=? AND month=? AND price_space='RAW' ORDER BY symbol ASC`)
    .bind(receipt.market,Number(receipt.year),Number(receipt.month)).all();
  const manifests=result?.results||[];
  const barCount=manifests.reduce((sum,row)=>sum+Number(row.bar_count),0);
  const payloadJsonBytes=manifests.reduce((sum,row)=>sum+Number(row.payload_json_bytes),0);
  const gzipBytes=manifests.reduce((sum,row)=>sum+Number(row.gzip_bytes),0);
  if(manifests.length!==Number(receipt.pack_count)||barCount!==Number(receipt.bar_count)
    ||payloadJsonBytes!==Number(receipt.payload_json_bytes)||gzipBytes!==Number(receipt.gzip_bytes)){
    throw new Error("IMMUTABLE_CONFLICT completed historical segment receipt aggregate: "+receipt.batch_id);
  }
  const rollingHash=await sha256Hex({
    batchId:receipt.batch_id,
    manifests:manifests.map((row)=>({
      segmentManifestId:row.segment_manifest_id,packId:row.pack_id,payloadHash:row.payload_hash,
      objectSha256:row.object_sha256,objectKey:row.object_key,
    })),
  });
  if(rollingHash!==receipt.manifest_rolling_hash) throw new Error("IMMUTABLE_CONFLICT historical segment rolling hash: "+receipt.batch_id);
  let headVerified=0,byteVerified=0;
  for(const part of split(manifests,25)){
    await Promise.all(part.map(async(manifest)=>{
      const head=await store.head(manifest.object_key);
      assertObjectHead(head,manifest); headVerified+=1;
      const object=await store.get(manifest.object_key);
      if(!object) throw new Error("COLD_OBJECT_MISSING: "+manifest.object_key);
      if(bytesSha256(object.bytes)!==manifest.object_sha256) throw new Error("historical segment object byte sha256 mismatch: "+manifest.object_key);
      byteVerified+=1;
    }));
  }
  return deepFreeze({
    receiptId:receipt.receipt_id,batchId:receipt.batch_id,market:receipt.market,
    year:Number(receipt.year),month:Number(receipt.month),packCount:manifests.length,barCount,
    headObjectCountVerified:headVerified,byteGetObjectCountVerified:byteVerified,
    manifestRollingHash:rollingHash,state:"VERIFIED",
    schemaVersion:"S2_HISTORICAL_SEGMENT_RECEIPT_VERIFICATION_V0_1",
  });
}

export async function executeHistoricalSegmentPackSetV0_1({
  db,objectStore,packSet,batchId,capturedAt,market,year,month,segmentFromDate,segmentToDate,chunkSize=25,
}={}){
  if(!db||typeof db.prepare!=="function"||typeof db.batch!=="function") throw new Error("isolated System2 database adapter with batch() is required");
  const store=assertHistoricalColdObjectStoreV0_1(objectStore);
  if(!packSet||packSet.schemaVersion!=="S2_HISTORICAL_A1_PACK_SET_RESEARCH_V0_1") throw new Error("valid historical pack set is required");
  if(!Number.isInteger(chunkSize)||chunkSize<1||chunkSize>100) throw new Error("chunkSize must be 1..100");
  const mkt=requiredText(market,"market");
  if(!["TWSE","TPEX"].includes(mkt)) throw new Error("market must be TWSE or TPEX");
  const yr=integer(year,"year",{min:2017,max:2100});
  const mon=integer(month,"month",{min:1,max:12});
  const from=requiredText(segmentFromDate,"segmentFromDate"),to=requiredText(segmentToDate,"segmentToDate");
  const ym=monthKey(yr,mon);
  if(!from.startsWith(ym+"-")||!to.startsWith(ym+"-")||to<from) throw new Error("segment boundaries must stay within selected month");
  const completedAt=requiredText(capturedAt,"capturedAt");
  const id=requiredText(batchId,"batchId");
  if(!packSet.packs.length) throw new Error("historical segment pack set cannot be empty");

  const segment={market:mkt,year:yr,month:mon,segmentFromDate:from,segmentToDate:to};
  const prepared=[];
  for(const pack of packSet.packs){
    const objectKey=historicalPackObjectKeyV0_1(pack);
    const decoded=packBytes(pack);
    const core=await manifestCore(pack,store,objectKey,decoded.objectSha256,segment);
    prepared.push({pack,objectKey,bytes:decoded.bytes,core});
  }
  const rollingHash=await sha256Hex({
    batchId:id,
    manifests:prepared.map(({core})=>({
      segmentManifestId:core.segment_manifest_id,packId:core.pack_id,payloadHash:core.payload_hash,
      objectSha256:core.object_sha256,objectKey:core.object_key,
    })),
  });
  const firstMarketDate=prepared.map(({core})=>core.first_market_date).sort()[0];
  const lastMarketDate=prepared.map(({core})=>core.last_market_date).sort().at(-1);
  const expectedReceipt={
    batch_id:id,market:mkt,year:yr,month:mon,pack_count:packSet.packCount,bar_count:packSet.barCount,
    payload_json_bytes:packSet.payloadJsonBytes,gzip_bytes:packSet.gzipBytes,
    first_market_date:firstMarketDate,last_market_date:lastMarketDate,manifest_rolling_hash:rollingHash,
    state:"COMPLETE",schema_version:"S2_HISTORICAL_SEGMENT_INGEST_RECEIPT_V0_1",
  };

  const prior=await readHistoricalSegmentReceiptV0_1({db,batchId:id});
  if(prior){
    if(!receiptMatches(prior,expectedReceipt)) throw new Error("IMMUTABLE_CONFLICT historical segment receipt: "+id);
    const verification=await verifyHistoricalSegmentReceiptV0_1({db,objectStore:store,receipt:prior});
    return deepFreeze({
      batchId:id,market:mkt,year:yr,month:mon,packCount:packSet.packCount,barCount:packSet.barCount,
      insertedObjectCount:0,identicalObjectCount:packSet.packCount,insertedManifestCount:0,
      identicalManifestCount:packSet.packCount,rollingHash,state:"ALREADY_COMPLETE",
      receiptId:prior.receipt_id,verification,
      schemaVersion:"S2_HISTORICAL_SEGMENT_PACK_STORE_RESULT_V0_1",
    });
  }

  const priorCheckpoint=await db.prepare(
    "SELECT * FROM s2_historical_segment_backfill_checkpoints WHERE batch_id=? LIMIT 1"
  ).bind(id).first();
  if(priorCheckpoint&&(Number(priorCheckpoint.expected_pack_count)!==packSet.packCount
    ||Number(priorCheckpoint.expected_bar_count)!==packSet.barCount
    ||String(priorCheckpoint.rolling_hash)!==rollingHash)){
    throw new Error("IMMUTABLE_CONFLICT historical segment checkpoint: "+id);
  }

  let insertedObjectCount=0,identicalObjectCount=0,insertedManifestCount=0,identicalManifestCount=0,processed=0;
  for(const part of split(prepared,chunkSize)){
    const existing=await loadManifestMap(db,part.map(({core})=>core));
    const inserts=[];
    for(const item of part){
      const priorManifest=existing.get(logicalKey(item.core));
      if(priorManifest){
        if(!equalManifest(priorManifest,item.core)) throw new Error("IMMUTABLE_CONFLICT historical segment manifest: "+logicalKey(item.core));
        assertObjectHead(await store.head(item.core.object_key),item.core);
        identicalObjectCount+=1; identicalManifestCount+=1; continue;
      }
      const ensured=await ensureObject(store,item.core,item.bytes);
      if(ensured.state==="INSERTED_OBJECT") insertedObjectCount+=1; else identicalObjectCount+=1;
      inserts.push(insertManifest(db,manifestRow(item.core,ensured.object)));
    }
    if(inserts.length){
      const results=await db.batch(inserts);
      if(!Array.isArray(results)||results.length!==inserts.length||results.some((x)=>x?.success===false)){
        throw new Error("historical segment manifest batch insert failed");
      }
      insertedManifestCount+=inserts.length;
    }
    processed+=part.length;
    await writeCheckpoint(db,{
      checkpoint_id:"S2HSCP-"+await sha256Hex({batchId:id,market:mkt,year:yr,month:mon}),
      batch_id:id,market:mkt,year:yr,month:mon,expected_pack_count:packSet.packCount,
      expected_bar_count:packSet.barCount,object_ready_count:insertedObjectCount+identicalObjectCount,
      manifest_committed_count:insertedManifestCount+identicalManifestCount,next_pack_index:processed,
      rolling_hash:rollingHash,state:processed===prepared.length?"OBJECTS_AND_MANIFESTS_READY":"IN_PROGRESS",
      updated_at:completedAt,schema_version:"S2_HISTORICAL_SEGMENT_BACKFILL_CHECKPOINT_V0_1",
    });
  }
  if(insertedManifestCount+identicalManifestCount!==packSet.packCount) throw new Error("historical segment manifest accounting mismatch");

  const receiptId="S2HSR-"+rollingHash;
  await db.prepare(`INSERT INTO s2_historical_segment_ingest_receipts (
    receipt_id,batch_id,market,year,month,pack_count,bar_count,payload_json_bytes,gzip_bytes,
    first_market_date,last_market_date,manifest_rolling_hash,completed_at,state,schema_version
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    receiptId,id,mkt,yr,mon,packSet.packCount,packSet.barCount,packSet.payloadJsonBytes,packSet.gzipBytes,
    firstMarketDate,lastMarketDate,rollingHash,completedAt,"COMPLETE","S2_HISTORICAL_SEGMENT_INGEST_RECEIPT_V0_1"
  ).run();
  await writeCheckpoint(db,{
    checkpoint_id:"S2HSCP-"+await sha256Hex({batchId:id,market:mkt,year:yr,month:mon}),
    batch_id:id,market:mkt,year:yr,month:mon,expected_pack_count:packSet.packCount,
    expected_bar_count:packSet.barCount,object_ready_count:packSet.packCount,
    manifest_committed_count:packSet.packCount,next_pack_index:packSet.packCount,
    rolling_hash:rollingHash,state:"COMPLETE",updated_at:completedAt,
    schema_version:"S2_HISTORICAL_SEGMENT_BACKFILL_CHECKPOINT_V0_1",
  });
  const receipt=await readHistoricalSegmentReceiptV0_1({db,batchId:id});
  const verification=await verifyHistoricalSegmentReceiptV0_1({db,objectStore:store,receipt});
  return deepFreeze({
    batchId:id,market:mkt,year:yr,month:mon,packCount:packSet.packCount,barCount:packSet.barCount,
    insertedObjectCount,identicalObjectCount,insertedManifestCount,identicalManifestCount,
    rollingHash,state:"COMPLETE",receiptId,verification,
    schemaVersion:"S2_HISTORICAL_SEGMENT_PACK_STORE_RESULT_V0_1",
  });
}

export async function loadHistoricalBarsFromSegmentsV0_1({
  db,objectStore,market,symbol,fromDate,toDate,priceSpace="RAW",
}={}){
  if(!db||typeof db.prepare!=="function") throw new Error("isolated System2 database adapter is required");
  const store=assertHistoricalColdObjectStoreV0_1(objectStore);
  const mkt=requiredText(market,"market"),code=requiredText(symbol,"symbol");
  const from=requiredText(fromDate,"fromDate"),to=requiredText(toDate,"toDate");
  if(to<from) throw new Error("toDate cannot be earlier than fromDate");
  const result=await db.prepare(`SELECT * FROM s2_historical_a1_segment_manifests
    WHERE market=? AND symbol=? AND price_space=? AND segment_to_date>=? AND segment_from_date<=?
    ORDER BY year ASC, month ASC`).bind(mkt,code,priceSpace,from,to).all();
  const rows=[],packRefs=[];
  for(const manifest of result?.results||[]){
    const object=await store.get(manifest.object_key);
    if(!object) throw new Error("COLD_OBJECT_MISSING: "+manifest.object_key);
    if(bytesSha256(object.bytes)!==manifest.object_sha256) throw new Error("historical segment object sha256 mismatch: "+manifest.object_key);
    const pack={
      packId:manifest.pack_id,market:manifest.market,symbol:manifest.symbol,year:manifest.year,
      priceSpace:manifest.price_space,firstMarketDate:manifest.first_market_date,lastMarketDate:manifest.last_market_date,
      barCount:manifest.bar_count,payloadHash:manifest.payload_hash,gzipBase64:Buffer.from(object.bytes).toString("base64"),
      capturedAt:manifest.captured_at,schemaVersion:manifest.pack_schema_version,
    };
    const materialized=await materializeHistoricalA1PackRowsV0_1({pack});
    for(const row of materialized.rows) if(row.marketDate>=from&&row.marketDate<=to) rows.push(row);
    packRefs.push(deepFreeze({
      segmentManifestId:manifest.segment_manifest_id,packId:manifest.pack_id,payloadHash:manifest.payload_hash,
      objectSha256:manifest.object_sha256,year:Number(manifest.year),month:Number(manifest.month),
    }));
  }
  rows.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  return deepFreeze({
    market:mkt,symbol:code,fromDate:from,toDate:to,priceSpace,rowCount:rows.length,
    rows:Object.freeze(rows),packRefs:Object.freeze(packRefs),
    sourceMode:"R2_SEGMENTED_COLD_OBJECT_WITH_D1_MANIFEST",
    pointInTimePolicy:"SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    schemaVersion:"S2_HISTORICAL_SEGMENT_COLD_QUERY_RESULT_V0_1",
  });
}
