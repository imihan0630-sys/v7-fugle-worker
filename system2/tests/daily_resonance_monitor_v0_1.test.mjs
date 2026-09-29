import assert from "node:assert/strict";
import {
  DAILY_RESONANCE_FORMULA_VERSION,
  DAILY_RESONANCE_MAX_UNIQUE_SYMBOLS,
  computeImpulseMacdSeries,
  computeDailyResonanceSeries,
  buildDailyResonanceSnapshot,
  buildDailyResonanceMonitorBatch,
} from "../runtime/daily_resonance_monitor_v0_1.mjs";

function dateAt(offset) {
  const d = new Date(Date.UTC(2026, 0, 1 + offset));
  return d.toISOString().slice(0, 10);
}

function makeBars({ count = 100, direction = "UP" } = {}) {
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    let close = 100;
    if (direction === "UP") {
      close = 100 + 0.05 * i + Math.pow(Math.max(0, i - 70), 1.25) * 0.7;
    } else if (direction === "DOWN") {
      close = 200 - 0.05 * i - Math.pow(Math.max(0, i - 70), 1.25) * 0.7;
    } else if (direction === "FLAT") {
      close = 100;
    }
    rows.push({
      date: dateAt(i),
      open: close - 0.2,
      high: close + 1,
      low: close - 1,
      close,
      volumeShares: 1_000_000 + i * 1_000,
    });
  }
  return rows;
}

function splitForLive(rows) {
  const historyBars = rows.slice(0, -1);
  const currentDailyBar = rows.at(-1);
  return {
    historyBars,
    currentDailyBar,
    marketDate: currentDailyBar.date,
  };
}

assert.equal(DAILY_RESONANCE_FORMULA_VERSION.fastEma, 16);
assert.equal(DAILY_RESONANCE_FORMULA_VERSION.slowEma, 64);
assert.equal(DAILY_RESONANCE_MAX_UNIQUE_SYMBOLS, 9);

{
  const flat = makeBars({ count: 80, direction: "FLAT" });
  const impulse = computeImpulseMacdSeries(flat);
  const latest = impulse.at(-1);
  assert.equal(latest.ready, true);
  assert.equal(latest.md, 0);
  assert.equal(latest.signal, 0);
  assert.equal(latest.histogram, 0);
  assert.equal(latest.direction, "NEUTRAL");
}

{
  const up = makeBars({ count: 100, direction: "UP" });
  const series = computeDailyResonanceSeries(up);
  const latest = series.at(-1);
  assert.equal(latest.ready, true);
  assert.equal(latest.close > latest.ema16, true);
  assert.equal(latest.ema16Slope > 0, true);
  assert.equal(latest.ema16 > latest.ema64, true);
  assert.equal(latest.impulseMacd.direction, "BULLISH");
  assert.equal(latest.entryCount, 3);
  assert.equal(latest.exitCount, 0);
}

{
  const down = makeBars({ count: 100, direction: "DOWN" });
  const series = computeDailyResonanceSeries(down);
  const latest = series.at(-1);
  assert.equal(latest.ready, true);
  assert.equal(latest.close < latest.ema16, true);
  assert.equal(latest.ema16Slope < 0, true);
  assert.equal(latest.ema16 < latest.ema64, true);
  assert.equal(latest.impulseMacd.direction, "BEARISH");
  assert.equal(latest.exitCount, 3);
  assert.equal(latest.entryCount, 0);
}

{
  const rows = makeBars({ count: 100, direction: "UP" });
  const input = splitForLive(rows);
  const provisional = buildDailyResonanceSnapshot({
    symbol: "3443",
    ...input,
    currentDailyBarState: "LIVE",
    asOf: "2026-09-29T02:30:00.000Z",
    continuityState: "ADJUSTED_CONTINUITY",
    priorLifecycleState: "WATCH",
    poolIds: ["THOUSAND_POOL"],
    strategyMemberships: ["SYSTEM2_DAILY_RESONANCE_V0_1"],
    intraday15mContext: { lastClosedBarAt: "2026-09-29T02:15:00.000Z", state: "AUXILIARY_ONLY" },
  });
  assert.equal(provisional.finality, "PROVISIONAL_DAILY_BAR");
  assert.equal(provisional.lifecycleState, "ENTRY_RESONANCE_PROVISIONAL");
  assert.equal(provisional.displaySignal, "BUY_RESONANCE");
  assert.equal(provisional.signalConfirmationState, "PROVISIONAL");
  assert.equal(provisional.visualSignal, "ENTRY");
  assert.equal(provisional.latest.entryCount, 3);
  assert.equal(provisional.intraday15mAffectsDailyResonance, false);
  assert.equal(provisional.fullMarketScan, false);
  assert.equal(provisional.decisionImpact, false);
  assert.equal(provisional.notificationImpact, false);
  assert.equal(provisional.orderImpact, false);
  assert.equal(provisional.sameFamilyIndependenceClaim, false);
  assert.match(provisional.qualityWarnings.join("|"), /CURRENT_DAILY_BAR_CAN_REPAINT_UNTIL_CLOSE/);

  const alternate15m = buildDailyResonanceSnapshot({
    symbol: "3443",
    ...input,
    currentDailyBarState: "LIVE",
    asOf: "2026-09-29T02:30:00.000Z",
    continuityState: "ADJUSTED_CONTINUITY",
    priorLifecycleState: "WATCH",
    intraday15mContext: { lastClosedBarAt: "2026-09-29T02:15:00.000Z", state: "STRONGLY_BEARISH_FIXTURE" },
  });
  assert.deepEqual(alternate15m.latest, provisional.latest);
}

