import {
  assessParentGenerationCoherence,
  PARENT_SCOPE_CONTRACT,
} from "./parent_generation_integrity_v0_1.mjs";
import {
  buildDecisionGenerationHashes,
} from "./decision_set_hash_v0_1.mjs";

function sortedUniqueSymbolsFromParents(parents) {
  const symbols=parents.map(row=>String(row?.symbol??"").trim()).sort();
  if (symbols.some(x=>!x)) throw new Error("MISSING_PARENT_SYMBOL");
  for(let i=1;i<symbols.length;i+=1) {
    if(symbols[i]===symbols[i-1]) throw new Error("DUPLICATE_PARENT_SYMBOL:" + symbols[i]);
  }
  return symbols;
}

function sortedExpectedParentSymbols(populationReceipt) {
  if (!populationReceipt?.valid) throw new Error("INVALID_SCAN_POPULATION_RECEIPT");
  return populationReceipt.entries
    .filter(row=>row.parentExpected===true)
    .map(row=>String(row.symbol))
    .sort();
}

function arraysEqual(a,b) {
  return a.length===b.length && a.every((x,i)=>x===b[i]);
}

export async function buildFormalGenerationExpectation({
  populationReceipt,
  parents,
  expectedLineage,
  selectedPlanSetHash=null,
}, cryptoImpl=globalThis.crypto) {
  const coherence=assessParentGenerationCoherence(parents,{
    ...expectedLineage,
    parentScopeId:PARENT_SCOPE_CONTRACT.parentScopeId,
  });

  const expectedParentSymbols=sortedExpectedParentSymbols(populationReceipt);
  const actualParentSymbols=sortedUniqueSymbolsFromParents(parents);
  const parentPopulationMatch=arraysEqual(expectedParentSymbols,actualParentSymbols);

  const generationHashes=await buildDecisionGenerationHashes(parents,cryptoImpl);

  const reasons=[...coherence.reasons];
  if (!parentPopulationMatch) reasons.push("PARENT_SYMBOL_SET_DIFFERS_FROM_FEATURE_READY_KEYSET");
  if (generationHashes.parentCount!==populationReceipt.featureReadyParentExpectedCount) {
    reasons.push("PARENT_COUNT_DIFFERS_FROM_FEATURE_READY_COUNT");
  }

  const uniqueReasons=[...new Set(reasons)];

  return Object.freeze({
    valid:uniqueReasons.length===0,
    status:uniqueReasons.length===0?"EXPECTATION_READY":"EXPECTATION_INVALID",
    reasons:Object.freeze(uniqueReasons),
    parentScopeId:PARENT_SCOPE_CONTRACT.parentScopeId,
    scanPopulationReceiptId:populationReceipt.scanPopulationReceiptId,
    normalizedCount:populationReceipt.normalizedCount,
    historyAdmittedCount:populationReceipt.historyAdmittedCount,
    historyBlockedCount:populationReceipt.historyBlockedCount,
    historyUnknownCount:populationReceipt.historyUnknownCount,
    normalizedMarketKeysetHash:populationReceipt.normalizedMarketKeysetHash,
    historyAdmittedKeysetHash:populationReceipt.historyAdmittedKeysetHash,
    historyBlockedKeysetHash:populationReceipt.historyBlockedKeysetHash,
    historyUnknownKeysetHash:populationReceipt.historyUnknownKeysetHash,
    featureReadyKeysetHash:populationReceipt.featureReadyKeysetHash,
    expectedParentCount:generationHashes.parentCount,
    parentKeysetHash:generationHashes.parentKeysetHash,
    decisionSetHash:generationHashes.decisionSetHash,
    selectedPlanSetHash:selectedPlanSetHash===null?null:String(selectedPlanSetHash),
    coherence,
  });
}

export function assessFullGenerationPublication({
  expectation,
  observed,
  provenanceConflictCount=0,
}) {
  const reasons=[];
  if (!expectation?.valid) reasons.push("INVALID_EXPECTATION");
  if (Number(observed?.normalizedCount)!==Number(expectation?.normalizedCount)) reasons.push("NORMALIZED_COUNT_MISMATCH");
  if (Number(observed?.historyAdmittedCount)!==Number(expectation?.historyAdmittedCount)) reasons.push("HISTORY_ADMITTED_COUNT_MISMATCH");
  if (Number(observed?.historyBlockedCount)!==Number(expectation?.historyBlockedCount)) reasons.push("HISTORY_BLOCKED_COUNT_MISMATCH");
  if (Number(observed?.historyUnknownCount)!==Number(expectation?.historyUnknownCount)) reasons.push("HISTORY_UNKNOWN_COUNT_MISMATCH");

  const hashFields=[
    "normalizedMarketKeysetHash",
    "historyAdmittedKeysetHash",
    "historyBlockedKeysetHash",
    "historyUnknownKeysetHash",
    "featureReadyKeysetHash",
    "parentKeysetHash",
    "decisionSetHash",
  ];
  for(const field of hashFields) {
    if (observed?.[field]!==expectation?.[field]) reasons.push(field.toUpperCase()+"_MISMATCH");
  }

  if (Number(observed?.parentCount)!==Number(expectation?.expectedParentCount)) reasons.push("PARENT_COUNT_MISMATCH");
  if (Number(provenanceConflictCount)!==0) reasons.push("PROVENANCE_CONFLICT");

  if (expectation?.selectedPlanSetHash!==null &&
      observed?.selectedPlanSetHash!==expectation.selectedPlanSetHash) {
    reasons.push("SELECTED_PLAN_SET_HASH_MISMATCH");
  }

  const uniqueReasons=[...new Set(reasons)];
  return Object.freeze({
    publishable:uniqueReasons.length===0,
    status:uniqueReasons.length===0?"CERTIFIABLE":"UNPUBLISHED",
    reasons:Object.freeze(uniqueReasons),
  });
}
