// Offline migration-attestation CLI: node system2/migration/run_source_d1_export_attestation_v0_1.mjs [manifest.json]
// No network, secrets or Cloudflare API. Raw input is never logged.
import {readdirSync,readFileSync} from "node:fs";
import {join} from "node:path";
import {inventoryOfflineSystem2SqlMigrationsV0_1,attestOfflineSourceD1ExportV0_1}
 from "./source_d1_export_attestation_v0_1.mjs";
const dir="system2/sql";
const files=readdirSync(dir).filter(n=>/^\d{4}_[a-z0-9_]+\.sql$/.test(n))
  .map(name=>({name,content:readFileSync(join(dir,name),"utf8")}));
const schema=inventoryOfflineSystem2SqlMigrationsV0_1(files);
let manifest=null;
if(process.argv.length>3)throw Error("ONE_OPTIONAL_RECEIPT_PATH_ONLY");
if(process.argv[2]){
  if(!/^[a-zA-Z0-9_./-]+\.json$/.test(process.argv[2])||
     process.argv[2].includes(".."))throw Error("LOCAL_RECEIPT_PATH_UNSAFE");
  manifest=JSON.parse(readFileSync(process.argv[2],"utf8"));
}
const evidence=attestOfflineSourceD1ExportV0_1({schema,manifest});
console.log(JSON.stringify(evidence,null,2));
if(evidence.blockers.length)process.exitCode=2;
