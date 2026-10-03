import assert from "node:assert/strict";
import {buildFirstEventOrder,compareOrderToClockBasis} from "./pattern_first_event_order_redundancy_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const ev=(type,date,group,extra={})=>({
 eventType:type,eventOccurredAt:date,eventAvailableAt:date,firstObservedAt:date,
 sourceEventGroupKey:group,...extra
});

t("EO01 simple order follows occurred clocks",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_BREAK_CONFIRMED","2026-09-22","g1"),
  ev("PARENT_REENTRY","2026-09-25","g2")
 ]});
 assert.deepEqual(r.orderedEventGroupKeys,["g1","g2"]);
});

t("EO02 reentry and failure same source close are one group",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_REENTRY","2026-09-25","g2"),
  ev("PARENT_FAILURE","2026-09-25","g2")
 ]});
 assert.equal(r.orderedEventGroupKeys.length,1);
 assert.deepEqual(r.eventLabelsByGroup.g2,["PARENT_FAILURE","PARENT_REENTRY"]);
});

t("EO03 label input order does not change signature",()=>{
 const a=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_REENTRY","2026-09-25","g2"),ev("PARENT_FAILURE","2026-09-25","g2")
 ]});
 const b=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_FAILURE","2026-09-25","g2"),ev("PARENT_REENTRY","2026-09-25","g2")
 ]});
 assert.equal(a.firstEventOrderSignature,b.firstEventOrderSignature);
});

t("EO04 same group changing clock is conflict",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_REENTRY","2026-09-25","g2"),
  ev("PARENT_FAILURE","2026-09-26","g2")
 ]});
 assert.equal(r.reason,"SOURCE_GROUP_CLOCK_CONFLICT");
});

t("EO05 future event excluded from earlier asOf",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-24",events:[
  ev("PARENT_BREAK_CONFIRMED","2026-09-22","g1"),
  ev("PARENT_REENTRY","2026-09-25","g2")
 ]});
 assert.deepEqual(r.orderedEventGroupKeys,["g1"]);
});

t("EO06 future availability excludes event",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-24",events:[
  ev("PARENT_BREAK_CONFIRMED","2026-09-22","g1",{eventAvailableAt:"2026-09-25",firstObservedAt:"2026-09-25"})
 ]});
 assert.equal(r.orderedEventGroupKeys.length,0);
});

t("EO07 two source groups same date preserve tied block",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("LOCAL_BREAK_CONFIRMED","2026-09-22","g1"),
  ev("PARENT_BREAK_CONFIRMED","2026-09-22","g2")
 ]});
 assert.equal(r.tiedTimeBlockCount,1);
});

t("EO08 tied groups are not converted into causal suborder labels",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("A","2026-09-22","g2"),ev("B","2026-09-22","g1")
 ]});
 assert.equal(r.tiedTimeBlockCount,1);
 assert.equal(r.independentVoteEligible,false);
});

t("EO09 missing source group is provenance incomplete",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_BREAK_CONFIRMED","2026-09-22","")
 ]});
 assert.equal(r.status,"UNKNOWN");
});

t("EO10 order signature reconstructs from same clock basis",()=>{
 const events=[ev("PARENT_BREAK_CONFIRMED","2026-09-22","g1"),ev("PARENT_REENTRY","2026-09-25","g2")];
 const r=buildFirstEventOrder({asOf:"2026-09-30",events});
 const c=compareOrderToClockBasis({orderResult:r,events});
 assert.equal(c.status,"DETERMINISTICALLY_RECONSTRUCTED");
});

t("EO11 same source group semantic label count never becomes vote count",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_REENTRY","2026-09-25","g2"),ev("PARENT_FAILURE","2026-09-25","g2")
 ]});
 assert.equal(r.independentVoteEligible,false);
});

t("EO12 order is explicitly derived representation",()=>{
 const r=buildFirstEventOrder({asOf:"2026-09-30",events:[
  ev("PARENT_BREAK_CONFIRMED","2026-09-22","g1")
 ]});
 assert.equal(r.representationClass,"DETERMINISTIC_DERIVED_VIEW");
});

console.log(`SUMMARY ${pass}/12 PASS`);
