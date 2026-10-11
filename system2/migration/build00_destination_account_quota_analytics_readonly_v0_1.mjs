// BUILD00 / #1128 G4. Account-level Cloudflare D1 quota evidence in DEST only.
// GET D1 identity + GraphQL read; no D1 SQL or changes to SOURCE, target, Worker or Cron.
// This is an observed LOWER BOUND, NEVER "remaining spendable writes" authorization.
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const sha=x=>createHash('sha256').update(String(x).toLowerCase()).digest('hex');
const ACCOUNT_SHA='27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55';
const DB_SHA='95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9';
const DB='system2-research';
const CAP_READ=5_000_000,CAP_WRITE=100_000,DAY80=80_000;
const nonneg=n=>Number.isSafeInteger(n)&&n>=0;
const error=k=>new Error('S2_DEST_ACCOUNT_QUOTA_'+k);
function graphqlRows(j,day,expectedDb){
 if(!Array.isArray(j?.data?.viewer?.accounts)||j.data.viewer.accounts.length!==1)
  throw error('GRAPHQL_DESTINATION_ACCOUNT_COVERAGE_MISSING');
 const a=j.data.viewer.accounts[0];
 if(!Array.isArray(a?.d1AnalyticsAdaptiveGroups)||
    a.d1AnalyticsAdaptiveGroups.length!==1)
  throw error('GRAPHQL_ACCOUNT_DATABASE_DAY_UNIVERSE_UNVERIFIED');
 const entry=a.d1AnalyticsAdaptiveGroups[0];
 if(entry?.dimensions?.date!==day||sha(entry?.dimensions?.databaseId)!==sha(expectedDb))
  throw error('GRAPHQL_WRONG_DATABASE_OR_UTC_DAY');
 const sum=entry.sum;
 if(![sum?.rowsRead,sum?.rowsWritten,sum?.readQueries,sum?.writeQueries].every(nonneg))
  throw error('GRAPHQL_USAGE_VALUES_INVALID');
 return {rowsReadLowerBound:sum.rowsRead,rowsWrittenLowerBound:sum.rowsWritten,
  readQueriesLowerBound:sum.readQueries,writeQueriesLowerBound:sum.writeQueries};
}
function safeFetchError(response,body){
 if(response?.status===401||response?.status===403||
    body?.errors?.some(x=>/authorization|permission|access denied|not authorized|forbidden/i.test(x?.message||'')))
  return error('ACCOUNT_ANALYTICS_READ_NOT_AUTHORIZED');
 return error('GRAPHQL_PROVIDER_FAILED_OR_UNVERIFIED');
}
export async function readDestinationD1AccountQuotaV0_1({
 accountId,metadataToken,analyticsToken,fetchImpl=globalThis.fetch,
 now=()=>new Date().toISOString(),
}={}){
 if(!/^[0-9a-f]{32}$/i.test(accountId||'')||sha(accountId)!==ACCOUNT_SHA)
   throw error('ACCOUNT_IDENTITY_MISMATCH');
 if(!metadataToken||!analyticsToken||typeof fetchImpl!=='function')
   throw error('DEST_D1_AND_ACCOUNT_ANALYTICS_TOKEN_REQUIRED');
 const firstAt=now(),day=firstAt.slice(0,10);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(Date.parse(firstAt)))
   throw error('UTC_DAY_UNVERIFIED');
 const base='https://api.cloudflare.com/client/v4';
 let requests=0;
 async function fetchJson(url,token,body){
  if(++requests>4)throw error('OVER_BOUNDED_READONLY_NETWORK');
  const response=await fetchImpl(url,{
    method:body?'POST':'GET',
    headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20_000),
  });
  const value=await response?.json().catch(()=>null);
  if(!response?.ok||!value||(body&&Array.isArray(value?.errors)&&value.errors.length))
   throw body?safeFetchError(response,value):error('DEST_D1_RESOURCE_METADATA_READ_FAILED');
  return value;
 }
 const d1=await fetchJson(base+'/accounts/'+accountId+'/d1/database?per_page=100',metadataToken);
 if(d1?.success!==true||!Array.isArray(d1.result)||d1.result.length!==1||
    d1.result[0]?.name!==DB)throw error('DEST_DATABASE_UNIVERSE_UNVERIFIED');
 const id=d1.result[0]?.uuid||d1.result[0]?.id;
 if(sha(id)!==DB_SHA)throw error('DESTINATION_DB_IDENTITY_MISMATCH');
 const query='query($accountTag:String!,$start:Date!,$end:Date!){viewer{accounts(filter:{accountTag:$accountTag}){d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$start,date_leq:$end},orderBy:[date_ASC]){sum{rowsRead rowsWritten readQueries writeQueries}dimensions{date databaseId}}}}}';
 const reads=[];
 for(let i=0;i<2;i++){
  const json=await fetchJson(base+'/graphql',analyticsToken,{
   query,variables:{accountTag:accountId,start:day,end:day}
  });
  reads.push({...graphqlRows(json,day,id),observedAtUtc:now()});
 }
 if(reads[1].rowsWrittenLowerBound<reads[0].rowsWrittenLowerBound||
    reads[1].rowsReadLowerBound<reads[0].rowsReadLowerBound||
    reads[1].readQueriesLowerBound<reads[0].readQueriesLowerBound||
    reads[1].writeQueriesLowerBound<reads[0].writeQueriesLowerBound)
  throw error('GRAPHQL_NONMONOTONIC_USAGE');
 if(reads.some(x=>x.observedAtUtc.slice(0,10)!==day))
  throw error('UTC_QUOTA_DAY_ROLLOVER_DURING_READ');
 const last=reads[1];
 // This is an arithmetic *upper bound* on possible remaining quota, because
 // provider GraphQL may lag physical D1 consumption.
 const maxPossibleRemainingWrites=Math.max(0,CAP_WRITE-last.rowsWrittenLowerBound);
 const maxPossibleRemainingReads=Math.max(0,CAP_READ-last.rowsReadLowerBound);
 return Object.freeze({
  schemaVersion:'S2_BUILD00_DEST_ACCOUNT_GRAPHQL_QUOTA_REAL_READ_V0_1',
  destinationAccountFingerprint:ACCOUNT_SHA,databaseFingerprint:DB_SHA,
  databaseName:DB,observedAtUtc:now(),quotaDayUtc:day,
  actualCloudflareProviderRead:true,authenticatedAccountAnalytics:true,
  originalUsageSamples:reads,accountReadLimit:CAP_READ,accountWriteLimit:CAP_WRITE,
  readObservedLowerBound:last.rowsReadLowerBound,
  writeObservedLowerBound:last.rowsWrittenLowerBound,
  optimisticUnverifiedRemainingReadUpperBound:maxPossibleRemainingReads,
  optimisticUnverifiedRemainingWriteUpperBound:maxPossibleRemainingWrites,
  requestedDailyMigrationWriteCeiling:DAY80,
  theoreticalDay80RemainingUpperBound:Math.min(DAY80,maxPossibleRemainingWrites),
  // Hard safety: successful GraphQL does not certify real-time analytics,
  // appends, outstanding writer reservations or other Cloudflare worker costs.
  providerAnalyticsFreshnessUpperBoundSeconds:null,
  realTimeSpendableAccountRowsRead:null,
  realTimeSpendableAccountRowsWritten:null,
  otherAccountWritersQuietIndependentlyProven:false,
  sameDayIndexAndRetryBilledRowsMeasured:false,
  sourceEncryptedBackupPITIndependentAuditPassed:false,
  D1CopyAuthorizedByThisReceipt:false,allowPaidUpgrade:false,
  CloudflareWrites:0, CloudflareD1SqlQueries:0,sourceAccountTouched:false,
  system1FormalCoreTouched:false,destinationWorkerOrCronActivated:false,
  state:'PHYSICAL_GRAPHQL_ACCOUNT_USAGE_OBSERVED_NOT_SPENDABLE_QUOTA_GRANT',
  missingForImport:[
   'BOUND_ANALYTICS_FRESHNESS_OR_EQUIVALENT_ACCOUNT_WRITE_LEDGER',
   'INDEPENDENT_SOURCE_BACKUP_PIT_FROZEN_G3_ACCEPTANCE',
   'INDEXED_BATCH_MEASURED_BILLED_WRITES_AND_ONE_WRITER_SAFETY'
  ],
  requestsMade:requests
 });
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const r=await readDestinationD1AccountQuotaV0_1({
   accountId:process.env.S2_SCHEMA_DEST_ACCOUNT_ID,
   metadataToken:process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,
   analyticsToken:process.env.S2_DEST_ACCOUNT_ANALYTICS_READ_TOKEN,
  });
  const dir='/tmp/s2-build00-destination-graphql';
  await mkdir(dir,{recursive:true,mode:0o700});
  await writeFile(dir+'/sanitized-destination-quota-read.json',
    JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({status:r.state,quotaUtcDay:r.quotaDayUtc,
   observedRowsReadLowerBound:r.readObservedLowerBound,
   observedRowsWrittenLowerBound:r.writeObservedLowerBound,
   optimisticUnverifiedRemainingWriteUpperBound:r.optimisticUnverifiedRemainingWriteUpperBound,
   spendableHeadroom:'UNKNOWN',CloudflareWrites:0,canImport:false}));
 }catch(e){
  const m=String(e?.message||'');
  console.error(/^S2_DEST_ACCOUNT_QUOTA_[A-Z0-9_]+$/.test(m)?m:
    'S2_DEST_ACCOUNT_QUOTA_READ_FAILED_NO_GRANT');
  process.exitCode=2;
 }
}
