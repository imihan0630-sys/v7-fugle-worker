import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync,gunzipSync } from "node:zlib";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { buildD08SemanticUniverseIdentityV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_2 } from "../runtime/d08_twse_historical_universe_source_v0_2.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
assert.ok(accountId&&accessKeyId&&secretAccessKey&&bucketName,"R2 credentials/bucket required");

const receipt=JSON.parse(fs.readFileSync("research/d08_twse_official_universe_source_receipt_20261007_v0_2.json","utf8"));
assert.equal(receipt.result,"PASS");
const built=await buildD08TwseHistoricalUniverseSourceV0_2({observedAt:new Date().toISOString()});
const semantic=buildD08SemanticUniverseIdentityV0_1(built.registry);
assert.equal(semantic.semanticRegistryHash,receipt.registry.semanticRegistryHash,"V0.2 semantic registry drift");

const payload={
  schemaVersion:"D08_TWSE_SEMANTIC_UNIVERSE_ARCHIVE_V0_2",
  researchOnly:true,
  outcomeJoin:false,
  registryId:semantic.registryId,
  datasetStartDate:semantic.datasetStartDate,
  membershipCount:semantic.membershipCount,
  semanticRegistryHash:semantic.semanticRegistryHash,
  memberships:semantic.memberships,
  sourceReceipt:"research/d08_twse_official_universe_source_receipt_20261007_v0_2.json",
  sourceSemanticSnapshotBundleHash:receipt.scanClock.semanticSnapshotBundleHash,
};
const json=JSON.stringify(payload);
const payloadHash=createHash("sha256").update(json).digest("hex");
const bytes=gzipSync(Buffer.from(json,"utf8"),{level:9});
const objectSha256=createHash("sha256").update(bytes).digest("hex");
const objectKey=["research","d08","twse-semantic-universe-v0.2",payload.semanticRegistryHash,payloadHash+".json.gz"].join("/");

const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
const prior=await store.head(objectKey);
let inserted=false;
if(prior){
  assert.equal(Number(prior.size),bytes.byteLength,"semantic universe R2 size mismatch");
  if(prior.customMetadata?.["payload-hash"]) assert.equal(prior.customMetadata["payload-hash"],payloadHash);
  if(prior.customMetadata?.["object-sha256"]) assert.equal(prior.customMetadata["object-sha256"],objectSha256);
}else{
  const put=await store.putIfAbsent(objectKey,bytes,{
    contentType:"application/gzip",storageClass:"Standard",
    customMetadata:{
      "payload-hash":payloadHash,
      "object-sha256":objectSha256,
      "semantic-registry-hash":payload.semanticRegistryHash,
      "schema-version":"d08-twse-semantic-universe-v0-2",
    },
  });
  assert.ok(put,"semantic universe R2 insert failed");
  inserted=true;
}
const read=await store.get(objectKey);
assert.ok(read,"semantic universe R2 readback missing");
assert.equal(createHash("sha256").update(Buffer.from(read.bytes)).digest("hex"),objectSha256);
const parsed=JSON.parse(gunzipSync(Buffer.from(read.bytes)).toString("utf8"));
assert.equal(JSON.stringify(parsed),json);
assert.equal(parsed.semanticRegistryHash,receipt.registry.semanticRegistryHash);
assert.equal(parsed.memberships.length,receipt.registry.membershipCount);

console.log("D08_SEMANTIC_UNIVERSE_R2_RECEIPT="+JSON.stringify({
  schemaVersion:"D08_TWSE_SEMANTIC_UNIVERSE_R2_RECEIPT_V0_2",
  result:"PASS",researchOnly:true,outcomeJoin:false,
  bucketName,registryId:payload.registryId,membershipCount:payload.membershipCount,
  semanticRegistryHash:payload.semanticRegistryHash,
  semanticSnapshotBundleHash:payload.sourceSemanticSnapshotBundleHash,
  payloadHash,objectSha256,objectKey,gzipBytes:bytes.byteLength,inserted,readbackVerified:true,
  guards:{noReturns:true,noD1Writes:true,noSystem1Runtime:true,noFormalCoreImpact:true}
}));
