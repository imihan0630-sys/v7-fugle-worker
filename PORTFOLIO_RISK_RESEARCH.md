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


## PR-039 — fail-closed selected-generation classifier frozen before prospective data (2026-09-27)

PR-038 established that existing storage contains a same-writer generation witness for selected plans. PR-039 converts that contract into an executable **research-only pure classifier** before any 2026-09-29 prospective rows exist.

Positive certification requires all of:
- exact scan_date;
- exact symbol;
- plan recorded_at exactly equals selected research snapshot updated_at;
- sourceCompleteness = FULL_FORMAL_SCAN;
- required V8.13 PriorityScore/ranking provenance present;
- journal selected_count exactly equals plan_count.

The test suite explicitly fails closed on:
- date mismatch;
- symbol mismatch;
- timestamp mismatch;
- PARTIAL_CURRENT_SCAN_RECONSTRUCTION;
- missing ranking provenance;
- journal completeness mismatch.

### Reader audit

Existing Production storage is already sufficient in principle:
- /api/journal exposes plan recorded_at;
- internal readResearchSnapshots reads trade_research_snapshots.updated_at + snapshot_json from first-primary D1.

However /api/research/dashboard intentionally does not expose raw snapshot rows/timestamps. Therefore an external research script cannot currently pair both witnesses without widening a Production API.

No API is widened now.

Reason:
there are not yet prospective 2026-09-29 selected V8.13 rows to justify adding another Production surface. The classifier is frozen first; after the first prospective row exists, the least-invasive reader path can be evaluated against a real row rather than speculative plumbing.

This is a governance improvement: evidence requirements are pre-registered before seeing the prospective outcome/sample.

Artifact:
`research/portfolio_risk_selected_generation_classifier_v0_1.mjs`.

Receipt:
`research/portfolio_risk_selected_generation_classifier_receipt_20260927.json`.

Status:
`CLASSIFIER_READY / PRODUCTION_READER_DEFERRED / FIRST_PROSPECTIVE_LIVE_QA_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-040 — first prospective Portfolio Risk QA protocol pre-registered (2026-09-27)

Before observing the first eligible 2026-09-29+ V8.13 selected sample, the interpretation rules are frozen.

- Zero selected: useful for journal/no-opportunity completeness only; says nothing about sizing quality.
- One selected: may certify generation/provenance and reconstruct its planned risk, but cannot identify cross-name concentration or compare allocators.
- Multiple selected: may run current vs equal-capital vs capped-equal-risk **plan-time structural** comparisons, but same-day geometry cannot establish economic superiority.

Outcome maturity is also fixed:
D1/D3/D5 become usable only after 1/3/5 subsequent trading sessions have closed. MFE/MAE obey the same no-future-bar horizon rule.

Every eligible date, including zero-selection and failed-generation dates, must be retained. No dropping inconvenient dates and no changing comparator/horizon definitions after outcomes are seen.

Any economic sizing conclusion still requires multiple independent scan dates, costs, date clustering and LODO. A single attractive prospective date cannot create a FORMAL_OPTIMIZATION_CANDIDATE.

Artifact:
`research/portfolio_risk_first_prospective_qa_protocol_v0_1.json`.

Status:
`PROTOCOL_PREREGISTERED / AWAITING_FIRST_ELIGIBLE_SCAN`.

Formal Core unchanged.


## PR-041 — PriorityScore has a second exposure channel after selection (2026-09-27)

A structural hypothesis was falsified:

`PriorityScore influence ends when ranking/selection is complete.`

It does not. After a name is selected, the same post-consensus PriorityScore also drives proportional planned capital. Therefore PriorityScore has at least two distinct decision-path exposures:
1. ranking/selection exposure;
2. post-selection sizing exposure.

On the immutable 2026-09-18 three-name journal, equal capital at the same NT$168,000 deployment is NT$56,000/name. Current planned capital is:
- 2006: NT$50,000;
- 3105: NT$64,000;
- 6133: NT$54,000.

Thus 3105 receives a +NT$8,000 sizing tilt versus equal capital. Because 3105 also has the widest conservative planned stop fraction, that positive sizing tilt increases its projected stop-risk contribution relative to equal capital.

This does **not** mean the extra exposure is harmful. It may be justified if the higher PriorityScore contains genuine prospective alpha.

It also does not permit factor-level attribution: setup, RR, sector, institutions, fundamentals, RS and consensus all contribute to the final score, some through multiple layers. The correct future decomposition is therefore:

`factor/gate effect -> ranking/selection incidence -> selected score -> sizing tilt -> realized outcome`.

Selection influence and sizing influence must be reported separately and must not be added as though statistically independent.

Machine artifact:
`research/priority_score_sizing_multiplier_structural_v0_1.json`.

Executable decomposition:
`research/priority_score_sizing_influence_v0_1.mjs`.

Status:
`SECOND_EXPOSURE_CHANNEL_CONFIRMED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-042 — PriorityScore × stop-distance interaction test pre-registered (2026-09-27)

PR-041 proves PriorityScore creates a distinct post-selection sizing tilt. The next question is whether that tilt systematically aligns with stop geometry.

Three competing outcomes are frozen before prospective data:
- **amplification:** higher score tends to coincide with wider planned stop distance, so score sizing magnifies projected risk concentration;
- **neutral:** score and stop distance have no stable within-date relationship;
- **natural offset:** higher score tends to coincide with narrower stop distance, partially offsetting score sizing risk.

Primary evidence will use generation-certified multi-selected dates only:
- within-date Spearman(PriorityScore, conservative stop-risk %);
- within-date covariance(score share, stop-risk %);
- current projected-risk HHI minus same-deployment equal-capital risk HHI;
- frequency that the highest-score name is also the widest-stop name.

The analysis must remain within-date first. Pooling names across dates can create regime/selected-count composition artifacts and is forbidden as primary evidence.

Required strata:
A/B channel, selected-count 2 vs 3+, market regime, and pool/price tier where available.

2026-09-18 is retained only as an amplification witness: 3105 is both highest PriorityScore and widest conservative stop fraction. It cannot set a threshold or establish population direction.

Artifact:
`research/priority_score_stop_distance_interaction_protocol_v0_1.json`.

