import { sha256Hex } from "./decision_archive.mjs";
import {
  buildCorporateActionSourceCaptureV0_1,
  buildCorporateActionEventVersionV0_1,
} from "./corporate_action_continuity_archive_v0_1.mjs";

export const OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION = "0.1-RESEARCH";

const SOURCE_CONFIG = Object.freeze({
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: Object.freeze({
    exchange: "TWSE",
    actionFamilyId: "EX_RIGHT_DIVIDEND",
    envelope: "TWSE_FIELDS_DATA",
    dateHeaders: Object.freeze(["資料日期"]),
    symbolHeaders: Object.freeze(["股票代號"]),
    nameHeaders: Object.freeze(["股票名稱"]),
    preCloseHeaders: Object.freeze(["除權息前收盤價"]),
    referenceHeaders: Object.freeze(["除權息參考價"]),
    subtypeHeaders: Object.freeze(["權/息"]),
    detailHeaders: Object.freeze(["詳細資料"]),
    eventStage: "ACTUAL_EX_RIGHT_DIVIDEND_REFERENCE",
  }),
  TWSE_CAPITAL_REDUCTION_REFERENCE: Object.freeze({
    exchange: "TWSE",
    actionFamilyId: "CAPITAL_REDUCTION",
    envelope: "TWSE_FIELDS_DATA",
    dateHeaders: Object.freeze(["恢復買賣日期"]),
    symbolHeaders: Object.freeze(["股票代號"]),
    nameHeaders: Object.freeze(["名稱"]),
    preCloseHeaders: Object.freeze(["停止買賣前收盤價格"]),
    referenceHeaders: Object.freeze(["恢復買賣參考價"]),
    subtypeHeaders: Object.freeze(["減資原因"]),
    detailHeaders: Object.freeze(["詳細資料"]),
    eventStage: "ACTUAL_CAPITAL_REDUCTION_RESUME_REFERENCE",
  }),
  TWSE_PAR_VALUE_CHANGE_REFERENCE: Object.freeze({
    exchange: "TWSE",
    actionFamilyId: "PAR_VALUE_CHANGE",
    envelope: "TWSE_FIELDS_DATA",
    dateHeaders: Object.freeze(["恢復買賣日期"]),
    symbolHeaders: Object.freeze(["股票代號"]),
    nameHeaders: Object.freeze(["名稱"]),
    preCloseHeaders: Object.freeze(["停止買賣前收盤價格"]),
    referenceHeaders: Object.freeze(["恢復買賣參考價"]),
    subtypeHeaders: Object.freeze([]),
    detailHeaders: Object.freeze(["詳細資料"]),
    eventStage: "ACTUAL_PAR_VALUE_CHANGE_RESUME_REFERENCE",
  }),
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: Object.freeze({
    exchange: "TPEX",
    actionFamilyId: "EX_RIGHT_DIVIDEND",
    envelope: "TPEX_TABLES",
    dateHeaders: Object.freeze(["除權息日期"]),
    symbolHeaders: Object.freeze(["代號", "股票代號", "證券代號"]),
    nameHeaders: Object.freeze(["名稱", "股票名稱", "證券名稱"]),
    preCloseHeaders: Object.freeze(["除權息前收盤價"]),
    referenceHeaders: Object.freeze(["除權息參考價"]),
    subtypeHeaders: Object.freeze(["權/息"]),
    detailHeaders: Object.freeze(["詳細資料"]),
    eventStage: "ACTUAL_EX_RIGHT_DIVIDEND_REFERENCE",
  }),
  TPEX_CAPITAL_REDUCTION_REFERENCE: Object.freeze({
    exchange: "TPEX",
    actionFamilyId: "CAPITAL_REDUCTION",
    envelope: "TPEX_TABLES",
    dateHeaders: Object.freeze(["恢復買賣日期"]),
    symbolHeaders: Object.freeze(["股票代號", "證券代號", "代號"]),
    nameHeaders: Object.freeze(["名稱", "股票名稱", "證券名稱"]),
    preCloseHeaders: Object.freeze(["最後交易日之收盤價格", "停止買賣前收盤價格"]),
    referenceHeaders: Object.freeze(["減資恢復買賣開始日參考價格", "恢復買賣參考價", "恢復買賣開始參考價"]),
    subtypeHeaders: Object.freeze(["減資原因"]),
    detailHeaders: Object.freeze(["詳細資料"]),
    eventStage: "ACTUAL_CAPITAL_REDUCTION_RESUME_REFERENCE",
  }),
  TPEX_PAR_VALUE_CHANGE_REFERENCE: Object.freeze({
    exchange: "TPEX",
    actionFamilyId: "PAR_VALUE_CHANGE",
    envelope: "TPEX_TABLES",
    dateHeaders: Object.freeze(["恢復買賣日期"]),
    symbolHeaders: Object.freeze(["證券代號", "股票代號", "代號"]),
    nameHeaders: Object.freeze(["證券名稱", "名稱", "股票名稱"]),
    preCloseHeaders: Object.freeze(["最後交易日之收盤價格", "停止買賣前收盤價格"]),
    referenceHeaders: Object.freeze(["恢復買賣開始參考價", "恢復買賣參考價"]),
    subtypeHeaders: Object.freeze([]),
    detailHeaders: Object.freeze(["詳細資料"]),
    eventStage: "ACTUAL_PAR_VALUE_CHANGE_RESUME_REFERENCE",
  }),
});

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

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return new Date(text).toISOString();
}

