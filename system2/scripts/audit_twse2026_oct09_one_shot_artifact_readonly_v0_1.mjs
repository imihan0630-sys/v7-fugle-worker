// Read-only GitHub Actions artifact audit for one frozen 2026 TWSE run.
// Uses github.token/actions:read only. No Cloudflare secrets, D1, R2 or trading API.
import {createHash} from "node:crypto";
import {readFile,writeFile,mkdtemp,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {auditTwse2026Oct09OneShotArtifactV0_1} from "../runtime/historical_current_year_segment_one_shot_artifact_acceptance_v0_1.mjs";

const REPO="imihan0630-sys/v7-fugle-worker";
const RUN_ID=37871005381;
const NAME="system2-2026-twse-oct09-one-shot-"+RUN_ID+"-1";
const PAYLOAD_NAME="system2-current-year-segments-TWSE.json";
const API="https://api.github.com/repos/"+REPO;
const out=process.env.SYSTEM2_TWSE2026_OCT09_AUDIT_OUTPUT || "/tmp/s2-twse2026-oct09-artifact-audit.json";
const token=process.env.GITHUB_TOKEN;
const sha256=bytes=>createHash("sha256").update(bytes).digest("hex");

async function getJson(url){
  if(!token)throw Error("GITHUB_TOKEN_NOT_AVAILABLE");
  if(!url.startsWith(API+"/"))throw Error("GITHUB_API_SCOPE_FORBIDDEN");
  const response=await fetch(url,{headers:{
    Authorization:"Bearer "+token,
    Accept:"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28",
  },signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error("GITHUB_READ_HTTP_"+response.status);
  return await response.json();
}

let stage="INIT",temp=null;
let report={
  schemaVersion:"S2_TWSE2026_OCT09_ARTIFACT_READONLY_RUN_REPORT_V0_1",
  result:"BLOCKED_FAIL_CLOSED",checkedOriginalRunId:RUN_ID,
  cloudflareReadsPerformed:0,cloudflareWritesPerformed:0,
  originalPITFirstKnownAtCertified:false,independentR2D1ReadbackCertified:false,
  noEventCertified:false,technicalContinuityCertified:false,
  ncT01PromotionAuthorized:false,strategyReplayAuthorized:false,
  productionSelectionAuthorized:false,system1FormalCoreTouched:false,
};
try{
  stage="FETCH_EXACT_GITHUB_RUN";
  const run=await getJson(API+"/actions/runs/"+RUN_ID);
  stage="FETCH_RUN_ARTIFACT_INDEX";
  const artifacts=await getJson(API+"/actions/runs/"+RUN_ID+"/artifacts?per_page=100");
  const found=(artifacts.artifacts||[]).filter(x=>x.name===NAME&&!x.expired);
  if(found.length!==1)throw Error("ONE_SHOT_ARTIFACT_COUNT_NOT_EXACTLY_ONE");
  const artifact=found[0];
  if(!Number.isSafeInteger(artifact.id)||artifact.id<=0||
    !/^sha256:[a-f0-9]{64}$/.test(artifact.digest||"")||
    artifact.workflow_run?.id!==RUN_ID||
    artifact.archive_download_url!==API+"/actions/artifacts/"+artifact.id+"/zip")
    throw Error("ARTIFACT_DIGEST_OR_RUN_PROVENANCE_INVALID");

  stage="DOWNLOAD_EXACT_ARTIFACT_ZIP";
  temp=await mkdtemp(join(tmpdir(),"s2-one-shot-readonly-"));
  const zipFile=join(temp,"original-github-artifact.zip");
  const curl=spawnSync("curl",[
    "--fail","--location","--silent","--show-error","--max-time","90",
    "--header","Authorization: Bearer "+token,
    "--header","Accept: application/vnd.github+json",
    "--output",zipFile,artifact.archive_download_url
  ],{encoding:"utf8",timeout:100000,maxBuffer:1024*1024});
  if(curl.status!==0)throw Error("ORIGINAL_ARTIFACT_DOWNLOAD_FAILED");
  const zip=await readFile(zipFile);
  if(zip.length===0||zip.length>10_000_000)throw Error("ARTIFACT_ZIP_UNEXPECTED_SIZE");
  if("sha256:"+sha256(zip)!==artifact.digest)throw Error("ORIGINAL_ARTIFACT_ZIP_SHA256_MISMATCH");

  stage="PARSE_MONTHLY_RESULT";
  const raw=spawnSync("unzip",["-p",zipFile,PAYLOAD_NAME],{
    encoding:"utf8",timeout:20000,maxBuffer:20_000_000,
  });
  if(raw.status!==0||!raw.stdout)throw Error("MONTHLY_JSON_NOT_FOUND_IN_ORIGINAL_ARTIFACT");
  const payload=JSON.parse(raw.stdout);
  const baseline=JSON.parse(await readFile(new URL(
    "../evidence/S2_2026_TWSE_JAN_JUN_INDEPENDENT_R2_BYTE_VERIFICATION_20261008_V0_1.json",import.meta.url
  ),"utf8"));

  stage="FAIL_CLOSED_ARTIFACT_INTERNAL_EVIDENCE_AUDIT";
  const audit=auditTwse2026Oct09OneShotArtifactV0_1({run,payload,baseline});
  report={
    ...audit,
    auditKind:"GITHUB_ARTIFACT_STRUCTURE_AND_PRODUCER_INTERNAL_PHYSICAL_RECEIPTS_ONLY",
    observedAt:new Date().toISOString(),
    originalRun:{id:run.id,headSha:run.head_sha,runAttempt:run.run_attempt,
      status:run.status,conclusion:run.conclusion},
    immutableArtifact:{id:artifact.id,name:artifact.name,digest:artifact.digest,
      originalJsonSha256:sha256(Buffer.from(raw.stdout,"utf8"))},
    baselineJanJunRunId:baseline.physicalRun.runId,
    sourceMutationPerformed:false,
  };
  if(audit.result!=="PASS_ARTIFACT_INTERNAL_RECEIPTS_ONLY")report.failureStage=stage;
}catch(e){
  report.failureStage=stage;
  report.failureCode=String(e?.message||e).slice(0,160);
}finally{
  if(temp)await rm(temp,{recursive:true,force:true});
}
await writeFile(out,JSON.stringify(report,null,2)+"\n","utf8");
console.log("S2_TWSE2026_OCT09_ARTIFACT_AUDIT "+JSON.stringify(report));
if(report.result!=="PASS_ARTIFACT_INTERNAL_RECEIPTS_ONLY")process.exitCode=1;