Status:
`INTERACTION_PROTOCOL_PREREGISTERED / INDEPENDENT_DATES_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-043 — post-selection sizing break-even / opportunity-cost framework pre-registered (2026-09-27)

PR-041 established that PriorityScore creates a second exposure channel through post-selection capital sizing. PR-043 freezes the economic break-even algebra **before** prospective outcomes mature.

### Primary comparator

Use the same selected names and the same total planned deployment, but replace current PriorityScore-proportional sizing with equal capital.

This isolates sizing from selection.

For any horizon:

`gross sizing alpha = Σ[(current allocation - comparator allocation) × realized return]`.

Because the allocation tilts sum to approximately zero under same deployment, this is exactly:

`transferred capital × (return of capital tilted up - return of capital tilted down)`.

Therefore the gross break-even condition needs no subjective threshold:

`positive-tilt weighted return = negative-tilt weighted return`.

### 2026-09-18 algebra witness

Equal capital is NT$56,000/name.

Current minus equal-capital tilt:
- 2006 = -NT$6,000;
- 3105 = +NT$8,000;
- 6133 = -NT$2,000.

Hence current sizing has positive gross incremental P&L only if:

`R_3105 > 0.75 × R_2006 + 0.25 × R_6133`.

No 2026-09-18 outcome is read or inferred. This is algebra only.

### Projected-risk link

If conservative planned stop-risk inputs are complete, also report:
- current projected plan-risk;
- comparator projected plan-risk;
- incremental projected plan-risk;
- gross incremental P&L / extra projected plan-risk when the risk delta is positive.

No arbitrary “required P&L per risk” cutoff is introduced. The ratio is descriptive until independent dates establish a stable distribution.

### Cost firewall

Cost-adjusted dominance remains UNKNOWN unless the **incremental cost difference** between the sizing rules is explicitly measured or conservatively bounded.

Same total deployment may make linear entry notional costs similar, but minimum commissions, odd-lot effects, exit notional and slippage can still differ. Incremental cost must not silently be set to zero.

### Outcome-clock firewall

The primary sizing estimand is fixed-cohort:
`formal selection close -> D1/D3/D5`
on the same selected names.

BUY-triggered trade P&L is secondary execution evidence only. Restricting the primary comparison to BUY-triggered rows can create post-selection trigger bias and is forbidden.

Executable algebra:
`research/priority_score_sizing_breakeven_v0_1.mjs`.

Protocol:
`research/priority_score_sizing_breakeven_protocol_v0_1.json`.

Status:
`BREAKEVEN_PROTOCOL_PREREGISTERED / OUTCOMES_PENDING / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-044 — correction: paper path edge vs realized execution edge are different clocks (2026-09-27)

PR-043's algebra is valid, but its terminology was too strong.

Multiplying planned allocation tilt by `formal selection close -> D1/D3/D5` returns does **not** create realized P&L, because no fill at the formal close is implied.

The sizing research is now split into two estimands.

### 1. Selection-path clock

Population:
all generation-certified selected names on identifying multi-name dates.

Common baseline:
formal selection close.

Output:
`PAPER_PATH_SIZING_EDGE`.

Question:
did PriorityScore tilt more planned capital toward names that subsequently had better fixed-horizon paths?

This is useful predictive/calibration evidence, but it is not executable or realized P&L.

### 2. Execution clock

Output:
`REALIZED_OR_EXECUTABLE_SIZING_EDGE`.

This requires:
- implemented Confirmed Fill Ledger with planScanDate + ledgerEpoch coverage;
- proof that BUY trigger timing/eligibility is allocator-invariant, or an explicit counterfactual trigger model;
- comparator share sizing;
- actual/defensible fill-price treatment;
- fees, taxes, odd-lot/minimum-fee and slippage treatment;
- untriggered planned capital left as cash.

Current confirmed-fill ledger remains a Class-B proposal and is not implemented, so execution-edge evidence is still blocked.

### Trigger-conditioning correction

BUY-only rows must not replace the all-selected predictive estimand.

However, for realized allocation economics, conditioning on actual BUY/fill is necessary. It therefore becomes a separate execution-clock estimand with coverage/invariance requirements rather than being mixed into the selection-path cohort.

### Cost correction

Trading costs belong to the execution clock.
Do not subtract guessed trading costs from a formal-close paper-path edge and call the result realized net P&L.

New executable paper-path module:
`research/priority_score_sizing_edge_v0_2.mjs`.

Two-clock protocol:
`research/priority_score_sizing_two_clock_protocol_v0_2.json`.

PR-043 v0.1 is retained as an algebra/history artifact but its realized-P&L wording is superseded.

Status:
`SEMANTIC_CORRECTION_FROZEN / PAPER_EDGE_READY / EXECUTION_EDGE_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-045 — initial BUY trigger is structurally allocation-invariant; execution is not (2026-09-27)

A source-level audit traced the complete initial-entry path:
`evaluatePullback/evaluateMomentum -> evaluateStop/evaluateProfit -> buildFinalDecision -> applyPlanValidity -> evaluateOperationSignals`.

Across the upstream decision chain, the following sizing fields are absent:
- allocationRatio;
- totalAllocation;
- firstAmount / firstShares;
- secondAmount / secondShares;
- PriorityScore.

For an unheld name (`positionStage=NONE`), initial BUY eligibility is currently:

`finalDecision == buy`
AND
`maxChase is absent OR currentPrice <= maxChase`.

Only after that predicate passes does the signal payload attach:
`firstAmount` and `firstShares`.

### Research consequence

For current vs alternative sizing rules that preserve the same selected name and all non-sizing plan fields, the same observed **initial BUY signal timestamp** can be used as common trigger evidence, provided:
- the plan/research generation is certified;
- the Worker trigger contract/version is the same;
- the same market data are used.

This materially reduces one execution-clock uncertainty.

### What is NOT invariant

The finding does not certify:
- identical fill price;
- identical fill probability;
- identical slippage;
- orderability if a counterfactual allocation rounds to zero shares;
- ADD lifecycle after first execution;
- later REDUCE/SELL realized economics.

Therefore an alternative allocator may share the initial trigger event, but its amount, shares, cash left idle and execution friction still require separate reconstruction.

A source-contract test is added so any future introduction of PriorityScore/allocation fields into initial BUY eligibility fails Tier-A CI instead of silently changing the counterfactual assumption.

Artifact:
`research/initial_buy_trigger_allocation_invariance_v0_1.json`.

Test:
`tests/test_initial_buy_trigger_allocation_invariance_v0_1.mjs`.

Status:
`INITIAL_BUY_TRIGGER_STRUCTURALLY_ALLOCATION_INVARIANT / EXECUTION_NOT_INVARIANT`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-046 — counterfactual initial-BUY orderability gate (2026-09-27)

PR-045 proved the initial BUY trigger predicate is structurally independent of PriorityScore/allocation sizing. PR-046 addresses the next execution question:

`If the trigger is shared, can the alternative allocator actually place at least one share at that trigger?`

Current source semantics:
- plan preview firstShares uses `sharesFor(firstAmount,buyHigh)`;
- live BUY push recomputes suggestedShares using `sharesFor(signal.amount,currentPrice)`;
- `sharesFor = floor(amount/price)`.

Therefore counterfactual execution must **not** copy the current plan's precomputed firstShares.

For a shared observed BUY trigger:
1. take the alternative allocator's allocation;
2. apply the frozen first-tranche ratio (60%);
3. use the observed trigger price;
4. recompute `floor(firstAmount / triggerPrice)`.

If that result is zero, the counterfactual is non-orderable at that trigger and execution comparison fails closed for that name.

This still does not certify:
- fill probability;
- identical fill price;
- partial fill;
- slippage/fees;
- ADD execution.

Executable research gate:
`research/counterfactual_initial_buy_orderability_v0_1.mjs`.

Contract:
`research/counterfactual_initial_buy_orderability_contract_v0_1.json`.

Status:
`ORDERABILITY_GATE_READY / FILL_MODEL_STILL_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-049 — journalTradeStats is signal-path return, not realized P&L (2026-09-27)

