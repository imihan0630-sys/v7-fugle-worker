# D01 DL-132 — Corporate-Name / Issuer-Alias Lineage Firewall V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / ISSUER_ALIAS_LINEAGE_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent D01 from confusing a corporate name, short name, historical display name, ticker label, issuer identity and security identity.

The durable price-pattern object is the security identity.

A company rename can change the visible name without creating a new security.
Conversely, identical or similar names do not prove the same issuer or the same security.

## Identity layers

Keep these objects separate:

SECURITY_IDENTITY
- the listed security whose bars and structural episodes D01 studies.

ISSUER_IDENTITY
- the legal/economic issuer associated with the security.

MARKET_SYMBOL_VERSION
- the market + symbol/code valid for a bounded membership interval.

HISTORICAL_DISPLAY_NAME
- the name/short name observable for the security/issuer during a bounded interval.

CURRENT_DISPLAY_NAME
- the latest convenient label used for current presentation.

NAME_ALIAS
- another historical/official name linked to a proven issuer/security lineage.

A display name is never a durable key.

## Rename classes

SAME_SECURITY_SAME_ISSUER_NAME_CHANGE
- securityIdentity unchanged;
- issuerIdentity unchanged;
- only official/display/legal name changes.

SAME_SECURITY_ISSUER_LEGAL_NAME_CHANGE_PROVEN
- securityIdentity unchanged;
- issuer legal name changes;
- canonical issuer identity remains proven the same.

SAME_SECURITY_CODE_AND_NAME_CHANGE_PROVEN
- securityIdentity unchanged;
- code/symbol and visible name both change;
- DL-122/DL-125 identity equivalence receipt passes.

ISSUER_IDENTITY_CHANGE_SECURITY_UNCHANGED_UNKNOWN
- unusual/ambiguous case;
- continuity is blocked until owner-certified identity semantics resolve it.

DIFFERENT_SECURITY_SIMILAR_NAME
- similar/equal name text but different security identity.

DIFFERENT_ISSUER_REUSED_NAME
- historical name text is reused by another issuer.

NAME_ALIAS_RELATION_UNKNOWN
- string similarity exists but causal/legal lineage is unresolved.

## Name normalization rule

Normalization such as:
- punctuation removal;
- whitespace collapse;
- case folding;
- legal-suffix cleanup;
- common abbreviation expansion

may be used for candidate lookup only.

NORMALIZED_NAME_EQUALITY != ISSUER_IDENTITY_EQUIVALENCE.
NORMALIZED_NAME_EQUALITY != SECURITY_IDENTITY_EQUIVALENCE.

Fuzzy string similarity is retrieval assistance, not proof.

## Historical name receipt

A versioned alias/name receipt should bind:

- aliasReceiptId;
- aliasReceiptVersion;
- securityIdentity;
- issuerIdentity;
- market;
- symbol;
- membershipIntervalId;
- historicalDisplayName;
- normalizedDisplayName;
- aliasRelation;
- effectiveFrom;
- effectiveToExclusive;
- firstObservableAt;
- sourceId;
- sourceVersion;
- sourceHash;
- replaySafe.

Allowed aliasRelation:
- CANONICAL_NAME_AT_DATE;
- FORMER_OFFICIAL_NAME_SAME_ISSUER;
- SHORT_NAME_SAME_ISSUER;
- SAME_SECURITY_RENAME_PROVEN;
- LOOKUP_ALIAS_ONLY;
- DIFFERENT_ISSUER_NAME_COLLISION;
- ALIAS_RELATION_UNKNOWN.

## PIT name semantics

For historical replay:
historicalDisplayNameAtDate must come from an as-of-valid name/alias interval when available.

Do not backfill today's company name into the historical predictor record and then treat that future name as if it were known at the old date.

For user-facing presentation, two labels may coexist:
- historicalDisplayNameAtDate;
- currentDisplayName.

The current name is descriptive metadata only and must not enter predictor features.

## Pattern continuity

A pure proven rename does not:
- end a D01 episode;
- create a new pattern root;
- create a new opportunity;
- multiply a vote;
- reset sourceHistoryHash by itself.

A rename may still coincide with:
- merger;
- share conversion;
- market migration;
- code change;
- capital event.

Those causal events are classified separately under DL-122~DL-125 and may break continuity.

NAME_CHANGE_ALONE != SECURITY_IDENTITY_BREAK.
NAME_CHANGE_ALONE != ALPHA_EVENT.

## Same issuer does not imply same security

One issuer may have multiple securities/share classes.

Therefore:
ISSUER_IDENTITY_EQUALITY != SECURITY_IDENTITY_EQUALITY.

Bars from two securities of the same issuer may not be stitched into one D01 history unless a separate SAME_SECURITY equivalence receipt exists.

## Future-name firewall

A later rename may not retroactively:
- change old opportunityId;
- change old episodeId;
- change old requiredSourceBarIds;
- change old firstObservableAt;
- change old feature hash.

If only name metadata changes while security identity/source bars stay fixed:
append a new alias receipt.
Do not replay price geometry.

## D01/D08 boundary

Corporate naming announcements and event interpretation may belong to D08/event research.

D01 consumes identity/alias lineage only to:
- prevent false stitching;
- preserve explainability;
- preserve PIT labels.

D01 does not turn a rename headline into a price-pattern signal.

## Current decision

DISPLAY_NAME_IS_DURABLE_IDENTITY = FALSE.
FUZZY_NAME_MATCH_PROVES_IDENTITY = FALSE.
PROVEN_PURE_RENAME_BREAKS_PATTERN = FALSE.
CURRENT_NAME_MAY_REWRITE_HISTORICAL_PREDICTOR_LABEL = FALSE.
SAME_ISSUER_EQUALS_SAME_SECURITY = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
