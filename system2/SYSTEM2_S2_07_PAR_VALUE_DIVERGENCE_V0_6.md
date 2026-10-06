# System 2 S2-07 Par-Value Source Divergence V0.6

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE DIAGNOSTIC / PHYSICALLY_VERIFIED
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


## Physical result — 2026-10-06

Authoritative execution:
- merge: `97cd68011fd6a938d39a23b77e1eafb43404b269`
- workflow: `System2 S2-07 Par-Value Divergence V0.6 Readonly`
- run: `37479166318`
- job: `112322457257`
- result: PASS

Observed:
- 4/4 year=all target-family keysets are subsets of the bounded month-union keysets;
- exactly four month-only target-family rows remain;
- three classify as `MONTH_ONLY_RECURRING_NOTICE_COPY`;
- one (8937) classifies as `MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE`;
- all four transport/no-pagination diagnostic gates passed;
- cancellation disclosures observed = 0, but `noCancellationCertifiedCount=0`;
- source semantics, month-shard completeness, promotion linkage, exact knownAt, technical continuity and trading authority remain false.

Durable receipt:
`system2/evidence/S2_07_PAR_VALUE_DIVERGENCE_V0_6_PHYSICAL_20261006.md`

Next:
promotion-evidence contract over the 13 V0.5 exact candidates, while the four V0.6 divergence cases remain non-promotion until separately source-certified.
