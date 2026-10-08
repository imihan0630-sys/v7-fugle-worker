# D01 DL-131 — Listing-Cohort Survivorship / Future-Survival Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / LISTING_COHORT_SURVIVORSHIP_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent early-life/new-listing pattern research from using only securities that survive to the present or from allowing future delisting/migration status to alter historical eligibility.

## Predictor-time fields

Allowed:
- listingStart known by predictor date;
- listingAgeEligibleSessions;
- security identity;
- then-current market membership;
- then-known lifecycle/action state.

Forbidden predictor fields:
- future delisting date not yet known;
- future migration outcome;
- future successor identity;
- future survival duration;
- present-day listing status used as historical eligibility.

## Cohort identity

Every new-listing opportunity carries:
- listingCohortYear;
- listingStart;
- securityIdentity;
- listingAgeEligibleSessions;
- historicalUniverseVersion;
- futureDelistingHidden=true.

## Survivorship denominator

Historical listing cohorts retain:
- later delisted securities;
- later migrated securities;
- later converted/successor transitions;
- short-lived listings;
subject to exact PIT universe reconstruction.

Current survivors alone cannot define the cohort.

## D16 handoff

D16 receives:
- listing cohort;
- listing age;
- transition class;
- eventual terminal state only as outcome-side/later descriptive metadata after allowed unlock.

Future terminal state must never enter predictor construction.

## Current decision

CURRENT_SURVIVORS_DEFINE_HISTORICAL_LISTING_COHORT = FALSE.
FUTURE_DELISTING_STATUS_IN_PREDICTOR = PROHIBITED.
LATER_MIGRATION_OR_SUCCESSOR_STATE_BACKFILLS_EARLY_PATTERN = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
