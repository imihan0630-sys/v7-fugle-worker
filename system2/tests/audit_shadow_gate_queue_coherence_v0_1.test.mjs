import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// AUDIT_LANE independent, read-only cross-source acceptance guard.
// Do not equate CI PASS with physical readiness or owner authorization.
const ledger = JSON.parse(readFileSync(
  new URL("../SYSTEM2_SHADOW_15_CRITICAL_GATE_LEDGER_V0_1.json", import.meta.url),
  "utf8",
));
const queue = JSON.parse(readFileSync(
  new URL("../SYSTEM2_CORRECTION_QUEUE.json", import.meta.url),
  "utf8",
));

function validateCrossSource(ledgerState, queueState) {
  const problems = [];
  const directives = queueState.directives ?? [];
  const ids = new Set();
  const byId = new Map();
  for (const d of directives) {
    if (!d.directiveId || ids.has(d.directiveId)) problems.push("DUPLICATE_OR_EMPTY_CORRECTION_ID");
    ids.add(d.directiveId);
    byId.set(d.directiveId, d);
  }

  const gates = ledgerState.gates ?? [];
  const byGate = new Map(gates.map(g => [g.id, g]));
  const mandatoryLinks = {
    A07: "S2-CORR-20261007-003",
    B10: "S2-CORR-20261004-001",
    B11: "S2-CORR-20261004-001",
    F07: "S2-CORR-20261007-003",
    F08: "S2-CORR-20261008-012",
    H04: "S2-CORR-20261008-012",
    H05: "S2-CORR-20261008-013",
  };
  for (const [id, correctionId] of Object.entries(mandatoryLinks)) {
    if (byGate.get(id)?.correctionId !== correctionId) problems.push("MANDATORY_CORRECTION_LINK:" + id);
  }

  for (const g of gates) {
    if (g.correctionId && !byId.has(g.correctionId)) {
      problems.push("ORPHANED_CORRECTION:" + g.id);
    }
    if (!g.verified) continue;
    if (g.correctionId && byId.get(g.correctionId)?.status !== "VERIFIED_CLOSED") {
      problems.push("PREMATURE_GATE_PROMOTION:" + g.id);
    }
    if (!g.finalAcceptanceEvidence?.independentRef) {
      problems.push("NO_INDEPENDENT_ACCEPTANCE:" + g.id);
    }
  }

  if (byGate.get("H09")?.verified && gates.some(g => g.id !== "H09" && !g.verified)) {
    problems.push("OWNER_GATE_BEFORE_SAFETY_GATES");
  }
  if (ledgerState.passedGateCount !== gates.filter(g => g.verified).length) {
    problems.push("GATE_TOTAL_NOT_RECONCILED");
  }
  return problems;
}

assert.deepEqual(validateCrossSource(ledger, queue), [],
  "current main ledger must not silently promote an open correction or orphan its gate");

// Independent negative tests prove this checker is sensitive to the actual drift
// patterns, rather than passing only because all current gates are unverified.
const clone = value => structuredClone(value);
for (const gateId of ["A07", "B10", "F07", "F08", "H04", "H05"]) {
  const mutant = clone(ledger);
  mutant.gates.find(g => g.id === gateId).verified = true;
  mutant.passedGateCount++;
  assert.ok(validateCrossSource(mutant, queue).includes("PREMATURE_GATE_PROMOTION:" + gateId),
    "open-correction promotion must fail: " + gateId);
}
{
  const mutant = clone(ledger);
  mutant.gates.find(g => g.id === "H09").verified = true;
  mutant.passedGateCount++;
  assert.ok(validateCrossSource(mutant, queue).includes("OWNER_GATE_BEFORE_SAFETY_GATES"));
}
{
  const mutant = clone(ledger);
  mutant.gates.find(g => g.id === "H04").correctionId = null;
  assert.ok(validateCrossSource(mutant, queue).includes("MANDATORY_CORRECTION_LINK:H04"));
}
{
  const mutant = clone(queue);
  mutant.directives.push(clone(mutant.directives[0]));
  assert.ok(validateCrossSource(ledger, mutant).includes("DUPLICATE_OR_EMPTY_CORRECTION_ID"));
}
console.log("System2 AUDIT_LANE independent cross-source gate/Correction Queue guard PASS; "+
  "6 open-correction promotion probes, owner-gate probe, link and duplicate probes. "+
  "NO physical D1/R2 validation and NO launch authority.");
