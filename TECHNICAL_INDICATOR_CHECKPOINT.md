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


## Continuation update — TI-019 through TI-026

- ADX/DMI mechanism decomposition is frozen. ADX is a directionless trend-strength descriptor derived from directional movement normalized by True Range; high ADX is not bullish by itself.
- ADX begins with a high redundancy prior versus MA slope/alignment, trendPersistence, HH/HL/LH/LL progression, direct returns, directional efficiency and ATR-normalized trend quality.
- First ADX inference must test incremental value after those direct controls. ADX level and ADX slope are separate hypotheses; conventional 20/25/40 thresholds are not assumed universal and no threshold sweep is allowed.
- Taiwan-specific ADX alpha evidence is currently weak. A 2019 NCU thesis supports feasibility in a combined fundamental/MA/ADX strategy but not standalone incremental value. A 2026 Taiwan practitioner backtest is retained only as a current-regime counterexample showing that high ADX alone can also select strong downtrends.
- Bollinger Band Width is decomposed as rolling close dispersion relative to SMA; %B is standardized price location. BBW therefore has a high redundancy prior versus realized volatility, ATR%, range compression and VCP/Platform geometry.
- BBW and ATR are related but not identical: BBW uses dispersion of closes; ATR includes high-low range and gaps. This difference is the primary plausible incremental-information channel.
- Taiwan 50 evidence from Ni et al. (2020) remains an important sign-firewall witness: upper-band events supported a momentum/long interpretation in that sample, directly rejecting upper-band-touch = automatic SELL.
- A 2025 NCU Taiwan-index-futures Bollinger+ATR thesis supports practical joint use but is not directly portable to stock-selection incremental value.
- Frozen falsification order: KD-vs-RSI -> MACD-vs-direct-trend -> ADX-vs-direct-trend-quality -> BBW-vs-ATR/realized-vol/range-compression/VCP.
- New outcome-blind research contract: `research/TECHNICAL_INDICATOR_ADX_BOLLINGER_V0_1.md`.
- No forward outcomes inspected, no threshold optimization, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

FORMULA_CORE_EXECUTABLE / SYNTHETIC_QA_PASS_ISOLATED / SNAPSHOT_CONTRACT_FROZEN / DIVERGENCE_SPEC_FROZEN / ADX_BOLLINGER_FALSIFICATION_SPEC_FROZEN / OUTCOME_INFERENCE_NOT_STARTED / FORMAL_LOCKED

### Updated exact next continuation point

1. Extend the isolated research core with Wilder DMI/ADX14 and conventional Bollinger20x2; do not touch Worker.js.
2. Add deterministic adversarial fixtures for ADX directionlessness and ATR-vs-BBW disagreement.
3. Require prefix invariance and replay exactness.
4. Add DMI/ADX/Bollinger raw components to a versioned research snapshot only after schema review.
5. Keep all current work outcome-blind until prospective parent coverage is complete.
6. Preserve inference order: TI-005 KD-vs-RSI, TI-006 MACD-vs-trend, then ADX and Bollinger redundancy.
7. No fixed textbook threshold promotion and no multi-indicator majority voting.
8. Formal Core unchanged.

## Latest durable research commit

- `6c596db1775a507edc1fb5df125d15644947f4d2` — ADX / Bollinger redundancy falsification v0.1.


## Continuation update — TI-027 through TI-035

- ATR is frozen as a volatility/risk-normalization descriptor, not a directional BUY/SELL factor. Current Formal already couples atrPercent into admission, stop geometry and reward/risk; a separate ATR score would risk structural double counting.
- Taiwan 2025 index-futures Bollinger+ATR evidence supports volatility/risk-management use but is not direct stock-selection alpha evidence.
- A 2026 Taiwan momentum study covering 1993-2025 finds volatility-scaled momentum variants outperform conventional variants in its design. This strengthens the case for volatility management, not raw ATR directionality.
- Standard ROC_N is algebraically identical to the equivalent N-period percentage return: ROC_N = 100*(C_t/C_(t-N)-1). Since current research/Formal already preserves ret5/ret10/ret20/ret60, ROC level is REJECTED_OR_REDUNDANT_AS_NEW_FACTOR.
- Raw absolute Momentum_N = C_t-C_(t-N) is price-unit dependent; once normalized it collapses to ROC/return geometry.
- The only residual ROC/Momentum hypothesis retained is acceleration/deceleration/transition geometry, which must prove incremental value beyond direct multi-horizon returns, MACD histogram slope, MA-slope change, Pattern lifecycle and regime state.
- Taiwan momentum evidence is explicitly state-dependent: market continuation vs transition, intraday vs overnight origin, turnover/liquidity and volatility context can flip the sign. Generic ROC thresholds therefore have low portability.
- OBV is frozen under PRICE_VOLUME ownership, not as an independent technical vote. It is cumulative signed volume and starts with a high redundancy prior versus RVOL, same-slot/cumulative pace, price response, close location, effort-vs-result and acceptance/rejection lifecycle.
- Older Taiwan evidence found KD+OBV could outperform KD alone in some samples, so signed-volume information is not dismissed outright. However these studies do not establish incremental value beyond the richer current Price-Volume engine.
- OBV requires stricter data semantics than KD/RSI/MACD because volume magnitude is first-order: shares/lots, sub-lot activity, trading-unit changes, suspension/no-trade pseudo-bars and session provenance are mandatory gates.
- New outcome-blind research contract: research/TECHNICAL_INDICATOR_ATR_ROC_OBV_V0_1.md.
- No forward outcomes inspected, no threshold optimization, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

ATR = RISK_NORMALIZER_CONFIRMED_ROLE / DIRECTIONAL_ALPHA_UNPROVEN / FORMAL_COUPLING_HIGH

ROC_LEVEL = REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

ROC_ACCELERATION = RESEARCH_HYPOTHESIS / REDUNDANCY_HIGH / ALPHA_UNKNOWN

OBV = PRICE_VOLUME_COMPARATOR_ONLY / REDUNDANCY_HIGH / DATA_SEMANTICS_SENSITIVE / ALPHA_UNKNOWN

FORMAL_OPTIMIZATION_CANDIDATE = NONE

### Updated exact next continuation point

1. Do not add ROC level to the indicator core as a separate factor; map equivalent ROC horizons to existing retN fields.
2. Freeze at most one minimal return-acceleration descriptor before outcomes; no ROC lookback sweep.
3. Keep ATR in volatility/risk normalization and explicitly control the existing ATR->stop->RR path in any future selection-alpha study.
4. Keep OBV under Price-Volume ownership and define a normalized signed-volume comparator before any outcome work.
5. OBV divergence must reuse the repaint-safe Pattern pivot chronology.
6. Continue the already-frozen primary inference order: KD-vs-RSI -> MACD-vs-trend -> ADX-vs-trend-quality -> BBW-vs-ATR/VCP.
7. Only after those primary redundancy gates resolve should ROC acceleration or OBV incremental-value inference begin.
8. Formal Core remains unchanged.

## Latest durable research commit

- 0d72d03c38d852937216358bc8154349ab4e5848 — ATR / ROC / OBV redundancy falsification v0.1.


## Continuation update — TI-036 through TI-045

- A formal Factor-Zoo redundancy audit is now frozen before any new prospective indicator capture.
- Williams %R is an exact linear rescaling of Fast Stochastic %K; it is REJECTED_OR_REDUNDANT as a new factor and needs no separate outcome study.
- StochRSI is a nested Stochastic transform of RSI. It may alter sensitivity/event frequency but introduces no new source family and is LOW_PRIORITY_REDUNDANT.
- CCI is Typical-Price distance from its moving center normalized by Mean Deviation; it overlaps MA-distance, standardized-location and volatility/extension features and is LOW_PRIORITY / REDUNDANCY_HIGH.
- MFI is an RSI-like positive/negative TypicalPrice*Volume ratio and is assigned to PRICE_VOLUME ownership as a comparator only.
- Keltner Channel is a deterministic trend-center + range/volatility envelope and is REJECTED_OR_REDUNDANT as a new information family.
- Donchian Channel is a rolling highest-high/lowest-low wrapper. Existing priorHigh/priorLow/structural-breakout logic already owns this information; it is REJECTED_OR_REDUNDANT as a new factor.
- Parabolic SAR is a path-dependent trailing-stop system with sideways whipsaw risk; it is a POSITION_MANAGEMENT research concept, not a stock-selection vote.
- Ichimoku is a multi-horizon rolling high/low midpoint + trend/support-resistance composite. It begins with high redundancy and an explicit PIT/display-coordinate hazard because forward/backward plotting positions are not information-availability timestamps.
- Heikin-Ashi is a synthetic OHLC visualization/smoothing transform. Synthetic prices are not executable prices and can obscure gaps; status VISUALIZATION_ONLY.
- New durable artifact: research/TECHNICAL_INDICATOR_FACTOR_ZOO_AUDIT_V0_1.md.
- New machine-readable anti-double-counting artifact: research/technical_indicator_redundancy_registry_v0_1.json.
- No new indicator family was promoted to the primary inference queue.
- No forward outcomes inspected, no threshold sweep, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Factor-Zoo triage

