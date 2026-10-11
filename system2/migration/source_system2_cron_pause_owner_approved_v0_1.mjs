// SOURCE System2 Cron-only owner-authorized safety operation, 2026-10-11.
// No Worker redeployment, D1 SQL, R2/KV, route, System1 or DEST writes.
// Cloudflare credentials MUST come from the existing source-only GitHub
// environment, never from args in public logs/files. Fail closed on drift.
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const SOURCE_SYSTEM2_WORKER='system2-shadow-research';
export const SYSTEM1_WORKER='fugle-test';
export const APPROVED_CRON='*/5 0-5,11 * * MON-FRI';
const HEX32=/^[0-9a-f]{32}$/i;
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const exactNames=(things,key)=>Array.isArray(things)?things.map(x=>x?.[key]).filter(x=>typeof x==='string'):[];
const schedules=value=>Array.isArray(value)?value:Array.isArray(value?.schedules)?value.schedules:null;
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const errorCode=stage=>new Error('SOURCE_S2_CRON_PAUSE_FAIL_CLOSED_'+stage);
function onlyValidScheduleList(response,stage){
 const rows=schedules(response?.result);
 if(response?.success!==true||!Array.isArray(rows)||rows.some(x=>typeof x?.cron!=='string'||!x.cron))
  throw errorCode(stage);
 return rows.map(x=>x.cron).sort();
}
async function readSourceQuarantine({
 configPath='system2/config/source_account_d1_writer_quarantine_v0_1.json',
 workflowPath='.github/workflows/system2-resonance-deploy.yml',
}={}){
 const q=JSON.parse(await readFile(configPath,'utf8'));
 const flow=await readFile(workflowPath,'utf8');
 return q?.active===true&&q?.automaticRelease===false&&
  /jobs:\s*\n\s*deploy:\s*\n(?:[^\n]*\n){0,8}\s*if:\s*\$\{\{\s*false\s*\}\}/.test(flow);
}
export async function sourceCronPauseV0_1({
 accountId,token,fetchImpl=globalThis.fetch,mode='INSPECT',
 readDeployGuard=readSourceQuarantine,
 clock=()=>new Date().toISOString(),
}={}){
 if(!HEX32.test(accountId||'')||typeof token!=='string'||!token||
    typeof fetchImpl!=='function'||!['INSPECT','PAUSE'].includes(mode))
   throw errorCode('CREDENTIAL_OR_MODE_INVALID');
 const base='https://api.cloudflare.com/client/v4/accounts/'+accountId;
 const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
 let calls=0;
 async function api(method,path,body){
  if(++calls>14)throw errorCode('MAX_API_CALLS');
  const res=await fetchImpl(base+path,{method,headers,
   ...(body===undefined?{}:{body:JSON.stringify(body)})});
  if(!res?.ok)throw errorCode('CLOUDFLARE_'+method+'_FAILED');
  let data;
  try{data=await res.json()}catch{throw errorCode('BAD_RESPONSE_JSON')}
  if(data?.success!==true)throw errorCode('CLOUDFLARE_RESPONSE_NOT_SUCCESS');
  return data;
 }
 const workerList=await api('GET','/workers/scripts?per_page=100');
 const names=exactNames(workerList.result,'id');
 if(names.filter(x=>x===SOURCE_SYSTEM2_WORKER).length!==1||
    names.filter(x=>x===SYSTEM1_WORKER).length!==1)
   throw errorCode('SOURCE_WORKER_IDENTITY_UNVERIFIED');
 const dbList=await api('GET','/d1/database?per_page=100');
 const dbNames=exactNames(dbList.result,'name');
 if(dbNames.filter(x=>x==='system2-research').length!==1||
    dbNames.filter(x=>x==='v7-live').length!==1)
   throw errorCode('SOURCE_D1_IDENTITY_UNVERIFIED');
 const db=dbList.result.find(x=>x.name==='system2-research');
 const settings=await api('GET','/workers/scripts/'+SOURCE_SYSTEM2_WORKER+'/settings');
 const bindings=settings.result?.bindings;
 if(!Array.isArray(bindings)||bindings.filter(b=>b?.name==='SYSTEM2_DB').length!==1||
    bindings.some(b=>['V7_DB','STOCKS_KV','PUSH_WEBHOOK_URL'].includes(b?.name)))
   throw errorCode('SOURCE_WORKER_BINDINGS_UNVERIFIED');
 const binding=bindings.find(b=>b.name==='SYSTEM2_DB');
 const boundId=binding.id||binding.database_id;
 if((binding.type!=='d1'&&binding.type!=='d1_database')||
    !boundId||boundId!==(db.uuid||db.id))
   throw errorCode('SOURCE_D1_BINDING_ID_MISMATCH');
 const v8=onlyValidScheduleList(
   await api('GET','/workers/scripts/'+SYSTEM1_WORKER+'/schedules'),'V8_SCHEDULE');
 const sourceBefore=onlyValidScheduleList(
   await api('GET','/workers/scripts/'+SOURCE_SYSTEM2_WORKER+'/schedules'),'SOURCE_S2_SCHEDULE');
 // Zero is a valid read-only observed state after a prior or concurrent
 // pause. Never issue a second PUT to an already-empty Cron schedule.
 // This observation does not prove WHO paused it or independent G6 audit.
 if(sourceBefore.length!==0&&!same(sourceBefore,[APPROVED_CRON]))
   throw errorCode('SOURCE_S2_SCHEDULE_NOT_EXACTLY_EXPECTED');
 const observedAtUtc=clock();
 const beforeHash=sha({v8,sourceBefore,sourceWorker:SOURCE_SYSTEM2_WORKER,
  sourceD1Binding:boundId});
 const baseReceipt={
  schemaVersion:'S2_OWNER_APPROVED_SOURCE_CRON_ONLY_PAUSE_V0_1',
  sourceWorker:SOURCE_SYSTEM2_WORKER,sourceCronBefore:sourceBefore,
  system1Worker:SYSTEM1_WORKER,nonTargetScheduleCount:v8.length,
  originalBindingFingerprint:sha({dbId:boundId,name:'SYSTEM2_DB'}),
  beforeHash,observedAtUtc,cloudMutationsRequested:0,
  system1Mutated:false,sourceD1Mutated:false,sourceR2Mutated:false,
  destinationWorkerActivated:false,destinationCronActivated:false,
  originalSourceCronRestorable:true,
  originalCloudflareTokenExposed:false,
 };
 if(sourceBefore.length===0)return Object.freeze({...baseReceipt,
  state:'SOURCE_S2_CRON_ALREADY_EMPTY_READONLY_NOT_ORIGINAL_PAUSE_PROOF',
  pausedConfirmed:true,cloudMutationsRequested:0,sourceCronAfter:[],
  v8CronUnchanged:null,independentAuditCompleted:false,
 });
 if(mode==='INSPECT')return Object.freeze({...baseReceipt,
  state:'FRESH_SOURCE_READONLY_INSPECTED_NOT_PAUSED',pausedConfirmed:false});
 if(await readDeployGuard()!==true)throw errorCode('LEGACY_SOURCE_DEPLOY_QUARANTINE_NOT_EFFECTIVE');
 // One-and-only cloud mutation, scoped to S2 SOURCE Cron schedule list.
 const put=await api('PUT','/workers/scripts/'+SOURCE_SYSTEM2_WORKER+'/schedules',[]);
 // A successful PUT response alone never certifies physical pause.
 const putCron=onlyValidScheduleList(put,'PUT_RESPONSE');
 if(putCron.length!==0)throw errorCode('PUT_RESPONSE_NOT_EMPTY');
 const sourceAfter=onlyValidScheduleList(
   await api('GET','/workers/scripts/'+SOURCE_SYSTEM2_WORKER+'/schedules'),'SOURCE_AFTER');
 const v8After=onlyValidScheduleList(
   await api('GET','/workers/scripts/'+SYSTEM1_WORKER+'/schedules'),'V8_AFTER');
 if(sourceAfter.length!==0||!same(v8After,v8))
   throw errorCode('POST_PAUSE_SCHEDULE_READBACK_DRIFT');
 return Object.freeze({...baseReceipt,
  cloudMutationsRequested:1,
  state:'SOURCE_S2_CRON_EMPTY_PHYSICAL_CONFIG_READBACK_PENDING_INDEPENDENT_AUDIT',
  pausedConfirmed:true,sourceCronAfter:sourceAfter,
  afterHash:sha({v8After,sourceAfter,sourceWorker:SOURCE_SYSTEM2_WORKER}),
  completedAtUtc:clock(),v8CronUnchanged:true,
  sourceDataExportAuthorizedByThisOperation:false,
  independentAuditCompleted:false});
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 const [mode,exactConfirm]=process.argv.slice(2);
 if(!['INSPECT','PAUSE'].includes(mode))throw errorCode('CLI_MODE_REQUIRED');
 if(mode==='PAUSE'&&exactConfirm!=='APPROVED_SOURCE_SYSTEM2_CRON_ONLY_20261011')
  throw errorCode('EXACT_OWNER_APPROVAL_CONFIRM_REQUIRED');
 try{
  const report=await sourceCronPauseV0_1({
   mode,
   accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   token:process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,
  });
  const out=resolve('/tmp/system2-source-cron-pause-review');
  await mkdir(out,{recursive:true});
  await writeFile(resolve(out,'sanitized-physical-receipt.json'),
    JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({
    state:report.state,pausedConfirmed:report.pausedConfirmed,
    sourceWorker:report.sourceWorker,sourceCronBefore:report.sourceCronBefore,
    sourceCronAfter:report.sourceCronAfter??null,v8CronUnchanged:report.v8CronUnchanged??null,
    observedAtUtc:report.observedAtUtc,completedAtUtc:report.completedAtUtc??null,
    cloudMutationsRequested:report.cloudMutationsRequested,
    independentAuditCompleted:false,system1Mutated:false,
  }));
 }catch(error){
  // Never print Cloudflare response, account id, token or signed URLs.
  const s=String(error?.message||'SOURCE_S2_CRON_PAUSE_FAIL_CLOSED_UNKNOWN');
  console.error(/^SOURCE_S2_CRON_PAUSE_FAIL_CLOSED_[A-Z0-9_]+$/.test(s)?
    s:'SOURCE_S2_CRON_PAUSE_FAIL_CLOSED_UNCLASSIFIED');
  process.exitCode=2;
 }
}