# D01 DL-066 — D16 Suspension/Resumption Residual-Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Question

Does structural response survive after stale pre-suspension anchors, no-trade intervals, reopening reference mechanics, cross-market catch-up, corporate-action resets, price limits and first-auction price discovery are controlled?

## Required separation

Keep distinct:
- last pre-suspension executed price;
- structural root;
- exchange reopening reference;
- first reopening auction price;
- first continuous trade;
- post-reopening discovery interval.

Do not forward-fill suspended sessions with pseudo-bars.

## Comparator

G0 SUSPENSION_REOPENING_AWAY_FROM_STRUCTURAL_ZONE
G1 SUSPENSION_REOPENING_AT_STRUCTURAL_ZONE

Match/stratify on:
- suspension duration and reason;
- benchmark/industry move;
- event/news intensity;
- corporate-action overlap;
- reopening reference mechanics;
- price-limit distance;
- liquidity/volatility;
- structural age/history.

## Ladder

R0 PRE_SUSPENSION_RAW_ZONE_RESPONSE
R1 SUSPENSION_INTERVAL_IDENTIFIED
R2 POINT_IN_TIME_SUSPENSION_RECEIPT_CONTROLLED
R3 NO_TRADE_INTERVAL_EXCLUDED_FROM_PATTERN_GEOMETRY
R4 CORPORATE_ACTION_OVERLAP_CONTROLLED
R5 REOPENING_REFERENCE_MECHANICS_CONTROLLED
R6 PRICE_LIMIT_CONSTRAINT_CONTROLLED
R7 BENCHMARK_AND_INDUSTRY_GAP_CONTROLLED
R8 EVENT_NEWS_CONTEXT_CONTROLLED
R9 OPENING_AUCTION_DISCOVERY_CONTROLLED
R10 POST_REOPENING_DISCOVERY_WINDOW_CONTROLLED
R11 STALE_ANCHOR_FRESHNESS_STRATIFIED
R12 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
R13 MULTI_DURATION_MULTI_REASON_MULTI_REGIME_REPLICATION

## Interpretation

Q0 STALE_PRICE_ANCHOR_EXPLANATION
Q1 INFORMATION_ACCUMULATION_EXPLANATION
Q2 CROSS_MARKET_CATCHUP_EXPLANATION
Q3 CORPORATE_ACTION_RESET_EXPLANATION
Q4 REOPENING_AUCTION_IMBALANCE_EXPLANATION
Q5 PRICE_LIMIT_CONSTRAINT_EXPLANATION
Q6 LIQUIDITY_SCARCITY_EXPLANATION
Q7 STRUCTURAL_RESPONSE_RESIDUAL
Q8 SUSPENSION_DATA_UNKNOWN
Q9 NOT_EVALUABLE

## Governance

SDA-001 and SDA-002 remain open.
PRICE_OHLC-derived representations default to one effective independent evidence root.
No Formal ranking/gating/Top6/threshold/runtime change is authorized.
