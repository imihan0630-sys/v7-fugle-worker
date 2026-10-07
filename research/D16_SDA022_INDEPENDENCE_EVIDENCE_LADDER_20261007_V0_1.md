# D16 SDA-022 Cross-System Independence Evidence Ladder 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / PRE_OUTCOME_EVIDENCE_LADDER_FROZEN
Owner room: 11｜統計驗證與策略市場狀態研究室
Ticket: SDA-022
Formal Core impact: NONE
Outcomes: CLOSED

## Purpose

Prevent one layer of "independence" from being promoted into a stronger claim.

SDA-022 must keep these four concepts separate:
1. static dependency independence;
2. physical execution independence;
3. statistical incremental information;
4. portfolio diversification.

Passing an earlier layer does not imply a later layer.

## Layer A — static dependency independence

Question:
Does the audited code path visibly import, call or reconstruct System1 Top6/rank/selected output?

Evidence examples:
- dependency graph;
- source import scan;
- exact blob hashes;
- forbidden marker scan;
- explicit negative dependency guards.

Current evidence:
`S2_STAGE1_NCT01_HIDDEN_SYSTEM1_DEPENDENCY_STATIC_AUDIT_V0_1`
found no bound-scope static System1 Top6/rank dependency.

Allowed conclusion:
`NO_STATIC_SYSTEM1_TOP6_OR_RANK_DEPENDENCY_FOUND_IN_BOUND_SCOPE`.

Forbidden conclusions:
- physical independence proven;
- runtime cache fallback impossible;
- System2 adds predictive information;
- System2 diversifies System1.

Static source inspection cannot observe environment/runtime/cache state.

## Layer B — physical execution independence

Question:
Can at least one real System2 strategy path execute from its own required inputs when System1 Top6/rank are unavailable?

Canonical test:
NC-T01 / S22-T11~T16.

Required:
- real official A1/PIT history;
- real strategy assessor execution;
- explicit System1 Top6/rank unavailable;
- hidden fallback audit;
- exact strategy/source/decision-clock lineage;
- candidate-generation execution;
- legitimate zero-pick separated from missing data/runtime failure;
- immutable receipt.

Current state:
input layer physically READY on 2026-10-07;
strategy execution itself still pending.

Allowed conclusion after NC-T01 PASS:
`PHYSICALLY_INDEPENDENT_DISCOVERY_PATH_OBSERVED`.

Still forbidden:
- statistically independent systems;
- incremental predictive value;
- diversification.

## Layer C — statistical incremental information

Question:
Conditional on System1 policy state and common-support information available at the same cutoff, does SHORT_MOMENTUM add predictive information for the preregistered D5 target?

Canonical experiment:
`D16-SDA022-01`.

Primary target:
`SDA022_S1_SM_D5_REFERENCE_CLOSE_POSITIVE_V0_1`.

Primary estimand:
`DATE_BALANCED_BRIER_LOSS_IMPROVEMENT`.

Comparison:
- baseline = System1 policy state;
- augmented = baseline + SHORT_MOMENTUM pre-outcome strategy state.

Required before outcomes:
- both policy fingerprints;
- NC-T01 physical proof;
- prospective pair receipts;
- common information cutoff;
- frozen model method;
- frozen effect target / precision target;
- frozen stopping rule;
- valid SDA-016 consumption state.

Statistical dependence remains possible even if Layer B passes because both systems may share:
- raw price/volume;
- factor roots;
- dates/regimes;
- market shocks.

Therefore physical independence != statistical independence.

## Layer D — portfolio diversification

Question:
When both systems are translated into aligned investable exposures, does the combined portfolio improve risk-adjusted outcome or downside dependence after equalized costs/exposure rules?

Requires a separate preregistered portfolio experiment:
- aligned return streams;
- comparable exposure;
- cost parity;
- capital allocation rule;
- drawdown/tail co-movement;
- correlation under multiple Regime episodes;
- opportunity-cost accounting.

Pick-set Jaccard is not diversification.
Different stock names are not diversification.
Low rank correlation is not diversification.

Layer C predictive incrementality also does not automatically prove Layer D.

## Cross-layer forbidden promotions

A static pass cannot be reported as:
"System2 is independent."

A physical NC-T01 pass can be reported only as:
"an independently executable discovery path was observed."

A positive D5 incremental Brier result can be reported only as:
"predictive incrementality for the preregistered target/population."

A diversification claim requires separate portfolio evidence.

## Same-pick interpretation

If both systems select the same stock:
- this is OVERLAP;
- not duplicate confirmation by default;
- not a failure of architectural independence by itself.

The correct next question is whether:
- policy fingerprints differ;
- information roots overlap;
- one system consumed the other's output;
- the second system contributes incremental predictive information.

## Divergent-pick interpretation

If the systems choose different stocks:
- this is DIVERGENCE;
- not evidence of diversification by itself.

Divergence can be caused by:
- different objectives;
- different horizons;
- different universes;
- missingness;
- capacity;
- lifecycle;
- unrelated errors.

## Current evidence state

Layer A:
PARTIAL STATIC PASS for the bounded SHORT_MOMENTUM runtime path.

Layer B:
PENDING physical NC-T01 execution.

Layer C:
PRE-OUTCOME PREREGISTERED; outcome inference CLOSED.

Layer D:
NOT OPENED.

## Relation to current System2 evidence

2026-10-07 input seed:
- real A1 ordinary symbols = 1,973;
- same-date exact-date official fallback succeeded;
- prospective PIT history readback verified;
- preflight capacity authorization true;
- System1 runtime use false;
- strategy assessment not executed.

Therefore the seed strengthens Layer B readiness but does not itself satisfy Layer B.

## Maturity decision

No D16 maturity change.

This artifact closes a semantic promotion gap but creates no economic outcome evidence.

## Exact next continuation

1. Validate merged-main System2 fingerprints when S22-T06~T10 become canonical.
2. Validate the first real NC-T01 receipt at Layer B only.
3. Do not open Layer C outcomes until the remaining D16 gates are frozen.
4. Never let Layer A/B PASS language be rewritten as Alpha/diversification language.
