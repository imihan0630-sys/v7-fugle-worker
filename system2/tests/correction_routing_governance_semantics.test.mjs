import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const system2Root = path.resolve(here, "..");
const repoRoot = path.resolve(system2Root, "..");

const readSystem2 = (relativePath) =>
  fs.readFileSync(path.join(system2Root, relativePath), "utf8");
const readRepo = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const master = readSystem2("SYSTEM2_MASTER.md");
const correctionGovernance = readSystem2("SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md");
const laneGovernance = readSystem2("SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md");
const checkpoint = readSystem2("SYSTEM2_CHECKPOINT.md");
const progressMap = readSystem2("SYSTEM2_BUILD_PROGRESS_MAP.md");
const registry = JSON.parse(readRepo("shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json"));

assert.ok(
  !master.includes("CRITICAL/HIGH directives may be implemented by the build/control room"),
  "severity must not imply BUILD_LANE implementation ownership",
);
assert.ok(
  master.includes("Severity does not grant implementation ownership"),
  "Master must explicitly separate severity from implementation ownership",
);
assert.ok(
  master.includes("BUILD_LANE may implement only corrections formally assigned to `LOCAL_FIX / BUILD_LANE`"),
  "Master must restrict BUILD_LANE to formally assigned LOCAL_FIX/BUILD_LANE corrections",
);
assert.ok(
  master.includes("routingClass / assignedLane / modificationOwner"),
  "Master must require formal routing ownership fields",
);

assert.ok(
  correctionGovernance.includes("Three independent dimensions must remain separate"),
  "Correction Governance must distinguish severity, implementation ownership and verification authority",
);
assert.ok(
  correctionGovernance.includes("implementation ownership**: `routingClass / assignedLane / modificationOwner`"),
  "Correction Governance must bind ownership to routing fields",
);
assert.ok(
  correctionGovernance.includes("executes only LOCAL_FIX/BUILD_LANE work assigned to it"),
  "BUILD_LANE execution must be assignment-gated",
);
assert.ok(
  correctionGovernance.includes("may not self-seize another lane's conflict unit"),
  "ownership transfer must not happen implicitly in chat",
);
assert.ok(
  correctionGovernance.includes("formally assigned implementation lane has durable implementation evidence"),
  "FIX_IMPLEMENTED must belong to the assigned implementation lane",
);
assert.ok(
  !correctionGovernance.includes("builder may implement but may not self-close"),
  "ambiguous builder wording must not return",
);
assert.ok(
  !correctionGovernance.includes("`FIX_IMPLEMENTED` means the builder"),
  "FIX_IMPLEMENTED wording must not imply BUILD_LANE",
);
assert.ok(
  correctionGovernance.includes("CRITICAL and HIGH directives cannot move directly from `FIX_IMPLEMENTED` to `VERIFIED_CLOSED` by the same implementation role"),
  "independent closure rule must remain intact",
);

assert.ok(
  laneGovernance.includes("Severity and routing are independent dimensions"),
  "Execution Lane Governance remains authoritative on severity/routing independence",
);
assert.ok(
  laneGovernance.includes("execute only LOCAL_FIX / BUILD_LANE items assigned to it"),
  "Execution Lane Governance must retain BUILD assignment restriction",
);
assert.ok(
  laneGovernance.includes("not seize DATA_LANE or REMEDIATION_LANE work merely because it is HIGH"),
  "Execution Lane Governance must retain anti-seizure rule",
);

assert.ok(
  checkpoint.includes("severity and routing are separate"),
  "System2 Checkpoint must retain severity/routing separation",
);
assert.ok(
  checkpoint.includes("execute only BUILD_LANE/LOCAL_FIX work assigned to it"),
  "System2 Checkpoint must retain BUILD assignment restriction",
);

const system2Registration = registry.identities.find((entry) => entry.id === "SYSTEM2");
assert.ok(system2Registration, "SYSTEM2 bootstrap registration must exist");
assert.ok(
  system2Registration.shortStart.includes("執行分派給 BUILD_LANE／LOCAL_FIX 的工作"),
  "bootstrap must route BUILD_LANE only to assigned BUILD/LOCAL work",
);
assert.ok(
  system2Registration.shortStart.includes("禁止搶做 DATA_LANE／REMEDIATION_LANE"),
  "bootstrap must forbid BUILD_LANE from seizing DATA/REMEDIATION work",
);

assert.ok(
  progressMap.includes("shared 22-domain / 354-module research"),
  "Build Progress Map must reflect the formal 22-domain / 354-module research universe",
);
assert.ok(
  !progressMap.includes("shared 18-domain research"),
  "obsolete 18-domain wording must not return",
);

console.log(JSON.stringify({
  ok: true,
  correction: "S2-CORR-20261004-003",
  severityImpliesBuildOwnership: false,
  buildExecutionAuthority: "ASSIGNED_LOCAL_FIX_OR_BUILD_LANE_ONLY",
  ownershipTransfer: "FORMAL_QUEUE_UPDATE_REQUIRED",
  criticalHighClosure: "INDEPENDENT_VERIFICATION_REQUIRED",
  researchUniverse: "22-domain / 354-module",
}, null, 2));
