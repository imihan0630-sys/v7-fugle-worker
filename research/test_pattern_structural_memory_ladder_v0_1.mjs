import assert from "node:assert/strict";
import {auditStructuralMemoryLadder,validateGateOrder} from "./pattern_structural_memory_ladder_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const allPassed=Object.fromEntries(Array.from({length:10},(_,i)=>[`G${i}`,"PASSED"]));

t("ML01 unresolved G0 blocks everything",()=>{
 const r=auditStructuralMemoryLadder({});
 assert.equal(r.earliestUnresolvedGate,"G0");
});

t("ML02 first unresolved gate is returned",()=>{
 const s={...allPassed,G4:"UNRESOLVED",G5:"UNRESOLVED",G6:"UNRESOLVED",G7:"UNRESOLVED",G8:"UNRESOLVED",G9:"UNRESOLVED"};
 const r=auditStructuralMemoryLadder(s);
 assert.equal(r.earliestUnresolvedGate,"G4");
});

t("ML03 failed G3 stops ladder",()=>{
 const r=auditStructuralMemoryLadder({...allPassed,G3:"FAILED"});
 assert.equal(r.status,"FALSIFIED_AT_GATE");
 assert.equal(r.failedGate,"G3");
});

t("ML04 later passes cannot override earlier failure",()=>{
 const r=auditStructuralMemoryLadder({...allPassed,G2:"FAILED",G3:"PASSED",G4:"PASSED"});
 assert.equal(r.failedGate,"G2");
});

t("ML05 all gates pass only candidate label",()=>{
 const r=auditStructuralMemoryLadder(allPassed);
 assert.equal(r.status,"ALL_GATES_PASSED");
 assert.equal(r.maximumInterpretation,"STRUCTURAL_SPECIFIC_REPRESENTATION_INCREMENTALITY_CANDIDATE");
});

t("ML06 all gates still no causal proof",()=>{
 const r=auditStructuralMemoryLadder(allPassed);
 assert.equal(r.causalMemoryProofAuthorized,false);
});

t("ML07 all gates still no Formal authorization",()=>{
 const r=auditStructuralMemoryLadder(allPassed);
 assert.equal(r.formalOptimizationAuthorized,false);
});

t("ML08 ordered gate report valid",()=>{
 assert.equal(validateGateOrder(["G0","G1","G2","G5","G9"]).status,"VALID");
});

t("ML09 reversed gate order QA fails",()=>{
 assert.equal(validateGateOrder(["G0","G4","G3"]).reason,"GATE_ORDER_REVERSED");
});

t("ML10 unknown gate QA fails",()=>{
 assert.equal(validateGateOrder(["G0","GX"]).reason,"UNKNOWN_GATE");
});

console.log(`SUMMARY ${pass}/10 PASS`);