A source-level semantics audit of `journalTradeStats()` confirms:

- entry = first persisted BUY signal `market_price`;
- exit = first persisted SELL or STOP_LOSS signal `market_price` after that BUY;
- return = signal-price percentage change;
- OPEN episodes are excluded from completed win/loss/flat statistics;
- ADD/REDUCE/PROFIT_CHECK remain recorded but do not alter the main return formula;
- allocation amount/shares do not enter the return calculation;
- broker fills, partial fills, fees and slippage do not enter.

Therefore the correct name is:

`SIGNAL_PATH_ROUND_TRIP_RETURN`.

It must not be interpreted as:
- realized broker return;
- execution P&L;
- allocation/sizing P&L;
- unbiased all-plan win probability.

### Censoring

The reported winRate and averageReturnPct are conditional on episodes that already produced both:
1. a positive durable BUY signal row; and
2. a later qualifying SELL/STOP_LOSS signal row.

OPEN episodes are right-censored and excluded. The metric can therefore change simply because open episodes later terminate.

### Portfolio Risk implication

This metric cannot validate PriorityScore sizing because:
- the main return is unweighted by allocation;
- amount/shares are absent;
- fill evidence is absent;
- costs are absent.

It remains useful as a signal-lifecycle diagnostic and as descriptive positive-event path evidence, provided the terminology and coverage limits are explicit.

Artifact:
`research/signal_path_return_semantics_v0_1.json`.

Test:
`tests/test_signal_path_return_semantics_v0_1.mjs`.

Status:
`SIGNAL_PATH_METRIC_ONLY / REALIZED_PNL_NOT_PROVEN / SIZING_VALIDATION_FORBIDDEN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-048 — positive BUY signal can reconstruct live suggestedShares exactly (2026-09-27)

PR-047 established that a persisted V8.5 BUY signal row is strong positive evidence of the formal BUY signal's `market_price` and `occurred_at`.

Current runtime `buildPushPayload` recomputes BUY `suggestedShares` as:
`floor(signal.amount / result.currentPrice)`.

V8.5 signal journal persists from that same event:
- `signal_amount = signal.amount`;
- `market_price = result.currentPrice`.

Therefore a complete positive BUY row exactly reconstructs:
`live suggestedShares = floor(signal_amount / market_price)`.

This is signal-side quantity only, not broker execution.

Certified:
event identity, timestamp, signal price, signal amount, exact signal-side suggestedShares and one-share orderability.

Not certified:
broker order acknowledgement, actual fill, fill price/probability, partial fill, fees, slippage, or NO-BUY absence.

Artifacts:
`research/buy_signal_quantity_reconstruction_v0_1.mjs`;
`research/buy_signal_quantity_reconstruction_contract_v0_1.json`.

Status:
`POSITIVE_BUY_SIGNAL_QUANTITY_RECONSTRUCTABLE / FILL_EVIDENCE_STILL_SEPARATE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-050 — Production positive-signal audit: one BUY, no sizing identification yet (2026-09-27)

Read-only Production audit run:
- workflow run: `36329306700`;
- job: `108648065662`;
- endpoint: `/api/journal?days=365`;
- no Production writes.

Observed durable signal rows:
- total signals = 1;
- BUY = 1;
- terminal SELL/STOP_LOSS = 0.

The positive BUY is:
- symbol: 3006;
- plan scan date: 2026-09-21;
- trade date: 2026-09-22;
- signal time: 2026-09-22 11:31:33 Taipei;
- signal market price: 282.5;
- signal amount: NT$42,000;
- exact reconstructed live suggestedShares: 148;
- plan linkage: positive;
- selected-count on the plan date: 1.

### What this real row establishes

It validates the PR-047/048 positive-event evidence chain against Production:
`selected plan -> BUY signal event -> exact signal price -> exact amount -> exact suggestedShares`.

### What it cannot establish

The 2026-09-21 plan date contains only one selected name.
Therefore current / equal-capital / equal-risk allocation comparisons are identical and this row is **non-identifying for sizing**.

There is no terminal SELL/STOP_LOSS signal row yet, so no completed signal-path round trip exists.

There is still no broker-confirmed fill ledger, so no realized P&L exists in the research evidence.

The signal reader remains bounded at LIMIT 6000 with no truncation flag; missing BUY rows remain UNKNOWN rather than NO-BUY.

Durable receipt:
`research/positive_signal_production_audit_receipt_20260927.json`.

