# D01 DL-053 — Persistent Structural Rejection vs Inventory Replenishment / Queue Refill V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MICROSTRUCTURE_OWNER_BOUNDARY / FORMAL_CORE_LOCKED

## 1. Purpose

DL-052 separated structural rejection from shock snapback, temporary impact recovery and price-discovery completion.

DL-053 freezes the next mechanism firewall:

> When price is rejected near a frozen structural zone and displayed depth later reforms, is this evidence of persistent structural memory, or ordinary liquidity-provider replenishment / queue refill after the shock?

The same visible pattern can arise from different mechanisms.

No return outcome is opened in this tranche.

## 2. Evidence context

External market-microstructure evidence shows that after aggressive market orders / liquidity shocks:
- bid-ask spread can widen and later normalize;
- displayed depth can fall and later refill;
- order-submission intensity changes during recovery;
- price and liquidity recovery can occur on different clocks;
- same-side limit-order submission can be stimulated after aggressive flow.

Therefore a visible bounce plus depth recovery is not sufficient evidence of structural memory.

## 3. Owner boundaries

D05 owns:
- displayed best-level / top-N depth;
- queue / depth imbalance;
- quote freshness;
- replenishment / resiliency primitives;
- transaction-vs-midquote noise;
- provider-event-clock validity;
- hidden-liquidity / cancellation caveats.

D01 owns:
- frozen structural zone identity;
- structural opportunity identity;
- spatial relation between owner-certified liquidity events and the zone;
- structural-vs-replenishment interpretation.

D01 does NOT reconstruct true queue events from OHLCV.
D01 does NOT infer hidden liquidity, spoofing, inventory motive or market-maker intent.

## 4. Four distinct states around the opportunity

### Q0 — PREEXISTING_DISPLAYED_DEPTH

Displayed depth was already present before predictorFreezeAt.

This can affect whether price reaches or crosses the zone.

It is baseline context only if known before freeze.

### Q1 — CONSUMED_OR_DEPLETED_DEPTH

Owner-certified depth is reduced / consumed around the opportunity.

This is a post-freeze mechanism state unless fully observable at freeze.

### Q2 — POST_OPPORTUNITY_REFILL

Displayed depth later reforms after depletion.

This is post-treatment / mediator evidence.

It may not be backfilled into the predictor snapshot.

### Q3 — PERSISTENT_OR_RECOVERED_DEPTH

Depth persists or recovers over an owner-defined horizon / event clock.

This is an outcome/mechanism state, not baseline evidence.

## 5. Refill is not the same as survival

Two different microstructure paths:

A. DEPTH_SURVIVAL
- meaningful displayed depth remains throughout the interaction;
- little or no depletion occurs.

B. DEPTH_REPLENISHMENT
- displayed depth is consumed / reduced;
- new displayed depth later reappears.

Both may coincide with price rejection.
They are not the same mechanism.

## 6. Queue / displayed depth is not committed demand

Displayed depth can:
- be cancelled;
- move to another price;
- be partially hidden from the public book;
- represent stale or fleeting quotes.

Therefore:
DISPLAYED_DEPTH_PRESENT != EXECUTED_SUPPORT.
DISPLAYED_DEPTH_REFILLED != STRUCTURAL_MEMORY_PROVEN.

D05 owns any persistence / cancellation-survival receipt.

## 7. No inventory-intent inference from public book

A common story says liquidity providers replenish because they are managing inventory.

D01 cannot infer inventory motive from public depth snapshots alone.

Allowed labels:
- DISPLAYED_DEPTH_REFILL;
- SAME_SIDE_LIMIT_ORDER_REPLENISHMENT;
- QUOTE_RECOVERY;
- DEPTH_RECOVERY.

Prohibited without direct owner-grade evidence:
- INVENTORY_REBALANCING_CONFIRMED;
- MARKET_MAKER_DEFENSE;
- SMART_MONEY_SUPPORT;
- HIDDEN_BUYER_DEFENSE.

## 8. Spatial relation to the structural zone

For owner-certified refill events D01 may store:

- refillPrice;
- refillDistanceToZone;
- refillInsideZone boolean;
- refillNearZoneNormalized distance;
- preShockReferenceDistance;
- sameSide / oppositeSide relative to structural orientation.

Spatial coincidence is descriptive only.

No universal "within 1 tick / 0.2 ATR / 0.5%" zone-refill threshold is frozen.

## 9. Generic refill comparator

Primary falsification:

G0 GENERIC_POST_SHOCK_REFILL
- comparable shock / depletion / liquidity state;
- refill occurs at a salient non-structural or non-zone location.

G1 ZONE_ASSOCIATED_REFILL
- comparable shock / depletion / liquidity state;
- refill occurs near the frozen structural zone.

If G1 does not add representation beyond G0, generic order-book resiliency is sufficient.

## 10. Survival vs refill comparator

Future analysis must also distinguish:

S0 PREEXISTING_DEPTH_SURVIVED
S1 DEPTH_DEPLETED_THEN_REFILLED
S2 DEPTH_DEPLETED_NO_REFILL
S3 DEPTH_STATE_UNKNOWN

A structural rejection that appears only in S1 may be refill-mediated.
A structural effect that survives after S0/S1 and generic refill controls is stronger residual evidence.

## 11. Timing firewall

Mandatory clocks:

- structuralOpportunityAt;
- predictorFreezeAt;
- depthObservedPreFreezeAt;
- depletionStartedAt;
- depletionPeakAt;
- refillFirstObservedAt;
- refillConfirmedAt;
- depthRecoveryAt;
- priceRecoveryAt.

