import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readJson=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const contract=await readJson("research/sda016_system1_formal_c1_binding_contract_v0_1.json");
const oracle=await readJson("research/SDA016_VALIDATION_ORACLE_20261006_V0_5.json");
const v83=await readFile(new URL("../scripts/apply_v8_3_0.py",import.meta.url),"utf8");

assert.equal(contract.status,"CLASS_A_CONTRACT_FROZEN_CLASS_B_IMPLEMENTATION_PENDING");
assert.equal(contract.formalCoreImpact,"NONE");
assert.equal(contract.productionRuntimeImpact,"NONE_UNTIL_SEPARATELY_APPROVED_CLASS_B");
assert.equal(contract.currentFacts.currentPlanArchive,"v8_plan_archive");
assert.equal(contract.currentFacts.currentPlanArchivePrimaryKey,"scan_date");
assert.equal(contract.currentFacts.currentPlanArchiveUsesOnConflictUpdate,true);
assert.equal(contract.currentFacts.currentPlanArchiveEligibleAsAuthoritativeLedger,false);
assert.match(v83,/CREATE TABLE IF NOT EXISTS v8_plan_archive \([\s\S]*scan_date TEXT PRIMARY KEY/);
assert.match(v83,/ON CONFLICT\(scan_date\) DO UPDATE SET/);

assert.equal(contract.proposedStorage.table,"trade_research_formal_c1_bindings");
assert.equal(contract.proposedStorage.appendOnly,true);
assert.equal(contract.proposedStorage.updatesAllowed,false);
assert.equal(contract.proposedStorage.deletesAllowed,false);
assert.ok(contract.proposedStorage.uniqueConstraints.includes("formal_decision_receipt_id"));
assert.ok(contract.proposedStorage.uniqueConstraints.includes("c1_generation_id"));

for(const f of [
 "formalDecisionReceiptId","scanDate","formalDecisionAt","formalRuntimeVersion","formalSourceMainSha",
 "formalResultDigest","formalSelectedSymbolsDigest","formalSelectedCount","c1GenerationId","c1DecisionAt",
 "c1ContentDigest","c1UniverseDigest","c1PopulationN","c1ScanOriginKind","bindingCreatedAt",
 "bindingDigest","parentSelectionRuleVersion","appendOnly","superseded"
]) assert.ok(contract.receiptFields.includes(f),"missing receipt field "+f);

assert.deepEqual(contract.implementationScope.allowedOriginKinds,["AFTER_MARKET_SCAN_PIPELINE"]);
assert.ok(contract.implementationScope.excludedWithoutSeparateAuthority.includes("STAGE_SELECTION_ROUTE"));
assert.ok(contract.implementationScope.excludedWithoutSeparateAuthority.includes("DIRECT_SAFE_PERSISTENCE_CALLER"));
assert.equal(contract.implementationScope.historicalBackfill,false);
assert.equal(contract.implementationScope.providerCallDelta,0);
assert.equal(contract.implementationScope.decisionImpact,false);
assert.equal(contract.implementationScope.noPlanChanges,true);
assert.equal(contract.implementationScope.noTrade,true);
assert.equal(contract.implementationScope.noPush,true);
assert.equal(contract.implementationScope.system2Untouched,true);

assert.equal(contract.readbackContract.scanDateQueryReturnsAllBindings,true);
assert.equal(contract.readbackContract.latestHeuristicForbidden,true);
assert.equal(contract.readbackContract.inventoryOrdinalHeuristicForbidden,true);
assert.equal(contract.readbackContract.selectedSetEqualityInferenceForbidden,true);
assert.equal(contract.failurePolicy.businessFormalDecision,"FAIL_OPEN_FROM_RESEARCH_BINDING_FAILURE");
assert.equal(contract.failurePolicy.researchEvidence,"FAIL_CLOSED");
assert.equal(contract.approvalBoundary.implementationNotAuthorizedByThisContract,true);

const cases=Object.fromEntries(contract.adversarialAcceptance.map(x=>[x.id,x.expected]));
assert.equal(Object.keys(cases).length,10);
assert.equal(cases["BIND-T04"],"ONLY_EXPLICIT_FORMAL_BINDING_IS_AUTHORITATIVE");
assert.equal(cases["BIND-T05"],"MUST_NOT_REPLACE_BOUND_PARENT");
assert.equal(cases["BIND-T06"],"HISTORICAL_PARENT_STILL_RECOVERABLE_BY_FORMAL_DECISION_RECEIPT_ID");
assert.equal(cases["BIND-T07"],"HISTORICAL_BINDING_NOT_PROVEN_NO_BACKFILL");
assert.equal(cases["BIND-T08"],"FORMAL_CONTINUES_RESEARCH_EVIDENCE_BLOCKED");

for(const id of ["SDA016-T42","SDA016-T43","SDA016-T44","SDA016-T45","SDA016-T46","SDA016-T47","SDA016-T48"]){
  assert.ok(oracle.tests.some(t=>t.id===id&&t.blocking===true),"missing oracle blocker "+id);
}

console.log(JSON.stringify({
 ok:true,
 contract:"SDA016_SYSTEM1_FORMAL_C1_BINDING_CONTRACT_V0_1",
 adversarialCases:10,
 existingMutablePlanArchiveRejected:true,
 appendOnlyBindingRequired:true,
 classBImplementationStillPending:true,
 formalCoreImpact:"NONE"
}));
