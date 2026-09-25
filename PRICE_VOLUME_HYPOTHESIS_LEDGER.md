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
- Status: DATA_QA
- Frozen question: Does pvSlotRvol20 add incremental information beyond the existing local previous-5-bar volumeRatio for structural false/no-follow-through?
- Cohort: symbols already selected/monitored by Formal only
- Primary outcomes: frozen structural failure/no-follow-through labels
- Secondary: MFE/MAE, D1 where applicable
- Guards: exclude/stratify INVALID/GUARDED states per PV-066
- Comparators: model B vs C in the A->E sequence
- Threshold tuning: prohibited inside v0.1
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-H002 — Cumulative-volume pace incremental value

- Origin: PV-005 / PV-057 / PV-083
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Does pvCumvolPace20 add information beyond pvSlotRvol20 by distinguishing isolated slot bursts from persistent session participation?
- Cohort: same as PV-H001
- Primary outcomes: structural failure/no-follow-through
- Secondary: MFE/MAE, persistence trajectory
- Comparator: model C vs D
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-H003 — Latent response/acceptance/guard state incremental value

- Origin: PV-010 / PV-020 / PV-057 / PV-063-066
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Do pvResponseState, pvAcceptanceState and pvGuardState add information beyond numeric volume ratios and existing Formal context?
- Comparator: model D vs E
- Primary outcomes: structural acceptance/failure
- Secondary: MFE/MAE
- Important ambiguity: HIGH_EFFORT_LOW_PROGRESS is never assigned a directional sign ex ante
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-H004 — Risk information without directional alpha

- Origin: PV-026 / PV-033
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Can abnormal participation predict realized range, MAE, stop-first or false confirmation even if future-return sign is weak?
- Primary outcomes: MAE / realized range / structural failure
- Directional return is reported separately
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-093 implementation checkpoint

- V8.11.0 implements the frozen `PV_SHADOW_V0_1` collector as Class-A `LOG_ONLY` with `decisionImpact=false`.
- Status `DATA_QA` means infrastructure and deterministic fixtures are ready; it does not mean any hypothesis has prospective support.
- Thresholds, labels and the A→E comparison family remain frozen. Failed, inconclusive and supported results must continue to be retained here.

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

## PV-H005 — Dealer proprietary vs hedge flow

- Origin: PV-098 / PV-099 / PV-102 / PV-106
- Schema: future Tier-2 research version; NOT PV_SHADOW_V0_1
- Status: PLANNED
- Frozen question: Does dealer proprietary-flow streak provide cleaner incremental institutional-confirmation information than the current combined dealer flow, while dealer hedge flow primarily explains mechanical/risk context?
- Counter-hypothesis: Dealer hedge demand itself may carry useful directional information or persistent real cash demand; removing it may worsen performance.
- Data feasibility: TWSE/TPEx official institutional payloads already contain proprietary and hedge fields separately; expected incremental API cost = zero if the existing payload is preserved.
- Cohort: existing Formal selected/control cohorts only; do not alter cohort inclusion.
- Comparators:
  A. current combined dealerBuyDays
  B. proprietary-only dealerBuyDays
  C. hedge-only dealerBuyDays
  D. foreign/trust confirmation without dealer
  E. conditional combinations
- Primary outcomes: false-confirmation, D1/D3/D5, MFE/MAE.
- Utility outcomes: selected-name scarcity and capital-utilization impact.
- Controls: regime, sector, liquidity, price tier, PV acceptance, passive-flow/expiry/disposition context where available.
- Promotion rule: no Formal change until incremental value and untouched confirmation evidence pass governance.
- Current result: no test yet.
- Decision: remain PLANNED.

### PV-H005 protocol extension after PV-126/PV-128
- Gross participation and net direction are now frozen as separate constructs.
- Required dealer fields include buy/sell/net for proprietary and hedge, not net only.
- Derived research views:
  - gross side participation;
  - directional imbalance;
  - buy/sell streaks;
  - prop-vs-hedge sign state.
- Any side-participation share requires compatible source scope; daily institutional statistics must not be divided by intraday 15m volume.
- Primary H005 cohort uses the full existing Formal/control observation set across the RVOL distribution. Restricting only to high-RVOL events is secondary/descriptive because selection on high volume may create collider bias.
- High-RVOL subgroup findings are never sufficient causal evidence by themselves.
- Current status remains PLANNED; no capture implementation or Formal change yet.
