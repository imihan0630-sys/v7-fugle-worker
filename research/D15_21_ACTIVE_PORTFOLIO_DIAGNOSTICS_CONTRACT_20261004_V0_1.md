# D15-21｜Active Portfolio Diagnostics and Attribution Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Status: MECHANISM_FALSIFICATION_CONTRACT_FROZEN
Formal Core impact: NONE

## Role
D15-21 explains portfolio behavior relative to a frozen benchmark. It is diagnostic and attribution research, not a stock-entry gate.

## Four attribution layers
A0 SELECTION: which names entered the eligible/selected set.
A1 SIZING: how capital weights differ from a frozen equal-capital or risk-budget counterfactual on the same selected set.
A2 CASH: designed reserve, no-opportunity cash, implementation residual, post-reduction cash, blocked/UNKNOWN cash.
A3 EXECUTION: signal/reference path versus positively linked realized fills and evidenced costs.

Do not collapse these layers. A winning portfolio does not prove selection alpha if sizing, cash timing or execution explains the difference.

## Benchmark firewall
Every diagnostic requires benchmarkId, benchmarkKnownAt, decisionAt, benchmark return horizon and rebalance rule.

Benchmark choice cannot be optimized after seeing portfolio outcomes.

Valid benchmark families are question-dependent:
- cash / zero-risk comparator for deployment utility;
- equal capital on identical selected names for sizing attribution;
- frozen risk-budget comparator for sizing/risk attribution;
- broad-market benchmark for active market exposure;
- sector-matched or factor-matched comparator only when its membership/exposure is PIT-valid.

Different benchmark questions must not be mixed into one alpha number.

## Tracking Error
Tracking Error requires a time series of portfolio-minus-benchmark returns on synchronized intervals.

Plan weights alone cannot produce realized Tracking Error.
A single active-return observation is not Tracking Error.
Missing portfolio return or benchmark return is UNKNOWN, not zero.

Future reporting must include frequency, annualization convention, sample count, date coverage and cash treatment.

## Active Share
For a fully specified portfolio and benchmark on the same security universe:
Active Share = 0.5 * sum_i |w_portfolio_i - w_benchmark_i|.

Requirements:
- weights share the same timestamp;
- cash treatment is explicit;
- benchmark constituents and weights are PIT-valid;
- security mapping/corporate actions are resolved.

Active Share measures holdings difference, not guaranteed alpha or risk independence.

For the System1 3+3 selected-plan context, Active Share versus a broad market benchmark is not reconstructable from selected rows alone because the complete benchmark weight vector is absent.

## Performance attribution
Brinson-style allocation/selection attribution is meaningful only when portfolio and benchmark sector membership/weights/returns are defined consistently.

For this strategy, a more causally aligned first decomposition is:
selected opportunity effect
+ sizing effect on common support
+ cash/reserve effect
+ execution/cost effect
+ interaction/residual.

Do not label the residual as skill.

## Existing evidence reuse
D15-08 supplies PIT-valid plan-time cash attribution but actual broker cash is UNKNOWN.
D15-07 supplies PIT-valid planned heat, not realized holdings heat.
D15-15 supplies PIT-valid selected-plan pool identity, not diversification.
PriorityScore allocation studies provide same-selected-set sizing counterfactuals on limited dates.
D14 execution research separates signal-path returns from broker-realized returns.

These are admissible components, but none alone proves realized performance attribution.

## Falsifications
F1 High Active Share does not imply positive active return.
F2 Low Tracking Error does not imply good selection; it may reflect cash/market beta/benchmark choice.
F3 Positive portfolio return does not identify selection contribution.
F4 A sizing counterfactual on different selected names is not sizing attribution.
F5 Planned cash is not realized broker cash.
F6 Signal-price return is not broker-realized execution return.
F7 Benchmark shopping after outcomes invalidates attribution.
F8 Daily rows sharing one decision cohort do not manufacture independent evidence dates.

## Promotion gates
L2: mechanism, benchmark firewall, layer separation and falsification contract.
L3: at least one genuine Taiwan PIT common-support diagnostic/attribution replay with valid benchmark inputs.
L4: multiple independent OOS/Prospective Shadow dates with costs where required.
L5: multi-Regime, benchmark sensitivity, factor/sector redundancy, cash/execution completeness and stable incremental attribution.

No Formal candidate before L5-quality evidence.
