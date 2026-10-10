// Runs ONLY the already-provisioned DESTINATION account's one SQLite schema SELECT.
// Reads new-account D1 READ secret from existing GitHub Environment "system2-migration".
// Never receives SOURCE account ID/token and never attempts a D1 write or import.
import {readFileSync,mkdirSync,writeFileSync,appendFileSync} from "node:fs";
import {collectCurrentSqlFilesOfflineV0_1} from "./destination_schema_prefix_offline_v0_1.mjs";
import {probeDestinationEmptyD1SqlReadonlyV0_1,DEST_SCHEMA_SQL_READONLY_CONFIRM} from "./destination_schema_sql_readonly_preflight_v0_1.mjs";
const dir="/tmp/s2-dest-d1-sql-readonly";const out=dir+"/receipt.json";
mkdirSync(dir,{recursive:true});
const fixed={version:"S2_DEST_SCHEMA_SQL_READONLY_PREWRITE_V0_1",
 runId:process.env.GITHUB_RUN_ID||null,commit:process.env.GITHUB_SHA||null,
 sourceCloudCalls:0,realSqlDdlStatements:0,sourceRowsCopied:0,
 noNewSecretsCreated:true,paidUpgradePerformed:false,
 noDataOrWorkerChanges:true,fullMigrationAccepted:false};
function write(obj){writeFileSync(out,JSON.stringify({...fixed,...obj},null,2)+"\n",{mode:0o600})}
try {
 if(process.env.GITHUB_EVENT_NAME!=="workflow_dispatch"||
   process.env.GITHUB_REF!=="refs/heads/main"||
   process.env.S2_SQL_READ_ONLY_CONFIRM!==DEST_SCHEMA_SQL_READONLY_CONFIRM)
   throw Error("MANUAL_READ_ONLY_MAIN_CONFIRMATION_REQUIRED");
 write({status:"BEFORE_API_READ_NOT_VERIFIED"});
 const files=collectCurrentSqlFilesOfflineV0_1();
 const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
 const destinationReceipt=JSON.parse(readFileSync(
   "system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
 const v=await probeDestinationEmptyD1SqlReadonlyV0_1({
   accountId:process.env.S2_MIGRATION_DESTINATION_ACCOUNT_ID,
   apiToken:process.env.S2_MIGRATION_DESTINATION_READ_TOKEN,
   confirm:process.env.S2_SQL_READ_ONLY_CONFIRM,
   files,sourceProvisioner,destinationReceipt,fetchImpl:globalThis.fetch
 });
 write({status:v.result,schemaObjects:v.objectsFound,tables:v.tableCount,
    indexes:v.indexCount,dbSizeBytes:v.targetFileSizeBytes,
    accountAndDbFingerprintMatched:v.authenticatedDestAccountMatched&&v.authenticatedDestDbMatched,
    planSequenceSha256:v.planSequenceSha256,queryKind:"SELECT_SQLITE_SCHEMA_ONLY",
    cloudReadsPerformed:3,cloudWritesPerformed:0});
 console.log("S2_DESTINATION_SQL_READONLY_RESULT="+v.result);
 console.log("S2_SCHEMA_PLAN_SHA256="+v.planSequenceSha256);
 if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,
   "Destination-only D1 SQL readback: **"+v.result+"**. Schema objects="+v.objectsFound+
   ", expected plan=125 statements, plan hash="+v.planSequenceSha256+
   ". No historical rows read, no schema writes, no Worker/Cron.\n");
 if(v.result!=="DESTINATION_D1_PHYSICAL_EMPTY_SQL_VERIFIED")process.exitCode=1;
} catch(e) {
 const code=String(e?.message||"UNKNOWN").replace(/[^A-Z0-9_]/g,"_").slice(0,110);
 write({status:"BLOCKED_READ_ONLY_EVIDENCE_NOT_VERIFIED",errorCode:code,cloudWritesPerformed:0});
 console.error("S2_DESTINATION_SQL_READONLY_STOP="+code);
 process.exitCode=1;
}
