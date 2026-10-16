// Source Worker provider GET and bounded GraphQL-only historic context.
// NO Worker updates, deployments, live tracing/tails, D1 SQL, KV writes or trades.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
const account=String(process.env.CLOUDFLARE_ACCOUNT_ID||"");
const token=String(process.env.CLOUDFLARE_API_TOKEN||"");
const sha16=x=>createHash("sha256").update(String(x)).digest("hex").slice(0,16);
const pinnedAccount="3a6732b4f5995750";
const script="fugle-test",base="https://api.cloudflare.com/client/v4/accounts/"+account;
const minUtc="2026-10-12T00:00:00.000Z",maxUtc="2026-10-16T16:00:00.000Z";
const slotTimes=["2026-10-13","2026-10-14","2026-10-15"];
const windows=slotTimes.map(day=>({day,
 start:day+"T15:25:00.000Z",end:day+"T16:15:00.000Z"}));
const reportPath="artifacts/system1-p0-historical-deploy-invocations-oct13-15.json";
let gets=0,gqlCalls=0;const safeError=e=>{
 const s=String(e?.message||"UNKNOWN");
 return /^[A-Z0-9_]{4,80}$/.test(s)?s:"PROVIDER_READ_ERROR";
};
async function get(path){
 if(++gets>3)throw Error("GET_BUDGET_EXCEEDED");
 const response=await fetch(base+path,{headers:{authorization:"Bearer "+token,accept:"application/json"},
  method:"GET",signal:AbortSignal.timeout(20000)});
 const raw=await response.json().catch(()=>null);
 if(!response.ok||raw?.success!==true)throw Error("PROVIDER_HTTP_"+response.status);
 return raw.result;
}
async function gql(query,variables){
 if(++gqlCalls>4)throw Error("GRAPHQL_BUDGET_EXCEEDED");
 const response=await fetch("https://api.cloudflare.com/client/v4/graphql",{
  method:"POST",headers:{authorization:"Bearer "+token,"content-type":"application/json"},
  body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(25000)});
 const raw=await response.json().catch(()=>null);
 if(!response.ok||!raw?.data||raw?.errors?.length)throw Error("GRAPHQL_READ_UNAVAILABLE");
 const a=raw?.data?.viewer?.accounts;
 if(!Array.isArray(a)||a.length!==1)throw Error("GRAPHQL_ACCOUNT_NOT_UNIQUE");
 return a[0];
}
const report={schema:"SYSTEM1_P0_HISTORIC_PROVIDER_VERSION_V0_1",observedAt:new Date().toISOString(),
 source:{worker:script,accountDigest:sha16(account)},window:{minUtc,maxUtc},
 incidentDate:"2026-10-15",versionHistoryProvesRootCause:false,
 aggregateInvocationsProveCron:false,quotaUsageProvesRemainingQuota:false,
 noProviderMutation:true,noWorkerDeploy:true,noCronChanges:true,noD1Sql:true,
 noD1Write:true,noKVMutation:true,noPush:true,noTrade:true,
 evidence:{},issues:[],requestBudget:{get:3,graphql:4}};
