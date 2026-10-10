import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { collectCloudflareInventory, publicCloudflareInventory } from "./cloudflare_inventory_readonly_v0_1.mjs";
import { assessCrossAccountMigrationPreflight } from "./cross_account_preflight_v0_1.mjs";

assert.equal(process.env.S2_MIGRATION_READ_ONLY_ACK, "INVENTORY_ONLY_NO_MUTATION", "explicit read-only acknowledgment required");
const sourceAccountId = process.env.S2_MIGRATION_SOURCE_ACCOUNT_ID;
const destinationAccountId = process.env.S2_MIGRATION_DESTINATION_ACCOUNT_ID;
assert.match(sourceAccountId || "", /^[0-9a-f]{32}$/i);
assert.match(destinationAccountId || "", /^[0-9a-f]{32}$/i);
assert.notEqual(sourceAccountId.toLowerCase(), destinationAccountId.toLowerCase(), "SOURCE_DESTINATION_ACCOUNT_COLLISION");
const source = await collectCloudflareInventory({
  accountId: sourceAccountId,
  apiToken: process.env.S2_MIGRATION_SOURCE_READ_TOKEN,
});
const destination = await collectCloudflareInventory({
  accountId: destinationAccountId,
  apiToken: process.env.S2_MIGRATION_DESTINATION_READ_TOKEN,
});
const report = assessCrossAccountMigrationPreflight({source,destination});
// No backup manifest passed: physical migration authority must remain false.
assert.equal(report.authorizedToMutate, false);
assert.equal(report.sourceDataCopied, false);
const output = process.env.S2_MIGRATION_INVENTORY_DIR || "/tmp/system2-cross-account-inventory";
await mkdir(output, {recursive:true,mode:0o700});
for (const [name,data] of [
  ["source-inventory.json",publicCloudflareInventory(source)],
  ["destination-inventory.json",publicCloudflareInventory(destination)],
  ["preflight.json",report],
]) {
  await writeFile(output + "/" + name,JSON.stringify(data,null,2) + "\n",{mode:0o600});
}
console.log(JSON.stringify({
  result:"READ_ONLY_INVENTORY_CAPTURED",
  source:{databaseCount:source.databases.length,workerCount:source.workers.length,bucketCount:source.buckets.length,kvCount:source.kvNamespaces.length},
  destination:{databaseCount:destination.databases.length,workerCount:destination.workers.length,bucketCount:destination.buckets.length,kvCount:destination.kvNamespaces.length},
  preflight:report.state,
  blockedBy:report.blockers,
  cloudResourcesCreated:false,
  sourceDataCopied:false,
}));
