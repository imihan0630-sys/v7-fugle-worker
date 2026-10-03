import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { parseCsvRowsV0_1 } from "./current_listing_metadata_v0_1.mjs";

export const OFFICIAL_CONTINUITY_SOURCE_CAPABILITY_VERSION = "0.2-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  const parsed = new Date(text + "T00:00:00.000Z");
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
    throw new Error(field + " must be a valid YYYY-MM-DD");
  }
  return text;
}

function compactDate(value) {
  return isoDate(value, "date").replaceAll("-", "");
}

function slashDate(value) {
  return isoDate(value, "date").replaceAll("-", "/");
}

function historicalSource({ exchange, actionFamilies, url, contractStatus }) {
  return {
    exchange,
    actionFamilies: Object.freeze(actionFamilies),
    url,
    sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE",
    contractStatus,
    requiresRangeIdentity: true,
  };
}

export function buildOfficialContinuitySourceUrlsV0_1({ startDate, endDate } = {}) {
  const start = isoDate(startDate, "startDate");
  const end = isoDate(endDate, "endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  const twseQuery = "?startDate=" + compactDate(start) + "&endDate=" + compactDate(end) + "&response=json";
  const tpexQuery = "?startDate=" + encodeURIComponent(slashDate(start))
    + "&endDate=" + encodeURIComponent(slashDate(end))
    + "&response=json";
  return deepFreeze({
    TWSE_EX_RIGHT_DIVIDEND_FORECAST: {
      exchange: "TWSE",
      actionFamilies: Object.freeze(["EX_RIGHT", "EX_DIVIDEND", "RIGHTS_SUBSCRIPTION"]),
      url: "https://openapi.twse.com.tw/v1/exchangeReport/TWT48U_ALL",
      sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
      contractStatus: "PHYSICALLY_OBSERVED_2026_10_03",
      requiresRangeIdentity: false,
    },
    TWSE_EX_RIGHT_DIVIDEND_ACTUAL: historicalSource({
      exchange: "TWSE",
      actionFamilies: ["EX_RIGHT", "EX_DIVIDEND", "RIGHTS_SUBSCRIPTION"],
      url: "https://www.twse.com.tw/rwd/zh/exRight/TWT49U" + twseQuery,
      contractStatus: "RESEARCH_CONTRACT_PENDING_SYSTEM2_PHYSICAL",
    }),
    TWSE_CAPITAL_REDUCTION_REFERENCE: historicalSource({
      exchange: "TWSE",
      actionFamilies: ["CAPITAL_REDUCTION"],
      url: "https://www.twse.com.tw/rwd/zh/reducation/TWTAUU" + twseQuery,
      contractStatus: "PHYSICALLY_OBSERVED_2026_10_03",
    }),
    TWSE_PAR_VALUE_CHANGE_REFERENCE: historicalSource({
      exchange: "TWSE",
      actionFamilies: ["PAR_VALUE_CHANGE"],
      url: "https://www.twse.com.tw/rwd/zh/change/TWTB8U" + twseQuery,
      contractStatus: "RESEARCH_CONTRACT_PENDING_SYSTEM2_PHYSICAL",
    }),
    TPEX_EX_RIGHT_DIVIDEND_FORECAST: {
      exchange: "TPEX",
      actionFamilies: Object.freeze(["EX_RIGHT", "EX_DIVIDEND", "RIGHTS_SUBSCRIPTION"]),
      url: "https://www.tpex.org.tw/web/stock/exright/preAnnounce/prepost_result.php?l=zh-tw&o=data",
      sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
      contractStatus: "PHYSICALLY_OBSERVED_2026_10_03",
      requiresRangeIdentity: false,
    },
    TPEX_EX_RIGHT_DIVIDEND_ACTUAL: historicalSource({
      exchange: "TPEX",
      actionFamilies: ["EX_RIGHT", "EX_DIVIDEND", "RIGHTS_SUBSCRIPTION"],
      url: "https://www.tpex.org.tw/www/zh-tw/bulletin/exDailyQ" + tpexQuery,
      contractStatus: "MODERN_RANGE_CANDIDATE_PENDING_SYSTEM2_PHYSICAL",
    }),
    TPEX_CAPITAL_REDUCTION_REFERENCE: historicalSource({
      exchange: "TPEX",
      actionFamilies: ["CAPITAL_REDUCTION"],
      url: "https://www.tpex.org.tw/www/zh-tw/bulletin/revivt" + tpexQuery,
      contractStatus: "MODERN_RANGE_CANDIDATE_PENDING_SYSTEM2_PHYSICAL",
    }),
    TPEX_PAR_VALUE_CHANGE_REFERENCE: historicalSource({
      exchange: "TPEX",
      actionFamilies: ["PAR_VALUE_CHANGE"],
      url: "https://www.tpex.org.tw/www/zh-tw/bulletin/pvChgRslt" + tpexQuery,
      contractStatus: "MODERN_RANGE_CANDIDATE_PENDING_SYSTEM2_PHYSICAL",
    }),
  });
}

function headerSymbolIndex(headers) {
  const normalized = headers.map((x) => String(x ?? "").trim().toLowerCase());
  return normalized.findIndex((name) =>
    name === "code"
    || name === "symbol"
    || name.includes("股票代號")
    || name.includes("證券代號")
    || name.includes("公司代號")
    || name === "代號");
}

function ordinarySymbol(value) {
  const text = String(value ?? "").trim();
  return /^[1-9][0-9]{3}$/.test(text) ? text : null;
}

function summarizeTableRows(headers, rows) {
  const index = headerSymbolIndex(headers);
  const symbols = new Set();
  if (index >= 0) {
    for (const row of rows) {
      const symbol = ordinarySymbol(row?.[index]);
      if (symbol) symbols.add(symbol);
    }
  }
  return {
    fieldCount: headers.length,
    fieldSample: headers.slice(0, 16),
    rowCount: rows.length,
    ordinarySymbolCount: symbols.size,
  };
}

function normalizeRangeDateToken(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const compact = String(value).trim().replace(/[年/月日.\-]/g, "");
  if (/^\d{8}$/.test(compact)) {
    const date = compact.slice(0, 4) + "-" + compact.slice(4, 6) + "-" + compact.slice(6, 8);
    try {
      return isoDate(date, "responseRangeDate");
    } catch {
      return null;
    }
  }
  if (/^\d{7}$/.test(compact)) {
    const year = Number(compact.slice(0, 3)) + 1911;
    const date = String(year).padStart(4, "0") + "-" + compact.slice(3, 5) + "-" + compact.slice(5, 7);
    try {
      return isoDate(date, "responseRangeDate");
    } catch {
      return null;
    }
  }
  return null;
}

function responseRangeSummary(payload, startDate, endDate) {
  let rawStart = null;
  let rawEnd = null;
  let rawRange = null;
  if (typeof payload?.date === "string") {
    rawRange = payload.date.trim();
    const parts = rawRange.split("~");
    if (parts.length === 2) {
      rawStart = parts[0];
      rawEnd = parts[1];
    }
  } else if (payload?.params && typeof payload.params === "object" && !Array.isArray(payload.params)) {
    rawStart = payload.params.startDate ?? null;
    rawEnd = payload.params.endDate ?? null;
  } else {
    rawStart = payload?.strDate ?? payload?.startDate ?? null;
    rawEnd = payload?.endDate ?? null;
  }
  const normalizedStart = normalizeRangeDateToken(rawStart);
  const normalizedEnd = normalizeRangeDateToken(rawEnd);
  return {
    responseRangeRaw: rawRange ?? (rawStart !== null || rawEnd !== null ? String(rawStart ?? "") + "~" + String(rawEnd ?? "") : null),
    responseRangeStart: normalizedStart,
    responseRangeEnd: normalizedEnd,
    responseRangeVerified: normalizedStart === startDate && normalizedEnd === endDate,
  };
}

function summarizeJsonTableObject(payload) {
  const candidates = Array.isArray(payload.tables)
    ? payload.tables.filter((table) => table && typeof table === "object" && !Array.isArray(table))
    : [];
  const recognized = candidates.find((table) =>
    Array.isArray(table.fields)
    && Array.isArray(table.data)
    && headerSymbolIndex(table.fields) >= 0);
  if (!recognized) {
    return {
      parser: "JSON_TABLES_UNRECOGNIZED",
      recognizedStructure: false,
      fieldCount: 0,
      fieldSample: [],
      rowCount: 0,
      ordinarySymbolCount: 0,
      tableCount: candidates.length,
    };
  }
  return {
    parser: "JSON_TABLES",
    recognizedStructure: true,
    tableCount: candidates.length,
    ...summarizeTableRows(recognized.fields, recognized.data),
  };
}

function summarizeJson(payload, startDate, endDate) {
  const base = {
    upstreamStatus: payload && typeof payload === "object" && !Array.isArray(payload) && typeof payload.stat === "string"
      ? payload.stat.trim()
      : null,
    ...(
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? responseRangeSummary(payload, startDate, endDate)
        : {
            responseRangeRaw: null,
            responseRangeStart: null,
            responseRangeEnd: null,
            responseRangeVerified: false,
          }
    ),
  };
  if (Array.isArray(payload)) {
    const rows = payload;
    const headers = rows.length && rows[0] && typeof rows[0] === "object" && !Array.isArray(rows[0])
      ? Object.keys(rows[0])
      : [];
    if (headers.length) {
      const idx = headerSymbolIndex(headers);
      const symbols = new Set();
      if (idx >= 0) {
        const key = headers[idx];
        for (const row of rows) {
          const symbol = ordinarySymbol(row?.[key]);
          if (symbol) symbols.add(symbol);
        }
      }
      return {
        ...base,
        parser: "JSON_OBJECT_ARRAY",
        recognizedStructure: true,
        fieldCount: headers.length,
        fieldSample: headers.slice(0, 16),
        rowCount: rows.length,
        ordinarySymbolCount: symbols.size,
      };
    }
    return {
      ...base,
      parser: "JSON_ARRAY",
      recognizedStructure: true,
      fieldCount: 0,
      fieldSample: [],
      rowCount: rows.length,
      ordinarySymbolCount: 0,
    };
  }
  if (!payload || typeof payload !== "object") throw new Error("JSON payload must be object or array");
  if (Array.isArray(payload.tables)) return { ...base, ...summarizeJsonTableObject(payload) };
  if (Array.isArray(payload.fields) && Array.isArray(payload.data)) {
    return {
      ...base,
      parser: "JSON_FIELDS_DATA",
      recognizedStructure: true,
      ...summarizeTableRows(payload.fields, payload.data),
    };
  }
  if (Array.isArray(payload.data)) {
    const rows = payload.data;
    const headers = rows.length && rows[0] && typeof rows[0] === "object" && !Array.isArray(rows[0])
      ? Object.keys(rows[0])
      : [];
    if (headers.length) {
      const idx = headerSymbolIndex(headers);
      const symbols = new Set();
      if (idx >= 0) {
        const key = headers[idx];
        for (const row of rows) {
          const symbol = ordinarySymbol(row?.[key]);
          if (symbol) symbols.add(symbol);
        }
      }
      return {
        ...base,
        parser: "JSON_DATA_OBJECT_ARRAY",
        recognizedStructure: true,
        fieldCount: headers.length,
        fieldSample: headers.slice(0, 16),
        rowCount: rows.length,
        ordinarySymbolCount: symbols.size,
      };
    }
    return {
      ...base,
      parser: "JSON_DATA_ARRAY",
      recognizedStructure: true,
      fieldCount: 0,
      fieldSample: [],
      rowCount: rows.length,
      ordinarySymbolCount: 0,
    };
  }
  return {
    ...base,
    parser: "JSON_OBJECT_UNRECOGNIZED",
    recognizedStructure: false,
    fieldCount: Object.keys(payload).length,
    fieldSample: Object.keys(payload).slice(0, 16),
    rowCount: 0,
    ordinarySymbolCount: 0,
  };
}

function embeddedCsvFromHtmlEnvelope(source) {
  const lines = String(source ?? "").replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((line) =>
    line.includes(",") && /(股票代號|證券代號|公司代號)/.test(line));
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed && /^<\/?[a-z!]/i.test(trimmed)) {
      end = i;
      break;
    }
  }
  const candidate = lines.slice(start, end).join("\n").trim();
  return candidate || null;
}

