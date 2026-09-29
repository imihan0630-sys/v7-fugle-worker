import assert from "node:assert/strict";
import {
  DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT,
  buildCurrentDailyBarFromNormalizedQuoteV0_1,
  buildDailyResonanceLiveAdapterBatchV0_1,
} from "../runtime/daily_resonance_live_adapter_v0_1.mjs";
import { buildDailyResonanceSnapshot } from "../runtime/daily_resonance_monitor_v0_1.mjs";

const baseQuote = {
  marketDate: "2026-09-29",
  observedAt: "2026-09-29T03:30:00.000Z",
  providerTimestamp: "2026-09-29T03:29:59.500Z",
  lastTradeAt: "2026-09-29T03:29:58.000Z",
  open: 100,
  high: 106,
  low: 99,
  lastPrice: 105,
  cumulativeVolumeShares: 2_000_000,
  cumulativeTradeValue: 210_000_000,
  cumulativeTransactionCount: 12345,
  sourceFinality: "LIVE",
  semanticContract: DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT,
  isTrial: false,
  isHalted: false,
  isSuspended: false,
};

{
  const out = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T03:31:00.000Z",
    quote: baseQuote,
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  });
  assert.equal(out.monitorEligible, true);
  assert.equal(out.currentDailyBarState, "LIVE");
  assert.equal(out.finalityState, "PROVISIONAL_DAILY_BAR");
  assert.equal(out.currentDailyBar.close, 105);
  assert.equal(out.monitorInput.currentDailyBarState, "LIVE");
  assert.equal(out.fullMarketScan, false);
  assert.equal(out.notificationImpact, false);
}

{
  const out = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T05:36:00.000Z",
    quote: {
      ...baseQuote,
      observedAt: "2026-09-29T05:35:30.000Z",
      providerTimestamp: "2026-09-29T05:35:00.000Z",
      lastTradeAt: "2026-09-29T05:30:00.000Z",
      sourceFinality: "FINAL",
    },
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
    officialSessionCloseConfirmed: true,
  });
  assert.equal(out.monitorEligible, true);
  assert.equal(out.currentDailyBarState, "FINAL");
  assert.equal(out.finalityState, "CONFIRMED_DAILY_CLOSE");
  assert.equal(out.afterOfficialClose, true);
}

{
  const out = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T04:01:00.000Z",
    quote: {
      ...baseQuote,
      observedAt: "2026-09-29T04:00:00.000Z",
      sourceFinality: "FINAL",
    },
    continuityState: "CLEAR_NO_ACTION",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
    officialSessionCloseConfirmed: true,
  });
  assert.equal(out.currentDailyBarState, "LIVE");
  assert.equal(out.finalityState, "PROVISIONAL_DAILY_BAR");
  assert.ok(out.warnings.includes("FINAL_FLAG_BEFORE_OFFICIAL_CLOSE"));
}

{
  const out = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T03:31:00.000Z",
    quote: { ...baseQuote, semanticContract: "UNKNOWN" },
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  });
  assert.equal(out.monitorEligible, false);
  assert.equal(out.finalityState, "BLOCKED");
  assert.ok(out.blockers.includes("QUOTE_OHLC_SEMANTICS_UNVERIFIED"));
}

{
  const out = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T03:31:00.000Z",
    quote: { ...baseQuote, isHalted: true },
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  });
  assert.equal(out.monitorEligible, false);
  assert.ok(out.blockers.includes("SYMBOL_HALTED"));
}

{
  const out = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T01:01:00.000Z",
    quote: {
      marketDate: "2026-09-29",
      observedAt: "2026-09-29T01:00:00.000Z",
      open: null,
      high: null,
      low: null,
      lastPrice: null,
      cumulativeVolumeShares: 0,
      sourceFinality: "LIVE",
      semanticContract: DAILY_RESONANCE_QUOTE_SEMANTIC_CONTRACT,
    },
    continuityState: "CLEAR_NO_ACTION",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  });
  assert.equal(out.monitorEligible, false);
  assert.equal(out.currentDailyBar, null);
  assert.ok(out.blockers.includes("NO_TRADE_YET"));
}

{
  const historyBars = Array.from({ length: 99 }, (_, i) => {
    const close = 100 + i * 0.7;
    const d = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
    return { date: d, open: close - 0.2, high: close + 1, low: close - 1, close };
  }).filter((x) => x.date < "2026-09-29");

  const adapter = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "3443",
    marketDate: "2026-09-29",
    asOf: "2026-09-29T03:31:00.000Z",
    quote: baseQuote,
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  });

  const snapshot = buildDailyResonanceSnapshot({
    ...adapter.monitorInput,
    historyBars,
    asOf: adapter.asOf,
    priorLifecycleState: "WATCH",
  });
  assert.equal(snapshot.finality, "PROVISIONAL_DAILY_BAR");
  assert.equal(snapshot.fullMarketScan, false);
}

{
  const items = Array.from({ length: 9 }, (_, i) => ({
    symbol: String(3000 + i),
    quote: baseQuote,
    continuityState: "ADJUSTED_CONTINUITY",
    sourceId: "FIXTURE",
    sourceName: "Fixture normalized quote",
  }));
  const batch = buildDailyResonanceLiveAdapterBatchV0_1({
    marketDate: "2026-09-29",
    asOf: "2026-09-29T03:31:00.000Z",
    items,
  });
  assert.equal(batch.symbolCount, 9);
  assert.equal(batch.eligibleCount, 9);
  assert.equal(batch.fullMarketScan, false);

  assert.throws(
    () => buildDailyResonanceLiveAdapterBatchV0_1({
      marketDate: "2026-09-29",
      asOf: "2026-09-29T03:31:00.000Z",
      items: [...items, { ...items[0], symbol: "9999" }],
    }),
    /cannot exceed 9 symbols/,
  );
}

console.log("System2 daily resonance live adapter V0.1 tests passed");
