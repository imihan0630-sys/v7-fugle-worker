# D01 DL-089 — First-Wave TWSE Bounded OOS Dataset Manifest V0.1

Updated: 2026-10-07 Asia/Taipei
Status: PREOUTCOME_MANIFEST_FROZEN / EXECUTION_BLOCKED / FORMAL_CORE_LOCKED

## Purpose

Freeze one bounded, scientifically usable TWSE chronology for D01 first-wave OOS validation before data-context blockers are repaired.

This is a preparatory evidence tranche, not the full-Taiwan primary inference universe.

## Scope

Market:
TWSE only.

Security class:
historically valid ordinary common equities from the canonical point-in-time historical-universe receipt.

Raw source layer:
official historical daily A1 cold history.

Price space:
RAW_EXECUTION as stored by the canonical raw-history lane.
TECHNICAL_CONTINUITY must be supplied separately by owner-certified continuity receipts where needed.

## Frozen calendar

Warmup-only year:
2018.

Inference years:
2019-2024.

Fold 1:
- train: 2019-2021;
- purge/embargo: minimum 20 eligible sessions at boundary;
- test: 2022.

Fold 2:
- train: 2019-2022;
- purge/embargo: minimum 20 eligible sessions at boundary;
- test: 2023.

Final untouched holdout:
2024.

2018 may provide causal lookback only.
2018 outcome results are not part of the frozen inference family.

No year may be substituted because another year later looks cleaner or more profitable.

## Why TWSE only in this bounded tranche

TWSE 2018-2024 currently has:
- raw data coverage PASS;
- conservative session-finality PIT PASS;
- explicit official current + new-listing + delisting union;
- delisting union complete.

TPEx currently does not have the same historical-universe completeness and 2024 raw acceptance is pending.

Therefore TPEx is not mixed into this bounded manifest.

No conclusion from this manifest may be labeled full-Taiwan evidence.

## Mandatory execution gates

Every symbol-date/window must have:

G1 POINT_IN_TIME_MEMBERSHIP_PASS
G2 RAW_A1_OBSERVATION_PASS
G3 SYMBOL_SESSION_LIFECYCLE_PASS
G4 CORPORATE_ACTION_CONTINUITY_PASS_OR_CERTIFIED_CLEAR
G5 PRICE_LIMIT_REFERENCE_STATE_PASS
G6 DISPOSITION_MATCHING_STATE_PASS_OR_CERTIFIED_NORMAL
G7 BAR_OR_SEQUENCE_OBSERVABILITY_PASS
G8 INFORMATION_ROOT_AND_REDUNDANCY_LINEAGE_PASS
G9 OUTCOME_HORIZON_AVAILABILITY_PASS
G10 D16_MULTIPLICITY_AND_HOLDOUT_POLICY_PASS

If any mandatory gate is UNKNOWN:
the observation remains in the upstream denominator with DATA_BLOCKED state.

No silent complete-case denominator is allowed.

## Module-specific required parents

D01-02:
- normalized raw one-bar OHLC morphology parent.

D01-03:
- normalized raw N-bar sequence parent;
- source-bar overlap lineage.

D01-07:
- prior trend;
- range compression;
- generic breakout;
- online base lifecycle.

D01-09:
- raw opening gap;
- market/sector context;
- corporate-action mechanical-gap classification;
- suspension/resumption classification;
- price-limit/reference-state classification.

## Frozen outcome horizons

1, 5 and 20 eligible sessions.

MFE and MAE use the same horizons.

Executable economic return remains DATA_BLOCKED unless D10 supplies owner-certified cost/slippage treatment.

## Attrition ledger

Every point-in-time universe member remains represented through:
- HISTORY_TOO_SHORT_BY_DESIGN;
- HISTORY_DATA_BLOCKED;
- DETECTOR_NO_STRUCTURE;
- DETECTOR_DATA_BLOCKED;
- STRUCTURE_EMITTED;
- NO_VALID_OPPORTUNITY;
- OPPORTUNITY_DATA_BLOCKED;
- ECONOMIC_EVALUABLE;
- TRADABILITY_EVALUABLE.

No successful-case denominator.

## Activation rule

Current:
MANIFEST_FROZEN = TRUE.
EXECUTION_READY = FALSE.
OUTCOME_JOIN = CLOSED.

Execution may open only when every mandatory source/context family has a versioned physical receipt for the exact target years and D16 accepts the frozen statistical protocol.

Data repair may fill receipts.
Data repair may not change:
- years;
- fold boundaries;
- final holdout;
- horizons;
- first-wave module list;
- common-parent controls.

## Full-Taiwan relation

A separate future full-Taiwan manifest must be frozen after TPEx universe/raw/context readiness reaches the required standard.

TWSE results cannot be retroactively combined with later TPEx results as though they were one predeclared sample.

Formal Core remains LOCKED.