Status:
`ONE_POSITIVE_BUY_CONFIRMED / SINGLE_NAME_NONIDENTIFYING_FOR_SIZING / NO_TERMINAL_SIGNAL / REALIZED_PNL_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


### PR-050 addendum — Production plan-preview vs live suggested-share drift

For the same 3006 BUY:
- plan buyHigh = 287.08;
- stored plan firstShares = 146;
- recomputing NT$42,000 / 287.08 also gives 146;
- live BUY trigger price = 282.5;
- live suggestedShares = 148.

So the observed Production row confirms the designed semantic split:
`plan firstShares = preview at plan price`,
while
`live suggestedShares = recomputed at observed trigger price`.

The +2 shares are not a fill claim. They prove only that plan preview quantity must not substitute for live signal-side quantity in execution research.


## PR-051 — ledger-valid fill is not automatically sizing-attributable (2026-09-27)

The Confirmed Fill Ledger v0.2.1 correctly keeps `signalEventId` optional for general holdings evidence. That is necessary because baselines and externally/manual-originated fills may not have a Formal signal.

However, Portfolio Risk execution research needs a stricter second-layer classifier.

A fill is `ATTRIBUTION_ELIGIBLE` only when:
- `fill.signalEventId` exactly matches a durable signal event;
- action is compatible with signal type;
- symbol matches;
- planScanDate matches;
- fill effectiveAt is not earlier than signal occurredAt.

A ledger-valid fill without signalEventId is now explicitly:
`UNATTRIBUTED_EXECUTION`.

It may still update actual holdings, but it is excluded from:
- PriorityScore sizing realized-edge analysis;
- signal-to-fill slippage attribution;
- trigger-to-fill latency attribution.

This preserves a clean distinction:
`position accounting evidence != strategy-attribution evidence`.

Artifacts:
`research/execution_attribution_linkage_v0_1.mjs`;
`research/execution_attribution_linkage_spec_v0_1.json`.

Status:
`ATTRIBUTION_CLASSIFIER_READY / CLASS_B_LEDGER_PROPOSAL_NEEDS_RESEARCH_ELIGIBILITY_ADDENDUM`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-052 — linked fill friction is measurable; fill-rate/partial-fill is not (2026-09-27)

After PR-051 separates ledger validity from signal attribution, PR-052 freezes the next execution boundary.

For a positively linked signal + confirmed fill pair, research can measure:
- signal occurrence -> fill effective time latency;
- fill effective time -> confirmation time lag;
- side-aware signal-price vs fill-price slippage;
- confirmed filled shares.

Adverse slippage is defined as:
- BUY/ADD: `(fillPrice - signalPrice) / signalPrice`;
- SELL/REDUCE: `(signalPrice - fillPrice) / signalPrice`.

Positive means adverse; negative means favorable.

### Critical non-identifiability

Filled shares alone do **not** identify:
- whether an order was actually submitted;
- submitted order quantity;
- fill probability;
- partial-fill fraction;
- cancel/replace path.

A system suggestion of 148 shares followed by a confirmed 100-share fill does not prove a 100/148 partial fill. The user may have intentionally submitted only 100 shares.

Therefore fill-rate research requires a separate broker/order receipt layer with:
- stable order id;
- submittedAt;
- side/action;
- submitted shares;
- order type/limit price where relevant;
- broker acknowledgement/status history;
- stable linkage to signalEventId and fill events.

The Confirmed Fill Ledger remains sufficient for actual position state and, when signal-linked, signal-to-fill slippage/latency. It is not sufficient for order fill-rate inference.

Artifacts:
`research/linked_fill_friction_v0_1.mjs`;
`research/linked_fill_friction_semantics_v0_1.json`.

Status:
`FILL_FRICTION_MEASURABLE_IF_LINKED / ORDER_FILL_RATE_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-053 — net execution sizing evidence ladder cross-links Trading Frictions (2026-09-27)

Portfolio Risk must not invent a separate transaction-cost model. PR-053 reuses the existing Trading Frictions evidence hierarchy and turns it into a fail-closed claim-eligibility ladder.

A sizing sample can reach execution economics only after all non-cost prerequisites are positively established:
- selected-generation certification;
- positive durable Formal BUY signal;
- counterfactual orderability at the shared initial trigger;
- confirmed fill positively attributed back to the durable signal;
- same selected names and same planned deployment across allocator comparators;
- counterfactual execution rule frozen;
- untriggered planned capital explicitly remains cash;
- attributed terminal fill or a predeclared fixed execution horizon with valid mark.

Claim tiers are:
1. NOT_EXECUTION_ELIGIBLE;
2. GROSS_EXECUTION_SIZING_EDGE_ELIGIBLE;
3. NET_EXPLICIT_SIZING_EDGE_ELIGIBLE;
4. NET_ALL_IN_SIZING_EDGE_ELIGIBLE.

### Cost evidence remains component-wise

Commission, tax and slippage each retain:
`ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN`.

Rules:
- UNKNOWN commission is never zero;
- modeled commission/tax is never labeled ACTUAL;
- missing commission blocks NET_EXPLICIT and NET_ALL_IN;
- missing slippage may still allow NET_EXPLICIT when commission/tax are sufficiently specified, but blocks NET_ALL_IN;
- any modeled component prevents the label `ACTUAL_NET_EXECUTION`.

This deliberately separates:
`Can the arithmetic be computed?`
from
`How strong is the evidence behind the computed net result?`

### Current Production classification

Current Production has one durable positive BUY for 3006, but:
- its plan date is single-name and therefore non-identifying for allocator comparison;
- Confirmed Fill Ledger is not implemented;
- no attributed terminal fill exists.

So the strongest current sizing claim remains:
`NOT_EXECUTION_ELIGIBLE`.

Artifacts:
`research/net_execution_sizing_evidence_ladder_v0_1.mjs`;
`research/net_execution_sizing_evidence_ladder_spec_v0_1.json`.

Status:
`EVIDENCE_LADDER_FROZEN / CURRENT_PRODUCTION_NOT_EXECUTION_ELIGIBLE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-054 — transaction-tax class must be positively evidenced (2026-09-27)

Portfolio Risk reuses Trading Frictions tax semantics and adds a fail-closed provenance classifier.

Evidence hierarchy:
- ACTUAL: broker statement/import or verified external record directly reports the tax amount;
- MODELED verified day-trade eligible: actual same-account, same-symbol, same-day buy+sell fills **plus** independently verified reduced-tax eligibility;
- MODELED ordinary stock sale: Taiwan stock sell fill plus positively false reduced-tax eligibility;
- UNKNOWN: eligibility/class is not positively evidenced.

The classifier deliberately does **not** contain a hard-coded tax rate. A modeled class still needs a date-valid official/broker rate source before tax NTD can be calculated.

Forbidden shortcuts:
- same-day BUY+SELL signals -> day-trade tax;
- same-day fills alone -> reduced tax;
- current legal rate applied backward without date validation;
- modeled tax labeled ACTUAL;
- UNKNOWN silently defaulted to ordinary or reduced rate.

This matters for sizing research because allocator changes can alter executed quantities while tax class is a separate transaction fact. Tax uncertainty must not be hidden inside a generic transaction-cost percentage.

Artifacts:
`research/transaction_tax_evidence_classifier_v0_1.mjs`;
`research/transaction_tax_evidence_classifier_spec_v0_1.json`.

Status:
`TAX_CLASS_PROVENANCE_FAIL_CLOSED / RATE_LOOKUP_SEPARATE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-055 — commission provenance requires complete broker schedule semantics (2026-09-27)

Trading Frictions already rejects a universal commission assumption. PR-055 converts that rule into a fail-closed classifier for Portfolio Risk sizing research.

Evidence hierarchy:
- ACTUAL: charged commission directly evidenced by broker statement/import or verified external record;
- MODELED: broker-specific schedule is complete enough to reproduce the fee;
- UNKNOWN: anything less.

A MODELED fee requires all of:
- broker-specific rate;
- broker-specific minimum commission;
- verified calculation method;
- verified rounding policy;
- applicable execution channel;
- executed notional;
- verified schedule source.

