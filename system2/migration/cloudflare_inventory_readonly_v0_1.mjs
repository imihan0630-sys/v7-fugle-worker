import { createHash } from "node:crypto";

/**
 * Read-only Cloudflare account resource inventory.
 * No D1 SQL, R2 object read/copy, mutation, secret listing, deploy or cron edits.
 * Do NOT print raw inventories before sanitization.
 */
export async function collectCloudflareInventory({ accountId, apiToken, fetchImpl = globalThis.fetch, now = () => new Date() } = {}) {
  if (!/^[0-9a-f]{32}$/i.test(accountId || "")) throw new Error("CLOUDFLARE_ACCOUNT_ID_INVALID");
  if (typeof apiToken !== "string" || !apiToken.trim()) throw new Error("READ_ONLY_API_TOKEN_MISSING");
  if (typeof fetchImpl !== "function") throw new Error("FETCH_UNAVAILABLE");

  const base = "https://api.cloudflare.com/client/v4/accounts/" + accountId;
  const request = async (path) => {
    if (!path.startsWith("/") || path.startsWith("//")) throw new Error("INVALID_API_PATH");
    const response = await fetchImpl(base + path, {
      method: "GET", headers: { authorization: "Bearer " + apiToken, accept: "application/json" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error("CLOUDFLARE_READ_ONLY_API_ERROR_" + response.status);
    const payload = await response.json();
    if (payload?.success !== true) throw new Error("CLOUDFLARE_READ_ONLY_API_RESPONSE_INVALID");
    return payload;
  };
  async function numbered(path, getRows) {
    let result = [], total = null;
    for (let page = 1; page <= 50; page++) {
      const payload = await request(path + (path.includes("?") ? "&" : "?") + "page=" + page + "&per_page=100");
      const rows = getRows(payload);
      if (!Array.isArray(rows)) throw new Error("RESOURCE_LIST_NOT_ARRAY");
      result = result.concat(rows);
      const info = payload.result_info;
      if (Number.isInteger(info?.total_count)) {
        total = info.total_count;
        if (result.length >= total) {
          if (result.length !== total) throw new Error("INVENTORY_TOTAL_COUNT_MISMATCH");
          return result;
        }
      } else if (rows.length < 100) return result;
      if (!rows.length) throw new Error("INVENTORY_PAGINATION_INCONSISTENT");
    }
    throw new Error("INVENTORY_PAGE_LIMIT");
  }

  // R2 pagination uses a cursor, unlike D1 / KV.
  async function r2Buckets() {
    const buckets = [];
    const cursors = new Set();
    let cursor = "";
    for (let page = 0; page < 50; page++) {
      const payload = await request("/r2/buckets?per_page=100" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : ""));
      const rows = payload?.result?.buckets;
      if (!Array.isArray(rows)) throw new Error("R2_BUCKET_LIST_NOT_ARRAY");
      buckets.push(...rows);
      const next = payload?.result_info?.cursor ?? payload?.result?.cursor ?? "";
      if (!next) return buckets;
      if (cursors.has(next)) throw new Error("R2_CURSOR_LOOP");
      cursors.add(next);
      cursor = next;
    }
    throw new Error("R2_CURSOR_LIMIT");
  }

  const [databases, workerRaw, buckets, kvNamespaces] = await Promise.all([
    numbered("/d1/database", p => p.result),
    request("/workers/scripts"),
    r2Buckets(),
    numbered("/storage/kv/namespaces", p => p.result),
  ]);
  if (!Array.isArray(workerRaw.result)) throw new Error("WORKER_LIST_NOT_ARRAY");
  const workers = workerRaw.result.map(w => ({ id: w.id }));
  const s2Worker = workers.find(w => w.id === "system2-shadow-research");
  let crons = [];
  if (s2Worker) {
    const name = encodeURIComponent(s2Worker.id);
    const [settings, schedules] = await Promise.all([
      request("/workers/scripts/" + name + "/settings"),
      request("/workers/scripts/" + name + "/schedules"),
    ]);
    const bindings = settings.result?.bindings;
    const schedulesList = schedules.result?.schedules ?? schedules.result;
    if (!Array.isArray(bindings) || !Array.isArray(schedulesList)) throw new Error("WORKER_METADATA_INCOMPLETE");
    s2Worker.bindings = bindings.map(b => ({ name: b?.name, type: b?.type }));
    crons = schedulesList.map(s => ({ cron: s.cron, worker: s2Worker.id }));
  }
  return {
    // Returned accountId is PRIVATE in-process only; do not serialize this object.
    accountId,
    complete: true,
    verifiedBy: "CLOUDFLARE_READ_ONLY_API",
    verifiedAt: now().toISOString(),
    databases: databases.map(d => ({ name: d.name, idFingerprint: createHash("sha256").update(String(d.uuid || "UNKNOWN")).digest("hex") })),
    workers, buckets: buckets.map(b => ({ name: b.name })),
    kvNamespaces: kvNamespaces.map(k => ({ name: k.title })),
    crons,
  };
}

export function publicCloudflareInventory(privateInventory) {
  if (!privateInventory || privateInventory.complete !== true || !/^[a-f0-9]{32}$/i.test(privateInventory.accountId || "")) throw new Error("UNVERIFIED_PRIVATE_INVENTORY");
  const accountFingerprint = createHash("sha256").update(privateInventory.accountId.toLowerCase()).digest("hex");
  // Explicit whitelist; no accidental token/binding values/resource IDs leak.
  return {
    accountFingerprint,
    complete: true,
    verifiedBy: privateInventory.verifiedBy,
    verifiedAt: privateInventory.verifiedAt,
    databases: privateInventory.databases.map(x => ({ name: x.name, idFingerprint: x.idFingerprint })),
    workers: privateInventory.workers.map(x => ({ id: x.id, bindings: Array.isArray(x.bindings) ? x.bindings.map(b => ({ name: b.name, type: b.type })) : undefined })),
    buckets: privateInventory.buckets.map(x => ({ name: x.name })),
    kvNamespaces: privateInventory.kvNamespaces.map(x => ({ name: x.name })),
    crons: privateInventory.crons.map(x => ({ worker: x.worker, cron: x.cron })),
    excluded: ["secret values", "account IDs", "R2 object keys/bytes", "D1 row contents", "operational request logs"],
  };
}