REJECTED_OR_REDUNDANT:
- Williams %R
- ROC level
- normalized Momentum level
- Keltner Channel as an independent family
- Donchian Channel as an independent factor

LOW_PRIORITY_REDUNDANCY_HIGH:
- StochRSI
- CCI

PRICE_VOLUME_COMPARATOR_ONLY:
- OBV
- MFI

ROLE_SEPARATED:
- ATR -> volatility/risk normalization
- Parabolic SAR -> position/trailing-stop research
- Ichimoku -> structural explanation by default
- Heikin-Ashi -> visualization only

### Updated exact next continuation point

1. Use research/technical_indicator_redundancy_registry_v0_1.json as the anti-double-counting authority for new technical-indicator proposals.
2. Do not allocate prospective Shadow coverage to algebraic aliases or deterministic wrappers.
3. Keep the primary empirical queue unchanged:
   KD vs RSI -> MACD vs direct trend -> ADX vs direct trend quality -> Bollinger width vs ATR/realized-vol/VCP.
4. In parallel, freeze only one minimal ROC-acceleration descriptor and one normalized signed-volume comparator, but do not inspect outcomes yet.
5. Any future MFI/OBV study remains under Price-Volume governance and must use explicit volume-unit/session provenance.
6. Any future Parabolic-SAR/Supertrend/Chandelier work belongs to Position Management and must be compared against existing stop/reduce/re-add mechanics, not selection alpha.
7. Formal Core remains unchanged.

## Latest durable research commits

- 934dd242db9d1a35c547a4423949489526fb8ba2 — technical-indicator Factor-Zoo redundancy audit v0.1.
- 38efacfbeb4478f745a75b9f020f832aaf359e20 — machine-readable technical-indicator redundancy registry v0.1.
- 0d72d03c38d852937216358bc8154349ab4e5848 — ATR / ROC / OBV redundancy falsification v0.1.


## Continuation update — TI-046 through TI-050

- Standard ROC level remains rejected as a duplicate of existing retN. Instead, exactly one residual return-transition descriptor is preregistered before outcomes:
  - g5 = ln(C_t / C_(t-5)) / 5
  - g20 = ln(C_t / C_(t-20)) / 20
  - returnVelocityShift5v20 = g5 - g20
- returnVelocityShift5v20 describes short-horizon return velocity versus a medium-horizon baseline. It is not a BUY/SELL sign and must later control ret5/10/20/60, MACD histogram slope, MA-slope change, trendPersistence, Pattern lifecycle, overheat and regime.
- No 3v10/5v10/10v20/20v60 grid or parameter sweep is allowed before the 5v20 baseline is falsified.
- Raw cumulative OBV is not cross-sectionally convenient because its level depends on arbitrary starting history and can retain one-off volume shocks. A bounded V0.1 comparator is frozen instead:
  signedVolumeBalance20 = sum(sign(close_i-close_(i-1))*volume_i) / sum(volume_i), range [-1,+1].
- signedVolumeBalance20 represents close-signed volume balance only. It is NOT CVD, true order flow, aggressive-buy volume or institutional accumulation.
- signedVolumeBalance20 remains PRICE_VOLUME-owned and must later be compared with RVOL, turnover, price response, close location, effort-vs-result and acceptance/rejection lifecycle.
- Volume-unit, trading-unit, sub-lot, symbol-session, pseudo-bar and corporate-action/session semantics are mandatory first-order guards for signedVolumeBalance20.
- Both residual descriptors are preregistered outcome-blind in research/TECHNICAL_INDICATOR_RESIDUAL_DESCRIPTORS_V0_1.md.
- No forward outcomes inspected, no threshold optimization, no runtime wiring and no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

RETURN_VELOCITY_SHIFT_5V20 = SPEC_FROZEN / OUTCOME_UNTESTED / REDUNDANCY_HIGH

SIGNED_VOLUME_BALANCE20 = SPEC_FROZEN / PRICE_VOLUME_OWNED / DATA_SEMANTICS_SENSITIVE / OUTCOME_UNTESTED

FORMAL_OPTIMIZATION_CANDIDATE = NONE

### Updated exact next continuation point

1. Preserve returnVelocityShift5v20 and signedVolumeBalance20 as the only V0.1 residual ROC/OBV-style descriptors; do not proliferate parameter variants.
2. Do not wire either descriptor into Worker.js, Formal selection, System 2 scoring or monitoring.
3. Primary empirical priority remains:
   KD-vs-RSI -> MACD-vs-direct-trend -> ADX-vs-direct-trend-quality -> BBW-vs-ATR/realized-vol/VCP.
4. Only after those primary redundancy gates resolve may returnVelocityShift5v20 or signedVolumeBalance20 consume an outcome-testing budget.
5. signedVolumeBalance20 must prove value beyond the richer Price-Volume engine; returnVelocityShift5v20 must prove value beyond direct return-path and trend-transition features.
6. Future snapshot extension requires formulaVersion, provenance, continuity/session guards and complete prospective parent coverage.
7. Formal Core remains unchanged.

## Latest durable research commit

- 5284845710e05d756b894071da62e2ffad05cf86 — preregistered residual return-velocity and signed-volume descriptors v0.1.


## Continuation update — TI-051 through TI-079

- Second-stage Factor-Zoo audit collapses more named indicators back into a small number of information families rather than expanding the catalog.
- PPO is a normalized MACD/MA-spread representation and is retained only as a scale-normalization robustness comparator.
- CMO is affine-equivalent to RSI when the gain/loss smoothing kernel matches: CMO = 2*RSI - 100. Different implementations change smoothing, not source-family identity. CMO is REJECTED_OR_REDUNDANT as a new family.
- TSI is double-smoothed signed return divided by double-smoothed absolute return; it remains a highly redundant signed-return/momentum representation.
- TRIX is one-period ROC of a triple-smoothed EMA; it is a filtered-trend robustness comparator, not a new information family.
- Awesome Oscillator is a fast-minus-slow SMA spread on median price and is rejected as a new family.
- DPO is a displaced historical cycle descriptor; conventional plotting does not extend to the present bar and creates a calculationAsOf vs plotCoordinate hazard. It is CYCLE_RESEARCH_ONLY / ROLE_MISMATCH_FOR_CURRENT_SELECTION.
- Aroon yielded the only newly promoted residual question from this tranche: time since the most recent rolling extreme. Repository audit did not find a canonical general daysSinceHigh/daysSinceLow technical field.
- Named Aroon signals are NOT promoted. Instead EXTREME_RECENCY_20 is preregistered using the existing 20-session structural window:
  daysSinceHigh20 / daysSinceLow20 = eligible symbol sessions since the MOST RECENT equal rolling extreme; calendar gaps/suspensions do not count as ordinary bars.
- EXTREME_RECENCY_20 has no universal bullish/bearish sign and must be tested after distance-to-high/low, Pattern lifecycle, resistance age, returns, trend, overheat, volatility, Price-Volume and regime controls.
- Deterministic adversarial fixtures are frozen for same-distance/different-age, equal-high tie, new high today, verified suspension, pseudo-bar, corporate-action discontinuity, consecutive-limit-up and old-high/current-breakout cases.
- Vortex is a DMI/ATR cousin: cross-bar high/low reach normalized by True Range. It is retained only as a DMI robustness comparator.
- Ultimate Oscillator is multi-horizon close/true-range location with fixed 7/14/28 and 4:2:1 weights; high redundancy with closeLocation, ATR, KD/range-location and direct returns.
- CMF is assigned to PRICE_VOLUME. It preserves within-bar close location weighted by volume and is a potentially richer compact comparator than OBV, but remains subordinate to the richer Price-Volume engine.
- Raw ADL is cumulative and has arbitrary-start/permanent-shock issues; Chaikin Oscillator is a nested MACD-like filter of ADL. Neither is an independent technical vote.
- Chaikin Volatility is ROC of smoothed high-low range and is rejected as a new factor versus ATR/BBW/range-compression.
- Machine-readable redundancy registry extended with PPO/CMO/TSI/TRIX/Aroon/Vortex/UO/CMF/ADL/Chaikin families.
- Internal dependency governance is now frozen: level, zone, crossover, slope, persistence, divergence and signal-line states derived from one parent indicator cannot be counted as independent votes by default.
- RSI zone is a quantization of RSI level; MACD crossover/histogram/zero-line/slope are path transforms of DIF/signal; ADX strength labels derive from ADX; Bollinger squeeze/touch states derive from bands; Aroon-like labels derive from extreme-recency primitives.
- Persistence may contain path-duration information but must prove incremental value conditional on the current parent level/state.
- Divergence is PRICE_STRUCTURE x INDICATOR_STATE interaction evidence, not a new raw family; primary pivots remain owned by Pattern.
- Threshold search inside one indicator is recognized as hidden multiple testing and is subject to the same overfit governance as cross-indicator Factor Zoo search.
- New durable artifacts:
  - research/TECHNICAL_INDICATOR_FACTOR_ZOO_AUDIT_V0_2.md
  - research/TECHNICAL_INDICATOR_EXTREME_RECENCY_V0_1.md
  - research/TECHNICAL_INDICATOR_INTERNAL_DEPENDENCY_V0_1.md
  - research/technical_indicator_field_dependency_graph_v0_1.json
  - updated research/technical_indicator_redundancy_registry_v0_1.json
