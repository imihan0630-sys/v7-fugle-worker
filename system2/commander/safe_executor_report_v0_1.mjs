// Report offline scripted checks; never close issues or claim actual Cloudflare PASS.
import {readFile,appendFile} from "node:fs/promises";
import {join} from "node:path";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
const sha=s=>createHash("sha256").update(s).digest("hex");
export function stableFindingDigest(receipt){
 const projection={schemaVersion:receipt.schemaVersion,selected:receipt.selected,registry:receipt.registry,
  fingerprints:receipt.fingerprints,
  results:Object.fromEntries(Object.entries(receipt.results).map(([id,r])=>[id,{
   state:r.state,findings:r.assessment.findings,assertions:r.assessment.assertions,
   tests:r.tests.map(t=>({path:t.path,passed:t.passed,testCount:t.testCount,failCount:t.failCount}))}]))};
 return sha(JSON.stringify(projection));
}
export function renderEvidenceComment(id,receipt,artifact,digest){
 const r=receipt.results[id],url="https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/"+receipt.github.runId;
 const checks=r.tests.map(t=>t.path.split("/").at(-1)+": "+(t.passed?"PASS":"FAIL")+" (tests="+t.testCount+")").join("; ");
 const problems=r.assessment.findings.join(", ")||"本輪靜態檢查未發現新缺口";
 return "<!-- S2CMD-AUTO-EVIDENCE:"+id+":"+digest+" -->\n"+
  "### [S2CMD-AUTO-OFFLINE] "+id+" — "+r.state+"\n"+
  "原始 Run: "+url+"\n"+
  "原始 Artifact #"+artifact.id+"，名稱 "+artifact.name+"，SHA-256: "+String(artifact.digest||"NOT_REPORTED")+"\n"+
  "source main SHA: "+receipt.github.headSha+"；固定准許檢查結果："+checks+"\n"+
  "發現／待修正："+problems+"\n"+
  "**這僅是 Actions 真正執行的離線檢查**，不是 Cloudflare 設定實體驗收、不是完成該工作室的施工與獨立稽核，也未使任何 Mnn 正式 PASS。GitHub Issues 不會自動喚醒其他 ChatGPT 聊天室，沒有額外 AI/付費/Secret/Worker/Cron/D1 變更。";
}
async function gh(repo,token,path,method="GET",data){
 const response=await fetch("https://api.github.com/repos/"+repo+path,{method,headers:{
  Authorization:"Bearer "+token,Accept:"application/vnd.github+json",
  "X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"
 },signal:AbortSignal.timeout(23000),...(data?{body:JSON.stringify(data)}:{})});
 const v=await response.json().catch(()=>null);
 if(!response.ok)throw Error("GITHUB_RECEIPT_"+method+"_"+response.status);
 return v;
}
async function run(){
 const repo=process.env.GITHUB_REPOSITORY,token=process.env.GITHUB_TOKEN,runId=process.env.GITHUB_RUN_ID;
 if(repo!=="imihan0630-sys/v7-fugle-worker"||!token||!/^\d+$/.test(runId||""))throw Error("UNAUTHORIZED_GITHUB_RECEIPT_CONTEXT");
 const path=join(process.env.RUNNER_TEMP||"/tmp","s2commander-safe-executor","receipt.json");
 const receipt=JSON.parse(await readFile(path,"utf8"));
 if(receipt.schemaVersion!=="S2_COMMANDER_SAFE_EXECUTION_RECEIPT_V0_1"||receipt.github.runId!==runId||receipt.actualCloudflareCalls!==0||receipt.actualCloudflareWrites!==0)throw Error("RECEIPT_IDENTITY_SCOPE_INVALID");
 const artifacts=await gh(repo,token,"/actions/runs/"+runId+"/artifacts?per_page=30");
 const artifact=artifacts.artifacts?.find(x=>x.name==="s2-commander-safe-executor-"+runId);
 if(!artifact?.id||!/^sha256:[a-f0-9]{64}$/.test(artifact.digest||""))throw Error("NO_NATIVE_ARTIFACT_DIGEST_ABORT");
 const digest=stableFindingDigest(receipt);
 const targets={M08:1233,M12:1238},added=[];
 for(const [id,number] of Object.entries(targets)){
  const issue=await gh(repo,token,"/issues/"+number);
  if(issue.state!=="open"||!issue.body.includes("<!-- S2-COMMANDER-TASK:"+id+" -->"))throw Error("TARGET_ISSUE_DRIFT_"+id);
  const comments=await gh(repo,token,"/issues/"+number+"/comments?per_page=100");
  if(!Array.isArray(comments))throw Error("MISSING_COMMENTS");
  const marker="<!-- S2CMD-AUTO-EVIDENCE:"+id+":"+digest+" -->";
  if(comments.some(c=>c.body?.includes(marker)))continue;
  await gh(repo,token,"/issues/"+number+"/comments","POST",{body:renderEvidenceComment(id,receipt,artifact,digest)});
  added.push(id);
 }
 const summary="### Safe engineering Actions source-only receipt\n"+
   "Run https://github.com/"+repo+"/actions/runs/"+runId+
   "\nArtifact #"+artifact.id+" ("+artifact.name+"), digest "+artifact.digest+"\n"+
   "Code truth SHA: "+receipt.github.headSha+"; stable findings SHA: "+digest+".\n"+
   Object.entries(receipt.results).map(([id,r])=>"- "+id+": "+r.state+"; "+r.tests.length+" allowlisted test files; "+r.assessment.findings.length+" findings").join("\n")+
   "\nNo Cloudflare writes, no AI code agent, no formal Mnn signoff.\n";
 if(added.length)await gh(repo,token,"/issues/1229/comments","POST",{body:"[S2CMD-SAFE-EXECUTION-RECEIPT]\n"+summary});
 if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,summary);
 console.log(JSON.stringify({result:"PHYSICAL_GITHUB_SAFE_ACTION_ARTIFACT_AND_CONDITIONAL_ISSUE_REPORT",artifactId:artifact.id,artifactDigest:artifact.digest,issueCommentsAdded:added,sameFindingsDeduplicated:2-added.length,cloudflareWrites:0}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])run().catch(e=>{console.error("S2_SAFE_REPORT_FAIL_CLOSED",e.message);process.exitCode=2});
