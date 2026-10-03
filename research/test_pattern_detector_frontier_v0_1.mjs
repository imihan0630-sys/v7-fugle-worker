import assert from "node:assert/strict";
import {
 selectionMarginAtr,auditFrontierCandidate,historicalFrontierClass
} from "./pattern_detector_frontier_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const base={
 frontierType:"F1_BASE_CONFIRMED_MAJOR_REJECTED",
 asOf:"2026-09-20",
 semanticSpaceValid:true,
 sessionPathComplete:true,
 baseConfirmed:true,
 majorEvaluable:true,
 majorConfirmed:false,
 observedDirectionalChangeATR:2.7
};

t("DF01 selection margin is continuous",()=>{
 assert.equal(selectionMarginAtr(2.7,3),-0.3);
});

t("DF02 valid BASE-confirmed MAJOR-rejected candidate",()=>{
 const r=auditFrontierCandidate(base);
 assert.equal(r.status,"VALID");
 assert(r.selectionMarginATR<0);
});

t("DF03 F1 without BASE confirmation fails",()=>{
 const r=auditFrontierCandidate({...base,baseConfirmed:false});
 assert.equal(r.reason,"F1_REQUIRES_BASE_CONFIRMATION");
});

t("DF04 unknown MAJOR evaluability stays unknown",()=>{
 const r=auditFrontierCandidate({...base,majorEvaluable:false});
 assert.equal(r.status,"UNKNOWN");
});

t("DF05 F1 cannot already be MAJOR",()=>{
 const r=auditFrontierCandidate({...base,majorConfirmed:true});
 assert.equal(r.status,"QA_FAIL");
});

t("DF06 future-bar reconstruction blocked",()=>{
 const r=auditFrontierCandidate({...base,usedFutureBars:true});
 assert.equal(r.reason,"FUTURE_BAR_RECONSTRUCTION_PROHIBITED");
});

t("DF07 F2 requires same proposal lineage",()=>{
 const r=auditFrontierCandidate({
  frontierType:"F2_MAJOR_SINGLE_GATE_REJECT",asOf:"2026-09-20",
  semanticSpaceValid:true,sessionPathComplete:true,
  sameMajorProposalPath:false,failedGateCount:1,failedGate:"MAJOR_DIRECTIONAL_CHANGE_K3",
  observedDirectionalChangeATR:2.95
 });
 assert.equal(r.status,"UNKNOWN");
});

t("DF08 F2 requires exactly one failed gate",()=>{
 const r=auditFrontierCandidate({
  frontierType:"F2_MAJOR_SINGLE_GATE_REJECT",asOf:"2026-09-20",
  semanticSpaceValid:true,sessionPathComplete:true,
  sameMajorProposalPath:true,failedGateCount:2,failedGate:"MULTIPLE",
  observedDirectionalChangeATR:2.95
 });
 assert.equal(r.status,"QA_FAIL");
});

t("DF09 F2 keeps continuous negative margin",()=>{
 const r=auditFrontierCandidate({
  frontierType:"F2_MAJOR_SINGLE_GATE_REJECT",asOf:"2026-09-20",
  semanticSpaceValid:true,sessionPathComplete:true,
  sameMajorProposalPath:true,failedGateCount:1,failedGate:"MAJOR_DIRECTIONAL_CHANGE_K3",
  observedDirectionalChangeATR:2.95
 });
 assert.equal(r.status,"VALID");
 assert(Math.abs(r.selectionMarginATR+0.05)<1e-12);
});

t("DF10 frontier never implies causal eligibility",()=>{
 const r=auditFrontierCandidate(base);
 assert.equal(r.causalClaimEligible,false);
 assert.equal(r.independentVoteEligible,false);
});

t("DF11 later MAJOR confirmation does not rewrite historical control class",()=>{
 const r=historicalFrontierClass({
  historicalClass:"BASE_CONFIRMED_MAJOR_REJECTED_AS_OF_T",
  laterMajorConfirmed:true
 });
 assert.equal(r.rewriteHistoricalClass,false);
});

t("DF12 missing semantic provenance remains unknown",()=>{
 const r=auditFrontierCandidate({...base,semanticSpaceValid:false});
 assert.equal(r.status,"UNKNOWN");
});

console.log(`SUMMARY ${pass}/12 PASS`);