- No forward outcomes inspected, no threshold tuning, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated information-family taxonomy

A. RETURN / SIGNED CHANGE
- RSI / CMO / TSI / ROC / Momentum / returnVelocityShift

B. FILTERED TREND
- MACD / PPO / APO / TRIX / Awesome Oscillator / MA slope

C. RANGE LOCATION / POSITION
- KD / Williams %R / Ultimate Oscillator / CCI / Bollinger %B

D. DIRECTIONAL RANGE / TREND STRENGTH
- DMI / ADX / Vortex

E. VOLATILITY / DISPERSION
- ATR / Bollinger width / Chaikin Volatility / realized volatility / range compression

F. PRICE-VOLUME
- OBV / signedVolumeBalance / MFI / CMF / ADL / Chaikin Oscillator

G. STRUCTURAL RECENCY / TIME
- EXTREME_RECENCY_20 (Aroon-derived primitive)

H. POSITION MANAGEMENT / VISUALIZATION
- Parabolic SAR / Heikin-Ashi / related stop overlays

### Updated empirical priority

Primary:
1. KD vs RSI residual value
2. MACD vs direct trend
3. ADX vs direct trend quality
4. BBW vs ATR / realized-vol / VCP

After primary gates:
5. EXTREME_RECENCY_20
6. returnVelocityShift5v20
7. signedVolumeBalance20 or CMF-style compact Price-Volume comparator under Price-Volume governance

No other newly audited indicator receives a prospective outcome-testing priority.

### Updated exact next continuation point

1. Reconcile EXTREME_RECENCY_20 ownership against Pattern/Target-Resistance age semantics so one concept is not persisted twice under different names.
2. If a research-only implementation is later built, reuse already-loaded daily history with zero extra market-data calls; do not wire to Worker.js/Formal.
3. Treat research/technical_indicator_field_dependency_graph_v0_1.json as mandatory anti-double-counting metadata for new technical fields.
4. Before any numeric System 2 technical weighting, require within-family aggregation/residualization so derived parent/child fields cannot multiply votes.
5. Keep all work outcome-blind until complete prospective parent coverage and the preregistered primary inference queue is ready.
6. Formal Core remains unchanged.

## Latest durable research commits

- f2d72877deda8cfb9f0a0614306657d150235313 — Factor-Zoo audit v0.2 / filter-recency-price-volume derivatives.
- 863fa3e4a5f402acfb5f50f527430e6f3351918e — extended machine-readable redundancy registry.
- 42ad727af83b0e00482c38c5a1b34a8aa991c846 — EXTREME_RECENCY_20 specification/adversarial fixtures.
- 5de68c6772dab98299f9de605ce8f667fdebae7c — indicator field dependency graph.
- 50171a747f3395bfd5cfee6b9f2741636215a7ed — intra-indicator anti-double-counting governance.


## Continuation update — TI-080 through TI-101

- Indicator memory/data-continuity taxonomy is frozen into four classes: FINITE_WINDOW, RECURSIVE_IIR, CUMULATIVE and PATH_STATE.
- Finite-window contamination ends only after the bad observation exits the eligible-session window; suspension/non-session calendar days do not advance the bar count.
- Recursive indicators retain geometrically decaying state error. Reference single-state half-lives are recorded for EMA9/12/18/20/26, Wilder14 and KD K-recursion as mathematical diagnostics only; they are NOT production clean-state thresholds.
- Nested recursive systems such as MACD, TRIX, TSI and ADX have multi-stage memory. "Wait N bars" is rejected as a universal repair rule.
- Raw OBV/ADL are cumulative and can retain a bad historical shock indefinitely unless recomputed/rebased/windowed. Path-state systems such as SAR can take a permanently different state path after one bad event.
- Preferred continuity certification is full clean replay from canonical continuity-corrected history, with formulaVersion/init/source hash/replay/prefix provenance. Arbitrary warm-up waiting is insufficient for promotion-grade inference.
- Smoothing is explicitly a lag/noise trade-off; fewer visual false signals can simply mean later reaction and must be evaluated against maxChase/execution opportunity cost.
- Machine-readable memory artifact: research/technical_indicator_memory_kernel_v0_1.json.
- Formula provenance audit confirms a display label such as "MACD 12/26/9" is incomplete without input series, smoothing kernel, seed, output-start, missing/session, continuity and implementation semantics.
- Current isolated reference core:
  KD = RSV9/K3/D3 init 50;
  RSI = Wilder14 with SMA seed;
  MACD = Close-based EMA12/26 + signal9 with first-value seed and internal 34-bar readiness.
- Published XQ KD semantics materially align with current KD family, but exact early-history platform parity remains unproven.
- Published XQ MACD uses WeightedClose + XAverage; current core uses Close. XQ XAverage first-value seed also differs from TA-Lib/Fidelity default SMA-seed EMA semantics.
- Therefore same period labels do not prove cross-platform numeric parity. Parity tiers P0 internal replay / P1 mathematical contract / P2 platform exact / P3 economic equivalence are frozen.
- Current core formulas remain frozen reference implementations; any future platform comparator must get a new formulaVersion rather than silently modifying V0.1.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_MEMORY_CONTINUITY_V0_1.md
  research/technical_indicator_memory_kernel_v0_1.json
  research/TECHNICAL_INDICATOR_FORMULA_PROVENANCE_V0_1.md
- No outcomes inspected, no runtime wiring and no Formal change.

## Continuation update — TI-102 through TI-122

- Modern/nested indicator audit rejects matched-horizon BIAS as duplicate MA-distance and PSY20 as exact positiveDayRatio20 duplicate on complete 20-return coverage.
- MO/RC/ROC level remain return-family affine/identity transforms and cannot receive separate evidence weight.
- IFT-RSI is smoothed RSI plus a monotonic nonlinear transform; QQE is RSI + filtering + RSI-domain volatility/trailing state; Schaff Trend Cycle is nested MACD + stochastic normalization/smoothing. These are representation/timing variants, not independent information families.
- SuperTrend is ATR-envelope path state; Chandelier Exit is rolling extreme +/- ATR multiple. Both belong to position-management/timing research rather than new selection factors.
- DEMA/TEMA/HMA/KAMA line are reduced-lag/adaptive filter alternatives, not new source families.
- KAMA's Efficiency Ratio is the only residual primitive retained: net displacement divided by cumulative absolute close path. It overlaps Pattern pole-path efficiency and trend-consistency features but is not algebraically identical to one current canonical field.
- Exactly one baseline is frozen: pathEfficiency10 using the classic ER10 horizon. No ER5/14/20/60 sweep is allowed.
- pathEfficiency10 is directionless: monotonic up and monotonic down both equal 1. It has no universal bullish sign.
- Adversarial fixtures P1-P10 and mandatory controls are frozen before outcomes.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_MODERN_NESTED_AUDIT_V0_1.md
  research/TECHNICAL_INDICATOR_PATH_EFFICIENCY_V0_1.md
- PATH_EFFICIENCY_10 remains low-priority WORTH_FALSIFICATION only after primary gates and EXTREME_RECENCY_20.

## Continuation update — TI-123 through TI-136

