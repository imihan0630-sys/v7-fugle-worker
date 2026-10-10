// Deterministic versioned SQL-prefix inventory for the NEW account's already-created EMPTY D1.
// GitHub HEAD source contract only; NEVER calls Cloudflare, reads tokens or applies database SQL.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { splitSqlStatements } from "../deploy/d1_admin_core.mjs";

export const D1_SCHEMA_PREP_VERSION="S2_DEST_D1_SCHEMA_PREFIX_OFFLINE_V0_1";
const SHA=/^[a-f0-9]{64}$/i;
const D1_PREFIX_COUNT=10;
const TOTAL_SOURCE_SQL_COUNT=11;
const AUTHORITATIVE_PREFIX_FILE="system2/deploy/provision_system2_d1.mjs";
const TARGET_NAME="system2-research";
const TABLE=/^CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(s2_[a-z0-9_]+)\s*\(/i;
const INDEX=/^CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\s+([a-z0-9_]+)\s+ON\s+(s2_[a-z0-9_]+)\s*\(/i;
const META="s2_schema_meta";
const FROZEN="s2_decisions";
const HIST="s2_historical_a1_bars";
const COLD="s2_historical_a1_segment_manifests";
function digest(str){return createHash("sha256").update(str).digest("hex");}
function safeFiles(files){
 if(!Array.isArray(files)||files.length!==TOTAL_SOURCE_SQL_COUNT)throw Error("SQL_REPOSITORY_FILE_SET_NOT_VERIFIED");
 const seen=new Set();
 return files.map((f,i)=>{
  if(typeof f?.name!=="string"||!new RegExp("^"+String(i+1).padStart(4,"0")+"_[a-z0-9_]+\\.sql$").test(f.name)||
     typeof f.sql!=="string"||!f.sql.trim()||seen.has(f.name))throw Error("SQL_REPOSITORY_FILE_SET_NOT_VERIFIED");
  seen.add(f.name);
  return {name:f.name,sql:f.sql};
 });
}
// Input is the CURRENT owner/source D1 provisioner text, not the live Cloudflare schema.
// Staged SQL 0011 is NEVER silently promoted merely because CI can execute it.
export function inspectDestinationSchemaPrefixOfflineV0_1({files,sourceProvisioner,destinationReceipt}={}){
 const blockers=[];
 let ordered;
 try{ordered=safeFiles(files);}catch{blockers.push("SQL_REPOSITORY_FILE_SET_NOT_VERIFIED");ordered=[];}
 let prefix=[];
 if(typeof sourceProvisioner!=="string"||!sourceProvisioner.includes("const migrationFiles = ["))
   blockers.push("SOURCE_PROVISIONER_PREFIX_UNVERIFIED");
 else{
   const m=sourceProvisioner.match(/const migrationFiles = \[([\s\S]*?)\];/);
   const found=m?[...m[1].matchAll(/["']\.\.\/sql\/([^"']+\.sql)["']/g)].map(x=>x[1]):[];
   prefix=found;
   if(!m||found.length!==D1_PREFIX_COUNT||!ordered.length||
      found.some((name,i)=>name!==ordered[i].name)||
      m[1].replace(/["']\.\.\/sql\/[^"']+\.sql["'],?/g,"").trim())
     blockers.push("SOURCE_PROVISIONER_PREFIX_UNVERIFIED");
 }
 const tables=new Set(),indexes=new Set(),activeSQL=[],stagedSQL=[];
 let schemaRow=false;
 if(ordered.length){
   for(let i=0;i<ordered.length;i++){
     const f=ordered[i]; const active=i<D1_PREFIX_COUNT;
     if(!active){stagedSQL.push(f.name);continue;}
     activeSQL.push(f);
     // Source-level safety scan: no production D1 artifacts or Worker routing references.
     if(/\bV7_DB\b|\bSTOCKS_KV\b|\bfugle-test\b|\bDROP\s+(?:TABLE|INDEX)\b|\bDELETE\s+FROM\b|\bUPDATE\s+s2_decisions\b/i.test(f.sql))
       blockers.push("PRODUCTION_OR_DESTRUCTIVE_SQL_FOUND");
     let statements;
     try{statements=splitSqlStatements(f.sql);}catch{blockers.push("SQL_STATEMENTS_NOT_PARSEABLE");continue;}
     if(!statements.length){blockers.push("EMPTY_ACTIVE_SQL");continue;}
     for(const stmt of statements){
       const table=stmt.match(TABLE);const index=stmt.match(INDEX);
       if(table){
         if(tables.has(table[1]))blockers.push("DUPLICATE_DDL_TABLE_NAME");
         tables.add(table[1]);continue;
       }
       if(index){
         if(indexes.has(index[1]))blockers.push("DUPLICATE_DDL_INDEX_NAME");
         indexes.add(index[1]);continue;
       }
       if(/^INSERT\s+INTO\s+s2_schema_meta\s*\(/i.test(stmt)){
         if(!stmt.includes("'schema_version'"))blockers.push("SCHEMA_META_VERSION_UNVERIFIED");
         schemaRow=true;
         continue;
       }
       // Only the current vetted 10-file prefix should contain CREATE TABLE/INDEX and meta INSERT.
       blockers.push("UNEXPECTED_ACTIVE_SQL_STATEMENT");
     }
   }
   if(ordered[TOTAL_SOURCE_SQL_COUNT-1]?.name!=="0011_outcome_revision_archive_staged.sql"||
     !/CREATE\s+TRIGGER\s+IF\s+NOT\s+EXISTS\s+s2_outcome_revision_block_update/i.test(ordered[10]?.sql||""))
     blockers.push("STAGED_0011_SEMANTICS_CHANGED");
 }
 if(tables.size!==55||indexes.size!==63||!schemaRow||
    ![META,FROZEN,HIST,COLD].every(name=>tables.has(name)))
   blockers.push("ACTIVE_10_SQL_SCHEMA_COUNTS_OR_REQUIRED_TABLES_MISMATCH");
 if(destinationReceipt?.status!=="DESTINATION_D1_METADATA_PHYSICALLY_VERIFIED_TABLE_COUNT_OWNER_UI_ONLY"||
    destinationReceipt?.afterDestination?.databases?.length!==1||
    destinationReceipt.afterDestination.databases[0]?.name!==TARGET_NAME||
    destinationReceipt?.afterDestination?.workerCount!==0||
    destinationReceipt?.afterDestination?.cronCount!==0||
    !Number.isSafeInteger(destinationReceipt?.afterDestination?.databases?.[0]?.apiSizeBytes)||
    destinationReceipt?.offlineReconciliation?.checksPassed!==20)
   blockers.push("EXISTING_EMPTY_DESTINATION_API_RECEIPT_UNVERIFIED");
 const perFile=activeSQL.map(f=>Object.freeze({file:f.name,sha256:digest(f.sql)}));
 return Object.freeze({
   schemaVersion:D1_SCHEMA_PREP_VERSION,
   result:blockers.length?"OFFLINE_SCHEMA_REVIEW_BLOCKED":"OFFLINE_APPROVED_PREFIX_CANDIDATE_ONLY",
   blockers:Object.freeze([...new Set(blockers)]),
   authoritativeSourceProvisioner:AUTHORITATIVE_PREFIX_FILE,
   sourceProvisionerFileSha256:typeof sourceProvisioner==="string"?digest(sourceProvisioner):null,
   repositorySqlFiles:ordered.length||null,
   activePrefixFiles:activeSQL.length,
   stagedExcludedFiles:Object.freeze(stagedSQL),
   sourceDefinedActiveTables:tables.size,
   sourceDefinedActiveIndexes:indexes.size,
   sourceDefinedStagedExtraTables:ordered.length?1:null,
   intendedSchemaVersion:"1.1",
   fileHashes:Object.freeze(perFile),
   prefixManifestSha256:digest(JSON.stringify(perFile)),
   physicalSourceAppliedSchemaVerified:false,
   destinationSqlSchemaVerified:false,
   databaseCreationRequired:false,
   sourceSourceD1DataRowsCopied:0,
   cloudRequestsPerformed:0,
   cloudSchemaWritesAuthorized:false,
   cloudDataWritesAuthorized:false,
   credentialAccessAuthorized:false,
   sourceSystem1FormalChanged:false,
   ownerExplicitSchemaImportApprovalPresent:false,
   independentAuditAccepted:false,
 });
}
export function collectCurrentSqlFilesOfflineV0_1(dir="system2/sql"){
 const names=readdirSync(dir).filter(n=>/^\d{4}_[a-z0-9_]+\.sql$/.test(n)).sort();
 return names.map(name=>({name,sql:readFileSync(dir+"/"+name,"utf8")}));
}
