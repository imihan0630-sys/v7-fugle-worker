# Technical Indicator EMA16/64 Horizon / Warm-up Falsification V0.1

Updated: 2026-10-02 Asia/Taipei  
Lane: D03｜技術指標與趨勢動能  
Classification: Class A（研究專用）  
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche deepens the owner-supplied EMA16/64 + Impulse MACD（脈衝型平滑異同移動平均）research candidate while the prospective raw-receipt gate remains open.

Questions:

1. What time horizon does EMA16 / EMA64 actually encode?
2. Is a 65-bar local re-seed sufficient for stable EMA64 state?
3. Does EMA16/64 + Impulse MACD represent independent confluence or nested price-filter evidence?

No outcome, threshold, BUY/SELL（買進／賣出）, ranking, capital or Formal Core behavior is changed.

## TI-468 — EMA period is a decay parameter, not a hard lookback cutoff

For standard EMA（指數移動平均）:

```
alpha = 2 / (N + 1)
EMA_t = alpha*C_t + (1-alpha)*EMA_(t-1)
```

Unrolled weight for a close k bars old is proportional to:

```
alpha * (1-alpha)^k
```

Therefore old observations never mechanically drop out as they do in an SMA（簡單移動平均）.

Useful horizon summaries:

```
meanAge = (1-alpha)/alpha = (N-1)/2
halfLife = ln(0.5) / ln(1-alpha)
ageTo10PctResidual = ln(0.1) / ln(1-alpha)
```

For EMA16:
- alpha = 2/17 ≈ 0.117647;
- mean age = 7.5 bars;
- half-life ≈ 5.538 bars;
- residual old-state weight falls to 10% after ≈18.397 bars.

For EMA64:
- alpha = 2/65 ≈ 0.030769;
- mean age = 31.5 bars;
- half-life ≈22.179 bars;
- residual old-state weight falls to 10% after ≈73.677 bars.

Thus “EMA64” does not mean only the latest 64 bars matter.

External formula corroboration:
- StockCharts moving-average documentation: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential
- StockCharts weighting relation `K=2/(N+1)`: https://articles.stockcharts.com/article/articles-dancing-2024-04-rulesbased-money-management-pa-295/

## TI-469 — a 65-bar local SMA-seeded EMA64 is not automatically state-stable

Synthetic outcome-blind witness:

A 220-bar smooth/trending/noisy positive-price path was evaluated under the same standard SMA-seed-then-recursive EMA formula.

Final EMA16:
- full-history = 116.2190231843;
- last-65 local re-seed = 116.2203350853;
- delta ≈ +0.001312.

Final EMA64:
- full-history = 115.0611555282;
- last-65 local re-seed = 115.3947308706;
- delta ≈ +0.333575;
- last-80 re-seed delta ≈ -0.109072;
- last-100 re-seed delta ≈ +0.007814;
- last-150 re-seed delta ≈ -0.000482.

This is a mechanism counterexample, not a universal error estimate.

It proves only:

> A 65-bar locally reseeded EMA64 cannot be presumed equivalent to a canonical long-history EMA64.

The exact error is path-dependent.

### Important distinction

This does **not** mean every production EMA64 is wrong.

If the system carries a trusted recursive state from a canonical lineage, 65 newly visible bars do not imply a 65-bar re-seed.

The risk applies when the implementation reconstructs EMA64 from a short local window or changes initialization lineage.

## TI-470 — EMA16/64 crossover is a filtered-trend state, not a new information source

EMA16 and EMA64 are two low-pass filters of the same Close path with different decay speeds.

Their spread:

```
EWMAC_16_64 = EMA16 - EMA64
```

is therefore a difference between two filtered versions of the same price source.

The zero-cross/crossover can have useful response-timing properties, but it is not independent of:
- direct multi-horizon returns;
- MA/EMA slope;
- price-vs-MA state;
- trend persistence;
- MACD-family filtered trend.

Future efficacy must ask whether its timing/response profile adds residual value after these controls.

It must not receive a separate “price-family vote” merely because it is visually distinct.

## TI-471 — EMA16/64 + Impulse MACD is nested filter confluence unless residual value is proven

Impulse MACD（脈衝型 MACD） uses a smoothed High/Low envelope plus a low-lag centerline and suppresses in-envelope displacement.

EMA16/64 uses two exponentially smoothed Close filters.

