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


## PR-029 — Actual-live lifecycle is not historically reconstructable from current receipts (2026-09-27)

This result combines source-contract audit with a Production read-only check. No outcome fields were used and no Production state was written.

### Source-contract result
The current trade-journal signal ledger stores monitor/action events such as:
- signal type;
- signal observation price;
- suggested amount/shares;
- position stage;
- episode and reason.

These are not broker-confirmed execution receipts. In particular, current journal rows do not carry an append-only execution contract with:
- confirmed fill id;
- confirmed fill timestamp;
- confirmed fill price;
- confirmed filled shares;
- shares before/after;
- average cost after;
- reconciliation provenance.

The current `/api/positions` path is a mutable reconciliation snapshot. It can describe current holdings when manually supplied, but it does not preserve an append-only sequence of historical fills or position transitions.

### Production read-only witness
Workflow run `36282609086`, job `108517212915` read only:
- `/api/journal?days=365`;
- `/api/positions`.

Observed:
- 4 recorded journal days;
- 4 Formal plan rows;
- 1 signal row, type BUY;
- that BUY row has suggested shares and a market observation price;
- 0 explicit confirmed-fill fields in the journal response contract;
- 2 current position rows, 0 current holdings, 0 complete holding snapshots.

Therefore:
- `actualLiveLifecycleHistorical = false`;
- `actualLiveHeatHistorical = false`.

### Falsification rule
Never reconstruct historical actual holdings by:
- treating `signal_shares` as filled shares;
- treating signal `market_price` as execution price;
- rolling current `actualShares` backward through time;
- inferring ADD/REDUCE quantities from plan shares when no confirmed execution exists.

Any such reconstruction is fabricated and must be rejected.

### What remains valid
Plan-time Tier-A metrics remain valid where immutable plan fields are complete:
- projected heat;
- deployment ratio;
- concentration decomposition;
- projected stop-risk intensity;
- reserve decomposition.

Current actual-position snapshots may describe **now** only when `actualShares + averageCost + firstEntryConfirmedAt` are complete. They still do not prove the historical path that produced the snapshot.

### Engineering boundary
A future append-only confirmed-fill ledger would be an evidence/infrastructure improvement, not an automatic trading-rule change. It must remain separate from signal generation and cannot silently reinterpret historical suggestions as executions.

Durable artifacts:
- `research/portfolio_risk_live_lifecycle_contract_v0_1.json`;
- `tests/portfolio_risk_live_lifecycle_readonly_audit.mjs`;
- `research/portfolio_risk_live_lifecycle_production_readonly_receipt_20260927.json`.

Lane status remains:
`PORTFOLIO_RISK = FALSIFICATION_IN_PROGRESS / PLAN_TIME_TIER_A_RECONSTRUCTABLE / ACTUAL_LIVE_HISTORY_BLOCKED`.

No Formal allocation, ADD/REDUCE, stop, monitoring, push or execution behavior changed.

### Exact next
Do not invent live-position history. Continue prospective evidence design for an append-only confirmed-fill/reconciliation ledger only if it can be isolated without changing Formal decisions. In parallel, continue outcome-independent plan-risk decomposition and wait for enough independent plan dates before testing whether Tier-A metrics add downside information beyond channel, volatility, PriorityScore and regime.


## PR-030 — Confirmed Fill Ledger v0.1 research contract (2026-09-27)

PR-029 proved that historical actual-live positions cannot be reconstructed from the current signal journal plus mutable position snapshot without fabricating fills.

This section freezes the **minimum evidence contract** required to solve that problem prospectively.

### Separation rule

A signal and an execution are different objects.

- `signalEventId` identifies a strategy/monitor decision event.
- `executionEventId` identifies a confirmed fill/reconciliation event.
- The two IDs may be linked, but must never be substituted for each other.

A BUY signal that was never filled remains a signal only.

### Required append-only execution evidence

