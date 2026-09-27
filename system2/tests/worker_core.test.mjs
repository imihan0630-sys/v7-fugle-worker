import assert from "node:assert/strict";
import {
  resolveSystem2CaptureArm,
  buildSystem2HealthPayload,
} from "../deploy/worker_core.mjs";

const disabled = resolveSystem2CaptureArm({
  SYSTEM2_CAPTURE_ENABLED: "false",
  SYSTEM2_CAPTURE_MODE: "LIMITED_PROSPECTIVE_SHADOW",
  SYSTEM2_CAPTURE_CONTRACT_VERSION: "0.1",
});
assert.equal(disabled.state, "CAPTURE_DISABLED");
assert.equal(disabled.scheduledCaptureAllowed, false);

const requested = resolveSystem2CaptureArm({
  SYSTEM2_CAPTURE_ENABLED: "true",
  SYSTEM2_CAPTURE_MODE: "LIMITED_PROSPECTIVE_SHADOW",
  SYSTEM2_CAPTURE_CONTRACT_VERSION: "0.1",
});
assert.equal(requested.state, "ARM_REQUESTED_BUT_SOURCE_ADAPTERS_NOT_CONFIGURED");
assert.equal(requested.scheduledCaptureAllowed, false);

assert.throws(
  () => resolveSystem2CaptureArm({ SYSTEM2_CAPTURE_MODE: "LIVE_TRADING" }),
  /unsupported SYSTEM2_CAPTURE_MODE/,
);

const health = buildSystem2HealthPayload({
  schemaVersion: "0.5",
  env: {
    SYSTEM2_CAPTURE_ENABLED: "false",
    SYSTEM2_CAPTURE_MODE: "LIMITED_PROSPECTIVE_SHADOW",
    SYSTEM2_CAPTURE_CONTRACT_VERSION: "0.1",
  },
});
assert.equal(health.service, "system2-shadow-research");
assert.equal(health.schemaVersion, "0.5");
assert.equal(health.captureState, "CAPTURE_DISABLED");
assert.equal(health.scheduledCaptureAllowed, false);
assert.equal(health.system1RuntimeUsed, false);

console.log("System2 Shadow worker core tests passed");
