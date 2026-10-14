import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {categorizeUnreceiptedRawKey,FAMILY_CATEGORIES,run340Inventory,buildOriginalReceiptMap} from "../migration/issue1236_m07_g3_unreceipted_340_d08_key_family_v0_1.mjs";
import {ORIGINAL_REPO_RECEIPTS,parseSourceReceiptText} from "../migration/issue1236_m07_original_d08_writer_receipt_g3_498_offline_join_v0_1.mjs";
const sha=b=>createHash("sha256").update(b).digest("hex");
const suffix="f".repeat(64)+".json.gz";
const choices=[
 ["research/d08/twse-raw-valuation-snapshot-v0.1/2023-01-31/"+suffix,FAMILY_CATEGORIES[0]],
 ["research/d08/twse-raw-valuation-snapshot-v0.2/2023-01-31/"+suffix,FAMILY_CATEGORIES[1]],
 ["research/d08/twse-raw-valuation-snapshot-v0.3/2023-01-31/"+suffix,FAMILY_CATEGORIES[2]],
 ["research/d08/twse-raw-valuation-snapshot-v0.4/2023-01-31/"+suffix,FAMILY_CATEGORIES[3]],
 ["research/d08/twse-daily-valuation-year-pack-v0.1/2024/"+suffix,FAMILY_CATEGORIES[4]],
 ["research/d08/twse-daily-valuation-year-pack-v0.2/2024/"+suffix,FAMILY_CATEGORIES[5]],
 ["research/d08/another-valuation-format/2024/a.gz",FAMILY_CATEGORIES[6]]
];
for(const [k,c] of choices)assert.equal(categorizeUnreceiptedRawKey(k),c,k);
assert.throws(()=>categorizeUnreceiptedRawKey("smoke/path"),/M07_340_FAMILY_OUTSIDE_D08_FAMILY/);
const groups=ORIGINAL_REPO_RECEIPTS.map(def=>({
 label:def.label,rows:parseSourceReceiptText(readFileSync(def.path,"utf8"),def)
}));
const all=buildOriginalReceiptMap(groups);
assert.equal(all.size,154);
assert.equal(groups.reduce((a,g)=>a+g.rows.length,0),154);
const keyEntries=[
 ["research/d08/twse-raw-valuation-snapshot-v0.1/2023-01-31/"+suffix,10],
 ["research/d08/twse-raw-valuation-snapshot-v0.2/2023-01-31/"+suffix,20],
 ["research/d08/other-snapshot/a.gz",30],
 ["smoke/safe.json.gz",40],
 ["unrelated/source1",50],
 ["unrelated/source2",60]
];
const extra=new Map(keyEntries.slice(0,4).map(([k,v])=>[sha(k),v]));
const writerMap=new Map([
 [sha(keyEntries[0][0]),{label:"RAW_V01",bytes:10}],
 [sha(keyEntries[1][0]),{label:"RAW_V02",bytes:20}]
]);
const digest=createHash("sha256");
for(const [key,size] of keyEntries)digest.update(JSON.stringify([key,size,'"fixture"'])+"\n");
const expected={keys:6,bytes:210,pages:1,extras:4,extraBytes:100,receipted:2,
 extraUnknownD08:1,smoke:1,sha:digest.digest("hex")};
const body='<ListBucketResult><Name>system2-historical-research</Name>'+
 '<IsTruncated>false</IsTruncated><KeyCount>6</KeyCount>'+
 keyEntries.map(([key,size])=>'<Contents><Key>'+key+'</Key><Size>'+size+
 '</Size><ETag>"fixture"</ETag></Contents>').join("")+'</ListBucketResult>';
const result=await run340Inventory({extraMap:extra,writerMap,expected,
 loadPage:async token=>{assert.equal(token,null);return body}});
assert.equal(result.g3PrivateExtrasReidentified,4);
assert.equal(result.originalWriterReceiptsMatched,2);
assert.equal(result.smokeKeysRetained,1);
assert.equal(result.d08OriginalKeyFamilyOnlyUnreceiptedCount,1);
assert.equal(result.categories[FAMILY_CATEGORIES[6]].count,1);
assert.equal(result.originalSourceR2SingleNonAtomicScan,true);
assert.equal(result.sourceR2ObjectBodyGetCalls,0);
assert.equal(result.independentAuditorApproved,false);
assert.equal(JSON.stringify(result).includes("research/d08/"),false);
await assert.rejects(()=>run340Inventory({extraMap:extra,writerMap,expected:{
 ...expected,sha:"0".repeat(64)},loadPage:async()=>body}),/SOURCE_R2_ORIGINAL_FULL_LIST_ORIGINAL_G3_IDENTITY_DRIFT/);
const wrong=new Map(writerMap);wrong.set(sha(keyEntries[1][0]),{label:"RAW_V02",bytes:30});
await assert.rejects(()=>run340Inventory({extraMap:extra,writerMap:wrong,expected,
 loadPage:async()=>body}),/M07_340_FAMILY_ARCHIVED_WRITER_RECEIPT_LIST_SIZE_CONFLICT/);
const workflow=readFileSync(".github/workflows/system2-m07-unreceipted-340-d08-family-readonly.yml","utf8");
const code=readFileSync("system2/migration/issue1236_m07_g3_unreceipted_340_d08_key_family_v0_1.mjs","utf8");
assert.match(code,/LIST_SHA="3f0972357db3060004e65d6f3f5d829c3e4c19eeef7f59a46d2a264e9b5cca6d"/);
assert.match(code,/const LIMIT=32/);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/run-id: 38527825185/);
assert.doesNotMatch(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(code,/putIfAbsent|INSERT INTO|method:"PUT"|method:"DELETE"|method:"POST"/);
console.log("M07 protected 340 D08 subfamilies / 154 source receipts / full-list digest positive and negative controls PASS");
