import { createHash, createHmac } from "node:crypto";
import { deepFreeze } from "../runtime/factor_snapshot.mjs";

export const REMOTE_R2_S3_ADAPTER_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key, value, encoding = undefined) {
  return createHmac("sha256", key).update(value).digest(encoding);
}

function encodePath(key) {
  const text = requiredText(key, "key");
  if (text.startsWith("/") || text.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error("unsafe R2 object key");
  }
  return "/" + text.split("/").map((part) => encodeURIComponent(part).replace(/[!'()*]/g, (c) =>
    "%" + c.charCodeAt(0).toString(16).toUpperCase())).join("/");
}

function amzTimestamp(now) {
  return now.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function canonicalHeaders(headers) {
  const entries = [...headers.entries()]
    .map(([key, value]) => [key.toLowerCase().trim(), String(value).trim().replace(/\s+/g, " ")])
    .sort((a, b) => a[0].localeCompare(b[0]));
  return {
    canonical: entries.map(([key, value]) => `${key}:${value}\n`).join(""),
    signed: entries.map(([key]) => key).join(";"),
  };
}

function signingKey(secretAccessKey, shortDate) {
  const dateKey = hmac("AWS4" + secretAccessKey, shortDate);
  const regionKey = hmac(dateKey, "auto");
  const serviceKey = hmac(regionKey, "s3");
  return hmac(serviceKey, "aws4_request");
}

function signRequest({ method, host, path, headers, payloadHash, accessKeyId, secretAccessKey, now }) {
  const timestamp = amzTimestamp(now);
  const shortDate = timestamp.slice(0, 8);
  headers.set("host", host);
  headers.set("x-amz-content-sha256", payloadHash);
  headers.set("x-amz-date", timestamp);
  const normalized = canonicalHeaders(headers);
  const canonicalRequest = [method, path, "", normalized.canonical, normalized.signed, payloadHash].join("\n");
  const scope = `${shortDate}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", timestamp, scope, sha256Hex(canonicalRequest)].join("\n");
  const signature = hmac(signingKey(secretAccessKey, shortDate), stringToSign, "hex");
  headers.set(
    "authorization",
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${normalized.signed}, Signature=${signature}`,
  );
  return headers;
}

function metadataFromHeaders(key, headers) {
  const customMetadata = {};
  for (const [name, value] of headers.entries()) {
    if (name.toLowerCase().startsWith("x-amz-meta-")) {
      customMetadata[name.slice("x-amz-meta-".length)] = value;
    }
  }
  return deepFreeze({
    key,
    size: Number(headers.get("content-length") || 0),
    etag: String(headers.get("etag") || "").replace(/^\"|\"$/g, "") || null,
    version: headers.get("x-amz-version-id") || null,
    uploadedAt: headers.get("last-modified") || null,
    storageClass: headers.get("x-amz-storage-class") || "Standard",
    customMetadata: deepFreeze(customMetadata),
  });
}

export function createRemoteR2S3Adapter({
  accountId,
  accessKeyId,
  secretAccessKey,
  bucketName,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
} = {}) {
  const account = requiredText(accountId, "accountId");
  const access = requiredText(accessKeyId, "accessKeyId");
  const secret = requiredText(secretAccessKey, "secretAccessKey");
  const bucket = requiredText(bucketName, "bucketName");
  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(bucket)) throw new Error("bucketName is invalid");
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  const host = `${account}.r2.cloudflarestorage.com`;
  const emptyHash = sha256Hex("");

  async function request(method, key, { bytes = null, headers: extraHeaders = {} } = {}) {
    const objectPath = encodePath(key);
    const path = "/" + encodeURIComponent(bucket) + objectPath;
    const body = bytes === null ? undefined : Buffer.from(bytes);
    const payloadHash = body ? sha256Hex(body) : emptyHash;
    const headers = new Headers(extraHeaders);
    signRequest({
      method, host, path, headers, payloadHash,
      accessKeyId: access, secretAccessKey: secret, now: now(),
    });
    const response = await fetchImpl(`https://${host}${path}`, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(60000),
    });
    return { response, objectPath: key, payloadHash };
  }

  async function head(key) {
    const { response } = await request("HEAD", key);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`R2 HEAD failed: HTTP ${response.status}`);
    return metadataFromHeaders(key, response.headers);
  }

  return deepFreeze({
    backend: "CLOUDFLARE_R2_S3",
    bucketName: bucket,
    async head(key) {
      return head(requiredText(key, "key"));
    },
    async putIfAbsent(key, bytes, options = {}) {
      const metadata = options.customMetadata || {};
      const headers = {
        "content-type": options.contentType || "application/json",
        "content-encoding": options.contentEncoding || "gzip",
        "if-none-match": "*",
        "x-amz-storage-class": options.storageClass === "InfrequentAccess" ? "STANDARD_IA" : "STANDARD",
      };
      for (const [name, value] of Object.entries(metadata)) {
        if (!/^[a-z0-9-]+$/.test(name)) throw new Error("invalid R2 custom metadata key: " + name);
        headers["x-amz-meta-" + name] = String(value);
      }
      const result = await request("PUT", requiredText(key, "key"), { bytes, headers });
      if (result.response.status === 412) return null;
      if (!result.response.ok) throw new Error(`R2 PUT failed: HTTP ${result.response.status}`);
      return await head(key);
    },
    async get(key) {
      const result = await request("GET", requiredText(key, "key"));
      if (result.response.status === 404) return null;
      if (!result.response.ok) throw new Error(`R2 GET failed: HTTP ${result.response.status}`);
      return Object.freeze({
        metadata: metadataFromHeaders(key, result.response.headers),
        bytes: new Uint8Array(await result.response.arrayBuffer()),
      });
    },
  });
}

export { encodePath, signRequest };