function summarizeTextPayload(text, startDate, endDate) {
  const source = String(text ?? "").replace(/^\uFEFF/, "");
  const trimmed = source.trim();
  if (!trimmed) return { state: "EMPTY_PAYLOAD", parser: null, recognizedStructure: false, rowCount: 0, ordinarySymbolCount: 0, fieldCount: 0, fieldSample: [], responseRangeVerified: false };
  if (/^<!doctype\s+html|^<html\b/i.test(trimmed)) {
    const embeddedCsv = embeddedCsvFromHtmlEnvelope(source);
    if (embeddedCsv) {
      try {
        const rows = parseCsvRowsV0_1(embeddedCsv);
        if (rows.length) {
          const headers = rows[0].map((x) => String(x ?? "").trim());
          return { state: "STRUCTURE_READY", parser: "CSV_EMBEDDED_HTML", recognizedStructure: true, ...summarizeTableRows(headers, rows.slice(1)), responseRangeVerified: false };
        }
      } catch {
        // Preserve fail-closed capability semantics below.
      }
    }
    return { state: "UNEXPECTED_HTML", parser: "HTML", recognizedStructure: false, rowCount: 0, ordinarySymbolCount: 0, fieldCount: 0, fieldSample: [], responseRangeVerified: false };
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const summary = summarizeJson(JSON.parse(trimmed), startDate, endDate);
      return {
        state: summary.recognizedStructure ? "STRUCTURE_READY" : "STRUCTURE_UNRECOGNIZED",
        ...summary,
      };
    } catch (error) {
      return {
        state: "STRUCTURE_PARSE_ERROR",
        parser: "JSON",
        recognizedStructure: false,
        rowCount: 0,
        ordinarySymbolCount: 0,
        fieldCount: 0,
        fieldSample: [],
        responseRangeVerified: false,
        parseError: String(error?.message || error),
      };
    }
  }
  try {
    const rows = parseCsvRowsV0_1(source);
    if (!rows.length) return { state: "EMPTY_PAYLOAD", parser: "CSV", recognizedStructure: false, rowCount: 0, ordinarySymbolCount: 0, fieldCount: 0, fieldSample: [], responseRangeVerified: false };
    const headers = rows[0].map((x) => String(x ?? "").trim());
    return { state: "STRUCTURE_READY", parser: "CSV", recognizedStructure: true, ...summarizeTableRows(headers, rows.slice(1)), responseRangeVerified: false };
  } catch (error) {
    return {
      state: "STRUCTURE_PARSE_ERROR",
      parser: "CSV",
      recognizedStructure: false,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: [],
      responseRangeVerified: false,
      parseError: String(error?.message || error),
    };
  }
}

