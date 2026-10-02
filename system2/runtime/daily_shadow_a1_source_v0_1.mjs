import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  A1_SYMBOL_SNAPSHOT_SOURCES,
  buildA1SymbolSnapshotBatch,
} from "./a1_symbol_snapshot_adapter.mjs";

export const DAILY_SHADOW_A1_SOURCE_VERSION = "0.1-RESEARCH";
const DEFAULT_TIMEOUT_MS = 30_000;
const USER_AGENT = "System2-Daily-Shadow-A1-Readonly/0.1";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoDate(value) {
  const text = requiredText(value, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("marketDate must be YYYY-MM-DD");
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

async function fetchJson(url, fetchImpl, timeoutMs) {
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      headers: { accept: "application/json", "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const httpStatus = Number(response.status);
    if (!response.ok) {
      return deepFreeze({
        ok: false,
        httpStatus,
        payload: null,
        errorCode: `HTTP_${httpStatus}`,
      });
    }
    try {
      return deepFreeze({
        ok: true,
        httpStatus,
        payload: await response.json(),
        errorCode: null,
      });
    } catch {
      return deepFreeze({
        ok: false,
        httpStatus,
        payload: null,
        errorCode: "NON_JSON_RESPONSE",
      });
    }
  } catch (error) {
    return deepFreeze({
      ok: false,
      httpStatus: null,
      payload: null,
      errorCode: error?.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
    });
  }
}

export async function fetchDailyShadowA1SnapshotV0_1({
  marketDate,
  decisionTimestamp = null,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  minimumByMarket = undefined,
} = {}) {
  const date = isoDate(marketDate);
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60_000) {
    throw new Error("timeoutMs must be an integer from 1000 to 60000");
  }

  const [twse, tpex] = await Promise.all([
    fetchJson(A1_SYMBOL_SNAPSHOT_SOURCES.TWSE.sourceUrl, fetchImpl, timeoutMs),
    fetchJson(A1_SYMBOL_SNAPSHOT_SOURCES.TPEX.sourceUrl, fetchImpl, timeoutMs),
  ]);
  const observedAt = now().toISOString();
  const fixedClock = decisionTimestamp
    ? isoTimestamp(decisionTimestamp, "decisionTimestamp")
    : observedAt;
  const decisionClockMode = decisionTimestamp
    ? "FIXED_CALLER_CLOCK"
    : "DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK";

  const audit = async (result) => ({
    payloadHash: result.ok ? await sha256Hex(result.payload) : null,
    rawRowCount: Array.isArray(result.payload) ? result.payload.length : null,
    reportedDates: Array.isArray(result.payload)
      ? [...new Set(result.payload.map(row => String(row?.Date || "UNDATED")))].sort()
      : [],
  });
  const [twseAudit, tpexAudit] = await Promise.all([audit(twse), audit(tpex)]);

  const transports = deepFreeze({
    TWSE: {
      ...twseAudit,
      ok: twse.ok,
      httpStatus: twse.httpStatus,
      errorCode: twse.errorCode,
      sourceId: A1_SYMBOL_SNAPSHOT_SOURCES.TWSE.sourceId,
    },
    TPEX: {
      ...tpexAudit,
      ok: tpex.ok,
      httpStatus: tpex.httpStatus,
      errorCode: tpex.errorCode,
      sourceId: A1_SYMBOL_SNAPSHOT_SOURCES.TPEX.sourceId,
    },
  });

  if (!twse.ok || !tpex.ok) {
    return deepFreeze({
      version: DAILY_SHADOW_A1_SOURCE_VERSION,
      state: "SOURCE_ERROR",
      marketDate: date,
      decisionTimestamp: fixedClock,
      decisionClockMode,
      observedAt,
      transports,
      snapshotBatch: null,
      externalMutationPerformed: false,
    });
  }

  const batch = await buildA1SymbolSnapshotBatch({
    batchId: `S2-A1-DAILY-PREFLIGHT:${date}:${observedAt}`,
    marketDate: date,
    decisionTimestamp: fixedClock,
    observedAt,
    twseRows: twse.payload,
    tpexRows: tpex.payload,
    minimumByMarket,
  });

  return deepFreeze({
    version: DAILY_SHADOW_A1_SOURCE_VERSION,
    state: batch.state === "READY" ? "READY" : "INCOMPLETE",
    marketDate: date,
    decisionTimestamp: fixedClock,
    decisionClockMode,
    observedAt,
    transports,
    snapshotBatch: batch,
    externalMutationPerformed: false,
  });
}
