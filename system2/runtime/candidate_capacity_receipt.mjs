import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

export async function buildCandidateCapacityReceipt({
  capacityRunId,
  marketDate,
  decisionTimestamp,
  capturedAt,
  globalAllocation,
  activeAllocation,
} = {}) {
  if (!globalAllocation || typeof globalAllocation !== "object") {
    throw new Error("globalAllocation is required");
  }
  if (!activeAllocation || typeof activeAllocation !== "object") {
    throw new Error("activeAllocation is required");
  }

  if (globalAllocation.globalCount > globalAllocation.globalMax) {
    throw new Error("global allocation exceeds globalMax");
  }

  for (const [strategyId, count] of Object.entries(
    activeAllocation.activeCountByStrategy || {},
  )) {
    if (count > activeAllocation.perStrategyMax) {
      throw new Error(`active allocation exceeds perStrategyMax for ${strategyId}`);
    }
  }

  const globalSymbols = new Set(
    (globalAllocation.globalPool || []).map((x) => String(x.symbol)),
  );

  for (const [strategyId, rows] of Object.entries(activeAllocation.assignments || {})) {
    for (const row of rows) {
      if (!globalSymbols.has(String(row.symbol))) {
        throw new Error(
          `active assignment ${strategyId}/${row.symbol} is not in global pool`,
        );
      }
    }
  }

  const base = {
    capacityRunId: requiredText(capacityRunId, "capacityRunId"),
    marketDate: requiredText(marketDate, "marketDate"),
    decisionTimestamp: requiredText(decisionTimestamp, "decisionTimestamp"),
    capturedAt: requiredText(capturedAt, "capturedAt"),
    globalMax: globalAllocation.globalMax,
    perStrategyMax: activeAllocation.perStrategyMax,
    orderingPolicyId: requiredText(
      globalAllocation.orderingPolicyId,
      "globalAllocation.orderingPolicyId",
    ),
    orderingPolicyVersion: requiredText(
      globalAllocation.orderingPolicyVersion,
      "globalAllocation.orderingPolicyVersion",
    ),
    retained: globalAllocation.retained || [],
    removed: globalAllocation.removed || [],
    admittedNew: globalAllocation.admittedNew || [],
    capacityOverflow: globalAllocation.capacityOverflow || [],
    globalPool: globalAllocation.globalPool || [],
    globalCount: globalAllocation.globalCount,
    vacancyCount: globalAllocation.vacancyCount,
    activeAssignments: activeAllocation.assignments || {},
    activeNonAssignments: activeAllocation.nonAssignments || {},
    activeCountByStrategy: activeAllocation.activeCountByStrategy || {},
    symbolStrategyCounts: activeAllocation.symbolStrategyCounts || {},
    schemaVersion: "S2_CAPACITY_V0_1",
  };

  const capacityHash = await sha256Hex(base);

  return deepFreeze({
    ...base,
    capacityHash,
  });
}
