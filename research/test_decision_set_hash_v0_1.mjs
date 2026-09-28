import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import {
  canonicalParentKeyset,
  canonicalDecisionSet,
  hashParentKeyset,
  hashDecisionSet,
  buildDecisionGenerationHashes,
} from "./decision_set_hash_v0_1.mjs";

const A={parentDecisionReceiptId:"P_A",semanticFingerprint:"F_A"};
const B={parentDecisionReceiptId:"P_B",semanticFingerprint:"F_B"};
const C={parentDecisionReceiptId:"P_C",semanticFingerprint:"F_C"};

assert.deepEqual(canonicalParentKeyset([C,A,B]),["P_A","P_B","P_C"]);
assert.deepEqual(canonicalDecisionSet([C,A,B]),[
  {parentDecisionReceiptId:"P_A",semanticFingerprint:"F_A"},
  {parentDecisionReceiptId:"P_B",semanticFingerprint:"F_B"},
  {parentDecisionReceiptId:"P_C",semanticFingerprint:"F_C"},
]);

const key1=await hashParentKeyset([A,B,C],webcrypto);
const key2=await hashParentKeyset([C,A,B],webcrypto);
assert.equal(key1,key2);

const dec1=await hashDecisionSet([A,B,C],webcrypto);
const dec2=await hashDecisionSet([C,A,B],webcrypto);
assert.equal(dec1,dec2);

// Same count, one substituted parent => keyset and decision hashes both change.
const substituted={parentDecisionReceiptId:"P_X",semanticFingerprint:"F_X"};
assert.notEqual(await hashParentKeyset([A,B,substituted],webcrypto),key1);
assert.notEqual(await hashDecisionSet([A,B,substituted],webcrypto),dec1);

// Same parent keyset, one changed decision payload => keyset stable, decision hash changes.
const Bchanged={parentDecisionReceiptId:"P_B",semanticFingerprint:"F_B_CHANGED"};
assert.equal(await hashParentKeyset([A,Bchanged,C],webcrypto),key1);
assert.notEqual(await hashDecisionSet([A,Bchanged,C],webcrypto),dec1);

assert.throws(()=>canonicalParentKeyset([A,A]),/DUPLICATE_PARENT_ID/);

const summary=await buildDecisionGenerationHashes([C,A,B],webcrypto);
assert.equal(summary.parentCount,3);
assert.equal(summary.parentKeysetHash,key1);
assert.equal(summary.decisionSetHash,dec1);
assert.match(summary.parentKeysetHash,/^[0-9a-f]{64}$/);
assert.match(summary.decisionSetHash,/^[0-9a-f]{64}$/);

console.log(JSON.stringify({ok:true,parentKeysetHash:key1,decisionSetHash:dec1}));
