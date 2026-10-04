# Asset Pricing / Factor Investing Checkpoint

Updated: 2026-10-04 Asia/Taipei
Scope: D19｜資產定價／因子投資／市場異象
Status: RESEARCH_ACTIVE / ALL_15_ACTIVE_MODULES_L2 / FACTOR_LAYER_RECEIPT_ADAPTER_IMPLEMENTED / REAL_TWSE_SMOKE_PASS_NEGATIVE_L3_GATE / FORMAL_CORE_UNCHANGED

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

## Stage 7 completed on 2026-10-04
- PR #439 merged to main as `76f5ef80dbf0654a033a0a780b065ebfabbf0e30`.
- Research-only D19 factor-layer receipt adapter is implemented with deterministic six-layer receipts and fail-closed tests.
- System2 Research CI `37165603677`: PASS.
- V8 Regression `37165603710`: PASS.
- Real official-source D19 smoke `37165603790`: PASS_NEGATIVE_L3_GATE; System1 production isolation PASS.
- TWSE physical witness covered 2026-08-03..2026-08-31, 21 official sessions, full-market source rows=22,810; bounded 2330/2454 receipt chain complete.
- TPEx physical source failed closed: both primary and legacy transports returned HTTP 520 on 2026-08-03; no data were fabricated.
- D19 maturity remains 40.0%. No L3 promotion.

## Current L3 blockers for first D19-04 replay
1. BOUNDED_UNIVERSE_NOT_HISTORICAL_REGISTRY.
2. CORPORATE_ACTION_CONTINUITY_UNVERIFIED.
3. INDUSTRY_NEUTRALIZATION_NOT_PROVEN.
4. D03_D09_REDUNDANCY_NOT_PROVEN.
5. COST_PROVENANCE_MODELED_TRANSPORT_ONLY.
6. TPEX_OFFICIAL_HISTORICAL_SOURCE_UNAVAILABLE.

## Exact next continuation
1. Replace bounded witness membership with an actual date-vintaged historical-universe registry snapshot/receipt.
2. Bind corporate-action continuity evidence to the exact replay bars without rewriting raw history.
3. Diagnose and physically revalidate an official TPEx historical transport; remain UNKNOWN/SOURCE_UNAVAILABLE until successful.
4. Add date-vintaged industry membership and industry neutralization.
5. Run paired D03/D09 redundancy controls on the same PIT dates/universe.
6. Replace engineering cost placeholder with a versioned D14-compatible research cost scenario and explicit provenance quality.
7. Re-run D19-04. Only a zero-blocker deterministic Taiwan PIT replay can trigger an L3 readiness review; no automatic promotion.
8. D19-07 remains L2 until benchmark/beta-estimation semantics are executable; raw volatility alone is insufficient.
