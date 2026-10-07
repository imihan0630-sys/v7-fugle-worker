# D01 DL-082 — Single-Candle Morphology / Name-Independence Contract V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / D01_02_PIT_CONTRACT / FORMAL_CORE_LOCKED

## Purpose

Upgrade D01-02 from named candlestick folklore to replay-safe morphology.

A named candle is not an independent signal. It is a deterministic description of one OHLC bar plus context.

## Canonical normalized morphology

For each completed eligible bar preserve:
- body = abs(close-open)
- fullRange = high-low
- upperWick = high-max(open,close)
- lowerWick = min(open,close)-low
- bodyToRange
- upperWickToRange
- lowerWickToRange
- closeLocationInRange
- openLocationInRange
- direction
- gapFromPriorClose
- legalTickSize
- priceLimitState
- zeroTradeState
- sessionType
- firstObservableAt
- predictorFreezeAt

Zero-range and zero-trade cases are explicit states, not silently divided.

## Name-independence

Hammer, shooting star, doji, marubozu and related names are aliases over morphology thresholds.

Default:
informationRoot = PRICE_OHLC
effectiveIndependentEvidenceCount = 1.

Different names triggered by the same bar do not create multiple votes.

## Context separation

Morphology is separated from:
- prior trend
- structural-zone location
- gap state
- price-limit state
- liquidity state
- event state
- next-bar confirmation

The same bar shape can have different interpretation under different contexts.

## PIT rule

A daily bar is unavailable as a completed-candle feature until canonical session close.
Intraday bars are unavailable before their interval close.
No future bar may define the candle name at predictor freeze.

## Microstructure firewalls

Do not classify ordinary candlestick meaning when:
- bar is synthetic/forward-filled;
- no qualifying trade occurred;
- price is censored by limit-up/down;
- suspension/resumption or corporate-action reset contaminates continuity;
- range is one/few ticks in an illiquid symbol without tick normalization.

## Future validation

Compare:
G0 RAW_OHLC_GEOMETRY_ONLY
G1 NAMED_CANDLE_ALIAS
G2 GEOMETRY_PLUS_PREREGISTERED_CONTEXT

Named labels must demonstrate incremental value beyond raw normalized geometry or be treated as presentation only.

## D16 ladder

C0 NAMED_CANDLE_RAW_RESULT
C1 NORMALIZED_MORPHOLOGY_RECONSTRUCTED
C2 NAME_ALIAS_DEDUPED
C3 SESSION_CLOSE_PIT_VALIDATED
C4 ZERO_TRADE_TICK_LIMIT_CONTROLS
C5 PRIOR_TREND_CONTROLLED
C6 STRUCTURAL_LOCATION_CONTROLLED
C7 RAW_GEOMETRY_COMPARATOR
C8 MULTIPLE_PATTERN_TESTING_CONTROLLED
C9 OOS_INCREMENTALITY
C10 NAME_INCREMENTAL_OR_PRESENTATION_ONLY

## Current decision

CANDLE_NAME_EQUALS_NEW_ALPHA = FALSE.
MULTIPLE_NAMES_ON_ONE_BAR_EQUAL_MULTIPLE_VOTES = FALSE.
INCOMPLETE_BAR_MAY_BE_CLASSIFIED_AS_COMPLETED = FALSE.
CONTEXT_FREE_CANDLE_DIRECTIONALITY_ASSUMED = FALSE.
D01_02_PIT_DATA_CONTRACT = FEASIBLE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Level implication

The module now has mechanism, falsifiers, deterministic normalized features, replay-safe observability and Taiwan-market continuity constraints sufficient for L3 PIT-feasibility classification, subject to tracker governance.
