# D03 Trend Persistence PIT / Tick-Confound Audit V0.1

Updated: 2026-10-03 Asia/Taipei  
Lane: D03-03｜趨勢持續性與 Persistence（持續性）  
Classification: Class A（研究專用）  
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche reconciles the exact current `price.persistenceScoreResearch` implementation with:
1. direct-return redundancy;
2. path-quality information;
3. Taiwan tick-size / zero-return confounding;
4. the distinct Chen-Hsieh-Lee (2023) cross-sectional momentum-persistency construct;
5. Taiwan PIT（Point-in-Time，時點一致性）data feasibility.

No outcome, score threshold, ranking, BUY/SELL（買進／賣出）, capital, monitoring or Formal Core behavior is changed.

## TI-474 — exact implementation recovered

The generated research patch defines:

```
persistenceScoreResearch =
  0.35 * positiveDayRatio20
+ 0.25 * positiveHorizonPct(ret5, ret10, ret20, ret60 > 0)
+ 0.20 * drawdownQuality20
+ 0.20 * maQuality20_60
```

where:

- `positiveDayRatio20` = percentage of the last 20 close-to-close returns strictly greater than zero;
- `positiveHorizonPct` = percentage of ret5 / ret10 / ret20 / ret60 that are strictly positive;
- `drawdownQuality20 = clamp(100 + 5 * maxDrawdown20Pct, 0, 100)`;
- `maQuality20_60` = 0 / 50 / 100 according to whether close is above neither / one / both of MA20 and MA60.

The construct is therefore a weighted **own-price-path trend-consistency heuristic**.

It is not the Chen-Hsieh-Lee (2023) definition of momentum persistency.

## TI-475 — exact score-step geometry

The score has mixed continuous/discrete geometry:

- one additional positive day out of 20 changes score by exactly **1.75 points**;
- one ret5/10/20/60 sign flip changes score by exactly **6.25 points**;
- one MA20/MA60 state flip changes score by exactly **10 points**;
- each additional 1 percentage point of 20-day max drawdown reduces score by **1 point** until the drawdown-quality floor is reached at -20%.

Consequences:

1. the score is not a smooth probability/confidence measure;
2. tiny price changes around a return-zero or MA boundary can create step changes;
3. threshold/rank sensitivity must distinguish genuine path change from boundary quantization.

Do not interpret a 10-point score difference as ten times the evidence of a 1-point difference.

## TI-476 — same multi-horizon returns can have different persistence

Deterministic synthetic witness fixes the same endpoints for:
- ret5;
- ret10;
- ret20;
- ret60.

Both paths:
- finish at the same close;
- have all four horizons positive;
- are non-decreasing over the last 20 bars;
- keep close above MA20/MA60;
- have zero economic drawdown in the last 20 bars.

Path A rises smoothly every day:
- positiveDayRatio20 = 100%;
- persistenceScoreResearch = 100.

Path B reaches the same horizon endpoints by an alternating rise/flat staircase:
- positiveDayRatio20 = 55%;
- persistenceScoreResearch = 84.25.

Thus the persistence score is **not algebraically identical** to ret5/10/20/60. It contains path-shape information.

This is positive mechanism evidence only. It does not prove forward-return alpha.

## TI-477 — zero-return days create a liquidity/tick-size confound

`positiveDayRatio20` counts a zero-return day exactly like a non-positive day for this component.

That means a smooth latent trend observed through a coarse price grid can receive a lower persistence score merely because closes do not change every session.

This is not a hypothetical concern unique to this implementation. The proportion of zero-return days has a long literature as an illiquidity / transaction-cost proxy.

Relevant external evidence:
- Lee (2011), Journal of Financial Markets, uses the zero-return proportion introduced by Lesmond, Ogden & Trzcinka (1999) as an international liquidity proxy.
- Current TWSE Operating Rules Article 62 sets stock price ticks by price tier: NT$0.01 / 0.05 / 0.10 / 0.50 / 1 / 5 across the standard stock price bands.

Therefore `positiveDayRatio20` is not a pure trend-persistence observable. It can partially absorb:
- price level;
- tick-to-price ratio;
- trading activity / stale closes;
- liquidity.

