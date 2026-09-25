# Price-Volume Hypothesis Ledger

Purpose: preserve every frozen PV hypothesis, including failed/inconclusive tests, so later research cannot silently rediscover or retune old ideas.

Formal Core: LOCKED
Current research schema: PV_SHADOW_V0_1

## Status vocabulary
- PLANNED
- DATA_QA
- TESTING
- SUPPORTED
- NOT_SUPPORTED
- INCONCLUSIVE
- ARCHIVED

## PV-H001 — Same-slot RVOL incremental value

- Origin: PV-005 / PV-057 / PV-083
- Schema: PV_SHADOW_V0_1
- Status: PLANNED
- Frozen question: Does pvSlotRvol20 add incremental information beyond the existing local previous-5-bar volumeRatio for structural false/no-follow-through?
- Cohort: symbols already selected/monitored by Formal only
- Primary outcomes: frozen structural failure/no-follow-through labels
- Secondary: MFE/MAE, D1 where applicable
- Guards: exclude/stratify INVALID/GUARDED states per PV-066
- Comparators: model B vs C in the A->E sequence
- Threshold tuning: prohibited inside v0.1
- Current result: no prospective sample yet
- Decision: remain PLANNED

## PV-H002 — Cumulative-volume pace incremental value

- Origin: PV-005 / PV-057 / PV-083
- Schema: PV_SHADOW_V0_1
- Status: PLANNED
- Frozen question: Does pvCumvolPace20 add information beyond pvSlotRvol20 by distinguishing isolated slot bursts from persistent session participation?
- Cohort: same as PV-H001
- Primary outcomes: structural failure/no-follow-through
- Secondary: MFE/MAE, persistence trajectory
- Comparator: model C vs D
- Current result: no prospective sample yet
- Decision: remain PLANNED

## PV-H003 — Latent response/acceptance/guard state incremental value

- Origin: PV-010 / PV-020 / PV-057 / PV-063-066
- Schema: PV_SHADOW_V0_1
- Status: PLANNED
- Frozen question: Do pvResponseState, pvAcceptanceState and pvGuardState add information beyond numeric volume ratios and existing Formal context?
- Comparator: model D vs E
- Primary outcomes: structural acceptance/failure
- Secondary: MFE/MAE
- Important ambiguity: HIGH_EFFORT_LOW_PROGRESS is never assigned a directional sign ex ante
- Current result: no prospective sample yet
- Decision: remain PLANNED

## PV-H004 — Risk information without directional alpha

- Origin: PV-026 / PV-033
- Schema: PV_SHADOW_V0_1
- Status: PLANNED
- Frozen question: Can abnormal participation predict realized range, MAE, stop-first or false confirmation even if future-return sign is weak?
- Primary outcomes: MAE / realized range / structural failure
- Directional return is reported separately
- Current result: no prospective sample yet
- Decision: remain PLANNED

## Future hypothesis-entry template

### PV-Hxxx — Title
- Origin:
- Schema:
- Status:
- FirstFrozenAt:
- Frozen question:
- Feature definitions:
- Cohort:
- Primary outcome:
- Secondary outcomes:
- Exclusions/guards:
- Milestones:
- Variants tried:
- Result:
- Decision:
- Untouched confirmation period:
