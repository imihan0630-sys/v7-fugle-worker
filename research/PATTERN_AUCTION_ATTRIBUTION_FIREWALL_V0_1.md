# D01 DL-062 — Structural Response vs Opening/Closing Auction Mechanics V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / AUCTION_ATTRIBUTION_FIREWALL / SDA_001_SDA_002_OPEN / FORMAL_CORE_LOCKED

## 1. Purpose

DL-061 separated structural response from index-weight, passive-flow and ETF/futures mechanical effects.

DL-062 adds the session-boundary microstructure firewall:

> A support/resistance "hold", "breakout", "rejection" or "close confirmation" can be generated or materially altered by opening/closing call-auction mechanics, end-of-session liquidity concentration, benchmark replication, passive market-on-close demand, delayed close states, or auction-specific price pressure.

The same final daily close can arise from very different intraday and closing-auction paths.

Therefore the final close alone cannot identify the auction path.

No return outcome is opened in this tranche.

## 2. Canonical owners

D01 does not rebuild auction mechanics.

Consume:

### D05-06
Canonical owner of:
- OPEN_CALL;
- OPEN_TRIAL;
- CLOSE_CALL_ACCUMULATION;
- CLOSE_TRIAL;
- CLOSE_DELAYED;
- CLOSE_FINAL;
- natively observed auction imbalance / trial indicative state.

Current canonical maturity:
prospective Taiwan PIT feasibility validated;
historical pre-close imbalance remains UNKNOWN unless actually archived.

### D11-14
Index-adjustment event and passive-flow event clocks.

### D06-11 / D06-16
Passive rebalancing and ETF mechanics.

### D14-14
Auction / special-matching execution-cost context.

### D02-12
Intraday volume-curve context, without relabeling EOD volume as auction imbalance.

Missing owner evidence remains UNKNOWN.

## 3. Session-phase identity

Every D01 opportunity involving session boundaries must preserve:

- sessionDate;
- exchangeSession;
- auctionPhase;
- predictorFreezeAt;
- structureFirstObservableAt;
- structureConfirmedAt;
- trialStateFirstObservedAt;
- trialStateKnownAt;
- finalMatchAt;
- continuousLastTradeAt;
- officialCloseAt;
- delayedCloseState;
- source/version/hash.

Frozen phases:

S0 PRE_OPEN
S1 OPEN_TRIAL
S2 OPEN_CALL
S3 CONTINUOUS_SESSION
S4 CLOSE_CALL_ACCUMULATION
S5 CLOSE_TRIAL
S6 CLOSE_DELAYED
S7 CLOSE_FINAL
S8 POST_CLOSE
S9 PHASE_UNKNOWN

A state from one phase may not be silently relabeled as another.

## 4. Final close is not a pre-close imbalance receipt

Canonical D05-06 rule is binding:

- final close is historically replayable;
- final auction volume may be replayable;
- historical 13:25-13:30 trial/imbalance path is not generally proven;
- missing pre-close trial state remains UNKNOWN.

Therefore:

FINAL_CLOSE_CAN_BACKFILL_TRIAL_IMBALANCE = FALSE.
EOD_VOLUME_SPIKE_EQUALS_AUCTION_IMBALANCE = FALSE.
FINAL_AUCTION_DISPLACEMENT_EQUALS_PREMATCH_ORDER_IMBALANCE = FALSE.

No reconstruction from:
- final close;
- final volume;
- late-session total volume;
- close-minus-last-trade alone.

## 5. Structural-state timing

Separate:

### A. PRE_AUCTION_STRUCTURE_CONFIRMED

The structural root/version/role state was fully known before the auction predictor freeze.

It may be used as baseline context.

### B. AUCTION_CREATED_OR_CONFIRMED_STRUCTURE

The structural state becomes confirmed only because:
- final auction price enters/leaves the zone;
- final auction print completes breakout confirmation;
- delayed close supplies the decisive bar/price;
- later bars certify the structure.

It cannot be used as a pre-auction predictor.

### C. STRUCTURE_UNKNOWN_AT_AUCTION

The required structural root/zone was not replay-safe by predictor freeze.

UNKNOWN remains UNKNOWN.

## 6. Close-hold / close-break semantics

A statement such as:
"the stock closed above resistance"
or
"the close held support"

must be decomposed.

Possible states:

C0 CONTINUOUS_HOLD_BEFORE_AUCTION
- continuous-session price already held the relevant side before close-call accumulation.

C1 AUCTION_MOVED_INTO_HOLD
- continuous market was not on the held side;
- closing auction final price moved into a hold classification.

