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