- Taiwan/XQ legacy price-volume indicator audit assigns Force Index, EMV, VPT, VR and PVI/NVI to PRICE_VOLUME ownership rather than technical majority voting.
- Force = price delta * volume; EMV = midpoint movement * range / volume; VPT = cumulative return-weighted volume. These overlap current response/effort/liquidity/participation research and are compact comparators only.
- VR is an up-day-volume/down-day-volume representation of the same signed-volume-imbalance family. With no flat-day volume it is a monotonic coordinate transform of signedVolumeBalance; flat-day convention must be explicit before comparing formulas.
- PVI/NVI are cumulative return paths conditional on volume increase/decrease. The traditional "smart money" narrative is not measured by the formula and is forbidden as causal labeling.
- KST is a weighted smoothed multi-horizon ROC bundle and is redundancy-high versus existing ret horizons/trend filters.
- Mass Index is directionless smoothed high-low range expansion; it belongs to volatility, not reversal authority.
- "RVI" is frozen as a formula-provenance hazard because Relative Volatility Index and Relative Vigor Index share the acronym across platforms. The reviewed XQ variant is a volatility-weighted signed-state oscillator and redundancy-high.
- Elder Ray is High/Low distance from EMA; STARC is SMA +/- ATR envelope. Neither creates a new evidence family.
- Cumulative legacy lines must not be compared by raw level across stocks without rebase/window/provenance.
- Redundancy registry is extended through these modern and legacy families.
- New durable artifact:
  research/TECHNICAL_INDICATOR_TAIWAN_LEGACY_PV_AUDIT_V0_1.md
- No new primary alpha hypothesis emerged from TI-123..136.
- No outcomes inspected, no threshold optimization, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Current empirical priority after TI-136

Primary:
1. KD vs RSI residual value
2. MACD vs direct trend
3. ADX vs direct trend quality
4. BBW vs ATR / realized-vol / VCP

Secondary only after primary gates:
5. EXTREME_RECENCY_20
6. PATH_EFFICIENCY_10
7. returnVelocityShift5v20
8. one Price-Volume-owned compact signed/close-location volume comparator

### Updated exact next continuation point

1. Continue only when a candidate indicator exposes a genuinely unresolved primitive; do not pursue catalog completion for its own sake.
2. Reconcile EXTREME_RECENCY_20 and PATH_EFFICIENCY_10 with Pattern/Trend ownership before any schema implementation.
3. Keep cross-platform formula provenance and memory-class metadata mandatory for future reference implementations.
4. Continue Factor-Zoo pruning on remaining Taiwan-common AR/BR/VR/VHF/Choppy/Q/RVI-like constructs, prioritizing algebraic/mechanistic redundancy before outcomes.
5. Keep all primary outcome inference blocked until prospective parent coverage and the existing preregistered gates mature.
6. Formal Core remains unchanged.

## Latest durable research commits

- 31fe43914c881cbb2384f735282b57682c52a7ed — indicator memory/continuity taxonomy.
- 90db1283a017aca5c2044f3cd2c2988cdd06ebae — machine-readable memory kernel registry.
- 8fce7c1cfa15faea089b0fd7af5d105e87022abe — formula provenance/cross-platform parity audit.
- 87a1cf75925445d3f2a8e597f877bf5487bd7322 — modern/nested/adaptive indicator audit.
- 54585e2ae3b94fb54e254689e4f0fcf77adc755f — pathEfficiency10 specification.
- 4a190ee9d06ce0a130f01b69a8509f43af9b7a01 — Taiwan legacy Price-Volume indicator audit.
- eb88938973a3d65293e60b9d32b7730f64ec9a68 — extended redundancy registry.


## Continuation update — TI-137 through TI-151

- VHF is classified as a PATH_EFFICIENCY robustness comparator: its denominator is total absolute close-path length, shared conceptually with KAMA Efficiency Ratio/pathEfficiency10; the numerator uses window max-close minus min-close instead of endpoint displacement.
- Choppy/Noise-style indicators are alternative directional-progress-versus-total-movement coordinates and remain path-efficiency/range robustness comparators, not independent factors.
- Random Walk Indicator is directional high/low excursion normalized by volatility and is assigned as an ADX/DMI/ATR trend-quality comparator.
- Coppock is a smoothed multi-horizon ROC bundle and is redundancy-very-high versus returns/KST/filter families.
- IMI is an RSI-like oscillator on open-to-close candle-body movement. It may encode intraday body information distinct from close-to-close RSI, but direct open-to-close/overnight-intraday primitives and candlestick geometry outrank the named indicator. Status low-priority comparator.
- BW Market Facilitation Index is range per unit volume and is PRICE_VOLUME liquidity/effort-vs-result geometry.
- Klinger/KO is signed-volume plus trend/filter logic and is PRICE_VOLUME-owned nested filtering.
- Volume-weighted MACD is a trend x volume interaction comparator, not a second MACD vote.
- Volume Oscillator is redundant with Price-Volume volume acceleration/RVOL/persistence families.
- Published XQ AR = sum(High-Open)/sum(Open-Low), an open-anchored range-asymmetry summary. BR = sum(High-PrevClose)/sum(abs(PrevClose-Low)), a previous-close-anchored gap/range asymmetry summary. Both are OHLC geometry comparators, not directly measured psychology.
- XQ ACC is momentum applied again to MTM and is assigned to the already-frozen return-acceleration family.
- XQ public Q-indicator contract currently exposes price-change/smoothing/noise-smoothing parameters without enough exact reproducible formula semantics for promotion-grade parity. Status FORMULA_CONTRACT_INCOMPLETE; outcome/scoring blocked.
- XQ TechScore is documented as a 14-indicator composite. It is retained only as an EXTERNAL COMPOSITE BENCHMARK because many included components are correlated transforms already mapped into the same families. Raw majority-vote architecture remains rejected as the default.
- Redundancy registry extended through VHF/Choppy/Noise/RWI/Coppock/IMI/BW-MFI/Klinger/VW-MACD/AR/BR/ACC/Q/TechScore.
- New durable artifact:
  research/TECHNICAL_INDICATOR_TRENDINESS_SENTIMENT_COMPOSITE_AUDIT_V0_1.md
- No new high-priority primitive emerged. Existing empirical priority remains unchanged.
- No outcomes inspected, no threshold optimization, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated exact next continuation point

1. Stop catalog expansion unless a candidate exposes a genuinely new information primitive.
2. Next high-value theory audit: OHLC range-based volatility estimators (Yang-Zhang / Rogers-Satchell / Parkinson / Garman-Klass) versus current close-to-close volatility20 + ATR, because overnight/intraday decomposition may be a genuinely distinct risk dimension.
3. Treat those estimators as VOLATILITY/RISK research first, not directional alpha.
4. Require OPEN and TECHNICAL_CONTINUITY plus session/corporate-action semantics before inference.
5. Keep primary directional indicator queue unchanged.
6. Formal Core remains unchanged.

## Latest durable research commits

- bf3204a146857936f3325a0f863a7a87320cc780 — trendiness/sentiment/composite indicator audit.
- adc809cd8888de531645e5d9e0e3172b97076673 — redundancy registry extension for TI-137..TI-151.


## Continuation update — TI-152 through TI-165

- OHLC range-based volatility estimators were audited as one VOLATILITY/RISK family, not additional directional technical votes.
- Parkinson20 uses high-low range only and is overnight-gap blind; Garman-Klass20 uses same-session OHLC but not previous-close gap; Rogers-Satchell20 is drift-robust intraday OHLC geometry and remains a Yang-Zhang component/robustness comparator.
- Yang-Zhang explicitly separates previous-close->open overnight variance, open->close variance and Rogers-Satchell intraday range contribution. It is therefore not algebraically redundant with current close-to-close volatility20 or ATR%.
- One common system-native baseline is frozen: YANG_ZHANG_20, because current comparator volatility20 already uses a 20-session horizon. XQ's current 14-day default is a platform default, not an optimization result.
- XQ YZVolatility platform parity remains UNKNOWN because the public interface does not fully prove academic component/denominator/initialization/missing-session semantics.
- Fresh repository audit materially upgrades raw OHLC feasibility: current history stores open/high/low/close and V8.12 history-source revalidation requests those fields.
- Critical falsification: current normalization can synthesize missing Open/High/Low with Close fallback. Such numerically complete rows are invalid for YZ unless per-bar OHLC origin proves OBSERVED_VALIDATED.
- TECHNICAL_CONTINUITY is first-order: raw corporate-action resets cannot enter overnight variance; verified suspensions are absent observations; residual market gaps remain information.
- Taiwan price-limit-constrained sessions require a separate constrained stratum because observed H/L can be censored by the exchange boundary.
- Proposed future research receipt preserves YZ total variance plus overnight/open-close/RS components, observed-OHLC coverage, fallback count, limit-constrained count and provenance rather than only one final scalar.
- Optional overnightVarianceShare20 is diagnostic risk-composition evidence, not a score.
- Machine-readable adversarial fixtures frozen in research/technical_indicator_range_volatility_fixtures_v0_1.json.
- Ownership handed to VOLATILITY_REGIME; Technical Indicator lane will not create a competing volatility taxonomy.
- Redundancy registry extended with Parkinson/GK/RS/YZ and overnight-variance-share families.
- No outcomes inspected, no runtime wiring, no directional threshold and no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

