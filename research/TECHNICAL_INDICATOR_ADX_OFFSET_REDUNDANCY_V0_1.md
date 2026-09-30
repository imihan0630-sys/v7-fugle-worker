# Technical Indicator ADX / Moving-Average Offset Redundancy V0.1

Updated: 2026-10-01 Asia/Taipei  
Lane: D03 Technical Indicators / Trend Momentum  
Classification: Class A research-only documentation + deterministic synthetic falsification  
Formal impact: NONE

## Purpose

This tranche continues D03 without opening forward outcomes while the preregistered three-completed-session PIT/source gate is still 2/3.

It answers two under-reconciled mechanism questions:

1. Is moving-average `offset/deduction price` an independent factor beyond direct return / MA slope?
2. Can ADX be treated as an independent third vote beside EMA trend state and Impulse MACD for anti-whipsaw confirmation?

The answer to both is **no by default**. The first has an exact algebraic redundancy; the second has a high shared-price-family redundancy prior and requires incremental testing.

No return, fill, threshold optimization, BUY/SELL rule, capital rule or Formal Core field is changed.

## TI-453 — SMA offset / deduction price is an exact slope identity, not a new factor

For an n-period simple moving average:

```
SMA_n(t) = (C_t + C_{t-1} + ... + C_{t-n+1}) / n
```

Therefore:

```
SMA_n(t) - SMA_n(t-1) = (C_t - C_{t-n}) / n
```

This is exact.

### Consequences

- The usual `deduction price` / `扣抵價` is `C_{t-n}`.
- The current one-step SMA slope is positive iff `C_t > C_{t-n}`.
- For positive prices, the sign is therefore exactly the sign of the corresponding n-period close-to-close return.
- A model must not count `SMA slope`, `price versus deduction price` and same-horizon `retN` as independent bullish/bearish votes.
- Magnitudes are not numerically identical because the slope is in price-units-per-period while retN is scale-normalized, but the directional state is algebraically duplicated.

### Future 1/3/5-day deduction sequence is a conditional threshold, not a forecast

For k future steps:

```
SMA_n(t+k) - SMA_n(t)
= [sum(C_{t+1}...C_{t+k}) - sum(C_{t-n+1}...C_{t-n+k})] / n
```

The outgoing prices are known at time t, but the incoming future closes are not.

Therefore a known future deduction sequence can define:
- the close threshold required to keep an SMA rising;
- a flat-price / scenario carry path;
- sensitivity to specified future-price paths.

It **cannot** by itself predict the realized future SMA slope without assuming future prices.

Any UI or research field that projects `future MA rise/fall` from deduction prices alone must be labeled scenario/conditional, not predictive truth.

## TI-454 — EMA has no single SMA-style deduction price

For EMA with alpha `a = 2/(n+1)`:

```
EMA_t - EMA_{t-1} = a * (C_t - EMA_{t-1})
```

This is exact.

Consequences:
- EMA slope direction is determined by current price versus prior EMA.
- Historical observations decay recursively; one old close is not mechanically removed as in SMA.
- Applying the SMA deduction-price rule directly to EMA is invalid.
- For the next bar, `EMA_{t+1}` rises iff unknown `C_{t+1} > EMA_t`.
- EMA16/64 slope, price-vs-EMA and price-derived momentum therefore require redundancy control before they can be counted separately.

The deterministic fixture verifies the exact SMA and EMA identities at machine precision.

## TI-455 — ADX is trend-strength, not direction

Wilder DMI/ADX is built from:
- positive directional movement (+DM);
- negative directional movement (-DM);
- true range (TR);
- Wilder smoothing;
- +DI / -DI;
- DX = normalized separation between +DI and -DI;
- ADX = smoothed DX.

ADX is directionless. Direction resides in +DI versus -DI (or another direction layer).

A synthetic symmetric witness produces:
- smooth uptrend ADX14 = 100;
- smooth downtrend ADX14 = 100;
- +DI dominates only in the uptrend;
- -DI dominates only in the downtrend.

Therefore:
- `ADX > threshold` cannot be a bullish vote.
- `ADX rising` cannot by itself mean bullish acceleration.
- If System 2 uses EMA16/64 for direction, ADX can only be studied as a quality/regime moderator unless +DI/-DI semantics are separately frozen.

