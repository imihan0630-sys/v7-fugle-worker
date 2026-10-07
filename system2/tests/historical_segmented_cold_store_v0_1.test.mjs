import assert from "node:assert/strict";
import { buildHistoricalA1PacksResearchV0_1 } from "../runtime/historical_pack_research_v0_1.mjs";
import { loadHistoricalBarsFromColdPacksV0_1 } from "../runtime/historical_cold_pack_store_v0_1.mjs";
import {
  executeHistoricalSegmentPackSetV0_1,
  loadHistoricalBarsFromSegmentsV0_1,
  verifyHistoricalSegmentReceiptV0_1,
} from "../runtime/historical_segmented_cold_store_v0_1.mjs";

class FakeStatement {
  constructor(db,sql){this.db=db;this.sql=sql.replace(/\s+/g," ").trim();this.params=[];}
  bind(...params){this.params=params;return this;}
  async first(){
    if(this.sql.includes("FROM s2_historical_segment_ingest_receipts")){
      return this.db.receipts.find((x)=>x.batch_id===this.params[0])||null;
    }
    if(this.sql.includes("FROM s2_historical_segment_backfill_checkpoints")){
      return this.db.checkpoints.find((x)=>x.batch_id===this.params[0])||null;
    }
    return null;
  }
  async all(){
    if(this.sql.includes("FROM s2_historical_a1_pack_manifests")&&this.sql.includes("year BETWEEN")){
      const [market,symbol,priceSpace,fromYear,toYear]=this.params;
      return {results:this.db.annualManifests.filter((x)=>x.market===market&&x.symbol===symbol&&x.price_space===priceSpace&&Number(x.year)>=Number(fromYear)&&Number(x.year)<=Number(toYear))};
    }
    if(this.sql.includes("FROM s2_historical_a1_segment_manifests")&&this.sql.includes("symbol IN")){
      const [market,year,month,priceSpace,...symbols]=this.params;
      return {results:this.db.manifests.filter((x)=>x.market===market&&Number(x.year)===Number(year)&&Number(x.month)===Number(month)&&x.price_space===priceSpace&&symbols.includes(x.symbol))};
    }
    if(this.sql.includes("FROM s2_historical_a1_segment_manifests")&&this.sql.includes("ORDER BY symbol ASC")){
      const [market,year,month]=this.params;
      return {results:this.db.manifests.filter((x)=>x.market===market&&Number(x.year)===Number(year)&&Number(x.month)===Number(month)&&x.price_space==="RAW").sort((a,b)=>a.symbol.localeCompare(b.symbol))};
    }
    if(this.sql.includes("FROM s2_historical_a1_segment_manifests")&&this.sql.includes("segment_to_date>=?")){
      const [market,symbol,priceSpace,from,to]=this.params;
      return {results:this.db.manifests.filter((x)=>x.market===market&&x.symbol===symbol&&x.price_space===priceSpace&&x.segment_to_date>=from&&x.segment_from_date<=to).sort((a,b)=>Number(a.year)-Number(b.year)||Number(a.month)-Number(b.month))};
    }
    return {results:[]};
  }
  async run(){
    if(this.sql.startsWith("INSERT INTO s2_historical_segment_backfill_checkpoints")){
      const p=this.params;
      const row={checkpoint_id:p[0],batch_id:p[1],market:p[2],year:p[3],month:p[4],expected_pack_count:p[5],expected_bar_count:p[6],object_ready_count:p[7],manifest_committed_count:p[8],next_pack_index:p[9],rolling_hash:p[10],state:p[11],updated_at:p[12],schema_version:p[13]};
      const i=this.db.checkpoints.findIndex((x)=>x.batch_id===row.batch_id);
      if(i>=0)this.db.checkpoints[i]=row;else this.db.checkpoints.push(row);
      return {success:true};
    }
    if(this.sql.startsWith("INSERT INTO s2_historical_segment_ingest_receipts")){
      const p=this.params;
      this.db.receipts.push({receipt_id:p[0],batch_id:p[1],market:p[2],year:p[3],month:p[4],pack_count:p[5],bar_count:p[6],payload_json_bytes:p[7],gzip_bytes:p[8],first_market_date:p[9],last_market_date:p[10],manifest_rolling_hash:p[11],completed_at:p[12],state:p[13],schema_version:p[14]});
      return {success:true};
    }
    throw new Error("unsupported fake run SQL: "+this.sql);
  }
}
class FakeDb {
  constructor(){this.manifests=[];this.annualManifests=[];this.receipts=[];this.checkpoints=[];}
  prepare(sql){return new FakeStatement(this,sql);}
  async batch(statements){
    return statements.map((statement)=>{
      if(!statement.sql.startsWith("INSERT INTO s2_historical_a1_segment_manifests")) throw new Error("unexpected fake batch SQL");
      const p=statement.params;
      this.manifests.push({
        segment_manifest_id:p[0],pack_id:p[1],market:p[2],symbol:p[3],year:p[4],month:p[5],price_space:p[6],
        segment_from_date:p[7],segment_to_date:p[8],first_market_date:p[9],last_market_date:p[10],bar_count:p[11],
        source_id:p[12],source_name:p[13],availability_policy:p[14],payload_hash:p[15],object_sha256:p[16],
        payload_json_bytes:p[17],gzip_bytes:p[18],object_backend:p[19],object_bucket:p[20],object_key:p[21],
        object_etag:p[22],object_version:p[23],storage_class:p[24],object_uploaded_at:p[25],captured_at:p[26],
        pack_schema_version:p[27],schema_version:p[28],
      });
      return {success:true};
    });
  }
}
class FakeObjectStore {
  constructor(){this.backend="TEST_R2";this.bucketName="system2-segment-test";this.objects=new Map();}
  meta(key,row){return {key,size:row.bytes.byteLength,etag:row.etag,version:"v1",uploadedAt:"2026-10-07T00:00:00Z",storageClass:"Standard",customMetadata:{...row.customMetadata}};}
  async head(key){const row=this.objects.get(key);return row?this.meta(key,row):null;}
  async putIfAbsent(key,bytes,options){
    if(this.objects.has(key))return null;
    this.objects.set(key,{bytes:new Uint8Array(bytes),etag:"etag-"+this.objects.size,customMetadata:{...options.customMetadata}});
    return this.head(key);
  }
  async get(key){const row=this.objects.get(key);return row?{metadata:this.meta(key,row),bytes:new Uint8Array(row.bytes)}:null;}
}

