import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readJson=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const [queue,registry,contract,oracle]=await Promise.all([
  readJson("shared-knowledge/stock_selection_audit_queue_v0_1.json"),
  readJson("shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json"),
  readJson("research/sda016_system1_formal_c1_binding_contract_v0_1.json"),
  readJson("research/SDA016_VALIDATION_ORACLE_20261006_V0_5.json")
]);
const dashboard=await readFile(new URL("../shared-knowledge/STOCK_SELECTION_AUDIT_DASHBOARD_V0_1.md",import.meta.url),"utf8");

const issue=queue.issues.find(x=>x.id==="SDA-016");
assert.ok(issue,"SDA-016 missing");
assert.ok(typeof issue.readiness==="string"&&issue.readiness.length>0,"SDA-016 readiness missing");
assert.equal(oracle.schemaVersion,"SDA016_VALIDATION_ORACLE_V0_5");
assert.equal(oracle.passRule,"ALL_58_BLOCKING_TESTS_PASS_AND_ROOM00_INDEPENDENT_READBACK");
assert.equal(oracle.tests.length,58);
assert.ok([
  "CLASS_A_CONTRACT_FROZEN_CLASS_B_IMPLEMENTATION_PENDING",
  "CLASS_B_IMPLEMENTED_VALIDATION_IN_PROGRESS",
  "CLASS_B_IMPLEMENTED_EXACT_HEAD_CI_PASS_MERGE_DEPLOY_APPROVAL_PENDING",
  "CLASS_B_MERGED_DEPLOYMENT_PENDING",
  "PRODUCTION_AUTHORITY_ESTABLISHED",
  "V820_PRODUCTION_VERIFIED_GENUINE_BINDING_PENDING",
  "V820_PRODUCTION_VERIFIED_GENUINE_BINDING_VERIFIED"
].includes(issue.formalC1Binding?.status),"unexpected Formal-C1 governance lifecycle");
assert.equal(issue.formalC1Binding?.contract,"research/sda016_system1_formal_c1_binding_contract_v0_1.json");
assert.equal(issue.system1Engineering?.authoritativeFormalC1Ledger,"PRODUCTION_AUTHORITY_ESTABLISHED");
assert.equal(issue.formalC1Binding?.appendOnlyLedgerImplementation,"MERGED_DEPLOYED_PRODUCTION_VERIFIED");
assert.equal(issue.formalC1Binding?.genuineBindingReadback,"FIRST_SCHEDULED_DATE_INELIGIBLE_C1_GENERATION_NOT_FOUND_GENUINE_PENDING");
assert.equal(issue.formalC1Binding?.qualityRepair,"TARGETED_MOPSOV_NODE_STANDARD_HTTPS_TRANSPORT_CANDIDATE_EXACT_HEAD_CI_PENDING");
assert.equal(issue.formalC1Binding?.deadlineRepairPr,769);
assert.equal(issue.formalC1Binding?.deadlineRepairLiveRun,37563414217);
assert.equal(issue.formalC1Binding?.nodeHttpsTransportEvidenceRun,37565002528);
assert.equal(issue.formalC1Binding?.firstScheduledEvidenceRootCause,"OFFICIAL_QUALITY_MOPS_FULL_MARKET_BODY_TIMEOUT_FINANCIAL_QUARTER_EPS_MISSING");
assert.ok([
  "PENDING_CLASS_B","IMPLEMENTED_UNMERGED","MERGED_NOT_DEPLOYED","PRODUCTION_AUTHORITY_ESTABLISHED",
  "MERGED_DEPLOYED_PRODUCTION_VERIFIED"
].includes(issue.formalC1Binding?.appendOnlyLedgerImplementation),"unexpected append-only ledger lifecycle");
assert.ok([
  "PENDING","CLASS_B_IMPLEMENTED_UNMERGED_NOT_PRODUCTION_AUTHORITY","CLASS_B_MERGED_NOT_DEPLOYED","PRODUCTION_AUTHORITY_ESTABLISHED"
].includes(issue.system1Engineering?.authoritativeFormalC1Ledger),"unexpected authoritative ledger lifecycle");

assert.equal(contract.status,"CLASS_A_CONTRACT_FROZEN_CLASS_B_IMPLEMENTATION_PENDING");
assert.equal(contract.formalCoreImpact,"NONE");
assert.equal(contract.approvalBoundary.implementationNotAuthorizedByThisContract,true);
assert.equal(registry.rules.sda016System1FormalC1BindingContract,
  "research/SDA016_SYSTEM1_FORMAL_C1_BINDING_IMPLEMENTATION_CONTRACT_20261006_V0_1.md");
assert.equal(registry.rules.sda016System1FormalC1BindingContractMachine,
  "research/sda016_system1_formal_c1_binding_contract_v0_1.json");

assert.match(dashboard,/V0_5_58_TEST_ORACLE/);
assert.match(dashboard,/PR #675 merged the Class-A Formal→C1 binding contract/);
assert.match(dashboard,/PENDING_CLASS_B/);
assert.match(dashboard,/v8_plan_archive.*NOT an authoritative parent ledger/);
assert.match(dashboard,/first genuine post-deploy V8\.19 C1 readback/);

console.log(JSON.stringify({
  ok:true,
  ticket:"SDA-016",
  oracle:"V0.5 / 58",
  bindingContract:"FROZEN",
  classBImplementation:issue.formalC1Binding?.appendOnlyLedgerImplementation,
  dashboardSynchronized:true,
  bootstrapSynchronized:true,
  formalCoreImpact:"NONE"
}));
