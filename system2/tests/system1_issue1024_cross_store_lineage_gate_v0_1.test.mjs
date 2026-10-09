import assert from "node:assert/strict";
import {inspectS1Issue1024CrossStoreLineageV0_1 as inspect}
  from "../../research/system1_issue1024_cross_store_lineage_gate_v0_1.mjs";

const sha="a".repeat(40),digest="b".repeat(64);
const source={runId:40000000000,jobId:123456789001,
  headSha:sha,artifactId:12345678901,artifactSha256:digest};
const date="2026-10-12",generation="FORMAL_GENERATION_EXAMPLE_V1";
const bundle="c".repeat(64);
const roles={config:"STOCKS_KV",plan:"STOCKS_KV",dailyReport:"STOCKS_KV",
  cron:"V7_DB",lease:"V7_DB",formalC1:"V7_DB"};
const crossStoreReadbacks=Object.fromEntries(Object.entries(roles).map(
  ([role,store])=>[role,{store,marketDate:date,generationId:generation,
    sourceBundleSha256:bundle,readbackVerified:true,
    source,observedAtUtc:"2026-10-12T16:01:00Z"}]));
const good={
  marketDate:date,generationId:generation,sourceBundleSha256:bundle,
  evidenceCutoffUtc:"2026-10-12T16:30:00Z",
  execution:{
    primary:{event:"NATURAL_CRON",scheduledAtUtc:"2026-10-12T15:35:00Z",
      businessResult:"SUCCESS",skipped:false,source},
    recovery:{state:"NOT_INVOKED_PROVEN",absenceWindowReadbackVerified:true,
      source,windowEndUtc:"2026-10-12T16:05:00Z"}
  },
  crossStoreReadbacks,
  account:{utcQuotaDay:date,sameDayAllWriterUsageReconciled:true,
    quotaCollisionObserved:false,graphqlLagAssessed:true,source}
};
const valid=inspect(good);
assert.equal(valid.crossStoreJoinState,
  "STRUCTURAL_ONLY_UNTRUSTED_PENDING_RAW_PHYSICAL_AUDIT");