const capturedAt="2026-10-07T06:00:00Z";
const rows=["2026-09-01","2026-09-02","2026-09-03"].flatMap((marketDate,index)=>[
  {
    market:"TWSE",symbol:"2330",companyName:"台積電",marketDate,priceSpace:"RAW",
    open:1000+index,high:1010+index,low:995+index,close:1005+index,
    volumeShares:1000000+index,tradeValue:1005000000+index,transactions:5000+index,change:5,
    continuityState:"UNVERIFIED",sourceId:"A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
    sourceName:"TWSE historical fixture",sourceRowHash:"2330-"+index,
  },
  {
    market:"TWSE",symbol:"2317",companyName:"鴻海",marketDate,priceSpace:"RAW",
    open:200+index,high:205+index,low:198+index,close:203+index,
    volumeShares:2000000+index,tradeValue:406000000+index,transactions:6000+index,change:3,
    continuityState:"UNVERIFIED",sourceId:"A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
    sourceName:"TWSE historical fixture",sourceRowHash:"2317-"+index,
  },
]);
const packSet=await buildHistoricalA1PacksResearchV0_1({rows,capturedAt});
assert.equal(packSet.packCount,2);
assert.equal(packSet.barCount,6);

const db=new FakeDb();
const store=new FakeObjectStore();
const args={
  db,objectStore:store,packSet,batchId:"S2-HIST-SEGMENT-MONTH|TWSE|2026|09",
  capturedAt,market:"TWSE",year:2026,month:9,
  segmentFromDate:"2026-09-01",segmentToDate:"2026-09-30",chunkSize:1,
};
const first=await executeHistoricalSegmentPackSetV0_1(args);
assert.equal(first.state,"COMPLETE");
assert.equal(first.insertedObjectCount,2);
assert.equal(first.insertedManifestCount,2);
assert.equal(first.verification.state,"VERIFIED");
assert.equal(first.verification.headObjectCountVerified,2);
assert.equal(first.verification.byteGetObjectCountVerified,2);
assert.equal(db.receipts.length,1);

const second=await executeHistoricalSegmentPackSetV0_1(args);
assert.equal(second.state,"ALREADY_COMPLETE");
assert.equal(second.identicalObjectCount,2);
assert.equal(second.verification.state,"VERIFIED");

const verified=await verifyHistoricalSegmentReceiptV0_1({db,objectStore:store,receipt:db.receipts[0]});
assert.equal(verified.barCount,6);
assert.equal(verified.packCount,2);

const loaded=await loadHistoricalBarsFromSegmentsV0_1({
  db,objectStore:store,market:"TWSE",symbol:"2330",
  fromDate:"2026-09-01",toDate:"2026-09-30",
});
assert.equal(loaded.rowCount,3);
assert.equal(loaded.sourceMode,"R2_SEGMENTED_COLD_OBJECT_WITH_D1_MANIFEST");
assert.equal(loaded.rows[0].marketDate,"2026-09-01");

const hybridFromSegments=await loadHistoricalBarsFromColdPacksV0_1({
  db,objectStore:store,market:"TWSE",symbol:"2330",
  fromDate:"2026-09-01",toDate:"2026-09-30",
});
assert.equal(hybridFromSegments.rowCount,3);
assert.equal(hybridFromSegments.segmentPackCount,1);
assert.equal(hybridFromSegments.annualSupersedesSegmentsForSameYear,true);
assert.equal(hybridFromSegments.packRefs[0].sourceKind,"SEGMENT");

db.annualManifests.push({...db.manifests.find((x)=>x.symbol==="2330")});
const hybridAnnualPreferred=await loadHistoricalBarsFromColdPacksV0_1({
  db,objectStore:store,market:"TWSE",symbol:"2330",
  fromDate:"2026-09-01",toDate:"2026-09-30",
});
assert.equal(hybridAnnualPreferred.rowCount,3);
assert.equal(hybridAnnualPreferred.segmentPackCount,0);
assert.deepEqual(hybridAnnualPreferred.annualPackYears,[2026]);
assert.equal(hybridAnnualPreferred.packRefs[0].sourceKind,"ANNUAL");

const changedRows=rows.map((row)=>row.symbol==="2330"&&row.marketDate==="2026-09-03"
  ?{...row,close:9999,high:10000}:row);
const changedPackSet=await buildHistoricalA1PacksResearchV0_1({rows:changedRows,capturedAt});
await assert.rejects(
  ()=>executeHistoricalSegmentPackSetV0_1({...args,packSet:changedPackSet,batchId:"S2-HIST-SEGMENT-MONTH|TWSE|2026|09|CONFLICT"}),
  /IMMUTABLE_CONFLICT historical segment manifest/,
);

const tampered=store.objects.get(db.manifests[0].object_key);
tampered.bytes[0]^=0xff;
await assert.rejects(
  ()=>verifyHistoricalSegmentReceiptV0_1({db,objectStore:store,receipt:db.receipts[0]}),
  /byte sha256 mismatch/,
);

console.log("System2 segmented current-year cold store v0.1 tests passed");
