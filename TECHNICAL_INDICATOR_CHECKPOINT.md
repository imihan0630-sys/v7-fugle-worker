# Technical Indicator Research Checkpoint

Updated: 2026-09-27 Asia/Taipei
Status: FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Purpose

Durable handoff for continuous traditional technical-indicator research.

When a new chat continues this lane, read:
1. TECHNICAL_INDICATOR_CHECKPOINT.md
2. TECHNICAL_INDICATOR_RESEARCH.md
3. KLINE_PATTERN_CHECKPOINT.md
4. TREND_MOMENTUM_REVERSAL_CHECKPOINT.md
5. PRICE_VOLUME_CHECKPOINT.md
6. latest RESEARCH_CHECKPOINT.md / RESEARCH_MASTER_MAP.md / RESEARCH_ENGINEERING_GOVERNANCE.md

Do not restart from generic indicator introductions.

## Current theme

TI — Traditional Indicator Incremental-Value / Redundancy Falsification

## Completed durable sections

- TI-001 indicator information decomposition
- TI-002 overbought/oversold sign firewall
- TI-003 Taiwan time-varying efficacy evidence
- TI-004 Bollinger sign-inversion warning
- TI-005 KD-vs-RSI preregistered redundancy test
- TI-006 MACD-vs-direct-trend preregistered redundancy test
- TI-007 parameter/divergence overfit firewall
- TI-008 regime-conditioned interpretation matrix
- TI-009 outcome design
- TI-010 first-tranche conclusions

## Key findings

1. KD, RSI and MACD are deterministic transforms of price and must start with a high redundancy prior.
2. KD and RSI are not algebraically identical. KD emphasizes rolling high-low close location; RSI emphasizes smoothed positive/negative close-to-close changes. Incremental value remains unproven.
3. MACD is structurally downstream of EMA/trend and therefore has especially high redundancy risk versus MA alignment/slope, direct returns and trend persistence.
4. Indicator extremes are state descriptors, not automatic BUY/SELL signs.
5. Taiwan evidence is historically mixed and time-varying. Older technical-rule profitability cannot be directly transported to the current market.
6. Pre-2020 Taiwan evidence is mechanism/background evidence, not current-regime effect-size evidence, because of the 2015 ±10% price-limit regime and 2020 continuous trading.
7. Taiwan 50 Bollinger evidence is an explicit counterexample to the symmetric folklore rule: upper-band contact need not be bearish.
8. Behavioral/liquidity evidence from Taiwan supports conditional interpretation of technical signals rather than one-sign scoring.
9. First empirical priority is incremental-value and redundancy testing, not adding more indicators.
10. No FORMAL_OPTIMIZATION_CANDIDATE from this tranche.

## Frozen baseline formulas for first engineering pass

- KD: Taiwan-common RSV9 + recursive 1/3 K and D smoothing. Exact initialization/formula version must be fingerprinted.
- RSI: Wilder RSI14.
- MACD: EMA12 / EMA26, signal EMA9.
- Bollinger: 20-period conventional baseline only as a comparator, not an optimized setting.

No parameter sweep before baseline mechanics and data semantics pass.

## Exact next continuation point

1. Freeze executable formula/version contracts, including initialization, missing-bar and corporate-action continuity semantics.
2. Audit current validated history sources for indicator generation with zero unnecessary new market-data calls.
3. Build outcome-blind deterministic synthetic fixtures for:
   - monotonic rise/fall;
   - range;
   - breakout/false breakout;
   - V reversal;
   - gap/corporate action;
   - suspension/no-trade pseudo-bar;
   - price-limit constrained sequence.
4. Require prefix invariance and replay exactness before outcome joining.
5. Design a research-only prospective indicator snapshot with raw components + formulaVersion + provenance + dataQuality.
6. After complete prospective coverage, run TI-005 KD-vs-RSI using equal-date inference and direct-price controls.
7. Then run TI-006 MACD-vs-trend.
8. Only after those are resolved, proceed to ADX vs trend-quality and Bollinger width vs ATR/VCP/range-compression.
9. Divergence research remains blocked until repaint-safe pivot/confirmation rules are frozen.
10. Formal Core remains unchanged.

## Latest durable commit

- 8e6ae4eb262d101122ff0d11fa4164a65460c718 — initialize technical indicator falsification lane.


## Continuation update — TI-011 through TI-013

- Outcome-blind synthetic mechanism fixtures materially falsify universal overbought/oversold direction rules. Monotonic-up, breakout and V-reversal paths can keep KD/RSI extreme while price continues higher.
- Trend-with-pullback fixtures expose time-scale conflict: short-horizon return can weaken while KD/RSI remain elevated and MACD remains positive.
- Spike/revert fixtures confirm KD and RSI are related but not identical because range-location and close-to-close gain/loss memory differ.
- Real adjusted-history source audit used Fugle FCNT000154 on 2330, 5314, 2006 and 4977 from 2026-06-01 through 2026-09-24, 82 returned daily bars per symbol. No forward outcomes were joined.
- Descriptive corr(K9,RSI14) ranged about 0.669 to 0.831 across these four windows.
- Descriptive corr(MACD DIF, MA20 five-day slope) ranged about 0.875 to 0.988, materially strengthening the high-redundancy prior for raw MACD trend state.
- Concrete disagreement states exist and are retained as QA witnesses: KD-high/RSI-neutral, RSI-high/KD-below-80, positive-MACD/negative-MA20-slope and negative-MACD/positive-MA20-slope.
- 5314 provides a current-regime price-limit-constrained stress path. Indicator extremes in constrained price discovery must consume canonical Pattern/Microstructure session guards; they are not ordinary overbought/oversold signals.
- No population inference, no alpha claim, no parameter tuning and no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Current status

FORMULA_BASELINE_FROZEN / SYNTHETIC_MECHANISM_PRIORS_PASS / REAL_SOURCE_REDUNDANCY_PRIOR_STRENGTHENED / LIMIT_CONSTRAINT_GUARD_REQUIRED / NO_OUTCOME_INFERENCE / FORMAL_LOCKED

### Updated exact next continuation point

1. Build isolated executable KD9-3-3, RSI14 and MACD12-26-9 research formulas with explicit initialization/version semantics.
2. Translate the frozen synthetic/adversarial scenarios into deterministic executable fixtures.
3. Require prefix invariance and replay exactness.
4. Add suspension/no-trade, corporate-action continuity and price-limit-constrained data-quality fixtures.
5. Freeze a prospective indicator snapshot contract with formulaVersion, source/provenance, continuity space, session constraints and dataQualityState.
6. No outcome joins until prospective coverage is complete.
7. First inference remains KD-vs-RSI residual incremental value; second remains MACD-vs-direct-trend.
8. Only after those gates proceed to ADX and Bollinger/ATR/VCP redundancy.
9. Divergence remains blocked until repaint-safe pivot/confirmation rules are frozen.
10. Formal Core unchanged.

## Latest durable research commits

- cdc67195c983d20804afb48daf7d31ec3fed6aab — indicator mechanism and real-source falsification.
- d9864b48059ac926dab6675cb7d0b403e0132213 — dedicated technical-indicator checkpoint creation.
- 8e6ae4eb262d101122ff0d11fa4164a65460c718 — technical-indicator lane initialization.
