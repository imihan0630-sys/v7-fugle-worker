import {writeFile,mkdir} from 'node:fs/promises';
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const workerToken=process.env.CLOUDFLARE_API_TOKEN||"";
const sqlToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||workerToken;
const admin=process.env.V7_ADMIN_TOKEN||"";
const root="https://api.cloudflare.com/client/v4/accounts/"+account;
const receipt={schema:"V8_OCT12_CRON_LEASE_PROD_READONLY_FORENSIC_20261013_V0_1",observedAt:new Date().toISOString(),strictlyReadOnly:true,d1SqlStatementCount:0,workerMutations:0,cronMutations:0,noTrade:true,noFormalScan:true,discovery:{},cron:{},invocations:{},d1:{},kv:{},public:{},errors:[]};
const fail=e=>String(e||"").slice(0,230);
async function call(url,token,method="GET",data){
  const resp=await fetch(url,{method,headers:{authorization:"Bearer "+token,accept:"application/json",...(data?{"content-type":"application/json"}:{})},...(data?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(20000)});
  const body=await resp.json().catch(()=>null);
  return {status:resp.status,ok:resp.ok&&body?.success!==false,body};
}
try {
 if(!/^[0-9a-f]{32}$/i.test(account)||!workerToken||!sqlToken)throw Error("SOURCE_AUTH_ENV_MISSING");
 const [meta,dbs,sch]=await Promise.all([
    call(root+"/workers/scripts/fugle-test/settings",workerToken),
    call(root+"/d1/database?per_page=100",sqlToken),
    call(root+"/workers/scripts/fugle-test/schedules",workerToken)
 ]);
 receipt.discovery={workerHttp:meta.status,dbHttp:dbs.status,scheduleHttp:sch.status};
 if(!meta.ok||!dbs.ok||!sch.ok)throw Error("PROVIDER_GET_AUTH_OR_HTTP");
 const dbList=dbs.body?.result||[];
 const src=dbList.filter(x=>x.name==="v7-live");
 if(src.length!==1)throw Error("ORIGINAL_V8_D1_NOT_UNIQUE");
 const databaseId=src[0].uuid||src[0].id;
 const binding=meta.body?.result?.bindings?.find(x=>x.name==="V7_DB");
 const bindingId=binding?.id||binding?.database_id||null;
 if(bindingId&&bindingId!==databaseId)throw Error("V8_BINDING_DATABASE_MISMATCH");
 receipt.discovery.sourceDBFound=true;
 receipt.discovery.productionWorkerBindingMatches=Boolean(bindingId===databaseId);
 receipt.discovery.databaseFileSizeBytes=src[0].file_size??null;
 const schedules=Array.isArray(sch.body?.result)?sch.body.result:Array.isArray(sch.body?.result?.schedules)?sch.body.result.schedules:null;
 receipt.cron={httpStatus:sch.status,schedules:schedules?.map(x=>x.cron||null)??null};
 const statements=[
   ["oct12_lease","SELECT state_key,snapshot_json,lease_token,lease_until,updated_at FROM v7_signal_delivery_state WHERE state_key='V7_AFTER_MARKET_LEASE:2026-10-12' LIMIT 1"],
   ["recent_cron","SELECT id,cron_expression,scheduled_at,started_at,finished_at,job_type,status,skipped,error,detail FROM v7_cron_runs ORDER BY id DESC LIMIT 40"],
   ["history_state","SELECT market_date,cursor,total,updated_at FROM v7_history_seed_state ORDER BY id DESC LIMIT 1"],
 ];
 for(const [label,sql] of statements){
   receipt.d1SqlStatementCount++;
   const q=await call(root+"/d1/database/"+databaseId+"/query",sqlToken,"POST",{sql});
   const results=q.body?.result;
   if(!q.ok||!Array.isArray(results)||results.length!==1||results[0]?.success!==true) {
     receipt.d1[label]={httpStatus:q.status,providerSuccess:false,error:"D1_QUERY_READONLY_UNAVAILABLE"};
     continue;
   }
   const rows=results[0].results||[];
   if(label==="oct12_lease"){
      receipt.d1[label]={httpStatus:q.status,found:rows.length===1,entries:rows.map(x=>{
        let snap=null;try{snap=JSON.parse(x.snapshot_json||"null")}catch{}
        return {stateKey:x.state_key,leaseTokenPresent:Boolean(x.lease_token),leaseUntil:x.lease_until,
          leaseExpiredAtObservation:Number(x.lease_until||0)<Date.now(),updatedAt:x.updated_at,
          snapshot:snap?{status:snap.status??null,scanDate:snap.scanDate??null,generatedAt:snap.generatedAt??null,testMode:snap.testMode??null}:null};
      }),readRows:results[0].meta?.rows_read??null};
   }else if(label==="recent_cron"){
     receipt.d1[label]={httpStatus:q.status,rowCount:rows.length,readRows:results[0].meta?.rows_read??null,
       sinceEvening:rows.filter(x=>String(x.scheduled_at||"")>="2026-10-12T14:00:00Z").map(x=>({id:x.id,scheduledAt:x.scheduled_at,jobType:x.job_type,status:x.status,cronExpression:x.cron_expression,skipped:x.skipped,error:fail(x.error),detail:fail(x.detail)})),
       latest:rows.slice(0,4).map(x=>({id:x.id,scheduledAt:x.scheduled_at,jobType:x.job_type,status:x.status}))};
   }else receipt.d1[label]={httpStatus:q.status,rows,readRows:results[0].meta?.rows_read??null};
 }
 // Recorded GraphQL requests include both Scheduled and HTTP triggers; cannot alone infer cron.
 const gql='query($accountTag:String!,$script:String!,$start:Time!,$end:Time!){viewer{accounts(filter:{accountTag:$accountTag}){workersInvocationsAdaptive(limit:1000,filter:{scriptName:$script,datetime_geq:$start,datetime_leq:$end}){sum{requests errors} dimensions{datetime scriptName status}}}}}';
 const qr=await fetch("https://api.cloudflare.com/client/v4/graphql",{method:"POST",headers:{authorization:"Bearer "+workerToken,"content-type":"application/json"},body:JSON.stringify({query:gql,variables:{accountTag:account,script:"fugle-test",start:"2026-10-12T15:20:00Z",end:"2026-10-12T16:10:00Z"}}),signal:AbortSignal.timeout(16000)});
 const gj=await qr.json().catch(()=>null);
 const inv=gj?.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive;
 receipt.invocations={httpStatus:qr.status,available:Array.isArray(inv)&&!gj?.errors?.length,
   rows:Array.isArray(inv)?inv.slice(0,40).map(x=>({when:x.dimensions?.datetime||null,status:x.dimensions?.status||null,requests:x.sum?.requests??null,errors:x.sum?.errors??null})):null,
   note:"Invocation metric mixes HTTP/Cron; never evidence specific scheduled event"};
 // Authenticated product GETs; public http never returns secret.
 if(admin){
  for(const [name,path] of [["scan","/api/scan/status"],["cron","/api/cron/status"]]){
   try{const res=await fetch("https://fugle-test.imihan0630.workers.dev"+path,{headers:{"x-admin-token":admin,accept:"application/json"},signal:AbortSignal.timeout(16000)});const v=await res.json().catch(()=>null);receipt.public[name]={http:res.status,
     ...(name==="scan"?{scanDate:v?.scanDate||null,selectedCount:v?.selectedCount??null,pipelineComplete:v?.pipeline?.complete===true}:
       {latest:v?.latest?{scheduledAt:v.latest.scheduled_at,status:v.latest.status,jobType:v.latest.job_type}:null})};
   }catch{receipt.public[name]={error:"HTTP_OR_PARSE_UNAVAILABLE"};}
  }
 }
}catch(err){receipt.errors.push(fail(err.message||err));}
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/v8-oct12-cron-lock-forensics-readonly.json",JSON.stringify(receipt,null,2)+"\n");
console.log("V8_OCT12_CRON_LEASE_FORENSICS="+JSON.stringify(receipt));
if(receipt.errors.length)process.exitCode=2;
