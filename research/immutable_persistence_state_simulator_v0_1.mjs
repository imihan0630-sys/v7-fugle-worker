// Research-only immutable persistence state-machine simulator.
// No database calls. No market calls.

export function putImmutable(store, row) {
  if (!(store instanceof Map)) throw new Error("MAP_STORE_REQUIRED");
  const id=String(row?.id??"").trim();
  const fingerprint=String(row?.fingerprint??"").trim();
  if (!id) throw new Error("MISSING_ID");
  if (!fingerprint) throw new Error("MISSING_FINGERPRINT");
  const existing=store.get(id);
  if (!existing) {
    const frozen=Object.freeze({...row,id,fingerprint});
    store.set(id,frozen);
    return Object.freeze({status:"INSERTED",row:frozen});
  }
  if (existing.fingerprint===fingerprint) {
    return Object.freeze({status:"EXACT_DUPLICATE_NO_OP",row:existing});
  }
  return Object.freeze({
    status:"PROVENANCE_CONFLICT",
    existingFingerprint:existing.fingerprint,
    incomingFingerprint:fingerprint,
  });
}

export function stageChunk(store, rows) {
  const results=[];
  let conflicts=0,inserted=0,exact=0;
  for (const row of Array.isArray(rows)?rows:[]) {
    const result=putImmutable(store,row);
    results.push(result);
    if (result.status==="PROVENANCE_CONFLICT") conflicts+=1;
    else if (result.status==="INSERTED") inserted+=1;
    else if (result.status==="EXACT_DUPLICATE_NO_OP") exact+=1;
  }
  return Object.freeze({inserted,exact,conflicts,results:Object.freeze(results)});
}

export function assessFormalGenerationPublication({
  expectedParentCount,
  expectedParentKeysetHash,
  expectedDecisionSetHash,
  observedParentCount,
  observedParentKeysetHash,
  observedDecisionSetHash,
  provenanceConflictCount=0,
  scopeQaValid=true,
}) {
  const reasons=[];
  if (!scopeQaValid) reasons.push("SCOPE_QA_FAIL");
  if (Number(observedParentCount)!==Number(expectedParentCount)) reasons.push("PARENT_COUNT_MISMATCH");
  if (observedParentKeysetHash!==expectedParentKeysetHash) reasons.push("PARENT_KEYSET_HASH_MISMATCH");
  if (observedDecisionSetHash!==expectedDecisionSetHash) reasons.push("DECISION_SET_HASH_MISMATCH");
  if (Number(provenanceConflictCount)!==0) reasons.push("PROVENANCE_CONFLICT");
  return Object.freeze({
    publishable:reasons.length===0,
    status:reasons.length===0?"CERTIFIABLE":"UNPUBLISHED",
    reasons:Object.freeze(reasons),
  });
}

export function assessObserverPublication({
  expectedParentCount,
  attemptedParentCount,
  expectedParentKeysetHash,
  attemptedParentKeysetHash,
  missingCount=0,
  provenanceConflictCount=0,
  qaFailureCount=0,
  duplicateRootCount=0,
}) {
  const reasons=[];
  if (Number(attemptedParentCount)!==Number(expectedParentCount)) reasons.push("ATTEMPT_COUNT_MISMATCH");
  if (attemptedParentKeysetHash!==expectedParentKeysetHash) reasons.push("ROOT_KEYSET_HASH_MISMATCH");
  if (Number(missingCount)!==0) reasons.push("MISSING_PARENT_ATTEMPT");
  if (Number(provenanceConflictCount)!==0) reasons.push("PROVENANCE_CONFLICT");
  if (Number(qaFailureCount)!==0) reasons.push("QA_FAILURE");
  if (Number(duplicateRootCount)!==0) reasons.push("DUPLICATE_ROOT");
  return Object.freeze({
    publishable:reasons.length===0,
    status:reasons.length===0?"COMPLETE_RECEIPT_ELIGIBLE":"UNPUBLISHED",
    reasons:Object.freeze(reasons),
  });
}

export function isInferenceVisible({
  finalGenerationReceiptExists,
  finalObserverRunReceiptExists,
  requiresObserver=true,
}) {
  if (!finalGenerationReceiptExists) return false;
  if (requiresObserver && !finalObserverRunReceiptExists) return false;
  return true;
}
