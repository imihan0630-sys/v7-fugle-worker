import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {classifyRawNamespace,classifySourceFullList,parsePrivateExtraReceipt,classifyPhysicalSource} from "../migration/issue1236_m07_r2_original_private_498_namespace_classify_v0_1.mjs";
const hash=b=>createHash("sha256").update(b).digest("hex");
const a="a1/v0.1/market=TWSE/year=2026/symbol=2330/price_space=RAW/"+("a".repeat(64))+".json.gz";
const b="smoke/r2-physical-v0.2/twse/2330/2026-09-24/"+("b".repeat(64))+".json.gz";
const c="odd-namespace/unapproved/orphan";
const d="a1/nonstandard/draft";
assert.match(classifyRawNamespace(a),/A1_CANONICAL/);
assert.match(classifyRawNamespace(b),/SMOKE_NAMESPACE/);
assert.match(classifyRawNamespace(c),/OTHER_NAMESPACE/);
assert.match(classifyRawNamespace(d),/A1_NONCANONICAL/);
function makePage(items,more,token){
 const s=items.map(([key,size])=>"<Contents><Key>"+key+"</Key><Size>"+size+"</Size><ETag>x</ETag></Contents>").join("");
 return "<ListBucketResult><Name>system2-historical-research</Name><KeyCount>"+items.length+"</KeyCount>"+
 "<IsTruncated>"+String(more)+"</IsTruncated>"+
 (more?"<NextContinuationToken>"+token+"</NextContinuationToken>":"")+s+"</ListBucketResult>";
}
const list=[[a,5],[b,6],[c,7],[d,8]];
const extras=new Map([[hash(a),5],[hash(b),6],[hash(c),7]]);
const metadataHash=hash(list.map(([key,size])=>JSON.stringify([key,size,"x"])+"\n").join(""));
const expected={keys:4,bytes:26,extra:3,extraBytes:18,pages:2,metadataSha:metadataHash};
let calls=0;
const pages=[makePage(list.slice(0,2),true,"second"),makePage(list.slice(2),false)];
const out=await classifySourceFullList({loadPage:async token=>{
 assert.equal(token,calls?"second":null);return pages[calls++];
 },extraMap:extras,expected});
assert.equal(calls,2);
assert.equal(out.extraKeysReidentifiedInRescan,3);
assert.equal(out.physicallyRelistedSourceObjects,4);
assert.equal(out.namespaceCounts.A1_CANONICAL_KEY_SHAPE__NO_OLD_D1_MANIFEST.count,1);
assert.equal(out.namespaceCounts.SMOKE_NAMESPACE__NOT_AUTOMATICALLY_DISPOSABLE.count,1);
assert.equal(out.namespaceCounts.OTHER_NAMESPACE__OWNERSHIP_UNVERIFIED.count,1);
assert.equal(out.namespaceCounts.A1_NONCANONICAL_KEY_SHAPE__REQUIRES_REVIEW.count,0);
assert.equal(JSON.stringify(out).includes(a),false);
assert.equal(JSON.stringify(out).includes(c),false);
async function fail(pageSet,map,why){
 let i=0;await assert.rejects(()=>classifySourceFullList({
 loadPage:async()=>pageSet[i++],extraMap:map,expected}),new RegExp("M07_EXTRA_NAMESPACE_"+why));
}
await fail([makePage(list.slice(0,2),true,"next"),makePage(list.slice(0,2),false)],
 extras,"DUPLICATE_SOURCE_KEY");
await fail([makePage(list.slice(0,2),true,"next"),makePage([[c,10],[d,8]],false)],
 extras,"EXTRA_OBJECT_LIST_SIZE_OR_DUPLICATE");
await fail([makePage(list.slice(0,2),true,"next"),makePage([[c,7],[d,9]],false)],
 extras,"SOURCE_LIST_CHANGED_SINCE_G3_ORIGINAL_SNAPSHOT");
await fail([makePage(list.slice(0,2),true,"next"),makePage([[d,8]],false)],
 extras,"SOURCE_LIST_CHANGED_SINCE_G3_ORIGINAL_SNAPSHOT");
const payload=Buffer.from(JSON.stringify([hash(a),5])+"\n"+
 JSON.stringify([hash(b),6])+"\n"+JSON.stringify([hash(c),7])+"\n");
const sampleMeta=Buffer.from(JSON.stringify({
 schemaVersion:"S2_M07_PROTECTED_G3_SOURCE_498_R2_UNMATCHED_HASH_KEYS_V0_1",
 status:"SOURCE_R2_498_UNMATCHED_PRIVATE_KEYHASHES_ANCHORED_TO_G3__OWNERSHIP_UNKNOWN",
 originalManifestIdentityAndSizeMatched:25823,
 extraKeyHashCount:498,extraListedBytes:255515971,
 extraPrivateKeyHashListSHA256:hash(payload),
 sourceR2OriginalPrivateInventoryKeys:26321,
 sourceR2NetworkCalls:0,destinationD1Writes:0,extraObjectsCanBeDeleted:false}));
await assert.rejects(async()=>parsePrivateExtraReceipt(payload,sampleMeta,{
 expectedListSHA:hash(payload),expectedSummarySHA:hash(sampleMeta)}),
 /M07_EXTRA_NAMESPACE_EXTRA_HASH_COUNT_AND_BYTES_DRIFT/);
await assert.rejects(async()=>classifyPhysicalSource({accountId:"a".repeat(32),
 bucketName:"system2-historical-research",accessKeyId:"a",secretAccessKey:"b",extraMap:extras,
 fetchImpl:async()=>{throw Error("NO_NETWORK")}}),/M07_EXTRA_NAMESPACE_PHYSICAL_SOURCE_ACCOUNT_OR_BUCKET_UNAUTHORIZED/);
const source=readFileSync("system2/migration/issue1236_m07_r2_original_private_498_namespace_classify_v0_1.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-original-extra-498-namespace-readonly.yml","utf8");
assert.match(source,/MAXPAGES=32,MAXPERPAGE=1000/);
assert.match(source,/ORIGINAL_SOURCE_META_SHA="3f0972357db3060004e65d6f3f5d829c3e4c19eeef7f59a46d2a264e9b5cca6d"/);
assert.match(source,/EXPECTED_LIST_SHA="f5648ea5ffeb078d1d8b24b52743a9d712f879a304861f6f277283bdc3342a72"/);
assert.match(source,/EXTRA_NAMESPACE_SOURCE_LIST_CHANGED_SINCE_G3_ORIGINAL_SNAPSHOT|SOURCE_LIST_CHANGED_SINCE_G3_ORIGINAL_SNAPSHOT/);
assert.doesNotMatch(source,/putIfAbsent|INSERT INTO|DELETE FROM|UPDATE s2_|method:"PUT"|method:"POST"|method:"DELETE"/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/s2-m07-private-498-extra-keyhashes-38527825185-1/);
assert.doesNotMatch(wf,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
console.log("M07 498 original G3 extra identities real source full R2 namespace classifier safeguards PASS");
