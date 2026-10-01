import { deepFreeze } from "./factor_snapshot.mjs";
import { buildRank01OrderingReceipt } from "./strategy_local_ranking_pipeline.mjs";
import { allocateGlobalCandidatePoolWithPriorityGate } from "./candidate_capacity_priority_gate.mjs";
import {
  allocateActiveIntradayMonitors,
  ENTRY_PROXIMATE_STATES,
} from "./candidate_capacity.mjs";
import { buildCandidateCapacityReceipt } from "./candidate_capacity_receipt.mjs";
import {
  toCapacityRunRow,
  toStrategyOrderingRow,
} from "./storage_rows.mjs";
import { buildSystem2PersistenceBatch } from "./persistence_batch.mjs";

export const DAILY_SHADOW_CAPACITY_ORCHESTRATOR_VERSION = "0.1-RESEARCH";
export const SYSTEM2_GLOBAL_CANDIDATE_MAX_V0_1 = 12;
export const SYSTEM2_PER_STRATEGY_ACTIVE_MAX_V0_1 = 3;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function parseJson(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  return JSON.parse(String(value));
}

function strategyRunIdentity(run, index, marketDate, decisionTimestamp) {
  if (!run || typeof run !== "object") throw new Error(`strategyRuns[${index}] is required`);
  if (run.marketDate !== marketDate) throw new Error(`strategyRuns[${index}].marketDate mismatch`);
  if (run.decisionTimestamp !== decisionTimestamp) {
    throw new Error(`strategyRuns[${index}].decisionTimestamp mismatch`);
  }
  if (run.bundle?.runReceipt?.runState !== "COMPLETE") {
    throw new Error(`strategyRuns[${index}] must have COMPLETE run accounting`);
  }
  if (run.finalSelectionEnabled !== false || run.scheduledCaptureActivated !== false) {
    throw new Error(`strategyRuns[${index}] cannot carry final selection or scheduled-capture authority`);
  }
  if (!Array.isArray(run.rankingInputs)) {
    throw new Error(`strategyRuns[${index}].rankingInputs are required`);
  }
  return {
    strategyId: requiredText(run.bundle?.strategyId ?? run.strategyId, `strategyRuns[${index}].strategyId`),
    strategyVersion: requiredText(
      run.bundle?.strategyVersion ?? run.strategyVersion,
      `strategyRuns[${index}].strategyVersion`,
    ),
  };
}

function decisionMapForRun(run) {
  const map = new Map();
  for (const row of run.rankingInputs || []) {
    const symbol = requiredText(row?.symbol, "rankingInputs[].symbol");
    if (map.has(symbol)) throw new Error(`duplicate ranking input symbol: ${symbol}`);
    map.set(symbol, row);
  }
  return map;
}

function priorPoolFromCapacity(priorCapacityRow) {
  if (!priorCapacityRow) return [];
  const raw = priorCapacityRow.globalPool ?? priorCapacityRow.global_pool_json;
  const rows = parseJson(raw, []);
  if (!Array.isArray(rows)) throw new Error("prior capacity global pool must be an array");
  return rows;
}

function priorCapacityMarketDate(priorCapacityRow) {
  if (!priorCapacityRow) return null;
  return priorCapacityRow.marketDate ?? priorCapacityRow.market_date ?? null;
}

function rankBySymbol(orderingReceipt) {
  return new Map(
    (orderingReceipt?.orderedCandidates || []).map((row) => [String(row.symbol), row]),
  );
}

function makeMembership({
  strategyId,
  strategyVersion,
  input,
  rankRow = null,
  globalPoolEligible,
  activeMonitorEligible,
  reasons = [],
  warnings = [],
}) {
  return {
    strategyId,
    strategyVersion,
    strategyValidity: requiredText(input.strategyValidity, "strategyValidity"),
    entryReadiness: requiredText(input.entryReadiness, "entryReadiness"),
    decisionId: requiredText(input.decisionId, "decisionId"),
    globalPoolEligible: globalPoolEligible === true,
    activeMonitorEligible: activeMonitorEligible === true,
    strategyLocalRank: rankRow?.strategyLocalRank ?? null,
    strategyLocalRankVersion: rankRow?.strategyLocalRankVersion || undefined,
    reasons: Object.freeze([...reasons]),
    warnings: Object.freeze([
      ...(input.warnings || []).map(String),
      ...warnings.map(String),
    ]),
  };
}

