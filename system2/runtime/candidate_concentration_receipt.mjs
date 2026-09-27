import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function ratio(n, d) {
  return d ? n / d : null;
}

export async function buildCandidateConcentrationReceipt({
  receiptId,
  marketDate,
  decisionTimestamp,
  globalPool,
  classificationVersion,
  capturedAt,
} = {}) {
  if (!Array.isArray(globalPool)) throw new Error("globalPool must be an array");

  const seen = new Set();
  const industryCounts = {};
  const strategyMembershipCounts = {};
  const unknownIndustrySymbols = [];
  let multiStrategySymbolCount = 0;

  for (let i = 0; i < globalPool.length; i += 1) {
    const row = globalPool[i];
    if (!row || typeof row !== "object") throw new Error(`globalPool[${i}] is required`);
    const symbol = requiredText(row.symbol, `globalPool[${i}].symbol`);
    if (seen.has(symbol)) throw new Error(`duplicate global-pool symbol: ${symbol}`);
    seen.add(symbol);

    const classification = row.industryClassification || {};
    if (
      classification.state === "KNOWN" &&
      typeof classification.industryKey === "string" &&
      classification.industryKey.trim()
    ) {
      const key = classification.industryKey.trim();
      industryCounts[key] = (industryCounts[key] || 0) + 1;
    } else {
      unknownIndustrySymbols.push(symbol);
    }

    const memberships = Array.isArray(row.memberships) ? row.memberships : [];
    if (memberships.length > 1) multiStrategySymbolCount += 1;
    const strategySeen = new Set();
    for (const m of memberships) {
      const strategyId = requiredText(m.strategyId, `globalPool[${i}].memberships[].strategyId`);
      if (strategySeen.has(strategyId)) {
        throw new Error(`duplicate strategy membership for ${symbol}: ${strategyId}`);
      }
      strategySeen.add(strategyId);
      strategyMembershipCounts[strategyId] =
        (strategyMembershipCounts[strategyId] || 0) + 1;
    }
  }

  const globalCount = globalPool.length;
  const unknownIndustryCount = unknownIndustrySymbols.length;
  const knownIndustryCount = globalCount - unknownIndustryCount;
  const knownIndustryCoverage = globalCount === 0 ? 1 : knownIndustryCount / globalCount;

  const industryRows = Object.entries(industryCounts)
    .map(([industryKey, count]) => ({
      industryKey,
      count,
      shareOfGlobal: ratio(count, globalCount),
      shareOfKnownIndustry: ratio(count, knownIndustryCount),
    }))
    .sort((a, b) => b.count - a.count || a.industryKey.localeCompare(b.industryKey));

  const largestIndustry = industryRows[0] || null;
  const industryHhiKnownOnly =
    knownIndustryCount === 0
      ? null
      : industryRows.reduce(
          (sum, row) => sum + Math.pow(row.count / knownIndustryCount, 2),
          0,
        );

  const base = {
    receiptId: requiredText(receiptId, "receiptId"),
    experimentId: "RANK-07",
    experimentVersion: "0.1",
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    classificationVersion: requiredText(
      classificationVersion,
      "classificationVersion",
    ),
    globalCount,
    knownIndustryCount,
    unknownIndustryCount,
    knownIndustryCoverage,
    unknownIndustrySymbols: Object.freeze([...unknownIndustrySymbols]),
    industryRows: Object.freeze(industryRows),
    largestIndustry,
    industryHhiKnownOnly,
    strategyMembershipCounts,
    multiStrategySymbolCount,
    concentrationAdmissionEffectAuthorized: false,
    concentrationEvictionEffectAuthorized: false,
    concentrationSizingEffectAuthorized: false,
    warnings: Object.freeze(
      unknownIndustryCount
        ? ["INDUSTRY_CLASSIFICATION_INCOMPLETE"]
        : [],
    ),
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_CANDIDATE_CONCENTRATION_V0_1",
  };

  const concentrationHash = await sha256Hex(base);
  return deepFreeze({ ...base, concentrationHash });
}