Each confirmed fill requires:
- executionEventId;
- source + sourceRecordId;
- symbol;
- planScanDate;
- action BUY / ADD / REDUCE / SELL;
- occurredAt;
- confirmedAt;
- fillPrice;
- filledShares;
- sharesBefore;
- sharesAfter;
- averageCostAfter;
- reconciliationStatus.

### Position-transition invariants

- BUY/ADD: `sharesAfter = sharesBefore + filledShares`.
- REDUCE/SELL: `sharesAfter = sharesBefore - filledShares`.
- REDUCE must leave a positive position.
- SELL must close to zero.
- Across consecutive confirmed events for the same symbol, next `sharesBefore` must equal prior `sharesAfter`.

Any chain break is a data-quality failure, not an invitation to guess.

### Correction semantics

Execution history is append-only.

If a prior fill is later corrected:
- append a new `CORRECTED` event;
- point to `correctsExecutionEventId`;
- never overwrite/delete the original receipt.

This preserves the audit trail and prevents retrospective mutation of research history.

### Sources

Initial contract allows:
- BROKER_IMPORT;
- MANUAL_CONFIRMED;
- VERIFIED_EXTERNAL.

Source quality is explicit. A future broker import does not retroactively validate earlier manual/signal-only periods.

### Research firewall

The ledger may support future:
- actual-live heat;
- actual deployed capital;
- real ADD/REDUCE risk transitions;
- realized exposure before/after reduction;
- re-add lifecycle analysis.

It may **not**:
- create or modify trading signals;
- assume orders were filled;
- infer old executions from signal_shares;
- rewrite pre-ledger history;
- change Formal allocation/stops/BUY/ADD/REDUCE/SELL.

### Implementation classification

The research schema/model/tests are Class A.

Any shared Production implementation involving D1 tables, write APIs, broker import, reconciliation UI, or runtime state is **Class B proposal-first** and requires explicit owner approval before implementation/merge/deploy.

Status:
`CONFIRMED_FILL_LEDGER_V0_1 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.

Durable artifacts:
- `research/confirmed_fill_ledger_v0_1.mjs`;
- `tests/test_confirmed_fill_ledger_v0_1.mjs`;
- `research/confirmed_fill_ledger_spec_v0_1.json`.

No Formal or Production behavior changed.

### Exact next

Run the research CI and falsification fixtures. If they pass, record the contract as evidence-infrastructure-ready but keep actual-live Portfolio Risk blocked until a separately approved Production fill-capture implementation exists and has prospective real receipts.


## PR-031 — Confirmed Fill Ledger v0.2 bootstrap / PIT correction semantics (2026-09-27)

Further falsification found that v0.1 was insufficient for a portfolio that already has a position when execution-ledger capture begins.

Example:
- account already holds 100 shares before ledger start;
- first new event is a 40-share REDUCE.

Without a ledger-era opening-state receipt, `sharesBefore=100` has no append-only evidence source. Using the mutable current `/api/positions` snapshot as if it were a historical BUY would fabricate execution history.

### v0.2 separates two evidence kinds

**POSITION_BASELINE**
- observed account+symbol holding state at ledger start;
- contains sharesAfter and averageCostAfter;
- explicitly is **not a trade**;
- has no action/fillPrice/filledShares/sharesBefore;
- cannot contribute to return, turnover, fee or slippage attribution;
- pre-baseline execution history remains UNKNOWN.

**FILL**
- confirmed execution evidence;
- BUY / ADD / REDUCE / SELL;
- retains the v0.1 position arithmetic and append-only correction rules.

### Bootstrap rule

A FILL may start a ledger without a baseline only when:
- action = BUY;
- sharesBefore = 0.

If the first observed fill is ADD / REDUCE / SELL, a valid POSITION_BASELINE is required first.

This prevents a current holding snapshot from being silently transformed into an invented historical entry.

### Point-in-time correction semantics

v0.2 separates:
- `effectiveAt`: when the holding/fill economically occurred;
- `confirmedAt`: when the system first knew the evidence.

A later correction:
- is appended;
- references the earlier event;
- affects an as-known view only after the correction's `confirmedAt`;
- must not rewrite what the research system could have known before that time.

This preserves PIT auditability.

### Account scope

`accountKey` is mandatory. The same symbol held in separate accounts must not be silently merged before an explicit portfolio aggregation layer.

### Safe implementation conclusion

Do **not** automatically turn an existing `/api/positions` save into a FILL event.

The minimum safe Production architecture, if later approved, is:
1. keep `/api/positions` as current snapshot/read model;
2. create a separate append-only execution/baseline ledger;
3. require explicit baseline establishment for pre-existing holdings;
4. require explicit confirmed fill submissions/imports after ledger start;
5. derive current position from ledger where coverage is complete, but never backfill older fills from the snapshot;
6. preserve source/provenance and PIT confirmation time.

Automatic broker ingestion would be stronger than manual confirmation when available, but current repository audit proves no broker execution/order/fill connector in the existing scripts. Market-data/Fugle quote data is not broker execution evidence.

Status:
`CONFIRMED_FILL_LEDGER_V0_2 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.

