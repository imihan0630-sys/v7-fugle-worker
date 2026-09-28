import {
  hashCanonicalReceipt,
} from "./canonical_receipt_hash_v0_1.mjs";

function assertText(value, field) {
  const text=String(value??"").trim();
  if (!text) throw new Error("MISSING_" + field);
  return text;
}

function normalizeParents(parents) {
  if (!Array.isArray(parents)) throw new Error("PARENTS_ARRAY_REQUIRED");
  const rows=parents.map((row,index)=>({
    parentDecisionReceiptId:assertText(row?.parentDecisionReceiptId,"parentDecisionReceiptId@" + index),
    semanticFingerprint:assertText(row?.semanticFingerprint,"semanticFingerprint@" + index),
  }));
  rows.sort((a,b)=>a.parentDecisionReceiptId.localeCompare(b.parentDecisionReceiptId));
  for(let i=1;i<rows.length;i+=1){
    if(rows[i-1].parentDecisionReceiptId===rows[i].parentDecisionReceiptId){
      throw new Error("DUPLICATE_PARENT_ID:" + rows[i].parentDecisionReceiptId);
    }
  }
  return rows;
}

export function canonicalParentKeyset(parents) {
  return Object.freeze(normalizeParents(parents).map(row=>row.parentDecisionReceiptId));
}

export function canonicalDecisionSet(parents) {
  return Object.freeze(normalizeParents(parents).map(row=>Object.freeze({
    parentDecisionReceiptId:row.parentDecisionReceiptId,
    semanticFingerprint:row.semanticFingerprint,
  })));
}

export async function hashParentKeyset(parents, cryptoImpl=globalThis.crypto) {
  return hashCanonicalReceipt(canonicalParentKeyset(parents),"PARENT_KEYSET",cryptoImpl);
}

export async function hashDecisionSet(parents, cryptoImpl=globalThis.crypto) {
  return hashCanonicalReceipt(canonicalDecisionSet(parents),"DECISION_SET",cryptoImpl);
}

export async function buildDecisionGenerationHashes(parents, cryptoImpl=globalThis.crypto) {
  const [parentKeysetHash,decisionSetHash]=await Promise.all([
    hashParentKeyset(parents,cryptoImpl),
    hashDecisionSet(parents,cryptoImpl),
  ]);
  return Object.freeze({
    parentCount:parents.length,
    parentKeysetHash,
    decisionSetHash,
  });
}
