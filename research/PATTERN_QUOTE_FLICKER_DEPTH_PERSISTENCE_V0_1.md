# D01 DL-054 — Persistent Structural Rejection vs Quote Flicker / Cancel-Repost Depth V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MICROSTRUCTURE_OWNER_BOUNDARY / FORMAL_CORE_LOCKED

## 1. Purpose

DL-053 separated structural rejection from ordinary queue refill / displayed-depth recovery.

DL-054 freezes the next falsification:

> When displayed depth appears repeatedly near a frozen structural zone, is the liquidity economically durable, or is the apparent persistence created by rapid cancellation / reposting / quote flicker?

Repeated visible depth is not the same as survival of the same resting liquidity.

No return outcome is opened in this tranche.

## 2. External evidence context

Market-microstructure research shows:
- large shares of visible limit orders can be canceled quickly;
- intense quote/cancel activity can coincide with degraded liquidity and higher short-run volatility;
- fleeting / flickering orders can also occur in liquid price-discovery environments;
- order-book resiliency should therefore be measured with event-clock survival/replenishment, not inferred from a few snapshots.

Therefore:
- cancellation intensity is not automatically manipulative;
- visible depth continuity is not automatically durable liquidity;
- a static or sparse snapshot cannot identify order survival.

## 3. Owner boundaries

D05 owns:
- quote / order-book event clock;
- order survival / cancellation / modification semantics;
- displayed depth;
- queue/depth state;
- quote freshness;
- replenishment / resiliency;
- event completeness / sequence integrity;
- hidden-liquidity and intent caveats.

D01 owns:
- frozen structural-zone identity;
- structural opportunity identity;
- spatial relation between D05-certified durable/flickering liquidity state and the zone;
- structural-vs-microstructure interpretation.

D01 does NOT:
- infer spoofing intent;
- infer market-maker inventory motive;
- reconstruct cancellation events from OHLCV;
- label flicker from sparse open/10m/15m/30m snapshots.

## 4. Core distinction

Freeze four distinct liquidity states.

### F0 — DEPTH_SURVIVAL_CERTIFIED

Owner-grade event evidence shows displayed depth survives over the intended event/time horizon without material cancellation/replacement.

Interpretation:
economically more durable displayed liquidity.

Still not:
STRUCTURAL_MEMORY_PROVEN.

### F1 — DEPTH_REPLACED_SAME_PRICE

Displayed depth remains near the same price but order identity / queue composition changes materially through cancellation and reposting.

Interpretation:
price-level persistence without order-level persistence.

### F2 — FLICKERING_DISPLAYED_DEPTH

Rapid order submission/cancellation/modification causes repeated visible depth with low order lifetime / high churn.

Interpretation:
display continuity may be illusory.

No manipulation label is allowed.

### F3 — DEPTH_PERSISTENCE_UNKNOWN

Event clock or order-level identity is inadequate.

Interpretation:
cannot distinguish durable depth from replacement/flicker.

## 5. Snapshot persistence vs event persistence

A sequence of snapshots can show depth at the same price across time while the underlying orders changed completely between snapshots.

Therefore:

SAME_PRICE_DEPTH_ACROSS_SNAPSHOTS
!=
SAME_ORDER_SURVIVAL.

Sparse snapshots can support:
DISPLAYED_DEPTH_PRESENT_AT_SNAPSHOT.

They cannot support:
ORDER_SURVIVAL_CERTIFIED;
CONTINUOUS_QUEUE_PERSISTENCE;
QUOTE_FLICKER_RATE.

unless D05 event evidence explicitly validates the required event process.

## 6. Cancellation/repost metrics

D01 may consume D05 owner receipts such as:
- orderLifetimeMs distribution;
- cancellationRate;
- modificationRate;
- messageRate;
- cancelToSubmitRatio;
- samePriceReplacementRate;
- queueTurnoverRate;
- survivalProbabilityAtHorizon;
- depthWeightedSurvival;
- eventClockCompleteness.

D01 does not define thresholds for:
- "high cancellation";
- "flicker";
- "durable";
- "toxic";
- "spoofing".

D05 owns metric construction and threshold semantics if they ever become canonical.

## 7. Same-price replacement is not new structural evidence

If depth at the same structural price repeatedly disappears and reappears:
- raw display count may be high;
- order-survival count may be low.

This may represent:
- routine liquidity provision;
- quote competition;
- price discovery;
- inventory/latency response;
- cancellation risk;
- unknown mechanism.

D01 does not infer which motive is true from public book behavior alone.

## 8. Flicker and manipulation are not synonyms

Fast cancellation can be associated with:
- adverse market quality in some episodes;
- beneficial price discovery / liquid environments in others.

Therefore:
FLICKER_DETECTED
!=
SPOOFING_CONFIRMED.

Any manipulation claim requires owner-grade / regulatory evidence outside D01's chart-pattern mandate.

## 9. Structural-zone relation

For owner-certified event states D01 may store:
- eventPrice;
- distanceToFrozenZone;
- insideZone;
- sideRelativeToOrientation;
- depthSurvivalState;
- queueTurnoverState;
- cancellationState;
- replacementState.

Spatial coincidence is descriptive only.

No universal distance threshold is frozen.

## 10. Timing firewall

Mandatory clocks:
- structuralOpportunityAt;
- predictorFreezeAt;
- quoteEventFirstSeenAt;
- quoteEventLastSeenAt;
- cancellationObservedAt;
- repostObservedAt;
- durabilityConfirmedAt;
- depthRecoveryAt;
- priceRecoveryAt.

