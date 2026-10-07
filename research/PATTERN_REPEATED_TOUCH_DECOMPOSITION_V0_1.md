# D01 DL-072 — Repeated-Touch Strength Decomposition V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / TOUCH_DECOMPOSITION / FORMAL_CORE_LOCKED

## Purpose

Decompose the ambiguous claim "more touches make support/resistance stronger."

Repeated interaction can plausibly work in opposite directions:
- familiarity / self-fulfilling coordination can reinforce a known level;
- resting liquidity can be consumed;
- adverse-selection risk can cause passive liquidity to withdraw;
- stimulated replenishment can rebuild liquidity after a shock;
- repeated failed crossings can merely reflect discrete tick, stale print or periodic matching artifacts.

Therefore touch count has no monotone sign by construction.

## Canonical touch object

Each touch must have immutable lineage:
- structuralRootId
- touchId
- firstObservableAt
- executionOrMatchId
- touchPrice
- zoneDistanceTicks
- directionOfApproach
- touchMechanism
- preTouchSpread
- preTouchDepthReceipt
- postTouchDepthReceipt
- replenishmentReceipt
- outcomeAvailableAt
- predictorFreezeAt
- source/version/hash
- replaySafe

A repeated provider bar, duplicated print, or carried close is not a new touch.

## Competing mechanisms

M1 COORDINATION_REINFORCEMENT
Prior visible reactions may increase trader attention and conditional willingness to act near the same level.

M2 RESTING_LIQUIDITY_DEPLETION
Repeated aggressive interaction can consume resting liquidity and make later crossing easier.

M3 STIMULATED_REPLENISHMENT
Liquidity providers may refill after execution shocks; book resiliency can partially restore depth/spread.

M4 ADVERSE_SELECTION_WITHDRAWAL
If order flow becomes toxic/predictable, passive liquidity can withdraw or reprice.

M5 MICROSTRUCTURE_ARTIFACT
Sparse prints, periodic auctions, tick clustering and book gaps can create false repeated touches.

No mechanism is selected by touch count alone.

## Touch order matters

Preserve sequence:
T1, T2, T3...

Do not reduce history to one scalar touchCount if sequence information is required.

Candidate state variables:
- cumulativeIndependentTouches
- timeSincePriorTouch
- executionCountSincePriorTouch
- volatilityDistanceSincePriorTouch
- depthChangeSincePriorTouch
- replenishmentRatio
- approachSpeed
- approachVolumeContext

## No monotone assumption

Allowed empirical shapes:
- REINFORCING
- DEPLETING
- U_SHAPED
- INVERTED_U
- THRESHOLD
- NO_RELATION
- STATE_DEPENDENT
- NOT_IDENTIFIED

"Third touch is best" and similar folklore must be tested, not encoded.

## Liquidity ownership boundary

D04/D05 own spread/depth/order-book and resiliency receipts.
D02 owns participation/volume semantics.
D01 consumes those receipts and asks whether structural geometry has residual value.

No second liquidity engine is built in D01.

## Comparator design

A within-root:
Compare later touches of the same structural root after conditioning on freshness, volatility, liquidity, and approach state.

B between-root:
Match roots on age, formation mechanism, price band, tick regime, liquidity and prior path, then compare different touch histories.

C mechanism falsifiers:
- similar touch count but high replenishment vs depletion;
- similar root/freshness but high vs low adverse-selection context;
- same touch order under continuous vs periodic matching.

## D16 ladder

T0 RAW_TOUCH_RESPONSE
T1 TOUCH_LINEAGE_DEDUPED
T2 FRESHNESS_CLOCK_CONTROLLED
T3 TICK_AND_TRADING_MECHANISM_CONTROLLED
T4 PRE_TOUCH_LIQUIDITY_CONTROLLED
T5 DEPTH_DEPLETION_MEASURED
T6 REPLENISHMENT_MEASURED
T7 ADVERSE_SELECTION_CONTEXT_CONTROLLED
T8 APPROACH_SPEED_VOLUME_CONTROLLED
T9 WITHIN_ROOT_SEQUENCE_CONTROLLED
T10 MATCHED_BETWEEN_ROOT_COMPARATOR
T11 NONMONOTONIC_FORM_TESTED
T12 STRUCTURAL_TOUCH_RESIDUAL_CANDIDATE
T13 MULTI_SYMBOL_MULTI_REGIME_REPLICATION

## Interpretation

Q0 COORDINATION_REINFORCEMENT_EXPLANATION
Q1 RESTING_LIQUIDITY_DEPLETION_EXPLANATION
Q2 STIMULATED_REPLENISHMENT_EXPLANATION
Q3 ADVERSE_SELECTION_WITHDRAWAL_EXPLANATION
Q4 MICROSTRUCTURE_ARTIFACT_EXPLANATION
Q5 MIXED_MECHANISM
Q6 STRUCTURAL_TOUCH_RESIDUAL
Q7 LIQUIDITY_RECEIPT_UNKNOWN
Q8 NOT_EVALUABLE

## SDA

SDA-001 remains open. Touch count, breakout, higher-low and momentum share price ancestry unless non-price receipts provide separately owned context.

SDA-002 remains open. Later bounce success never backfills the earlier touch state.

## Current decision

MORE_TOUCHES_ALWAYS_STRONGER = FALSE.
MORE_TOUCHES_ALWAYS_WEAKER = FALSE.
TOUCH_COUNT_ALONE_IDENTIFIES_MECHANISM = FALSE.
REPLENISHMENT_EQUALS_NEW_INDEPENDENT_ALPHA = FALSE.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT = 1.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement touch-lineage and mechanism-state classifier.
2. Add adversarial tests for duplicate touches, depletion, refill, adverse-selection withdrawal and nonmonotonic outcomes.
3. Hand T0-T13/Q0-Q8 to D16.
4. Continue DL-073: structural-zone width and uncertainty; reject one-price precision illusion.
