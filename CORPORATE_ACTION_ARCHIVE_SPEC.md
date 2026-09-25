# Corporate Action Archive & Completeness Specification

Updated: 2026-09-25 Asia/Taipei
Status: RESEARCH_ONLY
Formal Core: LOCKED

## Purpose

Create a point-in-time corporate-action archive that can prove:
- what event was known;
- when it was known;
- which version was current;
- when price/share-unit effects became effective;
- whether a bounded study has complete event coverage.

## A. Prospective daily archive

Capture at least once after each market day and retain immutable vintages.

Sources:
1. TWSE OpenAPI TWT48U_ALL for upcoming ex-right/ex-dividend/rights events.
2. TWSE Official Document Announcements for exchange plans, suspensions, resumptions and new-share listings.
3. TWSE capital-reduction and par-value-change announcement/reference pages.
4. MOPS first-known company filings and later corrections.
5. TWSE FMTQIK and MFI94U monthly/current benchmark snapshots.

Per capture:
- sourceId;
- sourceUrl;
- fetchedAt;
- payloadHash;
- marketDate;
- recordCount;
- sourceStatus;
- parserVersion.

Per event:
- actionFamilyId;
- eventKey;
- eventVersion;
- firstKnownAt;
- finalScheduleKnownAt;
- effectiveDate;
- supersedes;
- actionType/eventStage;
- mode-specific price factors;
- volumeTransformMode/shareUnitFactor;
- source provenance;
- readiness/unknown reasons.

## B. Historical bounded ingestion

For [startDate,endDate] and frozen universe:

1. Build point-in-time listed-common-stock universe.
2. Acquire official ex-right/dividend/rights artifacts for the entire interval.
3. Acquire capital-reduction resume/reference artifacts.
4. Acquire par-value-change artifacts.
5. Acquire new-share listing/supply-stage artifacts.
6. Preserve revisions and corrections.
7. Reconcile duplicate actionFamilyIds without deleting old versions.
8. Produce a completeness receipt.

Completeness receipt:
- interval;
- universeVersion;
- universeCountByDate;
- sourceCoverageByActionType;
- expectedEventCount;
- observedEventCount;
- verifiedEventCount;
- unknownEventCount;
- parserFailures;
- missingSourceDates;
- revisionCoverage;
- generatedAt;
- artifact hashes.

## C. No-event semantics

NO_EVENT may be assigned only when:
- all relevant source families are complete for the window;
- parser coverage is complete;
- the symbol was in the point-in-time universe;
- no matching event exists.

Otherwise use:
EVENT_COVERAGE_UNKNOWN.

## D. Suspension/resumption semantics

A corporate-action archive must also store symbol-specific:
- suspendTradingStart;
- suspendTradingEnd;
- resumeTradingDate.

These dates are not missing-market-session defects.

Any history-freshness validator must distinguish:
- market-wide official trading sessions;
- symbol-specific non-trading due to verified suspension.

A valid suspended symbol can legitimately have no bar on a market trading day.

## E. Governance

This archive is Research/Shadow evidence infrastructure.
It does not alter Formal history, A/B formulas, ranking, monitoring or execution.
Any runtime dependency remains separately governed.

## F. Exchange-scoped suspension archive contract (CA-093)

Suspension completeness is exchange-scoped. A TWSE-only archive is not sufficient for a universe that also contains TPEx securities.

### TWSE lane

Prospective/current discovery:
- TWSE OpenAPI Swagger advertises `GET /exchangeReport/TWTAWU` for suspended-trading securities.
- Preserve the daily payload as an immutable source snapshot when collector access is available.
- This round did not independently read the endpoint payload through the research client, so the exact machine-field contract remains unpinned and must stay UNKNOWN until a capture receipt exists.

Historical/reconciliation:
- TWSE historical "Suspended Trading Securities" page supports date/security/category search and CSV export and states coverage from 2011-10-03.
- TWSE Official Document Announcements and MOPS significant disclosures remain required for corporate-action causes, schedule revisions and first-known timing.
- Do not use a narrow financial-irregularity suspension page as a complete corporate-action suspension denominator.

### TPEx lane

Prospective/historical discovery:
- TPEx official "Trading Halt/ Resumption Trade" exposes Today/History views, year/security-category filters and CSV download.
- TPEx change-of-par-value announcement/reference-price pages and capital-reduction/new-share announcements are separate evidence for corporate-action suspensions and resume dates.
- TPEx/MOPS material-information timing should be archived separately when both exist; do not assume the MOPS timestamp is always the earliest exchange-known timestamp.
- An exact stable TPEx machine API endpoint for this dataset is not yet frozen by this research. Until verified, archive the official page/CSV artifact plus fetch metadata rather than inventing an API contract.

### Required suspension record fields

In addition to the common event fields, preserve:
- exchange;
- suspensionCauseFamily;
- suspendTradingStart;
- suspendTradingEnd;
- resumeTradingDate;
- firstExchangeKnownAt;
- firstMopsKnownAt;
- suspensionSourceClass;
- sourceArtifactHash;
- sourceCoverageStatus.

### Coverage receipt extension

