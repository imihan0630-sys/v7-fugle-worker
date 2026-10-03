import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "./official_continuity_source_capability_v0_1.mjs";

export const OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION = "0.1-RESEARCH";

const HISTORICAL_SOURCE_IDS = Object.freeze([
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field = "date") {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  const parsed = new Date(text + "T00:00:00.000Z");
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
    throw new Error(field + " must be a valid YYYY-MM-DD");
  }
  return text;
}

function normalizeDateToken(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text) return null;
  const compact = text.replace(/[年/月日.\-]/g, "");
  let year;
  let month;
  let day;
  if (/^\d{8}$/.test(compact)) {
    year = Number(compact.slice(0, 4));
    month = Number(compact.slice(4, 6));
    day = Number(compact.slice(6, 8));
  } else if (/^\d{7}$/.test(compact)) {
    year = Number(compact.slice(0, 3)) + 1911;
    month = Number(compact.slice(3, 5));
    day = Number(compact.slice(5, 7));
  } else {
    return null;
  }
  const normalized = String(year).padStart(4, "0") + "-" +
    String(month).padStart(2, "0") + "-" +
    String(day).padStart(2, "0");
  try {
    return isoDate(normalized, "normalizedDate");
  } catch {
    return null;
  }
}

function responseRange(payload) {
  let rawStart = null;
  let rawEnd = null;
  if (typeof payload?.date === "string" && payload.date.includes("~")) {
    const parts = payload.date.trim().split("~");
    if (parts.length === 2) [rawStart, rawEnd] = parts;
  } else if (payload?.params && typeof payload.params === "object" && !Array.isArray(payload.params)) {
    rawStart = payload.params.startDate ?? null;
    rawEnd = payload.params.endDate ?? null;
  } else {
    rawStart = payload?.strDate ?? payload?.startDate ?? null;
    rawEnd = payload?.endDate ?? null;
  }
  return {
    rawStart,
    rawEnd,
    startDate: normalizeDateToken(rawStart),
    endDate: normalizeDateToken(rawEnd),
  };
}

function payloadRows(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  const tables = Array.isArray(payload?.tables) ? payload.tables : [];
  return tables.flatMap((table) => Array.isArray(table?.data) ? table.data : []);
}

function boundedStatus(payload) {
  const out = {};
  for (const key of ["stat", "status", "message", "msg", "note", "title"]) {
    const value = payload?.[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, 240);
  }
  return out;
}

export async function analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId,
  rawText,
  requestedDate,
  httpStatus = 200,
  contentType = null,
} = {}) {
  const id = requiredText(sourceId, "sourceId");
  if (!HISTORICAL_SOURCE_IDS.includes(id)) throw new Error("unsupported historical sourceId: " + id);
  const date = isoDate(requestedDate, "requestedDate");
  const body = requiredText(rawText, "rawText");
  const payloadHash = await sha256Hex(body);
  let payload;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    return deepFreeze({
      sourceId: id,
      state: "PAYLOAD_PARSE_ERROR",
      requestedDate: date,
      httpStatus: Number(httpStatus),
      contentType,
      payloadHash,
      responseRangeVerified: false,
      rowCount: null,
      exactRangeZeroObserved: false,
      emptyRangeSemanticsCertified: false,
      noEventMayBeClaimed: false,
      error: String(error?.message || error),
    });
  }

  const range = responseRange(payload);
  const rows = payloadRows(payload);
  const responseRangeVerified = range.startDate === date && range.endDate === date;
  const rowCount = rows.length;
  const exactRangeZeroObserved =
    Number(httpStatus) >= 200 &&
    Number(httpStatus) < 300 &&
    responseRangeVerified &&
    rowCount === 0;

  return deepFreeze({
    sourceId: id,
    state: exactRangeZeroObserved
      ? "EXACT_RANGE_ZERO_OBSERVED_UNCERTIFIED"
      : responseRangeVerified
        ? "RANGE_VERIFIED_NONZERO_OR_UNUSABLE"
        : "RANGE_UNVERIFIED",
    requestedDate: date,
    httpStatus: Number(httpStatus),
    contentType,
    payloadHash,
    responseRangeStart: range.startDate,
    responseRangeEnd: range.endDate,
    responseRangeVerified,
    rowCount,
    statusFields: deepFreeze(boundedStatus(payload)),
    topLevelKeys: Object.freeze(Object.keys(payload || {}).sort()),
    tableCount: Array.isArray(payload?.tables) ? payload.tables.length : null,
    exactRangeZeroObserved,
    emptyRangeSemanticsCertified: false,
    noEventMayBeClaimed: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export async function probeOfficialContinuityEmptyRangeV0_1({
  requestedDate,
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  timeoutMs = 30_000,
} = {}) {
  const date = isoDate(requestedDate, "requestedDate");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("observedAt must be an ISO timestamp");
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  const sources = buildOfficialContinuitySourceUrlsV0_1({ startDate: date, endDate: date });
  const results = [];

  for (const sourceId of HISTORICAL_SOURCE_IDS) {
    const source = sources[sourceId];
    let response;
    try {
      response = await fetchImpl(source.url, {
        method: "GET",
        redirect: "follow",
        headers: {
          accept: "application/json,text/plain,*/*",
          "user-agent": "System2-Official-Continuity-Empty-Range/0.1",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      results.push(deepFreeze({
        sourceId,
        state: "TRANSPORT_ERROR",
        requestedDate: date,
        httpStatus: null,
        contentType: null,
        payloadHash: null,
        responseRangeVerified: false,
        rowCount: null,
        exactRangeZeroObserved: false,
        emptyRangeSemanticsCertified: false,
        noEventMayBeClaimed: false,
        error: String(error?.message || error),
      }));
      continue;
    }
    const rawText = await response.text();
    results.push(await analyzeOfficialContinuityEmptyRangePayloadV0_1({
      sourceId,
      rawText,
      requestedDate: date,
      httpStatus: response.status,
      contentType: response.headers?.get?.("content-type") || null,
    }));
  }

  const exactRangeZeroObservedCount = results.filter((x) => x.exactRangeZeroObserved).length;
  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_CA_EMPTY_RANGE_PROBE_V0_1",
    version: OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION,
    requestedDate: date,
    observedAt: new Date(observedAt).toISOString(),
    sourceCount: results.length,
    exactRangeZeroObservedCount,
    allSourcesExactRangeZeroObserved: exactRangeZeroObservedCount === HISTORICAL_SOURCE_IDS.length,
    sources: Object.freeze(results),
    characterizationOnly: true,
    emptyRangeSemanticsCertified: false,
    noEventMayBeClaimed: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export function officialContinuityEmptyRangeSourceIdsV0_1() {
  return HISTORICAL_SOURCE_IDS;
}
