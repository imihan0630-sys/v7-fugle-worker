import assert from "node:assert/strict";
import { buildDailyResonanceMonitorBatch } from "../runtime/daily_resonance_monitor_v0_1.mjs";
import {
  DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT,
  buildDailyResonanceLiveAdapterBatchV0_1,
} from "../runtime/daily_resonance_live_adapter_v0_1.mjs";
import { advanceDailyResonanceEpisodeV0_1 } from "../runtime/daily_resonance_episode_v0_1.mjs";
import { buildDailyResonanceReadModelV0_1 } from "../runtime/daily_resonance_read_model_v0_1.mjs";

function historyBars(count = 90) {
  const end = new Date("2026-09-28T00:00:00.000Z");
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - (count - 1 - i));
    const close = 100 + i * 0.8;
    return {
      date: d.toISOString().slice(0, 10),
      open: close - 0.2,
      high: close + 1,
      low: close - 1,
      close,
      volumeShares: 1_000_000 + i * 500,
    };
  });
}

const marketDate = "2026-09-29";
const asOf = "2026-09-29T03:31:00.000Z";
const quote = {
  marketDate,
  observedAt: "2026-09-29T03:30:00.000Z",
  providerTimestamp: "2026-09-29T03:29:59.000Z",
  lastTradeAt: "2026-09-29T03:29:58.000Z",
  open: 172,
  high: 175,
  low: 171,
  lastPrice: 174,
  cumulativeVolumeShares: 2_000_000,
  sourceFinality: "LIVE",
  semanticContract: DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT,
};

const adapterBatch = buildDailyResonanceLiveAdapterBatchV0_1({
  marketDate,
  asOf,
  items: [{
    symbol: "3443",
    quote,
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  }],
});

const adapter = adapterBatch.outputs[0];
const monitorBatch = buildDailyResonanceMonitorBatch({
  marketDate,
  asOf,
  items: [{
    ...adapter.monitorInput,
    historyBars: historyBars(),
    priorLifecycleState: "WATCH",
    strategyMemberships: ["SHORT_MOMENTUM"],
  }],
});

const snapshot = monitorBatch.snapshots[0];
const episode = advanceDailyResonanceEpisodeV0_1({
  symbol: "3443",
  marketDate,
  asOf,
  snapshot,
});

const readModel = buildDailyResonanceReadModelV0_1({
  monitorBatch,
  liveAdapterBatch: adapterBatch,
  episodeUpdates: [episode],
  includeCharts: true,
  chartMaxBars: 80,
});

assert.equal(readModel.schemaVersion, "SYSTEM2_DAILY_RESONANCE_READ_MODEL_V0_1");
assert.equal(readModel.mode, "READ_ONLY_RESEARCH");
assert.equal(readModel.symbolCount, 1);
assert.equal(readModel.fullMarketScan, false);
assert.equal(readModel.notificationImpact, false);
assert.equal(readModel.symbols[0].symbol, "3443");
assert.equal(readModel.symbols[0].adapterState.monitorEligible, true);
assert.equal(readModel.symbols[0].chart.candles.length, 80);
assert.equal(readModel.symbols[0].chart.intraday15mAffectsDailyResonance, false);
assert.equal(readModel.symbols[0].episodeState.episodeId, episode.episode.episodeId);

console.log("System2 daily resonance read model V0.1 tests passed");
