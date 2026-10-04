# System 2 TWSE TWTB7U Historical Semantics V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY SOURCE CHARACTERIZATION
System 1 Formal Core: LOCKED

## Purpose

Characterize whether the official TWSE `TWTB7U` change-of-par-value announcement table can serve as a materially distinct historical evidence route for the only remaining representative-routing gap:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`.

This work does not promote a representative control.

## Why this route is materially distinct

Already exhausted or preserved negative:
- TWTB8U final-result-derived candidate search;
- historical MOPS t05st01 revision-chain search;
- MOPS U04 Company Act 252/273 announcement search.

TWTB7U is the TWSE exchange-owned **change-of-par-value announcement/forecast table**, distinct from the TWTB8U final/reference-price table.

TWSE's public change-of-par-value page identifies:
- a change-of-par-value announcement table;
- a separate reference-price/result table.

## Frozen controls

2025 historical candidates:
- 4763 / effective 2025-06-30;
- 6919 / effective 2025-07-21;
- 2327 / effective 2025-08-25;
- 8422 / effective 2025-11-17.

2026 positive transport/content control:
- 6949 / effective 2026-09-07.

No price/performance data is used.

## Probe contract

Observed endpoint family:
`https://www.twse.com.tw/exchangeReport/TWTB7U`

For each frozen control:
- query explicit compact Gregorian `date=YYYYMMDD`;
- query both `response=json` and `response=html`;
- preserve HTTP status, content type, payload hash and samples;
- detect whether the requested candidate symbol appears;
- detect whether the response carries request-date identity;
- compare historical payload hashes against the 2026 positive control.

## Fail-closed interpretation

Historical capability is not accepted merely because HTTP 200 occurs.

`TWTB7U_HISTORICAL_DATE_CAPABILITY_OBSERVED` requires:
- at least one 2025 frozen candidate symbol to appear; and
- evidence that the returned content actually respects the requested historical date.

`TWTB7U_HISTORICAL_DATE_NOT_OBSERVED` is valid when explicit historical requests collapse to one/current payload or otherwise provide no historical candidate evidence.

Any ambiguous shape remains `UNRESOLVED`.

## Promotion boundary

Always false in this artifact:
- representativeControlPromoted;
- authorityRevisionCoverageComplete;
- publicAvailabilityLatencyCertified;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.

If TWTB7U historical capability is negative, this route is preserved as another materially distinct negative path. Criteria must not be weakened to force 6/6.
