import assert from "node:assert/strict";
import { buildHistoricalA1PacksResearchV0_1 } from "../runtime/historical_pack_research_v0_1.mjs";
import {
  executeHistoricalColdPackSetV0_1,
  loadHistoricalBarsFromColdPacksV0_1,
  createHistoricalColdBacktestLoadersV0_1,
  verifyHistoricalColdReceiptV0_1,
} from "../runtime/historical_cold_pack_store_v0_1.mjs";
import { buildPitReplayWindow } from "../runtime/pit_replay_v0_1.mjs";
import { buildBulkBacktestPlanV0_1, runBulkBacktestV0_1 } from "../runtime/bulk_backtest_runner_v0_1.mjs";

class FakeStatement {
  constructor(db, sql) { this.db=db; this.sql=sql.replace(/\s+/g," ").trim(); this.params=[]; }
  bind(...params) { this.params=params; return this; }
  async first() {
    if(this.sql.includes("FROM s2_historical_cold_ingest_receipts")){
      return this.db.receipts.find((row)=>row.batch_id===this.params[0]) || null;
    }
    if(this.sql.includes("FROM s2_historical_cold_backfill_checkpoints")){
      return this.db.checkpoints.find((row)=>row.batch_id===this.params[0]) || null;
    }
    return null;
  }
  async all() {
    if(this.sql.includes("FROM s2_historical_a1_pack_manifests") && this.sql.includes("symbol IN")){
      const [market,year,priceSpace,...symbols]=this.params;
      return {results:this.db.manifests.filter((row)=>row.market===market&&Number(row.year)===Number(year)&&row.price_space===priceSpace&&symbols.includes(row.symbol))};
    }
    if(this.sql.includes("FROM s2_historical_a1_pack_manifests") && this.sql.includes("year BETWEEN")){
      const [market,symbol,priceSpace,fromYear,toYear]=this.params;
      return {results:this.db.manifests.filter((row)=>row.market===market&&row.symbol===symbol&&row.price_space===priceSpace&&Number(row.year)>=Number(fromYear)&&Number(row.year)<=Number(toYear))};
    }
    if(this.sql.includes("FROM s2_historical_a1_pack_manifests") && this.sql.includes("ORDER BY symbol ASC")){
      const [market,year]=this.params;
      return {results:this.db.manifests.filter((row)=>row.market===market&&Number(row.year)===Number(year)&&row.price_space==="RAW").sort((a,b)=>a.symbol.localeCompare(b.symbol))};
    }
    if(this.sql.includes("FROM s2_historical_universe_memberships")){
      const [registryId,from,to]=this.params;
      return {results:this.db.memberships.filter((row)=>row.registry_id===registryId&&Number(row.replay_eligible)===1&&row.effective_from<=from&&(row.effective_to===null||row.effective_to>=to))};
    }
    return {results:[]};
  }
  async run() {
    if(this.sql.startsWith("INSERT INTO s2_historical_cold_backfill_checkpoints")){
      const p=this.params;
      const row={checkpoint_id:p[0],batch_id:p[1],market:p[2],year:p[3],expected_pack_count:p[4],expected_bar_count:p[5],object_ready_count:p[6],manifest_committed_count:p[7],next_pack_index:p[8],rolling_hash:p[9],state:p[10],updated_at:p[11],schema_version:p[12]};
      const index=this.db.checkpoints.findIndex((x)=>x.batch_id===row.batch_id);
      if(index>=0)this.db.checkpoints[index]=row;else this.db.checkpoints.push(row);
      return {success:true};
    }
    if(this.sql.startsWith("INSERT INTO s2_historical_cold_ingest_receipts")){
      const p=this.params;
      this.db.receipts.push({receipt_id:p[0],batch_id:p[1],market:p[2],year:p[3],pack_count:p[4],bar_count:p[5],payload_json_bytes:p[6],gzip_bytes:p[7],first_market_date:p[8],last_market_date:p[9],manifest_rolling_hash:p[10],completed_at:p[11],state:p[12],schema_version:p[13]});
      return {success:true};
    }
    throw new Error("unsupported fake run SQL: "+this.sql);
  }
}

