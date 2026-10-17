// Original System1 v7-live D1 physical SELECT: manual main workflow only.
// REST uses HTTP POST as transport for a parameterized SELECT, never writes SQL.
// Never print raw quality snapshot, company financial figures, tokens or UUIDs.
import {mkdir,writeFile} from "node:fs/promises";
import {DATE,KIND,ORIGINAL_SELECT,classifyOriginalD1QuarterEps} from
 "../research/system1_p0_quarter_eps_d1_symbol_receipt_v0_1.mjs";
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const token=process.env.CLOUDFLARE_API_TOKEN||"";
const output="artifacts/system1-p0-quarter-eps-d1-symbols-20261016.json";
let report;
let queryCount=0;
async function api(path,method="GET",body){
 const rsp=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
  method,headers:{authorization:"Bearer "+token,accept:"application/json",
   ...(body?{"content-type":"application/json"}:{})},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(24000)});
 const v=await rsp.json().catch(()=>null);
 if(!rsp.ok||v?.success!==true)throw Error("ORIGINAL_D1_API_HTTP_"+rsp.status);
 return v.result;
}
try{
 if(!/^[a-f0-9]{32}$/i.test(account)||!token)throw Error("SOURCE_READ_TOKEN_NOT_CONFIGURED");
 const dbs=await api("/d1/database?per_page=100");
 const matches=Array.isArray(dbs)?dbs.filter(x=>x.name==="v7-live"):[];
 if(matches.length!==1)throw Error("SOURCE_V7_LIVE_IDENTITY_AMBIGUOUS");
 const uuid=String(matches[0].uuid||matches[0].id||"");
 if(!/^[a-f0-9-]{32,36}$/i.test(uuid))throw Error("SOURCE_D1_UUID_INVALID");
 if(++queryCount!==1||!ORIGINAL_SELECT.startsWith("SELECT ")||
    /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|ATTACH)\b/i.test(ORIGINAL_SELECT))
    throw Error("D1_SELECT_ALLOWLIST_REJECTED");
 const payload=await api("/d1/database/"+uuid+"/query","POST",{
  sql:ORIGINAL_SELECT,params:[KIND,DATE]});
 if(!Array.isArray(payload)||payload.length!==1||payload[0]?.success!==true||
    !Array.isArray(payload[0]?.results))throw Error("D1_SELECT_RESULT_UNVERIFIED");
 report=classifyOriginalD1QuarterEps({sourceDatabaseName:"v7-live",
  marketDate:DATE,rows:payload[0].results,meta:payload[0].meta,
  observedAt:new Date().toISOString()});
 if(report.state!=="EXACT_SNAPSHOT_MEMBERSHIP_OBSERVED")process.exitCode=2;
}catch(e){
 const msg=String(e?.message||"READ_UNVERIFIED");
 const reason=/^[A-Z0-9_]{4,75}$/.test(msg)?msg:"READ_UNVERIFIED";
 report={schema:"S1_P0_QUARTER_EPS_D1_SYMBOL_MEMBERSHIP_V0_1",date:DATE,
  state:"NOT_VERIFIED",reason,queryCount,productionDataChanged:false,
  historicalPitCertified:false,formalSelectionCertified:false,canTrade:false};
 process.exitCode=2;
}
report.transport={getListCount:1,d1SelectCount:queryCount,onlyConstantParameterizedSelect:true,
 d1WriteCount:0,workerPostCount:0,cronChanges:0,noCredentialsExported:true};
await mkdir("artifacts",{recursive:true});
await writeFile(output,JSON.stringify(report,null,2)+"\n","utf8");
console.log("S1_P0_EPS_D1_MEMBERSHIP="+JSON.stringify({
 state:report.state,reason:report.reason||null,missingCodes:report.missingCodes||null,
 stockMapCount:report.stockMapCount??null,periodMatches:report.periodMatches??null,
 countMatches:report.countMatches??null,queryCount,
 formalSelectionCertified:false,canTrade:false}));
