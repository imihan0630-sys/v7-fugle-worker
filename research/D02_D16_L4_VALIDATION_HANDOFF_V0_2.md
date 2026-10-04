# D02 → D16 L4 Statistical Validation Handoff V0.2

Updated: 2026-10-04 Asia/Taipei
D02 owner: 02｜價量研究室
D16 owner: 11｜統計驗證與策略市場狀態研究室
Status: RESEARCH_ONLY / OUTCOME_BLIND / TARGET_BOUND_HANDOFF_READY / FORMAL_CORE_LOCKED
Evidence cursor: PVE-239
Supersedes for future promotion-grade receipts: D02_D16_L4_VALIDATION_HANDOFF_V0_1

## 1. Ownership boundary

D02 owns:
- price-volume feature semantics;
- event/family identity;
- PIT knownAt / source continuity;
- common-support eligibility;
- admission version;
- anti-double-counting rules;
- module-specific falsifiers;
- decision-relevant target meaning and frozen EffectTargetReceipt.

D16 owns:
- dependence-aware estimator;
- finite-sample uncertainty;
- date/issuer/episode clustering;
- overlapping-outcome purge / holdout implementation;
- effective-sample assessment;
- sample adequacy relative to the frozen D02 target;
- multiple-testing/search-risk review;
- concentration / fragility inference;
- promotion-grade validation receipt.

D16 must not redefine D02 feature meaning or effect target after outcomes.
D02 must not self-certify statistical adequacy.

## 2. EffectTargetReceipt is mandatory

A promotion-grade D16 receipt must echo an exact frozen D02 target:

- targetId;
- targetVersion;
- targetHash.

The target itself must contain:
- evidenceKey;
- kind;
- estimandId;
- metric;
- unit;
- direction;
- thresholdValue for MDE / semantic materiality, or maxHalfWidth for precision;
- comparatorId;
- outcomeHorizon;
- costTreatment;
- frozenAt;
- frozenBeforeOutcome=true;
- outcomeAccessStateAtFreeze=OUTCOME_CLOSED;
- rationale;
- status=FROZEN.

The D16 guard must reject:
- missing target binding;
- ID/version/hash mismatch;
- missing or nonpositive numerical criterion;
- missing metric/unit/direction/comparator/horizon/cost treatment;
- target freeze after outcome access.

## 3. Current target registry

Canonical pending registry:
research/d02_l4_effect_target_registry_v0_1.json

Repository audit found no formal numerical D02 MDE / precision / semantic-materiality target before this contract.

Therefore all 14 D02 evidence keys are currently:
TARGET_VALUE_PENDING_FREEZE.

Fixture values in tests are not research thresholds.

## 4. No universal fixed-N rule for Wave-2

Wave-1 H001/H20/H003 retains its already-frozen descriptive/evidence floors:
- >=20 CLEAN scan dates -> DESCRIPTIVE_ONLY;
- >=30 CLEAN scan dates AND >=100 completed eligible events -> first evidence-eligibility checkpoint.

These are preregistered Wave-1 gates, not a universal theorem.

For D02-01 and Wave-2 modules:
sample adequacy is D16-owned and must be evaluated relative to the exact frozen target.

Row count alone cannot establish adequacy.

## 5. Evidence-key isolation

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

Evidence keys, target receipts and D16 receipts are all isolated.
No cross-key borrowing is allowed.

## 6. Admission versions

- D02-01: D02_01_L4_SEMANTIC_ADMISSION_V0_1
- D02-02 / D02-03 / D02-06: D02_L4_WAVE1_GATE_V0_1_1
- D02-04 / 05 / 07 / 08 / 09 / 10 / 11 / 12: D02_L4_WAVE2_ADMISSION_V0_1

Any post-outcome change to:
- feature semantics;
- comparator;
- outcome horizon;
- metric;
- target value;
- target direction;
- cost treatment;
- admission rule

requires a new version and fresh forward evidence clock.

## 7. Guard versions

Historical V0.1:
- research/d02_d16_l4_validation_receipt_guard_v0_1.mjs
- 24/24 tests PASS
- does not enforce complete numerical target binding.

Promotion-grade V0.2:
- research/d02_d16_l4_validation_receipt_guard_v0_2.mjs
- tests/test_d02_d16_l4_validation_receipt_guard_v0_2.mjs
- 39/39 tests PASS
- fixtureTargetsAreResearchThresholds=false
- complete EffectTargetReceipt binding required.

V0.1 remains replayable historical governance only.
Future promotion-grade D02 consumption must use V0.2 or a later explicit version.

## 8. Required D16 receipt fields

At minimum:
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
- exact frozen EffectTargetReceipt echo;
- sampleAdequacyStatus;
- effectiveSampleReport when ADEQUATE;
- dependenceAssessmentPass when ADEQUATE;
- multipleTestingReviewPass when ADEQUATE;
- concentrationReviewPass when ADEQUATE;
- costLiquidityReviewPass for positive economic candidates;
- resultStatus.

## 9. Promotion sequence

1. D02 effect target FROZEN.
2. D02 admission PASS.
3. Genuine prospective/OOS outcome join.
4. D16 validation receipt produced.
5. V0.2 target ID/version/hash binding PASS.
6. D16 sampleAdequacyStatus = ADEQUATE relative to target.
7. Dependence / multiple-testing / concentration / coverage checks pass.
8. Module-specific falsifier survives.
9. D02 may enter L4_PROMOTION_REVIEW.
10. D02 maturity changes only after explicit module-specific research readback.

No step changes Formal Core.

## 10. Current state

D02:
- 12/12 modules L3;
- 60.0%;
- all next-level admission firewalls executable;
- D16 consumer guard V0.2 executable;
- all 14 numerical EffectTargetReceipt values still pending;
- PVE-239;
- CLEAN_DATE_ZERO;
- Gate 7 CLOSED.

PVE-240 may collect PIT/admission evidence.
Promotion-grade outcome interpretation remains blocked until the relevant target receipt is frozen before outcome access.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.
