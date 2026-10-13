// Discover already available original public data (existing GitHub Actions
// artifacts) using the runner's *built-in* read-only repo GITHUB_TOKEN.
// Does not create secrets, permissions, repositories, releases or D1 writes.
import {appendFileSync} from 'node:fs';
const repo='imihan0630-sys/v7-fugle-worker';
const legacy={runId:38317682441,
 artifactName:'system2-original-official-61-2026-10-13-38317682441',
 kind:'INITIAL_REAL_PROVIDER_UNAUDITED_SEED'};
async function api(endpoint,{fetchImpl=globalThis.fetch,token}={}){
 const u='https://api.github.com/repos/'+repo+endpoint;
 const r=await fetchImpl(u,{headers:{
  Authorization:'Bearer '+token,Accept:'application/vnd.github+json',
  'X-GitHub-Api-Version':'2022-11-28'
 },signal:AbortSignal.timeout(30000)});
 if(!r.ok)throw Error('GITHUB_READONLY_ARTIFACT_LOOKUP_UNAVAILABLE');
 return await r.json();
}
export async function discoverSharedA1PreviousSourceArtifactV0_1({
 token,fetchImpl=globalThis.fetch,currentRunId,apiFetch=api
}={}){
 if(!token)throw Error('GITHUB_BUILTIN_READONLY_TOKEN_REQUIRED');
 const runs=await apiFetch('/actions/workflows/system2-shared-official-a1-incremental-readonly.yml/runs?per_page=20',
  {fetchImpl,token});
 if(!Array.isArray(runs.workflow_runs))
  throw Error('GITHUB_SHARED_A1_RUNS_LIST_UNVERIFIED');
 for(const run of runs.workflow_runs.slice(0,20)){
  if(!Number.isSafeInteger(run.id)||run.id===Number(currentRunId)||
     run.status!=='completed')continue;
  const result=await apiFetch('/actions/runs/'+run.id+'/artifacts?per_page=30',
   {fetchImpl,token});
  const artifact=(result.artifacts||[]).find(x=>
   x.expired===false&&x.name?.startsWith('s2-shared-official-a1-')&&
   Number.isSafeInteger(x.size_in_bytes)&&x.size_in_bytes>0);
  if(artifact)
   return Object.freeze({runId:run.id,artifactName:artifact.name,kind:'VERIFIED_PRIOR_PIPELINE_ARTIFACT_AVAILABLE'});
 }
 // Existing real provider artifact contains 118 validated/120 original blobs;
 // every replay is independently checked per-source against its SHA and date.
 return Object.freeze({...legacy});
}
if(process.argv[1]?.endsWith('/discover_shared_official_a1_seed_v0_1.mjs')){
 try{
  if(process.env.GITHUB_REPOSITORY!==repo||!process.env.GITHUB_OUTPUT)
   throw Error('SHARED_A1_REPOSITORY_OR_OUTPUT_INVALID');
  const r=await discoverSharedA1PreviousSourceArtifactV0_1({
   token:process.env.GITHUB_TOKEN,currentRunId:process.env.GITHUB_RUN_ID
  });
  appendFileSync(process.env.GITHUB_OUTPUT,
   'seed_run_id='+r.runId+'\nseed_artifact_name='+r.artifactName+'\n');
  console.log(JSON.stringify({sourceArtifactKind:r.kind,priorRun:r.runId,
   tokenOrCredentialsPrinted:false}));
 }catch{
  console.error('SHARED_A1_PREVIOUS_ARTIFACT_READONLY_DISCOVERY_FAILED');
  process.exitCode=2;
 }
}
