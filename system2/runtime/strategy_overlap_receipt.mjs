import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const CORE_ROLES = new Set(["PRIMARY", "REQUIRED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function familySet(contract, roles = null) {
  const out = new Set();
  for (const row of contract?.evidenceFamilies || []) {
    if (!row?.family) continue;
    if (roles && !roles.has(row.role)) continue;
    out.add(String(row.family));
  }
  return out;
}

function sorted(set) {
  return [...set].sort();
}

function intersection(a, b) {
  return new Set([...a].filter((x) => b.has(x)));
}

function difference(a, b) {
  return new Set([...a].filter((x) => !b.has(x)));
}

function ratio(numerator, denominator) {
  if (!denominator) return null;
  return numerator / denominator;
}

export async function buildStrategyOverlapReceipt({
  receiptId,
  strategyAContract,
  strategyBContract,
  marketDate,
  decisionTimestamp,
  strategyAValid,
  strategyBValid,
  sameDecisionClock = true,
  capturedAt,
} = {}) {
  if (!strategyAContract || !strategyBContract) {
    throw new Error("strategyAContract and strategyBContract are required");
  }

  const aId = requiredText(strategyAContract.strategyId, "strategyAContract.strategyId");
  const bId = requiredText(strategyBContract.strategyId, "strategyBContract.strategyId");
  if (aId === bId) throw new Error("strategy overlap requires two different strategies");

  const aCore = familySet(strategyAContract, CORE_ROLES);
  const bCore = familySet(strategyBContract, CORE_ROLES);
  const aAll = familySet(strategyAContract);
  const bAll = familySet(strategyBContract);

  const sharedCore = intersection(aCore, bCore);
  const distinctCoreA = difference(aCore, bCore);
  const distinctCoreB = difference(bCore, aCore);
  const sharedAll = intersection(aAll, bAll);
  const unionCore = new Set([...aCore, ...bCore]);
  const unionAll = new Set([...aAll, ...bAll]);

  const independentSameClockValidity =
    strategyAValid === true &&
    strategyBValid === true &&
    sameDecisionClock === true;

  const base = {
    receiptId: requiredText(receiptId, "receiptId"),
    experimentId: "RANK-06",
    experimentVersion: "0.1",
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    strategyA: {
      strategyId: aId,
      strategyVersion: requiredText(
        strategyAContract.strategyVersion,
        "strategyAContract.strategyVersion",
      ),
      coreFamilies: Object.freeze(sorted(aCore)),
      allFamilies: Object.freeze(sorted(aAll)),
    },
    strategyB: {
      strategyId: bId,
      strategyVersion: requiredText(
        strategyBContract.strategyVersion,
        "strategyBContract.strategyVersion",
      ),
      coreFamilies: Object.freeze(sorted(bCore)),
      allFamilies: Object.freeze(sorted(bAll)),
    },
    sharedCoreFamilies: Object.freeze(sorted(sharedCore)),
    distinctCoreFamiliesA: Object.freeze(sorted(distinctCoreA)),
    distinctCoreFamiliesB: Object.freeze(sorted(distinctCoreB)),
    sharedAllFamilies: Object.freeze(sorted(sharedAll)),
    diagnostics: {
      coreJaccard: ratio(sharedCore.size, unionCore.size),
      allFamilyJaccard: ratio(sharedAll.size, unionAll.size),
      sharedCoreCount: sharedCore.size,
      distinctCoreCountA: distinctCoreA.size,
      distinctCoreCountB: distinctCoreB.size,
    },
    independentSameClockValidity,
    naiveStrategyCountBonusAllowed: false,
    overlapPriorityEffectAuthorized: false,
    researchState: "OVERLAP_MEASURED_NOT_VALIDATED",
    capturedAt: requiredText(capturedAt, "capturedAt"),
    schemaVersion: "S2_STRATEGY_OVERLAP_V0_1",
  };

  const overlapHash = await sha256Hex(base);
  return deepFreeze({ ...base, overlapHash });
}

export { CORE_ROLES };
