# D01 DL-142 — Group-Event Cross-Security Confirmation Dedup Contract V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / GROUP_EVENT_DEDUP_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent one corporate-group event from appearing as several independent D01 confirmations simply because multiple related securities produce similar price patterns.

## Example failure mode

One group-level announcement occurs.

Parent, subsidiary and affiliate all gap up and break local resistance.

Naive scoring:
3 bullish pattern confirmations.

Correct D01 research representation:
- 3 security-specific pattern observations;
- 1 shared event/dependency context;
- independence NOT established.

## Cross-security dependency edges

D01 preserves explicit edges:

SHARED_GROUP_EVENT
PARENT_SUBSIDIARY_DEPENDENCY
COMMON_CONTROLLER_DEPENDENCY
CROSS_HOLDING_DEPENDENCY
SHARED_FINANCING_OR_TRANSACTION_EVENT
SHARED_MECHANICAL_CORPORATE_ACTION_CONTEXT
RELATED_ISSUER_RELATION_UNKNOWN

## Pattern nodes remain security-specific

Each security keeps:
- own securityIdentity;
- own sourceHistoryHash;
- own exactSessionHash;
- own episodeId;
- own R7 payload.

No cross-security feature hash merge.

Dedup applies to evidence/vote interpretation, not to raw node deletion.

## Shared event root

When multiple related securities are reacting to the same owner-certified event:
- each pattern node links to sharedEventContextId;
- event context contributes no independent D01 vote;
- effective independent evidence count is not inferred from node count.

## Cross-security simultaneous confirmation

Two related securities showing the same pattern at the same time may be:
- correlated reaction;
- shared-event reaction;
- common-controller/group flow;
- genuine independent confirmation.

D01 does not choose among these from price alone.

Default research status:
DEPENDENCY_LINKED_INDEPENDENCE_UNPROVEN.

## Lead/lag

If one related security moves first and another follows:
do not reinterpret the follower as confirmation of the first unless a separate cross-security lead/lag experiment was preregistered.

The lead security's future move relative to the follower's predictor freeze can itself create lookahead if mishandled.

## Opportunity counting

Three related-security pattern nodes remain three security opportunities for per-security descriptive accounting.

But:
they are not automatically three independent statistical observations.

D16 receives the dependency cluster for:
- cluster-aware inference;
- common-support analysis;
- multiplicity treatment.

## No group score injection

D01 does not create:
GROUP_CONFIRMATION_BONUS
or
RELATED_ISSUER_CONFLUENCE_SCORE.

Any such concept would be a new formal/ranking hypothesis and is outside this research-only tranche.

## Current decision

RELATED_SECURITY_NODE_COUNT_EQUALS_INDEPENDENT_EVIDENCE_COUNT = FALSE.
SHARED_EVENT_CREATES_EXTRA_D01_VOTE = FALSE.
CROSS_SECURITY_LEAD_LAG_IS_IMPLICIT_CONFIRMATION = FALSE.
DEPENDENCY_EDGES_PRESERVE_NODES_WITHOUT_MULTIPLYING_VOTES = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