try{
 if(!/^[a-f0-9]{32}$/i.test(account)||!token||sha16(account)!==pinnedAccount)
  throw Error("SOURCE_WORKERS_CREDENTIALS_OR_PIN_INVALID");
 const [schedule,deployments]=await Promise.all([
  get("/workers/scripts/"+script+"/schedules"),
  get("/workers/scripts/"+script+"/deployments?per_page=100")
 ]);
 const cronList=Array.isArray(schedule)?schedule:Array.isArray(schedule?.schedules)?schedule.schedules:null;
 if(!cronList||cronList.some(x=>typeof x?.cron!=="string"))throw Error("ORIGINAL_CRON_LIST_UNVERIFIED");
 report.evidence.cron={count:cronList.length,expressions:cronList.map(x=>x.cron).sort(),
  target23_35_55:cronList.some(x=>String(x.cron).toLowerCase().replace(/\s+/g," ").trim()==="35,55 15 * * mon-fri")};
 const ds=Array.isArray(deployments)?deployments:Array.isArray(deployments?.deployments)?deployments.deployments:null;
 if(!Array.isArray(ds)||ds.length>100)throw Error("DEPLOYMENTS_NOT_BOUNDED");
 const audited=ds.map(d=>({
  at:typeof d?.created_on==="string"?d.created_on:null,
  pct:Array.isArray(d?.versions)?d.versions.map(v=>Number(v?.percentage)):[],
  id:Array.isArray(d?.versions)?d.versions.map(v=>sha16(v?.version_id||"")):[],
  versionIds:Array.isArray(d?.versions)?d.versions.map(v=>String(v.version_id||"")):[],
  idDigest:sha16(d?.id||"")
 }));
 if(audited.some(x=>!x.at||!Number.isFinite(Date.parse(x.at))||
    !x.pct.length||x.pct.length!==x.id.length||x.pct.some(p=>!Number.isFinite(p)||p<=0)||
    Math.abs(x.pct.reduce((a,b)=>a+b,0)-100)>0.001))throw Error("DEPLOYMENT_SHAPES_INVALID");
 const byDate=audited.toSorted((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 // List must reach a deployment at/before first incident day for definitive
 // as-of historical version proof. Otherwise report partial, not false proof.
 const asOf={};
 for(const day of slotTimes){
  const cutoff=day+"T15:35:00.000Z";
  const candidates=byDate.filter(d=>d.at<=cutoff);
  const chosen=candidates.at(-1)||null;
  asOf[day]=chosen?{deploymentAt:chosen.at,versionDigests:chosen.id,
    trafficPercents:chosen.pct,proofWindowComplete:ds.length<100||byDate[0]?.at<=cutoff}:
    {deploymentAt:null,versionDigests:[],trafficPercents:[],proofWindowComplete:false};
 }
 const incidentVersionIds=[...new Set(byDate.filter(d=>d.at<=maxUtc&&d.at>=minUtc)
   .flatMap(d=>d.versionIds))];
 const probeVersionId=byDate.filter(d=>d.at<="2026-10-15T15:55:00.000Z")
  .at(-1)?.versionIds?.find(Boolean);
 const version=probeVersionId?await get("/workers/scripts/"+script+"/versions/"+probeVersionId):null;
 const meta=version?.metadata||{},resources=version?.resources||{},scriptInfo=resources.script||{};
 report.evidence.deployments={
  returned:audited.length,limit:100,potentiallyTruncated:audited.length===100,
  newestDeployedAt:byDate.at(-1)?.at||null,
  oldestDeployedAt:byDate[0]?.at||null,
  withinHistoricalWindow:audited.filter(x=>x.at>=minUtc&&x.at<=maxUtc).map(x=>({
   deployedAt:x.at,versionDigests:x.id,trafficPercents:x.pct,deploymentDigest:x.idDigest})),
  asOf23_35Utc:asOf,
  asOfRequiresOldestAtOrBeforeOct13:!!asOf["2026-10-13"]?.deploymentAt,
  scriptVersionMetadata:probeVersionId?{
   versionDigest:sha16(probeVersionId),
   createdAt:meta.created_on||null,
   source:meta.source||null,
   scriptEtagDigest:scriptInfo.etag?sha16(scriptInfo.etag):null,
   handlers:Array.isArray(scriptInfo.handlers)?scriptInfo.handlers.filter(x=>["fetch","scheduled","queue","email","tail"].includes(x)):[],
   bindingNames:Array.isArray(resources.bindings)?
     resources.bindings.map(x=>String(x?.name||"").slice(0,50)).filter(x=>x==="V7_DB"||x==="STOCKS_KV"):
     null
  }:null};
 // Each Worker invocation row is an aggregate; request type is not selected,
 // so matching timestamps cannot establish specific scheduled event delivery.
 const q='query($accountTag:String!,$script:String!,$start:Time!,$end:Time!){viewer{accounts(filter:{accountTag:$accountTag}){workersInvocationsAdaptive(limit:200,filter:{scriptName:$script,datetime_geq:$start,datetime_leq:$end}){sum{requests errors subrequests}dimensions{datetime status}}}}}';
 report.evidence.invocations=[];
 for(const w of windows){
  try{
   const v=await gql(q,{accountTag:account,script,start:w.start,end:w.end});
   const rows=v?.workersInvocationsAdaptive;
   if(!Array.isArray(rows))throw Error("WORKER_INVOCATIONS_GROUPS_MISSING");
   const total=rows.reduce((a,x)=>a+Number(x?.sum?.requests||0),0);
   const errors=rows.reduce((a,x)=>a+Number(x?.sum?.errors||0),0);
   report.evidence.invocations.push({day:w.day,start:w.start,end:w.end,
    groupCount:rows.length,truncated:rows.length===200,requests:total,errors,
    groups:rows.slice(0,30).map(x=>({
     utc:x?.dimensions?.datetime||null,status:x?.dimensions?.status||null,
     requests:Number(x?.sum?.requests||0),errors:Number(x?.sum?.errors||0)})),
    scheduledInvocationProven:false});
  }catch(e){
   report.evidence.invocations.push({day:w.day,state:"UNVERIFIED",errorClass:safeError(e),
    scheduledInvocationProven:false});
   report.issues.push("INVOCATIONS_"+w.day+":"+safeError(e));
  }
 }
 // Provider D1 analytics is delayed, UTC-day, and billing/account aggregate.
 // It is NEVER a remaining-quota gauge or direct proof of the Oct15 failure.
 try{
  const q='query($accountTag:String!,$start:Date!,$end:Date!){viewer{accounts(filter:{accountTag:$accountTag}){d1AnalyticsAdaptiveGroups(limit:100,filter:{date_geq:$start,date_leq:$end}){sum{rowsRead rowsWritten readQueries writeQueries}dimensions{date databaseId}}}}}';
  const d=await gql(q,{accountTag:account,start:"2026-10-12",end:"2026-10-16"});
  const groups=d?.d1AnalyticsAdaptiveGroups;
  if(!Array.isArray(groups)||groups.length>=100)throw Error("D1_METRICS_TRUNCATED_OR_UNAVAILABLE");
  const metric=(rows)=>rows.reduce((sum,x)=>({
   rowsRead:sum.rowsRead+Number(x?.sum?.rowsRead||0),
   rowsWritten:sum.rowsWritten+Number(x?.sum?.rowsWritten||0),
   readQueries:sum.readQueries+Number(x?.sum?.readQueries||0),
   writeQueries:sum.writeQueries+Number(x?.sum?.writeQueries||0)
  }),{rowsRead:0,rowsWritten:0,readQueries:0,writeQueries:0});
  const days=["2026-10-13","2026-10-14","2026-10-15"];
  report.evidence.d1AccountUsage={
   timezone:"UTC_DAY_NOT_TAIPEI",
   days:days.map(day=>{
    const rows=groups.filter(x=>x?.dimensions?.date===day);
    const pinned=rows.filter(x=>sha16(x?.dimensions?.databaseId||"")==="34d9667438c00c05");
    return {utcDate:day,dbGroups:rows.length,accountAllDatabases:metric(rows),
     exactSourceDbGroupCount:pinned.length,originalSourceDb:metric(pinned)};
   }),
   graphqlReadOnly:true,providerDataCanLag:true,notQuotaRemainingProof:true,
   cannotProveCronSuccessOrFailure:true};
 }catch(e){
  report.evidence.d1AccountUsage={state:"UNVERIFIED",errorClass:safeError(e),
   notQuotaRemainingProof:true};
  report.issues.push("D1_ACCOUNT_METRICS:"+safeError(e));
 }
 report.state=!report.evidence.cron.target23_35_55?"ORIGINAL_CRON_SCHEDULE_UNVERIFIED":
  !asOf["2026-10-13"]?.proofWindowComplete?"HISTORIC_DEPLOYMENT_WINDOW_UNVERIFIED":
  "PROVIDER_HISTORIC_VERSION_TIMELINE_READ_OK__CRON_EXECUTION_UNVERIFIED";
 if(report.state!=="PROVIDER_HISTORIC_VERSION_TIMELINE_READ_OK__CRON_EXECUTION_UNVERIFIED")
  process.exitCode=2;
}catch(e){
 report.state="HISTORIC_PROVIDER_READ_UNAVAILABLE";
 report.issues.push(safeError(e));process.exitCode=2;
}
report.requests={get:gets,graphql:gqlCalls};
await mkdir("artifacts",{recursive:true});
await writeFile(reportPath,JSON.stringify(report,null,2)+"\n");
console.log("SYSTEM1_P0_HISTORIC_PROVIDER_VERDICT="+JSON.stringify(report));
