import { createHash } from "node:crypto";

export const D18_TWSE_MI_INDEX_MARKET_BREADTH_VERSION = "0.1-RESEARCH";

export const D18_TWSE_MI_INDEX_MARKET_BREADTH_SOURCE = Object.freeze({
  sourceId: "D18_TWSE_MI_INDEX_MS_STOCK_BREADTH",
  sourceName: "TWSE MI_INDEX 大盤統計資訊 / 漲跌證券數合計 / 股票",
  sourceUrlTemplate:
    "https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date={YYYYMMDD}&type=MS&response=json",
  sourceClass: "OFFICIAL_EXCHANGE_AFTER_TRADING_REPORT",
  transport: "OFFICIAL_TWSE_RWD_JSON",
  universeSemantics: "TWSE_MI_INDEX_STOCK_COLUMN",
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return value;
}

function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
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

function compactDate(targetDate) {
  const text = requiredText(targetDate, "targetDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error("targetDate must be YYYY-MM-DD");
  }
  return text.replaceAll("-", "");
}

function toNonNegativeInteger(value) {
  const raw = String(value ?? "").replaceAll(",", "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function parseParentAndSubset(value) {
  const raw = String(value ?? "").replaceAll(",", "").trim();
  const match = raw.match(/^(\d+)(?:\((\d+)\))?$/);
  if (!match) return null;
  const total = Number(match[1]);
  const subset = match[2] === undefined ? null : Number(match[2]);
  if (!Number.isInteger(total) || total < 0) return null;
  if (subset !== null && (!Number.isInteger(subset) || subset < 0 || subset > total)) return null;
  return { total, subset };
}

function unknownBase({ reason, targetDate, observedAt, decisionTimestamp, blockerCodes = [], extra = {} }) {
  return deepFreeze({
    version: D18_TWSE_MI_INDEX_MARKET_BREADTH_VERSION,
    source: D18_TWSE_MI_INDEX_MARKET_BREADTH_SOURCE,
    state: "UNKNOWN",
    reason,
    blockerCodes: Object.freeze([...blockerCodes]),
    targetDate,
    observedAt,
    decisionTimestamp,
    pointInTimeEligible: false,
    researchOnly: true,
    decisionImpact: false,
    externalMutationPerformed: false,
    ...extra,
  });
}

export function normalizeTwseMiIndexMarketBreadthV0_1({
  payload,
  targetDate,
  observedAt,
  decisionTimestamp,
} = {}) {
  const target = requiredText(targetDate, "targetDate");
  const targetCompact = compactDate(target);
  const observed = isoTimestamp(observedAt, "observedAt");
  const decision = isoTimestamp(decisionTimestamp, "decisionTimestamp");

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return unknownBase({
      reason: "PAYLOAD_NOT_OBJECT",
      targetDate: target,
      observedAt: observed,
      decisionTimestamp: decision,
    });
  }

  const blockers = [];
  if (payload.stat !== "OK") blockers.push("SOURCE_STAT_NOT_OK");
  if (String(payload.date ?? "") !== targetCompact) blockers.push("SOURCE_DATE_MISMATCH");
  if (Date.parse(observed) > Date.parse(decision)) blockers.push("OBSERVED_AFTER_DECISION_CLOCK");

  const tables = Array.isArray(payload.tables) ? payload.tables : [];
  const candidates = tables.filter((table) => {
    if (!table || typeof table !== "object") return false;
    if (String(table.title ?? "").trim() === "漲跌證券數合計") return true;
    const fields = Array.isArray(table.fields) ? table.fields.map((x) => String(x).trim()) : [];
    return fields.length === 3
      && fields[0] === "類型"
      && fields[1] === "整體市場"
      && fields[2] === "股票";
  });

  if (candidates.length === 0) blockers.push("BREADTH_TABLE_NOT_FOUND");
  if (candidates.length > 1) blockers.push("DUPLICATE_BREADTH_TABLE");

  if (blockers.length) {
    return unknownBase({
      reason: blockers[0],
      blockerCodes: blockers,
      targetDate: target,
      observedAt: observed,
      decisionTimestamp: decision,
      extra: {
        sourceDate: payload.date ?? null,
        sourceStat: payload.stat ?? null,
        breadthTableCount: candidates.length,
      },
    });
  }

  const table = candidates[0];
  const fields = Array.isArray(table.fields) ? table.fields.map((x) => String(x).trim()) : [];
  if (fields.join("|") !== "類型|整體市場|股票") {
    return unknownBase({
      reason: "BREADTH_FIELDS_UNEXPECTED",
      blockerCodes: ["BREADTH_FIELDS_UNEXPECTED"],
      targetDate: target,
      observedAt: observed,
      decisionTimestamp: decision,
      extra: { fields },
    });
  }

  const rows = Array.isArray(table.data) ? table.data : [];
  const byType = new Map();
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 3) continue;
    const type = String(row[0] ?? "").trim();
    if (!type) continue;
    if (byType.has(type)) {
      return unknownBase({
        reason: "DUPLICATE_BREADTH_ROW_TYPE",
        blockerCodes: ["DUPLICATE_BREADTH_ROW_TYPE"],
        targetDate: target,
        observedAt: observed,
        decisionTimestamp: decision,
        extra: { duplicateType: type },
      });
    }
    byType.set(type, row[2]);
  }

  const up = parseParentAndSubset(byType.get("上漲(漲停)"));
  const down = parseParentAndSubset(byType.get("下跌(跌停)"));
  const unchanged = toNonNegativeInteger(byType.get("持平"));
  const untraded = toNonNegativeInteger(byType.get("未成交"));
  const noComparison = toNonNegativeInteger(byType.get("無比價"));

  const semanticBlockers = [];
  if (!up) semanticBlockers.push("UP_ROW_INVALID");
  if (!down) semanticBlockers.push("DOWN_ROW_INVALID");
  if (!Number.isInteger(unchanged)) semanticBlockers.push("UNCHANGED_ROW_INVALID");
  if (!Number.isInteger(untraded)) semanticBlockers.push("UNTRADED_ROW_INVALID");
  if (!Number.isInteger(noComparison)) semanticBlockers.push("NO_COMPARISON_ROW_INVALID");
  if (up && up.subset === null) semanticBlockers.push("LIMIT_UP_SUBCOUNT_MISSING");
  if (down && down.subset === null) semanticBlockers.push("LIMIT_DOWN_SUBCOUNT_MISSING");

  if (semanticBlockers.length) {
    return unknownBase({
      reason: semanticBlockers[0],
      blockerCodes: semanticBlockers,
      targetDate: target,
      observedAt: observed,
      decisionTimestamp: decision,
    });
  }

  const counts = {
    advancers: up.total,
    limitUp: up.subset,
    decliners: down.total,
    limitDown: down.subset,
    unchanged,
    untraded,
    noComparison,
  };

  const comparableCount = counts.advancers + counts.decliners + counts.unchanged;
  const classificationBaseCount = comparableCount + counts.untraded + counts.noComparison;
  if (classificationBaseCount <= 0) {
    return unknownBase({
      reason: "EMPTY_CLASSIFICATION_BASE",
      blockerCodes: ["EMPTY_CLASSIFICATION_BASE"],
      targetDate: target,
      observedAt: observed,
      decisionTimestamp: decision,
      extra: { counts },
    });
  }

  const base = {
    version: D18_TWSE_MI_INDEX_MARKET_BREADTH_VERSION,
    source: D18_TWSE_MI_INDEX_MARKET_BREADTH_SOURCE,
    state: "KNOWN",
    reason: null,
    targetDate: target,
    sourceDate: payload.date,
    observedAt: observed,
    decisionTimestamp: decision,
    pointInTimeEligible: true,
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
    noComparisonSemantics:
      "TWSE_MI_INDEX_EX_DIVIDEND_EX_RIGHT_NEW_LISTING_RESUMPTION_OR_PRIOR_NO_CLOSE_MAY_BE_NO_COMPARISON",
    universeSemantics: D18_TWSE_MI_INDEX_MARKET_BREADTH_SOURCE.universeSemantics,
    sourceReportTitle: table.title ?? null,
    sourceNotes: Array.isArray(table.notes) ? Object.freeze([...table.notes]) : Object.freeze([]),
    researchOnly: true,
    decisionImpact: false,
    externalMutationPerformed: false,
    schemaVersion: "D18_TWSE_MI_INDEX_MARKET_BREADTH_V0_1",
  };

  return deepFreeze({ ...base, receiptHash: sha256(base) });
}