They are not algebraic aliases:
- EMA16/64 primarily measures filtered trend-speed separation;
- Impulse MACD adds H/L envelope location and a dead-zone/noise suppression mechanism.

But both remain PRICE_OHLC-derived technical transforms.

Therefore:
- agreement is **within-family confirmation** by default;
- it is not equivalent to independent cross-family evidence;
- the only plausible new value is conditional timing/noise filtering after direct price/trend controls.

Frozen prior:

`EMA16_64_PLUS_IMPULSE = PARTIAL_REDUNDANCY_HIGH / RESIDUAL_VALUE_UNKNOWN`

## TI-472 — EMA64 needs canonical state lineage before System 2 resonance use

For any future System 2（系統二）EMA16/64 resonance implementation, every evidence row must preserve:

- formulaVersion（公式版本）;
- stateConstructionMode（狀態建構模式）;
- initializationAnchor（初始化錨點）;
- continuitySpaceVersion（連續價格空間版本）;
- sourceFamilyVersion（資料來源家族版本）;
- sessionCalendarVersion（交易日曆版本）;
- barCompletionState（K棒完成狀態）;
- stateLineageId（狀態世代識別）.

Preferred semantics:
- canonical full replay from a trusted lineage; or
- trusted prior recursive state proven equivalent to canonical replay.

A moving 65-bar local EMA64 reconstruction is QA（品質保證）only unless parity is proven.

## TI-473 — multi-timeframe resonance remains hierarchical, not vote counting

The existing D03 multi-timeframe contract remains authoritative:

- weekly = major context;
- daily = selection / principal setup;
- 15m（15分鐘） = transition / acceptance / execution confirmation;
- 5m（5分鐘） = execution detail where allowed.

EMA16/64 daily state plus 15m Impulse state cannot be converted into two independent statistical samples. They derive from overlapping portions of the same transaction path.

A partial daily bar is not equivalent to a completed daily bar.

For System 2:
- intraday dynamic daily-bar state = PROVISIONAL（暫態）;
- completed daily state = CONFIRMED（確認）;
- 15m confirmation is execution/acceptance information, not another daily-selection vote.

No post-outcome timeframe switching is allowed.

## Deterministic fixture

File:
`research/test_technical_indicator_ema16_64_horizon_warmup_v0_1.mjs`

The fixture asserts:
- alpha / mean-age / half-life / 10%-residual horizons;
- exact EMA recursion;
- the synthetic 65/80/100/150 local-reseed witness;
- EMA16 short-window stability can differ sharply from EMA64 stability on the same path;
- no statement converts those synthetic deltas into a universal market threshold.

## Status

`EMA16_MEAN_AGE_BARS = 7.5`

`EMA64_MEAN_AGE_BARS = 31.5`

`EMA16_HALF_LIFE_BARS ≈ 5.538`

`EMA64_HALF_LIFE_BARS ≈ 22.179`

`EMA64_65_BAR_LOCAL_RESEED_EQUIVALENCE = REJECTED_AS_ASSUMPTION`

`EMA16_64_CROSSOVER = FILTERED_TREND_STATE / ALPHA_UNKNOWN`

`EMA16_64_PLUS_IMPULSE = PARTIAL_REDUNDANCY_HIGH / RESIDUAL_VALUE_UNKNOWN`

`MULTITIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Maturity decision

No additional module maturity promotion is made from this tranche:

- D03-01 is already L3 / 60 and this work strengthens its implementation semantics without adding new PIT/OOS evidence.
- D03-13 remains L2 / 40 because multi-timeframe mechanism/falsification was already frozen; current work adds implementation safeguards but not Taiwan PIT/OOS incremental-value evidence.
- D03 aggregate remains 47.7%.

## Exact next continuation point

1. Preserve D03 aggregate 47.7%; do not inflate maturity from additional theory alone.
2. Add EMA16/64 state-lineage and warm-up parity to any future System 2 resonance research contract before outcome inference.
3. Do not use a locally reseeded 65-bar EMA64 as promotion-grade evidence unless it is proven replay-equivalent to canonical long-history state.
4. Keep EMA16/64 + Impulse as within-price-family confirmation until residual incremental value survives direct returns, trend persistence, structure, Regime and cost controls.
5. Raw-byte third-session source gate remains 2/3; once it genuinely closes, resume TI-005 then TI-006 outcome inference in the preregistered order.
