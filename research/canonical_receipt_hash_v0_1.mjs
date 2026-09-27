// Research-only canonical receipt hashing contract.
// Canonicalization follows the RFC 8785 JCS model for the supported plain-JSON subset.

export const RECEIPT_HASH_CONTRACT = Object.freeze({
  canonicalizationVersion: "RFC8785_JCS_PLAIN_JSON_SUBSET_V0_1",
  hashAlgorithmVersion: "SHA256_UTF8_V0_1",
  schemaNormalizationVersion: "RECEIPT_SCHEMA_NORMALIZATION_V0_1",
  domains: Object.freeze({
    PARENT_ID: "TWSTOCK_V7|PARENT_ID|V1|",
    SEMANTIC_FINGERPRINT: "TWSTOCK_V7|SEMANTIC_FINGERPRINT|V1|",
    RANKING_TUPLE: "TWSTOCK_V7|RANKING_TUPLE|V1|",
    GENERIC_TEST: "TWSTOCK_V7|GENERIC_TEST|V1|",
  }),
});

function isPlainObject(value) {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function assertValidUnicodeString(text, path="$") {
  for (let i=0;i<text.length;i+=1) {
    const cu=text.charCodeAt(i);
    if (cu>=0xD800 && cu<=0xDBFF) {
      if (i+1>=text.length) throw new Error("LONE_HIGH_SURROGATE:" + path);
      const next=text.charCodeAt(i+1);
      if (next<0xDC00 || next>0xDFFF) throw new Error("LONE_HIGH_SURROGATE:" + path);
      i+=1;
      continue;
    }
    if (cu>=0xDC00 && cu<=0xDFFF) throw new Error("LONE_LOW_SURROGATE:" + path);
  }
}

function assertSupported(value, path="$") {
  if (value === null) return;
  const type=typeof value;
  if (type === "string") {
    assertValidUnicodeString(value,path);
    return;
  }
  if (type === "boolean") return;
  if (type === "number") {
    if (!Number.isFinite(value)) throw new Error("NON_FINITE_NUMBER:" + path);
    return;
  }
  if (type === "undefined") throw new Error("UNDEFINED_NOT_ALLOWED:" + path);
  if (type === "bigint") throw new Error("BIGINT_NOT_ALLOWED:" + path);
  if (type === "function") throw new Error("FUNCTION_NOT_ALLOWED:" + path);
  if (type === "symbol") throw new Error("SYMBOL_NOT_ALLOWED:" + path);

  if (Array.isArray(value)) {
    for (let i=0;i<value.length;i+=1) {
      if (!(i in value)) throw new Error("SPARSE_ARRAY_NOT_ALLOWED:" + path + "[" + i + "]");
      assertSupported(value[i],path + "[" + i + "]");
    }
    return;
  }

  if (!isPlainObject(value)) throw new Error("NON_PLAIN_OBJECT_NOT_ALLOWED:" + path);
  for (const key of Object.keys(value)) {
    assertValidUnicodeString(key,path + ".<key>");
    assertSupported(value[key],path + "." + key);
  }
}

function serializeCanonical(value) {
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") return JSON.stringify(Object.is(value,-0) ? 0 : value);
  if (Array.isArray(value)) return "[" + value.map(serializeCanonical).join(",") + "]";

  const keys=Object.keys(value).sort();
  return "{" + keys.map(key => JSON.stringify(key) + ":" + serializeCanonical(value[key])).join(",") + "}";
}

export function canonicalJcsJson(value) {
  assertSupported(value);
  return serializeCanonical(value);
}

export function normalizeDateOnly(value, field="date") {
  const text=String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("INVALID_DATE_ONLY:" + field);
  const [y,m,d]=text.split("-").map(Number);
  const check=new Date(Date.UTC(y,m-1,d));
  if (check.getUTCFullYear()!==y || check.getUTCMonth()!==m-1 || check.getUTCDate()!==d) {
    throw new Error("INVALID_DATE_ONLY:" + field);
  }
  return text;
}

export function normalizeInstant(value, field="instant") {
  const text=String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(text)) {
    throw new Error("OFFSET_AWARE_TIMESTAMP_REQUIRED:" + field);
  }
  if (/-00:00$/.test(text)) throw new Error("UNKNOWN_UTC_OFFSET_NOT_ALLOWED:" + field);
  const ms=Date.parse(text);
  if (!Number.isFinite(ms)) throw new Error("INVALID_TIMESTAMP:" + field);
  return new Date(ms).toISOString();
}

export async function sha256HexUtf8(text, cryptoImpl=globalThis.crypto) {
  if (!cryptoImpl?.subtle?.digest) throw new Error("WEB_CRYPTO_SHA256_REQUIRED");
  const bytes=new TextEncoder().encode(String(text));
  const digest=await cryptoImpl.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

export async function hashCanonicalReceipt(value, domainName, cryptoImpl=globalThis.crypto) {
  const prefix=RECEIPT_HASH_CONTRACT.domains[domainName];
  if (!prefix) throw new Error("UNKNOWN_HASH_DOMAIN:" + domainName);
  return sha256HexUtf8(prefix + canonicalJcsJson(value),cryptoImpl);
}
