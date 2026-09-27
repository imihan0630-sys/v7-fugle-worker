import { hashCanonicalReceipt } from "./canonical_receipt_hash_v0_1.mjs";

const PARENT_ID_RE=/^[0-9a-f]{64}$/;
const FINGERPRINT_RE=/^[0-9a-f]{64}$/;

function uniqueSortedParentIds(ids) {
  const list=(Array.isArray(ids)?ids:[]).map(x=>String(x??"").trim());
  for (const id of list) if (!PARENT_ID_RE.test(id)) throw new Error("MALFORMED_PARENT_ID");
  const unique=new Set(list);
  if (unique.size!==list.length) throw new Error("DUPLICATE_PARENT_ID");
  return [...unique].sort();
}

function basePayload({scanDate,captureGeneration,parentScopeId},parentIds) {
  const date=String(scanDate??"").trim();
  const generation=String(captureGeneration??"").trim();
  const scope=String(parentScopeId??"").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("INVALID_SCAN_DATE");
  if (!generation) throw new Error("MISSING_CAPTURE_GENERATION");
  if (!scope) throw new Error("MISSING_PARENT_SCOPE_ID");
  return {scanDate:date,captureGeneration:generation,parentScopeId:scope,parentIds};
}

export async function buildParentKeysetReceipt(input,cryptoImpl=globalThis.crypto) {
  const parentIds=uniqueSortedParentIds(input?.parentIds);
  const expected=Number(input?.expectedParentCount);
  if (!Number.isInteger(expected) || expected<0) throw new Error("INVALID_EXPECTED_PARENT_COUNT");

  const payload=basePayload(input,parentIds);
  const observedParentKeysetHash=await hashCanonicalReceipt(payload,"PARENT_KEYSET",cryptoImpl);
  const complete=parentIds.length===expected;

  return Object.freeze({
    ...payload,
    expectedParentCount:expected,
    observedParentCount:parentIds.length,
    status:complete?"COMPLETE":"INCOMPLETE",
    observedParentKeysetHash,
    certifiedParentKeysetHash:complete?observedParentKeysetHash:null,
    researchOnly:true,
    decisionImpact:false,
  });
}

export async function buildDecisionSetHash({
  scanDate,captureGeneration,parentScopeId,parents
},cryptoImpl=globalThis.crypto) {
  const rows=(Array.isArray(parents)?parents:[]).map(row=>({
    parentDecisionReceiptId:String(row?.parentDecisionReceiptId??"").trim(),
    semanticFingerprint:String(row?.semanticFingerprint??"").trim(),
  }));
  const ids=uniqueSortedParentIds(rows.map(x=>x.parentDecisionReceiptId));
  const byId=new Map(rows.map(x=>[x.parentDecisionReceiptId,x]));
  const decisions=ids.map(id=>{
    const row=byId.get(id);
    if (!FINGERPRINT_RE.test(row.semanticFingerprint)) throw new Error("MALFORMED_SEMANTIC_FINGERPRINT");
    return row;
  });
  const payload={
    scanDate:String(scanDate??"").trim(),
    captureGeneration:String(captureGeneration??"").trim(),
    parentScopeId:String(parentScopeId??"").trim(),
    decisions,
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.scanDate)) throw new Error("INVALID_SCAN_DATE");
  if (!payload.captureGeneration) throw new Error("MISSING_CAPTURE_GENERATION");
  if (!payload.parentScopeId) throw new Error("MISSING_PARENT_SCOPE_ID");
  return hashCanonicalReceipt(payload,"DECISION_SET",cryptoImpl);
}

export async function buildAttemptedParentKeysetHash(input,cryptoImpl=globalThis.crypto) {
  const roots=(Array.isArray(input?.rootRows)?input.rootRows:[]);
  const ids=roots.map(row=>{
    if (String(row?.evidenceItemKey??"")!=="ROOT") throw new Error("NON_ROOT_ROW_IN_ATTEMPT_KEYSET");
    return row?.parentDecisionReceiptId;
  });
  const receipt=await buildParentKeysetReceipt({
    scanDate:input.scanDate,
    captureGeneration:input.captureGeneration,
    parentScopeId:input.parentScopeId,
    parentIds:ids,
    expectedParentCount:Number(input.expectedParentCount),
  },cryptoImpl);
  return Object.freeze({
    attemptedParentCount:receipt.observedParentCount,
    attemptedParentKeysetHash:receipt.observedParentKeysetHash,
    keysetCountComplete:receipt.status==="COMPLETE",
  });
}