YANG_ZHANG_20 = WORTH_VOLATILITY_FALSIFICATION / SOURCE_FEASIBLE / PROVENANCE_GATED / OUTCOME_UNTESTED
OVERNIGHT_VARIANCE_SHARE20 = DIAGNOSTIC_HYPOTHESIS
CURRENT_CACHE_YZ_INFERENCE = NO_GO_UNTIL_OBSERVED_OHLC_PLUS_TECHNICAL_CONTINUITY
DIRECTIONAL_ALPHA = NOT_ASSUMED

### Updated exact next continuation point

1. Technical-indicator catalog expansion remains stopped unless a genuinely distinct primitive appears.
2. Reconcile remaining technical research into a minimal information-basis map: which primitive dimensions actually span the indicator families after all alias/nested-transform pruning.
3. Keep primary empirical queue unchanged: KD-vs-RSI -> MACD-vs-trend -> ADX-vs-trend-quality -> BBW-vs-ATR/VCP.
4. Secondary residual order remains EXTREME_RECENCY_20 -> PATH_EFFICIENCY_10 -> returnVelocityShift5v20 -> one Price-Volume compact comparator; Yang-Zhang is evaluated separately by VOLATILITY/RISK.
5. No runtime implementation before source provenance / continuity / prospective coverage gates.
6. Formal Core remains unchanged.

## Latest durable research commits

- 898c8eb90069cd7ae2ed626f87a194bb5c2e531f — OHLC range-volatility/Yang-Zhang audit.
- 92a522a3ae0c45d50d1c9368c5fc720f4fab8a08 — range-volatility adversarial fixtures.
- 7e180e2b303124e0311a0ac1cd918fc87962a1a8 — redundancy registry volatility-family handoff.
- a4878bb37f8276ffba57217f34d9752deba1b6ec — VOLATILITY_REGIME cross-lane Yang-Zhang handoff.


## Continuation update — TI-166 through TI-180

- The technical-indicator catalog is now reconciled into a V0.1 **minimal semantic information basis** rather than further expanding named indicators.
- This is explicitly NOT PCA / statistical orthogonality and NOT a predictive factor model. It is a de-duplication/admission ontology.
- Eight semantic dimensions are frozen:
  - B1 RETURN_DISPLACEMENT
  - B2 RANGE_LOCATION_EXTREME_RECENCY
  - B3 SIGNED_RETURN_PATH_BALANCE
  - B4 FILTERED_TREND_TRANSITION
  - B5 PATH_EFFICIENCY_TREND_PERSISTENCE
  - B6 VOLATILITY_MAGNITUDE_COMPOSITION
  - B7 OHLC_GAP_CANDLE_GEOMETRY
  - B8 PARTICIPATION_VOLUME
- Popular indicators are now interpreted as either:
  1. exact aliases/rescalings inside one basis dimension;
  2. nested transforms of an existing basis variable;
  3. within-basis composites;
  4. cross-basis composites;
  5. role-mismatched tools;
  6. possible narrow residual hypotheses.
- Examples:
  - ROC -> B1 exact alias of retN;
  - Williams %R -> B2 rescaling of Stochastic %K;
  - RSI -> B3 path-balance descriptor;
  - MACD -> B4 filtered trend/transition composite;
  - ADX/DMI -> B5 trend-quality plus B6 normalization;
  - Bollinger width -> B6 volatility/compression;
  - candles/Sakata/AR-BR -> B7 OHLC/gap geometry;
  - OBV/MFI/Klinger -> B8 participation crossed with price/path transforms.
- Context/guards such as market regime, liquidity, corporate-action state, symbol-session validity, price-limit constraint, Pattern lifecycle and event context are outside the indicator basis. They alter interpretation/validity rather than add another indicator vote.
- A nine-step admission firewall is frozen: formula provenance -> basis decomposition -> alias test -> nested-transform test -> interaction test -> ownership -> incremental-value hypothesis -> PIT/data feasibility -> prospective evidence budget.
- This framework explains why apparent multi-indicator "agreement" is not automatically confluence. Five indicators can collapse to only two or three underlying basis dimensions.
- Taiwan studies reporting improved performance from indicator combinations are interpreted as possible interaction/regime/filter effects, not proof of statistical independence. Liquidity, bear-market weakness and sample/parameter fit remain counterexplanations.
- New durable artifacts:
  - research/TECHNICAL_INDICATOR_MINIMAL_INFORMATION_BASIS_V0_1.md
  - research/technical_indicator_semantic_basis_v0_1.json
- Indicator catalog expansion remains stopped unless a genuinely distinct primitive appears.
- No outcomes inspected, no threshold optimization, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

MINIMAL_SEMANTIC_BASIS_V0_1 = FROZEN
INDICATOR_CATALOG_EXPANSION = STOPPED
NEW_FACTOR_ADMISSION = BASIS_DECOMPOSITION_REQUIRED
FORMAL_OPTIMIZATION_CANDIDATE = NONE

### Updated exact next continuation point

1. Audit System 2 technical factor/library definitions against B1-B8 so aliases/nested transforms cannot be counted independently in future strategy confluence.
2. Keep the basis itself descriptive; do not convert B1-B8 into eight scores.
3. Preserve the existing primary empirical queue:
   KD-vs-RSI -> MACD-vs-direct-trend -> ADX-vs-direct-trend-quality -> BBW-vs-ATR/realized-vol/VCP.
4. Secondary residual order remains EXTREME_RECENCY_20 -> PATH_EFFICIENCY_10 -> returnVelocityShift5v20 -> one Price-Volume compact comparator.
5. Yang-Zhang remains VOLATILITY/RISK-owned and outside directional indicator scoring.
6. Do not implement runtime indicator expansion before source provenance / continuity / prospective coverage gates.
7. Formal Core remains unchanged.

## Latest durable research commits

- 97fa943b3683afe22a17d87b9d4436807b5fd34c — minimal semantic information basis v0.1.
- d0e11268cb3718f0f99514d93a3091bed777fce2 — machine-readable semantic basis registry v0.1.


## Continuation update — TI-181 through TI-200

- System 2 audit confirms the conceptual architecture is already aligned with anti-double-counting: technical indicators are auxiliary, majority voting is rejected, and evidence families should aggregate before cross-family confluence.
- The remaining risk is engineering enforcement: current prose does not yet require every technical evidence item to carry machine-readable B1-B8 basis provenance, transform class, canonical primitive identity and redundancy-group identity.
- A research-only System 2 technical semantic-provenance contract is frozen with fields for ownerFamily, semanticBasisIds, transformClass, canonicalPrimitiveIds, redundancyGroupId, parentEvidenceIds, interactionHypothesisId, directScoreEligible, formulaVersion, asOf/availableAt and dataQualityState.
- Exact aliases/rescalings must be non-scoreable; nested transforms default to comparator/explanation; within-basis fields must aggregate before technical-family confluence; cross-basis composites cannot silently score both components and the composite without explicit interaction accounting.
- System 2 layer mapping is frozen:
  - T1 Trend Structure -> B1/B4/B5
  - T2 Structural Levels -> B2
  - T3 Pattern Topology -> geometry/lifecycle consuming B1/B2/B5/B6/B7
  - T4 Pattern Lifecycle -> context/lifecycle
  - T5 Candlestick/Sakata -> B7
  - T6 Indicator Auxiliary -> B1/B2/B3/B4/B5/B6/B8
  - T7 Volatility/Compression -> B6
  - T8 Multi-timeframe -> horizon/context operator
  - T9 Failure/False-break -> context/lifecycle
- No current System 2 scoring bug is claimed. The finding is a preventable future implementation risk.
- New durable artifacts:
  - research/SYSTEM2_TECHNICAL_SEMANTIC_BASIS_AUDIT_V0_1.md
  - research/system2_technical_semantic_provenance_contract_v0_1.json

- A separate lag-noise/response audit is frozen for filter-like indicators. "Lower lag" is not accepted as incremental information.
- Average sample age is not the same as turning-point detection delay. A filter can reduce one lag metric while worsening smoothness/noise behavior.
- V0.1 filter diagnostics are outcome-blind: step response, ramp/trend response, V-reversal response, noise sensitivity, shock sensitivity, state-flip count, response50/90, transition timing, output variance, shock decay, prefix invariance and replay exactness.
- SMA/EMA/MACD/low-lag MA variants are treated as filter engineering inside B4 unless a genuinely new semantic input is introduced.
- MACD histogram may react before a signal-line crossover because it measures DIF relative to a smoother; this does not imply future information.
- KD-vs-RSI future work must separate semantic-input difference (B2 range location vs B3 signed-return balance) from smoothing/latency difference.
- ADX future work must measure stability versus confirmation delay, not return separation alone.
- DEMA/TEMA/HMA/zero-lag variants are excluded from the primary outcome queue by default.
- Twelve outcome-blind response fixtures F1-F12 are frozen: constant, step up/down, linear up/down, slope acceleration, V reversal, choppy zero-drift, trend+noise, gap shock, one-bar false break, and limit-constrained stair-step.
- New durable artifacts:
  - research/TECHNICAL_INDICATOR_LAG_NOISE_RESPONSE_V0_1.md
  - research/technical_indicator_response_profile_v0_1.json
