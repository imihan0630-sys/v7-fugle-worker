import assert from "node:assert/strict";
import {buildNegativeControlBoundaryPool} from "./pattern_negative_control_boundary_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const parent={lower:100,upper:104,confirmedAt:"2026-09-20"};
const bar=(date,close)=>({date,close,eligibleSymbolSession:true,technicalContinuityVerified:true});

t("NC01 pseudo zones preserve parent width",()=>{
 const r=buildNegativeControlBoundaryPool({parentZone:parent,historicalCloses:[bar("2026-09-10",80)]});
 assert.equal(r.candidates[0].width,4);
});

t("NC02 future closes cannot create controls",()=>{
 const r=buildNegativeControlBoundaryPool({
  parentZone:parent,historicalCloses:[bar("2026-09-21",80),bar("2026-09-10",70)]
 });
 assert.equal(r.candidates.length,1);assert.equal(r.candidates[0].center,70);
});

t("NC03 candidate overlapping true parent is excluded",()=>{
 const r=buildNegativeControlBoundaryPool({parentZone:parent,historicalCloses:[bar("2026-09-10",102)]});
 assert.equal(r.status,"NEGATIVE_CONTROL_NOT_EVALUABLE");
});

t("NC04 candidate overlapping known structure is excluded",()=>{
 const r=buildNegativeControlBoundaryPool({
  parentZone:parent,
  historicalCloses:[bar("2026-09-10",80),bar("2026-09-11",60)],
  knownStructuralZones:[{lower:78,upper:82,confirmedAt:"2026-09-15"}]
 });
 assert.equal(r.candidates.length,1);assert.equal(r.candidates[0].center,60);
});

t("NC05 future-known structural zone cannot retroactively exclude candidate",()=>{
 const r=buildNegativeControlBoundaryPool({
  parentZone:parent,
  historicalCloses:[bar("2026-09-10",80)],
  knownStructuralZones:[{lower:78,upper:82,confirmedAt:"2026-09-25"}]
 });
 assert.equal(r.candidates.length,1);
});

t("NC06 invalid session close excluded",()=>{
 const bad={...bar("2026-09-10",80),eligibleSymbolSession:false};
 const r=buildNegativeControlBoundaryPool({parentZone:parent,historicalCloses:[bad]});
 assert.equal(r.status,"NEGATIVE_CONTROL_NOT_EVALUABLE");
});

t("NC07 duplicate close centers are de-duplicated",()=>{
 const r=buildNegativeControlBoundaryPool({
  parentZone:parent,historicalCloses:[bar("2026-09-10",80),bar("2026-09-11",80)]
 });
 assert.equal(r.candidates.length,1);
});

t("NC08 controls never become independent votes",()=>{
 const r=buildNegativeControlBoundaryPool({parentZone:parent,historicalCloses:[bar("2026-09-10",80)]});
 assert.equal(r.candidates[0].independentVoteEligible,false);
 assert.equal(r.outcomeSelectionAllowed,false);
});

console.log(`SUMMARY ${pass}/8 PASS`);
