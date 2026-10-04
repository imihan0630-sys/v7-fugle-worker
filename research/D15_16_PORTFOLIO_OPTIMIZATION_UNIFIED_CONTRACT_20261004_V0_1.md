# D15-16｜Unified Portfolio Optimization Research Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Status: MECHANISM_FALSIFICATION_CONTRACT_FROZEN
Formal Core impact: NONE

## Objective
Compare allocation methods under one evidence standard rather than treating each optimizer as an independent alpha signal.

Methods:
M0 equal capital / current capped baseline.
M1 fixed planned-stop-risk / risk budget.
M2 Mean-Variance / Efficient Frontier.
M3 Risk Parity / risk-budget family.
M4 Black-Litterman.
M5 Kelly family interface from D15-19.

Optimization is downstream capital allocation, not a new stock-selection vote.

## Common evidence firewall
Every method comparison must freeze:
- opportunity set and decision timestamp;
- expected-return / belief provenance where required;
- covariance / dependence provenance where required;
- constraints;
- capital and leverage policy;
- transaction-cost assumptions;
- liquidity / lot feasibility;
- benchmark;
- evaluation horizon and rebalancing rule.

UNKNOWN inputs remain UNKNOWN. Methods whose required inputs are unavailable are disabled rather than filled with zero.

## Mean-Variance falsification
Mechanism:
choose weights trading expected return against covariance risk.

Major failure channels:
- expected-return estimates are noisy and dominate weights;
- covariance inversion is unstable;
- small input changes create large weight changes;
- unconstrained solutions concentrate or lever;
- historical efficient frontier is not future efficient frontier.

Required challengers:
equal capital, capped allocation, shrinkage covariance, no-return minimum variance, risk budget.

No future-return optimized frontier is valid evidence.

## Risk Parity / Risk Budgeting falsification
Mechanism:
allocate so chosen risk contributions satisfy a budget, often reducing reliance on expected-return forecasts.

Failure channels:
- volatility / covariance still require estimation;
- equal risk contribution is not equal economic diversification;
- correlated clusters can remain dominant;
- low-volatility assets can receive large capital weights;
- leverage may be required for target return;
- risk parity does not prove alpha.

Risk-budget rules must be frozen before outcome evaluation.

## Black-Litterman falsification
Mechanism:
combine an equilibrium prior with explicit views and confidence to produce posterior expected returns before optimization.

Failure channels:
- equilibrium prior depends on benchmark / market-cap assumptions;
- view matrix and confidence can encode discretionary hindsight;
- tau / covariance / risk-aversion choices affect posterior weights;
- a sophisticated posterior does not repair invalid PIT views.

D16-25 owns probability/calibration where views are probabilistic; D15-16 owns allocation after admissible beliefs are supplied.

## Kelly family position
Kelly is an objective-function alternative, not a privileged optimizer.

It requires validated payoff distributions and maximizes expected log wealth. It must be compared on common support against M0-M4 and remains subject to D15-19 tail, Regime, dependence, cost and survival firewalls.

## Unified robustness matrix
For every optimizer report:
- input eligibility coverage;
- weight concentration and HHI;
- turnover;
- cost sensitivity;
- liquidity / lot implementation gap;
- estimation perturbation sensitivity;
- Regime stability;
- drawdown / tail loss;
- realized or OOS utility under the method's own preregistered objective;
- redundancy versus simpler baselines.

A method is not better merely because it optimizes its own in-sample objective.

## Promotion gates
L2: mechanism + falsification + input ownership + common benchmark contract.
L3: genuine Taiwan PIT data supports at least one technically valid common-support replay for one nontrivial optimizer family.
L4: OOS / Prospective Shadow across independent dates.
L5: multi-Regime, costs, estimation-error, dependence, constraints and redundancy robustness.

No Formal candidate before L5-quality evidence.

## Exact next
Build an executable input-eligibility matrix that answers which methods are computable from a given receipt without imputing missing expected returns, covariance, calibrated distribution, costs or constraints.

Then connect the D15-19 Kelly replay harness as M5 without changing its evidence status.
