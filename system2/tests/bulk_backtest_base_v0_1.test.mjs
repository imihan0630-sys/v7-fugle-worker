import assert from "node:assert/strict";
import {
  buildBulkBacktestPlanV0_1,
  buildBulkBacktestPitUniverseReceiptV0_1,
  runBulkBacktestV0_1,
} from "../runtime/bulk_backtest_runner_v0_1.mjs";
import {
  buildHistoricalBaseDatasetV0_1,
  toHistoricalBasePersistenceRecords,
} from "../runtime/historical_base_dataset_v0_1.mjs";
import { buildSystem2PersistenceBatch } from "../runtime/persistence_batch.mjs";

const h=(ch)=>String(ch).repeat(64).slice(0,64);
const planIdentity={
  datasetManifestHash:h("a"),
  policyRegistrationHash:h("b"),
  evaluatorCodeHash:h("c"),
  factorBundleHash:h("d"),
  regimeVersionHash:h("e"),
  executionAssumptionHash:h("f"),
  costModelHash:h("1"),
};

function datePlus(start, days) {
  const d = new Date(start + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function barsFor(symbol, offset = 0) {
  return Array.from({ length: 75 }, (_, i) => {
    const marketDate = datePlus("2026-07-17", i);
    const close = 100 + offset + i;
    const sourcePayload = { symbol, marketDate, close };
    return {
      barId: "BAR-" + symbol + "-" + marketDate,
      canonicalKey: "TWSE|" + symbol + "|" + marketDate + "|RAW",
      marketDate,
      market: "TWSE",
      symbol,
      companyName: "C" + symbol,
      priceSpace: "RAW",
      open: close - 1,
      high: close + 2,
      low: close - 2,
      close,
      volumeShares: 1_000_000 + i * 1000,
      tradeValue: (1_000_000 + i * 1000) * close,
      transactions: 1000 + i,
      change: 1,
      continuityState: "CLEAR_NO_ACTION",
      sourceId: "TWSE_FIXTURE",
      sourceName: "TWSE fixture",
      sourceRowHash: JSON.stringify(sourcePayload),
      observedAt: "2026-10-01T00:00:00Z",
      availableAt: marketDate + "T05:30:00Z",
      availabilityBasis: "SESSION_CLOSE_FINALITY",
      pitAvailabilityClass: "CONSERVATIVE_SESSION_FINALITY",
      pitReplayEligible: true,
      capturedAt: "2026-10-01T00:00:00Z",
      barHash: "HASH-" + symbol + "-" + marketDate,
      schemaVersion: "S2_HISTORICAL_A1_BAR_V0_1",
    };
  });
}

const marketDates = ["2026-09-28", "2026-09-29"];
const plan = await buildBulkBacktestPlanV0_1({
  runId: "BT-S2-SM-V0-TEST",
  datasetVersion: "HIST-CORE-2017-PLUS-V0.1",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0_RESEARCH",
  policyId: "LIMITED_SHADOW_NO_FINAL_SELECTION",
  policyVersion: "0.1",
  marketDates,
  decisionClockByDate: {
    "2026-09-28": "2026-09-28T10:10:00Z",
    "2026-09-29": "2026-09-29T10:10:00Z",
  },
  lookbackSessions: 61,
  symbolPartitionSize: 2,
  selectionPolicyAuthorized: false,
  planIdentity,
  createdAt: "2026-09-28T09:40:00Z",
});

assert.equal(plan.hardSymbolLimit, null);
assert.equal(plan.executionMode, "FULL_UNIVERSE_PARTITIONED");
assert.equal(plan.selectionPolicyAuthorized, false);

const bySymbol = {
  "2330": barsFor("2330", 0),
  "2317": barsFor("2317", 10),
  "2454": barsFor("2454", 20),
};

async function loadUniverse() {
  return [
    { symbol: "2330", companyName: "台積電", market: "TWSE", membershipId:"M-2330", membershipHash:"MH-2330", replayEligible:true, membershipStateAtReplay:"ACTIVE" },
    { symbol: "2317", companyName: "鴻海", market: "TWSE", membershipId:"M-2317", membershipHash:"MH-2317", replayEligible:true, membershipStateAtReplay:"ACTIVE" },
    { symbol: "2454", companyName: "聯發科", market: "TWSE", membershipId:"M-2454", membershipHash:"MH-2454", replayEligible:true, membershipStateAtReplay:"ACTIVE" },
    { symbol: "9999", companyName: "排除樣本", market: "TWSE", membershipId:"M-9999", membershipHash:"MH-9999", replayEligible:true, membershipStateAtReplay:"ACTIVE", excluded: true, exclusionReasons: ["FIXTURE"] },
  ];
}

async function loadUniverseReceipt({marketDate,decisionTimestamp,plan,universe,capturedAt}) {
  return buildBulkBacktestPitUniverseReceiptV0_1({
    plan,
    marketDate,
    decisionTimestamp,
    registryId:"REG-FIXTURE",
    registryHash:h("2"),
    members:universe,
    exclusions:universe.filter((x)=>x.excluded).map((x)=>({
      market:x.market,symbol:x.symbol,reason:"FIXTURE",state:"KNOWN",
    })),
    emptyUniverseProven:universe.length===0,
    capturedAt,
  });
}

async function loadHistoricalBars({ symbol }) {
  return bySymbol[symbol] || [];
}

async function evaluateSymbol({ symbol, factorBundle }) {
  assert.equal(factorBundle.pointInTimeEligible, true);
  assert.equal(factorBundle.factorObservations.length, 7);
  if (symbol === "2330") {
    return {
      candidateState: "QUALIFIED_NOT_SELECTED",
      strategyValidity: "VALID",
      entryReadiness: "BUY_ELIGIBLE",
      reasons: ["FIXTURE_NEAR_MISS"],
    };
  }
  if (symbol === "2317") {
    return {
      candidateState: "REJECTED",
      importantRejected: true,
      strategyValidity: "WEAKENING",
      entryReadiness: "WAIT",
      reasons: ["FIXTURE_IMPORTANT_REJECT"],
    };
  }
  return {
    candidateState: "WATCH",
    strategyValidity: "VALID",
    entryReadiness: "WATCH",
    reasons: ["FIXTURE_WATCH"],
  };
}

let firstCheckpoint = null;
const archivedPartitions = [];
await assert.rejects(
  () => runBulkBacktestV0_1({
    plan,
    loadUniverse,
    loadUniverseReceipt,
    loadHistoricalBars,
    evaluateSymbol,
    onPartition: async (partition) => archivedPartitions.push(...partition.samples),
    onCheckpoint: async (checkpoint) => {
      firstCheckpoint = checkpoint;
      throw new Error("INTENTIONAL_STOP_AFTER_FIRST_DATE");
    },
    retainSamplesInMemory: false,
    capturedAt: "2026-10-01T09:45:00Z",
  }),
  /INTENTIONAL_STOP_AFTER_FIRST_DATE/,
);

assert.equal(firstCheckpoint.completedDates.length, 1);
assert.equal(firstCheckpoint.completedDates[0], "2026-09-28");
assert.equal(firstCheckpoint.dateSummaries.length, 1);
assert.equal(firstCheckpoint.processedSampleCount, 3);

const resumed = await runBulkBacktestV0_1({
  plan,
  loadUniverse,
  loadUniverseReceipt,
  loadHistoricalBars,
  evaluateSymbol,
  onPartition: async (partition) => archivedPartitions.push(...partition.samples),
  resumeCheckpoint: firstCheckpoint,
  retainSamplesInMemory: false,
  capturedAt: "2026-10-01T09:45:00Z",
});

assert.equal(resumed.allRequestedDatesComplete, true);
assert.equal(resumed.completedDateCount, 2);
assert.equal(resumed.processedSampleCount, 6);
assert.equal(resumed.dateSummaries.length, 2);
assert.equal(resumed.dateSummaries[0].eligibleCount, 3);
assert.equal(resumed.dateSummaries[0].excludedCount, 1);
assert.equal(resumed.dateSummaries[0].allEligibleSymbolsAccounted, true);
assert.equal(resumed.dateSummaries[1].allEligibleSymbolsAccounted, true);
assert.equal(resumed.hardSymbolLimit, null);
assert.equal(archivedPartitions.length, 6);

const baseDataset = await buildHistoricalBaseDatasetV0_1({
  baseDatasetId: "BASE-SM-TEST-V0.1",
  backtestRun: resumed,
  samples: archivedPartitions,
  capturedAt: "2026-10-01T09:50:00Z",
});

assert.equal(baseDataset.fullUniverseProcessedSampleCount, 6);
assert.equal(baseDataset.archivedSampleCount, 4);
assert.equal(baseDataset.cohortCounts.NEAR_MISS, 2);
assert.equal(baseDataset.cohortCounts.IMPORTANT_REJECTED, 2);
assert.equal(baseDataset.cohortCounts.SELECTED, 0);
assert.deepEqual(baseDataset.zeroPickDates, marketDates);
assert.equal(baseDataset.historicalReplayOnly, true);
assert.equal(baseDataset.prospectiveShadowEvidence, false);

const records = toHistoricalBasePersistenceRecords({
  dataset: baseDataset,
  backtestRun: resumed,
});
assert.equal(records.length, 6);
assert.equal(records[0].table, "s2_backtest_runs");
assert.equal(records[1].table, "s2_backtest_checkpoints");
assert.equal(records[2].table, "s2_historical_base_samples");

const persistence = await buildSystem2PersistenceBatch({
  batchId: "BT-PERSIST-TEST",
  marketDate: resumed.lastMarketDate,
  decisionTimestamp: "2026-09-29T10:10:00Z",
  records,
  createdAt: "2026-10-01T09:50:00Z",
});
assert.equal(persistence.operationCount, 6);

const selectedPlan = await buildBulkBacktestPlanV0_1({
  runId: "BT-UNAUTHORIZED-SELECTED",
  datasetVersion: "HIST-CORE-2017-PLUS-V0.1",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0_RESEARCH",
  marketDates: ["2026-09-29"],
  decisionClockByDate: { "2026-09-29": "2026-09-29T10:10:00Z" },
  selectionPolicyAuthorized: false,
  planIdentity,
  createdAt: "2026-09-28T09:40:00Z",
});

await assert.rejects(
  () => runBulkBacktestV0_1({
    plan: selectedPlan,
    loadUniverse: async () => [{ symbol: "2330", companyName: "台積電", market: "TWSE", membershipId:"M-2330", membershipHash:"MH-2330", replayEligible:true, membershipStateAtReplay:"ACTIVE" }],
    loadUniverseReceipt,
    loadHistoricalBars,
    evaluateSymbol: async () => ({ candidateState: "SELECTED" }),
    capturedAt: "2026-10-01T09:55:00Z",
  }),
  /SELECTED generation is not authorized/,
);

let forgedLoaderCalls=0;
const forgedCheckpoint={
  ...firstCheckpoint,
  completedDates:[...marketDates],
  completedThroughDate:marketDates.at(-1),
  processedSampleCount:0,
  stateCounts:{},
  dateSummaries:[],
  partitionReceipts:[],
  checkpointHash:h("0"),
};
await assert.rejects(
  () => runBulkBacktestV0_1({
    plan,
    loadUniverse: async (...args) => { forgedLoaderCalls+=1; return loadUniverse(...args); },
    loadUniverseReceipt,
    loadHistoricalBars,
    evaluateSymbol,
    resumeCheckpoint: forgedCheckpoint,
    capturedAt: "2026-10-01T09:45:00Z",
  }),
  /resume checkpoint hash mismatch/,
);
assert.equal(forgedLoaderCalls,0,"forged checkpoint must fail before universe loading");

const historicalObservedLater = archivedPartitions.find((x) => x.symbol === "2330");
assert.equal(historicalObservedLater.factorObservations[0].provenance.observedAt, "2026-10-01T00:00:00Z");
assert.equal(historicalObservedLater.factorObservations[0].provenance.availableAt.endsWith("T05:30:00Z"), true);
assert.equal(historicalObservedLater.factorObservations[0].provenance.pointInTimeEligible, true);

console.log("System2 bulk backtest + historical base dataset v0.1 tests passed");
