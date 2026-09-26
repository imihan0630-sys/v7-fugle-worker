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


---

## PR-016 — Covariance shrinkage for a small, noisy Top6 universe

### Why sample covariance is still fragile here
Our portfolio has at most six names, so this is not a “large p” institutional problem. But 20-60 daily observations are still a small sample when:
- names are highly correlated,
- volatility regimes change,
- one or two extreme days dominate,
- some symbols have incomplete histories.

A matrix can be invertible and still be poorly conditioned.

### Evidence
Ledoit & Wolf (2004) show that shrinking a noisy sample covariance toward a structured target can improve conditioning and estimation accuracy.

Source:
- Ledoit & Wolf, Journal of Multivariate Analysis 88 (2004), 365-411.
- DOI: 10.1016/S0047-259X(03)00096-4
- https://www.ledoit.net/Well-conditioned2004.pdf

### Frozen research hierarchy
For Top6 risk diagnostics:
1. pairwise sample correlation as the transparent baseline;
2. sample covariance;
3. Ledoit-Wolf-style shrinkage covariance as the first robust alternative;
4. no optimizer until estimator stability is demonstrated.

Do not tune shrinkage strength against future returns.

### Missing-data rule
Insufficient synchronized history => UNKNOWN, not zero covariance/correlation.

### Small-p simplification
For one or two live positions, pairwise risk diagnostics may be more interpretable than invoking a full covariance model.

Status: SHRINKAGE APPROVED FOR SHADOW RISK ESTIMATION; NOT FORMAL SIZING.

---

## PR-017 — Hierarchical clustering is more useful first as a diagnostic than as an allocator

### Positive evidence
Hierarchical Risk Parity (HRP) was proposed to reduce instability/concentration problems associated with quadratic optimizers and does not require covariance-matrix inversion.

Source:
- López de Prado (2016), Journal of Portfolio Management 42(4), 59-69.
- DOI: 10.3905/jpm.2016.42.4.059
- https://papers.ssrn.com/sol3/abstract_id=2708678

### Counter-evidence
Out-of-sample studies do not show HRP universally dominates other allocation methods. A 2023 Brazilian-market comparison found HRP generally did not produce the best performance across methods, although it was competitive on some measures.

Source:
- Reis et al. (2023), Brazilian Review of Finance 21(4), 81-103.
- DOI: 10.12660/rbfin.v21n4.2023.89848

### System conclusion
Use clustering first to answer:
“Are these nominally different stocks actually one risk cluster?”

Do **not** jump to HRP weights.

### Stability protocol
Candidate diagnostic:
- correlation distance `sqrt((1-rho)/2)`;
- fixed linkage method before outcomes;
- compare 20d/60d/120d when enough history exists;
- bootstrap/co-assignment stability where feasible;
- compare raw-return clusters with market-residual clusters later.

Unstable membership => CLUSTER_UNSTABLE, not a permanent sector identity.

Status: CLUSTERING = DIAGNOSTIC LAYER FIRST.

---

## PR-018 — Separate capital-name count from independent-risk count

Six holdings do not necessarily mean six independent bets.

### Simple capital concentration
For long-only capital weights:
`effectiveCapitalNames = 1 / sum(w_i^2)`

Examples:
- six equal weights => 6;
- one dominant position => approaches 1.

This is transparent but ignores correlation.

### Covariance-spectrum concentration
Candidate participation-ratio diagnostic:
`effectiveRiskDimension = (sum(lambda_i))^2 / sum(lambda_i^2)`

where lambda are non-negative covariance/correlation eigenvalues.

This asks whether portfolio variation is spread across several independent directions or dominated by one common mode.

### Effective Number of Bets naming guard
Meucci's “Effective Number of Bets” is based on a specific diversification distribution over uncorrelated bets and entropy.

Source:
- Meucci (2009/2010), Managing Diversification.
- https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID1683640_code403805.pdf?abstractid=1358533&mirid=1

Do not call the simple Herfindahl or eigenvalue participation ratio “Meucci ENB”.

