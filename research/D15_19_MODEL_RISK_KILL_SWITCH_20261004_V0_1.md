# D15-19｜Model Risk and Kelly Kill-Switch Audit V0.1

Updated: 2026-10-04 Asia/Taipei
Status: MODEL_RISK_FIREWALL_FROZEN / SYNTHETIC_FALSIFICATION_COMPLETE / TAIWAN_PIT_PENDING
Formal Core impact: NONE

## 1. Main conclusion

Kelly optimality is conditional on the predictive distribution being sufficiently correct for the decision problem.

The dangerous failure mode is not only mean / probability error. Missing low-probability left-tail outcomes, regime shifts and dependence errors can turn apparently growth-optimal sizing into systematic oversizing.

Therefore D15-19 must distinguish mathematical optimum under an estimated model, robustly eligible sizing under model uncertainty, implementation eligibility, and Formal-candidate eligibility. These are not the same state.

## 2. Left-tail underestimation

A predictive distribution that omits or underweights a rare large loss can materially overstate the safe Kelly fraction.

Every Taiwan PIT replay must include a preregistered left-tail sensitivity layer when the predictive model does not directly establish reliable tail probabilities.

At minimum compare native predictive distribution, added or reweighted adverse tail scenarios, and cost plus slippage adverse scenario where evidence permits.

A Kelly advantage that disappears under small plausible tail perturbations is FRAGILE, not robust alpha.

## 3. Regime shift

A fraction optimized under one return distribution is not portable by default.

Future stratification must include market trend or volatility Regime where PIT-valid, liquidity state, concentration state, and broad risk-on or risk-off context where timestamp-safe.

If the sign of incremental Kelly value flips materially across independent Regimes, fixed Kelly deployment is not eligible without a preregistered regime policy.

Regime labels must themselves be PIT-valid. Future-known regime classification is prohibited.

## 4. Dependence / correlation error

Two individually attractive Kelly positions are not two independent bets.

Synthetic witness confirms that the same marginal return distribution produces lower diversification benefit when outcomes become perfectly correlated.

Therefore single-name Kelly does not imply portfolio Kelly; per-name fractions cannot simply be summed; sector labels, name count, inverse HHI or 3+3 pool membership do not prove independence; portfolio Kelly requires validated PIT dependence evidence.

If simultaneous portfolio optimization requires dependence and that evidence is UNKNOWN, PORTFOLIO_KELLY is DISABLED.

## 5. Kill-switch hierarchy

### Hard disable
Research Kelly allocation must fail closed when probability calibration is ineligible, predictive distribution provenance is ineligible, look-ahead or post-outcome mutation is detected, or required portfolio dependence evidence is missing.

### Research-only / no Formal candidate
A mathematical research calculation may remain possible, but Formal candidacy is blocked when tail-risk evidence is UNKNOWN, Regime robustness is UNKNOWN, transaction cost evidence is UNKNOWN, execution or fill evidence is UNKNOWN, lot or orderability mapping is unresolved, or common-support denominator is unstable.

UNKNOWN must remain UNKNOWN.

## 6. Tail fragility metrics

For each frozen decision, report native Kelly fraction, stressed-tail Kelly fraction, absolute and relative fraction contraction, native expected log-growth, stressed expected log-growth of native fraction, stressed optimal log-growth, log-growth regret, and whether the preferred challenger family changes.

Do not reduce this to one pooled average. Preserve date-level results and date-balanced aggregation.

## 7. Regime fragility metrics

For each preregistered Regime report count of independent decision dates, Kelly eligibility coverage, Full / Fractional / robust challenger growth, drawdown / tail loss, best-lambda stability, zero-size / ABSTAIN rate, and cost sensitivity.

A globally best lambda with contradictory Regime behavior is not stable evidence.

## 8. Correlation fragility metrics

When dependence evidence exists compare independence approximation vs PIT-estimated dependence; report weight contraction caused by dependence, portfolio heat / concentration, expected log-growth difference, and tail loss difference.

If covariance or joint distribution is unstable, robust or simpler risk-budget sizing remains the benchmark.

## 9. Strong-merge falsification

Kelly should be strongly merged into a broader sizing capability rather than retained as a standalone active module if most opportunities fail probability/distribution eligibility, tail uncertainty forces persistent severe shrinkage, Regime-specific fractions are unstable, dependence uncertainty prevents portfolio use, simpler risk-budget sizing matches OOS performance, implementation costs erase incremental growth, or complexity adds no decision-relevant information.

This is a valid research outcome, not a failure of the research program.

## 10. Current maturity

D15-19 remains L2/40%.

The synthetic mechanism / falsification layer is now materially deeper, but L3 is still blocked by genuine Taiwan PIT calibrated prediction/distribution receipts from D16-25.

Artifacts:
- research/d15_kelly_model_risk_firewall_v0_1.mjs
- tests/test_d15_kelly_model_risk_firewall_v0_1.mjs

No Formal Core change.
No FORMAL_OPTIMIZATION_CANDIDATE.
