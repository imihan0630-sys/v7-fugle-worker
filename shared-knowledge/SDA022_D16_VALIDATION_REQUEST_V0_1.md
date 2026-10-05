# SDA-022 D16 Validation Request V0.1

Updated: 2026-10-06 Asia/Taipei
Status: AUDIT_VALIDATION_REQUEST / OUTCOMES_CLOSED
Owner: 00｜研究總控／稽核
Validator: 11｜D16 統計驗證／策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Ask D16 to preregister a dependence/incrementality evaluation for System1 vs System2 before cross-system outcome interpretation.

This file is not a statistical result and does not open outcomes.

## Primary audit questions

Q1 — Physical decision independence
Can at least one System2 strategy generate candidates/decisions when System1 Top6/rank outputs are unavailable, while shared raw source receipts remain available?

Q2 — Policy dependence
On comparable decision dates, how much of the two systems' decision path is shared through:
- candidate universe;
- hard gates;
- information roots;
- ranking inputs;
- strategy objective/horizon?

Q3 — Output overlap
What are the prospective:
- selected-set overlap;
- Jaccard overlap;
- System1-only pick rate;
- System2-only pick rate;
- overlap-pick rate;
- common-support rank correlation where rank semantics are comparable?

Q4 — Incremental decision value
Conditional on exact common support and frozen horizons, does System2 provide incremental outcome information beyond System1, and vice versa?

Q5 — Pseudo-confirmation risk
When both systems select the same symbol, is the overlap explained mainly by shared primitives/policies or by materially distinct policy paths?

## Required analysis strata

Do NOT pool all System2 strategies into one artificial strategy.

At minimum analyze separately:
- System2 SHORT_MOMENTUM;
- System2 SWING_GROWTH;
- other strategies only when their source/readiness and ranking semantics are mature enough.

SHORT_MOMENTUM receives special attention because the frozen architecture baseline identifies it as the highest current structural overlap surface with System1.

## Common-support requirements

A comparison date is interpretable only when:
- both relevant policy fingerprints exist;
- candidate-universe provenance exists;
- selected/non-selected/UNKNOWN denominators are preserved;
- missing rows are not silently dropped;
- decision clocks are compatible for the estimand;
- system/strategy versions are frozen;
- outcome horizon is frozen before outcome access.

No selected-only analysis.

## Horizon rule

Do not force one universal horizon across unlike strategies.

Examples:
- System1 vs SHORT_MOMENTUM may have genuinely comparable short horizons such as 1/3/5/10 sessions if preregistered;
- SWING_GROWTH uses longer thesis horizons and must not be judged solely by System1's shortest horizon;
- cross-horizon pooling requires a separately justified estimand.

## Dependence controls

D16 preregistration should account for:
- shared symbols/dates;
- sector clustering;
- Regime clustering;
- shared information roots;
- repeated candidate episodes;
- overlapping forward-return windows;
- multiple strategies / multiple horizons / multiple comparisons;
- missingness/admission selection.

## Outcome groups to preserve

At minimum:
- overlap picks;
- System1-only picks;
- System2-only picks;
- qualified but non-selected candidates where available;
- zero-pick / no-selection dates;
- UNKNOWN/incomplete rows.

Never drop negative or empty cases.

## Metrics before economic outcomes

These may be computed without opening return outcomes:
- candidateUniverseOverlap;
- selectedSetJaccard;
- commonSupportRankCorrelation when semantically valid;
- sharedInformationRootRatio;
- sharedHardGateRatio;
- system2IndependentDiscoveryRate;
- divergenceReason distribution.

No arbitrary pass/fail threshold is frozen in V0.1.

## Economic evaluation

D16 must preregister the exact target before reading outcomes.

Potential families include:
- forward return by strategy-appropriate horizon;
- MFE / MAE;
- hit rate;
- net-cost outcome when execution semantics are applicable;
- incremental calibration / discrimination if probability outputs later exist.

The final target family is D16's preregistration responsibility, not 00's post-hoc choice.

## Forbidden interpretations

- "both systems picked it" => two independent confirmations;
- low overlap => diversification;
- high overlap => failure;
- separate Worker/D1/UI => independent Alpha;
- System2 adding Regime/resonance on top of System1 candidates => independent selector;
- one favorable date => incremental value.

## Closure relationship

D16 may return:
- dependence strongly shared;
- partial incremental evidence;
- insufficient support;
- strategy-specific independence;
- no incremental value;
- UNKNOWN.

D16 does not self-close SDA-022.

Final SDA-022 closure requires 00 readback after:
- machine fingerprints;
- NC-T01 physical proof;
- prospective overlap/divergence receipts;
- D16 preregistered dependence/incrementality evidence.

Outcomes remain CLOSED at this request stage.
