import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(
  new URL("../../.github/workflows/system2-historical-inventory-readonly.yml", import.meta.url),
  "utf8",
);
const script=await readFile(
  new URL("../scripts/audit_historical_inventory_readonly_v0_1.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /historical_inventory_readonly_workflow_guard\.test\.mjs/);
assert.match(workflow, /audit_historical_inventory_readonly_v0_1\.mjs/);
assert.match(workflow, /git diff --exit-code -- Worker\.js wrangler\.toml/);
assert.doesNotMatch(workflow, /wrangler.*deploy|secret put|FUGLE_API_KEY|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL/);
assert.doesNotMatch(script, /INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|REPLACE\s+INTO/i);
assert.doesNotMatch(script, /\.run\s*\(|\.batch\s*\(/);
assert.match(script, /s2_historical_a1_bars/);
assert.match(script, /s2_historical_universe_memberships/);
assert.match(script, /s2_historical_a1_packs/);
assert.match(script, /s2_historical_a1_pack_manifests/);
assert.match(script, /s2_historical_segment_ingest_receipts/);
assert.match(script, /s2_historical_segment_backfill_checkpoints/);
assert.match(script, /s2_historical_a1_segment_manifests/);
assert.match(script, /D1_CONTROL_PLANE_ONLY_R2_BYTE_VERIFICATION_SEPARATE/);
assert.match(script, /rowsWritten !== 0/);
assert.match(script, /mutationPerformed: false/);
assert.match(script, /system1RuntimeUsed: false/);

console.log("System2 historical inventory read-only workflow guard tests passed");
