import { deepFreeze } from "./factor_snapshot.mjs";

const ACCOUNT_STATES = new Set([
  "QUALIFIED_NOT_SELECTED",
  "WATCH",
  "REJECTED",
  "INCOMPLETE",
  "SOURCE_BLOCKED",
  "SESSION_INVALID",
  "NOT_APPLICABLE",
  "ERROR",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function uniqueSymbols(values, field) {
  if (!Array.isArray(values)) throw new Error(`${field} must be an array`);
  const out = values.map((x, i) => requiredText(x, `${field}[${i}]`));
  const set = new Set(out);
  if (set.size !== out.length) throw new Error(`${field} contains duplicate symbols`);
  return out;
}

function normalizeAccountRows(rows) {
  if (!Array.isArray(rows)) throw new Error("symbolAccounts must be an array");
  const seen = new Set();

  return rows.map((row, i) => {
    if (!row || typeof row !== "object") throw new Error(`symbolAccounts[${i}] is required`);
    const symbol = requiredText(row.symbol, `symbolAccounts[${i}].symbol`);
    if (seen.has(symbol)) throw new Error(`duplicate symbol account: ${symbol}`);
    seen.add(symbol);

    const state = requiredText(row.state, `symbolAccounts[${i}].state`);
    if (!ACCOUNT_STATES.has(state)) {
      throw new Error(`symbolAccounts[${i}].state has unsupported value: ${state}`);
    }

    const reasons = Array.isArray(row.reasons)
      ? row.reasons.map((x, j) => requiredText(x, `symbolAccounts[${i}].reasons[${j}]`))
      : [];

    return {
      symbol,
      state,
      decisionId: row.decisionId ? requiredText(row.decisionId, `symbolAccounts[${i}].decisionId`) : undefined,
      reasons: Object.freeze(reasons),
    };
  });
}

export function buildShadowRunReceipt(input) {
  if (!input || typeof input !== "object") throw new Error("run receipt input is required");

  const baseUniverseSymbols = uniqueSymbols(input.baseUniverseSymbols || [], "baseUniverseSymbols");
  const excludedSymbols = uniqueSymbols(input.excludedSymbols || [], "excludedSymbols");
  const eligibleUniverseSymbols = uniqueSymbols(input.eligibleUniverseSymbols || [], "eligibleUniverseSymbols");

  const base = new Set(baseUniverseSymbols);
  const excluded = new Set(excludedSymbols);
  const eligible = new Set(eligibleUniverseSymbols);

  for (const symbol of excluded) {
    if (!base.has(symbol)) throw new Error(`excluded symbol not in base universe: ${symbol}`);
  }
  for (const symbol of eligible) {
    if (!base.has(symbol)) throw new Error(`eligible symbol not in base universe: ${symbol}`);
    if (excluded.has(symbol)) throw new Error(`symbol cannot be both excluded and eligible: ${symbol}`);
  }

  if (excluded.size + eligible.size !== base.size) {
    throw new Error("base universe must be fully partitioned into excluded + eligible symbols");
  }

  const symbolAccounts = normalizeAccountRows(input.symbolAccounts || []);
  const accountBySymbol = new Map(symbolAccounts.map((x) => [x.symbol, x]));

  for (const row of symbolAccounts) {
    if (!eligible.has(row.symbol)) {
      throw new Error(`symbol account is not in eligible universe: ${row.symbol}`);
    }
  }

  const unaccountedSymbols = eligibleUniverseSymbols.filter((x) => !accountBySymbol.has(x));
  const stateCounts = {};
  for (const state of ACCOUNT_STATES) stateCounts[state] = 0;
  for (const row of symbolAccounts) stateCounts[row.state] += 1;

  const accountedCount = symbolAccounts.length;
  const eligibleCount = eligibleUniverseSymbols.length;
  const completionRate = eligibleCount === 0 ? 1 : accountedCount / eligibleCount;
  const runState = unaccountedSymbols.length === 0 ? "COMPLETE" : "INCOMPLETE";

  return deepFreeze({
    runId: requiredText(input.runId, "runId"),
    marketDate: requiredText(input.marketDate, "marketDate"),
    decisionTimestamp: requiredText(input.decisionTimestamp, "decisionTimestamp"),
    strategyId: requiredText(input.strategyId, "strategyId"),
    strategyVersion: requiredText(input.strategyVersion, "strategyVersion"),
    shadowSpecId: requiredText(input.shadowSpecId, "shadowSpecId"),
    universeVersion: requiredText(input.universeVersion, "universeVersion"),
    runState,
    baseUniverseCount: baseUniverseSymbols.length,
    excludedCount: excludedSymbols.length,
    eligibleCount,
    accountedCount,
    completionRate,
    stateCounts,
    unaccountedSymbols: Object.freeze(unaccountedSymbols),
    symbolAccounts: Object.freeze(symbolAccounts),
    warnings: Object.freeze([...(input.warnings || [])].map(String)),
    capturedAt: requiredText(input.capturedAt, "capturedAt"),
  });
}

export { ACCOUNT_STATES };
