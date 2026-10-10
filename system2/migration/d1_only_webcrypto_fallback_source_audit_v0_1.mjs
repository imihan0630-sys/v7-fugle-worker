// Offline diagnostic only; never changes Worker runtime or deploy rights.
import {auditD1OnlyWorkerImportGraphV0_1} from "./d1_only_worker_dependency_audit_v0_1.mjs";
const REVIEWED_FILE="system2/runtime/decision_archive.mjs";
function inspectKnownFallback(text) {
  const first=text.indexOf("export async function sha256Hex(value)");
  const last=text.indexOf("export const DECISION_EVIDENCE_FIREWALL_VERSION_V0_1",first);
  if(first<0||last<=first)return false;
  const part=text.slice(first,last);
  const cryptoGuard="if (globalThis.crypto?.subtle) {";
  const digestCall='globalThis.crypto.subtle.digest("SHA-256", bytes)';
  const fallback='await import("node:crypto")';
  const returnFromGuard='return [...new Uint8Array(digest)]';
  const guard=part.indexOf(cryptoGuard),digest=part.indexOf(digestCall),ret=part.indexOf(returnFromGuard);
  const backup=part.indexOf(fallback);
  const closeGuard=part.indexOf("\n  }",ret);
  const sites=text.split("import(").length-1;
  return sites===1 && guard>=0 && digest>guard && ret>digest && closeGuard>ret &&
    backup>closeGuard && part.includes('return createHash("sha256").update(bytes).digest("hex")') &&
    !text.includes("require(") && !text.includes("import.meta.glob");
}
export function auditWebCryptoOnlyDynamicFallbackV0_1({readSource,proposedStagingConfig}={}) {
  if(typeof readSource!=="function")throw Error("READ_SOURCE_REQUIRED");
  const flagged=[];
  const externalImports=[];
  const base=auditD1OnlyWorkerImportGraphV0_1({readSource:path=>{
    const source=readSource(path);
    if(typeof source==="string")for(const line of source.split("\n")) {
      const m=line.match(/^\s*import\s+.*?\s+from\s+["\x27]([^"\x27]+)["\x27]|^\s*import\s+["\x27]([^"\x27]+)["\x27]/);
      const moduleName=m?.[1]||m?.[2];
      if(moduleName && !moduleName.startsWith("."))externalImports.push({path,moduleName});
    }
    if(typeof source==="string" && (source.includes("import(")||source.includes("require(")||source.includes("import.meta.glob")))
      flagged.push({path,source});
    return source;
  }});
  const reviewed=flagged.length===1 && flagged[0].path===REVIEWED_FILE &&
    inspectKnownFallback(flagged[0].source);
  // SOURCE review only. Official Workers Node.js APIs are default as of 2026-08-04;
  // this does not prove the deployed configuration or bundled Worker works.
  const expectedExternal=externalImports.length===1 &&
    externalImports[0].path==="system2/runtime/twse_regulatory_lifecycle_source_v0_1.mjs" &&
    externalImports[0].moduleName==="node:crypto" &&
    readSource(externalImports[0].path).includes('import { createHash } from "node:crypto";');
  const cdate=typeof proposedStagingConfig==="string" ?
    /^compatibility_date\s*=\s*"(\d{4}-\d{2}-\d{2})"\s*$/m.exec(proposedStagingConfig)?.[1]:null;
  const compatibleProposal=!!cdate && cdate>="2026-08-04" &&
    proposedStagingConfig.includes('name = "system2-shadow-research-staging"') &&
    proposedStagingConfig.includes("workers_dev = false") &&
    !/no_nodejs_compat|\[triggers\]|^crons\s*=|^routes?\s*=/m.test(proposedStagingConfig);
  const allowedBaseBlockers=base.unresolved.length===2 &&
    base.unresolved.includes("DYNAMIC_IMPORT_OR_REQUIRE_UNVERIFIED") &&
    base.unresolved.includes("EXTERNAL_MODULE_RUNTIME_UNVERIFIED");
  const candidate=reviewed && expectedExternal && compatibleProposal && allowedBaseBlockers &&
    base.filesWithR2References.length===0 && base.staticRelativeImports>=1;
  return Object.freeze({
    version:"S2_WORKER_WEBCRYPTO_FALLBACK_SOURCE_AUDIT_V0_1",
    result:candidate?"SOURCE_WEBCRYPTO_FALLBACK_REVIEWED_NOT_RUNTIME_PROVEN":"D1_ONLY_SOURCE_REVIEW_BLOCKED",
    sourceFilesVisited:base.sourceFilesVisited,
    explicitR2References:base.filesWithR2References.length,
    dynamicSitesTotal:flagged.length,
    observedExternalImports:Object.freeze(externalImports),
    reviewedFallbackFile:candidate?REVIEWED_FILE:null,
    reviewedExternalFile:candidate?"system2/runtime/twse_regulatory_lifecycle_source_v0_1.mjs":null,
    proposedCompatibilityDate:compatibleProposal?cdate:null,
    unresolvedBaseGraph:Object.freeze([...base.unresolved]),
    cloudMutations:false,realWorkerRuntimeTested:false,
    deployedWorkerShaVerified:false,destinationD1Ready:false,
    stagingDeployAuthorized:false,cronAuthorized:false,
    liveWritesAuthorized:false,coldR2HistoryAvailable:false,
  });
}