class FakeDb {
  constructor(){this.manifests=[];this.receipts=[];this.checkpoints=[];this.memberships=[];}
  prepare(sql){return new FakeStatement(this,sql);}
  async batch(statements){
    return statements.map((statement)=>{
      if(!statement.sql.startsWith("INSERT INTO s2_historical_a1_pack_manifests")) throw new Error("unexpected fake batch SQL");
      const p=statement.params;
      this.manifests.push({pack_id:p[0],market:p[1],symbol:p[2],year:p[3],price_space:p[4],first_market_date:p[5],last_market_date:p[6],bar_count:p[7],source_id:p[8],source_name:p[9],availability_policy:p[10],payload_hash:p[11],object_sha256:p[12],payload_json_bytes:p[13],gzip_bytes:p[14],object_backend:p[15],object_bucket:p[16],object_key:p[17],object_etag:p[18],object_version:p[19],storage_class:p[20],object_uploaded_at:p[21],captured_at:p[22],pack_schema_version:p[23],schema_version:p[24]});
      return {success:true};
    });
  }
}

class FakeObjectStore {
  constructor(){this.backend="TEST_R2";this.bucketName="system2-history-test";this.objects=new Map();}
  metadata(key,row){return {key,size:row.bytes.byteLength,etag:row.etag,version:"v1",uploadedAt:"2026-09-28T14:30:00Z",storageClass:"Standard",customMetadata:{...row.customMetadata}};}
  async head(key){const row=this.objects.get(key);return row?this.metadata(key,row):null;}
  async putIfAbsent(key,bytes,options){
    if(this.objects.has(key))return null;
    this.objects.set(key,{bytes:new Uint8Array(bytes),etag:"etag-"+this.objects.size,customMetadata:{...options.customMetadata}});
    return this.head(key);
  }
  async get(key){const row=this.objects.get(key);return row?{metadata:this.metadata(key,row),bytes:new Uint8Array(row.bytes)}:null;}
}

const capturedAt="2026-09-28T14:30:00Z";
const rows=["2017-01-03","2017-01-04","2017-01-05"].map((marketDate,index)=>({
  market:"TWSE",symbol:"2330",companyName:"台積電",marketDate,priceSpace:"RAW",
  open:100+index,high:103+index,low:99+index,close:102+index,
  volumeShares:1000+index,tradeValue:102000+index,transactions:100+index,change:2,
  continuityState:"CLEAR_NO_ACTION",sourceId:"A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
  sourceName:"TWSE historical fixture",sourceRowHash:"source-"+index,
}));
const packSet=await buildHistoricalA1PacksResearchV0_1({rows,capturedAt});
assert.equal(packSet.packCount,1);
assert.match(packSet.packs[0].objectSha256,/^[a-f0-9]{64}$/);

const db=new FakeDb();
const objectStore=new FakeObjectStore();
const first=await executeHistoricalColdPackSetV0_1({db,objectStore,packSet,batchId:"COLD|TWSE|2017",capturedAt,chunkSize:1});
assert.equal(first.state,"COMPLETE");
assert.equal(first.insertedObjectCount,1);
assert.equal(first.insertedManifestCount,1);
assert.equal(db.manifests.length,1);
assert.equal(db.receipts.length,1);
assert.equal(db.manifests[0].gzip_base64,undefined,"D1 manifest must not contain payload bytes");
assert.equal(db.manifests[0].source_id,"A1_TWSE_MI_INDEX_HISTORICAL_DAILY");

const verified=await verifyHistoricalColdReceiptV0_1({db,objectStore,receipt:db.receipts[0]});
assert.equal(verified.state,"VERIFIED");
assert.equal(verified.objectCountVerified,1);

const second=await executeHistoricalColdPackSetV0_1({db,objectStore,packSet,batchId:"COLD|TWSE|2017",capturedAt,chunkSize:1});
assert.equal(second.state,"ALREADY_COMPLETE");
assert.equal(second.insertedObjectCount,0);

const rebuilt=await buildHistoricalA1PacksResearchV0_1({rows,capturedAt:"2026-09-28T14:35:00Z"});
const resumed=await executeHistoricalColdPackSetV0_1({db,objectStore,packSet:rebuilt,batchId:"COLD|TWSE|2017|RETRY",capturedAt:"2026-09-28T14:35:00Z",chunkSize:1});
assert.equal(resumed.state,"COMPLETE");
assert.equal(resumed.identicalObjectCount,1);
assert.equal(resumed.identicalManifestCount,1);

