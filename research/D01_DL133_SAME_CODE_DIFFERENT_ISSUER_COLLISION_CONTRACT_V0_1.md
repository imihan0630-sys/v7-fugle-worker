# D01 DL-133 — Same-Code / Different-Issuer Collision Contract V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / CODE_COLLISION_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent long-horizon D01 research from stitching unrelated securities merely because the same market code, ticker text, or company-name string appears at different times or on different markets.

The visible code is a locator, not an immutable identity.

## Collision classes

SAME_MARKET_SYMBOL_REUSED_DIFFERENT_SECURITY
- same market + same symbol/code;
- non-overlapping membership intervals;
- different securityIdentity;
- usually different issuerIdentity or security lineage.

CROSS_MARKET_SAME_SYMBOL_DIFFERENT_SECURITY
- same symbol text appears on different markets;
- no proven same-security migration relation.

CONCURRENT_CODE_COLLISION_DATA_CONFLICT
- same market + same symbol + overlapping effective membership intervals;
- different security identities;
- cannot be treated as legitimate reuse without an owner-certified explanation.

SAME_SYMBOL_SAME_ISSUER_DIFFERENT_SECURITY
- same issuer identity;
- different security identity/share class/instrument;
- histories remain separate.

SAME_SECURITY_SYMBOL_REAPPEARANCE_PROVEN
- same immutable security returns to a previously used code under a proven identity continuity relation.

SYMBOL_COLLISION_UNKNOWN
- source lacks enough identity lineage to resolve the code.

## Durable namespace

Long-horizon history must be resolved through:

securityIdentity
+
membershipIntervalId
+
marketSymbolVersionId

not by:
market + symbol
alone.

market + symbol + date may locate a record, but the record must still resolve to one canonical security identity.

## Overlap rule

For any market + symbol:

If two different security identities have overlapping effective membership intervals:
- state = CONCURRENT_CODE_COLLISION_DATA_CONFLICT;
- R1 identity is blocked;
- no D01 history may be emitted across the conflict;
- no winner is selected by name similarity, issuer similarity, row count, or current listing status.

This protects against:
- duplicate source rows;
- stale membership intervals;
- malformed migrations;
- code-master backfills;
- present-day symbol tables projected backward.

## Non-overlap reuse rule

If the same market + symbol is assigned at non-overlapping times to different security identities:
- each interval starts/ends its own opportunity namespace;
- source history cannot cross the identity boundary;
- prior episode/root/anchor IDs cannot be inherited;
- a long lookback that would cross the boundary becomes HISTORY_TOO_SHORT_BY_DESIGN or IDENTITY_BLOCKED for the later security until enough same-security history exists.

## Cross-market rule

Same code across TWSE / TPEx / other boards is not evidence of relation.

Only DL-123 SAME_SECURITY_MARKET_MIGRATION_PROVEN can connect two market memberships into one security lineage.

Otherwise:
CROSS_MARKET_SAME_SYMBOL_DIFFERENT_SECURITY.

## Same issuer / different instrument rule

Even if issuerIdentity matches:
- common shares;
- preferred shares;
- different share classes;
- rights;
- warrants;
- depositary instruments;
- successor securities

remain separate security identities unless a specific same-security relation is proven.

Issuer-level corporate continuity is not price-series continuity.

## Alias collision rule

A corporate-name alias may collide with another issuer or security.

String match, normalized match, or former-name match cannot resolve a symbol collision.

Identity resolution precedence:
1. canonical security identity receipt;
2. membership interval;
3. market/symbol version;
4. issuer identity;
5. historical name/alias metadata.

Names come last.

## Historical-universe implication

The point-in-time historical universe must preserve:
- delisted securities;
- reused codes;
- old membership intervals;
- transition boundaries.

A current symbol master cannot be the sole historical denominator.

## Opportunity dedup implication

Same code reused by a new security:
NEW_OPPORTUNITY_NAMESPACE.

Same security under code rename:
same opportunity root may continue if DL-122/DL-125 continuity gates pass.

Different securities from one corporate event:
dependency-linked, not aliases.

## Current decision

SAME_CODE_EQUALS_SAME_SECURITY = FALSE.
NONOVERLAP_CODE_REUSE_HISTORY_STITCHING = PROHIBITED.
OVERLAPPING_DIFFERENT_SECURITY_MEMBERSHIP = R1_BLOCKING_CONFLICT.
SAME_ISSUER_DIFFERENT_SECURITY_HISTORY_STITCHING = PROHIBITED.
CURRENT_SYMBOL_MASTER_DEFINES_HISTORICAL_IDENTITY = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
