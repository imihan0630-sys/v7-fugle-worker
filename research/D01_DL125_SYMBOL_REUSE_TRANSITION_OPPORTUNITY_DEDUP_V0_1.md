# D01 DL-125 — Symbol Reuse / Transition Opportunity Dedup Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SYMBOL_REUSE_DEDUP_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze opportunity identity when symbols/codes are reused, renamed, migrated, or linked by corporate actions.

The same visible ticker must not stitch unrelated securities.
The same economic episode must not be counted twice simply because it crosses market labels.

## Durable opportunity key

A D01 opportunity key must bind:
- securityIdentity;
- membershipIntervalId;
- detectorFamilyId;
- episode/root identity;
- predictorFreezeAt;
- exactSessionHash;
- sourceHistoryHash.

market and symbol are versioned attributes, not the durable primary identity.

## Symbol reuse

If the same market+symbol is later assigned to a different security:
- new securityIdentity => new lineage;
- no prior pattern bars are inherited;
- no old episode ID is reused;
- long-horizon research must not concatenate the two histories.

State:
SYMBOL_REUSED_DIFFERENT_SECURITY.

## Proven administrative code change

If symbol changes but immutable security equivalence is proven:
- securityIdentity remains the same;
- episode may remain continuous subject to price/session gates;
- symbolAliasHistory records old/new code;
- opportunity is not duplicated.

State:
SAME_SECURITY_CODE_CHANGE_CONTINUATION.

## Proven market migration

If market changes but security identity is the same:
- preserve one structural episode where allowed by DL-123;
- retain old/new market membership intervals;
- one transition episode = one opportunity root.

State:
SAME_SECURITY_MARKET_MIGRATION_CONTINUATION.

## Identity transition

If successor security is different:
- predecessor opportunity ends;
- successor opportunity begins separately;
- both are linked in one event dependency cluster;
- they are not aliases and are not merged.

State:
SUCCESSOR_SECURITY_NEW_OPPORTUNITY.

## Transition dedup rules

Duplicate:
same securityIdentity + same episode/root + same predictor state represented under old/new market labels.

Not duplicate:
different successor security identities, even when created by one event.

Dependency-linked but not duplicate:
multiple successor securities from one corporate action.

## Denominator policy

Report separately:
- sameSecurityContinuationN;
- codeChangeContinuationN;
- marketMigrationContinuationN;
- successorNewOpportunityN;
- multiSuccessorDependencyN;
- symbolReuseDifferentSecurityN;
- identityUnknownBlockedN.

Do not silently drop identity transitions.

## Current decision

MARKET_SYMBOL_IS_DURABLE_OPPORTUNITY_KEY = FALSE.
PROVEN_SAME_SECURITY_TRANSITION_DUPLICATE_VOTES = PROHIBITED.
DIFFERENT_SUCCESSOR_SECURITIES_ARE_ALIASES = FALSE.
SYMBOL_REUSE_HISTORY_STITCHING = PROHIBITED.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
