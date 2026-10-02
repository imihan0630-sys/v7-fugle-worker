# Technical Indicator ROC Redundancy / Third-Session Transport Audit V0.1

Updated: 2026-10-02 Asia/Taipei  
Lane: D03｜技術指標與趨勢動能  
Classification: Class A（研究專用）  
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche continues D03 after TI-453~459.

Two questions are addressed without opening forward outcomes:

1. Can the preregistered third prospective completed-session source gate be closed from the current chat runtime?
2. Does ROC（Rate of Change，變動率）provide independent information beyond the already-registered direct return features ret5 / ret20 / ret60?

No forward return, fill, threshold optimization, BUY / SELL（買進／賣出）, capital, ranking or Formal Core behavior is changed.

---

## TI-460 — third completed-session source content exists, but transport is not receipt-equivalent

At 2026-10-02 after the completed Taiwan session:

- official TWSE（臺灣證券交易所）2026-10-02 MI_INDEX content is available with `stat=OK` and `date=20261002`;
- official TPEx（櫃買中心）2026-10-02 dailyQuotes content is available with `date=20261002`; the returned table reports `totalCount=11928`;
- a repeated TWSE fetch again returned the same trade-date content.

However, the available chat fetch path returns extracted / normalized document content rather than the origin raw response bytes used by the frozen observer protocol.

Therefore this tranche records:

`THIRD_SESSION_SOURCE_PRESENT = PASS`

but also:

`ORIGIN_RAW_BYTES_RECEIPT_EQUIVALENCE = NO`

and the preregistered gate remains:

`PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3`

This is deliberate. A transport substitution must not silently relax a preregistered PIT（Point-in-Time，時點一致性）gate.

External official evidence:
- TWSE market report / MI_INDEX, 2026-10-02.
- TPEx dailyQuotes, 2026-10-02.

No revision incidence estimate is opened.

---

## TI-461 — percent ROC is exactly the existing simple return

Standard percent ROC is:

```
ROC_n(t) = 100 * [C_t - C_(t-n)] / C_(t-n)
         = 100 * [C_t / C_(t-n) - 1]
```

If the existing direct-return feature is:

```
retN(t) = C_t / C_(t-n) - 1
```

then:

```
ROC_n(t) = 100 * retN(t)
```

This is an exact algebraic identity, not merely high correlation.

### Consequence

At the same lookback, price space and endpoint:

- ROC sign = retN sign;
- ROC zero-cross = retN zero-cross;
- ROC cross-sectional ordering = retN ordering;
- ROC percentile rank = retN percentile rank;
- any linear score using both double-counts the same signal.

Therefore D03 must not add standard ROC_n as a new independent score beside the same-horizon retN.

External formula corroboration:
- StockCharts ChartSchool ROC formula:
  https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/rate-of-change-roc
- TradingView ROC formula:
  https://www.tradingview.com/support/solutions/43000502343-rate-of-change-roc/

---

## TI-462 — Momentum index is only a shifted ROC

A common Momentum（動能）index convention is:

```
MOM_n = 100 * C_t / C_(t-n)
```

Therefore:

```
MOM_n = ROC_n + 100
```

The value 100 is the unchanged baseline instead of ROC's zero baseline.

This changes display semantics only. It does not create new information, new ordering, new timing or independent evidence.

Status:

`ROC_VS_MOMENTUM_INDEX = EXACT_AFFINE_REDUNDANCY`

---

## TI-463 — raw price difference creates a scale artifact, not clean incremental momentum

Another convention uses:

```
PriceDifference_n = C_t - C_(t-n)
```

This has the same direction as retN for positive prices, but its magnitude depends on the nominal stock price.

Synthetic witness:

- Stock A: 100 -> 110, return = +10%, price difference = +10.
- Stock B: 1000 -> 1100, return = +10%, price difference = +100.
- Stock C: 20 -> 23, return = +15%, price difference = +3.

A raw price-difference ranking would place B above C even though C has the larger percentage move.

Therefore raw price difference can introduce a price-level / tick-scale exposure rather than independent momentum information.

Cross-sectional use requires explicit scale normalization. Once normalized by the lagged price, it collapses back to ROC / retN.

---

## TI-464 — log return is a monotonic transform of percent ROC

For positive prices:

```
logReturn_n = ln(C_t / C_(t-n))
            = ln(1 + ROC_n / 100)
```

Thus within the same date/lookback universe:

- log return and ROC preserve the same rank ordering;
- sign is identical;
- threshold values map one-to-one.

Log return may be statistically convenient for aggregation or modeling, but it is not an independent directional factor from same-horizon ROC / simple return.

Status:

`ROC_VS_LOG_RETURN_RANK_INFORMATION = EXACT_MONOTONIC_REDUNDANCY`

---

## TI-465 — smoothed ROC or delta-ROC may be mechanically different, but independence is unproven

Possible variants include:

- SMA/EMA（簡單／指數移動平均） of ROC;
- change in ROC, `ROC_t - ROC_(t-k)`;
- slope of ROC;
- multi-horizon ROC stacks.

These are not algebraically identical to one instantaneous retN value, but they remain transformations of overlapping price returns.

They must first be compared against:

