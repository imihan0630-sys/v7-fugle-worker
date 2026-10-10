# D01 DL-138 — Same-Security Issuer/Economic-Regime Boundary Firewall V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / ISSUER_REGIME_BOUNDARY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Handle major issuer/economic-regime discontinuities that may occur while the listed security identity technically survives.

D01 must not infer corporate-event meaning from price alone.
D01 consumes an owner-certified regime-boundary receipt from the appropriate event/governance/corporate-action owners.

## Key distinction

SECURITY_IDENTITY_CONTINUITY
answers:
is this still the same listed security?

ISSUER_ECONOMIC_REGIME_CONTINUITY
answers:
is the pre-event issuer/business/control regime still comparable for long-memory structural interpretation?

These are not the same question.

## Candidate regime-boundary classes

The owner taxonomy may be richer.
D01 consumes only normalized research classes:

NO_MATERIAL_ISSUER_REGIME_BOUNDARY
CONTROL_OR_GOVERNANCE_REGIME_CHANGE
MAJOR_BUSINESS_REORGANIZATION
MAJOR_ASSET_OR_OPERATING_SCOPE_DISCONTINUITY
REVERSE_MERGER_OR_BACKDOOR_TRANSFORMATION
SHELL_TO_OPERATING_TRANSFORMATION
MAJOR_RECAPITALIZATION_WITH_ECONOMIC_REGIME_CHANGE
ISSUER_REGIME_BOUNDARY_UNKNOWN

D01 does not self-label an event into these classes from chart behavior.

## D01 source ownership boundary

D08/event research may own event chronology/news.
D14/governance research may own control/board/insider/governance interpretation.
Corporate-action lanes may own formal transaction mechanics.

D01 receives a versioned boundary receipt and applies it only to pattern continuity/eligibility.

## Raw geometry versus structural memory

A certified issuer-regime boundary does not erase historical raw OHLC.

RAW_PRICE_GEOMETRY remains observable history.

But long-memory structural interpretation may change because:
- market participants may reprice the issuer under a new economic identity/regime;
- old support/resistance memory may be stale;
- pre-event base anchors may no longer represent the same information regime.

Therefore D01 separates:
RAW_GEOMETRY_CONTINUES
from:
STRUCTURAL_MEMORY_CONTINUITY.

## Structural-memory dispositions

PRESERVE_STRUCTURAL_MEMORY
- owner evidence does not identify a material regime discontinuity.

STALE_RECONFIRM_REQUIRED
- same security continues, but pre-boundary structural anchors require post-boundary causal reconfirmation.

BREAK_STRUCTURAL_MEMORY
- owner-certified discontinuity is strong enough that D01 long-memory episode continuity must end for research purposes.

REGIME_MEMORY_UNKNOWN_BLOCKED
- owner receipt is incomplete/ambiguous.

D01 does not invent which event class maps to PRESERVE/STALE/BREAK.
The owner receipt must carry the disposition or an approved mapping version.

## Module implications

D01-02:
single-bar morphology remains describable from the completed bar.
Boundary context remains visible but does not rewrite one-bar geometry.

D01-03:
a short sequence crossing the boundary is tagged REGIME_BOUNDARY_CROSSING.
It cannot be pooled as an ordinary same-regime sequence unless the frozen design explicitly permits it.

D01-07:
long base/cup/handle structures are most exposed.
For STALE_RECONFIRM_REQUIRED:
- preserve old raw anchors;
- mark episode context stale;
- do not count old pre-boundary confirmation as post-boundary confirmation;
- post-boundary reconfirmation gets a new observable clock.

For BREAK_STRUCTURAL_MEMORY:
- the old research episode ends at the boundary;
- a post-boundary base must start a new episode namespace.

D01-09:
a price discontinuity across a known issuer-regime boundary is classified:
ISSUER_REGIME_EVENT_GAP
rather than ordinary technical gap unless an ordinary-gap residual is separately tested.

## PIT clock rule

The regime-boundary receipt must provide:
- eventEffectiveAt;
- firstObservableAt/firstKnownAt;
- source chronology.

If the event meaning was known only after the predictor cutoff:
do not backdate the regime label into the historical predictor.

Current best-known classification and historical PIT classification may differ.

DL-108~DL-112 source-vintage rules apply.

## Event reaction is not event classification

Large price reaction does not prove a material economic-regime boundary.
Small price reaction does not prove continuity.

PRICE_REACTION_SIZE != REGIME_BOUNDARY_CLASS.

## Current decision

SAME_SECURITY_EQUALS_SAME_ECONOMIC_REGIME = FALSE.
RAW_GEOMETRY_CONTINUES_ACROSS_REGIME_BOUNDARY = TRUE.
LONG_MEMORY_STRUCTURAL_CONTEXT_MAY_REQUIRE_RECONFIRMATION_OR_BREAK = TRUE.
D01_MAY_INFER_REGIME_BOUNDARY_FROM_PRICE = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
