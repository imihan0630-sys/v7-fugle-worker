// Issue #1103 owner-manual, destination READ token only. No schema/data modifications.
// Artifact is sanitized; it retains full physical object names for independent audit.
// On failure never claim a completed inventory or spill Cloudflare/vendor response text.
import {readFileSync,mkdirSync,writeFileSync,appendFileSync} from "node:fs";
import {collectCurrentSqlFilesOfflineV0_1} from "./destination_schema_prefix_offline_v0_1.mjs";
import {verifyInstalledDestinationSchemaFullReadonly1103,FULL_OBJECT_CONFIRM}
  from "./destination_schema_full_object_readonly_1103_v0_1.mjs";

const dir="/tmp/s2-dest-full-schema-readonly-1103",out=dir+"/receipt.json";
mkdirSync(dir,{recursive:true});
const common={
 version:"S2_DEST_D1_FULL_OBJECT_READONLY_1103_V0_1",
 runId:process.env.GITHUB_RUN_ID||null,
 headSha:process.env.GITHUB_SHA||null,
 mode:"READ_ONLY_FULL_OBJECT_INVENTORY",
 sourceAccountRequests:0,
 cloudWritesPerformed:0,
 sqlDdlStatements:0,
 sqlDmlStatements:0,
 cloudWritesAuthorized:false,
 schemaApplyOnceRerun:false,
 fullMigrationAccepted:false,
 };
function write(v){writeFileSync(out,JSON.stringify({...common,...v},null,2)+"\n",{mode:0o600});}
try{
 if(process.env.GITHUB_EVENT_NAME!=="workflow_dispatch"||
    process.env.GITHUB_REF!=="refs/heads/main"||
    process.env.S2_FULL_SCHEMA_READONLY_CONFIRM!==FULL_OBJECT_CONFIRM)
  throw Error("ISSUE1103_MANUAL_MAIN_READONLY_CONFIRM_REQUIRED");
 write({status:"PENDING_AUTHENTICATED_READ",cloudApiCallsConfirmed:null});
 const r=await verifyInstalledDestinationSchemaFullReadonly1103({
  accountId:process.env.S2_MIGRATION_DESTINATION_ACCOUNT_ID,
  apiToken:process.env.S2_MIGRATION_DESTINATION_READ_TOKEN,
  confirm:process.env.S2_FULL_SCHEMA_READONLY_CONFIRM,
  files:collectCurrentSqlFilesOfflineV0_1(),
  sourceProvisioner:readFileSync("system2/deploy/provision_system2_d1.mjs","utf8"),
  destinationReceipt:JSON.parse(readFileSync(
   "system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8")),
  fetchImpl:globalThis.fetch
 });
 write({...r,metadataReadBudget:2,sqlSelectReadBudget:2,allObjectNamesReadbackIncluded:true,
  noTokenOrRawAccountIdInReceipt:true});
 console.log("S2_SCHEMA_FULL_OBJECT_READONLY_RESULT="+r.status);
 console.log("S2_SCHEMA_CANONICAL_DIGEST_SHA256="+r.canonicalObjectDigestSha256);
 console.log("S2_SCHEMA_PHYSICAL_DIGEST_SHA256="+r.physicalObjectDigestSha256);
 console.log("S2_SCHEMA_PLAN_SHA256="+r.planSequenceSha256);
 if(process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    "Issue #1103 destination-only exact object set: **"+r.status+
    "**. 55 tables/63 indexes, schema 1.1, plan hash "+r.planSequenceSha256+
    ", physical objects digest "+r.physicalObjectDigestSha256+
    ". No DDL, DML, source read, history copy, R2/Worker/Cron or paid upgrade.\n");
}catch(e){
 const code=String(e?.message||"ISSUE1103_UNKNOWN").replace(/[^A-Z0-9_]/g,"_").slice(0,105);
 write({status:"ISSUE1103_SCHEMA_OBJECTS_NOT_VERIFIED_BLOCKED",errorCode:code,
  physicalObjectDigestSha256:null,canonicalAndPhysicalNamesExactMatch:false,
  cloudApiCallsConfirmed:null,automaticRetries:0});
 console.error("S2_SCHEMA_FULL_OBJECT_READONLY_STOP="+code);
 process.exitCode=1;
}
