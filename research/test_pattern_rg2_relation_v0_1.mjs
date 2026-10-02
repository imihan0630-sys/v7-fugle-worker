import assert from "node:assert/strict";
import { classifyRg2Relation } from "./pattern_rg2_relation_v0_1.mjs";

let pass=0;
const t=(name,fn)=>{fn();pass++;console.log("PASS",name);};

const local=(o={})=>({
  boundaryId:"L1",boundaryVersion:1,lower:98,upper:100,
  confirmedAt:"2026-09-20",firstBreakAt:"2026-09-24",
  semanticSpaceId:"TECHNICAL_CONTINUITY",...o
});
const parent=(o={})=>({
  zoneId:"M1",zoneVersion:1,lower:110,upper:112,center:111,
  confirmedAt:"2026-09-18",semanticSpaceId:"TECHNICAL_CONTINUITY",
  lifecycleState:"BELOW_MAJOR_ZONE",...o
});
const run=(l=local(),p=parent(),extra={})=>classifyRg2Relation({
  asOf:"2026-09-25",local:l,parent:p,currentClose:extra.currentClose??105,
  atr:extra.atr??2,previousParent:extra.previousParent??null
});

t("RG2F01 local far below parent preserves positive air",()=>{
  const r=run(); assert.equal(r.geometryState,"LOCAL_BELOW_PARENT_POSITIVE_AIR"); assert(r.availableAirToParentLowerPct>0); assert.equal(r.hardResistanceVeto,false);
});
t("RG2F02 overlapping boundaries are explicit",()=>{
  const r=run(local({lower:109,upper:111})); assert.equal(r.geometryState,"LOCAL_BOUNDARY_OVERLAPS_PARENT_ZONE");
});
t("RG2F03 local break enters parent zone",()=>{
  const r=run(local({lower:108,upper:109}),parent(),{currentClose:111}); assert.equal(r.compoundState,"LOCAL_BREAK_ENTERED_PARENT_ZONE");
});
t("RG2F04 parent first break is separate",()=>{
  const r=run(local(),parent({lifecycleState:"FIRST_BREAK_ABOVE_MAJOR_ZONE"}),{currentClose:113}); assert.equal(r.compoundState,"LOCAL_BREAK_AND_PARENT_FIRST_BREAK");
});
t("RG2F05 parent hold is separate",()=>{
  const r=run(local(),parent({lifecycleState:"HOLDING_ABOVE_MAJOR_ZONE"}),{currentClose:115}); assert.equal(r.compoundState,"LOCAL_BREAK_PARENT_HOLDING_ABOVE");
});
t("RG2F06 parent reentry is separate",()=>{
  const r=run(local(),parent({lifecycleState:"REENTERED_MAJOR_ZONE"}),{currentClose:111}); assert.equal(r.compoundState,"LOCAL_BREAK_PARENT_REENTERED");
});
t("RG2F07 parent failure is separate",()=>{
  const r=run(local(),parent({lifecycleState:"FAILED_MAJOR_ZONE_BREAK"}),{currentClose:108}); assert.equal(r.compoundState,"LOCAL_BREAK_PARENT_FAILED");
});
t("RG2F08 future parent fails closed",()=>{
  const r=run(local(),parent({confirmedAt:"2026-09-26"})); assert.equal(r.reason,"FUTURE_CONFIRMATION");
});
t("RG2F09 same version coordinate mutation fails closed",()=>{
  const prev=parent(); const now=parent({lower:109,upper:112});
  const r=run(local(),now,{previousParent:prev}); assert.equal(r.reason,"PROVENANCE_CONFLICT_SAME_VERSION_MUTATED");
});
t("RG2F10 semantic-space conflict fails closed",()=>{
  const r=run(local(),parent({semanticSpaceId:"RAW_EXECUTION"})); assert.equal(r.reason,"SEMANTIC_SPACE_CONFLICT");
});
t("RG2F11 no local break remains descriptive",()=>{
  const r=run(local({firstBreakAt:null})); assert.equal(r.compoundState,"LOCAL_NOT_BROKEN");
});
t("RG2F12 negative air is retained not clipped",()=>{
  const r=run(local({lower:111,upper:113})); assert(r.availableAirToParentLowerPct<0); assert.equal(r.directionalSign,"UNSIGNED");
});

console.log(`SUMMARY ${pass}/12 PASS`);