External formula reference:
- StockCharts ChartSchool, Average Directional Index (ADX): https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-directional-index-adx

## TI-456 — Same net return can have radically different ADX

Deterministic 90-bar witnesses use the same OHLC construction:

- smooth 100 -> 120 path: ADX14 = 100;
- choppy 100 -> 120 path with identical net return: ADX14 ≈ 16.735;
- flat oscillating range: ADX14 ≈ 11.173.

This demonstrates a plausible non-redundant mechanism versus simple retN:
ADX is sensitive to **directional path efficiency**, not merely endpoint return.

However, this is mechanism evidence only.

It does NOT prove:
- that ADX predicts future Taiwan returns;
- that ADX improves System 1 or System 2;
- that 20/25 is an optimal threshold;
- that ADX adds value beyond MA slope, trend persistence, ATR%, breakout quality, Impulse MACD or Regime features.

The correct empirical question is conditional incremental value, not standalone ADX profitability.

## TI-457 — ADX and Impulse MACD are not independent votes by construction

LazyBear Impulse MACD uses:
- SMMA(high) / SMMA(low) as a smoothed price envelope;
- ZLEMA(HLC3) as the centerline;
- zero impulse while the centerline stays inside the envelope;
- signed displacement only when it exits the envelope.

Source:
- TradingView open-source Impulse MACD by LazyBear: https://www.tradingview.com/script/qt6xLfLi-Impulse-MACD-LazyBear/

ADX and Impulse MACD are not algebraically identical:
- ADX measures smoothed directional-movement separation normalized by TR and discards direction in the final ADX line;
- Impulse MACD is a signed dead-zone displacement of a low-lag centerline outside a smoothed H/L envelope.

But both are OHLC-derived attempts to distinguish directional movement from range/noise.

Therefore the prior is **shared-family / partial redundancy**, not independence.

### Frozen System 2 interpretation

Do NOT implement:

```
EMA16/64 bullish = 1 vote
Impulse MACD bullish = 1 vote
ADX high = 1 vote
3/3 = stronger evidence
```

Preferred hypothesis architecture:

```
Direction: EMA / direct trend state
Location: pullback / breakout / structural price state
Momentum/dead-zone: Impulse MACD
Trend-quality moderator: ADX only if residual value survives controls
Price confirmation: causal bar / support / breakout confirmation
Risk/extension: MA distance / ATR / RR / late-stage guard
```

ADX should initially be a moderator/diagnostic state, not a positive score.

## TI-458 — ADX warm-up requirement is materially stricter than the first KD/RSI/MACD pack

The existing D03 source audit established that an ordinary ~65-bar live history is sufficient for the frozen first-pass:
- KD9;
- RSI14;
- MACD12/26/9 under its research warm-up.

That statement must not be generalized to ADX14.

StockCharts notes that Wilder's repeated smoothing can require around 150 periods for stable ADX values relative to longer initialization.

A deterministic warm-up witness in the attached executable test produced the same final OHLC path with:

- full-history ADX14 = 16.076280;
- last-65-bars initialization = 16.905634 (delta +0.829354);
- last-150-bars initialization = 16.076396 (delta +0.000117).

This is synthetic mechanism evidence, not a population estimate.

Research consequence:
- ADX14 must freeze initialization/warm-up semantics before prospective capture.
- A 65-bar cache cannot automatically inherit the KD/RSI/MACD readiness claim.
- Threshold classifications near 20/25 can be sensitive to initialization, so threshold testing before warm-up equivalence is unsafe.
- Prefer reuse of an authorized longer shared history path if it exists; do not add D03-specific market-data calls merely to satisfy ADX.

## TI-459 — Falsification and future empirical design

### Primary null

After controlling:
- direct ret5/10/20/60;
- MA slope/alignment;
- trend-persistence heuristic;
- ATR% / realized volatility;
- breakout/pullback structure;
- Impulse MACD zero/nonzero and signed state;
- liquidity / price tier;
- market Regime and transition state;

ADX adds no meaningful incremental information for:
- D5/D10/D20 forward return;
- MFE / MAE;
- false-break / no-follow-through;
- whipsaw episode frequency;
- stop-hit / opportunity-cost outcomes.

