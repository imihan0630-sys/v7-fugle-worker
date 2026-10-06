# System 2 S2-07 Par-Value Source Divergence V0.6

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE DIAGNOSTIC / PHYSICAL_EXECUTION_PENDING
Formal Core: LOCKED

## Scope

V0.6 narrows only the four PAR_VALUE_CHANGE events that remained non-exact after V0.5:
- 6949 / 2026-09-07
- 8937 / 2026-04-13
- 5904 / 2026-08-10
- 4747 / 2026-08-31

It compares target-family rows from year=all against the union of bounded month shards and classifies month-only rows without discarding them.

## Divergence classes

- MONTH_ONLY_RECURRING_NOTICE_COPY: a face-value-change notice with an explicit announcement-period marker.
- MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE: a face-value-change notice whose disclosure date equals the official stop-trading date.
- UNCLASSIFIED_MONTH_ONLY_ACTION_FAMILY_ROW: any remaining month-only target-family row.

These labels are diagnostic. They do not certify source semantics or permit dropping a row from lineage.

## Cancellation semantics

Cancellation evidence is one-way:
- if a cancellation/withdrawal disclosure is observed, record positive evidence;
- if none is observed, state CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE.

Absence is never converted into NO_CANCELLATION.

## Boundary

V0.6 does not establish month-shard completeness, promotion linkage, exact knownAt, technical continuity, session completeness or trading authority.


## Physical execution acceptance

The readonly V0.6 workflow must physically observe all four frozen PAR_VALUE_CHANGE cases on latest main before any checkpoint promotion:

- 6949 / 2026-09-07
- 8937 / 2026-04-13
- 5904 / 2026-08-10
- 4747 / 2026-08-31

Required output:
- year=all target-family row count and bounded month-union target-family row count;
- exact month-only row keys and row text classifications;
- official event version id and official detail date tokens;
- positive cancellation evidence when observed, otherwise explicit history-incomplete state;
- `noCancellationCertifiedCount=0`;
- `promotionLinkageEstablishedCount=0` unless a later separately reviewed promotion contract is satisfied;
- `knownAtVersionClockCertified=false`;
- `technicalContinuityCertified=false`;
- `tradingAuthority=false`.

A PASS means the diagnostic executed and preserved fail-closed boundaries. It does not by itself certify source completeness, promotion linkage, no-cancellation, exact knownAt, session continuity, or trading authority.
