import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(
  new URL("../../.github/workflows/system2-current-listing-metadata-readonly.yml", import.meta.url),
  "utf8",
);
const runtime=await readFile(
  new URL("../runtime/current_listing_metadata_v0_1.mjs", import.meta.url),
  "utf8",
);
const script=await readFile(
  new URL("../scripts/audit_current_listing_metadata_readonly_v0_1.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /current_listing_metadata_v0_1\.test\.mjs/);
assert.match(workflow, /current_listing_metadata_workflow_guard\.test\.mjs/);
assert.match(workflow, /git diff --exit-code -- Worker\.js wrangler\.toml/);
assert.doesNotMatch(workflow, /FUGLE_API_KEY|CLOUDFLARE|wrangler.*deploy|secret put|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL/);
assert.match(runtime, /openapi\.twse\.com\.tw\/v1\/opendata\/t187ap03_L/);
assert.match(runtime, /tpex\.org\.tw\/openapi\/v1\/mopsfin_t187ap03_O/);
assert.match(runtime, /上市日期/);
assert.match(runtime, /上櫃日期/);
assert.doesNotMatch(runtime, /INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|\.run\s*\(|\.batch\s*\(/i);
assert.doesNotMatch(script, /INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|\.run\s*\(|\.batch\s*\(/i);
assert.match(script, /selectionAuthority: false/);
assert.match(script, /continuityPromotionPerformed: false/);
assert.match(script, /system1RuntimeUsed: false/);

console.log("System2 current listing metadata workflow guard tests passed");