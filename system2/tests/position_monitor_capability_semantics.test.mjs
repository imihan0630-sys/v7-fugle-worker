import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const system2Root = path.resolve(here, "..");
const read = (relativePath) => fs.readFileSync(path.join(system2Root, relativePath), "utf8");

const master = read("SYSTEM2_MASTER.md");
const architecture = read("SYSTEM2_ARCHITECTURE.md");
const positionArchitecture = read("SYSTEM2_POSITION_MANAGEMENT_ARCHITECTURE.md");
const storage = read("SYSTEM2_STORAGE_SCHEMA.md");
const progress = read("SYSTEM2_BUILD_PROGRESS_MAP.md");
const ui = read("SYSTEM2_INSTITUTIONAL_MONITORING_UI_V0_1.md");
const lifecycle = read("SYSTEM2_CANDIDATE_LIFECYCLE_CONTRACT_V0_1.md");
const mvpStatus = read("SYSTEM2_MVP_SHADOW_STATUS_V0_1.md");
const lifecycleRuntime = read("runtime/candidate_lifecycle.mjs");
const resonancePersistence = read("runtime/daily_resonance_persistence_v0_1.mjs");

const canonicalReadinessTerms = [
  "DESIGN_APPROVED",
  "VIRTUAL_POSITION_READY",
  "ACTUAL_HOLDINGS_SOURCE_AUTHORIZED",
  "USER_UPLOADED_BROKER_SCREENSHOT",
  "CHAT_ASSISTED_HOLDINGS_IMPORT_READY",
  "ACTUAL_POSITION_MONITOR_VERIFIED",
];

for (const term of canonicalReadinessTerms) {
  assert.ok(
    positionArchitecture.includes(term),
    `position architecture must preserve readiness term ${term}`,
  );
}

assert.ok(master.includes("VIRTUAL_POSITION_READY"));
assert.ok(master.includes("ACTUAL_HOLDINGS_SOURCE_AUTHORIZED=USER_UPLOADED_BROKER_SCREENSHOT"));
assert.ok(master.includes("CHAT_ASSISTED_HOLDINGS_IMPORT_READY"));
assert.ok(master.includes("ACTUAL_POSITION_MONITOR_VERIFIED=false"));
assert.ok(master.includes("Broker API holdings integration is `NOT AUTHORIZED`"));
assert.ok(master.includes("real orders"));
assert.ok(architecture.includes("VIRTUAL_POSITION_READY"));
assert.ok(architecture.includes("USER_UPLOADED_BROKER_SCREENSHOT"));
assert.ok(progress.includes("ACTUAL_POSITION_MONITOR_VERIFIED=false"));
assert.ok(progress.includes("broker API = NOT AUTHORIZED"));

assert.ok(
  storage.includes("System 2 virtual/simulated positions only; never owner actual holdings"),
  "s2_positions must remain virtual-only",
);
assert.ok(storage.includes("Do not overload this table with actual holdings."));

assert.ok(
  lifecycle.includes("SIM_FILLED") && lifecycle.includes("simulated/virtual position"),
  "candidate lifecycle must identify current POSITION_MONITOR as virtual/simulated",
);
assert.match(lifecycleRuntime, /SIM_FILLED/);
assert.match(lifecycleRuntime, /POSITION_MONITOR/);
assert.match(resonancePersistence, /FROM s2_positions/);

assert.ok(
  mvpStatus.includes("no real position or order is created"),
  "MVP physical status must remain explicit about no real position/order creation",
);

assert.ok(ui.includes("SIMULATED / VIRTUAL"));
assert.ok(ui.includes("ACTUAL_HOLDINGS_SOURCE_AUTHORIZED=USER_UPLOADED_BROKER_SCREENSHOT"));
assert.ok(ui.includes("ACTUAL_POSITION_MONITOR_VERIFIED=false"));
assert.ok(ui.toLowerCase().includes("broker api"));

assert.ok(
  !master.includes("Actual holdings are continuously monitored in a dedicated POSITION_MONITOR"),
  "master must not present target actual-holdings behavior as current capability",
);
assert.ok(
  !architecture.includes("Existing positions are continuously monitored in POSITION_MONITOR until ownership is reconciled to zero"),
  "architecture must not present unverified actual-holdings monitoring as operational",
);

assert.ok(
  master.includes("suggested shares") && master.includes("must never be promoted into actual holdings"),
  "master must explicitly prohibit suggested-share promotion into actual holdings",
);
assert.ok(
  positionArchitecture.includes("suggested/requested shares")
    && positionArchitecture.includes("explicitly insufficient to establish actual ownership"),
  "position architecture must fail closed on suggested/requested-share ownership inference",
);
assert.ok(
  storage.includes("Signal, trigger, suggested/requested-share and plan records cannot be converted into actual holdings"),
  "storage contract must prohibit plan/signal/share inference into actual holdings",
);

console.log(JSON.stringify({
  ok: true,
  correction: "S2-CORR-20261004-002",
  implementedState: "VIRTUAL_POSITION_READY",
  actualHoldingsState: "USER_UPLOADED_BROKER_SCREENSHOT_AUTHORIZED",
  actualPositionMonitorVerified: false,
  brokerApiAuthorized: false,
  realOrdersEnabled: false,
  protectedBoundary: "NO_SYSTEM1_HOLDINGS_IMPORT_WITHOUT_OWNER_AUTHORIZATION",
}, null, 2));