The initial weaker idea that `rate + minimum` alone is sufficient was explicitly rejected before merge. It can be wrong when rounding, odd-lot/channel exceptions, promotions or other schedule mechanics differ.

For the currently implemented model, only the positively verified method:
`MAX_RATE_MINIMUM`
is accepted, with an explicit ROUND/FLOOR/CEIL/NONE policy.

### Sizing consequence

Alternative sizing can cross minimum-fee kinks, so equal total portfolio deployment does not imply equal incremental commission.

Forbidden:
- infer the owner's negotiated rate from a market reference threshold;
- invent a universal minimum;
- use planned/signal notional as ACTUAL executed notional;
- label modeled fees ACTUAL;
- convert UNKNOWN commission to zero.

Artifacts:
`research/commission_evidence_classifier_v0_1.mjs`;
`research/commission_evidence_classifier_spec_v0_1.json`.

Status:
`COMMISSION_PROVENANCE_FAIL_CLOSED / COMPLETE_BROKER_SCHEDULE_REQUIRED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-056 — ADD trigger is allocation-invariant only conditional on independently proven FIRST state (2026-09-27)

A source audit of the second-entry path shows that ADD eligibility itself does not read:
- PriorityScore;
- allocationRatio;
- totalAllocation;
- secondAmount;
- secondShares.

The ADD branch is entered only after the common price/K-line decision reaches `buy`, the maxChase guard passes, and `positionStage === FIRST`.

Only after that eligibility is satisfied are `secondAmount` and `secondShares` attached to the ADD signal.

### Critical condition

This is **conditional invariance**, not unconditional invariance.

A counterfactual allocator may reuse the observed ADD trigger timestamp only when both execution paths have independently and validly reached FIRST.

The current path's FIRST state must never be copied into the comparator by assumption.

Thus full two-stage execution research requires:
1. independently orderable comparator FIRST;
2. attributed/valid first-fill state for the comparator execution model;
3. then shared ADD trigger timing under identical non-sizing plan/code/market-data conditions;
4. comparator secondAmount/secondShares recomputed separately;
5. fill/slippage/cost evidence handled separately.

Artifact:
`research/add_trigger_conditional_invariance_v0_1.json`.

Test:
`tests/test_add_trigger_conditional_invariance_v0_1.mjs`.

Status:
`ADD_TRIGGER_CONDITIONALLY_ALLOCATION_INVARIANT / FIRST_STATE_EXECUTION_GATED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-057 — sizing quantization cascade: score weight is discretized twice before execution (2026-09-27)

Formal post-selection capital does not flow continuously from PriorityScore into shares.

The current chain is:

1. continuous score-proportional allocation under the 35% per-name cap;
2. planned allocation floored to NT$1,000;
3. planned capital split into 60% FIRST + 40% ADD budgets;
4. plan-preview shares floored at buyHigh.

This creates two distinct pre-execution residuals:
- allocation implementation shortfall from the NT$1,000 floor;
- share-floor residual cash from integer-share conversion.

The second residual is especially important for high-price names: it is a modular floor effect, not a smooth function of price. A lower trigger price can increase suggested shares yet leave a larger residual cash amount.

Production 3006 already provides a concrete signal-side counterexample:
- first budget = NT$42,000;
- plan preview at buyHigh 287.08 -> 146 shares -> NT$86.32 residual;
- live BUY signal at 282.5 -> 148 shares -> NT$190 residual.

So “better/lower trigger price always improves capital utilization” is false under integer-share flooring.

### Evidence boundary

The new metric is:
`PLAN_PREVIEW_SUGGESTED_NOTIONAL`.

It is not:
- submitted order notional;
- filled notional;
- actual deployed capital.

Alternative allocators must use their own pre-registered quantization rule; continuous equal-capital/equal-risk allocations cannot be compared against current discrete shares without that extra step.

Artifacts:
`research/sizing_quantization_cascade_v0_1.mjs`;
`research/sizing_quantization_cascade_spec_v0_1.json`;
`tests/portfolio_risk_sizing_quantization_readonly_audit.mjs`.

Status:
`QUANTIZATION_CASCADE_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-057 Production result — share quantization does not explain away current risk concentration

Read-only Production run `36331652461` / job `108654620345` applied the frozen quantization cascade to 2026-09-18.

Current PriorityScore sizing:
- nominal deploy target = NT$170,000;
- planned allocation after NT$1,000 flooring = NT$168,000;
- plan-preview suggested notional after integer-share flooring = NT$167,471.13;
- NT$1,000-floor shortfall = NT$2,000;
- share-floor residual = NT$528.87;
- total nominal-to-preview shortfall = NT$2,528.87.

Risk concentration:
- planned projected-stop-risk HHI = 0.37723809;
- current plan-preview HHI = 0.37670778.

So integer-share flooring slightly attenuates current HHI by only 0.00053031 (~0.14% relative).

Applying the same share-floor rule to same-deployment equal capital:
- preview HHI = 0.35538974;
- current minus equal-capital HHI = +0.02131804 (~6.00% above the comparator);
- current preview projected stop-risk is NT$164.45 higher.

Applying the same share-floor rule to the continuous 35%-cap equal-risk diagnostic:
- preview HHI = 0.33428138;
- current minus comparator HHI = +0.04242640 (~12.69% above the comparator);
- current preview projected stop-risk is NT$520.70 higher.

Therefore the explanation:
`current risk concentration is mainly a share-floor / price-quantization artifact`
is rejected on the 2026-09-18 witness.

Important caveat:
the capped equal-risk comparator is still continuous at the **allocation** layer. PR-057 only adds share/tranche quantization to it. A true NT$1,000-grid same-deployment comparator remains the next structural falsification.

Durable receipt:
`research/sizing_quantization_production_receipt_20260928.json`.

Status:
`SHARE_QUANTIZATION_EXPLANATION_FALSIFIED_ON_WITNESS / GRID_EQUAL_RISK_NEXT / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-058 — NT$1,000-grid equal-risk counterfactual survives full plan-preview quantization (2026-09-28)

PR-057 showed that integer-share flooring does not explain away the 2026-09-18 PriorityScore risk-concentration witness. PR-058 removes the last major structural idealization from the equal-risk comparator: continuous allocation amounts.

### Frozen grid method

Constraints:
- same three selected names;
- same NT$168,000 current planned deployment;
- same 35% per-name cap;
- NT$1,000 allocation grid;
- same buyHigh-to-stop conservative risk definition.

Starting from the continuous capped equal-risk target, each allocation is floored to the NT$1,000 grid. Residual NT$1,000 units are then assigned deterministically to the eligible name that minimizes squared projected-risk-space error to the continuous target.

On 2026-09-18 this yields:
- 2006 = NT$70,000;
- 3105 = NT$41,000;
- 6133 = NT$57,000.