No Worker/runtime/Formal decision behavior changed.

### Exact next

Run deterministic CI. If v0.2 survives, freeze a Class-B implementation proposal with D1 schema/API/idempotency/rollback/read-model boundaries. Do not implement/merge/deploy that Production infrastructure without explicit owner approval.


## PR-032 — Confirmed Fill Ledger v0.2.1 restores plan provenance (2026-09-27)

Class-B proposal preparation found a self-falsification defect in v0.2: while separating POSITION_BASELINE from FILL, the model accidentally dropped the v0.1 requirement that each confirmed fill preserve a stable `planScanDate`.

That omission would make an execution receipt harder to attribute to the exact after-market plan/episode and could contaminate REDUCE / RE-ADD research.

v0.2.1 therefore:
- requires `planScanDate` on every FILL;
- allows POSITION_BASELINE to omit planScanDate because the holding may predate the monitored plan;
- requires `ledgerEpochId` on every event;
- materializes state by `accountKey | symbol | ledgerEpochId`;
- preserves baseline-not-fill and effectiveAt/confirmedAt PIT correction semantics.

A signal link remains optional:
- `signalEventId` can connect execution evidence to a signal;
- it never becomes execution identity.

This is a research-contract correction only. No Worker/runtime/Formal behavior changed.

Status:
`CONFIRMED_FILL_LEDGER_V0_2_1 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.

Exact next: run deterministic CI, then use v0.2.1—not v0.2—as the only base for the Class-B Production implementation proposal.


## PR-033 — PriorityScore allocation can amplify conservative planned-stop-risk concentration (2026-09-27)

A Class-A read-only extension of the existing Portfolio Risk journal audit compared the current Formal allocation with two outcome-independent diagnostics while keeping the same total planned deployment:
- equal capital;
- unconstrained equal planned-stop-risk using the conservative buyHigh stop-risk percentage.

No return, MFE, MAE, fill, realized P/L or future outcome field was read. Production was not written.

### Production witness

Portfolio Risk Tier-A Research run `36314784619`, job `108607322138`, read only `/api/journal?days=730`.

The only fully reconstructable multi-name plan date is 2026-09-18:
- total planned deployment = NT$168,000;
- all 3 plans are B-channel;
- current projected-risk HHI = 0.377238;
- equal-capital projected-risk HHI = 0.355859;
- equal-planned-stop-risk projected-risk HHI = 0.333333;
- current max/min projected-risk contribution ratio = 2.4472x;
- equal-capital ratio = 1.9119x;
- equal-planned-stop-risk ratio = 1.0000x.

Plan-level conservative buyHigh geometry:
- 2006: PriorityScore 69.9; planned stop-risk 2.6167%; current allocation NT$50,000; projected risk NT$1,308.35.
- 3105: PriorityScore 89.4; planned stop-risk 5.0028%; current allocation NT$64,000; projected risk NT$3,201.79.
- 6133: PriorityScore 74.9; planned stop-risk 3.6542%; current allocation NT$54,000; projected risk NT$1,973.27.

The current allocator therefore gave the largest capital weight to the same plan that had the widest conservative stop distance. Capital weighting and stop geometry compounded rather than offsetting each other on this date.

Equal-capital would use NT$56,000 each and reduce projected-risk concentration, but would still leave different risk contributions because stop distances differ.

The unconstrained equal-planned-stop-risk diagnostic would allocate approximately:
- 2006: NT$75,029.23;
- 3105: NT$39,243.82;
- 6133: NT$53,726.94;
producing approximately NT$1,963.29 projected risk per name.

This is deliberately **not executable evidence**: 2006 would receive about 37.51% of total capital, above the current 35% per-name cap. It also ignores actual fills, lot/rounding effects and future outcomes.

2026-09-21 has only one A-channel plan (3006), so current/equal-capital/equal-risk are mechanically identical and provide no cross-name allocation test.

### Falsification result

Rejected structural proposition:
`PriorityScore-weighted capital is mechanically risk-neutral with respect to planned stop geometry.`

Observed counterexample:
on 2026-09-18, the highest-score name also had the widest planned stop and therefore absorbed the largest projected stop-risk contribution.

This does **not** prove PriorityScore sizing is economically harmful, nor that equal-risk sizing is superior. It establishes only that current conviction weighting can amplify plan-risk concentration when score and stop distance align.

### Required future economic test

Once enough independent fully reconstructable plan dates and clean outcomes exist, compare current allocation against frozen counterfactuals using:
- D1/D3/D5 and MFE/MAE;
- stop-first / downside clustering;
- date-cluster and leave-one-date-out inference;
- A/B channel, volatility, market regime and PriorityScore controls;
- transaction/slippage feasibility;
- a cap-constrained executable equal-risk comparator separately from the current unconstrained diagnostic.

Do not tune a heat threshold or sizing formula from the 2026-09-18 witness.

Durable receipt:
`research/portfolio_risk_tier_a_history_v0_3_receipt_20260927.json`.

Status:
`FALSIFICATION_IN_PROGRESS / STRUCTURAL_RISK_CONCENTRATION_CONFIRMED / OUTCOME_MATERIALITY_UNKNOWN / NOT_OPTIMIZATION_READY`.

No Formal allocation, PriorityScore, stop, BUY/ADD/REDUCE/SELL, monitoring or push rule changed.


## PR-034 — 35% cap does not explain the observed score × stop-risk concentration (2026-09-27)

PR-033 established that the 2026-09-18 current allocation concentrated conservative planned stop-risk more than equal capital. A stronger counterfactual was required because the unconstrained equal-risk diagnostic allocated 37.51% of total capital to 2006 and therefore violated the current 35% per-name cap.

A new Class-A comparator now keeps:
- the same NT$168,000 planned deployment;
- the same NT$200,000 total capital;
- the current 35% / NT$70,000 per-name cap;
- the same conservative buyHigh planned-stop-risk definition.

It does not read outcomes and does not change Formal allocation.

### Deterministic replay of the current allocator

For 2026-09-18:
- PriorityScores = 69.9 / 89.4 / 74.9;
- score total = 234.2;
- 3 selected names imply the current 85% nominal deploy target = NT$170,000;
- score-proportional continuous allocations are approximately NT$50,738.68 / NT$64,893.25 / NT$54,368.06;
- all are below the NT$70,000 per-name cap;
- flooring each to NT$1,000 reproduces the immutable journal exactly: NT$50,000 / NT$64,000 / NT$54,000;
- the remaining NT$2,000 is the previously identified allocation implementation shortfall.

Therefore the current 2026-09-18 allocation did **not** have a binding 35% cap. The observed concentration is mechanically attributable to PriorityScore proportional weighting plus heterogeneous stop distance, with only a small flooring residue.

### Cap-constrained equal-risk counterfactual

Continuous same-deployment solution under the current 35% cap:
- 2006 = NT$70,000, cap binding;
- 3105 = NT$41,366.71;
- 6133 = NT$56,633.29.

Conservative projected stop-risk contribution:
- 2006 = NT$1,831.69;
- 3105 = NT$2,069.49;
- 6133 = NT$2,069.49.

Structural comparison:
- current projected-risk HHI = 0.377238;
- cap-constrained equal-risk HHI = 0.334391;
- reduction = 11.36%;
- current max/min projected-risk ratio = 2.4472x;
- cap-constrained comparator = 1.1298x;
- reduction = 53.83%;
- current high-end projected risk = NT$6,483.41 / 3.2417% of total capital;
- cap-constrained comparator = NT$5,970.67 / 2.9853%;
- difference = -NT$512.74 / -0.2564 percentage points, or about -7.91%.

### Falsification result

Two simpler explanations are rejected for this observed date:
1. the current concentration was mainly caused by the 35% cap;
2. the concentration advantage of equal-risk disappears once the 35% cap is enforced.

Neither is supported by the deterministic replay.

The surviving structural mechanism is:
`PriorityScore proportional sizing × heterogeneous planned stop distance`.

On 2026-09-18, 3105 simultaneously had the highest PriorityScore and the widest conservative planned stop distance, so it received the largest capital allocation and an even larger share of projected stop-risk.

### Counterevidence and limits

This is still **not** an economic optimization result:
- there is only one reconstructable multi-name date;
- the capped comparator is continuous and does not yet impose the Formal NT$1,000 flooring;
- no returns, MFE, MAE, stop-first, fills, costs or realized drawdowns were read;
- lower risk concentration can reduce exposure to the best opportunity if PriorityScore contains genuine alpha;
- current score weights therefore must be tested against outcome-aware but pre-registered counterfactuals before any capital rule can change.

Durable receipt:
`research/portfolio_risk_cap_constrained_equal_risk_receipt_20260927.json`.

Status:
`STRUCTURAL_MECHANISM_CONFIRMED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core remains unchanged.


