# Portfolio & Risk Construction Research
# 投資組合／風險配置／相關性群聚

Started: 2026-09-25 Asia/Taipei
Status: ACTIVE RESEARCH LANE
Scope: Research-only / Shadow. Formal Core unchanged.

## Existing-system audit

Current main Worker allocation:
- total capital default: NT$200,000
- max single position ratio: 35%
- deploy ratio:
  - 1 selected: 35%
  - 2 selected: 60%
  - >=3 selected: 85%
- per-stock capital weights proportional to Formal `priorityScore`
- first tranche 60%, second tranche 40%

Source audit finds no explicit:
- portfolio correlation
- covariance
- risk contribution
- sector/cluster exposure cap
- portfolio volatility target

This means current allocation controls **capital concentration**, but not necessarily **risk concentration**.

---

## PR-001 — Equal capital is not equal risk

If two positions each receive NT$50,000:
- Stock A volatility 2%/day
- Stock B volatility 6%/day

their standalone risk contributions are not equal.

Likewise two stocks with similar volatility can create high combined risk if their returns are highly correlated.

### Simplified standalone risk
`standaloneRisk_i ≈ weight_i × volatility_i`

But true portfolio risk also depends on covariance.

### Consequence
Capital allocation and risk allocation are distinct layers.

Status: FUNDAMENTAL DISTINCTION FROZEN.

---

## PR-002 — Portfolio variance depends on covariance, not only per-stock volatility

For weights vector w and covariance matrix Σ:

`portfolioVariance = w' Σ w`

Portfolio volatility:
`sigma_p = sqrt(w' Σ w)`

Two high-volatility stocks can diversify if weakly related.
Two moderate-volatility stocks can concentrate risk if nearly identical.

### System implication
A 35% single-stock cap prevents one name from dominating capital, but cannot prevent:
- 3 correlated AI-chain stocks each at 25%,
- 3 ABF/PCB names with common factor exposure,
from dominating portfolio risk together.

Status: COVARIANCE LAYER REQUIRED FOR RESEARCH.

---

## PR-003 — Marginal and component risk contribution

For volatility risk:

Marginal contribution of asset i:
`MRC_i = (Σw)_i / sigma_p`

Component contribution:
`RC_i = w_i × MRC_i`

and approximately:
`sum(RC_i) = sigma_p`.

### Why useful
Capital weight answers:
“How many dollars are in this stock?”

Risk contribution answers:
“How much of total portfolio variability is associated with this position under the covariance estimate?”

### Caveat
Risk contribution inherits all covariance-estimation errors.
Do not present it as exact future risk.

Status: RESEARCH METRIC, NOT FORMAL SIZING RULE.

---

## PR-004 — Correlations are state-dependent

Empirical literature documents higher correlations/collective behavior during many market stress/downturn periods.

Sources:
- Longin/Solnik-related downside dependence literature.
- Journal of International Money and Finance (2015), How past market movements affect correlation and volatility.
- Scientific Reports (2012), Quantifying the Behavior of Stock Correlations Under Market Stress.
- Pacific-Basin Finance Journal (2010), Asian-crisis diversification evidence.

### Important counterpoint
Not every observed rise in conditional correlations proves structural contagion; fat tails and conditioning can mechanically affect correlation measures.

Source:
- Journal of Empirical Finance (2008), Increasing correlations or just fat tails?

### Research conclusion
Use:
- normal-state correlation
- downside/stress correlation
rather than one static matrix.

Status: STRESS-CORRELATION GUARD FROZEN.

---

## PR-005 — “Diversification fails in crises” is too absolute

Evidence supports higher co-movement in many crises, but diversification is not therefore worthless.

Other research shows diversification can still provide utility/risk benefits when volatility is high even if correlations rise.

### Correct research question
Not:
“Does correlation rise?”

But:
“How much risk reduction remains, and which clusters lose diversification benefit most?”

### Candidate diagnostics
- average pairwise correlation
- downside correlation
- top eigenvalue / collectivity
- effective number of independent bets
- cluster concentration
- diversification ratio

