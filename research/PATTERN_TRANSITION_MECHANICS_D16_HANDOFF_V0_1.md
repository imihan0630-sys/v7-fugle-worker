# D01 DL-050 — D16 Transition-Mechanics Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes the structural-zone transition context.
D16 owns future common-support and residual inference.

A zone-state change must not be analyzed as one homogeneous "churn" family when the matching mechanism, legal constraints or microstructure path differ.

## Required context axes

Preserve all four:
1. MATCHING_MECHANISM;
2. PRICE_CONSTRAINT_STATE;
3. MICROSTRUCTURE_BOUNCE_STATE;
4. EVENT_CONTEXT.

Do not force one causal winner when mechanisms overlap.

## Required comparison classes

K0 ORDINARY_CONTINUOUS_UNCONSTRAINED

K1 OPEN_OR_CLOSE_AUCTION_REPRICING

K2 VI_REOPEN_REPRICING

K3 PRICE_LIMIT_CONSTRAINED

K4 QUOTE_CONFIRMED_BID_ASK_BOUNCE

K5 VERIFIED_EVENT_CONTEXT

K6 MIXED_MECHANISM

K7 NOT_EVALUABLE

## Core future tests

Q1:
Does DL-049 churn survive restriction to K0?

Q2:
What share of high-churn observations is auction / VI / limit constrained?

Q3:
Does quote-confirmed bid-ask bounce explain short-horizon alternating transitions?

Q4:
Does structural-zone information remain after D04/D05 spread/depth/bounce controls?

Q5:
Do D11 verified event-context transitions differ on common support?

Q6:
Do OHLC proxy findings survive exact event-sequence reconstruction?

Q7:
Does any mechanism-stratified representation add residual information after common PRICE_OHLC de-duplication?

## Causal caution

VERIFIED_EVENT_CONTEXT does not prove event causation.

QUOTE_CONFIRMED_BID_ASK_BOUNCE does not prove structural irrelevance.

AUCTION_CROSSED_ZONE does not prove continuous traversal through the zone.

PRICE_LIMIT_CONSTRAINED does not equal ordinary free-market acceptance.

## Common support

Retain:
- tick regime;
- price level;
- volatility;
- spread/depth;
- liquidity;
- auction/session identity;
- price-limit state;
- VI state;
- structural geometry;
- regime;
- event context.

No extrapolation outside support.

## Owner boundaries

D04/D05:
microstructure, spread, depth, bounce confirmation.

D11:
event identity and first-known clocks.

D01:
zone-local structural relation and research context.

## Promotion boundary

No mechanism class changes Formal ranking, A/B, Top6, weights, capital, runtime or trading behavior by default.

Formal Core remains LOCKED.
