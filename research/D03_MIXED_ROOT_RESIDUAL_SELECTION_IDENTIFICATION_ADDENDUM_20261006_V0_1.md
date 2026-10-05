# D03 Mixed-Root Residual Selection / Identification Addendum V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Upstream D16 authority: research/SDA016_ADMISSION_SELECTION_IDENTIFICATION_VALIDATION_ADDENDUM_20261006_V0_1.md
Parent contract: research/D03_MIXED_ROOT_RESIDUAL_GRADUATION_GUARD_20261006_V0_1.md
Status: RESEARCH_ONLY / OUTCOME_CLOSED / ADDITIVE_FIREWALL_FROZEN
Formal Core: LOCKED

## Purpose

Extend the mixed-root residual graduation guard with D16's latest admission-selection identification firewall.

Root-specific residual proof is not promotion-grade merely because it is computed on a mathematically common set of complete rows. The proof must also identify which population the admitted rows represent.

## TI-769 — common support is necessary but not sufficient

Common support ensures candidate and baseline are compared on the same rows.

It does not prove that those rows represent the preregistered target population.

If parent capture, readback, outcome maturity, performance eligibility, cost eligibility or final analysis admission depends on pre-outcome state, complete-case residual results may estimate an admitted subpopulation rather than the original target population.

Therefore:
`COMMON_SUPPORT_PASS != TARGET_POPULATION_IDENTIFIED`.

## TI-770 — admission must remain first-class lineage

Any residual graduation receipt must preserve stage-wise admission lineage for the preregistered target population, including at least:
- targetPopulationEligible;
- parentCaptured;
- readbackVerified;
- predictionAvailable;
- outcomeMatured;
- performanceEligible;
- costEligible;
- finalAnalysisAdmitted;
- exclusion reasons;
- decision-time source / regime / universe / continuity state.

Keeping only finalAnalysisAdmitted=true rows fails the D03 graduation gate.

## TI-771 — estimand scope must bind the residual child

Every residual child must carry an estimand scope.

Allowed research scopes:
- OBSERVED_SUBPOPULATION_ESTIMAND;
- RESTRICTED_SUPPORT_ESTIMAND;
- TARGET_POPULATION_ESTIMAND.

A child established only under OBSERVED_SUBPOPULATION_ESTIMAND:
- may remain mechanistic/research evidence;
- stays RESIDUAL_CANDIDATE for cross-system effective-evidence counting;
- contributes 0 new effective independent evidence units.

It cannot be relabeled RESIDUAL_INCREMENTAL_PROVEN for the target population.

## TI-772 — restricted-support evidence cannot silently become global evidence

Weight trimming, truncation, overlap weighting or explicit support restriction changes the estimand.

If D16 adopts a restricted-support estimand:
- the residual child must bind the exact support rule/hash;
- the consumer population must match that support before any evidence increment is considered;
- the result cannot be exported as a full-universe or unrestricted Top6 evidence family.

`RESTRICTED_SUPPORT_RESULT -> FULL_TARGET_POPULATION_CLAIM` is forbidden.

## TI-773 — positivity / overlap failure blocks target-population graduation

If a preregistered stratum has zero or near-zero admission probability:
- extreme weights do not automatically repair identification;
- target-population residual graduation is blocked;
- the child remains RESIDUAL_CANDIDATE or UNKNOWN.

Required diagnostics where weighting is used:
- admission propensity distribution;
- minimum / quantiles;
- max weight;
- weight concentration;
- weighted effective support;
- covariate/admission-strata balance.

No successful-looking weighted point estimate can override a failed positivity gate.

## TI-774 — sensitivity tier is part of proof identity

The residual receipt must identify the selection-sensitivity tier:

### Tier A
Observed-subpopulation only.
No target-population graduation.

### Tier B
Preregistered admission/censoring-weighted sensitivity using only decision-time variables.
Model specification, regularization, clipping/trimming and diagnostics are frozen before economic outcome interpretation.

### Tier C
Partial-identification / worst-case sensitivity when missingness is not point-identified or positivity fails.

A Tier C result may support a directional claim only if the legal bounds do not cross the null / decision boundary.

Changing tiers after seeing residual performance creates a new adaptive family and cannot inherit the prior holdout claim.

## TI-775 — evaluation cutoff and imputation cannot repair a weak result post hoc

Residual graduation requires a deterministic preregistered evaluation/maturity cutoff.

Forbidden:
- extending the maturity window after seeing weak effects;
- stopping early after favorable effects;
- selecting an imputation model after holdout outcomes;
- treating a single imputed value as observed truth.

Any imputation contract must be frozen before economic interpretation and retain uncertainty.

Outcome-driven admission or imputation redesign consumes the family under SDA-016.

## TI-776 — augmented mixed-root graduation rule

A root-specific residual child may reach cross-system `RESIDUAL_INCREMENTAL_PROVEN` only when BOTH layers pass:

Layer 1 — component isolation:
- root-specific child;
- exact parent/baseline/common-support/method bindings;
- D16 dependence-aware OOS/prospective and multiplicity proof;
- no whole-parent promotion.

Layer 2 — selection identification:
- stage-wise admission lineage complete;
- estimand scope explicit;
- target-population claim justified, OR exact restricted-support consumer binding;
- positivity/overlap acceptable for the chosen estimand;
- evaluation cutoff frozen;
- any weighting/imputation contract preregistered;
- missing-outcome sensitivity cannot reverse the claimed direction.

If Layer 1 passes but Layer 2 does not:
`ROOT_SPECIFIC_MECHANISM_SUPPORTED_BUT_POPULATION_INCREMENTALITY_NOT_IDENTIFIED`.

Effective independent evidence increment:
`0`.

Current decision:
- no empirical residual child is promoted;
- D03 remains 56.7%;
- outcome joins remain CLOSED;
- Formal Core remains LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

## Exact next continuation point

1. Add machine fields for estimandScope, admissionLineageHash, selectionSensitivityTier, positivityState, supportRuleHash, evaluationCutoffRule and selectionFirewallDisposition to the root-specific residual receipt.
2. Freeze deterministic cases proving that observed-subpopulation evidence cannot increment global evidence, positivity failure blocks graduation, and restricted-support evidence cannot be exported to unrestricted consumers.
3. D16's future D03 method/incrementality receipt must satisfy both the prior D03 method oracle and this selection-identification addendum.
4. External System1/System2 implementation lanes remain independent and Formal Core remains locked.
