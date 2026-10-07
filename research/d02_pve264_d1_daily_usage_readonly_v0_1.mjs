import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
const system2Token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||"";
assert.ok(accountId&&apiToken,"Cloudflare repository secrets required");
const api="https://api.cloudflare.com/client/v4";

async function cfJson(url,options={}){
 const res=await fetch(url,{...options,headers:{authorization:"Bearer "+apiToken,accept:"application/json","content-type":"application/json",...(options.headers||{})},signal:AbortSignal.timeout(45000)});
 const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=null}
 if(!res.ok||data?.success===false)throw new Error("Cloudflare HTTP "+res.status+": "+String(data?.errors?.[0]?.message||text).slice(0,600));
 return data;
}
const settings=await cfJson(api+"/accounts/"+accountId+"/workers/scripts/fugle-test/settings");
const v7Binding=(settings?.result?.bindings||[]).find(x=>x?.name==="V7_DB");
const v7DbId=v7Binding?.id||v7Binding?.database_id;
assert.ok(v7DbId,"V7_DB id unavailable");
let system2DbId=null;
try{
 const s2=await cfJson(api+"/accounts/"+accountId+"/workers/scripts/system2-shadow-research/settings");
 const b=(s2?.result?.bindings||[]).find(x=>x?.name==="SYSTEM2_DB");
 system2DbId=b?.id||b?.database_id||null;
}catch{}
const nameById=new Map([[v7DbId,"V7_DB"],...(system2DbId?[[system2DbId,"SYSTEM2_DB"]]:[])]);

const query=`query D1DailyRows($accountTag: string!, $start: Date, $end: Date) {
 viewer {
  accounts(filter: { accountTag: $accountTag }) {
   d1AnalyticsAdaptiveGroups(
    limit: 10000
    filter: { date_geq: $start, date_leq: $end }
    orderBy: [date_DESC]
   ) {
    sum { rowsRead rowsWritten readQueries writeQueries }
    dimensions { date databaseId }
   }
  }
 }
}`;
async function gqlWithToken(token){
 const res=await fetch(api+"/graphql",{method:"POST",headers:{authorization:"Bearer "+token,accept:"application/json","content-type":"application/json"},body:JSON.stringify({query,variables:{accountTag:accountId,start:"2026-10-07",end:"2026-10-07"}}),signal:AbortSignal.timeout(45000)});
 const text=await res.text();let data;try{data=JSON.parse(text)}catch{data=null}
 return {ok:res.ok&&!data?.errors?.length,status:res.status,data,error:data?.errors||data?.errors?.[0]?.message||text};
}
let gqlAttempt=await gqlWithToken(apiToken),tokenRole="CLOUDFLARE_API_TOKEN";
if(!gqlAttempt.ok&&system2Token){gqlAttempt=await gqlWithToken(system2Token);tokenRole="SYSTEM2_CLOUDFLARE_API_TOKEN";}
if(!gqlAttempt.ok)throw new Error("GraphQL analytics unavailable: HTTP "+gqlAttempt.status+" "+JSON.stringify(gqlAttempt.error).slice(0,900));
const gql=gqlAttempt.data;
const groups=gql?.data?.viewer?.accounts?.[0]?.d1AnalyticsAdaptiveGroups||[];
const rows=groups.map(g=>({
 date:g?.dimensions?.date??null,databaseId:g?.dimensions?.databaseId??null,databaseName:nameById.get(g?.dimensions?.databaseId)||null,
 rowsRead:Number(g?.sum?.rowsRead||0),rowsWritten:Number(g?.sum?.rowsWritten||0),
 readQueries:Number(g?.sum?.readQueries||0),writeQueries:Number(g?.sum?.writeQueries||0),
 isV7Db:g?.dimensions?.databaseId===v7DbId
})).sort((a,b)=>b.rowsWritten-a.rowsWritten);
const totals=rows.reduce((a,x)=>({rowsRead:a.rowsRead+x.rowsRead,rowsWritten:a.rowsWritten+x.rowsWritten,readQueries:a.readQueries+x.readQueries,writeQueries:a.writeQueries+x.writeQueries}),{rowsRead:0,rowsWritten:0,readQueries:0,writeQueries:0});
const report={schemaVersion:"D02_PVE264_D1_DAILY_USAGE_READONLY_V0_2",generatedAt:new Date().toISOString(),readOnly:true,mutationCount:0,date:"2026-10-07",analyticsTokenRole:tokenRole,v7DbId,system2DbId,databaseCount:rows.length,rows,accountTotals:totals,freeTierRowsWrittenLimit:100000,accountRowsWrittenAtOrAboveFreeLimit:totals.rowsWritten>=100000};
await mkdir("artifacts",{recursive:true});await writeFile("artifacts/d02-pve264-d1-daily-usage-readonly.json",JSON.stringify(report,null,2)+"\n");
console.log("D02_PVE264_RESULT="+JSON.stringify(report));
