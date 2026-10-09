# BR-083 — D09-01 2026 TPEx Effective-Dated Industry Reclassification Control V0.1

Status: RESEARCH_ONLY / CURRENT_YEAR_EFFECTIVE_DATED_CLASSIFICATION_WITNESS / CROSS_MARKET_CONTROL / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-01
Date: 2026-10-09 Asia/Taipei
Observed main before write: 402f01e11790caa5e49a5ee3b5414b7ecbd43ff7

## Official source

TPEx announcement dated 2026-05-19 / ROC 115-05-19:
https://www.tpex.org.tw/storage/eb_data/11505/11502011171.html

Effective date: 2026-06-01.

## Reclassification set

Thirteen TPEx-listed companies changed official industry category:

1. 1595 川寶: 電子零組件 -> 半導體
2. 2230 泰茂: 電機機械 -> 居家生活
3. 3067 全域: 其他電子 -> 居家生活
4. 3131 弘塑: 其他電子 -> 半導體
5. 3313 斐成: 其他 -> 建材營造
6. 4905 台聯電訊: 通信網路 -> 生技醫療
7. 4924 欣厚: 電腦及週邊設備 -> 綠能環保
8. 5381 光譜: 電子零組件 -> 電機機械
9. 6125 廣運: 光電 -> 電機機械
10. 6163 華電聯網: 通信網路 -> 資訊服務
11. 6236 中湛: 其他 -> 數位雲端
12. 7718 友鋮: 鋼鐵 -> 電機機械
13. 8932 智通科創: 其他 -> 數位雲端

## PIT contract

For dates before 2026-06-01, the pre-change category remains the valid official classification state.
For dates on/after 2026-06-01, the new category is valid unless superseded by a later official change.

Permanent rules:
- CLASSIFICATION_ANNOUNCED_AT != CLASSIFICATION_EFFECTIVE_AT;
- CURRENT_INDUSTRY_LABEL_CANNOT_BE_BACKFILLED_BEFORE_EFFECTIVE_DATE.

## Research impact

These migrations can alter category-conditioned measures including Sector RS, Residual RS peer set, sector breadth, Above-MA breadth, leader concentration, sector rank/lifecycle and theme-sector overlap diagnostics.

Concrete examples:
- 1595 and 3131 join semiconductor only from the effective date;
- 4905 leaves communication-network and joins biotech/medical;
- 6125 leaves optoelectronics and joins electrical machinery.

Any historical replay spanning 2026-06-01 must split the membership vintage at that boundary.

## Cross-market implication

D09 classification lineage cannot be treated as TWSE-only. TPEx official reclassification is a separate authoritative membership lane and must be versioned independently before a combined Taiwan sector universe is constructed.

## Maturity

D09-01 remains L3 / 60%.

This improves current-year effective-dated cross-market replay semantics, but L4 still requires prospective/OOS cohort evidence and complete machine-readable historical membership lineage across the studied universe.

## Exact next

Maintain append-only TWSE and TPEx classification vintages with separate announcedAt/effectiveFrom/effectiveTo fields. On any new classification announcement after this freeze, capture it prospectively before the effective date and verify downstream Sector RS/Residual RS/breadth computations use the correct membership version without opening forward outcomes.

Formal Core unchanged.
