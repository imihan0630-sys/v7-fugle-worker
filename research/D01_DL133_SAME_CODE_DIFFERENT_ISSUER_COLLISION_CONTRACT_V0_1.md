# D01 DL-133 — Same-Code Different-Issuer Collision Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SAME_CODE_COLLISION_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent long historical windows from concatenating two different securities merely because the same exchange code/symbol appears in different membership intervals.

## Canonical collision definition

SAME_CODE_DIFFERENT_ISSUER_COLLISION occurs when:
- market + symbol are equal;
- securityIdentity differs or issuerIdentity differs;
- membership intervals are disjoint or conflicting;
- no canonical same-security equivalence receipt exists.

## Fail-closed rule

market|symbol is insufficient to stitch historical bars.

Required before continuity:
- securityIdentity equality or explicit equivalence receipt;
- issuer/security-class linkage;
- membership interval continuity;
- no successor/consideration event;
- compatible unit semantics.

Otherwise:
SAME_CODE_COLLISION_BLOCKED.

## Disjoint membership intervals

If code reuse happens after the old security is delisted:
- old lineage ends;
- new security starts a new lineage;
- same visible code does not create price continuity;
- old pattern anchors do not carry forward.

## Overlapping identity claims

If two source families assign the same market+symbol+date to different issuer/security identities:
IDENTITY_BOUNDARY_CONFLICT.

Do not choose:
- latest source;
- more familiar company name;
- current issuer;
- longest-lived issuer;
without canonical authority resolution.

## Historical-universe implication

A universe builder may use conservative alias reconciliation to repair a listing-start date only when same-company identity evidence is sufficient.

It must preserve same-code/different-company rejection.

## Pattern denominator

Collision states remain explicit:
- SAME_CODE_SAME_SECURITY;
- SAME_CODE_DIFFERENT_SECURITY;
- IDENTITY_BOUNDARY_CONFLICT;
- IDENTITY_EQUIVALENCE_UNKNOWN.

Blocked collision rows may not be silently dropped.

## Current decision

SAME_CODE_EQUALS_SAME_SECURITY = FALSE.
CODE_REUSE_STITCHS_PRICE_HISTORY = FALSE.
CURRENT_ISSUER_BACKFILLS_OLD_CODE_HISTORY = FALSE.
IDENTITY_BOUNDARY_CONFLICT_FAILS_CLOSED = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
