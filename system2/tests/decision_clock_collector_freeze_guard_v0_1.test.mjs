import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import {
  DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3,
  DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION as LEGACY_CONTRACT_VERSION,
} from "../runtime/decision_clock_collector_contract_v0_3.mjs";
import {
  DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_4,
  DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION,
  DECISION_CLOCK_COLLECTOR_EVIDENCE_EPOCH,
} from "../runtime/decision_clock_collector_contract_v0_4.mjs";

const oldFile=new URL("../contracts/decision_clock_collector_freeze_v0_1.json",import.meta.url);
const newFile=new URL("../contracts/decision_clock_collector_freeze_v0_2.json",import.meta.url);
const legacy=JSON.parse(await readFile(oldFile,"utf8"));
const next=JSON.parse(await readFile(newFile,"utf8"));

// The original historical frozen manifest must NEVER be altered or rewritten.
// Its 13 old file blobs describe the original 2026-09-29 observer and are not
// falsely asserted to be the currently running contract after a new epoch.
assert.equal(legacy.freezeVersion,"S2_DECISION_CLOCK_COLLECTOR_FREEZE_GUARD_V0_1");
assert.equal(legacy.contractVersion,LEGACY_CONTRACT_VERSION);
assert.equal(legacy.frozenBeforeFirstProspectiveSample,true);
assert.equal(legacy.firstEligibleProspectiveMarketDate,"2026-09-29");
assert.deepEqual(
  legacy.files.map(x=>x.path).sort(),
  [...DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3].sort(),
);
assert.equal(next.previousFreezeManifestGitBlobSha,
  "7ae0ce4e46f7244f630ad0ae9de202d23aa96b30");
const originalHash=execFileSync(
  "git",["hash-object","system2/contracts/decision_clock_collector_freeze_v0_1.json"],
  {cwd:process.cwd(),encoding:"utf8"},
).trim();
assert.equal(originalHash,next.previousFreezeManifestGitBlobSha,
  "Historical V0.1 freeze manifest was mutated: original observation evidence is no longer immutable");

// A separate, fully preregistered V0.4 semantic epoch now owns the current
// observer. The current freeze cannot be silently refreshed or use old dates.
assert.equal(next.freezeVersion,"S2_DECISION_CLOCK_COLLECTOR_FREEZE_GUARD_V0_2");
assert.equal(next.contractVersion,DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION);
assert.equal(next.evidenceEpoch,DECISION_CLOCK_COLLECTOR_EVIDENCE_EPOCH);
assert.equal(next.previousFreezeVersion,legacy.freezeVersion);
assert.equal(next.frozenBeforeFirstProspectiveSample,true);
assert.equal(next.firstEligibleProspectiveMarketDate,null);
assert.equal(next.startRule,"FIRST_OFFICIAL_TRADING_DAY_AFTER_MAIN_MERGE_AND_INDEPENDENT_REVALIDATION");
assert.match(next.legacyEvidencePolicy,/never pool with V0.4/i);
assert.equal(next.hashSemantics,"GIT_BLOB_HASH_V0_1");
assert.deepEqual(
  next.files.map(x=>x.path).sort(),
  [...DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_4].sort(),
);
assert.equal(next.files.length,15);
for(const entry of next.files){
  assert.match(entry.gitBlobSha,/^[0-9a-f]{40}$/);
  const actual=execFileSync("git",["hash-object","--",entry.path],{
    cwd:process.cwd(),encoding:"utf8",
  }).trim();
  assert.equal(actual,entry.gitBlobSha,
    "New collector V0.4 epoch drift detected: "+entry.path+
    ". Do not update hashes without a separately preregistered next epoch.");
}
console.log("System2 Decision Clock legacy freeze immutable + separate V0.4 epoch freeze PASS");
