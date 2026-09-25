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

### D. Cash capital increase / payment certificates — 2465

This case is a stronger timing counterexample than the earlier draft implied.

Verified/corroborated lifecycle:
- pre-increase registered paid-in capital/share base: NT$839,460,310 / 83,946,031 shares;
- 25,000,000 of those shares were private-placement shares and were explicitly excluded from the announcement's "original listed common shares" count;
- original public-listed common shares stated by the 2025-11-12 listing announcement: 58,946,031;
- cash-increase payment certificates: 10,000,000 shares;
- payment certificates begin listed trading: 2025-11-17;
- TWSE 2465 stock-profile snapshots produced 2025-11-22/27 still display paid-in capital NT$839,460,310;
- the MOEA company change-registration list records NT$939,460,310 with approval date 2026-01-06.

The listing announcement also states a post-increase cumulative listed total of 93,946,031 and paid-in capital NT$939,460,310. That wording is not arithmetically the same semantic object as:
58,946,031 original public-listed shares + 10,000,000 newly tradable payment certificates = 68,946,031,
because the former total also numerically includes the 25,000,000 private-placement shares.

Therefore the earlier convenience scenario
83,946,031 -> 93,946,031 on 2025-11-17
is **not admissible as point-in-time REGISTERED_ISSUED_SHARES truth**. It is retained only as a falsification witness showing how silently switching denominator semantics can manufacture a normalized-volume difference.

Safe interpretation:
1. REGISTERED_ISSUED_SHARES:
   - do not step merely because payment certificates start trading;
   - the directly observed official registration change is 2026-01-06;
   - exact historical knownAt remains source-version dependent.
2. EXCHANGE_LISTED_OR_TRADABLE_SHARES:
   - a real supply step occurs on 2025-11-17 because 10,000,000 payment certificates begin trading;
   - 58,946,031 -> 68,946,031 is retained as a **public-tradable sensitivity** only;
   - exact exchange-field semantics remain PARTIAL_CONFLICT until a primary machine contract that explicitly resolves private-placement treatment is archived.
3. PRIVATE_PLACEMENT_SHARES:
   - must not be silently treated as ordinary freely tradable supply.
4. PAYMENT_CERTIFICATE_SHARES:
   - are a distinct tradable instrument/stage before final common-share registration/conversion and must preserve their own lifecycle provenance.

CA-103 result:
- strict then-registered-share normalization produces no 2025-11-18 1.05 threshold flip because the registered denominator does not step on 2025-11-17;
- the public-tradable sensitivity produces a flip (raw 1.0908796 vs normalized 1.0003297);
- therefore the disagreement is real **only conditional on the denominator semantic being tradable supply**, not a universal corporate-action correction.

Status:
- `2465_REGISTERED_ISSUED_PRE_2026_01_06=83,946,031` = CORROBORATED;
- `2465_REGISTERED_CAPITAL_CHANGE_APPROVAL=2026-01-06` = OFFICIAL_MOEA;
- `2465_2025-11-17_PAYMENT_CERTIFICATE_LISTING=10,000,000` = CORROBORATED_MOPS/TWSE;
- `2465_PUBLIC_TRADABLE_58,946,031_TO_68,946,031` = SENSITIVITY / NOT PRODUCTION VERIFIED;
- `2465_EXACT_EXCHANGE_LISTED_DENOMINATOR` = PARTIAL_CONFLICT;
- `2465_83,946,031_TO_93,946,031_ON_2025-11-17_AS_REGISTERED_DENOMINATOR` = FALSIFIED.


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

## 9. CA-102 denominator-vintage replay contract

Deterministic fixtures are materialized in:
`research/corporate_action_denominator_vintage_threshold_v0_1.json`.

Replay invariant:
- a denominator version is consumable only if `knownAt <= replayAsOf`;
- and its semantic `effectiveFromSession <= targetSession`;
- a later correction may improve EX_POST_MECHANICS_TRUTH but may not be backfilled into POINT_IN_TIME_KNOWN_TRUTH.

Required falsification cases:
1. future-known version must not leak backward;
2. known-but-not-effective supply change must not switch early;
3. known-and-effective version may switch;
4. late correction must not rewrite the historical decision-time denominator.

Real corporate-action records with missing exact first-known timestamps remain UNKNOWN for point-in-time replay even when ex-post mechanics are verified.

## 10. CA-103 bounded threshold sensitivity

Frozen source artifact:
`research/corporate_action_denominator_vintage_threshold_v0_1.json`.

Real mechanics:
- 8454 event-day witness: raw ratio 0.8253790 vs registered-issued-turnover analogue 0.7860752; no 1.05/1.30 Boolean disagreement.
- 2465 2025-11-17..21:
  - strict registered denominator: no denominator step on 11/17, therefore no disagreement with raw ratios;
  - public-tradable sensitivity: one 1.05 disagreement on 2025-11-18 (raw 1.0908796 vs 1.0003297);
  - no 1.30 breakout disagreement in the five tested sessions.

Structural result:
for `todayTurnover / avg(previous5Turnover)`, a one-time denominator step matters only while the five-session lookback straddles that step. Once current and all five prior sessions share the same denominator, a constant denominator cancels algebraically unless another denominator change occurs.

This is semantics/mechanics evidence only. It is not an outcome test and not evidence that normalized turnover predicts returns.

## 11. CA-104 downstream denominator interaction contract

### Institutional flow
Raw official net-share flows remain factual share counts across a pure supply change.
Do not retroactively rescale:
- foreignNet;
- trustNet;
- dealerNet;
- institutionTotalNet.

Any normalized variant such as institutional net shares / issued shares, listed shares, or free float must name its denominator space and pass the same point-in-time vintage gate.

Institutional buy-day streaks are sign/count semantics and do not become denominator-normalized merely because a supply event exists.

### Market capitalization
The current Worker has a fallback of the form:
`marketCapYi = sharesOutstanding * close / 1e8`
when an explicit market-cap field is absent.

Research replay must not combine a historical price with a current share-count snapshot.
A market-cap record therefore needs:
- marketCapSemantic;
- denominatorType;
- denominatorValue;
- priceDate/session;
- knownAt;
- source provenance.

Do not assume registered issued shares, publicly tradable shares and free float produce the same economic "market cap" object, especially when private-placement shares or payment certificates exist.

### Valuation / EPS
EPS weighted-average shares are a financial-report denominator, not a daily trading-supply denominator.
Corporate-action restatement under financial-reporting rules must not be reused as a bar-level turnover bridge.

Point-in-time P/E/P/B research must preserve the official valuation snapshot/methodology and its source date.
Do not recompute old valuation using a current share base merely to fill a historical gap.

### Holdings percentages
A holding percentage can move mechanically when its denominator changes even if the holder transacts zero shares.
Preserve raw holder shares and denominator-vintaged percentage as separate fields.

Status:
DOWNSTREAM_DENOMINATOR_SPACES_SEPARATED / NO FORMAL CHANGE.

## 12. Governance

Research/Shadow only.
No Worker.js wiring.
No Formal A/B/ranking/eligibility threshold change.
No production merge/deploy.
No alpha inference.
