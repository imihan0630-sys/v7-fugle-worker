# Corporate Action Discovery Source Contract

Updated: 2026-09-25 Asia/Taipei
Status: RESEARCH_ONLY / SOURCE_DISCOVERY
Formal Core: LOCKED

## Purpose

Define authoritative discovery paths for building a complete bounded-period TWSE corporate-action denominator.

## 1. Ex-right / ex-dividend / rights events

Official TWSE OpenAPI catalog exposes:
- /exchangeReport/TWT48U_ALL — listed-stock ex-right/ex-dividend forecast table.

Verified current machine payload fields include:
- Date
- Code
- Name
- Exdividend
- StockDividendRatio
- SubscriptionRatio
- SubscriptionPricePerShare
- CashDividend
- SharesOffered
- SharesEmpOwner
- SharesholderOwner
- StockHoldingRatio

Use:
- prospective/current event discovery;
- not by itself as arbitrary historical backfill unless a historical archive/vintage is preserved.

Historical/public TWSE pages:
- Ex-right Announcement
- Ex-right Price Data

These are authoritative for event/reference validation.

## 2. Capital reduction

Official TWSE public pages:
- Capital Reduction Announcement
- Reference Price for Capital Reduction

Reference-price history is publicly queryable from 2011-01-01.

The official formula page distinguishes:
- cash-refund reduction;
- loss-offset reduction;
- reduction plus cash injection.

## 3. Change of par value

Official TWSE site exposes:
- Change of Par Value Announcement
- Reference Price after Change of Par Value.

Use these to discover/validate unit-conversion events.

## 4. New shares listed / resumed trading

Official TWSE Official Document Announcements publish:
- capital-reduction new-share resume/listing dates;
- new securities listing events;
- other exchange-plan changes.

For stock dividends/rights:
- ex-right price event and later new-share listing/supply event must be separate registry stages.

## 5. Complete historical constituent/action files

TWSE Data E-Shop Common Stock EX-Right product provides daily files from 2005-03-01 including:
- ex-right date;
- cash/stock dividend;
- rights subscription ratio/price;
- shares issued before/after ex-right;
- capital-reduction/resumption fields;
- shares before/after reduction.

This is the strongest documented complete official historical file contract, but it is a paid data product.

## 6. Coverage policy

For a bounded historical study, eventCoverageComplete may be TRUE only when:
- every relevant action family for the universe/date range has an authoritative discovery source;
- the source is queried/archived for the entire date range;
- revisions/supersessions are preserved;
- symbol universe is point-in-time complete;
- missing responses are distinguishable from no events.

Current convenience registry does not meet this denominator requirement.

## 7. Prospective path

A prospective archive can be built from:
- TWT48U_ALL snapshots;
- official document announcements;
- capital-reduction/par-value pages;
- MOPS first-known filings.

Archive:
- fetchedAt;
- payload hash;
- event version;
- firstKnownAt;
- supersededBy;
- source URL.

## 8. Current gate

Prospective complete discovery: FEASIBLE.
Historical complete free automated discovery: PARTIAL.
Historical complete official paid-file discovery: DOCUMENTED FEASIBLE.

No Formal runtime dependency is authorized.

## 9. Suspension/resumption source lanes (CA-093 extension)

### TWSE
- OpenAPI catalog/Swagger advertises `/exchangeReport/TWTAWU` for suspended-trading securities.
- Historical suspended-trading page: https://www.twse.com.tw/zh/trading/historical/twtawu.html
  - query by period/security/category;
  - CSV export;
  - page states data available from 2011-10-03.
- Official Document Announcements and MOPS significant disclosures remain necessary to bind a suspension to a corporate-action cause, preserve schedule revisions and establish point-in-time knowledge.

Direct payload-field validation for the TWTAWU API endpoint was not completed in this round because the research web client could not retrieve the direct API payload. Therefore:
`TWSE_TWTAWU_MACHINE_FIELD_CONTRACT=UNKNOWN`
until an archived successful capture proves the schema.

### TPEx
- Official Trading Halt/ Resumption Trade history:
  https://www.tpex.org.tw/en-us/announce/market/halt/historical.html
  exposes Today/History, year/security-category filters and CSV download.
- TPEx change-of-par-value announcement/reference-price pages and capital-reduction/new-share announcements are required when the halt/resumption is caused by unit conversion or share replacement.
- TPEx and MOPS timestamps are distinct provenance fields. Preserve both when available.

An exact stable public TPEx machine endpoint for the halt/resumption dataset has not been frozen here.
Therefore:
`TPEX_HALT_MACHINE_ENDPOINT_CONTRACT=UNKNOWN`.
Do not fabricate an API path; archive the official HTML/CSV artifact plus fetch metadata until a stable contract is verified.

### Completeness rule
Suspension coverage must be proven per exchange.
A TWSE-complete lane does not imply TPEx completeness and vice versa.
Absence of a suspension record is not evidence of NO_SUSPENSION unless the symbol's exchange lane, date range and parser coverage are complete.

No Formal runtime dependency is authorized.



## 10. Daily share-denominator source lanes (CA-106)

Corporate-action event discovery and share-denominator observation are separate source problems.

### TWSE denominator backbone

Official Data E-Shop BFT51U provides a DAILY all-stock basic file with both an issued field and a listed-share field from the mid-2000s onward.
This is the strongest documented daily official denominator backbone identified in this round.

Source-status:
- daily cadence: VERIFIED BY PRODUCT DOCUMENTATION;
- issued/listed dual-field presence: VERIFIED BY PRODUCT DOCUMENTATION;
- historical availability: DOCUMENTED;
- free access: NO, paid product;
- exact raw-unit conversion: UNKNOWN until official sample/format artifact is successfully archived.

Monthly TWSE turnover/basic-statistics products can reconcile denominator semantics:
they separately expose issued and listed shares, and the documented turnover product uses listed shares.
They cannot replace a missing daily vintage.

### TPEx denominator backbone

Official TPEx daily close-quote pages expose `發行股數` per security alongside executed shares and prices.
Historical date-specific quote surfaces are publicly available.

Source-status:
- daily issued-share field: VERIFIED;
- public historical page availability: VERIFIED;
- stable long-run machine/API contract: not yet frozen in this research;
- exact listed-vs-issued alternative denominator field: not established here.

TPEx published statistics explicitly state that capital and turnover are calculated using issued shares.

### Cross-exchange warning

A field named `turnover` is not exchange-neutral evidence.
TWSE documented turnover and TPEx published turnover use different denominator conventions.

Any cross-market research must either:
1. normalize both to the same explicitly proven denominator space; or
2. keep exchange-native turnover semantics separate.

Do not compare them as one feature merely because the label is the same.

### Exact CA-106 gate

Denominator source readiness is not COMPLETE until:
- unit semantics are pinned;
- every required trading date is captured or continuity is independently proven;
- security type/private-placement/payment-certificate treatment is resolved for event windows;
- revisions are preserved;
- cross-source conflicts are surfaced rather than overwritten.

No Formal runtime dependency is authorized.
