// Owner-manual, source-account pinned D1 SELECT-only differential witness.
// REST transport uses POST for SQL SELECT. Never issue business POST or D1 writes.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {requireVerifiedSelectMetrics} from "../research/system1_p0_historical_cron_d1_readback_v0_1.mjs";
import {INCIDENT_DATE,WINDOW_START,WINDOW_END,BASELINE_START,BASELINE_END,
 ANY_TYPE_SQL,BASELINE_SQL,classifyCronGap} from "../research/system1_p0_cron_gap_differential_v0_1.mjs";
const account=String(process.env.CLOUDFLARE_ACCOUNT_ID||"");
const token=String(process.env.SYSTEM1_P0_D1_READ_TOKEN||"");
const sha16=s=>createHash("sha256").update(String(s)).digest("hex").slice(0,16);
const PINNED_SOURCE_ACCOUNT_SHA16="3a6732b4f5995750";
const PINNED_SOURCE_DB_SHA16="34d9667438c00c05";
const artifact="artifacts/system1-p0-cron-gap-differential-20261015.json";
const request={get:0,sqlSelect:0,rowsRead:0,rowsWritten:0};
const BASE="https://api.cloudflare.com/client/v4/accounts/"+account;
async function api(path,method="GET",payload=null){
 const response=await fetch(BASE+path,{method,
  headers:{authorization:"Bearer "+token,accept:"application/json",
   ...(payload?{"content-type":"application/json"}:{})},
  ...(payload?{body:JSON.stringify(payload)}:{}),
  signal:AbortSignal.timeout(20000)});
 const data=await response.json().catch(()=>null);
 if(!response.ok||data?.success!==true)throw Error("CLOUDFLARE_READ_HTTP_"+response.status);
 return data.result;
}
async function select(db,sql,params){
 if(sql!==ANY_TYPE_SQL&&sql!==BASELINE_SQL)throw Error("SQL_NOT_PREDECLARED");
 if(!/^SELECT\b/.test(sql)||/\b(INSERT|UPDATE|DELETE|DROP|CREATE|REPLACE|ALTER|VACUUM|ATTACH|PRAGMA)\b/i.test(sql))
  throw Error("NOT_SELECT_ONLY");
 if(++request.sqlSelect>2)throw Error("SELECT_QUERY_BUDGET_EXCEEDED");
 const result=await api("/d1/database/"+db+"/query","POST",{sql,params});
 if(!Array.isArray(result)||result.length!==1||result[0]?.success!==true||
   !Array.isArray(result[0].results))throw Error("D1_SELECT_RESPONSE_UNVERIFIED");
 const {written,read}=requireVerifiedSelectMetrics(result[0].meta,result[0].results.length);
 request.rowsRead+=read;
 request.rowsWritten+=written;
 if(request.rowsRead>50000)throw Error("D1_READ_BUDGET_EXCEEDED");
 return result[0].results;
}
let verdict;
try{
 if(!/^[a-f0-9]{32}$/i.test(account)||!token)throw Error("SOURCE_D1_READ_TOKEN_MISSING");
 if(sha16(account)!==PINNED_SOURCE_ACCOUNT_SHA16)throw Error("WRONG_ORIGIN_ACCOUNT");
 request.get++;
 const databases=await api("/d1/database?per_page=100");
 if(!Array.isArray(databases))throw Error("D1_DATABASE_LIST_INVALID");
 const matches=databases.filter(x=>x?.name==="v7-live");
 if(matches.length!==1)throw Error("SOURCE_D1_NOT_UNIQUE");
 const id=String(matches[0].uuid||matches[0].id||"");
 if(sha16(id)!==PINNED_SOURCE_DB_SHA16)throw Error("WRONG_ORIGIN_D1_ID");
 const windowRows=await select(id,ANY_TYPE_SQL,[WINDOW_START,WINDOW_END]);
 const baselineRows=await select(id,BASELINE_SQL,[BASELINE_START,BASELINE_END]);
 verdict=classifyCronGap({date:INCIDENT_DATE,windowRows,baselineRows,
  observedAt:new Date().toISOString()});
 verdict.sourceIdentity={database:"v7-live",
  accountSha16:sha16(account),databaseSha16:sha16(id),
  pinnedAccountAndDatabase:true};
 if(/FAIL_CLOSED/.test(verdict.state))process.exitCode=2;
}catch(e){
 const reason=String(e?.message||"D1_READ_FAILURE");
 const safe=/^[A-Z0-9_]{4,72}$/.test(reason)?reason:"D1_READ_FAILURE";
 verdict=classifyCronGap({date:INCIDENT_DATE,readError:safe,
  observedAt:new Date().toISOString()});
 process.exitCode=2;
}
verdict.transport={sqlMethod:"HTTP_POST_SELECT_ONLY",getRequests:request.get,
 sqlSelectQueries:request.sqlSelect,rowsRead:request.rowsRead,
 rowsWritten:request.rowsWritten};
await mkdir("artifacts",{recursive:true});
await writeFile(artifact,JSON.stringify(verdict,null,2)+"\n");
console.log("SYSTEM1_P0_CRON_GAP_VERDICT="+JSON.stringify({
 state:verdict.state,window:verdict.window||null,baseline:verdict.baseline||null,
 sourceIdentity:verdict.sourceIdentity||null,
 readErrorClass:verdict.readErrorClass||null,transport:verdict.transport,
 noD1Write:true,noWorkerDeploy:true,noPush:true,noTrade:true}));
