# D03 TPEx Halt/Resumption Machine Contract V0.2

Updated: 2026-10-04 Asia/Taipei
Lane: D03 / shared TECHNICAL_CONTINUITY / TPEx symbol-session evidence
Status: RESEARCH_ONLY / BOUNDED_PHYSICAL_PASS
Formal Core: LOCKED

## Purpose

Supersede V0.1's PARTIAL_UNKNOWN machine transport state with physically observed official machine semantics.

No trading outcome, production history mutation, System 1 runtime use or selection authority is introduced.

## TI-594 — exact official machine route is physically resolved

Official page:
`https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html`

Official executable source:
- `main.js` freezes `API_PATTERN=/www/{LANG}/{ACTION}`;
- page freezes `action=bulletin/sprcHis`;
- resulting official route:
  `https://www.tpex.org.tw/www/zh-tw/bulletin/sprcHis`.

The page does not enable server-side paging. Its table configuration uses display page size 10 while the table loader default is `serverPaging=false`.

Therefore visible 10-row pages are client-side presentation, not evidence that the machine response is truncated to 10 rows.

## TI-595 — bounded positive JSON control physically passes

Read-only workflow:
`Research TPEx Halt Machine Contract Readonly`

Physical run:
`37182021741`

Frozen query:
- date = 2026;
- cate = 1 / 上櫃股票;
- response = json;
- method = POST.

Result:
- HTTP 200;
- content-type `application/json;charset=UTF-8`;
- raw bytes = 2169;
- SHA-256 = `184c07e8cfd61f20a8cbf65ab49d2ab86ddac276da450eeed3938ec08c2ffe18`;
- `stat=ok`;
- one table;
- `totalCount=30`;
- returned rows = 30.

Fields:
1. 編號
2. 有價證券類別
3. 有價證券代號
4. 有價證券名稱
5. 暫停交易日期
6. 暫停交易時間
7. 恢復交易日期
8. 恢復交易時間

Observed first rows include 1788 杏昌 halt and resumption records and 1799 易威.

## TI-596 — CSV export is keyset-equivalent to JSON

Same bounded control through official CSV export:
- HTTP 200;
- content-type `application/csv;charset=MS950`;
- raw bytes = 1880;
- SHA-256 = `e0c325a2968ef26ffbb75af495f17949c02ffaa0109ad89c3fd26684d701e76b`;
- filename `OWZ97U_115.csv`.

After removing presentation sequence number:
- JSON rows = 30;
- CSV data rows = 30;
- JSON unique keys = 30;
- CSV unique keys = 30;
- JSON-only = 0;
- CSV-only = 0;
- duplicates = 0.

`JSON_CSV_KEYSET_EQUIVALENCE=PASS`.

This is a bounded transport/population reconciliation, not a universal all-years completeness proof.

## TI-597 — source-local empty semantics physically pass

Frozen negative controls returned:
- 2026 / category 5 TDR: HTTP 200, `stat=ok`, total 0, rows 0;
- 2026 / category 6 strategic board: HTTP 200, `stat=ok`, total 0, rows 0;
- 2020 / category 5 TDR: HTTP 200, `stat=ok`, total 0, rows 0.

Therefore within this official endpoint:
`SOURCE_LOCAL_EMPTY = STAT_OK + TOTAL_COUNT_0 + ROWS_0`.

Transport error, parse error or missing table must never be normalized to empty.

## TI-598 — bounded pagination/truncation conclusion

For the frozen 2026 mainboard control:
- machine JSON returns all 30 rows in one response;
- `totalCount` equals physical row count;
- CSV independently returns the same 30-key population;
- front-end page size 10 is client-side pagination because this page does not set `serverPaging=true`.

Therefore:
`TPEX_HALT_2026_MAINBOARD_BOUNDED_POPULATION = PHYSICAL_PASS`.

This does not prove every year/security category, but it is sufficient to replace V0.1's machine-payload UNKNOWN for this bounded contract.

## D03 continuity use

This source can support the TPEx symbol-session branch:
- verified halt;
- verified resumption;
- no pseudo-bar substitution across a verified halted symbol-session;
- exact source capture hash/time.

It does not by itself prove:
- corporate-action price-reset factors;
- all correction/version chronology;
- a complete TECHNICAL_CONTINUITY receipt.

## Current state

`TPEX_HALT_MACHINE_ROUTE = PHYSICALLY_RESOLVED`
`TPEX_HALT_JSON_BOUNDED_CONTROL = PASS`
`TPEX_HALT_CSV_EQUIVALENCE = PASS`
`TPEX_HALT_SOURCE_LOCAL_EMPTY = PASS`
`TPEX_HALT_BOUNDED_POPULATION = PASS`
`TPEX_HALT_ALL_HISTORY_COMPLETENESS = NOT_CLAIMED`
`TECHNICAL_CONTINUITY_CERTIFIED = false`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.