Primary external references:
- https://www.sciencedirect.com/science/article/abs/pii/S0304405X10001790
- https://twse-regulation.twse.com.tw/ENG/EN/law/DOC01.aspx?FLCODE=FL007304&FLNO=62

## TI-478 — Taiwan tick-grid synthetic falsification

A purely synthetic latent path rises +0.08% per session for 60 sessions.

The latent percentage path is identical across nominal starting prices. Observed closes are then rounded to the current TWSE stock tick grid.

Illustrative results:

| Start price | Approx starting tick/price | ret60 | positiveDayRatio20 | persistence |
|---:|---:|---:|---:|---:|
| 9.5 | 0.105% | 4.95% | 80% | 93.00 |
| 20 | 0.250% | 5.00% | 35% | 77.25 |
| 75 | 0.133% | 4.93% | 65% | 87.75 |
| 200 | 0.250% | 5.00% | 35% | 77.25 |
| 750 | 0.133% | 4.93% | 65% | 87.75 |
| 1200 | 0.417% | 5.00% | 20% | 72.00 |

This is a **mechanism witness only**:
- it is not an estimate of real-stock bias magnitude;
- it does not model order book, intraday trade path or closing-auction mechanics;
- it proves that identical latent percentage trends can map to materially different daily-sign counts under discrete price grids.

Therefore any future efficacy test of `persistenceScoreResearch` must control at least:
- price tier / relative tick size;
- zeroReturnRatio20;
- liquidity / turnover or an approved liquidity state;
- ordinary vs constrained/special sessions.

## TI-479 — the four weighted pieces remain one price-path family

All four components are derived from the same close path:

- positive-day signs;
- nested-horizon endpoint-return signs;
- drawdown from rolling peak;
- close location relative to MA20/60.

They are not four independent votes.

The composite may be useful as one summary state, but downstream systems must not also separately count all constituent states and then count the composite again without interaction accounting.

System 2 rule:

`persistenceScoreResearch` belongs to the **PRICE_TREND_PATH_QUALITY** family.

If retN / MA state / drawdown / positive-day ratio are already in a strategy, adding the composite requires explicit redundancy control.

## TI-480 — construct separation from Chen-Hsieh-Lee momentum persistency

Chen, Hsieh & Lee (2023), Pacific-Basin Finance Journal 78, 101943, studies persistency as **consecutive membership duration in winner/loser portfolios** formed from prior multi-month returns.

The current system score instead summarizes one stock's recent path.

Therefore:

```
CURRENT_PERSISTENCE_SCORE != CROSS_SECTIONAL_WINNER_LOSER_RETENTION_DURATION
```

No literature effect size, threshold or profitability from the 2023 paper may be attached to the current score.

The repository already freezes a separate prospective `momentum_rank_persistence_spec_v0_1.json`:
- same-scan ret60 rank proxy;
- complete full-universe receipt;
- consecutive official-session requirement;
- GAP_UNKNOWN on missing sessions;
- no historical rank-duration backfill.

External source:
- https://www.sciencedirect.com/science/article/pii/S0927538X23000094

## TI-481 — Taiwan PIT data feasibility for D03-03

D03-03 now has a complete outcome-blind feasibility path.

### A. Existing own-path persistence score

Minimum ordinary history requirement:
- 61 continuity-valid eligible closes for ret60;
- 60 closes for MA60;
- 21 closes for 20 one-day returns;
- 20 closes for max drawdown window.

Existing D03 source audit already observed 82 daily bars per symbol on real Taiwan symbols 2330 / 5314 / 2006 / 4977 and established that the shared history path carries the required close data.

Required PIT/provenance contract:
- scanDate / asOf;
- exact eligible official sessions;
- raw-history admission receipt;
- TECHNICAL_CONTINUITY receipt or explicit BLOCKED/UNKNOWN;
- corporate-action ancestry;
- constrained/special-session provenance;
- formulaVersion;
- parent decision / capture generation.

No future outcome is required to compute the state.

### B. Cross-sectional rank-persistency comparator

