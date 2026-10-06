# D01 DL-063 — D16 Overnight / Previous-Close Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes overnight/opening semantics.
D16 owns future attribution inference.

Question:
Does opening structural response remain after previous-close geometry, overnight information, pre-open derivative price discovery and opening order-flow context are controlled?

## 2. Required channels

Keep separate:
- prior-close anchor geometry;
- firm-specific overnight event;
- market/sector overnight move;
- global/macro/cross-asset move;
- pre-open futures;
- pre-open options;
- pre-open spot indicative state;
- opening liquidity/order-flow.

No composite overnight score.

## 3. Required clocks

Overnight receipt:
priorRegularCloseKnownAt < receiptKnownAt <= predictorFreezeAt.

Opening final print:
openingFinalPrintKnownAt <= predictorFreezeAt < endpointWindowStart.

Later news, final opening state or derivative updates cannot be backfilled.

## 4. Required comparators

Generic overnight:
G0 OVERNIGHT_SHOCK_AWAY_FROM_ZONE
G1 OVERNIGHT_SHOCK_AT_ZONE

Previous close:
P0 PRIOR_CLOSE_ANCHOR_AWAY_FROM_ZONE
P1 PRIOR_CLOSE_ANCHOR_NEAR_ZONE

Near/far should be handled under preregistered continuous/common-support analysis, not D01 post-outcome thresholds.

## 5. Opening-gap caution

An opening print across a zone is OPENING_GAP_CROSSING.

Do not invent a continuous path through the zone.

The opening print itself cannot simultaneously define the predictor and serve as the tested response outcome.

## 6. Future ladder

N0 RAW_OPENING_ZONE_RESPONSE
N1 OPENING_AUCTION_PHASE_CONTROLLED
N2 PRIOR_CLOSE_ANCHOR_GEOMETRY_CONTROLLED
N3 OVERNIGHT_GAP_SIZE_CONTROLLED
N4 FIRM_SPECIFIC_OVERNIGHT_EVENT_CONTROLLED
N5 MARKET_SECTOR_GLOBAL_OVERNIGHT_MOVE_CONTROLLED
N6 PREOPEN_FUTURES_SIGNAL_CONTROLLED
N7 PREOPEN_OPTIONS_SIGNAL_CONTROLLED
N8 PREOPEN_SPOT_INDICATIVE_STATE_CONTROLLED
N9 OPENING_ORDER_FLOW_LIQUIDITY_CONTROLLED
N10 GENERIC_OVERNIGHT_SHOCK_COMPARATOR_CONTROLLED
N11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
N12 MULTI_DATE_MULTI_SYMBOL_MULTI_OVERNIGHT_REGIME_REPLICATION

## 7. Interpretation

If structure disappears after previous-close controls:
PREVIOUS_CLOSE_ANCHOR_EXPLANATION.

If it disappears after overnight/news/global controls:
OVERNIGHT_INFORMATION_EXPLANATION.

If it disappears after derivative/pre-open controls:
PREOPEN_PRICE_DISCOVERY_EXPLANATION.

Residual remains research-only.

## 8. SDA boundary

Prior close, opening price and D01 structure share PRICE_OHLC ancestry.
External derivative/news channels are context, not automatic independent votes.

SDA-001 and SDA-002 remain open.

## 9. Promotion boundary

No ranking, gating, Top6, weights, capital, threshold or runtime change is authorized.

Formal Core remains LOCKED.