No outcome is used to choose those amounts.

### Before share flooring

Grid equal-risk:
- projected stop-risk = NT$5,965.732;
- HHI = 0.33438488;
- max/min projected-risk ratio = 1.137143.

### After the same 60/40 + integer-share preview flooring

Grid equal-risk:
- preview suggested notional = NT$167,697.54;
- share-floor residual = NT$302.46;
- preview projected stop-risk = NT$5,951.36;
- preview risk HHI = 0.33434138.

Current PriorityScore sizing:
- preview suggested notional = NT$167,471.13;
- preview projected stop-risk = NT$6,459.97;
- preview risk HHI = 0.37670778.

Therefore current minus grid equal-risk is:
- +NT$508.61 projected stop-risk;
- +0.04236640 risk HHI;
- HHI is ~12.67% higher relative to the grid comparator.

Critically, the grid comparator actually carries **NT$226.41 more plan-preview suggested notional** than current, yet still has materially lower projected stop-risk and concentration.

So two counter-explanations are rejected on this witness:
1. equal-risk only looks better because its allocations were continuous/non-executable;
2. equal-risk only looks safer because it leaves more cash unused after share flooring.

This materially strengthens the structural finding, but it still does not prove equal-risk sizing has better realized returns.

Durable receipt:
`research/grid_equal_risk_production_receipt_20260928.json`.

Status:
`GRID_AND_SHARE_QUANTIZATION_COUNTEREVIDENCE_SURVIVES / STRUCTURAL_RISK_CONCENTRATION_STRENGTHENED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-059 — exhaustive grid search: exact optimum shifts after share quantization (2026-09-28)

The NT$1,000-grid structural search was upgraded from a target-following construction to **complete enumeration**.

For 2026-09-18, under:
- the same three selected names;
- the same NT$168,000 planned deployment;
- the same 35% per-name cap;
- at least one NT$1,000 unit per selected name;

there are exactly **946 feasible grid states**, and all were evaluated.

### PRE_SHARE objective

Before 60/40 tranche and integer-share flooring, the unique minimum-HHI and unique minimum-max/min allocation are both:

- 2006 = NT$70,000;
- 3105 = NT$41,000;
- 6133 = NT$57,000.

Projected risk:
- total = NT$5,965.732;
- HHI = 0.3343848759;
- max/min = 1.13714329.

This independently verifies the PR-058 70/41/57 grid allocation as the **global pre-share optimum**, not merely a heuristic near the continuous target.

### POST_SHARE objective

After applying the exact same:
- 60/40 tranche split;
- integer-share floor at buyHigh;

the unique minimum-HHI and minimum-max/min allocation both shift to:

- 2006 = NT$70,000;
- 3105 = NT$42,000;
- 6133 = NT$56,000.

Its plan-preview geometry:
- suggested notional = NT$167,227.36;
- projected stop-risk = NT$5,940.8663;
- HHI = 0.3342784042;
- max/min = 1.1265985.

Current PriorityScore sizing remains:
- 50k / 64k / 54k;
- preview projected stop-risk = NT$6,459.97;
- HHI = 0.37670778.

Thus the exact minimizing allocation is **objective/quantization-sensitive by one NT$1,000 unit**, but the conclusion that current sizing is materially more concentrated survives either semantic definition.

### Important cash-drag nuance

The post-share HHI optimum has NT$243.77 less preview suggested notional than current, so that optimum alone cannot prove its lower risk is independent of cash drag.

The separate PRE_SHARE-global optimum 70/41/57 still supplies that counterexample:
after the same share flooring it carries NT$167,697.54 preview notional, **NT$226.41 more than current**, while retaining much lower projected-risk concentration.

Therefore:
- exact comparator allocation is not invariant across structural objectives;
- the structural concentration finding is robust;
- the earlier cash-drag falsification remains supported by a distinct comparator.

Durable receipt:
`research/exhaustive_grid_risk_optima_production_receipt_20260928.json`.

Status:
`DISCRETE_OBJECTIVE_SENSITIVITY_CONFIRMED / UNIQUE_OPTIMA_BY_SEMANTIC / STRUCTURAL_CONCLUSION_ROBUST / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-060 — stop-risk entry-reference sensitivity test (2026-09-28)

The current Portfolio Risk structural result uses `buyHigh` as the conservative planned entry reference.

PR-060 tests a direct counter-hypothesis:

`The observed 2026-09-18 risk concentration is only an artifact of choosing buyHigh.`

For every reconstructable multi-name date, projected stop-risk is recomputed under three frozen references:
- BUY_LOW;
- MIDPOINT = (buyLow + buyHigh) / 2;
- BUY_HIGH.

For each reference, the audit compares:
1. current PriorityScore-proportional allocation;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid global minimum HHI under the same 35% per-name cap.

The grid search uses the same selected names and same planned deployment. No realized price/fill is assumed.

Interpretation is pre-registered:
- if current remains more concentrated than equal-capital and the global grid minimum across all three references, the structural conclusion survives reference-price falsification;
- if the gap disappears or reverses at BUY_LOW/MIDPOINT, the earlier conclusion must be downgraded as reference-sensitive.

Artifacts:
`research/entry_reference_risk_sensitivity_v0_1.mjs`;
`research/entry_reference_risk_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_entry_reference_sensitivity_readonly_audit.mjs`.

Status:
`REFERENCE_SENSITIVITY_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-060 Production result — buyHigh reference does not create the concentration finding

Read-only Production run `36350840822` / job `108709088620` tested the only reconstructable multi-name date, 2026-09-18, under three entry references.

### BUY_LOW

Current HHI = 0.4252711642.  
Equal-capital HHI = 0.3950931017.  
Exhaustive NT$1,000-grid minimum HHI = 0.3486465228.

### MIDPOINT

Current HHI = 0.3934504209.  
Equal-capital HHI = 0.3683594007.  
Exhaustive grid minimum HHI = 0.3377017368.

### BUY_HIGH

Current HHI = 0.3772380854.  
Equal-capital HHI = 0.3558588621.  
Exhaustive grid minimum HHI = 0.3343850287.

3105 is the widest stop-risk name under every reference:
- buyLow: 3.570699%;
- midpoint: 4.292115%;
- buyHigh: 5.002817%.

The key counter-hypothesis is therefore rejected:

`The structural concentration exists only because risk was measured from conservative buyHigh.`

In fact the current-minus-equal-capital HHI gap is **largest at buyLow** (0.0301780625) and **smallest at buyHigh** (0.0213792233). Conservative buyHigh does not exaggerate the witness; on this date it attenuates the relative concentration gap.

The exact risk-minimizing grid allocation moves with the reference price (70/36/62 at buyLow, 70/39/59 at midpoint, 70/41/57 at buyHigh), so the exact comparator remains model-sensitive. The direction of the structural conclusion does not.

Durable receipt:
`research/entry_reference_risk_sensitivity_production_receipt_20260928.json`.

Status:
`ENTRY_REFERENCE_ARTIFACT_FALSIFIED / STRUCTURAL_CONCLUSION_STRENGTHENED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-061 — separate stop-geometry concentration from PriorityScore sizing increment (2026-09-28)

