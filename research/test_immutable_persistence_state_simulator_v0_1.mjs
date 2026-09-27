import assert from "node:assert/strict";
import {
  putImmutable,
  stageChunk,
  assessFormalGenerationPublication,
  assessObserverPublication,
  isInferenceVisible,
} from "./immutable_persistence_state_simulator_v0_1.mjs";

const parents=new Map();

// 1. Partial 73/100 generation must not publish.
for(let i=0;i<73;i+=1){
  putImmutable(parents,{id:"P"+i,fingerprint:"F"+i,capturedAt:"FIRST"});
}
const partial=assessFormalGenerationPublication({
  expectedParentCount:100,
  expectedParentKeysetHash:"EXPECTED100",
  expectedDecisionSetHash:"DECISION100",
  observedParentCount:73,
  observedParentKeysetHash:"OBSERVED73",
  observedDecisionSetHash:"DECISION73",
});
assert.equal(partial.publishable,false);
assert.ok(partial.reasons.includes("PARENT_COUNT_MISMATCH"));
assert.equal(isInferenceVisible({
  finalGenerationReceiptExists:false,
  finalObserverRunReceiptExists:false,
}),false);

// 2. Retry same 73 rows must be exact no-op and preserve first timestamp.
const retry=stageChunk(parents,Array.from({length:73},(_,i)=>({
  id:"P"+i,fingerprint:"F"+i,capturedAt:"RETRY_SHOULD_NOT_REPLACE"
})));
assert.equal(retry.exact,73);
assert.equal(retry.inserted,0);
assert.equal(parents.get("P0").capturedAt,"FIRST");

// Complete missing 27.
stageChunk(parents,Array.from({length:27},(_,j)=>{
  const i=73+j;
  return {id:"P"+i,fingerprint:"F"+i,capturedAt:"FIRST"};
}));
assert.equal(parents.size,100);

const complete=assessFormalGenerationPublication({
  expectedParentCount:100,
  expectedParentKeysetHash:"HASH100",
  expectedDecisionSetHash:"DECISION100",
  observedParentCount:100,
  observedParentKeysetHash:"HASH100",
  observedDecisionSetHash:"DECISION100",
});
assert.equal(complete.publishable,true);

// 3. Same identity changed payload is conflict and blocks certification.
const conflict=putImmutable(parents,{id:"P20",fingerprint:"CHANGED"});
assert.equal(conflict.status,"PROVENANCE_CONFLICT");
const blockedConflict=assessFormalGenerationPublication({
  expectedParentCount:100,
  expectedParentKeysetHash:"HASH100",
  expectedDecisionSetHash:"DECISION100",
  observedParentCount:100,
  observedParentKeysetHash:"HASH100",
  observedDecisionSetHash:"DECISION100",
  provenanceConflictCount:1,
});
assert.equal(blockedConflict.publishable,false);

// 4. Same count but one substituted parent must not publish.
const wrongSet=assessFormalGenerationPublication({
  expectedParentCount:100,
  expectedParentKeysetHash:"HASH_EXPECTED",
  expectedDecisionSetHash:"DECISION_EXPECTED",
  observedParentCount:100,
  observedParentKeysetHash:"HASH_SUBSTITUTED",
  observedDecisionSetHash:"DECISION_SUBSTITUTED",
});
assert.equal(wrongSet.publishable,false);
assert.ok(wrongSet.reasons.includes("PARENT_KEYSET_HASH_MISMATCH"));

// 5. Formal complete but Technical observer partial must leave Formal visible,
// while Technical inference stays hidden.
assert.equal(isInferenceVisible({
  finalGenerationReceiptExists:true,
  finalObserverRunReceiptExists:false,
  requiresObserver:false,
}),true);
assert.equal(isInferenceVisible({
  finalGenerationReceiptExists:true,
  finalObserverRunReceiptExists:false,
  requiresObserver:true,
}),false);

const observerPartial=assessObserverPublication({
  expectedParentCount:100,
  attemptedParentCount:64,
  expectedParentKeysetHash:"HASH100",
  attemptedParentKeysetHash:"HASH64",
  missingCount:36,
});
assert.equal(observerPartial.publishable,false);

const observerComplete=assessObserverPublication({
  expectedParentCount:100,
  attemptedParentCount:100,
  expectedParentKeysetHash:"HASH100",
  attemptedParentKeysetHash:"HASH100",
});
assert.equal(observerComplete.publishable,true);

console.log(JSON.stringify({ok:true,persistence:"IMMUTABLE_PUBLICATION_SIMULATION_PASS"}));
