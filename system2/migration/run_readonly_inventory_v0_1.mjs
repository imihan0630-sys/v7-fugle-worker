import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { collectCloudflareInventory, publicCloudflareInventory } from "./cloudflare_inventory_readonly_v0_1.mjs";
import { assessCrossAccountMigrationPreflight } from "./cross_account_preflight_v0_1.mjs";

assert.equal(process.env.S2_MIGRATION_READ_ONLY_ACK, "INVENTORY_ONLY_NO_MUTATION", "explicit read-only acknowledgment required");
const sourceAccountId = process.env.S2_MIGRATION_SOURCE_ACCOUNT_ID;
const destinationAccountId = process.env.S2_MIGRATION_DESTINATION_ACCOUNT_ID;
assert.match(sourceAccountId || "", /^[0-9a-f]{32}$/i);
assert.match(destinationAccountId || "", /^[0-9a-f]{32}$/i);
assert.notEqual(sourceAccountId.toLowerCase(), destinationAccountId.toLowerCase(), "SOURCE_DESTINATION_ACCOUNT_COLLISION");
// The service receipt is produced in this same job from the same GitHub Environment secret snapshot.
// No service can be silently skipped just because it returned 403. 10042 is the one allowed exception.
const evidenceFile="/tmp/system2-cross-account-inventory/service-diagnostic.json";
const evidence=JSON.parse(await readFile(evidenceFile,"utf8"));
const servicesFor=(v,role)=>v?.role===role && Array.isArray(v.services) && v.services.length===4 &&
  new Set(v.services.map(s=>s.service)).size===4;
const granted=(v,name)=>v.services.find(s=>s.service===name)?.classification==="READ_GRANTED";
const sourceReady=servicesFor(evidence.source,"SOURCE") &&
  ["D1","WORKERS","KV","R2"].every(s=>granted(evidence.source,s));
const destinationReady=servicesFor(evidence.destination,"DESTINATION") &&
  ["D1","WORKERS","KV"].every(s=>granted(evidence.destination,s));
const destR2=evidence.destination?.services?.find(s=>s.service==="R2");
const allowedR2Skip=evidence.status==="BLOCKED_SERVICE_READS" && sourceReady && destinationReady &&
  destR2?.classification==="R2_ACCOUNT_NOT_ENTITLED" && destR2?.httpStatus===403 &&
  destR2?.errorCode===10042;
const fullReady=evidence.status==="SERVICES_READ_PREFLIGHT_PASS" && sourceReady &&
  destinationReady && granted(evidence.destination,"R2");
assert(fullReady || allowedR2Skip,"SERVICE_ATTESTATION_MISSING_OR_UNSAFE");
const source = await collectCloudflareInventory({
  accountId: sourceAccountId,
  apiToken: process.env.S2_MIGRATION_SOURCE_READ_TOKEN,
});
const destination = await collectCloudflareInventory({
  accountId: destinationAccountId,
  apiToken: process.env.S2_MIGRATION_DESTINATION_READ_TOKEN,
  r2Mode: allowedR2Skip ? "KNOWN_NOT_ENTITLED" : "REQUIRED",
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
  result:allowedR2Skip ? "READ_ONLY_PARTIAL_R2_NOT_ENTITLED" : "READ_ONLY_INVENTORY_CAPTURED",
  source:{databaseCount:source.databases.length,workerCount:source.workers.length,bucketCount:source.buckets.length,kvCount:source.kvNamespaces.length},
  destination:{databaseCount:destination.databases.length,workerCount:destination.workers.length,bucketCount:destination.r2BucketsVerified === false ? null : destination.buckets.length,kvCount:destination.kvNamespaces.length},
  preflight:report.state,
  blockedBy:report.blockers,
  cloudResourcesCreated:false,
  sourceDataCopied:false,
  fullMigrationReady:false,
  r2SkippedWithCode10042:allowedR2Skip,
}));
