# D15-19｜Estimation Error and Fraction Sensitivity Audit V0.1

Updated: 2026-10-03 Asia/Taipei
Status: SYNTHETIC_FALSIFICATION_LAYER_READY / TAIWAN_PIT_EVIDENCE_PENDING
Formal Core impact: NONE

## 1. Question

Does a fixed Fractional Kelly multiplier provide robust value, or does it merely look good because one historical sample / model-error realization happened to favor that fraction?

## 2. Synthetic witness

Estimated symmetric binary distribution:
- P(+100%) = 0.60
- P(-100%) = 0.40

The theoretical long-only Full Kelly fraction is approximately 0.20.

Stress the true probability while leaving the estimated decision unchanged:
- p_true = 0.60
- p_true = 0.55
- p_true = 0.50
- p_true = 0.45

This is deliberately synthetic. It proves mechanics / failure modes only; it is not Taiwan-market evidence.

## 3. Main falsification

When the estimated edge is too optimistic, Full Kelly retains the largest exposure to the estimation error.

Reducing lambda can reduce the damage, but this does NOT prove that lambda=0.5 or any other fixed fraction is universally optimal.

At sufficiently adverse true edge, zero allocation can dominate all positive fractions.

Therefore the research target is a shrinkage POLICY conditioned on admissible uncertainty evidence, not a magic constant.

## 4. New separation: edge uncertainty vs path-risk constraint

Fractional Kelly:
- shrinks the unconstrained optimum by lambda.

Uncertainty-shrunk Kelly:
- shrinkage responds to uncertainty evidence.

Drawdown-constrained Kelly:
- directly limits an explicit loss / drawdown-risk quantity.

These are not semantically interchangeable.

A fixed fraction may accidentally approximate a drawdown constraint in one sample, but that equivalence must not be assumed out of sample.

## 5. Monotonic safety invariants

The research engine now freezes these expected invariants:

I1. A fair symmetric gamble must not produce positive long-only Kelly size.
I2. Negative estimated edge must not produce positive long-only Kelly size.
I3. Collapsing the estimated distribution toward no-edge uncertainty must not increase Kelly size.
I4. Tightening a preregistered loss constraint must not increase the feasible Kelly exposure without explicit proof.
I5. Missing dependence evidence disables portfolio-optimal Kelly claims.
I6. Missing cost / fill evidence remains UNKNOWN.
I7. A scenario causing non-positive wealth makes that fraction infeasible.
I8. A fraction selected using evaluation-period outcomes is invalid even if its realized CAGR is highest.

## 6. Sensitivity grid for future Taiwan PIT replay

Freeze candidate lambda grid BEFORE the Taiwan evaluation set:
- 1.00
- 0.75
- 0.50
- 0.25
- 0.00

This grid is a research challenger set, not a production recommendation.

If a denser lambda grid is later introduced, it must be training-only or incur explicit multiple-testing correction.

## 7. Required future comparison

For each frozen PIT decision date:
- use the same eligible opportunity set;
- retain frozen prediction / calibration receipt;
- compute theoretical Full Kelly;
- apply preregistered fractions;
- compare uncertainty-shrunk and drawdown-constrained challengers when evidence permits;
- quantize to executable lot / share units separately;
- apply evidenced costs separately;
- preserve zero-size / ABSTAIN decisions.

Aggregate both by decision date and by matured outcome set. Do not let later label maturity change the original decision denominator.

## 8. Failure conditions for Kelly as an active module

D15-19 should NOT become an active independent sizing module if any of the following survives OOS:
- simple risk-budget sizing is equally good within uncertainty;
- Kelly gains are explained by PriorityScore / stop-distance / volatility redundancy;
- best lambda is unstable across Regimes;
- gains vanish after cost / lot quantization;
- drawdown / capital-floor breaches materially worsen;
- portfolio dependence cannot be estimated reliably;
- calibrated edge is too weak / sparse to justify differentiated sizing;
- ABSTAIN / zero-size dominates often enough that a simpler decision rule is operationally equivalent.

In that case, Kelly remains a diagnostic / research comparator and can be strongly merged into the broader position-sizing capability without loss of semantic coverage.

## 9. Current maturity

D15-19 remains L2/40%.

This round deepens L2; it does not justify L3 because no genuine Taiwan PIT calibrated predictive distribution has yet passed the D16-25 gate.

Artifacts:
- research/d15_kelly_stress_lab_v0_1.mjs
- tests/test_d15_kelly_stress_lab_v0_1.mjs

No Formal Core change.
