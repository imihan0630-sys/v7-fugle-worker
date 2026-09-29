# System 2 Daily Resonance Monitor V0.1

Updated: 2026-09-29 Asia/Taipei  
Status: IMPLEMENTATION / RESEARCH-SHADOW ONLY / NOT ARMED  
Governance class: Class A isolated research-only implementation  
System 1 / V8 Formal Core impact: NONE

## Purpose

Implement the owner-requested bounded intraday monitor for stocks that have already been selected after market close.

This module is **not** a full-market intraday scanner. It consumes only a preselected System 2 watch universe, such as:
- a 3+3+3 bounded pool;
- a thousand-price bounded pool;
- another owner-specified System 2 bounded candidate pool.

The existing System 2 global candidate/watch capacity remains a maximum of 12 unique symbols. This monitor V0.1 is deliberately narrower: it accepts at most **9 active symbols**, matching the owner-requested 3+3+3 bounded intraday set. A thousand-price-only monitor can therefore be smaller. Weak names are never added merely to fill capacity.

## Timeframe contract

The video strategy's EMA16, EMA64 and Impulse MACD are evaluated on **daily K bars**.

Intraday operation updates the still-open current daily bar:
- before the official close: PROVISIONAL_DAILY_BAR;
- after the official 13:30 Asia/Taipei close and a finalized current-date daily bar: CONFIRMED_DAILY_CLOSE;
- if the current-date daily bar is missing: CURRENT_DAILY_BAR_MISSING and the monitor is BLOCKED.

A provisional daily signal may disappear before the close and must never be relabeled as a confirmed historical daily signal.

15-minute K is an **auxiliary execution/timing context only** in this V0.1 contract. Changing 15-minute context cannot alter the daily EMA16/EMA64/Impulse-MACD resonance state.

## Formula contract

### EMA16 / EMA64

V0.1 freezes:
- fast EMA = 16 daily bars;
- slow EMA = 64 daily bars;
- alpha = 2 / (N + 1);
- first-value seed for the internal research reference.

This is an internal deterministic reference, not a claim of exact parity with any broker/charting platform.

A parameter challenger such as EMA15/60 or another seed method requires a new version. V0.1 does not silently tune periods after observing outcomes.

### Impulse MACD

V0.1 implements an internal LazyBear-style research reference:
- source = HLC3;
- High envelope = SMMA(High, 34);
- Low envelope = SMMA(Low, 34);
- momentum center = ZLEMA(HLC3, 34);
- MD:
  - ZLEMA - High envelope when above the High envelope;
  - ZLEMA - Low envelope when below the Low envelope;
  - 0 while inside the envelope;
- Signal = SMA(MD, 9);
- Histogram = MD - Signal.

Formula version:
LAZYBEAR_STYLE_IMPULSE_SMM34_ZLEMA34_SIGNAL_SMA9_INTERNAL_V0_1

Exact third-party platform parity is **not claimed**. Seed, warm-up and implementation differences must be versioned if later comparison shows a mismatch.

## Three-condition state machine

The three conditions are a **single price-derived trend/momentum family state**, not three independent evidence votes.

### Entry-side research candidate

Display-side entry readiness uses:
1. current daily price is above EMA16 **and** EMA16 slope is positive;
2. EMA16 is above EMA64;
3. Impulse MACD state is bullish (MD > Signal).

States:
- 0/3: WATCH;
- 1/3 or 2/3: ENTRY_FORMING;
- 3/3: ENTRY_RESONANCE_CANDIDATE.

This is a research/shadow candidate signal. It is not yet a validated production BUY authority.

### Exit-side research candidate

Display-side deterioration uses:
1. current daily price is below EMA16 **and** EMA16 slope is negative;
2. EMA16 is below EMA64;
3. Impulse MACD state is bearish (MD < Signal).

For a prior HOLD lifecycle:
- 1/3 or 2/3: EXIT_WARNING;
- 3/3: EXIT_RESONANCE_CANDIDATE.

The runtime also exposes exact price-vs-EMA16, EMA16-vs-EMA64, and Impulse-MACD cross events for chart annotation and later falsification. V0.1 does **not** require all three cross events to occur on the exact same daily bar.

## Why alignment state is separated from cross events

The owner requested a resonance system that can observe conditions forming during the same trade lifecycle. Requiring three correlated crossings on one exact bar would be an arbitrary same-bar constraint and could miss sequential deterioration/confirmation.

