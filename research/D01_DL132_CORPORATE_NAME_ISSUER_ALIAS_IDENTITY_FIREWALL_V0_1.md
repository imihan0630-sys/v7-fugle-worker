# D01 DL-132 — Corporate-Name / Issuer-Alias Identity Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / ISSUER_ALIAS_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent D01 from using company-name similarity as durable security identity while still allowing legitimate legal-name / short-name / board-suffix changes to map to one issuer when authoritative identity evidence supports it.

## Name fields are descriptive aliases

Examples:
- legal company name;
- company short name;
- normalized display name;
- board suffix such as -創;
- historical brand/name changes.

These are not sufficient identity keys by themselves.

## Allowed alias normalization role

Conservative normalization may support source reconciliation:
- Unicode normalization;
- whitespace normalization;
- punctuation/dash normalization;
- known board suffix normalization;
- exact legal-name/short-name alias intersection.

But normalization may not create security identity from:
- fuzzy similarity;
- edit-distance closeness;
- common brand stem;
- translated-name similarity;
- partial token overlap alone.

## Identity proof hierarchy

1. canonical security identity / immutable security-master linkage;
2. issuer identity + security-class linkage;
3. exact official symbol + membership interval + authoritative alias linkage;
4. name alias intersection as supporting evidence only.

If higher-order identity is unavailable:
IDENTITY_EQUIVALENCE_UNKNOWN.

## Name change same security

A company-name change may preserve security identity if:
- security identity is unchanged;
- issuer identity is unchanged;
- membership interval is continuous;
- no merger/share conversion/successor event occurs;
- share class/unit semantics remain compatible.

State:
SAME_SECURITY_NAME_ALIAS_CHANGE.

Pattern lineage may continue subject to all other gates.

## Same name different security

Two securities with the same or similar issuer/name text are distinct when:
- security identity differs;
- security class differs;
- membership interval / issuer linkage differs;
- one is a successor or separately issued instrument.

State:
NAME_COLLISION_DISTINCT_SECURITY.

## Alias timeline

Every alias observation should bind:
- securityIdentity;
- aliasType;
- aliasValue;
- effectiveFrom;
- effectiveToExclusive if known;
- sourceId;
- sourceHash;
- observedAt;
- firstKnownAt where relevant.

Alias history is append-only.

## D01 impact

Name-only changes do not create:
- new pattern roots;
- new opportunities;
- new Alpha votes.

Identity reclassification caused by stronger evidence may require a new R1 version and downstream replay, but old receipts remain immutable.

## Current decision

COMPANY_NAME_EQUALS_SECURITY_IDENTITY = FALSE.
FUZZY_NAME_MATCH_MAY_STITCH_HISTORY = FALSE.
PROVEN_NAME_CHANGE_SAME_SECURITY_MAY_PRESERVE_LINEAGE = TRUE.
ALIAS_CHANGE_CREATES_EXTRA_PATTERN_VOTE = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
