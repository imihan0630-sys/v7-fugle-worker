import assert from "node:assert/strict";
import {
  createCaptureGenerationId,
  buildCaptureGenerationSeed,
  sameCaptureGeneration,
} from "./capture_generation_v0_1.mjs";

const uuidA="123e4567-e89b-42d3-a456-426614174000";
const uuidB="123e4567-e89b-42d3-a456-426614174001";

assert.equal(createCaptureGenerationId(uuidA),"G1_"+uuidA);

const a=buildCaptureGenerationSeed({
  scanDate:"2026-09-29",
  requestedDate:"2026-09-29",
  runMode:"LIVE",
  workerVersion:"8.13.0",
  selectionRuleVersion:"FORMAL_RULE_V1",
  uuid:uuidA,
  startedAt:"2026-09-29T15:30:00+08:00",
});

const sameInvocationReuse={...a};
assert.equal(sameCaptureGeneration(a,sameInvocationReuse),true);

const b=buildCaptureGenerationSeed({
  scanDate:"2026-09-29",
  requestedDate:"2026-09-29",
  runMode:"LIVE",
  workerVersion:"8.13.0",
  selectionRuleVersion:"FORMAL_RULE_V1",
  uuid:uuidB,
  startedAt:"2026-09-29T15:31:00+08:00",
});
assert.equal(sameCaptureGeneration(a,b),false);
assert.notEqual(a.captureGeneration,b.captureGeneration);

const dry=buildCaptureGenerationSeed({
  scanDate:"2026-09-29",
  requestedDate:"2026-09-29",
  runMode:"DRY_RUN",
  workerVersion:"8.13.0",
  selectionRuleVersion:"FORMAL_RULE_V1",
  uuid:"223e4567-e89b-42d3-a456-426614174000",
  startedAt:"2026-09-29T15:32:00+08:00",
});
assert.equal(dry.runMode,"DRY_RUN");
assert.equal(sameCaptureGeneration(a,dry),false);

assert.throws(()=>createCaptureGenerationId("not-a-uuid"),/UUID_V4_REQUIRED/);
assert.throws(()=>createCaptureGenerationId("123e4567-e89b-12d3-a456-426614174000"),/UUID_V4_REQUIRED/);

console.log(JSON.stringify({ok:true,generation:"CAPTURE_GENERATION_PASS"}));
