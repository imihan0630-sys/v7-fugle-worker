import { sha256Hex } from "./decision_archive.mjs";

export const OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION = "0.2-RESEARCH";

const HISTORICAL_SOURCE_IDS = new Set([
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

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  const d = new Date(text + "T00:00:00.000Z");
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== text) {
    throw new Error(field + " must be a valid YYYY-MM-DD");
  }
  return text;
}

function normalizeDateToken(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const compact = String(value).trim().replace(/[年/月日.\-]/g, "");
  if (/^\d{8}$/.test(compact)) {
    const date = compact.slice(0, 4) + "-" + compact.slice(4, 6) + "-" + compact.slice(6, 8);
    try { return isoDate(date, "responseDate"); } catch { return null; }
  }
  if (/^\d{7}$/.test(compact)) {
    const year = Number(compact.slice(0, 3)) + 1911;
    const date = String(year).padStart(4, "0") + "-" + compact.slice(3, 5) + "-" + compact.slice(5, 7);
    try { return isoDate(date, "responseDate"); } catch { return null; }
  }
  return null;
}

function rangeFromPayload(payload) {
  let rawStart = null;
  let rawEnd = null;
  let rawRange = null;
  if (typeof payload?.date === "string") {
    rawRange = payload.date.trim();
    const parts = rawRange.split("~");
    if (parts.length === 2) [rawStart, rawEnd] = parts;
  } else if (payload?.params && typeof payload.params === "object" && !Array.isArray(payload.params)) {
    rawStart = payload.params.startDate ?? null;
    rawEnd = payload.params.endDate ?? null;
  } else {
    rawStart = payload?.strDate ?? payload?.startDate ?? null;
    rawEnd = payload?.endDate ?? null;
  }
  return {
    responseRangeRaw: rawRange ?? (
      rawStart !== null || rawEnd !== null
        ? String(rawStart ?? "") + "~" + String(rawEnd ?? "")
        : null
    ),
    responseRangeStart: normalizeDateToken(rawStart),
    responseRangeEnd: normalizeDateToken(rawEnd),
  };
}

function tableShape(payload) {
  if (Array.isArray(payload?.fields) && Array.isArray(payload?.data)) {
    return {
      parserShape: "JSON_FIELDS_DATA",
      recognizedRowContainer: true,
      fieldCount: payload.fields.length,
      rowCount: payload.data.length,
      tableCount: null,
    };
  }
  const tables = Array.isArray(payload?.tables)
    ? payload.tables.filter((x) => x && typeof x === "object" && !Array.isArray(x))
    : [];
  const recognized = tables.find((x) => Array.isArray(x.fields) && Array.isArray(x.data));
  if (recognized) {
    return {
      parserShape: "JSON_TABLES",
      recognizedRowContainer: true,
      fieldCount: recognized.fields.length,
      rowCount: recognized.data.length,
      tableCount: tables.length,
    };
  }
  return {
    parserShape: "JSON_NO_ROW_CONTAINER",
    recognizedRowContainer: false,
    fieldCount: 0,
    rowCount: null,
    tableCount: tables.length || null,
  };
}

function deepFreeze(value) {
  if (Array.isArray(value)) {
    value.forEach(deepFreeze);
    return Object.freeze(value);
  }
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }
  return value;
}

