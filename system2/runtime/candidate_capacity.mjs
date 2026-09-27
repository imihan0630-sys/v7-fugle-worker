import { deepFreeze } from "./factor_snapshot.mjs";

const ENTRY_PROXIMATE_STATES = new Set([
  "NEAR_ENTRY",
  "ACTIVE_ENTRY_MONITOR",
  "BUY_ELIGIBLE",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function positiveInteger(value, field) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${field} must be a positive integer`);
  return value;
}

function normalizeMembership(raw, field) {
  if (!raw || typeof raw !== "object") throw new Error(`${field} is required`);
  return {
    strategyId: requiredText(raw.strategyId, `${field}.strategyId`),
    strategyVersion: requiredText(raw.strategyVersion, `${field}.strategyVersion`),
    strategyValidity: requiredText(raw.strategyValidity, `${field}.strategyValidity`),
    entryReadiness: requiredText(raw.entryReadiness, `${field}.entryReadiness`),
    setupId: raw.setupId ? requiredText(raw.setupId, `${field}.setupId`) : undefined,
    decisionId: raw.decisionId ? requiredText(raw.decisionId, `${field}.decisionId`) : undefined,
    globalPoolEligible: raw.globalPoolEligible === true,
    activeMonitorEligible: raw.activeMonitorEligible === true,
    strategyLocalRank: Number.isInteger(raw.strategyLocalRank) && raw.strategyLocalRank > 0
      ? raw.strategyLocalRank
      : null,
    strategyLocalRankVersion: raw.strategyLocalRankVersion
      ? requiredText(raw.strategyLocalRankVersion, `${field}.strategyLocalRankVersion`)
      : undefined,
    reasons: Object.freeze([...(raw.reasons || [])].map(String)),
    warnings: Object.freeze([...(raw.warnings || [])].map(String)),
  };
}

function normalizeCandidate(raw, field) {
  if (!raw || typeof raw !== "object") throw new Error(`${field} is required`);
  const memberships = [...(raw.memberships || [])].map((x, i) =>
    normalizeMembership(x, `${field}.memberships[${i}]`),
  );
  if (!memberships.length) throw new Error(`${field}.memberships cannot be empty`);

  const seen = new Set();
  for (const membership of memberships) {
    const key = membership.strategyId;
    if (seen.has(key)) throw new Error(`${field} has duplicate strategy membership: ${key}`);
    seen.add(key);
  }

  return {
    symbol: requiredText(raw.symbol, `${field}.symbol`),
    companyName: raw.companyName ? requiredText(raw.companyName, `${field}.companyName`) : undefined,
    memberships,
    reasons: Object.freeze([...(raw.reasons || [])].map(String)),
    warnings: Object.freeze([...(raw.warnings || [])].map(String)),
  };
}

function mergeCandidate(base, incoming) {
  if (base.symbol !== incoming.symbol) throw new Error("cannot merge different symbols");
  const byStrategy = new Map(base.memberships.map((x) => [x.strategyId, x]));

  for (const next of incoming.memberships) {
    const existing = byStrategy.get(next.strategyId);
    if (!existing) {
      byStrategy.set(next.strategyId, next);
      continue;
    }

    if (existing.strategyVersion !== next.strategyVersion) {
      throw new Error(
        `conflicting strategy versions for ${base.symbol}/${next.strategyId}: ${existing.strategyVersion} vs ${next.strategyVersion}`,
      );
    }

    byStrategy.set(next.strategyId, {
      ...existing,
      globalPoolEligible: existing.globalPoolEligible || next.globalPoolEligible,
      activeMonitorEligible: existing.activeMonitorEligible || next.activeMonitorEligible,
      strategyValidity: next.strategyValidity,
      entryReadiness: next.entryReadiness,
      setupId: next.setupId || existing.setupId,
      decisionId: next.decisionId || existing.decisionId,
      strategyLocalRank: next.strategyLocalRank ?? existing.strategyLocalRank,
      strategyLocalRankVersion:
        next.strategyLocalRankVersion || existing.strategyLocalRankVersion,
      reasons: Object.freeze([...existing.reasons, ...next.reasons]),
      warnings: Object.freeze([...existing.warnings, ...next.warnings]),
    });
  }

  return {
    symbol: base.symbol,
    companyName: incoming.companyName || base.companyName,
    memberships: [...byStrategy.values()],
    reasons: Object.freeze([...base.reasons, ...incoming.reasons]),
    warnings: Object.freeze([...base.warnings, ...incoming.warnings]),
  };
}

function survivingMemberships(candidate) {
  return candidate.memberships.filter((x) => x.globalPoolEligible);
}

function compactCandidate(candidate, memberships = candidate.memberships) {
  return {
    symbol: candidate.symbol,
    companyName: candidate.companyName,
    memberships: Object.freeze([...memberships]),
    reasons: candidate.reasons,
    warnings: candidate.warnings,
  };
}

export function allocateGlobalCandidatePool({
  priorPool = [],
  newCandidates = [],
  globalMax = 12,
  orderingPolicyId,
  orderingPolicyVersion,
} = {}) {
  positiveInteger(globalMax, "globalMax");
  requiredText(orderingPolicyId, "orderingPolicyId");
  requiredText(orderingPolicyVersion, "orderingPolicyVersion");

  const priorBySymbol = new Map();
  for (let i = 0; i < priorPool.length; i += 1) {
    const candidate = normalizeCandidate(priorPool[i], `priorPool[${i}]`);
    if (priorBySymbol.has(candidate.symbol)) {
      throw new Error(`priorPool contains duplicate symbol: ${candidate.symbol}`);
    }
    priorBySymbol.set(candidate.symbol, candidate);
  }

  const retained = [];
  const removed = [];
  const retainedBySymbol = new Map();

  for (const candidate of priorBySymbol.values()) {
    const surviving = survivingMemberships(candidate);
    if (!surviving.length) {
      removed.push({
        symbol: candidate.symbol,
        reason: "NO_SURVIVING_STRATEGY_MEMBERSHIP",
        priorMemberships: Object.freeze([...candidate.memberships]),
      });
      continue;
    }

    const kept = compactCandidate(candidate, surviving);
    retained.push(kept);
    retainedBySymbol.set(candidate.symbol, kept);
  }

  if (retained.length > globalMax) {
    throw new Error(
      `retained pool invariant violation: ${retained.length} exceeds globalMax ${globalMax}`,
    );
  }

  const orderedNewUnique = [];
  const orderedBySymbol = new Map();

  for (let i = 0; i < newCandidates.length; i += 1) {
    const candidate = normalizeCandidate(newCandidates[i], `newCandidates[${i}]`);
    const surviving = survivingMemberships(candidate);
    if (!surviving.length) continue;
    const compact = compactCandidate(candidate, surviving);

    if (retainedBySymbol.has(compact.symbol)) {
      const merged = mergeCandidate(retainedBySymbol.get(compact.symbol), compact);
      const index = retained.findIndex((x) => x.symbol === compact.symbol);
      retained[index] = merged;
      retainedBySymbol.set(compact.symbol, merged);
      continue;
    }

    if (orderedBySymbol.has(compact.symbol)) {
      const merged = mergeCandidate(orderedBySymbol.get(compact.symbol), compact);
      orderedBySymbol.set(compact.symbol, merged);
      const index = orderedNewUnique.findIndex((x) => x.symbol === compact.symbol);
      orderedNewUnique[index] = merged;
      continue;
    }

    orderedBySymbol.set(compact.symbol, compact);
    orderedNewUnique.push(compact);
  }

  const vacancies = globalMax - retained.length;
  const admittedNew = orderedNewUnique.slice(0, vacancies);
  const capacityOverflow = orderedNewUnique.slice(vacancies).map((candidate) => ({
    ...candidate,
    capacityState: "CAPACITY_OVERFLOW",
    capacityReason: "GLOBAL_POOL_FULL",
  }));

  const globalPool = [...retained, ...admittedNew];

  return deepFreeze({
    globalMax,
    orderingPolicyId,
    orderingPolicyVersion,
    retainedCount: retained.length,
    admittedNewCount: admittedNew.length,
    globalCount: globalPool.length,
    vacancyCount: Math.max(0, globalMax - globalPool.length),
    globalPool,
    retained,
    removed,
    admittedNew,
    capacityOverflow,
  });
}

export function allocateActiveIntradayMonitors({
  globalPool,
  strategyOrders = {},
  perStrategyMax = 3,
} = {}) {
  positiveInteger(perStrategyMax, "perStrategyMax");
  if (!Array.isArray(globalPool)) throw new Error("globalPool must be an array");

  const bySymbol = new Map();
  for (let i = 0; i < globalPool.length; i += 1) {
    const candidate = normalizeCandidate(globalPool[i], `globalPool[${i}]`);
    if (bySymbol.has(candidate.symbol)) throw new Error(`globalPool duplicate symbol: ${candidate.symbol}`);
    bySymbol.set(candidate.symbol, candidate);
  }

  const assignments = {};
  const nonAssignments = {};

  for (const [strategyIdRaw, orderRaw] of Object.entries(strategyOrders || {})) {
    const strategyId = requiredText(strategyIdRaw, "strategyId");
    if (!Array.isArray(orderRaw)) throw new Error(`strategyOrders.${strategyId} must be an array`);

    const selected = [];
    const skipped = [];
    const seen = new Set();

    for (const symbolRaw of orderRaw) {
      const symbol = requiredText(symbolRaw, `strategyOrders.${strategyId}[]`);
      if (seen.has(symbol)) throw new Error(`duplicate symbol in strategy order ${strategyId}: ${symbol}`);
      seen.add(symbol);

      const candidate = bySymbol.get(symbol);
      if (!candidate) {
        skipped.push({ symbol, reason: "NOT_IN_GLOBAL_POOL" });
        continue;
      }

      const membership = candidate.memberships.find((x) => x.strategyId === strategyId);
      if (!membership) {
        skipped.push({ symbol, reason: "NO_STRATEGY_MEMBERSHIP" });
        continue;
      }

      if (membership.strategyValidity !== "VALID") {
        skipped.push({ symbol, reason: "STRATEGY_NOT_VALID" });
        continue;
      }

      if (!membership.activeMonitorEligible) {
        skipped.push({ symbol, reason: "ACTIVE_MONITOR_NOT_ELIGIBLE" });
        continue;
      }

      if (!ENTRY_PROXIMATE_STATES.has(membership.entryReadiness)) {
        skipped.push({ symbol, reason: "ENTRY_NOT_PROXIMATE" });
        continue;
      }

      if (selected.length >= perStrategyMax) {
        skipped.push({ symbol, reason: "STRATEGY_ACTIVE_MONITOR_CAPACITY" });
        continue;
      }

      selected.push({
        symbol,
        strategyId,
        strategyVersion: membership.strategyVersion,
        entryReadiness: membership.entryReadiness,
        decisionId: membership.decisionId,
        strategyLocalRank: membership.strategyLocalRank,
        strategyLocalRankVersion: membership.strategyLocalRankVersion,
      });
    }

    assignments[strategyId] = Object.freeze(selected);
    nonAssignments[strategyId] = Object.freeze(skipped);
  }

  const symbolStrategyCounts = {};
  for (const rows of Object.values(assignments)) {
    for (const row of rows) {
      symbolStrategyCounts[row.symbol] = (symbolStrategyCounts[row.symbol] || 0) + 1;
    }
  }

  return deepFreeze({
    perStrategyMax,
    assignments,
    nonAssignments,
    activeCountByStrategy: Object.fromEntries(
      Object.entries(assignments).map(([strategyId, rows]) => [strategyId, rows.length]),
    ),
    symbolStrategyCounts,
  });
}

export { ENTRY_PROXIMATE_STATES };
