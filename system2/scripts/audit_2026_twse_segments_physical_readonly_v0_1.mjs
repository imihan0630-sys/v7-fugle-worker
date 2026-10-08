import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { auditSegmentMonthsReadonlyV0_1 } from "../runtime/historical_segment_physical_readonly_audit_v0_1.mjs";

const outputPath=String(process.env.SYSTEM2_SEGMENT_READONLY_OUTPUT||"").trim();
const selected=String(process.env.SYSTEM2_SEGMENT_READONLY_MONTH||"ALL").trim().toUpperCase();
const months=selected==="ALL"?[1,2,3,4,5,6]:/^[1-6]$/.test(selected)?[Number(selected)]:null;
assert.ok(months,"allowed month selection ALL or January..June");
const complete=[];
let db=null;
try{
  const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
  const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
  const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
  const bucketName=process.env.SYSTEM2_R2_BUCKET;
  assert.ok(accountId&&apiToken&&accessKeyId&&secretAccessKey&&bucketName,
    "isolated R2/D1 credentials required");
  db=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:"system2-research"});
  const objectStore=createRemoteR2S3Adapter({
    accountId,accessKeyId,secretAccessKey,bucketName,
  });
  const result=await auditSegmentMonthsReadonlyV0_1({
    db,objectStore,months,onMonth:item=>{
      complete.push(item);
      console.log("S2_PHYSICAL_MONTH_PASS "+JSON.stringify(item));
    },
  });
  const output={
    ...result,observedAt:new Date().toISOString(),
    d1Metrics:{rowsRead:db.metrics.rowsRead,rowsWritten:db.metrics.rowsWritten},
    provenanceCaveat:"PRE_FIX_2026_JAN_JUN_PIT_SOURCE_CLOCK_UNVERIFIED",
  };
  if(outputPath)await writeFile(outputPath,JSON.stringify(output,null,2)+"\n","utf8");
  console.log("S2_PHYSICAL_READONLY_RESULT "+JSON.stringify(output));
}catch(error){
  const failure={
    result:"BLOCKED_2026_SEGMENT_PHYSICAL_READONLY",
    requestedMonths:months,completed:complete,failedMonth:months[complete.length]??null,
    error:String(error?.message||error).slice(0,600),
    d1RowsWritten:db?.metrics?.rowsWritten??null,
    system1RuntimeUsed:false,
    schemaVersion:"S2_2026_TWSE_SEGMENT_PHYSICAL_READONLY_V0_1",
  };
  console.error("S2_PHYSICAL_READONLY_BLOCKED "+JSON.stringify(failure));
  if(outputPath)await writeFile(outputPath,JSON.stringify(failure,null,2)+"\n","utf8");
  process.exitCode=1;
}
