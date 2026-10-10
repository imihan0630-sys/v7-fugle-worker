// OWNER-APPROVED SCOPE, NOT AN AUTOMATIC GRANT TO RUN.
// Target-only manual D1 schema install. Never creates DB, writes source, copies history,
// touches Workers, KV, R2, subscriptions, routes or Crons.
import {createHash} from "node:crypto";
import {planDestinationSchemaOnlyOfflineV0_1} from "./destination_schema_only_offline_payload_v0_1.mjs";
const h=x=>createHash("sha256").update(String(x).toLowerCase()).digest("hex");
const ACCOUNT_HASH="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const ORIGINAL_ACCOUNT_HASH="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const DATABASE_HASH="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const NAME="system2-research";
export const SCHEMA_CONFIRM="APPLY_EXISTING_DEST_D1_SCHEMA_ONLY_55";
export const SCHEMA_BOUNDARY="NO_SOURCE_NO_DATA_NO_WORKER_NO_CRON_NO_PAID";
const URL="https://api.cloudflare.com/client/v4";
function safeErr(code){throw Error(code);}
function cleanJson(r){return r.json().catch(()=>safeErr("CLOUDFLARE_RESPONSE_JSON_INVALID"));}
async function req(fetchImpl,url,token,method="GET",body){
 let response;
 try{response=await fetchImpl(url,{method,headers:{
  authorization:"Bearer "+token,accept:"application/json","content-type":"application/json"},
  ...(body?{body:JSON.stringify(body)}:{})});}
 catch{safeErr(method==="POST"?"D1_SQL_OUTCOME_UNKNOWN_NO_RETRY":"CLOUDFLARE_METADATA_READ_UNAVAILABLE");}
 if(!response?.ok)safeErr(method==="POST"?"D1_SQL_OUTCOME_UNKNOWN_NO_RETRY":"CLOUDFLARE_METADATA_READ_UNAVAILABLE");
 const data=await cleanJson(response);
 if(data?.success!==true)safeErr(method==="POST"?"D1_SQL_OUTCOME_UNKNOWN_NO_RETRY":"CLOUDFLARE_METADATA_READ_UNAVAILABLE");
 return data;
}
function sqlResults(x){
 if(!Array.isArray(x?.result)||x.result.length!==1||x.result[0]?.success===false||
     !Array.isArray(x.result[0]?.results))safeErr("D1_SQL_RESPONSE_NOT_CONFIRMED_NO_RETRY");
 return x.result[0].results;
}
async function executeSql(fetchImpl,base,token,sql){
 return sqlResults(await req(fetchImpl,base+"/query",token,"POST",{sql}));
}
async function executeWithTrustedIdentity({
 accountId,token,fetchImpl,mode="VERIFY_ONLY",confirm,boundary,
 files,sourceProvisioner,destinationReceipt,expectedPlanHash,onProgress=()=>{},
}={},identity){
 if(!["VERIFY_ONLY","APPLY_ONCE"].includes(mode)||
   confirm!==SCHEMA_CONFIRM||boundary!==SCHEMA_BOUNDARY) safeErr("OWNER_SCHEMA_SCOPE_CONFIRMATION_REQUIRED");
 if(!/^[a-f0-9]{32}$/i.test(accountId||"")||typeof token!=="string"||token.length<20||
   typeof fetchImpl!=="function")safeErr("DESTINATION_ID_TOKEN_OR_TRANSPORT_UNVERIFIED");
 if(h(accountId)!==identity.account||h(accountId)===identity.source)
   safeErr("DESTINATION_ACCOUNT_FINGERPRINT_MISMATCH");
 const plan=planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt});
 if(plan.state!=="SOURCE_SQL_PAYLOAD_OFFLINE_SEALED_NOT_AUTHORIZED"||plan.plannedStatements!==125||
    plan.planSequenceSha256!==expectedPlanHash)
   safeErr("SEALED_SQL_PAYLOAD_HASH_NOT_VERIFIED");
 const base=URL+"/accounts/"+accountId;
 const list=await req(fetchImpl,base+"/d1/database?page=1&per_page=100",token);
 if(list?.result_info?.total_count!==1||list?.result_info?.page!==1||
     !Array.isArray(list.result)||list.result.length!==1)safeErr("DESTINATION_D1_CARDINALITY_UNVERIFIED");
 const db=list.result[0],uuid=db?.uuid||db?.id;
 if(db?.name!==NAME||typeof uuid!=="string"||h(uuid)!==identity.database)
    safeErr("DESTINATION_D1_IDENTITY_MISMATCH");
 const info=await req(fetchImpl,base+"/d1/database/"+encodeURIComponent(uuid),token);
 const size=info?.result?.file_size;
 if(info?.result?.name!==NAME||!Number.isSafeInteger(size)||size<0||size>32768)
   safeErr("DESTINATION_EMPTY_D1_METADATA_CHANGED");
 const dbbase=base+"/d1/database/"+encodeURIComponent(uuid);
 // Even SELECT uses D1's POST /query endpoint, but does not mutate SQL rows.
 const initial=await executeSql(fetchImpl,dbbase,token,
   "SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name");
 if(initial.length!==0)safeErr("DESTINATION_SQL_SCHEMA_NOT_EMPTY_STOP_NO_RETRY");
 // No data copies. GraphQL rowsWritten is a lower-bound and not a real-time reserve:
 // only a physical isolated blank D1, low-volume schema DDL, one run and protected GitHub
 // Environment can be accepted by independent owner; record this limitation explicitly.
 const headroom={state:"SINGLE_EMPTY_D1_NEW_ACCOUNT_NO_WRITER_CRON_OWNERSHIP_ATTESTED",
   realtimeRowsWrittenCertified:false,upperBoundCostCertified:false};
 if(mode==="VERIFY_ONLY")
   return {result:"PREWRITE_EMPTY_TARGET_VERIFIED_ONLY",planSequenceSha256:plan.planSequenceSha256,
     plannedStatements:125,accountMatched:true,databaseMatched:true,schemaObjectsBefore:0,
     schemaObjectsAfter:null,appliedStatements:0,sourceRowsCopied:0,workerOrCronChanged:false,
     headroom,physicalSchemaInstalled:false};
 let done=0;
 const statuses=[];
 try{
   for(const item of plan.sqlStatements){
     const response=await executeSql(fetchImpl,dbbase,token,item.sql);
     if(response.length>0)safeErr("D1_DDL_UNEXPECTED_RESULT_ROWS_STOP_NO_RETRY");
     done++;
     statuses.push({ordinal:done,statementSha256:item.sha256,type:item.type});
     onProgress({appliedStatements:done,statementSha256:item.sha256});
   }
   const rows=await executeSql(fetchImpl,dbbase,token,
     "SELECT type,name FROM sqlite_schema WHERE "+
     "(type = 'table' AND name LIKE 's2_%') OR "+
     "(type = 'index' AND name LIKE 'idx_s2_%') ORDER BY type,name");
   const tab=rows.filter(x=>x.type==="table"),idx=rows.filter(x=>x.type==="index");
   if(tab.length!==55||idx.length!==63||
     rows.some(x=>!["table","index"].includes(x.type)))safeErr("POSTWRITE_SCHEMA_MISMATCH_MANUAL_AUDIT_REQUIRED");
   const meta=await executeSql(fetchImpl,dbbase,token,
     "SELECT schema_value FROM s2_schema_meta WHERE schema_key = 'schema_version' LIMIT 1");
   if(meta.length!==1||meta[0]?.schema_value!=="1.1")safeErr("POSTWRITE_SCHEMA_VERSION_MISMATCH_MANUAL_AUDIT_REQUIRED");
   return {result:"TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS",planSequenceSha256:plan.planSequenceSha256,
     appliedStatements:done,plannedStatements:125,schemaObjectsBefore:0,
     schemaTablesAfter:55,schemaIndexesAfter:63,schemaVersion:"1.1",
     sqlStatementHashes:statuses,sourceRowsCopied:0,workerOrCronChanged:false,
     sourcePhysicalBackupValidated:false,realHistoryMigrated:false,shadowEnabled:false,
     headroom,physicalSchemaInstalled:true};
 }catch(e){
    const reason=String(e?.message||"UNKNOWN").replace(/[^A-Z0-9_]/g,"").slice(0,100);
    const err=new Error("UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY_"+reason);
    err.appliedStatements=done;
    err.planSequenceSha256=plan.planSequenceSha256;
    err.progressHashes=statuses;
    throw err;
 }
}

// Production entrypoint ALWAYS pins independently attested Cloudflare account / D1 identity.
export function inspectOrApplyDestinationSchemaV0_1(input){
 return executeWithTrustedIdentity(input,{account:ACCOUNT_HASH,source:ORIGINAL_ACCOUNT_HASH,database:DATABASE_HASH});
}
// Mock-only isolated test seam. Cannot accept real bearer tokens or a non-injected fetch.
// Never import this helper in the GitHub deploy runner.
export function __testOnlySyntheticIdentityEngineV0_1(input,identity){
 if(typeof input?.token!=="string"||!input.token.startsWith("SYNTHETIC_TEST_ONLY_TOKEN_")||
    typeof input.fetchImpl!=="function")throw Error("TEST_ONLY_SYNTHETIC_TOKEN_REQUIRED");
 if(![identity?.account,identity?.source,identity?.database].every(x=>/^[a-f0-9]{64}$/i.test(x)))
   throw Error("TEST_ONLY_IDENTITY_INVALID");
 return executeWithTrustedIdentity(input,identity);
}
