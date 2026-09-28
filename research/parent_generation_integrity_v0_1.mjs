function assertText(value, field) {
  const text=String(value??"").trim();
  if (!text) throw new Error("MISSING_" + field);
  return text;
}

export const PARENT_SCOPE_CONTRACT = Object.freeze({
  parentScopeId:"FORMAL_HISTORY_ADMITTED_DECISION_PATH_V1",
  definition:"All history-admitted feature rows evaluated by the same-scan Formal decision path.",
  upstreamBlockedLocation:"SCAN_POPULATION_RECEIPT",
  selectedOnly:false,
});

const COHERENT_FIELDS=Object.freeze([
  "scanDate",
  "captureGeneration",
  "decisionCutoffAt",
  "formalWorkerVersion",
  "selectionRuleVersion",
  "rankComparatorVersion",
  "parentSchemaVersion",
]);

export function assessParentGenerationCoherence(parents, expected={}) {
  if (!Array.isArray(parents)) throw new Error("PARENTS_ARRAY_REQUIRED");
  const reasons=[];
  if (parents.length===0) reasons.push("EMPTY_PARENT_SET");

  const seenSymbols=new Set();
  const first=parents[0]||{};

  for (let i=0;i<parents.length;i+=1) {
    const row=parents[i]||{};
    const symbol=assertText(row.symbol,"symbol@" + i);
    if (seenSymbols.has(symbol)) reasons.push("DUPLICATE_SYMBOL:" + symbol);
    seenSymbols.add(symbol);

    for (const field of COHERENT_FIELDS) {
      const value=assertText(row[field],field + "@" + i);
      if (i>0 && value!==String(first[field])) reasons.push("MIXED_" + field);
      if (expected[field]!==undefined && value!==String(expected[field])) {
        reasons.push("EXPECTED_MISMATCH_" + field);
      }
    }
  }

  const parentScopeId=String(expected.parentScopeId??PARENT_SCOPE_CONTRACT.parentScopeId);
  if (parentScopeId!==PARENT_SCOPE_CONTRACT.parentScopeId) {
    reasons.push("UNSUPPORTED_PARENT_SCOPE_ID");
  }

  const uniqueReasons=[...new Set(reasons)];
  return Object.freeze({
    valid:uniqueReasons.length===0,
    status:uniqueReasons.length===0?"COHERENT":"INVALID_GENERATION_SET",
    parentScopeId:PARENT_SCOPE_CONTRACT.parentScopeId,
    parentCount:parents.length,
    uniqueSymbolCount:seenSymbols.size,
    coherentFields:COHERENT_FIELDS,
    reasons:Object.freeze(uniqueReasons),
  });
}
