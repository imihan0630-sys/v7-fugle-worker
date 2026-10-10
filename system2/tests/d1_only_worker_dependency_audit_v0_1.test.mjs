import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditD1OnlyWorkerImportGraphV0_1 as audit} from "../migration/d1_only_worker_dependency_audit_v0_1.mjs";
const entry="system2/deploy/worker.mjs";
const loader=path=>readFileSync(path,"utf8");
const actual=audit({readSource:loader});
assert(actual.sourceFilesVisited>=2,"Actual Worker import graph must visit dependent modules");
assert(actual.staticRelativeImports>=1,"Worker imports unexpectedly empty");
assert.equal(actual.sourceWorkerDeployedShaVerified,false);
assert.equal(actual.destinationDeployAuthorized,false);
assert.equal(actual.destinationCronAuthorized,false);
assert.equal(actual.publicRoutesAuthorized,false);
assert.equal(actual.cloudMutations,false);
assert(["SOURCE_DEPENDENCY_REVIEW_BLOCKED","SOURCE_IMPORT_GRAPH_NO_R2_REFERENCE_CANDIDATE_ONLY"].includes(actual.result));
assert(actual.filesWithR2References.every(x=>x.startsWith("system2/")));
const fixture=(obj)=>audit({readSource:path=>{
 if(!Object.hasOwn(obj,path))throw Error("missing "+path);
 return obj[path];
}});
const clean=fixture({
 [entry]:'import {x} from "./helper.mjs"; export default {fetch(){return x}};',
 "system2/deploy/helper.mjs":'export const x=1;',
});
assert.equal(clean.result,"SOURCE_IMPORT_GRAPH_NO_R2_REFERENCE_CANDIDATE_ONLY");
assert.equal(clean.sourceFilesVisited,2);
assert.equal(clean.destinationDeployAuthorized,false);
const r2=fixture({
 [entry]:'import "./helper.mjs";',
 "system2/deploy/helper.mjs":'export const key="SYSTEM2_HISTORY_BUCKET";',
});
assert(r2.unresolved.includes("R2_RUNTIME_CODE_REFERENCED"));
assert.deepEqual(r2.filesWithR2References,["system2/deploy/helper.mjs"]);
const unknown=fixture({[entry]:'const x=await import("./secret.mjs");'});
assert(unknown.unresolved.includes("DYNAMIC_IMPORT_OR_REQUIRE_UNVERIFIED"));
const external=fixture({[entry]:'import {foo} from "cloudflare-internal";'});
assert(external.unresolved.includes("EXTERNAL_MODULE_RUNTIME_UNVERIFIED"));
const outside=fixture({[entry]:'import "../../../Worker.js";'});
assert(outside.unresolved.includes("IMPORT_OUTSIDE_SYSTEM2_SCOPE"));
const missing=fixture({[entry]:'import "./absent.mjs";'});
assert(missing.unresolved.includes("STATIC_IMPORT_SOURCE_UNAVAILABLE"));
const cyc=fixture({[entry]:'import "./a.mjs";',"system2/deploy/a.mjs":'import "./worker.mjs";'});
assert.equal(cyc.sourceFilesVisited,2);
const sized=audit({readSource:()=>('export const x="'+ "A".repeat(2_500_005) +'";')});
assert(sized.unresolved.includes("STATIC_IMPORT_SOURCE_UNAVAILABLE"));
await assert.rejects(async()=>audit({readSource:loader,entry:"Worker.js"}),/ENTRY_OR_SOURCE_LOADER_UNAUTHORIZED/);
console.log("System2 D1-only Worker static graph: tests PASS; actual graph visit count="+actual.sourceFilesVisited+
  "; actual R2-file references="+actual.filesWithR2References.length+
  "; actual static status="+actual.result+" (never deployment authorization)");
