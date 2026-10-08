import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { verifySystem2SegmentSchemaReadonlyV0_1 } from "../runtime/historical_segment_schema_readonly_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
try{
  assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
  assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");
  const db=await createRemoteD1RestAdapter({
    accountId,apiToken,databaseName:"system2-research",
  });
  const verdict=await verifySystem2SegmentSchemaReadonlyV0_1({db});
  assert.equal(db.metrics.rowsWritten,0,"read-only preflight wrote D1");
  console.log(JSON.stringify({...verdict,d1Metrics:{
    requestCount:db.metrics.requestCount,rowsRead:db.metrics.rowsRead,
    rowsWritten:db.metrics.rowsWritten,
  }},null,2));
}catch(error){
  console.error(JSON.stringify({
    result:"BLOCKED_EXISTING_SEGMENT_SCHEMA_PREFLIGHT",
    databaseName:"system2-research",
    error:String(error?.message||error).slice(0,700),
    mutationPerformed:false,
    system1RuntimeUsed:false,
    upgradeRequired:false,
    detail:"Fail-closed; never provision or write sentinels inside a backfill workflow.",
  },null,2));
  process.exitCode=1;
}
