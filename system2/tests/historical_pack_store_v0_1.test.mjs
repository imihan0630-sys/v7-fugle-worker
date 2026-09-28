import assert from "node:assert/strict";
import {
  buildHistoricalA1PacksResearchV0_1,
} from "../runtime/historical_pack_research_v0_1.mjs";
import {
  executeHistoricalPackSetV0_1,
  loadHistoricalBarsFromPacksV0_1,
} from "../runtime/historical_pack_store_v0_1.mjs";

class FakeStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql.replace(/\s+/g, " ").trim();
    this.params = [];
  }
  bind(...params) {
    this.params = params;
    return this;
  }
  async first() {
    if (this.sql.startsWith("SELECT * FROM s2_historical_a1_packs")) {
      const [market,symbol,year,priceSpace] = this.params;
      return this.db.packs.find((x) =>
        x.market===market && x.symbol===symbol && Number(x.year)===Number(year) && x.price_space===priceSpace
      ) || null;
    }
    if (this.sql.startsWith("SELECT * FROM s2_historical_pack_ingest_receipts")) {
      const [receiptId] = this.params;
      return this.db.receipts.find((x)=>x.receipt_id===receiptId) || null;
    }
    return null;
  }
  async all() {
    if (this.sql.includes("FROM s2_historical_a1_packs") && this.sql.includes("year BETWEEN")) {
      const [market,symbol,priceSpace,fromYear,toYear] = this.params;
      return {
        results: this.db.packs
          .filter((x)=>
            x.market===market && x.symbol===symbol && x.price_space===priceSpace
            && Number(x.year)>=Number(fromYear) && Number(x.year)<=Number(toYear)
          )
          .sort((a,b)=>Number(a.year)-Number(b.year)),
      };
    }
    return { results: [] };
  }
  async run() {
    if (this.sql.startsWith("INSERT INTO s2_historical_a1_packs")) {
      const p=this.params;
      this.db.packs.push({
        pack_id:p[0],market:p[1],symbol:p[2],year:p[3],price_space:p[4],
        first_market_date:p[5],last_market_date:p[6],bar_count:p[7],
        source_id:p[8],source_name:p[9],availability_policy:p[10],payload_hash:p[11],
        payload_json_bytes:p[12],gzip_bytes:p[13],base64_bytes:p[14],gzip_base64:p[15],
        captured_at:p[16],schema_version:p[17],
      });
      return { success:true };
    }
    if (this.sql.startsWith("INSERT INTO s2_historical_pack_ingest_receipts")) {
      const p=this.params;
      this.db.receipts.push({
        receipt_id:p[0],batch_id:p[1],pack_count:p[2],bar_count:p[3],
        inserted_pack_count:p[4],identical_pack_count:p[5],payload_json_bytes:p[6],
        gzip_bytes:p[7],base64_bytes:p[8],first_market_date:p[9],last_market_date:p[10],
        rolling_hash:p[11],captured_at:p[12],schema_version:p[13],
      });
      return { success:true };
    }
    throw new Error("unsupported SQL in fake DB: "+this.sql);
  }
}

class FakeDb {
  constructor(){ this.packs=[]; this.receipts=[]; }
  prepare(sql){ return new FakeStatement(this,sql); }
}

const rows=[
  {
    marketDate:"2025-12-31",market:"TWSE",symbol:"2330",companyName:"台積電",priceSpace:"RAW",
    open:100,high:105,low:99,close:104,volumeShares:1000,tradeValue:104000,transactions:100,change:4,
    continuityState:"CLEAR_NO_ACTION",sourceId:"TWSE_FIX",sourceName:"fixture",sourceRowHash:"h1",
  },
  {
    marketDate:"2026-01-02",market:"TWSE",symbol:"2330",companyName:"台積電",priceSpace:"RAW",
    open:104,high:108,low:103,close:107,volumeShares:1100,tradeValue:117700,transactions:110,change:3,
    continuityState:"CLEAR_NO_ACTION",sourceId:"TWSE_FIX",sourceName:"fixture",sourceRowHash:"h2",
  },
  {
    marketDate:"2026-01-05",market:"TWSE",symbol:"2330",companyName:"台灣積體電路製造",priceSpace:"RAW",
    open:107,high:110,low:106,close:109,volumeShares:1200,tradeValue:130800,transactions:120,change:2,
    continuityState:"CLEAR_NO_ACTION",sourceId:"TWSE_FIX",sourceName:"fixture",sourceRowHash:"h3",
  },
];

const packSet=await buildHistoricalA1PacksResearchV0_1({
  rows,capturedAt:"2026-09-28T13:20:00Z",
});
assert.equal(packSet.packCount,2);
assert.equal(packSet.barCount,3);
assert.ok(packSet.gzipBytes < packSet.payloadJsonBytes);

const db=new FakeDb();
const first=await executeHistoricalPackSetV0_1({
  db,packSet,batchId:"PACK-TEST-1",capturedAt:"2026-09-28T13:20:00Z",
});
assert.equal(first.insertedPackCount,2);
assert.equal(first.identicalPackCount,0);
assert.equal(db.packs.length,2);
assert.equal(db.receipts.length,1);

const second=await executeHistoricalPackSetV0_1({
  db,packSet,batchId:"PACK-TEST-2",capturedAt:"2026-09-28T13:21:00Z",
});
assert.equal(second.insertedPackCount,0);
assert.equal(second.identicalPackCount,2);

const loaded=await loadHistoricalBarsFromPacksV0_1({
  db,market:"TWSE",symbol:"2330",fromDate:"2025-12-31",toDate:"2026-01-05",
});
assert.equal(loaded.rowCount,3);
assert.equal(loaded.rows[0].marketDate,"2025-12-31");
assert.equal(loaded.rows[2].marketDate,"2026-01-05");
assert.equal(loaded.rows[0].availableAt,"2025-12-31T10:10:00.000Z");
assert.equal(loaded.rows[0].observedAt,"2026-09-28T13:20:00Z");
assert.equal(loaded.rows[0].pitReplayEligible,true);
assert.match(loaded.rows[0].barHash,/^[a-f0-9]{64}$/);
assert.equal(loaded.rows[2].companyName,"台灣積體電路製造");
assert.equal(loaded.sourceMode,"PACKED_D1_COLD_HISTORY");

db.packs[0]={...db.packs[0],payload_hash:"corrupt"};
await assert.rejects(
  () => executeHistoricalPackSetV0_1({
    db,packSet,batchId:"PACK-TEST-CONFLICT",capturedAt:"2026-09-28T13:22:00Z",
  }),
  /IMMUTABLE_CONFLICT/,
);

console.log("System2 historical packed storage v0.1 tests passed");
