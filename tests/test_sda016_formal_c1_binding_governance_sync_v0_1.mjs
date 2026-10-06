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
assert.match(issue.readiness,/V820_PRODUCTION_VERIFIED/);
assert.match(issue.readiness,/GENUINE_BINDING_PENDING/);
assert.match(issue.readiness,/T48_OPEN/);
assert.equal(issue.formalC1Binding?.status,"V820_PRODUCTION_VERIFIED_GENUINE_BINDING_PENDING");
assert.equal(issue.formalC1Binding?.contract,"research/sda016_system1_formal_c1_binding_contract_v0_1.json");
assert.equal(issue.formalC1Binding?.appendOnlyLedgerImplementation,"MERGED_DEPLOYED_PRODUCTION_VERIFIED");
assert.equal(issue.formalC1Binding?.productionAuthority,"RUNTIME_ENGINEERING_VERIFIED_GENUINE_SAMPLE_PENDING");
assert.match(issue.formalC1Binding?.genuineBindingReadback||"",/GENUINE_PENDING$/);
assert.equal(issue.formalC1Binding?.t48,"OPEN_SAME_SESSION_GENERATION_SET_FINALIZATION");

assert.equal(contract.status,"CLASS_A_CONTRACT_FROZEN_CLASS_B_IMPLEMENTATION_PENDING");
assert.equal(contract.formalCoreImpact,"NONE");
assert.equal(contract.approvalBoundary.implementationNotAuthorizedByThisContract,true);
assert.equal(oracle.schemaVersion,"SDA016_VALIDATION_ORACLE_V0_5");
assert.equal(oracle.passRule,"ALL_58_BLOCKING_TESTS_PASS_AND_ROOM00_INDEPENDENT_READBACK");
assert.equal(oracle.tests.length,58);

assert.equal(registry.rules.sda016System1FormalC1BindingContract,
  "research/SDA016_SYSTEM1_FORMAL_C1_BINDING_IMPLEMENTATION_CONTRACT_20261006_V0_1.md");
assert.equal(registry.rules.sda016System1FormalC1BindingContractMachine,
  "research/sda016_system1_formal_c1_binding_contract_v0_1.json");

assert.match(dashboard,/V820_PRODUCTION_VERIFIED_FIRST_SCHEDULED_DATE_INELIGIBLE_GENUINE_BINDING_PENDING_T48_OPEN_SHARED_AUTHORITY_PENDING/);
assert.match(dashboard,/PR #675 merged the Class-A Formal→C1 binding contract/);
assert.match(dashboard,/append-only Formal→C1 ledger implementation = MERGED_DEPLOYED_PRODUCTION_VERIFIED/);
assert.match(dashboard,/genuine Formal→C1 binding receipt = PENDING/);
assert.match(dashboard,/SDA016-T48 same-session generation-set finalization = OPEN/);
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
