# D01 DL-065 — Structural Response vs Stale / Non-Synchronous / Thin-Trading Prices V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / STALE_PRICE_FIREWALL / SDA_001_SDA_002_OPEN / FORMAL_CORE_LOCKED

## 1. Purpose

DL-064 separated prior-zone response from public-event coverage and opening liquidity/inventory pressure.

DL-065 addresses a measurement problem:

> In thinly traded stocks, can an apparent support/resistance touch, hold, gap or market-relative response be created by stale/non-synchronous prices, delayed first trades, pseudo-bars, quote-only observations or isolated prints rather than a genuine contemporaneous structural interaction?

No outcome is opened in this tranche.

## 2. Evidence context

Classical market-microstructure/econometric research shows nonsynchronous trading and stale prices can bias:
- returns;
- beta/covariance;
- autocorrelation;
- market-relative inference.

Scholes-Williams, Dimson and Lo-MacKinlay provide the core nonsynchronous-trading foundation.

Therefore:
timestamp alignment is part of structural evidence quality.

## 3. Canonical owners

D01 consumes:

- D02-01 trade/volume data semantics;
- D02-11 liquidity threshold / exception semantics;
- D05-03 bid-ask spread;
- D05-04 order-book depth;
- D05-06 auction state;
- D05-08 odd-lot vs board-lot execution;
- D05-09 liquidity state;
- D05-10 halt / no-trade / pseudo-bar semantics;
- D14 execution identity;
- D19-04 stale-price / valid-observation semantics where applicable.

D01 does not redefine liquidity thresholds.

## 4. Observation identity

Every structural price observation must identify:

- observationTimestamp;
- observationType;
- source;
- venue/session;
- tradeCondition;
- price;
- size if trade;
- quote timestamp if quote;
- auction/continuous phase;
- replaySafe.

Allowed observationType values:

TRADE
QUOTE_MID
BEST_BID
BEST_ASK
AUCTION_MATCH
ODD_LOT_TRADE
PSEUDO_BAR
CARRY_FORWARD_PRICE
UNKNOWN

Only actual transaction observations prove a trade occurred.

## 5. Open-price identity

Daily "open" can represent different mechanisms depending on source/session.

Preserve:
- scheduledOpenAt;
- openingAuctionMatchAt;
- firstTradeAt;
- firstContinuousTradeAt;
- dailyOpenSource;
- firstTradeDelaySeconds;
- firstContinuousTradeDelaySeconds.

dailyOpenSource states:

OPENING_AUCTION_MATCH
FIRST_CONTINUOUS_TRADE
ODD_LOT_ONLY
PSEUDO_BAR_OR_CARRY
SOURCE_UNRESOLVED

No fixed stale-delay cutoff is defined in D01.

## 6. No-trade / pseudo-bar firewall

D05-10 remains binding.

If a provider synthesizes OHLC on a no-trade session or carries forward the prior close:

PSEUDO_BAR_OR_CARRY.

Such a bar cannot create:
- new support/resistance touch;
- breakout;
- rejection;
- retest;
- higher-low confirmation.

Price continuity metadata can be retained, but interaction count does not increase.

## 7. Quote touch vs trade touch

A quote can enter a zone without a trade executing there.

Freeze:

Q0 EXECUTED_TRADE_IN_ZONE

Q1 AUCTION_MATCH_IN_ZONE

Q2 BEST_BID_ASK_BRACKETS_ZONE

Q3 QUOTE_MID_IN_ZONE

Q4 QUOTE_ONLY_TOUCH_NO_TRADE

Q5 ODD_LOT_ONLY_TOUCH

Q6 NO_TRADE_STALE_PRICE_IN_ZONE

Q7 TOUCH_IDENTITY_UNKNOWN

Quote-only states are not execution evidence.

## 8. Isolated-trade / thin-trading state

An actual trade can be real but economically fragile.

