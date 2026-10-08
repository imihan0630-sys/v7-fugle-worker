import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_SECTOR_ROTATION_CONTEXT_VERSION = "D18_SECTOR_ROTATION_CONTEXT_V0_1_RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function denseRanks(rows) {
  const sorted = [...rows].sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return a.key.localeCompare(b.key);
  });
  let prior = null;
  let rank = 0;
  return new Map(sorted.map((row, index) => {
    if (prior === null || row.value !== prior) rank = index + 1;
    prior = row.value;
    return [row.key, rank];
  }));
}

function eligibleB2(receipt, marketDate, decisionMs, reasons, tag) {
  if (!receipt || typeof receipt !== "object") {
    reasons.push(tag + "_MISSING_RECEIPT");
    return false;
  }
  if (receipt.contractFamilyId !== "B2_INDUSTRY_THESIS_PROSPECTIVE") reasons.push(tag + "_WRONG_CONTRACT");
  if (receipt.marketDate !== marketDate) reasons.push(tag + "_DATE_MISMATCH");
  if (receipt.availabilityState !== "READY" || receipt.dependencyCoverageEligible !== true) {
    reasons.push(tag + "_NOT_READY");
  }
  if (receipt.classificationVintageSemantics !== "PROFILE_FIRST_OBSERVED_PROSPECTIVELY_NO_HISTORICAL_BACKFILL") {
    reasons.push(tag + "_CLASSIFICATION_VINTAGE_INVALID");
  }
  const observed = Date.parse(receipt.observedAt || "");
  if (!Number.isFinite(observed)) reasons.push(tag + "_OBSERVED_AT_INVALID");
  else if (observed > decisionMs) reasons.push(tag + "_OBSERVED_AFTER_DECISION");
  if (typeof receipt.receiptHash !== "string" || !receipt.receiptHash) reasons.push(tag + "_HASH_MISSING");
  return true;
}

function validIndustryRows(receipt, reasons, tag) {
  const rows = Array.isArray(receipt?.industries) ? receipt.industries : [];
  if (!rows.length) {
    reasons.push(tag + "_NO_INDUSTRIES");
    return [];
  }
  const out = [];
  const seen = new Set();
  for (const row of rows) {
    const key = String(row?.industryKey || "");
    if (!key || seen.has(key)) {
      reasons.push(tag + "_INDUSTRY_KEY_INVALID_OR_DUPLICATE");
      continue;
    }
    seen.add(key);
    const value = Number(row?.meanChangePercent);
    if (!Number.isFinite(value)) continue;
    out.push({
      key,
      market: row.market || null,
      industry: row.industry || null,
      value,
      breadthNetShare: Number.isFinite(Number(row?.breadthNetShare)) ? Number(row.breadthNetShare) : null,
      memberCount: Number.isFinite(Number(row?.memberCount)) ? Number(row.memberCount) : null,
    });
  }
  if (!out.length) reasons.push(tag + "_NO_RANKABLE_INDUSTRIES");
  return out;
}

export async function buildD18SectorRotationContextV0_1({
  receiptId,
  marketDate,
  priorMarketDate,
  decisionTimestamp,
  currentB2Receipt,
  priorB2Receipt,
  officialSessionDates,
} = {}) {
  const id = requiredText(receiptId, "receiptId");
  const decisionAt = iso(decisionTimestamp, "decisionTimestamp");
  const decisionMs = Date.parse(decisionAt);
  const reasons = [];

  if (!Array.isArray(officialSessionDates) || officialSessionDates.length < 2) {
    reasons.push("OFFICIAL_SESSION_CONTINUITY_MISSING");
  } else {
    const xs = officialSessionDates.map(String);
    const i = xs.indexOf(marketDate);
    if (i <= 0 || xs[i - 1] !== priorMarketDate) reasons.push("PRIOR_SESSION_NOT_OFFICIAL_ADJACENT");
  }

  eligibleB2(currentB2Receipt, marketDate, decisionMs, reasons, "CURRENT");
  eligibleB2(priorB2Receipt, priorMarketDate, decisionMs, reasons, "PRIOR");
  const currentRows = validIndustryRows(currentB2Receipt, reasons, "CURRENT");
  const priorRows = validIndustryRows(priorB2Receipt, reasons, "PRIOR");
  const observedTimes = [
    Date.parse(currentB2Receipt?.observedAt || ""),
    Date.parse(priorB2Receipt?.observedAt || ""),
  ];
  const availableAt = observedTimes.every(Number.isFinite)
    ? new Date(Math.max(...observedTimes)).toISOString()
    : null;

  const base = {
    receiptId: id,
    contextVersion: D18_SECTOR_ROTATION_CONTEXT_VERSION,
    marketDate,
    priorMarketDate,
    decisionTimestamp: decisionAt,
    availableAt,
    currentB2ReceiptHash: currentB2Receipt?.receiptHash || null,
    priorB2ReceiptHash: priorB2Receipt?.receiptHash || null,
    classificationVintageSemantics:
      "PROFILE_FIRST_OBSERVED_PROSPECTIVELY_NO_HISTORICAL_BACKFILL",
    rankBasis: "INDUSTRY_MEAN_DAILY_CHANGE_PERCENT",
    thresholdApplied: false,
    strategyScoreAssigned: false,
    policyApplied: false,
  };

  if (reasons.length) {
    return deepFreeze({
      ...base,
      state: "UNKNOWN",
      pointInTimeEligible: false,
      unknownReasons: Object.freeze([...new Set(reasons)]),
      industries: Object.freeze([]),
      schemaVersion: D18_SECTOR_ROTATION_CONTEXT_VERSION,
    });
  }

  const currentRanks = denseRanks(currentRows);
  const priorRanks = denseRanks(priorRows);
  const priorByKey = new Map(priorRows.map((x) => [x.key, x]));
  const joined = currentRows.map((row) => {
    const prior = priorByKey.get(row.key) || null;
    return {
      industryKey: row.key,
      market: row.market,
      industry: row.industry,
      currentMeanChangePercent: row.value,
      priorMeanChangePercent: prior?.value ?? null,
      currentRank: currentRanks.get(row.key),
      priorRank: prior ? priorRanks.get(row.key) : null,
      rankImprovement: prior ? priorRanks.get(row.key) - currentRanks.get(row.key) : null,
      currentBreadthNetShare: row.breadthNetShare,
      memberCount: row.memberCount,
      priorComparable: Boolean(prior),
    };
  }).sort((a, b) => a.currentRank - b.currentRank || a.industryKey.localeCompare(b.industryKey));

  const commonCount = joined.filter((x) => x.priorComparable).length;
  const payload = {
    ...base,
    state: commonCount > 0 ? "KNOWN" : "UNKNOWN",
    pointInTimeEligible: commonCount > 0,
    unknownReasons: Object.freeze(commonCount > 0 ? [] : ["NO_COMMON_INDUSTRY_KEYS"]),
    commonIndustryCount: commonCount,
    currentIndustryCount: currentRows.length,
    priorIndustryCount: priorRows.length,
    industries: Object.freeze(joined),
    schemaVersion: D18_SECTOR_ROTATION_CONTEXT_VERSION,
  };
  const receiptHash = await sha256Hex(payload);
  return deepFreeze({ ...payload, receiptHash });
}
