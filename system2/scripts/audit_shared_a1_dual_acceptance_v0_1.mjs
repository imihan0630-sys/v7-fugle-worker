// Runs only in the *already existing* separate independent A1 audit workflow.
// Reads genuine GitHub REST run/job provenance; creates a separately signed,
// sanitized timing receipt. It never writes Cloudflare, selects or freezes.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildA1DualAcceptanceV0_1}
 from '../runtime/a1_source_schedule_dual_acceptance_v0_1.mjs';
const PATH='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
async function getGithub(url,token,fetchImpl=globalThis.fetch){
 const r=await fetchImpl(url,{headers:{
  Authorization:'Bearer '+token,Accept:'application/vnd.github+json',
  'X-GitHub-Api-Version':'2022-11-28'
 }});
 if(r.status!==200)throw Error('A1_DUAL_GITHUB_REST_METADATA_UNAVAILABLE');
 return r.json();
}
export async function auditA1DualFromGithubV0_1({
 sourceRunId,repository,apiBase='https://api.github.com',token,
 sourceRoot='/tmp/s2-source-for-independent-readback',
 auditRoot='/tmp/s2-shared-a1-independent-audit',
 stage1Root='/tmp/s2-a1-stage1-readonly',fetchImpl=globalThis.fetch,
 now=()=>new Date()
}={}){
 if(!Number.isSafeInteger(sourceRunId)||sourceRunId<1||
  !/^[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(repository||'')||
  typeof token!=='string'||!token||
  !/^https:\/\/api\.github\.com$/.test(apiBase))
  throw Error('A1_DUAL_GITHUB_ID_OR_TOKEN_UNVERIFIED');
 const root=apiBase+'/repos/'+repository+'/actions/runs/'+sourceRunId;
 const [run,jobs,origin,sourceReceipt,independentAudit,stage1Summary]=await Promise.all([
  getGithub(root,token,fetchImpl),
  getGithub(root+'/jobs?per_page=100',token,fetchImpl),
  readFile(resolve(sourceRoot,'source-github-origin.json'),'utf8').then(JSON.parse),
  readFile(resolve(sourceRoot,'shared-official-a1-run.json'),'utf8').then(JSON.parse),
  readFile(resolve(auditRoot,'audit-receipt.json'),'utf8').then(JSON.parse),
  readFile(resolve(stage1Root,'summary.json'),'utf8').then(JSON.parse)
 ]);
 if(run.id!==sourceRunId||run.repository?.full_name!==repository||
   !Array.isArray(jobs.jobs)||jobs.total_count!==1||
   jobs.jobs[0]?.name!=='current_source')
  throw Error('A1_DUAL_WRONG_GITHUB_PRODUCER_JOB');
 return buildA1DualAcceptanceV0_1({
  origin,sourceRun:run,sourceJob:jobs.jobs[0],sourceReceipt,
  independentAudit,stage1Summary,observedAtUtc:now().toISOString()
 });
}
if(process.argv[1]?.endsWith('/audit_shared_a1_dual_acceptance_v0_1.mjs')){
 const result=await auditA1DualFromGithubV0_1({
  sourceRunId:Number(process.env.S2_A1_SOURCE_RUN_ID),
  repository:process.env.GITHUB_REPOSITORY,token:process.env.GITHUB_TOKEN
 });
 const out='/tmp/s2-a1-source-vs-schedule-acceptance';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'dual-acceptance-receipt.json'),
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  sourceRunId:result.sourceRunId,marketDate:result.marketDate,
  sourceIntegrity:result.sourceIntegrity.state,
  schedulePunctuality:result.scheduler.state,
  nominalInferredUtc:result.scheduler.nominalInferredUtc,
  enqueueDelayMinutes:result.scheduler.enqueueDelayMinutes,
  queueDelayMinutes:result.scheduler.runnerQueueDelayMinutes,
  decisionClock:result.decisionClock.state,
  selectedCount:null,frozenD1Written:false,
  receiptHash:result.receiptHash
 }));
}
