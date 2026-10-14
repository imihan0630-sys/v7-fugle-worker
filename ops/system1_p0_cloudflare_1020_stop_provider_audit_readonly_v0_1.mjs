// P0 independent Cloudflare provider readback after real V8 monitoring stalled at 10:20 Taipei.
// STRICT provider GET + GraphQL READ QUERY only. No user data, D1 SQL, KV, Worker/Cron modifications.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const token=process.env.CLOUDFLARE_API_TOKEN||"";
if(!/^[a-f0-9]{32}$/i.test(account)||!token)throw Error("EXISTING_CLOUDFLARE_PROVIDER_READ_CREDENTIALS_UNAVAILABLE");
const root="https://api.cloudflare.com/client/v4/accounts/"+account;
const now=new Date(),end=now.toISOString();
const start=new Date(now.getTime()-75*60*1000).toISOString();
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const findings={schema:"SYSTEM1_P0_WORKER_PROVIDER_1020_STOP_READONLY_V0_1",
 observedAtUtc:end,lookbackStartUtc:start,market:"TWSE_TPEX",
 incidentLastSuccessUtc:"2026-10-14T02:20:04.000Z",
 noSourceMutation:true,noCloudflareScheduleWrite:true,noWorkerDeployment:true,
 noD1Sql:true,noD1Write:true,noKVMutation:true,noPush:true,noTrade:true,
 traceProvesScheduledInvocationType:false,
 evidence:{},issues:[]};
