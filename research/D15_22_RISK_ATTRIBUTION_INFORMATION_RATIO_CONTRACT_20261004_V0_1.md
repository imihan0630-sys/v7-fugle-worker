# D15-22｜Risk Attribution and Information Ratio Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Status: MECHANISM_FALSIFICATION_CONTRACT_FROZEN
Formal Core impact: NONE

## Scope separation
D15-22 answers two related but distinct questions:
1. Risk Attribution: where portfolio risk comes from.
2. Information Ratio: whether active return compensates for active risk relative to a frozen benchmark.

Neither is an entry signal.

## Layer A — plan-time stop-risk attribution
For selected name i:
plannedStopRisk_i = allocation_i * stopRiskFraction_i.

Total planned stop-risk:
R = sum_i plannedStopRisk_i.

Name share:
riskShare_i = plannedStopRisk_i / R.

This is a deterministic plan-geometry decomposition and is PIT-reconstructable when allocation, reference entry and stop are frozen.

It is not covariance-based marginal risk contribution and not realized loss attribution.

## Capital versus stop-geometry decomposition
For two allocation rules on the same selected names and same stop fractions:
Delta R = sum_i (Delta allocation_i * stopRiskFraction_i).

This isolates the direct effect of changing capital weights while holding stop geometry fixed.

For two stop definitions on the same allocation:
Delta R = sum_i (allocation_i * Delta stopRiskFraction_i).

If both allocation and stop geometry change, an interaction term exists. Attribution order can matter; therefore use an explicit symmetric/Shapley-style decomposition if a unique additive attribution is required.

Do not assign all change to sizing when stop geometry also changed.

## Layer B — covariance-based portfolio risk attribution
If a PIT-valid covariance matrix Sigma exists:
portfolio variance = w' Sigma w.
Marginal contribution to variance = (Sigma w)_i.
Component contribution to variance = w_i * (Sigma w)_i.
The component contributions sum to portfolio variance.

For volatility attribution:
component contribution to volatility = w_i * (Sigma w)_i / portfolio volatility.

Requirements:
- synchronized PIT return history;
- covariance receipt and estimation method;
- timestamp and lookback;
- security mapping;
- cash semantics;
- constraints / leverage semantics.

Without a PIT covariance receipt, covariance-based component risk is UNKNOWN.

Inverse HHI, sector count and stop-risk share are not substitutes.

## Layer C — active risk / Information Ratio
Active return_t = portfolioReturn_t - benchmarkReturn_t.
Tracking Error = standard deviation of active-return series using a frozen frequency and annualization convention.
Information Ratio = annualized active return / annualized Tracking Error.

Requirements:
- synchronized portfolio and benchmark return series;
- frozen benchmark;
- sufficient observations;
- cost treatment;
- cash treatment;
- no benchmark shopping.

If Tracking Error is zero:
- if active return is also zero, IR is undefined/non-identifying;
- otherwise the setup requires investigation rather than infinite skill.

A single observation cannot identify Tracking Error or Information Ratio.

## Falsifications
F1 Largest capital weight need not be largest risk contributor.
F2 Largest stop-risk share is not necessarily largest covariance-based contributor.
F3 Lower concentration HHI does not guarantee lower covariance risk.
F4 Higher Information Ratio can be produced by benchmark choice or tiny denominator instability.
F5 Positive active return with one date is not a valid Information Ratio.
F6 Ex-post covariance or benchmark construction invalidates historical attribution.
F7 Risk reduction does not prove higher return or utility.
F8 Planned stop-risk is not realized loss.

## Existing evidence
2026-09-18 already supplies a PIT plan-time witness where PriorityScore sizing and stop geometry mechanically amplify projected risk concentration.
D15-07 validates plan-time Portfolio Heat.
D15-06 freezes inverse-HHI semantics.
D15-21 freezes benchmark/common-support attribution rules.
D15-16 establishes covariance input eligibility.
These can support Layer A now, but Layer B/C remain blocked by PIT covariance and synchronized benchmark return evidence.

## Promotion gates
L2: layer separation, equations, falsifications, PIT requirements and executable invariants.
L3: genuine Taiwan PIT risk-attribution witness. Layer A can qualify as plan-time risk attribution if replayed from durable receipts; Layer B/C require their own data and cannot inherit Layer A maturity.
L4: multiple independent OOS/Prospective Shadow dates with stable attribution and benchmark sensitivity.
L5: multi-Regime, covariance-method, benchmark, cost, liquidity and redundancy robustness.

No Formal candidate before L5-quality evidence.