const loaded=await loadHistoricalBarsFromColdPacksV0_1({db,objectStore,market:"TWSE",symbol:"2330",fromDate:"2017-01-03",toDate:"2017-01-05"});
assert.equal(loaded.rowCount,3);
assert.equal(loaded.sourceMode,"R2_COLD_OBJECT_WITH_D1_MANIFEST");
assert.equal(loaded.rows[0].observedAt,capturedAt,"backfill capture time must not be relabeled as historical availability time");
assert.equal(loaded.rows[0].availableAt,"2017-01-03T10:10:00.000Z");
assert.match(loaded.rows[0].barHash,/^[a-f0-9]{64}$/);

const replay=await buildPitReplayWindow({
  replayId:"PIT-COLD-1",symbol:"2330",marketDate:"2017-01-05",
  decisionTimestamp:"2017-01-05T10:11:00Z",lookbackSessions:3,historicalBars:loaded.rows,
});
assert.equal(replay.state,"READY");

db.memberships.push({
  registry_id:"REG-2017",market:"TWSE",symbol:"2330",company_name:"台積電",industry:"半導體",
  membership_id:"MEM-2330",membership_hash:"MH-2330",replay_eligible:1,effective_from:"2017-01-03",effective_to:null,
});
const loaders=createHistoricalColdBacktestLoadersV0_1({db,objectStore,registryId:"REG-2017"});
const plan=await buildBulkBacktestPlanV0_1({
  runId:"BT-COLD-1",datasetVersion:"COLD-V1",strategyId:"SHORT_MOMENTUM",strategyVersion:"0.1",
  marketDates:["2017-01-05"],decisionClockByDate:{"2017-01-05":"2017-01-05T10:11:00Z"},
  lookbackSessions:3,symbolPartitionSize:20,selectionPolicyAuthorized:false,createdAt:capturedAt,
});
const run=await runBulkBacktestV0_1({
  plan,loadUniverse:loaders.loadUniverse,loadHistoricalBars:loaders.loadHistoricalBars,
  evaluateSymbol:async()=>({candidateState:"QUALIFIED_NOT_SELECTED",reasons:["FIXTURE"]}),
  retainSamplesInMemory:true,capturedAt,
});
assert.equal(run.processedSampleCount,1);
assert.equal(run.retainedSamples[0].pitReplayState,"READY");

const stored=objectStore.objects.get(db.manifests[0].object_key);
stored.bytes[0]^=0xff;
await assert.rejects(
  ()=>loadHistoricalBarsFromColdPacksV0_1({db,objectStore,market:"TWSE",symbol:"2330",fromDate:"2017-01-03",toDate:"2017-01-05"}),
  /sha256 mismatch/,
);

const changed=await buildHistoricalA1PacksResearchV0_1({rows:rows.map((row,index)=>index===2?{...row,close:999,high:1000}:row),capturedAt});
await assert.rejects(
  ()=>executeHistoricalColdPackSetV0_1({db,objectStore:new FakeObjectStore(),packSet:changed,batchId:"COLD-CONFLICT",capturedAt,chunkSize:1}),
  /IMMUTABLE_CONFLICT historical cold manifest/,
);

const checkpointDb=new FakeDb();
checkpointDb.checkpoints.push({
  batch_id:"COLD-CHECKPOINT-CONFLICT",market:"TWSE",year:2017,
  expected_pack_count:1,expected_bar_count:999,rolling_hash:"wrong",
  schema_version:"S2_HISTORICAL_COLD_BACKFILL_CHECKPOINT_V0_1",
});
await assert.rejects(
  ()=>executeHistoricalColdPackSetV0_1({db:checkpointDb,objectStore:new FakeObjectStore(),packSet,batchId:"COLD-CHECKPOINT-CONFLICT",capturedAt,chunkSize:1}),
  /IMMUTABLE_CONFLICT historical cold checkpoint/,
);

console.log("System2 external cold historical pack store v0.1 tests passed");
