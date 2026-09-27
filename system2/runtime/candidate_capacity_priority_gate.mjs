import { deepFreeze } from "./factor_snapshot.mjs";
import { allocateGlobalCandidatePool } from "./candidate_capacity.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function eligibleNewSymbols(newCandidates, retainedSymbols) {
  const out = [];
  const seen = new Set();
  for (const candidate of newCandidates || []) {
    const symbol = requiredText(candidate?.symbol, "newCandidates[].symbol");
    if (retainedSymbols.has(symbol) || seen.has(symbol)) continue;
    const hasEligibleMembership = (candidate.memberships || []).some(
      (x) => x?.globalPoolEligible === true,
    );
    if (!hasEligibleMembership) continue;
    seen.add(symbol);
    out.push(symbol);
  }
  return out;
}

function reorderCandidateRowsBySymbol(newCandidates, orderedSymbols) {
  const groups = new Map();
  for (const row of newCandidates || []) {
    const symbol = requiredText(row?.symbol, "newCandidates[].symbol");
    if (!groups.has(symbol)) groups.set(symbol, []);
    groups.get(symbol).push(row);
  }

  const out = [];
  for (const symbol of orderedSymbols) {
    for (const row of groups.get(symbol) || []) out.push(row);
  }
  return out;
}

export function validateGlobalPriorityPolicy(policy, eligibleSymbols) {
  if (!policy || typeof policy !== "object") throw new Error("globalPriorityPolicy is required");
  const id = requiredText(policy.id, "globalPriorityPolicy.id");
  const version = requiredText(policy.version, "globalPriorityPolicy.version");
  if (!Array.isArray(policy.orderedSymbols)) {
    throw new Error("globalPriorityPolicy.orderedSymbols must be an array");
  }

  const orderedSymbols = policy.orderedSymbols.map((x, i) =>
    requiredText(x, `globalPriorityPolicy.orderedSymbols[${i}]`),
  );
  const unique = new Set(orderedSymbols);
  if (unique.size !== orderedSymbols.length) {
    throw new Error("globalPriorityPolicy.orderedSymbols contains duplicates");
  }

  const expected = new Set(eligibleSymbols);
  if (unique.size !== expected.size) {
    throw new Error("global priority policy must order every eligible competing symbol exactly once");
  }
  for (const symbol of expected) {
    if (!unique.has(symbol)) {
      throw new Error(`global priority policy missing symbol: ${symbol}`);
    }
  }

  return { id, version, orderedSymbols };
}

export function allocateGlobalCandidatePoolWithPriorityGate({
  priorPool = [],
  newCandidates = [],
  globalMax = 12,
  globalPriorityPolicy = null,
} = {}) {
  const retention = allocateGlobalCandidatePool({
    priorPool,
    newCandidates: [],
    globalMax,
    orderingPolicyId: "RETENTION_ONLY",
    orderingPolicyVersion: "0.1",
  });

  const retainedSymbols = new Set(retention.globalPool.map((x) => x.symbol));
  const eligibleSymbols = eligibleNewSymbols(newCandidates, retainedSymbols);

  if (eligibleSymbols.length <= retention.vacancyCount) {
    const allocation = allocateGlobalCandidatePool({
      priorPool,
      newCandidates,
      globalMax,
      orderingPolicyId: "NO_SCARCITY_ALL_ELIGIBLE_ADMITTED",
      orderingPolicyVersion: "0.1",
    });

    return deepFreeze({
      allocationState: "ALLOCATED_NO_SCARCITY",
      scarcity: false,
      eligibleNewUniqueCount: eligibleSymbols.length,
      competingVacancyCount: retention.vacancyCount,
      globalPriorityResolved: true,
      globalPriorityPolicy: null,
      allocation,
      deferredSymbols: Object.freeze([]),
    });
  }

  if (!globalPriorityPolicy) {
    return deepFreeze({
      allocationState: "GLOBAL_PRIORITY_UNRESOLVED",
      scarcity: true,
      eligibleNewUniqueCount: eligibleSymbols.length,
      competingVacancyCount: retention.vacancyCount,
      globalPriorityResolved: false,
      globalPriorityPolicy: null,
      retentionOnly: retention,
      allocation: null,
      deferredSymbols: Object.freeze([...eligibleSymbols]),
    });
  }

  const policy = validateGlobalPriorityPolicy(globalPriorityPolicy, eligibleSymbols);
  const orderedRows = reorderCandidateRowsBySymbol(newCandidates, policy.orderedSymbols);
  const allocation = allocateGlobalCandidatePool({
    priorPool,
    newCandidates: orderedRows,
    globalMax,
    orderingPolicyId: policy.id,
    orderingPolicyVersion: policy.version,
  });

  return deepFreeze({
    allocationState: "ALLOCATED_WITH_GLOBAL_PRIORITY",
    scarcity: true,
    eligibleNewUniqueCount: eligibleSymbols.length,
    competingVacancyCount: retention.vacancyCount,
    globalPriorityResolved: true,
    globalPriorityPolicy: policy,
    allocation,
    deferredSymbols: Object.freeze([]),
  });
}
