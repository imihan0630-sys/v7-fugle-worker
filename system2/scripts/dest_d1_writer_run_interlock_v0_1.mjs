// Fail-closed GitHub-native cross-workflow single-UTC-day D1 writer guard.
// Guard runs before any target D1/Cloudflare access. It DOES NOT allocate rowsWritten,
// create an atomic Cloudflare D1 lease, or assert Cloudflare Analytics freshness.
// It is an additional source-only exclusion alongside identical job-level concurrency.
// No use of Cloudflare token, billing, external AI, or GitHub mutable endpoint.
import {mkdir,writeFile,appendFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
const REPO="imihan0630-sys/v7-fugle-worker";
export const DEST_WRITER_LOCK="s2-dest-d1-historical-and-diagnostic-writer";
export const WORKFLOWS=Object.freeze({
 RAW_COPY:"system2-owner-override-raw-d1-copy-20261012.yml",
 DAILY_DIAGNOSTIC:"system2-daily-shadow-diagnostic.yml",
 RECENT_A1_WARMUP:"system2-recent-a1-hot-history-warmup.yml"
});
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+"T00:00:00.000Z"));
const isoUtcDay=d=>d.toISOString().slice(0,10);
function otherDay(day){const x=new Date(day+"T00:00:00.000Z");x.setUTCDate(x.getUTCDate()-1);return isoUtcDay(x)}
function isMainRun(r){
 return r&&r.head_branch==="main"&&typeof r.created_at==="string"&&/^\d{4}-\d{2}-\d{2}T/.test(r.created_at);
}
export function decideDestinationD1DayGuard({writerId,utcDay,currentRuns,previousRuns}){
 if(!WORKFLOWS[writerId]||!validDate(utcDay)||!Array.isArray(currentRuns)||!Array.isArray(previousRuns))throw Error("BAD_DEST_DAY_INTERLOCK_INPUT");
 const prior=otherDay(utcDay);
 // Only completed-and-SKIPPED diagnostic PUSH runs are demonstrably inert.
 // The DIAGNOSTIC job on GitHub main explicitly disallows all PUSH events.
 // We still block pending/queued PUSH (result not yet final) and every
 // schedule/manual other run, even skipped, because it may have performed writes.
 const otherIds=Object.keys(WORKFLOWS).filter(id=>id!==writerId);
 // GH run data from provider is tagged by originating workflow at the read-only boundary.
 // Legacy test rows lacking originWriterId are accepted only when ONE competitor is named,
 // otherwise conservatively counted as potential, never silently ignored.
 const potential=r=>isMainRun(r)&&!((r.originWriterId==="DAILY_DIAGNOSTIC"||
      (!r.originWriterId&&otherIds.length===1&&otherIds[0]==="DAILY_DIAGNOSTIC"))&&
      r.event==="push"&&r.status==="completed"&&r.conclusion==="skipped");
 const ignoredInert=currentRuns.filter(r=>isMainRun(r)&&r.created_at.startsWith(utcDay+"T")&&!potential(r));
 const today=currentRuns.filter(r=>potential(r)&&r.created_at.startsWith(utcDay+"T"));
 // Prior-day late runs may continue into this UTC day, including delayed queues.
 // Conservatively block all potentially writing runs from prior day after 22Z.
 const boundary=previousRuns.filter(r=>potential(r)&&r.created_at.startsWith(prior+"T")&&
     r.created_at.slice(11,16)>="22:00");
 const reasons=[];
 if(today.length)reasons.push("COMPETING_WORKFLOW_OCCURRED_THIS_UTC_DAY");
 if(boundary.length)reasons.push("PREVIOUS_DAY_LATE_RUN_POSSIBLE_SPILLOVER");
 return Object.freeze({
   contract:"S2_DEST_D1_CROSS_WORKFLOW_UTC_DAY_FAIL_CLOSED_V0_1",writerId,utcDay,
   competingWorkflows:otherIds.map(id=>WORKFLOWS[id]),
   sameDayOtherRunCount:today.length,priorBoundaryOtherRunCount:boundary.length,
   ignoredProvenInertDiagnosticPushRunCount:ignoredInert.length,
   sampledOtherRunIds:[...today,...boundary].map(x=>x.id).filter(x=>Number.isSafeInteger(x)).slice(0,15),
   allowed:reasons.length===0,reasons,
   nonCloudflareBudgetAssertion:true,atomicCloudflareLedgerProven:false,
   coversExactlyRegisteredDestinationWriters:3,
   excludesOnlyTwoRegisteredDestinationWriters:false
 });
}
export function validateProviderRunList(v){
 if(!v||!Array.isArray(v.workflow_runs)||!Number.isInteger(v.total_count)||v.total_count<0)throw Error("GITHUB_RUN_LIST_MALFORMED");
 if(v.total_count>100||v.workflow_runs.length!==v.total_count)throw Error("GITHUB_RUN_LIST_PAGINATION_INCOMPLETE");
 if(v.workflow_runs.some(r=>!Number.isSafeInteger(r.id)||!r.created_at||typeof r.created_at!=="string"||typeof r.head_branch!=="string"||typeof r.event!=="string"||typeof r.status!=="string"))throw Error("GITHUB_RUN_DATA_INCOMPLETE");
 return v.workflow_runs;
}
async function queryOtherRuns({repo,token,workflow,day,fetchImpl}){
 const path="/repos/"+repo+"/actions/workflows/"+workflow+"/runs?per_page=100&created="+encodeURIComponent(day);
 const result=await fetchImpl("https://api.github.com"+path,{
   method:"GET",headers:{authorization:"Bearer "+token,accept:"application/vnd.github+json",
     "X-GitHub-Api-Version":"2022-11-28"},signal:AbortSignal.timeout(22000)});
 if(!result.ok)throw Error("GITHUB_CROSS_WORKFLOW_READ_"+result.status);
 return validateProviderRunList(await result.json());
}
export async function inspectRealGuard({writerId,now=new Date(),repo,token,fetchImpl=fetch}){
 if(repo!==REPO||!token||!WORKFLOWS[writerId]||!(now instanceof Date)||Number.isNaN(now.getTime()))throw Error("DEST_DAY_INTERLOCK_ENV_INVALID");
 const day=isoUtcDay(now),prior=otherDay(day);
 const otherIds=Object.keys(WORKFLOWS).filter(id=>id!==writerId);
 const evidence=await Promise.all(otherIds.flatMap(id=>[
   queryOtherRuns({repo,token,workflow:WORKFLOWS[id],day,fetchImpl}).then(rows=>({id,day,rows})),
   queryOtherRuns({repo,token,workflow:WORKFLOWS[id],day:prior,fetchImpl}).then(rows=>({id,day:prior,rows}))
 ]));
 const tagged=(date)=>evidence.filter(x=>x.day===date).flatMap(x=>x.rows.map(r=>({...r,originWriterId:x.id})));
 return decideDestinationD1DayGuard({writerId,utcDay:day,currentRuns:tagged(day),previousRuns:tagged(prior)});
}
export async function main(){
 const writerId=process.env.S2_DEST_WRITER_CLASS,repo=process.env.GITHUB_REPOSITORY;
 const token=process.env.GITHUB_TOKEN,runId=process.env.GITHUB_RUN_ID;
 if(!/^\d+$/.test(runId||"")||process.env.GITHUB_REF!=="refs/heads/main")throw Error("DEST_DAY_WRITER_ONLY_ON_MAIN");
 // Default output is always DENY; any exception fails the entire job before remote D1.
 const out=process.env.GITHUB_OUTPUT;
 if(!out)throw Error("GITHUB_OUTPUT_REQUIRED_FAIL_CLOSED");
 await appendFile(out,"allowed=false\n");
 const result=await inspectRealGuard({writerId,repo,token});
 const receipt={...result,runId:Number(runId),checkedAtUtc:new Date().toISOString(),
   inspectedGithubOriginal:true,cloudflareD1MutationCount:0,cloudflareCalls:0};
 const folder="/tmp/s2-dest-d1-writer-day-interlock";await mkdir(folder,{recursive:true});
 await writeFile(folder+"/receipt.json",JSON.stringify(receipt,null,2)+"\n",{flag:"w",mode:0o600});
 if(result.allowed)await appendFile(out,"allowed=true\n");
 if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,
   "\n## DEST D1 UTC-day cross-writer preflight\n"+writerId+" "+(result.allowed?"PRECHECK_UNBLOCKED_NOT_A_D1_QUOTA_GRANT":"DEFERRED_NO_D1_WRITES")+
   "; competing runs "+result.sameDayOtherRunCount+"; late previous day "+result.priorBoundaryOtherRunCount+"\n");
 console.log(JSON.stringify({writerId,utcDay:result.utcDay,allowed:result.allowed,reasons:result.reasons,
   otherSameDay:result.sameDayOtherRunCount,otherPriorBoundary:result.priorBoundaryOtherRunCount,
   cloudflareWrites:0,receipt:folder+"/receipt.json"}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])
 main().catch(e=>{console.error("DEST_D1_DAY_INTERLOCK_FAIL_CLOSED",String(e?.message||e).slice(0,130));process.exitCode=2});