Repository audit already proves:
- same-scan feature rows can carry ret60 when 61 valid bars exist;
- a prospective full-universe ret60 rank can be formed without a new market-data family;
- retention duration advances only across consecutive official sessions with complete full-universe receipts;
- historical rank-duration reconstruction remains prohibited.

This validates **Taiwan PIT data feasibility**, not alpha.

## Maturity decision

D03-03 advances:

- L2 / 40% / MECHANISM_AND_FALSIFICATION_DEFINED

to:

- **L3 / 60% / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**

because:
- the exact system-native formula is recovered;
- path-vs-endpoint counterexamples are executable;
- Taiwan tick/zero-return confounding is explicitly frozen;
- required Taiwan close-history/source semantics are known and already source-feasible;
- rank-persistency prospective membership semantics are frozen;
- historical backfill is explicitly forbidden.

This promotion does NOT claim:
- future-return predictive value;
- OOS / Prospective Shadow evidence;
- a good score threshold;
- superiority to retN / Residual RS / pathEfficiency;
- Formal eligibility.

With the current **12-module** D03 curriculum, aggregate maturity becomes:

`600 / 12 = 50.0%`.

## Frozen future empirical nulls

### Own-path score null

Conditional on:
- ret5/10/20/60 levels;
- Residual RS;
- pathEfficiency / trend structure;
- price tier / relative tick;
- zero-return ratio;
- liquidity;
- volatility / Regime;
- constrained-session state;

`persistenceScoreResearch` adds no meaningful D5/D10/D20 information.

### Rank-retention null

Conditional on current ret60 rank level and existing own-path persistence:
consecutive winner-rank retention adds no meaningful incremental information.

If either null survives, the relevant construct stays descriptive/research-only.

## System 1 / System 2 implications

1. Do not treat persistenceScoreResearch as an independent cross-family vote beside its own retN/MA/drawdown components.
2. Do not interpret score magnitude as a calibrated probability.
3. Control zero-return / tick / liquidity exposure before attributing an effect to trend persistence.
4. Do not rename the existing score as literature-style momentum persistency.
5. For System 2 resonance, use raw component provenance and one family-level trend-quality state before cross-family confluence.
6. No Formal Core change.

## Deterministic executable evidence

File:
`research/test_d03_trend_persistence_tick_confound_v0_1.mjs`

The fixture verifies:
- exact score-step sizes;
- same ret5/10/20/60 endpoints can coexist with 100 vs 84.25 persistence;
- current TWSE tick-grid synthetic path can generate large positive-day-ratio and persistence differences from an identical latent percentage trend;
- score remains bounded and formula-identical to the frozen implementation.

In-session equivalent deterministic calculation: PASS.
Repository CI execution: NOT_TRIGGERED / UNKNOWN until a workflow explicitly runs the fixture.

## Status

`D03_03 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`

`OWN_PATH_PERSISTENCE = DISTINCT_FROM_RET_LEVEL_BUT_SHARED_PRICE_FAMILY`

`ZERO_RETURN_TICK_LIQUIDITY_CONFOUND = MATERIAL_MECHANISM_RISK`

`SCORE_CONTINUITY = PIECEWISE_STEPWISE_NOT_CALIBRATED_PROBABILITY`

`RANK_PERSISTENCY = DISTINCT_CONSTRUCT / PROSPECTIVE_ONLY / ALPHA_UNKNOWN`

`OUTCOME_INFERENCE = NO_GO`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Exact next continuation point

1. Preserve the raw-byte source/version gate at 2/3; Saturday 2026-10-03 cannot create a new Taiwan completed trading session.
2. Freeze one research-only component-level persistence snapshot contract carrying positiveDayRatio20, zeroReturnRatio20, positiveHorizonPct, drawdownQuality20, maQuality, relativeTickPct, liquidity state and provenance without changing Formal behavior.
3. Do not run outcomes until prospective parent coverage / source gate allows it.
4. When empirical inference opens, test own-path persistence residual value before any new threshold; separately test rank-retention conditional on current ret60 rank.
5. Continue D03-12 repaint-safe divergence PIT feasibility next; it reuses confirmed Pattern swing chronology and may reach L3 only if pivot confirmation clocks and indicator state lineage can be replayed without look-ahead.
