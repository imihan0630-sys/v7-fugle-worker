// New-account D1 schema readback with pre-existing DESTINATION D1 READ token.
// Deliberately a separate module with exactly ONE whitelisted SQL SELECT statement:
// no CREATE, INSERT, UPDATE, DELETE, DDL import, R2, KV, Workers or source account access.
import {createHash} from "node:crypto";
import {planDestinationSchemaOnlyOfflineV0_1} from "./destination_schema_only_offline_payload_v0_1.mjs";
const sha=x=>createHash("sha256").update(String(x).toLowerCase()).digest("hex");
export const DEST_SCHEMA_SQL_READONLY_CONFIRM="DEST_SCHEMA_EMPTY_SQL_READONLY_ONLY";
export const DEST_SCHEMA_SQL_READONLY_VERSION="S2_DEST_SCHEMA_SQL_READONLY_PREWRITE_V0_1";
const DEST_ACCOUNT_HASH="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const SOURCE_ACCOUNT_HASH="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const DEST_DB_HASH="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const D1_NAME="system2-research";
const SQL="SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name";
function fail(code){throw Error(code)}
async function safeFetch(fetchImpl,url,apiToken,method="GET",body){
 let response;
 try {response=await fetchImpl(url,{
   method,headers:{authorization:"Bearer "+apiToken,accept:"application/json",
     ...(method==="POST"?{"content-type":"application/json"}:{})},
   ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(25000)
 });}catch{fail("DESTINATION_D1_READ_TRANSPORT_UNKNOWN")}
 if(!response?.ok)fail("DESTINATION_D1_READ_HTTP_UNVERIFIED");
 let obj;try{obj=await response.json()}catch{fail("DESTINATION_D1_READ_RESPONSE_INVALID")}
 if(obj?.success!==true)fail("DESTINATION_D1_READ_RESPONSE_INVALID");
 return obj;
}
export async function probeDestinationEmptyD1SqlReadonlyV0_1({
 accountId,apiToken,fetchImpl=globalThis.fetch,confirm,files,sourceProvisioner,destinationReceipt,
 _syntheticIdentity=null,
}={}){
 if(confirm!==DEST_SCHEMA_SQL_READONLY_CONFIRM)fail("OWNER_READ_ONLY_CONFIRM_REQUIRED");
 if(!/^[a-f0-9]{32}$/i.test(accountId||"")||
   typeof apiToken!=="string"||apiToken.length<20||
   typeof fetchImpl!=="function")fail("DESTINATION_READ_INPUT_INVALID");
 // The test-only seam never receives a live Cloudflare token.
 const identity=_syntheticIdentity&&apiToken.startsWith("SYNTHETIC_TEST_TOKEN_")?
     _syntheticIdentity:{dest:DEST_ACCOUNT_HASH,source:SOURCE_ACCOUNT_HASH,db:DEST_DB_HASH};
 if(sha(accountId)!==identity.dest||sha(accountId)===identity.source)
   fail("DESTINATION_ACCOUNT_ID_FINGERPRINT_MISMATCH");
 const plan=planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt});
 if(plan.state!=="SOURCE_SQL_PAYLOAD_OFFLINE_SEALED_NOT_AUTHORIZED"||plan.plannedStatements!==125)
   fail("SCHEMA_PREFIX_OFFLINE_PLAN_INVALID");
 const base="https://api.cloudflare.com/client/v4/accounts/"+accountId;
 const list=await safeFetch(fetchImpl,base+"/d1/database?page=1&per_page=100",apiToken);
 if(!Array.isArray(list.result)||list.result.length!==1||
    list.result_info?.total_count!==1||list.result_info?.page!==1)
   fail("DESTINATION_DATABASE_NOT_SINGLETON");
 const db=list.result[0];
 const uuid=db?.uuid||db?.id;
 if(db?.name!==D1_NAME||typeof uuid!=="string"||sha(uuid)!==identity.db)
   fail("DESTINATION_DATABASE_IDENTITY_MISMATCH");
 const metadata=await safeFetch(fetchImpl,base+"/d1/database/"+encodeURIComponent(uuid),apiToken);
 if(metadata.result?.name!==D1_NAME||
    !Number.isSafeInteger(metadata.result?.file_size)||
    metadata.result.file_size<0||metadata.result.file_size>32768)
   fail("DESTINATION_DATABASE_SIZE_OR_ID_CHANGED");
 const raw=await safeFetch(fetchImpl,base+"/d1/database/"+encodeURIComponent(uuid)+"/query",
   apiToken,"POST",{sql:SQL});
 if(!Array.isArray(raw.result)||raw.result.length!==1||raw.result[0]?.success!==true||
    !Array.isArray(raw.result[0].results))
   fail("DESTINATION_SQL_QUERY_RECEIPT_INVALID");
 const schemaRows=raw.result[0].results;
 if(schemaRows.some(row=>typeof row?.type!=="string"||typeof row?.name!=="string"))
   fail("DESTINATION_SCHEMA_SQL_ROW_INVALID");
 // Cloudflare D1 itself creates exactly one reserved storage table (_cf_KV),
 // which Cloudflare does not count as an application table. Never wildcard-ignore
 // _cf_* or any unexpected object: only the exact (table, _cf_KV) pair is exempt.
 const reserved=schemaRows.filter(row=>row.type==="table"&&row.name==="_cf_KV");
 if(reserved.length>1)fail("DESTINATION_RESERVED_D1_TABLE_DUPLICATED");
 const userSchemaRows=schemaRows.filter(row=>!(row.type==="table"&&row.name==="_cf_KV"));
 const empty=userSchemaRows.length===0;
 return Object.freeze({
   version:DEST_SCHEMA_SQL_READONLY_VERSION,
   result:empty?"DESTINATION_D1_PHYSICAL_EMPTY_SQL_VERIFIED":"DESTINATION_D1_NONEMPTY_BLOCK_SCHEMA_IMPORT",
   cloudApiCalls:{metadataGets:2,readOnlySqlPostQueries:1,sqlDdlStatements:0},
   authenticatedDestAccountMatched:true,authenticatedDestDbMatched:true,
   targetDatabase:D1_NAME,targetFileSizeBytes:metadata.result.file_size,
   objectsFound:userSchemaRows.length,tableCount:userSchemaRows.filter(x=>x.type==="table").length,
   indexCount:userSchemaRows.filter(x=>x.type==="index").length,
   cloudflareReservedTablesFound:reserved.length,rawSchemaObjectsFound:schemaRows.length,
   unexpectedSchemaObjectTypes:userSchemaRows.filter(x=>!["table","index"].includes(x.type)).length,
   planSequenceSha256:plan.planSequenceSha256,
   ownerSchemaWriteAuthorizationPending:!empty,
   sqlStatementExecuted:"SELECT_ONLY_SQLITE_SCHEMA",
   preExistingDestinationReadTokenUsed:true,
   noNewWriteTokenRequiredForThisPreflight:true,
   destinationSchemaApplied:false,anySqlWritesPerformed:false,
   sourceCloudAccountTouched:false,sourceRowsCopied:0,
   workersOrCronsChanged:false,r2Touched:false,paidUpgrade:false,
   migrationAndShadowAccepted:false,
 });
}
