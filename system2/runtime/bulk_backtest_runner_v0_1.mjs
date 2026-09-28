import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildPitReplayWindow } from "./pit_replay_v0_1.mjs";
import { buildA1HistoryPrimitiveBundle } from "./a1_history_primitives_v0_1.mjs";

export const BULK_BACKTEST_VERSION = "0.1-RESEARCH";

const CANDIDATE_STATES = new Set([
  "SELECTED",
  "QUALIFIED_NOT_SELECTED",
  "REJECTED",
  "INCOMPLETE",
  "WATCH",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function assertDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function positiveInteger(value, field, defaultValue) {
  const n = value === undefined || value === null ? defaultValue : Number(value);
  if (!Number.isInteger(n) || n < 1) throw new Error(field + " must be a positive integer");
  return n;
}

function partition(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

function uniqueSortedDates(values) {
  if (!Array.isArray(values) || !values.length) throw new Error("marketDates must be a non-empty array");
  const dates = values.map((x, i) => assertDate(x, "marketDates[" + i + "]"));
  if (new Set(dates).size !== dates.length) throw new Error("marketDates contains duplicates");
  return dates.sort();
}

function normalizeUniverse(rows, marketDate) {
  if (!Array.isArray(rows)) throw new Error("loadUniverse must return an array");
  const seen = new Set();
  return rows.map((row, i) => {
    if (!row || typeof row !== "object") throw new Error("universe row must be an object");
    const symbol = requiredText(row.symbol, "universe[" + i + "].symbol");
    if (seen.has(symbol)) throw new Error("duplicate universe symbol on " + marketDate + ": " + symbol);
    seen.add(symbol);
    return {
      symbol,
      companyName: row.companyName ? String(row.companyName).trim() : null,
      market: row.market ? String(row.market).trim() : null,
      excluded: row.excluded === true,
      exclusionReasons: Object.freeze([...(row.exclusionReasons || [])].map(String)),
    };
  });
}

function validateEvaluation(result, selectionAuthorized) {
  if (!result || typeof result !== "object") throw new Error("evaluateSymbol must return an object");
  const candidateState = requiredText(result.candidateState, "evaluation.candidateState");
  if (!CANDIDATE_STATES.has(candidateState)) {
    throw new Error("unsupported candidateState: " + candidateState);
  }
  if (candidateState === "SELECTED" && selectionAuthorized !== true) {
    throw new Error("SELECTED generation is not authorized for this backtest plan");
  }
  return {
    candidateState,
    importantRejected: result.importantRejected === true,
    reasons: Object.freeze([...(result.reasons || [])].map(String)),
    warnings: Object.freeze([...(result.warnings || [])].map(String)),
    rank: Number.isFinite(result.rank) ? result.rank : null,
    totalScore: Number.isFinite(result.totalScore) ? result.totalScore : null,
    strategyValidity: result.strategyValidity || null,
    entryReadiness: result.entryReadiness || null,
    regime: result.regime || null,
    entryPlan: result.entryPlan || null,
    thesis: result.thesis || null,
    invalidation: result.invalidation || null,
    extra: result.extra || null,
  };
}

export async function buildBulkBacktestPlanV0_1({
  runId,
  datasetVersion,
  strategyId,
  strategyVersion,
  policyId = "UNAUTHORIZED_RESEARCH_POLICY",
  policyVersion = "0",
  factorBundleVersion = "A1_HISTORY_PRIMITIVE_0.1",
  marketDates,
  decisionClockByDate,
  lookbackSessions = 61,
  symbolPartitionSize = 200,
  selectionPolicyAuthorized = false,
  createdAt,
} = {}) {
  const dates = uniqueSortedDates(marketDates);
  if (!decisionClockByDate || typeof decisionClockByDate !== "object") {
    throw new Error("decisionClockByDate is required");
  }
  const clocks = {};
  for (const date of dates) {
    clocks[date] = assertTimestamp(decisionClockByDate[date], "decisionClockByDate." + date);
  }

  const base = {
    runId: requiredText(runId, "runId"),
    datasetVersion: requiredText(datasetVersion, "datasetVersion"),
    strategyId: requiredText(strategyId, "strategyId"),
    strategyVersion: requiredText(strategyVersion, "strategyVersion"),
    policyId: requiredText(policyId, "policyId"),
    policyVersion: requiredText(policyVersion, "policyVersion"),
    factorBundleVersion: requiredText(factorBundleVersion, "factorBundleVersion"),
    marketDates: Object.freeze(dates),
    firstMarketDate: dates[0],
    lastMarketDate: dates.at(-1),
    decisionClockByDate: deepFreeze(clocks),
    lookbackSessions: positiveInteger(lookbackSessions, "lookbackSessions", 61),
    symbolPartitionSize: positiveInteger(symbolPartitionSize, "symbolPartitionSize", 200),
    hardSymbolLimit: null,
    selectionPolicyAuthorized: selectionPolicyAuthorized === true,
    executionMode: "FULL_UNIVERSE_PARTITIONED",
    createdAt: assertTimestamp(createdAt, "createdAt"),
    schemaVersion: "S2_BULK_BACKTEST_PLAN_V0_1",
  };
  const planHash = await sha256Hex(base);
  return deepFreeze({ ...base, planHash });
}

async function buildCheckpoint({
  plan,
  completedDates,
  processedSampleCount,
  stateCounts,
  rollingDigest,
  capturedAt,
}) {
  const base = {
    runId: plan.runId,
    planHash: plan.planHash,
    completedDates: Object.freeze([...completedDates].sort()),
    completedThroughDate: [...completedDates].sort().at(-1) || null,
    processedSampleCount,
    stateCounts: deepFreeze({ ...stateCounts }),
    rollingDigest,
    capturedAt,
    schemaVersion: "S2_BULK_BACKTEST_CHECKPOINT_V0_1",
  };
  const checkpointHash = await sha256Hex(base);
  return deepFreeze({ ...base, checkpointHash });
}

function checkpointCompletedDates(resumeCheckpoint, plan) {
  if (!resumeCheckpoint) return new Set();
  if (resumeCheckpoint.runId !== plan.runId) throw new Error("resume checkpoint runId mismatch");
  if (resumeCheckpoint.planHash !== plan.planHash) throw new Error("resume checkpoint planHash mismatch");
  return new Set((resumeCheckpoint.completedDates || []).map(String));
}

export async function runBulkBacktestV0_1({
  plan,
  loadUniverse,
  loadHistoricalBars,
  evaluateSymbol,
  onPartition = null,
  onCheckpoint = null,
  resumeCheckpoint = null,
  retainSamplesInMemory = false,
  capturedAt,
} = {}) {
  if (!plan || plan.schemaVersion !== "S2_BULK_BACKTEST_PLAN_V0_1") {
    throw new Error("valid backtest plan is required");
  }
  if (typeof loadUniverse !== "function") throw new Error("loadUniverse callback is required");
  if (typeof loadHistoricalBars !== "function") throw new Error("loadHistoricalBars callback is required");
  if (typeof evaluateSymbol !== "function") throw new Error("evaluateSymbol callback is required");
  if (onPartition !== null && typeof onPartition !== "function") throw new Error("onPartition must be a function");
  if (onCheckpoint !== null && typeof onCheckpoint !== "function") throw new Error("onCheckpoint must be a function");

  const captureTime = assertTimestamp(capturedAt, "capturedAt");
  const completedDates = checkpointCompletedDates(resumeCheckpoint, plan);
  const retainedSamples = [];
  const dateSummaries = [];
  const stateCounts = { ...(resumeCheckpoint?.stateCounts || {}) };
  let processedSampleCount = Number(resumeCheckpoint?.processedSampleCount || 0);
  let rollingDigest = resumeCheckpoint?.rollingDigest || await sha256Hex({
    runId: plan.runId,
    planHash: plan.planHash,
    seed: "S2_BACKTEST_ROLLING_DIGEST_V0_1",
  });
  let latestCheckpoint = resumeCheckpoint || null;

  for (const marketDate of plan.marketDates) {
    if (completedDates.has(marketDate)) continue;
    const decisionTimestamp = plan.decisionClockByDate[marketDate];
    const universe = normalizeUniverse(
      await loadUniverse({ marketDate, decisionTimestamp, plan }),
      marketDate,
    );
    const eligible = universe.filter((x) => !x.excluded);
    const excludedCount = universe.length - eligible.length;
    const dateStateCounts = {};
    let dateSampleCount = 0;
    let selectedCount = 0;

    const symbolPartitions = partition(eligible, plan.symbolPartitionSize);
    for (let partitionIndex = 0; partitionIndex < symbolPartitions.length; partitionIndex += 1) {
      const members = symbolPartitions[partitionIndex];
      const partitionSamples = await Promise.all(members.map(async (member) => {
        const historicalBars = await loadHistoricalBars({
          symbol: member.symbol,
          market: member.market,
          marketDate,
          decisionTimestamp,
          lookbackSessions: plan.lookbackSessions,
          priceSpace: "RAW",
          plan,
        });

        const replayWindow = await buildPitReplayWindow({
          replayId: plan.runId + "|" + marketDate + "|" + member.symbol,
          symbol: member.symbol,
          marketDate,
          decisionTimestamp,
          priceSpace: "RAW",
          lookbackSessions: plan.lookbackSessions,
          historicalBars,
        });

        if (replayWindow.state !== "READY") {
          const incompleteBase = {
            runId: plan.runId,
            marketDate,
            decisionTimestamp,
            symbol: member.symbol,
            companyName: member.companyName,
            market: member.market,
            strategyId: plan.strategyId,
            strategyVersion: plan.strategyVersion,
            policyId: plan.policyId,
            policyVersion: plan.policyVersion,
            candidateState: "INCOMPLETE",
            importantRejected: false,
            reasons: replayWindow.blockerCodes,
            warnings: [],
            rank: null,
            totalScore: null,
            strategyValidity: "INCOMPLETE",
            entryReadiness: "BLOCKED",
            regime: null,
            entryPlan: null,
            thesis: null,
            invalidation: null,
            factorBundleHash: null,
            factorBundleVersion: plan.factorBundleVersion,
            coreMetrics: null,
            factorObservations: [],
            pitReplayHash: replayWindow.replayHash,
            pitReplayState: replayWindow.state,
            sourceAvailableAt: null,
          };
          const sampleHash = await sha256Hex(incompleteBase);
          return deepFreeze({ ...incompleteBase, sampleId: "S2BT-" + sampleHash, sampleHash });
        }

        const latestBar = replayWindow.bars.at(-1);
        const continuityState = latestBar?.continuityState || "UNVERIFIED";
        const sourceAvailableAt = latestBar?.availableAt || null;
        const sourceObservedAt = latestBar?.observedAt || sourceAvailableAt || decisionTimestamp;

        const factorBundle = await buildA1HistoryPrimitiveBundle({
          bundleId: plan.runId + "|A1|" + marketDate + "|" + member.symbol,
          symbol: member.symbol,
          marketDate,
          decisionTimestamp,
          observedAt: sourceObservedAt,
          availableAt: sourceAvailableAt,
          bars: replayWindow.bars,
          sourceId: latestBar?.sourceId || "SYSTEM2_HISTORICAL_STORE",
          sourceName: "System2 Historical Store",
          sourceUrl: null,
          priceSpace: "RAW",
          volumeUnit: "SHARES",
          continuityState,
        });

        const evaluation = validateEvaluation(await evaluateSymbol({
          marketDate,
          decisionTimestamp,
          symbol: member.symbol,
          companyName: member.companyName,
          market: member.market,
          strategyId: plan.strategyId,
          strategyVersion: plan.strategyVersion,
          policyId: plan.policyId,
          policyVersion: plan.policyVersion,
          factorBundle,
          replayWindow,
          plan,
        }), plan.selectionPolicyAuthorized);

        const sampleBase = {
          runId: plan.runId,
          marketDate,
          decisionTimestamp,
          symbol: member.symbol,
          companyName: member.companyName,
          market: member.market,
          strategyId: plan.strategyId,
          strategyVersion: plan.strategyVersion,
          policyId: plan.policyId,
          policyVersion: plan.policyVersion,
          ...evaluation,
          factorBundleHash: factorBundle.bundleHash,
          factorBundleVersion: factorBundle.schemaVersion,
          coreMetrics: factorBundle.coreMetrics,
          factorObservations: factorBundle.factorObservations,
          pitReplayHash: replayWindow.replayHash,
          pitReplayState: replayWindow.state,
          sourceAvailableAt,
        };
        const sampleHash = await sha256Hex(sampleBase);
        return deepFreeze({ ...sampleBase, sampleId: "S2BT-" + sampleHash, sampleHash });
      }));

      if (onPartition) {
        await onPartition(deepFreeze({
          runId: plan.runId,
          planHash: plan.planHash,
          marketDate,
          partitionIndex,
          partitionCount: symbolPartitions.length,
          samples: Object.freeze(partitionSamples),
        }));
      }
      if (retainSamplesInMemory) retainedSamples.push(...partitionSamples);

      for (const sample of partitionSamples) {
        dateSampleCount += 1;
        processedSampleCount += 1;
        stateCounts[sample.candidateState] = (stateCounts[sample.candidateState] || 0) + 1;
        dateStateCounts[sample.candidateState] = (dateStateCounts[sample.candidateState] || 0) + 1;
        if (sample.candidateState === "SELECTED") selectedCount += 1;
      }

      rollingDigest = await sha256Hex({
        prior: rollingDigest,
        marketDate,
        partitionIndex,
        sampleHashes: partitionSamples.map((x) => x.sampleHash),
      });
    }

    if (dateSampleCount !== eligible.length) {
      throw new Error("full-universe accounting mismatch on " + marketDate);
    }

    const dateSummary = deepFreeze({
      marketDate,
      baseUniverseCount: universe.length,
      excludedCount,
      eligibleCount: eligible.length,
      accountedCount: dateSampleCount,
      stateCounts: deepFreeze(dateStateCounts),
      selectedCount,
      zeroPickDay: selectedCount === 0,
      allEligibleSymbolsAccounted: dateSampleCount === eligible.length,
    });
    dateSummaries.push(dateSummary);
    completedDates.add(marketDate);

    latestCheckpoint = await buildCheckpoint({
      plan,
      completedDates,
      processedSampleCount,
      stateCounts,
      rollingDigest,
      capturedAt: captureTime,
    });
    if (onCheckpoint) await onCheckpoint(latestCheckpoint);
  }

  const completed = [...completedDates].sort();
  const base = {
    runId: plan.runId,
    planHash: plan.planHash,
    strategyId: plan.strategyId,
    strategyVersion: plan.strategyVersion,
    policyId: plan.policyId,
    policyVersion: plan.policyVersion,
    datasetVersion: plan.datasetVersion,
    firstMarketDate: plan.firstMarketDate,
    lastMarketDate: plan.lastMarketDate,
    requestedDateCount: plan.marketDates.length,
    completedDateCount: completed.length,
    completedDates: Object.freeze(completed),
    processedSampleCount,
    stateCounts: deepFreeze(stateCounts),
    dateSummaries: Object.freeze(dateSummaries),
    allRequestedDatesComplete: completed.length === plan.marketDates.length,
    hardSymbolLimit: null,
    partitionSize: plan.symbolPartitionSize,
    selectionPolicyAuthorized: plan.selectionPolicyAuthorized,
    retainedSamples: Object.freeze(retainedSamples),
    retainSamplesInMemory: retainSamplesInMemory === true,
    latestCheckpoint,
    rollingDigest,
    capturedAt: captureTime,
    schemaVersion: "S2_BULK_BACKTEST_RUN_V0_1",
  };
  const runHash = await sha256Hex(base);
  return deepFreeze({ ...base, runHash });
}

export { CANDIDATE_STATES };
