import assert from "node:assert/strict";
import {auditPatternFieldSet,minimalBasisAdmission} from "./pattern_minimal_continuous_basis_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("MB01 eligible count exact alias",()=>{
 const r=auditPatternFieldSet({eligibleBarsSinceBreak:5,observableBarsSinceBreak:3,constrainedBarsSinceBreak:2});
 assert.equal(r.findings[0].status,"DETERMINISTIC_ALIAS");
});

t("MB02 inconsistent eligible count is QA failure",()=>{
 const r=auditPatternFieldSet({eligibleBarsSinceBreak:6,observableBarsSinceBreak:3,constrainedBarsSinceBreak:2});
 assert.equal(r.status,"QA_FAIL");
});

t("MB03 parent center midpoint alias",()=>{
 const r=auditPatternFieldSet({parentLower:100,parentUpper:110,parentCenter:105});
 assert.equal(r.findings[0].rule,"D2");assert.equal(r.findings[0].status,"DETERMINISTIC_ALIAS");
});

t("MB04 wrong parent center is contradiction",()=>{
 const r=auditPatternFieldSet({parentLower:100,parentUpper:110,parentCenter:106});
 assert.equal(r.status,"QA_FAIL");
});

t("MB05 available air pct derives from geometry",()=>{
 const r=auditPatternFieldSet({parentLower:110,localUpper:100,availableAirToParentLowerPct:0.1});
 assert.equal(r.findings[0].status,"DETERMINISTIC_ALIAS");
});

t("MB06 ATR normalization is scale alternative",()=>{
 const r=auditPatternFieldSet({parentLower:110,localUpper:100,atr:5,availableAirToParentLowerATR:2});
 assert.equal(r.findings[0].status,"SCALE_ALTERNATIVE");
});

t("MB07 failure without reentry violates nested semantics",()=>{
 const r=auditPatternFieldSet({parentFirstFailureAt:"2026-09-25",parentFirstReentryAt:null});
 assert.equal(r.status,"QA_FAIL");
});

t("MB08 failure with same-day reentry is valid nested event",()=>{
 const r=auditPatternFieldSet({parentFirstFailureAt:"2026-09-25",parentFirstReentryAt:"2026-09-25"});
 assert.equal(r.status,"VALID");
});

t("MB09 lifecycle category under complete clocks is derived",()=>{
 const r=auditPatternFieldSet({compoundLifecycleState:"LOCAL_BREAK_PARENT_FAILED",completeClockBasis:true});
 assert.equal(r.findings[0].status,"DERIVED_REPRESENTATION");
});

t("MB10 derived availableAir is not independent vote",()=>{
 assert.equal(minimalBasisAdmission("availableAirToParentLowerPct").independentVoteEligible,false);
 assert.equal(minimalBasisAdmission("availableAirToParentLowerPct").role,"DERIVED_VIEW");
});

t("MB11 lifecycle is derived view not primitive",()=>{
 assert.equal(minimalBasisAdmission("compoundLifecycleState").role,"DERIVED_VIEW");
});

t("MB12 candidate primitive still gets no automatic vote",()=>{
 const r=minimalBasisAdmission("maxAdverseExcursion");
 assert.equal(r.role,"CANDIDATE_PRIMITIVE_OR_CONTEXT");
 assert.equal(r.independentVoteEligible,false);
});

console.log(`SUMMARY ${pass}/12 PASS`);
