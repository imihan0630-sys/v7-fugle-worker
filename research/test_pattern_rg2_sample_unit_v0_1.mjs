import assert from "node:assert/strict";
import {
  classifyParentRg2Relations,
  classifyRg2CommonSupport,
  buildRg2DependenceIdentity,
  selectFirstEligibleObservationPerEpisode,
  findEpisodeOverlap,
  purgeTrainingEpisodesSeenInHoldout,
  buildEqualDateWeights,
  summarizeDateWeights
} from "./pattern_rg2_sample_unit_v0_1.mjs";

let pass=0; const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const base={parentDecisionReceiptId:"P1",scanDate:"2026-10-01",symbol:"2330"};
const rel=(k="R1",fp="F1")=>({relationEpisodeKey:k,structuralIdentityFingerprint:fp});

t("SU01 zero relation is not primary eligible",()=>{
 const r=classifyParentRg2Relations({...base,relations:[]});
 assert.equal(r.multiplicityStatus,"NO_RG2_RELATION"); assert.equal(r.primaryInferenceEligible,false);
});
t("SU02 exactly one relation is primary eligible",()=>{
 const r=classifyParentRg2Relations({...base,relations:[rel()]});
 assert.equal(r.multiplicityStatus,"SINGLE_RELATION_ELIGIBLE"); assert.equal(r.primaryInferenceEligible,true);
});
t("SU03 multiple unique relations are ambiguous",()=>{
 const r=classifyParentRg2Relations({...base,relations:[rel("R1"),rel("R2")]});
 assert.equal(r.multiplicityStatus,"MULTI_RELATION_AMBIGUOUS"); assert.equal(r.primaryInferenceEligible,false);
});
t("SU04 duplicate relation key is QA fail",()=>{
 const r=classifyParentRg2Relations({...base,relations:[rel("R1","F1"),rel("R1","F1")]});
 assert.equal(r.status,"QA_FAIL_DUPLICATE_RELATION");
});
t("SU05 same key changed fingerprint is provenance conflict",()=>{
 const r=classifyParentRg2Relations({...base,relations:[rel("R1","F1"),rel("R1","F2")]});
 assert.equal(r.status,"PROVENANCE_CONFLICT");
});
t("SU06 common support requires all frozen gates",()=>{
 const r=classifyRg2CommonSupport({
  parentCertified:true,rootRunComplete:true,multiplicityStatus:"SINGLE_RELATION_ELIGIBLE",
  b0Complete:true,b1Complete:true,outcomeProvenanceValid:true,laterVintageSubstitution:false,unknownCoercedToZero:false
 });
 assert.equal(r.status,"COMMON_SUPPORT_ELIGIBLE");
});
t("SU07 unknown coercion blocks common support",()=>{
 const r=classifyRg2CommonSupport({
  parentCertified:true,rootRunComplete:true,multiplicityStatus:"SINGLE_RELATION_ELIGIBLE",
  b0Complete:true,b1Complete:true,outcomeProvenanceValid:true,unknownCoercedToZero:true
 });
 assert(r.blockers.includes("UNKNOWN_COERCED_TO_ZERO"));
});
t("SU08 dependence identity uses date symbol and relation separately",()=>{
 const r=buildRg2DependenceIdentity({scanDate:"2026-10-01",symbol:"2330",relationEpisodeKey:"R1"});
 assert.deepEqual([r.dateClusterKey,r.symbolClusterKey,r.relationEpisodeKey],["2026-10-01","2330","R1"]);
});
t("SU09 episode-first picks earliest eligible observation",()=>{
 const rows=[
  {scanDate:"2026-10-02",asOf:"18:10",parentDecisionReceiptId:"P2",relationEpisodeKey:"R1",commonSupportStatus:"COMMON_SUPPORT_ELIGIBLE"},
  {scanDate:"2026-10-01",asOf:"18:10",parentDecisionReceiptId:"P1",relationEpisodeKey:"R1",commonSupportStatus:"COMMON_SUPPORT_ELIGIBLE"},
  {scanDate:"2026-10-01",asOf:"18:10",parentDecisionReceiptId:"P3",relationEpisodeKey:"R2",commonSupportStatus:"COMMON_SUPPORT_ELIGIBLE"}
 ];
 const x=selectFirstEligibleObservationPerEpisode(rows);
 assert.equal(x.length,2); assert.equal(x.find(r=>r.relationEpisodeKey==="R1").parentDecisionReceiptId,"P1");
});
t("SU10 episode overlap detects train-holdout leakage",()=>{
 const x=findEpisodeOverlap([{relationEpisodeKey:"R1"},{relationEpisodeKey:"R2"}],[{relationEpisodeKey:"R2"},{relationEpisodeKey:"R3"}]);
 assert.deepEqual(x,["R2"]);
});
t("SU11 episode purge removes all overlapping train rows",()=>{
 const r=purgeTrainingEpisodesSeenInHoldout(
  [{relationEpisodeKey:"R1"},{relationEpisodeKey:"R2"},{relationEpisodeKey:"R2"}],
  [{relationEpisodeKey:"R2"}]
 );
 assert.equal(r.kept.length,1); assert.equal(r.purged.length,2);
});
t("SU12 equal-date weights give each date equal total weight",()=>{
 const rows=[{scanDate:"2026-10-01",id:1},{scanDate:"2026-10-01",id:2},{scanDate:"2026-10-02",id:3}];
 const w=buildEqualDateWeights(rows);
 const s=summarizeDateWeights(w);
 assert.equal(s.length,2);
 assert(Math.abs(s[0].totalWeight-0.5)<1e-12);
 assert(Math.abs(s[1].totalWeight-0.5)<1e-12);
});
t("SU13 more rows on one date do not increase date total weight",()=>{
 const rows=[
  {scanDate:"2026-10-01"},{scanDate:"2026-10-01"},{scanDate:"2026-10-01"},{scanDate:"2026-10-01"},
  {scanDate:"2026-10-02"}
 ];
 const s=summarizeDateWeights(buildEqualDateWeights(rows));
 assert(Math.abs(s[0].totalWeight-s[1].totalWeight)<1e-12);
});
t("SU14 missing relation key blocks multiplicity classification",()=>{
 const r=classifyParentRg2Relations({...base,relations:[{}]});
 assert.equal(r.reason,"RELATION_KEY_MISSING");
});

console.log(`SUMMARY ${pass}/14 PASS`);