Preserve:
- tradeCountSinceOpen;
- touchTradeCount;
- touchVolume;
- touchNotional;
- spread at touch;
- displayed depth at touch;
- relative tick;
- time since previous trade;
- time to next trade where used only as post-event diagnostic;
- board-lot vs odd-lot identity.

Do not define an arbitrary minimum trade count in D01.

Low activity is a context/quality dimension, not an automatic invalidation.

## 9. Stale benchmark alignment

For any target-vs-market/sector comparison, preserve:

- targetPriceTimestamp;
- benchmarkPriceTimestamp;
- timestampGapSeconds;
- targetLastTradeAgeSeconds;
- benchmarkLastTradeAgeSeconds;
- targetUpdatedSinceBenchmarkMove;
- benchmark self-inclusion state from DL-061 where applicable.

A benchmark updated at 09:00:05 and a target whose last trade is yesterday's close are not synchronous 09:00 observations.

## 10. Non-synchronous response states

N0 SYNCHRONOUS_ENOUGH_BY_OWNER_CONTRACT

N1 TARGET_PRICE_STALE_BENCHMARK_FRESH

N2 TARGET_FRESH_BENCHMARK_STALE

N3 BOTH_STALE

N4 TARGET_FIRST_TRADE_DELAYED

N5 QUOTE_FRESH_TRADE_STALE

N6 TIMESTAMP_ALIGNMENT_UNKNOWN

"Enough" is not defined by a D01 hard-coded second threshold.
It must follow owner/source sampling contract.

## 11. Apparent zone interaction states

T0 EXECUTED_CONTEMPORANEOUS_ZONE_INTERACTION

T1 AUCTION_ZONE_INTERACTION

T2 ISOLATED_THIN_TRADE_ZONE_INTERACTION

T3 QUOTE_ONLY_ZONE_CONTACT

T4 STALE_PRICE_OVERLAPS_ZONE

T5 PSEUDO_BAR_OVERLAPS_ZONE

T6 ODD_LOT_ONLY_ZONE_INTERACTION

T7 INTERACTION_IDENTITY_UNKNOWN

Only T0/T1 are normal trade-based interaction candidates by default.
T2/T6 require explicit liquidity/execution context.
T3/T4/T5 do not prove executable interaction.

## 12. Daily OHLC firewall

A daily low/high inside or through a zone is not sufficient by itself when:
- bar provenance is unresolved;
- no-trade/pseudo-bar is possible;
- session phase is unknown;
- isolated odd-lot or special trade may dominate;
- intraday timestamps are unavailable.

Historical daily bars may support broad geometry research.
They do not prove exact intraday execution path.

## 13. Bid-ask bounce / microstructure noise

Transaction prices may alternate between bid/ask around an unchanged latent value.

Therefore one isolated print through a narrow zone can be microstructure noise.

Preserve:
- spread;
- relative tick;
- quote midpoint;
- trade side/classification where owner-certified;
- subsequent persistence only as a separately timed diagnostic.

D01 does not infer latent fair value.

## 14. No future confirmation leakage

A later trade can show that an earlier isolated touch failed to persist, but it cannot retroactively change what was known at the earlier predictor freeze.

Store:
- firstTouchAt;
- firstTouchKnownAt;
- predictorFreezeAt;
- laterPersistenceObservationAt.

SDA-002 remains open.

## 15. Generic thin-trading comparator

Primary comparison:

G0 SAME_LIQUIDITY_STALENESS_STATE_AWAY_FROM_ZONE

G1 SAME_LIQUIDITY_STALENESS_STATE_AT_ZONE

If G1 adds no residual representation:
THIN_TRADING_MICROSTRUCTURE_SUFFICIENT.

## 16. Synchronous-vs-stale structural comparison