Status: DIVERSIFICATION BENEFIT MUST BE MEASURED, NOT ASSUMED.

---

## PR-006 — Sector labels are not sufficient risk clusters

Two stocks can belong to different official industries but share:
- AI server demand
- NVIDIA/customer cycle
- PCB/ABF substrate cycle
- electronics export cycle
- USD/TWD sensitivity
- commodity input exposure.

Conversely, two firms in the same official industry can have different customers/products/geographies.

### Research approach
Build empirical return clusters from:
- rolling correlations;
- hierarchical clustering;
- PCA/factor loadings;
then compare against official sector labels.

### Guard
Clusters are unstable through time.
Do not assign permanent cluster identities from one period.

Status: DATA-DRIVEN CLUSTER LAYER CANDIDATE.

---

## PR-007 — Common-factor exposure explains hidden concentration

A stock portfolio can be decomposed approximately into exposures to:
- broad market beta;
- sector/industry;
- size;
- momentum/trend;
- volatility;
- currency/macro factors;
- thematic/common supply-chain factors.

### Research use
For selected Top6:
- estimate rolling market beta;
- sector residual correlation;
- pairwise residual correlation after market;
- common first principal component.

If raw correlation is high only because the whole market moved together, residual correlation may distinguish stock-specific coupling.

### Caveat
Short samples make factor estimates noisy.
Use multiple windows and shrinkage/robustness rather than one fitted beta.

Status: HIDDEN-FACTOR CONCENTRATION CANDIDATE.

---

## PR-008 — Downside co-movement matters more for stop-loss portfolios than ordinary correlation alone

Ordinary Pearson correlation treats up/up and down/down co-movement symmetrically.

For a trading system with stops, portfolio pain is more related to:
- simultaneous negative returns;
- simultaneous gap-downs;
- simultaneous stop hits.

Candidate metrics:
- downsideCorrelation
- jointNegativeDayRate
- jointStopHitRate
- jointLargeLossRate
- worst5pctConditionalCorrelation
- drawdownOverlap

### Caveat
Tail estimates have small samples and high noise.
Do not optimize on a handful of crisis days.

Status: DOWNSIDE-DEPENDENCE LAYER CANDIDATE.

---

## PR-009 — Covariance estimation is noisy; simple robust methods may beat fancy optimization

Sample covariance matrices become unstable when:
- history is short;
- number of assets/factors rises;
- regimes change.

Optimization can amplify small estimation errors into extreme weights.

### Preferred hierarchy for our small Top6 system
1. descriptive pairwise correlation;
2. shrinkage covariance;
3. simple cluster caps / risk diagnostics;
4. only later full optimizer research.

Do not jump directly to minimum-variance/maximum-Sharpe optimization.

### Why
Expected returns are even harder to estimate than covariance.
Formal `priorityScore` is not a statistically calibrated expected-return forecast.

Status: OPTIMIZATION RESTRAINT FROZEN.

---

## PR-010 — Volatility scaling has positive evidence, but not universal evidence

Moreira & Muir (2017) document improved Sharpe/utility from taking less exposure when volatility is high across several factors in their sample.

Source:
- Journal of Finance 72(4), Volatility-Managed Portfolios.

### Counter-evidence
A broader study of 103 strategies finds no systematic superiority of volatility-managed variants; gains are not universal and appear concentrated in subsets.

Source:
- Journal of Financial Economics, On the performance of volatility-managed portfolios.

### System implication
Do not replace current fixed capital rules with:
`weight ∝ 1/volatility`
without Taiwan/strategy-specific evidence.

Research volatility scaling as one counterfactual, not a truth.

Status: MIXED EVIDENCE / SHADOW ONLY.

---

## PR-011 — Stop-distance risk makes equal capital especially misleading

Suppose two NT$50,000 positions:

A:
- planned stop 5% below entry
- planned loss ≈ NT$2,500 before slippage

B:
- planned stop 15% below entry
- planned loss ≈ NT$7,500

Same capital, 3× planned stop risk.

### Candidate measure
`plannedRiskNTD = positionValue × |entry-stop| / entry`

