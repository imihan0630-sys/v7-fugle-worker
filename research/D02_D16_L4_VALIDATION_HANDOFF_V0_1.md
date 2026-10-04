# D02 → D16 L4 Statistical Validation Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
D02 owner: 02｜價量研究室
D16 owner: 11｜統計驗證與策略市場狀態研究室
Status: RESEARCH_ONLY / OUTCOME_BLIND / HANDOFF_READY / FORMAL_CORE_LOCKED
Evidence cursor: PVE-239

## 1. Ownership boundary

D02 owns:
- price-volume feature semantics;
- event/family identity;
- PIT knownAt / source continuity;
- common-support eligibility;
- admission version;
- anti-double-counting rules;
- module-specific falsifiers.

D16 owns:
- dependence-aware estimator;
- finite-sample uncertainty;
- date/issuer/episode clustering;
- overlapping-outcome purge / holdout implementation;
- effective-sample assessment;
- MDE / precision-based sample adequacy review;
- multiple-testing/search-risk review;
- concentration / fragility inference;
- promotion-grade validation receipt.

D16 must not redefine D02 feature meaning after outcomes.
D02 must not self-certify statistical adequacy.

## 2. No universal fixed-N rule for Wave-2

Wave-1 H001/H20/H003 retains its already-frozen descriptive/evidence floors:
- >=20 CLEAN scan dates -> DESCRIPTIVE_ONLY;
- >=30 CLEAN scan dates AND >=100 completed eligible events -> first evidence-eligibility checkpoint.

These are preregistered Wave-1 gates, not a universal theorem.

For D02-01 and Wave-2 modules:
sample adequacy is D16-owned and must be tied to:
- preregistered MDE / precision / semantic-materiality target;
- independent scan dates;
- symbol/entity dependence;
- overlapping outcome windows;
- regime/episode concentration;
- multiple-testing family size;
- missingness/coverage;
- cost/liquidity uncertainty where economic.

Row count alone cannot establish adequacy.

## 3. D02 evidence-key registry

F0:
- D02-01:SEMANTIC_GOVERNANCE

F1:
- D02-02:H001
- D02-03:H20
- D02-04:DRYUP

F2:
- D02-05:EXTREME_PARTICIPATION
- D02-06:H003

F3:
- D02-07:SVB20
- D02-09:PIVOT_SIGNED_VOLUME
- D02-09:PARTICIPATION_TRAJECTORY

F4:
- D02-08:PROVIDER_PRESSURE

F5:
- D02-10:TREND_VOLUME_INTERACTION
- D02-11:LIQUIDITY_COUNTERFACTUAL
- D02-12:TIME_OF_DAY_VOLUME_CURVE
- D02-12:PRICE_BY_VOLUME_PROFILE

Evidence keys are isolated.
No module/family may borrow another key's event count, date count, effective sample or D16 review receipt.

## 4. D02 admission versions

- D02-01 consumes D02_01_L4_SEMANTIC_ADMISSION_V0_1.
- D02-02 / D02-03 / D02-06 consume D02_L4_WAVE1_GATE_V0_1_1.
- D02-04 / 05 / 07 / 08 / 09 / 10 / 11 / 12 consume D02_L4_WAVE2_ADMISSION_V0_1.

If D02 changes feature semantics, family identity, outcome horizon, threshold, slot, comparator or admission logic after outcome access:
- new experiment/admission version is required;
- prior D16 receipt cannot be silently reused.

## 5. Required D16 receipt fields

Machine guard:
research/d02_d16_l4_validation_receipt_guard_v0_1.mjs

Required at minimum:
- owner = D16;
- receiptId;
- evidenceKey;
- admissionVersion;
- experimentVersion;
- outcomeContractVersion;
- multipleTestingFamilyId;
- commonSupportCount;
- independentScanDateCount;
- independentSymbolCount;
- dateDependenceMethod;
- smallClusterTreatment;
- overlapControl;
- purgeResult;
- coverageMissingnessSummary;
- effectTarget;
- sampleAdequacyStatus;
- effectiveSampleReport when ADEQUATE;
- dependenceAssessmentPass when ADEQUATE;
- multipleTestingReviewPass when ADEQUATE;
- concentrationReviewPass when ADEQUATE;
- costLiquidityReviewPass for economic positive candidates;
- resultStatus.

## 6. Effect target

Before predictive outcomes are inspected, each experiment must carry one frozen decision-relevant target:

Economic modules:
- MDE; or
- precision target.

D02-01 semantic governance:
- semantic materiality target.

Target must include:
- version;
- unit;
- frozenBeforeOutcome=true.

Observed sample mean cannot define the target after the fact.

## 7. Dependence reporting

D16 receipt must explicitly address:
- same-date common shock;
- repeated symbol/entity dependence;
- overlapping D+N outcomes where present;
- regime/episode concentration where relevant;
- small date-cluster fragility.

Naive row-level IID inference is not promotion-grade.

The exact method remains D16-owned.
D02 does not preselect cluster-robust, HAC or block bootstrap merely to obtain a favorable result.

## 8. Allowed result states for D02 consumption

Non-positive / blocked:
- WAITING_METHOD_OWNER
- WAITING_DATA
- DATA_QUALITY_BLOCKED
- ACCUMULATING
- INSUFFICIENT_EVIDENCE
- NO_INCREMENTAL_VALUE
- REDUNDANT
- FRAGILE_DATE_DEPENDENCE
- OUTCOME_WINDOW_DEPENDENCE
- REGIME_OR_INDUSTRY_CONCENTRATED
- COST_FRAGILE

Positive-review candidates:
- VALIDATION_PASS_CANDIDATE
- SEMANTIC_GOVERNANCE_CANDIDATE

A candidate is not an automatic maturity promotion.
It only permits D02 L4 promotion review.

## 9. Semantic-vs-economic separation

D02-01:
- may produce SEMANTIC_GOVERNANCE_CANDIDATE;
- cannot produce an alpha claim merely because governance prevented false classification.

Economic modules:
- cannot use SEMANTIC_GOVERNANCE_CANDIDATE as their positive result state;
- require cost/liquidity review when claiming a positive economic validation candidate.

## 10. Cross-key integrity

Forbidden:
- one D16 receipt ID reused across different D02 evidence keys;
- pooled H001/H20/H003 counts;
- pooled D02-09 pivot/trajectory evidence;
- pooled D02-12 time-curve/profile evidence;
- importing D03/D05/D16 maturity as D02 maturity;
- treating several transforms of one primitive source as independent votes.

## 11. Promotion sequence

1. D02 admission PASS.
2. Genuine prospective/OOS outcome join.
3. D16 validation receipt produced.
4. D16 sampleAdequacyStatus = ADEQUATE.
5. Dependence / multiple-testing / concentration / coverage checks pass.
6. Module-specific falsifier survives.
7. D02 may enter L4_PROMOTION_REVIEW.
8. D02 maturity is changed only after explicit research readback and module-specific evidence review.

No step changes Formal Core.

## 12. Current state

D02:
- 12/12 modules L3;
- 60.0%;
- PVE-239;
- CLEAN_DATE_ZERO;
- Gate 7 CLOSED.

D16:
- owns the unresolved exact inference implementation and sample-adequacy judgment;
- fixed row-count rules must not be invented by D02.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.
