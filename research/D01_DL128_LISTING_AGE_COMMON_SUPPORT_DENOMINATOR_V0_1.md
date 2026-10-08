# D01 DL-128 — Listing-Age Common-Support and Denominator Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / LISTING_AGE_COMMON_SUPPORT_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent pattern evidence from comparing mature-history securities against newly listed/short-history securities on incompatible support.

Listing age is a design/context variable, not Alpha by itself.

## Required fields

Every first-wave opportunity carries:
- securityIdentity;
- listingStart;
- listingAgeEligibleSessions;
- warmupState;
- identityTransitionClass;
- sameSecurityHistoryAvailable;
- moduleMinimumHistoryRequired;
- moduleHistoryReady.

## Common-support rule

Named child and common parent must share:
- same listing-age eligibility;
- same warmup state;
- same security identity;
- same module-history readiness;
- same blocked-row policy.

A mature-history parent cannot be compared to a child after silently dropping short-history names.

## Denominator states

HISTORY_TOO_SHORT_BY_DESIGN
MODULE_HISTORY_READY_NO_STRUCTURE
MODULE_HISTORY_READY_STRUCTURE_EMITTED
DATA_MISSING_BLOCKED
IDENTITY_BLOCKED

All remain counted.

## Listing-age stratification

D16 should receive listing-age metadata for:
- descriptive stratification;
- common-support matching;
- sensitivity checks.

D01 does not preregister a bullish/bearish score for young listings.

## IPO / transfer-listing distinction

NEW_SECURITY_INITIAL_LISTING:
no predecessor price-pattern inheritance.

SAME_SECURITY_TRANSFER_LISTING:
history may continue only under DL-123.

SUCCESSOR_SECURITY_INITIAL_LISTING:
new identity under DL-124.

UNKNOWN:
blocked.

## Current decision

LISTING_AGE_IS_ALPHA = FALSE.
SHORT_HISTORY_ROWS_MAY_BE_SILENTLY_DROPPED = FALSE.
PARENT_CHILD_LISTING_AGE_SUPPORT_MUST_MATCH = TRUE.
NEW_SECURITY_LISTING_AND_SAME_SECURITY_TRANSFER_ARE_DISTINCT = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
