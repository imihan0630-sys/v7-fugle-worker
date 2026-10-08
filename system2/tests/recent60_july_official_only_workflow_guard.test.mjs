import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { FROZEN_RECENT60_SAMPLE_BLOB_SHA } from
  "../runtime/recent60_july_hot_cold_source_readonly_v0_1.mjs";

const workflow=await readFile(new URL("../../.github/workflows/system2-recent60-july-official-source-only.yml",import.meta.url),"utf8");
const runner=await readFile(new URL("../scripts/audit_recent60_july_official_without_d1_v0_1.mjs",import.meta.url),"utf8");
const frozenPath="system2/evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json";
assert.equal(execFileSync("git",["hash-object",frozenPath],{
  cwd:process.cwd(),encoding:"utf8",
}).trim(),FROZEN_RECENT60_SAMPLE_BLOB_SHA);

assert.match(workflow,/permissions:\s*\n\s+contents: read/);
assert.match(workflow,/system2-recent60-july-official-source-only/);
assert.match(workflow,/audit_recent60_july_official_without_d1_v0_1\.mjs/);
assert.doesNotMatch(workflow,/secrets\.|CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN/i);
assert.doesNotMatch(workflow,/wrangler|provision_system2_d1|D1.*(INSERT|UPDATE|DELETE)|fugle-test/i);
assert.match(runner,/probeJulyOfficialSourceReadonlyV0_1/);
assert.match(runner,/FROZEN_RECENT60_SAMPLE_BLOB_SHA/);
assert.match(runner,/PARTIAL_OFFICIAL_DATE_RETRIEVAL_UNVERIFIED/);
assert.match(runner,/historicalPITOrFirstKnownAtCertified:false/);
assert.match(runner,/d1Reads:0,d1Writes:0/);
assert.doesNotMatch(runner,/createRemoteD1RestAdapter|createRemoteR2S3Adapter/);
assert.doesNotMatch(runner,/\.prepare\s*\(|\.run\s*\(|\.batch\s*\(|putIfAbsent\s*\(/);

console.log("System2 recent60 July official-source-only no-Cloudflare CI guard PASS");
