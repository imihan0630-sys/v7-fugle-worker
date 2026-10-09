import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const d=JSON.parse(readFileSync(
 new URL("../SYSTEM2_SHADOW_15_CRITICAL_GATE_LEDGER_V0_1.json",import.meta.url),"utf8"
));
const q=d.quantifiedProgress;
assert.equal(q.schemaVersion,"S2_SHADOW_15_GATE_CHECKPOINT_COUNTS_V0_1");
assert.equal(d.gates.length,15);
assert.equal(q.totalChecks,75);
assert.equal(q.fullyAcceptedGates,d.passedGateCount);
let passed=0;
const used=new Set();
for(const g of d.gates){
 assert.equal(g.checks.length,5,g.id);
 let sub=0;
 for(const [i,c] of g.checks.entries()){
  assert.equal(c.checkId,g.id+"-C"+(i+1));
  assert.ok(!used.has(c.checkId));used.add(c.checkId);
  assert.ok(typeof c.criterion==="string" && c.criterion.trim().length>=5);
  assert.equal(typeof c.checkPassed,"boolean");
  if(c.checkPassed){
   sub++;assert.ok(/^https:\/\/github\.com\/imihan0630-sys\/v7-fugle-worker\/(pull\/\d+|blob\/main\/[\w.\/\-]+)$/.test(c.evidenceRef),
    "passed checkpoint requires concrete same-repo evidence "+c.checkId);
  }else assert.equal(c.evidenceRef,null,"unverified step must not have fake proof");
 }
 assert.equal(g.quantified.checksTotal,5);
 assert.equal(g.quantified.checksPassed,sub,g.id);
 assert.equal(g.quantified.checksRemaining,5-sub);
 assert.equal(g.quantified.progressPercent,sub*20);
 if(g.verified===true) assert.equal(sub,5,"fully approved gate cannot have missing subtasks");
 passed+=sub;
}
assert.equal(q.passedChecks,passed);
assert.equal(q.remainingChecks,75-passed);
assert.equal(q.progressPercent,Math.round(passed/75*1000)/10);
assert.equal(d.passedGateCount,d.gates.filter(g=>g.verified).length);
assert.equal(q.fullyAcceptedGates,0);
assert.equal(q.pendingPhysicalReadback,true);
// Totals MUST be derived from the 75 evidence-backed check states. New
// independently proven checks can increment without modifying CI source.
assert.ok(Number.isInteger(q.passedChecks) && q.passedChecks>=0 && q.passedChecks<=75);
assert.ok(Number.isInteger(q.remainingChecks) && q.remainingChecks>=0 && q.remainingChecks<=75);
console.log("System2 15-gate quantified 75-point evidence rollup PASS: "+passed+"/75 checks, 0/15 final gates");
