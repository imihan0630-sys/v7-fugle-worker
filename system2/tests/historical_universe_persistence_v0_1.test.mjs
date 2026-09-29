import assert from "node:assert/strict";
import {
  buildHistoricalUniverseRegistryV0_1,
  persistHistoricalUniverseRegistryV0_1,
} from "../runtime/historical_universe_registry_v0_1.mjs";

class Statement {
  constructor(db,sql){this.db=db;this.sql=sql.replace(/\s+/g," ").trim();this.params=[];}
  bind(...params){this.params=params;return this;}
  async first(){
    if(this.sql.includes("s2_historical_universe_registry_receipts"))return this.db.receipts.find((row)=>row.registry_id===this.params[0])||null;
    return null;
  }
  async all(){
    if(this.sql.includes("s2_historical_universe_memberships"))return {results:this.db.memberships.filter((row)=>row.registry_id===this.params[0])};
    return {results:[]};
  }
  async run(){
    if(this.sql.startsWith("INSERT INTO s2_historical_universe_registry_receipts")){
      const p=this.params;
      this.db.receipts.push({registry_id:p[0],registry_hash:p[1],dataset_start_date:p[2],membership_count:p[3],symbol_market_count:p[4],replay_eligible_count:p[5],unknown_start_count:p[6],current_count:p[7],delisted_count:p[8],observed_at:p[9],persisted_at:p[10],schema_version:p[11]});
      return {success:true};
    }
    throw new Error("unsupported fake universe run SQL");
  }
}
class Db{
  constructor(){this.memberships=[];this.receipts=[];}
  prepare(sql){return new Statement(this,sql);}
  async batch(statements){
    return statements.map((statement)=>{
      const p=statement.params;
      this.memberships.push({membership_id:p[0],registry_id:p[1],market:p[2],symbol:p[3],company_name:p[4],industry:p[5],member_state:p[6],dataset_start_date:p[7],listing_date:p[8],delisting_date:p[9],first_trading_date:p[10],effective_from:p[11],effective_to:p[12],start_basis:p[13],end_basis:p[14],replay_eligible:p[15],source_id:p[16],source_name:p[17],source_url:p[18],source_row_hash:p[19],quality_flags_json:p[20],observed_at:p[21],membership_hash:p[22],schema_version:p[23]});
      return {success:true};
    });
  }
}

const registry=await buildHistoricalUniverseRegistryV0_1({
  registryId:"REGISTRY-2017-V1",datasetStartDate:"2017-01-01",observedAt:"2026-09-28T14:30:00Z",
  sourceRows:[
    {market:"TWSE",symbol:"2330",companyName:"台積電",industry:"半導體",memberState:"CURRENT",listingDate:"1994-09-05",sourceId:"TWSE-ISIN",sourceName:"TWSE ISIN",sourceRowHash:"twse-2330"},
    {market:"TPEX",symbol:"1566",companyName:"捷邦",industry:"電機",memberState:"DELISTED",listingDate:"2004-02-09",delistingDate:"2020-11-09",sourceId:"TPEX-DELIST",sourceName:"TPEx delisting",sourceRowHash:"tpex-1566"},
  ],
});
const db=new Db();
const first=await persistHistoricalUniverseRegistryV0_1({db,registry,persistedAt:"2026-09-28T14:31:00Z",insertChunkSize:1});
assert.equal(first.state,"COMPLETE");
assert.equal(first.insertedMembershipCount,2);
assert.equal(db.receipts.length,1);
assert.equal(db.memberships.find((row)=>row.symbol==="2330").effective_from,"2017-01-01");
assert.equal(db.memberships.find((row)=>row.symbol==="1566").effective_to,"2020-11-09");

const second=await persistHistoricalUniverseRegistryV0_1({db,registry,persistedAt:"2026-09-28T14:32:00Z"});
assert.equal(second.state,"ALREADY_COMPLETE");
assert.equal(second.identicalMembershipCount,2);

const removed=db.memberships.pop();
await assert.rejects(
  ()=>persistHistoricalUniverseRegistryV0_1({db,registry,persistedAt:"2026-09-28T14:32:30Z"}),
  /IMMUTABLE_CONFLICT completed historical universe membership set/,
);
db.memberships.push(removed);

const changed={...registry,registryHash:"different"};
await assert.rejects(
  ()=>persistHistoricalUniverseRegistryV0_1({db,registry:changed,persistedAt:"2026-09-28T14:33:00Z"}),
  /IMMUTABLE_CONFLICT historical universe registry/,
);

console.log("System2 historical universe persistence v0.1 tests passed");
