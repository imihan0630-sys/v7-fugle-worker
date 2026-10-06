# S2-07 Par-Value Source Divergence V0.6 Physical Receipt

Date: 2026-10-06 Asia/Taipei
Scope: BUILD_LANE / research-only / readonly diagnostic
Formal Core: LOCKED
Trading authority: NONE

## Execution

- Trigger merge: `97cd68011fd6a938d39a23b77e1eafb43404b269`
- Workflow: `System2 S2-07 Par-Value Divergence V0.6 Readonly`
- Run: `37479166318`
- Job: `112322457257`
- Conclusion: PASS
- Dedicated V0.6 unit test: PASS
- Read-only boundary guard: PASS

## Physical summary

- eventCount = 4
- yearAllSubsetOfMonthUnionCount = 4
- monthOnlyRowCount = 4
- MONTH_ONLY_RECURRING_NOTICE_COPY = 3
- MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE = 1
- cancellationDisclosureObservedCount = 0
- noCancellationCertifiedCount = 0
- sourceSemanticsCertified = false
- monthShardCoverageComplete = false
- promotionLinkageEstablishedCount = 0
- knownAtVersionClockCertified = false
- technicalContinuityCertified = false
- tradingAuthority = false

## Row-level dispositions

### 6949 / 2026-09-07

- source: TWSE_PAR_VALUE_CHANGE_REFERENCE
- official event version: `S2-CA-EVENT:e3021a942af960f7b19e17a815728541325d4dc9eb1604277b25cbaf29d839da`
- official detail dates: 2026-08-27, 2026-09-07
- year-family rows: 4
- month-union family rows: 5
- onlyYear: 0
- onlyMonth: 1
- month-only key: `2026-09-01|07:00:03|1`
- classification: `MONTH_ONLY_RECURRING_NOTICE_COPY`
- row text is a face-value-change recurring announcement with explicit announcement-period wording.
- cancellation state: `CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE`

### 8937 / 2026-04-13

- source: TPEX_PAR_VALUE_CHANGE_REFERENCE
- official event version: `S2-CA-EVENT:a6273022d645b3f2714cd5008d185d53d71513a7539932a81efe69db05225587`
- official detail dates: 2026-04-01, 2026-04-13
- year-family rows: 5
- month-union family rows: 6
- onlyYear: 0
- onlyMonth: 1
- month-only key: `2026-04-01|07:00:03|1`
- classification: `MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE`
- the month-only disclosure date equals the first official detail date / stop-trading date candidate.
- cancellation state: `CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE`

### 5904 / 2026-08-10

- source: TPEX_PAR_VALUE_CHANGE_REFERENCE
- official event version: `S2-CA-EVENT:00243da6189f76f45bea40739f9ae88ecd8e192500b5274e6d9a80a4b0545add`
- official detail dates: 2026-07-30, 2026-08-10
- year-family rows: 9
- month-union family rows: 10
- onlyYear: 0
- onlyMonth: 1
- month-only key: `2026-08-01|07:00:03|1`
- classification: `MONTH_ONLY_RECURRING_NOTICE_COPY`
- cancellation state: `CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE`

### 4747 / 2026-08-31

- source: TPEX_PAR_VALUE_CHANGE_REFERENCE
- official event version: `S2-CA-EVENT:3aaf54997198d7f248564b7a37adf8ab12e85b6ece9eb9f094fa7bd4b59db1eb`
- official detail dates: 2026-08-20, 2026-08-31
- year-family rows: 5
- month-union family rows: 6
- onlyYear: 0
- onlyMonth: 1
- month-only key: `2026-08-01|07:00:03|1`
- classification: `MONTH_ONLY_RECURRING_NOTICE_COPY`
- cancellation state: `CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE`

## Interpretation boundary

This run resolves the four V0.5 PAR_VALUE_CHANGE divergences at row/provenance classification level only.

It does **not** certify that:
- year=all is complete;
- bounded month shards are complete;
- recurring / stop-date rows may be discarded;
- cancellation did not occur;
- promotion-grade event linkage is established;
- exact knownAt is certified;
- technical continuity or symbol-session continuity is certified;
- any trading authority exists.

All four month-only rows remain preserved lineage. Cancellation absence remains NOT CERTIFIED.

## Exact continuation

1. Freeze a promotion-evidence contract for the bounded event-specific candidates that does not rely on normalized subject stem.
2. Evaluate the 13 V0.5 exact action-family events against that contract.
3. Keep the four V0.6 source-divergence cases out of promotion-grade linkage unless a later source-semantic certification explicitly resolves their lineage.
4. Continue shared suspension/resumption + symbol-session integration.
5. Continue RAW A1 lineage.
