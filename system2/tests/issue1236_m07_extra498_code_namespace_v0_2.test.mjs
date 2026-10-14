import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {classifyRawNamespace} from "../migration/issue1236_m07_extra498_code_namespace_classify_v0_2.mjs";
const hash="f".repeat(64);
const cases=[
 ["research/d08/twse-raw-valuation-snapshot-v0.2/2026-10-13/"+hash+".json.gz","D08_RAW_VALUATION_CODE_KEY_SHAPE__OWNER_UNVERIFIED"],
 ["research/d08/twse-raw-valuation-snapshot-v0.3/2026-10-13/"+hash+".json.gz","D08_RAW_VALUATION_CODE_KEY_SHAPE__OWNER_UNVERIFIED"],
 ["research/d08/twse-daily-valuation-year-pack-v0.1/2025/"+hash+".json.gz","D08_ANNUAL_VALUATION_CODE_KEY_SHAPE__OWNER_UNVERIFIED"],
 ["research/d08/future/a.gz","D08_OTHER_CODE_NAMESPACE__OWNER_UNVERIFIED"],
 ["research/new-source/a","RESEARCH_OTHER_NAMESPACE__OWNER_UNVERIFIED"],
 ["smoke/example.json.gz","SMOKE_NAMESPACE__NOT_AUTOMATICALLY_DISPOSABLE"],
 ["elsewhere/data","OTHER_NAMESPACE__OWNERSHIP_UNVERIFIED"],
 ["research/d08/twse-raw-valuation-snapshot-v0.3/invalid/"+hash+".json.gz","D08_OTHER_CODE_NAMESPACE__OWNER_UNVERIFIED"]
];
for(const [key,kind] of cases)assert.equal(classifyRawNamespace(key),kind,key);
const src=readFileSync("system2/migration/issue1236_m07_extra498_code_namespace_classify_v0_2.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-extra-498-code-namespace-readonly.yml","utf8");
assert.match(src,/EXPECTED_LIST_SHA="f5648ea5ffeb078d1d8b24b52743a9d712f879a304861f6f277283bdc3342a72"/);
assert.match(src,/ORIGINAL_SOURCE_META_SHA="3f0972357db3060004e65d6f3f5d829c3e4c19eeef7f59a46d2a264e9b5cca6d"/);
assert.match(src,/MAXPAGES=32/);
assert.match(src,/objectOwnershipOrSafeDeletionCertified:false/);
assert.doesNotMatch(src,/putIfAbsent|INSERT INTO|method:"PUT"|method:"DELETE"|sourceR2ObjectBodyGetCalls:1/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/run-id: 38527825185/);
assert.doesNotMatch(wf,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
console.log("M07 498 code taxonomy vs SOURCE D08 writer templates and forbidden claims PASS");
