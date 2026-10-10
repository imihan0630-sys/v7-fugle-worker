import {mkdir,writeFile} from "node:fs/promises";
import {diagnoseCloudflareReadAccess,confirmTwoAccountAuthDiagnostic} from "./cloudflare_auth_diagnostic_v0_1.mjs";
// Dedicated GitHub Environment secrets. Neither secrets nor account IDs must be logged.
if (process.env.S2_MIGRATION_READ_ONLY_ACK !== "INVENTORY_ONLY_NO_MUTATION") throw new Error("READ_ONLY_CONFIRMATION_REQUIRED");
const sourceId = process.env.S2_MIGRATION_SOURCE_ACCOUNT_ID;
const destinationId = process.env.S2_MIGRATION_DESTINATION_ACCOUNT_ID;
const collision = typeof sourceId === "string" && typeof destinationId === "string" &&
  sourceId.length > 0 && sourceId.toLowerCase() === destinationId.toLowerCase();
const [source, destination] = await Promise.all([
  diagnoseCloudflareReadAccess({role:"SOURCE",accountId:sourceId,apiToken:process.env.S2_MIGRATION_SOURCE_READ_TOKEN}),
  diagnoseCloudflareReadAccess({role:"DESTINATION",accountId:destinationId,apiToken:process.env.S2_MIGRATION_DESTINATION_READ_TOKEN}),
]);
const status = collision ? "BLOCKED_ACCOUNT_ID_COLLISION" : confirmTwoAccountAuthDiagnostic({source,destination});
const receipt = Object.freeze({version:"S2_CROSS_ACCOUNT_READONLY_AUTH_DIAG_V0_1",status,source,destination,
  cloudMutations:false,storageMigration:false,secretsPrinted:false});
const dir="/tmp/system2-cross-account-inventory";
await mkdir(dir,{recursive:true,mode:0o700});
await writeFile(dir + "/auth-diagnostic.json",JSON.stringify(receipt,null,2)+"\n",{mode:0o600});
console.log(JSON.stringify(receipt));
// Do NOT throw before writing receipt. Workflow artifact is available even for blocked auth.
// A separate fail-closed workflow step gates the full metadata inventory.
