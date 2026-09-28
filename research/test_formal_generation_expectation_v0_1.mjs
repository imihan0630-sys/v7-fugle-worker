import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { buildScanPopulationReceipt } from "./scan_population_receipt_v0_1.mjs";
import { buildFormalGenerationExpectation, assessFullGenerationPublication } from "./formal_generation_expectation_v0_1.mjs";
import { buildSelectedPlanReceipts } from "./selected_plan_set_hash_v0_1.mjs";

const rows=[
  {symbol:"1101",market:"TWSE"},
  {symbol:"2330",market:"TWSE"},
  {symbol:"3105",market:"TPEx"},
];
const admission={
  "1101":{usable:true,status:"VALID_EXACT_SESSIONS",reason:null},
  "2330":{usable:true,status:"VALID_EXACT_SESSIONS",reason:null},
  "3105":{usable:false,status:"DATA_INCOMPLETE",reason:"INSUFFICIENT_PRIOR_BARS"},
};
const population=await buildScanPopulationReceipt({
  scanDate:"2026-09-29",
  captureGeneration:"G1_abc",
  populationSchemaVersion:"SCAN_POPULATION_V1",
  normalizationVersion:"NORMALIZE_V1",
  sourceConfigFingerprint:"SRC_FP",
  normalizedRows:rows,
  historyAdmissionBySymbol:admission,
  featureReadySymbols:new Set(["1101","2330"]),
},webcrypto);

const lineage={
  scanDate:"2026-09-29",
  captureGeneration:"G1_abc",
  decisionCutoffAt:"2026-09-29T08:00:00.000Z",
  formalWorkerVersion:"8.13.0",
  selectionRuleVersion:"FORMAL_RULE_V1",
  rankComparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
  parentSchemaVersion:"immutable-decision-state-parent-v0.2",
};

const parents=[
  {...lineage,symbol:"1101",parentDecisionReceiptId:"P1101",semanticFingerprint:"F1101"},
  {...lineage,symbol:"2330",parentDecisionReceiptId:"P2330",semanticFingerprint:"F2330"},
];

const selectedPlans=await buildSelectedPlanReceipts([],webcrypto);
const exp=await buildFormalGenerationExpectation({
  populationReceipt:population,
  parents,
  expectedLineage:lineage,
  selectedPlanReceipts:selectedPlans,
},webcrypto);
assert.equal(exp.valid,true);
assert.equal(exp.expectedParentCount,2);

const observed={
  normalizedCount:exp.normalizedCount,
  historyAdmittedCount:exp.historyAdmittedCount,
  historyBlockedCount:exp.historyBlockedCount,
  historyUnknownCount:exp.historyUnknownCount,
  normalizedMarketKeysetHash:exp.normalizedMarketKeysetHash,
  historyAdmittedKeysetHash:exp.historyAdmittedKeysetHash,
  historyBlockedKeysetHash:exp.historyBlockedKeysetHash,
  historyUnknownKeysetHash:exp.historyUnknownKeysetHash,
  featureReadyKeysetHash:exp.featureReadyKeysetHash,
  parentCount:exp.expectedParentCount,
  parentKeysetHash:exp.parentKeysetHash,
  decisionSetHash:exp.decisionSetHash,
  selectedPlanSetHash:exp.selectedPlanSetHash,
};
assert.equal(assessFullGenerationPublication({expectation:exp,observed}).publishable,true);

// Same counts but wrong normalized population hash.
assert.equal(assessFullGenerationPublication({
  expectation:exp,
  observed:{...observed,normalizedMarketKeysetHash:"WRONG"},
}).publishable,false);

// Parent count and feature-ready relationship mismatch before publication.
const missingParentExp=await buildFormalGenerationExpectation({
  populationReceipt:population,
  parents:[parents[0]],
  expectedLineage:lineage,
  selectedPlanReceipts:selectedPlans,
},webcrypto);
assert.equal(missingParentExp.valid,false);
assert.ok(missingParentExp.reasons.includes("PARENT_SYMBOL_SET_DIFFERS_FROM_FEATURE_READY_KEYSET"));

// Same parent set, changed semantic fingerprint changes decision-set hash.
const changedDecisionExp=await buildFormalGenerationExpectation({
  populationReceipt:population,
  parents:[parents[0],{...parents[1],semanticFingerprint:"F2330_CHANGED"}],
  expectedLineage:lineage,
  selectedPlanReceipts:selectedPlans,
},webcrypto);
assert.equal(changedDecisionExp.valid,true);
assert.notEqual(changedDecisionExp.parentKeysetHash,undefined);
assert.equal(changedDecisionExp.parentKeysetHash,exp.parentKeysetHash);
assert.notEqual(changedDecisionExp.decisionSetHash,exp.decisionSetHash);

// Same count, substituted parent fails population relation.
const substitutedExp=await buildFormalGenerationExpectation({
  populationReceipt:population,
  parents:[parents[0],{...parents[1],symbol:"9999",parentDecisionReceiptId:"P9999",semanticFingerprint:"F9999"}],
  expectedLineage:lineage,
  selectedPlanReceipts:selectedPlans,
},webcrypto);
assert.equal(substitutedExp.valid,false);

// Provenance conflict blocks publication even when hashes/counts match.
assert.equal(assessFullGenerationPublication({
  expectation:exp,
  observed,
  provenanceConflictCount:1,
}).publishable,false);

// Selected parent without matching selected plan receipt invalidates expectation.
const selectedParent={
  ...parents[0],
  selectedFlag:true,
  formalState:"SELECTED",
};
const selectedMismatch=await buildFormalGenerationExpectation({
  populationReceipt:{
    ...population,
    entries:[
      {symbol:"1101",parentExpected:true},
      {symbol:"2330",parentExpected:true},
    ],
    featureReadyParentExpectedCount:2,
  },
  parents:[selectedParent,parents[1]],
  expectedLineage:lineage,
  selectedPlanReceipts:selectedPlans,
},webcrypto);
assert.equal(selectedMismatch.valid,false);
assert.ok(selectedMismatch.reasons.includes("SELECTED_PLAN_COUNT_MISMATCH"));

console.log(JSON.stringify({ok:true,status:"FULL_GENERATION_EXPECTATION_PASS"}));
