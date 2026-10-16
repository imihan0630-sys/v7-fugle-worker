// Manual-only D1 physical read of October 6-12 Taipei baseline.
// Guardrail: one GET to identify original v7-live, exactly two constant SELECTs.
// No mutating endpoints, no Worker/KV/Cron/3Min/push/selection/trades.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {requireVerifiedSelectMetrics} from "../research/system1_p0_historical_cron_d1_readback_v0_1.mjs";
import {PRE_START,PRE_END,AGGREGATE_SQL,SLOT_SQL,classifyPreincident}
 from "../research/system1_p0_cron_preincident_baseline_v0_1.mjs";
const account=String(process.env.CLOUDFLARE_ACCOUNT_ID||"");
const token=String(process.env.SYSTEM1_P0_D1_READ_TOKEN||"");
const hash16=x=>createHash("sha256").update(x).digest("hex").slice(0,16);
const ACCOUNT_PIN="3a6732b4f5995750",DB_PIN="34d9667438c00c05";
const reportPath="artifacts/system1-p0-preincident-cron-d1-oct06-12.json";
const req={get:0,select:0,rowsRead:0,rowsWritten:0};
let report;
async function cloud(path,method="GET",body=null){
 const result=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
  method,headers:{authorization:"Bearer "+token,accept:"application/json",
   ...(body?{"content-type":"application/json"}:{})},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(22000)});
 const payload=await result.json().catch(()=>null);
 if(!result.ok||payload?.success!==true)throw Error("CLOUDFLARE_D1_HTTP_"+result.status);
 return payload.result;
}
async function select(id,sql,params){
 if(sql!==AGGREGATE_SQL&&sql!==SLOT_SQL)throw Error("SQL_NOT_PREDECLARED");
 if(!/^SELECT\b/i.test(sql)||/\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|REPLACE|PRAGMA|VACUUM|ATTACH)\b/i.test(sql))
  throw Error("SQL_NOT_READONLY");
 if(++req.select>2)throw Error("SQL_SELECT_BUDGET");
 const result=await cloud("/d1/database/"+id+"/query","POST",{sql,params});
 if(!Array.isArray(result)||result.length!==1||result[0]?.success!==true||
    !Array.isArray(result[0].results))throw Error("D1_RESULT_INVALID");
 const {written,read}=requireVerifiedSelectMetrics(result[0].meta,result[0].results.length);
 req.rowsWritten+=written;req.rowsRead+=read;
 if(req.rowsRead>50000)throw Error("D1_ROWS_READ_BUDGET");
 return result[0].results;
}
try{
 if(!/^[a-f0-9]{32}$/i.test(account)||!token)throw Error("SOURCE_CREDENTIALS_UNAVAILABLE");
 if(hash16(account)!==ACCOUNT_PIN)throw Error("WRONG_SOURCE_ACCOUNT");
 req.get++;
 const raw=await cloud("/d1/database?per_page=100");
 if(!Array.isArray(raw))throw Error("D1_DATABASE_LIST_INVALID");
 const matching=raw.filter(x=>x?.name==="v7-live");
 if(matching.length!==1)throw Error("V7_LIVE_SOURCE_NOT_UNIQUE");
 const id=String(matching[0].uuid||matching[0].id||"");
 if(!/^[a-f0-9-]{32,36}$/i.test(id)||hash16(id)!==DB_PIN)throw Error("WRONG_SOURCE_DATABASE");
 const groups=await select(id,AGGREGATE_SQL,[PRE_START,PRE_END]);
 const slots=await select(id,SLOT_SQL,[PRE_START,PRE_END]);
 report=classifyPreincident({groups,slots,observedAt:new Date().toISOString()});
 report.source={database:"v7-live",accountDigest:hash16(account),dbDigest:hash16(id),pinned:true};
 if(report.state.endsWith("_FAIL_CLOSED"))process.exitCode=2;
}catch(err){
 const s=String(err?.message||"READ_FAILED");
 report=classifyPreincident({readError:/^[A-Z0-9_]{4,72}$/.test(s)?s:"READ_FAILED",
  observedAt:new Date().toISOString()});
 process.exitCode=2;
}
report.transport={get:req.get,select:req.select,rowsRead:req.rowsRead,rowsWritten:req.rowsWritten};
await mkdir("artifacts",{recursive:true});
await writeFile(reportPath,JSON.stringify(report,null,2)+"\n");
console.log("SYSTEM1_P0_PREINCIDENT_D1_VERDICT="+JSON.stringify(report));