Rules:
- cancellation/repost observed after predictorFreezeAt is post-treatment/mechanism state;
- durability confirmed after predictorFreezeAt cannot be backfilled into baseline predictors;
- future survival cannot be used to claim pre-freeze durable depth.

## 11. Event-clock validity

To classify F0/F1/F2:
D05 owner receipt must prove the event clock is adequate for the intended horizon.

If only sparse snapshots exist:
DEPTH_PERSISTENCE_UNKNOWN.

If provider sequence completeness is unknown:
EVENT_CLOCK_INCOMPLETE.

If order IDs are unavailable:
ORDER_IDENTITY_UNAVAILABLE.

The strongest allowed language must downgrade accordingly.

## 12. Generic comparator

Primary falsification:

G0 GENERIC_FLICKER_OR_REPLACEMENT
- similar liquidity/tick/session context;
- cancellation/repost activity away from structural zones.

G1 ZONE_ASSOCIATED_FLICKER_OR_REPLACEMENT
- comparable activity near the frozen structural zone.

If G1 adds no representation beyond G0, generic microstructure dynamics are sufficient.

## 13. Durable-depth comparator

Future comparison:

D0 UNKNOWN_PERSISTENCE
D1 FLICKERING_OR_REPLACED_DEPTH
D2 SURVIVING_DISPLAYED_DEPTH
D3 DEPTH_REFILL_AFTER_DEPLETION
D4 NO_MEANINGFUL_DEPTH

These are mechanism states, not independent evidence votes.

## 14. Relation to DL-053

DL-053 asked whether depth survived, depleted/refilled, or remained unknown.

DL-054 refines the apparent "survived" / "recovered" states:
- was the same liquidity economically durable?
- or was displayed depth repeatedly replaced?

DL-054 therefore nests inside D05-certified survival/refill interpretation.

## 15. SDA-001 anti-double-counting

One structural opportunity may carry:
- zone receipt;
- depth receipt;
- refill receipt;
- cancellation receipt;
- repost receipt;
- persistence receipt.

These are linked mechanism receipts.

Default:
effectiveIndependentEvidenceCount = 1.

Distinct microstructure receipts do not automatically create confluence votes.

## 16. SDA-002 hindsight control

Future order survival is post-treatment unless known at predictorFreezeAt.

A quote that later survives 5 seconds cannot be labeled "durable 5s liquidity" at time zero.

Every persistence receipt requires:
- firstObservableAt;
- persistenceKnownAt;
- predictorFreezeAt;
- replaySafe;
- eventClockComplete.

If persistenceKnownAt > predictorFreezeAt:
POST_TREATMENT_PERSISTENCE.

## 17. Future D16 ladder

F0 RAW_ZONE_REJECTION
F1 DL053_REFILL_STATE_CONTROLLED
F2 ORDER_SURVIVAL_VS_REPLACEMENT_SEPARATED
F3 CANCELLATION_REPOST_ACTIVITY_CONTROLLED
F4 GENERIC_FLICKER_CONTROLLED
F5 EVENT_CLOCK_COMPLETENESS_CONTROLLED
F6 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
F7 MULTI_DATE_MULTI_TICK_TIER_REPLICATION

Interpretations:
Q0 DISPLAYED_DEPTH_ONLY_EXPLANATION
Q1 SAME_PRICE_REPLACEMENT_EXPLANATION
Q2 QUOTE_FLICKER_EXPLANATION
Q3 GENERIC_CANCELLATION_ACTIVITY_EXPLANATION
Q4 DURABLE_DEPTH_CONTEXT_ONLY
Q5 EVENT_CLOCK_NOT_IDENTIFIABLE
Q6 STRUCTURAL_REJECTION_RESIDUAL
Q7 NOT_EVALUABLE

None proves causal memory or alpha.

## 18. Required manifest fields

Per structural opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- orientation;
- predictorFreezeAt;
- structuralOpportunityAt;
- d05EventClockValidity;
- orderIdentityAvailable;
- displayedDepthReceipt;
- refillReceipt;
- orderSurvivalReceipt;
- cancellationReceipt;
- repostReceipt;
- samePriceReplacementReceipt;
- quoteFlickerReceipt;
- depthPersistenceState;
- genericComparatorId;
- timingRole per receipt;
- replaySafe;
- informationRoot;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No return outcome belongs in this manifest.

## 19. Current decision

SAME_PRICE_DEPTH_EQUALS_SAME_ORDER_SURVIVAL =
FALSE.

FLICKER_EQUALS_MANIPULATION =
FALSE.

SPARSE_SNAPSHOT_CAN_CERTIFY_ORDER_PERSISTENCE =
FALSE.

FUTURE_SURVIVAL_AS_BASELINE =
PROHIBITED.

GENERIC_FLICKER_COMPARATOR_REQUIRED =
TRUE.

D05_EVENT_CLOCK_REQUIRED =
TRUE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic depth-survival / replacement / flicker eligibility helper and adversarial tests.
2. Preserve snapshot persistence vs event persistence separately.
3. Reject sparse-snapshot or incomplete-event-clock order-survival claims.
4. Hand F0-F7 / Q0-Q7 common-support and mechanism-separation inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural rejection from latency/queue-position advantage and hidden-liquidity execution effects around the zone.
7. No runtime wiring / no Formal change.