C2 AUCTION_MOVED_OUT_OF_HOLD
- continuous market appeared to hold;
- final auction moved through the boundary.

C3 AUCTION_CONFIRMED_BREAK
- canonical breakout confirmation occurs only at CLOSE_FINAL.

C4 CONTINUOUS_BREAK_AUCTION_REINFORCED
- break existed before auction;
- auction continued same side.

C5 CLOSE_STATE_UNKNOWN
- required pre-close trial/continuous context missing.

C1/C2/C3 are auction-conditioned states.
They are not equivalent to continuous-session structural response.

## 7. Closing-price displacement

When replay-safe data exist, store separately:

- lastContinuousPrice;
- preCloseMidquote;
- closingTrialPrice;
- finalAuctionPrice;
- finalOfficialClose;
- zoneBoundary;
- displacementLastContinuousToAuction;
- displacementPreCloseMidToAuction;
- trialToFinalDisplacement.

Do not infer hidden order imbalance from displacement.

Price displacement is an observed price result.
Order imbalance is a separate D05-06 primitive.

## 8. Closing liquidity concentration

End-of-session volume can concentrate for legitimate reasons:
- passive benchmark tracking;
- index rebalance;
- ETF flows;
- option/futures expiry;
- month/quarter end;
- liquidity-seeking execution;
- auction-specific coordination.

Allowed context descriptors when source-complete:
- auctionVolume;
- auctionVolumeShare;
- lateContinuousVolumeShare;
- displayed trial depth;
- displayed trial imbalance;
- delayed-close state;
- D06/D11 passive-event receipt;
- D14 execution-cost receipt.

Prohibited:
- treating large closing volume as directional structural confirmation;
- converting generic EOD volume into auction imbalance;
- inferring hidden buy/sell demand from final volume alone.

## 9. Benchmark-replication / market-on-close firewall

Passive investors may target the official close to minimize tracking error.

Therefore a zone response at CLOSE_FINAL may coincide with:
- index add/delete/weight change;
- rebalance effective session;
- ETF/passive replication;
- month/quarter-end benchmark activity.

Consume DL-061 / D06 / D11 owner receipts.

If a closing structural classification is created or materially changed during an owner-certified passive event:

CLOSE_STRUCTURAL_STATE_WITH_PASSIVE_REPLICATION_CONTEXT.

This is context, not proof that passive flow caused the move.

Actual execution remains distinct from modeled exposure.

## 10. Opening-auction firewall

Opening call auctions aggregate overnight / pre-open information.

A prior-day zone interaction at the open is not equivalent to continuous intraday approach.

Separate:

O0 PRIOR_ZONE_NO_OPEN_AUCTION_CONTEXT
O1 OPEN_TRIAL_APPROACH
O2 OPEN_CALL_GAP_INTO_ZONE
O3 OPEN_CALL_GAP_THROUGH_ZONE
O4 OPEN_AUCTION_HOLD_OR_REJECTION
O5 OPEN_DELAYED_OR_CONSTRAINED
O6 OPEN_CONTEXT_UNKNOWN

An opening-gap-through state may reflect overnight information and auction price discovery.
Do not call it a failed intraday retest without the correct opportunity semantics.

## 11. No same-print predictor/outcome loop

If the final auction print is required to define:
- close breakout;
- close hold;
- final-zone location;

the same final print cannot simultaneously be treated as a pre-close predictor and its own outcome.

Hard rule:

STRUCTURE_CONFIRMED_AT >= AUCTION_OUTCOME_TIMESTAMP
=> PRE_AUCTION_PREDICTOR_ELIGIBLE = FALSE.

This extends SDA-002.

## 12. Generic auction comparator

Primary falsification:

G0 SAME_AUCTION_STATE_AWAY_FROM_ZONE
G1 SAME_AUCTION_STATE_AT_PRECONFIRMED_ZONE

Match or condition on:
- auction phase;
- displayed imbalance state where genuinely observed;
- auction volume share;
- delayed-close state;
- passive/index event;
- liquidity;
- volatility;
- tick regime;
- market/sector context.

If G1 adds no residual representation:
AUCTION_MECHANICS_SUFFICIENT.

## 13. Continuous-vs-auction comparator

A second falsification asks whether structure matters before the auction.

H0 CONTINUOUS_OPPORTUNITY_PRE_AUCTION
H1 AUCTION_ONLY_OPPORTUNITY
H2 CONTINUOUS_AND_AUCTION_CONCORDANT
H3 CONTINUOUS_AND_AUCTION_DIVERGENT
H4 CONTEXT_UNKNOWN

A structural hypothesis is stronger if it survives in H0 and is not dependent on H1-only classifications.

