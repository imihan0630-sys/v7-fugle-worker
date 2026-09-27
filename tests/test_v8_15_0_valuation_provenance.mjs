import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const source=await readFile(process.env.V7_TEST_WORKER_PATH||new URL("../Worker.js",import.meta.url).pathname,"utf8");
for(const marker of [
  '8.15.0-valuation-gate-provenance-shadow',
  'VALUATION_GATE_AUDIT_V0_1',
  'FORMAL_RELATIVE_PE_2_5_GROWTH_25',
  'VALUATION_REJECTED',
  'pbSubstitutesForMissingPe:false',
  'relativePeMax:2.5',
  'growthExceptionPct:25',
  'minPositivePePeers:3'
]) assert.ok(source.includes(marker),marker);
assert.ok(source.includes('relativePe>2.5&&!growthException'));
assert.ok(source.includes('sectorPositivePe.length>=3?median(sectorPositivePe):null'));
assert.ok(source.includes('wouldRejectCurrentRule:gateEvaluable?(relativePe>2.5&&!growthException):null'));
assert.ok(source.includes('decisionImpact:false'));
console.log(JSON.stringify({ok:true,version:"8.15.0",researchOnly:true,formalThresholdsUnchanged:true}));