Risk fraction:
`plannedRiskPctCapital = plannedRiskNTD / totalCapital`

### Important caveat
Actual loss can exceed planned stop due to:
- gap;
- limit-down;
- no liquidity;
- delayed execution.

So this is planned risk, not maximum guaranteed loss.

Status: HIGH-VALUE DESCRIPTIVE METRIC.

---

## PR-012 — Gap/limit risk breaks continuous stop-loss assumptions

Taiwan stocks can:
- gap below stop at the open;
- hit daily price limits;
- have limited executable liquidity.

Therefore “stop at X” does not mean fill exactly at X.

### Research stress cases
- 1× planned stop
- 1.5× stop loss
- 2× stop loss
- limit-down / next-session delayed exit scenarios

### Portfolio implication
Correlated negative gaps can make several stops fail simultaneously.

This connects:
- microstructure liquidity,
- derivative risk regime,
- portfolio downside dependence.

Status: STRESS-LOSS LAYER REQUIRED.

---

## PR-013 — Liquidity-adjusted position risk

A position size that is acceptable by capital/volatility can still be too large relative to executable liquidity.

Candidate diagnostics:
- positionValue / avgDailyAmount
- plannedShares / avgDailyVolume
- positionValue / conservative intraday notional
- spread/depth state for execution

For current NT$200k system this may often be small, but high-priced/thin thousand-dollar names still need validation.

### Rule
Do not use issued shares or nominal volume alone as free-float liquidity.

Status: LIQUIDITY-RISK CANDIDATE.

---

## PR-014 — First/Add/Full changes portfolio risk dynamically

Current strategy stages:
- NONE
- FIRST
- FULL
plus recovery/reduction research states elsewhere.

Portfolio risk changes when:
- first tranche enters;
- second tranche adds;
- another correlated name enters;
- a position is reduced;
- a reduced position is re-added.

### Missing portfolio state question
A second tranche may be individually valid but collectively undesirable if another correlated position was added in the meantime.

### Research-only future question
Before ADD:
- projected portfolio volatility
- projected cluster exposure
- projected planned-stop loss
- marginal risk contribution

No Formal ADD gate is approved.

Status: DYNAMIC PORTFOLIO-RISK INTERACTION CANDIDATE.

---

## PR-015 — First portfolio-risk Shadow protocol

### Snapshot at each formal plan / execution event
- totalCapital
- deployedCapital
- cash
- per-position value
- plannedRiskNTD
- volatility20
- correlation20/60
- downsideCorrelation where enough data
- sector
- empiricalCluster
- marketBeta
- marginal/component risk contribution
- clusterCapitalShare
- clusterRiskShare
- projected metrics after FIRST/ADD

### Counterfactual allocations
Do not modify live allocation.
Research only:
A. Current priorityScore allocation
B. Equal capital
C. inverse-volatility
D. equal planned-stop-risk
E. simple equal-risk-contribution
F. current allocation + cluster cap

### Outcomes
- portfolio D1/D3/D5 return
- portfolio MFE/MAE
- max drawdown
- realized volatility
- simultaneous stop hit
- cash utilization
- opportunity cost
- turnover/slippage proxy

### Bias controls
- weights frozen at decision time;
- no future covariance;
- transaction costs;
- no rebalancing at unavailable prices;
- point-in-time selected set only;
- independent-date clustering;
- avoid selecting best allocator from many variants without holdout.

Status: PROTOCOL V1 FROZEN.

## Exact next continuation after PR-015

PR-016 covariance shrinkage / small-sample design.
PR-017 hierarchical risk clustering and cluster stability.
PR-018 effective number of bets / concentration metrics.
PR-019 tail-risk and expected-shortfall limitations.
PR-020 portfolio heat / aggregate planned-stop risk.
PR-021 cash as an active risk allocation, not unused failure.
PR-022 concentration versus conviction: when top-score weighting helps/hurts.
PR-023 interaction with 3+3+3 ring-fenced capital.
PR-024 evidence-readiness / Formal-boundary convergence.