function normalizeDateToken(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
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
  const date = String(year).padStart(4, "0") + "-" +
    String(month).padStart(2, "0") + "-" +
    String(day).padStart(2, "0");
  try {
    return isoDate(date, "normalizedDate");
  } catch {
    return null;
  }
}

function responseRange(payload) {
  let rawStart = null;
  let rawEnd = null;
  if (typeof payload?.date === "string") {
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
    startDate: normalizeDateToken(rawStart),
    endDate: normalizeDateToken(rawEnd),
    rawStart,
    rawEnd,
  };
}

function findHeader(headers, aliases) {
  const normalized = headers.map((x) => String(x ?? "").trim());
  for (const alias of aliases || []) {
    const index = normalized.findIndex((x) => x === alias);
    if (index >= 0) return index;
  }
  return -1;
}

function extractTable(payload, config) {
  if (config.envelope === "TWSE_FIELDS_DATA") {
    if (!Array.isArray(payload?.fields) || !Array.isArray(payload?.data)) return null;
    return { headers: payload.fields.map(String), rows: payload.data };
  }
  const tables = Array.isArray(payload?.tables) ? payload.tables : [];
  for (const table of tables) {
    if (!Array.isArray(table?.fields) || !Array.isArray(table?.data)) continue;
    const headers = table.fields.map(String);
    if (findHeader(headers, config.symbolHeaders) >= 0) {
      return { headers, rows: table.data };
    }
  }
  return null;
}

function requireHeader(headers, aliases, field) {
  const index = findHeader(headers, aliases);
  if (index < 0) throw new Error("missing required " + field + " header");
  return index;
}

function optionalHeader(headers, aliases) {
  return findHeader(headers, aliases);
}

function ordinarySymbol(value) {
  const text = String(value ?? "").trim();
  return /^[1-9][0-9]{3}$/.test(text) ? text : null;
}

function parseNumber(value) {
  const text = String(value ?? "").trim().replaceAll(",", "");
  if (!text || text === "-" || text === "--" || text === "---" || text === "N/A") return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function textAt(row, index) {
  return index >= 0 ? String(row?.[index] ?? "").trim() || null : null;
}

function freeze(value) {
  if (Array.isArray(value)) {
    value.forEach(freeze);
    return Object.freeze(value);
  }
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }
  return value;
}

export function officialContinuityEventParserSourceConfigV0_1() {
  return SOURCE_CONFIG;
}

