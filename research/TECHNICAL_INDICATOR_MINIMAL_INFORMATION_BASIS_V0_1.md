# Technical Indicator Minimal Semantic Information Basis V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / SEMANTIC_BASIS_FROZEN
Formal Core: LOCKED

## Purpose

The technical-indicator lane has already pruned a large catalog of exact aliases, nested transforms, packaged indicators and role-mismatched tools.

The next problem is more fundamental:

> What small set of underlying information dimensions is actually being re-expressed by most traditional technical indicators?

This document freezes a V0.1 **semantic information basis**.

Important:
- this is NOT a PCA basis;
- this is NOT a claim that dimensions are statistically orthogonal;
- this is NOT a return-predictive factor model;
- this is a de-duplication / research-admission ontology.

A new indicator does not earn a new vote merely because its formula or name is different.

## TI-166 — Raw-data substrate versus semantic basis

At the raw observable level, most classical technical indicators consume some subset of:
- Open;
- High;
- Low;
- Close;
- Volume / turnover;
- time/session ordering.

Those fields alone are too low-level to serve as a useful anti-Factor-Zoo ontology.

The semantic basis instead asks what transformation family the indicator is trying to summarize.

## TI-167 — B1: RETURN_DISPLACEMENT

Question:
How far has price moved over a stated horizon?

Canonical primitives:
- ret5 / ret10 / ret20 / ret60;
- log-return equivalents;
- market/sector-relative return where ownership belongs to RS/sector research.

Examples mapped here:
- ROC;
- normalized Momentum;
- many "rate of change" / "price change %" indicators.

Key rule:
If an indicator is only a monotone or affine transform of an already-retained return over the same horizon, it cannot be an independent factor.

Status:
CORE_SEMANTIC_DIMENSION.

## TI-168 — B2: RANGE_LOCATION / EXTREME_RECENCY

Question:
Where is current price located relative to recent observed extremes, and how recently were those extremes made?

Canonical primitives:
- close position within rolling high-low range;
- distance to prior high/low;
- age/recency of recent high/low;
- support/resistance / rolling extreme state.

Examples mapped here:
- Stochastic / KD;
- Williams %R;
- Donchian location;
- Aroon-style extreme recency;
- parts of Ichimoku;
- parts of Bias/standardized location when the center is a rolling structural reference.

Important distinction:
Range location is not the same as signed-return balance. Two paths can end at the same recent-range location with different sequences of gains/losses.

Status:
CORE_SEMANTIC_DIMENSION.

## TI-169 — B3: SIGNED_RETURN_PATH_BALANCE

Question:
How asymmetric has the recent sequence of positive versus negative price changes been?

Canonical primitives:
- smoothed positive-return magnitude;
- smoothed negative-return magnitude;
- positive-day ratio;
- gain/loss balance.

Examples mapped here:
- RSI;
- IMI-like body-sign variants when open-to-close is substituted;
- some breadth/signed-return oscillators at a different aggregation level.

This dimension is still derived from the return path, but it is not algebraically identical to one endpoint return.

Research implication:
The only reason RSI can survive the redundancy firewall is that endpoint displacement and path balance are not identical summaries.

Status:
CORE_SEMANTIC_DIMENSION / INCREMENTAL_VALUE_UNPROVEN.

## TI-170 — B4: FILTERED_TREND / TRANSITION

Question:
What does the price path look like after low-pass / band-pass / smoothing operations, and is the filtered trend accelerating or crossing?

Canonical primitives:
- MA/EMA levels;
- normalized MA slopes;
- cross-horizon filtered spreads;
- slope changes / transition state.

Examples mapped here:
- MA/EMA systems;
- MACD DIF/signal/histogram;
- TRIX;
- PPO;
- TEMA/DEMA/HMA variants unless a distinct residual mechanism is proven;
- KST-like smoothed multi-ROC composites.

Key rule:
Changing the smoothing kernel does not by itself create a new economic information family.

Status:
CORE_SEMANTIC_DIMENSION.

## TI-171 — B5: PATH_EFFICIENCY / TREND_PERSISTENCE

Question:
How directly and persistently did price travel from start to end, as opposed to wandering/chopping?

Canonical primitives:
- absolute net move / cumulative absolute move;
- higher-high / higher-low or lower-high / lower-low persistence;
- directional movement balance;
- trend persistence;
- choppiness/trendiness descriptors.

Examples mapped here:
- ADX/DMI partly;
- Efficiency Ratio;
- VHF;
- Choppiness;
- RWI;
- trend-quality composites.

Important:
This is distinct from displacement.
Two stocks can have the same 20-day return but very different path efficiency and drawdown geometry.