- No outcomes inspected, no threshold/parameter optimization, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

MINIMAL_SEMANTIC_BASIS_V0_1 = FROZEN
SYSTEM2_TECHNICAL_PRINCIPLES = ALIGNED
SYSTEM2_MACHINE_BASIS_PROVENANCE = SPEC_FROZEN_NOT_IMPLEMENTED
FILTER_RESPONSE_AUDIT_V0_1 = FROZEN
LOW_LAG_VARIANTS = SAME_BASIS_UNLESS_NEW_INPUT_PROVEN
PRIMARY_DIRECTIONAL_QUEUE = UNCHANGED
FORMAL_OPTIMIZATION_CANDIDATE = NONE

### Updated exact next continuation point

1. Keep catalog expansion stopped.
2. No System 2 runtime/weight/threshold change from the semantic-basis audit.
3. When future technical aggregation engineering begins, require the frozen semantic-provenance contract before numeric scoring.
4. When the isolated technical-indicator core is next extended, execute F1-F12 response fixtures before market outcomes.
5. Primary empirical queue remains:
   KD-vs-RSI -> MACD-vs-direct-trend -> ADX-vs-direct-trend-quality -> BBW-vs-ATR/realized-vol/VCP.
6. For each primary comparison, distinguish semantic incremental value from mere filter-response differences.
7. Secondary residual order remains EXTREME_RECENCY_20 -> PATH_EFFICIENCY_10 -> returnVelocityShift5v20 -> one Price-Volume compact comparator.
8. Yang-Zhang remains VOLATILITY/RISK-owned.
9. Formal Core remains unchanged.

## Latest durable research commits

- e80bf0566526c22838c8d9d8ff9fa3af6553b213 — System 2 technical semantic-basis audit.
- b3688e62b6b181c3d76347ac84dc3c8c96dda02a — System 2 semantic-provenance contract v0.1.
- cbabdf422b30b00772340f1f34c1ff4e124987f4 — lag-noise/filter-response audit.
- 0e4985cb81af091faf4e887beb0c7b0ec157fec7 — filter response-profile contract v0.1.


## Continuation update — TI-201 through TI-210

- Multi-timeframe technical evidence is now explicitly treated as hierarchical context, not independent vote counting.
- Weekly, daily, 15m and 5m bars are aggregations of the same underlying transaction path; agreement across them can reuse the same event/path information.
- Required provenance now includes timeframe, sessionRule, lookbackBars, effectiveClockHorizon and barCompletionState. A parameter such as RSI14 without timeframe is semantically incomplete.
- Partial higher-timeframe bars are a distinct causal state from completed bars. A Wednesday as-of weekly bar may be causally available but cannot silently be pooled with completed-week semantics.
- Five overlap classes are frozen:
  SAME_EVENT_DUPLICATE,
  NESTED_HORIZON,
  SHARED_COMPONENT,
  DISTINCT_HORIZON_CONTEXT,
  DISTINCT_SESSION_INFORMATION.
- Only DISTINCT_HORIZON_CONTEXT and DISTINCT_SESSION_INFORMATION begin with a plausible incremental-information prior.
- Preferred hierarchy remains:
  weekly = major trend/large structure;
  daily = selection/principal setup;
  15m = transition/acceptance/execution confirmation;
  5m = execution detail/early observation where allowed.
- "weekly bullish + daily bullish + 15m bullish" therefore does NOT equal three bullish votes.
- Overlapping-window dependence is an explicit statistical guard. Recent 2026 evidence shows overlapping return construction can inflate measured time-series momentum strength by mechanically accumulating autocorrelation; overlapping feature windows likewise cannot inflate independent sample counts.
- Bar-boundary sensitivity is explicit: different aggregation can hide/reveal breakout-rejection paths, change high/low extrema and create extra oscillator crosses.
- No timeframe/bar-size optimization is allowed after outcome inspection.
- Future weekly incremental-value research must beat equivalent daily long-horizon controls (priorHigh60/majorStructuralHigh, MA60/120, ret60, major-zone lifecycle).
- Intraday incremental value is execution/acceptance focused, not another daily selection vote.
- New durable artifacts:
  - research/TECHNICAL_INDICATOR_MULTITIMEFRAME_AGGREGATION_V0_1.md
  - research/technical_indicator_multitimeframe_contract_v0_1.json
- No outcomes inspected, no runtime wiring, no FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Updated current status

MULTI_TIMEFRAME_V0_1 = FROZEN
TIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT
OVERLAPPING_SAMPLE_INFLATION = EXPLICIT_GUARD
PARTIAL_HIGHER_TIMEFRAME = DISTINCT_CAUSAL_STATE
FORMAL_OPTIMIZATION_CANDIDATE = NONE

### Updated exact next continuation point

1. Keep indicator catalog expansion stopped.
2. Integrate semantic basis + response profile + multi-timeframe provenance as the full research identity for technical evidence.
3. Before any market outcome inference, distinguish semantic incremental value, filter-response difference and timeframe-aggregation difference.
4. Primary empirical queue remains unchanged:
   KD-vs-RSI -> MACD-vs-direct-trend -> ADX-vs-direct-trend-quality -> BBW-vs-ATR/realized-vol/VCP.
5. Weekly evidence must beat equivalent daily long-horizon structural controls; intraday evidence is execution/acceptance first.
6. Preserve independent-date/episode inference; overlapping windows/timeframes do not create additional independent samples.
7. Formal Core remains unchanged.

## Latest durable research commits

- bfbe724f3acf7504acc269d74433584b554e8d27 — multi-timeframe / temporal aggregation audit v0.1.
- 77e1d300f87798934cd0e7ae17f566111623d6d6 — machine-readable multi-timeframe technical evidence contract v0.1.
- 3a1e334e328d572dae096fc119a01e1db0896efb — checkpoint through TI-200.


## Continuation update — TI-211 through TI-274

### KD vs RSI — TI-211..TI-225
- KD and RSI are proven non-equivalent semantic transforms:
  - KD/RSV consumes rolling High/Low range location (B2);
  - RSI consumes Wilder-smoothed close-to-close gain/loss balance (B3).
- Outcome-blind witness A fixes the entire Close path and changes only High/Low geometry:
  RSI14 stays exactly 76.5323885110 while final K changes ~87.27 -> ~66.84.
- Outcome-blind witness B finds two OHLC paths with similar final K/D (~52.51/46.51 vs ~53.38/47.23) but RSI14 ~27.85 vs ~70.93.
- Therefore neither indicator is an algebraic substitute for the other.
- Naive Taiwan KD9-3-3 vs RSI14 comparison mixes semantic difference, horizon difference and smoothing/latency difference.
- Frozen two-track design:
  MARKET_CONVENTION = KD9-3-3 vs RSI14;
  SEMANTIC_ISOLATION = raw 14-bar range position vs RSI14.
- KD must itself be split into RSV primitive versus K/D smoothing memory.
- Formula readiness is separated from seed stability.
- Current MARKET_STATE_DAYS=65:
  KD seed influence is effectively negligible;
  locally reseeded RSI14 retains ~2.459% linear seed-state weight in avgGain/loss state at the final bar.
  This is not a claim of 2.459% RSI numeric error.
- <1% RSI seed-state weight requires about 78 closes under Wilder alpha=1/14.
- Future state construction must explicitly choose CONTINUOUS_STATE, DEEP_HISTORY_RECOMPUTE or FIXED_LOCAL_WINDOW_FORMULA.
- Technical-indicator runtime snapshot persistence is not currently implemented outside isolated research core/tests.
- New artifacts:
  research/TECHNICAL_INDICATOR_KD_RSI_DECOMPOSITION_V0_1.md
  research/technical_indicator_kd_rsi_fixtures_v0_1.json
  research/technical_indicator_seed_stability_contract_v0_1.json

### MACD vs direct trend — TI-226..TI-240
- DIF = EMA12-EMA26, so MACD zero-line state is exactly EMA12/26 alignment.
- Histogram = DIF-Signal, so MACD signal crossover state is exactly Histogram sign.
- These aliases cannot score separately.
- Raw DIF/Histogram magnitudes are price-scale dependent; normalized percent representations remain primary.
- MACD is a nested filtered-trend/transition family; the only plausible residual is transition timing/curvature after direct trend controls.
- At 65 bars under first-close EMA seeding, EMA26 seed-state weight is ~0.726%, below the current 1% research tolerance.
- Future MACD inference must compare normalized DIF/Histogram transition against ret5/10/20/60, MA/EMA slopes/alignment, trendPersistence, returnVelocityShift and Pattern lifecycle.
- New artifact:
  research/TECHNICAL_INDICATOR_MACD_DIRECT_TREND_V0_1.md

