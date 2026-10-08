import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1,
  SYSTEM2_SEGMENT_REQUIRED_COLUMNS_V0_1,
  verifySystem2SegmentSchemaReadonlyV0_1,
} from "../runtime/historical_segment_schema_readonly_v0_1.mjs";

function fakeDb({version="1.1",missingTable=null,missingColumn=null,writeAfterQuery=false}={}){
  const statements=[];
  const metrics={requestCount:0,rowsRead:0,rowsWritten:0};
  const db={
    database:{name:"system2-research"},metrics,statements,
    async rawQuery(sql,params=[]){
      statements.push({sql,params});
      metrics.requestCount+=1;
      assert.match(sql,/^\s*(SELECT|PRAGMA)\b/i,"schema preflight must use SELECT/PRAGMA only");
      if(writeAfterQuery) metrics.rowsWritten+=1;
      if(sql.includes("FROM s2_schema_meta"))return [{schema_value:version}];
      if(sql.includes("FROM sqlite_schema"))return SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1
        .filter(name=>name!==missingTable).map(name=>({name}));
      const table=SYSTEM2_SEGMENT_REQUIRED_TABLES_V0_1.find(name=>sql.includes(name));
      if(sql.startsWith("PRAGMA table_info(")&&table){
        return SYSTEM2_SEGMENT_REQUIRED_COLUMNS_V0_1[table]
          .filter(name=>name!==missingColumn).map(name=>({name}));
      }
      throw new Error("unexpected readonly SQL: "+sql);
    },
  };
  return db;
}

const db=fakeDb();
const result=await verifySystem2SegmentSchemaReadonlyV0_1({db});
assert.equal(result.result,"PASS_EXISTING_SEGMENT_SCHEMA_READONLY");
assert.equal(result.d1RowsWritten,0);
assert.equal(result.mutationPerformed,false);
assert.equal(db.metrics.rowsWritten,0);
assert.equal(db.statements.length,5);
assert.equal(db.statements.every(x=>/^\s*(SELECT|PRAGMA)\b/i.test(x.sql)),true);

await assert.rejects(()=>verifySystem2SegmentSchemaReadonlyV0_1({db:fakeDb({version:"1.0"})}),/schema version must be 1.1/);
await assert.rejects(()=>verifySystem2SegmentSchemaReadonlyV0_1({db:fakeDb({missingTable:"s2_historical_segment_ingest_receipts"})}),/schema not provisioned/);
await assert.rejects(()=>verifySystem2SegmentSchemaReadonlyV0_1({db:fakeDb({missingColumn:"receipt_id"})}),/required existing schema columns missing/);
await assert.rejects(()=>verifySystem2SegmentSchemaReadonlyV0_1({db:fakeDb({writeAfterQuery:true})}),/must never write D1/);
await assert.rejects(()=>verifySystem2SegmentSchemaReadonlyV0_1({db:{database:{name:"v8-production"},rawQuery:async()=>[],metrics:{rowsWritten:0}}}),/prohibited/);

const workflow=await readFile(new URL("../../.github/workflows/system2-historical-current-year-segment-backfill.yml",import.meta.url),"utf8");
const wrapper=await readFile(new URL("../scripts/historical_segment_schema_readonly_preflight_v0_1.mjs",import.meta.url),"utf8");
assert.match(workflow,/historical_segment_schema_readonly_preflight_v0_1\.mjs/);
assert.match(workflow,/needs: preflight/);
assert.doesNotMatch(workflow,/provision_system2_d1\.mjs/);
assert.doesNotMatch(workflow,/SYSTEM2_CONFIRM: CREATE_SYSTEM2_ISOLATED_D1/);
assert.match(wrapper,/createRemoteD1RestAdapter/);
assert.match(wrapper,/verifySystem2SegmentSchemaReadonlyV0_1/);
assert.doesNotMatch(wrapper,/\.run\s*\(|\.batch\s*\(/);
console.log("System2 2026 segment existing-schema zero-write preflight tests passed");
