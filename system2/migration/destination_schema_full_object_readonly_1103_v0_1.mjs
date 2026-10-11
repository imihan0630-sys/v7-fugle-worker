// Issue #1103: post-install destination D1 complete sqlite_schema inventory.
// Exactly two SQL SELECTs (D1 API uses HTTP POST /query for SELECT).
// Zero DDL/DML, no source-account requests, no Worker/KV/R2 or billing.
// FAIL CLOSED on missing, same-count-but-different-name, extra, wrong owner, or untrusted receipts.
import {createHash} from "node:crypto";
import {planDestinationSchemaOnlyOfflineV0_1} from "./destination_schema_only_offline_payload_v0_1.mjs";

const SHA=s=>createHash("sha256").update(String(s).toLowerCase()).digest("hex");
const digest=s=>createHash("sha256").update(s).digest("hex");
const DEST_ACCOUNT_HASH="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const SOURCE_ACCOUNT_HASH="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const DEST_DB_HASH="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const SCHEMA_PLAN_SHA="99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f";
const DB_NAME="system2-research";
export const FULL_OBJECT_CONFIRM="DEST_SCHEMA_FULL_OBJECT_READONLY_ONLY";
export const FULL_OBJECT_VERSION="S2_DEST_D1_FULL_OBJECT_READONLY_1103_V0_1";
// SQLite reserves names beginning exactly with "sqlite_". The literal-prefix
// filter avoids SQL LIKE's wildcard underscore ambiguity.
export const INVENTORY_SELECT=
  "SELECT type,name,tbl_name FROM sqlite_schema WHERE substr(name,1,7) <> 'sqlite_' ORDER BY type,name,tbl_name";
