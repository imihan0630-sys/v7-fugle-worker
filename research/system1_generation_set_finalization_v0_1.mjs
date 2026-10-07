import crypto from 'node:crypto';

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonicalize(value[k])]));
  }
  return value;
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

function canonicalGenerationRows(rows = []) {
  return [...rows].map(row => ({
    generationId: String(row.generationId),
    sessionDate: String(row.sessionDate),
    decisionAt: String(row.decisionAt),
    runtimeVersion: String(row.runtimeVersion),
    originKind: String(row.originKind),
    pathKind: String(row.pathKind),
    contentDigest: String(row.contentDigest),
    universeDigest: String(row.universeDigest),
    populationN: Number(row.populationN),
    integrityState: String(row.integrityState)
  })).sort((a,b) =>
    a.sessionDate.localeCompare(b.sessionDate) ||
    a.decisionAt.localeCompare(b.decisionAt) ||
    a.generationId.localeCompare(b.generationId)
  );
}

export function evaluateGenerationSetFinalization(input) {
  const inventory = input?.inventory || {};
  const producer = input?.producerState || {};
  const bindings = Array.isArray(input?.bindings) ? input.bindings : [];
  const finalized = input?.existingFinalization || null;
  const outcomeObservedAt = input?.outcomeObservedAt || null;
  const ruleFrozenAt = input?.ruleFrozenAt || null;

  if (finalized && input?.replacementAttempt === true) {
    return {ok:false, code:'REJECT_MUTABLE_FINALIZATION_HISTORY'};
  }
  if (ruleFrozenAt && outcomeObservedAt && new Date(ruleFrozenAt) > new Date(outcomeObservedAt)) {
    return {ok:false, code:'ADAPTIVE_FINALIZATION_RULE_REJECTED'};
  }
  if (producer.registryComplete !== true) {
    return {ok:false, code:'FINALIZATION_PRODUCER_SET_UNKNOWN'};
  }
  if (producer.windowsClosed !== true) {
    return {
      ok:false,
      code: bindings.length ? 'PARENT_VALID_SET_NOT_FINALIZED' : 'NOT_FINALIZED'
    };
  }
  if (producer.runningRefs?.length || producer.pendingRetryRefs?.length || producer.unresolvedRefs?.length) {
    return {ok:false, code:'REJECT_EARLY_FINALIZATION'};
  }
  if (inventory.snapshotMutableUntilSessionComplete === true && input?.finalizationRequested !== true) {
    return {ok:false, code:'GENERATION_SET_NOT_FINALIZED'};
  }
  if (inventory.truncated === true || inventory.integrityComplete !== true || inventory.modernOriginCoverageComplete !== true) {
    return {ok:false, code:'GENERATION_SET_NOT_FINALIZED'};
  }

  const rows = canonicalGenerationRows(inventory.generations || []);
  const ids = rows.map(r => r.generationId);
  const idSet = new Set(ids);
  for (const binding of bindings) {
    if (!idSet.has(String(binding.c1GenerationId))) {
      return {ok:false, code:'FINALIZATION_BINDING_SET_MISMATCH'};
    }
  }

  if (finalized) {
    const finalizedIds = new Set(finalized.generationIds || []);
    const late = ids.filter(id => !finalizedIds.has(id));
    if (late.length) {
      return {ok:false, code:'POST_FINALIZATION_GENERATION_VIOLATION', lateGenerationIds:late};
    }
  }

  const generationSetDigest = digest(rows);
  const originCounts = {};
  for (const row of rows) originCounts[row.originKind] = (originCounts[row.originKind] || 0) + 1;

  const receiptMaterial = {
    scanDate:String(input.scanDate),
    sessionIdentityHash:String(input.sessionIdentityHash),
    finalizationRuleVersion:String(input.finalizationRuleVersion),
    producerRegistryVersion:String(input.producerRegistryVersion),
    producerSetHash:String(input.producerSetHash),
    expectedProducerClasses:[...(input.expectedProducerClasses || [])].sort(),
    producerCutoffRuleHash:String(input.producerCutoffRuleHash),
    finalizedAt:String(input.finalizedAt),
    knowledgeCutoff:String(input.knowledgeCutoff),
    generationCount:rows.length,
    generationSetDigest,
    generationIds:ids,
    originCounts,
    pendingProducerRefs:[],
    failedProducerRefs:[...(producer.failedRefs || [])].sort(),
    unresolvedProducerRefs:[],
    postFinalizationViolationCount:0,
    superseded:false,
    historicalBackfillPerformed:false
  };

  return {
    ok:true,
    code:'FINALIZED_VERIFIED',
    receipt:{
      finalizationReceiptId:digest(receiptMaterial),
      ...receiptMaterial
    }
  };
}
