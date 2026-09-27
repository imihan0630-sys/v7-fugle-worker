# System 2 Technical Semantic-Basis Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / DESIGN_AUDIT / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Audit System 2's current TECHNICAL factor inventory, TECHNICAL_STRUCTURE_ENGINE and CONFLUENCE_ENGINE against the frozen Technical Indicator Minimal Semantic Basis V0.1.

Goal:
prevent future implementation from accidentally treating aliases, nested transforms or multiple descriptors from the same semantic basis as independent bullish/bearish votes.

No System 2 weights, thresholds, strategy states or runtime behavior are changed by this audit.

## TI-181 — Current System 2 architecture has the correct principle

Current System 2 documents already state:
- indicators are auxiliary/context signals;
- multiple indicators derived from the same price series must not be double-counted;
- factor families should aggregate before cross-family confluence;
- majority voting is rejected;
- hard invalidation/conflict can override auxiliary optimism.

Therefore the conceptual architecture is aligned with the new B1-B8 basis.

This audit is a hardening step, not a finding that current System 2 is already mis-scoring indicators.

## TI-182 — Remaining implementation gap: family-level wording is not machine-enforced basis provenance

Current technical output examples include:
- MA slope/alignment;
- KD;
- MACD;
- RSI;
- ATR;
- DMI/ADX;
- Bollinger;
- ROC/Momentum;
- pattern topology;
- candlestick state.

Without machine-readable basis metadata, a future scorer could still accidentally do:

score += KD_bullish
score += RSI_bullish
score += MACD_bullish
score += ROC_positive
score += MA_slope_positive

even though these may collapse mainly into B1/B3/B4 and share the same price path.

The current prose rule is necessary but insufficient as an engineering invariant.

## TI-183 — Frozen semantic provenance fields for future technical evidence

Any future System 2 technical evidence item SHOULD carry, at research-contract level:

- evidenceId
- ownerFamily
- semanticBasisIds[]
- transformClass
- canonicalPrimitiveIds[]
- redundancyGroupId
- parentEvidenceIds[]
- interactionHypothesisId (nullable)
- directScoreEligible
- explanationOnly
- formulaVersion
- asOf
- availableAt
- dataQualityState

Allowed transformClass:
- PRIMITIVE
- EXACT_ALIAS
- LINEAR_OR_MONOTONE_RESCALING
- NESTED_TRANSFORM
- WITHIN_BASIS_COMPOSITE
- CROSS_BASIS_COMPOSITE
- CONTEXT_MODIFIER
- LIFECYCLE_STATE
- VISUALIZATION_ONLY

These fields are a research/design contract only.

## TI-184 — Scoring firewall

Future technical aggregation must satisfy:

### Rule A — exact aliases
If transformClass is EXACT_ALIAS or LINEAR_OR_MONOTONE_RESCALING of an already-counted canonical primitive:
- directScoreEligible = false.

Examples:
- ROC20 vs ret20;
- Williams %R vs Fast Stochastic %K.

### Rule B — nested transforms
A NESTED_TRANSFORM cannot receive an independent score merely because its threshold/crossover differs.

Examples:
- StochRSI;
- TRIX/TEMA/HMA-style variants;
- KST-style stacked ROC filters.

Default:
- explanation/comparator only until incremental residual value is proven.

### Rule C — within-basis composites
Multiple fields inside one basis dimension must first aggregate to one basis-state representation before cross-family confluence.

Example:
B4 may contain MA slope, MACD DIF, MACD histogram slope and crossover.
They are not four independent votes.

### Rule D — cross-basis composites
A composite consuming multiple basis dimensions does not automatically count once in each basis plus again as a composite.

Example:
MFI cannot count as:
- price-path vote;
- volume vote;
- MFI bonus
simultaneously without an explicit preregistered interaction hypothesis.

### Rule E — context is not a vote
Regime, liquidity, price-limit constraint, Pattern lifecycle and data validity change interpretation/eligibility; they are not extra technical-indicator points by default.

## TI-185 — Basis ownership mapping for System 2 technical layer

T1 Trend Structure:
- B1 RETURN_DISPLACEMENT
- B4 FILTERED_TREND_TRANSITION
- B5 PATH_EFFICIENCY_TREND_PERSISTENCE

T2 Structural Levels:
- B2 RANGE_LOCATION_EXTREME_RECENCY
- shared with Pattern structural-level ownership

T3 Pattern Topology:
- geometry/lifecycle layer outside direct indicator basis, built from B1/B2/B5/B6/B7 observations.

T4 Pattern Lifecycle:
- context/lifecycle modifier, not another indicator basis.

