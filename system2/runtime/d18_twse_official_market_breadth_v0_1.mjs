import { createHash } from "node:crypto";

export const D18_TWSE_OFFICIAL_MARKET_BREADTH_VERSION = "0.1-RESEARCH";
export const D18_TWSE_OFFICIAL_MARKET_BREADTH_SOURCE = Object.freeze({
  sourceId: "D18_TWSE_TWTAZU_STOCK_BREADTH",
  sourceName: "TWSE 集中市場漲跌證券數統計表 / 股票",
  sourceUrl: "https://openapi.twse.com.tw/v1/opendata/twtazu_od",
  sourceClass: "OFFICIAL_EXCHANGE_AGGREGATE",
  universeSemantics: "TWSE_EXCHANGE_STOCK_CATEGORY_NOT_COMMON_STOCK_RECONSTRUCTION",
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return value;
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function normalizeDate(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 7) {
    return `${Number(digits.slice(0, 3)) + 1911}-${digits.slice(3, 5)}-${digits.slice(5, 7)}`;
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
}

function nonNegativeInteger(value) {
  const raw = String(value ?? "").replaceAll(",", "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function pick(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return null;
}

function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function normalizeTwseOfficialMarketBreadthRowsV0_1({
  rows,
  targetDate,
  observedAt,
  decisionTimestamp,
} = {}) {
  const date = requiredText(targetDate, "targetDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("targetDate must be YYYY-MM-DD");
  const observed = isoTimestamp(observedAt, "observedAt");
  const clock = isoTimestamp(decisionTimestamp, "decisionTimestamp");

  if (!Array.isArray(rows)) {
    return deepFreeze({
      version: D18_TWSE_OFFICIAL_MARKET_BREADTH_VERSION,
      source: D18_TWSE_OFFICIAL_MARKET_BREADTH_SOURCE,
      state: "UNKNOWN",
      reason: "PAYLOAD_NOT_ARRAY",
      targetDate: date,
      observedAt: observed,
      decisionTimestamp: clock,
      pointInTimeEligible: false,
      researchOnly: true,
      decisionImpact: false,
      externalMutationPerformed: false,
    });
  }

  const candidates = rows.filter((row) => {
    const type = String(pick(row, ["類型", "Type", "type"]) ?? "").trim();
    const rowDate = normalizeDate(pick(row, ["出表日期", "Date", "date", "資料日期"]));
    return type === "股票" && rowDate === date;
  });

  if (candidates.length !== 1) {
    return deepFreeze({
      version: D18_TWSE_OFFICIAL_MARKET_BREADTH_VERSION,
      source: D18_TWSE_OFFICIAL_MARKET_BREADTH_SOURCE,
      state: "UNKNOWN",
      reason: candidates.length === 0 ? "TARGET_DATE_STOCK_ROW_NOT_FOUND" : "DUPLICATE_TARGET_DATE_STOCK_ROW",
      targetDate: date,
      observedAt: observed,
      decisionTimestamp: clock,
      pointInTimeEligible: false,
      targetRowCount: candidates.length,
      researchOnly: true,
      decisionImpact: false,
      externalMutationPerformed: false,
    });
  }

  const row = candidates[0];
  const counts = {
    advancers: nonNegativeInteger(pick(row, ["上漲", "Advancers"])),
    limitUp: nonNegativeInteger(pick(row, ["漲停", "LimitUp"])),
    decliners: nonNegativeInteger(pick(row, ["下跌", "Decliners"])),
    limitDown: nonNegativeInteger(pick(row, ["跌停", "LimitDown"])),
    unchanged: nonNegativeInteger(pick(row, ["持平", "平盤", "Unchanged"])),
    untraded: nonNegativeInteger(pick(row, ["未成交", "Untraded"])),
    noComparison: nonNegativeInteger(pick(row, ["無比價", "NoComparison"])),
  };

  const missingCountFields = Object.entries(counts)
    .filter(([, value]) => !Number.isInteger(value))
    .map(([key]) => key);

  const semanticErrors = [];
  if (!missingCountFields.length) {
    if (counts.limitUp > counts.advancers) semanticErrors.push("LIMIT_UP_EXCEEDS_ADVANCERS");
    if (counts.limitDown > counts.decliners) semanticErrors.push("LIMIT_DOWN_EXCEEDS_DECLINERS");
  }

  const pitEligible = Date.parse(observed) <= Date.parse(clock);
  if (!pitEligible) semanticErrors.push("OBSERVED_AFTER_DECISION_CLOCK");
  if (missingCountFields.length) semanticErrors.push("MISSING_OR_INVALID_COUNT_FIELDS");

  if (semanticErrors.length) {
    return deepFreeze({
      version: D18_TWSE_OFFICIAL_MARKET_BREADTH_VERSION,
      source: D18_TWSE_OFFICIAL_MARKET_BREADTH_SOURCE,
      state: "UNKNOWN",
      reason: semanticErrors[0],
      blockerCodes: semanticErrors,
      targetDate: date,
      observedAt: observed,
      decisionTimestamp: clock,
      pointInTimeEligible: false,
      counts,
      missingCountFields,
      researchOnly: true,
      decisionImpact: false,
      externalMutationPerformed: false,
    });
  }

  const comparableCount = counts.advancers + counts.decliners + counts.unchanged;
  const classificationBaseCount = comparableCount + counts.untraded + counts.noComparison;

  const base = {
    version: D18_TWSE_OFFICIAL_MARKET_BREADTH_VERSION,
    source: D18_TWSE_OFFICIAL_MARKET_BREADTH_SOURCE,
    state: classificationBaseCount > 0 ? "KNOWN" : "UNKNOWN",
    reason: classificationBaseCount > 0 ? null : "EMPTY_CLASSIFICATION_BASE",
    targetDate: date,
    observedAt: observed,
    decisionTimestamp: clock,
    pointInTimeEligible: pitEligible,
    counts,
    comparableCount,
    classificationBaseCount,
    advanceShareComparable: comparableCount ? counts.advancers / comparableCount : null,
    declineShareComparable: comparableCount ? counts.decliners / comparableCount : null,
    unchangedShareComparable: comparableCount ? counts.unchanged / comparableCount : null,
    netBreadthShareComparable: comparableCount
      ? (counts.advancers - counts.decliners) / comparableCount
      : null,
    comparableCoveragePct: classificationBaseCount ? comparableCount / classificationBaseCount : null,
    untradedPct: classificationBaseCount ? counts.untraded / classificationBaseCount : null,
    noComparisonPct: classificationBaseCount ? counts.noComparison / classificationBaseCount : null,
    denominatorSemantics:
      "ADVANCERS_DECLINERS_UNCHANGED_ONLY; UNTRADED_AND_NO_COMPARISON_EXCLUDED_BUT_REPORTED",
    universeSemantics: D18_TWSE_OFFICIAL_MARKET_BREADTH_SOURCE.universeSemantics,
    rawSourceFields: Object.freeze({ ...row }),
    researchOnly: true,
    decisionImpact: false,
    externalMutationPerformed: false,
    schemaVersion: "D18_TWSE_OFFICIAL_MARKET_BREADTH_V0_1",
  };

  return deepFreeze({ ...base, receiptHash: sha256(base) });
}
