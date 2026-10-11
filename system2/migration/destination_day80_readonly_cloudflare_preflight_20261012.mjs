// ONE-SHOT owner requested D1 migration verification. Pure Cloudflare GET / SQL SELECT / GraphQL.
// NO data import. Account use from GraphQL is a lag-UNKNOWN lower bound, never spendable headroom.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
const h=x=>createHash("sha256").update(String(x).toLowerCase()).digest("hex");
const accountSha="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const dbSha="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const tableNames=["s2_historical_a1_bars","s2_historical_a1_pack_manifests",
"s2_historical_a1_segment_manifests","s2_historical_a1_packs","s2_infrastructure_checks",
"s2_historical_ingest_batches","s2_historical_cold_backfill_checkpoints",
"s2_historical_cold_ingest_receipts","s2_historical_pack_ingest_receipts",
"s2_historical_segment_backfill_checkpoints","s2_historical_segment_ingest_receipts",
"s2_resonance_runs","s2_source_session_receipts","s2_schema_meta"];
const noMutate={cloudWrites:0,importRows:0,sourceD1Calls:0,permissionToImport:false,
  analyticsLagBounded:false,physicalAuditAcceptedByThisJob:false,paidUpgrade:false};
function stop(code){throw Error("DAY80_DEST_READONLY_"+code)}
export async function destinationDay80ReadOnly({accountId,token,request=globalThis.fetch,now=()=>new Date().toISOString()}={}){
 if(!/^[0-9a-f]{32}$/i.test(accountId||"")||h(accountId)!==accountSha||!token)stop("ACCOUNT_OR_AUTH_UNVERIFIED");
 const quotaDay=now().slice(0,10);if(!/^20\d\d-\d\d-\d\d$/.test(quotaDay))stop("UTC_DAY_INVALID");
 const root="https://api.cloudflare.com/client/v4/accounts/"+accountId;
 let calls=0;async function get(path){calls++;let p=await request(root+path,{method:"GET",headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(20000)});let j=await p.json().catch(()=>null);if(!p.ok||j?.success!==true)stop("API_GET_FAILED");return j.result}
 const dbs=await get("/d1/database?per_page=100");
 if(!Array.isArray(dbs)||dbs.length!==1||dbs[0].name!=="system2-research"||
   h(dbs[0].uuid||dbs[0].id)!==dbSha)stop("DB_ID_OR_ACCOUNT_ISOLATION_DRIFT");
 const id=dbs[0].uuid||dbs[0].id;
 const detail=await get("/d1/database/"+id);const size=detail?.file_size??detail?.fileSize??null;
 if(size!==null&&(!Number.isSafeInteger(size)||size<0))stop("STORAGE_SIZE_INVALID");
 async function select(sql){if(!/^SELECT\b/i.test(sql)||/[;\n]/.test(sql))stop("SQL_NOT_READONLY_SELECT");
 calls++;const p=await request(root+"/d1/database/"+id+"/query",{method:"POST",
   headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
   body:JSON.stringify({sql}),signal:AbortSignal.timeout(30000)});
 const j=await p.json().catch(()=>null);if(!p.ok||j?.success!==true||
   !Array.isArray(j.result)||j.result.length!==1||j.result[0].success!==true||!Array.isArray(j.result[0].results))stop("D1_READ_ONLY_QUERY_FAILED");
 return j.result[0].results}
 const shape=await select("SELECT type, COUNT(*) AS n FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' GROUP BY type");
 const objects=Object.fromEntries(shape.map(x=>[x.type,x.n]));
 if(objects.table!==56||objects.index!==63||Object.entries(objects).some(([k])=>!["table","index"].includes(k)))stop("DESTINATION_OBJECTS_NOT_55_PLUS_CF_KV_AND_63");
 const rowCounts={};for(const table of tableNames){const z=await select('SELECT COUNT(*) AS n FROM "'+table+'"');
 if(z.length!==1||!Number.isSafeInteger(z[0].n)||z[0].n<0)stop("TARGET_COUNT_INVALID");
 rowCounts[table]=z[0].n;}
 // The target cannot be called empty if any historical row already exists. Preserve any partial state.
 const existingDataRows=Object.entries(rowCounts).reduce((s,[k,v])=>s+(k==="s2_schema_meta"?0:v),0);
 const q=`query($accountTag:String!,$start:Date!,$end:Date!){viewer{accounts(filter:{accountTag:$accountTag}){d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$start,date_leq:$end},orderBy:[date_ASC]){sum{rowsRead rowsWritten readQueries writeQueries}dimensions{date databaseId}}}}}`;
 async function sample(){calls++;const p=await request("https://api.cloudflare.com/client/v4/graphql",{method:"POST",
   headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
   body:JSON.stringify({query:q,variables:{accountTag:accountId,start:quotaDay,end:quotaDay}}),
   signal:AbortSignal.timeout(20000)});
 const j=await p.json().catch(()=>null);
 if(!p.ok||j?.errors?.length)stop("GRAPHQL_ACCOUNT_USAGE_NOT_AUTHENTICATED");
 const a=j?.data?.viewer?.accounts;if(!Array.isArray(a)||a.length!==1)stop("GRAPHQL_ACCOUNT_MISSING");
 const groups=a[0]?.d1AnalyticsAdaptiveGroups;
 if(!Array.isArray(groups)||groups.length!==1)stop("GRAPHQL_GROUPS_NOT_COMPLETE_ONE_DB");
 const g=groups[0];if(g.dimensions?.date!==quotaDay||h(g.dimensions?.databaseId)!==dbSha||
  ![g.sum?.rowsRead,g.sum?.rowsWritten,g.sum?.readQueries,g.sum?.writeQueries].every(x=>Number.isSafeInteger(x)&&x>=0))stop("GRAPHQL_COVERAGE_OR_VALUE_INVALID");
 return {observedAtUtc:now(),rowsReadLowerBound:g.sum.rowsRead,rowsWrittenLowerBound:g.sum.rowsWritten,readQueriesLowerBound:g.sum.readQueries,writeQueriesLowerBound:g.sum.writeQueries}}
 const first=await sample(),last=await sample();
 if(first.rowsWrittenLowerBound>last.rowsWrittenLowerBound||first.rowsReadLowerBound>last.rowsReadLowerBound)stop("GRAPHQL_NONMONOTONE");
 return Object.freeze({schemaVersion:"S2_DESTINATION_DAY80_REAL_CLOUDFLARE_READONLY_PREFLIGHT_20261012_V0_1",
  originalSourceRows:113222,requestedLogicalRows80Pct:90578,targetBilledRowsWrittenCap:80000,
  originalFullBackupRun:38150147134,transferVerifiedRun:38151167952,
  quotaUtcDay:quotaDay,observedAtUtc:now(),destinationDatabaseName:"system2-research",
  databaseBytes:size,freeSingleDatabaseBytes:500000000,physicalObjectCounts:objects,original14TablesDestinationCounts:rowCounts,
  destinationAlreadyImportedRowsIn14OriginalTables:existingDataRows,usageObservations:[first,last],
  accountRowsWrittenLowerBound:last.rowsWrittenLowerBound,accountRowsWrittenSpendableHeadroom:null,
  providerAnalyticsLagUpperBoundSeconds:null,providerGuaranteedFreshUsage:false,
  quotaReleaseState:"BLOCKED_UNBOUNDED_GRAPHQL_LAG_AND_INDEPENDENT_AUDIT",
  callsCompleted:calls,...noMutate});
}
if(process.argv[1]?.endsWith("/destination_day80_readonly_cloudflare_preflight_20261012.mjs")){
 try{const v=await destinationDay80ReadOnly({accountId:process.env.S2_SCHEMA_DEST_ACCOUNT_ID,
  token:process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN});
  const out="/tmp/s2-day80-destination-readonly";await mkdir(out,{recursive:true,mode:0o700});
  await writeFile(out+"/receipt.json",JSON.stringify(v,null,2)+"\n",{flag:"wx",mode:0o600});
  console.log(JSON.stringify({result:"REAL_DESTINATION_QUOTA_USAGE_OBSERVED_NO_WRITE_AUTHORITY",
   quotaUtcDay:v.quotaUtcDay,existingDataRows:v.destinationAlreadyImportedRowsIn14OriginalTables,
   billedWrittenLowerBound:v.accountRowsWrittenLowerBound,spendableHeadroom:"UNKNOWN",
   archiveSourceRows:v.originalSourceRows,cloudWrites:v.cloudWrites,importRows:0}));
 }catch(e){const code=String(e?.message||"UNKNOWN");
  console.error(/^DAY80_DEST_READONLY_[A-Z0-9_]+$/.test(code)?code:"DAY80_DEST_READONLY_UNCLASSIFIED_DEFER");
  process.exitCode=2}
}