### Kill rule
If the sophisticated risk-dimension metric is unstable while effectiveCapitalNames and cluster share already explain the same issue, keep the simpler metric.

Status: TWO-LAYER CONCENTRATION MEASUREMENT FROZEN.

---

## PR-019 — Expected Shortfall is conceptually better for tails, but short windows make it statistically weak

### Why ES matters
Expected Shortfall estimates the average loss beyond a chosen tail quantile, so it captures loss severity that VaR can ignore.

Evidence:
- Acerbi & Tasche (2002), Expected Shortfall: A Natural Coherent Alternative to Value at Risk.
- DOI: 10.1111/1468-0300.00091

### Small-sample problem
At a 95% tail:
- 20 daily observations -> about 1 tail observation;
- 60 -> about 3;
- 252 -> about 12-13.

Therefore 20d/60d historical ES is too noisy to act as a sizing gate.

### Research hierarchy
For our system:
1. planned-stop heat;
2. deterministic gap/limit stress scenarios;
3. historical worst-day / worst-k-day diagnostics;
4. only then long-window historical ES with uncertainty.

If ES is eventually reported:
- use point-in-time portfolio weights;
- require enough observations;
- show bootstrap/estimation uncertainty;
- never present ES as a guaranteed maximum loss.

Status: ES DESCRIPTIVE ONLY; SHORT-WINDOW ES REJECTED.

---

## PR-020 — Portfolio heat is a high-value bridge between trading rules and portfolio risk

### Definitions
For verified live positions:
`plannedRiskNTD_i = actualPositionValue_i * abs(entry_i-stop_i)/entry_i`

`plannedPortfolioHeat = sum(plannedRiskNTD_i) / totalCapital`

For an unfilled plan, label the same calculation:
`projectedHeat`, not actual heat.

### Extensions
Track:
- total planned heat;
- cluster planned heat;
- projected heat after FIRST;
- projected heat after ADD;
- stressed heat at 1.5x and 2.0x planned stop loss;
- realized loss versus planned heat after exits.

### Critical caveat
Portfolio heat assumes stop-distance accounting, not guaranteed execution. Gaps, price limits and thin liquidity can exceed it.

### No threshold yet
Do not invent “safe = 6%” or any similar number from trading folklore. Thresholds require strategy-specific outcome evidence.

Status: HIGH-PRIORITY SHADOW METRIC.

---

## PR-021 — Cash can be protection, delay, or a broken-opportunity symptom

The system currently worries about idle capital because BUY triggers can be rare. That does **not** mean “more invested is always better.”

### Distinguish cash states
Research labels:
- STRUCTURAL_RESERVE — cash left by the formal deploy-ratio design;
- NO_ELIGIBLE_OPPORTUNITY — no qualified plan exists;
- PENDING_ENTRY — plan exists but entry conditions not met;
- POST_REDUCTION — capital freed by risk reduction;
- DATA_OR_SIGNAL_BLOCKED — cash exists because required data/signals failed;
- UNKNOWN.

### Why this matters
The same 60% cash can mean:
- prudent risk avoidance during correlated stress;
- normal waiting for a pullback;
- overly strict BUY logic missing valid opportunities;
- an infrastructure/data defect.

These must not be scored the same.

### Counterfactual outcome
For each cash state test:
- drawdown avoided;
- missed D1/D3/D5 return;
- missed MFE;
- later deployability;
- portfolio volatility reduction.

Cash utilization is an outcome dimension, not a stand-alone objective.

Status: CASH-STATE ATTRIBUTION FROZEN.

---

## PR-022 — PriorityScore is a ranking signal, not yet a calibrated sizing conviction

Current allocation is influenced by Formal `priorityScore`. This creates an implicit assumption:
“higher score deserves more capital.”

That assumption needs separate evidence.

### External evidence is mixed
Taiwan mutual-fund research finds some relationship between concentration, manager skill and future performance, but support for superior risk-adjusted performance is partial.