export async function characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId,
  requestedStartDate,
  requestedEndDate,
  rawText,
  httpStatus = 200,
  contentType = null,
} = {}) {
  const id = requiredText(sourceId, "sourceId");
  if (!HISTORICAL_SOURCE_IDS.has(id)) throw new Error("unsupported historical sourceId: " + id);
  const startDate = isoDate(requestedStartDate, "requestedStartDate");
  const endDate = isoDate(requestedEndDate, "requestedEndDate");
  if (endDate < startDate) throw new Error("requestedEndDate cannot be earlier than requestedStartDate");
  const body = typeof rawText === "string" ? rawText : String(rawText ?? "");
  const payloadHash = await sha256Hex(body);
  const status = Number(httpStatus);
  const httpOk = Number.isInteger(status) && status >= 200 && status < 300;

  let payload = null;
  let parseError = null;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    parseError = String(error?.message || error);
  }

  const range = payload ? rangeFromPayload(payload) : {
    responseRangeRaw: null,
    responseRangeStart: null,
    responseRangeEnd: null,
  };
  const shape = payload ? tableShape(payload) : {
    parserShape: "NON_JSON",
    recognizedRowContainer: false,
    fieldCount: 0,
    rowCount: null,
    tableCount: null,
  };
  const responseRangeVerified =
    range.responseRangeStart === startDate &&
    range.responseRangeEnd === endDate;
  const zeroRows = shape.recognizedRowContainer && shape.rowCount === 0;
  const nonEmpty = shape.recognizedRowContainer && Number(shape.rowCount) > 0;

  let state = "UNVERIFIED_EMPTY_SEMANTICS";
  if (!httpOk) state = "HTTP_ERROR";
  else if (parseError) state = "PAYLOAD_PARSE_ERROR";
  else if (nonEmpty) state = "NON_EMPTY_RANGE";
  else if (zeroRows && responseRangeVerified) state = "EXACT_RANGE_ZERO_ROWS_OBSERVED";
  else if (zeroRows) state = "ZERO_ROWS_RANGE_IDENTITY_MISSING";
  else if (responseRangeVerified) state = "EXACT_RANGE_WITHOUT_ROW_CONTAINER";
  else state = "EMPTY_OR_NO_DATA_RANGE_UNVERIFIED";

  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_CA_EMPTY_RANGE_CHARACTERIZATION_V0_1",
    version: OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION,
    sourceId: id,
    requestedStartDate: startDate,
    requestedEndDate: endDate,
    httpStatus: Number.isFinite(status) ? status : null,
    httpOk,
    contentType: contentType ? String(contentType) : null,
    payloadHash,
    payloadParsed: payload !== null,
    parseError,
    upstreamStatus: typeof payload?.stat === "string" ? payload.stat.trim() : null,
    ...range,
    responseRangeVerified,
    ...shape,
    zeroRows,
    state,

    // Observation of a response shape is not an official completeness proof.
    emptyRangeResponseCandidate:
      state === "EXACT_RANGE_ZERO_ROWS_OBSERVED",
    emptyRangeSemanticsCertified: false,
    sourceCoverageComplete: false,
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


const EMPTY_CERTIFICATION_RULES = deepFreeze({
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: {
    mode: "CONTROLLED_NO_DATA_STATUS",
    expectedStatus: "很抱歉，沒有符合條件的資料!",
    positiveControlDate: "2026-04-08",
  },
  TWSE_CAPITAL_REDUCTION_REFERENCE: {
    mode: "CONTROLLED_NO_DATA_STATUS",
    expectedStatus: "很抱歉，沒有符合條件的資料!",
    positiveControlDate: "2026-06-29",
  },
  TWSE_PAR_VALUE_CHANGE_REFERENCE: {
    mode: "EXACT_RANGE_ZERO_ROWS",
    expectedStatus: "OK",
    parserShape: "JSON_FIELDS_DATA",
  },
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: {
    mode: "EXACT_RANGE_ZERO_ROWS",
    expectedStatus: "ok",
    parserShape: "JSON_TABLES",
  },
  TPEX_CAPITAL_REDUCTION_REFERENCE: {
    mode: "EXACT_RANGE_ZERO_ROWS",
    expectedStatus: "ok",
    parserShape: "JSON_TABLES",
  },
  TPEX_PAR_VALUE_CHANGE_REFERENCE: {
    mode: "EXACT_RANGE_ZERO_ROWS",
    expectedStatus: "ok",
    parserShape: "JSON_TABLES",
  },
});