PR-033 through PR-060 show that current PriorityScore sizing compounds with heterogeneous stop distance. PR-061 adds an important anti-overclaim decomposition.

Equal-capital is used as a **descriptive bridge**, not a causal counterfactual claim.

For a selected set of N names:

`current HHI - 1/N = (equal-capital HHI - 1/N) + (current HHI - equal-capital HHI)`.

The first term describes concentration already present when capital is neutral across names but stop distances differ.

The second term is the incremental concentration associated with the current PriorityScore capital tilt on the same names.

A second bridge uses the exhaustive feasible grid minimum:

`current HHI - global-min HHI = (equal-capital HHI - global-min HHI) + (current HHI - equal-capital HHI)`.

### Governance firewall

These components are algebraically exact but **not statistically independent and not causal factor attribution**.

Therefore future reporting must not say:
`PriorityScore causes all observed risk concentration`.

The correct statement is:
`stop geometry already creates unequal projected-risk contributions under equal capital; current PriorityScore sizing adds an additional concentration increment on the observed date.`

Executable decomposition:
`research/risk_concentration_bridge_v0_1.mjs`.

Audit:
`tests/risk_concentration_bridge_audit_v0_1.mjs`.

Status:
`GEOMETRY_AND_SIZING_COMPONENTS_SEPARATED / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


### PR-061 Production bridge result

Using the PR-060 2026-09-18 reference sensitivity:

- BUY_LOW theoretical excess: stop-geometry bridge 67.175577%, current sizing increment 32.824423%.
- MIDPOINT theoretical excess: stop-geometry bridge 58.263081%, current sizing increment 41.736919%.
- BUY_HIGH theoretical excess: stop-geometry bridge 51.305446%, current sizing increment 48.694554%.

Relative to the exhaustive feasible grid minimum:
- BUY_LOW: equal-capital-to-min gap 60.615721%, sizing increment 39.384279%;
- MIDPOINT: 54.992623% / 45.007377%;
- BUY_HIGH: 50.110389% / 49.889611%.

These percentages are an **algebraic bridge only**. They are not causal shares and must not be interpreted as independent variance decomposition.

The result corrects any one-sided reading of earlier PRs: heterogeneous stop geometry is already a material source of concentration under neutral capital, and PriorityScore sizing adds a separate incremental concentration on top.


## PR-062 — concentration-metric sensitivity falsification (2026-09-28)

PR-033 through PR-061 rely heavily on HHI to summarize projected stop-risk concentration.

PR-062 tests the counter-hypothesis:

`The structural conclusion is an artifact of HHI itself.`

Five metrics are evaluated on the same projected-risk contribution vectors:
- HHI;
- Gini;
- coefficient of variation;
- maximum contribution share;
- max/min positive contribution ratio.

For every metric and every entry reference (buyLow, midpoint, buyHigh), the Production audit compares:
1. current PriorityScore sizing;
2. equal capital;
3. the exhaustive global minimum over all legal NT$1,000-grid states under the same deployment and 35% cap.

The exact optimal allocation is allowed to differ by metric. Agreement of exact optima is **not** required.

The falsification target is directional:
if several non-HHI metrics no longer show current as more concentrated than equal capital/global minima, the HHI-based structural claim must be downgraded.

Artifacts:
`research/risk_metric_sensitivity_v0_1.mjs`;
`research/risk_metric_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_metric_sensitivity_readonly_audit.mjs`.

Status:
`METRIC_SENSITIVITY_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-062 Production result — concentration direction survives five metrics

Read-only Production run `36351672635` / job `108711424760` evaluated:
- 3 entry references: buyLow, midpoint, buyHigh;
- 5 concentration metrics: HHI, Gini, CV, maximum contribution share, max/min;
- all 946 legal NT$1,000-grid states per reference.

Directional result:
- current > equal-capital concentration: **15 / 15** metric-reference combinations;
- current > metric-specific global minimum: **15 / 15**.

The exact global optimum is objective-sensitive:
- buyLow: HHI/CV -> 70/36/62; Gini/MAX_SHARE/MAX_MIN -> 70/37/61;
- midpoint: HHI/CV -> 70/39/59; Gini/MAX_SHARE/MAX_MIN -> 70/40/58;
- buyHigh: all five metrics -> 70/41/57.

Therefore the counter-hypothesis
`the concentration result is only an HHI artifact`
is rejected on the 2026-09-18 witness.

At the same time, the optimum differences reinforce a governance constraint:
**there is no single objective-free “correct” risk-minimizing allocation.**
Exact comparator allocation depends on reference price, integer grid and concentration objective.

Durable receipt:
`research/risk_metric_sensitivity_production_receipt_20260928.json`.

Status:
`HHI_ARTIFACT_FALSIFIED / METRIC_DIRECTION_ROBUST / OPTIMUM_OBJECTIVE_SENSITIVE / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 — per-name cap creates a separate non-redistributed reserve channel (2026-09-28)

Source audit of `allocateAndBuildPlans()` confirms the sequence:

`rawRatio = deployRatio × scoreShare`

then

`ratio = min(35%, rawRatio)`

then each name is independently floored to NT$1,000.

There is no second redistribution pass for clipped score weight.

Therefore the selected-count deployment ratio is an **upper target**, not a guaranteed planned deployment.

Cap-binding score-share thresholds:
- 1 selected: raw ratio is exactly 35%; no extra cap reserve;
- 2 selected: one name binds above 58.333333% of selected score weight;
- 3–6 selected: one name binds above 41.176471%.

A deterministic hypothetical shows the mechanism:
scores 100/50/50 with NT$200,000 capital and 3 selected names imply an 85% nominal target (NT$170,000), but the top name is clipped from 42.5% to 35%. The clipped score weight creates NT$15,000 cap-induced reserve; NT$1,000 floors add another NT$1,000 reserve, leaving NT$154,000 planned.

This is not automatically a defect. It may be desirable risk control. The research question is whether this implicit extra cash materially contributes to under-deployment and whether the forgone exposure is economically justified.

Artifacts:
`research/score_cap_reserve_v0_1.mjs`;
`research/score_cap_reserve_spec_v0_1.json`;
`tests/portfolio_risk_score_cap_reserve_readonly_audit.mjs`.

Status:
`CAP_RESERVE_MECHANISM_PROVEN / PRODUCTION_OCCURRENCE_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 Production result — cap mechanism did not cause observed historical underdeployment

