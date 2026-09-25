# Corporate Action Share-Denominator Source Contract

Updated: 2026-09-25 Asia/Taipei
Scope: Research/Shadow only
Formal Core: LOCKED / unchanged

## 1. Why one "shares outstanding" field is unsafe

Corporate-action research needs more than one point-in-time share count.

A registration event, an exchange listing/delivery event, a treasury-share event and a free-float change can occur on different dates.
Using one current share-count field for all historical features causes:
- future leakage;
- denominator vintage errors;
- false turnover normalization;
- wrong unit-conversion timing.

The system must therefore preserve separate denominator spaces and separate `knownAt` from `effectiveAt`.

## 2. Canonical denominator spaces

### REGISTERED_ISSUED_SHARES

Meaning:
company/regulator registered issued common shares.

Use cases:
- registered capital structure;
- issued-share turnover if that metric is explicitly intended;
- capital reconciliation.

Not automatically equivalent to tradable supply.

### EXCHANGE_LISTED_SHARES

Meaning:
common shares admitted/listed for exchange trading for the relevant session.

Use cases:
- listed-supply turnover;
- trading-supply normalization;
- identifying the actual market-supply step when newly issued shares become tradable.

A registration date alone does not prove this denominator has changed.

### OUTSTANDING_SHARES

Meaning:
issued shares less shares that are not outstanding under the frozen accounting/data definition, for example treasury shares when the chosen source defines them that way.

Use cases:
- only when the metric explicitly requires outstanding shares.

Do not infer from REGISTERED_ISSUED_SHARES without a point-in-time treasury-share ledger.

### FREE_FLOAT_SHARES

Meaning:
shares meeting a frozen free-float methodology.

Use cases:
- investable-float turnover;
- index/factor research that explicitly requires free float.

Requires a methodology/version and ownership/lock-up provenance.
Never substitute current free float into old dates.

### EPS_WEIGHTED_AVERAGE_SHARES

Meaning:
financial-statement weighted-average shares used for EPS.

This is NOT a daily trading-supply denominator.
IAS 33-style retrospective presentation after a capital reduction or split may intentionally restate comparative EPS.
Do not feed this restated denominator into historical trading-volume features.

## 3. Versioned record schema

Each denominator version should preserve at minimum:

- symbol;
- exchange;
- shareClass;
- denominatorType;
- valueShares;
- effectiveFromDate;
- effectiveFromSession;
- effectiveToDate;
- knownAt;
- sourcePublishedAt;
- registrationDate;
- listingOrDeliveryDate;
- suspensionStart;
- suspensionEnd;
- sourceClass;
- sourceUrl;
- sourceArtifactHash;
- sourceRecordId;
- parserVersion;
- revisionOf;
- supersededAt;
- quality;
- notes.

Quality:
- VERIFIED;
- PARTIAL;
- CONFLICT;
- UNKNOWN.

## 4. Replay rule

A historical replay may consume a denominator only when BOTH are true:

1. `knownAt <= replayAsOf`;
2. the denominator's semantic `effectiveFromSession <= targetSession`.

Two truth modes must remain separate:

### POINT_IN_TIME_KNOWN_TRUTH
What the system could have known at that historical time.

### EX_POST_MECHANICS_TRUTH
Later first-party evidence used to audit what actually happened.

Ex-post truth may validate mechanics but must not silently enter a point-in-time replay.

## 5. Event-family mapping

### A. Stock dividend / capitalization — 8454

Verified first-party lifecycle:
- nominal distribution: 50 new shares per 1,000 old shares;
- new shares actually issued: 12,617,870;
- registered issued shares before increase: 252,357,405;
- registered issued shares after increase: 264,975,275;
- MOEA change registration approval: 2025-09-22;
- capital-increase new shares listed on TWSE: 2025-10-09.

Implication:
Between registration and listing, REGISTERED_ISSUED_SHARES and EXCHANGE_LISTED_SHARES can differ.
Do not switch a listed-supply denominator on 2025-09-22 merely because registered capital changed.

