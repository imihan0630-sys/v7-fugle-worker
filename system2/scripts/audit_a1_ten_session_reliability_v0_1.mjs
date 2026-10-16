// Read-only GitHub REST 10-session trend of small DUAL receipts (<64k ZIP).
// No 40 MB A1 archive download; original A1 122/122 remains audited by
// the existing independent job before this supplemental report executes.
import {readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildA1ScheduleTenSessionRollupV0_1}
 from '../runtime/a1_schedule_ten_session_reliability_v0_1.mjs';

const ROOT='https://api.github.com';
const AUDIT='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const SOURCE='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const FIRST='2026-10-16T02:46:00Z';
async function apiGet(path,token,fetchImpl=globalThis.fetch,zip=false){
 const r=await fetchImpl(ROOT+path,{headers:{
  Authorization:'Bearer '+token,
  Accept:zip?'application/zip':'application/vnd.github+json',
  'X-GitHub-Api-Version':'2022-11-28'
 }});
 if(!r.ok)throw Error('A1_TEN_SESSION_GH_API_UNAVAILABLE_'+r.status);
 return zip?Buffer.from(await r.arrayBuffer()):r.json();
}
async function listWorkflowRuns({repository,event,path,token,fetchImpl,nowUtc}){
 const found=[],min=Date.parse(FIRST),max=Date.parse(nowUtc);
 let fullyEnumerated=false;
 for(let page=1;page<=6;page++){
  // Fetch the SOURCE/AUDITOR workflow-specific run list. Repository-wide
  // schedule/workflow_run pages are full of unrelated System1/System2 jobs,
  // and would silently exhaust this bounded six-page census.
  const workflowId=encodeURIComponent(path.split('/').at(-1));
  const url='/repos/'+repository+'/actions/workflows/'+workflowId+
   '/runs?event='+event+'&per_page=100&page='+page;
  const response=await apiGet(url,token,fetchImpl);
  if(!Array.isArray(response?.workflow_runs)||
     !Number.isSafeInteger(response.total_count))
   throw Error('A1_TEN_SESSION_RUN_LIST_MALFORMED');
  const batch=response.workflow_runs;
  for(const run of batch){
   const t=Date.parse(run.created_at||'');
   if(!Number.isFinite(t))throw Error('A1_TEN_SESSION_RUN_DATE_INVALID');
   if(t>=min&&t<=max&&run.path===path&&
      run.head_branch==='main'&&run.event===event)
    found.push(run);
  }
  if(batch.length<100||batch.length===0||
     Date.parse(batch.at(-1).created_at)<min){
   fullyEnumerated=true;break;
  }
 }
 return {runs:found,censusComplete:fullyEnumerated};
}
async function readTinyDualReceipt({repository,token,auditRun,fetchImpl}){
 const path='/repos/'+repository+'/actions/runs/'+auditRun.id+'/artifacts?per_page=100';
 const a=await apiGet(path,token,fetchImpl);
 const expected='s2-a1-dual-source-clock-'+auditRun.id;
 const matches=a.artifacts?.filter(x=>x.name===expected&&!x.expired&&
  x.size_in_bytes>0&&x.size_in_bytes<=65536)||[];
 if(matches.length!==1)return null;
 const zip=await apiGet('/repos/'+repository+'/actions/artifacts/'+matches[0].id+'/zip',
  token,fetchImpl,true);
 if(zip.length===0||zip.length>65536)throw Error('A1_TEN_SESSION_TINY_ZIP_SIZE_UNVERIFIED');
 const dir='/tmp/s2-a1-reliability-small-archives';
 await mkdir(dir,{recursive:true,mode:0o700});
 const file=resolve(dir,'audit-'+auditRun.id+'.zip');
 try{
  await writeFile(file,zip,{flag:'wx',mode:0o600});
  const bytes=execFileSync('unzip',['-p',file,'dual-acceptance-receipt.json'],
   {maxBuffer:256000,timeout:10000});
  return JSON.parse(bytes.toString('utf8'));
 }finally{
  await rm(file,{force:true});
 }
}
export async function collectA1TenSessionRollupV0_1({
 repository,token,sourceManifest,currentDual,
 now=()=>new Date(),fetchImpl=globalThis.fetch
}={}){
 if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository||'')||
    !token||!Array.isArray(sourceManifest?.tradingDates)||
    currentDual?.schemaVersion!=='S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1')
  throw Error('A1_TEN_SESSION_SOURCE_CONTEXT_UNVERIFIED');
 const asOfUtc=now().toISOString();
 let censusComplete=false,sourceRuns=[],history=[],historyFailureCount=0;
 try{
  const [source,audit]=await Promise.all([
   listWorkflowRuns({repository,event:'schedule',path:SOURCE,token,fetchImpl,nowUtc:asOfUtc}),
   listWorkflowRuns({repository,event:'workflow_run',path:AUDIT,token,fetchImpl,nowUtc:asOfUtc})
  ]);
  sourceRuns=source.runs;
  censusComplete=source.censusComplete&&audit.censusComplete;
  // Read a maximum of 50 newest completed matching audits, only small
  // 1KB rollup receipt artifacts; never fetch 40MB source zip here.
  const eligible=audit.runs.filter(x=>x.status==='completed'&&
   x.conclusion==='success').sort((x,y)=>Date.parse(y.created_at)-Date.parse(x.created_at));
  if(eligible.length>50)censusComplete=false;
  for(let i=0;i<Math.min(eligible.length,50);i+=4){
   const chunk=eligible.slice(i,i+4);
   const pieces=await Promise.all(chunk.map(async item=>{
    try{
     const receipt=await readTinyDualReceipt({repository,token,auditRun:item,fetchImpl});
     return receipt??{error:'AUDIT_SUCCESS_BUT_DUAL_RECEIPT_NOT_PRESENT'};
    }catch{return {error:'RECEIPT_DOWNLOAD_OR_ZIP_UNAVAILABLE'}}
   }));
   for(const item of pieces)if(item?.schemaVersion===
     'S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1')history.push(item);
   else if(item?.error)historyFailureCount++;
  }
 }catch{
  censusComplete=false;
 }
 // Current receipt may not yet have been uploaded: include the actual
 // in-memory same-audit evidence, de-duplicated by runId+signed hash.
 const uniq=new Map();
 for(const x of [...history,currentDual])
  if(x.sourceRunEvent==='schedule')
   uniq.set(x.sourceRunId+'|'+x.receiptHash,x);
 const rollup=await buildA1ScheduleTenSessionRollupV0_1({
  tradingDates:sourceManifest.tradingDates,dualReceipts:[...uniq.values()],
  sourceRuns,censusComplete,asOfUtc
 });
 // Supplemental telemetry quality is not source/PIT acceptance.
 const {rollupHash,...base}=rollup;
 return {...base,downloadOrZipFailureCount:historyFailureCount,
  // Any metadata / ZIP failure must not silently claim an exhaustive census.
  censusComplete:censusComplete&&historyFailureCount===0,
  rollupHash:null};
}
if(process.argv[1]?.endsWith('/audit_a1_ten_session_reliability_v0_1.mjs')){
 const repository=process.env.GITHUB_REPOSITORY,token=process.env.GITHUB_TOKEN;
 const root='/tmp/s2-source-for-independent-readback';
 const a='/tmp/s2-a1-source-vs-schedule-acceptance';
 const [manifest,currentDual]=await Promise.all([
  readFile(resolve(root,'shared-official-a1-manifest.json'),'utf8').then(JSON.parse),
  readFile(resolve(a,'dual-acceptance-receipt.json'),'utf8').then(JSON.parse)
 ]);
 const provisional=await collectA1TenSessionRollupV0_1({
  repository,token,sourceManifest:manifest,currentDual
 });
 const {sha256Hex}=await import('../runtime/decision_archive.mjs');
 const {rollupHash:_,...base}=provisional;
 const receipt={...base,rollupHash:await sha256Hex(base)};
 const out='/tmp/s2-a1-ten-session-schedule-reliability';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'ten-session-rollup.json'),
  JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({state:receipt.dataMaturityState,
  sessions:receipt.officialTradingSessionCount,
  attributedCronRuns:receipt.independentlyAttributedScheduleRuns,
  matureSlots:receipt.maturedExpectedSlots,
  onTimePercentAmongAttributed:receipt.punctualityAmongAttributedRunsPct,
  source122Accepted:receipt.observedIndependentlyVerified122Of122Count,
  sourceDeadlineWithin:receipt.observedWithinSourceDecisionClockCount,
  missingDeliveryConfirmed:false,censusComplete:receipt.censusComplete,
  sourceRunWithoutAttributionCount:receipt.sourceRunIdsWithNoAttributableDualReceipt.length,
  rollupHash:receipt.rollupHash}));
}
