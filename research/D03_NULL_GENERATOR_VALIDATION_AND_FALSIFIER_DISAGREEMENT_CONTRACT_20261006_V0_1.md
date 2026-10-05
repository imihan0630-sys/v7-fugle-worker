# D03 Null-Generator Validation / Falsifier Disagreement Contract V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-853~920
Status: RESEARCH_ONLY / OUTCOME_CLOSED / NULL_VALIDATION_CONTRACT_FROZEN
Formal Core: LOCKED

## Purpose

Validate the null generator itself before using it as evidence about an interaction.

A null generator can fail in two opposite directions:
- UNDER_BREAK: it preserves too much of the target interaction;
- OVER_BREAK: it destroys nuisance/market structure and creates an artificially easy null.

Promotion-grade falsification requires both target-break and nuisance-preservation evidence.

## TI-921 — null-generator validation is outcome-blind

Primary null-generator validation uses:
- predictor/root data;
- support/admission structure;
- timing/continuity;
- synthetic benchmark truth where applicable.

It does not choose the generator based on the target economic outcome.

Any target-outcome-driven null-generator tuning enters method-selection history and consumes evidence.

## TI-922 — target-break and nuisance-preservation are separate gates

Required:
`targetRelationBreakPass = true`
AND
`nuisancePreservationPass = true`.

A generator that passes only one side is invalid.

States:
- TARGET_RELATION_NOT_BROKEN;
- NUISANCE_STRUCTURE_OVERBROKEN;
- NULL_GENERATOR_READY.

## TI-923 — preservation vector is root/claim specific

Potential preservation axes include:
- component marginal distribution;
- conditional distribution versus registered controls;
- date composition;
- sector/industry composition;
- regime composition;
- liquidity/size composition;
- serial autocorrelation;
- volatility clustering;
- cross-sectional covariance/common-shock structure;
- repeated-symbol persistence;
- support/admission denominator;
- missingness;
- continuity/source-version;
- market-mechanics constraints.

Not every axis applies to every null, but applicability is frozen before target outcome interpretation.

## TI-924 — no single distance metric validates the null generator

A small marginal KS/Wasserstein distance does not prove correct dependence structure.
A matching autocorrelation does not prove correct cross-sectional or conditional structure.
A balanced sector table does not prove valid time dependence.

The receipt reports a validation vector, not one scalar "null quality" score.

## TI-925 — target-break diagnostic must match the interaction null

For a residual interaction claim, target break is not "make X and Z completely independent."

The diagnostic should verify that the specific residual/joint relation being tested has been removed or sufficiently neutralized under the declared null while main-effect/nuisance structure remains.

The exact diagnostic belongs to D16 and must be preregistered.

## TI-926 — same-root surrogate validation requires descendant feasibility

For same-root technical indicators, validate that surrogate primitive paths:
- produce legal descendants;
- preserve required continuity/state construction;
- reproduce declared marginal/path properties;
- do not leak the original interaction through deterministic reconstruction when the null intends to break it.

If target interaction cannot be broken while preserving required primitive structure:
`NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY`.

That is a valid methodological block.

## TI-927 — conditional null validation is conditional, not marginal

For conditional permutation/randomization, validate X|Z rather than only marginal X.

Required candidate diagnostics may include:
- conditional calibration;
- residual diagnostics;
- support overlap;
- predictive distribution checks;
- subgroup calibration by date/sector/regime/liquidity where relevant;
- sensitivity to conditional-model misspecification.

Good marginal fit with poor X|Z fit is not sufficient.

## TI-928 — conditional null misspecification sensitivity is mandatory

Because conditional permutation/randomization validity can degrade when X|Z is misspecified, D16 must freeze at least one misspecification sensitivity.

If conclusions depend materially on a single fragile conditional sampler:
`CONDITIONAL_NULL_MODEL_FRAGILE`.

No standalone third-unit promotion.

## TI-929 — temporal surrogate validation must test both local dependence and nonstationarity

