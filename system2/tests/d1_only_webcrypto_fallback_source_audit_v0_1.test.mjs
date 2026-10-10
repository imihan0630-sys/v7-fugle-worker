import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {sha256Hex} from "../runtime/decision_archive.mjs";
import {buildD1OnlyDisabledStagingConfigV0_1 as build} from "../migration/d1_only_disabled_staging_config_v0_1.mjs";
import {auditWebCryptoOnlyDynamicFallbackV0_1 as audit} from "../migration/d1_only_webcrypto_fallback_source_audit_v0_1.mjs";
const worker="system2/deploy/worker.mjs";
const disk=p=>readFileSync(p,"utf8");
const staging=build({databaseId:"a".repeat(32)});
const real=audit({readSource:disk,proposedStagingConfig:staging});
assert.equal(real.sourceFilesVisited,37);
assert.equal(real.explicitR2References,0);
assert.equal(real.dynamicSitesTotal,1);
assert.equal(real.observedExternalImports.length,1);
assert.equal(real.result,"SOURCE_WEBCRYPTO_FALLBACK_REVIEWED_NOT_RUNTIME_PROVEN");
assert.equal(real.reviewedFallbackFile,"system2/runtime/decision_archive.mjs");
assert.equal(real.reviewedExternalFile,"system2/runtime/twse_regulatory_lifecycle_source_v0_1.mjs");
assert.equal(real.proposedCompatibilityDate,"2026-09-01");
assert.equal(real.deployedWorkerShaVerified,false);
assert.equal(real.realWorkerRuntimeTested,false);
assert.equal(real.stagingDeployAuthorized,false);
assert.equal(real.cronAuthorized,false);
assert.equal(real.cloudMutations,false);
const value=await sha256Hex("abc");
assert.equal(value,"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
const sample=disk("system2/runtime/decision_archive.mjs");
function mock(fallback,external='import { createHash } from "node:crypto";',config=staging){
 return audit({proposedStagingConfig:config,readSource:p=>{
  if(p===worker)return 'import "../runtime/decision_archive.mjs"; import "../runtime/twse_regulatory_lifecycle_source_v0_1.mjs";';
  if(p==="system2/runtime/decision_archive.mjs")return fallback;
  if(p==="system2/runtime/twse_regulatory_lifecycle_source_v0_1.mjs")return external;
  if(p==="system2/runtime/factor_snapshot.mjs")return "export const deepFreeze=(x)=>x;";
  throw Error("MISSING");
 }});
}
assert.equal(mock(sample).result,"SOURCE_WEBCRYPTO_FALLBACK_REVIEWED_NOT_RUNTIME_PROVEN");
for(const mutated of [
 sample.replace("if (globalThis.crypto?.subtle) {","if (false) {"),
 sample.replace('globalThis.crypto.subtle.digest("SHA-256", bytes)','globalThis.crypto.subtle.digest("SHA-1", bytes)'),
 sample.replace('await import("node:crypto")','await import("./other.mjs")'),
 sample.replace("return [...new Uint8Array(digest)]","console.log([...new Uint8Array(digest)]); return []"),
 sample+'\nexport async function hidden(){await import("./more.mjs")}\n',
 sample+'\nexport function hidden(){return require("fs")}\n',
]){
 const check=mock(mutated);
 assert.equal(check.result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
 assert.equal(check.stagingDeployAuthorized,false);
}
const r2=mock(sample+'\nconst x="SYSTEM2_HISTORY_BUCKET";\n');
assert.equal(r2.result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
assert.equal(r2.explicitR2References,1);
assert.equal(mock(sample,'import { createHash } from "node:crypto";',staging.replace("2026-09-01","2026-07-01")).result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
assert.equal(mock(sample,'import { createHash } from "node:crypto";',staging+"\nno_nodejs_compat").result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
assert.equal(mock(sample,'import { createHash } from "node:fs";').result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
assert.equal(mock(sample,'import { createHash } from "node:crypto"; import x from "another-package";').result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
assert.equal(mock(sample,'import { createHash } from "node:crypto";',null).result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
const missing=audit({readSource:()=>{throw Error("no file")}});
assert.equal(missing.result,"D1_ONLY_SOURCE_REVIEW_BLOCKED");
console.log("System2 D1-only WebCrypto source fallback reviewed: 22 assertions PASS; source graph 37, R2=0, dynamic=1; runtime/deploy NOT verified");