function pushBlocker(blockers, condition, code) {
  if (!condition) blockers.push(code);
}

export function certifyOfficialContinuityEmptyRangeV0_1({
  observation,
  positiveControl = null,
} = {}) {
  if (!observation || typeof observation !== "object" || Array.isArray(observation)) {
    throw new Error("observation is required");
  }
  const sourceId = requiredText(observation.sourceId, "observation.sourceId");
  const rule = EMPTY_CERTIFICATION_RULES[sourceId];
  if (!rule) throw new Error("unsupported historical sourceId: " + sourceId);

  const blockers = [];
  pushBlocker(blockers, observation.httpOk === true, "HTTP_NOT_OK");
  pushBlocker(blockers, observation.payloadParsed === true, "PAYLOAD_NOT_PARSED");

  let positiveControlRequired = false;
  let positiveControlMatched = null;

  if (rule.mode === "EXACT_RANGE_ZERO_ROWS") {
    pushBlocker(
      blockers,
      observation.state === "EXACT_RANGE_ZERO_ROWS_OBSERVED",
      "NOT_EXACT_RANGE_ZERO_ROWS",
    );
    pushBlocker(blockers, observation.responseRangeVerified === true, "RANGE_IDENTITY_NOT_VERIFIED");
    pushBlocker(blockers, observation.zeroRows === true, "ROW_COUNT_NOT_ZERO");
    pushBlocker(blockers, observation.upstreamStatus === rule.expectedStatus, "UPSTREAM_STATUS_MISMATCH");
    pushBlocker(blockers, observation.parserShape === rule.parserShape, "PARSER_SHAPE_MISMATCH");
  } else {
    positiveControlRequired = true;
    pushBlocker(
      blockers,
      observation.state === "EMPTY_OR_NO_DATA_RANGE_UNVERIFIED",
      "TARGET_NOT_FROZEN_NO_DATA_SHAPE",
    );
    pushBlocker(blockers, observation.responseRangeRaw === null, "TARGET_UNEXPECTED_RANGE_IDENTITY");
    pushBlocker(blockers, observation.recognizedRowContainer === false, "TARGET_UNEXPECTED_ROW_CONTAINER");
    pushBlocker(blockers, observation.parserShape === "JSON_NO_ROW_CONTAINER", "TARGET_PARSER_SHAPE_MISMATCH");
    pushBlocker(blockers, observation.upstreamStatus === rule.expectedStatus, "TARGET_NO_DATA_STATUS_MISMATCH");

    positiveControlMatched = Boolean(
      positiveControl &&
      positiveControl.sourceId === sourceId &&
      positiveControl.requestedStartDate === rule.positiveControlDate &&
      positiveControl.requestedEndDate === rule.positiveControlDate &&
      positiveControl.httpOk === true &&
      positiveControl.payloadParsed === true &&
      positiveControl.state === "NON_EMPTY_RANGE" &&
      positiveControl.responseRangeVerified === true &&
      Number(positiveControl.rowCount) > 0
    );
    pushBlocker(blockers, positiveControlMatched, "POSITIVE_CONTROL_NOT_VERIFIED");
  }

  const certified = blockers.length === 0;
  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_CA_EMPTY_RANGE_CERTIFICATION_V0_1",
    version: OFFICIAL_CONTINUITY_EMPTY_RANGE_VERSION,
    sourceId,
    mode: rule.mode,
    expectedStatus: rule.expectedStatus,
    positiveControlRequired,
    positiveControlDate: rule.positiveControlDate || null,
    positiveControlMatched,
    certificationBlockers: Object.freeze(blockers),
    emptyRangeSemanticsCertified: certified,

    // Source-level empty semantics do not by themselves prove a symbol had no event.
    sourceCoverageComplete: false,
    revisionCoverageComplete: false,
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

export function officialContinuityEmptyRangeCertificationRulesV0_1() {
  return EMPTY_CERTIFICATION_RULES;
}
