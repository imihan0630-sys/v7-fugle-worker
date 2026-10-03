import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "./official_continuity_source_capability_v0_1.mjs";

export const OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION = "0.2-RESEARCH";

const HISTORICAL_SOURCE_IDS = Object.freeze([
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
]);

const EMPTY_SIGNATURE_RULES = deepFreeze({
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: {
    mode: "CONTROLLED_NO_DATA_STAT",
    positiveControlDate: "2026-04-08",
    expectedStat: "很抱歉，沒有符合條件的資料!",
  },
  TWSE_CAPITAL_REDUCTION_REFERENCE: {
    mode: "CONTROLLED_NO_DATA_STAT",
    positiveControlDate: "2026-06-29",
    expectedStat: "很抱歉，沒有符合條件的資料!",
  },
  TWSE_PAR_VALUE_CHANGE_REFERENCE: {
    mode: "EXACT_RANGE_ZERO",
    expectedStat: "OK",
    envelope: "TWSE_FIELDS_DATA",
  },
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: {
    mode: "EXACT_RANGE_ZERO",
    expectedStat: "ok",
    envelope: "TPEX_TABLES",
  },
  TPEX_CAPITAL_REDUCTION_REFERENCE: {
    mode: "EXACT_RANGE_ZERO",
    expectedStat: "ok",
    envelope: "TPEX_TABLES",
  },
  TPEX_PAR_VALUE_CHANGE_REFERENCE: {
    mode: "EXACT_RANGE_ZERO",
    expectedStat: "ok",
    envelope: "TPEX_TABLES",
  },
});

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

function envelopeMatches(payload, rule) {
  if (rule.envelope === "TWSE_FIELDS_DATA") {
    return Array.isArray(payload?.fields) && Array.isArray(payload?.data);
  }
  if (rule.envelope === "TPEX_TABLES") {
    return Array.isArray(payload?.tables) &&
      payload.tables.length > 0 &&
      payload.tables.every((table) => Array.isArray(table?.fields) && Array.isArray(table?.data));
  }
  return true;
}

function isHttpSuccess(status) {
  const n = Number(status);
  return n >= 200 && n < 300;
}

