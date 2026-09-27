import assert from "node:assert/strict";
import { createHash, webcrypto } from "node:crypto";
import {
  RECEIPT_HASH_CONTRACT,
  canonicalJcsJson,
  normalizeDateOnly,
  normalizeInstant,
  sha256HexUtf8,
  hashCanonicalReceipt,
} from "./canonical_receipt_hash_v0_1.mjs";

assert.equal(canonicalJcsJson({b:2,a:1}),'{"a":1,"b":2}');
assert.equal(
  canonicalJcsJson({z:-0,a:[3,{y:2,x:1}]}),
  '{"a":[3,{"x":1,"y":2}],"z":0}'
);

assert.equal(normalizeDateOnly("2026-09-29"),"2026-09-29");
assert.equal(normalizeInstant("2026-09-29T16:00:00+08:00"),"2026-09-29T08:00:00.000Z");
assert.equal(normalizeInstant("2026-09-29T08:00:00Z"),"2026-09-29T08:00:00.000Z");
assert.equal(
  normalizeInstant("2026-09-29T08:00:00.000000000Z"),
  "2026-09-29T08:00:00.000Z"
);

assert.throws(()=>normalizeInstant("2026-09-29T16:00:00"),/OFFSET_AWARE_TIMESTAMP_REQUIRED/);
assert.throws(()=>normalizeInstant("2026-09-29T08:00:00-00:00"),/UNKNOWN_UTC_OFFSET_NOT_ALLOWED/);
assert.throws(()=>normalizeDateOnly("2026-02-30"),/INVALID_DATE_ONLY/);

for (const bad of [NaN,Infinity,-Infinity,undefined,1n,new Date("2026-09-29T00:00:00Z"),new Map()]) {
  assert.throws(()=>canonicalJcsJson({bad}));
}
const sparse=[]; sparse[1]=1;
assert.throws(()=>canonicalJcsJson(sparse),/SPARSE_ARRAY_NOT_ALLOWED/);

const composed="é";
const decomposed="e\u0301";
assert.notEqual(composed,decomposed);
assert.notEqual(canonicalJcsJson({s:composed}),canonicalJcsJson({s:decomposed}));

const vector='{"a":1,"b":2}';
assert.equal(
  createHash("sha256").update(RECEIPT_HASH_CONTRACT.domains.PARENT_ID + vector,"utf8").digest("hex"),
  "2f76fdd83f0b4ae4bcd94c50aabd4a03466339eb0f3562cdf9f7f894cf3e54d9"
);
assert.equal(
  createHash("sha256").update(RECEIPT_HASH_CONTRACT.domains.SEMANTIC_FINGERPRINT + vector,"utf8").digest("hex"),
  "3636cf7a54dd401e834b6bf06840b2db8fa182a39cc2b5206c6cabd054db3d74"
);

assert.equal(
  await hashCanonicalReceipt({b:2,a:1},"PARENT_ID",webcrypto),
  "2f76fdd83f0b4ae4bcd94c50aabd4a03466339eb0f3562cdf9f7f894cf3e54d9"
);
assert.equal(
  await sha256HexUtf8(
    RECEIPT_HASH_CONTRACT.domains.GENERIC_TEST + '{"a":[3,{"x":1,"y":2}],"z":0}',
    webcrypto
  ),
  "9d5a9938d54eb0ee71085036fa2e419321c6e8dcd7d451d0c12ec3a8617526f3"
);

assert.notEqual(
  await hashCanonicalReceipt({s:composed},"GENERIC_TEST",webcrypto),
  await hashCanonicalReceipt({s:decomposed},"GENERIC_TEST",webcrypto)
);

console.log(JSON.stringify({ok:true,contract:"SHA256_JCS_V0_1_PASS"}));
