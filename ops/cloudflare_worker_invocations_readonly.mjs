// Query-only Cloudflare Worker invocation telemetry. GraphQL uses POST as a
// transport, but the operation is a read query and performs no resource mutation.
import {mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";

const endpoint="https://api.cloudflare.com/client/v4/graphql";
const isoMinute=value=>String(value||"").slice(0,16)+"Z";

export function summarizeInvocationRows(rows,{startUtc,endUtc,scriptName}){
 const groups=new Map();
 for(const row of Array.isArray(rows)?rows:[]){
  const minute=isoMinute(row?.dimensions?.datetime);
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(minute))continue;
  const status=String(row?.dimensions?.status||"UNKNOWN");
  const key=minute+"|"+status;
  const previous=groups.get(key)||{minuteUtc:minute,status,requests:0,errors:0,subrequests:0,
   cpuTimeP50:0,cpuTimeP99:0,memoryUsageBytesP50:0,memoryUsageBytesP99:0};
  previous.requests+=Number(row?.sum?.requests)||0;
  previous.errors+=Number(row?.sum?.errors)||0;
  previous.subrequests+=Number(row?.sum?.subrequests)||0;
  for(const field of ["cpuTimeP50","cpuTimeP99","memoryUsageBytesP50","memoryUsageBytesP99"]){
   previous[field]=Math.max(previous[field],Number(row?.quantiles?.[field])||0);
  }
  groups.set(key,previous);
 }
 const minutes=[...groups.values()].sort((a,b)=>a.minuteUtc.localeCompare(b.minuteUtc)||a.status.localeCompare(b.status));
 const activeMinutes=[...new Set(minutes.filter(x=>x.requests>0).map(x=>x.minuteUtc))];
 const errorMinutes=[...new Set(minutes.filter(x=>x.errors>0||!['success','clientDisconnected'].includes(x.status)).map(x=>x.minuteUtc))];
 const totalRequests=minutes.reduce((sum,x)=>sum+x.requests,0);
 const totalErrors=minutes.reduce((sum,x)=>sum+x.errors,0);
 return {schemaVersion:"SYSTEM1_WORKER_INVOCATIONS_READONLY_V0_1",observedAtUtc:new Date().toISOString(),
  scriptName,startUtc,endUtc,cloudflareMethod:"POST_GRAPHQL_QUERY_ONLY",cloudflareResourceMutations:0,
  attributionLimit:"DATASET_COMBINES_HTTP_AND_SCHEDULED_INVOCATIONS",sampleCount:minutes.length,totalRequests,totalErrors,
  lastInvocationMinuteUtc:activeMinutes.at(-1)||null,lastErrorMinuteUtc:errorMinutes.at(-1)||null,
  statusTotals:Object.values(Object.groupBy(minutes,x=>x.status)).map(items=>({status:items[0].status,
   requests:items.reduce((sum,x)=>sum+x.requests,0),errors:items.reduce((sum,x)=>sum+x.errors,0),
   maxCpuTimeP99:Math.max(...items.map(x=>x.cpuTimeP99)),maxMemoryUsageBytesP99:Math.max(...items.map(x=>x.memoryUsageBytesP99))})),
  minutes};
}

async function main(){
 const accountTag=process.env.CLOUDFLARE_ACCOUNT_ID||"";
 const token=process.env.CLOUDFLARE_API_TOKEN||process.env.WORKERS_API_TOKEN||"";
 const scriptName=process.env.CLOUDFLARE_WORKER_NAME||"fugle-test";
 if(!/^[0-9a-f]{32}$/i.test(accountTag)||!token)throw Error("EXISTING_CLOUDFLARE_READ_CREDENTIALS_REQUIRED");
 const end=new Date();
 const start=new Date(end.getTime()-8*60*60*1000);
 const startUtc=process.env.DIAGNOSTIC_START_UTC||start.toISOString();
 const endUtc=process.env.DIAGNOSTIC_END_UTC||end.toISOString();
 const query='query Invocations($accountTag:String!,$script:String!,$start:Time!,$end:Time!){viewer{accounts(filter:{accountTag:$accountTag}){workersInvocationsAdaptive(limit:10000,filter:{scriptName:$script,datetime_geq:$start,datetime_leq:$end},orderBy:[datetime_ASC]){sum{requests errors subrequests} quantiles{cpuTimeP50 cpuTimeP99 memoryUsageBytesP50 memoryUsageBytesP99} dimensions{datetime scriptName status}}}}}';
 const response=await fetch(endpoint,{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
  signal:AbortSignal.timeout(30000),body:JSON.stringify({query,variables:{accountTag,script:scriptName,start:startUtc,end:endUtc}})});
 const raw=await response.json().catch(()=>null);
 if(!response.ok||raw?.errors?.length)throw Error("CLOUDFLARE_GRAPHQL_QUERY_FAILED_"+response.status+"_"+String(raw?.errors?.[0]?.message||"").slice(0,120));
 const accounts=raw?.data?.viewer?.accounts;
 if(!Array.isArray(accounts)||accounts.length!==1||!Array.isArray(accounts[0]?.workersInvocationsAdaptive))throw Error("CLOUDFLARE_GRAPHQL_RESULT_INCOMPLETE");
 const report=summarizeInvocationRows(accounts[0].workersInvocationsAdaptive,{startUtc,endUtc,scriptName});
 await mkdir("artifacts",{recursive:true});
 const path=`artifacts/system1-worker-invocations-${endUtc.slice(0,10)}.json`;
 await writeFile(path,JSON.stringify(report,null,2)+"\n");
 console.log("SYSTEM1_WORKER_INVOCATIONS_READONLY="+JSON.stringify({...report,minutes:report.minutes.slice(-40)}));
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])main().catch(error=>{console.error(String(error?.message||error).slice(0,500));process.exitCode=2;});