Source:
- Hung, Lien & Chien (2020), Review of Financial Economics 38, 423-451.
- DOI: 10.1002/rfe.1086

Other fund research finds conviction can have an inverted-U relationship with future performance: excessive conviction can coincide with lower returns and higher risk.

Source:
- Jin et al. (2020), International Review of Financial Analysis 71, 101550.
- DOI: 10.1016/j.irfa.2020.101550

These manager studies do not validate our algorithmic score.

### Required internal test before stronger score-weighting claims
Within each scan date:
- rank selected names by priorityScore;
- test monotonic D1/D3/D5 return, MFE, MAE and stop-hit rates;
- cluster inference by independent date;
- evaluate incremental relation after sector/regime/liquidity;
- use holdout dates.

If score rank is not stably monotonic with forward opportunity/risk, it should not be treated as calibrated expected return.

Status: SCORE-CONVICTION CALIBRATION REQUIRED.

---

## PR-023 — 3+3+3 ring-fencing controls capital accounting, not consolidated economic risk

Current architecture separates:
- FORMAL_GENERAL;
- FORMAL_THOUSAND;
- HYBRID_THOUSAND_SHADOW.

The Shadow pool must remain separate from actual-live risk.

### Two mandatory portfolio views
1. **Within-pool risk**
   - deployed capital,
   - planned heat,
   - cluster exposure,
   - covariance/risk contribution.

2. **Consolidated live-account risk**
   - combine all genuinely live Formal positions across pools;
   - re-estimate common clusters and co-movement.

### Hidden issue
A thousand-dollar stock and a sub-thousand stock cannot be the same exact price-tier slot on the same date, but they can still be:
- the same AI-server theme;
- same PCB/ABF cycle;
- same export/currency exposure;
- same customer demand shock.

Therefore per-pool 35% position caps do not guarantee diversified total-account risk.

### Shadow firewall
HYBRID_THOUSAND_SHADOW is measured separately and may be compared counterfactually, but must not inflate actual deployed-capital or actual heat.

Status: WITHIN-POOL + CONSOLIDATED-LIVE RISK VIEWS FROZEN.

---

## PR-024 — Portfolio-risk concept lane convergence

### Ready now for descriptive Shadow calculation using existing/near-existing data
Tier A:
- deployed capital / cash;
- actual position value;
- plannedRiskNTD / projectedRiskNTD;
- planned/projected portfolio heat;
- effectiveCapitalNames;
- pairwise 20d/60d correlations;
- cluster capital share;
- cross-pool consolidated live view;
- cash-state reason.

Tier B: requires implementation and adequate history
- Ledoit-Wolf shrinkage covariance;
- component/marginal risk contribution;
- cluster stability;
- market-residual correlation;
- effectiveRiskDimension;
- downside/joint-stop diagnostics.

Tier C: not ready for Formal use
- historical ES from short windows;
- HRP allocation;
- equal-risk-contribution allocator;
- minimum-variance / maximum-Sharpe optimizers;
- hard portfolio-heat threshold;
- score-based concentration changes.

### Evidence gate
Any sizing/allocation change requires:
- independent-date evidence;
- transaction-cost/slippage inclusion;
- current allocation as control;
- no post-hoc parameter sweep;
- holdout validation;
- no deterioration in stop-loss / drawdown behavior hidden by average returns.

### Lane state
PORTFOLIO_RISK concept learning = CONCEPT_COMPLETE / EVIDENCE_PENDING.

Formal Core remains LOCKED.
No live capital, entry, ADD, REDUCE, SELL, stop, monitor or push logic changed.

## Exact next continuation after PR-024

Open a new durable lane:
**Trading Frictions, Turnover & Rebalancing**

First questions:
- explicit Taiwan stock taxes/commissions versus implicit spread/slippage;
- round-trip break-even hurdle;
- turnover drag;
- FIRST/ADD/REDUCE/RE-ADD friction;
- no-trade / hysteresis concepts;
- tax asymmetry for same-day versus non-day-trade stock sales;
- high-price and odd-lot minimum-fee effects;
- when a theoretically better allocation is not worth trading into.