export async function analyzeOfficialContinuityEmptyRangePayloadV0_1({
  sourceId,
  rawText,
  requestedDate,
  httpStatus = 200,
  contentType = null,
  requestUrl = null,
  finalUrl = null,
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
      requestUrl,
      finalUrl,
      requestIdentityPreserved: false,
      responseRangeVerified: false,
      rowCount: null,
      exactRangeZeroObserved: false,
      emptySignatureMatched: false,
      emptyRangeSemanticsCertified: false,
      noEventMayBeClaimed: false,
      error: String(error?.message || error),
    });
  }

  const range = responseRange(payload);
  const rows = payloadRows(payload);
  const responseRangeVerified = range.startDate === date && range.endDate === date;
  const rowCount = rows.length;
  const requestIdentityPreserved =
    !requestUrl ||
    !finalUrl ||
    String(requestUrl) === String(finalUrl);
  const rule = EMPTY_SIGNATURE_RULES[id];
  const statusFields = boundedStatus(payload);
  const exactRangeZeroObserved =
    isHttpSuccess(httpStatus) &&
    requestIdentityPreserved &&
    responseRangeVerified &&
    rowCount === 0;
  const directSignature =
    rule.mode === "EXACT_RANGE_ZERO" &&
    exactRangeZeroObserved &&
    statusFields.stat === rule.expectedStat &&
    envelopeMatches(payload, rule);

  return deepFreeze({
    sourceId: id,
    state: directSignature
      ? "CERTIFIABLE_EXACT_RANGE_ZERO_SIGNATURE"
      : exactRangeZeroObserved
        ? "EXACT_RANGE_ZERO_OBSERVED_UNCERTIFIED"
        : responseRangeVerified
          ? "RANGE_VERIFIED_NONZERO_OR_UNUSABLE"
          : "RANGE_UNVERIFIED",
    requestedDate: date,
    httpStatus: Number(httpStatus),
    contentType,
    payloadHash,
    requestUrl,
    finalUrl,
    requestIdentityPreserved,
    responseRangeStart: range.startDate,
    responseRangeEnd: range.endDate,
    responseRangeVerified,
    rowCount,
    statusFields: deepFreeze(statusFields),
    topLevelKeys: Object.freeze(Object.keys(payload || {}).sort()),
    tableCount: Array.isArray(payload?.tables) ? payload.tables.length : null,
    exactRangeZeroObserved,
    emptySignatureMatched: directSignature,
    emptyRangeSemanticsCertified: directSignature,
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

function certifyControlledNoDataStat({ target, positiveControl, rule }) {
  const targetMatches =
    isHttpSuccess(target?.httpStatus) &&
    target?.requestIdentityPreserved === true &&
    target?.rowCount === 0 &&
    target?.responseRangeVerified === false &&
    target?.responseRangeStart === null &&
    target?.responseRangeEnd === null &&
    target?.statusFields?.stat === rule.expectedStat &&
    Array.isArray(target?.topLevelKeys) &&
    target.topLevelKeys.length === 1 &&
    target.topLevelKeys[0] === "stat";
  const controlMatches =
    positiveControl &&
    isHttpSuccess(positiveControl.httpStatus) &&
    positiveControl.requestIdentityPreserved === true &&
    positiveControl.responseRangeVerified === true &&
    Number(positiveControl.rowCount) > 0;

  return deepFreeze({
    mode: rule.mode,
    positiveControlDate: rule.positiveControlDate,
    targetSignatureMatched: targetMatches,
    positiveControlMatched: controlMatches,
    certified: targetMatches && controlMatches,
  });
}

async function fetchAnalysis({ sourceId, sourceUrl, date, fetchImpl, timeoutMs }) {
  let response;
  try {
    response = await fetchImpl(sourceUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "System2-Official-Continuity-Empty-Range/0.2",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return deepFreeze({
      sourceId,
      state: "TRANSPORT_ERROR",
      requestedDate: date,
      httpStatus: null,
      contentType: null,
      payloadHash: null,
      requestUrl: sourceUrl,
      finalUrl: null,
      requestIdentityPreserved: false,
      responseRangeVerified: false,
      rowCount: null,
      exactRangeZeroObserved: false,
      emptySignatureMatched: false,
      emptyRangeSemanticsCertified: false,
      noEventMayBeClaimed: false,
      error: String(error?.message || error),
    });
  }
  const rawText = await response.text();
  return analyzeOfficialContinuityEmptyRangePayloadV0_1({
    sourceId,
    rawText,
    requestedDate: date,
    httpStatus: response.status,
    contentType: response.headers?.get?.("content-type") || null,
    requestUrl: sourceUrl,
    finalUrl: response.url || sourceUrl,
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
  const targetSources = buildOfficialContinuitySourceUrlsV0_1({ startDate: date, endDate: date });
  const results = [];

  for (const sourceId of HISTORICAL_SOURCE_IDS) {
    const rule = EMPTY_SIGNATURE_RULES[sourceId];
    const targetSource = targetSources[sourceId];
    const target = await fetchAnalysis({
      sourceId,
      sourceUrl: targetSource.url,
      date,
      fetchImpl,
      timeoutMs,
    });

    let control = null;
    let certification = null;
    if (rule.mode === "CONTROLLED_NO_DATA_STAT") {
      const controlSources = buildOfficialContinuitySourceUrlsV0_1({
        startDate: rule.positiveControlDate,
        endDate: rule.positiveControlDate,
      });
      control = await fetchAnalysis({
        sourceId,
        sourceUrl: controlSources[sourceId].url,
        date: rule.positiveControlDate,
        fetchImpl,
        timeoutMs,
      });
      certification = certifyControlledNoDataStat({
        target,
        positiveControl: control,
        rule,
      });
    } else {
      certification = deepFreeze({
        mode: rule.mode,
        positiveControlDate: null,
        targetSignatureMatched: target.emptySignatureMatched === true,
        positiveControlMatched: null,
        certified: target.emptyRangeSemanticsCertified === true,
      });
    }

    results.push(deepFreeze({
      ...target,
      certification,
      positiveControl: control,
      emptyRangeSemanticsCertified: certification.certified === true,
    }));
  }

  const exactRangeZeroObservedCount = results.filter((x) => x.exactRangeZeroObserved).length;
  const certifiedCount = results.filter((x) => x.emptyRangeSemanticsCertified).length;

  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_CA_EMPTY_RANGE_PROBE_V0_1",
    version: OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION,
    requestedDate: date,
    observedAt: new Date(observedAt).toISOString(),
    sourceCount: results.length,
    exactRangeZeroObservedCount,
    certifiedEmptySourceCount: certifiedCount,
    emptyRangeSemanticsCertified: certifiedCount === HISTORICAL_SOURCE_IDS.length,
    sources: Object.freeze(results),
    noEventMayBeClaimed: false,
    revisionCoverageComplete: false,
    suspensionCoverageComplete: false,
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

export function officialContinuityEmptyRangeRulesV0_1() {
  return EMPTY_SIGNATURE_RULES;
}
