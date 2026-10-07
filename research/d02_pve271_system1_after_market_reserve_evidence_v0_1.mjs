import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
const system2Token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||"";
assert.ok(accountId&&apiToken,"Cloudflare credentials required");
const api="https://api.cloudflare.com/client/v4";
const START="2026-09-15", END="2026-10-07";

async function jsonFetch(url,options={},label=url){
  const res=await fetch(url,{...options,signal:AbortSignal.timeout(45000)});
  const text=await res.text(); let data; try{data=JSON.parse(text)}catch{data=null}
  if(!res.ok||data?.success===false) throw new Error(label+" HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,700));
  return data;
}
async function cf(path,options={}){
  return jsonFetch(api+"/accounts/"+accountId+path,{...options,headers:{authorization:"Bearer "+apiToken,accept:"application/json","content-type":"application/json",...(options.headers||{})}},path);
}
const settings=await cf("/workers/scripts/fugle-test/settings");
const binding=(settings?.result?.bindings||[]).find(x=>x?.name==="V7_DB");
const dbId=binding?.id||binding?.database_id;
assert.ok(dbId,"V7_DB binding missing");

async function d1Select(sql,params=[]){
  const upper=String(sql).trimStart().toUpperCase();
  assert.ok(upper.startsWith("SELECT ")||upper.startsWith("WITH ")||upper.startsWith("PRAGMA "),"read-only SQL required");
  assert.ok(!/\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|ALTER|VACUUM|ATTACH|DETACH)\b/i.test(sql),"mutating SQL rejected");
  const d=await cf("/d1/database/"+dbId+"/query",{method:"POST",body:JSON.stringify({sql,params})});
  return d?.result?.[0]?.results||[];
}

const cronRows=await d1Select(
  `SELECT id,cron_expression,scheduled_at,job_type,status,skipped,fugle_calls,error
     FROM v7_cron_runs
     WHERE scheduled_at>=?1 AND scheduled_at<?2
     ORDER BY scheduled_at ASC`,
  [START+"T00:00:00.000Z","2026-10-08T00:00:00.000Z"]
);

const timeFmt=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hour12:false});
const dateFmt=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"});
const normalized=cronRows.map(r=>{
  const d=new Date(r.scheduled_at);
  return {
    id:r.id,cronExpression:r.cron_expression||null,scheduledAt:r.scheduled_at||null,
    taipeiDate:dateFmt.format(d),taipeiClock:timeFmt.format(d),
    jobType:r.job_type||null,status:r.status||null,skipped:Number(r.skipped||0),
    fugleCalls:Number.isFinite(Number(r.fugle_calls))?Number(r.fugle_calls):null,
    errorClass:r.error?/quota|row write limit/i.test(String(r.error))?"D1_QUOTA":String(r.error).slice(0,120):null
  };
});
const familyRows=normalized.filter(r=>["23:35","23:55"].includes(r.taipeiClock));
const healthyDates=[...new Set(familyRows.filter(r=>r.skipped!==1&&["SUCCESS","COMPLETE","COMPLETED"].includes(String(r.status).toUpperCase())).map(r=>r.taipeiDate))].sort();

const query=`query D1DailyRows($accountTag: string!, $start: Date, $end: Date) {
 viewer { accounts(filter: { accountTag: $accountTag }) {
   d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$start,date_leq:$end},orderBy:[date_ASC]) {
     sum { rowsRead rowsWritten readQueries writeQueries }
     dimensions { date databaseId }
   }
 }}
}`;
async function gqlWith(token){
  const res=await fetch(api+"/graphql",{method:"POST",headers:{authorization:"Bearer "+token,accept:"application/json","content-type":"application/json"},body:JSON.stringify({query,variables:{accountTag:accountId,start:START,end:END}}),signal:AbortSignal.timeout(45000)});
  const text=await res.text(); let data; try{data=JSON.parse(text)}catch{data=null}
  return {ok:res.ok&&!data?.errors?.length,status:res.status,data,error:data?.errors||text};
}
let ga=await gqlWith(apiToken),tokenRole="CLOUDFLARE_API_TOKEN";
if(!ga.ok&&system2Token){ga=await gqlWith(system2Token);tokenRole="SYSTEM2_CLOUDFLARE_API_TOKEN";}
if(!ga.ok) throw new Error("GraphQL unavailable "+ga.status+" "+JSON.stringify(ga.error).slice(0,700));
const groups=ga.data?.data?.viewer?.accounts?.[0]?.d1AnalyticsAdaptiveGroups||[];
const v7ByDate=new Map();
for(const g of groups){
  if(g?.dimensions?.databaseId!==dbId) continue;
  v7ByDate.set(String(g.dimensions.date),{
    rowsWritten:Number(g?.sum?.rowsWritten||0),rowsRead:Number(g?.sum?.rowsRead||0),
    writeQueries:Number(g?.sum?.writeQueries||0),readQueries:Number(g?.sum?.readQueries||0)
  });
}
const healthyEnvelopes=healthyDates.map(d=>({date:d,...(v7ByDate.get(d)||{rowsWritten:0,rowsRead:0,writeQueries:0,readQueries:0})}));
const writes=healthyEnvelopes.map(x=>x.rowsWritten).filter(Number.isFinite).sort((a,b)=>a-b);
const max=writes.length?writes[writes.length-1]:null;
const min=writes.length?writes[0]:null;
const median=writes.length?writes[Math.floor((writes.length-1)/2)]:null;
const reserveEvidenceState=healthyDates.length>=3&&max>0?"CONSERVATIVE_DAILY_V7_ENVELOPE_OBSERVED":"INSUFFICIENT_HEALTHY_AFTER_MARKET_DAYS";

const report={
 schemaVersion:"D02_PVE271_SYSTEM1_AFTER_MARKET_RESERVE_EVIDENCE_V0_1",
 generatedAt:new Date().toISOString(),readOnly:true,mutationCount:0,
 window:{start:START,end:END},
 cron:{rowCount:normalized.length,familyRowCount:familyRows.length,healthyAfterMarketDateCount:healthyDates.length,healthyDates,familyRows},
 v7DailyUsage:{analyticsTokenRole:tokenRole,healthyEnvelopes,minRowsWritten:min,medianRowsWritten:median,maxRowsWritten:max},
 reserveEvidenceState,
 semantics:{
   maxRowsWritten:"Conservative whole-V7_DB UTC-day envelope on dates with a successful 23:35/23:55 business execution; it is not an exact after-market write cost.",
   reserveNumberAuthorized:reserveEvidenceState==="CONSERVATIVE_DAILY_V7_ENVELOPE_OBSERVED",
   safetyMarginAuthorized:false,
   arbitraryReserveForbidden:true
 }
};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/d02-pve271-system1-after-market-reserve-evidence.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE271_RESULT="+JSON.stringify(report));
