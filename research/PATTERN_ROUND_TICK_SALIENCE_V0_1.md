# D01 DL-045 — Structural Memory vs Round-Number / Tick-Grid Salience V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ROUND_TICK_SALIENCE_FIREWALL / SDA_001_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-044 separated structural boundaries from prior-close and official auction-reference effects.

DL-045 freezes the next salience confound:

> A price may behave like support/resistance because orders cluster at round numbers, because legal tick-grid / price-tier mechanics alter quoting and priority, or because a genuine historical structure exists there.

Round/tick salience and structural memory must be separately identified.

No return outcome is opened in this tranche.

## 2. Evidence context

Taiwan limit-order research documents price clustering at integer / even / preferred terminal prices and shows that order clustering varies with investor type, volatility and competition.

Broader microstructure research shows that limit-order clustering can create price barriers around round values.

This is a plausible alternative mechanism for apparent support/resistance.

However:
- round-number clustering does not prove behavioral anchoring;
- tick-grid mechanics do not prove support/resistance memory;
- a structural level near a round number can contain both mechanisms.

D01 therefore freezes context descriptors and comparator classes, not a directional score.

## 3. Owner boundary

D04/D05 microstructure ownership remains authoritative for:
- legal tick size;
- price-tier / tick-band state;
- session state;
- spread/depth interpretation;
- exchange-mechanics version.

D01 consumes a point-in-time tick receipt:
- tickSize;
- tickBandId;
- tickRuleVersion;
- tickKnownAt;
- tickBandLower;
- tickBandUpper;
- tickBandBoundary flags / nearest transition where owner-supported.

D01 does not hard-code a permanent Taiwan tick table into Pattern logic.

## 4. Three distinct salience objects

### T0 — LEGAL_TICK_GRID

The exchange-defined set of quotable prices.

Every observed trade is constrained by this grid.
Being on a legal tick is not special evidence by itself.

### T1 — TICK_BAND_TRANSITION

A price near a level where the legal minimum tick changes by price tier.

This can affect:
- relative spread;
- queue priority;
- quote density;
- execution friction.

It is a market-mechanics context, not structural memory.

### T2 — ROUND_NUMBER_REFERENCE

A preregistered nominal price grid such as whole-number / coarse-round grids.

The exact round-grid family must be frozen before outcome inspection.

No single D01-local list is declared universally optimal.

## 5. Structural object remains separate

The D01 structural boundary keeps:
- structuralRootId;
- structuralVersionId;
- anchor lineage;
- frozen boundary;
- confirmedAt / predictor freeze.

A structure that numerically overlaps T1/T2 does not lose structural identity.

But overlap requires an incremental test:
does structural history add anything beyond round/tick salience?

## 6. Round-grid registry

Every round-grid research family must store:

- roundGridFamilyId;
- roundGridVersion;
- gridDefinitions;
- registryFrozenAt;
- semantic currency / price unit;
- applicable price range;
- source / rationale.

If several grids are studied:
they are one multiple-testing family.

Prohibited:
- inspect outcomes then choose 1, 5, 10, 50 or 100-unit grid;
- discard a grid because it does not support the desired result;
- change grid spacing by stock after observing returns.

## 7. Distance descriptors

For any structural boundary and frozen round-grid / tick receipt, store continuous descriptors:

- structuralCenterPrice;
- lowerBoundaryDistanceToNearestRoundPrice;
- upperBoundaryDistanceToNearestRoundPrice;
- centerDistanceToNearestRoundPrice;
- centerDistanceToNearestRoundTicks;
- lowerDistanceToTickBandTransition;
- upperDistanceToTickBandTransition;
- centerDistanceToTickBandTransition;
- relativeTickBps;
- tickBandId.

No "near round" threshold is frozen.

## 8. Coincidence states

### S0 — STRUCTURE_NONROUND_NONTRANSITION
Structural boundary is evaluable and no registered round/tick-transition coincidence is present under the preregistered descriptor family.

