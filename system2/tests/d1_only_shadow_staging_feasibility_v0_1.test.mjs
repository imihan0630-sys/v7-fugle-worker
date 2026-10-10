import assert from "node:assert/strict";
import {assessD1OnlyShadowStagingV0_1 as assess, S2_FREE_D1_SINGLE_DATABASE_LIMIT_BYTES as limit}
from "../migration/d1_only_shadow_staging_feasibility_v0_1.mjs";
const H="f".repeat(64);
const sample=()=>({
 source:{complete:true,verifiedBy:"CLOUDFLARE_READ_ONLY_API",verifiedAt:"2026-10-10T03:57:59.802Z",
   accountFingerprint:"a".repeat(64),r2BucketsVerified:true,
   databases:[{name:"system2-research",sizeBytes:316968960},{name:"v7-live",sizeBytes:null}],
   workers:[{id:"fugle-test"},{id:"system2-shadow-research",bindings:[{name:"SYSTEM2_DB"},{name:"SYSTEM2_HISTORY_BUCKET"}]}],
   buckets:[{name:"system2-historical-research"}]},
 destination:{complete:false,verifiedBy:"CLOUDFLARE_READ_ONLY_API_PARTIAL",
   verifiedAt:"2026-10-10T03:58:00.019Z",accountFingerprint:"b".repeat(64),
   r2BucketsVerified:false,r2Status:"NOT_ENTITLED",databases:[],workers:[],kvNamespaces:[],crons:[]},
 serviceReceipt:{source:{role:"SOURCE",services:["D1","WORKERS","KV","R2"].map(service=>({service,classification:"READ_GRANTED",httpStatus:200}))},
  destination:{role:"DESTINATION",services:[
    ...["D1","WORKERS","KV"].map(service=>({service,classification:"READ_GRANTED",httpStatus:200})),
    {service:"R2",classification:"R2_ACCOUNT_NOT_ENTITLED",httpStatus:403,errorCode:10042}]}},
 sourceManifest:null,
});
const base=assess(sample());
assert.equal(base.state,"EVIDENCE_GATED");
assert.deepEqual(base.blockers,["SOURCE_TABLE_AND_FROZEN_MANIFEST_NOT_VERIFIED"]);
assert.equal(base.capacity.sizeBytes,316968960);
assert.equal(base.capacity.headroomBytes,183031040);
assert.equal(base.capacity.usedPercent,63.4);
assert.equal(base.capacity.fitByCurrentFileSizeOnly,true);
assert.equal(base.deployAuthorized,false);
assert.equal(base.migrationReady,false);
assert.equal(base.activateCronAuthorized,false);
assert.equal(base.enableR2SubscriptionAuthorized,false);
assert.equal(base.physicalDataCopied,false);
function blocked(fn,expected){const v=sample();fn(v);const x=assess(v);assert(x.blockers.includes(expected),JSON.stringify(x));assert.equal(x.deployAuthorized,false);}
blocked(v=>{v.source.databases[0].sizeBytes=null},"SOURCE_D1_SIZE_UNKNOWN");
blocked(v=>{v.source.databases[0].sizeBytes=500000000},"FREE_SINGLE_D1_CAP_EXCEEDED");
blocked(v=>{v.source.databases[0].sizeBytes=500000001},"FREE_SINGLE_D1_CAP_EXCEEDED");
blocked(v=>{v.source.databases[0].sizeBytes=0;v.source.complete=false},"SOURCE_INVENTORY_NOT_FULLY_VERIFIED");
blocked(v=>{v.destination.complete=true},"DESTINATION_PARTIAL_R2_ENTITLEMENT_UNVERIFIED");
blocked(v=>{v.destination.accountFingerprint=v.source.accountFingerprint},"ACCOUNT_COLLISION");
blocked(v=>{v.source.workers[1].bindings.push({name:"V7_DB"})},"SOURCE_WORKER_BINDINGS_UNVERIFIED_OR_FORMAL_BOUND");
blocked(v=>{v.destination.workers.push({id:"fugle-test"})},"DESTINATION_WORKERS_NOT_EMPTY");
blocked(v=>{v.destination.crons.push({cron:"*/5 * * * *"})},"DESTINATION_CRONS_NOT_EMPTY");
blocked(v=>{v.destination.databases.push({name:"system2-research"})},"DESTINATION_DATABASES_NOT_EMPTY");
blocked(v=>{v.source.buckets=[]},"SOURCE_R2_ARCHIVE_MISSING_OR_AMBIGUOUS");
blocked(v=>{v.serviceReceipt.destination.services[3].errorCode=null},"DESTINATION_R2_NOT_ENTITLED_RECEIPT_MISSING");
blocked(v=>{v.serviceReceipt.source.services[3].classification="READ_PERMISSION_DENIED"},"SOURCE_SERVICE_READ_NOT_VERIFIED");
blocked(v=>{v.serviceReceipt.destination.services[0].classification="READ_PERMISSION_DENIED"},"DESTINATION_SERVICE_READ_NOT_VERIFIED");
blocked(v=>{v.source.verifiedAt="NO_TIME"},"SOURCE_INVENTORY_NOT_FULLY_VERIFIED");
const candidate=sample();
candidate.sourceManifest={complete:true,physicalReadback:true,verifiedFrom:"SOURCE_READ_ONLY_EXPORT",
  schemaSha256:H,frozenSnapshotSha256:H,tables:[{name:"s2_example",rows:1,sha256:H}]};
const proposal=assess(candidate);
assert.equal(proposal.state,"PHASE1_OFFLINE_CANDIDATE_ONLY");
assert.equal(proposal.deployAuthorized,false);
assert.equal(proposal.migrationReady,false);
console.log("System2 D1-only Free staging feasibility: 17 checks PASS; no auto-migration authority");
