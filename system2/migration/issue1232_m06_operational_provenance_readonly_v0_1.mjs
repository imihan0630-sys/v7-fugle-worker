// M06 #1232: destination-only bounded physical SELECT of legacy operational tables.
// SOURCE counts are from an existing independently restored archive catalog,
// never new destination health. No table rows exported, no DML/DDL/Worker/Cron/R2.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
const hash=x=>createHash("sha256").update(String(x).toLowerCase()).digest("hex");
const ACCOUNT_SHA="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const DB_SHA="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const SOURCE_SQL_SHA="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12";
const SOURCE_ZIP_SHA="6b6f4ebf9762e9cff7c6200a8cf4b6f10b1300c709fb426fe82e10ced9a6da8e";
const SOURCE={s2_infrastructure_checks:2505,s2_source_session_receipts:11,s2_resonance_runs:5};
export const M06_READ_SQL="SELECT (SELECT COUNT(*) FROM s2_infrastructure_checks) AS infrastructure_checks, (SELECT COUNT(*) FROM s2_source_session_receipts) AS source_session_receipts, (SELECT COUNT(*) FROM s2_resonance_runs) AS resonance_runs, (SELECT COUNT(*) FROM s2_decisions) AS frozen_decisions";
const OUT="/tmp/s2-m06-operational-provenance";
const fail=s=>{throw Error("M06_"+s)};
export function assessM06ArchiveCatalog(c){
  if(!c||c.sourceTotalRows!==113222||c.sourceTableCount!==55||
    c.sourceArchive?.originalSqlSha256!==SOURCE_SQL_SHA||c.sourceArchive?.zipSha256!==SOURCE_ZIP_SHA||
    !Array.isArray(c.tables)||c.tables.length!==55)fail("SOURCE_CATALOG_IDENTITY");
  const names=new Set();let total=0,populated=0;
  for(const t of c.tables){
    if(!/^s2_[a-z0-9_]+$/.test(t?.table||"")||names.has(t.table)||
       !Number.isSafeInteger(t.sourceRows)||t.sourceRows<0)fail("SOURCE_CATALOG_TABLE_INVALID");
    names.add(t.table);total+=t.sourceRows;if(t.sourceRows)populated++;
  }
  if(total!==113222||populated!==14||Object.entries(SOURCE).some(([name,n])=>
    !names.has(name)||c.tables.find(x=>x.table===name).sourceRows!==n))fail("SOURCE_CATALOG_COUNT_INCONSISTENT");
  return Object.freeze({sourceArchivedRows:113222,sourceTables:55,sourcePopulatedTables:14,
    sourceLegacyOperationalRows:2521,sourceCounts:{...SOURCE},archiveIdentityOnly:true,
    sourceQueriedInThisRun:false,independentlyRevalidatedSourceTablePayloadsInThisRun:false});
}
export function assessM06DestinationCounts(rows){
  const keys={infrastructure_checks:"s2_infrastructure_checks",
    source_session_receipts:"s2_source_session_receipts",resonance_runs:"s2_resonance_runs"};
  if(!rows||rows.frozen_decisions!==0)fail("FROZEN_UNEXPECTED");
  const counts={};let copied=0;
  for(const [key,table] of Object.entries(keys)){
    const n=rows[key];
    if(!Number.isSafeInteger(n)||n<0||n>SOURCE[table])fail("DEST_COUNT_OUT_OF_RANGE");
    counts[table]=n;copied+=n;
  }
  return Object.freeze({destinationCounts:counts,destinationLegacyOperationalRows:copied,
    sourceArchivedLegacyOperationalRows:2521,uncopiedLegacyOperationalRows:2521-copied,
    provenanceStatus:copied===0?"SOURCE_ONLY_LEGACY_OPERATIONAL_ROWS_NOT_COPIED":
       "DEST_LEGACY_OPERATIONAL_ROWS_PRESENT__PROVENANCE_NOT_CERTIFIED",
    sourceToDestinationRowContentHashAccepted:false,sourceOldChecksReusableAsTargetLiveHealth:false,
    sourceR2InventoryAccepted:false,selectionOrShadowAuthorized:false,permissionToWrite:false});
}
export async function collectM06({account,token,request=fetch,catalog}){
  if(!account||!token||hash(account)!==ACCOUNT_SHA)fail("DEST_ACCOUNT_IDENTITY");
  const source=assessM06ArchiveCatalog(catalog);
  async function api(path,method="GET",body=null){
    if(method!=="GET"&&!(method==="POST"&&path.endsWith("/query")&&
      body?.sql===M06_READ_SQL&&Object.keys(body).length===1))fail("ONLY_PINNED_SELECT_ALLOWED");
    const r=await request("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
      method,headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
      ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(25000)});
    const d=await r.json().catch(()=>null);
    if(!r.ok||d?.success!==true)fail("DEST_PROVIDER_READ_FAILED");
    return d.result;
  }
  const all=await api("/d1/database?per_page=100");
  if(!Array.isArray(all)||all.length!==1||all[0].name!=="system2-research")fail("DEST_DATABASE_UNIVERSE");
  const db=all[0],id=db.uuid||db.id;
  if(!id||hash(id)!==DB_SHA||!Number.isSafeInteger(db.file_size)||
     db.file_size<0||db.file_size>450000000)fail("DEST_DB_IDENTITY_OR_CAPACITY");
  const result=await api("/d1/database/"+id+"/query","POST",{sql:M06_READ_SQL});
  if(!Array.isArray(result)||result.length!==1||result[0]?.success!==true||
     result[0].results?.length!==1)fail("DEST_PROVIDER_RESPONSE_INVALID");
  const meta=result[0].meta||{};
  if(!Number.isSafeInteger(meta.rows_read)||meta.rows_read<0||meta.rows_read>15000||
     meta.rows_written!==0)fail("DEST_QUERY_METERING_INVALID");
  const classified=assessM06DestinationCounts(result[0].results[0]);
  return Object.freeze({schemaVersion:"S2_M06_LEGACY_OPERATIONS_DEST_CENSUS_READONLY_V0_1",
    status:"REAL_DESTINATION_COUNT_READBACK_ONLY__INDEPENDENT_AUDIT_PENDING",
    observedAtUtc:new Date().toISOString(),
    originalSource:{runId:38150147134,jobId:114501726086,artifactId:11706652537,
      sqlSha256:SOURCE_SQL_SHA,zipSha256:SOURCE_ZIP_SHA,...source},
    destination:{accountFingerprintSha256:ACCOUNT_SHA,databaseFingerprintSha256:DB_SHA,
      fileSizeBytes:db.file_size,queryRowsRead:meta.rows_read,queryRowsWritten:0,...classified},
    providerTargetAccountActualSqlSelect:true,sourceD1Queries:0,destinationD1Writes:0,
    budgetHeadroomFromThisQueryGranted:false,liveHealthReplacement:false,
    originalArchiveBytesRehashedThisRun:false,rawRowsExported:0,paidResources:0,
    workerCronChanged:false,independentAuditAcceptance:false});
}
async function main(){
  let receipt={schemaVersion:"S2_M06_LEGACY_OPERATIONS_DEST_CENSUS_READONLY_V0_1",
    status:"FAIL_CLOSED",destinationD1Writes:0,sourceD1Queries:0};
  try{
    const path="system2/migration/evidence/S2_SOURCE_D1_REAL_ROWSET_CATALOG_AND_DAY80_BUDGET_PLAN_20261012_V0_1.json";
    const catalog=JSON.parse(await readFile(path,"utf8"));
    receipt=await collectM06({account:process.env.S2_SCHEMA_DEST_ACCOUNT_ID,
      token:process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,catalog});
  }catch(e){
    const msg=String(e?.message||"");receipt.error=/^M06_[A-Z_]+$/.test(msg)?msg:"M06_UNEXPECTED_ERROR";
    process.exitCode=2;
  }finally{
    await mkdir(OUT,{recursive:true,mode:0o700});
    await writeFile(OUT+"/sanitized-readback.json",JSON.stringify(receipt,null,2)+"\n",{mode:0o600});
    console.log(JSON.stringify({status:receipt.status,counts:receipt.destination?.destinationCounts||null,
      error:receipt.error||null,writeCount:0}));
  }
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)await main();
