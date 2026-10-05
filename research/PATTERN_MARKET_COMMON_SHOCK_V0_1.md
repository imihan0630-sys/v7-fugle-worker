# D01 DL-041 — Cross-Sector Pattern Replication vs Market-Wide Common Shock / Beta V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MARKET_COMMON_SHOCK_FIREWALL / SDA_001_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-040 separated Pattern representation from sector/industry composition.

DL-041 addresses the next dependence layer:

> A Pattern can appear across many sectors on the same date because one market-wide shock, beta exposure or regime move drove all of them.

Many sectors on one market date are not automatically many independent replications.

No economic outcome is opened in D01.

## 2. Evidence context

Taiwan evidence motivates a market-common-factor control:
- decomposition research reports a large market-wide component in Taiwan stock-return fluctuation;
- Taiwan momentum evidence shows continuation/reversal depends materially on market-state transitions.

More generally, cross-sectional dependence literature shows common shocks can invalidate row-level independence.

Therefore D01 must separate:
- stock observations;
- sector-date clusters;
- market-date clusters;
- independent market/regime episodes.

## 3. Ownership boundary

D01 consumes rather than recreates:

D09:
- market breadth / market participation context;
- sector context from DL-040.

D18:
- ex-ante market regime / strategy-regime interaction context.

D19:
- market factor / beta / asset-pricing factor controls;
- factor-model and benchmark definitions.

D16:
- dependence-aware inference / residualization / clustering.

D01 does not:
- estimate a new production beta;
- choose a factor model from Pattern outcomes;
- redefine market regime;
- choose the best benchmark after outcomes.

## 4. Three timing layers

### A. PRE_SIGNAL_MARKET_CONTEXT

Available no later than predictorFreezeAt:
- market trend / breadth state;
- ex-ante regime receipt;
- PIT beta / factor-exposure receipt;
- volatility/liquidity state;
- benchmark identity.

These can be baseline context.

### B. SAME_DATE_COMMON_SHOCK_CONTEXT

Market state known by the exact decision timestamp.

If the decision uses close-of-day information, a same-day close-based market context can only enter when timestamp ordering proves it was available.

Missing intraday ordering:
SAME_DATE_MARKET_CONTEXT_UNKNOWN.

### C. FUTURE_BENCHMARK_OUTCOME

Future market/sector returns over the response horizon belong to D16 outcome evaluation.

They may not enter D01 predictor manifests.

## 5. Benchmark / factor receipt contract

Required fields:
- marketBenchmarkId;
- benchmarkVersion;
- factorModelId;
- factorModelVersion;
- betaEstimateId;
- betaEstimationWindowId;
- betaKnownAt;
- betaAsOf;
- regimeOwner;
- regimeVersion;
- regimeKnownAt;
- predictorFreezeAt;
- source/version receipts.

If any required receipt is not as-of safe:
MARKET_FACTOR_CONTEXT_UNKNOWN or POST_HOC_NOT_ELIGIBLE.

## 6. No outcome-selected benchmark

Prohibited:
- choose TAIEX, equal-weight market, factor model or beta window after seeing which produces the best Pattern residual;
- select the benchmark that maximizes Pattern alpha;
- change factor model after holdout results.

A benchmark/factor family must be frozen before outcome inspection.

## 7. Future-window beta leakage

Beta/factor exposure must use only information available by predictorFreezeAt.

Prohibited:
- full-sample beta;
- forward-window beta;
- beta estimated with future returns;
- current beta backfilled into historical dates.

Any such receipt:
POST_HOC_BETA_NOT_ELIGIBLE.

## 8. Cross-sector does not equal independent market replication

Example:
- 20 Pattern stocks;
- 5 sectors;
- one broad market surge;
- one market date.

Descriptive counts:
stockObservationCount = 20;
uniqueSectorCount = 5.

Dependence counts:
marketDateClusterCount = 1.

This is:
CROSS_SECTOR_SINGLE_MARKET_SHOCK.

It is not five independent cross-sector economic replications.

## 9. Required replication counts

Future reports separately show:
- stockObservationCount;
- uniqueSymbolCount;
- uniqueStructuralRootCount;
- uniqueSectorCount;
- sectorDateClusterCount;
- marketDateClusterCount;
- independentMarketEpisodeCount;
- regimeCount.

No one count substitutes for another.

## 10. Candidate self-inclusion in market context

A candidate can contribute to:
- cap-weighted market return;
- equal-weight market return;
- market breadth.

This does not make market context an independent confirmation.

If candidate-excluded market context exists, preserve it.

If not:
MARKET_SELF_INCLUSION_UNRESOLVED.

Market context remains a control, not a new vote.

## 11. Common market context is not an independent vote

Pattern, stock trend, sector RS and market trend all use price information.

Even where market context aggregates peer securities, it remains a context/control family.

Default:
independentConfirmationAllowed = false.

SDA-001 residual validation remains required.

## 12. Cross-market-date replication

A stronger future design requires multiple market dates / episodes.

A minimum claim hierarchy:

M0 RAW_CROSS_SECTOR_PATTERN

M1 MARKET_DATE_CLUSTERED

M2 PRE_SIGNAL_MARKET_CONTEXT_MATCHED

M3 D19_BETA_FACTOR_CONTEXT_READY

M4 MARKET_AND_SECTOR_RESIDUAL_DESIGN_FROZEN

