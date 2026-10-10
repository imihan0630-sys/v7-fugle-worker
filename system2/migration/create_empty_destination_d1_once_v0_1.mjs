// NEVER execute from a CI test with real credentials.
// Owner-gated CREATE-ONLY draft: exactly one destination D1 metadata POST, zero SQL, R2 or Worker.
export const S2_EMPTY_D1_TARGET_NAME="system2-research";
export const S2_EMPTY_D1_CONFIRM="CREATE_ONE_EMPTY_DESTINATION_D1";
export const S2_FREE_ACK="FREE_TIER_NO_BILLING_CHANGE_ACKNOWLEDGED";
const HEX32=/^[0-9a-f]{32}$/i;
const UUID=/^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const API="https://api.cloudflare.com/client/v4";
function assertArgs(a){
  if(a?.confirm!==S2_EMPTY_D1_CONFIRM||a?.freeAck!==S2_FREE_ACK)
    throw Error("DESTINATION_D1_CREATION_OWNER_GATE_MISSING");
  if(!HEX32.test(a.destinationAccountId||"")||!HEX32.test(a.sourceAccountId||"")||
     a.destinationAccountId.toLowerCase()===a.sourceAccountId.toLowerCase())
    throw Error("DESTINATION_ACCOUNT_IDENTITY_MISMATCH_OR_SOURCE_COLLISION");
  if(typeof a.apiToken!=="string"||a.apiToken.length<20)
    throw Error("DESTINATION_WRITE_TOKEN_REQUIRED");
  if(typeof a.fetchImpl!=="function")throw Error("FETCH_INJECTION_REQUIRED");
}
function requestOptions(token,method="GET",body){
  return {
    method,
    headers:{authorization:"Bearer "+token,accept:"application/json","content-type":"application/json"},
    ...(body===undefined?{}:{body:JSON.stringify(body)}),
  };
}
async function getResult(fetchImpl,url,token){
  const response=await fetchImpl(url,requestOptions(token));
  if(!response || typeof response.json!=="function" || !response.ok)throw Error("DESTINATION_READ_HTTP_UNVERIFIED");
  let data;
  try{data=await response.json();}catch{throw Error("DESTINATION_READ_BAD_JSON");}
  if(data?.success!==true)throw Error("DESTINATION_READ_NOT_ACCEPTED");
  return data;
}
function validatedEmptyPage(data){
  const items=data?.result;
  const info=data?.result_info;
  // A missing total_count or a truncated page is NOT evidence the target is empty.
  return Array.isArray(items)&&items.length===0&&info?.total_count===0&&
    Number.isSafeInteger(info?.total_pages)&&info.total_pages<=1;
}
function oneCreatedItem(data,expectedId){
  const items=data?.result;
  const info=data?.result_info;
  if(!Array.isArray(items)||items.length!==1||info?.total_count!==1||
     info?.total_pages!==1)return false;
  return items[0]?.name===S2_EMPTY_D1_TARGET_NAME&&
    (items[0]?.uuid||items[0]?.id)===expectedId;
}
export async function createOneEmptyDestinationD1V0_1(a={}){
  assertArgs(a);
  const dest=a.destinationAccountId;
  const url=API+"/accounts/"+dest+"/d1/database";
  const verify=await getResult(a.fetchImpl,API+"/accounts/"+dest+"/tokens/verify",a.apiToken);
  if(verify.success!==true)throw Error("DESTINATION_TOKEN_NOT_VERIFIED");
  const before=await getResult(a.fetchImpl,url+"?page=1&per_page=100",a.apiToken);
  if(!validatedEmptyPage(before))throw Error("DESTINATION_DATABASE_SCOPE_NOT_EMPTY_OR_PAGINATION_UNVERIFIED");
  // SINGLE irreversible POST. No retry on ambiguous status and no schema/query requests.
  let postResponse;
  try{postResponse=await a.fetchImpl(url,requestOptions(a.apiToken,"POST",{name:S2_EMPTY_D1_TARGET_NAME}));}
  catch {throw Error("D1_CREATE_OUTCOME_UNKNOWN_MANUAL_READBACK_NO_RETRY");}
  if(!postResponse?.ok)throw Error("D1_CREATE_OUTCOME_UNKNOWN_MANUAL_READBACK_NO_RETRY");
  let created;
  try{created=await postResponse.json();}catch{throw Error("D1_CREATE_OUTCOME_UNKNOWN_MANUAL_READBACK_NO_RETRY");}
  const newDbId=created?.result?.uuid||created?.result?.id;
  if(created?.success!==true||created?.result?.name!==S2_EMPTY_D1_TARGET_NAME||!UUID.test(newDbId||""))
    throw Error("D1_CREATE_OUTCOME_UNKNOWN_MANUAL_READBACK_NO_RETRY");
  let after;
  try{after=await getResult(a.fetchImpl,url+"?page=1&per_page=100",a.apiToken);}
  catch{throw Error("D1_CREATE_READBACK_UNVERIFIED_MANUAL_REVIEW_NO_RETRY");}
  if(!oneCreatedItem(after,newDbId))
    throw Error("D1_CREATE_READBACK_UNVERIFIED_MANUAL_REVIEW_NO_RETRY");
  return Object.freeze({
    schemaVersion:"S2_DESTINATION_EMPTY_D1_CREATE_RECEIPT_V0_1",
    status:"ONE_EMPTY_D1_RESOURCE_CREATED_AND_LISTED",
    databaseCount:1,
    sourceDatabaseMutated:false,
    schemaSqlStatementsExecuted:0,
    databaseRowsCopied:0,
    r2Requests:0,
    kvRequests:0,
    workerRequests:0,
    cronUpdates:0,
    workerDeployed:false,
    historicFrozenSnapshotsCopied:0,
    physicalMigrationAccepted:false,
    independentAuditAccepted:false,
    warning:"D1 LIST only. No SQLite table/schema readback performed. Empty schema requires separate authorized GET SQL attestation.",
  });
}