export async function parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId,
  sourceUrl,
  rawText,
  fetchedAt,
  requestedStartDate,
  requestedEndDate,
} = {}) {
  const id = requiredText(sourceId, "sourceId");
  const config = SOURCE_CONFIG[id];
  if (!config) throw new Error("unsupported historical continuity sourceId: " + id);
  const url = requiredText(sourceUrl, "sourceUrl");
  const observedAt = isoTimestamp(fetchedAt, "fetchedAt");
  const startDate = isoDate(requestedStartDate, "requestedStartDate");
  const endDate = isoDate(requestedEndDate, "requestedEndDate");
  if (endDate < startDate) throw new Error("requestedEndDate cannot be earlier than requestedStartDate");
  const body = requiredText(rawText, "rawText");
  const payloadHash = await sha256Hex(body);

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    return freeze({
      schemaVersion: "S2_OFFICIAL_CA_PARSE_RESULT_V0_1",
      version: OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION,
      sourceId: id,
      exchange: config.exchange,
      actionFamilyId: config.actionFamilyId,
      state: "PAYLOAD_PARSE_ERROR",
      payloadHash,
      error: String(error?.message || error),
      responseRangeVerified: false,
      parserComplete: false,
      eventCount: 0,
      events: [],
      noEventMayBeClaimed: false,
      technicalContinuityCertified: false,
    });
  }

  const range = responseRange(payload);
  const responseRangeVerified =
    range.startDate === startDate &&
    range.endDate === endDate;
  if (!responseRangeVerified) {
    return freeze({
      schemaVersion: "S2_OFFICIAL_CA_PARSE_RESULT_V0_1",
      version: OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION,
      sourceId: id,
      exchange: config.exchange,
      actionFamilyId: config.actionFamilyId,
      state: "RANGE_UNVERIFIED",
      payloadHash,
      responseRangeStart: range.startDate,
      responseRangeEnd: range.endDate,
      responseRangeVerified: false,
      parserComplete: false,
      eventCount: 0,
      events: [],
      noEventMayBeClaimed: false,
      technicalContinuityCertified: false,
    });
  }

  const table = extractTable(payload, config);
  if (!table) {
    return freeze({
      schemaVersion: "S2_OFFICIAL_CA_PARSE_RESULT_V0_1",
      version: OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION,
      sourceId: id,
      exchange: config.exchange,
      actionFamilyId: config.actionFamilyId,
      state: "STRUCTURE_UNRECOGNIZED",
      payloadHash,
      responseRangeStart: range.startDate,
      responseRangeEnd: range.endDate,
      responseRangeVerified: true,
      parserComplete: false,
      eventCount: 0,
      events: [],
      noEventMayBeClaimed: false,
      technicalContinuityCertified: false,
    });
  }

  const headers = table.headers.map((x) => String(x ?? "").trim());
  let dateIndex;
  let symbolIndex;
  let nameIndex;
  let preCloseIndex;
  let referenceIndex;
  try {
    dateIndex = requireHeader(headers, config.dateHeaders, "date");
    symbolIndex = requireHeader(headers, config.symbolHeaders, "symbol");
    nameIndex = optionalHeader(headers, config.nameHeaders);
    preCloseIndex = requireHeader(headers, config.preCloseHeaders, "pre-close");
    referenceIndex = requireHeader(headers, config.referenceHeaders, "reference-price");
  } catch (error) {
    return freeze({
      schemaVersion: "S2_OFFICIAL_CA_PARSE_RESULT_V0_1",
      version: OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION,
      sourceId: id,
      exchange: config.exchange,
      actionFamilyId: config.actionFamilyId,
      state: "REQUIRED_HEADER_MISSING",
      payloadHash,
      responseRangeStart: range.startDate,
      responseRangeEnd: range.endDate,
      responseRangeVerified: true,
      parserComplete: false,
      fieldNames: headers,
      error: String(error?.message || error),
      eventCount: 0,
      events: [],
      noEventMayBeClaimed: false,
      technicalContinuityCertified: false,
    });
  }
  const subtypeIndex = optionalHeader(headers, config.subtypeHeaders);
  const detailIndex = optionalHeader(headers, config.detailHeaders);

  const capture = await buildCorporateActionSourceCaptureV0_1({
    sourceId: id,
    sourceUrl: url,
    exchange: config.exchange,
    actionFamilyId: config.actionFamilyId,
    sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE",
    fetchedAt: observedAt,
    payloadHash,
    parserVersion: OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION,
    sourceStatus: "STRUCTURE_READY_RANGE_VERIFIED",
    recordCount: table.rows.length,
    requestedStartDate: startDate,
    requestedEndDate: endDate,
    responseRangeVerified: true,
  });

  const events = [];
  const parseFailures = [];
  let ordinaryRowCount = 0;
  let technicalContinuityEligibleEventCount = 0;

  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex += 1) {
    const row = table.rows[rowIndex];
    if (!Array.isArray(row)) continue;
    const symbol = ordinarySymbol(row[symbolIndex]);
    if (!symbol) continue;
    ordinaryRowCount += 1;

    const effectiveDate = normalizeDateToken(row[dateIndex]);
    if (!effectiveDate) {
      parseFailures.push({
        rowIndex,
        symbol,
        reason: "EFFECTIVE_DATE_UNPARSEABLE",
        rawDate: String(row[dateIndex] ?? ""),
      });
      continue;
    }

    const preActionClose = parseNumber(row[preCloseIndex]);
    const officialReferencePrice = parseNumber(row[referenceIndex]);
    const pricePairVerified =
      Number.isFinite(preActionClose) &&
      preActionClose > 0 &&
      Number.isFinite(officialReferencePrice) &&
      officialReferencePrice > 0;
    const sourceRowHash = await sha256Hex({ headers, row });

    const event = await buildCorporateActionEventVersionV0_1({
      sourceCapture: capture,
      symbol,
      actionFamilyId: config.actionFamilyId,
      eventKey: [
        config.exchange,
        symbol,
        config.actionFamilyId,
        effectiveDate,
        id,
      ].join("|"),
      eventStage: config.eventStage,
      effectiveDate,
      outcomeState: "ACTIVE",
      continuityEffect: {
        companyName: textAt(row, nameIndex),
        preActionClose,
        officialReferencePrice,
        referencePriceRatio: pricePairVerified
          ? officialReferencePrice / preActionClose
          : null,
        subtype: textAt(row, subtypeIndex),
        detail: textAt(row, detailIndex),
      },
      continuityEffectState: pricePairVerified ? "VERIFIED" : "UNKNOWN",
      knowledgeTimeMode: "HISTORICAL_UNKNOWN",
      sourceRowHash,
      actualResultVerified: true,
      readinessReasons: pricePairVerified
        ? []
        : ["OFFICIAL_REFERENCE_PRICE_PAIR_INCOMPLETE"],
    });
    if (event.technicalContinuityEvidenceEligible) {
      technicalContinuityEligibleEventCount += 1;
    }
    events.push(event);
  }

  const parserComplete = parseFailures.length === 0;
  const state = !parserComplete
    ? "PARSED_WITH_FAILURES"
    : ordinaryRowCount === 0
      ? "PARSED_NO_ORDINARY_ROWS_UNCERTIFIED"
      : "PARSED";

  return freeze({
    schemaVersion: "S2_OFFICIAL_CA_PARSE_RESULT_V0_1",
    version: OFFICIAL_CONTINUITY_EVENT_PARSER_VERSION,
    sourceId: id,
    exchange: config.exchange,
    actionFamilyId: config.actionFamilyId,
    state,
    sourceCapture: capture,
    payloadHash,
    requestedStartDate: startDate,
    requestedEndDate: endDate,
    responseRangeStart: range.startDate,
    responseRangeEnd: range.endDate,
    responseRangeVerified: true,
    fieldNames: headers,
    rawRowCount: table.rows.length,
    ordinaryRowCount,
    parserComplete,
    parseFailureCount: parseFailures.length,
    parseFailures,
    eventCount: events.length,
    technicalContinuityEligibleEventCount,
    historicalFirstKnownUnknownCount: events.filter((x) => x.firstKnownAt === null).length,
    events,
    revisionCoverageComplete: false,
    emptyRangeSemanticsCertified: false,
    noEventMayBeClaimed: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    continuityTransformPerformed: false,
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