For raw share volume:
no unit conversion.

For listed-supply turnover:
the supply step belongs at the exchange listing/delivery event.

### B. Par-value change / share-unit conversion — 8422

Verified lifecycle:
- original par value: NT$10;
- new par value: NT$1;
- registered capital unchanged;
- share count changes by 10x;
- capital change registration completed 2025-08-21;
- old shares last trade 2025-11-05;
- suspension 2025-11-06 through 2025-11-14;
- new shares listed/trade 2025-11-17.

Implication:
The trading share-unit conversion becomes relevant to market bars at the resume/listing session, NOT at the earlier registration date.
Applying the 10x volume-unit bridge from 2025-08-21 would contaminate nearly three months of valid old-unit trading bars.

### C. Capital reduction — 3593

Verified lifecycle:
- pre-reduction common shares: 93,042,416, including private shares;
- shares cancelled: 37,216,967;
- post-reduction common shares: 55,825,449;
- reduction basis date: 2025-11-05;
- MOEA change registration: 2025-11-13;
- old share last trading date: 2025-12-10;
- new reduced shares list/trade: 2025-12-22.

Implication:
Legal/accounting reduction dates, registration dates and market unit-switch dates are different.
Trading-history continuity must align to the exchange trading lifecycle.
Financial statements may retrospectively restate weighted-average shares for EPS; that restatement is not a bar-level denominator.

### D. Cash capital increase — 2465

Evidence:
- pre-increase issued shares disclosed around the rights process: 83,946,031;
- cash capital increase: 10,000,000 new shares;
- current company first-party investor page reports 93,946,031 issued common shares;
- a secondary market calendar reports 2025-11-17 as the capital-increase new-share listing date.

Status:
share-count arithmetic is corroborated.
Exact first-party archived listing/delivery receipt for the 2025 event is not frozen in this research round, so:
`2465_CASH_INCREASE_LISTING_DATE_QUALITY=PARTIAL`.

Do not promote the secondary calendar as sole production provenance.

## 6. Source hierarchy

Preferred first-party/official evidence:
1. MOPS / exchange official event disclosures;
2. TWSE/TPEx listing, suspension/resumption and share-count records;
3. company annual report / financial report / investor-relations capital table;
4. competent-authority registration record when available.

Secondary broker/news/calendar copies:
- useful for discovery/cross-checking;
- never sufficient alone for production VERIFIED status.

## 7. Corporate-action transformation timing

### Pure supply change, same share unit
Examples:
- stock dividend shares later listed;
- cash capital increase shares later listed.

Rules:
- raw executed volume remains factual;
- no historical volume rescaling;
- REGISTERED_ISSUED_SHARES may step at registration;
- EXCHANGE_LISTED_SHARES steps only when shares become exchange-listed/tradable;
- free-float denominator requires its own event.

### Share-unit conversion
Examples:
- par-value split/change;
- capital reduction with share cancellation/exchange.

Rules:
- raw execution prints remain factual in each native unit;
- a continuity transform may bridge pre/post share units only across the actual market unit-switch boundary;
- never use an earlier corporate-registration date as the trading-unit switch when old-unit shares continue trading afterward.

## 8. Completeness receipt

A denominator archive must emit:
- dateRange;
- symbolsCovered;
- denominatorTypesCovered;
- verifiedVersionCount;
- partialVersionCount;
- conflictCount;
- missingKnownAtCount;
- missingEffectiveSessionCount;
- futureLeakageViolations;
- sourceClassCounts;
- parserFailures;
- unresolvedRevisionChains.

A downstream normalized feature is READY only when its exact denominatorType has complete point-in-time coverage.

## 9. Governance

Research/Shadow only.
No Worker.js wiring.
No Formal A/B/ranking/eligibility threshold change.
No production merge/deploy.
No alpha inference.
