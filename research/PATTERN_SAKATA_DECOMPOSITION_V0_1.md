# Sakata Five-Methods Decomposition for D01 v0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / HISTORICAL_TAXONOMY_DECOMPOSED / OUTCOME_FREE
Formal Core: LOCKED

## Purpose

Keep Sakata as a mandatory D01 research area without turning "Sakata" into one homogeneous indicator or score.

Modern descriptions group:
- Three Mountains;
- Three Rivers;
- Three Gaps;
- Three Soldiers;
- Three Methods

under Sakata Five Methods.

But these objects live at different structural scales and use different data semantics.

Therefore:
SAKATA_FIVE_METHODS
is a historical taxonomy umbrella,
not one quantitative factor.

## D01-SK01 — Three Mountains belongs to macro resistance topology

Quantitative decomposition:
- repeated confirmed highs / peaks;
- intervening pullbacks;
- upper-boundary slope;
- rejection depth progression;
- neckline / lower-zone relation;
- prior uptrend;
- break/reentry lifecycle.

Overlap:
- M / Double Top;
- Triple Top;
- Head-and-Shoulders-like peak topology;
- repeated resistance progression.

Rule:
Three Mountains must not add an independent vote on top of an M/top structure using the same peaks.

Primary layer:
MACRO_TOPOLOGY.

## D01-SK02 — Three Rivers requires an explicit definitionVariant

Modern explanations are not perfectly uniform.

Two broad interpretation families occur:
1. multi-trough / bottoming topology;
2. local multi-candle reversal taxonomy.

Therefore a Sakata record must carry:
definitionVariant.

Do not store merely:
family = THREE_RIVERS
without the underlying quantitative contract.

If used as trough topology:
it overlaps W / multi-bottom geometry.

If used as a local candle sequence:
it belongs to LOCAL_CANDLE_SAKATA and requires OPEN/OHLC relational encoding.

No attempt is made here to adjudicate one historically "true" definition.

## D01-SK03 — Three Gaps belongs to gap / price-discontinuity mechanics

Quantitative decomposition:
- gap direction;
- gap size;
- gap type only when causally definable;
- consecutive distinct gap episodes;
- fill / partial fill lifecycle;
- overnight vs intraday decomposition;
- structural location;
- corporate-action boundary;
- price-limit / session state.

Critical firewall:
gap count = 3
does NOT automatically imply exhaustion or reversal.

A third gap can be:
- continuation;
- exhaustion candidate;
- event-driven;
- price-limit-constrained;
- corporate-action mechanical if semantics are wrong.

Required data:
historical OPEN + RAW_EXECUTION / TECHNICAL_CONTINUITY separation.

Primary layer:
LOCAL_CANDLE/GAP_MECHANICS + lifecycle.

## D01-SK04 — Three Soldiers belongs to local directional candle sequence

Quantitative decomposition:
- consecutive body direction;
- close-to-close progression;
- body size / ATR;
- open-within-prior-body relation where defined;
- close location;
- wick ratios;
- overlap;
- prior trend;
- structural location.

Overlap:
- short-horizon momentum;
- closePosition;
- body/range expansion;
- breakout follow-through.

Therefore:
Three Soldiers cannot be a second vote if its apparent strength is already fully explained by the same three positive closes / strong close-location fields.

Primary layer:
LOCAL_CANDLE_SAKATA.

## D01-SK05 — Three Methods belongs to impulse-consolidation-continuation geometry

Modern candlestick descriptions generally encode:
- strong impulse candle;
- several smaller counter-trend / contained candles;
- resumption candle.

Quantitative decomposition:
- impulse magnitude;
- path efficiency;
- consolidation depth;
- consolidation range;
- containment;
- direction of internal pullback;
- resumption / boundary break.

Overlap:
- Flag;
- micro Platform;
- impulse/consolidation geometry;
- VCP final contraction in some cases;
- breakout lifecycle.

Therefore:
Rising Three Methods + bullish Flag using the same impulse/consolidation object is not two independent confirmations.

Primary layers:
COMPRESSION_PROGRESSION + TRIGGER_LIFECYCLE.

## D01-SK06 — Sakata spans at least four semantic object types

Three Mountains:
macro topology.

Three Rivers:
definition-dependent macro or local morphology.

Three Gaps:
discontinuity / session / event mechanics.

Three Soldiers:
local directional candles.

Three Methods:
impulse + consolidation + continuation.

This heterogeneity makes a single numeric "Sakata score" conceptually unsafe.

Prohibited:
- sakataMatchCount as bullish score;
- +1 point for each of the five methods;
- one universal Sakata holding period;
- one universal Sakata direction.

## D01-SK07 — Historical taxonomy vs measurable primitive

Every Sakata observation must preserve:

- sakataFamily;
- definitionVariant;
- quantitativePrimitiveIds;
- structuralLayer;
- scale;
- anchorIds or candleWindow;
- priorTrendContext;
- semanticSpaceVersion;
- dataQualityState.

Named family is explanatory metadata.

Prediction must be tested on primitives / lifecycle first.

## D01-SK08 — Sakata and W/M / Cup / VCP dedup examples

Example A:
Three Mountains and M/Triple Top share the same high anchors.
=> one macro resistance structural group.

Example B:
Three Rivers trough variant and W share the same low/high/low anchors.
=> one macro bottom structural group.

Example C:
Rising Three Methods and short Flag share the same impulse + consolidation anchors.
=> one impulse-consolidation object.

Example D:
Three Soldiers appears immediately after Cup/VCP breakout.
=> one local candle sequence inside one breakout lifecycle.
Root provenance may still be PRICE_OHLC only.

Example E:
Three Gaps occurs during consecutive Taiwan price-limit sessions.
=> observed gaps/opens require constrained-session semantics before any exhaustion story.

## D01-SK09 — Taiwan evidence guard

Taiwan candlestick research has found some profitable candle patterns after transaction costs and robustness checks in historical samples.

That supports:
candlestick morphology can be empirically testable.

It does NOT justify:
- every named Sakata family;
- timeless directional signs;
- modern current-regime effect sizes.

The cited Taiwan candlestick sample largely predates:
- the modern 10% price-limit regime;
- 2020 continuous intraday trading.

Modern transportability remains UNKNOWN until prospective/current-regime evidence exists.

## D01-SK10 — Research order

For current D01:
1. preserve Sakata taxonomy;
2. translate each family into transparent primitives;
3. deduplicate against W/M, Cup, VCP, Flag/Platform and breakout lifecycle;
4. enforce OPEN/session/corporate-action semantics for gaps/candles;
5. capture prospectively only after shared runtime gates clear;
6. test incremental value after existing Formal/Price-Volume controls.

No separate "Sakata alpha" experiment is created yet.

## Current status

SAKATA_TAXONOMY = DECOMPOSED_V0_1
SINGLE_SAKATA_SCORE = REJECTED
THREE_RIVERS_DEFINITION = VARIANT_REQUIRED
THREE_GAPS_DIRECTIONAL_SIGN = UNKNOWN
THREE_SOLDIERS_INCREMENTALITY = UNKNOWN
THREE_METHODS_VS_FLAG_REDUNDANCY = HIGH_PRIOR
MODERN_TAIWAN_ALPHA = UNKNOWN
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.
