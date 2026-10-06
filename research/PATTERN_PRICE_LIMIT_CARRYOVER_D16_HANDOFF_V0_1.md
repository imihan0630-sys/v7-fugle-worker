# D01 DL-064 — D16 Price-Limit Carryover / Queue Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes price-limit/queue semantics.
D16 owns future residual inference.

Question:
Does structural response survive daily-limit magnet/trading-interference, queue imbalance, delayed price discovery and next-session resubmission controls?

## 2. Three carryover objects

Never merge:
- PHYSICAL_ORDER_QUEUE_SAME_SESSION;
- LATENT_UNMET_DEMAND_OR_SUPPLY_CARRYOVER;
- NEXT_SESSION_RESUBMITTED_ORDERS.

Day-t exchange orders expire with the session.
Next-day orders are new orders.
Latent economic demand may persist but is a separate empirical hypothesis.

## 3. Required same-day comparator

G0 LIMIT_EVENT_AWAY_FROM_STRUCTURAL_ZONE
G1 LIMIT_EVENT_AT_STRUCTURAL_ZONE

Match:
- direction;
- distance to daily limit;
- news/event context;
- liquidity/volatility;
- queue visibility;
- hit timing;
- unlock/relock path.

## 4. Required next-day comparator

N0 PRIOR_DAY_LIMIT_EVENT_AWAY_FROM_ZONE
N1 PRIOR_DAY_LIMIT_EVENT_AT_ZONE

Additionally control:
- overnight information;
- opening reference;
- pre-open derivative context;
- opening gap;
- new next-session order-book state.

Next-day continuation is not proof that the same order queue persisted overnight.

## 5. Queue evidence

Closing at limit is insufficient to infer locked queue.

Use timestamped owner-certified queue/order-book receipts.

Final queue is not the whole intraday queue history.

No queue-strength score is authorized.

## 6. Price-limit reference

Use owner-certified:
- opening-auction reference;
- legal upper/lower limit;
- tick/rule vintage;
- exemption state.

Do not assume opening reference equals prior close.
Do not compute illegal decimal limit prices.

## 7. Future ladder

P0 RAW_ZONE_RESPONSE
P1 PRICE_LIMIT_REFERENCE_AND_EXEMPTION_IDENTIFIED
P2 DISTANCE_TO_LIMIT_CONTROLLED
P3 LIMIT_HIT_PATH_CONTROLLED
P4 QUEUE_VISIBILITY_AND_IMBALANCE_CONTROLLED
P5 UNLOCK_RELOCK_CONTROLLED
P6 NEWS_EVENT_CONTEXT_CONTROLLED
P7 SAME_DAY_GENERIC_LIMIT_COMPARATOR_CONTROLLED
P8 OVERNIGHT_CONTEXT_CONTROLLED
P9 NEXT_SESSION_RESUBMISSION_OPENING_CONTROLLED
P10 NEXT_DAY_GENERIC_LIMIT_CARRYOVER_COMPARATOR_CONTROLLED
P11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
P12 MULTI_DATE_MULTI_SYMBOL_MULTI_LIMIT_REGIME_REPLICATION

## 8. SDA boundary

Price limit, price path and D01 structure share PRICE_OHLC ancestry.
Queue data are microstructure context, not automatic independent confirmation.

SDA-001/SDA-002 remain open.

## 9. Promotion boundary

No ranking, gating, Top6, weights, capital, threshold or runtime change is authorized.

Formal Core remains LOCKED.