function revalidatePriorPool({
  priorPool,
  runByStrategy,
  decisionMaps,
  globalRankMaps,
}) {
  const blockers = [];
  const rows = [];

  for (const candidate of priorPool) {
    const symbol = requiredText(candidate?.symbol, "priorPool[].symbol");
    const memberships = [];

    for (const priorMembership of candidate.memberships || []) {
      const strategyId = requiredText(priorMembership?.strategyId, "prior membership strategyId");
      const run = runByStrategy.get(strategyId);
      if (!run) {
        blockers.push({
          code: "PRIOR_STRATEGY_NOT_REVALIDATED",
          symbol,
          strategyId,
        });
        continue;
      }

      const current = decisionMaps.get(strategyId)?.get(symbol);
      const excluded = run.exclusions?.[symbol];

      if (!current) {
        if (excluded?.excluded === true) {
          memberships.push({
            strategyId,
            strategyVersion: requiredText(
              priorMembership.strategyVersion,
              "prior membership strategyVersion",
            ),
            strategyValidity: "INVALIDATED",
            entryReadiness: "BLOCKED",
            decisionId: priorMembership.decisionId || `EXCLUDED:${strategyId}:${symbol}`,
            globalPoolEligible: false,
            activeMonitorEligible: false,
            strategyLocalRank: null,
            reasons: Object.freeze([
              "GLOBAL_UNIVERSE_INELIGIBLE",
              ...(excluded.reasons || []).map(String),
            ]),
            warnings: Object.freeze([]),
          });
          continue;
        }

        blockers.push({
          code: "PRIOR_MEMBERSHIP_DECISION_MISSING",
          symbol,
          strategyId,
        });
        continue;
      }

      const validity = current.strategyValidity;
      const rankRow = globalRankMaps.get(strategyId)?.get(symbol) || null;
      const invalidated = validity === "INVALIDATED";
      const preserveOnIncomplete = validity === "INCOMPLETE";
      const globalPoolEligible = !invalidated;
      const activeMonitorEligible =
        validity === "VALID" && ENTRY_PROXIMATE_STATES.has(current.entryReadiness);

      memberships.push(makeMembership({
        strategyId,
        strategyVersion: current.strategyVersion,
        input: current,
        rankRow,
        globalPoolEligible,
        activeMonitorEligible,
        reasons: [
          invalidated
            ? "PRIOR_MEMBERSHIP_INVALIDATED"
            : preserveOnIncomplete
              ? "PRIOR_MEMBERSHIP_RETAINED_NO_NEGATIVE_INFERENCE_FROM_UNKNOWN"
              : "PRIOR_MEMBERSHIP_REVALIDATED",
        ],
        warnings: preserveOnIncomplete
          ? ["SOURCE_INCOMPLETE_RETAINED_BUT_NOT_ACTIVE_MONITOR_ELIGIBLE"]
          : [],
      }));
    }

    rows.push({
      symbol,
      companyName: candidate.companyName || undefined,
      memberships,
      reasons: Object.freeze([...(candidate.reasons || []).map(String)]),
      warnings: Object.freeze([...(candidate.warnings || []).map(String)]),
    });
  }

  return {
    blockers: Object.freeze(blockers),
    priorPool: Object.freeze(rows),
  };
}

function buildNewCandidates({
  strategyRuns,
  runIdentities,
  globalRankMaps,
  priorSymbols,
}) {
  const rows = [];
  const diagnostics = [];

  for (let i = 0; i < strategyRuns.length; i += 1) {
    const run = strategyRuns[i];
    const { strategyId, strategyVersion } = runIdentities[i];
    const rankMap = globalRankMaps.get(strategyId);

    for (const input of run.rankingInputs) {
      const symbol = String(input.symbol);
      if (priorSymbols.has(symbol)) continue;

      const qualified =
        input.strategyValidity === "VALID" &&
        input.entryReadiness === "BUY_ELIGIBLE";
      const rankRow = rankMap?.get(symbol) || null;

      if (!qualified) {
        diagnostics.push({
          symbol,
          strategyId,
          state: "NOT_NEW_ADMISSION_QUALIFIED",
          strategyValidity: input.strategyValidity,
          entryReadiness: input.entryReadiness,
        });
        continue;
      }
      if (!rankRow) {
        diagnostics.push({
          symbol,
          strategyId,
          state: "NEW_ADMISSION_RANKING_INPUT_INCOMPLETE",
        });
        continue;
      }

      rows.push({
        symbol,
        companyName: input.companyName || undefined,
        memberships: [
          makeMembership({
            strategyId,
            strategyVersion,
            input,
            rankRow,
            globalPoolEligible: true,
            activeMonitorEligible: true,
            reasons: ["NEW_ADMISSION_BUY_ELIGIBLE_AND_RANKABLE"],
          }),
        ],
        reasons: Object.freeze(["LIMITED_SHADOW_NEW_ADMISSION_V0_1"]),
        warnings: Object.freeze([]),
      });
    }
  }

  return {
    newCandidates: Object.freeze(rows),
    diagnostics: Object.freeze(diagnostics),
  };
}

