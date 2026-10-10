# D01 DL-143 — Related-Issuer D16 Common-Support / Placebo Handoff V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / RELATED_ISSUER_D16_HANDOFF_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how related-issuer/group dependency enters future D16 validation before outcomes are opened.

## Required handoff fields

For any opportunity with a known/possible related-issuer dependency:
- securityIdentity;
- issuerIdentity;
- groupId if owner-certified;
- relationReceiptId/version;
- normalizedRelationClass;
- relationKnowledgeState;
- relationEffectiveFrom;
- relationEffectiveToExclusive;
- sharedEventContextId if applicable;
- crossSecurityDependencyClusterId;
- pattern informationRoot;
- pattern redundancyGroup;
- predictorFreezeAt;
- exactSessionHash;
- sourceHistoryHash.

## Relation denominator states

RELATION_CLEAR_NO_KNOWN_DEPENDENCY
RELATION_KNOWN_DEPENDENCY
RELATION_SHARED_EVENT_DEPENDENCY
RELATION_UNKNOWN_BLOCKED
RELATION_NOT_APPLICABLE

Do not silently drop unknown group relation rows.

## Common-support rule

Named child and common parent must share:
- same security identity;
- same historical group/relation state;
- same shared-event context state;
- same predictor cutoff;
- same source/session history;
- same denominator policy;
- same horizon/cost treatment.

A named child cannot be evaluated on a cleaner dependency subset than its common parent.

## Pre-outcome placebo families

Freeze:

SAME_INDUSTRY_NON_GROUP_CONTROL
- similar industry exposure without known corporate-group relation.

SAME_GROUP_NO_SHARED_EVENT
- related issuers without a shared event in the target window.

SHARED_EVENT_NO_D01_PATTERN
- group event exists but named pattern absent.

ADMINISTRATIVE_GROUP_CHANGE
- ownership/group record change without owner-certified economic event effect.

UNRELATED_SIMULTANEOUS_PATTERN
- same-time similar pattern on securities with no known relation.

These controls distinguish:
pattern geometry,
group relation,
event shock,
and broad market/industry co-movement.

## Independence rule

DISTINCT_SECURITY_IDENTITIES do not automatically imply independent observations.

KNOWN_GROUP_RELATION does not automatically imply perfect dependence either.

D16 must estimate/handle dependence using the frozen dependency metadata.

D01 provides structure; D16 owns statistical inference.

## Unknown relation

RELATION_UNKNOWN_BLOCKED is retained for dependency-sensitive analyses.

For per-security pattern detection the R7 node may still exist if security identity and pattern data are valid.
But independence claims using that node remain blocked/unknown.

## Allowed future conclusions

PATTERN_RESIDUAL_SUPPORTED
PATTERN_RESIDUAL_REFUTED
DEPENDENCE_DOMINATED
INCONCLUSIVE
NOT_EVALUABLE

A positive cluster of related issuers is not itself a D01 efficacy result.

## Current decision

RELATED_ISSUER_METADATA_EQUALS_ALPHA = FALSE.
PARENT_CHILD_GROUP_SUPPORT_MUST_MATCH = TRUE.
UNKNOWN_RELATION_MAY_BE_ASSUMED_INDEPENDENT = FALSE.
DEPENDENCE_ESTIMATION_BELONGS_TO_D16 = TRUE.
PLACEBO_FAMILIES_FROZEN_PREOUTCOME = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic DL-141~143 relation/dependency oracle.
2. Test same-group/different-security, shared-event multi-node dedup, unknown relation and parent-child support.
3. Re-check physical 1101/2021-06-15 R1-R6 before physical R7.
4. Keep D14/D08 as relation/event owners.
5. Preserve D01 maturity at 60.0%.
