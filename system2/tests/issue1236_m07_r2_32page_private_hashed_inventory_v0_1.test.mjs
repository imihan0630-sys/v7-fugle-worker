import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {collectListedR2Pages,censusSourceR2} from "../migration/issue1236_m07_source_r2_32page_private_hashed_inventory_v0_1.mjs";
const b="system2-historical-research";
function xml(page,n=1000,more=true,keyOffset=(page-1)*1000){
 const list=Array.from({length:n},(_,i)=>"<Contents><Key>archive/"+String(keyOffset+i).padStart(6,"0")+
 ".json.gz</Key><Size>120</Size><ETag>q</ETag></Contents>").join("");
 return "<ListBucketResult><Name>"+b+"</Name><KeyCount>"+n+"</KeyCount>"+
 "<IsTruncated>"+String(more)+"</IsTruncated>"+
 (more?"<NextContinuationToken>token-"+page+"</NextContinuationToken>":"")+list+"</ListBucketResult>";
}
const lines=[],requests=[];
const done=await collectListedR2Pages({
 loadPage:async token=>{
   requests.push(token);let pg=requests.length;
   return xml(pg,pg===3?157:1000,pg!==3);
 },sink:async s=>{lines.push(s)}});
assert.equal(done.completeSingleScan,true);
assert.equal(done.listedBucketTotalObjects,2157);
assert.equal(done.listedBucketTotalBytes,258840);
assert.equal(done.sourceR2ListGetOperations,3);
assert.equal(done.sourceR2ObjectGetOperations,0);
assert.equal(lines.length,2157);
assert.equal(JSON.parse(lines[0]).length,2);
assert.equal(JSON.parse(lines[0])[1],120);
assert.equal(JSON.stringify(done).includes("archive/"),false);
requests.length=0;let batch=0;
const bounded=await collectListedR2Pages({
 loadPage:async token=>{
  batch++;return xml(batch);
 },sink:async()=>{}});
assert.equal(batch,32);
assert.equal(bounded.sourceR2ListGetOperations,32);
assert.equal(bounded.completeSingleScan,false);
assert.equal(bounded.listedBucketTotalObjects,null);
assert.equal(bounded.observedEntries,32000);
assert.equal(bounded.listedBytesObserved,3840000);
await assert.rejects(()=>collectListedR2Pages({
 loadPage:async()=>xml(1,2,true,0),sink:async()=>{}
}),/M07_INVENTORY_DUPLICATE_SOURCE_R2_KEY_ACROSS_PAGES/);
await assert.rejects(()=>collectListedR2Pages({
 loadPage:async()=>xml(1,1,true,0).replace("<Name>"+b+"</Name>","<Name>wrong</Name>"),
 sink:async()=>{}
}),/M07_PAGES_BUCKET_OR_TRUNCATION_INVALID/);
await assert.rejects(()=>censusSourceR2({
 accountId:"a".repeat(32),accessKeyId:"a",secretAccessKey:"b",bucketName:b,
 fetchImpl:async()=>{throw Error("SHOULD_NOT_ACCESS_NETWORK")},sink:async()=>{}
}),/M07_INVENTORY_ORIGINAL_ACCOUNT_OR_BUCKET_IDENTITY/);
const src=readFileSync("system2/migration/issue1236_m07_source_r2_32page_private_hashed_inventory_v0_1.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-source-r2-32page-private-inventory.yml","utf8");
assert.match(src,/PAGE_MAX=32,KEYS_PER_PAGE=1000, MAX_OBJECT_ENTRIES=32000/);
assert.match(src,/SOURCE_ACCOUNT_SHA="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b"/);
assert.match(src,/privateObjectKeysLoggedOrSaved:false/);
assert.match(src,/metadataSHA256IsNotObjectByteSHA256:true/);
assert.doesNotMatch(src,/putIfAbsent|INSERT INTO|DELETE FROM|UPDATE s2_|method:"PUT"|method:"POST"|method:"DELETE"/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.doesNotMatch(wf,/environment: system2-schema-only|S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
console.log("M07 32-page physical SOURCE R2 metadata hashed listing cap and negative tests PASS");
