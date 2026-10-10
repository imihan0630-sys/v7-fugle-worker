# D01 DL-141 — Corporate-Group / Related-Issuer Dependency Firewall V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / RELATED_ISSUER_DEPENDENCY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent D01 from confusing:
- same corporate group;
- parent/subsidiary relation;
- common controller;
- affiliate/cross-holding relation;
- shared brand/event exposure

with same-security identity or independent pattern confirmation.

A related issuer is still a different security unless a separate same-security identity receipt proves otherwise.

## Relation classes

D01 consumes owner-certified relation receipts from governance/event owners.

Normalized research classes:
- PARENT_SUBSIDIARY;
- SISTER_AFFILIATE_COMMON_CONTROLLER;
- CROSS_HOLDING_RELATION;
- COMMON_CONTROL_RELATION;
- STRATEGIC_AFFILIATE;
- SHARED_BRAND_ONLY;
- SHARED_EVENT_EXPOSURE;
- RELATED_ISSUER_RELATION_UNKNOWN;
- NO_KNOWN_RELATED_ISSUER_RELATION.

These are dependency/context classes, not D01 pattern signals.

## Security identity remains primary

For two securities A and B:

If securityIdentity(A) != securityIdentity(B):
- their OHLC histories must not be stitched;
- their episodeIds remain separate;
- their opportunityIds remain separate;
- one security cannot inherit the other's support/resistance anchors.

Even if:
- issuer group is the same;
- controller is the same;
- brand is the same;
- event is shared;
- symbols are similar.

## Group relation receipt

Required fields:
- relationReceiptId;
- relationReceiptVersion;
- securityIdentityA;
- securityIdentityB;
- issuerIdentityA;
- issuerIdentityB;
- groupId if owner-certified;
- normalizedRelationClass;
- relationEffectiveFrom;
- relationEffectiveToExclusive;
- firstObservableAt;
- ownerDomain;
- sourceId/version/hash;
- replaySafe.

## PIT relation semantics

Group/control relation must be evaluated as of predictor time.

Do not use:
- a future acquisition;
- a future parent/subsidiary relation;
- a later group reorganization;
- current group membership

to explain or cluster older observations unless the relation was already valid and knowable.

CURRENT_GROUP_RELATION != HISTORICAL_GROUP_RELATION.

## Shared controller is not same issuer

COMMON_CONTROLLER
does not imply:
SAME_ISSUER.

SAME_ISSUER
does not imply:
SAME_SECURITY.

The hierarchy must remain explicit.

## D01 pattern effect

A related-issuer relation may create dependency.

It does not:
- add a D01 vote;
- convert one security's pattern into another's pattern;
- prove lead/lag;
- prove spillover;
- prove Alpha.

If cross-security lead/lag is later studied:
it is a separate preregistered experiment with its own owner/common parent and D16 correction.

## Relation uncertainty

If relation evidence is incomplete:
RELATED_ISSUER_RELATION_UNKNOWN.

Do not default unknown to:
- independent;
- related;
- same group.

## D14 / D08 boundary

D14 owns governance/control interpretation.
D08 may own event chronology.
D01 consumes a relation/event-dependency receipt for redundancy/common-support logic only.

D01 does not infer corporate group from synchronized prices.

## Current decision

SAME_GROUP_EQUALS_SAME_SECURITY = FALSE.
COMMON_CONTROLLER_EQUALS_SAME_ISSUER = FALSE.
RELATED_ISSUER_PATTERN_EQUALS_SECOND_CONFIRMATION = FALSE.
PRICE_COINCIDENCE_PROVES_GROUP_RELATION = FALSE.
UNKNOWN_RELATION_DEFAULTS_TO_INDEPENDENT = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
