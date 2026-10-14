import test from "node:test";
import assert from "node:assert/strict";
import {buildD1OnlyDisabledStagingConfigV0_1 as build,assertD1OnlyDisabledStagingConfigV0_1 as validate} from "../migration/d1_only_disabled_staging_config_v0_1.mjs";
import {assessPostSchemaD1OnlyStagingV0_1 as assess} from "../migration/post_schema_d1_only_staging_preflight_v0_1.mjs";

const idA="a".repeat(32),idB="b".repeat(32),db="c".repeat(32),sha="d".repeat(64);
const schema="f9bb690e481b78183ec225f450673a90aec5d3ee637f55da0fa4154584c58c3c";
const plan="99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f";
const fixture=()=>({
 source:{accountId:idA,verifiedBy:"CLOUDFLARE_READ_ONLY_API",observedAtUtc:"2026-10-14T07:00:00.000Z",
  workerName:"system2-shadow-research",system2CronCount:0,system1WorkerName:"fugle-test",system1CronCount:4},
 destination:{accountId:idB,verifiedBy:"CLOUDFLARE_READ_ONLY_API",observedAtUtc:"2026-10-14T07:01:00.000Z",
  databases:[{name:"system2-research",id:db}],workers:[],crons:[],routes:[],kvNamespaces:[],
  r2Status:"NOT_ENTITLED"},
 expected:{sourceAccountId:idA,destinationAccountId:idB,destinationD1Id:db},
 schemaEvidence:{status:"PASS_CLOUDFLARE_DESTINATION_SCHEMA_ONLY_PHYSICAL_STAGE",tables:55,indexes:63,
  schemaObjectDigestSha256:schema,approved125SqlPlanSha256:plan,nativeRunId:38105177481,
  originalArtifactSha256:sha},
 stagingConfig:build({databaseId:db})
});
test("separate post-schema review permits existing exact destination D1 but grants no deployment authority",()=>{
 const input=fixture(),r=assess(input);
 assert.equal(r.state,"DESIGN_REVIEW_ONLY");
 assert.equal(r.blockers.length,0);
 for(const name of ["authorizedToMutate","authorizedToDeploy","cronCutoverAuthorized","destinationWorkerDeployed","httpHealthReadbackVerified","cloudflareLiveReadbackByThisModule","sourceNoNewScheduledEventsVerified"])assert.equal(r[name],false);
 assert.equal(r.callerSuppliedEvidenceOnly,true);
 for(const sensitive of [idA,idB,db,sha])assert.ok(!JSON.stringify(r).includes(sensitive));
});
const scenarios=[
 ["source account collision",m=>{m.source.accountId=idB},"ACCOUNT_IDENTITY_COLLISION"],
 ["source account mismatch",m=>{m.expected.sourceAccountId="f".repeat(32)},"ACCOUNT_TARGET_FINGERPRINT_MISMATCH"],
 ["target account mismatch",m=>{m.expected.destinationAccountId="f".repeat(32)},"ACCOUNT_TARGET_FINGERPRINT_MISMATCH"],
 ["unknown account",m=>{delete m.destination.accountId},"ACCOUNT_IDENTITY_NOT_AUTHENTICATED"],
 ["missing source native readback",m=>{m.source.verifiedBy="UNVERIFIED"},"SOURCE_READ_ONLY_TOPOLOGY_UNVERIFIED"],
 ["old source Cron restored",m=>{m.source.system2CronCount=1},"SOURCE_READ_ONLY_TOPOLOGY_UNVERIFIED"],
 ["System1 V8 Cron count drift",m=>{m.source.system1CronCount=3},"SOURCE_READ_ONLY_TOPOLOGY_UNVERIFIED"],
 ["invalid date normalized by JavaScript",m=>{m.destination.observedAtUtc="2026-02-30T07:01:00.000Z"},"DESTINATION_READ_ONLY_TOPOLOGY_UNVERIFIED"],
 ["unknown dest inventory",m=>{m.destination.verifiedBy="UNKNOWN"},"DESTINATION_READ_ONLY_TOPOLOGY_UNVERIFIED"],
 ["incomplete dest routes inventory",m=>{delete m.destination.routes},"DESTINATION_READ_ONLY_TOPOLOGY_UNVERIFIED"],
 ["rogue destination Worker",m=>{m.destination.workers=[{id:"fugle-test"}]},"DESTINATION_WORKER_PREEXISTS_RECONCILIATION"],
 ["Cron enabled",m=>{m.destination.crons=["* * * * *"]},"DESTINATION_RUNTIME_MUST_REMAIN_EMPTY"],
 ["new public route",m=>{m.destination.routes=["*.example.org"]},"DESTINATION_RUNTIME_MUST_REMAIN_EMPTY"],
 ["KV binding",m=>{m.destination.kvNamespaces=["STOCKS_KV"]},"DESTINATION_RUNTIME_MUST_REMAIN_EMPTY"],
 ["R2 subscribed",m=>{m.destination.r2Status="ENABLED"},"DESTINATION_R2_ENTITLEMENT_UNRESOLVED_OR_ENABLED"],
 ["R2 missing proof",m=>{delete m.destination.r2Status},"DESTINATION_R2_ENTITLEMENT_UNRESOLVED_OR_ENABLED"],
 ["D1 missing",m=>{m.destination.databases=[]},"DESTINATION_D1_NOT_UNIQUELY_PRESENT"],
 ["D1 duplicate name",m=>{m.destination.databases.push({...m.destination.databases[0]})},"DESTINATION_D1_NOT_UNIQUELY_PRESENT"],
 ["D1 id changed",m=>{m.destination.databases[0].id="e".repeat(32)},"DESTINATION_D1_IDENTITY_NOT_MATCHED"],
 ["D1 expected fingerprint drift",m=>{m.expected.destinationD1Id="e".repeat(32)},"DESTINATION_D1_IDENTITY_NOT_MATCHED"],
 ["unexpected extra destination DB",m=>{m.destination.databases.push({name:"another",id:"f".repeat(32)})},"DESTINATION_D1_IDENTITY_NOT_MATCHED"],
 ["schema table mismatch",m=>{m.schemaEvidence.tables=54},"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED"],
 ["schema index mismatch",m=>{m.schemaEvidence.indexes=62},"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED"],
 ["schema hash drift",m=>{m.schemaEvidence.schemaObjectDigestSha256=sha},"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED"],
 ["schema plan drift",m=>{m.schemaEvidence.approved125SqlPlanSha256=sha},"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED"],
 ["schema audit claim absent",m=>{m.schemaEvidence.status="UNVERIFIED"},"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED"],
 ["native run missing",m=>{m.schemaEvidence.nativeRunId=null},"APPROVED_SCHEMA_118_OBJECTS_OR_PLAN_NOT_MATCHED"],
 ["wrong staging target D1",m=>{m.stagingConfig=build({databaseId:"e".repeat(32)})},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"],
 ["staging public worker URL",m=>{m.stagingConfig=m.stagingConfig.replace("workers_dev = false","workers_dev = true")},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"],
 ["staging cron injection",m=>{m.stagingConfig+="\n[triggers]\ncrons = [\"* * * * *\"]\n"},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"],
 ["staging arbitrary secret variable",m=>{m.stagingConfig+="\nPRIVATE_SECRET = \"unsafe\"\n"},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"],
 ["staging extra write binding",m=>{m.stagingConfig+="\n[[unsafe_sql_databases]]\nbinding = \"EXTRA\"\n"},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"],
 ["staging runtime main drift",m=>{m.stagingConfig=m.stagingConfig.replace("system2/deploy/worker.mjs","Worker.js")},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"],
 ["staging missing disabled var",m=>{m.stagingConfig=m.stagingConfig.replace('SYSTEM2_RESONANCE_ENABLED = "false"',"")},"STAGING_WORKER_CONFIG_NOT_EXACT_DISABLED_TARGET"]
];
for(const [name,change,reason] of scenarios){
 test(name+" fails closed",()=>{
  const m=fixture();change(m);const r=assess(m);
  assert.equal(r.state,"BLOCKED",JSON.stringify(r));
  assert.ok(r.blockers.includes(reason),JSON.stringify(r));
  assert.equal(r.authorizedToDeploy,false);assert.equal(r.authorizedToMutate,false);
 });
}
test("strict TOML allowlist also rejects unrelated stealth bindings without a preflight caller",()=>{
 const s=build({databaseId:db});
 assert.equal(validate(s),true);
 for(const bad of [
  s+'\nFUGLE_API_KEY = "SECRET"\n',
  s+'\n[durable_objects]\nbindings = []\n',
  s+'\n[[queues.producers]]\nbinding = "Q"\n',
  s.replace('main = "system2/deploy/worker.mjs"','main = "Worker.js"'),
  s.replace('SYSTEM2_CAPTURE_MODE = "LIMITED_PROSPECTIVE_SHADOW"','SYSTEM2_CAPTURE_MODE = "LIVE"')
 ])assert.throws(()=>validate(bad));
});