A completeness receipt must report:
- suspensionCoverageByExchange;
- sourceCoverageByExchange;
- missingExchangeSourceDates;
- parserFailuresByExchange;
- unresolvedCauseCount;
- unresolvedFirstKnownCount.

A verified interval may remove expected symbol sessions only when its exchange lane and provenance are READY.
If the relevant exchange/source coverage is incomplete, use `SUSPENSION_PROVENANCE_UNKNOWN` / `EVENT_COVERAGE_UNKNOWN`; never infer NO_SUSPENSION from absence.

This remains Research/Shadow evidence infrastructure only and does not authorize a Formal runtime dependency.



## G. Daily denominator backbone contract (CA-106)

Event announcements alone cannot prove a historical denominator for every market session.
The archive therefore needs an exchange-scoped DAILY denominator backbone in addition to the event registry.

### TWSE daily denominator lane

Official TWSE Data E-Shop product:
- product: Basic Information of All Stocks / 當日個股基本資料表;
- file: BFT51U;
- production time: approximately 14:40 on each trading day;
- cadence: DAILY;
- documented start: 2004-02-19 on the Chinese product page / 2004-03-01 on the English page;
- documented fields include trade date, stock code, reference/close, issued-volume field and listed-share field.

Important unit guard:
the Chinese field labels are `發行張數` and `上市股數`.
Do NOT assume identical units merely because both represent share-base quantities.
The sample/format download was not programmatically retrievable in this research round, so:
`TWSE_BFT51U_UNIT_NORMALIZATION_CONTRACT=UNKNOWN`
until the official format document or archived sample proves the conversion.

Archive the raw values and raw field labels first.
Only create normalized share counts after unit semantics are VERIFIED.

TWSE monthly turnover/basic-statistics files are reconciliation controls, not substitutes for missing daily BFT51U dates.
Official monthly documentation distinguishes issued shares and listed shares, and the turnover product defines turnover using listed shares.

### TPEx daily denominator lane

Official TPEx daily OTC close quote is a public daily per-security surface and includes:
- security code/name;
- close/open/high/low;
- executed shares;
- trade value/count;
- `發行股數`;
- next-session reference/limits.

This gives a directly observable DAILY REGISTERED/ISSUED-share denominator lane for TPEx research.

Historical date-specific public quote pages are also documented/observable, so prospective and bounded historical captures are feasible at the page/artifact level.

TPEx published market statistics explicitly state that capital and turnover rate are calculated using issued shares.
This is a semantic cross-check, not permission to assume every TWSE/TPEx product uses the same denominator.

### Cross-exchange semantic key

Never store one unlabeled `turnoverRate` or `shareCount`.

Minimum semantic key:
- exchange;
- sourceProduct;
- securityType;
- denominatorType;
- rawFieldName;
- rawUnit;
- normalizedUnit;
- unitTransformVersion;
- effectiveSession;
- knownAt;
- sourceArtifactHash.

TWSE and TPEx turnover products currently demonstrate different official denominator conventions:
- TWSE monthly turnover: listed shares;
- TPEx published turnover statistics: issued shares.

Therefore cross-exchange comparison requires explicit denominator harmonization or must remain semantically separate.

### Payment certificates / private-placement guard

Daily share-base files must not silently collapse:
- ordinary listed common shares;
- private-placement shares;
- payment certificates;
- newly registered but not-yet-tradable shares.

For 2465, the event record proves a payment-certificate supply stage before the later company-registration change, while private-placement treatment remains semantically unresolved for the exact listed denominator.

Until an archived daily denominator artifact resolves the security-type treatment for that session:
- exact exchange-listed/tradable denominator = PARTIAL/UNKNOWN;
- a sensitivity scenario is not a VERIFIED denominator.

### CA-106 denominator completeness receipt

For every [startDate,endDate] study interval and frozen universe, emit at minimum:
- exchange;
- sourceProduct;
- expectedTradingDates;
- capturedTradingDates;
- missingTradingDates;
- universeCountByDate;
- denominatorTypeCoverage;
- symbolDenominatorCoveragePct;
- rawUnitContractStatus;
- unitNormalizationVersion;
- verifiedCount;
- partialCount;
- conflictCount;
- unknownCount;
- missingKnownAtCount;
- missingEffectiveSessionCount;
- paymentCertificateUnresolvedCount;
- privatePlacementTreatmentUnresolvedCount;
- securityTypeUnresolvedCount;
- denominatorStepsWithoutMatchedEventCount;
- matchedEventsWithoutDenominatorStepCount;
- crossSourceConflictCount;
- revisionChainGapCount;
- parserFailures;
- futureLeakageViolations;
- rawArtifactHashes;
- generatedAt.

A denominator-dependent feature is READY only when the exact exchange/product/denominator/unit lane is complete for its required sessions.

### Missing-date rule

Monthly or current snapshots may reconcile a daily archive but may NOT silently fill a missing daily point-in-time denominator.
If a daily denominator date is missing and no independently time-stamped authoritative version proves continuity across that date:
`DENOMINATOR_COVERAGE_UNKNOWN`.

### Governance

Research/Shadow evidence only.
No Worker.js wiring.
No Formal A/B/ranking/threshold/monitor/push change.
No production deployment.