### ADX vs direct trend quality — TI-241..TI-252
- ADX is directionless by construction because DX uses abs(+DI - -DI).
- High ADX can describe strong uptrend or strong downtrend; high ADX is not bullish.
- DI dominance is direction; ADX is strength. They share the same H/L/TR information family and are not independent cross-family votes.
- ADX is not an exact alias of close-path efficiency because DMI uses High/Low progression and gap-aware True Range.
- The unresolved hypothesis is whether this H/L/TR trend-quality information adds beyond HH/HL/LH/LL, trendPersistence, pathEfficiency, MA slope, returns and ATR.
- ADX multi-stage smoothing requires stability-versus-confirmation-delay diagnostics, not return separation alone.
- Taiwan ADX evidence remains combined-strategy evidence, not isolated incremental alpha.
- New artifact:
  research/TECHNICAL_INDICATOR_ADX_DIRECT_TREND_QUALITY_V0_1.md

### Bollinger Width vs ATR/VCP — TI-253..TI-264
- Conventional BBW = 2*k*sigma(Close)/SMA(Close); with k=2, BBW=4*sigma/SMA.
- %B is an affine transform of standardized MA distance under an identical formula version and cannot score independently from that same primitive.
- BBW uses dispersion of Close price levels; it is not identical to close-to-close return volatility.
- BBW is not ATR:
  clustered closes + wide intraday ranges can yield low BBW/high ATR;
  smooth trending closes + tight daily ranges can yield wider BBW/modest ATR.
- BBW squeeze is not VCP by definition because VCP retains swing/range topology, contraction legs, higher-low geometry and lifecycle.
- Taiwan 50 evidence rejects upper-band-touch = automatic SELL; upper-band events supported momentum/long interpretation in the 2007-2016 sample.
- Formula-version metadata must preserve center type, std definition, lookback, multiplier and continuity space.
- New artifact:
  research/TECHNICAL_INDICATOR_BOLLINGER_ATR_VCP_V0_1.md

### Primary queue readiness — TI-265..TI-274
- All four primary theory decompositions are sufficiently mature to stop catalog/theory expansion.
- Current queue readiness:
  KD_vs_RSI =
    THEORY_PASS / FIXTURE_PASS / SEED_MODE_UNRESOLVED /
    PROSPECTIVE_NOT_COLLECTED / OUTCOME_NO_GO.
  MACD_vs_DIRECT_TREND =
    THEORY_PASS / EXACT_ALIAS_MAP_PASS / MECHANICS_PARTIAL /
    PROSPECTIVE_NOT_COLLECTED / OUTCOME_NO_GO.
  ADX_vs_TREND_QUALITY =
    THEORY_PASS / CORE_NOT_IMPLEMENTED /
    PROSPECTIVE_NOT_COLLECTED / OUTCOME_NO_GO.
  BBW_vs_ATR_VCP =
    THEORY_PASS / FORMULA_VERSION_PARTIAL / CORE_NOT_IMPLEMENTED /
    PATTERN_RUNTIME_BLOCKED / OUTCOME_NO_GO.
- Current 65-day cache is adequate for KD and MACD seed decay under frozen formulas but not below a 1% locally-reseeded RSI14 state tolerance.
- Existing repository research code proves deeper historical fetch capability is technically possible, but zero-extra-call ordinary observer availability is NOT proven.
- No technical-indicator prospective evidence clock currently exists under the new semantic/seed contracts.
- Historical Shadow rows must not be fabricated.
- Frozen future evidence gate order:
  source/continuity/session -> parent coverage -> formula replay/prefix ->
  seed-state consistency -> common support -> redundancy ->
  descriptive independent-date outcomes -> incremental value ->
  OOS/regime/liquidity/cost/overfit.
- Minimal future observer proposal is research-only and contains no score/rank/BUY/SELL/capital field.
- New artifacts:
  research/TECHNICAL_INDICATOR_PRIMARY_QUEUE_READINESS_V0_1.md
  research/technical_indicator_primary_queue_readiness_v0_1.json

### Current lane status

PRIMARY_THEORY_DECOMPOSITION = COMPLETE_V0_1
INDICATOR_CATALOG_EXPANSION = STOPPED
PROSPECTIVE_TECHNICAL_OBSERVER = NOT_IMPLEMENTED
OUTCOME_INFERENCE = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Exact next continuation point

1. Do not invent more technical indicators.
2. Freeze one prospective technical-observer source/state construction proposal, especially RSI seed semantics.
3. Isolated mechanics priority:
   - execute response-profile fixtures for MACD;
   - implement/QA research-only ADX14 and BBW20x2 mechanics before any outcome join.
4. Preserve stateConstructionMode and formulaVersion on every future row.
5. No outcome inference until complete prospective parent coverage exists.
6. No Worker/Formal/ranking/threshold/capital/monitor/push change from this research.
7. Formal Core remains unchanged.

## Latest durable research commits

- 67cd9eee0322788df358b06bacd496b39c432a18 — KD vs RSI semantic decomposition.
- 29b8e42fc10df1d2df08ef2ae25ee9f0fa8b75ea — KD/RSI semantic isolation fixtures.
- b95bd6cd66167df93d2b4b4be4d4d7a8879bce04 — seed-stability contract.
- 951e9e0a382b6e00c43f13e6ab80de0f55b8d886 — MACD vs direct trend.
- df3c803c1ce8f8294030edefa80abcd0b94e7744 — ADX vs direct trend quality.
- 3a48559fe05af5d0f4939996b6275d4fc519b31a — Bollinger vs ATR/VCP.
- 10b5a45ea943190fea76efdece5c5fafa966bdcf — primary queue readiness.
- aa497120cd7d7c9a60899a4fe10ec812a487e8ef — machine-readable readiness matrix.


## Continuation update — TI-275 through TI-300

### Prospective observer state construction — TI-275..TI-288
- A moving 65-bar daily re-seed is rejected as the authoritative inference semantics for recursive indicators.
- Preferred authority is CANONICAL_REPLAY_LINEAGE.
- Persisted recursive state may exist only as an efficiency cache and is inference-eligible only when it reproduces the same canonical lineage.
- stateLineageId is conceptually tied to symbol + formulaVersion + continuitySpaceVersion + sourceFamilyVersion + sessionCalendarVersion + initializationAnchor + stateConstructionVersion.
- Any formula/source/continuity/session/anchor change creates a new lineage; do not silently continue prior state.
- Allowed construction modes:
  FULL_REPLAY_FROM_LINEAGE_ANCHOR;
  TRUSTED_PRIOR_STATE;
  LOCAL_WINDOW_BOOTSTRAP_QA_ONLY.
- Prospective rows may be retained while seed-sensitive for recorder QA, but ordinary alpha inference requires declared seed/replay state.
- Recursive state repair is replay-based: mark DIRTY, rebuild causally and hash-check. Do not patch only the current value and do not wait an arbitrary N bars.
- Technical Indicator primary inference consumes shared TECHNICAL_CONTINUITY only. RAW_EXECUTION remains mechanics/execution-reference only.
- TECHNICAL_CONTINUITY production/runtime is still blocked, therefore Technical Indicator observer runtime remains NO_GO.
- Observer must attach to the existing prospective Shadow population, not create a second universe. Latest cross-lane lineage preference is parentDecisionReceiptId or scanDate+symbol+parentSnapshotHash+captureGeneration.
- COMPLETE run means every expected parent resolves to VALID or explicit BLOCKED; missing parents or replay/provenance mismatches block inference.
- Existing deeper history-fetch capability does not itself authorize scheduled provider pulls or D1 expansion.
- ZERO_EXTRA_CALL_FORMULA_FEASIBILITY != ZERO_EXTRA_CALL_INFERENCE_READINESS.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_OBSERVER_STATE_CONSTRUCTION_V0_1.md
  research/technical_indicator_observer_state_contract_v0_1.json

### ADX14 exact formula parity — TI-289..TI-295
- Frozen formulaVersion:
  WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1.
