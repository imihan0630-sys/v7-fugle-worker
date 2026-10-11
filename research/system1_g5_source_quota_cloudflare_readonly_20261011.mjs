// System1 G5 SOURCE Cloudflare D1 observed account usage — read-only.
// This is an on-demand evidence collector, NOT a backup/import permit.
// Only Cloudflare GET and query-only GraphQL POST. No D1 SQL, Worker writes,
// Cron or route mutation, production deployment, or admin trading endpoint.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const SCHEDULES=["0-24 5 * * MON-FRI","* 1-4 * * MON-FRI","35,55 15 * * mon-fri","* 9 * * MON-FRI"].sort();
const safeInt=x=>typeof x==="number" && Number.isSafeInteger(x)&&x>=0;
const fail=code=>{throw Error("G5_SOURCE_OBSERVATION_"+code)};

export async function collectSourceG5QuotaV0_1({
  accountId,workerToken,d1Token,request=globalThis.fetch,
  observedAt=()=>new Date().toISOString(),
  pauseUtc="2026-10-11T13:12:27.999Z"
}={}){
  if(!/^[0-9a-f]{32}$/i.test(accountId||"")||
     !workerToken||!d1Token||typeof request!=="function")
    fail("CREDENTIALS_UNVERIFIED");
  const utcDay=observedAt().slice(0,10);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(utcDay))fail("CLOCK_INVALID");
  let cloudCalls=0;
  const root="https://api.cloudflare.com/client/v4/accounts/"+accountId;
  async function GET(path,token){
    cloudCalls++;
    const p=await request(root+path,{method:"GET",headers:{Authorization:"Bearer "+token},
      signal:AbortSignal.timeout(12000)});
    if(!p?.ok)fail("GET_HTTP_OR_AUTH");
    const a=await p.json().catch(()=>null);
    if(a?.success!==true)fail("GET_RESPONSE_MALFORMED");
    return a.result;
  }
  // Revalidate source only: never assume the Cron pause remains true
  // merely because a previous source-migration run passed.
  const [db,s2cron,v8cron,work]=await Promise.all([
    GET("/d1/database?per_page=100",d1Token),
    GET("/workers/scripts/system2-shadow-research/schedules",workerToken),
    GET("/workers/scripts/fugle-test/schedules",workerToken),
    GET("/workers/scripts?per_page=100",workerToken),
  ]);
  if(!Array.isArray(db)||!Array.isArray(work)||
      db.filter(d=>d.name==="v7-live").length!==1||
      db.filter(d=>d.name==="system2-research").length!==1||
      !work.some(w=>w.id==="fugle-test")||
      !work.some(w=>w.id==="system2-shadow-research"))fail("SOURCE_IDENTITY_DRIFT");
  const toSchedule=x=>Array.isArray(x)?x:Array.isArray(x?.schedules)?x.schedules:null;
  const sa=toSchedule(s2cron),va=toSchedule(v8cron);
  if(!Array.isArray(sa)||sa.some(x=>typeof x.cron!=="string")||
      !Array.isArray(va)||va.some(x=>typeof x.cron!=="string"))
    fail("SCHEDULE_METADATA_UNVERIFIED");
  const s2=sa.map(x=>x.cron).sort(),v8=va.map(x=>x.cron).sort();
  if(s2.length!==0)fail("OLD_SYSTEM2_CRON_REACTIVATED");
  if(JSON.stringify(v8)!==JSON.stringify(SCHEDULES))fail("V8_CRON_DRIFT");

  const id2name=new Map();
  for(const x of db){
    if(x.name!=="v7-live"&&x.name!=="system2-research")continue;
    const id=x.uuid||x.id;
    if(typeof id!=="string"||!id.trim()||id2name.has(id))fail("D1_ID_UNVERIFIED");
    id2name.set(id,x.name);
  }
  const query=`query($accountTag:String!,$start:Date!,$end:Date!){viewer{accounts(filter:{accountTag:$accountTag}){d1AnalyticsAdaptiveGroups(limit:10000,filter:{date_geq:$start,date_leq:$end},orderBy:[date_ASC]){sum{rowsRead rowsWritten readQueries writeQueries}dimensions{date databaseId}}}}}`;
  async function sample(){
    const t0=observedAt();
    cloudCalls++;
    const p=await request("https://api.cloudflare.com/client/v4/graphql",{
      method:"POST",
      headers:{Authorization:"Bearer "+workerToken,"Content-Type":"application/json"},
      body:JSON.stringify({query,variables:{accountTag:accountId,start:utcDay,end:utcDay}}),
      signal:AbortSignal.timeout(18000)
    });
    const j=await p.json().catch(()=>null);
    if(!p?.ok||j?.errors?.length)fail("GRAPHQL_READ_UNAVAILABLE");
    const accounts=j?.data?.viewer?.accounts;
    if(!Array.isArray(accounts)||accounts.length!==1)fail("ACCOUNT_CARDINALITY");
    const groups=accounts[0].d1AnalyticsAdaptiveGroups;
    if(!Array.isArray(groups)||groups.length!==2)fail("D1_GROUP_CARDINALITY_UNVERIFIED");
    const seen=new Set(),byDb={};let w=0,rr=0,readQueries=0,writeQueries=0;
    for(const e of groups){
      const name=id2name.get(e?.dimensions?.databaseId);
      if(!name||e.dimensions?.date!==utcDay||seen.has(name))fail("D1_GROUP_IDENTITY");
      seen.add(name);
      if(![e.sum?.rowsRead,e.sum?.rowsWritten,e.sum?.readQueries,e.sum?.writeQueries].every(safeInt))
        fail("D1_ANALYTICS_PARTIAL");
      const row={rowsRead:e.sum.rowsRead,rowsWritten:e.sum.rowsWritten,
        readQueries:e.sum.readQueries,writeQueries:e.sum.writeQueries};
      byDb[name]=row;
      w+=row.rowsWritten;rr+=row.rowsRead;
      readQueries+=row.readQueries;writeQueries+=row.writeQueries;
    }
    if(![w,rr,readQueries,writeQueries].every(safeInt))fail("ACCOUNT_AGGREGATE_OVERFLOW");
    return {observedAtUtc:observedAt(),requestStartedUtc:t0,quotaDayUtc:utcDay,
      byDb,account:{rowsReadLowerBound:rr,rowsWrittenLowerBound:w,
      readQueriesLowerBound:readQueries,writeQueriesLowerBound:writeQueries},
      completeness:"TWO_EXACT_SOURCE_DB_GROUPS",lagUpperBoundSeconds:null,
      freshnessGuarantee:"NOT_DOCUMENTED_BY_PROVIDER"};
  }
  const first=await sample(),second=await sample();
  const monotone=second.account.rowsReadLowerBound>=first.account.rowsReadLowerBound&&
    second.account.rowsWrittenLowerBound>=first.account.rowsWrittenLowerBound;
  if(!monotone)fail("GRAPHQL_REGRESSION_NOT_STABLE");
  const result={
    schemaVersion:"S1_G5_SOURCE_REAL_ACCOUNT_QUOTA_READONLY_V0_1",
    sourceKind:"PHYSICAL_CLOUDFLARE_GET_AND_QUERY_ONLY_GRAPHQL",
    observedAtUtc:observedAt(),quotaDayUtc:utcDay,
    accountFingerprint:hash(accountId),accountId:"REDACTED",
    sourceD1:{system1:"v7-live",system2:"system2-research"},
    sourceS2WorkerCronCount:s2.length,sourceS2CronReadback:"ZERO_AFTER_PAUSE",
    sourceS2PauseUtc:pauseUtc,
    v8WorkerCronCount:v8.length,v8CronFingerprint:hash(v8),
    cloudflareMethods:["GET","POST_GRAPHQL_QUERY_ONLY"],
    cloudflareGetCalls:4,cloudflareGraphQLCalls:2,observedCloudCalls:cloudCalls,
    d1SqlCalls:0,workerCronMutations:0,system1Mutations:0,
    samples:[first,second],analyticsMonotone:monotone,
    lagUpperBoundSeconds:null,lagAgeSeconds:null,
    remainingRowsReadVerified:null,remainingRowsWrittenVerified:null,
    system1PrimaryPerRunRowsRead:null,system1PrimaryPerRunRowsWritten:null,
    system1RecoveryPerRunRowsRead:null,system1RecoveryPerRunRowsWritten:null,
    system1WriteReserveAuthorized:false,system1WriteReserveRows:null,
    system1ReadReserveAuthorized:false,system1ReadReserveRows:null,
    sourceBackupSafeToStart:false,
    sourceBackupBudgetDefer:"READ_ONLY_D1_BUDGET_EVIDENCE_DEFER",
    independentAuditAcceptance:false,
    controlScope:"SOURCE_USAGE_OBSERVATION_ONLY",
    limits:"GraphQL UTC-day totals are LOWER BOUNDS, not spendable headroom or V8 single-run costs; no bounded provider analytics lag."
  };
  return Object.freeze(result);
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  try{
    const receipt=await collectSourceG5QuotaV0_1({
      accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
      workerToken:process.env.CLOUDFLARE_API_TOKEN||
        process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,
      d1Token:process.env.SYSTEM2_CLOUDFLARE_API_TOKEN
    });
    const path=resolve(process.env.G5_OUTPUT_PATH||
      "/tmp/s1-g5-source-quota/receipt.json");
    await mkdir(dirname(path),{recursive:true});
    await writeFile(path,JSON.stringify(receipt,null,2)+"\n",{flag:"wx",mode:0o600});
    console.log(JSON.stringify({
      result:"SOURCE_G5_ACCOUNT_USAGE_PHYSICALLY_OBSERVED_NOT_BUDGET_AUTHORIZED",
      quotaDayUtc:receipt.quotaDayUtc,observedAtUtc:receipt.observedAtUtc,
      sourceCronCount:receipt.sourceS2WorkerCronCount,
      v8CronCount:receipt.v8WorkerCronCount,
      readLowerBound:receipt.samples[1].account.rowsReadLowerBound,
      writtenLowerBound:receipt.samples[1].account.rowsWrittenLowerBound,
      analyticsLagBounded:false,
      readReserveAuthorized:false,writeReserveAuthorized:false,
      sourceBackupSafe:false,physicalD1Sql:0
    }));
  }catch(e){
    // No token, account UUID or raw Cloudflare response in logs.
    const code=String(e?.message||"UNKNOWN");
    console.error(/^G5_SOURCE_OBSERVATION_[A-Z0-9_]+$/.test(code)?code:
      "G5_SOURCE_OBSERVATION_UNCLASSIFIED_FAIL_CLOSED");
    process.exitCode=2;
  }
}
