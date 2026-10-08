# Technical Indicator Research Checkpoint

Updated: 2026-09-30 Asia/Taipei
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


## Continuation update — TI-313 through TI-327

### ADX/Bollinger isolated implementation and QA — TI-313..TI-318
- Before implementation, TA-Lib source revalidation found one material specification simplification that needed correction:
  ADX initialization is not simply "sum 14 DM/TR values, then start DX".
- Correct TA-Lib-style order is now frozen:
  1. seed smoothed TR/+DM/-DM from the first period-1 one-bar transitions;
  2. for each of the next period bars, apply one Wilder update;
  3. compute one DX after that update;
  4. first ADX = sumDX / period.
- Zero-direction semantics were also tightened:
  if smoothed TR is zero or DI sum is effectively zero, no valid DX update is applied;
  during first-ADX accumulation the slot contributes nothing to sumDX but denominator remains period;
  after first ADX exists, an invalid DX slot leaves ADX unchanged rather than smoothing toward zero.
- This correction was made BEFORE isolated core implementation.
- Corrected durable contracts:
  research/TECHNICAL_INDICATOR_ADX_BBANDS_FORMULA_PARITY_V0_1.md
  research/technical_indicator_adx_bbands_formula_contract_v0_1.json

- research/technical_indicator_core_v0_1.mjs now implements research-only:
  computeADX()
  computeBollingerBands()
- Formula versions added:
  WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1
  BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1
- Worker.js, runtime storage, schedules and Formal decision paths were not touched.

- ADX deterministic oracle PASS:
  - first output index 27 / 28 eligible bars;
  - monotonic up ADX=100 with +DI=50 / -DI=0;
  - mirrored down ADX=100 with +DI=0 / -DI=50;
  - flat zero-range ADX=0;
  - equal outside expansion tie -> both DM=0 and ADX=0;
  - gap fixture TR=10.5;
  - multiplicative price scaling preserves DI/DX/ADX.
- Bollinger deterministic oracle PASS:
  20 closes 101..120:
  - SMA20=110.5;
  - population sigma=5.766281297335398;
  - upper=122.0325625946708;
  - lower=98.9674374053292;
  - BandWidthPct=20.87341646094261;
  - %B=0.911877235523957.
- Flat band:
  BBW=0 and %B=NULL, preserving ZERO_BAND_WIDTH_UNDEFINED_LOCATION.
- Multiplicative scale preserves relative BandWidth/%B.
- Positive additive shift preserves %B but changes relative BandWidth denominator as specified.

- A stronger non-monotonic ADX oracle was added because monotonic paths can hide initialization mistakes.
- ASYMMETRIC_WAVE_REFERENCE:
  deterministic 50-bar non-symmetric OHLC path.
- Independent Python transcription of the corrected TA-Lib source-order semantics matched the JS isolated core at indices 14/20/27/28/35/49 within floating precision.
- Key index27 oracle:
  trSmoothed=34.646000230548495;
  +DMSmoothed=12.692588044888245;
  -DMSmoothed=7.095548052704646;
  +DI=36.63507464188256;
  -DI=20.480136250903424;
  DX=28.284826648551533;
  first ADX=24.06246596876735.
- Index28 ADX=24.74112347980112.
- Index49 ADX=30.109005583147688.
- This fixture specifically guards against period-vs-period-1 ADX seed alignment regressions.

- Full isolated technical-indicator research test execution PASS:
  existing KD/RSI/MACD;
  strict semantic blocking;
  price-limit constrained interpretation;
  replay;
  prefix invariance;
  new ADX/Bollinger numeric oracles;
  ADX/Bollinger prefix invariance.
- Validation mode:
  exact GitHub source fetched and executed in an isolated V8 evaluator with only ES-module import/export wrappers removed.
- No pull-request-triggered GitHub workflow run was observed for these default-branch research commits, so repository CI PASS is NOT claimed.
- New durable QA receipt:
  research/technical_indicator_isolated_qa_receipt_v0_1.json

### MACD F1-F12 response profile — TI-319..TI-327
- The frozen lag/noise mechanics suite was executed against:
  EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1.
- F1 constant:
  DIF/Signal/Histogram remain zero; no flips.
- F2 positive step:
  Histogram peaks earlier than DIF.
  Histogram first turns negative at bar54 while DIF remains positive; at bar60 DIF=+1.6870304669 and Histogram=-0.3386643700.
  Therefore negative Histogram does not mean negative trend direction.
- F3 negative step is the sign mirror.
- F4 clean linear uptrend:
  final DIF=+3.4857028870 while Histogram approaches zero (~+0.0067169435), with zero Histogram sign flips.
  Persistent trend can coexist with near-zero Histogram.
- F5 clean linear downtrend is the sign mirror.
- F6 slope acceleration:
  Histogram rises materially after slope acceleration and peaks around bar52 at 0.6075220907.
  This supports transition/filtered-speed-change semantics, not directional alpha.
- F7 V reversal:
  first Histogram > 0 at bar42;
  first DIF > 0 at bar55;
  Histogram leads DIF zero-cross by 13 bars.
  At bar45 DIF=-4.5914976456 while Histogram=+0.9700077807.
  Thus Histogram positive can mean "downtrend is improving/decelerating" while filtered trend remains negative.
- F8 choppy zero-drift:
  Histogram sign flips=46;
  DIF sign flips=40.
- F9 trend+noise:
  Histogram flips=14 versus 0 on the clean rising ramp, while DIF remains positive in the measured warm region.
  Faster transition state has materially higher noise sensitivity.
- F10 one-bar +10 shock:
  shock bar DIF=+0.7977207977 / Histogram=+0.6381766382;
  Histogram turns negative by bar44;
  DIF turns negative by bar49 even though price already returned to the unchanged baseline.
  Filter-state ringing/decay can create post-shock sign reversals without a durable trend.
- F11 +5 one-bar shock preserves the same timing at approximately half amplitude, confirming linear filter scaling.
- F12 limit-like staircase:
  large positive DIF/Histogram appears during step-ups;
  later Histogram turns negative while DIF remains strongly positive.
  MACD formula alone cannot distinguish unconstrained discovery from price-limit-constrained state; external constraint guard remains mandatory.
- MACD F1-F12 research test PASS in isolated V8 execution.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_MACD_RESPONSE_PROFILE_V0_1.md
  research/technical_indicator_macd_response_profile_v0_1.json
  research/test_technical_indicator_macd_response_v0_1.mjs

### Current lane status

PRIMARY_THEORY_DECOMPOSITION = COMPLETE_V0_1
OBSERVER_STATE_CONSTRUCTION = DESIGN_FROZEN_RUNTIME_NO_GO
ADX14_FORMULA = FROZEN
ADX14_ISOLATED_CORE = QA_PASS
BBANDS20X2_FORMULA = FROZEN
BBANDS20X2_ISOLATED_CORE = QA_PASS
MACD_RESPONSE_F1_F12 = QA_PASS
SNAPSHOT_V0_2 = PROPOSAL_ONLY
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
PROSPECTIVE_TECHNICAL_OBSERVER = NO_GO
OUTCOME_INFERENCE = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Do not expand named indicators.
2. Isolated formula/mechanics blockers for KD/RSI/MACD/ADX/Bollinger are now materially reduced.
3. Next high-value research target is DATA-SEMANTIC READINESS:
   - reconcile TECHNICAL_CONTINUITY handoff with Corporate Actions lane;
   - define exact symbol-session/continuity receipt consumable by the future Technical Indicator observer;
   - preserve exact parent lineage/captureGeneration.
4. Do not implement production observer persistence until the shared continuity/runtime dependency is ready and governance allows it.
5. No historical Shadow fabrication.
6. Once continuity + parent lineage are runtime-ready, begin prospective-only Technical Indicator capture before any outcome inference.
7. MACD future alpha question is specifically transition residual value after direct trend controls and false-turn/noise burden, not crossover/Histogram-sign voting.
8. ADX future alpha question is H/L/TR trend-quality residual beyond pathEfficiency/trendPersistence, not "high ADX bullish".
9. Bollinger future alpha question is Close-level dispersion residual beyond ATR/realized-vol/VCP, not "band touch" rules.
10. Formal Core remains unchanged.

## Latest durable research commits

- 313a97952f4c28fcb73d4a9b770929dfb4b5b140 — correct TA-Lib ADX initialization prose.
- 2a43fff338da362d047631ef31f6e4cdba3b1e58 — correct machine-readable ADX formula contract.
- 9182d878da178cde14dc4a8a0111b430f76672ad — isolated ADX/Bollinger core implementation.
- 6fe11d7c7ad9ceeb7ae9ffb352b51d0d71ae707f — hardened ADX/Bollinger core tests with asymmetric oracle.
- 423ede78d6868340acff05a00496d6f09bb38378 — asymmetric ADX initialization oracle.
- 4625a68a085a75380787dbcef242707c43d0506f — MACD F1-F12 response-profile analysis.
- 1b7ef2c1db6fee2c33c8d62607d6ddcfe7f96c7e — machine-readable MACD response receipt.
- 41a82a7064ad6ecb6f98ddc1e986f1d09e651b4f — MACD response mechanics test.
- 1bd426389763653ece68937a537b279921391312 — isolated technical-indicator QA receipt.


## Continuation update — TI-328 through TI-350

### Shared TECHNICAL_CONTINUITY handoff — TI-328..TI-341
- V8.12 RAW_HISTORY_ADMISSION and TECHNICAL_CONTINUITY_CERTIFICATION are formally separated.
- V8.12 materially validates raw daily-history freshness/source admission and requires historyFreshness.usable===true before Formal market-feature construction, but this does NOT certify corporate-action continuity, PIT action-vintage correctness or symbol-specific suspension completeness.
- Future Technical Indicator inference requires both:
  RAW_HISTORY_ADMISSION_PASS
  AND
  TECHNICAL_CONTINUITY_CERTIFIED.
- Expected eligible symbol sessions are:
  official market sessions minus VERIFIED symbol-specific suspension/non-trading sessions.
- Verified suspension absence is not missing-source data; unverified missing bars remain UNKNOWN/MISSING; pseudo-bars are prohibited from indicator input.
- Continuity transformation may use only corporate-action event versions known by the target decision timestamp. Later corrections must not backfill earlier as-of states.
- Relevant event window:
  cleanHistoryStartDate < effectiveDate <= asOfDate.
- Every relevant price-reset event requires a verified, positive technicalPriceFactor. Missing factor remains BLOCKED/UNKNOWN; factor=1 is never a missing-data default.
- TECHNICAL_CONTINUITY neutralizes only the verified mechanical reset. Residual non-mechanical market gaps remain real information and must be preserved for ATR/ADX/gap/Pattern research.
- Semantic spaces remain separate:
  RAW_EXECUTION,
  TECHNICAL_CONTINUITY,
  PRICE_INDEX_COMPARABLE,
  TOTAL_RETURN_COMPARABLE.
- Future continuityReceiptId binds:
  symbol/asOf/window,
  source/raw-admission identity,
  symbol-session/session-calendar versions,
  continuity-engine version,
  corporate-action registry version,
  continuity transform hash.
- Coverage receipt includes market sessions, verified symbol suspensions, expected eligible sessions, raw/continuity bars, transformed bars, unresolved missing sessions/events, rejected pseudo-bars and price-limit-constrained bars.
- VALID requires zero unresolved missing sessions/events and exact eligible date-set reconciliation.
- Every transformed event preserves eventKey/action family/stage/version/knownAt/effectiveDate/technicalPriceFactor/source/quality/reference/transform/conflict/unknown provenance.
- Technical Indicator snapshots reference this canonical continuity receipt. The indicator lane must not derive a second corporate-action factor or suspension calendar.
- Recursive indicators additionally require canonical replay lineage; a valid continuity window alone is not enough to certify recursive state.
- Parent lineage remains:
  parentDecisionReceiptId,
  or scanDate+symbol+parentSnapshotHash+captureGeneration.
- Observation identity therefore joins:
  parent decision state
  x continuityReceiptId
  x formulaVersion/stateLineageId.
- Current readiness:
  RAW_HISTORY_ADMISSION = MATERIAL_PASS;
  TECHNICAL_CONTINUITY research semantics = FROZEN_SHARED;
  TECHNICAL_CONTINUITY runtime = BLOCKED;
  symbol-session runtime completeness = PARTIAL;
  prospective Technical Indicator observer = NO_GO.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_CONTINUITY_HANDOFF_V0_1.md
  research/technical_indicator_continuity_handoff_v0_1.json
- Snapshot v0.2 proposal now explicitly references continuityReceiptId/rawHistoryAdmissionReceiptId rather than duplicating Corporate Actions transform logic.
- Snapshot v0.2 also prohibits local indicator corporate-action adjustment and missing-factor default-one behavior.

### Corporate-action contamination falsification — TI-342..TI-350
- A deterministic known-truth synthetic witness was executed:
  economic path is perfectly flat;
  raw quoted path mechanically resets 100 -> 50 at index50;
  TECHNICAL_CONTINUITY comparator is flat at 50 for the entire history.
- Continuity comparator remains neutral:
  KD K/D=50/50;
  RSI14=50;
  MACD DIF/Histogram=0;
  ADX +DI/-DI/ADX=0;
  Bollinger BandWidth=0 and %B=NULL.

- Raw KD:
  reset offset0 K=33.6569579288 / D=44.5523193096;
  offset5 K=5.2752140850 / D=13.8838946822;
  offset19 K=49.6368599928 / D=48.2236185329;
  offset40 K=49.9999271956 / D=49.9991342300.
  Rolling-range contamination clears finitely, but K/D recursive memory remains.

- Raw RSI14:
  reset offset0 = 0;
  remains exactly 0 through offsets 1/5/8/9/13/19/20/30/40/49 on the flat post-reset path.
  Mechanism:
  one false loss enters avgLoss, avgGain remains exactly zero, so Wilder RSI stays pinned at 0 even as avgLoss decays.
  This decisively rejects "the bad return naturally washes out after 14 bars."

- Raw MACD:
  event DIF=-3.9886039886 / Histogram=-3.1908831909;
  offset13 DIF=-12.2006805651 / Histogram=-0.0195817678;
  offset19 DIF=-8.9574780438 / Histogram=+1.5943266031;
  offset40 DIF=-2.0780474733 / Histogram=+0.8731575901;
  offset49 DIF=-1.0542735222 / Histogram=+0.4718087252.
  Economic truth is flat; the apparent negative trend plus later positive Histogram is only filter recovery from a mechanical scale shift.

- Raw ADX produces the strongest falsification:
  event -DI=64.8150795106 / ADX=7.1428571429;
  offset5 ADX=35.8950007012;
  offset13 ADX=64.5664689780;
  offset19 ADX=77.2853351868;
  offset30 ADX=89.9474830170;
  offset40 ADX=95.2089800225;
  offset49 ADX=97.5409586514,
  while economic price remains flat and +DI remains zero.
- Mechanism:
  with only one directional side non-zero, DX can remain near 100 even while the absolute DI magnitude decays. ADX therefore smooths toward an extreme trend-strength reading.
- This is a DMI normalization consequence, not an implementation defect.
- It proves high ADX alone cannot distinguish genuine persistent trend strength from residual one-sided directional memory after a large mechanical shock.

- Raw Bollinger20:
  event BandWidthPct=44.7066558312;
  offset5=107.8253104695;
  offset13=141.0023290756;
  offset19=0 exactly once the 20-close window contains only post-reset bars.
  Finite-window contamination is therefore structurally different from recursive-state contamination.

- Indicator-specific continuity certification is now frozen:
  KD = HYBRID_FINITE_RANGE_PLUS_RECURSIVE;
  RSI = RECURSIVE_IIR_NONLINEAR_RATIO;
  MACD = CASCADED_RECURSIVE_FILTER;
  ADX = CASCADED_RECURSIVE_DIRECTIONAL_RATIO;
  BBANDS = FINITE_WINDOW.
- Generic elapsed-calendar-day or wait-N-bars repair is rejected.
- Snapshot v0.2 proposal now carries per-indicator memory/certification requirements.
- Synthetic continuity regression test PASS in isolated V8 execution.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_CA_CONTAMINATION_MATRIX_V0_1.md
  research/technical_indicator_ca_contamination_v0_1.json
  research/test_technical_indicator_ca_contamination_v0_1.mjs

### Current lane status

PRIMARY_THEORY_DECOMPOSITION = COMPLETE_V0_1
ISOLATED_FORMULA_MECHANICS = MATERIAL_PASS
CONTINUITY_HANDOFF_CONTRACT = FROZEN_V0_1
INDICATOR_MEMORY_CERTIFICATION = FROZEN
RAW_HISTORY_ADMISSION = MATERIAL_PASS
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
SYMBOL_SESSION_RUNTIME_COMPLETENESS = PARTIAL
SNAPSHOT_V0_2 = PROPOSAL_ONLY / CONTINUITY_LINKED
PROSPECTIVE_TECHNICAL_OBSERVER = NO_GO
OUTCOME_INFERENCE = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Do not expand named indicators.
2. Continue data-semantic readiness rather than alpha testing.
3. Next high-value target:
   price-limit / constrained-session semantics for KD/RSI/MACD/ADX/Bollinger in Taiwan, because a continuity-valid bar can still reflect censored price discovery.
4. Verify current Taiwan exchange price-limit exceptions/IPO/no-limit/reopening semantics from official sources before freezing the constrained-session contract.
5. Preserve CONSTRAINED as distinct from INVALID/BLOCKED.
6. Do not arm a prospective Technical Indicator observer until TECHNICAL_CONTINUITY runtime + symbol-session provenance + immutable parent lineage are ready.
7. No historical Shadow fabrication and no outcome join.
8. Formal Core remains unchanged.

## Latest durable research commits

- ae7c61cbe9d451fda444ce573e8e60e97d49f47e — Technical Indicator continuity handoff specification.
- dcccc8bedbc1ffb59f99085f1bfba84bbfc553cb — machine-readable continuity handoff contract.
- 41f19703edc2d9cc38c4e403b981166475826c13 — Snapshot v0.2 linked to continuity receipt.
- d5057449cd53de63fd2b0835334fcb9441452735 — corporate-action contamination matrix.
- 7864b17c411ecb3ea5770e151c12277294831c5f — contamination receipt.
- 6ae15eb8da000844e9ab61d1c7b252fbe83c4872 — continuity contamination regression test.
- 616b37d6b94bc4e50ff482215710c9e6b5b42955 — per-indicator continuity certification added to Snapshot v0.2 proposal.


## Continuation update — TI-351 through TI-366

### Taiwan price-limit / constrained-session semantics — TI-351..TI-360
- Current TWSE official rule verification:
  ordinary stocks generally trade within +/-10% of the auction reference price at market opening.
- Qualifying newly listed TWSE common stocks have no ordinary price fluctuation limit for the first five trading days; specified transfer/relisting cases follow their own rule.
- TPEx official materials likewise confirm the ordinary +/-10% daily-reference regime and explicitly retain an initial-listing no-limit period with specified exceptions.
- Therefore limit provenance is symbol/date/regime specific.
- Do NOT universally derive legal limit prices as priorClose * 1.10 / 0.90.
- Ex-right/ex-dividend and other special-reference sessions require the official/verified session reference. TWSE TWT49U explicitly exposes ex-right/ex-dividend reference price, Limit Up, Limit Down, opening reference and auction reference.
- Frozen limit-regime states:
  STANDARD_LIMIT_REGIME;
  NO_LIMIT_INITIAL_LISTING;
  SPECIAL_REFERENCE_LIMIT_REGIME;
  OTHER_OFFICIAL_LIMIT_REGIME;
  UNKNOWN_LIMIT_REGIME.
- Frozen observed boundary states:
  NOT_TOUCHED;
  UPPER_TOUCHED;
  LOWER_TOUCHED;
  CLOSE_AT_UPPER;
  CLOSE_AT_LOWER;
  BOTH_BOUNDARIES_TOUCHED;
  ONE_PRICE_AT_BOUNDARY;
  UNKNOWN_BOUNDARY_RELATION.
- PRICE_LIMIT_REGIME_PRESENT does not mean price discovery is constrained.
- Binding/censoring begins when the verified boundary is actually touched/binds.
- CLOSE_AT_UPPER/LOWER is NOT LIMIT_LOCKED.
- ONE_PRICE_AT_BOUNDARY is still insufficient to prove unfilled queue persistence from daily OHLC alone.
- LIMIT_LOCKED label is prohibited without order-book/event evidence.
- Boundary-touching data remain factual VALID observations but move to a CONSTRAINED interpretation stratum rather than INVALID/BLOCKED.
- No-limit initial-listing sessions are SPECIAL_SESSION, not ordinary unconstrained historical data; no synthetic pre-listing history may be invented for indicator warm-up.
- Required future per-bar provenance includes:
  limitRegime,
  auctionReferencePrice,
  upper/lowerLimit,
  limitSource/ruleVersion,
  boundaryRelation,
  high/low/close-at-limit flags,
  onePriceAtBoundary,
  priceDiscoveryState.
- Window summaries preserve constrained counts rather than dropping extreme sessions.
- Indicator-specific consequences:
  KD range extrema can be boundary-censored;
  RSI observed close-return magnitude can be capped;
  MACD may observe a capped staircase rather than free latent slope;
  ADX H/L/TR/DM inputs are directly censorable;
  Bollinger observes capped close dispersion.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_TAIWAN_PRICE_LIMIT_V0_1.md
  research/technical_indicator_taiwan_price_limit_v0_1.json
- Continuity handoff and Snapshot v0.2 proposal now carry price-limit provenance and explicitly prohibit LIMIT_LOCKED inference from daily OHLC.

### Price-limit non-identifiability — TI-361..TI-366
- A structural identification firewall is frozen:
  different latent supply/demand states can map to the same boundary-capped observed OHLC.
- If two latent states produce identical observed OHLC, every deterministic OHLC technical indicator is necessarily identical:
  KD, RSI, MACD, ADX/DMI, Bollinger and any other deterministic OHLC transform.
- This is not correlation; it is a many-to-one observation map.
- Repeated upper/lower-bound sessions may demonstrate persistent observed directional pressure but cannot identify:
  latent unconstrained clearing price,
  unfilled queue size,
  queue persistence,
  cancellation/replenishment,
  aggressive order imbalance.
- Prohibited daily-OHLC claims:
  latent return = X;
  excess-demand magnitude;
  locked buying pressure;
  queue strength;
  true breakout distance beyond the legal limit.
- Allowed:
  observed boundary touch;
  observed capped path;
  numerical indicator state on observed prices;
  separate constrained stratum.
- Cross-sectional ranking hazard:
  two stocks can have the same technical state at the upper boundary while hidden queue/intensity differs materially.
- Any future attempt to distinguish latent intensity must consume genuinely different information from Microstructure / Price-Volume:
  order-book queue,
  trade-event flow,
  touch timing,
  reopen/uncross behavior,
  next-session acceptance.
- Multiple indicators computed from the same capped path cannot receive a "confluence" bonus for hidden pressure.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_PRICE_LIMIT_NONIDENTIFIABILITY_V0_1.md
  research/technical_indicator_price_limit_nonidentifiability_v0_1.json

### Current lane status

PRIMARY_THEORY_DECOMPOSITION = COMPLETE_V0_1
ISOLATED_FORMULA_MECHANICS = MATERIAL_PASS
CONTINUITY_HANDOFF_CONTRACT = FROZEN_V0_1
INDICATOR_MEMORY_CERTIFICATION = FROZEN
TAIWAN_PRICE_LIMIT_CONTRACT = FROZEN_V0_1
PRICE_LIMIT_NONIDENTIFIABILITY = FROZEN
RAW_HISTORY_ADMISSION = MATERIAL_PASS
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
PRICE_LIMIT_RUNTIME_PROVENANCE = NOT_CERTIFIED
SYMBOL_SESSION_RUNTIME_COMPLETENESS = PARTIAL
SNAPSHOT_V0_2 = PROPOSAL_ONLY / CONTINUITY_AND_LIMIT_LINKED
PROSPECTIVE_TECHNICAL_OBSERVER = NO_GO
OUTCOME_INFERENCE = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Do not expand named indicators.
2. Continue data-semantic readiness.
3. Next high-value target:
   define the exact prospective Technical Indicator observer readiness gate that combines:
   parent decision lineage,
   raw-history admission,
   symbol-session completeness,
   TECHNICAL_CONTINUITY receipt,
   price-limit provenance,
   formula/state lineage,
   100% attempt accounting.
4. Distinguish DATA_READY from INFERENCE_READY and from ALPHA_MATURE.
5. Do not implement runtime persistence or new D1 schema without governance/owner approval.
6. No historical Shadow fabrication.
7. No outcome inference before complete prospective receipts.
8. Formal Core remains unchanged.

## Latest durable research commits

- 4e26e6b85796a10b28a1b3be29d58d6eb509dcc0 — Taiwan price-limit technical semantics.
- 5ee0f99b3e7ac2227d80b6d0a44b335b4c237039 — machine-readable Taiwan price-limit contract.
- 44cf01542220d46f513685ecea3297f8bb2b41d7 — price-limit provenance added to continuity handoff.
- c564c028986f58f284c11165170eeec0b5a4d107 — price-limit provenance added to Snapshot v0.2 proposal.
- 2aabd4be85418a07e7f6ed95f88a6e18f9da4eaf — price-limit non-identifiability firewall.
- a19ff2d7b32801fe2bf88c76ae6fe4233cbda3d9 — machine-readable non-identifiability contract.


## Continuation update — TI-367 through TI-378

### Prospective observer readiness gate — TI-367..TI-378
- A seven-level readiness model is frozen so "formula works", "data exists", "can inspect outcomes", "incremental value proven", and "Formal review eligible" cannot be conflated.
- R0_FORMULA_QA_READY:
  formulaVersion + deterministic oracle + replay/prefix + edge semantics.
- R1_SOURCE_READY:
  immutable parent identity + raw-history admission + complete symbol-session coverage + TECHNICAL_CONTINUITY receipt + price-limit provenance + formula/state lineage + PIT timing.
- R2_CAPTURE_COMPLETE:
  exact parent keyset + 100% attempt accounting + zero missing parents + zero provenance conflicts + COMPLETE run receipt.
- R3_DESCRIPTIVE_READY:
  complete independent-date prospective coverage, quantified blocked/unknown/constrained rates, stable version/common support.
- R4_OUTCOME_JOIN_READY:
  valid outcome provenance, exact keyset join, no partial-date truncation, forward-only outcomes, preregistered experiment, constrained/special-listing strata preserved.
- R5_INCREMENTAL_INFERENCE_READY:
  mature prospective sample, BASE controls, redundancy residualization, date-cluster robustness, regime/industry/liquidity splits, costs, multiple-testing and purged holdout where applicable.
- R6_FORMAL_REVIEW_ELIGIBLE:
  reuses project maturity gates:
  D5 mature N>=60;
  prospective complete snapshots>=30;
  independent Formal scan dates>=15;
  >=2 years;
  >=2 regimes;
  purged training scan dates>=10;
  holdout>=5 Formal scan dates;
  train/holdout direction consistent;
  candidate coverage/zero-pick safe;
  redundancy/cost/overfit/Baseline-vs-Formal incremental checks pass.
- R6 is only eligibility to surface a FORMAL_OPTIMIZATION_CANDIDATE. It never authorizes automatic Formal changes.
- Readiness is per research question, not per indicator display name.
- Every expected parent must produce exactly one attempt status:
  VALID_OBSERVABLE,
  VALID_CONSTRAINED,
  BLOCKED_SOURCE,
  BLOCKED_CONTINUITY,
  BLOCKED_FORMULA_STATE,
  UNKNOWN_PROVENANCE.
- Blocked/unknown parents remain in the denominator; silent dropping is prohibited.
- COMPLETE run receipt requires exact generation/keyset accounting, 100% attempts, zero missing/provenance conflicts, and no replay/prefix correctness failure.
- DATA_READY != INFERENCE_READY != ALPHA_MATURE.
- Version changes split evidence unless exact compatibility is separately proven:
  formula,
  continuity engine,
  corporate-action registry when transformed history changes,
  symbol-session contract,
  price-limit contract,
  state-construction version.
- Prospective clock begins only when immutable parent lineage + armed observer + persisted source/continuity/limit/state contracts + complete run receipts are live.
- Existing historical bars, isolated formula implementation date or reconstructed legacy Shadow rows do not start the prospective evidence clock.
- Engineering classification remains:
  pure isolated formula/readiness computation = Class A;
  shared D1/Worker/schedule/continuity wiring = Class B proposal-first;
  Formal decision behavior = Class C owner approval.
- Current primary queue:
  KD_vs_RSI R0=MATERIAL_PASS / R1=BLOCKED;
  MACD_vs_DIRECT_TREND R0=MATERIAL_PASS / R1=BLOCKED;
  ADX_vs_TREND_QUALITY R0=MATERIAL_PASS / R1=BLOCKED;
  BBW_vs_ATR_VCP R0=MATERIAL_PASS for Bollinger / R1=BLOCKED, with later R5 additionally requiring common-support Pattern/VCP evidence.
- No primary Technical Indicator question is currently R4 or R5 ready.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_OBSERVER_READINESS_GATE_V0_1.md
  research/technical_indicator_observer_readiness_gate_v0_1.json

### Current lane status

TECHNICAL_INDICATOR_FORMULA_QA = R0_MATERIAL_PASS
TECHNICAL_INDICATOR_SOURCE_RUNTIME = BELOW_R1
TECHNICAL_INDICATOR_CAPTURE = NOT_STARTED
DESCRIPTIVE_PROSPECTIVE_EVIDENCE = NOT_STARTED
OUTCOME_JOIN = NO_GO
INCREMENTAL_INFERENCE = NO_GO
FORMAL_REVIEW_ELIGIBILITY = NO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Do not expand named indicators.
2. Continue isolated source/semantic QA while shared runtime dependencies remain blocked.
3. The next implementation step, if pursued, is not Class A anymore:
   immutable parent-linked Technical Indicator persistence/observer wiring plus shared continuity consumption is Class B proposal-first.
4. Before any Class-B proposal is recommended for owner approval, first finish a bounded implementation-impact audit:
   schema/storage writes,
   provider-call delta,
   scan latency/memory,
   failure isolation/fail-open behavior,
   exact parent keyset integration,
   compatibility with the proposed shared Shadow cohort architecture.
5. No runtime change/merge/deploy without explicit owner approval.
6. No historical Shadow fabrication or outcome inference.
7. Formal Core remains unchanged.

## Latest durable research commits

- 2ca646bf3b5b84fc62aded0979eb7d46ec5d542b — Technical Indicator observer readiness gate.
- 275db2d59b8f79dfcc82bf93803a97a26b938fd8 — machine-readable Technical Indicator observer readiness matrix.


## Continuation update — TI-379 through TI-390

### Class-B implementation impact audit — TI-379..TI-390
- A bounded production-impact audit was completed before asking for any owner approval.
- Legacy trade_research_shadow_candidates is explicitly rejected as a promotion-grade Technical Indicator parent because it:
  - uses PRIMARY KEY(scan_date,symbol);
  - DELETEs a scan date before rewriting;
  - inserts/upserts rows individually;
  - stores one mutually exclusive cohort;
  - lacks immutable captureGeneration / semantic-fingerprint parentage.
- The legacy builder also uses a used set, so research memberships are mutually exclusive in the captured row model.
- Current legacy theoretical maximum per scan date is:
  SELECTED<=6
  + QUALIFIED_NOT_SELECTED<=12
  + NEAR_MISS<=12
  + REJECTED_AFTER_BASE<=12
  + BROAD_CONTROL<=12
  = <=54 distinct rows/date.
- This <=54 is only a current-archive reference and must NOT be used to size the future immutable parent, which may preserve a much larger pre-sampling population.
- Technical Indicator should reuse the unified immutable per-symbol decision-state parent architecture rather than create a second parent universe.
- Preferred future shape:
  parent = shared immutable decision-state receipt;
  child = Technical Indicator evidence keyed by parentDecisionReceiptId/captureGeneration/observerVersion/formula bundle/asOf;
  run = one observer run receipt per scanDate/generation.
- Storage preference:
  reuse a generic immutable evidence-child table if the shared architecture supplies one.
  Only if no generic child exists should Technical Indicator propose dedicated snapshot/run tables.
- Formula computation itself can potentially add zero steady-state market-data calls if shared continuity history and replay-certified state already exist.
- But:
  bootstrap source-call delta = UNKNOWN;
  TECHNICAL_CONTINUITY runtime call/source delta = dependency-owned and not yet proven zero.
- Do not add per-indicator provider fetches.
- Arithmetic cost is not the main risk; likely costs are history/source loading, continuity transformation, immutable persistence and large parent keyset I/O.
- Recursive state cache may reduce steady-state work to O(1) per new bar, but remains a cache only. Canonical replay lineage remains authority and dirty-state rebuild is mandatory.
- Future observer must run after protected Formal decision state is frozen/persisted and be fail-open:
  no selection/order/plan/capital/monitor/signal/push effect.
- Initial eventual scope should be AFTER_MARKET only; no intraday Technical Indicator persistence before daily evidence exists.
- A technically minimal child is feasible, but a Class-B implementation proposal is PREMATURE because:
  1. immutable decision-state parent/captureGeneration architecture is not implemented;
  2. production TECHNICAL_CONTINUITY handoff remains blocked;
  3. runtime-complete symbol-session/price-limit provenance is not certified;
  4. real-parent-scale D1 write/latency impact is unknown.
- Therefore no owner approval is requested yet.
- Prefer one consolidated shared research-infrastructure proposal later rather than separate Pattern/Technical migrations where possible.
- New durable artifacts:
  research/TECHNICAL_INDICATOR_CLASS_B_IMPACT_AUDIT_V0_1.md
  research/technical_indicator_class_b_impact_audit_v0_1.json

### Current lane status

TECHNICAL_INDICATOR_FORMULA_QA = R0_MATERIAL_PASS
TECHNICAL_INDICATOR_SOURCE_RUNTIME = BELOW_R1
CLASS_B_TECHNICAL_CHILD_FEASIBILITY = MATERIAL
CLASS_B_IMPLEMENTATION_PROPOSAL = PREMATURE
IMMUTABLE_PARENT_DEPENDENCY = BLOCKED_NOT_IMPLEMENTED
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
PRICE_LIMIT_SYMBOL_SESSION_RUNTIME = NOT_CERTIFIED
PROSPECTIVE_TECHNICAL_CAPTURE = NOT_STARTED
OUTCOME_JOIN = NO_GO
INCREMENTAL_INFERENCE = NO_GO
FORMAL_REVIEW_ELIGIBILITY = NO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Updated exact next continuation point

1. Do not return to named-indicator expansion.
2. Continue bounded infrastructure feasibility only.
3. Reconcile Technical Indicator with the unified immutable Shadow parent proposal:
   - exact future parent scope;
   - whether a generic evidence-child schema can serve Pattern + Technical + other research children;
   - expected real row/write volume;
   - same-scan already-loaded history reuse;
   - continuity runtime source/call cost.
4. Avoid Technical-specific D1 implementation until that shared architecture is resolved.
5. Only when dependencies are materially ready should one consolidated Class-B research-infrastructure proposal be surfaced to the owner for approval.
6. No historical Shadow fabrication, no outcomes, no Formal changes.

## Latest durable research commits

- 461247f36c23fc0bd84134d3e9ba50650c60bb3c — Technical Indicator Class-B implementation impact audit.
- 898f0d90a6696b600e090fe4211938577b4fb0e5 — machine-readable Technical Indicator impact receipt.


## Continuation update — TI-391 through TI-395 (shared-parent completeness)

- New outcome-blind audit: `research/TECHNICAL_INDICATOR_SHARED_PARENT_FEASIBILITY_V0_1.md` at commit `93d5b9acdfe208eade7fec860bde51efa521eaf3`.
- TI-391: legacy <=54 sampled rows/date is not the future parent count. A pre-sampling immutable decision-state universe may be ~full-market scale; exact parent scope and production D1 write cost remain UNKNOWN. Illustrative 1,800 parents/date imply 36,000 child attempts over 20 sessions, not measured rows/cost. Legacy LIMIT 5000 would show only two full illustrative 1,800-row dates and a partial third; complete keyset pagination is mandatory.
- TI-392: Technical, Pattern, Target/RR and external evidence must share one immutable decision-state parent/generation; overlapping cohort memberships must not duplicate a Technical child. The older v0.1 snapshot contract's “existing Shadow parent” cannot be used as authority to attach promotion-grade evidence to the mutable legacy Shadow archive.
- TI-393: persistence completeness differs from formula observability. Every preregistered parent attempt needs an explicit child status; missing child, WARMUP, DATA_BLOCKED, constrained and UNKNOWN are not zeros or negative signals. A COMPLETE run requires parent keyset hash plus expected/persisted exact reconciliation, no duplicate/orphan rows and generation-consistent reads. Synthetic falsifiers include 1,799/1,800 persisted, duplicate memberships, changed-fingerprint rerun and partial-date reader.
- TI-394: zero extra provider calls is conditional on same-scan history, runtime TECHNICAL_CONTINUITY and canonical recursive-state replay. Bootstrap/rebuild, D1 index writes, scan latency and actual account limits remain unmeasured/UNKNOWN. Cloudflare D1 documentation confirms serial query processing, batch rollback semantics, Worker resource limits and query-level read/write metrics; it does not establish actual project usage.
- TI-395: a selected-only indicator sample cannot support admission/ranking conclusions. Future inference must match population scope to intended change and retain exact qualified/gate-evaluable denominators. No outcome join, return advantage, alpha or Formal optimization claim was made.
- Governance: research documentation only; no Worker/D1 schema/monitor/ranking/signal/push change; no historical Shadow fabrication. Class-B implementation proposal remains PREMATURE; Formal Core LOCKED.

### Current lane status

TECHNICAL_INDICATOR_FORMULA_QA = R0_MATERIAL_PASS
TECHNICAL_INDICATOR_SOURCE_RUNTIME = BELOW_R1
SHARED_PARENT_SCOPE = UNFROZEN
GENERIC_EVIDENCE_CHILD = DESIGN_DEPENDENCY
CHILD_COMPLETENESS_CONTRACT = RESEARCH_SPECIFIED_NOT_IMPLEMENTED
REAL_D1_COST_LATENCY = UNKNOWN
PROSPECTIVE_TECHNICAL_CAPTURE = NOT_STARTED
OUTCOME_JOIN = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE

### Exact next continuation point

1. Read latest shared immutable cohort/decision-state proposal and D03 checkpoint before further work; merge concurrent progress.
2. Reconcile the shared owner's final pre-sampling parent population, captureGeneration identity, generic evidence-child interface and complete-keyset reader before writing D03 runtime code.
3. Obtain actual parent counts and non-secret baseline D1/Worker metrics through authorized read-only evidence; do not extrapolate from legacy 54.
4. Build outcome-blind isolated synthetic tests for parent/child keyset equality, partial write/retry, changed-fingerprint conflict, overlap deduplication and truncated date reads; keep Worker unmodified.
5. Validate same-scan history reuse, bootstrap/rebuild and corporate-action continuity with canonical lineage; price-limit symbol-session receipt remains dependency-owned.
6. Only after material dependency resolution prepare one consolidated Class-B infrastructure proposal for owner review. TI-005 KD-vs-RSI and TI-006 MACD-vs-trend remain the first eventual prospective inference tests. No Formal change.


## Continuation update — TI-396 through TI-400 (isolated reconciliation falsifiers)

- Isolated executable research fixture added: `research/test_technical_indicator_parent_reconciliation_v0_1.mjs`; GitHub commit `d72c6ec2437f982383707e26cf16fe98778d1b51`.
- Local independent Node execution: PASS, 19 outcome-blind assertions (latest test commit `e11fce38e34aea3b037d9030bb87853b683be8de`). The test does not import Worker, D1, market data, or outcomes.
- TI-396: of 1,800 illustrative expected immutable parents, 1,799 child rows is INCOMPLETE despite every persisted child being formula-valid. Persisted completeness and formula readiness are separate.
- TI-397: 200 explicit UNKNOWN children with all 1,800 attempts persisted gives a COMPLETE persistence receipt with 1,600 READY and 200 UNKNOWN, not 1,800 signal-ready rows. UNKNOWN cannot be changed into BAD/zero.
- TI-398: duplicate child, orphan child and parent-fingerprint mismatch are QA_FAIL; a changed fingerprint under the same immutable identity returns PROVENANCE_CONFLICT, while an identical retry is IDEMPOTENT. New generation is a distinct identity, not a silent rewrite.
- TI-399: missing page keys or explicit truncation makes a full-date read INCOMPLETE; exact two-page keyset returns COMPLETE. A complete-looking prefix alone cannot establish full population coverage.
- TI-400: a parent in two research memberships still creates one Technical child/parent attempt. This guards cohort-overlap double counting.
- Limit: these are isolated semantic assertions, not actual D1 transaction, concurrency, production performance, market source, continuity, or prospective outcome tests. No maturity level change is justified.
- No Formal runtime, Worker, D1 schema, scan schedule, signals, push, or trading logic changed. No FORMAL_OPTIMIZATION_CANDIDATE.

### Current lane status

PARENT_CHILD_RECONCILIATION_SYNTHETIC_QA = PASS_ISOLATED
PARENT_GENERATION_PERSISTENCE_PRODUCTION = NOT_IMPLEMENTED
PROSPECTIVE_TECHNICAL_CAPTURE = NOT_STARTED
REAL_PARENT_COUNTS_D1_COST = UNKNOWN
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
OUTCOME_JOIN = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Exact next continuation point

1. Re-read latest shared architecture and D03 checkpoint; do not repeat TI-391..400.
2. Cross-generation mixed page reads and empty-universe population receipts now have isolated passing falsifiers. Next test interrupted multi-batch/retry receipt state only after the shared owner's generation lifecycle is frozen. Do not claim synthetic tests prove D1 atomicity.
3. Reconcile shared immutable decision parent scope and generic evidence-child keys with Pattern/Target-RR cohort design; no D03-specific parent.
4. Seek real non-secret per-scan parent counts and D1/Worker baseline metrics through an authorized read-only path; no direct D1 connector is currently exposed here, so record UNKNOWN until evidence is available.
5. Keep continuity and price-limit provenance gates distinct from completeness, and outcome inference blocked until prospective parents satisfy them.
6. Future empirical order remains TI-005 KD-vs-RSI then TI-006 MACD-vs-direct-trend. Formal unchanged.

## TI-401 — parent zero and cross-generation reader guards

- Added four isolated assertions: mixed captureGeneration page is FOREIGN_PAGE_KEY; zero expected parents without a population receipt is INCOMPLETE; explicit zero-count receipt may be COMPLETE; declared denominator inconsistent with enumerated parents is QA_FAIL.
- Local Node test PASS: total 19 assertions. This remains pure synthetic QA, not D1 transaction or production-completeness proof.
- Formal Core LOCKED; no outcome join, no maturity promotion.


## Continuation update — TI-402 through TI-408 (2026-09-28, source falsification)

Deep evidence and precise synthetic witnesses: `research/TECHNICAL_INDICATOR_SOURCE_GUARD_FALSIFICATION_V0_1.md`. This section supersedes the older `SHARED_PARENT_SCOPE=UNFROZEN` line above only for the proposed parent-scope definition; other blockers remain.

- TI-402: Frozen v0.1 core input validation converts null/blank/boolean to finite Number values, and does not reject nonpositive price or out-of-range close. On a 40-row synthetic NT$100 sequence one poisoned row could still yield `dataQualityState=VALID` and finite KD/RSI/MACD. This establishes an isolated research validation defect, not a deployed Worker incident.
- TI-403: Added `research/technical_indicator_source_guard_v0_1.mjs`, a separate versioned wrapper. It checks positive decimal OHLC, geometry, chronology, symbol, point-in-time assertion, future dates, technical continuity/official-session assertions, pseudo-bars and upstream receipt presence. Good 50-bar synthetic input yields the unchanged v0.1 KD/RSI/MACD values exactly. Numeric decimal strings remain accepted. Price-limit constrained interpretation is separate. No Formula v0.1 edit or production wiring.
- TI-404: Synthetic booleans, source availability and receipt strings are only assertions. The wrapper cannot independently authenticate TWSE/TPEx sessions, corporate-action transform, provider publication time, complete parent keyset, hash ancestry or price-limit regime. A forged upstream assertion remains an explicit negative counterexample.
- TI-405: Preventing false indicator states may reduce contamination, yet rejection can select by symbol/market/event/price and produce a false appearance of advantage. Log exact rejection denominators before prospective inference. Economic alpha, OOS behavior, dates, costs and fills remain unknown; no optimization candidate.
- TI-406: Corrected an isolated adapter mismatch from `tradeDate` to canonical `date`, required continuity/session/parent/raw-admission receipt IDs, and retested. The original draft never ran in production.
- TI-407: Source-template `Worker.js` may fill missing open/high/low with close. A numerically valid high/low may therefore be synthetic, invalidating KD range interpretation. Guard now requires per-field observed provenance for high/low/close plus observed raw bar identity and source hash; a substituted high=close labeled `SYNTHESIZED` is blocked. Missing open is permitted for these three formulas. The per-field label is a *proposed* upstream contract, not currently attested by the canonical handoff; a falsely labeled row can still pass. Source-template behavior is not proof about deployed Production.
- TI-408: Shared sizing contract now freezes proposed parent scope `FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1` (unique same-scan history-admitted featureRows before Formal fail-fast exclusion). Actual count distribution, complete immutable capture and runtime costs remain UNKNOWN. `HISTORY_CACHE_TARGET=2000` is not a hard cap; legacy <=54 Shadow is not this denominator. Do not fabricate normalized-today non-feature rows as parents.

Durable code commits: guard `c0adc8beb1de39c256dcabb9595d6736dda889d1`, tests `e5f47a055036d0e54ad8238863daea5a53307043`; report update `4397b49c35784463ee0f82a1d2d0e359fcb1ac33`. Local Node guard adversarial suite PASS; unchanged core regression PASS; parent reconciliation 19 assertions PASS. All are isolated synthetic QA without outcomes.

### Current lane status

PARENT_SCOPE_DEFINITION = FROZEN_PROPOSED_V0_1
ACTUAL_PARENT_COUNT_DISTRIBUTION = UNKNOWN
PARENT_CHILD_PRODUCTION_COMPLETENESS = NOT_IMPLEMENTED
FORMULA_INPUT_GUARD_SYNTHETIC = PASS_ISOLATED
OBSERVED_OHLC_FIELD_PROVENANCE_RUNTIME = UNKNOWN / DEPENDENCY_BLOCKED
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
PROSPECTIVE_TECHNICAL_CAPTURE = NOT_STARTED
OUTCOME_JOIN = NO_GO
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Exact next continuation point

1. Ask the shared source/continuity owner to define an independently attested raw per-field provenance and immutable hash lineage before any substitution; audit actual provider/date-specific OHLC coverage without self-certifying the guard.
2. Measure exact same-scan history-admitted featureRow parent population with duplicate/subset receipts and real non-secret D1/Worker cost/latency. Do not treat 2000 or 54 as actual parent counts.
3. Preserve complete child status (including blocked/unknown) against the immutable generation's exact parent keyset. Test false-positive source rejection against verified market sessions and corporate actions, with denominators by date/source/symbol.
4. Only after dependency and Class-B review consider runtime capture. First outcome-blind prospective observation precedes TI-005 KD vs RSI with direct price control and TI-006 MACD vs trend. No historical Shadow repair, no outcome join, no Formal edit.

## TI-409 — source hash presence does not bind content (2026-09-28)

- Isolated executable negative witness: `research/test_technical_indicator_hash_binding_falsification_v0_1.mjs`. A synthetic bar's high changes while its `sourceBarHash`, raw identity and provenance labels remain identical. Both snapshots pass `VALID` and KD differs. This is not a cryptographic collision; no digest verification occurs in the current research guard.
- Durable analysis: `research/TECHNICAL_INDICATOR_HASH_BINDING_FALSIFICATION_V0_1.md`. The source/continuity owner must supply an immutable raw payload receipt and separate transformed-bar lineage with point-in-time version semantics. Self-issued hashes or observed labels from the same adapter do not authenticate the source.
- No real-source accident or return effect is claimed. Synthetic QA does not upgrade tracker maturity. Runtime provenance, parent counts, prospective coverage and outcomes remain UNKNOWN or blocked. Formal Core LOCKED.

### Exact next continuation point after TI-409

1. Audit the shared upstream raw-source and continuity receipt contract for field-level content binding, first-known/capture times, revision lineage and independent attestation. Do not treat a nonempty hash string as proof.
2. Measure permissioned, outcome-blind real OHLC field and revision coverage by provider/date/market/symbol; retain UNKNOWN where absent. Test legitimate corrections and corporate-action transforms against certified sessions to quantify false-positive guard rejection.
3. Reconcile exact immutable parent generation and complete child status with actual same-scan counts and non-secret runtime costs before a consolidated Class-B proposal.
4. Only after prospective valid capture and PIT/OOS gates may TI-005 and TI-006 test incremental value. No Worker wiring, outcome join or Formal change now.

## TI-410 — a changed digest can still belong to a future revision (2026-09-28)

- Independent synthetic witness: `research/test_technical_indicator_revision_clock_falsification_v0_1.mjs` changes the last bar's high **and** asserted raw identity/digest, with a hypothetical first-known/capture time after the original decision. The isolated guard still returns `VALID` for both windows and KD changes, because it only checks one earlier context-level availability time. Distinct from TI-409's unchanged-hash witness.
- Durable reasoning and counterargument: `research/TECHNICAL_INDICATOR_REVISION_CLOCK_FALSIFICATION_V0_1.md`. Legitimate later corrections and corporate-action transformations require new versioned ancestry and decision-specific cutoff, not permanent rejection. An adapter's self-asserted timestamps do not authenticate source availability.
- Three isolated tests pass (new revision-clock, source guard, TI-409). No provider sample, measured false rejection rate, outcome or cost evidence. D03 maturity unchanged; Formal Core LOCKED.

### Exact next continuation point after TI-410

1. Obtain upstream independently attested per-field raw payload/version receipts, canonical content digest and per-version publication/first-known/capture clock; commit exact row versions to the immutable parent generation and transformation ancestry.
2. Audit permissioned real source OHLC field availability and corrections by provider/date/market/symbol, with certified session/corporate-action truth and explicit UNKNOWN. Measure legitimate-correction false rejection and actual same-scan parent/child counts plus non-secret runtime cost.
3. Keep TI-005/TI-006 outcome and incremental-value tests blocked until prospective complete capture, PIT/OOS and governance gates. No Formal or runtime wiring on synthetic evidence.

## TI-411 — same-date daily bar may precede its own completion (2026-09-29)

- Isolated synthetic witness: `research/test_technical_indicator_same_session_bar_falsification_v0_1.mjs` sets decision `asOf` to 09:00 Taipei on the final bar's own date, while the context availability timestamp belongs to the previous day. The guard admits two different full-day high values as `VALID`; KD differs. The equality case in its date-only future-bar check lacks a per-version completion/availability clock.
- Analysis and counterargument: `research/TECHNICAL_INDICATOR_SAME_SESSION_BAR_FALSIFICATION_V0_1.md`. Legitimate after-market final bars and explicitly partial intraday bars require different clock/completeness contracts; a hardcoded close hour alone is not source publication proof.
- Evidence scope: synthetic source QA only. Actual source coverage, rejection denominators, PIT attestation, outcome value, costs and OOS remain UNKNOWN. D03 tracker level/maturity stay unchanged; Formal Core LOCKED.

### Exact next continuation point after TI-411

1. Consolidate TI-409/410/411 into one upstream immutable row-version receipt: canonical raw field bytes and digest, observed field status, bar interval/completion, certified symbol session, provider version/first-known and local capture clocks, corporate-action transform ancestry, and decision-specific row-version commitment. Seek independent source-owner attestation rather than self-issued adapter strings.
2. Obtain authorized outcome-blind real OHLC/version/session samples; count complete, partial, corrected and UNKNOWN rows by provider/date/market/symbol and test legitimate same-day after-market rows and delayed corrections. Reconcile exact parent-child keysets and non-secret runtime costs.
3. Keep outcome joins, TI-005/TI-006 efficacy tests, Class-B runtime capture and Formal change blocked until prospective PIT and governance gates pass. No historical Shadow reconstruction.

## TI-412 through TI-417 — immutable OHLC row-version receipt (2026-09-29)

- TI-412: Added `research/technical_ohlc_row_version_receipt_v0_1.mjs` and the machine-readable contract `research/technical_ohlc_row_version_receipt_contract_v0_1.json`. The receipt binds exact raw OHLC string bytes to one canonical raw digest, then binds that digest to transformed OHLC, technical price-space/corporate-action lineage and a second transformed-row digest. The exact transformed row version is committed to one immutable `parentDecisionReceiptId + captureGeneration`.
- TI-413: Changing raw high bytes under an old digest returns `BLOCKED/RAW_CONTENT_DIGEST_MISMATCH`; changing transformed OHLC under an old transformed digest is also blocked. This is the executable positive repair contract for TI-409's isolated weakness, not proof that Production already supplies trustworthy bytes.
- TI-414: A legitimate next-day correction is blocked for the original decision cutoff but can become eligible for a later decision when separately first-known, captured, attested and committed. This preserves correction utility without rewriting earlier truth and directly addresses TI-410.
- TI-415: A completed daily bar whose certified interval ends after a 09:00 decision is blocked. A `PARTIAL` bar is a different contract and cannot satisfy a `COMPLETE` request. A legitimate after-market completed row can pass. Symbol-specific certified intervals remain necessary because the official TWSE closing-stabilization procedure can delay an individual close from 13:30 to 13:33.
- TI-416: `LOCAL_CAPTURE_ONLY`/self-issued adapter strings remain `UNKNOWN/INDEPENDENT_SOURCE_ATTESTATION_MISSING`; missing per-version first-known time remains `UNKNOWN`. The module validates internal integrity but cannot create source-owner authority.
- TI-417: Foreign parent generation, broken raw-to-transform ancestry and changed parent commitment fail closed with exact reasons. Twelve synthetic assertions pass together with TI-409/410/411, source-guard and canonical-hash regressions.
- Bounded source-only check: at 2026-09-29 20:20 Taipei, official TWSE OpenAPI `STOCK_DAY_ALL` returned 1,380 rows all dated ROC `1150924` (2026-09-24), payload SHA-256 `5895bbf2882e0b3d095befea940700d812418ad3a763d2304f8cb964b79f0fdf`, whole-file ETag and Last-Modified, but no visible row-level version/correction or first-known/capture fields. One capture does not establish all-provider coverage or latency; it is counterevidence against equating retrieval/current date or whole-file HTTP metadata with row-level PIT identity.
- Durable analysis: `research/TECHNICAL_INDICATOR_ROW_VERSION_RECEIPT_V0_1.md`; bounded machine-readable source receipt: `research/technical_ohlc_official_source_capture_20260929.json`.
- No return/outcome lookup, threshold search, OOS, Walk-forward, cost or fill inference occurred. D03 module levels and maturity stay 44.6%. `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.

### Exact next continuation point after TI-417

1. Have the shared source/continuity owner map real TWSE/TPEx/Fugle rows into `TECHNICAL_OHLC_ROW_VERSION_RECEIPT_V0_1` without D03 self-attestation. Preserve provider/date/market/symbol and explicit `UNKNOWN`.
2. Run outcome-blind multi-date/source captures; count complete, partial, corrected and `UNKNOWN` versions, verify certified symbol sessions and corporate-action transform ancestry, and quantify legitimate-correction false blocks.
3. Reconcile every status against the exact immutable parent-generation keyset and measure non-secret storage/latency/cost. Successful rows alone may not define coverage.
4. Keep TI-005 KD-vs-RSI, TI-006 MACD-vs-direct-trend, outcome joins and Class-B runtime capture blocked until prospective PIT-complete evidence and governance review exist. No historical Shadow repair or Formal change.

## TI-418 through TI-427 — official public-source capability pilot (2026-09-30)

- TI-418: Two official TWSE `STOCK_DAY_ALL` polls about ten seconds apart were byte-identical: 318,836 bytes, 1,380 rows, SHA-256 `5895bbf2882e0b3d095befea940700d812418ad3a763d2304f8cb964b79f0fdf`. Two official TPEx `tpex_mainboard_daily_close_quotes` polls about 31 seconds apart were also byte-identical: 4,584,216 bytes, 11,730 rows, SHA-256 `9ac267faca202ecb73c4bdc22c05eabc36c7cd45298513c904868f82bb403a5d`. This proves bounded replay stability only; immutable history and correction incidence remain UNKNOWN.
- TI-419: Same-date, same-exchange cross-contract parity was material. TWSE 2026-09-24 current OpenAPI versus historical `MI_INDEX` shared 1,380/1,380 symbols: 1,333 raw OHLC exact, 31 additional numeric-equivalent after display-comma normalization, 16 jointly missing with `""` versus `"--"`, and zero numeric conflicts. TPEx 2026-09-29 current OpenAPI versus historical `dailyQuotes` matched all 11,730 OHLC rows exactly. Same-owner agreement is corroboration, not independent attestation.
- TI-420: A source-freshness counterexample was observed. At 2026-09-30 01:17 Taipei, TWSE `STOCK_DAY_ALL` still contained only 2026-09-24 while the official TWSE historical endpoint successfully returned 2026-09-29 with 1,382 rows. Retrieval time/current-endpoint naming therefore cannot substitute for explicit row date, version and first-known checks.
- TI-421: Raw-byte identity and economic normalization must remain separate. `2475.00` versus `2,475.00` is the same number but different raw bytes; empty string versus `--` is absence in both contracts and must become `NOT_PRESENT`, never observed zero. Preserve source bytes for hashing while normalizing numeric meaning separately.
- TI-422: Public source row counts are not the Technical Indicator parent denominator. TWSE returned 1,380/1,382 and TPEx 11,660/11,730 because source universes include different instrument sets. Complete coverage can only be reconciled against the exact immutable same-scan parent generation; filtering successes first would create selection bias.
- TI-423: Whole-payload bytes, local SHA-256, ETag and Last-Modified support capture replay/change detection but do not supply a native provider row version, per-row published/first-known clock, correction/supersession ID or attestation over D03's canonical digest. Public rows therefore remain UNKNOWN at the independent-attestation gate; D03 may not self-issue `SOURCE_OWNER_VERIFIED`.
- TI-424: Zero byte changes across the short poll windows is not zero revisions. No independently identified v1->v2 correction pair was observed, so revision incidence and legitimate-correction false-block rate remain UNKNOWN.
- TI-425: Same-date OHLC parity does not certify symbol-specific sessions, suspension/no-trade state, special sessions, price-limit regime or corporate-action price-space ancestry. Those remain shared source/continuity dependencies.
- TI-426: Fugle was not captured because no task-scoped credential was exposed to this runtime. State is `ACCESS_NOT_PRESENT_IN_AUTOMATION_RUNTIME`, not BAD/zero/provider failure. Future mapping must reuse the authorized shared history path without D03-specific calls.
- TI-427: New compact evidence and 31-assertion deterministic consistency test:
  - `research/TECHNICAL_INDICATOR_OFFICIAL_SOURCE_CAPABILITY_PILOT_V0_1.md`
  - `research/technical_indicator_official_source_capability_pilot_20260930.json`
  - `research/test_technical_indicator_official_source_capability_pilot_v0_1.mjs`
- No outcomes, returns, thresholds, indicator parameters, fills or costs were inspected. No OOS, Walk-forward or incremental-alpha evidence exists. D03 maturity stays 44.6%; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.

### Current lane status after TI-427

PUBLIC_TWSE_TPEX_SOURCE_CAPTURE = BOUNDED_PASS

SAME_OBJECT_SHORT_WINDOW_REPLAY = PASS

SAME_DATE_CROSS_CONTRACT_VALUE_PARITY = MATERIAL_PASS

CURRENT_ENDPOINT_FRESHNESS = SOURCE_DEPENDENT_NOT_GUARANTEED

ROW_VERSION_PIT_ATTESTATION = UNKNOWN

SYMBOL_SESSION_CERTIFICATION = UNKNOWN

CORPORATE_ACTION_ANCESTRY = UNKNOWN

FUGLE_MAPPING = UNOBSERVED_ACCESS_NOT_PRESENT_IN_RUNTIME

IMMUTABLE_PARENT_CHILD_COMPLETENESS = UNKNOWN

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

### Exact next continuation point after TI-427

1. Continue fixed-cadence, outcome-blind captures across at least three completed trading sessions plus a defined after-hours interval. Retain repeated versions of the same trade date and classify add/remove/change before estimating revision incidence.
2. Require the shared source/continuity owner to supply independent raw-row attestation, certified symbol-session receipts and corporate-action transform ancestry. Same-source endpoint agreement cannot self-authorize `SOURCE_OWNER_VERIFIED`.
3. Map Fugle only through an authorized shared path with provider/date/market/symbol coverage, explicit UNKNOWN, provider-call delta and latency. Do not add D03-specific market-data calls.
4. Reconcile every child attempt to the exact immutable parent generation and measure non-secret storage, latency and cost before a consolidated Class-B proposal.
5. Keep TI-005 KD-vs-RSI, TI-006 MACD-vs-direct-trend, outcome joins and Formal changes blocked until prospective PIT-complete receipts pass governance.

## TI-428 through TI-435 — fixed-cadence source-version observer (2026-09-30)

- TI-428: Frozen an append-only, outcome-blind observation protocol in `research/technical_indicator_fixed_cadence_observer_v0_1.mjs`. Each observation binds endpoint, requested/observed trade date, HTTP response clock, payload length/hash, row count and available HTTP metadata. A digest chain detects mutation and reordering.
- TI-429: Seeded the ledger with the final current-endpoint polls and 2026-09-29 historical captures from the TI-427 receipt. Original clocks/hashes/counts and UNKNOWN latency were preserved rather than regenerated or backdated.
- TI-430: At 2026-09-30 02:12–02:13 Taipei, recaptured TWSE current 2026-09-24, TPEx current 2026-09-29 and both 2026-09-29 historical objects. All four hashes matched the 01:17–01:18 captures; minimum like-for-like interval was 3,281 seconds.
- TI-431: Positive evidence is limited to after-hours replay stability across a real interval. Eight chained entries validate, and deterministic tamper/reorder tests fail as required.
- TI-432: Four unchanged comparisons do not establish zero revision incidence. All captures occurred on one calendar date after one prospective completed session; source-content dates 2026-09-24/29 are not two elapsed prospective sessions. The 3-session gate is `ACCUMULATING_NOT_MET` at 1/3.
- TI-433: Node fetch encountered HTTP 502 then a proxy-tunnel 403 while `curl` succeeded. This is a transport-path issue, not data failure. The observer now has bounded retry plus `captureFromResponse`; fallback per-request latency remains `UNKNOWN_NOT_INSTRUMENTED_FOR_CURL_FALLBACK` rather than reconstructed from batch wall time.
- TI-434: The new batch used four calls and 6,911,303 transient payload bytes; no raw multi-megabyte payload was committed. Fugle, independent attestation, certified session, CA ancestry and immutable parent-child reconciliation remain UNKNOWN/unobserved.
- TI-435: New durable artifacts: `research/TECHNICAL_INDICATOR_FIXED_CADENCE_OBSERVER_V0_1.md`, `research/technical_indicator_fixed_cadence_observations_20260930.json`, observer module and 20-assertion deterministic test. No outcomes, returns, thresholds, indicator parameters, fills or alpha were inspected.
- D03 maturity stays 44.6%; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.

### Current lane status after TI-435

AFTER_HOURS_REPEAT_INTERVAL = PASS

PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_1_OF_3

APPEND_ONLY_OBSERVATION_CHAIN = PASS

OBSERVED_CHANGED_PAYLOADS = 0

REVISION_INCIDENCE = UNKNOWN

ROW_VERSION_PIT_ATTESTATION = UNKNOWN

SYMBOL_SESSION_CERTIFICATION = UNKNOWN

CORPORATE_ACTION_ANCESTRY = UNKNOWN

FUGLE_MAPPING = UNOBSERVED_ACCESS_NOT_PRESENT_IN_RUNTIME

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

### Exact next continuation point after TI-435

1. Append outcome-blind captures after each of the next two completed Taiwan trading sessions, retaining repeated versions of the same trade date. Do not estimate correction incidence before three prospective completed sessions exist.
2. If a payload hash changes, perform complete row/symbol add-remove-change reconciliation before inspecting outcomes; provider correction identity remains UNKNOWN unless independently supplied.
3. Record successful-transport per-request latency and non-secret call/byte/compact-storage deltas.
4. Require shared source/continuity attestation, certified symbol-session and corporate-action ancestry; map Fugle only through the authorized shared path and reconcile each child to the exact immutable parent generation.
5. Keep TI-005/TI-006, outcomes, Class-B runtime wiring and Formal changes blocked until the prospective PIT-complete receipt gate passes governance.

## TI-436 through TI-444 — compact row-diff baseline and third accepted capture batch (2026-09-30)

- TI-436: The run occurred before another Taiwan session completed. Multiple same-date captures do not increase independent prospective coverage; the gate remains `ACCUMULATING_1_OF_3` and revision incidence remains `UNKNOWN`.
- TI-437: Added four accepted official observations at 07:13–07:14 Taipei. The chain now contains 12 entries and seven like-for-like byte comparisons, all unchanged. Successful accepted transport latency is now measured per endpoint at 7,528–12,541 ms rather than left UNKNOWN.
- TI-438: TWSE current refreshed from observed trade date 2026-09-24 at 02:12 to 2026-09-29 at 07:13. The first-known refresh clock is bounded only to that interval and cannot be backdated; stale-at-one-poll is also not permanent provider failure.
- TI-439: One locally persisted TPEx historical body failed JSON parsing despite HTTP success and was excluded. The accepted recapture parsed and matched the prior valid payload hash. HTTP success/transfer count alone cannot be treated as provider revision evidence.
- TI-440: Falsified an executable gap in the prior observer: a whole-payload hash plus discarded raw body cannot later identify row additions/removals/changes. Added a prospective compact manifest retaining sorted normalized symbol/OHLC rows.
- TI-441: Whole-byte change and D03-relevant OHLC change are now separate. Exact decimal strings normalize without floating point; blank/dash prices become `NOT_PRESENT`; invalid decimals, duplicate symbols, mixed dates and missing tables fail closed.
- TI-442: The baseline preserves 1,382 TWSE plus 11,730 TPEx projected rows in 83,594 compressed bytes (669,561 uncompressed). Current-vs-historical normalized OHLC parity is 13,112/13,112, with zero adds/removes/changes. Same-owner parity remains corroboration, not independent attestation.
- TI-443: New 23-assertion row-manifest falsification covers formatting equivalence, missing values, invalid values, add/remove/change, tamper, duplicate rejection and durable gzip receipt verification. The evolving fixed-cadence test now reconciles durable counts instead of freezing the original four comparisons.
- TI-444: No outcomes, returns, indicator parameters, thresholds, costs or fills were opened. D03 maturity remains 44.6%; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.

### Current lane status after TI-444

AFTER_HOURS_REPEAT_INTERVAL = PASS

PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_1_OF_3

APPEND_ONLY_OBSERVATION_CHAIN = PASS_12_ENTRIES

VALID_LIKE_FOR_LIKE_COMPARISONS = 7_UNCHANGED

SUCCESSFUL_TRANSPORT_LATENCY = MEASURED_4_ACCEPTED_ENDPOINTS

COMPACT_OHLC_ROW_DIFF_BASELINE = MATERIAL_13112_ROWS

RETROSPECTIVE_UNSAVED_VERSION_ROW_DIFF = NOT_RECOVERABLE

REVISION_INCIDENCE = UNKNOWN

ROW_VERSION_PIT_ATTESTATION = UNKNOWN

SYMBOL_SESSION_CERTIFICATION = UNKNOWN

CORPORATE_ACTION_ANCESTRY = UNKNOWN

FUGLE_MAPPING = UNOBSERVED_ACCESS_NOT_PRESENT_IN_RUNTIME

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

### Exact next continuation point after TI-444

1. Append outcome-blind captures and compact OHLC manifests after each of the next two completed Taiwan trading sessions; do not estimate correction incidence before the 3-session gate.
2. On any valid payload/manifest change, calculate complete symbol add/remove/OHLC-change before outcomes. Invalid/truncated transport is transport failure, not provider revision; provider correction identity stays UNKNOWN without independent evidence.
3. Record accepted latency, provider-call count, transferred bytes and compact stored bytes for every batch.
4. Require shared attestation, certified symbol sessions, corporate-action ancestry, authorized shared-path Fugle and exact immutable parent-child reconciliation.
5. Keep TI-005/TI-006, outcomes, Class-B runtime wiring and Formal changes blocked until the prospective PIT-complete receipt gate passes governance.

## TI-445 through TI-452 — second prospective completed session and same-date replay (2026-09-30)

- TI-445: Added the completed 2026-09-30 Taiwan session without opening outcomes. TWSE historical preserved 1,382 normalized OHLC rows; TPEx historical preserved 11,772. The preregistered prospective denominator advances from 1/3 to 2/3.
- TI-446: At 20:11–20:20 Taipei, TWSE current `STOCK_DAY_ALL` still exposed 2026-09-29 while TWSE historical already exposed 2026-09-30. TPEx current and historical both exposed 2026-09-30. Current-endpoint naming is not a latest-session guarantee, and different trade dates are not compared as revisions.
- TI-447: TPEx current versus historical 2026-09-30 parity is 11,772/11,772 unchanged normalized OHLC rows, with zero additions, removals or changes. Same-owner parity remains corroboration, not independent attestation.
- TI-448: A second same-session batch 498–560 seconds later reproduced all four valid payload hashes exactly. The append-only chain now has 20 entries and 12 unchanged like-for-like comparisons. Finite unchanged observations do not make revision incidence zero; it remains `UNKNOWN`.
- TI-449: The first repeat TPEx historical HTTP/2 body ended after 359,134 bytes and failed JSON validation. It was excluded; an HTTP/1.1 recapture returned 1,774,916 valid bytes and matched the accepted hash. HTTP 200/partial transport is not provider revision evidence.
- TI-450: Each accepted batch transferred 6,949,163 bytes. Accepted latency was 8,624–19,914 ms for the first batch and 7,834–23,162 ms for the repeat. The two compact receipts are 172,863 bytes each; no raw multi-megabyte body was committed. Exact provider calls for the failed curl-retry path remain `AT_LEAST_5`, not guessed.
- TI-451: Added a reusable daily-session receipt builder and 31-assertion durable test. It validates current/historical date handling, manifest integrity, same-date parity, repeat identity, chain integrity, rejected-transport accounting and the closed 2/3 gate.
- TI-452: No return, threshold, parameter, indicator efficacy, OOS, Walk-forward, transaction-cost or fill evidence was opened. Independent attestation, certified sessions, corporate-action ancestry, authorized shared-path Fugle and immutable parent-child reconciliation remain UNKNOWN/unobserved.
- Durable analysis: `research/TECHNICAL_INDICATOR_SECOND_PROSPECTIVE_SESSION_V0_1.md`; compact receipts: `research/technical_indicator_daily_session_receipt_20260930.json.gz` and `research/technical_indicator_daily_session_repeat_receipt_20260930.json.gz`.
- D03 maturity remains 44.6%; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.

### Current lane status after TI-452

PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3

APPEND_ONLY_OBSERVATION_CHAIN = PASS_20_ENTRIES

VALID_LIKE_FOR_LIKE_COMPARISONS = 12_UNCHANGED

SECOND_SESSION_COMPACT_OHLC_STATE = MATERIAL_13154_ROWS

TWSE_CURRENT_FRESHNESS_AT_20_20 = STALE_ON_2026_09_29

TPEX_CURRENT_HISTORICAL_PARITY = PASS_11772_ROWS

INVALID_TRANSPORT_EXCLUSION = PASS

REVISION_INCIDENCE = UNKNOWN

ROW_VERSION_PIT_ATTESTATION = UNKNOWN

SYMBOL_SESSION_CERTIFICATION = UNKNOWN

CORPORATE_ACTION_ANCESTRY = UNKNOWN

FUGLE_MAPPING = UNOBSERVED_ACCESS_NOT_PRESENT_IN_RUNTIME

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

### Exact next continuation point after TI-452

1. Do not count or persist more hourly duplicates from the already-covered 2026-09-30 session merely because the automation runs again. The next denominator-changing capture is after the next completed Taiwan trading session.
2. Append the third prospective completed-session capture and at least one validated same-trade-date repeat. Keep correction incidence `UNKNOWN` until this is complete.
3. If a valid same-trade-date payload/manifest changes, calculate complete symbol add/remove/OHLC-change before outcomes. Invalid/truncated transport remains transport failure; provider correction identity stays `UNKNOWN` without independent evidence.
4. Record accepted latency, explicit transport-command count, provider-request uncertainty, bytes and compact storage.
5. Require shared attestation, certified symbol sessions, corporate-action ancestry, authorized shared-path Fugle and exact immutable parent-child reconciliation.
6. Keep TI-005/TI-006, outcomes, Class-B runtime wiring and Formal changes blocked until the prospective PIT-complete receipt gate passes governance.


## TI-453 through TI-459 — ADX / MA-offset redundancy tranche (2026-10-01)

Durable evidence:
- `research/TECHNICAL_INDICATOR_ADX_OFFSET_REDUNDANCY_V0_1.md`
- `research/test_technical_indicator_adx_offset_redundancy_v0_1.mjs`
- detailed research summary appended to `TECHNICAL_INDICATOR_RESEARCH.md`.

### Material findings

- **TI-453:** SMA deduction-price logic has exact directional redundancy: `SMA_n(t)-SMA_n(t-1)=(C_t-C_(t-n))/n`. Current SMA slope sign, current price versus the outgoing/deduction close and same-horizon retN sign must not be counted as separate evidence.
- **TI-454:** EMA has no single SMA-style deduction price. Its exact one-step identity is `EMA_t-EMA_(t-1)=alpha*(C_t-EMA_(t-1))`. Directly applying SMA deduction semantics to EMA is rejected.
- **TI-455:** ADX is trend strength without direction. Smooth up and smooth down synthetic paths both produce ADX14=100 while +DI/-DI carry opposite direction.
- **TI-456:** ADX is path-sensitive beyond endpoint return: smooth and choppy 100->120 paths with identical net return produced ADX14=100 versus ≈16.7353. This proves a plausible mechanism only, not alpha.
- **TI-457:** ADX and Impulse MACD are not independent votes by default. They are different OHLC transforms but share a trend/range-information family. ADX begins as a moderator/diagnostic and needs residual incremental-value evidence.
- **TI-458:** ADX14 cannot inherit the earlier ~65-bar KD/RSI/MACD readiness statement. A deterministic witness gave full-history ADX 16.076280, last-65 16.905634 (delta +0.829354), last-150 16.076396 (delta +0.000117). Warm-up/formulaVersion must be explicit before prospective ADX capture.
- **TI-459:** The future test is preregistered against direct trend, trend persistence, ATR/regime, Impulse MACD, structure, liquidity and price tier; no threshold sweep.

### Maturity decision

D03-09 ADX is promoted from **L1 / 20%** to **L2 / 40%** because the mechanism, explicit counterexamples, data/warm-up failure conditions, redundancy prior and falsification design are now defined and executable.

This promotion does **not** claim:
- Taiwan forward-return alpha;
- PIT/OOS/Shadow efficacy;
- an optimal ADX threshold;
- independent evidence from EMA/Impulse;
- permission to change System 1 or System 2 Formal behavior.

With 13 modules, the auditable D03 aggregate changes from 44.6% to **46.2%**.

The existing source/version lane remains unchanged at **2/3 prospective completed sessions**. The next denominator-changing observation can occur only after the next Taiwan trading session completes.

### Current lane status after TI-459

D03_MATURITY = 46.2_PERCENT

D03_09_ADX = L2_MECHANISM_AND_FALSIFICATION_DEFINED

SMA_OFFSET_DIRECTIONAL_REDUNDANCY = EXACT_ALGEBRAIC_PASS

EMA_SMA_STYLE_DEDUCTION = REJECTED_INVALID_SEMANTICS

ADX_DIRECTION_AUTHORITY = NONE

ADX_VS_RETN_PATH_MECHANISM = SYNTHETIC_PASS

ADX_VS_IMPULSE_REDUNDANCY = HIGH_PRIOR / OUTCOME_UNKNOWN

ADX_WARMUP_CONTRACT = REQUIRED

PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

### Exact next continuation point after TI-459

1. Do not manufacture the third source/version session. After the next completed Taiwan session, append the third prospective capture and a validated same-trade-date repeat, then close or retain the 3-session gate according to the preregistered receipt rules.
2. If the source/version gate passes governance, execute TI-005 KD-vs-RSI first and TI-006 MACD-vs-direct-trend second using equal-date residualized controls; no historical Shadow reconstruction.
3. Before ADX outcome testing, establish a stable long-enough history/warm-up contract on outcome-blind real rows and freeze +DI/-DI/DX/ADX/formulaVersion/continuity fields.
4. ADX efficacy follows TI-005/TI-006 and must test residual value beyond direct trend, ATR/regime and Impulse MACD; ADX is not an additive third resonance vote.
5. Formal Core, selection, ranking, capital, monitoring, signal and push behavior remain unchanged.


## TI-460 through TI-467 — ROC exact redundancy / third-session transport audit (2026-10-02)

Durable artifacts:
- `research/TECHNICAL_INDICATOR_ROC_REDUNDANCY_V0_1.md`
- `research/test_technical_indicator_roc_redundancy_v0_1.mjs`
- detailed findings appended to `TECHNICAL_INDICATOR_RESEARCH.md`.

### Material findings

- TI-460: 2026-10-02 TWSE/TPEx official session content is publicly available, but the current chat fetch path returns extracted/normalized content rather than frozen observer origin raw bytes. Source presence passes; raw-receipt equivalence does not. The preregistered session gate stays 2/3.
- TI-461: standard percentage ROC is exactly `100 * retN` at the same lookback and price space.
- TI-462: common Momentum index is exactly `ROC + 100`.
- TI-463: raw price difference is nominal-price-scale confounded; normalization collapses back to ROC/retN.
- TI-464: log return is an exact monotonic transform `ln(1+ROC/100)`, preserving same-date ordering.
- TI-465: smoothed/delta ROC are same-family candidates requiring residual tests against direct returns, acceleration, MA slope, persistence, volatility and Regime.
- TI-466: corporate-action discontinuities, suspensions/no-trade and price-limit-constrained price discovery remain mandatory continuity gates.
- TI-467: D03-11 ROC advances L1/20 -> L2/40 for mechanism/falsification maturity only; D03 aggregate advances 46.2% -> 47.7%.

### System-use firewall

Do not separately weight/vote:
- ret20 + ROC20;
- ret60 + ROC60;
- same-horizon ROC + Momentum index;
- percentile ROC + percentile same-horizon simple/log return.

These are exact or monotonic re-expressions of the same information.

### Current lane status after TI-467

D03_MATURITY = 47.7_PERCENT

D03_11_ROC = L2_MECHANISM_AND_FALSIFICATION_DEFINED

STANDARD_PERCENT_ROC_VS_RETN = EXACT_REDUNDANCY

MOMENTUM_INDEX_VS_ROC = EXACT_AFFINE_REDUNDANCY

LOG_RETURN_VS_ROC_RANK = EXACT_MONOTONIC_REDUNDANCY

RAW_PRICE_DIFFERENCE = PRICE_SCALE_CONFOUNDED

THIRD_SESSION_SOURCE_PRESENT = PASS

THIRD_SESSION_RAW_RECEIPT_EQUIVALENCE = NO

PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3

OUTCOME_JOIN = NO_GO

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

### Exact next continuation point after TI-467

1. Close the third-session raw-receipt gate only with the frozen observer or receipt-equivalent authorized transport; do not backfill extracted 2026-10-02 content.
2. Until that gate closes, continue outcome-blind mechanism/falsification on D03-13 multi-timeframe conflict and overlap among direct returns, EMA16/64 and Impulse MACD.
3. Once genuinely closed, execute TI-005 KD-vs-RSI first and TI-006 MACD-vs-direct-trend second with equal-date residualized controls.
4. Formal Core and all production selection/ranking/capital/monitoring/signal/push behavior remain unchanged.


## TI-468 through TI-473 — EMA16/64 horizon / state-lineage guard (2026-10-02)

Durable artifacts:
- `research/TECHNICAL_INDICATOR_EMA16_64_HORIZON_WARMUP_V0_1.md`
- `research/test_technical_indicator_ema16_64_horizon_warmup_v0_1.mjs`

Key findings:
- standard EMA16 mean age = 7.5 bars, half-life ≈5.538, 10%-residual age ≈18.397;
- standard EMA64 mean age = 31.5 bars, half-life ≈22.179, 10%-residual age ≈73.677;
- a 65-bar local SMA-seeded EMA64 is not universally replay-equivalent to long-history state;
- synthetic witness: EMA64 last-65 delta ≈+0.333575 versus full history, while last-150 delta ≈-0.000482 on the same path;
- EMA16/64 crossover is a difference of two filtered Close transforms, not a new raw-source family;
- EMA16/64 + Impulse MACD remains partial/shared price-family confluence until residual value is proven;
- future System 2 evidence requires canonical state-lineage and completed/provisional bar provenance;
- D03-01 remains L3/60 and D03-13 remains L2/40; D03 stays 47.7%.

Current status:
`EMA64_65_BAR_LOCAL_RESEED_EQUIVALENCE = REJECTED_AS_ASSUMPTION`
`EMA16_64_PLUS_IMPULSE = PARTIAL_REDUNDANCY_HIGH / RESIDUAL_VALUE_UNKNOWN`
`SYSTEM2_EMA_STATE_LINEAGE = REQUIRED_BEFORE_INFERENCE`
`MULTITIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT`
`D03_MATURITY = 47.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next continuation point after TI-473

1. Preserve 47.7%; no theory-only maturity inflation.
2. Raw-byte third-session gate remains 2/3; do not backfill extracted 10/2 content.
3. Before System 2 resonance outcome testing, prove EMA64 canonical replay/state-lineage equivalence and keep EMA16/64 + Impulse as within-family evidence.
4. When the raw receipt gate closes, TI-005 KD-vs-RSI remains first efficacy inference; TI-006 MACD-vs-direct-trend remains second.
5. Formal Core and production behavior remain unchanged.


## TI-474 through TI-481 — D03-03 trend persistence PIT/tick audit (2026-10-03)

Durable artifacts:
- `research/D03_TREND_PERSISTENCE_PIT_TICK_CONFOUND_V0_1.md`
- `research/test_d03_trend_persistence_tick_confound_v0_1.mjs`

Material results:
- exact `persistenceScoreResearch` implementation is recovered as 35% positive-day ratio + 25% positive ret5/10/20/60 fraction + 20% drawdown quality + 20% MA20/60 quality;
- the construct is own-path trend consistency, not Chen-Hsieh-Lee winner/loser membership duration;
- same ret5/10/20/60 endpoints can produce persistence 100 versus 84.25 because path sign frequency differs;
- score geometry is stepwise: +1.75 per positive day, 6.25 per horizon sign state, 10 per MA state, and -1 per additional drawdown percentage point until the -20% floor;
- Taiwan tick-grid synthetic falsification proves zero-return frequency can materially alter positiveDayRatio20 and persistence for the same latent percentage trend;
- zero-return/tick/liquidity controls are therefore mandatory;
- the current 61-close maximum ordinary requirement is source-feasible under existing Taiwan daily-history capability, subject to official-session/TECHNICAL_CONTINUITY/corporate-action/parent-generation provenance;
- prospective ret60 rank-persistence is data-feasible without historical backfill.

Maturity:
- D03-03 L2/40 -> **L3/60**;
- current 12-module D03 aggregate 48.3% -> **50.0%**.

This is PIT-data-feasibility maturity only. No alpha/outcome/threshold evidence.

Current status:
`D03_03 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`
`PERSISTENCE_SCORE = SHARED_PRICE_FAMILY / PATH_INFORMATION_PRESENT`
`ZERO_RETURN_TICK_LIQUIDITY_CONFOUND = MUST_CONTROL`
`RANK_PERSISTENCY = DISTINCT_PROSPECTIVE_CONSTRUCT`
`RAW_RECEIPT_GATE = 2_OF_3`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next continuation point after TI-481

1. Saturday 2026-10-03 cannot change the prospective completed-session denominator; keep raw receipt gate 2/3.
2. Freeze component-level research-only persistence snapshot semantics before outcomes.
3. D03-12 repaint-safe divergence PIT feasibility is next: prove pivotAt/confirmedAt, indicator formula/state lineage and parent as-of causality can be replayed without future-bar leakage.
4. TI-005/TI-006 efficacy remains blocked until the raw receipt gate genuinely closes.
5. Formal Core remains unchanged.


## TI-482 through TI-490 — D03-12 repaint-safe divergence PIT (2026-10-03)

Durable artifacts:
- `research/D03_REPAINT_SAFE_DIVERGENCE_PIT_V0_1.md`
- `research/test_d03_repaint_safe_divergence_pit_v0_1.mjs`
- `research/d03_repaint_safe_divergence_contract_v0_1.json`

Key results:
- pivotAt is a retrospective geometric anchor; first legal signal clock is firstObservableAt dominated by confirmedAt and required provenance;
- D22 cannot observe a second-pivot divergence that is confirmed only at D23;
- confirmation lag/opportunity cost is explicit and pre-confirmation movement cannot be credited as post-signal alpha;
- primary v0.1 pairing uses two most recent consecutive confirmed same-type, same-scale price pivots; no skipping or strongest-pair selection;
- future pivots create new episodes but cannot repaint prior first-observed divergence history;
- divergence is Pattern × Indicator interaction evidence, not a new independent vote family;
- constrained/UNKNOWN states are explicit;
- Pattern confirmed-swing lineage + D03 indicator lineage make Taiwan PIT data construction technically feasible without a new market-data family.

Maturity:
- D03-12 L2/40 -> L3/60;
- 12-module D03 50.0% -> **51.7%**.

Current:
`D03_12 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`
`DIVERGENCE_SIGNAL_CLOCK = CONFIRMED_AT_NOT_PIVOT_AT`
`CONFIRMATION_LAG_COST = REQUIRED`
`RAW_RECEIPT_GATE = 2_OF_3`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next continuation point after TI-490

1. No weekend denominator inflation; raw source gate remains 2/3.
2. Keep the machine-readable divergence contract research-only.
3. Continue D03-13 multi-timeframe PIT feasibility using causal aggregation-boundary / partial-bar clocks and existing hierarchical context semantics.
4. TI-005/TI-006 efficacy remains blocked until the source gate genuinely opens.
5. Formal Core unchanged.


## TI-491 through TI-503 — D03-13 multi-timeframe PIT feasibility (2026-10-03)

Durable artifacts:
- `research/D03_MULTITIMEFRAME_PIT_FEASIBILITY_V0_1.md`
- `research/d03_multitimeframe_pit_contract_v0_1.json`
- `research/test_d03_multitimeframe_pit_feasibility_v0_1.mjs`

Key results:
- barStartAt, barEndAt and featureKnownAt are distinct clocks;
- chart bar labels cannot be used as evidence-known timestamps;
- current M15 source path is causally usable but bounded to 17 start slots, 09:00..13:00, covering completed intervals through 13:15;
- TWSE regular session continues to 13:30, so the 13:15-start closing M15 bar is unobserved in the current zero-extra-call path;
- daily LIVE -> PROVISIONAL and FINAL+independent close gate -> CONFIRMED semantics already exist in System 2;
- weekly completion is official-calendar/symbol-session aware, not a five-bar count;
- a partial weekly state can reverse before completion;
- timeframe alignment is ALIGNED/MIXED/CONFLICT/UNKNOWN, never a default numeric vote count;
- weekly/daily/M15 data/PIT construction is technically feasible with explicit coverage/provenance limits.

Maturity:
- D03-13 L2/40 -> L3/60;
- active 12-module D03 51.7% -> **53.3%**.

Current:
`D03_13 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_WITH_BOUNDED_INTRADAY_COVERAGE`
`M15_CURRENT_RUNTIME_COVERAGE = 17_OF_18_REGULAR_SLOTS`
`RAW_RECEIPT_GATE = 2_OF_3`
`OUTCOME_INFERENCE = NO_GO`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next continuation point after TI-503

1. Weekend raw receipt denominator remains 2/3.
2. Missing 13:15 M15 capture is explicit and cannot be imputed.
3. M15 outcome work requires featureKnownAt/common support; weekly work requires equal-horizon controls.
4. Continue D03-04 momentum continuation vs persistence/direct return construct separation and PIT feasibility.
5. TI-005/TI-006 efficacy remains blocked until the raw receipt gate genuinely closes.
6. Formal Core unchanged.


## TI-504 through TI-515 — D03-04 momentum continuation PIT (2026-10-03)

Durable artifacts:
- `research/D03_MOMENTUM_CONTINUATION_CONSTRUCT_PIT_V0_1.md`
- `research/d03_momentum_continuation_contract_v0_1.json`
- `research/test_d03_momentum_continuation_construct_v0_1.mjs`

Key findings:
- D03-04 is a post-decision continuation/outcome relation, not another retN/persistence score;
- rolling retN sign retention is rejected as primary continuation evidence because of heavy pre-decision overlap;
- synthetic witness: ret20(t)=+20%, true forward D5=-4.1667%, but rolling ret20(t+5)=+9.5238%;
- primary outcomes are non-overlapping D5/D10/D20 return, MFE and MAE using exact future symbol sessions;
- rank retention and economic forward return are distinct;
- Regime construction remains D18-owned; D03 consumes the causal context;
- exact symbol-session/corporate-action outcome provenance is mandatory.

Maturity:
- D03-04 L2/40 -> L3/60;
- active 12-module D03 53.3% -> **55.0%**.

Current:
`D03_04 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`
`ROLLING_RETN_SIGN_RETENTION = REJECTED_AS_PRIMARY_OUTCOME`
`RAW_RECEIPT_GATE = 2_OF_3`
`OUTCOME_INFERENCE = NO_GO`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next after TI-515

1. Weekend source denominator stays 2/3.
2. Preserve non-overlapping future-outcome semantics.
3. Continue D03-05 pullback/short-term reversal construct separation and PIT feasibility.
4. TI-005/TI-006 remain first actual efficacy tests after source-gate completion.
5. Formal Core unchanged.


## TI-516 through TI-525 — D03-05 pullback origin gate (2026-10-03)

Durable artifacts:
- `research/D03_PULLBACK_REVERSAL_OWNERSHIP_DATA_GATE_V0_1.md`
- `research/d03_pullback_origin_contract_v0_1.json`
- `research/test_d03_pullback_origin_gate_v0_1.mjs`

Result:
- generic short-term reversal factor remains REJECTED_OR_REDUNDANT;
- pullback depth is not origin;
- liquidity-pressure attribution requires valid D05 pressure/depth/response/persistence/capture receipts;
- candle morphology cannot substitute for true pressure evidence;
- owner-lane receipts are mandatory and multiple origins remain MULTIPLE;
- confirmation cannot backdate from reclaim/15m turn-up to the pullback low.

Maturity:
- D03-05 remains **L2/40**.
- D03 aggregate remains **55.0%** after D03-13 and D03-04 promotions.

Current:
`D03_05 = L2_REMAINS / ORIGIN_ATTRIBUTION_DATA_GATED`
`LIQUIDITY_PRESSURE_ORIGIN = UNKNOWN_WITHOUT_D05_RECEIPT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
- do not invent a generic reversal score;
- wait for D05 promotion-grade pressure/replenishment evidence for the liquidity-origin branch;
- keep primary TI-005/TI-006 efficacy queue unchanged;
- Formal Core unchanged.


## TI-526 through TI-533 — ADX / Bollinger L3 blocker audit (2026-10-03)

- `research/D03_ADX_BOLLINGER_L3_BLOCKER_AUDIT_V0_1.md` freezes the current L3 readiness boundary.
- ADX formula/mechanics are frozen, but recursive-state PIT certification still requires canonical TECHNICAL_CONTINUITY + state lineage + replay-certified immutable parent data. Deeper history alone is insufficient.
- Bollinger20x2 is finite-window and needs only a certified 20 eligible-session continuity window, making it simpler than ADX, but the physical continuity/parent receipts are still not armed.
- D03-09 ADX remains L2/40.
- D03-10 Bollinger remains L2/40.
- D03 aggregate remains 55.0%.
- No outcome inference and no Formal optimization candidate.

Exact continuation:
1. shared TECHNICAL_CONTINUITY + immutable parent observer path must physically exist;
2. Bollinger L3 feasibility can be tested first on a clean 20-session window;
3. ADX additionally needs canonical replay/trusted-state certification;
4. TI-005/TI-006 empirical priority remains unchanged.


## TI-534 through TI-542 — D03-05 observable pullback/reversal PIT (2026-10-04)

Durable artifacts:
- `research/D03_PULLBACK_REVERSAL_OBSERVABLE_PIT_V0_2.md`
- `research/d03_pullback_reversal_observable_contract_v0_2.json`
- `research/test_d03_pullback_reversal_observable_pit_v0_2.mjs`

Key correction:
- owner-approved H07 says D03-05 owns the observable pullback/reversal phenomenon;
- causal origin is a separate moderator and may remain UNKNOWN;
- therefore origin incompleteness no longer blocks PIT feasibility of the price episode itself.

Frozen research semantics:
- daily A/PULLBACK parent geometry reused without Formal change;
- exact expected 15m slot prefix required;
- zone-entry seed is not confirmation;
- confirmation requires later completed higher-low + bullish turn-up;
- signal clock is confirmation-bar known-at, never the pullback low;
- failed zone break / down-volume failure are first-class states;
- corporate-action/session/price-limit uncertainty remains BLOCKED/CONSTRAINED/UNKNOWN explicitly.

Existing PV Shadow implementation and deterministic A-lifecycle fixture provide the data/replay substrate; D03 v0.2 tightens clock continuity.

Maturity:
- D03-05 L2/40 -> **L3/60**;
- active 12-module D03 55.0% -> **56.7%**.

No predictive/Fomal promotion.

Current:
`D03_05 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`
`ORIGIN_ATTRIBUTION = OPTIONAL_MODERATOR / PARTIAL`
`RAW_RECEIPT_GATE = 2_OF_3`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact continuation:
1. Keep D03-09/D03-10 L2 while TECHNICAL_CONTINUITY revision history remains uncertified.
2. Keep raw source gate 2/3 over the weekend.
3. Pre-register TI-005 KD-vs-RSI then TI-006 MACD-vs-direct-trend inference before any outcome join.
4. Do not alter Formal Core.


## TI-543 through TI-550 — TI-005/TI-006 outcome-closed preregistration (2026-10-04)

Durable preregistration:
- `research/D03_PRIMARY_QUEUE_INCREMENTAL_INFERENCE_PREREG_V0_1.md`
- `research/d03_primary_queue_incremental_inference_prereg_v0_1.json`

Key governance correction:
- D03 raw source-version 3/3 is a necessary source-clock gate, not sufficient Technical Indicator outcome readiness.
- System2 2026-10-02 diagnostic evidence is not receipt-equivalent to the D03 raw observer and does not change the 2/3 denominator.

TI-005 frozen ladder:
- K0 BASE;
- K1 B2 continuous range-position;
- K2 continuous RSI14;
- K3 BOTH;
- K4 KD-smoothing residual diagnostic.
No threshold/zone vote and no alternate period search.

TI-006 frozen ladder:
- M0 direct trend baseline;
- M1 normalized DIF;
- M2 DIF/Histogram transition-curvature residuals;
- M3 combined non-alias residuals.
Zero-line vs EMA alignment and crossover vs Histogram-sign aliases are excluded.

Outcome family:
- D5 return/MFE/MAE co-registered primary;
- D10/D20 return/MFE/MAE secondary;
- secondary cannot rescue failed primary.

Before outcome access:
- immutable parent/source/continuity/state gates;
- exact parent-child attempt accounting;
- common support;
- D16 dependence-aware method receipt;
- forward-only exact outcome join.

Inference floors:
D5 mature >=60, prospective complete >=30, independent scan dates >=15, >=2 Regimes, purged train >=10 dates, holdout >=5 dates, coverage/zero-pick/redundancy/cost/overfit gates.

Current:
`TI_005 = PREREGISTERED_NOT_EXECUTABLE`
`TI_006 = PREREGISTERED_NOT_EXECUTABLE`
`RAW_SOURCE_VERSION_GATE = 2_OF_3`
`TECHNICAL_OBSERVER_R1 = BLOCKED_SHARED_PARENT_CONTINUITY_RUNTIME`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
next completed Taiwan session -> third raw D03 receipt+repeat -> re-audit T1-T3 -> only then begin true prospective observer clock; outcomes remain closed until T5/T6 and D16 method receipt.


## TI-551 through TI-554 — D03 -> D16 method handoff (2026-10-04)

Durable handoff:
- `research/D03_PRIMARY_QUEUE_D16_METHOD_HANDOFF_V0_1.md`
- `research/d03_primary_queue_d16_method_handoff_v0_1.json`

### TI-551 — ownership boundary
D03 owns feature/alias semantics, nested K0-K4/M0-M3 comparisons, outcome family, multiple-testing family and TI-005 -> TI-006 order.
D16 owns dependence-aware estimator, finite-sample uncertainty, clustering/resampling, purging/holdout implementation and inferential method.

D16 must return METHOD_BLOCKED / POWER_INSUFFICIENT rather than change D03 formulas, periods, endpoints or experiment order after outcome inspection.

### TI-552 — dependence graph
Rows are not IID because they share scanDate shocks, repeated symbols/episodes, overlapping D5/D10/D20 outcomes, overlapping feature histories and sector shocks.
Row count is not independent N.

Required reporting includes row count, independent scanDate count, unique symbols, date cluster sizes, repeated-symbol share and outcome-window overlap.

### TI-553 — method receipt requirement
Before T5 outcomes, D16 must return a machine-readable method receipt freezing:
- identity/version hashes;
- parent/common-support population;
- BLOCKED/UNKNOWN handling;
- chronological train/purge/holdout dates;
- dependence/small-cluster treatment;
- exact estimands and weighting;
- leave-one-date/non-overlap/date-balance/concentration/repeated-symbol/coverage sensitivities;
- multiple-testing family/handling;
- terminal method state.

Allowed terminal method states include METHOD_READY, METHOD_BLOCKED, POWER_INSUFFICIENT, DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE, COMMON_SUPPORT_INSUFFICIENT, COVERAGE_BIASED and VERSION_INCOMPATIBLE.

### TI-554 — allowable research conclusions
After a valid D16 method execution, D03 accepts only frozen research labels such as NO_INCREMENTAL_VALUE, MECHANISM_PRESENT_BUT_PREDICTIVE_VALUE_INCONCLUSIVE, SPEED_NOISE_TRADEOFF, CONTEXT_PROXY_RISK, COVERAGE_BIASED, FRAGILE_DATE_DEPENDENCE, REGIME_OR_INDUSTRY_CONCENTRATED, VERSION_INCOMPATIBLE or PREDICTIVE_INCREMENTALITY_CANDIDATE.

Even PREDICTIVE_INCREMENTALITY_CANDIDATE remains research-only.

Current:
`D16_METHOD_HANDOFF = FROZEN_V0_1`
`D16_METHOD_RECEIPT = NOT_YET_RETURNED`
`OUTCOMES = CLOSED`
`RAW_SOURCE_VERSION_GATE = 2_OF_3`
`TECHNICAL_OBSERVER_R1 = BLOCKED`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

No maturity increase is assigned for preregistration/method handoff alone.


## TI-555 through TI-563 — continuity revision-source blocker reduction (2026-10-04)

Durable artifacts:
- `research/D03_CONTINUITY_REVISION_SOURCE_PROGRESS_20261004_V0_1.md`
- `research/d03_continuity_revision_source_progress_20261004_v0_1.json`

### TI-555 — transport failure separated from source truth
A physical TLS diagnostic on the modern `mops.twse.com.tw` gateway recorded an expired TWSE leaf certificate (notAfter 2026-05-31 GMT; OpenSSL verify code 10). No TLS bypass is allowed. The resulting transport failure is not negative evidence about historical MOPS content.

### TI-556 — secure direct official historical source
Direct official `mopsov.twse.com.tw/mops/web/ajax_t05st01` passed standard TLS and a 2467 read-only positive control:
- TLS valid through 2026-11-28 GMT;
- HTTP 200;
- original + correction both present;
- no D1/Production/Formal effect.

### TI-557 — physical 5/5 cross-family correction/cancellation capability
Workflow run `37167344795` physically passed all five frozen controls:
- 2467 dividend original+correction;
- 1459 capital-reduction schedule original+correction;
- 2321 capital-reduction decision original+correction;
- 1342 cash-capital-increase original+correction;
- 1342 cash-capital-increase cancellation.

Summary:
`MULTI_FAMILY_CORRECTION_AND_CANCELLATION_CAPABILITY_OBSERVED`
with correction 4/4, cancellation 1/1 and four distinct action families.

### TI-558/TI-559 — capability does not certify completeness
Still false/unproven:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified.

Next source work must prove bounded query population, no hidden pagination/truncation, immutable version clocks and cross-source reconciliation. Absence cannot be claimed from a non-certified bounded population.

### TI-560 — immutable parent has owner approval but is not yet physical
Latest main contains `research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_CLASS_B_HANDOFF_20261004.md`:
`OWNER_APPROVED_CLASS_B / IMPLEMENTATION_PENDING / FORMAL_CORE_LOCKED`.

But canonical parent/persistence status still says:
`CURRENT_PRODUCTION_IMMUTABLE_PARENT = NOT_IMPLEMENTED`,
`RUNTIME_IMPLEMENTATION = NOT_IMPLEMENTED`,
`D1_SCHEMA_IMPLEMENTATION = NOT_IMPLEMENTED`.

Approval is not a persisted/read-back generation receipt.

### TI-561/TI-562 — module decisions
Bollinger remains L2/40:
needs physical immutable parent generation + certified bounded TECHNICAL_CONTINUITY + exact 20-session window/replay/attempt accounting.

ADX remains L2/40:
needs all Bollinger-class lineage plus canonical Wilder recursive-state replay/trusted prior-state certification.

### TI-563 — anti-inflation maturity decision
D03 remains **56.7%**.

The source blocker is materially narrower, but the L3 curriculum gate has not been met for D03-09/10.

Next honest levels:
- D03-10 Bollinger L3 => **58.3%**;
- then D03-09 ADX L3 => **60.0%**.

Current:
`MOPSOV_MULTI_FAMILY_REVISION_CANCELLATION = 5_OF_5_PHYSICAL_PASS`
`BOUNDED_REVISION_COMPLETENESS = NOT_YET_PROVEN`
`IMMUTABLE_PARENT_CLASS_B = OWNER_APPROVED_IMPLEMENTATION_PENDING`
`D03_10 = L2_REMAINS`
`D03_09 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Raw D03 source-version gate remains independently 2/3 and TI-005/TI-006 outcomes remain closed.

## TI-564 through TI-574 — continuity source-contract advance (2026-10-04)

Durable artifacts:
- `research/D03_MOPS_VERSION_CLOCK_CONTRACT_V0_1.md`
- `research/d03_mops_version_clock_contract_v0_1.json`
- `research/D03_CONTINUITY_SOURCE_CONTRACT_ADVANCE_20261004_V0_2.md`
- `research/d03_continuity_source_contract_advance_20261004_v0_2.json`

### TI-564~566 — version-clock semantics
- MOPS `發言日期/發言時間` are preserved as `sourceReportedAt`, not silently promoted to historical `firstKnownAt`.
- `capturedAt` and append-only prospective `firstObservedAt` are separate clocks.
- historical `firstKnownAt` remains UNKNOWN unless an authoritative publication-time contract is certified.
- prospective `firstObservedAt` is a conservative no-lookahead research clock.
- ORIGINAL/CORRECTION/SUPPLEMENT/CANCELLATION are separate immutable versions; later final state never overwrites earlier chronology.

### TI-567 — empty-month source-local certification
System2 MOPSOV Empty Month Certification V0.2 physically certifies the frozen empty signature:
- empty controls 4/4 PASS;
- positive controls 3/3 PASS;
- transport/error/positive/empty states are distinguishable.
This is endpoint-specific and does not authorize global NO_EVENT.

### TI-568 — bounded month-shard reconciliation
Existing physical evidence includes:
- 2330 Jan-Sep company-year prefix = 151 rows;
- exact union of nine monthly shards = 151;
- multi-control correction/cancellation companies also reconcile exactly;
- zero only-full-query / only-month-shard / duplicate-month keys.

### TI-569 — high-row pagination/truncation stress
Physical run `37174063094` = PASS.

Top deterministic high-row controls:
- 2891 = 391 rows;
- 3711 = 383 rows;
- 2881 = 300 rows.

All three:
- full Jan-Sep prefix keyset equals monthly-shard union exactly;
- onlyAll=0;
- onlyMonths=0;
- duplicateMonthKey=0;
- no visible next-page/page-number/step=3 hints.

This materially falsifies a low fixed-row truncation concern, but universal no-truncation is not certified.

### TI-570 — completeness remains scoped
Stronger source-contract evidence now exists for:
- correction/cancellation representational capability;
- empty-month semantics;
- company-year/month-shard reconciliation;
- high-row reconciliation through 391 rows.

Still false/unproven globally:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- revisionCoverageComplete;
- knownAtVersionClockCertified;
- technicalContinuityCertified.

### TI-571~572 — exchange-side official document lane
The official TWSE public `Official Document Announcement / 公文公告` surface visibly contains exchange-issued capital-action rows including:
- capital-reduction exchange schedules;
- suspension/resumption dates;
- new-share listing/effective dates;
- suspension of capital-reduction registration;
- revocation of such suspension.

Therefore:
`EXCHANGE_OFFICIAL_DOCUMENT_PUBLIC_CAPABILITY = OBSERVED`.

A stable machine/date-range/pagination/raw-artifact contract is not yet frozen:
`EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT = PARTIAL_UNKNOWN`.

Absence from this lane may not be interpreted as NO_EVENT.

### TI-573~574 — module decision
D03-10 Bollinger remains L2/40 because it still needs physical immutable parent generation/readback and a symbol-window certified TECHNICAL_CONTINUITY receipt for its exact 20 eligible sessions.

D03-09 ADX remains L2/40 because it needs all Bollinger-grade provenance plus canonical Wilder recursive replay/trusted-prior-state certification.

No maturity inflation:
`D03_MATURITY = 56.7_PERCENT`
`BOLLINGER_L3_NEXT = 58.3_PERCENT`
`ADX_L3_AFTER_THAT = 60.0_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact continuation:
1. stop repeating generic MOPSOV row-count stress unless a new falsification target appears;
2. freeze a reproducible TWSE official-document machine contract or retain PARTIAL/UNKNOWN;
3. prospectively measure `firstObservedAt - sourceReportedAt` without outcomes;
4. consume immutable parent only after the owner-approved Class-B implementation is physically merged/read back;
5. re-review Bollinger before ADX;
6. raw D03 source-version session gate remains independently 2/3 until a genuine next completed Taiwan session.

## TI-575 through TI-579 — immutable parent deployment reassessment (2026-10-04)

Durable artifacts:
- `research/D03_IMMUTABLE_PARENT_DEPLOYMENT_REASSESSMENT_20261004_V0_1.md`
- `research/d03_immutable_parent_deployment_reassessment_20261004_v0_1.json`

### TI-575
The prior D03 state `IMMUTABLE_PARENT_RUNTIME=IMPLEMENTATION_PENDING` is superseded.
System 1 V8.17.0 Shadow Cohort Membership was owner-approved, PR #454 merged and Production deployed.
Deploy run `37171810825` succeeded and runtime version readback verified `8.17.0-shadow-cohort-membership`, TEST_MODE=false, KV/D1=true, Formal Core unchanged.

### TI-576
Deployment is not a prospective market generation.
Canonical implementation status remains:
`FIRST_PROSPECTIVE_SHADOW_COHORT_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`
`FIRST_PROSPECTIVE_C1_CHILD_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`.

2026-10-04 is non-trading, so no synthetic/historical reconstruction may be used to manufacture a PASS.

### TI-577
The shared engineering substrate now physically exists: immutable C1 parent generation, population receipts, overlapping candidate memberships, append-only quality overlays, atomic D1 persistence, immutable conflict guards and whole-generation readback verification.

### TI-578
D03 R1/R2 still requires one genuine post-deployment normal-scan generation with exact parent/keyset/count/readback/quality-watermark verification.

Current:
`IMMUTABLE_PARENT_RUNTIME=DEPLOYED_AND_VERSION_VERIFIED`
`GENUINE_PARENT_GENERATION=NOT_YET_OBSERVED`
`TECHNICAL_OBSERVER_PARENT_READY=PENDING_GENUINE_READBACK`.

### TI-579
No maturity inflation:
`D03_10=L2_REMAINS`
`D03_09=L2_REMAINS`
`D03_MATURITY=56.7_PERCENT`

Parent deployment removes one design/engineering blocker, but Bollinger still needs genuine parent readback + certified 20-session TECHNICAL_CONTINUITY; ADX additionally needs recursive replay authority.

Next genuine Taiwan trading session:
normal scan -> existing C1 evidence workflow -> immutable parent/cohort readback -> D03 re-audits Bollinger source/continuity gate first.

## TI-580 through TI-587 — TWSE official-document bounded machine contract (2026-10-04)

Durable artifacts:
- `research/D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1.md`
- `research/d03_twse_official_document_machine_contract_v0_1.json`
- `research/d03_twse_official_document_machine_contract_v0_1.mjs`

### TI-580~581 — list machine endpoint + positive control
Official TWSE page physically resolves a machine endpoint:
`https://wwwc.twse.com.tw/rwd/zh/announcement/announcement`
with `startDate/endDate/keyword/response` and server-side paging arguments.

Frozen 2026-07-01~2026-08-10 keyword `減資` query returns stat=ok, total=3 and fields:
項次 / 發文日期 / 發文字號 / 主旨 / id.

1459 聯發 2026-07-02 capital-reduction exchange schedule is physically present.

### TI-582 — pagination reconciliation
On the same interval with keyword blank:
- total=56;
- paging=15;
- page counts 15+15+15+11;
- fetched=56;
- unique ids=56;
- duplicate ids=0;
- unpaged result also returns the same 56-id keyset.

`SERVER_SIDE_PAGINATION_RECONCILIATION=PASS`
`UNPAGED_EQUIVALENCE=PASS`.

### TI-583 — exchange-side reversal chronology
For 川飛能源:
- 2026-07-31 `臺證上一字第1151803156號` = 停止申報生效;
- 2026-08-06 `臺證上一字第1151803255號` = 解除停止申報生效.

Each has an independent row id.
`STOP_THEN_RELEASE_PAIR_OBSERVED=PASS`.

### TI-584 — detail API
Frozen detail endpoint:
`https://wwwc.twse.com.tw/rwd/zh/announcement/announcement_detail?id=<token>&response=json`

Fields:
發文機關 / 發文日期 / 發文字號 / 主旨 / 依據 / 公告事項.

Both STOP and RELEASE details reproduce their list reference/subject.
Wrong parameter aliases ID/uuid/keyword return no data.

### TI-585 — source-local empty control
A frozen impossible keyword returns total=0 and dataCount=0.
`SOURCE_LOCAL_EMPTY_SEMANTICS_OBSERVED`.

### TI-586 — frozen acceptance
Workflow run `37175322616` physically passes the frozen executable contract:
`D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1`
`BOUNDED_MACHINE_CONTRACT_PHYSICAL_PASS`.

### TI-587 — maturity / authority boundary
The old state:
`EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT=PARTIAL_UNKNOWN`

is superseded on TWSE by:
`TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT=BOUNDED_PHYSICAL_PASS`.

Still false/unproven:
- globalArchiveCompletenessCertified;
- crossExchangeCoverageComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- technicalContinuityCertified.

Therefore:
`D03_10=L2_REMAINS`
`D03_09=L2_REMAINS`
`D03_MATURITY=56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE=NONE`.

Exact next:
1. characterize TPEx equivalent exchange-side machine source;
2. keep TWSE/TPEx source families separate;
3. next genuine trading session -> V8.17 C1 parent/cohort readback;
4. then symbol-window TECHNICAL_CONTINUITY for Bollinger;
5. ADX only after recursive replay certification.


## TI-588 through TI-593 — TPEx halt/resumption machine-contract discovery (2026-10-04)

Durable artifacts:
- `research/D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_1.md`
- `research/d03_tpex_halt_resumption_machine_contract_v0_1.json`

### TI-588 — official exchange surface and query dimensions physically observed
The official TPEx page `https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html` physically exposes the historical halt/resumption surface.

Observed query controls:
- year input `date`, with public UI coverage 2020 through 2026 plus ALL;
- security category `cate`;
- category values 1 mainboard stock, 2 emerging stock, 6 strategic board, 3 warrant, 4 convertible/exchangeable bond, 5 TDR;
- HTML export and CSV download controls.

This is exchange-owned evidence for symbol-session trading halts/resumptions. It is not a complete corporate-action archive.

### TI-589 — front-end action is physically visible, resolved transport is not
The page's own executable initialization physically declares:
- `action="bulletin/sprcHis"`;
- `autoLoad=true`;
- `autoChange=false`;
- sortable table;
- page size 10.

However the runtime `API_PATTERN` value was not exposed by the observable page scope. Therefore only the action/argument surface is verified; the exact stable public endpoint is not yet frozen.

### TI-590 — candidate transport falsification
A read-only candidate request using the common TPEx `/www/zh-tw/` route shape and the physically observed action/arguments returned `HTTP 520` in this research environment. The public page also rendered no result rows during the same bounded observation.

This does not prove that the official dataset is absent. It disproves promotion from front-end discovery alone to a physical machine-payload PASS.

State:
`TPEX_OFFICIAL_HALT_SURFACE=OBSERVED`
`TPEX_FRONTEND_ACTION_AND_PARAMETERS=PHYSICALLY_OBSERVED`
`TPEX_MACHINE_RESPONSE_CONTRACT=PARTIAL_UNKNOWN`.

### TI-591 — missing acceptance controls remain UNKNOWN
Not yet physically certified:
- one bounded positive response with headers/schema/row count;
- stable row key and duplicate semantics;
- pagination or unpaged equivalence;
- CSV/API equivalence;
- source-local empty semantics;
- correction/cancellation/version chronology;
- detail-row contract;
- first-known publication latency;
- all-action-family coverage.

No zero rows, NO_EVENT state, or historical continuity may be inferred from the failed response.

### TI-592 — D03 implication and falsification boundary
This evidence narrows the next TPEx task from broad discovery to transport resolution and physical response capture. It can eventually support symbol-session TECHNICAL_CONTINUITY for halt/resumption, but cannot by itself certify capital-reduction price continuity, share replacement, par-value change, ex-right/ex-dividend, delisting or cross-exchange completeness.

TWSE and TPEx remain separate source families:
`TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT=BOUNDED_PHYSICAL_PASS`
`TPEX_HALT_RESUMPTION_MACHINE_CONTRACT=PARTIAL_UNKNOWN`.

### TI-593 — maturity and exact continuation
No maturity inflation:
`D03_10=L2_REMAINS`
`D03_09=L2_REMAINS`
`D03_MATURITY=56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE=NONE`.

Exact continuation:
1. resolve `API_PATTERN` from a successful official TPEx session or archive an official CSV artifact; do not guess endpoint stability from the route shape;
2. freeze one bounded year/category positive control with raw bytes, response headers, schema, row count, stable key and checksum;
3. reconcile HTML/CSV/API keysets and page-size-10 pagination behavior;
4. add a source-local empty control without converting transport failure into empty data;
5. preserve halt/resumption separately from capital-action cause/effective-date evidence;
6. on the next genuine Taiwan trading session, prioritize the already deployed V8.17 C1 immutable parent/cohort readback; never synthesize or backfill a generation;
7. after parent readback, re-audit Bollinger against exact 20-session symbol-window TECHNICAL_CONTINUITY; ADX still additionally requires canonical Wilder recursive replay.


## 00 control-plane receipt — H07 Room03 side accepted

00｜研究總控室 accepted `research/D03_PULLBACK_REVERSAL_OBSERVABLE_PIT_V0_2.md` as the Room03 side of H07.

Closed on this side:
- D03-05 owns observable pullback / short-term reversal phenomenon;
- causal confirmation clock and failed reversal are explicit;
- origin/behavior remains optional/UNKNOWN;
- D03 does not own behavioral overreaction.

H07 remains partial until Room13 supplies D20-09 behavioral-identifiability evidence.
Do not repeat the Room03 ownership work.


## TI-594 through TI-605 — TPEx machine transport and price-reset source closure (2026-10-04)

Durable artifacts:
- `research/D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_2.md`
- `research/d03_tpex_halt_resumption_machine_contract_v0_2.json`
- `research/D03_TPEX_PRICE_RESET_MACHINE_CONTRACT_V0_1.md`
- `research/d03_tpex_price_reset_machine_contract_v0_1.json`

### TI-594 — exact TPEx machine route recovered from official executable source
Official `main.js` physically freezes `API_PATTERN=/www/{LANG}/{ACTION}`. The halt page freezes `action=bulletin/sprcHis`, so the machine route is `/www/zh-tw/bulletin/sprcHis`.

The table loader uses POST + `response=json`. The page does not enable server paging; its visible page size 10 is client presentation.

### TI-595/TI-596 — halt/resumption bounded physical population and export equivalence
Workflow run `37182021741`, frozen 2026 / 上櫃股票:
- HTTP 200 / `stat=ok`;
- JSON 30 rows / `totalCount=30`;
- JSON SHA-256 `184c07e8cfd61f20a8cbf65ab49d2ab86ddac276da450eeed3938ec08c2ffe18`;
- CSV 30 data rows;
- CSV SHA-256 `e0c325a2968ef26ffbb75af495f17949c02ffaa0109ad89c3fd26684d701e76b`;
- unique keysets exactly equal, no duplicates.

The visible 10-row page size is not backend truncation for this bounded control.

### TI-597 — halt source-local zero semantics
Three frozen controls physically returned HTTP 200, `stat=ok`, row/total 0:
- 2026 category 5;
- 2026 category 6;
- 2020 category 5.

Transport/parser failure remains distinct from source-local empty.

### TI-598 — TPEx symbol-session source advances
For the bounded contract:
`TPEX_HALT_MACHINE = BOUNDED_PHYSICAL_PASS`.
It can support verified TPEx halt/resumption chronology and reject pseudo-bar substitution.
It does not alone certify corporate-action price continuity.

### TI-599 — TPEx price-reset machine routes discovered
Official pages freeze:
- ex-right/ex-dividend actual results: `bulletin/exDailyQ`;
- ex-right/ex-dividend announcement: `bulletin/prePost`;
- capital-reduction resumption/reference: `bulletin/revivt`.

Promotion-grade actual-result probes use `exDailyQ` and `revivt`.

### TI-600 — ex-right/ex-dividend actual-result source physically passes
Workflow run `37182282950`, 2026-07-01 through 2026-10-04:
- `exDailyQ` HTTP 200 / `stat=ok`;
- 587 rows / `totalCount=587`;
- JSON SHA-256 `7fe0627f0da66c146b6cd076b72aed8a841bd37e804461602d33f9c8c2768538`;
- CSV 587 data rows;
- JSON/CSV keyset exact equivalence.

Fields include prior close, ex-right/ex-dividend reference price, rights/dividend values, limit prices, trading-base price and allocation fields.

### TI-601 — capital-reduction actual-result source physically passes
Same run, 2026-01-01 through 2026-10-04:
- `revivt` HTTP 200 / `stat=ok`;
- 11 rows / `totalCount=11`;
- JSON SHA-256 `0b0f9aaa0d0e4c3e396078f0d4ce04964bb90d3e2059326734148d0b4ddaff4d`;
- CSV 11 data rows;
- JSON first 10 non-detail columns exactly match CSV keyset.

JSON detail physically includes suspension/resumption dates, replacement shares per 1,000 old shares, cash returned per share and applicable capital-increase fields.

### TI-602 — price-reset source-local empty semantics
On the bounded 2026-10-04 single-day control:
- `exDailyQ`: HTTP 200, `stat=ok`, 0;
- `revivt`: HTTP 200, `stat=ok`, 0.

No transport failure is normalized to NO_EVENT.

### TI-603 — prospective knowledge clock can use observed capture
The shared continuity archive already supports `PROSPECTIVE_OBSERVED`:
source `fetchedAt` becomes a conservative knowledge-time upper bound and is PIT-replay eligible only if captured no later than the parent cutoff.

Therefore unknown historical publication latency does not prevent future prospective evidence, but a post-parent capture may not backfill that parent.

### TI-604 — remaining blocker is no longer endpoint discovery
For TPEx, bounded official machine capability now exists for:
- halt/resumption;
- ex-right/ex-dividend actual price resets;
- capital-reduction resumption/reference price;
- MOPSOV correction/cancellation chronology from TI-555~563.

D03-10 still requires the first genuine post-V8.17 immutable parent/capture generation plus an exact parent-cutoff-safe continuity receipt and complete parent attempts.
D03-09 adds recursive replay/state lineage.

### TI-605 — anti-inflation maturity decision
The explicit TI-531 requirement remains first promotion-grade outcome-blind prospective parent evidence.

Sunday 2026-10-04 cannot create the first genuine post-deployment trading parent.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 remains **56.7%**.

No source-discovery percentage is awarded.

Next honest transitions:
- Bollinger L3 => D03 58.3%;
- then ADX L3 => D03 60.0%.

Current:
`TPEX_HALT_MACHINE = BOUNDED_PHYSICAL_PASS`
`TPEX_EX_DAILY_Q = BOUNDED_PHYSICAL_PASS`
`TPEX_REDUCTION_REFERENCE = BOUNDED_PHYSICAL_PASS`
`TPEX_JSON_CSV_EQUIVALENCE = PASS`
`TPEX_SOURCE_LOCAL_EMPTY = PASS`
`FIRST_GENUINE_V8_17_PARENT_READBACK = PENDING`
`RAW_D03_SOURCE_VERSION_GATE = 2_OF_3`
`OUTCOMES = CLOSED`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

Exact next continuation:
1. first genuine Taiwan trading session after V8.17 deployment: read back immutable parent/captureGeneration and expected keyset;
2. bind pre-parent or parent-cutoff-safe prospective official source captures to exact parent symbols/windows;
3. attempt every expected parent and preserve VALID/BLOCKED/UNKNOWN;
4. re-review Bollinger first for an exact 20 eligible-session certified continuity window;
5. ADX only after canonical Wilder recursive replay/trusted-state certification;
6. raw 3-session source gate remains separate and TI-005/TI-006 outcomes remain closed.


## TI-606 through TI-610 — Bollinger first-genuine-parent acceptance logic (2026-10-04)

Durable artifacts:
- `research/D03_BOLLINGER_FIRST_PARENT_ACCEPTANCE_V0_1.md`
- `research/d03_bollinger_l3_acceptance_v0_1.mjs`
- `tests/test_d03_bollinger_l3_acceptance_v0_1.mjs`
- read-only workflow `.github/workflows/research-d03-bollinger-acceptance-readonly.yml`.

Physical workflow run:
- `37182674404` = SUCCESS.

### TI-606 — exact shared parent identity, no D03-specific parent

The acceptance evaluator consumes the deployed shared Shadow parent identity:
- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt.

D03 does not create a second parent universe.

### TI-607 — finite-window input gate is executable and fail-closed

A Bollinger L3 attempt requires:
- continuity status VALID or VALID_BUT_CONSTRAINED;
- semantic space TECHNICAL_CONTINUITY;
- formulaVersion `BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1`;
- stdDefinition POPULATION;
- continuityReceiptId;
- receipt/capture time <= parent knownAt;
- exactly 20 expected eligible symbol sessions;
- exactly 20 bars with identical date set;
- no duplicate date;
- finite positive Close;
- each bar symbolSessionVerified=true;
- technicalContinuity=true;
- corporateActionContinuityResolved=true;
- bar sourceFetchedAt <= parent knownAt;
- zero unresolved missing sessions/events.

Any missing, late or mismatched evidence fails closed.

### TI-608 — constrained sessions remain visible

A continuity-valid exact window containing price-limit-constrained sessions may be:
`VALID_BUT_CONSTRAINED`.

It remains L3 data-feasibility eligible while ordinary unconstrained interpretation remains false.

Constraint evidence is preserved rather than dropped or silently treated as ordinary.

### TI-609 — complete parent attempt accounting

A run is COMPLETE only when every expected parent has exactly one persisted attempt.

Physical deterministic fixture proves:
- two expected / one attempt => INCOMPLETE;
- two expected / two attempts including one UNKNOWN => COMPLETE;
- missing, orphan or duplicate attempts invalidate completeness.

UNKNOWN/BLOCKED are explicit evidence states, not missing rows.

### TI-610 — acceptance logic passes, maturity stays parent-gated

Read-only run `37182674404` physically passes:
- clean exact 20-session window -> VALID;
- SMA20=109.5 in the frozen fixture;
- population SD20≈5.7662812973;
- capture after parent -> DATA_BLOCKED;
- missing bar -> DATA_BLOCKED;
- duplicate date -> DATA_BLOCKED;
- constrained bar -> VALID_BUT_CONSTRAINED;
- incomplete parent attempt set -> INCOMPLETE;
- full explicit attempt set including UNKNOWN -> COMPLETE.

This closes the acceptance-logic design gap.

It does NOT provide the first genuine post-V8.17 Taiwan parent generation.

Therefore:
- D03-10 Bollinger stays L2/40;
- D03 overall stays **56.7%**.

The first genuine parent remains the promotion trigger.

Current:
`BOLLINGER_L3_ACCEPTANCE_LOGIC = PHYSICAL_TEST_PASS`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`D03_10 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`OUTCOMES = CLOSED`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next continuation:
1. On the first genuine Taiwan session after V8.17, read back immutable parent/captureGeneration and the exact expected keyset.
2. Attach a parent-cutoff-safe TECHNICAL_CONTINUITY receipt to every expected parent.
3. Execute this acceptance evaluator for all expected parents and persist VALID/BLOCKED/UNKNOWN.
4. Only a COMPLETE run may support Bollinger L3 review.
5. If D03-10 reaches L3, D03 becomes 58.3%; ADX remains separate until canonical recursive replay passes.


## 00 control-plane receipt — H07 terminal closure

00｜研究總控室 closed H07:
KEEP_SEPARATE / EVENT_CONDITIONED_OVERREACTION_PARENT_VS_REVERSAL_OUTCOME.

D03-05 remains canonical owner of observable pullback/reversal geometry and PIT-safe reversal path.
D20-09 may study an event-conditioned candidate behavioral parent, but the later reversal itself remains D03-owned evidence and cannot be counted twice.

D03-05 remains L3/60%.
No Formal/runtime change.

Audit:
shared-knowledge/CURRICULUM_H07_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md


## TI-611 through TI-630 — ADX / Bollinger first-parent acceptance hardening (2026-10-04)

Durable artifacts:
- `research/d03_adx_l3_acceptance_v0_1.mjs`
- `tests/test_d03_adx_l3_acceptance_v0_1.mjs`
- `research/D03_ADX_FIRST_PARENT_ACCEPTANCE_V0_1.md`
- `research/d03_adx_l3_acceptance_v0_2.mjs`
- `tests/test_d03_adx_l3_acceptance_v0_2.mjs`
- `research/D03_ADX_FIRST_PARENT_ACCEPTANCE_V0_2.md`
- `research/d03_bollinger_l3_acceptance_v0_2.mjs`
- `tests/test_d03_bollinger_l3_acceptance_v0_2.mjs`
- `research/D03_BOLLINGER_FIRST_PARENT_ACCEPTANCE_V0_2.md`

### TI-611~618 — ADX full-replay acceptance logic
The first ADX acceptance layer consumes the deployed shared parent identity and the already-frozen core formula. It requires FULL_REPLAY, exact continuity/session provenance, prefix invariance and complete expected-parent attempt accounting.

Read-only workflow run `37184682026` physically passed:
- clean full replay -> VALID;
- constrained path -> VALID_BUT_CONSTRAINED;
- too-short/local-bootstrap/trusted-prior-without-certifier/late capture/missing session/unresolved event/state-hash mismatch -> blocked;
- explicit UNKNOWN plus VALID can still form a COMPLETE expected-parent run.

### TI-619 — self-falsification of ADX v0.1
V0.1 was then rejected for promotion-grade use because a caller could self-declare FULL_REPLAY and supply merely nonempty lineage/hash strings.

This violates the prior D03 rule that self-issued assertions/hashes do not authenticate source lineage.

### TI-620~624 — ADX v0.2 canonical lineage hardening
V0.2 additionally requires:
- sourceFamilyVersion;
- 64-hex sourceHistoryHash;
- rawHistoryAdmissionReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- 64-hex continuityTransformHash;
- receiptVersion;
- 64-hex stateLineageId;
- cleanHistoryStartDate;
- initializationAnchorDate;
- anchorCertificationState = CANONICAL_LINEAGE_ANCHOR_CERTIFIED;
- cleanHistoryStartDate == initializationAnchorDate for FULL_REPLAY;
- first replay bar == certified anchor;
- eligibleBarsFromAnchorToAsOf == delivered bars;
- per-bar observedRawBarIdentity + 64-hex sourceBarHash.

`TRUSTED_PRIOR_STATE` is intentionally not accepted by v0.2 until a separate certifier exists.

Read-only workflow run `37184852267` physically passed. It specifically proved:
- fake full-replay lineage -> DATA_BLOCKED;
- uncertified anchor -> DATA_BLOCKED;
- shifted/arbitrary anchor -> DATA_BLOCKED;
- trusted-prior path without certifier -> DATA_BLOCKED;
- valid canonical full replay remains VALID;
- complete expected-parent accounting still accepts explicit UNKNOWN attempts.

### TI-625 — Bollinger v0.1 source-lineage gap
The earlier Bollinger acceptance logic had the same class of weakness: it could consume a self-asserted `technicalContinuity=true` object without the complete upstream continuity identity.

V0.1 therefore remains useful formula/flow QA but is superseded for promotion-grade source/PIT acceptance.

### TI-626~630 — Bollinger v0.2 lineage hardening
V0.2 requires:
- sourceFamilyVersion;
- 64-hex sourceHistoryHash;
- rawHistoryAdmissionReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- 64-hex continuityTransformHash;
- receiptVersion;
- cleanHistoryStartDate;
- exact 20 expected eligible symbol sessions;
- expectedEligibleSymbolSessionCount = 20;
- observedRawBars = 20;
- continuityBars = 20;
- zero unresolved missing sessions/events;
- zero delivered pseudo bars;
- each bar binds observedRawBarIdentity + 64-hex sourceBarHash.

The evaluator now calls the frozen core `computeBollingerBands` rather than reimplementing the formula.

Read-only workflow run `37184976280` physically passed:
- valid 20-session lineage -> VALID;
- constrained path -> VALID_BUT_CONSTRAINED;
- fake source-history hash -> DATA_BLOCKED;
- missing raw-history receipt -> DATA_BLOCKED;
- late continuity capture -> DATA_BLOCKED;
- 19-session window -> DATA_BLOCKED;
- unresolved relevant event -> DATA_BLOCKED;
- sample-SD semantics -> DATA_BLOCKED;
- explicit UNKNOWN still participates in COMPLETE parent reconciliation.

### Maturity decision
These tranches close acceptance-design/source-lineage loopholes but do not create the first genuine post-V8.17 Taiwan parent generation.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains **56.7%**.

This is deliberate anti-inflation.

### Current status
`ADX_L3_ACCEPTANCE_V0_2 = PHYSICAL_TEST_PASS`
`ADX_FULL_REPLAY_SELF_ATTESTATION = REJECTED`
`TRUSTED_PRIOR_STATE_CERTIFIER = NOT_IMPLEMENTED`
`BOLLINGER_L3_ACCEPTANCE_V0_2 = PHYSICAL_TEST_PASS`
`BOLLINGER_SELF_ATTESTED_CONTINUITY = REJECTED`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`RAW_SOURCE_VERSION_GATE = 2_OF_3`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next continuation
1. Keep both v0.2 evaluators as the promotion-grade research acceptance contracts; do not use v0.1 to promote.
2. On the first genuine Taiwan session after V8.17, read exact shared parent generation/keyset and parent knownAt.
3. Bind only owner-issued, cutoff-safe continuity receipts carrying the complete upstream identity fields required by v0.2.
4. Execute Bollinger v0.2 for every expected parent first; only COMPLETE reconciliation may support D03-10 L3 -> D03 58.3%.
5. Execute ADX v0.2 only with canonical-anchor FULL_REPLAY for every expected parent; only COMPLETE reconciliation may support D03-09 L3 -> D03 60.0%.
6. Do not accept TRUSTED_PRIOR_STATE until a separate replay-equivalence certifier exists.
7. Raw 3-session gate remains independently 2/3; TI-005/TI-006 outcomes remain closed.


## TI-631 through TI-635 — immutable parent × continuity binding (2026-10-04)

Durable artifacts:
- `research/d03_parent_continuity_binding_v0_1.mjs`
- `tests/test_d03_parent_continuity_binding_v0_1.mjs`
- `research/D03_PARENT_CONTINUITY_BINDING_V0_1.md`

### TI-631 — source receipt and parent remain separate immutable facts
The continuity receipt remains a shared source fact and may be reused where semantically valid. The Shadow parent remains a decision-state fact. D03 does not duplicate the whole continuity payload into each parent.

Instead, promotion-grade evidence creates one immutable binding receipt between the exact parent identity and exact continuity receipt identity.

### TI-632 — binding identity prevents cross-generation substitution
Binding identity includes:
- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt;
- continuityReceiptId/version;
- continuity asOf/capturedAt;
- sourceHistoryHash;
- continuityTransformHash;
- expected eligible date-set hash;
- actual continuity-bar date-set hash;
- sourceBarsThrough.

The complete payload hashes to bindingId. A different captureGeneration or parentSnapshotHash therefore produces a different binding identity even for the same symbol and continuity payload.

### TI-633 — temporal/population invariants
Binding is VALID only when:
- continuity symbol == parent symbol;
- continuity asOf == parent scanDate;
- continuity capturedAt <= parent knownAt;
- expected eligible session dates == delivered continuity-bar dates;
- sourceBarsThrough == final delivered bar date;
- final delivered bar date <= parent scanDate.

Wrong date, late receipt, date-set mismatch and future-bar contamination fail closed.

### TI-634 — bound promotion-grade wrappers
Promotion-grade research calls now use:
- `evaluateBoundBollingerL3V0_1`;
- `evaluateBoundAdxL3V0_1`.

The binding is validated before the hardened v0.2 indicator evaluator executes.

A numerically/source-valid indicator calculation attached to the wrong immutable parent is not L3 evidence.

### TI-635 — physical deterministic acceptance
Read-only workflow run `37185221432` PASS:
- cross-generation binding identity changes;
- wrong asOf -> DATA_BLOCKED;
- late continuity capture -> DATA_BLOCKED;
- expected/delivered date-set mismatch -> DATA_BLOCKED;
- future bar -> DATA_BLOCKED;
- correctly bound Bollinger v0.2 -> VALID;
- correctly bound ADX v0.2 -> VALID.

This closes the parent-receipt join-identity design gap only.

No genuine post-V8.17 Taiwan parent was created on Sunday, so D03 remains 56.7%.

Current:
`PARENT_CONTINUITY_BINDING_V0_1 = PHYSICAL_TEST_PASS`
`CROSS_GENERATION_RECEIPT_SUBSTITUTION = BLOCKED_BY_IDENTITY`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`D03_10 = L2_REMAINS`
`D03_09 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
1. Audit the real clock envelope for the first genuine parent: continuity source capture must be known/captured no later than parent knownAt.
2. Do not assume parent availability alone makes a continuity receipt cutoff-safe.
3. Freeze any missing pre-parent capture/scheduling requirement outcome-blind.
4. On the first genuine parent, persist bindingId with every Bollinger/ADX attempt and require complete expected-parent reconciliation.


## TI-636 through TI-643 — pre-parent continuity clock audit (2026-10-04)

Durable artifacts:
- `research/d03_pre_parent_continuity_clock_v0_1.mjs`
- `tests/test_d03_pre_parent_continuity_clock_v0_1.mjs`
- `research/D03_PRE_PARENT_CONTINUITY_CLOCK_AUDIT_V0_1.md`

### TI-636 — parent existence is not cutoff-safe continuity readiness
The deployed V8.17 immutable parent is generated by the normal 18:10 Taipei after-market scan. C1 decisionAt is actual runtime time, not an invented fixed timestamp.

A Technical child needs source/continuity evidence that was legitimately known no later than that parent decisionAt.

Therefore:
`FIRST_GENUINE_PARENT_EXISTS != CUTOFF_SAFE_CONTINUITY_RECEIPT_EXISTS`.

### TI-637 — current 16:30 scheduled history warmup is raw-only
The existing scheduled recent A1 hot-history warmup runs at 16:30 Taipei but explicitly freezes:
- historyCoverageOnly=true;
- continuityStateForNewRows=UNVERIFIED;
- continuityPromotionPerformed=false.

It cannot satisfy Technical continuity.

### TI-638 — current 18:35 diagnostic is after the parent
The existing System2 daily diagnostic at 18:35 Taipei is after the normal 18:10 System1 parent.

Newly captured source/revision evidence at 18:35 cannot be relabeled as known at 18:10.

### TI-639 — existing continuity capability workflows are not automatic pre-parent observers
Repository scan found the active continuity/MOPS/source-capability workflows are manual dispatch and/or path-push triggered. No recurring promotion-grade pre-18:10 continuity capture is currently observed.

### TI-640 — pre-parent clock acceptance
A future promotion-grade capture requires:
- same marketDate as parent scanDate;
- capturedAt <= parent knownAt;
- continuityState=CERTIFIED;
- exactVersionObserved=true;
- firstObservedAtCertified=true;
- noRevisionGapThroughParent=true;
- symbolSessionCoverageComplete=true.

### TI-641/TI-642 — shared-owner handoff
Current state:
`PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE_NOT_PRESENT`.

D03 must not fork a local corporate-action observer or silently add Formal provider calls.

The shared continuity owner must supply an immutable prospective source/version mechanism whose causal availability is established no later than the parent cutoff, or another owner-certified mechanism proving exact availability at that cutoff.

### TI-643 — physical falsification and maturity
Read-only workflow run `37185635335` PASS:
- valid source 60 seconds before parent -> VALID;
- raw-but-uncertified 16:30 history -> DATA_BLOCKED;
- 18:35 capture -> DATA_BLOCKED / SOURCE_CAPTURE_AFTER_PARENT;
- historical source clock without certified first-observed clock -> DATA_BLOCKED.

Current runtime envelope itself is therefore a real blocker.

D03 remains **56.7%**.

`BOLLINGER_FIRST_PARENT_PROMOTION_READY = FALSE`  
`ADX_FIRST_PARENT_PROMOTION_READY = FALSE`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
1. Investigate whether official sourceReportedAt semantics can be certified as a public disclosure clock without fabricating exact availability.
2. If not, shared owner needs prospective pre-parent version observation.
3. First genuine parent alone does not promote D03-09/10.


## TI-644 through TI-650 — official MOPS clock semantic corroboration (2026-10-04)

Durable artifacts:
- `research/d03_mops_source_clock_semantics_v0_1.mjs`
- `tests/test_d03_mops_source_clock_semantics_v0_1.mjs`
- `research/D03_MOPS_SOURCE_CLOCK_SEMANTIC_AUDIT_V0_1.md`

This tranche independently corroborates the already-frozen D03 MOPS version-clock contract and the System2 source-clock work; it does not replace or weaken them.

### TI-644 — official disclosure semantics are strong
Official TWSE material establishes that MOPS is the public disclosure platform designed for information symmetry/timeliness, its front page exposes real-time material information with spokesperson date/time columns, and listed companies must input material information into the designated internet reporting system under defined deadlines.

This strongly supports `sourceReportedAt` as an issuer disclosure/reporting-clock field rather than an arbitrary scraper timestamp.

### TI-645 — exact public availability still not proven by the field alone
Official material does not provide a frozen zero-latency or bounded-latency guarantee from issuer input/spokesperson time to public retrievability.

Therefore:
`SOURCE_REPORTED_AT != CERTIFIED_EXACT_PUBLIC_AVAILABLE_AT`.

This remains aligned with the existing System2 physical clock certification:
source-reported clock semantics are certified, but public-availability latency and exact knownAt remain uncertified.

### TI-646 — asymmetric safe use
If sourceReportedAt > parentKnownAt:
the version is safely excluded from that parent.

If sourceReportedAt <= parentKnownAt:
historical sourceReportedAt alone still cannot prove PIT availability.

Thus historical use is an asymmetric exclusion rule, not a positive availability rule.

### TI-647 — prospective exact-version observation remains the safe positive path
A certified prospective exact-version observation with firstObservedAt <= parentKnownAt can safely establish that exact version was publicly observable by the parent cutoff.

This does not require pretending sourceReportedAt == firstObservedAt.

### TI-648 — active-push service is contextual, not historical latency proof
TWSE provides a MOPS proactive data-delivery service for users needing timely information delivery. This supports MOPS as an actively distributed disclosure product but does not backfill exact free-web historical availability.

### TI-649 — physical semantic classifier test
Read-only workflow run `37185849126` PASS:
- sourceReportedAt after parent -> EXCLUDED;
- sourceReportedAt before parent without prospective observation -> HISTORICAL_REPORTED_CLOCK_ONLY;
- certified prospective firstObservedAt before parent -> VALID_OBSERVED_BY_PARENT;
- firstObservedAt after parent -> OBSERVED_AFTER_PARENT.

### TI-650 — maturity
No maturity promotion.

Existing owner work already has:
- certified source-reported clock semantics;
- implemented prospective availability observation adapter;
- prospectiveObservationCount=0;
- no automatic high-frequency schedule.

D03 consumes that owner result rather than creating a duplicate observer.

Current:
`MOPS_SOURCE_REPORTED_CLOCK_SEMANTICS = CERTIFIED_BY_OWNER / OFFICIAL_CORROBORATION`
`HISTORICAL_REPORTED_CLOCK_AS_EXACT_AVAILABLE_AT = REJECTED`
`PROSPECTIVE_FIRST_OBSERVED_PATH = IMPLEMENTED_BUT_ZERO_SAMPLES`
`PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE = ABSENT`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
the shared source owner must freeze/execute genuine prospective sampling and produce exact-version observations that are causal relative to the System1 parent cutoff. D03 does not duplicate that source observer.


## 00 control-plane receipt — H19 D03-04 side accepted

00｜研究總控室 accepted D03-04 as H19's within-security/time-series momentum owner.

D03-04 remains L3/60% and owns causal within-security momentum continuation under its existing PIT/forward-outcome contract.

H19 remains partial because Room12 still must prove:
- D19-04 cross-sectional rank adds information beyond D03-04 on identical common support;
- D19-09 residual/factor-neutral momentum survives fixed factor/industry neutralization with provenance and cost/capacity controls.

Do not duplicate D03 momentum research as a second factor-layer study.


## TI-651 through TI-660 — pre-parent source-cut acceptance / capacity audit (2026-10-04)

Durable artifacts:
- `research/D03_PRE_PARENT_CONTINUITY_SOURCE_CUT_HANDOFF_V0_1.md`
- `research/d03_pre_parent_source_cut_v0_1.mjs`
- `tests/test_d03_pre_parent_source_cut_v0_1.mjs`
- `research/d03_pre_parent_continuity_capacity_probe_v0_1.mjs`
- read-only workflows `.github/workflows/research-d03-pre-parent-source-cut-readonly.yml` and `.github/workflows/research-d03-pre-parent-continuity-capacity-readonly.yml`.

### TI-651 — first-observed availability is sufficient for parent cutoff causality

The shared MOPSOV owner adapter separates:
- firstObservedAt / firstObservedAvailableAt;
- precisionEligible (prior NOT_OBSERVED <=5 minutes);
- publication-latency certification.

For D03 parent causality, an exact version that was prospectively first-observed no later than parent knownAt can establish conservative availability-by-cutoff even when precisionEligible=false.

The <=5-minute prior-NOT_OBSERVED window is a latency-estimation precision requirement, not an intrinsic Bollinger/ADX parent-eligibility requirement.

No polling schedule is authorized by this conclusion.

### TI-652 — selected-only pre-parent source querying is rejected

The immutable C1 parent population is created by the normal scan. Waiting for selected/parent symbols before querying source versions would necessarily make the source capture post-parent.

Promotion-grade pre-parent evidence must therefore be market-wide/exchange-wide or full eligible-universe scoped before the parent.

Selected-only pre-parent source capture is structurally invalid.

### TI-653 — market-wide source base already exists

Existing shared-source work already exposes:
- six range-verified TWSE/TPEx actual corporate-action result lanes;
- TWSE daily material-information OpenAPI;
- TPEx daily material-information OpenAPI;
- direct official MOPSOV historical/version transport.

The daily disclosure feeds are prospective snapshots, not historical version-complete archives, and therefore require immutable capture/version semantics before promotion use.

### TI-654 — physical source-cardinality audit

Read-only workflow run `37190871367` PASS on 2026-08-15..2026-10-02.

Across the six official actual-result lanes:
- total event rows = 294;
- unique event keys = 294;
- event-bearing dates = 31;
- mean events per event-bearing date ≈9.48;
- maximum events / unique symbols on one effective date = 33.

Lane counts:
- TWSE ex-right/dividend =149;
- TWSE capital reduction =7;
- TWSE par-value change =1;
- TPEx ex-right/dividend =129;
- TPEx capital reduction =7;
- TPEx par-value change =1.

This supports event-driven owner engineering as materially smaller than full-market per-symbol revision polling. It does not certify a production request budget, completeness or knownAt.

### TI-655/TI-656 — frozen parent source-cut acceptance

A future shared-owner source cut is parent-eligible only when:
- scanDate equals the parent scanDate;
- scope is market-wide/full eligible universe;
- all required market-wide lanes are READY with payload hashes;
- range lanes verify their requested range;
- parser completeness is true;
- source cut completes no later than actual parent knownAt;
- required MOPS exact-version expected/observed keysets reconcile exactly;
- each required MOPS version is PROSPECTIVE_POLL and firstObservedAt <= parent knownAt;
- no query/budget truncation;
- no UNKNOWN required lane;
- owner certifies noRevisionGapThroughCut.

Deterministic workflow run `37191199051` PASS:
- valid pre-parent source cut -> VALID_SOURCE_CUT_FOR_PARENT;
- precisionEligible=0 does not block availability-by-cutoff;
- late cut -> blocked;
- selected-only -> blocked;
- late MOPS version -> blocked;
- retrospective readback -> blocked;
- incomplete version keyset -> blocked;
- truncated query -> blocked.

### TI-657 — current receipt clock is not silently weakened

Bollinger/ADX v0.2 currently requires an owner continuity receipt captured no later than parent knownAt.

This tranche does not reinterpret or weaken that field.

If the shared owner later wants to compute a transform after the parent using only an immutable pre-parent evidence cut, that requires a separately versioned evidenceCutoffAt/receiptCreatedAt owner contract and a new D03 review.

### TI-658 — noRevisionGapThroughCut remains the hard unsolved claim

A source snapshot proves observed state, not absence of omitted versions.

Owner certification still needs complete source-population semantics, append-only exact version identity, prospective observation and reconciliation of any later-discovered pre-parent version.

D03 does not self-certify this field.

### TI-659 — two owner architectures remain possible

Research-compatible candidates:
1. pre-parent market-wide source cut, where actual observedAt controls eligibility and a late run fails closed;
2. versioned evidence-cutoff / receipt-created split, where later transform computation consumes only immutable pre-parent facts.

D03 does not deploy or choose either shared-owner architecture.

### TI-660 — maturity decision

No maturity promotion.

The source-cut requirement is now substantially narrower and executable, but no genuine cutoff-safe owner receipt has been produced.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains **56.7%**.

Next honest transitions remain:
- Bollinger L3 -> D03 58.3%;
- ADX L3 after canonical FULL_REPLAY -> D03 60.0%.

Current:
`PRE_PARENT_SOURCE_CUT_POLICY = PHYSICAL_TEST_PASS`
`EVENT_DRIVEN_SOURCE_CARDINALITY = PHYSICAL_MEASURED`
`HIGH_FREQUENCY_POLLING_INTRINSICALLY_REQUIRED = FALSE`
`SELECTED_ONLY_PRE_PARENT_SOURCE_CAPTURE = REJECTED`
`NO_REVISION_GAP_THROUGH_CUT = OWNER_CERTIFICATION_PENDING`
`D03_10 = L2_REMAINS`
`D03_09 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
1. shared continuity owner implements/executes one versioned pre-parent architecture;
2. produce a genuine cutoff-safe market-wide/full-universe source cut and exact prospective MOPS version observations;
3. certify noRevisionGapThroughCut and symbol-session completeness under owner rules;
4. bind owner continuity receipts to the first genuine V8.17 parent keyset;
5. execute Bollinger v0.2 for every expected parent and require COMPLETE reconciliation before any 58.3% promotion;
6. ADX follows only with canonical FULL_REPLAY;
7. raw D03 3-session gate remains 2/3 and TI-005/TI-006 outcomes remain closed.


## TI-661 through TI-685 — cutoff-safe continuity architecture / effective-build clock audit (2026-10-04)

Durable artifacts:
- `research/D03_EVIDENCE_CUTOFF_RECEIPT_SPLIT_V0_1.md`
- `research/d03_evidence_cutoff_receipt_split_v0_1.mjs`
- `research/d03_evidence_cutoff_receipt_split_contract_v0_1.json`
- `research/D03_TWO_POINT_NO_REVISION_GAP_V0_1.md`
- `research/d03_two_point_no_revision_gap_v0_1.mjs`
- `research/D03_PRE_PARENT_SOURCE_CUT_V0_2.md`
- `research/d03_pre_parent_source_cut_v0_2.mjs`
- `research/D03_PARENT_CONTINUITY_BINDING_V0_2.md`
- `research/d03_parent_continuity_binding_v0_2.mjs`
- `research/D03_EFFECTIVE_WORKER_DECISION_CUTOFF_AUDIT_V0_1.md`
- `research/D03_PARENT_DECISION_CUTOFF_OWNER_HANDOFF_V0_2.md`

### TI-661/TI-666 — source availability clock is separable from transform-computation clock

The previously open architecture from TI-659 is now physically falsified as a versioned research candidate.

A continuity transform may be materialized after the immutable parent only if:
- every admitted source fact was frozen in an immutable market-wide/full-eligible evidence cut before the true Formal input cutoff;
- the derived receipt references the exact evidenceCutId and market-wide cut manifest;
- postCutSourceFactCount = 0;
- unboundSourceFactCount = 0;
- every delivered raw bar has sourceFetchedAt <= evidenceCutoffAt.

The market-wide source-cut manifest hash and the symbol-specific transform-input manifest hash are different provenance layers and must not be forced equal. The receipt instead carries an exact cut-manifest reference plus its own symbol-transform manifest and source-fact-reference set hash.

Physical workflow `37195966922` PASS under the stricter decision-cutoff semantics.

The candidate retains all existing Bollinger v0.2 and ADX v0.2 formula/source/replay guards.

No maturity promotion.

### TI-667/TI-673 — two-point noRevisionGapThroughCut candidate

A fail-closed two-point owner-certifier candidate is now executable.

Pre-cut population establishes the exact versions prospectively observed by the cutoff.

Post-parent bounded complete reconciliation asks whether:
- any pre-cut version disappeared;
- any same versionKey changed payload;
- any newly discovered row has sourceReportedAt <= the original cutoff.

A genuinely later revision with sourceReportedAt > cutoff is allowed and recorded as later information; it does not invalidate the earlier cut.

Blocking witnesses:
- LATE_DISCOVERED_PRE_CUT_VERSION;
- VERSION_PAYLOAD_MUTATION;
- PRE_VERSION_MISSING_FROM_POST;
- incomplete/truncated post population;
- pre version firstObservedAt after cutoff.

Physical workflow `37195789302` PASS.

Authority remains:
- ownerCertificationRequired = true;
- d03SelfCertificationAuthority = false.

D03 does not self-certify source completeness.

### TI-674/TI-676 — parent receipt stamp cannot substitute for Formal input cutoff

The newer source-cut work initially used parent knownAt as the upper bound. This is superseded for promotion-grade causality.

Required ordering is now:

`source fact <= evidenceCutoffAt <= decisionCutoffAt <= decisionAt/parentKnownAt`.

A later decisionAt/capturedAt receipt may not be substituted for decisionCutoffAt.

Pre-parent source-cut V0.2 reuses all V0.1 market-wide scope, exact-version, completeness, no-truncation and no-revision-gap rules under the stricter decisionCutoffAt clock.

Physical workflow `37195982487` PASS:
- valid strict cutoff -> PASS;
- missing decisionCutoffAt -> blocked;
- source fact visible after cutoff but before later receipt stamp -> blocked;
- cutoff after decisionAt -> blocked.

No maturity promotion.

### TI-677/TI-681 — parent × evidence-cut × derived continuity binding V0.2

A post-parent derived continuity receipt can bind to a parent only after the strict cutoff timing envelope passes.

Binding identity now commits to:
- scanDate / captureGeneration / symbol / parentSnapshotHash;
- decisionCutoffAt / decisionAt / parent knownAt;
- evidenceCutId / evidenceCutoffAt / source-cut manifest;
- timing identity;
- continuity receipt id/version/createdAt;
- transform-input manifest;
- source-fact-reference set;
- sourceHistoryHash / continuityTransformHash;
- exact expected and actual eligible-date-set hashes;
- sourceBarsThrough.

Changing parent generation changes bindingId.

The binding still delegates indicator validity to the hardened v0.2 Bollinger/ADX evaluators.

Physical workflow `37196089575` PASS:
- valid post-parent-derived Bollinger -> VALID;
- valid canonical FULL_REPLAY ADX -> VALID;
- missing cutoff / late cut / wrong symbol / date-set mismatch / binding-before-receipt -> blocked.

No maturity promotion because these remain synthetic/outcome-blind contract witnesses.

### TI-682 — raw-source boundary assumption was falsified by the effective build

A first effective-build audit intentionally failed the earlier recommendation "after totalCapital read".

Reason:
the V7.5.30 patch chain performs an additional Formal-affecting asynchronous input read after total capital:

`V7_MARKET_CONSENSUS` from STOCKS_KV.

Market consensus is consumed by `applyMarketConsensus` and can affect candidate priority/ranking.

Therefore stamping decisionCutoffAt before this read would exclude a true Formal input and is causally wrong.

The failure is retained as useful falsification, not hidden.

### TI-683/TI-684 — effective V8.17 final Formal input boundary is physically source-audited

The corrected read-only audit builds the effective Worker through the same patch/review chain used by the current V8.17 architecture.

Physical workflow `37196768178` PASS after the C1/C2 review reports 95/95 tests PASS.

Observed effective build:
- runtime source version = `8.17.0-shadow-cohort-membership`;
- final Formal async input = STOCKS_KV `V7_MARKET_CONSENSUS` read;
- market-consensus read occurs after total-capital input;
- async/external reads after that final input and before selector = 0;
- `selectTomorrowCandidates` is synchronous;
- selector external reads observed = false;
- C1 decisionAt exists;
- C1 decisionCutoffAt does not exist;
- C1 build is downstream of Formal-result capture;
- Production mutation performed = false.

The current effective-build candidate cutoff anchor is therefore:

> immediately after the V7_MARKET_CONSENSUS read and immediately before selectTomorrowCandidates(...).

Any newer runtime must be re-audited; this is not a forever-static line-number rule.

### TI-685 — owner handoff V0.2 / anti-inflation decision

The corrected source-audited boundary is now handed to the shared immutable-C1 parent owner in:
- `research/D03_PARENT_DECISION_CUTOFF_OWNER_HANDOFF_V0_2.md`;
- `research/d03_parent_decision_cutoff_owner_handoff_v0_2.json`.

Owner implementation must be additive provenance only:
- persist real decisionCutoffAt under exact immutable generation identity;
- no historical backfill;
- no copy of decisionAt/capturedAt;
- no new market-data call merely to stamp time;
- no selection/ranking/capital/signal/push change;
- physical genuine-session readback required after owner deployment.

D03 does not implement/deploy this Production provenance change from the research lane.

### Current maturity / next honest gates

No maturity promotion:
- D03-10 Bollinger = L2/40;
- D03-09 ADX = L2/40;
- D03 aggregate = **56.7%**.

The next genuine Bollinger L3 gate now requires all of:
1. owner-persisted decisionCutoffAt on a genuine parent;
2. market-wide evidence cut <= decisionCutoffAt;
3. owner-certified noRevisionGapThroughCut and symbol-session completeness;
4. derived receipt uses only pre-cut facts;
5. V0.2 parent/evidence-cut binding;
6. complete expected-parent attempt reconciliation;
7. Bollinger v0.2 finite-window acceptance.

Only then may D03-10 advance L3 and D03 reach 58.3%.

ADX remains one gate harder:
all of the above + canonical-anchor FULL_REPLAY / exact recursive lineage before any 60.0% transition.

Raw D03 source-version gate remains independently 2/3.
TI-005/TI-006 outcomes remain CLOSED.
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`.
Formal Core remains LOCKED.


## TI-686 through TI-692 — minimal decision-cutoff implementation surface audit (2026-10-04)

Durable artifacts:
- `research/D03_DECISION_CUTOFF_MINIMAL_IMPLEMENTATION_AUDIT_V0_1.md`
- `research/d03_decision_cutoff_minimal_implementation_audit_v0_1.json`

### TI-686 — dedicated D1 column is not semantically required
Current C1 persistence writes the entire receipt header to `trade_research_c1_generations.header_json` and current readback reparses that header. Therefore an additive `decisionCutoffAt` field can be persisted/read back through the existing immutable header path without a required D1 schema migration.

### TI-687 — existing immutable-header conflict guard protects cutoff
Same-generation writes already conflict when incoming `header_json` differs. Once cutoff is part of the header, a changed cutoff for the same generation is naturally rejected. Historical backfill remains forbidden.

### TI-688 — cutoff remains a C1 parent fact
Shadow memberships already bind to exact `captureGeneration` and parent hashes. D03 can resolve cutoff from the immutable C1 header through that generation. Duplicating cutoff into every membership row is unnecessary and would create a second timestamp authority.

### TI-689 — minimum owner patch surface
Minimum semantically complete patch:
1. stamp real cutoff after final `V7_MARKET_CONSENSUS` read and before selector;
2. pass the exact value into selector and C1 builder;
3. validate same-session and `decisionCutoffAt <= decisionAt`;
4. include cutoff in C1 receipt/header;
5. persist/read back via existing `header_json`;
6. no new provider call and no Formal behavior change.

### TI-690 — cutoff and receipt clock remain distinct
`decisionCutoffAt` is the Formal-input freeze boundary. `decisionAt` is the later C1 receipt-materialization clock. The owner may not copy one into the other or infer historical cutoff from schedule/capture time.

### TI-691 — pre-deploy acceptance requirements
Owner implementation must prove:
- exact cutoff location after final Formal external input;
- zero later external/async Formal input before selector;
- selector remains synchronous;
- exact cutoff propagation into C1;
- immutable header readback;
- same-generation changed cutoff conflicts;
- Formal selection/ranking/quota/capital/signal/push parity;
- legacy generations remain readable but cutoff-ineligible, with no backfill.

### TI-692 — shadow cohort schema need not change for D03
D03 can use the exact C1 generation as cutoff owner. The existing shadow cohort semantic fingerprint need not include cutoff merely to satisfy D03. Adding cutoff to the cohort parent itself would be a separate schema/version decision and is not required by this lane.

### Maturity
No maturity promotion:
- D03-10 remains L2/40;
- D03-09 remains L2/40;
- D03 remains 56.7%.

This tranche materially reduces implementation scope/risk but creates no genuine cutoff-bearing parent.

Current:
`DECISION_CUTOFF_MINIMAL_PERSISTENCE_PATH = HEADER_JSON_NO_D1_MIGRATION_REQUIRED`
`DECISION_CUTOFF_DUPLICATE_MEMBERSHIP_FIELD = NOT_REQUIRED`
`DECISION_CUTOFF_RUNTIME_IMPLEMENTATION = OWNER_PENDING`
`HISTORICAL_BACKFILL = FORBIDDEN`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
shared System1 parent owner implements/version-controls the additive provenance patch under Production governance; re-audit effective runtime boundary; first genuine trading session after deploy must produce one cutoff-bearing immutable C1 generation; continuity owner then binds a cutoff-safe evidence cut; D03 executes Bollinger v0.2 across the complete expected parent population before any 58.3% promotion. ADX remains behind canonical FULL_REPLAY.


## TI-693 through TI-700 — V8.18 decision-cutoff provenance engineering gate (2026-10-05)

Durable engineering evidence:
- draft PR `#600`;
- exact CI head `f030f04c1a807a23fe19072b96407f1436d09da8`;
- candidate runtime label `8.18.0-decision-cutoff-provenance`;
- branch checkpoint `research/SYSTEM1_DECISION_CUTOFF_PROVENANCE_IMPLEMENTATION_20261005.md`.

### TI-693 — additive provenance implementation exists on a non-Production branch

The owner-handoff ambiguity from TI-686~692 has been reduced to executable code.

The V8.18 candidate:
1. stamps `decisionCutoffAt` immediately after the audited final Formal-affecting `V7_MARKET_CONSENSUS` KV read;
2. passes the exact timestamp into the synchronous Formal selector as research provenance only;
3. passes it into `buildC1PopulationReceipt`;
4. validates finite ordering against the later `decisionAt`;
5. persists it in the existing immutable C1 `header_json`;
6. exposes it automatically through existing C1 generation readback;
7. adds no provider call and no D1 schema column;
8. never backfills historical generations.

The candidate does not alter the Formal scoring/ranking/quota/capital/signal/push/order definitions.

### TI-694 — exact runtime placement is mechanically frozen

Dedicated V8.18 fixture verifies:

`V7_MARKET_CONSENSUS read -> decisionCutoffAt stamp -> selectTomorrowCandidates`.

Between the cutoff stamp and selector call:
- no `await`;
- no `fetch`;
- no `STOCKS_KV.get`;
- no `V7_DB` read.

The selector remains synchronous and external-read-free.

Result:
`DECISION_CUTOFF_PLACEMENT = POST_V7_MARKET_CONSENSUS_PRE_SELECTOR`.

### TI-695 — existing immutable header is sufficient

A dedicated D1 scalar column is still not required.

The candidate writes cutoff provenance into the existing C1 immutable header and reads it back through the existing protected generation reader.

Fixture:
`headerRoundTrip=true`.

Therefore:
`DECISION_CUTOFF_PERSISTENCE = EXISTING_HEADER_JSON_PATH`.

### TI-696 — same-generation cutoff mutation is physically rejected

The dedicated fixture persists one C1 generation, then attempts the same generation identity with a changed cutoff.

Observed:
`sameGenerationCutoffMutation=CONFLICT`.

The existing V8.15.1 immutable-header guard raises:
`C1_IMMUTABLE_GENERATION_CONFLICT`.

Therefore the cutoff inherits the existing generation immutability contract without a second persistence mechanism.

### TI-697 — V8 Repair CI passes

PR #600 exact head:
`f030f04c1a807a23fe19072b96407f1436d09da8`.

V8 Repair CI:
- run `37237843589`;
- conclusion: SUCCESS.

The candidate build chain applies V8.18 after V8.17 and the expected effective version is present.

### TI-698 — isolated C1/C2 repair review passes 100/100

System1 C1 C2 isolated offline repair review:
- run `37237843572`;
- conclusion: SUCCESS;
- tests: 100 / 100 PASS.

Observed V8.18 changed functions relative to V8.17:
- `runAfterMarketScanCore`;
- `buildC1PopulationReceipt`;
- `selectTomorrowCandidates`.

Frozen review fields:
- `selectorUnchangedExceptCaptureFirewall=true`;
- `runAfterMarketScanCoreUnchangedExceptCutoffStamp=true`;
- `decisionCutoffProvenanceOnly=true`;
- `formalCoreImpact=false`.

Protected function count reported by the isolated review: 451.

### TI-699 — full regression passes

V8 Regression Tests:
- run `37237843517`;
- conclusion: SUCCESS.

The dedicated V8.18 fixture executes inside the full regression chain and reports:
- `status=PASS`;
- `version=8.18.0-decision-cutoff-provenance`;
- `decisionCutoffPlacement=POST_V7_MARKET_CONSENSUS_PRE_SELECTOR`;
- `headerRoundTrip=true`;
- `sameGenerationCutoffMutation=CONFLICT`;
- `historicalBackfill=false`;
- `formalCoreImpact=false`.

No Cloudflare Production deployment was triggered by the draft PR.

### TI-700 — maturity and authority decision

This tranche is engineering evidence, not a genuine Taiwan trading-session parent receipt.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains **56.7%**;
- raw D03 source-version gate remains 2/3;
- TI-005/TI-006 outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

PR #600 remains:
- OPEN;
- DRAFT;
- MERGEABLE;
- NOT MERGED.

The next action crosses the protected Production boundary:
owner approval is required before merge/deploy of the concrete PR.

After an approved deploy, maturity still does not rise immediately.
The next genuine Taiwan trading session must produce:
1. a cutoff-bearing immutable C1 generation;
2. exact protected readback;
3. cutoff-safe owner continuity receipt/evidence cut;
4. complete expected-parent Bollinger v0.2 reconciliation.

Only then may D03-10 be considered for L3 and D03 58.3%.
ADX remains second and additionally requires canonical FULL_REPLAY.


## TI-701 through TI-708 — D03 indicator lineage / parameter-family anti-double-count contract (2026-10-05)

Canonical artifacts:
- `research/D03_INDICATOR_LINEAGE_AND_PARAMETER_FAMILY_CONTRACT_20261005_V0_1.md`;
- `research/d03_indicator_lineage_registry_20261005_v0_1.json`;
- `research/test_d03_indicator_lineage_registry_v0_1.mjs`.

### TI-701 — same root and different formulas
All active D03 modules are primarily descendants of `PRICE_OHLC`. Different formulas may support residual candidates but do not prove independence. Correlation below one, module ownership and formula names are insufficient.

### TI-702 — representation families frozen
The 12 active canonical modules are assigned to explicit representation/redundancy groups. Historical D03-11 ROC remains retired into D03-02 because same-horizon percentage ROC is exactly `100 * retN`; capability coverage remains, but no duplicate vote returns.

### TI-703 — parameter-family ledger frozen before outcomes
Return horizons remain 5/20/60 eligible sessions; existing canonical SMA/EMA/MACD/KD/RSI/ADX/Bollinger/divergence/multi-timeframe formula contracts remain authoritative. Any window, smoother, warm-up, seed, field or threshold change creates a new factorVersion inside the same parameterFamilyId and consumes one experiment-family budget.

### TI-704 — residual incrementality gate
Independent-vote status requires same-horizon aliases, direct price/trend, D01/D02 price-only, D04 volatility and D18 Regime controls where applicable; PIT, common support, purged OOS/prospective Shadow, walk-forward, date dependence, multiple testing, cost/fillability and D16/00 readback remain mandatory.

### TI-705 — support, falsifiers and failure states
Within-family grouping is supported by deterministic ancestry and exact aliases. Counterhypothesis remains open where path/range/dispersion may add residual information. Choppy markets, limits, suspension, corporate actions, tick discreteness, volatility shocks, nested timeframes and parameter search are frozen failure modes. Missing controls remain UNKNOWN.

### TI-706 — machine fail-closed rule
The registry carries the canonical lineage fields. Missing lineage, unknown representation family or unregistered version cannot increase effectiveIndependentEvidenceCount. Raw count and deduplicated family count must both be observable.

### TI-707 — deterministic fixture passes
Observed fixture result:
`status=PASS; modules=12; retiredRocOwner=D03-02; directReturnAliasFamilies=1; trendAliasFamilies=1; missingLineage=UNKNOWN; formalCoreImpact=NONE_LOCKED`.

This proves contract mechanics, not Alpha.

### TI-708 — maturity and routing decision
D03 semantic remediation for SDA-001/SDA-004 is now frozen V0.1. The tickets remain REMEDIATION_IN_PROGRESS because System1/System2 shared lineage/dedup Shadow engineering, D16 residual/multiple-testing/OOS readback and 00 closure remain outstanding.

No maturity promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- PR #600 remains owner-gated and untouched;
- raw receipt gate remains 2/3;
- outcome joins remain closed;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next:
protected Production path still requires owner approval for PR #600, then a genuine cutoff-bearing Taiwan-session parent and complete Bollinger v0.2 reconciliation. Independent Class A path hands the frozen registry to System1/System2 for raw-vs-deduplicated Shadow diagnostics; D16 must preregister the parameter-family budget and validate common-support residual/OOS incrementality. ADX remains second behind Bollinger and canonical FULL_REPLAY.


## TI-709 through TI-716 — residual-baseline / consumer pre-audit (2026-10-05)

Canonical artifact:
- `research/D03_RESIDUAL_BASELINE_AND_CONSUMER_PREAUDIT_20261005_V0_1.md`.

### TI-709 — consumer reachability is not yet demonstrated
At observed main before this tranche, GitHub code search for the exact D03 lineage registry filename returned zero indexed consumer references. This is recorded as `NO_INDEXED_CONSUMER_REFERENCE_OBSERVED`, not proof that no consumer exists. Until a deterministic consumer receipt exists, raw-vs-deduplicated Shadow behavior remains unverified.

### TI-710 — strongest-baseline matrix frozen
Each D03 residual candidate now has an explicit strongest sibling/parent/control set. The matrix prevents a weak single-baseline test from manufacturing multiple independent confirmations.

### TI-711 — residual success does not auto-split a redundancy group
A candidate may add residual predictive value and still remain inside its existing effective evidence family. `redundancyGroupId` cannot split merely because correlation is below one or a local residual coefficient is positive. Group split requires sibling controls, common support, multiplicity correction, OOS/prospective evidence, D16 readback and 00 closure.

### TI-712 — KD/RSI bilateral-control rule
KD and RSI require candidate-versus-sibling conditional tests after shared direct-return/trend/range controls. Passing only separate KD-vs-return and RSI-vs-return tests cannot create two oscillator votes.

### TI-713 — child-parent anti-stacking rule
Divergence cannot vote independently alongside both its price-pivot parent and base indicator by default. The same rule applies to multi-timeframe conflict, Bollinger component combinations and pullback confirmation relations.

### TI-714 — component decomposition is diagnostic, not vote multiplication
Bollinger position and width must be falsified against separate location and volatility/compression controls, but together remain one envelope family absent explicit reclassification. ADX directional movement and true-range components likewise require trend plus D04 volatility/range controls.

### TI-715 — parameter budget survives renaming/transforms
Rejected parameterizations stay in the experiment-family history. Renaming, sign inversion, percentile conversion, normalization or timeframe restatement does not reset the parameter-family budget. D16 owns multiplicity and holdout accounting.

### TI-716 — maturity/routing
No maturity promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcomes remain closed;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- SDA-001/SDA-004 remain `REMEDIATION_IN_PROGRESS`.

Exact next:
System 1/System 2 consume the canonical D03 registry and expose raw-vs-deduplicated Shadow diagnostics plus duplicate/alias tests; D03 reviews mapping drift and rejects sibling/child/nested-timeframe vote inflation; D16 preregisters the parameter-family budget and runs sibling/common-support residual/OOS tests; protected Production path remains owner-gated at PR #600. Bollinger remains first post-deploy target and ADX second behind canonical FULL_REPLAY.


## TI-717 through TI-724 — System 2 daily resonance lineage bridge (2026-10-05)

Canonical artifacts:
- `research/D03_SYSTEM2_DAILY_RESONANCE_LINEAGE_BRIDGE_20261005_V0_1.md`;
- `research/d03_system2_daily_resonance_lineage_bridge_20261005_v0_1.json`.

### TI-717 — actual System 2 runtime semantics observed
The current research-only daily resonance runtime uses three entry/exit booleans and `entryCount`/`exitCount` for 1/3 -> 2/3 -> 3/3 lifecycle progression. The same runtime explicitly declares `sameFamilyIndependenceClaim=false`, one `PRICE_DERIVED_TREND_MOMENTUM_STATE` evidence family, no decision/notification/order impact and a note that the three conditions are correlated price-derived states rather than three independent votes.

### TI-718 — three-condition D03 lineage mapping
Price-above-EMA16-and-rising and EMA16-above-EMA64 map to D03-01 / `RG_D03_PRICE_TREND`. System 2 Impulse MACD also maps to `PRICE_OHLC` and the same `RG_D03_PRICE_TREND` as a comparator/challenger representation, not a new independent family.

### TI-719 — Impulse MACD parameter-family loophole closed
System 2 Impulse MACD is not canonical MACD12/26/9; it uses HLC3 + SMMA34 envelope + ZLEMA34 + SMA9 signal. Formula difference does not prove independence. Frozen research parameter family: `PF_D03_SYSTEM2_IMPULSE_MACD_34_9_HLC3_V0_1`. Future source/smoother/window/seed/warm-up changes must consume the same broader experiment-family budget.

### TI-720 — 3-of-3 is lifecycle count, not evidence count
`entryCount` and `exitCount` remain valid lifecycle condition counts. They are not Alpha vote counts. For the current three-condition cluster, raw condition count may be 0..3 while deduplicated D03 group count and effective independent technical evidence count remain at most 1 until residual proof.

### TI-721 — semantic-basis separation cannot override D03 redundancy groups
Older System 2 semantic bases remain descriptive. Example: KD maps to B2 and RSI to B3, but both remain in `RG_D03_OSCILLATOR` until bilateral sibling residual evidence justifies a split. `semanticBasisIds` describe content dimensions; `redundancyGroupId` governs effective-evidence deduplication.

### TI-722 — runtime dedup diagnostics still missing
Current daily resonance/factor runtime does not yet emit the D03-required fields `rawSignalCount`, `dedupedEvidenceFamilyCount`, `effectiveIndependentEvidenceCount`, overlap IDs, redundancy-group contributions and dominant roots. This is a diagnostic gap, not evidence of a live ranking bug.

Current safe status:
`SEMANTIC_GUARD_PRESENT_RUNTIME_DEDUP_DIAGNOSTICS_MISSING`.

### TI-723 — consumer acceptance frozen
A compliant System 2 research/shadow bridge may preserve 1/3, 2/3 and 3/3 states, but must expose the three raw conditions, map all current components to `PRICE_OHLC` / `RG_D03_PRICE_TREND`, report one deduplicated family for a full 3/3 state, keep same-family independence false, block lifecycle counts from becoming Alpha vote counts, version parameter challengers and fail missing lineage closed to UNKNOWN.

### TI-724 — maturity/routing
No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcome joins remain closed;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- SDA-001/SDA-004 remain `REMEDIATION_IN_PROGRESS`.

Exact next:
System 2 implementation owner adds research/shadow lineage diagnostics to the daily resonance consumer without changing the 3-of-3 lifecycle or Formal behavior; D03 reviews the machine receipt for exact three-raw-to-one-group mapping. System 1 still requires equivalent raw-vs-deduplicated diagnostics. D16 owns sibling residual, parameter-family multiplicity and OOS/prospective validation. Protected PR #600 remains owner-gated and independent.


## TI-725 through TI-732 — System 2 resonance dedup acceptance oracle (2026-10-05)

Canonical artifacts:
- `research/D03_SYSTEM2_RESONANCE_DEDUP_ACCEPTANCE_ORACLE_20261005_V0_1.md`;
- `research/d03_system2_resonance_dedup_acceptance_cases_20261005_v0_1.json`;
- `research/test_d03_system2_resonance_dedup_acceptance_v0_1.mjs`.

### TI-725 — complete three-condition truth table frozen
All eight Boolean entry combinations are covered. Raw lifecycle count remains 0..3, while every nonzero combination deduplicates to one `RG_D03_PRICE_TREND` family and one effective independent evidence unit. Exit semantics are symmetric.

### TI-726 — missing lineage fails closed
An active unregistered condition preserves raw observability but forces deduplicated/effective counts to null with `UNKNOWN_LINEAGE_FAIL_CLOSED`. UNKNOWN is not coerced to zero, PASS or BAD.

### TI-727 — duplicate registration cannot inflate counts
Repeated condition IDs collapse to one raw identity and one family contribution. Cosmetic aliases cannot reset lineage or parameter-family multiplicity.

### TI-728 — mapping drift is rejected
Any silent reassignment of EMA16/EMA64/Impulse-MACD conditions outside `RG_D03_PRICE_TREND` fails acceptance absent newer D16/00 closure.

### TI-729 — parameter drift is rejected
Impulse MACD source/smoother/window/seed/warm-up changes require a new factorVersion and remain charged to `PF_D03_SYSTEM2_IMPULSE_MACD_34_9_HLC3_V0_1` broader experiment-family accounting.

### TI-730 — support and counterhypothesis
Same-root deduplication is supported by deterministic OHLC ancestry and shared EMA16 dependence. The counterhypothesis that Impulse MACD adds path discrimination remains testable, but cannot create a second vote before direct sibling/common-support/multiplicity/OOS evidence.

### TI-731 — inference boundary
The oracle proves lineage mechanics only. PIT/finality/continuity, purged OOS/prospective Shadow, walk-forward, date clustering, multiple testing, D01/D02/D04/D18 controls, costs, limits, suspension and fillability remain required.

### TI-732 — deterministic result and routing
Observed:
`status=PASS; truthTableCases=8; adversarialCases=4; fullResonanceRawSignalCount=3; fullResonanceDedupedEvidenceFamilyCount=1; fullResonanceEffectiveIndependentEvidenceCount=1; missingLineage=UNKNOWN_FAIL_CLOSED; formalCoreImpact=NONE_LOCKED`.

This is implementation-ready acceptance evidence, not System 2 implementation completion.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcomes remain CLOSED;
- `SYSTEM2_RUNTIME_DEDUP_DIAGNOSTICS = MISSING`;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
System 2 implementation owner adds the six required research/shadow diagnostics and executes this oracle without changing lifecycle, signal, notification, order or Formal behavior. D03 reviews the returned machine receipt for exact 3-raw-to-1-family mapping and mapping/parameter drift. System 1 equivalent diagnostics, D16 validation, 00 closure, protected PR #600 approval, Bollinger post-deploy evidence and ADX FULL_REPLAY remain separately required.


## TI-733 through TI-740 — System 1 SDA consumer mapping review (2026-10-05)

Canonical artifacts:
- `research/D03_SYSTEM1_SDA_CONSUMER_MAPPING_REVIEW_20261005_V0_1.md`;
- `research/d03_system1_sda_consumer_mapping_review_20261005_v0_1.json`.

### TI-733 — merged consumer authority
PR #608 is merged and the System 1 Class A diagnostic consumer is present on main. It imports the canonical D03 registry directly and pins its digest. Caller-provided D03 lineage cannot silently override the canonical mapping.

Decision:
`SYSTEM1_D03_REGISTRY_PINNING = PASS`.

### TI-734 — retired alias / parameter-family mapping
D03-11 correctly resolves to D03-02; aliases cannot reset parameter/experiment identity. Same-horizon return/ROC/Momentum/log-return aliases deduplicate correctly.

Decision:
`D03_ALIAS_RETIREMENT_MAPPING = PASS`.

### TI-735 — same-root connected dedup
The consumer collapses active factors when they share an information root, redundancy group or direct parent/child link. This is conservative and prevents D01/D02/D03 same-price ancestry from manufacturing extra votes.

Decision:
`SAME_ROOT_CONNECTED_DEDUP = PASS_CONSERVATIVE`.

`dedupedEvidenceFamilyCount` remains a connected-root-family diagnostic, not proof of independent economic Alpha.

### TI-736 — independent-vote promotion remains closed
The implementation currently fixes:
`effectiveIndependentEvidenceCount = 0`
and
`independentEvidenceStatus = NOT_PROVEN_NO_PROMOTION_PATH`.

No local result can silently promote an independent vote before D16/00 evidence.

Decision:
`INDEPENDENT_EVIDENCE_PROMOTION_FIREWALL = PASS`.

### TI-737 — fail-closed / clock / outcome-lane checks
Missing lineage, invalid/future observation clocks, non-boolean signal state and D03-04 outcome-relation voting all fail closed. Any incomplete Formal-eligible candidate blocks aggregate Shadow ranking rather than producing favorable complete-case output.

Decision:
`FAIL_CLOSED_AND_CLOCK_GUARD = PASS`.

### TI-738 — diagnostic schema field gap
Canonical D03 requires explicit `redundancyGroupContributions` and `dominantInformationRoots`. System 1 currently provides equivalent group/root information inside generic `contributions` but does not emit both canonical top-level fields.

Decision:
`CANONICAL_DIAGNOSTIC_FIELD_COVERAGE = PARTIAL`.

This is a machine-readback/schema gap, not evidence that current grouping is wrong.

### TI-739 — overlap identity durability gap
Current `overlappingSignalIds` contains local signal indices rather than stable factorId + factorVersion identities. Indices are deterministic within one receipt but weaker across reordering, regenerated receipts and version migration.

Decision:
`OVERLAP_IDENTITY_DURABILITY = PARTIAL`.

Required future diagnostic preserves factorId, factorVersion and optional local signalIndex.

### TI-740 — overall mapping decision
System 1 D03 consumer mapping:
`PASS_WITH_DIAGNOSTIC_SCHEMA_GAPS`.

Open research-only deltas:
1. explicit `redundancyGroupContributions`;
2. explicit `dominantInformationRoots`;
3. stable factorId + factorVersion overlap identity.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- SDA-001/SDA-004 remain REMEDIATION_IN_PROGRESS.

Exact next:
System 1 engineering owner may add only the three diagnostic schema deltas without scoring/Formal changes; D03 then reviews the small delta only. First genuine-session System 1 receipt is still required. System 2 runtime dedup diagnostics remain missing. D16 common-support sibling residual/multiplicity/OOS validation and Room00 closure remain pending.


## TI-741 through TI-748 — System 1 diagnostic schema delta acceptance (2026-10-05)

Canonical artifacts:
- `research/D03_SYSTEM1_DIAGNOSTIC_SCHEMA_DELTA_ACCEPTANCE_20261005_V0_1.md`;
- `research/d03_system1_diagnostic_schema_delta_cases_20261005_v0_1.json`;
- `research/test_d03_system1_diagnostic_schema_delta_acceptance_v0_1.mjs`.

### TI-741 — explicit contribution reconciliation
`redundancyGroupContributions` must describe the same connected components as `dedupedEvidenceFamilyCount`, carry stable factor/version references plus local indices, have unit contribution per component and reconcile exactly to `dedupedShadowScore`.

### TI-742 — dominant-root semantics frozen
`dominantInformationRoots` is derived from the maximum unique active-factor coverage by information root, sorted deterministically. Empty active evidence yields an empty array. Invalid, future-clock and outcome-only signals are excluded.

### TI-743 — stable overlap identity and compatibility
Acceptance requires factorId + factorVersion + signalIndex. Additive V0.1 may preserve legacy numeric IDs only if canonical stable refs are added; versioned V0.2 may separate stable IDs from local indices.

### TI-744 — permutation invariance
Reordering signals may change local indices only. Raw/dedup counts, scores, effective-independent count, stable overlap identities and dominant roots must not change.

### TI-745 — superficial schema patches are rejected
Missing fields, contribution/count disagreement, dominant-root mismatch, missing factorVersion, UNKNOWN leakage or protected-output changes fail acceptance.

### TI-746 — interpretation
Current gaps are traceability/readback debt, not demonstrated evidence inflation. Existing generic contributions contain much of the information, but index-only identity cannot support cross-receipt audit.

### TI-747 — authority boundary
Schema completion proves no Alpha, OOS, cost-adjusted value or production readiness. `effectiveIndependentEvidenceCount=0` and `independentEvidenceStatus=NOT_PROVEN_NO_PROMOTION_PATH` remain locked pending D16/00 evidence.

### TI-748 — executable result and routing
Observed:
`status=PASS; acceptanceCases=7; completeSchema=PASS; genericOnly=REJECT_CANONICAL_FIELDS_MISSING; permutationInvariant=true; stableOverlapIdentity=true; dominantRootReconciled=true; effectiveIndependentEvidenceCount=0; formalCoreImpact=NONE_LOCKED`.

This is implementation-ready acceptance evidence, not engineering completion.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- first genuine System 1 SDA receipt remains pending;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
System 1 Class A owner implements the three schema deltas and executes this oracle. D03 revalidates only TI-738/TI-739 rather than reopening passed mapping logic, then waits for the first genuine-session receipt. System 2 implementation, D16 method receipt, 00 closure and protected PR #600/Bollinger/ADX paths remain independent.


## TI-749 through TI-758 — D03 -> D16 method receipt acceptance oracle (2026-10-05)

Canonical artifacts:
- `research/D03_D16_METHOD_RECEIPT_ACCEPTANCE_ORACLE_20261005_V0_1.md`;
- `research/d03_d16_method_receipt_acceptance_oracle_20261005_v0_1.json`;
- `research/test_d03_d16_method_receipt_acceptance_v0_1.mjs`.

### TI-749 — receipt identity binding
A future D16 receipt must bind exact method receipt version, D03 experiment version, preregistration hash, feature-contract hashes, parent/continuity/outcome contract versions. Missing/mismatched identity is blocking and cannot be repaired after outcomes.

### TI-750 — common-support population invariants
Selected-only inference is forbidden. BLOCKED/UNKNOWN/CONSTRAINED handling must remain explicit and fail closed. All comparison arms must use the same frozen common-support parent rows with date-level population accounting.

### TI-751 — chronology / purge / holdout firewall
Chronological split, training dates, purged training dates, untouched holdout dates and a purge rule covering the maximum registered D20 forward information footprint must be frozen before outcomes. Random row split, holdout-driven method selection and post-outcome purge retuning are forbidden.

### TI-752 — dependence-aware inference requirement
Stock rows are not IID. The receipt must address scanDate common shocks, repeated symbols, episodes, overlapping forward windows, overlapping feature lookbacks and sector/industry dependence. Row N may not be reported as independent N.

### TI-753 — estimand / endpoint / weighting lock
Every H005/H006 comparison requires an exact endpoint, contrast, weighting rule, uncertainty method and effect-size metric. D5 return/MFE/MAE remain the jointly declared primary family. D10/D20 remain secondary and cannot rescue a failed D5 conclusion.

### TI-754 — multiplicity family cannot shrink
The receipt must retain H005-A/B/C/D, H006-A/B/C plus all registered D5/D10/D20 endpoints in one family. Failed/null/inconclusive cells remain counted. Renaming indicators, versions, holdouts or endpoint presentation cannot reset family consumption. Alternate KD/RSI/MACD periods and timeframe search remain unauthorized in V0.1.

### TI-755 — experiment order / no-retuning guard
TI-005 KD-vs-RSI remains before TI-006 MACD-vs-direct-trend. Outcome-driven reordering, formula/period/threshold/baseline/endpoint changes or difficult-date removal are prohibited.

### TI-756 — legitimate blocking states are valid science
Allowed terminal states include METHOD_READY, METHOD_BLOCKED, POWER_INSUFFICIENT, DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE, COMMON_SUPPORT_INSUFFICIENT, COVERAGE_BIASED and VERSION_INCOMPATIBLE.

A structurally valid blocking receipt is accepted as a scientific method result and must not be retuned into METHOD_READY.

METHOD_READY means method-contract admissibility only; it does not bypass D03 T1-T5 physical gates, T6 support floors, independent-evidence proof or Formal approval.

### TI-757 — adversarial cases frozen
The executable fixture rejects missing/mismatched identity, selected-only inference, UNKNOWN-to-negative coercion, random row split, holdout method selection, incomplete forward-footprint purge, IID row inference, row-N pseudo-replication, common-support mismatch, experiment-order drift, unsupported terminal state, D10/D20 rescue, multiplicity-family shrinkage and post-outcome formula/period/threshold/endpoint/baseline changes.

The fixture also encodes that POWER_INSUFFICIENT can be structurally accepted while remaining non-executable, and METHOD_READY cannot authorize outcome execution while D03 T1-T5 remain blocked.

### TI-758 — current routing
The oracle is frozen before the real D16 D03-specific method receipt arrives. The executable fixture is present but has not been used as evidence that a real D16 receipt passed.

Current:
- D16 D03 method receipt = NOT_YET_RETURNED;
- D03 raw source-version gate = 2/3;
- outcome join = CLOSED;
- first genuine System 1 SDA receipt = pending;
- System 2 runtime dedup diagnostics = missing;
- Formal Core = LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40.

Exact next:
when D16 returns the machine-readable D03 receipt, run only this frozen oracle and accept legitimate blocking states without redesign. System 1 schema implementation, first genuine-session receipt and System 2 dedup runtime remain independent pending lanes. Even METHOD_READY does not open outcomes until T1-T5 separately pass. Room00 remains SDA-001/SDA-004 closure authority.


## TI-759 through TI-776 — mixed-root residual graduation and selection-identification guard (2026-10-06)

Canonical artifacts:
- `research/D03_MIXED_ROOT_RESIDUAL_GRADUATION_GUARD_20261006_V0_1.md`;
- `research/d03_mixed_root_residual_graduation_guard_20261006_v0_1.json`;
- `research/test_d03_mixed_root_residual_graduation_guard_v0_1.mjs`;
- `research/d03_mixed_root_residual_graduation_acceptance_receipt_20261006_v0_1.json`;
- `research/D03_MIXED_ROOT_RESIDUAL_SELECTION_IDENTIFICATION_ADDENDUM_20261006_V0_1.md`;
- `research/d03_mixed_root_residual_selection_identification_addendum_20261006_v0_1.json`;
- `research/test_d03_mixed_root_residual_selection_identification_v0_1.mjs`;
- `research/d03_mixed_root_residual_selection_identification_acceptance_receipt_20261006_v0_1.json`.

### TI-759 — mixed-root factor is not independent by construction
A factor consuming multiple roots such as PRICE_OHLC + VOLUME_TURNOVER is not automatically multiple independent evidence units. Before component-specific residual proof, the parent remains PARTIAL_OVERLAP / RESIDUAL_CANDIDATE / SAME_ROOT_REDUNDANT and adds no effective independent evidence beyond already-counted overlapping roots.

### TI-760 — graduation attaches only to an isolated residual child
If D16 proves that one root adds stable information conditional on the overlapping roots and registered controls, the promotable research object is an immutable root-specific residual child. The whole parent composite may not inherit the proof.

Required bindings include parent factor/version, isolated root, conditioned-on roots, residualization method, baseline hash, common-support hash, D16 method/incrementality receipt hashes, parameter family and decision clock.

Allowed evidence state is RESIDUAL_INCREMENTAL_PROVEN, not INDEPENDENT_SOURCE_PROVEN.

### TI-761 — parent composite remains non-additive
For one price family plus one proven volume residual:
- price family = at most 1 effective unit;
- proven volume residual = at most +1;
- original price-volume composite = +0;
- total = at most 2, never 3.

Raw parent/child activity may remain visible, but effective-evidence accounting cannot count both parent and residual child for the same isolated root.

### TI-762 — proof must be root-specific and baseline-bound
A generic finding that a mixed factor beats a price-only model is insufficient. The receipt must identify exactly which root/component is incremental and bind it to the exact baseline, common support, residualization method, multiplicity family, OOS/prospective evidence and D16 method receipt.

### TI-763 — no residual laundering through labels/transforms
Renaming, products/ratios, percentile/z-score/rank transforms, sign inversion, thresholding, timeframe restatement or post-outcome interaction labels cannot manufacture a new residual family.

### TI-764 — baseline or method drift invalidates inherited proof
Changes to baseline family, parent formula/version, source semantics, common support, residualization method, decision clock, parameter/outcome family or holdout/dependence method require revalidation. Old proof cannot become permanent independence credit.

### TI-765 — raw observability is separate from effective evidence
rawSignalCount may show both parent and child. Effective evidence may count only the root-specific family authorized by proof. When a residual child is the promoted object, parentCompositeContributionToIndependentEvidence is zero.

### TI-766 — undecomposed mixed roots fail closed
Missing root decomposition, baseline identity, parent lineage or proof identity yields MIXED_ROOT_UNDECOMPOSED and no hidden residual increment.

### TI-767 — D02/D03 cross-domain boundary
D02 owns truth about VOLUME_TURNOVER source/unit/PIT semantics. D03 owns only the anti-stacking evidence-counting rule. The same component-specific logic applies to D03-10 Bollinger location/volatility components and D03-09 ADX trend/range components: proof for one child does not promote the whole composite.

### TI-768 — first deterministic accounting result
Canonical Node fixture is frozen. Independent logic-mirror validation in this research round covered 12 cases: 3 positive accounting cases plus 9 adversarial rejections.

Observed:
`unproven mixed-root effective count = 1`;
`proven volume residual effective count = 2`;
`duplicate volume residual aliases still = 2`;
whole-parent graduation, stale baseline/common-support/D16 bindings, invalid root and self-conditioning are rejected.

No CI/Node execution receipt is claimed for this round; the acceptance receipt explicitly records `repositoryNodeFixtureExecutedInThisRound=false`.

### TI-769 — common support is necessary but not sufficient
D16's new SDA-016 admission-selection identification firewall was observed on latest main while this tranche was being written. A mathematically identical complete-case row set does not prove representation of the preregistered target population.

`COMMON_SUPPORT_PASS != TARGET_POPULATION_IDENTIFIED`.

### TI-770 — admission remains first-class lineage
Residual graduation must preserve stage-wise target eligibility, capture, readback, prediction, outcome maturity, performance/cost eligibility, final admission, exclusions and decision-time context. Keeping only final admitted rows is insufficient.

### TI-771 — estimand scope binds residual evidence
Allowed scopes:
- OBSERVED_SUBPOPULATION_ESTIMAND;
- RESTRICTED_SUPPORT_ESTIMAND;
- TARGET_POPULATION_ESTIMAND.

Observed-subpopulation evidence remains RESIDUAL_CANDIDATE for cross-system evidence counting and contributes zero new effective independent units.

### TI-772 — restricted-support evidence cannot become global evidence
Trimming, truncation, overlap weighting or support restriction changes the estimand. A restricted-support residual may increment evidence only for a consumer bound to the same support rule/hash; it cannot be exported to an unrestricted universe or Top6 claim.

### TI-773 — positivity/overlap failure blocks target-population graduation
Zero/near-zero admission probability cannot be repaired merely by extreme weights. Target-population graduation requires admissible positivity/overlap diagnostics and fails closed otherwise.

### TI-774 — selection-sensitivity tier is part of proof identity
Tier A is observed-subpopulation only. Tier B requires preregistered decision-time admission/censoring weighting plus weight/balance diagnostics. Tier C uses partial-identification / worst-case sensitivity when point identification is not defensible. Tier changes after outcome inspection consume a new adaptive family.

### TI-775 — evaluation cutoff and imputation are frozen pre-outcome
Outcome-driven maturity-window changes, early stopping, selection-model retuning or post-outcome imputation-model choice are forbidden as proof repair mechanisms.

### TI-776 — augmented two-layer graduation decision
Cross-system RESIDUAL_INCREMENTAL_PROVEN requires BOTH:
1. component-isolation/root-specific residual proof; and
2. selection-identification proof for the claimed estimand.

If layer 1 passes but layer 2 does not:
`ROOT_SPECIFIC_MECHANISM_SUPPORTED_BUT_POPULATION_INCREMENTALITY_NOT_IDENTIFIED`
and effective independent evidence increment = 0.

Second deterministic selection-identification fixture is frozen. Independent logic-mirror validation covered 12 cases and observed:
- observed-subpopulation increment = 0;
- target-population identified increment = 1;
- restricted-support matching-consumer increment = 1;
- restricted-support mismatched-consumer increment = 0;
- positivity failure increment = 0.

No empirical Alpha/incrementality is claimed by either fixture.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
D16 future D03 method/incrementality receipts must satisfy both the prior TI-749~758 method oracle and the TI-769~776 admission-selection firewall. System1 still needs the three explicit diagnostic schema deltas plus a first genuine-session receipt. System2 still needs runtime raw-vs-dedup diagnostics. D03 next independent research path is to freeze how interaction/nonlinear composites are credited after two separately proven roots, so a P×V interaction cannot become a third evidence unit unless a preregistered interaction estimand proves value beyond both main effects. Protected PR #600/Bollinger/ADX path remains owner-gated and separate.


## TI-777 through TI-794 — interaction increment evidence accounting guard (2026-10-06)

Canonical artifacts:
- `research/D03_INTERACTION_INCREMENT_EVIDENCE_ACCOUNTING_GUARD_20261006_V0_1.md`;
- `research/d03_interaction_increment_evidence_accounting_guard_20261006_v0_1.json`;
- `research/test_d03_interaction_increment_evidence_accounting_v0_1.mjs`;
- `research/d03_interaction_increment_acceptance_receipt_20261006_v0_1.json`.

### TI-777 — source roots and interaction increments are separate
An interaction does not create a new information source. Machine accounting must separate `effectiveIndependentSourceRootCount`, `provenInteractionIncrementCount` and `effectiveEvidenceCount`.

Two accepted roots P/V without an interaction remain 2 effective evidence units. A fully proven preregistered interaction may add one residual interaction increment so effective evidence may reach 3 while independent source-root count remains 2.

### TI-778 — third-unit hierarchy
This contract governs third-unit eligibility only after both component/root families are already accepted for the same consumer scope. Interactions can be studied earlier but cannot claim the third unit until both exact component versions/evidence receipts are bound.

### TI-779 — both-main-effects baseline is mandatory
The interaction must be tested against a baseline already containing both component main effects. Price-only, volume-only, omitted-component or weaker historical baselines cannot prove interaction incrementality.

### TI-780 — nonlinear marginal misspecification firewall
A product/AND/ratio/joint state can appear useful because the main-effect model is too rigid. D16 must freeze an adequate flexible marginal/main-effect control decision or justify why the frozen main-effect representation is the intended estimand. If the apparent interaction disappears under adequate marginal controls, classify `MAIN_EFFECT_MISSPECIFICATION_NOT_INTERACTION` and grant no increment.

### TI-781 — representation variants remain one family
Product, logical AND, ratio, thresholded joint state, quadrant/cell labels, percentile/z-score/sign interactions and acceptance/crossover labels from the same primitives remain one interaction family unless a genuinely distinct preregistered mechanism is established.

### TI-782 — one increment cap per interaction family
Successful aliases/parameterizations cannot multiply interaction evidence. One frozen component-pair mechanism family contributes at most +1. A second interaction increment requires a distinct non-duplicative preregistered mechanism plus separate D16 multiplicity accounting.

### TI-783 — joint support is stricter than marginal support
Adequate support for P and V separately does not establish support for P×V. Interaction graduation requires exact common support plus joint-state/design support and positivity. Sparse/near-zero joint regions cannot be repaired with extreme weights and then treated as identified.

### TI-784 — interaction clock follows the latest component
`interactionFirstObservableAt >= max(componentFirstObservableAt)`.
Cross-timeframe finality remains binding. An interaction cannot use a component final state before that state was actually observable.

### TI-785 — proof scope cannot exceed population/support scope
Interaction proof inherits target/admitted population, restricted-support, admission lineage, positivity, evaluation cutoff and weighting/imputation semantics. Observed-subpopulation-only or support-mismatched proof cannot become a global third unit.

### TI-786 — multiplicity includes interaction search
Component pair, direction, algebraic form, thresholds, windows, smoothing, lifecycle encoding, horizon, subgroup/regime and selection/cost assumptions remain one search family where explored. Failed/null/inconclusive variants stay in history.

### TI-787 — mandatory falsifiers
Interaction proof must survive both-main-effects comparison, flexible marginal sensitivity where applicable, date-aware inference, leave-one-date sensitivity, concentration diagnostics, valid PIT-safe permutation/shuffle controls, coverage/opportunity checks and cost/fillability stress when selection changes.

### TI-788 — explicit accounting policy
V0.1 freezes:
`MAIN_EFFECTS_PLUS_ONE_RESIDUAL_INTERACTION_CAP`.

Accepted main-effect units remain; one proven residual interaction family may add at most +1; parent composite and duplicated interaction labels add +0. Silent replacement/triple counting is forbidden.

### TI-789 — interaction is not an independent source
Even after proof:
allowed = `RESIDUAL_INTERACTION_INCREMENT_PROVEN`;
forbidden for the interaction itself = `INDEPENDENT_SOURCE_PROVEN`.

Useful nonlinear structure does not enlarge the information-root ontology.

### TI-790 — parent composite and child interaction cannot both claim the same increment
If a parent price-volume/Bollinger/ADX/oscillator-trend/nested-timeframe composite already embeds the same joint mechanism, one canonical interactionFamilyId owns the residual increment. Parent + child cannot both add +1.

### TI-791 — proof revalidation on semantic drift
Component versions/receipts, interaction formula, main-effect baseline, marginal controls, common/joint support, clock, D16 method, multiplicity, selection scope, outcome family or cost/fillability drift invalidate inherited interaction credit until revalidated.

### TI-792 — interaction credit is consumer-scope bound
Consumer component versions, population/support, clock and interaction mechanism must match the proof. Restricted-support evidence cannot export to unrestricted ranking; daily proof cannot silently become intraday evidence; research evidence cannot mutate Formal ranking without owner approval.

### TI-793 — deterministic fixture frozen
The canonical fixture covers 14 cases, including:
- 2 roots / no interaction -> effective 2;
- 2 roots / one valid interaction -> effective 3 while source-root count stays 2;
- duplicate same-family interaction aliases -> still 3;
- missing component binding, weak main-effect baseline, uncontrolled marginal misspecification, joint-support failure, observed-subpopulation-only scope, restricted-support mismatch, post-outcome retuning, negative-control failure and cost/fillability failure -> no third unit;
- interaction-as-independent-source and pre-component interaction clock -> reject.

This round freezes the executable fixture and contract-semantic acceptance receipt. No repository Node/CI execution receipt is claimed; `repositoryNodeFixtureExecutedInThisRound=false`.

### TI-794 — decision and routing
Frozen decision:
`INTERACTION_THIRD_UNIT = PREREGISTERED_RESIDUAL_INCREMENT_ONLY`.

Examples:
- two accepted roots, no interaction proof => 2;
- two accepted roots + one fully proven canonical interaction family => at most 3;
- two accepted roots + multiple aliases/parameterizations of the same interaction family => still at most 3.

No current interaction is empirically promoted.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw source-version gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
audit the existing D03-10 Bollinger and D03-09 ADX composite mappings against TI-759~794 without redesigning their formulas: identify which components are main effects, which are composite/interaction representations, which baseline controls are required, and whether any current schema could accidentally let component + composite + interaction inflate evidence. D02 price-volume H003 remains producer-owned and is used only as a cross-domain consistency reference. External System1/System2/D16 machine lanes and protected PR #600 path remain independent.



## TI-795 through TI-802 — Bollinger / ADX composite mapping audit (2026-10-06)

Canonical artifacts:
- `research/D03_BOLLINGER_ADX_COMPOSITE_MAPPING_AUDIT_20261006_V0_1.md`;
- `research/d03_bollinger_adx_composite_mapping_cases_20261006_v0_1.json`;
- `research/test_d03_bollinger_adx_composite_mapping_v0_1.mjs`;
- `research/d03_bollinger_adx_composite_mapping_acceptance_receipt_20261006_v0_1.json`.

### TI-795 — registry interpretation
D03-09 and D03-10 parent records correctly preserve PARTIAL_OVERLAP and conservative group-level deduplication. Parent-level lineage is not component incrementality proof.

### TI-796~797 — Bollinger decomposition and anti-stacking
SMA20/close location is the price main effect; rolling dispersion/width is the dispersion/volatility component with D04 dependency; normalized position, touch/break and location×width are composite/interaction representations; squeeze/re-expansion is a path child. Required controls are direct return/MA distance, center state, D04 volatility/ATR/range compression/VCP, Regime, tick/liquidity and continuity.

Current children remain inside RG_D03_VOLATILITY_ENVELOPE and contribute at most one deduplicated family. Future two proven components may reach 2; only one canonical proven interaction may reach 3; the parent envelope and touch/squeeze aliases add 0.

### TI-798~800 — ADX decomposition and anti-stacking
+DM/-DM are directional main effects; TR/ATR is the range/volatility main effect; DI is direction normalized by range; DX is a nonlinear normalized contrast; ADX is Wilder-smoothed strength; threshold/crossover/slope labels are aliases/state transforms.

High ADX is not a bullish direction vote. Required controls include direct trend/MA/path, D04 range/volatility, exact Wilder component lineage, Regime, tick/liquidity, continuity and canonical FULL_REPLAY. Price-only baseline uplift cannot isolate direction×range interaction. All current children remain one conservative parent family.

### TI-801 — shared falsifiers
Direct-price/volatility absorption, sparse joint cells, date/regime concentration, parameter search, walk-forward sign reversal, costs, fillability, limits/suspensions/corporate actions and parent+component+interaction alias inflation are mandatory falsifiers. Missing evidence remains UNKNOWN.

### TI-802 — executable result
Observed:
`status=PASS; cases=12; currentBollingerEffectiveCount=1; currentAdxEffectiveCount=1; futureTwoComponentsNoInteraction=2; futureOneCanonicalInteraction=3; aliasInflationBlocked=true; weakBaselineBlocked=true; formalCoreImpact=NONE_LOCKED; outcomeDataUsed=false`.

The latest canonical TI-777~794 fixture was also executed in this round:
`status=PASS; cases=14; twoRootsNoInteractionEffectiveEvidence=2; twoRootsOneInteractionEffectiveEvidence=3; duplicateAliasEffectiveEvidence=3; sourceRootCountAfterInteraction=2; interactionIncrementCount=1; formalCoreImpact=NONE_LOCKED; outcomeDataUsed=false`.

No formula, weight or threshold changed. No empirical Alpha or promotion is claimed. D03 remains 56.7%; D03-09 and D03-10 remain L2/40; outcomes remain CLOSED; Formal Core remains LOCKED.

Exact next:
freeze the sparse-cell/date-cluster estimability and concentration oracle for future interaction receipts. External System1/System2/D16 and protected PR #600/Bollinger/ADX physical-evidence lanes remain pending.


## TI-803 through TI-852 — interaction estimability, concentration, search genealogy and parameter-family firewall (2026-10-06)

Canonical artifacts:
- `research/D03_INTERACTION_ESTIMABILITY_CONCENTRATION_ORACLE_20261006_V0_1.md`;
- `research/d03_interaction_estimability_concentration_oracle_20261006_v0_1.json`;
- `research/test_d03_interaction_estimability_concentration_oracle_v0_1.mjs`;
- `research/D03_INTERACTION_SEARCH_GENEALOGY_AND_REBIN_FIREWALL_20261006_V0_1.md`;
- `research/d03_interaction_search_genealogy_and_rebin_firewall_20261006_v0_1.json`;
- `research/test_d03_interaction_search_genealogy_and_rebin_firewall_v0_1.mjs`;
- `research/D03_BOLLINGER_ADX_PARAMETER_SEARCH_GENEALOGY_AUDIT_20261006_V0_1.md`;
- `research/d03_interaction_support_search_acceptance_contract_20261006_v0_1.json`;
- `research/test_d03_interaction_support_search_acceptance_contract_v0_1.mjs`;
- `research/d03_interaction_deep_guard_freeze_receipt_20261006_v0_1.json`.

### TI-803 — support is a vector, not a single effective N
Interaction evidence must preserve coverage, independent dates, representation-specific joint/design support, dependence/clusters, concentration/influence, admission/weights, calendar/episode breadth, outcome footprints and consumer scope. Row N, date N, episode N, cluster N or weighted ESS cannot alone represent all evidence support.

### TI-804 — representation class is part of the hypothesis
Primary interaction representation is frozen before target outcome interpretation as categorical joint-cell, continuous, mixed threshold/continuous, or path/lifecycle. Outcome-driven representation switching is a new adaptive family.

### TI-805 — categorical cell universe is append-only
All preregistered cells remain visible, including zero-count cells. Report row/date/symbol/admission/weighted support by cell. An estimand-critical zero cell blocks identification rather than disappearing from the report.

### TI-806 — no universal joint-cell N
D03 does not invent a single minimum cell count for all methods. D16 must freeze a method-specific minimum independent-date floor before target outcomes. Falling below it yields POWER_INSUFFICIENT or JOINT_SUPPORT_INSUFFICIENT, not post-result rebinning.

### TI-807 — continuous interactions require design-support diagnostics
Continuous interaction evidence must report component-range/joint-design coverage, unsupported regions, collinearity, leverage/partial leverage, influence, design-rank identifiability and frozen marginal-control basis. A coefficient driven by extreme points is not rescued by large row N.

### TI-808 — mixed threshold/continuous interactions inherit both support burdens
Threshold-side cell support and continuous-side design/leverage support are both required. One side cannot hide weakness on the other.

### TI-809 — path/lifecycle interactions use episode/transition support
Rows/bars are not independent recurrence. Report decision dates, structural episodes, conservative replication clusters, transitions, right censoring, calendar breadth and outcome-footprint overlap.

### TI-810 — decision date is the first common cross-sectional inference axis
Many symbols on one Taiwan scan date share shocks and cannot manufacture independent experiments. Raw rows and unique symbols remain descriptive; inference remains date/dependence aware.

### TI-811 — effective cluster diagnostics are mandatory
When clustered inference is used, report raw G, effective G*, cluster sizes, leverage/influence and clustering dimensions. D03 inherits D16 governance: G*<20 cannot stand alone as conventional cluster promotion evidence; >=20 is only an eligibility floor and influence/imbalance can still block.

### TI-812 — HAC/block support follows D16 method-specific floors
For HAC, T_eff<20 blocks standalone asymptotic promotion; 20–39 is exploratory/sensitivity absent corroboration; >=40 is only eligible. For temporal block bootstrap, effective blocks <10 are insufficient, 10–19 exploratory, >=20 only eligible. These are governance floors, not universal mathematical discontinuities.

### TI-813 — concentration is a separate evidence axis
Report concentration across dates, clusters/episodes, symbols, sectors, regimes and design regions, plus contribution/influence concentration. No universal concentration cutoff is invented in D03; claim-specific thresholds must be frozen by the D16 method receipt where used.

### TI-814 — leave-one-unit fragility is mandatory
Where support permits, leave-one-date, replication-cluster, sector and regime diagnostics report sign, effect range, rank/order and promotion-state stability. A sign or promotion-state flip from removing one unit routes to CONCENTRATION_FRAGILE.

### TI-815 — claim scope contracts to supported evidence
Narrow evidence becomes SECTOR_CONDITIONAL_OBSERVATION / REGIME_CONDITIONAL_OBSERVATION / PHASE_CONDITIONAL_OBSERVATION rather than a generic market-wide interaction claim.

### TI-816 — weighted support must show effective support
Report sum weights, squared weights, weighted effective support, max/quantile/concentration, zero/near-zero strata and balance. Weighting cannot hide weak positivity, and trimming/overlap weighting changes the support/estimand identity.

### TI-817 — overlapping forward outcomes reduce fresh information
D5/D10/D20 outcome-session overlap and purge/embargo are part of support. Disjoint decision dates with overlapping market-session outcomes do not carry the same fresh information as independent footprints.

### TI-818 — semantic/version breaks cannot be pooled to manufacture N
Known source, factor, session, continuity or consumer-policy breaks require frozen segmentation/break-aware methods or fail closed. Resampling cannot cross known semantic boundaries merely to enlarge support.

### TI-819 — insufficient power/dependence is a valid terminal scientific result
Allowed blocks include POWER_INSUFFICIENT, JOINT_SUPPORT_INSUFFICIENT, DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE, CONCENTRATION_FRAGILE, SELECTION_IDENTIFICATION_BLOCKED and VERSION_OR_CONTINUITY_INCOMPATIBLE. A block does not authorize outcome-driven threshold/window/population repair.

### TI-820 — support oracle decision
`INTERACTION_SUPPORT = MULTI_AXIS_REPRESENTATION_SPECIFIC_FAIL_CLOSED`.
No current D03 interaction receives a third unit.

### TI-821 — interaction search universe has durable identity
Every confirmatory interaction family binds local multiple-testing family, outer research stream or EXPLORATORY_ONLY, component pair, mechanism claim, allowed search axes, birth/retirement policies, representation-change policy, support-only redesign policy and outcome-release boundary.

### TI-822 — candidate variant ledger is append-only
Every threshold/window/horizon/representation candidate keeps immutable birth lineage, support refs, prior outcome-release refs, result state and retirement state. Negative/inconclusive/sparse/retired variants remain visible.

### TI-823 — outcome-blind support redesign is permitted with lineage
A sparse-support design may be revised before target outcomes if only predictor/design/admission information was used, the child points to the parent, the support-selection policy is frozen and candidates remain in the same search genealogy.

### TI-824 — outcome-driven support repair consumes the prior holdout
After any target outcome release, rebinning/window/threshold/representation changes are adaptive. The previous holdout is development-consumed and fresh evidence is required.

### TI-825 — threshold lattice remains one family
Nearby ADX thresholds, Bollinger width quantiles/multipliers, volume thresholds or joint cutpoints do not become fresh independent families simply by renaming.

### TI-826 — horizon lattice remains in multiplicity history
D5/D10/D20 cannot serve as retry buttons. Registered horizons remain one declared family; new post-result horizons inherit adaptive lineage.

### TI-827 — parameter windows/smoothing cannot reset the family
Bollinger center/dispersion windows, ADX Wilder periods/smoothing, MA/EMA lookbacks and participation windows remain candidate axes inside the search genealogy.

### TI-828 — representation switches are explicit adaptive events
Cell, continuous, mixed and path-state switches create new variant versions. Pre-outcome rule-driven switching can remain outcome-blind; post-outcome switching consumes evidence.

### TI-829 — rebinning cannot delete empty/losing cells
Original sparse/zero cell universes remain in history. New binning is a child candidate, never a retroactive rewrite of the ex-ante design.

### TI-830 — support-quality selection is still candidate selection
Choosing a candidate by cell N, balance, G*, leverage, positivity or weight concentration can be valid only under a frozen deterministic support-selection policy with candidate-set and tie-break identities.

### TI-831 — winner selection period is not untouched confirmation
When economic outcomes select the winning interaction variant, the selection period is development-consumed. Fresh post-selection evidence or a preregistered valid selective-inference design is required.

### TI-832 — local and outer multiplicity remain distinct
A valid local interaction family does not establish whole-program error control. Future confirmatory D03 interaction work binds both multipleTestingFamilyId and D16 researchStreamId/error objective or stays exploratory.

### TI-833 — adaptive hypothesis birth is allowed but must be labeled
A new mechanism inspired by prior results can be researched, but parent result lineage, information known at birth, family relationship and outer-stream treatment must be durable.

### TI-834 — pre-outcome support-blocked candidates remain visible
Sparse/data-quality/method-blocked variants do not consume target outcomes if never inspected, but remain in the candidate ledger.

### TI-835 — outcome-inspected candidates can never be deleted
Every outcome-exposed variant stays in local/outer multiplicity and SDA-016 consumption history despite retirement, supersession or renaming.

### TI-836 — evidence dedup and attempt accounting are different
Equivalent aliases may collapse to one effective evidence family while every actually outcome-tested alias remains visible as a search attempt. Deduplication cannot erase multiplicity history.

### TI-837 — confirmatory winner requires fresh evidence
A third interaction unit requires complete search genealogy, preserved siblings, local and outer multiplicity disposition, no reuse of the selection period as untouched validation, fresh support vector and fresh D16 incrementality evidence.

### TI-838 — search genealogy decision
`INTERACTION_SEARCH_HISTORY = APPEND_ONLY_NO_RESET_NO_REBIN_LAUNDERING`.

### TI-839 — canonical Bollinger remains fixed 20×2
Current formula `BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1` is a fixed research baseline with exact continuity requirements, not a verified winner from parameter optimization.

### TI-840 — canonical ADX remains fixed Wilder 14
Current `WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1` is fixed with explicit smoothing/init semantics and FULL_REPLAY requirement, not a verified optimized winner.

### TI-841 — mentioned values are not automatically outcome-tested attempts
Conventional ADX 20/25/40 values are explicitly descriptive in the existing contract and no threshold sweep is authorized. D03 now distinguishes MENTIONED_ONLY, SUPPORT_EVALUATED_ONLY and OUTCOME_INSPECTED.

### TI-842 — Bollinger future parameter axes belong to one search genealogy
Center lookback/type, dispersion definition, multiplier, width/%B representation, squeeze percentile/lookback/threshold/duration, touch/break/re-entry, sign/lifecycle, comparator set, horizon and subgroup all enter the candidate family if searched.

### TI-843 — ADX future parameter axes belong to one search genealogy
Wilder period/init, level threshold, slope definition/window, DI dominance/crossover/retest, DX/DI transforms, ATR/TR controls, state bins, direction gate, lifecycle, horizon and subgroup are explicit future search axes.

### TI-844 — jointly optimized axes imply a candidate lattice
The actual candidate universe is the set of combinations considered/tested, not the number of reported winning axes. Candidate-set hash must be durable before confirmatory interpretation.

### TI-845 — preregistered funnels may screen pre-outcome without fabricating multiplicity
Formula/mechanics -> support/continuity -> redundancy/main-effect -> outcome funnels may retire candidates before outcomes. Those candidates remain in the ledger but do not consume outcome evidence.

### TI-846 — outcome-blind support selection can choose a canonical test candidate
A frozen support rule may select among pre-outcome candidates using date support, leverage, concentration and continuity. The selected candidate is not an economic-performance winner.

### TI-847 — continuous first-pass reduces arbitrary cutpoint freedom
Continuous ADX, BBW/%B/decomposed location/dispersion remain preferred first redundancy representations before threshold hunting, while nonlinear basis complexity itself remains governed if searched.

### TI-848 — Bollinger touch/squeeze labels share parent lineage
Touch, outside, re-entry, squeeze/expansion/duration are state transforms. They cannot stack as independent evidence, while every outcome-tested label remains visible for search accounting.

### TI-849 — ADX threshold/slope/crossover labels share parent lineage
High/rising/crossing ADX and DI crossover/strength labels remain downstream DMI/ADX transforms with shared search genealogy.

### TI-850 — canonical L3 readiness cannot be repaired by changing formula
Bollinger 20×2 and ADX14 physical readiness are distinct from predictive search. Alternative formulas define new research variants and cannot make a blocked canonical readiness receipt pass.

### TI-851 — current repository shows no verified outcome-driven Bollinger/ADX sweep
Current governed evidence shows fixed canonical baselines, descriptive threshold mentions, explicit no-threshold-sweep rules and closed D03 outcomes. Disposition:
`NO_VERIFIED_OUTCOME_DRIVEN_BOLLINGER_ADX_PARAMETER_SWEEP`.

This does not claim omniscience about ungoverned/off-repo exploration.

### TI-852 — combined receipt binding
New combined contract requires support, search-genealogy and incrementality receipts to bind the same interaction/variant/component pair/formula/parameter set/population/support/horizon/multiplicity/research-stream/method/consumption identity. Receipt drift yields `INTERACTION_ACCEPTANCE_RECEIPT_BINDING_MISMATCH`.

Three executable fixtures are frozen:
- support/concentration: 20 cases;
- search genealogy: 13 cases;
- combined binding: 13 cases;
- total defined cases = 46.

Repository workflow lookup found zero workflow runs for these three new fixture commits. Therefore no Node/CI execution PASS is claimed this round.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw receipt gate remains 2/3;
- outcomes remain CLOSED;
- Formal Core remains LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next:
first re-read System1/System2/D16 machine deltas before adding more semantics. If no external implementation lands, the next independent D03 path is a negative-control/permutation falsification oracle for interaction claims: preserve date/sector/regime dependence while breaking only the claimed component relation, and prevent invalid row-wise shuffles from creating false reassurance. Do not open outcomes. Protected PR #600/Bollinger/ADX physical-readiness lanes remain separate.


## TI-853 through TI-970 — interaction falsification, null replay, null validation and null-of-null calibration (2026-10-06)

Canonical artifacts:
- `research/D03_INTERACTION_NEGATIVE_CONTROL_PERMUTATION_FALSIFICATION_ORACLE_20261006_V0_1.md`;
- `research/d03_interaction_negative_control_permutation_oracle_20261006_v0_1.json`;
- `research/test_d03_interaction_negative_control_permutation_oracle_v0_1.mjs`;
- `research/D03_INDICATOR_SPECIFIC_FALSIFIER_MAPPING_20261006_V0_1.md`;
- `research/d03_indicator_specific_falsifier_mapping_20261006_v0_1.json`;
- `research/test_d03_indicator_specific_falsifier_mapping_v0_1.mjs`;
- `research/D03_PIPELINE_LEVEL_MAX_STATISTIC_NULL_REPLAY_CONTRACT_20261006_V0_1.md`;
- `research/d03_pipeline_level_max_statistic_null_replay_contract_20261006_v0_1.json`;
- `research/test_d03_pipeline_level_max_statistic_null_replay_v0_1.mjs`;
- `research/D03_NULL_GENERATOR_VALIDATION_AND_FALSIFIER_DISAGREEMENT_CONTRACT_20261006_V0_1.md`;
- `research/d03_null_generator_validation_and_falsifier_disagreement_contract_20261006_v0_1.json`;
- `research/test_d03_null_generator_validation_and_falsifier_disagreement_v0_1.mjs`;
- `research/D03_D16_INTERACTION_FALSIFICATION_HANDOFF_ADDENDUM_20261006_V0_1.md`;
- `research/d03_d16_interaction_falsification_method_receipt_schema_20261006_v0_1.json`;
- `research/test_d03_d16_interaction_falsification_method_receipt_v0_1.mjs`;
- `research/D03_FALSIFICATION_NULL_OF_NULL_CALIBRATION_CONTRACT_20261006_V0_1.md`;
- `research/d03_falsification_null_of_null_calibration_contract_20261006_v0_1.json`;
- `research/test_d03_falsification_null_of_null_calibration_v0_1.mjs`.

### TI-853~888 — negative-control / permutation falsification oracle

Frozen decision:
`INTERACTION_FALSIFICATION = LINEAGE_CONSISTENT_DEPENDENCE_PRESERVING_PREREGISTERED_NULLS`.

Key rules:
- primary null is residual interaction absence after preserving both main effects and registered controls, not universal independence;
- naive row-wise shuffling is invalid by default because it destroys date, sector, regime, serial, repeated-symbol and support structure;
- permutation requires explicit exchangeability/randomization or a D16-approved dependence-aware/studentized method;
- conditional permutation/randomization must bind a valid X|Z sampler, outcome-blind sampler selection and misspecification diagnostics;
- derived technical fields sharing primitive ancestry cannot be independently shuffled when doing so creates off-manifold states;
- prefer primitive/root-layer perturbation plus full descendant recomputation when feasible;
- same-root interactions may legitimately have NO_VALID_COMPONENTWISE_PERMUTATION;
- cyclic shifts, phase surrogates and sign flips are null-specific and not generic defaults;
- future/after-cutoff sentinels are leakage alarms only and never candidate signals;
- if observed analysis searched/tuned candidates, the null must replay that search rather than test only the observed winner;
- finite Monte Carlo p-values cannot be zero; plus-one rank form is the default candidate unless D16 freezes another valid method;
- primary and sensitivity falsifiers are preregistered; unresolved same-null contradiction blocks the third unit.

The first falsification fixture defines 21 adversarial cases. No CI/Node run is claimed for this tranche.

### TI-889~904 — indicator-specific falsifier mapping

Frozen mappings:
- Bollinger location×width = SAME_ROOT_PATH_COUPLED;
- ADX direction×range = SAME_ROOT_PATH_COUPLED;
- price×volume = MIXED_ROOT_CONDITIONAL;
- nested timeframe = SHARED_ANCESTRY_CLOCK_COUPLED;
- oscillator×trend = SAME_PRICE_ROOT;
- divergence = PIVOT_CLOCK_LINEAGE_COUPLED.

Consequences:
- Bollinger %B/width componentwise field shuffle is not a valid primary falsifier;
- Bollinger path surrogate must recompute SMA20/popStd20/bands/BBW/%B/touch/re-entry/squeeze descendants;
- ADX +DM/-DM/TR or final ADX field shuffles are invalid primary falsifiers;
- ADX valid path null must recompute full DMI/ADX state with the same FULL_REPLAY semantics;
- price×volume can use a conditional-root falsifier only if volume-price-context dependence, units, liquidity/session, suspension and lineage are preserved;
- raw global volume shuffle is rejected;
- divergence and nested-timeframe nulls must preserve pivot/timeframe observability and ancestry.

The mapping fixture defines 14 adversarial cases.

### TI-905~920 — pipeline-level max/selected-statistic null replay

Frozen:
`FIXED_WINNER_NULL_AFTER_SEARCH = INVALID`.

If the observed claim benefited from candidate/threshold/window/horizon/representation/rank/trading-policy selection, each null draw must replay the same frozen pipeline:
- same candidate universe/policy;
- same support filter;
- same fit/tuning/cross-fitting chronology;
- same selection metric and tie-break;
- same cost/fillability rule where applicable;
- same statistic scale and clock.

The null may choose a different winner.
Null support failures cannot be silently discarded/redrawn.
Observed winner identity cannot constrain the null search unless the target was truly ex-ante fixed.
Search replay does not rescue an invalid null generator.

The pipeline-null fixture defines 15 adversarial cases.

### TI-921~940 — null-generator validation / falsifier disagreement

Frozen:
`NULL_GENERATOR_ACCEPTANCE = TARGET_BREAK_AND_NUISANCE_PRESERVATION_DUAL_GATE`.

A valid null generator must simultaneously:
1. break the claimed target relation; and
2. preserve the nuisance/data-generating structure required by the declared null.

Validation vector includes, where applicable:
- marginal and conditional distributions;
- date/sector/regime/liquidity composition;
- serial dependence/volatility clustering;
- cross-sectional common shocks;
- repeated-symbol structure;
- support/admission/missingness;
- continuity/source version;
- market mechanics.

Under-breaking the target and over-breaking nuisance are both failures.
Good marginal fit cannot substitute for X|Z conditional fit.
Support cannot be artificially improved or degraded under null generation.
Synthetic type-I/power calibration is method evidence only.
Validity and power are separate machine states.
Same-null falsifier contradiction blocks promotion; different-null disagreement is reported null-specifically.

The null-validation fixture defines 15 cases.

### TI-941~950 — D03 -> D16 interaction-falsification handoff addendum

D03 freezes scientific semantics but leaves exact inferential method ownership to D16.

Future D16 method receipt binds interaction/variant/search/root/null/generator/population/support/clock/horizon/multiplicity/research-stream/SDA-016 identities.

Allowed terminal states include:
- FALSIFICATION_METHOD_READY;
- NULL_GENERATOR_NOT_READY;
- NO_VALID_COMPONENTWISE_PERMUTATION;
- NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY;
- CONDITIONAL_NULL_MODEL_UNRELIABLE;
- POWER_INSUFFICIENT;
- JOINT_SUPPORT_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- FALSIFIER_DISAGREEMENT_UNRESOLVED;
- VERSION_INCOMPATIBLE;
- SELECTION_IDENTIFICATION_BLOCKED.

A legitimate blocking state is accepted as a scientific result and does not authorize redesign.
FALSIFICATION_METHOD_READY still does not authorize outcome execution, grant a third unit or change Formal Core.

The D16 falsification-receipt fixture defines 12 cases.

### TI-951~970 — null-of-null synthetic calibration

Frozen:
`FALSIFIER_CALIBRATION = TWO_STAGE_SYNTHETIC_DEVELOPMENT_PLUS_HELD_OUT_AUDIT`.

Synthetic method calibration requires both:
- no-interaction worlds for type-I/directional-error/support behavior;
- injected-interaction worlds for sensitivity/power.

Required no-interaction stress families include:
- correlated main effects with zero residual interaction;
- date common-shock panel;
- serial dependence;
- volatility clustering/regime;
- sector concentration;
- state-dependent admission/missingness;
- same-root deterministic technical indicators;
- mixed-root conditional dependence;
- nonlinear main-effect misspecification;
- full-search-selection zero-interaction;
- sparse-support blocking.

A full candidate zoo must be replayed in at least one no-interaction calibration to test search-adjustment validity.
Calibration development worlds are separate from held-out audit worlds.
If held-out synthetic audit causes method redesign, method version increments and a new audit set is required.
Bad seeds/worlds cannot be deleted or rerun until favorable.
Synthetic pass clears only the method layer and contributes zero market-evidence units.

The null-of-null fixture defines 13 cases.

### External methodology readback

This tranche used Firecrawl under the current global tool policy and reviewed method literature on:
- time-series permutation validity under weak dependence;
- conditional permutation/randomization and X|Z misspecification;
- regression permutation under time dependence;
- finite Monte Carlo permutation p-values;
- interaction/knockoff and conditional-permutation literature;
- surrogate time-series nulls.

These references constrain methodology only; they do not establish Taiwan-stock alpha.

### Execution evidence

New executable fixture counts defined:
- falsification oracle: 21;
- indicator mapping: 14;
- pipeline null replay: 15;
- null-generator validation: 15;
- D16 method receipt: 12;
- null-of-null calibration: 13;
- total = 90 defined cases.

GitHub workflow lookup for all six new fixture commits returned zero workflow runs.
Therefore:
- `CI_EXECUTION_RECEIPT = NONE`;
- `NODE_EXECUTION_PASS_CLAIM = FALSE`.

No empirical outcome was opened or fabricated.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- raw source gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
re-read external System1/System2/D16 machine lanes before further semantic expansion. If no external machine evidence lands, the next independent D03 research path is to freeze a "causal-direction / lead-lag placebo hierarchy" that distinguishes predictive timing from contemporaneous association without permitting future-state leakage; however, semantic research must remain maturity-neutral. The next actual maturity gain must come from genuine prospective/raw-source evidence or external machine implementation/readback.



## TI-971 through TI-978 — interaction-falsification six-fixture execution readback (2026-10-06)

Canonical artifacts:
- `research/D03_INTERACTION_FALSIFICATION_EXECUTION_READBACK_20261006_V0_1.md`;
- `research/d03_interaction_falsification_execution_receipt_20261006_v0_1.json`.

### TI-971 — execution provenance
The six canonical TI-853~970 test blobs and six imported JSON contract blobs were fetched from latest main at `862b8c903e81e0945ba030b396b8a7d661f91f1e`. No test or contract was modified before execution. Every process exited 0. The receipt pins exact repository blob SHAs and observed outputs.

### TI-972 — negative-control/permutation oracle
Observed:
`status=PASS; cases=21; naiveRowShuffleRejected=true; arbitraryDerivedShuffleRejected=true; conditionalMisspecificationBlocks=true; dependenceBreakBlocks=true; lineageRecomputeRequired=true; zeroPermutationPRejected=true; pipelineReplayMismatchBlocks=true; unresolvedFalsifierDisagreementBlocks=true; plusOnePForZeroExceedancesM99=0.01`.

### TI-973 — indicator-specific falsifier mapping
Observed:
`status=PASS; cases=14; bollingerComponentShuffleRejected=true; adxDmTrShuffleRejected=true; rawVolumeGlobalShuffleRejected=true; descendantRecomputeRequired=true; clockContinuitySymmetryRequired=true`.

### TI-974 — pipeline-level null replay
Observed:
`status=PASS; cases=15; fullReplayRequiredAfterSearch=true; fixedCandidateAllowedOnlyWhenActuallyFixed=true; nullCanSelectDifferentWinner=true; supportAndCostSymmetryRequired=true; statisticScaleMustMatch=true; failedNullDrawsRemainVisible=true`.

### TI-975 — null-generator validation/disagreement
Observed:
`status=PASS; cases=15; targetBreakAndNuisancePreservationBothRequired=true; supportInflationAndDegradationBothBlocked=true; conditionalMisspecificationSensitivityRequired=true; validLowPowerFalsifierBlocksStrongInference=true; sameNullContradictionBlocks=true; differentNullDisagreementIsNullSpecific=true`.

### TI-976 — D03-to-D16 falsification method receipt
Observed:
`status=PASS; cases=12; methodReadyStillDoesNotAuthorizeOutcomes=true; legitimateBlockingStatesAccepted=true; invalidReadyReceiptRejected=true; fixedWinnerAfterSearchRejected=true`.

### TI-977 — null-of-null calibration
Observed:
`status=PASS; cases=13; heldOutSyntheticAuditRequired=true; correlatedAndDependentNullWorldCoverageRequired=true; calibrationOverfitGuard=true; syntheticAuditPassMarketEvidenceUnits=0`.

### TI-978 — aggregate interpretation
All six canonical fixtures executed and 90/90 deterministic cases passed. Every fixture reports `outcomeDataUsed=false` and `formalCoreImpact=NONE_LOCKED`.

This closes the repository Node-execution evidence gap recorded at TI-853~970. It does not provide an empirical D16 receipt, Taiwan-market Alpha, prospective power, OOS evidence, transaction-cost evidence or production authority.

Support: prose and executable invariants agree.

Counterevidence: internally consistent synthetic tests can pass while a real empirical null remains unidentified, low-powered or misspecified.

Alternative explanation: the PASS may establish fixture consistency only, not external scientific validity.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
re-read external machine lanes first. If unchanged, freeze a causal-direction / lead-lag placebo hierarchy that separates predictive timing from contemporaneous association while preserving date/sector/regime/symbol dependence and prohibiting future-state leakage. Maturity remains unchanged until genuine prospective/raw-source or external machine evidence arrives.



## TI-979 through TI-1000 — causal-direction / lead-lag placebo hierarchy (2026-10-06)

Canonical artifacts:
- `research/D03_CAUSAL_DIRECTION_LEAD_LAG_PLACEBO_HIERARCHY_20261006_V0_1.md`;
- `research/d03_causal_direction_lead_lag_placebo_cases_20261006_v0_1.json`;
- `research/test_d03_causal_direction_lead_lag_placebo_v0_1.mjs`;
- `research/d03_causal_direction_lead_lag_placebo_acceptance_receipt_20261006_v0_1.json`.

### TI-979 — PIT timing order
Required:
`signalKnownAt <= decisionCutoff < endpointWindowStart <= endpointKnownAt`.
A bar carrying the decision date is unavailable if its state finalized after the cutoff.

### TI-980 — contemporaneous association is not prediction
Same-session indicator/return association may be mechanical because both consume the same OHLC path. It contributes zero predictive evidence unless fully observable before a tradable cutoff and evaluated on a later endpoint.

### TI-981 — preregistered lead-lag ladder
Stale lags, decision-time signal, illegal future leads, contemporaneous endpoint and authorized D5/D10/D20 endpoints form one preregistered multiplicity family. Best-offset selection after outcomes is forbidden.

### TI-982 — future state is diagnostic only
Future X(t+k) is permitted only as an offline leakage sentinel. It cannot be a candidate feature, add evidence, set thresholds, select models or repair weak decision-time evidence. Strong future-lead performance triggers `FUTURE_STATE_LEAKAGE_SUSPECTED` or `TIMING_IDENTITY_UNRESOLVED`.

### TI-983~984 — reverse endpoint and ancestry controls
Past/already-realized endpoints diagnose mechanical ancestry, trend selection and reverse interpretation. Direct returns, MA/trend controls, D01 structure, D04 volatility/range, D18 Regime and overlapping System1/System2 factors remain required. No residual value yields `REDUNDANT_WITH_ANCESTRY`, not BAD.

### TI-985~987 — purge, support and dependence
Purge/embargo covers the maximum forward endpoint plus feature/confirmation footprint. Offset arms use common support. Timing placebos preserve official sessions, date shocks, sector/regime, repeated symbols/episodes, continuity and featureKnownAt. Random rows and calendar-day shifts are invalid.

### TI-988 — multi-timeframe finality
Weekly/Daily/M15 clocks remain separate. Interaction observability is the maximum component firstObservableAt. Incomplete weekly/closing-M15 states and later-confirmed pivots cannot be backdated.

### TI-989~990 — stale variants and symmetry
Offset variants stay one timing/parameter family. Stable stale-lag behavior may support robustness but cannot multiply votes. Lead/lag symmetry triggers unresolved persistence, aggregation or clock-confound states.

### TI-991 — causal-language boundary
Passing the hierarchy supports only PIT-valid predictive incrementality or conditional association. D03 timing tests alone cannot claim treatment or structural causal effects.

### TI-992~994 — state, execution and selection
Regime/liquidity slices are preregistered and require independent-date support. Evaluation begins at the first executable price after signalKnownAt; same-close fill is rejected when the close completed the signal. Null/placebo replay reproduces the full selected offset/horizon/threshold/subgroup pipeline.

### TI-995 — indicator applications
Bollinger same-close %B/touch is contemporaneous unless pre-cutoff; future band states are sentinels. ADX uses canonical Wilder availability and cannot backfill later convergence. KD/RSI/MACD close-finalized states cannot assume same-close fill. Divergence uses confirmedAt, not the pivot date. Multi-timeframe uses latest component finality.

### TI-996~997 — terminal states and receipt fields
Blocking states include CONTEMPORANEOUS_ONLY, REDUNDANT_WITH_ANCESTRY, FUTURE_STATE_LEAKAGE_SUSPECTED, LEAD_LAG_SYMMETRY_UNRESOLVED, TEMPORAL_AGGREGATION_CONFOUND, CLOCK_IDENTITY_INCOMPATIBLE, COMMON_SUPPORT_INSUFFICIENT, POWER_INSUFFICIENT, DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE and COST_OR_FILLABILITY_INVALIDATES.

The machine receipt binds factor/version, signal/cutoff/execution clocks, endpoints, offset family, ancestry baseline, common support, purge, dependence, multiplicity, research stream, selection pipeline, costs and terminal state.

### TI-998 — deterministic oracle
Sixteen adversarial cases cover valid PIT ordering, contemporaneous-only, illegal future feature, future sentinel, reverse overclaim, offset cherry-pick, support mismatch, random split, insufficient purge, calendar shift, premature timeframe, pivot backdating, same-close fill, missing ancestry controls, lead-lag symmetry and insufficient power.

Observed:
`status=PASS; cases=16; validPitOrdering=true; contemporaneousIsNotPredictive=true; futureFeatureRejected=true; futureSentinelDiagnosticOnly=true; offsetPreregistrationRequired=true; commonSupportRequired=true; dependenceAndPurgeRequired=true; multiTimeframeFinalityRequired=true; sameCloseFillRejected=true; ancestryControlsRequired=true; leadLagSymmetryBlocks=true; formalCoreImpact=NONE_LOCKED; outcomeDataUsed=false`.

### TI-999 — support/counterevidence
Support: prediction requires information availability before endpoint and executable entry.
Counterevidence: smoothing/persistent regimes can produce symmetric timing patterns without explicit leakage; symmetry blocks rather than proves misconduct.
Alternatives include price persistence, aggregation, common shocks, uneven support, delayed finality and fill timing.

### TI-1000 — decision
Frozen:
`TIMING_EVIDENCE = PIT_ORDERING_PLUS_DEPENDENCE_PRESERVING_LEAD_LAG_PLACEBO_HIERARCHY`.

No outcomes were opened; no factor was promoted/demoted; D03 remains 56.7%; D03-09/D03-10 remain L2/40; raw gate remains 2/3; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.

Exact next:
re-read external machine lanes first. If unchanged, freeze a consumer-ready timing-receipt schema/mapping for current D03 factor families without changing formulas or Formal behavior. Actual maturity gain still requires genuine prospective/raw-source or external machine evidence.


## TI-1001 through TI-1102 — consumer timing receipts, temporal non-interference, lag-memory falsification and D16 timing handoff (2026-10-06)

Canonical artifacts:
- `research/D03_FACTOR_TIMING_RECEIPT_MAPPING_20261006_V0_1.md`;
- `research/d03_factor_timing_receipt_schema_20261006_v0_1.json`;
- `research/test_d03_factor_timing_receipt_schema_v0_1.mjs`;
- `research/D03_TEMPORAL_NONINTERFERENCE_DIFFERENTIAL_ORACLE_20261006_V0_1.md`;
- `research/d03_temporal_noninterference_differential_oracle_20261006_v0_1.json`;
- `research/test_d03_temporal_noninterference_differential_oracle_v0_1.mjs`;
- `research/D03_LAG_MEMORY_AND_TEMPORAL_AGGREGATION_FALSIFICATION_20261006_V0_1.md`;
- `research/d03_lag_memory_aggregation_falsification_20261006_v0_1.json`;
- `research/test_d03_lag_memory_aggregation_falsification_v0_1.mjs`;
- `research/D03_D16_TIMING_METHOD_HANDOFF_ADDENDUM_20261006_V0_1.md`;
- `research/d03_d16_timing_method_receipt_schema_20261006_v0_1.json`;
- `research/test_d03_d16_timing_method_receipt_v0_1.mjs`;
- `research/d03_timing_deep_execution_receipt_20261006_v0_1.json`;
- `research/D03_TIMING_DEEP_EXECUTION_READBACK_20261006_V0_1.md`.

### TI-1001~1022 — consumer-ready factor timing receipts

D03 timing is now factor-specific rather than one generic clock.

Profiles:
- D03-01/02/03/06/07/08 = completed-session daily profile;
- D03-09 = completed-session + FULL_REPLAY/trusted-state certification;
- D03-10 = completed-session + exact 20 eligible-session continuity;
- D03-04 = OUTCOME_RELATION_NOT_SIGNAL;
- D03-05 = causal episode confirmation clock;
- D03-12 = firstObservableAt / confirmed divergence clock;
- D03-13 = max(required component known-at) across timeframe finality.

Every consumer-ready timing receipt binds:
factor/version, timing profile, lineage/redundancy/parameter family, source lineage, consumer scope, signal-known/decision/execution clocks, legal/nonfuture offset family, ancestry baseline, common support, purge/embargo, dependence method, multiplicity family, research stream, selection pipeline and cost/fillability.

Future offsets are sentinel-only.
Same-close execution is forbidden for close-finalized factors.
D03-04 is explicitly barred from System1/System2 predictor use.

### TI-1023~1046 — temporal non-interference differential oracle

Frozen:
`TEMPORAL_NONINTERFERENCE = TWO_RUN_FUTURE_PERTURBATION_AGREEMENT`.

At fixed decision epoch T:
- World A and World B share the exact authorized information prefix through T;
- only post-T information may differ;
- semantic decision outputs at T must remain identical.

Registered future perturbations cover:
- outcomes;
- future price path;
- rolling-window future input;
- same-date later cross-section members;
- universe/survivorship;
- corporate actions;
- source corrections;
- calendar revisions;
- cache state;
- model training data;
- hyperparameter labels;
- regime inputs;
- pivot confirmation;
- higher-timeframe completion;
- provisional-to-final evolution.

Detected failure states include:
OUTCOME_TO_FEATURE_LEAKAGE, FUTURE_CACHE_STATE_CONTAMINATION, FUTURE_CORPORATE_ACTION_REWRITE, FUTURE_VERSION_REWRITE, FUTURE_UNIVERSE_SURVIVORSHIP_LEAK, FUTURE_NORMALIZATION_LEAK, FUTURE_REGIME_LABEL_LEAK and FINALITY_BACKFILL_LEAK.

Passing finite sentinels proves only registered channels are clear, not universal leak-freedom.

### TI-1047~1074 — lag-memory / temporal-aggregation falsification

Frozen:
`OBSERVED_LAG = MARKET_DYNAMIC_PLUS_FACTOR_MEMORY_PLUS_AGGREGATION`.

Technical-indicator lag peaks are not interpreted as market reaction delay until factor memory and aggregation are controlled.

Key mapping:
- finite-window overlap: returns/Bollinger;
- recursive IIR memory: MA/RSI/MACD/ADX;
- KD = hybrid finite-window + recursive;
- pullback/divergence = episode/path confirmation;
- D03-13 = nested timeframe aggregation/finality.

Required lag diagnostics:
- lag correlation/collinearity;
- leave-one-lag-out stability;
- peak set/plateau width;
- neighboring-lag uncertainty;
- raw-root residual control;
- outcome-footprint overlap;
- date/regime concentration.

Boundary peak => BOUNDARY_PEAK_SEARCH_INCOMPLETE.
Broad plateau => PERSISTENT_PLATEAU.
Filtered effect absorbed by raw root => RAW_ROOT_EXPLAINS_EFFECT.
Generic Granger/VAR direction on filtered/downsampled indicators is not accepted without representation-valid method support.

### TI-1075~1094 — D03 -> D16 timing method handoff

D03 owns timing semantics.
D16 owns the inferential method.

Future D16 timing receipt must bind:
- exact factor/timing profile;
- factor timing receipt;
- lineage registry;
- signal/decision/execution clocks;
- legal lag family;
- population/common support/consumer scope;
- temporal-noninterference evidence;
- memory class/replay version;
- raw-root controls;
- lag candidate set;
- temporal aggregation;
- lag correlation and outcome-overlap diagnostics;
- multiplicity family/research stream/selection pipeline/SDA-016/holdout;
- dependence and cost/fillability method.

Valid blocking states are accepted scientific results and do not authorize redesign.
TIMING_METHOD_READY still does not authorize outcome execution, prove predictive incrementality, identify an exact lag, establish structural causality or modify Formal Core.

### TI-1095~1102 — exact-SHA canonical Node execution readback

Pinned source main:
`0d1a4fae2a5a59ede2f046188ba6ccc5a66108db`.

Execution:
`FIRECRAWL_INTERACT_BASH_NODE_EXACT_SHA_PINNED_RAW_BLOBS`.

Four exact canonical tests fetched directly from the pinned SHA all exited 0 and emitted PASS:

1. factor timing receipt:
registered modules 12, ready predictor profiles 11, D03-04 outcome relation 1, adversarial cases 18.

2. temporal non-interference:
13 core adversarial cases, 15 perturbation families, 34 reported checks.

3. lag-memory/aggregation:
12 registered factors, 10 adversarial cases, 26 reported checks.

4. D16 timing receipt:
1 ready case, 11 accepted blocking states, 2 D03-04 guards, 10 adversarial READY rejections, 24 total cases.

Heterogeneous reported check/case units = 114.
This is execution accounting only, not effective N, market evidence, independent evidence count or alpha score.

All report outcomeDataUsed=false and Formal Core NONE_LOCKED.

Exact hashes and outputs are in:
`research/d03_timing_deep_execution_receipt_20261006_v0_1.json`.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
re-read latest System1/System2/D16 machine lanes. If implementation/evidence has landed, do incremental readback only. Actual maturity gain must come from genuine prospective/raw-source or external machine evidence. If all external lanes remain blocked, any further D03 timing research should be narrowly limited to decision-boundary/execution-clock sensitivity rather than indefinitely expanding governance.


## TI-1103 through TI-1134 — decision-boundary / execution-clock sensitivity (2026-10-06)

Canonical artifacts:
- `research/D03_DECISION_BOUNDARY_EXECUTION_CLOCK_SENSITIVITY_20261006_V0_1.md`;
- `research/d03_execution_clock_sensitivity_schema_20261006_v0_1.json`;
- `research/test_d03_execution_clock_sensitivity_v0_1.mjs`;
- `research/d03_execution_clock_sensitivity_receipt_20261006_v0_1.json`.

### TI-1103~1128 — execution-clock semantics refinement

The earlier shorthand `sameCloseFill=true` is narrowed to:
`SAME_CLOSING_AUCTION_FILL_USING_CLOSE_THAT_FINALIZED_SIGNAL`.

Frozen:
- a signal requiring the official final close cannot fill the same closing auction that creates that close;
- the same numerical closing price at a later causal venue may be valid if the signal was already known before order submission;
- later same-price execution is not automatically look-ahead;
- fill probability/quantity/venue eligibility remain separate gates.

Execution paths are now distinguished:
- TWSE closing call auction;
- post-close board-lot fixed-price venue;
- after-market odd-lot venue;
- next-session opening call;
- next-session first executable continuous path.

Board-lot fixed-price and odd-lot paths are not interchangeable.
No-fill is not zero return.
Partial fill uses executed quantity.
Fallback between venues/clocks must be preregistered.
Selecting the best execution clock after outcomes consumes execution-policy/multiplicity budget.

A close-finalized factor's generic deployable baseline remains the next-session executable path unless a separately valid post-close venue path is explicitly modeled.

### TI-1129 — precise same-price semantics

`EXECUTION_PRICE == OFFICIAL_CLOSE` does not identify the execution clock.

Required distinction:
- `SAME_AUCTION_LOOKAHEAD_FILL` => invalid for close-finalized signal;
- `SAME_PRICE_LATER_CLOCK` => potentially valid with venue/fill gates.

### TI-1130 — security-level finality matters

Hardcoding 13:30 as the factor-known time is insufficient when a security's close is delayed.

The research clock follows actual security-level finality/source availability.

### TI-1131 — venue support is part of common support

Any post-close fixed-price or odd-lot study must preserve the denominator:
venue eligibility, valid close, trading-unit compatibility and fill-data availability.

Easy-to-fill subsets cannot represent all D03 candidates.

### TI-1132 — exact-SHA execution falsified three implementation defects before PASS

Canonical execution was attempted against pinned repository SHAs.

Attempt 1:
- SHA `ecc5e3bea22e123469a9b70898a0b0597c49438c`;
- failed parse because one next-open assert missed a right parenthesis.

Attempt 2:
- SHA `00c733e4f703810d1aa7513ed1c08db0cc4d0521`;
- parsed but exposed a clock bug: HH:MM-only comparison treated next-day 08:45 as earlier than prior-day 13:35.

Attempt 3:
- SHA `7b46ff12a104ccd9356a94da440dc59fd24d1cbf`;
- exposed a refactor residue: local-window branch still referenced removed `known`.

All three were fixed before any PASS claim.

### TI-1133 — canonical execution PASS

Final pinned source:
`9dc014a8da402afa65cb0426e172f99e2320e2e5`.

Observed:
`status=PASS; cases=17; sameClosingAuctionLookaheadBlocked=true; sameNumericalCloseLaterVenueCanBeCausal=true; postCloseFillNotGuaranteed=true; boardLotOddLotSeparated=true; noClosingPriceBlocksFixedPrice=true; lateFinalityRoutesNextSession=true; noFillNotZeroReturn=true; partialFillExplicit=true; executionPolicySearchControlled=true; marketRuleVersionBound=true; formalCoreImpact=NONE_LOCKED; outcomeDataUsed=false`.

Exact hashes are stored in:
`research/d03_execution_clock_sensitivity_receipt_20261006_v0_1.json`.

### TI-1134 — evidence boundary

This tranche validates execution-clock semantics and fixture mechanics only.

It does not establish:
- actual fill rates;
- empirical after-hours slippage;
- Taiwan-stock alpha;
- optimal venue;
- production execution policy;
- Formal behavior change.

Market evidence units added = 0.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
re-read System1/System2/D16 and raw-source/prospective lanes. If no external evidence lands, stop expanding timing governance and wait for/route actual machine evidence; only perform a new D03 semantic tranche when a concrete implementation or evidence receipt exposes a new ambiguity.


## TI-1135 through TI-1146 — external machine delta readback (2026-10-06)

Canonical artifacts:
- `research/D03_EXTERNAL_MACHINE_DELTA_READBACK_20261006_V0_1.md`;
- `research/d03_external_machine_delta_readback_20261006_v0_1.json`;
- `research/test_d03_external_machine_delta_readback_v0_1.mjs`;
- `research/d03_external_machine_delta_execution_receipt_20261006_v0_1.json`.

### TI-1135~1139 — System2 current-session freshness physically accepted

D03 accepts System2 correction `S2-CORR-20261006-004` as a genuine external implementation delta.

Independent verification:
`system2/evidence/s2_corr_20261006_004_independent_verification.json`
reports `VERIFIED_CLOSED`.

Accepted facts:
- current-session resonance is bound to current Asia/Taipei marketDate;
- prior-session fallback is blocked from current terminal surfaces;
- explicit historical queries remain available;
- latest-any-date history is visibly marked;
- session-date mismatch fails closed;
- decision/chart session provenance is visible;
- same-session resonance remains functional;
- protected authorities remain unchanged.

Physical evidence recorded by the independent auditor:
- System2 Research CI 37472705542 PASS;
- V8 Regression 37472705541 PASS;
- merged-main System2 Research CI 37473038918 PASS;
- System2 Daily Resonance Deploy 37473038743 PASS.

D03 disposition:
`SYSTEM2_CURRENT_SESSION_STALE_RESONANCE_CONTAMINATION = CLOSED_FOR_THIS_CONSUMER_PATH`.

This materially satisfies a bounded subset of the D03 timing/temporal-noninterference consumer requirements.

### TI-1140~1142 — D03 dedup remains unimplemented

The accepted freshness correction did not add D03 raw-vs-deduplicated evidence diagnostics.

Still missing in the current daily resonance runtime:
- rawSignalCount;
- dedupedEvidenceFamilyCount;
- effectiveIndependentEvidenceCount;
- overlappingSignalIds;
- redundancyGroupContributions;
- dominantInformationRoots;
- explicit RG_D03_PRICE_TREND runtime contribution.

Therefore:
`SEMANTIC_GUARD_PRESENT_RUNTIME_DEDUP_DIAGNOSTICS_MISSING`
remains correct.

SDA-001 and SDA-004 remain REMEDIATION_IN_PROGRESS.
The three resonance conditions still map to one PRICE_OHLC / RG_D03_PRICE_TREND family absent D16 residual proof.

### TI-1143 — System1 SDA-022 5/5 is not D03 lineage closure

System1 policy-fingerprint acceptance:
`shared-knowledge/sda022_system1_fingerprint_acceptance_20261006_v0_1.json`
is a real 5/5 PASS for SDA-022 policy identity/observability.

Its scope is explicitly:
`SYSTEM1_POLICY_FINGERPRINT_ONLY`.

It does not implement:
- redundancyGroupContributions;
- dominantInformationRoots;
- D03 effective same-root evidence accounting.

Frozen anti-miscredit rule:
`SDA022_SYSTEM1_PASS != SDA001_SDA004_SYSTEM1_DEDUP_PASS`.

### TI-1144 — D16 SDA-022 prereg is not the D03 method receipt

D16 now has a valid cross-system SDA-022 D5 preregistration / exploratory outer-stream enrollment.

That experiment is distinct from D03 TI-005/TI-006 and does not satisfy:
- KD-vs-RSI D03 method receipt;
- MACD-vs-trend D03 method receipt;
- D03 interaction/falsification/timing receipt;
- SDA-001/004 D16 closure.

Canonical D03 handoff still reports:
`d16MethodReceipt = NOT_YET_RETURNED`.

### TI-1145 — raw/prospective gate remains unchanged

Current D03/D16 handoff remains:
- rawSourceVersionGate = 2_OF_3;
- technicalObserverR1 = BLOCKED;
- outcomes = CLOSED;
- formalOptimizationCandidate = NONE.

System2 historical-data progress is not silently reused as D03 observer readiness.

### TI-1146 — exact-SHA execution readback

Pinned source main:
`4a3073baec5f11bde9de0246a52472e45af4d87c`.

Canonical Node fixture PASS / exitCode 0.

Observed:
- System2 freshness physical verification accepted = true;
- System2 freshness CI PASS count = 4;
- System2 D03 dedup diagnostics still missing = 7;
- System1 D03 redundancy diagnostics still missing = 2;
- System1 SDA-022 not credited to D03 = true;
- D16 SDA-022 not credited to D03 = true;
- raw source gate = 2_OF_3;
- technicalObserverR1 = BLOCKED;
- outcomes = CLOSED;
- D03 = 56.7%.

Exact hashes:
- schema: `fab50b0c2412f75cd9051ffc1670344a0978a1f588b1d0c955b516608a95f70f`;
- fixture: `3aa2e29f80e151f24d0c299b1e35ab738a9cff945c62ab23340fdad503499825`.

No maturity promotion:
- D03 remains 56.7%;
- D03-09/D03-10 remain L2/40;
- outcomes remain CLOSED;
- Formal Core remains LOCKED.

Exact next:
wait for one of the actual external blockers to change: System2 D03 dedup diagnostics, System1 D03 redundancy diagnostics, D16 D03 method/incrementality receipt, raw-source/prospective observer gate, or protected cutoff-bearing parent path. Do not manufacture progress from additional semantic governance while all five remain blocked.


## 2026-10-07 D03 — TI-1189~1194 canonical same-parent admission execution PASS

- Canonical repository-native GitHub Actions execution is now complete for:
  - `research/d03_adx_bollinger_same_parent_admission_matrix_20261006_v0_1.json`;
  - `research/test_d03_adx_bollinger_same_parent_admission_matrix_v0_1.mjs`.
- Workflow: `D03 ADX Bollinger Same-Parent Admission Readonly`.
- Run: `37493819432`, run #1, head `ee3893e6c6c44ff3d845983ec9e9fc8bfdd41cfa`.
- Job: `112373110655`.
- Node: `22.23.3`.
- Canonical output:
  - status PASS;
  - fieldCount 15;
  - sameParentProjected 4;
  - conditionalParentOnly 2;
  - replayCertificationRequired 2;
  - zeroNewOrdinaryDailyProviderCallDefault true;
  - maturityPct 56.7;
  - Formal Core NONE_LOCKED.
- Isolation guard PASS:
  - no fetch/provider calls;
  - no database writes;
  - no deployment;
  - no push/trade path.
- Durable receipt:
  - `research/d03_adx_bollinger_same_parent_admission_execution_receipt_20261007_v0_1.json`.
- This closes only the pending canonical-execution proof gap for the admission matrix.
- It does NOT create market outcome evidence, alpha evidence, or a new independent information root.
- Five external blockers remain unchanged.
- D03 remains 56.7%; D03-09/D03-10 remain L2/40; raw gate 2/3; technicalObserverR1 BLOCKED; outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
Re-read the five external blockers. If unchanged, do not open a new semantic/governance tranche. The next legitimate D03 progress must consume a newly landed System2 dedup receipt, System1 redundancy receipt, D16 D03 method/incrementality receipt, raw-source observer receipt, or genuine cutoff-bearing C1 parent through the already-frozen acceptance oracles.

## TI-1195 through TI-1204 — System2 S2-07 bounded technical-continuity incremental readback (2026-10-07)

Canonical artifacts:
- `research/D03_SYSTEM2_S207_TECHNICAL_CONTINUITY_READBACK_20261007_V0_1.md`;
- `research/d03_system2_s207_technical_continuity_readback_20261007_v0_1.json`;
- `research/test_d03_system2_s207_technical_continuity_readback_v0_1.mjs`.

### TI-1195~1197 — one physical corporate-action boundary is mechanically reconciled

System2 workflow run `37498936053`, job `112390610918`, exact head `90977b9caed9b3c76b96ac447a3be3d231a416b4`, completed SUCCESS.

For TPEX 4806 / capital reduction:
- official pre-action close = 10.4;
- official resume reference price = 14.87;
- official ratio = 1.4298076923076921;
- transformed pre-suspension close = 14.87;
- resume RAW open = 13.7;
- resume RAW close = 13.4;
- residual open gap = -7.8681909886%;
- residual close move = -9.8856758574%.

The mechanical reference-price reset is separable from residual observed movement without mutating RAW history or persisting adjusted history.

### TI-1198~1200 — PIT replay remains blocked

The official event has:
- `knowledgeTimeMode=HISTORICAL_UNKNOWN`;
- `firstKnownAt=null`;
- `availableAt=null`;
- `pitEventReplayEligible=false`.

Therefore the accepted state is:
`BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED`.

Frozen anti-backfill rule:
current retrieval of an official historical event cannot be backdated into the 2026-10-02 decision clock.

### TI-1201~1203 — support, counterevidence and bias boundary

Support:
- exact official reference pair and two RAW boundary bars physically reconcile;
- dedicated tests, physical probe, read-only guard and System1 isolation pass;
- rows written = 0.

Counterevidence / alternative explanation:
- one positive lineage case is selection-conditioned and cannot certify the other blocked cases;
- one event date cannot establish all-history continuity;
- residual movement is descriptive and not ADX, Bollinger, momentum, reversal or alpha evidence;
- no outcome, threshold, factor fit or independent information root was created.

Validation disposition:
- PIT = BLOCKED fail-closed;
- OOS / walk-forward = UNKNOWN, not opened;
- selection bias = one V1.0-positive lineage case;
- look-ahead = blocked from replay;
- multiple testing / overfitting = no outcome fit performed;
- date clustering = single event date;
- cost, fillability and market-state dependence = UNKNOWN.

### TI-1204 — maturity and routing decision

This narrows one continuity blocker from unknown price geometry to unknown historical availability clock, but does not close the D03 raw-source/prospective observer gate.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source/version gate remains 2/3;
- technicalObserverR1 remains BLOCKED;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
consume only a prospectively timestamped official-event version whose `firstKnownAt` / `availableAt` precede the decision cutoff, then bind it to a genuine cutoff-bearing parent and complete expected-parent reconciliation. Do not generalize the 4806 event-boundary bridge to all-history technical continuity. The other four external blockers remain unchanged.

## TI-1205 through TI-1214 — exact reference-event historical availability negative gate (2026-10-07)

Canonical artifacts:
- `research/D03_SYSTEM2_S207_REFERENCE_AVAILABILITY_NEGATIVE_READBACK_20261007_V0_1.md`;
- `research/d03_system2_s207_reference_availability_negative_readback_20261007_v0_1.json`;
- `research/test_d03_system2_s207_reference_availability_negative_readback_v0_1.mjs`.

### TI-1205~1207 — exact event identity and semantic episode are bounded

System2 dedicated workflow `37538083182`, job `112524054856`, exact head `777b5876917774a5ad4c32eac3e563df2b3acfe5`, completed SUCCESS. System2 Research CI `37538083135` also completed SUCCESS.

Pinned event:
- TPEX 4806 / capital reduction / effective 2026-10-02;
- replay cutoff = 2026-10-02T15:30:00+08:00;
- observation eventVersionId from physical receipt = `S2-CA-EVENT:82da757e780d7be2c3474f5ca505d385b55705d44b520f291dc7383f88c391ca`;
- stable semanticHash = `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`;
- stable sourceRowHash = `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b`;
- observationVersionIdUsedAsStableIdentity = false.

Observed MOPS evidence:
- family rows = 18;
- bounded semantic-episode rows = 8;
- source-reported-clock eligible rows = 8;
- retrospective-only rows = 8.

### TI-1208~1210 — historical display time is not exact public availability

All eight bounded rows preserve issuer disclosure chronology, but:
- independent exact-version availability evidence count = 0;
- independently ready evidence count = 0;
- winning evidence = null;
- firstKnownAt = null;
- availableAt = null;
- pitEventReplayEligible = false.

Accepted state:
`REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN`.

Accepted blocker:
`OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN`.

Frozen anti-look-ahead rules:
- source-reported timestamp cannot be promoted to public availableAt;
- retrospective readback cannot become firstObservedAt;
- MOPS episode chronology cannot certify availability of the stable TPEx semantic/source-row identity without explicit linkage;
- a post-cutoff observer cannot prove pre-cutoff availability.

### TI-1211~1213 — support, counterevidence and validation boundary

Support:
- the same capital-reduction episode is physically present and source clocks are parseable;
- stable exchange reference-event semantic/source-row identity is pinned, while observation eventVersionId is not a stable cross-fetch identity;
- dedicated tests, physical probe and isolation guards pass.

Counterevidence / alternative explanation:
- issuer disclosure chronology proves the corporate-action episode existed, not the availability time of the exact exchange reference-price row;
- one selected positive lineage case cannot generalize to other events or all-history continuity;
- no OOS, walk-forward, cost, fillability, market-state or alpha evidence exists;
- no new independent information root is created.

Repository-wide V8 Regression run `37538083218` failed at `tests/test_sda016_formal_c1_binding_governance_sync_v0_1.mjs`, which expected `V0_5_58_TEST_ORACLE`. This is a cross-lane SDA-016 governance-sync assertion, not a V1.2 dedicated-test failure. The merged-main dedicated run `37538787809` and merged-main System2 Research CI `37538787638` both passed after the physical receipt froze the stable semantic/source-row identity. D03 accepts only the bounded dedicated negative-gate evidence and does not call the earlier repository regression green.

### TI-1214 — maturity and stop rule

This closes the question “can existing historical MOPS display clocks prove exact TPEx reference-event public availability?” with a negative answer for the bounded 4806 case. It does not close the raw-source/prospective observer gate.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source/version gate remains 2/3;
- technicalObserverR1 remains BLOCKED;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
stop blind historical-clock promotion attempts for this bounded event. Reopen only if independent evidence binds the stable TPEx semanticHash and sourceRowHash to a genuine prospective observation or authoritative publication-time contract no later than the replay cutoff. Observation eventVersionId must not be used as stable cross-fetch identity. Continue waiting for System2 D03 dedup diagnostics, System1 D03 redundancy diagnostics, D16 D03 method/incrementality receipts and the protected cutoff-bearing parent path.


## TI-1215 through TI-1226 — S2-07 V1.6 prospective exact-version membership-drift gate (2026-10-07)

Canonical artifacts:
- `research/D03_SYSTEM2_S207_MOPS_MEMBERSHIP_DRIFT_READBACK_20261007_V0_1.md`;
- `research/d03_system2_s207_mops_membership_drift_readback_20261007_v0_1.json`;
- `research/test_d03_system2_s207_mops_membership_drift_readback_v0_1.mjs`.

### TI-1215~1217 — genuine prospective observation layer accepted

System2 V1.6 merge `bc405245870d6e986cbbf709562ce93c320bb327` establishes stock-code-scoped exact-version observations for a frozen 23-event / 23-symbol universe. Dedicated workflow `37548011614` / job `112556594405`, System2 Research CI `37548011621` and V8 Regression `37548011620` all completed SUCCESS.

Latest physical capture:
- stable semantic event-universe hash = `b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0`;
- 161 global exact-version keys;
- 23/23 frozen symbols covered;
- 21/23 annual/month-query exact events;
- source-clock key collisions = 0;
- common exact-version payload mutation count = 0.

This is accepted as a genuine prospective observation layer. It is not accepted as historical pre-cutoff availability proof for earlier decisions.

### TI-1218~1220 — repeated-capture membership instability falsifies single-capture completeness

Earlier successful run `37547303476` observed 159 versions and 17/23 exact events. The latest run observed 161 versions and 21/23 exact events. Across the two runs, the latest gained 9 version identities and lost 7; common payload mutations remained 0.

Accepted distinction:
- exact-version payload identity is stable conditional on a version being returned;
- historical query membership is not stable;
- absence in one capture is not proof of nonexistence;
- a single successful capture cannot certify the complete expected MOPS keyset.

Symbol 4806 appears among the earlier annual/month-query divergent symbols. Its prospective observation does not retroactively prove availability by the 2026-10-02 replay cutoff.

### TI-1221~1224 — PIT, bias and incrementality boundary

- PIT: preserve the earliest genuine observed-at as an upper bound; never overwrite it with a later run and never backdate it.
- OOS / walk-forward: UNKNOWN; two captures minutes apart on one date are not independent-date validation.
- Selection bias: the 23-event low-volume universe is frozen but not a random market-wide sample.
- Look-ahead: retrospective source clocks and later prospective observations cannot prove earlier availability.
- Multiple testing / overfitting: no outcome, threshold, weight or factor fit.
- Factor redundancy: provenance-only evidence; no independent alpha root and no indicator-versus-price incrementality claim.
- Cost, fillability and market-state dependence: UNKNOWN.

The newly added 2021 TPEx revision-recovery workflow is engineering capability only at this checkpoint. It is not credited until a physical run and immutable receipt exist, and even then it must be evaluated as source/revision lineage rather than technical-indicator alpha.

### TI-1225~1226 — maturity and next gate

Remaining false gates:
- `sourceSemanticsCertified=false`;
- `monthShardCoverageComplete=false`;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source/version gate remains 2/3;
- technicalObserverR1 remains BLOCKED;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
require repeated-capture exact-version union/stability reconciliation with immutable earliest-observed preservation and query-path classification. Only after bounded stabilization may the union bind to the source-lane manifest and pre-parent cut. Post-parent reconciliation must still prove `noRevisionGapThroughCut=true` before symbol-session or technical-continuity promotion. Continue waiting for System2 D03 raw-vs-dedup diagnostics, System1 D03 redundancy diagnostics and D16 D03 method/incrementality receipts.


## 2026-10-07 D03 — TI-1227~1238 three-capture union/stability readback

Canonical artifact:
- `research/d03_system2_s207_three_capture_union_stability_readback_20261007_v0_1.json`.

### TI-1227~1231 — three-capture union is larger than every individual capture

Physical runs:
- `37547303476`: 159 exact-version keys;
- `37548011614`: 161 exact-version keys;
- `37549352244`: 163 exact-version keys.

Across all three:
- union = 168;
- intersection = 147;
- latest capture still omits 5 versions observed prospectively in an earlier capture;
- run1->run2 churn = +9 / -7, Jaccard 0.9048;
- run2->run3 churn = +7 / -5, Jaccard 0.9286;
- run1->run3 churn = +9 / -5, Jaccard 0.9167.

The latest count increasing to 163 does not imply convergence because membership is not monotone and five previously observed versions disappear from the latest capture.

### TI-1232~1234 — payload identity remains strong conditional on presence

For the 147 exact-version keys present in all three captures:
- payload mutation count = 0;
- stable event-universe hash is unchanged;
- stock-code-scoped exact-version identity remains valid.

This supports immutable content identity conditional on presence, but not complete population membership.

### TI-1235~1236 — earliest-observed persistence defect

A new machine-level defect is identified:
- every repeated observation carries a new `firstObservedAt` equal to that capture's current observation clock;
- cross-capture earliest genuine observation is therefore not preserved;
- the current V1.6 artifact behaves as if `firstObservedAt` were per-capture rather than append-only global minimum.

Frozen PIT requirement:
- `firstObservedAt = min(genuine observedAt across all captures for the same stock-code-scoped versionKey)`;
- later captures may update `latestObservedAt`, but may never move `firstObservedAt` forward or backward;
- no later observation can be backdated into historical availability.

### TI-1237 — month-shard instability localization

Run2->run3 churn is entirely month-query-path:
- additions: 7 = symbol 3086 x6 + symbol 1441 x1;
- losses: 5 = symbol 6461 x3 + symbol 6550 x2;
- all five versions in the three-capture union but absent from the latest capture are month-query observations.

Therefore the current instability is localized to month-shard retrieval membership, not payload mutation.

### TI-1238 — maturity and routing

Required future System2 machine behavior:
1. append-only union persistence keyed by stock-code-scoped versionKey;
2. immutable earliest `firstObservedAt`;
3. separate `latestObservedAt`;
4. query-path provenance persisted per observation/version;
5. absence classified by query path, never as nonexistence;
6. bounded stabilization before `expectedMopsKeysetComplete=true`;
7. `noRevisionGapThroughCut=false` until post-parent reconciliation proves closure.

No promotion:
- D03 remains 56.7%;
- D03-09/D03-10 remain L2/40;
- raw gate remains 2/3;
- technicalObserverR1 remains BLOCKED;
- outcomes remain CLOSED;
- Formal Core remains LOCKED.

Exact next:
route the earliest-observed persistence defect and month-shard membership churn to System2 BUILD_LANE. D03 consumes only a future physical receipt proving append-only union persistence, immutable earliest-observed preservation, query-path provenance and bounded stabilization. Continue waiting for System2 D03 raw-vs-dedup diagnostics, System1 D03 redundancy diagnostics, D16 D03 method/incrementality receipts and the cutoff-bearing C1 parent.


## 2026-10-07 D03 — TI-1239~1248 System2 S2-07 V1.7 append-only union acceptance

Canonical D03 artifact:
- `research/d03_system2_s207_v17_append_only_union_acceptance_20261007_v0_1.json`.

Accepted System2 physical evidence:
- merge `14f67ddba88604e73a2488d4a561a571393f026b`;
- workflow `37579422400`;
- job `112655458121`;
- artifact `11464480276`;
- artifact digest `sha256:3c3c2da61bfa1cced784a9c28daf214dcc1e3e8b4726a49601db70c16230fe85`;
- workflow conclusion SUCCESS.

### TI-1239~1242 — prior provenance defect is physically repaired

The V1.7 reconciliation of the three accepted V1.6 prospective artifacts now produces:
- captureCount = 3;
- unionVersionKeyCount = 168;
- latestCaptureVersionKeyCount = 163;
- unionMissingFromLatestCount = 5;
- earliestObservedPreserved = true;
- latestObservedPreserved = true;
- payloadConflictCount = 0.

D03 accepts that the previous cross-capture `firstObservedAt` reset defect is repaired at the V1.7 reconciliation layer.
The append-only union preserves the earliest genuine prospective observation clock and separates later re-observation via `latestObservedAt`.

### TI-1243~1245 — repair is not completeness

The same physical receipt correctly remains:
- state = `MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_PENDING`;
- trailingIdenticalTransitions = 0;
- boundedStabilizationCandidate = false;
- expectedMopsKeysetComplete = false;
- noRevisionGapThroughCut = false;
- monthOnlyDriftVersionCount = 21.

Therefore:
- provenance mechanics improved;
- population completeness is not yet certified;
- five version keys already in the union are absent from the latest capture;
- month-shard membership instability remains unresolved.

### TI-1246~1247 — causal / evidence boundary

Accepted:
- append-only prospective identity union;
- earliest-observed preservation;
- latest-observed separation;
- payload conflict count zero.

Not accepted:
- historical pre-cutoff availability;
- complete expected MOPS keyset;
- no revision gap through cutoff;
- symbol-session completeness;
- technical continuity;
- OOS/walk-forward evidence;
- transaction-cost/fillability evidence;
- independent D03 alpha root.

A repaired clock/provenance mechanism cannot be promoted into predictive evidence.

### TI-1248 — maturity and exact next

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source/version gate remains 2/3;
- technicalObserverR1 remains BLOCKED;
- outcomes remain CLOSED;
- Formal Core remains LOCKED.

Exact next:
continue bounded V1.7 repeated captures until the frozen stabilization rule is physically satisfied without payload conflicts, preserving append-only union identity and earliest-observed clocks. Only after stabilization may `expectedMopsKeysetComplete` be reviewed. `noRevisionGapThroughCut` must remain false until post-parent revision reconciliation. Continue in parallel waiting for System2 D03 raw-vs-dedup diagnostics, System1 D03 redundancy diagnostics, D16 D03 method/incrementality receipts, raw-source observer completion and the cutoff-bearing C1 parent.


## 2026-10-07 D03 — TI-1249~1258 System1 V8.20 / T48 parent-path decomposition

Canonical D03 artifact:
- `research/d03_system1_v820_t48_parent_path_decomposition_20261007_v0_1.json`.

### TI-1249~1252 — authoritative parent identity is implemented but evidence is still pending

Latest-main confirms:
- Production runtime `8.20.0-formal-c1-binding-ledger` is deployed/verified;
- append-only `trade_research_formal_c1_bindings` exists;
- exact Formal decision receipt -> exact immutable C1 generation binding is the intended authoritative parent identity;
- first legitimate normal-session genuine binding receipt is still pending.

Therefore the D03 parent path is no longer accurately described as “binding mechanism not implemented.”
It is:
`MECHANISM_PRODUCTION_VERIFIED / FIRST_GENUINE_PARENT_RECEIPT_PENDING`.

No historical recovery, stage-selection replay or ineligible scheduled attempt can substitute for that genuine receipt.

### TI-1253~1256 — T48 is a second and distinct gate

PR #780 merged only the proposal:
- `research/SYSTEM1_SDA016_T48_CLASS_B_PROPOSAL_20261007.md`;
- candidate runtime `8.21.0-c1-generation-set-finalization`;
- implementation NOT AUTHORIZED;
- separate owner approval required for implementation;
- later merge + Production deploy require separate approval.

T48 does not redefine Formal parent identity.
Its proposed role is to prove when the complete same-session immutable C1 generation inventory is terminal for research consumption.

D03 therefore freezes two distinct gates:
1. authoritative exact parent identity = V8.20 genuine Formal->C1 binding;
2. complete same-session parent-set finalization = T48/V8.21 future append-only finalization receipt.

Passing one does not imply the other.

### TI-1257 — D03 promotion consequence

D03-10 Bollinger cannot promote from a genuine bound parent alone if same-session generation-set finalization / complete expected-parent reconciliation remains unproven.
D03-09 ADX inherits both parent gates and additionally requires canonical Wilder H/L/C FULL_REPLAY or replay-certified trusted state.

This removes a future false-positive path in which “exact parent selected” could be mistaken for “all eligible same-session parents are known and finalized.”

### TI-1258 — maturity and exact next

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw source/version gate remains 2/3;
- technicalObserverR1 remains BLOCKED;
- outcomes remain CLOSED;
- Formal Core remains LOCKED.

Exact next:
1. consume the first legitimate post-deploy V8.20 genuine Formal->C1 binding receipt from a normal Taiwan session;
2. separately keep T48 as proposal-only until owner-authorized implementation, merge/deploy approval, Production verification and same-session generation-set finalization receipt exist;
3. require both exact parent identity and finalized complete same-session generation inventory before promotion-grade same-parent reconciliation;
4. continue waiting for System2 D03 raw-vs-dedup diagnostics, System1 D03 redundancy diagnostics, D16 D03 method/incrementality receipts, raw-source observer completion and S2-07 bounded stabilization.


## 2026-10-07 D03 — TI-1259~1274 three-layer technical continuity history maturity firewall

Canonical artifacts:
- `research/d03_technical_continuity_history_maturity_map_20261007_v0_1.json`;
- `research/test_d03_technical_continuity_history_maturity_map_v0_1.mjs`;
- `research/d03_technical_continuity_history_maturity_execution_receipt_20261007_v0_1.json`.

Canonical workflow:
- `D03 Technical Continuity History Maturity Readonly`;
- run `37591631091`;
- conclusion SUCCESS.

### TI-1259~1263 — three evidence layers are now frozen

D03 formally separates:
1. Layer A: RAW A1 historical price existence / immutable cold-store/source reconciliation;
2. Layer B: symbol-session completeness with every missing/extra session causally explained;
3. Layer C: revision/source-version fact known no later than historical decision cutoff.

Hard rule:
`RAW_A1_HISTORY_EXISTENCE_DOES_NOT_IMPLY_SYMBOL_SESSION_COMPLETENESS_AND_DOES_NOT_IMPLY_REVISION_KNOWN_AT_COMPLETENESS`.

This prevents large historical-data completion percentages from being mistaken for promotion-grade PIT technical continuity.

### TI-1264~1268 — current market-year evidence mapped into D03

2021 TPEx:
- 191,643 cold rows = 191,643 fresh official rows;
- zero missing/extra/source-row/canonical-A1 mismatch in full-year reconciliation;
- 412 explicit UNKNOWN symbol-session gaps;
- Data Coverage PASS / Replay Readiness PARTIAL;
- continuity state remains UNVERIFIED;
- D03 Layer A ACCEPT / Layer B PARTIAL / Layer C NOT PROVEN.

2023 TPEx:
- physical data coverage accepted;
- 395 explicit UNKNOWN symbol-session gaps;
- unexpectedBars=0;
- Layer A ACCEPT / Layer B PARTIAL / Layer C NOT PROVEN.

2024 TWSE:
- 246,037 cold rows = 246,037 fresh official rows;
- zero source/canonical mismatch in accepted storage/source reconciliation;
- 478 explicit UNKNOWN symbol-session gaps;
- Layer A ACCEPT / Layer B PARTIAL / Layer C NOT PROVEN.

2024 TPEx:
- old run `37587943578` failed twice on different PRIMARY transport dates;
- legacy endpoint remains forbidden because semantics are non-equivalent;
- bounded PRIMARY-only transport-recovery implementation is on main and CI `37590871628` passed;
- fresh physical reverify remains DATA_LANE responsibility;
- D03 Layer A PENDING / Layer B NOT REVIEWABLE / Layer C NOT PROVEN.

### TI-1269~1271 — indicator-specific consequences

D03-10 Bollinger:
- Layer A may support deterministic formula replay on observed rows;
- it cannot establish an exact 20 eligible-session window without Layer B;
- it cannot establish promotion-grade decision-time continuity without Layer C;
- a numerical 20-row window is not equivalent to a certified 20-session window.

D03-09 ADX:
- Layer A may reconstruct recursive H/L/C arithmetic on observed rows;
- one unexplained missing/adjusted session breaks promotion-grade recursive lineage;
- Layer B and Layer C remain mandatory;
- canonical Wilder FULL_REPLAY or replay-certified trusted prior state remains additionally required.

### TI-1272 — transport resilience evidence boundary

Bounded retry of the same canonical PRIMARY transport after transient exhaustion is accepted as acquisition reliability engineering.
It does not change source semantics and cannot upgrade evidence from Layer A to B/C.
Non-equivalent legacy fallback remains prohibited.

### TI-1273 — machine firewall

Repository-native read-only workflow run `37591631091` completed SUCCESS.
The machine test enforces:
- Layer A PASS cannot auto-promote D03 continuity;
- unresolved Layer B/C preserves D03-09/D03-10 at L2/40;
- raw-source gate remains 2/3;
- legacy TPEx fallback cannot manufacture completeness.

### TI-1274 — maturity and exact next

No maturity promotion:
- D03 = 56.7%;
- D03-09 = L2/40;
- D03-10 = L2/40;
- raw source/version gate = 2/3;
- technical observer = BLOCKED;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Exact next:
- DATA_LANE owns fresh 2024 TPEx physical dispatch/acceptance and later market-years; D03 must not duplicate that work;
- when fresh 2024 TPEx acceptance arrives, credit Layer A only first;
- then independently review Layer B symbol-session gaps and Layer C revision-known-at;
- in parallel consume first genuine V8.20 Formal->C1 binding receipt, S2-07 bounded stabilization, System1/System2 D03 redundancy/dedup diagnostics, D16 method/incrementality receipt and raw-source observer completion.


## 2026-10-07 D03 — TI-1275~1292 Layer-B symbol-session gap causal rehabilitation

Canonical artifacts:
- `research/d03_layer_b_symbol_session_gap_event_source_blind_spot_20261007_v0_1.json`;
- `research/test_d03_layer_b_symbol_session_gap_event_source_blind_spot_v0_1.mjs`;
- `research/d03_layer_b_gap_event_source_execution_receipt_20261007_v0_1.json`.

Canonical workflow:
- `D03 Layer-B Gap Event-Source Readonly`;
- run `37595689041`;
- conclusion SUCCESS.

### TI-1275~1279 — current Layer-B classifier source-class blind spot

Exact runtime inspection of `system2/runtime/historical_market_year_coverage_v0_1.mjs` confirms:
- expected symbol-session keys absent from A1 rows are checked only against supplied `suspensionIntervals`;
- matched rows become `OFFICIAL_SUSPENSION_INTERVAL`;
- every unmatched missing key becomes `UNKNOWN_SYMBOL_SESSION_GAP`.

Current physical evidence shows the suspension feed is not a complete lifecycle-event union. It does not by itself prove absence of regulatory stop/resume/delisting/share-conversion events.
Therefore a large fraction of current UNKNOWN gaps are classification debt rather than demonstrated official-price source loss.

### TI-1280~1284 — dominant official-event cases

2024 TWSE physical artifact:
- total UNKNOWN = 478;
- 2358 = 153, exact gap span 2024-04-08..2024-11-19; official stop from 2024-04-08 and delist 2024-11-19;
- 2443 = 153, exact gap span 2024-04-08..2024-11-19; official stop from 2024-04-08 and delist 2024-11-19;
- 8101 = 58, exact gap span 2024-08-22..2024-11-18; official stop from 2024-08-22 and resume 2024-11-19;
- 1701 = 9, exact gap span 2024-08-21..2024-09-02; share conversion stopped old shares from 2024-08-21 and delisted the old symbol on 2024-09-02.
Direct machine-reclassification candidate = 373/478 = 78.03%.

2023 TPEx:
- total UNKNOWN = 395;
- 4806 = 126, exact gap span 2023-04-10..2023-10-11; official stop from 2023-04-10, resume 2023-10-12;
- 3073 = 81, exact gap span 2023-02-20..2023-06-20; official stop from 2023-02-20, resume 2023-06-21;
- 8080 = 58, exact gap span 2023-10-11..2023-12-29; official stop from 2023-10-11 continued through year-end;
- 4950 = 31, exact gap span 2023-11-17..2023-12-29; official stop from 2023-11-17 continued through year-end.
Direct machine-reclassification candidate = 296/395 = 74.94%.

2021 TPEx:
- total UNKNOWN = 412;
- 3089 = 117, exact gap span 2021-01-20..2021-07-19; official stop from 2021-01-20, resume 2021-07-20;
- 3073 = 27, exact gap span 2021-01-04..2021-02-18; official pre-year stop continued until resume 2021-02-19.
Direct exact candidate = 144/412 = 34.95%.
- 8080 additionally has an official stop from 2021-04-07 overlapping its 132-gap aggregate window, but exact missing-key dates are not preserved in the durable artifact, so no extra count is credited without row-level reconstruction.

### TI-1285~1288 — required lifecycle-event union

Future Layer-B rehabilitation must union:
- intraday suspend/resume;
- regulatory stop trading;
- regulatory resume trading;
- delisting effective boundary;
- share-conversion/reorganization stop boundary;
- listing start / market migration boundaries.

Semantics:
- altered trading method / periodic call auction is not a no-bar suspension by itself;
- an officially proven regulatory stop interval removes the expected daily-price-row requirement;
- delisting/share conversion ends old-symbol membership at the effective boundary;
- absence from one event feed does not prove no stop event;
- reclassification requires official source identity/hash and effective dates;
- no synthetic OHLC may be created to fill officially non-trading intervals.

### TI-1289~1291 — indicator consequence

Bollinger:
- classified no-trading intervals are skipped from eligible-session counting, never imputed;
- 20 numerical rows still do not equal 20 certified eligible sessions until the event union is applied and rerun.

ADX:
- no TR/DM may be synthesized across regulatory non-trading gaps;
- recursive lineage restart/bridge semantics remain subject to continuity certification and Wilder FULL_REPLAY.

This Layer-B repair is orthogonal to Layer-C revision-known-at and parent identity/finalization.

### TI-1292 — maturity and exact next

Machine oracle run `37595689041` PASS.
No maturity promotion yet because canonical physical missingReasonCounts have not been regenerated.

D03 remains:
- maturity 56.7%;
- D03-09 L2/40;
- D03-10 L2/40;
- raw gate 2/3;
- technical observer BLOCKED;
- outcomes CLOSED;
- Formal Core LOCKED.

Exact next:
route a minimal System2 DATA/BUILD rehabilitation contract that materializes official lifecycle-event union with immutable source identity/hash/effective boundaries, reruns `historical_market_year_coverage_v0_1`, and emits a physical before/after gap-reclassification receipt. D03 consumes only that receipt for Layer-B advancement. Keep Layer-C revision-known-at, genuine V8.20 parent, T48 finalization, D03 dedup/redundancy, D16 incrementality and raw-source observer gates independent.


## 2026-10-07 D03 — TI-1293~1308 SHORT_MOMENTUM strategy-clock over-gating firewall

Canonical artifacts:
- `research/D03_SHORT_MOMENTUM_STRATEGY_CLOCK_OVERGATING_READBACK_20261007_V0_1.md`;
- `research/d03_short_momentum_strategy_clock_overgating_readback_20261007_v0_1.json`;
- `research/test_d03_short_momentum_strategy_clock_overgating_readback_v0_1.mjs`.

Cross-owner dependency:
- `research/D16_STRATEGY_CLOCK_OVERGATING_VALIDATION_20261007_V0_1.md`;
- correction `S2-CORR-20261007-002`, HIGH / OPEN / BUILD_LANE.

### TI-1293~1297 — global clock is not SHORT_MOMENTUM readiness

Frozen Stage-1 SHORT_MOMENTUM launch requirements are TECHNICAL_STRUCTURE, PRICE_VOLUME and RISK_FRICTION plus universal PIT/session/source-integrity safeguards. B2 INDUSTRY_THESIS and A5 FUNDAMENTAL belong to other strategy dependency lanes and are not SHORT_MOMENTUM launch requirements.

Current global Decision Clock instead:
- includes A1 TWSE + A1 TPEx + B2 in same-session readiness / candidate timestamp;
- also requires A5 by the candidate boundary for global requiredReady.

Prospective run `37577209442` observed A5 coverage true, B2 coverage false and global requiredReady false. D03 accepts the contract mismatch:
`GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`.

The global artifact may remain valid for genuinely cross-strategy use. It must not be relabeled as SHORT_MOMENTUM strategy readiness.

### TI-1298~1302 — sampling and denominator bias

If globally blocked dates are dropped or counted as natural zero-pick:
- SHORT_MOMENTUM coverage is understated;
- zero-pick rate may be inflated;
- infrastructure starvation can be mistaken for strategy selectivity;
- outcome samples become conditional on unrelated-source readiness;
- System1/System2 common support can shrink mechanically and create fake diversification;
- capacity and incrementality denominators become contaminated.

Required states remain distinct:
- `STRATEGY_REQUIRED_SOURCE_MISSING`;
- `UNIVERSAL_INTEGRITY_BLOCK`;
- `STRATEGY_IRRELEVANT_SOURCE_MISSING`;
- `POLICY_DISABLED`;
- `NATURAL_ZERO_PICK`;
- `DATA_UNKNOWN`.

Required per-strategy denominators include expected opportunities, strategy-required readiness, universal-integrity readiness, evaluable rows, policy-disabled rows, natural zero-picks, data-unknown rows and irrelevant-source-missing-but-nonblocking rows. Global requiredReady cannot substitute for strategyEvaluableN.

### TI-1303~1306 — support, counterevidence and validation boundary

Support:
- frozen dependency contracts exclude B2/A5 from SHORT_MOMENTUM;
- current global implementation includes them;
- one prospective mixed-source state physically shows the global block.

Counterevidence / alternative explanation:
- removing an irrelevant gate does not prove a candidate, hit rate or alpha;
- the global clock remains legitimate for use-cases that genuinely require all global sources;
- one trading date cannot estimate frequency, outcome size or regime persistence;
- a blocked row may still reflect required A1/integrity failure and must be classified, not automatically admitted.

Validation:
- PIT: later B2/A5 arrival cannot backdate candidateReadyAt;
- OOS / walk-forward: UNKNOWN until corrected runtime and prospective receipts exist;
- selection bias: unrelated-source readiness may create informative censoring;
- look-ahead: post-boundary source arrival cannot rehabilitate an earlier row;
- multiple testing / overfitting: no outcome or parameter fit;
- factor redundancy: irrelevant B2/A5 absence is not missing D03 factor evidence;
- date clustering: one prospective mixed-source date;
- costs, fillability and market-state effects: UNKNOWN.

### TI-1307~1308 — authority, maturity and exact next

D03 owns the inference firewall only. BUILD_LANE owns implementation. No runtime, strategy threshold, ranking weight, final selection, push, capital, order or System1 Formal Core change is authorized here.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw gate remains 2/3;
- outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

Exact next:
primary next remains a physical Layer-B lifecycle-event-union rehabilitation receipt with before/after missingReasonCounts. In parallel, consume `S2-CORR-20261007-002` only after corrected strategy-specific readiness and a genuine trading-date mixed-dependency receipt prove SHORT_MOMENTUM evaluable with irrelevant B2/A5 unavailable, SWING_GROWTH blocked when its required evidence is unavailable, and A1/universal PIT/session/source-integrity failures still fail closed. Preserve pre-fix over-gated observations as defect evidence. Continue waiting for Layer C revision-known-at, genuine V8.20 parent, T48 finalization, S2-07 stabilization, D03 dedup/redundancy and raw-source observer gates independently.


## 2026-10-07 D03 — TI-1309~1324 Layer-B lifecycle normalization contract + machine guard

Canonical artifacts:
- `research/d03_layer_b_lifecycle_event_normalization_contract_20261007_v0_1.json`;
- `research/test_d03_layer_b_lifecycle_event_normalization_contract_v0_1.mjs`;
- `research/d03_layer_b_lifecycle_normalization_execution_receipt_20261007_v0_1.json`.

Canonical workflow:
- `D03 Layer-B Lifecycle Normalization Readonly`;
- run `37621773476`;
- job `112793527371`;
- conclusion SUCCESS.

### TI-1309~1312 — current verifier architecture decomposed

Exact latest-main inspection confirms the annual verifier currently separates:
- TWSE historical-universe membership using the official current + new-listing + delisting union;
- TWSE gap classification using TWTAWU stop/resume intervals;
- TPEx current membership using MOPS current listed-company metadata plus observed historical intervals;
- TPEx gap classification using `/www/zh-tw/bulletin/sprcHis` halt/resume rows.

These source families are not yet normalized into one symbol lifecycle state machine.
Therefore correct delisting/listing knowledge may coexist with an UNKNOWN gap because membership-boundary and no-trading event semantics are consumed by different paths.

### TI-1313~1316 — canonical interval semantics

D03 freezes all no-trading intervals as half-open:
`[effectiveFrom, effectiveToExclusive)`.

Consequences:
- stop date is non-trading and excluded from expected price rows;
- resume date is trading-eligible again when membership remains active;
- listing/trading start is an inclusive membership boundary;
- delisting effective date is an exclusive old-symbol membership boundary unless an official source explicitly says trading occurs that date;
- share conversion may produce both a no-trading interval and an old-symbol membership termination;
- open-ended stops terminate only at a proven resume/delist/migration boundary or remain open through coverage;
- overlapping no-trading intervals are unioned, never double-subtracted.

This explicitly prevents resume-day deletion, delisting-day off-by-one errors and duplicate denominator removal.

### TI-1317~1319 — authority / conflict / provenance

Canonical lifecycle event types:
- LISTING_START;
- REGULATORY_STOP;
- REGULATORY_RESUME;
- DELISTING_EFFECTIVE;
- SHARE_CONVERSION_STOP;
- MARKET_MIGRATION_OUT;
- MARKET_MIGRATION_IN.

Required normalized provenance:
market, symbol, eventType, effectiveFrom, effectiveToExclusive, membershipAction, tradingAction, sourceId, sourceUrl, sourceRowHash, sourcePayloadHash, observedAt, sourceReportedAt, eventIdentityHash.

Rules:
- official effective dates outrank free-text inference;
- source disagreement fails closed to EVENT_BOUNDARY_CONFLICT;
- source absence never proves no event;
- changed trading method alone is not a no-trading interval;
- no synthetic OHLC may fill official non-trading intervals;
- Layer-B event classification must not advance Layer-C revision-known-at.

### TI-1320~1322 — source reuse map

TWSE can reuse:
- existing `fetchTwseSuspensionIntervals` / TWTAWU for one stop/resume class;
- existing `d08_twse_historical_universe_source_v0_1.mjs` current + newlisting + suspendListing union for membership boundaries.

TPEx can reuse:
- existing `fetchTpexSuspensionIntervals` / `sprcHis` for halt/resume positive rows;
- official TPEx delisted-company registry exists, but its underlying machine contract is not yet pinned in current verifier;
- regulatory stop/resume events outside `sprcHis` require a pinned official structured/bulletin source contract.

The implementation objective is therefore source normalization/reuse, not a new parallel inference engine.

### TI-1323 — deterministic real-case boundary guard

Machine tests freeze:
- TWSE 8101 2024: stop 2024-08-22 / resume 2024-11-19 => [2024-08-22,2024-11-19);
- TWSE 1701 2024: share-conversion stop 2024-08-21 / delist 2024-09-02 => [2024-08-21,2024-09-02) plus membership termination at 2024-09-02;
- TPEx 4806 2023: stop 2023-04-10 / resume 2023-10-12 => [2023-04-10,2023-10-12);
- TPEx 3089 2021: stop 2021-01-20 / resume 2021-07-20 => [2021-01-20,2021-07-20).

Workflow run `37621773476` and isolation step both PASS.

### TI-1324 — maturity / module / exact next

No physical Layer-B promotion yet:
- D03 maturity remains 56.7%;
- D03-09 / D03-10 remain L2/40;
- raw source/version gate remains 2/3;
- Layer C remains NOT PROVEN;
- outcomes remain CLOSED;
- Formal Core remains LOCKED.

Formal D03 module inventory:
- 12 active modules total;
- 10 modules currently at L3/60;
- 2 modules (D03-09 ADX, D03-10 Bollinger) remain L2/40.
For visible room reporting, use “10 reached current L3 milestone / 2 not yet reached L3” rather than implying L3 means final economic completion.

Exact next:
1. BUILD/DATA materializes the normalized lifecycle-event union and reruns annual coverage;
2. physical receipt must expose before/after membership-session denominator, missingReasonCounts, reclassified symbol-session identities, source hashes and unresolved conflicts;
3. D03 may advance Layer B only from that physical receipt;
4. in parallel consume S2-CORR-20261007-002 corrected strategy-specific readiness only after a genuine mixed-dependency trading-date receipt;
5. keep Layer C revision-known-at, V8.20 genuine parent, T48 finalization, S2-07 stabilization, D03 dedup/redundancy, D16 incrementality and raw-source observer gates independent.


## 2026-10-07 D03 — TI-1325~1344 TWSE lifecycle V0.6 implementation acceptance + exact replay-window continuity binding

Canonical D03 artifacts:
- `research/d03_system2_twse_lifecycle_v06_implementation_acceptance_20261007_v0_1.json`;
- `research/d03_system2_twse_lifecycle_v06_implementation_execution_receipt_20261007_v0_1.json`.

Canonical dedicated acceptance:
- workflow `D03 System2 TWSE Lifecycle V0.6 Acceptance`;
- run `37625151533`;
- head `ecefbac4e34281591ba0a5efd41d9c3ba63a95c8`;
- conclusion SUCCESS.

### TI-1325~1330 — System2 TWSE Layer-B implementation is now real repository code

Latest main physically contains:
- `system2/runtime/twse_regulatory_lifecycle_source_v0_1.mjs`;
- `system2/scripts/historical_market_year_verify_v0_1.mjs` upgraded to verifier schema `S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFICATION_V0_6`;
- lifecycle parser tests;
- targeted market-year lifecycle verifier guard.

Accepted implementation properties:
- baseline coverage is computed first;
- only symbols still carrying UNKNOWN gaps are queried against the TWSE official announcement list/detail source;
- only positive official evidence can create regulatory lifecycle intervals;
- margin-financing-only notices are excluded from no-trading classification;
- sourceRowHash, sourcePayloadHash and eventIdentityHash are preserved;
- before/after UNKNOWN counts and missingReasonCounts are emitted;
- reclassifiedUnknownBars, conflictCount and interval/event samples are emitted;
- cold OHLCV is not mutated;
- announcement-list absence does not certify NO_EVENT;
- `sourceReportedAt` remains null where exact historical availability time is not proven, so Layer C remains NOT PROVEN.

The original merge commit `8885e60ceb46d07180946940a63f2262c345ee15` had its broad System2 Research CI cancelled by later repository movement. D03 therefore reran the relevant parser and verifier guards on current main under dedicated run `37625151533`, which passed.

This advances Layer B from:
`RESEARCH_CONTRACT_ONLY`
to:
`TWSE_IMPLEMENTATION_MACHINE_ACCEPTED / PHYSICAL_ANNUAL_RERUN_PENDING`.

No maturity promotion is granted before an annual physical verifier V0.6 receipt demonstrates actual before/after reclassification on real market-year data.

### TI-1331~1334 — strategy-clock correction is no longer a current runtime blocker

Canonical correction queue now records:
`S2-CORR-20261007-002 = REJECTED_WITH_EVIDENCE`.

Accepted nuance:
- the global A1+B2+A5 Decision Clock mismatch remains a valid research/sampling warning;
- but latest-main Stage-1 preflight, Limited Shadow and capacity paths do not consume B2/A5/global `requiredReady` as a SHORT_MOMENTUM execution blocker;
- prospective run `37577209442` therefore remains valid evidence that the global artifact can be over-gated for research use, but it is not proof of a current Stage-1 runtime defect.

D03 consequence:
- preserve the strategy-specific common-support/sampling firewall;
- do not use global blocked dates as natural zero-pick evidence;
- remove S2-CORR-20261007-002 from the active BUILD blocker list;
- retain it only as a future wiring regression/watchlist requirement.

### TI-1335~1341 — continuity receipt must bind the actual selected PIT replay window

00 audit:
`system2/evidence/S2_STAGE1_NCT01_CONTINUITY_REPLAY_BINDING_AUDIT_20261007_V0_1.json`
is accepted as a D03-relevant lineage finding.

Critical result:
`CURRENT_RESOLVE_CONTINUITY_STATE_IS_NOT_HASH_BOUND_TO_THE_ACTUAL_SELECTED_REPLAY_WINDOW`.

The current pre-replay resolver returns only a text state and executes before the exact PIT replay window exists.
Therefore a valid continuity witness could be accidentally reused after selected-session/revision drift unless the receipt is validated after replay selection.

D03 freezes the stronger rule:
promotion-grade technical continuity requires the receipt to bind the exact ordered selected replay window through:
- `continuityReceiptId`;
- `sourceHistoryHash`;
- `continuityTransformHash`;
- exact ordered marketDate/sourceId/sourceRowHash/availableAt + OHLCV identity;
- exact eligible-session date set;
- zero unresolved missing sessions;
- zero unresolved relevant events.

A string such as `CLEAR_NO_ACTION` or `ADJUSTED_CONTINUITY` by itself is not sufficient provenance.

No historical D1 continuity-state rewrite is required when a post-replay exact-window certifier truthfully proves the selected raw window.

### TI-1342 — RAW + ADJUSTED_CONTINUITY firewall

Current Stage-1 path consumes RAW historical bars and does not apply a TECHNICAL_CONTINUITY price transform before factor computation.

Therefore:
- first NC-T01 physical witness may be `CLEAR_NO_ACTION` only;
- `ADJUSTED_CONTINUITY_REQUIRED` stays fail-closed until an actually transformed technical-continuity window exists;
- relabeling RAW bars with an `ADJUSTED_CONTINUITY` text state is explicitly rejected.

D03 applies the same anti-shortcut to ADX/Bollinger:
an adjusted-continuity label cannot repair a RAW computation path.

### TI-1343 — D03-09 / D03-10 stale module status corrected

The old module-local wording still said V8.18 Production approval was pending, conflicting with the already accepted V8.20 Production deployment.

Correct current state:
- V8.20 authoritative Formal->C1 parent-binding runtime = PRODUCTION_VERIFIED;
- first genuine normal-session Formal->C1 parent receipt = PENDING;
- Layer-B TWSE lifecycle verifier V0.6 implementation = MACHINE_ACCEPTED;
- physical annual Layer-B rerun = PENDING;
- exact replay-window continuity receipt binding = REQUIRED;
- Layer C revision-known-at = NOT PROVEN.

ADX additionally requires canonical Wilder H/L/C FULL_REPLAY / replay-certified trusted state.

### TI-1344 — maturity, module inventory and exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules total;
- 10 modules at current L3/60 milestone;
- D03-09 and D03-10 remain L2/40;
- raw source/version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Exact next:
1. consume the first physical TWSE annual V0.6 lifecycle rerun receipt and inspect real before/after UNKNOWN counts, reclassified market|symbol|date identities, source hashes and conflicts;
2. keep TPEx lifecycle parity separate; do not infer TPEx source semantics from TWSE;
3. require post-replay exact-window continuity receipt binding for any promotion-grade D03/NC-T01 witness;
4. consume first genuine V8.20 Formal->C1 parent receipt when available;
5. continue T48 finalization, S2-07 stabilization, System1/System2 D03 dedup/redundancy and D16 incrementality gates independently.


## 2026-10-07 D03 — TI-1345~1360 TWSE V0.6 annual physical receipt preregistered acceptance oracle

Canonical artifacts:
- `research/D03_TWSE_V06_PHYSICAL_RECEIPT_ACCEPTANCE_ORACLE_20261007_V0_1.md`;
- `research/d03_twse_v06_physical_receipt_acceptance_cases_20261007_v0_1.json`;
- `research/test_d03_twse_v06_physical_receipt_acceptance_v0_1.mjs`.

### TI-1345~1352 — outcome-independent receipt acceptance frozen before the first annual result

No physical annual V0.6 receipt exists on latest main at this checkpoint. D03 therefore does not fabricate or infer one. Instead, the acceptance rule is preregistered before the first result is inspected.

A positive Layer-B receipt must bind the exact TWSE market/year window and V0.6 verifier schema, preserve a reconstructable before-state, and reconcile:
- beforeUnknownBars - afterUnknownBars = reclassifiedUnknownBars;
- the summed before/after missingReasonCounts delta to the same reclassified count;
- one unique market|symbol|date identity for every reclassified bar;
- valid event/source hashes;
- zero unresolved lifecycle conflicts;
- zero partial-source symbols;
- cold OHLCV mutation = false;
- absenceCertifiesNoEvent = false;
- Layer-C known-at promotion = false.

This separates actual event-driven rehabilitation from denominator/window drift, duplicate identity inflation, hidden source failure, cold-history mutation and historical availability leakage.

### TI-1353~1357 — falsifiers and negative evidence

The 18-case executable matrix rejects wrong schema/market/window, missing baseline, arithmetic mismatch, missing-reason mismatch, identity count/duplication, invalid hashes, unresolved conflicts, partial-source execution, cold-data mutation, absence-based NO_EVENT inference and Layer-C leakage.

A zero-delta complete receipt is accepted only as negative evidence. It may falsify expected rehabilitation for that preregistered market/year window, but it cannot promote Layer B or D03 maturity. Source success alone also cannot prove PIT availability, OOS robustness, walk-forward stability, costs, fillability, market-state robustness or indicator alpha.

Observed deterministic execution:
`status=PASS; cases=18; positiveReceipt=ACCEPT_LAYER_B_RECEIPT; zeroDelta=NEGATIVE_EVIDENCE_ONLY; maturityPct=56.7; formalCoreImpact=NONE_LOCKED`.

### TI-1358~1360 — maturity and exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules = 10 at L3/60 and 2 at L2/40;
- D03-09 and D03-10 remain L2/40;
- outcomes remain CLOSED;
- Formal Core remains LOCKED;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Exact next:
1. consume the first physical TWSE annual market-year verifier V0.6 receipt;
2. validate it against the preregistered 18-case oracle, including exact before/after counts, missing-reason reconciliation, unique market|symbol|date identities, source hashes, conflicts and partial-source state;
3. treat a complete zero-delta run as negative evidence only, not promotion;
4. keep TPEx lifecycle parity, Layer-C known-at, exact replay-window continuity binding, the genuine V8.20 parent, T48, S2-07, System1/System2 D03 dedup and D16 incrementality as independent gates.


## 2026-10-07 D03 — TI-1361~1378 exact symbol-session window identity + CORR-004 consumer acceptance

Canonical D03 artifact:
- `research/d03_corr004_exact_symbol_session_window_consumer_acceptance_20261007_v0_1.json`.

Cross-lane source:
- `S2-CORR-20261007-004` = HIGH / OPEN / DATA_LANE;
- PR #817 = `fix(system2-data): reconcile exact Daily Shadow symbol sessions`;
- audited PR head = `43784e500f678be6ee95710822fdafd2af50ac50`;
- independent 00 disposition = CONTENT_PASS_CANDIDATE / CANONICAL_AND_PHYSICAL_ACCEPTANCE_PENDING.

### TI-1361~1365 — row count is not window identity

Current pre-fix history readiness can select the latest N available PIT rows and, for long-listed symbols, accept `selectedDateCount >= required` without exact expected-session reconciliation.

Frozen counterexample:
- expected eligible set = D1..D60;
- D55 is missing;
- an older D0 is present;
- latest 60 observed rows still have count=60;
- count-only readiness can therefore pass while the exact required window is wrong.

D03 classifies this as:
`WINDOW_MEMBERSHIP_IDENTITY_DEFECT`,
not a simple row-count insufficiency.

Hard rule:
`COUNT_EQUALITY_DOES_NOT_PROVE_ELIGIBLE_SESSION_SET_EQUALITY`.

### TI-1366~1369 — exact-set semantics become D03-wide

For all D03 N-session features:
- the observed symbol-session set must reconcile exactly to the expected certified eligible-session set;
- older rows may not substitute for missing required recent sessions;
- certified official no-trading intervals are removed from the expected set before reconciliation;
- missing/unexpected sessions remain symbol-local fail-closed;
- no whole-universe veto is restored;
- empty lifecycle lookup never proves NO_EVENT.

This strengthens future runtime/empirical receipts for D03-01~04 without downgrading their already accepted L3 Taiwan-PIT feasibility status.

### TI-1370~1372 — Bollinger consequence

D03-10 requires exactly 20 certified eligible sessions.
A window with:
- 19 correct recent eligible sessions;
- 1 older substitute;
- rowCount=20
is REJECTED.

Official non-trading intervals are skipped from the expected session clock rather than filled with previous-close pseudo bars.

Therefore:
`20 observed rows != exact 20 eligible-session suffix`.

### TI-1373~1375 — ADX consequence

D03-09 requires the exact ordered eligible H/L/C sequence.
One missing required recent session changes TR/DM/Wilder smoothing ancestry.
An older observation cannot restore that recursion simply by keeping the count constant.

Therefore:
- exact expected-vs-observed session identity precedes continuity promotion;
- post-replay continuity evidence must bind that exact selected window;
- canonical Wilder FULL_REPLAY / replay-certified trusted state remains separately required.

### TI-1376 — PR #817 evidence boundary

PR #817 currently provides strong engineering content:
- missing-required-session + older-substitution regression fail-closed;
- clean long-listed exact-window control;
- certified lifecycle-gap control;
- new-listing short-window control;
- expected/observed session hashes;
- loaded-window hash recomputation with `EXPECTED_SESSION_HASH_MISMATCH` rejection;
- symbol-local incompleteness;
- TWSE positive lifecycle evidence only;
- TPEx remains separate.

But the branch is not canonical main and remains open/diverged.
Historical green checks do not authorize maturity promotion.

Physical D03 credit requires:
1. refresh/rebase on then-latest main;
2. exact-head CI;
3. canonical merge;
4. merged-main read-only preflight;
5. at least one real TWSE exact-session witness;
6. immutable expected/observed set/hash provenance;
7. zero unresolved missing expected sessions for that witness.

### TI-1377 — third raw receipt attempt remains uncredited

A dedicated read-only workflow has been prepared:
`.github/workflows/d03-third-raw-session-capture-readonly.yml`.

No physical run exists.
Connector-origin content commits did not trigger GitHub Actions, the GitHub connector exposes no workflow-dispatch action, and the local direct official-source curl path was infrastructure-rate-limited.

Therefore:
- raw source-version gate remains 2/3;
- no receipt is inferred from System2 A1;
- no same-date repeat is fabricated;
- no outcome or maturity credit is granted.

### TI-1378 — maturity and exact next

D03 remains:
- maturity = 56.7%;
- active modules = 12;
- current L3 milestone = 10 modules;
- L2 = D03-09 ADX and D03-10 Bollinger;
- raw source/version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Primary exact next:
1. consume canonical merged-main CORR-004 real TWSE exact-session read-only witness;
2. only then allow post-replay hash-bound `CLEAR_NO_ACTION` continuity to consume that exact window;
3. in parallel consume the first physical annual TWSE V0.6 lifecycle receipt;
4. capture the third D03 raw source-version session only through receipt-equivalent execution;
5. continue V8.20 genuine parent, T48, S2-07, D03 dedup/redundancy and D16 incrementality independently.


## 2026-10-07 D03 — TI-1379~1396 CORR-004 physical closure + NC-T01 replay-first continuity binding accepted

Canonical D03 artifact:
- `research/d03_corr004_physical_nct01_replay_binding_acceptance_20261007_v0_1.json`.

Cross-lane physical / implementation evidence:
- `system2/evidence/S2_CORR_20261007_004_PHYSICAL_READBACK_V0_1.json`;
- `system2/evidence/S2_CORR_20261007_004_INDEPENDENT_VERIFICATION_20261007_V0_1.json`;
- CORR-004 final state = `VERIFIED_CLOSED`;
- exact-session merge = `625ea3d0bda28fcd06df4c3163a054573c3982f7`;
- physical read-only run = `37639310919`, job `112853723927`, SUCCESS;
- replay-first continuity binding merge = `885ddf080d0ff0918aaf68eb237b679750d09fcc`;
- legacy continuity firewall merge = `bf7cb670341c212c093785253654b1edf1728313`;
- canonical SDA-022 fingerprint acceptance = `df39a5f315d48b91cff34a2a2ce6b1251cf9be43`.

### TI-1379~1383 — exact-session prerequisite is physically closed

Merged-main real readback:
- ordinary universe = 1,973;
- pre-correction count-only history-ready reference = 51;
- post-correction exact-session history-ready = 46;
- five previously ready symbols no longer survive exact expected-session reconciliation;
- reduction among the pre-correction ready set = 5/51 = 9.80%;
- continuity-ready = 0;
- D1 rows written = 0;
- System1 production isolation = PASS.

Interpretation:
the physical delta proves the count-only defect was behaviorally real, not merely theoretical.
It does NOT estimate a market-wide false-positive rate; it only shows that 5 of the 51 pre-correction history-ready symbols in this specific 2026-10-07 readback failed the stronger exact-session criterion.

Positive witness:
- 1101 / TWSE remains exact-session history-ready;
- its only remaining local blocker is `SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED`;
- no `INSUFFICIENT_PIT_HISTORY`, expected-session-missing or unexpected-session blocker remains.

Negative witnesses:
- 1213 / 1218 remain fail-closed with expected-session missing + unexpected older-session evidence.

D03 therefore closes:
`EXACT_ELIGIBLE_SESSION_SET_IDENTITY_PENDING`
for the real TWSE witness path.

### TI-1384~1388 — replay-first continuity binding is now implemented

PR #825 merged a canonical NC-T01 continuity binding core.

Accepted mechanics:
1. build the RAW PIT replay window first;
2. preserve selected revision/source provenance in that replay;
3. derive a deterministic `sourceHistoryHash` over the ordered selected date/source/value identity;
4. resolve continuity evidence only after the replay exists;
5. recompute and verify the continuity receipt hash;
6. require symbol, asOf, decisionTimestamp and capturedAt causal consistency;
7. require `sourceHistoryHash` and `replayHash` equality with the exact selected replay;
8. require exact eligible-date-set equality;
9. require zero unresolved missing sessions / relevant events for `CLEAR_NO_ACTION`;
10. reject `ADJUSTED_CONTINUITY_REQUIRED` on a RAW first-witness path.

For the first TWSE no-action certifier, the source-completeness contract requires:
- EX_RIGHT_DIVIDEND historical actual-result range;
- CAPITAL_REDUCTION historical actual-result range;
- PAR_VALUE_CHANGE historical actual-result range;
plus exact TWSE suspension/session evidence.

A valid receipt may return:
- `CLEAR_NO_ACTION_ELIGIBLE`;
- `ADJUSTED_CONTINUITY_REQUIRED`;
- `CONTINUITY_UNKNOWN`.

Only the first may bind to runtime `CLEAR_NO_ACTION` on the RAW first-witness path.

### TI-1389~1391 — legacy continuity leakage firewall

PR #826 prevents persisted historical labels from self-authorizing the NC-T01 replay.

When the NC-T01 replay path is used:
- legacy `CLEAR_NO_ACTION` rows are sanitized to `UNVERIFIED`;
- legacy `ADJUSTED_CONTINUITY` rows are sanitized to `UNVERIFIED`;
- replay/source-history identity becomes independent of those persisted legacy labels;
- only a post-replay validated continuity receipt may promote the selected window.

Therefore:
`PERSISTED_LEGACY_CONTINUITY_LABEL != PROMOTION_GRADE_CONTINUITY_EVIDENCE`.

This directly protects D03-09 / D03-10 from a false green state created by historical labels.

### TI-1392~1393 — policy fingerprints are canonical again

After CORR-004 / NC-T01 runtime changes, stale fingerprint PR #762 was superseded.
PR #828 regenerated the 11 source-artifact bindings.

Independent canonical acceptance:
- exact-main source matches = 11/11;
- SHORT_MOMENTUM fingerprint = `115ed06ff7f7492d7b57fb6bf7633e2409c0e55e856e16ece8774fba6f19f8d3`;
- SWING_GROWTH fingerprint = `a17d97c5a506395042d1ccaf237d47a7629c24df6c6f14e4e359b17726b3f43b`;
- S22-T06~T10 = PASS_CANONICAL;
- S22-T11~T16 remain PENDING_PHYSICAL_NC_T01.

This removes policy-fingerprint staleness from the immediate D03 continuity path.

### TI-1394 — remaining real gap

Canonical audit state:
`REAL_CLEAR_NO_ACTION_RECEIPT_NOT_YET_OBSERVED`.

Current runtime has:
- exact-session history reconciliation = merged / physical PASS;
- replay-first continuity binding = merged;
- legacy continuity sanitization = merged;
- canonical policy fingerprints = accepted.

But no real source-honest `CLEAR_NO_ACTION` continuity receipt has yet been observed.
Fixture receipts prove contract mechanics only and do not satisfy physical independence.

Shortest truthful next:
DATA_LANE must produce one real read-only exact-window TWSE corporate-action/lifecycle evidence package for an exact-session-ready symbol such as 1101.
It must prove complete source/event/session evidence or fail closed.
If sufficient, it emits the versioned hash-bound continuity receipt.
BUILD_LANE then consumes that receipt through the merged replay-first core and executes the artifact-only NC-T01 runner.

### TI-1395 — D03-10 Bollinger status

D03-10 remains L2/40, but one blocker is now closed.

Closed for the first real TWSE witness path:
- exact expected eligible-session identity;
- no older-row substitution;
- probe-to-load session-hash binding.

Immediate remaining blocker:
- first real post-replay hash-bound `CLEAR_NO_ACTION` continuity receipt.

Later still required:
- genuine V8.20 Formal-to-C1 parent;
- exact 20 eligible sessions on that parent;
- Layer-C revision-known-at;
- formula/source guards;
- COMPLETE expected-parent reconciliation.

No L3 promotion yet.

### TI-1396 — D03-09 ADX status / maturity / exact next

D03-09 remains L2/40.

Closed:
- exact ordered eligible-session identity for the real TWSE witness path;
- older-row substitution defect;
- replay-first continuity binding engineering path.

Immediate remaining blocker:
- real hash-bound continuity receipt.

Then ADX still additionally requires:
- canonical Wilder H/L/C FULL_REPLAY or replay-certified trusted prior state;
- genuine V8.20 parent;
- Layer-C revision-known-at;
- complete parent reconciliation.

D03 remains:
- maturity = 56.7%;
- 12 active modules;
- 10 at current L3/60 milestone;
- D03-09 and D03-10 at L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Exact next:
1. consume the first real hash-bound TWSE `CLEAR_NO_ACTION` continuity receipt for an exact-session-ready witness such as 1101, or accept fail-closed evidence and move to another witness;
2. verify exact replay/date-set/sourceHistoryHash/receiptHash identity;
3. execute/consume the physical artifact-only NC-T01 S22-T11~T16 receipt;
4. independently keep annual TWSE V0.6 lifecycle rehabilitation, third raw D03 source-version receipt, genuine V8.20 parent, T48, S2-07, System1/System2 D03 dedup/redundancy and D16 incrementality as separate gates.


## 2026-10-07 D03 — TI-1397~1414 negative-evidence firewall + lifecycle boundary authority

Canonical D03 artifact:
- `research/d03_negative_evidence_boundary_authority_firewall_20261007_v0_1.json`.

Cross-lane sources accepted:
- `system2/evidence/S2_STAGE1_NCT01_TWSE_SUSPENSION_NEGATIVE_COMPLETENESS_HANDOFF_20261007_V0_1.json`;
- `research/D16_POST_CORR004_LIFECYCLE_OPEN_BOUNDARY_RESIDUAL_RISK_20261008_V0_1.md`;
- `research/d16_sda022_nct01_hidden_fallback_oracle_20261008_v0_1.json`;
- `S2-CORR-20261007-005` = HIGH / OPEN / BUILD_LANE;
- artifact-only NC-T01 runner core merge `d2050fbc3379dfe618447f88f8104b31e494a633`.

### TI-1397~1401 — absence proof is a typed evidence problem

D03 freezes two distinct negative-evidence claims:

A. market-data absence:
`NO_SUSPENSION_OR_RELEVANT_LIFECYCLE_EVENT_IN_EXACT_WINDOW`;

B. execution-independence absence:
`NO_HIDDEN_SYSTEM1_SELECTION_FALLBACK`.

These are orthogonal claims.

Hard rules:
- empty source result is not event-absence proof without bounded source completeness;
- missing audit is not false;
- positive event evidence and negative completeness are separate facts;
- market-event absence does not prove execution independence;
- execution-independence absence does not prove technical continuity.

For market-data absence, HTTP 200, an empty array, positive-only announcement lookup with no match, partial pagination or transport success alone are insufficient.
The admissible negative conclusion is:
`NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW`,
and it requires exact replay-window query scope plus machine-verifiable response/range/schema/body completeness and causal source identity.

For execution independence, all five hidden-fallback dimensions must be explicit:
- cached System1 selection;
- persisted System1 selection;
- alias/compatibility reconstruction;
- cross-project System1 selection import;
- stale prior System1 selection reuse.

Physical absence requires all five = PROVEN_ABSENT, exact-head transitive static audit, runtime no-forbidden-access evidence, and an immutable `HIDDEN_FALLBACK_AUDIT_SHA256` bound into the final receipt hash.

### TI-1402~1406 — post-CORR004 open-boundary residual risk

Current `twse_regulatory_lifecycle_source_v0_1.mjs` still allows:
- STOP opens an interval;
- RESUME / delisting closes it;
- if no close is observed, the interval may be emitted through `coverageTo`.

But the same source explicitly has:
`absenceCertifiesNoEvent=false`.

Therefore:
`NO_RESUME_OBSERVED != SUSPENSION_CERTIFIED_ACTIVE_THROUGH_COVERAGE_TO`.

Distinct false-readiness mechanism:
1. a genuine STOP exists;
2. the later RESUME is missing from retrieved evidence;
3. resumed trading sessions are absent from D1;
4. an uncertified open STOP deletes those expected resumed sessions;
5. the exact-session denominator shrinks;
6. older rows may now fit the shortened expected set.

This does not reopen CORR-004.
CORR-004 correctly closed the count-only older-row-substitution defect.
This is a separate boundary-authority defect in the exception set used to construct expected sessions.

D03 lifecycle interval admissibility states:
- `CLOSED_POSITIVE_BOUNDARIES_CERTIFIED`: may exclude covered sessions;
- `OPEN_ACTIVE_THROUGH_DATE_CERTIFIED`: may exclude only through a separately certified active-through bound;
- `NOT_ADMISSIBLE_BOUNDARY_INCOMPLETE`: must not remove expected sessions.

A bare `coverageTo` is never boundary authority.

### TI-1407~1409 — D03-10 Bollinger consequence

For D03-10:
- exact 20 eligible sessions remain the denominator;
- an uncertified open STOP may not shorten that denominator;
- every excluded expected date must be covered by an admissible lifecycle interval;
- if a resumed trading date is wrongly removed, the 20-row window may still look numerically complete while its mean, standard deviation, band width and percent-B are all computed on the wrong temporal support.

Immediate physical gate remains:
real hash-bound `CLEAR_NO_ACTION` continuity receipt with bounded TWSE suspension negative completeness.

### TI-1410~1412 — D03-09 ADX consequence

For D03-09:
- only admissible lifecycle exclusions may alter the ordered H/L/C recursion clock;
- an uncertified open STOP cannot remove resumed sessions;
- post-STOP observed trading before a certified RESUME is a direct conflict requiring boundary resolution;
- one wrongly deleted resumed session changes TR, +DM/-DM and Wilder smoothing ancestry even if sequence length remains valid.

After a real continuity receipt, ADX still requires canonical Wilder FULL_REPLAY / replay-certified trusted prior state.

### TI-1413 — artifact-only NC-T01 runner exists but physical independence is not yet provable

PR #830 merged the artifact-only SHORT_MOMENTUM runner core.

Accepted engineering semantics:
- canonical strategy contract/spec/assessor;
- replay-first continuity binding;
- uncertified symbols remain INCOMPLETE and denominator-accounted;
- persistence is dry-built, not executed;
- typed hash chain spans policy/A1/replay/source-history/continuity/factor/persistence/orchestration/accounting.

But S2-CORR-20261007-005 is HIGH / OPEN:
the current receipt path can default omitted hidden-fallback evidence to false.

Therefore:
- runner core = implemented;
- physical NC-T01 = not yet observed;
- S22-T12/S22-T16 = not creditable;
- no physical-independent-discovery promotion is allowed.

### TI-1414 — current dual pre-physical gate and maturity

Two parallel gates must both close before physical NC-T01:

DATA_LANE:
1. exact replay-window TWTAWU bounded-completeness receipt;
2. three TWSE exact-range corporate-action sources;
3. source-honest real continuity result:
   `CLEAR_NO_ACTION_ELIGIBLE`, `ADJUSTED_CONTINUITY_REQUIRED`, or `CONTINUITY_UNKNOWN`.

BUILD_LANE:
1. CORR-005 hidden-fallback hardening;
2. exact-head transitive static audit;
3. runtime no-forbidden-access evidence;
4. typed audit digest bound into final receipt dependency graph.

D03 remains:
- maturity = 56.7%;
- 12 active modules;
- 10 at current L3/60 milestone;
- D03-09 and D03-10 = L2/40;
- raw source/version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Exact next:
consume whichever lands first:
A. DATA_LANE bounded TWTAWU + real continuity receipt;
B. BUILD_LANE CORR-005 hardening.
After both pass, consume physical artifact-only NC-T01 S22-T11~T16.
Keep the general lifecycle open-boundary correction separate from CORR-004 closure, and keep annual V0.6, raw-third-session, V8.20 genuine parent, T48, S2-07, D03 dedup/redundancy and D16 incrementality independent.


## 2026-10-08 D03 — TI-1415~1422 coherent physical evidence cut + TWTAWU parity compression

Canonical updated artifact:
- `research/d03_negative_evidence_boundary_authority_firewall_20261007_v0_1.json`.

00 canonical physical matrix:
- `system2/evidence/S2_STAGE1_NCT01_PHYSICAL_ACCEPTANCE_MATRIX_20261007_V0_1.json`.

### TI-1415~1417 — S22-T11~T16 must share one coherent immutable cut

Current physical matrix:
- T11 = design/static precleared, physical pending;
- T12 = blocked by CORR-005 hidden-fallback evidence;
- T13 = blocked by first real source-honest continuity receipt;
- T14 = runner core implemented, physical pending;
- T15 = typed hash-chain frozen, physical pending;
- T16 = not yet proven.

D03 accepts the stronger cross-gate rule:
all T11~T16 must PASS on one coherent immutable physical evidence cut.

Evidence from different runner heads or different physical runs may not be combined into one PASS unless exact code/data/evidence-cut equivalence is independently proven.

This mirrors D03 same-parent discipline:
one valid fact from parent A and another valid fact from parent B do not jointly prove a claim about one immutable decision state.

### TI-1418~1420 — bounded TWTAWU negative completeness shortest path

Current TWSE TWTAWU JSON contract is useful for positive rows but lacks an authoritative total-count/range-completeness field strong enough to turn HTTP 200 + empty data into negative proof.

Shortest truthful candidate:
- derive the exact suspension query interval from the selected replay window;
- capture official TWSE JSON for that exact query;
- capture an independent official TWSE CSV/HTML representation of the same query/scope;
- normalize both;
- compare query scope and row-set parity.

Before using an empty witness-window result as negative evidence, the parity contract must first physically succeed on a positive bounded interval containing known suspension rows.

Rules:
- never guess an export URL;
- capture the actual official export/page request or another verified official representation;
- row-set, scope, pagination, truncation or schema mismatch => `SUSPENSION_COVERAGE_UNKNOWN`;
- only a frozen, already-positive-tested parity contract may support `NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW`.

This converts negative evidence from “nothing came back” to:
“the same bounded official query is complete under independently matching representations, and the witness has zero relevant rows.”

### TI-1421 — physical hash-chain completeness

The physical NC-T01 typed chain now requires:
- SYSTEM2_POLICY_FINGERPRINT_SHA256;
- A1_BATCH_SHA256;
- PIT_REPLAY_SHA256;
- SOURCE_HISTORY_SHA256;
- CONTINUITY_RECEIPT_SHA256;
- CONTINUITY_TRANSFORM_SHA256;
- FACTOR_SNAPSHOT_SHA256;
- PERSISTENCE_BATCH_SHA256;
- ORCHESTRATION_SHA256;
- SHADOW_ACCOUNTING_SHA256;
- HIDDEN_FALLBACK_AUDIT_SHA256.

D03 treats any missing required typed digest as evidence incompleteness, not as an optional provenance field.

### TI-1422 — maturity / exact next

No D03 maturity promotion:
- 56.7%;
- 12 active modules;
- 10 at L3/60 milestone;
- D03-09 / D03-10 remain L2/40;
- raw source/version = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Immediate parallel gates:
A. DATA_LANE physically proves exact-window TWTAWU JSON-vs-official-export bounded parity and composes the three TWSE corporate-action exact-range sources into a real continuity receipt;
B. BUILD_LANE closes CORR-005 using exact-head transitive static audit + runtime forbidden-access evidence and binds `HIDDEN_FALLBACK_AUDIT_SHA256`.

After both:
execute one real artifact-only SHORT_MOMENTUM NC-T01 and require T11~T16 PASS on one coherent immutable evidence cut.

General open-boundary lifecycle correctness remains a separate post-CORR004 issue.


## 2026-10-08 D03 — TI-1423~1440 indicator-L3 gate ownership split + CORR-006 W0/W1/W2 consumer semantics

Canonical D03 artifact:
- `research/d03_indicator_l3_vs_nct01_physical_gate_ownership_split_20261008_v0_1.json`.

Cross-lane sources:
- `S2-CORR-20261007-005` = HIGH / OPEN / BUILD_LANE;
- `S2-CORR-20261007-006` = HIGH / OPEN / BUILD_LANE;
- `research/d16_sda022_nct01_hidden_fallback_oracle_20261008_v0_1.json`;
- `research/d16_sda022_nct01_strategy_executable_witness_oracle_20261008_v0_1.json`;
- official TWSE TWTAWU page `https://www.twse.com.tw/zh/trading/historical/twtawu.html`.

### TI-1423~1426 — W0 / W1 / W2 claims are distinct

D03 adopts the D16 witness-layer separation:

- W0 = `CONTINUITY_READY_WITNESS`;
- W1 = `STRATEGY_EXECUTABLE_WITNESS`;
- W2 = `RANK_ELIGIBLE_WITNESS`.

W0 proves an exact-session-selected technical window has source-honest continuity certification under the required market-data source/lifecycle evidence.
It may support technical-window PIT feasibility and deterministic indicator replay.

W0 does NOT prove:
- SHORT_MOMENTUM required strategy evidence is complete;
- legitimate zero-pick;
- System2 physical independence;
- rank eligibility;
- predictive alpha.

W1 additionally requires explicit strategy-required evidence completeness:
- `requiredEvidenceComplete=true`;
- `missingRequiredEvidenceCount=0` or exact equivalent;
- matched evaluation identity;
- strategyValidity not INCOMPLETE.

W2 is a later ranking/candidate-stage claim and is not part of D03 L3 technical-feasibility admission.

### TI-1427~1430 — CORR-006 is a real NC-T01 defect but not an indicator-formula defect

Current merged NC-T01 receipt path can promote a continuity-ready symbol even when strategy-required evidence remains incomplete.
This can falsely convert input incompleteness into:
- `requiredInputsState=READY`;
- `executionState=EXECUTED`;
- candidateGenerationExecutable;
- legitimate zero-pick;
- later physical-independence claims.

D03 accepts CORR-006 as HIGH / real / BUILD_LANE-owned.

However the defect concerns the transition:
W0 continuity-ready -> W1 strategy-executable.

It does not invalidate the underlying W0 technical window merely because SHORT_MOMENTUM has some other missing required evidence.

Hard rule:
`CONTINUITY_READY_DOES_NOT_IMPLY_STRATEGY_EXECUTABLE`.

Equal hard rule:
`STRATEGY_INCOMPLETE_DOES_NOT_RETROACTIVELY_INVALIDATE_AN_OTHERWISE_VALID_TECHNICAL_CONTINUITY_WINDOW`.

### TI-1431~1434 — D03 L3 technical feasibility vs NC-T01 physical independence

D03 L3 means Taiwan PIT data feasibility.

Therefore D03-09 / D03-10 technical-feasibility hard gates remain technical-data claims:
- exact expected-vs-observed eligible-session identity;
- lifecycle boundary authority for every excluded session;
- bounded negative completeness when an absence claim is used;
- real post-replay hash-bound technical-continuity receipt;
- D03 PIT source-version / known-at causality;
- genuine Formal-to-C1 parent when same-parent admission is required;
- complete expected-parent reconciliation;
- indicator-specific formula/replay guards.

System2 NC-T01 physical-independence gates are separate:
- S22-T11~T16 one coherent immutable evidence cut;
- CORR-005 five-dimensional hidden-fallback static + runtime absence proof;
- `HIDDEN_FALLBACK_AUDIT_SHA256`;
- CORR-006 at least one W1 strategy-executable witness;
- artifact-only physical run;
- no System1 Top6/rank fallback.

Consequences:
- CORR-005 may block NC-T01 physical independence without invalidating a source-honest D03 technical-continuity receipt;
- CORR-006 may block strategy execution / zero-pick without invalidating W0 technical PIT feasibility;
- an NC-T01 physical PASS still does not prove D03 predictive incrementality;
- D03 L3 technical feasibility still does not prove System2 physical independence.

This removes governance over-gating from the D03 module-promotion path without relaxing any physical-independence rule.

### TI-1435~1437 — TWTAWU representation-parity feasibility is official, export contract still unpinned

Independent primary-page readback confirms the TWSE TWTAWU official page:
- supports bounded date-period queries;
- supports a security code or all-listed scope;
- states data availability from 2011-10-03 onward;
- exposes both Print/HTML and CSV Download controls.

D03 therefore accepts:
`BOUNDED_OFFICIAL_REPRESENTATION_PARITY_FEASIBLE_IN_PRINCIPLE`.

But:
- the actual official CSV/HTML export request contract has not been captured;
- its response completeness / pagination / truncation semantics are not yet pinned;
- no export URL is guessed;
- empty JSON cannot be promoted to `NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW`.

Current state:
`FEASIBLE_NOT_PINNED`.

### TI-1438 — lifecycle open-boundary remains distinct

D16 post-CORR004 review confirms:
- STOP + no positively certified RESUME/termination/active-through proof cannot be allowed to delete sessions through an arbitrary `coverageTo`;
- a bare query end is not lifecycle boundary authority.

This remains a general history-reader correctness issue and is independent of CORR-006.

For D03:
- Bollinger exact 20-session support cannot be shortened by uncertified open STOP intervals;
- ADX ordered H/L/C recursion cannot skip resumed sessions based on uncertified open STOPs.

### TI-1439 — module immediate path is shortened

D03-10 remains the first promotion target.

Its immediate technical-feasibility path is now:
1. real exact-window TWSE bounded suspension/source completeness;
2. real post-replay hash-bound technical continuity receipt;
3. genuine V8.20 parent / exact 20 eligible sessions / Layer-C known-at / formula-source and parent reconciliation.

It does NOT need to wait for CORR-005 or CORR-006 merely to evaluate W0 technical L3 admission.

D03-09 follows the same W0 path, then additionally requires canonical Wilder FULL_REPLAY / replay-certified trusted prior state.

CORR-005 / CORR-006 continue in parallel for System2 physical NC-T01 and cannot be used to manufacture D03 maturity.

### TI-1440 — maturity / inventory / exact next

No maturity promotion:
- D03 = 56.7%;
- active modules = 12;
- 10 at current L3/60 milestone;
- D03-09 / D03-10 = L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Exact D03 next:
1. prioritize the first real W0 technical-continuity receipt for an exact-session-ready TWSE witness under bounded source completeness;
2. if W0 is valid, evaluate D03-10 L3 under its own preregistered technical gates immediately rather than waiting for CORR-005/CORR-006;
3. keep CORR-005/CORR-006 as parallel System2 physical-independence gates;
4. keep annual V0.6, raw third session, genuine V8.20 parent, T48, S2-07, D03 dedup/redundancy and D16 predictive incrementality independent.


## 2026-10-08 D03 — TI-1441~1458 physical parent attempt classification

Canonical artifact:
`research/d03_system1_parent_attempt_20261007_v0_1.json`

Physical System1 evidence:
- workflow `System 1 C1 Prospective Evidence`;
- run `37652129851`, job `112897875757`;
- market date `2026-10-07`;
- run created `2026-10-08 00:27:08 Asia/Taipei`;
- artifact `11496544209`;
- artifact ZIP digest `sha256:90291db1aa7b2d5ec4be397235ec217313777707ca610c4ddf28b1e51c8925a2`.

### TI-1441~1446 — physical parent attempt occurred and failed before parent creation
The scheduled attempt physically ran.
Generation-inventory validation = PASS.
V8.20 Formal-C1 binding readback validation = PASS.
Immutable C1 population read/verify = FAIL.

Preserved readiness:
`scanDate=2026-10-07`;
`FORMAL_SCAN_NOT_CONFIRMED`;
`C1_GENERATION_NOT_FOUND`;
`formalScanDate=2026-09-29`;
`formalPipelineComplete=false`;
`institutionReady=true`;
`qualityReady=false`;
`missingQuality=[QUARTER_EPS]`;
`eligibleForResearch=false`;
`mayCountAsZeroPick=false`.

Frozen interpretation:
`PARENT_GENERATION_ABSENT != V8_20_BINDING_LEDGER_DEFECT`.
There was no genuine 2026-10-07 C1 generation available for authoritative binding.

### TI-1447~1451 — blocker narrowed but D03 does not promote
Earlier scheduled evidence had missing quality `FINANCIAL + QUARTER_EPS`.
This physical attempt has only `QUARTER_EPS`.
The upstream quality blocker set therefore narrowed from two families to one.

Run `37565002528` separately proves Node standard-HTTPS MOPSOV transport feasibility in a read-only GitHub runner.
It does not prove Production deployment/live-readback of that transport repair for the failed parent attempt.

T48 remains separate completeness debt and is not the immediate cause of a generation that never existed.

### TI-1452~1455 — anti-shortcut
- missing C1 parent is not zero-pick;
- workflow failure is not negative technical-indicator evidence;
- later recovery cannot synthesize a missing decision-time parent;
- V8.20 engineering/readback semantics PASS does not imply genuine parent existence.

W0 technical-continuity research remains independent of the parent-generation failure.

### TI-1456~1457 — D03-10 admission machinery is already executable
`research/d03_bollinger_l3_acceptance_v0_2.mjs` already enforces exact 20 eligible sessions, exact date-set equality, source/bar identities and hashes, technical/corporate-action continuity, causal source clocks, zero unresolved sessions/events, no pseudo bars, population standard deviation and deterministic state/window hashes.

`research/d03_parent_continuity_binding_v0_2.mjs` already binds parent cutoff/known-at, evidence cut, continuity receipt, sourceHistoryHash, continuityTransformHash and exact eligible date-set identity.

Therefore D03-10 is:
`ACCEPTANCE_ORACLE_READY / PHYSICAL_INPUTS_PENDING`.

D03-09 reuses that parent/continuity path but still additionally requires canonical Wilder H/L/C FULL_REPLAY or replay-certified trusted prior state.

### TI-1458 — maturity and exact next
No promotion:
D03 56.7%; 12 active modules; 10 at current L3/60 milestone; D03-09 / D03-10 L2/40; raw source-version gate 2/3; outcomes CLOSED; Formal Core LOCKED.

Exact next is dual-track:
1. W0: first real exact-window source-honest technical-continuity receipt under bounded TWSE suspension/corporate-action completeness. CORR-005/CORR-006 do not block D03 W0.
2. Parent: next actual ordinary-session C1 artifact containing a genuine immutable C1 generation plus authoritative V8.20 Formal-to-C1 binding after upstream official-quality repair has Production/live-readback evidence.

When W0 and genuine parent both pass, execute the existing D03-10 L3 and parent-binding oracles immediately.


## 2026-10-08 D03 — TI-1459~1466 CORR-005 / CORR-006 engineering firewalls verified closed

Latest canonical correction queue now records both:
- `S2-CORR-20261007-005 = VERIFIED_CLOSED`;
- `S2-CORR-20261007-006 = VERIFIED_CLOSED`.

Shared implementation merge:
`d56f05fbc5986d00adbc81392b9dc0711de5043e`.

Independent closure:
`ae31dcc258469a3200926d4a8ba8942635379879`.

Queue synchronization:
`5adb2210f0fffa1e12789e51303b2eccf59f24df`.

### TI-1459~1462 — CORR-005 closure
The NC-T01 hidden-fallback firewall now fails closed when audit evidence is missing or unknown.
Merged-main evidence binds an exact-head audit digest and proves all five forbidden fallback dimensions absent with runtime forbidden-access count zero.

Audit artifact:
- id `11513234786`;
- digest `sha256:2ed893d49e6ba352c6671c87fb4c384d962b7bbae62110c02132f2a399f3c4cb`;
- audit digest `474f511dc592c9882da3f045bdca5e8ad87a36aa41e9f36f6517ce0c04a9f037`.

This closes the code firewall only.
It does not credit physical S22-T11~T16 and does not create D03 W0 technical continuity.

### TI-1463~1465 — CORR-006 closure
W0 continuity-ready is now explicitly separated from W1 strategy-executable.
Required-evidence completeness / missing-required-evidence count / assessment identity govern execution promotion and legitimate zero-pick.

This confirms the D03 ownership split already frozen in TI-1423~1440:
a valid technical-continuity W0 receipt can be consumed for D03 technical feasibility without borrowing System2 W1/W2 physical-independence evidence.

The corrected fingerprint-bound runtime required fingerprint regeneration.
Canonical merged-main hashes are now:
- SHORT_MOMENTUM `2b50405eb452d89fac996e549e927235c1ce4e5bb0373e8fc0e5243117c5a9bd`;
- SWING_GROWTH `727ddc86494ee0d0c2359deee727a8369e2744be7f7c0d0fd5a6efecc4e254af`.

### TI-1466 — S2-07 stabilization remains open
New cross-room readback does not close S2-07:
- captureCount = 3;
- unionVersionKeyCount = 168;
- latestCaptureVersionKeyCount = 163;
- trailingIdenticalTransitions = 0;
- boundedStabilizationCandidate = false;
- expectedMopsKeysetComplete = false.

Therefore S2-07 remains `STABILIZATION_PENDING`.

D03 remains 56.7%, D03-09 / D03-10 remain L2/40, raw source/version gate remains 2/3, outcomes CLOSED, Formal Core LOCKED.
Exact D03 next remains W0 real receipt + future genuine parent. CORR-005/006 are removed from the open engineering blocker list but their closure is not used as D03 maturity credit.


## 2026-10-08 D03 — TI-1459~1474 W0 / genuine-parent dual-track readiness compression

Canonical artifact:
- `research/d03_w0_parent_dual_track_readiness_20261008_v0_1.json`.

Latest-main observations:
- CORR-005 = VERIFIED_CLOSED;
- CORR-006 = VERIFIED_CLOSED;
- W0 technical-continuity receipt = still physically pending;
- 2026-10-07 genuine System1 parent attempt = physically executed but no C1 generation existed;
- D03-10 Bollinger L3 acceptance oracle + parent-binding oracle are already executable once physical inputs exist.

### TI-1459~1461 — CORR-005 / CORR-006 removed from D03 technical blockers

CORR-005 code firewall is verified closed:
- missing/UNKNOWN hidden-fallback evidence now fails closed;
- exact-head static + runtime forbidden-access evidence is required;
- `HIDDEN_FALLBACK_AUDIT_SHA256` is bound for System2 physical independence.

CORR-006 code firewall is verified closed:
- W0 continuity-ready is separated from W1 strategy-executable;
- explicit `requiredEvidenceComplete` / missing-required-evidence count governs W1;
- W0 alone cannot promote execution or legitimate zero-pick.

D03 interpretation:
- these are System2 physical-independence protections;
- they no longer belong on the D03-09/D03-10 W0 technical-feasibility blocker chain;
- physical S22-T11~T16 still need a real coherent NC-T01 run, but D03 L3 does not wait on that physical independence claim.

### TI-1462~1466 — W0 shortest truthful path compressed

Exact-session identity is already physical PASS under CORR-004.
Replay-first continuity binding and legacy-label sanitization are merged.

The remaining W0 sequence is now only:
1. capture the actual official TWSE TWTAWU export/HTML request contract; do not guess export parameters;
2. prove the frozen official JSON-vs-export parity contract on a positive bounded interval;
3. use physical positive control 1218/TWSE suspension 2026-08-13 -> 2026-08-14 from run 37488505236 / job 112354734503;
4. freeze representation/query normalization before inspecting the target witness;
5. apply the same bounded completeness contract to the exact selected replay interval of a real history-ready TWSE witness such as 1101;
6. combine with TWSE exact-range ex-right/dividend, capital-reduction and par-value-change sources;
7. emit `CLEAR_NO_ACTION_ELIGIBLE` only when event/session/source completeness is physically complete; otherwise preserve `ADJUSTED_CONTINUITY_REQUIRED` or `CONTINUITY_UNKNOWN`;
8. bind sourceHistoryHash/replayHash/receiptHash/exact eligible dates/source-evidence hashes to the selected replay.

Physical positive-control provenance:
- 1218/TWSE;
- suspended 2026-08-13;
- resumed 2026-08-14;
- bounded source query 2026-04-05..2026-10-02;
- rows = 383;
- source artifact hash = `10a78954777b94f838ad4996bad02891ef1e97597f684434b4c7b36d5a659857`;
- source row hash = `40fbafe3fac0f7bafc60f08ca7cb873da716cdce846decfadcd5122ff8197927`.

This proves a real positive row exists for parity falsification.
It does NOT yet prove negative completeness.

Current export state remains:
`OFFICIAL_PAGE_HAS_HTML_AND_CSV_CONTROLS / QUERY_ENDPOINT_CONFIRMED / EXPORT_REQUEST_NOT_PINNED`.

An external TWSE route reconstruction confirms the query endpoint and parameter family:
`/rwd/zh/afterTrading/TWTAWU?startDate=...&endDate=...&querytype=...&stockNo=...`.
It does not expose the official CSV/HTML request contract.
D03 therefore refuses to guess `response=csv` or equivalent.

### TI-1467~1470 — genuine parent path compressed to Production-quality proof + new session

Physical 2026-10-07 parent attempt:
- workflow run 37652129851 / job 112897875757;
- generation inventory validation PASS;
- V8.20 binding-readback validation PASS;
- immutable C1 population verification FAIL because no C1 generation existed;
- `FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND`;
- institutionReady=true;
- qualityReady=false;
- missingQuality = QUARTER_EPS only;
- eligibleForResearch=false;
- mayCountAsZeroPick=false.

This is not a V8.20 ledger defect.

Transport diagnosis is now sharply separated from source availability:
- official MOPSOV host is reachable;
- Node standard HTTPS probe run 37565002528 physically returned HTTP 200 / 50,742 bytes in 7.411s;
- repository candidate commit `9a00f072064110d256537ee7cf322f34aae0abcf` uses native HTTPS for MOPSOV;
- PR #769's 90-second deadline repair is merged as `d13ff8a40007a3e7e8f8ab0fdfb0970c73fd0d08`;
- but Production deployment/live readback of the native-HTTPS quality acquisition repair remains unproven.

Hard distinction:
`REPOSITORY_TRANSPORT_REPAIR_EXISTS != PRODUCTION_QUALITY_REPAIR_PROVEN`.

Shortest truthful parent path:
1. obtain Production-deployed/live-readback evidence of the native-HTTPS or equivalent quality repair;
2. next ordinary Taiwan session must reach official quality readiness including QUARTER_EPS;
3. a genuine immutable C1 generation must physically exist;
4. V8.20 Formal-to-C1 authoritative binding must bind that exact generation;
5. only then may D03 consume the parent.

No later recovery may backfill the missing 2026-10-07 parent.

### TI-1471~1473 — D03-10 / D03-09 promotion mechanics

D03-10 remains the first promotion target.

Its machine admission is already available:
- `research/d03_bollinger_l3_acceptance_v0_2.mjs`;
- `research/d03_parent_continuity_binding_v0_2.mjs`.

D03-10 promotes only when:
- real W0 technical continuity accepted;
- genuine V8.20 parent accepted;
- exact 20 eligible sessions on that parent;
- Layer-C known-at causality;
- formula/source guards PASS;
- COMPLETE expected-parent reconciliation.

D03-09 uses the same W0 + genuine-parent path, then additionally requires canonical Wilder H/L/C FULL_REPLAY or replay-certified trusted prior state.

Neither module may use:
- fixture W0 receipts;
- System2 physical-independence PASS as a substitute for D03 technical continuity;
- a missing parent as zero-pick;
- repository-only native-HTTPS repair as Production quality evidence.

### TI-1474 — maturity / inventory / exact next

No maturity promotion:
- D03 = 56.7%;
- active modules = 12;
- current L3/60 milestone = 10 modules;
- D03-09 / D03-10 = L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Independent open debts remain:
- raw source-version third session;
- T48 generation-set finalization;
- S2-07 stabilization;
- System2 D03 raw-vs-dedup diagnostics;
- System1 D03 redundancy diagnostics;
- D16 D03 predictive incrementality.

Exact next:
consume whichever promotion-grade physical input lands first, without cross-credit:
A. first real exact-window source-honest W0 technical-continuity receipt under frozen bounded TWTAWU + corporate-action completeness;
B. next genuine ordinary-session immutable C1 generation + authoritative V8.20 Formal-to-C1 binding after Production/live-readback official-quality repair.

When both exist on admissible evidence cuts, immediately run the existing D03-10 Bollinger L3 + parent-binding oracles.


## 2026-10-08 D03 — TI-1475~1494 CORR-007 suspension provenance promotion firewall

Canonical D03 artifacts:
- `research/D03_CORR007_SUSPENSION_PROVENANCE_PROMOTION_FIREWALL_20261008_V0_1.md`;
- `research/d03_corr007_suspension_provenance_acceptance_cases_20261008_v0_1.json`;
- `research/test_d03_corr007_suspension_provenance_acceptance_v0_1.mjs`.

Upstream finding:
- `S2-CORR-20261008-007` = HIGH / OPEN / BUILD_LANE;
- canonical audit = `system2/evidence/S2_STAGE1_NCT01_SUSPENSION_PROVENANCE_BINDING_AUDIT_20261008_V0_1.json`.

### TI-1475~1480 — current CLEAR_NO_ACTION path has an additive suspension-provenance gap

Latest-main code accepts `suspensionCoverageByExchange.TWSE=COMPLETE` as a plain status inside the corporate-action completeness receipt. Promotion then validates sourceEvidenceRefs only against the three TWSE corporate-action exact-range source contracts. A bounded TWTAWU suspension-completeness receipt identity/digest is not independently mandatory.

Therefore:
- three valid corporate-action refs do not prove suspension completeness;
- hashing an unproven COMPLETE string does not prove source lineage;
- exact-session readiness does not prove negative suspension completeness;
- a real positive suspension row proves parser/representation behavior only, not complete absence over a different replay window.

This defect is directly relevant to D03-09/D03-10 because a false `CLEAR_NO_ACTION_ELIGIBLE` receipt could admit contaminated RAW bars as technical continuity.

### TI-1481~1487 — D03 promotion firewall

D03 accepts a W0 CLEAR_NO_ACTION receipt only when all of the following are jointly bound:
1. exchange = TWSE and suspension interval exactly equals the selected replay interval;
2. first-class bounded suspension evidence includes a 64-hex digest, source family/version and receipt version;
3. one matching suspension sourceEvidenceRef is additive to the three corporate-action refs;
4. evidence timing is causal: prospective observedAt or verified availableAt is no later than the decision cutoff;
5. zero partial-source rows and zero unresolved lifecycle conflicts;
6. source absence alone does not certify NO_EVENT;
7. exact-session reconciliation is ready;
8. archive/completeness hash changes when the suspension receipt digest changes.

Missing, mismatched, late or unbound suspension evidence must resolve to `CONTINUITY_UNKNOWN`, never CLEAR_NO_ACTION.

Ownership remains separated:
- BUILD_LANE implements the binding firewall;
- DATA_LANE produces the real bounded TWTAWU receipt;
- D03 owns only the inference/promotion guard and later readback.

### TI-1488~1491 — executable falsification matrix

The 20-case oracle passes. It rejects missing evidence, invalid/mismatched digest, wrong interval/exchange, partial coverage, missing source ref, post-cutoff observation, insufficient corporate-action refs, exact-session failure, archive-hash nonbinding, missing versions, absence inference, conflicts and partial-source execution.

Observed:
`status=PASS; cases=20; plainCompleteRejected=true; digestMutationChangesBoundInput=true; d03MaturityPct=56.7; formalCoreImpact=NONE_LOCKED`.

Counterevidence is preserved:
- the oracle proves contract mechanics only;
- CORR-007 remains OPEN until merged-main implementation and independent verification;
- no real bounded suspension receipt exists yet;
- no W0 technical-continuity receipt exists yet;
- OOS, walk-forward, multiple testing, cost, fillability, market-state and alpha evidence remain UNKNOWN.

### TI-1492~1494 — maturity and exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules = 10 L3/60 + 2 L2/40;
- D03-09 / D03-10 remain L2/40;
- outcomes CLOSED;
- Formal Core LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next is still dual-track but W0 is refined:
A. first accept merged-main CORR-007 implementation/independent verification, then consume a real exact-window bounded TWTAWU receipt whose immutable digest/source/timing is bound additively with all three corporate-action refs into the archive and continuity receipt; only then may CLEAR_NO_ACTION qualify;
B. independently consume the next genuine ordinary-session immutable C1 generation plus authoritative V8.20 Formal-to-C1 binding after Production/live-readback official-quality repair.

When both admissible inputs exist, execute the existing D03-10 Bollinger L3 and parent-binding oracles. D03-09 remains second and additionally requires canonical Wilder H/L/C full replay or replay-certified trusted state.


## 2026-10-08 D03 — TI-1495~1510 CORR-007 versioned receipt compatibility gate

Canonical D03 artifacts:
- `research/D03_CORR007_VERSIONED_RECEIPT_COMPATIBILITY_GATE_20261008_V0_1.md`;
- `research/d03_corr007_versioned_receipt_gate_cases_20261008_v0_1.json`;
- `research/test_d03_corr007_versioned_receipt_gate_v0_1.mjs`.

Upstream canonical refinement:
- `system2/evidence/S2_CORR_007_SUSPENSION_PROVENANCE_BINDING_HANDOFF_20261008_V0_1.json`;
- commit `08e55e4e9e9347aae7cd5f737751c101778e516f`;
- preferred evidence-bound schema identity = `S2_CA_COMPLETENESS_RECEIPT_V0_2`;
- legacy status-only `S2_CA_COMPLETENESS_RECEIPT_V0_1` must fail closed for physical promotion.

### TI-1495~1500 — semantic strengthening requires a machine-visible version boundary

CORR-007 changes the meaning of suspension completeness from a plain COMPLETE status to immutable evidence-bound completeness.

D03 therefore rejects silent semantic upgrading:
- a legacy V0.1 receipt does not become V0.2 by adding a digest field;
- historical V0.1 receipts must not be rewritten or relabelled;
- a V0.2 wrapper may not carry a V0.1 status-only source contract;
- unrelated source-capture/event schemas do not need forced version changes;
- any alternative BUILD mechanism must preserve the same machine-visible legacy-versus-evidence-bound distinction.

This is required because payload-shape inference would let stale receipts pass after the contract meaning changes.

### TI-1501~1507 — executable anti-stale-receipt falsification

The 16-case oracle passes.

Positive control requires jointly:
- explicit V0.2 completeness schema;
- exact TWSE replay/archive interval;
- COMPLETE state backed by source family and V0.2 source contract;
- immutable 64-hex bounded receipt digest;
- matching sourceEvidenceRef identity and digest;
- causal observedAt or availableAt;
- three independent corporate-action refs;
- exact-session readiness;
- zero partial-source rows and zero unresolved conflicts.

Negative cases reject:
- legacy V0.1, including V0.1 with a valid-looking digest;
- V0.2 wrapper with V0.1 source semantics;
- missing family/version;
- invalid digest;
- interval mismatch;
- source-ref identity/digest mismatch;
- late prospective or verified-source evidence;
- fewer than three corporate-action refs;
- partial source, unresolved conflict or exact-session failure.

Observed:
`status=PASS; cases=16; legacyV01Rejected=true; crossVersionMixRejected=true; digestMutationChangesBoundInput=true; d03MaturityPct=56.7; formalCoreImpact=NONE_LOCKED`.

### TI-1508~1510 — counterevidence, maturity and exact next

This gate proves only version compatibility and anti-stale-receipt behavior.
It does not prove:
- merged-main CORR-007 implementation;
- independent exact-head implementation verification;
- real bounded TWTAWU receipt;
- physical W0 technical continuity;
- genuine V8.20 parent;
- OOS, walk-forward, multiple-testing, cost, fillability, market-state or alpha value.

All unavailable physical claims remain UNKNOWN.

No maturity promotion:
- D03 = 56.7%;
- 12 active modules = 10 L3/60 + 2 L2/40;
- D03-09 / D03-10 remain L2/40;
- outcomes CLOSED;
- Formal Core LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next:
A. consume merged-main CORR-007 V0.2-equivalent implementation plus independent exact-head verification, explicitly proving legacy V0.1 fail-closed and digest/hash-chain sensitivity;
B. then consume a real exact-window TWTAWU bounded suspension receipt bound additively with all three corporate-action refs into archive and continuity hashes;
C. independently consume a future genuine ordinary-session immutable C1 generation and authoritative V8.20 Formal-to-C1 binding;
D. when W0 and the genuine parent both exist, run the existing D03-10 Bollinger L3 and parent-binding oracles; D03-09 additionally requires canonical Wilder H/L/C FULL_REPLAY or replay-certified trusted state.


## 2026-10-08 D03 — TI-1511~1526 CORR-007 merged-main V0.2 implementation acceptance

Canonical D03 artifact:
- `research/d03_corr007_merged_main_implementation_acceptance_20261008_v0_1.json`.

Merged implementation:
- merge commit `836184f98726449107cdbd0ed83e2746bbbcf965`;
- component commit `6ecc2e33406675e73bc4d2e3e36ae0c968ba5c86`: evidence-bound corporate-action completeness V0.2;
- component commit `012d5dc43314276a16f9bdeb562122e0fe35dda5`: immutable TWSE suspension evidence required for NC-T01.

Exact-head machine evidence:
- System2 Research CI `37720705098` SUCCESS;
- NC-T01 Continuity Replay Binding `37720705101` SUCCESS;
- NC-T01 Artifact Runner `37720705126` SUCCESS;
- V8 Regression `37720705066` SUCCESS.

### TI-1511~1516 — CORR-007 engineering implementation is materially present on main

Latest runtime now makes evidence-bound suspension completeness machine-distinct from legacy status-only semantics.

Accepted:
- `S2_CA_COMPLETENESS_RECEIPT_V0_2` is explicit;
- NC-T01 physical continuity promotion requires V0.2 schema identity;
- legacy V0.1 fails closed for promotion;
- V0.2 with a plain COMPLETE string but no evidence-ready suspension receipt remains incomplete;
- suspension evidence must bind exact interval, sourceId, sourceFamily, sourceContractVersion, immutable 64-hex receipt digest, observedAt and availability semantics;
- verified-source timestamp evidence additionally requires availableAt.

D03 therefore removes `CORR007_IMPLEMENTATION_PENDING` from its own W0 technical-feasibility blocker chain.

Governance boundary:
the canonical System2 correction queue still says CORR-007 OPEN because AUDIT_LANE closure has not yet been written.
D03 does not change that queue state and does not claim `VERIFIED_CLOSED`.

### TI-1517~1521 — promotion path now binds additive suspension provenance

Merged tests demonstrate:
- legacy V0.1 receipt => `CONTINUITY_UNKNOWN`;
- status-only V0.2 without suspension evidence => `CONTINUITY_UNKNOWN`;
- missing TWSE suspension sourceEvidenceRef => fail closed;
- suspension receipt digest mismatch => fail closed;
- suspension source identity mismatch => fail closed;
- prospective suspension evidence observed after decision cutoff => fail closed;
- verified-source evidence available after decision cutoff => fail closed;
- valid evidence-bound suspension + three corporate-action refs preserves the intended CLEAR_NO_ACTION test path;
- mutating only the suspension receipt digest changes the archive receipt hash and final continuity receiptHash.

This satisfies the D03 TI-1495~1510 anti-stale-receipt / hash-sensitivity engineering requirement.

### TI-1522~1524 — remaining W0 gap is now producer-side physical evidence

No real bounded TWTAWU negative-completeness receipt exists yet.
The frozen positive-control contract still requires:
- real 1218/TWSE 2026-08-13 -> 2026-08-14 positive row;
- exact bounded query scope;
- official representation parity;
- immutable raw response hashes and parity receipt digest;
- only then may an exact-window no-row result support `NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW`.

The official TWSE human page continues to expose HTML/print and CSV download controls, but the actual CSV/HTML request contract remains unpinned.
Browser/scrape attempts in this D03 session did not yield a trustworthy request contract.
D03 therefore does not guess `response=csv` or any export parameter.

Important:
V0.2 provenance binding proves that a supplied suspension receipt is immutably bound.
It does not manufacture or semantically validate a suspension receipt that DATA_LANE has not physically produced.

### TI-1525 — module blocker compression

D03-10 Bollinger:
- exact-session identity = physical PASS on the accepted real TWSE path;
- replay-first continuity binding = merged;
- legacy continuity leakage = blocked;
- CORR-007 V0.2 provenance binding = machine accepted;
- immediate remaining W0 blocker = real bounded TWTAWU physical receipt + three CA refs -> real W0 continuity receipt.

D03-09 ADX has the same immediate W0 blocker and later additionally requires canonical Wilder FULL_REPLAY / replay-certified trusted prior state.

### TI-1526 — maturity / exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules = 10 L3/60 + 2 L2/40;
- D03-09 / D03-10 remain L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Dual-track exact next:
A. W0: consume first real exact-window bounded TWTAWU suspension-completeness receipt under the frozen positive-control parity contract, bind it additively with all three TWSE corporate-action refs, and run the real W0 continuity certifier;
B. Parent: independently consume the next genuine ordinary-session immutable C1 generation plus authoritative V8.20 Formal-to-C1 binding after Production/live-readback quality repair.

When both admissible inputs exist, immediately execute the existing D03-10 Bollinger L3 acceptance and parent-binding oracles. D03-09 remains second and additionally requires canonical Wilder H/L/C FULL_REPLAY or replay-certified trusted state.


## 2026-10-08 D03 — TI-1527~1544 ADX suspension/resume Wilder-state semantics + latest genuine-parent attempt narrowing

Canonical D03 artifacts:
- `research/d03_adx_suspension_resume_wilder_state_semantics_20261008_v0_1.json`;
- `research/test_d03_adx_suspension_resume_wilder_state_semantics_v0_1.mjs`;
- `research/d03_adx_suspension_resume_wilder_state_execution_receipt_20261008_v0_1.json`;
- `research/d03_system1_parent_attempt_20261008_v0_2.json`.

Machine execution:
- `D03 ADX Suspension Resume Semantics Readonly` run `37728272815` = SUCCESS;
- companion `V8 Regression Tests` run `37728272818` = SUCCESS;
- exact tested head = `faae9cb4701d20879a53fb8eb97ff860809e3876`.

### TI-1527~1531 — pure suspension uses eligible-bar chronology, not calendar decay

D03 makes explicit a previously under-specified ADX state transition rule.

When:
- the suspension interval is positively certified;
- the exact eligible-session set is certified;
- no relevant price-basis-changing corporate action exists inside the interval;
- symbol identity remains the same;
- source history is hash-bound;

then:
- non-trading dates create no OHLC/TR/DM pseudo rows;
- calendar days do not advance Wilder recurrence;
- no arbitrary calendar-day decay is applied to TR/DM/ADX state;
- no automatic reset occurs merely because the suspension was long;
- the first resumed eligible bar is the next bar in eligible-session chronology;
- its TR and DM compare to the last pre-suspension eligible bar under the same certified price basis;
- therefore a genuine post-suspension gap is allowed to enter TR/DM rather than being erased.

This is a formula/state semantics rule, not an alpha claim.
A long suspension may remain a separate regime/context diagnostic.

### TI-1532~1535 — price-basis-changing events require transformed replay

If the suspension overlaps a certified ex-right/dividend, capital reduction, par-value change or equivalent technical price-basis event:
- RAW pre-event H/L/C may not be directly bridged into RAW post-event H/L/C for promotion-grade ADX;
- a continuity transform / technical price factor must be certified;
- transform identity/hash must bind to the exact source-history window;
- ADX must be recomputed on the certified continuity-transformed H/L/C history, or consume a replay-certified trusted prior state in that same price space.

A text label such as `ADJUSTED_CONTINUITY` does not transform RAW bars.

For Bollinger, the same rule prevents raw pre/post corporate-action closes from sharing one 20-session window without certified continuity transformation.

### TI-1536~1538 — identity termination ends recursive state lineage

If the old symbol identity terminates because of reorganization, share conversion, delisting or market migration:
- old-symbol ADX/Wilder state terminates;
- old-symbol Bollinger finite-window lineage terminates;
- the new identity starts its own state lineage by default;
- automatic cross-symbol recursive-state inheritance is forbidden.

Only a separately versioned economic-identity continuity contract with transformed history may authorize a cross-identity bridge.

Therefore “reset” at this boundary means:
`NEW_IDENTITY_NEW_STATE_LINEAGE`,
not:
`RESET_AFTER_LONG_CALENDAR_GAP`.

### TI-1539~1541 — arbitrary reset/wait thresholds remain separate hypotheses

The following are explicitly noncanonical:
- reset ADX after X calendar days;
- decay Wilder state during suspension using synthetic zero-input bars;
- reset after X eligible bars without replay evidence;
- reseed from an arbitrary post-resume sample.

Any such proposal is a new preregistered parameter-family hypothesis and cannot mutate `PF_D03_ADX_CANONICAL`.

Existing warm-up rule remains:
`ADX_STATE_CERTIFICATION = FULL_REPLAY_OR_TRUSTED_PRIOR_STATE`.

The prior ~65-bar readiness behavior of KD/RSI/MACD remains non-transferable to ADX.

### TI-1542 — machine falsifier

Run `37728272815` passed the deterministic guard.
It explicitly checks:
- no automatic calendar-gap reset;
- no synthetic zero-input decay;
- no pseudo-bars during suspension;
- no RAW bridge across price-basis change;
- no recursive-state inheritance across identity termination;
- unresolved event boundary => fail closed;
- reset-after-X rule => new parameter-family hypothesis only.

Companion V8 regression run `37728272818` also passed.
Formal Core remains untouched.

### TI-1543 — latest System1 parent physical attempt narrows but does not close the parent blocker

Latest-main real run:
- workflow: `System 1 C1 Prospective Evidence`;
- run `37724488223`;
- job `113139437528`;
- head `08328c8cfd0b253f56009e4192474e31d7f6807e`;
- market date `2026-10-07`;
- artifact `11527267198`;
- artifact zip SHA-256 `2c7e4581e61c4a3c5470ea670f0c0baf58058a4865a76e1595c8240d21a16559`.

Physical result:
- generation-inventory semantic validation = PASS;
- V8.20 Formal->C1 binding semantic validation = PASS;
- immutable C1 population read/verify = FAIL;
- category = `FORMAL_SCAN_NOT_CONFIRMED`;
- verification failure = `C1_GENERATION_NOT_FOUND`;
- formalScanDate = `2026-09-29`;
- formalPipelineComplete = false;
- institutionReady = true;
- qualityReady = false;
- current missingQuality = `[QUARTER_EPS]`;
- eligibleForResearch = false;
- mayCountAsZeroPick = false.

Compared with an earlier observed `[FINANCIAL, QUARTER_EPS]` quality blocker set, FINANCIAL is no longer missing in this physical receipt.

Scientific boundary:
this narrows the current observed blocker set but does NOT prove QUARTER_EPS is the sole causal reason Formal scan remains stale.
A future live quality-ready run plus actual Formal scan advancement is still required.

The absent 2026-10-07 C1 generation may not be synthesized retrospectively.

### TI-1544 — maturity / exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules = 10 current L3/60 + 2 L2/40;
- D03-09 / D03-10 remain L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Immediate dual-track next remains physical:
1. W0: first real exact-window, parity-certified TWTAWU bounded negative-completeness receipt -> all three TWSE corporate-action refs -> real hash-bound W0 continuity receipt;
2. Parent: a new ordinary-session live quality-ready run with QUARTER_EPS ready, actual Formal scan advancement, genuine immutable C1 generation and authoritative V8.20 Formal->C1 binding.

When both are available:
- D03-10 runs its existing Bollinger L3 + parent-binding oracles immediately;
- D03-09 applies the newly frozen suspension/resume semantics inside canonical Wilder FULL_REPLAY / trusted-state certification.

Independent gates remain:
- raw source-version third session;
- T48 generation-set finalization;
- S2-07 stabilization;
- System2 D03 raw-vs-dedup diagnostics;
- System1 D03 redundancy diagnostics;
- D16 D03 predictive incrementality.


## 2026-10-08 D03 — TI-1545~1564 decision-PIT firewall + price-reset/identity family-set closure

Canonical D03 artifacts:
- `research/d03_corr009_decision_pit_evidence_consumer_acceptance_20261008_v0_1.json`;
- `research/d03_price_reset_and_identity_continuity_family_set_20261008_v0_1.json`.

Upstream engineering:
- `S2-CORR-20261008-009`;
- merge `c7afee03aec24d1c5a3a79e71cb4c8250a67b61e`;
- correction state at this D03 readback = `FIX_IMPLEMENTED` / independent AUDIT_LANE closure pending;
- exact-head targeted workflow `37732779734` PASS;
- merged-main targeted workflow `37732958236` PASS.

### TI-1545~1550 — factor-level PIT evidence is now a machine precondition for frozen decisions

D03 accepts the merged decision-evidence firewall as an engineering prerequisite.

For every `KNOWN` decision-supporting factor:
- `pointInTimeEligible` must be true;
- `availableAt` must be valid and no later than `decisionTimestamp`;
- factor marketDate and decisionTimestamp must match the frozen decision clock;
- SYMBOL-scope factor must match the decision symbol;
- exact `factorId@factorVersion` must be authorized by frozen factor refs;
- immutable sourceId and source payload hash are required.

For every evidence family:
- a KNOWN family assessment must map to exact supporting factor observation hashes;
- strategy-id/version and authorized factor family mappings must match the frozen contract.

If any blocker exists:
- effective frozen decision becomes INCOMPLETE;
- rank and score are cleared;
- entry readiness is blocked where present;
- prediction snapshot exposes the decisionEvidence blocker/hash state;
- outcome join is blocked.

D03 canonical rule:
`FORMULA_CORRECTNESS_DOES_NOT_IMPLY_DECISION_TIME_ADMISSIBILITY`.

This closes the previously demonstrated AP-01 engineering path in which future/non-PIT factor evidence could be frozen as SELECTED.

### TI-1551~1554 — D03 indicator consequence

The firewall applies equally to direct price/trend transforms and named indicators.

D03-01~04:
- prior L3 Taiwan-PIT feasibility is retained;
- future frozen-decision evidence must use exact decision-clock-admissible observations.

D03-10 Bollinger:
- exact 20-session arithmetic is insufficient if the resulting factor observation is not decision-time admissible;
- exact-window correctness and factor availability are independent gates.

D03-09 ADX:
- canonical Wilder replay correctness is insufficient if the computed/observed factor is not available by the decision clock;
- replay lineage and decision-time evidence admission remain independent.

Non-PIT/future observations may remain archived only as diagnostic/UNKNOWN evidence and may not support ranking, selection, capacity or outcome joins.

No maturity credit is granted because this removes a look-ahead path; it does not establish indicator alpha or satisfy W0/parent gates.

### TI-1555~1559 — D03 price-reset family set is now explicit

D03 freezes:
`D03_PRICE_RESET_FAMILY_SET_V0_1`
for domestic ordinary common-equity technical price continuity.

Required price-reset families:
1. EX_RIGHT_DIVIDEND;
2. CAPITAL_REDUCTION;
3. PAR_VALUE_CHANGE.

Domestic ordinary-share mechanical unit split/consolidation caused by official par-value change is mapped into PAR_VALUE_CHANGE and must not be duplicated as a generic split/reverse-split family.

Scope limits:
- ETF beneficiary-certificate split/reverse split is outside this ordinary-equity baseline;
- foreign/TDR/other security classes do not inherit this mapping;
- legal company demerger is not a stock-unit split alias.

Future W0 receipts must expose:
- `priceResetFamilySetVersion`;
- `priceResetCoverageReceiptHash`;
- exact selected session/date-set identity;
- source evidence hashes;
- bounded suspension receipt identity/digest;
- identity-transition disposition and evidence hash;
- continuityReceiptId/sourceHistoryHash/replayHash and source clocks.

### TI-1560~1562 — identity transition is not an ordinary price adjustment

Merger, share conversion, delisting, market migration, identifier replacement or demerger that changes security identity are:
`PAIR_OR_SEQUENCE_COMPARABILITY_BLOCKER`
by default.

D03 default:
`NEW_IDENTITY_NEW_TECHNICAL_LINEAGE`.

Therefore:
- Bollinger finite-window lineage terminates on old-security identity termination;
- ADX/Wilder recursive state terminates on old-security identity termination;
- no cross-symbol state/history inheritance is allowed merely because an exchange ratio or successor reference price exists;
- a cross-identity bridge requires a separately versioned same-security/economic-identity transform contract with transformed-history provenance.

Three clean price-reset families cannot certify technical continuity across an unresolved identity transition.

### TI-1563 — W0 family-completeness anti-shortcut

The first real W0 CLEAR_NO_ACTION path now requires all of:
- exact eligible-session identity;
- evidence-bound exact-window TWTAWU suspension completeness;
- EX_RIGHT_DIVIDEND family coverage;
- CAPITAL_REDUCTION family coverage;
- PAR_VALUE_CHANGE family coverage;
- explicit same-security identity-transition disposition;
- exact replay/source-history hashes;
- causal source availability clocks.

Important:
- share-denominator-only events do not automatically block raw price-space continuity when they do not reset exchange price space;
- however any downstream market-cap/share-denominator factor remains separately gated by its own denominator vintage;
- price-space continuity and share-denominator completeness may not alias each other.

### TI-1564 — physical state / maturity / exact next

Current physical state at 2026-10-08 13:40+ Taipei:
- no real W0 CLEAR_NO_ACTION continuity receipt observed;
- no new 2026-10-08 ordinary-session genuine System1 parent observed;
- latest System1 C1 prospective physical attempt remains run `37724488223` for marketDate 2026-10-07 and failed closed;
- latest parent blocker remains stale Formal scan plus quality not ready in that receipt;
- no retrospective synthesis is permitted.

D03 remains:
- maturity = 56.7%;
- 12 active modules;
- 10 at current L3/60 milestone;
- D03-09 / D03-10 = L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Exact next:
1. W0 track — consume a real exact-window parity-certified TWTAWU bounded negative-completeness receipt; require D03_PRICE_RESET_FAMILY_SET_V0_1 + explicit same-security identity-transition disposition; bind all evidence into the real hash-bound continuity receipt.
2. Parent track — consume the next actual ordinary-session System1 parent attempt only when live quality readiness, Formal scan advancement, genuine immutable C1 generation and authoritative V8.20 binding exist.
3. When W0 + genuine parent both exist, run D03-10 Bollinger L3 and parent-binding oracles immediately.
4. D03-09 then applies canonical suspension/resume semantics inside Wilder FULL_REPLAY / trusted-state certification.
5. CORR-009 governance remains pending independent AUDIT_LANE closure; do not confuse engineering acceptance with governance closure.
6. Keep raw third-session, T48, S2-07, D03 dedup/redundancy and D16 incrementality independent.


## 2026-10-08 D03 — TI-1565~1584 indicator backtest PIT universe and denominator firewall

Canonical D03 artifacts:
- `research/D03_INDICATOR_BACKTEST_PIT_UNIVERSE_DENOMINATOR_FIREWALL_20261008_V0_1.md`;
- `research/d03_indicator_backtest_pit_universe_cases_20261008_v0_1.json`;
- `research/test_d03_indicator_backtest_pit_universe_v0_1.mjs`.

Cross-lane engineering source:
- `S2-CORR-20261008-014`;
- merged implementation commit `4dfa01cb3dd47845ed768e261f6a3d3d9191a9f7`;
- correction queue remains OPEN / independent verification pending.

### TI-1565~1570 — clean indicator arithmetic does not cure a survivor-biased universe

D03 freezes:
`INDICATOR_FORMULA_CORRECTNESS_DOES_NOT_PROVE_HISTORICAL_UNIVERSE_VALIDITY`.

A multi-date or cross-sectional technical-indicator study must bind, for each decision date:
- the exact historical market-symbol membership known at that decision;
- registry and historical-universe snapshot hashes;
- known exclusions and their reasons;
- replay eligibility and unresolved membership states;
- the exact decision timestamp;
- a denominator that reconciles eligible, accounted, sampled and state-count totals.

Today's surviving symbols cannot be replayed backward as the historical universe.
A later delisting/membership-end fact cannot be exposed inside a prior decision receipt.
Unknown membership or exclusion is UNKNOWN, not absent.

This applies to all D03 modules whenever they support historical cross-sectional or multi-date claims, especially:
- ret5/ret20/ret60 ranks;
- trend persistence and momentum continuation;
- pullback/reversal comparison;
- Bollinger/ADX promotion evidence;
- indicator redundancy and incremental-value tests.

### TI-1571~1576 — zero samples have three non-equivalent meanings

D03 separates:
1. `PROVED_EMPTY_PIT_UNIVERSE` — the historical universe was genuinely empty under an immutable receipt;
2. `NONEMPTY_UNIVERSE_ALL_EXCLUDED` — symbols existed, but policy/data gates excluded them;
3. `UNIVERSE_OR_DENOMINATOR_UNKNOWN` — membership/exclusion/accounting proof is incomplete.

Only the first may support a completed zero-sample date.

The second is not a natural zero-sample market and must remain explicit.
The third blocks completion.

This prevents selection-bias laundering in which a difficult date loses all symbols through exclusions and is then counted as a clean empty observation.

### TI-1577~1581 — plan and resume identity

Before any resume checkpoint is trusted, the research plan must bind:
- dataset manifest;
- policy registration;
- evaluator code;
- factor definition;
- regime version;
- execution assumptions;
- cost model.

Any change creates a different plan identity.
An old checkpoint cannot resume after indicator formula, factor family, regime definition, execution assumption or cost model changes.

Checkpoint admission also requires:
- valid checkpoint hash;
- matching plan hash;
- valid partition hashes;
- valid rolling digest;
- completed-date/date-summary/sample reconciliation.

This closes a path where zero physical samples or a forged completed-date list could be labelled a finished backtest.

### TI-1582~1583 — executable falsification and evidence limits

The D03 oracle passes 22 cases.

Observed:
`status=PASS; cases=22; currentSurvivorUniverseRejected=true; allExcludedZeroSampleRejected=true; provedEmptyUniverseAccepted=true; factorIdentityMutationChangesPlanInput=true; d03MaturityPct=56.7; formalCoreImpact=NONE_LOCKED`.

Additional OOS / walk-forward admission:
- training and test dates must not overlap;
- walk-forward order must be causal;
- date-cluster audit must be complete;
- factor evidence must be available by the decision clock.

Counterevidence:
- these are deterministic contract tests;
- no physical D03 historical panel or predictive outcome is created;
- no multiple-testing correction, redundancy residual, transaction cost, fillability or market-state result is created;
- CORR-014 queue remains open pending independent governance verification;
- a merged engineering firewall is not D03 alpha evidence.

Unavailable claims remain UNKNOWN.

### TI-1584 — maturity and exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules = 10 L3/60 + 2 L2/40;
- D03-09 / D03-10 remain L2/40;
- outcomes CLOSED;
- Formal Core LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Primary physical next remains:
1. W0 — first real exact-window parity-certified TWTAWU bounded receipt, D03 price-reset family set, same-security identity disposition and real continuity hash chain;
2. parent — next actual ordinary-session genuine immutable C1 generation with live quality readiness, advanced Formal scan and authoritative V8.20 binding;
3. when W0 + parent exist, run D03-10 Bollinger admission; D03-09 then adds canonical Wilder full replay.

Independent validation debt:
4. after CORR-014 independent closure, future D03 OOS/walk-forward panels must bind per-date PIT universe receipts and immutable plan/checkpoint identities;
5. keep raw third-session, T48, S2-07, D03 dedup/redundancy and D16 incrementality independent.


## 2026-10-08 D03 — TI-1585~1602 price-reset state-memory equivalence + stale gate cleanup

Canonical artifacts:
- `research/d03_price_reset_state_memory_equivalence_20261008_v0_1.json`;
- `research/test_d03_price_reset_state_memory_equivalence_v0_1.mjs`;
- `research/d03_price_reset_state_memory_equivalence_execution_receipt_20261008_v0_1.json`.

Canonical workflow:
- `D03 Price Reset State Memory Equivalence Readonly`;
- run `37777565250`;
- job `113312153751`;
- head `363f9cc08ff6f71f1783df37e87eee71252cc84f`;
- conclusion SUCCESS.

### TI-1585~1587 — current physical promotion conclusion

No new real W0 CLEAR_NO_ACTION continuity receipt exists on latest main.
No new genuine ordinary-session immutable C1 parent with authoritative V8.20 Formal-to-C1 binding exists.
Therefore D03-10 and D03-09 remain L2/40.

However stale governance status is corrected:
- S2-CORR-20261008-007 = VERIFIED_CLOSED;
- S2-CORR-20261008-009 = VERIFIED_CLOSED;
- S2-CORR-20261008-014 remains FIX_IMPLEMENTED / independent AUDIT_LANE verification pending.

Thus CORR-009 is no longer a live D03 blocker. Its decision-PIT firewall is now a closed code/governance prerequisite; physical W0/parent/PIT evidence remains independently required.

### TI-1588~1591 — finite-memory versus recursive-memory theorem

Bollinger20x2 is finite memory:
- output at t depends only on the exact 20 eligible closes in the frozen formula;
- if all exact 20 closes are strictly after the last certified price-basis reset and remain in one continuing security identity/price space, older pre-reset prices have zero direct formula influence;
- this does not waive W0 continuity, parent identity, Layer-C known-at, exact-session or source-lineage gates.

ADX14 is recursive memory:
- elapsed bars do not create automatic amnesia;
- a historical contamination can remain in Wilder smoothed TR/+DM/-DM and ADX state indefinitely;
- ADX therefore still requires FULL_REPLAY, replay-certified trusted prior state, or a separately proved state-transform equivalence.

This formally explains why D03-10 remains the first L3 promotion target.

### TI-1592~1597 — mature Wilder affine-state equivalence candidate

For a certified same-security positive affine price-basis transform:
`P' = a P + b`, `a > 0`,
applied uniformly to the certified pre-event prefix, machine proof establishes a mature-state equivalence candidate.

State mapping:
- previous H/L/C -> `a * H/L/C + b`;
- smoothed TR -> `a * smoothedTR`;
- smoothed +DM -> `a * smoothedPlusDM`;
- smoothed -DM -> `a * smoothedMinusDM`;
- +DI / -DI / DX / ADX remain dimensionless and unchanged at the transform boundary.

Reason:
- all H/L/C differences scale by a and additive b cancels;
- directional sign/order is preserved for a>0;
- Wilder smoothing is linear in the price-dimensional states;
- DI ratios therefore remain unchanged;
- DX/ADX consume dimensionless ratios.

Machine M01 compares transformed mature-state continuation against full replay on the affine-transformed prefix and passes within floating precision.
Local preflight final ADX absolute difference = `4.263256414560601e-14`.

This is NOT yet promotion authority.
It requires, for a real event:
- certified affine transform over the exact prefix;
- exact formula version;
- mature initialized state;
- same security identity;
- state-lineage hash;
- decision-time causality;
- exact parity under the real transform's rounding/tick semantics.

If transformed bars are rounded/nonlinear in a way that is not algebraically state-equivalent, use full replay instead.

### TI-1598 — raw bridge falsification

Machine M02 proves that simply continuing a RAW pre-event ADX state into post-reset target-basis bars diverges from certified transformed replay.

Frozen rule:
`RAW_PRE_RESET_STATE + POST_RESET_BAR != TECHNICAL_CONTINUITY`.

A continuity label alone cannot repair the state.

### TI-1599~1601 — Bollinger mixed-window and 20-session amnesia

Machine M03:
- with 1, 5 or 19 post-reset eligible closes, a window that mixes untransformed RAW pre-reset closes with post-reset closes materially differs from the certified transformed window;
- RAW mixing is rejected.

Machine M04:
- at 20 post-reset eligible closes, the exact rolling Bollinger window contains no pre-reset close;
- transformed-prefix replay and post-reset-only 20-close calculation become exactly equal in the fixture;
- the equality remains for later windows.

Therefore a future parent-specific Bollinger acceptance may treat older-than-window price-reset history as formula-irrelevant only when:
- the exact 20-session suffix is wholly post-reset;
- same security identity continues;
- the price space is certified;
- the exact session/date-set and source lineage are proven.

Identity termination remains a new lineage and cannot use this finite-memory rule to inherit the old symbol.

### TI-1602 — maturity / exact next

No maturity promotion:
- D03 = 56.7%;
- active modules = 12;
- current L3 milestone modules = 10;
- D03-09 ADX = L2/40;
- D03-10 Bollinger = L2/40;
- raw source/version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Primary continuation remains dual-track:
1. W0 — first real exact-window source-honest continuity receipt binding bounded TWTAWU evidence, D03_PRICE_RESET_FAMILY_SET_V0_1, identity-transition disposition, exact replay/source-history/session/source hashes;
2. Parent — next genuine ordinary-session immutable C1 generation with authoritative V8.20 Formal-to-C1 binding and live official quality readiness.

When both arrive:
- D03-10 runs Bollinger L3 and parent-binding oracles immediately;
- if its exact 20 parent sessions are wholly post-reset in one certified identity/price basis, no older transformed history is required by the Bollinger formula itself;
- D03-09 still requires canonical FULL_REPLAY or replay-certified trusted state. The new affine mature-state theorem may become one trusted-state certification route only after a real-event exact parity and rounding proof.

Keep CORR-014 audit closure, raw third-session, T48, S2-07 stabilization, System1/System2 D03 dedup/redundancy and D16 incrementality independent.


## 2026-10-08 D03 — TI-1603~1618 CORR-014 closure + Bollinger parent-specific post-reset finite-memory shortcut

Canonical D03 artifacts:
- `research/d03_bollinger_post_reset_parent_shortcut_spec_20261008_v0_1.json`;
- `research/d03_bollinger_post_reset_parent_shortcut_v0_1.mjs`;
- `research/test_d03_bollinger_post_reset_parent_shortcut_v0_1.mjs`;
- `research/d03_bollinger_post_reset_parent_shortcut_execution_receipt_20261008_v0_1.json`.

Canonical workflow:
- `D03 Bollinger Post-Reset Parent Shortcut Readonly`;
- run `37800889318`;
- job `113392478117`;
- head `d0476a06df75662e8c3887ba109d6386508ed198`;
- conclusion SUCCESS.

### TI-1603~1605 — stale CORR-014 audit debt is closed

Fresh latest-main correction-queue readback confirms:
- `S2-CORR-20261008-014 = VERIFIED_CLOSED`;
- implementation merge = `4dfa01cb3dd47845ed768e261f6a3d3d9191a9f7`;
- independent AUDIT_LANE code-firewall acceptance is complete.

Accepted meaning:
- forged completion checkpoints fail closed;
- PIT-universe identity/checkpoint/run identity are hash-reconciled;
- survivor/current-universe callbacks cannot claim PIT-complete history without historical membership proof;
- zero-sample completion cannot be manufactured without a separately proved empty PIT-universe receipt.

D03 consequence:
`CORR014_AUDIT_PENDING` is removed from the active blocker set.

Non-credit:
- no physical D03 historical panel is thereby created;
- no OOS/walk-forward alpha, predictive outcome, regime robustness, cost/fillability or universe completeness is implied;
- future D03 empirical panels still need per-date physical PIT-universe receipts.

### TI-1606~1610 — parent-specific Bollinger finite-memory shortcut frozen

The existing M04 theorem proved the mathematical finite-memory result.
This round adds a parent-specific machine admission oracle.

Shortcut eligibility requires all of:
- parent-continuity binding already valid;
- frozen Bollinger formula version `BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1`;
- exactly 20 unique eligible parent sessions;
- all 20 session dates strictly after the last certified price-basis reset date;
- reset evidence known no later than the parent decision cutoff;
- `D03_PRICE_RESET_FAMILY_SET_V0_1` identity;
- same-security identity continuing;
- explicit `SAME_SECURITY_CONTINUING` identity-transition disposition;
- zero unresolved reset events;
- zero pseudo bars.

If all pass:
`PRE_RESET_HISTORY_ZERO_DIRECT_FORMULA_INFLUENCE`.

This is a formula-memory statement only.
It does not create:
- W0 continuity;
- a genuine V8.20 parent;
- Layer-C known-at;
- technical-continuity source provenance;
- D03-10 L3 by itself.

### TI-1611~1614 — adversarial cases

Machine run `37800889318` passes six deterministic cases:

1. exact 20 clean post-reset parent sessions -> shortcut eligible;
2. one retained pre-reset session -> fail closed;
3. security identity terminated -> fail closed;
4. reset known only after parent decision cutoff -> fail closed;
5. unresolved reset event remains -> fail closed;
6. only 19 eligible sessions -> fail closed.

Therefore:
`POST_RESET_20_CLEAN_SESSIONS`
is not a soft heuristic.
It is a strict exact-set, identity and causality condition.

### TI-1615 — why this matters for the dual-track promotion path

Current W0 + parent path is still physical and unchanged.

But when both real inputs arrive:
- if D03-10's exact 20 accepted parent sessions are all clean post-reset, old pre-reset transformed history is not required by the Bollinger formula itself;
- the existing Bollinger L3 + parent-binding oracles can proceed without manufacturing or replaying formula-irrelevant older history;
- if any retained session crosses the reset boundary, the shortcut is unavailable and the main continuity oracle still governs transformed retained closes or fail-closed behavior.

This reduces future evidence work without weakening any promotion gate.

### TI-1616 — ADX remains structurally different

No equivalent elapsed-window amnesia is granted to D03-09.

ADX remains recursive:
- FULL_REPLAY remains canonical;
- a replay-certified trusted state remains acceptable only under its own certification;
- the previously proven mature affine-state transform remains a candidate route only after real-event transform/rounding parity and state-lineage certification.

The new Bollinger shortcut must not be copied to ADX.

### TI-1617 — current physical state

No new real W0 continuity receipt exists at this readback.
No new ordinary-session genuine immutable C1 parent with authoritative V8.20 Formal-to-C1 binding exists.

Latest parent attempt remains:
- marketDate `2026-10-07`;
- C1 generation absent;
- quality not ready;
- current observed missingQuality = `QUARTER_EPS`;
- may not count as zero-pick or negative indicator evidence.

CORR-005, CORR-006, CORR-007, CORR-009 and CORR-014 are closed code/governance firewalls and must not remain in the active D03 promotion blocker list.

### TI-1618 — maturity and exact next

No maturity promotion:
- D03 = 56.7%;
- 12 active modules;
- 10 current L3/60 milestone modules;
- D03-09 ADX = L2/40;
- D03-10 Bollinger = L2/40;
- raw source-version gate = 2/3;
- outcomes = CLOSED;
- Formal Core = LOCKED.

Primary dual-track exact next remains physical:
1. W0 — first real exact-window source-honest continuity receipt with bounded TWTAWU negative completeness, D03 price-reset family set, same-security identity disposition and exact replay/source/session/source hashes;
2. Parent — next ordinary-session live-quality-ready genuine immutable C1 generation with authoritative V8.20 Formal-to-C1 binding.

When both exist:
- run the parent-specific post-reset shortcut first;
- then run the existing D03-10 Bollinger L3 + parent-binding oracles;
- if shortcut eligible, older pre-reset history is formula-irrelevant;
- if shortcut ineligible, use the main continuity/transformed-history path or fail closed.

D03-09 remains FULL_REPLAY/trusted-state only.
Independent gates still open:
- raw third source-version session;
- T48 generation-set finalization;
- S2-07 stabilization;
- System2 D03 raw-vs-dedup diagnostics;
- System1 D03 redundancy diagnostics;
- D16 D03 predictive incrementality.
