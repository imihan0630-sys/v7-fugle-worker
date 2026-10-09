# D16-20 TWSE Surveillance Quasi-Experiment L3 Contract — 2026-10-09 V0.1

Updated: 2026-10-09 Asia/Taipei
Status: RESEARCH_ONLY / CAUSAL_PANEL_INTERFACE_FROZEN / REAL_SAME_CUT_CONTROL_POPULATION_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Module: D16-20 Causal Inference
Formal Core impact: NONE

## Purpose

Freeze a concrete Taiwan causal-data feasibility lane using official TWSE Attention / Disposition designation events.

This contract does not claim that surveillance designation is exogenous.

It defines the minimum panel needed before any causal estimator is even eligible to run.

Core rule:

`OFFICIAL_TREATMENT_EVENT + TREATED_ROWS != CAUSAL_PANEL`.

A valid panel also needs the decision-time untreated eligible population and overlap diagnostics.

## 1. Treatment object

Preferred first treatment family:

`TWSE_SURVEILLANCE_DESIGNATION`.

Treatment receipt must bind:
- symbol;
- security identity;
- announcement date/time or conservative availability bound;
- designation class: ATTENTION or DISPOSITION;
- exact rule family / reason code;
- rule-version effective date;
- treatment effective session;
- source identity and immutable source-row hash;
- capturedAt / availableAt;
- revision/cancellation state.

A treatment cannot be inferred from abnormal price/volume behavior.

## 2. Why Attention and Disposition are separate treatments

ATTENTION and DISPOSITION differ in:
- legal/market status;
- trading constraints;
- economic mechanism;
- expected liquidity/execution impact;
- assignment criteria.

They may not be pooled under one binary flag merely to increase N.

First panel should use one frozen treatment class.

## 3. Same-cut untreated candidate pool

For every treated decision date, create:

`UNTREATED_ELIGIBLE_POOL_RECEIPT`.

It must bind the full population of securities that:
- were in the frozen eligible TWSE ordinary-common-equity universe at the treatment decision clock;
- had all pre-treatment covariates required by the design;
- were not already under the same treatment state;
- were not future-known to become treated;
- were observable under the same source/session cut.

Every excluded symbol needs a reason code.

Required reason examples:
- NOT_ELIGIBLE_SECURITY_CLASS;
- ALREADY_TREATED;
- PRE_TREATMENT_COVARIATE_MISSING;
- SESSION_INVALID;
- MEMBERSHIP_UNKNOWN;
- SOURCE_LATE;
- OTHER_FROZEN_REASON.

No selected-only or future-survivor control pool.

## 4. Pre-treatment covariates

All covariates must be frozen strictly before treatment availability/effective time.

Candidate baseline set:
- prior return windows;
- prior realized volatility / ATR-compatible volatility descriptor;
- turnover / trade-value liquidity;
- price level;
- sector / industry identity;
- market beta or market-relative return;
- prior Attention/Disposition history;
- prior limit-hit / non-trading state where available;
- size proxy only when its PIT vintage is valid.

Post-treatment volume, price, shorting, attention or news may not enter the matching model.

## 5. Treatment-assignment diagnostics

Before outcome access report:
- treated N;
- eligible untreated N;
- covariate missingness;
- treatment propensity support where modeled;
- standardized covariate differences;
- common-support share;
- treated rows outside support;
- untreated rows outside support;
- effective sample size after weighting if weighting is later used.

No causal outcome estimate is permitted when positivity is structurally violated.

## 6. Endogeneity firewall

Surveillance designation is triggered by unusual market behavior.

Therefore naive treated-vs-untreated return comparison is expected to be confounded by pre-treatment momentum, volatility, liquidity and attention.

L3 only requires that this confounding structure can be represented and replayed.

L3 does NOT establish:
- causal treatment effect;
- valid unconfoundedness;
- valid instrument;
- regression-discontinuity identification;
- alpha.

## 7. Near-threshold challenger

A future stronger identification design may exploit exact rule thresholds only if:
- the assignment criterion is machine-reconstructable under the exact historical rule vintage;
- the running variable is observed without post-treatment leakage;
- no simultaneous alternative criterion determines treatment near the threshold;
- manipulation/sorting tests are possible.

Until those conditions hold:
`RD_IDENTIFICATION_NOT_AUTHORIZED`.

Do not call a threshold rule a regression discontinuity merely because a threshold exists.

## 8. Outcome firewall

The first L3 panel build is outcome-blind.

Allowed outputs:
- treatment/control identities;
- pre-treatment covariates;
- overlap/positivity diagnostics;
- source and clock completeness;
- deterministic panel hash.

Forbidden before panel freeze:
- future return;
- MFE/MAE;
- post-treatment turnover;
- treatment-effect estimate;
- winner/loser label.

## 9. Deterministic panel identity

Panel hash must depend on:
- treatment-family version;
- rule-vintage version;
- universe receipt hash;
- treatment receipt hashes;
- untreated-pool receipt hash;
- pre-treatment covariate source hashes;
- inclusion/exclusion ledger;
- matching/weighting specification version if used.

Changing any parent changes panel hash.

## 10. L3 acceptance tests

### CAUS-T01
Real official treatment receipt + real same-cut eligible untreated pool -> panel builds.

### CAUS-T02
Treated rows only / no untreated pool -> fail.

### CAUS-T03
Current membership used to backfill historical untreated pool -> fail.

### CAUS-T04
Post-treatment covariate -> fail.

### CAUS-T05
Future-treated controls removed using hindsight -> fail.

### CAUS-T06
Missing exclusion reason -> fail.

### CAUS-T07
ATTENTION and DISPOSITION silently pooled -> fail.

### CAUS-T08
Rule vintage unknown -> fail.

### CAUS-T09
Common support empty for treated rows -> panel may be descriptive but causal-estimationEligible=false.

### CAUS-T10
Same immutable inputs -> identical panel hash.

### CAUS-T11
Treatment source row changes -> panel hash changes.

### CAUS-T12
Outcome fields present before panel freeze -> fail.

## 11. Promotion decision

This contract alone does not promote D16-20.

D16-20 remains L2/40 until one real Taiwan panel passes CAUS-T01~T12 with:
- official treatment;
- same-cut untreated eligible population;
- PIT pre-treatment covariates;
- deterministic replay.

Once that exists, L3 means causal-data feasibility only, not causal effect validity.

## Exact next

1. DATA/owner lane emits one genuine same-cut TWSE eligible-universe + Attention or Disposition treatment receipt.
2. Preserve every untreated and excluded symbol with reason.
3. Room11 runs the frozen panel acceptance suite before outcome access.
4. If PASS, promote D16-20 to L3.
