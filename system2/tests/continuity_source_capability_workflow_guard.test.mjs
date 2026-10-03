import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(
  new URL("../../.github/workflows/system2-continuity-source-capability-readonly.yml",import.meta.url),
  "utf8",
);
const runtime=await readFile(
  new URL("../runtime/fugle_corporate_action_capability_v0_1.mjs",import.meta.url),
  "utf8",
);
const script=await readFile(
  new URL("../scripts/probe_fugle_corporate_actions_readonly_v0_1.mjs",import.meta.url),
  "utf8",
);

assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/FUGLE_API_KEY/);
assert.match(workflow,/continuity_source_capability_workflow_guard\.test\.mjs/);
assert.match(workflow,/git diff --exit-code -- Worker\.js wrangler\.toml/);
assert.doesNotMatch(workflow,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|SYSTEM2_DB|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL/);
assert.doesNotMatch(workflow,/wrangler.*deploy|secret put/);
assert.doesNotMatch(workflow,/^\s*schedule:/m);

assert.match(runtime,/corporate-actions\/dividends/);
assert.match(runtime,/corporate-actions\/capital-changes/);
assert.match(runtime,/sourceCoverageComplete:false/);
assert.match(runtime,/noEventMayBeClaimed:false/);
assert.match(runtime,/symbolSessionCompletenessCertified:false/);
assert.match(runtime,/technicalContinuityCertified:false/);
assert.match(runtime,/continuityTransformPerformed:false/);
assert.match(runtime,/historyMutationPerformed:false/);
assert.match(runtime,/selectionAuthority:false/);
assert.match(runtime,/system1RuntimeUsed:false/);
assert.doesNotMatch(runtime,/INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|REPLACE\s+INTO/i);
assert.doesNotMatch(runtime,/\.run\s*\(|\.batch\s*\(/);

assert.match(script,/readOnly:true/);
assert.match(script,/technicalContinuityCertified,false/);
assert.doesNotMatch(script,/CLOUDFLARE|SYSTEM2_DB|Worker\.js|wrangler/);

console.log("System2 continuity source capability read-only workflow guard tests passed");
