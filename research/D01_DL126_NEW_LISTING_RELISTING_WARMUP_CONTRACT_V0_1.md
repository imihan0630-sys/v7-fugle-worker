# D01 DL-126 — Newly Listed / Relisted Warmup and Insufficient-History Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / LISTING_WARMUP_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Define when a newly listed, relisted, migrated, or successor security has enough same-security history for each first-wave D01 pattern module.

Short history by design is not missing data.

## Canonical warmup states

FIRST_ELIGIBLE_SESSION
WARMUP_IN_PROGRESS
HISTORY_TOO_SHORT_BY_DESIGN
MODULE_MINIMUM_HISTORY_READY
FULL_PREREGISTERED_WINDOW_READY
DATA_MISSING_BLOCKED
IDENTITY_BLOCKED

## Listing-day rule

An initial-listing or successor reference price is not a prior same-security close.

Therefore for a genuinely new security:
- D01-09 ordinary same-security opening gap is not defined on listing day;
- D01-03 cannot borrow predecessor bars;
- D01-07 cannot inherit predecessor base anchors;
- D01-02 may describe the completed first bar after that bar becomes observable, but it has only first-session context.

## Proven same-security migration exception

For a proven same-security market migration under DL-123:
- prior-market bars may remain same-security history if session and price-space continuity pass;
- the first new-market bar is still marked marketRegimeBoundary=true;
- any gap across the boundary is MARKET_MIGRATION_BOUNDARY_GAP, not ordinary gap.

## Module minimum history

D01-02:
- one completed eligible same-security bar for one-bar morphology;
- contextual features requiring prior reference need the required prior same-security observation separately.

D01-03:
- at least N completed eligible same-security bars for the preregistered N-bar sequence;
- no predecessor/successor identity borrowing.

D01-07:
- must satisfy the preregistered base-width/lifecycle history requirement;
- a shorter listing age is HISTORY_TOO_SHORT_BY_DESIGN, not NO_STRUCTURE.

D01-09:
- ordinary gap requires a valid prior eligible close from the same security identity;
- listing-day reference price alone is insufficient.

## Denominator firewall

HISTORY_TOO_SHORT_BY_DESIGN remains in the upstream denominator.

It must not be recoded as:
- DATA_MISSING;
- NO_STRUCTURE;
- failed pattern;
- excluded without count.

## Current decision

LISTING_REFERENCE_PRICE_EQUALS_PRIOR_CLOSE = FALSE.
SHORT_HISTORY_EQUALS_MISSING_DATA = FALSE.
SUCCESSOR_MAY_BORROW_PREDECESSOR_BARS = FALSE.
SAME_SECURITY_MIGRATION_MAY_USE_PRIOR_MARKET_HISTORY_ONLY_WITH_DL123_PASS = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
