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

assert.match(workflow,/run_readonly_auth_diagnostic_v0_1\.mjs/);
assert.match(workflow,/if:\s+always\(\)/);
assert.match(workflow,/auth-diagnostic\.json/);
assert.match(workflow,/D1_READ_PREFLIGHT_PASS/);
assert(workflow.indexOf("Diagnose each account") < workflow.indexOf("Collect both accounts metadata"));
const auth = readFileSync("system2/migration/cloudflare_auth_diagnostic_v0_1.mjs","utf8");
const authRunner = readFileSync("system2/migration/run_readonly_auth_diagnostic_v0_1.mjs","utf8");
assert.match(auth,/method: "GET"/);
assert.doesNotMatch(auth,/method:\s*"(?:POST|PUT|PATCH|DELETE)"/);
assert.match(auth,/\/user\/tokens\/verify/);
assert.match(auth,/\/d1\/database\?page=1/);
assert.match(authRunner,/role:"SOURCE"/);
assert.match(authRunner,/role:"DESTINATION"/);
assert.doesNotMatch(authRunner,/JSON\.stringify\(process\.env\)/);
assert.doesNotMatch(authRunner,/console\.log\([^\n]*apiToken/);


assert.match(workflow,/run_readonly_services_diagnostic_v0_1\.mjs/);
assert.match(workflow,/service-diagnostic\.json/);
assert.match(workflow,/SERVICES_READ_PREFLIGHT_PASS/);
assert(workflow.indexOf("Diagnose SOURCE and DESTINATION D1") < workflow.indexOf("Collect both accounts metadata"));
const serviceCode = readFileSync("system2/migration/cloudflare_services_readonly_diagnostic_v0_1.mjs","utf8");
assert.match(serviceCode,/method:"GET"/);
assert.doesNotMatch(serviceCode,/method:\s*"(?:POST|PUT|PATCH|DELETE)"/);
assert.match(serviceCode,/R2_ACCOUNT_NOT_ENTITLED/);
assert.match(serviceCode,/R2_READ_PERMISSION_DENIED/);
assert.doesNotMatch(serviceCode,/JSON\.stringify\(process\.env\)/);


assert.match(workflow,/PARTIAL_READONLY_INVENTORY_DEST_R2_NOT_ENTITLED/);
assert.match(workflow,/r2\?\.errorCode===10042/);
assert.match(workflow,/BLOCKED_SERVICE_READS/);
assert.match(runner,/allowedR2Skip/);
assert.match(runner,/SERVICE_ATTESTATION_MISSING_OR_UNSAFE/);
assert.match(runner,/r2Mode: allowedR2Skip \? "KNOWN_NOT_ENTITLED"/);
assert.match(inventory,/r2BucketsVerified: privateInventory.r2BucketsVerified/);
assert.match(inventory,/complete: r2BucketsVerified/);
assert.match(inventory,/UNKNOWN/); // size fingerprint unknown must not be treated as complete data readback

console.log("System2 migration GitHub workflow / scripts static isolation PASS");
