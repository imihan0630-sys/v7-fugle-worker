# SDA-022 D16 model-method receipt decision tree V0.1

Status: RESEARCH_ONLY / PRE_OUTCOME / OUTCOMES_CLOSED
Owner: Room11 / D16
Date: 2026-10-06 Asia/Taipei
Formal Core impact: NONE

## Purpose

Freeze the admissible method-selection path for D16-SDA022-01 before any economic outcome inspection, while System2 strategy-policy fingerprints and physical NC-T01 remain pending.

Primary target remains the preregistered D5 common-support predictive-incrementality question. This file does not change target, horizon, strategy identity, or Formal behavior.

## Identification firewall

Brier-loss incrementality is identifiable only when the compared inputs have a decision-time-valid probability interpretation.

Forbidden:
- treating selected/not-selected as probability 1/0;
- treating raw rank, percentile, score, gate, or strategy state as probability without a frozen calibration receipt;
- choosing a transform after observing D5 outcomes;
- pooling System2 strategies;
- using D1/D3/D10 to rescue the D5 primary;
- backfilling early dates with a calibrator trained on later labels.

## Conditional method tree

### Branch A — both systems expose native probabilities

Use native probabilities only if both probability semantics are versioned, decision-time available, target-compatible, and provenance-bound before outcome access.

If any condition fails, Branch A is ineligible.

### Branch B — System1 probability + System2 categorical/ordinal state

The System1 probability remains the baseline. System2 enters only through a preregistered low-degree-of-freedom state encoding whose categories and ordering are fixed by the strategy-policy fingerprint.

No state-specific effect may be merged or split after outcomes.

### Branch C — both systems expose only categorical/ordinal/rank-like states

Fit probability mappings using strictly prior, already-matured, admissible labels only. Each decision date requires a calibration receipt binding:
- training start/end;
- label maturity cutoff;
- information cutoff;
- target/horizon;
- state encoding/version;
- estimator family/version;
- regularization;
- training population/common-support rule;
- missingness/admission rule;
- artifact hash.

If insufficient prior data exist, mark CALIBRATION_WARMUP_INELIGIBLE and retain the date in the coverage denominator.

### Branch D — semantics unstable or incomparable

If score/state meaning changes across versions without an auditable bridge, or if a legal calibration training set is unavailable, the primary probabilistic estimand is NOT_IDENTIFIABLE_YET.

Do not substitute another metric after outcomes.

## Model freedom firewall

Before the first primary outcome opening, freeze exactly one eligible estimator family and its hyperparameter-selection rule.

Allowed selection information:
- policy fingerprints;
- input dimensionality/type;
- strictly prior admissible labels if the chosen branch requires calibration;
- outcome-blind data-quality diagnostics.

Forbidden selection information:
- any primary holdout D5 result;
- any comparison of candidate methods on the protected primary stream;
- any regime cell chosen because it looks favorable.

## Dependence and inference

The primary aggregation unit remains decision date. Symbol rows are not independent replicates.

Inference must preserve:
- repeated-symbol dependence;
- overlapping D5 outcome footprints;
- sector clustering where material;
- D18 replication-cluster dependence;
- SDA-016 admission/missingness and footprint governance.

A numerical MDE is not frozen from the protected outcomes. A numerical MDE/precision target may be frozen only from a documented outcome-independent source or a preregistered precision requirement. Otherwise the stream remains exploratory-only.

## Stopping

Retain SINGLE_PRIMARY_LOOK. No efficacy/futility peeking. Outcome-blind integrity/readiness checks remain allowed.

## D18 interaction

Regime slices are secondary diagnostics only. They cannot rescue a failed primary D5 result. Any promoted regime-specific claim requires a new preregistered experiment plus PIT, replication-cluster support, admission coverage, and multiplicity control.

## Falsification conditions

The primary probabilistic incrementality claim fails identification if any of the following occurs:
1. probability semantics are assigned after protected outcomes are inspected;
2. calibrator training includes labels not matured by the decision-time training cutoff;
3. warmup-ineligible dates are silently backfilled;
4. System2 strategy states are pooled across strategy identities;
5. score/rank version drift is bridged using outcome information;
6. complete-case-only analysis is generalized despite unresolved admission positivity;
7. one D18 replication cluster dominates the apparent effect;
8. D5 footprint overlap is treated as independent replication.

## Current state

System1 fingerprint family: PASS per current canonical Room11 return.
System2 fingerprint family: PENDING.
Physical NC-T01 family: PENDING.
Prospective overlap/divergence family: NOT_STARTED.
D16 preregistration family: PASS 4/4.
Economic outcomes: CLOSED.
Formal optimization candidate: NONE.

## Exact next continuation

1. Re-read latest main and SDA-022 oracle.
2. If actual System2 per-strategy fingerprints land, validate S22-T06~T10 only and select the corresponding method-tree branch without outcomes.
3. If physical NC-T01 lands, validate S22-T11~T16 only.
4. After both upstream chains pass, begin prospective S22-T17~T24 accumulation.
5. Before primary outcome opening, persist the exact ModelMethodReceipt and freeze an outcome-independent MDE/precision target or retain exploratory-only interpretation.
6. Room00 remains sole closure authority.
