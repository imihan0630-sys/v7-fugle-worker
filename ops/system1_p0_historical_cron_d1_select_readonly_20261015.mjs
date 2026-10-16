// Manual-only original System1 V7_DB incident SELECT (2 bounded queries).
// Cloudflare D1 query service uses HTTP POST even for SELECT. This makes no
// business POST, no D1 SQL writes, no KV/Worker/Cron/phone mutations.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {TARGET_DATE,WINDOW_START,WINDOW_END,LEASE_KEY,CRON_SELECT,LEASE_SELECT,
  classifyHistoricalCronD1} from "../research/system1_p0_historical_cron_d1_readback_v0_1.mjs";
const account=String(process.env.CLOUDFLARE_ACCOUNT_ID||"");
const token=String(process.env.CLOUDFLARE_API_TOKEN||"");
const outPath="artifacts/system1-p0-historical-cron-d1-select-20261015.json";
const identityHash=x=>createHash("sha256").update(x).digest("hex").slice(0,16);
const requests={get:0,select:0,rowsRead:0,rowsWritten:0};
const BASE="https://api.cloudflare.com/client/v4/accounts/"+account;
async function cloud(path,method="GET",body=null){
  const response=await fetch(BASE+path,{method,headers:{
    authorization:"Bearer "+token,accept:"application/json",
    ...(body?{"content-type":"application/json"}:{})
  },...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});
  const payload=await response.json().catch(()=>null);
  if(!response.ok||payload?.success!==true)throw Error("CLOUDFLARE_READ_HTTP_"+response.status);
  return payload.result;
}
async function select(databaseId,sql,params){
  if(sql!==CRON_SELECT&&sql!==LEASE_SELECT)throw Error("NOT_PREDECLARED_SELECT");
  if(!/^SELECT\b/.test(sql)||/\b(INSERT|UPDATE|DELETE|DROP|CREATE|REPLACE|ALTER|VACUUM|ATTACH|PRAGMA)\b/i.test(sql))
    throw Error("NOT_SELECT_ONLY");
  if(++requests.select>2)throw Error("READ_QUERY_BUDGET");
  // Cloudflare REST transport is POST, strictly passing constant SELECT statements only.
  const result=await cloud("/d1/database/"+databaseId+"/query","POST",{sql,params});
  if(!Array.isArray(result)||result.length!==1||result[0]?.success!==true||
     !Array.isArray(result[0].results))throw Error("D1_SELECT_RECEIPT_UNVERIFIED");
  const meta=result[0].meta||{};
  if(!Object.prototype.hasOwnProperty.call(meta,"rows_written"))throw Error("D1_ROWS_WRITTEN_WITNESS_MISSING");
  const written=Number(meta.rows_written),read=Number(meta.rows_read??result[0].results.length);
  if(!Number.isFinite(written)||written!==0||!Number.isFinite(read)||read<0)
    throw Error("D1_SELECT_WRITE_OR_METRICS_UNVERIFIED");
  requests.rowsWritten+=written;
  requests.rowsRead+=read;
  if(requests.rowsRead>50000)throw Error("D1_READ_BUDGET_EXCEEDED");
  return result[0].results;
}
let report;
try{
  if(!/^[a-f0-9]{32}$/i.test(account)||!token)throw Error("EXISTING_SOURCE_D1_READ_CREDENTIALS_MISSING");
  requests.get++;
  const databases=await cloud("/d1/database?per_page=100");
  if(!Array.isArray(databases))throw Error("D1_LIST_UNVERIFIED");
  const source=databases.filter(x=>x.name==="v7-live");
  if(source.length!==1)throw Error("SOURCE_V7_LIVE_IDENTITY_NOT_UNIQUE");
  const databaseId=String(source[0].uuid||source[0].id||"");
  if(!/^[a-f0-9-]{32,36}$/i.test(databaseId))throw Error("SOURCE_D1_ID_INVALID");
  const cronRows=await select(databaseId,CRON_SELECT,[WINDOW_START,WINDOW_END]);
  const leaseRows=await select(databaseId,LEASE_SELECT,[LEASE_KEY]);
  report=classifyHistoricalCronD1({date:TARGET_DATE,cronRows,leaseRows,observedAt:new Date().toISOString()});
  report.sourceIdentity={database:"v7-live",databaseIdDigest16:identityHash(databaseId),
    accountIdDigest16:identityHash(account)};
}catch(error){
  // Codes only: never serialize Cloudflare response, token, lease or arbitrary SQL.
  const reason=String(error?.message||"D1_READ_FAILURE");
  const safe=/^[A-Z0-9_]{4,75}$/.test(reason)?reason:"D1_READ_FAILURE";
  report=classifyHistoricalCronD1({date:TARGET_DATE,readError:safe,observedAt:new Date().toISOString()});
  process.exitCode=2;
}
report.transport={d1QueryMethod:"HTTP_POST_FOR_CONSTANT_SELECT_ONLY",
  httpGetRequests:requests.get,d1SelectQueries:requests.select,
  rowsRead:requests.rowsRead,rowsWritten:requests.rowsWritten};
await mkdir("artifacts",{recursive:true});
await writeFile(outPath,JSON.stringify(report,null,2)+"\n");
console.log("SYSTEM1_P0_HISTORIC_CRON_D1_VERDICT="+JSON.stringify({
  state:report.state,slotEvidence:report.slotEvidence||null,
  lease:report.lease||null,queryOnly:true,noD1Write:true,
  transport:report.transport,readErrorClass:report.readErrorClass||null
}));
