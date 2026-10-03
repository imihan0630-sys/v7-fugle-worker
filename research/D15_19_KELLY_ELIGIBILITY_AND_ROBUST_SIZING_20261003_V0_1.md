# D15-19｜Kelly Eligibility and Robust Sizing V0.1

Updated: 2026-10-03 Asia/Taipei
Status: SPECIALIST_DEEPENING / ELIGIBILITY_AND_ROBUST_SIZING_CONTRACT_FROZEN
Formal Core impact: NONE
Depends on: D16-25 probability calibration / uncertainty

## A. Core finding

Kelly sizing is not a score-to-weight transform. It is a growth-utility allocation rule whose validity depends on a PIT-valid predictive distribution and payoff process.

PriorityScore, rank, confidence, technical score, analyst conviction and model logits are not Kelly-eligible merely because they order opportunities.

## B. Fail-closed Kelly input eligibility

A candidate Kelly receipt is ELIGIBLE only if all required fields pass:

1. predictionId and generationId are immutable.
2. symbol and decisionAt are known.
3. target / outcome horizon and exit policy were frozen before outcome realization.
4. prediction distribution or probability was produced at/before decisionAt.
5. calibrationMethodId and calibrationTrainingCutoff are known.
6. calibration training cutoff < decisionAt.
7. no outcome label used by the calibrator is first-known after the allowed training cutoff.
8. uncertainty provenance is explicit, or uncertainty status is UNKNOWN.
9. payoff definition is compatible with the sizing model.
10. costs / execution status are ACTUAL, MODELED with provenance, PARTIAL_ACTUAL, or UNKNOWN; UNKNOWN is never zero.
11. opportunity belongs to the frozen common-support universe.
12. no post-outcome relabeling changes the frozen decision receipt.

Failing any PIT-critical field => INELIGIBLE.
Missing non-critical evidence => UNKNOWN and the corresponding advanced Kelly variant is disabled.

## C. Return model hierarchy

### C1. Binary Kelly — sanity-check only
For a two-outcome gamble with win probability p, loss probability q=1-p and net win odds b:
f* = (b p - q) / b.

This is retained only as a unit-test / intuition comparator.

Do NOT force equity trades into binary Kelly when exits, gaps, partial exits, time stops or path dependence create a continuous payoff distribution.

### C2. Discrete scenario Kelly
For scenarios s with probability p_s and return r_s, choose fraction f to maximize:
sum_s p_s log(1 + f r_s),
subject to 1 + f r_s > 0 for all modeled scenarios and all frozen constraints.

### C3. Continuous-return Kelly
For predictive return distribution R:
maximize E[log(1 + f R)].
The expectation must be computed from a PIT-valid predictive distribution or preregistered scenario approximation.

