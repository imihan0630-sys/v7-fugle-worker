import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-source-arrival-readonly.yml", import.meta.url),
  "utf8",
);
const runner = await readFile(
  new URL("../scripts/measure_source_arrival_readonly.mjs", import.meta.url),
  "utf8",
);
const probes = await readFile(
  new URL("../runtime/official_source_probes.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /workflow_dispatch:/);
assert.doesNotMatch(workflow, /^\s*schedule:/m);
assert.match(workflow, /permissions:\s*\n\s*contents: read/);
assert.doesNotMatch(workflow, /wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
assert.doesNotMatch(workflow, /SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
assert.doesNotMatch(workflow, /fugle-test|V7_DB|STOCKS_KV/i);
assert.doesNotMatch(`${runner}\n${probes}`, /method:\s*["'](POST|PUT|PATCH|DELETE)["']/i);
assert.doesNotMatch(`${runner}\n${probes}`, /fugle-test|V7_DB|STOCKS_KV/i);
assert.match(probes, /method: "GET"/);

console.log("System2 source-arrival read-only workflow guard tests passed");
