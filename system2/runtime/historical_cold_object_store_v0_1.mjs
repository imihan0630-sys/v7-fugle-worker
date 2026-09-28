import { deepFreeze } from "./factor_snapshot.mjs";

export const HISTORICAL_COLD_OBJECT_STORE_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function safeSegment(value, field) {
  const text = requiredText(value, field);
  if (!/^[A-Za-z0-9._=-]+$/.test(text) || text.includes("..")) {
    throw new Error(field + " contains an unsafe object-key segment");
  }
  return text;
}

export function historicalPackObjectKeyV0_1(pack) {
  if (!pack || typeof pack !== "object") throw new Error("pack is required");
  const market = safeSegment(pack.market, "pack.market");
  const symbol = safeSegment(pack.symbol, "pack.symbol");
  const priceSpace = safeSegment(pack.priceSpace, "pack.priceSpace");
  const payloadHash = safeSegment(pack.payloadHash, "pack.payloadHash");
  const year = Number(pack.year);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new Error("pack.year is invalid");
  return `a1/v0.1/market=${market}/year=${year}/symbol=${symbol}/price_space=${priceSpace}/${payloadHash}.json.gz`;
}

function normalizeObjectMetadata(object) {
  if (!object) return null;
  return deepFreeze({
    key: object.key || null,
    size: Number(object.size),
    etag: object.etag || null,
    version: object.version || null,
    uploadedAt: object.uploaded instanceof Date
      ? object.uploaded.toISOString()
      : object.uploaded || null,
    storageClass: object.storageClass || null,
    customMetadata: deepFreeze({ ...(object.customMetadata || {}) }),
  });
}

export function createR2BindingHistoricalObjectStoreV0_1({
  bucket,
  bucketName,
} = {}) {
  if (!bucket || typeof bucket.head !== "function" || typeof bucket.get !== "function" || typeof bucket.put !== "function") {
    throw new Error("R2 bucket binding is required");
  }
  const name = requiredText(bucketName, "bucketName");
  return deepFreeze({
    backend: "CLOUDFLARE_R2",
    bucketName: name,
    async head(key) {
      return normalizeObjectMetadata(await bucket.head(requiredText(key, "key")));
    },
    async putIfAbsent(key, bytes, options = {}) {
      const httpMetadata = {
        contentType: options.contentType || "application/octet-stream",
      };
      // Keep compressed historical bytes opaque by default. Content-Encoding
      // causes HTTP clients to transparently decode the payload, which breaks
      // exact stored-byte SHA-256 verification on readback.
      if (options.contentEncoding) httpMetadata.contentEncoding = String(options.contentEncoding);
      const object = await bucket.put(requiredText(key, "key"), bytes, {
        onlyIf: { etagDoesNotMatch: "*" },
        httpMetadata,
        customMetadata: { ...(options.customMetadata || {}) },
        sha256: options.sha256,
        storageClass: options.storageClass || "Standard",
      });
      return normalizeObjectMetadata(object);
    },
    async get(key) {
      const object = await bucket.get(requiredText(key, "key"));
      if (!object || !("body" in object)) return null;
      return Object.freeze({
        metadata: normalizeObjectMetadata(object),
        bytes: new Uint8Array(await object.arrayBuffer()),
      });
    },
  });
}

export function assertHistoricalColdObjectStoreV0_1(store) {
  if (
    !store
    || typeof store.head !== "function"
    || typeof store.putIfAbsent !== "function"
    || typeof store.get !== "function"
  ) {
    throw new Error("historical cold object store adapter is required");
  }
  requiredText(store.backend, "objectStore.backend");
  requiredText(store.bucketName, "objectStore.bucketName");
  return store;
}
