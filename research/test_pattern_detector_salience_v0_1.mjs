import assert from "node:assert/strict";
import {
 auditSalienceDescriptor,
 classifyMechanismInterpretation,
 salienceMatchability
} from "./pattern_detector_salience_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const base={
 parentConfirmedAt:"2026-09-20",
 parentDecisionCutoffAt:"2026-09-20"
};

t("DS01 pre-confirmation mechanical descriptor valid",()=>{
 const r=auditSalienceDescriptor({...base,descriptor:{
  field:"anchorAmplitudeATR",observedAt:"2026-09-19",layer:"M"
 }});
 assert.equal(r.status,"VALID");
});

t("DS02 pre-confirmation behavioral salience valid",()=>{
 const r=auditSalienceDescriptor({...base,descriptor:{
  field:"priorTouchCount",observedAt:"2026-09-20",layer:"S"
 }});
 assert.equal(r.status,"VALID");
});

t("DS03 future touch count prohibited",()=>{
 const r=auditSalienceDescriptor({...base,descriptor:{
  field:"futureTouchCount",observedAt:"2026-09-20",layer:"S"
 }});
 assert.equal(r.reason,"FUTURE_FIELD_PROHIBITED");
});

t("DS04 post-confirmation salience leaks",()=>{
 const r=auditSalienceDescriptor({...base,descriptor:{
  field:"lastTouchRecencyEligibleSessions",observedAt:"2026-09-21",layer:"S"
 }});
 assert.equal(r.reason,"POST_CONFIRMATION_SALIENCE_LEAKAGE");
});

t("DS05 unknown layer QA fails",()=>{
 const r=auditSalienceDescriptor({...base,descriptor:{
  field:"x",observedAt:"2026-09-19",layer:"X"
 }});
 assert.equal(r.status,"QA_FAIL");
});

t("DS06 E1 null means generic crossing",()=>{
 assert.equal(classifyMechanismInterpretation({
  e1Residual:false,e2Residual:false,e3Residual:false
 }),"GENERIC_LEVEL_CROSSING_EXPLANATION");
});

t("DS07 E2 null means detector selection",()=>{
 assert.equal(classifyMechanismInterpretation({
  e1Residual:true,e2Residual:false,e3Residual:false
 }),"DETECTOR_MECHANICAL_SELECTION_EXPLANATION");
});

t("DS08 E3 null means salience-mediated",()=>{
 assert.equal(classifyMechanismInterpretation({
  e1Residual:true,e2Residual:true,e3Residual:false
 }),"SALIENCE_MEDIATED_MECHANISM_CANDIDATE");
});

t("DS09 E3 residual is not causal proof",()=>{
 assert.equal(classifyMechanismInterpretation({
  e1Residual:true,e2Residual:true,e3Residual:true
 }),"RESIDUAL_STRUCTURAL_IDENTITY_CANDIDATE_NOT_CAUSAL_PROOF");
});

t("DS10 no mechanical completeness blocks matching",()=>{
 const r=salienceMatchability({
  opportunityComplete:true,mechanicalComplete:false,salienceComplete:true,commonSupportStatus:"IN_SUPPORT"
 });
 assert.equal(r.reason,"MECHANICAL_SELECTION_LAYER_INCOMPLETE");
});

t("DS11 missing behavioral salience still allows E2 only",()=>{
 const r=salienceMatchability({
  opportunityComplete:true,mechanicalComplete:true,salienceComplete:false,commonSupportStatus:"IN_SUPPORT"
 });
 assert.equal(r.status,"E2_MATCHABLE_ONLY");
 assert.equal(r.e3Eligible,false);
});

t("DS12 full layers never create independent vote",()=>{
 const r=salienceMatchability({
  opportunityComplete:true,mechanicalComplete:true,salienceComplete:true,commonSupportStatus:"IN_SUPPORT"
 });
 assert.equal(r.status,"E2_E3_MATCHABLE");
 assert.equal(r.predictiveVoteEligible,false);
});

console.log(`SUMMARY ${pass}/12 PASS`);
