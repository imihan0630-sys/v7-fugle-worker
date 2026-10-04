import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "./mops_revision_source_capability_v0_1.mjs";

export const MOPSOV_DIRECT_HISTORY_VERSION = "0.1-RESEARCH";
export const MOPSOV_DIRECT_HISTORY_URL = "https://mopsov.twse.com.tw/mops/web/ajax_t05st01";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function positiveInt(value, field, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(field + " must be an integer from " + min + " to " + max);
  }
  return n;
}

export function buildMopsovDirectHistoryRequestV0_1({
  stockCode,
  rocYear,
  month,
} = {}) {
  const code = requiredText(stockCode, "stockCode");
  if (!/^\d{4,6}$/.test(code)) throw new Error("stockCode must be numeric");
  const year = positiveInt(rocYear, "rocYear", 80, 300);
  const mon = positiveInt(month, "month", 1, 12);

  const form = new URLSearchParams({
    firstin: "1",
    step: "1",
    TYPEK: "all",
    co_id: code,
    year: String(year),
    month: String(mon),
    b_date: "",
    e_date: "",
  });

  return deepFreeze({
    url: MOPSOV_DIRECT_HISTORY_URL,
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
    formBody: form.toString(),
  });
}

function failClosedBase(observedAt) {
  return {
    schemaVersion: "S2_MOPSOV_DIRECT_HISTORY_V0_1",
    version: MOPSOV_DIRECT_HISTORY_VERSION,
    observedAt: new Date(observedAt).toISOString(),
    boundedIntervalCoverageComplete: false,
    actionFamilyCoverageComplete: false,
    cancellationHistoryComplete: false,
    knownAtVersionClockCertified: false,
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
  };
}

export async function probeMopsovDirectHistoryV0_1({
  stockCode,
  rocYear,
  month,
  expectedDate = null,
  baseSubject = null,
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  timeoutMs = 30_000,
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("observedAt must be an ISO timestamp");

  const request = buildMopsovDirectHistoryRequestV0_1({ stockCode, rocYear, month });
  const common = failClosedBase(observedAt);

  let response;
  try {
    response = await fetchImpl(request.url, {
      method: request.method,
      redirect: "follow",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "content-type": request.contentType,
        referer: "https://mopsov.twse.com.tw/mops/web/t05st01",
        "user-agent": "System2-MOPSOV-Direct-History/0.1",
      },
      body: request.formBody,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return deepFreeze({
      ...common,
      state: "DIRECT_HISTORY_TRANSPORT_ERROR",
      error: String(error?.message || error),
      directHistoryCapabilityObserved: false,
    });
  }

  const html = await response.text();
  const payloadHash = await sha256Hex(html);
  let parsed = null;
  let monthly = null;
  try {
    parsed = parseMopsHistoricalMaterialInformationHtmlV0_1({
      html,
      stockCode,
      expectedDate,
      baseSubject,
    });
    monthly = parseMopsHistoricalMaterialInformationHtmlV0_1({
      html,
      stockCode,
      expectedDate: null,
      baseSubject: null,
    });
  } catch (error) {
    return deepFreeze({
      ...common,
      state: "DIRECT_HISTORY_PARSE_ERROR",
      error: String(error?.message || error),
      historyHttpStatus: Number(response.status),
      historyContentType: response.headers?.get?.("content-type") || null,
      historyPayloadHash: payloadHash,
      directHistoryCapabilityObserved: false,
    });
  }

  const readable =
    response.ok &&
    Number(parsed.rowCount) >= 1;

  const revisionHistoryCapabilityObserved =
    response.ok &&
    Number(parsed.matchingSubjectRowCount) >= 2 &&
    Number(parsed.originalRowCount) >= 1 &&
    Number(parsed.correctionOrCancellationRowCount) >= 1 &&
    Number(parsed.distinctVersionKeyCount) >= 2;

  return deepFreeze({
    ...common,
    state: readable ? "MOPSOV_DIRECT_HISTORY_READABLE" : "MOPSOV_DIRECT_HISTORY_NOT_READY",
    control: deepFreeze({
      stockCode: String(stockCode),
      rocYear: Number(rocYear),
      month: Number(month),
      expectedDate,
      baseSubject,
    }),
    historyHttpStatus: Number(response.status),
    historyContentType: response.headers?.get?.("content-type") || null,
    historyPayloadHash: payloadHash,
    parsed,
    monthlyRows: monthly?.rows || Object.freeze([]),
    directHistoryCapabilityObserved: readable,
    revisionHistoryCapabilityObserved,
  });
}