## PR-035 — risk concentration has ex-ante reward-space counterevidence (2026-09-27)

PR-033/034 proved that 2026-09-18 PriorityScore-proportional sizing concentrated conservative planned stop-risk and that the effect was not caused by the 35% cap. PR-035 tests the required opposite explanation before considering any sizing change:

`Does the additional planned risk buy any additional plan-time reward geometry?`

The read-only Tier-A audit now computes a deliberately narrow proxy:
`plannedRewardProxyNTD = conservative buyHigh projectedStopRiskNTD × immutable plan-time rewardRisk`.

This is **not expected return and not realized return**. It only measures the reward-space implied by the frozen plan geometry.

### 2026-09-18 comparison

Current PriorityScore allocation:
- projected risk = NT$6,483.41;
- RR-based planned reward proxy = NT$23,532.04;
- proxy reward / projected risk = 3.6296.

Equal capital:
- projected risk = NT$6,313.27;
- planned reward proxy = NT$22,808.80;
- proxy reward / projected risk = 3.6128.

Same-deployment 35%-cap constrained equal planned-stop-risk:
- projected risk = NT$5,970.67;
- planned reward proxy = NT$21,296.49;
- proxy reward / projected risk = 3.5669.

Current minus equal capital:
- +NT$170.14 projected risk;
- +NT$723.24 reward-space proxy;
- marginal proxy reward/risk = 4.2509.

