import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const workflow = readFileSync(".github/workflows/system2-cross-account-inventory-readonly.yml","utf8");
const inventory = readFileSync("system2/migration/cloudflare_inventory_readonly_v0_1.mjs","utf8");
const runner = readFileSync("system2/migration/run_readonly_inventory_v0_1.mjs","utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.doesNotMatch(workflow,/^\s{2}(push|schedule|pull_request):/m);
assert.match(workflow,/environment: system2-migration/);
assert.match(workflow,/permissions:\s*\n\s+contents: read/);
for (const secret of [
"S2_MIGRATION_SOURCE_ACCOUNT_ID","S2_MIGRATION_SOURCE_READ_TOKEN",
"S2_MIGRATION_DESTINATION_ACCOUNT_ID","S2_MIGRATION_DESTINATION_READ_TOKEN"
]) {
 assert(workflow.includes("secrets."+secret),"missing dedicated environment secret: "+secret);
 assert(runner.includes("process.env."+secret),"runner cannot read dedicated secret: "+secret);
}
assert.match(workflow,/INVENTORY_ONLY_NO_MUTATION/);
assert.match(workflow,/run_readonly_inventory_v0_1\.mjs/);
assert.doesNotMatch(workflow,/(?:^|\s)(?:npm\s+exec|npx\s+wrangler|wrangler\s+(?:deploy|secret|d1|r2)|terraform\s+apply)|--deploy|\bPOST\s+https/m);
assert.match(inventory,/method: "GET"/);
assert.doesNotMatch(inventory,/\bmethod:\s*"(?:POST|PUT|PATCH|DELETE)"/);
assert.doesNotMatch(inventory,/\/d1\/database\/\$\{.*\}\/query/);
assert.match(runner,/assert\.notEqual\(sourceAccountId\.toLowerCase\(\), destinationAccountId\.toLowerCase\(\)/);
for (const file of ["system2/migration/cloudflare_inventory_readonly_v0_1.mjs","system2/migration/run_readonly_inventory_v0_1.mjs",
"system2/migration/cross_account_preflight_v0_1.mjs","system2/migration/cross_account_storage_reconciliation_v0_1.mjs"]) {
 execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
}
console.log("System2 migration GitHub workflow / scripts static isolation PASS");
