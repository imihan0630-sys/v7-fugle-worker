import assert from "node:assert/strict";
import { assessCrossAccountMigrationPreflight as assess } from "../migration/cross_account_preflight_v0_1.mjs";
const hex = "f".repeat(64);
const id1 = "a".repeat(32), id2 = "b".repeat(32);
const make = () => ({
  source: {accountId:id1, complete:true, verifiedBy:"CLOUDFLARE_READ_ONLY_API", verifiedAt:"2026-10-10T01:00:00Z",
    databases:[{name:"system2-research",sizeBytes:1024},{name:"v7-live"}],
    workers:[{id:"system2-shadow-research",bindings:[{name:"SYSTEM2_DB"},{name:"SYSTEM2_HISTORY_BUCKET"}]},{id:"fugle-test"}],
    buckets:[{name:"system2-historical-research"}], kvNamespaces:[], crons:[]},
  destination: {accountId:id2, complete:true, verifiedBy:"CLOUDFLARE_READ_ONLY_API",verifiedAt:"2026-10-10T01:00:00Z",
    databases:[],workers:[],buckets:[],kvNamespaces:[],crons:[]},
  manifest:{complete:true,verifiedFrom:"SOURCE_READ_ONLY_EXPORT",sourceAccountId:id1,
    exportSha256:hex,schemaSha256:hex,frozenSnapshotSha256:hex,
    tables:[{name:"s2_decisions",rows:0,sha256:hex}], objects:[{key:"2026/10/10/test",bytes:0,sha256:hex}]}
});
function blocked(m, code){const result=assess(m);assert.equal(result.state,"BLOCKED");assert(result.blockers.includes(code), JSON.stringify(result));assert.equal(result.authorizedToMutate,false);}
{
  const m=make(), r=assess(m);
  assert.equal(r.state,"REVIEW_ONLY");
  assert.equal(r.authorizedToMutate,false);
  assert.equal(r.sourceDataCopied,false);
  assert(!JSON.stringify(r).includes(id1));
  assert(!JSON.stringify(r).includes(id2));
}
{ const m=make();m.source.databases[0].sizeBytes=null;blocked(m,"SOURCE_D1_SIZE_UNKNOWN");}
{ const m=make();m.source.databases[0].sizeBytes=500_000_000;blocked(m,"SOURCE_D1_EXCEEDS_FREE_DATABASE_CAPACITY");}
{ const m=make();m.destination.accountId=id1;blocked(m,"SOURCE_DESTINATION_ACCOUNT_COLLISION");}
{ const m=make();m.destination.accountId=undefined;blocked(m,"ACCOUNT_IDENTITY_NOT_AUTHENTICATED");}
{ const m=make();m.destination.complete=false;blocked(m,"DESTINATION_RESOURCE_INVENTORY_UNVERIFIED");}
{ const m=make();m.destination.complete=false;m.destination.r2BucketsVerified=false;m.destination.r2Status="NOT_ENTITLED";m.destination.verifiedBy="CLOUDFLARE_READ_ONLY_API_PARTIAL";blocked(m,"DESTINATION_RESOURCE_INVENTORY_UNVERIFIED");}
{ const m=make();m.source.workers[0].bindings.push({name:"V7_DB"});blocked(m,"SOURCE_S2_BINDINGS_UNVERIFIED_OR_PRODUCTION_BOUND");}
{ const m=make();m.source.buckets=[];blocked(m,"SOURCE_S2_RESOURCE_IDENTITY_MISSING_OR_AMBIGUOUS");}
{ const m=make();m.destination.databases=[{name:"system2-research"}];blocked(m,"DESTINATION_RESOURCE_PREEXISTS_REQUIRE_MANUAL_RECONCILIATION");}
{ const m=make();m.destination.workers=[{id:"fugle-test"}];blocked(m,"DESTINATION_CONTAINS_SYSTEM1_PRODUCTION_RESOURCE");}
{ const m=make();m.destination.crons=[{cron:"* * * * *"}];blocked(m,"DESTINATION_RUNTIME_DEPENDENCIES_REQUIRE_REVIEW");}
{ const m=make();m.manifest.tables.push({...m.manifest.tables[0]});blocked(m,"IMMUTABLE_SOURCE_MANIFEST_MISSING_OR_INVALID");}
{ const m=make();m.manifest.objects[0].key="../bad";blocked(m,"IMMUTABLE_SOURCE_MANIFEST_MISSING_OR_INVALID");}
{ const m=make();m.manifest.sourceAccountId=id2;blocked(m,"SOURCE_MANIFEST_ACCOUNT_MISMATCH");}
{ const m=make();m.manifest.frozenSnapshotSha256="invalid";blocked(m,"IMMUTABLE_SOURCE_MANIFEST_MISSING_OR_INVALID");}
{ const r=assess();assert.equal(r.state,"BLOCKED");assert.equal(r.authorizedToMutate,false);}
console.log("System2 cross-account migration preflight: 16 cases PASS (offline-only)");
