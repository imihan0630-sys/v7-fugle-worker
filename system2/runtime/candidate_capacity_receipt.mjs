import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const CAPACITY_DENOMINATOR_PROVENANCE_VERSION = "S2_SELECTION_DENOMINATOR_PROVENANCE_V0_1";
const DENOMINATOR_STATES = new Set(["COMPLETE", "PARTIAL", "UNKNOWN"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function optionalHash(value, field) {
  if (value === null || value === undefined || value === "") return null;
  const text = requiredText(value, field);
  if (!/^[a-f0-9]{64}$/.test(text)) throw new Error(`${field} must be a sha256 hex hash`);
  return text;
}

function normalizeUnresolvedByState(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return Object.freeze({});
  const out = {};
  for (const [key, raw] of Object.entries(value)) {
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0) throw new Error(`selectionDenominator.unresolvedByState.${key} must be a non-negative integer`);
    out[String(key)] = n;
  }
  return Object.freeze(out);
}

function normalizeContributingRuns(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  const rows = value.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error(`contributingShadowRuns[${index}] is required`);
    return Object.freeze({
      strategyId: requiredText(row.strategyId, `contributingShadowRuns[${index}].strategyId`),
      strategyVersion: requiredText(row.strategyVersion, `contributingShadowRuns[${index}].strategyVersion`),
      runId: requiredText(row.runId, `contributingShadowRuns[${index}].runId`),
      shadowAccountingHash: optionalHash(
        row.shadowAccountingHash,
        `contributingShadowRuns[${index}].shadowAccountingHash`,
      ) || (() => { throw new Error(`contributingShadowRuns[${index}].shadowAccountingHash is required`); })(),
      runFingerprintHash: optionalHash(
        row.runFingerprintHash,
        `contributingShadowRuns[${index}].runFingerprintHash`,
      ),
    });
  });
  rows.sort((a, b) =>
    a.strategyId.localeCompare(b.strategyId)
    || a.strategyVersion.localeCompare(b.strategyVersion)
    || a.runId.localeCompare(b.runId)
  );
  return Object.freeze(rows);
}

async function buildDenominatorProvenance(selectionDenominator) {
  const input = selectionDenominator && typeof selectionDenominator === "object"
    ? selectionDenominator
    : {};
  const state = DENOMINATOR_STATES.has(input.state) ? input.state : "UNKNOWN";
  const unresolvedCount = input.unresolvedCount === null || input.unresolvedCount === undefined
    ? null
    : Number(input.unresolvedCount);
  if (unresolvedCount !== null && (!Number.isInteger(unresolvedCount) || unresolvedCount < 0)) {
    throw new Error("selectionDenominator.unresolvedCount must be null or a non-negative integer");
  }
  const unresolvedByState = normalizeUnresolvedByState(input.unresolvedByState);
  const blockerCodes = Object.freeze(
    Array.isArray(input.blockerCodes)
      ? [...new Set(input.blockerCodes.map((x, i) => requiredText(String(x), `selectionDenominator.blockerCodes[${i}]`)))].sort()
      : [],
  );
  const contributingShadowRuns = normalizeContributingRuns(input.contributingShadowRuns);
  const legacyOrMissing = !selectionDenominator || contributingShadowRuns.length === 0;
  const effectiveState = legacyOrMissing ? "UNKNOWN" : state;
  const effectiveBlockers = legacyOrMissing
    ? Object.freeze([...new Set([...blockerCodes, "DENOMINATOR_PROVENANCE_NOT_PROVIDED"])].sort())
    : blockerCodes;
  const base = {
    version: CAPACITY_DENOMINATOR_PROVENANCE_VERSION,
    denominatorState: effectiveState,
    unresolvedCount,
    unresolvedByState,
    blockerCodes: effectiveBlockers,
    contributingShadowRuns,
  };
  const provenanceHash = await sha256Hex(base);
  return deepFreeze({ ...base, provenanceHash });
}

export async function buildCandidateCapacityReceipt({
  capacityRunId,
  marketDate,
  decisionTimestamp,
  capturedAt,
  globalAllocation,
  activeAllocation,
  selectionDenominator = null,
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

  const denominatorProvenance = await buildDenominatorProvenance(selectionDenominator);
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
    selectionDenominator: denominatorProvenance,
    schemaVersion: "S2_CAPACITY_V0_2",
  };

  const capacityHash = await sha256Hex(base);

  return deepFreeze({
    ...base,
    capacityHash,
  });
}
