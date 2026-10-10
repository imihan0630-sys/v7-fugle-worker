// node system2/migration/run_d1_only_worker_dependency_audit_v0_1.mjs
// Git HEAD source analysis only; no network/API credentials, Cloudflare deploy or storage operations.
import {readFileSync} from "node:fs";
import {auditD1OnlyWorkerImportGraphV0_1}
 from "./d1_only_worker_dependency_audit_v0_1.mjs";
const receipt=auditD1OnlyWorkerImportGraphV0_1({readSource:path=>readFileSync(path,"utf8")});
console.log(JSON.stringify(receipt,null,2));
if(receipt.unresolved.length)process.exitCode=2;
