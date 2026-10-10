// Offline-only safety gate. No Cloudflare API, IO, tokens or deployment authority.
export const CROSS_ACCOUNT_PREFLIGHT_VERSION = "0.1";
const S2_DB = "system2-research";
const S2_WORKER = "system2-shadow-research";
const S2_R2 = "system2-historical-research";
const SHA = /^[a-f0-9]{64}$/i;
const ID = /^[a-f0-9]{32}$/i;

function names(values, key = "name") {
  return Array.isArray(values) ? values.map(x => typeof x === "string" ? x : x?.[key]).filter(x => typeof x === "string") : null;
}
function validInventory(i) {
  return i && i.verifiedBy === "CLOUDFLARE_READ_ONLY_API" &&
    typeof i.verifiedAt === "string" && !Number.isNaN(Date.parse(i.verifiedAt)) &&
    Array.isArray(i.databases) && Array.isArray(i.workers) && Array.isArray(i.buckets) &&
    Array.isArray(i.kvNamespaces) && Array.isArray(i.crons) &&
    i.complete === true;
}
function exactOnce(items, value) {
  return items.filter(x => x === value).length === 1;
}
function frozenManifestReady(m) {
  if (!m || m.verifiedFrom !== "SOURCE_READ_ONLY_EXPORT" || m.complete !== true ||
      !SHA.test(m.exportSha256) || !SHA.test(m.schemaSha256) || !SHA.test(m.frozenSnapshotSha256) ||
      !Array.isArray(m.tables) || m.tables.length === 0 ||
      !Array.isArray(m.objects)) return false;
  const seen = new Set();
  for (const t of m.tables) {
    if (!t || typeof t.name !== "string" || !t.name.startsWith("s2_") ||
      !Number.isSafeInteger(t.rows) || t.rows < 0 || !SHA.test(t.sha256) || seen.has(t.name)) return false;
    seen.add(t.name);
  }
  const objectKeys = new Set();
  for (const o of m.objects) {
    if (!o || typeof o.key !== "string" || !o.key || o.key.startsWith("/") ||
      o.key.split("/").some(s => !s || s === "." || s === "..") ||
      !Number.isSafeInteger(o.bytes) || o.bytes < 0 || !SHA.test(o.sha256) ||
      objectKeys.has(o.key)) return false;
    objectKeys.add(o.key);
  }
  return true;
}

/**
 * Consumes read-only Cloudflare inventories and an immutable data manifest.
 * Returns REVIEW_ONLY at best: it NEVER authorizes creating resources/copying data.
 * Input account IDs are deliberately excluded from output.
 */
export function assessCrossAccountMigrationPreflight({ source, destination, manifest } = {}) {
  const blockers = [];
  const sourceId = source?.accountId;
  const destinationId = destination?.accountId;
  if (!ID.test(sourceId || "") || !ID.test(destinationId || "")) {
    blockers.push("ACCOUNT_IDENTITY_NOT_AUTHENTICATED");
  } else if (sourceId.toLowerCase() === destinationId.toLowerCase()) {
    blockers.push("SOURCE_DESTINATION_ACCOUNT_COLLISION");
  }
  if (!validInventory(source)) blockers.push("SOURCE_RESOURCE_INVENTORY_UNVERIFIED");
  if (!validInventory(destination)) blockers.push("DESTINATION_RESOURCE_INVENTORY_UNVERIFIED");
  if (validInventory(source)) {
    const d = names(source.databases);
    const w = names(source.workers, "id");
    const r = names(source.buckets);
    if (!exactOnce(d, S2_DB) || !exactOnce(w, S2_WORKER) || !exactOnce(r, S2_R2)) {
      blockers.push("SOURCE_S2_RESOURCE_IDENTITY_MISSING_OR_AMBIGUOUS");
    }
    const dbSize = source.databases.find(x => x?.name === S2_DB)?.sizeBytes;
    if (!Number.isSafeInteger(dbSize) || dbSize < 0) {
      blockers.push("SOURCE_D1_SIZE_UNKNOWN");
    } else if (dbSize >= 500_000_000) {
      blockers.push("SOURCE_D1_EXCEEDS_FREE_DATABASE_CAPACITY");
    }
    const bindings = source.workers.find(x => x?.id === S2_WORKER)?.bindings;
    if (!Array.isArray(bindings) ||
      !exactOnce(names(bindings), "SYSTEM2_DB") ||
      !exactOnce(names(bindings), "SYSTEM2_HISTORY_BUCKET") ||
      names(bindings).some(n => ["V7_DB", "STOCKS_KV"].includes(n))) {
      blockers.push("SOURCE_S2_BINDINGS_UNVERIFIED_OR_PRODUCTION_BOUND");
    }
  }
  if (validInventory(destination)) {
    const d = names(destination.databases);
    const w = names(destination.workers, "id");
    const r = names(destination.buckets);
    // No automatic reuse of unknown or pre-existing destination resources.
    if (d.includes(S2_DB) || w.includes(S2_WORKER) || r.includes(S2_R2)) {
      blockers.push("DESTINATION_RESOURCE_PREEXISTS_REQUIRE_MANUAL_RECONCILIATION");
    }
    if (w.includes("fugle-test") || d.includes("V7_DB")) {
      blockers.push("DESTINATION_CONTAINS_SYSTEM1_PRODUCTION_RESOURCE");
    }
    if (destination.crons.length || destination.kvNamespaces.length) {
      blockers.push("DESTINATION_RUNTIME_DEPENDENCIES_REQUIRE_REVIEW");
    }
  }
  if (!frozenManifestReady(manifest)) blockers.push("IMMUTABLE_SOURCE_MANIFEST_MISSING_OR_INVALID");
  if (manifest?.sourceAccountId && sourceId && manifest.sourceAccountId.toLowerCase() !== sourceId.toLowerCase()) {
    blockers.push("SOURCE_MANIFEST_ACCOUNT_MISMATCH");
  }
  const unique = Object.freeze([...new Set(blockers)]);
  return Object.freeze({
    version: CROSS_ACCOUNT_PREFLIGHT_VERSION,
    state: unique.length ? "BLOCKED" : "REVIEW_ONLY",
    blockers: unique,
    // This module intentionally never emits an authority token or a real account ID.
    cloudResourcesCreated: false,
    authorizedToMutate: false,
    sourceDataCopied: false,
    nextGate: unique.length ? "READ_ONLY_INVENTORY_OR_BACKUP_EVIDENCE" : "OWNER_APPROVAL_AND_INDEPENDENT_AUDIT",
  });
}
