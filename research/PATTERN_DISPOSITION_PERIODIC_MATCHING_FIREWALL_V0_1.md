# D01 DL-068 — Disposition-Security Periodic Matching Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PERIODIC_MATCHING_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Separate structural-response claims from exchange-imposed periodic matching for disposition securities.

A price series observed under periodic call-auction cadence is not semantically equivalent to ordinary continuous matching. Apparent support, resistance, breakout persistence, flatness, gap size, touch count, bar count and volume-per-bar can be mechanically altered by the matching regime.

No outcome join is opened.

## Official Taiwan mechanism

Current TWSE disposition rules permit altered matching cadence through artificial-control matching terminals. Current examples show ordinary disposition securities may be matched approximately every two minutes, while changed-trading-method securities can be much slower under first or repeated disposition. Full-payment/pre-collection rules and margin restrictions can also change participant composition.

Therefore D01 must consume a point-in-time disposition receipt.

Required fields:
- dispositionEventId
- attentionStartAt
- dispositionAnnouncedAt
- dispositionStartDate
- dispositionEndDate
- dispositionOrdinalWithin30BusinessDays
- matchingCadenceSeconds
- changedTradingMethodFlag
- fractionalPeriodicAuctionFlag
- prepaymentRule
- marginRestriction
- brokerOrderCapState
- source/version/hash
- firstKnownAt
- predictorFreezeAt
- replaySafe

Unknown cadence or rule vintage:
DISPOSITION_MATCHING_REGIME_UNKNOWN.

## Structural contamination

Periodic matching changes the observation process.

Do not interpret:
- fewer prints as reduced information arrival;
- repeated same-price prints as stronger support;
- long wall-clock persistence as many independent confirmations;
- larger jump between prints as ordinary continuous-trading breakout magnitude;
- volume concentrated at auction prints as direct evidence of participation intensity without cadence normalization.

A two-minute or longer call-auction cadence can aggregate latent orders that would otherwise arrive/exhibit continuously.

## Two clocks

Preserve:
- WALL_CLOCK_TIME
- MATCHING_OPPORTUNITY_COUNT

A structural level touched twice over ten minutes with two matching opportunities is not equivalent to ten continuous minute-by-minute opportunities.

## Bar semantics

Bars crossing multiple matching intervals must preserve:
- expectedMatchCount
- observedMatchCount
- zeroTradeMatchCount
- tradesPerMatch
- volumePerMatch
- priceChangePerMatch

No synthetic continuity is inferred between auction prints.

## Participant-selection effect

Prepayment, full-payment collection, margin restrictions and broker caps can alter who can trade and how much.

These are not technical signals.

They are selection/intervention context that can change:
- liquidity
- turnover
- short-sale participation
- speculative day trading
- inventory capacity

D05/D06/D15 own their respective participation/financing implications; D01 only consumes the state.

## Event-selection bias

A security is not randomly assigned to disposition. Disposition follows abnormal-trading criteria and repeated attention triggers.

Therefore naive before/after comparisons are severely confounded by selection on prior price/volume extremeness.

Future inference must control the trigger path and use matched abnormal but untreated/less-treated comparators where possible.

## Comparator design

Primary:
G0 ATTENTION_OR_ABNORMAL_SECURITY_WITH_CONTINUOUS_MATCHING
G1 DISPOSITION_SECURITY_WITH_PERIODIC_MATCHING

Secondary:
H0 DISPOSITION_EVENT_AWAY_FROM_STRUCTURAL_ZONE
H1 DISPOSITION_EVENT_AT_STRUCTURAL_ZONE

Required common support:
- prior abnormal-return path
- prior turnover/volume
- attention-trigger family
- disposition ordinal
- liquidity
- market cap
- price level
- volatility/regime
- matching cadence
- prepayment/margin rule
- event/news context

## D16 ladder

P0 RAW_PATTERN_RESPONSE
P1 ATTENTION_TRIGGER_PATH_CONTROLLED
P2 DISPOSITION_RECEIPT_IDENTIFIED
P3 MATCHING_CADENCE_CONTROLLED
P4 WALL_CLOCK_VS_MATCH_OPPORTUNITY_SEPARATED
P5 BAR_AGGREGATION_CONTAMINATION_CONTROLLED
P6 PREPAYMENT_AND_MARGIN_RULE_CONTROLLED
P7 LIQUIDITY_PARTICIPANT_SELECTION_CONTROLLED
P8 GENERIC_ABNORMAL_SECURITY_COMPARATOR_CONTROLLED
P9 AWAY_FROM_ZONE_DISPOSITION_COMPARATOR_CONTROLLED
P10 PRICE_LIMIT_AND_AUCTION_CONTEXT_CONTROLLED
P11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
P12 MULTI_CADENCE_MULTI_EVENT_MULTI_REGIME_REPLICATION

## Interpretation states

Q0 PERIODIC_MATCHING_OBSERVATION_EXPLANATION
Q1 PARTICIPANT_SELECTION_EXPLANATION
Q2 ABNORMAL_TRIGGER_SELECTION_EXPLANATION
Q3 AUCTION_AGGREGATION_EXPLANATION
Q4 LIQUIDITY_SCARCITY_EXPLANATION
Q5 PRICE_LIMIT_INTERACTION_EXPLANATION
Q6 STRUCTURAL_RESPONSE_RESIDUAL
Q7 REGIME_PROVENANCE_UNKNOWN
Q8 NOT_EVALUABLE

## SDA

SDA-001 remains open. Periodic-auction price, breakout, persistence and momentum share PRICE_OHLC ancestry.

SDA-002 remains open. Disposition announcement/effective clocks and every structural confirmation require replay-safe knownAt semantics.

## Current decision

PERIODIC_MATCHING_EQUALS_CONTINUOUS_MATCHING = FALSE.
WALL_CLOCK_PERSISTENCE_EQUALS_INDEPENDENT_TOUCH_COUNT = FALSE.
DISPOSITION_LABEL_EQUALS_BEARISH_OR_BULLISH_SIGNAL = FALSE.
ABNORMAL_TRIGGER_SAMPLE_EQUALS_RANDOM_SAMPLE = FALSE.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT = 1.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic cadence-normalization and contamination classifier.
2. Add adversarial tests for same-price persistence, sparse prints, auction jump, full-payment participant selection and trigger-selection bias.
3. Hand P0-P12/Q0-Q8 residual inference to D16.
4. Continue to DL-069: separate the informational/regulatory label effect of attention/disposition announcements from the matching-mechanism effect.
