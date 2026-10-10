// Offline deterministic verification only; never copies or mutates Cloudflare resources.
const SHA = /^[a-f0-9]{64}$/i;
function fail(status, reasons, counts) {
  return Object.freeze({ status, reasons: Object.freeze([...new Set(reasons)]), counts, dataCopied: false, cutoverAuthorized: false });
}
function mapByUniqueKey(values, key, reasons, prefix) {
  const result = new Map();
  if (!Array.isArray(values)) { reasons.push(prefix + "_NOT_ARRAY"); return result; }
  for (const value of values) {
    const name = value?.[key];
    if (typeof name !== "string" || !name || result.has(name)) reasons.push(prefix + "_KEY_INVALID_OR_DUPLICATE");
    else result.set(name, value);
  }
  return result;
}
function validTable(value) {
  return value && typeof value.name === "string" && value.name.startsWith("s2_") &&
    Number.isSafeInteger(value.rows) && value.rows >= 0 && SHA.test(value.sha256 || "");
}
function validObject(value) {
  return value && typeof value.key === "string" && !value.key.startsWith("/") &&
    !value.key.split("/").some(s => !s || s === "." || s === "..") &&
    Number.isSafeInteger(value.bytes) && value.bytes >= 0 && SHA.test(value.sha256 || "");
}
function validReceipt(receipt, role, reasons) {
  const expected = role === "source" ? "SOURCE_READ_ONLY_EXPORT" : "DESTINATION_READBACK";
  if (receipt?.verifiedFrom !== expected || receipt?.complete !== true ||
      receipt.physicalReadback !== true || !SHA.test(receipt.schemaSha256 || "") ||
      !SHA.test(receipt.frozenSnapshotSha256 || "") || !SHA.test(receipt.exportSha256 || "") ||
      !Array.isArray(receipt.tables) || !receipt.tables.length || !Array.isArray(receipt.objects)) {
    reasons.push(role.toUpperCase() + "_PHYSICAL_RECEIPT_MISSING_OR_INVALID");
    return;
  }
  if (!receipt.tables.every(validTable) || !receipt.objects.every(validObject)) {
    reasons.push(role.toUpperCase() + "_ROW_OR_OBJECT_PROVENANCE_INVALID");
  }
}

export function compareCrossAccountStorageReadback({ source, destination } = {}) {
  const reasons = [];
  validReceipt(source, "source", reasons);
  validReceipt(destination, "destination", reasons);
  const sTables = mapByUniqueKey(source?.tables, "name", reasons, "SOURCE_TABLE");
  const dTables = mapByUniqueKey(destination?.tables, "name", reasons, "DESTINATION_TABLE");
  const sObjects = mapByUniqueKey(source?.objects, "key", reasons, "SOURCE_R2");
  const dObjects = mapByUniqueKey(destination?.objects, "key", reasons, "DESTINATION_R2");
  const counts = Object.freeze({
    sourceTables: sTables.size, destinationTables: dTables.size,
    sourceObjects: sObjects.size, destinationObjects: dObjects.size,
  });
  if (reasons.length) return fail("BLOCKED", reasons, counts);
  if (source.schemaSha256 !== destination.schemaSha256) reasons.push("SCHEMA_SHA_MISMATCH");
  if (source.frozenSnapshotSha256 !== destination.frozenSnapshotSha256) reasons.push("FROZEN_SNAPSHOT_SHA_MISMATCH");
  if (source.exportSha256 !== destination.exportSha256) reasons.push("EXPORT_CONTENT_SHA_MISMATCH");
  if (sTables.size !== dTables.size) reasons.push("TABLE_COUNT_MISMATCH");
  for (const [name, table] of sTables) {
    const other = dTables.get(name);
    if (!other) reasons.push("TABLE_MISSING:" + name);
    else if (table.rows !== other.rows || table.sha256 !== other.sha256) reasons.push("TABLE_MISMATCH:" + name);
  }
  for (const name of dTables.keys()) if (!sTables.has(name)) reasons.push("DESTINATION_UNEXPECTED_TABLE:" + name);
  if (sObjects.size !== dObjects.size) reasons.push("R2_OBJECT_COUNT_MISMATCH");
  for (const [key, value] of sObjects) {
    const other = dObjects.get(key);
    if (!other) reasons.push("R2_OBJECT_MISSING:" + key);
    else if (value.bytes !== other.bytes || value.sha256 !== other.sha256) reasons.push("R2_OBJECT_MISMATCH:" + key);
  }
  for (const key of dObjects.keys()) if (!sObjects.has(key)) reasons.push("DESTINATION_UNEXPECTED_R2_OBJECT:" + key);
  return fail(reasons.length ? "BLOCKED" : "MATCHED_REVIEW_REQUIRED", reasons, counts);
}
