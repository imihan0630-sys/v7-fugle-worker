# D01 DL-135 — Same-Issuer Different-Security-Class Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SECURITY_CLASS_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent D01 from stitching histories across different security classes merely because the issuer is the same.

## Security class is part of durable identity

Examples that must remain distinct unless canonical equivalence explicitly proves otherwise:
- ordinary common shares;
- preferred shares;
- TDR/depository receipts;
- warrants;
- convertible/exchangeable bonds;
- subscription rights;
- certificates evidencing payment/new shares;
- emerging/other non-ordinary instruments.

## D01 first-wave scope

D01 first-wave empirical pattern research is scoped to domestic ordinary common equity unless a later module explicitly preregisters another class.

A non-ordinary instrument may not silently enter the ordinary-equity price history.

## Same issuer, different security

If:
issuerIdentity same
but:
securityIdentity or securityClass differs,

then:
DIFFERENT_SECURITY_CLASS.

No price-pattern continuity is inferred.

## Security-class conversion

Conversion/redemption/exercise may economically link two instruments.

That does not create one same-security OHLC path.

Examples:
- convertible bond converts into common stock;
- warrant exercise creates/acquires shares;
- preferred converts to common;
- payment certificate becomes listed common share.

D01 requires a canonical security-identity/equivalence receipt before any history continuity claim.

Absent proof:
CLASS_TRANSITION_NOT_COMPARABLE.

## Trading-mechanism difference

Different classes can have different:
- price units;
- reference-price rules;
- expiry;
- leverage;
- corporate-action sensitivity;
- liquidity;
- market-making mechanics.

Therefore issuer-level similarity cannot serve as a common parent for security-level price patterns.

## Current decision

SAME_ISSUER_EQUALS_SAME_SECURITY = FALSE.
DIFFERENT_SECURITY_CLASS_HISTORY_STITCH = PROHIBITED.
NON_ORDINARY_INSTRUMENT_ENTERS_D01_FIRST_WAVE_BY_DEFAULT = FALSE.
CLASS_CONVERSION_AUTOMATICALLY_PRESERVES_PATTERN = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