- ret5 / ret10 / ret20 / ret60;
- change in retN / return acceleration;
- MA slope / alignment;
- trend persistence;
- volatility / ATR（平均真實波幅）;
- Regime（市場狀態）;
- direct multi-horizon return interactions.

No smoothed ROC or ROC acceleration is a new factor family by default.

If residual information disappears after these controls, keep the variant as UI（介面）/ explanation only.

---

## TI-466 — ROC requires the same continuity and constraint firewall as other price-derived indicators

ROC is scale-invariant under a uniform multiplicative price transform but is vulnerable to piecewise discontinuities.

Example:

- economic price unchanged at 100;
- raw 2-for-1 split changes quoted price from 100 to 50;
- unadjusted one-period ROC = -50%.

That -50% is not an economic momentum crash.

Therefore ROC must preserve:

- raw versus adjusted / continuity price space;
- corporate-action ancestry;
- suspension / no-trade semantics;
- price-limit constrained state;
- official-session continuity;
- source/version PIT provenance.

Missing continuity evidence remains UNKNOWN.

A limit-up / limit-down or constrained price-discovery sequence may produce extreme ROC without revealing unconstrained latent demand/supply. It cannot automatically become an overbought/oversold reversal signal.

---

## TI-467 — Taiwan momentum evidence strengthens the Regime requirement, not ROC independence

Taiwan momentum research does not justify adding ROC as a new vote because ROC is already direct past return.

Relevant evidence:
- Lin, Ko, Feng & Yang (2016), Pacific-Basin Finance Journal 38, reports positive momentum during market-state continuations and reversal during transitions.
  DOI: 10.1016/j.pacfin.2016.03.009
- Chen, Hsieh & Lee (2023), Pacific-Basin Finance Journal 78, reports momentum persistency matters and nonpersistent winner/loser groups can reverse.
  DOI: 10.1016/j.pacfin.2023.101943

Research implication:

The interesting question is not “does ROC work?” as a separate indicator.

It is:

> Does the same return/momentum state behave differently after conditioning on Regime, persistence, structure, attention/liquidity and transition state?

That question belongs to D03-02 / D03-03 / D03-04 / D18 interaction, not to a duplicate ROC score.

---

## Executable deterministic fixture

File:

`research/test_technical_indicator_roc_redundancy_v0_1.mjs`

The fixture asserts:

1. `ROC_n == 100 * retN` across deterministic positive-price sequences.
2. common Momentum index `== ROC + 100`.
3. `logReturn == log1p(ROC/100)`.
4. rank order of ROC/simple-return/log-return is identical for positive prices.
5. raw price-difference ranking can differ from return ranking because of nominal price scale.
6. an unadjusted 2-for-1 split creates a false -50% ROC while a continuity-preserving adjusted series can remain 0%.

These are mathematical/mechanism assertions only. No market outcome is inspected.

---

## Maturity decision

D03-11 ROC moves from:

- L1 / 20% / 理論已理解

to:

- L2 / 40% / 機制＋反證已定義

because its formula semantics, exact redundancy, scale artifact, continuity failure mode, anti-double-count rule and future residual-test boundary are now explicit and reproducible.

The D03 aggregate changes from 46.2% to **47.7%** (620 / 13 / 100-scale rounding).

This is not an alpha promotion.

### Current status

`D03_11_ROC = L2_MECHANISM_AND_FALSIFICATION_DEFINED`

`STANDARD_PERCENT_ROC_VS_RETN = EXACT_REDUNDANCY`

`MOMENTUM_INDEX_VS_ROC = EXACT_AFFINE_REDUNDANCY`

`LOG_RETURN_VS_ROC_RANK = EXACT_MONOTONIC_REDUNDANCY`

`RAW_PRICE_DIFFERENCE = PRICE_SCALE_CONFOUNDED`

`SMOOTHED_OR_DELTA_ROC = RESIDUAL_VALUE_UNKNOWN`

`THIRD_SESSION_SOURCE_PRESENT = PASS`

`THIRD_SESSION_RAW_RECEIPT_EQUIVALENCE = NO`

`PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

---

## System 1 / System 2 reusable rule

Do NOT create separate positive weights/votes for:

- ret20 and ROC20;
- ret60 and ROC60;
- ROC and Momentum index of the same horizon;
- percentile-ranked ROC and percentile-ranked same-horizon simple/log return.

They encode the same ordering/information.

If a smoothed ROC, ROC slope or acceleration candidate is studied, residualize it against direct multi-horizon returns and trend/persistence first.

For System 2 resonance, ROC is not a new resonance family. It belongs inside the existing direct momentum family.

---

## Exact next continuation point

1. Keep the raw-byte three-session source gate formally open at 2/3 until the frozen observer (or a receipt-equivalent authorized transport) captures one new completed Taiwan session plus a same-trade-date repeat.
2. Do not backfill the 2026-10-02 raw receipt from extracted content.
3. While the gate remains open, continue mechanism/falsification work on D03 modules that do not require outcomes; next highest-value candidates are D03-13 multi-timeframe conflict semantics and the exact information overlap among multi-horizon returns, EMA16/64 and Impulse MACD.
4. Once the raw receipt gate is genuinely closed, TI-005 KD-vs-RSI remains the first efficacy inference; TI-006 MACD-vs-direct-trend is second.
5. Formal selection/ranking/capital/monitoring/signal/push behavior remains unchanged.