Current minus capped equal-risk:
- +NT$512.74 projected risk;
- +NT$2,235.55 reward-space proxy;
- marginal proxy reward/risk = 4.36.

Therefore a stronger one-sided claim is falsified:
`current PriorityScore sizing only adds planned risk and receives no plan-time reward-space compensation`.

The 2026-09-18 plan geometry shows compensation in the RR-based proxy.

### Important counterevidence against overinterpreting this result

This does not validate current sizing economically.

6133 has the highest raw RR at 3.89, versus 3105 at 3.71 and 2006 at 3.04, yet 3105 receives the highest PriorityScore and largest current allocation. Current sizing is therefore not simply maximizing raw RR. PriorityScore is intentionally combining other setup/sector/RS/consensus/fundamental dimensions, and the realized incremental value of those dimensions is exactly what the prospective PriorityScore calibration lane still has to prove.

The correct state is now a two-sided tradeoff:
- current sizing has a confirmed planned-risk concentration cost;
- current sizing also has confirmed plan-time RR reward-space counterevidence;
- realized economic dominance of current vs equal-capital vs capped equal-risk remains UNKNOWN.

Only independent prospective outcomes can resolve the tradeoff. Required future comparison remains D1/D3/D5, MFE/MAE, stop-first/downside clustering, costs, A/B/channel/regime controls, date clustering and LODO.

