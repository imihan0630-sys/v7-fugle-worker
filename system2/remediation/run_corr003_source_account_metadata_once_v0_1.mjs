// CORR-003 source account read-only live provider evidence probe.
// No D1 SQL, export, POST to D1, Worker/Cron change, Cloudflare mutations, billing or quota authority.
// Safe output is sanitized metadata only; provider analytics is explicitly LOWER BOUND.
import {writeFile,appendFile} from "node:fs/promises";
const emitPath="/tmp/corr003-source-account-live-readonly.json";
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const token=process.env.CLOUDFLARE_API_TOKEN||process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||"";
const d1ReadToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||token;
const normalizeDbId=x=>String(x||"").toLowerCase().replace(/-/g,"");
const startedAtUtc=new Date().toISOString();
const day=startedAtUtc.slice(0,10);
const report={schemaVersion:"CORR003_SOURCE_ACCOUNT_LIVE_METADATA_READONLY_V0_1",
 jobAttempt:process.env.GITHUB_RUN_ATTEMPT||null,
 runId:process.env.GITHUB_RUN_ID||null,
 headSha:process.env.GITHUB_SHA||null,
 sourceAccountId:"REDACTED",
 observedAtUtc:startedAtUtc,
 quotaDayUtc:day,
 allowedHttpMethods:["GET","POST_GRAPHQL_QUERY_ONLY"],
 d1SqlExecutions:0,
 workerWrites:0,
 scriptDeployments:0,
 workflowDispatches:0,
 oldSourceCronModified:false,
 system1FormalChanged:false,
 vendorFreshnessGuarantee:"NOT_DOCUMENTED",
 analyticsLagBoundMinutes:null,
 exactRemainingRowsWritten:null,exactRemainingRowsRead:null,
 authorizedSystem1WriteReserveRows:null,authorizedSystem1ReadReserveRows:null,
 system1WriteReserveAuthorized:false,system1ReadReserveAuthorized:false,
 liveFullAccountHeadroomCertified:false,
 exportSourceD1Authorized:false,
 status:"BLOCKED_UNVERIFIED_SOURCE_ACCOUNT_METADATA",
 errors:[],
 graphql:[],
 sourceWorkers:[]
};
const error=(tag,detail)=>report.errors.push({step:tag,reason:String(detail).slice(0,120).replace(/Bearer\s+\S+/gi,"[REDACTED]")});
function nonneg(x){return Number.isSafeInteger(x)&&x>=0?x:null}
async function request(url,method="GET",body=null,overrideToken=null){
 const res=await fetch(url,{method,headers:{Authorization:"Bearer "+(overrideToken||token),...(body?{"Content-Type":"application/json"}:{})},
 body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
 const val=await res.json().catch(()=>null);
 return {http:res.status,ok:res.ok&&val?.success!==false&&!val?.errors?.length,data:val?.result??null,graphql:val?.data??null};
}
let idMap={};
if(!/^[a-f0-9]{32}$/i.test(account)||!token){
 error("credentials","MISSING_PREEXISTING_SOURCE_ENVIRONMENT_TOKEN_OR_ACCOUNT_ID");
}else{
 try{
  const d=await request("https://api.cloudflare.com/client/v4/accounts/"+account+"/d1/database?per_page=100","GET",null,d1ReadToken);
  report.d1InventoryGet={http:d.http,success:d.ok};
  if(d.ok&&Array.isArray(d.data)){
   for(const z of d.data){const id=z?.uuid||z?.id;if(typeof id==="string")idMap[normalizeDbId(id)]=z.name==="v7-live"?"SYSTEM1_V8":z.name==="system2-research"?"SOURCE_SYSTEM2":"OTHER";}
   report.d1InventoryGet.databaseCount=d.data.length;
   report.d1InventoryGet.v8Detected=Object.values(idMap).includes("SYSTEM1_V8");
   report.d1InventoryGet.sourceSystem2Detected=Object.values(idMap).includes("SOURCE_SYSTEM2");
  }
 }catch(e){error("D1_INVENTORY_GET",e?.name||"ERROR")}
 for(const [label,name] of [["SOURCE_SYSTEM2","system2-shadow-research"],["SYSTEM1_V8","fugle-test"]]){
  try{
   const d=await request("https://api.cloudflare.com/client/v4/accounts/"+account+"/workers/scripts/"+name+"/schedules");
   const arr=Array.isArray(d.data)?d.data:(Array.isArray(d.data?.schedules)?d.data.schedules:(Array.isArray(d.data?.crons)?d.data.crons:null));
   const crons=arr?arr.map(x=>x?.cron||x?.expression).filter(x=>typeof x==="string"):null;
   report.sourceWorkers.push({role:label,http:d.http,success:d.ok,configuredCrons:crons});
  }catch(e){report.sourceWorkers.push({role:label,http:null,success:false,configuredCrons:null});error(label+"_CRON_GET",e?.name||"ERROR")}
 }
 const q="query D1Daily($accountTag:String!,$start:Date!,$end:Date!){viewer{accounts(filter:{accountTag:$accountTag}){d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$start,date_leq:$end},orderBy:[date_ASC]){sum{rowsRead rowsWritten readQueries writeQueries}dimensions{date databaseId}}}}}";
 for(let sample=1;sample<=2;sample++){
  try{
   const d=await request("https://api.cloudflare.com/client/v4/graphql","POST",{query:q,variables:{accountTag:account,start:day,end:day}});
   const accounts=d.graphql?.viewer?.accounts;
   const groups=Array.isArray(accounts)&&accounts.length===1?accounts[0]?.d1AnalyticsAdaptiveGroups:null;
   const complete=!!d.ok&&Array.isArray(groups)&&groups.length>0&&groups.every(z=>z.dimensions?.date===day&&typeof z.dimensions?.databaseId==="string"&&nonneg(z.sum?.rowsRead)!==null&&nonneg(z.sum?.rowsWritten)!==null);
   const summed=complete?groups.reduce((a,z)=>({rowsRead:a.rowsRead+z.sum.rowsRead,rowsWritten:a.rowsWritten+z.sum.rowsWritten}),{rowsRead:0,rowsWritten:0}):null;
   report.graphql.push({sample,observedAtUtc:new Date().toISOString(),http:d.http,providerRequestSucceeded:d.ok,
    groupCompletenessKnown:complete,groupCount:groups?.length??null,
    accountRowsReadLowerBound:summed?.rowsRead??null,accountRowsWrittenLowerBound:summed?.rowsWritten??null,
    observations:complete?groups.map(z=>({role:idMap[normalizeDbId(z.dimensions.databaseId)]||"UNKNOWN_DB",rowsReadLowerBound:z.sum.rowsRead,rowsWrittenLowerBound:z.sum.rowsWritten})):[],
    providerAnalyticsFreshnessCertified:false,spendableHeadroom:false});
  }catch(e){error("D1_GRAPHQL_SAMPLE_"+sample,e?.name||"ERROR")}
  if(sample===1)await new Promise(resolve=>setTimeout(resolve,1500));
 }
}
report.status=report.graphql.some(x=>x.groupCompletenessKnown)&&report.sourceWorkers.length===2
 ?"READ_ONLY_PROVIDER_OBSERVATION_OBTAINED_NO_QUOTA_GRANT"
 :"READ_ONLY_PROVIDER_OBSERVATION_PARTIAL_OR_MISSING";
report.completedAtUtc=new Date().toISOString();
await writeFile(emitPath,JSON.stringify(report,null,2)+"\n");
if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,
"### CORR-003 original-source metadata only\n"+
"Provider observation: "+report.status+"; true spendable headroom UNKNOWN; S1 reserve UNKNOWN; export not released.\n");
console.log(JSON.stringify({result:report.status,runId:report.runId,utcDay:day,observations:report.graphql.length,
 allSourceCronMetadataRead:report.sourceWorkers.length===2,physicalD1SQL:0,exportAuthorized:false}));
if(report.graphql.every(x=>!x.groupCompletenessKnown))process.exitCode=1;