{
  const rows = makeBars({ count: 100, direction: "DOWN" });
  const input = splitForLive(rows);
  const live = buildDailyResonanceSnapshot({
    symbol: "3443",
    ...input,
    currentDailyBarState: "LIVE",
    asOf: "2026-09-29T04:00:00.000Z",
    continuityState: "ADJUSTED_CONTINUITY",
    priorLifecycleState: "HOLD",
  });
  assert.equal(live.lifecycleState, "EXIT_RESONANCE_PROVISIONAL");
  assert.equal(live.displaySignal, "EXIT_RESONANCE");
  assert.equal(live.signalConfirmationState, "PROVISIONAL");
  assert.equal(live.visualSignal, "EXIT");
  assert.equal(live.latest.exitCount, 3);

  const confirmed = buildDailyResonanceSnapshot({
    symbol: "3443",
    ...input,
    currentDailyBarState: "FINAL",
    asOf: "2026-09-29T05:35:00.000Z",
    continuityState: "ADJUSTED_CONTINUITY",
    priorLifecycleState: "HOLD",
  });
  assert.equal(confirmed.finality, "CONFIRMED_DAILY_CLOSE");
  assert.equal(confirmed.lifecycleState, "EXIT_RESONANCE_CONFIRMED");
  assert.equal(confirmed.displaySignal, "EXIT_RESONANCE");
  assert.equal(confirmed.signalConfirmationState, "CONFIRMED");
  assert.equal(confirmed.latest.exitCount, 3);
}

{
  const rows = makeBars({ count: 80, direction: "UP" });
  const input = splitForLive(rows);
  const blocked = buildDailyResonanceSnapshot({
    symbol: "3443",
    ...input,
    currentDailyBarState: "LIVE",
    asOf: "2026-09-29T03:00:00.000Z",
    continuityState: "UNVERIFIED",
  });
  assert.equal(blocked.lifecycleState, "BLOCKED");
  assert.equal(blocked.latest, null);
  assert.match(blocked.qualityWarnings.join("|"), /PRICE_CONTINUITY_NOT_VERIFIED/);
}

{
  const rows = makeBars({ count: 50, direction: "UP" });
  const input = splitForLive(rows);
  const warmup = buildDailyResonanceSnapshot({
    symbol: "3443",
    ...input,
    currentDailyBarState: "LIVE",
    asOf: "2026-09-29T03:00:00.000Z",
    continuityState: "CLEAR_NO_ACTION",
  });
  assert.equal(warmup.lifecycleState, "WARMUP");
  assert.equal(warmup.latest.ready, false);
  assert.match(warmup.qualityWarnings.join("|"), /INSUFFICIENT_HISTORY_LT_64/);
}

{
  const rows = makeBars({ count: 100, direction: "UP" });
  assert.throws(
    () => computeDailyResonanceSeries(rows, { fastPeriod: 15, slowPeriod: 64 }),
    /frozen to EMA16\/EMA64/,
  );
}

{
  const rows = makeBars({ count: 100, direction: "UP" });
  const input = splitForLive(rows);
  const items = Array.from({ length: 9 }, (_, index) => ({
    symbol: String(3000 + index),
    ...input,
    currentDailyBarState: "LIVE",
    continuityState: "ADJUSTED_CONTINUITY",
    poolIds: [
      index < 3 ? "POOL_A" : index < 6 ? "POOL_B" : "POOL_C",
    ],
  }));
  const batch = buildDailyResonanceMonitorBatch({
    marketDate: input.marketDate,
    asOf: "2026-09-29T03:00:00.000Z",
    items,
  });
  assert.equal(batch.mode, "BOUNDED_PRESELECTED_ONLY");
  assert.equal(batch.fullMarketScan, false);
  assert.equal(batch.symbolCount, 9);
  assert.equal(batch.maxUniqueSymbols, 9);
  assert.equal(batch.snapshots.every((x) => x.latest.entryCount === 3), true);

  const tooMany = Array.from({ length: 10 }, (_, index) => ({
    symbol: String(4000 + index),
    ...input,
    currentDailyBarState: "LIVE",
    continuityState: "ADJUSTED_CONTINUITY",
  }));
  assert.throws(
    () => buildDailyResonanceMonitorBatch({
      marketDate: input.marketDate,
      asOf: "2026-09-29T03:00:00.000Z",
      items: tooMany,
    }),
    /cannot exceed 9 unique symbols/,
  );
}

console.log("System2 daily resonance monitor V0.1 tests passed");