Durable receipt:
`research/portfolio_risk_ex_ante_reward_proxy_receipt_20260927.json`.

Status:
`TWO_SIDED_STRUCTURAL_TRADEOFF_CONFIRMED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-036 — correction: PR-035 RR proxy is endogenous, not independent alpha evidence (2026-09-27)

A redundancy/circularity audit was run immediately after PR-035.

Current Formal already uses RR in three layers:
1. hard eligibility: RR >= 2;
2. PriorityScore: `clamp(RR*20,0,100)*0.14`;
3. later raw rewardPerRisk comparator after post-consensus PriorityScore.

Therefore the PR-035 diagnostic `projectedStopRisk × RR` is **not statistically independent of the allocation rule being evaluated**, because allocation is proportional to a PriorityScore that already contains RR.

For the 2026-09-18 plans, the RR contribution to PriorityScore is:
- 2006: RR 3.04 -> 8.512 score points;
- 3105: RR 3.71 -> 10.388;
- 6133: RR 3.89 -> 10.892.

The circularity is only partial, not total:
- 6133 has the highest RR and largest RR score contribution;
- 3105 nevertheless has the highest final PriorityScore and receives the largest current allocation.

So RR alone does not explain the allocation ordering. Other PriorityScore dimensions materially reverse the 3105-vs-6133 RR ordering.

### Corrected interpretation

PR-035 remains numerically valid as a **plan-time structural consistency diagnostic**:
current sizing has a higher RR-based reward-space proxy on this date.

It must **not** be used as independent evidence that the additional planned risk is economically compensated, because part of that relationship is designed into PriorityScore itself.

The stronger phrase “reward compensation” is therefore downgraded to:
`endogenous ex-ante reward-space alignment`.

Independent economic evidence still requires prospective realized outcomes with raw RR and market-consensus contribution controlled, frozen current/equal-capital/capped-equal-risk counterfactuals, independent dates, date clustering/LODO, channel/regime controls and costs.

This correction strengthens the governance firewall: neither PR-034's lower risk concentration nor PR-035's higher RR proxy is allowed to win by construction.

Durable receipt:
`research/portfolio_risk_rr_proxy_endogeneity_receipt_20260927.json`.

Status:
`PR035_INTERPRETATION_DOWNGRADED_TO_ENDOGENOUS_CONSISTENCY / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-037 — prospective sizing attribution needs shared Shadow↔journal generation identity (2026-09-27)

A pre-9/29 evidence-chain audit checked whether V8.13 PriorityScore provenance can be safely joined to Portfolio Risk trade-journal plans for future sizing calibration.

### What is already good

V8.13 prospectively freezes inside the research snapshot:
- post-consensus PriorityScore;
- raw rewardPerRisk / rewardRisk;
- consensus score/source-count/bonus;
- setupQuality;
- sectorFlow;
- relativeStrength;
- definition and comparator versions;
- point-in-time observation semantics.

Shadow capture is prospective and explicitly marks capturedAtSelection / shadowOnly / noForwardFill.

