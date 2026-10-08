# D18-04 U2B Identity-Transition Pair-Comparability Contract 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / IDENTITY_TRANSITION_SCOPE_FROZEN / EXECUTABLE_REPLAY_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D18-04
Formal Core impact: NONE

## Purpose

Close the remaining semantic gap in PRICE_RESET_FAMILY_SET for merger, share conversion, delisting and identifier-transition events.

The U2B V0.1 object is a same-security close-to-close price-return object.

Therefore:
`SAME_ECONOMIC_SECURITY_IDENTITY`
is a prerequisite.

A legal transformation between different securities is not converted into a same-security return merely because exchange rules publish a reference price for the successor security.

## 1. Core distinction

Three event classes must remain separate.

### A. SAME-SECURITY PRICE-SPACE RESET

Examples:
- ex-right/dividend reference reset;
- capital reduction;
- domestic ordinary-share par-value/unit change.

These may remain one security identity if the canonical action family supplies an admissible price-space transform.

They are PRICE_RESET_FAMILY_SET members.

### B. SAME-SECURITY TRADING INTERRUPTION

Examples:
- regulatory suspension;
- information-driven temporary halt/resumption.

If the symbol/security identity remains the same and exact eligible-session/lifecycle continuity is certified, the pair may remain comparable.

A suspension by itself is not an identity transformation.

### C. SECURITY-IDENTITY TRANSITION

Examples:
- share conversion into a newly established company;
- share exchange into another existing company;
- merger where the old security terminates and consideration/new shares are delivered;
- demerger/spin-off with exchange into multiple securities;
- delisting followed by a different successor security;
- code/market/security-class migration where the old and new instrument identities are not proven equivalent.

V0.1 disposition:
`PAIR_NOT_COMPARABLE_IDENTITY_TRANSITION`.

No automatic price-return transform is allowed.

## 2. Reference price is not a historical return transform

Exchange rules can define:
- opening auction basis;
- initial listing reference basis;
- resumed-trading reference price;
- exchange-ratio-based reference calculations.

These are trading-mechanism objects.

They do not automatically prove that:
`successorClose / predecessorClose - 1`
is a same-security investment return.

For share conversion / merger transitions, the shareholder payoff can depend on:
- exchange ratio;
- cash consideration;
- fractional settlement;
- multiple successor securities;
- record/effective/listing dates;
- rights during the interruption period;
- taxes/fees.

Therefore a valid cross-identity economic return needs a separate corporate-action payoff transform.

U2B V0.1 does not implement that transform.

## 3. Canonical pair-identity fields

Every U2B pair must bind:

- priorMarket;
- priorSymbol;
- priorSecurityIdentity;
- currentMarket;
- currentSymbol;
- currentSecurityIdentity;
- identityRelation;
- membershipTransitionState;
- actionFamily;
- pairComparabilityState;
- pairComparabilityReason;
- identityEvidenceHash.

Allowed identityRelation:
- SAME_SECURITY;
- SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT;
- SUCCESSOR_SECURITY;
- MULTI_SUCCESSOR;
- TERMINATED_NO_SUCCESSOR;
- UNKNOWN.

For V0.1:

`pairComparabilityState=COMPARABLE`
only when:
- identityRelation=SAME_SECURITY;
- or an explicit canonical equivalence receipt proves code/market change did not alter security/economic identity.

All successor/multi-successor/unknown transitions remain NOT_COMPARABLE.

## 4. Code change is not automatically identity change

A ticker/code or market-board change alone may be:
- administrative relabeling of the same security;
- or a genuinely new/listed successor security.

Therefore:
`symbol changed`
is not sufficient to classify either way.

Required for code-change comparability:
- old/new security master identity;
- issuer/security identifier linkage;
- no exchange/consideration event;
- same share unit/denominator semantics or separately certified transform;
- exact effective timestamp;
- immutable identity linkage receipt.

Absent proof:
`IDENTITY_EQUIVALENCE_UNKNOWN`.

## 5. Share conversion / newly established company

TWSE rules can set the initial trading reference basis of a new company created through share conversion using the predecessor company's last close and exchange ratio.

That is an initial-listing trading reference.

D18 interpretation:
- useful for trading-microstructure/reference-price context;
- not sufficient for a predecessor-to-successor same-security U2B return.

Disposition:
`PAIR_NOT_COMPARABLE_IDENTITY_TRANSITION`.

A future special-situation return module may build a shareholder-payoff transform, but it is outside U2B V0.1.

## 6. Corporate demerger / company split

Legal company split/demerger can coexist with:
- capital reduction;
- new-share issuance;
- multiple recipients;
- different listing identities;
- suspension and exchange operations.

It is not the same object as a stock par-value/unit split.

Therefore:
- stock-unit change under PAR_VALUE_CHANGE can be price-space-adjusted within same security when canonical;
- company demerger remains identity-transition / payoff-transform scope.

No aliasing.

## 7. Delisting

If prior security is delisted:
- no later successor mapping => no same-security current pair;
- successor security exists => identity transition until an explicit payoff transform exists.

