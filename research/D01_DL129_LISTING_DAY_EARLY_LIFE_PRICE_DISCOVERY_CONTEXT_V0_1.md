# D01 DL-129 — Listing-Day / Early-Life Price-Discovery Context Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / EARLY_LIFE_PRICE_DISCOVERY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent first-day and early-life listing mechanics from being interpreted as ordinary mature-history pattern evidence.

## Price-discovery classes

NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY
SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY
SUCCESSOR_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY
RELISTING_REENTRY_PRICE_DISCOVERY
MATURE_CONTINUOUS_TRADING

## Listing-day reference basis

Reference/public-offering/transfer-listing prices are market-mechanism anchors.

They are not automatically:
- prior same-security close;
- common-parent pattern input;
- evidence of trend continuation;
- support/resistance created by ordinary trading history.

## D01-02

First completed candle is observable and may be described geometrically.

But first-day morphology must carry priceDiscoveryClass and cannot be pooled with mature-session candlesticks without explicit common-support analysis.

## D01-03 / D01-07

Multi-bar sequence/base claims require enough same-security post-listing history unless DL-123 proves same-security transfer continuity.

## D01-09

New-security first day:
ordinary prior-close gap is undefined.

Same-security transfer:
boundary gap is MARKET_MIGRATION_BOUNDARY_GAP.

Successor security:
predecessor-to-successor distance is IDENTITY_TRANSITION_REFERENCE_DISTANCE.

## Early-life state

Early-life is represented by listingAgeEligibleSessions continuously.

D01 does not invent a bullish/bearish cutoff such as first 5/10/20 days.

Any later threshold used for stratification becomes a preregistered experiment/support definition.

## Current decision

FIRST_DAY_PATTERN_EQUALS_MATURE_PATTERN = FALSE.
LISTING_REFERENCE_BASIS_EQUALS_PRIOR_CLOSE = FALSE.
EARLY_LIFE_LISTING_AGE_IS_CONTINUOUS_CONTEXT = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
