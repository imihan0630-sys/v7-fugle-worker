import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {safeTechnicalFamily,run340Inventory,categorizeUnreceiptedRawKey,FAMILY_CATEGORIES} from "../migration/issue1236_m07_g3_76_other_d08_technical_families_v0_1.mjs";
const hash=s=>createHash("sha256").update(s).digest("hex");
const k="research/d08/twse-historical-valuation-archive-v0.1/2024/a.json.gz";
assert.equal(categorizeUnreceiptedRawKey(k),FAMILY_CATEGORIES[6]);
assert.equal(safeTechnicalFamily(k),"D08_TECHNICAL_FAMILY__TWSE_HISTORICAL_VALUATION_ARCHIVE_V0_1");
assert.equal(safeTechnicalFamily("research/d08/personal999999999/secret.json.gz"),"D08_PRIVATE_OR_UNRECOGNIZED_TECHNICAL_FAMILY");
assert.equal(safeTechnicalFamily("research/d08/twse-20240101-secret/x"),"D08_PRIVATE_OR_UNRECOGNIZED_TECHNICAL_FAMILY");
assert.throws(()=>safeTechnicalFamily("private/path"),/M07_340_FAMILY_INVALID_UNKNOWN_D08_PREFIX/);
const entries=[
 ["research/d08/twse-raw-valuation-snapshot-v0.1/2023-01-31/"+"f".repeat(64)+".json.gz",10],
 ["research/d08/twse-raw-valuation-snapshot-v0.2/2023-01-31/"+"f".repeat(64)+".json.gz",20],
 [k,30],["smoke/safe.json.gz",40],
 ["other/a",50],["other/b",60]
];
const extra=new Map(entries.slice(0,4).map(([key,size])=>[hash(key),size]));
const writerMap=new Map([
 [hash(entries[0][0]),{label:"RAW_V01",bytes:10}],
 [hash(entries[1][0]),{label:"RAW_V02",bytes:20}]
]);
const h=createHash("sha256");
for(const [key,size] of entries)h.update(JSON.stringify([key,size,'"fixture"'])+"\n");
const expected={keys:6,bytes:210,pages:1,extras:4,extraBytes:100,
 receipted:2,extraUnknownD08:1,smoke:1,sha:h.digest("hex"),otherCount:1,otherBytes:30};
const xml="<ListBucketResult><Name>system2-historical-research</Name><IsTruncated>false</IsTruncated><KeyCount>6</KeyCount>"+
 entries.map(([key,size])=>"<Contents><Key>"+key+"</Key><Size>"+size+
 "</Size><ETag>\"fixture\"</ETag></Contents>").join("")+"</ListBucketResult>";
const out=await run340Inventory({extraMap:extra,writerMap,expected,loadPage:async()=>xml});
assert.equal(out.otherD08Count,1);
assert.equal(out.otherD08ListedBytes,30);
assert.deepEqual(out.otherD08UnreceiptedTechnicalFamilies["D08_TECHNICAL_FAMILY__TWSE_HISTORICAL_VALUATION_ARCHIVE_V0_1"],{count:1,listedBytes:30});
assert.equal(out.sourceR2ObjectBodyGetCalls,0);
assert.equal(out.independentAuditorApproved,false);
assert.equal(JSON.stringify(out).includes(k),false);
await assert.rejects(()=>run340Inventory({extraMap:extra,writerMap,expected:{...expected,otherBytes:31},loadPage:async()=>xml}),
 /M07_340_FAMILY_76_UNRECEIPTED_D08_OTHER_TOTALS_MISMATCH/);
await assert.rejects(()=>run340Inventory({extraMap:extra,writerMap,expected:{...expected,sha:"a".repeat(64)},loadPage:async()=>xml}),
 /SOURCE_R2_ORIGINAL_FULL_LIST_ORIGINAL_G3_IDENTITY_DRIFT/);
const src=readFileSync("system2/migration/issue1236_m07_g3_76_other_d08_technical_families_v0_1.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-unreceipted-76-d08-technical-readonly.yml","utf8");
assert.match(src,/SOURCE_R2_ORIGINAL_FULL_LIST_ORIGINAL_G3_IDENTITY_DRIFT/);
assert.match(src,/if\(technicalCount!==\(expected.otherCount\?\?76\)/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/run-id: 38527825185/);
assert.doesNotMatch(wf,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(src,/putIfAbsent|INSERT INTO|method:"PUT"|method:"DELETE"|method:"POST"/);
console.log("M07 76 D08 technical-only family tags, privacy fallback, original G3 digest and adversarial gates PASS");
