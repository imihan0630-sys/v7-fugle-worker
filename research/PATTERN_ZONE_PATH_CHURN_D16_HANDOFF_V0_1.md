# D01 DL-049 — D16 Zone-Path / Churn Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes zone-local path semantics.
D16 owns future common-support and residual inference.

The central distinction is:

- occupancy/time-at-price;
- zone-state transition/churn;
- D03 fixed-window path efficiency;
- exact event-level crossing sequence.

These are related but not interchangeable.

## Required future comparison classes

Z0 STRUCTURAL_ONLY

Z1 HIGH_OCCUPANCY_LOW_CHURN_CONTEXT

Z2 HIGH_OCCUPANCY_HIGH_CHURN_CONTEXT

Z3 LOW_OCCUPANCY_HIGH_TRAVERSAL_CONTEXT

Z4 EVENT_EXACT_CROSSING_CONTEXT

Z5 CONSTRAINED_MECHANICS_CONTEXT

Z6 NOT_EVALUABLE

Thresholds for HIGH/LOW remain unfrozen in D01 v0.1 and must not be outcome-tuned.

## Required inference questions

Q1:
Does occupancy add residual information beyond structural geometry?

Q2:
Does zone-local churn/path add residual information beyond occupancy?

Q3:
Does occupancy add residual information beyond churn/path?

Q4:
Does any apparent D01 zone-path effect survive D03 pathEfficiency10 / trend-quality controls?

Q5:
Do OHLC close-path proxy findings survive exact event-sequence validation?

Q6:
Do results survive legal tick, price-limit, auction/session, VI and liquidity controls?

Q7:
Does any combined occupancy/churn representation add residual information after common PRICE_OHLC de-duplication?

## OHLC ambiguity

A bar spanning both zone edges cannot identify:
- first edge touched;
- exact crossing count;
- crossing order;
- exact time inside.

Those fields require timestamped trade/quote sequence data.

D16 must not treat OHLC span cases as exact crossings.

## Owner boundary

D03 owns fixed-window pathEfficiency10 / trend-quality primitives.

D01 may use D03 as a control.
D01 must not create a duplicate independent factor from the same path geometry.

## Information lineage

OHLC-derived zone path:
informationRoot = PRICE_OHLC.

Exact event path can additionally use:
TRADE_TIME or QUOTE_TIME / EVENT_TIME.

Even then:
effectiveIndependentEvidenceCount = 1 by default;
residualIncrementalityStatus = NOT_VALIDATED.

## Mechanics/common support

Future inference must retain:
- tick regime;
- price-limit state;
- auction vs continuous session;
- volatility interruption;
- spread/liquidity;
- corporate-action continuity;
- zone width / price scale;
- occupancy context;
- regime context.

No extrapolation outside support.

## Promotion boundary

No zone-path descriptor changes ranking, Top6, A/B, weights, capital, runtime, or Formal behavior by default.

Formal Core remains LOCKED.
