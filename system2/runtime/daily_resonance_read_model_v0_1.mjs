import { buildDailyResonanceChartModel } from "./daily_resonance_chart_v0_1.mjs";

export const DAILY_RESONANCE_READ_MODEL_VERSION = "0.1-RESEARCH";

function mapBySymbol(rows) {
  const out = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (row?.symbol) out.set(String(row.symbol), row);
  }
  return out;
}

export function buildDailyResonanceReadModelV0_1({
  monitorBatch,
  liveAdapterBatch = null,
  episodeUpdates = [],
  includeCharts = true,
  chartMaxBars = 120,
} = {}) {
  if (!monitorBatch || monitorBatch.schemaVersion !== "SYSTEM2_DAILY_RESONANCE_MONITOR_BATCH_V0_1") {
    throw new Error("valid monitorBatch is required");
  }
  if (liveAdapterBatch && liveAdapterBatch.schemaVersion !== "SYSTEM2_DAILY_RESONANCE_LIVE_ADAPTER_BATCH_V0_1") {
    throw new Error("unsupported liveAdapterBatch schema");
  }

  const adapters = mapBySymbol(liveAdapterBatch?.outputs);
  const episodes = mapBySymbol(episodeUpdates);

  const symbols = monitorBatch.snapshots.map((snapshot) => {
    const code = String(snapshot.symbol);
    const adapter = adapters.get(code) ?? null;
    const episode = episodes.get(code) ?? null;
    const chart = includeCharts ? buildDailyResonanceChartModel(snapshot, { maxBars: chartMaxBars }) : null;

    return Object.freeze({
      symbol: code,
      marketDate: snapshot.marketDate,
      finality: snapshot.finality,
      lifecycleState: snapshot.lifecycleState,
      displaySignal: snapshot.displaySignal,
      signalConfirmationState: snapshot.signalConfirmationState,
      entryCount: snapshot.latest?.entryCount ?? 0,
      exitCount: snapshot.latest?.exitCount ?? 0,
      warningLevel: snapshot.warningLevel,
      qualityWarnings: snapshot.qualityWarnings,
      adapterState: adapter ? Object.freeze({
        monitorEligible: adapter.monitorEligible,
        finalityState: adapter.finalityState,
        blockers: adapter.blockers,
        warnings: adapter.warnings,
        quoteObservedAt: adapter.quoteObservedAt,
      }) : null,
      episodeState: episode?.episode ? Object.freeze({
        episodeId: episode.episode.episodeId,
        side: episode.episode.side,
        state: episode.episode.state,
        sequence: episode.episode.sequence,
        confirmedAt: episode.episode.confirmedAt,
      }) : null,
      chart,
    });
  });

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_READ_MODEL_V0_1",
    readModelVersion: DAILY_RESONANCE_READ_MODEL_VERSION,
    marketDate: monitorBatch.marketDate,
    asOf: monitorBatch.asOf,
    mode: "READ_ONLY_RESEARCH",
    symbolCount: symbols.length,
    provisionalResonanceCount: symbols.filter((x) => x.signalConfirmationState === "PROVISIONAL").length,
    confirmedResonanceCount: symbols.filter((x) => x.signalConfirmationState === "CONFIRMED").length,
    blockedCount: symbols.filter((x) => x.lifecycleState === "BLOCKED").length,
    symbols: Object.freeze(symbols),
    fullMarketScan: false,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}
