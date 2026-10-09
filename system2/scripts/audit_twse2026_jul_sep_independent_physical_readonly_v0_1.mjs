import assert from "node:assert/strict";
import {writeFile} from "node:fs/promises";
import {createRemoteD1RestAdapter} from "../deploy/remote_d1_rest_adapter.mjs";
import {createRemoteR2S3Adapter} from "../deploy/remote_r2_s3_adapter.mjs";
import {auditTwse2026JulSepPhysicalReadonlyV0_1} from "../runtime/twse2026_jul_sep_independent_physical_readonly_v0_1.mjs";

const RUN_ID=37871005381;
const HEAD_SHA="687432470b8ec81126356edb03d993d8d69df82a";
const REPO="imihan0630-sys/v7-fugle-worker";
const output=String(process.env.SYSTEM2_TWSE_JUL_SEP_PHYSICAL_OUTPUT||"/tmp/s2-twse2026-jul-sep-physical.json");
const token=process.env.GITHUB_TOKEN;
let db=null,stage="GITHUB_ORIGINAL_RUN_TERMINAL_GATE";
const completed=[];
let result={result:"BLOCKED_FAIL_CLOSED",reason:null,stage,completed,runId:RUN_ID,
  d1RowsWritten:0,system1RuntimeUsed:false,sourceFirstKnownAtCertified:false,
  ncT01PromotionAuthorized:false,liveSelectionAuthorized:false};
try{
  assert.equal(process.env.SYSTEM2_PHYSICAL_READ_BUDGET_COORDINATED,"true","REMEDIATION_READ_BUDGET_NOT_COORDINATED");
  assert.equal(process.env.SYSTEM2_PHYSICAL_NO_CONCURRENT_WRITER_ACK,"true","SINGLE_WRITER_ACK_REQUIRED");
  assert.ok(token,"github.token actions:read is required");
  const response=await fetch("https://api.github.com/repos/"+REPO+"/actions/runs/"+RUN_ID,{
    headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json",
      "X-GitHub-Api-Version":"2022-11-28"},
    signal:AbortSignal.timeout(20000),
  });
  if(!response.ok)throw Error("GITHUB_RUN_READ_HTTP_"+response.status);
  const run=await response.json();
  assert.equal(run.id,RUN_ID);
  assert.equal(run.head_sha,HEAD_SHA,"original workflow ref mismatch");
  assert.equal(run.head_branch,"main");
  assert.equal(run.event,"push");
  assert.equal(run.run_attempt,1);
  assert.equal(run.status,"completed","ORIGINAL_BACKFILL_NOT_COMPLETE");
  assert.equal(run.conclusion,"success","ORIGINAL_BACKFILL_NOT_SUCCESS");
  stage="INDEPENDENT_ISOLATED_STORAGE_READBACK";
  const accountId=process.env.CLOUDFLARE_ACCOUNT_ID,apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
  const keyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID,secret=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
  const bucket=process.env.SYSTEM2_R2_BUCKET;
  assert.ok(accountId&&apiToken&&keyId&&secret&&bucket,"isolated read credentials absent");
  db=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:"system2-research"});
  const objectStore=createRemoteR2S3Adapter({
    accountId,accessKeyId:keyId,secretAccessKey:secret,bucketName:bucket});
  const verified=await auditTwse2026JulSepPhysicalReadonlyV0_1({
    db,objectStore,onMonth:row=>{completed.push(row);console.log("JUL_SEP_MONTH_PHYSICAL_PASS "+JSON.stringify(row));},
  });
  assert.equal(db.metrics.rowsWritten,0);
  result={...verified,observedAt:new Date().toISOString(),originalRunId:RUN_ID,
    originalRunHeadSha:HEAD_SHA,originalRunAttempt:1,
    d1Metrics:{requestCount:db.metrics.requestCount,rowsRead:db.metrics.rowsRead,
      rowsWritten:db.metrics.rowsWritten},sourceFirstKnownAtCertified:false,
    ncT01PromotionAuthorized:false,liveSelectionAuthorized:false};
}catch(error){
  result={result:"BLOCKED_FAIL_CLOSED",stage,reason:String(error?.message||error).slice(0,350),
    originalRunId:RUN_ID,originalRunHeadSha:HEAD_SHA,
    completedMonths:completed,failedMonth:[7,8,9][completed.length]||null,
    d1Metrics:{requestCount:db?.metrics?.requestCount??null,
      rowsRead:db?.metrics?.rowsRead??null,rowsWritten:db?.metrics?.rowsWritten??null},
    noD1WritesWereRequested:true,noR2WritesWereRequested:true,
    historicalFirstKnownAtCertified:false,corporateActionNoEventCertified:false,
    ncT01PromotionAuthorized:false,marketYearReplayPromoted:false,system1RuntimeUsed:false};
  process.exitCode=1;
}
await writeFile(output,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_TWSE_JUL_SEP_INDEPENDENT_PHYSICAL_RESULT "+JSON.stringify(result));