Status:
CORE_SEMANTIC_DIMENSION / PRIMARY_REDUNDANCY_TEST_TARGET.

## TI-172 — B6: VOLATILITY_MAGNITUDE_AND_COMPOSITION

Question:
How variable is price, and where does that variability arise?

Subdimensions:
A. close-to-close dispersion;
B. true-range / gap-aware magnitude;
C. intraday OHLC range geometry;
D. overnight versus intraday composition;
E. compression / expansion state.

Canonical primitives:
- volatility20;
- ATR%;
- Bollinger width;
- true-range dry-up;
- range compression;
- Yang-Zhang components when provenance-valid.

Examples mapped here:
- ATR;
- Bollinger Band Width;
- Parkinson;
- Garman-Klass;
- Rogers-Satchell;
- Yang-Zhang;
- Keltner width;
- standard-deviation channels.

This family is risk/context first, not directional alpha by default.

Status:
CORE_SEMANTIC_DIMENSION / VOLATILITY_RISK_OWNED.

## TI-173 — B7: OHLC / GAP / CANDLE GEOMETRY

Question:
How did the session path occupy its observed OHLC envelope, and what discontinuity occurred across sessions?

Canonical primitives:
- open-to-close return;
- previous-close-to-open gap;
- high-low range;
- real body;
- upper/lower wick;
- close location;
- overlap/engulfing/containment;
- gap size and continuity state.

Examples mapped here:
- candlesticks / Sakata descriptors;
- AR/BR;
- IMI;
- close-location/value-location indicators;
- some gap oscillators.

Important:
This dimension requires observed OPEN and continuity-safe semantics.
Synthetic/fallback Open cannot silently become true candle geometry.

Status:
CORE_SEMANTIC_DIMENSION / PATTERN_CANDLE_SHARED.

## TI-174 — B8: PARTICIPATION / VOLUME

Question:
How much trading participation occurred relative to an appropriate baseline?

Canonical primitives:
- raw volume with explicit unit;
- turnover value;
- RVOL5/20/60;
- same-slot RVOL;
- cumulative volume pace;
- volume persistence / dry-up / expansion.

Examples mapped here:
- Volume Oscillator;
- raw volume MA ratios;
- parts of OBV/MFI/Klinger;
- many "volume momentum" indicators.

Volume magnitude alone is not directional truth.

Status:
CORE_SEMANTIC_DIMENSION / PRICE_VOLUME_OWNED.

## TI-175 — Composite dimensions are interactions, not new primitive families

Many popular indicators combine two or more basis dimensions.

Examples:
- OBV = signed return direction x participation, accumulated over time.
- MFI = Typical Price movement x value/volume x RSI-like normalization.
- Klinger = price/range trend classification x volume x filtering.
- VW-MACD = filtered trend x participation weighting.
- Keltner = filtered center x volatility envelope.
- CCI = price-center displacement x dispersion normalization.
- Supertrend = price center x ATR x path-dependent trail.
- Ichimoku = structural extrema/range midpoint x multi-horizon trend display.

These may still be useful compact descriptors.
But they are **composites**, not automatically independent evidence.

A composite deserves a prospective test only when it expresses a preregistered interaction mechanism not already represented by its components.

## TI-176 — Context and lifecycle are modifiers, not indicator primitives

The following are deliberately NOT counted as additional technical-indicator basis dimensions:
- market regime;
- sector regime;
- liquidity;
- corporate-action state;
- symbol-session validity;
- price-limit constraint;
- Pattern lifecycle;
- breakout acceptance/rejection;
- event context.

These change interpretation or data validity.
They are context/guard/lifecycle layers, not new indicator votes.

Example:
High RSI in an accepted breakout and high RSI in a failed breakout may have opposite interpretation without RSI itself changing information family.

## TI-177 — Minimum-basis admission test for any future indicator

Before adding any new indicator to research, answer in order:

1. **Formula provenance**
   - Is the exact formula/version reproducible?
   - Are initialization, missing bars and session semantics defined?

2. **Basis decomposition**
   - Which B1-B8 dimensions does it consume?

3. **Alias test**
   - Is it algebraically identical or monotone-equivalent to an existing primitive?

4. **Nested-transform test**
   - Is it only another smoothing/normalization of an existing basis variable?

5. **Interaction test**
   - If composite, what specific interaction mechanism is new?

6. **Ownership test**
   - Technical Indicator, Pattern, Price-Volume, Volatility, or Position Management?

7. **Incremental-value hypothesis**
   - What existing controls must it beat?

8. **PIT/data feasibility**
   - Can it be produced without look-ahead or invalid OHLCV semantics?

