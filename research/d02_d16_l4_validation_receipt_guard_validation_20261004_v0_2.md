# D02 → D16 L4 Validation Receipt Guard Validation V0.2

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / COMPLETE_EFFECT_TARGET_BINDING_PASS
Evidence cursor: PVE-239
Formal Core: LOCKED
D02 maturity impact: NONE

## Why V0.2 exists

V0.1 correctly enforced D16 ownership, evidence-key isolation, sample-adequacy status, dependence/multiple-testing/concentration reviews and no automatic maturity promotion.

A later audit found one preregistration loophole:

V0.1 accepted an effectTarget with only:
- kind;
- version;
- unit;
- frozenBeforeOutcome.

That did not prove the exact numerical target, metric, direction or comparator had been fixed before outcomes.

Therefore V0.2 requires a complete EffectTargetReceipt and exact target ID/version/hash binding.

## Version integrity

Historical V0.1 was restored from Git history and remains independently replayable:
- guard: research/d02_d16_l4_validation_receipt_guard_v0_1.mjs
- test: tests/test_d02_d16_l4_validation_receipt_guard_v0_1.mjs
- execution: 24/24 PASS.

V0.2 is a separate immutable version:
- guard: research/d02_d16_l4_validation_receipt_guard_v0_2.mjs
- test: tests/test_d02_d16_l4_validation_receipt_guard_v0_2.mjs
- execution: 39/39 PASS.
- fixtureTargetsAreResearchThresholds=false.

## New V0.2 target firewall

A promotion-grade receipt now requires:
- targetId;
- targetVersion;
- targetHash;
- estimandId;
- metric;
- unit;
- direction;
- comparatorId;
- outcomeHorizon;
- costTreatment;
- frozenAt;
- frozenBeforeOutcome=true;
- outcomeAccessStateAtFreeze=OUTCOME_CLOSED;
- rationale;
- status=FROZEN.

Numerical criterion:
- MDE / SEMANTIC_MATERIALITY_TARGET: finite thresholdValue > 0;
- PRECISION_TARGET: finite maxHalfWidth > 0.

The D16 receipt must match the exact target ID/version/hash supplied by the D02 frozen target registry.

## Additional falsification coverage

V0.2 tests now reject:
- missing target;
- target not frozen before outcomes;
- target frozen after outcome access;
- target status not FROZEN;
- missing target ID;
- missing metric;
- missing comparator;
- missing threshold;
- zero threshold;
- invalid frozenAt;
- invalid precision direction;
- missing precision half-width;
- missing expected target binding;
- target ID mismatch;
- target version mismatch;
- target hash mismatch;
- semantic target kind used for an economic module;
- economic MDE kind used for the semantic D02-01 path.

The prior V0.1 ownership/dependence tests remain covered by the expanded suite.

## Repository audit on target values

No formal numerical D02 MDE / precision / semantic-materiality threshold was found.

Values used inside executable tests are explicit FIXTURE values only.
They are not research thresholds and are not copied into:
research/d02_l4_effect_target_registry_v0_1.json.

All 14 D02 evidence keys therefore currently remain:
TARGET_VALUE_PENDING_FREEZE.

## Consequence

The loophole is closed before any clean prospective D02 outcome exists.

PVE-240 may still collect PIT/admission evidence.
Promotion-grade D16 adequacy and D02 L4 promotion review remain blocked until the relevant complete EffectTargetReceipt is frozen.

D02 remains 60.0%.
Clean prospective date count remains 0.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
