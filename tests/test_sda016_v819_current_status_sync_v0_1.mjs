import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readJson=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const [status,prod,queue,registry]=await Promise.all([
  readJson("research/sda016_system1_v819_current_status_20261006_v0_1.json"),
  readJson("research/system1_c1_scan_origin_generation_inventory_pr_644_v0_1.json"),
  readJson("shared-knowledge/stock_selection_audit_queue_v0_1.json"),
  readJson("shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json")
]);
const dashboard=await readFile(new URL("../shared-knowledge/STOCK_SELECTION_AUDIT_DASHBOARD_V0_1.md",import.meta.url),"utf8");

assert.equal(status.status,"PR644_MERGED_V819_PRODUCTION_VERIFIED_GENUINE_C1_READBACK_PENDING");
assert.equal(status.pr644.merged,true);
assert.equal(status.pr644.mergeSha,prod.mergeSha);
assert.equal(status.pr644.productionDeployRun,prod.productionDeployRun);
assert.equal(status.pr644.productionDeployConclusion,"success");
assert.equal(status.productionRuntime.version,"8.19.0-c1-scan-origin-generation-inventory");
assert.equal(status.productionRuntime.verified,true);
assert.equal(status.productionRuntime.testMode,false);
assert.equal(status.productionRuntime.rollbackTriggered,false);
assert.equal(status.safety.formalCoreImpact,"NONE");
assert.equal(status.safety.noHistoricalBackfill,true);
assert.equal(status.safety.noSyntheticGenuineEvidence,true);

const issue=queue.issues.find(x=>x.id==="SDA-016");
assert.ok(issue,"SDA-016 missing");
assert.equal(issue.candidateEngineering?.pr,644);
assert.equal(issue.candidateEngineering?.state,"MERGED_DEPLOYED_PRODUCTION_VERIFIED");
assert.equal(issue.candidateEngineering?.mergeSha,prod.mergeSha);
assert.equal(issue.candidateEngineering?.productionDeployRun,prod.productionDeployRun);
assert.equal(issue.candidateEngineering?.genuineReadbackStatus,"PENDING_FIRST_GENUINE_POST_DEPLOY_C1_SESSION");
assert.ok([
  "PENDING",
  "CLASS_B_IMPLEMENTED_UNMERGED_NOT_PRODUCTION_AUTHORITY",
  "CLASS_B_MERGED_NOT_DEPLOYED",
  "PRODUCTION_AUTHORITY_ESTABLISHED"
].includes(issue.system1Engineering?.authoritativeFormalC1Ledger),"unexpected Formal-C1 ledger lifecycle state");
assert.ok((issue.remainingDelta||[]).some(x=>String(x).includes("first genuine post-deploy V8.19 C1")));
assert.ok(
  issue.system1Engineering?.authoritativeFormalC1Ledger==="PRODUCTION_AUTHORITY_ESTABLISHED" ||
  (issue.remainingDelta||[]).some(x=>/Formal.*C1|binding/i.test(String(x))),
  "Formal-C1 work may leave remainingDelta only after Production authority is genuinely established"
);
assert.ok(!String(issue.readiness).includes("NOT_MERGED"));

assert.equal(registry.rules.sda016System1V819CurrentStatus,
  "research/sda016_system1_v819_current_status_20261006_v0_1.json");
assert.match(dashboard,/## SDA-016 System1 V8\.19 current status supersession/);
assert.match(dashboard,/- PR #644 = MERGED;/);
assert.match(dashboard,/- V8\.19 Production deploy run `37382112616` = SUCCESS;/);
assert.match(dashboard,/V820_PRODUCTION_VERIFIED_FIRST_SCHEDULED_DATE_INELIGIBLE_GENUINE_BINDING_PENDING_T48_OPEN_SHARED_AUTHORITY_PENDING/);
assert.match(dashboard,/SDA-016 is still NOT closed/);
assert.match(dashboard,/first genuine post-deploy C1 scanOrigin/);

console.log(JSON.stringify({
  ok:true,
  ticket:"SDA-016",
  pr644:"MERGED",
  production:"V8.19 VERIFIED",
  genuineC1Readback:"PENDING",
  authoritativeFormalC1Ledger:issue.system1Engineering?.authoritativeFormalC1Ledger,
  formalCoreImpact:"NONE"
}));
