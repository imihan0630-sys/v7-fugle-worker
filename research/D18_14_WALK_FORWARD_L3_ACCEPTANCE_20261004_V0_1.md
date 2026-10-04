# D18-14 Walk-forward Regime Validation L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 policy impact: NONE

## Scope

This packet evaluates D18-14 Walk-forward Market-Regime Validation only.

L3 is accepted because an executable research-only planner now consumes frozen D18-13 attribution receipts and builds chronological train/holdout partitions with:

- official-session boundaries;
- non-overlapping chronological test folds;
- D+N purge at the holdout boundary;
- training knowledge cutoffs;
- test evaluation cutoffs;
- independent-date counts;
- explicit immature/unknown coverage.

The planner does not select models, thresholds or policies.

This is data-feasibility validation only.
It is not L4 OOS evidence.

## Executable implementation

Implementation:
`system2/runtime/d18_walk_forward_plan_v0_1.mjs`

Test:
`system2/tests/d18_walk_forward_plan_v0_1.test.mjs`

## Input identity

Every attribution receipt must share:
- strategyId;
- strategyVersion;
- regimeVectorVersion;
- requested horizon;
- cost scenario id.

Mixed strategy versions, regime versions, horizons or cost semantics are rejected.

Every receipt must preserve:
- attribution receipt hash;
- decision id;
- decision date/time;
- outcome updatedAt;
- MATURED / IMMATURE / UNKNOWN state.

Duplicate receipt hashes or decision ids are rejected.

## Chronological fold contract

Each fold freezes:
- trainStartDate;
- trainEndDate;
- testStartDate;
- testEndDate;
- trainingKnowledgeCutoff;
- evaluationAsOf.

Required:
trainEndDate < testStartDate.

Test blocks must be chronological and non-overlapping.

All fold boundary dates must be official sessions.

Fold boundaries are inputs.
They are not chosen after seeing returns.

## Purge rule

For a D+N attribution target, a training decision is purged when its D+N official-session outcome date:

reaches or crosses the next testStartDate.

This prevents the training label from using prices inside the holdout block.

The purge is based on official-session position, not calendar-day subtraction.

## Knowledge-time rule

A non-purged training attribution enters the train set only when:
- state=MATURED;
- outcomeUpdatedAt <= trainingKnowledgeCutoff.

Otherwise it remains trainUnresolved.

A test attribution enters testMatured only when:
- state=MATURED;
- outcomeUpdatedAt <= evaluationAsOf.

IMMATURE / UNKNOWN test rows remain testUnresolved.
They are not converted to zero.

## Independent evidence units

Every fold reports separately:
- row counts;
- independentTrainDateN;
- independentTestDateN;
- independentMaturedTestDateN.

rowPoolingAsIndependentEvidence=false.

Many stocks on one decision date cannot manufacture many independent market histories.

## Falsification verified

The test suite verifies:
- D+3 overlap removes late training dates before a holdout;
- two early dates remain training eligible;
- IMMATURE/UNKNOWN test receipts remain unresolved;
- a training outcome observed after the training cutoff is excluded;
- mixed strategy version is rejected;
- overlapping train/test intervals are rejected;
- same inputs replay to the same planHash.

## Anti-overfit flags

Frozen:
- foldBoundaryChosenFromOutcome=false;
- thresholdTuningPerformed=false;
- policyOptimizationPerformed=false;
- modelSelectionPerformed=false;
- strategyImpact=false;
- selectionImpact=false;
- capitalImpact=false.

The planner cannot discover a profitable regime rule.
It only creates a valid evaluation partition.

## L3 promotion-gate review

Per `research/D16_D18_PROMOTION_GATE_V0_1.md`:

1. executable/tested builder: PASS.
2. source/version/availableAt provenance: PASS through D18-13 attribution identities + fold knowledge cutoffs.
3. replay test: PASS.
4. UNKNOWN fail-closed: PASS via unresolved partitions.
5. no historical backfill: PASS; only frozen attribution receipts are consumed.
6. source coverage audited: PASS through upstream D18-01/13 contracts and per-fold coverage accounting.

## Why not L4

No return advantage is claimed.

L4 still requires actual prospective/OOS evaluation with:
- frozen policy/strategy/regime versions;
- a preregistered policy class + MDE;
- paired static baseline;
- exposure-matched control where relevant;
- complete test outcomes;
- more than one relevant regime episode;
- identical costs;
- no single-episode domination;
- transition and UNKNOWN coverage accounting.

D18-14 therefore stops at L3.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next

1. Accumulate prospective D18-01/11/13 receipts across real dates.
2. Measure occupancy / transition frequency before policy selection.
3. Choose only one preregistered policy class + strategy + MDE when sample support exists.
4. Use this planner to create untouched chronological folds.
5. Do not promote any D18 policy to L4 before multiple relevant regime episodes exist.
