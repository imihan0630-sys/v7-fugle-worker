import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile,writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import {
  FROZEN_RECENT60_SAMPLE_BLOB_SHA,
  auditFrozenRecent60JulyHotColdV0_1,
} from "../runtime/recent60_july_hot_cold_source_readonly_v0_1.mjs";
import { probeJulyOfficialSourceReadonlyV0_1 } from
  "../runtime/recent60_july_official_source_probe_v0_1.mjs";

const frozenPath=new URL("../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json",import.meta.url);
const outputPath=String(process.env.SYSTEM2_RECENT60_JULY_BRIDGE_OUTPUT||"").trim();
let db=null,result=null,stage="INIT",samplesDone=[];
try{
  stage="FROZEN_SAMPLE_PROVENANCE";
  const content=await readFile(frozenPath);
  const gitBlob=createHash("sha1")
    .update("blob "+content.byteLength+"\0").update(content).digest("hex");
  assert.equal(gitBlob,FROZEN_RECENT60_SAMPLE_BLOB_SHA,
    "frozen original sampled D1 gap evidence changed; fail closed");
  const frozenEvidence=JSON.parse(content.toString("utf8"));
  const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
  const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
  const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
  const bucketName=process.env.SYSTEM2_R2_BUCKET;
  assert.ok(accountId&&apiToken&&accessKeyId&&secretAccessKey&&bucketName,
    "isolated System2 D1 and R2 credentials required");
  stage="CREATE_READONLY_REMOTE_ADAPTERS";
  db=await createRemoteD1RestAdapter({
    accountId,apiToken,databaseName:"system2-research",
  });
  const objectStore=createRemoteR2S3Adapter({
    accountId,accessKeyId,secretAccessKey,bucketName,
  });
  stage="AUDIT_HOT_D1_VS_COLD_R2_JULY";
  const bridge=await auditFrozenRecent60JulyHotColdV0_1({
    db,objectStore,frozenEvidence,
    onSymbol:row=>{
      samplesDone.push({market:row.market,symbol:row.symbol,
        manifests:row.julySegmentManifestCount,
        hotRows:row.checks.reduce((v,d)=>v+d.hotRawRowCount,0)});
      console.log("S2_RECENT60_JULY_SYMBOL_CHECK "+JSON.stringify(samplesDone.at(-1)));
    },
  });
  stage="PROBE_POST_FACTO_OFFICIAL_JULY_SAMPLE";
  // Each official source probe is an independent GET on a historical date.
  // It is NOT evidence of the source's first publication time in July.
  const official=await probeJulyOfficialSourceReadonlyV0_1({
    samples:bridge.symbols,
  });
  assert.equal(db.metrics.rowsWritten,0,"D1 write boundary breached");
  result={
    schemaVersion:"S2_RECENT60_JULY_THREE_LAYER_READONLY_PHYSICAL_ARTIFACT_V0_1",
    result:"PASS_RETROSPECTIVE_BOUNDED_READONLY_GAP_RECONCILIATION",
    observedAt:new Date().toISOString(),
    frozenEvidencePath:"system2/evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json",
    frozenEvidenceGitBlobSha:gitBlob,
    bridge,official,
    d1Metrics:{requestCount:db.metrics.requestCount,
      rowsRead:db.metrics.rowsRead,rowsWritten:db.metrics.rowsWritten},
    protected:{
      d1Writes:0,r2Writes:0,officialApiWrites:0,
      firstKnownAtBackdated:false,noEventInferred:false,
      pitHistoryReadyPromoted:false,technicalContinuityCertified:false,
      ncT01Accepted:false,system1RuntimeUsed:false,selectionOrPushAuthorized:false,
    },
  };
  console.log("S2_RECENT60_JULY_THREE_LAYER_RESULT "+JSON.stringify({
    result:result.result,coldReceipts:bridge.julyMonthReceipts,
    causes:bridge.causeCounts,sourceDatesVerifiedNow:official.verifiedDateCount,
    sourceDatesRequested:official.requestedDateCount,
    d1Reads:db.metrics.rowsRead,d1Writes:db.metrics.rowsWritten,
    readyForReplay:false,
  }));
}catch(error){
  result={
    schemaVersion:"S2_RECENT60_JULY_THREE_LAYER_READONLY_PHYSICAL_ARTIFACT_V0_1",
    result:"BLOCKED_RETROSPECTIVE_READONLY_THREE_LAYER_RECONCILIATION",
    stage,observedAt:new Date().toISOString(),
    samplesDone,
    errorName:String(error?.name||"Error"),
    errorMessage:String(error?.message||error).slice(0,700),
    d1RowsWritten:db?.metrics?.rowsWritten??null,
    noColdOfficialPhysicalAbsenceConclusion:true,
    strategyOrReplayAuthorized:false,system1RuntimeUsed:false,
  };
  console.error("S2_RECENT60_JULY_THREE_LAYER_BLOCKED "+JSON.stringify(result));
  process.exitCode=1;
}
if(outputPath)await writeFile(outputPath,JSON.stringify(result,null,2)+"\n","utf8");