### C4. Multi-asset / portfolio Kelly
For weight vector w and return vector R:
maximize E[log(1 + w'R)]
subject to frozen capital, leverage, per-name, liquidity, lot, concentration and risk constraints.

Independent single-name f* values are NOT additive portfolio weights.

## D. Robust sizing challenger families

R0 CURRENT_BASELINE:
current frozen allocation / PriorityScore sizing.

R1 SIMPLE_RISK_BASELINES:
equal capital; equal planned-stop-risk / risk budget where feasible.

R2 FULL_KELLY:
unshrunk growth-optimal theoretical comparator. Never default.

R3 FRACTIONAL_KELLY:
lambda * f*, with lambda preregistered or learned only in training.
No universal 1/2 or 1/4 assumption.

R4 UNCERTAINTY_SHRUNK_KELLY:
reduce size as predictive uncertainty / calibration uncertainty rises.
The shrinkage rule must be frozen ex ante.

R5 DRAWDOWN_CONSTRAINED_KELLY:
maximize log-growth subject to explicit drawdown-risk constraint.
This is distinct from merely multiplying Full Kelly by a fixed fraction.

R6 DISTRIBUTIONALLY_ROBUST_KELLY:
maximize worst-case expected log-growth over a preregistered ambiguity set of plausible distributions.
The ambiguity set itself is a model choice and must be OOS validated.

## E. Why Full Kelly is fragile

Kelly size is a nonlinear function of estimated edge / distribution. Estimation error can therefore become sizing error.

Key failure channels:
- probability miscalibration;
- expected-return estimation error;
- payoff-ratio error;
- underestimated left tail;
- regime shift;
- covariance / dependence error;
- small samples;
- selection bias;
- calibration trained on overlapping future labels;
- transaction costs omitted;
- execution / lot quantization ignored.

Therefore Full Kelly performance under the estimated distribution is not evidence of real-world optimality.

## F. Fractional Kelly falsification

Fractional Kelly helps only if reducing exposure improves the growth/risk tradeoff under estimation uncertainty.

It is falsified as a universal rule if:
- the best fraction changes materially across dates / Regimes;
- fixed lambda only wins because it was tuned on the full sample;
- drawdown-constrained or robust sizing dominates on common support;
- benefits disappear after costs / lot quantization;
- it adds no value over simpler risk-budget sizing;
- it merely duplicates an existing per-name cap.

The research question is not "is half Kelly good?"
It is:
"Does any preregistered shrinkage policy improve OOS growth / survival over simpler baselines, and is the gain robust enough to justify model complexity?"

## G. Drawdown / survival firewall

Log-growth optimality does not encode the owner's acceptable path of wealth.

Report separately:
- maximum drawdown;
- probability of breaching preregistered drawdown levels;
- capital-floor / near-ruin breach;
- recovery time;
- worst-date / worst-episode loss;
- expected shortfall where statistically supportable.

A Kelly variant with higher log-growth but unacceptable drawdown is not an implementation candidate.

## H. Portfolio dependence firewall

For simultaneous positions, dependence matters.

Minimum evidence ladder:
H0: dependence UNKNOWN -> single-name Kelly only descriptive; no portfolio-optimal claim.
H1: PIT synchronized covariance available -> quadratic / small-return approximation allowed as comparator.
H2: PIT scenario / joint distribution available -> portfolio log-growth replay.
H3: tail / Regime dependence validated -> robust portfolio comparison.

Sector labels, 3+3 pool identity, inverse HHI and name count do not substitute for a dependence model.

## I. Transaction and implementation firewall

Use D14 evidence semantics.

Signal price != fill price.
Suggested shares != broker-confirmed fill.
Plan shares != live trigger quantity.
UNKNOWN fee / tax / slippage != zero.

Lot / share quantization must be applied after theoretical sizing and the implementation gap reported separately.

A theoretical weight that cannot produce an orderable position is not an implemented Kelly position.

## J. Anti-orphan relationship with D16-25

D16-25 produces / validates:
prediction distribution, calibration, uncertainty, ABSTAIN and utility semantics.

D15-19 consumes eligible D16-25 receipts and tests capital sizing.

If D16-25 cannot produce a valid predictive distribution, D15-19 must fail closed rather than invent one.

If D15-19 finds that robust Kelly adds no OOS value over simple sizing, Kelly may be merged into the probabilistic-decision / position-sizing capability as a research comparator rather than retained as an independent active allocation module.

## K. Research promotion ladder

L2:
mechanism + falsification + eligibility + robust challenger contract frozen.

L3:
Taiwan PIT-valid prediction/distribution receipts exist and at least one common-support sizing replay is technically feasible. L3 does NOT mean Kelly outperforms.

L4:
Prospective Shadow / OOS evidence across independent dates, with costs and frozen fractions/constraints.

L5:
multi-Regime, redundancy, estimation-error, cost, dependence, drawdown and sensitivity robustness; only then can a FORMAL_OPTIMIZATION_CANDIDATE be considered.

## L. Exact next experiment

Build a research-only validator and simulator with two layers:

Layer 1 — eligibility:
returns ELIGIBLE / INELIGIBLE / UNKNOWN with reason codes; never silently imputes probability, cost, dependence or fill.

Layer 2 — sizing:
when eligible, compute binary sanity-check only if binary payoff is truly valid; otherwise scenario/continuous log-growth sizing.
Generate R0-R6 challenger outputs but disable variants whose required evidence is unavailable.

First tests must be synthetic invariants, not claimed as Taiwan evidence:
- fair game -> no positive Kelly edge;
- negative edge -> no long Kelly allocation;
- worse calibration / wider uncertainty must not mechanically increase uncertainty-shrunk size;
- stronger drawdown constraint must not increase feasible risk exposure without explicit proof;
- identical assets with high correlation must not be treated as independent additive bets;
- UNKNOWN costs / fills / covariance must remain UNKNOWN.

No Formal Core change.
