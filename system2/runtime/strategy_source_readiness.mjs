import { deepFreeze } from "./factor_snapshot.mjs";

const HARD_SOURCE_BLOCKERS = new Set(["SOURCE_EXTENSION_REQUIRED", "SEMANTIC_GAP"]);
const LIMITED_SOURCE_STATES = new Set(["PIT_AUDIT_REQUIRED"]);

export function buildStrategySourceReadinessReceipt(contract) {
  if (!contract || typeof contract !== "object") throw new Error("strategy contract is required");

  const blocking = [];
  const limited = [];
  const nonBlockingGaps = [];

  for (const item of contract.evidenceFamilies || []) {
    const row = {
      family: item.family,
      role: item.role,
      dataReadiness: item.dataReadiness,
      unknownBlocksEligibility: item.unknownBlocksEligibility === true,
    };

    if (item.unknownBlocksEligibility && HARD_SOURCE_BLOCKERS.has(item.dataReadiness)) {
      blocking.push(row);
      continue;
    }

    if (item.unknownBlocksEligibility && LIMITED_SOURCE_STATES.has(item.dataReadiness)) {
      limited.push(row);
      continue;
    }

    if (
      !item.unknownBlocksEligibility &&
      (HARD_SOURCE_BLOCKERS.has(item.dataReadiness) || LIMITED_SOURCE_STATES.has(item.dataReadiness))
    ) {
      nonBlockingGaps.push(row);
    }
  }

  let sourceReadiness;
  if (blocking.length) sourceReadiness = "SOURCE_BLOCKED";
  else if (limited.length || nonBlockingGaps.length) sourceReadiness = "SOURCE_LIMITED";
  else sourceReadiness = "SOURCE_READY";

  return deepFreeze({
    strategyId: String(contract.strategyId),
    strategyVersion: String(contract.strategyVersion),
    sourceReadiness,
    blockingFamilies: blocking,
    limitedFamilies: limited,
    nonBlockingGaps,
    fullShadowSourceEligible: sourceReadiness === "SOURCE_READY",
    limitedProspectiveShadowSourceEligible: sourceReadiness !== "SOURCE_BLOCKED",
    warnings:
      sourceReadiness === "SOURCE_READY"
        ? Object.freeze([])
        : Object.freeze([
            "Source readiness does not authorize strategy weights, thresholds, promotion or real-money behavior.",
          ]),
  });
}

export function buildRegistrySourceReadinessReceipts(contracts) {
  if (!Array.isArray(contracts)) throw new Error("contracts must be an array");
  return deepFreeze(contracts.map(buildStrategySourceReadinessReceipt));
}
