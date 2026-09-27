import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import {
  buildParentKeysetReceipt,
  buildDecisionSetHash,
  buildAttemptedParentKeysetHash,
} from "./parent_keyset_hash_v0_1.mjs";

const a="a".repeat(64),b="b".repeat(64),c="c".repeat(64),d="d".repeat(64);
const fa="1".repeat(64),fb="2".repeat(64),fc="3".repeat(64);

const base={
  scanDate:"2026-09-29",
  captureGeneration:"G1_123e4567-e89b-42d3-a456-426614174000",
  parentScopeId:"FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1",
};

const one=await buildParentKeysetReceipt({...base,parentIds:[c,a,b],expectedParentCount:3},webcrypto);
const two=await buildParentKeysetReceipt({...base,parentIds:[b,c,a],expectedParentCount:3},webcrypto);
assert.equal(one.status,"COMPLETE");
assert.equal(one.certifiedParentKeysetHash,two.certifiedParentKeysetHash);

const partial=await buildParentKeysetReceipt({...base,parentIds:[a,b],expectedParentCount:3},webcrypto);
assert.equal(partial.status,"INCOMPLETE");
assert.equal(partial.certifiedParentKeysetHash,null);

const substituted=await buildParentKeysetReceipt({...base,parentIds:[a,b,d],expectedParentCount:3},webcrypto);
assert.equal(substituted.status,"COMPLETE");
assert.notEqual(substituted.certifiedParentKeysetHash,one.certifiedParentKeysetHash);

await assert.rejects(
  ()=>buildParentKeysetReceipt({...base,parentIds:[a,a,b],expectedParentCount:3},webcrypto),
  /DUPLICATE_PARENT_ID/
);

const ds1=await buildDecisionSetHash({
  ...base,
  parents:[
    {parentDecisionReceiptId:a,semanticFingerprint:fa},
    {parentDecisionReceiptId:b,semanticFingerprint:fb},
    {parentDecisionReceiptId:c,semanticFingerprint:fc},
  ]
},webcrypto);
const ds2=await buildDecisionSetHash({
  ...base,
  parents:[
    {parentDecisionReceiptId:c,semanticFingerprint:fc},
    {parentDecisionReceiptId:a,semanticFingerprint:fa},
    {parentDecisionReceiptId:b,semanticFingerprint:fb},
  ]
},webcrypto);
assert.equal(ds1,ds2);

const dsChanged=await buildDecisionSetHash({
  ...base,
  parents:[
    {parentDecisionReceiptId:a,semanticFingerprint:fa},
    {parentDecisionReceiptId:b,semanticFingerprint:"4".repeat(64)},
    {parentDecisionReceiptId:c,semanticFingerprint:fc},
  ]
},webcrypto);
assert.notEqual(dsChanged,ds1);

const attempts=await buildAttemptedParentKeysetHash({
  ...base,
  expectedParentCount:3,
  rootRows:[
    {parentDecisionReceiptId:c,evidenceItemKey:"ROOT"},
    {parentDecisionReceiptId:a,evidenceItemKey:"ROOT"},
    {parentDecisionReceiptId:b,evidenceItemKey:"ROOT"},
  ]
},webcrypto);
assert.equal(attempts.keysetCountComplete,true);
assert.equal(attempts.attemptedParentKeysetHash,one.certifiedParentKeysetHash);

await assert.rejects(
  ()=>buildAttemptedParentKeysetHash({
    ...base,expectedParentCount:1,
    rootRows:[{parentDecisionReceiptId:a,evidenceItemKey:"EPISODE:X"}]
  },webcrypto),
  /NON_ROOT_ROW_IN_ATTEMPT_KEYSET/
);

console.log(JSON.stringify({ok:true,keyset:"PARENT_KEYSET_HASH_PASS"}));
