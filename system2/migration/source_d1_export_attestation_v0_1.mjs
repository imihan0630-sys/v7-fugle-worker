// Offline-only System2 source database export receipt attestor.
// Never issues Cloudflare API requests, reads secrets, writes databases or certifies actual PIT.
import {createHash} from "node:crypto";
export const SOURCE_EXPORT_ATTESTATION_VERSION="S2_SOURCE_D1_EXPORT_ATTESTATION_V0_1";
export const SOURCE_EXPORT_RECEIPT_VERSION="S2_CROSS_ACCOUNT_SOURCE_D1_EXPORT_V0_1";
export const FREE_ACCOUNT_ROWS_WRITTEN_PER_UTC_DAY=100000;
const SHA=/^[0-9a-f]{64}$/i;
const NAME=/^s2_[a-z][a-z0-9_]*$/i;
const CANONICAL_DB="system2-research";
const MANDATORY=new Set(["s2_schema_meta","s2_decisions","s2_historical_a1_bars"]);
const RECEIPT_AUTHORITY=Object.freeze({physicalCopyAuthorized:false,cloudMutationAuthorized:false,cutoverAuthorized:false,
  ownerApprovalSubstituted:false,independentAuditPassed:false});
function sha(text){return createHash("sha256").update(text).digest("hex");}
function isoValid(s){return typeof s==="string"&&Number.isFinite(Date.parse(s))&&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);}

