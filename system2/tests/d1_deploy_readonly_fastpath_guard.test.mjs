import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const ensure = await readFile(new URL("../deploy/ensure_system2_d1_ready.mjs", import.meta.url), "utf8");
const workflow = await readFile(new URL("../../.github/workflows/system2-resonance-deploy.yml", import.meta.url), "utf8");

assert.match(ensure,/READ_ONLY_FAST_PATH/);
assert.match(ensure,/schemaMutationPerformed:\s*false/);
assert.match(ensure,/SELECT name FROM sqlite_schema/);
assert.match(ensure,/SELECT schema_value FROM s2_schema_meta/);
assert.doesNotMatch(ensure,/INSERT INTO|UPDATE\s+s2_|DELETE FROM/i);
assert.match(ensure,/await import\("\.\/provision_system2_d1\.mjs"\)/);

assert.match(workflow,/ensure_system2_d1_ready\.mjs/);
assert.doesNotMatch(workflow,/run:\s*node system2\/deploy\/provision_system2_d1\.mjs/);

console.log("System2 D1 deploy read-only fast-path guard tests PASS");
