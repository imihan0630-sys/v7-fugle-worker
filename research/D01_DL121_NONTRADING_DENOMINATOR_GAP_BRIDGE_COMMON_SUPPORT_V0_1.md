# D01 DL-121 — Nontrading Denominator / Gap-Bridge Common-Support Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / NONTRADING_GAP_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how D01 treats intervals between two traded observations when intervening dates include holidays, suspension, confirmed no-trade sessions, or unresolved data.

The same endpoint price difference can have different causal meaning depending on the intervening session states.

## Gap endpoint rule

A raw opening gap is rooted in:
- prior eligible traded observation;
- current eligible traded observation;
- exact exchange-local session attribution;
- legal reference/price-limit context when required.

The number of intervening calendar days does not create additional gap events.

## Intervening state classes

MARKET_CLOSED_ONLY
- all intervening non-observation dates are official exchange closures.
- prior-to-current raw gap remains one gap root.
- no pseudo bars.

SYMBOL_NOT_EXPECTED_TO_TRADE_INTERVAL
- exchange had sessions but symbol was officially not expected to trade.
- invoke suspension/resumption stale-anchor logic.
- first reopening print is not automatically structural confirmation.

EXPECTED_TO_TRADE_NO_TRADE_CONFIRMED
- symbol was expected to trade but authoritative source confirms no trade.
- do not fabricate zero-volume OHLC.
- stale-anchor / liquidity interpretation remains owner-dependent.

DATA_MISSING_INTERVAL
- authoritative trading occurred or should have been observable but raw data are absent.
- gap/path evaluation blocked until repaired.

ATTRIBUTION_UNCERTAIN_INTERVAL
- timezone/calendar/lifecycle cause unresolved.
- gap/path evaluation blocked.

MIXED_INTERVAL
- multiple certified causes occur.
- preserve each attribution root; do not compress into a single generic gap label.

## Holiday rule

Weekend/holiday distance is calendar spacing, not information-root multiplicity.

Friday close -> Monday open:
- one prior/current endpoint pair;
- not three separate gaps;
- not a stronger signal because two non-session dates intervened.

## Suspension rule

Pre-suspension last trade may be stale after a multi-session no-trade interval.

Reopening gap must remain conditioned on:
- suspension duration;
- reopening/reference mechanics;
- corporate-action overlap;
- market/industry catch-up;
- price-limit constraint.

DL-066 remains authoritative for stale-anchor/reopening semantics.

## Confirmed zero/no-trade rule

A confirmed no-trade eligible session:
- is retained in denominator/session-state accounting;
- is not forward-filled;
- does not create a fake support/resistance touch;
- does not create a zero-return bar.

## Common support

For comparing two gap/pattern observations, preserve:
- same attribution class or explicitly stratify;
- same semantic price space;
- same legal reference-state treatment;
- same lifecycle/suspension policy;
- same calendar/timezone binding policy.

Do not pool calendar closure, suspension, vendor-date error, and data loss as if they were the same missing-bar mechanism.

## Current decision

CALENDAR_DAY_DISTANCE_EQUALS_GAP_STRENGTH = FALSE.
NONTRADING_DAYS_CREATE_EXTRA_GAP_VOTES = FALSE.
SUSPENSION_INTERVAL_EQUALS_HOLIDAY_INTERVAL = FALSE.
CONFIRMED_NO_TRADE_EQUALS_ZERO_VOLUME_BAR = FALSE.
UNRESOLVED_ATTRIBUTION_IS_BLOCKED_NOT_NORMAL = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