---

## PR-025 — Tier-A plan-risk reconstructability validated against Production journal

### What is now proven
A Class-A research prototype and a live read-only Production journal audit have moved the Tier-A subset beyond concept-only status.

Durable artifacts:
- `research/portfolio_risk_tier_a_v0_1.mjs`
- `tests/test_portfolio_risk_tier_a_v0_1.mjs`
- `research/portfolio_risk_reconstructability_v0_1.json`
- `tests/test_portfolio_risk_reconstructability_v0_1.mjs`
- `research/portfolio_risk_production_readonly_receipt_20260926.json`
- PR #113, merged to main after Portfolio Risk research CI + V8 Repair + V8 Regression all passed.

### Historical reconstruction boundary
For exact system-recorded Formal plans in `v8_trade_journal_days` + `v8_trade_journal_plans`, the following are plan-time fields and can support historical Tier-A reconstruction without future outcomes:
- totalCapital;
- selectedCount/status/diagnostics;
- buyLow / buyHigh;
- stop;
- allocationRatio;
- totalAllocation;
- priorityScore / rewardRisk;
- first/second/total planned shares.

Therefore the following are valid reconstructable plan-time diagnostics when required fields are intact:
- plannedDeploymentNTD;
- deploymentRatioPct;
- projected stop-risk range by name;
- projected portfolio heat range;
- effectiveCapitalNames;
- name capital concentration;
- structural reserve.

Recovered/manual rows are excluded because they do not preserve the complete capital-allocation contract.

### Production read-only receipt
Run `36253794425` read only `/api/journal?days=730`; outcome fields were not read.

Observed:
- 4 recorded Formal journal days;
- 4 Formal plan rows;
- 58 recovered/manual rows excluded;
- 2 dates with plan rows;
- 2/2 plan dates fully reconstructable;
- 0 incomplete plan dates;
- 2 zero-selection dates.

Plan-risk geometry:
- 2026-09-18: capital NT$200,000; 3 plans; NT$168,000 planned deployment (84%); projected heat 2.0221%–3.2417%; effectiveCapitalNames 2.9672.
- 2026-09-21: capital NT$200,000; 1 plan; NT$70,000 planned deployment (35%); projected heat 0.5276%–1.3070%; effectiveCapitalNames 1.0000.
- 2026-09-22 and 2026-09-23: zero selected; journal status = `今日0檔，維持現金`.

These numbers prove reconstructability only. They do not establish any safe heat threshold or relationship with returns.

### Semantics frozen
For an unfilled plan:
- projected stop risk is a range using buyLow and buyHigh;
- buyHigh risk is the conservative endpoint for equal-planned-stop-risk diagnostics;
- it is not actual loss and not guaranteed maximum loss.

No folklore heat threshold is allowed.

### What remains PIT-blocked
Plan journal alone cannot reconstruct historical:
- pairwise correlation20/60;
- empirical clusters;
- shrinkage covariance;
- marginal/component risk contribution;
- downside correlation.

Current mutable history may not be used to invent those old states.

Actual-live heat also remains conditional on complete BUY/ADD/REDUCE/SELL event coverage.

### Lane state
`PORTFOLIO_RISK = FALSIFICATION_IN_PROGRESS / TIER_A_PIT_RECONSTRUCTABLE`.

Keep overall maturity at L2 for now because the broader risk layer (correlation/cluster/live-event completeness and outcome incrementality) is not yet validated.

No Formal allocation, ADD, REDUCE, stop, cluster cap or heat threshold change is authorized.

### Exact next
Use only fully reconstructable plan dates to build a descriptive, outcome-independent historical Tier-A table first. Then, after enough independent dates/outcomes mature, test whether heat/concentration adds incremental downside information beyond sector/regime/volatility/PriorityScore. Correlation/cluster tests wait for exact PIT synchronized-history provenance.