export async function buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId,
  persistenceBatchId,
  marketDate,
  decisionTimestamp,
  capturedAt,
  strategyRuns = [],
  priorCapacityRow = null,
} = {}) {
  const date = requiredText(marketDate, "marketDate");
  const clock = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  const captured = assertTimestamp(capturedAt, "capturedAt");
  if (Date.parse(captured) < Date.parse(clock)) {
    throw new Error("capturedAt cannot be earlier than decisionTimestamp");
  }
  if (!Array.isArray(strategyRuns) || strategyRuns.length === 0) {
    throw new Error("strategyRuns must contain at least one completed strategy run");
  }

  const priorDate = priorCapacityMarketDate(priorCapacityRow);
  if (priorDate && priorDate >= date) {
    throw new Error("priorCapacityRow must be from an earlier market date");
  }

  const identities = strategyRuns.map((run, index) =>
    strategyRunIdentity(run, index, date, clock),
  );
  const seenStrategies = new Set();
  const runByStrategy = new Map();
  const decisionMaps = new Map();
  for (let i = 0; i < strategyRuns.length; i += 1) {
    const id = identities[i].strategyId;
    if (seenStrategies.has(id)) throw new Error(`duplicate strategy run: ${id}`);
    seenStrategies.add(id);
    runByStrategy.set(id, strategyRuns[i]);
    decisionMaps.set(id, decisionMapForRun(strategyRuns[i]));
  }

  const globalOrdering = new Map();
  const activeOrdering = new Map();
  const orderingReceipts = [];

  for (let i = 0; i < strategyRuns.length; i += 1) {
    const run = strategyRuns[i];
    const { strategyId, strategyVersion } = identities[i];

    const global = await buildRank01OrderingReceipt({
      orderingReceiptId: `${capacityRunId}|ORDER|${strategyId}|GLOBAL_ADMISSION|RANK01`,
      purpose: "GLOBAL_ADMISSION",
      strategyId,
      strategyVersion,
      marketDate: date,
      decisionTimestamp: clock,
      candidates: run.rankingInputs,
      capturedAt: captured,
    });
    const active = await buildRank01OrderingReceipt({
      orderingReceiptId: `${capacityRunId}|ORDER|${strategyId}|ACTIVE_INTRADAY_MONITOR|RANK01`,
      purpose: "ACTIVE_INTRADAY_MONITOR",
      strategyId,
      strategyVersion,
      marketDate: date,
      decisionTimestamp: clock,
      candidates: run.rankingInputs,
      capturedAt: captured,
    });
    globalOrdering.set(strategyId, global.orderingReceipt);
    activeOrdering.set(strategyId, active.orderingReceipt);
    orderingReceipts.push(global.orderingReceipt, active.orderingReceipt);
  }

  const globalRankMaps = new Map(
    [...globalOrdering.entries()].map(([strategyId, receipt]) => [
      strategyId,
      rankBySymbol(receipt),
    ]),
  );

  const priorPoolRaw = priorPoolFromCapacity(priorCapacityRow);
  const priorRevalidation = revalidatePriorPool({
    priorPool: priorPoolRaw,
    runByStrategy,
    decisionMaps,
    globalRankMaps,
  });

  const orderingRecords = orderingReceipts.map((receipt) => ({
    table: "s2_strategy_ordering_receipts",
    row: toStrategyOrderingRow(receipt),
  }));

  if (priorRevalidation.blockers.length) {
    const persistenceBatch = await buildSystem2PersistenceBatch({
      batchId: requiredText(persistenceBatchId, "persistenceBatchId"),
      marketDate: date,
      decisionTimestamp: clock,
      records: orderingRecords,
      createdAt: captured,
    });
    return deepFreeze({
      state: "CAPACITY_BLOCKED_PRIOR_REVALIDATION_GAP",
      marketDate: date,
      decisionTimestamp: clock,
      strategyCount: strategyRuns.length,
      blockers: priorRevalidation.blockers,
      orderingReceipts: Object.freeze(orderingReceipts),
      capacityReceipt: null,
      persistenceBatch,
      finalSelectionEnabled: false,
      crossStrategyGlobalPriorityAuthorized: false,
      schemaVersion: "S2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1",
    });
  }

  const priorSymbols = new Set(priorRevalidation.priorPool.map((row) => row.symbol));
  const next = buildNewCandidates({
    strategyRuns,
    runIdentities: identities,
    globalRankMaps,
    priorSymbols,
  });

  const gated = allocateGlobalCandidatePoolWithPriorityGate({
    priorPool: priorRevalidation.priorPool,
    newCandidates: next.newCandidates,
    globalMax: SYSTEM2_GLOBAL_CANDIDATE_MAX_V0_1,
    globalPriorityPolicy: null,
  });

  if (!gated.globalPriorityResolved || !gated.allocation) {
    const persistenceBatch = await buildSystem2PersistenceBatch({
      batchId: requiredText(persistenceBatchId, "persistenceBatchId"),
      marketDate: date,
      decisionTimestamp: clock,
      records: orderingRecords,
      createdAt: captured,
    });
    return deepFreeze({
      state: "CAPACITY_BLOCKED_GLOBAL_PRIORITY_UNRESOLVED",
      marketDate: date,
      decisionTimestamp: clock,
      strategyCount: strategyRuns.length,
      blockers: Object.freeze([{
        code: "GLOBAL_PRIORITY_UNRESOLVED",
        eligibleNewUniqueCount: gated.eligibleNewUniqueCount,
        competingVacancyCount: gated.competingVacancyCount,
        deferredSymbols: gated.deferredSymbols,
      }]),
      orderingReceipts: Object.freeze(orderingReceipts),
      newCandidateDiagnostics: next.diagnostics,
      capacityReceipt: null,
      persistenceBatch,
      finalSelectionEnabled: false,
      crossStrategyGlobalPriorityAuthorized: false,
      schemaVersion: "S2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1",
    });
  }

  const strategyOrders = Object.fromEntries(
    [...activeOrdering.entries()].map(([strategyId, receipt]) => [
      strategyId,
      receipt.orderedCandidates.map((row) => row.symbol),
    ]),
  );
  const activeAllocation = allocateActiveIntradayMonitors({
    globalPool: gated.allocation.globalPool,
    strategyOrders,
    perStrategyMax: SYSTEM2_PER_STRATEGY_ACTIVE_MAX_V0_1,
  });

  const capacityReceipt = await buildCandidateCapacityReceipt({
    capacityRunId: requiredText(capacityRunId, "capacityRunId"),
    marketDate: date,
    decisionTimestamp: clock,
    capturedAt: captured,
    globalAllocation: gated.allocation,
    activeAllocation,
  });

  const persistenceBatch = await buildSystem2PersistenceBatch({
    batchId: requiredText(persistenceBatchId, "persistenceBatchId"),
    marketDate: date,
    decisionTimestamp: clock,
    records: [
      ...orderingRecords,
      { table: "s2_capacity_runs", row: toCapacityRunRow(capacityReceipt) },
    ],
    createdAt: captured,
  });

  return deepFreeze({
    state: capacityReceipt.globalCount === 0
      ? "CAPACITY_ZERO_PICK_READY"
      : "CAPACITY_READY",
    marketDate: date,
    decisionTimestamp: clock,
    strategyCount: strategyRuns.length,
    orderingReceipts: Object.freeze(orderingReceipts),
    newCandidateDiagnostics: next.diagnostics,
    priorPoolRevalidatedCount: priorRevalidation.priorPool.length,
    allocationState: gated.allocationState,
    capacityReceipt,
    persistenceBatch,
    finalSelectionEnabled: false,
    crossStrategyGlobalPriorityAuthorized: false,
    livePushEnabled: false,
    orderImpact: false,
    schemaVersion: "S2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1",
  });
}
