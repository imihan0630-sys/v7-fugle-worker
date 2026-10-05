# D03 -> D16 Method Receipt Acceptance Oracle V0.1

Updated: 2026-10-05 Asia/Taipei
Producer: D03｜技術指標與趨勢動能研究室
Inference owner: D16｜統計驗證
Scope: TI-005 KD vs RSI / TI-006 MACD vs direct trend
Status: RESEARCH_ONLY / OUTCOME_CLOSED / ACCEPTANCE_ORACLE_FROZEN
Formal Core: LOCKED
Ticket linkage: SDA-001 / SDA-004

## Purpose

Freeze how D03 will accept or reject the future D16 method receipt before any TI-005/TI-006 outcome access.

This oracle does not choose D16's estimator. It checks whether D16 preserves the already-frozen D03 estimand, parent population, common support, chronology, dependence structure, multiplicity family and holdout boundary.

A receipt can be structurally valid and still return METHOD_BLOCKED / POWER_INSUFFICIENT / COMMON_SUPPORT_INSUFFICIENT. Those are valid scientific outcomes, not failures that may be tuned away.

A valid receipt does not by itself open outcomes. D03 T1-T5 physical gates remain separately required.

## TI-749 — identity binding is blocking

A D16 receipt must bind:
- methodReceiptVersion;
- exact D03 experiment version;
- exact preregistration hash;
- exact feature-contract hashes;
- parent, continuity and outcome contract versions.

Any missing or mismatched identity is VERSION_INCOMPATIBLE and cannot be repaired after outcome inspection.

Acceptance rule:
`IDENTITY_BINDING = BLOCKING`.

## TI-750 — population and common-support invariants

The receipt must state the expected parent population and a common-support inclusion rule frozen before outcomes.

Required:
- selectedOnlyInference = false;
- BLOCKED / UNKNOWN / CONSTRAINED handling explicit;
- missingness is never coerced to a negative signal;
- the comparison arms use the same eligible parent rows;
- date-level population accounting is preserved.

A method that compares one model on a favorable complete subset against another on a broader set fails acceptance.

Acceptance rule:
`COMMON_SUPPORT_SAME_ROWS = REQUIRED`.

## TI-751 — chronology / purge / holdout firewall

The receipt must freeze:
- chronological split rule;
- training scan dates;
- purged training scan dates;
- untouched holdout scan dates;
- purge rule derived from the maximum registered forward horizon;
- holdoutMethodSelection = false.

Prohibited:
- random row split;
- using holdout performance to choose estimator, encoding, loss, thresholds or feature representation;
- changing purge/embargo after seeing outcomes;
- moving failed holdout dates back into training.

The purge rule must address overlapping D5/D10/D20 information footprints, not merely disjoint decision-date labels.

## TI-752 — dependence-aware inference contract

Primary inference may not treat stock rows as IID.

The D16 receipt must explicitly address:
- same-scanDate common shocks;
- repeated symbols;
- repeated setup/episode observations;
- overlapping forward outcome windows;
- overlapping indicator lookbacks;
- sector/industry common shocks.

Minimum reporting:
- row N;
- independent scanDate N;
- unique symbol N;
- repeated-symbol share;
- cluster-size distribution;
- forward-window overlap diagnostics.

D16 may select a valid finite-sample / cluster / resampling procedure, but the choice must be frozen before holdout results and include failure states for thin or pathological support.

## TI-753 — estimand and weighting lock

For every H005/H006 registered comparison, the receipt must state:
- exact endpoint;
- exact contrast;
- weighting rule;
- uncertainty interval;
- effect-size metric.

Primary aggregation must preserve equal scanDate weighting unless D16 supplies a preregistered explicit alternative that still does not convert row count into independent N.

No endpoint may be selected because it is favorable.

D5 returnPct / MFE / MAE remain a jointly declared primary family.
D10 / D20 remain registered secondary families and cannot rescue a failed D5 primary conclusion.

## TI-754 — multiple-testing family cannot shrink

The receipt must preserve one D03 multiplicity family containing:
- H005-A / H005-B / H005-C / H005-D;
- H006-A / H006-B / H006-C;
- D5 return / MFE / MAE primary endpoints;
- D10 / D20 registered secondary endpoints.

Failed, negative, null and inconclusive cells remain in the family history.

Renaming:
- an indicator;
- a parameterization;
- an experiment version;
- a holdout;
- an endpoint presentation

does not erase prior family consumption.

No alternate KD/RSI/MACD periods or timeframe search are authorized inside V0.1.

## TI-755 — model-order and no-outcome-retuning guard

Frozen order:
1. TI-005 KD vs RSI;
2. TI-006 MACD vs direct trend.

The order cannot be reversed because descriptive or later performance looks more attractive.

D16 may return METHOD_BLOCKED or POWER_INSUFFICIENT. It may not compensate by:
- changing formulas;
- changing periods;
- changing thresholds;
- substituting a different endpoint;
- changing the baseline;
- dropping difficult dates;
- adding an unregistered transform after outcome access.

Any such change requires a new preregistered research family and appropriate holdout-consumption accounting.

## TI-756 — terminal-state semantics

Allowed terminal method states:
- METHOD_READY;
- METHOD_BLOCKED;
- POWER_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- COMMON_SUPPORT_INSUFFICIENT;
- COVERAGE_BIASED;
- VERSION_INCOMPATIBLE.

Scientific fail-closed rule:
a structurally valid receipt with a non-ready terminal state is an accepted method receipt whose result blocks execution. It is not a failed receipt that may be retuned.

`METHOD_READY` means only that the statistical method contract is frozen and structurally admissible.
It does not imply:
- T1-T5 physical data readiness;
- T6 sample floor;
- predictive incrementality;
- independent evidence;
- Formal promotion.

## TI-757 — adversarial acceptance cases frozen

The machine oracle must reject at least:
1. missing preregistration hash;
2. wrong feature-contract hash;
3. selected-only inference;
4. UNKNOWN coerced to negative;
5. random row split;
6. holdout used for method selection;
7. purge rule that ignores D20 / forward-footprint overlap;
8. IID row-level primary inference;
9. row N reported as independent N;
10. missing repeated-symbol / overlap handling;
11. endpoint cherry-picking;
12. D10/D20 rescue of failed D5;
13. removal of failed multiplicity cells;
14. reversed TI-005/TI-006 order after inspection;
15. unsupported terminal state;
16. post-outcome formula/period/threshold mutation.

It must accept a structurally complete fail-closed receipt such as POWER_INSUFFICIENT without converting it to METHOD_READY.

## TI-758 — current state and routing

This oracle is frozen before D16 returns a D03-specific method receipt.

Current:
- D16 D03 method receipt = NOT_YET_RETURNED;
- D03 raw source-version gate = 2/3;
- Technical observer T1-T3 = not physically complete;
- outcome join = CLOSED;
- System 1 genuine-session SDA receipt = pending;
- System 2 runtime dedup diagnostics = missing;
- Formal Core = LOCKED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

No maturity promotion is justified:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40.

## Exact next continuation

1. D16 returns a machine-readable D03 method receipt.
2. D03 runs this oracle only against the returned receipt; do not redesign D16's method if it returns a legitimate blocking state.
3. Even METHOD_READY does not open outcomes unless D03 T1-T5 physical gates independently pass.
4. System 1 and System 2 machine-diagnostic lanes continue independently.
5. Room 00 remains the cross-domain closure authority for SDA-001/SDA-004.
