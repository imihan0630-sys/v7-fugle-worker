# D16-25 × D15-19 Merge Decision Input V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH-ONLY / D16-25 SIDE READY FOR GOVERNANCE COMPARISON
Formal Core impact: NONE
Standalone retirement authorized: NO

## Question

Can D15-19 Kelly / Fractional Kelly be merged into D16-25 Probabilistic Decision / Bayesian Updating / Uncertainty-aware Selection without losing a distinct capability?

This document does NOT execute the merge.
It records the D16-25-side evidence needed for a later owner decision.

## 1. Dependency is confirmed

D15-19 cannot be safely evaluated from an uncalibrated raw win probability.

Any Kelly-style allocation needs a decision-relevant probability or payoff distribution whose:
- target/horizon is explicit;
- probability/distribution is calibrated;
- payoff magnitude/cost is known;
- uncertainty is represented;
- action conditioning is correct;
- PIT provenance is valid.

These are D16-25 responsibilities.

Therefore:
`D15-19 DEPENDS ON D16-25` is justified.

## 2. Dependency does not prove redundancy

D16-25 asks:
- What event/distribution are we predicting?
- What is the base rate?
- How should new evidence update belief?
- Is the probability calibrated?
- How uncertain is the prediction/model/data?
- Is expected after-cost decision value sufficient?
- Should the system ACCEPT or ABSTAIN?

D15-19 asks:
- Given a validated payoff distribution/edge, what fraction of wealth/capital should be allocated under a logarithmic-growth objective?
- Should full Kelly be reduced to Fractional Kelly?
- How do concentration/correlation/drawdown/ruin/lifecycle constraints modify the fraction?

These are adjacent but not identical questions.

## 3. Responsibility matrix

| Capability | D16-25 | D15-19 | Current overlap |
| --- | --- | --- | --- |
| Target/horizon definition | PRIMARY OWNER | consumes | low |
| Base rate / prior | PRIMARY OWNER | consumes | low |
| Bayesian evidence update | PRIMARY OWNER | may consume posterior | medium terminology only |
| Probability calibration | PRIMARY OWNER | prerequisite | dependency |
| Distribution shift / Regime calibration | PRIMARY OWNER | sizing may react downstream | dependency |
| Data/model uncertainty | PRIMARY OWNER | consumes as sizing haircut/input | shared interface |
| ABSTAIN / selection utility | PRIMARY OWNER | not primary | low |
| After-cost expected decision value | PRIMARY OWNER | consumes payoff distribution | medium |
| Log-growth objective | no standalone sizing authority | PRIMARY OWNER | distinct |
| Kelly fraction | no | PRIMARY OWNER | distinct |
| Fractional Kelly risk scaling | no | PRIMARY OWNER | distinct |
| Portfolio correlation/concentration | context/handoff | PRIMARY D15 responsibility | distinct |
| Drawdown/ruin constraint | validation guard | PRIMARY D15 responsibility | distinct |
| Position lifecycle/portfolio heat | no | PRIMARY D15 responsibility | distinct |

## 4. Strong argument FOR future merge

A merge can reduce fragmentation if the surviving module is explicitly expanded from:
"probabilistic selection"
into:
"probabilistic decision + uncertainty-aware sizing".

Benefits:
- one canonical probability/distribution truth;
- Kelly cannot silently invent its own p;
- calibration and sizing version lineage stays attached;
- uncertainty haircut and ABSTAIN/sizing eligibility can be governed in one receipt chain;
- less duplicated expected-value language.

This is the strongest pro-merge case.

## 5. Strong argument AGAINST direct D15-19 -> D16-25 merge

D15-19 is a **portfolio allocation method**.
D16-25 is a **statistical decision/validation method**.

Moving Kelly entirely into D16 can orphan:
- wealth-growth objective;
- Fractional Kelly trade-off;
- portfolio correlation/concentration;
- drawdown/ruin constraints;
- capital/lifecycle semantics;
- comparison with Risk Budgeting / Risk Parity / fixed-risk sizing.

