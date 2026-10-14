import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {assessG6WeekdayCronReceiptV0_1 as assess,executeG6WeekdayCronReadonlyV0_1 as execute,safeG6FailureCodeV0_1 as safeCode} from "../migration/source_system2_weekday_cron_getonly_v0_1.mjs";

const at="2026-10-14T08:20:00.000Z";
const original=()=>({
 state:"SOURCE_S2_CRON_ALREADY_EMPTY_READONLY_NOT_ORIGINAL_PAUSE_PROOF",
 sourceWorker:"system2-shadow-research",system1Worker:"fugle-test",nonTargetScheduleCount:4,
 cloudMutationsRequested:0,pausedConfirmed:true,
 system1Mutated:false,sourceD1Mutated:false,sourceR2Mutated:false,
 destinationWorkerActivated:false,destinationCronActivated:false,
 sourceCronBefore:[],sourceCronAfter:[],observedAtUtc:at
});
test("physical-scoped positive ONLY source schedule config, not event quiescence",()=>{
 const x=assess(original(),{observedAtUtc:at,deployQuarantined:true});
 assert.equal(x.sourceCronConfigCount,0);
 assert.equal(x.system1CronConfigCount,4);
 assert.equal(x.sourceCronConfigZeroObservedAfterCompletedWeekdayWindow,true);
 for(const k of ["independentlyAccepted","sourceCronNoScheduledEventsObserved","sourceScheduledEventTypeTelemetricEvidenceAvailable","inFlightEventClosureVerified","system1FourCronExpressionsExactHistoricalParityVerified","system1BusinessSignalsParityVerified","dataWritersQuiescentVerified","destinationWorkerDeploymentVerified"])assert.equal(x[k],false);
 assert.equal(x.cloudMutations,0);assert.equal(x.d1SQL,0);
});
const checks=[
 ["wrong script",{sourceWorker:"fugle-test"}],
 ["v8 script changed",{system1Worker:"wrong"}],
 ["wrong V8 count",{nonTargetScheduleCount:3}],
 ["five V8 crons",{nonTargetScheduleCount:5}],
 ["source cron reenabled",{sourceCronBefore:[{cron:"* * * * *"}]}],
 ["source postcron drift",{sourceCronAfter:["* * * * *"]}],
 ["inexact original status",{state:"SOURCE_S2_CRON_EMPTY_PHYSICAL_CONFIG_READBACK_PENDING_INDEPENDENT_AUDIT"}],
 ["unverified pause state",{pausedConfirmed:false}],
 ["a prior Cron PUT",{cloudMutationsRequested:1}],
 ["System1 mutation",{system1Mutated:true}],
 ["source D1 mutation",{sourceD1Mutated:true}],
 ["source R2 mutation",{sourceR2Mutated:true}],
 ["destination deployed",{destinationWorkerActivated:true}],
 ["dest Cron enabled",{destinationCronActivated:true}],
 ["no original source observed time",{observedAtUtc:"INVALID"}],
 ["source receipt too stale",{observedAtUtc:"2026-10-13T08:20:00.000Z"}],
 ["source receipt too future",{observedAtUtc:"2026-10-15T08:20:00.000Z"}]
];
for(const [name,delta] of checks)
 test(name+" fails closed",()=>{
  assert.throws(()=>assess({...original(),...delta},{observedAtUtc:at,deployQuarantined:true}),/SOURCE_G6_WEEKDAY_READONLY_/);
 });
test("old source redeploy quarantine missing fails closed",()=>{
 assert.throws(()=>assess(original(),{observedAtUtc:at,deployQuarantined:false}),/QUARANTINE/);
});
test("before first completed Monday UTC schedule window must not claim post-weekday",()=>{
 assert.throws(()=>assess(original(),{observedAtUtc:"2026-10-11T14:00:00.000Z",deployQuarantined:true}),/NO_COMPLETED_WEEKDAY/);
});
test("noncanonical observation timestamp fails closed",()=>{
 assert.throws(()=>assess(original(),{observedAtUtc:"2026-02-30T08:20:00.000Z",deployQuarantined:true}),/UTC_INVALID/);
});
test("execution uses ONLY INSPECT, passes source credential in process, and excludes cloud mutation",async()=>{
 let called=0;
 const r=await execute({accountId:"a".repeat(32),token:"TEST_TOKEN",now:()=>at,
   readGuard:async()=>true,sourceInspect:async ({accountId,token,workersToken,mode})=>{
    called++;
    assert.equal(mode,"INSPECT");assert.equal(token,"TEST_TOKEN");assert.equal(workersToken,token);
    assert.equal(accountId,"a".repeat(32));
    return original();
   }});
 assert.equal(called,1);assert.equal(r.cloudMutations,0);
 assert.ok(!JSON.stringify(r).includes("TEST_TOKEN"));
 assert.ok(!JSON.stringify(r).includes("a".repeat(32)));
});
test("source credentials and redeploy quarantine deny before transport",async()=>{
 let calls=0;
 for(const [accountId,token,readGuard] of [
  ["bad","t",async()=>true],["a".repeat(32),"",async()=>true],
  ["a".repeat(32),"t",async()=>false]
 ]){
  await assert.rejects(()=>execute({accountId,token,readGuard,now:()=>at,
    sourceInspect:async()=>{calls++;return original();}}),/SOURCE_G6_WEEKDAY_READONLY_/);
 }
 assert.equal(calls,0);
});
test("new workflow locks owner exact comment, protected SOURCE environment, no destination secrets or mutation",async()=>{
 const yaml=await readFile(new URL("../../.github/workflows/system2-g6-source-weekday-cron-readonly.yml",import.meta.url),"utf8");
 assert.match(yaml,/github\.event\.issue\.number == 1130/);
 assert.match(yaml,/github\.event\.comment\.user\.login == 'imihan0630-sys'/);
 assert.match(yaml,/github\.event\.comment\.body == '\/s2 g6 source-readonly'/);
 assert.match(yaml,/environment: system2-research/);
 assert.match(yaml,/SYSTEM2_CLOUDFLARE_API_TOKEN/);
 assert.doesNotMatch(yaml,/S2_SCHEMA_DEST_/);
 assert.doesNotMatch(yaml,/wrangler (deploy|publish)|\b(PUT|PATCH|DELETE)\b/);
 assert.match(yaml,/node system2\/migration\/source_system2_weekday_cron_getonly_v0_1\.mjs/);
 assert.match(yaml,/retention-days: 30/);
});

test("G6 failure classification exposes only fixed local codes, never tokens or provider payloads",()=>{
 const staticCode="SOURCE_S2_CRON_PAUSE_FAIL_CLOSED_CLOUDFLARE_GET_FAILED";
 assert.equal(safeCode(new Error(staticCode)),staticCode);
 assert.equal(safeCode(new Error("SOURCE_G6_WEEKDAY_READONLY_SOURCE_REDEPLOY_QUARANTINE_NOT_VERIFIED")),"SOURCE_G6_WEEKDAY_READONLY_SOURCE_REDEPLOY_QUARANTINE_NOT_VERIFIED");
 for(const unsafe of ["401 secret=LEAK","Source "+ "a".repeat(32),"SOURCE_S2_CRON_PAUSE_FAIL_CLOSED_X;TOKEN","provider JSON {error:'unauthorized'}",""]) {
  assert.equal(safeCode(new Error(unsafe)),"SOURCE_G6_WEEKDAY_READONLY_UNCLASSIFIED_FAIL_CLOSED");
 }
});
