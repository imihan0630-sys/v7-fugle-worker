import { deepFreeze } from "./factor_snapshot.mjs";

const PROXIMATE = new Set(["NEAR_ENTRY", "ACTIVE_ENTRY_MONITOR", "BUY_ELIGIBLE"]);
const ACTIVE_ORDINAL = Object.freeze({
  BUY_ELIGIBLE: 0,
  ACTIVE_ENTRY_MONITOR: 1,
  NEAR_ENTRY: 2,
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function cloneRows(rows) {
  return rows.map((x) => ({
    ...x,
    reasonCodes: Object.freeze([...(x.reasonCodes || [])]),
    warnings: Object.freeze([...(x.warnings || [])]),
  }));
}

export function rankGlobalAdmissionWithEntryProximity(baselineRanking) {
  if (!baselineRanking || typeof baselineRanking !== "object") {
    throw new Error("baselineRanking is required");
  }

  const rows = cloneRows(baselineRanking.ranked || []);
  rows.sort((a, b) => {
    if (a.paretoTier !== b.paretoTier) return a.paretoTier - b.paretoTier;
    const ap = PROXIMATE.has(a.entryReadiness) ? 0 : 1;
    const bp = PROXIMATE.has(b.entryReadiness) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return a.tieBreakHash.localeCompare(b.tieBreakHash);
  });

  const strategyId = requiredText(baselineRanking.strategyId, "baselineRanking.strategyId");
  const policyId = `${strategyId}-RANK02-ENTRY-PROXIMITY`;

  return deepFreeze({
    strategyId,
    strategyVersion: baselineRanking.strategyVersion,
    marketDate: baselineRanking.marketDate,
    decisionTimestamp: baselineRanking.decisionTimestamp,
    orderingPolicyId: policyId,
    orderingPolicyVersion: "0.1",
    purpose: "GLOBAL_ADMISSION",
    ranked: rows.map((row, index) => ({
      ...row,
      ordinal: index + 1,
      strategyLocalRank: index + 1,
      strategyLocalRankVersion: "0.1",
      entryProximityClass: PROXIMATE.has(row.entryReadiness)
        ? "PROXIMATE"
        : "NON_PROXIMATE",
      reasonCodes: Object.freeze([
        ...row.reasonCodes,
        `ENTRY_PROXIMITY:${PROXIMATE.has(row.entryReadiness) ? "PROXIMATE" : "NON_PROXIMATE"}`,
      ]),
    })),
    unranked: baselineRanking.unranked || [],
  });
}

export function rankActiveMonitorWithEntryReadiness(baselineRanking) {
  if (!baselineRanking || typeof baselineRanking !== "object") {
    throw new Error("baselineRanking is required");
  }

  const eligible = cloneRows(baselineRanking.ranked || []).filter(
    (row) => row.entryReadiness in ACTIVE_ORDINAL,
  );

  eligible.sort((a, b) => {
    if (a.paretoTier !== b.paretoTier) return a.paretoTier - b.paretoTier;
    const ar = ACTIVE_ORDINAL[a.entryReadiness];
    const br = ACTIVE_ORDINAL[b.entryReadiness];
    if (ar !== br) return ar - br;
    return a.tieBreakHash.localeCompare(b.tieBreakHash);
  });

  const strategyId = requiredText(baselineRanking.strategyId, "baselineRanking.strategyId");
  const policyId = `${strategyId}-RANK02-ENTRY-ORDINAL`;

  return deepFreeze({
    strategyId,
    strategyVersion: baselineRanking.strategyVersion,
    marketDate: baselineRanking.marketDate,
    decisionTimestamp: baselineRanking.decisionTimestamp,
    orderingPolicyId: policyId,
    orderingPolicyVersion: "0.1",
    purpose: "ACTIVE_INTRADAY_MONITOR",
    ranked: eligible.map((row, index) => ({
      ...row,
      ordinal: index + 1,
      strategyLocalRank: index + 1,
      strategyLocalRankVersion: "0.1",
      entryReadinessOrdinal: ACTIVE_ORDINAL[row.entryReadiness],
      reasonCodes: Object.freeze([
        ...row.reasonCodes,
        `ENTRY_READINESS_ORDINAL:${row.entryReadiness}`,
      ]),
    })),
    excludedNonProximate: Object.freeze(
      cloneRows(baselineRanking.ranked || [])
        .filter((row) => !(row.entryReadiness in ACTIVE_ORDINAL))
        .map((row) => ({
          symbol: row.symbol,
          decisionId: row.decisionId,
          reason: "NOT_ACTIVE_MONITOR_PROXIMATE",
          entryReadiness: row.entryReadiness,
        })),
    ),
    unranked: baselineRanking.unranked || [],
  });
}

export { PROXIMATE, ACTIVE_ORDINAL };
