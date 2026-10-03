import assert from "node:assert/strict";
import {buildRepeatRiskLandmark} from "./pattern_repeated_cycle_landmark_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const summary=n=>({status:"VALID",completedRepeatedCycleCount:n,openRepeatedCycle:0});

t("LM01 before first reclaim is not at risk not zero",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P1",asOf:"2026-09-20",decisionCutoffAt:"2026-09-20",
  repeatedCycleSummary:null
 });
 assert.equal(r.repeatRiskState,"NOT_YET_AT_REPEAT_RISK");
 assert.equal(r.repeatedCycleCount,null);
});

t("LM02 future reclaim cannot classify earlier parent",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P1",asOf:"2026-09-20",decisionCutoffAt:"2026-09-20",
  firstReclaimAt:"2026-09-25",firstReclaimAvailableAt:"2026-09-25",firstReclaimObservedAt:"2026-09-25",
  repeatedCycleSummary:summary(0)
 });
 assert.equal(r.reason,"FUTURE_RECLAIM_USED_FOR_LANDMARK");
});

t("LM03 reclaim occurred but unavailable by cutoff blocks",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P2",asOf:"2026-09-25",decisionCutoffAt:"2026-09-25",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-26",firstReclaimObservedAt:"2026-09-26",
  repeatedCycleSummary:summary(0)
 });
 assert.equal(r.reason,"RECLAIM_NOT_AVAILABLE_BY_CUTOFF");
});

t("LM04 eligible with zero repeat cycles is distinct state",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P2",asOf:"2026-09-25",decisionCutoffAt:"2026-09-25",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-24",firstReclaimObservedAt:"2026-09-24",
  repeatedCycleSummary:summary(0)
 });
 assert.equal(r.repeatRiskState,"AT_RISK_ZERO_EVENTS");
 assert.equal(r.repeatedCycleCount,0);
});

t("LM05 eligible with repeats updates later parent only",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P3",asOf:"2026-09-30",decisionCutoffAt:"2026-09-30",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-24",firstReclaimObservedAt:"2026-09-24",
  repeatedCycleSummary:summary(2)
 });
 assert.equal(r.repeatRiskState,"AT_RISK_WITH_EVENTS");
 assert.equal(r.baselineBackfillAllowed,false);
});

t("LM06 forward outcome must start after current cutoff",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P3",asOf:"2026-09-30",decisionCutoffAt:"2026-09-30",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-24",firstReclaimObservedAt:"2026-09-24",
  repeatedCycleSummary:summary(1)
 });
 assert.equal(r.forwardOutcomeMustStartAfter,"2026-09-30");
});

t("LM07 path incomplete is unknown not zero",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P3",asOf:"2026-09-30",
  pathCompletenessState:"UNCERTIFIED_PATH_GAP"
 });
 assert.equal(r.status,"UNKNOWN");
 assert.equal(r.repeatRiskState,"UNKNOWN");
});

t("LM08 invalid relation lineage blocks",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P3",asOf:"2026-09-30",relationLineageValid:false
 });
 assert.equal(r.status,"DATA_BLOCKED");
});

t("LM09 later parent may legitimately have larger repeated count",()=>{
 const a=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P2",asOf:"2026-09-25",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-24",firstReclaimObservedAt:"2026-09-24",
  repeatedCycleSummary:summary(0)
 });
 const b=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P3",asOf:"2026-09-30",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-24",firstReclaimObservedAt:"2026-09-24",
  repeatedCycleSummary:summary(2)
 });
 assert.equal(a.repeatedCycleCount,0);assert.equal(b.repeatedCycleCount,2);
});

t("LM10 conditional population is explicit",()=>{
 const r=buildRepeatRiskLandmark({
  parentDecisionReceiptId:"P3",asOf:"2026-09-30",
  firstReclaimAt:"2026-09-24",firstReclaimAvailableAt:"2026-09-24",firstReclaimObservedAt:"2026-09-24",
  repeatedCycleSummary:summary(1)
 });
 assert.match(r.conditionalPopulation,/FIRST_RECLAIM/);
});

console.log(`SUMMARY ${pass}/10 PASS`);
