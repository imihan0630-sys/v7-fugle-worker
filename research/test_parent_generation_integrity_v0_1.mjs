import assert from "node:assert/strict";
import {
  PARENT_SCOPE_CONTRACT,
  assessParentGenerationCoherence,
} from "./parent_generation_integrity_v0_1.mjs";

const base={
  scanDate:"2026-09-29",
  captureGeneration:"G1_abc",
  decisionCutoffAt:"2026-09-29T08:00:00.000Z",
  formalWorkerVersion:"8.13.0",
  selectionRuleVersion:"FORMAL_RULE_V1",
  rankComparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
  parentSchemaVersion:"immutable-decision-state-parent-v0.2",
};

const rows=[
  {...base,symbol:"1101"},
  {...base,symbol:"2330"},
  {...base,symbol:"3105"},
];

const good=assessParentGenerationCoherence(rows,{
  ...base,
  parentScopeId:"FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1",
});
assert.equal(good.valid,true);
assert.equal(good.parentCount,3);
assert.equal(good.uniqueSymbolCount,3);
assert.equal(PARENT_SCOPE_CONTRACT.selectedOnly,false);

const mixedGen=assessParentGenerationCoherence([
  rows[0],
  {...rows[1],captureGeneration:"G1_other"},
  rows[2],
],base);
assert.equal(mixedGen.valid,false);
assert.ok(mixedGen.reasons.includes("MIXED_captureGeneration"));

const mixedCutoff=assessParentGenerationCoherence([
  rows[0],
  {...rows[1],decisionCutoffAt:"2026-09-29T08:01:00.000Z"},
  rows[2],
],base);
assert.equal(mixedCutoff.valid,false);
assert.ok(mixedCutoff.reasons.includes("MIXED_decisionCutoffAt"));

const mixedComparator=assessParentGenerationCoherence([
  rows[0],
  {...rows[1],rankComparatorVersion:"FUTURE_V2"},
  rows[2],
],base);
assert.equal(mixedComparator.valid,false);
assert.ok(mixedComparator.reasons.includes("MIXED_rankComparatorVersion"));

const duplicateSymbol=assessParentGenerationCoherence([
  rows[0],
  {...rows[1],symbol:"1101"},
],base);
assert.equal(duplicateSymbol.valid,false);
assert.ok(duplicateSymbol.reasons.includes("DUPLICATE_SYMBOL:1101"));

const expectedMismatch=assessParentGenerationCoherence(rows,{
  ...base,
  formalWorkerVersion:"8.14.0",
});
assert.equal(expectedMismatch.valid,false);
assert.ok(expectedMismatch.reasons.includes("EXPECTED_MISMATCH_formalWorkerVersion"));

assert.equal(
  assessParentGenerationCoherence(rows,{...base,parentScopeId:"OTHER_SCOPE"}).valid,
  false,
);

console.log(JSON.stringify({ok:true,scope:PARENT_SCOPE_CONTRACT.parentScopeId,good}));
