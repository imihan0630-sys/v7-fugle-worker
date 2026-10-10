# D01 DL-140 — Issuer-Regime Boundary Common-Support / Placebo Handoff V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / REGIME_COMMON_SUPPORT_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how issuer/economic-regime boundaries enter D16 comparison without allowing event labels to masquerade as pattern Alpha.

## Required D16 metadata

For each affected D01 opportunity, hand off:
- securityIdentity;
- issuerIdentity where certified;
- regimeBoundaryReceiptId/version;
- normalizedBoundaryClass;
- structuralMemoryDisposition;
- boundaryEffectiveAt;
- boundaryFirstObservableAt;
- episode relation;
- reconfirmation state/mode;
- reconfirmedAt where applicable;
- informationRoot;
- redundancyGroup;
- class/listing/identity states already frozen by DL-122~DL-137.

## Common-support rule

Named child and common parent must share:
- same security identity;
- same regime-boundary state;
- same structural-memory disposition;
- same PIT event knowledge;
- same source/session history;
- same predictor cutoff;
- same denominator/blocking policy;
- same outcome horizon/cost treatment when outcomes later open.

A child cannot use post-boundary clean rows while the parent includes stale/unknown regime rows, or vice versa.

## Outcome-blind placebo/control families

Freeze control families before outcomes:

NO_REGIME_BOUNDARY_SAME_GEOMETRY
- similar price geometry without a certified issuer-regime boundary.

REGIME_BOUNDARY_WITHOUT_D01_STRUCTURE
- certified boundary where the named pattern is absent.

SAME_SECURITY_ADMINISTRATIVE_RENAME
- proven name/code administrative transition without economic-regime discontinuity.

MARKET_MIGRATION_BOUNDARY
- same-security market migration under DL-123, separated from issuer economic-regime change.

CORPORATE_ACTION_MECHANICAL_RESET
- price-space reset already owned by R4/corporate-action continuity, separated from issuer regime change.

These placebos prevent D01 from crediting any large transition reaction to the named pattern.

## Denominator states

REGIME_CONTEXT_CLEAR
REGIME_BOUNDARY_PRESERVED
REGIME_BOUNDARY_STALE_PENDING_RECONFIRMATION
REGIME_BOUNDARY_RECONFIRMED
REGIME_BOUNDARY_BROKEN
REGIME_BOUNDARY_UNKNOWN_BLOCKED
REGIME_RECONFIRMATION_FAILED
REGIME_RECONFIRMATION_EXPIRED

All remain denominator-accounted.

## No double vote

One boundary can create:
- event context;
- structural-memory state;
- gap/morphology representation.

These are dependency-linked context/representations.

The boundary itself does not add an independent D01 vote.

## D08/D14 ownership protection

D16/D01 do not reinterpret event/governance facts.

If owner classification changes:
DL-108~DL-112 source-vintage/revision rules apply.
Old receipts remain immutable.

## Allowed conclusions

For future D16 inference:
SUPPORTED_RESIDUAL_PATTERN_EFFECT
REFUTED_BY_COMMON_PARENT
INCONCLUSIVE
NOT_EVALUABLE

REGIME_BOUNDARY_EXISTS is not a pattern-efficacy conclusion.

## Current decision

REGIME_EVENT_LABEL_EQUALS_PATTERN_ALPHA = FALSE.
PARENT_CHILD_REGIME_SUPPORT_MUST_MATCH = TRUE.
ADMINISTRATIVE_RENAME_EQUALS_ECONOMIC_REGIME_CHANGE = FALSE.
REGIME_BOUNDARY_CREATES_EXTRA_PATTERN_VOTE = FALSE.
PLACEBO_FAMILIES_FROZEN_PREOUTCOME = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic DL-138~140 regime-boundary oracle/tests.
2. Keep event/governance classification owner-certified.
3. Re-check physical 1101/2021-06-15 R1-R6 before physical R7.
4. Do not promote maturity from governance/specification work alone.