M5 INDEPENDENT_MARKET_DATE_REPLICATION_READY

These are readiness states, not success states.

## 13. Interpretation states

Q0 MARKET_COMMON_SHOCK_EXPLANATION

Q1 BETA_EXPOSURE_EXPLANATION

Q2 MARKET_REGIME_EXPLANATION

Q3 SECTOR_PLUS_MARKET_EXPLANATION

Q4 PATTERN_WITHIN_MARKET_DATE_INCREMENT

Q5 MULTI_DATE_CROSS_SECTOR_PATTERN_CANDIDATE

Q6 NOT_EVALUABLE

D01 freezes the taxonomy.
D16 assigns future evidence.

## 14. Market-regime firewall

Regime labels must come from D18 ex-ante receipts.

Prohibited:
- "Pattern worked in these dates, therefore define them as trend regime";
- merge/split regimes after seeing Pattern results;
- choose the regime taxonomy that maximizes effect.

If regime is defined from Pattern performance:
POST_HOC_REGIME_MINING.

## 15. Market-factor common support

Future Pattern/control comparison requires overlap in:
- DL-039 size/liquidity/listing age;
- DL-040 sector context;
- beta/factor exposure;
- market breadth/trend;
- volatility;
- D18 regime;
- price/tick context;
- opportunity geometry.

Disjoint beta/regime/context support:
MARKET_FACTOR_EXTRAPOLATION_PROHIBITED.

## 16. Same-date timestamp firewall

A market move observable only after the stock predictor freeze cannot become a predictor.

For each market context:
- contextObservedAt;
- contextKnownAt;
- predictorFreezeAt.

If contextKnownAt > predictorFreezeAt:
POST_HOC_MARKET_CONTEXT.

Session-date equality alone is insufficient.

## 17. Future benchmark belongs outside predictor snapshot

D01 may freeze:
- benchmark identity;
- target horizon policy;
- residualization design ID.

D01 may not store:
- future benchmark return;
- future factor return;
- future residual return;
- future Pattern response.

OUTCOME_JOIN remains CLOSED.

## 18. Common-shock cluster identity

Future D16 should define a preregistered dependence unit such as:
- marketDate;
- marketEpisode;
- regime block;
- event-date cluster.

D01 requires an explicit dependenceUnitId.

If stock rows share the same dependence unit:
they are not independent replications even if sectors differ.

## 19. Existing Formal behavior

DL-041 does not:
- change market gate;
- change sector gate;
- change ranking;
- change Top6;
- change capital;
- change BUY/ADD/REDUCE/SELL/STOP;
- add a new beta gate.

Research-only.

## 20. SDA-001 relation

SDA-001 remains active.

Future reporting must distinguish:
- raw stock Pattern rows;
- deduped PRICE_OHLC representations;
- sector-date clusters;
- market-date clusters;
- residual Pattern evidence after market/sector/price controls.

A broad market move must not become multiple confirmations through stock Pattern + sector strength + market trend.

## 21. Required manifest fields

Per research design:
- experimentId;
- targetPopulationType;
- marketBenchmarkId;
- benchmarkVersion;
- factorModelId;
- factorModelVersion;
- betaPolicyId;
- betaEstimationWindowId;
- marketContextPolicyId;
- regimeOwner;
- regimeVersion;
- dependenceUnitId;
- marketDateClusteringPolicyId;
- commonSupportPolicyId;
- outcomeJoinState;
- manifestVersion/hash.

Per parent/date:
- parentDecisionId;
- symbol;
- marketDate;
- predictorFreezeAt;
- structuralRootId;
- sectorId;
- sectorDateClusterId;
- marketDateClusterId;
- independentMarketEpisodeId;
- marketContextKnownAt;
- marketBreadthReceipt;
- marketTrendReceipt;
- betaReceipt;
- factorExposureReceipt;
- regimeReceipt;
- marketSelfInclusionState;
- DL-039 receipt;
- DL-040 receipt;
- source/provenance receipts.

No future outcome field.

## 22. Current decision

MANY_SECTORS_ONE_DATE_EQUALS_INDEPENDENT_REPLICATION =
FALSE.

MARKET_CONTEXT_EQUALS_INDEPENDENT_CONFIRMATION =
FALSE.

FUTURE_WINDOW_BETA_ALLOWED =
FALSE.

OUTCOME_SELECTED_BENCHMARK_ALLOWED =
FALSE.

PATTERN_PERFORMANCE_CAN_DEFINE_REGIME =
FALSE.

FUTURE_BENCHMARK_RETURN_IN_PREDICTOR =
FALSE.

MARKET_SELF_INCLUSION_PROVES_CONFIRMATION =
FALSE.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

ECONOMIC_VALIDATION_OWNER =
D16.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic market-context timing / factor-receipt / replication-cluster helper plus adversarial tests.
2. Preserve stock, root, sector-date, market-date and independent market-episode counts separately.
3. Consume D09 / D18 / D19 receipts without redefining their taxonomies or factor models.
4. Hand M0-M5 / Q0-Q6 dependence-aware residual inference to D16.
5. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual evidence, system lineage and independent 00 closure.
6. Next D01 science: separate local Taiwan market common shocks from global overnight / cross-market transmission so gap-open Pattern clusters are not attributed automatically to local chart structure.
7. No outcome join / no runtime wiring / no Formal change.
