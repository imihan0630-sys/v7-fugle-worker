import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {inspectS1P04CrossStoreLineageV0_1 as inspect}
  from "../../research/system1_issue1024_p04_cross_store_lineage_gate_v0_1.mjs";
const fixture=JSON.parse(readFileSync(new URL(
  "../../research/SYSTEM1_ISSUE1024_PER_RUN_COST_PERSISTENCE_GATE_EVIDENCE_20261009_V0_1.json",
  import.meta.url,
),"utf8"));
const job=fixture.existingRealReceipts.wholeV7DbUtcDays[0];
const source={runId:job.runId,jobId:job.jobId,
 headSha:job.sourceCommit,artifactId:job.artifactId,
 artifactSha256:"7dd50ffd181f48f07b63941a81ad749f967ebdd5de1206340ce63b4835ced822"};
const collectorSource={runId:37808995747,jobId:113420649062,
 headSha:"53b15e0731be0948f89f8bc08c90661703276905",
 artifactId:11565090033,
 artifactSha256:"a651899840d42fd017a9d01980716c0b74b5c7cc91273462a00f6867d4033d30"};
const checksum="f".repeat(64);
const date="2026-10-12",generatedAt="2026-10-12T15:36:06.000Z";
const full={
 tradingDate:date,
 calendar:{day:date,ordinary:true,source:"TWSE_OFFICIAL_CALENDAR"},
 cron:{source,scheduledAtUtc:"2026-10-12T15:35:31.000Z",jobType:"AFTER_MARKET_SCAN",
  status:"SUCCESS",skipped:false,d1ReadbackVerified:true,businessExecutionSuccessful:true},
 attempt:{source,status:"SUCCESS",requestedDate:date,kvReadbackVerified:true,generatedAt},
 lease:{source,date,state:"SUCCESS",d1ReadbackVerified:true,dedupReadbackVerified:true},
 config:{source,updatedAt:"2026-10-12T15:36:01.000Z",kvReadbackVerified:true,stockSetHash:checksum},
 plan:{source,generatedAt,scanDate:date,dryRun:false,pipelineComplete:true,
  configUpdatedAt:"2026-10-12T15:36:01.000Z",
  stockSetHash:checksum,selectedCount:2,kvReadbackVerified:true},
 report:{source,marketDate:date,sent:true,simulated:false,stockSetHash:checksum,kvReadbackVerified:true},
 externalPlan:{source,verified:true,simulated:false,stockSetHash:checksum},
 collector:{source:collectorSource,event:"schedule",evidenceDate:date,
  genuineProspective:true,status:"OPERATIONAL_RECOVERY_PASS",
  c1Parent:{status:"VERIFIED",sourceOrigin:"AFTER_MARKET_SCAN_PIPELINE",
   scanDate:date,generatedAt,parentHash:checksum}},
 account:{source,utcDay:date,allWritersReconciled:true,graphqlLagBounded:true,
  quotaCollisionObserved:false,rowsWritten:1000,rowsRead:50000},
 recovery:{state:"NOT_INVOKED_WITNESSED",source,
  absenceWindowReadbackVerified:true},
};
const synthetic=inspect(full);
assert.equal(synthetic.structuralStatus,
 "UNTRUSTED_COMPLETE_SHAPE_REQUIRES_INDEPENDENT_PHYSICAL_AUDIT");
