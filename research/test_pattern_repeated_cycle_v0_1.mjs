import assert from "node:assert/strict";
import {summarizeRepeatedCycles} from "./pattern_repeated_cycle_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const sessions=["2026-09-20","2026-09-21","2026-09-22","2026-09-23","2026-09-24","2026-09-25","2026-09-26","2026-09-27","2026-09-28","2026-09-29","2026-09-30"];
const g=(key,t,labels)=>({sourceEventGroupKey:key,eventOccurredAt:t,eventTypes:labels});

t("RC01 no first reclaim means not yet at repeated-cycle risk",()=>{
 const r=summarizeRepeatedCycles({asOf:"2026-09-30",eligibleSessionDates:sessions});
 assert.equal(r.repeatRiskState,"REPEATED_CYCLE_NOT_YET_AT_RISK");
 assert.equal(r.completedRepeatedCycleCount,null);
});

t("RC02 one repeated return-reclaim pair is one completed repeated cycle",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-09-25",["PARENT_REENTRY"]),g("c2","2026-09-27",["PARENT_RECLAIM"])]
 });
 assert.equal(r.completedRepeatedCycleCount,1);
 assert.equal(r.recurrentReturnGroupCount,1);
 assert.equal(r.recurrentReclaimGroupCount,1);
});

t("RC03 reentry plus failure same source group counts one return",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-09-25",["PARENT_REENTRY","PARENT_FAILURE"]),g("c2","2026-09-27",["PARENT_RECLAIM"])]
 });
 assert.equal(r.recurrentReturnGroupCount,1);
 assert.equal(r.recurrentFailureGroupCount,1);
});

t("RC04 repeated failure worsening while open does not create second return cycle",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-09-24",["PARENT_REENTRY"]),g("f2","2026-09-25",["PARENT_FAILURE"]),g("c2","2026-09-27",["PARENT_RECLAIM"])]
 });
 assert.equal(r.recurrentReturnGroupCount,1);
 assert.equal(r.recurrentFailureGroupCount,1);
 assert.equal(r.completedRepeatedCycleCount,1);
});

t("RC05 open repeated return is censored not completed",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-09-27",["PARENT_REENTRY"])]
 });
 assert.equal(r.openRepeatedCycle,1);
 assert.equal(r.completedRepeatedCycleCount,0);
});

t("RC06 two completed repeated cycles remain one episode sample",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[
   g("r2","2026-09-23",["PARENT_REENTRY"]),g("c2","2026-09-24",["PARENT_RECLAIM"]),
   g("r3","2026-09-26",["PARENT_REENTRY"]),g("c3","2026-09-28",["PARENT_RECLAIM"])
  ]
 });
 assert.equal(r.completedRepeatedCycleCount,2);
 assert.equal(r.independentSampleIncrement,0);
});

t("RC07 exposure counts constrained separately",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  constrainedDates:["2026-09-24","2026-09-25"]
 });
 assert.equal(r.constrainedEligibleSessionsAtRisk,2);
 assert.equal(r.observableEligibleSessionsAtRisk,7);
});

t("RC08 cycle rate derives from completed cycles and observable exposure",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-09-25",["PARENT_REENTRY"]),g("c2","2026-09-27",["PARENT_RECLAIM"])]
 });
 assert.equal(r.cycleRatePerObservableSession,1/9);
});

t("RC09 recurrent event outside certified session set blocks",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-10-01",["PARENT_REENTRY"])]
 });
 assert.equal(r.status,"VALID");
 assert.equal(r.recurrentReturnGroupCount,0);
});

t("RC10 event before or on first reclaim is excluded from repeated layer",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("first-return","2026-09-21",["PARENT_REENTRY"]),g("first-reclaim","2026-09-22",["PARENT_RECLAIM"])]
 });
 assert.equal(r.recurrentReturnGroupCount,0);
});

t("RC11 repeated gap times use eligible-session ordinals",()=>{
 const r=summarizeRepeatedCycles({
  asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions,
  eventGroups:[g("r2","2026-09-24",["PARENT_REENTRY"]),g("c2","2026-09-27",["PARENT_RECLAIM"])]
 });
 assert.deepEqual(r.repeatGapEligibleSessions,[3]);
});

t("RC12 longer exposure is visible and cannot be confused with more independent N",()=>{
 const a=summarizeRepeatedCycles({asOf:"2026-09-25",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions.slice(0,6)});
 const b=summarizeRepeatedCycles({asOf:"2026-09-30",firstReclaimAt:"2026-09-22",eligibleSessionDates:sessions});
 assert(b.observableEligibleSessionsAtRisk>a.observableEligibleSessionsAtRisk);
 assert.equal(b.independentSampleIncrement,0);
});

console.log(`SUMMARY ${pass}/12 PASS`);
