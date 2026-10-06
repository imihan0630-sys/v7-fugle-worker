import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readJson=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const contract=await readJson("research/sda016_system1_formal_c1_binding_contract_v0_1.json");
const planPatch=await readFile(new URL("../scripts/apply_v8_3_0.py",import.meta.url),"utf8");
const v819=await readFile(new URL("../scripts/apply_v8_19_0.py",import.meta.url),"utf8");
const collector=await readFile(new URL("../research/system1_c1_c2_collection_v0_1.mjs",import.meta.url),"utf8");

assert.equal(contract.schemaVersion,"SDA016_SYSTEM1_FORMAL_C1_BINDING_CONTRACT_V0_1");
assert.equal(contract.status,"CLASS_A_CONTRACT_FROZEN_CLASS_B_IMPLEMENTATION_PENDING");
assert.equal(contract.formalCoreImpact,"NONE");
assert.equal(contract.productionRuntimeImpact,"NONE_UNTIL_SEPARATELY_APPROVED_CLASS_B");

assert.equal(contract.currentFacts.currentPlanArchive,"v8_plan_archive");
assert.equal(contract.currentFacts.currentPlanArchivePrimaryKey,"scan_date");
assert.equal(contract.currentFacts.currentPlanArchiveUsesOnConflictUpdate,true);
assert.equal(contract.currentFacts.currentPlanArchiveEligibleAsAuthoritativeLedger,false);
assert.match(planPatch,/CREATE TABLE IF NOT EXISTS v8_plan_archive/);
assert.match(planPatch,/scan_date TEXT PRIMARY KEY/);
assert.match(planPatch,/ON CONFLICT\(scan_date\) DO UPDATE SET/);

assert.equal(contract.currentFacts.currentCollectorFailClosedGuard,"FORMAL_C1_GENERATION_UNLINKED");
assert.match(collector,/FORMAL_C1_GENERATION_UNLINKED/);

assert.deepEqual(contract.implementationScope.allowedOriginKinds,["AFTER_MARKET_SCAN_PIPELINE"]);
assert.deepEqual(contract.implementationScope.excludedWithoutSeparateAuthority,
  ["STAGE_SELECTION_ROUTE","DIRECT_SAFE_PERSISTENCE_CALLER"]);
assert.equal(contract.implementationScope.historicalBackfill,false);
assert.equal(contract.implementationScope.providerCallDelta,0);
assert.equal(contract.implementationScope.decisionImpact,false);
assert.equal(contract.implementationScope.noPlanChanges,true);
assert.equal(contract.implementationScope.noTrade,true);
assert.equal(contract.implementationScope.noPush,true);
assert.equal(contract.implementationScope.system2Untouched,true);
assert.match(v819,/AFTER_MARKET_SCAN_PIPELINE/);
assert.match(v819,/STAGE_SELECTION_ROUTE/);
assert.match(v819,/DIRECT_SAFE_PERSISTENCE_CALLER/);

assert.equal(contract.proposedStorage.table,"trade_research_formal_c1_bindings");
assert.equal(contract.proposedStorage.appendOnly,true);
assert.equal(contract.proposedStorage.updatesAllowed,false);
assert.equal(contract.proposedStorage.deletesAllowed,false);
assert.ok(contract.proposedStorage.uniqueConstraints.includes("formal_decision_receipt_id"));
assert.ok(contract.proposedStorage.uniqueConstraints.includes("c1_generation_id"));

for(const field of [
  "formalDecisionReceiptId","scanDate","planDate","formalDecisionAt","formalRuntimeVersion",
  "formalSourceMainSha","formalResultDigest","formalSelectedSymbolsDigest","formalSelectedCount",
  "c1GenerationId","c1DecisionAt","c1ContentDigest","c1UniverseDigest","c1PopulationN",
  "c1ScanOriginKind","bindingCreatedAt","bindingDigest","parentSelectionRuleVersion",
  "appendOnly","superseded"
]) assert.ok(contract.receiptFields.includes(field),"missing field "+field);

assert.equal(contract.readbackContract.protectedAdminReadOnly,true);
assert.equal(contract.readbackContract.scanDateQueryReturnsAllBindings,true);
assert.equal(contract.readbackContract.latestHeuristicForbidden,true);
assert.equal(contract.readbackContract.inventoryOrdinalHeuristicForbidden,true);
assert.equal(contract.readbackContract.selectedSetEqualityInferenceForbidden,true);
assert.equal(contract.readbackContract.consumerMustPinFormalDecisionReceiptId,true);

assert.equal(contract.failurePolicy.businessFormalDecision,"FAIL_OPEN_FROM_RESEARCH_BINDING_FAILURE");
assert.equal(contract.failurePolicy.researchEvidence,"FAIL_CLOSED");
assert.equal(contract.failurePolicy.requiredObservableStatus,"researchFormalC1Binding");

const expected={
  "BIND-T01":"IDEMPOTENT",
  "BIND-T02":"CONFLICT_FORMAL_DECISION_REBOUND",
  "BIND-T03":"CONFLICT_C1_PARENT_REBOUND",
  "BIND-T04":"ONLY_EXPLICIT_FORMAL_BINDING_IS_AUTHORITATIVE",
  "BIND-T05":"MUST_NOT_REPLACE_BOUND_PARENT",
  "BIND-T06":"HISTORICAL_PARENT_STILL_RECOVERABLE_BY_FORMAL_DECISION_RECEIPT_ID",
  "BIND-T07":"HISTORICAL_BINDING_NOT_PROVEN_NO_BACKFILL",
  "BIND-T08":"FORMAL_CONTINUES_RESEARCH_EVIDENCE_BLOCKED",
  "BIND-T09":"MUST_NOT_CHANGE_APPEND_ONLY_BINDING",
  "BIND-T10":"RETURN_ALL_NO_LATEST_PARENT_SELECTION"
};
assert.equal(contract.adversarialAcceptance.length,10);
for(const row of contract.adversarialAcceptance){
  assert.equal(row.expected,expected[row.id],row.id);
  delete expected[row.id];
}
assert.deepEqual(expected,{});

assert.equal(contract.approvalBoundary.currentWorkAuthorized,"CLASS_A_RESEARCH_CONTRACT_AND_OFFLINE_TESTS_ONLY");
assert.equal(contract.approvalBoundary.implementationNotAuthorizedByThisContract,true);
for(const item of ["new D1 table/schema","runtime binding persistence","protected readback endpoint","Production deployment"])
  assert.ok(contract.approvalBoundary.classBRequiredFor.includes(item));
assert.ok(contract.approvalBoundary.classCRequiredFor.some(x=>x.includes("Formal selection")));

console.log(JSON.stringify({
  ok:true,
  ticket:"SDA-016",
  tests:"BIND-T01~T10 contract/source invariants PASS",
  mutablePlanArchiveRejectedAsAuthority:true,
  currentCollectorFailClosedGuardPreserved:true,
  system2Untouched:true,
  formalCoreImpact:"NONE",
  classBImplementationStillPending:true
}));