S0 FRESH_TRADE_ZONE_INTERACTION
S1 DELAYED_FIRST_TRADE_ZONE_INTERACTION
S2 QUOTE_ONLY_ZONE_CONTACT
S3 STALE_PRICE_ZONE_OVERLAP
S4 PSEUDO_BAR_ZONE_OVERLAP
S5 ODD_LOT_ONLY_ZONE_INTERACTION
S6 ALIGNMENT_UNKNOWN

A structural claim is stronger if it survives in S0 and does not depend on S2-S5.

## 17. Missingness / denominator

Do not drop:
- no-trade sessions;
- delayed first-trade sessions;
- pseudo-bars;
- unresolved observation identity;
- missing quote/depth history.

Preserve them as explicit denominator states.

Removing them can create a liquid-stock survivor sample.

## 18. SDA-001 dependence guard

Price touch, volume, spread, depth, quote midpoint, tick and benchmark response can derive from the same market microstructure state.

Do not count them as independent confirmations automatically.

effectiveIndependentEvidenceCount = 1 by default.

SDA-001 remains open.

## 19. Future D16 ladder

S0 RAW_ZONE_TOUCH

S1 OBSERVATION_IDENTITY_CONTROLLED

S2 NO_TRADE_PSEUDO_BAR_CONTROLLED

S3 OPEN_FIRST_TRADE_DELAY_CONTROLLED

S4 SPREAD_DEPTH_TICK_CONTROLLED

S5 TRADE_VS_QUOTE_TOUCH_CONTROLLED

S6 ODD_LOT_BOARD_LOT_CONTROLLED

S7 TARGET_BENCHMARK_TIMESTAMP_ALIGNMENT_CONTROLLED

S8 GENERIC_STALENESS_COMPARATOR_CONTROLLED

S9 EXECUTED_CONTEMPORANEOUS_TOUCH_ONLY

S10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

S11 PROSPECTIVE_MULTI_LIQUIDITY_REPLICATION

## 20. Future interpretations

Q0 PSEUDO_BAR_ARTIFACT
Q1 STALE_PRICE_ARTIFACT
Q2 NON_SYNCHRONOUS_BENCHMARK_ARTIFACT
Q3 QUOTE_ONLY_CONTACT
Q4 ISOLATED_THIN_TRADE_EXPLANATION
Q5 ODD_LOT_EXECUTION_CONTEXT
Q6 BID_ASK_MICROSTRUCTURE_EXPLANATION
Q7 EXECUTED_STRUCTURE_RESIDUAL
Q8 DATA_IDENTITY_UNKNOWN
Q9 NOT_EVALUABLE

## 21. Current decision

NO_TRADE_BAR_CAN_CREATE_STRUCTURE_EVENT =
FALSE.

QUOTE_TOUCH_EQUALS_TRADE_TOUCH =
FALSE.

DAILY_LOW_HIGH_PROVES_INTRADAY_EXECUTION_PATH =
FALSE.

STALE_TARGET_PRICE_EQUALS_SYNCHRONOUS_MARKET_RESPONSE =
FALSE.

ODD_LOT_TOUCH_EQUALS_BOARD_LOT_INTERACTION =
FALSE.

FIXED_STALE_SECONDS_THRESHOLD_DEFINED_IN_D01 =
FALSE.

LATER_PERSISTENCE_CAN_REWRITE_EARLIER_TOUCH =
FALSE.

OUTCOME_JOIN =
CLOSED.

SDA_001_STATUS =
OPEN.

SDA_002_STATUS =
OPEN.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic observation identity / stale alignment / zone-interaction classifier and adversarial tests.
2. Preserve no-trade/pseudo-bar/delayed-first-trade/quote-only/odd-lot states in denominators.
3. Consume D05/D02/D14/D19 owner receipts without inventing a D01 stale-time threshold.
4. Hand S0-S11 / Q0-Q9 inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate isolated wick/one-print excursions from accepted/persistent zone interaction without duplicating D02 acceptance/persistence semantics.
7. No outcome join / no runtime wiring / no Formal change.