async function get(path){
 const r=await fetch(root+path,{method:"GET",headers:{Authorization:"Bearer "+token,Accept:"application/json"},
  signal:AbortSignal.timeout(17000)});
 const d=await r.json().catch(()=>null);
 if(!r.ok||d?.success!==true)throw Error("SOURCE_WORKER_GET_HTTP_"+r.status);
 return d.result;
}
async function gql(query,variables){
 const r=await fetch("https://api.cloudflare.com/client/v4/graphql",{method:"POST",
  headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
  body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(22000)});
 const d=await r.json().catch(()=>null);
 if(!r.ok||d?.errors?.length)throw Error("CLOUDFLARE_READ_ONLY_GRAPHQL_UNAVAILABLE");
 const a=d?.data?.viewer?.accounts;
 if(!Array.isArray(a)||a.length!==1)throw Error("ACCOUNT_READ_ONLY_GRAPHQL_ACCOUNT_UNKNOWN");
 return a[0];
}
async function observed(label,work){
 try{findings.evidence[label]=await work()}
 catch(err){const code=String(err?.message||"UNKNOWN").slice(0,100);
  findings.evidence[label]={state:"UNVERIFIED",error:code};findings.issues.push(label+":"+code)}
}
await observed("originalCronSchedules",async()=>{
 const raw=await get("/workers/scripts/fugle-test/schedules");
 const list=Array.isArray(raw)?raw:Array.isArray(raw?.schedules)?raw.schedules:null;
 if(!list||list.some(x=>typeof x?.cron!=="string"))throw Error("PROVIDER_CRON_LIST_INVALID");
 const schedules=list.map(x=>x.cron).sort();
 const expected=["0-24 5 * * MON-FRI","* 1-4 * * MON-FRI",
  "35,55 15 * * mon-fri","* 9 * * MON-FRI"].sort();
 return {actualCount:schedules.length,exactOriginalSchedules:schedules,
  originalFourPreserved:JSON.stringify(schedules)===JSON.stringify(expected),
  providerSettingsRead:true};
});
await observed("currentActiveDeployment",async()=>{
 const raw=await get("/workers/scripts/fugle-test/deployments");
 const arr=Array.isArray(raw)?raw:Array.isArray(raw?.deployments)?raw.deployments:[];
 const current=arr[0]||null;
 if(!current||!Array.isArray(current.versions))throw Error("ACTIVE_DEPLOYMENT_PROVIDER_UNVERIFIED");
 return {activeVersionFingerprint:hash(current.versions.map(v=>({id:v.version_id,pct:v.percentage}))),
  activeVersionCount:current.versions.length,
  versionsAt100Percent:current.versions.length===1&&Number(current.versions[0].percentage)===100,
  deployedAtUtc:current.created_on||null};
});
await observed("workerHourlyInvocationsAggregate",async()=>{
 const q='query($accountTag:String!,$script:String!,$start:Time!,$end:Time!){viewer{accounts(filter:{accountTag:$accountTag}){workersInvocationsAdaptive(limit:1000,filter:{scriptName:$script,datetime_geq:$start,datetime_leq:$end}){sum{requests errors subrequests} quantiles{cpuTimeP50 cpuTimeP99 wallTimeP50 wallTimeP99} dimensions{datetime scriptName status}}}}}';
 const data=await gql(q,{accountTag:account,script:"fugle-test",start,end});
 const rows=data?.workersInvocationsAdaptive;
 if(!Array.isArray(rows))throw Error("WORKER_INVOCATIONS_AGGREGATE_MISSING");
 return {source:"workersInvocationsAdaptive",events:rows.length,
  totalRequests:rows.reduce((a,x)=>a+Number(x.sum?.requests||0),0),
  errors:rows.reduce((a,x)=>a+Number(x.sum?.errors||0),0),
  observedGroups:rows.slice(-70).map(x=>({
   utc:x.dimensions?.datetime||null,status:x.dimensions?.status||null,
   requests:x.sum?.requests||0,errors:x.sum?.errors||0,
   cpuTimeP50:x.quantiles?.cpuTimeP50??null,cpuTimeP99:x.quantiles?.cpuTimeP99??null,
   wallTimeP50:x.quantiles?.wallTimeP50??null,wallTimeP99:x.quantiles?.wallTimeP99??null,
   subrequests:x.sum?.subrequests??null})),
  cpuQuantileUnits:"GRAPHQL_VENDOR_NATIVE_SEE_DOCS",cpuQuantilesDoNotIdentifyFailureCauseAlone:true,
  cannotAttributeToCronSpecific:true,includesHttpRequests:true,
  vendorAnalyticsCanBeDelayed:true};
});
await observed("todayD1AccountUsageLowerBound",async()=>{
 const day=end.slice(0,10);
 const q='query($accountTag:String!,$start:Date!,$end:Date!){viewer{accounts(filter:{accountTag:$accountTag}){d1AnalyticsAdaptiveGroups(limit:1000,filter:{date_geq:$start,date_leq:$end}){sum{rowsRead rowsWritten readQueries writeQueries}dimensions{date databaseId}}}}}';
 const data=await gql(q,{accountTag:account,start:day,end:day});
 const rows=data?.d1AnalyticsAdaptiveGroups;
 if(!Array.isArray(rows))throw Error("D1_METRICS_GROUPS_UNKNOWN");
 return {utcDate:day,reportAgeUpperBound:null,
  availableGroups:rows.length,
  totals:rows.reduce((acc,row)=>({
   rowsRead:acc.rowsRead+Number(row.sum?.rowsRead||0),
   rowsWritten:acc.rowsWritten+Number(row.sum?.rowsWritten||0),
   readQueries:acc.readQueries+Number(row.sum?.readQueries||0),
   writeQueries:acc.writeQueries+Number(row.sum?.writeQueries||0)
  }),{rowsRead:0,rowsWritten:0,readQueries:0,writeQueries:0}),
  valuesAreLaggingLowerBoundsNotRemainingQuota:true,
  remainingFreeTierQuotaConfirmed:false};
});
findings.state=findings.evidence.originalCronSchedules?.originalFourPreserved===true?
 "ORIGINAL_CRON_SETTINGS_PRESERVED__RUNTIME_EXECUTION_CAUSE_NOT_YET_PROVEN":
 "ORIGINAL_CRON_SETTINGS_UNVERIFIED_OR_CHANGED";
findings.issues.sort();
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-p0-1020-cloudflare-provider-readonly.json",
 JSON.stringify(findings,null,2)+"\n");
console.log("SYSTEM1_P0_CLOUDFLARE_1020_PROVIDER="+JSON.stringify(findings));
if(findings.evidence.originalCronSchedules?.originalFourPreserved!==true)process.exitCode=2;
