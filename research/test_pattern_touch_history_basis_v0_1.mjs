import assert from "node:assert/strict";
import {summarizeTouchHistory} from "./pattern_touch_history_basis_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const s=["d1","d2","d3","d4","d5","d6","d7","d8","d9","d10"];

t("TH01 four touches create three gaps",()=>{
 const r=summarizeTouchHistory({asOf:"d10",touchDates:["d1","d4","d7","d10"],eligibleSessionDates:s});
 assert.equal(r.priorTouchCountThroughAsOf,4);
 assert.equal(r.interTouchEligibleSessionGaps.length,3);
});

t("TH02 same count can have different spacing",()=>{
 const a=summarizeTouchHistory({asOf:"d10",touchDates:["d1","d4","d7","d10"],eligibleSessionDates:s});
 const b=summarizeTouchHistory({asOf:"d10",touchDates:["d7","d8","d9","d10"],eligibleSessionDates:s});
 assert.equal(a.priorTouchCountThroughAsOf,b.priorTouchCountThroughAsOf);
 assert.notDeepEqual(a.interTouchEligibleSessionGaps,b.interTouchEligibleSessionGaps);
});

t("TH03 last touch age is ordinal not calendar gap",()=>{
 const r=summarizeTouchHistory({asOf:"d10",touchDates:["d7"],eligibleSessionDates:s});
 assert.equal(r.lastTouchAgeEligibleSessions,3);
});

t("TH04 no touch gives null recency",()=>{
 const r=summarizeTouchHistory({asOf:"d10",touchDates:[],eligibleSessionDates:s});
 assert.equal(r.lastTouchAtThroughAsOf,null);
 assert.equal(r.lastTouchAgeEligibleSessions,null);
});

t("TH05 future touch blocks",()=>{
 const r=summarizeTouchHistory({asOf:"d9",touchDates:["d10"],eligibleSessionDates:s});
 assert.equal(r.status,"DATA_BLOCKED");
});

t("TH06 touch outside certified set blocks",()=>{
 const r=summarizeTouchHistory({asOf:"d10",touchDates:["x"],eligibleSessionDates:s});
 assert.equal(r.reason,"TOUCH_OUTSIDE_CERTIFIED_SET");
});

t("TH07 dwell ratio derived from exposure",()=>{
 const r=summarizeTouchHistory({
  asOf:"d10",eligibleSessionDates:s,zoneInteractionDates:["d2","d3","d8"],observableExposureSessions:10
 });
 assert.equal(r.dwellRatio,0.3);
});

t("TH08 touch rate derived from same count exposure",()=>{
 const r=summarizeTouchHistory({
  asOf:"d10",touchDates:["d2","d6"],eligibleSessionDates:s,observableExposureSessions:10
 });
 assert.equal(r.touchRate,0.2);
});

t("TH09 first-last span equals sum of intertouch gaps",()=>{
 const r=summarizeTouchHistory({asOf:"d10",touchDates:["d1","d4","d10"],eligibleSessionDates:s});
 assert.equal(r.firstToLastTouchSpanEligibleSessions,r.interTouchEligibleSessionGaps.reduce((a,b)=>a+b,0));
});

t("TH10 same count spacing can differ in dwell",()=>{
 const a=summarizeTouchHistory({
  asOf:"d10",touchDates:["d2","d8"],eligibleSessionDates:s,zoneInteractionDates:["d2","d8"],observableExposureSessions:10
 });
 const b=summarizeTouchHistory({
  asOf:"d10",touchDates:["d2","d8"],eligibleSessionDates:s,zoneInteractionDates:["d2","d3","d4","d8","d9"],observableExposureSessions:10
 });
 assert.equal(a.priorTouchCountThroughAsOf,b.priorTouchCountThroughAsOf);
 assert.deepEqual(a.interTouchEligibleSessionGaps,b.interTouchEligibleSessionGaps);
 assert.notEqual(a.dwellRatio,b.dwellRatio);
});

t("TH11 one touch has zero first-last span and no gaps",()=>{
 const r=summarizeTouchHistory({asOf:"d10",touchDates:["d5"],eligibleSessionDates:s});
 assert.equal(r.firstToLastTouchSpanEligibleSessions,0);
 assert.deepEqual(r.interTouchEligibleSessionGaps,[]);
});

t("TH12 no touch-history field becomes independent vote",()=>{
 const r=summarizeTouchHistory({asOf:"d10",eligibleSessionDates:s});
 assert.equal(r.independentVoteEligible,false);
});

console.log(`SUMMARY ${pass}/12 PASS`);
