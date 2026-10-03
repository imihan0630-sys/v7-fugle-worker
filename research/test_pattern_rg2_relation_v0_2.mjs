import assert from "node:assert/strict";
import { classifyRg2RelationV2 } from "./pattern_rg2_relation_v0_2.mjs";

let pass=0; const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const local=(o={})=>({
 boundaryId:"L1",boundaryVersion:1,lower:98,upper:100,confirmedAt:"2026-09-20",
 firstBreakAt:"2026-09-24",semanticSpaceId:"TECHNICAL_CONTINUITY",family:"W_NECKLINE",...o
});
const parent=(o={})=>({
 zoneId:"M1",zoneVersion:1,lower:110,upper:112,center:111,confirmedAt:"2026-09-18",
 semanticSpaceId:"TECHNICAL_CONTINUITY",lifecycleState:"BELOW_MAJOR_ZONE",scale:"MAJOR",
 sourceWindowStart:"2025-09-01",sourceWindowEnd:"2026-09-18",zoneAgeEligibleSessions:5,...o
});
const run=(l=local(),p=parent(),extra={})=>classifyRg2RelationV2({
 asOf:"2026-09-25",local:l,parent:p,currentClose:extra.currentClose??105,atr:extra.atr??2,previousParent:extra.previousParent??null
});

t("RV201 canonical geometryRelationState is emitted",()=>{
 const r=run(); assert.equal(r.geometryRelationState,"LOCAL_BELOW_PARENT_POSITIVE_AIR"); assert.equal(r.geometryState,undefined);
});
t("RV202 canonical compoundLifecycleState is emitted",()=>{
 const r=run(); assert.equal(r.compoundLifecycleState,"LOCAL_BREAK_STILL_BELOW_PARENT"); assert.equal(r.compoundState,undefined);
});
t("RV203 parent zone age is preserved",()=>{
 const r=run(); assert.equal(r.parentZoneAgeEligibleSessions,5);
});
t("RV204 invalid parent zone age fails closed",()=>{
 const r=run(local(),parent({zoneAgeEligibleSessions:-1})); assert.equal(r.reason,"INVALID_PARENT_ZONE_AGE");
});
t("RV205 full immutable RG2 coordinates are emitted",()=>{
 const r=run(); assert.deepEqual([r.localLower,r.localUpper,r.parentLower,r.parentUpper,r.parentCenter],[98,100,110,112,111]);
});
t("RV206 future parent confirmation fails closed",()=>{
 const r=run(local(),parent({confirmedAt:"2026-09-26"})); assert.equal(r.reason,"FUTURE_CONFIRMATION");
});
t("RV207 semantic conflict fails closed",()=>{
 const r=run(local(),parent({semanticSpaceId:"RAW_EXECUTION"})); assert.equal(r.reason,"SEMANTIC_SPACE_CONFLICT");
});
t("RV208 same-version coordinate mutation fails closed",()=>{
 const r=run(local(),parent({lower:109}),{previousParent:parent()}); assert.equal(r.reason,"PROVENANCE_CONFLICT_SAME_VERSION_MUTATED");
});
t("RV209 source-window provenance is preserved",()=>{
 const r=run(); assert.equal(r.parentSourceWindowStart,"2025-09-01"); assert.equal(r.parentSourceWindowEnd,"2026-09-18");
});
t("RV210 no hard resistance veto is introduced",()=>{
 const r=run(); assert.equal(r.hardResistanceVeto,false); assert.equal(r.directionalSign,"UNSIGNED");
});

console.log(`SUMMARY ${pass}/10 PASS`);
