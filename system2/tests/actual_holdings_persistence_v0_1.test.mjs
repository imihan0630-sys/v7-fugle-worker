import assert from "node:assert/strict";
import { validateActualHoldingsScreenshotExtractionV0_1 } from "../runtime/actual_holdings_validation_v0_1.mjs";
import { buildActualHoldingsSnapshotV0_1 } from "../runtime/actual_holdings_snapshot_v0_1.mjs";
import {
  persistActualHoldingsSnapshotV0_1,
  readLatestActualHoldingsSnapshotV0_1,
} from "../runtime/actual_holdings_persistence_v0_1.mjs";

class FakeStatement {
  constructor(db,sql){this.db=db;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  async first(){
    const s=this.sql.replace(/\s+/g," ").trim();
    if(s.includes("WHERE idempotency_key = ?")){
      const id=this.db.byIdempotency.get(this.args[0]);
      if(!id)return null;
      const row=this.db.snapshots.get(id);
      return {snapshot_id:row.snapshot_id,snapshot_hash:row.snapshot_hash};
    }
    if(s.includes("WHERE snapshot_id = ? LIMIT 1")){
      const row=this.db.snapshots.get(this.args[0]);
      if(!row)return null;
      return {snapshot_id:row.snapshot_id,snapshot_hash:row.snapshot_hash,row_count:row.row_count};
    }
    if(s.includes("FROM s2_actual_holdings_snapshots")&&s.includes("ORDER BY effective_as_of")){
      const rows=[...this.db.snapshots.values()]
        .filter(r=>r.snapshot_state==="CONFIRMED_ACTUAL_HOLDINGS")
        .filter(r=>!s.includes("account_alias = ?")||r.account_alias===this.args[0])
        .sort((a,b)=>String(b.effective_as_of).localeCompare(String(a.effective_as_of)));
      return rows[0]||null;
    }
    throw new Error("unhandled first SQL: "+s);
  }
  async all(){
    const s=this.sql.replace(/\s+/g," ").trim();
    if(s.startsWith("SELECT symbol FROM s2_actual_holdings_rows")){
      const rows=this.db.rows.filter(r=>r.snapshot_id===this.args[0]).sort((a,b)=>a.symbol.localeCompare(b.symbol));
      return {results:rows.map(r=>({symbol:r.symbol}))};
    }
    if(s.startsWith("SELECT row_json FROM s2_actual_holdings_rows")){
      const rows=this.db.rows.filter(r=>r.snapshot_id===this.args[0]).sort((a,b)=>a.symbol.localeCompare(b.symbol));
      return {results:rows.map(r=>({row_json:r.row_json}))};
    }
    throw new Error("unhandled all SQL: "+s);
  }
  async run(){
    const s=this.sql.replace(/\s+/g," ").trim();
    if(s.startsWith("INSERT INTO s2_actual_holdings_imports")){
      this.db.imports.set(this.args[0],{import_id:this.args[0],idempotency_key:this.args[17]});
      return {success:true};
    }
    if(s.startsWith("INSERT INTO s2_actual_holdings_snapshots")){
      const a=this.args;
      const row={
        snapshot_id:a[0],import_id:a[1],previous_snapshot_id:a[2],source_type:a[3],
        source_image_sha256:a[4],broker_name:a[5],account_alias:a[6],received_at:a[7],
        effective_as_of:a[8],extraction_version:a[9],validation_version:a[10],
        review_state:a[11],snapshot_state:a[12],row_count:a[13],rows_hash:a[14],
        source_provenance_json:a[15],raw_extraction_json:a[16],confirmed_holdings_json:a[17],
        reconciliation_json:a[18],idempotency_key:a[19],snapshot_hash:a[20],
        immutable:a[21],schema_version:a[22],
      };
      this.db.snapshots.set(row.snapshot_id,row);
      this.db.byIdempotency.set(row.idempotency_key,row.snapshot_id);
      return {success:true};
    }
    if(s.startsWith("INSERT INTO s2_actual_holdings_rows")){
      const a=this.args;
      this.db.rows.push({
        snapshot_id:a[0],symbol:a[1],company_name:a[2],quantity:a[3],average_cost:a[4],
        market_price:a[5],market_value:a[6],unrealized_pnl:a[7],unrealized_pnl_percent:a[8],
        currency:a[9],row_confidence:a[10],validation_state:a[11],row_json:a[12],row_hash:a[13],schema_version:a[14],
      });
      return {success:true};
    }
    if(s.startsWith("INSERT INTO s2_actual_holdings_reconciliation_events")){
      this.db.events.push({event_id:this.args[0],snapshot_id:this.args[1],symbol:this.args[3]});
      return {success:true};
    }
    throw new Error("unhandled run SQL: "+s);
  }
}
class FakeDb{
  constructor(){this.imports=new Map();this.snapshots=new Map();this.byIdempotency=new Map();this.rows=[];this.events=[];}
  prepare(sql){return new FakeStatement(this,sql);}
  async batch(statements){for(const s of statements)await s.run();return statements.map(()=>({success:true}));}
}

const extraction={
  sourceType:"USER_UPLOADED_BROKER_SCREENSHOT",
  brokerName:"TEST",
  accountAlias:"MASKED",
  receivedAt:"2026-10-07T06:00:00Z",
  screenshotCapturedAt:"2026-10-07T05:58:00Z",
  sourceImage:{sha256:"c".repeat(64),referenceId:"upload-1"},
  extractionVersion:"CHAT_VISION_V0_1",
  extractionConfidence:.99,
  rows:[
    {symbol:"2330",companyName:"台積電",quantity:1000,averageCost:1000,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
    {symbol:"2454",companyName:"聯發科",quantity:200,averageCost:1200,currency:"TWD",confidence:{symbol:.99,quantity:.99,averageCost:.99}},
  ],
};
const validation=validateActualHoldingsScreenshotExtractionV0_1({extraction});
const snapshot=await buildActualHoldingsSnapshotV0_1({
  validation,
  confirmation:{
    reviewState:"CONFIRMED",
    reviewedAt:"2026-10-07T06:02:00Z",
    reviewedBy:"OWNER",
    effectiveAsOf:"2026-10-07T05:58:00Z",
    resolvedIssueCodes:validation.reviewIssueCodes,
    confirmedRows:validation.normalizedRows,
  },
});

const db=new FakeDb();
const first=await persistActualHoldingsSnapshotV0_1({db,snapshot});
assert.equal(first.state,"PERSISTED_AND_READBACK_VERIFIED");
assert.equal(first.persisted,true);
assert.equal(first.readbackVerified,true);
assert.equal(first.rowCount,2);
assert.equal(first.brokerApiUsed,false);
assert.equal(first.realOrdersEnabled,false);
assert.equal(first.liveCapitalAuthority,false);
assert.equal(db.snapshots.size,1);
assert.equal(db.rows.length,2);

const second=await persistActualHoldingsSnapshotV0_1({db,snapshot});
assert.equal(second.state,"IDEMPOTENT_EXISTING");
assert.equal(second.persisted,false);
assert.equal(db.snapshots.size,1);
assert.equal(db.rows.length,2);

const loaded=await readLatestActualHoldingsSnapshotV0_1(db,{accountAlias:"MASKED"});
assert.equal(loaded.snapshotId,snapshot.snapshotId);
assert.equal(loaded.holdings.length,2);
assert.equal(loaded.immutable,true);
assert.equal(loaded.sourceType,"USER_UPLOADED_BROKER_SCREENSHOT");

await assert.rejects(
  ()=>persistActualHoldingsSnapshotV0_1({db,snapshot:{...snapshot,sourceType:"BROKER_API"}}),
  /unauthorized actual-holdings source/,
);
await assert.rejects(
  ()=>persistActualHoldingsSnapshotV0_1({db,snapshot:{...snapshot,realOrdersEnabled:true}}),
  /broker\/order authority boundary violated/,
);

console.log("System2 actual holdings persistence V0.1 tests PASS");
