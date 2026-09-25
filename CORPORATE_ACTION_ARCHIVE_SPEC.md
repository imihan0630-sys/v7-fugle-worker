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
