import {
  sealGlobalMarketReceipt,
  validateGlobalMarketReceipt
} from "./global_market_receipt_guard_v0_1.mjs";

export const NIGHT_PRE_SCAN_RECEIPT_VERSION = "0.1.0";
export const NIGHT_PRE_SCAN_RULES_REGIME = "TAIFEX_TX_AFTER_HOURS_1500_0500__PRE_SCAN_CUTOFF_1810";

const QUALITY_STATES = new Set([
  "COMPLETE_TO_CAPTURE",
  "PARTIAL_WINDOW",
  "SOURCE_MISSING",
  "STALE_OR_HALTED",
  "RULES_REGIME_UNCERTAIN"
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
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23"
  });
  return Object.fromEntries(
    f.formatToParts(date)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  );
}

function ymdTaipei(date) {
  const p = taipeiParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function secondsTaipei(date) {
  const p = taipeiParts(date);
  return Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second);
}

function finitePositive(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be finite and positive`);
  }
  return value;
}

function nonnegative(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`${field} must be finite and nonnegative`);
  }
  return value;
}

export function buildNightPreScanReceipt(input, context = {}) {
  if (!input || typeof input !== "object") throw new Error("input is required");

  const windowStart = parseTs(input.windowStart, "windowStart");
  const observedAt = parseTs(input.observedAt, "observedAt");
  const capturedAt = parseTs(input.capturedAt, "capturedAt");
  const knownAt = parseTs(input.knownAtTaipei, "knownAtTaipei");
  const decisionTimestamp = parseTs(
    context.decisionTimestamp || input.decisionTimestamp,
    "decisionTimestamp"
  );

  const selectionDate = ymdTaipei(windowStart);
  if (secondsTaipei(windowStart) !== 15 * 3600) {
    throw new Error("windowStart must be exactly 15:00:00 Asia/Taipei");
  }

  if (ymdTaipei(observedAt) !== selectionDate) {
    throw new Error("observedAt must stay on the same Taipei calendar date as the 15:00 window start");
  }

  if (secondsTaipei(observedAt) < 15 * 3600) {
    throw new Error("observedAt cannot precede the 15:00 night-session open");
  }

  if (secondsTaipei(observedAt) > 18 * 3600 + 10 * 60) {
    throw new Error("NIGHT_PRE_SCAN observedAt cannot be later than 18:10");
  }

  if (observedAt > capturedAt) throw new Error("observedAt cannot be later than capturedAt");
  if (knownAt > capturedAt) throw new Error("knownAtTaipei cannot be later than capturedAt");

  if (input.lastTradingDayFlag === true) {
    throw new Error("expiring TX contract has no after-hours session on its last trading day");
  }

  const qualityState = String(input.qualityState || "");
  if (!QUALITY_STATES.has(qualityState)) throw new Error("unsupported qualityState");

  const clean = qualityState === "COMPLETE_TO_CAPTURE";

  let payload = {
    contractCode: String(input.contractCode || "TX"),
    contractMonth: String(input.contractMonth || ""),
    daysToExpiry: input.daysToExpiry ?? null,
    rollFlag: Boolean(input.rollFlag),
    lastTradingDayFlag: Boolean(input.lastTradingDayFlag),
    qualityState,
    sourceWindow: "15:00_TO_OBSERVED_AT__MAX_18:10",
    fullNightUseAt1810: "PROHIBITED",
    directionalInterpretation: "PROHIBITED",
    transactionCompleteness: input.transactionCompleteness || "UNKNOWN",
    sourceVersion: input.sourceVersion || "TAIFEX_PUBLIC_TRANSACTION_CURRENT"
  };

  if (clean) {
    payload = {
      ...payload,
      open: finitePositive(input.open, "open"),
      high: finitePositive(input.high, "high"),
      low: finitePositive(input.low, "low"),
      last: finitePositive(input.last, "last"),
      volume: nonnegative(input.volume, "volume"),
      tradeCount: nonnegative(input.tradeCount, "tradeCount")
    };
    if (payload.high < payload.low) throw new Error("high cannot be below low");
    for (const [field, value] of [["open", payload.open], ["last", payload.last]]) {
      if (value < payload.low || value > payload.high) {
        throw new Error(`${field} must lie within low/high`);
      }
    }
    if (!payload.contractMonth) throw new Error("contractMonth is required for clean night receipt");
    if (!Number.isInteger(payload.daysToExpiry) || payload.daysToExpiry < 0) {
      throw new Error("daysToExpiry must be a nonnegative integer for clean night receipt");
    }
  }

  const receipt = {
    receiptId:
      input.receiptId ||
      `tx-night-prescan-${selectionDate}-${String(input.contractMonth || "UNKNOWN")}-${input.observedAt.replace(/[^0-9]/g, "")}`,
    domainModule: "D12-10",
    instrumentFamily: "TAIFEX_NIGHT",
    instrumentId: String(input.instrumentId || "TX_NIGHT_PRE_SCAN"),
    sourceMarket: "TAIFEX",
    sourceTimezone: "Asia/Taipei",
    sourceSessionDate: String(input.sourceSessionDate || ""),
    observedAt: input.observedAt,
    capturedAt: input.capturedAt,
    knownAtTaipei: input.knownAtTaipei,
    firstEligibleTaiwanDecision:
      input.firstEligibleTaiwanDecision || `${selectionDate}T18:10:00+08:00`,
    sourceId: input.sourceId || "TAIFEX_TX_AFTER_HOURS_TRANSACTIONS",
    sourceUrlOrContract:
      input.sourceUrlOrContract || "https://www.taifex.com.tw/cht/4/aHIntroduction",
    provider: "TAIFEX",
    providerEntitlement: input.providerEntitlement || "PUBLIC_OFFICIAL",
    dataLatencyClass: input.dataLatencyClass || "REALTIME",
    revisionStatus: input.revisionStatus || "FIRST_PROSPECTIVE_CAPTURE",
    staleFlag: qualityState === "STALE_OR_HALTED",
    staleReason:
      qualityState === "STALE_OR_HALTED"
        ? String(input.staleReason || "STALE_OR_HALTED")
        : null,
    pointInTimeEligible: clean ? true : null,
    missingReason: clean ? null : String(input.missingReason || qualityState),
    rulesRegimeVersion: input.rulesRegimeVersion || NIGHT_PRE_SCAN_RULES_REGIME,
    payloadVersion: NIGHT_PRE_SCAN_RECEIPT_VERSION,
    payload
  };

  if (!receipt.sourceSessionDate) {
    throw new Error("sourceSessionDate is required because TAIFEX attributes after-hours trades to the following regular session");
  }

  if (clean) return sealGlobalMarketReceipt(receipt, { decisionTimestamp: context.decisionTimestamp || input.decisionTimestamp });

  const validation = validateGlobalMarketReceipt(receipt, {
    decisionTimestamp: context.decisionTimestamp || input.decisionTimestamp
  });
  return Object.freeze({ ...receipt, receiptHash: validation.receiptHash, validation });
}

export { QUALITY_STATES };