assert.equal(valid.readbacksExamined,6);
assert.equal(valid.readbackRolesRequired,6);
assert.equal(valid.independentPhysicalAcceptance,false);
assert.equal(valid.corr003ClosureAuthorized,false);
assert.equal(valid.accountReserveWriteAuthorized,false);
assert.equal(valid.accountReserveWriteRows,null);
assert.equal(valid.accountReserveReadAuthorized,false);
assert.equal(valid.accountReserveReadRows,null);
assert.equal(valid.physicalD1Reads,0);
assert.equal(valid.physicalD1Writes,0);
assert.equal(valid.exactPerRunWrites,null);
assert.equal(valid.exactPerRunReads,null);
assert.equal(valid.wholeDayNotPerRun,true);
assert.equal(Object.isFrozen(valid),true);
const copy=x=>structuredClone(x);
const negatives=[
  ["missing cron",x=>{delete x.crossStoreReadbacks.cron},"MISSING_READBACK:cron"],
  ["wrong physical KV store",x=>{x.crossStoreReadbacks.plan.store="V7_DB"},"WRONG_PHYSICAL_STORE:plan"],
  ["stale daily report",x=>{x.crossStoreReadbacks.dailyReport.marketDate="2026-10-08"},"MIXED_TRADING_DATE:dailyReport"],
  ["mixed C1 generation",x=>{x.crossStoreReadbacks.formalC1.generationId="OTHER_GENERATION"},"MIXED_BUSINESS_GENERATION:formalC1"],
  ["mixed lease generation",x=>{x.crossStoreReadbacks.lease.generationId="OLD"},"MIXED_BUSINESS_GENERATION:lease"],
  ["wrong source bundle",x=>{x.crossStoreReadbacks.config.sourceBundleSha256="d".repeat(64)},"MIXED_OR_UNKNOWN_SOURCE_BUNDLE:config"],
  ["no C1 artifact digest",x=>{delete x.crossStoreReadbacks.formalC1.source.artifactSha256},"UNQUALIFIED_ARTIFACT_PROVENANCE:formalC1"],
  ["earlier observation than primary",x=>{x.crossStoreReadbacks.cron.observedAtUtc="2026-10-12T15:20:00Z"},"IMPOSSIBLE_OR_UNVERIFIED_OBSERVATION_CLOCK:cron"],
  ["future observation after cutoff",x=>{x.crossStoreReadbacks.lease.observedAtUtc="2026-10-12T17:10:00Z"},"IMPOSSIBLE_OR_UNVERIFIED_OBSERVATION_CLOCK:lease"],
  ["noninvoked recovery without exact window",x=>{x.execution.recovery.windowEndUtc="2026-10-12T15:54:59Z"},"RECOVERY_NONINVOCATION_WINDOW_UNVERIFIED"],
  ["recovery state unknown",x=>{x.execution.recovery.state="UNKNOWN"},"RECOVERY_STATE_UNKNOWN"],
  ["wrong UTC day account",x=>{x.account.utcQuotaDay="2026-10-11"},"ACCOUNT_DAY_QUOTA_NO_COLLISION_UNVERIFIED"],
  ["lag not assessed",x=>{x.account.graphqlLagAssessed=false},"ACCOUNT_DAY_QUOTA_NO_COLLISION_UNVERIFIED"],
  ["claimed no collision unsupported",x=>{delete x.account.quotaCollisionObserved},"ACCOUNT_DAY_QUOTA_NO_COLLISION_UNVERIFIED"],
  ["no primary artifact id",x=>{delete x.execution.primary.source.artifactId},"PRIMARY_SOURCE_ARTIFACT_SHA256_MISSING"],
  ["missing generation",x=>{x.generationId=null},"AUTHORITATIVE_GENERATION_ID_MISSING"],
  ["missing bundle",x=>{x.sourceBundleSha256=null},"SOURCE_BUNDLE_HASH_MISSING"],
  ["wrong natural schedule",x=>{x.execution.primary.scheduledAtUtc="2026-10-12T15:55:00Z"},"PRIMARY_NATURAL_SCHEDULE_CLOCK_UNPROVEN"],
  ["holiday-style skipped",x=>{x.execution.primary.skipped=true},"PRIMARY_SUCCESS_NOT_WITNESSED"],
  ["invalid cutoff",x=>{x.evidenceCutoffUtc="UNKNOWN"},"EVIDENCE_CUTOFF_UTC_NOT_SOURCE_VERIFIED"]
];
for(const [name,mutate,code] of negatives){
  const x=copy(good);mutate(x);
  const out=inspect(x);
  assert.ok(out.missing.includes(code),name+" "+JSON.stringify(out.missing));
  assert.equal(out.crossStoreJoinState,"BLOCKED_UNVERIFIED_CROSS_STORE_LINEAGE",name);
  assert.equal(out.independentPhysicalAcceptance,false,name);
  assert.equal(out.corr003ClosureAuthorized,false,name);
  assert.equal(out.accountReserveWriteRows,null,name);
  assert.equal(out.accountReserveReadRows,null,name);
}
const twoSuccess=copy(good);
twoSuccess.execution.recovery={state:"EXECUTED",scheduledAtUtc:"2026-10-12T15:55:01Z",
  source,businessResult:"SUCCESS",skipped:false};
twoSuccess.crossStoreReadbacks.recovery={...good.crossStoreReadbacks.cron};
assert.ok(inspect(twoSuccess).missing.includes("DUPLICATE_SUCCESSFUL_BUSINESS_EXECUTION"));
assert.ok(inspect(twoSuccess).missing.includes("RECOVERY_GENERATION_OR_ARTIFACT_UNVERIFIED")===false);
const noRecoveryArtifact=copy(twoSuccess);
delete noRecoveryArtifact.crossStoreReadbacks.recovery;
assert.ok(inspect(noRecoveryArtifact).missing.includes("RECOVERY_GENERATION_OR_ARTIFACT_UNVERIFIED"));
assert.throws(()=>inspect({marketDate:"2026-02-30"}),/INVALID_MARKET_DATE/);
console.log("S1_ISSUE1024_CROSS_STORE_6_ROLES_23_NEGATIVE_FAILCLOSED_NO_PHYSICAL_AUTHORITY_PASS");
