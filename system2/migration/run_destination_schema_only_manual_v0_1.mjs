import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {inspectOrApplyDestinationSchemaV0_1,SCHEMA_CONFIRM,SCHEMA_BOUNDARY} from "./destination_schema_only_manual_executor_v0_1.mjs";
import {collectCurrentSqlFilesOfflineV0_1} from "./destination_schema_prefix_offline_v0_1.mjs";
import {planDestinationSchemaOnlyOfflineV0_1} from "./destination_schema_only_offline_payload_v0_1.mjs";
const dir="/tmp/s2-target-schema-only";
const file=dir+"/sanitized-receipt.json";
mkdirSync(dir,{recursive:true});
const safe=(o)=>writeFileSync(file,JSON.stringify(o,null,2)+"\n",{mode:0o600});
let done=0,hashes=[],planHash=null;
const mode=process.env.S2_SCHEMA_ACTION;
try{
 if(process.env.GITHUB_EVENT_NAME!=="workflow_dispatch"||process.env.GITHUB_REF!=="refs/heads/main"||
    (mode!=="VERIFY_ONLY"&&mode!=="APPLY_ONCE")||
    process.env.S2_SCHEMA_CONFIRM!==SCHEMA_CONFIRM||
    process.env.S2_SCHEMA_BOUNDARY!==SCHEMA_BOUNDARY)
   throw Error("ONLY_OWNER_MANUAL_MAIN_EXACT_SCOPE");
 const files=collectCurrentSqlFilesOfflineV0_1();
 const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
 const destinationReceipt=JSON.parse(readFileSync(
   "system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
 const plan=planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt});
 if(plan.state!=="SOURCE_SQL_PAYLOAD_OFFLINE_SEALED_NOT_AUTHORIZED")throw Error("OFFLINE_SCHEMA_PLAN_BLOCKED");
 planHash=plan.planSequenceSha256;
 // Redundant HASH guard: owner confirms the exact expected 64-char SHA from the
 // manifest job summary; prevents unexpected HEAD SQL-plan drift.
 if(mode==="APPLY_ONCE"&&planHash!==process.env.S2_SCHEMA_PLAN_HASH)
   throw Error("OWNER_PLAN_HASH_CONFIRMATION_MISMATCH");
 const common={version:"S2_DEST_D1_SCHEMA_ONLY_MANUAL_V0_1",runId:process.env.GITHUB_RUN_ID||null,
  headSha:process.env.GITHUB_SHA||null,mode,plannedStatements:125,planSequenceSha256:planHash,
  targetName:"system2-research",sourceRowsCopied:0,sourceCloudMutations:0,
  newD1ResourcesCreated:0,newWorkersOrCronsCreated:0,paidUpgrade:false,
  sourcePhysicalFrozenBackupVerified:false,fullMigrationAccepted:false};
 safe({...common,status:"STARTED_NOT_CONFIRMED",appliedStatements:0});
 const r=await inspectOrApplyDestinationSchemaV0_1({
   mode,confirm:process.env.S2_SCHEMA_CONFIRM,boundary:process.env.S2_SCHEMA_BOUNDARY,
   accountId:process.env.S2_SCHEMA_DEST_ACCOUNT_ID,token:process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,
   files,sourceProvisioner,destinationReceipt,expectedPlanHash:planHash,fetchImpl:globalThis.fetch,
   onProgress:(x)=>{
      done=x.appliedStatements;hashes.push(x.statementSha256);
      safe({...common,status:"PARTIAL_DO_NOT_RETRY_UNTIL_AUDIT",
       appliedStatements:done,lastConfirmedStatementHash:x.statementSha256,
       appliedStatementHashes:hashes});
   }
 });
 safe({...common,status:r.result,appliedStatements:r.appliedStatements,
   actualTables:r.schemaTablesAfter??null,actualIndexes:r.schemaIndexesAfter??null,
   actualSchemaVersion:r.schemaVersion??null,
   quotaRealtimeFreshnessIndependentlyGuaranteed:false,
   futureCloudSchemaWritesAuthorized:false,sourceRowsCopied:0});
 console.log("TARGET_SCHEMA_ONLY="+r.result);
 console.log("REVIEWED_PLAN_SHA256="+planHash);
 if(mode==="APPLY_ONCE")console.log("VERIFIED_SQL_STATEMENTS="+done);
}catch(err){
 const code=String(err?.message||"ERROR_UNKNOWN").replace(/[^A-Z0-9_]/g,"_").slice(0,110);
 safe({version:"S2_DEST_D1_SCHEMA_ONLY_MANUAL_V0_1",mode,runId:process.env.GITHUB_RUN_ID||null,
  headSha:process.env.GITHUB_SHA||null,planSequenceSha256:planHash,
  status:done?"PARTIAL_OR_UNKNOWN_DO_NOT_RETRY":"BLOCKED_OR_UNKNOWN_DO_NOT_RETRY",
  errorCode:code,appliedStatements:done,confirmedHashes:hashes,sourceRowsCopied:0,
  newWorkersOrCronsCreated:0,newD1ResourcesCreated:0,fullMigrationAccepted:false});
 console.error("TARGET_SCHEMA_ONLY_STOP="+code);
 process.exitCode=1;
}
