# Room09 D12/D13 native-parent and revision-lineage evidence — 2026-10-04

Status: RESEARCH_ONLY / CLASS_A_SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION
Observed main before write: 14c24a52e83c294a39a714a4dc8f99c06177d344
Room: 09｜衍生品與國際總經研究室
Domains: D12, D13

## D12 — one real TAIFEX TXO raw daily parent

An isolated read-only GitHub Actions branch fetched the official TAIFEX option historical download endpoint directly:

- source: https://www.taifex.com.tw/cht/3/optDataDown
- query date: 2026/10/02
- contract: TXO
- download type: 1
- workflow run: 37190172432
- job: 111400511150
- raw byte count: 567,774
- raw SHA-256: 61574590f9c8a1c882616f89090d39cbd44e00a91bd93055ff046ff4ab287c2a
- decode: strict CP950 PASS
- raw persisted to repository: NO
- formal decision impact: NONE

Observed parent statistics:

- rows: 6,086
- date identity: all 2026/10/02
- contract identity: all TXO
- regular-session rows: 3,204
- after-hours rows: 2,882
- Call rows: 3,043
- Put rows: 3,043
- expiry identities: 10
- eligible two-sided midpoint rows under frozen Surface Method V0.1: 3,337 / 6,086 = 54.8308%
- missing-side rows: 2,749
- zero-bid rows after missing-side separation: 0
- crossed rows: 0
- regular session: eligible midpoint 2,957; missing side 247
- after-hours: eligible midpoint 380; missing side 2,502
- same strike/expiry/session Call-Put common-support pairs with eligible midpoints: 1,411
- regular common-support pairs: 1,355
- after-hours common-support pairs: 56

Observed trimmed nonblank header labels include:
交易日期、契約、到期月份(週別)、履約價、買賣權、開盤價、最高價、最低價、收盤價、成交量、結算價、未沖銷契約數、最後最佳買價、最後最佳賣價、歷史最高價、歷史最低價、是否因訊息面暫停交易、交易時段、漲跌價、漲跌%、契約到期日。

The CSV parser reported 22 header slots because the source has a trailing/blank header position; this must not be silently collapsed when validating raw schema identity.

### Interpretation

This completes the previously missing real-parent/hash observation for historical replay QA. It does not establish an 18:10 first-known option state. The daily file is a later-retrieved official historical parent.

The source also falsifies an assumption that regular and after-hours quote quality are interchangeable. On this date, regular-session usable two-sided midpoint coverage is materially greater than after-hours coverage. Session-specific quality must be retained; no pooled surface should silently combine them.

This is source/method evidence only. No return outcomes were inspected and no L3 promotion follows.

## D13 — lossless CBC native BOP revision chain

An isolated read-only GitHub Actions workflow downloaded official native CBC XLSX annexes and parsed worksheet XML losslessly without recalculation or spreadsheet-library transformation. Raw files were temporary and not committed.

### 2025-11-20 release

- official XLSX: https://www.cbc.gov.tw/tw/dl-221111-6c79246bfe494155ba64f83bdb2dc4c9.html
- bytes: 35,729
- SHA-256: 0b81830e6fb5b24c7acb1bfa5b7d90f6eaa02a13980e67bf06bef4a0c02f064a
- worksheet 3, 2025 Q2 row marker: 2r
- current account: 367.59 USD100m

Therefore the original 2025-08-20 Q2 value 362.29 had already been revised by 2025-11-20.

### 2026-02-26 release

- official XLSX: https://www.cbc.gov.tw/tw/dl-224948-5cb3dfea5e384af2b166d07cd4550d28.html
- bytes: 35,744
- SHA-256: b06555d1f3c3bcfa6caf324ab06cf0708939e9f053aed57852ce12f3dd89f0cf
- worksheet 3, 2025 Q2 row marker: 2r
- current account: 363.27 USD100m

The revision did not move monotonically toward the later endpoint.

### 2026-05-20 release

- official XLSX: https://www.cbc.gov.tw/tw/dl-225493-64ee6143a2174c58ada73a0c19b33318.html
- bytes: 31,636
- SHA-256: 2161dcb4bc08c43de3a3cec5bccc3dc2810ed77c30f75bc63da59296f47673eb
- worksheet 2, 2025 Q2 row marker: 2r
- current account: 363.50 USD100m

### 2026-08-20 release

- official XLSX: https://www.cbc.gov.tw/tw/dl-227448-9f14a6738d8f498c9ab6453040260445.html
- bytes: 35,716
- SHA-256: 989a9a5f322577097696bea6ff5826ba76d0fb179cccfeb1c3f0b6ed59544263
- worksheet 3, 2025 Q2 row marker: 2r
- current account: 372.01 USD100m

### Proven revision path

Native quarterly publication vintages now establish:

362.29 (2025-08-20 original)
→ 367.59 (2025-11-20)
→ 363.27 (2026-02-26)
→ 363.50 (2026-05-20)
→ 372.01 (2026-08-20).

The path is non-monotonic. A revision is therefore a versioned state path, not simply an original/final pair.

The first-public date of the exact 372.01 value is bounded to:
after 2026-05-20 and no later than 2026-08-20,
unless a more granular official intermediate publication/database revision receipt proves an earlier date.

Do not state that 372.01 was known on the 2025Q2 reference date or on any earlier release. Do not treat revision magnitude as contemporaneous macro surprise.

## Falsification and governance

- D12 historical parent/hash evidence does not satisfy prospective decision-time PIT evidence.
- D12 regular and after-hours quote quality are not interchangeable.
- D13 revised historical values are not immutable observations.
- D13 revision direction is non-monotonic; interpolation between releases is invalid.
- Missing intermediate publication evidence remains UNKNOWN.
- No outcomes were inspected.
- No trading signal, stock eligibility, rank, capital, monitoring or push behavior changed.
- D12 remains 40.0%; D13 remains 41.1%.
- Formal Core remains LOCKED.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Exact next continuation

1. D12: use the same 2026-10-02 official parent in a source-only parity/common-support audit. Freeze a separately versioned parity-derived forward/discount-factor QA method before implied-volatility surface calculations.
2. D12 H11: only after parity/forward identity is defensible, compare D12-07 simple skew/term and D12-16 surface features on identical eligible parent rows; record real divergent states and quality sensitivity.
3. D13: search official evidence between 2026-05-20 and 2026-08-20 only if needed to narrow first-public 372.01 further. Do not assume daily database history is an immutable publication vintage.
4. Continue prospective source-attested dates separately. No L3/OOS/Formal promotion from these historical/replay artifacts.