9. **Evidence budget**
   - Does the unresolved mechanism justify scarce prospective clean dates?

If steps 2-5 show no new information/mechanism, reject before outcome testing.

## TI-178 — Why common "indicator agreement" is not confluence

Suppose:
- RSI is high;
- Stochastic is high;
- Williams %R is high;
- ROC20 is high;
- MACD is positive.

This does NOT represent five independent confirmations.

The evidence may reduce to:
- B1 displacement;
- B2 range location;
- B3 signed return-path balance;
- B4 filtered trend.

Williams %R contributes zero beyond Stochastic.
ROC20 may contribute zero beyond ret20.
MACD may largely restate the same trending return path.

True cross-family confluence requires information from different ownership layers, e.g.:
- technical structure;
- price-volume acceptance;
- market/sector regime;
- fundamentals/event context;
- risk/reward.

Even then, correlations and interactions must be tested.

## TI-179 — Empirical evidence interpretation under the basis framework

Taiwan studies sometimes report that combining two indicators improves backtested performance.
This does NOT prove the indicators are independent.

Possible explanations include:
- complementary basis dimensions;
- implicit regime filtering;
- different lag/sensitivity;
- sample-specific parameter fit;
- reduced trade frequency;
- hidden liquidity exposure;
- data snooping.

Therefore "combination beats single indicator" is a hypothesis about conditional interaction, not permission to add votes.

The 2015 Taiwan all-listed/OTC study reported strong sample-period RSI/MACD results, while a 2023 Taiwan individual-stock thesis reported some two-indicator combinations outperforming single indicators but also noted liquidity and bear-market weaknesses. These are retained as evidence that conditional combinations can matter, not as evidence for majority voting.

Recent 2013-2023 Asian-index evidence on MACD/RSI also finds effectiveness varies across markets/rules, reinforcing non-universality.

## TI-180 — Current minimal semantic basis V0.1

The technical-indicator universe is reduced to eight primary semantic dimensions:

B1 RETURN_DISPLACEMENT
B2 RANGE_LOCATION_EXTREME_RECENCY
B3 SIGNED_RETURN_PATH_BALANCE
B4 FILTERED_TREND_TRANSITION
B5 PATH_EFFICIENCY_TREND_PERSISTENCE
B6 VOLATILITY_MAGNITUDE_COMPOSITION
B7 OHLC_GAP_CANDLE_GEOMETRY
B8 PARTICIPATION_VOLUME

Plus:
- COMPOSITES = interactions of B1-B8;
- CONTEXT/GUARDS/LIFECYCLE = interpretation and validity layers outside the indicator basis.

This V0.1 basis is an ontology for de-duplication.
It is not evidence that all eight dimensions deserve a score.

## Consequences for current primary queue

KD vs RSI:
- primarily tests B2 versus B3 incremental content.

MACD vs direct trend:
- tests whether a packaged B4 filter adds beyond direct B1/B4 primitives.

ADX vs trend-quality:
- tests whether ADX adds beyond B5 direct descriptors and B6 normalization.

BBW vs ATR/VCP:
- tests overlap inside B6 and against Pattern compression geometry.

This explains why the existing primary queue remains the correct high-value sequence.

## Current status

MINIMAL_SEMANTIC_BASIS_V0_1 = FROZEN
INDICATOR_CATALOG_EXPANSION = STOPPED
NEW_FACTOR_ADMISSION = BASIS_DECOMPOSITION_REQUIRED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Encode the B1-B8 basis and admission rules in a machine-readable registry.
2. Map every currently registered technical indicator to one or more B1-B8 basis dimensions and owner.
3. Add a no-double-counting diagnostic: exact alias, nested transform, within-basis composite, cross-basis composite.
4. Do not use the basis itself as a score.
5. Audit the existing System 2 technical factor library against this basis so future strategy work cannot count aliases independently.
6. After ontology QA, return to the primary empirical queue and prospective-data readiness rather than inventing new indicators.
7. Formal Core remains unchanged.

## Evidence anchors

- Cheng (2015), Taiwan stock-market MA/KD/RSI/MACD/Bias empirical study: indicator performance differed materially by rule in 2009-2014 Taiwan data.
- Yang (2023), NCCU Taiwan individual-stock technical-indicator strategy thesis: some indicator combinations improved backtested returns, with liquidity and bear-market limitations.
- Kitkanasiri & Palahan (2025), Asian-index MACD/RSI study: indicator-rule effectiveness varies across markets and rules.
- Standard technical-analysis references classify indicators into momentum/oscillator, trend/overlap, volatility and related families; this research goes further by decomposing those packaged families into system-native semantic primitives.