export const VERSION_SELECT=
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key = 'schema_version' ORDER BY schema_value LIMIT 2";
const TABLE=/^CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(s2_[a-z0-9_]+)\s*\(/i;
const INDEX=/^CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\s+([a-z0-9_]+)\s+ON\s+(s2_[a-z0-9_]+)\s*\(/i;
const order=(a,b)=>a.type.localeCompare(b.type,"en")||a.name.localeCompare(b.name,"en")||
 a.tbl_name.localeCompare(b.tbl_name,"en");
function fail(x){throw Error(x);}
function canonicalObjects({files,sourceProvisioner,destinationReceipt}){
 const plan=planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt});
 if(plan.state!=="SOURCE_SQL_PAYLOAD_OFFLINE_SEALED_NOT_AUTHORIZED"||
    plan.plannedStatements!==125||plan.planSequenceSha256!==SCHEMA_PLAN_SHA||
    plan.createTables!==55||plan.createIndexes!==63||
    plan.schemaMetaUpserts!==7||plan.stagedMigrationsExcluded!==1)
  fail("ISSUE1103_CANONICAL_SQL_PLAN_CHANGED");
 const objects=[];
 for(const s of plan.sqlStatements){
  if(s.type==="CREATE_S2_TABLE"){
    const m=s.sql.match(TABLE);
    if(!m)fail("ISSUE1103_TABLE_SQL_SHAPE_INVALID");
    objects.push({type:"table",name:m[1],tbl_name:m[1]});
  }else if(s.type==="CREATE_S2_INDEX"){
    const m=s.sql.match(INDEX);
    if(!m)fail("ISSUE1103_INDEX_SQL_SHAPE_INVALID");
    objects.push({type:"index",name:m[1],tbl_name:m[2]});
  }else if(s.type!=="SCHEMA_META_VERSION_UPSERT")fail("ISSUE1103_UNKNOWN_SQL_KIND");
 }
 if(objects.length!==118||objects.filter(x=>x.type==="table").length!==55||
    objects.filter(x=>x.type==="index").length!==63||
    new Set(objects.map(x=>x.name)).size!==118)
  fail("ISSUE1103_CANONICAL_DUPLICATE_OR_COUNT");
 return {plan,objects:objects.sort(order)};
}
async function api(fetchImpl,url,token,method="GET",sql){
 const opts={method,headers:{authorization:"Bearer "+token,accept:"application/json",
   ...(method==="POST"?{"content-type":"application/json"}:{})},
   ...(sql?{body:JSON.stringify({sql})}:{}),
   signal:AbortSignal.timeout(25000)};
 let r;
 try{r=await fetchImpl(url,opts)}catch{fail("ISSUE1103_READ_TRANSPORT_FAILED_NO_RETRY");}
 if(!r?.ok)fail("ISSUE1103_READ_HTTP_FAILED_NO_RETRY");
 let json;
 try{json=await r.json();}catch{fail("ISSUE1103_READ_JSON_INVALID");}
 if(json?.success!==true||
    (json.errors!==undefined&&(!Array.isArray(json.errors)||json.errors.length!==0)))
  fail("ISSUE1103_READ_ENVELOPE_NOT_SUCCESS");
 return json;
}
function sqlRows(x){
 if(!Array.isArray(x.result)||x.result.length!==1||
    x.result[0]===null||typeof x.result[0]!=="object"||Array.isArray(x.result[0])||
    x.result[0].success!==true||!Array.isArray(x.result[0].results)||
    (x.result[0].errors!==undefined&&
      (!Array.isArray(x.result[0].errors)||x.result[0].errors.length!==0)))
   fail("ISSUE1103_SQL_INNER_RESULT_NOT_STRICT_TRUE");
 return x.result[0].results;
}
function checkedRows(rows){
 if(!Array.isArray(rows)||rows.length>256)fail("ISSUE1103_UNTRUSTED_OBJECT_ROW_COUNT");
 const seen=new Set(),out=[];
 for(const r of rows){
  if(r===null||typeof r!=="object"||Array.isArray(r)||
     typeof r.type!=="string"||typeof r.name!=="string"||typeof r.tbl_name!=="string"||
     !["table","index","view","trigger"].includes(r.type)||
     !/^[A-Za-z_][A-Za-z0-9_]*$/.test(r.name)||
     !/^[A-Za-z_][A-Za-z0-9_]*$/.test(r.tbl_name)||
     r.name.startsWith("sqlite_"))fail("ISSUE1103_SCHEMA_OBJECT_ROW_INVALID");
  // An SQLite schema object name should be globally unique (across types).
  if(seen.has(r.name))fail("ISSUE1103_SCHEMA_DUPLICATE_OBJECT_NAME");
  seen.add(r.name);
  out.push({type:r.type,name:r.name,tbl_name:r.tbl_name});
 }
 return out.sort(order);
}
function checkAgainstCanonical(objects,expected){
 const reserved=objects.filter(x=>x.type==="table"&&x.name==="_cf_KV"&&x.tbl_name==="_cf_KV");
 if(reserved.length!==1)fail("ISSUE1103_PLATFORM_RESERVED_TABLE_MISMATCH");
 // Every extra, unprefixed, unknown, view, trigger, swapped table name or
 // same-count differently named object is rejected — no partial pass.
 const app=objects.filter(x=>x.name!=="_cf_KV");
 if(app.length!==118||objects.length!==119||
    app.filter(x=>x.type==="table").length!==55||
    app.filter(x=>x.type==="index").length!==63||
    app.some((x,i)=>x.type!==expected[i]?.type||
       x.name!==expected[i]?.name||x.tbl_name!==expected[i]?.tbl_name))
  fail("ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
 return app;
}
async function verify(input={},identity){
 const {accountId,apiToken,fetchImpl=globalThis.fetch,confirm,files,sourceProvisioner,destinationReceipt}=input;
 if(confirm!==FULL_OBJECT_CONFIRM)fail("ISSUE1103_MANUAL_READONLY_CONFIRM_REQUIRED");
 if(!/^[a-f0-9]{32}$/i.test(accountId||"")||
    typeof apiToken!=="string"||apiToken.length<20||typeof fetchImpl!=="function")
   fail("ISSUE1103_AUTH_INPUT_INVALID");
 if(SHA(accountId)!==identity.dest||SHA(accountId)===identity.source)
   fail("ISSUE1103_DEST_ACCOUNT_IDENTITY_MISMATCH");
 const canonical=canonicalObjects({files,sourceProvisioner,destinationReceipt});
 const root="https://api.cloudflare.com/client/v4/accounts/"+accountId;
 const dbs=await api(fetchImpl,root+"/d1/database?page=1&per_page=100",apiToken);
 if(!Array.isArray(dbs.result)||dbs.result.length!==1||
    dbs.result_info?.total_count!==1||dbs.result_info?.page!==1)
  fail("ISSUE1103_SINGLE_DEST_DATABASE_NOT_VERIFIED");
 const db=dbs.result[0],id=db?.uuid||db?.id;
 if(db?.name!==DB_NAME||typeof id!=="string"||SHA(id)!==identity.db)
  fail("ISSUE1103_DEST_DATABASE_IDENTITY_MISMATCH");
 const base=root+"/d1/database/"+encodeURIComponent(id);
 const info=await api(fetchImpl,base,apiToken);
 if(info.result?.name!==DB_NAME||
    !Number.isSafeInteger(info.result?.file_size)||info.result.file_size<0||
    info.result.file_size>5*1024*1024*1024)
   fail("ISSUE1103_DEST_METADATA_INVALID");
 const raw=sqlRows(await api(fetchImpl,base+"/query",apiToken,"POST",INVENTORY_SELECT));
 const objs=checkedRows(raw);
 const app=checkAgainstCanonical(objs,canonical.objects);
 const versions=sqlRows(await api(fetchImpl,base+"/query",apiToken,"POST",VERSION_SELECT));
 if(versions.length!==1||versions[0]===null||typeof versions[0]!=="object"||
    Array.isArray(versions[0])||versions[0].schema_value!=="1.1")
   fail("ISSUE1103_SCHEMA_VERSION_NOT_VERIFIED");
 const appSha=digest(JSON.stringify(app)),expectedSha=digest(JSON.stringify(canonical.objects));
 if(appSha!==expectedSha)fail("ISSUE1103_SCHEMA_CANONICAL_DIGEST_MISMATCH");
 return Object.freeze({
  version:FULL_OBJECT_VERSION,status:"DESTINATION_SCHEMA_EXACT_FULL_OBJECT_SET_READONLY_PASS",
  targetDatabase:DB_NAME,targetIdentityMatched:true,
  planSequenceSha256:canonical.plan.planSequenceSha256,
  canonicalObjectDigestSha256:expectedSha,physicalObjectDigestSha256:appSha,
  canonicalAndPhysicalNamesExactMatch:true,
  canonicalObjects:canonical.objects,physicalObjects:app,
  platformReservedObjects:objs.filter(x=>x.name==="_cf_KV"),
  rawObjectCount:objs.length,tableCount:55,indexCount:63,schemaVersion:"1.1",
  cloudApiCalls:{metadataGets:2,selectOnlyPostQueries:2,sqlDdlStatements:0,sqlDmlStatements:0},
  sourceAccountRequests:0,cloudWritesPerformed:0,workersOrCronsChanged:false,
  sourceRowsCopied:0,paidUpgrade:false,shadowOrMigrationAccepted:false
 });
}
export function verifyInstalledDestinationSchemaFullReadonly1103(input){
 return verify(input,{dest:DEST_ACCOUNT_HASH,source:SOURCE_ACCOUNT_HASH,db:DEST_DB_HASH});
}
export function __testOnlySyntheticFullSchema1103(input,identity){
 if(typeof input?.apiToken!=="string"||!input.apiToken.startsWith("SYNTHETIC_TEST_TOKEN_")||
    typeof input.fetchImpl!=="function"||
    ![identity?.dest,identity?.source,identity?.db].every(x=>/^[a-f0-9]{64}$/.test(x||"")))
  fail("ISSUE1103_SYNTHETIC_TEST_ONLY");
 return verify(input,identity);
}
