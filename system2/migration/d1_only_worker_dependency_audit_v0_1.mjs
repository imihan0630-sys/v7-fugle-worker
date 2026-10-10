// Static, offline System2 Worker import-graph audit. No Cloudflare calls.
// The result proves only Git HEAD source dependencies, NOT deployed Worker identity or runtime correctness.
import {posix} from "node:path";
const ENTRY="system2/deploy/worker.mjs";
const ROOT="system2/";
const R2_TOKENS=/\bSYSTEM2_HISTORY_BUCKET\b|remote_r2_|historical_cold_pack_store|R2_BUCKET_BINDING|\.r2_buckets\b/;
const UNCERTAIN_IMPORT=/\bimport\s*\(|\brequire\s*\(|\bimport\.meta\.glob\b/;
const STATIC_IMPORT=/\b(?:import|export)\s+(?:[^;'"]*?\s+from\s+)?["']([^"']+)["']/g;
function normalizeRelative(base,specifier) {
  if(!specifier.startsWith("."))return null;
  const path=posix.normalize(posix.join(posix.dirname(base),specifier));
  if(!path.startsWith(ROOT)||!/\.m?js$/.test(path))return null;
  return path;
}
export function auditD1OnlyWorkerImportGraphV0_1({entry=ENTRY,readSource,maxFiles=500}={}){
  if(typeof readSource!=="function"||entry!==ENTRY) throw Error("ENTRY_OR_SOURCE_LOADER_UNAUTHORIZED");
  const visited=new Set(),stack=[entry],blocked=new Set(),r2Refs=[],imports=[],external=[];
  while(stack.length) {
    const file=stack.pop();
    if(visited.has(file))continue;
    visited.add(file);
    if(visited.size>maxFiles){blocked.add("STATIC_IMPORT_GRAPH_TOO_LARGE");break;}
    let source;
    try{source=readSource(file);}catch{blocked.add("STATIC_IMPORT_SOURCE_UNAVAILABLE");continue;}
    if(typeof source!=="string"||source.length>2500000){blocked.add("STATIC_IMPORT_SOURCE_UNAVAILABLE");continue;}
    if(R2_TOKENS.test(source))r2Refs.push(file);
    if(UNCERTAIN_IMPORT.test(source))blocked.add("DYNAMIC_IMPORT_OR_REQUIRE_UNVERIFIED");
    const found=[...source.matchAll(STATIC_IMPORT)].map(m=>m[1]);
    for(const name of found){
      if(name.startsWith(".")){
        const child=normalizeRelative(file,name);
        if(!child){blocked.add("IMPORT_OUTSIDE_SYSTEM2_SCOPE");continue;}
        imports.push({from:file,to:child});
        if(!visited.has(child))stack.push(child);
      }else {
        // Workers-compatibility for all external/node imports must be verified separately.
        external.push({from:file,module:name});
        blocked.add("EXTERNAL_MODULE_RUNTIME_UNVERIFIED");
      }
    }
  }
  if(r2Refs.length)blocked.add("R2_RUNTIME_CODE_REFERENCED");
  return Object.freeze({
    version:"S2_D1_ONLY_WORKER_STATIC_IMPORT_AUDIT_V0_1",
    entry,
    sourceOnly:true,
    cloudMutations:false,
    sourceWorkerDeployedShaVerified:false,
    destinationDeployAuthorized:false,
    destinationCronAuthorized:false,
    publicRoutesAuthorized:false,
    activeTradingAuthorized:false,
    sourceFilesVisited:visited.size,
    staticRelativeImports:imports.length,
    externalImportCount:external.length,
    filesWithR2References:Object.freeze([...new Set(r2Refs)].sort()),
    unresolved:Object.freeze([...blocked].sort()),
    result:blocked.size?"SOURCE_DEPENDENCY_REVIEW_BLOCKED":"SOURCE_IMPORT_GRAPH_NO_R2_REFERENCE_CANDIDATE_ONLY",
  });
}
