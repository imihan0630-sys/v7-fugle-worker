# D01 DL-122 — Security Identity Transition Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SECURITY_IDENTITY_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent D01 from stitching price bars across a listing, market migration, code change, share conversion, merger, demerger or successor-security event merely because the visible ticker, issuer name or exchange reference price looks continuous.

The durable object is security identity, not symbol text.

## Core distinction

### SAME_SECURITY_ADMINISTRATIVE_TRANSITION

Possible examples:
- same security moves from one trading board/market to another;
- same security retains economic identity but ticker/code changes;
- Innovation Board to ordinary TWSE listing where canonical security identity remains the same.

May preserve structural lineage only when an immutable equivalence receipt proves:
- same security identity;
- same issuer/security class linkage;
- same economic share unit or a certified transform;
- exact transition timestamp;
- no merger/share-exchange consideration that creates a successor security;
- no unresolved membership/lifecycle conflict.

### SAME_SECURITY_PRICE_SPACE_RESET

Examples:
- par-value/share-unit change;
- capital reduction;
- ex-right/dividend reset.

These remain same-security only when canonical continuity transforms certify the price space.

### SECURITY_IDENTITY_TRANSITION

Examples:
- share conversion into a newly established company;
- merger into an existing different company/security;
- share exchange into another security;
- company demerger with one or multiple successor securities;
- delisting followed by a different successor security.

These break D01 same-security pattern continuity.

An exchange reference price for the successor does not prove same-security identity.

## Canonical identity receipt

Required fields:
- identityReceiptId;
- identityReceiptVersion;
- priorMarket;
- priorSymbol;
- priorSecurityIdentity;
- priorIssuerIdentity;
- priorShareClass;
- priorUnitSemantics;
- currentMarket;
- currentSymbol;
- currentSecurityIdentity;
- currentIssuerIdentity;
- currentShareClass;
- currentUnitSemantics;
- transitionEffectiveAt;
- identityRelation;
- actionFamily;
- exchangeOrConsiderationEvent;
- unitTransformReceiptId if needed;
- sourceHash;
- firstObservableAt;
- replaySafe.

Allowed identityRelation:
- SAME_SECURITY;
- SAME_SECURITY_MARKET_MIGRATION_PROVEN;
- SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT;
- SUCCESSOR_SECURITY;
- MULTI_SUCCESSOR;
- TERMINATED_NO_SUCCESSOR;
- IDENTITY_EQUIVALENCE_UNKNOWN.

## D01 continuity disposition

CONTINUITY_ELIGIBLE
only for:
- SAME_SECURITY;
- SAME_SECURITY_MARKET_MIGRATION_PROVEN;
- SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT;

and only after R1-R6/session/price-space gates pass.

CONTINUITY_BLOCKED_IDENTITY_TRANSITION
for:
- SUCCESSOR_SECURITY;
- MULTI_SUCCESSOR;
- TERMINATED_NO_SUCCESSOR.

CONTINUITY_BLOCKED_IDENTITY_UNKNOWN
for:
- IDENTITY_EQUIVALENCE_UNKNOWN.

## Reference-price firewall

Official market rules may calculate an initial listing/reference basis from:
- predecessor last close;
- exchange ratio;
- successor listing rules.

That object is a trading-mechanism reference.

It does not by itself establish:
- same-security identity;
- same-security return;
- same D01 episode;
- same sourceHistoryHash;
- same opportunity root.

Therefore:
REFERENCE_PRICE_LINK != SECURITY_IDENTITY_EQUIVALENCE.

## Market + symbol is not durable identity

Do not key long-horizon pattern continuity by:
market|symbol
alone.

Minimum durable key:
securityIdentity + membership interval + market/symbol version.

If a ticker/code is later reused by another security:
the new security starts a new D01 identity lineage.

## Old receipt immutability

If identity classification is corrected later:
- preserve old R7/source receipts;
- append a new identity-transition receipt;
- replay affected windows under the new vintage;
- do not rewrite old episode IDs in place.

## Current decision

SYMBOL_EQUALITY_EQUALS_SECURITY_EQUALITY = FALSE.
REFERENCE_PRICE_CONTINUITY_EQUALS_SECURITY_CONTINUITY = FALSE.
SUCCESSOR_SECURITY_INHERITS_PREDECESSOR_PATTERN = FALSE.
PROVEN_SAME_SECURITY_ADMINISTRATIVE_MIGRATION_MAY_PRESERVE_LINEAGE = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
