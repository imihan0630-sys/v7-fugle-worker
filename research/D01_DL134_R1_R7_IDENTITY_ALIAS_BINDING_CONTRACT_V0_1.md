# D01 DL-134 — R1 / R7 Identity-Alias Binding Contract V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / R1_R7_ALIAS_BINDING_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Integrate security identity, issuer identity, market-symbol version, historical display name and alias lineage into the D01 R1-to-R7 chain without letting cosmetic name changes churn the actual pattern feature identity.

Identity-critical fields and display metadata must be bound separately.

## R1 identity-critical receipt

R1 must provide:

- r1IdentityReceiptId;
- r1IdentityReceiptVersion;
- securityIdentity;
- issuerIdentity if owner-certified;
- membershipIntervalId;
- marketSymbolVersionId;
- market;
- symbol;
- membershipStart;
- membershipEndExclusive;
- membershipStateAtDate;
- securityClass;
- shareClass;
- identityRelation;
- identityCoverageState;
- sourceHash;
- firstObservableAt;
- replaySafe.

R1 PASS requires:
- one unambiguous security identity for the opportunity date;
- valid point-in-time membership;
- no overlapping same-code/different-security conflict;
- no unresolved identity transition relevant to the window.

## Alias/display receipt

A separate alias/name receipt may provide:

- aliasReceiptId;
- aliasReceiptVersion;
- securityIdentity;
- issuerIdentity;
- historicalDisplayNameAtDate;
- currentDisplayName;
- normalizedDisplayName;
- aliasRelation;
- aliasEffectiveFrom;
- aliasEffectiveToExclusive;
- aliasFirstObservableAt;
- aliasSourceHash;
- aliasCoverageState.

Historical and current names are distinct fields.

## Blocking versus non-blocking alias states

IDENTITY_CRITICAL_ALIAS_BLOCKED
- alias/name information is required to resolve whether the row belongs to the same security/issuer, and that relation remains unknown.

ALIAS_METADATA_UNKNOWN_NONBLOCKING
- canonical security identity and membership are already proven;
- historical display name is unavailable/uncertain;
- no continuity decision depends on the missing name.

This state may still allow R7 because display name is explainability metadata, not price-pattern evidence.

The missing name must remain visible; it cannot be replaced silently by the current name.

## R7 identity binding

Every R7 receipt must bind:

- r1IdentityReceiptId;
- r1IdentityReceiptHash;
- securityIdentity;
- membershipIntervalId;
- marketSymbolVersionId;
- market;
- symbol;
- targetDate;
- exactSessionHash;
- sourceHistoryHash;
- detectorFamilyId;
- detectorVersion;
- episode/root identity;
- predictorFreezeAt;
- firstObservableAt.

Optional/display-only fields:
- issuerIdentity;
- historicalDisplayNameAtDate;
- currentDisplayName;
- aliasReceiptId;
- aliasReceiptHash.

## Feature-hash boundary

The deterministic pattern feature hash must bind:
- securityIdentity;
- membershipIntervalId;
- exact session/source-history identity;
- detector/version;
- source bars;
- clocks;
- geometry/lifecycle payload;
- informationRoot/redundancyGroup.

The feature hash must NOT depend on:
- currentDisplayName;
- punctuation;
- legal suffix;
- a purely cosmetic historical display-name correction;
- lookup-only alias strings.

Why:
metadata-only rename correction should not rewrite price geometry.

However the outer R7 receipt can and should bind alias/name receipt identity for audit/explainability.

## Identity change rule

If a revision changes:
- securityIdentity;
- membershipIntervalId;
- marketSymbolVersionId in a way that changes the actual security lineage;
- identityRelation from same-security to successor/different-security;

the old R7 is not the replay result for the corrected identity vintage.

Required:
- preserve old R7;
- append identity migration;
- replay under corrected R1;
- no in-place mutation.

## Pure rename rule

If:
- securityIdentity unchanged;
- membership interval unchanged;
- source bars unchanged;
- price-space continuity unchanged;
- only historical/current display name metadata changes;

then:
- feature hash remains unchanged;
- opportunityId remains unchanged;
- episodeId remains unchanged;
- alias receipt version changes;
- explanatory label may update in the current-view metadata layer.

## Opportunity key

D01 durable opportunity identity remains:

securityIdentity
+
membershipIntervalId
+
detectorFamilyId
+
episode/root identity
+
predictorFreezeAt
+
exactSessionHash
+
sourceHistoryHash

Display name and issuer name are not part of the durable opportunity key.

## Parent / child support

Named child and common parent must bind the same:
- securityIdentity;
- membershipIntervalId;
- exact session/source history;
- predictor freeze;
- detector search family;
- denominator policy.

A display-name difference alone does not break pairing.

A security-identity difference always breaks pairing.

## D16 handoff

D16 receives:
- securityIdentity;
- issuerIdentity where certified;
- membershipIntervalId;
- alias/name lineage state;
- code-reuse / identity-transition class.

D16 may use alias lineage for:
- audit;
- grouping;
- common-support diagnostics.

D16 may not treat:
- a rename;
- a current name;
- alias count;
- string similarity

as pattern Alpha unless separately preregistered by the proper owner.

## Current decision

R7_DURABLE_IDENTITY_BINDS_SECURITY_NOT_NAME = TRUE.
PURE_RENAME_CHANGES_FEATURE_HASH = FALSE.
IDENTITY_CHANGE_REQUIRES_VERSIONED_REPLAY = TRUE.
CURRENT_NAME_BACKFILL_INTO_HISTORICAL_PREDICTOR = PROHIBITED.
ALIAS_METADATA_MAY_BE_NONBLOCKING_WHEN_SECURITY_IDENTITY_IS_ALREADY_PROVEN = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic identity/alias/collision oracle.
2. Test pure rename, same issuer different security, non-overlap symbol reuse, overlap conflict, historical-name unknown but identity-known, and current-name backfill.
3. Preserve D01 maturity at 60.0%.
4. Re-check physical 1101/2021-06-15 R1-R6 before any physical R7 emission.
