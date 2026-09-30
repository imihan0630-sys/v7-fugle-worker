import assert from "node:assert/strict";
import { executeHistoricalPackSetBulkV0_1 } from "../runtime/historical_pack_bulk_persistence_v0_1.mjs";

class Statement {
  constructor(db, sql){ this.db=db; this.sql=sql.replace(/\s+/g," ").trim(); this.params=[]; }
  bind(...params){ this.params=params; return this; }
  async all(){
    if(this.sql.startsWith("SELECT * FROM s2_historical_a1_packs")){
      const [market,year,priceSpace,...symbols]=this.params;
      return {results:this.db.packs.filter(r =>
        r.market===market && Number(r.year)===Number(year) && r.price_space===priceSpace && symbols.includes(r.symbol)
      )};
    }
    return {results:[]};
  }
  async first(){
    if(this.sql.startsWith("SELECT receipt_id FROM s2_historical_pack_ingest_receipts")){
      return this.db.receipts.find(r=>r.receipt_id===this.params[0]) || null;
    }
    return null;
  }
  async run(){
    if(this.sql.startsWith("INSERT INTO s2_historical_pack_ingest_receipts")){
      const p=this.params;
      this.db.receipts.push({
        receipt_id:p[0],batch_id:p[1],pack_count:p[2],bar_count:p[3],
        inserted_pack_count:p[4],identical_pack_count:p[5],payload_json_bytes:p[6],
        gzip_bytes:p[7],base64_bytes:p[8],first_market_date:p[9],last_market_date:p[10],
        rolling_hash:p[11],captured_at:p[12],schema_version:p[13],
      });
      this.db.runCalls += 1;
      return {success:true};
    }
    throw new Error("unsupported run SQL");
  }
}

class Db {
  constructor(){ this.packs=[]; this.receipts=[]; this.batchCalls=0; this.runCalls=0; this.prepareCalls=0; }
  prepare(sql){ this.prepareCalls+=1; return new Statement(this,sql); }
  async batch(statements){
    this.batchCalls+=1;
    const results=[];
    for(const stmt of statements){
      if(!stmt.sql.startsWith("INSERT INTO s2_historical_a1_packs")) throw new Error("unexpected batch SQL");
      const p=stmt.params;
      this.packs.push({
        pack_id:p[0],market:p[1],symbol:p[2],year:p[3],price_space:p[4],
        first_market_date:p[5],last_market_date:p[6],bar_count:p[7],
        source_id:p[8],source_name:p[9],availability_policy:p[10],payload_hash:p[11],
        payload_json_bytes:p[12],gzip_bytes:p[13],base64_bytes:p[14],gzip_base64:p[15],
        captured_at:p[16],schema_version:p[17],
      });
      results.push({success:true});
    }
    return results;
  }
}

function pack(symbol, hash){
  return {
    packId:"P-"+hash, market:"TWSE", symbol, year:2017, priceSpace:"RAW",
    firstMarketDate:"2017-01-03", lastMarketDate:"2017-12-29", barCount:240,
    sourceId:"TWSE_FIX", sourceName:"fixture", payloadHash:hash,
    payloadJsonBytes:10000, gzipBytes:4000, base64Bytes:5336,
    gzipBase64:"H4sI"+hash, capturedAt:"2026-09-28T13:30:00Z",
    schemaVersion:"S2_HISTORICAL_A1_PACK_RESEARCH_V0_1",
  };
}
const packSet={
  packCount:3, barCount:720, payloadJsonBytes:30000, gzipBytes:12000, base64Bytes:16008,
  packs:[pack("2330","h1"),pack("2317","h2"),pack("2454","h3")],
  schemaVersion:"S2_HISTORICAL_A1_PACK_SET_RESEARCH_V0_1",
};

const db=new Db();
const first=await executeHistoricalPackSetBulkV0_1({
  db,packSet,batchId:"BULK-2017",capturedAt:"2026-09-28T13:30:00Z",
  lookupChunkSize:80,insertChunkSize:80,
});
assert.equal(first.insertedPackCount,3);
assert.equal(first.identicalPackCount,0);
assert.equal(first.state,"HISTORICAL_PACK_SET_BULK_PERSISTED");
assert.equal(db.batchCalls,1,"three packs should be inserted in one batch");
assert.equal(db.packs.length,3);
assert.equal(db.receipts.length,1);

const second=await executeHistoricalPackSetBulkV0_1({
  db,packSet,batchId:"BULK-2017",capturedAt:"2026-09-28T13:30:00Z",
  lookupChunkSize:80,insertChunkSize:80,
});
assert.equal(second.insertedPackCount,0);
assert.equal(second.identicalPackCount,3);
assert.equal(db.batchCalls,1,"idempotent rerun must not issue another insert batch");

const bad={...packSet,packs:packSet.packs.map((p,i)=>i===1?{...p,payloadHash:"DIFFERENT",packId:"P-DIFFERENT"}:p)};
await assert.rejects(
  ()=>executeHistoricalPackSetBulkV0_1({
    db,packSet:bad,batchId:"BULK-2017-CONFLICT",capturedAt:"2026-09-28T13:31:00Z",
  }),
  /IMMUTABLE_CONFLICT/,
);

console.log("System2 historical pack bulk persistence v0.1 tests passed");
