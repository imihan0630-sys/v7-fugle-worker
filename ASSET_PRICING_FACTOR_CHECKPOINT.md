# Asset Pricing / Factor Investing Checkpoint

Updated: 2026-10-03 Asia/Taipei
Scope: D19｜資產定價／因子投資／市場異象
Status: RESEARCH_ACTIVE / D19-01_TO_D19-12_L2 / FACTOR_LAYER_PIT_RECEIPTS_REQUIRED / FORMAL_CORE_UNCHANGED

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
- D19-01 through D19-12: L2 / 40% each.
- Current D19 curriculum denominator: 15 modules.
- D19 domain simple-average maturity: 32.0%.
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

## Exact next continuation
1. Start D19-13 Relative Value／Pairs Trading／Cointegration／Residual Mean Reversion相對價值／配對交易／共整合／殘差均值回歸 as a strategy-specific family, not a generic long-only factor vote.
2. Continue D19-15 Index／Benchmark Construction／Methodology指數與基準建構方法 and D19-16 Liquidity Premium／Illiquidity Factor流動性溢酬／非流動性因子; preserve current curriculum numbering and do not invent D19-14.
3. In parallel, build the first executable factor-layer Taiwan PIT replay slice for D19-01..12 on top of the existing System2 cold loader. Minimum receipt chain: universeReceipt -> returnReceipt -> factorInputReceipt -> neutralizationReceipt -> costReceipt -> replayReceipt.
4. Do not promote L3 until receipts verify universe vintage, delisted/suspended handling, first-known financials, market-cap/shares semantics, factor-set/version lineage, actual trading-calendar semantics and realistic costs.