For time/block/phase surrogate families, verify as applicable:
- autocorrelation/lags;
- spectrum;
- volatility clustering;
- local mean/variance;
- regime/segment boundaries;
- calendar gaps;
- structural/version breaks.

Preserving a global spectrum while erasing local regime structure can still be over-breaking.

## TI-930 — cross-sectional nulls preserve common shocks where not targeted

A cross-sectional interaction null should not erase the same-date market shock unless that shock is explicitly part of the target relation.

Required diagnostics may include:
- date-level mean/dispersion;
- cross-sectional covariance or factor exposure;
- sector/regime occupancy;
- date-panel size/admission.

## TI-931 — null support cannot improve artificially

A null generator may not create materially easier support than observed:
- fill sparse cells with synthetic mass;
- eliminate missingness;
- remove price-limit/halt constraints;
- reduce concentration;
- increase eligible dates

unless the null estimand explicitly changes and the change is disclosed.

Artificial support improvement can make the null too easy or incomparable.

## TI-932 — null support cannot degrade selectively either

Conversely, a generator that makes null candidates systematically less admissible, more costly or more concentrated can also favor the observed interaction.

Observed/null denominator and support diagnostics must be symmetric.

## TI-933 — synthetic benchmark calibration is method evidence, not market evidence

D16 may validate a null generator on synthetic data with:
- known no-interaction truth;
- known injected interaction;
- market-like dependence.

This can assess:
- type-I behavior;
- target-break success;
- power/sensitivity;
- software correctness.

It does not count as Taiwan-stock alpha or prospective evidence.

## TI-934 — a powerless falsifier cannot establish strong absence claims

If a falsifier has insufficient ability to distinguish known injected interaction from its null under synthetic calibration:
`FALSIFIER_POWER_INSUFFICIENT`.

Passing/ failing such a falsifier must be interpreted cautiously.

Promotion requires a primary falsifier with method-appropriate sensitivity evidence.

## TI-935 — primary and secondary falsifiers have frozen roles

Before target outcome interpretation:
- one PRIMARY falsifier is designated;
- secondary falsifiers are SENSITIVITY;
- each null claim is explicit;
- disagreement interpretation is frozen.

The primary method cannot be swapped after seeing which result is favorable.

## TI-936 — same-null disagreement is a blocking inconsistency

If two independently admissible falsifiers claim to test materially the same null but give incompatible conclusions:
`SAME_NULL_FALSIFIER_CONTRADICTION`.

Required response:
- audit assumptions/implementation;
- keep third-unit promotion blocked;
- do not pick the preferred result.

## TI-937 — different-null disagreement narrows interpretation

If falsifiers target legitimately different nulls, disagreement may be scientifically informative.

Example:
- conditional permutation rejects residual independence;
- temporal-shift placebo does not reject alignment dependence.

Conclusion must remain null-specific.
No omnibus "all falsifiers passed" statement is allowed.

## TI-938 — validity and power are distinct

A null test can be:
- valid but low power;
- invalid but apparently powerful;
- valid and informative;
- heuristic only.

Machine receipts separately report:
- validity state;
- sensitivity/power state;
- result state.

A low p-value from an invalid null does not outrank a valid inconclusive method.

## TI-939 — null generator drift requires revalidation

Any change in:
- sampler;
- block scheme;
- conditioning set;
- path surrogate;
- support rule;
- factor DAG;
- continuity/version semantics;
- RNG/resampling policy

creates a new null-generator version and invalidates inherited validation until rechecked.

## TI-940 — current decision

Frozen:
`NULL_GENERATOR_ACCEPTANCE = TARGET_BREAK_AND_NUISANCE_PRESERVATION_DUAL_GATE`.

No current empirical D03 interaction falsifier is approved because outcomes remain closed and no genuine null-generator receipt exists.

No maturity change.

## Exact next continuation point

1. Freeze machine null-validation receipt and adversarial cases for under-break, over-break, conditional misspecification, support inflation/degradation and falsifier contradiction.
2. Bind null-generator version to the pipeline-level null replay contract.
3. Then consolidate TI-853~940 into a future D16 handoff delta without reopening TI-005/TI-006 outcomes.
