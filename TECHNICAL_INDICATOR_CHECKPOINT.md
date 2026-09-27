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


## Continuation update — TI-014 through TI-016

- Source audit confirms existing V8 raw daily history already has sufficient high/low/close depth for KD9, RSI14 and MACD12/26/9. No extra ordinary candle call is justified for these formulas.
- The real blocker is semantic: current Formal history is RAW while production TECHNICAL_CONTINUITY remains unresolved across corporate-action boundaries.
- KD and RSI are mathematically invariant to a uniform positive affine price transform, but a corporate-action boundary is piecewise and can still contaminate the rolling window.
- MACD zero/crossover state is scale-invariant under a uniform positive scale factor, but raw DIF/histogram magnitude scales with stock price. Raw MACD magnitude is therefore not a valid cross-sectional comparison.
- First normalized MACD research comparators are frozen as DIF/close and histogram/close percentages. ATR-normalized variants are deferred to robustness testing to avoid immediate double-normalization.
- KD/RSI/MACD do not require volume, so lot/share/unit semantics are not first-order blockers for these three indicators. They remain important for OBV and later price-volume hybrids.
- Additional Taiwan evidence is conflicting across periods and designs. Positive RSI/MACD results coexist with evidence that MACD/RSI did not significantly dominate buy-and-hold overall and that combining indicators did not automatically improve performance.
- Cross-market stochastic evidence independently supports a regime/horizon-dependent interpretation of overbought persistence rather than an automatic sell rule.
- Isolated Class-A module added: research/technical_indicator_core_v0_1.mjs.
- Isolated deterministic test added: research/test_technical_indicator_core_v0_1.mjs.
- Independent local Node execution PASS for monotonic up/down, flat, breakout, price-limit-constrained interpretation, suspension pseudo-bar blocking, corporate-action continuity blocking, prefix invariance and replay exactness.
- Repository production workflow run 36320786494 completed SUCCESS after the research-only commits. The four technical-indicator commits were independently audited and changed only the two indicator documents plus the isolated research module/test; Worker.js was not modified by those commits.
- No outcome join, no parameter optimization, no Formal decision impact and no FORMAL_OPTIMIZATION_CANDIDATE.

### Current status

FORMULA_CORE_EXECUTABLE / SYNTHETIC_QA_PASS_ISOLATED / ZERO_EXTRA_CALL_FEASIBLE_CONDITIONALLY / TECHNICAL_CONTINUITY_RUNTIME_BLOCKED / REDUNDANCY_PRIOR_STRONG / OUTCOME_INFERENCE_NOT_STARTED / FORMAL_LOCKED

### Updated exact next continuation point

1. Keep runtime wiring blocked; do not attach the indicator core to Worker.js.
2. Add real-source replay fixtures only where symbol-session and continuity semantics are already independently verified.
3. Freeze the prospective snapshot schema and parent identity before any forward-outcome join.
4. When complete prospective coverage exists, run TI-005 KD-vs-RSI residual incremental-value tests by independent date.
5. Then run TI-006 MACD versus MA slope/alignment/ret5-60/trend persistence using normalized MACD magnitudes as the cross-sectional primary representation.
6. Test disagreement states explicitly; do not treat agreement count as confluence.
7. Only after TI-005/TI-006 resolve, proceed to ADX versus trend-quality and Bollinger width versus ATR/range-compression/VCP.
8. OBV remains owned by Price-Volume and must not be smuggled into the technical-indicator family as an independent vote.
9. Divergence remains blocked until repaint-safe pivots and confirmation timing are frozen.
10. Formal Core unchanged.

## Engineering evidence for this tranche

- cdc67195c983d20804afb48daf7d31ec3fed6aab — research mechanism + real-source falsification.
- e0c87857e795c4a45c47dbb8bb2b1bdc4141aac4 — checkpoint advance through TI-013.
- b59edd4f573d7807f0fe9dea5d7fcde01ce5ffda — isolated technical-indicator core.
- e01a1264d28b38e54a85b11131ed334ba01ddd73 — deterministic technical-indicator adversarial test.
- GitHub Actions V8 Cloudflare Deploy run 36320786494 — SUCCESS; production contract/regression/deployed-version verification all passed.


## Continuation update — TI-017 through TI-018

- Repaint-safe divergence specification v0.1 is frozen.
- Primary divergence geometry reuses confirmed Pattern price swings with pivotAt + confirmedAt; the indicator lane does not create a second primary swing detector.
- Indicator values are sampled at confirmed price-pivot dates. Independent indicator pivots are deferred to a later robustness comparator because they add matching/tolerance degrees of freedom.
- Divergence output is continuous descriptive geometry, not a BUY/SELL boolean.
- RSI/KD divergences must pass mutual redundancy and direct-price controls before either can score.
- MACD divergence must use normalized magnitude for cross-sectional inference.
- Prospective snapshot contract v0.1 frozen in research/technical_indicator_snapshot_contract_v0_1.json.
- Snapshot contract reuses existing Shadow parent identity (scanDate, symbol, parentSnapshotHash), forbids cohort_rank as identity, preserves as-of/provenance/formula version and separates BLOCKED / WARMUP / CONSTRAINED / OBSERVABLE.
- No historical Shadow fabrication; no runtime wiring; no outcome join until complete prospective coverage and replay/prefix gates pass.
- Formal Core remains LOCKED.

### Current status

FORMULA_CORE_EXECUTABLE / SYNTHETIC_QA_PASS_ISOLATED / SNAPSHOT_CONTRACT_FROZEN / DIVERGENCE_SPEC_FROZEN / ZERO_EXTRA_CALL_FEASIBLE_CONDITIONALLY / TECHNICAL_CONTINUITY_RUNTIME_BLOCKED / OUTCOME_INFERENCE_NOT_STARTED / FORMAL_LOCKED

### Exact next continuation point

1. Build v0.2 research snapshot wrapper implementing warm-up and normalized MACD fields without Worker wiring.
2. Add exact real-source semantic fixtures only from already-verified symbol/session/corporate-action witnesses.
3. Keep all current evidence outcome-blind.
4. Await/accumulate prospective complete parents before TI-005/TI-006 outcome inference.
5. In parallel, theory/falsification work may proceed on ADX versus trend-quality and Bollinger width versus ATR/VCP, but no outcome search or score promotion before the primary redundancy lane resolves.
6. Formal Core unchanged.
