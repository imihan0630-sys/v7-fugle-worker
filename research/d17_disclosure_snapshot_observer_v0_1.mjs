import { createHash } from "node:crypto";

const SOURCE_FIELDS = {
  TWSE: {
    reportDate: "出表日期",
    symbol: "公司代號",
    companyName: "公司名稱",
    subject: "主旨 ",
  },
  TPEX: {
    reportDate: "Date",
    symbol: "SecuritiesCompanyCode",
    companyName: "CompanyName",
    subject: "主旨",
  },
};

function sha256(value) {
  return createHash("sha256").update(String(value), "utf8").digest("hex");
}

function cleanText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function normalizeRocTimestamp(dateValue, timeValue) {
  const date = String(dateValue ?? "").trim();
  const time = String(timeValue ?? "").trim().padStart(6, "0");
  if (!/^\d{7}$/.test(date) || !/^\d{6}$/.test(time)) return null;

  const year = Number(date.slice(0, 3)) + 1911;
  const month = Number(date.slice(3, 5));
  const day = Number(date.slice(5, 7));
  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(2, 4));
  const second = Number(time.slice(4, 6));
  const calendarCheck = new Date(Date.UTC(year, month - 1, day));

  if (
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() + 1 !== month ||
    calendarCheck.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) return null;

  return `${year.toString().padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}+08:00`;
}

export function normalizeOfficialDisclosureRow(sourceId, row, capturedAt) {
  const fields = SOURCE_FIELDS[sourceId];
  if (!fields) throw new Error(`Unsupported sourceId: ${sourceId}`);
  const captured = new Date(capturedAt);
  if (Number.isNaN(captured.valueOf())) throw new Error("capturedAt must be a valid timestamp");

  const normalized = {
    sourceId,
    providerItemId: null,
    reportDateRoc: cleanText(row?.[fields.reportDate]),
    publishedDateRoc: cleanText(row?.["發言日期"]),
    publishedTimeRaw: cleanText(row?.["發言時間"]),
    publishedAtSource: normalizeRocTimestamp(row?.["發言日期"], row?.["發言時間"]),
    capturedAt: captured.toISOString(),
    firstKnownAtConservative: captured.toISOString(),
    symbol: cleanText(row?.[fields.symbol]),
    companyName: cleanText(row?.[fields.companyName]),
    subject: cleanText(row?.[fields.subject]),
    clause: cleanText(row?.["符合條款"]),
    factDateRoc: cleanText(row?.["事實發生日"]),
    description: cleanText(row?.["說明"]),
  };

  const identityMaterial = [
    normalized.sourceId,
    normalized.symbol,
    normalized.publishedDateRoc,
    normalized.publishedTimeRaw,
    normalized.clause,
    normalized.factDateRoc,
    normalized.subject,
  ].join("|");
  const semanticMaterial = [
    normalized.symbol,
    normalized.clause,
    normalized.factDateRoc,
    normalized.subject,
    normalized.description,
  ].join("|");
  const sourceContentMaterial = [
    normalized.reportDateRoc,
    normalized.publishedDateRoc,
    normalized.publishedTimeRaw,
    normalized.symbol,
    normalized.companyName,
    normalized.subject,
    normalized.clause,
    normalized.factDateRoc,
    normalized.description,
  ].join("|");

  return {
    ...normalized,
    derivedIdentitySha256: sha256(identityMaterial),
    semanticCandidateSha256: sha256(semanticMaterial),
    contentSha256: sha256(sourceContentMaterial),
    recordVersionSha256: sha256(`${sourceContentMaterial}|${normalized.capturedAt}`),
    timeQuality: normalized.publishedAtSource ? "SOURCE_CLOCK_PRESENT_CAPTURE_CLOCK_AUTHORITATIVE" : "SOURCE_CLOCK_INVALID_CAPTURE_CLOCK_ONLY",
    revisionLinkQuality: "NO_NATIVE_PROVIDER_ITEM_OR_SUPERSESSION_ID",
  };
}

export function normalizeOfficialDisclosureSnapshot(sourceId, rows, capturedAt) {
  if (!Array.isArray(rows)) throw new Error("rows must be an array");
  const items = rows.map((row) => normalizeOfficialDisclosureRow(sourceId, row, capturedAt));
  const identities = new Set(items.map((item) => item.derivedIdentitySha256));
  return {
    sourceId,
    capturedAt: new Date(capturedAt).toISOString(),
    rowCount: items.length,
    distinctDerivedIdentityCount: identities.size,
    duplicateDerivedIdentityCount: items.length - identities.size,
    nativeProviderItemIdCoverage: 0,
    items,
  };
}

export function compareOfficialDisclosureSnapshots(previous, current) {
  if (previous.sourceId !== current.sourceId) throw new Error("sourceId mismatch");
  const before = new Map(previous.items.map((item) => [item.derivedIdentitySha256, item]));
  const after = new Map(current.items.map((item) => [item.derivedIdentitySha256, item]));
  const added = [];
  const removed = [];
  const contentChanged = [];
  let unchanged = 0;

  for (const [id, item] of after) {
    const prior = before.get(id);
    if (!prior) added.push(id);
    else if (prior.contentSha256 !== item.contentSha256) contentChanged.push(id);
    else unchanged += 1;
  }
  for (const id of before.keys()) if (!after.has(id)) removed.push(id);

  return {
    sourceId: previous.sourceId,
    previousCapturedAt: previous.capturedAt,
    currentCapturedAt: current.capturedAt,
    unchangedCount: unchanged,
    addedDerivedIdentities: added,
    removedDerivedIdentities: removed,
    contentChangedDerivedIdentities: contentChanged,
    revisionIncidenceState:
      added.length === 0 && removed.length === 0 && contentChanged.length === 0
        ? "NO_CHANGE_OBSERVED_IN_BOUNDED_INTERVAL"
        : "CHANGE_OBSERVED_REVISION_CAUSE_UNPROVEN",
    removalMeaning: "UNKNOWN_WINDOW_EVICTION_OR_SOURCE_REMOVAL_OR_CORRECTION",
    correctionChainProvable: false,
  };
}
