# D01 DL-062 — D16 Auction / End-of-Session Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes causal session-phase semantics.
D16 owns future attribution inference.

Question:
Does a structural response remain after opening/closing auction mechanics, benchmark-close demand and end-of-session liquidity concentration are controlled?

## 2. Required phase separation

Never pool:
- preopen indicative state;
- opening final print;
- continuous trading;
- preclose indicative state;
- closing final print;
- delayed close;
- post-close fixed price.

Auction-mixed bars require phase decomposition or remain not comparable to pure continuous bars.

## 3. Required comparators

Closing:
G0 AUCTION_OR_CLOSE_MECHANICAL_EVENT_AWAY_FROM_ZONE
G1 AUCTION_OR_CLOSE_MECHANICAL_EVENT_AT_ZONE

Opening:
O0 OPENING_CALL_EVENT_AWAY_FROM_ZONE
O1 OPENING_CALL_EVENT_AT_ZONE

Do not pool opening and closing estimands.

## 4. Mechanical contexts

Report separately:
- end-of-session liquidity concentration;
- month-end/quarter-end;
- index rebalance;
- modeled passive flow;
- verified passive execution;
- ETF primary-market context;
- derivative expiry/settlement;
- benchmark-close targeting.

High auction volume alone does not identify passive execution.

## 5. Timing

Every receipt requires:
receiptKnownAt <= predictorFreezeAt < endpointWindowStart.

Final auction price/volume cannot enter a predictor frozen before the final match.

Delayed close uses actual execution time, not scheduled close.

## 6. Future ladder

A0 RAW_ZONE_RESPONSE
A1 CONTINUOUS_VS_AUCTION_PHASE_SEPARATED
A2 OPENING_GAP_CALL_CONTROLLED
A3 CLOSING_INDICATIVE_VS_FINAL_PRINT_SEPARATED
A4 CLOSING_LIQUIDITY_CONCENTRATION_CONTROLLED
A5 MONTH_END_QUARTER_END_CONTROLLED
A6 INDEX_REBALANCE_PASSIVE_CLOSE_CONTROLLED
A7 ETF_BENCHMARK_CLOSE_CONTEXT_CONTROLLED
A8 DERIVATIVE_EXPIRY_SETTLEMENT_CONTROLLED
A9 GENERIC_AUCTION_MECHANICAL_COMPARATOR_CONTROLLED
A10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
A11 MULTI_DATE_MULTI_SYMBOL_MULTI_AUCTION_REPLICATION

## 7. Interpretation

If structural response disappears after auction-phase separation:
AUCTION_PHASE_EXPLANATION.

If it disappears after end-of-session liquidity/passive controls:
CLOSING_MECHANICAL_EXPLANATION.

If it survives all layers on common support:
STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE.

Still not causal proof or alpha.

## 8. SDA boundary

Auction price and D01 structure remain PRICE_OHLC ancestry.
Additional microstructure/passive receipts are context, not automatic independent votes.

SDA-001 / SDA-002 remain open.

## 9. Promotion boundary

No score, rank, Top6, capital, threshold or runtime change is authorized.

Formal Core remains LOCKED.
