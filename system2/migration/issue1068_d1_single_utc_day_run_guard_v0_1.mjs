// Issue #1068. Account/day writer exclusivity for owner-authorized RAW source copy.
// Read only GitHub Actions evidence. Block a later scheduled duplicate of a
// main-push/manual write on the SAME UTC day, even if prior execution failed
// after partial inserts. Existing GHA concurrency also serializes overlapping jobs.
export function assessSameUtcDayPriorWriterRuns({runs,runId,quotaDayUtc}){
 if(!Array.isArray(runs)||!/^20\d\d-\d\d-\d\d$/.test(quotaDayUtc)||
    !Number.isSafeInteger(runId)||runId<1)throw Error("S2_D1_GUARD_INVALID_RUN_INPUT");
 const others=[];
 for(const x of runs){
  if(!Number.isSafeInteger(x?.id)||!["push","workflow_dispatch","schedule"].includes(x.event)||
     typeof x.created_at!=="string")throw Error("S2_D1_GUARD_MALFORMED_WORKFLOW_RUN");
  if(x.id===runId||x.created_at.slice(0,10)!==quotaDayUtc)continue;
  // Every schedule/manual invocation is an intended writer; a push must carry
  // the explicit owner-command marker, otherwise its job is inert/skipped.
  const writer=x.event!=="push" || String(x.head_commit?.message||"").includes("S2_OWNER_OVERRIDE_RAW_COPY_20261012");
  if(writer)others.push({id:x.id,event:x.event,status:x.status,conclusion:x.conclusion||null});
 }
 return {canProceed:others.length===0,blockerCount:others.length,
  earlierWriterRunIds:others.map(x=>x.id)};
}
export async function verifyOneWriterPerUtcDay({request=globalThis.fetch,
 ownerRepo=process.env.GITHUB_REPOSITORY,token=process.env.GITHUB_TOKEN,
 runId=Number(process.env.GITHUB_RUN_ID),quotaDayUtc=new Date().toISOString().slice(0,10)}={}){
 if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(ownerRepo||"")||!token||!Number.isSafeInteger(runId))
   throw Error("S2_D1_GUARD_GITHUB_IDENTITY_INVALID");
 const workflow="system2-owner-override-raw-d1-copy-20261012.yml";
 const link="https://api.github.com/repos/"+ownerRepo+"/actions/workflows/"+workflow+"/runs?per_page=100";
 const q=await request(link,{method:"GET",headers:{
  Accept:"application/vnd.github+json",
  Authorization:"Bearer "+token,
  "X-GitHub-Api-Version":"2022-11-28"
 },signal:AbortSignal.timeout(20000)});
 if(!q.ok)throw Error("S2_D1_GUARD_GITHUB_RUN_LIST_NOT_AUTHORIZED");
 const obj=await q.json();
 if(!Array.isArray(obj?.workflow_runs)||!Number.isSafeInteger(obj.total_count))
  throw Error("S2_D1_GUARD_BAD_RESPONSE");
 if(obj.total_count>=100)throw Error("S2_D1_GUARD_PAGINATION_UNTRUSTED");
 if(!obj.workflow_runs.some(x=>x.id===runId))throw Error("S2_D1_GUARD_CURRENT_RUN_NOT_RETURNED");
 const result=assessSameUtcDayPriorWriterRuns({runs:obj.workflow_runs,runId,quotaDayUtc});
 if(!result.canProceed)throw Error("S2_D1_GUARD_SAME_DAY_WRITER_ALREADY_STARTED");
 return {status:"S2_GUARD_UNIQUE_RAW_COPY_WRITER_FOR_UTC_DAY",quotaDayUtc,runId,
  checkedWorkflowRuns:obj.workflow_runs.length,cloudflareQueries:0,
  dailyBilledWriteBudget:80000,permissionForAdditionalWriter:false};
}
if(import.meta.url===new URL("file://"+process.argv[1]).href){
 try{const x=await verifyOneWriterPerUtcDay();
   console.log(JSON.stringify(x));
 }catch(e){console.error(String(e?.message||"S2_D1_GUARD_REJECTED"));process.exitCode=2;}
}
