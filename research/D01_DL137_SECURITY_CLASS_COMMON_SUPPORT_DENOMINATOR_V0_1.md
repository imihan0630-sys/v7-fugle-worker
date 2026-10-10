# D01 DL-137 — Security-Class Common-Support / Denominator Contract V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / SECURITY_CLASS_DENOMINATOR_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how point-in-time security-class eligibility enters the first-wave denominator and D16 handoff.

A security that is historically ineligible by design must not disappear silently from accounting.
A security whose class is unknown must not be recoded as eligible ordinary common equity.

## Denominator states

CLASS_ELIGIBLE_HISTORY_READY
CLASS_ELIGIBLE_HISTORY_TOO_SHORT
CLASS_INELIGIBLE_BY_DESIGN
CLASS_UNKNOWN_BLOCKED
CLASS_TRANSITION_BOUNDARY_BLOCKED
IDENTITY_BLOCKED
DATA_MISSING_BLOCKED

When an eligible detector is evaluated, downstream states refine only:
- CLASS_ELIGIBLE_HISTORY_READY
into:
  - MODULE_HISTORY_READY_NO_STRUCTURE;
  - MODULE_HISTORY_READY_STRUCTURE_EMITTED;
  - R7_DATA_BLOCKED.

## Common-support requirement

Named child and common parent must use the same:
- securityIdentity;
- membershipIntervalId;
- security-class receipt/version;
- class eligibility interval;
- eligibilityMaskHash;
- listing-age/warmup state;
- exact session/source history;
- predictor cutoff;
- blocked-row policy.

A child cannot silently drop:
- historically preferred/ineligible rows;
- class-unknown rows;
- class-transition boundary rows

while the parent retains them, or vice versa.

## Current-status survivorship firewall

Historical denominator must not be built by:
- today's ordinary-common list;
- today's currently listed securities;
- today's current security type;
- today's current company name.

Later delisted, migrated, renamed, converted or class-changed securities remain represented according to their point-in-time state.

## Class-transition strata

For diagnostics, report:
- STABLE_ORDINARY_COMMON_INTERVAL;
- ENTRY_INTO_ORDINARY_COMMON;
- EXIT_FROM_ORDINARY_COMMON;
- REENTRY_INTO_ORDINARY_COMMON;
- CLASS_UNKNOWN;
- IDENTITY_TRANSITION.

These are context strata.

They are not directional Alpha labels.

## D16 handoff fields

D16 receives:
- securityIdentity;
- classReceiptId/version;
- normalizedSecurityClass;
- classEligibilityState;
- classEligibilityIntervalId;
- eligibilityMaskHash;
- classTransitionState;
- listingAgeEligibleSessions;
- warmupState;
- denominatorState.

D16 may:
- stratify;
- enforce common support;
- test robustness;
- preserve denominator accounting.

D16 may not:
- treat class eligibility itself as a predictive signal unless separately preregistered;
- reconstruct historical class from current metadata.

## Parent-child support under class revisions

If historical class evidence is revised:
- parent and child must both replay on the same revised eligibility mask;
- old and new denominators remain versioned;
- final holdout status does not reset merely because class metadata was corrected.

DL-108~DL-112 source-vintage rules apply.

## Full-Taiwan relation

The same contract applies when TPEx becomes ready.

A full-Taiwan result may not mix:
- TWSE point-in-time ordinary-common eligibility;
- TPEx present-day symbol classification.

Each market must provide point-in-time class evidence under equivalent research semantics.

## Current decision

CLASS_INELIGIBLE_ROWS_MAY_DISAPPEAR_FROM_ACCOUNTING = FALSE.
CLASS_UNKNOWN_DEFAULTS_TO_ELIGIBLE = FALSE.
PARENT_CHILD_CLASS_SUPPORT_MUST_MATCH = TRUE.
CURRENT_CLASS_SURVIVORSHIP_FILTER = PROHIBITED.
SECURITY_CLASS_CONTEXT_EQUALS_ALPHA = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic DL-135~137 class-eligibility oracle.
2. Test current-class backfill, unknown class, same-security class transition, re-entry, eligibility masking and parent-child support.
3. Keep raw source history separate from D01 eligibility mask.
4. Re-check physical 1101/2021-06-15 R1-R6 before physical R7.
