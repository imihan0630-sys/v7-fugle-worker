// Destination Schema-only PREVIEW BUNDLE. Zero network and zero D1 mutations.
// IMPORTANT: This is NOT a Cloudflare SQL executor. Owner/cloud permission is NOT granted here.
import { createHash } from "node:crypto";
import { splitSqlStatements } from "../deploy/d1_admin_core.mjs";
import { inspectDestinationSchemaPrefixOfflineV0_1 } from "./destination_schema_prefix_offline_v0_1.mjs";
const SHA=(s)=>createHash("sha256").update(s).digest("hex");
const TABLE=/^CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+s2_[a-z0-9_]+\s*\(/i;
const INDEX=/^CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\s+[a-z0-9_]+\s+ON\s+s2_[a-z0-9_]+\s*\(/i;
const META=/^INSERT\s+INTO\s+s2_schema_meta\s*\(/i;
function classification(stmt){
 if(TABLE.test(stmt))return "CREATE_S2_TABLE";
 if(INDEX.test(stmt))return "CREATE_S2_INDEX";
 if(META.test(stmt)&&stmt.includes("'schema_version'"))return "SCHEMA_META_VERSION_UPSERT";
 throw Error("SCHEMA_ONLY_STATEMENT_NOT_APPROVED");
}
export function planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt}={}){
 const analyzed=inspectDestinationSchemaPrefixOfflineV0_1({files,sourceProvisioner,destinationReceipt});
 if(analyzed.result!=="OFFLINE_APPROVED_PREFIX_CANDIDATE_ONLY")
   return Object.freeze({version:"S2_DESTINATION_SCHEMA_ONLY_PLAN_V0_1",
     state:"EVIDENCE_BLOCKED",blockers:analyzed.blockers,
     cloudMutationAllowed:false,plannedStatements:0,ownerApproved:false,
     sqlStatements:[]});
 const planned=[];
 try {
  for(const f of files.slice(0,10)){
   const statements=splitSqlStatements(f.sql);
   for(let i=0;i<statements.length;i++){
    const stmt=statements[i];
    const type=classification(stmt);
    planned.push(Object.freeze({file:f.name,ordinal:i+1,type,sha256:SHA(stmt),sql:stmt}));
   }
  }
 }catch(e){return Object.freeze({version:"S2_DESTINATION_SCHEMA_ONLY_PLAN_V0_1",state:"EVIDENCE_BLOCKED",
   blockers:Object.freeze(["SCHEMA_ONLY_STATEMENT_NOT_APPROVED"]),cloudMutationAllowed:false,
   plannedStatements:0,ownerApproved:false,sqlStatements:[]});}
 const count=(type)=>planned.filter(s=>s.type===type).length;
 if(planned.length!==125||count("CREATE_S2_TABLE")!==55||
    count("CREATE_S2_INDEX")!==63||count("SCHEMA_META_VERSION_UPSERT")!==7)
   return Object.freeze({version:"S2_DESTINATION_SCHEMA_ONLY_PLAN_V0_1",state:"EVIDENCE_BLOCKED",
   blockers:Object.freeze(["SCHEMA_ONLY_STATEMENT_COUNTS_CHANGED"]),
   cloudMutationAllowed:false,plannedStatements:0,ownerApproved:false,sqlStatements:[]});
 return Object.freeze({
   version:"S2_DESTINATION_SCHEMA_ONLY_PLAN_V0_1",
   state:"SOURCE_SQL_PAYLOAD_OFFLINE_SEALED_NOT_AUTHORIZED",
   intendedDatabaseName:"system2-research",
   realDestinationD1ReceiptSha256:SHA(JSON.stringify(destinationReceipt)),
   sourceSqlPrefixSha256:analyzed.prefixManifestSha256,
   // SQL payloads are PRIVATE build artifacts. Never log raw SQL or secrets in workflow annotations.
   sqlStatements:Object.freeze(planned),
   plannedStatements:planned.length,
   createTables:55,createIndexes:63,schemaMetaUpserts:7,
   activeMigrations:10,stagedMigrationsExcluded:1,
   planSequenceSha256:SHA(JSON.stringify(planned.map(x=>({file:x.file,ordinal:x.ordinal,type:x.type,sha256:x.sha256})))),
   requiresIndependentLiveTargetAccountIdentityReadback:true,
   requiresOwnerSchemaWriteScopeAuthorization:true,
   requiresFreshDestinationAccountQuotaReservation:true,
   requiresNewDestinationOnlyWriteToken:true,
   requiresPreWriteEmptySchemaReadback:true,
   requiresAuditedPartialFailureResumePlan:true,
   cloudMutationAllowed:false,ownerApproved:false,
   workerOrCronDeployAllowed:false,
   sourceCloudReadsOrWrites:0,destinationCloudReadsOrWrites:0,
   r2TransferAuthorized:false,dataImportAuthorized:false,
   physicalAppliedSourceSchemaVerified:false,
   rowsMigrated:0,
 });
}
