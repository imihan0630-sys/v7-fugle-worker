import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readJson=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const [acceptance,fingerprint,queue,registry]=await Promise.all([
  readJson("shared-knowledge/sda022_system1_fingerprint_acceptance_20261006_v0_1.json"),
  readJson("shared-knowledge/system1_policy_fingerprint_receipt_v0_1.json"),
  readJson("shared-knowledge/stock_selection_audit_queue_v0_1.json"),
  readJson("shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json")
]);
const dashboard=await readFile(new URL("../shared-knowledge/STOCK_SELECTION_AUDIT_DASHBOARD_V0_1.md",import.meta.url),"utf8");

assert.equal(acceptance.status,"S22_T01_T05_PASS");
for(const id of ["S22-T01","S22-T02","S22-T03","S22-T04","S22-T05"]) assert.equal(acceptance.oracleTests[id],"PASS",id);
assert.equal(acceptance.fingerprintHash,fingerprint.fingerprintHash);
assert.equal(fingerprint.systemId,"SYSTEM1");
assert.equal(fingerprint.requiresOtherSystemCandidateOutput,false);
assert.equal(fingerprint.requiresOtherSystemRankOutput,false);
assert.equal(fingerprint.formalMutation,false);
assert.equal(acceptance.safety.formalCoreImpact,"NONE");
assert.equal(acceptance.safety.workerRuntimeChanged,false);
assert.equal(acceptance.safety.productionDeploymentRequired,false);
assert.equal(acceptance.safety.system2PolicyChanged,false);

const issue=queue.issues.find(x=>x.id==="SDA-022");
assert.ok(issue,"SDA-022 queue item missing");
assert.equal(issue.system1Fingerprint?.status,"S22_T01_T05_PASS");
assert.equal(issue.system1Fingerprint?.fingerprintHash,fingerprint.fingerprintHash);
assert.equal(issue.system1Fingerprint?.formalCoreImpact,"NONE");
assert.ok(!(issue.remainingDelta||[]).some(x=>String(x).startsWith("System1 research-only decision-policy fingerprint")),
  "completed System1 fingerprint must not remain pending");
assert.ok((issue.remainingDelta||[]).some(x=>String(x).startsWith("System2 per-strategy policy fingerprint")),
  "System2 fingerprint must remain pending here until separately proven");
assert.ok((issue.remainingDelta||[]).some(x=>String(x).startsWith("NC-T01 physical proof")),
  "physical NC-T01 must remain pending");

assert.equal(registry.rules.system1PolicyFingerprintReceipt,
  "shared-knowledge/system1_policy_fingerprint_receipt_v0_1.json");
assert.equal(registry.rules.sda022System1FingerprintAcceptance,
  "shared-knowledge/sda022_system1_fingerprint_acceptance_20261006_v0_1.json");

assert.match(dashboard,/S22-T01 = PASS/);
assert.match(dashboard,/S22-T05 = PASS/);
assert.match(dashboard,/explicitly requires neither System2 candidates nor System2 rank output/);
assert.match(dashboard,/System2 fingerprints -> physical NC-T01/);

console.log(JSON.stringify({
  ok:true,
  acceptance:"S22-T01~T05 PASS",
  fingerprintHash:fingerprint.fingerprintHash,
  queueSynchronized:true,
  registrySynchronized:true,
  dashboardSynchronized:true,
  formalCoreImpact:"NONE"
}));
