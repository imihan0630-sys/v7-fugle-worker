import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import {
  DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3,
  DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION,
} from "../runtime/decision_clock_collector_contract_v0_3.mjs";

const manifest = JSON.parse(await readFile(
  new URL("../contracts/decision_clock_collector_freeze_v0_1.json", import.meta.url),
  "utf8",
));

assert.equal(
  manifest.freezeVersion,
  "S2_DECISION_CLOCK_COLLECTOR_FREEZE_GUARD_V0_1",
);
assert.equal(manifest.contractVersion, DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION);
assert.equal(manifest.frozenBeforeFirstProspectiveSample, true);
assert.equal(manifest.firstEligibleProspectiveMarketDate, "2026-09-29");
assert.equal(manifest.hashSemantics, "GIT_BLOB_HASH_V0_1");

const expectedPaths = [...DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3].sort();
const manifestPaths = manifest.files.map((x) => x.path).sort();
assert.deepEqual(manifestPaths, expectedPaths);

for (const entry of manifest.files) {
  assert.match(entry.gitBlobSha, /^[0-9a-f]{40,64}$/);
  const actual = execFileSync(
    "git",
    ["hash-object", "--", entry.path],
    { cwd: process.cwd(), encoding: "utf8" },
  ).trim();
  assert.equal(
    actual,
    entry.gitBlobSha,
    [
      "Decision Clock collector freeze guard detected content drift:",
      entry.path,
      "expected git blob " + entry.gitBlobSha,
      "actual git blob " + actual,
      "A material collector change after evidence starts requires a separately",
      "preregistered evidence epoch/contract version and an explicit freeze-baseline",
      "revision; do not silently refresh this hash.",
    ].join("\n"),
  );
}

console.log(
  "System2 Decision Clock collector freeze guard V0.1 PASS; frozen files="
  + manifest.files.length,
);
