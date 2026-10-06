import assert from "node:assert/strict";
import {runtimeRequiresFormalC1Binding,validateFormalC1BindingReadback} from "../research/system1_formal_c1_binding_validation_v0_1.mjs";

const expected={
  scanDate:"2026-10-06",
  generationId:"C1:2026-10-06:genuine",
  decisionAt:"2026-10-06T15:35:12.345Z",
  runtimeVersion:"8.20.0-formal-c1-binding-ledger",
  sourceMainSha:"a".repeat(40),
  contentDigest:"b".repeat(64),
  universeDigest:"c".repeat(64),
  populationN:1888
};
const row={
  schemaVersion:"SYSTEM1_FORMAL_C1_BINDING_V0_1",
  bindingId:"FORMAL_C1:"+"d".repeat(64),
  formalDecisionReceiptId:"FORMAL:2026-10-06:"+"e".repeat(64),
  scanDate:expected.scanDate,planDate:"2026-10-07",
  formalDecisionAt:expected.decisionAt,formalRuntimeVersion:expected.runtimeVersion,
  formalSourceMainSha:expected.sourceMainSha,formalResultDigest:"f".repeat(64),
  formalSelectedSymbolsDigest:"1".repeat(64),formalSelectedCount:2,
  c1GenerationId:expected.generationId,c1DecisionAt:expected.decisionAt,
  c1ContentDigest:expected.contentDigest,c1UniverseDigest:expected.universeDigest,
  c1PopulationN:expected.populationN,c1ScanOriginKind:"AFTER_MARKET_SCAN_PIPELINE",
  bindingCreatedAt:"2026-10-06T15:35:14.000Z",bindingDigest:"2".repeat(64),
  parentSelectionRuleVersion:"FORMAL_C1_EXPLICIT_AFTER_MARKET_V0_1",
  appendOnly:true,superseded:false,researchOnly:true,decisionImpact:false,
  formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
};
const payload={
  ok:true,schemaVersion:"SYSTEM1_FORMAL_C1_BINDING_V0_1",query:{scanDate:expected.scanDate},
  count:1,bindings:[row],authoritativeParentSelection:"EXPLICIT_BINDING_ONLY",
  latestHeuristicUsed:false,inventoryOrdinalHeuristicUsed:false,selectedSetEqualityInferenceUsed:false,
  historicalBackfillPerformed:false,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
  noPlanChanges:true,noTrade:true,noPush:true
};

assert.equal(runtimeRequiresFormalC1Binding("8.19.1-pve250-runtime-remediation"),false);
assert.equal(runtimeRequiresFormalC1Binding("8.20.0-formal-c1-binding-ledger"),true);
assert.equal(runtimeRequiresFormalC1Binding("8.21.0-future"),true);

const legacy=validateFormalC1BindingReadback(null,{...expected,runtimeVersion:"8.19.1-pve250-runtime-remediation"});
assert.equal(legacy.status,"LEGACY_PRE_V820_BINDING_NOT_REQUIRED");

const verified=validateFormalC1BindingReadback(payload,expected);
assert.equal(verified.status,"VERIFIED");
assert.equal(verified.bindingId,row.bindingId);
assert.equal(verified.c1GenerationId,expected.generationId);

assert.throws(()=>validateFormalC1BindingReadback({...payload,count:0,bindings:[]},expected),/EXACT_PARENT_NOT_FOUND|COUNT_MISMATCH/);
assert.throws(()=>validateFormalC1BindingReadback({...payload,bindings:[row,{...row,bindingId:"FORMAL_C1:"+"3".repeat(64)}],count:2},expected),/EXACT_PARENT_AMBIGUOUS/);
assert.throws(()=>validateFormalC1BindingReadback({...payload,latestHeuristicUsed:true},expected),/INFERENCE_FORBIDDEN/);
assert.throws(()=>validateFormalC1BindingReadback({...payload,bindings:[{...row,c1ScanOriginKind:"STAGE_SELECTION_ROUTE"}]},expected),/ORIGIN_MISMATCH/);
assert.throws(()=>validateFormalC1BindingReadback({...payload,bindings:[{...row,formalRuntimeVersion:"8.19.1"}]},expected),/RUNTIME_MISMATCH/);
assert.throws(()=>validateFormalC1BindingReadback({...payload,bindings:[{...row,c1ContentDigest:"9".repeat(64)}]},expected),/CONTENT_DIGEST_MISMATCH/);

console.log(JSON.stringify({ok:true,cases:10,modernBindingRequired:true,legacyNoBackfill:true,formalCoreImpact:false}));
