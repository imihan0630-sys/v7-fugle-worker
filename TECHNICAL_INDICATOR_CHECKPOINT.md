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
