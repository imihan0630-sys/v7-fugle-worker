# Asset Pricing / Factor Investing Checkpoint

Updated: 2026-10-02 Asia/Taipei
Scope: D19｜資產定價／因子投資／市場異象
Status: RESEARCH_ACTIVE / D19-01_L2 / D19-02_L2 / FORMAL_CORE_UNCHANGED

## Governance
- This file is the canonical continuation checkpoint for D19.
- Start from the latest tracker/router/main; do not restart completed work.
- Every claim requires positive mechanism, counterevidence/failure mode, PIT, replayability, data quality, redundancy, costs and System 1/System 2 incremental-value assessment.
- UNKNOWN != 0. No Formal promotion without existing governance gates and owner approval.

## Completed in Stage 1
- D19-01 CAPM／Beta／Alpha與Benchmark Residual: L2.
  - Separated market beta, benchmark-relative alpha, residual return and investable alpha.
  - Recorded Roll benchmark critique, beta-return counterevidence, low-beta anomaly, Taiwan conflicting evidence and thin-trading beta bias.
  - Defined Taiwan PIT/replay contract; no L3 promotion yet.
- D19-02 Size規模因子: L2.
  - Defined point-in-time market-cap construction and nonlinearity.
  - Recorded liquidity/profitability/investment confounding and conflicting Taiwan evidence.
  - Defined neutralization/cost/capacity tests; no L3 promotion yet.
- Formal optimization candidate: NO.
- Formal Core: unchanged.

## Exact next continuation
1. Start D19-03 Value價值因子 from theory -> mechanism -> falsification.
2. Explicitly separate valuation characteristic from a priced factor and from D08 valuation signals.
3. Build the shared Taiwan PIT source map needed to move D19-01/D19-02 from L2 to L3: universe vintage, price/return adjustments, shares outstanding, delist/suspension handling, benchmark/risk-free semantics, liquidity and cost fields.
4. After D19-03 L2, continue D19-04 Cross-sectional Momentum and test redundancy with D03/D09 before any promotion.
