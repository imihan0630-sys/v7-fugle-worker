# Corporate Action RS Benchmark Source Contract

Updated: 2026-09-25 Asia/Taipei
Status: RESEARCH_ONLY / OFFLINE_SOURCE_CONTRACT
Formal Core: LOCKED

## Purpose

Provide reproducible official benchmark inputs for Shadow comparison of:
- legacy raw-price RS;
- Price-Index-Comparable RS;
- Total-Return-Comparable RS.

No runtime dependency is authorized.

## Official price-index source

Provider: TWSE
Current Formal report: FMTQIK
Required field: 發行量加權股價指數

Use this as the benchmark for:
- LEGACY_RS;
- PRICE_INDEX_COMPAT_RS.

Do not replace the current Formal source in this contract.

## Official total-return source

Provider: TWSE
Report: MFI94U
Description: 發行量加權股價報酬指數
Official OpenAPI catalog path:
/indicesReport/MFI94U

Use this as the benchmark for:
- TOTAL_RETURN_RS.

## Monthly source retrieval

For each target date T:
1. identify the month containing T and the month containing the stock return start date;
2. collect official TWSE monthly records for all required months;
3. normalize ROC dates to YYYY-MM-DD;
4. retain exact official close values;
5. preserve source URL, fetchedAt and payload/file hash where available.

Do not use a third-party index value when the official record is available.

## Coverage rules

A benchmark return is READY only when:
- target date exists exactly;
- stock return-start date exists exactly;
- dates are valid trading dates;
- no duplicate date exists;
- no future date enters the target-date record;
- both endpoints required by the selected mode are available.

Do not:
- interpolate;
- carry forward;
- substitute nearest trading day unless the stock return itself uses that exact same date;
- treat missing as zero.

## Return definition

For exact dates startDate and targetDate:

priceIndexReturn =
  TAIEX_PRICE(targetDate) / TAIEX_PRICE(startDate) - 1

totalReturnIndexReturn =
  TAIEX_TOTAL_RETURN(targetDate) / TAIEX_TOTAL_RETURN(startDate) - 1

The same exact startDate used by the stock 20-day return must be used by the benchmark.

## Shadow join

Per symbol/date store:
- returnStartDate;
- targetDate;
- priceIndexStart;
- priceIndexEnd;
- priceIndexReturn;
- totalReturnIndexStart;
- totalReturnIndexEnd;
- totalReturnIndexReturn;
- priceCoverageReady;
- totalReturnCoverageReady;
- sourceProvenance;
- unknownReasons.

## Validation gates

Before first RS inference:
1. cross-check several historical MFI94U monthly pages manually against parsed records;
2. verify ordering and ROC-date conversion;
3. verify target-date pairing with current FMTQIK history;
4. verify no-action stock windows preserve expected Legacy/Price-Compat equality;
5. verify cash-dividend windows produce the intended semantic difference;
6. record independent market dates and missingness.

## Governance

This contract does not:
- change V7_OFFICIAL_INDEX;
- change Formal relativeStrength;
- change priorityScore;
- change ranking;
- change Top3/Top6;
- add a production Worker fetch.

Any future Formal RS benchmark/definition change requires separate owner decision.

Research-only offline ingestion is permitted if isolated from Production.


## Validated machine contracts — 2026-09-25

Current-month official OpenAPI endpoints were live-validated:
- https://openapi.twse.com.tw/v1/exchangeReport/FMTQIK
- https://openapi.twse.com.tw/v1/indicesReport/MFI94U

Historical monthly exact-date contracts were also live-validated:
- https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=YYYYMM01&response=json
- https://www.twse.com.tw/rwd/zh/TAIEX/MFI94U?date=YYYYMM01&response=json

Validated historical months:
- 2025-10;
- 2025-11;
- 2025-12;
- 2026-06;
- 2026-07.

The monthly payloads return exact trading-date rows and therefore satisfy the required exact-date join contract when the requested stock return start/end dates are present.

### Important distinction
The no-parameter OpenAPI endpoints expose the current monthly set and are suitable for prospective archiving/current validation.

Historical replay should use the explicit monthly historical query contract, preserving the query month and retrieval provenance.

### First semantic diagnostic
research/corporate_action_rs_semantic_sample_v0_1.json now stores four mechanics-only RS comparisons.

The sample demonstrates that raw Legacy RS can be dominated by corporate-action mechanics around capital reduction/par-value events, while ordinary cash-dividend Price-Compatible RS intentionally remains aligned with raw price return.

This is semantic evidence only, not evidence that one RS mode has superior future alpha.