function baseFailureEntry(sourceId, source, extra) {
  return deepFreeze({
    sourceId,
    exchange: source.exchange,
    actionFamilies: source.actionFamilies,
    sourceClass: source.sourceClass,
    contractStatus: source.contractStatus,
    requiresRangeIdentity: source.requiresRangeIdentity === true,
    url: source.url,
    ...extra,
  });
}

async function probeOneSource({ sourceId, source, fetchImpl, timeoutMs, startDate, endDate }) {
  let response;
  try {
    response = await fetchImpl(source.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/json,text/csv,text/plain,*/*",
        "user-agent": "System2-Official-Continuity-Capability/0.2",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return baseFailureEntry(sourceId, source, {
      state: "TRANSPORT_ERROR",
      httpStatus: null,
      contentType: null,
      payloadHash: null,
      parser: null,
      recognizedStructure: false,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: Object.freeze([]),
      responseRangeVerified: false,
      errorCode: error?.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
    });
  }
  const status = Number(response?.status);
  const contentType = String(response?.headers?.get?.("content-type") || "").trim() || null;
  let text = "";
  try {
    text = await response.text();
  } catch {
    return baseFailureEntry(sourceId, source, {
      state: "BODY_READ_ERROR",
      httpStatus: Number.isFinite(status) ? status : null,
      contentType,
      payloadHash: null,
      parser: null,
      recognizedStructure: false,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: Object.freeze([]),
      responseRangeVerified: false,
      errorCode: "BODY_READ_ERROR",
    });
  }
  const payloadHash = await sha256Hex({ rawText: text });
  if (!response?.ok) {
    return baseFailureEntry(sourceId, source, {
      state: "HTTP_BLOCKED_OR_ERROR",
      httpStatus: Number.isFinite(status) ? status : null,
      contentType,
      payloadHash,
      parser: null,
      recognizedStructure: false,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: Object.freeze([]),
      responseRangeVerified: false,
      errorCode: [401, 403].includes(status) ? "AUTH_OR_EDGE_BLOCKED" : "HTTP_" + String(status),
    });
  }
  const summary = summarizeTextPayload(text, startDate, endDate);
  let state = summary.state;
  let errorCode = summary.state === "STRUCTURE_READY" ? null : summary.state;
  if (state === "STRUCTURE_READY" && source.requiresRangeIdentity === true && summary.responseRangeVerified !== true) {
    state = "STRUCTURE_RANGE_UNVERIFIED";
    errorCode = "RESPONSE_RANGE_NOT_VERIFIED";
  }
  return baseFailureEntry(sourceId, source, {
    httpStatus: Number.isFinite(status) ? status : null,
    contentType,
    payloadHash,
    ...summary,
    state,
    fieldSample: Object.freeze(summary.fieldSample || []),
    errorCode,
  });
}

export async function probeOfficialContinuitySourceCapabilityV0_1({
  startDate,
  endDate,
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  timeoutMs = 30_000,
} = {}) {
  const start = isoDate(startDate, "startDate");
  const end = isoDate(endDate, "endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("observedAt must be ISO");
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error("timeoutMs must be 1000..120000");
  }

  const sources = buildOfficialContinuitySourceUrlsV0_1({ startDate: start, endDate: end });
  const entries = [];
  for (const [sourceId, source] of Object.entries(sources)) {
    entries.push(await probeOneSource({
      sourceId,
      source,
      fetchImpl,
      timeoutMs,
      startDate: start,
      endDate: end,
    }));
  }
  const ready = entries.filter((x) => x.state === "STRUCTURE_READY");
  const rangeReady = ready.filter((x) => x.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE" && x.responseRangeVerified === true);
  const readyByExchange = {
    TWSE: ready.filter((x) => x.exchange === "TWSE").length,
    TPEX: ready.filter((x) => x.exchange === "TPEX").length,
  };
  const historicalRangeReadyByExchange = {
    TWSE: rangeReady.filter((x) => x.exchange === "TWSE").length,
    TPEX: rangeReady.filter((x) => x.exchange === "TPEX").length,
  };
  const state = ready.length === entries.length
    ? "OFFICIAL_SOURCE_CANDIDATES_OBSERVED"
    : ready.length
      ? "OFFICIAL_SOURCE_CANDIDATES_PARTIAL"
      : "OFFICIAL_SOURCE_CANDIDATES_UNAVAILABLE";

  return deepFreeze({
    schemaVersion: "SYSTEM2_OFFICIAL_CONTINUITY_SOURCE_CAPABILITY_V0_1",
    version: OFFICIAL_CONTINUITY_SOURCE_CAPABILITY_VERSION,
    state,
    startDate: start,
    endDate: end,
    observedAt,
    sourceCount: entries.length,
    structureReadyCount: ready.length,
    historicalRangeSourceCount: entries.filter((x) => x.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE").length,
    historicalRangeReadyCount: rangeReady.length,
    readyByExchange: deepFreeze(readyByExchange),
    historicalRangeReadyByExchange: deepFreeze(historicalRangeReadyByExchange),
    sources: deepFreeze(Object.fromEntries(entries.map((x) => [x.sourceId, x]))),
    prospectiveDiscoveryCandidateObserved: ready.some((x) => x.sourceClass === "CURRENT_PROSPECTIVE_SNAPSHOT"),
    historicalActualRangeCandidateObserved: rangeReady.length > 0,
    legacyTpexCapitalReductionTransportRetired: true,
    legacyTpexCapitalReductionRetirementReason: "PHYSICAL_HTTP_200_HTML_THEN_HTTP_520_UNSTABLE",
    sourceCoverageComplete: false,
    noEventMayBeClaimed: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    continuityTransformPerformed: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    zeroPickClaimed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
