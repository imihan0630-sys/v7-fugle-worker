# D01 DL-137 — Security-Class Transition / Conversion Admission Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / CLASS_TRANSITION_ADMISSION_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Define what D01 may do when one security class converts/exercises/redeems into another instrument.

## Transition classes

SAME_SECURITY_CLASS_ADMINISTRATIVE_CHANGE
DIFFERENT_CLASS_SUCCESSOR_SECURITY
CONVERSION_INTO_EXISTING_COMMON_SHARE
CONVERSION_INTO_NEW_COMMON_SHARE
MULTI_CONSIDERATION_TRANSITION
CLASS_TRANSITION_IDENTITY_UNKNOWN

## Continuity rule

Only SAME_SECURITY_CLASS_ADMINISTRATIVE_CHANGE may preserve pattern history, and only with canonical identity/price-space proof.

All other class transitions:
- terminate old D01 episode;
- begin/continue a separate target-security lineage;
- do not concatenate OHLC.

## Existing target security

If a convertible bond converts into an already trading common share:
the common share already has its own history.

Do not insert the bond price path into the common-share history.

The conversion is issuer/security-event context only.

## New target security

If conversion creates a newly listed common security:
DL-126 listing warmup applies.
No predecessor non-equity bars are borrowed.

## Mixed consideration

If conversion/redemption produces:
- shares + cash;
- multiple securities;
- fractional amounts;

D01 does not build economic payoff continuity.

That belongs outside the price-pattern object.

## Current decision

CONVERTIBLE_BOND_HISTORY_MAY_FLOW_INTO_COMMON_SHARE_PATTERN = FALSE.
WARRANT_HISTORY_MAY_FLOW_INTO_COMMON_SHARE_PATTERN = FALSE.
EXISTING_TARGET_SECURITY_HISTORY_IS_PRESERVED_SEPARATELY = TRUE.
NEW_TARGET_SECURITY_USES_LISTING_WARMUP = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
