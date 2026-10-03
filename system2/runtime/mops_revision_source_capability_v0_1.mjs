import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const MOPS_REVISION_SOURCE_CAPABILITY_VERSION = "0.1-RESEARCH";

const GATEWAY_URL = "https://mops.twse.com.tw/mops/api/redirectToOld";
const ALLOWED_REDIRECT_HOSTS = new Set(["mopsov.twse.com.tw", "mops.twse.com.tw"]);

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

function stripHtml(value) {
  return String(value || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function rowField(raw, field) {
  const pattern = new RegExp(field + "\\.value\\s*=\\s*['\"]([^'\"]*)['\"]", "i");
  return raw.match(pattern)?.[1] || null;
}

function rocDateFromText(text) {
  const m = String(text || "").match(/(\d{3})\/(\d{2})\/(\d{2})/);
  if (!m) return null;
  const year = Number(m[1]) + 1911;
  const month = Number(m[2]);
  const day = Number(m[3]);
  const iso = String(year).padStart(4, "0") + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  const d = new Date(iso + "T00:00:00.000Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === iso ? iso : null;
}

function displayTime(value) {
  const raw = String(value || "").replace(/\D/g, "");
  if (raw.length !== 6) return null;
  return raw.slice(0,2) + ":" + raw.slice(2,4) + ":" + raw.slice(4,6);
}

export function buildMopsHistoricalMaterialInformationRequestV0_1({
  stockCode,
  rocYear,
  month,
} = {}) {
  const code = requiredText(stockCode, "stockCode");
  if (!/^\d{4,6}$/.test(code)) throw new Error("stockCode must be numeric");
  const year = positiveInt(rocYear, "rocYear", 80, 300);
  const mon = positiveInt(month, "month", 1, 12);

  return deepFreeze({
    gatewayUrl: GATEWAY_URL,
    body: deepFreeze({
      apiName: "ajax_t05st01",
      parameters: deepFreeze({
        encodeURIComponent: "1",
        step: "1",
        firstin: "true",
        off: "1",
        keyword4: "",
        code1: "",
        TYPEK2: "",
        checkbtn: "",
        queryName: "co_id",
        inpuType: "co_id",
        TYPEK: "all",
        isnew: "false",
        co_id: code,
        year: String(year),
        month: String(mon),
        b_date: "",
        e_date: "",
        type: "",
      }),
    }),
  });
}

export function parseMopsHistoricalMaterialInformationHtmlV0_1({
  html,
  stockCode,
  expectedDate = null,
  baseSubject = null,
} = {}) {
  const source = requiredText(html, "html");
  const code = requiredText(stockCode, "stockCode");
  const rows = [...source.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1]);
  const parsed = [];

  for (const raw of rows) {
    const text = stripHtml(raw);
    if (!text.includes(code)) continue;
    const date = rocDateFromText(text);
    const seqNo = rowField(raw, "seq_no");
    const spokeTimeRaw = rowField(raw, "spoke_time");
    const spokeDateRaw = rowField(raw, "spoke_date");
    const typek = rowField(raw, "TYPEK");
    const time = displayTime(spokeTimeRaw) || text.match(/\b(\d{2}:\d{2}:\d{2})\b/)?.[1] || null;
    const correction = /更正|修正|取消|撤銷/.test(text);
    parsed.push(deepFreeze({
      stockCode: code,
      date,
      time,
      seqNo,
      spokeTimeRaw,
      spokeDateRaw,
      typek,
      correctionOrCancellationHint: correction,
      rowText: text.slice(0, 1200),
    }));
  }

  const dateRows = expectedDate ? parsed.filter((x) => x.date === expectedDate) : parsed;
  const subjectRows = baseSubject
    ? dateRows.filter((x) => x.rowText.includes(baseSubject))
    : dateRows;
  const correctionRows = subjectRows.filter((x) => x.correctionOrCancellationHint);
  const originalRows = subjectRows.filter((x) => !x.correctionOrCancellationHint);
  const distinctVersionKeys = new Set(subjectRows.map((x) => [
    x.date || "",
    x.time || "",
    x.seqNo || "",
  ].join("|")));

  return deepFreeze({
    rowCount: parsed.length,
    expectedDateRowCount: dateRows.length,
    matchingSubjectRowCount: subjectRows.length,
    correctionOrCancellationRowCount: correctionRows.length,
    originalRowCount: originalRows.length,
    distinctVersionKeyCount: distinctVersionKeys.size,
    rows: Object.freeze(subjectRows),
  });
}

function safeRedirectUrl(value) {
  let url;
  try {
    url = new URL(requiredText(value, "gateway result url"));
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !ALLOWED_REDIRECT_HOSTS.has(url.hostname)) return null;
  return url.toString();
}

export async function probeMopsRevisionSourceCapabilityV0_1({
  stockCode = "2467",
  rocYear = 115,
  month = 5,
  expectedDate = "2026-05-22",
  baseSubject = "公告本公司除息基準日等相關事宜",
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  timeoutMs = 30_000,
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("observedAt must be an ISO timestamp");

  const request = buildMopsHistoricalMaterialInformationRequestV0_1({ stockCode, rocYear, month });

  let gatewayResponse;
  try {
    gatewayResponse = await fetchImpl(request.gatewayUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        accept: "application/json,text/plain,*/*",
        "content-type": "application/json",
        origin: "https://mops.twse.com.tw",
        referer: "https://mops.twse.com.tw/mops/",
        "user-agent": "System2-MOPS-Revision-Capability/0.1",
      },
      body: JSON.stringify(request.body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return deepFreeze({
      version: MOPS_REVISION_SOURCE_CAPABILITY_VERSION,
      state: "GATEWAY_TRANSPORT_ERROR",
      observedAt: new Date(observedAt).toISOString(),
      error: String(error?.message || error),
      revisionHistoryCapabilityObserved: false,
      revisionCoverageComplete: false,
      noEventMayBeClaimed: false,
      selectionAuthority: false,
      system1RuntimeUsed: false,
    });
  }

  const gatewayText = await gatewayResponse.text();
  const gatewayPayloadHash = await sha256Hex(gatewayText);
  let gatewayPayload = null;
  try { gatewayPayload = JSON.parse(gatewayText); } catch {}
  const redirectUrl = safeRedirectUrl(gatewayPayload?.result?.url);

  if (!gatewayResponse.ok || gatewayPayload?.code !== 200 || !redirectUrl) {
    return deepFreeze({
      version: MOPS_REVISION_SOURCE_CAPABILITY_VERSION,
      state: "GATEWAY_NOT_READY",
      observedAt: new Date(observedAt).toISOString(),
      gatewayHttpStatus: Number(gatewayResponse.status),
      gatewayCode: gatewayPayload?.code ?? null,
      gatewayPayloadHash,
      redirectUrlAccepted: false,
      revisionHistoryCapabilityObserved: false,
      revisionCoverageComplete: false,
      noEventMayBeClaimed: false,
      selectionAuthority: false,
      system1RuntimeUsed: false,
    });
  }

  let htmlResponse;
  try {
    htmlResponse = await fetchImpl(redirectUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "text/html,application/xhtml+xml",
        referer: "https://mops.twse.com.tw/mops/",
        "user-agent": "System2-MOPS-Revision-Capability/0.1",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return deepFreeze({
      version: MOPS_REVISION_SOURCE_CAPABILITY_VERSION,
      state: "HISTORY_TRANSPORT_ERROR",
      observedAt: new Date(observedAt).toISOString(),
      gatewayHttpStatus: Number(gatewayResponse.status),
      gatewayCode: gatewayPayload?.code ?? null,
      gatewayPayloadHash,
      redirectUrlAccepted: true,
      error: String(error?.message || error),
      revisionHistoryCapabilityObserved: false,
      revisionCoverageComplete: false,
      noEventMayBeClaimed: false,
      selectionAuthority: false,
      system1RuntimeUsed: false,
    });
  }

  const html = await htmlResponse.text();
  const htmlHash = await sha256Hex(html);
  const parsed = parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,
    stockCode,
    expectedDate,
    baseSubject,
  });

  const revisionHistoryCapabilityObserved =
    htmlResponse.ok &&
    parsed.matchingSubjectRowCount >= 2 &&
    parsed.originalRowCount >= 1 &&
    parsed.correctionOrCancellationRowCount >= 1 &&
    parsed.distinctVersionKeyCount >= 2;

  return deepFreeze({
    schemaVersion: "S2_MOPS_REVISION_SOURCE_CAPABILITY_V0_1",
    version: MOPS_REVISION_SOURCE_CAPABILITY_VERSION,
    state: revisionHistoryCapabilityObserved
      ? "MOPS_ORIGINAL_AND_CORRECTION_OBSERVED"
      : htmlResponse.ok
        ? "MOPS_HISTORY_READABLE_CONTROL_NOT_PROVEN"
        : "MOPS_HISTORY_HTTP_ERROR",
    observedAt: new Date(observedAt).toISOString(),
    control: deepFreeze({
      stockCode,
      rocYear,
      month,
      expectedDate,
      baseSubject,
    }),
    gatewayHttpStatus: Number(gatewayResponse.status),
    gatewayCode: gatewayPayload?.code ?? null,
    gatewayPayloadHash,
    redirectUrlAccepted: true,
    historyHttpStatus: Number(htmlResponse.status),
    historyContentType: htmlResponse.headers?.get?.("content-type") || null,
    historyPayloadHash: htmlHash,
    parsed,
    revisionHistoryCapabilityObserved,

    // One positive control does not prove full-market/full-interval coverage.
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
  });
}
