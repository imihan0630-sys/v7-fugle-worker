import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-official-continuity-source-capability-readonly.yml", import.meta.url),
  "utf8",
);
const runtime = await readFile(
  new URL("../runtime/official_continuity_source_capability_v0_1.mjs", import.meta.url),
  "utf8",
);
const script = await readFile(
  new URL("../scripts/probe_official_continuity_sources_readonly_v0_1.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /official_continuity_source_capability_v0_1\.test\.mjs/);
assert.match(workflow, /official_continuity_source_capability_workflow_guard\.test\.mjs/);
assert.match(workflow, /git diff --exit-code -- Worker\.js wrangler\.toml/);
assert.doesNotMatch(workflow, /FUGLE_API_KEY|CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|SYSTEM2_DB|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL/);
assert.doesNotMatch(workflow, /wrangler.*deploy|secret put/);
assert.doesNotMatch(workflow, /^\s*schedule:/m);

assert.match(runtime, /openapi\.twse\.com\.tw\/v1\/exchangeReport\/TWT48U_ALL/);
assert.match(runtime, /TWT49U/);
assert.match(runtime, /TWTAUU/);
assert.match(runtime, /TWTB8U/);
assert.match(runtime, /prepost_result\.php/);
assert.match(runtime, /\/www\/zh-tw\/bulletin\/exDailyQ/);
assert.match(runtime, /\/www\/zh-tw\/bulletin\/revivt/);
assert.match(runtime, /\/www\/zh-tw\/bulletin\/pvChgRslt/);
assert.doesNotMatch(runtime, /revivt_result\.php/);
assert.match(runtime, /legacyTpexCapitalReductionTransportRetired: true/);
assert.match(runtime, /sourceCoverageComplete: false/);
assert.match(runtime, /noEventMayBeClaimed: false/);
assert.match(runtime, /symbolSessionCompletenessCertified: false/);
assert.match(runtime, /technicalContinuityCertified: false/);
assert.match(runtime, /continuityTransformPerformed: false/);
assert.match(runtime, /historyMutationPerformed: false/);
assert.match(runtime, /selectionAuthority: false/);
assert.match(runtime, /system1RuntimeUsed: false/);
assert.doesNotMatch(runtime, /INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|REPLACE\s+INTO/i);
assert.doesNotMatch(runtime, /\.run\s*\(|\.batch\s*\(/);

assert.match(script, /readOnly: true/);
assert.match(script, /technicalContinuityCertified, false/);
assert.doesNotMatch(script, /FUGLE_API_KEY|CLOUDFLARE|SYSTEM2_DB|Worker\.js|wrangler/);

console.log("System2 official continuity source capability workflow guard tests passed");
