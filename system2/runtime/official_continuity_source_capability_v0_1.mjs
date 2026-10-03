import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { parseCsvRowsV0_1 } from "./current_listing_metadata_v0_1.mjs";

export const OFFICIAL_CONTINUITY_SOURCE_CAPABILITY_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function compactDate(value) {
  return isoDate(value, "date").replaceAll("-", "");
}

function rocDate(value) {
  const [year, month, day] = isoDate(value, "date").split("-").map(Number);
  if (year < 1912) throw new Error("date must be Gregorian");
  return String(year - 1911).padStart(3, "0")
    + "/" + String(month).padStart(2, "0")
    + "/" + String(day).padStart(2, "0");
}

export function buildOfficialContinuitySourceUrlsV0_1({ startDate, endDate } = {}) {
  const start = isoDate(startDate, "startDate");
  const end = isoDate(endDate, "endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  return deepFreeze({
    TWSE_EX_RIGHT_DIVIDEND_FORECAST: {
      exchange: "TWSE",
      actionFamilies: Object.freeze(["EX_RIGHT", "EX_DIVIDEND", "RIGHTS_SUBSCRIPTION"]),
      url: "https://openapi.twse.com.tw/v1/exchangeReport/TWT48U_ALL",
      sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
      contractStatus: "RESEARCH_CONTRACT_KNOWN_PHYSICAL_RECHECK_REQUIRED",
    },
    TWSE_CAPITAL_REDUCTION_REFERENCE: {
      exchange: "TWSE",
      actionFamilies: Object.freeze(["CAPITAL_REDUCTION"]),
      url: "https://www.twse.com.tw/rwd/zh/reducation/TWTAUU"
        + "?startDate=" + compactDate(start)
        + "&endDate=" + compactDate(end)
        + "&response=json",
      sourceClass: "HISTORICAL_RANGE_REFERENCE",
      contractStatus: "RESEARCH_CONTRACT_KNOWN_PHYSICAL_RECHECK_REQUIRED",
    },
    TPEX_EX_RIGHT_DIVIDEND_FORECAST: {
      exchange: "TPEX",
      actionFamilies: Object.freeze(["EX_RIGHT", "EX_DIVIDEND", "RIGHTS_SUBSCRIPTION"]),
      url: "https://www.tpex.org.tw/web/stock/exright/preAnnounce/prepost_result.php"
        + "?l=zh-tw&o=data",
      sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
      contractStatus: "CANDIDATE_PENDING_GITHUB_RUNNER_PHYSICAL",
    },
    TPEX_CAPITAL_REDUCTION_REFERENCE: {
      exchange: "TPEX",
      actionFamilies: Object.freeze(["CAPITAL_REDUCTION"]),
      url: "https://www.tpex.org.tw/web/stock/exright/revivt/revivt_result.php"
        + "?l=zh-tw"
        + "&d=" + encodeURIComponent(rocDate(start))
        + "&ed=" + encodeURIComponent(rocDate(end))
        + "&s=0%2Casc%2C0&o=csv",
      sourceClass: "HISTORICAL_RANGE_REFERENCE",
      contractStatus: "CANDIDATE_PENDING_GITHUB_RUNNER_PHYSICAL",
    },
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

function summarizeJson(payload) {
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
        parser: "JSON_OBJECT_ARRAY",
        fieldCount: headers.length,
        fieldSample: headers.slice(0, 16),
        rowCount: rows.length,
        ordinarySymbolCount: symbols.size,
      };
    }
    return {
      parser: "JSON_ARRAY",
      fieldCount: 0,
      fieldSample: [],
      rowCount: rows.length,
      ordinarySymbolCount: 0,
    };
  }
  if (!payload || typeof payload !== "object") throw new Error("JSON payload must be object or array");
  if (Array.isArray(payload.fields) && Array.isArray(payload.data)) {
    const summary = summarizeTableRows(payload.fields, payload.data);
    return { parser: "JSON_FIELDS_DATA", ...summary };
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
        parser: "JSON_DATA_OBJECT_ARRAY",
        fieldCount: headers.length,
        fieldSample: headers.slice(0, 16),
        rowCount: rows.length,
        ordinarySymbolCount: symbols.size,
      };
    }
    return {
      parser: "JSON_DATA_ARRAY",
      fieldCount: 0,
      fieldSample: [],
      rowCount: rows.length,
      ordinarySymbolCount: 0,
    };
  }
  return {
    parser: "JSON_OBJECT",
    fieldCount: Object.keys(payload).length,
    fieldSample: Object.keys(payload).slice(0, 16),
    rowCount: 0,
    ordinarySymbolCount: 0,
  };
}

