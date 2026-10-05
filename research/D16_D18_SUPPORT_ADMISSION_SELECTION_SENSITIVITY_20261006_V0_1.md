# D16 / D18｜Support-Admission Selection Sensitivity and Effective Replication Unit Audit — 2026-10-06 V0.1

Status: RESEARCH_ONLY / SPEC_FROZEN / NO_MATURITY_CHANGE
Owner: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Parent main SHA: 8f67b8ed23177ff9f0faadf594e9cf7ba9b30bbe

## 1. Research question

When prospective evidence is missing, delayed, readback-pending, capture-disabled, source-blocked, or only partially admissible, can the surviving complete cases be treated as representative evidence for D16 validation or D18 Regime × Strategy policy evaluation?

Answer: not by default.

The admissibility mechanism can itself depend on pre-outcome market state, source/version, liquidity, candidate count, policy state, capture availability, or operational stress. Complete-case-only analysis can therefore select an easier subset and create false robustness even when no outcome is directly used in the admission rule.

## 2. Frozen admission strata

Every prospective decision opportunity must remain in a frozen denominator ledger and receive exactly one decision-time admission state:
- PROSPECTIVE_ADMISSIBLE
- READBACK_PENDING
- INELIGIBLE_PARENT_MISSING
- INELIGIBLE_CAPTURE_DISABLED
- RETROSPECTIVE_ONLY
- UNKNOWN_ADMISSIBILITY
- SOURCE_BLOCKED
- DATA_BLOCKED

UNKNOWN is never coerced to BAD, zero return, zero pick, or policy failure.

For sensitivity reporting, admission/missingness must be cross-tabulated by only pre-outcome variables that were known at decision time, including:
- Regime state and vector version;
- price pool / liquidity stratum;
- source/runtime version;
- candidate-count band;
- strategy/policy state;
- capture path;
- calendar/session segment.

Outcome-derived strata are forbidden.

## 3. Support/admission selection sensitivity

Primary report:
1. full frozen opportunity denominator N;
2. count and rate by admission state;
3. admissibility rate by each pre-outcome stratum;
4. paired baseline/challenger support rate;
5. label-maturity rate conditional on frozen prediction;
6. cost-known rate conditional on matured outcome;
7. maximum/minimum stratum admissibility gap;
8. whether excluded/unknown observations cluster in specific Regime states or source versions.

If admissibility materially differs by Regime or policy state, complete-case performance is descriptive only until selection sensitivity is resolved.

No inverse-probability weighting or imputation is authorized by this audit. Those would require a separately preregistered missingness model and cannot be chosen after seeing economic outcomes.

## 4. Effective replication unit

Raw stock rows, strategy sleeves, and mechanically split Regime episodes are not independent replication units.

Frozen hierarchy:
- row: descriptive micro-observation only;
- decision date: primary repeated decision unit when same-date common shocks exist;
- structural episode: contiguous economically coherent Regime path under frozen state semantics;
- replication episode: a structural episode that is not merely a source/version/UNKNOWN-gap fragment and provides a genuinely distinct recurrence of the state;
- outcome-information footprint: primitive future sessions consumed by a target horizon;
- effective replication unit: the smaller credible information count after accounting for decision-date dependence, replication episodes, and overlapping outcome footprints.

Promotion evidence must report all counts rather than selecting whichever denominator is largest.

## 5. Episode fragmentation firewall

A source outage, vector-version boundary, one-day UNKNOWN gap, or capture restart may split machine episode identity for replay safety, but does not automatically create a new economic replication.

Therefore:
- structural episode count may exceed replication episode count;
- mechanical fragments are retained for provenance but contribute zero new replication credit;
- active episodes are right-censored;
- future final episode duration may not be used to filter current decisions;
- transition-crossing target horizons remain in the primary decision-state-conditional estimand and are flagged rather than retrospectively removed.

## 6. Outcome-footprint dependence

Two distinct decision dates can consume overlapping future sessions under D+N outcomes. Fresh date IDs therefore do not prove fresh information.

For each target family freeze:
- primitive future-session footprint;
- overlap graph or equivalent overlap accounting;
- preregistered purge/embargo rule where required;
- joint family identity for multiple horizons.

A Regime episode with many decisions but nearly identical future-session footprints can add operational observations without adding equivalent independent evidence.

## 7. Falsification / alternative explanations

The apparent D16/D18 effect is weakened if:
- admissible cases are concentrated in easier Regime/source/liquidity strata;
- READBACK_PENDING or DATA_BLOCKED cases concentrate in adverse states;
- complete-case performance disappears under worst-stratum or bounded sensitivity;
- many structural episodes collapse to one replication episode after removing mechanical fragmentation;
- effective evidence collapses after outcome-footprint overlap accounting;
- one replication episode dominates sign or magnitude;
- results require retrospective reconstruction to restore missing prospective cases.

Alternative explanations to preserve:
- capture reliability rather than strategy skill;
- source availability rather than economic state;
- lower volatility/liquidity stress in admissible cases;
- version rollout timing;
- label/cost maturity delay;
- operational recovery that is correlated with market conditions.

## 8. Failure conditions

No promotion when any is true:
- admission mechanism cannot be reconstructed from decision-time receipts;
- UNKNOWN is silently dropped;
- retrospective reconstruction is counted prospective;
- mechanical fragments inflate episode N;
- support differs materially across Regime states without bounded sensitivity;
- primary result depends on a single replication episode;
- outcome-footprint overlap is unknown;
- baseline/challenger common support is not preserved.

## 9. System impact

This audit changes no Formal rule, threshold, Regime definition, strategy weight, ranking, capital, execution, monitoring, or production behavior.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## 10. Exact next continuation point

1. On latest main, check whether SDA-016 shared consumption/overlap authority or SDA-017 episode/support observer has landed.
2. If landed, revalidate only pending/new V0.2 oracle items; do not redo accepted semantics.
3. If not landed, apply this frozen admission-sensitivity/effective-replication specification to the first genuine prospective C1 and D18 receipts when available.
4. Require frozen opportunity denominators before complete-case summaries.
5. Do not use retrospective reconstruction, inverse-probability weighting, imputation, or episode fragmentation to manufacture maturity.
6. D16 remains 60%; D18 remains 52% until genuine evidence satisfies existing gates.
