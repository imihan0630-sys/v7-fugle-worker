import {mkdir,writeFile} from "node:fs/promises";
import {diagnoseCloudflareServicesReadOnly,assessTwoAccountServiceReads}
  from "./cloudflare_services_readonly_diagnostic_v0_1.mjs";

if(process.env.S2_MIGRATION_READ_ONLY_ACK!=="INVENTORY_ONLY_NO_MUTATION") throw Error("READ_ONLY_CONFIRMATION_REQUIRED");
const sourceId=process.env.S2_MIGRATION_SOURCE_ACCOUNT_ID;
const destId=process.env.S2_MIGRATION_DESTINATION_ACCOUNT_ID;
const collision=typeof sourceId==="string"&&typeof destId==="string"&&!!sourceId &&
  sourceId.toLowerCase()===destId.toLowerCase();
const [source,destination]=await Promise.all([
  diagnoseCloudflareServicesReadOnly({role:"SOURCE",accountId:sourceId,apiToken:process.env.S2_MIGRATION_SOURCE_READ_TOKEN}),
  diagnoseCloudflareServicesReadOnly({role:"DESTINATION",accountId:destId,apiToken:process.env.S2_MIGRATION_DESTINATION_READ_TOKEN}),
]);
const status=assessTwoAccountServiceReads({source,destination,accountCollision:collision});
const receipt=Object.freeze({
  version:"S2_CF_SERVICE_READ_DIAG_V0_1",status,source,destination,
  accountIdsPublished:false,secretsPublished:false,cloudMutations:false,dataCopied:false,
  r2SubscriptionEnabledByThisRun:false,
  evidenceScope:"D1_WORKERS_KV_R2_LIST_GET_ONLY",
});
const dir="/tmp/system2-cross-account-inventory";
await mkdir(dir,{recursive:true,mode:0o700});
await writeFile(dir+"/service-diagnostic.json",JSON.stringify(receipt,null,2)+"\n",{mode:0o600});
console.log(JSON.stringify(receipt));
// No throws from blocked service reads until artifact upload is completed.
