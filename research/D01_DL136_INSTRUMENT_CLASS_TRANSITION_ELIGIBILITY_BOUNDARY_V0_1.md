# D01 DL-136 — Instrument-Class Transition / Eligibility-Boundary Contract V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / CLASS_TRANSITION_BOUNDARY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Define what happens to D01 structural history when a listed security remains identifiable but its research-eligible instrument/share class changes.

This contract prevents class transitions from being mistaken for uninterrupted ordinary-common-equity history.

## Eligibility-boundary states

ELIGIBLE_ORDINARY_COMMON
INELIGIBLE_PREFERRED
INELIGIBLE_FUND_OR_ETF
INELIGIBLE_NOTE_OR_ETN
INELIGIBLE_WARRANT_OR_RIGHT
INELIGIBLE_OTHER_CLASS
CLASS_UNKNOWN_BLOCKED

These are research-eligibility states, not security-identity states.

## Same security, different eligibility

A security may remain the same durable security identity while D01 first-wave eligibility changes.

Therefore:
SAME_SECURITY_IDENTITY
does not imply:
CONTINUOUS_D01_ELIGIBILITY.

At a classEligibilityBoundary:
- the prior eligible research interval ends;
- no new ordinary-common-equity opportunity may cross an ineligible interval;
- no synthetic bars fill the ineligible interval;
- no pre-boundary episode may be credited as continuously eligible after the boundary without a separately frozen re-entry rule.

## Re-entry to eligible class

If the same security later becomes ORDINARY_COMMON_EQUITY again:

- security identity may remain the same if owner-certified;
- the research eligibility interval is new;
- listing-age and same-security history may still exist;
- eligible-pattern history cannot automatically use bars from the ineligible interval as if they were part of the eligible denominator.

Default:
eligible-history clock restarts for D01 first-wave research unless a preregistered module-specific rule explicitly allows non-eligible bars as context.

No such exception is opened in this tranche.

## Security replacement / conversion

If a class transition actually creates a different security:
DL-122 / DL-124 identity-transition rules dominate.

Then:
- predecessor D01 episode ends;
- successor starts a new identity lineage;
- this is not merely a class eligibility boundary.

## Pattern implications

D01-02:
- one completed eligible ordinary-common bar is sufficient for morphology, subject to all other gates.

D01-03:
- sequence bars must all belong to the same eligible research interval unless a separately frozen rule says otherwise.

D01-07:
- base/cup/handle episode cannot span an ineligible class interval in the first-wave ordinary-common study.

D01-09:
- prior-close/current-open gap requires same-security and same eligible-interval continuity.
- cross-class boundary distance is CLASS_TRANSITION_REFERENCE_DISTANCE, not an ordinary technical gap.

## Source-history identity

The raw market may contain bars during both eligible and ineligible class intervals.

D01 does not delete the raw source history.

Instead it maintains:
- RAW_SECURITY_HISTORY;
- D01_ELIGIBLE_HISTORY_MASK.

Feature formation uses the eligible mask.

The sourceHistoryHash may bind the raw source window while a separate eligibleHistoryHash / eligibilityMaskHash binds the D01 research-admitted subset.

This prevents hidden row deletion.

## Class ambiguity

If the class transition time is not precise enough to determine whether a bar belongs to the old or new class:
CLASS_BOUNDARY_AMBIGUOUS_BLOCKED.

Do not choose the side that produces cleaner geometry.

## Current decision

SECURITY_IDENTITY_CONTINUITY_EQUALS_RESEARCH_ELIGIBILITY_CONTINUITY = FALSE.
INELIGIBLE_INTERVAL_MAY_BE_SILENTLY_SKIPPED = FALSE.
CLASS_REENTRY_INHERITS_PRIOR_ELIGIBLE_EPISODE = FALSE.
CROSS_CLASS_DISTANCE_EQUALS_ORDINARY_GAP = FALSE.
RAW_HISTORY_IS_PRESERVED_WHILE_ELIGIBILITY_MASK_IS_VERSIONED = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
