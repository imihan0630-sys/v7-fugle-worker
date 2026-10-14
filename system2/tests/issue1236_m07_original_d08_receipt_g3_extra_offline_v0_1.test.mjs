import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {
 ORIGINAL_REPO_RECEIPTS,parseSourceReceiptText,joinOriginalReceipts
} from "../migration/issue1236_m07_original_d08_writer_receipt_g3_498_offline_join_v0_1.mjs";
const hash=s=>createHash("sha256").update(s).digest("hex");
const groups=ORIGINAL_REPO_RECEIPTS.map(def=>({
 label:def.label,
 rows:parseSourceReceiptText(readFileSync(def.path,"utf8"),def)
}));
assert.deepEqual(groups.map(g=>g.rows.length),[44,44,44,22]);
assert.equal(new Set(groups.flatMap(g=>g.rows.map(x=>x.id))).size,154);
assert.equal(groups.filter(g=>g.rows.some(x=>x.bytes===null)).length,1);
let sample=JSON.parse(readFileSync(ORIGINAL_REPO_RECEIPTS[0].path,"utf8"));
sample.receipts[0].objectKey="attacker/change.json.gz";
assert.throws(()=>parseSourceReceiptText(JSON.stringify(sample),ORIGINAL_REPO_RECEIPTS[0],{checkBlob:false}),
 /M07_D08_RECEIPT_SOURCE_RECEIPT_PROVENANCE_INVALID/);
const invalidated=JSON.parse(readFileSync(ORIGINAL_REPO_RECEIPTS[0].path,"utf8"));
assert.equal(invalidated.validationStatus,"INVALIDATED_BY_IDEMPOTENCY_COUNTEREVIDENCE");
assert.ok(invalidated.invalidReason.length>0);
invalidated.validationStatus="IDEMPOTENCY_VERIFIED";
assert.throws(()=>parseSourceReceiptText(JSON.stringify(invalidated),ORIGINAL_REPO_RECEIPTS[0],{checkBlob:false}),
 /M07_D08_RECEIPT_LEGACY_V01_IDEMPOTENCY_INVALIDATION_MISSING/);
const invalidV02=JSON.parse(readFileSync(ORIGINAL_REPO_RECEIPTS[1].path,"utf8"));
invalidV02.validationStatus="PASS_UNVERIFIED";
assert.throws(()=>parseSourceReceiptText(JSON.stringify(invalidV02),ORIGINAL_REPO_RECEIPTS[1],{checkBlob:false}),
 /M07_D08_RECEIPT_SOURCE_V02_IDEMPOTENCY_WITNESS_DRIFT/);
const fake=new Map();
for(const g of groups)for(const row of g.rows)fake.set(row.id,row.bytes??10);
const additional=498-fake.size;
let idx=0;
while(fake.size<498)fake.set(hash("synthetic-private-other-"+idx++),1);
const target=255515971;
const firstUnknown=hash("synthetic-private-other-0");
const current=[...fake.values()].reduce((a,b)=>a+b,0);
assert.ok(current<target);
fake.set(firstUnknown,fake.get(firstUnknown)+(target-current));
const result=joinOriginalReceipts(fake,groups);
assert.equal(result.status,"SOURCE_D08_WRITER_RECEIPTS_154_KEY_IDENTITIES_MATCH_G3_498_EXTRA__AUDIT_PENDING");
assert.equal(result.sourceD08WriterReceiptKeyHashMatched,154);
assert.equal(result.legacyV01ObjectsPhysicalSourceOnly,44);
assert.equal(result.nonLegacyWriterReceiptKeyMatches,110);
assert.equal(result.legacyV01EligibleForCanonicalHistoricalValuationResearch,false);
assert.equal(result.byWriterReceipt.RAW_V01.originalSourceReceiptCanonicalEvidenceState,
  "INVALIDATED_BY_IDEMPOTENCY_COUNTEREVIDENCE__OBJECT_PROVENANCE_ONLY");
assert.equal(result.sourceD08WriterReceiptsRows,154);
assert.equal(result.writerReceiptGzipSizeParity,132);
assert.equal(result.originalExtraKeyCountStillWithoutTheseFourGitHubReceiptMatches,344);
assert.equal(result.byWriterReceipt.RAW_V01.sourceR2ExtraKeyHashMatches,44);
assert.equal(result.byWriterReceipt.ANNUAL_V01.writerReceiptMissingSizeField,22);
assert.equal(result.independentSourceObjectByteSha256VerifiedByThisJob,0);
assert.equal(result.independentAuditLaneAccepted,false);
assert.equal(JSON.stringify(result).includes("research/d08/"),false);
const mismatched=new Map(fake);
const from=groups[0].rows[0];
mismatched.set(from.id,mismatched.get(from.id)+1);
mismatched.set(firstUnknown,mismatched.get(firstUnknown)-1);
const no=joinOriginalReceipts(mismatched,groups);
assert.equal(no.status,"SOURCE_D08_WRITER_RECEIPTS_PARTIAL_OR_LIST_SIZE_CONFLICT__NOT_ACCEPTED");
assert.equal(no.writerReceiptGzipSizeConflict,1);
const missing=new Map(fake);
missing.delete(from.id);
const replace=hash("synthetic replacement");
missing.set(replace,from.bytes);
assert.equal(joinOriginalReceipts(missing,groups).sourceD08WriterReceiptKeyHashMatched,153);
const wrongGroups=[...groups.map(x=>({label:x.label,rows:[...x.rows]}))];
wrongGroups[3].rows[0]=wrongGroups[0].rows[0];
assert.throws(()=>joinOriginalReceipts(fake,wrongGroups),/M07_D08_RECEIPT_DUPLICATE_OBJECT_IDENTITIES_ACROSS_SOURCE_RECEIPTS/);
const impl=readFileSync("system2/migration/issue1236_m07_original_d08_writer_receipt_g3_498_offline_join_v0_1.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-d08-source-receipts-to-g3-extras-offline.yml","utf8");
assert.match(wf,/run-id: 38527825185/);
assert.match(wf,/s2-m07-private-498-extra-keyhashes-38527825185-1/);
assert.match(wf,/environment: system2-research/);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_R2_SECRET_ACCESS_KEY|S2_SCHEMA_DEST_D1_WRITE_TOKEN/);
assert.doesNotMatch(impl,/\bfetch\(|putIfAbsent|INSERT INTO|DELETE FROM|method:"PUT"|method:"DELETE"/);
console.log("M07 original 44+44+44+22 D08 GitHub receipts and synthetic protected 498 hashes adversarial tests PASS");
