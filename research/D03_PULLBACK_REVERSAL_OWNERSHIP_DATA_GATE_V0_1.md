# D03 Pullback / Short-Term Reversal Ownership and Data-Gate Audit V0.1

Updated: 2026-10-03 Asia/Taipei  
Lane: D03-05｜Pullback（回檔）與短期反轉  
Classification: Class A（研究專用）  
Formal Core impact: NONE / LOCKED

## Purpose

This tranche determines whether D03-05 contains an independent factor candidate or only a duplicated representation of existing setup/execution logic.

Conclusion in advance:

`GENERIC_SHORT_TERM_REVERSAL_FACTOR = REJECTED_OR_REDUNDANT`

The residual research question is pullback **origin attribution**, not another reversal score.

No maturity promotion is authorized by this tranche.

---

## TI-516 — current A pullback already encodes a complete structural setup

Repository source audit of current A/PULLBACK selection shows the daily setup already requires:
- established trend;
- recent-high pullback roughly 2–15%;
- near-support condition;
- volume condition;
- structural condition;
- not-late / overheat guard.

The current 15m execution path then requires combinations of:
- entered / held;
- volumeOK;
- reversalK or strongClose;
- higherLow;
- turnUp.

Therefore a new generic field such as:

`shortTermReversalScore = negativeRet + oversold + reversalCandle`

would substantially duplicate:
- current A setup geometry;
- D01 Pattern reversal/reclaim structure;
- current 15m execution confirmation.

It is not an independent evidence family.

---

## TI-517 — pullback depth is not pullback cause

A 7% pullback can arise from different mechanisms:
- ordinary trend digestion;
- broad-market or sector drawdown;
- company-specific information;
- temporary liquidity pressure;
- constrained price discovery / limit state;
- multiple simultaneous causes;
- unknown cause.

Therefore:

`PULLBACK_DEPTH != PULLBACK_ORIGIN`.

D03 must not label a deeper-but-admitted pullback as “more reversal-ready” merely from depth.

If future evidence only shows a better/worse region inside the existing 2–15% band, classify it as threshold-calibration evidence, not a new factor family.

---

## TI-518 — residual v0.1 origin taxonomy

Research-only origin states:

1. `STRUCTURAL_DIGESTION_NO_IDENTIFIED_SHOCK`
2. `MARKET_OR_SECTOR_DRIVEN_PULLBACK`
3. `EVENT_INFORMATION_PULLBACK`
4. `LIQUIDITY_PRESSURE_CANDIDATE`
5. `PRICE_LIMIT_OR_CONSTRAINED_DISCOVERY`
6. `MULTIPLE_ORIGINS`
7. `UNKNOWN_ORIGIN`

These are moderators / diagnostics only.

No origin state maps directly to BUY/SELL.

---

## TI-519 — candles cannot certify liquidity-pressure reversal

A lower shadow, large volume, or later rebound does not identify non-informational order-flow pressure.

Taiwan evidence from Andrade, Chang & Seasholes (2008) links actual trading imbalances to predictable reversals using Taiwan Stock Exchange data.

The causal input was imbalance evidence, not candlestick morphology.

Therefore D03 may consume a D05 microstructure receipt only when the microstructure owner has valid:
- pressure/trade-side provenance;
- depth/spread context;
- price response;
- persistence/replenishment semantics;
- capture completeness.

Absent that:

`LIQUIDITY_PRESSURE_ORIGIN = UNKNOWN`.

No OHLCV fallback inference is allowed.

External source:
https://www.sciencedirect.com/science/article/pii/S0304405X08000214

---

## TI-520 — current D05 state blocks full origin attribution

Current D05 research explicitly states:
- true OFI requires real quote/order-book event data;
- OHLCV cannot reconstruct OFI/cancellation/queue state;
- current spread/depth recorder cadence is sparse;
- dynamic replenishment/resiliency requires higher-frequency/event-driven prospective data;
- true OFI/depth L3 remains blocked on own collection completeness/provenance.

Therefore D03-05 cannot claim a fully source-validated pullback-origin taxonomy today.

This is a cross-lane dependency, not a reason to fabricate a D03 substitute.

---

## TI-521 — event/market/sector origin also requires owner receipts

