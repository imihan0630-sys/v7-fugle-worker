import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const HISTORICAL_PACK_BULK_PERSISTENCE_VERSION="0.1-RESEARCH";

function text(v,f){ if(typeof v!=="string"||!v.trim()) throw new Error(f+" is required"); return v.trim(); }
function posInt(v,f){ const n=Number(v); if(!Number.isInteger(n)||n<0) throw new Error(f+" must be non-negative integer"); return n; }
function chunk(values,size){ const out=[]; for(let i=0;i<values.length;i+=size) out.push(values.slice(i,i+size)); return out; }
function logicalKey(r){ return [r.market,r.symbol,r.year,r.price_space].join("|"); }

function toRow(pack){
  return {
    pack_id:text(pack.packId,"pack.packId"),
    market:text(pack.market,"pack.market"),
    symbol:text(pack.symbol,"pack.symbol"),
    year:Number(pack.year),
    price_space:text(pack.priceSpace,"pack.priceSpace"),
    first_market_date:text(pack.firstMarketDate,"pack.firstMarketDate"),
    last_market_date:text(pack.lastMarketDate,"pack.lastMarketDate"),
    bar_count:posInt(pack.barCount,"pack.barCount"),
    source_id:pack.sourceId||null,
    source_name:pack.sourceName||null,
    availability_policy:"SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    payload_hash:text(pack.payloadHash,"pack.payloadHash"),
    payload_json_bytes:posInt(pack.payloadJsonBytes,"pack.payloadJsonBytes"),
    gzip_bytes:posInt(pack.gzipBytes,"pack.gzipBytes"),
    base64_bytes:posInt(pack.base64Bytes,"pack.base64Bytes"),
    gzip_base64:text(pack.gzipBase64,"pack.gzipBase64"),
    captured_at:text(pack.capturedAt,"pack.capturedAt"),
    schema_version:text(pack.schemaVersion,"pack.schemaVersion"),
  };
}

function equalRow(a,b){
  const fields=["pack_id","market","symbol","year","price_space","first_market_date","last_market_date","bar_count",
    "source_id","source_name","availability_policy","payload_hash","payload_json_bytes","gzip_bytes","base64_bytes",
    "gzip_base64","schema_version"];
  return fields.every(k=>String(a?.[k]??"")===String(b?.[k]??""));
}

async function existingRows(db,rows,lookupChunkSize){
  const out=new Map();
  const groups=new Map();
  for(const row of rows){
    const g=[row.market,row.year,row.price_space].join("|");
    if(!groups.has(g)) groups.set(g,[]);
    groups.get(g).push(row);
  }
  for(const [g,members] of groups){
    const [market,year,priceSpace]=g.split("|");
    for(const part of chunk(members,lookupChunkSize)){
      const symbols=part.map(x=>x.symbol);
      const q="SELECT * FROM s2_historical_a1_packs WHERE market=? AND year=? AND price_space=? AND symbol IN ("+symbols.map(()=>"?").join(",")+")";
      const result=await db.prepare(q).bind(market,Number(year),priceSpace,...symbols).all();
      for(const row of result?.results||[]) out.set(logicalKey(row),row);
    }
  }
  return out;
}

function insertStatement(db,row){
  const sql="INSERT INTO s2_historical_a1_packs ("+
    "pack_id,market,symbol,year,price_space,first_market_date,last_market_date,bar_count,"+
    "source_id,source_name,availability_policy,payload_hash,payload_json_bytes,gzip_bytes,"+
    "base64_bytes,gzip_base64,captured_at,schema_version"+
    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  return db.prepare(sql).bind(
    row.pack_id,row.market,row.symbol,row.year,row.price_space,row.first_market_date,row.last_market_date,row.bar_count,
    row.source_id,row.source_name,row.availability_policy,row.payload_hash,row.payload_json_bytes,row.gzip_bytes,
    row.base64_bytes,row.gzip_base64,row.captured_at,row.schema_version,
  );
}

export async function executeHistoricalPackSetBulkV0_1({
  db,packSet,batchId,capturedAt,lookupChunkSize=80,insertChunkSize=80,
}={}){
  if(!db||typeof db.prepare!=="function"||typeof db.batch!=="function") throw new Error("isolated System2 database adapter with batch() is required");
  if(!packSet||packSet.schemaVersion!=="S2_HISTORICAL_A1_PACK_SET_RESEARCH_V0_1") throw new Error("valid historical pack set is required");
  const id=text(batchId,"batchId"), captured=text(capturedAt,"capturedAt");
  if(!Number.isInteger(lookupChunkSize)||lookupChunkSize<1||lookupChunkSize>200) throw new Error("lookupChunkSize must be 1..200");
  if(!Number.isInteger(insertChunkSize)||insertChunkSize<1||insertChunkSize>100) throw new Error("insertChunkSize must be 1..100");

  const rows=packSet.packs.map(toRow);
  const existing=await existingRows(db,rows,lookupChunkSize);
  const absent=[];
  let identicalPackCount=0;
  for(const row of rows){
    const prior=existing.get(logicalKey(row));
    if(prior){
      if(!equalRow(prior,row)) throw new Error("IMMUTABLE_CONFLICT historical pack: "+logicalKey(row));
      identicalPackCount+=1;
    }else absent.push(row);
  }

  let insertedPackCount=0;
  for(const part of chunk(absent,insertChunkSize)){
    const results=await db.batch(part.map(row=>insertStatement(db,row)));
    if(!Array.isArray(results)||results.length!==part.length) throw new Error("historical pack batch insert count mismatch");
    for(let i=0;i<results.length;i++){
      if(results[i]?.success===false) throw new Error("historical pack batch insert failed: "+logicalKey(part[i]));
      insertedPackCount+=1;
    }
  }
  if(insertedPackCount+identicalPackCount!==rows.length) throw new Error("historical pack accounting mismatch");

  const first=rows.length?rows.map(x=>x.first_market_date).sort()[0]:null;
  const last=rows.length?rows.map(x=>x.last_market_date).sort().at(-1):null;
  const rollingHash=await sha256Hex({batchId:id,packHashes:packSet.packs.map(x=>x.payloadHash)});
  const receiptId="S2HPR-"+rollingHash;
  const priorReceipt=await db.prepare("SELECT receipt_id FROM s2_historical_pack_ingest_receipts WHERE receipt_id=?")
    .bind(receiptId).first();
  if(!priorReceipt){
    const receiptSql="INSERT INTO s2_historical_pack_ingest_receipts ("+
      "receipt_id,batch_id,pack_count,bar_count,inserted_pack_count,identical_pack_count,"+
      "payload_json_bytes,gzip_bytes,base64_bytes,first_market_date,last_market_date,"+
      "rolling_hash,captured_at,schema_version"+
      ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    await db.prepare(receiptSql).bind(
      receiptId,id,packSet.packCount,packSet.barCount,insertedPackCount,identicalPackCount,
      packSet.payloadJsonBytes,packSet.gzipBytes,packSet.base64Bytes,first,last,
      rollingHash,captured,"S2_HISTORICAL_PACK_INGEST_RECEIPT_V0_1"
    ).run();
  }

  return deepFreeze({
    batchId:id,packCount:packSet.packCount,barCount:packSet.barCount,
    insertedPackCount,identicalPackCount,lookupChunkSize,insertChunkSize,
    receiptId,rollingHash,state:"HISTORICAL_PACK_SET_BULK_PERSISTED",
    schemaVersion:"S2_HISTORICAL_PACK_BULK_PERSISTENCE_V0_1",
  });
}