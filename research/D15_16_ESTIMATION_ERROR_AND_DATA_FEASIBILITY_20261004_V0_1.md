# D15-16｜Estimation Error and Taiwan Data Feasibility V0.1

Updated: 2026-10-04 Asia/Taipei
Status: L2_DEEPENED / REAL_OPTIMIZER_REPLAY_DATA_BLOCKED
Formal Core impact: NONE

## Source audit result
The repository does not currently prove an immutable PIT-synchronized historical return panel suitable for reconstructing old covariance states. Existing portfolio-risk research explicitly prohibits using current mutable history to invent historical correlation or cluster states.

PriorityScore is also not a calibrated expected-return receipt. It cannot be substituted for mean return in Mean-Variance optimization.

No genuine Black-Litterman equilibrium-prior plus preregistered view/confidence receipt was found.

Therefore M2 Mean-Variance, M3 Risk Parity and M4 Black-Litterman cannot yet claim a genuine Taiwan PIT replay.

## Mean-Variance falsification
Mean-Variance weights depend on both expected returns and covariance. A small change in estimated mean can materially change the optimum even when the opportunity set is unchanged.

Required future stress:
- perturb expected-return vector without changing realized outcomes;
- perturb covariance / correlation;
- compare raw, shrinkage and constrained solutions;
- report weight turnover and concentration;
- compare against equal-capital and risk-budget baselines.

A historical efficient frontier built with future-known returns is invalid.

## Risk Parity falsification
Risk Parity reduces direct dependence on expected-return estimates but does not remove covariance estimation.

Equal risk contribution is not equal independent economic bets. Correlated assets may remain one risk cluster.

Future replay must compare:
- diagonal / independence approximation;
- PIT covariance;
- shrinkage covariance;
- concentration and cluster diagnostics.

If covariance provenance is UNKNOWN, historical portfolio-optimal Risk Parity is UNKNOWN.

## Black-Litterman falsification
Black-Litterman can regularize expected-return estimation only if its prior, views and confidence are genuinely decision-time inputs.

Every view requires:
- immutable viewReceiptId;
- viewKnownAt <= decisionAt;
- confidence frozen by decisionAt;
- no outcome-informed confidence revision;
- explicit mapping to assets;
- explicit prior and covariance provenance.

A posterior produced from hindsight views is not a valid improvement over Mean-Variance.

## Current data verdict
M0 baseline: structurally available on reconstructable plan dates.
M1 planned-stop-risk comparator: partial historical plan evidence exists, but it is a risk-budget comparator rather than proof of an optimized Risk Parity portfolio.
M2 Mean-Variance: BLOCKED by PIT expected-return and covariance receipts.
M3 Risk Parity: BLOCKED by PIT covariance receipt.
M4 Black-Litterman: BLOCKED by PIT covariance, equilibrium-prior and frozen view/confidence receipts.
M5 Kelly: BLOCKED at L3 by genuine calibrated Taiwan predictive-distribution receipts.

## Maturity
D15-16 remains L2/40. The mechanism and falsification layer is deeper, but genuine Taiwan optimizer replay is not yet feasible.

Artifacts:
- research/d15_optimizer_estimation_stress_v0_1.mjs
- tests/test_d15_optimizer_estimation_stress_v0_1.mjs

No Formal Core change.
No FORMAL_OPTIMIZATION_CANDIDATE.