Rules:
- refillFirstObservedAt > predictorFreezeAt => post-treatment;
- refillConfirmedAt > predictorFreezeAt => not baseline;
- depthRecoveryAt / priceRecoveryAt are future mechanism clocks;
- no future refill/recovery may be backfilled into baseline predictors.

## 12. Event-clock validity

D05 has already frozen that sparse open/10m/15m/30m snapshots cannot identify seconds-scale replenishment.

Therefore DL-053 accepts a refill receipt only if D05 owner evidence declares the event clock valid for the intended estimand.

If only sparse snapshots exist:
REFILL_IDENTIFIABILITY_BLOCKED.

If the provider stream does not prove exchange-event completeness:
use snapshotDeltaPressureProxy / displayed-depth change semantics only.
Do not call it true queue refill.

## 13. Continuous-market primary lane

Because auction / VI / price-limit mechanics can dominate normal queue behavior:

Primary:
CONTINUOUS_SESSION_UNCONSTRAINED.

Separate lanes:
- OPENING_AUCTION;
- CLOSING_AUCTION;
- VOLATILITY_INTERRUPTION;
- PRICE_LIMIT_CONSTRAINED;
- TRIAL / noncontinuous states.

Do not pool these under one refill mechanism.

## 14. Relation to DL-052 shock snapback

DL-052 controls:
- preexisting shock context;
- pre-shock reference snapback;
- liquidity recovery vs price recovery;
- price-discovery completion.

DL-053 adds:
- displayed-depth survival;
- depth depletion;
- post-opportunity refill;
- refill localization relative to the structural zone.

DL-053 does not replace DL-052.
They are nested mechanism layers.

## 15. Future D16 ladder

R0 RAW_TOUCH_RESPONSE

R1 DL052_SHOCK_SNAPBACK_CONTROLLED

R2 PREEXISTING_DEPTH_CONTROLLED

R3 DEPTH_SURVIVAL_VS_DEPLETION_SEPARATED

R4 GENERIC_REFILL_CONTROLLED

R5 ZONE_LOCALIZATION_CONTROLLED

R6 REFILL_TIMING_MEDIATOR_SEPARATED

R7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE

R8 MULTI_DATE_MULTI_TICK_TIER_REPLICATION

Interpretations:

Q0 PREEXISTING_DEPTH_EXPLANATION

Q1 GENERIC_RESILIENCY_EXPLANATION

Q2 REFILL_MEDIATED_REJECTION

Q3 ZONE_LOCALIZED_REFILL_ASSOCIATION

Q4 STRUCTURAL_REJECTION_RESIDUAL

Q5 MICROSTRUCTURE_NOT_IDENTIFIABLE

Q6 NOT_EVALUABLE

None proves causal memory or alpha.

## 16. Common support

Future comparison requires overlap in:
- shock severity/context;
- spread;
- preexisting depth;
- relative tick;
- price tier;
- liquidity regime;
- transaction intensity;
- session state;
- structural age;
- DL-052 snapback context.

No extrapolation outside common support.

## 17. Sample identity / SDA-001

One structural opportunity remains one causal parent even if it carries:
- structural-zone receipt;
- preexisting-depth receipt;
- depletion receipt;
- refill receipt;
- resiliency receipt;
- price-recovery receipt.

These are mechanism receipts, not independent confirmations.

informationRoot remains PRICE_OHLC_PLUS_MICROSTRUCTURE_CONTEXT only when genuine D05 microstructure receipts exist.
Within D01, effectiveIndependentEvidenceCount does not increase automatically.

## 18. Hindsight / SDA-002

Future refill is explicitly post-treatment.

A refill observed after the bounce cannot be used to claim the bounce was predictable by refill.

Any replay must preserve:
- what depth/quote state was known before predictorFreezeAt;
- what became known only after the interaction.

## 19. Required manifest fields

Per structural opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- orientation;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- structuralOpportunityAt;
- predictorFreezeAt;
- sessionState;
- d05EventClockValidity;
- preexistingDepthReceipt;
- depthObservedPreFreezeAt;
- depletionReceipt;
- depletionStartedAt;
- depletionPeakAt;
- refillReceipt;
- refillFirstObservedAt;
- refillConfirmedAt;
- refillPrice;
- refillDistanceToZone;
- refillInsideZone;
- depthRecoveryAt;
- priceRecoveryAt;
- genericRefillComparatorId;
- dl052ShockReceipt;
- timingRole for every receipt;
- replaySafe;
- manifestVersion/hash.

No future return / bounce outcome field belongs in the research manifest.

## 20. Current decision

IMMEDIATE_BOUNCE_PLUS_DEPTH_REFILL_EQUALS_STRUCTURAL_MEMORY =
FALSE.

DISPLAYED_DEPTH_EQUALS_COMMITTED_DEMAND =
FALSE.

REFILL_EQUALS_INVENTORY_MOTIVE =
FALSE.

POST_OPPORTUNITY_REFILL_AS_BASELINE =
PROHIBITED.

SPARSE_SNAPSHOT_EQUALS_TRUE_QUEUE_REFILL =
FALSE.

GENERIC_REFILL_COMPARATOR_REQUIRED =
TRUE.

D05_OWNER_RECEIPT_REQUIRED =
TRUE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic timing / owner-receipt / refill-localization guards and adversarial tests.
2. Preserve depth survival vs depletion/refill vs unknown as distinct states.
3. Reject sparse-snapshot refill identification unless D05 event-clock evidence is valid.
4. Hand R0-R8 / Q0-Q6 mechanism-separation inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate persistent structural rejection from repeated passive-depth display that is continuously cancelled / reposted (quote flicker) rather than economically durable liquidity.
7. No runtime wiring / no Formal change.
