import { sha256Hex } from "./decision_archive.mjs";

export const OFFICIAL_SUSPENSION_SOURCE_DISCOVERY_VERSION = "0.1-RESEARCH";

export const OFFICIAL_SUSPENSION_DISCOVERY_SURFACES_V0_1 = Object.freeze({
  TWSE_CURRENT_OPENAPI: "https://openapi.twse.com.tw/v1/exchangeReport/TWTAWU",
  TWSE_HISTORICAL_PAGE: "https://www.twse.com.tw/zh/trading/historical/twtawu.html",
  TPEX_HISTORICAL_PAGE: "https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html",
});

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

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function summarizeTwseSuspensionOpenApiV0_1(rawText) {
  const body = typeof rawText === "string" ? rawText : String(rawText ?? "");
  const payloadHash = await sha256Hex(body);
  let payload = null;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    return deepFreeze({
      state: "PAYLOAD_PARSE_ERROR",
      payloadHash,
      parseError: String(error?.message || error),
      rowCount: 0,
      keyUnion: [],
      sample: [],
      machineFieldContractReady: false,
      sourceCoverageComplete: false,
      noSuspensionMayBeClaimed: false,
    });
  }

  const rows = Array.isArray(payload)
    ? payload.filter((x) => x && typeof x === "object" && !Array.isArray(x))
    : [];
  const keyUnion = [...new Set(rows.flatMap((x) => Object.keys(x)))].sort();
  const codeKey = keyUnion.find((key) =>
    ["code", "stockno", "stockcode", "證券代號", "股票代號", "公司代號"].includes(key.toLowerCase())
    || /證券代號|股票代號|公司代號/.test(key)
  ) || null;
  const dateLikeKeys = keyUnion.filter((key) => /date|time|日期|時間/i.test(key));
  const suspensionLikeKeys = keyUnion.filter((key) => /suspend|halt|stop|resume|暫停|停止|恢復/i.test(key));

  return deepFreeze({
    state: rows.length ? "JSON_OBJECT_ARRAY_OBSERVED" : "JSON_ARRAY_EMPTY_OR_UNRECOGNIZED",
    payloadHash,
    rowCount: rows.length,
    keyUnion,
    codeKey,
    dateLikeKeys,
    suspensionLikeKeys,
    sample: rows.slice(0, 3),
    machineFieldContractReady:
      rows.length > 0 &&
      codeKey !== null &&
      (dateLikeKeys.length > 0 || suspensionLikeKeys.length > 0),
    sourceCoverageComplete: false,
    noSuspensionMayBeClaimed: false,
  });
}

function absoluteUrl(baseUrl, candidate) {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return null;
  }
}

export function extractScriptUrlsV0_1(html, baseUrl) {
  const body = typeof html === "string" ? html : String(html ?? "");
  const found = [];
  const regex = /<script\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>/gi;
  let match;
  while ((match = regex.exec(body)) !== null) {
    const raw = text(match[1] || match[2] || match[3]);
    if (!raw) continue;
    const absolute = absoluteUrl(baseUrl, raw);
    if (absolute && !found.includes(absolute)) found.push(absolute);
  }
  return Object.freeze(found);
}

export function discoverSuspensionMachineHintsV0_1({
  pageUrl,
  pageHtml = "",
  scriptBodies = [],
} = {}) {
  const texts = [
    { source: "PAGE_HTML", url: pageUrl, body: String(pageHtml ?? "") },
    ...(scriptBodies || []).map((x) => ({
      source: "SCRIPT",
      url: x?.url || null,
      body: String(x?.body ?? ""),
    })),
  ];

  const patterns = [
    /https?:\/\/[^"'\s<>\\]+/gi,
    /\/(?:www\/)?(?:zh-tw|en-us)\/announce\/market\/halt[^"'\s<>\\]*/gi,
    /\/(?:rwd\/(?:zh|en)|api|openapi|web)\/[^"'\s<>\\]*(?:halt|suspend|twtawu)[^"'\s<>\\]*/gi,
    /[^"'\s<>\\]{0,90}(?:TWTAWU|halt|suspend|暫停交易|恢復交易)[^"'\s<>\\]{0,160}/gi,
  ];

  const hits = [];
  for (const item of texts) {
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      let count = 0;
      while ((match = pattern.exec(item.body)) !== null && count < 100) {
        const raw = text(match[0]);
        if (!raw) continue;
        if (!/(TWTAWU|halt|suspend|暫停交易|恢復交易)/i.test(raw)) continue;
        const normalized = raw.startsWith("/") ? absoluteUrl(pageUrl, raw) : raw;
        const key = item.source + "|" + (item.url || "") + "|" + normalized;
        if (!hits.some((x) => x._key === key)) {
          hits.push({
            _key: key,
            source: item.source,
            sourceUrl: item.url,
            hint: normalized,
          });
        }
        count += 1;
      }
    }
  }

  const cleaned = hits.map(({ _key, ...x }) => x);
  return deepFreeze({
    schemaVersion: "S2_OFFICIAL_SUSPENSION_MACHINE_HINTS_V0_1",
    version: OFFICIAL_SUSPENSION_SOURCE_DISCOVERY_VERSION,
    pageUrl,
    hintCount: cleaned.length,
    hints: cleaned,
    exactMachineEndpointFrozen: false,
    sourceCoverageComplete: false,
    noSuspensionMayBeClaimed: false,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    selectionAuthority: false,
    system1RuntimeUsed: false,
  });
}
