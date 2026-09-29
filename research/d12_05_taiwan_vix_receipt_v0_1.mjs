import {
  sealGlobalMarketReceipt,
  validateGlobalMarketReceipt
} from "./global_market_receipt_guard_v0_1.mjs";

export const TAIWAN_VIX_RECEIPT_VERSION = "0.1.0";
export const TAIWAN_VIX_RULES_REGIME =
  "TAIFEX_VIX_15S_POST_20201123__TXO_FRIDAY_EXPIRY_POST_2025";

const VALID_QUALITY_STATES = new Set([
  "VIX_VALID_OFFICIAL",
  "VIX_STALE_OR_HALTED",
  "VIX_SOURCE_MISSING",
  "VIX_RULES_REGIME_UNCERTAIN"
]);

function parseTs(value, field) {
  if (typeof value !== "string" || !/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) {
    throw new Error(`${field} must be an offset-aware timestamp`);
  }
  const d = new Date(value);
  if (Number.isNaN(d.valueOf())) throw new Error(`${field} is invalid`);
  return d;
}

function taipeiParts(date) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  return Object.fromEntries(
    f.formatToParts(date)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  );
}

function officialSessionCheck(observedAt) {
  const p = taipeiParts(observedAt);
  const h = Number(p.hour);
  const m = Number(p.minute);
  const s = Number(p.second);
  const seconds = h * 3600 + m * 60 + s;
  const open = 9 * 3600;
  const close = 13 * 3600 + 45 * 60;
  if (seconds < open || seconds > close) {
    throw new Error("VIX observedAt must be within TAIFEX 09:00-13:45 regular disclosure window");
  }
  if (s % 15 !== 0) {
    throw new Error("VIX observedAt must be on the official 15-second publication grid");
  }
  return `${p.year}-${p.month}-${p.day}`;
}

export function buildTaiwanVixReceipt(input, context = {}) {
  if (!input || typeof input !== "object") throw new Error("input is required");
  const observedAt = parseTs(input.vixObservedAt, "vixObservedAt");
  const capturedAt = parseTs(input.vixCapturedAt, "vixCapturedAt");
  const knownAt = parseTs(input.vixKnownAtTaipei, "vixKnownAtTaipei");

  const sourceSessionDate = officialSessionCheck(observedAt);

  if (observedAt > capturedAt) throw new Error("vixObservedAt cannot be later than capturedAt");
  if (knownAt > capturedAt) throw new Error("vixKnownAtTaipei cannot be later than capturedAt");

  const qualityState = String(input.vixQualityState || "");
  if (!VALID_QUALITY_STATES.has(qualityState)) {
    throw new Error("unsupported vixQualityState");
  }

  const validValue =
    typeof input.vixValue === "number" &&
    Number.isFinite(input.vixValue) &&
    input.vixValue > 0;

  if (qualityState === "VIX_VALID_OFFICIAL" && !validValue) {
    throw new Error("VIX_VALID_OFFICIAL requires a finite positive vixValue");
  }

  if (qualityState !== "VIX_VALID_OFFICIAL" && input.vixValue != null && !validValue) {
    throw new Error("provided vixValue must be finite and positive");
  }

  const cleanSource = qualityState === "VIX_VALID_OFFICIAL";
  const missingReason = cleanSource
    ? null
    : String(input.missingReason || qualityState);

  const receipt = {
    receiptId:
      input.receiptId ||
      `taiwan-vix-${sourceSessionDate}-${input.vixObservedAt.replace(/[^0-9]/g, "")}`,
    domainModule: "D12-05",
    instrumentFamily: "TAIWAN_VIX",
    instrumentId: "TAIWAN_VIX",
    sourceMarket: "TAIFEX",
    sourceTimezone: "Asia/Taipei",
    sourceSessionDate,
    observedAt: input.vixObservedAt,
    capturedAt: input.vixCapturedAt,
    knownAtTaipei: input.vixKnownAtTaipei,
    firstEligibleTaiwanDecision:
      input.firstEligibleTaiwanDecision ||
      `${sourceSessionDate}T18:10:00+08:00`,
    sourceId: input.sourceId || "TAIFEX_TAIWAN_VIX_OFFICIAL",
    sourceUrlOrContract:
      input.sourceUrlOrContract || "https://www.taifex.com.tw/cht/9/volatilityIndex",
    provider: "TAIFEX",
    providerEntitlement: "PUBLIC_OFFICIAL",
    dataLatencyClass: "OFFICIAL_RELEASE",
    revisionStatus: input.revisionStatus || "FIRST_PROSPECTIVE_CAPTURE",
    staleFlag: qualityState === "VIX_STALE_OR_HALTED",
    staleReason:
      qualityState === "VIX_STALE_OR_HALTED"
        ? String(input.staleReason || "VIX_STALE_OR_HALTED")
        : null,
    pointInTimeEligible: cleanSource ? true : null,
    missingReason,
    rulesRegimeVersion: input.rulesRegimeVersion || TAIWAN_VIX_RULES_REGIME,
    payloadVersion: TAIWAN_VIX_RECEIPT_VERSION,
    payload: {
      vixValue: validValue ? input.vixValue : null,
      vixQualityState: qualityState,
      directionalInterpretation: "PROHIBITED",
      expectedVolatilityHorizon: "30_DAY_ANNUALIZED_EXPECTED_TAIEX_VOLATILITY",
      publicationCadence: "15_SECONDS_REGULAR_SESSION",
      quoteLiquidityQuality:
        input.quoteLiquidityQuality || "UNKNOWN_NOT_CAPTURED",
      macroEventState: input.macroEventState || "UNKNOWN",
      sourceVersion: input.sourceVersion || "TAIFEX_PUBLIC_CURRENT"
    }
  };

  const decisionTimestamp =
    context.decisionTimestamp || receipt.firstEligibleTaiwanDecision;

  if (cleanSource) {
    return sealGlobalMarketReceipt(receipt, { decisionTimestamp });
  }

  // Missing/stale/halted receipts are valid evidence of source state, but never clean coverage.
  const validation = validateGlobalMarketReceipt(receipt, { decisionTimestamp });
  return Object.freeze({
    ...receipt,
    receiptHash: validation.receiptHash,
    validation
  });
}

export { VALID_QUALITY_STATES };