### S1 — ROUND_REFERENCE_ONLY
Round-number salience exists without a certified structural root.

### S2 — TICK_BAND_TRANSITION_ONLY
Tick-band-transition salience exists without a certified structural root.

### S3 — STRUCTURE_ROUND_COINCIDENT
A certified structural root overlaps / is proximal to a registered round-number reference.

### S4 — STRUCTURE_TICK_TRANSITION_COINCIDENT
A certified structural root overlaps / is proximal to a tick-band transition.

### S5 — MULTI_SALIENCE_COINCIDENT
Structural, round-reference and/or tick-transition contexts co-exist.

### S6 — SALIENCE_CONTEXT_UNKNOWN
Required tick / grid provenance is incomplete.

These are research context states, not votes.

## 9. No threshold by outcome

Coincidence for formal research comparison must come from:
- exact registered reference equality; or
- a preregistered distance representation handled continuously by D16.

D01 does not define "within 1 ATR", "within 2 ticks" or "within 1%" as universally salient.

If bins are used later, D16 preregisters them and accounts for multiplicity.

## 10. Tick-band migration

Tick size can change when price crosses a tier.

Therefore:
- current tick size may differ from formation tick size;
- a structure can cross a tick-band boundary over its life;
- raw NTD distance is not comparable across tiers.

Store formation and current tick receipts separately when relevant.

Do not backfill today's tick band into an earlier structural snapshot.

## 11. Same-level barrier vs structural memory

A round price can generate repeated order concentration without prior structural anchor history.

That creates a negative-control opportunity:

R0 ROUND_SALIENT_NONSTRUCTURAL
- round/tick-salient price reference;
- no certified structural root at predictor freeze.

R1 STRUCTURAL_NONROUND
- certified structural root;
- low / separable round/tick salience under the frozen descriptor family.

R2 STRUCTURAL_ROUND_COINCIDENT
- both structural history and round/tick salience.

Future comparison asks:
- R2 vs R0: does structural history add beyond salience?
- R2 vs R1: does salience add beyond structural history?
- R1 vs matched non-structural levels: does structural history persist away from round/tick salience?

## 12. Price clustering is not behavioral proof

Observed round-number order clustering is compatible with:
- cognitive preference;
- negotiation / price-resolution simplification;
- queue-priority strategies;
- tick mechanics;
- institutional execution conventions.

D01 may label:
ROUND_PRICE_CLUSTERING_CONTEXT.

D01 may not label:
PSYCHOLOGICAL_ANCHOR_CONFIRMED.

D20 owns behavior-specific mechanism identification.

## 13. Microstructure availability boundary

Daily OHLC can establish price proximity to a registered round level.

It cannot establish:
- displayed queue concentration;
- hidden liquidity;
- order cancellation;
- true order-flow barrier.

Those require D05 / prospective book data.

Without book evidence:
ORDER_CLUSTERING_MECHANISM = PLAUSIBLE_NOT_OBSERVED.

## 14. Opening / prior-close interaction

DL-043 and DL-044 remain required.

A price can simultaneously be:
- round;
- near prior close;
- near auction reference;
- a structural zone;
- crossed by an opening gap.

These are co-located contexts, not independent votes.

Future D16 must decompose them rather than score each as confirmation.

## 15. SDA-001 information lineage

All price-proximity descriptors remain descendants of the same price system.

Default:
- informationRoot = PRICE_OHLC;
- representationFamily = D01_PRICE_GEOMETRY;
- redundancyGroup = D01_ROUND_TICK_REFERENCE_CONTEXT;
- rawRepresentationCount may exceed 1;
- effectiveIndependentEvidenceCount = 1;
- independentVoteAllowed = false;
- residualIncrementalityStatus = NOT_VALIDATED.

A structural level at 100 plus "round number 100" plus "prior close 100" does not create three votes.

## 16. Future D16 comparison ladder

G0 RAW_STRUCTURAL_PATTERN

G1 ROUND_REFERENCE_CONTEXT_CONTROLLED

