import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const p=new URL("../SYSTEM2_SHADOW_15_CRITICAL_GATE_LEDGER_V0_1.json",import.meta.url);
const o=JSON.parse(readFileSync(p,"utf8"));
assert.equal(o.schemaVersion,"S2_SHADOW_15_CRITICAL_GATE_LEDGER_V0_1");
const required=["A07","B10","B11","D06","D07","D08","E05","E06",
  "E07","F07","F08","H04","H05","H07","H09"];
assert.equal(o.gates.length,15);
assert.deepEqual(o.gates.map(g=>g.id),required);
assert.equal(new Set(o.gates.map(g=>g.id)).size,15);
const lanes=new Set(["REMEDIATION_LANE","DATA_LANE","BUILD_LANE","AUDIT_LANE","OWNER_GATE"]);
for(const g of o.gates){
  assert.ok(lanes.has(g.lane));
  assert.ok(typeof g.state==="string"&&g.state.length>4);
  assert.ok(typeof g.acceptance==="string"&&g.acceptance.length>25);
  assert.ok(typeof g.next==="string"&&g.next.length>12);
  if(g.verified===true){
    assert.ok(g.finalAcceptanceEvidence?.independentRef
      && g.finalAcceptanceEvidence?.acceptedAtTaipei
      && g.finalAcceptanceEvidence?.sourceKind,
    "no silent promotion to verified: "+g.id);
  }
}
assert.equal(o.passedGateCount,o.gates.filter(g=>g.verified).length);
assert.equal(o.totalGateCount,o.gates.length);
assert.equal(o.unverifiedGateCount,o.gates.length-o.passedGateCount);
assert.equal(o.mandatoryProtections.system1FormalCore,"NO_CHANGES");
assert.equal(o.mandatoryProtections.brokerOrders,"DISABLED");
assert.equal(o.mandatoryProtections.unknownAsZero,"FORBIDDEN");
assert.notEqual(o.gates.find(g=>g.id==="F08").verified,true);
assert.notEqual(o.gates.find(g=>g.id==="F07").verified,true);
console.log("System2 15 prioritized Shadow acceptance gates schema and anti-false-promotion PASS");
