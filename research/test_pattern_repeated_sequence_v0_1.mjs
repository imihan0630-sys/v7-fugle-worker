import assert from "node:assert/strict";
import {decomposeRepeatedSequence,compareSequenceSummaries} from "./pattern_repeated_sequence_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const sessions=["2026-09-21","2026-09-22","2026-09-23","2026-09-24","2026-09-25","2026-09-26","2026-09-27","2026-09-28","2026-09-29","2026-09-30"];
const g=(key,t,labels)=>({sourceEventGroupKey:key,eventOccurredAt:t,eventTypes:labels});

t("RS01 return then reclaim creates one closed cycle",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"]),g("c1","2026-09-24",["PARENT_RECLAIM"])
 ]});
 assert.equal(r.completedCycleCount,1);assert.equal(r.cycles[0].failurePlacementClass,"NO_FAILURE");
});

t("RS02 same-group failure is failure-on-return",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY","PARENT_FAILURE"]),g("c1","2026-09-24",["PARENT_RECLAIM"])
 ]});
 assert.equal(r.cycles[0].failurePlacementClass,"FAILURE_ON_RETURN_GROUP");
 assert.equal(r.cycles[0].failureEscalationLagEligibleSessions,0);
});

t("RS03 later failure before reclaim is severity escalation not second cycle",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"]),g("f1","2026-09-24",["PARENT_FAILURE"]),g("c1","2026-09-26",["PARENT_RECLAIM"])
 ]});
 assert.equal(r.cycles.length,1);
 assert.equal(r.cycles[0].failurePlacementClass,"FAILURE_AFTER_REENTRY");
 assert.equal(r.cycles[0].failureEscalationLagEligibleSessions,2);
});

t("RS04 second return only begins after prior reclaim",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"]),g("c1","2026-09-23",["PARENT_RECLAIM"]),
  g("r2","2026-09-25",["PARENT_REENTRY"])
 ]});
 assert.equal(r.cycles.length,2);assert.equal(r.openCycleCount,1);
});

t("RS05 orphan reclaim fails",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("c1","2026-09-23",["PARENT_RECLAIM"])
 ]});
 assert.equal(r.status,"QA_FAIL");
});

t("RS06 coarse alternation is declared deterministic",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"]),g("c1","2026-09-23",["PARENT_RECLAIM"])
 ]});
 assert.equal(r.coarseAlternationNovelty,"NONE_DETERMINISTIC_STATE_MACHINE");
});

t("RS07 same coarse counts can hide failure placement difference",()=>{
 const a=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY","PARENT_FAILURE"]),g("c1","2026-09-23",["PARENT_RECLAIM"]),
  g("r2","2026-09-25",["PARENT_REENTRY"]),g("c2","2026-09-27",["PARENT_RECLAIM"])
 ]});
 const b=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"]),g("c1","2026-09-23",["PARENT_RECLAIM"]),
  g("r2","2026-09-25",["PARENT_REENTRY","PARENT_FAILURE"]),g("c2","2026-09-27",["PARENT_RECLAIM"])
 ]});
 const c=compareSequenceSummaries(a,b);
 assert.equal(c.sameCoarseCounts,true);
 assert.equal(c.sameSeverityPlacement,false);
});

t("RS08 same counts different failure placement is path-memory candidate",()=>{
 const a=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY","PARENT_FAILURE"]),g("c1","2026-09-23",["PARENT_RECLAIM"]),
  g("r2","2026-09-25",["PARENT_REENTRY"]),g("c2","2026-09-27",["PARENT_RECLAIM"])
 ]});
 const b=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"]),g("c1","2026-09-23",["PARENT_RECLAIM"]),
  g("r2","2026-09-25",["PARENT_REENTRY","PARENT_FAILURE"]),g("c2","2026-09-27",["PARENT_RECLAIM"])
 ]});
 assert.match(compareSequenceSummaries(a,b).interpretation,/PATH_MEMORY/);
});

t("RS09 open return without failure stays censored state",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-28",["PARENT_REENTRY"])
 ]});
 assert.equal(r.cycles[0].failurePlacementClass,"OPEN_RETURN_NO_FAILURE_YET");
});

t("RS10 full ledger gets no independent vote",()=>{
 const r=decomposeRepeatedSequence({eligibleSessionDates:sessions,eventGroups:[
  g("r1","2026-09-22",["PARENT_REENTRY"])
 ]});
 assert.equal(r.independentVoteEligible,false);
});

console.log(`SUMMARY ${pass}/10 PASS`);