// Arrays of {name:"0001_x.sql", content:"..."} are from the versioned repository, never the Cloudflare API.
// The hash proves the *repository migration files*, not physical SQLite schema parity.
export function inventoryOfflineSystem2SqlMigrationsV0_1(files){
  if(!Array.isArray(files)||files.length<1)throw Error("SCHEMA_SQL_MIGRATIONS_UNVERIFIED");
  const paths=new Set(),tables=new Set(),migrations=[];
  for(const file of files){
    if(typeof file?.name!=="string"||!/^\d{4}_[a-z0-9_]+\.sql$/.test(file.name)||
       typeof file.content!=="string"||!file.content.trim()||paths.has(file.name))throw Error("SCHEMA_SQL_MIGRATIONS_UNVERIFIED");
    paths.add(file.name);
    const found=[...file.content.matchAll(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["\x60]?([a-zA-Z][a-zA-Z0-9_]*)["\x60]?\s*\(/gi)]
      .map(match=>match[1].toLowerCase());
    if(!found.length)throw Error("SCHEMA_SQL_MIGRATIONS_UNVERIFIED");
    for(const table of found){
      if(!NAME.test(table)||tables.has(table))throw Error("SCHEMA_SQL_MIGRATIONS_UNVERIFIED");
      tables.add(table);
    }
    migrations.push({name:file.name,sha256:sha(file.content),tables:found.sort()});
  }
  if([...MANDATORY].some(table=>!tables.has(table)))throw Error("SCHEMA_SQL_MIGRATIONS_UNVERIFIED");
  migrations.sort((a,b)=>a.name.localeCompare(b.name));
  const numbered=migrations.map(x=>Number(x.name.slice(0,4)));
  if(numbered[0]!==1||numbered.some((n,i)=>n!==i+1))throw Error("SCHEMA_SQL_MIGRATIONS_UNVERIFIED");
  const tableNames=Object.freeze([...tables].sort());
  return Object.freeze({
    version:SOURCE_EXPORT_ATTESTATION_VERSION,
    sqlMigrationFileCount:migrations.length,
    expectedTableCount:tableNames.length,
    migrationSqlSha256:sha(JSON.stringify(migrations)),
    migrations:Object.freeze(migrations.map(m=>Object.freeze({name:m.name,tables:Object.freeze([...m.tables])}))),
    tableNames,
    source:"LOCAL_VERSIONED_SQL_ONLY_NOT_PHYSICAL",
  });
}

// This is a fail-closed shape/content *consistency* check, not a substitute for independent
// GitHub artifact hash verification or physical Cloudflare D1 readback.
export function attestOfflineSourceD1ExportV0_1({schema,manifest}={}){
  const blockers=[];
  if(!schema||!SHA.test(schema.migrationSqlSha256||"")||!Array.isArray(schema.tableNames)||
     schema.tableNames.length!==schema.expectedTableCount||
     schema.tableNames.some(t=>!NAME.test(t))||!Array.isArray(schema.tableNames)||
     [...new Set(schema.tableNames)].length!==schema.tableNames.length)
    blockers.push("LOCAL_SQL_SCHEMA_INVENTORY_UNVERIFIED");
  const m=manifest;
  let expectedApplied=null;
  if(!m)blockers.push("PHYSICAL_SOURCE_D1_EXPORT_MANIFEST_MISSING");
  else{
    if(m.schemaVersion!==SOURCE_EXPORT_RECEIPT_VERSION||
       m.verifiedFrom!=="SOURCE_D1_PHYSICAL_READ_ONLY_EXPORT"||
       m.physicalReadback!==true||
       m.databaseName!==CANONICAL_DB||
       !Number.isSafeInteger(m.runId)||m.runId<=0||
       !Number.isSafeInteger(m.artifactId)||m.artifactId<=0||
       !SHA.test(m.artifactSha256||"")||
       !SHA.test(m.exportSha256||"")||!SHA.test(m.schemaSha256||"")||
       !SHA.test(m.frozenSnapshotSha256||"")||!isoValid(m.observedAt))
      blockers.push("PHYSICAL_SOURCE_IDENTITY_AND_HASH_CHAIN_UNVERIFIED");
    if(m.migrationSqlSha256!==schema?.migrationSqlSha256)
      blockers.push("SOURCE_EXPORT_SQL_MIGRATION_FINGERPRINT_MISMATCH");
    // The repo may contain unapplied migrations. Do not assume 56 current SQL tables
    // exist physically in source D1; require a verified contiguous applied prefix.
    const migrations=schema?.migrations;
    const applied=m.appliedMigrationFiles;
    const appliedVerified=m.appliedMigrationPhysicalReadback===true &&
      Array.isArray(applied)&&applied.length>0&&Array.isArray(migrations) &&
      applied.length<=migrations.length &&
      applied.every((name,i)=>typeof name==="string" && name===migrations[i]?.name);
    if(!appliedVerified)blockers.push("SOURCE_APPLIED_MIGRATION_CHAIN_UNVERIFIED");
    expectedApplied=appliedVerified ?
      [...new Set(migrations.slice(0,applied.length).flatMap(x=>x.tables))].sort():null;
    if(!Array.isArray(m.tables)||!m.tables.length)blockers.push("SOURCE_TABLE_ROWS_AND_HASHES_MISSING");
    else{
      const found=new Set();
      for(const t of m.tables){
        if(!NAME.test(t?.name||"")||found.has(t.name)||
           !Number.isSafeInteger(t.rows)||t.rows<0||
           !SHA.test(t.sha256||"")||!SHA.test(t.schemaSha256||"")){
          blockers.push("SOURCE_TABLE_ROWS_AND_HASHES_INVALID");break;
        }
        found.add(t.name);
      }
      if(expectedApplied && (found.size!==expectedApplied.length||
          expectedApplied.some(t=>!found.has(t))))
        blockers.push("SOURCE_TABLE_SET_DIFFERS_FROM_PHYSICALLY_APPLIED_MIGRATIONS");
      const decisions=m.tables.find(t=>t.name==="s2_decisions");
      if(!decisions||m.frozenDecisionRowCount!==decisions.rows||
         m.frozenSnapshotPhysicalReadback!==true)
        blockers.push("FROZEN_DECISION_SNAPSHOT_INVARIANT_UNVERIFIED");
    }
    const read=m.sourceReadBudget;
    if(!read||read.readOnlyGuardPassed!==true||
       read.system1ReadReserveVerified!==true||
       read.accountHeadroomCertified!==true||
       !Number.isSafeInteger(read.rowsRead)||read.rowsRead<0||
       read.rowsWritten!==0||
       !/^\d{4}-\d{2}-\d{2}$/.test(read.quotaDayUtc||""))
      blockers.push("SOURCE_READ_QUOTA_AND_FORMAL_RESERVE_UNVERIFIED");
    if(m.backupRetentionLocked!==true||m.immutableSnapshotRetentionLocked!==true)
      blockers.push("SOURCE_BACKUP_RETENTION_UNVERIFIED");
  }
  const tableCount=Array.isArray(m?.tables)?m.tables.length:null;
  const wellFormedCounts=Array.isArray(m?.tables)&&m.tables.length>0&&m.tables.every(t=>Number.isSafeInteger(t?.rows)&&t.rows>=0);
  const totalRows=wellFormedCounts?m.tables.reduce((sum,t)=>sum+t.rows,0):null;
  const safeTotal=totalRows!==null&&Number.isSafeInteger(totalRows)?totalRows:null;
  if(totalRows!==null && safeTotal===null)blockers.push("SOURCE_ROW_COUNTS_UNSAFE_INTEGER");
  return Object.freeze({
    version:SOURCE_EXPORT_ATTESTATION_VERSION,
    result:blockers.length?"EVIDENCE_BLOCKED":"OFFLINE_DOCUMENT_REVIEW_ONLY",
    blockers:Object.freeze([...new Set(blockers)]),
    codeMigrationFileCount:schema?.sqlMigrationFileCount??null,
    repositoryDefinedSchemaTableCount:schema?.expectedTableCount??null,
    physicallyAppliedExpectedTableCount:expectedApplied?.length??null,
    appliedMigrationCount:Array.isArray(m?.appliedMigrationFiles)?m.appliedMigrationFiles.length:null,
    physicalTableReceiptCount:tableCount,
    // Minimum theory: one D1 inserted row at least one row-written unit; secondary indices,
    // retries, additional active writers and schema are excluded. No authority to spend.
    minimumDestinationRowsWrittenLowerBound:safeTotal,
    theoreticalMinimumFreeQuotaDays:safeTotal===null?null:Math.ceil(safeTotal/FREE_ACCOUNT_ROWS_WRITTEN_PER_UTC_DAY),
    actualRowsWrittenWithIndexesAndRetries:"UNKNOWN",
    liveAccountHeadroom:"UNKNOWN",
    newD1ImportCapacityCertified:false,
    realRowsMigrated:0,
    ...RECEIPT_AUTHORITY,
  });
}
