# Asset Pricing / Factor Investing Checkpoint

Updated: 2026-10-04 Asia/Taipei
Scope: D19｜資產定價／因子投資／市場異象
Status: RESEARCH_ACTIVE / D19-01_TO_D19-16_ACTIVE_L2 / FACTOR_LAYER_PIT_ADAPTER_SPEC_DEFINED / EXECUTABLE_RECEIPTS_REQUIRED / FORMAL_CORE_UNCHANGED

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
- All 15 active D19 modules: L2 / 40% each (D19-14 retired/merged into D19-13 and is not an active denominator item).
- Current D19 curriculum denominator: 15 active modules.
- D19 domain simple-average maturity: 40.0%.
- Formal optimization candidate: NO.
- Formal Core: unchanged.

## Stage 4 completed on 2026-10-03
- D19-07 Low Volatility／Low Beta低波動低Beta因子 -> L2 / 40%.
  - Separated total volatility from market beta and from D04 volatility research.
  - Recorded leverage/benchmark-demand mechanisms and Taiwan funding-liquidity regime reversal risk.
  - Frozen rule: no blanket low-volatility or low-beta bonus.
- D19-08 Idiosyncratic Volatility特質波動異象 -> L2 / 40%.
  - Residual volatility is model-relative; required controls include size, beta, total volatility, liquidity, industry, momentum/MAX-like effects and short-sale constraints.
  - Governance remains research-only / residual alpha unproven.
- D19-09 Residual Momentum／Factor Neutralization殘差動能與因子中性化 -> L2 / 40%.
  - Distinguished time-series residualization from cross-sectional neutralization.
  - Recorded omitted-factor contamination, model sensitivity and sequential-orthogonalization order dependence.
  - Taiwan evidence supports research value but does not establish dominance or independence.
- D19-10 Factor Exposure／Multicollinearity因子曝險與共線性 -> L2 / 40%.
  - Frozen anti-double-count governance: prediction ability is not proof of independent factor value.
  - New factors require spanning/residual/OOS incremental evidence after existing-factor controls.
- Existing System2 historical cold infrastructure preserves observedAt, availableAt, barHash, provenance and survivorship-controlled registry semantics, but D19 still lacks factor-layer PIT receipts.
- No L3 promotion in Stage 4.

## Stage 5 completed on 2026-10-03
- D19-11 Factor Crowding／Capacity／Turnover因子擁擠容量與換手 -> L2 / 40%.
  - Crowding requires observable shared positioning/flow/liquidity evidence; popularity alone is not crowding.
  - Capacity is implementation-specific and must be estimated from turnover, spread, impact, participation rate, execution horizon and stressed liquidity.
  - No direct PIT crowding evidence means UNKNOWN/proxy-only, not a negative score.
- D19-12 Seasonality／Calendar Anomalies季節性與日曆異象 -> L2 / 40%.
  - Taiwan literature documents calendar patterns, but effects are sample-, institution- and test-definition-sensitive and may decay or reverse.
  - All calendar hypotheses require preregistration, actual trading-calendar vintages, multiple-testing control and cost-adjusted OOS evidence.
  - Governance remains research-only / high-data-mining-risk.
- No L3 promotion in Stage 5.

## Stage 6 completed on 2026-10-04
- D19-13 Relative Value／Pairs Trading／Cointegration／Residual Mean Reversion -> L2 / 40%.
  - Locked as a strategy-specific family, not a generic long-only vote.
  - Taiwan evidence and counterevidence emphasize structural breaks, cost, pair overlap, short-leg executability and multiple testing.
- D19-15 Index／Benchmark Construction／Methodology -> L2 / 40%.
  - Benchmark vintage is part of the model; current constituents/weights cannot reconstruct historical alpha/beta.
  - Benchmark receipt requirements are defined.
- D19-16 Liquidity Premium／Illiquidity Factor -> L2 / 40%.
  - Taiwan evidence is measure-sensitive; direct illiquidity-risk interpretation is contradicted by evidence that Amihud pricing can be volume/mispricing-dominant under price limits.
  - Residual liquidity premium remains research-only.
- D19 factor-layer PIT adapter V0.1 research contract defined above existing System2 cold replay.
- Repository audit confirms the six D19 receipt types are not yet implemented in code.
- No L3 promotion in Stage 6.

## Exact next continuation
1. Implement a research-only D19 factor-layer PIT receipt adapter above the existing System2 cold loaders/PIT replay; do not fork existing PIT/universe logic.
2. First executable smoke slice: D19-04 cross-sectional momentum + D19-07 low-volatility/low-beta using existing PIT daily bars/universe membership.
3. Minimum deterministic chain: universeReceipt -> returnReceipt -> factorInputReceipt -> neutralizationReceipt -> costReceipt -> replayReceipt.
4. Add fail-closed tests for missing availableAt/firstKnownAt, revision ambiguity, overlapping membership, benchmark-vintage conflicts, UNKNOWN required inputs, non-borrowable/UNKNOWN short legs, and identical-input rerun hashes.
5. Do not promote any D19 module to L3 until an executable Taiwan replay on at least one frozen historical date/universe produces verified deterministic receipts.
6. Accounting-heavy D19-03/05/06 remain after first-known financial ingestion is available.