If this null is not rejected with prospective PIT/OOS evidence, ADX remains explanatory/UI only.

### Required comparisons

1. Direct trend baseline.
2. Direct trend + Impulse MACD.
3. Direct trend + ADX.
4. Direct trend + Impulse MACD + ADX.
5. Residual ADX within the same Impulse state.
6. Residual Impulse state within the same ADX bucket/state.

No threshold sweep.

Start with a continuous ADX representation plus preregistered conventional 20/25 states only as descriptive robustness bins, not optimized cutoffs.

### Anti-overfit / anti-selection requirements

- Equal-date inference; scanDate is the independent cluster.
- Preserve parent population and blocked/UNKNOWN children.
- No selected-only success filtering.
- Separate Trend / Range / Transition Regimes.
- Report coverage and zero-pick effect if any guard is simulated.
- Include cost/slippage and opportunity cost for any hypothetical gating policy.
- Treat ADX +DMI and Impulse/EMA/MACD as one broader price-derived family until residual evidence proves otherwise.
- No multi-timeframe optimization before timeframe relationship is frozen ex ante.

## Deterministic executable evidence

File:
`research/test_technical_indicator_adx_offset_redundancy_v0_1.mjs`

Expected local result:
- SMA offset identity: EXACT/PASS;
- EMA slope identity: EXACT/PASS;
- ADX directionless symmetric witness: PASS;
- same-net-return path-dependence witness: PASS;
- 65-vs-150 warm-up sensitivity witness: PASS.

These fixtures are mechanism/falsification evidence only. They contain no market outcome lookup.

## External evidence / counterevidence anchors

- StockCharts ADX documentation confirms ADX measures trend strength regardless of direction, uses Wilder smoothing, and describes the conventional 20/25 interpretation while warning about lag and whipsaws.
- Chang, Metghalchi & Chan (2006), Applied Financial Economics 16(10), tests moving-average technical rules in Taiwan and reports predictive value in its historical sample. This supports testing technical trend state but does not validate ADX or current coefficients.
- Ko, Lin, Su & Chang (2014), Pacific-Basin Finance Journal 26, reports conditional value from moving-average timing in Taiwan value portfolios with robustness checks. It supports a conditional-regime view rather than universal parameter privilege.
- Current cross-market literature and practitioner research on whipsaw detection examine ADX alongside other price-derived filters, reinforcing that ADX is a candidate regime discriminator, not proof of independent alpha.
- LazyBear's Impulse MACD explicitly aims to filter values inside a smoothed MA range, creating a direct redundancy question with any ADX anti-whipsaw gate.

## Status after this tranche

SMA_OFFSET_DIRECTIONAL_REDUNDANCY = EXACT_ALGEBRAIC_PASS

EMA_SMA_STYLE_DEDUCTION = REJECTED_INVALID_SEMANTICS

FUTURE_DEDUCTION_AS_FORECAST = REJECTED; CONDITIONAL_THRESHOLD_ONLY

ADX_DIRECTION_AUTHORITY = NONE

ADX_VS_RETN_MECHANISM = DISTINCT_PATH_SENSITIVITY_PROVEN_SYNTHETIC

ADX_VS_IMPULSE_INDEPENDENCE = NOT_ESTABLISHED / REDUNDANCY_PRIOR_HIGH

ADX_65_BAR_WARMUP = NOT_GENERALIZABLE_FROM_KD_RSI_MACD

ADX_OUTCOME_VALUE = UNKNOWN

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

## Exact next continuation point

1. Preserve the existing 2/3 prospective completed-session source gate; do not manufacture a third date before the next Taiwan session completes.
2. After the third completed session, finish the preregistered source/version gate and only then unlock TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend outcome-blind-to-outcome transition under governance.
3. Before any ADX prospective snapshot, prove a stable long-enough history/warm-up contract and formulaVersion; compare short-cache versus long-history initialization on real outcome-blind rows.
4. Freeze ADX state fields (+DI, -DI, DX, ADX, warmupBars, formulaVersion, continuity state) as research-only if/when Class-A capture becomes eligible.
5. ADX efficacy testing follows TI-005/TI-006 and must be residualized against direct trend, ATR/regime and Impulse MACD. No additive vote and no threshold tuning.
