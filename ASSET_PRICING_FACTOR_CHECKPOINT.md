# Asset Pricing / Factor Investing Checkpoint

Updated: 2026-10-02 Asia/Taipei
Scope: D19｜資產定價／因子投資／市場異象
Status: RESEARCH_ACTIVE / D19-01_TO_D19-06_L2 / PIT_SOURCE_MAP_DESIGNED / FORMAL_CORE_UNCHANGED

## Governance
- This file is the canonical continuation checkpoint for D19.
- Start from the latest tracker/router/main; do not restart completed work.
- Every claim requires positive mechanism, counterevidence/failure mode, PIT, replayability, data quality, redundancy, costs and System 1/System 2 incremental-value assessment.
- UNKNOWN != 0. No Formal promotion without existing governance gates and owner approval.

## Completed
- D19-01 CAPM／Beta／Alpha與Benchmark Residual: L2.
- D19-02 Size規模因子: L2.
- D19-03 Value價值因子: L2.
- D19-04 Cross-sectional Momentum橫截面動能因子: L2.
- D19-05 Quality／Profitability品質與獲利能力因子: L2.
  - Narrowed "quality" to auditable profitability definitions before any composite-quality claim.
  - Recorded measure sensitivity, emerging-market weakness and Taiwan five-factor mixed evidence.
  - Defined first-known accounting/PIT and redundancy contract.
- D19-06 Investment／Asset Growth投資與資產成長因子: L2.
  - Separated capital expenditure, total-asset growth and broader investment characteristics.
  - Recorded U.S. investment/asset-growth evidence and Taiwan evidence that may show opposite investment-factor sign.
  - Defined accounting-event, restatement and cross-factor redundancy contract.

## Taiwan PIT source-map status
- Official TWSE/TPEx/MOPS/CBC source roles mapped at design level.
- Known gaps: historical dataset start dates differ; pre-2011 halt coverage needs another source; delisted-universe continuity and TPEx coverage must be explicitly validated.
- TWSE Data E-Shop daily shares-outstanding product is an authoritative candidate but paid; availability is not equivalent to ingestion.
- No L3 promotion until executable PIT ingestion/replay receipts exist.

## Current maturity
- D19-01 through D19-06: L2 / 40% each.
- D19 domain simple-average maturity: 20.0%.
- Formal optimization candidate: NO.
- Formal Core: unchanged.

## Exact next continuation
1. Start D19-07 Low Volatility／Low Beta低波動低Beta因子 from theory -> mechanism -> falsification, explicitly separating it from D19-01 market beta and D04 volatility.
2. Continue D19-08 Idiosyncratic Volatility特質波動異象 in the same long block unless blocked.
3. Build a minimal executable Taiwan PIT replay slice for D19-01..06 using currently accessible sources; record source start dates and UNKNOWN gaps instead of filling them.
4. Do not promote L3 until replay receipts verify universe vintage, delisted/suspended handling, first-known financials, market-cap/shares semantics and costs.
