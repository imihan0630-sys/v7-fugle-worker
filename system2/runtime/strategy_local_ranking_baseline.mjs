import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const THESIS_ORDER = Object.freeze({
  ADVERSE: 0,
  NEUTRAL: 1,
  SUPPORTIVE: 2,
});

const BASELINE_SPECS = deepFreeze({
  SHORT_MOMENTUM: {
    policyId: "SM-PARETO-BASELINE",
    policyVersion: "0.1",
    families: ["TECHNICAL_STRUCTURE", "PRICE_VOLUME", "RISK_FRICTION"],
  },
  SWING_GROWTH: {
    policyId: "SG-PARETO-BASELINE",
    policyVersion: "0.1",
    families: ["FUNDAMENTAL_QUALITY", "INDUSTRY_THESIS"],
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function normalizeCandidate(raw, index, strategyId, strategyVersion, families) {
  if (!raw || typeof raw !== "object") throw new Error(`candidates[${index}] is required`);
  const symbol = requiredText(raw.symbol, `candidates[${index}].symbol`);
  const decisionId = requiredText(raw.decisionId, `candidates[${index}].decisionId`);
  const rowStrategyId = requiredText(raw.strategyId, `candidates[${index}].strategyId`);
  const rowStrategyVersion = requiredText(
    raw.strategyVersion,
    `candidates[${index}].strategyVersion`,
  );

  if (rowStrategyId !== strategyId || rowStrategyVersion !== strategyVersion) {
    throw new Error(`strategy mismatch for ${symbol}`);
  }

  const familyAssessments = raw.familyAssessments || {};
  const familyStates = {};
  const incompleteFamilies = [];

  for (const family of families) {
    const a = familyAssessments[family];
    if (!a || a.observationState !== "KNOWN" || !(a.thesisState in THESIS_ORDER)) {
      incompleteFamilies.push(family);
      continue;
    }
    familyStates[family] = a.thesisState;
  }

  return {
    symbol,
    decisionId,
    strategyId,
    strategyVersion,
    strategyValidity: requiredText(
      raw.strategyValidity,
      `candidates[${index}].strategyValidity`,
    ),
    entryReadiness: requiredText(
      raw.entryReadiness,
      `candidates[${index}].entryReadiness`,
    ),
    familyStates,
    incompleteFamilies,
    warnings: Object.freeze([...(raw.warnings || [])].map(String)),
  };
}

function dominates(a, b, families) {
  let strictlyBetter = false;
  for (const family of families) {
    const av = THESIS_ORDER[a.familyStates[family]];
    const bv = THESIS_ORDER[b.familyStates[family]];
    if (av < bv) return false;
    if (av > bv) strictlyBetter = true;
  }
  return strictlyBetter;
}

function computeParetoTiers(rows, families) {
  const remaining = [...rows];
  const tiered = [];
  let tier = 1;

  while (remaining.length) {
    const front = remaining.filter(
      (candidate) =>
        !remaining.some(
          (other) =>
            other.symbol !== candidate.symbol &&
            dominates(other, candidate, families),
        ),
    );

    if (!front.length) throw new Error("Pareto tier construction failed");

    for (const row of front) tiered.push({ ...row, paretoTier: tier });
    const frontSymbols = new Set(front.map((x) => x.symbol));
    for (let i = remaining.length - 1; i >= 0; i -= 1) {
      if (frontSymbols.has(remaining[i].symbol)) remaining.splice(i, 1);
    }
    tier += 1;
  }

  return tiered;
}

async function withTieHashes(rows, {
  strategyId,
  strategyVersion,
  marketDate,
  policyVersion,
}) {
  const out = [];
  for (const row of rows) {
    const tieBreakHash = await sha256Hex({
      strategyId,
      strategyVersion,
      marketDate,
      symbol: row.symbol,
      policyVersion,
      purpose: "NEUTRAL_HASH_TIEBREAK",
    });
    out.push({ ...row, tieBreakHash });
  }
  return out;
}

export async function rankStrategyLocalBaseline({
  strategyId,
  strategyVersion,
  marketDate,
  decisionTimestamp,
  candidates = [],
} = {}) {
  const id = requiredText(strategyId, "strategyId");
  const version = requiredText(strategyVersion, "strategyVersion");
  const date = requiredText(marketDate, "marketDate");
  requiredText(decisionTimestamp, "decisionTimestamp");

  const spec = BASELINE_SPECS[id];
  if (!spec) throw new Error(`no RANK-01 baseline for strategy: ${id}`);

  const seen = new Set();
  const eligible = [];
  const unranked = [];

  for (let i = 0; i < candidates.length; i += 1) {
    const row = normalizeCandidate(candidates[i], i, id, version, spec.families);
    if (seen.has(row.symbol)) throw new Error(`duplicate candidate symbol: ${row.symbol}`);
    seen.add(row.symbol);

    if (row.strategyValidity !== "VALID") {
      unranked.push({
        symbol: row.symbol,
        decisionId: row.decisionId,
        reason: "STRATEGY_NOT_VALID",
      });
      continue;
    }

    if (row.incompleteFamilies.length) {
      unranked.push({
        symbol: row.symbol,
        decisionId: row.decisionId,
        reason: "RANKING_INPUT_INCOMPLETE",
        incompleteFamilies: Object.freeze([...row.incompleteFamilies]),
      });
      continue;
    }

    eligible.push(row);
  }

  const tiered = computeParetoTiers(eligible, spec.families);
  const hashed = await withTieHashes(tiered, {
    strategyId: id,
    strategyVersion: version,
    marketDate: date,
    policyVersion: spec.policyVersion,
  });

  hashed.sort((a, b) => {
    if (a.paretoTier !== b.paretoTier) return a.paretoTier - b.paretoTier;
    return a.tieBreakHash.localeCompare(b.tieBreakHash);
  });

  const tierCounts = {};
  for (const row of hashed) {
    tierCounts[row.paretoTier] = (tierCounts[row.paretoTier] || 0) + 1;
  }

  const ranked = hashed.map((row, index) => ({
    ordinal: index + 1,
    symbol: row.symbol,
    decisionId: row.decisionId,
    strategyId: id,
    strategyVersion: version,
    strategyValidity: row.strategyValidity,
    entryReadiness: row.entryReadiness,
    strategyLocalRank: index + 1,
    strategyLocalRankVersion: spec.policyVersion,
    paretoTier: row.paretoTier,
    tiedWithinTier: tierCounts[row.paretoTier] > 1,
    familyStates: row.familyStates,
    tieBreakHash: row.tieBreakHash,
    reasonCodes: Object.freeze([
      `PARETO_TIER:${row.paretoTier}`,
      ...(tierCounts[row.paretoTier] > 1 ? ["NEUTRAL_HASH_TIEBREAK"] : []),
    ]),
    warnings: row.warnings,
  }));

  return deepFreeze({
    strategyId: id,
    strategyVersion: version,
    marketDate: date,
    decisionTimestamp,
    orderingPolicyId: spec.policyId,
    orderingPolicyVersion: spec.policyVersion,
    baselineFamilies: Object.freeze([...spec.families]),
    ranked,
    unranked,
    rankedCount: ranked.length,
    unrankedCount: unranked.length,
    noNumericScore: true,
  });
}

export { BASELINE_SPECS, THESIS_ORDER };
