# D01 DL-068 — D16 Extended Matching Cadence Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes structural semantics under disposition-security extended matching / periodic call auction.
D16 owns future residual and dependence-aware inference.

Primary question:

Does apparent pattern persistence survive controls for altered matching cadence, actual executable opportunity count, quote-vs-trade state, stale-last-price contamination, periodic gap crossing and disposition-related market restrictions?

## 2. Required clocks

Preserve separately:
- wallClockMinutes;
- scheduledMatchOpportunityCount;
- executedMatchCount;
- actualTradeCount.

A long wall-clock interval with zero scheduled/executed matches is not evidence of price acceptance.

## 3. Matching-regime receipt

Use the official point-in-time disposition / altered-trading-method receipt.

At minimum:
- dispositionEpisodeId;
- measureVersion;
- effectiveFrom/effectiveTo;
- matchingIntervalSeconds;
- alteredTradingMethodState;
- periodicCallAuctionState;
- occurrence/tier state;
- firstKnownAt;
- replaySafe.

Do not infer regime from sparse observed trades.

## 4. Quote vs execution

Indicative/computed prices are not executed trades.

Future structural outcomes must identify whether the observation came from:
- quote-only state;
- scheduled match with no execution;
- actual match;
- periodic gap crossing;
- volatility-interruption postponement.

## 5. Bar integrity

Any research bar carrying stale forward-filled last prices must be flagged and excluded from promotion-grade pattern geometry.

Report:
- actualTradeCount;
- scheduledMatchOpportunityCount;
- executedMatchCount;
- staleCarryForwardUsed.

## 6. Required comparators

G0 NORMAL_CADENCE_AT_STRUCTURAL_ZONE
G1 EXTENDED_CADENCE_AT_STRUCTURAL_ZONE

H0 EXTENDED_CADENCE_AWAY_FROM_STRUCTURAL_ZONE
H1 EXTENDED_CADENCE_AT_STRUCTURAL_ZONE

Preferred longitudinal diagnostic:
B0 PRE_DISPOSITION_NORMAL_CADENCE
B1 DURING_DISPOSITION_EXTENDED_CADENCE
B2 POST_DISPOSITION_RETURNED_CADENCE

where same-symbol / same-root causal continuity is defensible.

## 7. Common support

Control at least:
- realized volatility;
- liquidity;
- price level;
- relative tick;
- structural age/history;
- market/sector regime;
- actual trade count;
- scheduled matching opportunities;
- disposition tier / related restrictions.

Do not compare a sparse 60-minute periodic-auction regime directly with normal continuous trading without overlap.

## 8. Nested mechanism

DL-067 intraday volatility interruption can occur within extended matching.

Keep separate:
- base matching cadence;
- any price-stabilization postponement;
- actual periodic call execution.

Nested mechanisms do not create independent confirmations.

## 9. Future ladder

C0 RAW_PATTERN_RESPONSE
C1 DISPOSITION_EPISODE_IDENTIFIED
C2 MATCHING_CADENCE_RECEIPT_CONTROLLED
C3 WALL_CLOCK_VS_MATCH_OPPORTUNITY_SEPARATED
C4 QUOTE_VS_EXECUTION_SEPARATED
C5 PSEUDO_BAR_FORWARD_FILL_EXCLUDED
C6 PERIODIC_GAP_CROSSING_CONTROLLED
C7 VOLATILITY_INTERRUPTION_NESTED_MECHANISM_CONTROLLED
C8 ORDER_TYPE_AND_MARGIN_RESTRICTIONS_CONTROLLED
C9 LIQUIDITY_AND_TRADE_COUNT_CONTROLLED
C10 BEFORE_DURING_AFTER_SYMBOL_COMPARATOR_CONTROLLED
C11 NORMAL_CADENCE_COMPARATOR_CONTROLLED
C12 AWAY_FROM_ZONE_EXTENDED_CADENCE_CONTROLLED
C13 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
C14 MULTI_TIER_MULTI_SYMBOL_MULTI_REGIME_REPLICATION

## 10. Interpretation

Q0 SPARSE_MATCHING_EXPLANATION
Q1 STALE_LAST_PRICE_FLATNESS_EXPLANATION
Q2 PERIODIC_CALL_GAP_EXPLANATION
Q3 INDICATIVE_QUOTE_NOT_EXECUTED_EXPLANATION
Q4 NESTED_VOLATILITY_INTERRUPTION_EXPLANATION
Q5 ORDER_RESTRICTION_EXPLANATION
Q6 LIQUIDITY_ATTENTION_EXPLANATION
Q7 STRUCTURAL_RESPONSE_RESIDUAL
Q8 MATCHING_REGIME_UNKNOWN
Q9 NOT_EVALUABLE

None proves alpha.

## 11. Audit boundary

SDA-001 remains open:
sparse-bar shape, breakout, VCP and support/resistance labels share PRICE_OHLC ancestry.

SDA-002 remains open:
disposition measure/version and matching regime must be first-known and replay-safe.

No ranking, gating, Top6, capital, threshold or runtime change is authorized.

Formal Core remains LOCKED.