Read-only Production run `36352049564` / job `108712476115` checked both reconstructable plan dates.

### 2026-09-18

- selected names = 3;
- nominal deploy target = 85% × NT$200,000 = NT$170,000;
- highest score share = 3105 at 38.172502%;
- cap-binding threshold for 3+ names = 41.176471%;
- cap-binding symbols = none;
- cap-induced reserve = NT$0;
- planned allocation after NT$1,000 floors = NT$168,000;
- floor reserve = NT$2,000;
- designed strategic reserve = NT$30,000;
- remaining cash after plan = NT$32,000.

Therefore the extra NT$2,000 under the nominal 85% deployment target came entirely from NT$1,000 flooring, not the 35% cap.

### 2026-09-21

- selected names = 1;
- nominal deploy target = 35% = NT$70,000;
- raw ratio = cap = 35%;
- cap-induced reserve = NT$0;
- floor reserve = NT$0;
- remaining cash = NT$130,000, entirely the designed 65% strategic reserve.

The historical hypothesis
`current observed planned underdeployment was caused by non-redistributed cap clipping`
is rejected for the available dates.

The structural mechanism remains valid prospectively: if selected score concentration crosses the cap-binding threshold, clipped mass is not redistributed and will become extra reserve.

Durable receipt:
`research/score_cap_reserve_production_receipt_20260928.json`.

Status:
`CAP_RESERVE_MECHANISM_PROVEN / HISTORICAL_OCCURRENCE_NOT_OBSERVED / PROSPECTIVE_WATCH_ONLY / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 — FIRST-tranche risk concentration test (2026-09-28)

The existing structural evidence uses the full planned allocation, but actual live exposure may stop after FIRST and never reach ADD.

PR-064 tests whether the concentration finding survives when risk is restricted to the Formal 60% FIRST tranche.

For each multi-name date:
- FIRST amount = round(totalAllocation × 0.60);
- FIRST preview shares = floor(FIRST amount / buyHigh);
- FIRST projected stop-risk = FIRST preview notional × conservative stop-risk fraction.

The audit compares:
1. current PriorityScore sizing;
2. same-deployment equal capital;
3. the exhaustive NT$1,000-grid allocation with minimum FIRST-preview risk HHI under the same 35% cap.

The falsification target is lifecycle-stage sensitivity:
if current FIRST risk is no longer more concentrated than equal-capital/global minimum, the earlier full-plan conclusion must be downgraded.

This remains plan-preview geometry only. It does not assert a BUY trigger, submitted order, fill or realized exposure.

Artifacts:
`research/first_tranche_risk_concentration_v0_1.mjs`;
`research/first_tranche_risk_concentration_spec_v0_1.json`;
`tests/portfolio_risk_first_tranche_readonly_audit.mjs`.

Status:
`FIRST_TRANCHE_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 Production result — concentration survives in FIRST-only exposure

Read-only Production run `36352649582` / job `108714150360` tested 2026-09-18 using only the Formal 60% FIRST tranche.

Current PriorityScore sizing:
- FIRST preview notional = NT$100,609.21;
- FIRST projected stop-risk = NT$3,881.77;
- FIRST HHI = 0.3769514595;
- FIRST max/min risk = 2.44266646.

Equal-capital:
- FIRST preview notional = NT$100,484.28;
- FIRST HHI = 0.3551615396.

Exhaustive 946-state FIRST-only minimum:
- allocation = 70k / 42k / 56k;
- FIRST HHI = 0.3343161104.

Thus:
- current − equal FIRST HHI = +0.0217899199;
- current − global-min FIRST HHI = +0.0426353491.

Current FIRST-only HHI is also slightly **higher** than current full-plan preview HHI:
0.3769514595 vs 0.3767077818, delta +0.0002436776.

Therefore the counter-hypothesis
`the concentration only appears when the full 60%+40% planned position is counted`
is rejected on the available multi-name witness.

This remains plan-preview geometry, not realized exposure.

Durable receipt:
`research/first_tranche_risk_production_receipt_20260928.json`.

Status:
`FIRST_TRANCHE_CONCENTRATION_SURVIVES / LIFECYCLE_STAGE_ARTIFACT_FALSIFIED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 — ADD-tranche risk concentration test (2026-09-28)

PR-064 showed the structural concentration survives in FIRST-only preview exposure. PR-065 tests the complementary Formal 40% ADD tranche.

For each multi-name date:
- FIRST amount = round(totalAllocation × 0.60);
- ADD amount = totalAllocation − FIRST amount;
- ADD preview shares = floor(ADD amount / buyHigh);
- ADD projected stop-risk = ADD preview notional × conservative stop-risk fraction.

The audit compares:
1. current PriorityScore sizing;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid minimum ADD-preview HHI under the same 35% cap.

This is intentionally independent of execution state. It does **not** assume FIRST was filled or that ADD ever triggered.

The counter-hypothesis is:
`the concentration direction is specific to FIRST/full-plan and reverses or disappears in the smaller ADD tranche because share quantization differs.`

Artifacts:
`research/add_tranche_risk_concentration_v0_1.mjs`;
`research/add_tranche_risk_concentration_spec_v0_1.json`;
`tests/portfolio_risk_add_tranche_readonly_audit.mjs`.

Status:
`ADD_TRANCHE_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 Production result — concentration also survives ADD-only preview

Read-only Production run `36352942937` / job `108714975039` tested 2026-09-18 using only the Formal ADD tranche.

Current PriorityScore sizing:
- ADD preview notional = NT$66,861.92;
- ADD projected stop-risk = NT$2,578.20;
- ADD HHI = 0.3763426432;
- ADD max/min risk = 2.43024727.

Equal-capital:
- ADD preview notional = NT$67,155.16;
- ADD HHI = 0.3557339695.

Exhaustive 946-state ADD-only minimum:
- allocation = 70k / 42k / 56k;
- ADD HHI = 0.3342266703.

Thus:
- current − equal ADD HHI = +0.0206086737;
- current − global-min ADD HHI = +0.0421159729.

ADD-only HHI is slightly below current full-plan preview HHI:
0.3763426432 vs 0.3767077818, delta -0.0003651386.

Combined with PR-064, the concentration direction now survives:
- FIRST-only;
- ADD-only;
- FULL preview.

The stage changes the exact HHI slightly but does not reverse the structural result.

Durable receipt:
`research/add_tranche_risk_production_receipt_20260928.json`.

Status:
`ADD_TRANCHE_CONCENTRATION_SURVIVES / TRANCHE_STAGE_REVERSAL_FALSIFIED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
