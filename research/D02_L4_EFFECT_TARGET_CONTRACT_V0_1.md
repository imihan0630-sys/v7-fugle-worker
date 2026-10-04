# D02 L4 Effect Target Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Owner of D02 estimand/economic meaning: 02｜價量研究室
Owner of statistical adequacy relative to target: D16｜統計驗證
Status: PRE_PVE_240 / OUTCOME_BLIND / TARGET_VALUE_FREEZE_PENDING
Evidence cursor: PVE-239
Formal Core impact: NONE

## Purpose

Close a preregistration loophole in the first D02→D16 receipt interface.

The prior receipt guard required an effectTarget object with:
- kind;
- version;
- unit;
- frozenBeforeOutcome.

That was not sufficient.

A target without an exact metric, direction and numerical criterion can still be rewritten after outcomes while remaining structurally valid.

Therefore no D02 L4 promotion-grade D16 receipt is valid unless it binds to a complete frozen EffectTargetReceipt.

## Required EffectTargetReceipt

Every evidence key must bind exactly one target receipt containing:

- targetId;
- targetVersion;
- evidenceKey;
- kind;
- estimandId;
- metric;
- unit;
- direction;
- numerical criterion:
  - thresholdValue for MDE / semantic-materiality target; or
  - maxHalfWidth for precision target;
- comparatorId;
- outcomeHorizon;
- costTreatment;
- frozenAt;
- frozenBeforeOutcome=true;
- outcomeAccessStateAtFreeze=OUTCOME_CLOSED;
- targetHash;
- rationale;
- status=FROZEN.

## Allowed target kinds

### MDE
Minimum detectable / economically meaningful effect.

Requires:
- finite thresholdValue > 0;
- direction in:
  - GREATER_THAN_OR_EQUAL;
  - LESS_THAN_OR_EQUAL;
  - TWO_SIDED_ABSOLUTE.

### PRECISION_TARGET
Precision-oriented sample adequacy target.

Requires:
- finite maxHalfWidth > 0;
- direction = TWO_SIDED_PRECISION.

### SEMANTIC_MATERIALITY_TARGET
For D02-01 only.

Requires:
- finite thresholdValue > 0;
- a semantic metric such as a frozen classification-delta rate;
- no alpha interpretation.

## Hash binding

D16 must echo:
- targetId;
- targetVersion;
- targetHash.

The D02 consumer guard must compare these against the exact expected frozen target receipt.

A receipt is invalid when:
- target hash is missing;
- target hash mismatches;
- target ID/version mismatches;
- the numerical criterion is missing/nonpositive;
- metric/unit/direction is missing;
- the target was frozen after outcome access opened.

## No target borrowing

Targets are evidence-key specific.

Forbidden:
- H001 target reused for H20;
- D02-09 pivot target reused for participation trajectory;
- D02-12 time-curve target reused for price-by-volume profile;
- one generic D02 target used across all modules.

## Target changes

After genuine outcome access begins, changing any of the following creates a new experiment/target version and a fresh forward evidence clock:
- metric;
- unit;
- direction;
- numerical target;
- comparator;
- outcome horizon;
- cost treatment.

Old evidence may remain descriptive but cannot be silently re-labeled under the new target.

## Current target state

Repository audit on 2026-10-04 found no formal numerical D02 MDE / precision / semantic-materiality target.

Existing test values such as `net_bps` or `classification_delta_share` are fixtures only and are NOT research thresholds.

Therefore all D02 L4 evidence keys currently remain:
TARGET_VALUE_PENDING_FREEZE.

This is an explicit pre-PVE blocker, not a reason to invent arbitrary numbers.

PVE-240 may still collect PIT/admission data.
Promotion-grade outcome interpretation must remain closed until the relevant evidence key has a complete frozen target receipt.

D02 maturity remains 60.0%.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
