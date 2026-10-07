# D01 DL-070 — Sparse-Liquidity / Stale-Print / Price-Clustering False-Structure Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ILLIQUIDITY_FALSE_STRUCTURE_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Separate genuine support/resistance memory from structures manufactured by sparse trading, stale prints, discrete ticks, price clustering and order-book gaps.

D01 price geometry is not trustworthy merely because repeated OHLC values exist. In illiquid securities, repeated prices can reflect absence of trade rather than repeated market acceptance.

## Evidence synthesis

Prior empirical microstructure research shows large price changes can be driven by gaps in available liquidity rather than order size alone, and lightly traded stocks can exhibit more extreme price risk.

Support/resistance research reports measurable bounce memory at previously visited levels, but separate work also finds that support/resistance response can decay over time.

These literatures are jointly compatible only if D01 controls the observation process: an apparent level can contain real behavioral memory and microstructure artifact at the same time.

## Core distinction

Keep separate:

- REPEATED_EXECUTION_AT_LEVEL
- STALE_LAST_TRADE_CARRY
- QUOTE_CLUSTER_AT_LEVEL
- TICK_GRID_CLUSTER
- ORDER_BOOK_GAP_EDGE
- GENUINE_REVISIT_AND_RESPONSE

Repeated OHLC equality alone does not establish REPEATED_EXECUTION_AT_LEVEL.

## Stale-print receipt

Required:
- lastTradeAt
- barEndAt
- tradeCount
- quoteUpdateCount where available
- executableBidAskState where available
- zeroTradeBarFlag
- carriedPriceFlag
- source/version/hash
- replaySafe

If a bar has no qualifying trade:
ZERO_TRADE_BAR is not a structural touch.

If provider bars silently carry prior close:
STALE_PRINT_CONTAMINATION.

## Tick-grid normalization

A fixed price distance has different meaning across price/tick regimes.

For each zone preserve:
- legalTickSize
- zoneWidthTicks
- distanceToZoneTicks
- levelPriceModuloTick
- roundedNumberClass

A price level repeatedly observed because it sits on a coarse tick grid or salient round number must not gain independent structural weight without controls.

## Price clustering

Price clustering may arise from trader preference for round increments, quoting convention, tick-size geometry or strategic order placement.

Freeze:
PRICE_CLUSTERING_CONTEXT_ONLY.

No ROUND_NUMBER_ALPHA is defined.

Compare candidate zones against same-price-band clustering baselines.

## Sparse-trade touch count

Touch count must be based on independent eligible executions or explicitly defined auction matches.

Do not count:
- repeated provider bars with same carried close;
- repeated snapshots of one print;
- bid/ask quote presence as executed touch;
- multiple bars generated from one periodic auction;
- a single large block print fragmented by vendor processing.

Each touch requires immutable execution/match lineage.

## Order-book gap edge

A jump across a zone due to absent quotes does not prove forceful breakout demand.

State:
LIQUIDITY_GAP_CROSSING.

D04/D05 own depth/spread/order-book evidence.
D01 consumes owner-certified liquidity-gap receipts.

## Bounce denominator

A bounce statistic is biased if only levels that were revisited are retained.

Preserve:
- all eligible structural roots;
- revisit eligibility;
- no-revisit roots;
- crossed roots;
- bounced roots;
- expired roots;
- data-blocked roots.

No survivor-only bounce rate.

## Level freshness

Do not define arbitrary half-life from calendar time alone.

Candidate freshness clocks to compare prospectively:
- ELIGIBLE_SESSION_COUNT_SINCE_FORMATION
- INDEPENDENT_EXECUTION_COUNT_SINCE_FORMATION
- INFORMATION_EVENT_COUNT_SINCE_FORMATION
- VOLATILITY_DISTANCE_TRAVELED
- LIQUIDITY_OPPORTUNITY_COUNT

Calendar age remains context, not default decay law.

## Comparator design

A: liquidity artifact
A0 LIQUID_STOCK_ZONE_REVISIT
A1 SPARSE_LIQUIDITY_ZONE_REVISIT

B: clustering artifact
B0 NONCLUSTERED_PRICE_LEVEL_MATCHED_BY_BAND
B1 ROUND_OR_TICK_CLUSTERED_LEVEL

C: structure
C0 MATCHED_NONSTRUCTURAL_PRICE_LEVEL
C1 STRUCTURAL_ZONE

All comparisons require common support in price band, volatility, market cap, spread/liquidity, tick regime, trading mechanism and event context.

## D16 ladder

I0 RAW_ZONE_BOUNCE_CROSS_RATE
I1 ZERO_TRADE_AND_CARRIED_PRICE_REMOVED
I2 INDEPENDENT_EXECUTION_TOUCHES_RECONSTRUCTED
I3 TICK_GRID_CONTROLLED
I4 ROUND_PRICE_CLUSTERING_CONTROLLED
I5 SPREAD_AND_DEPTH_CONTROLLED
I6 ORDER_BOOK_GAP_CROSSINGS_CONTROLLED
I7 TRADING_MECHANISM_CONTROLLED
I8 REVISIT_SELECTION_DENOMINATOR_RESTORED
I9 LEVEL_FRESHNESS_CLOCK_PREREGISTERED
I10 MATCHED_NONSTRUCTURAL_LEVEL_CONTROLLED
I11 STRUCTURAL_MEMORY_RESIDUAL_CANDIDATE
I12 MULTI_LIQUIDITY_MULTI_TICK_MULTI_REGIME_REPLICATION

## Interpretation states

Q0 STALE_PRINT_EXPLANATION
Q1 TICK_GRID_EXPLANATION
Q2 PRICE_CLUSTERING_EXPLANATION
Q3 LIQUIDITY_GAP_EXPLANATION
Q4 REVISIT_SELECTION_EXPLANATION
Q5 TRADING_MECHANISM_EXPLANATION
Q6 STRUCTURAL_MEMORY_RESIDUAL
Q7 DATA_COVERAGE_UNKNOWN
Q8 NOT_EVALUABLE

## SDA

SDA-001 remains open. Support, breakout, momentum and raw price-derived clustering share PRICE_OHLC ancestry unless a non-price root is explicitly proven.

SDA-002 remains open. Touch/revisit/confirmation must be observable at the predictor clock; later bounce cannot define the earlier level.

## Current decision

REPEATED_BAR_PRICE_EQUALS_REPEATED_EXECUTION = FALSE.
ROUND_NUMBER_EQUALS_SUPPORT = FALSE.
LIQUIDITY_GAP_CROSSING_EQUALS_BREAKOUT_STRENGTH = FALSE.
NO_REVISIT_ROOTS_MAY_BE_DROPPED = FALSE.
CALENDAR_AGE_EQUALS_LEVEL_HALF_LIFE = FALSE.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT = 1.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Build stale-print/touch-lineage/tick-clustering classifier and adversarial tests.
2. Create D16 handoff for I0-I12/Q0-Q8.
3. Next D01 science: formalize structural-level freshness as competing preregistered clocks and define a prospective falsification tournament rather than choosing decay after observing outcomes.
4. Preserve Formal Core lock.