Therefore V0.1 records:
- current state/alignment;
- exact cross events;
- 0/3 to 3/3 display progression.

The proper resonance window, event ordering, expiration and whether all three should be latched across multiple daily bars remain research questions and must be tested before promotion.

## Intraday behavior

For a selected symbol such as 3443:
1. load finalized historical daily bars;
2. append/update today's still-open daily OHLC bar from live market data;
3. recalculate EMA16, EMA64 and Impulse MACD;
4. expose the current 0/3 to 3/3 state;
5. mark the state provisional while the daily bar is open;
6. recalculate on each allowed market-data refresh;
7. after official close, recompute from the finalized daily bar and mark confirmed only if the state remains valid.

The pure V0.1 module performs no network call. A later isolated market-data adapter will supply the current daily bar.

## Bounded-monitor safety contract

buildDailyResonanceMonitorBatch():
- accepts only caller-provided symbols;
- supports at most 9 unique symbols in V0.1 (3+3+3 monitor cap);
- rejects duplicate symbols in a batch;
- has mode = BOUNDED_PRESELECTED_ONLY;
- has fullMarketScan = false;
- makes no attempt to discover or scan the full Taiwan market.

A symbol belonging to multiple System 2 strategies is passed once with multiple strategy memberships, consistent with the existing global-capacity contract.

## Data-quality and PIT rules

Fail/flag conservatively:
- unverified corporate-action/price continuity -> BLOCKED;
- fewer than 64 daily bars -> WARMUP;
- fewer than 128 bars -> seed-warmup sensitivity warning;
- live current daily bar -> repaint/finality warning;
- inconsistent OHLC -> reject;
- history bars on or after the current market date -> reject;
- missing current-market-date daily bar -> BLOCKED, never reuse the prior day as today's confirmed state.

Missing or unverified inputs are not coerced into bearish/zero evidence.

## UI / chart output contract

The snapshot exposes a full daily series suitable for a dynamic chart:
- daily OHLCV rows;
- EMA16;
- EMA64;
- Impulse MD;
- Impulse Signal;
- Impulse Histogram;
- price-vs-EMA16 cross state;
- EMA16/EMA64 cross state;
- entry condition map/count;
- exit condition map/count;
- lifecycle state;
- provisional/confirmed finality;
- visual signal: ENTRY / EXIT / WARNING / HOLD / WATCH;
- display signal: BUY_RESONANCE / EXIT_RESONANCE when 3/3 is reached;
- confirmation state: PROVISIONAL / CONFIRMED.

A future System 2 chart can render:
- K candles;
- EMA16 / EMA64 overlays;
- Impulse-MACD panel;
- 1/3, 2/3, 3/3 state badges;
- ENTRY / EXIT markers on the relevant bar;
- explicit 盤中暫態 vs 收盤確認 labeling.

## 15-minute execution layer

15-minute K remains separate from the daily core.

Future integration may use 15-minute data to:
- avoid poor execution after a daily entry candidate;
- identify a more favorable intraday trigger;
- display execution context;
- assess slippage/price extension.

It must not retroactively rewrite whether the daily EMA16/EMA64/Impulse-MACD state existed.

## Research / promotion requirements

Before any live notification or trading authority is enabled, validate:
- Trend vs Range / whipsaw;
- high/low volatility;
- liquidity;
- extension/no-chase state;
- signal persistence and repaint frequency;
- false-confirmation rate;
- MFE / MAE;
- after-cost return;
- holding-period stability;
- missed-opportunity cost;
- direct-trend / simple-MA / standard-MACD baselines;
- redundancy between EMA and Impulse MACD;
- PIT / OOS / Prospective Shadow;
- multiple-testing and parameter-snooping controls;
- multiple independent dates and regimes.

The three conditions must never be counted as three independent factor-family votes.

## Current implementation

Repository files:
- system2/runtime/daily_resonance_monitor_v0_1.mjs
- system2/tests/daily_resonance_monitor_v0_1.test.mjs

Current safety flags:
- decisionImpact = false
- notificationImpact = false
- orderImpact = false
- fullMarketScan = false

Not implemented/armed in V0.1:
- live quote/Fugle adapter and market-data refresh loop;
- current-day OHLC aggregation from ticks;
- persistent signal episodes;
- push notifications;
- chart web UI;
- Worker Cron;
- final System 2 strategy promotion;
- real orders.

Those are separate integration steps and must preserve the System 1/V8 isolation boundary.