D15 also already contains:
- D15-01/02 concentration;
- D15-03/04 covariance;
- D15-07 Portfolio Heat;
- D15-09 stop-risk geometry;
- D15-10/11 lifecycle;
- D15-13 tail risk;
- D15-16 portfolio optimization family.

Therefore Kelly has strong natural ownership inside D15 even though its predictive input is supplied by D16-25.

## 6. Alternative merge structures to compare later

### Option A — Keep both, explicit interface
D16-25:
predictive/calibration/uncertainty/ABSTAIN.

D15-19:
Kelly/Fractional Kelly sizing.

Handoff:
`PredictiveDecisionReceipt -> KellySizingReceipt`.

Pros:
clean separation of statistical estimation and capital allocation.

Cons:
one extra curriculum module/interface.

### Option B — Merge D15-19 into D15-16 Portfolio Optimization family
Kelly becomes another allocation method beside:
- Mean-Variance;
- Risk Budgeting / Risk Parity;
- Black-Litterman.

D16-25 remains the upstream probability/calibration provider.

Pros:
method-family ownership stays in portfolio domain;
all sizing/optimization methods share estimation-error/cost/constraint benchmark framework.

Cons:
Kelly's unique log-growth/wealth interpretation must remain explicit inside D15-16 and not disappear into generic optimization.

### Option C — Merge D15-19 into D16-25
Only defensible if D16-25 scope is formally expanded to include downstream allocation/sizing governance.

Pros:
probability -> uncertainty -> utility -> sizing in one chain.

Cons:
blurs validation/statistics with portfolio allocation;
risks orphaning D15 lifecycle/correlation/tail responsibilities;
creates duplication with D15-16.

### Option D — Split ownership without standalone D15-19
Retire D15-19 ID, transfer:
- Kelly statistical-input requirements -> D16-25;
- log-growth/fractional sizing mechanics -> D15-16 / D15 sizing family.

This can eliminate the standalone module while preserving both capabilities.

This option is structurally plausible but requires the D15 specialist room to validate that no Kelly-specific theory/evidence is orphaned.

## 7. D16-25-side merge verdict readiness

D16-25 research is now sufficient to state:

1. Probability calibration and Kelly sizing are not the same capability.
2. Kelly depends on D16-25 but retains a distinct allocation objective.
3. A direct full merge into D16-25 would require explicit scope expansion and has meaningful anti-orphan risk.
4. If curriculum simplification is desired, a split-transfer or D15-16 method-family merge is structurally more natural than silently moving all Kelly responsibility into statistical validation.
5. Final retirement/merge cannot be executed from the D16 side alone because D15-19 itself remains L0 and D15 must validate its unique portfolio-sizing semantics.

## 8. Evidence still required before a final empirical merge decision

- genuine calibrated Taiwan probability/distribution;
- uncertainty-aware sizing test;
- Full Kelly / Fractional Kelly versus:
  - fixed risk;
  - equal allocation;
  - risk budget;
  - simple capped sizing;
- after-cost return and capital utilization;
- drawdown / tail / ruin sensitivity;
- correlation / concentration effects;
- parameter-estimation error stress;
- multi-Regime / walk-forward / prospective evidence.

These are not required to establish conceptual ownership, but they are required before claiming one sizing method is operationally superior.

## Current classification

D16-25 side:
`RESEARCHED_TO_L2_CONCEPTUAL_AND_EXECUTABLE_VALIDATION_CONTRACT`.

D15-19 merge relation:
`STRONG_DEPENDENCY / PARTIAL_CONCEPTUAL_OVERLAP / DISTINCT_PORTFOLIO_ALLOCATION_RESPONSIBILITY`.

Current curriculum action:
`NO_MERGE_EXECUTION_YET`.

FORMAL_OPTIMIZATION_CANDIDATE:
NONE.

## Exact next merge-decision handoff

After D15-19 specialist research:
1. compare Option A/B/C/D against anti-orphan rule;
2. verify Kelly/log-growth/fractional-risk semantics have a surviving owner;
3. verify D16-25 remains sole probability/calibration authority;
4. owner chooses curriculum merge/retirement only after both sides are complete enough.