G2 TICK_BAND_CONTEXT_CONTROLLED

G3 PRIOR_CLOSE_AUCTION_REFERENCE_CONTROLLED

G4 MICROSTRUCTURE_CONTEXT_CONTROLLED

G5 STRUCTURAL_NONROUND_REPLICATION

G6 STRUCTURAL_VS_ROUND_NEGATIVE_CONTROL

G7 ROUND_TICK_ROBUST_REPLICATION

Future interpretation:

C0 ROUND_NUMBER_EXPLANATION

C1 TICK_GRID_MECHANICS_EXPLANATION

C2 REFERENCE_PRICE_COMPOSITE_EXPLANATION

C3 MICROSTRUCTURE_CLUSTERING_EXPLANATION

C4 STRUCTURAL_RESIDUAL_AFTER_SALIENCE

C5 NONROUND_STRUCTURAL_CANDIDATE

C6 ROUND_AND_STRUCTURE_INCREMENTAL_CANDIDATE

C7 NOT_EVALUABLE

None proves alpha.

## 17. Common support

Comparisons require overlap in:
- price level;
- tick band;
- relative tick;
- liquidity;
- volatility;
- session mechanism;
- prior-close/reference context;
- market/sector regime;
- structural age / interaction history;
- opportunity geometry.

Failure:
ROUND_TICK_CONTEXT_EXTRAPOLATION_PROHIBITED.

## 18. Required manifest fields

Per parent / opportunity:
- parentDecisionId;
- symbol;
- predictorFreezeAt;
- semanticSpace;
- structuralRootId;
- structuralVersionId;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- structuralCenterPrice;
- tickSize;
- tickBandId;
- tickRuleVersion;
- tickKnownAt;
- tickBandLower;
- tickBandUpper;
- nearestTickBandTransitionPrice;
- relativeTickBps;
- roundGridFamilyId;
- roundGridVersion;
- roundGridRegistryFrozenAt;
- nearestRoundReferencePrice;
- centerDistanceToNearestRoundPrice;
- centerDistanceToNearestRoundTicks;
- lowerBoundaryDistanceToNearestRoundPrice;
- upperBoundaryDistanceToNearestRoundPrice;
- centerDistanceToTickBandTransition;
- formationTickReceipt if available;
- currentTickReceipt;
- priorCloseReferenceReceipt;
- auctionReferenceReceipt;
- sessionReceipt;
- microstructureReceipt if prospectively available;
- salienceCoincidenceState;
- informationRoot;
- redundancyGroup;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No future-return field belongs in this manifest.

## 19. Current decision

ROUND_PRICE_EQUALS_STRUCTURE =
FALSE.

TICK_BAND_BOUNDARY_EQUALS_STRUCTURE =
FALSE.

ROUND_REFERENCE_COINCIDENCE_EQUALS_CONFIRMATION =
FALSE.

ROUND_TICK_REFERENCE_CREATES_EXTRA_VOTE =
FALSE.

OUTCOME_SELECTED_ROUND_GRID =
PROHIBITED.

CURRENT_TICK_BACKFILL =
PROHIBITED.

ORDER_CLUSTERING_FROM_DAILY_OHLC =
UNIDENTIFIED.

BEHAVIORAL_ANCHORING_FROM_ROUNDNESS =
UNIDENTIFIED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic round-grid/tick-context receipt validator, distance helper and anti-double-count diagnostics.
2. Add adversarial tests for tick-band migration, outcome-selected round grids, same-price triple counting and missing tick provenance.
3. Hand G0-G7 / C0-C7 round/tick salience incrementality inference to D16.
4. Consume D04/D05 tick/microstructure owner receipts rather than hard-coding Pattern-local exchange mechanics.
5. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual/system/00 closure evidence exists.
6. Next D01 science: separate round/tick salience from volume-at-price / historical traded-volume concentration so a price level with heavy historical volume is not automatically treated as independent structural evidence.
7. No outcome join / no runtime wiring / no Formal change.
