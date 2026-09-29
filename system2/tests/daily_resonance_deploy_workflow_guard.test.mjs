import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-resonance-deploy.yml", import.meta.url),
  "utf8",
);
const config = await readFile(
  new URL("../deploy/wrangler.system2.example.toml", import.meta.url),
  "utf8",
);
const worker = await readFile(
  new URL("../deploy/worker.mjs", import.meta.url),
  "utf8",
);
const workerCore = await readFile(
  new URL("../deploy/worker_core.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /SYSTEM2_CONFIRM: CREATE_SYSTEM2_ISOLATED_D1/);
assert.match(workflow, /secrets\.FUGLE_API_KEY/);
assert.match(workflow, /provision_system2_d1\.mjs/);
assert.match(workflow, /system2-shadow-research/);
assert.match(workflow, /! grep -Eq 'V7_DB\|STOCKS_KV\|PUSH_WEBHOOK_URL\|THREEMIN'/);

assert.match(config, /workers_dev = true/);
assert.match(config, /preview_urls = false/);
assert.match(config, /SYSTEM2_CAPTURE_ENABLED = "false"/);
assert.match(config, /SYSTEM2_RESONANCE_ENABLED = "true"/);
assert.match(config, /crons = \["\*\/5 0-5 \* \* 1-5", "0 11 \* \* 1-5"\]/);
assert.doesNotMatch(config, /^routes\s*=/m);

assert.match(workerCore, /BOUNDED_PRESELECTED_ONLY/);
assert.match(worker, /NO_ACTIVE_PRESELECTED_POOL/);
assert.match(worker, /officialSessionCloseConfirmed/);
assert.match(worker, /\/api\/system2\/resonance/);
assert.doesNotMatch(worker, /PUSH_WEBHOOK_URL|STOCKS_KV|V7_DB|fetchAllSymbols/i);

console.log("System2 daily resonance deploy workflow guard tests passed");