This is not an alpha claim.

## 14. Trial-state missingness

Because historical trial states are generally unavailable:

historical rows may contain:
- final close;
- final volume;
- continuous-session bars;

while auction trial state remains UNKNOWN.

Those rows can support:
- final-close descriptive analysis;
- continuous-vs-final displacement where timestamps permit.

They cannot support:
- historical auction imbalance;
- trial-price path;
- trial depth;
- imbalance direction.

Do not drop UNKNOWN rows silently.

## 15. Delayed-close / constraint states

If closing match is delayed or market constraints apply:
- preserve the scheduled close;
- actual final match time;
- delay reason if owner-certified;
- limit/VI/session state;
- source receipt.

Do not mix delayed-close cases with normal CLOSE_FINAL.

D05 owns mechanism semantics.

## 16. SDA-001 information-root guard

Auction state, D01 structure and late-session price/volume can share price/order-flow ancestry.

Do not treat:
- structure;
- auction displacement;
- closing volume;
- trial imbalance;
- passive event

as independent votes automatically.

Export information lineage and keep effectiveIndependentEvidenceCount = 1 by default within one parent until D16 validates residual/dependence structure.

## 17. SDA-002 no-lookahead guard

Required:
- structureFirstObservableAt;
- structureConfirmedAt;
- auctionStateFirstObservedAt;
- auctionStateKnownAt;
- predictorFreezeAt;
- finalMatchAt;
- replaySafe.

Later trial/final states cannot backfill earlier times.

Final close cannot certify a pre-close structure retroactively.

SDA-002 remains open.

## 18. Future D16 ladder

A0 RAW_CLOSE_ZONE_CLASSIFICATION

A1 PRE_AUCTION_STRUCTURE_TIMING_CONTROLLED

A2 CONTINUOUS_LAST_PRICE_CONTROLLED

A3 AUCTION_PHASE_CONTROLLED

A4 OBSERVED_TRIAL_STATE_CONTROLLED

A5 AUCTION_VOLUME_CONCENTRATION_CONTROLLED

A6 PASSIVE_INDEX_REPLICATION_CONTROLLED

A7 DELAYED_CLOSE_CONSTRAINT_CONTROLLED

A8 GENERIC_AUCTION_EVENT_COMPARATOR_CONTROLLED

A9 CONTINUOUS_VS_AUCTION_DIVERGENCE_CONTROLLED

A10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

A11 PROSPECTIVE_MULTI_DATE_REPLICATION

## 19. Future interpretations

Q0 FINAL_CLOSE_ONLY_ARTIFACT
Q1 AUCTION_DISPLACEMENT_EXPLANATION
Q2 AUCTION_IMBALANCE_EXPLANATION
Q3 PASSIVE_CLOSE_REPLICATION_EXPLANATION
Q4 DELAYED_CLOSE_CONSTRAINT_EXPLANATION
Q5 OPENING_AUCTION_PRICE_DISCOVERY_EXPLANATION
Q6 CONTINUOUS_STRUCTURE_SURVIVES_AUCTION_CONTROL
Q7 STRUCTURAL_RESPONSE_RESIDUAL
Q8 HISTORICAL_AUCTION_STATE_UNKNOWN
Q9 NOT_EVALUABLE

## 20. Current decision

FINAL_CLOSE_CAN_BACKFILL_TRIAL_IMBALANCE =
FALSE.

EOD_VOLUME_SPIKE_EQUALS_AUCTION_IMBALANCE =
FALSE.

FINAL_AUCTION_PRINT_CAN_BE_ITS_OWN_PRE_CLOSE_PREDICTOR =
FALSE.

CLOSE_CONFIRMATION_EQUALS_CONTINUOUS_SESSION_CONFIRMATION =
FALSE.

HISTORICAL_PRE_CLOSE_IMBALANCE =
UNKNOWN_UNLESS_ARCHIVED.

AUCTION_VOLUME_EQUALS_DIRECTIONAL_ALPHA =
FALSE.

D05_06_REMAINS_CANONICAL_OWNER =
TRUE.

OUTCOME_JOIN =
CLOSED.

SDA_001_STATUS =
OPEN.

SDA_002_STATUS =
OPEN.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic session-phase / close-state / auction-data-eligibility helper and adversarial tests.
2. Consume D05-06 auction receipts without reconstructing historical imbalance from final data.
3. Preserve continuous-vs-auction divergence and passive-close context.
4. Hand A0-A11 / Q0-Q9 inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate prior-day structural memory from overnight information accumulation and opening-gap price discovery at the next session open.
7. No outcome join / no runtime wiring / no Formal change.