assert.equal(synthetic.sourceIndependentlyAuthenticated,false);
assert.equal(synthetic.physicalP04Accepted,false);
assert.equal(synthetic.P01ActualRowsWrittenPerRun,null);
assert.equal(synthetic.P02ActualRowsReadPerRun,null);
assert.equal(synthetic.system1WriteReserveAuthorized,false);
assert.equal(synthetic.system1ReadReserveAuthorized,false);
assert.equal(synthetic.authorizedReserveRows,null);
assert.equal(Object.isFrozen(synthetic),true);
const failure=inspect({
 tradingDate:"2026-10-08",
 calendar:{day:"2026-10-08",ordinary:true,source:"TWSE_OFFICIAL_CALENDAR"},
 collector:{source:collectorSource,event:"schedule",evidenceDate:"2026-10-08",
  genuineProspective:false,status:"BLOCKED",firstBlocker:"UPSTREAM_ARTIFACT_MISSING",
  verificationFailure:"C1_GENERATION_NOT_FOUND"},
});
assert.equal(failure.structuralStatus,"INCOMPLETE_OR_CONTRADICTORY_SOURCE_FAIL_CLOSED");
assert.ok(failure.reasons.includes("UPSTREAM_C1_MISSING_BLOCKS_P04"));
assert.ok(failure.reasons.includes("NATURAL_23_35_D1_CRON_READBACK_MISSING"));
assert.equal(failure.physicalP04Accepted,false);
assert.equal(failure.successfulBusinessCountObservation,0);
const bad=[
 ["cron not physically read", {cron:{...full.cron,d1ReadbackVerified:false}},
  "NATURAL_23_35_D1_CRON_READBACK_MISSING"],
 ["prior scan stock selection copied",{plan:{...full.plan,scanDate:"2026-10-07"}},
  "SAME_GENERATION_PLAN_KV_READBACK_MISSING"],
 ["KV config reversion",{plan:{...full.plan,configUpdatedAt:"2026-10-11T15:36:01Z"}},
  "SAME_GENERATION_PLAN_KV_READBACK_MISSING"],
 ["daily report historical",{report:{...full.report,marketDate:"2026-10-07"}},
  "SAME_GENERATION_DAILY_REPORT_KV_READBACK_MISSING"],
 ["selected symbols not same",{report:{...full.report,stockSetHash:"e".repeat(64)}},
  "SAME_GENERATION_DAILY_REPORT_KV_READBACK_MISSING"],
 ["3min simulated",{externalPlan:{...full.externalPlan,simulated:true}},
  "SAME_GENERATION_EXTERNAL_PLAN_VERIFICATION_MISSING"],
 ["manual C1 replay",{collector:{...full.collector,event:"workflow_dispatch"}},
  "GENUINE_SCHEDULED_C1_SAME_DAY_PARENT_MISSING"],
 ["C1 parent wrong batch",{collector:{...full.collector,c1Parent:{...full.collector.c1Parent,generatedAt:"2026-10-12T15:45:00Z"}}},
  "C1_FORMAL_PARENT_NOT_BOUND_TO_KV_GENERATION"],
 ["C1 selection route parent",{collector:{...full.collector,c1Parent:{...full.collector.c1Parent,sourceOrigin:"STAGE_SELECTION_ROUTE"}}},
  "GENUINE_SCHEDULED_C1_SAME_DAY_PARENT_MISSING"],
 ["quota collision",{account:{...full.account,quotaCollisionObserved:true}},
  "SAME_UTC_ACCOUNT_NO_COLLISION_UNPROVEN"],
 ["GraphQL lag unknown",{account:{...full.account,graphqlLagBounded:false}},
  "SAME_UTC_ACCOUNT_NO_COLLISION_UNPROVEN"],
 ["zero read cannot replace unknown",{account:{...full.account,rowsRead:null}},
  "ACCOUNT_PHYSICAL_READ_WRITE_METRICS_UNKNOWN"],
 ["clock mismatch",{cron:{...full.cron,scheduledAtUtc:"2026-10-12T15:55:31Z"}},
  "NATURAL_23_35_D1_CRON_READBACK_MISSING"],
 ["recovery unknown",{recovery:{state:"UNKNOWN"}},
  "RECOVERY_TRIGGER_STATE_UNKNOWN"],
 ["recovery unseen absence",{recovery:{...full.recovery,absenceWindowReadbackVerified:false}},
  "RECOVERY_NONINVOCATION_UNATTESTED"],
 ["business executed twice",{recovery:{state:"EXECUTED_WITNESSED",source,
   scheduledAtUtc:"2026-10-12T15:55:11Z",d1AuditReadbackVerified:true,businessExecutionSuccessful:true}},
  "EXACTLY_ONE_BUSINESS_SCAN_UNPROVEN"],
 ["recovery actual skipped but natural",{recovery:{state:"EXECUTED_WITNESSED",source,
   scheduledAtUtc:"2026-10-12T15:55:11Z",d1AuditReadbackVerified:true,businessExecutionSuccessful:false}},
  null],
 ["plan predates cron",{plan:{...full.plan,generatedAt:"2026-10-12T15:30:00Z"}},
  "PLAN_GENERATED_OUTSIDE_NATURAL_RUN_WINDOW"],
 ["bad historical holiday",{calendar:{day:date,ordinary:false,source:"TWSE_OFFICIAL_CALENDAR"}},
  "OFFICIAL_TRADING_DAY_REQUIRED"],
 ["KV attempt wrong snapshot",{attempt:{...full.attempt,generatedAt:"2026-10-12T15:35:50Z"}},
  "SUCCESS_ATTEMPT_PLAN_GENERATION_MISMATCH"],
];
for(const [name,replace,expected] of bad){
 const observed=inspect({...full,...replace});
 assert.equal(observed.physicalP04Accepted,false,name);
 assert.equal(observed.system1WriteReserveAuthorized,false,name);
 assert.equal(observed.system1ReadReserveAuthorized,false,name);
 if(expected)assert.ok(observed.reasons.includes(expected),name);
 else assert.equal(observed.structuralStatus,
 "UNTRUSTED_COMPLETE_SHAPE_REQUIRES_INDEPENDENT_PHYSICAL_AUDIT",name);
}
assert.throws(()=>inspect({tradingDate:"2026-02-31"}),/INVALID_TRADING_DATE/);
assert.throws(()=>inspect({tradingDate:"bad"}),/INVALID_TRADING_DATE/);
console.log("S1_ISSUE1024_P04_CROSS_STORE_C1_ORIGINAL_BLOCKED_20_ADVERSARIAL_UNTRUSTED_PASS");
