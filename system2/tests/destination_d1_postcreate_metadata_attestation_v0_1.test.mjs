import assert from "node:assert/strict";
import {assessDestinationD1PostCreateV0_1 as assess} from "../migration/destination_d1_postcreate_metadata_attestation_v0_1.mjs";
const A="a".repeat(64),B="b".repeat(64),D0="c".repeat(64),D1="d".repeat(64);
const make=()=>{
 const before="2026-10-10T03:58:00Z",after="2026-10-10T05:15:00Z";
 const src=(t)=>({
  accountFingerprint:A,complete:true,verifiedBy:"CLOUDFLARE_READ_ONLY_API",
  verifiedAt:t,r2BucketsVerified:true,r2Status:"READ_GRANTED",
  databases:[{name:"v7-live",idFingerprint:"e".repeat(64)},{name:"system2-research",idFingerprint:D0,sizeBytes:316968960}],
  workers:[{id:"fugle-test"},{id:"system2-shadow-research"}],
  kvNamespaces:[{name:"fugle-stock-config"}],buckets:[{name:"system2-historical-research"}],
  crons:[{worker:"system2-shadow-research",cron:"*/5 0-5,11 * * MON-FRI"}],
 });
 const dst=(t,created)=>({
  accountFingerprint:B,complete:false,verifiedBy:"CLOUDFLARE_READ_ONLY_API_PARTIAL",
  verifiedAt:t,r2BucketsVerified:false,r2Status:"NOT_ENTITLED",
  databases:created?[{name:"system2-research",idFingerprint:D1,sizeBytes:12288}]:[],
  workers:[],kvNamespaces:[],crons:[],buckets:[],
 });
 return {sourceBefore:src(before),sourceAfter:src(after),destinationBefore:dst(before,false),
  destinationAfter:dst(after,true),uiObservation:{
    evidenceType:"OWNER_SUPPLIED_CLOUDFLARE_UI_SCREENSHOT",observedAt:"2026-10-10T05:11:00+00:00",
    tableCount:0,rowsRead:0,rowsWritten:0,storageDisplay:"12.29 kB",
  }};
};
const x=assess(make());
assert.equal(x.result,"API_RESOURCE_READBACK_PASS_TABLES_UI_ONLY");
assert.equal(x.sourceTargetIdentityVerified,true);
assert.equal(x.destinationD1CountApiVerified,1);
assert.equal(x.destinationD1NameApiVerified,"system2-research");
assert.equal(x.destinationDbIdentityFingerprint,D1);
assert.equal(x.destinationD1SizeBytesApiVerified,12288);
assert.equal(x.destZeroTablesProof,"OWNER_UI_ONLY_NOT_API_SQL");
assert.equal(x.destinationTablesSqlVerified,false);
assert.equal(x.sourceFrozenBackupVerified,false);
assert.equal(x.physicalMigrationAccepted,false);
assert.equal(x.cloudWritesAuthorized,false);
assert.equal(x.workerDeployAuthorized,false);
assert.equal(x.enableCronAuthorized,false);
assert.equal(x.cloudReadsPerformedByThisModule,0);
assert(!JSON.stringify(x).includes(A) && !JSON.stringify(x).includes(B));
function blocked(fn,why){
 const a=make();fn(a);const v=assess(a);
 assert.equal(v.result,"EVIDENCE_GATED",why);
 assert(v.blockers.includes(why),JSON.stringify({expected:why,got:v.blockers}));
 assert.equal(v.cloudWritesAuthorized,false);
 assert.equal(v.workerDeployAuthorized,false);
}
blocked(v=>v.destinationAfter.databases=[],"DESTINATION_EXPECTED_SINGLE_D1_NOT_ATTESTED");
blocked(v=>v.destinationAfter.databases.push({name:"other",idFingerprint:"f".repeat(64)}),"DESTINATION_EXPECTED_SINGLE_D1_NOT_ATTESTED");
blocked(v=>v.destinationAfter.databases[0].name="wrong","DESTINATION_EXPECTED_SINGLE_D1_NOT_ATTESTED");
blocked(v=>v.destinationAfter.databases[0].idFingerprint="bad","DESTINATION_EXPECTED_SINGLE_D1_NOT_ATTESTED");
blocked(v=>v.destinationAfter.databases[0].idFingerprint=D0,"SOURCE_AND_DESTINATION_DATABASE_ID_COLLISION");
blocked(v=>v.destinationBefore.databases.push({name:"untracked"}),"DESTINATION_BASELINE_NOT_EMPTY");
blocked(v=>v.destinationAfter.workers.push({id:"fugle-test"}),"DESTINATION_RUNTIME_KV_OR_CRON_UNEXPECTED");
blocked(v=>v.destinationAfter.crons.push({cron:"* * * * *"}),"DESTINATION_RUNTIME_KV_OR_CRON_UNEXPECTED");
blocked(v=>v.destinationAfter.kvNamespaces.push({name:"STOCKS_KV"}),"DESTINATION_RUNTIME_KV_OR_CRON_UNEXPECTED");
blocked(v=>v.sourceAfter.workers.pop(),"SOURCE_RESOURCE_SET_CHANGED_REQUIRES_REVIEW");
blocked(v=>v.sourceAfter.databases.pop(),"SOURCE_RESOURCE_SET_CHANGED_REQUIRES_REVIEW");
blocked(v=>v.sourceAfter.accountFingerprint=B,"ACCOUNT_FINGERPRINT_CHANGED_OR_COLLIDED");
blocked(v=>v.destinationAfter.accountFingerprint=A,"ACCOUNT_FINGERPRINT_CHANGED_OR_COLLIDED");
blocked(v=>v.destinationAfter.complete=true,"DESTINATION_BEFORE_AFTER_API_METADATA_UNVERIFIED");
blocked(v=>v.destinationAfter.r2Status="READ_GRANTED","DESTINATION_BEFORE_AFTER_API_METADATA_UNVERIFIED");
blocked(v=>v.destinationAfter.verifiedAt="2026-10-10T03:00:00Z","POSTCREATE_API_INVENTORY_NOT_FRESH");
blocked(v=>v.uiObservation.tableCount=1,"UI_EMPTY_DATABASE_OBSERVATION_MISSING_OR_DIFFERENT");
blocked(v=>v.uiObservation.rowsWritten=10,"UI_EMPTY_DATABASE_OBSERVATION_MISSING_OR_DIFFERENT");
blocked(v=>v.uiObservation.storageDisplay="0 B","UI_EMPTY_DATABASE_OBSERVATION_MISSING_OR_DIFFERENT");
blocked(v=>v.uiObservation=null,"UI_EMPTY_DATABASE_OBSERVATION_MISSING_OR_DIFFERENT");
// UI alone is never API acceptance and no copied data ever claimed.
const uiOnly=assess({uiObservation:make().uiObservation});
assert.equal(uiOnly.result,"EVIDENCE_GATED");
assert.equal(uiOnly.destinationD1CountApiVerified,null);
console.log("System2 destination postcreate GET-only before/after attestation: 35+ checks PASS; no cloud requests or data writes");
