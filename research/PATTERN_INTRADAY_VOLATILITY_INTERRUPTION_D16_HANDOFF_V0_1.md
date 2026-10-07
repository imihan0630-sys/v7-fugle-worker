# D01 DL-067 — D16 Intraday Volatility Interruption Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes TWSE intraday volatility-interruption structural semantics.
D16 owns future dependence-aware residual inference.

Primary question:

Does an apparent support/resistance response survive controls for:
- trigger-potential vs executed price;
- dynamic interruption reference regime;
- two-minute matching delay;
- interruption-period order-set mutation;
- restart call auction;
- five-minute post-interruption reference reset;
- daily-limit interaction;
- time-of-day / trading phase;
- generic high-volatility and away-from-zone comparators?

## 2. Required event unit

One exchange interruption episode is one event unit.

Preserve:
- interruptionEventId;
- triggerAt;
- delayStartAt;
- delayEndAt;
- restartAuctionAt;
- firstCallPrintAt;
- referenceResetUntil;
- returnToRollingReferenceAt.

Snapshots inside one episode do not multiply N.

## 3. Trigger potential is not outcome

The trigger potential execution price is a mechanism input.

It is not:
- an executed trade;
- a confirmed breakout;
- a support/resistance failure.

Never build an economic response outcome from triggerPotentialExecutionPrice.

## 4. Dynamic reference regimes

Preserve the reference regime explicitly:
- OPENING_REFERENCE_PHASE;
- ROLLING_FIVE_MINUTE_REFERENCE;
- POST_INTERRUPTION_RESET_REFERENCE.

Do not pool trigger deviations across reference regimes without controlling them.

## 5. Order-set mutation

During interruption:
- market / IOC / FOK restrictions apply;
- existing market orders may be deleted;
- limit ROD order flow may accumulate.

Therefore the restart auction is generated from a changed order set.

Any queue/depth inference requires D04/D05 provenance.

## 6. Restart call vs continuous response

Keep separate:
- RESTART_CALL_ZONE_CROSS;
- POST_INTERRUPTION_CONTINUOUS_CROSS_OBSERVED.

The first call print alone cannot establish a structural breakout.

Any confirmation window must be preregistered and all registered windows retained in family accounting.

## 7. Required comparators

G0:
HIGH_VOLATILITY_MOVE_WITHOUT_INTERRUPTION_AT_STRUCTURAL_ZONE.

G1:
VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE.

H0:
VOLATILITY_INTERRUPTION_AWAY_FROM_STRUCTURAL_ZONE.

H1:
VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE.

Common support should include:
- recent return/range;
- realized volatility;
- liquidity;
- order imbalance where available;
- distance to structural zone;
- distance to daily price limit;
- market/sector move;
- time of day;
- reference regime;
- trading/auction phase.

## 8. Future ladder

V0 RAW_STRUCTURAL_RESPONSE
V1 VOLATILITY_INTERRUPTION_EVENT_IDENTIFIED
V2 TRIGGER_POTENTIAL_VS_EXECUTED_PRICE_SEPARATED
V3 REFERENCE_PRICE_REGIME_CONTROLLED
V4 MATCHING_DELAY_CONTROLLED
V5 ORDER_SET_MUTATION_CONTROLLED
V6 RESTART_CALL_AUCTION_CONTROLLED
V7 POST_INTERRUPTION_REFERENCE_RESET_CONTROLLED
V8 DAILY_PRICE_LIMIT_CONTEXT_CONTROLLED
V9 TIME_OF_DAY_AND_TRADING_PHASE_CONTROLLED
V10 GENERIC_HIGH_VOLATILITY_COMPARATOR_CONTROLLED
V11 AWAY_FROM_ZONE_INTERRUPTION_COMPARATOR_CONTROLLED
V12 LIQUIDITY_ORDER_FLOW_CONTROLLED
V13 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
V14 MULTI_EVENT_MULTI_SYMBOL_MULTI_REGIME_REPLICATION

## 9. Interpretation

Q0 TRIGGER_WITHOUT_EXECUTION_EXPLANATION
Q1 MATCHING_DELAY_EXPLANATION
Q2 ORDER_SET_MUTATION_EXPLANATION
Q3 RESTART_AUCTION_EXPLANATION
Q4 REFERENCE_RESET_EXPLANATION
Q5 DAILY_LIMIT_INTERACTION_EXPLANATION
Q6 GENERIC_HIGH_VOLATILITY_EXPLANATION
Q7 LIQUIDITY_ORDER_FLOW_EXPLANATION
Q8 STRUCTURAL_RESPONSE_RESIDUAL
Q9 INTERRUPTION_PROVENANCE_UNKNOWN
Q10 NOT_EVALUABLE

None is alpha by itself.

## 10. SDA boundaries

SDA-001 remains open:
price-derived interruption/pattern states share PRICE_OHLC ancestry unless independent lineage is proven.

SDA-002 remains open:
all trigger/reference/restart timestamps must be replay-safe and first-known.

No Formal ranking, gating, Top6, capital or runtime change is authorized.

Formal Core remains LOCKED.