Origin ownership:
- market/sector context -> D09/D18 source lineage;
- company event/news -> D11/D17;
- liquidity pressure -> D05;
- price-limit/session constraint -> D01/D05 shared market-mechanism provenance;
- structural pullback geometry -> D01/D03.

D03-05 may join these receipts into one diagnostic row.
It may not recreate their source engines.

When two valid origin families coexist:
`MULTIPLE_ORIGINS`, not forced single-cause attribution.

---

## TI-522 — price-limit reversal is not ordinary mean reversion

Historical Taiwan price-limit research reports continuation in the overnight period after limit moves and reversal during the subsequent trading period in the historical regime.

That evidence demonstrates timing/mechanism heterogeneity, not a current 2026 universal reversal rule.

A price-limit-constrained pullback/reversal episode must retain:
- limit rule version;
- session state;
- constrained price-discovery state;
- overnight vs intraday decomposition where available.

It cannot be pooled with ordinary continuous-session pullbacks.

Historical effect sizes from the old 7% regime are not portable to the current 10% regime.

---

## TI-523 — reversal confirmation clock must be causal

For a pullback candidate:

`pullbackLowAt` is not the same as `reversalConfirmedAt`.

If confirmation requires:
- reclaim;
- strong close;
- higher low;
- turn-up;
- 15m acceptance;

the strategy could not have known the confirmed reversal at the low.

Future analysis must charge:
- bars from low to confirmation;
- price move already elapsed by confirmation;
- missed/opportunity-cost outcomes.

This inherits the D03-12 repaint-safe timing firewall.

---

## TI-524 — primary future comparison uses same setup, different origin context

Future valid design:

Parent cohort:
- same A/PULLBACK setup contract;
- same source/continuity quality;
- same pullback-depth/support/overheat controls;
- same execution-confirmation contract where applicable.

Compare:
- valid origin strata.

Primary outcomes:
- D5 return;
- D5 MFE/MAE;
- false-reversal / lower-low continuation;
- confirmation delay;
- opportunity cost.

Mandatory controls:
- pullback depth;
- support distance;
- ret20/ret60;
- persistence;
- Residual RS;
- Regime;
- volatility/ATR;
- liquidity;
- Pattern lifecycle;
- Price-Volume state.

The question is whether origin adds incremental information after existing setup quality is held fixed.

---

## TI-525 — no L3 promotion yet

D03-05 currently remains:

**L2 / 40% / MECHANISM_AND_FALSIFICATION_DEFINED**

Reason:
- generic reversal factor is already rejected as redundant;
- structural setup/confirmation data are PIT-feasible;
- but the residual independent question, pullback-origin attribution, still depends on cross-lane source families whose key liquidity-pressure branch lacks promotion-grade PIT capture/completeness.

Promoting D03-05 to L3 now would incorrectly treat “we can see a pullback” as “we can identify its cause.”

Frozen status:

`GENERIC_REVERSAL = REJECTED_OR_REDUNDANT`

`PULLBACK_ORIGIN = MODERATOR_DIAGNOSTIC`

`LIQUIDITY_PRESSURE_ORIGIN = DATA_GATED_BY_D05`

`D03_05 = L2_REMAINS`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

---

## Machine-readable contract

`research/d03_pullback_origin_contract_v0_1.json`

Rules:
- origin UNKNOWN unless required owner receipt is present;
- candle morphology never upgrades liquidity origin;
- multiple valid origins remain MULTIPLE;
- reversal confirmation time cannot backdate to pullback low;
- no origin state becomes a trade signal.

---

## Exact next continuation point

1. Keep D03-05 at L2/40.
2. Do not build another generic reversal factor.
3. Wait for D05 promotion-grade pressure/replenishment capture before testing LIQUIDITY_PRESSURE_CANDIDATE as a causal origin.
4. Structural/event/market origin studies may accumulate only with owner receipts and common-support setup controls.
5. D03 aggregate therefore remains 55.0% after TI-525.
6. Next outcome-blind D03 target should move to D03-09 ADX or D03-10 Bollinger only after checking whether their current L2 blockers can be reduced without bypassing the primary TI-005/TI-006 inference order; no maturity inflation from theory alone.