No stale prior close may be carried forward as a synthetic current return.

Disposition:
`PAIR_NOT_COMPARABLE_DELISTED_OR_SUCCESSOR_REQUIRED`.

## 8. Same-security suspension/resumption

For same security:
- prior eligible session must be exact;
- bounded suspension completeness must be proven;
- any special reference-price reset family must be checked;
- first resumed close can be compared only after continuity/price-space gates pass.

A long suspension does not itself create identity change.

But an unresolved STOP/RESUME boundary remains:
`CONTINUITY_UNKNOWN`.

## 9. Price-reset family set consequence

After the domestic ordinary-share par-value mapping and this identity-transition firewall, PRICE_RESET_FAMILY_SET V0.1 semantics can be frozen as:

Required same-security price-space families:
- EX_RIGHT_DIVIDEND;
- CAPITAL_REDUCTION;
- PAR_VALUE_CHANGE;
- SUSPENSION_RESUMPTION session/reference continuity.

Identity-transition blockers:
- MERGER;
- SHARE_CONVERSION;
- COMPANY_DEMERGER;
- DELISTING_TO_SUCCESSOR;
- UNPROVEN_IDENTIFIER_TRANSITION.

For the identity-transition blockers, "complete coverage" means:
the event is detected and the pair is excluded / NOT_COMPARABLE.

It does NOT require constructing an adjusted successor return.

This is important:
`COMPLETE_BLOCKING_DETECTION`
can satisfy U2B V0.1 family adequacy even though
`CROSS_IDENTITY_RETURN_TRANSFORM`
does not exist.

## 10. U2B readiness states

Per symbol/date pair:

- U2B_COMPARABLE_CLEAR_NO_ACTION;
- U2B_COMPARABLE_PRICE_RESET_TRANSFORMED;
- U2B_CONTINUITY_UNKNOWN;
- U2B_PRICE_RESET_UNKNOWN;
- U2B_IDENTITY_TRANSITION_NOT_COMPARABLE;
- U2B_IDENTITY_EQUIVALENCE_UNKNOWN;
- U2B_PRIOR_SESSION_MISSING;
- U2B_SOURCE_REVISION_INVALID.

V0.1 minimal path still admits only:
`U2B_COMPARABLE_CLEAR_NO_ACTION`.

The transformed price-reset state is reserved for future explicit implementations.

## 11. Denominator accounting

Every date receipt must separately count:
- sameSecurityPairN;
- identityTransitionBlockedN;
- identityEquivalenceUnknownN;
- delistedNoPairN;
- continuityUnknownN;
- clearNoActionReadyN.

Identity-transition exclusion is not random missingness.

Do not generalize a U2B return distribution to the full U0 universe without reporting these exclusions.

## 12. Mandatory adversarial tests

### ID-T01 same symbol/same security/no action
Expected:
COMPARABLE subject to other gates.

### ID-T02 same security + certified suspension/resumption
Expected:
may remain comparable after exact-session/continuity gates.

### ID-T03 predecessor converted into new company/security
Expected:
PAIR_NOT_COMPARABLE_IDENTITY_TRANSITION.

### ID-T04 merger into existing company
Expected:
PAIR_NOT_COMPARABLE_IDENTITY_TRANSITION.

### ID-T05 company demerger with multiple successor securities
Expected:
PAIR_NOT_COMPARABLE_IDENTITY_TRANSITION.

### ID-T06 delisted predecessor with no successor
Expected:
PAIR_NOT_COMPARABLE_DELISTED_OR_SUCCESSOR_REQUIRED.

### ID-T07 ticker/code changed but immutable security identity equivalence proven
Expected:
may be SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT.

### ID-T08 ticker/code changed, equivalence unknown
Expected:
IDENTITY_EQUIVALENCE_UNKNOWN.

### ID-T09 exchange publishes successor reference price
Expected:
does not by itself create same-security return comparability.

### ID-T10 exchange ratio known but cash/fractional/multiple consideration unresolved
Expected:
no cross-identity U2B return.

### ID-T11 legal company split misclassified as stock par-value split
Expected:
semantic rejection.

### ID-T12 same-security PAR_VALUE_CHANGE
Expected:
price-reset family, not identity transition, subject to canonical transform.

## 13. Maturity implication

This closes the remaining V0.1 identity-transition semantic ambiguity.

It does not create:
- executable U2B builder;
- physical CLEAR_NO_ACTION receipt;
- identity-transition detector coverage;
- Taiwan OOS outcome evidence.

D18-04 remains L2/40.

## Exact next

1. Freeze PRICE_RESET_FAMILY_SET V0.1 with domestic ordinary-share PAR_VALUE_CHANGE mapping plus identity-transition blocking semantics.
2. Require DATA/continuity receipt to bind the family-set version actually used.
3. After CORR-007 and bounded TWTAWU evidence, obtain first real CLEAR_NO_ACTION pair.
4. Build research-only U2B row/aggregate builder.
5. Execute the existing U2B oracle plus ID-T01~ID-T12.
6. Only after physical Taiwan replay consider D18-04 L3.