T5 Candlestick/Sakata:
- B7 OHLC_GAP_CANDLE_GEOMETRY.

T6 Technical Indicator Auxiliary:
- KD -> B2
- RSI -> B3
- MACD -> B4
- ATR -> B6
- MA/EMA -> B4
- DMI/ADX -> B5 + B6
- Bollinger -> B6 (+ B4 center/location context)
- ROC -> B1 alias of retN
- OBV -> B8 crossed with B1, but PRICE_VOLUME-owned.

T7 Volatility/Compression:
- B6, with Pattern compression geometry as a separate topology/lifecycle representation.

T8 Multi-timeframe:
- horizon/context operator across B1-B8; not a ninth vote.

T9 Failure/False-break:
- lifecycle/acceptance modifier; not an independent indicator basis.

## TI-186 — Confluence-engine hardening

The existing CONFLUENCE_ENGINE rule "aggregate within evidence families before cross-family confluence" is retained.

New research interpretation:
Within TECHNICAL_STRUCTURE, aggregation should occur at least at semantic-basis level before an overall technical-family state is constructed.

Recommended conceptual flow:

raw technical fields
-> basis decomposition
-> within-basis dedup/residualization
-> technical-structure state
-> cross-family confluence with PRICE_VOLUME / MARKET_REGIME / other thesis families

Not:

raw technical fields
-> independent bullish/bearish votes
-> majority score.

## TI-187 — Interaction exception

A cross-basis interaction may deserve separate testing when the mechanism is explicit.

Example:
- B2 fresh range breakout
x B8 abnormal participation
x valid acceptance lifecycle.

This is not "KD bullish + volume bullish."
It is a preregistered breakout-participation mechanism with component controls.

Requirements:
- interaction named before outcomes;
- component-only baseline;
- incremental-value test;
- no duplicate score if interaction is accepted;
- regime / liquidity / cost / PIT controls.

## TI-188 — Strategy-specific implication

SHORT_MOMENTUM:
technical basis can be PRIMARY timing evidence, but basis duplication is especially dangerous because the strategy already emphasizes price action.

SWING_GROWTH / FUNDAMENTAL_GROWTH / INDUSTRY_TREND:
technical basis is mainly timing/supportive evidence and must not overwhelm the fundamental/industry thesis through many correlated price-derived subfeatures.

INSTITUTIONAL_ACCUMULATION:
oscillators remain timing/context; PRICE_VOLUME and CHIP_OWNERSHIP own the primary mechanism.

VALUE_REVERSION:
low RSI/KD cannot rescue a structurally deteriorating fundamental thesis; technical reversal evidence must remain downstream of valuation/fundamental durability and repair mechanism.

## TI-189 — Machine-checkable anti-double-counting proposal

Before numeric scoring is ever frozen, a research validator should be able to reject:
- two evidence items with the same canonicalPrimitiveId both marked directScoreEligible;
- an EXACT_ALIAS marked directScoreEligible;
- a VISUALIZATION_ONLY item marked directScoreEligible;
- an interaction scored in addition to all identical component contribution without an explicit interaction policy;
- a PRICE_VOLUME-owned indicator scored independently inside TECHNICAL_STRUCTURE.

This validator is a future research/design recommendation only.
No runtime implementation is authorized here.

## Current status

SYSTEM2_TECHNICAL_PRINCIPLES = ALIGNED
SYSTEM2_MACHINE_BASIS_PROVENANCE = NOT_YET_ENFORCED
DOUBLE_COUNTING_RUNTIME_BUG = NOT_CLAIMED
FUTURE_IMPLEMENTATION_RISK = MATERIAL_AND_PREVENTABLE
FORMAL_OPTIMIZATION_CANDIDATE = NONE

## Exact next continuation

1. Freeze a machine-readable System 2 semantic-provenance contract for technical evidence.
2. Do not alter current System 2 strategy weights/thresholds/runtime.
3. Use the contract later when numeric technical aggregation is designed.
4. Primary technical empirical queue remains unchanged.
5. Resume evidence/data-readiness work after the design firewall is frozen.
6. Formal Core remains unchanged.

## Source anchors

- system2/SYSTEM2_FACTOR_LIBRARY.md
- system2/SYSTEM2_TECHNICAL_STRUCTURE_ENGINE.md
- system2/SYSTEM2_CONFLUENCE_ENGINE.md
- system2/SYSTEM2_STRATEGY_IDENTITY_CARDS.md
- research/TECHNICAL_INDICATOR_MINIMAL_INFORMATION_BASIS_V0_1.md
- research/technical_indicator_semantic_basis_v0_1.json
