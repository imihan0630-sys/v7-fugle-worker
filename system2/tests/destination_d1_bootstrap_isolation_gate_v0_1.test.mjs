import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assessDestinationD1BootstrapIsolationV0_1 as assess} from "../migration/destination_d1_bootstrap_isolation_gate_v0_1.mjs";
import {buildD1OnlyDisabledStagingConfigV0_1 as build} from "../migration/d1_only_disabled_staging_config_v0_1.mjs";
const sourceProvisionWorkflow=readFileSync(".github/workflows/system2-isolated-d1-provision.yml","utf8");
const sourceProvisionScript=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const proposedStagingConfig=build({databaseId:"1".repeat(32)});
const fixture=()=>({
  source:{
    complete:true,verifiedBy:"CLOUDFLARE_READ_ONLY_API",
    verifiedAt:"2026-10-10T03:58:00.000Z",r2BucketsVerified:true,
    accountFingerprint:"a".repeat(64),
    databases:[{name:"v7-live"},{name:"system2-research",sizeBytes:316968960}],
    workers:[{id:"fugle-test"},{id:"system2-shadow-research"}],
  },
  destination:{
    complete:false,verifiedBy:"CLOUDFLARE_READ_ONLY_API_PARTIAL",
    verifiedAt:"2026-10-10T03:58:01.000Z",
    accountFingerprint:"b".repeat(64),r2BucketsVerified:false,
    r2Status:"NOT_ENTITLED",
    databases:[],workers:[],kvNamespaces:[],crons:[],
  },
  serviceReceipt:{
    source:{role:"SOURCE",services:["D1","WORKERS","KV","R2"].map(service=>({service,classification:"READ_GRANTED",httpStatus:200}))},
    destination:{role:"DESTINATION",services:[
      ...["D1","WORKERS","KV"].map(service=>({service,classification:"READ_GRANTED",httpStatus:200})),
      {service:"R2",classification:"R2_ACCOUNT_NOT_ENTITLED",httpStatus:403,errorCode:10042}
    ]},
  },
  sourceProvisionWorkflow,sourceProvisionScript,proposedStagingConfig,
});
const base=assess(fixture());
assert.equal(base.verifiedReadOnlyPreconditions,true);
assert.equal(base.existingProvisionWorkflowSourceBound,true);
assert.equal(base.existingProvisionerAlsoWritesSchema,true);
assert.equal(base.physicalDBCreationAllowed,false);
assert.equal(base.schemaMutationAllowed,false);
assert.equal(base.sourceD1DataCopyAllowed,false);
assert.equal(base.stagingWorkerDeployAllowed,false);
assert.equal(base.costsAuthorized,false);
assert(base.blockers.includes("LEGACY_PROVISION_WORKFLOW_MUST_NOT_TARGET_DESTINATION"));
assert(base.blockers.includes("LEGACY_PROVISION_SCRIPT_IMPORTS_SCHEMA"));
assert(base.blockers.includes("DESTINATION_WRITE_ENVIRONMENT_NOT_CONFIGURED"));
assert(base.blockers.includes("OWNER_TARGET_RESOURCE_AUTHORIZATION_REQUIRED"));
assert(base.blockers.includes("SOURCE_BACKUP_AND_PIT_UNACCEPTED"));
function mutate(fn,code) {
 const args=fixture();fn(args);
 const v=assess(args);
 assert(v.blockers.includes(code),JSON.stringify({code,observed:v.blockers}));
 assert.equal(v.physicalDBCreationAllowed,false);
 assert.equal(v.stagingWorkerDeployAllowed,false);
}
mutate(v=>v.destination.complete=true,"DESTINATION_ACCOUNT_INVENTORY_NOT_VERIFIED");
mutate(v=>v.destination.r2BucketsVerified=true,"DESTINATION_ACCOUNT_INVENTORY_NOT_VERIFIED");
mutate(v=>v.source.complete=false,"SOURCE_ACCOUNT_INVENTORY_NOT_VERIFIED");
mutate(v=>v.destination.accountFingerprint=v.source.accountFingerprint,"ACCOUNT_IDENTITY_NOT_ISOLATED");
mutate(v=>delete v.destination.accountFingerprint,"ACCOUNT_IDENTITY_NOT_ISOLATED");
mutate(v=>v.destination.databases.push({name:"system2-research"}),"DESTINATION_D1_NAME_ALREADY_USED");
mutate(v=>v.destination.workers.push({id:"fugle-test"}),"DESTINATION_HAS_EXISTING_RUNTIME");
mutate(v=>v.destination.crons.push({cron:"* * * * *"}),"DESTINATION_HAS_EXISTING_RUNTIME");
mutate(v=>v.source.workers=[],"SOURCE_FORMAL_SYSTEM1_WORKER_UNVERIFIED");
mutate(v=>v.source.databases=[],"SOURCE_SYSTEM2_DATABASE_UNVERIFIED");
mutate(v=>v.serviceReceipt.destination.services[0].classification="READ_PERMISSION_DENIED","DESTINATION_SERVICE_READ_NOT_GRANTED");
mutate(v=>v.serviceReceipt.destination.services[3].errorCode=10003,"DESTINATION_SERVICE_READ_NOT_GRANTED");
mutate(v=>v.serviceReceipt.source.services[3].classification="READ_PERMISSION_DENIED","SOURCE_SERVICE_READ_NOT_GRANTED");
mutate(v=>v.proposedStagingConfig+='\n[triggers]\ncrons = ["* * * * *"]\n',"STAGING_TEMPLATE_NOT_DISABLED");
mutate(v=>v.proposedStagingConfig+='\n[[r2_buckets]]\nbinding = "SYSTEM2_HISTORY_BUCKET"\n',"STAGING_TEMPLATE_NOT_DISABLED");
mutate(v=>v.proposedStagingConfig=v.proposedStagingConfig.replace('SYSTEM2_RESONANCE_ENABLED = "false"','SYSTEM2_RESONANCE_ENABLED = "true"'),"STAGING_TEMPLATE_NOT_DISABLED");
const approvals=fixture();
Object.assign(approvals,{
  proposedGithubEnvironment:"system2-destination-provision",
  ownerTargetD1CreateAuthorization:true,
  destinationWriteTokenVerified:true,
  accountFreeTierCostAttested:true,
  sourcePhysicalBackupAccepted:true,
});
const evenWithApprovals=assess(approvals);
assert.equal(evenWithApprovals.physicalDBCreationAllowed,false);
assert.equal(evenWithApprovals.schemaMutationAllowed,false);
assert.equal(evenWithApprovals.sourceD1DataCopyAllowed,false);
assert.equal(evenWithApprovals.stagingWorkerDeployAllowed,false);
assert(evenWithApprovals.blockers.includes("LEGACY_PROVISION_WORKFLOW_MUST_NOT_TARGET_DESTINATION"));
console.log("System2 destination D1 bootstrap: source-bound existing workflow identified, 24 negative controls PASS; no Cloudflare operations");
