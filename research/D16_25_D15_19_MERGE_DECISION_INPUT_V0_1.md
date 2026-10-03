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


## 9. D16-side specialist completion update — 2026-10-03

D16-25 has now closed its final identified methodological gap for merge governance.

Additional executable evidence:
- PR #340 merged as `399287ac5ad669686f5f40fcfe72ea28617fd680`;
- final head `716b9038a1437b03dc5de92ee24709918a5b2deb`;
- System2 Research CI `37095784670` PASS;
- V8 Repair CI `37095784642` PASS;
- V8 Regression `37095784664` PASS.

New date-clustering firewall:
- row-weighted Brier/log loss and date-balanced Brier/log loss are both reported;
- per-date N / event rate / predicted probability / scores are preserved;
- same-date row multiplicity cannot masquerade as independent-date evidence;
- calibration-in-the-large is reported as a descriptive signed gap;
- row-weighted and date-balanced estimates remain distinct estimands.

External-methodology review did not collapse D16-25 and D15-19:
- proper scoring supports D16 probability-quality ownership;
- selective prediction supports D16 ABSTAIN/risk-coverage ownership;
- calibration-under-shift supports D16 Regime/shift uncertainty ownership;
- Bayesian/Kelly-under-parameter-uncertainty literature supports passing uncertainty downstream into sizing rather than treating Fractional Kelly as a calibration method.

Therefore the D16-side conclusion is now stronger:

`D16_SIDE_SPECIALIST_COMPLETE_AT_L2 / D15_SPECIALIST_RESEARCH_REQUIRED`.

No additional D16 conceptual research is required before D15-19 starts its own specialist evaluation, unless contradictory evidence appears.

The remaining D16 blockers are empirical L3/L4 blockers only:
- genuine complete Taiwan PIT intended population;
- real frozen probability predictions;
- causally matured outcomes;
- real calibration / after-cost utility / coverage evidence.

These blockers prevent Formal deployment but do not prevent curriculum ownership comparison.

## 10. Merge-governance state after D16 completion

The four options remain:

A. Keep D16-25 and D15-19 separate with an explicit handoff.

B. Absorb D15-19 into D15-16 Portfolio Optimization while D16-25 remains the sole probability/calibration authority.

C. Merge D15-19 directly into an expanded D16-25.

D. Retire D15-19 standalone and split-transfer:
- predictive belief/calibration/uncertainty requirements -> D16-25;
- Kelly/Fractional-Kelly/log-growth sizing mechanics -> D15-16 / D15 sizing family.

D16-side anti-orphan view:
- C remains the least natural unless D16 scope is deliberately expanded into portfolio allocation;
- B or D remain structurally cleaner from the D16 side;
- final judgment is intentionally withheld until D15-19 independently validates Kelly-specific log-growth, fractional sizing, correlation/concentration, drawdown/ruin, cost/liquidity and benchmark-comparison semantics.

Current action:
`D15_19_SPECIALIST_RESEARCH_CAN_START_NOW`.

No curriculum merge/retirement is executed by this file.


## D16-25 continuation audit — 2026-10-03

Research-only synthetic counterevidence retained in `research/D16_25_SELECTIVE_DENOMINATOR_ACCEPTANCE_AUDIT_20261003_V0_1.md`. Existing evaluator reports selective coverage on matured-known-label rows, not the entire frozen decision population. A four-row reproduction keeps true operational acceptance at 75% while label arrival changes reported matured-subset coverage from 50% to 66.7%. This does not invalidate conditional matured-subset scores; it prohibits interpreting them as population coverage without a separate frozen decision ledger and label/cost completeness. Evaluator code is unchanged; dual-denominator implementation remains next work. Existing D16 probability tests and audit assertions PASS. No real Taiwan calibration evidence, L3 claim, Formal change or sizing authority. D16-25 stays L2/40%; D15-19 stays L0/0%; final merge remains evidence-insufficient pending D15 specialist research.

Latest-main C1 cross-midnight closure already records approved merge/deploy; first genuine accepted population remains pending. Latest C1 run 37067696964 is completed/failure; summary alone cannot identify root cause. Public runtime readback is 8.15.3-c3-quote-context, testMode=false. No historical receipt is created. Exact next: frozen full-population decision ledger, mature-label and cost completeness, label-arrival invariance, genuine parent/prediction/outcome causal join; D15 K1–K8 and anti-orphan review before owner merge choice.

Calibration implementation ownership follows the newer H09 producer-consumer contract: D16-19 produces model calibration; D16-25 consumes its quality and applies uncertainty/utility/ABSTAIN. This is not a second calibration vote or an H09 completion claim. Kelly input remains NOT_READY/UNKNOWN; FORMAL_OPTIMIZATION_CANDIDATE: NONE.

This package is published on an isolated research branch/draft PR. Main merge is withheld because the current v7-cloudflare workflow includes research non-Markdown files; tracker/MJS/JSON can trigger production deployment. No workflow bypass or production deployment is authorized by this audit.
