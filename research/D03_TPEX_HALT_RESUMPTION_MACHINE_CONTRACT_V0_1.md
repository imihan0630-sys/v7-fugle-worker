# D03 TPEx Halt/Resumption Machine Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03 / shared TECHNICAL_CONTINUITY / TPEx symbol-session evidence
Status: RESEARCH_ONLY / FRONTEND_ACTION_OBSERVED / MACHINE_PAYLOAD_PARTIAL_UNKNOWN
Formal Core: LOCKED

## 1. Scope

This artifact records a bounded read-only discovery of the official TPEx historical halt/resumption surface. It does not certify all corporate actions, all historical years, archive completeness, publication latency or technical continuity.

## 2. Physical public-surface evidence

Official page:
`https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html`

Physically observed controls:
- `date` year selector, public UI values ALL and 2020 through 2026;
- `cate` security-category selector;
- category 1 = mainboard stock;
- category 2 = emerging stock;
- category 6 = strategic board;
- category 3 = warrant;
- category 4 = convertible/exchangeable bond;
- category 5 = TDR;
- HTML export;
- CSV download.

The form metadata also exposes `data-start=20201201`. That is a front-end control boundary, not proof that every row since that date is complete.

## 3. Physical front-end action evidence

The page's inline executable initializes the table with:
- `action="bulletin/sprcHis"`;
- `autoLoad=true`;
- `autoChange=false`;
- sortable rows;
- page size 10.

This verifies the action name and intended arguments. The runtime value of `API_PATTERN` was not observable, so the final transport URL remains unresolved.

## 4. Counterevidence

A candidate read-only request following the common TPEx `/www/zh-tw/` route shape with `date=2025`, blank `cate` and `response=json` returned `HTTP 520` in this environment. The official page showed no rows in the same observation.

Interpretation:
- transport failure is not an empty dataset;
- a front-end action name is not a stable endpoint contract;
- a visible CSV control is not a captured CSV artifact;
- no row schema, key, count or chronology may be fabricated.

## 5. Current state

`TPEX_OFFICIAL_HALT_SURFACE=OBSERVED`
`TPEX_FRONTEND_ACTION_AND_PARAMETERS=PHYSICALLY_OBSERVED`
`TPEX_MACHINE_RESPONSE_CONTRACT=PARTIAL_UNKNOWN`
`TPEX_SOURCE_LOCAL_EMPTY_SEMANTICS=UNKNOWN`
`TPEX_REVISION_CHRONOLOGY=UNKNOWN`
`TPEX_TECHNICAL_CONTINUITY_CERTIFIED=false`.

## 6. Acceptance contract for the next successful capture

Require all of:
1. official origin URL and final resolved endpoint;
2. frozen year/category arguments;
3. response status, headers and raw-byte checksum;
4. schema and row count;
5. stable row key and duplicate count;
6. page-size-10 union versus unpaged/CSV keyset reconciliation where supported;
7. bounded positive control;
8. source-local empty control;
9. immutable firstObservedAt;
10. explicit separation of halt/resumption from corporate-action cause and effective-date evidence.

## 7. D03 boundary

The discovery materially narrows the blocker but does not promote D03-10 Bollinger or D03-09 ADX. D03 remains 56.7%. Formal Core remains LOCKED.
