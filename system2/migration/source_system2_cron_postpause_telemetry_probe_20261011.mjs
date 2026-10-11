// Owner-authorized POST-PAUSE READ-ONLY source Cloudflare verification.
// No schedules PUT, no D1 SQL/export, no Worker deployment, no paid API.
// GraphQL POST is QUERY-ONLY, never a cloud resource mutation.
import {createHash} from "node:crypto";
import {mkdir,writeFile,readFile} from "node:fs/promises";
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const workerToken=process.env.CLOUDFLARE_API_TOKEN||"";
const d1Token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||"";
const pauseUtc="2026-10-11T13:12:27.999Z";
const expectedSourceDb="system2-research",expectedV8Db="v7-live";
const target="system2-shadow-research",protectedWorker="fugle-test";
const base="https://api.cloudflare.com/client/v4/accounts/"+account;
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const report={
 schemaVersion:"S2_SOURCE_CRON_POSTPAUSE_READONLY_PROBE_V0_1",
 sourceWorker:target,protectedWorker,sourceAccountId:"REDACTED",
 pauseUtc,observedAtUtc:new Date().toISOString(),
 purpose:"REAL_POST_PROPAGATION_READBACK_AND_BOUND_EXISTING_INVOCATION_ANALYTICS",
 cloudflareMethods:["GET","POST_GRAPHQL_QUERY_ONLY"],
 cloudflareResourceMutations:0,d1SqlCount:0,workerDeployments:0,
 collectorReadOnly:true,claimNoNewCronInvocations:false,
 claimAllInFlightCompleted:false,claimV8BusinessParity:false,errors:[],
};
function safeError(e){const s=String(e?.message||e||"UNKNOWN");return s.replace(/[a-f0-9]{32,}/gi,"<redacted>").slice(0,150)}
function summarizeSchedule(v,tag){
 const list=Array.isArray(v?.result)?v.result:Array.isArray(v?.result?.schedules)?v.result.schedules:null;
 if(v?.success!==true||!Array.isArray(list)||list.some(x=>typeof x?.cron!=="string"))throw Error(tag+"_MISSING_OR_INVALID");
 return list.map(x=>x.cron).sort();
}
async function api(path,token){
 const response=await fetch(base+path,{method:"GET",headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(13000)});
 const value=await response.json().catch(()=>null);
 if(!response.ok||value?.success!==true)throw Error("GET_FAILED_"+path.replace(/[^a-zA-Z0-9]/g,"_").slice(-55));
 return value;
}
function observed(key,fn){return fn().then(x=>(report[key]=x,true)).catch(e=>(report[key]={state:"UNKNOWN",error:safeError(e)},report.errors.push(key+":"+safeError(e)),false))}
async function graphInvocations(script,start,end){
 const query='query Invocations($accountTag:String!,$script:String!,$start:Time!,$end:Time!){viewer{accounts(filter:{accountTag:$accountTag}){workersInvocationsAdaptive(limit:1000,filter:{scriptName:$script,datetime_geq:$start,datetime_leq:$end}){sum{requests errors} dimensions{datetime scriptName status}}}}}';
 const response=await fetch("https://api.cloudflare.com/client/v4/graphql",{method:"POST",
  headers:{Authorization:"Bearer "+workerToken,"Content-Type":"application/json"},signal:AbortSignal.timeout(20000),
  body:JSON.stringify({query,variables:{accountTag:account,script,start,end}})});
 const raw=await response.json().catch(()=>null);
 if(!response.ok||raw?.errors?.length)throw Error("GRAPHQL_UNAVAILABLE_OR_SCHEMA_DENIED");
 const accounts=raw?.data?.viewer?.accounts;
 if(!Array.isArray(accounts)||accounts.length!==1||!Array.isArray(accounts[0].workersInvocationsAdaptive))throw Error("GRAPHQL_INVOCATIONS_INCOMPLETE");
 const rows=accounts[0].workersInvocationsAdaptive;
 const total=rows.reduce((a,x)=>a+(Number(x.sum?.requests)||0),0);
 return {status:"QUERY_SUCCEEDED_AGGREGATED_INVOCATIONS_NOT_SCHEDULED_SPECIFIC",samplesReturned:rows.length,totalRequests:total,
  anyNonZero:total>0,groups:rows.slice(0,25).map(x=>({utc:x.dimensions?.datetime,status:x.dimensions?.status,requests:x.sum?.requests,errors:x.sum?.errors})),
  attributionToCron:"NOT_AVAILABLE_IN_THIS_DATASET",inFlightStatus:"NOT_AVAILABLE",freshnessBoundMinutes:null};
}
async function main(){
 if(!/^[0-9a-f]{32}$/i.test(account)||!workerToken||!d1Token)throw Error("EXISTING_SOURCE_ENV_CREDENTIALS_MISSING");
 const now=new Date(),pause=new Date(pauseUtc),elapsed=(now-pause)/60000;
 report.probeAfterPauseMinutes=Number(elapsed.toFixed(2));
 report.observedWeekdayUtc=now.toLocaleString("en-US",{timeZone:"UTC",weekday:"long"});
 report.actualScheduledCronOpportunityAfterPause=false; // Sunday 2026-10-11, original cron MON-FRI.
 const [w,db,sc,vc,vs,ss,vdeploy,sub]=await Promise.all([
  observed("workerInventory",async()=>{const x=(await api("/workers/scripts?per_page=100",workerToken)).result;const names=x.map(z=>z.id);if(!names.includes(target)||!names.includes(protectedWorker))throw Error("SOURCE_WORKERS_MISSING");return {sourceS2Present:true,system1Present:true,count:names.length}}),
  observed("sourceD1Inventory",async()=>{const x=(await api("/d1/database?per_page=100",d1Token)).result;const names=x.map(z=>z.name);if(!names.includes(expectedSourceDb)||!names.includes(expectedV8Db))throw Error("SOURCE_D1_NAMES_DRIFT");return {bothDatabasesPresent:true,sourceS2DatabaseFingerprint:hash(x.find(z=>z.name===expectedSourceDb)?.uuid||null),system1DatabaseFingerprint:hash(x.find(z=>z.name===expectedV8Db)?.uuid||null)}}),
  observed("sourceCron",async()=>summarizeSchedule(await api("/workers/scripts/"+target+"/schedules",workerToken),"S2")),
  observed("v8Cron",async()=>summarizeSchedule(await api("/workers/scripts/"+protectedWorker+"/schedules",workerToken),"V8")),
  observed("v8Settings",async()=>{let x=(await api("/workers/scripts/"+protectedWorker+"/settings",workerToken)).result;const arr=Array.isArray(x?.bindings)?x.bindings:[];return {bindingNames:arr.map(z=>({name:z.name,type:z.type})),bindingNamesFingerprint:hash(arr.map(z=>({name:z.name,type:z.type})).sort((a,b)=>a.name.localeCompare(b.name))),v8HasD1:arr.some(z=>z.name==="V7_DB"),v8HasKV:arr.some(z=>z.name==="STOCKS_KV"),v8D1BindingIdFingerprint:hash(arr.find(z=>z.name==="V7_DB")?.id||arr.find(z=>z.name==="V7_DB")?.database_id||null)}}),
  observed("s2Settings",async()=>{let x=(await api("/workers/scripts/"+target+"/settings",workerToken)).result;const d=x?.bindings?.find(z=>z.name==="SYSTEM2_DB");return {s2BindingPresent:!!d,d1BoundIdFingerprint:hash(d?.id||d?.database_id||null),bindingNames:x?.bindings?.map(z=>({name:z.name,type:z.type}))||[]}}),
  observed("v8ActiveDeployment",async()=>{const raw=(await api("/workers/scripts/"+protectedWorker+"/deployments",workerToken)).result;const arr=Array.isArray(raw)?raw:Array.isArray(raw?.deployments)?raw.deployments:[];return {resultCount:arr.length,latestDeploymentFingerprint:arr.length?hash({versions:arr[0].versions,created_on:arr[0].created_on}):null,latestDeployedAtUtc:arr[0]?.created_on||null}}),
  observed("subdomain",async()=>{const raw=(await api("/workers/subdomain",workerToken)).result;return {exists:!!raw?.subdomain,subdomain:raw?.subdomain||null}})
 ]);
 if(report.sourceCron.state==="UNKNOWN"||!Array.isArray(report.sourceCron)||report.sourceCron.length!==0)report.sourceCronSafetyVerdict="BLOCKED_UNKNOWN_OR_NONZERO";
 else report.sourceCronSafetyVerdict="PASS_AUTHENTICATED_POST_15MIN_CONFIG_ZERO";
 const expectedFour=["0-24 5 * * MON-FRI","* 1-4 * * MON-FRI","35,55 15 * * mon-fri","* 9 * * MON-FRI"].sort();
 report.v8CronVerdict=Array.isArray(report.v8Cron)&&JSON.stringify(report.v8Cron)===JSON.stringify(expectedFour)?"PASS_FOUR_EXACT_MATCH_BEFORE":"BLOCKED_UNEXPECTED_OR_UNKNOWN";
 if(report.subdomain?.subdomain){
  await observed("v8HttpReadOnlyVersion",async()=>{
   const url="https://fugle-test."+report.subdomain.subdomain+".workers.dev/api/version";
   const response=await fetch(url,{method:"GET",signal:AbortSignal.timeout(15000),headers:{"Accept":"application/json"}});
   const payload=await response.json().catch(()=>null);
   if(!response.ok||!payload?.version)throw Error("PRODUCTION_API_VERSION_NOT_VERIFIED");
   return {status:"PASS_PUBLIC_READ_ONLY_HTTP",httpStatus:response.status,version:String(payload.version).slice(0,90),
    hasKvBinding:payload.bindings?.kv===true,hasD1Binding:payload.bindings?.d1===true,
    hasQuoteSecret:payload.readiness?.quote===true,verifiedBusinessSelection:false,apiResponseDigest:hash(payload)};
  });
 } else report.v8HttpReadOnlyVersion={state:"UNKNOWN",reason:"NO_AUTHENTICATED_SUBDOMAIN"};
 const end=new Date().toISOString(),start="2026-10-11T13:12:27.999Z";
 await observed("s2WorkersInvocationAnalytics",()=>graphInvocations(target,start,end));
 await observed("v8WorkersInvocationAnalytics",()=>graphInvocations(protectedWorker,start,end));
 report.telemetryClockAtUtc=new Date().toISOString();
 report.telemetryCronTypeSegregated=false;report.telemetryInFlightJobInventoryAvailable=false;
 report.noScheduledOpportunitySincePauseVerifiedByCalendarOnly=true;
 report.cronPropagationVerdict=report.sourceCronSafetyVerdict.startsWith("PASS")&&elapsed>=15?"PASS_CONFIG_REMAINED_ZERO_AFTER_VENDOR_MAX_PROPAGATION_WINDOW__RUNTIME_EVENTS_UNVERIFIED":"PENDING";
 report.newS2CronEventsVerdict="PENDING_NO_NEXT_WEEKDAY_SCHEDULED_SLOT_AFTER_PAUSE_OR_DIRECT_EVENT_TYPE_COMPLETE_PROOF";
 report.oldInFlightVerdict="PENDING_NOT_EXPOSED_AS_ACTIVE_EXECUTIONS_BY_GRAPHS_OR_CRON_CONFIG";
 report.v8FormalLiveBehaviorVerdict=report.v8HttpReadOnlyVersion?.status==="PASS_PUBLIC_READ_ONLY_HTTP"?"PARTIAL_PASS_PUBLIC_VERSION_AND_BINDINGS_NOT_FULL_BUSINESS":"PENDING_NO_RUNTIME_HEALTH_PROOF";
 report.originalD1ExportAndMigrationAuthorized=false;report.v8FormalCoreChanged=false;
 const path="/tmp/s2-cron-postpause-real-proof";
 await mkdir(path,{recursive:true});await writeFile(path+"/postpause-provider-receipt.json",JSON.stringify(report,null,2)+"\n",{flag:"wx",mode:0o600});
 console.log(JSON.stringify({result:"PHYSICAL_READONLY_EVIDENCE_CAPTURED",sourceCronSafetyVerdict:report.sourceCronSafetyVerdict,
  v8CronVerdict:report.v8CronVerdict,cronPropagationVerdict:report.cronPropagationVerdict,
  newS2CronEventsVerdict:report.newS2CronEventsVerdict,oldInFlightVerdict:report.oldInFlightVerdict,
  v8FormalLiveBehaviorVerdict:report.v8FormalLiveBehaviorVerdict,observedAtUtc:report.observedAtUtc,
  probeAfterPauseMinutes:report.probeAfterPauseMinutes,cloudflareMutations:0}));
 if(report.sourceCronSafetyVerdict!=="PASS_AUTHENTICATED_POST_15MIN_CONFIG_ZERO"||report.v8CronVerdict!=="PASS_FOUR_EXACT_MATCH_BEFORE")process.exitCode=2;
}
main().catch(async e=>{const m=safeError(e);console.error("SOURCE_POSTPAUSE_READONLY_FAIL_"+m);process.exitCode=2});