Therefore **within-Shadow** ranking/component calibration can continue under the existing prospective protocol.

### Cross-store identity gap

The Shadow D1 schema is keyed by:
`PRIMARY KEY(scan_date, symbol)`.

The snapshot has scanDate and symbol, but no shared immutable:
- scanGeneration;
- planInstanceId; or
- decision fingerprint also persisted on the trade-journal plan row.

The trade journal is the immutable plan-time source for allocation, buy zone and stop geometry used by Portfolio Risk.

Thus `scanDate + symbol` equality proves same nominal date/name, but does not prove the Shadow score provenance and journal allocation came from the **same decision generation** after same-day reruns, partial failures or asymmetric overwrites.

This is the same class of evidence-chain problem already recognized by VALIDATION_GOVERNANCE for generation-uncertified joins.

### Safe firewall

Allowed:
- prospective PriorityScore analysis entirely inside a generation-coherent Shadow record set, subject to existing coverage/cohort controls.

Guarded:
- score-proportional sizing attribution that joins V8.13 Shadow provenance to journal allocation/stop rows.

Forbidden for Formal promotion:
- treating `scanDate|symbol` as sufficient shared-generation proof.

A future Class-B evidence proposal may add one shared immutable scan-generation / decision fingerprint to both stores with mismatch fail-closed readback. No such persistence change is made here.

This finding does **not** change Formal behavior and does not invalidate PR-033/034, which deterministically replay the allocation from the immutable journal itself. It specifically constrains future attribution of those allocations to richer V8.13 score-component provenance across stores.

Durable artifact:
`research/portfolio_risk_shadow_journal_generation_alignment_v0_1.json`.

Status:
`CROSS_STORE_GENERATION_ALIGNMENT_UNCERTIFIED / WITHIN_SHADOW_RESEARCH_CONTINUES / SIZING_PROMOTION_GUARDED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-038 — correction: selected-only sizing has an existing same-writer generation witness (2026-09-27)

PR-037 correctly identified that the independent Shadow archive is keyed only by scan_date + symbol and lacks a shared immutable generation ID with the trade journal.

A deeper writer audit narrows that blocker substantially for **selected plans**.

Inside `recordTradeJournalDay`:
- one `first-primary` D1 session is opened;
- one invocation-level `now = new Date().toISOString()` is created;
- each `v8_trade_journal_plans` row is written with `recorded_at = now`;
- the selected plan's attached `researchSnapshot` is then written to `trade_research_snapshots` with `updated_at = the same now`;
- V8.13 PriorityScore provenance is part of `buildResearchSnapshot`, so the selected research snapshot carries the prospective ranking fields.

Same-day rerun semantics strengthen this witness:
- plan rows for the date are deleted and rebuilt;
- research snapshots are upserted;
- a fully successful rerun gives both sides the new identical timestamp;
- an asymmetric failure can leave a timestamp mismatch and must fail closed.

### Strict positive selected-generation classifier

A selected plan may be treated as same-generation only when all are true:
1. exact scan_date;
2. exact symbol;
3. `plan.recorded_at === selectedSnapshot.updated_at`;
4. snapshot `sourceCompleteness === FULL_FORMAL_SCAN`;
5. required V8.13 ranking provenance + definition/comparator versions are present;
6. journal day completeness is positively verified.

This is stronger than a bare scanDate|symbol join and requires no fabricated historical Shadow.

### Remaining limitation

The convenient Portfolio Risk `/api/journal` reader currently exposes plan `recorded_at` but not the selected research snapshot's `updated_at`/raw row. Therefore the **storage contract is source-ready**, while live readback certification still needs a safe reader/classifier path.

That reader work is evidence infrastructure only; it must not alter Formal selection/ranking/capital/signals.

The independent non-selected Shadow archive remains under PR-037's generation firewall.

Corrected status:
`SELECTED_GENERATION_WITNESS_SOURCE_READY / READER_PATH_PENDING / NONSELECTED_SHADOW_STILL_GUARDED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
