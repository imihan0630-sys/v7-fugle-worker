import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-required-dependency-readonly.yml", import.meta.url),
  "utf8",
);
const probes = await readFile(
  new URL("../runtime/required_dependency_probes.mjs", import.meta.url),
  "utf8",
);
const script = await readFile(
  new URL("../scripts/measure_required_dependencies_readonly.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /workflow_dispatch:/);
assert.match(workflow, /permissions:\s*\n\s*contents: read/);
assert.doesNotMatch(workflow, /wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
assert.doesNotMatch(workflow, /SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
assert.doesNotMatch(`${probes}\n${script}`, /method:\s*["\'](POST|PUT|PATCH|DELETE)["\']/i);
assert.doesNotMatch(`${probes}\n${script}`, /fugle-test|V7_DB|STOCKS_KV/i);
assert.match(probes, /method: "GET"/);

console.log("System2 required-dependency workflow guard tests passed");