function summarizeTextPayload(text) {
  const source = String(text ?? "").replace(/^\uFEFF/, "");
  const trimmed = source.trim();
  if (!trimmed) return { state: "EMPTY_PAYLOAD", parser: null, rowCount: 0, ordinarySymbolCount: 0, fieldCount: 0, fieldSample: [] };
  if (/^<!doctype\s+html|^<html\b/i.test(trimmed)) {
    return { state: "UNEXPECTED_HTML", parser: "HTML", rowCount: 0, ordinarySymbolCount: 0, fieldCount: 0, fieldSample: [] };
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return { state: "STRUCTURE_READY", ...summarizeJson(JSON.parse(trimmed)) };
    } catch (error) {
      return {
        state: "STRUCTURE_PARSE_ERROR",
        parser: "JSON",
        rowCount: 0,
        ordinarySymbolCount: 0,
        fieldCount: 0,
        fieldSample: [],
        parseError: String(error?.message || error),
      };
    }
  }
  try {
    const rows = parseCsvRowsV0_1(source);
    if (!rows.length) return { state: "EMPTY_PAYLOAD", parser: "CSV", rowCount: 0, ordinarySymbolCount: 0, fieldCount: 0, fieldSample: [] };
    const headers = rows[0].map((x) => String(x ?? "").trim());
    return { state: "STRUCTURE_READY", parser: "CSV", ...summarizeTableRows(headers, rows.slice(1)) };
  } catch (error) {
    return {
      state: "STRUCTURE_PARSE_ERROR",
      parser: "CSV",
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: [],
      parseError: String(error?.message || error),
    };
  }
}

async function probeOneSource({ sourceId, source, fetchImpl, timeoutMs }) {
  let response;
  try {
    response = await fetchImpl(source.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/json,text/csv,text/plain,*/*",
        "user-agent": "System2-Official-Continuity-Capability/0.1",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return deepFreeze({
      sourceId,
      exchange: source.exchange,
      actionFamilies: source.actionFamilies,
      sourceClass: source.sourceClass,
      contractStatus: source.contractStatus,
      url: source.url,
      state: "TRANSPORT_ERROR",
      httpStatus: null,
      contentType: null,
      payloadHash: null,
      parser: null,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: Object.freeze([]),
      errorCode: error?.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
    });
  }
  const status = Number(response?.status);
  const contentType = String(response?.headers?.get?.("content-type") || "").trim() || null;
  let text = "";
  try {
    text = await response.text();
  } catch (error) {
    return deepFreeze({
      sourceId,
      exchange: source.exchange,
      actionFamilies: source.actionFamilies,
      sourceClass: source.sourceClass,
      contractStatus: source.contractStatus,
      url: source.url,
      state: "BODY_READ_ERROR",
      httpStatus: Number.isFinite(status) ? status : null,
      contentType,
      payloadHash: null,
      parser: null,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: Object.freeze([]),
      errorCode: "BODY_READ_ERROR",
    });
  }
  const payloadHash = await sha256Hex({ rawText: text });
  if (!response?.ok) {
    return deepFreeze({
      sourceId,
      exchange: source.exchange,
      actionFamilies: source.actionFamilies,
      sourceClass: source.sourceClass,
      contractStatus: source.contractStatus,
      url: source.url,
      state: "HTTP_BLOCKED_OR_ERROR",
      httpStatus: Number.isFinite(status) ? status : null,
      contentType,
      payloadHash,
      parser: null,
      rowCount: 0,
      ordinarySymbolCount: 0,
      fieldCount: 0,
      fieldSample: Object.freeze([]),
      errorCode: [401, 403].includes(status) ? "AUTH_OR_EDGE_BLOCKED" : "HTTP_" + String(status),
    });
  }
  const summary = summarizeTextPayload(text);
  return deepFreeze({
    sourceId,
    exchange: source.exchange,
    actionFamilies: source.actionFamilies,
    sourceClass: source.sourceClass,
    contractStatus: source.contractStatus,
    url: source.url,
    httpStatus: Number.isFinite(status) ? status : null,
    contentType,
    payloadHash,
    ...summary,
    fieldSample: Object.freeze(summary.fieldSample || []),
    errorCode: summary.state === "STRUCTURE_READY" ? null : summary.state,
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
    entries.push(await probeOneSource({ sourceId, source, fetchImpl, timeoutMs }));
  }
  const ready = entries.filter((x) => x.state === "STRUCTURE_READY");
  const readyByExchange = {
    TWSE: ready.filter((x) => x.exchange === "TWSE").length,
    TPEX: ready.filter((x) => x.exchange === "TPEX").length,
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
    readyByExchange: deepFreeze(readyByExchange),
    sources: deepFreeze(Object.fromEntries(entries.map((x) => [x.sourceId, x]))),
    prospectiveDiscoveryCandidateObserved: ready.some((x) => x.sourceClass === "CURRENT_PROSPECTIVE_SNAPSHOT"),
    historicalReferenceCandidateObserved: ready.some((x) => x.sourceClass === "HISTORICAL_RANGE_REFERENCE"),
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
