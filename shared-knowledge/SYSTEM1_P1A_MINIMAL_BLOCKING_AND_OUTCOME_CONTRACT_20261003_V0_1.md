# System1 P1-A Minimal Blocking and Outcome Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_CONTRACT_FROZEN / CLASS_A_ONLY / FORMAL_CORE_LOCKED
Parent governance:
- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
- `shared-knowledge/HYBRID_SELECTION_EXECUTION_DIRECTIVE_V0_1.md`

## Purpose

Define the first causal-quality Shadow contract for the System1 low-BUY investigation.

P1-A covers gates whose current Formal behavior can reject a name even though the gate primarily describes data presence / confidence rather than economic quality.

Primary P1-A gates:
- `RS_CONTEXT`
- `CHIP_CONCENTRATION_PRESENT`
- `FINANCIAL_SOURCE_COMPLETENESS`
- `FUNDAMENTAL_COMPONENT_COUNT`

Related mixed gate:
- `MARKET_CAP_FLOOR` must be split into:
  - missing market-cap data = CONFIDENCE_UNCERTAINTY;
  - known market cap below owner threshold = economic/context rule.

This contract does **not** authorize bypassing production gates.

## Research question

Not:
"How many more stocks appear if missing data is treated as PASS?"

The correct question is:

**If data-presence failures stop being interpreted as negative economic evidence, how far can the rejected symbol proceed through the unchanged safety, A/B, target/RR and grade logic before another legitimate blocker appears?**

Unknown input remains UNKNOWN.
No missing input may be imputed as zero, neutral or pass.

## Full blocking-set schema

For every Formal-rejected symbol/date preserve:

- `symbol`
- `sessionDate`
- `generationId`
- `pool`
- `formalFirstFailure`
- `formalOk`
- `hardBlockSet[]`
- `confidenceBlockSet[]`
- `contextBlockSet[]`
- `primaryBlockSet[]`
- `supportiveBlockSet[]`
- `unknownDependencySet[]`
- `notEvaluableDependencySet[]`
- `minimalUnblockClass`
- `reachStage`
- `decisionAt`
- `sourceVintageReceiptIds[]`
- `researchOnly:true`
- `decisionImpact:false`

Do not use `formalFirstFailure` as causal attribution.

## Minimal-unblock classes

### HARD_BLOCKED
At least one verified factual hard state blocks the name:
- source/PIT/replay failure;
- session/corporate-action continuity failure;
- factual non-executability;
- explicit account/risk-authority failure;
- owner-fixed universe exclusion such as price floor.

P1-A does not evaluate economic counterfactual admission for these rows.

### P1A_ONLY
All known blockers are P1-A confidence/data-presence blockers and, once semantically bypassed for diagnostic reach only, no other blocker prevents continued evaluation.

This does **not** mean buy/pass.

### P1A_PLUS_CONTEXT
At least one P1-A blocker and at least one context/supportive economic blocker remain.

### P1A_PLUS_PRIMARY
At least one P1-A blocker and at least one primary strategy blocker remain, such as A/B, RR or grade.

### PRIMARY_ONLY
No P1-A blocker; rejection is explained by primary strategy evidence.

### CONTEXT_ONLY
No hard or primary blocker; known failures are context/supportive only.

### UNKNOWN_CONTAMINATED
Removing the semantic interpretation of a P1-A blocker does not produce a valid downstream evaluation because the same missing data is required for a later calculation.

The row remains UNKNOWN and is not counted as an economic opportunity.

## Reach funnel

Every P1-A row receives the furthest valid stage reached without inventing data.

- `F0_FORMAL_PARENT`
- `F1_SAFETY_EVALUABLE`
- `F2_OWNER_UNIVERSE`
- `F3_P1A_SEMANTIC_BYPASS`
- `F4_AB_EVALUABLE`
- `F5_AB_PASS`
- `F6_TARGET_RR_EVALUABLE`
- `F7_RR_PASS`
- `F8_GRADE_PASS`
- `F9_RANKABLE`

A row can advance only when all data needed by the next stage are authentically available at decision time.

## Required counts

For every matched session report:

- `formalRejectedN`
- `p1aRejectedN`
- `p1aOnlyN`
- `p1aPlusContextN`
- `p1aPlusPrimaryN`
- `unknownContaminatedN`
- `p1aReachABN`
- `p1aABPassN`
- `p1aReachRRN`
- `p1aRRPassN`
- `p1aGradePassN`
- `p1aRankableN`
- `hardBlockedN`

`p1aRankableN` is the closest funnel count to a potentially suppressed competitor.
It is **not** a candidate count, WATCH count or BUY count.

## Matched outcome contract

Outcomes are evaluated only after the result horizon matures.

### Admission outcome
Compare:
- current Formal admitted;
- Formal rejected but P1-A Shadow rankable.

Use the same:
- decision date;
- information vintage;
- universe;
- pool;
- setup family;
- cost contract where actionable.

### Required outcome fields
Where valid:
- D+N return;
- after-cost return;
- MFE;
- MAE;
- +1R hit;
- -1R hit;
- tail-loss flag;
- drawdown contribution;
- fill feasibility;
- turnover implication;
- slot-displacement simulation only after ranking is frozen.

No future data may alter P1-A reach classification.

## Date-cluster firewall

Symbols from the same decision date are not treated as independent observations.

Report both:
1. symbol-level outcomes;
2. date-cluster outcomes.

Minimum date-cluster outputs:
- number of independent dates;
- challenger-minus-Formal mean by date;
- median by date;
- sign-agreement rate across dates;
- best-date contribution share;
- worst-date contribution share;
- Regime coverage;
- sector concentration by date.

A result dominated by one or a few dates cannot enter EVIDENCE_READY.

## Missingness confounding controls

P1-A missingness may correlate with:
- market capitalization;
- liquidity;
- listing age/history;
- price;
- volatility;
- sector;
- data-provider coverage;
- pool.

Therefore outcome comparisons must report matched or stratified results by at least:
- pool;
- A/B setup;
- market-cap bucket;
- liquidity bucket;
- price bucket;
- Regime;
- sector;
- session date.

This is observational Shadow evidence, not randomized causal proof.

## Stop / classification states

### P1A_NOT_MATERIAL
P1-A semantic repair produces little or no F9 rankable reach.

### P1A_FUNNEL_MATERIAL_OUTCOME_UNKNOWN
P1-A materially changes reach, but outcomes are not mature.

### P1A_MATERIAL_NO_ECONOMIC_GAIN
P1-A materially increases reach but does not improve after-cost opportunity capture or worsens risk.

### P1A_POSITIVE_ECONOMIC_EVIDENCE
P1-A materially increases reach and produces robust after-cost incremental value across independent dates/Regimes without unacceptable risk deterioration.

This state is still **not** automatic Formal authorization.

### DATA_INSUFFICIENT
Source, denominator, PIT, outcome maturity or independent-date coverage is inadequate.

## Formal firewall

This contract does not:
- modify Worker.js;
- mark UNKNOWN as PASS;
- change A/B;
- change RR;
- change B-grade;
- change 3+3/Top6;
- change ranking;
- change allocation;
- create BUY/WATCH;
- create a FORMAL_OPTIMIZATION_CANDIDATE.

Formal Core remains LOCKED.
