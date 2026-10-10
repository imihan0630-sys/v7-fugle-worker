// Pure offline audit, NOT a Cloudflare resource creation tool or a deploy approval.
// Never imports the source D1 provisioner, credential handler or production Worker.
const SOURCE_ENV="system2-research";
const EXISTING_WORKFLOW="system2-isolated-d1-provision.yml";
const SOURCE_PROVISION_FILE="system2/deploy/provision_system2_d1.mjs";
const TARGET_DB="system2-research";
const APPROVED_R2_ABSENCE="R2_ACCOUNT_NOT_ENTITLED";
const SERVICES=["D1","WORKERS","KV"];
function one(items,pred){return Array.isArray(items)&&items.filter(pred).length===1}
function isCleanArray(x){return Array.isArray(x)&&x.length===0}
function status(rows,key){return rows?.services?.find(x=>x.service===key)}
function stableVerified(x){return typeof x?.verifiedAt==="string"&&Number.isFinite(Date.parse(x.verifiedAt))}
const labels=Object.freeze({
 "SOURCE_ACCOUNT_INVENTORY_NOT_VERIFIED":"Source metadata not completely proven",
 "DESTINATION_ACCOUNT_INVENTORY_NOT_VERIFIED":"Destination partial metadata or R2 denial not attested",
 "ACCOUNT_IDENTITY_NOT_ISOLATED":"Two-account identity separation not proven",
 "DESTINATION_SERVICE_READ_NOT_GRANTED":"Destination D1/Workers/KV read scopes must be verified",
 "SOURCE_SERVICE_READ_NOT_GRANTED":"Source D1/Workers/KV/R2 read scopes must be verified",
 "DESTINATION_D1_NAME_ALREADY_USED":"Destination D1 already exists; never blindly recreate it",
 "DESTINATION_HAS_EXISTING_RUNTIME":"Destination Worker/KV/Cron resources are not empty",
 "SOURCE_SYSTEM2_DATABASE_UNVERIFIED":"Source System2 D1 absent or ambiguous",
 "SOURCE_FORMAL_SYSTEM1_WORKER_UNVERIFIED":"Source System1 deployment not identified for protection",
 "LEGACY_PROVISION_WORKFLOW_MUST_NOT_TARGET_DESTINATION":"Current provision workflow binds source GitHub Environment",
 "LEGACY_PROVISION_SCRIPT_IMPORTS_SCHEMA":"Current source D1 provision command also writes schema",
 "STAGING_TEMPLATE_NOT_DISABLED":"Proposed staging config has route, Cron, R2 or live execution enabled",
 "DESTINATION_WRITE_ENVIRONMENT_NOT_CONFIGURED":"Dedicated destination-only write environment unverified",
 "OWNER_TARGET_RESOURCE_AUTHORIZATION_REQUIRED":"New Cloudflare resource needs separate owner signoff",
 "QUOTA_AND_COST_SCOPE_NOT_ACCEPTED":"Destination account daily rowsWritten budget/Free entitlement not independently verified",
 "SOURCE_BACKUP_AND_PIT_UNACCEPTED":"Physical source D1 copy requires independent verified backup and PIT lineage",
});
export function assessDestinationD1BootstrapIsolationV0_1({
 source,destination,serviceReceipt,sourceProvisionWorkflow,sourceProvisionScript,proposedStagingConfig,
 proposedGithubEnvironment=null,ownerTargetD1CreateAuthorization=false,destinationWriteTokenVerified=false,
 accountFreeTierCostAttested=false,sourcePhysicalBackupAccepted=false,
}={}){
 const flags=[];
 if(source?.complete!==true||source?.verifiedBy!=="CLOUDFLARE_READ_ONLY_API"||
   !stableVerified(source))flags.push("SOURCE_ACCOUNT_INVENTORY_NOT_VERIFIED");
 if(destination?.complete!==false||destination?.r2BucketsVerified!==false||
   destination?.r2Status!=="NOT_ENTITLED"||
   destination?.verifiedBy!=="CLOUDFLARE_READ_ONLY_API_PARTIAL"||
   !stableVerified(destination))flags.push("DESTINATION_ACCOUNT_INVENTORY_NOT_VERIFIED");
 const srcFingerprint=source?.accountFingerprint;
 const dstFingerprint=destination?.accountFingerprint;
 if(typeof srcFingerprint!=="string"||srcFingerprint.length!==64||
    typeof dstFingerprint!=="string"||dstFingerprint.length!==64||srcFingerprint===dstFingerprint)
   flags.push("ACCOUNT_IDENTITY_NOT_ISOLATED");
 if(serviceReceipt?.source?.role!=="SOURCE"||!["D1","WORKERS","KV","R2"].every(
   s=>status(serviceReceipt.source,s)?.classification==="READ_GRANTED"))
   flags.push("SOURCE_SERVICE_READ_NOT_GRANTED");
 if(serviceReceipt?.destination?.role!=="DESTINATION"||
   !SERVICES.every(s=>status(serviceReceipt.destination,s)?.classification==="READ_GRANTED")||
   status(serviceReceipt.destination,"R2")?.classification!==APPROVED_R2_ABSENCE||
   status(serviceReceipt.destination,"R2")?.httpStatus!==403||
   status(serviceReceipt.destination,"R2")?.errorCode!==10042)
   flags.push("DESTINATION_SERVICE_READ_NOT_GRANTED");
 if(!one(source?.databases,x=>x.name===TARGET_DB))flags.push("SOURCE_SYSTEM2_DATABASE_UNVERIFIED");
 if(!one(source?.workers,x=>x.id==="fugle-test"))flags.push("SOURCE_FORMAL_SYSTEM1_WORKER_UNVERIFIED");
 if(!isCleanArray(destination?.databases))flags.push("DESTINATION_D1_NAME_ALREADY_USED");
 if(!isCleanArray(destination?.workers)||!isCleanArray(destination?.kvNamespaces)||
    !isCleanArray(destination?.crons))flags.push("DESTINATION_HAS_EXISTING_RUNTIME");
 // This is a static safety assertion about the EXISTING workflow, not a reusable target pipeline.
 const currentProvisionSourceBound=typeof sourceProvisionWorkflow==="string"&&
   sourceProvisionWorkflow.includes("environment: "+SOURCE_ENV)&&
   sourceProvisionWorkflow.includes("node "+SOURCE_PROVISION_FILE)&&
   sourceProvisionWorkflow.includes("secrets.CLOUDFLARE_ACCOUNT_ID");
 if(currentProvisionSourceBound)flags.push("LEGACY_PROVISION_WORKFLOW_MUST_NOT_TARGET_DESTINATION");
 else flags.push("LEGACY_PROVISION_WORKFLOW_MUST_NOT_TARGET_DESTINATION"); // ALWAYS deny reusing it; mutation must be new reviewed pipeline.
 const oldScriptDoesSchema=typeof sourceProvisionScript==="string"&&
   sourceProvisionScript.includes('method: "POST"')&&
   sourceProvisionScript.includes('const migrationFiles = [');
 if(oldScriptDoesSchema)flags.push("LEGACY_PROVISION_SCRIPT_IMPORTS_SCHEMA");
 else flags.push("LEGACY_PROVISION_SCRIPT_IMPORTS_SCHEMA"); // ALWAYS deny old script for target.
 const hasTemplate=typeof proposedStagingConfig==="string"&&
   proposedStagingConfig.includes('name = "system2-shadow-research-staging"')&&
   proposedStagingConfig.includes('workers_dev = false')&&
   proposedStagingConfig.includes('SYSTEM2_CAPTURE_ENABLED = "false"')&&
   proposedStagingConfig.includes('SYSTEM2_RESONANCE_ENABLED = "false"')&&
   proposedStagingConfig.includes('database_name = "'+TARGET_DB+'"')&&
   !/^\s*(?:\[triggers\]|crons\s*=|routes?\s*=|\[\[r2_buckets\]\]|\[\[kv_namespaces\]\])/m.test(
     proposedStagingConfig.split("\n").filter(s=>!s.trim().startsWith("#")).join("\n"));
 if(!hasTemplate)flags.push("STAGING_TEMPLATE_NOT_DISABLED");
 if(proposedGithubEnvironment!=="system2-destination-provision"||!destinationWriteTokenVerified)
   flags.push("DESTINATION_WRITE_ENVIRONMENT_NOT_CONFIGURED");
 if(ownerTargetD1CreateAuthorization!==true)
   flags.push("OWNER_TARGET_RESOURCE_AUTHORIZATION_REQUIRED");
 if(accountFreeTierCostAttested!==true)
   flags.push("QUOTA_AND_COST_SCOPE_NOT_ACCEPTED");
 if(sourcePhysicalBackupAccepted!==true)
   flags.push("SOURCE_BACKUP_AND_PIT_UNACCEPTED");
 const blockers=[...new Set(flags)];
 const verifiedReadOnlyPreconditions=!blockers.some(x=>[
   "SOURCE_ACCOUNT_INVENTORY_NOT_VERIFIED","DESTINATION_ACCOUNT_INVENTORY_NOT_VERIFIED",
   "ACCOUNT_IDENTITY_NOT_ISOLATED","DESTINATION_SERVICE_READ_NOT_GRANTED",
   "SOURCE_SERVICE_READ_NOT_GRANTED","DESTINATION_D1_NAME_ALREADY_USED",
   "DESTINATION_HAS_EXISTING_RUNTIME","SOURCE_SYSTEM2_DATABASE_UNVERIFIED",
   "SOURCE_FORMAL_SYSTEM1_WORKER_UNVERIFIED","STAGING_TEMPLATE_NOT_DISABLED"].includes(x));
 return Object.freeze({
   schemaVersion:"S2_DESTINATION_D1_BOOTSTRAP_OFFLINE_ISOLATION_V0_1",
   state:"NO_CLOUD_MUTATION_APPROVED",
   verifiedReadOnlyPreconditions,
   existingWorkflow:EXISTING_WORKFLOW,
   existingProvisionWorkflowSourceBound:currentProvisionSourceBound,
   existingProvisionerAlsoWritesSchema:oldScriptDoesSchema,
   proposedDestinationEnvironment:"system2-destination-provision",
   targetDatabaseName:TARGET_DB,
   targetR2Required:false,
   intendedWorker:"system2-shadow-research-staging",
   targetCronExpected:0,
   physicalDBCreationAllowed:false,
   sourceD1DataCopyAllowed:false,
   schemaMutationAllowed:false,
   stagingWorkerDeployAllowed:false,
   costsAuthorized:false,
   sourceFormalRuntimeChanged:false,
   blockers:Object.freeze(blockers),
   blockerReasons:Object.freeze(blockers.map(code=>labels[code])),
 });
}
