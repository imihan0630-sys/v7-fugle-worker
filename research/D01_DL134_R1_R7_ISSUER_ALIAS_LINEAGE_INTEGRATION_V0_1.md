# D01 DL-134 — R1 / R7 Issuer-Alias Lineage Integration V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / ALIAS_LINEAGE_INTEGRATION_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Integrate issuer/name alias lineage into D01 R1 membership identity and R7 opportunity identity without allowing display-name metadata to become an Alpha root.

## R1 extension

R1 membership/identity receipt may expose:
- securityIdentity;
- issuerIdentity;
- securityClass;
- membershipIntervalId;
- canonicalSymbol;
- aliasTimelineVersion;
- issuerAliasSetHash;
- identityEvidenceHash;
- identityResolutionState.

Allowed identityResolutionState:
- CANONICAL_IDENTITY_PROVEN;
- SAME_SECURITY_ALIAS_CHANGE_PROVEN;
- SAME_SECURITY_CODE_CHANGE_PROVEN;
- SAME_SECURITY_MARKET_MIGRATION_PROVEN;
- DIFFERENT_SECURITY_COLLISION;
- IDENTITY_EQUIVALENCE_UNKNOWN.

## Alias set semantics

issuerAliasSet is explanation / source-reconciliation metadata.

It may include versioned:
- legal names;
- short names;
- normalized board suffix aliases;
- historical official name aliases.

It is not:
- informationRoot;
- redundancyGroup;
- feature score;
- pattern confirmation.

## R7 binding

R7 durable identity binds:
- securityIdentity;
- membershipIntervalId;
- exactSessionHash;
- sourceHistoryHash;
- detector/episode identity.

R7 may store:
- displaySymbol;
- displayName;
- aliasTimelineVersion;
for explanation.

Changing display alias alone does not change canonical geometry hash.

If identityResolutionState changes:
- issue a new R1 version;
- replay affected downstream R7;
- preserve old R7 immutable;
- record migration lineage.

## Alias-version comparison

ALIAS_METADATA_ONLY
when:
- same canonical security identity;
- only display/legal/short-name aliases change;
- membership / source history / geometry unchanged.

IDENTITY_REMAP_REQUIRED
when:
- security identity or issuer linkage changes;
- membership interval changes;
- same-code collision is resolved differently.

## Parent / child common support

Named child and common parent must bind the same:
- securityIdentity;
- membershipIntervalId;
- identityResolutionState/version.

Do not compare a child under remapped identity with a parent under old identity.

## D16 handoff

D16 receives:
- securityIdentity;
- issuerIdentity;
- membershipIntervalId;
- aliasTimelineVersion;
- identityResolutionState;
- collision/transition class.

Alias string count is not a statistical degree of freedom or signal count.

## Current decision

ALIAS_METADATA_IS_ALPHA_ROOT = FALSE.
DISPLAY_NAME_CHANGE_REQUIRES_FEATURE_HASH_CHANGE = FALSE.
IDENTITY_REMAP_REQUIRES_VERSIONED_REPLAY = TRUE.
R1_R7_IDENTITY_VERSION_MUST_MATCH = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