- +DM/-DM winner rule and equal outside-expansion tie -> both zero are frozen.
- TR = max(H-L, |H-prevClose|, |L-prevClose|).
- Wilder smoothing uses initial sums then S = S - S/14 + x.
- DX = 100*abs(+DI-(-DI))/(+DI+(-DI)); first ADX is mean of first 14 valid DX, then Wilder-smoothed.
- TA-Lib-style baseline uses no integer rounding and no extra unstable-period extension.
- Lookback reference for period14 is 27 positions; first output is at zero-based index27, requiring 28 eligible OHLC bars.
- FIRST_CALCULABLE is not seed-stable. ADX remains a cascaded recursive state requiring canonical replay lineage.
- Output payload should preserve smoothed TR/+DM/-DM, DI, DX, ADX and lineage/quality metadata.
- No ADX bullish direction or optimized threshold state is permitted.
- Adversarial fixtures frozen conceptually: mirrored up/down, flat zero-range, inside bars, equal outside expansion, gap, large wick, price-scale, corporate action and price-limit staircase.

### Bollinger20x2 exact formula parity — TI-296..TI-300
- Frozen formulaVersion:
  BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1.
- Center = SMA20 Close.
- Standard deviation = population variance convention, divide by N=20.
- Upper/lower = SMA20 +/- 2*sigma20.
- bandWidthRatio=(upper-lower)/middle; bandWidthPct=100*ratio.
- %B=(close-lower)/(upper-lower) only when width>0.
- Flat zero-width %B is NULL / ZERO_BAND_WIDTH_UNDEFINED_LOCATION; no coercion to 0/0.5/1.
- Bollinger is finite-window: first calculable with 20 eligible closes and no recursive seed after exact window is known.
- Formula parity still requires exact symbol sessions, TECHNICAL_CONTINUITY and std-definition/version identity.
- Adversarial fixtures frozen: constant close, multiplicative scale, additive affine shift, same-close/wide-range, smooth trend/tight-range, sample-vs-population std mismatch, corporate action and price-limit staircase.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_ADX_BBANDS_FORMULA_PARITY_V0_1.md
  research/technical_indicator_adx_bbands_formula_contract_v0_1.json

### Snapshot contract v0.2 proposal
- New proposal adds:
  semantic basis provenance;
  transform/canonical primitive/redundancy identity;
  timeframe/effective horizon;
  canonical replay lineage;
  initialization/seed/replay fields;
  ADX/BBands formula versions;
  exact parent lineage;
  constrained-session separation.
- New artifact:
  research/technical_indicator_snapshot_contract_v0_2_proposal.json
- Proposal only. No runtime persistence/schema/schedule/provider-call authorization.

### Current lane status

PRIMARY_THEORY_DECOMPOSITION = COMPLETE_V0_1
OBSERVER_STATE_CONSTRUCTION = DESIGN_FROZEN_RUNTIME_NO_GO
ADX14_FORMULA = SPEC_FROZEN_CORE_NOT_IMPLEMENTED
BBANDS20X2_FORMULA = SPEC_FROZEN_CORE_NOT_IMPLEMENTED
SNAPSHOT_V0_2 = PROPOSAL_ONLY
OUTCOME_INFERENCE = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Do not expand the indicator catalog.
2. Next isolated mechanics step:
   - implement research-only ADX14 and Bollinger20x2 in the isolated technical core;
   - execute the frozen adversarial fixtures;
   - extend MACD response-profile F1-F12 QA.
3. Keep all code isolated under research/; do not touch Worker.js.
4. Runtime observer remains NO_GO until shared TECHNICAL_CONTINUITY and exact parent-lineage governance are runtime-ready.
5. Any D1 schema/persistence/schedule/provider-pull implementation remains governance-gated.
6. No outcome join before COMPLETE prospective receipts.
7. Formal Core remains unchanged.

## Latest durable research commits

- 3ab7121b6867909da3e30f0b0c1e74890f8f4918 — observer state-construction design.
- b32d4d4284e281110412fb1d6e56a8ba61a641de — observer state machine contract.
- 52ec90e1b31236670a3a316c922d0beed950e47d — ADX/Bollinger formula parity specification.
- 5574b454bfa3d2b4143a892e235adb28ba188e2d — machine-readable ADX/Bollinger formula contract.
- 1d663637915ead6d86cdccb5776f87f0ffaaa405 — Technical Indicator snapshot contract v0.2 proposal.


## Continuation update — TI-301 through TI-312

### Cross-platform parity extension — TI-301..TI-307
- Existing formula-provenance audit already established that identical display labels do not imply numeric parity.
- ADX14 parity tuple now explicitly includes:
  +DM/-DM tie rule, TR definition, initial summation window, Wilder smoothing, DI/DX zero-denominator handling, first-ADX initialization, integer rounding, unstable period, output-start and session/continuity semantics.
- Internal ADX baseline:
  WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1.
- TA-Lib-style mathematical alignment is MATERIAL, but exact external-platform P2 parity remains UNKNOWN until identical history and edge-case semantics are proven.
- Practitioner guidance that ADX may need very deep history for stable cross-platform values is retained as a parity warning, not converted into a universal production warm-up threshold.
- Bollinger parity tuple now explicitly includes:
  input series, center MA type, period, variance divisor, band multiplier, missing/session handling, zero-width %B behavior, BandWidth scaling and continuity space.
- Internal Bollinger baseline:
  BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1.
- TA-Lib population-variance convention is the internal numeric reference. Platforms using sample standard deviation can differ even when both display "20,2".
- Fidelity/public family descriptions materially align on SMA + standard-deviation bands and BandWidth formula but do not by themselves prove variance-divisor/zero-width/rounding parity.
- External chart disagreement triage order is frozen:
  input series -> continuity/adjustment -> session inclusion -> periods -> smoothing/center -> seed -> output start -> variance/zero/tie rules -> rounding -> implementation defect.
- Formula parity remains QA/robustness evidence only, never alpha evidence.
- Canonical provenance file extended:
  research/TECHNICAL_INDICATOR_FORMULA_PROVENANCE_V0_1.md

### Numeric mechanics oracle — TI-308..TI-312
- Deterministic, outcome-blind numeric oracle vectors are frozen for future isolated ADX/Bollinger implementation QA.
- ADX mirrored monotonic fixtures:
  40-bar monotonic up with H=C+1/L=C-1:
    first ADX at index27 = 100;
    final ADX = 100;
    +DI27=50; -DI27=0.
  Symmetric monotonic down:
    first/final ADX=100;
    +DI27=0; -DI27=50.
- Flat zero-range 40-bar fixture:
  first/final ADX=0.
- Equal outside expansion fixture:
  equal positive high/low expansion invokes tie rule, both DM=0, ADX remains 0.
- Gap fixture:
  prior H=L=C=100 then H=110.5/L=109.5/C=110 => TR=10.5.
- Multiplying the monotonic-up OHLC path by 10 leaves +DI/-DI/DX/ADX unchanged exactly under the oracle arithmetic.
- Bollinger 20-close sequence 101..120:
  SMA20=110.5;
  population sigma=5.766281297335398;
  sample-sigma comparator=5.916079783099616;
  upper=122.0325625946708;
  lower=98.9674374053292;
  BandWidthPct=20.87341646094261;
  %B=0.911877235523957.
- Flat 20-close=100 fixture:
  sigma=0;
  BandWidth=0;
  %B=NULL.
- x10 multiplicative price scaling leaves BandWidth ratio/%B unchanged within floating tolerance.
- +100 additive shift leaves %B unchanged but changes relative BandWidth because the SMA denominator shifts.
- New durable oracle:
  research/technical_indicator_adx_bbands_oracle_vectors_v0_1.json
- These are formula-mechanics fixtures only; no forward market outcome or threshold was used.

### Current lane status

PRIMARY_THEORY_DECOMPOSITION = COMPLETE_V0_1
OBSERVER_STATE_CONSTRUCTION = DESIGN_FROZEN_RUNTIME_NO_GO
FORMULA_PROVENANCE_PARITY = EXTENDED_THROUGH_ADX_BBANDS
ADX14_NUMERIC_ORACLE = FROZEN
BBANDS20X2_NUMERIC_ORACLE = FROZEN
ISOLATED_ADX_BBANDS_CORE = NOT_IMPLEMENTED
SNAPSHOT_V0_2 = PROPOSAL_ONLY
OUTCOME_INFERENCE = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Stop further named-indicator expansion.
2. Next research-only engineering target is isolated core implementation of ADX14 and BBANDS20x2 against the frozen numeric oracle.
3. MACD response-profile F1-F12 mechanics remain the next non-outcome QA after ADX/BBands.
4. No runtime observer wiring until TECHNICAL_CONTINUITY + exact parent lineage + governance approval.
5. Do not infer alpha from oracle/mechanics tests.
6. No Formal/ranking/threshold/capital/monitor/push change.
7. Formal Core remains unchanged.

## Latest durable research commits

- c5fe98c7b1a3c3d1c04212767589ec28fcd99a64 — formula-provenance parity extended through ADX/Bollinger.
- b919478454b040fdff70b7c36801cf12c7ee96f2 — ADX/Bollinger deterministic numeric oracle vectors.
